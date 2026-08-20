# NodeInfra — Vendor-Specific Patterns

> Collected: 2026-05-20
> Source: 41 NodeInfra docs under `../normalized/docs/`
> Discipline: only patterns that are NodeInfra-specific (i.e., would not appear in a generalized D-series doc as a default). Where ambiguous, marked ★ Hypothesis.

---

## 0. What this file does

Catalog of architectural and operational choices that are **specific to NodeInfra (NodeWallet)** — not necessarily wrong or unusual in isolation, but distinctive enough that they would not appear in a generalized custody-architecture corpus as defaults. These are the patterns a PM / architect extracting from NodeInfra needs to **explicitly choose** when designing a similar system.

Each pattern carries:
- **What** — the pattern.
- **Where** — source page.
- **Why (★ Hypothesis)** — likely rationale.
- **PM/architecture implication** — what a builder must decide.

---

## 1. Topology / Deployment

### P1.1 — On-prem 망분리 (air-gap segregated) installable software

**What**: NodeInfra ships as installable software for customer-controlled air-gap-segregated data centers. Vendor does not host any production data.

**Where**: `/index` §보안.

**Why (★)**: Korean financial regulation (망분리 requirements for financial institutions handling sensitive data) makes cloud-hosted custody non-viable for the target market.

**PM implication**: Building a similar product requires
- Software-only distribution (no SaaS).
- Installation + ops documentation for customer's IT.
- Update / patch delivery without phoning home.
- All trust state (keys, policies, audit) inside customer perimeter.

### P1.2 — Tenant model = institutional sub-unit (계열사 / 부서 / 상품군)

**What**: A "tenant" is an institutional sub-unit (subsidiary, department, product line) — not an external customer of the platform. Single deployment may host multiple tenants from the same parent institution.

**Where**: `/security/architecture/tenant`.

**Why (★)**: Target customers (banks, card companies, securities) operate multiple independent business units that each need isolated key + policy state.

**PM implication**: Tenant model is **first-class** in DB schema; not retrofit. Decide tenant granularity at design time.

---

## 2. Cryptographic choices

### P2.1 — HSM-partitioned 3-key multisig (not MPC, not single-key HSM)

**What**: Three independent signature keys (개시 / 승인 / 실행), each in a separate HSM partition (or separate HSM). Operations require signatures from all 3 keys in sequence.

**Where**: `/security/architecture/multisig`, `/security/keys/hsm`.

**Why (★)**:
- Avoids MPC's "single signature from distributed shares" model — each of the 3 keys produces a distinct signature, which simplifies auditability.
- HSM (FIPS 140-3 Level 3) provides physical non-extractability for 2 of 3 keys.
- Korean financial certifications (KCMVP, 보안기능확인서) align well with HSM-based architectures.

**PM implication**:
- Decide HSM vendor mix (Thales Luna vs Utimaco vs YubiHSM2).
- Plan for single-HSM-partitioned vs multi-HSM topology.
- Designate which service holds which key.
- Plan operator m-of-n quorum per partition / per HSM.

### P2.2 — SGX-sealed execution key with HSM-independent operation

**What**: The execution key (실행 키) is generated in HSM, wrapped via RSA-OAEP into a one-time RSA keypair generated inside the SGX enclave, decrypted inside enclave, then sealed to MRENCLAVE. After provisioning, HSM access is not required for signing; the execution key is read from sealed blob at startup.

**Where**: `/security/keys/hsm` §키 생성과 래핑, `/security/keys/tee-enclave`.

**Why (★)**:
- Reduces HSM session load for high-frequency chain signing.
- Provides MRENCLAVE binding — only the correct enclave image can unseal.
- Allows execution-key HSM to be moved to cold storage post-provisioning ("실행 키 전용 HSM 오프라인 전환").

**PM implication**:
- SGX-capable hardware required (Intel CPU with SGX support).
- Enclave image MRENCLAVE management is a first-class operational concern.
- Image rotation requires re-provisioning ceremony.
- DCAP remote attestation infrastructure required for auditor verification.

### P2.3 — Ed25519 only (Solana-native)

**What**: All chain signing uses Ed25519 (Solana primitive). API key signing also uses Ed25519. No ECDSA / Schnorr / BLS support.

**Where**: `/security/architecture/multisig` (Ed25519 execution sign), `/dev/architecture` (Ed25519 signing).

**Why (★)**: Solana-only chain support; Ed25519 is the native chain primitive; single-curve discipline simplifies the signing pipeline.

**PM implication**:
- Adding non-Solana chains requires extending the curve support (Ethereum = secp256k1, etc.).
- Multi-curve support is a substantial architectural lift; NodeInfra has deferred it.

### P2.4 — PKCS#11 v2.40/v3.0 abstraction

**What**: All HSM access goes through PKCS#11 standard. Slot/session mapping is the only deployment-config change to move from single-HSM-partitioned to multi-HSM.

**Where**: `/security/keys/hsm` §PKCS#11 인터페이스.

**Why (★)**: Vendor-portability — Thales Luna / Utimaco / YubiHSM2 all expose PKCS#11. Avoids per-vendor SDK lock-in.

**PM implication**:
- PKCS#11 v2.40 minimum; v3.0 preferred.
- Java SDK uses Sun PKCS#11 provider (jdk crypto bridge).
- HSM driver installation is part of deployment ops.

---

## 3. Compliance engine

### P3.1 — 10 named rule types with priority + short-circuit evaluation

**What**: A closed set of 10 rule types (`global_halt`, `address_list`, `time_window`, `per_tx_amount_limit`, `daily_withdrawal_limit`, `velocity_limit`, `velocity_window`, `address_cooldown`, `approval_tier`, `expression`). Each rule has priority; evaluation is ordered ascending; first Deny or Held short-circuits.

**Where**: `/compliance/rules/*`, `/compliance/decision-lifecycle`.

**Why (★)**: Bounded rule taxonomy reduces audit complexity; priority + short-circuit gives operators a clear mental model; `expression` provides escape valve for custom rules.

**PM implication**:
- Closed rule set is **a product decision** — extending it requires schema + UI work.
- Priority ranges are conventions (10-19 incident, 20-39 static, 40-59 limits, 60-79 dynamic, 80-99 manual, 100+ custom). Not enforced; documented as guidance.
- Same priority → undefined order; design rules with priority gaps.

### P3.2 — Coordinator pre-computes evaluation context

**What**: The policy engine (`승인자`) does **not** query the ledger directly. The coordinator pre-computes context fields (daily_withdrawal_total, daily_withdrawal_count, account_balance) and passes them as `EvaluationContext` struct.

**Where**: `/compliance/architecture` §평가 흐름, `/compliance/decision-lifecycle` §평가에 입력되는 컨텍스트.

**Why (★)**: Hot-path simplification for policy engine; ledger consistency burden remains in ledger transaction boundary (not duplicated in policy engine).

**PM implication**:
- Coordinator is a load-bearing component, not optional middleware.
- Pre-computation must be consistent with ledger snapshot — race conditions between context computation and ledger state need handling.
- Missing context field → fail-closed Deny (explicitly documented).

### P3.3 — Hot reload via ArcSwap

**What**: Policy rule changes go through DB INSERT/UPDATE → `policy_change_log` trigger → approver's loader task detects → atomic `ArcSwap` replaces the rule set. Single in-flight evaluation uses the rule snapshot from start.

**Where**: `/compliance/architecture` §Hot Reload, `/compliance/decision-lifecycle` §Hot Reload.

**Why (★)**: Operational latency — compliance teams must adjust rules without re-deploy; Korean regulatory environment can change quickly.

**PM implication**:
- ArcSwap or equivalent atomic-pointer-swap is required.
- Single-request rule snapshot consistency is a correctness invariant — race-free design.
- Rule reload latency is bounded by loader polling cadence.

### P3.4 — No manual approval button; only rule edits

**What**: The console **does not** have an "approve" button to resolve Held decisions. To resolve a Held, the operator must edit the policy rule itself, which is logged in `policy_change_log`. Common pattern: temporarily change `approval_tier` to AUTO, let coordinator polling pass, restore.

**Where**: `/compliance/decision-lifecycle` §수동 승인 없는 이유, `/compliance/rules/approval-tier` §Held 의 외부 해소.

**Why (★)**:
- Strong separation of policy ownership: operators cannot override policy engine.
- Every override is rule-level and audited.
- Eliminates "two-tier authority" problem (policy says X, operator overrides to Y).

**PM implication**:
- No "override" UI element; do not build one.
- Operators must coordinate ceremony externally (meetings, separate channels) and then perform a rule edit.
- This is **stronger** than D3's typical governance separation — adopt only if institution can support the discipline.

### P3.5 — 24h Held TTL → auto-Deny

**What**: A Held decision auto-resolves to Deny after 24 hours of polling without an Allow.

**Where**: `/compliance/decision-lifecycle` §Sticky decision.

**Why (★)**: Prevents indefinite limbo; forces operational resolution within a business day window.

**PM implication**:
- 24h is hardcoded; making it tenant-configurable is a product extension.
- Operations team must know: if a Held isn't resolved in 24h, the transaction is rejected and must be re-submitted.

### P3.6 — Set-once signing columns

**What**: `auth_approver_sig` / `auth_approver_pubkey` columns can be INSERTed exactly once. Once set, cannot be modified. DB-enforced.

**Where**: `/compliance/decision-lifecycle` §Sticky decision.

**Why (★)**:
- Prevents signature replacement / rotation attacks.
- Provides forensic immutability of decision-time signature.

**PM implication**:
- DB triggers / column constraints required.
- Adopt single-column-INSERT pattern (no UPDATE allowed for these columns).

### P3.7 — Reference_id mandatory for idempotency

**What**: Withdrawal / Transfer requests must include `reference_id` (idempotency key). Duplicate `reference_id` is rejected at the `initiator_nonce_seen` table layer.

**Where**: `/dev/architecture` §편의성.

**Why (★)**: Distributed call paths (financial backends often retry) require idempotency. Mandatory (not optional) prevents accidental double-spend.

**PM implication**:
- API contract: caller generates idempotency key (UUID typical).
- Server-side `(initiator_pubkey, nonce)` index prevents duplicate processing.
- 60-second TLS-signed timestamp window provides additional replay protection.

---

## 4. Audit / Evidence

### P4.1 — 2-layer audit (real-time + post-tamper)

**What**:
- Layer 1: per-action enclave-signed receipts (chain Ed25519 sig OR enclave verify_and_authorize receipt). Foreign-key constraint enforces every ledger entry references an action with a receipt.
- Layer 2: SHA-256 hash chain over per-account ledger entries + periodic enclave-signed checkpoints over chain head.

**Where**: `/security/ops/audit-logs`.

**Why (★)**:
- Layer 1 alone is real-time but doesn't survive multi-step tamper attempts (attacker with DB write + signing forge would defeat Layer 1; signing forge is blocked by SGX enclave).
- Layer 2 alone is forensic but doesn't defend in real time (attacker between checkpoints can re-compute chain).
- Together: real-time defense + post-tamper proof.

**PM implication**:
- Both layers must be implemented; neither alone is sufficient.
- Checkpoint cadence is a design decision (NodeInfra: 1-hour or 100-entry, whichever first).
- DCAP remote attestation infrastructure for auditor verification.

### P4.2 — Cross-DB evidence binding via CBOR

**What**: `signing_events.approver_decision_rationale` holds the CBOR-encoded `PolicyDecision` from the approver. Cross-DB join via `request_id` ↔ `tx_hash` ↔ `chain_evidence_ref`.

**Where**: `/compliance/architecture` §4-축 격리 안에서의 위치.

**Why (★)**: Decision and signing live in separate databases (approverdb vs auditdb); embedding the decision rationale in the signing row makes the link tamper-evident even if either DB is compromised independently.

**PM implication**:
- CBOR (or equivalent compact serialization) for cross-DB embedded evidence.
- Schema design must reserve a column for embedded-evidence blobs.
- Decoder available to auditors.

### P4.3 — MRENCLAVE recorded in signed checkpoint

**What**: Every signed checkpoint records the MRENCLAVE of the enclave image that signed it. Image rotation produces visible MRENCLAVE rotation in audit trail.

**Where**: `/security/ops/audit-logs` §Layer 2.

**Why (★)**: Auditor must be able to verify not just "this checkpoint is enclave-signed" but "which enclave version signed it." Image upgrades must be traceable.

**PM implication**:
- MRENCLAVE registry tracking deployed enclave images is operationally required.
- Image rotation = governance event (logged, attestation re-issued).
- Old MRENCLAVE values must remain known for historical verification.

---

## 5. Wallet structure

### P5.1 — Three wallet types per tenant (사용자 / 집중 / 가스대납)

**What**:
- 사용자 지갑 (user wallet): per-user deposit address, created via `client.wallets().create()`.
- 집중 지갑 (omnibus wallet): exactly 1 per tenant, system-created at bootstrap, hot wallet for swept funds + withdrawal source.
- 가스대납 지갑 (gas-payer wallet): exactly 1 per tenant, SOL only, gas subsidization for sweep/withdraw tx.

**Where**: `/dev/architecture` §지갑 종류.

**Why (★)**:
- Per-user deposit addresses simplify customer attribution.
- Single omnibus per tenant simplifies treasury accounting.
- Separate gas-payer wallet keeps SOL inventory clean from stablecoin inventory.

**PM implication**:
- Single-omnibus assumption baked in; multi-omnibus tier (e.g., hot/warm/cold) is a product extension.
- Gas-payer balance monitoring is operational concern (SDK or external poll).
- Tenant bootstrapping is a structural event, not an API call (system creates 집중·가스대납).

### P5.2 — User wallets created via SDK; omnibus/gas-payer system-created

**What**: SDK exposes `client.wallets().create()` for user wallets only. Omnibus and gas-payer wallets cannot be created via SDK — they are bootstrapped by the system at tenant provisioning.

**Where**: `/dev/architecture` §자금 흐름.

**Why (★)**: Prevents accidental creation of multiple omnibus wallets (which would invalidate the single-omnibus accounting model).

**PM implication**:
- API surface deliberately restricted.
- DB integrity constraint enforces 1 omnibus per tenant.
- Tenant provisioning is a separate operational process, not a runtime API call.

---

## 6. Sweep / settlement semantics

### P6.1 — Sweep follows full 3-key signing path (same as withdrawal)

**What**: When swept from a user wallet to the omnibus, the sweep transaction goes through the full 3-key signing ceremony — same path as a customer-initiated withdrawal.

**Where**: `/security/architecture/multisig` §작업별 차이.

**Why (★)**: Sweep moves funds out of one wallet; from the chain's POV it's a withdrawal. Treating it as a 3-key event keeps the security envelope consistent.

**PM implication**:
- No "internal sweep shortcut" — all on-chain moves use the same ceremony.
- Sweep cadence is a coordination concern with chain fees.

### P6.2 — Transfer = internal ledger + 2-key + enclave receipt

**What**: Internal transfer (between accounts in the same tenant ledger) uses 개시 + 승인 keys (no execution key, no chain signing). Enclave produces a `verify_and_authorize` receipt that is logged in Layer 1 audit.

**Where**: `/security/architecture/multisig` §작업별 차이, `/compliance/architecture`.

**Why (★)**: Internal transfers do not touch chain; chain signing is unnecessary; but enclave receipt provides Layer 1 audit symmetry.

**PM implication**:
- Internal transfer is a first-class operation distinct from chain withdrawal.
- Ledger consistency burden is on the coordinator, not the chain.

---

## 7. Korean regulatory specifics

### P7.1 — Korean regulatory regime stack

**What**: NodeInfra documents 5 regulatory regimes explicitly:
- 특금법 (특정금융정보의 보고 및 이용 등에 관한 법률) — Travel Rule basis
- 전자금융거래법 (EFTA) — financial institution electronic transaction obligations
- 가상자산이용자보호법 (VACPA) — virtual asset user protection
- FATF R.16 — Travel Rule global
- AML / KYC general

**Where**: `/compliance/regulations/*`.

**Why (★)**: Target market = Korean institutional finance; the compliance feature set must address the specific Korean regulatory stack.

**PM implication**:
- Implementing a similar product in a different jurisdiction requires understanding the local stack (EU MiCA, US BSA, Singapore PSA, etc.) — they are not interchangeable.
- Some Korean concepts (예: VACPA's customer-segregation requirement) have no direct equivalent in other jurisdictions.

### P7.2 — Certification stack (KCMVP / GS / 보안기능확인서 / ISMS)

**What**: NodeInfra positions certifications as competitive differentiator:
- KCMVP (Korean Cryptographic Module Validation Program)
- GS (Good Software certification)
- 보안기능확인서 (security function verification certificate)
- ISMS (예정 — planned)

**Where**: `/index` §다른 솔루션과의 비교.

**Why (★)**: Korean financial institution procurement often requires these certifications; SaaS competitors typically have only ISMS or SOC 2.

**PM implication**:
- Certification timeline is part of product roadmap.
- KCMVP requires specific cryptographic primitives (Korean SEED, ARIA, HIGHT optional support may be required for some regulatory classes).

### P7.3 — VASP whitelist as Travel Rule mechanism

**What**: NodeInfra implements Travel Rule's first phase (identification + technical restriction) via `address_list` whitelist mode + `condition_sets` of curated VASP hot-wallet addresses. Information exchange (TRP / Sygna / Notabene) is **external** to NodeInfra.

**Where**: `/compliance/regulations/travel-rule`.

**Why (★)**: Information-exchange protocols are an integration layer with multiple providers; building it in-product would be vendor-lock.

**PM implication**:
- Travel Rule integration is split: NodeInfra (identification + restriction) + external solution (information exchange).
- VASP address curation is an ongoing operational concern (sources change, addresses rotate).

---

## 8. Developer experience

### P8.1 — Java SDK + Spring Boot Auto-Configuration

**What**: NodeInfra's primary developer surface is a Java SDK with Spring Boot Auto-Configuration. Type-safe domain model (`SolanaAddress`, `WalletId`, `TokenId`). Single-code-path between dev (SoftHSM2) and prod (Thales/Utimaco).

**Where**: `/dev/architecture`, `/dev/sdk/installation`, `/dev/spring/*`.

**Why (★)**: Target market = Korean institutional backends, predominantly Java/Spring.

**PM implication**:
- Single-language SDK (Java); no Python, no Node.js SDKs documented.
- Spring-specific auto-config implies tight coupling to Spring conventions.
- Non-Java integrations would require either: (a) HTTP API surface (not publicly documented), or (b) language-specific SDK ports.

### P8.2 — Production mode forbids SoftHSM2

**What**: `mode=production` configuration actively blocks SoftHSM2 (software HSM) from being used. Prevents accidental production deployment with insecure key storage.

**Where**: `/dev/architecture` §보안.

**Why (★)**: Operator error mitigation; SoftHSM2 is a development-only key store.

**PM implication**:
- Configuration mode is a structural guard, not advisory.
- Production deployments must use hardware HSM; no override.

### P8.3 — 33 ErrorCode types

**What**: NodeInfra SDK exposes 33 distinct `ErrorCode` enum values mapped to type-specific exception classes.

**Where**: `/dev/architecture` §편의성.

**Why (★)**: Structured error handling lets backend code distinguish recoverable from non-recoverable errors precisely.

**PM implication**:
- Error-code catalog is a versioned API contract.
- New error codes require SDK version bump.

---

## 9. Patterns extractable as design templates

Patterns from NodeInfra that can be **templated** for a new institutional custody product:

### Template T1 — 3-key institutional signing
- 1 initiation key (in client SDK's HSM)
- 1 approval key (in policy engine's HSM)
- 1 execution key (in TEE)
- Per-tenant key sets
- HSM partitioning OR multi-HSM

### Template T2 — Compliance rule engine
- Closed rule taxonomy with extension point (`expression`)
- Priority + short-circuit evaluation
- 3-verdict (Allow / Held / Deny) + sticky decision + set-once sig
- Coordinator pre-computes evaluation context
- Hot reload via atomic pointer swap

### Template T3 — 2-layer audit
- Layer 1: per-action TEE receipts + FK-enforced no-orphan ledger
- Layer 2: SHA-256 hash chain + periodic enclave-signed checkpoint
- MRENCLAVE recorded in checkpoint
- Cross-DB embedded CBOR rationale binding

### Template T4 — 3-wallet tenant model
- Per-user deposit wallets
- 1 omnibus hot wallet per tenant
- 1 gas-payer wallet per tenant
- System-bootstrapped omnibus/gas-payer (not SDK-creatable)

### Template T5 — Set-once + append-only DB
- `prevent_mutation()` triggers on decision and signing tables
- Set-once column constraints for signature/approver fields
- Insert-only velocity/cooldown counters
- `policy_change_log` for mutable-policy audit

These templates are **PM-extractable** as starting points for similar architectures.

---

## 10. Pattern update protocol

When new vendor-specific patterns emerge in NodeInfra docs:
- Add to appropriate section above.
- Mark [Source Fact] if directly stated; [★ Hypothesis] if structural inference.
- Note PM/architecture implication for builders.

When generalized D-series corpus adds new ≠ propositions that NodeInfra exhibits:
- Cross-reference here as a "[D-X ≠ proposition] is exhibited as [NodeInfra pattern]."

When NodeInfra explicitly contradicts a D-series default:
- Document in §3 of `invariant-mapping.md` (NodeInfra-design-choice section).
- Do not mark as "violation" — design choices within D-invariants are legitimate.
