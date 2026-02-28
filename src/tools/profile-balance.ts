import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import type { ApiClient } from "../api-client.js"
import { annotations, toolResult, toolError } from "../schemas/shared.js"

/** Registers balance calculation and top-up tools (2 tools). */
export const registerProfileBalanceTools = (server: McpServer, api: ApiClient) => {
  server.tool("balance_calculate", "Calculate prices for balance top-up across all payment methods. Input amount in RUB (1-15000), returns array of payment methods with: id, method_key (sbp/card/crypto/etc.), display_name, price in method's currency, currency code. Use this before balance_topup to show user available payment options.", {
    amount: z.number().min(1).max(15000).describe("Amount to top up in RUB (1-15000)."),
  }, annotations.readOnly, async ({ amount }) => {
    try {
      const data = await api.get("/profile/balance/calculate", { amount })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("balance_topup", "Initiate balance top-up. Returns a payment link that the user must visit to complete payment. After successful payment, balance is credited automatically. Use balance_calculate first to get payment_method_id.", {
    amount: z.number().min(1).max(15000).describe("Amount to top up in RUB (1-15000)."),
    payment_method_id: z.number().int().describe("Payment method ID from balance_calculate response."),
  }, annotations.payment, async (params) => {
    try {
      const data = await api.post("/profile/balance/topup", params)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })
}
