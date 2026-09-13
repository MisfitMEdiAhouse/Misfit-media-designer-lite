# Agent Evaluation Lab — Strands Adapter

This is a **thin clean-room adapter** over the existing public Misfit Agent Evaluation Lab. It does not duplicate or publish the protected GHOSBC kernel.

It exposes the current bounded public operations through the Strands Agents SDK:

- Evaluation contract
- AE100-v2 benchmark catalog
- Raw → reconsidered / Center Reset → governed comparative scoring
- Deterministic report validation

The adapter intentionally preserves the product's current claims boundary: no formal certification, safety certification, independent-validation claim, or machine-consciousness claim.

## Run boundary

Installing the SDK is free, but actually running a Strands agent may invoke a configured model provider. Do **not** run this adapter against a paid provider unless separately authorized. This package does not create/select an AWS account, provision infrastructure, accept contest terms, grant an open-source license, create a wallet, move money, or submit anything externally.

The existing Evaluation Lab purchase path also remains disabled under `COMMERCIAL_HANDOFF_REVIEW_HOLD`.

## Local setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python agent.py
```

A configured Strands-supported model provider is required for the final command. The public Evaluation Lab API itself is already deployed.

## Hackathon packaging status

This adapter closes the **Strands SDK implementation** portion of the existing Agents for Humans opportunity while reusing the bounded Evaluation Lab capability. Remaining contest actions are deliberately human-gated: registration/rules acceptance, any AWS/model-provider authorization, open-source license selection, demo publication, and final submission.

Official contest deadline currently verified as **September 14, 2026 at 5:00 PM PDT**.
