---
name: doc-author
description: Patterns for authoring and reviewing technical reference documents (HTML or markdown). Covers plain-Korean writing with glossary tooltips for jargon, source-vs-author-inference disclosure, DB schema documentation conventions (audit columns, field-by-field tables, ENUM explanations, approval gates, audit plane delegation), mermaid diagram standards (color palette, direction, captions, English+Korean labels), removal of wiki-internal residue (.md citations, ★ markers, stage labels), and cross-page consistency checks. Apply this skill whenever writing new technical doc pages, reviewing existing ones, refactoring docs for public audience, designing DB schemas in docs, or composing state-machine flow diagrams — even if the user doesn't explicitly mention "doc style" or invoke the skill by name.
---

# doc-author — 기술 문서 작성/리뷰 룰

> 이 skill 은 public 기술 reference 문서 (HTML 또는 markdown) 의 첫 draft 부터 일관된 품질을 유지하기 위한 룰을 정의한다. waas-wiki 의 `docs-site/` 산하 페이지가 1차 적용 대상이지만, 일반 원칙은 다른 문서에도 사용 가능.

## 1. 발동 trigger

다음 상황에서 첫 응답 전에 본 skill 의 룰을 우선 적용:

- 새 reference 페이지 작성 ("새 페이지 추가", "X 절 작성")
- 기존 페이지 리뷰 ("이 페이지 리뷰", "리뷰할께요")
- DB schema 문서화 (CREATE TABLE 직후 필드 설명)
- state machine / flow 다이어그램 작성
- 기존 wiki 본문을 public 문서로 추출

내부 wiki (`vendors/`, `entities/`, `open-questions/`) 본문 자체 수정은 별도 — 본 skill 은 **public 산물 (`docs-site/`)** 에 적용.

## 2. 작성 / 리뷰 핵심 원칙

### 2.1 평이한 한글 우선
- 영어 jargon (burst / hard stuck / soft throttle / nonce / RBF / UTXO / reorg …) 은 처음 등장 시 풀어쓰거나 glossary tooltip `(?)` 로 풀이
- "X (영문)" 보다 "직관적 한국어. 영문 명칭은 ~ 다" 흐름
- 표 헤더 / 섹션 제목도 평이한 한국어 ("운영 동사" 같은 직역 회피 → "운영 액션")
- 자세히: [references/writing-style.md](references/writing-style.md)

### 2.2 출처 분리 (Provenance)
- 페이지 상단에 **"본 페이지의 출처" callout** 필수 (해당 페이지에 외부 source 인용이 섞일 경우)
- "공식 문서에 정의된 사실 (그대로 받아도 안전)" vs "저자가 합리적으로 추정해서 그린 설계 (참고용, 본인 환경 검증 권장)" 라벨로 구분
- wiki 내부 용어 ("Fireblocks 명시", "Hypothesis") 사용 금지
- 사실 진술 전 raw source grep 으로 검증. fabrication 발견 시 즉시 정정 + 사용자에게 정직하게 알림
- 자세히: [references/provenance.md](references/provenance.md)

### 2.3 Wiki 내부 잔재 제거
public 문서에 절대 남기지 말 것:
- `.md` 인라인 출처 (`account-and-wallet-structure.md, p.1`)
- `p.N` page-pin
- `★ Stage N`, `★ 정식 명세`, `(★ Admin override)` 등 ★ wiki 마커 (SQL comment 의 `★ set-once` / `★ append-only` 는 schema discipline marker 라 유지)
- `§1.5` 등 section sign — 한글 독자에 낯섦
- `(hypothesis)` 라벨 — 의미 있는 path 면 "필수 path" 로 격상, 아니면 제거
- `persistence-architecture/07`, `Stage 15 sitemap` 등 wiki 내부 경로
- 자세히: [references/cleanup.md](references/cleanup.md)

### 2.4 DB Schema 작성 규약 (DB 문서 한정)
모든 `CREATE TABLE` 직후:
1. **필드별 설명 표** (자료형 + 역할). 컬럼 width 24% / 18% / rest
2. ENUM 컬럼은 **값별 의미** 본문에서 풀어쓰기
3. audit 컬럼 패턴 — `created_by`/`created_at` (set-once) + `modified_by`/`modified_at` (변경 시 갱신). **`updated_at` 금지**
4. 변경 이력은 별도 `*_change_events` 테이블 (append-only)
5. 다대다 관계는 junction table
6. approval-gated action 은 `approved_by_quorum_id` + `approved_at` 추가
7. approver-level signature 는 audit 평면 (`approval_decisions`) 으로 위임 — schema 본체에 보관 금지
8. reorg / unhappy path 가 발생 가능한 도메인이면 "Reorg 처리" 절 필수 (rare 라도 schema 가 표현 못 하면 정정 불가)
- 자세히: [references/db-schema.md](references/db-schema.md)

### 2.5 Mermaid 도식 규약
- **색 팔레트** (classDef):
  - good `fill:#dcfce7,stroke:#16a34a` — 정상 완료
  - bad `fill:#fee2e2,stroke:#dc2626` — 차단/실패
  - wait `fill:#fef3c7,stroke:#d97706` — 진행 중
  - special `fill:#e0e7ff,stroke:#6366f1` — 특수 종착 (Sign-Only 등)
  - vault `fill:#dbeafe,stroke:#2563eb` — 자산 보관 단위
- **direction**: 단일 흐름은 `LR`. 비교 도식 (단일 vs round-robin 등) 은 outer `TB` + inner `LR`
- node 라벨: 이모지 + 한글 의미 + 영문 status code (예: `"✅ 입금 확정\n(COMPLETED)\n자금 사용 가능"`)
- 모든 diagram 에 **caption** — 색 분류 + 핵심 전이 + 주의 사항
- BeautifulSoup 후처리 시 `<pre class="mermaid">` 안의 `-->`, `&`, `<br/>` 보존 (placeholder 치환 패턴)
- 자세히: [references/diagrams.md](references/diagrams.md)

### 2.6 구조 패턴
- 챕터/절 헤딩: "X — 짧은 한 줄 설명" ("DCCP — 입금/출금에 필요한 confirmation 횟수 정책")
- chain 별 / 케이스별 항목 등 길어지는 enumeration: `<ul>` 보다 `<dl class="chain-rr"><dt><dd>`
- "본 schema 의 범위 밖" callout — 다른 평면으로 위임하는 항목 정리
- "수탁형 본연 기능 아님" scope-out callout — out-of-scope 결정 기록
- ENUM ≤ 10 값은 단일 라인, > 10 은 줄바꿈

### 2.7 일관성 검증 (배포 전)
- sidebar 번호 와 inline link 번호 일치
- mermaid `<pre>` 블록 entity 보존 (`&gt;` / `&amp;` / `</br>` 0 개)
- 인라인 `.md` 출처 0 개
- ★ wiki 내부 마커 0 개 (SQL comment 제외)
- script: [scripts/check-consistency.py](scripts/check-consistency.py)

## 3. 배포 안전 룰

- 배포는 **사용자 명시 지시 시에만** 실행. 자동 deploy 금지.
- `npx wrangler pages deploy` 는 **반드시 `docs-site/<site-name>/` 또는 절대경로** 에서. wiki repo root 에서 실행 절대 금지 (raw 소스 유출 위험).
- 권장 형태: `cd <docs-site-path> && npx wrangler pages deploy . --project-name=<name> --branch=main --commit-dirty=true`
- deploy 결과의 "Uploaded N files" 가 예상 범위 (수십 단위) 인지 확인. 1000+ 이면 wrong-dir 신호 → 즉시 알림.

## 4. 출력 패턴 (모든 trigger 공통)

1. 검토 보고: 영향받는 파일 / 신규/변경 entity 후보 / 적용할 룰 → **사용자 승인 대기**
2. 변경 시 diff 형태로 보여주고 진행
3. 배포는 사용자가 "배포해줘" 라고 명시했을 때만

## 5. Site-specific 참조

특정 docs-site 의 HTML 구조 / 사이드바 / CSS 클래스 / 배포 설정은 site 별 reference 파일:
- [references/site-template-custodial-db.md](references/site-template-custodial-db.md) — `docs-site/custodial-wallet-db-design/` 의 HTML scaffolding · sidebar 구조 · glossary `(?)` CSS · mermaid + svg-pan-zoom CDN · Cloudflare Pages 배포 명령

다른 docs-site 가 추가되면 같은 형태로 `site-template-*.md` 를 더 둔다.

---

_본 skill 은 일반 룰. site-specific 디테일은 references/ 의 site-template-*.md 로 분리. 사용자 feedback 으로 패턴이 새로 잡히면 본 SKILL.md 또는 references/ 의 해당 파일을 점진적으로 업데이트._
