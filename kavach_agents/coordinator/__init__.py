# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | kavach_agents | coordinator/__init__.py
#
# MCP Coordinator — The Master Orchestrator
# Exact port of Rust coordinator/mod.rs.
#
# Wave pipeline (7.2s total budget):
#   Wave 1 (T+0 → T+2.4s)  : Phoneme + Hermes + Veritas + Aegis  (asyncio.gather)
#   Early exit check
#   Wave 2 (T+2.5 → T+3.8s): Nexus
#   Wave 3+4 (T+3.8 → T+5s): Vanguard + Lumen (concurrent)
#   Wave 5 (T+6.5 → T+6.8s): Lex
#   Final fuse + publish
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import asyncio
from datetime import datetime, timezone
import json
import logging
import time
import uuid
from typing import Optional, TYPE_CHECKING

import redis.asyncio as aioredis

from kavach_agents.mcp_protocol import (
    FusedThreatContext, McpFrame,
    fused_context_key, session_key, gyro_pool_key, mcp_frame_key,
    AGENT_PHONEME, AGENT_HERMES, AGENT_VERITAS, AGENT_AEGIS,
    AGENT_NEXUS, AGENT_VANGUARD, AGENT_LUMEN, AGENT_LEX,
)
from kavach_agents.agents.phoneme  import PhonemeAgent
from kavach_agents.agents.hermes   import HermesAgent
from kavach_agents.agents.veritas  import VeritasAgent
from kavach_agents.agents.aegis    import AegisAgent
from kavach_agents.agents.nexus    import NexusAgent, TransactionPayload
from kavach_agents.agents.vanguard import VanguardAgent
from kavach_agents.agents.lumen    import LumenAgent
from kavach_agents.agents.lex      import LexAgent
from kavach_agents.coordinator.fuser import compute_verdict

if TYPE_CHECKING:
    import asyncpg
    from neo4j import AsyncDriver
    import httpx
    from kavach_agents.config import AgentConfig

logger = logging.getLogger(__name__)

# Wave timeout budgets (ms) — identical to Rust constants
WAVE1_TIMEOUT  = 2.4   # seconds
WAVE2_TIMEOUT  = 1.4
WAVE34_TIMEOUT = 1.4
WAVE5_TIMEOUT  = 0.7
TOTAL_BUDGET   = 7.2

FUSED_CONTEXT_TTL = 30  # seconds in Redis


class Coordinator:
    """
    Orchestrates the 8-agent swarm pipeline within a 7.2-second hard deadline.
    """

    def __init__(
        self,
        config:       "AgentConfig",
        pool:         "asyncpg.Pool | None",
        neo4j_driver: "AsyncDriver | None",
        http_client:  "httpx.AsyncClient",
        engine:       "object | None" = None,  # InferenceEngine
    ) -> None:
        self.config       = config
        self.pool         = pool
        self.neo4j_driver = neo4j_driver
        self.http         = http_client
        self.engine       = engine

    # ── Main pipeline ─────────────────────────────────────────────────────────

    async def run(
        self,
        session_id:  uuid.UUID,
        redis:       aioredis.Redis,
        transaction: Optional[TransactionPayload] = None,
    ) -> FusedThreatContext:
        t_start = time.monotonic()
        logger.info("🚀 Coordinator: starting 7.2s pipeline | session=%s", session_id)

        # Pre-fetch session context
        camera_label   = await self._get_camera_label(session_id, redis)
        gyro_variance  = await self._get_gyro_variance(session_id, redis)

        ctx = FusedThreatContext(session_id=session_id)

        # ── WAVE 1: T+0 → T+2.4s — Audio/Video/Sensor/Threat Intel ──────────
        results = await asyncio.gather(
            _guarded(WAVE1_TIMEOUT, PhonemeAgent.run(session_id, redis, self.engine),
                     AGENT_PHONEME, session_id),
            _guarded(WAVE1_TIMEOUT, HermesAgent.run(session_id, redis, self.engine),
                     AGENT_HERMES, session_id),
            _guarded(WAVE1_TIMEOUT, VeritasAgent.run(
                session_id, redis, camera_label, self.config.liveness_threshold),
                AGENT_VERITAS, session_id),
            _guarded(WAVE1_TIMEOUT, AegisAgent.run(session_id, redis, self.pool),
                     AGENT_AEGIS, session_id),
        )
        phoneme_f, hermes_f, veritas_f, aegis_f = results

        if phoneme_f:
            ctx.phoneme_score = phoneme_f.score
            await _cache_frame(redis, phoneme_f)
        if hermes_f:
            ctx.hermes_score  = hermes_f.score
            await _cache_frame(redis, hermes_f)
        if veritas_f:
            ctx.veritas_score = veritas_f.score
            await _cache_frame(redis, veritas_f)
        if aegis_f:
            ctx.aegis_score   = aegis_f.score
            await _cache_frame(redis, aegis_f)

        # Early-exit interdiction check after Wave 1
        ctx.fuse()
        if ctx.should_interdict(self.config.threat_fire_threshold):
            logger.warning(
                "🚨 EARLY INTERDICTION | session=%s fused=%.4f",
                session_id, ctx.fused_index,
            )
            await self._publish(ctx, redis)
            await self._dispatch_interdiction(ctx, redis)
            return ctx

        elapsed = time.monotonic() - t_start

        # ── WAVE 2: Nexus — graph + freeze ────────────────────────────────────
        remaining = max(0.0, TOTAL_BUDGET - elapsed)
        nexus_f = await _guarded(
            min(remaining, WAVE2_TIMEOUT),
            NexusAgent.run(
                session_id, redis, self.neo4j_driver, self.http,
                self.config.core_banking_webhook,
                self.config.sip_termination_webhook,
                transaction,
                neo4j_database=self.config.neo4j_database,
            ),
            AGENT_NEXUS, session_id,
        )
        if nexus_f:
            ctx.nexus_score = nexus_f.score
            await _cache_frame(redis, nexus_f)

        elapsed = time.monotonic() - t_start

        # ── WAVE 3+4: Vanguard + Lumen (concurrent) ───────────────────────────
        remaining = max(0.0, TOTAL_BUDGET - elapsed)
        vanguard_f, lumen_f = await asyncio.gather(
            _guarded(min(remaining, WAVE34_TIMEOUT),
                     VanguardAgent.run(session_id, redis, self.pool),
                     AGENT_VANGUARD, session_id),
            _guarded(min(remaining, WAVE34_TIMEOUT),
                     LumenAgent.run(session_id, redis, gyro_variance),
                     AGENT_LUMEN, session_id),
        )
        if vanguard_f:
            ctx.vanguard_score = vanguard_f.score
            await _cache_frame(redis, vanguard_f)
        if lumen_f:
            ctx.lumen_score    = lumen_f.score
            await _cache_frame(redis, lumen_f)

        # Intermediate fuse before Lex
        ctx.fuse()
        elapsed = time.monotonic() - t_start

        # ── WAVE 5: Lex — evidence certification ──────────────────────────────
        remaining = max(0.0, TOTAL_BUDGET - elapsed)
        lex_f = await _guarded(
            min(remaining, WAVE5_TIMEOUT),
            LexAgent.run(
                session_id, redis, self.pool, ctx, self.config.signing_key_hex
            ),
            AGENT_LEX, session_id,
        )
        if lex_f:
            ctx.lex_score = lex_f.score
            await _cache_frame(redis, lex_f)

        # Final fuse + publish
        ctx.fuse()
        await self._publish(ctx, redis)

        if ctx.should_interdict(self.config.threat_fire_threshold):
            logger.warning(
                "🚨 INTERDICTION TRIGGERED | session=%s fused=%.4f",
                session_id, ctx.fused_index,
            )
            await self._dispatch_interdiction(ctx, redis)

        total_ms = (time.monotonic() - t_start) * 1000
        verdict  = compute_verdict(ctx.fused_index)

        logger.info(
            "✅ Coordinator complete | session=%s fused=%.4f verdict=%s "
            "phoneme=%.3f hermes=%.3f veritas=%.3f aegis=%.3f "
            "nexus=%.3f vanguard=%.3f lumen=%.3f lex=%.3f elapsed=%.0fms",
            session_id, ctx.fused_index, verdict.value,
            ctx.phoneme_score, ctx.hermes_score, ctx.veritas_score, ctx.aegis_score,
            ctx.nexus_score, ctx.vanguard_score, ctx.lumen_score, ctx.lex_score,
            total_ms,
        )
        return ctx

    async def _dispatch_interdiction(self, ctx: FusedThreatContext, redis: aioredis.Redis) -> None:
        """Fetch session context and fire outbound provisional attachment/SIP webhooks."""
        raw = await redis.get(session_key(ctx.session_id))
        transaction = None
        if raw:
            try:
                parsed = json.loads(raw)
                tx_data = parsed.get("transaction")
                if tx_data and tx_data.get("account_id"):
                    transaction = tx_data
            except Exception:
                pass

        # 1. Fire Account Freeze Webhook if a transaction exists
        if transaction:
            try:
                payload = {
                    "action": "FREEZE_ACCOUNTS",
                    "reason": "money_mule_circular_flow_detected",
                    "session_id": str(ctx.session_id),
                    "accounts": [transaction["account_id"]],
                    "loop_depth": 3,
                    "total_flow_inr": transaction.get("amount", 0.0),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "legal_section": "Section 17 PMLA 2002 — Provisional Attachment Order",
                }
                await self.http.post(self.config.core_banking_webhook, json=payload, timeout=3.0)
                logger.warning("Coordinator | FREEZE Webhook fired for account %s session %s",
                               transaction["account_id"], ctx.session_id)
            except Exception as e:
                logger.error("Coordinator | Core Banking webhook error: %s", e)

        # 2. Fire SIP Call Termination Webhook
        try:
            sip_payload = {
                "session_id": str(ctx.session_id),
                "reason": "fraud_interdiction"
            }
            await self.http.post(self.config.sip_termination_webhook, json=sip_payload, timeout=3.0)
            logger.warning("Coordinator | SIP Termination Webhook fired for session %s", ctx.session_id)
        except Exception as e:
            logger.error("Coordinator | SIP termination webhook error: %s", e)

    # ── Helpers ───────────────────────────────────────────────────────────────

    async def _get_camera_label(
        self, session_id: uuid.UUID, redis: aioredis.Redis
    ) -> Optional[str]:
        raw = await redis.get(session_key(session_id))
        if not raw:
            return None
        try:
            parsed = json.loads(raw)
            return parsed.get("device_info", {}).get("camera_device_label")
        except Exception:
            return None

    async def _get_gyro_variance(
        self, session_id: uuid.UUID, redis: aioredis.Redis
    ) -> float:
        samples = await redis.lrange(gyro_pool_key(session_id), 0, -1)
        if len(samples) < 2:
            return 0.0
        count, mean, m2 = 0, 0.0, 0.0
        for s in samples:
            try:
                v = json.loads(s)
                if isinstance(v, list) and len(v) >= 3:
                    gz = float(v[2])
                    count += 1
                    delta  = gz - mean
                    mean  += delta / count
                    m2    += delta * (gz - mean)
            except Exception:
                continue
        return m2 / (count - 1) if count >= 2 else 0.0

    async def _publish(self, ctx: FusedThreatContext, redis: aioredis.Redis) -> None:
        key     = fused_context_key(ctx.session_id)
        payload = ctx.model_dump_json()
        await redis.setex(key, FUSED_CONTEXT_TTL, payload)
        await redis.publish("kavach:threat_updates", payload)


# ── Utility: guarded coroutine with timeout ───────────────────────────────────

async def _guarded(
    timeout_s:  float,
    coro:       "asyncio.Coroutine",
    agent_name: str,
    session_id: uuid.UUID,
) -> Optional[McpFrame]:
    """Run coro with timeout; return None on timeout or error."""
    try:
        return await asyncio.wait_for(coro, timeout=timeout_s)
    except asyncio.TimeoutError:
        logger.warning("%s timed out | session=%s", agent_name, session_id)
        return None
    except Exception as exc:
        logger.error("%s error | session=%s: %s", agent_name, session_id, exc)
        return None


async def _cache_frame(redis: aioredis.Redis, frame: McpFrame) -> None:
    """Store agent McpFrame in Redis for Lex evidence collection."""
    key = mcp_frame_key(frame.session_id, frame.agent)
    await redis.setex(key, 60, frame.model_dump_json())
