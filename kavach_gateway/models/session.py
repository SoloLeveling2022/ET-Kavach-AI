# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | kavach_gateway | models/session.py
#
# Pydantic v2 data models matching the Rust session.rs structs exactly.
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class SessionStatus(str, Enum):
    ACTIVE   = "active"
    CLOSED   = "closed"
    FROZEN   = "frozen"   # bank account freeze triggered
    FLAGGED  = "flagged"  # threat threshold crossed, under review


class DeviceInfo(BaseModel):
    user_agent:          Optional[str] = None
    client_ip:           str           = "unknown"
    camera_device_label: Optional[str] = None
    platform:            Optional[str] = None


class AgentScores(BaseModel):
    phoneme:  float = 0.0
    hermes:   float = 0.0
    veritas:  float = 0.0
    aegis:    float = 0.0
    nexus:    float = 0.0
    vanguard: float = 0.0
    lumen:    float = 0.0
    lex:      float = 0.0


class KavachSession(BaseModel):
    session_id:   uuid.UUID    = Field(default_factory=uuid.uuid4)
    status:       SessionStatus = SessionStatus.ACTIVE
    device_info:  DeviceInfo
    threat_index: float         = 0.0
    agent_scores: AgentScores   = Field(default_factory=AgentScores)
    created_at:   datetime      = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at:   datetime      = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = {"json_encoders": {uuid.UUID: str, datetime: lambda v: v.isoformat()}}


# ── Request / Response Models ─────────────────────────────────────────────────

class SessionInitRequest(BaseModel):
    user_agent:          Optional[str] = None
    camera_device_label: Optional[str] = None
    platform:            Optional[str] = None


class SessionInitResponse(BaseModel):
    session_id:             uuid.UUID
    ws_audio_url:           str
    ws_sensor_url:          str
    interdiction_budget_ms: int


class ThreatIndexResponse(BaseModel):
    session_id:   uuid.UUID
    threat_index: float
    status:       SessionStatus
    agent_scores: AgentScores
    sampled_at:   datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
