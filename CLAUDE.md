# waas-wiki — LLM Operating Entry Point

> 이 파일은 Claude Code (또는 다른 LLM agent) 가 waas-wiki 에서 작업할 때 가장 먼저 읽는 **schema 진입점**.
> 운영 세부는 분산된 source-of-truth 파일들로 위임한다.

## 1. 정체성 (10 초 이해)

- **무엇**: Fireblocks-focused **Wallet-as-a-Service (WaaS)** 리서치 LLM wiki. [llm-wiki.md](llm-wiki.md) 패턴의 instance.
- **누가 쓰는가**: 사용자 1명 + LLM 1대 (Claude Code). LLM 이 모든 wiki 본문을 쓰고 사용자는 source / direction / approval 담당.
- **현재 상태**: 165 stage 진행 (log.md 가 정확한 counter). 5 priority domain (Workspace / Identity / Governance / Mobile / Security) deep ingest 완료 후 Architecture Reasoning Mode. 신규 entity 0 streak 38 stage 연속.
- **전체 catalog**: [index.md](index.md)

## 2. 3-Layer Architecture

```
Layer 1 — Raw Sources (immutable)
  sources/fireblocks/{pdf,markdown,webpages,images}/
  ★ LLM 이 직접 read 금지 (v3.2.2). 외부 도구 chunked extract 만.

Layer 2 — Curated Wiki (LLM-authored)
  vendors/<vendor>/*.md          ← 도메인 hub (Fireblocks: 16)
  entities/<vendor>/*.md         ← 명사 단위 entity (Fireblocks: 23 + 9 user-roles)
  open-questions/<vendor>.md     ← uncertainty 격리 (71 Q pending)
  docs/architecture/             ← Stage 32+ generalized publication (61 docs)
  persistence-architecture/      ← 영속화 reference (16 docs)
  reference-architecture/        ← direct-build reference (7 docs)
  guide/                         ← onboarding (11 docs)

Layer 3 — Schema (this file + 위임 대상)
  CLAUDE.md                      ← 본 파일 (entry point)
  prompts/operating-principles.md   ← 운영 방침 v3.2.2 (메타)
  prompts/ingest-pdf.md          ← 3-mode source ingest
  prompts/extract-entities.md    ← entity 후보 추출 (Mode C)
  prompts/update-wiki.md         ← 페이지 수정 규칙 + lint
  .claude/skills/waas-wiki-curator/SKILL.md  ← 자동 trigger 정의
  ~/.claude/projects/.../memory/  ← auto-memory (사용자별 룰)
```

## 3. 작업 모드 분기

LLM 이 사용자 메시지를 받으면 다음 3 trigger 중 하나로 분류:

### Trigger 1 — 새 source 도착
**Phrases**: "이거 ingest 해줘", "PDF 처리", "URL 추가", "이 자료 wiki 로"
**Route**: [prompts/ingest-pdf.md](prompts/ingest-pdf.md) 의 3-mode 분기
- Mode A (catalog-only) — TIER 3 또는 ≥10 file batch
- Mode B (lightweight-index) — TIER 1 후보, 본문 보류
- Mode C (full ingest) — TIER 1 confirmed + 사용자 promote 후만

### Trigger 2 — wiki 수정 요청
**Phrases**: "wiki 에 추가", "새 entity 만들어줘", "open-question 답", "log entry", "page 수정"
**Route**: [prompts/extract-entities.md](prompts/extract-entities.md) (entity 후보) 또는 [prompts/update-wiki.md](prompts/update-wiki.md) (기존 페이지)
**★ 신규 entity 요청 시 default = 거절 + 흡수 분석** (Stage 6+ 28 stage 연속 0 streak 유지)

### Trigger 3 — fact query (reference-ready)
**Phrases**: "Fireblocks 의 X 는?", "MPC 분포", "Policy Q+O", "Workspace freeze"
**Route**: [.claude/skills/waas-wiki-curator/SKILL.md](.claude/skills/waas-wiki-curator/SKILL.md) §"Reference-ready 답변 모드"
**★ LLM 일반 지식 단독 답변 금지** — wiki grep 필수

## 4. 핵심 Discipline (어겨선 안 되는 것)

자세히: [prompts/operating-principles.md](prompts/operating-principles.md) v3.2.2

- ★ **PDF 직접 Read 금지** — 외부 도구 chunked extract 만 (context 보호)
- ★ **fact 추측 금지** — 본문에 없으면 `open-questions/` 로 분리
- ★ **신규 entity 생성 최소화** — 24 기존 entity + 16 vendor hub 에 흡수 가능성 먼저 점검
- ★ **양방향 wikilink 갱신** — A→B 추가 시 B 의 Related Pages 에도 A 추가
- ★ **모든 fact 진술에 출처** — `(source: <filename>.md, p.N)` 또는 wiki 경로
- ★ **Source Lake 본문 일괄 load 금지** — selective lazy-load 만
- ★ **curated wiki 자동 수정 금지** — diff 보여주고 승인 후만
- ★ **Mode C auto entry 금지** — 사용자 promote 승인 후만

### Evidence Isolation (auto-memory)
Fireblocks 공식 근거 vs LLM 일반 지식 **절대 혼합 금지**. "wiki 에 없음" 결론은 4 source 전수 검색 후만 (curated / raw PDF / markdown / Stage 15 sitemap).

## 5. 페이지 작성 규약

자세히: [prompts/update-wiki.md](prompts/update-wiki.md)

모든 entity / vendor page 는 **YAML frontmatter + 6-section template**.

### YAML Frontmatter (Stage 35+)

vendors/fireblocks/ + entities/fireblocks/ + user-roles/ 의 48 파일에 적용:

```yaml
---
type: vendor-hub | entity | user-role
vendor: fireblocks
status: stable | draft | placeholder
tags: [governance, mpc, ...]    # taxonomy 검색용
stage_introduced: <N>            # 첫 Stage 참조
last_updated_stage: <N>          # 마지막 Stage 참조
source_count: <N>                # Sources 섹션 bullet 개수
related:                         # Related Pages 의 wikilink 들
  - <entity-slug>
---
```

Tag taxonomy: `mpc / cryptography / signing / integration / recovery / backup / security / workspace / governance / transaction / policy / user / identity / api / authentication / compliance / aml / risks / architecture / user-role / audit / misc`.

### 6-Section Body Template

```
# <Title>

## Summary           ← 출처 포함 한 단락
## Key Concepts      ← (source: …) 출처 포함 bullet
## Details           ← sub-section 가능
## Related Pages     ← wikilink (양방향)
## Sources           ← 인용된 모든 출처
## Open Questions    ← Q-YYYY-MM-DD-XX
```

`(★ Stage N)` 마커로 invariant / open question ANSWERED 표시.

## 6. Reference-ready 답변 형식

Trigger 3 시 사용. auto-memory 의 v2 6-section template:

```
## 1. 핵심 요약       (10초 이해)
## 2. 운영 상세
## 3. 확정 vs hypothesis   (★ 명확 분리)
## 4. 답 가능 범위
## 5. promote 필요
## 6. 추천 / 운영 힌트
```

각 fact 는 inline `(source: …)` 또는 wiki 경로 출처. 출처 없는 단정형 진술 금지.

### Architecture Reasoning Mode (Stage 32+)
Fireblocks deepening 종료 후 mode. **3-way 비교 (SaaS / 설치형 WaaS / 직접 구축)** + 4 "Why" 각도 + uncertainty boundary 엄수.

## 7. 출력 규약 (모든 trigger 공통)

1. **분석 보고** (영향받을 page / 신규 entity 후보 / Open Q 매핑) → **사용자 승인 대기**
2. **실제 파일 수정은 승인 후만** (diff 형태로 보여줌)
3. **log.md entry 한 줄 제안**:
   ```
   ## Stage N (YYYY-MM-DD) — <title>
   - source: …
   - ANSWERED: Q-… / Q-…
   - 영향받은 페이지: …
   - 신규 entity: 0 (또는 +N 사유 포함)
   ```

## 8. 주요 파일 빠른 접근

| 영역 | 파일 |
|---|---|
| 전체 catalog | [index.md](index.md) |
| 패턴 메타 | [llm-wiki.md](llm-wiki.md) |
| 운영 방침 | [prompts/operating-principles.md](prompts/operating-principles.md) |
| 3-mode ingest | [prompts/ingest-pdf.md](prompts/ingest-pdf.md) |
| Entity 추출 | [prompts/extract-entities.md](prompts/extract-entities.md) |
| Wiki 수정 + lint | [prompts/update-wiki.md](prompts/update-wiki.md) |
| 자동 trigger skill | [.claude/skills/waas-wiki-curator/SKILL.md](.claude/skills/waas-wiki-curator/SKILL.md) |
| Stage 이력 | [log.md](log.md) |
| Open Q | [open-questions/fireblocks.md](open-questions/fireblocks.md) |
| Published site | <https://wiki-docs.pages.dev/> ([docs-site/](docs-site/)) |

## 9. 현재 작업 / 다음 차례

현재 워크스트림 상태와 이어갈 작업 후보는 [NEXT.md](NEXT.md) 가 source of truth — 새 세션은 그 문서만 보고 이어갈 수 있다. docs-site 페이지 작성·리뷰 시 적용할 패턴 집합은 [.claude/skills/doc-author/](.claude/skills/doc-author/) skill.

---

_본 파일은 schema entry point. 운영 detail 은 위임 대상 파일에 있음. 본 파일이 detail 을 흡수하기 시작하면 중복이 누적되므로, 가능한 한 짧게 유지._
