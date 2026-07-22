# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | kavach_agents | agents/veritas.py
#
# Veritas Agent — Liveness & Virtual Camera Detection
# Checks camera device label for virtual/injected stream drivers,
# and computes reflectance-based liveness score from session state.
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import json
import logging
import uuid
from typing import Optional, TYPE_CHECKING

from kavach_agents.mcp_protocol import AGENT_VERITAS, McpFrame, session_key

if TYPE_CHECKING:
    import redis.asyncio as aioredis

logger = logging.getLogger(__name__)

# Identical to the gateway-side virtual camera blocklist
VIRTUAL_CAMERA_LABELS = frozenset([
    "obs", "virtual", "v4l2loopback", "sparko", "manycam",
    "xsplit", "droidcam", "epoccam",
])

# Liveness reflectance threshold Θ_liveness
DEFAULT_LIVENESS_THRESHOLD = 0.012


class VeritasAgent:
    """
    Two-gate liveness check:
      Gate 1: Virtual camera driver label → instant high score
      Gate 2: rPPG reflectance variance from session metadata
    """

    @staticmethod
    async def run(
        session_id:         uuid.UUID,
        redis:              "aioredis.Redis",
        camera_label:       Optional[str] = None,
        liveness_threshold: float = DEFAULT_LIVENESS_THRESHOLD,
    ) -> McpFrame:
        try:
            # Read session state from Redis if camera_label not pre-fetched
            if camera_label is None:
                raw = await redis.get(session_key(session_id))
                if raw:
                    try:
                        parsed = json.loads(raw)
                        camera_label = (
                            parsed.get("device_info", {}).get("camera_device_label") or ""
                        )
                    except Exception:
                        camera_label = ""

            camera_label_lower = (camera_label or "").lower()

            # Gate 1: Virtual camera driver check
            virtual_match = next(
                (label for label in VIRTUAL_CAMERA_LABELS if label in camera_label_lower),
                None,
            )
            if virtual_match:
                logger.warning(
                    "Veritas | session=%s VIRTUAL CAMERA detected: '%s'",
                    session_id, camera_label,
                )
                return McpFrame.build(
                    session_id=session_id,
                    agent=AGENT_VERITAS,
                    score=0.95,
                    verdict="virtual_camera_injected",
                    diagnostics={
                        "camera_label": camera_label,
                        "matched_label": virtual_match,
                        "gate": 1,
                    },
                )

            # Gate 2: Liveness reflectance heuristic
            # In production: reads rPPG frame data from Redis banknote/face frame buffer
            # Here: use gyro jitter as proxy for liveness (static objects have 0 variance)
            gyro_key = f"kavach:gyro_pool:{session_id}"
            samples: list[str] = await redis.lrange(gyro_key, 0, -1)

            reflectance_variance = _compute_gyro_proxy_liveness(samples)
            liveness_score = (
                0.0 if reflectance_variance >= liveness_threshold
                else (1.0 - reflectance_variance / liveness_threshold) * 0.4
            )

            verdict = "liveness_fail" if liveness_score >= 0.35 else "liveness_pass"
            logger.debug(
                "Veritas | session=%s score=%.4f refl_var=%.6f label='%s'",
                session_id, liveness_score, reflectance_variance, camera_label,
            )

            return McpFrame.build(
                session_id=session_id,
                agent=AGENT_VERITAS,
                score=liveness_score,
                verdict=verdict,
                diagnostics={
                    "camera_label":         camera_label,
                    "reflectance_variance": reflectance_variance,
                    "liveness_threshold":   liveness_threshold,
                    "gate": 2,
                },
            )

        except Exception as exc:
            logger.error("VeritasAgent error for session %s: %s", session_id, exc)
            return McpFrame.build(session_id, AGENT_VERITAS, 0.0, "error",
                                  {"error": str(exc)})


def _compute_gyro_proxy_liveness(samples: list[str]) -> float:
    """
    Compute variance of gz (yaw) axis as proxy for liveness reflectance.
    Live humans have micro-movement variance; static deepfake sources have ~0.
    Uses Welford's online variance algorithm (same as Rust coordinator).
    """
    import json as _json
    if len(samples) < 2:
        return 0.0

    count = 0
    mean  = 0.0
    m2    = 0.0

    for s in samples:
        try:
            v = _json.loads(s)
            if isinstance(v, list) and len(v) >= 3:
                gz = float(v[2])
                count += 1
                delta  = gz - mean
                mean  += delta / count
                m2    += delta * (gz - mean)
        except Exception:
            continue

    return m2 / (count - 1) if count >= 2 else 0.0
