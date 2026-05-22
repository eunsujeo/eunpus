> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Off Exchange events

This page covers all Off Exchange events that can trigger webhook notifications, and their associated data objects for the Webhooks v2 service.

## Off Exchange event types

To receive a specific event, include its **eventType** in the webhook's [notification object](/reference/webhooks-structures-notificationstructure#/).

| Event type                | Data object returned                                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| settlement.created        | [settlementDetails](/reference/webhooks-structures-eventtypes-offexchange?isFramePreview=true#settlementdetails) |
| collateral.status.updated | [settlementDetails](/reference/webhooks-structures-eventtypes-offexchange?isFramePreview=true#settlementdetails) |

***

## Data objects

### settlementDetails

| Parameter                                                                                              | Type          | Description                                                                                                                   |
| ------------------------------------------------------------------------------------------------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| collateralAccountId                                                                                    | string        | The collateral account ID.                                                                                                    |
| settlementId                                                                                           | string        | Unique settlement ID provided by Fireblocks.                                                                                  |
| isForceSettlement                                                                                      | boolean       | A flag or condition that indicates whether a settlement should be forcibly executed, overriding normal settlement procedures. |
| [toExchange](/reference/webhooks-structures-eventtypes-offexchange?isFramePreview=true#toexchange)     | data \[array] | All settlement transaction details are required to be sent to the exchange.                                                   |
| [toCollateral](/reference/webhooks-structures-eventtypes-offexchange?isFramePreview=true#tocollateral) | data \[array] | All settlement transaction details are required to be sent to the collateral account.                                         |

### toExchange

| Parameter | Type   | Description                                                                                                                                                                                                                 |
| --------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| txId      | string | The transaction ID (within the main workspace).                                                                                                                                                                             |
| assetId   | string | The ID of the transaction's asset, applicable to `TRANSFER`, `MINT, BURN`, or `ENABLE_ASSET` operations. For a list of supported assets and their corresponding IDs, please refer [here](/reference/list-supported-assets). |
| amount    | string | The actual amount requested for transfer.                                                                                                                                                                                   |

### toCollateral

| Parameter | Type   | Description                                                                                                                                                                                                                 |
| --------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| txId      | string | The transaction ID (within the main workspace).                                                                                                                                                                             |
| assetId   | string | The ID of the transaction's asset, applicable to `TRANSFER`, `MINT, BURN`, or `ENABLE_ASSET` operations. For a list of supported assets and their corresponding IDs, please refer [here](/reference/list-supported-assets). |
| amount    | string | The actual amount requested for transfer.                                                                                                                                                                                   |
