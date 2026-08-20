---
type: entity
vendor: fireblocks
status: stable
tags: [governance, policy]
stage_introduced: 1
last_updated_stage: 10
source_count: 6
related:
  - admin-quorum
  - approver
  - designated-signer
  - non-signing-admin
  - owner
  - policy-engine
  - tap
  - transaction
---
# Entity: Policy (Fireblocks)

## Summary

Fireblocks workspace의 거버넌스·서명 결정을 좌우하는 룰셋. 본 자료에서 확인 가능한 사실은 (1) **변경·승인에 Owner + Admin Quorum 필요** (Q+O), (2) **designated signer**·**second authorizer** 메커니즘이 존재한다는 것 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.2–3, p.7).

## Key Concepts

- **변경 거버넌스**: Approve workspace policies, Policy changes — `Y (Q+O)` (p.7)
- **Designated signer** — Policy가 특정 트랜잭션 타입에 대해 서명 가능한 사용자를 지정 → MPC 키 없는 NSA·Editor가 그 타입을 initiate 가능 (p.2, p.3, p.5)
- **Second authorizer** — Non-Signing Admin / Approver를 두 번째 authorizer로 정의 가능 (p.2, p.3)
- Owner의 책임에 "Creating, editing, and approving workspace policies" + "Approving Policy changes, together with the Admin Quorum" (p.2)

## Details

- 본 자료는 룰 표현 문법, 평가 순서, 룰의 필드 구조에 대한 명세를 제공하지 않는다 → Open Questions.
- Sandbox에서는 모든 트랜잭션이 auto-approve되므로 Policy 흐름 자체가 다를 수 있다 (`user-roles.md`, p.8).
- "internal exchange transfer를 제외한 모든 트랜잭션"이라는 표현이 NSA·Editor의 NS 흐름 한정으로 등장 — Policy의 트랜잭션 타입 카테고리화 존재를 시사 (`user-roles.md`, p.5).

### User 삭제와의 의존성 (Stage 2)

User 삭제 시 그 user가 Policy rule을 충족하는 데 필요한 경우 운영에 영향을 줄 수 있다 (`delete-users.md`, p.1):

- 삭제 전 검증 권고: 그 user가 Admin Quorum threshold 또는 Policy rule 충족에 필요한지
- 사전 검증 없이 삭제하면 **해당 user를 필요로 하던 Policy rule은 수정·승인 전까지 block** 상태로 전이
- urgent revoke는 우선 삭제하고 이후 Policy를 수정·재승인하는 흐름이 가능

이는 designated signer / second authorizer로 사용자를 직접 참조하는 rule 패턴에서 특히 중요하다 (rule이 user identity를 직접 가리킴).

### Role 변경의 별도 절차

Console은 role을 직접 변경하지 않으므로 (`edit-users.md`, p.1) role 변경 시 다음 중 한 경로를 거친다:

- delete + re-add — Policy rule이 그 user를 참조한다면 rule이 임시 block될 가능성을 사전 평가해야 함 (`edit-users.md`, p.2)
- Fireblocks Support 요청 (SLA 적용) — delete/recreate가 detrimental일 때 (`edit-users.md`, p.2)

### API user 삭제와의 의존성 (Stage 4)

API user를 Policy rule이 참조한다면 그 API user를 삭제하기 전에 검증이 필요하다 (`rename-and-delete-api-users.md`, p.1):

- API user가 Admin Quorum threshold 충족에 필요한지
- API user가 Policy rule 충족에 필요한지
- API user가 활성 서드파티 통합에 사용 중인지

사전 검증 없이 삭제 시 — 해당 user를 필요로 하던 **Policy rule은 수정·승인 전까지 block** 상태로 전이 (Console user 삭제와 동일 패턴) (`rename-and-delete-api-users.md`, p.1).

### Policy 변경 mobile app 승인 (Stage 5)

`fireblocks-mobile-app-signing-and-approving.md`, p.3 — "**Transaction Policy changes**"가 mobile app의 workspace settings 승인 항목에 명시. 즉 Q+O 흐름의 실제 승인 액션은 mobile app에서 수행된다 (Admin Quorum 멤버 + Owner의 모바일 알림).

### Policy 종류 (Stage 6에서 확인)

`security-checklist.md`, p.1의 *Transaction security* 카테고리에 다음 Policy 종류가 명시:

- **Fireblocks Policies** — 일반 Policy rules (본 entity의 주 대상)
- **Deposit Control and Confirmation Policy** — 별도 Policy 종류. 정확한 동작은 본 자료에 없음 → Q-S02
- **AML Transaction Screening Policy** — AML 통합 Policy. Stage 1 권한표 *Add or modify AML connections and policies* (`user-roles.md`, p.7)와 연결 → Q-S03

세 Policy 종류가 어떻게 결합·평가되는지(룰 우선순위, 평가 순서)는 본 자료에 없음 — [[vendors/fireblocks/policy-engine]]에서 추적.

### API user 측 Policy 권장 (Stage 6)

`security-checklist.md`, p.2–3 — API user의 transfer를 제약하는 Policy rule 운영 권장:

- Specific amount threshold
- Specific timeframe
- Without additional manual approval
- 적용 범위: 모든 withdrawals + specific external user wallet 단위

이는 [[entities/fireblocks/api-user]]에서 다루는 권한 모델을 보완하는 Policy 평면의 운영 권장사항.

## Related Pages

- [[entities/fireblocks/admin-quorum]]
- [[entities/fireblocks/user-roles/owner]]
- [[entities/fireblocks/designated-signer]]
- [[entities/fireblocks/user-roles/non-signing-admin]]
- [[entities/fireblocks/user-roles/approver]]
- [[entities/fireblocks/transaction]]
- [[vendors/fireblocks/policy-engine]]
- [[vendors/fireblocks/tap]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.2–3, p.5, p.7–8
- `2026-05-18__support-fireblocks-io__edit-users.md`, p.1–2 (role 변경의 별도 절차)
- `2026-05-18__support-fireblocks-io__delete-users.md`, p.1 (user 삭제 시 rule block)
- `2026-05-18__support-fireblocks-io__rename-and-delete-api-users.md`, p.1 (API user 삭제와 rule block — Stage 4)
- `2026-05-18__support-fireblocks-io__fireblocks-mobile-app-signing-and-approving.md`, p.3 (Stage 5: Policy 변경 mobile app 승인)
- `2026-05-18__support-fireblocks-io__security-checklist.md`, p.1–3 (Stage 6: Policy 종류 + API user 권장)

## Stage 9 — Policy Engine 의 Tx Lifecycle 내 위치 (★)

`transaction-lifecycle.md` (Stage 9, p.4-5 14-step schematic):

### Policy Engine 의 실행 위치

```
Step 5: Transaction Manager 가 처리
  ↓ balance check + AML/Travel Rule screening (선택)
Step 6: → Policy Engine (SGX) 로 forward
Step 7: Policy 검증
  - Auto-approve 또는 explicit approval 요구
  - Native tx type: 상세 정보 제공
  - Raw Signing / Contract Call: 제한된 정보
  - 각 approval response: mobile device 서명 + Auth Service 검증
```

→ Policy Engine 은 **balance + AML + Travel Rule pass 후**에야 호출됨. Pre-checks 가 모두 통과한 transaction 만 정책 검증.

### Policy Engine 의 architecture 위치

`transaction-lifecycle.md`, p.4 + `fireblocks-cloud-architecture.md`:
- Policy Engine = **Azure SGX enclave** (Core Services)
- 별칭: **TAPs** (Transaction Approval Policy)
- "PKI is built into the enclave of the Policy Engine"
- **Zero-trust** — service handoff 마다 derived root CA 검증

### Tx Status 와 Policy 의 연결

`primary-transaction-statuses.md`:
- `PENDING_AUTHORIZATION` = Policy 가 explicit approval 요구하는 상태 (2h timeout)
- `BLOCKED` (final) = Policy rule 위반으로 차단 — **violated rule number 표시**
- `PENDING_SIGNATURE` = Policy 가 designated signer 지정 후 서명 대기
- Resolving blocked = 새 rule 을 **first-match 원칙**에 따라 더 앞에 배치

### Approvers Unanimous-Veto Rule

`transaction-lifecycle.md`, p.6: "If **at least one person chooses to reject** a transaction, the transaction is rejected."

→ Approval group 의 N 명 중 1명 reject = 즉시 fail.

### Auto-Approve 옵션

`transaction-lifecycle.md`, p.5: "Policies **can be configured to automatically approve or require explicit approvals** before the signing process begins."

→ Policy rule 마다 manual approval 강제 vs auto-approve 선택 가능.

### Whitelist vs OTA 의 Policy interaction (Stage 9)

| Address path | Policy 의 역할 |
|---|---|
| **Whitelisted address** | Admin Quorum 가 address-level approval — Policy 는 추가 rule (cap, approver) 적용 |
| **One-Time Address (OTA)** | Address-level Admin Quorum 없음 — **Policy 가 사실상 유일한 자동 방어선** (preselected user/group/vault, threshold approval) |

### Vault Structure Best Practices 의 Policy 권장

`vault-structure-best-practices.md`:
- **Treasury vault** = 가장 restrictive Policy
- **Smart contract per-op vault** (Mint/Burn/Pause/Deploy/Upgrade) = privileged personnel 만 Policy 로 access 제한
- **Withdrawal automation** (sweeping) = API Co-Signer + Policy 기반 fee 자동화

### AML Configuration 의 workspace-level 차이

`vault-structure-best-practices.md`, p.5-6: Multi-workspace 가 필요한 이유 중 하나로 **다른 AML default** (fail-on-unknown vs pass-on-unknown) 명시.

→ AML 처리 정책은 workspace 단위 default 가능. Per-tx Policy 와 별개 평면.

## Sources (추가)
- `2026-05-18__support-fireblocks-io__transaction-lifecycle.md`, p.4-6 (Stage 9: Policy Engine 14-step 내 위치, approval flow)
- `2026-05-18__support-fireblocks-io__primary-transaction-statuses.md`, p.3-4, p.8 (Stage 9: PENDING_AUTHORIZATION 2h timeout, BLOCKED rule number)
- `2026-05-18__support-fireblocks-io__whitelisting-new-addresses.md`, p.1 (Stage 9: Whitelist Admin Quorum)
- `2026-05-18__support-fireblocks-io__one-time-address-ota-feature.md`, p.1 (Stage 9: OTA Policy 의 방어 역할)
- `2026-05-18__support-fireblocks-io__vault-structure-best-practices.md`, p.4-6 (Stage 9: Smart contract per-op Policy, AML workspace default)

## Stage 10 — Policy 정식 명세 (★ Q-P01 부분 ANSWERED)

`about-policies.md` + `how-policies-work.md` (Stage 10 ingest):

### Policy = Primary Security Control (공식)

`about-policies.md`, p.1:
> "Implementing the correct Policies is critical to protecting your assets. Policies are your **primary security control** in your workspace."

→ Fireblocks 보안 모델의 first-class spine.

### Policy Rule 의 2 Component

`how-policies-work.md`, p.1:
- **Parameters** (= Scope): characteristics — initiator / source / destination / asset
- **Actions**: Allow / **Approved by** / Block

### 3 Action 의 정확한 semantics

`how-policies-work.md`, p.1:
- **Allow** = 자동 approve → designated signer 로 forward
- **Approved by** = 지정 user 또는 user group 이 approve/deny. **모든 associated user role 이 authorized approver role** 이어야 함 (role filter)
- **Block** = 자동 차단

### First-Match Principle

`how-policies-work.md`, p.2:
- Policy 를 top-to-bottom scan
- 첫 match 에서 scan 중단 + action 실행
- **모든 Policy 의 마지막 rule = block-all (default, 삭제 불가)**

### Rule Ordering 규칙 (★)

`how-policies-work.md`, p.3-4:
**Principle: most restrictive first**

- **Time period-based rules first** (cumulative limit 가 single-tx rule 보다 먼저)
- **Overlap 시 더 strict 한 rule 먼저** (예: $10M+ 2-approval rule 이 $1M+ 1-approval 보다 앞)

### 5 Default Policy Rules (★ 정식 enumeration)

`about-policies.md`, p.4 (모든 신규 workspace 자동 적용):

**Transfer Policy** (2 rules):
1. Allow NFT transfer → whitelisted address
2. Allow 모든 USD amount, 모든 asset → whitelisted address

**Contract Call Policy**:
3. Allow contract call → 모든 wallet 의 whitelisted smart contract

**Approve Policy**:
4. Allow Web3 Approve tx (contract call 의 자산 인출 권한 부여)

**All Policies (마지막 rule, 모든 Policy 공통, 삭제 불가)**:
5. Block any tx not explicitly allowed

→ **Default-deny architecture**.
→ Default rule 은 **whitelist 가 있어야** 작동 (whitelist 미설정 = 모든 tx block).
→ **Custom Policy 도입 = default 즉시 삭제 (one-way replacement)**. Custom 전부 삭제 → default 복원.

### Policy Types (Transaction Categories)

`about-policies.md`, p.2: Policy 는 tx type 별 분리. Configurable field 가 op type 마다 다름:
- **Scope Fields** (initiator / source / destination 등)
- **Funds Fields** (asset / amount 등)
- **Action & Special Fields**

→ Stage 9 의 Transaction lifecycle 17 status 에 대해 각 status 별 적용 field 가 다름. 상세 표는 `policy-rule-parameters.md` (Stage 10 TIER 3, Source Lake only) 참조.

### Premium Features

`about-policies.md`, p.2:
- **Raw Signing**, **Mint**, **Burn** = premium features, 별도 구매
- Vault Structure Best Practices 의 Mint/Burn/Pause/Deploy/Upgrade segregated vault 권장과 정합

### Policy 관리권

`about-policies.md`, p.3:
> "Only your workspace **Owner or other Admin-level users** can manage Policies. They use the Fireblocks Console to create and make ongoing changes to your Policies. Your assigned approval group must approve any proposed Policy changes."

→ 관리권 = Owner + Admin + NS-Admin. 변경 자체는 **assigned approval group** approve (default = Admin Quorum, 또는 Stage 10 approval-group entity 의 specific group 위임).

### User Group in Policy (★ Stage 10 Approval-Group 의 building block)

`how-policies-work.md`, p.4:
- User group 으로 다중 사용자를 single rule 에 매핑 → team 변경 시 rule 수정 불필요
- **Initiator + Approved by 양쪽**에 user group 사용 가능

**Approved by sub-quorum**:
> "you can also define **approval quorums within a group** as part of the Approved by action... requires **any two members of a user group called Management to approve**"

→ **거버넌스의 3 계층** 확립:
```
Admin Quorum  (workspace-level default)
  └── Approval group  (action-level 위임, 12 actions)
        └── Policy Approved by sub-quorum  (rule-level 위임, user group 기반 N-of-M)
```

### Deposit Control and Confirmation Policy (DCCP)

`about-the-deposit-control-and-confirmation-policy.md` (Stage 10):
- DCCP = blockchain confirmation 횟수 정책 (incoming + outgoing)
- Clear 전 = **inflow/outflow state 에 lock** (사용 불가)
- Clear 후 = wallet available balance + UTXO outputs 즉시 spendable
- Stage 9 `primary-transaction-statuses.md` 의 Confirming → Completed transition 의 정확한 trigger
- Override 메커니즘 + custom build 옵션 별도 존재 (TIER 3 source-lake-only)

## Sources (Stage 10 추가)
- `2026-05-18__support-fireblocks-io__about-policies.md`, p.1-5 (Stage 10: 3 action, first-match, 5 default rules, 관리권, premium features)
- `2026-05-18__support-fireblocks-io__how-policies-work.md`, p.1-5 (Stage 10: rule ordering 규칙, user group sub-quorum, 구체 example)
- `2026-05-18__support-fireblocks-io__about-the-deposit-control-and-confirmation-policy.md`, p.1-2 (Stage 10: DCCP 정의)
- `2026-05-18__support-fireblocks-io__user-group-management.md`, p.1-10 (Stage 10: User group = Policy rule building block)

## Open Questions

- ~~Q-2026-05-18-P01~~ — **부분 ANSWERED (Stage 10)**: 2 component (Parameters + Actions), 3 action (Allow/Approved by/Block), first-match principle, 5 default rule, premium feature (Raw Signing/Mint/Burn). **Rule field 의 상세 enumeration 은 `policy-rule-parameters.md` (TIER 3 source-lake-only) 에 보류**. **API 측 rule object 필드 enumeration 은 Stage 156 에서 [[vendors/fireblocks/tap]] 로 promote** — 단 API action enum 은 `2-TIER` 로 Console "Approved by" 와의 대응 미명시 (Q-2026-07-14-01).
- ~~Q-2026-05-18-P02~~ — **부분 ANSWERED (Stage 9)**: blockchain-standard 직렬화 + Solana 5-tx queue 의 tx 분류 모델 명세
- Q-2026-05-18-G02 — Q+O에서 Owner와 Quorum의 정확한 카운팅
- ~~Q-2026-05-18-S02~~ — **ANSWERED (Stage 10)**: DCCP 정식 정의 — confirmation count 정책, inflow/outflow lock state
