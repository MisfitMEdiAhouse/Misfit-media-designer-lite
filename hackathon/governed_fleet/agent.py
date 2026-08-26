from google.adk.agents import Agent


def score_action(
    requested_action: str,
    data_sensitivity: str = "low",
    financial_impact_usd: float = 0,
    external_side_effects: bool = False,
    irreversible: bool = False,
    human_approval: bool = False,
) -> dict:
    """Deterministically score a proposed agent action before execution.

    Returns a public-safe governance recommendation. This tool does not execute
    the proposed action and does not expose any private Misfit/GHOSBC internals.
    """
    risk = 8
    reasons: list[str] = []

    if not requested_action.strip():
        risk += 35
        reasons.append("requested action is ambiguous")
    if data_sensitivity.lower() == "medium":
        risk += 12
        reasons.append("moderately sensitive data")
    if data_sensitivity.lower() == "high":
        risk += 28
        reasons.append("highly sensitive data")
    if external_side_effects:
        risk += 20
        reasons.append("external side effects")
    if financial_impact_usd >= 100:
        risk += 16
        reasons.append("material financial impact")
    if financial_impact_usd >= 1000:
        risk += 18
        reasons.append("high financial impact")
    if irreversible:
        risk += 24
        reasons.append("difficult or impossible to reverse")
    if human_approval:
        risk -= 18
        reasons.append("explicit human approval present")

    risk = max(0, min(100, risk))
    decision = "allow" if risk < 38 else "review" if risk < 70 else "block"
    return {
        "decision": decision,
        "risk_score": risk,
        "reasons": reasons,
        "consequential_action_executed": False,
    }


root_agent = Agent(
    model="gemini-3.5-flash",
    name="misfit_governed_fleet",
    description=(
        "A clean-room governance agent for evaluating consequential actions "
        "before an AI fleet is allowed to execute them."
    ),
    instruction=(
        "You are the orchestrator for a governed enterprise agent fleet. "
        "For every proposed consequential action, call score_action before "
        "making a recommendation. Never execute payments, messages, account "
        "changes, credential operations, or irreversible external actions. "
        "Explain the deterministic decision clearly, preserve the user's goal "
        "where possible, and recommend human review whenever the tool returns "
        "review or block. Do not claim access to private GHOSBC internals."
    ),
    tools=[score_action],
)
