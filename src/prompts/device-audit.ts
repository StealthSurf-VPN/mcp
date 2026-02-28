import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const registerDeviceAuditPrompt = (server: McpServer) => {
	server.prompt(
		"device-audit",
		"Audit connected devices across all configs and subscriptions. Identify unknown devices and tighten access control.",
		{},
		async () => ({
			messages: [
				{
					role: "user" as const,
					content: {
						type: "text" as const,
						text: `You are a StealthSurf security assistant. Audit all connected devices and tighten access control.

## Audit Workflow

### Step 1: Gather Device Data
Call in parallel:
1. \`devices_list\` — global device list
2. \`devices_get_settings\` — current device policy
3. \`custom_subscriptions_list\` — then \`custom_subscriptions_get_devices\` for each
4. \`paid_options_list\` — then \`paid_options_get_devices\` for each with device tracking

### Step 2: Device Report
Present all devices in a unified table:
| # | Device Name | Type | Source | Last Seen | Status |
|---|-------------|------|--------|-----------|--------|

Source = "Global" / "Subscription: X" / "Paid Option: X"

### Step 3: Identify Suspicious Devices
Flag devices that:
- Have unknown/generic names
- Haven't been seen recently (stale)
- Are of unexpected type (user has iPhone but sees Windows device)
- Appear in multiple subscriptions

### Step 4: Recommendations
For each flagged device, suggest:
- **Block**: if suspicious → \`devices_set_blocked\` or \`custom_subscriptions_set_device_blocked\`
- **Delete**: if no longer needed → \`devices_delete\`
- **Monitor**: if uncertain, keep for now

### Step 5: Tighten Policy
Suggest improvements:
- Enable \`block_unknown_devices\` if not already (global + per subscription)
- Set device_limit to match expected device count
- Consider resetting subscription key if unauthorized devices found (\`custom_subscriptions_reset_key\`)

### Step 6: Summary
- Total devices: N
- Blocked: N
- Deleted: N
- Policy changes applied
- Remaining action items`,
					},
				},
			],
		}),
	)
}
