import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

const PROTOCOLS_REFERENCE = `StealthSurf VPN Protocols Reference
=====================================

## Protocols

### VLESS (recommended)
Lightweight protocol providing maximum stability and speed.
Variants: vless, vless-2410 (enhanced, preferred when available).
Extended settings: all supported (WARP, Reality, SNI, XHTTP, gRPC, etc.).

### Trojan
Protocol disguised as HTTPS traffic. Sometimes works better than VLESS.
Variants: trojan, trojan-2901 (updated format).
Extended settings: all supported (same as VLESS).

### Hysteria 2
Squeezes maximum speed on weak Wi-Fi or mobile networks. Great for gaming.
Transport: UDP-based, highest throughput, lowest latency for games.
Extended settings: use_warp, block_bittorrent, enable_family_filter, pass_all_traffic_through_vpn.

### Shadowsocks 2022
Modern version of Outline. Saves battery. Choose if VLESS is slow.
Extended settings: use_warp, block_bittorrent, enable_family_filter, pass_all_traffic_through_vpn.

### MTProto
Telegram proxy protocol. Only proxies Telegram traffic, not general VPN.
Not available in location 18.
Extended settings: none.

### WireGuard
Fast and lightweight protocol.
Not available in location 18.
Extended settings: block_bittorrent, enable_family_filter.

### Outline
Classic protocol. Only needed for compatibility with legacy Outline apps.
Extended settings: use_warp, block_bittorrent, enable_family_filter, pass_all_traffic_through_vpn.

## Proxy Protocols (for subconfigs and cloud proxies)

### HTTP
Standard HTTP/HTTPS proxy. Works with browsers and most apps.

### SOCKS5
SOCKS5 proxy. Supports any TCP/UDP traffic, more versatile than HTTP.

## Protocol Comparison

Protocol        | Speed | Stability | Gaming | Streaming | Restricted Networks
--------------- | ----- | --------- | ------ | --------- | -------------------
VLESS           | ★★★★  | ★★★★★     | ★★★    | ★★★★      | ★★★★★
VLESS-2410      | ★★★★★ | ★★★★★     | ★★★    | ★★★★★     | ★★★★★
Trojan          | ★★★★  | ★★★★      | ★★★    | ★★★★      | ★★★★
Trojan-2901     | ★★★★  | ★★★★      | ★★★    | ★★★★      | ★★★★
Hysteria 2      | ★★★★★ | ★★★       | ★★★★★  | ★★★★★     | ★★★
Shadowsocks 2022| ★★★★  | ★★★★      | ★★★    | ★★★       | ★★★
WireGuard       | ★★★★★ | ★★★★      | ★★★★   | ★★★       | ★★
MTProto         | ★★★   | ★★★       | —      | —         | ★★★
Outline         | ★★★   | ★★★★      | ★★     | ★★★       | ★★★

## Recommendations by Use Case

- General browsing: VLESS or VLESS-2410 (recommended default)
- Gaming: Hysteria 2 + nearest location
- Streaming: VLESS or Trojan + content region location
- Weak network / mobile: Hysteria 2
- Battery saving: Shadowsocks 2022
- Telegram only: MTProto
- Low latency: WireGuard
- Legacy apps: Outline

## Location Restrictions

- Location 18: MTProto and WireGuard are NOT available
- All other locations: all protocols supported

## Extended Settings Compatibility

Setting                        | VLESS/Trojan | Hysteria2/SS2022/Outline | WireGuard | MTProto
------------------------------ | ------------ | ------------------------ | --------- | -------
use_extended_settings          | ✓            | ✓                        | ✓         | ✗
use_warp                       | ✓            | ✓                        | ✗         | ✗
disable_flow_reality           | ✓            | ✗                        | ✗         | ✗
disable_reality                | ✓            | ✗                        | ✗         | ✗
change_sni                     | ✓            | ✗                        | ✗         | ✗
block_local_network            | ✓            | ✗                        | ✗         | ✗
disable_sni                    | ✓            | ✗                        | ✗         | ✗
enable_family_filter           | ✓            | ✓                        | ✓         | ✗
pass_all_traffic_through_vpn   | ✓            | ✓                        | ✗         | ✗
block_bittorrent               | ✓            | ✓                        | ✓         | ✗
use_xhttp                      | ✓            | ✗                        | ✗         | ✗
use_grpc                       | ✓            | ✗                        | ✗         | ✗`

/**
 * Registers the VPN protocols reference as a static MCP resource.
 * Quick lookup for protocol comparison, compatibility, and recommendations.
 */
export const registerProtocolsResource = (server: McpServer) => {
	server.resource(
		"stealthsurf-protocols",
		"stealthsurf://protocols",
		{
			description:
				"VPN protocol comparison, compatibility matrix, extended settings support, and use case recommendations.",
			mimeType: "text/plain",
		},
		async (uri) => ({
			contents: [
				{
					uri: uri.href,
					mimeType: "text/plain",
					text: PROTOCOLS_REFERENCE,
				},
			],
		}),
	)
}
