# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | kavach_agents | config.py
# Mirrors Rust Agents/src/config.rs
# ─────────────────────────────────────────────────────────────────────────────

import os
from dataclasses import dataclass, field
from pathlib import Path
from dotenv import load_dotenv

# Always load the .env from THIS file's directory, regardless of CWD
_ENV_PATH = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=_ENV_PATH, override=True)


def _env(key: str, default: str = "") -> str:
    return os.environ.get(key, default).strip()


@dataclass
class AgentConfig:
    redis_url:               str   = field(default_factory=lambda: _env("REDIS_URL", "redis://127.0.0.1:6379"))
    database_url:            str   = field(default_factory=lambda: _env("DATABASE_URL", "postgresql://postgres:postgres@127.0.0.1:5432/kavach_db"))
    neo4j_uri:               str   = field(default_factory=lambda: _env("NEO4J_URI", "bolt://localhost:7687"))
    neo4j_user:              str   = field(default_factory=lambda: _env("NEO4J_USER", "neo4j"))
    neo4j_pass:              str   = field(default_factory=lambda: _env("NEO4J_PASS", ""))
    # !! CRITICAL: Aura DB uses instance-ID as database name, NOT "neo4j"
    neo4j_database:          str   = field(default_factory=lambda: _env("NEO4J_DATABASE", "004a6827"))
    backend_url:             str   = field(default_factory=lambda: _env("BACKEND_WS_URL", "http://localhost:8080"))
    core_banking_webhook:    str   = field(default_factory=lambda: _env("CORE_BANKING_WEBHOOK", "http://localhost:9001/api/freeze"))
    sip_termination_webhook: str   = field(default_factory=lambda: _env("SIP_TERMINATION_WEBHOOK", "http://localhost:9002/api/terminate"))
    interdiction_budget_ms:  int   = field(default_factory=lambda: int(_env("INTERDICTION_BUDGET_MS", "7200")))
    threat_fire_threshold:   float = field(default_factory=lambda: float(_env("THREAT_FIRE_THRESHOLD", "0.75")))
    wav2vec2_model_path:     str   = field(default_factory=lambda: _env("WAV2VEC2_MODEL_PATH", "models/wav2vec2_int8.onnx"))
    whisper_model_path:      str   = field(default_factory=lambda: _env("WHISPER_MODEL_PATH", "models/whisper_tiny_int8.onnx"))
    liveness_threshold:      float = field(default_factory=lambda: float(_env("LIVENESS_THRESHOLD", "0.012")))
    signing_key_hex:         str   = field(default_factory=lambda: _env(
        "BSA_SIGNING_KEY_HEX",
        "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
    ))
    log_level:               str   = field(default_factory=lambda: _env("RUST_LOG", "info").upper())


config = AgentConfig()
