<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/raw-signing
downloaded_at: 2026-05-19
original_pdf: 2026-05-19__support-fireblocks-io__raw-signing.pdf
status: lightweight-index (Stage 12 v3 policy)
priority: TIER1
domain: Governance (Premium signing feature)
-->

# Raw Signing

**LIGHTWEIGHT INDEX (Stage 12, v3 policy)** — PDF 본문 미로드.

## Why TIER 1
Stage 10 `about-policies.md` 의 **premium feature** 3종 (Raw Signing / Mint / Burn) 중 하나. Stage 9 `transaction-lifecycle.md` 의 special case (Raw Signing outgoing: Pending Signature → Completed without broadcast). Stage 8 의 dApp Protection 의 "Raw Signing/Contract Calls 은 제한된 정보만 표시" 와 연결.

## Expected Cross-Cut Signals (verify on promote)
- Stage 10 Q-P01 (Policy rule 의 Raw Signing 처리 옵션)
- Stage 9 Stage 4 의 tx lifecycle 특수 path (Raw Signing → Completed without broadcast)
- Stage 8 의 mobile signing 의 limited info display
- Stage 8 의 FSPM "risky unused workspace settings" 영역의 "raw signing" 항목과 연결 (FSPM 이 unused raw signing 을 attack surface 로 식별)
- Stage 9 의 "NOT BROADCAST BY FIREBLOCKS" tag

## Promote Condition
Premium feature licensing 또는 DeFi/smart contract 운영이 operational priority 일 때 promote.

## Related Cluster 4 (Developer/API) Promote 후보
- **`Raw Signing`** ← 본 파일
- **`Typed Message Signing`** (raw, TIER 2 future promote)

## Status
- PDF rename: ✓
- meta.yml: ✓
- Body: lightweight index only

## Related
- [[entities/fireblocks/policy]] §"Premium features (Raw Signing / Mint / Burn)"
- [[entities/fireblocks/transaction]] §"Raw Signing Special Path"
- [[vendors/fireblocks/security]] §"FSPM monitoring scope"
