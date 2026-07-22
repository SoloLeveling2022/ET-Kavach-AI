# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | kavach_agents | agents/vanguard.py
#
# Vanguard Agent — Hawkes Process GIS Crime Density Optimizer
# Exact port of Rust src/agents/vanguard/mod.rs.
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import logging
import math
import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional, TYPE_CHECKING

from kavach_agents.mcp_protocol import AGENT_VANGUARD, McpFrame

if TYPE_CHECKING:
    import asyncpg
    import redis.asyncio as aioredis

logger = logging.getLogger(__name__)

# ── Hawkes Model Constants ────────────────────────────────────────────────────
HAWKES_ALPHA = 0.5       # temporal decay per hour
HAWKES_BETA  = 0.8       # branching ratio weight
SPATIAL_SIGMA = 0.015    # spatial standard deviation
GRID_STEP    = 3.0       # India grid step size for coarse sweep
PATROL_RADIUS_DEG = 0.2  # patrol area sweep radius

# Bounding box coordinates for Indian landmass
INDIA_MIN_LAT = 8.0
INDIA_MAX_LAT = 37.0
INDIA_MIN_LON = 68.0
INDIA_MAX_LON = 97.0


class CrimeIncident:
    def __init__(self, latitude: float, longitude: float, incident_type: str, severity: int, occurred_at: datetime) -> None:
        self.latitude = latitude
        self.longitude = longitude
        self.incident_type = incident_type
        self.severity = severity
        self.occurred_at = occurred_at


def branching_ratio_for_type(incident_type: str) -> float:
    if incident_type == "digital_arrest":       return 0.90
    if incident_type == "money_mule":           return 0.75
    if incident_type == "voice_spoof":          return 0.60
    if incident_type == "counterfeit_currency": return 0.40
    return 0.50


def gaussian_kernel(dx: float, dy: float, sigma: float) -> float:
    dist_sq = dx * dx + dy * dy
    sigma2 = sigma * sigma
    return math.exp(-dist_sq / (2.0 * sigma2)) / (2.0 * math.pi * sigma2)


def hawkes_intensity(
    query_time: datetime,
    query_lat:  float,
    query_lng:  float,
    incidents:  list[CrimeIncident],
    mu_baseline: float,
) -> float:
    excitation = 0.0
    for inc in incidents:
        if inc.occurred_at >= query_time:
            continue
        dt_hours = (query_time - inc.occurred_at).total_seconds() / 3600.0
        if dt_hours <= 0.0:
            continue
            
        beta_i = branching_ratio_for_type(inc.incident_type)
        temporal = math.exp(-HAWKES_ALPHA * dt_hours)
        spatial = gaussian_kernel(query_lat - inc.latitude, query_lng - inc.longitude, SPATIAL_SIGMA)
        severity_weight = float(inc.severity) / 5.0
        
        excitation += HAWKES_BETA * beta_i * temporal * spatial * severity_weight

    return max(mu_baseline + excitation, 0.0)


def compute_pai(
    zone_lat:  float,
    zone_lng:  float,
    incidents: list[CrimeIncident],
    total_incidents: int,
    study_area_deg2: float,
) -> float:
    patrol_area = math.pi * (PATROL_RADIUS_DEG ** 2)
    a = patrol_area / study_area_deg2
    
    crimes_in_zone = sum(
        1 for inc in incidents
        if math.sqrt((inc.latitude - zone_lat) ** 2 + (inc.longitude - zone_lng) ** 2) <= PATROL_RADIUS_DEG
    )
    
    if total_incidents == 0 or a <= 0.0:
        return 0.0
        
    n_frac = float(crimes_in_zone) / total_incidents
    if n_frac < 1e-12:
        return 0.0
        
    return (float(crimes_in_zone) / patrol_area) / (float(total_incidents) / study_area_deg2)


def select_patrol_zones(candidates: list[dict], k: int) -> list[dict]:
    # Sort candidates by PAI score descending
    candidates.sort(key=lambda z: z["pai_score"], reverse=True)
    selected = []
    
    for candidate in candidates[:k * 3]:
        overlaps = any(
            math.sqrt((sel["latitude"] - candidate["latitude"]) ** 2 + (sel["longitude"] - candidate["longitude"]) ** 2) < (PATROL_RADIUS_DEG * 1.5)
            for sel in selected
        )
        if not overlaps:
            selected.append(candidate)
        if len(selected) >= k:
            break
            
    return selected


class VanguardAgent:
    """
    Geospatial crime hotspot deployment optimization.
    """

    @staticmethod
    async def run(
        session_id: uuid.UUID,
        redis:      "aioredis.Redis",
        pool:       "asyncpg.Pool | None",
    ) -> McpFrame:
        try:
            incidents = []
            
            # 1. Fetch recent incidents in India from PostgreSQL (72-hour window)
            if pool:
                try:
                    cutoff = datetime.now(timezone.utc) - timedelta(hours=72)
                    rows = await pool.fetch(
                        """
                        SELECT latitude, longitude, incident_type, severity, reported_at AS occurred_at
                        FROM crime_incidents
                        WHERE reported_at > $1
                          AND latitude BETWEEN $2 AND $3
                          AND longitude BETWEEN $4 AND $5
                        ORDER BY occurred_at DESC
                        LIMIT 200
                        """,
                        cutoff,
                        INDIA_MIN_LAT, INDIA_MAX_LAT,
                        INDIA_MIN_LON, INDIA_MAX_LON,
                    )
                    
                    for r in rows:
                        occ = r["occurred_at"]
                        if occ.tzinfo is None:
                            occ = occ.replace(tzinfo=timezone.utc)
                        incidents.append(CrimeIncident(
                            latitude=float(r["latitude"]),
                            longitude=float(r["longitude"]),
                            incident_type=r["incident_type"],
                            severity=int(r["severity"]),
                            occurred_at=occ
                        ))
                except Exception as db_err:
                    logger.warning("Vanguard-Agent: DB query failed (%s), using demo records", db_err)

            # Fallback to demo data if DB was empty/failed (matches Rust behaviour)
            if not incidents:
                now_utc = datetime.now(timezone.utc)
                incidents = [
                    CrimeIncident(28.6139, 77.2090, "digital_arrest", 5, now_utc - timedelta(hours=2)),
                    CrimeIncident(19.0760, 72.8777, "money_mule", 4, now_utc - timedelta(hours=4)),
                    CrimeIncident(17.3850, 78.4867, "digital_arrest", 5, now_utc - timedelta(hours=1)),
                    CrimeIncident(22.5726, 88.3639, "counterfeit_currency", 3, now_utc - timedelta(hours=6)),
                ]

            total_incidents = max(len(incidents), 1)
            study_area_deg2 = (INDIA_MAX_LAT - INDIA_MIN_LAT) * (INDIA_MAX_LON - INDIA_MIN_LON)
            mu_baseline = (total_incidents / study_area_deg2) * 0.01
            query_time = datetime.now(timezone.utc)

            # 2. Coarse sweep over India to calculate Hawkes intensity and PAI
            candidates = []
            lat = INDIA_MIN_LAT
            while lat <= INDIA_MAX_LAT:
                lng = INDIA_MIN_LON
                while lng <= INDIA_MAX_LON:
                    intensity = hawkes_intensity(query_time, lat, lng, incidents, mu_baseline)
                    pai = compute_pai(lat, lng, incidents, total_incidents, study_area_deg2)
                    
                    if intensity > (mu_baseline * 2.0) or pai > 1.5:
                        if intensity > (mu_baseline * 8.0) or pai > 5.0:
                            priority = "CRITICAL"
                        elif intensity > (mu_baseline * 4.0) or pai > 3.0:
                            priority = "HIGH"
                        else:
                            priority = "MEDIUM"
                            
                        units = 12 if priority == "CRITICAL" else (8 if priority == "HIGH" else 5)
                        
                        candidates.append({
                            "latitude":          lat,
                            "longitude":         lng,
                            "intensity":         intensity,
                            "pai_score":         pai,
                            "district_name":     f"{lat:.2f}N, {lng:.2f}E",
                            "priority":          priority,
                            "recommended_units": units,
                        })
                    lng += GRID_STEP
                lat += GRID_STEP

            # 3. Select top-5 non-overlapping patrol zones
            optimal_zones = select_patrol_zones(candidates, 5)
            max_intensity = max((z["intensity"] for z in optimal_zones), default=0.0)
            max_pai = max((z["pai_score"] for z in optimal_zones), default=0.0)

            # Vanguard deployment priority score
            vanguard_score = max(0.0, min(max_pai / 10.0, 1.0))

            logger.info(
                "Vanguard | session=%s score=%.4f zones=%d max_intensity=%.4f max_pai=%.4f",
                session_id, vanguard_score, len(optimal_zones), max_intensity, max_pai,
            )

            return McpFrame.build(
                session_id=session_id,
                agent=AGENT_VANGUARD,
                score=vanguard_score,
                verdict="hotspots_computed",
                diagnostics={
                    "zones_optimized":  len(optimal_zones),
                    "max_intensity":    max_intensity,
                    "max_pai":          max_pai,
                    "patrol_zones":     optimal_zones[:3],
                },
            )

        except Exception as exc:
            logger.error("VanguardAgent error for session %s: %s", session_id, exc)
            return McpFrame.build(session_id, AGENT_VANGUARD, 0.0, "error",
                                  {"error": str(exc)})
