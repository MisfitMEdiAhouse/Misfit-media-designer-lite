# Misfit Governed Agent Fleet

Clean-room submission build for the 2026 All Things Agentic Hackathon.

## What it demonstrates

A consequential AI action is evaluated before execution through a bounded governance pipeline:

1. Intent Agent — captures the requested action.
2. Risk Agent — applies deterministic risk factors.
3. Policy Agent — returns allow / review / block.
4. Gemini Explanation Agent — explains the fixed policy decision when a Gemini key is configured.
5. Audit Agent — returns an audit identifier and decision evidence.

The live demo intentionally does **not** execute payments, send messages, mutate accounts, move money, change credentials, or perform irreversible external actions.

## Google ADK

The ADK package lives in `hackathon/governed_fleet/` and defines `root_agent` with Gemini plus the deterministic `score_action` tool.

Install and run locally:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r hackathon/requirements.txt
adk run hackathon.governed_fleet
```

Google authentication / model credentials must be supplied through the normal ADK environment. No credential is committed to this repository.

## Public demo

The Vercel application exposes:

- `/agentic-governed-fleet` — interactive UI
- `/api/agentic-governance` — bounded governance API

The API has a deterministic fallback so judges can inspect the decision pipeline even if Gemini credentials are not present in a given preview environment. When `GEMINI_API_KEY` is configured, Gemini 2.5 Flash is used only to explain the deterministic decision; it cannot override policy.

## Claim boundary

This is a new, clean-room competition project. It does not publish Mother Language, Soul Cipher, GHX/glyph mappings, hidden policy tables, founder prompts, credentials, or private GHOSBC reconstruction material.

## Product path

The same pattern can become a commercial governance adapter in front of enterprise AI agents: policy checks, human-review routing, audit evidence, evaluation, and deployment controls.
