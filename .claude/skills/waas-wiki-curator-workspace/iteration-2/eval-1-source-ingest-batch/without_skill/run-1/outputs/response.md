# 신규 PDF 3 종 ingest 분류 및 처리 절차

운영 정책 기준: `prompts/ingest-pdf.md` v3.2.2 + `prompts/operating-principles.md` v3.2.2.
PDF 본문은 **절대 직접 read 하지 않음** — filename / URL / host / slug 기반 triage 만 수행.

---

## 1. 핵심 결론 (3 줄)

- **3 개 모두 5 priority domain 직격** (Governance + Security/Access Control + Identity/Auth) → tier 1 후보.
- **3 개 모두 Mode B (lightweight-index)** 로 처리. **본문 deep ingest (Mode C) 는 사용자 promote 승인 전까지 보류**.
- 본 작업 단계에서 **curated wiki (vendors/ + entities/) 는 수정하지 않음** — Source Lake hygiene 만 진행.

---

## 2. 파일별 모드 분류 및 근거

### File 1 — `2026-06-01__support-fireblocks-io__transaction-screening.pdf`

| 항목 | 값 |
|---|---|
| Host | `support.fireblocks.io` (Help Center) |
| Slug | `transaction-screening` |
| Domain | **Governance + Security/Access Control** (AML / Compliance plane) |
| Tier | **TIER 1** |
| Mode | **B — lightweight-index** |

**Why TIER 1 / Why Mode B**:
- Compliance plane 의 핵심 hub. 기존 cluster (Stage 14 의 `aml-compliance-cluster-catalog`, `aml-transaction-screening-and-monitoring`, `compliance-integrations`) 와 동일 도메인.
- 기존 `vendors/fireblocks/compliance.md` hub + `entities/fireblocks/policy.md` (AML configuration plane) 의 spine 강화 후보.
- 단 본문 fact 가 없는 현 시점에서 deep ingest 는 보류 — promote 승인 후 Mode C 로 승격.

**Cross-cut Signal (★ 추측 금지, filename/host 기반만)**:
- `transaction-lifecycle.md` 14-step schematic 의 Step 5b (Screening Service) 와 직접 연결 후보
- 기존 `2026-05-19__support-fireblocks-io__aml-transaction-screening-and-monitoring.pdf` + `transaction-screening-operations.pdf` 와 같은 cluster — 본문 비교 필요시 cluster 단위 promote 권장
- Q-S03 (AML Transaction Screening Policy) 응답 후보

---

### File 2 — `2026-06-01__support-fireblocks-io__compliance-overview.pdf`

| 항목 | 값 |
|---|---|
| Host | `support.fireblocks.io` (Help Center) |
| Slug | `compliance-overview` |
| Domain | **Governance** (Compliance plane meta) |
| Tier | **TIER 1** |
| Mode | **B — lightweight-index** |

**Why TIER 1 / Why Mode B**:
- "Overview" slug → compliance plane 의 entry hub 일 가능성. 기존 `compliance-integrations` 와 유사 위계의 meta 문서.
- `vendors/fireblocks/compliance.md` hub 의 1차 anchor 후보.
- File 1 (transaction-screening) 과 함께 들어왔으므로 **batch 단위 cluster 형성 가능** — 단, 현재 batch 크기 (3 개) 는 cluster catalog 임계치 (≥10) 미만이므로 Mode A 가 아닌 개별 Mode B.

**Cross-cut Signal**:
- 기존 cluster (`aml-compliance-cluster-catalog`) 의 sibling — 향후 cluster catalog 재편 후보
- `vendors/fireblocks/compliance.md` overview 강화 후보
- Q-S03 (AML Transaction Screening Policy) + 잠재적 Travel Rule 관련 Open Q 응답 후보

---

### File 3 — `2026-06-01__developers-fireblocks-com__webhook-events.pdf`

| 항목 | 값 |
|---|---|
| Host | `developers.fireblocks.com` (Developer Docs / API reference) |
| Slug | `webhook-events` |
| Domain | **Identity/Auth + Security/Access Control** (Callback / Webhook plane) |
| Tier | **TIER 1** |
| Mode | **B — lightweight-index** |

**Why TIER 1 / Why Mode B**:
- developer docs host 의 webhook reference — 기존 `entities/fireblocks/callback-handler.md` + `vendors/fireblocks/callback-handler.md` + `vendors/fireblocks/lifecycle-events.md` spine 의 직접 강화 후보.
- 기존 Help Center 의 webhook 자료 (`About webhooks & notifications`, `Configuring webhooks`, `Audit Event webhooks & notifications`, `ip-allowlisting-for-webhooks-notifications`) 와 cluster 를 형성.
- developer docs host 라 fact 밀도가 높아 deep ingest 가치가 큼 — 그러나 v3 정책상 본문 read 금지. promote 시 외부 도구로 chunk 추출 필요.

**Cross-cut Signal**:
- Stage 9 `transaction-lifecycle.md` 14-step schematic 의 webhook emit step 들과 직접 매핑 후보
- `entities/fireblocks/callback-handler.md` 의 event-type catalog 보강 후보
- IP allowlisting / signature verification → `vendors/fireblocks/security.md` cross-cut

---

## 3. 처리 절차 (단계별, 본 batch 한정)

### Step 1 — Filename 검증 (수행 완료 / 검증만)

3 개 모두 `YYYY-MM-DD__<host>__<slug>.pdf` 컨벤션 (README.md §"PDF는 어디에 넣어야 하는가") 준수.
→ **rename 불필요**.

### Step 2 — `sources/fireblocks/pdf/<filename>.meta.yml` 생성 (3 개)

각 PDF 옆에 동일 stem 의 `.meta.yml` 작성. 필드 schema (operating-principles.md v3.2 webpage meta.yml + 기존 PDF meta.yml hybrid):

**File 1 — `2026-06-01__support-fireblocks-io__transaction-screening.meta.yml`**
```yaml
source_url: https://support.fireblocks.io/hc/en-us/articles/transaction-screening
downloaded_at: 2026-06-01
domain: governance / security-access (AML+Compliance)
tier: 1
status: lightweight-index
title: "Transaction Screening"
ingest_log: "Stage N (2026-05-21) — Mode B; PDF body not loaded"
```

**File 2 — `2026-06-01__support-fireblocks-io__compliance-overview.meta.yml`**
```yaml
source_url: https://support.fireblocks.io/hc/en-us/articles/compliance-overview
downloaded_at: 2026-06-01
domain: governance (Compliance plane meta)
tier: 1
status: lightweight-index
title: "Compliance Overview"
ingest_log: "Stage N (2026-05-21) — Mode B; PDF body not loaded"
```

**File 3 — `2026-06-01__developers-fireblocks-com__webhook-events.meta.yml`**
```yaml
source_url: https://developers.fireblocks.com/docs/webhook-events
downloaded_at: 2026-06-01
domain: identity-auth / security-access (Callback/Webhook plane)
tier: 1
status: lightweight-index
title: "Webhook Events"
ingest_log: "Stage N (2026-05-21) — Mode B; PDF body not loaded"
```

> 주의: `source_url` 은 filename 의 host + slug 기반 추정. 정확한 URL 은 사용자가 확정해주면 보정.

### Step 3 — `sources/fireblocks/markdown/<stem>.md` 생성 (3 개, lightweight-index)

기존 `2026-05-19__support-fireblocks-io__compliance-integrations.md` 와 동일 schema (Stage 14 v3.1) 사용:

```markdown
<!--
source_url: <url>
downloaded_at: 2026-06-01
status: lightweight-index (Stage N, v3.2.2)
priority: TIER1
domain: <domain>
-->

# <Title>

**LIGHTWEIGHT INDEX (Stage N, v3.2.2)** — PDF 본문 미로드.

## Why TIER 1
<기존 spine 강화 측면 + 5 priority domain 적합성>

## Cross-cut Signal
- <기존 entity/hub 와의 예상 연결 — filename/URL 기반만, 본문 fact 추측 금지>

## Promote Condition
<어떤 시점에 Mode C deep ingest 할지>

## Related
- [[vendors/fireblocks/<hub>]]
- [[entities/fireblocks/<entity>]]
- [[sources/fireblocks/markdown/<sibling-cluster>]]
```

3 개 파일별 `Related` 매핑 (filename 기반 추정, ★ Hypothesis):

| 파일 | Related (1차 후보) |
|---|---|
| transaction-screening | `vendors/fireblocks/compliance`, `entities/fireblocks/policy` §"AML configuration", `vendors/fireblocks/architecture` §"Step 5b/5c (Screening Service)", cluster sibling `aml-compliance-cluster-catalog` |
| compliance-overview | `vendors/fireblocks/compliance`, cluster sibling `aml-compliance-cluster-catalog`, `vendors/fireblocks/architecture` §"Compliance plane" |
| webhook-events | `entities/fireblocks/callback-handler`, `vendors/fireblocks/callback-handler`, `vendors/fireblocks/lifecycle-events`, `vendors/fireblocks/security` §"IP allowlist for webhooks", cluster sibling `ip-allowlisting-for-webhooks-notifications` |

### Step 4 — `log.md` 에 stage entry 1 줄 (모든 모드에서 작성)

```markdown
## Stage N (2026-05-21) — 신규 PDF 3 종 ingest (Mode B / lightweight-index)

- sources:
  - 2026-06-01__support-fireblocks-io__transaction-screening.pdf
  - 2026-06-01__support-fireblocks-io__compliance-overview.pdf
  - 2026-06-01__developers-fireblocks-com__webhook-events.pdf
- 처리 모드: B (lightweight-index)
- 신규 entity: 0 (entity-min discipline 유지)
- 영향받은 curated 페이지: 0 (promote 보류)
- 영향받은 source 페이지:
  - sources/fireblocks/pdf/*.meta.yml (신규 3)
  - sources/fireblocks/markdown/*.md (신규 3)
- 후속 promote 후보: 3 개 모두 TIER 1 confirmed 시 Mode C 승격 가능
```

### Step 5 — 사용자 승인 대기 후 파일 작성

ingest-pdf.md §"출력 규약": **1–4 단계 보고 → 사용자 승인 대기 → 5 단계 (실제 파일 수정) 는 승인 후만**.
→ 본 응답은 1–4 단계 보고에 해당. 실제 `.meta.yml` / lightweight markdown 파일 작성은 사용자 승인 후 진행.

---

## 4. Mode C (full ingest) 로의 promote 조건

3 개 모두 향후 Mode C 승격 후보. promote 시 다음이 필요:

1. **외부 도구로 PDF → chunked text 추출** (PDF reader / OCR / LLM extractor / browser automation) — Read tool 로 PDF 직접 호출 금지 (v3 policy).
2. **사용자가 markdown chunk 제공** → chunk 단위로 takeaway 5–15 bullet, 각 bullet 에 `(source: <filename>.md, p.N)` 출처.
3. **영향받는 wiki 페이지 후보 분류** + **신규 entity 생성은 강력 비권장** (entity-min discipline, Stage 6 이후 연속 0 유지 중).
4. **Open Q 응답 검토** — 특히 Q-S03 (AML Transaction Screening Policy) 후보.

### Promote 우선순위 (★ Hypothesis)

| 순서 | 파일 | 이유 |
|---|---|---|
| 1 | webhook-events | developer docs 라 fact 밀도 높음 + 기존 callback-handler spine 강화 즉시 가능 |
| 2 | compliance-overview | compliance plane 의 entry hub — 다른 cluster file 들의 navigation anchor 가 됨 |
| 3 | transaction-screening | 기존 `aml-transaction-screening-and-monitoring` 와 중복 위험 — 본문 비교 후 cluster 정합성 결정 |

---

## 5. 추측 금지 적용 영역 (★)

본 분류는 filename / host / slug / 기존 cluster pattern 만 근거. 본문 fact 추측 금지:

- "transaction-screening 은 Chainalysis 를 사용한다" → **금지** (본문 미확인)
- "webhook-events 는 N 개 event type 을 가진다" → **금지** (본문 미확인)
- "compliance-overview 는 Travel Rule 을 포함한다" → **금지** (slug 기반 추측 불가)

위 fact 가 필요하면 → Open Q 로 분리하거나 Mode C promote 후만 기록.

---

## 6. 즉시 다음 액션 (사용자 확정 사항)

1. **본 분류 (Mode B × 3) 승인 여부** → 승인 시 Step 2–4 (meta.yml + lightweight markdown + log entry) 작성.
2. **각 파일의 정확한 source_url 확정** → 현재는 filename 기반 추정.
3. **Mode C promote 즉시 진행 여부** → 진행 시 외부 도구로 chunk 추출 필요 (PDF 직접 read 불가).
4. **cluster catalog 재편 여부** → 신규 3 개를 기존 `aml-compliance-cluster-catalog` 에 흡수할지, 별도 cluster 로 둘지.
