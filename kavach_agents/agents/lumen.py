# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | kavach_agents | agents/lumen.py
#
# Lumen Agent — Banknote Authenticity via Intaglio FFT Colour-Shift Detection
# Reads the banknote frame from Redis, applies FFT-based colour-shift
# analysis to detect photocopied/scanned fake banknotes vs real notes.
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import base64
import logging
import uuid
from typing import TYPE_CHECKING

import numpy as np

from kavach_agents.mcp_protocol import AGENT_LUMEN, McpFrame

if TYPE_CHECKING:
    import redis.asyncio as aioredis

logger = logging.getLogger(__name__)

# Redis key for banknote frame
BANKNOTE_FRAME_KEY_PREFIX = "kavach:banknote_frame:"

# Intaglio reflectance: genuine notes have distinct FFT power in 2–8 line-pair/mm
GENUINE_LPM_LOW  = 2
GENUINE_LPM_HIGH = 8
# Score threshold: low FFT power in genuine band → fake
FAKE_SCORE_THRESHOLD = 0.4


class LumenAgent:
    """
    Currency authenticity scoring:
      1. Read banknote frame (JPEG/PNG bytes, base64) from Redis
      2. Convert to grayscale numpy array
      3. 2D FFT → compute power in intaglio line-pair band
      4. High power in genuine band → low threat score (authentic)
      5. Low power → high threat score (counterfeit)

    Also uses gyro variance as a secondary liveness signal
    (genuine in-person transactions have phone motion; replayed sessions don't).
    """

    @staticmethod
    async def run(
        session_id:    uuid.UUID,
        redis:         "aioredis.Redis",
        gyro_variance: float = 0.0,
    ) -> McpFrame:
        try:
            frame_key = f"{BANKNOTE_FRAME_KEY_PREFIX}{session_id}"
            raw_b64   = await redis.get(frame_key)

            if not raw_b64:
                # No banknote frame captured — neutral score
                return McpFrame.build(
                    session_id=session_id,
                    agent=AGENT_LUMEN,
                    score=0.0,
                    verdict="no_banknote_frame",
                    diagnostics={"reason": "frame_not_found_in_redis"},
                )

            # Decode frame
            try:
                img_bytes = base64.b64decode(raw_b64)
                img_array = _decode_image_to_gray(img_bytes)
            except Exception as e:
                logger.warning("Lumen: image decode error for session %s: %s", session_id, e)
                return McpFrame.build(session_id, AGENT_LUMEN, 0.0, "decode_error")

            # FFT analysis
            fft_score = _intaglio_fft_score(img_array)

            # Gyro liveness bonus: real transactions have phone motion
            # Low gyro variance during banknote scan = suspicious (static/replayed)
            liveness_penalty = 0.1 if gyro_variance < 1e-5 else 0.0

            score   = round(min(fft_score + liveness_penalty, 1.0), 6)
            verdict = _verdict(score)

            logger.debug(
                "Lumen | session=%s score=%.4f fft=%.4f gyro_var=%.6f",
                session_id, score, fft_score, gyro_variance,
            )

            return McpFrame.build(
                session_id=session_id,
                agent=AGENT_LUMEN,
                score=score,
                verdict=verdict,
                diagnostics={
                    "fft_score":     fft_score,
                    "gyro_variance": gyro_variance,
                    "img_shape":     list(img_array.shape),
                },
            )

        except Exception as exc:
            logger.error("LumenAgent error for session %s: %s", session_id, exc)
            return McpFrame.build(session_id, AGENT_LUMEN, 0.0, "error",
                                  {"error": str(exc)})


def _decode_image_to_gray(img_bytes: bytes) -> np.ndarray:
    """Decode JPEG/PNG bytes to grayscale numpy array without OpenCV dependency."""
    try:
        from PIL import Image
        import io
        img = Image.open(io.BytesIO(img_bytes)).convert("L")
        return np.array(img, dtype=np.float32)
    except ImportError:
        # If Pillow not available, treat raw bytes as flat float array
        arr = np.frombuffer(img_bytes, dtype=np.uint8).astype(np.float32)
        side = int(np.sqrt(len(arr)))
        return arr[:side * side].reshape(side, side)


def _intaglio_fft_score(img: np.ndarray) -> float:
    """
    2D FFT colour-shift analysis for intaglio printing detection.
    Genuine banknotes have distinct high-frequency peaks in the 2–8 lp/mm band.
    Score: 0.0 = highly genuine, 1.0 = likely counterfeit.
    """
    if img.size < 64:
        return 0.0

    # 2D FFT magnitude spectrum
    fft2   = np.fft.fft2(img)
    fft2_s = np.fft.fftshift(fft2)
    magnitude = np.abs(fft2_s)

    h, w      = magnitude.shape
    cy, cx    = h // 2, w // 2

    # Radial band corresponding to ~2–8 line-pairs/mm at typical scan resolution
    y_idx, x_idx = np.ogrid[:h, :w]
    r = np.sqrt((x_idx - cx) ** 2 + (y_idx - cy) ** 2)

    band_mask   = (r >= GENUINE_LPM_LOW * 10) & (r <= GENUINE_LPM_HIGH * 10)
    total_mask  = magnitude.sum()
    band_power  = magnitude[band_mask].sum()

    if total_mask < 1e-9:
        return 0.5

    ratio = band_power / total_mask
    # High ratio → genuine (low threat); low ratio → counterfeit (high threat)
    score = max(0.0, 1.0 - ratio * 10.0)
    return round(min(score, 1.0), 6)


def _verdict(score: float) -> str:
    if score < 0.2:  return "genuine"
    if score < 0.5:  return "uncertain"
    if score < 0.75: return "suspicious_banknote"
    return "counterfeit_detected"
