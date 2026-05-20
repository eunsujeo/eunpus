# NodeInfra — PM / DB Design Notes

> Compiled: 2026-05-20
> Source: 41 NodeInfra docs under `../normalized/docs/`
> Discipline: extractable design hints; [Source Fact] / [★ Hypothesis] labels preserved.
> This file is the PM-actionable extract — what to build, what to store, what NOT to store.

---

## 0. Purpose

This note extracts **DB schema patterns, storage constraints, runtime-only material, and operational burden** that NodeInfra's docs reveal — usable directly as PM design input when building a similar custody product.

The format is **decision-oriented**: each section answers "what would a PM need to decide about this area?"

---

## 1. Database split

[Source Fact] NodeInfra documents **4 separate databases** with distinct responsibilities:

| DB | Purpose | Mutability profile |
|----|---------|-------------------|
| **approverdb** | Policy domain (rules, decisions, held queue, condition sets) | Mixed: rules mutable (with change log) / decisions append-only / held set-once / counters insert-only |
| **auditdb** | Signing events + key lifecycle | Append-only |
| **ledgerdb** | Balance tracking | Mutable with FK constraints to action records (Layer 1) |
| **chaindb** | Chain event ingestion + deposit verification | Append-only |

### 1.1 PM decisions

- **Database physical split** — 4 separate databases vs single multi-schema deployment. NodeInfra opts for separate DBs (cross-DB joins via well-known keys).
- **Append-only enforcement** — use DB triggers (`prevent_mutation()`), set-once column constraints, foreign-key constraints to enforce structural invariants at storage layer.
- **Cross-DB joins** — via `request_id`, `account_id`, `tx_hash`, `chain_evidence_ref`. Design these keys at schema layer from day 1.

### 1.2 What NodeInfra explicitly documents in each DB

[Source Fact] approverdb tables:
- `policy_rules` — active policy rules (10 types). admin-mutable, change-logged.
- `policy_decisions` — append-only via `prevent_mutation()` trigger; hash-chained.
- `held_deposits` / `held_withdrawals` — Held queue; decision columns set-once, payload immutable.
- `velocity_windows` — insert-only sliding window counters (used by `velocity_window` rule).
- `address_first_use` — insert-only (used by `address_cooldown` rule).
- `condition_sets` / `condition_set_items` — address groups referenced by `address_list` / `expression`. Admin-mutable.
- `policy_change_log` — append-only policy change audit (CREATE / UPDATE / DELETE with old_data / new_data).
- `initiator_nonce_seen` — idempotency table; (initiator_pubkey, nonce) primary key.

[Source Fact] auditdb tables:
- `signing_events` — chain signing events with `approver_decision_rationale` (CBOR PolicyDecision) + SHA-256 hash chain + `chain_evidence_ref` (for cross-DB join).
- `key_lifecycle` — key generation, sealing, activation, rotation, revocation.
- `master_key_operations` — master KEK provisioning, TOFU pin, config signing.

[Source Fact] ledgerdb (less detail in docs):
- Per-account ledger entries with `prev_hash` field for SHA-256 hash chain.
- Foreign-key constraint to action records (Layer 1 invariant).
- Per-account-id hash chain (not global).

[Source Fact] chaindb (less detail in docs):
- On-chain deposit/withdrawal events.
- Used by integrity-check task to cross-reference with ledger.

★ Hypothesis: detailed ledgerdb + chaindb schema are in internal NodeInfra docs (referenced via GitHub paths but not retrieved).

---

## 2. What to store / never store

### 2.1 NEVER STORE

[Source Fact]
- **Key material** — neither HSM-held keys nor SGX execution-key plaintext goes to DB. HSM holds via PKCS#11; SGX holds via sealed blob (file on disk, MRENCLAVE-bound).
- **Master key plaintext** — generated in HSM, RSA-OAEP-wrapped to enclave's one-time pubkey, decrypted inside enclave, sealed. Plaintext never crosses HSM/enclave boundary.

[★ Hypothesis] — extrapolated from "secrets DB 저장 금지" D1a invariant + NodeInfra structure:
- **PINs / passcodes / customer secrets** — not stored in approverdb / ledgerdb / chaindb / auditdb.

### 2.2 STORE BUT APPEND-ONLY

[Source Fact]
- `policy_decisions` — every evaluation result.
- `signing_events` — every chain signing event.
- `policy_change_log` — every rule mutation.
- `key_lifecycle` — every key state change.
- `master_key_operations` — every master KEK event.
- `velocity_windows` — every counter increment.
- `address_first_use` — every new-address first-use timestamp.

★ Implementation invariant: DB trigger `prevent_mutation()` blocks UPDATE / DELETE on append-only tables.

### 2.3 STORE WITH SET-ONCE COLUMNS

[Source Fact]
- `held_deposits` / `held_withdrawals` — `decision` (HELD → AUTO_APPROVE/DENY, monotone), `auth_approver_sig`, `auth_approver_pubkey` cannot be modified after first non-null INSERT.

### 2.4 STORE MUTABLE WITH CHANGE LOG

[Source Fact]
- `policy_rules` — admin-mutable; every change recorded in `policy_change_log` with `created_by`, `old_data`, `new_data`.
- `condition_sets` / `condition_set_items` — admin-mutable; changes logged.

### 2.5 RUNTIME-ONLY (NOT PERSISTED)

[★ Hypothesis] — extrapolated from NodeInfra docs but not explicitly enumerated:
- Active rule set in approver's `ArcSwap` — runtime-only; persists in DB but the in-memory snapshot is hot-loaded.
- DCAP attestation quotes — generated per-session; not stored (only the resulting pubkey is registered).
- Enclave session state — TLS session state on the CBOR IPC channel.
- Pre-computed `EvaluationContext` for in-flight requests — runtime-only.

---

## 3. Required aggregates / read models

[Source Fact] approver's `EvaluationContext` requires these pre-computed values (coordinator's responsibility):

```rust
pub struct EvaluationContext {
    pub daily_withdrawal_total: Option<i64>,  // 오늘 누적 출금 (lamports)
    pub daily_withdrawal_count: Option<i64>,  // 오늘 누적 출금 건수
    pub account_balance: Option<i64>,         // 현재 잔액
}
```

### 3.1 Aggregates the coordinator must compute

[Source Fact + ★ from rule docs]
- **Daily withdrawal total** (per-account, per-mint, per-day) — for `daily_withdrawal_limit`.
- **Daily withdrawal count** (per-account, per-mint, per-day) — for `velocity_limit`.
- **Current balance** (per-account, per-mint) — for misc context.
- **Sliding window count + amount** (per-account, per-mint, custom window) — for `velocity_window`.
- **First-use timestamp** (per-account, per-destination address) — for `address_cooldown`.
- **Per-tx amount** (per-request) — for `per_tx_amount_limit`.

### 3.2 PM decisions

- **Aggregate refresh cadence** — every request (real-time) vs cached with TTL. NodeInfra implies real-time (coordinator pre-computes per request).
- **Aggregate consistency vs ledger** — must reflect committed ledger state, not pending. Race conditions between context computation and ledger commit need design.
- **Aggregate storage** — materialized view, in-memory cache, or computed-per-request?

---

## 4. Hash chain design

[Source Fact] Per-account ledger entry hash chain:
```
entry.hash = SHA-256(entry.prev_hash ‖ entry.fields...)
entry.prev_hash = previous entry's hash for the same account
```

[Source Fact] Periodic enclave-signed checkpoint:
```
checkpoint.sig = EnclaveSign(chain_head_hash ‖ account_id ‖ entry_count ‖ timestamp)
```

[Source Fact] Checkpoint records MRENCLAVE.

[Source Fact] Checkpoint cadence: "1시간마다 또는 100개 엔트리마다" (1 hour OR 100 entries, whichever first).

### 4.1 PM decisions

- **Hash chain granularity** — per-account (NodeInfra) vs global (alternative). Per-account is parallelizable; global is simpler audit.
- **Checkpoint cadence** — time-based, count-based, or both. NodeInfra: both.
- **Checkpoint storage** — separate table or column in summary table.
- **Hash algorithm** — SHA-256 baseline; future migration path (R6 decay class).

---

## 5. Policy rule schemas

[Source Fact] Each rule has:
```json
{
  "rule_type": "<one of 10>",
  "flow_type": "withdrawal" | "transfer" | "deposit",
  "mint": "<mint id>" | "*",
  "priority": <integer>,
  "config": { /* rule-specific */ }
}
```

### 5.1 Rule type list (10) and config shape

[Source Fact]

| Rule type | Config keys | Verdict semantics |
|-----------|-------------|-------------------|
| `global_halt` | message | Deny all |
| `address_list` | condition_set_id, mode (whitelist/blacklist) | Deny if not allowed |
| `time_window` | start_hour, end_hour, timezone, days_of_week | Deny outside hours |
| `per_tx_amount_limit` | max_amount_lamports | Deny if > max |
| `daily_withdrawal_limit` | max_daily_lamports | Deny if cumulative > max |
| `velocity_limit` | max_count_per_day | Deny if today's count >= max |
| `velocity_window` | window_seconds, max_count, max_amount_lamports | Deny if window exceeded |
| `address_cooldown` | threshold_lamports, cooldown_seconds | Held if new addr + amount > threshold |
| `approval_tier` | min_amount_lamports, max_amount_lamports, approval_mode (AUTO/SINGLE_APPROVE/QUORUM_2_OF_3) | Held if not AUTO |
| `expression` | action (DENY/HELD), conditions (DSL with field/operator/value) | Per DSL |

### 5.2 PM decisions

- **Rule schema versioning** — Config shapes will evolve. JSON-Schema or Protobuf migration path required.
- **Rule activation/deactivation** — boolean column or status enum.
- **Rule scope** — per-tenant or global? NodeInfra implies per-tenant.
- **Rule conflict resolution** — same priority, overlapping scope. NodeInfra: priority gap convention.

---

## 6. State machines

### 6.1 Decision state machine (per request)

[Source Fact]
```
INITIAL → [evaluate rules in priority order]
  → if any rule = Deny → DENIED (terminal)
  → if any rule = Held → HELD (re-eval via polling)
  → if all rules pass → AUTO_APPROVED (terminal)

HELD → [next polling iteration]
  → if any rule now Deny → DENIED (terminal, sticky)
  → if all rules now pass → AUTO_APPROVED (terminal, sticky)
  → if any rule still Held AND age < 24h → HELD
  → if any rule still Held AND age >= 24h → DENIED (TTL exceeded)
```

### 6.2 Signing state machine (per request)

[★ Hypothesis structure from multisig.md]
```
SIGNING_QUEUED
  → INITIATOR_SIGNED (by 개시 키)
  → APPROVER_VERDICT_DECIDED (Allow/Held/Deny by 승인자)
  → if Held → polling loop
  → if Allow → APPROVER_CO_SIGNED (by 승인 키)
  → ENCLAVE_VERIFIED
  → EXECUTOR_SIGNED (by 실행 키, Ed25519, then zeroize)
  → CHAIN_SUBMITTED
  → CHAIN_CONFIRMED (or CHAIN_FAILED)
```

### 6.3 PM decisions

- **State persistence** — every transition recorded (audit trail).
- **State timeouts** — 24h Held TTL is explicit; other timeouts ★.
- **Sticky decisions** — monotone state machine enforced at DB layer.
- **Idempotency** — `(initiator_pubkey, nonce)` blocks duplicate requests.

---

## 7. Tenant model

[Source Fact]
- Tenant_id is in every signing payload (`SigningPayload v1` with fields: `tenant_id`, `nonce`, `protocol_version`).
- Per-tenant: 3 keys + 1 omnibus wallet + 1 gas-payer wallet + N user wallets + per-tenant policy rule set.
- Tenant registration via `register_enclave` records SPKI-hash + blob_hash on ledger (append-only).

### 7.1 PM decisions

- **Tenant_id type** — UUID typical; embedded in all payloads.
- **Per-tenant isolation in DB** — schema-per-tenant, row-level-security, or app-layer filter?
- **Tenant lifecycle** — provisioning, suspension, deprovisioning. NodeInfra documents provisioning (`register_enclave`); other lifecycle states ★.

---

## 8. SDK interface

[Source Fact] Java SDK + Spring Boot Auto-Configuration.

API surface (partial, from `/dev/architecture`):
- `client.wallets().create()` — create user wallet.
- `GET /v1/wallets`, `GET /v1/wallets/{id}` — query user wallets.
- `GET /v1/tenant/omnibus-wallet`, `GET /v1/tenant/gas-payer-wallet` — query tenant-level wallets.
- `POST/PUT/DELETE /v1/admin/policies/...` — admin API for rule management.
- `/v1/evaluate` — approver evaluation endpoint.
- `/v1/poll` — Held re-evaluation polling.

### 8.1 PM decisions

- **API style** — REST `/v1/...` versioned. Versioning strategy for schema evolution.
- **SDK languages** — Java only (per current docs). Multi-language support is product extension.
- **SDK auth** — Ed25519 API key + 60-sec timestamp window.
- **Idempotency** — caller provides `reference_id` (mandatory for withdrawal/transfer).
- **Error model** — 33 ErrorCode types + type-specific exceptions.

---

## 9. Operational burden — what the customer must run

[Source Fact] Customer-operated components:
- **HSM cluster** — 3 partitions or 3 HSMs (Thales Luna / Utimaco) + m-of-n operator quorum management.
- **SGX-capable hardware** — Intel CPU with SGX, MRENCLAVE image management, DCAP attestation infrastructure.
- **Coordinator service** — pre-computes evaluation context.
- **Approver (policy engine) service** — hot-reloads rules, co-signs.
- **SGX enclave service** — execution-key signing.
- **Approver / Audit / Ledger / Chain DBs** — 4 separate databases.
- **Spring backend (customer's own)** — Java SDK consumer.
- **Compliance Portal (NodeInfra-provided web app)** — admin/operator/auditor UI.
- **Network segmentation** — 망분리 (air-gapped data center).
- **Monitoring** — `/security/ops/monitoring` (security monitoring required).
- **System hardening** — `/security/ops/hardening` (OS/network hardening required).

### 9.1 Estimated operational burden (★ Hypothesis — institutional scale)

★ Estimates (the docs do not provide SLA numbers; these are PM-level inferences for sizing):

- **Initial deployment** — multi-week ceremony (HSM provisioning, SGX enclave provisioning, network segmentation, certification audits).
- **Daily ops** — minimal for normal flow; HSM session monitoring, enclave health, DB integrity check, security monitoring.
- **Compliance ops** — rule management, VASP whitelist curation, audit report generation (compliance team).
- **Incident response** — `global_halt` rule, key rotation, enclave image rotation, integrity check failure response.
- **Quarterly** — key rotation ceremonies, certification renewals.

### 9.2 PM decisions

- **In-house vs vendor-managed** — NodeInfra delivers as installable software; customer is responsible for run-time ops. Vendor-managed alternative is SaaS (not NodeInfra's positioning).
- **DR / HA topology** — multi-DC, hot/warm standby, backup strategy. NodeInfra is silent on this in public docs.
- **Capacity planning** — TPS, growth, storage growth (audit trail grows monotonically). Not in public docs.

---

## 10. What NodeInfra is silent on (PM gaps)

These are areas a PM extracting from NodeInfra needs to **design independently**:

| Area | NodeInfra silence | PM must decide |
|------|------------------|----------------|
| Multi-chain | Solana-only | If multi-chain, design chain adapter (D9 pattern) |
| Reconciliation cadence | Mentioned but not specified | Cadence, mismatch alert routing, manual reconciliation procedure |
| Recovery ceremony | Partial (keys/lifecycle); no full ceremony doc | Backup, restore, key recovery ceremony |
| Treasury / mint-burn | Not addressed | If issuer-side, design D10 |
| DR / HA | Not addressed | Hot standby, multi-DC, RPO/RTO |
| Capacity / scale numbers | Not addressed | TPS, storage growth, DB partition strategy |
| Webhook / event delivery | Not addressed | Webhook security, retry, ordering |
| Public API reference | Embedded in text only | OpenAPI/protobuf spec, SLA, rate limits |
| Operator m-of-n quorum mechanics | Mentioned but not specified | Quorum threshold, key holder selection, ceremony procedures |
| Backup / archival | Not addressed | Off-site backup, long-term archival, retention period |

---

## 11. PM checklist (extractable design template)

For a PM designing a similar product, NodeInfra's docs suggest the following decisions in approximate order:

1. **Scope decisions**
   - [ ] Single chain or multi-chain? (NodeInfra: Solana-only)
   - [ ] Single jurisdiction or multi-? (NodeInfra: KR-only)
   - [ ] Custody-only or custody + issuance + treasury? (NodeInfra: custody)
   - [ ] On-prem only or SaaS option? (NodeInfra: on-prem only)

2. **Cryptographic stack**
   - [ ] MPC vs multi-key HSM? (NodeInfra: HSM multi-key)
   - [ ] HSM vendor mix
   - [ ] TEE choice (SGX / SEV / TPM)?
   - [ ] Curve(s) supported

3. **DB design**
   - [ ] Number of databases (NodeInfra: 4)
   - [ ] Append-only tables enforced via trigger / row-locking / external WORM
   - [ ] Set-once column constraints
   - [ ] Hash chain granularity (per-account / global / hybrid)
   - [ ] Checkpoint cadence

4. **Policy engine**
   - [ ] Rule taxonomy (closed set + extension)
   - [ ] Priority + short-circuit semantics
   - [ ] Decision verdict types
   - [ ] Hot reload mechanism
   - [ ] Manual approval policy

5. **Tenant model**
   - [ ] Tenant granularity (sub-unit / customer)
   - [ ] Per-tenant key isolation
   - [ ] Wallet types per tenant

6. **Compliance scope**
   - [ ] Regulatory regimes covered
   - [ ] Travel Rule integration approach
   - [ ] Certifications targeted

7. **Audit**
   - [ ] Layer 1 mechanism
   - [ ] Layer 2 mechanism
   - [ ] Cross-DB evidence binding
   - [ ] Auditor verification procedure

8. **SDK / API**
   - [ ] Primary language
   - [ ] Framework auto-config
   - [ ] Idempotency contract
   - [ ] Error model

9. **Operational ownership**
   - [ ] Customer-run vs vendor-run components
   - [ ] DR / HA
   - [ ] Backup / archival

10. **Gaps to design independently**
    - [ ] Reconciliation cadence
    - [ ] Recovery ceremony
    - [ ] Webhook delivery
    - [ ] Public API reference
    - [ ] Operator quorum mechanics

---

## 12. Update protocol

When NodeInfra adds details on currently-silent areas:
- Migrate items from §10 to appropriate section above.
- Update §11 checklist with NodeInfra defaults where they emerge.

When NodeInfra publishes API reference / OpenAPI spec:
- Add §8 SDK interface details.
- Document API contract beyond text fragments.

When NodeInfra publishes DR / HA / capacity guidance:
- Replace §9 ★ Hypothesis estimates with [Source Fact].
