# NodeInfra Docs — Inventory

> Collection date: 2026-05-20
> Source: gated `docs.nodeinfra.com` accessed via Mintlify password endpoint (cookie-jar + curl).
> Status: **42 pages captured** (1 of them is a 404 stub).
> Discipline: rows tagged with source tier; every entry mapped to local raw/normalized markdown.

---

## 1. Product identity (from collected content)

[Source Fact]

- **Product name**: 노드월렛 (NodeWallet) — Mintlify project slug "nodewallet"; vendor brand "NodeInfra".
- **Positioning**: "국내 금융 및 가상자산 규제를 준수하는 **온프레미스 스테이블코인** 지갑 인프라" — Korean on-prem stablecoin hot wallet infrastructure for institutional financial customers (banks, card companies, PG/payment, securities, public agencies).
- **Deployment**: 망분리 (air-gap segregated) data centers, customer-installed software.
- **Chain scope (observed)**: Solana (NATIVE_SOL + SPL tokens including USDC at `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`). No other chain mentioned in current docs.
- **Doc language**: Korean (한국어). All page titles and content are Korean.

This **resolves** the major scope uncertainty raised earlier: NodeInfra has a custody product (NodeWallet) gated behind the Mintlify passcode, distinct from its public blockchain-infrastructure pages (Sui endpoints, Ethereum staking).

---

## 2. Tier legend

| Tier | Meaning |
|------|---------|
| **T-DIRECT** | Page directly fetched; raw HTML + raw markdown + normalized markdown stored |
| **T-INDEX** | Page known to exist via search index only |
| **T-404** | Path returned 404 (page does not exist or is broken) |

---

## 3. Section topology

```
docs.nodeinfra.com/
├─ /                          (= /index)
├─ /security/                 # 보안 포털 (Security)
│  ├─ /security/index
│  ├─ /security/architecture/
│  │  ├─ multisig             # 3-키 다중서명
│  │  ├─ tenant               # 테넌트 격리
│  │  └─ trust-boundaries     # 신뢰 경계
│  ├─ /security/keys/
│  │  ├─ hsm                  # HSM
│  │  ├─ tee-enclave          # Intel SGX 엔클레이브
│  │  ├─ lifecycle            # 키 수명주기
│  │  └─ rotation             # 키 로테이션
│  └─ /security/ops/
│     ├─ audit-logs           # 감사 로그
│     ├─ hardening            # 시스템 하드닝
│     └─ monitoring           # 보안 모니터링
├─ /compliance/               # 컴플라이언스 포털 (Compliance)
│  ├─ /compliance/index
│  ├─ /compliance/architecture
│  ├─ /compliance/decision-lifecycle
│  ├─ /compliance/portal/
│  │  ├─ overview
│  │  ├─ activity-log
│  │  └─ transactions
│  ├─ /compliance/regulations/
│  │  ├─ aml                  # AML / 자금세탁방지
│  │  ├─ kyc                  # KYC / 고객확인
│  │  ├─ travel-rule          # 트래블룰 (FATF R.16)
│  │  ├─ efta                 # 전자금융거래법
│  │  ├─ vacpa                # 가상자산이용자보호법
│  │  └─ reports              # 감사 리포트
│  └─ /compliance/rules/
│     ├─ address-cooldown     # 신규 주소 쿨다운
│     ├─ address-list         # 주소 화이트/블랙리스트
│     ├─ approval-tier        # 금액 구간별 수동 승인
│     ├─ daily-withdrawal-limit  # 일일 누적 한도
│     ├─ global-halt          # 전체 차단
│     ├─ per-tx-amount-limit  # 건당 금액 상한
│     ├─ time-window          # 영업시간 제한
│     ├─ velocity-limit       # 일일 건수 제한
│     ├─ velocity-window      # 슬라이딩 윈도우
│     └─ expression           # (404 — 페이지 존재하지 않음)
└─ /dev/                      # 개발자 가이드 (Developer)
   ├─ /dev/quickstart         # 빠른 시작
   ├─ /dev/architecture       # 아키텍처
   ├─ /dev/sdk/installation   # SDK 설치
   ├─ /dev/spring/setup       # Spring 빠른 시작
   └─ /dev/spring/configuration  # Spring 상세 설정
```

★ Hypothesis: `expression` rule type is referenced from other docs (decision-lifecycle, travel-rule patterns) but its dedicated rule page returns 404 — either a documentation gap or a page genuinely missing at this snapshot.

---

## 4. Page inventory (T-DIRECT)

### 4.1 Root / Overview (2 — duplicate)

| URL | Title (KR) | Title (EN gloss) | Local files |
|-----|-----------|-----|-------|
| `/` | 노드월렛 기술 문서 | NodeWallet Technical Documentation | `raw/markdown/ROOT.md`, `normalized/docs/ROOT.md` |
| `/index` | 노드월렛 기술 문서 | (same) | `raw/markdown/index.md`, `normalized/docs/index.md` |

### 4.2 Security section (11 pages)

| URL | Title (KR) | Topic | Local file |
|-----|-----------|-------|-----------|
| `/security` | 보안 포털 | Security portal landing | `security.md` |
| `/security/index` | 보안 포털 | (same) | `security__index.md` |
| `/security/architecture/multisig` | 3-키 다중서명 | 3-key multisig (개시/승인/실행) | `security__architecture__multisig.md` |
| `/security/architecture/tenant` | 테넌트 격리 | Tenant isolation via SPKI-hash binding | `security__architecture__tenant.md` |
| `/security/architecture/trust-boundaries` | 신뢰 경계 | Trust boundaries (DMZ / 격리구역 / TEE) | `security__architecture__trust-boundaries.md` |
| `/security/keys/hsm` | HSM | FIPS 140-3 Level 3; Thales Luna / Utimaco / YubiHSM2 | `security__keys__hsm.md` |
| `/security/keys/tee-enclave` | Intel SGX 엔클레이브 | Intel SGX TEE for 실행 키 | `security__keys__tee-enclave.md` |
| `/security/keys/lifecycle` | 키 수명주기 | Key generation / sealing / rotation / revocation | `security__keys__lifecycle.md` |
| `/security/keys/rotation` | 키 로테이션 | Key rotation procedures | `security__keys__rotation.md` |
| `/security/ops/audit-logs` | 감사 로그 | 2-layer audit (TEE receipts + hash chain + checkpoints) | `security__ops__audit-logs.md` |
| `/security/ops/hardening` | 시스템 하드닝 | OS / network hardening | `security__ops__hardening.md` |
| `/security/ops/monitoring` | 보안 모니터링 | Security monitoring | `security__ops__monitoring.md` |

### 4.3 Compliance section

#### 4.3.1 Overview (4)

| URL | Title (KR) | Local file |
|-----|-----------|-----------|
| `/compliance` | 컴플라이언스 포털 | `compliance.md` |
| `/compliance/index` | 컴플라이언스 포털 | `compliance__index.md` |
| `/compliance/architecture` | 컴플라이언스 아키텍처 | `compliance__architecture.md` |
| `/compliance/decision-lifecycle` | 결정 라이프사이클 | `compliance__decision-lifecycle.md` |

#### 4.3.2 Portal (3)

| URL | Title (KR) | Topic | Local file |
|-----|-----------|-------|-----------|
| `/compliance/portal/overview` | 포털 개요 | Portal overview | `compliance__portal__overview.md` |
| `/compliance/portal/activity-log` | 활동 로그 | Activity log | `compliance__portal__activity-log.md` |
| `/compliance/portal/transactions` | 결정 이력 | Decision history | `compliance__portal__transactions.md` |

#### 4.3.3 Regulations (6)

| URL | Title (KR) | Topic | Local file |
|-----|-----------|-------|-----------|
| `/compliance/regulations/aml` | AML / 자금세탁방지 | Anti-money-laundering | `compliance__regulations__aml.md` |
| `/compliance/regulations/kyc` | KYC / 고객확인 | Know-your-customer | `compliance__regulations__kyc.md` |
| `/compliance/regulations/travel-rule` | 트래블룰 (FATF R.16) | Travel rule | `compliance__regulations__travel-rule.md` |
| `/compliance/regulations/efta` | 전자금융거래법 | Electronic Financial Transactions Act (KR) | `compliance__regulations__efta.md` |
| `/compliance/regulations/vacpa` | 가상자산이용자보호법 | Virtual Asset User Protection Act (KR) | `compliance__regulations__vacpa.md` |
| `/compliance/regulations/reports` | 감사 리포트 | Audit reports | `compliance__regulations__reports.md` |

#### 4.3.4 Policy rules (10 — 9 live + 1 404)

| URL | Title (KR) | Rule type (config key) | Local file |
|-----|-----------|----|-----------|
| `/compliance/rules/global-halt` | 전체 차단 | `global_halt` | `compliance__rules__global-halt.md` |
| `/compliance/rules/address-list` | 주소 화이트/블랙리스트 | `address_list` | `compliance__rules__address-list.md` |
| `/compliance/rules/time-window` | 영업시간 제한 | `time_window` | `compliance__rules__time-window.md` |
| `/compliance/rules/per-tx-amount-limit` | 건당 금액 상한 | `per_tx_amount_limit` | `compliance__rules__per-tx-amount-limit.md` |
| `/compliance/rules/daily-withdrawal-limit` | 일일 누적 한도 | `daily_withdrawal_limit` | `compliance__rules__daily-withdrawal-limit.md` |
| `/compliance/rules/velocity-limit` | 일일 건수 제한 | `velocity_limit` | `compliance__rules__velocity-limit.md` |
| `/compliance/rules/velocity-window` | 슬라이딩 윈도우 (건수+금액) | `velocity_window` | `compliance__rules__velocity-window.md` |
| `/compliance/rules/address-cooldown` | 신규 주소 쿨다운 | `address_cooldown` | `compliance__rules__address-cooldown.md` |
| `/compliance/rules/approval-tier` | 금액 구간별 수동 승인 | `approval_tier` | `compliance__rules__approval-tier.md` |
| `/compliance/rules/expression` | (404) | `expression` (referenced but page absent) | `compliance__rules__expression.md` (4B stub) |

### 4.4 Developer section (5 pages)

| URL | Title (KR) | Topic | Local file |
|-----|-----------|-------|-----------|
| `/dev/quickstart` | 빠른 시작 | Quickstart | `dev__quickstart.md` |
| `/dev/architecture` | 아키텍처 | Architecture; Java SDK + Spring Boot Auto-Config; wallet types | `dev__architecture.md` |
| `/dev/sdk/installation` | 설치 | SDK installation; Gradle dependency + PKCS#11 setup | `dev__sdk__installation.md` |
| `/dev/spring/setup` | 빠른 시작 | Spring Boot setup | `dev__spring__setup.md` |
| `/dev/spring/configuration` | 상세 설정 | Spring detailed configuration | `dev__spring__configuration.md` |

---

## 5. Collection statistics

| Metric | Value |
|--------|-------|
| Total unique non-redirect doc paths discovered | **39** (excluding ROOT≡index duplicate) |
| Pages fetched (T-DIRECT) | **41** live (incl. 2 duplicates ROOT/index) |
| Broken pages (T-404) | **1** (`/compliance/rules/expression`) |
| HTML size (total) | ~12 MB raw |
| Markdown size (total) | ~110 KB raw, ~85 KB normalized |
| Doc language | Korean (한국어) |
| Coverage by runner-target topic class | See §6 |

---

## 6. Runner topic coverage check

The runner instruction listed expected topic classes. Mapping observed → expected:

| Runner-expected | NodeInfra equivalent | Coverage |
|-----------------|---------------------|----------|
| getting-started | `/dev/quickstart` + `/index` | ✓ |
| architecture | `/security/architecture/*` + `/compliance/architecture` + `/dev/architecture` | ✓ |
| security | `/security/*` (11 pages) | ✓ (rich) |
| custody | Embedded in `/security/architecture/multisig` + `/security/keys/*` | ✓ (no dedicated section; embedded) |
| wallets | `/dev/architecture` §지갑 종류 (3 wallet types described) | Partial — no dedicated section |
| approvals | `/compliance/rules/approval-tier` + `/compliance/decision-lifecycle` | ✓ |
| signing | `/security/architecture/multisig` | ✓ |
| policies | `/compliance/rules/*` + `/compliance/decision-lifecycle` + `/compliance/architecture` | ✓ (very rich — 9+1 rule types) |
| treasury | **Not present** — no dedicated treasury/reserve docs | ✗ |
| deposits | Embedded in multisig + dev/architecture (deposit = observe path) | Partial |
| withdrawals | Embedded in multisig + compliance/rules | Partial |
| reconciliation | **Not present** as dedicated doc; ledger consistency embedded in audit-logs | ✗ |
| audit | `/security/ops/audit-logs` + `/compliance/portal/activity-log` + `/compliance/regulations/reports` | ✓ |
| recovery | **Not present** as dedicated doc; partial in keys/lifecycle | ✗ |
| compliance | `/compliance/*` (21 pages) | ✓ (very rich) |
| sdk | `/dev/sdk/installation` + `/dev/architecture` | ✓ |
| api-reference | **Not exposed publicly** in docs site (referenced as DTO schemas in-text) | ✗ |
| webhooks | **Not present** | ✗ |
| operational guides | `/security/ops/*` (3 pages) | Partial |
| troubleshooting | **Not present** | ✗ |
| incident | Embedded in `global_halt` rule + `compliance/decision-lifecycle` fail-closed | Partial |
| admin / governance | Embedded in `/compliance/portal/*` (admin / operator / auditor roles mentioned) | Partial |

**Observed scope ≠ runner expected scope**: NodeInfra docs are **compliance-heavy and SDK-light**. There is no dedicated reconciliation, recovery, treasury, webhook, or API-reference section. Compliance rules + 3-key multisig architecture are the dominant content.

[Source Fact] The docs lean toward **financial-institution compliance team and security/ops team** as primary audiences. Developer content is intentionally minimal (Java SDK + Spring Boot Auto-Config — "develop your business logic, not the signing protocol").

---

## 7. External references found in docs

The docs reference NodeInfra-internal documentation hosted on GitHub (not the Mintlify site):

| Reference | Source URL |
|-----------|------------|
| Policy Audit Trail (internal cert pack) | `https://github.com/nodeinfra/nodewallet/blob/master/docs/compliance/policy-audit-trail.md` |
| AML Sanctions Coverage (internal cert pack) | `https://github.com/nodeinfra/nodewallet/blob/master/docs/compliance/aml-sanctions-coverage.md` |
| Deposit Verification (design doc) | `https://github.com/nodeinfra/nodewallet/blob/master/docs/design/deposit_verification.md` |

[Source Fact] These appear to be customer-onboarding documents requiring repository access; **not part of the Mintlify docs site** and **not retrieved in this ingestion**.

---

## 8. Update protocol

When docs change or new pages are discovered:
- Update `raw/html/` with new HTML.
- Re-run `/tmp/nodeinfra-crawl/html2md.py` and `/tmp/nodeinfra-crawl/normalize.py` (preserved scripts).
- Update this inventory.
- Note version-tag/date if NodeInfra ever versions the docs.

When pages disappear (404):
- Move row to T-404 section with date observed.
- Preserve prior captured content under `raw/html/_archived/`.

When NodeInfra adds new sections (e.g., reconciliation, treasury, webhooks, API reference):
- Re-run crawler with seed updated to include new top-level paths.
- Update §3 topology and §4 inventory.
- Update `architecture-mapping.md`, `invariant-mapping.md`, `vendor-specific-patterns.md` accordingly.
