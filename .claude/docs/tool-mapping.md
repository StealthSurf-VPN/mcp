# Tool → API Endpoint Mapping

Complete mapping of all 92 MCP tools to StealthSurf API endpoints.

## Configs (15 tools) — `src/tools/configs.ts`

| Tool | Method | Endpoint |
|------|--------|----------|
| `configs_list` | GET | /configs |
| `configs_get_tariffs` | GET | /configs/tariffs |
| `configs_get_available_servers` | GET | /configs/available-servers |
| `configs_get_server_stats` | GET | /configs/:config_id/serverStats |
| `configs_create` | POST | /configs |
| `configs_renew` | POST | /configs/renewal/:config_id |
| `configs_update_xray_config` | PATCH | /configs/:config_id/XrayConfig |
| `configs_update_settings` | PATCH | /configs/:config_id/settings |
| `configs_change_title` | PATCH | /configs/title/:config_id |
| `configs_toggle_auto_renewal` | PATCH | /configs/:config_id/auto-renewal |
| `configs_make_bridge` | POST | /configs/makeBridge |
| `configs_get_subconfig` | GET | /configs/:config_id/subconfig |
| `configs_create_subconfig` | POST | /configs/:config_id/subconfig |
| `configs_update_subconfig` | PATCH | /configs/:config_id/subconfig |
| `configs_delete_subconfig` | DELETE | /configs/:config_id/subconfig |

## Cloud Servers (6 tools) — `src/tools/cloud-servers.ts`

| Tool | Method | Endpoint |
|------|--------|----------|
| `cloud_servers_list` | GET | /cloud-servers |
| `cloud_servers_get_stats` | GET | /cloud-servers/:id/serverStats |
| `cloud_servers_reboot` | POST | /cloud-servers/:id/reboot |
| `cloud_servers_create_order` | POST | /cloud-servers |
| `cloud_servers_renew` | POST | /cloud-servers/renewal |
| `cloud_servers_toggle_auto_renewal` | PATCH | /cloud-servers/:id/auto-renewal |

## Cloud Configs (6 tools) — `src/tools/cloud-configs.ts`

| Tool | Method | Endpoint |
|------|--------|----------|
| `cloud_configs_list` | GET | /cloud-servers/:server_id/configs |
| `cloud_configs_create` | POST | /cloud-servers/:server_id/configs |
| `cloud_configs_change_protocol` | PATCH | /cloud-servers/:sid/configs/:cid/protocol |
| `cloud_configs_update_xray` | PATCH | /cloud-servers/:sid/configs/:cid/xray |
| `cloud_configs_change_title` | PATCH | /cloud-servers/:sid/configs/:cid/title |
| `cloud_configs_delete` | DELETE | /cloud-servers/:sid/configs/:cid |

## Cloud Proxies (5 tools) — `src/tools/cloud-proxies.ts`

| Tool | Method | Endpoint |
|------|--------|----------|
| `cloud_proxies_list` | GET | /cloud-servers/:server_id/proxies |
| `cloud_proxies_create` | POST | /cloud-servers/:server_id/proxies |
| `cloud_proxies_change_protocol` | PATCH | /cloud-servers/:sid/proxies/:pid/protocol |
| `cloud_proxies_change_title` | PATCH | /cloud-servers/:sid/proxies/:pid/title |
| `cloud_proxies_delete` | DELETE | /cloud-servers/:sid/proxies/:pid |

## Paid Options (12 tools) — `src/tools/paid-options.ts`

| Tool | Method | Endpoint |
|------|--------|----------|
| `paid_options_list` | GET | /paid-options |
| `paid_options_create_order` | POST | /paid-options |
| `paid_options_get_devices` | GET | /paid-options/:id/devices |
| `paid_options_delete_device` | DELETE | /paid-options/:id/devices/:device_id |
| `paid_options_delete_all_devices` | DELETE | /paid-options/:id/devices |
| `paid_options_get_subscription` | GET | /paid-options/:id/subscription |
| `paid_options_update_limits` | PATCH | /paid-options/:id/limits |
| `paid_options_update_title` | PATCH | /paid-options/:id/titles/:index |
| `paid_options_delete_title` | DELETE | /paid-options/:id/titles/:index |
| `paid_options_get_stats` | GET | /paid-options/:id/stats/:index |
| `paid_options_toggle_auto_renewal` | PATCH | /paid-options/:id/auto-renewal |
| `paid_options_get_tariffs` | GET | /paid-options/tariffs |

## Paid Option Configs (10 tools) — `src/tools/paid-option-configs.ts`

| Tool | Method | Endpoint |
|------|--------|----------|
| `paid_option_configs_get_available_servers` | GET | /paid-options/:id/configs/available-servers |
| `paid_option_configs_create` | POST | /paid-options/:id/configs |
| `paid_option_configs_get_subconfig` | GET | /paid-options/:id/configs/:cid/subconfig |
| `paid_option_configs_create_subconfig` | POST | /paid-options/:id/configs/:cid/subconfig |
| `paid_option_configs_update_subconfig` | PATCH | /paid-options/:id/configs/:cid/subconfig |
| `paid_option_configs_delete_subconfig` | DELETE | /paid-options/:id/configs/:cid/subconfig |
| `paid_option_configs_update_settings` | PATCH | /paid-options/:id/configs/:cid/settings |
| `paid_option_configs_update_xray` | PATCH | /paid-options/:id/configs/:cid/xray |
| `paid_option_configs_change_title` | PATCH | /paid-options/:id/configs/:cid/title |
| `paid_option_configs_get_stats` | GET | /paid-options/:id/configs/:cid/stats |

## Profile (8 tools) — `src/tools/profile.ts`

| Tool | Method | Endpoint |
|------|--------|----------|
| `profile_get` | GET | /profile |
| `profile_get_notification_settings` | GET | /profile/notification-settings |
| `profile_update_notification_settings` | PATCH | /profile/notification-settings |
| `profile_regenerate_subscription_link` | PATCH | /profile/subscriptionLink |
| `profile_get_notifications` | GET | /profile/notifications |
| `profile_connect_telegram` | POST | /profile/telegram |
| `profile_check_telegram` | GET | /profile/telegram |
| `profile_disconnect_telegram` | DELETE | /profile/telegram |

## Profile Devices (6 tools) — `src/tools/profile-devices.ts`

| Tool | Method | Endpoint |
|------|--------|----------|
| `devices_list` | GET | /profile/devices |
| `devices_get_settings` | GET | /profile/devices/settings |
| `devices_update_settings` | PATCH | /profile/devices/settings |
| `devices_set_blocked` | PATCH | /profile/devices/:id/blocked |
| `devices_delete` | DELETE | /profile/devices/:id |
| `devices_delete_all` | DELETE | /profile/devices |

## Profile Balance (2 tools) — `src/tools/profile-balance.ts`

| Tool | Method | Endpoint |
|------|--------|----------|
| `balance_calculate` | GET | /profile/balance/calculate |
| `balance_topup` | POST | /profile/balance/topup |

## Profile Referral (4 tools) — `src/tools/profile-referral.ts`

| Tool | Method | Endpoint |
|------|--------|----------|
| `referral_get_data` | GET | /profile/referral |
| `referral_get_sbp_banks` | GET | /profile/referral/withdraw/sbp-bank-list |
| `referral_withdraw_sbp` | POST | /profile/referral/withdraw/sbp |
| `referral_withdraw_card` | POST | /profile/referral/withdraw/card |

## Profile History (2 tools) — `src/tools/profile-history.ts`

| Tool | Method | Endpoint |
|------|--------|----------|
| `payments_history_list` | GET | /profile/payments-history |
| `promocodes_list` | GET | /profile/promocodes |

## Custom Subscriptions (14 tools) — `src/tools/custom-subscriptions.ts`

| Tool | Method | Endpoint |
|------|--------|----------|
| `custom_subscriptions_list` | GET | /profile/custom-subscriptions |
| `custom_subscriptions_get_available_items` | GET | /profile/custom-subscriptions/available-items |
| `custom_subscriptions_create` | POST | /profile/custom-subscriptions |
| `custom_subscriptions_get` | GET | /profile/custom-subscriptions/:id |
| `custom_subscriptions_update_title` | PATCH | /profile/custom-subscriptions/:id/title |
| `custom_subscriptions_update_items` | PUT | /profile/custom-subscriptions/:id/items |
| `custom_subscriptions_reset_key` | POST | /profile/custom-subscriptions/:id/reset-key |
| `custom_subscriptions_delete` | DELETE | /profile/custom-subscriptions/:id |
| `custom_subscriptions_get_devices` | GET | /profile/custom-subscriptions/:id/devices |
| `custom_subscriptions_get_device_settings` | GET | /profile/custom-subscriptions/:id/devices/settings |
| `custom_subscriptions_update_device_settings` | PATCH | /profile/custom-subscriptions/:id/devices/settings |
| `custom_subscriptions_set_device_blocked` | PATCH | /profile/custom-subscriptions/:id/devices/:did/blocked |
| `custom_subscriptions_delete_device` | DELETE | /profile/custom-subscriptions/:id/devices/:did |
| `custom_subscriptions_delete_all_devices` | DELETE | /profile/custom-subscriptions/:id/devices |

## Utility (2 tools) — `src/tools/utility.ts`

| Tool | Method | Endpoint |
|------|--------|----------|
| `locations_list` | GET | /locations |
| `xray_generate_keys` | POST | /xray/keys |
