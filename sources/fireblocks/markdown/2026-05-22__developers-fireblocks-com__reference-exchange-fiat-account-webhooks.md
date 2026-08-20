> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Exchange & Fiat Account Webhooks

> **Deprecation notice**
>
> Webhooks v1 will be deprecated on **June 15th, 2026**. Please use the Developer Center in the Fireblocks Console to upgrade to Webhooks V2, which offers improved reliability, performance, and observability.

This page describes all events relating to exchange and fiat accounts that produce webhook notifications, and their associated data objects.

The `type` parameter is automatically set to the description name for the data objects below.

## Exchange account added

Notification is sent when an exchange account is added.

**Webhook data**

| Parameter | Type                                    | Description                            |
| --------- | --------------------------------------- | -------------------------------------- |
| type      | string                                  | EXCHANGE\_ACCOUNT\_ADDED               |
| tenantId  | string                                  | Unique ID of your Fireblocks workspace |
| timestamp | number                                  | Timestamp in milliseconds              |
| data      | [ThirdPartyWebhook](#thirdpartywebhook) | Exchange accounts details              |

## Fiat account added

Notification is sent when a fiat account is added.

**Webhook data**

| Parameter | Type                                    | Description                            |
| --------- | --------------------------------------- | -------------------------------------- |
| type      | string                                  | FIAT\_ACCOUNT\_ADDED                   |
| tenantId  | string                                  | Unique ID of your Fireblocks workspace |
| timestamp | number                                  | Timestamp in milliseconds              |
| data      | [ThirdPartyWebhook](#thirdpartywebhook) | Fiat account details                   |

***

### ThirdPartyWebhook

| Parameter | Type   | Description                                                  |
| --------- | ------ | ------------------------------------------------------------ |
| id        | string | The ID of the third-party account on the Fireblocks platform |
| subType   | string | The subtype of the third party, ie. exchange or fiat name    |
| name      | string | Account name                                                 |
