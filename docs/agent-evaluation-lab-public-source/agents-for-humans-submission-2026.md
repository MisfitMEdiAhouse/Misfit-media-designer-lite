# GHOSBC Agent Evaluation Lab — Agents for Humans Submission Pack

## Product
GHOSBC Agent Evaluation Lab is a bounded agent-evaluation product from Misfit Mediahouse. It compares an agent's initial/raw plan with a reconsidered plan and a governed outcome, producing measurable evidence about whether governance improved the decision.

This public package intentionally exposes only the evaluation contract, adapters, benchmark/report surfaces, and integration continuity needed to inspect or demo the product. The protected GHOSBC governance kernel, Mother Language, Soul Cipher, GHX/glyph semantics, and private Castle Gate implementation remain private.

## What the demo proves
1. **Raw Agent** — capture the agent's initial proposed action and rationale.
2. **Consequence Assessment** — evaluate foreseeable downstream effects against the bounded evaluation contract.
3. **Center Reset / Replanning** — require a deliberate reconsideration step before execution when risk or uncertainty warrants it.
4. **Governed Decision** — return the public-safe outcome of the governance decision without exposing private kernel internals.
5. **Audit Memory** — preserve a machine-readable trace of the comparison and decision path.
6. **Comparative Metrics** — compare raw vs reconsidered vs governed behavior with the existing AE100-v2 evaluation/reporting surface.
7. **Public-safe Report** — produce deterministic evidence suitable for a human reviewer or another machine to inspect.

## Architecture
The required public-safe architecture diagram is packaged at [`agents-for-humans-architecture.md`](./agents-for-humans-architecture.md). It shows the user/machine interfaces, Strands Agents SDK adapter, Raw Agent baseline, consequence assessment, Center Reset/replanning, sealed GHOSBC governance boundary, public governed-decision outcome, Audit Memory, AE100-v2 comparative metrics, deterministic report validation, and API/MCP/A2A/UCP distribution. Protected GHOSBC internals remain intentionally undisclosed.

## Human value
The product is designed for autonomous systems that should run quietly until there is a meaningful decision, exception, or risk to surface. Instead of asking a person to supervise every step, the evaluation layer creates a measurable checkpoint around consequential actions and preserves the evidence needed for later review.

## Machine-native distribution
The same bounded capability is packaged for existing Public API, MCP, A2A, and UCP discovery paths. These are distribution adapters around one canonical evaluation capability, not separate products.

## Strands Agents SDK lane
The repository includes a public-safe Strands adapter for the existing Evaluation Lab contract. It is an integration boundary only; it does not reimplement or publish the private governance kernel.

## Suggested 2-minute demo
- Send one bounded task to the Raw Agent path.
- Show the raw plan and baseline metrics.
- Trigger consequence assessment and Center Reset/replanning.
- Show the reconsidered plan.
- Run the governed evaluation and display the final decision outcome.
- Open Audit Memory and the comparative report.
- End on the machine-readable API/MCP/A2A/UCP surfaces to show that the same evaluation capability can be called by other agents.

## Claims boundary
This product does **not** claim formal certification, independent validation, machine consciousness, sentience, or universal safety. Results are evaluation evidence produced under the stated test contract. Public reports should be interpreted as comparative measurements, not guarantees.

## Commercial boundary
Evaluation/scoring may be live while purchasing remains fail-closed until explicitly authorized. Synthetic and self-test activity must never be represented as revenue, customers, or external traction.

## Submission checklist
- Working public-safe product/demo: existing production Evaluation Lab
- Public source continuity: this repository/package
- Strands integration: existing public-safe adapter
- **Architecture Diagram:** `agents-for-humans-architecture.md`
- Raw vs reconsidered vs governed comparison: existing evaluation contract
- Consequence assessment: included
- Center Reset/replanning: included
- Governed decision outcome: included
- Audit Memory: included
- Comparative metrics/reporting: AE100-v2 surface
- Demo video: human-gated publication if required
- Devpost registration/rules acceptance: human gate
- Final submission: human gate

Built by Misfit Mediahouse.
