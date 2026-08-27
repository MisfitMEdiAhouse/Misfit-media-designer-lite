# Governed Fleet — Google Cloud deployment handoff

This runbook prepares the existing clean-room Governed Fleet for the hackathon's mandatory Google Cloud infrastructure requirement. It does **not** authorize billing, project creation, IAM changes, contest submission, or terms acceptance.

## What is already staged

- `governed_fleet/agent.py` exposes the Google ADK `root_agent` and uses `gemini-3.5-flash`.
- `requirements.txt` contains the ADK runtime dependency.
- `agents-cli-manifest.yaml` selects `cloud_run` as the deployment target.
- The agent remains recommendation-only for consequential actions and does not execute payments, account changes, credential operations, or irreversible external actions.

## Owner-authorized deployment gate

Once an eligible Google Cloud project is explicitly authorized and billing/IAM are already acceptable, run from the `hackathon/` directory:

```bash
agents-cli login --status
agents-cli deploy --project YOUR_GOOGLE_CLOUD_PROJECT --region us-central1
```

Google's current Agents CLI deployment flow reads `agents-cli-manifest.yaml` and deploys a Cloud Run target through Google Cloud. Do not proceed if the command would create or enable billable resources beyond the owner's authorization.

## Evidence to capture after deployment

1. Cloud Run service URL and deployment timestamp.
2. One successful governed-agent request against the Cloud Run backend.
3. Screenshot/video evidence showing the backend running on Google Cloud for the contest demo.
4. Final cost/billing check; do not represent credits or synthetic traffic as revenue.

## Safety / IP boundary

Do not place private GHOSBC reconstruction material, Mother Language, Soul Cipher, GHX/glyph mappings, hidden Castle Gate policy tables, founder prompts, credentials, or secrets in the repository, deployment environment, logs, or demo. Public evidence may show consequence categories, bounded ALLOW/REVIEW/BLOCK outcomes, replanning evidence, audit IDs, and comparative metrics only.
