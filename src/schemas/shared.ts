import { z } from "zod"

/** Limit/offset pagination parameters for list endpoints. */
export const paginationSchema = {
  limit: z
    .number()
    .int()
    .min(1)
    .max(1000)
    .optional()
    .describe("Max results to return (1-1000). Default varies by endpoint."),
  offset: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe("Number of results to skip for pagination. Default: 0."),
}

/** Page-based pagination parameters for list endpoints. */
export const paginationPageSchema = {
  page: z
    .number()
    .int()
    .min(1)
    .optional()
    .describe("Page number, 1-based. Default: 1."),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe("Items per page (1-100). Default: 20."),
}

/**
 * Supported VPN protocols.
 *
 * All locations support all protocols except location 18 (no mtproto and wg).
 *
 * - vless: Fast XTLS-based protocol with Reality support. Best for bypassing DPI. Recommended default.
 * - vless-2410: Enhanced/strengthened VLESS with improved censorship resistance and performance. Preferred over standard vless when available.
 * - trojan: TLS-based protocol disguised as HTTPS traffic. Good for restrictive networks.
 * - trojan-2901: Updated Trojan variant. Same features, newer config format.
 * - outline: Shadowsocks-based protocol by Jigsaw. Simple, widely supported.
 * - hysteria2: UDP-based protocol optimized for high-speed and lossy networks. Best throughput.
 * - shadowsocks-2022: Modern Shadowsocks with AEAD 2022 ciphers. Lightweight and fast.
 * - wg: WireGuard. Kernel-level VPN, lowest latency. Limited censorship resistance.
 * - mtproto: Telegram-only proxy protocol. Only proxies Telegram traffic, not general VPN.
 */
export const vpnProtocolEnum = z
  .enum([
    "vless",
    "vless-2410",
    "trojan",
    "trojan-2901",
    "outline",
    "hysteria2",
    "shadowsocks-2022",
    "wg",
    "mtproto",
  ])
  .describe(
    "VPN protocol. All locations support all protocols except location 18 (no mtproto and wg). Options: vless (XTLS+Reality, recommended), vless-2410 (enhanced/strengthened VLESS, preferred over standard vless), trojan (TLS-based), trojan-2901 (updated Trojan), outline (Shadowsocks-based), hysteria2 (UDP, fastest), shadowsocks-2022 (AEAD 2022), wg (WireGuard, lowest latency), mtproto (Telegram-only proxy)",
  )

/**
 * Supported proxy protocols for subconfigs and cloud proxies.
 *
 * - http: Standard HTTP/HTTPS proxy. Works with browsers and most apps.
 * - socks5: SOCKS5 proxy. Supports any TCP/UDP traffic, more versatile than HTTP.
 */
export const proxyProtocolEnum = z
  .enum(["http", "socks5"])
  .describe(
    "Proxy protocol. Options: http (HTTP/HTTPS proxy, browser-friendly), socks5 (SOCKS5, supports any TCP/UDP traffic)",
  )

/**
 * VPN config extended settings. These modify XRay/VPN behavior per config.
 * Not all settings are compatible with all protocols.
 * Settings only apply when use_extended_settings is true.
 *
 * Protocol compatibility:
 * - VLESS/Trojan: All settings supported.
 * - Outline/Hysteria2/SS2022: Only use_warp, block_bittorrent, enable_family_filter, pass_all_traffic_through_vpn.
 * - WireGuard: Only block_bittorrent, enable_family_filter.
 * - MTProto: No extended settings (Telegram-only proxy).
 */
export const configSettingsSchema = {
  use_extended_settings: z
    .boolean()
    .optional()
    .describe(
      "Enable extended settings mode. When true, a custom XRay config is generated with the settings below. When false, default server config is used. Required to enable any other setting.",
    ),
  use_warp: z
    .boolean()
    .optional()
    .describe(
      "Route traffic through Cloudflare WARP. Adds an extra encryption layer and can improve access to some sites. Works with VLESS, Trojan, Outline, Hysteria2, SS2022.",
    ),
  disable_flow_reality: z
    .boolean()
    .optional()
    .describe(
      "Disable XTLS flow for Reality transport. Use if client doesn't support xtls-rprx-vision flow. VLESS/Trojan only.",
    ),
  disable_reality: z
    .boolean()
    .optional()
    .describe(
      "Disable Reality transport entirely. Falls back to plain TLS. Reduces censorship resistance but improves compatibility. VLESS/Trojan only.",
    ),
  change_sni: z
    .boolean()
    .optional()
    .describe(
      "Apply custom SNI (Server Name Indication). Changes the TLS handshake domain to improve stealth. VLESS/Trojan only.",
    ),
  block_local_network: z
    .boolean()
    .optional()
    .describe(
      "Block access to local network (192.168.x.x, 10.x.x.x, etc.) through VPN. Prevents LAN leaks. VLESS/Trojan only.",
    ),
  disable_sni: z
    .boolean()
    .optional()
    .describe(
      "Set QQ browser fingerprint and disable SNI. Advanced anti-DPI measure for China/Iran. VLESS/Trojan only.",
    ),
  enable_family_filter: z
    .boolean()
    .optional()
    .describe(
      "Enable family-safe DNS filter. Blocks adult content, malware, and phishing domains at DNS level.",
    ),
  pass_all_traffic_through_vpn: z
    .boolean()
    .optional()
    .describe(
      "Force ALL traffic through VPN tunnel (full tunnel mode). When false, only blocked/foreign sites go through VPN (split tunnel).",
    ),
  block_bittorrent: z
    .boolean()
    .optional()
    .describe(
      "Block BitTorrent/P2P traffic. Prevents torrent downloads through VPN. Recommended for shared servers.",
    ),
  use_xhttp: z
    .boolean()
    .optional()
    .describe(
      "Use XHTTP transport instead of TCP. Tunnels VPN inside HTTP requests for better censorship bypass. Cannot be used with use_grpc. VLESS/Trojan only.",
    ),
  use_grpc: z
    .boolean()
    .optional()
    .describe(
      "Use gRPC transport instead of TCP. Multiplexed HTTP/2 streams, good for stable connections. Cannot be used with use_xhttp. VLESS/Trojan only.",
    ),
}

/**
 * Wraps API response data into MCP tool result format.
 *
 * @param data - Response data from the StealthSurf API
 * @returns MCP tool result with JSON-stringified content
 */
/** Reusable MCP tool annotation presets. */
export const annotations = {
  readOnly: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  create: { destructiveHint: false, idempotentHint: false, openWorldHint: false },
  update: { destructiveHint: false, idempotentHint: true, openWorldHint: false },
  destroy: { destructiveHint: true, idempotentHint: true, openWorldHint: false },
  dangerousAction: { destructiveHint: true, idempotentHint: false, openWorldHint: false },
  payment: { destructiveHint: false, idempotentHint: false, openWorldHint: true },
} as const

export const toolResult = (data: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
})

/**
 * Wraps an error into MCP tool error format with `isError: true`.
 *
 * @param error - Caught error (Error instance or unknown)
 * @returns MCP tool result with error message and `isError` flag
 */
export const toolError = (error: unknown) => ({
  content: [
    {
      type: "text" as const,
      text: `Error: ${error instanceof Error ? error.message : String(error)}`,
    },
  ],
  isError: true as const,
})
