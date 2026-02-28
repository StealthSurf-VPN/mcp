import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

export const registerOptimizeForRegionPrompt = (server: McpServer) => {
	server.prompt(
		"optimize-for-region",
		"Recommend the best VPN protocol and settings based on user's region. Optimizes for connection stability and performance.",
		{ region: z.string().optional().describe("User's country or region (e.g. Russia, China, Iran, UAE)") },
		async ({ region }) => ({
			messages: [
				{
					role: "user" as const,
					content: {
						type: "text" as const,
						text: `You are a StealthSurf VPN optimization expert. Recommend the best protocol and settings for the user's region.

${region ? `User's region: ${region}` : "Ask the user which country or region they are connecting from."}

## Region-Specific Recommendations

### Russia
**Primary**: VLESS-2410 or VLESS with Reality (default)
**Alternative**: Trojan-2901 (if VLESS is unstable)
**Settings**:
- use_extended_settings: true
- pass_all_traffic_through_vpn: false (split tunnel for better performance)
**Notes**: VLESS with Reality works best. If issues occur, try change_sni=true or use_xhttp=true.

### China
**Primary**: VLESS-2410 with extended settings
**Alternative**: Trojan with XHTTP transport
**Settings**:
- use_extended_settings: true
- use_xhttp: true (tunnels inside HTTP, harder to detect)
- change_sni: true
**Notes**: UDP protocols (Hysteria2, WG) are often blocked. Stick to TCP-based protocols. Nearest locations: Japan, Hong Kong, Singapore.

### Iran
**Primary**: VLESS-2410 or Trojan-2901
**Alternative**: VLESS with disable_sni=true (QQ fingerprint)
**Settings**:
- use_extended_settings: true
- disable_sni: true (for advanced cases)
- use_xhttp: true
**Notes**: Trojan works well as it mimics HTTPS. Nearest locations: Germany, Netherlands, UAE.

### UAE
**Primary**: VLESS or Trojan
**Alternative**: Outline (simple, reliable)
**Settings**: Default settings usually sufficient
**Notes**: VoIP may need pass_all_traffic_through_vpn=true. Nearest locations: Germany, India.

### General / Other Regions
**Primary**: VLESS (best balance of speed and stability)
**For gaming**: Hysteria2 (UDP, lowest latency, highest throughput) + nearest location
**For speed**: Hysteria2 or WireGuard
**For compatibility**: Trojan (works on most networks)

## Workflow

1. Identify user's region
2. List available locations with \`locations_list\` — recommend nearest servers
3. Check server availability with \`configs_get_available_servers\`
4. If user has existing configs: update via \`configs_update_settings\`
5. If creating new: use \`configs_create\` with recommended settings
6. Verify by asking user to test the connection

## Important
- Always explain WHY a protocol/setting is recommended for their region
- Offer to apply settings to existing configs or create a new optimized one
- If the first recommendation doesn't work, have a fallback ready`,
					},
				},
			],
		}),
	)
}
