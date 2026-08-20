# NodeInfra → Generalized Custody Architecture Corpus — Mapping

> Mapping date: 2026-05-20
> Source: 41 captured NodeInfra docs (T-DIRECT) under `../normalized/docs/`
> Target: 33-doc D-series at `/Users/mob.bit/Workspace/waas-wiki/docs/architecture/`
> Discipline: [Source Fact] / [Generalized Mapping] / [★ Hypothesis] strictly labeled.

---

## 0. Mapping principle

This document maps **what NodeInfra (NodeWallet) actually documents** against **what the generalized D-series corpus reasons about**. It is not an evaluation. It is a **structural correspondence** record that lets later analysis answer questions like:
- Which D-series invariants does NodeInfra's architecture exhibit?
- Where does NodeInfra's framing differ from the generalized framing (vendor-specific)?
- Where is NodeInfra silent on D-series concerns?

Three classes of mapping result:

- **EXPLICIT** — NodeInfra docs directly state the concept.
- **EMBEDDED** — NodeInfra exhibits the concept inside another section.
- **SILENT** — NodeInfra does not address the concern in its public docs.

---

## 1. Whole-corpus mapping summary

| D# | D-series doc | NodeInfra coverage | Class |
|----|--------------|--------------------|------|
| D1a | Vault / Wallet / Ledger DB Schema | `dev/architecture` §지갑 종류 + `compliance/architecture` §데이터 모델 | EMBEDDED |
| D1b | Reconciliation / Settlement / Consistency | `security/ops/audit-logs` §Layer 1 (정합성 체크 작업) | EMBEDDED |
| D2 | Signing Workflow + MPC Orchestration | `security/architecture/multisig` (3-키) + `security/architecture/trust-boundaries` | EXPLICIT (non-MPC variant) |
| D3 | Approval State Machine + Governance | `compliance/decision-lifecycle` + `compliance/rules/approval-tier` | EXPLICIT |
| D4 | Recovery Ceremony Generalization | `security/keys/lifecycle` + `security/keys/rotation` (partial) | EMBEDDED (partial) |
| D5 | Audit / Event Sourcing / Evidence Chain | `security/ops/audit-logs` (2-layer) + `compliance/portal/activity-log` | EXPLICIT (rich) |
| D6 | 3-way Custody Decision Framework | `index` §다른 솔루션과의 비교 (NodeInfra's own framing) | EXPLICIT (own POV) |
| D7 | Deposit Lifecycle | `security/architecture/multisig` §작업별 차이 (Deposit = observe) + GitHub deposit_verification.md (off-site) | EMBEDDED |
| D8 | Withdrawal Lifecycle | `security/architecture/multisig` + `compliance/decision-lifecycle` | EXPLICIT |
| D9 | Multi-chain Adapter Pattern | **SILENT** — Solana-only | SILENT |
| D10 | Treasury / Reserve / Mint-Burn | **SILENT** | SILENT |
| D11 | Compliance / AML / Sanctions | `compliance/regulations/*` + `compliance/rules/*` (full 21 pages) | EXPLICIT (very rich) |
| D12 | Operational Maturity / Incident Command | `compliance/rules/global-halt` + `security/ops/*` (partial) | EMBEDDED (partial) |
| D13 | Cross-border Settlement / FX | **SILENT** — KR-only positioning | SILENT |
| D14 | Security / Threat Model | `security/architecture/multisig` §키 탈취 시나리오 + `security/architecture/tenant` §탈취 시나리오 + `security/ops/audit-logs` §위협 모델 | EXPLICIT |
| D15 | Transparency / Attestation / Proof | `security/ops/audit-logs` §감사관 검증 절차 + DCAP 원격 증명 | EXPLICIT (partial) |
| D16 | Identity / KYT / Counterparty Graph | `compliance/regulations/kyc` + `compliance/regulations/travel-rule` §VASP 식별 | EXPLICIT (partial) |
| D17 | Treasury Optimization / Capital Efficiency | **SILENT** | SILENT |
| D18 | Clearing / Prime Brokerage / Omnibus | `dev/architecture` §집중 지갑 (omnibus pattern) | EMBEDDED |
| D19 | Internal Netting / Internal Settlement | `security/architecture/multisig` §Transfer (internal ledger) | EMBEDDED |
| D20 | Cross-institution Liquidity | **SILENT** | SILENT |
| D21 | Stablecoin Depeg / Crisis Handling | **SILENT** | SILENT |
| D22 | Consensus Failure / Chain Halt | **SILENT** | SILENT |
| D23 | Jurisdiction Split / Regulatory Attack | **SILENT** — single-jurisdiction (KR) | SILENT |
| D24 | Regulatory Reporting / Audit Interface | `compliance/regulations/reports` + `compliance/portal/activity-log` | EXPLICIT (partial) |
| D25 | Systemic Liquidity Freeze | **SILENT** | SILENT |
| D26 | Custody Failure Generalization | `security/architecture/trust-boundaries` §한 경계를 뚫어도 (partial) | EMBEDDED (partial) |
| D27 | CBDC / Sovereign Digital Money | **SILENT** | SILENT |
| D28 | Intent-based Settlement | **SILENT** | SILENT |
| D29 | Autonomous Treasury | **SILENT** | SILENT |
| D30 | AI-assisted Governance | **SILENT** | SILENT |
| D31 | Institutional Privacy | **SILENT** | SILENT |
| D32 | Post-quantum Custody | **SILENT** — Ed25519 only, no PQ discussion | SILENT |

**Coverage summary**: EXPLICIT 9 | EXPLICIT (partial) 4 | EMBEDDED 6 | EMBEDDED (partial) 3 | SILENT 11 = 33 total.

★ Hypothesis: NodeInfra's scope is concentrated in **D2 / D3 / D5 / D11 / D14** with rich content, partial coverage of **D1a / D6 / D8 / D15 / D16 / D18 / D24**, and absent coverage of **D9-D10, D13, D17, D20-D23, D25, D27-D32** (multi-chain, multi-jurisdiction, frontier topics, crisis topics, treasury/liquidity domain). This reflects a deliberately narrow product scope: **single-jurisdiction (KR) single-chain (Solana) stablecoin custody for institutional finance**.

---

## 2. Detailed mappings — EXPLICIT

### 2.1 D2 — Signing Workflow + MPC Orchestration ↔ NodeInfra 3-key multisig

[Source Fact] NodeInfra's signing model:
- **3 independent services**, each holding its own HSM key, must sign for any chain transaction.
- Keys: 개시 키 (initiation, Spring backend + Java SDK), 승인 키 (approval, policy engine), 실행 키 (execution, SGX enclave).
- Operation modes:
  - **Withdraw / Sweep / Unsafe-send** — full 3-key signing → on-chain tx.
  - **Transfer** — initiation + approval keys + enclave `verify_and_authorize` receipt → internal ledger move (no chain sig).
  - **Deposit** — observe path; no signing ceremony.
- Sign flow: `개시 키 → 승인 키 (정책 통과 후 co-sign) → 실행 키 (SGX, Ed25519 sign + zeroize)`.

[Generalized Mapping] Maps to D2's **4 state-machine separation** (Transaction / Approval / Signing / Broadcast) and **MPC-CMP 3-endpoint orchestration** pattern. NodeInfra implements an **HSM-based 3-party multisig** rather than MPC-CMP — the structural pattern (3 independent endpoints whose cooperation produces a signature) is preserved, but the cryptographic primitive differs.

[★ Hypothesis] D2 ≠ propositions all hold:
- "Signing ≠ Approval" — NodeInfra preserves this (approval key co-signs only after policy passes; execution key signs only after both prior keys).
- "MPC retry ≠ idempotent" — NodeInfra's `(initiator_pubkey, nonce)` table (`initiator_nonce_seen`) explicitly addresses idempotency.

★ Differs from D2 in: **not MPC**, instead **HSM-partitioned 3-key multisig + SGX-sealed execution key**. The trust-distribution rationale is the same; the cryptographic mechanism is different.

Local source: `../normalized/docs/security__architecture__multisig.md`

---

### 2.2 D3 — Approval State Machine ↔ NodeInfra Decision Lifecycle

[Source Fact] NodeInfra's decision model:
- 3 verdicts: **Allow / Held / Deny**. No `shadow_mode` — all Deny is enforced.
- Internal types: `Verdict` (per-rule) and `PolicyDecision` (per-request). Allow is serialized as `AutoApprove` in wire format.
- Rule evaluation: priority-ordered, **short-circuit on first Deny/Held**.
- **Sticky decision** — once transitioned to AUTO_APPROVE or DENY, cannot return to HELD (DB trigger enforced).
- **Set-once signing columns** — `auth_approver_sig` / `auth_approver_pubkey` cannot be modified after INSERT.
- **24h Held TTL** — auto-Deny by coordinator if not resolved.
- **Idempotent** by `(initiator_pubkey, nonce)`.
- **Hot reload** — rule changes via ArcSwap atomic swap; single request uses snapshot from start.
- **fail-closed** — DB failure, panic, missing context, HSM failure → all map to Deny.

[Generalized Mapping] Maps to D3's **11-state governance state machine** and **two-clock freshness** invariants. NodeInfra's discipline is consistent with D3's preservation requirements:
- Append-only decision history (`policy_decisions`) — matches D3 + D5 invariant.
- Set-once signing — matches D3 invariant (no double-spend / no signature replay).
- fail-closed — matches D3's safety-default discipline.
- 24h TTL — matches D3's two-clock freshness model.

★ Notable specifics that D3 generalizes around but NodeInfra concretizes:
- Hot reload as **operational** capability — D3 mentions policy versioning; NodeInfra implements via `policy_change_log` + ArcSwap.
- "No manual approval button" stance — D3 discusses governance separation; NodeInfra implements as architectural rule (operators cannot override the policy engine; they must edit rules, which are themselves logged).

Local source: `../normalized/docs/compliance__decision-lifecycle.md`

---

### 2.3 D5 — Audit / Event Sourcing / Evidence Chain ↔ NodeInfra 2-layer audit

[Source Fact] NodeInfra's audit model:
- **Layer 1** — per-action TEE receipts: every ledger change is accompanied by an enclave-signed receipt (Withdraw/Sweep = chain Ed25519 sig; Transfer = enclave `verify_and_authorize` receipt; Deposit = chaindb cross-check). Foreign-key constraint forces orphan ledger entries to be **structurally impossible**. Defends in **real time**.
- **Layer 2** — SHA-256 hash chain over per-account ledger entries + periodic enclave-signed checkpoints over `chain_head_hash ‖ account_id ‖ entry_count ‖ timestamp`. MRENCLAVE included in signed checkpoint. Defends in **post-tamper detection** (point-in-time state proofs, non-repudiation).
- Audit DB tables: `signing_events` (with `approver_decision_rationale` CBOR), `key_lifecycle`, `master_key_operations`.
- Cross-DB join: `policy_decisions.request_id` ↔ `signing_events.chain_evidence_ref` ↔ on-chain `tx_hash`.
- Auditor verification: DCAP remote attestation → enclave pubkey → receipt verification → checkpoint chain integrity check → ensure every entry between two checkpoints references an action with a receipt.

[Generalized Mapping] Maps directly to D5's **Unified Evidence Spine** and **append-only invariant**. The 2-layer split is specifically:
- D5 invariant "Audit ≠ Logging" → NodeInfra Layer 1 (structural enforcement, not optional logging).
- D5 invariant "Custody = Evidence system" → NodeInfra's stance that ledger changes without receipts are structurally impossible.
- D5 cross-cluster bridge to D15 (Transparency) — NodeInfra's DCAP remote attestation + signed checkpoints are exactly the externally verifiable evidence path D15 requires.

★ NodeInfra explicitly documents the **limitation** of Layer 2: "체크포인트 사이에 일관된 가짜 엔트리 삽입은 차후 체크포인트가 변조된 헤드를 그대로 서명할 수 있다" — i.e., Layer 2 alone is insufficient for real-time defense. This **explicitly aligns** with D5's discipline of separating real-time evidence (Layer 1) from forensic evidence (Layer 2).

Local source: `../normalized/docs/security__ops__audit-logs.md`

---

### 2.4 D11 — Compliance / AML / Sanctions ↔ NodeInfra rules + regulations (richest mapping)

[Source Fact] NodeInfra documents **10 policy rule types** (9 live + 1 referenced-but-404):
- `global_halt` (priority 10-19) — incident response halt-all
- `address_list` (priority 20-39) — whitelist/blacklist via `condition_sets`
- `time_window` (priority 20-39) — business-hour restrictions
- `per_tx_amount_limit` (priority 40-59) — per-transaction cap
- `daily_withdrawal_limit` (priority 40-59) — cumulative daily cap
- `velocity_limit` (priority 40-59) — daily count limit
- `address_cooldown` (priority 60-79) — new-address cooldown (Held)
- `velocity_window` (priority 60-79) — sliding window count+amount
- `approval_tier` (priority 80-99) — manual approval by amount tier (AUTO / SINGLE_APPROVE / QUORUM_2_OF_3)
- `expression` (priority 100+) — custom DSL with `field`/`operator`/`value` matchers

[Source Fact] NodeInfra documents **5 regulatory regimes** explicitly:
- 한국 특금법 (Korean Specific Financial Information Act — Travel Rule basis)
- 전자금융거래법 (Electronic Financial Transactions Act — EFTA)
- 가상자산이용자보호법 (Virtual Asset User Protection Act — VACPA)
- FATF R.16 (Travel Rule, multi-jurisdiction)
- AML general + KYC general

[Generalized Mapping] Maps to D11's compliance discipline:
- "Compliance = policy-constrained governance" (D11 invariant) → NodeInfra rules engine is exactly this.
- "Policy versioning" (D11 invariant) → NodeInfra `policy_change_log` + `policy_rules` versioning.
- "Sanctions screening as continuous obligation" (D11 evolved invariant, per E2) → NodeInfra address_list whitelist + condition_set continuous evaluation.
- "Travel Rule = identification + information exchange split" → NodeInfra explicitly says "노드월렛은 첫 단계의 기술 통제만 담당합니다" — confirming the D11 boundary that compliance engine handles identification + restriction, not the information-exchange leg.

★ NodeInfra's compliance content **substantially exceeds** D11's generalized treatment in operational detail (specific rule types, specific Korean regulations, specific patterns like "임시 AUTO 변경 후 복원"). D11's generalized invariants hold; NodeInfra provides a concrete instantiation.

Local sources: `../normalized/docs/compliance__rules__*.md` (9 rule pages) + `../normalized/docs/compliance__regulations__*.md` (6 regulation pages) + `../normalized/docs/compliance__decision-lifecycle.md` + `../normalized/docs/compliance__architecture.md`.

---

### 2.5 D14 — Security / Threat Model ↔ NodeInfra trust boundaries + key-theft scenarios

[Source Fact] NodeInfra documents threat model as **explicit key-theft tables** in 3 docs:
- `multisig.md` §키 탈취 시나리오 — per-key attacker capabilities + blocked-at points.
- `tenant.md` §한 테넌트가 탈취되어도 — per-tenant attacker scenarios.
- `audit-logs.md` §위협 모델 — defense matrix Layer 1 vs Layer 2.

[Source Fact] Threat-model framing:
- "각 경계는 서로 다른 인증 수단과 검증 로직을 적용하며, 이전 경계의 신뢰를 그대로 이어받지 않습니다" (each boundary applies different auth + validation; trust does not carry over).
- 4 boundary classes (trust-boundaries.md): Client → DMZ → 격리구역 → TEE. Auth methods differ per boundary.
- Per-key storage: 개시·승인 키 in HSM partition; 실행 키 in SGX-sealed blob (disk).

[Generalized Mapping] Maps to D14's "Security = adversarial state-of-mind embedded" invariant. NodeInfra's discipline of **non-transitive trust across boundaries** is exactly D14's framing. Per-key scenario tables match D14's adversarial-resilience analysis pattern.

★ NodeInfra explicitly addresses **HSM physical compromise** (FIPS 140-3 Level 3 — non-extractable) and **SGX host compromise** (MRENCLAVE binding — sealed blob non-unsealable by other images) as named threat classes. This matches D14's "trust boundaries B1-B14+" framework, though NodeInfra enumerates fewer boundaries (4 explicit) — likely reflecting D14's broader institutional scope vs NodeInfra's deployment scope.

Local sources: `../normalized/docs/security__architecture__multisig.md`, `../normalized/docs/security__architecture__tenant.md`, `../normalized/docs/security__architecture__trust-boundaries.md`, `../normalized/docs/security__ops__audit-logs.md`.

---

### 2.6 D6 — 3-way Custody Decision Framework ↔ NodeInfra's own comparison table

[Source Fact] NodeInfra's `index.md` §다른 솔루션과의 비교 explicitly compares:
- "VASP 하이브리드" — VASP + SaaS, suited for Korean exchange environments.
- "Cloud MPC 계열" — pure SaaS, suited for global SaaS environments.
- "노드월렛 (본 POC)" — installable software, suited for Korean financial institution environments.

Comparison axes: 제품 종류 / 망분리 대응 / 배포 모드 / 보안 모듈 / 키 소유권 / 정책 실행 위치 / 인증 / 적합 환경 / 외부 의존성.

[Generalized Mapping] This is **NodeInfra's first-person framing of D6's 3-way framework**, with vendor positioning. The 3 columns map approximately:
- "VASP 하이브리드" ≈ D6's "Hosted MPC + VASP" hybrid
- "Cloud MPC 계열" ≈ D6's "SaaS" arm
- "노드월렛" ≈ D6's "Direct-build / Installable" arm

★ NodeInfra implicitly positions itself as the **Direct-build arm with vendor delivery** — installable software that the institution operates, with vendor providing software + (KCMVP/GS/보안기능확인서) certifications. This is an intermediate point in D6's framework that the generalized D6 mentions as "★ Hypothesis: Direct-build with vendor-supplied software." NodeInfra provides a concrete instantiation.

Local source: `../normalized/docs/index.md` §다른 솔루션과의 비교.

---

## 3. Detailed mappings — EMBEDDED

### 3.1 D1a — Vault/Wallet/Ledger Schema ↔ NodeInfra DB tables

[Source Fact] NodeInfra documents 3 databases:
- **approverdb** — policy domain
  - `policy_rules` (mutable, with `policy_change_log` audit)
  - `policy_decisions` (append-only via `prevent_mutation()` trigger; hash-chained)
  - `held_deposits` / `held_withdrawals` (decision columns set-once, payload immutable)
  - `velocity_windows` (insert-only sliding window counters)
  - `address_first_use` (insert-only)
  - `condition_sets` / `condition_set_items` (admin-mutable; address group references)
  - `policy_change_log` (append-only change audit)
- **auditdb** — signing/lifecycle events
  - `signing_events` (with `approver_decision_rationale` CBOR + hash chain)
  - `key_lifecycle` (key generation/rotation/registration)
  - `master_key_operations` (master KEK provisioning, TOFU pin, config signing)
- **ledgerdb** — balance tracking (referenced but not documented in detail)
- **chaindb** — deposit verification (referenced but not documented in detail)

[Source Fact] NodeInfra documents 3 wallet types (in `dev/architecture`):
- 사용자 지갑 (user wallet) — per user, deposit address
- 집중 지갑 (omnibus wallet) — 1 per tenant, system-created at bootstrap, hot wallet for swept funds + withdrawal source
- 가스대납 지갑 (gas-payer wallet) — 1 per tenant, SOL only, fee subsidization

[Generalized Mapping] Maps to D1a's wallet/ledger schema but with **vendor-specific specializations**:
- D1a's "Vault / Wallet / Ledger" 3-plane abstraction collapses to NodeInfra's 3-DB split.
- D1a's "9-plane DB" generalized layout is **narrower** in NodeInfra (4-DB split: approver / audit / ledger / chain).
- D1a's "secrets DB 저장 금지" invariant is preserved — NodeInfra never stores key material in DB; HSM + SGX-sealed-blob only.
- D1a's "selective ES" — NodeInfra implements via signing_events + policy_decisions append-only + hash chain (matching selective event-sourcing discipline).

★ NodeInfra's omnibus pattern (1 집중 지갑 per tenant) is **simpler** than D1a + D18 (which generalizes prime brokerage and complex omnibus structures). NodeInfra's wallet structure is a minimal viable institutional model.

---

### 3.2 D1b — Reconciliation ↔ NodeInfra integrity-check task

[Source Fact] NodeInfra states: "정합성 체크 작업 — 원장 ↔ 작업 레코드 ↔ 온체인 상태를 짧은 주기로(권장: 60초 이하) 대조하며, 불일치 시 즉시 알림."

[Generalized Mapping] Maps to D1b's **5 truth-domain reconciliation** model:
- Ledger ↔ Action records ↔ On-chain state = 3 of D1b's 5 truth domains (Internal ledger / Authoritative action log / Blockchain canonical state).
- D1b's "Reconciliation = cross-truth-domain consistency proof" invariant is exactly NodeInfra's integrity-check.

★ NodeInfra is silent on the other 2 D1b truth domains (Reserve attestation, Counterparty ledger). For NodeInfra's scope (single-jurisdiction, single-chain, no cross-institution clearing), these may not apply.

---

### 3.3 D7 — Deposit Lifecycle ↔ NodeInfra "Deposit = observe"

[Source Fact] NodeInfra: "Deposit — 관찰 경로. 체인 이벤트를 수집·검증하므로 서명 의식에 포함되지 않으며, 입금된 자금의 이동은 Sweep에서 3키 의식을 거칩니다."

[Source Fact] Deposit verification details are off-site (GitHub `docs/design/deposit_verification.md`) — not in Mintlify docs.

[Generalized Mapping] Maps to D7's "Deposit = controlled ledger recognition" invariant — NodeInfra explicitly separates **observe** (chain event ingestion + verification) from **recognize** (sweep, which is signing ceremony). This is exactly D7's structural separation.

★ NodeInfra's docs are sparse on deposit. Most detail is off-site. The Mintlify docs only assert the structural pattern; operational details are likely in customer-facing internal docs.

---

### 3.4 D18 — Omnibus / Clearing ↔ NodeInfra 집중 지갑

[Source Fact] NodeInfra: "집중 지갑 — 사용자 입금이 스윕되어 모이는 핫월렛. 출금 자금의 출처. 테넌트 부트스트랩 시 시스템이 자동 생성, 테넌트당 1개. DB 무결성 제약으로 강제."

[Generalized Mapping] Maps directly to D18's "Omnibus = delegated settlement abstraction" invariant. NodeInfra's omnibus is a **simple per-tenant pattern** (1 omnibus wallet, no prime-brokerage layering, no cross-tenant netting).

★ NodeInfra does not implement D18's full prime-brokerage abstraction — the omnibus is single-tier per tenant. This is consistent with single-jurisdiction single-chain scope.

---

### 3.5 D19 — Internal Netting ↔ NodeInfra Transfer

[Source Fact] NodeInfra: "Transfer — 내부 원장 이동. 개시 키+승인 키만 서명하고, 체인 서명 대신 엔클레이브 verify_and_authorize 영수증이 감사 로그 Layer 1에 기록됩니다."

[Generalized Mapping] Maps to D19's "Internal netting = liquidity compression" invariant. NodeInfra's Transfer flow is a 2-key + enclave-receipt internal ledger move with no chain signing — a textbook D19 implementation.

★ NodeInfra does not document cross-tenant internal transfers or aggregation patterns. Transfer is described as within a single tenant's ledger.

---

### 3.6 D12 / D26 — Operational Maturity / Custody Failure ↔ NodeInfra `global_halt` + trust-boundaries failure analysis

[Source Fact] NodeInfra `global_halt` rule: "기본값은 deny_with_message — 모든 트랜잭션을 즉시 차단. 사고 대응 / 보안 사고 / 정책 점검 등에서 사용."

[Source Fact] NodeInfra trust-boundaries §한 경계를 뚫어도: per-boundary attacker-already-compromised analysis.

[Generalized Mapping] Maps to D12's "human-coordinated incident command" and D26's "cascading coordination across all domains." NodeInfra's `global_halt` is the **operational kill-switch**; trust-boundaries' compromise analysis is the **architectural defense-in-depth**.

★ NodeInfra does not document broader incident command processes (escalation, rotation, on-call procedures). D12's full scope is broader than what NodeInfra publishes.

---

## 4. Detailed mappings — SILENT (notable gaps)

The following D-series concerns are **not addressed** in NodeInfra's public docs:

| D# | Concern | Why likely silent (★ Hypothesis) |
|----|---------|---------------------------------|
| D9 | Multi-chain | NodeInfra is Solana-only; multi-chain adapter abstraction unnecessary |
| D10 | Treasury / Mint-Burn | NodeInfra positions as custody, not issuer/stablecoin treasury operator |
| D13 | Cross-border / FX | Single-jurisdiction (KR) positioning |
| D17 | Treasury Optimization | Outside product scope |
| D20 | Cross-institution Liquidity | NodeInfra is single-institution installable software |
| D21 | Stablecoin Depeg | Custody scope, not stablecoin issuer scope |
| D22 | Chain Halt | Single-chain; Solana-specific failure modes likely in internal docs |
| D23 | Jurisdictional Split | Single-jurisdiction (KR) positioning |
| D25 | Systemic Liquidity Freeze | Single-institution scope |
| D27-D32 | Frontier (CBDC / Intent / Autonomous / AI / Privacy / PQ) | Frontier scope outside current product positioning |

**Common explanation**: NodeInfra is a **narrow-scope, deeply-focused product**. The D-series corpus generalizes across decades of institutional custody concerns; NodeInfra addresses a focused 2026 KR-institutional-Solana-stablecoin segment. Silence on D-series frontier and multi-jurisdiction concerns is **architecturally consistent** with the product positioning, not an oversight.

---

## 5. Cross-cluster bridge observations

★ Hypothesis — NodeInfra's docs exhibit several cross-cluster bridges that match the C3 dependency graph:

- **D2 → D5 bridge** — multisig's signing chain produces D5's Layer 1 evidence (chain Ed25519 sig as receipt). NodeInfra implements this bridge **explicitly** (multisig.md §서명 흐름 produces audit-logs.md §Layer 1 entries).
- **D3 → D5 bridge** — decision-lifecycle's `auth_approver_sig` writes to audit-logs's signing_events.approver_decision_rationale. Cross-DB join via `request_id`.
- **D11 → D24 bridge** — compliance rules + decisions feed audit reports (compliance/regulations/reports.md).
- **D14 → D15 bridge** — threat model defenses include DCAP attestation, which is also D15's externally-verifiable evidence channel.
- **D11 → D3 bridge** — approval_tier (D11 rule) emits Held (D3 governance state) which routes through coordinator polling.

These bridges are **load-bearing** in NodeInfra's architecture and match the C3 dependency graph's bridge invariants.

---

## 6. Vendor-specific deviations from D-series framing

★ Hypothesis — NodeInfra introduces or emphasizes patterns that the generalized D-series does not centrally name:

1. **HSM-partitioned 3-key multisig** as alternative to MPC. D2 centers MPC; NodeInfra uses HSM partitions. The trust-distribution outcome is similar; the cryptographic mechanism differs.
2. **SGX-sealed execution key with HSM-independent operation** — once provisioned, the SGX enclave operates without HSM access. D14 generalizes TEE patterns; NodeInfra's specific architecture (master key wrapped via RSA-OAEP into enclave's one-time RSA key, then sealed to MRENCLAVE) is a concrete instantiation.
3. **Single approver = no manual override** — NodeInfra's policy that "approval button" does not exist; operators must edit rules (logged) to change decisions. D3 discusses governance separation; NodeInfra implements a **strong** version.
4. **Hot reload via ArcSwap + DB trigger** — NodeInfra's specific atomic-swap mechanism. D5 mentions policy versioning; NodeInfra concretizes.
5. **Decision-cross-evidence CBOR embedding** — NodeInfra embeds `PolicyDecision` CBOR in `signing_events.approver_decision_rationale`, providing cross-DB tamper-evident binding. D5 generalizes evidence; NodeInfra implements via in-row CBOR.
6. **Per-tenant 3-key sets** — NodeInfra's tenant isolation via SPKI-hash binding on each of 3 keys. D14 + D1a discuss tenant isolation; NodeInfra implements 3-key cross-verification.
7. **Korea-specific certifications** — KCMVP / GS / 보안기능확인서 / ISMS. The D-series generalizes regulatory regimes; NodeInfra's certification stack is KR-specific.

These deviations are documented in detail in `vendor-specific-patterns.md`.

---

## 7. Mapping update protocol

When NodeInfra docs change:
- Re-fetch via crawler (auth cookie may need refresh).
- Re-run html2md.py + normalize.py.
- Update this mapping with new EXPLICIT / EMBEDDED / SILENT classifications.
- Add new vendor-specific patterns to `vendor-specific-patterns.md`.

When the generalized corpus evolves (new D / C / E / R / T docs):
- Re-evaluate mappings; previously-SILENT areas may have NodeInfra coverage that becomes visible under new framing.
- Update §1 summary table.

When NodeInfra adds multi-chain / multi-jurisdiction / treasury / frontier sections:
- Update §4 SILENT → EXPLICIT/EMBEDDED migrations.
- Update §1 coverage summary.
