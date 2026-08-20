<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/9041137884828-Minimum-transaction-amounts
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__minimum-transaction-amounts.pdf
-->

# Minimum transaction amounts

*Updated 3 months ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

The following is a list of blockchains and their minimum amounts allowed for a single transaction due to the underlying blockchain's limitations:

- **Bitcoin**: 0.00000582 BTC
- **Bitcoin Cash**: 0.00000582 BCH
- **Algorand**: 0.000001 ALGO
- **Cardano**: 1 ADA
- **Litecoin**: 0.00000582 LTC
- **Dogecoin**: 0.01 DOGE
- **Toncoin**: 0.000001 TON

> **Notes**:
> 1. The above minimum values are dependent on each mainnet and testnet blockchain. They are not limitations placed by Fireblocks.
> 2. Transactions that attempt to transfer less than the allowed amount will fail and display the status **Amount Too Small**.

## All other blockchains and tokens

The minimum transfer amount for any asset not mentioned above is based on the token's decimal limit. You can find the maximum decimal places for a token by retrieving a list of supported assets in your workspace via the Fireblocks API. The decimal limits shown are the maximum supported by Fireblocks, even if the underlying asset supports more.
