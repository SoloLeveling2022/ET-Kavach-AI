# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | kavach_agents | agents/hermes.py
#
# Hermes Agent — Coercion Phrase & Script Detection (ASR)
# Reads audio buffer, runs Whisper ONNX (or keyword heuristic), detects
# scripted/coercion phrases associated with fraud scenarios.
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import asyncio
import base64
import logging
import uuid
from typing import TYPE_CHECKING

import numpy as np

from kavach_agents.mcp_protocol import AGENT_HERMES, McpFrame, audio_ring_key

if TYPE_CHECKING:
    import redis.asyncio as aioredis
    from kavach_agents.inference.engine import InferenceEngine

logger = logging.getLogger(__name__)

# High-risk phrases associated with vishing / SIM-swap / account takeover fraud
COERCION_PHRASES = [
    "otp", "one time password", "share your screen",
    "remote access", "anydesk", "teamviewer", "verify your account",
    "your account will be blocked", "police", "cyber crime",
    "refund processing", "send money", "gift card",
    "amazon refund", "microsoft support", "rbi officer",
    "income tax", "arrest warrant", "blocked account",
    "share pin", "share password", "bank transfer",
]


class HermesAgent:
    """
    Detects scripted coercion phrases in audio transcription.

    Algorithm:
        1. Fetch audio from Redis ring buffer
        2. If Whisper ONNX available: transcribe → keyword match
        3. Fallback: crude energy-pattern keyword heuristic (length/energy ratio)
        4. Score = fraction of high-risk phrase categories matched
    """

    @staticmethod
    async def run(
        session_id: uuid.UUID,
        redis:      "aioredis.Redis",
        engine:     "InferenceEngine | None" = None,
    ) -> McpFrame:
        try:
            ring_key   = audio_ring_key(session_id)
            raw_chunks: list[str] = await redis.lrange(ring_key, 0, -1)

            if not raw_chunks:
                return McpFrame.build(
                    session_id=session_id,
                    agent=AGENT_HERMES,
                    score=0.0,
                    verdict="no_audio",
                )

            # Decode PCM
            pcm_arrays = []
            for chunk in raw_chunks:
                try:
                    raw_bytes = base64.b64decode(chunk)
                    arr = np.frombuffer(raw_bytes, dtype=np.int16).astype(np.float32) / 32768.0
                    pcm_arrays.append(arr)
                except Exception:
                    continue

            if not pcm_arrays:
                return McpFrame.build(session_id, AGENT_HERMES, 0.0, "decode_error")

            audio = np.concatenate(pcm_arrays)

            if engine is not None and engine.has_whisper:
                transcript = await asyncio.get_event_loop().run_in_executor(
                    None, engine.run_whisper, audio
                )
                matched, score = _score_transcript(transcript)
                method = "whisper_onnx"
            else:
                transcript = ""
                matched, score = _audio_energy_heuristic(audio)
                method = "energy_heuristic"

            verdict = "coercion_detected" if score >= 0.75 else (
                "suspicious" if score >= 0.4 else "clean"
            )

            logger.debug(
                "Hermes | session=%s score=%.4f method=%s matched=%s",
                session_id, score, method, matched,
            )

            return McpFrame.build(
                session_id=session_id,
                agent=AGENT_HERMES,
                score=score,
                verdict=verdict,
                diagnostics={
                    "method":      method,
                    "matched":     matched,
                    "transcript":  transcript[:200] if transcript else None,
                },
            )

        except Exception as exc:
            logger.error("HermesAgent error for session %s: %s", session_id, exc)
            return McpFrame.build(session_id, AGENT_HERMES, 0.0, "error",
                                  {"error": str(exc)})


def _score_transcript(transcript: str) -> tuple[list[str], float]:
    lower = transcript.lower()
    matched = [p for p in COERCION_PHRASES if p in lower]
    score   = min(len(matched) / 4.0, 1.0)  # 4+ matches = max threat
    return matched, round(score, 6)


def _audio_energy_heuristic(audio: np.ndarray) -> tuple[list[str], float]:
    """
    Fallback when no ASR model is available.
    High-energy, long-duration audio from call interactions
    tends to have elevated RMS when coercion-related commands are given.
    Returns conservative score based on audio length and energy.
    """
    rms = float(np.sqrt(np.mean(audio ** 2)))
    duration_s = len(audio) / 16000.0
    # Heuristic: long calls with high energy → slightly elevated score
    score = min(rms * 2.0 + (duration_s / 120.0) * 0.1, 0.5)
    return [], round(score, 6)
