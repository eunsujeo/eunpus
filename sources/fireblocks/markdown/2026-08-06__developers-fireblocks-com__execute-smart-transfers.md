> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Execute Smart Transfers

As you can open a regular Smart Transfer ticket [via these API endpoints](/reference/createticket), an intermediary can open a Smart Transfer ticket for two third-parties only via our API as well, and follow its life cycle. In order for you, as an intermediary, to open such a ticket for your third-parties, all three of you need to be connected to each other with the same network profiles on the Fireblocks Network.

# Smart Transfer flow

To create Smart Transfer tickets an established network connection must exist. In the intermediary case, all sides (intermediary and counterparties settling the tickets) should be connected via the same Network Profile.

The flow of executing a Smart Transfer ticket consists of the following steps:

1. [Create a Smart Transfer ticket](/reference/createticket)
2. [Fund Smart Transfer ticket](/reference/fulfillticket)
3. [Cancel Smart Transfer ticket](/reference/cancelticket)

For more details, see the [Smart Transfers Developer Guide](/reference/execute-smart-transfers-1).
