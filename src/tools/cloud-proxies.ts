import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import type { ApiClient } from "../api-client.js"
import { proxyProtocolEnum, annotations, toolResult, toolError } from "../schemas/shared.js"

/** Registers cloud server proxy management tools (5 tools). */
export const registerCloudProxiesTools = (server: McpServer, api: ApiClient) => {
  server.tool("cloud_proxies_list", "List all HTTP/SOCKS5 proxies on a cloud server. Proxies provide simple proxy access (not full VPN). Useful for browser proxy settings or apps that support HTTP/SOCKS5. Returns: id, title, protocol, connection_url.", {
    server_id: z.number().int().describe("Cloud server ID from cloud_servers_list"),
  }, annotations.readOnly, async ({ server_id }) => {
    try {
      const data = await api.get(`/cloud-servers/${server_id}/proxies`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("cloud_proxies_create", "Create an HTTP or SOCKS5 proxy on a cloud server. HTTP proxies work with browsers and most apps. SOCKS5 proxies support any TCP/UDP traffic and are more versatile. Returns proxy with connection_url for immediate use.", {
    server_id: z.number().int().describe("Cloud server ID from cloud_servers_list"),
    protocol: proxyProtocolEnum.describe("Proxy protocol. 'http' for browser-friendly proxy, 'socks5' for universal TCP/UDP proxy."),
    target_server_id: z.number().int().optional().describe("Preferred VPN server ID for the proxy backend. Auto-selected if omitted."),
  }, annotations.create, async ({ server_id, target_server_id, protocol }) => {
    try {
      const data = await api.post(`/cloud-servers/${server_id}/proxies`, {
        protocol,
        server_id: target_server_id,
      })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("cloud_proxies_change_protocol", "Change protocol of a cloud server proxy (HTTP ↔ SOCKS5). Regenerates connection_url for the new protocol.", {
    server_id: z.number().int().describe("Cloud server ID from cloud_servers_list"),
    proxy_id: z.number().int().describe("Proxy ID from cloud_proxies_list"),
    protocol: proxyProtocolEnum.describe("New protocol. 'http' or 'socks5'."),
  }, annotations.update, async ({ server_id, proxy_id, protocol }) => {
    try {
      const data = await api.patch(`/cloud-servers/${server_id}/proxies/${proxy_id}/protocol`, { protocol })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("cloud_proxies_change_title", "Change display title of a cloud server proxy. Set null to reset to default.", {
    server_id: z.number().int().describe("Cloud server ID from cloud_servers_list"),
    proxy_id: z.number().int().describe("Proxy ID from cloud_proxies_list"),
    title: z.string().min(1).max(64).nullable().describe("New title (1-64 chars) or null to reset."),
  }, annotations.update, async ({ server_id, proxy_id, title }) => {
    try {
      const data = await api.patch(`/cloud-servers/${server_id}/proxies/${proxy_id}/title`, { title })
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })

  server.tool("cloud_proxies_delete", "Permanently delete a proxy from a cloud server. The proxy connection_url stops working immediately. Cannot be undone.", {
    server_id: z.number().int().describe("Cloud server ID from cloud_servers_list"),
    proxy_id: z.number().int().describe("Proxy ID from cloud_proxies_list"),
  }, annotations.destroy, async ({ server_id, proxy_id }) => {
    try {
      const data = await api.delete(`/cloud-servers/${server_id}/proxies/${proxy_id}`)
      return toolResult(data)
    } catch (e) {
      return toolError(e)
    }
  })
}
