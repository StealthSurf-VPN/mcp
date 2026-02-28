import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

export const registerSwitchProtocolPrompt = (server: McpServer) => {
	server.prompt(
		"switch-protocol",
		"Switch VPN protocol on one or multiple configs. Explains differences between protocols and applies changes.",
		{
			target_protocol: z.string().optional().describe("Protocol to switch to (vless, vless-2410, trojan, trojan-2901, outline, hysteria2, shadowsocks-2022, wg, mtproto)"),
		},
		async ({ target_protocol }) => ({
			messages: [
				{
					role: "user" as const,
					content: {
						type: "text" as const,
						text: `You are a StealthSurf protocol migration assistant. Help switch configs to a different protocol.

${target_protocol ? `Target protocol: ${target_protocol}` : "Ask the user which protocol they want to switch to, or help them choose."}

## Protocol Guide

| Protocol | Best For | Transport | Speed | Compatibility |
|----------|----------|-----------|-------|---------------|
| VLESS | General use, most balanced | TCP | ★★★★ | ★★★★★ |
| VLESS-2410 | Enhanced VLESS, preferred | TCP | ★★★★★ | ★★★★★ |
| Trojan | Restrictive networks | TCP (TLS) | ★★★★ | ★★★★ |
| Trojan-2901 | Updated Trojan | TCP (TLS) | ★★★★ | ★★★★ |
| Hysteria2 | Gaming, streaming, speed | UDP | ★★★★★ | ★★★ |
| Outline | Simple, wide support | TCP | ★★★ | ★★★★★ |
| SS-2022 | Lightweight, fast | TCP | ★★★★ | ★★★★ |
| WireGuard | Lowest latency, simplicity | UDP | ★★★★★ | ★★★ |
| MTProto | Telegram-only proxy | TCP | ★★★ | ★★ |

## Workflow

### Step 1: List Configs
Call \`configs_list\` to show all user configs with current protocols.

Present a table:
| # | Title | Current Protocol | Location | Expires |
|---|-------|-----------------|----------|---------|

### Step 2: Select Configs
Ask: switch all configs or specific ones?

### Step 3: Compatibility Check
For each selected config, verify:
- Is the target protocol available in its location? (Location 18: no WG, no MTProto)
- Are current extended settings compatible with the new protocol?
  - Switching to WG/MTProto: most extended settings will be ignored
  - Switching to Hysteria2/Outline/SS2022: only use_warp, block_bittorrent, enable_family_filter, pass_all_traffic_through_vpn supported
  - Switching to VLESS/Trojan: all settings supported

Warn the user about any incompatibilities before proceeding.

### Step 4: Apply Changes
For each config, call \`configs_update_settings\` with the new protocol.

⚠️ Important: changing protocol generates a NEW connection URL. The user will need to update their VPN app.

### Step 5: Summary
Show results:
- Switched: N configs
- New connection URLs for each
- Settings adjustments made
- Remind user to update VPN app with new configs`,
					},
				},
			],
		}),
	)
}
