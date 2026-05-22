> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Network connection events

This page covers all Network connection events that can trigger webhook notifications, and their associated data objects for the Webhooks v2 service.

## Network connection event types

To receive a specific event, include its **eventType** in the webhook's [notification object](/reference/webhooks-structures-notificationstructure).

| Event type                                 | Data object returned                                                                               |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| connection.added                           | [NetworkConnection](/reference/webhooks-structures-eventtypes-networkconnection#networkconnection) |
| connection.removed                         | [NetworkConnection](/reference/webhooks-structures-eventtypes-networkconnection#networkconnection) |
| connection.request.waiting\_peer\_approval | [NetworkConnection](/reference/webhooks-structures-eventtypes-networkconnection#networkconnection) |
| connection.request.rejected\_by\_peer      | [NetworkConnection](/reference/webhooks-structures-eventtypes-networkconnection#networkconnection) |

***

## Data objects

### NetworkConnection

| Parameter     | Type                                                                           | Description                       |
| ------------- | ------------------------------------------------------------------------------ | --------------------------------- |
| id            | string                                                                         | The ID of the Network Connection. |
| localChannel  | [Channel](/reference/webhooks-structures-eventtypes-networkconnection#channel) | Local channel ID.                 |
| remoteChannel | [Channel](/reference/webhooks-structures-eventtypes-networkconnection#channel) | Remote channel ID.                |

### Channel

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| networkId | string | The 8-character ID of the channel. |
| name      | string | The name of the channel.           |
