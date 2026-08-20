> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Migration Guide

> **Deprecation notice**
>
> Webhooks v1 will be deprecated on **June 15th, 2026**. Please use the Developer Center in the Fireblocks Console to upgrade to Webhooks V2, which offers improved reliability, performance, and observability.

# Overview

The new Webhooks V2 service provides a more robust, reliable, faster, and feature-rich integration experience. While the new system introduces many enhanced capabilities, it also deprecates some existing features to streamline functionality and improve performance.

## Key benefits

* **Improved performance**: Reduced response times and increased resiliency.
* **Events catalog**: Subscribe to specific events or event categories.
* **Visibility**: New UI for notifications and send attempts.
* **Enhanced controls**: UI and API management, including notifications, resend up to 30 days.
* **No holdups**: Removed existing 10s inherent delay used in V1 to best-effort order messages.

> **Before you begin**
>
> * This page is not intended to serve as an implementation guide. It only highlights the differences between the Webhooks v1 and Webhooks v2 services and provides an event mapping table.
> * Ensure that you review *all* Webhooks v2 documentation and implement the service according to your organization's best practices.
> * If your organization requires IP addresses to be allowlisted, please note that the IP addresses required for Webhooks v2 are different from those of Webhooks v1. Learn more [here](/reference/webhooks-ip-allowlisting).

***

# Changelog

## Events

* **Event catalog & subscriptions:** Browse the event catalog and subscribe only to the categories or specific event types relevant to your use case. This lets you focus on the events you need, reduce unnecessary processing, and maintain a cleaner integration.
* **Event types:** We introduced a new syntax for event types. Use the table below to map your Webhooks v1 events to the new Webhooks v2 syntax.
* **Event ordering:** While we attempt to send notifications in order (per resource), Fireblocks doesn’t guarantee delivery of events in the order in which they’re generated. **Your endpoint shouldn’t expect the delivery of events in order.**

## Resend capability

We now allow resending events for up to 30 days from the original event timestamp.
To initiate a resend, use the **resourceId** field of the event's data object. Please note that you can only resend events once every five minutes.

## Improved retry logic

Retry attempts for failed webhook deliveries now span a longer time window to help ensure delivery success.

## Error rate monitoring & disabling

Webhooks with an error rate exceeding a specific threshold will be automatically disabled to protect the system integrity.
You should handle events asynchronously with queues and quickly return a 2xx status code to prevent performance issues in your application

***

# Notifications object differentiation

The new webhook payload format is designed for clarity and extensibility. Below is the structure of the new payload:

| Old field | New field   | Type          | Description                                                                                                            |
| --------- | ----------- | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| -         | id          | string (UUID) | Unique identifier for the webhook notification object.                                                                 |
| type      | eventType   | enum          | Description of the event (e.g., `transaction.created`).                                                                |
| -         | resourceId  | string (UUID) | (Optional) ID of the entity that triggered the event (e.g., `txid`).                                                   |
| data      | data        | object        | Contains the API resource relevant to the event (e.g., the full transaction object for a `transaction.created` event). |
| timestamp | createdAt   | number        | Webhook timestamp.                                                                                                     |
| tenantId  | workspaceId | string (UUID) | The tenant or workspace identifier associated with the event.                                                          |

> **Notification object has been updated**
>
> Although the event payload remains unchanged, the notification object has been updated, requiring some adjustments on your end for parsing. Additionally, you’ll need to register your webhook listener on Push API V2 to start using it.

## Key changes

* **id**: Unique identifier for the webhook notification object.
* **type** → **eventType**: Unified event naming for consistency.
* **resourceId**: Introduced to enable precise identification of the entity associated with the event.
* **tenantId** → **workspaceId**: The tenant/workspace identifier associated with the event.
* **timestamp** → **createdAt**: Describes when the webhook was created.

***

# Event mapping from v1 to v2

Use the table below to help you map your Webhooks v1 events to your Webhooks v2 events.

| V1 Category                          | V1 Event Type                                      | V2 Category     | V2 Event Type                                  |
| ------------------------------------ | -------------------------------------------------- | --------------- | ---------------------------------------------- |
| Transactions                         | TRANSACTION\\\_CREATED                             | Transactions    | transaction.created                            |
| Transactions                         | TRANSACTION\\\_STATUS\\\_UPDATED                   | Transactions    | transaction.status.updated                     |
| Transactions                         | TRANSACTIONS\\\_APPROVAL\\\_STATUS\\\_UPDATED      | Transactions    | transaction.approval\\\_status.updated         |
| Internal, External & Contract Wallet | EXTERNAL\\\_WALLET\\\_ASSET\\\_ADDED               | Whitelist       | external\\\_wallet.asset.added                 |
| Internal, External & Contract Wallet | EXTERNAL\\\_WALLET\\\_ASSET\\\_REMOVED             | Whitelist       | external\\\_wallet.asset.removed               |
| Internal, External & Contract Wallet | INTERNAL\\\_WALLET\\\_ASSET\\\_ADDED               | Whitelist       | internal\\\_wallet.asset.added                 |
| Internal, External & Contract Wallet | INTERNAL\\\_WALLET\\\_ASSET\\\_REMOVED             | Whitelist       | internal\\\_wallet.asset.removed               |
| Internal, External & Contract Wallet | CONTRACT\\\_WALLET\\\_ASSET\\\_ADDED               | Whitelist       | contract\\\_wallet.asset.added                 |
| Internal, External & Contract Wallet | CONTRACT\\\_WALLET\\\_ASSET\\\_REMOVED             | Whitelist       | contract\\\_wallet.asset.removed               |
| Vault                                | VAULT\\\_ACCOUNT\\\_ADDED                          | Wallet          | vault\\\_account.created                       |
| Vault                                | VAULT\\\_ACCOUNT\\\_ASSET\\\_ADDED                 | Wallet          | vault\\\_account.asset.added                   |
| Vault                                | VAULT\\\_BALANCE\\\_UPDATE                         | Wallet          | vault\\\_account.asset.balance\\\_updated      |
| NFT                                  | VAULT\\\_ACCOUNT\\\_NFT\\\_BALANCE\\\_UPDATED      | Wallet          | vault\\\_account.nft.balance\\\_updated        |
| Embedded Wallet                      | NCW\\\_STATUS\\\_UPDATED                           | Embedded Wallet | embedded\\\_wallet.status.updated              |
| Embedded Wallet                      | NCW\\\_STATUS\\\_CREATED                           | Embedded Wallet | embedded\\\_wallet.account.created             |
| Embedded Wallet                      | NCW\\\_ASSET\\\_CREATED                            | Embedded Wallet | embedded\\\_wallet.asset.added                 |
| Embedded Wallet                      | NCW\\\_BALANCE\\\_UPDATED                          | Embedded Wallet | embedded\\\_wallet.asset.balance\\\_updated    |
| Embedded Wallet                      | NCW\\\_ADD\\\_DEVICE\\\_SETUP\\\_REQUESTED         | Embedded Wallet | embedded\\\_wallet.device.added                |
| Exchange & Fiat Account              | EXCHANGE\\\_ACCOUNT\\\_ADDED                       | CeFi            | exchange\\\_account.added                      |
| Exchange & Fiat Account              | FIAT\\\_ACCOUNT\\\_ADDED                           | CeFi            | fiat\\\_account.added                          |
| Network Connection                   | NETWORK\\\_CONNECTION\\\_REMOVED                   | Network         | connection.removed                             |
| Network Connection                   | NETWORK\\\_CONNECTION\\\_ADDED                     | Network         | connection.added                               |
| Network Connection                   | WAITING\\\_FOR\\\_PEER\\\_APPROVAL                 | Network         | connection.request.waiting\\\_peer\\\_approval |
| Network Connection                   | REJECTED\\\_BY\\\_PEER                             | Network         | connection.request.rejected\\\_by\\\_peer      |
| Smart Transfer                       | TICKET\\\_CREATED                                  | Smart Transfer  | ticket.created                                 |
| Smart Transfer                       | TICKET\\\_SUBMITTED                                | Smart Transfer  | ticket.submitted                               |
| Smart Transfer                       | TICKET\\\_EXPIRED                                  | Smart Transfer  | ticket.expired                                 |
| Smart Transfer                       | TICKET\\\_CANCELED                                 | Smart Transfer  | ticket.canceled                                |
| Smart Transfer                       | TICKET\\\_FULFILLED                                | Smart Transfer  | ticket.fulfilled                               |
| Smart Transfer                       | TICKET\\\_COUNTERPARTY\\\_ADDED                    | Smart Transfer  | ticket.counterparty.added                      |
| Smart Transfer                       | TICKET\\\_COUNTERPARTY\\\_EXTERNAL\\\_ID\\\_SET    | Smart Transfer  | ticket.counterparty\\\_external\\\_id.set      |
| Smart Transfer                       | TICKET\\\_NOTE\\\_ADDED                            | Smart Transfer  | ticket.note.added                              |
| Smart Transfer                       | TICKET\\\_EXPIRES\\\_IN\\\_SET                     | Smart Transfer  | ticket.expires\\\_in.set                       |
| Smart Transfer                       | TICKET\\\_EXPIRES\\\_AT\\\_SET                     | Smart Transfer  | ticket.expires\\\_at.set                       |
| Smart Transfer                       | TICKET\\\_TERM\\\_ADDED                            | Smart Transfer  | ticket.term.added                              |
| Smart Transfer                       | TICKET\\\_TERM\\\_UPDATED                          | Smart Transfer  | ticket.term.updated                            |
| Smart Transfer                       | TICKET\\\_TERM\\\_DELETED                          | Smart Transfer  | ticket.term.deleted                            |
| Smart Transfer                       | TICKET\\\_TERM\\\_FUNDED                           | Smart Transfer  | ticket.term.funded                             |
| Smart Transfer                       | TICKET\\\_TERM\\\_MANUALLY\\\_FUNDED               | Smart Transfer  | ticket.term.manually\\\_funded                 |
| Smart Transfer                       | TICKET\\\_TERM\\\_FUNDING\\\_CANCELED              | Smart Transfer  | ticket.term.funding\\\_canceled                |
| Smart Transfer                       | TICKET\\\_TERM\\\_FUNDING\\\_FAILED                | Smart Transfer  | ticket.term.funding\\\_failed                  |
| Smart Transfer                       | TICKET\\\_TERM\\\_FUNDING\\\_COMPLETED             | Smart Transfer  | ticket.term.funding\\\_completed               |
| Smart Transfer                       | TICKET\\\_TERM\\\_TRANSACTION\\\_STATUS\\\_CHANGED | Smart Transfer  | ticket.term.transaction\\\_status\\\_changed   |
| Off Exchange                         | SETTLEMENT\\\_CREATED                              | Off Exchange    | settlement.created                             |
| Off Exchange                         | COLLATERAL\\\_SIGNER\\\_READY\\\_EVENT             | Off Exchange    | collateral.status.updated                      |

***

# FAQ

## Is it easy to revert to our original implementation if something goes wrong?

The implementation of the new webhooks is not a migration but a completely new service that runs alongside the original version (V1). You can maintain both integrations in parallel until you're confident in the new setup. This ensures a smooth transition without needing to revert.

## How long can I run both services simultaneously?

Both services will run in parallel until the Webhooks v1 service is officially sunset by June 15th, 2026.

## Are there changes to the payload or our business logic?

The payload and your business logic remain the same. However, the notification object has changed, and you will need to register your webhook server on Push API V2 to start using it.

## Are new events backwards-compatible with Webhooks v1?

No, and moving forward, new events that we develop will only be supported by the Webhooks v2 service.

## Where can I get help during the migration process?

Fireblocks Support is always available to assist you with any questions or concerns. If you need assistance, please [submit a request](https://support.fireblocks.io/hc/en-us/requests/new?ticket_form_id=360003372200).

## What happens if I don't migrate by the end-of-life (EOL) date?

We recommend you migrate to the Webhooks v2 service before then. After the EOL date, we will no longer support or provide access to the Webhooks v1 service.
