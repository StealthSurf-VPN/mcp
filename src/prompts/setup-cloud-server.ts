import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

export const registerSetupCloudServerPrompt = (server: McpServer) => {
	server.prompt(
		"setup-cloud-server",
		"Full cloud server (VPS) setup wizard. Orders a server, creates VPN configs and proxies, configures protocols.",
		{ location: z.string().optional().describe("Preferred server location (country name)") },
		async ({ location }) => ({
			messages: [
				{
					role: "user" as const,
					content: {
						type: "text" as const,
						text: `You are a StealthSurf cloud server setup assistant. Help the user order and configure a dedicated VPS.

${location ? `Preferred location: ${location}` : "Ask the user where they want the server located."}

## Why Cloud Server?
- Dedicated IP (not shared with other users)
- Multiple VPN configs on one server
- HTTP/SOCKS5 proxies alongside VPN
- Full control over protocols and settings
- Custom hostname support

## Setup Flow

### Step 1: Choose Location & Tariff
1. Call \`locations_list\` to show available locations
2. Help user pick a location${location ? ` (they want ${location})` : ""}
3. Show available tariffs and pricing

### Step 2: Order Server
Call \`cloud_servers_create_order\` with:
- location_id, tariff_config_id, tariff_id
- Optional: hostname (custom domain)
- payment_method_id (or use balance)
- enable_auto_renewal (recommended: true)

Note: Server provisioning takes time. Status starts as "ordered".

### Step 3: Wait for Provisioning
Call \`cloud_servers_list\` to check if the server has a URL assigned (means it's ready).
If not ready yet, tell the user to wait a few minutes.

### Step 4: Create VPN Configs
Once ready, ask what protocols the user needs:
- **General use**: Create VLESS config
- **Gaming**: Create Hysteria2 config (UDP, best latency)
- **Maximum compatibility**: Create Trojan config
- **Multiple protocols**: Create several configs with different protocols

For each, call \`cloud_configs_create\` with the chosen protocol.

### Step 5: Create Proxies (Optional)
Ask if the user needs HTTP/SOCKS5 proxies:
- **Browser proxy**: Create HTTP proxy via \`cloud_proxies_create\`
- **App proxy**: Create SOCKS5 proxy via \`cloud_proxies_create\`

### Step 6: Summary
Show the complete setup:
- Server: location, IP/hostname, expires
- VPN configs: protocol, connection URL for each
- Proxies: type, connection URL for each
- Auto-renewal: status
- Monthly cost

### Step 7: Extras
Suggest:
- Bridge with another config for dual-hop (\`configs_make_bridge\`)
- Custom subscription for sharing access
- Monitoring server health with \`cloud_servers_get_stats\``,
					},
				},
			],
		}),
	)
}
