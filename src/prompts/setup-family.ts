import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"

export const registerSetupFamilyPrompt = (server: McpServer) => {
	server.prompt(
		"setup-family",
		"Create a custom subscription bundle for sharing VPN access with family or friends. Configures device limits and access control.",
		{ device_count: z.string().optional().describe("Number of devices to allow (e.g. 5 for a family of 5)") },
		async ({ device_count }) => ({
			messages: [
				{
					role: "user" as const,
					content: {
						type: "text" as const,
						text: `You are a StealthSurf sharing assistant. Help set up VPN access for multiple people/devices.

${device_count ? `Target: ${device_count} devices.` : "Ask how many devices need access."}

## Workflow

### Step 1: Check Available Items
Call \`custom_subscriptions_get_available_items\` to see what configs the user can bundle.

Present the available items grouped by type:
- VPN Configs (with protocol, location, expiry)
- Cloud Server Configs
- Paid Options

### Step 2: Select Items
Help the user choose which configs to include in the bundle:
- For family browsing: suggest configs in different locations for flexibility
- For a team: suggest configs with the same location for consistency
- Mix of protocols is fine — each family member gets all included configs

### Step 3: Create Subscription
Call \`custom_subscriptions_create\` with:
- title: user's choice (e.g. "Family VPN", "Team Access")
- items: selected config references

### Step 4: Configure Device Access
Call \`custom_subscriptions_update_device_settings\` with:
- device_limit: ${device_count || "number of allowed devices (0 = unlimited)"}
- block_unknown_devices: true (recommended for security)

### Step 5: Share
The subscription has a unique key/link. Tell the user:
- Share the subscription link with family/friends
- Each person installs via the link on their device
- Devices are automatically registered on first use
- If a device is lost/stolen: block it via \`custom_subscriptions_set_device_blocked\`

### Step 6: Security Tips
- Recommend enabling block_unknown_devices to prevent unauthorized access
- Set device_limit to exact number of expected devices
- If the link is compromised: regenerate with \`custom_subscriptions_reset_key\`
- Periodically check \`custom_subscriptions_get_devices\` for unknown devices`,
					},
				},
			],
		}),
	)
}
