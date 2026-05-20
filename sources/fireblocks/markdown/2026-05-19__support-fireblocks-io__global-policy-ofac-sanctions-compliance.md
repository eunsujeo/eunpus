<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/global-policy-ofac-sanctions-compliance
downloaded_at: 2026-05-19
status: lightweight-index (Stage 14, v3.1)
priority: TIER1
domain: Governance + Security-Access (Global compliance enforcement)
-->

# Global Policy: How Fireblocks ensures OFAC sanctions compliance

**LIGHTWEIGHT INDEX (Stage 14, v3.1)** — PDF 본문 미로드.

## Why TIER 1
**Global compliance enforcement** — Customer 의 Policy 와 별개로 Fireblocks platform 이 OFAC sanctions 를 강제하는 plane. **Stage 10 의 Policy 의 "Block-all default" + Stage 8 의 FSPM "SOC2 compliance violation" 과 별도 평면**.

## Cross-cut Signal
- **Customer Policy vs Fireblocks Global Policy 2 평면 분리** (★ 새로운 spine 후보)
  - Customer Policy: Stage 10 의 user-defined rule (allow/block/approval)
  - Global Policy: Fireblocks platform-wide enforcement (OFAC sanctions list)
- Stage 9 `transaction-lifecycle.md` 의 어느 step 에서 enforcement 가 일어나는가? (Step 5b/5c 의 Screening Service 와는 다른 layer 가능성)
- Stage 8 의 audit log Compliance category 의 OFAC violation 이벤트 (존재 여부 본문 미확인)
- Stage 9 의 dApp Protection 의 "sanctioned destination" 알림과 cross-cut

## Promote Condition
- Regulatory compliance review 시점
- OFAC sanctions enforcement 의 architecture 위치 / bypass 가능성 검증 필요시

## Potential New Q
- Q: Customer 가 OFAC global policy 를 disable / override 할 수 있는가? (Risk-G 카테고리 후보)
- Q: Global Policy 는 14-step schematic 의 어디서 enforce 되는가?

## Related
- [[vendors/fireblocks/compliance]]
- [[vendors/fireblocks/risks]] — Global Policy bypass 가능성 검토 시 (Risk-G 후보)
- [[entities/fireblocks/policy]] §"Global Policy vs Customer Policy"
- [[vendors/fireblocks/security]] §"FSPM compliance scope"
