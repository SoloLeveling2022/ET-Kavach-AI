# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | kavach_agents | mcp_protocol.py
#
# Model Context Protocol definitions for the 8-agent swarm.
# Direct port of Rust mcp_protocol.rs.
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Optional

from pydantic import BaseModel, Field

# ── Agent name constants ──────────────────────────────────────────────────────
AGENT_PHONEME  = "phoneme"
AGENT_HERMES   = "hermes"
AGENT_VERITAS  = "veritas"
AGENT_AEGIS    = "aegis"
AGENT_NEXUS    = "nexus"
AGENT_VANGUARD = "vanguard"
AGENT_LUMEN    = "lumen"
AGENT_LEX      = "lex"

# ── Threat fusion weights (must sum to 1.0) ───────────────────────────────────
WEIGHT_PHONEME  = 0.20
WEIGHT_HERMES   = 0.20
WEIGHT_VERITAS  = 0.15
WEIGHT_AEGIS    = 0.15
WEIGHT_NEXUS    = 0.15
WEIGHT_VANGUARD = 0.05
WEIGHT_LUMEN    = 0.05
WEIGHT_LEX      = 0.05

INTERDICT_THRESHOLD = 0.75


# ── MCP Context Frame ─────────────────────────────────────────────────────────

class McpFrame(BaseModel):
    """Payload envelope produced by each agent and stored in Redis."""
    session_id:    uuid.UUID
    agent:         str
    created_at:    datetime     = Field(default_factory=lambda: datetime.now(timezone.utc))
    score:         float        # Normalized [0.0 – 1.0]
    verdict:       str
    diagnostics:   dict[str, Any] = Field(default_factory=dict)
    interdict_now: bool         = False

    model_config = {"json_encoders": {uuid.UUID: str, datetime: lambda v: v.isoformat()}}

    @classmethod
    def build(
        cls,
        session_id:  uuid.UUID,
        agent:       str,
        score:       float,
        verdict:     str,
        diagnostics: dict[str, Any] | None = None,
    ) -> "McpFrame":
        return cls(
            session_id=session_id,
            agent=agent,
            score=score,
            verdict=verdict,
            diagnostics=diagnostics or {},
            interdict_now=score >= INTERDICT_THRESHOLD,
        )


# ── Fused Threat Context ──────────────────────────────────────────────────────

class FusedThreatContext(BaseModel):
    """Assembled by the Coordinator from all 8 agent McpFrames."""
    session_id:    uuid.UUID
    fused_index:   float = 0.0
    phoneme_score: float = 0.0
    hermes_score:  float = 0.0
    veritas_score: float = 0.0
    aegis_score:   float = 0.0
    nexus_score:   float = 0.0
    vanguard_score:float = 0.0
    lumen_score:   float = 0.0
    lex_score:     float = 0.0
    updated_at:    Optional[datetime] = None

    model_config = {"json_encoders": {uuid.UUID: str, datetime: lambda v: v.isoformat()}}

    def fuse(self) -> None:
        """Recompute weighted fused index from all 8 agent scores."""
        self.fused_index = (
            self.phoneme_score  * WEIGHT_PHONEME  +
            self.hermes_score   * WEIGHT_HERMES   +
            self.veritas_score  * WEIGHT_VERITAS  +
            self.aegis_score    * WEIGHT_AEGIS    +
            self.nexus_score    * WEIGHT_NEXUS    +
            self.vanguard_score * WEIGHT_VANGUARD +
            self.lumen_score    * WEIGHT_LUMEN    +
            self.lex_score      * WEIGHT_LEX
        )
        self.updated_at = datetime.now(timezone.utc)

    def should_interdict(self, threshold: float) -> bool:
        return self.fused_index >= threshold


# ── Redis key helpers (must match kavach_gateway) ─────────────────────────────

def mcp_frame_key(session_id: uuid.UUID, agent: str) -> str:
    return f"kavach:mcp_frame:{session_id}:{agent}"

def audio_ring_key(session_id: uuid.UUID) -> str:
    return f"kavach:audio_ring:{session_id}"

def gyro_pool_key(session_id: uuid.UUID) -> str:
    return f"kavach:gyro_pool:{session_id}"

def session_key(session_id: uuid.UUID) -> str:
    return f"kavach:session:{session_id}"

def fused_context_key(session_id: uuid.UUID) -> str:
    return f"kavach:fused:{session_id}"


# ── MCP JSON-RPC 2.0 Protocol Schemas (Blueprint Section 2.1) ─────────────────

class McpTool(BaseModel):
    name: str
    description: str
    input_schema: dict[str, Any]

class McpResource(BaseModel):
    uri: str
    name: str
    mime_type: str

class McpPrompt(BaseModel):
    name: str
    description: str
    arguments: list[dict[str, Any]]

class McpJsonRpcRequest(BaseModel):
    jsonrpc: str = "2.0"
    id: str | int
    method: str
    params: dict[str, Any] = Field(default_factory=dict)

class McpJsonRpcResponse(BaseModel):
    jsonrpc: str = "2.0"
    id: str | int
    result: Optional[dict[str, Any]] = None
    error: Optional[dict[str, Any]] = None

# Swarm MCP Tool Registry Declarations
SWARM_MCP_TOOLS: list[McpTool] = [
    McpTool(
        name="freeze_account_node",
        description="Executes core banking provisional attachment order under Section 17 PMLA 2002.",
        input_schema={
            "type": "object",
            "properties": {
                "account_id": {"type": "string"},
                "session_id": {"type": "string"},
                "reason": {"type": "string"}
            },
            "required": ["account_id", "session_id"]
        }
    ),
    McpTool(
        name="verify_ovi_shift",
        description="Performs Fourier Ptychography intaglio reflectance check for banknote authentication.",
        input_schema={
            "type": "object",
            "properties": {
                "session_id": {"type": "string"},
                "image_b64": {"type": "string"}
            },
            "required": ["session_id"]
        }
    ),
    McpTool(
        name="certify_bsa_docket",
        description="Generates SHA-256 evidence chain and signs with ECDSA P-256 key under Section 63 BSA.",
        input_schema={
            "type": "object",
            "properties": {
                "session_id": {"type": "string"}
            },
            "required": ["session_id"]
        }
    )
]

