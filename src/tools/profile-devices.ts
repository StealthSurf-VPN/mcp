import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import type { ApiClient } from "../api-client.js"
import { annotations, toolResult, toolError } from "../schemas/shared.js"

/** Registers device management tools (6 tools). */
export const registerProfileDevicesTools = (server: McpServer, api: ApiClient) => {
  server.tool("devices_list", "List user's connected devices with pagination. Returns: devices array (id, device_name, device_type [ios/android/macos/windows/linux], os_version, is_blocked, is_fingerprinted, last_seen_at), total count, page, limit, and device settings. Devices are identified by hardware ID (x-hwid header) or fingerprint (user-agent + IP).", {
    page: z.number().int().min(1).optional().describe("Page number (1-based). Default: 1."),
    limit: z.number().int().min(1).max(100).optional().describe("Items per page (1-100). Default: 20."),
  }, annotations.readOnly, async ({ page, limit }) => {
    try {
      const data = await api.get("/profile/devices", { page, limit })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("devices_get_settings", "Get device access settings. Returns: block_unknown_devices (block apps without hardware ID header), device_limit (max simultaneous devices, 0 = unlimited). These settings control VPN access restrictions.", {}, annotations.readOnly, async () => {
    try {
      const data = await api.get("/profile/devices/settings")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("devices_update_settings", "Update device access settings. block_unknown_devices: when true, only apps sending x-hwid header can connect (blocks browser-based clients). device_limit: max devices that can use VPN simultaneously (0 = unlimited).", {
    block_unknown_devices: z.boolean().optional().describe("Block VPN apps that don't send hardware ID. Improves security but may block some clients."),
    device_limit: z.number().int().min(0).max(100).optional().describe("Max simultaneous devices (0 = unlimited, 1-100 = limited)."),
  }, annotations.update, async (params) => {
    try {
      const data = await api.patch("/profile/devices/settings", params)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("devices_set_blocked", "Block or unblock a specific device. Blocked devices cannot use VPN until unblocked. Useful for revoking access from lost/stolen devices.", {
    id: z.number().int().describe("Device ID from devices_list."),
    is_blocked: z.boolean().describe("true to block device, false to unblock."),
  }, annotations.update, async ({ id, is_blocked }) => {
    try {
      const data = await api.patch(`/profile/devices/${id}/blocked`, { is_blocked })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("devices_delete", "Remove a specific device from the device list. The device will need to re-register on next VPN connection.", {
    id: z.number().int().describe("Device ID from devices_list."),
  }, annotations.destroy, async ({ id }) => {
    try {
      const data = await api.delete(`/profile/devices/${id}`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("devices_delete_all", "Remove all devices from the device list. All devices will need to re-register. Returns count of deleted devices. Useful for a clean reset of device access.", {}, annotations.destroy, async () => {
    try {
      const data = await api.delete("/profile/devices")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })
}
