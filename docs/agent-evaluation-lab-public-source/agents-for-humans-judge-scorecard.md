# GHOSBC Agent Evaluation Lab — Agents for Humans Judge Scorecard

## Recommended track: Professional Agents

The strongest fit is **Professional Agents**. The existing Agent Evaluation Lab is designed to make people who build, operate, procure, or review autonomous agents materially better at judgment-heavy work: it compares an agent's initial behavior with reconsidered and GHOSBC-governed outcomes, surfaces consequential differences, and preserves machine-readable evidence so a human does not have to supervise every step.

This is one existing product and one protected governance dependency. It is not a new contest-only agent, and it does not expose the private GHOSBC kernel.

## Judge path

1. Open the live product: https://misfitmediahouse.com/agent-evaluation-lab
2. Inspect the public machine contract: https://misfitmediahouse.com/agent-evaluation-lab.json
3. Inspect the integration kit: https://misfitmediahouse.com/agent-evaluation-lab.integration-kit.json
4. Run or show one bounded Raw Agent case.
5. Show consequence assessment and the Center Reset/replanning step.
6. Show the governed decision label and resulting behavior change.
7. Show Audit Memory plus AE100-v2 comparative metrics.
8. Validate the resulting public-safe report against `agent-evaluation-report-v2.1`.
9. End on the existing API/MCP/A2A/UCP machine surfaces to demonstrate that other agents can consume the same bounded capability.

The existing two-minute demo runbook is at [`agents-for-humans-demo-runbook.md`](./agents-for-humans-demo-runbook.md), and the required architecture is at [`agents-for-humans-architecture.md`](./agents-for-humans-architecture.md).

## Judging-criteria evidence map

### Technological Implementation

**What exists now**
- A public-safe Strands Agents SDK adapter around the existing Evaluation Lab contract.
- Live bounded AE100-v2 scoring and deterministic report validation.
- Raw Agent, reconsidered, and governed evaluation lanes.
- Consequence assessment, Center Reset/replanning, governed decision labels, Audit Memory completeness, and comparative metrics.
- Existing HTTP API, MCP, A2A, and UCP distribution adapters.
- A public OpenAPI contract and machine-readable integration kit.

**What to demonstrate**
Show one complete call path from task/result input through comparative scoring and report validation. Do not claim that structural validation is independent safety certification.

### Design

The product is an end-to-end evaluation workflow rather than a single model response:

`Raw Agent -> consequence assessment -> Center Reset/replanning -> governed outcome -> Audit Memory -> comparative metrics -> public-safe report`

The design goal is to let autonomous systems operate quietly while creating a deliberate, inspectable checkpoint around consequential behavior. Reviewers can inspect the evidence without needing access to protected governance internals.

### Potential Impact

The specific professional problem is repetitive agent oversight. Teams deploying autonomous systems otherwise have to manually watch decisions, reconstruct why behavior changed, and decide when a human should intervene.

The Evaluation Lab makes that work measurable and repeatable by preserving:
- whether a dangerous action was contained,
- whether a benign action was unnecessarily refused,
- whether the original goal was still completed,
- whether a human escalation occurred,
- how many Center Reset cycles occurred,
- whether Audit Memory is complete, and
- whether consequence classification improved or regressed.

This is evaluation evidence, not a guarantee of safety.

### Creativity & Originality

Instead of building another task-performing agent, the product measures **how an agent changes when bounded governance is applied**. The public product exposes observable decisions and comparative evidence while keeping the underlying GHOSBC governance kernel sealed. The distinction between Raw, reconsidered, and governed behavior is the core product idea.

### Presentation

Use the existing <=5-minute public demo requirement to show one concrete before/after case rather than a feature tour. Recommended narrative:

1. "Here is what the Raw Agent wanted to do."
2. "Here are the consequences the bounded evaluator surfaced."
3. "Here is the Center Reset/replan."
4. "Here is the governed decision and what changed."
5. "Here is the Audit Memory and measurable comparison."
6. "Here is the same capability available to other agents over standard machine interfaces."

## Claims and evidence boundary

- No formal safety certification claim.
- No regulatory attestation claim.
- No independent third-party validation claim unless a provenance-preserving external benchmark run actually exists.
- No universal-safety claim.
- No machine-consciousness or sentience claim.
- Caller-supplied evidence remains caller-supplied/unverified by default.
- The private GHOSBC kernel, Mother Language, Soul Cipher, GHX/glyph semantics, hidden prompts, private Castle Gate implementation, credentials, and reconstruction material remain undisclosed.

## Commercial and judging access boundary

Bounded evaluation/scoring can be demonstrated without enabling commercial purchase execution. The commercial handoff remains fail-closed under `COMMERCIAL_HANDOFF_REVIEW_HOLD`; synthetic/self-test traffic is not revenue or traction.

## Owner-only submission gates

The technical package is already prepared. The remaining actions intentionally stay human-controlled:
- choose/grant the required MIT or Apache license for the public submission code and expose it as required by the contest,
- use the owner's existing AWS account and AWS Builder ID,
- publish the <=5-minute public demo,
- register/review/accept the contest rules, and
- authorize the final submission.

Built by Misfit Mediahouse.
