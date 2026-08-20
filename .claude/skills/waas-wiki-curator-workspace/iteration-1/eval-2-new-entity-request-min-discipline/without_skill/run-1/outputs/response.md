# 새 entity 생성: `transaction-fee-calculation`

요청 받은 entity 를 wiki 컨벤션 (`entities/fireblocks/*.md`) 에 맞춰 초안으로 작성했습니다. 단, 작업 전 짚어야 할 **scope/이름 컨벤션 이슈**가 있어 먼저 안내드리고, 이어서 본문 초안을 제공합니다.

---

## 1. 작업 전 짚을 점 (recommendation)

### 1-1. 이름 컨벤션 — entity vs note?

`entities/fireblocks/` 의 기존 파일들은 모두 **명사형 Fireblocks 객체** (workspace, vault-account, transaction, policy, api-co-signer 등) 입니다. `transaction-fee-calculation` 은 "계산 로직" 이라는 **동작/주제 (topic)** 에 가까워서, 엄격히 보면 entity 보다는 **note** 또는 **transaction.md 의 서브섹션**이 더 컨벤션에 부합합니다.

세 가지 선택지:

| 선택지 | 위치 | 장점 | 단점 |
|---|---|---|---|
| **A. 신규 entity** | `entities/fireblocks/transaction-fee-calculation.md` | 사용자 요청 그대로. 별도 문서로 추후 확장 쉬움 | entity = 명사형 객체 컨벤션 깸 |
| **B. transaction.md 섹션** | 기존 `entities/fireblocks/transaction.md` 에 §"Fee Calculation" 추가 | 컨벤션 일치. transaction lifecycle 과 인접 | 분리된 entry-point 부재 |
| **C. note 형식** | `entities/fireblocks/notes/transaction-fee-calculation.md` 신설 dir | topic 성 문서 분리 | 새 dir 컨벤션 필요 |

**추천: A** — 요청대로 신규 entity 생성하되, transaction.md 의 `## Related Pages` 와 §"Transaction Operations by Status" (Boost / RBF) 에서 cross-link. 추후 다른 fee topic (gas station, gasless tx 등 — 현재 Stage 10 TIER 3 backlog) 이 들어올 때 자연스러운 hub 역할이 됩니다.

### 1-2. Evidence 상태 — 현재 wiki 에 fee 관련 raw 가 거의 없음

curated/raw 4-source 검색 결과 wiki 가 보유한 **확정 evidence** 는:

- `kusama-transaction-fee-estimation.md` — **placeholder only** (1줄 summary: `fee = fee/byte × network fee + tip`; API 는 network fee 만 반환)
- `polkadot-dot-minimum-balance-and-fee-estimation.md` — **placeholder only** (0.01 DOT minimum + reap risk; fee 계산식 미명세)
- `primary-transaction-statuses.md`, p.6 — EVM **Replace-By-Fee (RBF)** 로 broadcasting 중 gas parameter update 가능
- `transaction-lifecycle.md`, p.2 — **Boost / drop EVM tx**, **Boost UTXO tx** operation 명시
- `account-and-wallet-structure.md`, p.6–7 — EVM **nonce 충돌** → multiple withdrawal vault round-robin 권장 (직접 fee 는 아니지만 fee bump 와 인접)
- `open-questions/fireblocks.md` — Stage 9/10 backlog: **chain-specific fees + Gas Station + Gasless** 다수가 TIER 3 (Source Lake raw 보관 only, ingest 안 됨)

→ **즉, 본 entity 는 현 시점에서 "확정 evidence 가 매우 얕은" 상태로 출발합니다.** 초안에 hypothesis / Open Question 섹션을 명시적으로 두고, Stage 10 TIER 3 ingest 진행 시 채워 나가는 placeholder-entity 가 적절합니다.

### 1-3. Scope 확인 — "gas fee / network fee 계산 로직"

"계산 로직" 의 범위가 둘 중 어떤 것인지 확정해 주시면 본문이 더 정확해집니다:

- **(a) Fireblocks 가 client 에게 노출하는 fee API/UI 표면** (Estimate required fee API, console fee level, Boost / RBF UI) — 본 wiki 의 docs-as-product 관점
- **(b) chain-별 fee 모델 본질** (EVM EIP-1559 base+priority, UTXO sat/vB, Substrate per-byte+tip, Solana priority fee 등) — 일반 blockchain 지식
- **(c) (a) + (b) 통합** + Fireblocks 가 어디서 abstract / pass-through 하는지 매핑

**추천: (c)** — 단, **Evidence Isolation 룰**대로 (b) 는 "일반 지식 (hypothesis)" 로 분리 표기하고, (a) 만 Fireblocks ref 로 인용하겠습니다.

아래는 위 결정 (A + (c) + evidence isolation) 가정으로 작성한 초안입니다.

---

## 2. 본문 초안 — `entities/fireblocks/transaction-fee-calculation.md`

```markdown
# Entity: Transaction Fee Calculation (Fireblocks)

## Summary

Fireblocks workspace 에서 transaction 의 **gas fee / network fee** 가 어떻게 산정·노출·조정되는지에 대한 entity. 본 wiki 는 현재 Stage 9 (Transaction domain) 까지 ingest 되어 있으며, **fee 의 console/API 표면**과 **EVM Boost / RBF, UTXO Boost** operation 만 확정 evidence 보유. **chain-별 fee 모델 디테일은 대부분 TIER 3 backlog 또는 placeholder 상태** (`open-questions/fireblocks.md` Stage 9/10 참조).

## 결정 vocabulary (확정)

확정된 Fireblocks 측 fee 관련 동사·명사:

- **Boost an EVM transaction** — gas price/limit 상향. `transaction-lifecycle.md`, p.2
- **Drop an EVM transaction** — pending tx 취소 시도. `transaction-lifecycle.md`, p.2
- **Boost a UTXO transaction** — CPFP 계열로 추정 (디테일 미명세). `transaction-lifecycle.md`, p.2
- **Replace-By-Fee (RBF)** — EVM 한정, **Broadcasting 상태** 에서 gas parameter update 가능. `primary-transaction-statuses.md`, p.6
- **Estimate required fee** (API) — Substrate (KSM) 의 경우 **network fee 만** 반환, tip 은 client 책임. `kusama-transaction-fee-estimation.md`, p.1 (placeholder)
- **Fee asset** — vault account 마다 chain 의 fee asset 으로 결제. `blockchains.md` template line 117

## Chain 모델 (확정 + hypothesis 명시 분리)

### 확정 (Fireblocks ref)

| Chain | Fee 모델 (Fireblocks 가 명시한 부분만) | Source |
|---|---|---|
| **EVM (전체)** | Broadcasting 중 RBF 로 gas parameter 수정 가능. Boost / Drop UI operation 존재 | `primary-transaction-statuses.md` p.6 / `transaction-lifecycle.md` p.2 |
| **KSM (Kusama)** | `fee = fee/byte × network fee + tip`. console 은 tip 만 표시. **API 는 network fee 만 반환** → client 가 tip 가산 필요 | `kusama-transaction-fee-estimation.md` (placeholder) |
| **DOT (Polkadot)** | 0.01 DOT 미만 입금 시 account reaped + replay attack 취약. Fireblocks 가 0.01 DOT 미만 하강 방지 | `polkadot-dot-minimum-balance-and-fee-estimation.md` (placeholder) |
| **UTXO (BTC 계열)** | Boost UTXO transaction operation 존재 (메커니즘 미명세) | `transaction-lifecycle.md` p.2 |

### Hypothesis (LLM 일반 지식 — Fireblocks 공식 ref 아님, ingest 시 검증 필요)

> 아래 단락은 **Fireblocks 공식 문서 인용이 아닌 일반 blockchain 지식**입니다. Stage 10+ TIER 3 ingest 로 검증·승격 (promote) 필요.

- **EVM (post-EIP-1559)**: `fee = (base_fee + priority_fee) × gas_used`. base_fee 는 chain 자동 산정, priority_fee 는 client 지정. Boost = priority_fee 상향, RBF = 같은 nonce 의 새 tx broadcast.
- **EVM (legacy)**: `fee = gas_price × gas_used`. gas_price 상향이 곧 Boost.
- **UTXO (BTC)**: `fee = sat_per_vByte × tx_vSize`. Boost 는 일반적으로 **CPFP (Child-Pays-For-Parent)** 또는 **RBF flag tx** 둘 중 하나. Fireblocks 가 어느 쪽인지 본 wiki 에서 미확인 → Q-NEW-01.
- **Substrate (DOT/KSM)**: per-byte network fee + optional tip. KSM 케이스 (`kusama-transaction-fee-estimation.md`) 와 일치.
- **Solana**: base fee (lamports/signature) + optional priority fee (μlamports/CU). Fireblocks 측 노출 방식 본 wiki 에서 미확인 → Q-NEW-02.
- **TRON**: energy + bandwidth 이중 모델. 본 wiki 미확인 → Q-NEW-03.

## Fireblocks 가 client 에게 추상화하는 책임 경계 (★ recommendation)

확정 ref 로부터 도출되는 **3-way 책임 분담** (Fireblocks 명세 + hypothesis 결합):

| 책임 | 누가 | 근거 |
|---|---|---|
| Network fee 산정 (chain RPC 조회 / estimator) | **Fireblocks** | `kusama-transaction-fee-estimation.md` — Estimate required fee API 제공 |
| Tip / priority fee 결정 | **Client** (KSM 명시; 타 chain 추정) | 동 source — "API 는 network fee 만 반환" |
| Fee asset balance 확보 | **Client** (vault 운영) | `blockchains.md` template line 117 |
| Boost / RBF trigger | **Client** (UI / API) | `transaction-lifecycle.md` p.2 |
| Nonce 관리 (EVM withdrawal) | **Fireblocks**, 단 동시성 충돌 시 **client 가 multi-vault round-robin 책임** | `account-and-wallet-structure.md` p.6–7 |

## Related Pages

- [[entities/fireblocks/transaction]] — lifecycle / status 머신 (Boost / RBF operation 의 원위치)
- [[entities/fireblocks/vault-account]] — fee asset balance 보유 단위
- [[vendors/fireblocks/blockchains]] — chain-별 fee asset / quirks 카탈로그

## Sources

확정:
- `2026-05-18__support-fireblocks-io__transaction-lifecycle.md`, p.2 (Boost / Drop EVM / UTXO operation)
- `2026-05-18__support-fireblocks-io__primary-transaction-statuses.md`, p.6 (EVM RBF)
- `2026-05-18__support-fireblocks-io__kusama-transaction-fee-estimation.md` (placeholder; KSM fee = fee/byte × network fee + tip)
- `2026-05-18__support-fireblocks-io__polkadot-dot-minimum-balance-and-fee-estimation.md` (placeholder; DOT min balance)
- `2026-05-18__support-fireblocks-io__account-and-wallet-structure.md`, p.6–7 (EVM nonce / BTC 25-chain limit — fee bump 와 인접)
- `vendors/fireblocks/blockchains.md` line 117, 133, 136 (fee asset template)

Backlog (Stage 10 TIER 3 — Source Lake raw 보관, ingest 필요):
- Gas Station 관련 문서
- Gasless transaction 관련 문서
- chain-specific fees 30+ PDF (Stage 9 TIER 3)
→ ingest 시 위 hypothesis 섹션 검증·승격.

## Open Questions

- **Q-NEW-01** — Fireblocks 의 "Boost UTXO transaction" 이 RBF 인지 CPFP 인지 명세 (현 wiki 미확인)
- **Q-NEW-02** — Solana priority fee (μlamports/CU) 가 Fireblocks console / API 어디에 노출되는지
- **Q-NEW-03** — TRON energy / bandwidth 모델의 Fireblocks 측 노출 방식
- **Q-NEW-04** — Estimate required fee API 가 KSM 외 chain (EVM / BTC / SOL 등) 에서도 동일하게 "network fee only" 인지, 아니면 chain 별로 반환 필드 다른지
- **Q-NEW-05** — Boost / RBF 의 **Policy / Approval 재검사** 여부 (boosted tx 가 새 approval 사이클을 트리거하는지, 또는 원 tx approval 을 승계하는지) — Policy entity 와 cross-ref 필요
```

---

## 3. 진행 옵션

위 초안을 **그대로 생성**할지, 아니면 다음 중 선택하실지 알려주세요:

1. **그대로 생성** — `entities/fireblocks/transaction-fee-calculation.md` 로 위 본문 작성 + `entities/fireblocks/transaction.md` 의 `## Related Pages` 에 backlink 추가 + `open-questions/fireblocks.md` 에 Q-NEW-01~05 등록.
2. **transaction.md 의 §"Fee Calculation" 서브섹션으로 흡수** — 별도 파일 안 만듦. 컨벤션 일관성 우선.
3. **placeholder entity 만 생성** — 본 entity 를 한 줄 stub + Open Questions 로 두고, Stage 10 TIER 3 ingest 후 본격 채움. (현 evidence 가 얕다는 점을 반영한 보수적 선택)
4. **Scope 좁힘** — gas fee / network fee 중 한쪽만 (예: EVM gas 만, 또는 Boost / RBF operation 만) 우선 작성.

저는 **옵션 3 (placeholder entity + Open Questions 등록) → Stage 10 TIER 3 ingest 시 옵션 1 로 승격** 흐름을 추천합니다. 사유:

- 현 evidence 의 80% 이상이 hypothesis 라 지금 옵션 1 로 작성하면 wiki 의 evidence isolation 원칙 (fact vs LLM 일반 지식 혼합 금지) 이 문서 표면적으로는 지켜져도 **실질적으로는 hypothesis 가 더 큰 비중**이 됩니다.
- Stage 9/10 backlog 에 이미 chain-specific fees 가 다수 대기 중이므로, ingest 후에 작성하면 한 번에 high-quality entity 가 나옵니다.
- 다만 사용자 요청이 "지금 만들어줘" 였으므로, **placeholder entity 라도 지금 만들어 두면** 이후 Q-NEW-01~05 의 anchor 가 되어 ingest 가 가속됩니다.

어느 옵션으로 진행할까요?
