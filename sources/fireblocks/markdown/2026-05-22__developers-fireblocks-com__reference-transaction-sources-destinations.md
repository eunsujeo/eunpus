> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Transaction Sources & Destinations

All transactions in Fireblocks must have a source and a destination. This article describes the available options depending on transaction type and status.

***

# Available sources and destinations

## CONTRACT

If you had whitelisted a smart contract address and will be interacting with the smart contract or a one-time address.

* **Creating a new transaction:** Available as a destination.
* **Getting an existing transaction:** Available as a destination.

## END\_USER\_WALLET

Represents an [embedded wallet](/docs/create-embedded-wallets).

* **Creating a new transaction:** Available as a source and a destination.
* **Getting an existing transaction:** Available as a source and a destination.

## EXCHANGE\_ACCOUNT

A third-party exchange account connected to your workspace. The Fireblocks exchange integration supports initiating transactions to or from connected accounts and other addresses in your workspace, enabling you to use your Policies and a unified interface for all your exchange accounts.

* **Creating a new transaction:** Available as a source and a destination.
* **Getting an existing transaction:** Available as a source and a destination.

> **Note**
>
> Fireblocks only identifies the source of an incoming transaction as an exchange account if the transaction was initiated within your Fireblocks workspace. Otherwise, the source is displayed as `UNKNOWN`. This includes transactions initiated using the exchange's account portal.

## EXTERNAL\_WALLET

A whitelisted wallet assigned as external is typically used for addresses managed by your clients and counterparties.

* **Creating a new transaction:** Available as a destination.
* **Getting an existing transaction:** Available as a source and a destination.

## FIAT\_ACCOUNT

A third-party fiat account connected to your workspace.

* **Creating a new transaction:** Available as a source and a destination.
* **Getting an existing transaction:** Available as a source and a destination.

> **Note**
>
> Fireblocks only identifies the source of an incoming transaction as a fiat account if the transaction was initiated within your Fireblocks workspace. Otherwise, the source is displayed as `UNKNOWN`.

## GAS\_STATION

Your connected Gas Station account. The Fireblocks Gas Station is an opt-in service that automates asset funding for token transaction fees on EVM-based networks such as Ethereum, BSC, and others.

* **Creating a new transaction:** Available as a destination.
* **Getting an existing transaction:** Available as a source and a destination.

## INTERNAL\_WALLET

A whitelisted wallet assigned as internal is typically used for addresses that you control outside of your Fireblocks workspace. Internal addresses display their current balance and are included in your workspace's total billable address count.

* **Creating a new transaction:** Available as a destination.
* **Getting an existing transaction:** Available as a source and a destination.

## MULTI\_DESTINATION

A possible destination value when querying for past multi-destination transactions.

* **Creating a new transaction:** `NONE` or `MULTI_DESTINATION`, depending on the Fireblocks account. Learn more [here](https://support.fireblocks.io/hc/en-us/articles/360018447980-Multi-destination-UTXO-transactions#h_01KB0PP172XD02XT0GV8NZQ9VY).
* **Getting an existing transaction:** Available as a destination.

## NETWORK\_CONNECTION

The Fireblocks Network is a peer-to-peer, institutional liquidity and transfer network of 1,500+ liquidity providers, lending desks, and trading counterparties. You can transfer assets from any source connected to your workspace to any Network connection after the connection request is approved by both parties.

* **Creating a new transaction:** Available as a destination.
* **Getting an existing transaction:** Available as a source and a destination.

## OEC\_PARTNER

This represents the off-exchange partner. When funds are being sent to the exchange during a settlement, the destination will show up as `OEC_PARTNER`.

* **Creating a new transaction:** Available as a destination.
* **Getting an existing transaction:** Available as a destination.

## ONE\_TIME\_ADDRESS

This option is for transferring assets to non-whitelisted addresses from your Fireblocks Workspace.

> **Note**
>
> This feature is disabled by default because it poses security risks. We recommend configuring a strict Policy before enabling it.

* **Creating a new transaction:** Available as a destination.
* **Getting an existing transaction:** Available as a destination.

## PROGRAM\_CALL

Interacting with programs on the Solana Network (similar to contract calls).

* **Creating a new transaction:** Available as a destination.
* **Getting an existing transaction:** Unavailable.

## UNKNOWN

The default source of incoming transactions if Fireblocks was unable to match the source address to any of the other known sources in your workspace.

* **Creating a new transaction:** Unavailable.
* **Getting an existing transaction:** Available as a source.

## VAULT\_ACCOUNT

An account in your Fireblocks Vault.

* **Creating a new transaction:** Available as a source and a destination.
* **Getting an existing transaction:** Available as a source and a destination.

***

# Deprecated

## COMPOUND

> **Deprecated**
>
> As of **April 1st, 2023**, compound integration with Fireblocks has been deprecated.

Compound integration with Fireblocks was deprecated on **April 1st, 2023**. Older transactions may have this as their source or destination if the workspace had a direct integration between Fireblocks and the Compound DeFi protocol.

* **Creating a new transaction:** Unavailable.
* **Getting an existing transaction:** Available as a source and a destination.
