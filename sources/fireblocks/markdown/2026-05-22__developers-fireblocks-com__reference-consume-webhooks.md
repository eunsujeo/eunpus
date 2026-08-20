> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Webhooks v1

> **Deprecation notice**
>
> Webhooks v1 will be deprecated on **June 15th, 2026**. Please use the Developer Center in the Fireblocks Console to upgrade to Webhooks V2, which offers improved reliability, performance, and observability.

## Overview

Webhooks provide real-time notifications for events happening within your Fireblocks workspace, such as incoming and outgoing transactions, transaction status updates, and the addition of new vault accounts, contract wallets, internal wallets, or external wallets. By configuring webhooks, you can 'listen' for these events at your chosen URL, ensuring that all relevant event types are broadcast to your designated endpoint.

Using webhooks offers several benefits, particularly for event-driven development. They enable immediate awareness of critical events, allowing your systems to respond quickly and automatically to changes in your workspace. This real-time monitoring enhances operational efficiency, as it can trigger automated workflows, updates, or alerts based on the specific events received. Webhooks also facilitate seamless integration with your existing applications, enabling more dynamic and responsive interactions between your Fireblocks workspace and other platforms.

When implementing webhooks, consider the reliability and scalability of the receiving endpoint. Ensure that your system can handle the volume of incoming events and process them efficiently.

If notifications are missed due to any issue, Fireblocks offers the following API endpoints for resending webhook notifications:

* [Resend failed webhooks](/reference/resendwebhooks) - Resends all failed webhook notifications
* [Resend webhooks for a transaction by ID](/reference/resendtransactionwebhooks) - Resends webhook notifications for a transaction by its unique identifier

**Key Features**:

* **Event Ordering** - Webhook events are sent in order with a 10-second delay.
* **Retry Logic** - Missed Webhooks are retried every 5, 15, 35, 75, 155, 315, 635, 1275, 2555 (in seconds).

## Payload Structure

We have a standard payload structure that we implement throughout, as shown below:

| Parameter | Type   | Description                                        |
| --------- | ------ | -------------------------------------------------- |
| type      | string | The event type. For example: `VAULT_ACCOUNT_ADDED` |
| tenantId  | string | Unique ID of your Fireblocks workspace             |
| timestamp | number | Timestamp in milliseconds                          |
| data      | object | Object details                                     |

Below is a sample of the payload response:

```json theme={"system"}
{
    "type": "TRANSACTION_CREATED",
    "tenantId”:  ".........-.....-....-....-...........",
    "timestamp": 1679651214621,
    "data": {
        "id": "........-....-....-....-............",
        "createdAt": 1679651104380,
        "lastUpdated": 1679651104380,
        "assetId": "WETH_TEST3",
        "source": {
            "id": "0",
            "type": "VAULT_ACCOUNT",
            "name": "Main",
            "subType": ""
        },
        "destination": {
            "id": "12",
            "type": "VAULT_ACCOUNT",
            "name": "MintBurn",
            "subType": ""
        },
        "amount": 0.001,
        "sourceAddress": "",
        "destinationAddress": "",
        "destinationAddressDescription": "",
        "destinationTag": "",
        "status": "SUBMITTED",
        "txHash": "",
        "subStatus": "",
        "signedBy": [],
        "createdBy": ".........-.....-....-....-...........",
        "rejectedBy": "",
        "amountUSD": null,
        "addressType": "",
        "note": "",
        "exchangeTxId": "",
        "requestedAmount": 0.001,
        "feeCurrency": "ETH_TEST3",
        "operation": "TRANSFER",
        "customerRefId": null,
        "amountInfo": {
            "amount": "0.001",
            "requestedAmount": "0.001"
        },
        "feeInfo": {},
        "destinations": [],
        "externalTxId": null,
        "blockInfo": {},
        "signedMessages": [],
        "assetType": "ERC20"
    }
}
```

## Event Types

| Category                             | Event Type                                 |
| ------------------------------------ | ------------------------------------------ |
| Transactions                         | TRANSACTION\_CREATED                       |
| Transactions                         | TRANSACTION\_STATUS\_UPDATED               |
| Transactions                         | TRANSACTION\_APPROVAL\_STATUS\_UPDATED     |
| Internal, External & Contract Wallet | EXTERNAL\_WALLET\_ASSET\_ADDED             |
| Internal, External & Contract Wallet | EXTERNAL\_WALLET\_ASSET\_REMOVED           |
| Internal, External & Contract Wallet | INTERNAL\_WALLET\_ASSET\_ADDED             |
| Internal, External & Contract Wallet | INTERNAL\_WALLET\_ASSET\_REMOVED           |
| Internal, External & Contract Wallet | CONTRACT\_WALLET\_ASSET\_ADDED             |
| Internal, External & Contract Wallet | CONTRACT\_WALLET\_ASSET\_REMOVED           |
| Vault                                | VAULT\_ACCOUNT\_ADDED                      |
| Vault                                | VAULT\_ACCOUNT\_ASSET\_ADDED               |
| Vault                                | VAULT\_BALANCE\_UPDATE                     |
| NFT                                  | NFT\_BALANCE\_CHANGED                      |
| Exchange & Fiat Account              | EXCHANGE\_ACCOUNT\_ADDED                   |
| Exchange & Fiat Account              | FIAT\_ACCOUNT\_ADDED                       |
| Network Connection                   | NETWORK\_CONNECTION\_ADDED                 |
| Smart Transfer                       | TICKET\_CREATED                            |
| Smart Transfer                       | TICKET\_SUBMITTED                          |
| Smart Transfer                       | TICKET\_EXPIRED                            |
| Smart Transfer                       | TICKET\_CANCELED                           |
| Smart Transfer                       | TICKET\_FULFILLED                          |
| Smart Transfer                       | TICKET\_COUNTERPARTY\_ADDED                |
| Smart Transfer                       | TICKET\_COUNERPARTY\_EXTERNAL\_ID\_SET     |
| Smart Transfer                       | TICKET\_NOTE\_ADDED                        |
| Smart Transfer                       | TICKET\_EXPIRES\_IN\_SET                   |
| Smart Transfer                       | TICKET\_EXPIRES\_AT\_SET                   |
| Smart Transfer                       | TICKET\_TERM\_ADDED                        |
| Smart Transfer                       | TICKET\_TERM\_UPDATED                      |
| Smart Transfer                       | TICKET\_TERM\_DELETED                      |
| Smart Transfer                       | TICKET\_TERM\_FUNDED                       |
| Smart Transfer                       | TICKET\_TERM\_MANUALLY\_FUNDED             |
| Smart Transfer                       | TICKET\_TERM\_FUNDING\_CANCELED            |
| Smart Transfer                       | TICKET\_TERM\_FUNDING\_COMPLETED           |
| Smart Transfer                       | TICKET\_TERM\_TRANSACTION\_STATUS\_CHANGED |
| Off Exchange                         | SETTLEMENT\_CREATED                        |
| Off Exchange                         | COLLATERAL\_SIGNER\_READY\_EVENT           |

## IP Whitelisting

Whitelisting Webhook IP addresses is optional but recommended. Webhooks are sent from the following IPs:

* **US environment:** 3.134.25.131
* **EU environment:** 3.72.125.45, 18.184.217.45, 18.198.71.192
