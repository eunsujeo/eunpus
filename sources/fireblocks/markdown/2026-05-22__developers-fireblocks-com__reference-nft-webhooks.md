> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# NFT Webhooks

> **Deprecation notice**
>
> Webhooks v1 will be deprecated on **June 15th, 2026**. Please use the Developer Center in the Fireblocks Console to upgrade to Webhooks V2, which offers improved reliability, performance, and observability.

This page describes all events related to reporting balance changes for incoming and outgoing non-fungible token (NFT) transfers that produce webhook notifications and their associated data objects.

## Webhook payload

```typescript theme={"system"}
type: string, // NFT_BALANCE_CHANGED
tenantId: string,
timestamp: number,
data: {
  id: string, // unique web-hook id
  transaction?: TransactionObject, // when WH is from refresh call, this will be empty
  token: TokenObject,
  balance: BalanceObject, // current balance
}
```

## Data Objects

### TransactionObject

| Name        | Type   | Description                                                |
| ----------- | ------ | ---------------------------------------------------------- |
| id          | string | The Fireblocks transaction ID.                             |
| hash        | string | The hash of the transaction for the on-chain NFT transfer. |
| blockNumber | number | The transaction's block number.                            |

### TokenObject

| Name                 | Type               | Description                                         |
| -------------------- | ------------------ | --------------------------------------------------- |
| assetId              | string             | The identifier of the NFT asset.                    |
| blockchainDescriptor | string             | The descriptor for the specific blockchain network. |
| tokenId              | string             | The ID of the transferred token.                    |
| contractAddress      | string \[Optional] | The address of the NFT contract.                    |
| standard             | string \[Optional] | The NFT standard for the token.                     |

### BalanceObject

| Name        | Type                        | Description                                                          |
| ----------- | --------------------------- | -------------------------------------------------------------------- |
| owner       | [OwnerObject](#ownerobject) | The owner of the NFT with the changed balance.                       |
| outgoing    | boolean \[Optional]         | Indicates whether the transfer is outgoing from the vault.           |
| amount      | string \[Optional]          | The amount of the NFT transferred in the balance change.             |
| total       | string                      | The token balance. Represented as a decimal string.                  |
| blockNumber | number                      | The block number of the NFT when its token balance was last queried. |

### OwnerObject

| Name      | Type               | Description                                                            |
| --------- | ------------------ | ---------------------------------------------------------------------- |
| type      | PeerType           | The source of the transfer (e.g., VAULT\_ACCOUNT, INTERNAL\_WALLET).   |
| accountId | string             | The vault account ID.                                                  |
| walletId  | string \[Optional] | The Non-Custodial Wallet (NCW) ID.                                     |
| address   | string             | The owner's wallet address (i.e., the vault account ID or the NCW ID). |
