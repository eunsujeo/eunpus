# Fireblocks — Lifecycle Events

> Workspace user / 디바이스 / Owner의 lifecycle 이벤트(생성·수정·역할 변경·삭제·재인증·이전)와 각 단계의 거버넌스·운영 함의.

## Summary

Fireblocks workspace에서 사용자와 핵심 자원의 lifecycle을 다루는 페이지. **Stage 2에서는 User lifecycle (Add / Edit / Role change / Delete)만 다룸**. Device re-enrollment, 2FA reset, Owner transfer 등은 Stage 3에서 추가 예정.

핵심 비대칭: **Add와 Edit는 모바일 기반 비동기 승인(Q)** 흐름인 반면, **Delete는 기본 Owner-only이며 mobile approval 없이 즉시 수행**된다 (sources: `add-users.md` p.1; `edit-users.md` p.1; `delete-users.md` p.1).

## Key Concepts

- **Add user** — Q (Owner + Admin Quorum), **7-day expiry**, signing-capable role은 **MPC key share derivation 별도 Owner 승인** (`add-users.md`, p.1)
- **Edit user (name/email)** — Q (Owner + Admin Quorum), **Approval groups로 customize 가능** (`edit-users.md`, p.1)
- **Role change** — Console 직접 변경 ✗. 옵션 A: delete + re-add / 옵션 B: Fireblocks Support 요청 (`edit-users.md`, p.1–2)
- **Delete user** — 기본 Owner 단독, 즉시, mobile approval 없음. AG 위임 시 Admin도 가능 (`delete-users.md`, p.1)
- **Owner counting rule** — Q+O 류 흐름에서 Owner의 승인은 mandatory이며 **threshold count에 포함될 수 있다** (`add-users.md`, p.1)
- 사용자 lifecycle status: `pending` → `active` → `deleted` (3개 자료에서 합성)

## Details

### Add (생성)

**Actor 권한 (본문 기준)**: Workspace Owner / Admin / Non-Signing Admin (`add-users.md`, p.1).
※ User roles 권한표(`user-roles.md`, p.5)에서는 Security Admin도 `Add Console or API users — Y (Q)`로 표기되어 있으나 Add users 본문은 SecAdmin을 언급하지 않음. 본문/표 불일치는 [[open-questions/fireblocks]] Q-2026-05-18-L02 참조.

**절차** (p.1):

1. `Settings > Users > Add user`
2. name, email, role 입력
3. `Add user` 확정

**승인 흐름** (p.1):

- Owner와 [[entities/fireblocks/admin-quorum]]이 모바일로 approval request 수신
- **threshold는 7일 안에 충족되어야 함. 미충족 시 request expire하고 사용자 추가되지 않음**
- Owner approval은 mandatory이며 threshold count에 포함될 수 있음. 예: threshold 3 of 5 →
  - 2 Admin + Owner = 충족
  - 3 Admin 단독 → Owner 추가 승인 전까지 미충족

**Signing-capable role의 추가 승인** (p.1):

- 새 사용자가 서명 가능 role이면 Owner가 그 사용자의 **MPC device key share derivation**도 별도로 승인해야 함
- 초기 user-add 승인과 **분리된 별개 승인**이며 둘 다 받아야 active

**후속**: Owner+Quorum 승인 후 사용자가 **initial user setup process**를 완료 (p.2). setup 내부 절차는 본 자료에 없음.

### Edit (수정)

**Actor 권한 (본문)**: "Admin-level users" — 정확한 role 집합 정의는 본 자료에 없음 (`edit-users.md`, p.1). 권한표(`user-roles.md`, p.5) *Edit user details (name and email)* 행: Owner / Admin / NSA / Security Admin이 ✓.

**대상 필드**: first name, last name, email **만** 편집 가능. **Role은 별도 절차** (p.1).

**제약 조건** (p.1):

- **Workspace Owner는 자신의 name·email 변경 불가** (Owner identity 인프라 별도 → [[entities/fireblocks/user-roles/owner]] / [[vendors/fireblocks/user-management]] §"Transfer Owner" 의 별도 governance plane)
- 변경은 **setup process 시작 전 또는 완료 후**에만 가능 (진행 중에는 불가)
- 변경은 **현재 workspace에만 적용**, 다른 linked workspace 무영향
- **workspace 내 모든 사용자의 email은 unique**

**절차**:

1. `Settings > Users > ⋮ > Edit user`
2. first name / last name / email 입력
3. `Save changes`

**승인 흐름** (p.1):

- 저장 즉시 사용자에게 변경 알림 메일(변경자 ID 명시)
- Owner + Admin Quorum에 approval request
- 승인 후 변경 적용 + 사용자에게 확인 메일

**Customization**: **You can use Approval groups to customize this approval flow** (p.1). 구체적 customize 항목은 본 자료에 명시 없음 → [[open-questions/fireblocks]] Q-2026-05-18-L06.

### Role change (역할 변경)

**Console 직접 변경 불가** (p.1).

**옵션 A — Delete + Re-add**:

1. 삭제 전 검증: 그 사용자가 Policy rule 또는 Admin Quorum threshold 충족에 필요한지 (p.2)
2. Delete the user
3. Add the user again with new role

→ 다음 절(Delete)과 Add 절의 거버넌스를 순차로 거침 (Owner immediate delete → Owner+Quorum approval, 7-day window 등).

**옵션 B — Fireblocks Support 요청** (p.2):

- delete+recreate가 detrimental일 때
- Support form:
  - `Tasks: User Operations`
  - `User Operations: Change user's role`
- SLA guidelines 적용 (별도 문서 참조)

### Delete (삭제)

**Actor 권한 (default, 본문)**: workspace Owner. **즉시 수행, mobile approval 불요, access 즉시 박탈** (`delete-users.md`, p.1).
※ 권한표(`user-roles.md`, p.5)는 `Admin Y (AG)`, `Security Admin Y`도 명시. AG의 메커니즘은 하단 "Allow Admins to delete users" 참조.

**삭제 전 검증** (p.1):

- 그 사용자가 [[entities/fireblocks/admin-quorum]] threshold에 필요한지
- 그 사용자가 [[entities/fireblocks/policy]] rule을 충족하는 데 필요한지

urgent revoke가 필요해 사전 검증 없이 삭제하면 → **해당 사용자가 필요했던 Policy rule은 수정·승인 전까지 block** 상태 (p.1).

**절차**: `Settings > Users > ⋮ > Delete User` (p.1).

**부수 효과** (p.1):

- workspace access 즉시 박탈
- 다른 workspace에 access 있으면 영향 없음
- **Fireblocks가 사용자의 cloud-based key shares를 삭제** (Fireblocks가 cloud에 일부 key share를 보유한다는 사실의 직접 확인)
- 사용자의 activity는 **transaction history와 audit logs에 보존** (감사 추적성)
- user ID는 user list에 status **`deleted`** 로 남음 → 재사용 가능성 불명 ([[open-questions/fireblocks]] Q-2026-05-18-L05)

**Approval group 위임 — Admin이 삭제 가능하게 하기** (p.1–2):

1. `Settings > Quorums > Approval groups`
2. `User management > Delete users` row의 `Edit`
3. **Approval permission**을 `admin quorum or approval group`로 설정
4. **`Requires workspace owner approval` uncheck**
5. `Save`

이 위임이 활성화된 후 권한표상 Admin의 `Y (AG)`가 실제로 동작한다.

## Mobile Device lifecycle (Stage 3 추가)

Console user의 모바일 디바이스는 **MPC key share + 2FA TOTP + mobile app passphrase/6-digit PIN**의 호스트이며, 디바이스 lifecycle event가 발생하면 재등록(re-enroll) 절차를 거친다 ([[entities/fireblocks/mobile-device]]).

### Trigger

`re-enroll-a-users-mobile-device.md`, p.1:

- 디바이스 biometric 설정 변경
- Fireblocks mobile app 제거
- 새 디바이스에 mobile app 설치
- **6-digit PIN 분실**

### Actor

- 다른 user의 device 재등록: **"Admin-level users"** (Stage 2~4 동일 표현 — Q-L01·A01 적용)
- 권한표 *Re-enroll devices*: Owner / Admin / NSA / Security Admin = `Y (Q)` (`user-roles.md`, p.5)

### 흐름

1. `Settings > Users > ⋮ > Re-enroll mobile device` (`re-enroll-a-users-mobile-device.md`, p.1)
2. Owner에게 approval request 전송
3. Owner 승인 후 사용자가 Console 로그인 → QR 스캔 → in-app instructions

### Signing role 사용자의 2-day × 2단계 윈도우

`re-enroll-a-users-mobile-device.md`, p.1 — signing 가능한 role의 사용자가 device를 재등록한 경우:

1. 사용자가 device 재등록 완료
2. **Owner가 2일 내**에 MPC key shares 재승인
3. **사용자가 다시 2일 내**에 MPC registration 완료

만료 시 동작은 본 자료에 명시 없음 → Q-2026-05-18-D03.

### Linked users / linked workspaces

> "If other users or workspaces are linked to the device, they must each be re-enrolled individually." (`re-enroll-a-users-mobile-device.md`, p.1)

한 모바일 디바이스가 multiple users 또는 multiple workspaces의 host가 되는 모델이 존재한다. 격리 모델 세부는 본 자료에 없음 → Q-2026-05-18-D02.

### Owner 본인 디바이스

**Console 불가 → Fireblocks Support 경유**. 다른 workspace의 Owner라도 동일 (`re-enroll-a-users-mobile-device.md`, p.1). Stage 1 `user-roles.md` p.2의 "Owner wants to … migrate to a new mobile device, … verify their identity with Fireblocks Support via a short video call"과 정합.

---

## User-level 2FA Reset (Stage 3 추가)

Console user의 2FA reset 흐름. self-service `Manage your 2FA` (Stage 4)와 짝.

### 다른 user의 2FA reset

**Actor**: workspace Owner. 권한표는 *Reset 2FA*: Owner / Security Admin = ✓ (`user-roles.md`, p.5). 본문(`reset-a-users-2fa.md`, p.1)은 "Workspace Owners"만 명시 — Security Admin 포함 여부는 본문/표 불일치 (Q-L02 패턴).

**절차** (`reset-a-users-2fa.md`, p.1):

1. `Settings > Users > ⋮ > Reset 2FA`
2. 사용자에게 확인 메일 발송
3. 사용자는 다시 로그인하여 2FA 앱 재설정 (`manage-your-2fa.md`, p.1 참조)

**중요**: reset해도 로그인 email/password는 변경되지 않음 (`reset-a-users-2fa.md`, p.1).

### Owner 본인의 2FA reset

**Console 불가 → Fireblocks Support 경유** (`reset-a-users-2fa.md`, p.1).

SSO 사용자가 Fireblocks 접근을 잃었을 때도 Owner에게 2FA reset 요청이 유일 경로 (`reset-your-password.md`, p.1).

---

## Owner Transfer (Stage 3 추가)

Owner role 자체를 다른 사용자에게 이전하는 critical lifecycle event. **모든 절차가 Fireblocks Support 경유** ([[entities/fireblocks/user-roles/owner]]).

### 사전 조건

`transfer-workspace-owner.md`, p.1:

- 신임 Owner가 **Admin or Signer** role 보유
- 신임 Owner가 fully onboarded — **MPC key shares 생성 완료**
- 활성 Policies가 신임 Owner의 서명을 허용

### Workspace Keys Backup 결정 (이전 전 강제)

현 Owner가 [[entities/fireblocks/workspace-keys-backup]]을 만들었다면 이전 **전**에 조직 차원에서 결정:

- **유지** — 현 Owner의 [[entities/fireblocks/recovery-passphrase]]로 암호화된 상태 잔존
- **파기** — 신임 Owner가 본인 recovery passphrase로 새 backup 생성 (`transfer-workspace-owner.md`, p.1)

### Support 제출

`transfer-workspace-owner.md`, p.1:

- 정확한 workspace 이름
- 현 Owner 이름 + workspace email
- 신임 Owner 이름 + workspace email

### 검증

**양쪽 Owner 모두**:
- Fireblocks Support와 짧은 영상 통화 신원 확인
- 이전 승인

**신임 Owner**:
- 본인의 **recovery passphrase verify** (`transfer-workspace-owner.md`, p.1)

### SLA

전체 이전 **3–5 business days** (`transfer-workspace-owner.md`, p.1).

### 현 Owner 부재 경로 (board resolution)

`transfer-workspace-owner.md`, p.1–2 — 현 Owner가 이전에 참여할 수 없을 때:

1. 회사 이사회의 stakeholder **quorum**이 Fireblocks Support에 연락
2. 공식 **board resolution**으로 신임 Owner 임명
3. Support 승인 후 동일 verification 진행

"Owner 부재"의 정의(사망/incapacitated/uncooperative)·검증 기준은 명시 없음 → Q-2026-05-18-O02.
board resolution의 형식 요건도 명시 없음 → Q-2026-05-18-O03.

### Owner-touching 절차의 공통 패턴

세 Stage 3 자료가 일관되게 보여주는 패턴 — **모든 Owner-touching 절차는 Fireblocks Support 영상 통화 신원 확인 경유**:

| 절차 | Console 가능 (다른 사용자) | Owner 본인 |
|---|---|---|
| 2FA reset | ✓ (Owner가 수행) | Support |
| Mobile device re-enroll | ✓ ("Admin-level users") | Support |
| Workspace unfreeze | (Stage 1) | Support |
| Owner role 임명 | — | Support |
| Owner role 이전 | — | Support + 영상 통화 양쪽 |

[[vendors/fireblocks/risks]]의 SPOF 분석 참고.

---

## API User lifecycle (Stage 4 추가)

API user는 Console user와 **동일한 9 role 매트릭스**를 공유하지만 인증·자격증명·자동화 표면이 다르다. lifecycle도 별도 절차를 가진다.

### Add (API user 생성)

**두 단계** (`add-api-users.md`, p.1):

1. CSR 생성 (RSA 4096): `openssl req -new -newkey rsa:4096 -nodes -keyout fireblocks_secret.key`
2. Console에서 API user 생성: `Developer Center > API users > Add API user` (Name, Role, CSR file, Co-signer setup)

**Co-signer 옵션** (`add-api-users.md`, p.2):
- 일반 Co-signer 선택
- **Fireblocks Communal Test Co-signer** (testnet 전용, 검증 목적)
- **SGX Co-signer 신규 설치 시 "First user on this machine" 체크**

**승인 흐름**: Console user Add와 **동일** — Owner + Admin Quorum (`add-api-users.md`, p.2). 7-day expiry 명시는 본 자료에 없으나 "same approval flow"라는 표현이 곧 동일 룰 적용을 시사.

**CSR 재사용 정책**:
- mainnet: 재사용 금지 (`add-api-users.md`, p.1)
- testnet: read-only API user에 한해 재사용 가능 (`add-api-users.md`, p.1)

### Re-enroll (API user 재등록)

**Trigger** (`re-enrolling-api-users.md`, p.1):
- 초기 Co-signer 서버 setup 오류
- 신·기존 Co-signer 인스턴스 페어링
- Co-signer Callback Handler 설정 변경 (예: 인증 방식 전환)

**Actor**: "Admin-level users" (Console user Edit과 동일 표현, Q-L01 적용)

**절차** (`re-enrolling-api-users.md`, p.1):
1. `Settings > Users > ⋮ > Re-enroll API user`
2. Owner 승인
3. API user와 Co-signer 페어링 (**pairing token 1시간 유효**)
4. Owner가 Co-signer의 key shares 승인

**Troubleshooting** (`re-enrolling-api-users.md`, p.1–2):
- HTTP 500 "Failed to pair device" → pairing token 만료. fresh token으로 재페어링
- "SSL public key does not match pinned public key" → Callback Handler SSL cert 변경/만료. 재페어링 + Owner key share 승인

### Rename (API user 이름 변경)

**Actor**: "Admin-level users" (`rename-and-delete-api-users.md`, p.1)
**중요**: API key 불변, integration 영향 없음. **Rename은 reversible**.
**승인**: Owner + Admin Quorum (`rename-and-delete-api-users.md`, p.1)
**경로**: `Developer Center > API users > ⋮ > Rename`

### Delete (API user 삭제)

**기본**: workspace Owner 단독, **즉시, mobile approval 불요** (`rename-and-delete-api-users.md`, p.1).

**삭제 전 검증** (Console user Delete와 동일 패턴) (`rename-and-delete-api-users.md`, p.1):
- Admin Quorum threshold 충족에 필요한지
- Policy rule 충족에 필요한지
- **활성 서드파티 통합이 사용 중인지** (삭제 시 통합 중단)

**부수 효과** (`rename-and-delete-api-users.md`, p.2):
- workspace access 즉시 박탈
- **API key 즉시 invalid → 서드파티 통합 중단**
- **In-flight transactions (그 API user 서명) 실패. 새 서명 요청 거부**
- **Co-signer 페어링은 그대로 유지 — Unpairing은 별도 작업** ([[open-questions/fireblocks]] Q-2026-05-18-A02)
- audit logs에 activity 보존
- API user list에 항목 잔존 (status 표기는 본 자료에 없음 — Console user의 `deleted` 상태와 동일 가정은 불확실)

**Approval group 위임**: "configure the same **Delete users** permission used for Console users" (`rename-and-delete-api-users.md`, p.2) — **Console user Delete와 동일 설정 평면 공유**.

### IP allowlist 설정 (API user 한정)

**Actor**: Workspace Owner 단독 (본문), 권한표(`user-roles.md`, p.5)는 Security Admin도 ✓ — 불일치 (Q-L02 cross-ref).
**경로**: `Developer Center > API users > ⋮ > Allowlist IP address` (`allowlist-ip-addresses-for-api-user-requests.md`, p.1)
**제약**: `/32 CIDR`만, range 미지원.

### Console user vs API user lifecycle 비교

| 항목 | Console user | API user |
|---|---|---|
| Add actor | O / A / NSA (본문), +SecAdmin (표) | (본문 actor 명시 없음) — 같은 approval flow |
| Add 인증 자산 | (사용자 본인의 mobile + email + password) | **CSR + Co-signer 페어링** |
| Edit/Rename | name/email (Q 흐름) | name만 (Q 흐름). API key 불변 |
| Role 변경 | direct ✗ — delete+re-add 또는 Support | (본 자료 명시 없음; 동일 패턴 추정 → Open Question) |
| Delete default | Owner 즉시 | Owner 즉시 |
| Delete AG 위임 | `Settings > Quorums > Approval groups > User management > Delete users` | **위와 동일 설정 사용** |
| Network gate | (없음) | **IP allowlist `/32`** |
| Re-enroll | mobile device 재등록 (Stage 3) | Co-signer 재페어링 + Callback Handler 인증 변경 시 |
| Cloud key share 삭제 | Y (`delete-users.md`) | (본 자료 명시 없음 — Co-signer key share 처리는 unpair 별도 작업) |

## Emergency Workspace Freeze (Stage 6 추가)

`freeze-workspace.md`, p.1 + Stage 1 `user-roles.md`, p.8 (권한표 *Freeze the workspace*):

### Actor

**Admin-level 4 role** (Owner / Admin / Non-Signing Admin / Security Admin) — 본문 명시. 권한표(`user-roles.md`, p.8 *Freeze the workspace*)와 정합.

### Freeze 동작

`freeze-workspace.md`, p.1:

- **모든 user role이 Viewer로 강제 변경** (Owner 포함)
- 차단되는 활동:
  - Transfer 발행
  - Address whitelisting
  - 새 fiat·exchange connection
  - 새 P2P Network connection
- **Incoming transfers는 계속 수신** (자동 완료 vs Pending 처리는 미명세 → Q-O05)

### 절차

`Settings > General > Freeze workspace > Freeze workspace`

### Unfreeze

- **Owner만** unfreeze 요청 가능
- **Fireblocks Support 경유** 필수 (Console 불가)
- Owner identity verification 흐름 통과 (Stage 1 cross-ref)

### Owner identity 절차 패턴과의 정합

Stage 3에서 확인된 "모든 Owner-touching critical 작업은 Support 영상 통화 신원 확인 경유" 패턴에 정합:

- Owner role 임명·이전 → Support
- Owner 본인 2FA / device 재등록 → Support
- **Workspace unfreeze → Support** (본 Stage 6에서 절차 확정)

운영 함의: Freeze는 4 role의 즉각 응급조치 평면, Unfreeze는 Owner identity 인프라 의존. 두 비대칭이 emergency response 모델의 핵심.

자세한 위험·완화는 [[vendors/fireblocks/risks]] §Owner SPOF · §Console vs Mobile 비대칭 / Workspace freeze는 [[entities/fireblocks/workspace]] §"Freeze 모델"에서도 통합.

## Mobile App-Side Lifecycle (Stage 5 추가)

Stage 3은 admin-driven device 재등록을 다루고, Stage 5는 **mobile app 자체에서 수행되는 lifecycle event**들을 추가한다.

### Device Migration (self-service, Stage 5)

`device-migration.md`, p.1–2 — Stage 3의 admin-driven re-enroll과 **다른 lifecycle**:

| | Stage 3 Re-enroll (admin-driven) | Stage 5 Migration (self-service) |
|---|---|---|
| **Actor** | "Admin-level users" Console에서 | Mobile app 사용자 본인 |
| **승인** | Owner approval (signing role은 +MPC 2-day window) | **관리자 승인 없음** |
| **사전 조건** | (없음, 즉시 시작) | **Owner가 Settings > General > Linked user migration 활성화** |
| **흐름** | Console → Owner approve → QR scan | Old device export(PIN+passphrase+biometric) → QR(1h) → New device import(new PIN+biometric+passphrase) |
| **결과** | 사용자가 새 device에서 setup | Old device의 user/keys 자동 삭제, confirmation email |
| **위험 노트** | Stage 3 표준 흐름 | **Security warning** 명시: "no administrative approval. Security risks if new device is compromised." (`device-migration.md`, p.1) |

→ [[vendors/fireblocks/risks]]에서 Owner enablement의 거버넌스 trade-off 분석.

**Old device 미가용 시**: Owner는 Support, 다른 user는 Owner에게 re-enrollment 요청 → Stage 3 admin-driven 흐름으로 fallback (`device-migration.md`, p.2).

### Recovery Passphrase Reset (mobile app self-service, Stage 5)

`reset-an-admin-or-signers-recovery-passphrase.md`, p.1 + `reset-the-owners-recovery-passphrase.md`, p.1–2.

**Admin / Signer**:
1. Mobile app: `Settings > Change Passphrase` (Android) / `Settings > Reset Recovery Passphrase` (iOS)
2. PIN → new passphrase (10+자/대문자/숫자/특수) → biometric
3. 끝 — 다음 Key Share Recovery 시 사용 가능

**Owner** (위 + 추가):
4. **기존 recovery package 파기 권장** (`reset-the-owners-recovery-passphrase.md`, p.1):
   - Organization-managed: 내부 파기
   - Third-party DRS: provider에게 파기 요청
5. **새 recovery package 요청** (`reset-the-owners-recovery-passphrase.md`, p.2):
   - Offline backup: Fireblocks Support
   - Third-party DRS: Fireblocks Support → DRS provider recreate

→ Q-W02 (Stage 3 미해소) **해소**: 분실/잊음 시 mobile app self-service 가능. Owner만 외부 recovery package 별도 요청 필요. [[entities/fireblocks/recovery-passphrase]] §"Reset" 참조.

### Re-adding a User to the Mobile App (Stage 5)

`re-adding-a-user-to-the-fireblocks-mobile-app.md`, p.1:

1. Mobile app `Linked users`에서 user remove (Android 3-dots / iOS swipe + Delete)
   - 또는 record가 없으면 step 2로 바로
2. Fireblocks Console → relevant workspace → mobile app registration sequence 재시작

이는 device-side cleanup 후 console-side 재등록을 결합한 절차로, Stage 3의 admin-driven re-enroll과 사용자가 직접 수행할 수 있는 self-service 경로의 차이.

### Linked Users 관리 (UX 평면)

`linked-users-fireblocks-mobile-app.md`, p.1–2 — mobile app의 `Linked Users` 화면:

- **View** all linked users + workspaces
- **Link new**: + 버튼 → PIN 확인 → Console QR scan
- **Remove**: Android 3-dots → Remove User / iOS swipe left → Delete. **사용자에게 알림 없음**.

각 user-workspace 페어는 device에 별도 등록되므로 한 lifecycle event(re-enroll/migration 등)는 해당 user-workspace 페어만 영향. 다른 linked user/workspace는 별도 처리 필요.

## Governance 매트릭스 (요약)

| 작업 | 본문 명시 actor | 권한표 actor | 라벨 | mobile approval | 즉시? | Owner-required by default |
|---|---|---|---|---|---|---|
| Add | O / A / NSA | + SecAdmin | Q | **Y** | N (7-day window) | O는 mandatory (count 포함) |
| Add (signing role) | O가 MPC도 별도 승인 | — | Q + MPC 별도 | Y | N | O |
| Edit (name/email) | "Admin-level" | O / A / NSA / SecAdmin | Q (customize via AG) | Y | N | O |
| Role change | (별도 절차) | — | — | — | — | — |
| Delete (default) | Owner | + A (Y(AG)), SecAdmin | — | **N** | **Y (immediate)** | **Y** |
| Delete (AG 위임) | + Admin | — | AG | (본문 명시 없음) | (본문 명시 없음) | **N (uncheck됨)** |

## Related Pages

- [[vendors/fireblocks/authentication]] — Console/API user 인증 모델
- [[vendors/fireblocks/risks]] — Owner SPOF / DR 모델
- [[entities/fireblocks/user]] — 통합 User entity (status: pending/active/deleted)
- [[entities/fireblocks/mobile-device]] — Mobile device 호스트 평면
- [[entities/fireblocks/recovery-passphrase]] · [[entities/fireblocks/workspace-keys-backup]] — Owner identity·DR 자산
- [[vendors/fireblocks/mobile-app]] — Mobile app 제품 전반 (Stage 5)
- [[vendors/fireblocks/security]] — Security checklist 운영 hub (Stage 6)
- [[entities/fireblocks/admin-quorum]] — Q / Q+O 흐름과 Owner counting 룰
- [[entities/fireblocks/approval-group]] — Edit/Delete의 customize 평면
- [[entities/fireblocks/policy]] — user 삭제가 rule을 block 시킬 수 있음
- [[entities/fireblocks/mpc-key-share]] — cloud-based key share 삭제, derivation 별도 승인
- [[entities/fireblocks/user-roles/owner]] · [[entities/fireblocks/user-roles/admin]] · [[entities/fireblocks/user-roles/non-signing-admin]] · [[entities/fireblocks/user-roles/security-admin]]
- [[vendors/fireblocks/user-management]] — 9 role 매트릭스
- [[vendors/fireblocks/api]] — API user surface
- [[vendors/fireblocks/cosigner]] — Co-signer 페어링
- [[entities/fireblocks/csr]] · [[entities/fireblocks/api-key]] · [[entities/fireblocks/ip-allowlist]]
- [[vendors/fireblocks/overview]]

## Sources

- `2026-05-18__support-fireblocks-io__add-users.md`, p.1–2
  - 원본 URL: https://support.fireblocks.io/hc/en-us/articles/360021546999-Add-users
- `2026-05-18__support-fireblocks-io__edit-users.md`, p.1–2
  - 원본 URL: https://support.fireblocks.io/hc/en-us/articles/9747031353244-Edit-users
- `2026-05-18__support-fireblocks-io__delete-users.md`, p.1–2
  - 원본 URL: https://support.fireblocks.io/hc/en-us/articles/4404971260050-Delete-users
- (cross-ref) `2026-05-18__support-fireblocks-io__user-roles.md`, p.5 (권한표 SecAdmin 행)
- `2026-05-18__support-fireblocks-io__add-api-users.md`, p.1–2 (Stage 4)
- `2026-05-18__support-fireblocks-io__re-enrolling-api-users.md`, p.1–2 (Stage 4)
- `2026-05-18__support-fireblocks-io__rename-and-delete-api-users.md`, p.1–2 (Stage 4)
- `2026-05-18__support-fireblocks-io__allowlist-ip-addresses-for-api-user-requests.md`, p.1 (Stage 4)
- `2026-05-18__support-fireblocks-io__reset-a-users-2fa.md`, p.1 (Stage 3)
- `2026-05-18__support-fireblocks-io__re-enroll-a-users-mobile-device.md`, p.1 (Stage 3)
- `2026-05-18__support-fireblocks-io__transfer-workspace-owner.md`, p.1–2 (Stage 3)
- `2026-05-18__support-fireblocks-io__device-migration.md`, p.1–2 (Stage 5: self-service migration)
- `2026-05-18__support-fireblocks-io__reset-an-admin-or-signers-recovery-passphrase.md`, p.1 (Stage 5)
- `2026-05-18__support-fireblocks-io__reset-the-owners-recovery-passphrase.md`, p.1–2 (Stage 5)
- `2026-05-18__support-fireblocks-io__re-adding-a-user-to-the-fireblocks-mobile-app.md`, p.1 (Stage 5)
- `2026-05-18__support-fireblocks-io__linked-users-fireblocks-mobile-app.md`, p.1–2 (Stage 5)
- `2026-05-18__support-fireblocks-io__freeze-workspace.md`, p.1 (Stage 6: Emergency Workspace Freeze)
- `2026-05-18__support-fireblocks-io__support-verification-requests.md`, p.1–2 (Stage 6: Support verification 흐름)

## Open Questions

- Q-2026-05-18-L01 — "Admin-level users"의 정확한 role 집합
- Q-2026-05-18-L02 — Add users 본문 vs 권한표 SecAdmin 불일치
- Q-2026-05-18-L03 — Add/Delete의 mobile approval 비대칭 이유
- Q-2026-05-18-L04 — setup 진행 중 Edit 차단의 동작 이유
- Q-2026-05-18-L05 — Delete user의 user ID 잔존과 email unique 룰 사이의 재추가 가능성
- Q-2026-05-18-L06 — Approval groups customize 가능 항목 범위
- Q-2026-05-18-L07 — Role 변경의 Support 경로 SLA/메커니즘
- Q-2026-05-18-M03 — cloud-based key shares 외 다른 share 분포
- Q-2026-05-18-M04 — MPC key share derivation 메커니즘
- Q-2026-05-18-A01 — "Admin-level users"가 API user 흐름에도 등장 (Q-L01과 동일 정의?)
- Q-2026-05-18-A02 — API user unpair 절차
- Q-2026-05-18-A03 — API key/CSR 만료·rotation 정책
- Q-2026-05-18-A05 — SGX Co-signer와 일반 API Co-signer 차이, "First user on this machine" 함의
- Q-2026-05-18-D01 — 6-digit PIN과 mobile app passphrase 관계
- Q-2026-05-18-D02 — Linked users / linked workspaces 격리 모델
- Q-2026-05-18-D03 — 2-day window 만료 시 동작
- Q-2026-05-18-O02 — Owner 부재의 정의·검증 기준
- Q-2026-05-18-O03 — Board resolution 형식 요건
- Q-2026-05-18-W02 — Recovery passphrase 분실 시 경로

## Stage 9 — Transaction Lifecycle (★ User/Device lifecycle 와 별개 spine)

본 페이지는 주로 **User / Device / Owner lifecycle** 를 다루지만, Stage 9 에서 **Transaction lifecycle 이 별도 spine** 으로 정식 명세됨. 두 lifecycle 은 직교:

| Lifecycle | spine 위치 | 핵심 자료 |
|---|---|---|
| **User lifecycle** | 본 페이지 | Add/Edit/Delete users, Re-enroll, Transfer Owner, Freeze, Role change |
| **Mobile Device lifecycle** | 본 페이지 + [[entities/fireblocks/mobile-device]] | Re-enroll, biometric change, PIN loss, key share recovery |
| **Transaction lifecycle** | [[entities/fireblocks/transaction]] (Stage 9) | 17-status state machine, 14-step technical schematic |

### 새 자료 명시 cite

- `transaction-lifecycle.md` (Stage 9): outgoing 10-state + incoming 9-state flowchart, 14-step system schematic, AML providers (Chainalysis / Elliptic / Notabene), zero-trust handoff
- `primary-transaction-statuses.md` (Stage 9): 17 primary status + API code + 2h authorization/signature timeout + 30s Cancelling + 1min Broadcasting + Solana 5-tx queue + EVM serial
- `whitelisting-new-addresses.md` (Stage 9): Whitelisted address Admin Quorum approval
- `one-time-address-ota-feature.md` (Stage 9): OTA = Admin Quorum 우회 path
- `account-and-wallet-structure.md` (Stage 9): 5-level workspace 계층 + asset address 패턴
- `vault-structure-best-practices.md` (Stage 9): Vault structure 2 패턴, multi-workspace 6 trigger, default visibility
