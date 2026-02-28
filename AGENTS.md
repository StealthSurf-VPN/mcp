# AGENTS.md - StealthSurf MCP Server

## Project Context

This is a **stateless MCP proxy server** that maps StealthSurf VPN API
endpoints to MCP tools. It allows AI agents to manage VPN configurations,
cloud servers, paid options, and user profiles through natural language.

## Architecture

- **Runtime**: Node.js 22+, TypeScript, ES modules
- **MCP SDK**: `@modelcontextprotocol/sdk` with Streamable HTTP transport
- **Transport**: Stateless — each POST creates fresh McpServer + transport
- **Auth**: `stlth_*` API key from `Authorization: Bearer` header,
  forwarded to backend API
- **No framework**: Raw `http.createServer` + MCP SDK transport

## Repository Structure

```text
src/
├── index.ts              # HTTP server entry point
├── server.ts             # McpServer factory (registers tools, resources, prompts)
├── api-client.ts         # Fetch wrapper for StealthSurf API
├── schemas/
│   └── shared.ts         # Reusable zod schemas + toolResult/toolError helpers
├── resources/            # 4 MCP resources
│   ├── guide.ts              # Full docs (fetched from docs.stealthsurf.app)
│   ├── errors.ts             # API error codes reference (static)
│   ├── updates.ts            # Changelog (fetched from updates.stealthsurf.app)
│   └── protocols.ts          # VPN protocol comparison + compatibility (static)
├── prompts/              # 11 MCP prompt templates
│   ├── index.ts              # Registers all prompts
│   ├── setup-vpn.ts          # Interactive VPN config creation wizard
│   ├── troubleshoot.ts       # Connection issue diagnostics
│   ├── optimize-for-region.ts # Protocol recommendations by region
│   ├── account-overview.ts   # Full account status report
│   ├── bulk-renew.ts         # Batch renewal of expiring configs
│   ├── setup-family.ts       # Custom subscription for sharing
│   ├── setup-cloud-server.ts # VPS setup wizard
│   ├── switch-protocol.ts    # Bulk protocol migration
│   ├── setup-bridge.ts       # Dual-hop bridge creation
│   ├── device-audit.ts       # Device security audit
│   └── xray-config.ts        # Custom XRay configuration guide
└── tools/                # 13 files, 92 MCP tools total
    ├── configs.ts            # VPN configs (15 tools)
    ├── cloud-servers.ts      # Cloud servers (6 tools)
    ├── cloud-configs.ts      # Cloud server configs (6 tools)
    ├── cloud-proxies.ts      # Cloud server proxies (5 tools)
    ├── paid-options.ts       # Paid options core (12 tools)
    ├── paid-option-configs.ts # Paid option configs (10 tools)
    ├── profile.ts            # Profile + telegram (8 tools)
    ├── profile-devices.ts    # Devices (6 tools)
    ├── profile-balance.ts    # Balance (2 tools)
    ├── profile-referral.ts   # Referral program (4 tools)
    ├── profile-history.ts    # Payments + promocodes (2 tools)
    ├── custom-subscriptions.ts # Custom subscriptions (14 tools)
    └── utility.ts            # Locations + XRay keys (2 tools)
```

## Key Design Decisions

1. **Thin proxy** — zero business logic.
   Each MCP tool = one HTTP request to the API.
2. **Stateless mode** — `sessionIdGenerator: undefined`.
   No session tracking needed.
3. **Per-request server** — each POST creates a fresh McpServer+transport,
   processes, closes.
4. **Auth passthrough** — API key extracted from MCP request headers,
   baked into ApiClient for the request lifetime.
5. **Tool files mirror API controllers** — 1:1 mapping with the NestJS
   backend's controller structure.
6. **Resources for context** — static and dynamic resources give agents
   reference data (protocols, errors, docs) without API calls.
7. **Prompts as workflows** — prompt templates guide agents through
   multi-step scenarios (setup, troubleshooting, optimization).

## Commands

```bash
yarn dev        # Development with hot reload (tsx watch)
yarn build      # TypeScript compilation to dist/
yarn start      # Run production build
```

## Adding New Tools

When a new endpoint is added to the StealthSurf API (maputo-v1):

1. Open the matching `src/tools/*.ts` file
2. Add `server.tool()` following the pattern:

   ```typescript
   server.tool("domain_action", "Description", {
     param: z.number().int().describe("..."),
   }, annotations.readOnly, async ({ param }) => {
     try {
       const data = await api.get(`/path/${param}`)
       return toolResult(data)
     } catch (e) {
       return toolError(e)
     }
   })
   ```

3. Run `yarn build` to verify

## Adding New Resources

1. Create `src/resources/{name}.ts` with a `register{Name}Resource` function
2. Import and call in `src/server.ts`
3. Static resources embed data directly; dynamic resources fetch on read

## Adding New Prompts

1. Create `src/prompts/{name}.ts` with a `register{Name}Prompt` function
2. Import and call in `src/prompts/index.ts`
3. Prompts return messages that guide the AI through multi-step workflows

## Related Projects

- **maputo-v1** — StealthSurf NestJS backend (the API this server proxies)
- API key system: `src/middleware/params/params.middleware.ts` in maputo-v1
- Allowed routes: `API_KEY_ALLOWED_ROUTES` in the same file

## Testing

```bash
# Start server
yarn dev

# Test tools/list
curl -s -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Authorization: Bearer stlth_your_key_here" \
  -d '{"jsonrpc":"2.0","method":"initialize","id":1,
    "params":{"protocolVersion":"2025-03-26",
    "capabilities":{},
    "clientInfo":{"name":"test","version":"1.0"}}}'
```
