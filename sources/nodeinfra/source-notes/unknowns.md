# NodeInfra Docs — Unknowns and ★ Inferences

> Collection date: 2026-05-20
> Status: significantly resolved after gate authentication. **41 pages captured (T-DIRECT)**. This file documents what **remains** unknown after successful ingestion.
> Discipline: every uncertainty named; nothing silently assumed.

---

## 1. Resolved during ingestion (moved to other notes)

Most uncertainties from the first ingestion attempt are resolved by direct content fetch. The following items are no longer "unknown" — see linked notes:

- ✅ Product identity (NodeWallet, Korean stablecoin custody) → `inventory.md` §1
- ✅ Documentation scope (security, compliance, dev) → `inventory.md` §3
- ✅ Site topology (39 unique paths) → `inventory.md` §3
- ✅ Custody product exists in gated docs → confirmed (was H-01 hypothesis)
- ✅ Compliance rule taxonomy → `vendor-specific-patterns.md` §3, `pm-db-design-notes.md` §5
- ✅ Multisig architecture → `architecture-mapping.md` §2.1
- ✅ Audit chain design → `architecture-mapping.md` §2.3, `pm-db-design-notes.md` §4
- ✅ Tenant model → `vendor-specific-patterns.md` §1.2, `architecture-mapping.md` §2 (tenant section)
- ✅ DB topology (4-DB split) → `pm-db-design-notes.md` §1
- ✅ Regulatory regimes covered → `inventory.md` §4.3.3, `vendor-specific-patterns.md` §7
- ✅ Wallet types (3) → `vendor-specific-patterns.md` §5
- ✅ SDK shape (Java + Spring) → `architecture-mapping.md`, `pm-db-design-notes.md` §8
- ✅ Cryptographic primitives (Ed25519, HSM PKCS#11, SGX) → `vendor-specific-patterns.md` §2

---

## 2. Remaining hard unknowns

The following are **not retrievable from public NodeInfra Mintlify docs** even with gate access. Internal-only documentation (referenced via GitHub paths) or customer-specific operational documents would be needed.

### 2.1 Detailed schemas not exposed

| Unknown | Source mention |
|---------|----------------|
| Full ledgerdb schema (table list, columns, indexes) | Referenced but not detailed in Mintlify docs |
| Full chaindb schema | Referenced but not detailed |
| `SigningPayload v1` full field set (beyond `tenant_id`, `nonce`, `protocol_version`) | Partial mention only |
| `signing_events` full column list | `approver_decision_rationale`, `chain_evidence_ref`, `tx_hash` mentioned; others not enumerated |
| `policy_decisions` full column list | Mentioned as hash-chained append-only; columns not enumerated |
| `held_*` tables full column lists | `decision`, `auth_approver_sig`, `auth_approver_pubkey`, `payload` mentioned; others not |
| `key_lifecycle` columns | Mentioned as event log; columns not specified |
| `master_key_operations` columns | Same |

### 2.2 API contract not exposed

| Unknown | Source mention |
|---------|----------------|
| Full REST API reference (OpenAPI spec or equivalent) | Endpoints referenced in text only |
| HTTP request/response schemas | Not exposed |
| Error code catalog (33 codes) | Mentioned as 33 types; not enumerated |
| Webhook / event delivery contract | Not in docs |
| Rate limits / SLA | Not in docs |
| Pagination semantics for `/v1/wallets` etc. | Not in docs |

### 2.3 Operational details not exposed

| Unknown | Source mention |
|---------|----------------|
| Concrete operator m-of-n quorum mechanics | "3-of-5", "4-of-7" mentioned as **examples**, not as required defaults |
| Key rotation procedure (full ceremony) | `/security/keys/rotation` exists; full procedure not detailed in captured content |
| Recovery ceremony (full procedure) | Not explicitly documented |
| Backup strategy | Not documented |
| Disaster recovery / multi-DC topology | Not documented |
| Capacity / TPS numbers | Not documented |
| Storage growth rate estimates | Not documented |
| Onboarding procedure for institutional customer | Not documented in Mintlify docs |
| Audit retention period | Not documented |
| Audit export format / cadence | Mentioned at high level; not detailed |
| Compliance Portal admin user model (admin/operator/auditor permissions matrix) | Roles named; permission matrix not enumerated |

### 2.4 Architectural details partially documented

| Unknown | Notes |
|---------|-------|
| `expression` rule DSL (full syntax) | Page returns 404; referenced from other docs but DSL spec is `in_condition_set` only based on Travel Rule example. ★ Hypothesis: DSL is partially implemented; `not_in_condition_set` may not exist yet. |
| DCAP attestation infrastructure details | Mentioned but not described in detail |
| MRENCLAVE rotation procedure | Mentioned but procedure not detailed |
| Master key TOFU pin mechanism | Mentioned in `master_key_operations` table description; protocol not detailed |
| Per-account hash chain rebuild from snapshot | Auditor verification path mentioned; rebuild procedure not detailed |
| Coordinator → approver → enclave gRPC/HTTP/IPC protocol | "CBOR IPC (stdin/stdout)" mentioned for enclave; coordinator-approver protocol not specified |

---

## 3. ★ Inferences with explicit hypothesis register

Each is **explicitly marked** as ★ Hypothesis. None should be cited as fact.

### 3.1 Architecture inferences

| ID | Inference | Evidence | Confidence |
|----|-----------|----------|-----------|
| HX-01 | ★ Coordinator is a stateful service that holds in-flight request state across the polling loop | Decision lifecycle says "코디네이터의 polling 으로 재평가" | High |
| HX-02 | ★ The approver is single-instance or active-passive (Hot reload via ArcSwap implies in-memory state) | ArcSwap is single-process construct | Medium-high |
| HX-03 | ★ Coordinator may be horizontally scalable, but rule evaluation per request is single-approver | Approver Hot reload implies single-instance evaluation | Medium |
| HX-04 | ★ DCAP attestation uses Intel Attestation Service (IAS) or DCAP-compatible reference implementation | DCAP is named; specific service not | Medium |
| HX-05 | ★ Enclave-to-coordinator CBOR-over-stdin/stdout suggests enclave runs as a child process | "CBOR IPC (stdin/stdout)" | Medium-high |
| HX-06 | ★ Sealed blob is stored on local disk, not in shared storage | "sealed_blob 은 디스크" wording | High |
| HX-07 | ★ The Compliance Portal is a separate web application bundled with NodeWallet | "콘솔" referenced as user-facing UI | High |
| HX-08 | ★ Solana RPC endpoint is configured per-deployment (customer's own RPC or RPC provider) | NodeInfra does not bundle RPC | Medium-high |

### 3.2 Compliance / regulatory inferences

| ID | Inference | Evidence | Confidence |
|----|-----------|----------|-----------|
| HX-10 | ★ KCMVP certification is in progress (not yet complete) | "(진행중)" in index comparison table | High |
| HX-11 | ★ ISMS is planned, not completed | "(예정)" in index table | High |
| HX-12 | ★ Korean customer onboarding includes KCMVP / GS / 보안기능확인서 evidence packs | Standard KR financial procurement practice | Medium-high |
| HX-13 | ★ Travel Rule integration is per-customer choice between TRP / Sygna / Notabene | Vendor-neutral phrasing in travel-rule.md | Medium |
| HX-14 | ★ VASP whitelist source data is operator-curated, not vendor-provided | "운영팀이 데이터를 검증·통합한 후 노드월렛 condition_set 으로 import" | High |
| HX-15 | ★ KYC system is external; NodeInfra consumes KYC outputs but does not own KYC | "KYC 시스템 (외부)" | High |

### 3.3 Scope / business model inferences

| ID | Inference | Evidence | Confidence |
|----|-----------|----------|-----------|
| HX-20 | ★ NodeInfra is in Proof-of-Concept (POC) phase for the custody product | "노드월렛 (본 POC)" in comparison table | High |
| HX-21 | ★ Production customers may not yet exist, or are small institutional pilots | POC framing + KCMVP-in-progress | Medium |
| HX-22 | ★ NodeInfra's validator/staking business is separate revenue stream from NodeWallet | Public NodeInfra branding emphasizes infrastructure, separate from gated NodeWallet | Medium-high |
| HX-23 | ★ Pricing model is per-deployment license + support, not per-transaction or per-user | Installable-software positioning | Medium |
| HX-24 | ★ Target deployment scale is regional Korean financial institutions, not global | KR-only positioning + 망분리 requirement | High |

### 3.4 Technology stack inferences

| ID | Inference | Evidence | Confidence |
|----|-----------|----------|-----------|
| HX-30 | ★ Approver is Rust-based (ArcSwap is Rust crate) | "ArcSwap" terminology | High |
| HX-31 | ★ Java SDK uses Sun PKCS#11 provider for HSM access | Java + PKCS#11 standard | High |
| HX-32 | ★ Database engine is PostgreSQL (DB trigger functions, append-only patterns common) | DB trigger language not specified; PostgreSQL conventional | Medium |
| HX-33 | ★ Enclave is written in Rust or C/C++ (Intel SGX SDK supports both) | Common SGX stack | Medium |
| HX-34 | ★ CBOR over stdin/stdout uses one of: serde_cbor (Rust), cbor-java | Standard library choices | Medium |

---

## 4. Anticipated unknowns (likely in internal docs but not Mintlify)

These are areas that NodeInfra **likely** documents internally (in `github.com/nodeinfra/nodewallet/docs/`) but does not surface in the public Mintlify site:

- Threat model in formal STRIDE / attack-tree form
- DR / business continuity plan
- Customer onboarding playbook
- Operator runbook for incident response
- Detailed Solana integration (RPC reconnect, chain finality assumptions, slot/epoch handling)
- Performance benchmarks
- Stress test results
- Security audit reports
- Penetration test summaries
- Code-level design documents

Three GitHub paths are explicitly referenced:
- `docs/compliance/policy-audit-trail.md`
- `docs/compliance/aml-sanctions-coverage.md`
- `docs/design/deposit_verification.md`

[Source Fact] These are **not part of the Mintlify docs** and were not retrieved.

---

## 5. Multi-language / scope expansion unknowns

If NodeInfra expands scope:

| Question | Current state | Likely answer when expanded |
|----------|---------------|------------------------------|
| Will multi-chain be supported? | Solana-only | ★ Possible (Ethereum / Tron / TON are common stablecoin chains) |
| Will multi-language SDKs ship? | Java only | ★ Possible (Python / Node.js / Go for non-Java backends) |
| Will SaaS deployment be offered? | On-prem only | ★ Unlikely (regulatory positioning) |
| Will multi-jurisdiction be supported? | KR-only | ★ Possible (Korean institutions with offshore operations) |
| Will treasury / mint-burn be added? | Not in scope | ★ Possible if NodeInfra extends to stablecoin issuer side |
| Will MPC be added as alternative? | HSM only | ★ Possible (some institutions prefer MPC) |

These are noted for **future ingestion runs** — when these questions become answerable, this file gets updated.

---

## 6. Methodology unknowns

### 6.1 Ingestion methodology

- ★ Crawl rate limit / Mintlify bot policy not tested; we did ~50 fetches in succession without rate limiting.
- ★ Assets (diagrams, images) under `mintcdn.com/nodewallet/...` may be CloudFront-Signed; we observed `CloudFront-Policy` cookie issued by auth endpoint, so they should be retrievable, but we did not capture them.
- ★ Doc version stability: NodeInfra may update docs without notice. No version tag observed in fetched content.

### 6.2 Discovery completeness

- ★ Our crawler discovered 39 unique paths via recursive link extraction. ★ Hypothesis: this is **near-complete** for the visible Mintlify sidebar — but Mintlify may have unindexed pages or admin-only pages we did not discover.
- ★ The 404 on `/compliance/rules/expression` may be a documentation gap (page should exist but is missing) or a deliberate omission (rule type referenced but not yet documented).

### 6.3 Image / diagram capture

- ★ The HTML pages contain references to diagrams but the diagrams are SVG/PNG hosted on `mintcdn.com/nodewallet/...`. We did not capture these. Mermaid-equivalent diagrams (if any in source) would be visible as inline SVG in the rendered HTML.
- PM-actionable: re-run the crawler with asset fetching enabled to capture diagrams under `raw/assets/`.

---

## 7. Methodology limitations

[Source Fact] Our HTML → markdown converter is imperfect:
- Mermaid diagrams (if present) lose their source form (only rendered SVG would be in HTML).
- Anchor link IDs (e.g., `#수동-승인-없는-이유`) preserved as URL paths but not as section anchors in markdown.
- Some Mintlify-specific rich components (Callout, Tabs, CodeGroup) may flatten unrecognizably.
- Tables convert correctly but multi-cell wrapping may break.

The normalized markdown files are **good for reading and analysis** but should not be treated as the authoritative source of layout / structure. Always cross-reference `raw/html/` if structural fidelity is required.

---

## 8. Update protocol

When a previously-unknown item is resolved (e.g., NodeInfra publishes API reference):
- Move from this file to appropriate source-note (`inventory.md`, `architecture-mapping.md`, etc.).
- Replace ★ Hypothesis with [Source Fact] in the destination.
- Leave a one-line back-pointer here: `[RESOLVED 2026-MM-DD → see <file>]`.

When a new unknown is discovered during analysis:
- Add to §2 or §3 with date.
- Mark with ★ where appropriate.

When a hypothesis is **falsified** (new evidence contradicts):
- Mark as `[FALSIFIED 2026-MM-DD → reason]`.
- Do not delete; preserve as historical hypothesis.

---

## 9. Closing note

This file represents the **honest residual uncertainty** after a successful gate-bypassed ingestion of 41 pages. Most large uncertainties from the first attempt are resolved; what remains is:

- **Internal docs** (referenced via GitHub) — substantial content unavailable.
- **API contracts** — schemas exposed in text form only; no OpenAPI.
- **Operational details** — DR / capacity / monitoring numbers not in public docs.
- **★ Hypotheses** — explicit inferences that are useful for design extraction but not for verification.

★ Hypothesis: an operator with internal repository access could resolve ~80% of §2 items in a single review. The remaining ~20% (capacity, SLA, DR) are typically institution-customer-specific contracts, not public documentation.

The methodology of this ingestion is reusable for other vendors with non-trivial adjustments per vendor's doc platform and gating mechanism.
