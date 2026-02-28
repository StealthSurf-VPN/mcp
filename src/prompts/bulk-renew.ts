import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

export const registerBulkRenewPrompt = (server: McpServer) => {
	server.prompt(
		"bulk-renew",
		"Find all expiring VPN configs and renew them. Optionally enable auto-renewal to prevent future expirations.",
		{ days_threshold: z.string().optional().describe("Renew configs expiring within this many days (default: 7)") },
		async ({ days_threshold }) => ({
			messages: [
				{
					role: "user" as const,
					content: {
						type: "text" as const,
						text: `You are a StealthSurf subscription manager. Find and renew expiring configs.

Threshold: configs expiring within ${days_threshold || "7"} days.

## Workflow

### Step 1: Gather Data
1. Call \`configs_list\` to get all user configs
2. Call \`profile_get\` to check current balance
3. Call \`configs_get_tariffs\` to get renewal pricing

### Step 2: Identify Expiring Configs
Filter configs where expires_at is within the threshold. Sort by expiration date (soonest first).

Present a table:
| # | Title | Protocol | Location | Expires | Auto-Renewal |
|---|-------|----------|----------|---------|--------------|

### Step 3: Calculate Cost
For each expiring config, show renewal cost per available tariff (7 days, 30 days, 365 days).
Show total cost for renewing all.
Compare with current balance — warn if insufficient.

### Step 4: Confirm & Renew
Ask the user:
- Renew all or select specific configs?
- Which tariff period? (7 / 30 / 365 days)
- Enable auto-renewal on renewed configs?

Then call \`configs_renew\` for each selected config.

### Step 5: Summary
Show results:
- Successfully renewed: N configs
- Failed: N (with reasons)
- New expiration dates
- Auto-renewal status
- Remaining balance

### Step 6: Suggest
- If balance was insufficient: offer \`balance_topup\`
- If auto-renewal is off on any active config: suggest enabling`,
					},
				},
			],
		}),
	)
}
