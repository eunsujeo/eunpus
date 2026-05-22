> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Gas Station Objects

## GasStationPropertiesResponse

| Parameter     | Type                                                | Description                                                 |
| ------------- | --------------------------------------------------- | ----------------------------------------------------------- |
| balance       | dictionary                                          | A dictionary of an asset and its balance in the Gas Station |
| configuration | [GasStationConfiguration](#gasstationconfiguration) | The settings of your Gas Station                            |

***

## GasStationConfiguration

| Parameter    | Type   | Description                                                                               |
| ------------ | ------ | ----------------------------------------------------------------------------------------- |
| gasThreshold | string | Below this ETH balance the address will be funded up until the gasCap value, in ETH units |
| gasCap       | string | Up to this level, the address will be funded with ETH, in ETH units                       |
| maxGasPrice  | string | The funding transaction will be sent with this maximum value gas price, in Gwei units     |
