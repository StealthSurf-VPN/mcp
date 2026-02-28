import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import type { ApiClient } from "../api-client.js"
import { vpnProtocolEnum, configSettingsSchema, annotations, toolResult, toolError } from "../schemas/shared.js"

/** Registers VPN configuration management tools (15 tools). */
export const registerConfigsTools = (server: McpServer, api: ApiClient) => {
  server.tool("configs_list", "List all user VPN configurations. Returns array of configs with: id, title, protocol, location_id, server_id, expires_at (unix seconds), is_online, auto_renewal, connection_url. Use this to see all active VPN configs for the user.", {
    limit: z.number().int().min(1).max(1000).optional().describe("Max results to return (1-1000). Default server-side."),
    offset: z.number().int().min(0).optional().describe("Number of results to skip for pagination. Default: 0."),
  }, annotations.readOnly, async ({ limit, offset }) => {
    try {
      const data = await api.get("/configs", { limit, offset })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("configs_get_tariffs", "Get available tariffs (pricing plans) for VPN config purchase and renewal. Returns tariffs grouped by payment method with: id, days, price, payment_method_id. Call this before configs_create or configs_renew to show the user available options.", {}, annotations.readOnly, async () => {
    try {
      const data = await api.get("/configs/tariffs")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("configs_get_available_servers", "Get available VPN servers for a specific location and protocol. Returns servers with capacity info. Use locations_list first to get location_id, then this to find servers. Server is auto-selected if not specified in configs_create.", {
    location_id: z.number().int().describe("Location ID from locations_list"),
    protocol: vpnProtocolEnum,
  }, annotations.readOnly, async ({ location_id, protocol }) => {
    try {
      const data = await api.get("/configs/available-servers", { location_id, protocol })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("configs_get_server_stats", "Get real-time server statistics for a VPN config's server. Returns: host IP, status, uptime_days, cpu_model, and historical stats array with date, cpu%, ram%, upload/download Mbps. Useful for checking server health and performance.", {
    config_id: z.number().int().describe("Config ID from configs_list"),
  }, annotations.readOnly, async ({ config_id }) => {
    try {
      const data = await api.get(`/configs/${config_id}/serverStats`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("configs_create", "Create a new VPN configuration. Requires location_id (from locations_list) and optionally protocol (default: vless). If user has sufficient balance, creates immediately. If not, may return a payment URL. The config gets a connection_url for VPN client apps. Extended settings (use_warp, use_xhttp, etc.) only work when use_extended_settings=true. See configSettingsSchema for protocol compatibility.", {
    location_id: z.number().int().optional().describe("Location ID from locations_list. Required unless as_key=true."),
    server_id: z.number().int().min(1).optional().describe("Preferred server ID. Auto-selected if omitted (recommended)."),
    protocol: vpnProtocolEnum.optional().describe("VPN protocol. Default: vless. See protocol descriptions for details."),
    payment_method_id: z.number().int().min(1).optional().describe("Payment method ID from configs_get_tariffs."),
    tariff_id: z.number().int().min(1).optional().describe("Tariff ID from configs_get_tariffs. Determines subscription period and price."),
    promocode: z.string().min(4).max(32).optional().describe("Promotional code for discount (4-32 chars)."),
    as_key: z.boolean().optional().describe("Purchase as activation key instead of creating config immediately. Key can be shared/activated later."),
    enable_auto_renewal: z.boolean().optional().describe("Auto-renew from balance when subscription expires."),
    ...configSettingsSchema,
  }, annotations.payment, async (params) => {
    try {
      const data = await api.post("/configs", params)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("configs_renew", "Renew an existing VPN config subscription to extend its expiration. Get tariff options from configs_get_tariffs first. If balance is sufficient, renews immediately. Otherwise may return payment URL.", {
    config_id: z.number().int().describe("Config ID to renew (from configs_list)"),
    promocode: z.string().min(4).max(32).optional().describe("Promotional code for discount (4-32 chars)."),
    payment_method_id: z.number().int().min(1).optional().describe("Payment method ID from configs_get_tariffs."),
    tariff_id: z.number().int().min(1).optional().describe("Tariff ID from configs_get_tariffs. Determines renewal period and price."),
    enable_auto_renewal: z.boolean().optional().describe("Enable auto-renewal from balance on future expirations."),
  }, annotations.payment, async ({ config_id, ...body }) => {
    try {
      const data = await api.post(`/configs/renewal/${config_id}`, body)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("configs_update_xray_config", "Update custom XRay configuration for a VPN config. Requires use_extended_settings to be enabled first via configs_update_settings. The xray_config is a full XRay JSON config string defining inbounds, outbounds, routing rules, DNS settings. Use xray_generate_keys to create new key pairs if needed for Reality transport.", {
    config_id: z.number().int().describe("Config ID (from configs_list)"),
    xray_config: z.string().describe("Full XRay configuration as JSON string. Defines inbounds (protocol, port, streamSettings), outbounds (freedom/blackhole/proxy), routing rules, and DNS."),
    public_key: z.string().optional().nullable().describe("X25519 public key for Reality transport. Generate with xray_generate_keys. Set null to remove."),
  }, annotations.update, async ({ config_id, ...body }) => {
    try {
      const data = await api.patch(`/configs/${config_id}/XrayConfig`, body)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("configs_update_settings", "Update VPN config settings: change protocol, location, server, and extended options. Location and protocol are required. Server is auto-selected if omitted. Extended settings (WARP, Reality, transport, etc.) only apply when use_extended_settings=true. Changing protocol or location may regenerate the connection_url.", {
    config_id: z.number().int().describe("Config ID (from configs_list)"),
    location_id: z.number().int().describe("New location ID (from locations_list). Required."),
    protocol: vpnProtocolEnum.describe("New VPN protocol. Required. Changing protocol regenerates connection_url."),
    server_id: z.number().int().min(1).optional().describe("Preferred server ID. Auto-selected if omitted (recommended)."),
    ...configSettingsSchema,
  }, annotations.update, async ({ config_id, ...body }) => {
    try {
      const data = await api.patch(`/configs/${config_id}/settings`, body)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("configs_change_title", "Change the display title of a VPN config. Titles help users identify configs (e.g. 'Work VPN', 'Gaming Server'). Set null to remove custom title and revert to default.", {
    config_id: z.number().int().describe("Config ID (from configs_list)"),
    title: z.string().min(1).max(64).nullable().describe("New title (1-64 chars) or null to reset to default."),
  }, annotations.update, async ({ config_id, title }) => {
    try {
      const data = await api.patch(`/configs/title/${config_id}`, { title })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("configs_toggle_auto_renewal", "Enable or disable auto-renewal for a VPN config. When enabled, the subscription auto-renews from user balance before expiration. The 'days' parameter sets the renewal period (required when enabling). Returns updated auto_renewal status.", {
    config_id: z.number().int().describe("Config ID (from configs_list)"),
    enabled: z.boolean().describe("true to enable auto-renewal, false to disable."),
    days: z.number().int().min(1).optional().describe("Renewal period in days. Required when enabling. Must match an available tariff period."),
  }, annotations.update, async ({ config_id, ...body }) => {
    try {
      const data = await api.patch(`/configs/${config_id}/auto-renewal`, body)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("configs_make_bridge", "Create a dual-hop VPN bridge between two configs for enhanced privacy. Traffic routes: User → first_config (entry) → second_config (exit) → Internet. Both configs must be active. Can chain different config types: regular user configs, paid option configs, or cloud server configs. Generates a custom XRay config with proxy chain.", {
    first_config_id: z.number().int().min(1).describe("Entry point config ID. Traffic enters VPN through this server first."),
    second_config_id: z.number().int().min(1).describe("Exit point config ID. Traffic exits to the internet from this server."),
    first_type: z.enum(["config", "paid_option", "cloud"]).optional().describe("Type of first config. 'config' = regular VPN config, 'paid_option' = paid option config, 'cloud' = cloud server config. Default: 'config'."),
    second_type: z.enum(["config", "paid_option", "cloud"]).optional().describe("Type of second config. Same options as first_type. Default: 'config'."),
  }, annotations.create, async (params) => {
    try {
      const data = await api.post("/configs/makeBridge", params)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("configs_get_subconfig", "Get the subconfig (HTTP or SOCKS5 proxy) attached to a VPN config. Subconfigs provide an alternative connection method — instead of VPN protocol, access via standard HTTP/SOCKS5 proxy. Returns subconfig data with protocol and connection_url, or empty if none exists.", {
    config_id: z.number().int().describe("Config ID (from configs_list)"),
  }, annotations.readOnly, async ({ config_id }) => {
    try {
      const data = await api.get(`/configs/${config_id}/subconfig`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("configs_create_subconfig", "Create an HTTP or SOCKS5 proxy subconfig for a VPN config. This adds an alternative connection method to the config. Use 'http' for browser-compatible proxy or 'socks5' for universal TCP/UDP proxy. Only one subconfig per config.", {
    config_id: z.number().int().describe("Config ID (from configs_list)"),
    protocol: z.enum(["http", "socks5"]).describe("Proxy protocol. 'http' = HTTP/HTTPS proxy (works with browsers), 'socks5' = SOCKS5 proxy (supports any TCP/UDP traffic)."),
  }, annotations.create, async ({ config_id, protocol }) => {
    try {
      const data = await api.post(`/configs/${config_id}/subconfig`, { protocol })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("configs_update_subconfig", "Change the protocol of an existing subconfig (HTTP ↔ SOCKS5). Regenerates the connection_url for the new protocol.", {
    config_id: z.number().int().describe("Config ID (from configs_list)"),
    protocol: z.enum(["http", "socks5"]).describe("New proxy protocol. 'http' or 'socks5'."),
  }, annotations.update, async ({ config_id, protocol }) => {
    try {
      const data = await api.patch(`/configs/${config_id}/subconfig`, { protocol })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("configs_delete_subconfig", "Delete the subconfig (HTTP/SOCKS5 proxy) from a VPN config. The main VPN config remains active — only the proxy access point is removed.", {
    config_id: z.number().int().describe("Config ID (from configs_list)"),
  }, annotations.destroy, async ({ config_id }) => {
    try {
      const data = await api.delete(`/configs/${config_id}/subconfig`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })
}
