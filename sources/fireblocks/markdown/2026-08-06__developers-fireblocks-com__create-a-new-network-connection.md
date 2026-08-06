> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Create a new network connection

> Initiates a new network connection.
**Note:** This API call is subject to Flexible Routing Schemes.

Your routing policy defines how your transactions are routed.
You can choose 1 of the 3 different schemes mentioned below for each asset type:
  - **None**; Defines the profile routing to no destination for that asset type. Incoming transactions to asset types routed to `None` will fail.
  - **Custom**; Route to an account that you choose. If you remove the account, incoming transactions will fail until you choose another one.
  - **Default**; Use the routing specified by the network profile the connection is connected to. This scheme is also referred to as "Profile Routing"

Default Workspace Presets:
  - Network Profile Crypto → **Custom**
  - Network Profile FIAT → **None**
  - Network Connection Crypto → **Default**
  - Network Connection FIAT → **Default**

Supported asset groups for routing police can be found at `/network_ids/routing_policy_asset_groups`

    - **Note**: By default, Custom routing scheme uses (`dstId` = `0`, `dstType` = `VAULT`).




## API Specification

The full API specification for this endpoint is available in the [documentation index](https://developers.fireblocks.com/llms.txt).
