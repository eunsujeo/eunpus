> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Approve configuration changes

## Configuration Approval Callback

`POST /v2/config_change_sign_request`

This request expects a [CallbackResponse](/reference/response-object) object from the callback handler. If the callback handler does not respond within 30 seconds, Fireblocks fails the request. If your callback handler can't respond within 30 seconds, you can use the [retry mechanism](/reference/response-object) by responding with `RETRY`.

***

## Request parameters

| Parameter | Type   | Description                                                                                                                                                                                                                                                                                                                                         |
| --------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| requestId | string | A unique identifier of this request. It must be returned in the response.                                                                                                                                                                                                                                                                           |
| type      | string | The type of configuration request:  `UNMANAGED_WALLET`, `EXCHANGE`, `POLICY_APPROVAL`,`FIAT_ACCOUNT`, `ADD_USER`, `RE_ENROLL_DEVICE`, `ENABLE_ONE_TIME_ADDRESS`, `CHANGE_QUORUM_THRESHOLD`, `ADD_NETWORK_CONNECTION`, `SET_NETWORK_CONNECTION_ROUTING_POLICY`, `SET_NETWORK_ID_POLICY`, `UPDATE_APPROVAL_GROUP_MAPPING`, and `USERS_GROUP_APPROVAL` |
| extraInfo | object | Additional information about the request, depending on the type:  For `UNMANAGED_WALLET`, this is an [AddressInfo](#addressinfo) object.  For `EXCHANGE` or `FIAT_ACCOUNT`, this is a [ThirdPartyInfo](#thirdpartyinfo) object.                                                                                                                     |

***

## Type descriptions

| Type                                      | Description                                                                                        |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| UNMANAGED\_WALLET                         | An event that involves address whitelisting                                                        |
| EXCHANGE                                  | An event that involves adding an exchange to your workspace                                        |
| FIAT\_ACCOUNT                             | An event which involves adding a Fiat account to your workspace                                    |
| ADD\_USER                                 | An event that involves adding a user to your workspace                                             |
| RE\_ENROLL\_DEVICE                        | An event where an admin re-enrolls a mobile device for one of the users                            |
| ENABLE\_ONE\_TIME\_ADDRESS                | An event which involves enabling a particular transaction to a one-time address in the workspace   |
| CHANGE\_QUORUM\_THRESHOLD                 | An event where the admin updates the quorum threshold                                              |
| ADD\_NETWORK\_CONNECTION                  | An event of adding a Fireblocks Network new connection                                             |
| SET\_NETWORK\_CONNECTION\_ROUTING\_POLICY | An event where the admin configures the routing policy for each network connection                 |
| SET\_NETWORK\_ID\_POLICY                  | An event of setting up the Fireblocks Network *Network ID* in case its profile is not discoverable |
| UPDATE\_APPROVAL\_GROUP\_MAPPING          | An event involving gathering a list of approvers for a particular admin operation                  |
| USERS\_GROUP\_APPROVAL                    | An event that involves approving a new user group in your workspace                                |
| POLICY\_APPROVAL                          | An event that involves updating the Transaction Authorization Policy                               |

***

## Data objects

### AddressInfo

The AddressInfo object contains additional information for whitelisting a destination address.

| Parameter  | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| subType    | string | `INTERNAL` - Internal Wallets are addresses you control outside your Fireblocks workspace. Internal addresses display their current balance and are included in your workspace's total billable address count.  `EXTERNAL` - External Wallets are addresses managed by your clients and counterparties.  `CONTRACT` - Contract Wallets are addresses of smart contracts you want to interact with. Currently, this only applies to smart contracts on EVM-compatible blockchains. |
| walletName | string | The name of the internal, external, or contract wallet you want to approve adding an address to.                                                                                                                                                                                                                                                                                                                                                                                  |
| walletId   | string | The ID of the internal, external, or contract wallet that you want to approve adding an address to.                                                                                                                                                                                                                                                                                                                                                                               |
| asset      | string | The ID of the asset to add to this wallet. Use [GET supported assets](/api-reference/blockchains-&-assets/list-assets-legacy) request to retrieve more information about an asset.                                                                                                                                                                                                                                                                                                |
| address    | string | The asset deposit address requested to be added to the wallet.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| tag        | string | Destination address tag for Ripple; destination memo for EOS, Stellar, Hedera, & DigitalBits; destination note for Algorand; bank transfer description for fiat providers.   - *Note:*\* For Stellar, the memo must be a string representation of an integer between “0” and “2147483647”. Setting the memo to other values for Stellar assets will result in a failed request with an error message.                                                                             |

### ThirdPartyInfo

| Parameter   | Type   | Description                                                                                                                                                                                                                                                        |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| subType     | string | The exchange account, fiat account, or unmanaged wallet (INTERNAL, EXTERNAL).                                                                                                                                                                                      |
| accountName | string | The account's name.                                                                                                                                                                                                                                                |
| accountId   | string | The account's ID.                                                                                                                                                                                                                                                  |
| apiKey      | string | The third-party service's API key.                                                                                                                                                                                                                                 |
| addresses   | string | (Optional) A JSON-formatted "key":"value" string, where "key" is an asset symbol and "value" is its address. There can be multiple entries in the JSON. Use [supported\_assets](/api-reference/blockchains-&-assets/list-assets-legacy) to retrieve asset symbols. |

### AddNetworkConnection

| Parameter           | Type   | Description                                  |
| ------------------- | ------ | -------------------------------------------- |
| networkConnectionId | string | ID of network connection                     |
| note                | string | Connection note                              |
| localNetworkID      | string | ID of local networkId                        |
| remoteTenantID      | string | ID of remote peer tenantId                   |
| routingPolicy       | string | JSON representation of routing policy object |

### NetworkConnectionRoutingPolicy

| Parameter     | Type   | Description                                  |
| ------------- | ------ | -------------------------------------------- |
| connectionId  | string | ID of network connection                     |
| routingPolicy | string | JSON representation of routing policy object |

### NetworkIdRoutingPolicy

| Parameter     | Type   | Description                                  |
| ------------- | ------ | -------------------------------------------- |
| networkID     | string | ID of networkID                              |
| routingPolicy | string | JSON representation of routing policy object |
