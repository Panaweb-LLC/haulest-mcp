# Submitting Haulest to the ChatGPT plugin directory

Status as of 7 October 2026. OpenAI's flow changes often; check
https://developers.openai.com/plugins/deploy/submission and
https://developers.openai.com/plugins/deploy/app-review before each step.

## Before the portal

1. **Identity.** In the OpenAI Platform Dashboard, complete *business
   verification* for Panaweb LLC. Publishing under an unverified name is
   rejected. You need the `api.apps.write` permission (org owner has it).
2. **Server live.** `https://haulest.com/mcp` answers `initialize` and
   `tools/list` (test with `npx @modelcontextprotocol/inspector`, transport
   Streamable HTTP). The origin can never change after publication; only the
   path can.
3. **Public URLs live and matching the publisher:** haulest.com (website),
   haulest.com/developers/mcp (support), haulest.com/privacy, haulest.com/terms.
4. **Policy fit.** No ads, no pricing or subscription talk in the listing,
   no commerce (quotes are free; nothing is sold in chat). All tools have
   explicit `readOnlyHint`, `destructiveHint`, `openWorldHint`. Read and
   write are separate tools. Inputs never ask for precise GPS or chat history.

## Build the ZIP

```bash
cd openai-plugin
zip -r ../haulest-plugin.zip plugin.json mcp.json assets
```

The ZIP holds `plugin.json`, `mcp.json` (exactly one remote server), and
`assets/` (square PNG icons, at least 48 by 48; ours are 512). Do **not**
include `.app.json`, hooks, credentials, or `review.json`.

## In the portal

1. Plugins, *Upload new or existing plugin*, pick the verified developer
   identity, upload the ZIP. Fix anything the Metadata & Skills tab flags.
2. MCPs, select `haulest`, *Connect*. MCP Server URL
   `https://haulest.com/mcp`, Authentication **None**.
3. **Domain verification.** The portal shows a challenge token. Paste it on
   `https://haulest.com/admin/mcp` (owner only, "Directory verification
   tokens"). Within 15 seconds
   `https://haulest.com/.well-known/openai-apps-challenge` serves exactly that
   token as `text/plain`. Click verify.
4. *Scan Tools*. The snapshot of names, descriptions, schemas, annotations,
   and server instructions becomes the versioned contract. Read *Issues*.
5. Review details: paste the five positive and three negative test cases
   from `review.json`; add the demo recording URL; release notes. No test
   credentials are needed (state "No sign-in; public read tools; the write
   tool requires consent in the call").
6. *Submit for review* and complete the attestations.

## After approval

*Publish plugin*. Server-side changes (descriptions, schemas, instructions)
are rescanned daily and go live after automated checks; a new ZIP is only
needed for listing metadata.

Keep the tool names and schemas backward compatible. Switch a tool off on
the desk only for a real incident: a missing tool is a listing change.
