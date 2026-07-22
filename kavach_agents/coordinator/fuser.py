# ─────────────────────────────────────────────────────────────────────────────
# Kavach-AI | kavach_agents | coordinator/fuser.py
#
# Threat fusion utilities. Port of Rust coordinator/fuser.rs.
# ─────────────────────────────────────────────────────────────────────────────

from enum import Enum


class ThreatVerdict(str, Enum):
    CLEAN            = "clean"
    LOW_RISK         = "low_risk"
    MODERATE         = "moderate_risk"
    HIGH_RISK        = "high_risk"
    CRITICAL         = "critical_interdiction"


def compute_verdict(fused_index: float) -> ThreatVerdict:
    if fused_index < 0.20: return ThreatVerdict.CLEAN
    if fused_index < 0.40: return ThreatVerdict.LOW_RISK
    if fused_index < 0.60: return ThreatVerdict.MODERATE
    if fused_index < 0.75: return ThreatVerdict.HIGH_RISK
    return ThreatVerdict.CRITICAL
