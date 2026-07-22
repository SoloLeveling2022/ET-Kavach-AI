# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | kavach_agents | main.py
#
# Agent Swarm Daemon entrypoint.
# Mirrors Rust Agents/src/main.rs.
#
# Startup sequence:
#   1. Load .env + AgentConfig
#   2. Connect Redis, PostgreSQL, Neo4j
#   3. Load ONNX InferenceEngine (graceful fallback)
#   4. Subscribe to Redis pub/sub channel "kavach:mcp_triggers"
#   5. For each trigger: spawn asyncio.Task → Coordinator.run()
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import asyncio
import logging
import sys
import uuid

import httpx
import redis.asyncio as aioredis
import structlog

from kavach_agents.config import config
from kavach_agents.coordinator import Coordinator
from kavach_agents.inference.engine import InferenceEngine

# ── Structured logging ────────────────────────────────────────────────────────
structlog.configure(
    processors=[
        structlog.stdlib.add_log_level,
        structlog.stdlib.add_logger_name,
        structlog.dev.ConsoleRenderer(),
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    logger_factory=structlog.stdlib.LoggerFactory(),
)
logging.basicConfig(level=getattr(logging, config.log_level, logging.INFO))
logger = logging.getLogger(__name__)


async def _connect_postgres(database_url: str):
    """Connect asyncpg pool; return None on failure (non-fatal for hackathon demo)."""
    try:
        import asyncpg
        # Strip sslaccept param not recognized by asyncpg (sqlx-specific)
        clean_url = database_url.replace("&sslaccept=accept_invalid_certs", "")
        pool = await asyncpg.create_pool(
            dsn=clean_url,
            min_size=1,
            max_size=5,
            ssl="require",
        )
        logger.info("✅ PostgreSQL pool connected")
        return pool
    except Exception as exc:
        logger.warning("PostgreSQL unavailable (%s) — agents will skip DB queries", exc)
        return None


async def _connect_neo4j(uri: str, user: str, password: str, database: str):
    """Connect Neo4j async driver; return None on failure."""
    try:
        from neo4j import AsyncGraphDatabase
        driver = AsyncGraphDatabase.driver(uri, auth=(user, password))
        # Verify connectivity
        async with driver.session(database=database) as sess:
            await sess.run("RETURN 1")
        logger.info("✅ Neo4j driver connected to database '%s'", database)
        return driver
    except Exception as exc:
        logger.warning("Neo4j unavailable (%s) — Nexus agent will skip graph queries", exc)
        return None


async def _connect_redis(url: str) -> aioredis.Redis:
    client = aioredis.from_url(url, decode_responses=True, max_connections=10)
    await client.ping()
    logger.info("✅ Redis connected at %s", url)
    return client


async def main() -> None:
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    logger.info("  🛡️  Kavach-AI Agent Swarm Daemon v0.1.0")
    logger.info("  Interdiction Budget: %d ms", config.interdiction_budget_ms)
    logger.info("  Redis URL:           %s", config.redis_url)
    logger.info("  Neo4j URI:           %s", config.neo4j_uri)
    logger.info("  Neo4j Database:      %s", config.neo4j_database)
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    # ── 1. Connect databases ──────────────────────────────────────────────────
    try:
        redis_client = await _connect_redis(config.redis_url)
    except Exception as exc:
        logger.error("Fatal: cannot connect to Redis: %s", exc)
        sys.exit(1)

    pool         = await _connect_postgres(config.database_url)
    neo4j_driver = await _connect_neo4j(
        config.neo4j_uri, config.neo4j_user, config.neo4j_pass, config.neo4j_database
    )

    # ── 2. Load ONNX models ───────────────────────────────────────────────────
    engine = InferenceEngine.load(config.wav2vec2_model_path, config.whisper_model_path)

    # ── 3. Build coordinator + HTTP client ────────────────────────────────────
    http_client = httpx.AsyncClient(timeout=5.0)
    coordinator = Coordinator(
        config=config,
        pool=pool,
        neo4j_driver=neo4j_driver,
        http_client=http_client,
        engine=engine,
    )

    # ── 4. Subscribe to Redis pub/sub trigger channel ─────────────────────────
    pubsub = redis_client.pubsub()
    await pubsub.subscribe("kavach:mcp_triggers")
    logger.info("✅ Swarm Daemon operational — listening on 'kavach:mcp_triggers'")

    # ── 5. Event loop — process triggers ─────────────────────────────────────
    async def handle_trigger(session_id_str: str) -> None:
        try:
            session_id = uuid.UUID(session_id_str.strip())
        except ValueError:
            logger.warning("Invalid session ID in trigger: %s", session_id_str)
            return

        try:
            ctx = await coordinator.run(
                session_id=session_id,
                redis=redis_client,
            )
            logger.info(
                "Trigger run complete | session=%s fused=%.4f",
                session_id, ctx.fused_index,
            )
        except Exception as exc:
            logger.error("Coordinator run error | session=%s: %s", session_id, exc)

    try:
        async for message in pubsub.listen():
            if message["type"] == "message":
                payload = message["data"]
                logger.debug("Received trigger: %s", payload)
                # Non-blocking: each trigger runs as independent asyncio task
                asyncio.create_task(handle_trigger(payload))
    except asyncio.CancelledError:
        logger.info("Swarm daemon cancelled.")
    finally:
        await pubsub.unsubscribe("kavach:mcp_triggers")
        await pubsub.close()
        await redis_client.aclose()
        await http_client.aclose()
        if pool:
            await pool.close()
        if neo4j_driver:
            await neo4j_driver.close()
        logger.info("Swarm daemon shut down cleanly.")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Interrupted — exiting.")
