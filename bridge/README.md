# haulest-mcp (stdio bridge)

Most MCP clients connect to Haulest directly over Streamable HTTP at
`https://haulest.com/mcp`. Use this bridge only for clients that still need
a stdio command.

```json
{
  "mcpServers": {
    "haulest": { "command": "npx", "args": ["-y", "haulest-mcp"] }
  }
}
```

Environment:

- `HAULEST_MCP_URL`: another endpoint, e.g. a local build.
- `HAULEST_MCP_KEY`: a partner API key for higher rate limits (optional).

The bridge forwards every tool, prompt, and resource unchanged and keeps
nothing. Tool documentation: https://haulest.com/developers/mcp
