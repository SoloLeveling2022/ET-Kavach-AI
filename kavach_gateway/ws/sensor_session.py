# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | kavach_gateway | ws/sensor_session.py
#
# FastAPI WebSocket handler for 50Hz gyro/touch sensor data ingestion.
# Mirrors Rust SensorStreamSession (actix-web-actors).
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import asyncio
import json
import logging
import uuid
from typing import TYPE_CHECKING

from fastapi import WebSocket, WebSocketDisconnect

if TYPE_CHECKING:
    from kavach_gateway.cache.redis_client import KavachRedisClient

logger = logging.getLogger(__name__)


async def sensor_stream_handler(
    websocket: WebSocket,
    session_id: uuid.UUID,
    redis: "KavachRedisClient",
) -> None:
    """
    WebSocket handler for gyro/touch/motion sensor data at ~50Hz.
    Each frame is a JSON object with fields:
        { "gx": float, "gy": float, "gz": float, "ts": int }

    Pipeline:
        1. Accept WS connection
        2. For each text/JSON frame:
           a. Validate JSON structure
           b. Push to kavach:gyro_pool:{session_id} (capped at 200)
        3. On disconnect: clean close
    """
    await websocket.accept()
    logger.info("Sensor WebSocket opened for session %s", session_id)

    sample_count = 0
    try:
        while True:
            try:
                raw = await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
            except asyncio.TimeoutError:
                await websocket.send_text('{"ping":true}')
                continue

            # Validate minimal JSON structure
            try:
                parsed = json.loads(raw)
                # Normalise to ensure gz exists for Welford variance in coordinator
                sample = {
                    "gx": float(parsed.get("gx", 0.0)),
                    "gy": float(parsed.get("gy", 0.0)),
                    "gz": float(parsed.get("gz", 0.0)),
                    "ts": int(parsed.get("ts", 0)),
                }
            except (json.JSONDecodeError, ValueError):
                logger.warning("Invalid sensor JSON from session %s: %.80s", session_id, raw)
                continue

            await redis.push_gyro_sample(session_id, json.dumps([sample["gx"], sample["gy"], sample["gz"]]))
            sample_count += 1

    except WebSocketDisconnect:
        logger.info("Sensor WebSocket closed for session %s after %d samples", session_id, sample_count)
    except Exception as exc:
        logger.error("Sensor WebSocket error for session %s: %s", session_id, exc)
    finally:
        try:
            await websocket.close()
        except Exception:
            pass
