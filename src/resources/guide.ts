import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

const GUIDE_URL = "https://docs.stealthsurf.app/llms-full.txt"

/**
 * Registers the StealthSurf documentation guide as an MCP resource.
 * Fetches the latest content from the docs site on each read.
 */
export const registerGuideResource = (server: McpServer) => {
	server.resource(
		"stealthsurf-guide",
		"stealthsurf://guide",
		{
			description:
				"Complete StealthSurf documentation: service overview, pricing, locations, API reference, feature guides, and protocol details.",
			mimeType: "text/plain",
		},
		async (uri) => {
			const response = await fetch(GUIDE_URL)

			if (!response.ok)
				throw new Error(
					`Failed to fetch guide: ${response.status} ${response.statusText}`,
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
