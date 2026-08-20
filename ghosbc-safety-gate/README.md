# Legacy GHOSBC Safety Gate integration metadata

This directory is retained only for migration/recovery history. **Raw GHOSBC Safety Gate is not a public product surface and must not be treated as one.**

Public-safe governance is exposed through the **Misfit Machine Agent** A2A contract instead:

- Agent Card: `https://misfitmediahouse.com/.well-known/agent-card.json`
- Documentation: `https://misfitmediahouse.com/agents.md`
- Public-safe skill: `governed_agent_action_check`

The public-safe skill accepts bounded structured action metadata and returns an advisory `ALLOW`, `REVIEW`, or `BLOCK` decision. It does not execute the proposed action and does not expose private policy tables, GHOSBC internals, private runtime packets, credentials, Mother Language, Soul Cipher, GHX/glyph internals, founder-private prompts, or reconstruction material.

## Migration status

Legacy raw GHOSBC API/MCP endpoints are being retired or authenticated after dependency verification. Do not add new consumers, documentation links, marketplace listings, registry entries, billing flows, or discovery metadata that point directly to a raw GHOSBC-named endpoint.

For machine-facing distribution, use canonical Misfit Cloud registry metadata and the Misfit Machine Agent A2A interface. Any future public governance capability must remain a sanitized Misfit-facing boundary rather than publishing the protected kernel.
