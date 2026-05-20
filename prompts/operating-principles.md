# Operating Principles (v3.2.2)

> Wiki 운영 방침 — Stage 12 (2026-05-19) 시점 추가 강화. Source Lake 가 370+ PDF 규모로 성장함에 따라 **PDF raw read 자체를 중단** + markdown/lightweight index 중심 운영. Stage 15 에서 **대형 텍스트 파일 (llms.txt 등) 처리 규칙** 추가.

## v3 핵심 변경 (★)

**PDF raw read 방식 중단:**
1. **PDF 는 archive/source 용도로만 유지**
2. **markdown 또는 lightweight index 만 LLM read 대상**
3. **PDF 전체 read 금지** — `Read` tool 로 PDF 직접 호출 금지
4. 필요한 경우:
   - metadata 만
   - TOC 만
   - section chunk 단위
   - placeholder markdown
   만 selective load

**특히 다음 도메인은 PDF 자체가 매우 크므로 full raw read 금지**:
- Recovery
- Architecture
- Mobile App
- MPC

**PDF ingest 가 필요하면**:
1. 먼저 lightweight markdown 생성 (filename + URL + domain tag + tier 추정)
2. section/chunk 단위로 분리 (사용자가 chunked text 또는 외부 도구로 추출 후 제공)
3. 필요한 부분만 lazy-load

## v2 원칙 유지

## Source Lake vs Curated Wiki 분리

- **Source 수집 ≠ 즉시 deep ingest**
- PDF 전체를 **한 번에 context 에 로드 금지** (v3 에서 전면 금지로 강화)
- markdown 전체를 **한 번에 한꺼번에 read 금지**
- 필요한 문서만 선택적으로 lazy load
- deep ingest 대상 외에는 placeholder/index 수준 유지

## Deep Ingest 5 Priority Domain

다음 5 domain 만 deep ingest 대상:

1. **Workspace Management**
2. **Identity / Authentication**
3. **Governance**
4. **Mobile Device / Recovery**
5. **Security / Access Control**

→ 그 외 domain (Tokenization / Exchange / Fiat / Gas Station / Gasless / Smart Transfers / Off Exchange / DeFi / Fee mechanics / Chain-specific ops 등) 은 **별도 product line** 으로 분류, Source Lake catalog 만.

## 신규 PDF 처리 절차 (3-step)

1. **Domain relevance 평가** — 5 priority domain 중 하나?
2. **Tier 분류** — TIER 1/2/3
3. **Deep ingest 필요성 평가** — 기존 spine 강화? Open Q 응답?

## Tier 처리 원칙

| Tier | 처리 | Curated Wiki 영향 |
|---|---|---|
| **TIER 1** | 현재 domain spine 강화, relationship 중심, selective deep ingest | entity/hub cite 추가 가능 |
| **TIER 2** | **기본은 meta.yml** + **검색 가치 / promote 가능성 있으면 placeholder markdown 까지 허용**. full markdown/deep ingest 는 보류 | 신규 entity 최소화 |
| **TIER 3** | raw PDF 보존, placeholder/index 만 | **deep ingest 금지** |

### TIER 2 세부 (v3.1 보강)

- **검색성 우선** — 나중에 query 가능하도록 placeholder markdown 생성 권장
- **placeholder markdown 구성**: filename + URL + domain tag + tier + cross-cut signal + promote condition (본문 fact 추측 금지)
- **full markdown 은 promote 시점까지 보류** — 외부 도구로 markdown 변환 후 진행

## Context 보호 원칙 (★)

**절대 금지**:
- 수십 개 PDF markdown 전체를 한 번에 읽기
- Source Lake 전체를 한 번에 context 에 올리기
- 모든 entity/vendor page 를 동시에 로드

**권장**:
- 필요한 문서만 lazy load
- 현재 작업 domain 과 관련된 page 만 로드
- 관련 entity/hub 만 부분적으로 참조

## 현재 목표

- Source Lake 확장
- Curated Wiki 안정화
- Relationship spine 강화
- **Entity explosion 방지**
- **Context/token 안정성 유지** — 단, deep ingest 시에는 **citation 품질을 위해 chunk/page 단위 근거를 확보**한다 (균형).

## Entity 최소화 추적

| Stage | 신규 entity |
|---|---|
| 1 | +17 |
| 2 | +1 |
| 3 | +3 |
| 4 | +5 |
| 5-10 | **0 (6 stage 연속)** |
| 11+ | 0 strict 유지 |

## Lazy-Load 패턴 (v3 강화)

새 PDF batch 처리 시:
1. **파일 목록 스캔만** — `ls` 로 신규 파일 발견
2. **filename 기반 domain triage** — 본문 로드 없이 tier 분류
3. ~~TIER 1/2 후보만 본문 read~~ → **v3: TIER 1/2 후보라도 PDF 직접 read 금지**, lightweight markdown 우선 생성
4. **TIER 3 은 raw PDF 만 유지** (rename + meta.yml optional)
5. ~~deep ingest 시 1 PDF 씩~~ → **v3: deep ingest 는 외부 도구로 chunked text 추출 후 사용자가 제공할 때만**

## v3 신규 PDF 처리 절차

```
신규 PDF batch
  ↓
filename triage (5 domain 적합도 + tier 추정)
  ↓
모든 file → rename + meta.yml (lightweight Source Lake hygiene)
  ↓
TIER 1 후보 → lightweight markdown (catalog/index 수준, URL + domain + tier 만)
  ↓
TIER 2 후보 → meta.yml only (markdown deferred)
  ↓
TIER 3 → raw PDF only (rename optional)
  ↓
deep ingest 가 진정 필요시:
  - 사용자가 외부 도구 (PDF reader / OCR / LLM extractor) 로 본문 추출 후 제공
  - 또는 markdown 변환 자동화 스크립트로 미리 변환된 markdown read
  - PDF 직접 read 는 시도하지 않음
```

## 현재 목표 (v3)

- **Context/token 안정성 유지** (최우선)
- Source Lake 보존
- Selective deep ingest 유지 (단 외부 도구 의존)
- Relationship coherence 유지

## Webpage Source (v3.2 신규)

PDF 외에 **webpage source 도 Source Lake 에 보존**. PDF 와 동일 원칙 적용.

### 저장 구조
```
sources/fireblocks/webpages/<host>/<path>/<slug>.meta.yml    ← URL metadata
sources/fireblocks/markdown/<YYYY-MM-DD>__<host-dash>__<slug>.md   ← lightweight markdown
```

예시 (Stage 13):
```
sources/fireblocks/webpages/developers/docs/introduction.meta.yml
sources/fireblocks/webpages/developers/reference/typescript-sdk.meta.yml
sources/fireblocks/webpages/developers/reference/api-overview.meta.yml
sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__docs-introduction.md
sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__reference-api-overview.md
sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__reference-typescript-sdk.md
sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__sitemap.md   ← URL catalog
```

### meta.yml 필드
- `url`
- `fetched_at`
- `source_type: webpage`
- `domain`
- `tier`
- `title`
- `crawl_status`: `not-fetched` / `nav-links-only` / `full-body`
- `promote_condition`

### lightweight markdown 필드
- Title / URL / Source Type / Domain / Tier / Cross-cut Signal / Related Hub Candidates / Promote Condition / Notes

### 크롤링 원칙

**Webpage sources**:
- **sidebar/nav crawl 허용**
- **URL catalog/sitemap 생성 허용**
- **본문 deep ingest 는 금지**
- **본문 저장은 promote 승인 후**
- **API/SDK reference 는 catalog-first**

**추가 필터 (URL 수집 시)**:
- 외부 링크 / 로그인 필요 / anchor (#) / 중복 URL 제외
- developers.fireblocks.com 같은 in-host 링크만 포함

### 한계
- WebFetch tool 은 client-rendered (JS) sidebar 를 잡지 못함
- 전체 sitemap 수집 필요시:
  - `<host>/llms.txt` (LLM-friendly index) 활용
  - browser automation (외부 도구)
  - sitemap.xml 검색

## 대형 텍스트 파일 처리 (v3.2.2 신규 — llms.txt / sitemap.xml / 큰 markdown)

**문제**: `llms.txt`, `sitemap.xml`, 또는 100 KB+ markdown / json 같은 대형 텍스트 파일을 WebFetch / Read 로 전체 로드 시:
- WebFetch 32 MB 한계 초과 가능
- LLM context window 의 token 을 거대하게 소모
- 본문 catalog 용도라면 사실상 URL inventory 만 필요

**원칙** (★):
1. **대형 텍스트 파일 본문은 LLM context 에 절대 전체 로드 금지**
2. **curl / wget 으로 로컬 파일에 저장만 수행** (raw)
3. **`wc`, `head`, `grep`, `sort`, `split` 같은 bash tool 로 file-level 처리** — 본문이 LLM 으로 들어오지 않음
4. **URL inventory 가 목적이면**: `grep -Eo` 로 URL 만 추출 → `sort -u` 로 dedupe → 별도 file 저장
5. **분포/카운트만 보고** — `wc -l`, `uniq -c | sort -rn` 결과만 context 로 가져옴
6. **markdown index 작성 시**: 분포 표 + cross-cut 후보 + promote 후보만 기록. 본문 fact 추측 금지

**Tool 사용 규칙**:
- WebFetch / Read: **대형 파일 금지** (size check 후 차단)
- Bash: `wc`, `head -n <small>`, `grep`, `sort`, `uniq`, `split` 만 권장
- 본문 추출이 필요한 경우 (예: 특정 page 만): `split` 또는 `sed -n 'X,Yp'` 로 chunk 추출 후 별도 file 로 분리, 그 file 만 Read

**예시 pipeline (Stage 15 의 llms.txt 처리)**:
```
curl -L https://developers.fireblocks.com/llms.txt \
  -o sources/fireblocks/webpages/developers/llms.txt
wc -c llms.txt    # 141,106 bytes — 본문 미로드
wc -l llms.txt    # 709 lines
grep -Eo 'https://developers\.fireblocks\.com/[^ )]+' llms.txt \
  | sort -u > llms-urls.txt
grep -E '/docs/|/reference/|/api-reference/' llms-urls.txt \
  > llms-docs-reference-urls.txt
grep -Eo 'api-reference/[^/]+' llms-urls.txt | sort | uniq -c | sort -rn
```
→ context 에는 분포 + URL list (필요시) 만 들어옴. 141 KB 본문은 절대 로드되지 않음.

## 메모리

이 파일은 모든 후속 stage 에서 참조. `prompts/ingest-pdf.md` 와 함께 ingest workflow 의 메타 spec.

## 변경 이력
- **v1** (Stage 1-7): 표준 deep ingest mode
- **v2** (Stage 8-11): lazy-load + 5 priority domain 도입
- **v3** (Stage 12): PDF raw read 중단, markdown/lightweight index 중심
- **v3.1** (Stage 12 post-edit): TIER 2 검색성 placeholder markdown 허용; citation 품질 balance
- **v3.2** (Stage 13): Webpage source 추가 (developer docs / web crawling); PDF 와 동일 원칙
- **v3.2.1** (Stage 13 post-edit): Webpage source 원칙 명확화 — sidebar/nav crawl + sitemap 허용, 본문 deep ingest 금지, 본문 저장은 promote 승인 후, API/SDK reference 는 catalog-first
- **v3.2.2** (Stage 15): 대형 텍스트 파일 (llms.txt / sitemap.xml 등) 처리 규칙 — curl 로 file 저장만, bash pipeline (wc/grep/sort/split) 로 file-level 처리, 본문 LLM context 미로드
