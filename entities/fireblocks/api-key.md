# Entity: API Key

## Summary

API user를 식별하는 자격증명. CSR로 발급되며 Console의 API users list에서 hover로 복사한다 (source: `2026-05-18__support-fireblocks-io__add-api-users.md`, p.2). API user를 삭제하면 즉시 invalid 상태가 되어 그 키를 사용하던 서드파티 통합이 중단된다 (`rename-and-delete-api-users.md`, p.2).

## Key Concepts

- API user당 1개 (`add-api-users.md`, p.1 "Each API user has an associated API key.")
- Console *API User (ID)* 열에서 hover하여 복사 (`add-api-users.md`, p.2)
- **Rename 시 API key 불변** (`rename-and-delete-api-users.md`, p.1)
- **Delete 시 API key 즉시 invalid → 서드파티 통합 중단** (`rename-and-delete-api-users.md`, p.2)
- 도난된 API key는 IP allowlist가 없으면 **인터넷의 임의 머신에서 사용 가능** (`allowlist-ip-addresses-for-api-user-requests.md`, p.1)

## Details

- 인증 mechanism: CSR/X.509 (RSA 4096)를 통한 mutual authentication 형태로 사용되는 것으로 추정. 본 자료는 정확한 wire-level 명세는 없음 → 추후 자료 필요.
- 보안 layer:
  - **CSR private key** 로컬 보관 (`fireblocks_secret.key`)
  - **IP allowlist** 적용 권장 (Owner-only 수정) (`allowlist-ip-addresses-for-api-user-requests.md`, p.1)
  - **Role 권한** (9 role 매트릭스 적용)
- Delete 직후 동작 (`rename-and-delete-api-users.md`, p.2):
  - In-flight transactions (그 API user 서명) **실패**
  - 새 서명 요청 **거부**
  - Co-signer 페어링 그대로 유지 — unpairing은 별도 작업

## Related Pages

- [[entities/fireblocks/csr]]
- [[entities/fireblocks/api-user]]
- [[entities/fireblocks/ip-allowlist]]
- [[entities/fireblocks/api-co-signer]]
- [[vendors/fireblocks/authentication]]
- [[vendors/fireblocks/api]]

## Sources

- `2026-05-18__support-fireblocks-io__add-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__rename-and-delete-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__allowlist-ip-addresses-for-api-user-requests.md`, p.1

## Open Questions

- Q-2026-05-18-A03 — API key의 만료·rotation·grace period
- Q-2026-05-18-A07 — API user audit log 조회·내보내기 표면
