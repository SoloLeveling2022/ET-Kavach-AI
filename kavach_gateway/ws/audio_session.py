# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | kavach_gateway | ws/audio_session.py
#
# FastAPI WebSocket handler for 16kHz PCM audio ingestion.
# Mirrors Rust AudioStreamSession (actix-web-actors).
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import asyncio
import base64
import logging
import uuid
from typing import TYPE_CHECKING

from fastapi import WebSocket, WebSocketDisconnect

if TYPE_CHECKING:
    from kavach_gateway.cache.redis_client import KavachRedisClient

logger = logging.getLogger(__name__)

# How many audio chunks to buffer before publishing a trigger
TRIGGER_CHUNK_INTERVAL = 10


async def audio_stream_handler(
    websocket: WebSocket,
    session_id: uuid.UUID,
    redis: "KavachRedisClient",
) -> None:
    """
    WebSocket handler for binary PCM audio at 16kHz.
    Each received frame is a raw PCM bytes chunk (chunk_size ≈ 3200 bytes = 100ms @ 16kHz/16bit).

    Pipeline:
        1. Accept WS connection
        2. For each binary frame received:
           a. Base64-encode and push to kavach:audio_ring:{session_id} (capped ring buffer)
           b. Every TRIGGER_CHUNK_INTERVAL chunks → publish session_id to mcp_triggers
        3. On disconnect: clean close
    """
    await websocket.accept()
    logger.info("Audio WebSocket opened for session %s", session_id)

    chunk_count = 0
    try:
        while True:
            try:
                data = await asyncio.wait_for(websocket.receive_bytes(), timeout=30.0)
            except asyncio.TimeoutError:
                # Send ping to keep alive
                await websocket.send_bytes(b"")
                continue

            # Encode to base64 for Redis string storage
            encoded = base64.b64encode(data).decode("ascii")
            await redis.push_audio_chunk(session_id, encoded)

            chunk_count += 1
            if chunk_count % TRIGGER_CHUNK_INTERVAL == 0:
                await redis.publish_trigger(session_id)
                logger.debug(
                    "Published audio trigger for session %s (chunk #%d)",
                    session_id, chunk_count
                )

    except WebSocketDisconnect:
        logger.info("Audio WebSocket closed for session %s after %d chunks", session_id, chunk_count)
    except Exception as exc:
        logger.error("Audio WebSocket error for session %s: %s", session_id, exc)
    finally:
        try:
            await websocket.close()
        except Exception:
            pass
