> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Vault Webhooks

> **Deprecation notice**
>
> Webhooks v1 will be deprecated on **June 15th, 2026**. Please use the Developer Center in the Fireblocks Console to upgrade to Webhooks V2, which offers improved reliability, performance, and observability.

This page describes all events relating to vault accounts that produce webhook notifications, and their associated data objects.

The `type` parameter is automatically set to the description name for the data objects below.

> **Not all parameters appear on responses**
>
> Not all of the parameters will appear on the response. Some of the parameters are optional. If you have any issues, please contact the customer success manager.

## Vault account created

Notification is sent when a vault account is created.

**Webhook data**

| Parameter | Type                                                  | Description                            |
| --------- | ----------------------------------------------------- | -------------------------------------- |
| type      | string                                                | VAULT\_ACCOUNT\_ADDED                  |
| tenantId  | string                                                | Unique ID of your Fireblocks workspace |
| timestamp | number                                                | Timestamp in milliseconds              |
| data      | [VaultAccount](/reference/vault-objects#vaultaccount) | Vault Account details                  |

## Asset added to vault account

Notification is sent when any asset is added to a vault account.

### Webhook data

| Parameter | Type                              | Description                            |
| --------- | --------------------------------- | -------------------------------------- |
| type      | string                            | VAULT\_ACCOUNT\_ASSET\_ADDED           |
| tenantId  | string                            | Unique ID of your Fireblocks workspace |
| timestamp | number                            | Timestamp in milliseconds              |
| data      | [AssetAddedData](#assetaddeddata) | Vault account and asset details        |

### AssetAddedData

| Parameter   | Type   | Description                                                    |
| ----------- | ------ | -------------------------------------------------------------- |
| accountId   | string | The ID of the vault account under which the wallet was added   |
| accountName | string | The name of the vault account under which the wallet was added |
| assetId     | string | Wallet's asset                                                 |

***

## Asset balance changed

Notification is sent when the asset balance of a vault account changes.

| Parameter | Type                                                                          | Description                            |
| --------- | ----------------------------------------------------------------------------- | -------------------------------------- |
| type      | string                                                                        | VAULT\_BALANCE\_UPDATE                 |
| tenantId  | string                                                                        | Unique ID of your Fireblocks workspace |
| timestamp | number                                                                        | Timestamp in milliseconds              |
| data      | [VaultAssetBalanceUpdate](/reference/vault-objects#vaultaccountbalanceupdate) | Vault account details                  |
