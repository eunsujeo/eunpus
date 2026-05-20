# Prompt: Ingest Source (PDF / Webpage) — v3.2.2

> **Operating policy**: [operating-principles.md](operating-principles.md) v3.2.2.
> **v1 (legacy)** 의 "변환본을 처음부터 끝까지 읽어라" 절차는 **superseded** — Source Lake 가 370+ PDF + 716 URL 규모로 성장하여 full-read 패턴은 context/token 한계와 충돌한다.

## 처리 모드 결정 (★ 첫 단계)

신규 source 도착 시 **3 모드 중 하나** 로 분기:

| Mode | 조건 | 행동 |
|---|---|---|
| **A. catalog-only** | TIER 3 또는 cluster (>10 file batch) | rename + meta.yml + cluster-catalog markdown. **본문 미로드.** |
| **B. lightweight-index** | TIER 1 후보 (5 priority domain 직격) + 본문 deep ingest 결정 보류 | filename + URL + domain tag + tier + cross-cut signal + promote condition. **본문 fact 추측 금지.** |
| **C. full ingest** | TIER 1 confirmed + 사용자 명시 promote | 외부 도구 (PDF reader / OCR / LLM extractor / browser automation) 로 **chunked text 추출 후 사용자가 제공한 markdown chunk 만** read. PDF/webpage 본문 직접 read 금지. |

대부분의 신규 source 는 **A 또는 B** 로 처리. **C** 는 사용자 promote 승인 후만.

## 사전 조건

### PDF source
- 원본 PDF: `sources/<vendor>/pdf/<filename>.pdf`
- meta.yml: `sources/<vendor>/pdf/<filename>.meta.yml` (rename + 도메인 분류 후)
- Markdown 변환본: `sources/<vendor>/markdown/<YYYY-MM-DD>__<host>__<slug>.md` (모드 B/C 일 때만)

### Webpage source
- meta.yml: `sources/<vendor>/webpages/<host>/<path>/<slug>.meta.yml`
- Markdown 변환본: `sources/<vendor>/markdown/<YYYY-MM-DD>__<host-dash>__<slug>.md` (모드 B/C 일 때만)
- 대형 텍스트 파일 (`llms.txt`, `sitemap.xml`, 100 KB+): **본문 LLM context 미로드** — `curl` 저장 + bash pipeline (wc / head / grep / sort / split) 로 URL inventory 만 추출 (operating-principles.md §"대형 텍스트 파일 처리").

## 모드 A — catalog-only (TIER 3 또는 cluster batch)

1. **신규 file 목록 스캔만** — `ls` 로 발견, 본문 미로드
2. **Filename 기반 domain triage** — 5 priority domain 적합도 + tier 추정
3. **Rename + meta.yml** 만 수행 — `sources/<vendor>/{pdf,webpages}/...` hygiene
4. **Cluster catalog markdown** 작성 (≥10 file batch 일 때):
   - 파일명 list + URL + domain category
   - **각 file 의 본문 fact 추측 금지** — 표지/제목/URL 기반의 cross-cut signal 만 기록
   - 5 priority domain 별 promote 후보 매핑
   - Open Q 응답 후보 (promote 시점에 확인 가능) 라벨링
5. **Curated Wiki 영향 없음** — 본 단계에서는 entity/hub 수정 금지

## 모드 B — lightweight-index (TIER 1 후보, 본문 보류)

1. **Filename + URL + domain tag** 확정
2. **Lightweight index markdown** 작성:
   - title / URL / source type / tier / domain category
   - **Why TIER 1**: 기존 spine 강화 측면 + 5 priority domain 적합성
   - **Cross-cut signal**: 기존 entity/hub 와의 예상 연결 (단 본문 fact 추측 금지)
   - **Related**: `[[entities/<vendor>/...]]` / `[[vendors/<vendor>/...]]` 후보 wikilink
   - **Promote condition**: 어떤 시점에 deep ingest 할지
3. **meta.yml** 에 `tier: 1` + `crawl_status: nav-links-only` 또는 `not-fetched`
4. **Curated Wiki 영향 없음** — promote 승인 전까지 entity/hub 수정 금지

## 모드 C — full ingest (TIER 1 confirmed, 사용자 promote 후만)

1. **사용자가 외부 도구로 추출한 chunk/page 단위 markdown** 만 read
   - 옵션: PDF reader (Adobe / Preview), OCR (Tesseract), LLM extractor (외부 도구), browser automation (Playwright)
   - **PDF/webpage 자체를 Read tool 로 직접 호출 금지** (v3 policy)
2. **Chunk 단위로 처리**:
   - 한 chunk 당 takeaway 5–15 bullet
   - 각 bullet 에 `(source: <filename>.md, p.N)` 형식 출처
   - 추측 금지. 본문에 없으면 Open Q 로 분리
3. **영향받는 위키 페이지 후보 분류**:
   - vendors/<vendor>/ 의 어떤 hub 가 업데이트되어야 하는가
   - entities/<vendor>/ 의 어떤 entity 가 업데이트되어야 하는가
   - **신규 entity 생성은 강력 비권장** (entity-min discipline) — 기존 entity/hub 에 흡수 가능한지 먼저 검토
4. **Open Q 응답**:
   - 어떤 Open Q 가 이 chunk 로 ANSWERED 되는가
   - Open Q `Status:` 필드 업데이트 + `Answer:` + 적용 entity/hub wikilink + 출처 markdown 명시
5. **분석 보고 + 사용자 승인 대기**
6. **승인 후 파일 수정** — diff 형태로 한 번에 하나씩
   - 각 fact 진술 옆에 `(source: <filename>.md, p.N)` 출처
7. **Log entry** 한 줄 제안:
   ```
   ## Stage N (YYYY-MM-DD) — <도메인> deep ingest (mode C)
   - source: <filename>
   - ANSWERED: Q-... / Q-...
   - 영향받은 페이지: ...
   - 신규 entity: 0 (또는 +N 사유 포함)
   ```

## 출력 규약 (모든 모드)

- 1–4 단계 보고 → **사용자 승인 대기**
- 5 단계 (실제 파일 수정) 는 승인 후만
- 6 단계 log entry 는 모든 모드에서 작성 (catalog-only 도 stage 진행 추적)

## 추측 금지 원칙 (★)

- 본문 fact 추측 금지 (catalog/index 단계 특히 엄수)
- Cross-cut signal 은 filename / URL / domain tag 기반 예측까지만 (예: "Cold Wallet 의 MPC 모델이 Hot 과 다를 가능성" 은 기재 가능, "Cold Wallet 은 4-share MPC 사용한다" 는 금지)
- 본문 fact 가 필요하면 → Open Q 로 분리하거나 Mode C promote

## Entity 최소화 (Stage 6–16 = 11 stage 연속 0)

신규 entity 생성 전 점검 항목:
1. 기존 entity (24개) 또는 user-role (9개) 에 흡수 가능한가?
2. 기존 vendor hub (16개) 의 한 section 으로 처리 가능한가?
3. cross-cut wikilink + 본 hub 의 section 으로 owning 가능한가?

→ 모두 No 일 때만 신규 entity 생성. **그 경우 Stage 카운터 reset 됨.**

## 관련 프롬프트

- [operating-principles.md](operating-principles.md) — 운영 방침 (v3.2.2)
- [extract-entities.md](extract-entities.md) — 변환본에서 entity 후보 뽑기 (Mode C 전용)
- [update-wiki.md](update-wiki.md) — 기존 페이지 수정 시 규칙

## 변경 이력

- **v1** (Stage 1–7): full-read 표준 deep ingest mode
- **v3.2.2** (Stage 17, 2026-05-19): 3-mode 분기 (catalog-only / lightweight-index / full ingest) + PDF/webpage 직접 read 금지 + 외부 chunk 추출 의존 + 대형 텍스트 파일 처리 명시
