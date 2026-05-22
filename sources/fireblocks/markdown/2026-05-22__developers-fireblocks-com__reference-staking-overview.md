> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Overview

> **Learn more about Staking in Fireblocks here**

In Fireblocks, you can natively stake the following assets:

* [ETH](https://support.fireblocks.io/hc/en-us/articles/8757586323740-Staking-ETH)
* [MATIC](https://support.fireblocks.io/hc/en-us/articles/11948105257500-Staking-MATIC)
* [SOL](https://support.fireblocks.io/hc/en-us/articles/6991638294172-Staking-SOL)

This guide outlines the process for staking assets using the Fireblocks API. It includes prerequisites, a detailed flowchart, and necessary code snippets for successful asset staking.

The [Fireblocks API Reference](/reference/getchains) offers comprehensive documentation on all Fireblocks REST API endpoints. It includes example responses and SDK commands. You will find detailed information about requests and response objects for each functionality along with examples of SDK staking functions in various programming languages.

Before you begin the staking process, ensure the following:

* Fireblocks API Credentials: You must have the credentials for the Fireblocks API.
* Supported Staking Asset: Ensure you have a supported staking asset in a vault account, and validate that you have enough of that asset to stake. Each asset has specific characteristics:
  * **ETH**: You must stake in multiples of 32, up to 3200 ETH. Staking positions larger than 32 ETH are created using a smart contract and separated into distinct sets of 32 ETH. For example, staking 320 ETH will appear as 100 stakes of 32 ETH. To pay for fees, make sure you have a sufficient amount of ETH in the same vault account from which you intend to stake.
  * **SOL**: A minimum of 0.01 SOL must be retained in the vault account to cover transfer fees.
  * **MATIC**: Staking involves sending MATIC, the ERC-20 token on Ethereum, to the Polygon MATIC PoS Staking Contract. Please note that MATIC\_POLYGON, the gas token on the Polygon network, is not used for staking. There is no minimum for staking MATIC. Before the initial staking transaction from each vault account, you must sign an Approve transaction that allows the staking contract to withdraw your funds. Since fees are paid in ETH, you must have a sufficient amount of ETH in the same vault account from which you intend to stake your MATIC.

The following diagram outlines the high level flow for staking your assets in Fireblocks:

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/01e254a-Screenshot_2024-07-03_at_22.55.16.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=8200d6178d2904b0701ff1e684fa3029" alt="" width="630" height="1222" data-path="images/docs/01e254a-Screenshot_2024-07-03_at_22.55.16.png" />
