<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/8993656344092-Supported-blockchain-networks
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__supported-blockchain-networks.pdf
conversion_notes: |
  Catalog summary form. Original PDF has 22 pages listing 100+ chains.
  This conversion captures the catalog STRUCTURE and SAMPLE entries (a–c).
  For complete chain list, refer to the original PDF.
-->

# Supported blockchain networks

*Updated 2 months ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

## Overview

The following is a list of blockchain networks supported by Fireblocks.

For most newly supported assets, refer to *Blockchain data sheets on Fireblocks*.

> Want an EVM integration added to your workspace? Contact your Customer Success Manager to discuss prerequisites for integrating new EVM blockchains with Fireblocks.

## Catalog structure (per entry)

Each chain in the catalog has the following fields:
- **Chain type**: EVM-compatible account-based / Non-EVM account-based / UTXO-based / Cosmos SDK-based account-based
- **Supported networks**: Mainnet / Testnet (and which testnets)
- **Foundation website** (link)
- **Fee asset**: which asset pays for fees + Fireblocks asset ID (e.g., `BNB_BSC` for mainnet, `BNB_TEST` for testnet)

## Sample entries (a–c)

(The original PDF lists 100+ chains. The catalog hub at [[vendors/fireblocks/blockchains]] aggregates the structural info; below are sample entries for orientation.)

### 0G
- EVM-compatible account-based
- Supported networks: Mainnet
- Fee asset: ETH (Ethereum Network)

### Abstract
- EVM-compatible account-based
- Mainnet
- Fee asset: ETH

### Aevo
- EVM-compatible account-based

### Aleph Zero
- EVM-compatible account-based
- Mainnet, Testnet
- Fee asset: AZERO

### Algorand
- **Account-based** (non-EVM)
- Mainnet, Testnet
- Fee asset: ALGO (Fireblocks asset ID: ALGO mainnet / ALGO_TEST testnet)

### Apechain
- EVM-compatible
- Mainnet, Testnet
- Fee asset: APE

### Arbitrum One
- EVM-compatible
- Mainnet, Rinkeby (Testnet), Sepolia (Testnet)
- Fee asset: ETH (`ETH-AETH` for mainnet, `ETH-AETH_RIN` for Rinkeby Testnet)

### Avalanche
- Fee asset: AVAX (`AVAX` mainnet, `AVAXTEST` Fuji Testnet)

### Axelar (AXL)
- **UTXO-based**
- Mainnet, Testnet
- Fee asset: AXL

### Babylon (BABY)
- EVM-compatible
- Mainnet, Testnet

### Base
- EVM-compatible
- Mainnet, Goerli (testnet)
- Fee asset: ETH (`BASECHAIN_ETH` mainnet)

### Berachain
- EVM-compatible, Mainnet/Testnet, Fee: BERA

### Bitcoin
- **UTXO-based**, Mainnet/Testnet

### Bitcoin Cash
- **UTXO-based**, Mainnet/Testnet

### Blast / BNB Smart Chain / Bob / Boom / Camino / Canto
- 모두 EVM-compatible account-based (다양한 mainnet/testnet 구성)

### Cardano
- **UTXO-based**, Mainnet/Testnet

### Celestia
- Account-based, Mainnet/Testnet, Fee: TIA

### Celo
- EVM-compatible, Mainnet + Alfajores(Testnet) + Baklava(Testnet)
- Fee: CELO (`CELO` mainnet, `CELO_ALF` Alfajores, `CELO_BAK` Baklava)

### Chiliz
- EVM-compatible, Mainnet, Fee: $CHZ (`CHZ_$CHZ`)

### Codex
- EVM-compatible, Mainnet/Testnet, Fee: ETH

### ... and 80+ more

(완전한 목록은 원본 PDF 22페이지 참조. 카탈로그 hub는 [[vendors/fireblocks/blockchains]])

<!-- page: 22 -->

## Foot

(footer links omitted)

---

## 2차 추출 (Stage 142, 2026-07-06) — 전체 체인 목록 (Mode C promote)

> pdftotext 로 원본 PDF 22p 전량 추출. 카탈로그 총 **135개 체인** (2026-05-18 스냅샷 기준). 유형 집계: EVM account-based 90 · Account-based(non-EVM) 27 · UTXO-based 14 · Cosmos SDK-compatible 3 · Permissioned DLT 1. 각 entry 의 fee asset 상세는 원본 PDF 참조.

### 분류 quirk (원문 그대로 — 검증 시 유의)

- ★ **Cosmos 생태 체인 다수가 "UTXO-based" 로 분류돼 있음**: Axelar · dYdX · Injective · Noble · Thorchain. 일반 통념(Cosmos SDK 계열)과 다르지만 원문 표기 그대로 기록. Cosmos SDK-compatible 로 표기된 것은 Osmosis · Provenance · Xion 3개뿐.
- ★ **Canton 은 유일한 5번째 유형**: "Permissioned distributed ledger (DAML-based); requires enablement" — Supported networks: Consortium networks (by Fireblocks approval).
- Noble (USDC) 는 fee 를 **USDC 로 지불** (base asset 아님).
- Ethereum testnet 은 Sepolia + **Hoodi**. Arbitrum 에 Rinkeby 표기 잔존(구식), Base 에 Goerli 표기 잔존.
- Avalanche (C-Chain)·Ethereum Classic 은 "Account-based" 로만 표기 (EVM 라벨 없음 — 원문 그대로).

### EVM account-based (90)

기본 표기(Mainnet, Testnet)가 아닌 경우만 주석:

**0G**, **Abstract**, **Aevo**, **Aleph Zero**, **Apechain**, **Arbitrum One**, **Astar**, **Aurora**, **Babylon (BABY)**, **Base**, **Berachain**, **Blast**, **BNB Smart Chain**, **Bob**, **Boom**, **Camino**, **Celo**, **Centrifuge**, **Chiliz**, **Codex**, **CoreDAO**, **Cortex**, **Cronos**, **Ethereum**, **Ethereum Proof-of-Work (PoW)**, **Evmos**, **Fantom Opera**, **Fastex**, **Filecoin**, **Flow**, **Gevolut**, **Gnosis**, **Gunzilla**, **HederaEVM**, **HT Chain**, **Humanity**, **HyperEVM**, **Immutable zkEVM (IMX)**, **Ink**, **Iota**, **Iotex**, **Kaia**, **Katana**, **Lachain**, **Linea**, **Lisk**, **Lumia**, **Manta**, **Mantle**, **Mirasmanda**, **Moonbeam**, **Moonriver**, **Morph**, **Nahmii**, **Neutron**, **Oasys**, **OP Mainnet (Optimism)**, **Peaq**, **Plasma**, **Plume**, **Polygon**, **Polygon zkEVM**, **Redbelly**, **Ronin**, **RSK**, **Scroll**, **Sei**, **SmartBCH**, **Somnia**, **Soneium**, **Songbird Canary**, **Songbird Canary Legacy**, **Sonic**, **Sophon**, **Stable**, **TAC**, **Telos**, **Tezos Etherlink**, **TokenEX**, **Unichain**, **Velas**, **Viction**, **Wemix**, **Wirex**, **WorldChain**, **WorldMobile**, **XDC**, **Zilliqa**, **Zircuit**, **zkSync**

- 0G — Mainnet
- Abstract — Mainnet
- Aevo — Mainnet
- Arbitrum One — Mainnet, Rinkeby (Testnet), Sepolia (Testnet)
- Astar — Mainnet
- Aurora — Mainnet
- Base — Mainnet, Goerli (testnet)
- Blast — Mainnet
- Camino — Mainnet
- Celo — Mainnet, Alfajores (Testnet), Baklava (Testnet)
- Chiliz — Mainnet
- Cortex — Mainnet
- Ethereum — Mainnet, Sepolia (Testnet), Hoodi (testnet)
- Ethereum Proof-of-Work (PoW) — Mainnet
- Evmos — Mainnet
- Fantom Opera — Mainnet
- Flow — Mainnet
- Gevolut — Testnet
- Gnosis — Mainnet
- Ink — Mainnet
- Lachain — Mainnet
- Linea — Linea Mainnet, Linea Goerli Testnet
- Lumia — Mainnet
- Mantle — Mainnet
- Moonbeam — Mainnet
- Moonriver — Mainnet
- OP Mainnet (Optimism) — Mainnet, Kovan (Testnet), Sepolia (Testnet)
- Plume — Mainnet
- Polygon — Mainnet, Amoy (Testnet)
- Polygon zkEVM — Mainnet
- Ronin — Mainnet
- Sei — Mainnet
- SmartBCH — Mainnet
- Songbird Canary — Mainnet
- Songbird Canary Legacy — Mainnet
- Tezos Etherlink — Mainnet
- TokenEX — Mainnet
- Viction — Mainnet
- Wirex — Mainnet
- WorldChain — Mainnet
- XDC — Mainnet

### Account-based (non-EVM) (27)

기본 표기(Mainnet, Testnet)가 아닌 경우만 주석:

**Algorand**, **Avalanche (C-Chain)**, **Canto**, **Celestia**, **Cosmos Hub**, **DigitalBits**, **EOS.IO**, **Ethereum Classic**, **Flare**, **Hedera**, **Initia**, **Kava**, **Kusama**, **NEAR Protocol**, **NEM**, **Omni EVM**, **Polkadot**, **Ripple**, **SEP**, **Shimmer**, **Solana**, **Stellar**, **SX**, **Terra 2.0**, **Terra Classic**, **Tezos**, **TRON**

- Avalanche (C-Chain) — Mainnet, Fuji (Testnet)
- Ethereum Classic — Mainnet, Mordor (Testnet)
- Flare — Mainnet
- Kusama — Mainnet
- Polkadot — Mainnet, Kusama - Canary Mainnet, Westend (Testnet)
- Solana — Mainnet, Devnet
- SX — Mainnet
- Terra 2.0 — Mainnet, Pisco (Testnet)
- Terra Classic — Mainnet
- TRON — Mainnet, Shasta (Testnet)

### UTXO-based (14)

기본 표기(Mainnet, Testnet)가 아닌 경우만 주석:

**Axelar (AXL)**, **Bitcoin**, **Bitcoin Cash**, **Bitcoin SV**, **Cardano**, **Dash**, **Dogecoin**, **dYdX (DYDX)**, **eCash**, **Injective (INJ)**, **Litecoin**, **Noble (USDC)**, **Thorchain (RUNE)**, **ZCash**

### Cosmos SDK-compatible (3)

기본 표기(Mainnet, Testnet)가 아닌 경우만 주석:

**Osmosis**, **Provenance**, **Xion**

### Permissioned DLT (DAML) (1)

기본 표기(Mainnet, Testnet)가 아닌 경우만 주석:

**Canton**

- Canton — Consortium networks (by Fireblocks approval)

