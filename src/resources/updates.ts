import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

const UPDATES_URL = "https://updates.stealthsurf.app/"

/**
 * Registers the StealthSurf updates/changelog as an MCP resource.
 * Fetches the latest content on each read.
 */
export const registerUpdatesResource = (server: McpServer) => {
	server.resource(
		"stealthsurf-updates",
		"stealthsurf://updates",
		{
			description:
				"StealthSurf latest updates and changelog. Contains recent feature releases, bug fixes, and service changes.",
			mimeType: "text/plain",
		},
		async (uri) => {
			const response = await fetch(UPDATES_URL)

			if (!response.ok)
				throw new Error(
					`Failed to fetch updates: ${response.status} ${response.statusText}`,
				)

			const text = await response.text()

			return {
				contents: [
					{
						uri: uri.href,
						mimeType: "text/plain",
						text,
					},
				],
			}
		},
	)
}
