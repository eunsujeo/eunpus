> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Whitelist events

This page covers all whitelist (or allowlist) events that can trigger webhook notifications, and their associated data objects for the Webhooks v2 service.

## Whitelist event types

To receive a specific event, include its **eventType** in the webhook's [notification object](/reference/webhooks-structures-notificationstructure#/).

| Event type                     | Data object returned                                                                         |
| ------------------------------ | -------------------------------------------------------------------------------------------- |
| internal\_wallet.asset.added   | [WalletAssetWebhook](/reference/webhooks-structures-eventtypes-whitelist#walletassetwebhook) |
| internal\_wallet.asset.removed | [WalletAssetWebhook](/reference/webhooks-structures-eventtypes-whitelist#walletassetwebhook) |
| external\_wallet.asset.added   | [WalletAssetWebhook](/reference/webhooks-structures-eventtypes-whitelist#walletassetwebhook) |
| external\_wallet.asset.removed | [WalletAssetWebhook](/reference/webhooks-structures-eventtypes-whitelist#walletassetwebhook) |
| contract\_wallet.asset.added   | [WalletAssetWebhook](/reference/webhooks-structures-eventtypes-whitelist#walletassetwebhook) |
| contract\_wallet.asset.removed | [WalletAssetWebhook](/reference/webhooks-structures-eventtypes-whitelist#walletassetwebhook) |

***

## Data objects

### WalletAssetWebhook

| Parameter      | Type    | Description                                                                                                                                                                                                 |
| -------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| assetId        | string  | The wallet's asset                                                                                                                                                                                          |
| walletId       | string  | The ID of the wallet                                                                                                                                                                                        |
| walletName     | string  | The name of the wallet                                                                                                                                                                                      |
| address        | string  | The address of the wallet                                                                                                                                                                                   |
| tag            | string  | Destination address tag for Ripple; destination memo for Cosmos, EOS, Luna, Luna Classic, NEM, Stellar, Hedera, & DigitalBits; destination note for Algorand; bank transfer description for fiat providers. |
| activationTime | integer | The time the wallet will be activated if wallet activation is postponed, according to your workspace definition                                                                                             |
