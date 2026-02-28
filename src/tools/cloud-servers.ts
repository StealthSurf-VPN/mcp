import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import type { ApiClient } from "../api-client.js"
import { annotations, toolResult, toolError } from "../schemas/shared.js"

/** Registers cloud server management tools (6 tools). */
export const registerCloudServersTools = (server: McpServer, api: ApiClient) => {
  server.tool("cloud_servers_list", "List all user cloud servers (dedicated VPS instances). Returns array with: id, location_id, status ('ordered'|'active'), expires_at, url (IP/domain like 123-45-67-89.stealthsurf.app), is_online, auto_renewal, hostname. Cloud servers are personal VPS with full control over configs and proxies.", {}, annotations.readOnly, async () => {
    try {
      const data = await api.get("/cloud-servers")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("cloud_servers_get_stats", "Get real-time statistics for a cloud server. Returns: host IP, status, uptime_days, cpu_model, and historical stats array with date, cpu%, ram%, upload/download Mbps. Use to monitor server health and performance.", {
    id: z.number().int().describe("Cloud server ID from cloud_servers_list"),
  }, annotations.readOnly, async ({ id }) => {
    try {
      const data = await api.get(`/cloud-servers/${id}/serverStats`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("cloud_servers_reboot", "Reboot a cloud server. Use when server is unresponsive or after config changes that require restart. The server will be briefly offline during reboot.", {
    id: z.number().int().describe("Cloud server ID from cloud_servers_list"),
  }, annotations.dangerousAction, async ({ id }) => {
    try {
      const data = await api.post(`/cloud-servers/${id}/reboot`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("cloud_servers_create_order", "Order a new dedicated cloud server (VPS). Requires location_id from locations_list. Server is provisioned automatically after payment. Status starts as 'ordered' and becomes 'active' when ready. Cloud servers allow creating multiple VPN configs and proxies on one dedicated IP.", {
    location_id: z.number().int().describe("Location ID from locations_list. Determines server geographic location."),
    tariff_config_id: z.number().int().optional().describe("Tariff configuration ID. Determines server specs (CPU, RAM, bandwidth)."),
    payment_method_id: z.number().int().min(1).optional().describe("Payment method ID."),
    tariff_id: z.number().int().min(1).optional().describe("Tariff ID. Determines subscription period and price."),
    promocode: z.string().min(4).max(32).optional().describe("Promotional code for discount (4-32 chars)."),
    enable_auto_renewal: z.boolean().optional().describe("Auto-renew from balance when subscription expires."),
    hostname: z.string().max(255).optional().describe("Custom hostname/domain for the server (max 255 chars)."),
  }, annotations.payment, async (params) => {
    try {
      const data = await api.post("/cloud-servers", params)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("cloud_servers_renew", "Renew a cloud server subscription to extend expiration. Same parameters as create_order. If balance sufficient, renews immediately.", {
    location_id: z.number().int().describe("Location ID (from locations_list)."),
    tariff_config_id: z.number().int().optional().describe("Tariff configuration ID."),
    payment_method_id: z.number().int().min(1).optional().describe("Payment method ID."),
    tariff_id: z.number().int().min(1).optional().describe("Tariff ID for renewal period and price."),
    promocode: z.string().min(4).max(32).optional().describe("Promotional code (4-32 chars)."),
    enable_auto_renewal: z.boolean().optional().describe("Enable auto-renewal from balance."),
    hostname: z.string().max(255).optional().describe("Custom hostname (max 255 chars)."),
  }, annotations.payment, async (params) => {
    try {
      const data = await api.post("/cloud-servers/renewal", params)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("cloud_servers_toggle_auto_renewal", "Enable or disable auto-renewal for a cloud server. When enabled, renews from user balance before expiration. Requires 'days' parameter when enabling.", {
    id: z.number().int().describe("Cloud server ID from cloud_servers_list"),
    enabled: z.boolean().describe("true to enable auto-renewal, false to disable."),
    days: z.number().int().min(1).optional().describe("Renewal period in days. Required when enabling. Must match available tariff."),
  }, annotations.update, async ({ id, ...body }) => {
    try {
      const data = await api.patch(`/cloud-servers/${id}/auto-renewal`, body)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })
}
