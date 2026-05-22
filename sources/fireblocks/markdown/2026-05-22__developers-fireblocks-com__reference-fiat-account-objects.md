> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Fiat Account Objects

## FiatAccount

| Parameter | Type                              | Description                              |
| --------- | --------------------------------- | ---------------------------------------- |
| id        | string                            | The ID of the account                    |
| type      | string                            | \[ BLINC ]                               |
| name      | string                            | The display name of the fiat account     |
| address   | string                            | The address of the account               |
| assets    | Array of [FiatAssets](#fiatasset) | An array of the assets under the account |

***

## FiatAsset

| Parameter | Type   | Description              |
| --------- | ------ | ------------------------ |
| id        | string | The ID of the asset      |
| balance   | string | The balance of the asset |
