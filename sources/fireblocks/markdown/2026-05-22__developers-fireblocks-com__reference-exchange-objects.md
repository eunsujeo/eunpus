> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Exchange Account Objects

## ExchangeAccount

| Parameter           | Type                                                                              | Description                                                                                         |
| ------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| id                  | string                                                                            | The ID of the exchange asset to return                                                              |
| type                | [ExchangeType](#exchangetype)                                                     | The name of the exchange the account is associated with                                             |
| name                | string                                                                            | Display name of the exchange account                                                                |
| status              | [ConfigChangeRequestStatus](/reference/general-objects#configchangerequeststatus) | Status of the exchange account connection                                                           |
| assets              | Array of [ExchangeAsset](#exchangeasset)                                          | Assets in the account                                                                               |
| isSubaccount        | boolean                                                                           | True if the account is a subaccount in an exchange                                                  |
| mainAccountId       | string                                                                            | The ID of the exchange main account                                                                 |
| tradingAccounts     | Array of [TradingAccount](#tradingaccount)                                        | Trading accounts under this exchange account                                                        |
| fundableAccountType | [TradingAccountType](#tradingaccounttype)                                         | The internal account that is used for deposits or withdrawals of this exchange's main or subaccount |

***

## ExchangeAsset

| Parameter    | Type   | Description                                                                                 |
| ------------ | ------ | ------------------------------------------------------------------------------------------- |
| id           | string | The ID of the exchange asset to return                                                      |
| total        | string | The total balance of the asset in the exchange account                                      |
| available    | string | The balance that can be withdrawn from the exchange account or moved to a different account |
| lockedAmount | string | Locked amount in the account                                                                |
| balance      | string | Deprecated - replaced by "total"                                                            |

***

## ExchangeType

| Parameter | Type   | Description                                                                                                                                                                                                                                                            |
| --------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type      | string | \[BINANCE, BINANCEUS, BITFINEX, BITHUMB, BITMEX, BITSO, BITSTAMP, BITTREX, BYBIT, CIRCLE, COINBASEEXCHANGE, COINBASEPRO, COINMETRO, COINSPRO, CRYPTOCOM, DERIBIT, GATE, GEMINI, HITBTC, HUOBI, IR, KORBIT, KRAKEN, KRAKENINTL, LIQUID, POLONIEX, OKCOIN, OKEX, SEEDCX] |

> **Notes**
>
> * The `BINANCEUS` value should be used only by Binance.us customers.
> * The `KRAKENINTL` value should be used only by non-US Kraken customers.

***

## TradingAccount

| Parameter | Type                                      | Description                                             |
| --------- | ----------------------------------------- | ------------------------------------------------------- |
| type      | [TradingAccountType](#tradingaccounttype) | The specific trading account under the exchange account |
| assets    | Array of [ExchangeAsset](#exchangeasset)  | Assets in the trading account                           |

***

## TradingAccountType

| Parameter | Type   | Description                                                                                                                                                                              |
| --------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type      | string | \[SPOT, FUTURES, MARGIN, FUNDING, OPTIONS, EXCHANGE, COIN\_MARGINED\_SWAP, USDT\_FUTURES, COIN\_FUTURES, USDT\_ISOLATED\_MARGINED\_SWAP, USDT\_MARGINED\_SWAP\_CROSS, FUNDABLE, UNIFIED] |
