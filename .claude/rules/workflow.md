# Workflow

## Core Principles

- **Simplicity First**: This is a thin proxy. No business logic. Ever.
- **1:1 Mapping**: Each tool maps to exactly one StealthSurf API endpoint
- **Consistency**: All tools follow the same pattern (see code-style.md)

## Build Verification

**CRITICAL**: After ANY code changes, ALWAYS run `yarn build`
and ensure it exits with code 0.

## Adding Tools

1. Identify which `src/tools/*.ts` file the endpoint belongs to
2. Add `server.tool()` following the existing pattern in that file
3. Use the same zod validation as the API's DTO (check maputo-v1 DTOs)
4. Run `yarn build`

## Tool Naming Convention

Format: `{domain}_{action}`

Examples:

- `configs_list` (GET /configs)
- `configs_create` (POST /configs)
- `cloud_servers_reboot` (POST /cloud-servers/:id/reboot)
- `paid_option_configs_update_settings`
  (PATCH /paid-options/:id/configs/:cid/settings)

## Error Handling

- Tools never throw — they return `toolError(e)` with `isError: true`
- The `api-client.ts` throws on API errors with format
  `API Error [code]: message`
- Tool callbacks catch and wrap all errors
