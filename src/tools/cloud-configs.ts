import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import type { ApiClient } from "../api-client.js"
import { vpnProtocolEnum, annotations, toolResult, toolError } from "../schemas/shared.js"

/** Registers cloud server config management tools (6 tools). */
export const registerCloudConfigsTools = (server: McpServer, api: ApiClient) => {
  server.tool("cloud_configs_list", "List all VPN configs on a cloud server. Each cloud server can have multiple configs with different protocols. Returns: id, title, protocol, connection_url, is_extended_settings_enabled, flags.", {
    server_id: z.number().int().describe("Cloud server ID from cloud_servers_list"),
  }, annotations.readOnly, async ({ server_id }) => {
    try {
      const data = await api.get(`/cloud-servers/${server_id}/configs`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("cloud_configs_create", "Create a new VPN config on a cloud server. Unlike regular configs, cloud configs live on user's dedicated VPS. Supports all VPN protocols. Extended settings (WARP, Reality, SNI) available for VLESS/Trojan protocols.", {
    server_id: z.number().int().describe("Cloud server ID from cloud_servers_list"),
    location_id: z.number().int().describe("Location ID from locations_list"),
    protocol: vpnProtocolEnum.describe("VPN protocol for this config. vless recommended for best censorship bypass."),
    target_server_id: z.number().int().min(1).optional().describe("Preferred VPN server ID. Auto-selected if omitted."),
    use_extended_settings: z.boolean().optional().describe("Enable extended settings. Required for WARP, Reality, SNI options below."),
    use_warp: z.boolean().optional().describe("Route through Cloudflare WARP for extra encryption. VLESS/Trojan only."),
    disable_reality: z.boolean().optional().describe("Disable Reality transport, fall back to plain TLS. VLESS/Trojan only."),
    change_sni: z.boolean().optional().describe("Apply custom SNI for stealth. VLESS/Trojan only."),
    enable_family_filter: z.boolean().optional().describe("Block adult/malware domains at DNS level."),
  }, annotations.create, async ({ server_id, target_server_id, ...body }) => {
    try {
      const data = await api.post(`/cloud-servers/${server_id}/configs`, {
        ...body,
        server_id: target_server_id,
      })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("cloud_configs_change_protocol", "Change the VPN protocol of a cloud server config. Regenerates connection_url for the new protocol. Available protocols: vless (XTLS+Reality), trojan (TLS-based), outline (Shadowsocks), hysteria2 (UDP), etc.", {
    server_id: z.number().int().describe("Cloud server ID from cloud_servers_list"),
    config_id: z.number().int().describe("Config ID from cloud_configs_list"),
    protocol: vpnProtocolEnum.describe("New VPN protocol. Changing protocol regenerates connection_url."),
  }, annotations.update, async ({ server_id, config_id, protocol }) => {
    try {
      const data = await api.patch(`/cloud-servers/${server_id}/configs/${config_id}/protocol`, { protocol })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("cloud_configs_update_xray", "Update custom XRay configuration for a cloud server config. Requires extended settings enabled. XRay config defines the full VPN behavior: inbounds, outbounds, routing, DNS. Use xray_generate_keys for Reality key pairs.", {
    server_id: z.number().int().describe("Cloud server ID from cloud_servers_list"),
    config_id: z.number().int().describe("Config ID from cloud_configs_list"),
    xray_config: z.string().describe("Full XRay config as JSON string. Defines protocol behavior, routing rules, DNS settings."),
    public_key: z.string().optional().nullable().describe("X25519 public key for Reality transport. Generate with xray_generate_keys. Null to remove."),
  }, annotations.update, async ({ server_id, config_id, ...body }) => {
    try {
      const data = await api.patch(`/cloud-servers/${server_id}/configs/${config_id}/xray`, body)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("cloud_configs_change_title", "Change display title of a cloud server config. Helps identify configs (e.g. 'US VLESS', 'EU Trojan'). Set null to reset to default.", {
    server_id: z.number().int().describe("Cloud server ID from cloud_servers_list"),
    config_id: z.number().int().describe("Config ID from cloud_configs_list"),
    title: z.string().min(1).max(64).nullable().describe("New title (1-64 chars) or null to reset."),
  }, annotations.update, async ({ server_id, config_id, title }) => {
    try {
      const data = await api.patch(`/cloud-servers/${server_id}/configs/${config_id}/title`, { title })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("cloud_configs_delete", "Permanently delete a VPN config from a cloud server. The config's connection_url will stop working immediately. This action cannot be undone.", {
    server_id: z.number().int().describe("Cloud server ID from cloud_servers_list"),
    config_id: z.number().int().describe("Config ID from cloud_configs_list"),
  }, annotations.destroy, async ({ server_id, config_id }) => {
    try {
      const data = await api.delete(`/cloud-servers/${server_id}/configs/${config_id}`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })
}
