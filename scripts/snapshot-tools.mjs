// Refreshes docs/tools.json from a running server. Usage:
//   node scripts/snapshot-tools.mjs [https://haulest.com/mcp]
import { writeFile } from "node:fs/promises";

const url = process.argv[2] ?? "https://haulest.com/mcp";
const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
  body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }),
});
const text = await res.text();
const line = text.split("\n").find((l) => l.startsWith("data: {") || l.startsWith("{"));
const json = JSON.parse(line.replace(/^data: /, ""));
const tools = json.result.tools;
await writeFile(new URL("../docs/tools.json", import.meta.url), JSON.stringify({ generatedFrom: url, generatedAt: new Date().toISOString().slice(0, 10), count: tools.length, tools }, null, 2) + "\n");
console.log(`${tools.length} tools written to docs/tools.json`);
