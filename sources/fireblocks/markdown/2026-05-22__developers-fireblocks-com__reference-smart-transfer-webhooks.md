> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Smart Transfer Webhooks

> **Deprecation notice**
>
> Webhooks v1 will be deprecated on **June 15th, 2026**. Please use the Developer Center in the Fireblocks Console to upgrade to Webhooks V2, which offers improved reliability, performance, and observability.

This page describes all events relating to Fireblocks Smart Transfers that produce Webhook notifications, and their associated data objects.

The `type` parameter is automatically set to the description name for the data objects below.

## Ticket created

Notification is sent when a Smart Transfer ticket is created.

| Parameter              | Type   | Description                                                              |
| ---------------------- | ------ | ------------------------------------------------------------------------ |
| ticketId               | string | Unique ID for the ticket                                                 |
| type                   | string | The type of settlement for the ticket: Currently only async              |
| status                 | string | The status of the ticket                                                 |
| createdByNetworkId     | string | The network ID of the Fireblocks Network profile that created the ticket |
| createdByNetworkIdName | string | The name of the Fireblocks Network profile that created the ticket       |
| createdAt              | date   | Time and date when the ticket was created                                |
| expiresIn              | number | Expiration of the ticket in hours                                        |

## Ticket counterparty added

Notification is sent when a counterparty is added to a Smart Transfer ticket.

| Parameter     | Type   | Description                                                 |
| ------------- | ------ | ----------------------------------------------------------- |
| ticketId      | string | Unique ID for the ticket                                    |
| networkId     | string | Network ID of the connection receiving a ticket             |
| networkIdName | string | Name of the Fireblocks Network profile receiving the ticket |

## Ticket counterparty external ID added

Notification is sent when an external ID is added to a Smart Transfer ticket.

| Parameter     | Type   | Description                          |
| ------------- | ------ | ------------------------------------ |
| ticketId      | string | Unique ID for the ticket             |
| externalRefId | string | Any ID a customer adds to the system |

## Ticket note added

Notification is sent when a note is added to a Smart Transfer ticket.

| Parameter | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| ticketId  | string | Unique ID for the ticket                |
| body      | string | Text of the note                        |
| createdAt | date   | Time and date when the note was created |

## Ticket submitted

Notification is sent when a Smart Transfer ticket is submitted.

| Parameter   | Type   | Description                           |
| ----------- | ------ | ------------------------------------- |
| ticketId    | string | Unique ID for the ticket              |
| expiresIn   | number | Expiration of the ticket in hours     |
| status      | string | Status of the ticket                  |
| expiresAt   | date   | Date and time when the ticket expires |
| submittedAt | date   | Date and time the ticket is submitted |

## Ticket expires at set

Notification is sent when a Smart Transfer ticket expiration is set.

| Parameter | Type   | Description                           |
| --------- | ------ | ------------------------------------- |
| ticketId  | string | Unique ID for the ticket              |
| expiresAt | date   | Date and time when the ticket expires |

## Ticket expires in set

Notification is sent when a Smart Transfer ticket expiration is set.

| Parameter | Type   | Description                       |
| --------- | ------ | --------------------------------- |
| ticketId  | string | Unique ID for the ticket          |
| expiresIn | number | Expiration of the ticket in hours |

## Ticket expired

Notification is sent when a Smart Transfer ticket expires.

| Parameter | Type   | Description                           |
| --------- | ------ | ------------------------------------- |
| ticketId  | string | Unique ID for the ticket              |
| status    | string | Status of the ticket                  |
| expiresAt | date   | Date and time when the ticket expired |

## Ticket fulfilled

Notification is sent when a Smart Transfer ticket is fulfilled.

| Parameter   | Type   | Description                                               |
| ----------- | ------ | --------------------------------------------------------- |
| ticketId    | string | Unique ID for the ticket                                  |
| fulfilledAt | date   | Date and time when the ticket was fulfilled by both sides |

## Ticket canceled

Notification is sent when a Smart Transfer ticket is canceled.

| Parameter  | Type   | Description                                |
| ---------- | ------ | ------------------------------------------ |
| ticketId   | string | Unique ID for the ticket                   |
| canceledAt | date   | Date and time when the ticket was canceled |

## Ticket term added

Notification is sent when a Smart Transfer ticket term is added.

| Parameter     | Type   | Description                                  |
| ------------- | ------ | -------------------------------------------- |
| ticketId      | string | Unique ID for the ticket                     |
| termId        | string | Unique ID of the term                        |
| asset         | string | Asset name being sent in the term            |
| amount        | string | Amount of the asset being sent               |
| fromNetworkId | string | NetworkId from which the asset is being sent |
| toNetworkId   | string | NetworkId to which the asset is being sent   |
| status        | string | Status of the ticket                         |

## Ticket term updated

Notification is sent when a Smart Transfer ticket term is updated.

| Parameter     | Type   | Description                                  |
| ------------- | ------ | -------------------------------------------- |
| ticketId      | string | Unique ID for the ticket                     |
| termId        | string | Unique ID of the term                        |
| asset         | string | Asset name being sent in the term            |
| amount        | string | Amount of the asset being sent               |
| fromNetworkId | string | NetworkId from which the asset is being sent |
| toNetworkId   | string | NetworkId to which the asset is being sent   |

## Ticket term deleted

Notification is sent when a Smart Transfer ticket term is deleted.

| Parameter | Type   | Description              |
| --------- | ------ | ------------------------ |
| ticketId  | string | Unique ID for the ticket |
| termId    | string | Unique ID of the term    |

## Ticket term funded

Notification is sent when a Smart Transfer ticket term is funded.

| Parameter           | Type   | Description                                                                                                             |
| ------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------- |
| ticketId            | string | Unique ID for the ticket                                                                                                |
| termId              | string | Unique ID of the term                                                                                                   |
| asset               | string | Asset name of the asset being sent to fund the term                                                                     |
| amount              | string | Amount of the asset being sent to fund the term                                                                         |
| networkConnectionId | string | Network ID funding the term                                                                                             |
| srcId               | string | vaultId if srcType is VAULT\_ACCOUNT;  exchangeId if srcType is EXCHANGE; or  fiatAccountId if srcType is FIAT\_ACCOUNT |
| srcType             | string | Type of the account from which the funds are originating;  can be a vault, an exchange, or a fiat account               |
| note                | string | Text of the note                                                                                                        |
| fee                 | string | Amount of fee paid for the transaction funding the term                                                                 |
| feeLevel            | string | Fee level being paid                                                                                                    |

## Ticket term manually funded

Notification is sent when a Smart Transfer ticket term is manually funded.

| Parameter | Type   | Description                                 |
| --------- | ------ | ------------------------------------------- |
| ticketId  | string | Unique ID for the ticket                    |
| termId    | string | Unique ID of the term                       |
| txHash    | string | TX hash of the transaction funding the term |

## Ticket term funding canceled

Notification is sent when a Smart Transfer ticket term’s funding is canceled.

| Parameter | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| ticketId  | string | Unique ID for the ticket                |
| termId    | string | Unique ID of the term                   |
| txStatus  | string | Status of the transfer funding the term |

## Ticket term funding failed

Notification is sent when a Smart Transfer ticket term’s funding fails.

| Parameter | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| ticketId  | string | Unique ID for the ticket                |
| termId    | string | Unique ID of the term                   |
| txStatus  | string | Status of the transfer funding the term |

## Ticket term funding completed

Notification is sent when a Smart Transfer ticket term’s funding is completed.

| Parameter | Type   | Description                                 |
| --------- | ------ | ------------------------------------------- |
| ticketId  | string | Unique ID for the ticket                    |
| termId    | string | Unique ID of the term                       |
| txSHash   | string | TX hash of the transaction funding the term |
| txStatus  | string | Status of the transfer funding the term     |

## Ticket term transaction status changed

Notification is sent when a Smart Transfer ticket term’s transaction status changes.

| Parameter | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| ticketId  | string | Unique ID for the ticket                |
| termId    | string | Unique ID of the term                   |
| txStatus  | string | Status of the transfer funding the term |
