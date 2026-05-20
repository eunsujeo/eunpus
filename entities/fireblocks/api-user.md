# Entity: API User (Fireblocks)

## Summary

Fireblocks 플랫폼을 API를 통해 사용하는 사용자 유형. 할당된 role의 권한 범위 내에서 API를 사용하며, **API Co-signer 기능에도 사용**된다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.1).

## Key Concepts

- 사용자 유형 2개 중 하나 (Console user / API user) (`user-roles.md`, p.1)
- API Co-signer의 사용자 주체로 활용됨 (`user-roles.md`, p.1)
- Non-Signing Admin이 mainnet Co-signer 또는 testnet의 **Fireblocks Communal API Co-signer**에서 workspace configuration 승인용 API user로 사용되는 사례가 있음 (`user-roles.md`, p.3)
- **CSR/X.509 (RSA 4096) + API key** 로 인증 (`add-api-users.md`, p.1)
- 권한 매트릭스는 Console user와 **동일한 9 role** 사용 (`add-api-users.md`, p.2)
- 가능 동작: view / initiate / automatically approve / automatically sign / 서드파티 통합 (`add-api-users.md`, p.1)

## Details

- API user 단위의 보안 표면으로 **API User/Key IP Allowlist**가 있으며, 수정 권한은 Owner와 Security Admin에 한정된다 (`user-roles.md`, p.5). 본문 (`allowlist-ip-addresses-for-api-user-requests.md`, p.1)은 "Only workspace Owners"로 narrow 표기 — 본문/표 불일치 (Q-L02 cross-ref).
- Sandbox workspace에서는 API user 생성 시 **CSR 인증서가 브라우저에서 자동 생성**되어 private key 발급 흐름이 단축된다 (`user-roles.md`, p.8).
- Sandbox에는 Developer Area API Monitoring 기능(24h/7d)이 있다 (`user-roles.md`, p.8).

### Lifecycle (Stage 4)

**Add** (`add-api-users.md`, p.1–2):

- 2단계: CSR 생성 (RSA 4096) → Console `Developer Center > API users > Add API user`
- 입력: Name (≤30자), Role, CSR file, Co-signer setup
- testnet에서는 *Fireblocks Communal Test Co-signer* 선택 가능
- SGX Co-signer 신규 설치 시 "First user on this machine" 체크
- **Owner + Admin Quorum 승인** (Console user Add와 동일 흐름)

**Re-enroll** (`re-enrolling-api-users.md`, p.1–2):

- Trigger: 초기 Co-signer 서버 setup 오류 / 신·기존 Co-signer 페어링 / Callback Handler 설정 변경
- 경로: `Settings > Users > ⋮ > Re-enroll API user`
- Owner 승인 → Co-signer 페어링 (pairing token 1시간 유효) → Owner의 key share 승인
- Actor: "Admin-level users"

**Rename** (`rename-and-delete-api-users.md`, p.1):

- Actor: "Admin-level users"
- API key 불변
- Owner + Admin Quorum 승인
- 경로: `Developer Center > API users > ⋮ > Rename`

**Delete** (`rename-and-delete-api-users.md`, p.1–2):

- Default: Owner 단독, 즉시, mobile approval 불요
- 삭제 전 검증: Admin Quorum threshold, Policy rule, **활성 서드파티 통합**
- 부수 효과:
  - workspace access 즉시 박탈
  - **API key 즉시 invalid → 통합 중단**
  - **In-flight tx 실패, 새 signing 거부**
  - **Co-signer 페어링은 잔존 — unpairing은 별도 작업**
  - audit logs에 activity 보존
  - API user list에 잔존
- AG 위임: Console user Delete와 동일 설정 사용 (`Settings > Quorums > Approval groups`)

**IP allowlist 설정** (`allowlist-ip-addresses-for-api-user-requests.md`, p.1):

- `/32 CIDR`만, range 미지원
- Workspace Owner만 수정 (본문) — 권한표는 Security Admin도 ✓
- 경로: `Developer Center > API users > ⋮ > Allowlist IP address`

## Related Pages

- [[entities/fireblocks/console-user]]
- [[entities/fireblocks/csr]] · [[entities/fireblocks/api-key]] · [[entities/fireblocks/ip-allowlist]]
- [[entities/fireblocks/api-co-signer]] · [[entities/fireblocks/callback-handler]]
- [[entities/fireblocks/sandbox-workspace]]
- [[entities/fireblocks/user-roles/non-signing-admin]]
- [[vendors/fireblocks/authentication]]
- [[vendors/fireblocks/api]]
- [[vendors/fireblocks/lifecycle-events]]
- [[vendors/fireblocks/user-management]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1, p.3, p.5, p.8
- `2026-05-18__support-fireblocks-io__add-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__re-enrolling-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__rename-and-delete-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__allowlist-ip-addresses-for-api-user-requests.md`, p.1
