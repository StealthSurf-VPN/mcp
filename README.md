# StealthSurf MCP Server

MCP (Model Context Protocol) server for
[StealthSurf VPN](https://stealthsurf.space) API.
Allows AI agents (Claude Desktop, Cursor, etc.) to manage VPN configs,
cloud servers, paid options, and more through natural language.

## Architecture

Thin stateless proxy: MCP tool calls → HTTP requests to StealthSurf API.

```text
MCP Client (Claude Desktop / Cursor)
  │  POST / (Authorization: Bearer stlth_...)
  ▼
StealthSurf MCP Server (this service)
  │  HTTP (Authorization: Bearer stlth_...)
  ▼
StealthSurf API
```

## Setup

```bash
# Install dependencies
yarn install

# Development
yarn dev

# Production
yarn build && yarn start
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `STEALTHSURF_API_URL` | `https://api.stealthsurf.space` | API base URL |
| `PORT` | `4500` | HTTP server port |

## MCP Client Configuration

### Claude Desktop

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "stealthsurf": {
      "url": "https://mcp.stealthsurf.space",
      "headers": {
        "Authorization": "Bearer stlth_your_api_key_here"
      }
    }
  }
}
```

### Getting an API Key

1. Go to StealthSurf dashboard → Profile → API Keys
2. Create a new key (name it anything)
3. Copy the `stlth_*` key (shown only once)

## Resources (4)

Reference data accessible without API calls.

| URI | Description |
|-----|-------------|
| `stealthsurf://guide` | Full StealthSurf documentation |
| `stealthsurf://updates` | Latest updates and changelog |
| `stealthsurf://errors` | API error codes reference |
| `stealthsurf://protocols` | VPN protocol comparison and compatibility matrix |

## Prompts (11)

Workflow templates that guide AI agents through multi-step scenarios.

| Prompt | Description |
|--------|-------------|
| `setup-vpn` | Interactive VPN config creation wizard |
| `troubleshoot` | Step-by-step connection issue diagnostics |
| `optimize-for-region` | Protocol recommendations by region |
| `account-overview` | Full account status report |
| `bulk-renew` | Batch renewal of expiring configs |
| `setup-family` | Custom subscription for sharing |
| `setup-cloud-server` | Full VPS setup wizard |
| `switch-protocol` | Bulk protocol migration |
| `setup-bridge` | Dual-hop bridge creation |
| `device-audit` | Device security audit |
| `xray-config` | Custom XRay configuration guide |

## Available Tools (92)

### VPN Configs (15)

- `configs_list` — List VPN configurations
- `configs_create` — Create a new VPN config
- `configs_renew` — Renew a config subscription
- `configs_get_tariffs` — Get available tariffs
- `configs_get_available_servers` — Get available servers
- `configs_get_server_stats` — Get server statistics
- `configs_update_settings` — Update config settings
- `configs_update_xray_config` — Update custom XRay config
- `configs_change_title` — Change config title
- `configs_toggle_auto_renewal` — Toggle auto-renewal
- `configs_make_bridge` — Create dual-hop bridge
- `configs_get_subconfig` — Get subconfig (proxy)
- `configs_create_subconfig` — Create subconfig
- `configs_update_subconfig` — Update subconfig
- `configs_delete_subconfig` — Delete subconfig

### Cloud Servers (17)

- `cloud_servers_list` — List cloud servers
- `cloud_servers_create_order` — Create server order
- `cloud_servers_renew` — Renew server
- `cloud_servers_reboot` — Reboot server
- `cloud_servers_get_stats` — Get server stats
- `cloud_servers_toggle_auto_renewal` — Toggle auto-renewal
- `cloud_configs_list` — List configs on server
- `cloud_configs_create` — Create config on server
- `cloud_configs_change_protocol` — Change config protocol
- `cloud_configs_update_xray` — Update XRay config
- `cloud_configs_change_title` — Change config title
- `cloud_configs_delete` — Delete config
- `cloud_proxies_list` — List proxies
- `cloud_proxies_create` — Create proxy
- `cloud_proxies_change_protocol` — Change proxy protocol
- `cloud_proxies_change_title` — Change proxy title
- `cloud_proxies_delete` — Delete proxy

### Paid Options (22)

- `paid_options_list` — List paid options
- `paid_options_create_order` — Create/renew paid option
- `paid_options_get_tariffs` — Get tariffs
- `paid_options_get_devices` — Get devices
- `paid_options_delete_device` — Delete device
- `paid_options_delete_all_devices` — Delete all devices
- `paid_options_get_subscription` — Get subscription info
- `paid_options_update_limits` — Update limits
- `paid_options_update_title` — Update title
- `paid_options_delete_title` — Reset title
- `paid_options_get_stats` — Get stats
- `paid_options_toggle_auto_renewal` — Toggle auto-renewal
- `paid_option_configs_get_available_servers` — Get servers
- `paid_option_configs_create` — Create config
- `paid_option_configs_get_subconfig` — Get subconfig
- `paid_option_configs_create_subconfig` — Create subconfig
- `paid_option_configs_update_subconfig` — Update subconfig
- `paid_option_configs_delete_subconfig` — Delete subconfig
- `paid_option_configs_update_settings` — Update settings
- `paid_option_configs_update_xray` — Update XRay
- `paid_option_configs_change_title` — Change title
- `paid_option_configs_get_stats` — Get stats

### Profile (30)

- `profile_get` — Get profile info
- `profile_get_notification_settings` — Get notification settings
- `profile_update_notification_settings` — Update settings
- `profile_regenerate_subscription_link` — Regenerate URL
- `profile_get_notifications` — Get notifications
- `profile_connect_telegram` — Create Telegram code
- `profile_check_telegram` — Check Telegram connection
- `profile_disconnect_telegram` — Disconnect Telegram
- `devices_list` — List devices
- `devices_get_settings` — Get device settings
- `devices_update_settings` — Update device settings
- `devices_set_blocked` — Block/unblock device
- `devices_delete` — Delete device
- `devices_delete_all` — Delete all devices
- `balance_calculate` — Calculate topup prices
- `balance_topup` — Topup balance
- `referral_get_data` — Get referral data
- `referral_get_sbp_banks` — Get SBP bank list
- `referral_withdraw_sbp` — Withdraw via SBP
- `referral_withdraw_card` — Withdraw via card
- `payments_history_list` — Payment history
- `promocodes_list` — Purchased promocodes
- `custom_subscriptions_list` — List subscriptions
- `custom_subscriptions_get_available_items` — Get items
- `custom_subscriptions_create` — Create subscription
- `custom_subscriptions_get` — Get subscription
- `custom_subscriptions_update_title` — Update title
- `custom_subscriptions_update_items` — Replace items
- `custom_subscriptions_reset_key` — Regenerate key
- `custom_subscriptions_delete` — Delete subscription

### Utility (2)

- `locations_list` — List server locations
- `xray_generate_keys` — Generate XRay key pair

## Docker

```bash
docker build -t stealthsurf-mcp .
docker run -p 3000:3000 \
  -e STEALTHSURF_API_URL=https://api.stealthsurf.space \
  stealthsurf-mcp
```
