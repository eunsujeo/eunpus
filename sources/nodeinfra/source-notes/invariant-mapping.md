# NodeInfra → Generalized Invariant Mapping

> Mapping date: 2026-05-20
> Source: 41 captured NodeInfra docs under `../normalized/docs/`
> Discipline: Each invariant labeled by source class.

---

## 0. What this file does

For each invariant the NodeInfra docs **state or structurally imply**, this file:
- Records the invariant in **NodeInfra phrasing** [Source Fact] when direct.
- Or names the **implied invariant** [★ Hypothesis] when structural.
- Maps to the **closest D-series / C-series ≠ proposition** [Generalized Mapping] when applicable.

---

## 1. NodeInfra's explicitly-stated invariants

These are ≠-shaped statements that NodeInfra's docs directly assert.

### 1.1 Multisig structural

[Source Fact] **개시 ≠ 승인 ≠ 실행** — three keys in three independent services, no service can produce all three signatures.
→ Maps to D2 `Signing ≠ Approval` invariant.

[Source Fact] **HSM 키 ≠ SGX 키** — 개시·승인 키 live in HSM partitions; 실행 키 lives in SGX-sealed blob; the two key-custody domains are independent.
→ Maps to D14 trust-boundary B4-B5 (compute confidentiality vs key custody).

[Source Fact] **단일 HSM 탈취 ≠ 모든 키 탈취** — HSM physical compromise does not extract keys (FIPS 140-3 Level 3) AND does not affect SGX execution key (HSM-independent operation post-provisioning).
→ Maps to D14 "compromise containment" invariant.

[Source Fact] **테넌트 A 키 탈취 ≠ 테넌트 B 영향** — per-tenant 3-key sets + SPKI-hash binding + per-payload tenant_id verification at each of 3 keys.
→ Maps to D1a tenant-isolation invariant.

### 1.2 Decision lifecycle

[Source Fact] **shadow_mode 없음** — no observation-only mode; every Deny is enforced as block.
→ Maps to D3 invariant "Policy decision = real enforcement."

[Source Fact] **Allow / Held / Deny 정확히 하나** — every request gets exactly one verdict.
→ Maps to D3 deterministic state-machine invariant.

[Source Fact] **Sticky decision** — once AUTO_APPROVE or DENY, cannot return to HELD (DB trigger enforced).
→ Maps to D3 monotone-state-machine invariant.

[Source Fact] **Set-once signing** — `auth_approver_sig`, `auth_approver_pubkey` columns cannot be modified after INSERT.
→ Maps to D3 + D5 "signature ≠ reversible" invariant.

[Source Fact] **Idempotent by (initiator_pubkey, nonce)** — duplicate requests blocked at `initiator_nonce_seen` table.
→ Maps to D2 "MPC retry ≠ idempotent unless explicit" invariant — NodeInfra implements explicit idempotency.

[Source Fact] **fail-closed** — DB failure / panic / missing context / HSM failure / signature verification failure → all map to Deny.
→ Maps to D3 + D14 fail-safe-default invariant.

[Source Fact] **수동 승인 없음** — operators cannot override policy decisions via console button; they must edit policy rules (which are logged in `policy_change_log`).
→ Maps to D3 "Governance ≠ Decision override" invariant.

[Source Fact] **결정론적 재평가** — same input + same rule set → same decision; Held resolves only when time / rules / external state changes.
→ Maps to D3 deterministic-evaluation invariant.

### 1.3 Hot reload

[Source Fact] **Hot reload = atomic snapshot** — single request uses the rule snapshot from start of evaluation; rule changes mid-evaluation do not produce half-and-half decisions.
→ Maps to D3 "Policy version pinning" invariant (R4-aware sense versioning).

### 1.4 Audit

[Source Fact] **Layer 1 ≠ Layer 2** — Layer 1 (TEE receipts) provides real-time defense; Layer 2 (hash chain + checkpoints) provides post-tamper detection; **neither alone is sufficient**.
→ Maps to D5 "Real-time evidence ≠ Forensic evidence" invariant.

[Source Fact] **외래키 제약 = 구조적 강제** — orphan ledger entries are structurally impossible; foreign keys enforce that every ledger change has an action record.
→ Maps to D5 "Evidence chain ≠ Optional log" invariant — NodeInfra enforces at DB level.

[Source Fact] **prev_hash + checkpoint sig** — SHA-256 chain over per-account entries; periodic enclave-signed checkpoint over chain head.
→ Maps to D5 append-only evidence invariant.

[Source Fact] **policy_decisions = append-only via DB trigger** — `prevent_mutation()` enforces.
→ Maps to D5 append-only invariant.

[Source Fact] **Layer 2 ≠ real-time defense** — explicitly stated. Layer 2 cannot detect inserts between checkpoints if hashes are recomputed by attacker.
→ Maps to D5 invariant boundary — NodeInfra documents the limitation honestly.

### 1.5 Audit traceability

[Source Fact] **request_id ↔ tx_hash** — cross-DB join via `signing_events.chain_evidence_ref`. Every approver decision can be linked to the on-chain transaction it authorized.
→ Maps to D5 cross-domain evidence-chain invariant.

[Source Fact] **MRENCLAVE in checkpoint** — every signed checkpoint records which enclave image signed it. Image rotation produces visible MRENCLAVE rotation in audit trail.
→ Maps to D5 + D15 attestation invariant.

### 1.6 Tenant isolation

[Source Fact] **payload.tenant_id ↔ SPKI-hash 등록값** — request rejected if tenant_id does not match registered initiation-key SPKI-hash.
→ Maps to D14 tenant-boundary cross-verification invariant.

[Source Fact] **공용 서비스 ≠ 공용 키** — coordinator + approver + enclave are shared services, but each tenant's 3-key set is fully separate.
→ Maps to D1a tenant-isolation discipline.

### 1.7 Wallet structure

[Source Fact] **사용자 지갑 ≠ 집중 지갑 ≠ 가스대납 지갑** — three wallet roles with different ownership and lifecycle.
→ Maps to D1a 9-plane DB schema (subset).

[Source Fact] **테넌트 부트스트랩 = 집중·가스대납 자동 생성** — system-created, exactly 1 per tenant, DB-constraint enforced (SDK cannot create these).
→ Maps to D1a "Tenant initialization ≠ user action" invariant.

### 1.8 Travel Rule scope

[Source Fact] **노드월렛 = 식별 + 차단; 정보 교환 ≠ 노드월렛 책임** — Travel Rule has two phases; NodeInfra handles identification + technical restriction only; information exchange (TRP / Sygna / Notabene) is external.
→ Maps to D11 "Compliance engine ≠ Travel Rule transport" invariant.

### 1.9 SDK + dev integration

[Source Fact] **`mode=production` ≠ SoftHSM2** — production mode actively blocks software HSM; structural enforcement of "no soft keys in prod."
→ Maps to D14 deployment-discipline invariant.

[Source Fact] **`reference_id` 필수 = 멱등성** — withdrawal/transfer requests must include reference_id; duplicate processing structurally prevented.
→ Maps to D2 idempotency invariant.

[Source Fact] **60초 timestamp 윈도우** — replay-protection window on API key signatures.
→ Maps to D2 "two-clock freshness" invariant.

---

## 2. Structurally implied invariants ★

These are not stated directly but follow structurally from the design.

### 2.1 Cryptographic primitives

[★ Hypothesis] **Ed25519 ≠ ECDSA** — NodeInfra uses Ed25519 consistently (Solana chain + execution key signing + API key signing). No ECDSA mentioned.
→ Choice rationale: Solana native primitive. Maps to D9 chain-adapter invariant.

[★ Hypothesis] **PKCS#11 v2.40/v3.0 ≠ HSM-vendor-specific API** — NodeInfra abstracts HSM access through PKCS#11; single-HSM-vendor lock-in avoided.
→ Maps to D14 dependency-discipline invariant.

[★ Hypothesis] **RSA-OAEP wrapped master key ≠ extracted master key** — master key for SGX execution key never leaves enclave in plaintext; HSM generates → wraps with enclave's one-time RSA pubkey → enclave decrypts inside → seals to MRENCLAVE.
→ Maps to D14 "master key escape" invariant.

### 2.2 Operational

[★ Hypothesis] **운영자 콘솔 ≠ 의식적 승인** — by design, console UI lacks "approve" button; operators must use external ceremony channels (separate meetings, separate systems) + edit policy rules to resolve Held decisions.
→ Maps to D3 + D4 ceremony-separation invariant.

[★ Hypothesis] **24h Held TTL ≠ permanent uncertainty** — Held decisions auto-resolve as Deny if not addressed within 24h. Prevents indefinite limbo.
→ Maps to D3 governance-clock invariant.

[★ Hypothesis] **임시 AUTO 변경 후 복원 패턴** — explicit "temporarily change approval_tier to AUTO, let coordinator polling pass, restore original" pattern. The change is logged in `policy_change_log`.
→ Maps to D3 + D11 "policy edit = audit-traceable ceremony" invariant.

### 2.3 Cross-DB consistency

[★ Hypothesis] **approverdb + auditdb + ledgerdb + chaindb = 4 separate DBs** — by design, no single DB query can cover the full lifecycle. Cross-DB joins via well-defined fields (request_id, tx_hash, account_id).
→ Maps to D1b 5-truth-domain reconciliation (with reduction to NodeInfra's 4 domains).

[★ Hypothesis] **decision CBOR re-embedded in signing event** — `approver_decision_rationale` is CBOR of the PolicyDecision, embedded in the signing_events row. This makes decision → signing chain tamper-evident across DBs.
→ Maps to D5 evidence-binding invariant.

### 2.4 Threat-model

[★ Hypothesis] **단일 서비스 탈취 ≠ 자금 탈취** — every chain transaction requires 3 independent service signatures; compromising any one service does not produce a chain signature.
→ Maps to D14 "single-point-of-compromise ≠ catastrophic" invariant.

[★ Hypothesis] **공급사 다양화 = 권장 구성** — Thales Luna for HSM partition A + Utimaco for partition B + ... — vendor-diversity recommended for institutional deployments.
→ Maps to D14 "vendor monoculture ≠ resilience" invariant.

### 2.5 Compliance / regulatory

[★ Hypothesis] **KR 규제 ≠ FATF 글로벌 = EU TFR** — NodeInfra documents multiple regulatory regimes that have **different thresholds, different evidence requirements, different scopes**. The compliance engine accommodates per-regime configuration via rule + condition_set composition.
→ Maps to D11 multi-regime compliance invariant.

[★ Hypothesis] **KYC ≠ NodeInfra responsibility** — NodeInfra docs reference external KYC system as the source of customer identity; NodeInfra consumes KYC outputs (e.g., self-custody declarations) but does not own KYC.
→ Maps to D11 + D16 identity-boundary invariant.

[★ Hypothesis] **address_list whitelist ≠ general allowlist** — implemented as VASP-hot-wallet allowlist (Travel Rule first-step), curated by operations team, with `condition_set` versioning.
→ Maps to D11 sanctions/whitelist invariant.

### 2.6 Failure handling

[★ Hypothesis] **승인자 장애 = 출금 정지** — explicitly stated: "운영 관점에서는 승인자 장애 = 출금 정지. 이는 의도된 안전 기본값입니다."
→ Maps to D12 fail-stop incident-response invariant.

[★ Hypothesis] **체인 메모 미검사** — NodeInfra explicitly does not evaluate transaction memo content. Travel Rule implementations that embed identifiers in chain memos are not parsed.
→ Maps to D9 "chain semantics ≠ business semantics" invariant.

---

## 3. Invariants where NodeInfra differs from the generalized framing

These are points where NodeInfra makes **architectural choices** that differ from the most common D-series framing — without violating D-series invariants, but choosing a specific instantiation.

| # | NodeInfra choice | Generalized alternative | D-ref |
|---|------------------|-------------------------|-------|
| 1 | HSM-partitioned 3-key multisig | MPC-CMP 3-endpoint orchestration | D2 |
| 2 | SGX-sealed execution key | HSM-only with PCS-based attestation | D14 |
| 3 | Per-rule priority + short-circuit | Full policy DAG with explicit dependencies | D11 |
| 4 | 24h Held TTL fixed | Tiered TTL per decision class | D3 |
| 5 | No manual approval button | UI-mediated multi-operator approval | D3 |
| 6 | Hot reload via ArcSwap | Versioned policy with explicit rollover | R4 |
| 7 | Single omnibus per tenant | Multi-tier prime brokerage layering | D18 |
| 8 | Ed25519 (Solana-native) | Multi-curve (Ed25519 + ECDSA + Schnorr) | D9 |
| 9 | KR-specific certs (KCMVP/GS) | Multi-jurisdiction cert stack | D11 |
| 10 | Reference_id mandatory | Optional idempotency key with fallback | D2 |

Each represents a **legitimate design choice within D-series invariants** — not a violation. The mapping documents the choice; the choice does not require corpus modification.

---

## 4. Invariants the generalized corpus has but NodeInfra does not address

| D-series invariant | NodeInfra coverage | Why ★ |
|--------------------|--------------------|------|
| D9 multi-chain semantic normalization | None | Solana-only |
| D10 mint-burn synchronized multi-domain state | None | Custody, not issuer |
| D13 multi-jurisdictional FX/liquidity | None | Single-jurisdiction |
| D17 capital efficiency optimization | None | Outside scope |
| D20 cross-institution liquidity coordination | None | Single-institution |
| D21 stablecoin depeg crisis | None | Custody, not stablecoin operator |
| D22 chain halt response | None | Likely in internal docs |
| D23 jurisdiction split / regulatory attack | None | Single-jurisdiction |
| D25 systemic liquidity freeze | None | Single-institution scope |
| D26 cascading failure across domains | Partial (trust-boundaries §한 경계를 뚫어도) | Architectural defense focus |
| D27 CBDC sovereign coordination | None | Frontier outside scope |
| D28 intent-based settlement | None | Frontier outside scope |
| D29 autonomous treasury | None | Frontier outside scope |
| D30 AI-assisted governance | None | Frontier outside scope |
| D31 confidential settlement | None | Frontier outside scope |
| D32 post-quantum survivability | None | No PQ discussion |

These silences are **architecturally consistent** with NodeInfra's narrow product positioning, not failures of the D-series mapping.

---

## 5. Invariant-mapping summary

| Category | Count |
|----------|-------|
| Explicitly stated NodeInfra invariants (Section 1) | **27** |
| Structurally implied NodeInfra invariants (Section 2) | **16** |
| NodeInfra design choices within D-series (Section 3) | **10** |
| Generalized invariants outside NodeInfra scope (Section 4) | **16** |

**Total NodeInfra invariants observable**: 43. **NodeInfra ≠ proposition count**: ≥ 27 directly stated + 16 structural = **≥ 43 ≠ propositions** can be extracted from the docs.

★ Hypothesis: this matches the D-series scale of ~5 ≠ propositions per doc × ~33 docs = ~165 propositions. NodeInfra's 41 docs at ≥1 invariant per doc reaches the **same density**, with **narrower scope**.

---

## 6. Mapping update protocol

When NodeInfra docs change:
- Re-extract invariants from new content.
- Compare against this catalog.
- Add new invariants (with [Source Fact] or [★ Hypothesis] labels).
- Note changes to existing invariants as **superseded** rather than overwrite (R7 spirit).

When the D-series corpus evolves:
- Re-evaluate mappings.
- Newly added D-series invariants may have NodeInfra counterparts that were previously unmapped.

When discrepancies are found:
- Document in `vendor-specific-patterns.md` (if NodeInfra-specific) or `unknowns.md` (if unresolved).
