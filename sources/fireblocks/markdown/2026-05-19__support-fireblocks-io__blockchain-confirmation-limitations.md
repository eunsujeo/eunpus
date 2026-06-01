<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/10883778988060-Blockchain-confirmation-limitations
downloaded_at: 2026-05-19
original_pdf: Blockchain confirmation limitations – Fireblocks Help Center.pdf
status: full
priority: TIER1
domain: Blockchain-Assets / Deposit-Lifecycle / Indexer-Boundary
-->

# Blockchain confirmation limitations

*Updated 4 months ago* (as of 2026-05-19 capture)

## One-line summary

**EVM 체인 minimum = 1 confirmation** (0 불가). **Max confirmations table** — 체인별 1/2/3/20/30/100/300/1200 으로 차등. **Finality-property 체인** (rigid, 변경 불가) 별도 list — SOL/POLKADOT 은 `Confirmed` (1) vs `Finalized` (2) 구별. Fireblocks 는 **"Confirmed" block 만 completed 로 marking** + **"based on our analysis, a reversion has never happened before"** 명시 (SOL 기준).

## Key Concepts

### 1. Minimum confirmations (p.1)

> "All EVM-compatible blockchain networks require a minimum of 1 confirmation. You cannot enter 0 confirmations for these blockchain networks."

→ EVM = 최소 1. Non-EVM 의 minimum 은 chain 별 finality property (아래) 또는 0 허용 가능 (vault-to-vault BTC 등).

### 2. Maximum confirmations table (p.1-4)

| Max conf | 체인 |
|---|---|
| **1** | Cronos, Morph, Peaq, Xion |
| **2** | Initia, Gevolut, Humanity |
| **3** | Fastex, WorldMobile |
| **20** | TRON |
| **30** | 0G, Abstract, Aleph Zero, Apechain, Arbitrum (+Testnet), Avalanche (+Testnet), Babylon, Berachain, Binance Smart Chain (+Testnet), Bob, Boom, CELO (+ALF +BAK Testnet), Codex, Coinbase, eCredits Testnet, Ethereum Testnet (Holesky/Hoodi/Sepolia), EthereumPoW, Fantom, Filecoin, Flare, Flow, Gunzilla, HederaEVM, HOM Testnet, HT Chain (+Testnet), HyperEVM, Ink, Iotex, Kaia, Katana, KUB Bitkub (+Testnet), Lisk, Lumia, Manta, Mirasmanda, Moonbeam, Moonriver, Neutron, Oasys, OP Mainnet (Optimism), Plume, Ronin, RSK Smart Bitcoin, RSK Scroll, SEP, Shimmer, Smart Bitcoin Testnet, Smart BCH Testnet, Somnia, Soneium, Songbird (+Legacy), Sonic, TAC, Viction, Wirex, XinFin, zkSync |
| **100** | Cosmos Hub, Injective, Celestia, Ethereum, NEAR |
| **300** | Polygon, Polygon Mumbai, Polygon zkEVM |
| **1200** | Ethereum Classic, Ethereum Classic Testnet |

→ ★ **Ethereum 의 max = 100, ETC 의 max = 1200** — Default DCCP 의 ETC 372 confirmations 는 max 의 31% 수준.

### 3. Finality-property 체인 — rigid, 변경 불가 (p.4-6)

> "The following blockchains have a rigid finality property, which is non-changeable (i.e., you cannot change the confirmation policy for them)"

| Asset | Finality value | Description |
|---|---|---|
| ALGORAND | 1 | |
| ATOM | 1 | |
| INJECTION | 1 | |
| CELESTIA | 1 | |
| CRONOS | 1 | |
| EOS | 2 | |
| HBAR | 1 | |
| HUMANITY | 2 | |
| KAVA | 2 | |
| KUSAMA | 2 | |
| LINEA | 2 | |
| MORPH | 1 | |
| **POLKADOT** | **Confirmed: 1 / Finalized: 2** | dual-level |
| RIPPLE | 1 | |
| **SOL** | **Confirmed: 1 / Finalized: 2** | **Event confirmed** ← Fireblocks 가 "Confirmed" 사용 |
| STABILITY | 1 | |
| STELLAR | 1 | |
| TERRA | 2 | |
| TEZOS | 2 | |
| TON | 1 | |
| WorldMobile | 3 | |

→ rigid = customer 가 override 불가. Confirmation policy override 가능한 체인 ≠ Finality-property 체인.

### 4. SOL 의 dual-level 처리 — Fireblocks 의 명시적 선택 (p.6)

> "All assets on Solana (SOL): 1"
>
> "To find the right balance between speed and finality confidence, we only mark confirmed blocks as completed. Confirmed blocks are backed by votes from the majority of validators and have a very low probability of being reverted. Based on our analysis, a reversion has never happened before."

→ ★ Fireblocks 는 SOL 의 **`Confirmed`** level (validator majority vote, ~1 slot) 을 deposit completion trigger 로 사용. **`Finalized`** (~2 slot, supermajority + lockout) 까지 안 기다림.

→ "based on our analysis, a reversion has never happened before" — Fireblocks 의 **empirical risk 평가** 가 정책 결정에 반영된 직접 인용. Q-2026-05-18-B03 (reorg handling) 의 일부 답.

### 5. Vault-to-vault 의 0 confirmations 권장 (p.5)

> "For transfers between your Fireblocks vault accounts, you can apply 0 confirmations to all assets. Since your vault accounts are under your direct management, you are more likely to submit the correct amounts."

→ Internal transfer 의 risk 모델 = "own-side correctness" 가정. EVM 의 min=1 제약과 충돌하는 영역은 chain default 1 적용.

### 6. External deposit 권장값 (p.5-6)

`Default DCCP` 보다 강화된 권장값. **deposit risk 가 외부 출처일 때만 의미**:

| Chain / Asset | 권장 confirmations | 비고 |
|---|---|---|
| Bitcoin Cash (BCH) | 6 | |
| Bitcoin SV (BSV) | 30 | |
| Bitcoin (BTC) | 3 | |
| Dash (DASH) | 3 | |
| **Ethereum Classic (ETC)** | **500** | Default 372 보다 강화 |
| **Ethereum PoS (ETH)** | **60** | "2-epoch timeframe, which is the chain's finality period" |
| Ethereum PoW (ETHW) | 30 | |
| Litecoin (LTC) | 6 | |
| Solana (SOL) | 1 | (Confirmed level — 위 §4) |
| ZCash (ZEC) | 12 | |
| XDC Network (XDC, formerly XINFIN) | 30 | |
| USDC on Avalanche | 7 | |
| USDC on Ethereum | 6 | |

→ **ETH PoS 60 confirmations = 2 epoch** 의 의미: 1 epoch = 32 slot, finality = 2 epoch (justified + finalized) → 60 ≈ 1.9 epoch. Fireblocks 는 정확한 "finalized" depth 보다 약간 보수적 선택.

### 7. Finality 의 정의 (p.4)

> "Blockchain finality refers to the point at which a transaction or block is considered irreversible and permanently recorded on the blockchain."
>
> "These networks are designed so that once a transaction is confirmed according to their finality rules, it is effectively immutable and protected from reversion or double-spending attacks."

→ Fireblocks 의 용어 정의 — confirmation 횟수 의 의미가 PoW (probabilistic) 와 finality-property chain (deterministic) 사이에서 다름을 명시.

## Operational implications

1. **Vault-to-vault 의 0 conf** = trusted internal source 가정 — KR 은행 규제 관점에서 customer 의 vault 간 이동도 "내부거래" 로 감사 필요할 수 있음 (1 conf 이상 강제 검토).
2. **SOL 의 `Confirmed` 사용** = empirical risk 정책 — KR 규제 관점에서 deterministic finality (`Finalized`) 요구할 수 있음 (Q-2026-05-29-DC05 신규).
3. **ETH PoS 60 conf = 2-epoch** — ~12.8 분 latency. 사용자 UX 영향 큼.
4. **EVM min = 1 conf rigid** — instant deposit UI 의 hard floor.
5. **ETC default 372 ≠ recommended 500** — Fireblocks 의 default 가 "safe" 보다 "balanced"; KR 은행은 recommended 사용 권장 검토.

## For full content
`sources/fireblocks/pdf/Blockchain confirmation limitations – Fireblocks Help Center.pdf` (8 pages).

## Related Pages (cite targets)
- [[vendors/fireblocks/blockchains]]
- [[entities/fireblocks/transaction]]
- [[entities/fireblocks/vault-account]]
- [[2026-05-19__support-fireblocks-io__default-deposit-control-and-confirmation-policy]] — Default DCCP
- [[2026-05-19__support-fireblocks-io__build-a-custom-deposit-control-and-confirmation-policy]] — Custom DCCP

## Open Questions
- Q-2026-05-29-DC05 — KR 은행 compliance 관점에서 SOL `Confirmed` (1 slot) 가 충분한가, `Finalized` (2 slot) 가 의무인가
- Q-2026-05-29-DC06 — Finality 체인의 reorg 발생 시 Fireblocks 의 webhook re-emit 정책 (rigid → 정책 변경 불가하지만 chain 자체의 finality 실패 시)
- Q-2026-05-29-DC07 — Max confirmations table 의 신규 체인 추가 SLA (catalog 업데이트 주기)
