---
name: waas-wiki-curator
description: Manages the waas-wiki Fireblocks/WaaS reference knowledge base at /Users/mob.bit/Workspace/waas-wiki/ (sources/, vendors/, entities/, open-questions/, log.md, prompts/). Use this skill whenever the user (a) provides new source material (PDF/URL/markdown) to ingest, (b) explicitly asks to update the wiki — phrases like "wiki 에 추가", "새 entity", "open-question 답", "log entry", "page 수정", or (c) asks a factual question about Fireblocks or institutional WaaS architecture that should be answered from the curated wiki rather than LLM general knowledge (e.g. "MPC 분포", "Policy Q+O", "Workspace freeze 절차", "user role 권한"). Enforces a 7-step workflow (ingest → normalize → link → structure → invariants → fact/hypothesis separation → maintain) and routes operational detail to prompts/ files. Always invoke when working in waas-wiki or when Fireblocks-specific questions arise — never answer Fireblocks/WaaS facts from general knowledge alone.
---

# waas-wiki Curator

waas-wiki reference knowledge base 의 ingest/update/query 워크플로우를 일관되게 적용한다. 본 SKILL.md 는 **routing + discipline 강화 layer** — 운영 세부 절차는 `prompts/` 의 기존 파일에 위임한다.

## 작업 위치

`/Users/mob.bit/Workspace/waas-wiki/`

```
sources/<vendor>/{pdf,markdown,webpages,images}/    raw source (immutable)
vendors/<vendor>/*.md                                vendor hub (LLM 작성, fireblocks: 16 files)
entities/<vendor>/*.md                               entity pages (fireblocks: 24+)
entities/<vendor>/user-roles/                        nested entities (fireblocks: 9 role)
open-questions/<vendor>.md                           pending Q + evidence boundary
log.md                                               chronological stage log
prompts/                                             ★ 운영 prompt source-of-truth
  ├── operating-principles.md                        wiki 운영 방침 v3.2.2
  ├── ingest-pdf.md                                  3-mode source ingestion
  ├── extract-entities.md                            entity 후보 추출 (Mode C)
  └── update-wiki.md                                 페이지 수정 + lint 규칙
docs/architecture/                                   61 docs (D/C/E/R/T series)
persistence-architecture/                            16 files persistence reference
reference-architecture/                              7 files direct-build reference
guide/                                               11 files knowledge OS guide
docs-site/                                           Cloudflare Pages 정적 HTML 사이트
README.md, llm-wiki.md                               프로젝트 / 패턴 메타
```

## 응답 Opening Format (★ 모든 trigger 공통)

본 skill 이 활성된 응답은 **첫 줄에 trigger 판별과 workflow 위치를 명시**한다. 사용자가 어떤 discipline 이 적용되고 있는지 즉시 알 수 있어야 한다.

```
> **Trigger 판별**: Trigger <1|2|3> (<상황 명>) — <매칭된 phrase>
> **단계**: SKILL.md 7-step workflow Step <N> (<step 명>)
> **운영 위임**: prompts/<file>.md 의 <섹션>
> **상태**: dry-run — 사용자 승인 전까지 어떤 파일도 생성/수정 안 함
```

이 4 줄 quote block 이 없으면 응답이 skill 을 적용했다고 보기 어렵다.

## Trigger 판별

이 skill 이 적용돼야 할 3 가지 상황:

### Trigger 1 — 새 source 도착
**Phrases**: "이거 ingest 해줘", "PDF 처리", "URL 추가", "이 자료 wiki 로", "새 source"
**Input**: PDF path · URL · raw markdown
**Action**: §"7-Step Workflow / Step 1-2" + [prompts/ingest-pdf.md](../../../prompts/ingest-pdf.md) 의 3-mode 결정

### Trigger 2 — wiki 수정 요청
**Phrases**: "wiki 에 추가", "새 entity 만들어줘", "open-question 답", "log entry 추가", "entity 업데이트", "page 수정", "links 정합"
**Input**: 변경 대상 + 근거 (이미 ingest 된 source 또는 신규 fact)
**Action**: §"7-Step Workflow / Step 3-7" + [prompts/extract-entities.md](../../../prompts/extract-entities.md) 또는 [prompts/update-wiki.md](../../../prompts/update-wiki.md)

★ **신규 entity 요청 시 default 동작 = 거절 + 흡수 분석**. 다음 순서로:
1. 기존 entity / vendor hub 24+16 개 grep → 흡수 가능한 곳 명시
2. confirmed evidence (wiki 인용 가능 fact) vs hypothesis (LLM 일반 지식) 분리해서 evidence 깊이 평가
3. 흡수 권장 + 그래도 신규 entity 가 필요한 정당화 사유 요구
4. 사용자가 정당화 + 명시 승인 시에만 신규 entity 생성 — 그 시점에 Stage counter reset 명시

"draft 를 작성해 두겠습니다" 는 entity-min discipline 위반. **분석 보고만 하고 본문 작성은 보류**.

### Trigger 3 — fact query (reference-ready 검증)
**Phrases**: 어떤 Fireblocks/WaaS factual question — "Fireblocks 의 X 는?", "MPC 분포가 어떻게?", "Policy Q+O 의미", "Workspace freeze 절차", "Recovery passphrase 역할" 등
**Input**: 질문
**Action**: §"Reference-ready 답변 모드" — **LLM 일반 지식 단독 답변 금지**

복수 trigger 가 동시에 발생할 수 있다 (예: 새 source ingest 직후 fact query). 그 경우 순서대로 진행.

## 7-Step Workflow

각 step 의 목표 + 책임. 운영 detail 은 `prompts/` route.

### Step 1 — Source Ingest

**목표**: 정보를 잃지 않고 repository 안으로 가져온다.

★ **이 단계는 reasoning 단계가 아니다.** fact 추측 / synthesis 금지. 단순히 raw 를 `sources/` 에 보존.

- PDF: `sources/<vendor>/pdf/<filename>.pdf` + `<filename>.meta.yml`
- Webpage: `sources/<vendor>/webpages/<host>/<path>/<slug>.meta.yml`
- 대형 텍스트 (llms.txt · sitemap.xml · 100KB+ markdown): `curl` 저장만 + bash pipeline (wc/grep/sort/split) 로 file-level 처리. **본문 LLM context 미로드.**

**3 처리 모드** (자세히: [prompts/ingest-pdf.md](../../../prompts/ingest-pdf.md)):

| Mode | 조건 | 행동 |
|---|---|---|
| **A. catalog-only** | TIER 3 또는 ≥10 file cluster | rename + meta.yml + cluster catalog markdown. 본문 미로드. |
| **B. lightweight-index** | TIER 1 후보, 본문 deep ingest 보류 | filename + URL + domain + tier + cross-cut signal + promote condition. 본문 fact 추측 금지. |
| **C. full ingest** | TIER 1 confirmed + 사용자 명시 promote | 외부 도구 chunked text 만 read. PDF 직접 Read 금지. |

### Step 2 — Markdown Normalization

**목표**: PDF / HTML / raw → LLM-readable markdown 변환 (Mode B/C 만).

- 저장 위치: `sources/<vendor>/markdown/<YYYY-MM-DD>__<host-dash>__<slug>.md`
- ★ **PDF 직접 Read 금지** (operating-principles v3 policy) — 외부 도구 (PDF reader / OCR / browser automation) 결과만 사용
- Mode C 의 chunk 단위 — 한 chunk takeaway 5-15 bullet, 각 bullet 에 `(source: <filename>.md, p.N)` 출처

### Step 3 — Relationship Linking

**목표**: 모든 cross-page 참조를 wikilink 로 영속화.

- 형식: `[[entities/<vendor>/<slug>]]`, `[[vendors/<vendor>/<page>]]`, `[[open-questions/<vendor>#Q-...]]`
- ★ **양방향 갱신** — A→B 추가 시 B 의 Related Pages 에도 A 링크 추가
- 상대경로 사용

자세한 규칙: [prompts/update-wiki.md](../../../prompts/update-wiki.md)

### Step 4 — Recurring Structure Tagging

**목표**: 모든 entity / vendor page 가 동일한 6-section 구조.

```
# <Title>

## Summary
... 출처 포함 ...

## Key Concepts
- bullet (source: filename.md, p.N)

## Details
### Sub-section
...

## Related Pages
- [[link]]

## Sources
- `<filename>.md`, p.X-Y

## Open Questions
- Q-YYYY-MM-DD-XX — <text>
```

추가 sub-section 가능 (예: `## Stage N — <title> (★)`) — 6 spine 은 유지.

### Step 5 — Invariant Tagging

**목표**: cross-cutting invariant 명시 — 같은 fact 가 여러 page 에 중복 정의되지 않고 canonical 한 곳에서만 정의 + wikilink 로 참조.

- inline marker: `(★)` for invariant, `(★ Q-XYZ ANSWERED)` for resolved open question
- 신규 invariant 감지 절차:
  1. 같은 fact 가 3+ page 에 인용되면 invariant 후보
  2. canonical page 결정 (가장 자연스러운 spine)
  3. 다른 page 는 wikilink + `(see [[canonical#section]])` 만 남김
- 알려진 invariant 예: Q+O Owner counting rule, Unanimous-Veto Rule, First-Match Policy ordering, SPOC 경고, MPC-CMP 4-round, 3-cloud 분할

### Step 6 — Source Fact / Hypothesis Separation

**목표**: 확정 fact vs 추정 분리 — evidence boundary 무너지지 않게.

3 분류:

| 분류 | 위치 | 표기 |
|---|---|---|
| **Confirmed fact** | 본문 | `(source: <filename>.md, p.N)` 또는 `> "직접 인용"` |
| **Cross-vendor pattern (general knowledge)** | 본문 (drop 권장) | `> [unverified — 사전학습 기반, 1차 자료로 확인 필요]` |
| **Hypothesis** | `open-questions/<vendor>.md` (본문 X) | `Q-YYYY-MM-DD-XX — text` + `Status: open / partial-answered / answered` |

★ **Fireblocks 공식 근거 vs LLM 일반 지식 절대 혼합 금지** (auto-memory: `feedback_evidence_isolation`).
★ "wiki 에 없음" 결론은 4 source 전수 검색 후만 — curated wiki + raw PDF + markdown + Stage 15 sitemap.

### Step 7 — Reference-Ready Maintenance

**목표**: 다음 query 가 들어왔을 때 정확하고 일관된 답이 가능한 상태 유지.

**주기적 Lint** (사용자 요청 시 또는 5+ stage 마다):
- [ ] 모든 page 에 6 section 존재
- [ ] Sources 섹션 비어있는 page 에 본문 주장이 들어있지 않은가
- [ ] 양방향 link 가 한쪽만 걸려있지 않은가
- [ ] open-questions 의 `Status: answered` 항목이 본문에 반영되어 있는가
- [ ] 동일 entity 가 여러 page 에 정의되어 있지 않은가 (canonical 1개)
- [ ] log.md 의 Stage 번호와 vendor/entity page 의 Stage 라벨 정합

**매 stage 종료 시 log.md 갱신**:
```
## Stage N (YYYY-MM-DD) — <title>
- source: <filename>
- ANSWERED: Q-... / Q-...
- 영향받은 페이지: ...
- 신규 entity: 0 (또는 +N 사유 포함)
```

## Reference-ready 답변 모드 (Trigger 3)

Fact query 시 적용. **LLM 일반 지식 단독 답변 금지.**

### 답변 절차

1. **wiki grep** — `vendors/<vendor>/`, `entities/<vendor>/`, `open-questions/<vendor>.md` 에서 관련 page 검색
2. **인용 가능한 fact 만** 답변에 포함:
   - `(source: <filename>.md, p.N)` 형식 출처
   - 또는 wiki page 경로 (`vendors/fireblocks/mpc.md §"Key Share 분포"`)
3. **Hypothesis 영역은 별도 표시**:
   - "Fireblocks 미명시 — open-questions Q-... 보류 중"
4. **wiki 에 없으면** "wiki 에 없음" 으로 답하고 `open-questions/<vendor>.md` 에 새 Q 추가 제안

### 답변 형식 (auto-memory: `feedback_answer_template` v2)

★ 다음 **6 헤더를 정확한 한국어 그대로** 사용. 변형 / 영어 번역 금지.

```
## 1. 핵심 요약        (10초 이해)
## 2. 운영 상세
## 3. 확정 vs hypothesis    (★ 명확 분리, 두 sub-section)
## 4. 답 가능 범위      (wiki cover 범위 / 외부)
## 5. promote 필요      (필요 시)
## 6. 추천 / 운영 힌트
```

각 fact 는 inline 출처 — `(source: <filename>.md, p.N)` 또는 wiki 경로 `vendors/fireblocks/mpc.md §"section"`. 출처 없는 fact 진술 금지.

### Architecture Reasoning Mode (Stage 32+)

Fireblocks deepening 종료 후 모드 (auto-memory: `feedback_architecture_reasoning_mode`):
- 5-layer 답변: Fireblocks ref → 설치형 WaaS → 직접 구축 complexity → trade-off → 추천
- 3-way 항상 비교: SaaS / 설치형 WaaS / 직접 구축
- 4 "Why" 각도 + uncertainty boundary 엄수

## Operational Discipline (요약)

엄수 항목 (자세히: [prompts/operating-principles.md](../../../prompts/operating-principles.md) v3.2.2):

- ★ **PDF 직접 Read 금지** (Mode C 라도 사용자가 chunked markdown 제공 시만)
- ★ **fact 추측 금지** (Mode A/B 특히)
- ★ **신규 entity 생성 최소화** — 기존 entity / vendor hub 에 흡수 가능한지 먼저 점검
- ★ **양방향 wikilink 갱신**
- ★ **모든 fact 진술에 출처**
- ★ **Source Lake 본문 한 번에 다중 load 금지** — selective lazy-load 만
- ★ **Mode C auto entry 금지** — 사용자 promote 승인 후만
- ★ **curated wiki 자동 수정 금지** — diff 보여주고 승인 후만

## 출력 규약 (모든 trigger 공통)

1. **분석 보고** (영향받을 page / 신규 entity 후보 / Open Q 매핑) → 사용자 승인 대기
2. **실제 파일 수정은 승인 후만** (diff 형태로 보여줌)
3. **log.md entry 한 줄 제안**

## 관련 파일

- [prompts/operating-principles.md](../../../prompts/operating-principles.md) — 운영 방침 v3.2.2
- [prompts/ingest-pdf.md](../../../prompts/ingest-pdf.md) — 3-mode 소스 ingest
- [prompts/extract-entities.md](../../../prompts/extract-entities.md) — entity 후보 추출 (Mode C)
- [prompts/update-wiki.md](../../../prompts/update-wiki.md) — 페이지 수정 + lint
- [llm-wiki.md](../../../llm-wiki.md) — wiki 패턴 메타
- [log.md](../../../log.md) — chronological stage log
