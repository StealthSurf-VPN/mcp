import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import type { ApiClient } from "../api-client.js"
import { annotations, toolResult, toolError } from "../schemas/shared.js"

/** Registers referral program and withdrawal tools (4 tools). */
export const registerProfileReferralTools = (server: McpServer, api: ApiClient) => {
  server.tool("referral_get_data", "Get referral withdrawal history. Returns array of referral transactions with: amount, method (sbp/card), account (masked), status (created/processing/completed/failed), created_at. User's referral_code and referral_balance are in profile_get.", {
    limit: z.number().int().min(1).max(1000).optional().describe("Max results (1-1000)."),
    offset: z.number().int().min(0).optional().describe("Results to skip. Default: 0."),
  }, annotations.readOnly, async ({ limit, offset }) => {
    try {
      const data = await api.get("/profile/referral", { limit, offset })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("referral_get_sbp_banks", "Get list of banks supporting SBP (Fast Payment System) withdrawal. Returns array of banks with id and name. Use bank_id in referral_withdraw_sbp. SBP is Russia's instant payment system.", {}, annotations.readOnly, async () => {
    try {
      const data = await api.get("/profile/referral/withdraw/sbp-bank-list")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("referral_withdraw_sbp", "Withdraw referral balance via SBP (Fast Payment System) to a Russian bank. Minimum 1000 RUB, maximum 75000 RUB per transaction. Requires bank_id from referral_get_sbp_banks and Russian phone number with +7 prefix.", {
    bank_id: z.string().min(1).max(32).describe("Bank ID from referral_get_sbp_banks."),
    amount: z.number().min(1000).max(75000).describe("Withdrawal amount in RUB (1000-75000)."),
    phone_number: z.string().describe("Russian phone number with +7 prefix (e.g. +79991234567)."),
  }, annotations.payment, async (params) => {
    try {
      const data = await api.post("/profile/referral/withdraw/sbp", params)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("referral_withdraw_card", "Withdraw referral balance to a bank card. Minimum 1000 RUB, maximum 75000 RUB per transaction. Card number is validated (Luhn check). Returns withdrawal record with id and created_at.", {
    amount: z.number().min(1000).max(75000).describe("Withdrawal amount in RUB (1000-75000)."),
    card_number: z.string().describe("Bank card number (16-19 digits). Validated with Luhn algorithm."),
  }, annotations.payment, async (params) => {
    try {
      const data = await api.post("/profile/referral/withdraw/card", params)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })
}
