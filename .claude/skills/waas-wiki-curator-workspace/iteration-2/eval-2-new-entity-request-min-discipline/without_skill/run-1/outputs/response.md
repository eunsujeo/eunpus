# Entity 신규 생성 — `transaction-fee-calculation` (Fireblocks)

## 핵심 요약

요청하신 entity (`entities/fireblocks/transaction-fee-calculation.md`)를 만들어드립니다. 단, 본 위키의 evidence isolation 룰에 따라 **Fireblocks 공식 자료로 확정된 내용**과 **LLM 일반 지식 / EVM 표준 (EIP-1559 등)** 을 절대 혼합하지 않습니다.

현재 waas-wiki 의 curated 영역에서 fee 계산 관련해 확보된 evidence 는 **매우 얇습니다**:

- **확정 fact**: KSM (Substrate fee 모델 + API 가 network fee 만 반환) + DOT (min balance + 2h valid window) + EVM Boost/Drop/RBF gas parameter 동사 + dApp Protection 의 contract simulation 시 final value + fee 표시 — 이 4개 cluster.
- **catalog-only**: `supported-blockchain-networks.md` 의 chain entry 마다 "Fees are paid using <fee asset>" 메타 (asset ID 까지) 형식 — 100+ chain 의 fee asset 목록 자체는 raw PDF 에 있고 curated 본문에는 미인입.
- **명시적 TIER 3 보류**: Stage 9 의 ~30건 chain-specific fees + Stage 10 의 ~240건 (Gas Station / Gasless / fees 포함) — Source Lake raw 보관 상태. **본문 미로드.**

→ 따라서 신규 entity 는 **"fee 계산 로직의 완전한 명세"가 아니라 "현재 evidence 가 다루는 vocabulary + 명시적 gap 인덱스"** 가 됩니다. 추측·일반론으로 본문을 채우면 안 됩니다.

---

## 운영 상세 — 생성할 entity 본문

**파일 경로**: `entities/fireblocks/transaction-fee-calculation.md`

```markdown
# Entity: Transaction Fee Calculation (Fireblocks)

## Summary

Fireblocks workspace 에서 트랜잭션 비용(gas fee / network fee / tip)을 결정하는 메커니즘. 본 위키의 curated 영역에서 확인된 사실은 **(1) chain-별로 fee 모델이 다르고 fee asset 도 다름** (catalog meta), **(2) Substrate 계열 (KSM) 은 API 가 network fee 만 반환하여 tip 합산이 client 책임**, **(3) EVM 은 Boost/Drop/RBF 의 gas parameter 동사가 트랜잭션 lifecycle 에 명시**, **(4) dApp Protection 단계에서 contract simulation 의 최종 value + fee 가 signer 에 표시**된다는 것이다. **chain-별 fee 산정식·gas estimation 알고리즘·EIP-1559 priority fee 처리·내부 oracle·markup 정책 등은 본 위키의 curated 영역에 미인입** (Stage 9/10 의 TIER 3 보류, Source Lake raw 보관).

## Key Concepts (verb vocabulary)

본 위키의 curated 영역에서 확인되는 fee 관련 vocabulary:

- **Fee asset (per chain)** — `supported-blockchain-networks.md` 의 chain entry 메타: "Fees are paid using <fee asset> (Fireblocks asset ID: <mainnet ID>, <testnet ID>)" (`blockchains.md`, p.117 정의 형식)
- **Estimate required fee (API)** — Substrate 계열은 network fee 만 반환, tip 별도 (`kusama-transaction-fee-estimation.md`, p.1)
- **Tip** — KSM 의 경우 Console 은 tip 만 표시, 총합 = fee/byte × network fee + tip (`kusama-transaction-fee-estimation.md`, p.1)
- **Boost EVM tx** / **Drop EVM tx** — EVM gas parameter 조작 동사 (`transaction-lifecycle.md`, p.2)
- **Boost UTXO tx** — UTXO chain 의 fee bump (`transaction-lifecycle.md`, p.2)
- **Replace-By-Fee (RBF)** — EVM Broadcasting 단계 fee 교체 (`transaction-lifecycle.md`, p.2)
- **Final value + fee (preview)** — dApp Protection 의 contract call simulation 에서 vault asset 영향 + final value + fee 를 signer 에 노출 (`primary-transaction-statuses.md`, p.3)

## Details

### Chain 별 fee 모델 — 확정된 cluster

| Chain | Fee 모델 (확정) | 비고 | Source |
|---|---|---|---|
| KSM (Substrate) | `fee/byte × network fee + optional tip` | Console = tip 만 입력; API "Estimate required fee" = network fee 만 반환 → **client 가 tip 더해 총합 전송 책임** | `kusama-transaction-fee-estimation.md`, p.1 |
| DOT | (fee 계산식 자체는 curated 영역 미명시) | 별개 제약: 첫 입금 ≥ 0.01 DOT (reaped → replay 위험), tx 2h valid window | `polkadot-dot-minimum-balance-and-fee-estimation.md` (placeholder) |
| EVM (전반) | (gas 산정식 자체는 curated 영역 미명시) | 동작 vocabulary: Boost / Drop / RBF 존재 | `transaction-lifecycle.md`, p.2 |
| BTC / UTXO | (fee/byte 모델 자체는 curated 영역 미명시) | Boost UTXO tx 동사 + 25-tx unconfirmed input chain limit | `transaction-lifecycle.md`, p.2 + `account-and-wallet-structure.md`, p.6-7 |
| 그 외 100+ chain | catalog 만 존재 (fee asset + asset ID) | 본문 미인입 | `supported-blockchain-networks.md` (raw PDF) |

### dApp Protection 의 fee preview

`primary-transaction-statuses.md`, p.3 — Pending Security Screening 단계의 enrichment 3 type 중 **"Contract calls on Ethereum"** 항목에서:

- contract simulation 후 vault asset 영향 + **final value + fee** 가 signer 화면에 표시
- 즉 fee 가 **signer 의사결정 surface 의 일부**로 노출 (advisory)
- 산정 메커니즘(어떤 estimator, 어떤 gas tier) 은 본 자료에서 미명시

### Fee 와 트랜잭션 lifecycle 의 접점

`transaction-lifecycle.md`, p.2 의 status-별 가능 operation 중 fee-mutating 액션:

- **Boost / drop EVM tx** — EVM gas parameter 조작
- **Boost UTXO tx**
- **Replace-By-Fee (RBF)** — EVM **Broadcasting** 단계에서 가능

이 동사들은 [[entities/fireblocks/transaction]] 의 Transaction Operations by Status 표에서도 동일하게 등장.

### Client 책임 vs Fireblocks 책임 (현재 evidence 한정)

- **Client 책임 (확정 사례 1건)**: KSM tip 합산 → API 가 network fee 만 주므로 client 가 tip 더해 총합 전송
- **Fireblocks 측 처리 (확정 사례 1건)**: DOT 의 경우 wallet 의 0.01 DOT 미만 하강을 Fireblocks 가 방지 (fee 와 직접 관련은 아니나 fee-induced balance 하강 시나리오에 함의)
- **그 외 chain 의 산정 책임 분할은 본 위키 curated 영역에 미명시.**

## Open Questions

- **Q-2026-05-21-F01** — EVM gas estimation 의 책임 모델 (Fireblocks oracle vs node provider vs client param). Boost/Drop/RBF 시 새 gas parameter 의 입력 surface 와 검증 룰은 어디서 정의되는가? `transaction-lifecycle.md` 본문 + Stage 9 TIER 3 보류군 (~30건 chain-specific fees) 에서 추가 ingest 필요. Status: **open**.
- **Q-2026-05-21-F02** — EIP-1559 priority fee / base fee 분리 모델을 Fireblocks 가 어떻게 다루는가? Boost 가 base 만 올리는지, priority 만 올리는지, 둘 다인지 본 위키에 명시되지 않음. Status: **open**.
- **Q-2026-05-21-F03** — Gas Station / Gasless feature (Stage 10 TIER 3 catalog 에 명시됨) 가 본 entity 와 어떻게 연결되는가? Gas Station 이 fee asset 을 워크스페이스 외부에서 공급한다면 fee 계산 surface 자체가 달라짐. Source Lake catalog 만 존재, 본문 미인입. Status: **open**.
- **Q-2026-05-21-F04** — `supported-blockchain-networks.md` raw PDF 의 100+ chain fee asset 매핑을 curated table 로 승격할 가치가 있는가? 현재는 catalog meta 형식만 `blockchains.md` 에 인용. Status: **open** (lazy-load policy 에 따라 사용자 요청 시 승격).
- **Q-2026-05-21-F05** — Boost UTXO tx 의 fee 계산 (RBF on UTXO) 메커니즘 본 위키 미명시. Status: **open**.

## Related Pages

- [[entities/fireblocks/transaction]] — Boost/Drop/RBF 동사 + dApp Protection fee preview 의 1차 출처
- [[vendors/fireblocks/blockchains]] — Chain-별 fee asset catalog + KSM/DOT placeholder
- [[entities/fireblocks/policy]] — Policy 에 fee 상한·gas tier rule 이 존재하는지는 본 위키 미명시 (별도 ingest 필요)
- [[open-questions/fireblocks]] — F01–F05 등록

## Sources

### Curated (본 entity 작성 시점에 본문에 인입된 evidence)

- `2026-05-18__support-fireblocks-io__kusama-transaction-fee-estimation.md`, p.1 (placeholder, Substrate fee 모델)
- `2026-05-18__support-fireblocks-io__polkadot-dot-minimum-balance-and-fee-estimation.md` (placeholder, fee 직접 산정식 미포함)
- `2026-05-18__support-fireblocks-io__transaction-lifecycle.md`, p.2 (Boost/Drop/RBF 동사)
- `2026-05-18__support-fireblocks-io__primary-transaction-statuses.md`, p.3 (dApp Protection final value + fee preview)
- `2026-05-18__support-fireblocks-io__supported-blockchain-networks.md`, catalog meta 형식 (`blockchains.md` p.117 경유)
- `2026-05-18__support-fireblocks-io__account-and-wallet-structure.md`, p.6-7 (BTC 25-tx chain limit, fee bump 의 운영 함의)

### Source Lake raw (미인입, lazy-load 대상)

- Stage 9 TIER 3 ~30건 (chain-specific fees + UI ops + substatuses)
- Stage 10 TIER 3 ~240건 중 Gas Station / Gasless / Smart Transfers / fees 카테고리
```

---

## 확정 사실 vs 가설

### 확정 (Fireblocks 공식 자료)

- KSM 의 `fee/byte × network fee + tip` 모델, API 가 network fee 만 반환
- DOT min balance 0.01 + 2h valid window
- EVM 의 Boost / Drop / RBF 동사 존재
- UTXO 의 Boost 동사 존재
- BTC 25-tx unconfirmed chain limit
- dApp Protection 단계의 contract simulation 에서 final value + fee 가 signer 에 표시
- chain entry 메타가 "Fees are paid using <fee asset>" 형식

### 가설 (본 entity 본문에 적지 않음, Open Q 로만 등록)

- EVM gas estimation 의 책임 모델 (oracle 위치)
- EIP-1559 base/priority fee 분리 처리 방식
- Gas Station / Gasless 의 fee asset 공급 흐름
- chain-별 100+ fee asset 매핑 (catalog raw 에 있으나 curated 미승격)

---

## 답 가능 범위

본 위키의 curated 영역만으로 **답할 수 있는 것**:

1. "Fireblocks 가 fee 계산 책임을 client 에 넘기는 사례가 있는가?" → **있음 (KSM tip)**.
2. "EVM tx 의 fee 를 사후에 올리는 메커니즘이 있는가?" → **있음 (Boost / RBF)**.
3. "signer 가 트랜잭션 승인 시 fee 를 확인할 수 있는가?" → **dApp Protection 거친 contract call 한정 으로 확정. 일반 transfer 의 fee 표시 여부는 본 위키 미명시.**
4. "chain 별 fee asset 이 다른가?" → **그렇다 (catalog meta 형식으로 확정), 단 매핑 표는 curated 미승격.**

답할 수 **없는** 것 (Q-F01~F05 로 명시 등록 필요):

- 구체적 gas estimation 알고리즘 / oracle
- EIP-1559 base vs priority 처리
- Gas Station / Gasless feature
- Boost 입력 surface · 검증 룰
- 100+ chain 의 개별 fee 산정식

---

## Promote 필요 (사용자 결정 사항)

본 entity 를 실제로 위키에 반영하려면 다음 4 곳의 후속 update 가 필요합니다 (본 응답은 entity 본문만 제시):

1. **`entities/fireblocks/transaction.md`** — `Related Pages` 에 `[[entities/fireblocks/transaction-fee-calculation]]` 추가, Stage 9 의 "Transaction Operations by Status" 표의 Boost/Drop/RBF 항목에 cross-ref 추가.
2. **`vendors/fireblocks/blockchains.md`** — `Related Pages` 에 신규 entity link 추가, KSM/DOT placeholder 행에 cross-ref.
3. **`open-questions/fireblocks.md`** — Q-2026-05-21-F01 ~ F05 신규 등록 (현재 카테고리 코드에 **F (Fee)** 신설 필요).
4. **`log.md`** — `## [2026-05-21] entity-new | fireblocks | transaction-fee-calculation entity 생성 (Stage 18 ?)` append.

또한 **operating-principles** 측면에서 한 가지 결정 필요:

- 본 위키는 Stage 6–17 동안 **연속 11 stage 신규 entity 0** 을 유지하며 "fee 같은 cross-cutting 토픽은 별도 entity 로 만들지 않고 transaction / blockchains 에 흡수" 라는 묵시적 룰을 따라왔습니다. 사용자 요청에 따라 본 entity 를 신설하면 **그 룰을 명시적으로 깨는 결정** 입니다. 추천: 신설하되 **`Status: minimal stub + gap index`** 를 명시하여 향후 TIER 3 lazy-load 시 채워나갈 anchor 로 사용.

---

## 추천 / 운영 힌트

1. **본 entity 는 "evidence index" 로 출발하는 것을 권장** — 현재 fee 산정 로직 자체는 curated 영역에 거의 없음. "있다고 가정하고 채우기" 대신 "어디까지 evidence 가 있고 어디부터 raw lazy-load 가 필요한지" 를 명시하는 anchor 페이지로 운영.

2. **신규 카테고리 F (Fee) 등록 권장** — Open Questions 카테고리 (G/M/C/P/W/O/L/A/AU/D/S/B) 에 **F** 추가. fee 관련 Q 가 5건 한꺼번에 등장하므로 카테고리 신설이 타당.

3. **Lazy-load 우선순위 제안 (사용자 confirm 필요)**:
   - 가장 운영 임팩트 큰 1건만 먼저 ingest: **"Gas Station"** 관련 raw (Stage 10 TIER 3) — fee asset 공급 모델이 바뀌면 본 entity 의 "Client 책임 vs Fireblocks 책임" 섹션이 통째로 재구성됨.
   - 그 다음 우선순위: EVM Boost/RBF 의 입력 parameter 명세 (Q-F01 + F02 동시 해결 가능성).

4. **다른 vendor (nodeinfra 등) 의 fee 모델과의 비교는 본 entity 에 넣지 말 것** — evidence isolation 룰. 별도 비교 페이지 (예: `reference-architecture/fee-models-compared.md`) 로 분리.

5. **본 응답에서 생성한 markdown 은 위키에 직접 쓰지 않았습니다** (룰: `Do NOT modify any file in waas-wiki/ except the output`). 사용자가 위 본문을 검토 후 실제 위키에 반영할지 결정해 주세요.
