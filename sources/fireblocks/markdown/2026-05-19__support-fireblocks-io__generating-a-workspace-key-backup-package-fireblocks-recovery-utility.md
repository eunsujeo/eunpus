<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/9716732961820-Generating-a-Workspace-Key-Backup-Package-Fireblocks-Recovery-Utility
url_status: confirmed (real article ID 발견)
downloaded_at: 2026-05-19
original_pdf: 2026-05-19__support-fireblocks-io__generating-a-workspace-key-backup-package-fireblocks-recovery-utility.pdf
status: full
priority: TIER1
domain: mobile-recovery / workspace-keys-backup / SaaS-MPC-variant
cluster: workspace-keys-backup
acquisition_method: pdftotext -layout → bash chunked sed (Stage 30 Mode C, 347 lines / 19 KB / 5 chunks)
-->

# Generating a Workspace Key Backup Package — Fireblocks Recovery Utility (Stage 30 Mode C)

**Status**: deep-ingested Stage 30. PDF body 미 LLM context 전체 로드 — `pdftotext -layout` → 347-line text file → bash chunked sed (5 × 50-70 line chunks).

## Scope distinction (★ Stage 29 vs Stage 30)

| Source | Plane | Variant |
|---|---|---|
| Stage 29 (`hosted-mpc-backup-and-recovery.md`) | **Hosted MPC** | 3-share kit (1 mobile + 2 Guard) |
| Stage 30 (본 source) | **SaaS MPC** | **6-file package** (3 ECDSA + 3 EDDSA) using Recovery Utility |

두 plane 의 backup 가 **다른 procedure**. 본 source 는 SaaS MPC 의 Native Workspace Key Backup solution 의 정식 procedural 명세.

## Backup Package Contents (★ Q-S09 substantial advance)

직접 인용:
> "The package is composed of **six files** that contain the following key share components:
> - ECDSA cloud key share 1 (encrypted with the RSA public key you provide)
> - ECDSA cloud key share 2 (encrypted with the RSA public key you provide)
> - ECDSA Owner mobile key share (encrypted with the Owner generated passphrase)
> - EDDSA cloud key share 1 (encrypted with the RSA public key you provide)
> - EDDSA cloud key share 2 (encrypted with the RSA public key you provide)
> - EDDSA Owner mobile key share (encrypted with the Owner generated passphrase)"

→ **6 files = 2 curves × 3 shares**. xprv (ECDSA extended private key) + fprv (EDDSA extended private key) reconstruction 의 backup 단위.

## Recovery Utility App + Air-gapped Setup

- Console: `Settings > Key backup > In-house backup` 에서 다운로드 (OS-specific binary)
- USB stick 으로 binary 를 offline 머신에 전송 + 실행
- **"permanently disconnected from all networks"** (직접 인용) — Online 상태 시 utility 가 red warning 표시

## RSA-4096 Keypair Generation (★ 두 방법)

### Method 1 — Recovery Utility 내장
- `Use the Recovery Utility > Generate Recovery Keys`
- private key passphrase 입력 (≥ 4 chars, recommended **≥ 12 chars with mixed case + numbers + symbols**)
- 자동으로 RSA keypair 생성

### Method 2 — Manual openssl (직접 인용)
```bash
openssl genrsa -aes128 -out fb-recovery-prv.pem 4096
openssl rsa -in fb-recovery-prv.pem -outform PEM -pubout -out fb-recovery-pub.pem
```

→ **RSA-4096** (Stage 29 의 generic "RSA public key" → 정확 spec). **AES-128** symmetric protection for private key.

## Approval Flow

1. Recovery Utility 가 public key zip 다운로드 → public key 만 online 머신으로 USB 전송
2. Console `Settings > Create backup` → public key 파일 upload
3. **Owner + Admin Quorum** 승인 필수
4. **48-hour approval window** — 초과 시 process 재시작 (직접 인용: "If they do not approve within 48 hours, you must restart this process.")
5. Recovery Utility 에서 **Start Approval** → mobile app 에 **QR code 또는 short key** 전송 (offline ↔ online bridge)
6. Mobile app: Admin Quorum 이 QR scan 또는 short key 입력 → public key 확인 → PIN + biometric → Approve
7. Recovery Utility "View Public Key" 로 양쪽 일치 검증 후 최종 Approve

## Backup Kit Download (★ once-only)

직접 인용:
> "After finalizing the approval process on the Fireblocks mobile app, the workspace Owner can click Download backup kit to download the backup package. **The backup package can only be downloaded once.**"

→ Single attempt — 다운로드 실패 시 process 전체 재시작 필수. 운영 fragility signal.

## Production warning (직접 인용)
> "We do not recommend running tests using your production workspace keys as it could put your signing keys at risk of exposure. You should always test the native Workspace Key Backup and Recovery process **in a testnet workspace first**."

## Related Articles
- MPC-CMP rollout for Fireblocks mobile application
- Reset an Admin or Signer's Recovery Passphrase
- Withdrawing your assets
- Verifying a recovery package
- Recovering private key material ← **★ Q-S09 reconstruction 잔존 영역의 1차 source**

## Architectural 신호 (Stage 30 신규)

1. **6-file backup package** = 2 curves (ECDSA + EDDSA) × 3 shares
2. **RSA-4096 + AES-128** specific cryptographic spec (Stage 29 의 generic "RSA" 보강)
3. **48-hour approval window** — operational fragility (window 초과 = restart)
4. **Once-only backup kit download** — single attempt (재시도 시 process restart)
5. **Recovery Utility app** — dedicated offline tool, USB transfer pattern
6. **QR-code / short-key bridge** — offline ↔ online air-gapped 통신 패턴

## Q-S09 잔존 영역 (Stage 30 후)

해결: backup procedure full, 6-file structure, RSA-4096 + AES-128, Recovery Utility flow, 48h + once-only, air-gapped pattern
**잔존**:
- **Rotation 정책** — 본 자료에 명시 없음
- **Recovery/reconstruction procedure** — 별도 doc ("Recovering private key material") 가 1차 source
- **DR Service operational use** — Fireblocks 측 DR service 의 운영 측면 (이는 backup → reconstruction 의 reconstruction 측)

## Related cite targets
- [[entities/fireblocks/workspace-keys-backup]] §"Stage 30 — SaaS MPC variant (Recovery Utility flow)"
- [[entities/fireblocks/mpc-key-share]] §"SaaS MPC Backup 모델"
- [[vendors/fireblocks/architecture]] §"Disaster Recovery Services" (xprv+fprv backup 단위 명시)
- [[vendors/fireblocks/risks]] §"Risk-S09" (48h + once-only fragility)

## Source
- `sources/fireblocks/pdf/2026-05-19__support-fireblocks-io__generating-a-workspace-key-backup-package-fireblocks-recovery-utility.pdf`
- Acquisition: pdftotext + bash chunked sed (5 chunks, 347 lines)
