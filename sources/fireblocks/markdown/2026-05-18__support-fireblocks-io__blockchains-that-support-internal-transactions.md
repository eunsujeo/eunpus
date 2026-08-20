<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/24909157974940-Blockchains-that-support-internal-transactions
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__blockchains-that-support-internal-transactions.pdf
-->

# Blockchains that support internal transactions

*Updated 4 months ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

## What are internal transactions?

Internal transactions are native asset transfers that are executed by smart contracts during the execution of a blockchain transaction.

Unlike standard transactions, which are initiated directly by an externally-owned account (EOA), internal transactions are triggered by contract logic during execution. They are not represented as standalone blockchain transactions, and not assigned a separate transaction hash. Instead, they are reflected as part of the transaction's execution flow and resulting state changes.

> **Note**: This behavior reflects Fireblocks support and implementation, not an inherent capability or limitation of the blockchain itself.

## Fireblocks implementation

Fireblocks sends Console and webhook notifications for direct incoming native (base) asset transfers on all supported EVM blockchains.

On a subset of supported blockchains, Fireblocks also detects and notifies you on incoming native asset transfers that occur during smart contract execution. These transfers are referred to as **internal transactions**.

On blockchains not included in this list, Fireblocks does not notify on native asset transfers that occur during smart contract execution, even though direct native transfers are still supported.

<!-- page: 2 -->

## Mainnets with internal-tx notification support

- APECHAIN (ApeChain), AVAX (Avalanche C-Chain), BASECHAIN_ETH (Base), BERACHAIN (Berachain), CELO (Celo), CHZ2 (Chiliz Chain), COREDAO (Core DAO), ETC (Ethereum Classic), ETH (Ethereum), FLR (Flare), FTM (Fantom Opera), GUN_GUNZILLA (GUNZ), HYPE_ETH (HyperEVM), INK_ETH (Ink), KATANA_ETH (Katana), KLAY_KAIA (Kaia), LUMIA_LUMIA, MIRASMANDA, MONAD, OMNI_EVM (Nomina), OPT (Optimism), PLASMA, PLUME_PLUME, RON (Ronin), SCROLL, SEI, SOMNIA, SONIC, SOPHON, TAC, UNICHAIN_ETH, WIREXPAY_ETH, WMTX, WORLDCHAIN, GNOSIS, ZERO_G_EVM (0G Aristotle)

<!-- page: 3 -->

## Testnets with internal-tx notification support

- ALEPH_ZERO_EVM_TEST, ARC_TEST, ARB_SEPOLIA, AVALANCHE_FUJI, BASECHAIN_ETH_TEST5, BERACHAIN_ARTIO_TEST, BERACHAIN_TEST, BSC_TEST, CANVAS_TEST, CELO_ALFAJORES, ETC_TEST, ETH_TEST5 (Sepolia), ETH_TEST6 (Holesky), ETH_TEST_HOODI, INK_ETH_TEST, MEGA_ETH_TEST, MONAD_TEST, NERO_TEST, OMNI_EVM_TEST, PLASMA_TEST, SONIC_TEST, SOPHON_TEST, WOMOX (WorldMobile Testnet), ZERO_G_EVM_TEST (0G Galileo)
