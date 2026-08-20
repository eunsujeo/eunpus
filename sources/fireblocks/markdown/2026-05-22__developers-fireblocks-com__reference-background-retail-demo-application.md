> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Introduction

The Fireblocks Retail Demo application is designed to support Fireblocks clients by serving as a reference model for their integration processes. It embodies the best practices Fireblocks advocates for building secure, retail-facing solutions.

This demo aims to accelerate and simplify the integration of Fireblocks into your projects, ensuring that you adhere to the recommended best practices when building on the Fireblocks platform.

This article provides the necessary background on the considerations we had in mind when planning the demo application and developing its business logic.

**Vault Structure**

First, it's essential to understand how to best structure your Fireblocks workspace, vault accounts, and asset wallets to serve the requirements of a retail crypto application.

There are generally [two main approaches for vault structuring](https://support.fireblocks.io/hc/en-us/articles/5253421857564-Fireblocks-Vault-structure-best-practices): Omnibus and Segregated. The [Omnibus](https://support.fireblocks.io/hc/en-us/articles/6986895761948-Account-and-wallet-structure) vault structure is usually the more fitting selection when planning a retail-facing product, as it offers a more efficient way to handle end-user deposits, balance management, and withdrawals in fewer transactions with better fee management than using a segregated structure.

In our implementation, we have used a central Omnibus vault account to hold end-user funds. UTXO-based assets (e.g., BTC) are deposited by the end-users directly into the Omnibus vault using a dedicated deposit address for each user deposit, while account-based assets (e.g., ETH) are deposited to intermediate deposit vault accounts and later swept to the Omnibus vault.

Additionally, we are using three designated withdrawal vaults to allow high withdrawal throughput. Using multiple withdrawal vaults allows for more robust withdrawal handling, as withdrawal requests might queue up into a long backlog due to an unconfirmed transaction of a specific asset from a withdrawal wallet. Such backlog scenarios should be handled with dedicated business logic, but generally speaking, having several withdrawal vaults ensures your application can maintain a steady and robust withdrawal throughput.

The configuration of the Fireblocks workspace vaults and wallets is done by the application's [setup script](/reference/setup#setup-script)  upon running the app for the first time.

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/d0f9d4b234cf7084141dfad7ed2132f8e268290dc415af52d3948c8692f03d0b-image.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=947a9958290c3d8bfc8de292bacbb700" alt="" width="2792" height="1432" data-path="images/docs/d0f9d4b234cf7084141dfad7ed2132f8e268290dc415af52d3948c8692f03d0b-image.png" />

**End-user wallets**

A retail application, potentially serving millions of end-users, must be able to create and operate millions of crypto deposit addresses, assign them to the correct end-user accounts in our internal ledger, and manage their balances correctly. When planning the application, we must consider which types of assets we will support (UTXO-based / Account-based / Tag or Memo-based), as different types require different wallet creation and management approaches.

When an end-user logs in for the first time, we need to generate an account or wallet entity for that user that will hold all of their deposit addresses for the assets we support. Depending on the asset type, different business logic will occur in the backend when the user asks for a new deposit address.
For UTXO or Tag/Memo-based assets (such as BTC, ADA, etc.), we will create a new dedicated **deposit address** inside the Omnibus vault account and assign it to the user account in our database (our internal ledger).
For Account-based assets (such as ETH, SOL, etc.), we will create a new intermediate **vault account** and then create a deposit address inside this dedicated intermediate vault account whenever a user requests a new deposit address. One can improve this process by first checking if the user already has an unused vault account that doesn't yet have the requested asset's wallet. If such an account exists, we can use it to create the new deposit address instead of creating a new vault account each time the user requests a new address.
Additionally, as the process of generating a deposit address for account-based assets will usually require two API calls to Fireblocks (one for creating the new vault account and one for generating the deposit address), it will be beneficial to add a job-like service that will pre-create vault accounts in batches. Once an end-user requests a new deposit address, the backend process will use a ready vault account when creating the deposit address and assign it to the relevant end-user (rename the vault account with a user reference ID and update the internal ledger accordingly).

In our implementation, this business logic is mainly handled by the [VaultAccount service](https://github.com/fireblocks/retail-demo/blob/main/backend/src/service/fireblocks/vaultAccount.service.ts).

**Deposit Management - Sweeping and UTXO Consolidation**

Another aspect we must consider when planning a retail crypto application is the [sweeping](/reference/sweep-to-omnibus-1#sweeping) of account-based assets to the Omnibus vault account. For UTXO asset deposits, we must have a mechanism that will [consolidate](/reference/consolidate-utxos) our Omnibus wallet inputs (coming from end-user deposits) into larger UTXOs that allow more efficient processes down the line, such as internal rebalancing transactions and end-user withdrawals.

**Sweeping**

When designing the sweeping mechanism, we should take into account several considerations, such as:

* Triggering (when should we sweep the intermediate vaults?)
* Sorting (which vaults should be swept now?)
* Gas balances (gas top-ups for token sweeping)
* Asset sweeping order (sweep tokens before base assets)

In our implementation, we trigger the sweeping mechanism based on a simple [time interval](https://github.com/fireblocks/retail-demo/blob/6f3dabed7cf7cab0435462fb17d409d62839cfad/backend/src/service/sweeping.service.ts#L13), but other possible and more complex approaches might be based on a set threshold of incoming deposits of account-based assets or based on monitoring gas rates in a given network to trigger the sweeping mechanism only when gas rates are relatively low, as a more cost-effective approach. As for sorting, we are querying the database for all user wallets that have a balance higher than a set threshold of a "sweepable" asset (account-based) and mapping the balances to the relevant Fireblocks vault account IDs so we can iterate through them and trigger the sweeping transactions accordingly. Based on your logic for triggering the sweeping process, you can also change the flow for sorting and selecting which intermediate vaults to sweep.

The business logic of account-based asset sweeping is handled by the Sweeping service .

**UTXO Consolidation**

In Fireblocks, a UTXO-based asset transaction can consist of up to 250 inputs, and the default input selection mechanism selects inputs from the lowest to the highest value. These presets can lead to a situation where, in a high-volume crypto retail application that may receive numerous deposits of small amounts of tokens from end-users, the ever-growing list of small UTXOs will have the sufficient balance to support a transaction request from the Omnibus wallet with a large amount. Having a UTXO consolidation solution implemented correctly will help prevent such a situation and ensure the application's high throughput operation at all times.

In our implementation, we've created two UTXO consolidation jobs, one of which is a backup process for the first routine job.
We maintain a deposit counter for every UTXO asset the application supports in our database. Once the counter reaches 249 deposits, the routine consolidation job is triggered and will perform a consolidation transaction and reset the counter. The backup process runs every day and checks if any of the UTXO assets in the Omnibus wallet have 250 unspent inputs or more. This check is done with the [Fireblocks API](/reference/getunspentinputs) directly on the Omnibus vault account and adds another safeguard to the consolidation process. If 250 inputs or more are found, consolidation transactions will be triggered until that condition is no longer met.
A consolidation transaction will have the Omnibus vault account as both the source and the destination. This will ensure that the Omnibus wallet will have inputs with high value available for future transactions.

The business logic of UTXO consolidation is handled by the [consolidation service](https://github.com/fireblocks/retail-demo/blob/main/backend/src/service/consolidation.service.ts).

**Internal Rebalancing**

As mentioned above, a scalable retail crypto application must have several dedicated withdrawal vault accounts to support a high throughput of withdrawals. To function effectively, these vaults must maintain a sufficient balance of all supported assets at any given time. To achieve this, we need an internal rebalancing mechanism that ensures all withdrawal vaults are always funded. This mechanism can be developed programmatically using Fireblocks APIs, but in our implementation, we chose to leverage the new [automation](https://support.fireblocks.io/hc/en-us/articles/14873112741660-Automation) feature. This feature allows us to set up automatic triggers within Fireblocks if the asset's balance is lower than a set threshold after a withdrawal transaction is processed and completed.
Below is an example of such an automation we've configured in our testnet workspace.

<img src="https://mintcdn.com/fireblocks-43c4b3ee/xYGyrtyC_XHEtVXh/images/docs/45aedf6627765cac64468cd396c526cbb81854ea6699d69e4ad7cc941ea379e4-rebalance-automation.png?fit=max&auto=format&n=xYGyrtyC_XHEtVXh&q=85&s=b21583e6b3c94fd305bf8b9df9d7c927" alt="" width="2240" height="1016" data-path="images/docs/45aedf6627765cac64468cd396c526cbb81854ea6699d69e4ad7cc941ea379e4-rebalance-automation.png" />

This rebalancing approach will require you to set a minimum and a maximum threshold per asset you support. The minimum threshold will be the triggering amount of a rebalancing transaction, and the maximum threshold will be the amount the withdrawal vault will be topped up to after the rebalancing transaction is completed.

**End User Withdrawals**

End-user withdrawals are a crucial phase in the lifecycle of a retail crypto application, deeply affecting the platform's reputation. To handle a high volume of withdrawal requests efficiently, utilizing multiple dedicated withdrawal vault accounts is recommended. Besides this strategy, there are key considerations for robust withdrawal logic.

A solid withdrawal system should:

* Validate User Balances: Check that the user's available balance is sufficient to cover the withdrawal amount and any associated fees.
* Rotate Withdrawal Vaults: Incorporate a method, such as a random selection process, to alternate between different withdrawal vault accounts as transaction sources.

In our approach, we've implemented a straightforward randomization logic. The application randomly picks a number corresponding to one of the available withdrawal vault accounts (e.g., selecting between 1 and 3). This determines the vault account ID used for the transaction source. [See our code example here](https://github.com/fireblocks/retail-demo/blob/6f3dabed7cf7cab0435462fb17d409d62839cfad/backend/src/utils/vaultConfig.ts#L37).

The withdrawal flow is handled by the [transaction controller](https://github.com/fireblocks/retail-demo/blob/6f3dabed7cf7cab0435462fb17d409d62839cfad/backend/src/controller/transaction.controller.ts#L55) and the [transaction service](https://github.com/fireblocks/retail-demo/blob/6f3dabed7cf7cab0435462fb17d409d62839cfad/backend/src/service/fireblocks/transaction.service.ts).
