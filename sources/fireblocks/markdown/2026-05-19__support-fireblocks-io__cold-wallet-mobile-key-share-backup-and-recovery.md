<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/cold-wallet-mobile-key-share-backup-and-recovery
downloaded_at: 2026-05-19
status: lightweight-index (Stage 14, v3.1)
priority: TIER1
domain: Mobile-Recovery + Workspace-Management (Cold ↔ Mobile intersection)
-->

# Cold Wallet Mobile Key Share Backup & Recovery

**LIGHTWEIGHT INDEX (Stage 14, v3.1)** — PDF 본문 미로드.

## Why TIER 1
**Mobile-Recovery + Cold Wallet workspace 교차점**. Cold Wallet 의 MPC key share 가 어떻게 분포되는지 — Hot workspace 의 "1 mobile + 2 Fireblocks SGX cloud" 모델 (Stage 8) 과 동일한가, 다른가?

## Cross-cut Signal
- Stage 8 `mpc-cmp.md`: 3-endpoint signing (Customer mobile/SGX + 2 Fireblocks Azure SGX)
- Stage 8 `security-aspects-signing-with-the-fireblocks-mobile-app.md`: 1 mobile + 2 cloud + cloud-based mediator
- Stage 5 `recovery-passphrase.md`: cloud backup model (Fireblocks cloud servers, passphrase-encrypted)
- **Cold Wallet 의 key share 분포 모델은?** (mobile? 별도 cold device? Fireblocks SGX?)
- Stage 12 `mobile-key-share-backup-and-recovery.pdf` (Hot 일반) vs 본 Cold variant 비교

## Promote Condition
- MPC 모델 분명화 필요시 (Cold Wallet 의 share 분포)
- Cold Wallet 의 recovery scenario 명세 필요시

## Potential New Q
- Q: Cold Wallet 의 MPC share 분포가 Hot 과 동일한가? 별도 모델인가?
- Q: Cold Wallet device = mobile 인가 별도 hardware 인가? (`cold-wallet-device-requirements` 본문 cross-check 필요)
- Q: Cold ↔ Hot rebalancing 시 어느 plane 의 signing 이 발동하는가?

## Related
- [[entities/fireblocks/mpc-key-share]] §"Cold Wallet distribution model"
- [[entities/fireblocks/mobile-device]] §"Cold Wallet plane"
- [[entities/fireblocks/recovery-passphrase]] §"Cold Wallet variant"
- [[entities/fireblocks/workspace-keys-backup]] §"Cold Wallet variant"
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__mobile-key-share-backup-and-recovery]] (Hot 일반, Stage 12)
