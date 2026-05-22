---
type: vendor-hub
vendor: fireblocks
status: stable
tags: [risks, security, key-link]
stage_introduced: 1
last_updated_stage: 36
source_count: 9
related:
  - admin-quorum
  - approval-group
  - authentication
  - compliance
  - cosigner
  - ip-allowlist
  - lifecycle-events
  - mobile-app
  - policy-engine
  - recovery-passphrase
  - risks
  - user-management
  - workspace
---
# Fireblocks — Security

> **Security / Governance hub** — Fireblocks workspace의 운영 보안 체크리스트와 권장 사항을 한 페이지에 통합. 실제 위험·완화는 [[vendors/fireblocks/risks]], 규제·인증은 [[vendors/fireblocks/compliance]] 참고.

## Summary

`security-checklist.md` (p.1–3)을 기반으로 한 6 카테고리 운영 체크리스트:

1. **Basic security** — User roles, Admin Quorum
2. **Transaction security** — Fireblocks Policies, Deposit Control and Confirmation Policy, AML Transaction Screening Policy
3. **Authentication** — User login IP whitelisting (Support enable), SSO
4. **Backup and Recovery** — Auto-passphrase (Support enable)
5. **Other security features** — Withdrawal address whitelisting cooling-off period, Emergency freeze, Security audit log
6. **Fireblocks API + Co-Signer best practices**

본 페이지는 운영 시 참고하는 **체크리스트형 hub**다. 각 항목은 별도 entity / vendor page로 연결.

## Key Concepts

- **Auto-passphrase** — Recovery passphrase manual entry → mobile device 자동 생성 + RSA 암호화 + 고객 offline decrypt (Support enable) (`security-checklist.md`, p.1)
- **Cooling-off period** — Whitelisted address가 활성화되기 전 대기 기간 (Support enable) (p.2)
- **Withdrawal address whitelisting suspension** — Admin API user에 권장 (Support enable) (p.2)
- **Emergency freeze** — Admin-level 4 role이 freeze, Owner만 unfreeze (Support 경유) ([[entities/fireblocks/workspace]] §"Freeze 모델")
- **Security audit log** — workspace events를 log/track/audit/**export** (p.2)
- **DKIM + DMARC** — Fireblocks 이메일 인증 (`is-this-email-really-from-fireblocks.md`, p.1)
- **Support verification request** — Sensitive Support op 시 mobile app으로 PIN read-back + biometric 추가 인증 (`support-verification-requests.md`, p.1)

## Details

### 1. Basic security (`security-checklist.md`, p.1)

- [[vendors/fireblocks/user-management]] — 9 role 최소권한 원칙
- [[entities/fireblocks/admin-quorum]] — Q / Q+O / AG 거버넌스

### 2. Transaction security (p.1)

| 항목 | 메모 |
|---|---|
| Fireblocks Policies | 일반 Policy rules — [[entities/fireblocks/policy]] |
| Deposit Control and Confirmation Policy | Policy 종류, 본 자료에 정의 깊지 않음 → Q-S02 |
| AML Transaction Screening Policy | AML 통합. Stage 1 권한표 *Add or modify AML connections and policies* (`user-roles.md`, p.7) cross-ref → Q-S03 |

### 3. Authentication (p.1)

- **User login IP whitelisting** — **Support enable 필요** (Console IP allowlist self-service 옵션과는 별개로 명시; 단 본 자료에 둘의 정확한 관계 명시 없음 — 본 항목은 더 좁은 운영 옵션으로 추정)
- **Identity provider SSO** — [[entities/fireblocks/sso]]
- **Console IP allowlist** — Stage 6에서 자세히 다룸 ([[entities/fireblocks/ip-allowlist]] §"Console Access")

### 4. Backup and Recovery (p.1)

**Auto-passphrase** (Support enable 옵션):

- Manual entry 비활성화
- Mobile device가 **secure random passphrase 자동 생성**
- **RSA key로 암호화** (고객이 Fireblocks에 제공)
- 분실/유출 방지 (사용자 측 인적 오류 제거)
- **Offline machine에서 decrypt 가능** (recovery 시)

→ [[entities/fireblocks/recovery-passphrase]] §"Auto-passphrase (Enterprise 옵션)" 참고. Default 흐름과 별개의 enterprise-grade 대안.

### 5. Other security features (p.2)

- **Withdrawal address whitelisting cooling-off period** — Support enable. 기간 미명세 → Q-S04
- **Emergency freeze** — 자세한 절차는 [[entities/fireblocks/workspace]] §"Freeze 모델" + [[vendors/fireblocks/lifecycle-events]] §"Emergency Workspace Freeze"
- **Security audit log** — workspace events log·track·audit·**export**. IP allowlist events도 audit log에 기록 (`allowlisting-ip-addresses-for-console-access.md`, p.3). audit log entity는 별도로 만들지 않음 — security-auditor / security-admin role과 본 페이지가 hub 역할

### 6. Fireblocks API + Co-Signer best practices (p.2–3)

**API user**:
- Hardened machine, 인가된 인원만 접근
- **No inbound, outbound only on port 443**
- Private key는 그 머신에서 이동 금지
- **API IP whitelisting** 활용 ([[entities/fireblocks/ip-allowlist]] §"API User")
- Admin 권한 API user → **withdrawal address whitelisting suspension** 활성화 (Support enable) → Q-S05
- **Linux UEFI secure boot 유지** — disable 권장 안 함. 이슈는 우회 (예: TrendMicro Deep Security agent on Ubuntu 20.04)

**Callback Handler**:
- Hardened machine
- **No outbound, inbound only from API Co-Signer on port 443**
- **모든 approval requests를 log**
- Programmatic 추가 보호 로직 (악성 withdrawal 방어)

**SGX API Co-Signer**:
- Hardening 권장 — SGX setup guide 참조

**Policy rules for API users**:
- Amount threshold, timeframe, manual approval — 모든 withdrawal과 specific external user wallet에 globally 적용

### Support Verification Request (Stage 6, gradually rolling out)

`support-verification-requests.md`, p.1–2 — Sensitive Support operation 시 추가 인증:

| 단계 | 내용 |
|---|---|
| 1 | Fireblocks Support agent가 verification 시작 (sensitive op, 예: account recovery) |
| 2 | 사용자의 mobile app으로 notification 전송 (request details + **support ticket ID**) |
| 3 | PIN code 표시되면 사용자가 support team에게 **read it back** |
| 4 | **Biometric approval** |
| 5 | Support가 변경 진행 |

**보호 목적** (`support-verification-requests.md`, p.1):
- Authorized workspace owners/admins만 critical 변경 승인
- Legitimate Support agent 확인 (impersonation 방어)
- Social engineering 방어

**Unexpected request 수신 시** (p.2):
1. Mobile app에서 reject
2. Fireblocks Support에 보고

→ 본 기능은 **점진적 rollout** 중 (모든 고객에 가용하지 않을 수 있음) → Q-S06.

### Phishing 방어 / Email Authentication

`is-this-email-really-from-fireblocks.md`, p.1:

- **공식 domain**: `fireblocks.com` 또는 `fireblocks.io`
- 공식 sender 예: `support@`, `product_updates@`, `support_maintenance@`, `dealhelp@`, `developers@`, `csm@`, `info@`
- **DKIM + DMARC** 적용
- **Social media로 contact 안 함** — email / support tickets / Slack만
- **Fireblocks 직원이 절대 요청하지 않는 것**: 비밀번호, 2FA codes, 원격 접근
- 의심 이메일 → `security@fireblocks.com` 또는 CSM 또는 Support

### Console IP allowlist (Stage 6에서 정식 도입)

`allowlisting-ip-addresses-for-console-access.md`, p.1–3 — **API user IP allowlist와 다른 별개 평면**:

| | API user IP allowlist (Stage 4) | Console IP allowlist (Stage 6) |
|---|---|---|
| 범위 | API user 단위 | Workspace 단위 |
| 형식 | **`/32` CIDR only** | **IPv4/IPv6, CIDR, OR range** |
| 위치 | `Developer Center > API users > ⋮ > Allowlist IP address` | `Settings > General > Manage IP allowlist` |
| 활성화 | (없음, 추가 즉시) | Activate/Deactivate 토글, 본인 IP 포함 필수 |
| 거버넌스 | Owner / Security Admin | **Default Admin Quorum**, customize via `Quorums > Security & compliance` 위임 |
| Audit | (본 자료에 직접 명시 없음) | IP allowlist events가 Audit Log에 기록 |

자세한 내용은 [[entities/fireblocks/ip-allowlist]] §"Console Access" 절.

## Related Pages

- [[vendors/fireblocks/risks]] — 위험 분석 (본 페이지의 best practices가 완화하는 위험)
- [[vendors/fireblocks/compliance]] — 인증·규제 (SOC2/ISO/Travel Rule)
- [[vendors/fireblocks/authentication]] — Login/SSO/2FA/CSR/Console IP allowlist
- [[vendors/fireblocks/user-management]] — 9 role
- [[vendors/fireblocks/lifecycle-events]] — Emergency Workspace Freeze
- [[vendors/fireblocks/mobile-app]] — Support verification request notification 평면
- [[vendors/fireblocks/cosigner]] — SGX, API Co-Signer hardening
- [[vendors/fireblocks/policy-engine]] — Policy rules for API user 제약
- [[entities/fireblocks/recovery-passphrase]] — Auto-passphrase 옵션
- [[entities/fireblocks/ip-allowlist]] — API + Console 두 평면
- [[entities/fireblocks/workspace]] — Freeze 모델
- [[entities/fireblocks/admin-quorum]] · [[entities/fireblocks/approval-group]] — Security & compliance 위임 메뉴

## Sources

- `2026-05-18__support-fireblocks-io__security-checklist.md`, p.1–3
- `2026-05-18__support-fireblocks-io__support-verification-requests.md`, p.1–2
- `2026-05-18__support-fireblocks-io__allowlisting-ip-addresses-for-console-access.md`, p.1–3
- `2026-05-18__support-fireblocks-io__freeze-workspace.md`, p.1
- `2026-05-18__support-fireblocks-io__is-this-email-really-from-fireblocks.md`, p.1–2
- (cross-ref) `2026-05-18__support-fireblocks-io__user-roles.md`, p.5, p.7 (권한표 Freeze the workspace, AML)
- (cross-ref) `2026-05-18__support-fireblocks-io__allowlist-ip-addresses-for-api-user-requests.md`, p.1 (API allowlist 대비)

## Open Questions

- Q-2026-05-18-S01 — Auto-passphrase cryptographic 메커니즘 (RSA 형식·길이·storage 정책)
- Q-2026-05-18-S02 — Deposit Control and Confirmation Policy 정확한 동작
- Q-2026-05-18-S03 — AML Transaction Screening Policy 정확한 동작
- Q-2026-05-18-S04 — Cooling-off period 기본값·설정 범위
- Q-2026-05-18-S05 — Withdrawal address whitelisting suspension 정확한 동작
- Q-2026-05-18-S06 — Support verification requests rollout 일정·범위
- Q-2026-05-18-S07 — FSPM entity-grade 명세
- Q-2026-05-18-O05 — Workspace freeze 시 incoming transfer 처리 (자동 완료 vs Pending)
- ~~Q-2026-05-18-A07~~ — **ANSWERED (Stage 8)**: Audit Log = no-expire 영구 보존, Settings > Audit log 에서 view/filter/export, **Fireblocks API endpoint 통해 SIEM 통합 가능** (`audit-log.md`)

## Stage 8 — Audit Log 정식 명세 (`audit-log.md`)

### Access Control
> "Requires Admin-level permissions — Only Owners, Admins, and Non-Signing Admins can access the Audit Log."

→ Security Auditor / Security Admin 은 **본 audit log 의 access 권한이 명시되지 않음** (compliance/audit plane 분리 가능성).

### Persistence
> "Events that are recorded in your Audit Log **do not expire**."

→ 워크스페이스 생성 시점부터 **영구 보존**. Forensic/compliance 측면에서 spine.

### SIEM 통합
- **Fireblocks API endpoints** → SIEM system 직접 통합 가능
- Export 시 인증 필요 (`Downloading reports requires authentication`)

### Event Categories (20+ 카테고리)
Administration / User Management / Mobile Device Management / Linked User Migration / Whitelisted IP / **Admin Quorum (Threshold changed 포함)** / One-Time Address / Notifications / Assets / Automation / Compliance (AML/Screening/Travel Rule) / Developers (Webhooks) / Third-party accounts / **Keys (MPC key set, Validation key)** / Policies / IP allowlist / Fireblocks P2P Network / Transactions / **Wallets (Vault Account + Workspace Key Backup 9-stage lifecycle + Gas Station + Cold Wallet "Less than 10% remaining signatures")** / Web3 (Allowance, Contract, Fireblocks Extension)

### Event 구조
4-tuple: `(timestamp, subject, event description, actor)`

### Workspace Key Backup 의 9-stage lifecycle
Request Submitted → Initiated by workspace owner → Pending approval → Approved by admin / Approved by admin quorum → Rejected by one of the admins / Cancelled / Internal error during generation → Marked as incomplete / Marked as completed → **Backup sent**

## Stage 8 — Authentication Architecture (`authentication-and-authorization.md`)

- **Root Key** (Core Services 의 CA) → Intermediate Cert → Co-Signer End Cert chain of trust
- Token lifecycle: Activation (7d configurable) → Refresh (mobile KeyChain) → Access (6h)
- Customer-side IP allowlist 3-region: US `3.133.194.13` / EU `3.126.240.51` / EU2 `3.77.238.179` + Cloudflare 범위
- Webhook source IP: US `3.134.25.131` / EU 3개

## Stage 8 — MPC Architecture Spine 확정 (`mpc-cmp.md` + `security-aspects-signing-with-the-fireblocks-mobile-app.md`)

- **3-endpoint signing**: 1 customer + 2 Fireblocks cloud (SGX)
- **3/3 within group + 1/N OR across groups**
- Owner = MPC-level cryptographic root (모든 Admin/Signer set 은 Owner set 에서 derived)
- **Additive Secret Sharing** (Shamir t=n), perfect secrecy
- HRNG Intel RDRAND, NIST SP 800-90A
- **Workspace Key Backup** = encrypted recovery package (cloud backup 의 정체)
- Cloud-based **mediator** 가 mobile + 2 cloud share ceremony 매개 — mobile 은 cloud server 와 직접 통신 X

## Stage 8 — Intel SGX 정식 명세 (`intel-sgx-secure-environments.md`)

- Minimum 3-5 machines, segregated network
- Crypto material + algorithm + sensitive code execution 모두 보호
- 위협 모델: 외부 hacker + insider (rogue admin)
- "Information cannot be retrieved by hackers, inside colluders, or **even Fireblocks employees**."

## Stage 8 — Disaster Recovery SPOC 경고 (`fireblocks-cloud-architecture.md`)

DR 서비스로 **xprv+fprv (extended ECDSA + EdDSA) 재구성** 가능 — 단:
- "**Should be stored on an offline air-gapped machine with hardened access permissions**"
- "**Should not be used regularly since reconstruction of the extended private keys introduces a single point of compromise**"

→ DR 자산은 SPOC. 정기 사용 금지.

## Stage 8 — Business Continuity Module (BCM)

`business-continuity-module-bcm.md`:
- **Hosted MPC customer 전용** SaaS-outage fallback
- On-prem Dockerized stack (BCM API + Aggregator + Redis + Offline Signing Console + Co-Signer Cluster + API Co-Signer)
- Cloud Aggregator 기능 → customer-side On-Prem MPC Aggregator
- Active-Active / Active-Passive HA

## Sources (추가)
- `2026-05-18__support-fireblocks-io__audit-log.md`, p.1-11 (Stage 8: 20+ category enumeration, SIEM, 영구 보존)
- `2026-05-18__support-fireblocks-io__authentication-and-authorization.md`, p.1-6 (Stage 8: Auth architecture)
- `2026-05-18__support-fireblocks-io__mpc-cmp.md`, p.1-7 (Stage 8: MPC spine)
- `2026-05-18__support-fireblocks-io__security-aspects-signing-with-the-fireblocks-mobile-app.md`, p.1-5 (Stage 8: 3-share signing)
- `2026-05-18__support-fireblocks-io__intel-sgx-secure-environments.md`, p.1-2 (Stage 8: SGX)
- `2026-05-18__support-fireblocks-io__fireblocks-cloud-architecture.md`, p.1-3 (Stage 8: 3-cloud + DR SPOC)
- `2026-05-18__support-fireblocks-io__business-continuity-module-bcm.md`, p.1-3 (Stage 8: BCM)
- `2026-05-18__support-fireblocks-io__fireblocks-ip-addresses-to-whitelist.md`, p.1 (Stage 8: customer firewall config)

## Stage 10 — Governance Hub 통합 (★)

### 3-Level Governance Architecture 정식 확립

```
Admin Quorum  (workspace-level default, Stage 10 admin-quorum doc)
  │   - 멤버: Owner / Admin / NS-Admin (자동, role-based)
  │   - Threshold: All (dynamic) 또는 Number, default "All Admins"
  │   - API Admin 자동 approve = quorum −1 위험
  │   - 8 default activities, Cold Wallet 특수 규칙
  │
  └── Approval group  (action-level 위임, Stage 10 approval-groups doc)
        │   - Cold Wallet workspace 미지원
        │   - 12 assignable actions, 4 UI categories
        │   - 5 Owner-mandatory default actions
        │   - Permission filter (role-based 자동 제외)
        │
        └── Policy Approved by sub-quorum  (rule-level, Stage 10 how-policies-work)
              │   - User group 기반 N-of-M
              │   - Initiator + Approver 양쪽에 user group 사용 가능
              │   - User group prerequisite (Stage 10 user-group-mgmt)
              │     - 관리권 Owner+Admin only
              │     - 변경 모두 Admin Quorum + Owner approve
              │     - (X) Policy rules impacted indicator 자동 표시
```

### Policy = Primary Security Control (공식)

`about-policies.md`, p.1: Policy 가 Fireblocks workspace 의 first-class 보안 spine.

### Default-Deny Architecture

`about-policies.md`, p.4:
- 5 default Policy rule, 마지막 = block-all (삭제 불가)
- Custom Policy 생성 → default 즉시 삭제 (one-way replacement)
- Whitelist 가 default Policy 의 전제

### DCCP (Deposit Control and Confirmation Policy)

`about-the-deposit-control-and-confirmation-policy.md` (Stage 10):
- Confirmation 수 정책 — in/out tx clear 까지 funds lock
- Stage 9 Confirming → Completed transition 의 정확한 trigger
- Override + custom build 별도 가능 (TIER 3 source-lake)

### FSPM (Fireblocks Security Posture Management) (★ Q-S07 ANSWERED)

`fireblocks-security-posture-management-fspm.md` (Stage 10):

- **Add-on license**
- **Access**: Owner / Admin / NS-Admin / **Security Auditor** ← Security Auditor 만 audit-log 와 별개 plane
- **AI 기반 attack simulator** — Google Gemini private deploy
- **3-step Agentic Policy Analyzer**:
  1. Weakest link detection (unilateral 가능 user)
  2. High-value targeting
  3. **Autonomous drain simulation** (ReAct loop: single hop + lateral movement)
- **6 monitoring 영역**: over-permissive policies / unused users + access gaps / weak approval group thresholds / risky unused settings / risky token allowances / outdated security software
- **SOC2 compliance violation 매핑** (e.g., CC6.6, CC6.1)
- **AI 안전성**:
  - No fine-tuning with customer data
  - Session-level isolation, stateless
  - Every attack 은 Policy Engine 으로 validate (no false positive)
  - **AI 가 policy 직접 변경 불가** (advisory only)
- **Finding lifecycle**: Open / Accepted / Resolved (Reopen 가능)
- **Categories**: Policies / Workspace settings / Users / Fleet Management
- **Console path**: 좌측 nav `Security posture`

### Audit Plane vs Posture Plane 분리

| Plane | Access | 목적 | Stage |
|---|---|---|---|
| **Audit Log** | Owner / Admin / NS-Admin | Post-incident forensic, no-expire, SIEM 통합 | 8 |
| **FSPM** | Owner / Admin / NS-Admin / **Security Auditor** | Pre-incident posture monitoring, AI 기반 | 10 |

→ Stage 8 의 Audit Log + Stage 10 의 FSPM 이 **두 별개 security plane** 으로 정착. Security Auditor 는 FSPM 만 가능.

## Sources (Stage 10 추가)
- `2026-05-18__support-fireblocks-io__admin-quorum.md`, p.1-5 (Stage 10: Admin Quorum 정식 명세)
- `2026-05-18__support-fireblocks-io__approval-groups.md`, p.1-4 (Stage 10: 12 actions, 4 categories)
- `2026-05-18__support-fireblocks-io__about-policies.md`, p.1-5 (Stage 10: Primary security control, 5 default rules)
- `2026-05-18__support-fireblocks-io__how-policies-work.md`, p.1-5 (Stage 10: First-match, rule ordering)
- `2026-05-18__support-fireblocks-io__about-the-deposit-control-and-confirmation-policy.md`, p.1-2 (Stage 10: DCCP)
- `2026-05-18__support-fireblocks-io__fireblocks-security-posture-management-fspm.md`, p.1-7 (Stage 10: FSPM AI architecture)
- `2026-05-18__support-fireblocks-io__user-group-management.md`, p.1-10 (Stage 10: User group prerequisite)

## Stage 36 — Customer Signature Validation Plane (Key Link)

`getting-started-with-fireblocks-key-link.md`, p.3-6 (Stage 36 Mode C).

Stage 8 의 MPC architecture spine (3-endpoint signing + 3/3 within group) 와 **paired alternate signing plane** 도입. Fireblocks 가 키 share 를 보유하지 않는 **외부 HSM 위탁 signing** + **Fireblocks 측 validation key 검증** 모델.

### Asymmetric Key Pair 구조

| Key | 보유자 | 역할 |
|---|---|---|
| **Signing key** | **Customer HSM** | transaction 의 ECDSA / EdDSA signature 생성. Fireblocks 가 접근 불가 |
| **Validation key** | **Fireblocks SaaS** | 새 signing key 등록 시 cert 서명 + signature verification |

→ Stage 8 의 SaaS MPC "1 customer + 2 Fireblocks shares" 모델과 다른 trust 구조: cryptographic 협력 서명 없음. Customer 측 키 compromise 시 Fireblocks safeguards (Policy / amount threshold / destination integrity) 가 1차 방어선.

### Proof of Ownership — 2 등록 방법 (`getting-started-with-fireblocks-key-link.md`, p.4-6)

새 signing key 가 등록될 때 customer 가 HSM 의 키 소유를 증명해야 함:

| 방법 | 메시지 형식 | 흐름 |
|---|---|---|
| **Interactive** | `sha256({tenant_id}-{request_id}-{key_id})` | Fireblocks 가 challenge 발급 → Agent 가 HSM 으로 relay → HSM sign → Fireblocks 검증 |
| **Non-interactive** | `Fireblocks\|Proof of Ownership Message\|<WorkspaceDisplayName>\|<SdkApiKey>` (hex format) + `signingDeviceKeyId` + `UnixTimeInSeconds` 포함 | Customer 가 사전 sign → request body 의 `proofOfOwnership` object 첨부 → 즉시 enable |

→ Non-interactive 는 cold HSM (offline) 환경에서 미리 cert 준비 후 등록 가능 — Stage 31 의 SPOC offline procedure 와 유사한 패턴.

### Validation Key 등록 거버넌스 (`getting-started-with-fireblocks-key-link.md`, p.3)

| 단계 | 명세 |
|---|---|
| 1. Approval group 사전 설정 | `Settings > Quorums > Security & compliance > Add validation keys` — 별도 group |
| 2. API 호출 | Add validation key endpoint |
| 3. Approval | Approval group quorum 이 **mobile app 으로 approve** — Stage 8 의 Configuration key 와 정합 |
| 4. Enable | Approve 후 새 signing key 등록 가능 |

→ Stage 10 의 12 assignable approval-group actions 에 "Add validation keys" 추가됨 (Key Link workspace 한정 — 비-Key Link workspace 의 approval group 구성과는 별개).

### Signing Key Cert 발급 흐름 (`getting-started-with-fireblocks-key-link.md`, p.5-6)

```
1. Customer 가 HSM 에서 keypair 생성 → public key 획득
2. Customer 가 active validation key 로 public key 에 X.509 cert 발급 (Ed25519 또는 ECDSA)
3. Cert + signing key → Fireblocks `Create signing key` API endpoint
4. Fireblocks 가 cert 의 validation key signature 검증 → enabled=false 상태로 등록
5. Proof of Ownership 검증 (Interactive 또는 Non-interactive)
6. 검증 완료 → enabled=true → vault account 에 assign 가능
```

→ Stage 8 의 chain of trust (Root Key → Intermediate → End cert) 의 **paired model**: Key Link 는 customer 측 PKI 가 root, validation key 가 intermediate, signing key 가 end-of-chain.

### Risk-S17: Validation Key Compromise (Stage 36 신규)

- Compromise 시 **위조된 signing key 등록 가능** — attacker 가 자체 HSM 의 키를 enable 시킬 수 있음
- Mitigation: approval group quorum (default Admin Quorum 또는 위임 group) + audit log (validation key Submitted/Approved/Rejected/Activated/Deactivated 이벤트)
- 자세한 내용: [[vendors/fireblocks/risks]] §"Stage 36 — Key Link Risks"

## Sources (Stage 36 추가)
- `2026-05-22__support-fireblocks-io__getting-started-with-fireblocks-key-link-extracted.txt`, p.3-6 (Stage 36: Validation/Signing key 등록 + PoO 2 methods + cert flow)
- `2026-05-22__support-fireblocks-io__fireblocks-key-link-overview-extracted.txt`, p.1-3 (Stage 36: customer-held key plane)

## Stage 38 — Thales Luna HSM 통합 (vendor blog cross-cut)

Fireblocks 공식 블로그 ("Enterprise Digital Asset Security with Fireblocks and Thales", 2025-09-23, by Adam Levine SVP) 가 Stage 36 의 Customer Signature Validation Plane 의 후속 사실을 명시. **HSM 항목 보강** (별도 신규 entity 미생성, 본 hub 의 HSM 항목에 흡수).

### Stage 38 신규 사실

| 사실 | 직접 인용 |
|---|---|
| **Thales Luna HSM 통합** | "At the heart of this solution is Fireblocks KeyLink, our secure middleware layer that connects the Fireblocks platform to Thales Luna Hardware Security Modules (HSMs)" |
| **HSM 인증 등급** | "Private keys remain within FIPS 140-3 Level 3 and Common Criteria certified hardware" |
| **PQC readiness** | "Thales Luna HSMs provide crypto agility and post-quantum cryptography (PQC) readiness" |
| **3-mode signing** | "Hot, Warm, and Cold signing workflows" — vendor 공식 framing |
| **Air-gap transport** | USB · SFTP · data diodes — Cold workflow 의 명시 transport |
| **Customer key ownership** | "Institutions maintain full key ownership while accessing enterprise-grade digital asset capabilities" |
| **관할권 명시** | HKMA · HKSFC · JFSA. **KR 미명시** |

### Stage 36 Customer Signature Validation Plane 와의 관계

- 본 자료의 "FIPS 140-3 Level 3 + Common Criteria" 가 Stage 36 의 **Signing key** (Customer HSM) 의 reference 인증 등급
- Stage 36 의 PoO 2 methods (Interactive / Non-interactive) 가 Hot vs Cold (air-gap) workflow 에 직접 매핑
- "Hot/Warm/Cold" 3-mode 의 **Warm** 변종 = vendor 공식 framing 등장. 기술 정의 미명세 → **Q-2025-09-23-FB01**

### 잔존 미명세 (Stage 38 신규 Q)

- Q-2025-09-23-FB01 — Hot/Warm/Cold 3-mode 의 정확한 정의
- Q-2025-09-23-FB02 — SaaS Cold Wallet workspace vs Key Link Cold signing 관계
- Q-2025-09-23-FB03 — KR VASP 환경 vendor 공식 입장 (HKMA/HKSFC/JFSA 명시, KR 미명시)

자세히: [[open-questions/fireblocks]] §"Stage 38" · [[vendors/fireblocks/risks]] §"Stage 38"

## Sources (Stage 38 추가)
- `2026-05-22__fireblocks-com__enterprise-digital-asset-security-thales.md` (Stage 38: Thales Luna HSM 통합, Hot/Warm/Cold 3-mode, air-gap transport, PQC, HKMA/HKSFC/JFSA)
