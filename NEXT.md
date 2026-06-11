# Next Work Session — Fireblocks Key Link docs-site 신규 작성

> 다음 차례 작업의 handoff 문서. 새 Claude Code 세션 (다른 PC 포함) 이 본 문서만 보고도 작업을 곧바로 이어갈 수 있도록 self-contained 하게 작성.
> 작성 시점: 2026-05-22. 작업 대상 시점: 사용자 지정.

## 1. 작업 개요

- **작업 성격**: `docs-site/` 에 **Fireblocks Key Link 신규 reference 문서 작성**
- **참고 구조**: [`docs-site/fireblocks-cold-wallet-bank-design/`](docs-site/fireblocks-cold-wallet-bank-design/) (8 페이지) — 동일 패턴 mirror
- **사용할 skill**: [`.claude/skills/doc-author/`](.claude/skills/doc-author/) — description trigger 가 "신규 페이지 작성" / "X reference 문서" 에 매칭
- **신규 폴더**: `docs-site/fireblocks-key-link-bank-design/`
- **docs-site/index.html 카드**:
  - 배지: `badge-pending-review` (🟡 리뷰 전)
  - 업데이트: **2026-05-21**
  - Sections: 7
  - 위치: 기존 카드 list 의 적절한 위치 (cold-wallet 카드 옆 권장)

## 2. 자료 — 이미 ingest 완료, 추가 ingest 불필요

### 2.1 wiki body (정밀 인용 가능)

| 파일 | 핵심 fact |
|---|---|
| `vendors/fireblocks/security.md` §Stage 36 — Customer Signature Validation Plane | Validation Key + Signing Key 모델 / PoO 2 methods (Interactive + Non-interactive) / cert flow / Risk-S17 |
| `vendors/fireblocks/risks.md` §Stage 36 + Stage 38 | Risk-KL01-KL07 (Customer Server SPOF / Agent open-source / Beta / Validation Key compromise / HSM Adaptor cold-latency / PoO replay / Workspace immutability) + Stage 38 Thales 사실 |
| `entities/fireblocks/workspace.md` | Key Link workspace type (immutable) |
| `entities/fireblocks/cosigner.md` | Fireblocks Agent variant (open-source TS) |
| `entities/fireblocks/mpc-key-share.md` | Validation Key + Signing Key 매핑 |
| `open-questions/fireblocks.md` §Stage 36 + Stage 38 | Q-KL01-KL05 (open) + Q-FB01-FB03 (Stage 38) |

### 2.2 1차 source (Mode C ingested)

| 파일 | 내용 |
|---|---|
| `sources/fireblocks/markdown/2026-05-22__support-fireblocks-io__fireblocks-key-link-overview-extracted.txt` | Key Link overview, p.1-3 (Customer Server SPOF, Agent open-source, customer-held key plane) |
| `sources/fireblocks/markdown/2026-05-22__support-fireblocks-io__getting-started-with-fireblocks-key-link-extracted.txt` | PoO 2 methods, validation key 등록, cert flow, p.1-9 |
| `sources/fireblocks/markdown/2026-05-22__support-fireblocks-io__set-up-your-fireblocks-vault-with-key-link-extracted.txt` | Vault key exclusivity, workspace setup, p.1-4 |
| `sources/fireblocks/markdown/2026-05-22__fireblocks-com__enterprise-digital-asset-security-thales.md` | Thales Luna HSM 통합 (FIPS 140-3 L3 + Common Criteria + PQC) + Hot/Warm/Cold 3-mode framing + air-gap = USB/SFTP/data diodes |

### 2.3 Cold Wallet docs 와의 cross-cut

`docs-site/fireblocks-cold-wallet-bank-design/bank-operations.html` §6.3 에 이미 "옵션 C — Key Link + Cold" 와 "옵션 C-Thales" 가 표로 명시. 본 신규 docs 작성 시 이 페이지로 cross-link.

## 3. 페이지 구조 — 7 페이지 plan

| # | 페이지 | 다루는 내용 |
|---|---|---|
| 0 | `index.html` | Overview + 3-way 비교 (SaaS MPC / Hosted MPC / Key Link) + 핵심 invariant + 도입 의사결정 시나리오 |
| A1 | `key-link-fundamentals.html` | 정의 / customer-held HSM / Validation+Signing key 모델 / paired alternate signing plane (Customer Signature Validation Plane) |
| A2 | `architecture-components.html` | Fireblocks Agent (open-source TS) + HSM Adaptor (optional, cold HSM) + Customer Server + Validation Key plane + Thales Luna HSM 통합 |
| B1 | `key-registration-poo.html` | Validation/Signing Key 등록 절차 + PoO 2 methods (Interactive vs Non-interactive cert flow) |
| B2 | `signing-flow.html` | Hot · Warm · Cold 3-mode signing workflow + air-gap transport (USB / SFTP / data diodes) + Thales Luna HSM 시각화 |
| C1 | `bank-deployment.html` | KR 은행 도입 시 Key Link 활용 + 망분리 적합성 + KR 컴플라이언스 매핑 (옵션 C-Thales) + cross-link to fireblocks-kr-vasp-compliance |
| C2 | `risks-open-questions.html` | Risk-KL01-KL07 + Q-KL01-KL05 + Q-FB01-FB03 + KR 검증 항목 (망분리 해석, MPC 실질통제 판단 등) |

## 4. 적용할 doc-author skill 룰 (필수)

- **§2.1 평이한 한글** — jargon glossary `(?)` tooltip (HSM / PKCS#11 / PQC / TEE / SGX 등 처음 등장 시 풀이)
- **§2.2 출처 callout 2-tier** — 모든 페이지 상단에:
  - "공식 문서에 정의된 사실 (그대로 받아도 안전)"
  - "저자가 합리적으로 추정한 운영 권장 (참고용, 본인 환경 검증 권장)"
- **§2.3 wiki 잔재 0** — `★ Hypothesis` 마커 / `.md` p.N 인라인 인용 / `§` section sign / `Stage N` 마커 / `Mode A/B/C` pseudo-tag 모두 사용 금지. 평이한 한국어 ("저자 추정", "공식 문서 — Key Link Overview" 등) 로
- **§2.5 mermaid 색 팔레트**:
  - good `fill:#dcfce7,stroke:#16a34a`
  - bad `fill:#fee2e2,stroke:#dc2626`
  - wait `fill:#fef3c7,stroke:#d97706`
  - special `fill:#e0e7ff,stroke:#6366f1`
  - vault `fill:#dbeafe,stroke:#2563eb`
  - direction LR (단일 흐름) / TB (트리)
  - 이모지 + 한글 + 영문 status code label
  - 각 diagram 에 `<p class="diagram-caption">` 캡션
  - 페이지 하단에 mermaid + svg-pan-zoom CDN script 2 줄 추가
- **§2.7 consistency check** — 작업 종료 시 `python3 .claude/skills/doc-author/scripts/check-consistency.py docs-site/fireblocks-key-link-bank-design` 4/4 PASS 까지
- **출처 인용 정직성** — "Key Link cluster" 같은 wiki 작업자 그룹화 표현을 vendor 공식인 척 표기 금지. "저자가 식별한 ..." / "공식 문서 X · Y · Z" 같이 정직하게

## 5. 알려진 work items

### 5.1 신규 권장 mermaid diagram 후보

| 페이지 | diagram | 목적 |
|---|---|---|
| `key-link-fundamentals.html` | Validation Key + Signing Key paired plane | 두 key 의 위치 (Fireblocks vs Customer HSM) 시각화 |
| `architecture-components.html` | Customer Server + Agent + HSM Adaptor + Fireblocks SaaS 의 컴포넌트 토폴로지 | 5 component LR flow |
| `key-registration-poo.html` | Interactive vs Non-interactive PoO 2 flow 비교 | 시퀀스 다이어그램 |
| `signing-flow.html` | Hot / Warm / Cold 3-mode signing flow | TB tree (3 mode 비교) + 각 mode 별 transport |
| `bank-deployment.html` | KR 망분리 IDC 안의 Key Link 배치 | LR with subgraph (KR IDC / Fireblocks SaaS) |

### 5.2 cold-wallet docs 와의 cross-link

다음 위치에서 cold-wallet docs 를 reference 로 인용:

- `index.html` 3-way 비교 표 — Cold Wallet workspace 와의 결합 (옵션 C-Thales)
- `bank-deployment.html` — `fireblocks-cold-wallet-bank-design/bank-operations.html` §6.3 의 옵션 C-Thales 표 참조
- `risks-open-questions.html` Q-FB02 — SaaS Cold Wallet 과 Key Link Cold signing 의 관계 (open)

### 5.3 docs-site/index.html 카드 추가

기존 4 카드 list 의 끝에 신규 카드 추가:

```html
<a class="doc-card" href="fireblocks-key-link-bank-design/">
  <div class="doc-title">
    Fireblocks Key Link — Customer HSM 통합
    <span class="arrow">→</span>
  </div>
  <p class="doc-summary">
    Fireblocks 의 Key Link plane — Fireblocks 가 키 share 를 보유하지 않는
    customer-held HSM 모델 (Validation Key + Signing Key paired plane).
    Thales Luna HSM 통합 · Hot/Warm/Cold 3-mode signing · Customer Server SPOF ·
    PoO 2 methods · KR 망분리 적합성 · 7 risks + 8 open questions.
  </p>
  <div class="doc-meta">
    <span class="doc-meta-item"><span class="badge badge-pending-review">리뷰 전</span></span>
    <span class="doc-meta-item"><strong>업데이트</strong> 2026-05-21</span>
    <span class="doc-meta-item"><strong>Sections</strong> 7</span>
    <span class="doc-meta-item"><strong>Source</strong> Fireblocks Help Center</span>
  </div>
  <div class="doc-path">fireblocks-key-link-bank-design/</div>
</a>
```

## 6. 절차

1. **폴더 + assets 생성**:
   ```bash
   mkdir -p docs-site/fireblocks-key-link-bank-design/assets
   cp docs-site/fireblocks-cold-wallet-bank-design/assets/styles.css docs-site/fireblocks-key-link-bank-design/assets/
   cp docs-site/fireblocks-cold-wallet-bank-design/assets/app.js docs-site/fireblocks-key-link-bank-design/assets/
   ```
2. **7 페이지 순차 작성** — 위 §3 의 plan 순서대로. 각 페이지 상단에 출처 callout 2-tier 필수.
3. **mermaid CDN script 추가** — diagram 이 있는 페이지의 `</body>` 직전에:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.min.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js"></script>
   ```
4. **docs-site/index.html 신규 카드 추가** (§5.3 의 HTML)
5. **consistency check**:
   ```bash
   python3 .claude/skills/doc-author/scripts/check-consistency.py docs-site/fireblocks-key-link-bank-design
   ```
   4/4 PASS 까지
6. **commit + push** — 표준 git workflow
7. **deploy** — 사용자가 명시 지시 시에만:
   ```bash
   npx wrangler pages deploy /Users/mob.bit/Workspace/waas-wiki/docs-site \
     --project-name=wiki-docs \
     --branch=main \
     --commit-dirty=true \
     --commit-message="key-link docs-site initial"
   ```
   `--commit-message` ASCII-only 필수 (한글 commit message 는 Cloudflare API 가 거절)

## 7. 출처 정직성 룰 (필수)

직전 cold-wallet 리뷰에서 발견된 문제 — 다음을 vendor 공식인 척 표기하면 안 됨:

- **"Key Link cluster"** / **"Cold Wallet cluster"** — 저자가 식별한 그룹화. Fireblocks 공식 분류 아님
- **"X PDF"** — Fireblocks Help Center 는 PDF 가 아닌 HTML article. wiki ingest 시 PDF 저장한 결과일 뿐
- **"공식 본문 미적재"** — wiki 내부 사정. public docs 에서는 "본 문서의 원문 정밀 인용 미확보"

대신 사용할 표현:
- "Fireblocks Help Center 의 Key Link 관련 공식 문서 (저자가 식별한 N 건)"
- "Fireblocks 공식 문서 — Key Link Overview / Getting Started with Key Link / ..."
- "본 문서의 원문 정밀 인용 미확보"
- "저자 추정" / "저자가 합리적으로 추정한 운영 권장"

## 8. 사용자 메모리 룰 (참조)

본 작업에 적용되는 핵심 룰. 새 PC / 세션이 본 NEXT.md 만 보고도 룰을 알 수 있도록 inline 명시:

- **리뷰완료 배지 + 업데이트 날짜 = 사용자 통제** — docs-site/index.html 의 doc-card 의 "리뷰완료" 배지 전환과 "업데이트" 날짜 변경은 사용자 명시 지시 시에만. 본 작업의 신규 카드는 "리뷰 전" + 2026-05-21 고정 (사용자 지정)
- **wrangler ASCII commit message** — `npx wrangler pages deploy` 시 한글 commit message 는 Cloudflare API 가 거절 ("Invalid UTF-8"). 항상 `--commit-message="<ASCII-only>"` 옵션 추가
- **No auto-deploy** — Cloudflare Pages 배포는 사용자 명시 지시 시에만. 작업 완료 → commit + push 까지만 자동, deploy 는 별도 지시 대기
- **Evidence isolation** — Fireblocks 공식 근거 vs 저자 추정 절대 혼합 금지. 출처 callout 2-tier 분리 필수
- **PDF 직접 Read 금지** — wiki 의 1차 source 가 `-extracted.txt` 또는 `.md` 형태로 이미 추출되어 있음. 추가 PDF read 불필요

## 9. 다른 PC / 세션에서 작업하기 위한 조건

본 NEXT.md 는 다른 PC / 새 세션에서도 self-contained 로 작업 가능하도록 작성됨. 단 다음 조건 확인:

| 조건 | 상태 |
|---|---|
| Git repo clone 완료 (`waas-wiki` 전체) | 필수 |
| wiki body (`vendors/` / `entities/` / `open-questions/` / `sources/`) 가 commit 에 포함 | ✅ Stage 38 commit 까지 모두 포함 |
| `.claude/skills/doc-author/` 가 commit 에 포함 | ✅ |
| `CLAUDE.md` 의 룰 (PDF read 금지 / 신규 entity 최소화 등) | ✅ git 에 있음 |
| User memory (`~/.claude/projects/.../memory/`) | ⚠️ PC 별 별도. 본 NEXT.md §8 가 inline 명시로 대체 |
| Cloudflare 자격증명 (`wrangler` deploy 용) | ⚠️ PC 별 별도 — deploy 단계만 영향. commit/push 까지는 무관 |
| Python 3 (consistency check 스크립트용) | 필수 |

→ **commit/push 까지의 작업은 다른 PC 에서 100% 재현 가능**. Deploy 만 Cloudflare 자격증명이 있는 PC 에서.

## 10. 우선순위 / 분량

- 분량: 7 페이지 (cold-wallet 8 페이지와 유사)
- 우선순위 페이지: ① index → ② key-link-fundamentals → ③ architecture-components → ④ signing-flow → ⑤ key-registration-poo → ⑥ risks-open-questions → ⑦ bank-deployment
- 가장 정직성 주의 필요: ⑥ risks-open-questions (Risk-KL01-KL07 + Q-KL01-KL05 + Q-FB01-FB03 의 정확한 출처 분리)

## 11. 예상 결과

- 신규 폴더 1 + 신규 페이지 7 + assets 2
- docs-site/index.html 신규 카드 1 (4 → 5 카드)
- consistency check 4/4 PASS
- log.md Stage 39 entry (optional) — Key Link docs-site 신규 작성

## 12. (별건) wallet-service-components 리뷰 백로그 — 2026-06-11

온보딩 흐름 게이트웨이/유스케이스 분리 작업(commit 6d7d912) 후 검토에서 발견, 사용자 지시로 백로그 보류:

1. **스켈레톤 ↔ 가이드 9-1 어긋남**: 스켈레톤(company/custodial-wallet)엔 "지갑 개설" 묶음 유스케이스가 없음 — `AccountController` 가 createAccount/addressOf 를 별개 엔드포인트·별개 멱등 키로 노출. 제안: `openWallet(ref, asset)` 묶음 메서드 + `POST /wallets` (멱등 키 하나) 추가, `WalletGatewayService` kdoc 의 "API 게이트웨이" 역할 명칭을 가이드 어휘(유스케이스)와 정렬. ★ 추가(2026-06-11, "주소 탄생" 모델 정정 후): SelfBuildAdapter 의 `addressOf` 를 발급 장부(디렉터리) 조회로, 첫 주소도 `issueDepositAddress` 로 발급하는 모델로 동기화 — addressOf 는 절대 새 주소를 만들지 않는다 (가이드 9.1·13.3·15.3 의 새 불변식).
2. **멱등 레코드 저장 주체 모호**: 9-1·14-2·16-2 의 `SVC-->GW: … 멱등 레코드에 결과 저장` 라벨 — 저장은 멱등 소유자인 GW 의 Note 로 옮길 것.
3. **인증 이중 표기**: BIZ(최종 사용자 인증·KYC) vs GW(호출 시스템 인증) 구분을 9-1 캡션 한 줄로. 같은 캡션에 "게이트웨이·지갑 서비스 모두 지갑 서비스 백엔드 소속 — 교체 가능 층은 어댑터 뒤부터" 추가.
