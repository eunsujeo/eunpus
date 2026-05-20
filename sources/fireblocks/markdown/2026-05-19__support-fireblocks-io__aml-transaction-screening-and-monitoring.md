<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/aml-transaction-screening-and-monitoring
downloaded_at: 2026-05-19
status: lightweight-index (Stage 14, v3.1)
priority: TIER1
domain: Governance / Security-Access
-->

# AML Transaction Screening & Monitoring

**LIGHTWEIGHT INDEX (Stage 14, v3.1)** — PDF 본문 미로드.

## Why TIER 1
**Q-S03 응답 우선 후보** — Stage 6 의 미해소 Q (AML Transaction Screening Policy 의 정확한 동작) 의 본문 응답 자료.

## Cross-cut Signal
- Q-S03 (AML Transaction Screening Policy 동작) — Stage 6 partial, 본문 promote 시 응답
- Stage 9 의 `PENDING_AML_SCREENING` 상태 (incoming + outgoing 양쪽)
- Stage 9 의 `Transaction (General)` substatus enumeration: "Alerted by AML / AML failed / AML screening blocking period timed out / AML result rescreened / Rejected by AML"
- Stage 9 의 dApp Protection (Pending Security Screening) 과 별개 plane — 두 plane 비교 가능
- Stage 8 audit log Compliance category 와 정합

## Promote Condition
Q-S03 응답이 필요한 시점. AML monitoring 의 운영 절차가 priority 일 때.

## Related
- [[vendors/fireblocks/compliance]] §"AML"
- [[entities/fireblocks/policy]] §"AML Transaction Screening Policy"
- [[entities/fireblocks/transaction]] §"PENDING_AML_SCREENING + AML substatuses"
- [[open-questions/fireblocks]] Q-S03
