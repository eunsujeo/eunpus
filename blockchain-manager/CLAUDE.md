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

[DESIGN.md](DESIGN.md) 의 Binance 시스템을 따른다:

- 다크 캔버스 `#0b0e11`, 카드 표면 `#1e2329`, 한 단계 위 표면 `#2b3139`
- 단일 액센트 옐로 `#FCD535` — 주요 액션·강조에만, 배경 채움 금지
- 옐로 버튼 텍스트는 검정 `#181a20` (시그니처 조합)
- 폰트 대체: Inter (본문), 숫자·날짜는 tabular 성격 유지
- 그림자 대신 표면 색 단차로 깊이 표현 (flat + color-block)

## 6. 운영 규칙

- ★ **자동 배포 금지** — `wrangler pages deploy` 는 사용자 명시 지시 시에만.
- ★ **wrangler 는 반드시 `blockchain-manager/app/` 에서만 실행** — 저장소 루트에서 배포하면
  wiki raw source 전체가 유출된다.
- ★ **wrangler 커밋 메시지는 ASCII 만** — `--commit-message="<ASCII-only>"` 필수 (한글 시 Invalid UTF-8 거절).
- ★ **`.dev.vars` (실제 토큰) 은 git 에 커밋 금지** — `.gitignore` 로 차단.
- 상태·순서는 KV 에 저장되므로 칸반 조작이 더는 git 커밋을 만들지 않는다. 문서 내용 편집만 커밋 대상.
- `.wrangler/` 로컬 상태가 깨지면(예: `_cf_ALARM` SQLite 오류) `rm -rf .wrangler` 후 재기동.

## 7. 로컬 개발 / 배포 빠른 참조

```bash
cd blockchain-manager/app
cp .dev.vars.example .dev.vars   # 토큰 채우기
npx wrangler pages dev public --kv BOARD    # http://localhost:8788 (KV 로컬 네임스페이스)

# 배포 (사용자 지시 후에만)
npx wrangler kv namespace create BOARD      # 최초 1회 — 출력된 id 를 Pages KV 바인딩에 연결
npx wrangler pages deploy public --project-name=blockchain-manager \
  --commit-message="deploy blockchain manager kanban"
npx wrangler pages secret put GITHUB_TOKEN --project-name=blockchain-manager
# Pages 대시보드 Settings > Functions > KV namespace bindings 에 BOARD 바인딩 확인
```
