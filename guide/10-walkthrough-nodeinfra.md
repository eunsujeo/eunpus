# 10. Walkthrough — NodeInfra Ingestion
> 실제 사례로 보는 source ingestion + corpus mapping

이 문서는 **Stage 35 의 NodeInfra ingestion** 을 step-by-step 추적하면서, 다른 vendor 의 ingestion 시 어떻게 동일한 흐름을 적용할 수 있는지 보여줍니다.

이 walkthrough 를 읽으면 다음을 이해할 수 있습니다:
- gated docs site 의 인증 방법
- 자동 crawl 도구
- HTML → markdown 변환
- 매핑 노트 6 종 의 작성 방식
- 발견된 limitations 와 ★ Hypothesis 표시

---

## 1. 출발점

[Source Fact, user 의 요청]

> NodeInfra (docs.nodeinfra.com) 의 docs 를 corpus 에 추가하여, 기존 generalized custody architecture corpus 와 비교/매핑 가능한 vendor source repository 를 구축한다.
> access code: solanakorea0316

요구사항:
- `sources/nodeinfra/` 의 표준 구조 생성
- 모든 page crawl
- markdown 변환
- 6 종 source-notes 작성

---

## 2. Stage 0 — Pre-ingestion

### 2.1 무엇을 검토했나

| 검토 항목 | 결과 |
|----------|------|
| 접근 권한 | access code 제공됨 (`solanakorea0316`) |
| Scope 가 D-series 와 매핑되는가? | ★ 초기엔 불확실 — NodeInfra 의 public 페이지는 staking/RPC 만 노출. 실제는 gated 페이지에 NodeWallet 이라는 custody 제품 존재 확인됨. |
| License / ToS | ★ Hypothesis: docs.nodeinfra.com 은 customer-facing technical docs, 인용/요약 가능. 단 mirror/redistribute 는 vendor 와 협의 필요. |

### 2.2 결정

ingestion 진행. 단, **internal docs 의 GitHub references 는 별도 (NDA 가능성)**.

---

## 3. Stage 1 — Directory 생성

```bash
mkdir -p /Users/mob.bit/Workspace/waas-wiki/sources/nodeinfra/{raw/{html,markdown,assets},normalized/{docs,diagrams},source-notes}
```

결과 디렉토리:
```
sources/nodeinfra/
├── raw/{html,markdown,assets}/
├── normalized/{docs,diagrams}/
├── source-notes/
└── README.md (생성 예정)
```

★ **경로 정정 이슈**: 처음에는 `source/nodeinfra/` (singular) 로 생성했다가, 사용자가 기존 `sources/fireblocks/` 와 일치하는 plural `sources/nodeinfra/` 로 정정 요청. `mv` 로 재배치.

---

## 4. Stage 2 — Access 확보 (Mintlify password gate 우회)

### 4.1 첫 시도 (실패)

WebFetch 만으로 `https://docs.nodeinfra.com/` fetch 시도:

```
# Page Content Analysis
- Heading: "Access Restricted"
- Text: "To gain access to this doc, provide your access code below."
- Input Field, Access Button
```

**access gate 가 차단**. URL query param (`?code=...`), subpath (`/<code>`) 등 시도했으나 모두 실패. WebFetch 는 form POST + cookie persistence 가 안 됨.

### 4.2 정직한 보고 → 사용자가 인증 방법 제공

사용자가 직접 인증 endpoint 와 절차 제공:

```bash
curl -s -i -L -c nodeinfra-cookies.txt -X POST \
  -H "Content-Type: application/json" \
  -d '{"password":"solanakorea0316"}' \
  "https://docs.nodeinfra.com/login/callback/password"
```

### 4.3 인증 성공

HTTP 200 + 다음 쿠키 발급:
- `mintlify_end_user_auth` (JWT, exp ~2 주)
- `CloudFront-Policy`, `CloudFront-Signature`, `CloudFront-Key-Pair-Id` (asset 접근용)
- `AWSALB`, `__cf_bm` (CDN routing)

[★ Hypothesis] Mintlify 의 password-gated docs 는 모두 이 endpoint 구조 — `/login/callback/password`. 다른 Mintlify vendor 도 같은 방식 적용 가능할 것.

---

## 5. Stage 3 — 재귀 Crawl

### 5.1 초기 probe

cookie jar 로 home page fetch + sitemap probe:

```bash
curl -s -b nodeinfra-cookies.txt "https://docs.nodeinfra.com/sitemap.xml"
# → 빈 sitemap (urlset 만 있음)

curl -s -b nodeinfra-cookies.txt "https://docs.nodeinfra.com/llms.txt"
# → "Not Found"
```

Sitemap / llms.txt 모두 비어 있음 → **재귀 link 추출** 만으로 navigation 발견 필요.

### 5.2 첫 page 분석

home page (`/`) 의 HTML 에서 internal href 추출:

```
/compliance
/dev/quickstart
/index
/security
```

4 개 path 만 노출 (Mintlify SSR 은 현재 cluster sidebar 만 HTML 에 포함).

### 5.3 재귀 crawler 작성

```bash
#!/bin/bash
COOKIES=/tmp/nodeinfra-cookies.txt
BASE="https://docs.nodeinfra.com"
SEEN=seen.txt
QUEUE=queue.txt

# Initial seeds
echo "/" > "$QUEUE"
echo "/index" >> "$QUEUE"
echo "/security" >> "$QUEUE"
echo "/compliance" >> "$QUEUE"
echo "/dev/quickstart" >> "$QUEUE"

while [ -s "$QUEUE" ]; do
  path=$(head -1 "$QUEUE")
  tail -n +2 "$QUEUE" > "$QUEUE.tmp" && mv "$QUEUE.tmp" "$QUEUE"

  grep -qxF "$path" "$SEEN" && continue
  echo "$path" >> "$SEEN"

  fn=$(echo "$path" | sed 's|^/||;s|/|__|g')
  [ -z "$fn" ] && fn="ROOT"

  curl -s -b "$COOKIES" -o "pages/$fn.html" \
    -w "%{http_code}\n" "$BASE$path"

  grep -oE 'href="/[^"]+"' "pages/$fn.html" | \
    sed 's|href="||;s|"$||' | \
    grep -vE 'mintlify-assets|sitemap' | \
    sort -u | while read p; do
      grep -qxF "$p" "$SEEN" || grep -qxF "$p" "$QUEUE" || echo "$p" >> "$QUEUE"
    done
done
```

### 5.4 Crawl 결과

35 iteration 후 queue 비어짐 + **42 page** 캡처:
- 1 root (`/`) + 1 `/index` duplicate
- 11 security pages
- 22 compliance pages (1 개는 404 — `/compliance/rules/expression`)
- 5 dev pages

### 5.5 추가 probe (sidebar 못 노출된 paths)

추측 가능한 sub-path 들을 probe:

```bash
for path in security/keys/lifecycle security/ops/hardening security/keys/rotation dev/sdk/installation ...; do
  code=$(curl -s -b cookies.txt -o /dev/null -w "%{http_code}" "$BASE/$path")
  [ "$code" = "200" ] && echo "  NEW: $path"
done
```

추가 발견: `/security/keys/lifecycle`, `/security/keys/rotation`, `/security/ops/hardening`, `/security/ops/monitoring`, `/dev/sdk/installation`, `/dev/spring/configuration`, `/dev/architecture`.

### 5.6 최종 page 목록 (42 page)

```
/                                  (root + /index duplicate)
/security                          (11 pages)
  /security/index
  /security/architecture/multisig
  /security/architecture/tenant
  /security/architecture/trust-boundaries
  /security/keys/hsm
  /security/keys/lifecycle
  /security/keys/rotation
  /security/keys/tee-enclave
  /security/ops/audit-logs
  /security/ops/hardening
  /security/ops/monitoring
/compliance                        (22 pages)
  /compliance/index
  /compliance/architecture
  /compliance/decision-lifecycle
  /compliance/portal/{overview,activity-log,transactions}
  /compliance/regulations/{aml,kyc,travel-rule,efta,vacpa,reports}
  /compliance/rules/{global-halt,address-list,time-window,
                     per-tx-amount-limit,daily-withdrawal-limit,
                     velocity-limit,velocity-window,
                     address-cooldown,approval-tier,
                     expression(404)}
/dev                               (5 pages)
  /dev/quickstart
  /dev/architecture
  /dev/sdk/installation
  /dev/spring/setup
  /dev/spring/configuration
```

---

## 6. Stage 4 — HTML → Markdown 변환

### 6.1 도구

`/tmp/nodeinfra-crawl/html2md.py` — BeautifulSoup 기반:
- `<article>` 또는 `<main>` 내부의 content 만 추출
- Sidebar / navigation / footer 자동 무시
- 표 / 코드블록 / 헤딩 / 리스트 보존
- frontmatter (HTML comment) 에 source_url, 다운로드 일자, 접근 방식 기록

```python
def convert_file(html_path):
    soup = BeautifulSoup(html_path.read_text(), "html.parser")
    title = extract_page_title(soup)
    main = find_main_content(soup)
    body = el_to_md(main)
    return frontmatter + title + body
```

### 6.2 변환 결과

42 page → 42 markdown 변환. 평균 body size 약 2-5KB (NodeInfra docs 는 page 당 짧음).

대표 결과:
- `security__architecture__multisig.md` — 2,215B
- `compliance__regulations__kyc.md` — 4,876B (가장 긴 doc)
- `compliance__rules__expression.md` — 4B (404 page)

---

## 7. Stage 5 — Normalize (Mintlify chrome 제거)

### 7.1 제거 대상

Raw markdown 에 남은 Mintlify-specific chrome:
- `$/$`, `$!/$` (Mintlify-internal markers)
- `[Skip to main content](#content-area)`
- `Search...⌘ K`, `Ask AI`, `⌘ I`
- Navigation breadcrumb
- "Powered by Mintlify" footer
- AI 책임 회피 문구 ("Responses are generated using AI and may contain mistakes")
- Documentation Index callout (llms.txt 안내)
- Zero-width space (`​`)

### 7.2 도구

`/tmp/nodeinfra-crawl/normalize.py` — regex 기반:

```python
CHROME_PATTERNS = [
    re.compile(r"\$/\$"),
    re.compile(r"\[Skip to main content\]\([^)]*\)"),
    re.compile(r"Search\.{3}⌘ K"),
    re.compile(r"\[Powered byThis documentation is built and hosted on Mintlify[^]]*\]"),
    # ...
]
```

### 7.3 결과

평균 600B / page 감소. 42 page → 42 normalized markdown.

---

## 8. Stage 6 — Inventory 작성

핵심 발견:

### 8.1 Product identity

[Source Fact, NodeInfra index.md]

> 노드월렛은 은행, 카드사, PG/결제사, 증권사, 공공기관을 위한 **온프레미스 스테이블코인 핫월렛 인프라** 입니다.
> 망분리 데이터센터에 설치하여 운영하며, 금융기관 내 각 부서가 자신의 업무 영역을 독립적으로 다룰 수 있도록 설계되었습니다.

→ 한국 금융기관 대상, on-prem stablecoin custody, Solana-only (chain scope 추측).

### 8.2 Scope coverage

Runner 가 listed 한 22 topic class 와 실제 coverage 비교:

| Runner-expected | NodeInfra equivalent | Coverage |
|-----------------|---------------------|----------|
| security | `/security/*` (11 page) | ✓ rich |
| compliance | `/compliance/*` (21 page) | ✓ rich |
| approvals | `/compliance/rules/approval-tier` | ✓ |
| signing | `/security/architecture/multisig` | ✓ |
| audit | `/security/ops/audit-logs` | ✓ |
| sdk | `/dev/sdk/installation` | ✓ |
| treasury | **없음** | ✗ |
| recovery | **없음** | ✗ |
| reconciliation | **없음** | ✗ |
| webhooks | **없음** | ✗ |
| api-reference | **없음** | ✗ |

→ NodeInfra docs 는 **compliance + security 중심**, treasury/reconciliation/recovery/webhook/API reference 는 silent.

### 8.3 산출물

[`sources/nodeinfra/source-notes/inventory.md`](../sources/nodeinfra/source-notes/inventory.md) — 페이지 목록 + tier 분류 + section topology + runner coverage check.

---

## 9. Stage 7 — Architecture Mapping (D-series 매핑)

### 9.1 33 D-doc 별 coverage class 부여

각 D-doc 에 EXPLICIT / EMBEDDED / SILENT 분류:

| Class | 개수 | 예 |
|-------|-----|-----|
| EXPLICIT (rich) | 5 | D2 / D3 / D5 / D11 / D14 |
| EXPLICIT (partial) | 4 | D6 / D8 / D15 / D16 / D24 |
| EMBEDDED | 6 | D1a / D1b / D7 / D18 / D19 |
| EMBEDDED (partial) | 3 | D12 / D26 |
| SILENT | 15+ | D9 / D10 / D13 / D17 / D20 / D21-23 / D25 / D27-32 |

### 9.2 매핑 예시 — D2 ↔ NodeInfra 3-key multisig

```markdown
### 2.1 D2 — Signing Workflow ↔ NodeInfra 3-key multisig

[Source Fact] NodeInfra 의 signing model:
- **3 independent services**, each holding its own HSM key
- Keys: 개시 키 (initiation), 승인 키 (approval), 실행 키 (execution)
- Operations: Withdraw/Sweep/Unsafe-send = full 3-key; Transfer = 2-key + enclave receipt; Deposit = observe-only

[Generalized Mapping] Maps to D2's "4 state-machine separation" and "MPC-CMP 3-endpoint" pattern.
NodeInfra implements an HSM-based 3-party multisig rather than MPC-CMP.
The structural pattern (3 independent endpoints) is preserved; cryptographic primitive differs.

[★ Hypothesis] D2 ≠ propositions all hold:
- "Signing ≠ Approval" — NodeInfra preserves (approval key co-signs only after policy passes)
- "MPC retry ≠ idempotent" — NodeInfra's `(initiator_pubkey, nonce)` explicitly addresses idempotency
```

### 9.3 산출물

[`sources/nodeinfra/source-notes/architecture-mapping.md`](../sources/nodeinfra/source-notes/architecture-mapping.md) — 9 EXPLICIT mappings, 9 EMBEDDED, 15+ SILENT explanations, cross-cluster bridges, vendor-specific deviations.

---

## 10. Stage 8 — Invariant Mapping (≠ propositions 추출)

### 10.1 [Source Fact] 명시적 invariant 27 개

NodeInfra 가 직접 명시하는 ≠ propositions:
- 개시 ≠ 승인 ≠ 실행 (3 key separation)
- HSM 키 ≠ SGX 키 (key custody domain)
- shadow_mode 없음 (every Deny is enforced)
- Allow ≠ Held ≠ Deny (decision 분류)
- Sticky decision (once AUTO_APPROVE or DENY, no return to HELD)
- Set-once signing columns
- Idempotent by (initiator_pubkey, nonce)
- fail-closed (DB failure → Deny)
- 수동 승인 없음 (operators cannot override policy engine)
- Hot reload = atomic snapshot
- Layer 1 ≠ Layer 2 (audit)
- Layer 2 ≠ real-time defense (honest limitation)
- request_id ↔ tx_hash (cross-DB join)
- MRENCLAVE in checkpoint
- ... (etc, 27 개)

### 10.2 [★ Hypothesis] 구조적 invariant 16 개

명시 안 됐지만 design 에서 inferred:
- HX-01 ★ Coordinator 는 stateful 서비스, polling loop 유지
- HX-02 ★ Approver 는 single-instance 또는 active-passive (ArcSwap 패턴)
- HX-30 ★ Approver 는 Rust 기반
- HX-32 ★ DB 엔진은 PostgreSQL (trigger 함수 + append-only 패턴)
- ... (16 개)

### 10.3 산출물

[`sources/nodeinfra/source-notes/invariant-mapping.md`](../sources/nodeinfra/source-notes/invariant-mapping.md) — **≥43 ≠ propositions** 추출 + D-series 매핑.

---

## 11. Stage 9 — Vendor-specific patterns

### 11.1 18 가지 NodeInfra-unique pattern

9 category 로 분류:

| Category | Pattern 예 |
|---------|-----------|
| Topology / Deployment | 망분리 on-prem; 부서 단위 tenant |
| Cryptographic choices | HSM-partitioned 3-key; SGX-sealed execution key with HSM-independent operation; Ed25519 only; PKCS#11 abstraction |
| Compliance engine | 10 rule types + priority short-circuit; coordinator pre-computes context; ArcSwap hot reload; no manual approval button; 24h Held TTL; set-once columns; reference_id mandatory |
| Audit / Evidence | 2-layer audit; cross-DB CBOR binding; MRENCLAVE in checkpoint |
| Wallet structure | 3 wallet types per tenant; SDK-restricted creation |
| Sweep / settlement | Sweep = full 3-key path; Transfer = 2-key + enclave receipt |
| Korean regulatory | 5 regulatory regimes; KCMVP/GS/보안기능확인서 certifications; VASP whitelist as Travel Rule mechanism |
| Developer experience | Java SDK + Spring Boot Auto-Config; production mode forbids SoftHSM2; 33 ErrorCode types |
| Extractable templates | T1 3-key institutional signing; T2 compliance rule engine; T3 2-layer audit; T4 3-wallet tenant model; T5 set-once + append-only DB |

### 11.2 산출물

[`sources/nodeinfra/source-notes/vendor-specific-patterns.md`](../sources/nodeinfra/source-notes/vendor-specific-patterns.md) — 18 패턴 + 5 PM extractable design templates.

---

## 12. Stage 10 — PM/DB Design Notes

### 12.1 무엇을 PM 이 추출 가능한가

다른 시스템을 design 하는 PM 이 NodeInfra 에서 그대로 reference 가능한 design 결정:

- **4-DB split** — approverdb / auditdb / ledgerdb / chaindb
- **8 종류의 store/never-store 분류** — NEVER STORE / APPEND-ONLY / SET-ONCE / MUTABLE WITH CHANGE LOG / RUNTIME-ONLY
- **6 가지 코디네이터 책임 aggregate** — daily_withdrawal_total / count, current balance, sliding window, first-use timestamp, per-tx amount
- **Hash chain design** — per-account, SHA-256, periodic checkpoint with MRENCLAVE
- **10 policy rule schemas** — JSON Schema 가능한 config 구조
- **State machine** — decision (per-request) + signing (per-request)
- **Tenant model** — tenant_id in payload, per-tenant key triplet
- **SDK 표면** — REST `/v1/...`, Java SDK only, Ed25519 API key + 60s timestamp
- **Operational burden** — HSM cluster + SGX hardware + 4 services + Spring backend + ...

### 12.2 산출물

[`sources/nodeinfra/source-notes/pm-db-design-notes.md`](../sources/nodeinfra/source-notes/pm-db-design-notes.md) — PM 이 그대로 reference 가능한 checklist + design template.

---

## 13. Stage 11 — Unknowns + ★ Hypothesis register

### 13.1 Resolved (gate bypass 이후 해소된 것)

✅ 14 가지 — product identity, scope, custody product 존재 확인, rule taxonomy, 매핑 등.

### 13.2 Remaining hard unknowns

| 영역 | Unknown |
|------|---------|
| 상세 schema | ledgerdb/chaindb 의 full schema, signing_events / policy_decisions 의 column 목록 |
| API contract | OpenAPI spec, 33 ErrorCode 의 enumeration, webhook contract, rate limits |
| Operational | 키 회전 절차, 복구 ceremony, DR/HA topology, capacity numbers |
| Architectural | expression DSL 의 full syntax, MRENCLAVE rotation procedure, master key TOFU protocol |

### 13.3 ★ Hypothesis register (30+ 개)

각각 explicit ID (HX-01 ~ HX-34) 와 confidence 표시. 예:
- HX-01 (Med-High): Coordinator 가 stateful service
- HX-10 (High): KCMVP 인증은 진행 중
- HX-30 (High): Approver 는 Rust
- HX-22 (Med-High): NodeInfra 의 validator 사업은 NodeWallet 과 별개 revenue stream

### 13.4 산출물

[`sources/nodeinfra/source-notes/unknowns.md`](../sources/nodeinfra/source-notes/unknowns.md) — 30+ ★ Hypothesis + remaining gaps.

---

## 14. Stage 12 — README + log.md

### 14.1 README

[`sources/nodeinfra/README.md`](../sources/nodeinfra/README.md) — ingestion outcome 의 한 페이지 요약 + re-ingestion procedure + coverage statistics.

### 14.2 log.md 항목

```markdown
## Stage 35 — NodeInfra Vendor Source Ingestion

Date: 2026-05-20
Trigger: 사용자 요청 — LLM-oriented vendor source repository 구축

(중략)

### 영향 받은 파일
- sources/nodeinfra/raw/html/ (42 new HTML)
- sources/nodeinfra/raw/markdown/ (42 new MD)
- sources/nodeinfra/normalized/docs/ (42 new MD)
- sources/nodeinfra/source-notes/*.md (6 new files)
- sources/nodeinfra/README.md (new)
- log.md (append 이 항목)

신규 entity / hub / Curated Wiki 수정 0 건 (entity-min discipline 72 stages 연속 유지)
```

---

## 15. 시간 분석

이번 ingestion 의 실제 소요 시간 (★ Hypothesis):

| Stage | 시간 | 비고 |
|-------|------|------|
| 0. Pre-ingestion | 10 분 | scope 검토, 접근 방식 결정 |
| 1. Directory 생성 | 1 분 | mkdir |
| 2. Access 확보 | 30 분 (사용자 도움 후 5 분) | 처음 WebFetch 실패, 사용자가 인증 endpoint 제공 |
| 3. Crawl | 20 분 | crawler 작성 + 실행 + 추가 probe |
| 4. Convert | 10 분 | html2md.py 작성 + 실행 |
| 5. Normalize | 5 분 | normalize.py 작성 + 실행 |
| 6. Inventory | 30 분 | 페이지별 title + tier 분류 |
| 7. Architecture mapping | 90 분 | 33 D-doc 매핑 + EXPLICIT/EMBEDDED/SILENT 분류 |
| 8. Invariant extraction | 60 분 | 27 explicit + 16 structural ≠ propositions |
| 9. Vendor patterns | 60 분 | 18 패턴 + 5 templates |
| 10. PM/DB notes | 60 분 | DB 분류 + PM checklist |
| 11. Unknowns | 30 분 | hypothesis register |
| 12. README + log | 30 분 | 마무리 |
| **합계** | **~7 시간** | |

자동화된 단계 (1-5): ~1 시간. 인간 분석 (6-11): ~5 시간. 마무리 (12): 30 분.

[★ Hypothesis] 다른 vendor 의 docs 양에 따라 분석 시간이 달라짐. NodeInfra 는 docs 가 비교적 compact (42 page) — Fireblocks 처럼 100+ page 이면 분석 시간 2-3 배.

---

## 16. 핵심 takeaways

이 walkthrough 가 보여주는 것:

### 16.1 자동화 가능한 부분 vs 수동 부분

- **자동화 가능** (Stage 1-5): 디렉토리 생성, 인증, crawl, 변환, normalize. 약 1 시간.
- **수동** (Stage 6-11): 매핑, 패턴 추출, PM extraction. 약 5 시간.
- **거의 자동화 불가**: ★ Hypothesis 의 평가, contradiction 의 발견, design template 의 추출.

### 16.2 ingestion 의 산출물 6 종

1. **inventory.md** — 페이지 목록 + scope 평가
2. **architecture-mapping.md** — D-series 와의 구조적 매핑
3. **invariant-mapping.md** — ≠ propositions 추출
4. **vendor-specific-patterns.md** — vendor-unique 패턴 + 추출 가능한 design template
5. **pm-db-design-notes.md** — PM 이 reference 가능한 DB / API / 운영 design 결정
6. **unknowns.md** — 모르는 것의 정직한 catalog + ★ Hypothesis register

### 16.3 발견된 vendor scope 와 expected scope 의 차이

NodeInfra 의 실제 doc scope:
- ✓ compliance (rich)
- ✓ security (rich)
- ✓ signing / approval / audit (rich)
- ✓ multisig architecture
- ✗ treasury / reconciliation / recovery
- ✗ webhooks / API reference
- ✗ multi-chain / multi-jurisdiction

[Source Fact] NodeInfra 는 **narrow-scope, deeply-focused product** — KR institutional Solana stablecoin custody. 이 사실은 **scope 가 좁다는 것이 약점이 아니라 design 선택** 임을 보여줌.

### 16.4 vendor 와 generalized corpus 의 관계

NodeInfra 의 어떤 invariant 도 **D-series 의 어느 invariant 의 instantiation** 이상이 아닙니다. 다시 말해:

- corpus 는 NodeInfra 가 망해도 살아남음.
- corpus 는 NodeInfra 가 새 chain / 새 regulation 으로 expand 해도 살아남음.
- corpus 가 가치 있는 이유는 vendor catalog 가 아니라 **vendor-independent reasoning**.

NodeInfra 의 의미는 **D-series 가 한 vendor 의 architecture 와 매핑 가능함을 보여준 evidence** 인 것입니다.

---

## 17. 다른 vendor 에 적용 시

이 walkthrough 의 절차를 다른 vendor 에 적용하려면:

1. **Stage 0**: 그 vendor 가 D-series 와 매핑되는 institutional custody 영역에 해당하는가?
2. **Stage 2**: docs 사이트의 인증 방식 파악 (Mintlify? GitBook? Account login?).
3. **Stage 3**: vendor 의 doc topology 가 다름. seed paths 와 link extraction pattern 을 조정.
4. **Stage 4-5**: HTML → markdown 변환은 platform 마다 chrome 패턴이 다름. normalize patterns 조정.
5. **Stage 6-11**: 핵심 분석. NodeInfra walkthrough 의 구조를 그대로 재사용 가능.

표준 source-notes 6 종 의 **template 구조는 vendor-independent** 입니다.

---

## 18. 자주 묻는 질문

### Q. 이 walkthrough 의 시간 추정 (7 시간) 이 다른 vendor 에도 적용되나?
A. 부분적으로. **자동화 부분 (1-5 시간)** 은 vendor scope 와 무관하게 1-2 시간. **분석 부분** 은 doc 의 양과 architectural depth 에 비례. 100+ page vendor 는 분석 10-15 시간 가능.

### Q. 분석 단계를 AI 가 도울 수 있나?
A. **Stage 6 (inventory) 의 page 분류**: 부분 자동 가능.
- **Stage 7 (architecture mapping)**: AI 가 draft 가능, 하지만 R8 Zone B 로 human review 필수.
- **Stage 8 (invariant extraction)**: AI 가 candidate 제안 가능, 하지만 ≠ proposition 의 의미 판단은 human.
- **Stage 9 (vendor-specific patterns)**: AI 의 fluency 가 hype injection 위험 — 보수적 human 검토.
- **Stage 10 (PM notes)**: 다른 stage 가 끝난 후 AI 가 synthesis 가능. 단 design template extraction 은 human judgment 핵심.
- **Stage 11 (unknowns)**: AI 가 hard unknown 을 자기 모름이라고 인정하지 않는 경향이 있어서 주의.

### Q. ingestion 후 vendor docs 가 바뀌면?
A. **Re-ingestion** 절차 (NodeInfra README §7.1 참고). cookie 만료 시 재인증 → crawl → 변환 → normalize → diff 검토 → source-notes amendment (R7 spirit — 이전 version 은 `_archived/` 에 보존).

### Q. 다른 vendor 도 같은 6 종 source-notes 가 만들어지는가?
A. **표준 구조**. inventory + architecture-mapping + invariant-mapping + vendor-specific-patterns + pm-db-design-notes + unknowns 의 6 종 은 vendor-independent 패턴. 각 vendor 의 scope / scope-silent 영역에 따라 채워지는 양이 다를 뿐.

---

## 19. 산출물 link 정리

이 walkthrough 의 모든 산출물:

- **Raw**: [`sources/nodeinfra/raw/html/`](../sources/nodeinfra/raw/html/) (42 HTML)
- **Markdown (raw)**: [`sources/nodeinfra/raw/markdown/`](../sources/nodeinfra/raw/markdown/) (42 MD)
- **Markdown (normalized)**: [`sources/nodeinfra/normalized/docs/`](../sources/nodeinfra/normalized/docs/) (42 MD)
- **Source notes**:
  - [`inventory.md`](../sources/nodeinfra/source-notes/inventory.md)
  - [`architecture-mapping.md`](../sources/nodeinfra/source-notes/architecture-mapping.md)
  - [`invariant-mapping.md`](../sources/nodeinfra/source-notes/invariant-mapping.md)
  - [`vendor-specific-patterns.md`](../sources/nodeinfra/source-notes/vendor-specific-patterns.md)
  - [`pm-db-design-notes.md`](../sources/nodeinfra/source-notes/pm-db-design-notes.md)
  - [`unknowns.md`](../sources/nodeinfra/source-notes/unknowns.md)
- **README**: [`README.md`](../sources/nodeinfra/README.md)
- **Stage 35 log**: [`log.md` (Stage 35 section)](../log.md)

---

## 다음 읽을 글

- 처음으로 돌아가기 → [guide/README](README.md)
- 새 vendor 추가 시도 → [05-source-ingestion.md](05-source-ingestion.md)
- 새 reasoning 추가 검토 → [06-adding-reasoning.md](06-adding-reasoning.md)
- anti-pattern 회피 → [08-anti-patterns.md](08-anti-patterns.md)
