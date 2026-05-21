---
type: entity
vendor: fireblocks
status: stable
tags: [authentication, identity]
stage_introduced: 4
last_updated_stage: 8
source_count: 4
related: [api-key, api-user, authentication, owner, security-admin]
---
# Entity: IP Allowlist (API user)

## Summary

API user의 API 호출을 사전 지정한 IP 주소로만 제한하는 네트워크 게이트. **Workspace Owner만** 수정 가능하며, **`/32` CIDR**만 허용한다 (range 미지원) (source: `2026-05-18__support-fireblocks-io__allowlist-ip-addresses-for-api-user-requests.md`, p.1). Fireblocks는 모든 API user에 대해 적용을 권장한다.

## Key Concepts

- 적용 대상: **API user 단위** (API key 단위가 아닌 user 단위) (`allowlist-ip-addresses-for-api-user-requests.md`, p.1)
- **`/32` CIDR만 허용, IP range 미지원** (`allowlist-ip-addresses-for-api-user-requests.md`, p.1)
- 수정 권한: **Owner와 Security Admin**만 (`user-roles.md`, p.5 — "Modify API User/Key IP Allowlist")
  - Allowlist IP addresses 본문은 "Only workspace Owners"라고 narrow하게 표현 (p.1) — Security Admin 포함 여부 본문/표 불일치 가능
- 부재 시 위험: stolen API key가 인터넷 어디서든 사용 가능 (`allowlist-ip-addresses-for-api-user-requests.md`, p.1)

## Details

**경로**: `Developer Center > API users > ⋮ > Allowlist IP address` (`allowlist-ip-addresses-for-api-user-requests.md`, p.1)

**입력**: comma로 구분된 `/32 CIDR` 목록.

**왜 중요한가**: API user는 CSR+API key로 인증되며 mobile approval 같은 비대면 2차 인증이 없다 (`add-api-users.md`, p.1). 따라서 API key 도난 시 network-layer 제약이 사실상 유일한 자동화된 방어선.

**운영 함의**:
- 기업 NAT/VPN/proxy 환경에서 `/32` 단위 등록이 까다로울 수 있음 → [[open-questions/fireblocks]] Q-2026-05-18-A06
- Owner 단독 변경 → IP 변경 시점에 Owner 가용성이 SPOF가 될 수 있음

## Related Pages

- [[entities/fireblocks/api-user]]
- [[entities/fireblocks/api-key]]
- [[entities/fireblocks/user-roles/owner]]
- [[entities/fireblocks/user-roles/security-admin]] — 권한표상 함께 수정 가능
- [[vendors/fireblocks/authentication]]

## Sources

- `2026-05-18__support-fireblocks-io__allowlist-ip-addresses-for-api-user-requests.md`, p.1
- (cross-ref) `2026-05-18__support-fireblocks-io__user-roles.md`, p.5 (권한표 *Modify API User/Key IP Allowlist*)
- `2026-05-18__support-fireblocks-io__allowlisting-ip-addresses-for-console-access.md`, p.1–3 (Stage 6: Console plane)
- `2026-05-18__support-fireblocks-io__security-checklist.md`, p.1 (Stage 6: User login IP whitelisting)

## Stage 6 — 두 평면 분리

본 entity는 **두 별개 평면**을 다룬다. 본 자료(`allowlisting-ip-addresses-for-console-access.md`) + Stage 4(`allowlist-ip-addresses-for-api-user-requests.md`)에서 확인.

### Plane A: API user IP allowlist (Stage 4)

- **범위**: API user 단위
- **형식**: **`/32` CIDR only**, range 미지원 (`allowlist-ip-addresses-for-api-user-requests.md`, p.1)
- **경로**: `Developer Center > API users > ⋮ > Allowlist IP address`
- **활성화**: 추가 즉시 적용 (별도 토글 없음)
- **거버넌스**: 본문은 "Only workspace Owners" (`allowlist-ip-addresses-for-api-user-requests.md`, p.1); 권한표 *Modify API User/Key IP Allowlist*는 Owner / Security Admin ✓ (`user-roles.md`, p.5) — 본문/표 불일치 패턴
- **부재 시 위험**: stolen API key가 인터넷 어디서든 사용 가능

### Plane B: Console IP allowlist (Stage 6)

- **범위**: **Workspace 단위** (workspace별 별도 allowlist 필요) (`allowlisting-ip-addresses-for-console-access.md`, p.1)
- **형식**: **IPv4/IPv6, CIDR, 또는 range** (예: `12.123.456.789 - 12.123.456.799`) (`allowlisting-ip-addresses-for-console-access.md`, p.1–2)
- **경로**: `Settings > General > Manage IP allowlist`
- **활성화**: Activate/Deactivate 토글. **활성화 시 본인 IP 포함 필수** (lockout 방지) (`allowlisting-ip-addresses-for-console-access.md`, p.1)
- **거버넌스**: 기본 Admin Quorum. **`Quorums > Security & compliance`**에서 specific approval group 위임 가능 (`allowlisting-ip-addresses-for-console-access.md`, p.2)
- **Audit**: IP allowlist events가 **Audit Log**에 기록 (`allowlisting-ip-addresses-for-console-access.md`, p.3)
- **Multi-workspace user**: 본인 IP가 allowlist에 없는 workspace는 선택 불가 (`allowlisting-ip-addresses-for-console-access.md`, p.1)

### 두 평면 비교 (Q-A06 답)

| | API user (Stage 4) | Console (Stage 6) |
|---|---|---|
| 단위 | API user | Workspace |
| 형식 | `/32` only | CIDR + range |
| 활성화 | 즉시 | 토글 (lockout-safe) |
| 거버넌스 | Owner / Security Admin | Admin Quorum (default) / Approval group 위임 가능 |
| Audit | (본 자료 명시 없음) | Audit Log 기록 |

→ NAT/VPN 운영 시 두 정책을 별도 평가 필요. Console allowlist는 더 유연 (CIDR/range), API allowlist는 더 엄격 (`/32`).

### User login IP whitelisting (Support enable)

`security-checklist.md`, p.1: "User login IP whitelisting: Restricts logins according to specific IP addresses. Contact support to enable."

Console IP allowlist의 self-service 옵션과 별도로 명시. 본 자료에 두 메커니즘의 정확한 관계 명시 없음 — 함께 다루는 것은 [[vendors/fireblocks/security]] §"Authentication". 본 entity는 두 self-service 평면(A, B)만 다룬다.

## Stage 8 — Fireblocks-side Ingress IP 목록 (`fireblocks-ip-addresses-to-whitelist.md`)

본 entity 는 customer 의 ingress 두 평면 (API user / Console) 을 다루지만, **Customer 측 firewall config** 에서도 Fireblocks-side IP 를 허용해야 하는 plane 이 존재. 이는 본 entity 와 별개의 plane:

### Customer egress firewall — Platform Ingress
Customer 의 firewall 에서 Fireblocks Console/mobile/API 로 나가는 트래픽 허용 대상 (`fireblocks-ip-addresses-to-whitelist.md`, p.1):
- **Cloudflare IP range** (전체)
- **3-region Ingress addresses** (Fireblocks SaaS 의 3 region 배포):
  - **US**: `3.133.194.13`
  - **EU**: `3.126.240.51`
  - **EU2**: `3.77.238.179`

### Customer ingress firewall — Webhook source allow
Fireblocks 가 customer webhook receiver 로 보내는 source IP (customer 의 receiver firewall 에서 허용):
- **US**: `3.134.25.131`
- **EU**: `3.72.125.45`, `18.184.217.45`, `18.198.71.192`

→ 총 **IP allowlist 관련 plane 4개**:
1. API user IP allowlist (Fireblocks-side ingress, /32 strict) ← 본 entity
2. Console IP allowlist (Fireblocks-side ingress, CIDR/range) ← 본 entity
3. Customer egress allow (customer firewall outbound to Fireblocks)
4. Webhook source allow (customer firewall inbound from Fireblocks)

(3)(4) 는 Fireblocks 가 게시하는 IP 를 customer 가 본인 firewall 에 적용하는 것이지, Fireblocks 측 entity 는 아님 — 본 entity 의 범위에 포함하지 않고 [[vendors/fireblocks/authentication]] 또는 [[vendors/fireblocks/architecture]] 에서 참조.

## Sources (추가)
- `2026-05-18__support-fireblocks-io__fireblocks-ip-addresses-to-whitelist.md`, p.1 (Stage 8: 3-region SaaS + webhook source)

## Open Questions

- ~~Q-2026-05-18-A06~~ — **부분 ANSWERED (Stage 6)**: 두 평면은 다른 정책. Console은 CIDR/range, API는 `/32` only. NAT/VPN 운영 노하우 자체는 잔존
- Q-2026-05-18-L02 cross-ref — 본문 "Only workspace Owners" vs 권한표 Security Admin ✓ 불일치 (API plane)
