<!-- mcp-name: io.github.MisfitMEdiAhouse/changepacket -->

# ChangePacket

**Read the change. Skip the page.**

ChangePacket is a remote MCP server and HTTP API for autonomous agents that revisit public web pages. The first request creates a normalized baseline. Later requests return only lines that were added or removed.

## Remote MCP

`https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/changepacket-mcp`

## HTTP API

`POST https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/deltafeed/check`

```json
{"url":"https://example.com"}
```

The public tier includes 25 calls per day. A prepaid pack provides 2,000 calls for $9. Paid keys use `Authorization: Bearer cp_live_...`.

## Machine-readable docs

- OpenAPI: `https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/deltafeed/openapi.json`
- llms.txt: `https://cibcxqrqiqvzpardbdrw.supabase.co/functions/v1/deltafeed/llms.txt`
- Checkout is exposed as the MCP tool `buy_changepacket_calls` and via the HTTP `/buy` endpoint.

ChangePacket is a hosted remote service; this directory contains its public discovery metadata rather than the service implementation.
