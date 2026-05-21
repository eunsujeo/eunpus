---
type: entity
vendor: fireblocks
status: stable
tags: [user, identity]
stage_introduced: 3
last_updated_stage: 5
source_count: 6
related: [2fa, api-user, authentication, mobile-device, sso, user-management]
---
# Entity: Console User (Fireblocks)

## Summary

Fireblocks Console을 통해 플랫폼을 접근·운영하는 사용자 유형. 사용자는 할당된 role의 권한 범위 내에서 Console을 사용한다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.1).

## Key Concepts

- Fireblocks의 사용자 유형은 두 가지: **Console user** / **API user** (p.1)
- Console user의 권한은 user role에 의해 결정된다 (p.1)
- 일부 role은 mobile app 요구: Owner / Admin / NSA / Signer / Approver / Security Admin (`Require the Fireblocks mobile app: Y`) (p.5)

## Details

- 사용자 추가는 Fireblocks Console의 `Settings > Users` 화면에서 수행되며 (`user-roles.md`, p.1, p.5), 신규 사용자 추가에는 Admin Quorum 승인이 필요한 행이 다수 존재 (`user-roles.md`, p.5).
- MPC key share 승인 상태는 같은 화면의 Status 열에서 확인한다 (`user-roles.md`, p.1).

### 인증 모델 (Stage 4)

Console user의 로그인은 두 갈래:

- **Default**: email + Fireblocks password + **TOTP 2FA** (`manage-your-2fa.md`, p.1)
- **SSO 사용**: email domain authorize via IdP + **TOTP 2FA** (`configure-sso.md`, p.1)
  - password는 IdP가 관리 (`reset-your-password.md`, p.1)
  - 2FA는 SSO 사용 여부와 무관하게 필수

**모든 Console user에게 2FA 필수** — TOTP authenticator app (`manage-your-2fa.md`, p.1).

password 재설정은 self-service `Forgot password?` (`reset-your-password.md`, p.1). SSO user는 그 대신 Owner에게 2FA reset 요청.

자세한 통합 페이지: [[vendors/fireblocks/authentication]].

### Mobile device 의존성 (Stage 3 + Stage 5)

다수의 Console user role이 mobile app을 요구하며, 그 mobile device는 MPC key share / 2FA / mobile app 인증의 호스트다 — [[entities/fireblocks/mobile-device]] 참고. 디바이스 lifecycle event 시 재등록 절차가 발동되며 signing role은 2-day × 2단계 windowing이 적용된다 (`re-enroll-a-users-mobile-device.md`, p.1).

**Stage 5 추가** (`about-the-fireblocks-mobile-app.md`, p.1):
- MPC key share는 device의 **secure enclave**에 보관 (hardware-encrypted)
- iCloud / Google Cloud 백업 불가
- Mobile app uninstall 시 비가역적 (다른 사용자는 re-download+re-enroll로 회복, **Owner는 Key Share Recovery 필요**)
- API Co-Signer가 자동화 대체 옵션 (`about-the-fireblocks-mobile-app.md`, p.2)

3 비밀 layer (PIN / mobile app passphrase / recovery passphrase)와 device 인증 (built-in biometric / Yubikey)은 [[entities/fireblocks/mobile-device]]에 통합 정리.

**Linked users / linked workspaces**: 한 디바이스에 multiple users/workspaces가 linked될 수 있으며 각각 별도 재등록 필요 (`re-enroll-a-users-mobile-device.md`, p.1).

## Related Pages

- [[entities/fireblocks/api-user]]
- [[entities/fireblocks/mobile-device]] — MPC share / 2FA / mobile app 호스트
- [[entities/fireblocks/sso]] · [[entities/fireblocks/2fa]]
- [[vendors/fireblocks/authentication]]
- [[vendors/fireblocks/user-management]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1, p.5
- `2026-05-18__support-fireblocks-io__configure-sso.md`, p.1 (Stage 4)
- `2026-05-18__support-fireblocks-io__manage-your-2fa.md`, p.1 (Stage 4)
- `2026-05-18__support-fireblocks-io__reset-your-password.md`, p.1 (Stage 4)
- `2026-05-18__support-fireblocks-io__re-enroll-a-users-mobile-device.md`, p.1 (Stage 3)
- `2026-05-18__support-fireblocks-io__about-the-fireblocks-mobile-app.md`, p.1–2 (Stage 5)
