> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Tokenization events

This page covers all Tokenization events that can trigger webhook notifications, and their associated data objects for the Webhooks v2 service.

These events are part of the Fireblocks Webhooks v2 event types. For a complete list of supported webhook events, see [Event types](/reference/webhooks-structures-eventtypes).

## Tokenization event types

To receive a specific event, include its **eventType** in the webhook's [notification object](/reference/webhooks-structures-notificationstructure#/).

| Event type            | Data object returned                                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| onchain\_data.updated | [OnchainDataUpdatedEventData](/reference/webhooks-structures-eventtypes-tokenization#onchaindataupdatedeventdata) |

***

## Supported blockchains

Fireblocks generates Tokenization webhook events only for managed smart contracts deployed on the following blockchains.

### Testnets

* Ethereum Sepolia (sepolia)
* Polygon Amoy (amoy)
* BNB Smart Chain Testnet (bsc\_testnet)
* Optimism Sepolia (optimism\_sepolia)
* Base Sepolia (base\_sepolia)
* Avalanche C-Chain Fuji (fuji)
* Arbitrum Sepolia (arbitrum\_sepolia)

### Mainnets

* Ethereum (ethereum)
* BNB Smart Chain (bsc)
* Polygon (polygon)
* Base (base)
* Avalanche C-Chain (avalanche)
* Optimism (optimism)
* Arbitrum (arbitrum)
* Gnosis (gnosis)
* Ethereum Hoodi (hoodi)

Tokenization events are emitted only for contracts deployed on the supported blockchains listed above.

## Data objects

### OnchainDataUpdatedEventData

| Parameter         | Type    | Description                                                             |
| ----------------- | ------- | ----------------------------------------------------------------------- |
| baseAssetId       | string  | The AssetId of the blockchain's gas token.                              |
| blockHash         | string  | Hash of the block that contains the transaction emitting the log.       |
| blockNumber       | number  | Height of the block that contains the transaction.                      |
| blockTimestamp    | number  | The time the block was mined, as indicated in the block header.         |
| chainId           | number  | EVM chain identifier (as per EIP-155).                                  |
| contractAddress   | string  | The address that emitted the log.                                       |
| cumulativeGasUsed | string  | Total gas used in the block up to and including this transaction.       |
| decodedLogs       | object  | [DecodedLog](/reference/tokenization-events#decodedlog)                 |
| effectiveGasPrice | string  | Actual price paid per gas unit for this transaction.                    |
| from              | string  | Sender of the transaction.                                              |
| gasUsed           | integer | Gas consumed by this transaction.                                       |
| logsBloom         | string  | Bloom filter summarizing addresses and topics for the transaction logs. |
| status            | string  | The status of the transaction (0x0 = failure, 0x1 = success).           |
| to                | string  | The recipient of the transaction.                                       |
| transactionHash   | string  | Hash that identifies the transaction.                                   |
| transactionIndex  | string  | Zero-based index of the transaction within the block.                   |
| type              | string  | Transaction type tag (as per EIP-2718).                                 |

### DecodedLog

| Parameter       | Type   | Description                                                       |
| --------------- | ------ | ----------------------------------------------------------------- |
| address         | string | The contract address emitting the event.                          |
| blockHash       | string | Hash of the block that contains the transaction emitting the log. |
| blockNumber     | string | Height of the block that contains the transaction.                |
| transactionHash | string | Hash that identifies the transaction.                             |
| logIndex        | string | The index of the log within the transaction.                      |
| key             | string | The decoded name of the log parameter.                            |
| value           | string | The value associated with the key.                                |
