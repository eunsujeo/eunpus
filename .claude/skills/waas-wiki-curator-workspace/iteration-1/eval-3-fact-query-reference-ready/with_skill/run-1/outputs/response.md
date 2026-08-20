# Fireblocks MPC key share 분포 + Hosted MPC 비교

> Reference-ready 답변 (Trigger 3) — wiki grep 결과만 인용, LLM 일반 지식 단독 답변 없음.

---

## 1. 핵심 요약 (10초 이해)

**Default SaaS MPC** = **3-of-3 분할** (1 customer + 2 Fireblocks Azure SGX cloud).
**Hosted MPC** = **3-of-3 customer-side** (1 Primary Co-Signer + 2 Guard Co-Signers, **Fireblocks 가 key share 0개**).
**Backup** 은 두 모델 모두 별도 평면 — SaaS = 6 files (Recovery Utility), Hosted = 3 files (2 air-gapped machines).

- 출처: `vendors/fireblocks/mpc.md` §"Stage 8 — MPC-CMP 정식 명세" + §"Hosted MPC Variant"
- 출처: `vendors/fireblocks/architecture.md` §"Hosted MPC Variant" (table)

---

## 2. 운영 상세

### 2.1 SaaS MPC 의 key share 분포 (default 모델)

```
3 endpoints per signing group (= 1 signing user):
  ├── 1 × Customer Co-Signer
  │     options: (a) mobile device (iOS Keychain / Android TEE),
  │              (b) customer-side SGX server,
  │              (c) customer cloud / customer on-prem (Co-Signer)
  │
  └── 2 × Fireblocks Cloud Co-Signers (Azure SGX confidential enclaves)
        ↓ (partial signatures)
      Aggregator → Full Signature → Blockchain
```

- **Within-group threshold = 3/3** (모든 share 필요) — `vendors/fireblocks/mpc.md` §"Threshold 구조 (Q-D04 ANSWERED)" (source: `mpc-cmp.md`)
- **Across-group threshold = 1/N OR** — 어느 signing group (Owner / Admin / Signer) 이든 자체 3/3 만족하면 valid
- 각 signing user 는 **고유 3-share set** 보유, 모두 Owner set 에서 derived — "**No two signing devices share the same key share set.**" (source: `mpc-cmp.md`, p.7)
- "**None of the parties (neither Fireblocks nor the customer) can sign a transaction alone.**" (source: `mpc-cmp.md`, via `vendors/fireblocks/mpc.md` §"Share 분포 (Q-M03 ANSWERED)")

**Mobile device 측 share 의 보관 형식**:
- iOS Secure Enclave / Android TEE 에 **hardware-encrypted** — 평문 추출 불가
- iCloud / Google Cloud auto-backup 불가 (`about-the-fireblocks-mobile-app.md`, p.1; via `entities/fireblocks/mpc-key-share.md` §"전체 분포 모델")

**Cloud backup 평면** (별도 — signing 평면이 아닌 DR 평면):
- Fireblocks cloud servers 에 **recovery passphrase 로 encrypted** 된 **mobile device share 의 backup** 보관
- 인용: "Fireblocks uses the recovery passphrase to create an encrypted backup of the mobile device's private key share, which is stored securely in Fireblocks' cloud servers." (source: `recovery-passphrase.md`, p.1; `vendors/fireblocks/mpc.md` §"Key Share 분포 모델 (Stage 5에서 확정)")
- 사용 시점: 3 recovery scenarios (Owner / Admin·Signer / Workspace Keys Recovery) + 월 1회 Verify Passphrase (source: `recovery-passphrase.md`, p.2-4)

### 2.2 Fireblocks cloud 분포의 위치 명세

| Cloud provider | Sensitive 자산 | MPC share 관련 |
|---|---|---|
| **Microsoft Azure** | YES | **2 Fireblocks SGX co-signer share + key shares + policy rules + API credentials** |
| Amazon AWS | NO | Shell Services + Node Infrastructure (gateway / frontend) |
| Google Cloud (Firebase) | NO | Console + mobile app caching DB |

(source: `fireblocks-cloud-architecture.md`; `vendors/fireblocks/architecture.md` §"Stage 8 — Cloud Architecture")

→ Azure ↔ AWS 사이는 **SGX DMZ + PROXY** 매개.

### 2.3 Co-Signer 측 share (API user path)

- API user 를 API Co-Signer 와 페어링한 후 **Owner 가 Co-Signer 의 key shares 를 별도 승인** (source: `re-enrolling-api-users.md`, p.1; `entities/fireblocks/mpc-key-share.md` §"Co-signer key share 승인 (Stage 4)")
- 즉 customer 측 3 옵션 (mobile / customer cloud / customer on-prem) 중 **mobile 이 아닌 path 는 API Co-Signer 가 customer share host**

### 2.4 Hosted MPC 와의 차이

| 항목 | Default SaaS MPC | Hosted MPC |
|---|---|---|
| **Customer-side share 수** | 1 (mobile or API Co-Signer) | **3** (1 Primary + 2 Guard, 모두 SGX) |
| **Fireblocks-side share 수** | 2 (Azure SGX cloud) | **0** |
| **Cryptographic ceremony 참여** | Fireblocks + customer 양측 | **Customer only** (Fireblocks 미참여) |
| **Hosting 위치** | Fireblocks Azure + customer | customer cloud OR on-premises (3 Co-Signer 모두) |
| **SGX 필수 여부** | Fireblocks side 필수, customer side 선택 | **SGX Co-Signer 필수** |
| **Disaster continuity** | SaaS 의존 (SaaS outage = signing halt) | **BCM (Business Continuity Module) paired** — Aggregator 까지 customer-side |
| **Backup share 수** | 1 mobile (cloud share 는 Fireblocks 가 보유) → **6 files** (3 ECDSA + 3 EDDSA, RSA-4096 + passphrase) | **3** (1 mobile + 2 Guard, all customer 책임) |
| **Air-gapped machine 수 (backup)** | 1 (Recovery Utility) | **2** (download + assembly 분리) |
| **Guard share 암호화** | N/A | **RSA public key** (customer 가 Console upload) |
| **사용 동기** | (기본) | regulatory compliance, regional data residency, internal policies, end-user 요건, vendor lock-in 회피 |

(source: `vendors/fireblocks/architecture.md` §"Hosted MPC Variant" + §"Hosted MPC B&R Flow Detail (★ Stage 29 신규)")
(source: `vendors/fireblocks/mpc.md` §"Hosted MPC Variant (`hosted-mpc-overview.md` Stage 8)" + §"Hosted MPC Backup 모델 (Stage 29 신규)")

**핵심 인용** (`hosted-mpc-overview.md`, p.1, via `vendors/fireblocks/mpc.md`):
> "Hosted MPC feature allows you to **completely control the MPC key shares** by hosting all three Co-Signers in your own environment, either in the cloud or on-premises."

→ Hosted MPC 의 본질: **sovereign key management plane** — Fireblocks 는 share 0 개 보유 = key generation / signing / proactive refresh 의 모든 라운드가 customer 환경에서 실행.

### 2.5 두 모델 공통 (변하지 않는 부분)

- **Protocol**: MPC-CMP (Canetti-Makriyannis-Peled, NIST 2020 / ACM CCS 2020), ECDSA + EdDSA 양쪽 (source: `mpc-cmp.md`; `vendors/fireblocks/mpc.md` §"Protocol 명세")
- **Sharing scheme**: Additive Secret Sharing (= Shamir t=n full threshold), simple addition, perfect secrecy — "the secret itself **never exists**" (source: `mpc-cmp.md`)
- **Rounds**: 4 rounds (3 pre-processed) vs GG18 의 8 rounds, 마지막 라운드 QR offline 가능
- **Key generation security**: HRNG (Intel RDRAND), NIST SP 800-90A, atomicity ("If the MPC key generation process fails, **the key was not created.**")
- **Mobile device 평면 의 2 키 분리**: Private MPC-CMP key share (signing 용) + Configuration key (workspace 설정 / policy 변경 / 사용자 추가 / Admin Quorum approval 용) — 둘 다 iOS Secure Enclave / Android TEE 평문 추출 불가 (source: `security-aspects-signing-with-the-fireblocks-mobile-app.md`, p.1; `vendors/fireblocks/mpc.md` §"Stage 8 — Configuration Key 분리")

---

## 3. 확정 vs hypothesis (★ 명확 분리)

### Confirmed fact (출처 명시)

- 3-of-3 within-group threshold (1 customer + 2 Fireblocks cloud, SaaS 기준) — source: `mpc-cmp.md` (Q-D04 ANSWERED, Stage 8)
- 1/N OR across-group threshold — source: `mpc-cmp.md`, p.7
- Owner set 에서 모든 Admin/Signer set derived — source: `mpc-cmp.md`, p.7
- "No two signing devices share the same key share set." — source: `mpc-cmp.md`, p.7 직접 인용
- "None of the parties (neither Fireblocks nor the customer) can sign a transaction alone." — source: `mpc-cmp.md` 직접 인용
- 2 Fireblocks cloud co-signer = Azure SGX confidential enclave 호스팅 — source: `fireblocks-cloud-architecture.md`
- Mobile share 의 secure enclave hardware-encryption, iCloud/Google Cloud 자동 백업 불가 — source: `about-the-fireblocks-mobile-app.md`, p.1
- Cloud backup = mobile share 의 passphrase-encrypted copy (signing share 가 아님, DR 평면) — source: `recovery-passphrase.md`, p.1 직접 인용
- Hosted MPC = 3 customer-side + 0 Fireblocks, all SGX — source: `hosted-mpc-overview.md`, p.1
- Hosted MPC = "completely control the MPC key shares" 직접 인용 — source: `hosted-mpc-overview.md`, p.1
- Hosted MPC backup = 3 files (1 passphrase + 2 RSA), 2 air-gapped machines — source: `hosted-mpc-backup-and-recovery.md` (Stage 29)
- SaaS MPC backup = 6 files (ECDSA × 3 + EDDSA × 3), RSA-4096 + passphrase — source: `generating-a-workspace-key-backup-package-fireblocks-recovery-utility.md` (Stage 30)
- BCM 은 Hosted MPC customer 전용 (Default SaaS customer 자격 없음) — source: `business-continuity-module-bcm.md`; `vendors/fireblocks/risks.md` Risk-S10

### Hypothesis / 부분 답변 / wiki 미명시

- **Q-2026-05-18-M04 (open)** — Key share derivation 의 cryptographic 메커니즘 (Owner set → user set derivation 절차). protocol 명은 확보 (CMP) 했으나 derivation 의 정확한 cryptographic 단계는 본 wiki 미명세.
- **Q-D04 잔존 sub-question (mpc.md 끝부분)** — Fireblocks 가 2 cloud share 보유함은 명시되었으나 "이 2 share 가 결합 시 무엇을 할 수 있는가" 의 decryption / signing 가능성은 명시 없음. 다만 protocol 핵심은 "individual share 만 보유, full key 재구성 불가" — wiki 가 추론 형태로 기록.
- **Hosted MPC sub-series 2건 (TIER 3 placeholder)** — `Hosted MPC Customer-Side Setup`, `Hosted MPC Workspace Configuration` 은 Source Lake placeholder 만, deep ingest 안 됨 (Q-S10 도입 threshold 응답 시 promote 후보). 따라서 **Hosted MPC 의 customer-side onboarding 절차 / workspace 설정 detail 은 wiki 답변 범위 밖**.
- **3 Co-Signer 의 customer-side 배치 옵션 detail** — Hosted MPC 의 3 SGX Co-Signer 를 동일 datacenter 에 둘지, geographic 분산 의무 여부 등은 본 wiki 미명세.

---

## 4. 답 가능 범위 (wiki cover 범위 / 외부)

### wiki 가 cover 함 (confirmed)

- SaaS MPC 의 3-of-3 분포 위치 (mobile + 2 Azure SGX)
- Hosted MPC 의 3-of-3 customer-side 분포 + Fireblocks 0 share
- Protocol = MPC-CMP, additive secret sharing, 4 rounds
- Mobile secure enclave 의 hardware encryption + iCloud/Google 백업 차단
- Cloud backup 은 별도 평면 (signing share 가 아닌 DR 자산)
- Backup share count (SaaS 6 / Hosted 3)
- Hosted MPC 의 architectural 동기 (sovereign, compliance, BCM pairing)
- Hosted MPC + BCM + Off-Exchange 의 product-line pairing (cross-cut)

### wiki cover 밖 (외부)

- MPC-CMP whitepaper 의 cryptographic round-by-round detail (논문 자체)
- SGX confidential enclave 의 attestation flow detail (Intel SGX spec)
- Hosted MPC customer-side onboarding 절차 (sub-series 2건 미 deep-ingest)
- Customer-side SGX machine 의 hardware requirement (3-5 machines 만 명시)
- Off-Exchange product line 의 자체 architecture (5 priority domain 밖)

---

## 5. promote 필요 (필요 시)

본 답변 작성 과정에서 다음이 promote 후보로 식별됨 — 사용자 승인 후 deep ingest:

- **Hosted MPC Customer-Side Setup** (TIER 3 placeholder) — Q-S10 (Hosted MPC 도입 threshold) 응답 시 promote 권장
- **Hosted MPC Workspace Configuration** (TIER 3 placeholder) — 동일

현 시점 답변은 wiki 의 **현재 deep-ingested 범위 안에서만** 작성됨. 추가 detail 필요 시 위 2 source promote 요청 가능.

신규 open question 후보 없음 — Q-M04 (derivation 메커니즘) 이 가장 가까운 미해결 항목.

---

## 6. 추천 / 운영 힌트

### 의사결정 관점 (3-way 비교)

**SaaS MPC (default)**:
- Fireblocks 가 2/3 cloud share 보유 = **vendor partial-trust** 모델
- Cloud share 를 통해 policy enforcement / safeguard 자동 적용 — "**Safeguards in case keys owned by customers are compromised**" (source: `security-aspects-signing-with-the-fireblocks-mobile-app.md`)
- 운영 burden ↓ (Fireblocks 가 cloud co-signer 운영 + DR)
- SaaS outage 시 signing halt (BCM 사용 불가)
- Backup 은 단일 air-gapped machine + 6 files

**Hosted MPC**:
- Fireblocks 가 0 share = **customer sovereign** 모델 (vendor lock-in 회피, regional regulators 요건 충족)
- 3 SGX Co-Signer 모두 customer 호스팅 — **SGX infra 필수** (hardware + 운영 인력)
- BCM paired adoption 시 Aggregator 까지 customer-side = **3 운영 plane** (signing infra + BCM stack + B&R kit)
- Backup 은 **2 air-gapped machine + 3 files** (mobile passphrase + 2 RSA-encrypted Guard share) — 운영 burden ↑
- Off-Exchange product line 채택 시 사실상 prerequisite (Stage 22 cross-cut)

**적용 가이드**:
- **regulatory / vendor sovereignty 가 결정적 요건이 아니면 SaaS MPC** (운영 burden + 단순 backup)
- **regional data residency / internal policy / Off-Exchange 채택 / sovereign key management** 가 결정적이면 **Hosted MPC + BCM paired** 검토 — 단 3 운영 plane 의 인력·infra 비용 사전 계상
- **Backup 운영 risk 비교**: SaaS MPC 의 6-file Recovery Utility 도 4-secret 단일 aggregation point (catastrophic SPOC, `vendors/fireblocks/risks.md`) — Hosted 의 3-file 분산이 share 측면에서는 더 분리되지만, customer-side 책임이 늘어남

### Cross-reference

- 자세한 protocol 명세: `vendors/fireblocks/mpc.md` §"Stage 8 — MPC-CMP 정식 명세"
- Cloud 분포: `vendors/fireblocks/architecture.md` §"Stage 8 — Cloud Architecture 정식 명세"
- Risk 측면: `vendors/fireblocks/risks.md` Risk-S10 (SaaS outage), Risk-S15 (Off-Exchange ↔ Hosted MPC paired)
- Backup procedure: `entities/fireblocks/workspace-keys-backup.md` §"Stage 29 — Hosted MPC variant" + §"Stage 30 — SaaS MPC variant"
- Recovery: `entities/fireblocks/mpc-key-share.md` §"Stage 31 — Reconstruction Procedure" (4-secret model)
- Entity 정의: `entities/fireblocks/mpc-key-share.md`

---

## Sources (본 답변 근거 출처)

- `vendors/fireblocks/mpc.md` — primary spine (Key Share 분포 모델, Stage 8 MPC-CMP, Hosted MPC Variant)
- `vendors/fireblocks/architecture.md` — Cloud Architecture, 3-cloud provider, Hosted MPC table, BCM
- `entities/fireblocks/mpc-key-share.md` — entity 정의, 전체 분포 모델, Stage 8/29/30/31 detail
- `vendors/fireblocks/risks.md` — Risk-S10 (BCM Hosted-only), Risk-S15 (Off-Exchange pairing)
- Raw markdown sources (via citation chain):
  - `2026-05-18__support-fireblocks-io__mpc-cmp.md`, p.1-7
  - `2026-05-18__support-fireblocks-io__hosted-mpc-overview.md`, p.1-2
  - `2026-05-18__support-fireblocks-io__about-the-fireblocks-mobile-app.md`, p.1-2
  - `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.1-4
  - `2026-05-18__support-fireblocks-io__fireblocks-cloud-architecture.md`, p.1-3
  - `2026-05-18__support-fireblocks-io__hosted-mpc-backup-and-recovery.md` (Stage 29)
  - `2026-05-18__support-fireblocks-io__generating-a-workspace-key-backup-package-fireblocks-recovery-utility.md` (Stage 30)
  - `2026-05-18__support-fireblocks-io__business-continuity-module-bcm.md`, p.1-3
  - `2026-05-18__support-fireblocks-io__security-aspects-signing-with-the-fireblocks-mobile-app.md`, p.1
