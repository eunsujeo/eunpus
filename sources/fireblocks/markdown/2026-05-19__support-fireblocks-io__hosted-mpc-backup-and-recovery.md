<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/12902205245340-Hosted-MPC-Backup-and-Recovery
url_status: confirmed (real article ID 발견)
downloaded_at: 2026-05-19
original_pdf: 2026-05-19__support-fireblocks-io__hosted-mpc-backup-and-recovery.pdf
status: full
priority: TIER1
domain: mobile-recovery / workspace-keys-backup
cluster: hosted-mpc
acquisition_method: pdftotext -layout → bash chunked sed (Stage 29 Mode C)
-->

# Hosted MPC Backup and Recovery (Stage 29 Mode C)

**Status**: deep-ingested Stage 29. PDF body 미 LLM context 전체 로드 — `pdftotext -layout` → text file → bash chunked sed (87 lines, 3 chunks).

## Key facts (본문 인용)

### vs SaaS MPC (직접 인용)
> "Creating a backup and recovery kit is similar to the process for a SaaS MPC Workspace... The main difference is that in the backup and recovery process for Hosted MPC, the **two Guard Co-Signers that are associated with the Owner are also involved**, in addition to the Owner's Mobile device."

→ Hosted MPC backup = **3 shares total** (1 mobile + 2 Guard). SaaS MPC backup = mobile only.

### Step 1: Initiate backup
- Owner finalizes approval on Fireblocks mobile app
- Owner receives **encrypted kit via email** → download → transfer to **air-gapped machine**
- **2 differences from SaaS MPC**:
  - **Email kit**: "contains the **passphrase-encrypted mobile key share**, which is only one of the Owner's key shares"
  - **Guard Co-signers**: "The other two key shares of the Owner's Guard Co-signers are **encrypted using the RSA public key** and saved as files on the local host in a dedicated folder. **The approval of the Backup and Recovery process triggers this automatically**."
- Note: "The Guard Co-signers' key share files are encrypted and saved with the **RSA public key that you upload to Fireblocks during the backup and recovery process performed via the Console**."

### Step 2: Assemble the kit
- "three encrypted Owner keys-shares at your disposal: one key-share you received via email, and two Guard Co-signer key shares stored locally"
- "copying the encrypted Guard Co-signer key-share files, and your encrypted Mobile key-share to a **different air-gapped machine**"
- "assemble the kit, which now holds all three key shares"

→ **2 air-gapped machines required**: (1) download machine (Guard share files 생성), (2) assembly machine (kit 완성).

### Related Articles (cross-cut)
- Cold Wallet Mobile Key Share Backup & Recovery (Stage 14 cluster)
- Introduction to Native Backup & Recovery (Stage 12 placeholder)

## Architectural 신호 (Stage 29 신규)

1. **3-share backup kit** (1 mobile passphrase-encrypted + 2 Guard RSA-encrypted)
2. **2 air-gapped machine requirement** — download + assembly 분리
3. **RSA public key Console upload** = Guard share 암호화 keystore
4. **Approval-triggered automation** — Backup approval 시 Guard share file 자동 생성
5. **Asymmetric encryption layers**: mobile=passphrase, Guard=RSA — 두 plane 별개 protection

## 잔존 미명세 (Q-S09 partial)

- **xprv+fprv** (extended private keys) — "key shares" 표현만, extended private key 명시 없음
- Air-gapped machine hardening 표준 (network isolation, physical security)
- Rotation 정책
- 분실 시 복구 (Owner mobile + Guard Co-signer 동시 분실)
- Recovery utility 사용 절차

→ paired Mode C: `generating-a-workspace-key-backup-package-fireblocks-recovery-utility` (Stage 28 normalize 완료, Q-S09 full answer 후보)

## Related cite targets
- [[entities/fireblocks/workspace-keys-backup]] §"Hosted MPC variant"
- [[entities/fireblocks/mpc-key-share]] §"Hosted MPC Variant"
- [[vendors/fireblocks/architecture]] §"Hosted MPC Variant"
- [[vendors/fireblocks/risks]] §"Risk-S09" (air-gapped machine 요건)

## Source
- `sources/fireblocks/pdf/2026-05-19__support-fireblocks-io__hosted-mpc-backup-and-recovery.pdf`
- Acquisition: `pdftotext -layout` → `/tmp/waas-mode-c/hosted-mpc-backup-and-recovery.txt` (87 lines) → bash chunked sed
