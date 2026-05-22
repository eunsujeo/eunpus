> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Blockchain & Asset Objects

## AssetTypeResponse

| Parameter       | Type   | Description                                                                            |
| --------------- | ------ | -------------------------------------------------------------------------------------- |
| id              | string | The ID of the asset                                                                    |
| name            | string | The name of the asset                                                                  |
| type            | string | \[ ALGO\_ASSET, BASE\_ASSET, BEP20, ERC20, FIAT, SOL\_ASSET, TRON\_TRC20, XLM\_ASSET ] |
| contractAddress | string | Contract address for ERC-20 smart contracts                                            |
| nativeAsset     | string | The name of the native asset                                                           |
| decimals        | number | The number of digits after the decimal point                                           |

***

## ValidateAddressResponse

| Parameter   | Type    | Description                                                                                                                       |
| ----------- | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| isValid     | boolean | Returns `true` if the address is valid. Returns "false" if the address is the wrong format.                                       |
| isActive    | boolean | Returns `true` if the address is active. Returns `false` if the address doesn't have a sufficient balance or requires activation. |
| requiresTag | boolean | Returns "true" if the address requires a destination tag, memo, or note.                                                          |
