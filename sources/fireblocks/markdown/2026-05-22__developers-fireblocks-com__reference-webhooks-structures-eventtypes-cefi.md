> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# CeFi events

This page covers all Centralized Finance (CeFi) events that can trigger webhook notifications, and their associated data objects for the Webhooks v2 service.

## CeFi event types

To receive a specific event, include its **eventType** in the webhook's [notification object](/reference/webhooks-structures-notificationstructure#/).

| Event type                   | Data object returned                                     |
| ---------------------------- | -------------------------------------------------------- |
| exchange\_account.connected  | ThirdPartyWebhook (from your exchange account provider)  |
| fiat\_account.connected      | ThirdPartyWebhook (from your fiat account provider)      |
| connected\_account.connected | ThirdPartyWebhook (from your connected account provider) |
