import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import type { ApiClient } from "../api-client.js"
import { annotations, toolResult, toolError } from "../schemas/shared.js"

/** Registers paid option management tools (12 tools). */
export const registerPaidOptionsTools = (server: McpServer, api: ApiClient) => {
  server.tool("paid_options_list", "List user's active paid options. Paid options are premium add-on services with dedicated configs. Returns: option_id, expires_at, configs array (with connection_url, protocol, is_online), auto_renewal status.", {}, annotations.readOnly, async () => {
    try {
      const data = await api.get("/paid-options")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_options_create_order", "Purchase or renew a paid option. Get available options and tariffs from paid_options_get_tariffs first. If user has sufficient balance, activates immediately. Otherwise may return payment URL. Can also purchase as activation key for later use.", {
    paid_option_id: z.number().int().describe("Paid option ID (from paid_options_get_tariffs)."),
    tariff_id: z.number().int().min(1).optional().describe("Tariff ID determining period and price."),
    payment_method_id: z.number().int().min(1).optional().describe("Payment method ID."),
    promocode: z.string().min(4).max(32).optional().describe("Promotional code for discount (4-32 chars)."),
    as_key: z.boolean().optional().describe("Purchase as activation key instead of immediate activation."),
    enable_auto_renewal: z.boolean().optional().describe("Auto-renew from balance when subscription expires."),
  }, annotations.payment, async (params) => {
    try {
      const data = await api.post("/paid-options", params)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_options_get_devices", "Get devices connected to a paid option. Shows which devices are using this option's VPN configs. Returns device list with names, types (ios/android/macos/windows/linux), online status.", {
    id: z.number().int().describe("User's paid option ID (from paid_options_list)"),
  }, annotations.readOnly, async ({ id }) => {
    try {
      const data = await api.get(`/paid-options/${id}/devices`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_options_delete_device", "Remove a specific device from a paid option. The device will be disconnected and will need to re-authenticate.", {
    id: z.number().int().describe("User's paid option ID (from paid_options_list)"),
    device_id: z.string().describe("Device ID (from paid_options_get_devices)"),
  }, annotations.destroy, async ({ id, device_id }) => {
    try {
      const data = await api.delete(`/paid-options/${id}/devices/${device_id}`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_options_delete_all_devices", "Remove all devices from a paid option. All connected devices will be disconnected. Useful for resetting device access.", {
    id: z.number().int().describe("User's paid option ID (from paid_options_list)"),
  }, annotations.destroy, async ({ id }) => {
    try {
      const data = await api.delete(`/paid-options/${id}/devices`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_options_get_subscription", "Get subscription details for a paid option. Returns subscription status, expiration, and linked configs.", {
    id: z.number().int().describe("User's paid option ID (from paid_options_list)"),
  }, annotations.readOnly, async ({ id }) => {
    try {
      const data = await api.get(`/paid-options/${id}/subscription`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_options_update_limits", "Update device and traffic limits for a paid option. Controls how many devices can connect simultaneously and optional traffic cap.", {
    id: z.number().int().describe("User's paid option ID (from paid_options_list)"),
    device_limit: z.number().int().min(0).max(100).optional().describe("Maximum simultaneous devices. 0 = unlimited, 1-100 = limit."),
    traffic_limit: z.number().min(0).optional().describe("Traffic limit in bytes. 0 = unlimited."),
  }, annotations.update, async ({ id, ...body }) => {
    try {
      const data = await api.patch(`/paid-options/${id}/limits`, body)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_options_update_title", "Set a custom title for a paid option config by index. Paid options can have multiple configs; index identifies which one (0-based). Helps distinguish configs in the subscription URL.", {
    id: z.number().int().describe("User's paid option ID (from paid_options_list)"),
    index: z.number().int().min(0).describe("Config index (0-based). First config = 0, second = 1, etc."),
    title: z.string().min(1).max(64).describe("Custom title (1-64 chars)."),
  }, annotations.update, async ({ id, index, title }) => {
    try {
      const data = await api.patch(`/paid-options/${id}/titles/${index}`, { title })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_options_delete_title", "Reset a paid option config title back to default (by index). Removes the custom title set via paid_options_update_title.", {
    id: z.number().int().describe("User's paid option ID (from paid_options_list)"),
    index: z.number().int().min(0).describe("Config index (0-based)."),
  }, annotations.destroy, async ({ id, index }) => {
    try {
      const data = await api.delete(`/paid-options/${id}/titles/${index}`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_options_get_stats", "Get server statistics for a paid option config (by index). Returns: host IP, status, uptime, CPU model, and historical stats with cpu%, ram%, bandwidth. Same format as configs_get_server_stats.", {
    id: z.number().int().describe("User's paid option ID (from paid_options_list)"),
    index: z.number().int().min(0).describe("Config index (0-based)."),
  }, annotations.readOnly, async ({ id, index }) => {
    try {
      const data = await api.get(`/paid-options/${id}/stats/${index}`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_options_toggle_auto_renewal", "Enable or disable auto-renewal for a paid option. When enabled, renews from user balance before expiration.", {
    id: z.number().int().describe("User's paid option ID (from paid_options_list)"),
    enabled: z.boolean().describe("true to enable, false to disable."),
    days: z.number().int().min(1).optional().describe("Renewal period in days. Required when enabling."),
  }, annotations.update, async ({ id, ...body }) => {
    try {
      const data = await api.patch(`/paid-options/${id}/auto-renewal`, body)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("paid_options_get_tariffs", "Get all available paid option tariffs. Returns tariffs grouped by option and payment method with: paid_option_id, option_key, title, days, price. Use before paid_options_create_order.", {}, annotations.readOnly, async () => {
    try {
      const data = await api.get("/paid-options/tariffs")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })
}
