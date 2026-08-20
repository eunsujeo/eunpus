---
type: vendor-hub
vendor: fireblocks
status: stable
tags: [misc]
stage_introduced: 2
last_updated_stage: 6
source_count: 9
related:
  - admin-quorum
  - api-co-signer
  - api-user
  - approval-group
  - callback-handler
  - console-user
  - cosigner
  - designated-signer
  - lifecycle-events
  - mpc-key-share
  - overview
  - policy
  - sandbox-workspace
  - transaction
  - user
  - vault-account
  - workspace
---
# Fireblocks — User Management

> Workspace 사용자 모델, 9개 user role, 권한 매트릭스, Sandbox 차이.

## Summary

Fireblocks workspace의 사용자/권한은 **9개 role** (Owner, Admin, Non-Signing Admin, Signer, Approver, Editor, Viewer, Security Auditor, Security Admin)과 **role별 권한 매트릭스**로 정의된다. 사용자는 인터페이스에 따라 **Console user**와 **API user**로 나뉜다. Workspace는 hot / cold / Sandbox 종류가 있으며 본 페이지는 **hot workspace**를 대상으로 한다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.1).

거의 모든 권한 부여는 단일 사용자 의사결정이 아니라 **Owner + Admin Quorum + 선택적 Approval group**의 거버넌스 흐름을 거치며, 권한표 셀의 조건 라벨(Q / Q+O / AG / NS / TL)이 그 흐름을 표기한다 (p.4–5).

## Key Concepts

- **Workspace user types**
  - Console user — Fireblocks Console에서 동작 (p.1)
  - API user — API에서 동작; **API Co-signer 기능에도 사용** (p.1)
- **9 user roles** (hot workspace 기준; Sandbox는 다름)
  - [[entities/fireblocks/user-roles/owner]] · [[entities/fireblocks/user-roles/admin]] · [[entities/fireblocks/user-roles/non-signing-admin]] · [[entities/fireblocks/user-roles/signer]] · [[entities/fireblocks/user-roles/approver]] · [[entities/fireblocks/user-roles/editor]] · [[entities/fireblocks/user-roles/viewer]] · [[entities/fireblocks/user-roles/security-auditor]] · [[entities/fireblocks/user-roles/security-admin]]
- **권한표 셀 조건 라벨**
  - **Q** — Admin Quorum 승인 필요 (p.4)
  - **Q+O** — Admin Quorum **및** Owner 둘 다 승인 필요 (p.5)
  - **AG** — Approval group이 Owner를 요구하지 않는 경우에만 (p.5)
  - **NS** — Policy에 designated signer가 지정된 경우에만; NSA와 Editor는 **internal exchange transfer를 제외한 모든 트랜잭션**을 initiate 가능 (p.5)
  - **TL** — Algorand, Ripple, Solana, Stellar **토큰 wallet 생성 불가** (p.5)
- **MPC key share approval**은 서명 가능 role의 device setup에 필수 (p.1)
- **Sandbox workspace**는 별도의 role 모델(3 role) 사용 (p.8)

## Details

### 사용자 종류와 인터페이스

Console user는 Fireblocks Console에서 동작하고, API user는 API에서 동작하며 API Co-signer에 사용된다 (`user-roles.md`, p.1). MPC key share는 디바이스 단위로 Owner의 승인이 있어야 활성화되며, 승인이 없으면 서명 시도가 실패한다. 승인 대기는 `Settings > Users` Status 열의 *Pending Owner MPC Key Approval*에서 확인한다 (`user-roles.md`, p.1).

#### Console vs API user 인증 모델 차이

권한 매트릭스(9 role)는 동일하지만 **인증·자격증명·자동화 표면은 다르다**:

- **Console user**: email + (password 또는 SSO를 통한 IdP authn) **+ TOTP 2FA 필수** (`manage-your-2fa.md`, p.1; `configure-sso.md`, p.1)
- **API user**: CSR/X.509 (RSA 4096) + API key + 선택적 IP allowlist (`/32` CIDR) (`add-api-users.md`, p.1; `allowlist-ip-addresses-for-api-user-requests.md`, p.1)

**SSO는 login authorization만**을 다루며 workspace user 추가/삭제와는 분리된다 (`configure-sso.md`, p.1). 자세한 인증 통합 페이지는 [[vendors/fireblocks/authentication]].

API user의 lifecycle(Add/Re-enroll/Rename/Delete/IP allowlist)은 Console user와 별도 절차이며 [[vendors/fireblocks/lifecycle-events]] §"API User lifecycle"에 정리.

### 9 role 개요

| Role | 한 줄 정의 (출처 p.) | MPC 키 보유 | initiate | approve | sign |
|---|---|---|---|---|---|
| Owner | workspace당 1명, 모든 거버넌스의 최종 승인자 (p.1–2) | Y (provision은 Owner 단독, p.5) | Y | Y | Y |
| Admin | Signer + 네트워크/whitelist/settings/inbound complete (p.2) | Y | Y | Y | Y |
| Non-Signing Admin | 승인·관리 작업, MPC 키 없음, designated signer 흐름의 initiator/second authorizer (p.2–3) | **N** | Y (NS) | Y | N |
| Signer | initiate/approve/sign, API Co-signer + Callback Handler로도 (p.3) | Y | Y | Y | Y |
| Approver | initiate/approve, sign 불가, second authorizer 후보 (p.3) | N | Y | Y | N |
| Editor | view + wallet 추가(ALGO 토큰 제외) + exchange 연결 + cancel; designated signer 있으면 initiate (p.3) | N | Y (NS) | N | N |
| Viewer | view-only, 트랜잭션·connection 제출 불가 (p.3–4) | N | N | N | N |
| Security Auditor | Settings/Policies/FSPM 포함 read-only (p.4) | N | N | N | N |
| Security Admin | user/2FA/IP allowlist/FSPM 관리, MPC 키 없음, initiate/sign 불가, Admin Quorum 참여 (p.4) | N | N | N | N |

### Owner의 특수성

Owner role은 **Fireblocks Support로만 임명**되며, role 변경·디바이스 마이그레이션·workspace unfreeze 시 영상 통화 신원 확인이 요구된다 (p.2). **Provision MPC signing keys 권한은 Owner 단독** (p.5). 책임 영역에는 서명 디바이스·MPC key share 승인, 신규 사용자 승인, Policy 변경 승인 (Admin Quorum과 함께), API key 생성, 사용자 삭제, 2FA reset, workspace freeze/backup/recovery 등 emergency 작업이 포함된다 (p.2).

### Transfer Owner

Owner identity 의 이전 (사망 / 부재 / 회사 합병 시) 은 **Console 자체로는 불가** — Fireblocks Support 경유 필수. `transfer-workspace-owner.md` (Stage 3, p.1–2):

- 현 Owner 가 참여 가능: 영상 통화 신원 확인 → Support 가 신임 Owner 지명
- 현 Owner 부재: Board resolution + stakeholder quorum 으로 신임 Owner 지명 (정확한 형식 요건은 [[open-questions/fireblocks]] Q-O02 / Q-O03)
- name·email 변경 불가 (Owner identity 자체 변경은 Transfer 절차 한정)

→ entity-level 명세는 [[entities/fireblocks/user-roles/owner]] §"Transfer Owner". Lifecycle 흐름 cross-cut 은 [[vendors/fireblocks/lifecycle-events]].

### 거버넌스 흐름

- **사용자 추가**: Owner와 Admin Quorum 승인 필요 (권한표 셀이 `Y (Q)`) (p.5).
- **사용자 삭제**: 기본은 Owner. Admin은 `Y (AG)` — Approval group이 위임된 경우 가능 (p.5).
- **Admin Quorum 변경 / Policy 변경**: Q+O — Quorum과 Owner 모두 승인 (p.7).
- **API User/Key IP Allowlist 수정, 2FA reset**: Owner와 Security Admin만 가능 (p.5).
- **Admin Quorum 멤버**: 권한표 *Participate in the Admin Quorum* 행에 따르면 Owner, Admin, Non-Signing Admin, Security Admin이 ✓ (p.7).

### NSA와 Editor의 designated-signer 패턴

NSA와 Editor는 MPC 키를 갖지 않지만, Policy가 **designated signer**를 지정한 트랜잭션 타입에 대해 트랜잭션을 initiate할 수 있다. 권한표는 이 조건을 `Y (NS)`로 표기한다. NSA와 Editor는 **internal exchange transfer를 제외한 모든 트랜잭션**을 이 방식으로 initiate할 수 있다 (p.3, p.5).

### Token Limits (TL)

Editor, Approver, Non-Signing Admin이 wallet을 추가할 때 **Algorand, Ripple, Solana, Stellar 토큰 wallet**은 생성할 수 없다. Editor 본문 설명에도 "add wallets (except for Algorand token wallets)"라고 별도 언급된다 (p.3, p.5, p.7).

### Add / Edit / Delete (lifecycle 절차)

User lifecycle의 구체 절차·거버넌스 흐름은 [[vendors/fireblocks/lifecycle-events]]로 분리.

핵심만 요약:

- **Add**: actor는 본문상 Owner / Admin / NSA (`add-users.md`, p.1). 권한표(`user-roles.md`, p.5)는 **Security Admin도 `Y (Q)`** 로 포함 — 본문/표 불일치는 [[open-questions/fireblocks]] Q-2026-05-18-L02.
- **Add (signing role)**: Owner가 추가로 MPC key share derivation을 별도 승인 (`add-users.md`, p.1).
- **Edit**: 본문에서는 "Admin-level users" (`edit-users.md`, p.1). 권한표는 O/A/NSA/SecAdmin (`user-roles.md`, p.5). "Admin-level" 정의는 Q-2026-05-18-L01.
- **Edit는 name·email만**. Role 변경은 별도 절차(delete+re-add 또는 Fireblocks Support, `edit-users.md`, p.1–2).
- **Delete (default)**: Owner 단독, 즉시, mobile approval 불요 (`delete-users.md`, p.1).
- **Delete 위임**: `Settings > Quorums > Approval groups`에서 *Delete users* row의 Owner 요구를 끄면 권한표의 `Admin Y (AG)`가 활성화 (`delete-users.md`, p.1–2).
- **Mobile device 재등록**: "Admin-level users" (`re-enroll-a-users-mobile-device.md`, p.1) — Edit/Re-enroll/Rename 모두 같은 표현. Q-L01·A01 추적.
- **2FA reset**: 본문은 "Workspace Owners" 한정 (`reset-a-users-2fa.md`, p.1); 권한표는 Owner / Security Admin (`user-roles.md`, p.5). 본문/표 불일치 패턴 반복.
- **Owner 본인 절차** (2FA reset / device 재등록 / role transfer): **모두 Fireblocks Support 영상 통화** — Console 불가. 분석은 [[vendors/fireblocks/risks]] Owner SPOF 절 참조.
- **Emergency Workspace Freeze**: Owner / Admin / Non-Signing Admin / Security Admin **4 role 모두 freeze 가능** (`freeze-workspace.md`, p.1) — 권한표 *Freeze the workspace* 행과 정합 (`user-roles.md`, p.8). **Unfreeze는 Owner만, Support 경유 필수**. 자세한 흐름은 [[vendors/fireblocks/lifecycle-events]] §"Emergency Workspace Freeze".

### Cosigner 관련 명시

- Signer는 Console+mobile 또는 **"programmatically via an API Co-signer and Callback Handler"** 로 동작한다 (p.3).
- NSA는 mainnet Co-signer 또는 **Fireblocks Communal API Co-signer**(testnet)에서 workspace 설정 승인용 API user로 사용된다 (p.3).
- API Co-signer 내부 구조, Callback Handler payload 등은 본 자료에서 다루지 않음 → [[entities/fireblocks/api-co-signer]] · [[entities/fireblocks/callback-handler]] · Open Questions 참조.

### Developer Sandbox에서의 차이

Sandbox workspace는 무료, 개발용으로 다음 특성을 갖는다 (p.8):

- API user 생성 시 CSR 인증서가 브라우저에서 자동 생성
- Developer Area API Monitoring 24h/7d
- **모바일 서명 디바이스 불필요. 모든 트랜잭션 auto-approve.**
- 제공 role은 3개: **Non-Signing Admin, Editor, Viewer**
- backend service가 Owner role을 맡고 auto-approval 처리
- **Sandbox의 NSA는** mainnet/testnet에 없는 추가 능력을 가짐: user create/delete, 2FA reset, **트랜잭션 sign** (이름과 달리)

자세한 사항은 [[entities/fireblocks/sandbox-workspace]] 참고.

## Related Pages

- [[vendors/fireblocks/lifecycle-events]] — Add/Edit/Delete 절차와 거버넌스 흐름
- [[entities/fireblocks/user]] — 통합 User entity (status: pending/active/deleted)
- [[entities/fireblocks/workspace]] — workspace 자체
- [[entities/fireblocks/sandbox-workspace]] — Sandbox 종류
- [[entities/fireblocks/console-user]] — Console 인터페이스 사용자
- [[entities/fireblocks/api-user]] — API 인터페이스 사용자
- [[entities/fireblocks/admin-quorum]] — Q 라벨의 의사결정 그룹
- [[entities/fireblocks/approval-group]] — AG 라벨의 위임 그룹
- [[entities/fireblocks/designated-signer]] — NS 라벨의 메커니즘
- [[entities/fireblocks/mpc-key-share]] — provisioning 권한 (Owner 단독)
- [[entities/fireblocks/policy]] — Policy 변경의 Q+O
- [[entities/fireblocks/transaction]] — 권한표 동사 vocabulary
- [[entities/fireblocks/vault-account]] — Assets and addresses 표
- [[entities/fireblocks/cosigner]] · [[entities/fireblocks/api-co-signer]] · [[entities/fireblocks/callback-handler]]
- [[vendors/fireblocks/overview]] — 벤더 개요
- [[vendors/fireblocks/cosigner]] — Cosigner 벤더 페이지

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1–8
  - 원본 URL: https://support.fireblocks.io/hc/en-us/articles/360012832959-User-roles
- `2026-05-18__support-fireblocks-io__add-users.md`, p.1 (Add actor 본문/표 불일치 cross-ref)
- `2026-05-18__support-fireblocks-io__edit-users.md`, p.1 (Edit actor "Admin-level" 표현)
- `2026-05-18__support-fireblocks-io__delete-users.md`, p.1–2 (Delete default + AG 위임)
- `2026-05-18__support-fireblocks-io__reset-a-users-2fa.md`, p.1 (Stage 3: 2FA reset actor)
- `2026-05-18__support-fireblocks-io__re-enroll-a-users-mobile-device.md`, p.1 (Stage 3: device re-enroll actor)
- `2026-05-18__support-fireblocks-io__transfer-workspace-owner.md`, p.1 (Stage 3: Owner identity 절차)
- `2026-05-18__support-fireblocks-io__freeze-workspace.md`, p.1 (Stage 6: Emergency freeze 4 role)

## Open Questions

본 페이지와 직접 관련된 미해결 항목 (전체는 [[open-questions/fireblocks]] 참조):

- Q-2026-05-18-G01 — Admin Quorum threshold(N of M)는 어떻게 결정·변경되는가?
- Q-2026-05-18-G02 — Q+O 라벨의 정확한 의미 (Owner가 Quorum count에 포함되는가?)
- Q-2026-05-18-G03 — Approval group과 Admin Quorum의 멤버십·우선순위 관계?
- Q-2026-05-18-G04 — Admin Quorum 멤버 자격: O/A/NSA/SecAdmin이 자동 가입인지 별도 지정인지?
- Q-2026-05-18-P01 — designated signer / second authorizer의 룰 표현 문법? — **부분 해소 (Stage 51)**: 한 Policy rule 에서 **Source=특정 vault + Designated Signer=특정 API user 결합 가능**(콘솔 1차 확인 2026-06-16). designated signer(API user)가 곧 호출될 Callback Handler 를 결정 → vault 별 CH 라우팅 가능 ([[entities/fireblocks/api-co-signer]] §"Stage 51"). 잔존: 연산자·우선순위 등 정밀 문법.
- Q-2026-05-18-P02 — NSA·Editor의 NS 라벨이 "internal exchange transfer 제외"인데, 그 외 트랜잭션 타입의 정의 위치?
- Q-2026-05-18-P03 — "Smart transfer ticket"과 "Automation rule"의 정의·차이?
- Q-2026-05-18-O01 — TL이 ALGO/XRP/SOL/XLM에만 적용되는 이유?
- Q-2026-05-18-W01 — hot/cold/Sandbox 세 종류의 비교 자료 필요 (본 자료는 hot 한정)
- Q-2026-05-18-L01 — "Admin-level users"의 정확한 role 집합 정의
- Q-2026-05-18-L02 — Add users 본문(O/A/NSA)과 권한표(+SecAdmin) 불일치

**Q-2026-05-18-G02는 Stage 2에서 ANSWERED** — Owner approval은 mandatory이며 threshold count에 포함 가능 (source: `add-users.md`, p.1). 적용처는 [[entities/fireblocks/admin-quorum]] Details 참조.
