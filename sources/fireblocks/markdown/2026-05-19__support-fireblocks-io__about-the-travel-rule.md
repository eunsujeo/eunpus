<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/about-the-travel-rule
downloaded_at: 2026-05-19
status: lightweight-index (Stage 14, v3.1)
priority: TIER1
domain: Governance + Security-Access (Travel Rule plane)
-->

# About the Travel Rule

**LIGHTWEIGHT INDEX (Stage 14, v3.1)** — PDF 본문 미로드.

## Why TIER 1
Travel Rule plane meta — FATF Travel Rule regulatory compliance spine. AML 과 별개 plane 이지만 architecture 측에서는 동일 Screening Service plane (Stage 9 Step 5c).

## Cross-cut Signal
- Stage 9 14-step Step 5c (Screening Service → Travel Rule Provider)
- Stage 9 `transaction-lifecycle.md` 의 outgoing/incoming 양쪽 flowchart 에 "Transaction Travel Rule Screening" 단계 존재
- Stage 9 `primary-transaction-statuses.md` 의 PENDING_AML_SCREENING 의 sibling: Travel Rule status
- TRUST platform (별도 file) = Notabene 의 Travel Rule provider 후보
- AML 과 비교 spine: 둘 다 outgoing tx 의 compliance gate, 단 Travel Rule = originator/beneficiary 메타데이터 교환 (PII), AML = address/destination risk scoring

## Promote Condition
Travel Rule compliance 가 active operational priority 일 때 (regulated jurisdiction 운영).

## Related
- [[vendors/fireblocks/compliance]] §"Travel Rule"
- [[entities/fireblocks/policy]] §"Travel Rule configuration"
- [[entities/fireblocks/transaction]] §"Travel Rule screening states"
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__aml-compliance-cluster-catalog]]
