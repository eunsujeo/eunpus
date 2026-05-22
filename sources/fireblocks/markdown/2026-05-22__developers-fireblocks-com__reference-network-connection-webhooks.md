> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Network Connection Webhooks

> **Deprecation notice**
>
> Webhooks v1 will be deprecated on **June 15th, 2026**. Please use the Developer Center in the Fireblocks Console to upgrade to Webhooks V2, which offers improved reliability, performance, and observability.

This page describes all events relating to Fireblocks Network connections that produce webhook notifications, and their associated data objects.

The `type` parameter is automatically set to the description name for the data objects below.

## Connection added

Notification is sent when a Fireblocks Network connection is added.

**Webhook data**

| Parameter | Type                                    | Description                            |
| --------- | --------------------------------------- | -------------------------------------- |
| type      | string                                  | NETWORK\_CONNECTION\_ADDED             |
| tenantId  | string                                  | Unique ID of your Fireblocks workspace |
| timestamp | number                                  | Timestamp in milliseconds              |
| data      | [NetworkConnection](#networkconnection) | Network connection details             |

***

### NetworkConnection

| Parameter     | Type                | Description                       |
| ------------- | ------------------- | --------------------------------- |
| id            | string              | The ID of the Network Connection. |
| localChannel  | [Channel](#Channel) | Local channel ID.                 |
| remoteChannel | [Channel](#Channel) | Remote channel ID.                |

### Channel

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| networkId | string | The 8-character ID of the channel. |
| name      | string | The name of the channel.           |
