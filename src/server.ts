import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createApiClient } from "./api-client.js";
import { registerPrompts } from "./prompts/index.js";
import { registerErrorsResource } from "./resources/errors.js";
import { registerGuideResource } from "./resources/guide.js";
import { registerProtocolsResource } from "./resources/protocols.js";
import { registerUpdatesResource } from "./resources/updates.js";
import { registerCloudConfigsTools } from "./tools/cloud-configs.js";
import { registerCloudProxiesTools } from "./tools/cloud-proxies.js";
import { registerCloudServersTools } from "./tools/cloud-servers.js";
import { registerConfigsTools } from "./tools/configs.js";
import { registerCustomSubscriptionsTools } from "./tools/custom-subscriptions.js";
import { registerPaidOptionConfigsTools } from "./tools/paid-option-configs.js";
import { registerPaidOptionsTools } from "./tools/paid-options.js";
import { registerProfileBalanceTools } from "./tools/profile-balance.js";
import { registerProfileDevicesTools } from "./tools/profile-devices.js";
import { registerProfileHistoryTools } from "./tools/profile-history.js";
import { registerProfileReferralTools } from "./tools/profile-referral.js";
import { registerProfileTools } from "./tools/profile.js";
import { registerUtilityTools } from "./tools/utility.js";

/**
 * Creates a stateless MCP server with all StealthSurf tools registered.
 * Each invocation creates a fresh server instance — no session tracking.
 *
 * @param apiBaseUrl - StealthSurf API base URL (e.g. `https://api.stealthsurf.app`)
 * @param apiKey - User's `stlth_*` API key, forwarded to every API request
 * @returns Configured McpServer ready for transport binding
 */
export const createMcpServer = (
  apiBaseUrl: string,
  apiKey: string,
): McpServer => {
  const server = new McpServer({
    name: "stealthsurf",
    version: "1.0.0",
  });

  const api = createApiClient({ baseUrl: apiBaseUrl, apiKey });

  registerGuideResource(server);
  registerErrorsResource(server);
  registerUpdatesResource(server);
  registerProtocolsResource(server);

  registerPrompts(server);

  registerConfigsTools(server, api);
  registerCloudServersTools(server, api);
  registerCloudConfigsTools(server, api);
  registerCloudProxiesTools(server, api);
  registerPaidOptionsTools(server, api);
  registerPaidOptionConfigsTools(server, api);
  registerProfileTools(server, api);
  registerProfileDevicesTools(server, api);
  registerProfileBalanceTools(server, api);
  registerProfileReferralTools(server, api);
  registerProfileHistoryTools(server, api);
  registerCustomSubscriptionsTools(server, api);
  registerUtilityTools(server, api);

  return server;
};
