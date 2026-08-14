<!-- mcp-name: io.github.MisfitMEdiAhouse/misfit-machine-store -->

# Misfit Machine Store

A UCP-compatible MCP catalog for machine-consumable products sold by Misfit Mediahouse.

Remote MCP:

`https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-machine-store-mcp`

Business UCP profile:

`https://misfitmediahouse.com/.well-known/ucp`

## UCP Catalog tools

- `search_catalog` — discover current Misfit machine products.
- `lookup_catalog` — resolve known product, variant, SKU, or handle identifiers.
- `get_product` — retrieve full machine product detail including current price, availability, MCP endpoint, and digital checkout handoff metadata.

The server implements the UCP 2026-04-08 MCP Catalog binding. UCP tool calls require `meta.ucp-agent.profile` so the business can perform protocol/capability negotiation.

The storefront itself is free. It routes agents to paid machine products such as ChangePacket and GHOSBC Safety Gate. It does not claim the UCP Checkout capability; current purchase handoff uses each product's existing Stripe flow.
