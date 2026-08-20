<!--
source_url: https://developers.fireblocks.com/api-reference/vaults/ (USDC Gateway 7종)
downloaded_at: 2026-08-12
status: full (페이지 본문은 요약 stub — 실제 스키마는 openapi/swagger.yaml)
priority: TIER1
domain: Bridge / USDC Gateway / API
acquisition_method: "curl <url>.md → 7 페이지 병합 (v3.2.2 Mode C)"
-->

# USDC Gateway — API reference 7종 (원문)


## https://developers.fireblocks.com/api-reference/vaults/get-usdc-gateway-wallet-info

Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Get USDC Gateway wallet info

> Returns the USDC Gateway wallet information associated with the given vault account.
**Note:** This endpoint is currently in beta and might be subject to changes.
Endpoint Permission: Admin, Non-Signing Admin, Signer, Approver, Editor, Viewer.


## https://developers.fireblocks.com/api-reference/vaults/activate-a-usdc-gateway-wallet

Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Activate a USDC Gateway wallet

> Activates the USDC Gateway wallet associated with the given vault account. If the wallet does not yet exist it is created in an activated state.
**Note:** This endpoint is currently in beta and might be subject to changes.
Endpoint Permission: Admin, Non-Signing Admin, Signer, Approver.


## https://developers.fireblocks.com/api-reference/vaults/deactivate-a-usdc-gateway-wallet

Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Deactivate a USDC Gateway wallet

> Deactivates the USDC Gateway wallet associated with the given vault account.
**Note:** This endpoint is currently in beta and might be subject to changes.
Endpoint Permission: Admin, Non-Signing Admin, Signer, Approver.


## https://developers.fireblocks.com/api-reference/vaults/read-the-usdc-gateway-deposit-automations-for-a-vault-account

Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Read the USDC Gateway deposit automations for a vault account

> Returns the USDC Gateway deposit automations configured for the given vault account.
**Note:** This endpoint is currently in beta and might be subject to changes.
Endpoint Permission: Admin, Non-Signing Admin, Signer, Approver, Editor, Viewer.


## https://developers.fireblocks.com/api-reference/vaults/set-up-a-usdc-gateway-deposit-automation-for-a-vault-account

Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Set up a USDC Gateway deposit automation for a vault account

> Turns on automatic deposits into the USDC Gateway wallet for the given vault account, on the schedule you choose. Returns an error if an automation already exists for this vault account and asset. Use PATCH to change it instead.
**Note:** This endpoint is currently in beta and might be subject to changes.
Endpoint Permission: Admin, Non-Signing Admin, Signer, Approver.


## https://developers.fireblocks.com/api-reference/vaults/stop-a-usdc-gateway-deposit-automations-schedule

Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Stop a USDC Gateway deposit automation's schedule

> Stops the schedule for an existing deposit automation. The automation itself stays configured, only its schedule stops. Turn it back on later with PATCH, without setting up the automation again from scratch.
**Note:** This endpoint is currently in beta and might be subject to changes.
Endpoint Permission: Admin, Non-Signing Admin, Signer, Approver.


## https://developers.fireblocks.com/api-reference/vaults/change-a-usdc-gateway-deposit-automation

Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Change a USDC Gateway deposit automation

> Changes an existing USDC Gateway deposit automation for a vault account.
**Note:** This endpoint is currently in beta and might be subject to changes.
Endpoint Permission: Admin, Non-Signing Admin, Signer, Approver.
