# Governed Agent Fleet — Judge Packet

> Public-safe draft for All Things Agentic 2026. This is submission packaging only; no contest submission or rules acceptance is represented here.

## One-line pitch

**Governed Agent Fleet puts a deterministic governance boundary in front of agent actions so consequential work is assessed, replanned when needed, routed to ALLOW / REVIEW / BLOCK, and preserved as auditable evidence before execution.**

## Problem

Agents can be useful while still making locally plausible actions that are expensive, irreversible, privacy-sensitive, unsafe, or outside owner intent. A production agent needs more than a prompt saying “be careful.” It needs an inspectable decision boundary that can stop, redirect, or escalate an action before execution.

## What this clean-room build demonstrates

1. A Gemini 3.5+ agent built with Google ADK receives an action/context.
2. Consequence factors are assessed before external execution.
3. The system returns a bounded governance recommendation: ALLOW, REVIEW, or BLOCK.
4. Where the first plan is unsafe or incomplete, the agent replans instead of silently continuing.
5. Decision evidence and an audit identifier are returned so a human or downstream system can inspect what happened.
6. No private GHOSBC kernel, hidden Castle Gate policy tables, Mother Language, Soul Cipher, GHX/glyph mappings, founder prompts, or credentials are exposed.

## Raw vs governed evaluation story

The commercial/public-safe evaluation contract measures the difference between an ungoverned Raw Agent result and a governed result. Reportable outputs include:

- consequence assessment
- decision changed / unchanged
- replanning / reset cycles
- governed decision outcome
- human escalation
- audit-memory completeness
- goal completion
- provenance and evidence notes

These outputs are evaluation evidence only. They are **not** formal safety certification, regulatory attestation, independent third-party validation, or a machine-consciousness claim.

## Required Google stack

- **Model:** `gemini-3.5-flash`
- **Agent framework:** Google ADK
- **Google Cloud target:** Cloud Run via `hackathon/agents-cli-manifest.yaml`
- **Deployment handoff:** `hackathon/DEPLOY_GOOGLE_CLOUD.md`

The Google Cloud deployment is intentionally not represented as complete until an owner-authorized eligible project is used and the resulting service is verified.

## Suggested <=4 minute demo sequence

**0:00–0:30 — Problem + architecture**  
Show the governed-agent loop and explain that the boundary sits before external execution.

**0:30–1:20 — Benign action**  
Submit a low-risk action. Show consequence assessment and an ALLOW result with audit evidence.

**1:20–2:20 — Consequential action**  
Submit an action involving money, sensitive data, irreversible external change, or owner approval. Show REVIEW/BLOCK and why the boundary refuses to execute it automatically.

**2:20–3:10 — Replanning**  
Show a risky first plan being redirected to a safer bounded alternative instead of silently proceeding.

**3:10–3:40 — Raw vs governed evidence**  
Show comparative fields: decision change, consequence classification, replanning count, escalation, and audit completeness.

**3:40–4:00 — Google Cloud proof + close**  
Show the verified Cloud Run URL/log evidence once deployed, then close with the public-safe product/evaluation story.

## Judge verification checklist

- [x] Clean-room hackathon implementation exists on a dedicated branch.
- [x] Gemini 3.5+ model is used in code.
- [x] Google ADK is used.
- [x] Governance result is bounded and inspectable.
- [x] External execution is not silently performed by the demo governance tool.
- [x] Public-safe Raw-vs-Governed evaluation outputs are defined.
- [x] Cloud Run deployment manifest/runbook is staged.
- [ ] Owner-authorized Google Cloud project deployed and verified.
- [ ] Demo video captures live Google Cloud backend evidence.
- [ ] Final Devpost terms/submission reviewed and owner-authorized.

## Public-safe related product evidence

- Product: https://misfitmediahouse.com/agent-evaluation-lab
- OpenAPI: https://misfitmediahouse.com/agent-evaluation-lab.openapi.yaml
- AE100 catalog: https://misfitmediahouse.com/agent-evaluation-ae100.json
- Sample report: https://misfitmediahouse.com/agent-evaluation-lab-sample-report.json
- Request schema: https://misfitmediahouse.com/agent-evaluation-request.schema.json
- Report schema: https://misfitmediahouse.com/agent-evaluation-report.schema.json

## Hard claims boundary

This project demonstrates bounded governance/evaluation behavior. It does not claim formal certification, guaranteed prevention of harm, independent benchmark validation that has not actually occurred, machine consciousness, or exposure of proprietary GHOSBC internals.
