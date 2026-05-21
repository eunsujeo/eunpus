# 분석 보고 — 신규 entity `transaction-fee-calculation` 제안에 대한 검토

> Trigger 2 (wiki 수정 요청) — "새 entity 만들어줘" 매칭.
> Operational Discipline: **"신규 entity 생성 최소화 — 기존 entity / vendor hub 에 흡수 가능한지 먼저 점검"** + **"curated wiki 자동 수정 금지 — diff 보여주고 승인 후만"** 적용.
> → **자동 생성하지 않고 분석 보고 + 승인 대기**로 응답합니다.

---

## 1. 핵심 요약 (10초)

- **신규 entity 생성을 권장하지 않습니다.** "gas fee / network fee 계산 로직"은 entity (고유 이름의 명사) 가 아닌 **cross-cutting topic** (여러 chain × 여러 stage 에 걸친 절차) 입니다.
- 현재 wiki 에 해당 주제의 **공식 근거(Fireblocks source)는 chain-specific 2건만 존재** — Kusama, Polkadot 의 fee estimation. 일반 EVM gas / EIP-1559 / priority fee 등의 Fireblocks 공식 근거는 **현재 wiki 에 없음**.
- 따라서 entity 1개를 새로 만들면 "본문에 fact 가 거의 없는 빈 페이지" 가 되고, **추측으로 채울 위험** → Step 6 (fact/hypothesis separation) 위반 가능성 높음.
- **권장 처리**: (a) `vendors/fireblocks/blockchains.md` 의 `Fee Estimation` 섹션 확장 + (b) `entities/fireblocks/transaction.md` 의 fee 관련 행 보강 + (c) 신규 source ingest 필요분은 **open-questions** 로 빼기.

---

## 2. 운영 상세 — 기존 wiki 점검 결과

### 2.1 wiki grep 결과 (4-source 전수)

| 위치 | 발견 내용 | 비고 |
|---|---|---|
| `entities/fireblocks/transaction.md` L118, L151, L155, L161 | "gas station → Broadcasting", "Boost/drop EVM tx (EVM gas parameter)", "Replace-By-Fee (RBF) for EVM", "contract simulation … final value + fee 표시" | 4 mention, 모두 1줄짜리 — fee 계산 로직 자체는 미상세 |
| `entities/fireblocks/workspace.md` L130, L134 | "Treasury / Withdrawal / Gas Station Vault 권장", "Gas Station vault = `balance < gasThreshold && new token transferred` 시 자동 base asset 충당" | Gas Station vault 의 trigger 조건만 (계산 공식 X) |
| `vendors/fireblocks/blockchains.md` L62, L117, L133, L136, L175 | Polkadot 1 DOT minimum, "Fees are paid using `<fee asset>`" 일반 패턴, **KSM**: `Fee = fee/byte × network fee + tip; API는 network fee만 반환`, **DOT**: `0.01 미만 시 reaped + replay attack 위험; tx 2시간 valid` | 유일한 **공식 fee 계산 공식**은 KSM 1건 |
| `sources/fireblocks/markdown/` | `2026-05-18__support-fireblocks-io__kusama-transaction-fee-estimation.md`, `2026-05-18__support-fireblocks-io__polkadot-dot-minimum-balance-and-fee-estimation.md` | 2건만 |
| `open-questions/fireblocks.md` | fee 관련 open Q **없음** | 등록 자체가 안 됨 |
| Stage 15 sitemap / catalog | grep 결과 fee/gas 추가 source 미식별 | (재확인 필요 시 사용자가 promote) |

### 2.2 entity 적합성 평가

skill 의 `prompts/extract-entities.md` entity 정의:
> "이 벤더 문맥에서 **고유 이름**을 갖고 **반복적으로 등장**하는 **명사**"

`transaction-fee-calculation` 은:
- 고유 이름인가? — **아니오**. "fee calculation" 은 일반 동작어. Fireblocks 가 특정 명칭을 부여한 적이 없음 (cf. `Vault Account`, `Cosigner`, `Callback Handler`, `Gas Station`).
- 반복 등장하는 명사인가? — **간접적으로만**. 위 표의 mention 4건 모두 다른 entity (transaction, workspace, blockchains hub) 의 일부로 등장.
- "Gas Station" 은 이미 entity 후보 가치가 있지만 `entities/fireblocks/workspace.md §"Gas Station Vault"` 에서 다루고 있음.

→ **entity 가 아니라 vendor hub 의 sub-section** 이 적절.

---

## 3. 확정 vs hypothesis 분리

### 확정 fact (wiki 에 인용 가능한 출처 있음)

- (source: `vendors/fireblocks/blockchains.md` L133) **KSM**: `Fee = fee/byte × network fee + tip; API는 network fee만 반환`
- (source: `vendors/fireblocks/blockchains.md` L136) **DOT**: `0.01 미만 시 reaped + replay attack 위험; tx 2시간 valid`
- (source: `vendors/fireblocks/blockchains.md` L117) 패턴: `Fees are paid using <fee asset> (Fireblocks asset ID: <ID for mainnet, ID for testnet>)`
- (source: `entities/fireblocks/transaction.md` L151, L155) EVM: **Boost / drop**, **Replace-By-Fee (RBF)** 지원
- (source: `entities/fireblocks/workspace.md` L134) **Gas Station vault trigger**: `balance < gasThreshold && new token transferred` → 자동 base asset 충당
- (source: `entities/fireblocks/transaction.md` L161) Ethereum contract calls: contract simulation 후 fee 표시

### Hypothesis (LLM 일반 지식 — 본문 금지)

> 이하는 **Fireblocks 공식 근거 wiki 에 없음**. 사용자가 promote 승인 + source ingest 후에만 본문 fact 로 격상 가능.

- [unverified — 사전학습 기반, 1차 자료로 확인 필요] EVM 에서 EIP-1559 `maxFeePerGas` + `maxPriorityFeePerGas` 를 Fireblocks 가 어떤 알고리즘으로 계산 / suggest 하는가
- [unverified] UTXO chain (BTC/LTC) 의 fee/byte (sat/vB) 산정 로직 — high/medium/low preset 의 source
- [unverified] Boost / drop EVM tx 의 정확한 동작 (replace tx hash, gasPrice 증가율, 재서명 절차)
- [unverified] Cosmos / Tron / Solana 등 non-EVM/non-UTXO chain 의 fee asset / 계산식
- [unverified] Fee estimation API endpoint, response schema, polling 주기
- [unverified] Multi-sig / smart-contract wallet 에서 fee asset 가 sender 와 다를 때 처리
- [unverified] Gas Station vault 의 `gasThreshold` 결정 / 변경 / 채울 양 결정 로직

→ 신규 open-question 후보 (8건 — Section 5).

---

## 4. 답 가능 범위

| 영역 | wiki cover 여부 |
|---|---|
| KSM fee 계산식 (정확한 1줄) | ★ Cover |
| DOT minimum balance + reaped 위험 | ★ Cover |
| EVM RBF / Boost / Drop 존재 사실 | ★ Cover (1줄, 절차 미상세) |
| Gas Station vault trigger 조건 | ★ Cover |
| EVM gas 가격 추정 알고리즘 | ✗ Not covered |
| UTXO sat/vB 추정 | ✗ Not covered |
| 일반 fee asset 매핑 (chain → fee asset ID 표) | ✗ Not covered (template 만 존재) |
| API spec (fee estimation endpoint) | ✗ Not covered |

→ 사용자 query 의 진짜 충족치 (gas fee / network fee 계산 **로직** 전반 정리) 와 wiki cover 사이에 **상당한 gap** 존재.

---

## 5. Promote 필요 — 권장 처리 방안 (3 option)

### Option A — 신규 entity 생성 **반려** + vendor hub 확장 (★ 권장)

**이유**: 현재 fact base 가 빈약 (KSM 1건, EVM 기능 mention 4건). entity 생성 시 본문이 hypothesis 로 채워질 위험.

**제안 변경 (승인 대기 — 자동 실행 안 함)**:

```diff
# vendors/fireblocks/blockchains.md
@@ ## Details / ### Fee Estimation @@
+ #### Fee Calculation Logic (per-chain canonical reference)
+
+ Cross-cutting topic. 각 chain 의 fee 계산식 / fee asset / 추정 동작을 한 곳에서 통합.
+
+ | Chain Family | Fee Model | 출처 (curated) | Status |
+ |---|---|---|---|
+ | EVM (ETH, BSC, Polygon, …) | EIP-1559 maxFee + maxPriorityFee; Boost/Drop/RBF 지원 | [[entities/fireblocks/transaction#Broadcasting]] L151-L155 | partial — 알고리즘 미상세 |
+ | UTXO (BTC, LTC, BCH) | sat/vB; preset (high/med/low) | (wiki 미확정) | open Q (신규) |
+ | KSM | `Fee = fee/byte × network fee + tip`; API 는 network fee 만 반환 | [kusama-transaction-fee-estimation](../../sources/fireblocks/markdown/2026-05-18__support-fireblocks-io__kusama-transaction-fee-estimation.md) | ★ confirmed |
+ | DOT | min 0.01 (reaped + replay risk); tx 2h valid | [polkadot-dot-minimum-balance-and-fee-estimation](../../sources/fireblocks/markdown/2026-05-18__support-fireblocks-io__polkadot-dot-minimum-balance-and-fee-estimation.md) | ★ confirmed |
+ | Cosmos / Tron / Solana / … | (wiki 미확정) | — | open Q (신규) |
+
+ Gas Station 의 자동 충당 동작은 [[entities/fireblocks/workspace#Gas Station]] 참조.
```

```diff
# entities/fireblocks/transaction.md (Related Pages 보강)
+ - [[vendors/fireblocks/blockchains#Fee Calculation Logic]]
```

```diff
# entities/fireblocks/workspace.md (Gas Station 섹션 끝)
+ Fee 계산 자체는 [[vendors/fireblocks/blockchains#Fee Calculation Logic]] 참조.
```

★ Step 3 양방향 wikilink, Step 5 invariant (canonical 1곳 = `blockchains.md`) 준수.

### Option B — entity 생성 **하되 stub + open-question 명시**

만약 사용자가 entity 형식을 꼭 원한다면:

- 파일: `entities/fireblocks/fee-calculation.md` (★ `transaction-fee-calculation` 보다 짧고 entity-naming convention 정합 — 기존 entity 명은 `transaction.md`, `vault-account.md` 등 명사형)
- 6-section 골격은 만들되 **Details 는 거의 비고 Summary + Sources + Open Questions 가 본문 대부분** 이 됨
- 위험: "본문 주장이 없는 entity" → Step 7 lint `## Sources 가 있는데 본문이 비어있나` 잠재 위반

→ **비권장**. 단, 사용자가 향후 EVM/UTXO source ingest 를 적극 계획 중이라면 placeholder 가치는 있음.

### Option C — 신규 source ingest 먼저, 그 후 entity 결정

가장 정석. `sources/fireblocks/` 에 EVM gas / UTXO sat-per-byte / Fee estimation API doc 을 먼저 promote (Mode B → C) → 본문 fact 가 5+ bullet 확보 후 entity 승격.

후보 source URL (사용자 검토 필요):
- `developers.fireblocks.com` — fee estimation API ref
- `support.fireblocks.io` — Boost/drop EVM tx, RBF 절차 article
- support 의 chain-specific fee article 시리즈 (Bitcoin, Ethereum gas, Tron energy/bandwidth 등)

---

## 6. 추천 / 운영 힌트

### 최종 추천

**Option A (vendor hub 확장)** 채택.
이유 요약:
1. 현재 confirmed fact (4-5건) 는 entity 단독 페이지로 분리할 critical mass 미달.
2. fee 계산은 **chain-별 분기 매트릭스** — table 형 표현이 entity 형 표현보다 진정성 있음.
3. canonical 1곳 (=`blockchains.md`) + `transaction.md` / `workspace.md` 에서 wikilink 만 → Step 5 invariant 원칙 정합.
4. 추후 source ingest 5+ 누적 시 entity 로 **승격** (promote-on-evidence) 가능 — wiki 의 자연 성장 패턴.

### 신규 open-questions 등록 제안 (8건 — `open-questions/fireblocks.md`)

```diff
+ ### Fee Calculation (Stage NN에서 추가)
+
+ ### Q-2026-05-20-F01: Fireblocks 의 EVM EIP-1559 fee estimation (maxFee / maxPriorityFee) 알고리즘?
+ - Status: open
+ - Evidence: wiki 미확정. `entities/fireblocks/transaction.md` L151 "Boost/drop EVM tx (EVM gas parameter)" 만 존재.
+
+ ### Q-2026-05-20-F02: EVM Boost / Drop / RBF 의 동작 (nonce, gasPrice 증가율, 재서명) 절차?
+ - Status: open
+ - Evidence: `entities/fireblocks/transaction.md` L155 RBF 지원 사실만.
+
+ ### Q-2026-05-20-F03: UTXO chain (BTC/LTC/BCH) 의 fee/byte (sat/vB) 추정 preset?
+ - Status: open
+ - Evidence: wiki 0건.
+
+ ### Q-2026-05-20-F04: Cosmos / Tron / Solana / Aptos / Sui 등 non-EVM/non-UTXO chain 의 fee asset 매핑?
+ - Status: open
+ - Evidence: blockchains.md L117 의 template (`Fees are paid using <fee asset>`) 만, 실 매핑 표 없음.
+
+ ### Q-2026-05-20-F05: Fee estimation API endpoint / response schema / polling 주기?
+ - Status: open
+ - Evidence: wiki 0건.
+
+ ### Q-2026-05-20-F06: Gas Station vault 의 `gasThreshold` 결정 + 자동 충당량 결정 로직?
+ - Status: open
+ - Evidence: `entities/fireblocks/workspace.md` L134 trigger 조건만, 양 결정 미상세.
+
+ ### Q-2026-05-20-F07: Solana priority fee / compute unit price 의 Fireblocks 추정?
+ - Status: open
+ - Evidence: wiki 0건.
+
+ ### Q-2026-05-20-F08: Multi-sig / smart-contract wallet sender ≠ fee payer 패턴의 처리?
+ - Status: open
+ - Evidence: wiki 0건.
+```

### log.md entry 한 줄 제안 (승인 후 추가)

```
## Stage NN (2026-05-20) — Fee calculation topic scoping
- request: 신규 entity `transaction-fee-calculation` 제안
- decision: 신규 entity 반려 — Option A (vendors/fireblocks/blockchains.md §"Fee Calculation Logic" 확장) 채택
- 신규 open-questions: +8 (Q-2026-05-20-F01..F08)
- 영향받은 페이지: vendors/fireblocks/blockchains.md, entities/fireblocks/transaction.md, entities/fireblocks/workspace.md (양방향 link)
- 신규 entity: 0 (사유: critical mass 미달 — fact 5건, 그 중 confirmed 공식 근거 2건뿐)
```

---

## 승인 요청

다음 중 어떤 경로로 진행할까요?

1. **Option A 진행** — `blockchains.md` 에 `## Fee Calculation Logic` 섹션 추가 + 2개 entity 에 wikilink + 8 open-question 등록 + log.md entry. (★ 권장)
2. **Option B 진행** — `entities/fireblocks/fee-calculation.md` stub entity 생성 (Sources 2건 + Open Questions 8건이 본문 대부분).
3. **Option C 진행** — 먼저 source ingest 부터. ingest 할 URL/PDF 를 제공해 주세요.
4. **사용자 의도 재확인** — "transaction-fee-calculation" 이 entity 단독 페이지가 아니라 다른 형식 (예: vendor hub sub-section, docs/architecture/ 한 파일, persistence-architecture sub-doc) 이어도 되는지?

각 option 모두 **diff 를 한 번 더 보여드리고 사용자 승인 후에만** 파일 수정합니다 (operating-principles v3.2.2 §"curated wiki 자동 수정 금지").
