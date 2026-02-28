import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

const ERROR_CODES: Record<number, { name: string; message: string }> = {
	0: { name: "ACCESS_DENIED", message: "access denied" },
	1: { name: "NOT_FOUND", message: "not found" },
	2: { name: "USER_NOT_FOUND", message: "user not found" },
	3: { name: "BAD_REQUEST", message: "bad request" },
	4: { name: "AUTH_PARAMS_NOT_VALID", message: "auth params not valid" },
	5: { name: "LOCATION_NOT_FOUND", message: "location not found" },
	6: { name: "PROMOCODE_NOT_FOUND", message: "promocode not found" },
	7: { name: "ALREADY_EXISTS", message: "already exists" },
	8: { name: "ENTER_LOGIN_INSTEAD_PROMOCODE", message: "enter login instead promocode" },
	9: { name: "NO_AVAILABLE_SERVERS", message: "no available servers" },
	10: { name: "LOCATION_NOT_ACTIVE", message: "location not active" },
	11: { name: "ITS_YOUR_KEY", message: "its your key" },
	12: { name: "TELEGRAM_NOT_CONNECTED", message: "telegram not connected" },
	13: { name: "PROMOCODE_RENEW_ONLY", message: "promocode renew only" },
	14: { name: "PROMOCODE_NEW_ACCOUNTS_ONLY", message: "promocode new accounts only" },
	15: { name: "REFERRAL_BALANCE_NOT_ENOUGH", message: "referral balance not enough" },
	16: { name: "PROMOCODE_INVALID_PRODUCT_TYPE", message: "promocode invalid product type" },
	17: { name: "TARIFF_NOT_AVAILABLE_FOR_LOCATION", message: "tariff not available for location" },
	18: { name: "PASSKEY_NOT_FOUND", message: "passkey not found" },
	19: { name: "PASSKEY_ALREADY_EXISTS", message: "passkey already exists" },
	20: { name: "PASSKEY_VERIFICATION_FAILED", message: "passkey verification failed" },
	21: { name: "PASSKEY_LIMIT_REACHED", message: "passkey limit reached" },
	22: { name: "MAGIC_LINK_RATE_LIMITED", message: "magic link rate limited" },
	23: { name: "MAGIC_LINK_HOURLY_LIMIT_EXCEEDED", message: "magic link hourly limit exceeded" },
	24: { name: "MAGIC_LINK_EXPIRED", message: "magic link expired" },
	25: { name: "MAGIC_LINK_ALREADY_USED", message: "magic link already used" },
	26: { name: "MAGIC_LINK_NOT_FOUND", message: "magic link not found" },
	27: { name: "CUSTOM_SUBSCRIPTION_NOT_FOUND", message: "custom subscription not found" },
	28: { name: "CUSTOM_SUBSCRIPTION_LIMIT_REACHED", message: "custom subscription limit reached" },
	29: { name: "CUSTOM_SUBSCRIPTION_ITEM_NOT_FOUND", message: "custom subscription item not found" },
	30: { name: "CUSTOM_SUBSCRIPTION_INVALID_ITEM", message: "custom subscription invalid item" },
	31: { name: "CONFIG_TITLE_NOT_FOUND", message: "config title not found" },
	32: { name: "CONFIG_INDEX_OUT_OF_RANGE", message: "config index out of range" },
	33: { name: "API_KEY_NOT_FOUND", message: "api key not found" },
	34: { name: "API_KEY_LIMIT_REACHED", message: "api key limit reached" },
	35: { name: "SERVER_NOT_FOUND", message: "server not found" },
	36: { name: "NO_SERVERS_AVAILABLE_FOR_MIGRATION", message: "no servers available for migration" },
	37: { name: "INSUFFICIENT_CAPACITY_FOR_MIGRATION", message: "insufficient capacity for migration" },
	38: { name: "USER_BANNED", message: "user banned" },
	40: { name: "DEVICE_NOT_FOUND", message: "device not found" },
	41: { name: "DEVICE_LIMIT_REACHED", message: "device limit reached" },
	42: { name: "DEVICE_BLOCKED", message: "device is blocked" },
	43: { name: "UNKNOWN_DEVICE_NOT_ALLOWED", message: "unknown device not allowed" },
	44: { name: "PROMOCODE_NOT_ALLOWED_WITH_PRICING_RULE", message: "promocode not allowed with pricing rule" },
	45: { name: "BALANCE_NOT_ENOUGH", message: "balance not enough" },
	46: { name: "INVALID_TOPUP_AMOUNT", message: "invalid topup amount" },
	47: { name: "INVALID_RENEWAL_DAYS", message: "invalid renewal days" },
	48: { name: "EXPIRED", message: "expired" },
	49: { name: "PAID_OPTION_CONFIG_NOT_FOUND", message: "paid option config not found" },
	50: { name: "NO_SERVERS_FOR_PAID_OPTION", message: "no servers available for paid option" },
	51: { name: "PAID_OPTION_CONFIG_LIMIT_REACHED", message: "paid option config limit reached" },
	52: { name: "SERVER_NOT_AVAILABLE", message: "server not available" },
	53: { name: "SERVER_CAPACITY_FULL", message: "server capacity full" },
	54: { name: "XRAY_CONFIG_VALIDATION_FAILED", message: "xray config validation failed" },
	60: { name: "PORT_NOT_AVAILABLE", message: "port not available" },
	61: { name: "IDENTITY_ALREADY_LINKED", message: "identity already linked to another account" },
	62: { name: "IDENTITY_ALREADY_YOURS", message: "identity already linked to your account" },
	63: { name: "CANNOT_UNLINK_LAST_IDENTITY", message: "cannot unlink last identity" },
	64: { name: "MERGE_SOURCE_BANNED", message: "cannot merge banned account" },
	65: { name: "MERGE_CONFIRMATION_EXPIRED", message: "merge confirmation expired" },
	66: { name: "INVALID_HOSTNAME", message: "invalid hostname" },
}

const formatErrorCodes = (): string => {
	const lines = [
		"StealthSurf API Error Codes Reference",
		"======================================",
		"",
		"All API errors return HTTP 400 with: { status: false, errorCode: <number>, message: \"<string>\" }",
		"",
		"Code | Name                                    | Message",
		"---- | --------------------------------------- | -------",
	]

	for (const [code, { name, message }] of Object.entries(ERROR_CODES))
		lines.push(`${code.padStart(4)} | ${name.padEnd(39)} | ${message}`)

	return lines.join("\n")
}

/**
 * Registers the StealthSurf error codes reference as an MCP resource.
 * Static data embedded at build time from the backend errors enum.
 */
export const registerErrorsResource = (server: McpServer) => {
	server.resource(
		"stealthsurf-errors",
		"stealthsurf://errors",
		{
			description:
				"StealthSurf API error codes reference. Maps numeric errorCode values to their names and messages.",
			mimeType: "text/plain",
		},
		async (uri) => ({
			contents: [
				{
					uri: uri.href,
					mimeType: "text/plain",
					text: formatErrorCodes(),
				},
			],
		}),
	)
}
