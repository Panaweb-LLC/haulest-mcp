# Connecting a client to Haulest

Endpoint: `https://haulest.com/mcp` (Streamable HTTP, MCP 2026-07-28 with
2025-era fallback, no authentication).

## Claude

Settings, Connectors, *Add custom connector*, paste the endpoint. Claude
Code:

```bash
claude mcp add --transport http haulest https://haulest.com/mcp
```

## ChatGPT

Settings, Apps & Connectors, Advanced, enable *Developer mode*, *Create*,
paste the endpoint, authentication *None*. Once published you can add
Haulest from the directory instead.

## Cursor, VS Code, Windsurf, Zed, and other `mcp.json` clients

```json
{
  "mcpServers": {
    "haulest": { "type": "http", "url": "https://haulest.com/mcp" }
  }
}
```

VS Code (`.vscode/mcp.json`) uses `"servers"` instead of `"mcpServers"`.

## stdio-only clients

```json
{
  "mcpServers": {
    "haulest": { "command": "npx", "args": ["-y", "haulest-mcp"] }
  }
}
```

or `npx -y mcp-remote https://haulest.com/mcp`.

## Inspector

```bash
npx @modelcontextprotocol/inspector
```

Transport *Streamable HTTP*, URL `https://haulest.com/mcp`.

## Partner API keys

Higher limits are available with a key from info@haulest.com. Send it as
`Authorization: Bearer hk_...` or `X-Haulest-Key: hk_...`. Anonymous use
works without one.
