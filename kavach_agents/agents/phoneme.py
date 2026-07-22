# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | kavach_agents | agents/phoneme.py
#
# Phoneme Agent — Glottal Stress & Voice Coercion Detection
# Reads 16kHz PCM audio ring buffer from Redis, runs ONNX wav2vec2 or
# falls back to FFT-based glottal pulse analysis.
# Score range: [0.0 – 1.0] where 1.0 = maximum stress detected.
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import asyncio
import base64
import logging
import math
import uuid
from typing import TYPE_CHECKING

import numpy as np

from kavach_agents.mcp_protocol import (
    AGENT_PHONEME, McpFrame, audio_ring_key,
)

if TYPE_CHECKING:
    import redis.asyncio as aioredis
    from kavach_agents.inference.engine import InferenceEngine

logger = logging.getLogger(__name__)


class PhonemeAgent:
    """
    Detects glottal stress patterns in voice audio that indicate coercion,
    fear, or scripted/coached responses.

    Algorithm:
        1. Fetch latest audio chunks from Redis ring buffer
        2. Decode base64 PCM → numpy float32 array
        3. If ONNX model available: run wav2vec2 embeddings → stress classifier
        4. Fallback: FFT spectral centroid + glottal pulse irregularity heuristic
        5. Normalise to [0, 1] threat score
    """

    @staticmethod
    async def run(
        session_id: uuid.UUID,
        redis:      "aioredis.Redis",
        engine:     "InferenceEngine | None" = None,
    ) -> McpFrame:
        try:
            ring_key = audio_ring_key(session_id)
            raw_chunks: list[str] = await redis.lrange(ring_key, 0, -1)

            if not raw_chunks:
                return McpFrame.build(
                    session_id=session_id,
                    agent=AGENT_PHONEME,
                    score=0.0,
                    verdict="no_audio",
                    diagnostics={"reason": "empty_ring_buffer"},
                )

            # Decode base64 PCM chunks → concatenated int16 samples
            pcm_arrays = []
            for chunk in raw_chunks:
                try:
                    raw_bytes = base64.b64decode(chunk)
                    arr = np.frombuffer(raw_bytes, dtype=np.int16).astype(np.float32) / 32768.0
                    pcm_arrays.append(arr)
                except Exception:
                    continue

            if not pcm_arrays:
                return McpFrame.build(
                    session_id=session_id,
                    agent=AGENT_PHONEME,
                    score=0.0,
                    verdict="decode_error",
                )

            audio = np.concatenate(pcm_arrays)

            # Try ONNX inference first
            if engine is not None and engine.has_wav2vec2:
                score = await asyncio.get_event_loop().run_in_executor(
                    None, engine.run_phoneme, audio
                )
            else:
                # Fallback: glottal irregularity heuristic via FFT
                score = _glottal_stress_heuristic(audio)

            verdict = _verdict_label(score)
            logger.debug(
                "Phoneme | session=%s score=%.4f verdict=%s chunks=%d",
                session_id, score, verdict, len(raw_chunks),
            )

            return McpFrame.build(
                session_id=session_id,
                agent=AGENT_PHONEME,
                score=score,
                verdict=verdict,
                diagnostics={
                    "chunks_analysed": len(raw_chunks),
                    "audio_samples":   len(audio),
                    "method":          "onnx" if (engine and engine.has_wav2vec2) else "fft_heuristic",
                },
            )

        except Exception as exc:
            logger.error("PhonemeAgent error for session %s: %s", session_id, exc)
            return McpFrame.build(
                session_id=session_id,
                agent=AGENT_PHONEME,
                score=0.0,
                verdict="error",
                diagnostics={"error": str(exc)},
            )


def _glottal_stress_heuristic(audio: np.ndarray) -> float:
    """
    Levinson-Durbin autoregressive pole estimation & phonetic boundary drift.
    Extracts glottal excitation residual e(t) and calculates cosine similarity drift Phi.
    Direct implementation of Blueprint Section 3.1 equation (1).
    """
    if len(audio) < 512:
        return 0.0

    frame_size = 512
    hop_size = 256
    order = 12
    frames_residuals = []

    try:
        from scipy.linalg import solve_toeplitz
        for start in range(0, len(audio) - frame_size, hop_size):
            frame = audio[start:start + frame_size] * np.hanning(frame_size)
            # Compute autocorrelation r
            r = np.correlate(frame, frame, mode='full')
            r = r[len(frame) - 1 : len(frame) - 1 + order + 1]
            if r[0] < 1e-8:
                continue
            # Levinson-Durbin AR pole solve via Toeplitz matrix
            a = solve_toeplitz((r[:-1], r[:-1]), r[1:])
            lpc_filter = np.concatenate(([1.0], -a))
            # Glottal excitation residual e(t)
            e_t = np.convolve(frame, lpc_filter, mode='same')
            frames_residuals.append(e_t)
    except Exception:
        return _spectral_centroid_fallback(audio)

    if len(frames_residuals) < 2:
        return _spectral_centroid_fallback(audio)

    # Calculate frame-to-frame cosine similarity drift Phi
    cosine_sims = []
    for t in range(len(frames_residuals) - 1):
        h_t = frames_residuals[t]
        h_t1 = frames_residuals[t + 1]
        norm_t = float(np.linalg.norm(h_t))
        norm_t1 = float(np.linalg.norm(h_t1))
        if norm_t > 1e-8 and norm_t1 > 1e-8:
            dot = float(np.dot(h_t, h_t1))
            sim = dot / (norm_t * norm_t1)
            cosine_sims.append(sim)

    if not cosine_sims:
        return 0.0

    mean_sim = float(np.mean(cosine_sims))
    drift_score = max(0.0, min((1.0 - mean_sim) * 1.5, 1.0))
    return round(drift_score, 6)


def _spectral_centroid_fallback(audio: np.ndarray) -> float:
    frame_size, hop_size = 512, 256
    centroids = []
    for start in range(0, len(audio) - frame_size, hop_size):
        frame = audio[start:start + frame_size] * np.hanning(frame_size)
        fft = np.abs(np.fft.rfft(frame))
        freqs = np.fft.rfftfreq(frame_size, d=1.0 / 16000)
        denom = fft.sum()
        if denom > 1e-9:
            centroid = (fft * freqs).sum() / denom
            centroids.append(centroid)

    if len(centroids) < 2:
        return 0.0

    variance = float(np.var(np.array(centroids)))
    return round(min(variance / 3_000_000.0, 1.0), 6)


def _verdict_label(score: float) -> str:
    if score < 0.25:  return "normal"
    if score < 0.50:  return "mild_stress"
    if score < 0.75:  return "elevated_stress"
    return "coercion_detected"

