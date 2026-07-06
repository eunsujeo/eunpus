---
type: vendor-hub
vendor: fireblocks
status: draft
tags: [architecture, transaction, policy]
source_count: 12
last_updated_stage: 142
related:
  - api
  - architecture
  - mpc
  - overview
  - risks
  - transaction
  - vault-account
  - workspace
---
# Fireblocks — Blockchains

> **Reference / catalog hub** for Fireblocks의 blockchain 자산 도메인. Workspace management/security 도메인과 결이 다른 자산 평면. Chain-specific 자료는 placeholder 인덱스 형식으로 유지하며 governance/signing 흐름과 강하게 연결되는 chain만 추후 selective full ingest 승격.

## Summary

Fireblocks는 다중 체인 custody·transfer 플랫폼이며, 100+ 체인을 지원한다. (★ Stage 142) 카탈로그 스냅샷(2026-05-18) 기준 **135개 체인** — 유형 집계: EVM account-based 90 · Account-based(non-EVM) 27 · UTXO-based 14 · Cosmos SDK-compatible 3 · Permissioned DLT 1. 전체 명단은 `supported-blockchain-networks.md` §"2차 추출 (Stage 142)". 본 도메인의 자료는 크게 다음 카테고리:

- **카탈로그·메타** (8 자료 / full ingest): supported networks, data sheets, SLA, node router, minimums, internal transactions, about
- **체인별 quirks** (12 자료 / placeholder): Algorand · Tezos · Filecoin · Flare · Stellar · Kusama · Moonbeam/Moonriver · Near · Polkadot · Ripple · Solana · Songbird

## Key Concepts

### 체인 종류 vocabulary

`supported-blockchain-networks.md`에서 사용하는 chain type 카테고리:

- **EVM-compatible account-based** — 가장 흔함 (Ethereum, Arbitrum, Base, Avalanche C-Chain 등 100+)
- **Non-EVM account-based** — Algorand, Solana, Stellar, Near, Tezos 등
- **UTXO-based** — Bitcoin, Bitcoin Cash, Litecoin, Cardano 등. (★ Stage 142) 카탈로그가 **Cosmos 생태 체인 다수를 UTXO-based 로 분류**: Axelar · dYdX · Injective · Noble · Thorchain — 일반 통념과 다르나 원문 표기 그대로.
- **Cosmos SDK-based account-based** — Zigchain, Pocket Network 등 (신규 추가는 대부분 이 패턴, `blockchain-data-sheets.md`). 카탈로그 내 Cosmos SDK-compatible 표기는 Osmosis · Provenance · Xion 3개.
- (★ Stage 142) **Permissioned DLT (DAML)** — 5번째 유형, Canton 단독: "requires enablement", Supported networks = Consortium networks (by Fireblocks approval).

### Node infrastructure 모델

`blockchains-sla.md`:

| Node type | SLA | 운영 |
|---|---|---|
| Fireblocks-hosted | 99.9% uptime | Fireblocks 책임 |
| Certified vendors | 99.9% uptime | Fireblocks 검증 통과한 third-party |
| Foundation-provided | **No SLA** | 해당 blockchain foundation 책임 |

**SLA-covered 체인 목록 (~30개)**: ALGO, ARB, AVAX, BASE, BTC, BCH, BSV, BSC, ADA, CELO, ATOM, CHZ, DASH, DOGE, eCash, ETH, ETC, FTM, KSM, LTC, NEAR, OP, OSMO, MATIC, DOT, XRP, RON, SOL, XLM, XTZ, TON, TRX, ZEC, ZKsync.

본 list에 없는 chain의 outage는 platform SLA에 미반영.

### Node Router (Premium feature)

`node-router.md` — 고객이 자체 또는 third-party node로 transaction routing:

- **Static dedicated route**: 단일 node로 모든 outgoing tx (API/UI/WC)
- **On-demand route**: API 호출 시점에 node 선택

**제약**:
- Static의 경우 **단일 node만 지원** — tenant의 모든 vault에 적용
- **EVM only**
- 대상 op는 tx prep + submission (`sendRawTransaction`, `getTransactionCount`)만; 그 외 public op는 Fireblocks default node로
- **No fallback** to Fireblocks default node when customer node down
- 고객이 node 유지 책임

Activation: Customer Success Manager 경유.

### Minimum balance / Base Reserve

`minimum-balance.md`:

| Chain | Min balance |
|---|---|
| Algorand (ALGO) | 0.1 ALGO |
| Kusama (KSM) | 0.000333333 KSM |
| Near (NEAR) | 0.00182 NEAR |
| Polkadot (DOT) | 1 DOT (chain-specific: 0.01 activation, see `polkadot-dot-minimum-balance-and-fee-estimation.md`) |
| Ripple (XRP) | 1 XRP + 0.2 XRP / trust line |
| Solana (SOL) | 0.01 SOL |
| Stellar (XLM) | 0.5 XLM (account 생성 시 1 XLM 입금 필요, `funding-a-new-stellar-account.md`) |
| TON | 1e-9 TON |

신규 체인은 `blockchain-data-sheets.md`의 "Minimum balance" 필드 참조.

### Minimum transaction amounts

`minimum-transaction-amounts.md`:

| Chain | Min amount |
|---|---|
| Bitcoin / Bitcoin Cash / Litecoin | 0.00000582 (각 자산) |
| Algorand | 0.000001 ALGO |
| Cardano | 1 ADA |
| Dogecoin | 0.01 DOGE |
| Toncoin | 0.000001 TON |

그 외: token decimal limit 기반 (Fireblocks API로 조회).

미만 시 fail + `Amount Too Small` status.

### Internal transactions (EVM-only)

`blockchains-that-support-internal-transactions.md` — smart contract 실행 중 발생하는 native asset transfer:

- 별도 tx hash 없음, 실행 흐름의 일부
- Fireblocks가 직접 native transfer는 **모든 EVM chain**에 알림
- Internal tx까지 알리는 chain은 **subset** (~35 mainnet + ~24 testnet)
- "Implementation choice, not chain limitation"

**Mainnet 지원 (요약)**: ApeChain, Avalanche, Base, Berachain, Celo, Chiliz, Core DAO, ETC, Ethereum, Flare, Fantom, GUNZ, HyperEVM, Ink, Katana, Kaia, Lumia, Mirasmanda, Monad, Nomina, Optimism, Plasma, Plume, Ronin, Scroll, Sei, Somnia, Sonic, Sophon, TAC, Unichain, Wirex Pay, WorldMobile, Worldchain, Gnosis, 0G Aristotle.

### 두 매트릭스 비교 (SLA × Internal-tx)

본 자료군에서 두 매트릭스의 교집합/차이는 운영 의사결정의 메타 정보:

- **SLA + Internal-tx 모두 포함**: ETH, ETC, Optimism, Ronin, Celo, Chiliz, Fantom 등 — Fireblocks가 가장 완전한 운영 보증
- **SLA 있고 Internal-tx 없음**: BTC, ADA, ALGO, ATOM, XRP, SOL, XLM, XTZ, TON, TRX 등 (non-EVM 또는 UTXO 위주)
- **Internal-tx 있고 SLA 없음**: 신규 EVM L2/L1 다수 (Monad, Sonic, Sophon, Berachain 등)
- 운영 선택의 trade-off는 [[open-questions/fireblocks]] Q-2026-05-18-B01 참조.

### Deposit Control and Confirmation Policy (DCCP) — Stage 40

`default-deposit-control-and-confirmation-policy.md` + `build-a-custom-deposit-control-and-confirmation-policy.md` + `blockchain-confirmation-limitations.md` 통합. DCCP = **indexer 의 truth-determination layer** — chain tx 가 언제 deposit 으로 "completed" 되는지 결정.

#### Default DCCP (per-chain default)

| 체인 group | Default conf | 비고 |
|---|---|---|
| Ethereum Classic | **372** | 51% attack risk 명시 (source: `default-...md`, p.1) |
| Finality-property 체인 | (별도) | rigid, 변경 불가 — 아래 표 |
| All other blockchains | **1** | vault↔vault 포함 |
| Contract call operations | **3 (recommended)** | tx type 별 별도 권장 (source: `default-...md`, p.1) |

#### Custom DCCP — 6 parameters, first-match basis

`build-a-custom-...md`, p.1-2:

- **Source / Destination**: vault account / group (예: all Binance accounts) / general (all exchanges, all P2P)
- **Amount**: USD equiv / asset qty / `Any`
- **Asset**: Asset ID / contract address / symbol+chain (chain 명시 mandatory)
- **Blockchain network**: Fireblocks 지원 chain
- **# of Confirmations**: whole number (chain min/max 범위) 또는 `Minimum` (동적)

**Workflow** (★ self-service 불가): Customer template download → modify → **Fireblocks Support 제출 → review + approval + implementation**. Lead-time / SLA 명시 없음 → Q-2026-05-29-DC02.

#### Min/Max confirmations (chain 별 hard limit)

`blockchain-confirmation-limitations.md`, p.1-4:

- **EVM minimum = 1** (rigid, 0 불가)
- **Max conf 그룹** (요약):
  - 1: Cronos, Morph, Peaq, Xion
  - 2: Initia, Gevolut, Humanity
  - 3: Fastex, WorldMobile
  - 20: TRON
  - 30: 대부분 신규 EVM L2/L1 (~60+ chain)
  - 100: Cosmos Hub, Injective, Celestia, **Ethereum**, NEAR
  - 300: Polygon (+Mumbai +zkEVM)
  - 1200: Ethereum Classic (+Testnet)

→ ETC default 372 = max 1200 의 31% — Fireblocks default 는 "balanced", recommended (500) 는 "safe".

#### Finality-property 체인 — rigid, customer override 불가

`blockchain-confirmation-limitations.md`, p.4-6:

| Asset | Finality value |
|---|---|
| ALGO / ATOM / INJ / CELESTIA / CRONOS / HBAR / MORPH / RIPPLE / STABILITY / STELLAR / TON | **1** |
| EOS / HUMANITY / KAVA / KUSAMA / LINEA / TERRA / TEZOS | **2** |
| WorldMobile | **3** |
| **POLKADOT** | **Confirmed: 1 / Finalized: 2** (dual-level) |
| **SOL** | **Confirmed: 1 / Finalized: 2** — Fireblocks 가 **`Confirmed`** 사용 |

#### SOL 의 `Confirmed` 선택 — Fireblocks 의 empirical risk 정책 (★ 직접 인용)

`blockchain-confirmation-limitations.md`, p.6:

> "To find the right balance between speed and finality confidence, we only mark confirmed blocks as completed. Confirmed blocks are backed by votes from the majority of validators and have a very low probability of being reverted. Based on our analysis, a reversion has never happened before."

→ Fireblocks 가 `Finalized` 까지 안 기다리고 `Confirmed` 로 deposit completion 결정. KR 은행 compliance 관점에서 `Finalized` 강제 여부는 Q-2026-05-29-DC05.

#### Recommended (default 보다 강화) — external deposit 시

`blockchain-confirmation-limitations.md`, p.5-6:

| Chain | Recommended | 비고 |
|---|---|---|
| BTC | 3 | |
| BCH | 6 | |
| BSV | 30 | |
| DASH | 3 | |
| ETC | 500 | default 372 보다 강화 |
| **ETH PoS** | **60** | "2-epoch timeframe, chain's finality period" |
| ETHW | 30 | |
| LTC | 6 | |
| SOL | 1 | (Confirmed level) |
| ZEC | 12 | |
| XDC | 30 | |
| USDC on AVAX | 7 | |
| USDC on ETH | 6 | |

→ ETH PoS 60 conf ≈ 12.8 분 latency. UX 영향 큼.

#### DCCP 운영적 함의 (KR 은행 관점)

1. **Vault-to-vault 0 conf** = "trusted internal source" 가정 — KR 감사 관점에서 1 conf 이상 강제 검토
2. **EVM min 1 conf rigid** = instant deposit UI 의 hard floor (chain truth 이후 최소 1 block 대기)
3. **SOL `Confirmed`** = empirical risk 정책 — regulatory pressure 시 `Finalized` 의무 변경 가능성 (Fireblocks Support 제출 필요)
4. **ETC default 372 vs recommended 500** = Fireblocks default 가 보수적이지 않음 — KR 은행은 custom DCCP 로 500 적용 권장 검토
5. **Custom DCCP self-service 불가** = Fireblocks Support review-approval 경유 → 정책 변경 lead-time / audit trail 별도 확인 필요 (Q-2026-05-29-DC02, DC03)

자세한 내용은 [[entities/fireblocks/transaction]] §"DCCP 와 confirmation lifecycle" 참고.

#### Vendor-neutral indexer reference 와의 대비 (★ Stage 41)

Fireblocks 의 DCCP 는 본 wiki 의 [[docs/architecture/blockchain-indexer-architecture-reference]] §5.1 "확정성은 API 계약" 의 **SaaS 변형**. Customer 는 indexer 구현 자체를 보지 못하고 (P1~P4 패턴 중 어느 조합인지 비공개), 정책 layer (DCCP) 만 일부 override 가능.

→ **Direct-build path** 를 선택하면 4 pattern 의 직접 설계 + projection / query plane / monitoring 전체 영역이 customer 책임. 본 reference §11 "Fireblocks 와의 관계" 의 책임 분담표 참조.

## Details

### Catalog 항목 형식 (per chain)

`supported-blockchain-networks.md`의 카탈로그 entry는 다음 메타를 가진다:

```
<Chain name>
- <Chain type>
- Supported networks: <Mainnet>, <Testnet 종류>
- Foundation website: <link>
- Fees are paid using <fee asset> (Fireblocks asset ID: <ID for mainnet, ID for testnet>)
```

전체 카탈로그(100+ 체인)는 원본 PDF 참조. 신규 추가는 `blockchain-data-sheets.md`의 표준 시트 형식으로 등록.

### Chain-specific quirks 인덱스

본 위키는 12개 chain-specific 자료를 **placeholder markdown**으로 유지 (full ingest 안 함). 각 placeholder는 one-line summary + 원본 PDF reference만 포함.

| Chain | Quirk summary | Placeholder |
|---|---|---|
| ALGO | tx ID 1000-blocks (~50min) signing window | [algorand-blockchain-limitations](../../sources/fireblocks/markdown/2026-05-18__support-fireblocks-io__algorand-blockchain-limitations.md) |
| XTZ | ~30min signing timeout (120 blocks); mempool 1 tx/account | [tezos-blockchain-limitations](../../sources/fireblocks/markdown/2026-05-18__support-fireblocks-io__tezos-blockchain-limitations.md) |
| FIL | L1 with EVM interface, 4 account types (F1/F2/F3/F4 = 0x), FILForwarder bridge | [filecoin-blockchain-functionality-overview](../../sources/fireblocks/markdown/2026-05-18__support-fireblocks-io__filecoin-blockchain-functionality-overview.md) |
| FLR | **Opt-in** EVM chain via Support ticket; Canary = Songbird; 2023-01-09 airdrop | [flare-introduction](../../sources/fireblocks/markdown/2026-05-18__support-fireblocks-io__flare-introduction.md) |
| XLM | 새 wallet 생성 시 1 XLM 입금 필수 (2024-01-01 이후 고객 책임) | [funding-a-new-stellar-account](../../sources/fireblocks/markdown/2026-05-18__support-fireblocks-io__funding-a-new-stellar-account.md) |
| KSM | Fee = fee/byte × network fee + tip; API는 network fee만 반환 | [kusama-transaction-fee-estimation](../../sources/fireblocks/markdown/2026-05-18__support-fireblocks-io__kusama-transaction-fee-estimation.md) |
| GLMR / MOVR | Ethereum-style만 지원, Substrate extrinsics 미지원 | [moonbeam-and-moonriver-transaction-support](../../sources/fireblocks/markdown/2026-05-18__support-fireblocks-io__moonbeam-and-moonriver-transaction-support.md) |
| NEAR | Token의 smart contract가 먼저 fund되어야 destination이 token 보유 가능 | [near-tokens-initial-deposit](../../sources/fireblocks/markdown/2026-05-18__support-fireblocks-io__near-tokens-initial-deposit.md) |
| DOT | 0.01 미만 시 reaped + replay attack 위험; tx 2시간 valid | [polkadot-dot-minimum-balance-and-fee-estimation](../../sources/fireblocks/markdown/2026-05-18__support-fireblocks-io__polkadot-dot-minimum-balance-and-fee-estimation.md) |
| XRP | Trust line 제거: reserve 0.2 XRP + default flags; min reserve 하강 시 trust line auto-deleted on-chain | [removing-a-ripple-xrp-trust-line](../../sources/fireblocks/markdown/2026-05-18__support-fireblocks-io__removing-a-ripple-xrp-trust-line.md) |
| SOL | 최대 600 tx "Queue" 동시; 초과는 "Submitted" 상태 | [solana-maximum-queued-transactions](../../sources/fireblocks/markdown/2026-05-18__support-fireblocks-io__solana-maximum-queued-transactions.md) |
| SGB | 두 SGB 자산 (current EVM coin type 60 / Legacy coin type 544) | [songbird-support-and-the-flare-airdrop](../../sources/fireblocks/markdown/2026-05-18__support-fireblocks-io__songbird-support-and-the-flare-airdrop.md) |

### Selective full ingest 승격 기준

다음 조건 충족 시 placeholder → full markdown 승격:

- 위키의 governance / signing / relationship 흐름과 강하게 연결 (예: Filecoin EVM/native bridge 패턴이 일반화되는 경우)
- 다른 chain의 패턴 일반화에 메타 가치 (예: Tezos의 mempool 1-tx 제약이 다른 Substrate chain에도 적용)
- 사용자의 명시적 요청 시

## Related Pages

- [[vendors/fireblocks/overview]]
- [[vendors/fireblocks/architecture]] — Node infrastructure 컴포넌트
- [[vendors/fireblocks/risks]] — Foundation node SLA 없음의 위험
- [[vendors/fireblocks/api]] — API user의 tx submission 흐름
- [[vendors/fireblocks/mpc]] — 자산 측 key share (chain별 derivation은 chain-specific)
- [[entities/fireblocks/vault-account]] — 자산 보유 단위
- [[entities/fireblocks/transaction]] — Internal transaction 개념 + Minimum amounts
- [[entities/fireblocks/workspace]] — Node Router는 tenant(workspace) 단위

## Sources

### Catalog & meta (8 full ingest)

- `2026-05-18__support-fireblocks-io__about-blockchains.md`, p.1
- `2026-05-18__support-fireblocks-io__supported-blockchain-networks.md`, p.1–22 (catalog summary)
- `2026-05-18__support-fireblocks-io__blockchain-data-sheets.md`, p.1–3
- `2026-05-18__support-fireblocks-io__node-router.md`, p.1–4
- `2026-05-18__support-fireblocks-io__blockchains-sla.md`, p.1–2
- `2026-05-18__support-fireblocks-io__minimum-balance.md`, p.1
- `2026-05-18__support-fireblocks-io__minimum-transaction-amounts.md`, p.1
- `2026-05-18__support-fireblocks-io__blockchains-that-support-internal-transactions.md`, p.1–3

### DCCP (3 full ingest, Stage 40)

- `2026-05-19__support-fireblocks-io__default-deposit-control-and-confirmation-policy.md`, p.1
- `2026-05-19__support-fireblocks-io__build-a-custom-deposit-control-and-confirmation-policy.md`, p.1–3
- `2026-05-19__support-fireblocks-io__blockchain-confirmation-limitations.md`, p.1–6

### Chain-specific (12 placeholder)

- algorand-blockchain-limitations / tezos-blockchain-limitations / filecoin-blockchain-functionality-overview / flare-introduction / funding-a-new-stellar-account / kusama-transaction-fee-estimation / moonbeam-and-moonriver-transaction-support / near-tokens-initial-deposit / polkadot-dot-minimum-balance-and-fee-estimation / removing-a-ripple-xrp-trust-line / solana-maximum-queued-transactions / songbird-support-and-the-flare-airdrop

## Open Questions

- Q-2026-05-18-B01 — SLA-covered ∩ Internal-tx 지원 매트릭스의 운영적 의미
- Q-2026-05-18-B02 — Node Router static vs on-demand trade-off (EVM only, fallback 없음)
- Q-2026-05-18-B03 — Internal transaction 감지 메커니즘 (trace API? archive node?) — **부분 ANSWERED (★ Stage 40)**: SOL 의 reorg 영역에 대해 Fireblocks 가 "based on our analysis, a reversion has never happened before" 라는 empirical 정책 명시 (source: `blockchain-confirmation-limitations.md`, p.6). 즉 Fireblocks 의 confirmation truth 는 chain-level finality 외에 **자체 monitoring + empirical risk 평가** 를 포함. 내부 indexer 의 RPC method 조합 자체는 여전히 비공개.
- Q-2026-05-29-DC01 — Contract call 의 3-conf "recommended" 가 default 인지 권장값인지
- Q-2026-05-29-DC02 — Custom DCCP 의 Fireblocks Support review SLA / lead-time
- Q-2026-05-29-DC03 — Custom DCCP 변경 audit trail (customer 측 audit log 노출 여부)
- Q-2026-05-29-DC04 — "Override the DCCP for specific transactions" 의 별도 plane 메커니즘 (per-tx override)
- Q-2026-05-29-DC05 — KR 은행 compliance 관점에서 SOL `Confirmed` (1 slot) vs `Finalized` (2 slot) 의무 판단
- Q-2026-05-29-DC06 — Finality 체인의 chain-자체 finality 실패 (예: validator collusion) 시 Fireblocks webhook re-emit 정책
- Q-2026-05-29-DC07 — Max confirmations table 의 신규 체인 추가 catalog 업데이트 주기
