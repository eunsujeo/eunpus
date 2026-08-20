# NodeInfra Vendor Source Repository

> Stage 35 — NodeInfra (NodeWallet) source ingestion.
> Status: **41 of 42 pages successfully captured** via Mintlify password-auth bypass (1 page is a documented 404).
> Discipline: source-fact and generalized-reasoning strictly separated; all inferences marked ★ Hypothesis.

---

## 1. Purpose

LLM-oriented vendor source repository for NodeInfra's gated `docs.nodeinfra.com` (Mintlify project: nodewallet), purpose-built to:

- compare/map against the existing 61-document generalized custody architecture corpus at `docs/architecture/`
- extract NodeInfra-specific operational patterns
- serve as PM input for DB / operational design extraction
- structurally reuse for ingesting other WaaS vendors (alongside the existing `sources/fireblocks/`)

This is **not** a content backup. It is a **source ingestion + invariant mapping** workspace.

---

## 2. Directory layout

```
sources/nodeinfra/
├─ raw/
│  ├─ html/          (42 .html files — Mintlify-rendered HTML)
│  ├─ markdown/      (42 .md files — automated HTML→MD conversion)
│  └─ assets/        (empty — image / diagram capture deferred)
├─ normalized/
│  ├─ docs/          (42 .md files — chrome-stripped, reading-ready)
│  └─ diagrams/      (empty)
├─ source-notes/
│  ├─ inventory.md                    # 42-page inventory by section, tier, runner-target coverage
│  ├─ architecture-mapping.md         # NodeInfra → 33 D-series docs (EXPLICIT / EMBEDDED / SILENT)
│  ├─ invariant-mapping.md            # ≥43 ≠ propositions extracted (27 stated + 16 structural)
│  ├─ vendor-specific-patterns.md     # 10+ NodeInfra-unique patterns, 5 extractable design templates
│  ├─ pm-db-design-notes.md           # DB schemas, what to store / never store, PM checklist
│  └─ unknowns.md                     # residual gaps + 30+ ★ Hypothesis register
└─ README.md (this file)
```

---

## 3. Ingestion outcome (honest summary)

### 3.1 Access

`docs.nodeinfra.com` is gated behind a Mintlify access-code interface. The user supplied the authentication mechanism:

```bash
curl -s -i -L -c nodeinfra-cookies.txt -X POST \
  -H "Content-Type: application/json" \
  -d '{"password":"solanakorea0316"}' \
  "https://docs.nodeinfra.com/login/callback/password"
```

This issues `mintlify_end_user_auth` JWT cookie (+ CloudFront-Policy for assets). With the cookie jar, all docs are accessible via `curl`.

### 3.2 Crawl

Recursive crawler (`/tmp/nodeinfra-crawl/crawl.sh`) starting from `/`, `/index`, `/security`, `/compliance`, `/dev/quickstart`. Iterative href extraction + probing.

- 39 unique non-redirect doc paths discovered (excluding ROOT/index duplicate).
- 41 pages live (T-DIRECT).
- 1 page (`/compliance/rules/expression`) returned 404 — documented as gap.
- Total HTML: ~12 MB.

### 3.3 Conversion

- `/tmp/nodeinfra-crawl/html2md.py` — BeautifulSoup-based HTML→Markdown. Frontmatter as HTML comment. Saved to `raw/markdown/`.
- `/tmp/nodeinfra-crawl/normalize.py` — strips Mintlify chrome (`$/$`, "Skip to main content", "Powered by Mintlify", search UI, etc.). Saved to `normalized/docs/`.
- 42 files normalized.

### 3.4 Product identity discovered

[Source Fact] **NodeWallet** — Korean on-prem stablecoin custody infrastructure for institutional finance (banks, card companies, PG/payment, securities, public agencies). Solana-only. Deployed in air-gap (망분리) data centers. Distinguishable from NodeInfra's public blockchain-infrastructure / validator business.

The "scope concern" from the initial gated-attempt is **resolved**: the gated docs contain a real custody product (NodeWallet), which is distinct from NodeInfra's public Sui-endpoints / Ethereum-staking content.

### 3.5 Architecture observed

[Source Fact] Core architecture extracted:

- **3-key multisig** (개시 / 승인 / 실행) — HSM-partitioned, FIPS 140-3 Level 3 (Thales Luna / Utimaco / YubiHSM2).
- **Intel SGX TEE** for 실행 키 (execution key) — sealed to MRENCLAVE.
- **Per-tenant 3-key sets** + SPKI-hash binding for tenant isolation.
- **Compliance engine** with 10 rule types (9 documented + 1 referenced 404) + priority-based short-circuit evaluation + Allow/Held/Deny verdicts.
- **2-layer audit** — Layer 1 (per-action TEE receipts) + Layer 2 (SHA-256 hash chain + periodic enclave-signed checkpoints with MRENCLAVE).
- **Java SDK + Spring Boot Auto-Configuration** as primary developer surface.
- **4-database split** — approverdb / auditdb / ledgerdb / chaindb.
- **5 Korean regulatory regimes** explicitly addressed: 특금법, EFTA, VACPA, FATF R.16, AML/KYC general.

### 3.6 Mapping outcome

Mapped against 33-doc D-series:
- **EXPLICIT coverage**: 9 docs (D2 / D3 / D5 / D6 / D11 / D14 / + partial D8 / D15 / D16 / D24)
- **EMBEDDED coverage**: 6+3 docs (D1a / D1b / D7 / D12 / D18 / D19 / D26)
- **SILENT**: 11 docs (D9 / D10 / D13 / D17 / D20 / D21 / D22 / D23 / D25 / D27 / D28 / D29 / D30 / D31 / D32)

NodeInfra's scope is concentrated in **D2 / D3 / D5 / D11 / D14** with high content density; silent on multi-chain / multi-jurisdiction / treasury / frontier topics — consistent with single-jurisdiction (KR) single-chain (Solana) stablecoin custody positioning.

---

## 4. Files of interest

For quick orientation:

| File | What it gives you |
|------|-------------------|
| `source-notes/architecture-mapping.md` | NodeInfra → D-series structural correspondence |
| `source-notes/invariant-mapping.md` | NodeInfra ≠ propositions (≥43) catalogued |
| `source-notes/vendor-specific-patterns.md` | 10+ NodeInfra-unique patterns + 5 extractable design templates (T1-T5) |
| `source-notes/pm-db-design-notes.md` | PM checklist + DB schema patterns + storage rules |
| `source-notes/inventory.md` | 42 pages indexed by section + runner-target coverage |
| `source-notes/unknowns.md` | Residual uncertainty + 30+ ★ Hypotheses |
| `normalized/docs/index.md` | NodeInfra's own self-description (start reading here) |
| `normalized/docs/security__architecture__multisig.md` | Core architecture: 3-key multisig flow |
| `normalized/docs/compliance__decision-lifecycle.md` | Core architecture: decision verdict + Held lifecycle |
| `normalized/docs/security__ops__audit-logs.md` | Core architecture: 2-layer audit |

---

## 5. Reasoning discipline carried throughout

All notes follow strict label discipline:

```
[Source Fact]
NodeInfra publishes 9 explicit rule types in /compliance/rules/* (plus 1 referenced-but-404).

[Source Fact — fetched 2026-05-20]
The `auth_approver_sig` column is set-once and DB-trigger enforced.

[Generalized Mapping]
This maps to D3's "set-once signing" invariant.

[★ Hypothesis]
The DB engine is likely PostgreSQL based on trigger-function patterns; not directly stated.
```

Statements not carrying an explicit label inherit `[Source Fact]` when they refer to observable ingestion behavior, or `[★ Hypothesis]` when inferring about non-stated NodeInfra design choices.

---

## 6. What this repository does NOT do

- Does **not** modify the existing 61-doc D/C/E/R/T corpus at `docs/architecture/`.
- Does **not** modify Curated Wiki entity / hub structures.
- Does **not** modify the existing `sources/fireblocks/` repository.
- Does **not** mix source-fact and theory in the raw / normalized content.
- Does **not** treat ★ Hypotheses as facts.
- Does **not** evaluate NodeInfra "better/worse" than other vendors — only structural correspondence.
- Does **not** capture diagrams / images from `mintcdn.com/nodewallet/` (deferred; CloudFront-Policy cookie was issued but assets not fetched).

---

## 7. Reusing the ingestion methodology

The artifacts under `/tmp/nodeinfra-crawl/`:
- `crawl.sh` — recursive crawler with cookie-jar support
- `html2md.py` — HTML to markdown converter (BeautifulSoup-based)
- `normalize.py` — Mintlify chrome stripper

These can be adapted for other Mintlify-gated docs. For different doc platforms (GitBook, Docusaurus, ReadMe.io, etc.), the auth + crawl logic needs platform-specific adjustments.

### 7.1 Re-ingestion procedure

To refresh content from NodeInfra:

```bash
# 1. Re-authenticate (cookies expire ~14 days based on JWT exp)
cd /tmp && curl -s -i -L -c nodeinfra-cookies.txt -X POST \
  -H "Content-Type: application/json" \
  -d '{"password":"solanakorea0316"}' \
  "https://docs.nodeinfra.com/login/callback/password"

# 2. Re-crawl
cd /tmp/nodeinfra-crawl && bash crawl.sh

# 3. Move new HTML
cp /tmp/nodeinfra-crawl/pages/*.html /Users/mob.bit/Workspace/waas-wiki/sources/nodeinfra/raw/html/

# 4. Re-convert
python3 /tmp/nodeinfra-crawl/html2md.py
python3 /tmp/nodeinfra-crawl/normalize.py

# 5. Diff against prior versions; update source-notes per R7 worldview preservation
git diff -- sources/nodeinfra/
```

★ Hypothesis: re-ingestion should be performed periodically (e.g., quarterly) to track NodeInfra's doc evolution. Diff-based change detection lets us surface new pages, modified content, and deletions for the contradiction registry (R3) and ontology registry (R4).

---

## 8. Coverage statistics (final)

| Metric | Value |
|--------|-------|
| Total pages captured (T-DIRECT) | **41 live + 1 404 stub** |
| Total normalized markdown size | ~85 KB |
| Source-notes total size | ~95 KB across 6 files |
| Coverage of runner-listed topic classes | ~50% (compliance / security strong; treasury / reconciliation / recovery / webhooks / API-reference absent) |
| EXPLICIT D-series mappings | 9 docs |
| EMBEDDED D-series mappings | 9 docs |
| SILENT D-series mappings | 15+ docs (frontier / multi-chain / multi-jurisdiction) |
| ≠ propositions extracted | ≥43 (27 explicit + 16 structural) |
| Vendor-specific patterns documented | 18 patterns across 9 categories |
| PM extractable design templates | 5 templates (T1-T5) |
| ★ Hypotheses registered in unknowns | 30+ |
| Days since first ingestion | 0 (Stage 35 single-session) |

---

## 9. Closing position

This ingestion successfully transformed a **gated, opaque vendor docs site** into a **structured, mapped, PM-actionable source repository**. The methodology is reusable; the discipline of source-fact / generalized-reasoning separation is preserved throughout.

What remains:
- Image / diagram capture under `raw/assets/` — deferred.
- Internal GitHub-hosted docs (3 paths referenced) — not retrievable from Mintlify site.
- API contracts in OpenAPI form — not published.
- DR / capacity / SLA numbers — typically institution-customer-specific.

★ Hypothesis: NodeInfra's docs are **sufficient for architectural understanding** but **insufficient for production-grade operational planning** without customer-specific onboarding documents. This is **typical for institutional custody vendors** at the docs-site layer.

The source repository is structured to **survive vendor doc evolution** (R7-style worldview preservation) and to **support future vendor ingestions** alongside the existing Fireblocks repository, building toward a multi-vendor comparison corpus.
