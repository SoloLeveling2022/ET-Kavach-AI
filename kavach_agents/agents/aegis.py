# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | kavach_agents | agents/aegis.py
#
# Aegis Agent — Bayesian Threat Intelligence Record Linkage
# Exact port of Rust src/agents/aegis/mod.rs.
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import json
import logging
import math
import uuid
from typing import Optional, TYPE_CHECKING

from kavach_agents.mcp_protocol import AGENT_AEGIS, McpFrame, session_key

if TYPE_CHECKING:
    import asyncpg
    import redis.asyncio as aioredis

logger = logging.getLogger(__name__)


# ── Levenshtein Distance (normalised) ─────────────────────────────────────────

def levenshtein_similarity(a: str, b: str) -> float:
    la, lb = len(a), len(b)
    if la == 0 and lb == 0:
        return 1.0
    if la == 0 or lb == 0:
        return 0.0

    dp = [[0] * (lb + 1) for _ in range(la + 1)]
    for i in range(la + 1):
        dp[i][0] = i
    for j in range(lb + 1):
        dp[0][j] = j

    for i in range(1, la + 1):
        for j in range(1, lb + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])

    distance = dp[la][lb]
    max_len  = max(la, lb)
    return 1.0 - (distance / max_len)


# ── Bayesian record matcher ───────────────────────────────────────────────────

class BayesianMatcher:
    def __init__(self, p_match: float = 0.001) -> None:
        self.p_match = p_match

    def compute(self, likelihood_ratios: list[tuple[float, float]]) -> float:
        p_u = 1.0 - self.p_match
        p_s_given_m = 1.0
        p_s_given_u = 1.0

        for m_ratio, u_ratio in likelihood_ratios:
            p_s_given_m *= m_ratio
            p_s_given_u *= u_ratio

        numerator = p_s_given_m * self.p_match
        denominator = numerator + p_s_given_u * p_u

        if denominator < 1e-12:
            return 0.0
        return numerator / denominator


# ── Pseudo identity embedding generator ────────────────────────────────────────

def generate_session_embedding(ip: str, ua: str, platform: str) -> list[float]:
    combined = f"{ip}|{ua}|{platform}"
    combined_bytes = combined.encode("utf-8")
    embedding = [0.0] * 384

    for i, b in enumerate(combined_bytes):
        idx = i % 384
        embedding[idx] += (float(b) - 128.0) / 128.0

    # L2-normalize
    norm = math.sqrt(sum(x * x for x in embedding))
    if norm > 1e-8:
        embedding = [x / norm for x in embedding]
    return embedding


class AegisAgent:
    """
    Device-level suspect matching using Bayesian Record Linkage over pgvector.
    """

    @staticmethod
    async def run(
        session_id: uuid.UUID,
        redis:      "aioredis.Redis",
        pool:       "asyncpg.Pool | None",
    ) -> McpFrame:
        try:
            # 1. Read session state from Redis
            raw = await redis.get(session_key(session_id))
            client_ip, user_agent, platform = "", "", ""
            if raw:
                try:
                    state = json.loads(raw)
                    device_info = state.get("device_info", {})
                    client_ip   = device_info.get("client_ip") or ""
                    user_agent  = device_info.get("user_agent") or ""
                    platform    = device_info.get("platform") or ""
                except Exception:
                    pass

            # 2. Generate pseudo identity embedding
            embedding = generate_session_embedding(client_ip, user_agent, platform)

            # 3. Query PostgreSQL suspect_registry table using pgvector cosine distance
            candidates = []
            if pool:
                try:
                    # Format as vector literal: '[0.1,0.2,...]'
                    vec_literal = "[" + ",".join(map(str, embedding)) + "]"
                    rows = await pool.fetch(
                        """
                        SELECT id, display_name, match_probability, threat_category,
                               phone_numbers, ip_addresses
                        FROM suspect_registry
                        WHERE is_active = true
                        ORDER BY identity_embedding <=> $1::vector
                        LIMIT 5
                        """,
                        vec_literal,
                    )
                    
                    matcher = BayesianMatcher(0.001)
                    for row in rows:
                        # Parse row values
                        rid = row["id"]
                        display_name = row["display_name"]
                        threat_category = row["threat_category"]
                        ip_addresses = row["ip_addresses"] or []
                        
                        ratios = []
                        ip_match = 0.0
                        for ip in ip_addresses:
                            # Convert INET to string for comparison
                            similarity = levenshtein_similarity(str(ip), client_ip)
                            ip_match = max(ip_match, similarity)
                            
                        if ip_match > 0.85:
                            ratios.append((0.90, 0.001)) # High match probability, low chance agreement
                        elif ip_match > 0.60:
                            ratios.append((0.40, 0.01))
                            
                        # Structural prior for being in top-5 nearest neighbors
                        ratios.append((0.35, 0.05))
                        
                        p_match = max(0.0, min(matcher.compute(ratios), 1.0))
                        
                        candidates.append({
                            "registry_id":       str(rid),
                            "display_name":      display_name,
                            "match_probability": p_match,
                            "threat_category":   threat_category,
                            "phone_match_score": 0.0,
                            "ip_match_score":    ip_match,
                        })
                except Exception as db_err:
                    logger.warning("Aegis-Agent: suspect registry query failed (%s)", db_err)

            # 4. Compute aggregate threat score
            max_p_match = max((c["match_probability"] for c in candidates), default=0.0)
            
            high_risk_categories = {"digital_arrest", "money_mule", "voice_spoof"}
            category_escalation = any(
                c["threat_category"] in high_risk_categories and c["match_probability"] > 0.4
                for c in candidates
            )
            
            dossier_score = (max_p_match + 0.15) if category_escalation else max_p_match
            dossier_score = max(0.0, min(dossier_score, 1.0))
            
            verdict = "known_threat_actor_matched" if dossier_score >= 0.75 else (
                "suspect_candidate_identified" if dossier_score >= 0.40 else (
                    "weak_intelligence_signal" if candidates else "no_suspect_match"
                )
            )

            logger.info(
                "Aegis | session=%s score=%.4f candidates=%d max_p=%.4f verdict=%s",
                session_id, dossier_score, len(candidates), max_p_match, verdict,
            )

            return McpFrame.build(
                session_id=session_id,
                agent=AGENT_AEGIS,
                score=dossier_score,
                verdict=verdict,
                diagnostics={
                    "client_ip":            client_ip,
                    "candidates_found":     len(candidates),
                    "max_bayesian_p_match": max_p_match,
                    "category_escalation":  category_escalation,
                    "top_candidates":       candidates[:3],
                },
            )

        except Exception as exc:
            logger.error("AegisAgent error for session %s: %s", session_id, exc)
            return McpFrame.build(session_id, AGENT_AEGIS, 0.0, "error",
                                  {"error": str(exc)})
