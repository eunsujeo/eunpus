<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/about-backup-and-recovery
downloaded_at: 2026-05-19
original_pdf: 2026-05-19__support-fireblocks-io__about-backup-and-recovery.pdf
status: lightweight-index (Stage 12 v3 policy — PDF body not loaded)
priority: TIER1
domain: Mobile-Recovery / Workspace-Management / Security-Access
-->

# About Backup and Recovery

**LIGHTWEIGHT INDEX (Stage 12, v3 policy)** — PDF 본문 미로드. filename + URL + domain tag + cross-cut signal 만 기록.

## Why this is TIER 1

Mobile-Recovery + Workspace-Management 도메인의 **meta hub** 후보. Backup & Recovery 가 Fireblocks 의 Disaster Recovery spine 의 entry point.

## Expected Cross-Cut Signals (sight unseen, to verify on promote)

- Stage 3 Owner identity recovery 절차
- Stage 5 의 [[entities/fireblocks/recovery-passphrase]] (cloud backup model)
- Stage 5 의 [[entities/fireblocks/workspace-keys-backup]] (Owner-managed DR asset)
- Stage 5 의 3 recovery scenarios (Owner / Admin-Signer / Workspace Keys Recovery)
- Stage 8 의 Q-S09 (DR Service xprv+fprv 운영 절차 — SPOC 경고)
- Stage 8 의 `fireblocks-cloud-architecture.md` 의 Disaster Recovery Services component

## Promote Condition

본 문서는 Backup & Recovery cluster (22 PDFs) 의 entry point. Full deep ingest 가 진정 필요시:
1. 사용자가 외부 도구로 PDF → markdown 변환 후 제공
2. 또는 별도 chunked section 단위로 사용자가 paste

## Source Lake Cluster: Backup & Recovery (22 PDFs, Stage 12)

### Meta + Native Backup
- `about-backup-and-recovery.pdf` ← 본 파일 (TIER 1 index)
- `introduction-to-native-backup-and-recovery.pdf` ← TIER 2 deferred
- `how-to-perform-key-backup-and-recovery.pdf` ← TIER 2 deferred
- `security-and-maintenance-best-practices.pdf` ← TIER 1 (별도 index)

### Mobile Key Share
- `mobile-key-share-backup-and-recovery.pdf` ← TIER 1 (별도 index)
- `mobile-key-share-backup-and-recovery-with-a-third-party-drs.pdf` ← TIER 2 deferred

### Third-Party DRS
- `third-party-disaster-recovery-services.pdf` ← TIER 1 (별도 index, Q-S09 candidate)
- `Disaster Recovery Service: CoinCover` (raw, TIER 3) — DRS provider specific
- `Disaster Recovery Service: Station70` (raw, TIER 3) — DRS provider specific

### Fireblocks Recovery Utility (tooling)
- `about-the-fireblocks-recovery-utility.pdf` ← TIER 2 deferred
- `Generating a Workspace Key Backup Package - Fireblocks Recovery Utility` (raw, TIER 3) — utility op
- `Verifying a recovery package` (raw, TIER 3) — utility op
- `Recovering private key material` ← TIER 2 deferred (renamed)
- `Reconstructing your workspace` ← TIER 2 deferred (renamed)
- `Withdrawing your assets` (raw, TIER 3) — utility op
- `Using the Recovery Tool for raw signing` (raw, TIER 3) — utility op
- `Importing your private keys to an external wallet` (raw, TIER 3) — utility op
- `Settings & Configuration` (raw, TIER 3) — utility op
- `Fireblocks Recovery Utility Release Notes` (raw, TIER 3) — release notes

### Scripts / Tools
- `Native Workspace Key Backup and Recovery with Python Script` (raw, TIER 3)
- `Fireblocks Vault Key Derivation Tool` (raw, TIER 3)

### Chain-specific Recovery
- `Recover Canton Coin (CC)` (raw, TIER 3)

## Status
- PDF rename: ✓
- meta.yml: ✓
- Markdown body: lightweight index only (Stage 12 v3 policy)
- Entity cite: deferred (정확한 본문 fact 없이는 cite 불가)

## Related (existing wiki, potential cite targets)
- [[entities/fireblocks/recovery-passphrase]]
- [[entities/fireblocks/workspace-keys-backup]]
- [[entities/fireblocks/mpc-key-share]]
- [[entities/fireblocks/mobile-device]]
- [[vendors/fireblocks/security]]
- [[vendors/fireblocks/risks]] §"Risk-S09 DR Service 자체가 SPOC"
