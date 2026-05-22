> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Transaction Objects

## InputsSelection

| Parameter       | Type                      | Description                                      |
| --------------- | ------------------------- | ------------------------------------------------ |
| inputsToSpend   | Array of [Inputs](#input) | Inputs that should be used in the transaction    |
| inputsToExclude | Array of [Inputs](#input) | Inputs that shouldn't be used in the transaction |

***

## Input

| Parameter | Type   | Description        |
| --------- | ------ | ------------------ |
| txHash    | string | txHash             |
| index     | string | vOut of the txHash |

***

## DestinationTransferPeerPath

| Parameter      | Type                              | Description                                                                                                                                           |
| -------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| type           | string                            | \[ VAULT\_ACCOUNT, EXCHANGE\_ACCOUNT, INTERNAL\_WALLET, EXTERNAL\_WALLET, UNMANAGED\_WALLET, ONE\_TIME\_ADDRESS, NETWORK\_CONNECTION, FIAT\_ACCOUNT ] |
| id             | string                            | The peer ID (not needed for ONE\_TIME\_ADDRESS)                                                                                                       |
| oneTimeAddress | [OneTimeAddress](#onetimeaddress) | Destination address                                                                                                                                   |

***

## OneTimeAddress

| Parameter | Type   | Description                                                                                                                                                          |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| address   | string | Transfer destination address                                                                                                                                         |
| tag       | string | Used as destination tag for XRP;`memo for ATOM, EOS, HBAR, LUNA, LUNC, XDB, XEM;`memo\_text`for XLM;`notes\` for ALGO; Bank Transfer Description for fiat providers. |

***

## BlockInfo

| Parameter   | Type   | Description                                                   |
| ----------- | ------ | ------------------------------------------------------------- |
| blockHeight | string | The height (number) of the block the transaction was mined in |
| blockHash   | string | The hash of the block the transaction was mined in            |

***

## RewardsInfo

| Parameter   | Type   | Description                                                                 |
| ----------- | ------ | --------------------------------------------------------------------------- |
| srcRewards  | string | The ALGO rewards acknowledged by the source account of the transaction      |
| destRewards | string | The ALGO rewards acknowledged by the destination account of the transaction |

***

## BlockchainInfo

| **Blockchain** | **Parameter**        | **Type**                                                    | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------- | -------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HBAR           |                      |                                                             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|                | hbarTxHash           | string                                                      | HBAR transaction hash                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| EVM            |                      |                                                             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|                | evmTransferType      | enum                                                        | Type of transfer:  **NATIVE** for native transfer.  **TOKEN** for token transfers that are reflected via the transaction’s logs.  **INTERNAL** for internal transfers that are reflected via the transaction’s traces.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| TON            |                      |                                                             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|                | messageComment       | string                                                      | Contains the payload of the internal message (see [TON internal message docs](https://docs.ton.org/v3/documentation/smart-contracts/message-management/internal-messages)).  This field represents the smart contract input or data sent to the wallet.  Unlike structured blockchains (e.g. EVM, Solana, Stellar), TON allows arbitrary message bodies. Fireblocks exposes this raw data so you can apply custom parsing logic for non-standard formats if needed.                                                                                                                                                                                                                                                                                                                   |
|                | tonTransferType      | enum                                                        | Type of transfer:  **NATIVE** for native transfer.  **JETTON** for Jetton transfer.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|                | hashes               | [TonHashes](/reference/transaction-objects#/tonhashes)      | Additional hashes of ton transfers                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| CANTON         |                      |                                                             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|                | transactionType      | enum                                                        | Types of transactions:   - **OFFER** - Transfer initiated. Sender has created a transfer offer awaiting the recipient's action. This is the first step in a 2-step transfer flow. - **ACCEPT** - Transfer completed. The recipient has accepted the pending transfer offer. Funds have been transferred successfully. - **REJECT** - Transfer failed. Recipient has rejected the pending transfer offer. No funds were transferred. - **WITHDRAW** - Transfer cancelled. Sender has withdrawn/cancelled their pending transfer offer before recipient took action. No funds were transferred. - **PRE\_APPROVAL** - Transfer completed instantly. Recipient had pre-approved incoming transfers, enabling a 1-step transfer flow (e.g., transfers from external sources like Kraken). |
|                | traceableId          | string                                                      | `UpdateId` of the original transfer offer or auto-approved transaction. The hash that could be used to locate the transaction in Canton explorers.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|                | hashes               | [CantonHashes](/reference/transaction-objects#cantonhashes) | Additional hashes of Canton transfers.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| DOT            |                      |                                                             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|                | substrateExtrinsicId | string                                                      | The extrinsic ID of the transaction.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| SUI            |                      |                                                             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|                | gasUsed              | [GasUsed](/reference/transaction-objects#gasused)           | Detailed breakdown of the costs incurred. The total gas cost and gas rebate can be calculated from these values.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

> For **ACCEPT**, **REJECT**, and **WITHDRAW** transaction types, the `offerUpdateId` links back to the original **OFFER** transaction, enabling full transaction lifecycle tracking.

***

## TonHashes

| Parameter        | Type   | Description                           |
| ---------------- | ------ | ------------------------------------- |
| externalIncoming | string | Hash of the external incoming message |
| tonTransfer      | string | Hash of the ton transfer              |
| jettonTransfer   | string | Hash of the jetton transfer           |

## CantonHashes

| Parameter           | Type   | Description                                                                                                                      |
| ------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| offerUpdateId       | string | `UpdateId` of the original transfer offer transaction. Present in transaction types such as OFFER, ACCEPT, REJECT, and WITHDRAW. |
| acceptUpdateId      | string | `UpdateId` of the accept action transaction. Present in transaction types like ACCEPT.                                           |
| rejectUpdateId      | string | `UpdateId` of the reject action transaction. Present in transaction types like REJECT.                                           |
| withdrawUpdateId    | string | `UpdateId` of the withdraw action transaction. Present in transaction types like WITHDRAW.                                       |
| preApprovalUpdateId | string | `UpdateId` of the pre-approval transfer transaction. Present in transaction types like PRE\_APPROVAL.                            |

## GasUsed

| Parameter               | Type   | Description                                          |
| ----------------------- | ------ | ---------------------------------------------------- |
| storageCost             | string | Gas units consumed for data storage.                 |
| storageRebate           | string | Gas units refunded due to storage cleanup.           |
| computationCost         | string | Gas units consumed for computation.                  |
| nonRefundableStorageFee | string | A portion of the storage fee that is non-refundable. |

***

## feeInfo

| Parameter   | Type    | Description                                                                                               |
| ----------- | ------- | --------------------------------------------------------------------------------------------------------- |
| networkFee  | string  | The fee paid to the network                                                                               |
| serviceFee  | string  | The total fee deducted by the exchange from the actual requested amount (serviceFee = amount - netAmount) |
| gasPrice    | string  | The amount of gas required by/paid to the network to process the transaction                              |
| paidByRelay | boolean | `true` or `false`; indicates whether the relay paid the fee                                               |
| relayType   | string  | Indicates whether the relay is the same tenant (`LOCAL`) or another tenant (`THIRD_PARTY`)                |
| relayId     | string  | The Vault account ID of the relay                                                                         |
| relayName   | string  | The name of the tenant hosting the third-party relay                                                      |

***

## NetworkRecord

| Parameter          | Type                                                                                 | Description                                                          |
| ------------------ | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| source             | [TransferPeerPathResponse](/reference/transaction-webhooks#transferpeerpathresponse) | Source of the transaction                                            |
| destination        | [TransferPeerPathResponse](/reference/transaction-webhooks#transferpeerpathresponse) | Destination of the transaction                                       |
| txHash             | string                                                                               | Blockchain hash of the transaction                                   |
| networkFee         | number                                                                               | The fee paid to the network                                          |
| assetId            | string                                                                               | Transaction asset                                                    |
| netAmount          | number                                                                               | The net amount of the transaction, after fee deduction               |
| status             | [NetworkStatus](#networkstatus) object                                               | Status of the blockchain transaction                                 |
| type               | string                                                                               | Type of the operation                                                |
| destinationAddress | string                                                                               | Destination address                                                  |
| sourceAddress      | string                                                                               | For account-based assets only, the source address of the transaction |

***

## NetworkStatus

| Parameter     | Type | Description                                                                                                                                                                                                                                                                                                                    |
| ------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| networkStatus | enum | `DROPPED` - The transaction was dropped by the network (Typically due to a low fee, or if the mempool is full). \n`BROADCASTING` - Broadcasting to the blockchain. \n`CONFIRMING` - Pending confirmations. \n`FAILED` - The transaction has failed to complete on the blockchain. \n`CONFIRMED` - Confirmed on the blockchain. |

***

## TransactionRequestDestination

| Parameter   | Type                                                        | Description                               |
| ----------- | ----------------------------------------------------------- | ----------------------------------------- |
| amount      | string                                                      | The amount to be sent to this destination |
| destination | [DestinationTransferPeerPath](#destinationtransferpeerpath) | The specific destination                  |

***

## DropTransactionRequest

| Parameter | Type   | Description                                                    |
| --------- | ------ | -------------------------------------------------------------- |
| txId      | string | The ID of the transaction being dropped.                       |
| feeLevel  | string | The fee level for the replacement of non-ETH transactions.     |
| gasPrice  | string | The network fee level for the replacement of ETH transactions. |

***

## DropTransactionResponse

| Parameter    | Type    | Description                                                   |
| ------------ | ------- | ------------------------------------------------------------- |
| success      | boolean | True if the transaction dropped or the replacement succeeded. |
| transactions | array   | Dropped Transaction replacement Transaction ID(s).            |

***

## SetConfirmationsThresholdResponse

| Parameter    | Type             | Description               |
| ------------ | ---------------- | ------------------------- |
| success      | boolean          |                           |
| transactions | array of strings | txIds of the transactions |

***

## NodeControls

| Parameter | Type          | Description                                                                                                                                                                             |
| --------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type      | string (enum) | Transaction routing type. \nEnum Values: \n \n- **NODE\_ROUTER**\n- **MEV**For routing transactions to a custom node set - **NODE\_ROUTER** \n For MEV protection routing set - **MEV** |
| tag       | string        | Used for **NODE\_ROUTER** type only. The pre-configured tag of the node to route the transaction to                                                                                     |

## Index

| Parameter | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Index     | integer | **(Optional)** Fireblocks’ internal identifier for a specific transfer within a transaction.   - For UTXO-based assets, this field corresponds to the UTOX's vOut index. - For other blockchains, like EVM, Tron, Solana, etc., this field is derived from the sequential position of the event within the transaction's transfer list. The field is not returned when the transaction includes multiple destinations. |

## logIndex

| Parameter | Type    | Description                                                                                                                                                                         |
| --------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| logIndex  | integer | Applicable to EVM blockchains only. Represents the EVM log index that indicates the order of the log within the block. This information can be verified directly on the blockchain. |

## blockchainIndex

| Parameter       | Type   | Description                                                                                                                                                                                                                                                                                                                                                        |
| --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| blockchainIndex | string | Blockchain-native transfer identifier showing the transfer’s exact position within the block data (e.g. log entry, trace path, or nested array index).   - **EVM token transfers**: Uses logIndex. - **EVM internal transfers**: Uses traceAddress (e.g., \[0,1,2] → "0\_1\_2"). - **Solana**: Refers to the nested instruction position in the instruction array. |

## nonce

| Parameter | Type   | Description                                     |
| --------- | ------ | ----------------------------------------------- |
| nonce     | string | Blockchain nonce for the transaction (EVM only) |
