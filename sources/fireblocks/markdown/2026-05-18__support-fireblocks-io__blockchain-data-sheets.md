<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/24563952449308-Blockchain-data-sheets-on-Fireblocks
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__blockchain-data-sheets.pdf
-->

# Blockchain data sheets on Fireblocks

*Updated 4 months ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

## List of blockchains

- Zigchain
- Pocket Network

(이 페이지는 신규 지원 chain의 표준 메타 시트. Stage 7 시점에 두 chain 등록됨.)

## Standard data sheet template

각 신규 chain은 다음 필드를 가진다:

- **Blockchain name**
- **When did support begin?**
- **Blockchain description**
- **Native asset**
- **Mainnet block explorer**
- **Testnet block explorer**
- **Supported functionality** (예: Custody, Transfers)
- **Finality** (블록 수)
- **Maximum confirmations**
- **Default Gas Station values**
- **Importing private keys** (chain-specific values: Chain ID, Address prefix)
- **Token support**
- **Globally supported assets**
- **Minimum balance**
- **Supported blockchain networks** (chain type, networks, foundation website, fee asset)

## Zigchain (January 2026, 신규)

- Cosmos SDK–based Layer 1, deterministic finality, native Cosmos transactions, fees in ZIG
- Native asset: ZIG
- Mainnet explorer: https://www.zigscan.org
- Testnet explorer: https://testnet.zigscan.org
- Supported: Custody, Transfers
- Finality: 1
- Max confirmations: 1
- Default Gas Station: N/A
- Importing private keys: Cosmos-standard flow (see ATOM), Chain ID `zigchain-1`, address prefix `zig1`
- Token support: ERC-20
- Globally supported assets: Non-EVM tokens — Zigchain: ZIG
- Minimum balance: N/A
- Supported blockchain networks: Cosmos SDK–based account-based, Mainnet + Testnet, foundation website, fees in ZIG

<!-- page: 2 -->

## Pocket Network (January 2026, 신규)

- Fully permissionless decentralized data delivery network. Open data access (blockchain RPC, LLM inference). Zero net inflation mint-and-burn economy.
- Native asset: POKT
- Mainnet explorer: https://explorer.pocket.network
- Testnet explorer: https://explorer.pocket.network/pocket-beta
- Supported: Custody, Transfers
- Finality: 1
- Max confirmations: 1
- Default Gas Station: N/A
- Importing private keys: Cosmos-standard flow, Chain ID `pokt`, address prefix `pokt`
- Token support: N/A
- Globally supported assets: Non-EVM tokens — Pocket Network: POKT
- Minimum balance: N/A
- Supported blockchain networks: Cosmos SDK–based account-based, Mainnet + Testnet, foundation website, fees in POKT

<!-- page: 3 -->

(footer)
