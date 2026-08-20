# 신규 PDF 3 건 ingest 분류 + 처리 절차

## 핵심 요약 (10초 컷)

| # | 파일 (slug) | 도메인 | Tier | Mode |
|---|---|---|---|---|
| 1 | `transaction-screening` (support.fireblocks.io) | Governance / Compliance (AML+Travel Rule) | **TIER 2-deferred** | **Mode A — catalog-only** |
| 2 | `compliance-overview` (support.fireblocks.io) | Governance / Compliance (overview hub) | **TIER 2-deferred** | **Mode A — catalog-only** |
| 3 | `webhook-events` (developers.fireblocks.com) | Integration / Developer API (webhook payload spec) | **TIER 2** (또는 promote 시 TIER 1 후보) | **Mode A — catalog-only** (Open Q 응답 가치 있으면 → **Mode B lightweight-index** 로 승격 고려) |

→ **3 건 모두 본문 미로드, rename + meta.yml hygiene 까지만 1차 처리.** Curated wiki (entity / hub) 수정 없음. promote 승인은 별도 단계.

---

## 분류 근거 (filename + URL 추정만, 본문 fact 추측 금지)

### 1. `2026-06-01__support-fireblocks-io__transaction-screening.pdf`
- **추정 URL**: `https://support.fireblocks.io/hc/en-us/articles/transaction-screening`
- **도메인**: Governance / Compliance. 기존 `aml-transaction-screening-and-monitoring`, `aml-transaction-screening-policy`, `transaction-screening-operations` 와 같은 cluster.
- **Tier 근거**: Governance 자체는 5 priority domain 중 하나지만, 기존 AML/Compliance/Travel Rule cluster 는 모두 `tier: 2-deferred` 로 분류되어 있음 (Stage 14, v3.1/3.2.1 catalog-first 적용). 동일 cluster 이므로 TIER 2-deferred 유지가 일관성 있음.
- **Cross-cut signal (예측 한도)**: `[[entities/fireblocks/policy]]`, `[[vendors/fireblocks/compliance]]` 와 연결될 가능성. **본문 fact 추측 금지** — "TRM Labs / Chainalysis 통합" 같은 진술은 본문 확인 전까지 금지.

### 2. `2026-06-01__support-fireblocks-io__compliance-overview.pdf`
- **추정 URL**: `https://support.fireblocks.io/hc/en-us/articles/compliance-overview`
- **도메인**: Governance / Compliance — 이름상 **hub-style overview** 일 가능성. 즉 다른 compliance 페이지로 link 가 많을 것으로 추정.
- **Tier 근거**: 동일 cluster (compliance) → TIER 2-deferred. 단, **overview 성격이라면 cluster catalog markdown 의 좋은 anchor** 가 될 수 있음 → promote 가치는 다른 compliance 파일보다 살짝 높을 수 있음 (보류 표시만).
- **Cross-cut signal**: `compliance-integrations`, `aml-transaction-screening-*`, `travel-rule-*`, `global-policy-ofac-sanctions-compliance` 등과 함께 cluster index 후보.

### 3. `2026-06-01__developers-fireblocks-com__webhook-events.pdf`
- **추정 URL**: `https://developers.fireblocks.com/docs/webhook-events` 또는 `/reference/webhook-events`
- **도메인**: Integration / Developer API (webhook event payload reference). 기존 `About webhooks & notifications`, `Audit Event webhooks & notifications`, `Configuring webhooks`, `ip-allowlisting-for-webhooks-notifications` 등과 cross-cut.
- **Tier 근거**:
  - `developers.fireblocks.com` 도메인은 5 priority domain (Workspace / Identity / Governance / Mobile-Recovery / Security) 어디에도 직격은 아님 → 기본은 TIER 2/3.
  - 단 webhook event spec 은 **Identity / Governance / Security 전반과 cross-cut** 되는 reference. Open Q (예: "Fireblocks 가 어떤 webhook event 를 발행하는가?", "TAP / Policy 변경 event 가 별도로 발행되는가?") 의 응답 후보일 가능성 → promote 시 TIER 1 으로 재분류 여지 있음.
  - 1차는 TIER 2 + **Mode A catalog-only** 로 보존, Open Q match 여부 확인 후 Mode B (lightweight-index) 로 승격.
- **Cross-cut signal**: `[[entities/fireblocks/callback-handler]]`, `[[vendors/fireblocks/callback-handler]]`, webhook 관련 hub.

---

## 처리 절차 (Mode A — 3 건 공통)

> `prompts/ingest-pdf.md` v3.2.2 Mode A 절차 + `operating-principles.md` v3.2.2 § "신규 PDF 처리 절차" 준수.

### Step 1. 파일 도착 확인 (본문 미로드)

```bash
ls -la sources/fireblocks/pdf/2026-06-01__*.pdf
```

→ 3 개 파일 존재만 확인. `Read` tool 로 PDF 직접 호출 **금지** (v3 policy).

### Step 2. Filename 기반 domain triage (이미 위에서 완료)

| 파일 | domain | tier | rationale |
|---|---|---|---|
| transaction-screening | governance / security-access (AML+Compliance+Travel Rule) | 2-deferred | 기존 AML cluster 와 동일 |
| compliance-overview | governance / security-access (AML+Compliance+Travel Rule) | 2-deferred | 동일 cluster, overview hub 성격 |
| webhook-events | integration / developer-api (cross-cut: identity, governance, security) | 2 (promote 후보) | developers.fireblocks.com 도메인, webhook spec |

### Step 3. `.meta.yml` 작성 (각 PDF 옆에 동일 stem)

#### `2026-06-01__support-fireblocks-io__transaction-screening.meta.yml`
```yaml
source_url: https://support.fireblocks.io/hc/en-us/articles/transaction-screening
downloaded_at: 2026-06-01
domain: governance / security-access (AML+Compliance+Travel Rule)
tier: 2-deferred
status: placeholder
title: "transaction-screening"
ingest_log: "Stage N (2026-05-20) — Mode A catalog-only; PDF body not loaded"
```

#### `2026-06-01__support-fireblocks-io__compliance-overview.meta.yml`
```yaml
source_url: https://support.fireblocks.io/hc/en-us/articles/compliance-overview
downloaded_at: 2026-06-01
domain: governance / security-access (AML+Compliance+Travel Rule)
tier: 2-deferred
status: placeholder
title: "compliance-overview"
ingest_log: "Stage N (2026-05-20) — Mode A catalog-only; PDF body not loaded; cluster overview anchor 후보"
```

#### `2026-06-01__developers-fireblocks-com__webhook-events.meta.yml`
```yaml
source_url: https://developers.fireblocks.com/docs/webhook-events  # 또는 /reference/webhook-events — 본문 확인 시 정정
downloaded_at: 2026-06-01
domain: integration / developer-api (cross-cut: identity, governance, security)
tier: 2
status: placeholder
title: "webhook-events"
crawl_status: not-fetched
ingest_log: "Stage N (2026-05-20) — Mode A catalog-only; PDF body not loaded; webhook event spec, promote 후보"
```

> **`Stage N`** 은 실제 ingest 시 `log.md` 의 다음 stage 번호로 치환. URL 도 본문에서 canonical URL 확인 후 fix.

### Step 4. (선택) Cluster catalog markdown 업데이트

- 기존에 `compliance` 또는 `webhooks` 관련 cluster catalog markdown 이 있다면 **신규 3 건의 파일명 + URL + domain category** 만 append.
- **본문 fact 추측 금지** — "이 페이지는 X 를 다룬다" 식 진술은 본문 확인 후만.
- 신규 catalog markdown 을 만들 경우 6-section 템플릿 (`Summary` / `Key Concepts` / `Details` / `Related Pages` / `Sources` / `Status`) 준수, 단 catalog 모드에서는 `Details` 는 "filename + URL list + cross-cut signal" 까지만.

### Step 5. `log.md` 에 stage entry 1 줄

```
## Stage N (2026-05-20) — Compliance + Webhook source 3 건 catalog (mode A)
- sources:
  - 2026-06-01__support-fireblocks-io__transaction-screening.pdf (tier 2-deferred)
  - 2026-06-01__support-fireblocks-io__compliance-overview.pdf (tier 2-deferred)
  - 2026-06-01__developers-fireblocks-com__webhook-events.pdf (tier 2, promote 후보)
- ANSWERED: 없음 (catalog-only)
- 영향받은 페이지: 없음 (curated wiki 무변경)
- 신규 entity: 0
```

### Step 6. 자동화 보조 (optional, dry-run 권장)

```bash
python3 scripts/source_triage.py                             # dry-run 으로 분류 결과 확인
python3 scripts/source_triage.py --apply-hygiene             # rename + meta.yml 자동 작성 (승인 후)
# --draft-markdown 은 TIER 1 확정 시에만, 본 batch 는 TIER 2 이므로 미사용
```

- 1차는 **dry-run** 으로 자동 분류 결과와 위 수동 분류가 일치하는지 비교.
- 불일치 시 (예: script 가 TIER 1 으로 잘못 분류) script rule 조정 또는 수동 override.

---

## 확정 vs hypothesis 구분 (★)

| 항목 | 상태 |
|---|---|
| 3 개 모두 Mode A (catalog-only) 1차 처리 | **확정** (TIER 2/2-deferred + v3.2.2 Mode A 규칙) |
| transaction-screening, compliance-overview → TIER 2-deferred | **확정** (기존 AML/Compliance cluster 와 일관) |
| webhook-events → TIER 2 (promote 후보) | **hypothesis** — webhook event spec 이 기존 Open Q 응답 후보면 TIER 1 으로 승격 가능. 본문 확인 전까지 보류. |
| 각 파일의 **본문 내용** (어떤 screening provider 가 통합되어 있는가, 어떤 webhook event type 이 있는가 등) | **wiki 에 없음 / 본문 미로드** — 답할 수 없음. Mode C promote 후만 답변 가능. |
| canonical URL | **hypothesis** — slug 기반 추정. 본문 다운로드 시 정정 필요. |

---

## promote 필요 (Mode C 가 의미 있는 경우)

다음 조건 충족 시 본 batch 의 일부를 **Mode C full ingest** 로 승격:

1. **transaction-screening / compliance-overview**: 기존 Open Q (예: "Fireblocks 의 AML screening 이 어떤 third-party 와 통합되는가?", "Travel Rule 처리가 Policy Engine 의 어느 단계에서 일어나는가?") 에 직격 응답 가능하다고 판단 → 사용자 promote 승인 + 외부 도구로 chunk 추출 후 Mode C.
2. **webhook-events**: `[[entities/fireblocks/callback-handler]]` / TAP / Policy event flow 의 spine 보강이 필요하면 → promote 1순위.

→ promote 시 절차:
1. 외부 도구 (PDF reader / OCR / LLM extractor) 로 chunk 단위 markdown 추출 → `sources/fireblocks/markdown/<same-stem>.md`
2. chunk 별 takeaway 5-15 bullet + 각 bullet 에 `(source: <filename>.md, p.N)` 출처
3. 영향받는 hub/entity 후보 분석 → 사용자 승인 후 diff 적용 (단일 파일씩)
4. 신규 entity 생성 강력 비권장 — 기존 24 entity + callback-handler / policy / compliance hub 흡수 우선 검토

---

## 추천 / 운영 힌트

- **3 건 동시 Mode A 처리** 가 가장 효율적. 본문 미로드이므로 context 소모 거의 없음.
- **webhook-events 만 별도 fast-track 후보** 로 별표: developers.fireblocks.com 도메인 source 가 wiki 에 부족하면 (현재 `webpages/developers/` 가 거의 비어 있음 — 확인 필요) 다음 sprint 우선순위 후보.
- `support-fireblocks-io__transaction-screening` 과 기존 `transaction-screening-operations`, `aml-transaction-screening-and-monitoring`, `aml-transaction-screening-policy` 3 건과의 관계는 본문 확인 시 명확히 정리 (overlap / supersede / 보완) → 그 시점에 cluster catalog markdown 작성.
- 처리 전 **사용자 승인 대기**: 위 step 3 (meta.yml 작성) 부터는 file 수정이므로 v3.2.2 출력 규약상 승인 필요.

→ 위 분류 + 절차에 대한 사용자 confirm 후 실제 rename + meta.yml + log entry 진행하면 됨. promote 여부는 별도 결정.
