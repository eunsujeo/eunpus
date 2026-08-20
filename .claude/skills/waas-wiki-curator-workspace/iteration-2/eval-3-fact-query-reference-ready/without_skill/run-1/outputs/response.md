# Fireblocks MPC Key Share 분포 & Hosted MPC 와의 차이

## 1. 핵심 요약 (10초)

Fireblocks 의 default(SaaS) MPC 는 **3-of-3 within-group threshold** 의 MPC-CMP 프로토콜로,
1 customer share + 2 Fireblocks cloud share 로 분포한다. **Hosted MPC** 는 동일한 3-of-3 구조를 유지하되, **3개 share 전부를 customer 가 호스팅**하여 Fireblocks 가 key share 를 0개 보유하는 sovereign 변형이다.

---

## 2. SaaS (default) MPC Key Share 분포

### 2.1 Within-group threshold = 3/3, 3 endpoints

`mpc-cmp.md` (Stage 8 ingest) 의 protocol 정식 명세:

```
3 endpoints (per signing group):
  - 1 Customer Co-Signer (mobile device  OR  customer-side SGX server)
  - 2 Fireblocks Cloud Co-Signers (Azure SGX servers)
       ↓ (partial signatures)
     Aggregator → Full Signature → Blockchain
```

- Within-group threshold = **3/3 full threshold** (Shamir Secret Sharing with t=n, additive secret sharing 사용)
- Across-group threshold = **1/N OR** (어떤 signing group 이든 자체 3/3 만족 시 valid)
- 각 Admin/Signer user 는 **고유한 3-share set** 보유 — 모두 Owner set 에서 derived (Owner = MPC-level root)
- "**No two signing devices share the same key share set.**" (`mpc-cmp.md`, p.7)
- "**None of the parties (neither Fireblocks nor the customer) can sign a transaction alone.**"

### 2.2 Customer-side share (1 share) — 3가지 호스팅 옵션

1. **Mobile device** (default, 가장 흔함) — iOS Secure Enclave / Android TEE 의 hardware-isolated 영역
   - PIN + (biometric OR Yubikey NFC) 인증
   - iCloud / Google auto-backup 비활성
2. **Customer cloud** (SGX server)
3. **Customer on-prem** (SGX server)

### 2.3 Fireblocks-side shares (2 shares) — Azure SGX

- **Azure** (core + SGX confidential enclaves): key share 본체 + configs + policy rules + API credentials
- AWS: gateway + frontend (no secrets)
- GCP Firebase: Console + mobile caching DB
- 2 Fireblocks cloud co-signer 는 **policy enforcement (tx amount threshold, destination integrity)** + "Safeguards in case keys owned by customers are compromised" 역할

### 2.4 Backup 분포 (Stage 5 + Stage 30 paired)

- **Primary host**: 사용자 mobile device secure enclave (raw share)
- **Cloud backup**: Fireblocks cloud servers — recovery passphrase 로 encrypt 된 **사용자 mobile share 의 cloud backup**
  - 출처 직접 인용 (`recovery-passphrase.md`, p.1): "Fireblocks uses the recovery passphrase to create an encrypted backup of the mobile device's private key share, which is stored securely in Fireblocks' cloud servers."
  - User 삭제 시 폐기
- **API user path** (Console user 와 별개): Co-signer-side key share — Owner 별도 승인 필요
- **Workspace Keys Backup** (Recovery Utility flow): 6 files = ECDSA 3 + EdDSA 3
  - Cloud shares 4 files: RSA-4096 (customer 업로드 public key)
  - Mobile shares 2 files: Owner passphrase
  - xprv + fprv reconstruction 의 input

### 2.5 Configuration Key (별도)

Mobile device 의 secure enclave 에는 **2 key 분리** 보관:
- **Private MPC-CMP key share** — transaction signing 용
- **Configuration key** — workspace 설정 / policy 변경 / 사용자 추가 등 Admin Quorum approval 용

---

## 3. Hosted MPC 변형

### 3.1 Share 분포 — 3/3 fully customer-side

`hosted-mpc-overview.md` (Stage 8) 직접 인용:

> "completely control the MPC key shares by hosting all three Co-Signers in your own environment."

```
3 endpoints (모두 customer-hosted):
  - 1 Primary Co-Signer
  - 2 Guard Co-Signers
       → Fireblocks 가 보유하는 share = 0
```

- **Primary Co-Signer** (1 share) — 두 deployment 옵션:
  - (a) **Mobile device** + Fireblocks mobile app — user-facing, biometric/Yubikey
  - (b) **SGX machine + API Co-Signer** — automation 가능
- **Guard Co-Signer** (각 1 share, 총 2 shares): **SGX machine 한정** (Mobile 옵션 없음)
- 모두 customer 호스팅 환경 → Primary 옵션 선택은 **automation vs user-in-loop trade-off**

### 3.2 BCM (Business Continuity Module) 추가 시

- Aggregator 까지 customer-side 로 이동 → **On-Prem MPC Aggregator**
- signing protocol 의 message orchestration 도 customer 인프라
- SaaS connectivity 없이도 signing 가능

### 3.3 Backup 분포 차이

`hosted-mpc-backup-and-recovery.md` (Stage 29) 직접 인용:

> "The main difference is that in the backup and recovery process for Hosted MPC, the two Guard Co-Signers that are associated with the Owner are also involved, in addition to the Owner's Mobile device."

| 항목 | SaaS MPC backup | Hosted MPC backup |
|---|---|---|
| Backup share 수 | **1** (mobile) | **3** (1 mobile + 2 Guard) |
| Mobile share 암호화 | passphrase | passphrase (동일) |
| Guard share 암호화 | N/A (Fireblocks cloud) | **RSA public key** (customer 업로드) |
| Air-gapped machine 수 | 1 | **2** (download + assembly 분리) |
| Trigger | Owner mobile approval | Owner mobile approval (Guard 자동 생성) |

→ Hosted MPC 의 backup = customer ownership 의 직접 결과. Fireblocks 가 share 보유 안 하므로 customer 가 3-share 모두 backup 책임을 가짐.

---

## 4. SaaS vs Hosted MPC 비교표

| 축 | SaaS MPC (default) | Hosted MPC |
|---|---|---|
| Threshold | 3/3 within-group | 3/3 within-group (동일) |
| Protocol | MPC-CMP (ECDSA + EdDSA) | MPC-CMP (동일) |
| Fireblocks 측 share 수 | **2** (Azure SGX) | **0** |
| Customer 측 share 수 | 1 (mobile / SGX) | **3** (Primary + 2 Guard) |
| Co-signer 명칭 | Fireblocks cloud Co-Signers | Primary + 2 Guard Co-Signers |
| Guard host | — | SGX machine 한정 |
| Cryptographic ceremony 참여 | Fireblocks 2, customer 1 | **customer 단독** |
| Policy enforcement layer | Fireblocks 2 cloud share | customer 통제 |
| Aggregator | Fireblocks cloud | (BCM 시) customer On-Prem |
| Backup share 수 | 1 (mobile) | 3 (mobile + 2 Guard) |
| 도입 동기 | 빠른 배포, vendor 가 safeguard 제공 | regulatory compliance, regional data residency, vendor lock-in 회피 |

핵심 차이 **한 줄로**: Fireblocks 가 2-of-3 share 를 들고 있느냐(SaaS, partial-trust) vs Fireblocks 가 share 0 개로 cryptographic ceremony 에 **참여 불가**(Hosted, sovereign).

---

## 5. 확정 vs 가설

**확정 (Fireblocks 공식 문서 명시):**
- 3/3 within-group threshold, 1/N OR across-group
- SaaS: 1 customer + 2 Fireblocks Azure SGX
- Hosted: 1 Primary + 2 Guard, 모두 customer-hosted, Fireblocks 0 share
- MPC-CMP protocol, ECDSA + EdDSA 지원, NIST 2020 + ACM CCS 2020 검증
- "어떤 party 도 단독 서명 불가" 명시
- Backup 비교표 (6-file SaaS / 3-share Hosted)

**Wiki 잔존 open question (본 자료 범위 밖):**
- Q-M04: Owner set → user set derivation 의 cryptographic 메커니즘 절차 세부

---

## 6. Reference (waas-wiki 경로)

- 메인 entity: `/Users/mob.bit/Workspace/waas-wiki/entities/fireblocks/mpc-key-share.md` (Stage 1–31 누적, 분포 모델 도해 포함)
- Vendor view: `/Users/mob.bit/Workspace/waas-wiki/vendors/fireblocks/mpc.md` §"Cloud Architecture", §"Hosted MPC Variant"
- Co-signer 분포: `/Users/mob.bit/Workspace/waas-wiki/entities/fireblocks/cosigner.md` §"Hosted MPC Variant"
- Backup paired: `/Users/mob.bit/Workspace/waas-wiki/entities/fireblocks/workspace-keys-backup.md` §"Stage 29 — Hosted MPC variant" / §"SaaS MPC vs Hosted MPC backup 비교"

**1차 출처 (Fireblocks Support docs):**
- `2026-05-18__support-fireblocks-io__mpc-cmp.md`, p.1–7 (protocol 본체, 3/3 threshold, share 분포)
- `2026-05-18__support-fireblocks-io__hosted-mpc-overview.md`, p.1 (Primary + Guard 정의, fully customer-controlled)
- `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.1, p.3–4 (cloud backup encrypted by passphrase)
- `2026-05-18__support-fireblocks-io__delete-users.md`, p.1 (cloud-based key share)
- `2026-05-18__support-fireblocks-io__about-the-fireblocks-mobile-app.md`, p.1 (mobile secure enclave)
- `2026-05-19__support-fireblocks-io__hosted-mpc-backup-and-recovery.md` (Stage 29, 3-share Hosted backup)
- `2026-05-18__support-fireblocks-io__business-continuity-module-bcm.md`, p.1–2 (BCM On-Prem Aggregator)
