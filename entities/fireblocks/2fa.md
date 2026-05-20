# Entity: 2FA (Two-Factor Authentication)

## Summary

Fireblocks Console 로그인에 **모든 사용자가 필수**로 요구되는 2차 인증. **TOTP (Time-based One-Time Password)** 기반이며 Google / Microsoft / LastPass / Yubico Authenticator 등 임의의 TOTP 앱 사용 가능 (source: `2026-05-18__support-fireblocks-io__manage-your-2fa.md`, p.1).

## Key Concepts

- **모든 Console user 필수** (`manage-your-2fa.md`, p.1)
- TOTP만 명시 — WebAuthn / FIDO2 / hardware key 지원 여부 본 자료에 없음 → Open Question
- 6-digit code, time-sensitive — 시간 동기화 필요 (`manage-your-2fa.md`, p.1)
- **Reset 권한**: Owner와 Security Admin (`user-roles.md`, p.5 — *Reset 2FA*)
  - 본인은 Owner나 Security Admin에 요청 (`manage-your-2fa.md`, p.1)
  - Workspace Owner 본인의 2FA는 Fireblocks Support 경유 (cross-ref `reset-a-users-2fa` 본 위키 자료 미수집; Stage 3 예정)

## Details

### Setup

1. TOTP authenticator app 설치
2. Fireblocks Console Login 페이지에서 로그인 → 2FA QR 표시
3. App으로 QR 스캔
4. 6-digit code 입력 (`manage-your-2fa.md`, p.1)

이후 로그인 시마다 6-digit code 요구.

### Reset (디바이스 분실 시)

본인 reset 불가. workspace Owner에게 요청 → Owner reset → 확인 이메일 → 다시 로그인하여 setup 반복 (`manage-your-2fa.md`, p.1).

### Admin-perspective reset 흐름 (Stage 3)

`reset-a-users-2fa.md`, p.1 — admin-perspective 동작:

- **Workspace Owner**가 다른 user의 2FA reset 가능. 본문은 Owner만 명시; 권한표(`user-roles.md`, p.5)는 Owner와 Security Admin ✓ (본문/표 불일치는 Q-L02 패턴)
- 절차: `Settings > Users > ⋮ > Reset 2FA`
- 사용자에게 확인 메일 발송 → 사용자가 재로그인하여 2FA 앱 재설정
- **로그인 email/password는 변경되지 않음** — 2FA secret만 무효화

### Owner 본인의 2FA reset

**Console 불가 → Fireblocks Support 경유** (`reset-a-users-2fa.md`, p.1; `manage-your-2fa.md`, p.1).
SSO 사용자가 Fireblocks 접근을 잃은 경우에도 Owner에게 2FA reset 요청이 유일 경로 (`reset-your-password.md`, p.1).

### Migration (구→신 디바이스, 구 디바이스 접근 가능 시)

Authenticator app의 **export/transfer feature** 사용 (`manage-your-2fa.md`, p.2):

1. 구 디바이스에서 export/transfer로 QR 생성 (예: Google Authenticator의 *Transfer accounts > Export accounts*)
2. 신 디바이스의 동일 app에서 QR 스캔
3. 신 디바이스의 코드로 로그인하여 setup 확인

구 디바이스 접근 불가 시 → Owner reset 필요 (`manage-your-2fa.md`, p.2).

### SSO와의 관계

SSO 사용 시에도 2FA는 별도로 필요 — SSO는 1차 authentication만 다룬다 (`configure-sso.md`, p.1). password를 잃은 SSO user는 Fireblocks 대신 **Owner에게 2FA reset을 요청**한다 (`reset-your-password.md`, p.1).

### Mobile Authentication Methods와의 분리 (Stage 5)

본 entity는 **Console 로그인의 2차 인증** (TOTP). 별개 평면으로 mobile app의 **device-level 인증**이 존재한다 (`mobile-authentication-methods.md`, p.1):

- **Built-in**: device fingerprint / facial recognition
- **External**: Yubikey

→ Mobile authentication methods는 [[entities/fireblocks/mobile-device]]에서 다룬다. 두 평면을 혼동하지 않는다.

## Related Pages

- [[entities/fireblocks/sso]]
- [[entities/fireblocks/console-user]]
- [[entities/fireblocks/user-roles/owner]] · [[entities/fireblocks/user-roles/security-admin]] — Reset 2FA 권한
- [[vendors/fireblocks/authentication]]

## Sources

- `2026-05-18__support-fireblocks-io__manage-your-2fa.md`, p.1–2
- `2026-05-18__support-fireblocks-io__configure-sso.md`, p.1 (SSO와의 분리)
- `2026-05-18__support-fireblocks-io__reset-your-password.md`, p.1 (SSO user의 reset 경로)
- `2026-05-18__support-fireblocks-io__reset-a-users-2fa.md`, p.1 (Stage 3: admin reset 흐름)
- (cross-ref) `2026-05-18__support-fireblocks-io__user-roles.md`, p.5 (Reset 2FA 권한표)

## Stage 8 — Yubikey (Hardware Token) 옵션 정식 명세

`fireblocks-yubikey-authentication.md`, p.1-8:

### Scope
- **Mobile app authentication 의 biometric 대안** (Console 2FA 와는 별개 plane)
- 즉 본 entity (Console TOTP 2FA) 와 별개 — mobile app **action authentication** 의 hardware token 옵션
- Yubico OTP mode 사용 (FIDO2/WebAuthn 명시 없음)

### Setup
- Public Identity (1-16 bytes Modhex) + Private Identity (6 bytes Hex) + Secret Key (16 bytes Hex)
- 결과 CSV 를 **Fireblocks Support PGP 키로 암호화 후 전송** (fingerprint `434A2601D7929FA499D4C058E0710CC2AC26A43D`)

### Owner-Level 강제 전파
> "If you use or change to YubiKey authentication for the workspace **Owner**, all users added to the workspace afterward will be **required to use YubiKey authentication as well**."

### 지원 모델
- iOS + Android: YubiKey 5C NFC / 5 NFC / 5C NFC FIPS / 5 NFC FIPS
- Android only: 5Ci / 5Ci FIPS

### Mobile Auth Layer (`security-aspects-signing-with-the-fireblocks-mobile-app.md`, p.2)
- **"Something you remember"**: 6-digit PIN
- AND either:
  - **"Something you are"**: biometric (fingerprint / face ID)
  - OR **"Something you have"**: Yubikey NFC

→ 2FA plane (Console TOTP login-time) 과 mobile-auth plane (PIN + biometric/Yubikey, **action-time**) 은 분리. 본 entity 는 전자 plane만 다룬다.

## Sources (추가)
- `2026-05-18__support-fireblocks-io__fireblocks-yubikey-authentication.md`, p.1-8 (Stage 8: Yubikey setup + Owner-level enforcement, mobile plane)
- `2026-05-18__support-fireblocks-io__security-aspects-signing-with-the-fireblocks-mobile-app.md`, p.2 (Stage 8: PIN + biometric OR Yubikey)

## Open Questions

- ~~Q-2026-05-18-AU04~~ — **ANSWERED (Stage 8)**: mobile plane 의 Yubikey 5 NFC 지원 + biometric 옵션 명시. **FIDO2/WebAuthn 명시는 없음** — Yubico OTP mode 만 사용. Console plane 의 hardware key 지원은 여전히 미명세 (Console = TOTP 만 명시)
