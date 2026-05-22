# Site Template — docs-site/custodial-wallet-db-design

이 site 의 페이지 작성 시 따르는 HTML 구조 / CSS 클래스 / 사이드바 구성 / 배포 명령. 다른 docs-site 가 추가되면 별도 `site-template-<name>.md` 로 분리.

## 경로

- Site root: `/Users/mob.bit/Workspace/waas-wiki/docs-site/custodial-wallet-db-design/`
- Public URL: https://wiki-docs.pages.dev/custodial-wallet-db-design/
- Cloudflare Pages project: `wiki-docs`
- Branch: `main`

## 페이지 HTML scaffold

새 페이지 추가 시 기존 페이지 (`tables-wallet.html` 등) 의 구조를 그대로 따른다. 핵심 골격:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>N. Page Title — Custodial Wallet DB Design</title>
  <link rel="stylesheet" href="assets/styles.css">
</head>
<body>
<div class="layout">
  <aside class="sidebar">
    <nav>
      <h1><a href="index.html">Custodial Wallet DB Design</a></h1>
      <div class="sidebar-section">
        <ul>
          <!-- sidebar items 27 개 — 모든 페이지 동일 -->
          <li><a href="overview.html">1. Overview</a></li>
          <li><a href="architecture.html">2. Architecture</a></li>
          ...
        </ul>
      </div>
    </nav>
  </aside>
  <main class="content">
    <section id="page-id">
      <h2>N. Page Title</h2>
      <span class="section-subtitle">한 줄 부제</span>

      <!-- 본 페이지의 출처 callout (외부 source 인용 페이지) -->

      <h3>...</h3>
      <!-- 본문 -->
    </section>
    <nav aria-label="Section navigation" class="page-nav">
      <a class="page-nav-link page-nav-prev" href="prev.html"><span class="page-nav-dir">← Previous</span><span class="page-nav-label">N-1. Prev Title</span></a>
      <a class="page-nav-link page-nav-next" href="next.html"><span class="page-nav-dir">Next →</span><span class="page-nav-label">N+1. Next Title</span></a>
    </nav>
  </main>
</div>
<!-- Mermaid + svg-pan-zoom CDN -->
<script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js"></script>
<script src="assets/app.js"></script>
</body>
</html>
```

## CSS 클래스 표준

- `.layout` / `.sidebar` / `.content` — 3-column 레이아웃
- `.section-subtitle` — h2 아래 부제
- `.callout` (중립) / `.callout-warn` (경고) / `.callout-title` — 박스형 강조
- `.table-wrap` — 표 감싸는 wrapper (overflow scroll + 모바일 대응)
- `.diagram` — mermaid wrapper
- `.diagram-caption` — diagram 캡션
- `.diagram-fullscreen-btn` — fullscreen 토글 (자동 부착)
- `.g` — glossary tooltip 트리거 (`(?)` 부착용 span)
- `.chain-rr` — chain 별 dl/dt/dd 의 styling 클래스
- `.page-nav` / `.page-nav-link` / `.page-nav-prev` / `.page-nav-next` — 이전/다음 페이지 navigation

## Glossary tooltip `(?)` 사용

```html
<span class="g" data-tip="간결한 한 문장 의미" tabindex="0">(?)</span>
```

자주 사용하는 tooltip text (재사용을 위해 동일 문장 유지):

| 용어 | tooltip text |
|---|---|
| MPC | Multi-Party Computation. 여러 당사자가 각자 키 조각만 들고 협력해서 서명 — 누구도 단독으로 키를 모름. 전체 키가 한 번도 한곳에 모이지 않음 |
| EVM | Ethereum Virtual Machine. Ethereum 호환 chain 계열 (Polygon / Arbitrum / Optimism 등). account-based 모델 |
| UTXO | Unspent Transaction Output. Bitcoin 계열의 잔액 모델. 잔액 = 사용 안 한 output 합 |
| nonce | EVM 의 transaction 순서 번호. 같은 주소의 tx 가 순차 처리되도록. 충돌 시 뒤 tx 가 stuck |
| RBF | Replace-By-Fee 의 약어. broadcast 중 fee 인상으로 stuck tx 처리 |
| reorg | Blockchain reorganization. 확정된 듯한 블록이 사라지고 다른 체인이 채택되는 현상 |
| workspace | Fireblocks 의 최상위 격리·거버넌스 단위. 1 workspace = 1 Owner |
| vault account | Fireblocks 의 자산 보관 단위. workspace 안에서 여러 개 만들어 client / team / 용도별 분리 |
| Admin Quorum | 관리자급 사용자의 다수결 승인 그룹. 회사 이사회 정족수 개념. Q (Quorum) / Q+O (Quorum + Owner) 라벨로 표시 |
| AML | Anti-Money Laundering. 자금세탁 방지 규제. tx 별 KYC / sanction screening 강제 |
| TAP | Transaction Authorization Policy. Fireblocks 의 거래 단위 승인 정책 엔진 |
| DCCP | Deposit Control and Confirmation Policy. 입금 confirmation 횟수 기반 정책. clear 전까지 자금 lock |
| append-only | DB 의 추가 전용 규칙. 한 번 들어간 row 는 UPDATE / DELETE 절대 불가. trigger 로 강제 |
| set-once | DB 컬럼의 1회만 set 규칙. NULL → 값 1 회만 허용, 이후 변경 금지. trigger 로 강제 |
| CBOR | Concise Binary Object Representation. JSON 과 비슷한 데이터 구조의 binary 표현. 크기 작고 byte-deterministic |
| TOTP | Time-based One-Time Password. authenticator app 이 30 초마다 생성하는 6 자리 코드 |
| FIDO2 | Fast IDentity Online 2. password 자체를 없애는 인증 표준. 보안 키 (YubiKey 등) 또는 기기 내장 인증기로 로컬 private key 서명. phishing 방어 강력 |
| WebAuthn | Web Authentication. W3C 표준. 브라우저에서 FIDO2 보안 키 또는 기기 내장 인증기 (지문/Face ID) 로 password 없이 로그인 |
| HSM | Hardware Security Module. 암호 키를 plaintext 로 노출하지 않는 전용 보안 하드웨어. wrap 된 key 만 외부로 나옴 |
| X.509 | 공개키 인증서 표준 형식. CSR 으로 발급받아 서버-클라이언트 신원 검증에 사용 |
| OAuth 2.0 | 권한 위임 표준. 외부 앱이 사용자 대신 리소스 접근하는 토큰 발급 프로토콜. 로그인 인증에도 사용 |
| SAML | Security Assertion Markup Language. SSO 의 XML 기반 표준. assertion 으로 사용자 속성 전달 |
| OIDC | OpenID Connect. OAuth 2.0 위에 얹은 신원 검증 layer. JWT 기반 ID token 발급 |
| ADFS | Active Directory Federation Services. Microsoft 의 SAML 기반 SSO 서버 |
| LDAP | Lightweight Directory Access Protocol. 사내 디렉토리 접근 표준. AD 의 기반 프로토콜 |
| CIDR | Classless Inter-Domain Routing. IP 주소 + prefix 길이로 범위 표현. /32 = single IP |
| RPC | Remote Procedure Call. blockchain node 가 노출하는 외부 호출 API |
| ERD | Entity-Relationship Diagram. 데이터베이스 테이블과 그 사이 외래키 관계를 한 장에 시각화한 도식 |
| Unanimous-Veto | 다수결이 아니라 만장일치 필수. N 명 중 1 명이라도 거부하면 즉시 전체 REJECTED. 한 명의 거부권이 다수 찬성을 무효화 — Fireblocks 의 안전망 설계 |
| SPOC | SPOC — Single Point of Compromise. 한 번이라도 노출되면 전체 키가 compromise 된 것으로 간주하는 지점. Fireblocks DR Recovery Utility 가 online machine 에서 실행될 때 정식 SPOC 경고 발동 |
| counterparty registry | 외부 거래 상대방 등록부 — 송금 destination 으로 사용 가능한 외부 wallet 주소 / 거래소 계좌 / fiat 은행 / Fireblocks P2P Network 의 다른 고객사 등을 Admin Quorum 승인으로 사전 등록한 화이트리스트. providerdb (AML provider · IdP 같은 infrastructure vendor) 와 구분 — counterparty 는 자산이 실제 흘러가는 business-level 외부 |

같은 용어에 다른 tooltip 을 쓰지 말 것 (검색/일관성).

## Sidebar 일관성

모든 페이지의 사이드바는 동일한 27 개 항목. 페이지 split / 추가 / 번호 변경 시 **모든 27 개 페이지의 사이드바를 동시 갱신** 해야 함. scripts/check-consistency.py 가 inline link 와 sidebar 의 번호 일치를 자동 확인.

## 배포

```bash
cd /Users/mob.bit/Workspace/waas-wiki/docs-site/custodial-wallet-db-design && \
npx wrangler pages deploy . --project-name=wiki-docs --branch=main --commit-dirty=true
```

또는 cwd 무관 절대경로:

```bash
npx wrangler pages deploy /Users/mob.bit/Workspace/waas-wiki/docs-site/custodial-wallet-db-design \
  --project-name=wiki-docs --branch=main --commit-dirty=true
```

**절대 금지**: wiki repo root (`/Users/mob.bit/Workspace/waas-wiki`) 에서 `wrangler pages deploy .` 실행 — raw Fireblocks PDF 등 wiki 전체가 public 으로 유출됨. memory 에 사고 기록 있음 (`feedback_no_auto_deploy.md`).

배포 후 "Uploaded N files" 확인:
- 정상 (변경된 파일 만): 1~10
- 의심 (전체 재업로드): 30 ~ 50
- **사고 (wiki root 유출)**: 1000+

1000+ 이면 즉시 사용자에게 알리고 `wrangler pages deployment delete <id>` 안내.

## JavaScript hooks

`assets/app.js` 가 자동 처리:
- `mermaid.initialize({ startOnLoad: false })` + 수동 render
- `svg-pan-zoom` 적용 (각 svg 의 `__panZoom` 인스턴스 저장)
- `setupFullscreenButtons()` 가 모든 `.diagram` 에 fullscreen 토글 부착
- 모바일 sidebar toggle
- `scrollActiveSidebarIntoView`

새 페이지 추가 시 별도 JS 작업 불필요.

## 페이지 추가 절차

1. 기존 페이지 1 개를 cp 해서 새 .html 만들고 내용 교체
2. 모든 27 개 (혹은 그 이상) 페이지의 사이드바에 새 페이지 항목 INSERT — 번호 정렬 유지
3. 영향받는 페이지의 prev/next nav 갱신
4. 본 skill 의 룰 (출처 callout / glossary / mermaid 등) 적용
5. `scripts/check-consistency.py` 로 sweep — 0 mismatch 확인
6. 사용자 검토 / 수정
7. 사용자 명시 지시 시 배포

페이지 split / 번호 변경 시는 별도 script 가 모든 사이드바를 atomic 하게 갱신해야 — 빠뜨리면 inconsistent 상태.
