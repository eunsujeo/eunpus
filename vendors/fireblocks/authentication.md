# Fireblocks — Authentication

> Console·API 사용자의 로그인 인증 모델 통합. SSO / 2FA / password / CSR / API key / IP allowlist 한 페이지.

## Summary

Fireblocks의 인증은 사용자 종류별로 두 갈래로 나뉜다:

- **Console user**: email + (Fireblocks password 또는 SSO를 통한 IdP authn) **+ TOTP 2FA (모든 사용자 필수)** (sources: `manage-your-2fa.md` p.1; `reset-your-password.md` p.1; `configure-sso.md` p.1)
- **API user**: **CSR/X.509 (RSA 4096)** 기반 인증 + API key + 선택적 IP allowlist (`add-api-users.md` p.1; `allowlist-ip-addresses-for-api-user-requests.md` p.1)

**SSO는 login authorization만**을 다루며 workspace 내 user 추가/삭제·권한 결정과는 분리된다 (`configure-sso.md`, p.1). 권한·거버넌스는 user role + Admin Quorum + Approval group + Policy로 결정된다 ([[vendors/fireblocks/user-management]]).

## Key Concepts

### Console user 인증
- **Default**: email + password + 2FA (TOTP)
- **SSO 옵션**: email domain 기반 authorize. password 관리가 IdP로 위임 (`reset-your-password.md`, p.1)
- **2FA는 모든 Console user에게 필수** (`manage-your-2fa.md`, p.1)
- **Auth0**가 service provider 역할 — `auth.fireblocks.io/login/callback` (`configure-sso.md`, p.1, p.2)

### API user 인증
- **CSR (Certificate Signing Request) → X.509** — RSA 4096 (`add-api-users.md`, p.1)
- **API key** — CSR로 발급. Console *API User (ID)* 열에서 hover로 복사 (`add-api-users.md`, p.2)
- **IP allowlist** (선택, 권장) — `/32 CIDR`, Owner-only (`allowlist-ip-addresses-for-api-user-requests.md`, p.1)
- (서명 능력) **Co-signer 페어링** + Owner의 key share 승인 (`add-api-users.md` p.2; `re-enrolling-api-users.md` p.1)

## Details

### SSO (Console user 로그인 게이트)

지원 IdP (`configure-sso.md`, p.1):

| IdP | 자체 setup 가능 | 비고 |
|---|---|---|
| Google Workspace | ✓ | OAuth 2.0, `auth0.com` authorized domain 추가 (p.1) |
| Microsoft Entra ID (구 Azure AD) | ✓ | Multitenant 옵션 (p.2) |
| Okta | ✓ | SAML App Wizard. firstName/lastName/email 3 attribute 매핑 필수 (p.3) |
| OpenID Connect | ✓ | Issuer URL + Client ID + 도메인 (p.3) |
| PingFederate | ✓ | Auth0가 service provider, X.509 Base64 encoded (p.3–4) |
| SAML 2.0 / SAML 3.0 | ✓ | Okta와 유사. customer-metadata.xml + X.509 + 도메인 (p.4) |
| ADFS | ✗ (**Fireblocks Support 경유**) | (p.1) |
| LDAP / Active Directory | ✗ (**Fireblocks Support 경유**) | (p.1) |

공통 callback URL: `https://auth.fireblocks.io/login/callback` (`configure-sso.md`, p.2). 모든 IdP의 Fireblocks Support 전달 항목에는 "Domains in your organization that should be required to sign in via SSO"가 포함된다 (`configure-sso.md`, p.2, p.3, p.4).

**SSO 변경에는 Workspace Owner 승인이 필요** — Fireblocks Support 경유 (`configure-sso.md`, p.4).

### 2FA

- **모든 Console user에게 필수** (`manage-your-2fa.md`, p.1)
- TOTP (Time-based One-Time Password) authenticator app — Google / Microsoft / LastPass / Yubico Authenticator 등 (p.1)
- 시간 동기화가 중요 — 거부 시 컴퓨터·모바일 시간 확인 (p.1)
- **Reset**: 본인은 불가 → workspace Owner가 reset (p.1)
- **Migration** (구→신 디바이스, 구 디바이스 접근 가능 시): authenticator app의 export/transfer로 QR 생성 → 신 디바이스에서 스캔 (p.2). 구 디바이스 접근 불가 시 Owner reset 필요 (p.2)

### 이메일 인증 (Stage 6 추가)

`is-this-email-really-from-fireblocks.md`, p.1:

- **DKIM 서명** + **DMARC 정책** — 모든 Fireblocks 발신 이메일에 적용
- 공식 domain: `fireblocks.com` / `fireblocks.io` 만 신뢰
- Phishing 방어 hub는 [[vendors/fireblocks/security]] §"Phishing 방어 / Email Authentication"

### Console IP Allowlist (Stage 6 추가)

`allowlisting-ip-addresses-for-console-access.md`, p.1–3 — **Console 접근 자체의 IP 제한** (API user IP allowlist와 다른 평면):

- Workspace 단위, 기본 비활성
- IPv4/IPv6, **CIDR notation 또는 range** 모두 지원
- `Settings > General > Manage IP allowlist`
- 활성화 전 본인 IP 포함 필수 (lockout 방지)
- Default Admin Quorum, `Quorums > Security & compliance`에서 specific approval group 위임 가능
- IP allowlist events는 **Audit Log**에 기록

→ [[entities/fireblocks/ip-allowlist]] §"Console Access" 절 참고.

### User login IP whitelisting (Support enable, Stage 6)

`security-checklist.md`, p.1: "User login IP whitelisting: Restricts logins according to specific IP addresses. Contact support to enable."

Console IP allowlist의 self-service 옵션과 별개로 명시되는 운영 옵션. 둘의 정확한 관계(별개 메커니즘인지 동일한 기능의 옛 이름인지)는 본 자료에 명시 없음 — 함께 다루는 [[vendors/fireblocks/security]] §"Authentication"에서 추적.

### Mobile App 측 인증 (Stage 5 추가)

위 2FA는 Console **로그인** 게이트이고, mobile app **자체의** device-level 인증은 별도 layer다:

**Built-in authentication** (`mobile-authentication-methods.md`, p.1):
- Device의 fingerprint scanner
- Device의 facial recognition

**External authentication**:
- **Yubikey** (built-in의 alternative) (`mobile-authentication-methods.md`, p.1)

→ FIDO2/WebAuthn은 본 자료에 직접 명시 없음 — Yubikey가 FIDO2 hardware key이긴 하나 확정은 Q-AU04.

**Mobile device 최소 요구사항** (`mobile-device-minimum-requirements.md`, p.1):
- Android 8.1+ (64-bit) + Google Play Store + biometric capability
- iOS 16.6+ (non-jailbroken) + App Store + biometric capability
- Biometric 필수 — `Touch ID / Face ID / Yubikey / fingerprint / face`

Mobile app의 3 비밀 layer는 [[entities/fireblocks/mobile-device]] §"3 비밀 layer"에서 통합 정리:
- 6-digit PIN (앱 잠금)
- Mobile app passphrase (role별 요구)
- Recovery passphrase (cloud backup 암호화 + recovery verify)

### Password

- Fireblocks Console 로그인 화면의 `Forgot password?` 셀프 재설정 (`reset-your-password.md`, p.1)
- **SSO 사용 시 password는 IdP가 관리** — Fireblocks가 아님 (p.1)
- 로그인 email 분실 시: Admin 또는 Fireblocks Support (p.1)
- 원본 email 접근 불가 시 Fireblocks Support는 **workspace Owner 승인 요구** (p.1)

### API user 인증 (CSR + API key)

**CSR 생성** (`add-api-users.md`, p.1):

```
openssl req -new -newkey rsa:4096 -nodes -keyout fireblocks_secret.key
```

- 결과: `fireblocks_secret.key` (RSA 4096 private key, 로컬 비밀)
- Windows는 Win32OpenSSL 필요 (p.2)
- **mainnet: CSR per API user (재사용 금지)** (p.1)
- **testnet: read-only API user에 한해 재사용 가능** (p.1)

**API user 생성** (`add-api-users.md`, p.2): `Developer Center > API users > Add API user`. CSR 업로드 + Role + Co-signer 선택. Owner + Admin Quorum 승인 (Console user와 동일 흐름).

**API key** — Console의 API users list, `API User (ID)` 열에서 hover하여 복사. Rename은 API key 불변, Delete는 API key 즉시 invalid (`rename-and-delete-api-users.md`, p.1–2).

### IP allowlist (API user 네트워크 게이트)

- 목적: stolen API key의 임의 위치 사용 차단 (`allowlist-ip-addresses-for-api-user-requests.md`, p.1)
- **/32 CIDR만 허용**, range 미지원
- **Workspace Owner만 수정 가능**
- 절차: `Developer Center > API users > ⋮ > Allowlist IP address` (commas로 구분)

### 인증 분리 매트릭스 (요약)

| 항목 | Console user | API user |
|---|---|---|
| 1차 인증 | password (Fireblocks) 또는 IdP (SSO) | CSR/X.509 |
| 2차 인증 | **TOTP 2FA (필수)** | (해당 없음) |
| Credential 식별자 | email | API key (= API User ID) |
| Credential 분실 시 | Forgot password → email / Owner 2FA reset / Support | API user re-enroll 또는 delete+re-add |
| 네트워크 제약 | (워크스페이스 단위 - 본 자료에 없음) | IP allowlist `/32 CIDR`, Owner-only |
| Service provider | Auth0 | (직접 — Fireblocks API) |

## Related Pages

- [[entities/fireblocks/sso]] — SSO entity + IdP 카탈로그
- [[entities/fireblocks/2fa]] — TOTP 2FA
- [[entities/fireblocks/csr]] — CSR 생성·재사용 정책
- [[entities/fireblocks/api-key]] — API key lifecycle
- [[entities/fireblocks/ip-allowlist]] — API user 네트워크 제약
- [[entities/fireblocks/console-user]] · [[entities/fireblocks/api-user]]
- [[entities/fireblocks/api-co-signer]] · [[entities/fireblocks/callback-handler]]
- [[vendors/fireblocks/user-management]] — workspace 권한 모델
- [[vendors/fireblocks/lifecycle-events]] — user/API user lifecycle
- [[vendors/fireblocks/api]] — API surface
- [[vendors/fireblocks/mobile-app]] — Mobile app 전반 (Stage 5)

## Sources

- `2026-05-18__support-fireblocks-io__configure-sso.md`, p.1–4
- `2026-05-18__support-fireblocks-io__manage-your-2fa.md`, p.1–2
- `2026-05-18__support-fireblocks-io__reset-your-password.md`, p.1
- `2026-05-18__support-fireblocks-io__add-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__allowlist-ip-addresses-for-api-user-requests.md`, p.1
- (cross-ref) `2026-05-18__support-fireblocks-io__user-roles.md`, p.5 (2FA / IP Allowlist 권한표)
- `2026-05-18__support-fireblocks-io__mobile-authentication-methods.md`, p.1 (Stage 5: built-in / Yubikey)
- `2026-05-18__support-fireblocks-io__mobile-device-minimum-requirements.md`, p.1 (Stage 5)
- `2026-05-18__support-fireblocks-io__is-this-email-really-from-fireblocks.md`, p.1 (Stage 6: DKIM/DMARC, domain)
- `2026-05-18__support-fireblocks-io__allowlisting-ip-addresses-for-console-access.md`, p.1–3 (Stage 6: Console IP allowlist)
- `2026-05-18__support-fireblocks-io__security-checklist.md`, p.1 (Stage 6: User login IP whitelisting)

## Open Questions

- Q-2026-05-18-AU01 — Auth0 의존성의 운영·장애 영향
- Q-2026-05-18-AU02 — ADFS/LDAP의 Support 경유 강제 이유
- Q-2026-05-18-AU03 — SSO domain authorize와 workspace user list 연결 메커니즘
- Q-2026-05-18-AU04 — WebAuthn/FIDO2/hardware key 지원 여부
- Q-2026-05-18-AU05 — 비밀번호 정책 (length/complexity/rotation/lockout)
- Q-2026-05-18-A06 — `/32` 한정 정책 — 기업 NAT/VPN 운영 노하우
