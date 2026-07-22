# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | kavach_gateway | config.py
# ─────────────────────────────────────────────────────────────────────────────

import os
from dataclasses import dataclass, field
from pathlib import Path
from dotenv import load_dotenv

# Always load the .env from THIS file's directory, regardless of CWD
_ENV_PATH = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=_ENV_PATH, override=True)


def _env(key: str, default: str = "") -> str:
    """Read env var, strip whitespace/CRLF artifacts."""
    return os.environ.get(key, default).strip()


@dataclass
class AppConfig:
    # Server
    server_host: str = field(default_factory=lambda: _env("KAVACH_BIND", "0.0.0.0"))
    server_port: int = field(default_factory=lambda: int(_env("KAVACH_PORT", "8080")))

    # Database URLs
    redis_url: str = field(default_factory=lambda: _env(
        "REDIS_URL", "redis://127.0.0.1:6379"
    ))
    database_url: str = field(default_factory=lambda: _env(
        "DATABASE_URL", "postgresql://postgres:postgres@127.0.0.1:5432/kavach_db"
    ))

    # Neo4j
    neo4j_uri: str = field(default_factory=lambda: _env("NEO4J_URI", "bolt://localhost:7687"))
    neo4j_user: str = field(default_factory=lambda: _env("NEO4J_USER", "neo4j"))
    neo4j_pass: str = field(default_factory=lambda: _env("NEO4J_PASS", ""))
    neo4j_database: str = field(default_factory=lambda: _env("NEO4J_DATABASE", "neo4j"))

    # Agent interdiction budget
    interdiction_budget_ms: int = field(
        default_factory=lambda: int(_env("INTERDICTION_BUDGET_MS", "7200"))
    )
    threat_fire_threshold: float = field(
        default_factory=lambda: float(_env("THREAT_FIRE_THRESHOLD", "0.75"))
    )

    # Webhook URLs
    core_banking_webhook: str = field(
        default_factory=lambda: _env("CORE_BANKING_WEBHOOK", "http://localhost:9001/api/freeze")
    )
    sip_termination_webhook: str = field(
        default_factory=lambda: _env("SIP_TERMINATION_WEBHOOK", "http://localhost:9002/api/terminate")
    )

    # Logging
    log_level: str = field(default_factory=lambda: _env("RUST_LOG", "info").upper())

    @property
    def server_bind(self) -> str:
        return f"{self.server_host}:{self.server_port}"


# Singleton instance
config = AppConfig()
