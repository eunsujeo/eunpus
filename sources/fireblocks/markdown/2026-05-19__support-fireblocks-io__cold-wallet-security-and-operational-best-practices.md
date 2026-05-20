<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/cold-wallet-security-and-operational-best-practices
downloaded_at: 2026-05-19
status: lightweight-index (Stage 14, v3.1)
priority: TIER1
domain: Security-Access + Workspace-Management
-->

# Cold Wallet Security and Operational Best Practices

**LIGHTWEIGHT INDEX (Stage 14, v3.1)** — PDF 본문 미로드.

## Why TIER 1
Cold Wallet 운영 BP — Stage 10 의 Risk-G07 (Cold Wallet approval-group 미지원) + Stage 9 Vault Structure BP 의 "Cold Wallet 별도 workspace + rebalancing 권장" 의 implementation 가이드.

## Cross-cut Signal
- Stage 10 의 Risk-G07 (Approval group 미지원 → Admin Quorum 단독, 운영 부담 증가)
- Stage 10 Admin Quorum doc 의 Cold Wallet 특수 규칙 (Support 경유 필수 + Owner-only direct)
- Stage 8 Q-S11 (Owner Yubikey 채택 후 기존 사용자 처리) cross-cut — Cold Wallet 에서 Yubikey enforcement 동일한가?
- Stage 8 Q-S08 (single-signer SPOF) — Cold Wallet 에서 더 strict 한가?
- Stage 8 의 8 Risk-S/G 카테고리와 cross-cut

## Promote Condition
Cold Wallet 운영 가이드라인 필요시. Security audit / compliance review 의 입력.

## Related
- [[vendors/fireblocks/security]] §"Cold Wallet specific"
- [[vendors/fireblocks/risks]] §"Risk-G07 + 8 Risk 카테고리"
- [[entities/fireblocks/admin-quorum]] §"Cold Wallet 특수 규칙"
- [[entities/fireblocks/workspace]] §"Cold workspace 운영"
