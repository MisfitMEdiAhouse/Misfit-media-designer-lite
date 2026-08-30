#!/usr/bin/env python3
"""Public-safe, zero-cost submission preflight for the Governed Fleet branch.

This script does not deploy anything, accept contest terms, call paid APIs, or
claim Google Cloud execution. It only verifies the repository package before
the owner-controlled Cloud deployment and final submission gate.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HACKATHON = ROOT / "hackathon"

REQUIRED_FILES = [
    HACKATHON / "README.md",
    HACKATHON / "JUDGE_PACKET.md",
    HACKATHON / "SUBMISSION_READINESS.md",
    HACKATHON / "DEPLOY_GOOGLE_CLOUD.md",
    HACKATHON / "agents-cli-manifest.yaml",
    HACKATHON / "requirements.txt",
    HACKATHON / "governed_fleet" / "agent.py",
]

# These terms should never appear in executable competition code. Public docs
# may name them only to state the exclusion boundary.
FORBIDDEN_CODE_MARKERS = [
    "Mother Language",
    "Soul Cipher",
    "GHX/glyph",
    "glyph mapping",
    "reconstruction material",
    "private kernel source",
]


def check(name: str, passed: bool, evidence: str) -> dict:
    return {"name": name, "passed": bool(passed), "evidence": evidence}


def main() -> int:
    checks: list[dict] = []

    missing = [str(p.relative_to(ROOT)) for p in REQUIRED_FILES if not p.exists()]
    checks.append(check("required_files", not missing, "missing=" + json.dumps(missing)))

    agent_path = HACKATHON / "governed_fleet" / "agent.py"
    requirements_path = HACKATHON / "requirements.txt"
    manifest_path = HACKATHON / "agents-cli-manifest.yaml"

    agent = agent_path.read_text(encoding="utf-8") if agent_path.exists() else ""
    requirements = requirements_path.read_text(encoding="utf-8") if requirements_path.exists() else ""
    manifest = manifest_path.read_text(encoding="utf-8") if manifest_path.exists() else ""

    checks.append(check(
        "gemini_3_5_or_newer_declared",
        "gemini-3.5" in agent or "gemini-3.6" in agent or "gemini-3.7" in agent,
        "agent model declaration inspected locally",
    ))
    checks.append(check(
        "google_adk_declared",
        "google-adk" in requirements.lower() and "google.adk" in agent,
        "requirements + Python import inspected locally",
    ))
    checks.append(check(
        "cloud_run_target_staged",
        "deployment_target: cloud_run" in manifest,
        "agents-cli manifest inspected locally",
    ))
    checks.append(check(
        "no_external_execution_boundary",
        "Never execute payments" in agent and '"consequential_action_executed": False' in agent,
        "agent instruction/tool return inspected locally",
    ))

    forbidden_hits = [marker for marker in FORBIDDEN_CODE_MARKERS if marker.lower() in agent.lower()]
    checks.append(check(
        "protected_kernel_not_embedded_in_executable_code",
        not forbidden_hits,
        "forbidden_code_markers=" + json.dumps(forbidden_hits),
    ))

    ready = all(item["passed"] for item in checks)
    result = {
        "schema": "misfit.all-things-agentic-preflight.v1",
        "repository_package_ready": ready,
        "google_cloud_runtime_proof": "PENDING_OWNER_GATE",
        "contest_terms_accepted": False,
        "submission_sent": False,
        "claims_boundary": {
            "google_cloud_deployed": False,
            "formal_certification": False,
            "private_ghosbc_exposed": False,
        },
        "checks": checks,
        "next_human_gate": "Authorize eligible Google Cloud deployment, capture runtime proof, then review final contest terms/submission.",
    }
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if ready else 1


if __name__ == "__main__":
    raise SystemExit(main())
