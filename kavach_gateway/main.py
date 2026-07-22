# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | kavach_gateway | main.py
#
# FastAPI application factory + uvicorn entrypoint.
# Replaces Rust actix-web src/main.rs.
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import logging

import structlog
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from kavach_gateway.cache.redis_client import KavachRedisClient
from kavach_gateway.config import config as app_config
from kavach_gateway.routes.api import router

# ── Structured logging setup ──────────────────────────────────────────────────
structlog.configure(
    processors=[
        structlog.stdlib.add_log_level,
        structlog.stdlib.add_logger_name,
        structlog.dev.ConsoleRenderer(),
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    logger_factory=structlog.stdlib.LoggerFactory(),
)
logging.basicConfig(level=getattr(logging, app_config.log_level, logging.INFO))
logger = structlog.get_logger(__name__)

# ── Application Factory ───────────────────────────────────────────────────────


def create_app() -> FastAPI:
    app = FastAPI(
        title="Kavach-AI Ingestion Gateway",
        description="Real-time threat detection ingestion gateway for the Kavach-AI system.",
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS — allow Next.js dev + production origins
    app.add_middleware(
      CORSMiddleware,
      allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "*",
      ],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
      max_age=3600,
    )

    # Mount all routes
    app.include_router(router)

    # ── Lifespan events ───────────────────────────────────────────────────────

    @app.on_event("startup")
    async def startup_event():
        logger.info(
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            "  🛡️  Kavach-AI Ingestion Gateway v0.1.0\n"
            f"  Interdiction Budget: {app_config.interdiction_budget_ms} ms\n"
            f"  Bind Address:        {app_config.server_bind}\n"
            f"  Redis URL:           {app_config.redis_url}\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        )
        try:
            redis = await KavachRedisClient.connect(app_config.redis_url)
            app.state.redis  = redis
            app.state.config = app_config
            logger.info("✅ Redis connection manager established")
        except Exception as exc:
            logger.error("Fatal: Could not connect to Redis: %s", exc)
            raise SystemExit(1)

        # Connect PostgreSQL pool in gateway for operational persistence
        try:
            import asyncpg
            clean_dsn = app_config.database_url.split("?")[0]
            ssl_mode = "require" if "aivencloud" in clean_dsn or "localhost" not in clean_dsn else None
            pool = await asyncpg.create_pool(
                dsn=clean_dsn,
                ssl=ssl_mode
            )
            app.state.pool = pool
            logger.info("✅ PostgreSQL pool connected in Gateway")

            # Perform inline table auto-migration
            async with pool.acquire() as conn:
                await conn.execute("""
                    CREATE TABLE IF NOT EXISTS operator_audit_logs (
                        id SERIAL PRIMARY KEY,
                        email VARCHAR(255) NOT NULL,
                        action VARCHAR(50) NOT NULL,
                        client_ip VARCHAR(50) NOT NULL,
                        user_agent TEXT,
                        platform VARCHAR(100),
                        timestamp TIMESTAMPTZ DEFAULT NOW()
                    );
                """)
            logger.info("✅ PostgreSQL operator_audit_logs migration verified")
        except Exception as exc:
            logger.warning("PostgreSQL unavailable in Gateway (%s) — auth logs will skip persistence", exc)
            app.state.pool = None

    @app.on_event("shutdown")
    async def shutdown_event():
        logger.info("Kavach-AI Gateway shutting down...")
        if hasattr(app.state, 'pool') and app.state.pool:
            await app.state.pool.close()
            logger.info("PostgreSQL pool connection closed.")

    return app


app = create_app()


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run(
        "kavach_gateway.main:app",
        host=app_config.server_host,
        port=app_config.server_port,
        reload=False,
        log_level=app_config.log_level.lower(),
    )
