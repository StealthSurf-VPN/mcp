import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export const registerAccountOverviewPrompt = (server: McpServer) => {
	server.prompt(
		"account-overview",
		"Generate a comprehensive account status report: balance, configs, servers, subscriptions, devices, and expiring items.",
		{},
		async () => ({
			messages: [
				{
					role: "user" as const,
					content: {
						type: "text" as const,
						text: `You are a StealthSurf account analyst. Generate a complete overview of the user's account.

## Data Collection

Call these tools in parallel to gather all account data:

1. \`profile_get\` — balance, referral balance, onboarding status
2. \`configs_list\` — all VPN configs
3. \`cloud_servers_list\` — cloud servers (VPS)
4. \`paid_options_list\` — paid options
5. \`custom_subscriptions_list\` — custom subscription bundles
6. \`devices_list\` — connected devices

## Report Format

Present the report in this structure:

### Account Summary
- Balance: X ₽
- Referral balance: X ₽
- Total configs: N
- Cloud servers: N
- Paid options: N
- Custom subscriptions: N
- Connected devices: N

### Configs Status
- Active: N (list with protocol, location, expires)
- Expiring within 7 days: N (⚠️ highlight these)
- Expired: N
- Auto-renewal enabled: N / total

### Cloud Servers
- List each: location, status, hostname, expires
- Configs on each server

### Paid Options
- List each: type, status, expires, device count/limit

### Custom Subscriptions
- List each: title, items count, device count/limit

### Devices
- List: name, type, last seen, blocked status

### Recommendations
Based on the data, suggest:
- Configs expiring soon → renew or enable auto-renewal
- Unused configs (expired, no activity) → consider cleanup
- No auto-renewal on active configs → suggest enabling
- High device count → review and block unknown devices
- Low balance with auto-renewal → suggest topping up`,
					},
				},
			],
		}),
	)
}
