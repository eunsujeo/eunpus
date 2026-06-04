---
type: vendor-hub
vendor: fireblocks
status: draft
tags: [mpc, cryptography]
stage_introduced: 1
last_updated_stage: 22
source_count: 8
related:
  - api-co-signer
  - architecture
  - cosigner
  - mobile-app
  - mobile-device
  - mpc-key-share
  - recovery-passphrase
  - risks
  - workspace-keys-backup
---
# Fireblocks — MPC

> Fireblocks의 MPC(Multi-Party Computation) 구현. 키 생성/분산/서명/리프레시.

## Summary

_TODO: MPC 프로토콜 세부(CMP 라운드 구조·threshold 구성), key refresh 메커니즘 등은 추후 MPC-CMP whitepaper 등 별도 자료 필요._

본 자료군에서 확정된 사실 (Stage 1–5 누적):

- **MPC-CMP** 명시 (`about-the-fireblocks-mobile-app.md`, p.1) — Fireblocks가 사용하는 프로토콜이 CMP variant임이 처음 직접 확인
- **Key share 분포 모델**:
  - **Primary**: 사용자의 mobile device **secure enclave** (hardware-encrypted) (`about-the-fireblocks-mobile-app.md`, p.1)
  - **Backup**: Fireblocks **cloud servers**, **recovery passphrase로 encrypted** (`recovery-passphrase.md`, p.1)
  - API user (Co-signer 페어링) 측 share도 존재 (Stage 4)
- **Provisioning 권한**: Owner 단독 (Stage 1 권한표)
- 다른 클라우드(iCloud/Google Cloud) 백업 **불가** — hardware-encrypted

## Key Concepts

- **MPC-CMP** — 본 자료에서 명시된 프로토콜명. 라운드 구조·통신 비용 등 세부는 미명세
- **Secure enclave host** — 모든 signing user의 mobile device의 hardware secure enclave에 key share 보관 (`about-the-fireblocks-mobile-app.md`, p.1)
- **Cloud backup (passphrase-encrypted)** — Fireblocks cloud servers에 별도 backup. Verify 시 download되어 passphrase로 decrypt 시도 (`recovery-passphrase.md`, p.2)
- **3 Recovery scenarios** (`recovery-passphrase.md`, p.3–4):
  1. Owner key share recovery (passphrase 사용 또는 password-less)
  2. Admin/Signer key share recovery (다른 authorized signer의 passphrase 사용)
  3. **Workspace Keys Recovery** — full private key 재구성
- **Provision MPC signing keys: Owner 단독** (`user-roles.md`, p.5)
- **API Co-signer** — mobile app의 자동화 대체 (`about-the-fireblocks-mobile-app.md`, p.2)

## Details

_TODO: 프로토콜 라운드 구조·signing ceremony 참여자 수·refresh 메커니즘은 별도 자료 (예: MPC-CMP whitepaper) 필요._

### Key Share 분포 모델 (Stage 5에서 확정)

`recovery-passphrase.md`, p.1 (인용):
> "Fireblocks uses the recovery passphrase to create an encrypted backup of the mobile device's private key share, which is stored securely in Fireblocks' cloud servers."

이로써 다음이 확정된다:

```
MPC key share 분포
  │
  ├── Primary host: User's mobile device (secure enclave)
  │   ├── Hardware-encrypted
  │   ├── No iCloud / Google Cloud backup
  │   └── Source: user-roles.md p.1; about-the-fireblocks-mobile-app.md p.1
  │
  ├── Backup: Fireblocks cloud servers
  │   ├── Encrypted with: Recovery passphrase (user-held)
  │   ├── Created at: initial user setup (Owner/Admin/Signer 필수)
  │   ├── Used in: 3 recovery scenarios + Verify Passphrase
  │   └── Source: recovery-passphrase.md p.1
  │
  ├── API user side: Co-signer key share
  │   ├── Pairing via API Co-signer + Callback Handler
  │   ├── Owner가 별도 승인
  │   └── Source: re-enrolling-api-users.md p.1 (Stage 4)
  │
  └── Owner-managed: Workspace Keys Backup (= Recovery package)
      ├── Created by Owner
      ├── Methods: offline / third-party DRS
      └── Source: workspace-keys-backup.md entity
```

이는 Stage 2 `delete-users.md` p.1의 "Fireblocks deletes the user's cloud-based key shares"의 정확한 의미를 명확히 한다: cloud-based = recovery passphrase로 encrypted된 backup. 사용자 삭제 시 Fireblocks가 이를 폐기.

→ Q-2026-05-18-M03 **부분 ANSWERED** (cloud의 정확한 구성 단계 확정; threshold 참여 가능성은 Q-D04로 후속 추적).

### MPC key share derivation (Stage 2~5 누적)

- Add user 시점 (`add-users.md`, p.1, Stage 2): signing role의 새 user는 Owner가 **MPC device key share derivation** 별도 승인
- Re-enroll 시점 (`re-enroll-a-users-mobile-device.md`, p.1, Stage 3): 2-day window × 2단계 (Owner 재승인 → 사용자 재등록)
- Device migration (`device-migration.md`, p.2, Stage 5): **관리자 승인 없이** 사용자 본인이 export/import (PIN+passphrase+biometric 3중 인증)
- Co-signer 페어링 (`re-enrolling-api-users.md`, p.1, Stage 4): Owner가 Co-signer key shares 승인

→ MPC key share의 lifecycle 이벤트마다 인증 강도가 다름 — Owner 단독 / Owner+Quorum / 사용자 본인 self-service 세 패턴.

### Recovery Scenarios (Stage 5에서 명세)

`recovery-passphrase.md`, p.3–4:

| Scenario | 사용 자산 | 사용처 |
|---|---|---|
| Owner key share recovery | Recovery passphrase (또는 password-less) | Owner device 분실/새 디바이스 |
| Admin/Signer key share recovery | **다른 authorized signer의** recovery passphrase | Admin/Signer device 분실 (e.g., 자연재해, OS 문제) |
| Workspace Keys Recovery | Recovery passphrase + Workspace Keys Backup | Owner가 full private key 재구성 |

세 번째 scenario는 [[entities/fireblocks/workspace-keys-backup]]와 결합되어 작동.

### Periodic Passphrase Verification (Stage 5)

`recovery-passphrase.md`, p.2–3:

- 월 1회 알림, Owner/Admin/Signer 대상
- `Settings > Verify recovery passphrase` — cloud에서 backup download하여 decrypt 시도
- 3회 실패 시 5분 lockout
- Risk assessment via workspace audit logs (Owner/Admin이 검토)

이는 cloud backup의 사용 가능성을 사전 검증하는 일상 운영 메커니즘 — 실제 recovery 시점이 아닌 사전 verification.

## Related Pages

- [[vendors/fireblocks/architecture]]
- [[vendors/fireblocks/cosigner]]
- [[vendors/fireblocks/risks]]
- [[vendors/fireblocks/mobile-app]] — Secure enclave host, Key material 업데이트 흐름
- [[entities/fireblocks/mpc-key-share]] — Entity 단위 정의
- [[entities/fireblocks/recovery-passphrase]] — Cloud backup 암호화 키
- [[entities/fireblocks/workspace-keys-backup]] — Owner-managed DR 자산
- [[entities/fireblocks/mobile-device]] — Primary host
- [[entities/fireblocks/api-co-signer]] — Co-signer 측 key share
- [[docs/architecture/krw-stablecoin-architecture-reference]] — 원화 스테이블코인 MPC-TSS 3주체 키분산과 3-cloud 분할 대비 (Stage 45)

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1, p.5
- `2026-05-18__support-fireblocks-io__about-the-fireblocks-mobile-app.md`, p.1–2 (Stage 5: MPC-CMP 명시, secure enclave host)
- `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.1–4 (Stage 5: cloud backup 모델, 3 recovery scenarios)
- `2026-05-18__support-fireblocks-io__add-users.md`, p.1 (Stage 2: derivation 별도 승인)
- `2026-05-18__support-fireblocks-io__delete-users.md`, p.1 (Stage 2: cloud key share 삭제)
- `2026-05-18__support-fireblocks-io__re-enroll-a-users-mobile-device.md`, p.1 (Stage 3: 2-day windowing)
- `2026-05-18__support-fireblocks-io__device-migration.md`, p.2 (Stage 5: self-service migration)
- `2026-05-18__support-fireblocks-io__re-enrolling-api-users.md`, p.1 (Stage 4: Co-signer pairing)

## Stage 8 — MPC-CMP 정식 명세 (Q-M01 ANSWERED, Q-D04 ANSWERED, Q-M04 partial)

`mpc-cmp.md` + `authentication-and-authorization.md` + `security-aspects-signing-with-the-fireblocks-mobile-app.md` + `fireblocks-cloud-architecture.md` (Stage 8 ingest):

### Protocol 명세
- **MPC-CMP** = Canetti, Makriyannis, Peled — *UC Non-Interactive, Proactive, Threshold ECDSA* 기반 (NIST 2020 / ACM CCS 2020)
- **ECDSA + EdDSA** 양쪽 지원
- **4 rounds (3 pre-processed) vs GG18 의 8 rounds → 800% faster**
- 마지막 라운드 **QR offline 가능** → true air-gapped wallet
- **Universally composable**, proactive security, accountability (bad-party identification)
- **Additive Secret Sharing** (= Shamir t=n) — share 조합은 simple addition만, **perfect secrecy**, "the secret itself never exists"

### Threshold 구조 (Q-D04 ANSWERED)
- **Within-group**: 3/3 (1 customer-side + 2 Fireblocks cloud)
- **Across-group**: 1/N OR (각 Admin/Signer 가 자체 3-share set 보유)
- 모든 signing user 의 set 은 **Owner 의 set 에서 derived**

### Key Generation Security
- **HRNG (Intel RDRAND)**, **NIST SP 800-90A 준수**
- Hardware-isolated component 내 randomize
- Generation 실패 시 key 미생성 (atomicity)
- 예외: Workspace Key Backup — encrypted recovery package (cloud backup 의 정체)

### Authentication / Token Architecture
- **Root Key** (Core Services 의 CA) → **Intermediate Cert** → **Co-Signer End Cert** chain of trust
- Mobile device:
  - **Activation token** (7 day, configurable)
  - **Refresh token** (mobile **KeyChain** 저장)
  - **Access token** (6 hour)
- Co-Signer:
  - Co-signer 자체 priv/pub key pair
  - CSR → Core Services → Intermediate Cert 로 서명 → end cert
  - Co-signer private key 는 Co-Signer Configuration DB 에 보관

### Two Co-Signing Components (Q-C01 partial)
- **Customer**: mobile device (iOS Keychain / Android TEE) 또는 SGX server
  - Mobile auth: PIN + (biometric OR Yubikey NFC)
- **Fireblocks**: SGX server co-signers
  - Policy enforcement (tx amount threshold, destination integrity)
  - "**Safeguards in case keys owned by customers are compromised**"

### Cloud Architecture (Q-M03 ANSWERED)
- **Azure**: core + SGX confidential enclaves (key shares + configs + policy rules + API credentials)
- **AWS**: gateway + frontend (no secrets)
- **GCP Firebase**: Console + mobile caching DB
- 2 Fireblocks cloud co-signers + 1 customer = 3-of-3
- Customer 측은 mobile / customer cloud / customer on-prem 3가지 옵션

### Hosted MPC Variant (`hosted-mpc-overview.md` Stage 8)
- Default SaaS MPC: 1 customer + 2 Fireblocks
- **Hosted MPC**: 1 Primary Co-Signer + **2 Guard Co-Signers** (모두 customer 호스팅) — Fireblocks 0 key shares
- 동기: regulatory compliance, internal policies, end-user 요건
- SGX Co-Signers 필수
- BCM 으로 disaster continuity 보완

**Sovereign key management framing** (Stage 22 보강):

`hosted-mpc-overview.md` p.1 직접 인용: "**completely control the MPC key shares** by hosting all three Co-Signers in your own environment." → SaaS MPC 의 **vendor partial-trust** (Fireblocks 가 2/3 share 보유 + safeguard policy 적용) 모델과 대비되는 **customer ownership axis**. Hosted MPC 에서 Fireblocks 는 cryptographic ceremony 에 참여하지 않으며, signing 전체가 customer 환경에서 실행.

**Hosted MPC 시리즈 (TIER 3 placeholder)**:

본 wiki 는 Hosted MPC Overview 만 deep ingest. sub-series 3건 (`Hosted MPC Customer-Side Setup` / `Hosted MPC Workspace Configuration` / `Hosted MPC Backup and Recovery`) 는 Source Lake placeholder — Open Q-S09 (DR 절차) / Q-S10 (도입 threshold) 응답 시 promote 후보.

## Related Pages (추가)

- [[entities/fireblocks/csr]] — co-signer end certificate chain
- [[entities/fireblocks/2fa]] — Yubikey 옵션

## Open Questions

- ~~Q-2026-05-18-M01~~ — **ANSWERED** (Stage 8: MPC-CMP 정식 명세 확보)
- Q-2026-05-18-M04 — Key share derivation cryptographic 메커니즘 (Owner set → user set derivation 절차)
- ~~Q-2026-05-18-D04~~ — **ANSWERED** (Stage 8: 3/3 within-group + 1/N OR across-group, Fireblocks 가 2 cloud share 보유함은 명시되었으나 decryption 가능성은 미언급 — Fireblocks 는 individual share 만 보유, full key 재구성 불가가 protocol 핵심)
