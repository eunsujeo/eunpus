---
type: entity
vendor: fireblocks
status: stable
tags: [authentication, identity]
stage_introduced: 1
last_updated_stage: 171
source_count: 15
related:
  - 2fa
  - admin-quorum
  - console-user
  - lifecycle-events
  - mpc-key-share
  - owner
  - sandbox-workspace
  - user
  - user-management
---
# Entity: Mobile Device

## Summary

Fireblocks mobile app이 동작하는 사용자의 모바일 디바이스. 동시에 **MPC key share host**, **2FA TOTP secret host**(추정), **mobile app passphrase/6-digit PIN host**로 기능하며 — workspace의 서명·승인·인증을 위한 물리적 단일 자산이다. 디바이스의 lifecycle 이벤트(앱 재설치·새 디바이스·biometric 변경·PIN 분실)는 **재등록 절차**를 트리거하며, **signing role 사용자의 경우 Owner의 MPC key share 재승인을 2일 윈도우 내에 요구**한다 (source: `2026-05-18__support-fireblocks-io__re-enroll-a-users-mobile-device.md`, p.1).

## Key Concepts

- **3중 호스트 역할**:
  - **Fireblocks mobile app** + **6-digit PIN** (`re-enroll-a-users-mobile-device.md`, p.1)
  - **Mobile app passphrase** — role별 요구 여부 다름. 권한표 *Require a Fireblocks mobile app passphrase*: Owner/Admin/Signer/Security Admin ✓ (`user-roles.md`, p.5)
  - **MPC key share** — Owner가 device 단위로 provisioning 승인 (`user-roles.md`, p.1; `add-users.md`, p.1)
  - **2FA TOTP authenticator app** — 별도 앱이지만 통상 같은 디바이스에 설치 (`manage-your-2fa.md`, p.1)
- **Linked users / linked workspaces**: 한 디바이스에 여러 user 또는 여러 workspace가 link될 수 있음 (`re-enroll-a-users-mobile-device.md`, p.1). 각각 별도 재등록 필요.
- **권한표상 mobile app 요구**: Owner / Admin / NSA / Signer / Approver / Security Admin이 ✓; Editor / Viewer / Security Auditor는 ✕ (`user-roles.md`, p.5)
- **6-digit PIN과 mobile app passphrase**의 관계는 본 자료에 명시 없음 → Q-2026-05-18-D01

## Details

### 재등록 (Re-enroll) 흐름

**Trigger** (`re-enroll-a-users-mobile-device.md`, p.1):

- 디바이스 biometric 설정 변경
- Fireblocks mobile app 제거
- 새 디바이스에 mobile app 설치
- **6-digit PIN 분실**

**Actor**: "Admin-level users" (Stage 2~4 동일 표현; Q-L01·A01 추적)

**절차** (`re-enroll-a-users-mobile-device.md`, p.1):

1. Console에서 `Settings > Users > ⋮ > Re-enroll mobile device`
2. Owner에게 approval request 전송
3. Owner 승인 후 사용자가 Console 로그인 → 화면의 **QR 코드**를 mobile app으로 스캔 → in-app instructions 따라 완료

**Linked users 처리**: "If other users or workspaces are linked to the device, they must each be re-enrolled individually" (`re-enroll-a-users-mobile-device.md`, p.1) — 한 디바이스의 lifecycle event가 N개의 재등록을 유발 가능.

### Signing role 사용자의 2-day × 2단계 윈도우

`re-enroll-a-users-mobile-device.md`, p.1 — signing 가능한 role을 가진 사용자의 device 재등록 시:

1. 사용자가 device 재등록 완료
2. **Owner가 2일 내**에 새 MPC key shares 재승인
3. Owner 승인 후 **사용자가 2일 내**에 MPC registration 완료

각 단계의 만료 시 동작은 본 자료에 명시 없음 → Q-2026-05-18-D03.

### Owner 본인 디바이스의 특수성

**Owner의 device 재등록은 Console에서 불가 → Fireblocks Support 경유**. 다른 workspace의 Owner라도 동일 (`re-enroll-a-users-mobile-device.md`, p.1).

이는 Stage 1 자료(`user-roles.md`, p.2)의 "When the Owner wants to … migrate to a new mobile device, … they must first verify their identity with Fireblocks Support via a short video call"과 정합.

### 권한표상 모바일 요구 분포

`user-roles.md`, p.5 *User management* 표 첫 행 *Require the Fireblocks mobile app*:

| Role | Require mobile app | Require passphrase |
|---|---|---|
| Owner | ✓ | ✓ |
| Admin | ✓ | ✓ |
| Non-Signing Admin | ✓ | ✕ |
| Signer | ✓ | ✓ |
| Approver | ✓ | ✕ |
| Editor | ✕ | ✕ |
| Viewer | ✕ | ✕ |
| Security Auditor | ✕ | ✕ |
| Security Admin | ✓ | ✓ |

**MPC 키 미보유 role(NSA, Approver, Security Admin)도 mobile app은 요구** — 승인 액션을 mobile에서 수행하기 때문.

### Sandbox에서의 차이

Sandbox workspace는 **모바일 서명 디바이스 불필요**, 모든 트랜잭션 auto-approve (`user-roles.md`, p.8). 즉 본 entity의 거의 모든 메커니즘이 Sandbox에서는 무효화된다.

## Related Pages

- [[entities/fireblocks/mpc-key-share]] — device에 host되는 key share
- [[entities/fireblocks/2fa]] — TOTP secret이 함께 호스트되는 평면
- [[entities/fireblocks/console-user]] — mobile app을 사용하는 user 종류
- [[entities/fireblocks/user]] — lifecycle (device 재등록 포함)
- [[entities/fireblocks/user-roles/owner]] — 본인 device는 Support 경유
- [[entities/fireblocks/admin-quorum]] — 권한표 *Re-enroll devices* `Y (Q)` 행
- [[entities/fireblocks/sandbox-workspace]] — mobile 불필요
- [[vendors/fireblocks/lifecycle-events]] — Mobile Device lifecycle 절
- [[vendors/fireblocks/user-management]] — 권한 매트릭스

## Sources

- `2026-05-18__support-fireblocks-io__re-enroll-a-users-mobile-device.md`, p.1
- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1, p.2, p.5, p.8
- `2026-05-18__support-fireblocks-io__add-users.md`, p.1 (MPC key share device 단위 승인)
- `2026-05-18__support-fireblocks-io__manage-your-2fa.md`, p.1 (TOTP app 공존)
- `2026-05-18__support-fireblocks-io__about-the-fireblocks-mobile-app.md`, p.1–2 (Stage 5: secure enclave, no iCloud, 3 비가역성)
- `2026-05-18__support-fireblocks-io__mobile-authentication-methods.md`, p.1 (Stage 5: built-in / Yubikey)
- `2026-05-18__support-fireblocks-io__mobile-device-minimum-requirements.md`, p.1 (Stage 5: OS/HW 최소 요구)
- `2026-05-18__support-fireblocks-io__device-migration.md`, p.1–2 (Stage 5: self-service migration, 3 layer 인증 직접 확인)
- `2026-05-18__support-fireblocks-io__linked-users-fireblocks-mobile-app.md`, p.1–2 (Stage 5: multi-user/workspace 모델)
- `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.1–2 (Stage 5: cloud backup, user별 독립)
- `2026-05-18__support-fireblocks-io__fireblocks-mobile-app-updates.md`, p.1–2 (Stage 5: foreground updates, key material 3 layer)
- `2026-05-18__support-fireblocks-io__fireblocks-mobile-app-signing-and-approving.md`, p.7–8 (Stage 5: app menu)
- `2026-05-18__support-fireblocks-io__re-adding-a-user-to-the-fireblocks-mobile-app.md`, p.1 (Stage 5)
- `2026-05-18__support-fireblocks-io__support-verification-requests.md`, p.1–2 (Stage 6: Support agent verification 평면)

## Stage 5에서 추가된 평면 — 3 비밀 Layer

`device-migration.md`, p.2의 export 절차에서 PIN + passphrase + biometric이 모두 별도 입력 — 세 비밀이 별개 layer 직접 확인.

| Layer | 역할 | 입력 시점 |
|---|---|---|
| **6-digit PIN** | Mobile app 로컬 잠금 / 액션 인증 | 앱 진입, 승인·서명, 재등록, migration export/import |
| **Mobile app passphrase** | Role별 요구 (O/A/Signer/SecAdmin 권한표 ✓) | 권한표 (`user-roles.md`, p.5) |
| **Recovery passphrase** | Cloud backup 암호화 + recovery 시 verify | Initial setup, Reset (mobile app), Migration, Key material 업데이트 |

키 material 업데이트 시 **3 layer 모두 입력 요구**: PIN + biometric + recovery passphrase (`fireblocks-mobile-app-updates.md`, p.2).

## Secure Enclave & Cloud Backup 모델 (Stage 5)

`about-the-fireblocks-mobile-app.md`, p.1:

- MPC key share는 device의 **secure enclave**에 hardware-encrypted
- **iCloud / Google Cloud 백업 불가**
- 별도 cloud backup은 Fireblocks 자체 cloud servers에 **recovery passphrase로 encrypted** (`recovery-passphrase.md`, p.1)

**3 비가역성**:
- Restore from iCloud ❌
- Uninstall → re-install → workspace 자체 재연결 ❌
- 새 biometric ID 추가 후 재진입 ❌

**Owner uninstall** → Key Share Recovery 절차 필요 (`about-the-fireblocks-mobile-app.md`, p.2).

## Mobile Authentication Methods (Stage 5)

`mobile-authentication-methods.md`, p.1:

- **Built-in**: fingerprint / facial recognition
- **External**: **Yubikey** (alternative)

## Minimum Requirements (Stage 5)

`mobile-device-minimum-requirements.md`, p.1:

| | Android | iOS |
|---|---|---|
| OS | 8.1+ (64-bit) | 16.6+ |
| Store | Google Play | App Store |
| 인증 | Yubikey / fingerprint / face | Yubikey / Touch ID / Face ID |
| 기타 | — | non-jailbroken |

Biometric 필수. iOS 11.0–14.0: 동작하나 업데이트 불가. Cold Wallet은 별도 앱.

## Device Lifecycle Events (통합)

| Event | Stage | Actor | 승인 | 핵심 인증 |
|---|---|---|---|---|
| Initial pairing | Stage 1–2 | User + Owner | Owner | PIN setup + biometric + recovery passphrase 생성 |
| Re-enroll (admin-driven) | Stage 3 | "Admin-level users" | Owner (+MPC 2-day for signing) | QR scan |
| **Migration (self-service)** | **Stage 5** | User in mobile app | **없음** (Owner pre-enabled) | Old: PIN+passphrase+biometric / New: new PIN+biometric+passphrase / QR 1h |
| **Re-add via mobile app** | Stage 5 | User | (mobile app 액션) | mobile app remove → Console re-register |
| Owner own device | All | Fireblocks Support | Support video call | 영상 통화 |

## Linked Users / Workspaces (Stage 5)

`linked-users-fireblocks-mobile-app.md`, p.1–2 + `recovery-passphrase.md`, p.2:

- 한 device가 multiple users / workspaces 호스트 가능
- Mobile app `Linked Users`: view / add (+QR+PIN) / remove
- **Remove 시 알림 없음**
- User별 cryptographic 독립: 각자 다른 recovery passphrase 가능 (Verify 결과 user별 다름)

## App Updates 동작 (Stage 5)

`fireblocks-mobile-app-updates.md`, p.1–2:

- **Foreground-only**
- Current vs Effective version
- Key material 업데이트 시 PIN + biometric + recovery passphrase

## Mobile App Menu (Stage 5)

`fireblocks-mobile-app-signing-and-approving.md`, p.7–8: Linked Users / Connect DeFi app / Change-reset recovery passphrase / Send logs / Privacy Policy / About.

## Support Verification Request 평면 (Stage 6)

`support-verification-requests.md`, p.1–2 — Mobile device의 notification 평면이 Fireblocks Support agent 신원 확인에도 확장 (점진적 rollout):

- Sensitive Support op 시 Support agent가 verification 시작
- Mobile app notification에 **support ticket ID** + PIN code (해당 시) 표시
- 사용자는 support team에게 **PIN read-back** → biometric approval
- Unexpected request 수신 시 reject + 보고

자세한 보안 모델은 [[vendors/fireblocks/security]] §"Support Verification Request".

## Stage 8 — Mobile Device 의 두 종류 키 분리 (★)

`security-aspects-signing-with-the-fireblocks-mobile-app.md`, p.1-2:

Mobile device 의 secure environment (iOS Secure Enclave / Android TEE) 안에 **두 종류의 키**가 분리 보관:

| Key | 목적 | 사용 액션 |
|---|---|---|
| **Private MPC-CMP key share** | Transaction signing | Owner/Signer/Admin |
| **Configuration key** | Workspace 설정 / policy 변경 / 사용자 추가 등 **Admin Quorum approval** | (Admin Quorum 참가 role) |

→ 즉 mobile device 는 **signing plane** (MPC share) 과 **governance plane** (config key) 두 평면의 단일 호스트. 둘 다 secure environment 안에서 평문 추출 불가.

## Stage 8 — Token Lifecycle on Device (`authentication-and-authorization.md`, p.2)

- **Activation token**: Core Services 발급, **7 days (configurable)**, QR 로 mobile 에 전달
- **Refresh token**: mobile app 이 activation 을 swap 하여 받음, **mobile KeyChain** 에 저장
- **Access token**: refresh 를 swap, **6 hours** 유효
- Preprocessing > 6h → refresh token 으로 새 access token 재발급

## Stage 8 — Auth Layer 공식 명세 (Q-D01 재확정)

`security-aspects-signing-with-the-fireblocks-mobile-app.md`, p.2:
- **"Something you remember"**: 6-digit PIN code
- AND either:
  - **"Something you are"**: fingerprint / face ID
  - OR **"Something you have"**: Yubikey NFC

→ Console (2FA at login) 과 Mobile (biometric/Yubikey **every action**) 이 별도 plane 임이 명시. Mobile 은 매 액션마다 강제.

## Stage 8 — Distributed Signing on Device (★)

`security-aspects-signing-with-the-fireblocks-mobile-app.md`, p.3-4 + `mpc-cmp.md`, p.5-7:

Signing ceremony 중 mobile device 의 동작:
1. Designated Signer 의 mobile app 알림 수신
2. tx 검토 + PIN + biometric 인증
3. **Cloud-based mediator** 가 mobile 의 1 share + 클라우드의 2 share 검증
4. "**The mobile device does not directly communicate with the cloud servers hosting the other key shares.**"
5. **3 shares 가 individually, one after another 로 서명** (never combined in one place)

## Stage 8 — Biometric Data 처리

`security-aspects-signing-with-the-fireblocks-mobile-app.md`, p.5:
- Fireblocks app 은 **biometric 데이터 저장 안 함**
- 데이터는 device 의 secure environment (Secure Enclave / TEE) 에만
- Biometric 변경 → 다음 액션 시 에러 → **Owner = recovery / Signer-Approver = re-enroll**

## Stage 8 — Yubikey Setup (`fireblocks-yubikey-authentication.md`, p.1-8)

- Mobile app 의 biometric 대안, **Yubico OTP mode**
- Public Identity (1-16 bytes Modhex) + Private Identity (6 bytes Hex) + Secret Key (16 bytes Hex)
- CSV 를 **Fireblocks Support PGP 키로 암호화** (RSA 3072, fingerprint `434A2601D7929FA499D4C058E0710CC2AC26A43D`)
- 지원 모델: 5C NFC, 5 NFC, 5C NFC FIPS, 5 NFC FIPS (iOS+Android), 5Ci/5Ci FIPS (Android only)
- **Owner 가 Yubikey 채택 시 후속 사용자 전체 강제 전파**

## Sources (추가)
- `2026-05-18__support-fireblocks-io__security-aspects-signing-with-the-fireblocks-mobile-app.md`, p.1-5 (Stage 8: 두 키 분리 + 3-share signing + biometric)
- `2026-05-18__support-fireblocks-io__authentication-and-authorization.md`, p.2 (Stage 8: token lifecycle on device)
- `2026-05-18__support-fireblocks-io__mpc-cmp.md`, p.5-7 (Stage 8: distributed signing, mobile primary)
- `2026-05-18__support-fireblocks-io__fireblocks-yubikey-authentication.md`, p.1-8 (Stage 8: Yubikey setup, Owner-level enforcement)

## Open Questions

- ~~Q-2026-05-18-D01~~ — **ANSWERED (Stage 5)**: PIN / passphrase / recovery passphrase 별개 layer
- Q-2026-05-18-D02 — 부분 답 (Stage 5): UI 명확, user별 cryptographic 독립 확정. 디바이스 compromise 시 전체 영향 범위는 미명세
- Q-2026-05-18-D03 — 2-day window 만료 시 동작 (Stage 3)
- Q-2026-05-18-D05 — Device migration의 admin approval bypass 거버넌스 (Stage 5)
- ~~Q-2026-05-18-AU04~~ — **ANSWERED (Stage 8)**: Yubikey + biometric 두 옵션 명세. FIDO2/WebAuthn 은 명시 안 됨 — Yubico OTP mode 사용
- ~~Q-2026-05-18-M02~~ — **ANSWERED (Stage 8)**: 3-endpoint signing 모델 (1 mobile + 2 cloud, cloud-based mediator)

## Stage 171 — Cold Wallet 기기 등록과 오프라인 전환

Cold Wallet 전용 iOS 기기는 다음 절차로 등록해 오프라인으로 전환한다.

1. Owner 기기를 Signer 기기보다 먼저 구성한다.
2. 새 iOS 기기를 Apple Configurator의 Supervised Mode로 준비하고 MDM에는 enroll하지 않는다. Cold Wallet 기기에는 SIM card도 설치하지 않는다.
3. 초기 설정과 Cold Wallet app 다운로드, workspace 등록, Signer의 signature pre-processing 단계에서는 인터넷 연결을 사용한다.
4. Owner 기기는 등록을 마친 뒤, Signer 기기는 signature pre-processing까지 마친 뒤 각각 Apple ID에서 로그아웃하고 Bluetooth·Wi-Fi를 끈 다음 Airplane Mode를 켠다.
5. 재시작 후에도 Bluetooth와 Wi-Fi가 꺼져 있도록 제한 profile을 적용하고 해당하는 기기·iOS version에는 Single App Mode를 적용한다.

Signer 기기의 signature pre-processing은 MPC-CMP 통신 4 round 중 처음 3 round를 미리 완료한다. 실제 거래에서는 마지막 round를 QR 스캔으로 완료한다.

출처: `sources/fireblocks/source-notes/cold-wallet-operating-model.md` (`FB-CW-03`, `FB-CW-04`, Stage 171)
