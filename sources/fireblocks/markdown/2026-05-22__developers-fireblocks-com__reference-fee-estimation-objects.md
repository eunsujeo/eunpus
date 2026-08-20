> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Fee Estimation Objects

## NetworkFee

| Parameter   | Type   | Description                                                 |
| ----------- | ------ | ----------------------------------------------------------- |
| feePerByte  | string | \[optional] For UTXOs                                       |
| gasPrice    | string | \[optional] For Ethereum assets (ETH and Tokens)            |
| networkFee  | string | \[optional] All other assets                                |
| baseFee     | string | \[optional] Base Fee according to EIP-1559 (ETH assets)     |
| priorityFee | string | \[optional] Priority Fee according to EIP-1559 (ETH assets) |

***

## TransactionFee

| Parameter   | Type   | Description                                                                          |
| ----------- | ------ | ------------------------------------------------------------------------------------ |
| feePerByte  | string | \[optional] For UTXOs,                                                               |
| gasPrice    | string | \[optional] For Ethereum assets (ETH and Tokens)                                     |
| gasLimit    | string | \[optional] For Ethereum assets (ETH and Tokens), the limit for how much can be used |
| networkFee  | string | \[optional] Transaction fee                                                          |
| baseFee     | string | \[optional] Base Fee according to EIP-1559 (ETH assets)                              |
| priorityFee | string | \[optional] Priority Fee according to EIP-1559 (ETH assets)                          |

***

## EstimatedTransactionFeeResponse

| Parameter | Type                              | Description                                                      |
| --------- | --------------------------------- | ---------------------------------------------------------------- |
| low       | [TransactionFee](#transactionfee) | Transactions with this fee will probably take longer to be mined |
| medium    | [TransactionFee](#transactionfee) | Average transactions fee                                         |
| high      | [TransactionFee](#transactionfee) | Transactions with this fee should be mined the fastest           |

## EstimatedFeeDetails

| Parameter | Type                                                                                                                   | Description                                                                        |
| --------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| low       | [FeeBreakdown - Solana Specific](#feebreakdown---solana-specific) OR [FeeBreakdown - Generic](#feebreakdown---generic) | Detailed fee breakdown where the transaction will probably take longer to be mined |
| medium    | [FeeBreakdown - Solana Specific](#feebreakdown---solana-specific) OR [FeeBreakdown - Generic](#feebreakdown---generic) | Average transactions fee                                                           |
| high      | [FeeBreakdown - Solana Specific](#feebreakdown---solana-specific) OR [FeeBreakdown - Generic](#feebreakdown---generic) | Detailed fee breakdown where the transaction will be mined the fastest             |

## FeeBreakdown - Solana Specific

| Parameter   | Type   | Description                                  |
| ----------- | ------ | -------------------------------------------- |
| baseFee     | string | Base fee for Solana transaction              |
| priorityFee | string | Priority fee for Solana transaction          |
| rent        | string | Rent fee for Solana account creation/storage |
| totalFee    | string | Total fee amount                             |

## FeeBreakdown - Generic

| Parameter   | Type   | Description            |
| ----------- | ------ | ---------------------- |
| baseFee     | string | Base fee component     |
| priorityFee | string | Priority fee component |
| totalFee    | string | Total fee amount       |
