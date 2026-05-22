> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Network Connection Objects

## NetworkConnectionResponse

| Parameter       | Type                                                              | Description                                    |
| --------------- | ----------------------------------------------------------------- | ---------------------------------------------- |
| id              | string                                                            | The ID of the Network Connection               |
| localNetworkId  | [NetworkId](#networkid)                                           | Local network ID                               |
| remoteNetworkId | [NetworkId](#networkid)                                           | Remote network ID                              |
| routingPolicy   | [NetworkConnectionRoutingPolicy](#networkconnectionroutingpolicy) | The routing policy for the network connection. |

***

## NetworkConnectionRoutingPolicy

| Parameter | Type                                                                                                                                                                               | Description                |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| crypto    | [CustomCryptoRoutingDest](#customcryptoroutingdest), [DefaultNetworkRoutingDest](#defaultnetworkroutingdest), or [NoneNetworkRoutingDest](ref:data-objects#nonenetworkroutingdest) | The crypto routing policy. |

***

## CustomCryptoRoutingDest

| Parameter | Type   | Description                                                                        |
| --------- | ------ | ---------------------------------------------------------------------------------- |
| scheme    | string | The network routing logic. Valid value: `CUSTOM`                                   |
| dstType   | string | The type of account the funds are being sent to. Valid values: `VAULT`, `EXCHANGE` |
| dstId     | string | The ID of the fiat account to which the funds are being sent.                      |

***

## CustomFiatRoutingDest

| Parameter | Type   | Description                                                                  |
| --------- | ------ | ---------------------------------------------------------------------------- |
| scheme    | string | The network routing logic. Valid value: `CUSTOM`                             |
| dstType   | string | The type of account the funds are being sent to. Valid value: `FIAT_ACCOUNT` |
| dstId     | string | The ID of the fiat account to which the funds are being sent.                |

***

## DefaultNetworkRoutingDest

| Parameter | Type   | Description                                               |
| --------- | ------ | --------------------------------------------------------- |
| scheme    | string | The default network routing logic. Valid value: `DEFAULT` |

***

## NoneNetworkRoutingDest

| Parameter | Type   | Description                                   |
| --------- | ------ | --------------------------------------------- |
| scheme    | string | No network routing logic. Valid value: `NONE` |

***

## NetworkId

| Parameter | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| id        | string | 8 characters ID of the network |
| name      | string | The name of the network        |

***

## NetworkIdResponse

| Parameter      | Type                                              | Description                                    |
| -------------- | ------------------------------------------------- | ---------------------------------------------- |
| id             | string                                            | 8 characters ID of the network                 |
| name           | string                                            | The name of the network                        |
| routingPolicy  | [NetworkIdRoutingPolicy](#networkidroutingpolicy) | The routing policy for the network connection. |
| isDiscoverable | boolean                                           | Whether the specific network is discoverable.  |
