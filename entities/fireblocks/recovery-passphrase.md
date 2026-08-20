---
type: entity
vendor: fireblocks
status: stable
tags: [recovery, backup, security]
stage_introduced: 1
last_updated_stage: 6
source_count: 8
related:
  - admin
  - lifecycle-events
  - mobile-app
  - mobile-device
  - mpc-key-share
  - owner
  - risks
  - signer
  - workspace-keys-backup
---
# Entity: Recovery Passphrase

## Summary

Owner의 개인 비밀로, **Workspace Keys Backup의 암호화 키** 역할을 한다 (source: `2026-05-18__support-fireblocks-io__transfer-workspace-owner.md`, p.1). Owner 이전 시 신임 Owner가 자신의 recovery passphrase를 **verify**해야 이전이 완료된다 — 즉 Owner 임명의 필수 신원 자산.

## Key Concepts

- **Workspace Keys Backup을 암호화** ("a new backup encrypted with their recovery passphrase") (`transfer-workspace-owner.md`, p.1)
- **Owner 이전의 verify 대상** — 신임 Owner가 자신의 recovery passphrase를 verify해야 이전이 진행됨 (`transfer-workspace-owner.md`, p.1)
- 각 Owner는 자신의 recovery passphrase를 가진다 — 이전 시 신임 Owner는 본인의 것을 사용 (`transfer-workspace-owner.md`, p.1)
- Stage 1 cross-ref: Owner의 책임에 "Emergency operations like freezing the workspace, creating a backup kit, and recovery" 명시 (`user-roles.md`, p.2)

## Details

### Owner 이전 시 역할

`transfer-workspace-owner.md`, p.1의 흐름:

1. 사전 조건 확인 (신임 Owner role, MPC 키 share 생성 완료, Policies)
2. 현 Owner의 Workspace Keys Backup이 있다면 유지/파기 결정 — 파기 시 신임 Owner가 본인 recovery passphrase로 새 backup 생성
3. Support에 이전 요청 제출
4. 양 Owner Support 영상 통화 신원 확인
5. **신임 Owner가 본인의 recovery passphrase를 verify**
6. 이전 완료 (3–5 영업일)

### 분실 시 경로

본 자료군에 명시 없음. Stage 3의 Related Articles에 "Reset the Owner's Recovery Passphrase" 항목이 있으나(`transfer-workspace-owner.md`, p.2) 본 위키에는 그 자료 미수집 → [[open-questions/fireblocks]] Q-2026-05-18-W02.

### Workspace Keys Backup과의 결합

- recovery passphrase는 backup의 **암호화 키**
- backup이 없으면 passphrase의 직접 사용처는 본 자료에 명시 없음 (단 Owner 이전 verify에는 여전히 사용됨)
- 두 자산은 별도 entity로 분리하되 강하게 결합된 평면: [[entities/fireblocks/workspace-keys-backup]]

## Stage 5 — 전체 명세

### 누가 생성하는가

`recovery-passphrase.md`, p.1: **Owner / Admin / Signer** — initial user setup 시 mobile app에서 필수 생성.

→ MPC 키 미보유 role (NSA, Approver, Editor, Viewer, Security Auditor, Security Admin)에 대한 본 자료 명시 없음 — 추정상 불필요.

### Requirements (`recovery-passphrase.md`, p.1)

- ≥10 characters
- ≥1 capital letter
- ≥1 number
- ≥1 special character

Mobile app이 client-side validate.

### Cloud Backup 역할

`recovery-passphrase.md`, p.1 직접 인용:

> "Fireblocks uses the recovery passphrase to create an encrypted backup of the mobile device's private key share, which is stored securely in Fireblocks' cloud servers."

이로써 다음이 확정:
- Fireblocks가 cloud servers에 mobile device의 MPC key share **encrypted backup** 보관
- Recovery passphrase는 이 backup의 암호화 키
- Verify / Recovery 시 cloud copy 사용
- 사용자 삭제 시 폐기 (Stage 2 `delete-users.md`, p.1 cross-ref)

### Verify Passphrase (`recovery-passphrase.md`, p.2)

- Mobile app `Settings > Verify recovery passphrase`
- Cloud에서 backup download → 입력한 passphrase로 decrypt 시도
- 성공: confirmation
- **3회 연속 실패 → 5분 lockout**
- Multi-user device: user별 결과 (Verified / Incorrect / Inactive)

### Periodic Passphrase Verification

`recovery-passphrase.md`, p.2–3:

- iOS 2.5.7+, Android 2.5.2+
- 월 1회 알림 (multi-linked-user device는 30일에 한 알림으로 모든 user 검증)
- 운영 영향 없음 — dismiss 가능
- Verified/Incorrect 혼재 시:
  - **Change all recovery passphrases** — 모든 linked user passphrase reset
  - **Verify another passphrase** — 추가 verify (>3 실패 시 lockout)

### Risk Assessment

`recovery-passphrase.md`, p.3: **Workspace Owner와 Admin이 audit logs에서 key share risk status 검토 가능**. Log에는 verification 알림 발송 시점·정상 verify 여부 포함.

### Reset 절차 — Q-W02 해소

**Admin/Signer** (`reset-an-admin-or-signers-recovery-passphrase.md`, p.1):

1. Mobile app `Settings > Change Passphrase` (Android) / `Settings > Reset Recovery Passphrase` (iOS)
2. PIN
3. New passphrase (requirements 만족) + Continue
4. Confirm + Continue
5. Biometric → 완료

**Owner** (`reset-the-owners-recovery-passphrase.md`, p.1–2): 위 1–5 +

6. **기존 recovery package 파기 권장**:
   - Org-managed: 내부 파기
   - Third-party DRS: provider 요청
7. **새 recovery package 요청** to Fireblocks Support:
   - Offline backup: Support 요청
   - Third-party DRS: Support → DRS provider recreate

### 3 Recovery Scenarios

`recovery-passphrase.md`, p.3–4:

| Scenario | 자산 | 사용처 |
|---|---|---|
| Owner key share recovery | 본인 recovery passphrase (또는 password-less) | Owner device 분실/신규 |
| Admin/Signer key share recovery | **다른 authorized signer**의 recovery passphrase | Admin/Signer device 분실 |
| Workspace Keys Recovery | Recovery passphrase + Workspace Keys Backup | Owner의 full private key 재구성 |

### Auto-passphrase (Enterprise 옵션, Stage 6)

`security-checklist.md`, p.1 — **Recovery passphrase의 manual entry를 대체하는 enterprise-grade 옵션**:

- **Support enable 필요** (자체 활성 불가)
- 작동 방식:
  - 모든 사용자의 manual entry 비활성화
  - Mobile device가 **secure random passphrase 자동 생성**
  - **고객이 제공한 RSA key로 암호화**
  - 암호화된 passphrase는 Fireblocks에 저장
  - **Offline machine에서 decrypt 가능** (recovery 시)
- 효과:
  - 사용자 인적 오류(분실/유출) 제거
  - Recovery passphrase의 일관성·표준화
- Trade-off:
  - 새로운 SPOF: RSA private key의 안전 보관
  - Fireblocks 측에 encrypted passphrase 저장 (default 흐름과 동일하지만 사용자가 직접 기억하는 layer가 사라짐)
- Open Questions:
  - Q-S01 — RSA key 형식·길이, storage·access 정책 세부

→ [[vendors/fireblocks/security]] §"Backup and Recovery" / [[vendors/fireblocks/risks]] §"Auto-passphrase Trade-off" 참조.

## Related Pages

- [[entities/fireblocks/workspace-keys-backup]] — passphrase로 암호화되는 대상
- [[entities/fireblocks/user-roles/owner]] · [[entities/fireblocks/user-roles/admin]] · [[entities/fireblocks/user-roles/signer]] — 보유 주체
- [[entities/fireblocks/mobile-device]] — Cloud backup 모델 통합
- [[entities/fireblocks/mpc-key-share]] — 백업 대상
- [[vendors/fireblocks/lifecycle-events]] — Recovery Passphrase Reset 절
- [[vendors/fireblocks/mobile-app]] — Verify / Periodic 흐름
- [[vendors/fireblocks/risks]] — Lockout / Periodic의 운영 함의

## Sources

- `2026-05-18__support-fireblocks-io__transfer-workspace-owner.md`, p.1
- `2026-05-18__support-fireblocks-io__user-roles.md`, p.2 (Owner의 backup/recovery 책임)
- `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.1–4 (Stage 5: 전체 명세)
- `2026-05-18__support-fireblocks-io__reset-an-admin-or-signers-recovery-passphrase.md`, p.1 (Stage 5)
- `2026-05-18__support-fireblocks-io__reset-the-owners-recovery-passphrase.md`, p.1–2 (Stage 5)
- `2026-05-18__support-fireblocks-io__fireblocks-mobile-app-updates.md`, p.2 (Stage 5: key material 업데이트 시 요구)
- `2026-05-18__support-fireblocks-io__device-migration.md`, p.2 (Stage 5: migration export/import에 passphrase)
- `2026-05-18__support-fireblocks-io__security-checklist.md`, p.1 (Stage 6: Auto-passphrase 옵션)

## Open Questions

- ~~Q-2026-05-18-W02~~ — **ANSWERED (Stage 5)**: Mobile app self-reset (Admin/Signer/Owner). Owner는 추가로 새 recovery package 요청
- Q-2026-05-18-D04 — Cloud backup의 cryptographic 세부 (Fireblocks decrypt 가능성·threshold 참여)
- Q-2026-05-18-D06 — Periodic Verification 강제 가능성·외부 SIEM forwarding
- Q-2026-05-18-S01 — Auto-passphrase cryptographic 메커니즘 (RSA 형식·storage)
