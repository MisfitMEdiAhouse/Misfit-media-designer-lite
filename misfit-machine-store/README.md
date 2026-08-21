<!-- mcp-name: io.github.MisfitMEdiAhouse/misfit-machine-store -->

# Misfit Machine Store

A UCP-compatible, read-only MCP catalog for machine-consumable products sold by Misfit Mediahouse.

Remote MCP:

`https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/misfit-machine-store-mcp`

Business UCP profile:

`https://misfitmediahouse.com/.well-known/ucp`

## UCP Catalog tools

All three tools are read-only discovery operations. They do not create carts, orders, payments, accounts, credentials, or other external side effects.

- `search_catalog` — use when you do not yet know the product identifier. Pass `meta.ucp-agent.profile` plus `catalog.query`; optional `catalog.filters`, `catalog.pagination`, `catalog.context`, `catalog.signals`, and `catalog.attribution` can narrow or attribute discovery. Returns matching machine products with current catalog metadata.
- `lookup_catalog` — use when you already know one or more product, variant, SKU, or handle identifiers. Pass `meta.ucp-agent.profile` plus `catalog.ids` (1–100 identifiers). Returns current price, availability, and machine endpoints for matching identifiers.
- `get_product` — use after selecting one product. Pass `meta.ucp-agent.profile` plus `catalog.id`; optional selection/preferences/context fields may refine the response. Returns full current product detail, availability, machine endpoint metadata, and the existing digital purchase handoff when one is available.

Minimal search arguments:

```json
{
  "meta": {
    "ucp-agent": {
      "profile": "https://example-agent.test/.well-known/ucp"
    }
  },
  "catalog": {
    "query": "website change monitoring"
  }
}
```

The server implements the UCP 2026-04-08 MCP Catalog binding. `meta.ucp-agent.profile` is required so the business can perform protocol/capability negotiation.

## Public/private boundary

The catalog may expose public-safe Misfit machine capabilities such as ChangePacket and the Misfit Machine Agent. Raw GHOSBC kernel/runtime surfaces are private and are not a publishable catalog product. Public-safe governance requests route through the Misfit Machine Agent's live `governed_agent_action_check` contract / Misfit Governance Gate boundary.

The storefront itself is free. It does **not** claim UCP Checkout, order, or payment capabilities. Where a paid product has an existing purchase flow, catalog metadata may provide that handoff; payment execution remains outside these read-only catalog tools.
