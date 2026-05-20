<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/23634240188700-How-Policies-work
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__how-policies-work.pdf
status: full
priority: TIER1
domain: Governance
-->

# How Policies work

*Updated 5 months ago*

## One-line summary

`about-policies.md` 보강 — Policy Engine 의 **first-match principle**, **rule ordering 규칙** (most restrictive first, time-based before single-tx), **3 action 의 detailed semantics** (특히 **Approved by 의 user group sub-quorum** 옵션 — "any N members of group approve"), **실제 4-rule example** 으로 first-match 흐름 시연.

## Key Concepts

### Rule 의 2 Component (재정의)

p.1:
- **Parameters** = Scope: who initiates / from-to / which asset
- **Actions**: Allow / **Approved by** / Block

### 3 Action 의 정확한 semantics (★)

p.1:
- **Allow** = Policy Engine 이 자동 approve → designated signer 로 forward
- **Approved by** = 지정 user/user group 이 approve 또는 deny. **모든 associated user role 이 authorized approver role 이어야 함** (Policy approval 의 role filter 와 정합)
- **Block** = 자동 차단

### First-Match Principle 동작

p.2:
- 각 tx 에 대해 Policy 를 **top-to-bottom scan**
- 첫 match 에서 scan **중단** + 해당 rule action 실행
- 매치 안되면 다음 rule
- **모든 Policy 의 마지막 rule = block-all (default)** — 어느 rule 도 match 안하면 차단

### Example: 4-Rule Transfer Policy 적용 (p.3)

```
| # | Name           | Initiator     | Signer    | Source | Destination     | Amount         | Asset | Action                       |
|---|----------------|---------------|-----------|--------|-----------------|----------------|-------|------------------------------|
| 1 | MG Only        | Management    | Initiator | Any    | Any             | $1M/tx         | All   | Approval: 1 of 1 user        |
| 2 | Over $1M       | Traders       | Initiator | Any    | Whitelisted     | $1M/tx         | All   | Approval: 1 of 3 users       |
| 3 | Trading Daily  | Traders Mgt   | Initiator | Any    | Any             | $0M/tx         | All   | Approval: 5 of 5 users       |
| 4 | Default block  | Any           | Initiator | Any    | Any             | Unlimited USD  | All   | Block                        |
```

John (Signer + Traders 그룹) 가 $500K BTC → whitelisted counterparty 송금:
1. Rule 1 skip — Initiator 가 Management 그룹 아님
2. Rule 2 skip — $500K < $1M
3. Rule 3 **match** → Head of Trading 1명 approve 필요
4. Approve 후 → **Initiator (John) 가 Designated Signer** 로 지정되어 본인 sign

→ Rule 3 의 designated signer 가 "Initiator" 이므로 initiator 본인이 서명 가능.

### Rule Ordering 규칙 (★)

p.3-4:

**Principle**: **most restrictive first**

**구체 규칙 1**: **Time period-based rules first** (cumulative limit) — 시간 기반 제한이 single-tx rule 보다 먼저여야 enforce 됨

**구체 규칙 2 (overlap 예시)**: 두 rule 이 같은 initiator 에 적용되나 amount 가 overlap:
- Rule 1: $1M+ 무한대, 1 approval
- Rule 2: **$10M+** 무한대, 2 approvals

**잘못된 순서 (rule 1 먼저)**:
- $20M tx 가 rule 1 매치 → 1 approval 로 통과
- Rule 2 의 의도 (큰 금액은 2 approval) 가 enforced 안 됨

**올바른 순서 (rule 2 먼저)**:
- $20M tx 가 rule 2 매치 → 2 approval 강제

→ 결론: **더 strict 한 rule 이 더 앞에 배치**

### User Group 의 Policy 사용 (★)

p.4:
- User group 으로 **다중 사용자를 single rule 에 매핑** → team 변경 시 rule 수정 불필요
- **Initiator** 와 **Approved by** 양쪽에 user group 사용 가능

### Approved by 의 Sub-Quorum (★)

p.4: "you can also define **approval quorums within a group** as part of the Approved by action for a rule. For example, you can make a rule that requires **any two members of a user group called Management to approve** if a transaction matches that rule's parameters."

→ **Approval group entity 와 별개의 평면**:
- Approval group = workspace-wide governance (12 actions 의 approval 위임)
- Policy 의 Approved by sub-quorum = **per-rule 의 N-of-M user group 매칭** — rule-level 위임

→ 거버넌스의 3 계층:
```
Admin Quorum  (workspace-level default)
  └── Approval group  (action-level 위임, 12 actions, user group 기반)
        └── Policy Approved by sub-quorum  (rule-level 위임, user group 기반)
```

### 추가 User Group 패턴 (p.4)

- "Owner 가 initiate, **Admins user group 의 1명 이상 approve**"
- "**Admins user group 의 어느 멤버든 initiate 가능**"

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__how-policies-work.pdf` (5 pages).

## Related Pages (cite targets)
- [[entities/fireblocks/policy]]
- [[vendors/fireblocks/policy-engine]]
- [[entities/fireblocks/approval-group]]
- [[entities/fireblocks/admin-quorum]]
- [[entities/fireblocks/designated-signer]]
