> **Trigger 판별**: Trigger 3 (fact query — reference-ready 검증) — "Fireblocks 의 MPC key share 가 어디에 분포되어 있는지", "Hosted MPC 와의 차이"
> **단계**: SKILL.md 7-step workflow Step 7 (Reference-Ready Maintenance) — "Reference-ready 답변 모드"
> **운영 위임**: prompts/operating-principles.md §"fact / hypothesis 분리" + SKILL.md §"Reference-ready 답변 모드"
> **상태**: dry-run — 사용자 승인 전까지 어떤 파일도 생성/수정 안 함

## 1. 핵심 요약

- **Default (SaaS) MPC**: **3-of-3 within-group** = 고객 측 1 share + Fireblocks 측 2 share. 고객 share 의 primary host 는 mobile device secure enclave, Fireblocks 측 2 share 는 Azure SGX confidential enclave cloud co-signer 에 존재 (source: `vendors/fireblocks/mpc.md` §"Stage 8 — MPC-CMP 정식 명세 / Threshold 구조 / Cloud Architecture").
- **Backup**: 고객 mobile share 는 recovery passphrase 로 encrypted 되어 Fireblocks cloud servers 에 저장 (source: `vendors/fireblocks/mpc.md` §"Key Share 분포 모델", `recovery-passphrase.md`, p.1).
- **Across-group**: Admin/Signer 각자 자체 3-share set 보유, 모두 Owner set 에서 derived. "No two signing devices share the same key share set." (source: `entities/fireblocks/mpc-key-share.md` §"Stage 8 / Threshold 구조", `mpc-cmp.md`, p.7).
- **Hosted MPC 차이**: 3-of-3 share **전부 고객 환경** (1 Primary Co-Signer + 2 Guard Co-Signer, 모두 SGX). Fireblocks 가 share **0 개** = cryptographic ceremony 참여 불가 (source: `vendors/fireblocks/architecture.md` §"Hosted MPC Variant", `vendors/fireblocks/mpc.md` §"Hosted MPC Variant", `hosted-mpc-overview.md`, p.1).

## 2. 운영 상세

### 2.1 SaaS MPC 의 3-share 분포 (default)

```
Within-group threshold = 3/3
  ├── Customer Co-Signer × 1
  │     - Mobile device (iOS Keychain / Android TEE) — human-driven path
  │     - 또는 Customer-side SGX server / Customer cloud / Customer on-prem — automation path
  │     - 인증: PIN + (biometric OR Yubikey NFC)
  │     (source: vendors/fireblocks/mpc.md §"Two Co-Signing Components",
  │             entities/fireblocks/mpc-key-share.md §"Stage 8 / Share 분포")
  │
  └── Fireblocks Cloud Co-Signer × 2
        - Azure SGX confidential enclave
        - "Safeguards in case keys owned by customers are compromised"
        - Policy enforcement (tx amount threshold, destination integrity)
        (source: vendors/fireblocks/mpc.md §"Cloud Architecture / Two Co-Signing Components")
```

- Partial signature → Aggregator → Full signature → Blockchain (source: `entities/fireblocks/mpc-key-share.md` §"Stage 8 / Share 분포").
- Across-group: 1/N OR — 어느 signing group 이든 자체 3/3 만족하면 valid. 각 Admin/Signer 가 고유한 3-share set 보유, 모두 Owner 의 set 에서 derived (source: `vendors/fireblocks/mpc.md` §"Threshold 구조", `entities/fireblocks/mpc-key-share.md` §"Stage 8 / Threshold 구조").
- "**None of the parties (neither Fireblocks nor the customer) can sign a transaction alone.**" 직접 인용 (source: `entities/fireblocks/mpc-key-share.md` §"Stage 8 / Share 분포", `mpc-cmp.md`).

### 2.2 Backup / Cloud 저장의 의미

- Mobile share 의 backup = recovery passphrase 로 encrypted 되어 Fireblocks cloud 에 저장. 직접 인용: "Fireblocks uses the recovery passphrase to create an encrypted backup of the mobile device's private key share, which is stored securely in Fireblocks' cloud servers." (source: `vendors/fireblocks/mpc.md` §"Key Share 분포 모델", `recovery-passphrase.md`, p.1).
- 이 backup 은 3-of-3 signing 에 참여하는 active share 와는 **별도** — Verify Passphrase / 3 recovery scenario 에서 download → decrypt 용 (source: `vendors/fireblocks/mpc.md` §"Periodic Passphrase Verification", `recovery-passphrase.md`, p.2-4).
- Stage 2 `delete-users.md` p.1 의 "Fireblocks deletes the user's cloud-based key shares" = 이 passphrase-encrypted backup 의 폐기 (source: `entities/fireblocks/mpc-key-share.md` §"Cloud-based key share — Stage 2", `vendors/fireblocks/mpc.md` §"Key Share 분포 모델").

### 2.3 Cloud Provider 분할 (sensitive material 기준)

| Provider | 역할 | Sensitive material |
|---|---|---|
| Microsoft Azure | Core services + SGX Confidential Enclaves + Co-Signer Engine + Secure Vault — **key shares + configs + policy rules + third-party API credentials** | YES |
| Amazon AWS | Shell Services VPC + Node Infrastructure VPC (gateway / frontend) | NO |
| GCP Firebase | Console + mobile app caching DB | NO |

(source: `vendors/fireblocks/architecture.md` §"Stage 8 — Cloud Architecture / 3-Cloud Provider 분할", `fireblocks-cloud-architecture.md`, p.1-3)

- → **Azure = sensitive material 의 root** (Fireblocks 측 2 cloud share 의 실제 위치), AWS = 외피, GCP = caching (source: `vendors/fireblocks/architecture.md` §"Stage 8 — Cloud Architecture").

### 2.4 Hosted MPC variant 의 분포

| 구분 | Customer 측 | Fireblocks 측 |
|---|---|---|
| Default SaaS MPC | 1 share (mobile or customer-side Co-Signer) | 2 shares (Azure SGX) |
| **Hosted MPC** | **3 shares** (1 Primary Co-Signer + 2 Guard Co-Signer, 모두 SGX) | **0 shares** |

(source: `vendors/fireblocks/architecture.md` §"Hosted MPC Variant", `vendors/fireblocks/mpc.md` §"Hosted MPC Variant", `hosted-mpc-overview.md`, p.1)

- Hosted MPC 의 3 share 는 모두 customer 환경 (자체 cloud 또는 on-prem). 직접 인용: "Hosted MPC feature allows you to **completely control the MPC key shares** by hosting all three Co-Signers in your own environment, either in the cloud or on-premises." (source: `vendors/fireblocks/architecture.md` §"Hosted MPC Variant — Sovereign key management framing", `hosted-mpc-overview.md`, p.1).
- 모든 Co-Signer 가 **SGX 필수** (source: `vendors/fireblocks/mpc.md` §"Hosted MPC Variant").
- Fireblocks 가 share 0 개 = **cryptographic ceremony 참여 불가** → signing 의 모든 라운드 (key generation / signing / proactive refresh) 가 customer 환경에서 실행 (source: `entities/fireblocks/mpc-key-share.md` §"Stage 22 — Sovereign key share distribution").
- 동기: regulatory compliance, regional data residency, internal policies, end-user 요건, vendor lock-in 회피 (source: `vendors/fireblocks/mpc.md` §"Hosted MPC Variant", `vendors/fireblocks/architecture.md` §"Hosted MPC Variant").

### 2.5 SaaS MPC vs Hosted MPC 비교 매트릭스

| 항목 | SaaS MPC (default) | Hosted MPC |
|---|---|---|
| 3 share 분포 | 1 customer + 2 Fireblocks cloud | 3 customer (1 Primary + 2 Guard) |
| Customer share host | Mobile device 또는 customer Co-Signer | Primary Co-Signer (SGX) + 2 Guard Co-Signer (SGX) |
| Fireblocks share | 2 (Azure SGX) | 0 |
| Cryptographic 참여 | Fireblocks 측 policy enforcement / safeguard | Fireblocks 없음 |
| Backup share 수 | 1 (mobile, passphrase-encrypted) — 단, 전체 workspace backup 은 6 files (3 ECDSA + 3 EDDSA, cloud share RSA-4096 + mobile share passphrase) | 3 (1 mobile passphrase + 2 Guard RSA) |
| Backup 책임 | Mobile share = customer / cloud share = Fireblocks | 3 share 전부 customer |
| Air-gapped machine | 1 | 2 (download + assembly 분리) |
| Disaster continuity | Fireblocks SaaS 의존 | **BCM** 도입 가능 — Aggregator 까지 customer-side 로 이동, SaaS 없이도 signing 가능 |
| BCM 자격 | 없음 (Hosted MPC prerequisite) | 가능 |

(source: `vendors/fireblocks/mpc.md` §"Stage 8 — Hosted MPC Variant" + §"Hosted MPC Backup 모델 (Stage 29)" + §"SaaS MPC Backup 모델 (Stage 30)", `entities/fireblocks/mpc-key-share.md` §"Stage 22 — Sovereign key share distribution", `vendors/fireblocks/architecture.md` §"BCM (Business Continuity Module)" + §"Hosted MPC Variant")

### 2.6 프로토콜 공통

- 둘 다 **MPC-CMP** (Canetti–Makriyannis–Peled, UC Non-Interactive, Proactive, Threshold ECDSA; NIST 2020 / ACM CCS 2020) (source: `vendors/fireblocks/mpc.md` §"Stage 8 / Protocol 명세", `entities/fireblocks/mpc-key-share.md` §"Stage 8 / Protocol Identity").
- 둘 다 ECDSA + EdDSA 지원, 4 rounds (3 pre-processed), 마지막 라운드 QR offline 가능 (air-gapped) (source: `vendors/fireblocks/mpc.md` §"Stage 8 / Protocol 명세").
- Additive Secret Sharing — "the secret itself never exists" (source: `vendors/fireblocks/mpc.md` §"Stage 8 / Protocol 명세", `entities/fireblocks/mpc-key-share.md` §"Stage 8 / Additive Secret Sharing").

## 3. 확정 vs hypothesis

### 3.1 확정 (wiki 인용 가능)

- SaaS MPC = 3-of-3 within-group: 1 customer + 2 Fireblocks cloud (source: `vendors/fireblocks/mpc.md` §"Threshold 구조", `entities/fireblocks/mpc-key-share.md` §"Stage 8 / Share 분포").
- Customer share host = mobile device secure enclave (iOS Keychain / Android TEE) 또는 customer-side SGX server (customer cloud / on-prem 옵션) (source: `vendors/fireblocks/mpc.md` §"Two Co-Signing Components" + §"Cloud Architecture").
- Fireblocks 측 2 share = Azure SGX confidential enclave (source: `vendors/fireblocks/architecture.md` §"3-Cloud Provider 분할", `fireblocks-cloud-architecture.md`).
- Across-group threshold = 1/N OR, 각 Admin/Signer 자체 3-share set, 모두 Owner set 에서 derived, "No two signing devices share the same key share set." (source: `entities/fireblocks/mpc-key-share.md` §"Stage 8 / Threshold 구조", `mpc-cmp.md`, p.7).
- Mobile share backup = passphrase-encrypted, Fireblocks cloud server 저장 (source: `vendors/fireblocks/mpc.md` §"Key Share 분포 모델", `recovery-passphrase.md`, p.1).
- Hosted MPC = 3 share 전부 customer (1 Primary + 2 Guard Co-Signer, SGX 필수), Fireblocks 0 share, "completely control the MPC key shares" 직접 인용 (source: `vendors/fireblocks/architecture.md` §"Hosted MPC Variant", `hosted-mpc-overview.md`, p.1).
- BCM = Hosted MPC 전용 on-prem fallback, Aggregator 까지 customer-side (source: `vendors/fireblocks/architecture.md` §"BCM (Business Continuity Module)", `business-continuity-module-bcm.md`).
- "None of the parties can sign a transaction alone." 직접 인용 (source: `entities/fireblocks/mpc-key-share.md` §"Stage 8 / Share 분포", `mpc-cmp.md`).

### 3.2 Hypothesis (open question / 미명세)

- **Q-2026-05-18-M04** — MPC key share derivation 의 cryptographic 메커니즘 / 시간 / 실패 처리 (Owner set → user set derivation 절차) 는 **미명세** (source: `entities/fireblocks/mpc-key-share.md` §"Open Questions", `vendors/fireblocks/mpc.md` §"Open Questions").
- Q-D04 의 sub-clause: Fireblocks 가 보유한 2 cloud share 의 **decryption 가능성** 은 명시되지 않음 — wiki 는 "Fireblocks 는 individual share 만 보유, full key 재구성 불가가 protocol 핵심" 이라고만 진술 (source: `vendors/fireblocks/mpc.md` §"Open Questions"). Cryptographic 불가능성 자체는 protocol design 의 perfect secrecy 진술로 일관되나, 별도 attack model / formal proof 인용은 wiki 에 없음.
- Hosted MPC 의 **internal share rotation 빈도 / proactive refresh 주기**, customer 측 SGX attestation 운영 detail 은 wiki 에 미명세.
- **Q-2026-05-18-S09** (architecture.md Open Questions) — Hosted MPC + BCM + Cold Wallet 의 통합 deployment topology 는 부분 응답 상태 (Q-S09 backup procedural full cycle 은 Stage 31 에서 ANSWERED, 통합 topology 의 운영 세부는 미명세) (source: `vendors/fireblocks/architecture.md` §"Open Questions").

## 4. 답 가능 범위

- **wiki cover**: SaaS MPC 3-share 분포, host 위치, cloud provider 분할, mobile backup 모델, recovery scenario, Hosted MPC variant 3-share 분포 + Fireblocks 0-share + sovereign framing, BCM pairing, backup 단위 (SaaS 6 files / Hosted 3 share), prototype MPC-CMP 학술 reference — 전부 wiki 내 인용 가능.
- **wiki 부분 cover (depth 부족)**: derivation cryptographic 메커니즘 (Q-M04), Hosted MPC customer-side setup detail (Q-S10), proactive refresh 주기, SGX attestation 운영 detail — 본 wiki 의 Source Lake placeholder 또는 Open Q 보류 상태.
- **wiki 외부**: 별도 protocol formal proof, customer org 별 SGX 운영 best practice, regulatory framework 별 (예: BaFin / MAS / NYDFS) 의 Hosted MPC 도입 사례 — 본 wiki 5 priority domain 밖.

## 5. promote 필요

- **불필요**: 본 질문 (key share 분포 + Hosted MPC 차이) 은 wiki 의 deep ingest 영역 (Stage 5 / 8 / 22 / 29 / 30 / 31) 으로 완전 cover. 추가 promote 없이 답변 가능.
- **선택적 promote 후보** (사용자 깊이 요청 시):
  1. `Hosted MPC Customer-Side Setup` (Source Lake placeholder, Q-S10 도입 threshold 1차 source) — Hosted MPC 도입 결정 depth 가 필요한 경우.
  2. `Hosted MPC Workspace Configuration` (Source Lake placeholder, Q-S10) — workspace configuration delta 가 필요한 경우.
- 위 2 문서는 현재 TIER 3 placeholder. promote 는 사용자 명시 승인 필요 (Mode C auto entry 금지).

## 6. 추천 / 운영 힌트

- **SaaS MPC default 도입 시**: Fireblocks 가 2 cloud share 를 보유하는 partial-trust 모델임을 명시적으로 인지. 단, 3-of-3 within-group + perfect secrecy + SGX confidential enclave 로 Fireblocks 단독 서명은 cryptographic 불가능 (source: `entities/fireblocks/mpc-key-share.md` §"Stage 8 / Share 분포"). Mobile share backup 의 cloud 저장은 passphrase 가 customer-held 이므로 Fireblocks 가 backup 단독 decrypt 도 불가.
- **Hosted MPC 검토 trigger**:
  - Regulatory (regional data residency, vendor partial-trust 금지) → Hosted MPC 의 1차 motivation (source: `vendors/fireblocks/mpc.md` §"Hosted MPC Variant", `vendors/fireblocks/architecture.md` §"Hosted MPC Variant").
  - Disaster continuity (SaaS outage 시 signing 지속 필요) → BCM 동반 — Hosted MPC 가 BCM prerequisite (source: `vendors/fireblocks/architecture.md` §"BCM ↔ Hosted MPC pairing").
  - Off-Exchange product line 사용 → Hosted MPC 기반 운영, paired product (source: `vendors/fireblocks/architecture.md` §"Off-Exchange ↔ Hosted MPC pairing").
- **Backup 운영 차이 인지**:
  - SaaS: 6-file backup package (cloud share RSA-4096 + mobile share passphrase), 1 air-gapped machine, 4-secret reconstruction (Recovery Kit ZIP + RSA private key + Mobile passphrase + RSA private key passphrase) (source: `vendors/fireblocks/mpc.md` §"SaaS MPC Backup 모델 (Stage 30)" + §"Reconstruction 모델 (Stage 31)").
  - Hosted: 3-share backup (1 mobile passphrase + 2 Guard RSA), 2 air-gapped machine (download / assembly 분리), customer 가 3-share 전부 backup 책임 (source: `vendors/fireblocks/mpc.md` §"Hosted MPC Backup 모델 (Stage 29)", `vendors/fireblocks/architecture.md` §"Hosted MPC B&R Flow Detail").
  - 4-secret (또는 auto-passphrase 시 5-secret) reconstruction = **catastrophic single point** — "private key being considered exposed and compromised" if online (source: `vendors/fireblocks/architecture.md` §"Stage 8 — Cloud Architecture / DR Services"). offline-only 운영 엄수.
- **Audit 흐름**: MPC key set lifecycle 은 Created / Enabled / Activated 이벤트로 audit log 추적 가능 (source: `entities/fireblocks/mpc-key-share.md` §"Stage 8 — Audit Log MPC Key Set 이벤트").
- **다음 deepening 후보**: Q-M04 (derivation cryptographic 메커니즘) 답을 얻으려면 MPC-CMP whitepaper / public repository 의 별도 ingest 필요 — 현재 wiki 의 1차 자료 한계.
