---
type: entity
vendor: fireblocks
status: stable
tags: [recovery, backup, security, workspace, governance]
stage_introduced: 1
last_updated_stage: 171
source_count: 9
related:
  - admin-quorum
  - architecture
  - cosigner
  - lifecycle-events
  - mpc-key-share
  - owner
  - recovery-passphrase
  - risks
---
# Entity: Workspace Keys Backup

## Summary

Workspace의 key 자산에 대한 **Owner-managed 백업**. Owner가 생성하며, 본인의 [[entities/fireblocks/recovery-passphrase]]로 암호화된다 (source: `2026-05-18__support-fireblocks-io__transfer-workspace-owner.md`, p.1). **Owner 이전 시 유지/파기 결정이 강제**되며, 파기 시 신임 Owner가 자신의 recovery passphrase로 새 backup을 생성해야 한다.

> **상태: 부분 정의.** Backup의 구체적 구성(어떤 종류의 key share가 백업되는지, Fireblocks 측 사본 존재 여부, 형식 등)은 본 자료군에 없음. Stage 1 단서 + Stage 3의 transfer 절차에서 유추 가능한 만큼만 기록.

## Key Concepts

- **Owner가 생성·관리** (`user-roles.md`, p.2 "creating a backup kit, and recovery")
- **Recovery passphrase로 암호화** (`transfer-workspace-owner.md`, p.1)
- **Owner 이전 시 유지/파기 결정 강제**:
  - 유지 시: 현 Owner의 passphrase로 암호화된 상태로 잔존 (보안 우려)
  - 파기 시: 신임 Owner가 본인 passphrase로 새 backup 생성 (`transfer-workspace-owner.md`, p.1)
- Owner의 emergency 책임에 포함 (`user-roles.md`, p.2)

## Details

### Owner 이전 시 분기점

`transfer-workspace-owner.md`, p.1의 **Important note**:

> "If the current Owner created a Workspace Keys Backup, your organization should decide before the transfer whether to keep or destroy it. If destroyed, the new Owner should create a new backup encrypted with their recovery passphrase."

이 결정은 **조직 차원**의 결정이며 (개인 Owner의 단독 결정이 아님), 이전 절차 전에 완료되어야 한다.

### 구성 (미해결)

본 자료군은 backup의 다음 사항을 명시하지 않는다:

- 어떤 key share가 백업되는지 (mobile device 측? cloud-based? 양쪽?)
- Fireblocks가 동일 backup의 사본을 보유하는지
- 파일 형식·저장 매체·갱신 주기
- backup 없이 운영 가능한지 (생성이 필수인지)

→ [[open-questions/fireblocks]] Q-2026-05-18-M03 (cloud 외 share 분포)와 함께 추적.

### Owner 부재 path (board resolution)와의 관계

현 Owner 부재 시 board resolution path로 이전 진행 (`transfer-workspace-owner.md`, p.1–2). 이 경우 backup 유지/파기 결정은 누가 어떻게 내리는지 본 자료에 명시 없음 → 이사회가 대리 가능성 추정 (확인 필요).

## Stage 5 — Recovery Package 및 Workspace Keys Recovery

### Recovery Package 용어 (Stage 5)

`reset-the-owners-recovery-passphrase.md`, p.1–2에서 **"recovery package"** 용어가 직접 등장:

- Workspace Keys Backup의 결과물이 "recovery package"로 불리는 듯 (둘이 별개인지 동의어인지 본 자료에 명시 없음)
- Owner의 recovery passphrase reset 시 **기존 recovery package 파기 권장**:
  - Org-managed: 내부 파기
  - Third-party DRS: provider 요청
- Reset 후 새 recovery package 요청:
  - **Offline backup**: Fireblocks Support 경유
  - **Third-party DRS**: Fireblocks Support → DRS provider recreate

### Workspace Keys Recovery (Stage 5)

`recovery-passphrase.md`, p.4 — 3 recovery 시나리오 중 세 번째:

> "You are the workspace Owner and you want to reconstruct your full private key as part of a Workspace Keys Recovery procedure."

본 entity는 단순히 mobile device key share의 cloud backup ([[entities/fireblocks/recovery-passphrase]]가 다루는 자산)과 **별개**로, **full private key 재구성**을 위한 자산.

정확한 구성 요소·재구성 메커니즘은 본 자료에 명세 없음 → Q-D07.

권장 운영: "occasionally verifying your Workspace Keys Recovery process using your recovery passphrase to ensure you can reconstruct your key when needed" (`recovery-passphrase.md`, p.4).

## Stage 29 — Hosted MPC variant (★ Q-S09 partial answered)

`hosted-mpc-backup-and-recovery.md` (Stage 29 Mode C):

### vs SaaS MPC backup (직접 인용)
> "Creating a backup and recovery kit is similar to the process for a SaaS MPC Workspace... The main difference is that in the backup and recovery process for Hosted MPC, the **two Guard Co-Signers that are associated with the Owner are also involved**, in addition to the Owner's Mobile device."

→ **SaaS MPC backup** = 1 share (mobile). **Hosted MPC backup** = **3 shares** (1 mobile + 2 Guard).

### 3-share backup kit 구조

| Share | 출처 | 암호화 방식 | 전달 경로 |
|---|---|---|---|
| 1. Mobile key share | Owner mobile device | **passphrase-encrypted** | encrypted kit via **email** → download → air-gapped machine |
| 2. Guard Co-Signer #1 share | Guard Co-Signer #1 (SGX) | **RSA public key encryption** (customer 업로드 키) | 자동 생성 → local host file (dedicated folder) |
| 3. Guard Co-Signer #2 share | Guard Co-Signer #2 (SGX) | **RSA public key encryption** | 자동 생성 → local host file |

→ **Asymmetric encryption layers**: mobile=passphrase, Guard=RSA. 두 plane 별개 protection.

### Workflow — 2-step + 2 air-gapped machines

**Step 1 (Initiate)**: Owner approves on mobile app → encrypted kit emailed → download to **air-gapped machine #1** (Guard share file 도 동시 자동 생성).
**Step 2 (Assemble)**: 3 encrypted shares 를 **air-gapped machine #2 (different)** 로 복사 → kit 조립.

→ **2 air-gapped machines required** (download + assembly 분리). 운영 burden / DR risk 모델에 중요 — [[vendors/fireblocks/risks]] §Risk-S09 cross-cut.

### RSA Public Key Console Upload

직접 인용: "The Guard Co-signers' key share files are encrypted and saved with the **RSA public key that you upload to Fireblocks during the backup and recovery process performed via the Console**."

→ Customer 측 RSA keypair 사전 생성 + public key Console 업로드 = Guard share 암호화 keystore.

### Approval-Triggered Automation

직접 인용: "The approval of the Backup and Recovery process **triggers this automatically**."

→ Backup approval (mobile app) = Guard share file 자동 생성 trigger. Customer 가 별도 명령 실행 안 함.

### Q-S09 partial answer 영역 (Stage 29)

해결: 3-share procedure / air-gapped 요건 / RSA 암호화 / approval-triggered automation
**잔존**: xprv+fprv (extended private keys) 명시 / air-gapped 머신 hardening 표준 / rotation 정책 / Recovery utility 사용 절차 → paired Mode C `generating-a-workspace-key-backup-package-fireblocks-recovery-utility` 필요

## Stage 30 — SaaS MPC variant (Recovery Utility flow, ★ Q-S09 substantial advance)

`generating-a-workspace-key-backup-package-fireblocks-recovery-utility.md` (Stage 30 Mode C):

### Backup Package — 6 files (★ 명시적 cryptographic spec)

직접 인용:
> "The package is composed of **six files** that contain the following key share components:"

| # | File | Encryption | Plane |
|---|---|---|---|
| 1 | ECDSA cloud key share 1 | **RSA** (customer-upload public key) | Fireblocks cloud |
| 2 | ECDSA cloud key share 2 | **RSA** | Fireblocks cloud |
| 3 | ECDSA Owner mobile key share | **Owner passphrase** | Owner mobile |
| 4 | EDDSA cloud key share 1 | **RSA** | Fireblocks cloud |
| 5 | EDDSA cloud key share 2 | **RSA** | Fireblocks cloud |
| 6 | EDDSA Owner mobile key share | **Owner passphrase** | Owner mobile |

→ **2 curves (ECDSA + EDDSA) × 3 shares = 6 files**. xprv (ECDSA extended private key) + fprv (EDDSA extended private key) reconstruction 의 backup 단위.

### Recovery Utility App (★ procedure tool)

- Console: `Settings > Key backup > In-house backup` → OS-specific binary download
- USB stick 으로 air-gapped offline machine 에 전송
- 직접 인용: **"permanently disconnected from all networks"** — Online 시 utility 가 red warning 표시

### RSA-4096 + AES-128 Cryptographic Spec

**Method 1 — Recovery Utility 내장**:
- `Use the Recovery Utility > Generate Recovery Keys`
- passphrase ≥ 4 chars (recommended **≥ 12 chars + mixed case + numbers + symbols**)

**Method 2 — Manual openssl** (직접 인용):
```bash
openssl genrsa -aes128 -out fb-recovery-prv.pem 4096
openssl rsa -in fb-recovery-prv.pem -outform PEM -pubout -out fb-recovery-pub.pem
```

→ **RSA-4096** (Stage 29 의 generic "RSA public key" 보강) + **AES-128** symmetric protection of private key file.

### Approval Flow (★ governance plane)

1. Recovery Utility 가 zip 출력 → public key 만 USB 로 online 머신에 전송
2. Console `Settings > Create backup` → public key upload
3. **Owner + Admin Quorum** 승인 (직접 인용)
4. **48-hour approval window** — 초과 시 process **재시작 필수** (직접 인용)
5. Recovery Utility `Start Approval` → mobile app 에 **QR code 또는 short key** 전송 (offline ↔ online air-gapped bridge)
6. Mobile app: Admin Quorum QR scan 또는 short key 입력 → public key 확인 → **PIN + biometric** → Approve
7. Recovery Utility `View Public Key` 로 양쪽 일치 검증 후 최종 Approve

### Backup Kit Download — Once Only (★ operational fragility)

직접 인용:
> "After finalizing the approval process on the Fireblocks mobile app, the workspace Owner can click Download backup kit to download the backup package. **The backup package can only be downloaded once.**"

→ Single attempt — 다운로드 실패 시 process 전체 재시작. operational fragility signal (Risk-S09 cross-cut).

### SaaS MPC vs Hosted MPC backup 비교 (Stage 29 + Stage 30 paired)

| 항목 | SaaS MPC (Stage 30) | Hosted MPC (Stage 29) |
|---|---|---|
| File count | **6 files** (ECDSA + EDDSA × 3) | 3 files |
| Curves | **ECDSA + EDDSA 명시** | "key shares" (curve 명시 없음) |
| Cloud share | RSA-encrypted | N/A (Fireblocks 0 cloud share) |
| Guard share | N/A | **RSA-encrypted** |
| Mobile share | passphrase | passphrase |
| RSA spec | **RSA-4096 + AES-128** | "RSA public key" generic |
| Tool | **Recovery Utility app** | (별도 도구 명시 없음) |
| Air-gapped 머신 | 1 (Recovery Utility offline) + online | 2 (download + assembly) |
| Approval window | **48 hours** | (window 명시 없음) |
| Download | **Once only** | (명시 없음) |

→ 두 source paired 로 Workspace Keys Backup spine 의 **full operational reasoning layer** 완성.

## Stage 31 — Reconstruction (Recovery) Procedure (★ Q-S09 answered)

`recovering-private-key-material.md` (Stage 31 Mode C):

### Strict offline-only mandate (★ SPOC trigger)

직접 인용:
> "Perform this procedure **only on an offline machine**. Performing this procedure on an online machine will result in your **private key being considered exposed and compromised**."

→ Stage 8 architecture 의 SPOC 경고가 reconstruction 단계의 explicit trigger. Online 실행 = 키 공식 compromise.

### 3-step Recovery Procedure

1. **Open Recovery Utility on offline machine** → `Recover Private Keys` (또는 left menu `Recover`)
   - 미설치 시: online 다운로드 → USB transfer → offline install
   - "Do not connect the offline machine to any network during this process"
2. **Complete 4 fields** (★ 4-secret reconstruction model)
3. **Select Recover** → verification → **Accounts page** (workspace reconstruction view)

### 4-secret Reconstruction Model

| # | Field | Source (Stage 30 backup) |
|---|---|---|
| 1 | **Recovery Kit** ZIP | Stage 30 의 6-file backup package |
| 2 | **Recovery Private Key** (`fb-recovery-prv.pem`) | Stage 30 의 RSA-4096 private key file |
| 3 | **Mobile App Recovery Passphrase** | Owner mobile share 의 passphrase |
| 4 | **Recovery Private Key Passphrase** | RSA private key 의 AES-128 protection |

→ **4 secrets required**. Any one missing = DR 불능 (catastrophic failure). Stage 8 의 "single point of compromise" SPOC 경고의 운영적 의미 = 4 secrets 의 single-point-of-failure aggregation.

### Auto-Passphrase Variant (★ Q-S01 partial signal)

Workspace setup 시 auto-generated passphrase 사용한 경우:
- "Mobile App Recovery Passphrase" → **"Auto-Generate Private Key Passphrase"**
- 추가 field: **"Auto-Generated Passphrase Private Key"** (별도 RSA private key file)

→ Auto-passphrase = **2-key cryptographic system**: (a) mobile share 의 passphrase, (b) 그 passphrase 를 암호화하는 별도 RSA keypair. **Total 5 secrets** for reconstruction (vs manual passphrase 의 4 secrets).

### JSON Automation (Recovery Utility v1.8.0+)

```json
{
  "Passphrase": "your passphrase",          // Mobile App Recovery Passphrase
  "rsaKeyPassphrase": "your rsaKeyPassphrase"  // RSA Private Key Passphrase
}
```

→ Scripted DR 가능 (passphrase manual entry 회피).

### Backup → Reconstruction Full Cycle (★ Stage 29 + 30 + 31 통합)

```
BACKUP (Stage 30):
  Console → Recovery Utility (offline) → RSA keypair 생성 → public key upload
  ↓
  Owner + Admin Quorum approval (48h) → QR/short-key bridge
  ↓
  Backup kit download (once-only) → 6-file package (3 ECDSA + 3 EDDSA)

RECONSTRUCTION (Stage 31):
  Offline machine ONLY → Recovery Utility → Recover Private Keys
  ↓
  4 secrets: Recovery Kit ZIP + RSA private key + Mobile passphrase + RSA private key passphrase
  ↓
  Verification → Accounts page (workspace reconstruction view)
  ↓
  xprv + fprv reconstruction complete
```

### Q-S09 잔존 영역 (★ out-of-scope for vendor docs)
- **Rotation 정책** — backup kit 갱신 주기 / 사유 — **org compliance 결정** (vendor 영역 아님)
- **Formal air-gapped hardening 표준** (NIST CSP / FIPS) — **customer compliance posture 결정** (vendor 영역 아님)

→ 위 2 항목은 Fireblocks vendor docs 가 아닌 customer org-level 결정. Procedural Q-S09 는 Stage 29 + 30 + 31 paired evidence 로 **answered**.

## Stage 153 — DR/BCP 지표·복구 계층 (CSM 확답)

`sources/fireblocks/csm2_boost.txt` (Fireblocks CSM 질의 · 2026-07 PoC) — DR/백업 확답:

### BCP 지표
- **RTO 6시간**(통합값) · **RPO 0**(대부분의 DR 시나리오에서 데이터 손실 최소~무) · **SLO/uptime 99.9%**(SLA).
- 인증: **ISO 22301(BCM)** · **SOC2 Type 2**(연 감사, 백업·복구 포함). 최근 DR 테스트 zero adverse findings.

### 백업
- **일 단위 백업**(중요 자산은 추가 주기) · at-rest·in-transit 암호화 · **연 1회 이상 복구 테스트**(전용 환경) · 지리적으로 분리된 데이터센터 보관.
- **Disaster Recovery Kit** — 온보딩 시 제공. 모든 share 를 잃거나 Fireblocks 가 운영을 중단해도 고객이 자체 백업·복구 가능.

### 복구 2계층
- **Soft Key Recovery** — device/share 단위(예: device 분실). **접근 가능한 share 최소 1개**(기존 Owner/Admin) 필요.
- **Hard Key Recovery** — 전체 지갑 복원(파국적: 모든 device 접근 불가·Fireblocks 영구 중단). 더 엄격한 절차 — 자체 수행 또는 **Station70·Coin Cover** 등 파트너 위탁.

### Key Share 지리 분산
서명 device 당 share = 고객 device 1 + Fireblocks SGX 2(multi-cloud geo-redundant) → 지역·클라우드 장애 견딤. 분포 상세는 [[entities/fireblocks/mpc-key-share]].

> 주의: Fireblocks 의 상시 **Disaster Recovery Service**(xprv+fprv 재구성)는 그 자체가 SPOC 경고 대상이다 — [[vendors/fireblocks/risks]] Risk-S09. 위 복구 계층은 정기 백업·BCP 관점이고, DR Service 남용 경고와는 별개 축.

## Related Pages

- [[entities/fireblocks/recovery-passphrase]] — 암호화 키 (mobile share)
- [[entities/fireblocks/user-roles/owner]] — 생성·관리 주체
- [[entities/fireblocks/mpc-key-share]] — backup 대상 자산 (SaaS 6-file + Hosted 3-share)
- [[entities/fireblocks/cosigner]] — Hosted MPC Guard Co-Signer plane
- [[entities/fireblocks/admin-quorum]] — 48h approval window
- [[vendors/fireblocks/architecture]] — DR Service spec (xprv+fprv = 6 files)
- [[vendors/fireblocks/lifecycle-events]] — Owner Transfer 절
- [[vendors/fireblocks/risks]] — DR/Owner SPOF, Risk-S09 (48h + once-only fragility)

## Sources

- `2026-05-18__support-fireblocks-io__transfer-workspace-owner.md`, p.1
- `2026-05-18__support-fireblocks-io__user-roles.md`, p.2 (Owner의 backup 책임)

## Sources (Stage 5 추가)

- `2026-05-18__support-fireblocks-io__reset-the-owners-recovery-passphrase.md`, p.1–2 (recovery package 용어, 파기·재요청)
- `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.4 (Workspace Keys Recovery scenario)

## Sources (Stage 29 추가)
- `2026-05-19__support-fireblocks-io__hosted-mpc-backup-and-recovery.md` (Stage 29 Mode C, 3-share Hosted MPC backup model)

## Sources (Stage 30 추가)
- `2026-05-19__support-fireblocks-io__generating-a-workspace-key-backup-package-fireblocks-recovery-utility.md` (Stage 30 Mode C, 6-file SaaS MPC backup + Recovery Utility flow)

## Sources (Stage 31 추가)
- `2026-05-19__support-fireblocks-io__recovering-private-key-material.md` (Stage 31 Mode C, reconstruction procedure + 4-secret model + auto-passphrase variant)

## Sources (Stage 153 추가)
- `sources/fireblocks/csm2_boost.txt` — DR/BCP 지표(RTO 6h·RPO 0·SLO 99.9%)·일 단위 백업·DR Kit·Soft/Hard 복구(Station70·Coin Cover)·ISO 22301·SOC2 Type 2·key share 1+2 SGX geo (Fireblocks CSM 질의 · 2026-07 PoC)

## Open Questions

- ~~Q-2026-05-18-M03~~ — **부분 ANSWERED (Stage 5)**: mobile device key share의 cloud backup은 별개 자산. Workspace Keys Backup은 full key reconstruction용
- ~~Q-2026-05-18-W02~~ — **ANSWERED (Stage 5)**: recovery passphrase reset 시 backup 파기 권장 + 새 recovery package 요청
- ~~Q-2026-05-18-S09~~ — **ANSWERED (Stage 31)**: Stage 29 (Hosted MPC backup) + Stage 30 (SaaS MPC backup) + Stage 31 (reconstruction) paired evidence. Procedural answer complete (4-secret reconstruction model + offline-only mandate). 잔존 (rotation policy + formal air-gapped hardening) 는 **org compliance 영역**, vendor docs 외.
- Q-2026-05-18-S01 — **partial signal (Stage 31)**: Auto-passphrase = 2-key cryptographic system 식별. Generation algorithm / entropy 잔존.
- Q-2026-05-18-D04 — Cloud backup의 cryptographic 세부
- Q-2026-05-18-D07 — Workspace Keys Recovery 절차·메커니즘 (paired Mode C `generating-a-workspace-key-backup-package-...` 필요)
- (board resolution path에서 backup 결정 권한 위임 — 본 자료에 명시 없음)

## Stage 171 — Cold Wallet 관련 mobile recovery의 경계

Fireblocks의 `Mobile Key Share Backup and Recovery`는 일반 mobile key share 복구 문서다. 다음 내용은 확인되지만 Cold Wallet 전용 workspace key backup 절차와 같다고 단정할 수 없다.

- 기기 OS cloud backup에는 Fireblocks key share material이 포함되지 않는다.
- Biometric 설정 변경, PIN 분실, 기기 분실·파손·교체, Fireblocks app 삭제는 mobile key share에 접근할 수 없게 되는 사유다.
- Owner 기기의 mobile key share recovery에는 Fireblocks Support와 경우에 따라 Disaster Recovery Service provider의 도움이 필요하다.
- Owner recovery에는 recovery passphrase를 쓰거나 다른 signing user의 mobile device를 쓰는 방법이 안내된다.

출처: `sources/fireblocks/source-notes/cold-wallet-operating-model.md` (`FB-CW-07`, Stage 171)
