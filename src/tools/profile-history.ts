import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import type { ApiClient } from "../api-client.js"
import { annotations, toolResult, toolError } from "../schemas/shared.js"

/** Registers payment history and promocode tools (2 tools). */
export const registerProfileHistoryTools = (server: McpServer, api: ApiClient) => {
  server.tool("payments_history_list", "Get payment history. Returns array of transactions with: id, amount (RUB), type (new_config/renewal/topup/etc.), method (sbp/card/crypto/bonus), days (subscription period purchased), is_paid (completion status), as_key (activation key purchase), created_at (unix seconds).", {
    limit: z.number().int().min(1).max(1000).optional().describe("Max results (1-1000)."),
    offset: z.number().int().min(0).optional().describe("Results to skip. Default: 0."),
  }, annotations.readOnly, async ({ limit, offset }) => {
    try {
      const data = await api.get("/profile/payments-history", { limit, offset })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("promocodes_list", "Get user's purchased promocodes. Returns array with: id, code (e.g. 'ABCD-EFGH-IJKL-MNOP'), activation_days, product_type (configs/cloud_servers/paid_options), is_active (has remaining activations), created_at. Promocodes can be shared with others for VPN activation.", {
    limit: z.number().int().min(1).max(1000).optional().describe("Max results (1-1000)."),
    offset: z.number().int().min(0).optional().describe("Results to skip. Default: 0."),
  }, annotations.readOnly, async ({ limit, offset }) => {
    try {
      const data = await api.get("/profile/promocodes", { limit, offset })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })
}
