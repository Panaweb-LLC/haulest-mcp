# Listing Haulest in MCP directories

| Directory | How | Asset |
| --- | --- | --- |
| ChatGPT plugin directory (OpenAI) | Portal upload of a plugin ZIP, *With MCP* connect, domain challenge | `openai-plugin/` and `openai-plugin/SUBMISSION.md` |
| Claude connectors directory (Anthropic) | https://claude.ai/directory/manage, MCP connector | `claude-connector/SUBMISSION.md` |
| Official MCP Registry (registry.modelcontextprotocol.io) | `mcp-publisher login http --domain haulest.com --private-key ...` then `mcp-publisher publish server.json` | `server.json`; the public key line is served at https://haulest.com/.well-known/mcp-registry-auth (set on the Haulest desk) |
| GitHub MCP Registry / VS Code gallery | Fed from the official registry once published | same `server.json` |
| npm | `cd bridge && npm publish` (package `haulest-mcp`, `mcpName` set). After it is live, add the `packages` block back to `server.json` and republish | `bridge/` |
| Glama | Add the GitHub repo at https://glama.ai/mcp/servers; `glama.json` names the maintainer | `glama.json` |
| Smithery, mcp.so, PulseMCP, mcpservers.org, Cursor directory | Submit the repo URL and the endpoint through each site's form | README |

## Official registry: generating the key once

```bash
openssl genpkey -algorithm Ed25519 -out haulest-mcp-registry.pem   # keep this file private
PUBLIC_KEY="$(openssl pkey -in haulest-mcp-registry.pem -pubout -outform DER | tail -c 32 | base64)"
echo "v=MCPv1; k=ed25519; p=${PUBLIC_KEY}"     # paste this line on haulest.com/admin/mcp
PRIVATE_KEY="$(openssl pkey -in haulest-mcp-registry.pem -noout -text | grep -A3 'priv:' | tail -n +2 | tr -d ' :\n')"
mcp-publisher login http --domain haulest.com --private-key "${PRIVATE_KEY}"
mcp-publisher publish server.json
```

The registry verifies the `com.haulest` namespace against
`https://haulest.com/.well-known/mcp-registry-auth`. Bump `version` in
`server.json` and in `bridge/package.json` together.
