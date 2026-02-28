import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import type { ApiClient } from "../api-client.js"
import { annotations, toolResult, toolError } from "../schemas/shared.js"

/** Registers utility tools for locations and XRay key generation (2 tools). */
export const registerUtilityTools = (server: McpServer, api: ApiClient) => {
  server.tool("locations_list", "List all available VPN server locations. Returns array with: id, country, city, emoji flag, available protocols. Use location IDs when creating configs (configs_create), cloud servers (cloud_servers_create_order), or paid option configs (paid_option_configs_create). This is usually the first tool to call when setting up a new VPN config.", {}, annotations.readOnly, async () => {
    try {
      const data = await api.get("/locations")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("xray_generate_keys", "Generate a new X25519 key pair for XRay Reality transport. Returns: privateKey and publicKey. Use the publicKey in configs_update_xray_config or cloud_configs_update_xray when setting up Reality-based VLESS/Trojan configs. Reality transport disguises VPN traffic as legitimate HTTPS to bypass DPI.", {}, annotations.create, async () => {
    try {
      const data = await api.post("/xray/keys")
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })
}
