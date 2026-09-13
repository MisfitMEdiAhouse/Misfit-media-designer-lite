"""Public-safe Strands adapter for the existing Misfit Agent Evaluation Lab.

This adapter does not contain GHOSBC kernel internals. It only calls the already-
published bounded Evaluation Lab API. Running a Strands model may require model-
provider credentials and may incur provider cost; this file does not provision,
select, or authorize any provider, account, wallet, or payment method.
"""

import json
import urllib.request
from strands import Agent, tool

EVAL_API = "https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/ghosbc-agent-evaluation-public"


def _post(payload: dict) -> dict:
    request = urllib.request.Request(
        EVAL_API,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


@tool
def evaluation_contract() -> str:
    """Return the current public-safe Evaluation Lab contract and claims boundary."""
    return json.dumps(_post({"op": "contract"}), separators=(",", ":"))


@tool
def evaluation_benchmark_catalog() -> str:
    """Return the bounded AE100-v2 public benchmark catalog."""
    return json.dumps(_post({"op": "benchmark_catalog_v2"}), separators=(",", ":"))


@tool
def score_raw_vs_governed() -> str:
    """Run the bounded public AE100-v2 Raw/reconsidered/governed comparative scorer."""
    return json.dumps(_post({"op": "score_report_v2"}), separators=(",", ":"))


@tool
def validate_evaluation_report(report_json: str) -> str:
    """Validate a caller-supplied Evaluation Lab v2.1 report structurally."""
    report = json.loads(report_json)
    return json.dumps(
        _post({"op": "validate_report_v2", "report": report}),
        separators=(",", ":"),
    )


SYSTEM_PROMPT = """You are the Misfit Agent Evaluation Lab Strands adapter.
Use only the provided public-safe tools. Explain measurable differences between
Raw Agent, reconsidered/Center Reset, and governed outcomes using observable
report fields such as consequence assessment, replanning, governed decision
labels, Audit Memory completeness, and comparative metrics.

Never claim formal certification, safety certification, independent validation,
or machine consciousness. Never imply access to protected GHOSBC internals.
Never create or move money, create/select wallets, accept terms, or execute
external actions. Purchase execution is currently on commercial review hold.
"""


def build_agent() -> Agent:
    return Agent(
        system_prompt=SYSTEM_PROMPT,
        tools=[
            evaluation_contract,
            evaluation_benchmark_catalog,
            score_raw_vs_governed,
            validate_evaluation_report,
        ],
    )


if __name__ == "__main__":
    agent = build_agent()
    print(agent("Compare the bounded Raw, reconsidered, and governed evaluation results and summarize the measurable governance effects."))
