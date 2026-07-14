# blockchain-manager — 독립 모듈 진입점

> 이 폴더는 waas-wiki 저장소 안에 있지만 **wiki 3-layer 체계와 무관한 독립 모듈**이다.
> 상위 CLAUDE.md 의 wiki discipline (entity 흡수 분석, Mode A/B/C ingest, 출처 표기 규칙 등) 은
> 이 폴더에는 적용하지 않는다.

## 1. 정체성

- **무엇**: GitHub 저장소의 마크다운 문서를 칸반보드로 보여주고, 드래그로 상태를 바꾸면
  GitHub API 로 frontmatter 를 커밋해 실제 반영하는 웹앱 + 관리 대상 문서 묶음.
- **배포**: Cloudflare Pages (정적 프론트 + Pages Functions).
- **첫 문서 세트**: `docs-site/wallet-design-walkthrough/` 11개 장을 요약한 마크다운 문서.

## 2. 폴더 구조

```
blockchain-manager/
  CLAUDE.md                  ← 본 파일
  DESIGN.md                  ← Binance 디자인 시스템 추출본. 앱 UI 스타일의 근거.
  claude-code-loops-guide.md ← 참고 문서 (칸반 관리 대상 아님)
  docs/                      ← 칸반이 관리하는 문서. 마크다운 + frontmatter 필수.
    <대카테고리>/<중카테고리>/*.md   ← 2단계 폴더 = 대·중카테고리 (폴더명이 source of truth)
    블록체인매니저/설계/     ← 첫 문서 세트
    트래블룰/ 캔톤네트워크/ 무스비 PoC/  ← 대카테고리 예약 (분류 폴더 만들면 UI 에 자동 반영)
  app/                       ← 웹앱. Cloudflare Pages 프로젝트 루트.
    public/                  ← 정적 프론트엔드 (빌드 스텝 없음)
    functions/api/           ← Pages Functions. GitHub API 프록시 (토큰은 서버사이드만)
    .dev.vars.example        ← 로컬 개발 환경변수 템플릿 (.dev.vars 는 git 커밋 금지)
```

## 3. 문서 규약 (docs/)

모든 문서는 YAML frontmatter 로 시작한다:

```yaml
---
title: <카드에 표시될 제목>
status: To Do                   # To Do | In Progress | Done | 아카이브
---
```

- **대·중카테고리는 frontmatter 가 아니라 폴더 구조** — `docs/<대카테고리>/<중카테고리>/<file>.md`.
  새 카테고리는 폴더만 만들면 UI(홈 → 대카테고리 → 중카테고리 → 칸반)가 자동 인식한다.
- `status` 값은 위 4개 문자열만 유효. **필드가 없으면 "To Do" 로 분류**된다.
- `view: doc` (선택) — 이 문서만 있는 중카테고리는 칸반(4컬럼) 대신 **원본 문서를 그대로** 렌더한다.
  상태 집계에서도 빠진다. 예: `블록체인매니저/API/api.md` (api-docs `build.py` 생성물).
- `embed: <app/public 내 html>` (선택, view: doc 와 함께) — 마크다운 렌더 대신 **자체 HTML 뷰어를
  iframe 으로** 띄운다. 예: `embed: api-doc.html` — build.py 가 `app/public/api-doc.html` 로도 내보내는
  api-docs 원본 뷰어가 디자인 그대로 뜬다. 앱 테마가 iframe 에 동기화된다.
  ★ embed 파일명은 `/api/*`(Functions) 와 겹치는 `api.html` 같은 이름 금지 — pretty-URL 리다이렉트 충돌.
- 카드 요약은 frontmatter 다음 본문 첫 2줄에서 자동 추출 — 문서 첫 단락을 요약답게 쓸 것.
- 마지막 수정일은 GitHub 커밋 이력에서 가져온다 (문서에 날짜를 적지 않는다).
- **status 는 git 이 아니라 KV 오버레이에 저장된다** (Stage: KV 전환). frontmatter 의 status 는
  **초기값(seed)** — KV 에 값이 있으면 그것이 이긴다. 드래그·순서변경은 커밋을 만들지 않는다.
  문서 파일의 frontmatter status 를 직접 고쳐도 KV 오버레이가 있으면 화면엔 KV 값이 뜬다.

## 4. 앱 아키텍처

- **프론트**: 프레임워크 없는 정적 HTML/JS/CSS. 4컬럼 (To Do / In Progress / Done / 아카이브),
  HTML5 드래그앤드롭, 카드 클릭 시 마크다운 미리보기 모달.
- **API (Pages Functions)**:
  - `GET /api/board` — docs/ 트리 + 카드(제목·요약·수정일) + KV 상태·순서 오버레이 적용
  - `GET /api/doc?path=<file>` — 문서 원문 (미리보기). status 는 KV 오버레이 적용
  - `PATCH /api/doc` — status 를 **KV(BOARD)** 에 기록 (커밋 없음)
  - `PUT /api/order` — 대·중카테고리 순서를 **KV(BOARD)** 에 기록 (커밋 없음)
- **상태·순서 저장 = KV 오버레이.** 단일 키 `state` = `{ statuses: {<path>: status}, order: {categories, subcategories} }`.
  문서 마크다운은 git 이 정본, 자주 바뀌는 상태만 KV. 순서는 KV → git `.board-order.json`(seed) → 가나다 순 fallback.
- **GitHub 토큰은 브라우저에 절대 노출하지 않는다.** 모든 GitHub 호출은 Functions 가 대행.

### 환경변수 / 바인딩 (Cloudflare Pages 설정 / 로컬 .dev.vars·플래그)

| 변수·바인딩 | 값 예시 | 설명 |
|---|---|---|
| `GITHUB_TOKEN` | (secret) | Fine-grained PAT. 대상 저장소 Contents Read/Write 권한만 |
| `GITHUB_OWNER` | `eunsujeo` | 저장소 소유자 |
| `GITHUB_REPO` | `eunpus` | 저장소 이름 |
| `GITHUB_BRANCH` | `main` | 대상 브랜치 |
| `DOCS_PATH` | `blockchain-manager/docs` | 문서 폴더 경로 |
| `BOARD` (KV) | (namespace) | 상태·순서 오버레이. 로컬 `--kv BOARD`, 배포 시 KV namespace 바인딩 |

## 5. 스타일 규약

[DESIGN.md](DESIGN.md) 의 Binance 시스템을 따른다.

### 기반 팔레트
- 다크 캔버스 `#0b0e11`, 카드 표면 `#1e2329`, 한 단계 위 표면 `#2b3139`
- 단일 액센트 옐로 `#FCD535` — 주요 액션·강조에만, 배경 채움 금지. 옐로 버튼 텍스트는 검정 `#181a20`
- 트레이딩 색: 완료·상승 청록 `#2dbdb6`, 위험 `#f6465d`
- 폰트 대체: Inter (본문), 숫자·날짜는 tabular (`font-variant-numeric: tabular-nums`)
- 그림자 대신 표면 색 단차로 깊이 표현 (flat + color-block)

### 라이트/다크 테마 (Stage: 테마 도입)
- 모든 색은 CSS 변수로. `:root` 다크 기본 + `:root[data-theme="light"]` 오버라이드. `theme.js` 가 토글.
- ★ **라이트에서 `--surface-elevated` = 흰색**이라 흰 배경과 겹친다. 헤더·줄무늬 등 "표면 위 표면"은
  전용 토큰(`--th-bg`·`--zebra` 등)을 테마별로 두지 말고 그냥 쓰면 라이트에서 안 보인다 — 반드시 테마별 값.
- 코드 블록은 두 테마 공통으로 어두운 패널(`--code-panel-*`) — 한눈에 "코드". 인라인 코드는 테마 tint + 옅은 테두리.

### AI 클리셰 지양 (사용자 피드백)
템플릿·AI 생성물에서 흔한 장식은 쓰지 않는다. 대신 DESIGN.md 의 절제(큰 tabular 숫자·color-block)로 표현.
- ✗ 카드 좌측 색 스트립(Trello류), ✗ 색 tint 배경 pill/chip, ✗ 색 도트, ✗ 컬럼 상단 색 캡
- ✗ **문맥과 중복되는 표시** — 상태 컬럼 안 카드에 상태색, 단일 중카테고리 보드 카드에 분류 배지 등 (이미 컬럼·브레드크럼이 알려줌)
- ○ 칸반 컬럼 헤더 = **stat readout**: 작은 대문자 라벨 + 큰 tabular 카운트 + 하단 규칙선. 색은 진행=옐로·완료=청록 카운트에만
- ○ 카드 = 제목·요약 2줄·tabular 날짜만. 담백하게
- 새 UI 를 넣기 전에 "이거 AI 가 자주 쓰는 패턴인가 / 문맥과 중복인가" 자문할 것

### mermaid 규약 (docs)
- ✗ **sequence 다이어그램 alt 분기에 `rect` 배경색 지양** — 참여자 `box` tint 와 겹쳐 지저분해진다. 분기는 alt 라벨로 구분.

## 6. 운영 규칙

- ★ **자동 배포 금지** — `wrangler pages deploy` 는 사용자 명시 지시 시에만.
- ★ **wrangler 는 반드시 `blockchain-manager/app/` 에서만 실행** — 저장소 루트에서 배포하면
  wiki raw source 전체가 유출된다.
- ★ **wrangler 커밋 메시지는 ASCII 만** — `--commit-message="<ASCII-only>"` 필수 (한글 시 Invalid UTF-8 거절).
- ★ **`.dev.vars` (실제 토큰) 은 git 에 커밋 금지** — `.gitignore` 로 차단.
- 상태·순서는 KV 에 저장되므로 칸반 조작이 더는 git 커밋을 만들지 않는다. 문서 내용 편집만 커밋 대상.
- `.wrangler/` 로컬 상태가 깨지면(예: `_cf_ALARM` SQLite 오류) `rm -rf .wrangler` 후 재기동.

## 7. 로컬 개발 / 배포 빠른 참조

KV 바인딩은 `wrangler.toml` 의 `[[kv_namespaces]] binding = "BOARD"` 로 로컬·배포 공통 적용된다
(네임스페이스 id `6596a99a23af485983828d35c4fea875` 이미 등록됨).

```bash
cd blockchain-manager/app
cp .dev.vars.example .dev.vars   # 최초 1회 — 토큰 채우기

./dev.sh          # 로컬 기동 (포트·캐시 정리 포함). http://localhost:8788
./dev.sh clean    # 캐시 손상(_cf_ALARM·middleware build 오류) 시 .wrangler 전체 초기화 후 기동

# 보드 전체를 단일 HTML 로 내보내기 (읽기 전용 · 파일 하나로 전달) → ../board.html (커밋 안 함)
# 앱이 떠 있으면 KV 상태·순서 반영, 아니면 frontmatter seed
node scripts/export-board.mjs

# 배포 (사용자 지시 후에만) — toml 이 BOARD KV 를 함께 바인딩
npx wrangler pages deploy public --project-name=blockchain-manager \
  --commit-message="deploy blockchain manager kanban"
npx wrangler pages secret put GITHUB_TOKEN --project-name=blockchain-manager
```

`dev.sh` 가 하는 일: `.dev.vars` 확인 → 남은 wrangler·포트 점유 정리 → `.wrangler/tmp` 비움
(로컬 KV state 는 보존; `clean` 인자면 `.wrangler` 전체 삭제) → `wrangler pages dev` 기동.
