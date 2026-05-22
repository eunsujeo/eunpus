> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Off Exchange Webhooks

> **Deprecation notice**
>
> Webhooks v1 will be deprecated on **June 15th, 2026**. Please use the Developer Center in the Fireblocks Console to upgrade to Webhooks V2, which offers improved reliability, performance, and observability.

## Settlement Created

A notification is sent when a new settlement is initiated in the workspace.

| Parameter | Type                                                                    | Description                             |
| --------- | ----------------------------------------------------------------------- | --------------------------------------- |
| type      | string                                                                  | SETTLEMENT\_CREATED                     |
| tenantId  | string                                                                  | Unique ID of your Fireblocks workspace. |
| timestamp | number                                                                  | Timestamp in milliseconds.              |
| data      | [settlementDetails](/reference/off-exchange-webhooks#settlementdetails) | Settlement details.                     |

### settlementDetails

| Parameter                                                     | Type          | Description                                                                                                                   |
| ------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| collateralAccountId                                           | string        | The collateral account ID.                                                                                                    |
| settlementId                                                  | string        | Unique settlement ID provided by Fireblocks.                                                                                  |
| isForceSettlement                                             | boolean       | A flag or condition that indicates whether a settlement should be forcibly executed, overriding normal settlement procedures. |
| exchangeAccountId                                             | string        | The ID of the exchange account.                                                                                               |
| [toExchange](/reference/off-exchange-webhooks#toexchange)     | data \[array] | All settlement transaction details are required to be sent to the exchange.                                                   |
| [toCollateral](/reference/off-exchange-webhooks#tocollateral) | data \[array] | All settlement transaction details are required to be sent to the collateral account.                                         |

### toExchange

| Parameter | Type   | Description                                                                                                                                                                                                                 |
| --------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| txId      | string | The transaction ID (within the main workspace).                                                                                                                                                                             |
| assetId   | string | The ID of the transaction's asset, applicable to `TRANSFER`, `MINT, BURN`, or `ENABLE_ASSET` operations. For a list of supported assets and their corresponding IDs, please refer [here](/reference/list-supported-assets). |
| amount    | string | The actual amount requested for transfer.                                                                                                                                                                                   |

### toCollateral

| Parameter | Type   | Description                                                                                                                                                                                                                  |
| --------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| txId      | string | The transaction ID (within the main workspace).                                                                                                                                                                              |
| assetId   | string | The ID of the transaction's asset, applicable to `TRANSFER`, `MINT, BURN`, or `ENABLE_ASSET` operations. For a list of supported assets and their corresponding IDs, please refer [here](/reference/list-supported-assets) . |
| amount    | string | The actual amount requested for transfer.                                                                                                                                                                                    |

### Sample Payload

```json theme={"system"}
{
	"type": "SETTLEMENT_CREATED",
	"tenantId": "your-tenant-id", (main tenant Id)
	"timestamp": 1633036800000,
	"settlementDetails": {
		"collateralAccountId": "collateral-account-id", COLLATERAL Account ID (not collateral ID)
		"settlementId": "settlement-id",
		"isForceSettlement": false,
		"toExchange": [
	{
		"txId": "transaction-id-1",
	 	"assetId": "asset-id-1",
	 	"amount": "1000",
	}],
	"toCollateral": [
	{
    "txId": "transaction-id-2",
    "assetId": "asset-id-2",
    "amount": "500",
  }]
 }
}
```
