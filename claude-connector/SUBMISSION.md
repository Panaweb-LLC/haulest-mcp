# Submitting Haulest to the Claude connectors directory

Portal: https://claude.ai/directory/manage (paid Claude plan), choose
**MCP connector**. Docs: https://claude.com/docs/connectors/building/submission
and the review criteria at
https://claude.com/docs/connectors/building/review-criteria.

## Fields

| Field | Value |
| --- | --- |
| Name | Haulest |
| Server URL | https://haulest.com/mcp |
| Transport | Streamable HTTP |
| Authentication | None (public read tools; the one write asks for consent in the call) |
| Short description | Moving cost ranges, reviewed movers, licence checks, guides, and quote requests for the US, Canada, and UK. |
| Documentation URL | https://haulest.com/developers/mcp |
| Privacy policy | https://haulest.com/privacy (section "AI assistants (the Haulest connector)") |
| Terms | https://haulest.com/terms |
| Support | info@haulest.com, +1 (866) 961-9682 |
| Test credentials | Not needed; say so. |
| Allowed link URIs | https://haulest.com |

## Example prompts (three or more, different tools)

1. What would it cost to move a 2-bedroom from Austin to Denver, and who are the best-reviewed movers in Austin?
2. Check USDOT 2250254 before I pay a deposit.
3. Give me the 8-week moving checklist and the guide on binding versus non-binding estimates.
4. Are there reviewed removal companies in Manchester, and how do I check one at Companies House?
5. I have a quote from a low-rated mover. What should I ask them, and can you get me two more written quotes?

## Checklist against the review criteria

- Every tool has a `title`, `readOnlyHint: true` on the seven read tools, `destructiveHint: false` everywhere (the write is additive and never deletes). Names are under 64 characters.
- Read and write are separate tools; there is no catch-all request tool.
- Descriptions state what each tool does and when to use it; none instruct Claude to call other software, pull instructions from elsewhere, or promote anything.
- Valid inputs return a successful result; invalid inputs return an actionable error (which field, what to do). No bare "Internal Server Error".
- Responses are sized for the question (6 movers by default, 3 recent reviews, 5 guides).
- The server calls Haulest's own data plus the official FMCSA and Companies House registers it already proxies on the website.
- No money movement, no media generation.
- Tested with the MCP Inspector and as a custom connector in Claude before submitting.
