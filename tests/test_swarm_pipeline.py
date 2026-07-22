# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | tests | test_swarm_pipeline.py
#
# Integration & Verification test suite for 8-agent swarm and gateway.
# ─────────────────────────────────────────────────────────────────────────────

import asyncio
import unittest
import uuid
import numpy as np

from kavach_agents.mcp_protocol import (
    FusedThreatContext, McpFrame, SWARM_MCP_TOOLS,
    AGENT_PHONEME, AGENT_VERITAS, AGENT_NEXUS, AGENT_LEX,
    WEIGHT_PHONEME, WEIGHT_HERMES, WEIGHT_VERITAS, WEIGHT_AEGIS,
    WEIGHT_NEXUS, WEIGHT_VANGUARD, WEIGHT_LUMEN, WEIGHT_LEX
)
from kavach_agents.agents.phoneme import PhonemeAgent, _glottal_stress_heuristic
from kavach_agents.agents.veritas import VeritasAgent
from kavach_agents.agents.nexus import NexusAgent, TransactionPayload, _verdict
from kavach_agents.agents.lumen import LumenAgent, _intaglio_fft_score
from kavach_agents.agents.lex import LexAgent, _sign_p256


class MockRedis:
    def __init__(self):
        self.data = {}
        self.published = []

    async def get(self, key: str):
        return self.data.get(key)

    async def setex(self, key: str, ttl: int, value: str):
        self.data[key] = value

    async def lrange(self, key: str, start: int, end: int):
        v = self.data.get(key)
        if isinstance(v, list):
            return v
        return []

    async def publish(self, channel: str, message: str):
        self.published.append((channel, message))


class TestKavachSwarmPipeline(unittest.IsolatedAsyncioTestCase):

    def test_mcp_fusion_weights(self):
        total_weight = (
            WEIGHT_PHONEME + WEIGHT_HERMES + WEIGHT_VERITAS + WEIGHT_AEGIS +
            WEIGHT_NEXUS + WEIGHT_VANGUARD + WEIGHT_LUMEN + WEIGHT_LEX
        )
        self.assertAlmostEqual(total_weight, 1.0, places=4)

    def test_mcp_tools_registry(self):
        self.assertGreaterEqual(len(SWARM_MCP_TOOLS), 3)
        tool_names = [t.name for t in SWARM_MCP_TOOLS]
        self.assertIn("freeze_account_node", tool_names)
        self.assertIn("verify_ovi_shift", tool_names)
        self.assertIn("certify_bsa_docket", tool_names)

    def test_fused_threat_context(self):
        sid = uuid.uuid4()
        ctx = FusedThreatContext(session_id=sid)
        ctx.phoneme_score = 0.8
        ctx.hermes_score = 0.8
        ctx.veritas_score = 0.8
        ctx.aegis_score = 0.8
        ctx.nexus_score = 0.8
        ctx.vanguard_score = 0.8
        ctx.lumen_score = 0.8
        ctx.lex_score = 0.8
        ctx.fuse()
        self.assertAlmostEqual(ctx.fused_index, 0.8, places=4)
        self.assertTrue(ctx.should_interdict(0.75))


    def test_phoneme_levinson_durbin(self):
        # Generate 16kHz sine wave audio sample
        t = np.linspace(0, 1.0, 16000, dtype=np.float32)
        audio = np.sin(2 * np.pi * 440 * t)
        score = _glottal_stress_heuristic(audio)
        self.assertIsInstance(score, float)
        self.assertGreaterEqual(score, 0.0)
        self.assertLessEqual(score, 1.0)

    async def test_veritas_virtual_camera_blocking(self):
        sid = uuid.uuid4()
        redis = MockRedis()
        frame = await VeritasAgent.run(sid, redis, camera_label="OBS Virtual Camera")
        self.assertEqual(frame.score, 0.95)
        self.assertEqual(frame.verdict, "virtual_camera_injected")
        self.assertTrue(frame.interdict_now)

    def test_lumen_intaglio_fft(self):
        # Create 2D synthetic image matrix
        img = np.random.randn(256, 256).astype(np.float32)
        score = _intaglio_fft_score(img)
        self.assertIsInstance(score, float)
        self.assertGreaterEqual(score, 0.0)
        self.assertLessEqual(score, 1.0)

    def test_lex_p256_signing(self):
        data_hash = "4f1a3b8c9d2e5f7a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e"
        seed_hex = "a" * 64
        sig = _sign_p256(data_hash, seed_hex)
        self.assertIsInstance(sig, str)
        self.assertGreater(len(sig), 60)


if __name__ == "__main__":
    unittest.main()
