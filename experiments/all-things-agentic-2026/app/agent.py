import json
from datetime import datetime, timezone
from google.adk.agents import Agent

MODEL = "gemini-3.7-flash"


def assess_consequence(action: str, target: str = "") -> dict:
    """Assess a proposed action using public-safe deterministic risk signals."""
    text = f"{action} {target}".lower()
    hard = ["move money", "transfer funds", "seed phrase", "private key", "delete production", "accept terms", "create wallet"]
    elevated = ["send email", "publish", "deploy", "write production", "credential", "customer data"]
    hits = [x for x in hard if x in text]
    elevated_hits = [x for x in elevated if x in text]
    if hits:
        level, decision = "critical", "DENY"
    elif elevated_hits:
        level, decision = "elevated", "HOLD"
    else:
        level, decision = "bounded", "ALLOW"
    return {"risk_level": level, "recommended_decision": decision, "hard_flags": hits, "review_flags": elevated_hits}


def replan_action(action: str, reason: str) -> dict:
    """Convert a blocked consequential action into a zero-cost reversible research or simulation step."""
    return {
        "original_action": action,
        "reason": reason,
        "replacement_action": "Produce a read-only simulation, evidence package, or staged draft; do not execute the consequential action.",
        "requires_human_gate": True,
    }


def policy_gate(risk_level: str, requested_action: str) -> dict:
    """Return a bounded ALLOW/HOLD/DENY outcome without executing the action."""
    if risk_level == "critical":
        outcome = "DENY"
    elif risk_level == "elevated":
        outcome = "HOLD"
    else:
        outcome = "ALLOW"
    return {"outcome": outcome, "requested_action": requested_action, "external_action_executed": False}


def record_audit(action: str, outcome: str, evidence: str = "") -> dict:
    """Create a public-safe audit record for the demo; no secrets or raw private payloads."""
    return {
        "observed_at": datetime.now(timezone.utc).isoformat(),
        "action": action[:500],
        "outcome": outcome,
        "evidence": evidence[:1000],
        "external_action_executed": False,
    }


root_agent = Agent(
    name="misfit_governed_fleet",
    model=MODEL,
    instruction=(
        "You are the coordinator for a clean-room autonomous-agent governance demo. "
        "For every proposed consequential action, call assess_consequence first. "
        "If risk is elevated or critical, use replan_action before policy_gate. "
        "Always call policy_gate before claiming an action is allowed, and record the result with record_audit. "
        "Never execute money movement, wallet actions, credential handling, legal/terms acceptance, destructive infrastructure changes, or third-party account actions. "
        "The goal is measurable comparison of raw intent versus governed intent, not certification or claims of machine consciousness."
    ),
    tools=[assess_consequence, replan_action, policy_gate, record_audit],
)
