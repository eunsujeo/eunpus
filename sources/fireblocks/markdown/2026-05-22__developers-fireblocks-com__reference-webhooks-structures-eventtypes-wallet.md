> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Wallet events

This page covers all wallet events that can trigger webhook notifications, and their associated data objects for the Webhooks v2 service.

## Wallet event types

To receive a specific event, include its **eventType** in the webhook's [notification object](/reference/webhooks-structures-notificationstructure#/).

| Event type                            | Data object returned                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------- |
| vault\_account.created                | [VaultAccount](/reference/vault-objects#vaultaccount)                           |
| vault\_account.asset.added            | [VaultAsset](/reference/vault-objects#vaultasset)                               |
| vault\_account.asset.balance\_updated | [VaultAccountBalanceUpdate](/reference/vault-objects#vaultaccountbalanceupdate) |
| vault\_account.nft.balance\_updated   | [BalanceObject](/reference/nft-webhooks#balanceobject)                          |
