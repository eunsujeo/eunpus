> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Embedded Wallet events

This page covers all Embedded Wallet events that can trigger webhook notifications, and their associated data objects for the Webhooks v2 service.

## Embedded Wallet event types

To receive a specific event, include its **eventType** in the webhook's [notification object](/reference/webhooks-structures-notificationstructure#/).

| Event type                              | Data object returned                                                                                                                         |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| embedded\_wallet.created                | [Non-Custodial Wallet Created](https://ncw-developers.fireblocks.com/docs/webhooks#non-custodial-wallet-created)                             |
| embedded\_wallet.status.updated         | [NCW Transaction Status Updated](https://ncw-developers.fireblocks.com/docs/webhooks#ncw-transaction-status-updated-immediate)               |
| embedded\_wallet.account\_created       | [Non-Custodial Wallet Account Created](https://ncw-developers.fireblocks.com/docs/webhooks#non-custodial-wallet-account-created)             |
| embedded\_wallet.asset.added            | [Non-Custodial Wallet Asset Created](https://ncw-developers.fireblocks.com/docs/webhooks#non-custodial-wallet-asset-created)                 |
| embedded\_wallet.asset.balance\_updated | [Non-Custodial Wallet Asset balance changed](https://ncw-developers.fireblocks.com/docs/webhooks#non-custodial-wallet-asset-balance-changed) |
| embedded\_wallet.device.added           | [Multi-Device Request ID](https://ncw-developers.fireblocks.com/docs/webhooks#multi-device-request-id)                                       |
