> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Smart Transfer events

This page covers all Smart Transfer events that can trigger webhook notifications, and their associated data objects for the Webhooks v2 service.

## Event types

To receive a specific event, include its **eventType** in the webhook's [notification object](/reference/webhooks-structures-notificationstructure#/).

| Event type                               | Data object returned                                                                                                                      |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| ticket.created                           | [Ticket created](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-created)                                                 |
| ticket.counterparty.added                | [Ticket counterparty added](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-counterparty-added)                           |
| ticket.counterparty\_external\_id.set    | [Ticket counterparty external ID set](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-counterparty-external-id-set)       |
| ticket.note.added                        | [Ticket note added](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-note-added)                                           |
| ticket.submitted                         | [Ticket submitted](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-submitted)                                             |
| ticket.expires\_at.set                   | [Ticket expires at set](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-expires-at-set)                                   |
| ticket.expires\_in.set                   | [Ticket expires in set](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-expires-in-set)                                   |
| ticket.expired                           | [Ticket expired](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-expired)                                                 |
| ticket.fulfilled                         | [Ticket fulfilled](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-fulfilled)                                             |
| ticket.canceled                          | [Ticket canceled](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-canceled)                                               |
| ticket.term.added                        | [Ticket term added](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-term-added)                                           |
| ticket.term.updated                      | [Ticket term updated](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-term-updated)                                       |
| ticket.term.deleted                      | [Ticket term deleted](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-term-deleted)                                       |
| ticket.term.funded                       | [Ticket term funded](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-term-funded)                                         |
| ticket.term.manually\_funded             | [Ticket term manually funded](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-term-manually-funded)                       |
| ticket.term.funding\_canceled            | [Ticket term funding canceled](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-term-funding-canceled)                     |
| ticket.term.funding\_failed              | [Ticket term funding failed](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-term-funding-failed)                         |
| ticket.term.funding\_completed           | [Ticket term funding completed](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-term-funding-completed)                   |
| ticket.term.status\_transaction\_changed | [Ticket term transaction status changed](/reference/webhooks-structures-eventtypes-smarttransfer#/ticket-term-transaction-status-changed) |

***

## Data objects

### Ticket created

| Parameter              | Type   | Description                                                              |
| ---------------------- | ------ | ------------------------------------------------------------------------ |
| ticketId               | string | Unique ID for the ticket                                                 |
| type                   | string | The type of settlement for the ticket: Currently, only async             |
| status                 | string | The status of the ticket                                                 |
| createdByNetworkId     | string | The network ID of the Fireblocks Network profile that created the ticket |
| createdByNetworkIdName | string | The name of the Fireblocks Network profile that created the ticket       |
| createdAt              | date   | Time and date when the ticket was created                                |
| expiresIn              | number | Expiration of the ticket in hours                                        |

### Ticket counterparty added

| Parameter     | Type   | Description                                                 |
| ------------- | ------ | ----------------------------------------------------------- |
| ticketId      | string | Unique ID for the ticket                                    |
| networkId     | string | Network ID of the connection receiving a ticket             |
| networkIdName | string | Name of the Fireblocks Network profile receiving the ticket |

### Ticket counterparty external ID set

| Parameter     | Type   | Description                          |
| ------------- | ------ | ------------------------------------ |
| ticketId      | string | Unique ID for the ticket             |
| externalRefId | string | Any ID a customer adds to the system |

### Ticket note added

| Parameter | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| ticketId  | string | Unique ID for the ticket                |
| body      | string | Text of the note                        |
| createdAt | date   | Time and date when the note was created |

### Ticket submitted

| Parameter   | Type   | Description                           |
| ----------- | ------ | ------------------------------------- |
| ticketId    | string | Unique ID for the ticket              |
| expiresIn   | number | Expiration of the ticket in hours     |
| status      | string | Status of the ticket                  |
| expiresAt   | date   | Date and time when the ticket expires |
| submittedAt | date   | Date and time the ticket is submitted |

### Ticket expires at set

| Parameter | Type   | Description                           |
| --------- | ------ | ------------------------------------- |
| ticketId  | string | Unique ID for the ticket              |
| expiresAt | date   | Date and time when the ticket expires |

### Ticket expires in set

| Parameter | Type   | Description                       |
| --------- | ------ | --------------------------------- |
| ticketId  | string | Unique ID for the ticket          |
| expiresIn | number | Expiration of the ticket in hours |

### Ticket expired

| Parameter | Type   | Description                           |
| --------- | ------ | ------------------------------------- |
| ticketId  | string | Unique ID for the ticket              |
| status    | string | Status of the ticket                  |
| expiresAt | date   | Date and time when the ticket expired |

### Ticket fulfilled

| Parameter   | Type   | Description                                               |
| ----------- | ------ | --------------------------------------------------------- |
| ticketId    | string | Unique ID for the ticket                                  |
| fulfilledAt | date   | Date and time when the ticket was fulfilled by both sides |

### Ticket canceled

| Parameter  | Type   | Description                                |
| ---------- | ------ | ------------------------------------------ |
| ticketId   | string | Unique ID for the ticket                   |
| canceledAt | date   | Date and time when the ticket was canceled |

### Ticket term added

| Parameter     | Type   | Description                                  |
| ------------- | ------ | -------------------------------------------- |
| ticketId      | string | Unique ID for the ticket                     |
| termId        | string | Unique ID of the term                        |
| asset         | string | Asset name being sent in the term            |
| amount        | string | Amount of the asset being sent               |
| fromNetworkId | string | NetworkId from which the asset is being sent |
| toNetworkId   | string | NetworkId to which the asset is being sent   |
| status        | string | Status of the ticket                         |

### Ticket term updated

| Parameter     | Type   | Description                                  |
| ------------- | ------ | -------------------------------------------- |
| ticketId      | string | Unique ID for the ticket                     |
| termId        | string | Unique ID of the term                        |
| asset         | string | Asset name being sent in the term            |
| amount        | string | Amount of the asset being sent               |
| fromNetworkId | string | NetworkId from which the asset is being sent |
| toNetworkId   | string | NetworkId to which the asset is being sent   |

### Ticket term deleted

| Parameter | Type   | Description              |
| --------- | ------ | ------------------------ |
| ticketId  | string | Unique ID for the ticket |
| termId    | string | Unique ID of the term    |

### Ticket term funded

| Parameter           | Type   | Description                                                                                                           |
| ------------------- | ------ | --------------------------------------------------------------------------------------------------------------------- |
| ticketId            | string | Unique ID for the ticket                                                                                              |
| termId              | string | Unique ID of the term                                                                                                 |
| asset               | string | Asset name of the asset being sent to fund the term                                                                   |
| amount              | string | Amount of the asset being sent to fund the term                                                                       |
| networkConnectionId | string | Network ID funding the term                                                                                           |
| srcId               | string | vaultId if srcType is VAULT\_ACCOUNT; exchangeId if srcType is EXCHANGE; or fiatAccountId if srcType is FIAT\_ACCOUNT |
| srcType             | string | Type of the account from which the funds are originating; can be a vault, an exchange, or a fiat account              |
| note                | string | Text of the note                                                                                                      |
| fee                 | string | Amount of fee paid for the transaction funding the term                                                               |
| feeLevel            | string | Fee level being paid                                                                                                  |

### Ticket term manually funded

| Parameter | Type   | Description                                 |
| --------- | ------ | ------------------------------------------- |
| ticketId  | string | Unique ID for the ticket                    |
| termId    | string | Unique ID of the term                       |
| txHash    | string | TX hash of the transaction funding the term |

### Ticket term funding canceled

| Parameter | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| ticketId  | string | Unique ID for the ticket                |
| termId    | string | Unique ID of the term                   |
| txStatus  | string | Status of the transfer funding the term |

### Ticket term funding failed

| Parameter | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| ticketId  | string | Unique ID for the ticket                |
| termId    | string | Unique ID of the term                   |
| txStatus  | string | Status of the transfer funding the term |

### Ticket term funding completed

| Parameter | Type   | Description                                 |
| --------- | ------ | ------------------------------------------- |
| ticketId  | string | Unique ID for the ticket                    |
| termId    | string | Unique ID of the term                       |
| txSHash   | string | TX hash of the transaction funding the term |
| txStatus  | string | Status of the transfer funding the term     |

### Ticket term transaction status changed

| Parameter | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| ticketId  | string | Unique ID for the ticket                |
| termId    | string | Unique ID of the term                   |
| txStatus  | string | Status of the transfer funding the term |
