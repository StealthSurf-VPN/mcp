import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import type { ApiClient } from "../api-client.js"
import { annotations, toolResult, toolError } from "../schemas/shared.js"

/** Registers user profile and Telegram integration tools (8 tools). */
export const registerProfileTools = (server: McpServer, api: ApiClient) => {
  server.tool("profile_get", "Get user profile information. Returns: id, email, balance (RUB), referral_balance (RUB), referrals_count, is_telegram_connected, referral_code (for sharing), subscription_key, sign_in_method (google/telegram/vk/webauthn/magic_link), pricing_rules (custom discounts), linked_providers.", {}, annotations.readOnly, async () => {
    try {
      const data = await api.get("/profile")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("profile_get_notification_settings", "Get notification preferences. Returns: renewal_reminders (boolean), notification_start_hour (0-23), notification_end_hour (0-23), timezone_offset (minutes from UTC, e.g. 180 for Moscow/MSK).", {}, annotations.readOnly, async () => {
    try {
      const data = await api.get("/profile/notification-settings")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("profile_update_notification_settings", "Update notification preferences. Controls when and whether the user receives renewal reminder emails. Set timezone_offset to match user's timezone (minutes from UTC).", {
    renewal_reminders: z.boolean().optional().describe("Enable/disable renewal reminder emails before config expiration."),
    notification_start_hour: z.number().int().min(0).max(23).optional().describe("Earliest hour to send notifications (0-23 in user timezone)."),
    notification_end_hour: z.number().int().min(0).max(23).optional().describe("Latest hour to send notifications (0-23 in user timezone)."),
    timezone_offset: z.number().int().min(-720).max(840).optional().describe("User timezone offset in minutes from UTC. E.g. 180 = UTC+3 (Moscow), -300 = UTC-5 (EST)."),
  }, annotations.update, async (params) => {
    try {
      const data = await api.patch("/profile/notification-settings", params)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("profile_regenerate_subscription_link", "Regenerate the VPN subscription URL/key. The old subscription link stops working and a new one is issued. All VPN client apps will need to re-import the subscription. Use when the link may have been compromised.", {}, annotations.dangerousAction, async () => {
    try {
      const data = await api.patch("/profile/subscriptionLink")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("profile_get_notifications", "Get user notifications. Returns array of notifications with id and content (message text). These are system messages about renewals, payments, and account events.", {}, annotations.readOnly, async () => {
    try {
      const data = await api.get("/profile/notifications")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("profile_connect_telegram", "Start Telegram bot connection. Returns a one-time code that the user must send to the StealthSurf Telegram bot. After sending the code, use profile_check_telegram to verify connection. Telegram bot provides renewal reminders and account notifications.", {}, annotations.create, async () => {
    try {
      const data = await api.post("/profile/telegram")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("profile_check_telegram", "Check if Telegram bot is connected to the user's account. Returns boolean. Use after profile_connect_telegram to verify the user sent the code to the bot.", {}, annotations.readOnly, async () => {
    try {
      const data = await api.get("/profile/telegram")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("profile_disconnect_telegram", "Disconnect Telegram bot from the user's account. The bot will stop sending notifications. User can reconnect later with profile_connect_telegram.", {}, annotations.destroy, async () => {
    try {
      const data = await api.delete("/profile/telegram")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })
}
