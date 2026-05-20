# Entity: CSR (Certificate Signing Request)

## Summary

API user를 Fireblocks에 인증하는 1차 자산. **RSA 4096** 키쌍을 생성하고 그 결과로 만들어진 CSR을 Console에 업로드하면 Fireblocks가 API user의 X.509 신원으로 사용한다 (source: `2026-05-18__support-fireblocks-io__add-api-users.md`, p.1). Private key는 클라이언트 측에 `fireblocks_secret.key`로 보관된다.

## Key Concepts

- **RSA 4096** (`add-api-users.md`, p.1)
- 생성 명령:
  ```
  openssl req -new -newkey rsa:4096 -nodes -keyout fireblocks_secret.key
  ```
- 필수 attribute는 organization 이름만; 그 외는 비워도 됨 (`add-api-users.md`, p.1)
- **Mainnet: API user별 고유 CSR 필수, 재사용 금지** (`add-api-users.md`, p.1)
- **Testnet: read-only API user에 한해 재사용 가능** (`add-api-users.md`, p.1)
- Windows: Win32OpenSSL 설치 필요 (`add-api-users.md`, p.2)
- "Keep `fireblocks_secret.key` safe and secure. Do *not* share it with anyone." (`add-api-users.md`, p.2)

## Details

- CSR은 API user 추가 시 `Add API user` 폼의 `CSR file` 필드에 업로드된다 (`add-api-users.md`, p.2).
- Console에서는 같은 폼에서 Name·Role·Co-signer setup과 함께 묶여 처리되며, Owner + Admin Quorum 승인을 거쳐 active 상태가 된다 (`add-api-users.md`, p.2).
- Sandbox workspace에서는 CSR이 **브라우저에서 자동 생성**된다 (`user-roles.md`, p.8). 본 자료의 일반적 mainnet/testnet 흐름과 별개.
- 본 자료는 CSR 갱신·rotation·만료 정책에 대한 명시가 없다 → Open Question.

## Related Pages

- [[entities/fireblocks/api-user]]
- [[entities/fireblocks/api-key]] — CSR로 발급되는 자격증명
- [[entities/fireblocks/sandbox-workspace]] — CSR 자동 생성 사례
- [[vendors/fireblocks/authentication]]
- [[vendors/fireblocks/api]]

## Sources

- `2026-05-18__support-fireblocks-io__add-api-users.md`, p.1–2
- (cross-ref) `2026-05-18__support-fireblocks-io__user-roles.md`, p.8 (Sandbox 자동 생성)

## Open Questions

- Q-2026-05-18-A03 — CSR/API key의 만료·rotation·grace period 정책
