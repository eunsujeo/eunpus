# Fireblocks — Blockchains

> **Reference / catalog hub** for Fireblocks의 blockchain 자산 도메인. Workspace management/security 도메인과 결이 다른 자산 평면. Chain-specific 자료는 placeholder 인덱스 형식으로 유지하며 governance/signing 흐름과 강하게 연결되는 chain만 추후 selective full ingest 승격.

## Summary

Fireblocks는 다중 체인 custody·transfer 플랫폼이며, 100+ 체인을 지원한다. 본 도메인의 자료는 크게 다음 카테고리:

- **카탈로그·메타** (8 자료 / full ingest): supported networks, data sheets, SLA, node router, minimums, internal transactions, about
- **체인별 quirks** (12 자료 / placeholder): Algorand · Tezos · Filecoin · Flare · Stellar · Kusama · Moonbeam/Moonriver · Near · Polkadot · Ripple · Solana · Songbird

## Key Concepts

### 체인 종류 vocabulary

`supported-blockchain-networks.md`에서 사용하는 chain type 카테고리:

- **EVM-compatible account-based** — 가장 흔함 (Ethereum, Arbitrum, Base, Avalanche C-Chain 등 100+)
- **Non-EVM account-based** — Algorand, Solana, Stellar, Near, Tezos 등
- **UTXO-based** — Bitcoin, Bitcoin Cash, Litecoin, Cardano, Axelar (특이) 등
- **Cosmos SDK-based account-based** — Zigchain, Pocket Network 등 (신규 추가는 대부분 이 패턴, `blockchain-data-sheets.md`)

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

### Chain-specific (12 placeholder)

- algorand-blockchain-limitations / tezos-blockchain-limitations / filecoin-blockchain-functionality-overview / flare-introduction / funding-a-new-stellar-account / kusama-transaction-fee-estimation / moonbeam-and-moonriver-transaction-support / near-tokens-initial-deposit / polkadot-dot-minimum-balance-and-fee-estimation / removing-a-ripple-xrp-trust-line / solana-maximum-queued-transactions / songbird-support-and-the-flare-airdrop

## Open Questions

- Q-2026-05-18-B01 — SLA-covered ∩ Internal-tx 지원 매트릭스의 운영적 의미
- Q-2026-05-18-B02 — Node Router static vs on-demand trade-off (EVM only, fallback 없음)
- Q-2026-05-18-B03 — Internal transaction 감지 메커니즘 (trace API? archive node?)
