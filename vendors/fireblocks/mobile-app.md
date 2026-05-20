# Fireblocks — Mobile App

> Fireblocks mobile app 제품 전반: About / 인증·요구사항 / Updates / 승인 범위 / Labs(Batch) / New UX. Mobile device 자체의 사전 정의는 [[entities/fireblocks/mobile-device]] 참고.

## Summary

Fireblocks mobile app은 **secure transaction approval + MPC-CMP signing 워크플로우 + key workspace governance actions**의 동시 호스트다 (source: `about-the-fireblocks-mobile-app.md`, p.1). 두 가지 목적:

1. **사용자 액션 수행 평면**: 승인·서명 권한이 있는 user가 mobile device에서 액션 완료
2. **MPC key share 호스트**: 각 device의 secure enclave에 MPC-CMP key share 보관

대체 옵션으로 **API Co-Signer**가 존재하며, 자동화 운영에 사용된다 (`about-the-fireblocks-mobile-app.md`, p.2).

## Key Concepts

- **Secure enclave + hardware-encrypted** — iCloud/Google Cloud 백업 불가 (`about-the-fireblocks-mobile-app.md`, p.1)
- **3 비밀 layer**: 6-digit PIN / mobile app passphrase / recovery passphrase ([[entities/fireblocks/mobile-device]] §"3 비밀 layer" 참조)
- **2 인증 method**: built-in (fingerprint / face) / external (Yubikey) (`mobile-authentication-methods.md`, p.1)
- **OS 최소 요구**: Android 8.1+ (64-bit) / iOS 16.6+ (non-jailbroken) + biometric 필수 (`mobile-device-minimum-requirements.md`, p.1)
- **Foreground-only updates**, key material 업데이트 시 PIN + biometric + recovery passphrase (`fireblocks-mobile-app-updates.md`, p.2)
- **3 비가역성**: iCloud restore / uninstall+reinstall / 새 biometric ID 추가 모두 불가 (`about-the-fireblocks-mobile-app.md`, p.1)
- **Labs feature**: Batch Approvals & Signing (`batch-approvals-and-signing.md`)
- **New UX (v3.4.0+)**: All / Transactions / Administration views + multi-tenant (`new-mobile-experience-request-management.md`, p.1)

## Details

### About (개요)

Mobile app은 두 가지를 동시 수행 (`about-the-fireblocks-mobile-app.md`, p.1):
- 트랜잭션 승인·서명의 사용자 액션 면
- MPC-CMP key share의 secure enclave 호스트

**Cloud 백업 분리**: secure enclave에 보관되는 key share는 iCloud / Google Cloud로 자동 백업되지 않는다. 단 [[entities/fireblocks/recovery-passphrase]]로 암호화된 별도 backup이 Fireblocks 자체 cloud servers에 저장되며, 이는 사용자가 명시적으로 생성한 self-managed 백업 (`recovery-passphrase.md`, p.1).

**비가역성 경고** (`about-the-fireblocks-mobile-app.md`, p.1):
- ❌ Restore from iCloud
- ❌ Uninstall → re-install → workspace 재연결 (Owner 또는 Support 개입 필요)
- ❌ 새 biometric ID 추가 후 재진입

**Owner가 uninstall한 경우** 별도 Key Share Recovery 절차 필요 (`about-the-fireblocks-mobile-app.md`, p.2).

대체 옵션: **API Co-Signer** ([[entities/fireblocks/api-co-signer]], [[vendors/fireblocks/cosigner]] 참조).

### Minimum requirements (`mobile-device-minimum-requirements.md`, p.1)

| 항목 | Android | iOS |
|---|---|---|
| OS | 8.1+ (64-bit) | 16.6+ |
| Store | Google Play | App Store |
| 인증 | Yubikey / 지문 / 안면 | Yubikey / Touch ID / Face ID |
| 기타 | — | non-jailbroken |

- **모든 디바이스에 biometric 필수**
- iOS 11.0–14.0: 동작하나 업데이트 불가
- Cold Wallet은 별도 앱

### Mobile authentication methods (`mobile-authentication-methods.md`, p.1)

**Built-in**: device fingerprint scanner, facial recognition.

**External**: **Yubikey** (alternative to built-in).

> 본 자료에서 WebAuthn / FIDO2 직접 언급은 없음. Yubikey 자체가 FIDO2 hardware key이지만 명시적 확인은 미해소 — [[open-questions/fireblocks]] Q-AU04.

### App updates (`fireblocks-mobile-app-updates.md`, p.1–2)

**Update scenarios**: features / bug fixes / compatibility (grace period 제공).

**Update process**:
- Foreground-only — background update 없음
- "Current vs Effective version" — SaaS가 effective version 결정
- Auto-update 권장

**Key material 업데이트 시 인증**: PIN + biometric + **recovery passphrase** 모두 요구 (`fireblocks-mobile-app-updates.md`, p.2).

### 승인 범위 — What gets approved through the app

`fireblocks-mobile-app-signing-and-approving.md`, p.2–3:

**Transaction signing**:
- Transfers
- Contract calls
- Minting and burning
- Staking
- Typed and raw messages

**Connection approvals**:
- New exchange accounts
- New fiat accounts
- New Fireblocks P2P Network connections / routing changes
- New whitelisted addresses

**Workspace settings**:
- Enabling one-time address transactions
- "Approve" transactions — amount cap
- Transaction Policy changes
- Adding new users
- Updating the admin quorum

**Owner-only**: MPC keys for new signing users.

**Multi-user flow**: deny 시 모든 관련 user에게서 request 제거 (`fireblocks-mobile-app-signing-and-approving.md`, p.3).

**기본 flow**: `View → Approve/Deny → PIN → biometric`.

**Destination expansion**: 서명 review 화면에서 exchange / whitelisted / one-time 주소만 full address 확장 표시. 다른 destination 타입은 확장 안 됨 (`fireblocks-mobile-app-signing-and-approving.md`, p.6).

### Mobile app menu (`fireblocks-mobile-app-signing-and-approving.md`, p.7–8)

- Linked Users
- Connect DeFi app (QR scanner)
- Change/reset recovery passphrase
- Send logs
- Privacy Policy
- About

### Labs: Batch Approvals & Signing

`batch-approvals-and-signing.md`, p.1–8:

- **Labs feature, Owner-only enablement** (`Settings > Workspaces > Labs`)
- Batch Approvals v3.4.0+ (pre-signature) — 독립 활성 가능
- Batch Signing v3.5.0+ (signing-stage) — Batch Approvals 활성 후
- **Max 10 requests / batch**, same workspace + same user, no risk-flagged
- 인증: PIN 1회 + biometric (approval-only/signing-only: 1, mixed: **2** — approval biometric 먼저)
- 취소:
  - 1st biometric (approvals): 전체 취소
  - 2nd biometric (signing, mixed only): signing만 취소, approvals 진행
- "Long processing" tag (v3.5.0+): multi-input transfers
- Failed requests → Console에서 re-initiate 필요
- **앱을 백그라운드/강제 종료하면 batch 실패 가능**

### Support Verification Request (Stage 6, gradually rolling out)

`support-verification-requests.md`, p.1–2 — 기존 user의 mobile app 알림 평면을 Fireblocks Support agent 신원 확인에 확장.

**Trigger**: Sensitive workspace operation 시 Support agent가 시작 (account recovery 등).

**흐름** (`support-verification-requests.md`, p.1):
1. Mobile app notification 수신
2. Request details + **support ticket ID** 확인
3. PIN code 표시되면 support team에게 **read it back** (Support 측 신원 확인의 일부)
4. Biometric approval
5. Support가 변경 진행

**Unexpected request** 수신 시 (p.2): mobile app reject + Support 보고.

**상태**: 점진적 rollout — 모든 고객에 가용하지 않을 수 있음 (Q-S06).

→ 자세한 보안 모델은 [[vendors/fireblocks/security]] §"Support Verification Request" / [[vendors/fireblocks/risks]] §"Phishing / Social Engineering 위험".

### New Mobile Experience: Request Management

`new-mobile-experience-request-management.md`, p.1–5. Min version **3.4.0**.

**Multi-tenant**: All Workspaces 또는 specific workspace.

**3 views**: All / Transactions / Administration.

**Sort**: Last/First initiated, USD value high/low.

**Dismiss 가능**: 타인 initiated, transaction/config 요청.
**Dismiss 불가**: 본인 initiated, **MPC operations (add user, key upgrades, re-enrollment)**, off-exchange policy, **DRS finalization**.

**Filters**: Initiated by me / Requires my approval / Signing requests.

Expired requests 자동 제거.

## Related Pages

- [[entities/fireblocks/mobile-device]] — Device entity (3 layer, lifecycle)
- [[entities/fireblocks/mpc-key-share]] — Cloud backup 모델
- [[entities/fireblocks/recovery-passphrase]] — Cloud backup 암호화 키
- [[entities/fireblocks/2fa]] — 별개 인증 평면
- [[entities/fireblocks/api-co-signer]] — Mobile app의 대체 옵션
- [[entities/fireblocks/admin-quorum]] · [[entities/fireblocks/policy]] — Mobile app에서 실제 승인
- [[vendors/fireblocks/authentication]]
- [[vendors/fireblocks/lifecycle-events]] — Mobile App-Side Lifecycle 절
- [[vendors/fireblocks/risks]] — Mobile uninstall 등 SPOF
- [[vendors/fireblocks/cosigner]]
- [[vendors/fireblocks/mpc]]

## Sources

- `2026-05-18__support-fireblocks-io__about-the-fireblocks-mobile-app.md`, p.1–3
- `2026-05-18__support-fireblocks-io__mobile-authentication-methods.md`, p.1
- `2026-05-18__support-fireblocks-io__mobile-device-minimum-requirements.md`, p.1
- `2026-05-18__support-fireblocks-io__fireblocks-mobile-app-updates.md`, p.1–2
- `2026-05-18__support-fireblocks-io__fireblocks-mobile-app-signing-and-approving.md`, p.2–8
- `2026-05-18__support-fireblocks-io__batch-approvals-and-signing.md`, p.1–8
- `2026-05-18__support-fireblocks-io__new-mobile-experience-request-management.md`, p.1–5
- (cross-ref) `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.1 (cloud backup 모델)
- `2026-05-18__support-fireblocks-io__support-verification-requests.md`, p.1–2 (Stage 6: Support verification 흐름)

## Open Questions

- Q-2026-05-18-AU04 — FIDO2/WebAuthn 명시적 지원 여부 (Yubikey는 확정)
- Q-2026-05-18-D04 — Cloud backup의 cryptographic 세부 (Fireblocks decrypt 가능성·threshold 참여 가능성)
- Q-2026-05-18-D05 — Device migration의 admin approval bypass 거버넌스
- Q-2026-05-18-D06 — Periodic Verification 30일 강제 가능성·외부 forwarding
- Q-2026-05-18-D08 — Risk-flagged transactions의 기준·종류
- Q-2026-05-18-P04 — "Approve" amount cap / one-time address enable 등 settings 정의
- Q-2026-05-18-P05 — "Long processing transfers" (multi-input) 정의
- Q-2026-05-18-O04 — Off-exchange policy / DRS finalization 흐름
- Q-2026-05-18-S06 — Support verification request rollout 일정·범위
