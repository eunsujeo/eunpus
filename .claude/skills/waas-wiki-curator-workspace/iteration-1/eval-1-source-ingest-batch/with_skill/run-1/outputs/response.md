# Source Ingest 보고 — 3 PDF batch (dry-run 분석)

> **Trigger 판별**: Trigger 1 (새 source 도착) — 사용자 명시 "ingest 해줘".
> **운영 위임**: [prompts/ingest-pdf.md](../../../../../../prompts/ingest-pdf.md) v3.2.2 의 3-mode 분기.
> **단계**: SKILL.md 7-step workflow 중 Step 1 (Source Ingest) — 본문 fact 추측 금지, 파일/URL/도메인 기반 triage 만.
> **상태**: dry-run — 본 보고서는 분석 + diff preview 만. 사용자 승인 전까지 어떤 파일도 생성/수정 안 함.

---

## 1. 핵심 요약 (10초)

| # | 파일 | 추정 mode | 추정 tier | 추정 domain | 후속 행동 |
|---|---|---|---|---|---|
| 1 | `2026-06-01__support-fireblocks-io__transaction-screening.pdf` | **B (lightweight-index)** | TIER 1 후보 | compliance / screening | meta.yml + lightweight index — 본문 미로드 |
| 2 | `2026-06-01__support-fireblocks-io__compliance-overview.pdf` | **B (lightweight-index)** | TIER 1 후보 | compliance (overview spine) | meta.yml + lightweight index — 본문 미로드 |
| 3 | `2026-06-01__developers-fireblocks-com__webhook-events.pdf` | **B (lightweight-index)** | TIER 1 후보 | developer / lifecycle-events | meta.yml + lightweight index — 본문 미로드 |

**공통 결론**:
- 3 개 모두 **Mode B (lightweight-index)** 권장. Mode A (catalog-only) 는 cluster ≥10 file batch 일 때 적용 → 본 batch 는 3 file 이므로 부적합.
- Mode C (full ingest) 는 **사용자 명시 promote 후만** — 현재 사용자는 "ingest 해줘" 만 요청, deep ingest 명시 없음 → 자동 entry 금지 (operating-principles 엄수).
- 3 file 모두 5 priority domain 직격 (compliance / lifecycle-events) 으로 **TIER 1 후보**.
- curated wiki (vendors/, entities/) 는 본 단계에서 **수정하지 않음** — Mode B 의 정의상 promote 승인 전까지 entity/hub 영향 없음.

---

## 2. 운영 상세 — 파일별 처리 절차

### 2.1 사전 확인 (사용자 측 필요)

본 ingest 는 **filename 만 받았다**. 다음을 가정함:

- [ ] 3 개 PDF 가 실제로 `sources/fireblocks/pdf/` 에 존재 (또는 사용자가 곧 배치 예정)
- [ ] 파일명 convention (`YYYY-MM-DD__host-dash__slug.pdf`) 은 기존 wiki 와 일치 ✓ (검증 완료)
- [ ] `2026-06-01` 날짜는 source 의 download date 또는 publish 일자로 가정

**source URL 미수신** — meta.yml 의 `source_url:` 필드는 사용자가 추후 제공해야 함 (또는 추정 URL 을 hypothesis 로 명시).

### 2.2 Mode 결정 근거 (★ 본문 fact 추측 금지)

3 file 모두 **filename / domain / host 기반 triage 만** 수행. 본문은 미로드.

| 파일 | host | slug 기반 추정 도메인 | 기존 wiki 와의 cross-cut signal | Mode 판정 근거 |
|---|---|---|---|---|
| `transaction-screening.pdf` | `support.fireblocks.io` | compliance / AML screening | 기존 `aml-transaction-screening-policy.pdf`, `transaction-screening-operations.pdf`, `aml-transaction-screening-and-monitoring.pdf` 와 **동일 도메인 cluster** | TIER 1 (compliance spine 강화) → Mode B (deep ingest 보류) |
| `compliance-overview.pdf` | `support.fireblocks.io` | compliance hub overview | `vendors/fireblocks/compliance.md` 의 _TODO_ 항목 (SOC 2 / ISO 27001 / 라이선스) 채울 후보 | TIER 1 (compliance hub overview 후보) → Mode B |
| `webhook-events.pdf` | `developers.fireblocks.com` | developer / event payload spec | `vendors/fireblocks/lifecycle-events.md` + `vendors/fireblocks/callback-handler.md` 와 cross-cut. 기존 `ip-allowlisting-for-webhooks-notifications.pdf` 와 도메인 일치 | TIER 1 (developer spine / events) → Mode B |

★ **추측 금지 원칙 엄수**:
- "Transaction screening 의 매개변수는 X 다" — 본문 미확인 → 기록 금지
- "Compliance overview 는 SOC 2 를 다룬다" — 본문 미확인 → 기록 금지
- "Webhook events 의 payload format 은 JWT 이다" — 본문 미확인 → 기록 금지
- **허용 cross-cut signal**: 도메인 cluster 관계 / 기존 hub 와의 예상 연결 / promote 후보 명시까지만.

### 2.3 각 file 별 처리 (Mode B 표준 절차)

각 file 에 대해 다음 4 단계 수행:

1. **Rename 검증** — 파일명이 이미 convention 준수 ✓
2. **meta.yml 생성** — `sources/fireblocks/pdf/<basename>.meta.yml`
3. **Lightweight-index markdown 생성** — `sources/fireblocks/markdown/<basename>.md` (본문 변환 X, index 메타만)
4. **Curated wiki 영향 없음** — vendors/ entities/ 미수정

---

## 3. 파일별 meta.yml + lightweight-index draft (★ 생성하지 않음, preview)

### 3.1 File 1 — `transaction-screening.pdf`

**WOULD CREATE**: `sources/fireblocks/pdf/2026-06-01__support-fireblocks-io__transaction-screening.meta.yml`

```yaml
source_url: https://support.fireblocks.io/hc/en-us/articles/<TBD>-Transaction-Screening   # ← 사용자 확인 필요
downloaded_at: 2026-06-01
pages: <TBD>                                                                              # ← Mode B 단계에서는 페이지 수 미확인 (PDF 직접 Read 금지)
domain: compliance
tier: 1
status: nav-links-only          # Mode B 표준
crawl_status: not-fetched       # 본문 미로드
title: "Transaction Screening"
ingest_log: "Stage 35 (2026-05-20) — Mode B lightweight-index"
```

**WOULD CREATE**: `sources/fireblocks/markdown/2026-06-01__support-fireblocks-io__transaction-screening.md`

```markdown
# Transaction Screening — Lightweight Index (Mode B)

> **Mode**: B (lightweight-index). 본문 미로드. 본 파일은 filename / URL / domain 기반 index 만.
> **Stage**: 35 (2026-05-20)

## Meta

- **Title**: Transaction Screening
- **Source URL**: https://support.fireblocks.io/hc/en-us/articles/<TBD>-Transaction-Screening (TBD)
- **Source type**: PDF (vendor support article)
- **Tier**: 1
- **Domain category**: compliance / AML screening

## Why TIER 1

- 5 priority domain "compliance" 직격
- 기존 spine 강화 (`vendors/fireblocks/compliance.md`) 측면
- 기존 cluster 의 가족: `aml-transaction-screening-policy.pdf`, `aml-transaction-screening-and-monitoring.pdf`, `transaction-screening-operations.pdf`, `about-travel-rule-transaction-screening.pdf`

## Cross-cut signal (★ 본문 추측 금지)

기존 entity / hub 와의 **예상** 연결 (본문 미확인, 도메인 기반 추정):

- [[vendors/fireblocks/compliance.md]] — Screening Policy spine
- [[entities/fireblocks/policy.md]] — Policy entity 와의 연결 가능성
- [[entities/fireblocks/transaction.md]] — transaction lifecycle 의 screening 단계 가능성

## Promote condition

다음 중 하나 충족 시 Mode C 로 promote:

- 사용자가 "compliance hub 보강 deep ingest" 명시 요청
- Open Q 중 compliance / screening 관련 (Q-S07 FSPM, Q-... screening flow detail) 가 본 파일로 해소 가능하다고 추정될 때
- compliance Stage (예: Stage 36) 진행 시 cluster 일괄 promote

## Related (후보 wikilink, ★ 본문 확인 후 확정)

- [[vendors/fireblocks/compliance.md]]
- [[entities/fireblocks/policy.md]]
- [[entities/fireblocks/transaction.md]]

## Open Q 후보 (promote 시 확인)

- Q (신규) — Transaction Screening 의 매개변수 / 규칙 / 외부 provider 연동 방식
- Q (신규) — Screening 결과 → Policy engine 의 어떤 단계에 feedback 되는가
```

---

### 3.2 File 2 — `compliance-overview.pdf`

**WOULD CREATE**: `sources/fireblocks/pdf/2026-06-01__support-fireblocks-io__compliance-overview.meta.yml`

```yaml
source_url: https://support.fireblocks.io/hc/en-us/articles/<TBD>-Compliance-Overview   # ← 사용자 확인 필요
downloaded_at: 2026-06-01
pages: <TBD>
domain: compliance
tier: 1
status: nav-links-only
crawl_status: not-fetched
title: "Compliance Overview"
ingest_log: "Stage 35 (2026-05-20) — Mode B lightweight-index"
```

**WOULD CREATE**: `sources/fireblocks/markdown/2026-06-01__support-fireblocks-io__compliance-overview.md`

```markdown
# Compliance Overview — Lightweight Index (Mode B)

> **Mode**: B (lightweight-index). 본문 미로드.
> **Stage**: 35 (2026-05-20)

## Meta

- **Title**: Compliance Overview
- **Source URL**: https://support.fireblocks.io/hc/en-us/articles/<TBD>-Compliance-Overview (TBD)
- **Source type**: PDF (vendor support article — overview spine 후보)
- **Tier**: 1
- **Domain category**: compliance (hub overview)

## Why TIER 1

- 5 priority domain "compliance" 의 **overview spine** 가능성
- `vendors/fireblocks/compliance.md` 의 _TODO_ 항목 (SOC 2 / ISO 27001 / KYT / 외부 파트너 통합) 채울 가장 강력한 후보
- "overview" slug 는 vendor hub 단위 spine 강화 신호

## Cross-cut signal (★ 본문 추측 금지)

- [[vendors/fireblocks/compliance.md]] — overview spine 직격 후보
- [[vendors/fireblocks/security.md]] — compliance / security 경계 가능
- [[vendors/fireblocks/risks.md]] — regulatory risk 와의 연결 가능
- 기존 cluster: `about-the-travel-rule.pdf`, `aml-*.pdf` 의 상위 wrap-up 가능성

## Promote condition

- **High priority promote 후보** — compliance hub overview 라면 다른 compliance file 보다 먼저 promote 가치 큼
- 사용자가 "compliance spine 정비" 요청 시 즉시 Mode C
- 또는 compliance cluster batch promote 시 첫 번째 file 로

## Related (후보)

- [[vendors/fireblocks/compliance.md]]
- [[vendors/fireblocks/security.md]]
- [[vendors/fireblocks/risks.md]]

## Open Q 후보 (promote 시 해소 가능 추정)

- Q-S07 — FSPM (Fireblocks Security Posture Management) 명세
- Q (신규) — SOC 2 / ISO 27001 인증 범위
- Q (신규) — Compliance 의 vendor-side 책임 경계 vs customer 책임
```

---

### 3.3 File 3 — `webhook-events.pdf`

**WOULD CREATE**: `sources/fireblocks/pdf/2026-06-01__developers-fireblocks-com__webhook-events.meta.yml`

```yaml
source_url: https://developers.fireblocks.com/<TBD>/webhook-events   # ← 사용자 확인 필요
downloaded_at: 2026-06-01
pages: <TBD>
domain: developer
tier: 1
status: nav-links-only
crawl_status: not-fetched
title: "Webhook Events"
ingest_log: "Stage 35 (2026-05-20) — Mode B lightweight-index"
```

★ **host 주의**: `developers.fireblocks.com` 은 기존 PDF 의 host (`support.fireblocks.io`) 와 다름. 이는 **developer documentation** 도메인으로, 페이로드 spec / event schema 가 다뤄질 가능성이 큰 영역. 그러나 본문 미확인 → fact 추측 금지.

**WOULD CREATE**: `sources/fireblocks/markdown/2026-06-01__developers-fireblocks-com__webhook-events.md`

```markdown
# Webhook Events — Lightweight Index (Mode B)

> **Mode**: B (lightweight-index). 본문 미로드.
> **Stage**: 35 (2026-05-20)
> ★ Host: `developers.fireblocks.com` — developer documentation domain (vendor support 와 별개)

## Meta

- **Title**: Webhook Events
- **Source URL**: https://developers.fireblocks.com/<TBD>/webhook-events (TBD)
- **Source type**: PDF (developer documentation)
- **Tier**: 1
- **Domain category**: developer / lifecycle-events / event-bus

## Why TIER 1

- 5 priority domain 중 "lifecycle-events" / developer integration 직격
- `vendors/fireblocks/lifecycle-events.md` 과 직접 연결 후보
- `vendors/fireblocks/callback-handler.md` 의 webhook payload 영역 보강 가능
- 기존 `ip-allowlisting-for-webhooks-notifications.pdf` 와 같은 cluster (다만 본 파일은 notifications 가 아닌 events spec 자체일 가능성)

## Cross-cut signal (★ 본문 추측 금지)

- [[vendors/fireblocks/lifecycle-events.md]] — event schema 직격 후보
- [[vendors/fireblocks/callback-handler.md]] — callback 과 webhook 의 경계 명확화 가능
- [[vendors/fireblocks/api.md]] — API + webhook 통합 spec 영역
- [[entities/fireblocks/transaction.md]] — transaction event lifecycle 와의 연결

## Promote condition

- 사용자가 "webhook payload spec 정비" / "lifecycle-events hub 보강" 요청 시
- 또는 developer integration Stage 진행 시 cluster 일괄 promote
- ★ **callback-handler 와 webhook 의 경계** 가 현재 wiki 에서 약간 모호 — 이 spec 으로 boundary 정리 가능성 → promote 우선순위 ↑

## Related (후보)

- [[vendors/fireblocks/lifecycle-events.md]]
- [[vendors/fireblocks/callback-handler.md]]
- [[vendors/fireblocks/api.md]]
- [[entities/fireblocks/transaction.md]]

## Open Q 후보 (promote 시 해소 가능 추정)

- Q (신규) — Webhook event 의 정확한 종류 / 카탈로그
- Q (신규) — Webhook payload format (JSON schema / 인증 방식)
- Q (신규) — Webhook vs Callback Handler 의 책임 경계 (★ cross-cut invariant 후보)
- Q (신규) — Event delivery guarantee (at-least-once / exactly-once / ordering)
```

---

## 4. 확정 vs Hypothesis (★ 명확 분리)

### Confirmed (filename / URL / 기존 cluster 패턴 기반)

- 3 file 모두 파일명 convention 준수 (`YYYY-MM-DD__host-dash__slug.pdf`) ✓
- File 1, 2 의 host 는 `support.fireblocks.io` — 기존 dominant vendor support cluster 와 동일
- File 3 의 host 는 `developers.fireblocks.com` — developer documentation domain (기존 wiki 에 이 host PDF 미존재로 추정, 첫 entry 가능성)
- compliance 도메인은 5 priority domain 중 하나
- lifecycle-events 도메인은 5 priority domain 중 하나

### Hypothesis (본 단계에서 검증 불가, 본문 미로드)

- 각 file 의 정확한 content / scope / 페이지 수
- meta.yml 의 `source_url:` 정확한 값
- 각 file 이 어떤 Open Q 를 ANSWER 할 수 있는지
- "compliance-overview" 가 정말 hub overview spine 인지 (slug 추정만)
- "webhook-events" 가 event schema 본체인지 IP allowlist 설정인지 (slug 추정만)
- 각 file 의 promote 우선순위 — 본문 확인 후만 확정 가능

→ 본 항목들은 **본문 LLM 미노출 상태에서 추측 금지** (operating-principles v3.2.2 §"추측 금지").

---

## 5. 답 가능 범위

### 본 단계 (Mode B index) 가 cover 하는 것

- 3 file 의 filename normalization / meta.yml 생성
- 도메인 분류 (compliance / developer) 와 tier 추정
- 5 priority domain 적합성
- 기존 cluster 와의 관계 매핑 (filename / host 기반)
- promote 우선순위 추정

### 본 단계가 cover 하지 못하는 것

- 각 file 의 본문 fact (값, 정의, 규칙, 매개변수)
- curated wiki page (`vendors/`, `entities/`) 의 수정
- Open Q 의 ANSWER (본문 확인 필요 → Mode C promote 후)
- 신규 entity 후보 추출 (Mode C 의 `extract-entities.md` 영역)

---

## 6. Promote 필요 (사용자 결정)

다음 시점에 사용자가 promote 결정해야 함:

| File | Promote 권장도 | 권장 시점 |
|---|---|---|
| `compliance-overview.pdf` | **★★★ 높음** | compliance hub 의 _TODO_ 항목 많음 → 가장 먼저 Mode C 고려 |
| `transaction-screening.pdf` | ★★ 중간 | 기존 aml-screening cluster 와 함께 batch promote 효율적 |
| `webhook-events.pdf` | ★★ 중간 | lifecycle-events / callback-handler 경계 정리 필요 시 promote |

★ **Mode C auto entry 금지** (operating-principles 엄수) — 사용자가 "OOO 파일을 Mode C 로 promote 해달라" 명시 요청 후만 진행.

---

## 7. 추천 / 운영 힌트

### 즉시 사용자 액션 권장

1. **3 PDF 의 실제 source_url 제공** — meta.yml 의 `source_url:` 필드 채우기 위해
2. **PDF 파일 자체가 sources/fireblocks/pdf/ 에 배치되었는지 확인** — 본 보고서는 filename 만 기반으로 진행
3. **각 file 의 pages 수치** (또는 PDF reader 결과) 제공 — meta.yml `pages:` 필드 채우기 위해

### 본 보고서 승인 시 실제 수행 작업

승인 시 다음 6 개 파일 생성 (curated wiki 무변경):

```
sources/fireblocks/pdf/2026-06-01__support-fireblocks-io__transaction-screening.meta.yml
sources/fireblocks/pdf/2026-06-01__support-fireblocks-io__compliance-overview.meta.yml
sources/fireblocks/pdf/2026-06-01__developers-fireblocks-com__webhook-events.meta.yml
sources/fireblocks/markdown/2026-06-01__support-fireblocks-io__transaction-screening.md
sources/fireblocks/markdown/2026-06-01__support-fireblocks-io__compliance-overview.md
sources/fireblocks/markdown/2026-06-01__developers-fireblocks-com__webhook-events.md
```

### Log entry 제안 (Step 7 maintenance)

`log.md` 에 추가:

```markdown
## Stage 35 (2026-05-20) — 3 PDF Mode B lightweight-index batch
- source:
  - 2026-06-01__support-fireblocks-io__transaction-screening.pdf
  - 2026-06-01__support-fireblocks-io__compliance-overview.pdf
  - 2026-06-01__developers-fireblocks-com__webhook-events.pdf
- mode: B (lightweight-index) × 3 — 본문 미로드
- domain: compliance × 2, developer/lifecycle-events × 1
- tier: 1 × 3 (TIER 1 후보)
- ANSWERED: (none) — Mode B 단계, fact 답변 없음
- 영향받은 페이지: 0 — curated wiki 무변경 (Mode B 정의상)
- 신규 entity: 0 — entity-min discipline (Mode B 단계 entity 생성 금지)
- Promote 후보: compliance-overview (★★★), 나머지 2 (★★)
```

★ **Stage 번호**: 최근 log entry 가 Stage 34 (T-series Theory Stewardship Layer) → 본 batch 는 Stage 35 로 가정. 사용자가 다른 번호 체계 (예: Stage 32 처럼 sub-cluster 라벨) 적용 시 조정.

### Operational discipline 체크리스트

- [x] PDF 직접 Read 미실행 (operating-principles v3 policy 엄수)
- [x] 본문 fact 추측 금지 (filename / URL / domain triage 만)
- [x] 신규 entity 생성 0 (Mode B 단계 정의상)
- [x] 양방향 wikilink — Mode B 는 curated wiki 무수정 → 불필요
- [x] 모든 hypothesis 영역에 출처 미확정 명시 (`<TBD>`)
- [x] Source Lake 본문 다중 load 없음 (lazy-load 원칙 유지)
- [x] Mode C auto entry 금지 (3 file 모두 promote 미요청 → Mode B 유지)
- [x] curated wiki 자동 수정 금지 (diff preview 만, 승인 대기)

---

## 결론 — 사용자 승인 대기

위 분석을 승인하시면:

1. 3 개 `.meta.yml` 생성 (sources/fireblocks/pdf/)
2. 3 개 lightweight-index `.md` 생성 (sources/fireblocks/markdown/)
3. log.md 에 Stage 35 entry 추가
4. curated wiki (vendors/, entities/) 는 **무변경**

미리 확인 필요한 항목:

- 3 PDF 의 실제 `source_url` 값
- 3 PDF 의 페이지 수 (선택, meta.yml 완성도)
- Stage 번호 확정 (35 로 진행 OK?)
- "compliance-overview" 를 우선 Mode C promote 할지 본 batch 후 별도 결정할지

이 중 하나라도 변경 필요 시 알려주시면 반영 후 재보고.
