---
type: entity
vendor: fireblocks
status: stable
tags: [mpc, cryptography]
stage_introduced: 1
last_updated_stage: 31
source_count: 10
related: [mobile-device, mpc, non-signing-admin, owner, signer]
---
# Entity: MPC Key Share (Fireblocks)

> **상태: 부분 정의.** 본 자료에서는 lifecycle 측면(승인·provisioning·일부 role의 보유 여부)만 확인됨. 프로토콜, share 분포, threshold는 추후 ingest 필요.

## Summary

Fireblocks의 multi-party computation(MPC) 서명 키의 share. **provisioning(생성·발급) 권한은 Owner 단독**이며 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.5), 서명 가능한 role을 가진 사용자의 device 단위로 Owner 승인이 필요하다 (p.1). 일부 role(NSA, Security Admin 등)은 MPC key share를 보유하지 않는다 (p.2, p.4).

## Key Concepts

- **Provision MPC signing keys** — 권한표에서 Owner만 ✓ (p.5)
- 서명 가능 사용자의 device에 대한 MPC key share 승인이 setup의 전제. 미승인 시 서명 시도 실패 (p.1)
- 승인 대기 상태는 `Settings > Users`의 Status 열 *Pending Owner MPC Key Approval* (p.1)
- **MPC key share를 보유하지 않는 role**: Non-Signing Admin (p.2), Security Admin (p.4); Approver/Editor/Viewer/Security Auditor도 서명 권한이 없음 (p.6)

## Details

- Owner의 책임에 "Approving new signing devices and MPC key shares" 명시 (`user-roles.md`, p.2).
- Device 재등록 등 lifecycle 이벤트와의 관계는 본 자료에 명시 없음 — 추후 *Re-enroll mobile device* 문서(Stage 3)에서 확인 예정.

### Cloud-based key share — Stage 2에서 용어 확정

Delete users 자료에서 다음이 확정되었다 (`delete-users.md`, p.1):

> "Fireblocks deletes the user's **cloud-based key shares**."

즉 Fireblocks가 cloud 측에 사용자별 key share 일부를 보유하며, 사용자 삭제 시 Fireblocks가 그 share를 삭제한다. cloud-based가 아닌 다른 share(예: mobile device 측)의 분포·역할은 본 자료에 명시 없음 → Q-2026-05-18-M03.

### Mobile device 재등록 시 재승인 (Stage 3)

`re-enroll-a-users-mobile-device.md`, p.1 — signing 가능한 role의 사용자가 mobile device를 재등록하면 **2-day × 2단계 windowing**이 발동된다:

1. 사용자가 device 재등록 완료
2. **Owner가 2일 내**에 새 MPC key shares 재승인
3. Owner 승인 후 **사용자가 2일 내**에 MPC registration 완료

각 단계 만료 시 동작은 본 자료에 명시 없음 → Q-2026-05-18-D03.

Owner 본인의 device 재등록은 Console 불가 → Fireblocks Support (`re-enroll-a-users-mobile-device.md`, p.1).

### Co-signer key share 승인 (Stage 4)

API user를 Co-signer와 페어링한 후 **Owner가 Co-signer의 key shares를 승인**해야 서명 사이클이 완성된다 (`re-enrolling-api-users.md`, p.1). 재등록 시에도 동일 — pairing 후 Owner 승인 필요. 이는 Console user 추가 시의 MPC device key share derivation과 별개의 승인 표면.

### Add user 시점의 MPC key share derivation (Stage 2에서 확정)

새 user의 role이 서명 가능하면 Owner는 두 가지를 별도로 승인해야 한다 (`add-users.md`, p.1):

1. user-add 자체 (Owner + Admin Quorum, Q)
2. **그 user의 MPC device에 대한 key share derivation** (Owner 단독)

둘 다 받아야 user가 active 상태가 된다. derivation의 cryptographic 메커니즘·시간·실패 처리는 본 자료에 없음 → Q-2026-05-18-M04.

## Related Pages

- [[entities/fireblocks/user-roles/owner]] — provisioning 단독 승인자
- [[entities/fireblocks/mobile-device]]
- [[entities/fireblocks/user-roles/signer]]
- [[entities/fireblocks/user-roles/non-signing-admin]] — 보유하지 않는 대표 role
- [[vendors/fireblocks/mpc]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1, p.2, p.4, p.5
- `2026-05-18__support-fireblocks-io__add-users.md`, p.1 (key share derivation 별도 승인)
- `2026-05-18__support-fireblocks-io__delete-users.md`, p.1 (cloud-based key share 삭제)
- `2026-05-18__support-fireblocks-io__re-enrolling-api-users.md`, p.1 (Co-signer key share Owner 승인)
- `2026-05-18__support-fireblocks-io__re-enroll-a-users-mobile-device.md`, p.1 (Stage 3: device 재등록 시 2-day windowing)
- `2026-05-18__support-fireblocks-io__transfer-workspace-owner.md`, p.1 (Stage 3: 신임 Owner의 MPC key share 사전 생성 요구)
- `2026-05-18__support-fireblocks-io__about-the-fireblocks-mobile-app.md`, p.1 (Stage 5: MPC-CMP, secure enclave)
- `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.1, p.3–4 (Stage 5: cloud backup 모델, 3 recovery scenarios)
- `2026-05-18__support-fireblocks-io__device-migration.md`, p.2 (Stage 5: self-service migration)
- `2026-05-18__support-fireblocks-io__fireblocks-mobile-app-updates.md`, p.2 (Stage 5: key material 3 layer 인증)

## Open Questions

- Q-2026-05-18-M01 — 어떤 MPC 프로토콜·share 분포가 깔려있는가?
- Q-2026-05-18-M02 — Sandbox에서 "backend service takes Owner role"의 보안 모델
- Q-2026-05-18-M03 — cloud-based 외 다른 key share 분포(mobile device? backend?)
- Q-2026-05-18-M04 — MPC key share derivation의 cryptographic 메커니즘·시간·실패 처리
- Q-2026-05-18-D03 — Mobile device 재등록 2-day window 만료 시 동작

## Stage 5 — Cloud Backup 모델 확정

`recovery-passphrase.md`, p.1 직접 인용:

> "Fireblocks uses the recovery passphrase to create an encrypted backup of the mobile device's private key share, which is stored securely in Fireblocks' cloud servers."

이로써 Stage 2 자료(`delete-users.md`, p.1)의 "cloud-based key shares 삭제"가 정확히 의미하는 것 확정: **recovery passphrase로 encrypted된 사용자 측 device key share의 cloud backup**. Fireblocks는 이 backup을 cloud에 보관하며, 사용자 삭제 시 폐기.

### 전체 분포 모델 (Stage 1–5 누적)

```
MPC key share (per user, per workspace)
  │
  ├── Primary host: 사용자 mobile device의 secure enclave
  │   ├── Hardware-encrypted
  │   ├── No iCloud / Google Cloud auto-backup
  │   └── Source: about-the-fireblocks-mobile-app.md p.1
  │
  ├── Cloud backup: Fireblocks cloud servers
  │   ├── Encrypted by: recovery passphrase (user-held)
  │   ├── Created at: initial user setup (Owner/Admin/Signer 필수)
  │   ├── Used for: 3 recovery scenarios + Verify Passphrase
  │   ├── On user delete: 폐기 (Stage 2)
  │   └── Source: recovery-passphrase.md p.1
  │
  └── API user path: Co-signer-side key share
      ├── Owner 별도 승인 (Stage 4)
      └── Source: re-enrolling-api-users.md p.1
```

### 3 Recovery Scenarios (Stage 5)

`recovery-passphrase.md`, p.3–4:

1. **Owner key share recovery** — Owner device 분실/신규 디바이스 시. Passphrase 사용 또는 password-less 옵션
2. **Admin/Signer key share recovery** — 다른 authorized signer의 device + 그 사람의 recovery passphrase로 복구
3. **Workspace Keys Recovery** — Owner가 full private key 재구성 (Workspace Keys Backup과 결합)

### MPC-CMP 프로토콜 명시

`about-the-fireblocks-mobile-app.md`, p.1: **"MPC-CMP signing workflows"** — Fireblocks가 CMP variant 사용함이 처음 직접 확인 (Q-M01 부분 답).

세부 라운드 구조·통신 비용·threshold 구성은 여전히 미명세 → Q-M01 잔존.

### Mobile Device key share update 시 인증

`fireblocks-mobile-app-updates.md`, p.2 — Key material 업데이트 시 **PIN + biometric + recovery passphrase** 3 layer 모두 요구. Mobile app의 secure enclave에 보관된 key material을 변경할 때의 표준 인증 흐름.

### Device Migration 시 key share 이동 (Stage 5)

`device-migration.md`, p.2 — Self-service migration에서:

- Export: PIN + passphrase + biometric → QR
- Import: new PIN + biometric + passphrase
- **Old device의 user + signing keys 자동 삭제**
- **관리자 승인 없음** (Security warning 명시)

즉 key share가 device 간 이동할 때 Owner approval이 우회되는 self-service 경로 존재 (Q-D05 참조).

## Stage 8 — MPC-CMP Protocol 정식 명세 (Q-M01 ANSWERED, Q-M03 ANSWERED, Q-D04 ANSWERED)

`mpc-cmp.md` (Stage 8 ingest), p.1-7:

### Protocol Identity (Q-M01 ANSWERED)
- **MPC-CMP** = Fireblocks 자체 개발 protocol, **ECDSA + EdDSA** blockchain signature 모두 지원
- **참조 논문**: Canetti, Makriyannis, Peled — *UC Non-Interactive, Proactive, Threshold ECDSA*
- 학술 검증: **NIST 2020 + ACM CCS 2020** 채택
- Open-source: public repositories 공개

### Threshold 구조 (Q-D04 ANSWERED)
- **Within-group threshold = 3/3** (Owner-mobile + 2 Fireblocks cloud co-signers)
- **Across-group threshold = 1/N OR** (어느 signing group 이든 자체 3/3 만족하면 valid)
- 각 Admin/Signer user 는 **고유한 3-share set** 보유 — 모두 **Owner 의 set 에서 derived** (Owner = MPC-level root)
- "**No two signing devices share the same key share set.**" (mpc-cmp.md p.7)

### Share 분포 (Q-M03 ANSWERED)
```
3 endpoints (per signing group):
  - 1 Customer Co-Signer (mobile device OR customer-side SGX server)
  - 2 Fireblocks Cloud Co-Signers (Azure SGX servers)
       ↓ (partial signatures)
     Aggregator → Full Signature → Blockchain
```
- Stage 5 의 "1 mobile + 2 cloud" 모델과 일치, **customer 측은 mobile / customer cloud / customer on-prem 3가지 선택지**
- "**None of the parties (neither Fireblocks nor the customer) can sign a transaction alone.**"

### Additive Secret Sharing
- "**Shamir Secret Sharing with full threshold t=n**" 라고도 불림
- Share 조합 = **simple addition** 만 (Shamir 보다 효율)
- **Perfect secrecy** — attacker 가 모든 share 없이는 정보 이론적으로 보호
- "the secret itself **never exists** — even during the key generation ceremony"

### Key Generation Security
- **HRNG (Intel RDRAND)**, **NIST SP 800-90A 준수**
- Hardware-isolated component 안에서 randomize
- "If the MPC key generation process fails, **the key was not created.**" (atomicity)
- Extended workspace key 는 어디에도 저장 안 됨
- 예외: **Workspace Key Backup** — encrypted recovery package (Stage 5 cloud backup 과 일치)

### Performance
- **4 rounds (3 pre-processed) vs GG18 의 8 rounds** → **800% faster**
- 마지막 라운드 **QR offline** 가능 → air-gapped signing

### Hosted MPC Variant (`hosted-mpc-overview.md` Stage 8)
- Default: 1 customer + 2 Fireblocks cloud
- **Hosted MPC**: 1 Primary Co-Signer + 2 Guard Co-Signers (모두 customer 호스팅) — Fireblocks 가 key share 0개

**Sovereign key share distribution** (Stage 22 보강):

Hosted MPC = **3-of-3 customer-side**. Fireblocks 가 share 0 개 보유 = cryptographic ceremony **참여 불가** — signing 의 모든 라운드 (key generation / signing / proactive refresh) 가 customer 환경에서 실행. SaaS MPC 의 "2 Fireblocks cloud share 가 policy enforcement / safeguard 적용" 모델이 Hosted MPC 에서는 **fully customer-controlled** 로 이동.

**BCM 도입 시 추가 변화**: Aggregator 까지 customer-side 로 이동 (cross-ref `business-continuity-module-bcm.md`) — signing protocol 의 message orchestration 도 customer 인프라. SaaS connectivity 없이도 signing 가능.

→ Hosted MPC 의 **sovereign key management plane** 은 regulatory compliance / regional data residency / vendor lock-in 회피 시나리오의 1차 architectural answer.

**Hosted MPC Backup 모델 (Stage 29 신규, `hosted-mpc-backup-and-recovery.md`)**:

| 항목 | SaaS MPC backup | Hosted MPC backup |
|---|---|---|
| Backup share 수 | 1 (mobile) | **3** (1 mobile + 2 Guard) |
| Mobile share 암호화 | passphrase | passphrase (동일) |
| Guard share 암호화 | N/A (Fireblocks cloud) | **RSA public key** (customer 업로드) |
| Air-gapped machine 수 | 1 | **2** (download + assembly 분리) |
| Trigger | Owner mobile approval | Owner mobile approval (Guard 자동 생성) |

→ Hosted MPC 의 backup = **customer ownership 의 직접 결과**. Fireblocks 가 share 보유 안 하므로 customer 가 3-share 모두 backup 책임. 자세한 procedure 는 [[entities/fireblocks/workspace-keys-backup]] §"Stage 29 — Hosted MPC variant".

**SaaS MPC Backup 모델 (Stage 30 신규, `generating-a-workspace-key-backup-package-fireblocks-recovery-utility.md`)**:

SaaS MPC 환경에서는 **2 cloud + 1 mobile** 의 3-share 분포 (Stage 8 ANSWERED) 가 backup 단계에서 **2 curves × 3 shares = 6 files** 로 풀림:

| 항목 | 명세 |
|---|---|
| Backup file count | **6 files** (ECDSA 3 + EDDSA 3) |
| Cloud shares (4 files = ECDSA × 2 + EDDSA × 2) | **RSA-4096 encryption** (customer-upload public key) |
| Mobile shares (2 files = ECDSA + EDDSA) | **Owner passphrase encryption** |
| Tool | **Fireblocks Recovery Utility app** (Console 다운로드) |
| Cryptographic spec | **RSA-4096 + AES-128** (private key symmetric protection) |
| Approval | Owner + Admin Quorum, **48h window** |
| Download | **Once only** |

→ xprv (ECDSA extended private key) + fprv (EDDSA extended private key) reconstruction 의 backup 단위 = **6 encrypted shares**. Stage 8 의 "extended ECDSA + EdDSA private keys (xprv+fprv) 재구성" 의 **input format 명확화**.

자세한 procedure: [[entities/fireblocks/workspace-keys-backup]] §"Stage 30 — SaaS MPC variant (Recovery Utility flow)".

**Reconstruction 모델 (Stage 31 신규, `recovering-private-key-material.md`)**:

6-file backup package 를 xprv+fprv 로 재구성하는 procedure:

| Step | Action | 비고 |
|---|---|---|
| 1 | Recovery Utility on **offline machine** (online 실행 시 키 compromise 공식 선언) | "Do not connect to any network" |
| 2 | Input **4 secrets** | Recovery Kit ZIP + RSA private key + Mobile passphrase + RSA private key passphrase |
| 3 | Select Recover → verification → **Accounts page** | workspace reconstruction view |

**4-secret reconstruction model** (★ catastrophic single point):
- 4 secrets 중 1개라도 분실 시 DR 불능
- Auto-passphrase 사용 시 **5 secrets** (추가 RSA keypair private key)
- Stage 8 의 SPOC 경고 = 4-secret aggregation 의 single-point-of-failure

**Q-S09 ANSWERED (Stage 31)** — backup → reconstruction full cycle complete. 자세한 procedure: [[entities/fireblocks/workspace-keys-backup]] §"Stage 31 — Reconstruction Procedure".

## Stage 8 — Configuration Key 분리 (`security-aspects-signing-with-the-fireblocks-mobile-app.md`, p.1)

Mobile device 의 secure environment 에는 **두 종류 키**가 분리되어 있음:
- **Private MPC-CMP key share** — transaction signing 용 (Owner/Signer/Admin)
- **Configuration key** — workspace 설정 / policy 변경 / 사용자 추가 등 **Admin Quorum approval** 용

→ 즉 MPC key share 와 별개로, mobile device 에는 governance approval 전용 키가 존재. 둘 다 iOS Secure Enclave / Android TEE 에 평문 추출 불가 상태로 보관.

## Stage 8 — Audit Log MPC Key Set 이벤트 (`audit-log.md`)

`audit-log.md` Keys 섹션:
- **MPC key set**: Created / Enabled / Activated 이벤트로 lifecycle 추적
- **Validation key**: Submitted/Approved/Rejected/Activated/Deactivated 이벤트
