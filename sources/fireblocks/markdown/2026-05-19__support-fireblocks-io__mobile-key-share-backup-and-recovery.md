<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/mobile-key-share-backup-and-recovery
downloaded_at: 2026-05-19
original_pdf: 2026-05-19__support-fireblocks-io__mobile-key-share-backup-and-recovery.pdf
status: lightweight-index (Stage 12 v3 policy)
priority: TIER1
domain: Mobile-Recovery
-->

# Mobile Key Share Backup and Recovery

**LIGHTWEIGHT INDEX (Stage 12, v3 policy)** — PDF 본문 미로드.

## Why TIER 1
Mobile-Recovery domain spine 직격. Stage 5 의 cloud backup 모델 + 3 recovery scenarios + Stage 8 의 3-share signing (1 mobile + 2 cloud) spine 보강 후보.

## Expected Cross-Cut Signals (verify on promote)
- Q-M03 (cloud key share 분포 — Stage 8 ANSWERED 보강)
- Q-W02 (Recovery passphrase 분실 시 경로 — Stage 5 ANSWERED 보강)
- Stage 3 의 mobile device re-enroll 2-day windowing
- Stage 5 의 `recovery-passphrase.md` 의 cloud backup encryption model
- Stage 8 의 distributed signing ceremony (cloud-based mediator)

## Promote Condition
사용자가 외부 도구로 본문 추출 후 제공 시 promote. 그 전까지 deferred.

## Status
- PDF rename: ✓
- meta.yml: ✓
- Body: lightweight index only

## Related
- [[entities/fireblocks/mobile-device]]
- [[entities/fireblocks/mpc-key-share]]
- [[entities/fireblocks/recovery-passphrase]]
- [[entities/fireblocks/workspace-keys-backup]]
