// Spawns the bridge against HAULEST_MCP_URL (default: production) and checks the tool list round-trips.
import { test } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

test("bridge lists Haulest tools over stdio and answers a call", async () => {
  const client = new Client({ name: "bridge-test", version: "1.0.0" });
  const transport = new StdioClientTransport({ command: process.execPath, args: ["bin/haulest-mcp.mjs"], env: { ...process.env } });
  await client.connect(transport);
  const { tools } = await client.listTools();
  assert.ok(tools.some((t) => t.name === "estimate_moving_cost"));
  const result = await client.callTool({ name: "estimate_moving_cost", arguments: { homeSize: "2bed", distanceBand: "local" } });
  assert.equal(result.isError, false);
  assert.ok(result.structuredContent.low > 0);
  await client.close();
});
