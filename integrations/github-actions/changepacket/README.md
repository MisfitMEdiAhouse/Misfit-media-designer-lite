# ChangePacket GitHub Action

Thin CI wrapper around the existing hosted ChangePacket backend. It does not fork ChangePacket logic, create a second billing system, or publish anything to GitHub Marketplace.

## Usage

```yaml
- name: Check public URL drift
  uses: MisfitMEdiAhouse/Misfit-media-designer-lite/integrations/github-actions/changepacket@feat/changepacket-github-action
  with:
    mode: url
    target: https://example.com
```

For paid production usage, pass the existing ChangePacket API key from GitHub Actions secrets:

```yaml
- name: Check MCP surface drift
  uses: MisfitMEdiAhouse/Misfit-media-designer-lite/integrations/github-actions/changepacket@feat/changepacket-github-action
  with:
    mode: mcp
    target: https://example.com/mcp
    api_key: ${{ secrets.CHANGEPACKET_API_KEY }}
```

`mode=url` calls the canonical `/deltafeed/check` backend. `mode=mcp` calls the canonical `/changepacket-mcp-surface` backend. The action returns the backend JSON as the `result` output.

Marketplace publication, terms acceptance, pricing changes, or a new billing rail require a separate human gate. This wrapper intentionally remains only a thin client around the canonical Misfit backend.
