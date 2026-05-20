# waas-wiki

블록체인 **Wallet-as-a-Service(WaaS)** 리서치를 위한 LLM Wiki. 단순 RAG가 아니라, 원본 문서를 LLM이 점진적으로 읽고 **개념별 위키**로 재구성·유지하는 영속 지식 베이스다.

기반 패턴은 [`llm-wiki.md`](llm-wiki.md) 참고. 1차 리서치 대상은 **Fireblocks**.

---

## 프로젝트 목적

- 여러 WaaS 벤더(Fireblocks를 시작으로 Privy, Coinbase WaaS, BitGo, Dfns 등)를 깊이 있게 비교·분석한다.
- 문서별 요약이 아니라 **개념·아키텍처 단위**로 정리된 위키를 만든다.
- 원본 PDF/웹페이지를 보존하고, 모든 주장에 **출처(파일명 + 페이지)** 를 남길 수 있는 구조를 유지한다.
- 추후 MCP 서버, Vector DB, 자동 ingest 파이프라인을 붙일 수 있도록 확장 가능한 폴더 구조를 갖는다.

## 디렉토리 구조

```
waas-wiki/
├── README.md                  ← 이 파일
├── llm-wiki.md                ← 위키 패턴 원본 (참고용)
│
├── sources/                   ← 원본 자료 (불변, LLM은 읽기만)
│   └── fireblocks/
│       ├── pdf/               ← ★ PDF 원본을 여기에 넣어라
│       ├── markdown/          ← PDF → MD 변환 결과
│       ├── webpages/          ← 웹 클립 (Obsidian Web Clipper 등)
│       └── images/            ← 다이어그램·스크린샷
│
├── vendors/                   ← 사람이 읽는 벤더별 정리본 (LLM이 작성)
│   └── fireblocks/
│       ├── overview.md
│       ├── architecture.md
│       ├── mpc.md
│       ├── policy-engine.md
│       ├── tap.md
│       ├── cosigner.md
│       ├── callback-handler.md
│       ├── api.md
│       ├── compliance.md
│       └── risks.md
│
├── entities/                  ← 개념 사전 (Vault Account, Transaction 등)
│   └── fireblocks/
│       ├── workspace.md
│       ├── vault-account.md
│       ├── transaction.md
│       ├── policy.md
│       ├── cosigner.md
│       └── callback-handler.md
│
├── open-questions/            ← 추측 금지, 모르면 여기에 기록
│   └── fireblocks.md
│
├── prompts/                   ← 재사용 가능한 작업 프롬프트
│   ├── ingest-pdf.md
│   ├── extract-entities.md
│   └── update-wiki.md
│
└── scripts/                   ← (추후) PDF→MD 변환 등 자동화 스크립트
```

## PDF는 어디에 넣어야 하는가

**원본 PDF는 반드시 `sources/fireblocks/pdf/` 안에 넣어라.**

- 파일명 컨벤션: `YYYY-MM-DD__<slug>.pdf`
  - 예: `2024-09-12__fireblocks-mpc-cmp-whitepaper.pdf`
  - 날짜는 문서 발행일 또는 다운로드일 (가능하면 발행일)
  - slug는 소문자·하이픈, 출처가 명확하게
- 가능하면 동일 파일명의 `.meta.yml` 또는 `.meta.md`를 함께 둬서 다음을 기록한다:
  - 원본 URL
  - 다운로드 날짜
  - 문서 종류 (whitepaper / docs / blog / pricing / 등)
  - 페이지 수, 언어

## Markdown 변환 결과는 어디에 넣는가

**`sources/fireblocks/markdown/`** 에 둔다.

- 파일명은 PDF와 동일 stem을 쓴다 (확장자만 `.md`).
  - `2024-09-12__fireblocks-mpc-cmp-whitepaper.pdf` → `2024-09-12__fireblocks-mpc-cmp-whitepaper.md`
- 가능한 한 **원본 페이지 번호를 보존**한다. 본문 안에 `<!-- page: 7 -->` 같은 마커를 남기거나, 섹션 헤더 옆에 `(p.7)`을 붙인다 → 위키에서 인용할 때 출처가 명확해진다.
- 변환 도구는 아직 미정. 일단 수동/외부 도구로 변환하고, 추후 `scripts/`에 자동화한다.

웹 클립(블로그·docs HTML)은 `sources/fireblocks/webpages/`, 다이어그램·스크린샷은 `sources/fireblocks/images/`에 둔다.

## Wiki 작성 원칙

1. **개념 단위 정리**, 문서별 요약 금지.
   - "이 PDF의 요약"이 아니라 "Fireblocks의 MPC 구조는 무엇인가" 식으로 페이지를 구성한다.
2. **벤더 정리본은 `vendors/`, 개념 사전은 `entities/`** 로 역할을 분리한다.
   - `vendors/fireblocks/mpc.md` — Fireblocks가 MPC를 어떻게 구현·운용하는지 (긴 글)
   - `entities/fireblocks/vault-account.md` — Vault Account가 무엇이고 어떤 속성/관계를 가지는지 (사전 항목)
3. **모든 markdown 페이지는 다음 6 섹션 템플릿**을 따른다:
   - `## Summary` — 2~5문장
   - `## Key Concepts` — bullet
   - `## Details` — 본문, 출처 인용 포함
   - `## Related Pages` — `[[...]]` 또는 상대경로 링크
   - `## Sources` — 어떤 파일/페이지에서 가져왔는지
   - `## Open Questions` — 이 페이지 한정 미해결 질문
4. **위키 간 링크는 상대경로**로 건다. 예: `[Vault Account](../../entities/fireblocks/vault-account.md)`
5. 새 페이지/큰 업데이트가 생기면 `Related Pages`의 양방향 링크도 같이 갱신한다.

## Vendor Hub vs Entity Detail (split rule)

`vendors/<vendor>/` 와 `entities/<vendor>/` 의 역할 분리는 Stage 1 부터 의도된 패턴이다. Source Lake 가 커져도 이 분리를 유지하여 retrieval / promote 동선을 안정화한다.

### 역할 구분

| 영역 | 역할 | 길이/형태 | 예시 |
|---|---|---|---|
| **`vendors/<vendor>/*.md`** | **Navigation hub** — 도메인 overview / workflow / 여러 entity 간 cross-cut / risk summary | 긴 글, 8 KB ~ 28 KB | `vendors/fireblocks/architecture.md`, `vendors/fireblocks/user-management.md`, `vendors/fireblocks/security.md` |
| **`entities/<vendor>/*.md`** | **Entity-grade detail** — 단일 reusable concept 의 속성·관계·lifecycle | 사전 항목, 2 KB ~ 15 KB | `entities/fireblocks/admin-quorum.md`, `entities/fireblocks/policy.md`, `entities/fireblocks/mpc-key-share.md` |

→ Hub 는 **"Fireblocks 가 X 를 어떻게 운용하는가"**, entity 는 **"X 가 무엇이며 어떤 속성·관계를 갖는가"**.

### Stem 중복은 의도된 패턴

같은 stem 으로 hub 와 entity 가 동시 존재하는 케이스 (예: `cosigner`, `callback-handler`) 는 **버그가 아니라 의도된 split**:

- `vendors/fireblocks/cosigner.md` — Cosigner workflow / 운영 패턴 / API Co-signer 와 Mobile Co-signer 비교 hub
- `entities/fireblocks/cosigner.md` — Cosigner entity 의 속성 (type, host, authentication method) 사전 항목

→ 같은 도메인의 hub 가 entity 보다 더 큰 scope (운영/리스크/cross-cut) 를 다루므로 stem 충돌이 발생. Stem rename 으로 강제 구분 시 wikilink discoverability 가 떨어지므로 그대로 유지.

### Hub ↔ Entity cross-link 원칙

1. **모든 entity 는 ≥ 1 개 hub 와 backlink** — entity 가 어떤 도메인 hub 에 속하는지 명시 (현재 모든 24 entity + 9 user-role 이 이 원칙 충족)
2. **Hub 는 다루는 entity 를 모두 wikilink** — hub 의 `## Related Pages` 또는 본문에 wikilink 형식 `entities/<vendor>/<entity>` 로 outbound 링크 (Obsidian-style double-bracket)
3. **Entity 끼리의 cross-link 는 sparse** — 직접 관계 (예: `policy` ↔ `approval-group`) 만 양방향. 도메인 cross-cut 은 hub 경유.
4. **Open Q 는 entity 와 hub 모두 wikilink** — Q 가 어떤 entity 의 미확정 속성인지 + 어떤 hub 의 운영 영역인지 둘 다 표시

### Entity-min discipline

신규 entity 생성을 **강력 제약**한다. Stage 6 이후 11 stage 연속 신규 entity 0 유지 (Stage 16 기준).

- **이유**:
  - Entity explosion 시 cross-link 폭증 → retrieval 동선 혼란
  - 새 사실은 보통 기존 entity 의 attribute 또는 hub 의 section 으로 흡수 가능
  - Hub 의 anchor (e.g., `security.md §"FSPM"`) 가 entity 와 동등한 retrieval target 역할 수행
- **신규 entity 생성 조건** (모두 True 일 때만):
  1. 기존 24 entity / 9 user-role 어느 것에도 흡수 불가
  2. 어느 hub 의 section 으로도 처리 불가
  3. 다른 entity 와 ≥ 3 개 cross-link 발생 예정
- → 위 조건 미충족 시 hub section 또는 entity attribute 으로 통합

### Promote / Retrieval 관점 역할

| 시나리오 | 1차 retrieval target |
|---|---|
| **"Fireblocks 는 X 를 어떻게 운영하는가"** (workflow / cross-cut) | hub (`vendors/<vendor>/<도메인>.md`) |
| **"X 의 정확한 정의·속성·제약은"** (entity-grade) | entity (`entities/<vendor>/<concept>.md`) |
| **"이 사실의 근거 source 는"** | Source Lake (`sources/<vendor>/markdown/...`) → entity/hub 의 `## Sources` 절 cite |
| **"미확정 / 추측 영역은"** | `open-questions/<vendor>.md` |
| **"새 PDF/webpage 가 들어왔을 때 어디에 들어가는가"** | hub 의 신규 section OR 기존 entity 의 attribute (신규 entity 는 마지막 선택지)|

## 출처 관리 원칙

- 모든 사실 진술에는 가능한 한 출처를 남긴다. 형식 예시:
  - `(source: 2024-09-12__fireblocks-mpc-cmp-whitepaper.md, p.7)`
  - `(source: docs.fireblocks.com/api/vault-accounts, accessed 2026-05-18)`
- 출처는 페이지 하단 `## Sources` 섹션에서 한 번 더 모은다.
- **출처 없는 추측은 본문에 넣지 않는다.** 추측·해석은 명시적으로 "추론(inference):" 라벨을 붙이거나 Open Questions로 옮긴다.

## 추측 금지 원칙

- 원본 자료에 없는 내용을 **소스 있는 것처럼 쓰지 않는다.**
- 잘 모르겠으면 `open-questions/fireblocks.md`에 질문 형태로 기록하고 본문에서는 비워둔다.
- 다른 벤더의 일반 패턴을 Fireblocks에 그대로 적용해서 채우지 않는다 (벤더마다 구현이 다르다).
- LLM의 사전 학습 지식만으로 채워야 한다면, 본문에 `> [unverified — 사전학습 기반, 1차 자료로 확인 필요]` 같은 표식을 남긴다.

## 다음 단계

1. 사용자(나)가 Fireblocks 관련 PDF를 다운로드하여 `sources/fireblocks/pdf/`에 넣는다.
2. PDF → Markdown 변환을 수행하고 결과를 `sources/fireblocks/markdown/`에 저장한다 (수동 또는 도구 사용).
3. `prompts/ingest-pdf.md`를 사용하여 변환된 Markdown을 LLM과 함께 ingest하고, `vendors/fireblocks/` 및 `entities/fireblocks/` 페이지를 업데이트한다.
4. 위키가 어느 정도 차오르면 `scripts/`에 변환 자동화 스크립트와 lint 스크립트를 추가한다.
5. 그 다음 단계로 MCP 서버 / Vector DB 연동을 검토한다 (지금은 아직 만들지 않는다).
