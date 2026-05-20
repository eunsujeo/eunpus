# Entity: SSO (Single Sign-On)

## Summary

Fireblocks Console 로그인을 기업 IdP(Identity Provider)에 위임하는 옵션. **email domain 기반 authorization**으로 동작하며 SSO 자체는 **login authorization만** 다룬다 — workspace 내 user 추가/삭제·권한 결정은 별개 평면(Owner/Admin이 Console에서 수행) (source: `2026-05-18__support-fireblocks-io__configure-sso.md`, p.1). **Auth0**가 Fireblocks 측의 service provider 역할.

## Key Concepts

- **목적**: username/password 인증을 IdP가 대체. password 수 감소, 통일된 sign-in 경험 (`configure-sso.md`, p.1)
- **Authorization 기준**: email domain. workspace 가입자의 domain이 authorized list에 있어야 로그인 가능 (`configure-sso.md`, p.1)
- **분리 원칙**: "SSO only affects login authorization. Adding or removing users in your workspace is still done in the Fireblocks Console by the Owner or an Admin." (`configure-sso.md`, p.1)
- **Service provider**: Auth0 (`auth.fireblocks.io/login/callback`) (`configure-sso.md`, p.1–2)
- **변경**: Fireblocks Support 경유, **Workspace Owner 승인 필요** (`configure-sso.md`, p.4)

## Details

### IdP 카탈로그 (본 자료 명시)

| IdP | Self-setup 가능 | 주요 입력 | 비고 |
|---|---|---|---|
| **Google Workspace** | ✓ | Client ID, Client Secret, 도메인 | OAuth 2.0. `auth0.com` 인증 domain 추가 (`configure-sso.md`, p.1) |
| **Microsoft Entra ID** (구 Azure AD) | ✓ | Client ID, Client Secret value, 도메인 | Multitenant 옵션. Client Secret **value**를 보내야 함 (ID 아님) (`configure-sso.md`, p.2) |
| **Okta** | ✓ | `customer-metadata.xml`, X.509, 도메인 | SAML. **firstName / lastName / email 3 attribute** 필수 매핑 (`configure-sso.md`, p.2–3) |
| **OpenID Connect (OIDC)** | ✓ | Issuer URL, Client ID, 도메인 | `/.well-known/openid-configuration` (`configure-sso.md`, p.3) |
| **PingFederate** | ✓ | PingFederate Server URL, X.509 (Base64) | Auth0가 service provider (`configure-sso.md`, p.3–4) |
| **SAML 2.0 / SAML 3.0** | ✓ | `customer-metadata.xml`, X.509, 도메인 | Okta와 유사 (`configure-sso.md`, p.4) |
| **ADFS** | ✗ (Support 경유) | — | Fireblocks Support setup 필요 (`configure-sso.md`, p.1) |
| **LDAP / Active Directory** | ✗ (Support 경유) | — | Fireblocks Support setup 필요 (`configure-sso.md`, p.1) |

공통 callback URL: `https://auth.fireblocks.io/login/callback`.

모든 IdP의 Fireblocks Support 전달 항목에는 **"Domains in your organization that should be required to sign in via SSO"** 가 포함된다 — 도메인 목록이 authorization 평면의 핵심 입력.

> **현재 scope**: IdP별 개별 entity는 만들지 않고 이 페이지의 카탈로그 절로 통합. 특정 IdP가 반복 참조되거나 독립적인 governance/permission 특성이 확인되면 entity로 승격한다.

### Password와의 관계

SSO를 사용하면 password는 **IdP가 관리**한다 — Fireblocks가 아니다 (`reset-your-password.md`, p.1). SSO user가 Fireblocks 접근을 잃었다면 `Forgot password?` 대신 **Owner에게 2FA reset을 요청**한다.

### 2FA와의 관계

SSO 사용 여부와 무관하게 **2FA는 모든 Console user에게 필수** (`manage-your-2fa.md`, p.1). SSO는 1차 authn만 IdP로 위임.

### User add/remove와의 관계

SSO는 **login authorization만**을 다룬다. 새 user를 workspace에 추가하려면 여전히 [[vendors/fireblocks/lifecycle-events]]의 Add 흐름을 거쳐야 한다 (Owner + Admin Quorum, 7-day expiry).

→ domain authorize와 workspace user list가 정확히 어떻게 연결되는지는 본 자료에 명세 없음 → [[open-questions/fireblocks]] Q-2026-05-18-AU03.

### SSO provider 변경

Fireblocks Support 경유. **Workspace Owner 승인 필요** (`configure-sso.md`, p.4).

## Related Pages

- [[entities/fireblocks/2fa]]
- [[entities/fireblocks/console-user]]
- [[entities/fireblocks/user-roles/owner]] — SSO 변경 승인자
- [[vendors/fireblocks/authentication]]
- [[vendors/fireblocks/lifecycle-events]] — user add/remove는 SSO와 분리

## Sources

- `2026-05-18__support-fireblocks-io__configure-sso.md`, p.1–4
- `2026-05-18__support-fireblocks-io__reset-your-password.md`, p.1 (SSO user의 password 관리 위치)
- `2026-05-18__support-fireblocks-io__manage-your-2fa.md`, p.1 (SSO와 2FA의 독립성)

## Open Questions

- Q-2026-05-18-AU01 — Auth0 의존성의 운영·장애 영향
- Q-2026-05-18-AU02 — ADFS/LDAP가 Support 경유만 가능한 이유
- Q-2026-05-18-AU03 — SSO domain authorize와 workspace user list 연결 메커니즘
- Q-2026-05-18-AU05 — 비밀번호 정책 (SSO 미사용 사용자에 적용)
