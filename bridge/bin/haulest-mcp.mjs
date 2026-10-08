#!/usr/bin/env node
// stdio <-> Streamable HTTP bridge for the Haulest MCP server.
//
//   npx -y haulest-mcp                         # talks to https://haulest.com/mcp
//   HAULEST_MCP_URL=http://127.0.0.1:43210/mcp npx -y haulest-mcp   # a local build
//   HAULEST_MCP_KEY=hk_...                     # optional partner key for higher limits
//
// Every tool, prompt, and resource the remote server lists is re-exposed on
// stdio unchanged; calls are forwarded as-is. Nothing is cached or stored.
import { Client, StreamableHTTPClientTransport, fromJsonSchema } from "@modelcontextprotocol/client";
import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";

const REMOTE = process.env.HAULEST_MCP_URL ?? "https://haulest.com/mcp";
const KEY = process.env.HAULEST_MCP_KEY ?? "";
const VERSION = "1.0.0";

const headers = { "User-Agent": `haulest-mcp/${VERSION} (stdio bridge; node ${process.version})` };
if (KEY) headers.Authorization = `Bearer ${KEY}`;

const remote = new Client({ name: "haulest-mcp-bridge", version: VERSION });
await remote.connect(new StreamableHTTPClientTransport(new URL(REMOTE), { requestInit: { headers } }));

const init = remote.getServerVersion?.() ?? { name: "haulest", version: "remote" };
const instructions = remote.getInstructions?.() ?? undefined;

const local = new McpServer({ name: init.name ?? "haulest", version: init.version ?? VERSION }, { instructions });

const { tools } = await remote.listTools();
for (const tool of tools) {
  local.registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema ? fromJsonSchema(tool.inputSchema) : undefined,
      annotations: tool.annotations,
      _meta: tool._meta,
    },
    async (args) => remote.callTool({ name: tool.name, arguments: args ?? {} }),
  );
}

try {
  const { prompts } = await remote.listPrompts();
  for (const prompt of prompts) {
    const shape = {};
    for (const arg of prompt.arguments ?? []) {
      shape[arg.name] = { type: "string", description: arg.description };
    }
    local.registerPrompt(
      prompt.name,
      {
        title: prompt.title,
        description: prompt.description,
        argsSchema: fromJsonSchema({ type: "object", properties: shape, required: (prompt.arguments ?? []).filter((a) => a.required).map((a) => a.name) }),
      },
      async (args) => remote.getPrompt({ name: prompt.name, arguments: args ?? {} }),
    );
  }
} catch {
  // Remote has no prompts; fine.
}

try {
  const { resources } = await remote.listResources();
  for (const resource of resources) {
    local.registerResource(
      resource.name,
      resource.uri,
      { title: resource.title, description: resource.description, mimeType: resource.mimeType },
      async (uri) => remote.readResource({ uri: uri.href }),
    );
  }
} catch {
  // Remote has no resources; fine.
}

await local.connect(new StdioServerTransport());
process.stderr.write(`haulest-mcp bridge ready: ${tools.length} tools from ${REMOTE}\n`);
