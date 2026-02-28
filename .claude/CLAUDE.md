# CLAUDE.md - StealthSurf MCP Server

## Project Overview

**StealthSurf MCP Server** is a stateless proxy that exposes the StealthSurf VPN API as MCP (Model Context Protocol) tools, resources, and prompts. AI agents (Claude Desktop, Cursor, etc.) connect via Streamable HTTP and manage VPN configs, cloud servers, paid options, and more through natural language.

Architecture: MCP Client → MCP Server (this project) → StealthSurf API (maputo-v1).

## Architecture

```text
MCP Client (Claude Desktop / Cursor)
  │  POST / (Authorization: Bearer stlth_...)
  ▼
This service (Node.js, Streamable HTTP)
  │  HTTP fetch (Authorization: Bearer stlth_...)
  ▼
StealthSurf API (NestJS backend, unchanged)
```

### Key Directories

- `src/tools/` — MCP tool registrations (1 file per API domain, 92 tools total)
- `src/resources/` — MCP resources (4 total: guide, errors, updates, protocols)
- `src/prompts/` — MCP prompt templates (11 total: setup, troubleshoot, optimize, etc.)
- `src/schemas/` — Shared zod schemas and helpers
- `src/api-client.ts` — HTTP client wrapper for StealthSurf API
- `src/server.ts` — McpServer factory
- `src/index.ts` — HTTP entry point

### Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | HTTP server, auth extraction, MCP transport setup |
| `src/server.ts` | Creates McpServer, registers all tools, resources, and prompts |
| `src/api-client.ts` | Fetch wrapper with auth, envelope unwrapping, error handling |
| `src/schemas/shared.ts` | Shared zod schemas, `toolResult()`, `toolError()` helpers |
| `src/prompts/index.ts` | Registers all 11 prompt templates |

## MCP Capabilities

### Resources (4)

| URI | Type | Description |
|-----|------|-------------|
| `stealthsurf://guide` | Dynamic (fetch) | Full documentation from docs.stealthsurf.app |
| `stealthsurf://updates` | Dynamic (fetch) | Changelog from updates.stealthsurf.app |
| `stealthsurf://errors` | Static | API error codes reference |
| `stealthsurf://protocols` | Static | Protocol comparison, compatibility matrix, recommendations |

### Prompts (11)

| Name | Description |
|------|-------------|
| `setup-vpn` | Interactive VPN config creation wizard |
| `troubleshoot` | Connection issue step-by-step diagnostics |
| `optimize-for-region` | Protocol and settings recommendations by region |
| `account-overview` | Full account status report |
| `bulk-renew` | Batch renewal of expiring configs |
| `setup-family` | Custom subscription for sharing with family/friends |
| `setup-cloud-server` | Full VPS setup wizard |
| `switch-protocol` | Bulk protocol migration with compatibility check |
| `setup-bridge` | Dual-hop bridge creation guide |
| `device-audit` | Device security audit across all subscriptions |
| `xray-config` | Custom XRay configuration guide with routing rules |

### Tools (92)

13 tool files mirroring the backend controller structure. See `src/tools/` for details.

## Development

```bash
yarn dev        # Start with tsx watch
yarn build      # TypeScript compilation
yarn start      # Run production build
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `STEALTHSURF_API_URL` | `https://api.stealthsurf.app` | Backend API URL |
| `PORT` | `3000` | Server port |

## Key Patterns

- **Stateless**: Each POST creates fresh McpServer + transport, no sessions
- **Auth passthrough**: `stlth_*` key extracted from MCP request headers, forwarded 1:1 to API
- **Thin proxy**: Zero business logic — tools map directly to API endpoints
- **Consistent tool pattern**: Every tool wraps in try/catch, uses `toolResult()`/`toolError()`
- **Resources for context**: Static and dynamic resources provide reference data without API calls
- **Prompts as workflows**: Templates guide agents through multi-step scenarios

## Adding New Features

### Tools

1. Find the matching `src/tools/*.ts` file
2. Add `server.tool()` with zod schemas, annotations, and try/catch pattern
3. Run `yarn build`

### Resources

1. Create `src/resources/{name}.ts`
2. Register in `src/server.ts`

### Prompts

1. Create `src/prompts/{name}.ts`
2. Register in `src/prompts/index.ts`
