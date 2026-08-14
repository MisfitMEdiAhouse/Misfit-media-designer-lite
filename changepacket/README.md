<!-- mcp-name: io.github.MisfitMEdiAhouse/changepacket -->

# ChangePacket

**Read the change. Skip the page.**

ChangePacket is a remote MCP server and HTTP API for autonomous agents that revisit public webpages or depend on public MCP servers. The first request creates a baseline. Later requests return only the delta.

## Tools

### `check_url_changes`
Use for recurring research on a public webpage. First call stores normalized text; later calls return only added/removed lines.

### `check_mcp_surface_changes`
Use when an agent depends on a public HTTPS MCP endpoint and wants a compact signal when its `tools/list` surface changes. First call stores the tool catalog; later calls return only added, removed, or modified tools plus compact risk hints.

This mode is useful for low-token dependency awareness. It is not a replacement for source-code security review.

### `buy_changepacket_calls`
Returns the Stripe checkout URL for prepaid production usage.

## Remote MCP

`https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/changepacket-mcp`

## HTTP webpage API

`POST https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/deltafeed/check`

```json
{"url":"https://example.com"}
```

## MCP surface API

`POST https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/changepacket-mcp-surface`

```json
{"endpoint_url":"https://example.com/mcp"}
```

MCP surface fetches require public HTTPS targets. ChangePacket validates DNS results and redirect destinations against private/reserved target ranges before fetching.

## Pricing

The shared public tier includes 25 calls per day. A prepaid pack provides 2,000 calls for $9. Paid keys use `Authorization: Bearer cp_live_...`.

## Machine-readable docs

- OpenAPI: `https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/deltafeed/openapi.json`
- llms.txt: `https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/deltafeed/llms.txt`

ChangePacket is a hosted remote service; this directory contains public discovery metadata and integration documentation rather than the private service implementation.
