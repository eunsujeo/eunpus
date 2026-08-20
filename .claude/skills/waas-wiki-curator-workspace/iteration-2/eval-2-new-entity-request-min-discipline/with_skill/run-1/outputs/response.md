> **Trigger 판별**: Trigger 2 (wiki 수정 요청 — 신규 entity) — "Fireblocks 의 새 entity 만들어줘"
> **단계**: SKILL.md 7-step workflow Step 3-7 + ★ "신규 entity 요청 시 default 동작 = 거절 + 흡수 분석"
> **운영 위임**: prompts/extract-entities.md (entity 후보 평가) + prompts/update-wiki.md (흡수 절차)
> **상태**: dry-run — 사용자 승인 전까지 어떤 파일도 생성/수정 안 함. 신규 entity 생성 보류 (default refusal).

---

## 결론 (10 초 이해)

신규 entity **`transaction-fee-calculation`** 생성은 **기본 거절**합니다 (SKILL.md "신규 entity 생성 최소화" + entity-min discipline). 흡수 분석 결과 — 해당 주제는 wiki 내 **3 개 기존 spine 에 자연스럽게 분산 흡수 가능**하며, 현재 wiki 의 confirmed evidence 는 **chain-specific fee 운영 detail 1-2 건 (Kusama, Polkadot)** 수준이라 독립 entity 를 만들 만한 cross-cut canonical 가 형성되어 있지 않습니다. 추가로, fee 계산 로직의 대부분은 wiki 의 명시적 **TIER 3 (Source Lake raw)** 영역으로 분류되어 있어 promote 우선 필요.

draft 본문은 작성하지 않습니다 (entity-min discipline 위반).

---

## 1. 흡수 분석 — 기존 entity / vendor hub 24+16 grep 결과

| 흡수 후보 | 경로 | 현재 fee 관련 cover | 흡수 적합도 |
|---|---|---|---|
| **transaction entity** | `entities/fireblocks/transaction.md` | L151-155: "Boost / drop EVM tx (EVM gas parameter)", "Boost UTXO tx", "Replace-By-Fee (RBF) for EVM during Broadcasting" | ★★★ — fee 계산은 transaction lifecycle 의 한 단계 (Pending → Broadcasting). 신규 sub-section `## Fee Calculation` 으로 흡수가 가장 자연스러움. |
| **blockchains hub** | `vendors/fireblocks/blockchains.md` | L62/117/133/136: chain-specific fee asset / 최소 잔액 / fee 모델 (KSM: fee/byte × network fee + tip / DOT: 0.01 reaped 임계) + L175 chain-specific 12-placeholder cluster 안에 fee 관련 source 2 건 | ★★★ — chain-specific fee 모델 (EIP-1559 / UTXO / Substrate / Solana priority / TRON energy / TON 등) 의 canonical 위치. 이미 placeholder index 존재. |
| **policy entity** | `entities/fireblocks/policy.md` | L151: "Withdrawal automation (sweeping) = API Co-Signer + Policy 기반 fee 자동화" | ★ — policy-driven fee 자동화 측면만. 계산 로직 자체는 cover X. |
| **api-co-signer / callback-handler / cosigner** | `entities/fireblocks/{api-co-signer,callback-handler,cosigner}.md` | (grep 음성) | × — 직접 cover 없음. |
| **architecture / api / overview hubs** | `vendors/fireblocks/{architecture,api,overview}.md` | (grep 음성) | × — fee 전담 섹션 없음. |

**흡수 권장 매핑** (사용자 승인 시 진행):

- **계산 로직 / API / Boost/Drop/RBF / EIP-1559 vs legacy** → `entities/fireblocks/transaction.md` 의 신규 sub-section `## Fee Calculation (★)`. 6-section spine 유지.
- **Chain-specific 모델 (KSM / DOT / EVM / Solana priority / TRON / TON / UTXO)** → `vendors/fireblocks/blockchains.md` 의 기존 fee 표 확장 (L133-136). 이미 invariant 표 형태로 존재 → canonical 위치.
- **Policy 기반 fee 자동화 (sweeping / gas-station)** → `entities/fireblocks/policy.md` 의 기존 L151 줄에 `(see [[transaction#Fee Calculation]])` 양방향 link 추가.

이렇게 분산 흡수 시 **invariant Step 5 규칙 충족** (같은 fact 는 canonical 1 곳 + 다른 page 는 wikilink). 신규 entity 1 개로 만들면 transaction / blockchains / policy 와 4-way 중복이 발생해 spine 위반.

---

## 2. Evidence 깊이 평가 — confirmed vs hypothesis

**Confirmed evidence (wiki 인용 가능 fact)**

- `entities/fireblocks/transaction.md` L151-155 — Boost / drop EVM tx (EVM gas parameter), Boost UTXO tx, RBF for EVM during Broadcasting.
- `vendors/fireblocks/blockchains.md` L133 — KSM: "Fee = fee/byte × network fee + tip; API는 network fee만 반환" (source: `2026-05-18__support-fireblocks-io__kusama-transaction-fee-estimation.md`).
- `vendors/fireblocks/blockchains.md` L136 — DOT: "0.01 미만 시 reaped + replay attack 위험; tx 2시간 valid" (source: `2026-05-18__support-fireblocks-io__polkadot-dot-minimum-balance-and-fee-estimation.md`).
- `entities/fireblocks/policy.md` L151 — Withdrawal automation (sweeping) = API Co-Signer + Policy 기반 fee 자동화.
- `log.md` L302 / L407 / L487 — fee 계산 관련 source 22 건이 **TIER 3 (Source Lake raw PDF only)** 으로 명시 분류: EVM/UTXO Overview / Selecting / Validation / Rates / Net-gross / Adjusting / MaxFee / Min-gas / Ethereum-params / tx-fee-representation / withdrawal-fees / viewing-spent-fees + chain-specific (TON/TRON/Solana priority/EOS/ASTR/Cardano/XRP).
- `log.md` L4155 / L4168 — direct-build reference: "Normalize fee model (EIP-1559 / legacy / fixed → 공통 abstraction)" (architecture reasoning 문서).

**Hypothesis (LLM 일반 지식 — wiki 미인용)**

- EIP-1559 fee 구조 (baseFee + priorityFee, maxFeePerGas / maxPriorityFeePerGas 의 의미).
- gas limit 계산 / contract simulation 기반 gas estimation.
- UTXO fee = vbytes × sat/vB.
- Solana priority fee microlamports 단위, TRON energy + bandwidth 모델, TON forward fee.
- → 모두 `open-questions/fireblocks.md` 신규 Q 후보. **본문 draft 에 포함 금지** (`feedback_evidence_isolation` rule).

**Evidence 결론**: 신규 entity 를 정당화할 만한 confirmed fact 가 **현재 3-5 줄** 수준. canonical entity 가 되려면 6-section spine 의 Summary / Key Concepts / Details / Sources 4 섹션을 confirmed 만으로 채울 수 있어야 하는데, 현재 wiki 로는 Summary 1-2 문장 + Sources 2-3 줄 외에는 hypothesis 로 채워야 함 → entity-min discipline 위반.

---

## 3. 정당화 사유 요구 사항 (사용자 input 필요)

신규 entity `transaction-fee-calculation` 를 그래도 만들려면 다음 중 **하나 이상** 의 명시 정당화가 필요합니다:

1. **Cross-cut 빈도** — 3 개 이상의 기존 page 에서 fee 계산 fact 가 중복 정의되어 있음을 증명. (현재 grep 결과: transaction 1 곳, blockchains 1 곳 → invariant 임계 미달.)
2. **신규 1 차 자료 import** — fee 계산 전담 Fireblocks 공식 PDF / Help Center 페이지 promote (예: "Transaction Fees Overview", "EVM Gas Selecting", "Adjusting MaxFeePerGas" — 현재 모두 TIER 3, log.md L302/407 명시). **promote = Mode C ingest + 사용자 명시 승인** 필요.
3. **운영 use case** — wiki user 가 fee 계산을 자주 질의하고, transaction.md sub-section 으로는 navigation 이 부족하다는 운영적 근거.
4. **Architecture reasoning 분리** — Stage 32+ Architecture Reasoning Mode 에서 "fee normalization layer" 가 직접 구축 complexity 의 분리된 차원으로 다뤄져야 한다는 reasoning. (log.md L4108: "Adapter = 10 role (finality / confirmation / replacement / event / **fee** / address / tx / indexing / evidence / reconciliation)" → 이미 architecture layer 로는 인식되어 있음.)

사유 명시 + 명시 승인 시에만 진행. 그 시점에 **Stage counter reset 명시** + `log.md` 에 entry 추가 필요 (SKILL.md Step 7).

---

## 4. 답 가능 범위 / promote 필요

**현재 wiki 가 즉시 답 가능한 범위**

- transaction lifecycle 안에서 Boost / drop / RBF 가 어느 Status (Broadcasting) 에서 가능한가.
- Kusama / Polkadot 의 chain-specific fee 운영 주의점 (network fee 반환 / 0.01 reaped).
- Policy 기반 fee 자동화 = API Co-Signer + Policy 조합.
- Architecture reasoning 측면 — fee 가 chain adapter 의 10 role 중 하나라는 분류.

**현재 wiki 가 답 못 하는 범위 (promote 필요)**

- EIP-1559 vs legacy fee selection 의 Fireblocks 공식 UI / API 절차.
- `estimateFee` API endpoint spec, 응답 schema, error mode.
- maxFee / priorityFee adjustment 의 UI flow.
- UTXO net-gross 차이 / viewing-spent-fees 의 의미.
- Chain-specific 22 건 fee 운영 detail (TON / TRON / Solana priority / EOS / ASTR / Cardano / XRP / Doge / Zcash).

**Promote 후보 (TIER 3 → TIER 1)**

`log.md` L302/407/487 명시 22 건 fee 관련 자료 중 user 가 우선 promote 하고 싶은 1-3 건 지정 필요. 일괄 promote 는 entity-min + Source Lake 본문 다중 load 금지 원칙 위반.

---

## 5. 추천 / 운영 힌트

1. **권장 1 순위** — 신규 entity 보류, `entities/fireblocks/transaction.md` 안에 `## Fee Calculation` sub-section 추가 (confirmed 3-5 fact 만, hypothesis 는 open-questions 로). + `vendors/fireblocks/blockchains.md` 의 fee 표 확장. 양방향 wikilink.
2. **권장 2 순위** — Architecture reasoning 차원의 통합 reference 가 필요하다면 `entities/` 가 아니라 `docs/architecture/` D/C/E/R/T series 의 새 doc 또는 기존 doc 의 확장으로 처리 (log.md L4108 의 chain adapter 10-role 분류와 일관).
3. **promote 결정 먼저** — entity 신설 여부 결정 전에 TIER 3 fee 자료 22 건 중 우선순위 3 건 promote 를 먼저 진행하면, 그 시점에 cross-cut 빈도가 객관적으로 측정되어 신규 entity 정당화 여부가 자동 판별됨.
4. **Open Q 신규 등록 제안** — `open-questions/fireblocks.md` 에 `Q-2026-05-21-XX — Fireblocks 의 EIP-1559 / UTXO / Substrate fee 계산 모델은 공식 어디에 기술되어 있는가? (TIER 3 22 건 중 promote 대상 선정 필요)` 1 줄 추가.
5. **log.md entry 한 줄 제안** (사용자 승인 시):
   ```
   ## Stage N (2026-05-21) — transaction-fee-calculation entity 요청 거절 + 흡수 분석
   - source: (없음 — 사용자 요청만)
   - ANSWERED: (없음)
   - 영향받은 페이지: (없음 — dry-run)
   - 신규 entity: 0 (entity-min discipline; 흡수 매핑: transaction / blockchains / policy)
   ```

---

## 다음 step (사용자 input 대기)

- (A) 흡수 매핑 (transaction + blockchains + policy) 으로 진행 → 승인 시 각 page diff 작성
- (B) TIER 3 fee 자료 promote 우선순위 지정 → Mode C ingest 후 재평가
- (C) 정당화 사유 (위 §3 의 1-4 중) 명시 → 그 시점에 신규 entity 생성 + Stage counter reset

**draft 본문은 작성하지 않은 상태입니다** — entity-min discipline 준수.
