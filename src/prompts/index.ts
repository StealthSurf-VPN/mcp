import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { registerAccountOverviewPrompt } from "./account-overview.js"
import { registerBulkRenewPrompt } from "./bulk-renew.js"
import { registerDeviceAuditPrompt } from "./device-audit.js"
import { registerOptimizeForRegionPrompt } from "./optimize-for-region.js"
import { registerSetupBridgePrompt } from "./setup-bridge.js"
import { registerSetupCloudServerPrompt } from "./setup-cloud-server.js"
import { registerSetupFamilyPrompt } from "./setup-family.js"
import { registerSetupVpnPrompt } from "./setup-vpn.js"
import { registerSwitchProtocolPrompt } from "./switch-protocol.js"
import { registerTroubleshootPrompt } from "./troubleshoot.js"
import { registerXrayConfigPrompt } from "./xray-config.js"

/**
 * Registers all MCP prompt templates.
 * Prompts guide AI agents through multi-step workflows using StealthSurf tools.
 */
export const registerPrompts = (server: McpServer) => {
	registerSetupVpnPrompt(server)
	registerTroubleshootPrompt(server)
	registerOptimizeForRegionPrompt(server)
	registerAccountOverviewPrompt(server)
	registerBulkRenewPrompt(server)
	registerSetupFamilyPrompt(server)
	registerSetupCloudServerPrompt(server)
	registerSwitchProtocolPrompt(server)
	registerSetupBridgePrompt(server)
	registerDeviceAuditPrompt(server)
	registerXrayConfigPrompt(server)
}
