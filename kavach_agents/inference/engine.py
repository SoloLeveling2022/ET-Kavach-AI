# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | kavach_agents | inference/engine.py
#
# ONNX CPU inference engine for wav2vec2 (Phoneme) and Whisper (Hermes).
# Falls back gracefully if model files are not present.
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import logging
import os
from typing import Optional

import numpy as np

logger = logging.getLogger(__name__)


class InferenceEngine:
    """
    Thin wrapper around onnxruntime sessions for the two ML models:
      - wav2vec2_int8.onnx  → Phoneme stress scoring
      - whisper_tiny_int8.onnx → Hermes ASR transcription
    If model files don't exist, has_* flags are False and
    agents fall back to heuristic algorithms automatically.
    """

    def __init__(
        self,
        wav2vec2_path: str,
        whisper_path:  str,
    ) -> None:
        self.has_wav2vec2 = False
        self.has_whisper  = False
        self._phoneme_sess = None
        self._whisper_sess = None

        try:
            import onnxruntime as ort
            ort.set_default_logger_severity(3)  # suppress verbose output

            if os.path.isfile(wav2vec2_path):
                self._phoneme_sess = ort.InferenceSession(
                    wav2vec2_path,
                    providers=["CPUExecutionProvider"],
                )
                self.has_wav2vec2 = True
                logger.info("✅ Loaded wav2vec2 ONNX model from %s", wav2vec2_path)
            else:
                logger.warning(
                    "wav2vec2 model not found at '%s' — using FFT heuristic", wav2vec2_path
                )

            if os.path.isfile(whisper_path):
                self._whisper_sess = ort.InferenceSession(
                    whisper_path,
                    providers=["CPUExecutionProvider"],
                )
                self.has_whisper = True
                logger.info("✅ Loaded Whisper ONNX model from %s", whisper_path)
            else:
                logger.warning(
                    "Whisper model not found at '%s' — using energy heuristic", whisper_path
                )

        except ImportError:
            logger.warning("onnxruntime not installed — all agents using heuristic fallbacks")
        except Exception as exc:
            logger.error("InferenceEngine init error: %s", exc)

    def run_phoneme(self, audio: np.ndarray) -> float:
        """Run wav2vec2 on 16kHz float32 audio, return stress score [0,1]."""
        if self._phoneme_sess is None:
            return 0.0
        try:
            # wav2vec2 expects [batch=1, sequence] float32
            inp = audio.reshape(1, -1).astype(np.float32)
            out = self._phoneme_sess.run(None, {"input_values": inp})
            # Assume model outputs logit stress score at index 0
            logit = float(out[0].flatten()[0])
            return float(1.0 / (1.0 + np.exp(-logit)))  # sigmoid
        except Exception as exc:
            logger.error("Phoneme ONNX inference error: %s", exc)
            return 0.0

    def run_whisper(self, audio: np.ndarray) -> str:
        """Run Whisper on 16kHz float32 audio, return transcript string."""
        if self._whisper_sess is None:
            return ""
        try:
            inp = audio.reshape(1, -1).astype(np.float32)
            out = self._whisper_sess.run(None, {"audio": inp})
            tokens = out[0].flatten().tolist()
            # Crude token-to-string (real Whisper needs tokenizer)
            return " ".join(str(t) for t in tokens[:50])
        except Exception as exc:
            logger.error("Whisper ONNX inference error: %s", exc)
            return ""

    @classmethod
    def load(cls, wav2vec2_path: str, whisper_path: str) -> "InferenceEngine":
        return cls(wav2vec2_path, whisper_path)
