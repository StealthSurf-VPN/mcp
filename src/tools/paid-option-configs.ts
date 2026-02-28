import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import type { ApiClient } from "../api-client.js"
import { vpnProtocolEnum, annotations, toolResult, toolError } from "../schemas/shared.js"

/** Registers paid option config management tools (10 tools). */
export const registerPaidOptionConfigsTools = (server: McpServer, api: ApiClient) => {
  server.tool("paid_option_configs_get_available_servers", "Get available servers for creating a paid option config. Returns servers with capacity for the given protocol. Use locations_list for location_id first.", {
    id: z.number().int().describe("User's paid option ID (from paid_options_list)"),
    protocol: vpnProtocolEnum.describe("VPN protocol to check server availability for."),
  }, annotations.readOnly, async ({ id, protocol }) => {
    try {
      const data = await api.get(`/paid-options/${id}/configs/available-servers`, { protocol })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_option_configs_create", "Create a VPN config for a paid option. The config is bound to the paid option's subscription. Supports vless, trojan, outline, hysteria2, shadowsocks-2022, and their variants (no wg/mtproto).", {
    id: z.number().int().describe("User's paid option ID (from paid_options_list)"),
    location_id: z.number().int().describe("Location ID from locations_list."),
    protocol: vpnProtocolEnum.describe("VPN protocol. vless recommended."),
    server_id: z.number().int().min(1).optional().describe("Preferred server ID. Auto-selected if omitted."),
  }, annotations.create, async ({ id, ...body }) => {
    try {
      const data = await api.post(`/paid-options/${id}/configs`, body)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_option_configs_get_subconfig", "Get HTTP/SOCKS5 proxy subconfig for a paid option config. Subconfigs provide alternative proxy access alongside the VPN protocol.", {
    id: z.number().int().describe("User's paid option ID (from paid_options_list)"),
    config_id: z.number().int().describe("Config ID within the paid option."),
  }, annotations.readOnly, async ({ id, config_id }) => {
    try {
      const data = await api.get(`/paid-options/${id}/configs/${config_id}/subconfig`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_option_configs_create_subconfig", "Create an HTTP or SOCKS5 proxy subconfig for a paid option config. Adds alternative proxy access method. Only one subconfig per config.", {
    id: z.number().int().describe("User's paid option ID (from paid_options_list)"),
    config_id: z.number().int().describe("Config ID within the paid option."),
    protocol: z.enum(["http", "socks5"]).describe("Proxy protocol. 'http' for browsers, 'socks5' for universal TCP/UDP."),
  }, annotations.create, async ({ id, config_id, protocol }) => {
    try {
      const data = await api.post(`/paid-options/${id}/configs/${config_id}/subconfig`, { protocol })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_option_configs_update_subconfig", "Change subconfig protocol (HTTP ↔ SOCKS5) for a paid option config. Regenerates connection_url.", {
    id: z.number().int().describe("User's paid option ID"),
    config_id: z.number().int().describe("Config ID within the paid option"),
    protocol: z.enum(["http", "socks5"]).describe("New proxy protocol."),
  }, annotations.update, async ({ id, config_id, protocol }) => {
    try {
      const data = await api.patch(`/paid-options/${id}/configs/${config_id}/subconfig`, { protocol })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_option_configs_delete_subconfig", "Delete HTTP/SOCKS5 subconfig from a paid option config. Only removes proxy access; main VPN config stays active.", {
    id: z.number().int().describe("User's paid option ID"),
    config_id: z.number().int().describe("Config ID within the paid option"),
  }, annotations.destroy, async ({ id, config_id }) => {
    try {
      const data = await api.delete(`/paid-options/${id}/configs/${config_id}/subconfig`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_option_configs_update_settings", "Update settings for a paid option config: change location, protocol, server. Location and protocol required. Server auto-selected if omitted. Changing protocol regenerates connection_url.", {
    id: z.number().int().describe("User's paid option ID"),
    config_id: z.number().int().describe("Config ID within the paid option"),
    location_id: z.number().int().describe("New location ID (from locations_list). Required."),
    protocol: vpnProtocolEnum.describe("New VPN protocol. Required."),
    server_id: z.number().int().min(1).optional().describe("Preferred server ID. Auto-selected if omitted."),
  }, annotations.update, async ({ id, config_id, ...body }) => {
    try {
      const data = await api.patch(`/paid-options/${id}/configs/${config_id}/settings`, body)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_option_configs_update_xray", "Update custom XRay config for a paid option config. Requires extended settings. Full XRay JSON config with inbounds, outbounds, routing. Use xray_generate_keys for Reality keys.", {
    id: z.number().int().describe("User's paid option ID"),
    config_id: z.number().int().describe("Config ID within the paid option"),
    xray_config: z.string().describe("Full XRay config as JSON string."),
    public_key: z.string().optional().nullable().describe("X25519 public key for Reality. Null to remove."),
  }, annotations.update, async ({ id, config_id, ...body }) => {
    try {
      const data = await api.patch(`/paid-options/${id}/configs/${config_id}/xray`, body)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_option_configs_change_title", "Change display title of a paid option config. Set null to reset to default.", {
    id: z.number().int().describe("User's paid option ID"),
    config_id: z.number().int().describe("Config ID within the paid option"),
    title: z.string().min(1).max(64).nullable().describe("New title (1-64 chars) or null to reset."),
  }, annotations.update, async ({ id, config_id, title }) => {
    try {
      const data = await api.patch(`/paid-options/${id}/configs/${config_id}/title`, { title })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_option_configs_get_stats", "Get server statistics for a paid option config. Returns host, status, uptime, cpu_model, and historical stats (cpu%, ram%, bandwidth).", {
    id: z.number().int().describe("User's paid option ID"),
    config_id: z.number().int().describe("Config ID within the paid option"),
  }, annotations.readOnly, async ({ id, config_id }) => {
    try {
      const data = await api.get(`/paid-options/${id}/configs/${config_id}/stats`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })
}
