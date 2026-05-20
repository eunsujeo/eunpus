# Fireblocks — API

> REST API / SDK / Webhook 표면.

## Summary

_TODO: REST endpoint·SDK·Webhook 표면 명세는 추후 자료. 현재 자료로 채울 수 있는 것은 API user authentication 표면·credential·네트워크 게이트._

본 자료에서 확인된 핵심 (sources: `add-api-users.md`, `re-enrolling-api-users.md`, `rename-and-delete-api-users.md`, `allowlist-ip-addresses-for-api-user-requests.md`):

- API user는 자동화·서드파티 통합 진입점 — view / initiate / **automatically approve** / **automatically sign** / 통합 (`add-api-users.md`, p.1)
- 인증: CSR/X.509 (RSA 4096) → API key (`add-api-users.md`, p.1–2)
- 네트워크 게이트: IP allowlist (`/32` CIDR, Owner-only) (`allowlist-ip-addresses-for-api-user-requests.md`, p.1)
- 서명 능력: API user와 Co-signer 페어링 + Owner의 key share 승인 (`add-api-users.md`, p.2; `re-enrolling-api-users.md`, p.1)
- 권한 매트릭스: Console user와 동일 9 role (`add-api-users.md`, p.2)

## Key Concepts

- [[entities/fireblocks/csr]] — RSA 4096, mainnet은 user당 고유
- [[entities/fireblocks/api-key]] — API user별 1개, Delete 시 즉시 invalid
- [[entities/fireblocks/ip-allowlist]] — `/32` CIDR only, Owner 단독
- [[entities/fireblocks/api-co-signer]] · [[entities/fireblocks/callback-handler]] — 자동 서명 표면
- [[vendors/fireblocks/authentication]] — 인증 통합 페이지

_TODO: REST endpoint group(Vault, Transactions, Policies, Network, Webhooks), JWT signing 헤더, idempotency, rate limit, webhook event types — 추후 자료_

## Details

_TODO: endpoint·SDK·webhook은 추후 자료._

### API user 표면 (본 자료로 확인된 부분)

- Add: `Developer Center > API users > Add API user`. CSR 업로드 + Role + Co-signer 선택. Owner + Admin Quorum 승인 (Console user와 동일 흐름) (`add-api-users.md`, p.2)
- Re-enroll: `Settings > Users > ⋮ > Re-enroll API user`. Owner 승인 → Co-signer 페어링 → Owner의 key share 승인. **Pairing token 1시간 유효** (`re-enrolling-api-users.md`, p.1)
- Rename: `Developer Center > API users > ⋮ > Rename`. Owner + Admin Quorum 승인. API key 불변 (`rename-and-delete-api-users.md`, p.1)
- Delete: 기본 Owner 단독, 즉시 (mobile approval 불요). AG 위임 시 Admin도 가능 (`rename-and-delete-api-users.md`, p.1–2)
- IP allowlist: Owner 단독, `/32` CIDR only (`allowlist-ip-addresses-for-api-user-requests.md`, p.1)

자세한 lifecycle은 [[vendors/fireblocks/lifecycle-events]] §"API User lifecycle" 참고.

## Related Pages

- [[vendors/fireblocks/authentication]]
- [[vendors/fireblocks/architecture]]
- [[vendors/fireblocks/lifecycle-events]]
- [[entities/fireblocks/api-user]]
- [[entities/fireblocks/csr]] · [[entities/fireblocks/api-key]] · [[entities/fireblocks/ip-allowlist]]
- [[entities/fireblocks/api-co-signer]] · [[entities/fireblocks/callback-handler]]
- [[entities/fireblocks/transaction]] · [[entities/fireblocks/workspace]]

## Sources

- `2026-05-18__support-fireblocks-io__add-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__re-enrolling-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__rename-and-delete-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__allowlist-ip-addresses-for-api-user-requests.md`, p.1

## Open Questions

- Q-2026-05-18-A02 — API user unpair 절차
- Q-2026-05-18-A03 — API key 만료·rotation
- Q-2026-05-18-A07 — API user audit log 조회 표면
- (전체 REST/SDK/Webhook 명세는 후속 자료 필요)
