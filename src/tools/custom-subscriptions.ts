import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import type { ApiClient } from "../api-client.js"
import { annotations, toolResult, toolError } from "../schemas/shared.js"

const subscriptionItemSchema = z.object({
  item_type: z.enum([
    "user_config", "cloud_server_config", "paid_option",
    "paid_option_index", "paid_option_config",
  ]).describe("Item type. 'user_config' = regular VPN config, 'cloud_server_config' = config on cloud server, 'paid_option' = entire paid option, 'paid_option_index' = paid option config by index (virtual), 'paid_option_config' = specific paid option config by ID."),
  item_reference_id: z.number().int().min(1).describe("Reference ID: config ID for user_config/cloud_server_config/paid_option_config, or paid option ID for paid_option/paid_option_index."),
  item_index: z.number().int().min(0).max(20).optional().describe("Config index within paid option (0-based). Required for paid_option_index and paid_option_config types. First config = 0."),
})

/** Registers custom subscription management tools (14 tools). */
export const registerCustomSubscriptionsTools = (server: McpServer, api: ApiClient) => {
  server.tool("custom_subscriptions_list", "List user's custom subscriptions. Custom subscriptions bundle multiple VPN configs into a single subscription URL. Returns: id, title, subscription_key (URL key), items_count. Useful for sharing access to multiple configs with one link.", {}, annotations.readOnly, async () => {
    try {
      const data = await api.get("/profile/custom-subscriptions")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("custom_subscriptions_get_available_items", "Get all items the user can add to custom subscriptions. Returns configs (regular + cloud server) and paid options with their configs. Each item shows: id, title, location, expires_at, is_online, source type. Use this to build the items array for custom_subscriptions_create.", {}, annotations.readOnly, async () => {
    try {
      const data = await api.get("/profile/custom-subscriptions/available-items")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("custom_subscriptions_create", "Create a custom subscription bundling 1-50 VPN configs into one subscription URL. Items can mix different types: regular configs, cloud server configs, paid option configs. Each item needs item_type, item_reference_id, and optionally item_index (for paid_option_index/paid_option_config).", {
    title: z.string().min(1).max(64).describe("Subscription name (1-64 chars). E.g. 'Family VPN', 'Work Configs'."),
    items: z.array(subscriptionItemSchema).min(1).max(50).describe("Array of 1-50 subscription items. Each item references a VPN config."),
  }, annotations.create, async (params) => {
    try {
      const data = await api.post("/profile/custom-subscriptions", params)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("custom_subscriptions_get", "Get detailed info for a custom subscription. Returns: id, title, subscription_key, items_count, and full items array with: item_type, item_reference_id, resolved_title, is_valid (item still accessible), server_config details (protocol, location, etc.).", {
    id: z.number().int().describe("Subscription ID from custom_subscriptions_list."),
  }, annotations.readOnly, async ({ id }) => {
    try {
      const data = await api.get(`/profile/custom-subscriptions/${id}`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("custom_subscriptions_update_title", "Rename a custom subscription.", {
    id: z.number().int().describe("Subscription ID."),
    title: z.string().min(1).max(64).describe("New title (1-64 chars)."),
  }, annotations.update, async ({ id, title }) => {
    try {
      const data = await api.patch(`/profile/custom-subscriptions/${id}/title`, { title })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("custom_subscriptions_update_items", "Replace all items in a custom subscription (full update). Removes existing items and sets new ones. Use custom_subscriptions_get_available_items to see what's available.", {
    id: z.number().int().describe("Subscription ID."),
    items: z.array(subscriptionItemSchema).min(1).max(50).describe("New items array (replaces all existing items)."),
  }, annotations.update, async ({ id, items }) => {
    try {
      const data = await api.put(`/profile/custom-subscriptions/${id}/items`, { items })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("custom_subscriptions_reset_key", "Regenerate the subscription URL key. The old URL stops working immediately. All VPN apps using this subscription will need to re-import. Use when the URL may have been leaked.", {
    id: z.number().int().describe("Subscription ID."),
  }, annotations.dangerousAction, async ({ id }) => {
    try {
      const data = await api.post(`/profile/custom-subscriptions/${id}/reset-key`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("custom_subscriptions_delete", "Permanently delete a custom subscription. The subscription URL stops working. All items are removed but the underlying configs remain active. Cannot be undone.", {
    id: z.number().int().describe("Subscription ID."),
  }, annotations.destroy, async ({ id }) => {
    try {
      const data = await api.delete(`/profile/custom-subscriptions/${id}`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("custom_subscriptions_get_devices", "Get devices connected to a custom subscription. Returns paginated list with: id, device_name, device_type (ios/android/macos/windows/linux), device_model, os_version, is_blocked, last_seen_at, created_at.", {
    id: z.number().int().describe("Subscription ID."),
    page: z.number().int().min(1).optional().describe("Page number (1-based). Default: 1."),
    limit: z.number().int().min(1).max(100).optional().describe("Items per page (1-100). Default: 20."),
  }, annotations.readOnly, async ({ id, page, limit }) => {
    try {
      const data = await api.get(`/profile/custom-subscriptions/${id}/devices`, { page, limit })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("custom_subscriptions_get_device_settings", "Get device access settings for a custom subscription. Returns: block_unknown_devices, device_limit. Independent from global profile device settings.", {
    id: z.number().int().describe("Subscription ID."),
  }, annotations.readOnly, async ({ id }) => {
    try {
      const data = await api.get(`/profile/custom-subscriptions/${id}/devices/settings`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("custom_subscriptions_update_device_settings", "Update device access settings for a custom subscription. These are independent from profile-level device settings.", {
    id: z.number().int().describe("Subscription ID."),
    block_unknown_devices: z.boolean().optional().describe("Block apps without hardware ID header."),
    device_limit: z.number().int().min(0).max(100).optional().describe("Max devices (0 = unlimited, 1-100 = limited)."),
  }, annotations.update, async ({ id, ...body }) => {
    try {
      const data = await api.patch(`/profile/custom-subscriptions/${id}/devices/settings`, body)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("custom_subscriptions_set_device_blocked", "Block or unblock a device in a custom subscription.", {
    id: z.number().int().describe("Subscription ID."),
    device_id: z.number().int().describe("Device ID from custom_subscriptions_get_devices."),
    is_blocked: z.boolean().describe("true to block, false to unblock."),
  }, annotations.update, async ({ id, device_id, is_blocked }) => {
    try {
      const data = await api.patch(`/profile/custom-subscriptions/${id}/devices/${device_id}/blocked`, { is_blocked })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("custom_subscriptions_delete_device", "Remove a device from a custom subscription.", {
    id: z.number().int().describe("Subscription ID."),
    device_id: z.number().int().describe("Device ID from custom_subscriptions_get_devices."),
  }, annotations.destroy, async ({ id, device_id }) => {
    try {
      const data = await api.delete(`/profile/custom-subscriptions/${id}/devices/${device_id}`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("custom_subscriptions_delete_all_devices", "Remove all devices from a custom subscription. Returns deleted_count.", {
    id: z.number().int().describe("Subscription ID."),
  }, annotations.destroy, async ({ id }) => {
    try {
      const data = await api.delete(`/profile/custom-subscriptions/${id}/devices`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })
}
