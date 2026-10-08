# Security

The Haulest MCP server runs at `https://haulest.com/mcp` inside the haulest.com
application. It needs no credentials, reads public data, and has one write
(a quote request) that requires the person's explicit consent in the call.

Please report a vulnerability to **info@haulest.com** (see
https://haulest.com/.well-known/security.txt). We acknowledge within two
business days and fix confirmed issues before any public note.

What is in place:

- Per-IP and per-key rate limits with `Retry-After`; a daily cap on quote requests; duplicate detection on phone and email.
- Every tool can be switched off from the Haulest desk without a deploy; a master switch returns 503 to all clients.
- Tool results never include tokens, session identifiers, request IDs, or other people's contact details.
- Call logging keeps the tool name, time, outcome, client product, and a salted short hash of the network address for 90 days. Arguments are not logged.
- Inputs are validated with JSON Schema (zod) before any handler runs.
