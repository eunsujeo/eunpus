> **Trigger 판별**: Trigger 1 (새 source 도착) — "ingest 해줘" + PDF 파일 3 개 batch
> **단계**: SKILL.md 7-step workflow Step 1 (Source Ingest) — Mode 결정 단계
> **운영 위임**: prompts/ingest-pdf.md 의 §"처리 모드 결정" + §"모드 B — lightweight-index"
> **상태**: dry-run — 사용자 승인 전까지 어떤 파일도 생성/수정 안 함

---

## 0. 입력 요약

새 PDF 3 개 — 본문 미수신, **파일명만** 통지받은 상태. 실제 PDF 파일은 아직 `sources/fireblocks/pdf/` 에 placement 되지 않았다(또는 placement 직전). SKILL.md `Step 1` + ingest-pdf.md v3.2.2 의 추측 금지 원칙(★)에 따라 **본문 기반 fact 진술은 일체 하지 않고**, filename / host / slug / 5 priority domain 매핑까지만 수행한다.

| # | filename | host | slug |
|---|---|---|---|
| 1 | `2026-06-01__support-fireblocks-io__transaction-screening.pdf` | support.fireblocks.io | transaction-screening |
| 2 | `2026-06-01__support-fireblocks-io__compliance-overview.pdf` | support.fireblocks.io | compliance-overview |
| 3 | `2026-06-01__developers-fireblocks-com__webhook-events.pdf` | developers.fireblocks.com | webhook-events |

파일명 컨벤션(`YYYY-MM-DD__<host-dash>__<slug>.pdf`)은 기존 643 개 PDF 의 명명 규칙과 일치 — rename 불필요.

---

## 1. Mode 결정 (★ 첫 단계)

ingest-pdf.md §"처리 모드 결정" 의 3-mode 표를 적용. 3 개 모두 사용자가 "deep ingest" 또는 "본문 chunk 첨부"를 명시하지 않았고, support / developers 도메인은 TIER 1 후보지만 **본문 첨부 없이 deep ingest 진입은 v3.2.2 정책 위반** (Mode C auto entry 금지, ★).

결론 → **3 개 모두 Mode B (lightweight-index)** 가 default.

| # | filename(slug) | 5 priority domain 매핑 | TIER | Mode | 사유 |
|---|---|---|---|---|---|
| 1 | transaction-screening | compliance / AML | 1 | **B** | sibling 5 개 이상 존재(`aml-transaction-screening-*`, `transaction-screening-operations`, `bring-your-own-screening-check-*`). spine 보강 명백. 단, 본문 부재 → deep ingest 보류. |
| 2 | compliance-overview | compliance (hub-level) | 1 | **B** | "overview" slug 은 vendor hub 갱신 가능성 높음 — `vendors/fireblocks/compliance.md` 영향. 단, 본문 부재 → deep ingest 보류. |
| 3 | webhook-events | developer-platform / lifecycle-events / callback-handler | 1 | **B** | developers.fireblocks.com 호스트 = dev portal 도메인. `vendors/fireblocks/lifecycle-events.md` + `entities/fireblocks/callback-handler.md` 와 직결 후보. 본문 부재 → deep ingest 보류. |

Mode A(catalog-only)도 후보였으나 — (a) 3 개는 cluster batch(>10) 아님, (b) 모두 TIER 1 후보 spine 직격 → 개별 lightweight-index 가 정확.

Mode C(full ingest)는 **사용자가 외부 도구로 chunked markdown 을 별도 제공 + 명시적 promote 승인** 시에만 진입 — 현재 조건 미충족.

---

## 2. 파일별 처리 절차 (Mode B)

각 파일에 대해 ingest-pdf.md §"모드 B" 4 단계를 dry-run 으로 보여준다. **본문 fact 추측 금지(★)** — 따라서 "Why TIER 1" / "Cross-cut signal" 은 filename + URL + domain tag 기반 예측까지만 기록한다.

### 2.1 `2026-06-01__support-fireblocks-io__transaction-screening.pdf`

**예정 위치**
- `sources/fireblocks/pdf/2026-06-01__support-fireblocks-io__transaction-screening.pdf` (원본 그대로)
- `sources/fireblocks/pdf/2026-06-01__support-fireblocks-io__transaction-screening.meta.yml` (신규)
- Markdown 변환본 **생성 안 함** (Mode B — 본문 보류)

**meta.yml (제안)**
```yaml
source_url: https://support.fireblocks.io/hc/en-us/articles/<TBD>-Transaction-Screening
downloaded_at: 2026-06-01
pages: TBD
domain: compliance
tier: 1
status: lightweight-index
crawl_status: not-fetched
title: "Transaction Screening"
ingest_log: "Stage <next> (2026-05-21)"
```

**Lightweight index markdown (제안, dry-run 미생성)**
- Path 후보: `sources/fireblocks/markdown/_index/2026-06-01__support-fireblocks-io__transaction-screening.index.md`
- 포함 필드:
  - title: Transaction Screening
  - URL: (사용자 확인 필요 — Help Center article id)
  - source type: support article (PDF capture)
  - tier: 1
  - domain category: compliance / AML
  - **Why TIER 1**: 5 priority domain 중 compliance spine 직접 보강 — 기존 `vendors/fireblocks/compliance.md` 가 sibling AML/screening 6+ source 를 이미 cover 중인 cluster 의 신규 진입점일 가능성.
  - **Cross-cut signal (예측만)**:
    - `vendors/fireblocks/compliance.md` 의 "Transaction Screening" section 정합 후보
    - `vendors/fireblocks/policy-engine.md` 의 pre/post-screening hook 연결 후보 (★ 예측 — 본문 미확인)
    - `entities/fireblocks/transaction.md` 의 lifecycle 단계 중 screening gate 연결 후보 (★ 예측)
  - **Related (wikilink 후보)**:
    - `[[vendors/fireblocks/compliance]]`
    - `[[vendors/fireblocks/policy-engine]]`
    - `[[entities/fireblocks/transaction]]`
  - **Promote condition**: 사용자가 (a) Mode C promote 명시 + (b) 외부 도구로 chunked markdown 제공 시 deep ingest.

**Curated wiki 영향**: 현재 없음(Mode B — promote 승인 전까지 entity/hub 수정 금지).

---

### 2.2 `2026-06-01__support-fireblocks-io__compliance-overview.pdf`

**예정 위치**
- `sources/fireblocks/pdf/2026-06-01__support-fireblocks-io__compliance-overview.pdf`
- `sources/fireblocks/pdf/2026-06-01__support-fireblocks-io__compliance-overview.meta.yml` (신규)
- Markdown 변환본 **생성 안 함**

**meta.yml (제안)**
```yaml
source_url: https://support.fireblocks.io/hc/en-us/articles/<TBD>-Compliance-Overview
downloaded_at: 2026-06-01
pages: TBD
domain: compliance
tier: 1
status: lightweight-index
crawl_status: not-fetched
title: "Compliance Overview"
ingest_log: "Stage <next> (2026-05-21)"
```

**Lightweight index markdown (제안, dry-run 미생성)**
- Path 후보: `sources/fireblocks/markdown/_index/2026-06-01__support-fireblocks-io__compliance-overview.index.md`
- 포함 필드:
  - title: Compliance Overview
  - URL: (사용자 확인 필요)
  - source type: support article (PDF capture)
  - tier: 1
  - domain category: compliance (hub-level)
  - **Why TIER 1**: "overview" slug 은 vendor hub `vendors/fireblocks/compliance.md` Summary/Key Concepts section 직접 갱신 가능성. 같은 도메인 sibling 8+ 파일이 spoke, 본 PDF 는 hub 후보.
  - **Cross-cut signal (예측만)**:
    - `vendors/fireblocks/compliance.md` Summary 갱신 후보 (★ 예측)
    - `vendors/fireblocks/policy-engine.md` 의 compliance integration 라우팅 연결 후보 (★ 예측)
    - 기존 `compliance-integrations.pdf` / `bring-your-own-screening-check-integration-guide.pdf` 와 본문 overlap 가능성 — promote 시 dedup 필요 (★ 예측)
  - **Related (wikilink 후보)**:
    - `[[vendors/fireblocks/compliance]]`
    - `[[vendors/fireblocks/policy-engine]]`
  - **Promote condition**: (a) Mode C promote 승인 + (b) chunked markdown 제공 + (c) sibling 파일과의 dedup 정책 합의.

**Curated wiki 영향**: 현재 없음.

**★ 주의**: "overview" slug 은 hub 본문 자체를 갈아끼울 수도 있는 source — promote 시 `compliance.md` 의 기존 Sources 섹션과 충돌하지 않는지 lint 필요.

---

### 2.3 `2026-06-01__developers-fireblocks-com__webhook-events.pdf`

**예정 위치**
- `sources/fireblocks/pdf/2026-06-01__developers-fireblocks-com__webhook-events.pdf`
- `sources/fireblocks/pdf/2026-06-01__developers-fireblocks-com__webhook-events.meta.yml` (신규)
- Markdown 변환본 **생성 안 함**

**meta.yml (제안)**
```yaml
source_url: https://developers.fireblocks.com/docs/<TBD>/webhook-events
downloaded_at: 2026-06-01
pages: TBD
domain: developer-platform / lifecycle-events
tier: 1
status: lightweight-index
crawl_status: not-fetched
title: "Webhook Events"
ingest_log: "Stage <next> (2026-05-21)"
```

**Lightweight index markdown (제안, dry-run 미생성)**
- Path 후보: `sources/fireblocks/markdown/_index/2026-06-01__developers-fireblocks-com__webhook-events.index.md`
- 포함 필드:
  - title: Webhook Events
  - URL: (사용자 확인 필요 — developers portal docs URL)
  - source type: developer docs (PDF capture)
  - tier: 1
  - domain category: developer-platform / event-driven integration
  - **Why TIER 1**: developers.fireblocks.com 호스트는 dev portal — `vendors/fireblocks/lifecycle-events.md` + `entities/fireblocks/callback-handler.md` 의 canonical reference 후보. webhook event catalog 가 본문이라면 `lifecycle-events.md` spine 확장이 자연스럽다 (★ 예측).
  - **Cross-cut signal (예측만)**:
    - `vendors/fireblocks/lifecycle-events.md` 의 event taxonomy section 갱신 후보 (★ 예측)
    - `entities/fireblocks/callback-handler.md` 의 ACK / retry / signature 검증 section 연결 후보 (★ 예측)
    - `vendors/fireblocks/api.md` 의 async integration 라우팅 연결 후보 (★ 예측)
    - 기존 `ip-allowlisting-for-webhooks-notifications.pdf` 와 IP allowlist 관점에서 cross-ref 후보
  - **Related (wikilink 후보)**:
    - `[[vendors/fireblocks/lifecycle-events]]`
    - `[[vendors/fireblocks/api]]`
    - `[[entities/fireblocks/callback-handler]]`
  - **Promote condition**: (a) Mode C promote 승인 + (b) chunked markdown 제공 + (c) developer-platform 호스트 처음 진입이라면 5 priority domain 매핑 재확인.

**Curated wiki 영향**: 현재 없음.

**★ 주의**: 본 PDF 는 `support.fireblocks.io` 가 아닌 `developers.fireblocks.com` 도메인 — 두 도메인이 같은 fact 를 다르게 기술할 가능성(예: support 는 end-user 관점, developers 는 spec 관점). promote 시 어느 쪽을 canonical 로 둘지 결정 필요.

---

## 3. 신규 entity 검토 (entity-min discipline)

SKILL.md §"Trigger 2 ★ 신규 entity 요청 시 default 동작 = 거절 + 흡수 분석" 을 사전 적용.

| 후보 신규 entity | 흡수 가능 위치 | 신규 생성 필요? |
|---|---|---|
| `entities/fireblocks/transaction-screening.md` | `vendors/fireblocks/compliance.md` §"Transaction Screening" + `vendors/fireblocks/policy-engine.md` 와 cross-link | **No** — hub section 으로 흡수 권장 |
| `entities/fireblocks/webhook-event.md` | `vendors/fireblocks/lifecycle-events.md` event taxonomy section + `entities/fireblocks/callback-handler.md` 의 sub-section | **No** — 기존 entity 확장으로 흡수 권장 |
| `entities/fireblocks/compliance-overview.md` | `vendors/fireblocks/compliance.md` Summary 자체가 overview — 별도 page 불필요 | **No** |

→ **3 개 모두 신규 entity 생성 비권장**. Stage counter 유지(0 신규 entity). 사용자가 Mode C promote 후 본문에서 명백한 sub-entity (예: 특정 event payload schema 가 standalone entity 필요한 수준)가 발견되면 그 시점에 정당화 + 명시 승인 후 생성.

---

## 4. Open Question 매핑 (예측 — 본문 미확인)

본문 부재 — 따라서 "이 PDF 가 어떤 Q 를 ANSWERED 한다"고 단정할 수 없다. **promote 후에만 답변 매핑**. 다만 filename 기반으로 *연관 가능* Q 후보를 예측:

- `open-questions/fireblocks.md` 의 compliance / screening / webhook 관련 Q 가 존재한다면, 위 3 PDF 가 promote 시 후보 evidence.
- 본 dry-run 단계에서는 wiki 의 open-questions/fireblocks.md grep 후 mapping 표 작성을 사용자 승인 시 진행.

---

## 5. 실행 계획 (사용자 승인 시)

승인 시 다음 순서로 실제 파일 작업 진행 — 각 단계 diff 표시 후 진행:

1. **PDF placement 확인** — 사용자가 3 개 PDF 를 실제로 `sources/fireblocks/pdf/` 에 배치했는지 `ls` 로 확인.
2. **meta.yml 3 개 생성** — 위 §2.1/2.2/2.3 의 yaml. `source_url` / `pages` 필드는 사용자 확인 후 채움(또는 TBD 로 placeholder).
3. **Lightweight index markdown 3 개 생성** — `sources/fireblocks/markdown/_index/` 경로(또는 기존 wiki 컨벤션에 맞춰 조정).
4. **log.md entry 추가** (한 줄, Stage N — 다음 stage 번호는 사용자 또는 `log.md` 마지막 stage 확인 후 결정):
   ```
   ## Stage <N> (2026-05-21) — compliance + developer-platform lightweight-index (mode B ×3)
   - source: 2026-06-01__support-fireblocks-io__transaction-screening.pdf
   - source: 2026-06-01__support-fireblocks-io__compliance-overview.pdf
   - source: 2026-06-01__developers-fireblocks-com__webhook-events.pdf
   - ANSWERED: (없음 — Mode B, 본문 미로드)
   - 영향받은 페이지: (없음 — promote 전)
   - 신규 entity: 0
   ```
5. **Curated wiki(vendors/, entities/) 수정 없음** — promote 전까지 동결.

---

## 6. 사용자 결정 요청 (3 항목)

승인 진행 전 다음 3 가지 확정 필요:

1. **3 개 PDF 의 원본 URL** — meta.yml `source_url` 채우기 위해 필요(또는 TBD 로 둘지). filename 기반 추정은 가능하지만 추측 금지 원칙상 사용자 확인 권장.
2. **Mode B 유지 vs Mode C promote 즉시 진행 여부** — 후자라면 외부 도구로 추출한 chunked markdown 첨부 필요. 첨부 없으면 Mode B 진행 default.
3. **Stage 번호 / log.md entry 작성 시점** — 3 개를 한 stage 로 묶을지(권장) 분리할지.

---

## 7. 추측 금지 / Evidence isolation 재확인

본 응답에서 다음은 **모두 예측(★ 표시)** 이며 본문 fact 아님:
- "Why TIER 1" 의 spine 보강 추정
- "Cross-cut signal" 의 영향받을 hub/entity 예측
- "Related" wikilink 후보
- "Promote condition" 시점 추정

본문 fact 가 필요하면 — Mode C promote + chunked markdown 첨부 후에만 진술. Fireblocks 일반 지식과 LLM 일반 지식 혼합 금지(auto-memory: `feedback_evidence_isolation`).

---

## Summary (10초 이해)

- **3 개 모두 Mode B (lightweight-index) default** — TIER 1 후보 spine 직격이지만 본문 부재 → deep ingest 보류.
- **dry-run 출력**: meta.yml 3 개 + lightweight index markdown 3 개 제안. curated wiki(vendors/, entities/) 수정 없음.
- **신규 entity 0** — 3 개 모두 기존 hub/entity 흡수 권장(`compliance.md`, `lifecycle-events.md`, `callback-handler.md`).
- **승인 대기 항목**: 원본 URL 3 개, Mode B/C 선택, Stage 번호.
