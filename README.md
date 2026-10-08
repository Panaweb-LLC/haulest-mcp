# Haulest MCP server

**Endpoint:** `https://haulest.com/mcp` (Streamable HTTP, no sign-in)
**Docs:** https://haulest.com/developers/mcp

[Haulest](https://haulest.com) is a consumer moving research and quote site
for the United States, Canada, and the United Kingdom. This connector gives
any Model Context Protocol client the same research the website publishes:
cost ranges, reviewed movers, licence records, guides, checklists, and a way
to request written quotes from licensed movers.

Haulest is not a carrier. It does not operate trucks, a range is a planning
number and not a bid, and a quote conversation is not a booking.

## Connect

| Client | How |
| --- | --- |
| Claude (web, desktop, mobile) | Settings, Connectors, *Add custom connector*, paste `https://haulest.com/mcp` |
| Claude Code | `claude mcp add --transport http haulest https://haulest.com/mcp` |
| ChatGPT | Settings, Apps & Connectors, Developer mode, *Create*, paste the URL, auth *None* |
| Cursor, VS Code, Windsurf, Zed | `{ "mcpServers": { "haulest": { "type": "http", "url": "https://haulest.com/mcp" } } }` |
| stdio-only clients | `npx -y haulest-mcp` (this repo's [bridge](bridge/)) or `npx -y mcp-remote https://haulest.com/mcp` |

More in [docs/connecting.md](docs/connecting.md).

## Tools

| Tool | What it does | Annotations |
| --- | --- | --- |
| `estimate_moving_cost` | Research cost range from home size and distance (band, miles, or two places) | read-only |
| `get_route_facts` | Driving miles and hours, ranges, and Census migration for a Haulest route page | read-only |
| `find_movers` | Reviewed movers in a city, state, province, or country with rating, review count, USDOT, URL | read-only |
| `get_mover_profile` | One company: rating, newest reviews, licence identifiers with live FMCSA authority, public phone | read-only, open-world |
| `check_mover_licence` | FMCSA census by USDOT, MC, or name; Companies House for the UK; Canada guidance | read-only, open-world |
| `search_moving_guides` | Guides, calculators, and checklists about estimates, deposits, claims, rights, timing | read-only |
| `get_moving_checklist` | A full checklist: 8-week, moving day, first night, change of address, international | read-only |
| `request_moving_quotes` | Files a quote request so licensed movers call and email; needs `consent: true` | write, not destructive |

The exact schemas as served are in [docs/tools.json](docs/tools.json)
(refresh with `node scripts/snapshot-tools.mjs`). The server also exposes a
`plan_my_move` prompt and two resources (the cost dataset as JSON, an About
text).

## Try it

- "What would it cost to move a 2-bedroom from Austin to Denver, and who are the best-reviewed movers in Austin?"
- "Check USDOT 2250254 before I pay a deposit."
- "Give me the 8-week moving checklist and the guide on binding versus non-binding estimates."
- "Are there reviewed removal companies in Manchester, and how do I check one at Companies House?"

## What is in this repository

The server itself runs inside the haulest.com application (Next.js on
Vercel) because it reads the same licensed review corpus and official
records the website does. This repository holds the public interface:

- `bridge/`: the `haulest-mcp` npm package, a stdio bridge to the endpoint.
- `server.json`: the official MCP Registry entry (`com.haulest/haulest`).
- `openai-plugin/`: the ChatGPT plugin package (`plugin.json`, `mcp.json`, icons) with review test cases and the submission walkthrough.
- `claude-connector/`: the Claude connectors directory submission notes.
- `docs/`: connecting, directory listings, and the tool snapshot.

## Fair use, privacy, security

Anonymous callers have per-minute and per-day limits per network address
(429 with `Retry-After`). Quote requests are limited per hour and capped per
day, and a repeat from the same phone or email within a day returns the
existing reference. Partner keys with higher limits: info@haulest.com.

Haulest logs each call with the tool name, time, outcome, client product,
and a salted short hash of the network address for 90 days; arguments are
not logged. See the [privacy policy](https://haulest.com/privacy) and
[SECURITY.md](SECURITY.md).

## License

MIT for the code in this repository. Haulest content and data served by the
endpoint remain subject to https://haulest.com/terms.
