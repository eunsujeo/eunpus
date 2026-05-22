> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Internal, External & Contract Wallet Webhooks

> **Deprecation notice**
>
> Webhooks v1 will be deprecated on **June 15th, 2026**. Please use the Developer Center in the Fireblocks Console to upgrade to Webhooks V2, which offers improved reliability, performance, and observability.

This page describes all events relating to internal, external, and contract whitelisted wallets that produce webhook notifications, and their associated data objects.

The `type` parameter is automatically set to the description name for the data objects below.

***

## Asset added to internal wallet

Notification is sent when an asset is added to an internal wallet.

| Parameter | Type                                      | Description                            |
| --------- | ----------------------------------------- | -------------------------------------- |
| type      | string                                    | INTERNAL\_WALLET\_ASSET\_ADDED         |
| tenantId  | string                                    | Unique ID of your Fireblocks workspace |
| timestamp | number                                    | Timestamp in milliseconds              |
| data      | [WalletAssetWebhook](#walletassetwebhook) | Internal wallet details                |

## Asset removed from internal wallet

Notification is sent when an asset is removed from an internal wallet.

| Parameter | Type                                      | Description                            |
| --------- | ----------------------------------------- | -------------------------------------- |
| type      | string                                    | INTERNAL\_WALLET\_ASSET\_REMOVED       |
| tenantId  | string                                    | Unique ID of your Fireblocks workspace |
| timestamp | number                                    | Timestamp in milliseconds              |
| data      | [WalletAssetWebhook](#walletassetwebhook) | Internal wallet details                |

## Asset added to external wallet

Notification is sent when an asset is added to an external wallet.

| Parameter | Type                                      | Description                            |
| --------- | ----------------------------------------- | -------------------------------------- |
| type      | string                                    | EXTERNAL\_WALLET\_ASSET\_ADDED         |
| tenantId  | string                                    | Unique ID of your Fireblocks workspace |
| timestamp | number                                    | Timestamp in milliseconds              |
| data      | [WalletAssetWebhook](#walletassetwebhook) | External wallet details                |

## Asset removed from external wallet

Notification is sent when an asset is removed from an external wallet.

| Parameter | Type                                      | Description                            |
| --------- | ----------------------------------------- | -------------------------------------- |
| type      | string                                    | EXTERNAL\_WALLET\_ASSET\_REMOVED       |
| tenantId  | string                                    | Unique ID of your Fireblocks workspace |
| timestamp | number                                    | Timestamp in milliseconds              |
| data      | [WalletAssetWebhook](#walletassetwebhook) | External wallet details                |

## Asset added to contract wallet

Notification is sent when an asset is added to a contract wallet.

| Parameter | Type                                      | Description                            |
| --------- | ----------------------------------------- | -------------------------------------- |
| type      | string                                    | CONTRACT\_WALLET\_ASSET\_ADDED         |
| tenantId  | string                                    | Unique ID of your Fireblocks workspace |
| timestamp | number                                    | Timestamp in milliseconds              |
| data      | [WalletAssetWebhook](#walletassetwebhook) | Contract wallet details                |

## Asset removed from contract wallet

Notification is sent when an asset is removed from a contract wallet.

| Parameter | Type                                      | Description                            |
| --------- | ----------------------------------------- | -------------------------------------- |
| type      | string                                    | CONTRACT\_WALLET\_ASSET\_REMOVED       |
| tenantId  | string                                    | Unique ID of your Fireblocks workspace |
| timestamp | number                                    | Timestamp in milliseconds              |
| data      | [WalletAssetWebhook](#walletassetwebhook) | Contract wallet details                |

***

### WalletAssetWebhook

| Parameter      | Type   | Description                                                                                                                                                                                                 |
| -------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| assetId        | string | The wallet's asset                                                                                                                                                                                          |
| walletId       | string | The ID of the wallet                                                                                                                                                                                        |
| walletName     | string | The name of the wallet                                                                                                                                                                                      |
| address        | string | The address of the wallet                                                                                                                                                                                   |
| tag            | string | Destination address tag for Ripple; destination memo for Cosmos, EOS, Luna, Luna Classic, NEM, Stellar, Hedera, & DigitalBits; destination note for Algorand; bank transfer description for fiat providers. |
| activationTime | number | The time the wallet will be activated, if wallet activation is postponed according to your workspace definition                                                                                             |
