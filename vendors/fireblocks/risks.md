---
type: vendor-hub
vendor: fireblocks
status: stable
tags: [risks, security, key-link]
stage_introduced: 1
last_updated_stage: 170
source_count: 26
related:
  - admin-quorum
  - api
  - api-key
  - approval-group
  - authentication
  - blockchains
  - csr
  - ip-allowlist
  - lifecycle-events
  - mobile-app
  - mobile-device
  - owner
  - recovery-passphrase
  - security
  - workspace-keys-backup
---
# Fireblocks — Risks

> Stage 1–4 자료에서 직접 확인된 리스크 / 단일 실패점 / 운영 부담. 외부 인시던트·CVE 등은 추후 자료.

## Summary

본 자료군(Help Center IAM·인증·API user·lifecycle 문서)에서 직접 확인 가능한 리스크는 크게 세 갈래:

1. **Owner identity SPOF** — workspace당 1명, 본인 절차 모두 Fireblocks Support 경유, recovery 자산이 Owner 개인 의존
2. **API credential 노출** — `/32 CIDR` IP allowlist 외에는 stolen API key를 차단할 자동화된 방어선 부재
3. **시간 윈도우 운영 부담** — 7-day / 2-day × 2 / 1-hour / 3–5 영업일 등 다양한 시간 제약의 누적

_TODO: 공개 인시던트·CVE·post-mortem은 외부 자료 수집 후 추가._

## Key Concepts

- **Owner SPOF** — Workspace당 1명만 존재, 본인 device/2FA/transfer 모두 Support 경유 (`user-roles.md` p.1; `reset-a-users-2fa.md` p.1; `re-enroll-a-users-mobile-device.md` p.1; `transfer-workspace-owner.md` p.1)
- **Recovery passphrase dependency** — Owner 이전의 verify 자산. 분실 시 경로 미명세 (`transfer-workspace-owner.md`, p.1)
- **API key 도난 위험** — IP allowlist 부재 시 인터넷 임의 위치 사용 가능 (`allowlist-ip-addresses-for-api-user-requests.md`, p.1)
- **거버넌스 변경의 cascade** — user 삭제가 Policy rule을 block 시킬 수 있음 (`delete-users.md`, `rename-and-delete-api-users.md`)
- **Auth0 외부 의존** — SSO/login에서 service provider 역할 (`configure-sso.md`)

## Details

### 1. Owner Identity SPOF

Workspace당 정확히 1명의 Owner만 존재하며 (`user-roles.md`, p.1), 다음 모든 절차가 Fireblocks Support 영상 통화 신원 확인을 요구한다:

| 절차 | 출처 |
|---|---|
| Owner role 임명 | `user-roles.md`, p.2 |
| Owner 본인 2FA reset | `reset-a-users-2fa.md`, p.1 |
| Owner 본인 mobile device 재등록 (다른 workspace의 Owner라도 동일) | `re-enroll-a-users-mobile-device.md`, p.1 |
| Owner role 이전 (양 Owner 모두) | `transfer-workspace-owner.md`, p.1 |
| Workspace unfreeze | `user-roles.md`, p.2 |
| Owner 본인 name/email 변경 | (불가) `edit-users.md`, p.1 |

**완화 메커니즘**:

- **Workspace Keys Backup + Recovery passphrase** ([[entities/fireblocks/workspace-keys-backup]] · [[entities/fireblocks/recovery-passphrase]]) — Owner의 키 자산을 백업하지만 backup 자체도 Owner의 passphrase에 의존
- **Board resolution path** — 현 Owner 부재 시 회사 이사회의 stakeholder quorum이 공식 결의로 신임 Owner 임명 (`transfer-workspace-owner.md`, p.1–2). 단:
  - "Owner 부재"의 정의·Support의 검증 기준 미명세 (Q-2026-05-18-O02)
  - board resolution 형식 요건 미명세 (Q-2026-05-18-O03)
- **Admin Quorum + Approval Group** — Owner 없이 진행 가능한 작업의 위임 평면. 단 Owner의 본인 절차에는 적용 불가

### 2. Recovery passphrase 분실 위험

- Workspace Keys Backup의 암호화 키. 분실 시 backup 무력화 가능성 (확인 필요)
- Owner 이전의 verify 자산. 분실 시 이전 진행 불가
- 분실 복구 경로는 본 자료에 명시 없음 (Q-2026-05-18-W02)
- Related Articles에 "Reset the Owner's Recovery Passphrase" 항목 존재(`transfer-workspace-owner.md`, p.2) — 별도 자료 수집 필요

### 3. API Credential 노출

`add-api-users.md` + `allowlist-ip-addresses-for-api-user-requests.md`:

- API key = API user ID, Console에서 hover로 복사 가능 (조작 위험 낮음 — Console 접근 필요)
- **`fireblocks_secret.key`(CSR private key)**는 로컬 비밀, 도난 시 직접 사용 가능
- **IP allowlist는 선택적** (Fireblocks 권장이지만 강제 아님) — 부재 시 stolen key가 인터넷 임의 위치 사용 가능
- mainnet에서 CSR 재사용 금지 (`add-api-users.md`, p.1)는 노출 격리에 도움
- **자동화된 추가 방어선이 적음**: 2FA·mobile approval 없음 → API user의 1차 비밀이 곧 최종 비밀
- 서드파티 통합은 **Viewer role + 통합당 dedicated API user** 권장 (`add-api-users.md`, p.2)

**완화 메커니즘**:

- IP allowlist 강제 운영 (`/32` CIDR — `entities/fireblocks/ip-allowlist`)
- Policy rule로 트랜잭션 destination·amount 제약
- Co-signer + Callback Handler로 자동 서명 흐름에 외부 검증 훅 삽입

### 4. 시간 윈도우의 누적

| Window | 출처 | 만료 시 영향 |
|---|---|---|
| Add user 승인 — 7 days | `add-users.md`, p.1 | request expire, user 미추가 |
| Mobile device 재등록 후 Owner MPC 재승인 — 2 days | `re-enroll-a-users-mobile-device.md`, p.1 | 본문 명시 없음 (Q-D03) |
| Owner 재승인 후 사용자 MPC 등록 — 2 days | 동일 | 본문 명시 없음 (Q-D03) |
| API pairing token — 1 hour | `re-enrolling-api-users.md`, p.1 | 만료 시 재등록 후 fresh token으로 재페어링 |
| Owner transfer 전체 — 3–5 business days | `transfer-workspace-owner.md`, p.1 | (절차 진행 시간) |

여러 시간 제약이 누적되면 운영 calendar 작성 가치 있음.

### 5. 거버넌스 변경의 cascade

User/API user 삭제 시 그 사용자가 designated signer / second authorizer로 등장하는 **Policy rule이 수정·승인 전까지 block**된다 (`delete-users.md`, p.1; `rename-and-delete-api-users.md`, p.1).

긴급 revoke와 정상 운영 사이의 trade-off가 직접적인 운영 의사결정 대상이 된다.

### 6. Auth0 외부 의존성

SSO 흐름 전체가 Auth0를 service provider로 사용 (`configure-sso.md`, p.1, p.3). Auth0 장애가 Fireblocks Console 로그인에 미치는 영향은 본 자료에 명시 없음 (Q-2026-05-18-AU01).

### 7. Console vs Mobile 비대칭

`delete-users.md`, p.1 + `add-users.md`, p.1:

- **Add는 비동기·mobile approval (7-day window)**
- **Delete는 동기·console immediate (mobile approval 없음)**

Add보다 Delete가 빠르게 동작 — emergency revoke 우선 설계로 보이지만 비대칭 자체의 보안 함의(impersonation 시나리오 등)는 본 자료에 분석 없음 (Q-2026-05-18-L03).

### 8. Mobile App 비가역성 (Stage 5 추가)

`about-the-fireblocks-mobile-app.md`, p.1–2 — Fireblocks mobile app의 3가지 비가역성:

- **iCloud / Google Cloud 백업 불가** — hardware-encrypted, OS 표준 백업에서 제외
- **Uninstall + Re-install 후 자체 복귀 불가** — Owner 또는 Support 개입 필요
- **새 biometric ID 추가 후 재진입 불가**

**Owner uninstall**의 특수성: Owner가 uninstall하면 단순 re-enroll로는 회복 불가 → **Key Share Recovery 절차 필요** (`about-the-fireblocks-mobile-app.md`, p.2). 이는 Owner SPOF의 한 facet으로, [[entities/fireblocks/recovery-passphrase]] + [[entities/fireblocks/workspace-keys-backup]] 자산에 직접 의존.

**완화**:
- Recovery passphrase 사전 verification (Periodic Verification, `recovery-passphrase.md`, p.2)
- Workspace Keys Backup 사전 생성 ([[entities/fireblocks/workspace-keys-backup]])
- API Co-Signer 대체 운영 (자동화 흐름은 mobile uninstall 영향 없음)

### 9. Device Migration 거버넌스 Trade-off (Stage 5)

`device-migration.md`, p.1 — **명시적 security warning**:

> "Device migration transfers your private key share to any new device without administrative approval. This presents security risks if the new device is compromised."

self-service 편의성과 거버넌스 통제의 명시적 trade-off (Stage 3 admin-driven re-enroll과 비교는 [[vendors/fireblocks/lifecycle-events]] §"Device Migration" 참조).

**완화 메커니즘**:
- Owner 단독으로 기능 enable/disable 가능 (`device-migration.md`, p.1)
- Export/Import 모두 PIN + passphrase + biometric 3중 인증 (`device-migration.md`, p.2)
- 새 device compromise 시 우회 가능성은 잔존 리스크 (Q-D05)

### 10. Recovery Passphrase Lockout & Periodic Verification (Stage 5)

`recovery-passphrase.md`, p.2–3:

- **3회 잘못된 passphrase → 5분 lockout** (단일 사용자 lockout, 운영 영향 제한적)
- **Periodic Passphrase Verification** (월 1회): user-managed, dismiss 가능 — 강제 검증 불가, 운영 정책으로 보완 필요 (Q-D06)
- **Risk assessment via audit logs**: Owner/Admin이 verification 상태 모니터링 가능 (`recovery-passphrase.md`, p.3)

### 11. App Update 의존성 (Stage 5)

`fireblocks-mobile-app-updates.md`, p.1–2:

- **Foreground-only updates** — 사용자가 앱을 열어야 적용
- Backward compatibility grace period 제공되지만 미명세
- Key material 업데이트 시 PIN + biometric + recovery passphrase 모두 요구 — recovery passphrase 분실 사용자는 일부 업데이트 적용 불가 가능성

### 12. Phishing / Social Engineering 위험 (Stage 6)

`is-this-email-really-from-fireblocks.md`, p.1; `support-verification-requests.md`, p.1:

- **공식 domain만 신뢰**: `fireblocks.com` / `fireblocks.io`. DKIM + DMARC 적용
- **Fireblocks가 절대 요청하지 않는 것**: 비밀번호, 2FA codes, 원격 접근
- **Social media로 contact 안 함** (email / support tickets / Slack만)
- **Support agent impersonation 방어**: Support verification requests (Stage 6 신규) — Fireblocks Support 측 신원도 sensitive op 시 mobile app PIN read-back으로 확인

**완화**:
- 의심 이메일 → `security@fireblocks.com` 보고
- 예상치 못한 Support verification request → mobile app에서 reject + Support 보고
- 정책: 직원 교육, Slack/공식 채널 통한 검증

### 13. Auto-passphrase의 신뢰 모델 Trade-off (Stage 6)

`security-checklist.md`, p.1 — Auto-passphrase는 사용자 측 인적 오류(분실/유출)를 제거하지만 다음 의존성을 추가한다:

- Fireblocks 측에 encrypted passphrase 저장 (고객 제공 **RSA key**로 암호화)
- **Offline machine에서만 decrypt 가능** — RSA private key의 안전한 보관이 새로운 SPOF
- 본 자료에 RSA key 형식·storage·access 정책 명세 없음 → Q-S01

**Trade-off**:
- 장점: 사용자 인적 오류 제거, recovery 표준화
- 단점: 새로운 자산(RSA private key)이 SPOF로 추가, 자체 enable 불가 (Support 경유)

### 14. Console IP Allowlist 운영 함의 (Stage 6)

`allowlisting-ip-addresses-for-console-access.md`, p.1–3:

- 기본 비활성. 활성화 시 lockout 방지 룰 (본인 IP 필수 포함)
- VPN/외부 보안 layer 사용 시 IP 변경 가능성 — workspace 접근 차단 위험
- Multi-workspace user는 본인 IP 미포함 workspace를 선택 불가 (부분 차단)
- 운영 권장: Audit Log 모니터링, 주기적 보안 audit, 변경 시 신중

**API user IP allowlist와의 차이** (Q-A06 답):
- Console: workspace 단위, **CIDR + range 가능**, Admin Quorum default (`Quorums > Security & compliance`로 위임 가능)
- API user: API user 단위, **`/32` only**, Owner-only

→ NAT/VPN 운영 시 두 정책을 별도 평가 필요. 자세한 비교는 [[entities/fireblocks/ip-allowlist]].

### 15. Foundation Node SLA 부재 (Stage 7)

`blockchains-sla.md`, p.1–2 — Fireblocks의 99.9% SLA는 **자체 + certified vendor node에만 적용**. Foundation-provided node는 SLA 없음.

- ~30 chain만 SLA-covered (BTC, ETH, SOL, XRP, DOT 등 주요)
- 그 외 chain의 outage는 platform SLA 카운트 미반영
- SLA 미포함 chain 운영 시 outage 위험 자체 부담

[[vendors/fireblocks/blockchains]] §"두 매트릭스 비교"에서 SLA × Internal-tx 매트릭스 운영 trade-off 정리.

### 16. Node Router의 No-Fallback 제약 (Stage 7)

`node-router.md`, p.3 — 명시적 제약:

> "Your organization cannot use our default node as a fallback when your static dedicated node is not functional."

→ Premium 옵션 사용 시 단일 node failure가 곧 outgoing tx 차단. 고객 측 node monitoring·HA 책임 추가.

### 17. Chain-specific Quirks (Stage 7 인덱스)

[[vendors/fireblocks/blockchains]] §"Chain-specific quirks 인덱스"에 12개 chain의 운영 quirks 요약:

- **시간 제약**: Algorand (50min), Tezos (~30min), Polkadot tx valid 2h — Owner/Admin Quorum approval 흐름과 시간 경합
- **계정 활성화**: Stellar 1 XLM, Polkadot 0.01 DOT (replay attack 위험), Near token contract pre-funding
- **Tx queue cap**: Solana 600
- **Trust line 자동 삭제**: XRP min reserve 미만 시 on-chain 자동
- **두 자산 derivation**: Songbird (coin type 60 / 544)

Chain별 quirks가 트랜잭션 성공률·승인 워크플로우·계정 lifecycle에 부분 의존.

### 18. Batch Operations의 실패 의미 (Stage 5)

`batch-approvals-and-signing.md`, p.5–6:

- 최대 10 requests/batch, **부분 실패 가능** — 일부 성공·일부 실패
- 실패 시 transaction ID로 Console에서 재시도해야 함
- 앱 force-close 시 **batch 자체가 fail 가능** — 실패한 모든 transfer는 무효, Console에서 재시작
- 운영 영향: high-frequency 트랜잭션 워크플로우에서 mobile app 안정성·네트워크 의존성이 직접적 비용

## Related Pages

- [[vendors/fireblocks/lifecycle-events]] — Owner-touching 절차 매트릭스
- [[vendors/fireblocks/authentication]] — Auth0 의존성 / SSO·2FA
- [[vendors/fireblocks/api]] — API credential 표면
- [[entities/fireblocks/user-roles/owner]]
- [[entities/fireblocks/admin-quorum]] · [[entities/fireblocks/approval-group]]
- [[entities/fireblocks/recovery-passphrase]] · [[entities/fireblocks/workspace-keys-backup]]
- [[entities/fireblocks/ip-allowlist]] · [[entities/fireblocks/api-key]] · [[entities/fireblocks/csr]]
- [[entities/fireblocks/mobile-device]]
- [[vendors/fireblocks/mobile-app]] — Mobile app 비가역성·Batch·UX
- [[vendors/fireblocks/security]] — Security best practices hub (Stage 6)
- [[vendors/fireblocks/blockchains]] — Chain catalog + SLA + Node Router (Stage 7)

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1, p.2
- `2026-05-18__support-fireblocks-io__add-users.md`, p.1
- `2026-05-18__support-fireblocks-io__edit-users.md`, p.1
- `2026-05-18__support-fireblocks-io__delete-users.md`, p.1
- `2026-05-18__support-fireblocks-io__reset-a-users-2fa.md`, p.1
- `2026-05-18__support-fireblocks-io__re-enroll-a-users-mobile-device.md`, p.1
- `2026-05-18__support-fireblocks-io__transfer-workspace-owner.md`, p.1–2
- `2026-05-18__support-fireblocks-io__configure-sso.md`, p.1, p.3
- `2026-05-18__support-fireblocks-io__add-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__allowlist-ip-addresses-for-api-user-requests.md`, p.1
- `2026-05-18__support-fireblocks-io__re-enrolling-api-users.md`, p.1
- `2026-05-18__support-fireblocks-io__rename-and-delete-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__about-the-fireblocks-mobile-app.md`, p.1–2 (Stage 5)
- `2026-05-18__support-fireblocks-io__device-migration.md`, p.1–2 (Stage 5)
- `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.2–3 (Stage 5)
- `2026-05-18__support-fireblocks-io__fireblocks-mobile-app-updates.md`, p.1–2 (Stage 5)
- `2026-05-18__support-fireblocks-io__batch-approvals-and-signing.md`, p.5–6 (Stage 5)
- `2026-05-18__support-fireblocks-io__security-checklist.md`, p.1–3 (Stage 6: Auto-passphrase trade-off)
- `2026-05-18__support-fireblocks-io__is-this-email-really-from-fireblocks.md`, p.1 (Stage 6: phishing)
- `2026-05-18__support-fireblocks-io__support-verification-requests.md`, p.1–2 (Stage 6: impersonation 방어)
- `2026-05-18__support-fireblocks-io__allowlisting-ip-addresses-for-console-access.md`, p.1–3 (Stage 6: Console IP allowlist)
- `2026-05-18__support-fireblocks-io__blockchains-sla.md`, p.1–2 (Stage 7: Foundation node SLA 부재)
- `2026-05-18__support-fireblocks-io__node-router.md`, p.3 (Stage 7: No-fallback 제약)

## Stage 8 — 추가 확정된 리스크

### Risk-S08: Single-Owner Workspace 의 SPOF — 공식 인정
`best-practices-for-choosing-user-roles.md`, p.2:
> "If you are the only user in a workspace who can sign transactions, we recommend creating additional Admin or Signer users as a precautionary measure. This helps to prevent the **loss of access to your digital assets and financial operations** when the primary signer cannot access the workspace."

→ Fireblocks 가 single-signer workspace 를 공식 SPOF 로 명시. Single-Owner workspace 는 Owner 디바이스 분실 = 자산 접근 상실 직결.

### Risk-S09: Disaster Recovery Service 자체가 SPOC
`fireblocks-cloud-architecture.md`, p.2-3:
- DR service 가 **xprv+fprv (extended ECDSA + EdDSA private keys) 재구성** 가능
- "**Should be stored on an offline air-gapped machine with hardened access permissions**"
- "**Should not be used regularly since reconstruction of the extended private keys introduces a single point of compromise**"

→ DR backup package 자체가 분산 MPC 신뢰 모델을 깨는 SPOC. **regular use 금지**. Air-gapped + hardened access 필수.

**Stage 29 cross-cut — Hosted MPC B&R operational burden** (`hosted-mpc-backup-and-recovery.md`):

Hosted MPC backup workflow 는 **2 air-gapped machines** 요구 — (1) download machine (encrypted email kit + auto-generated Guard share files), (2) assembly machine (kit 조립). 운영 의미:

- **운영 burden ↑** — SaaS MPC 의 1-share mobile backup 대비 Hosted MPC = **3-share + 2 air-gapped 머신** 필요
- **Recovery risk** — Single air-gapped 머신 운영 시 download/assembly compromise 동시 노출 (가이드 위반)
- **RSA keypair lifecycle** — customer 가 사전 RSA keypair 생성 + Console upload 필수. Private key 분실 시 Guard share 복호화 불가 → DR 불능
- **Sovereign key 의 trade-off** — Stage 22 의 customer ownership axis 의 비용 측면. BCM + Hosted MPC paired adoption 시 **3 운영 plane** (signing infra + BCM stack + B&R kit) 모두 customer 책임

**Stage 30 cross-cut — SaaS MPC B&R operational fragility** (`generating-a-workspace-key-backup-package-fireblocks-recovery-utility.md`):

SaaS MPC backup workflow 는 Recovery Utility app + air-gapped machine + Console approval 의 **다단계 ceremony**. 운영 fragility signals:

- **48-hour approval window** — Admin Quorum 이 48h 내 mobile app 으로 승인 안 하면 **process 재시작 필수** (직접 인용). Approval 후보가 출장/휴가/timezone 분산 환경에서 fragility 노출
- **Once-only backup kit download** — Owner 가 1번 download 실패 시 **process 전체 재시작** (직접 인용). 다운로드 중 네트워크 단절 / browser crash / disk write 실패 시 처음부터
- **Recovery Utility air-gapped machine permanent isolation** — "permanently disconnected from all networks" — 단일 air-gapped machine 의 hardware failure 시 새 머신 setup 필요 (USB transfer 의 재실행)
- **RSA-4096 private key (`fb-recovery-prv.pem`) 분실 위험** — AES-128 protected, customer 가 air-gapped machine 에 보관. 분실 시 backup package decrypt 불가 → DR 불능 (catastrophic failure)
- **QR-code / short-key bridge** 의 spoofing 위험 — offline ↔ online air-gapped bridge 가 visual + manual verification 의존. Insider attack 시 잘못된 public key 가 양쪽에 일치 보이도록 조작 가능성 (mitigation: dual control + 양쪽 Independent verification)
- **DR readiness 검증 부족** — backup ceremony 의 successful execution 이 reconstruction 성공을 보장하지 않음 → 직접 인용 권장: "test the native Workspace Key Backup and Recovery process in a testnet workspace first"

→ **SaaS MPC 의 sovereign backup adoption ROI**: Fireblocks SaaS 가 backup 자체를 보유하지 않는 customer-managed model 의 operational cost 측면.

**Stage 31 cross-cut — Reconstruction (recovery execution) fragility** (`recovering-private-key-material.md`):

SaaS MPC reconstruction 은 **4-secret model** + **strict offline-only mandate** 의 catastrophic SPOC. 운영 fragility signals:

- **Offline-only mandate (strict)** — 직접 인용: "Performing this procedure on an online machine will result in your **private key being considered exposed and compromised**." → Online 실수 시 vendor 가 키를 공식 compromise 로 선언. 다음 단계는 emergency 자산 이동 + 새 backup ceremony.
- **4-secret single-point aggregation** — Recovery Kit ZIP + RSA private key + Mobile passphrase + RSA private key passphrase. **Any one missing = DR 불능**. Stage 8 의 SPOC 경고 = 4-secret aggregation 의 single-point-of-failure 가 procedural 실제 의미.
- **Auto-passphrase = +1 secret (5 total)** — 추가 RSA keypair (auto-generated passphrase 의 encryption layer). 운영 burden 증가 but auto-gen 의 entropy / generation 우월성 trade-off.
- **JSON automation v1.8.0+ trade-off** — passphrase 가 plaintext JSON 으로 노출. Manual entry 대비 automation 가능 but **JSON file 자체가 새로운 high-value secret target**. file 분실 / leak 시 secrets 2개 동시 노출.
- **Recovery Utility version dependency** — JSON automation 은 v1.8.0+ 한정. legacy version 운영 시 automation 미지원 → manual entry 의 입력 오류 fragility.
- **DR test fragility** — production keys 로 reconstruction test 시 **키 자체 compromise** (직접 인용). Testnet workspace 만 안전 test 환경 → production 환경 의 DR rehearsal 자체가 risky.

→ **Reconstruction = catastrophic SPOC procedure**. Stage 8 의 SPOC 경고가 procedural 실제 의미 (4-secret aggregation + offline mandate + JSON file secret consolidation + version dependency) 로 완전 framing.

### Risk-S10: SaaS Outage = Hosted MPC 가 아닌 경우 signing halt
`business-continuity-module-bcm.md`, p.1:
- BCM 은 **Hosted MPC customer 전용** — Default SaaS MPC customer 는 SaaS outage 시 signing 불가
- SaaS-only 고객의 business continuity 는 Fireblocks SLA 에 100% 의존

### Risk-S16: Callback Handler 미설정 = Co-signer 자동 sign/approve default (Stage 24 신규)
`create-api-co-signer-callback-handler.md` 직접 인용:
> "If a Callback Handler is not configured for an API user, the Co-signer will automatically sign or approve all requests it receives for that API user."

- **위험**: API user 가 Callback Handler 없이 운영 시 외부 validation / business logic / compliance 검증 **모두 bypass**. Co-signer 가 정책 통과한 모든 request 를 자동 sign.
- **운영 의미**:
  - Production 환경의 모든 API user 는 Callback Handler 명시적 설정 강제 권장
  - 미설정 default 가 silent — Console UI 상 명시적 경고 없음 (catalog 확인 필요)
  - Stage 24 의 5 auth options 중 어느 것을 쓰든, 미설정 자체가 가장 큰 보안 위험
- **mitigation**:
  - 모든 API user 에 Callback Handler 필수화 (조직 정책)
  - Approval Group 또는 TAP 으로 Callback Handler 없는 API user 의 signing 제한
  - Audit Log 에서 Callback Handler 미설정 API user 의 transaction 모니터링
- **잔존 미확정**:
  - Sandbox / testnet 의 자동 sign default 정책이 mainnet 과 동일한지
  - Console UI 가 미설정 default 를 어떻게 표시하는지 (silent vs warning)

### Risk-S15: Off-Exchange ↔ Hosted MPC paired product line (Stage 22 신규 cross-cut)
`hosted-mpc-overview.md`, p.2 Related Documents:
- **Off-Exchange product line 은 Hosted MPC 기반으로 운영** — 두 요건이 paired:
  - (a) **sovereign key management** (Hosted MPC = 3-of-3 customer-side, vendor lock-in 회피)
  - (b) **counterparty exposure 격리** (Off-Exchange = exchange counterparty risk mitigation)
- 운영 의미: Off-Exchange 채택 = Hosted MPC 운영 부담 동반 (BCM + SGX infra + Customer-Side Setup). 두 product line 의 paired adoption 결정이 architectural 전제.
- 본 wiki 는 Off-Exchange 자체 deep ingest 안 함 (5 priority domain 밖, 별도 product line). 단 Hosted MPC spine 의 use case justification 측면에서 cross-cut signal 보존.

### Risk-S11: Owner-Level Yubikey 강제 전파
`fireblocks-yubikey-authentication.md`, p.1:
- Owner 가 Yubikey 채택 → **이후 모든 신규 사용자가 Yubikey 강제**
- 운영 의미: Owner 의 mobile auth 선택이 회사 전체 사용자에게 hardware token procurement / training burden 강제

### Risk-S12: 3-region SaaS 단일 region 장애
`fireblocks-ip-addresses-to-whitelist.md`, p.1:
- US / EU / EU2 3 region 만 존재
- Region-specific outage 시 해당 region tenant 의 가용성 영향 가능

### Risk-S13: Audit Log Access 가 Admin-level 한정
`audit-log.md`, p.1:
- "Only Owners, Admins, and Non-Signing Admins can access the Audit Log."
- Security Auditor / Security Admin 은 별도 plane 일 가능성 (compliance plane 추정)
- Operational implication: forensic 분석을 Security Auditor 가 직접 수행 불가 (Admin level 협조 필요)

### Risk-S14: Mobile Device = 두 plane 의 단일 호스트
`security-aspects-signing-with-the-fireblocks-mobile-app.md`, p.1-2:
- Mobile device 가 **MPC key share** + **Configuration key** 두 보안 자산을 동시 보유
- 단일 device compromise 시 signing + governance 모두 영향
- Mitigation: PIN + biometric/Yubikey, secure enclave/TEE, 평문 추출 불가

## Open Questions

- Q-2026-05-18-O02 — Owner 부재 정의·검증 기준
- Q-2026-05-18-O03 — Board resolution 형식 요건
- Q-2026-05-18-W02 — Recovery passphrase 분실 시 경로
- Q-2026-05-18-D03 — 2-day window 만료 시 동작
- Q-2026-05-18-AU01 — Auth0 의존성의 장애 영향
- Q-2026-05-18-L03 — Add/Delete approval 비대칭의 보안 함의
- Q-2026-05-18-A06 — `/32 CIDR`의 NAT/VPN 운영 노하우
- (공개 인시던트·CVE는 외부 자료 수집 필요)

## Stage 10 — Governance Risk 정식 명세

### Risk-G01: API Admin = Quorum −1 효과 (★ 새 패턴)

`admin-quorum.md` (Stage 10), p.4:
- API Admin / API Non-Signing Admin 은 **Admin Quorum threshold 변경 요청에 자동 approve**
- "their approval is automatic for Admin Quorum change requests"
- → **API Admin 1명 = quorum −1 효과** (threshold 변경 액션 한정)

**위험 시나리오**:
- 1 human Admin + 1 API Admin, threshold = 1 → **API Admin auto-approve 만으로 모든 quorum 변경 통과**, human review 불가
- 권장 mitigation: API Admin 보유 시 threshold ≥ 2 강제

### Risk-G02: Approval Group API Fully-Controlled

`approval-groups.md`, p.2:
> "If you set an approval group to be **fully controlled by API users**, you assume the risk of securing your API key(s). If compromised, malicious actors will be able to authorize changes to your workspace **without human oversight**."

→ Risk-G01 의 일반화. Approval group 도 fully-API config 가능하나 human verification 필수 권장.

### Risk-G03: User Group 삭제의 TAP Cascade

`user-group-management.md` (Stage 10), p.7:
> "Deleting a group can affect the **Transaction Authorization Policy (TAP)** and may result in transaction errors."

→ User group 삭제 시 해당 그룹 참조 Policy rule 들이 invalid 화 → tx error. Stage 10 의 "(X) Policy rules impacted" indicator 가 사전 시각화하나 cascade 자체는 회피 불가.

### Risk-G04: Policy Block-All Default 의존성

`about-policies.md`, p.4:
- 모든 Policy 의 마지막 rule = block-all (삭제 불가)
- Default Policy rule 은 **whitelist 가 있어야 작동** (whitelist 미설정 시 모든 tx block)
- **Custom Policy 도입 = default 즉시 삭제 (one-way)** — partial migration 불가

→ Custom Policy 도입 시 default rule 의 implicit allow 가 사라지므로 **모든 use case 를 custom rule 로 명시적 cover** 필요. 누락 시 silently block.

### Risk-G05: First-Match Rule Ordering Brittleness

`how-policies-work.md`, p.3-4:
- First-match principle = rule order 가 governance 결정
- Overlap 시 **더 strict 한 rule 이 더 앞에 배치되어야** 함 — 그렇지 않으면 less restrictive rule 이 먼저 매치되어 strict rule 의도 무력화
- Time-based rule 이 single-tx rule 보다 먼저
- → Rule 의 운영 의도와 실제 enforcement 가 ordering 으로 divergence 가능 — **Policy review 시 ordering check 필수**

### Risk-G06: Default Threshold "All Admins" 의 onboarding Friction

`admin-quorum.md` (Stage 10), p.3:
- 워크스페이스 첫 생성 시 threshold = **"All Admins"**, 이때 Owner 단독 active
- Admin 추가 후에야 lower threshold 변경 가능
- → 초기 Admin 추가 = bootstrap 종속성. Onboarding 흐름의 friction.

### Risk-G07: Cold Wallet workspace 의 Approval Group 미지원

`approval-groups.md`, p.1:
- Cold Wallet workspace 는 approval group 미지원 → Admin Quorum 단독
- → Cold Wallet 의 governance flexibility 축소. Workspace config 변경마다 quorum 전체 동의 필요. Hot 보다 운영 부담 증가.

### Risk-G08: FSPM Add-on Cost / Coverage 의존성

`fspm.md` (Stage 10):
- FSPM = add-on license
- → license 미보유 워크스페이스는 pre-incident posture 모니터링 부재
- FSPM 의 monitoring 6 영역 중 일부 (e.g., weak approval group threshold) 는 **수동 review 가 유일한 대안**

## Stage 36 — Key Link Risks (★ 신규 plane)

`fireblocks-key-link-overview.md`, p.1-3 + `getting-started-with-fireblocks-key-link.md`, p.1-9 + `set-up-your-fireblocks-vault-with-key-link.md`, p.1-4 (Stage 36 Mode C).

Key Link plane 도입으로 **6 가지 신규 risk** 식별. 모두 MPC plane 의 risk profile 과 다른 영역 — customer 측 인프라 의존성이 risk 의 root.

### Risk-KL01: Customer Server SPOF

- Stage 8 의 trust boundary 가 Key Link 에서 **Customer Server 까지 확장** — Server fail 시 모든 signing 중단
- Stage 9 의 17-status transaction state machine 에서 **Pending Signature (2h timeout)** 가 timeout → tx fail
- → Customer 측 Active-Active / Active-Passive HA 필수, Stage 8 의 BCM 패턴과 유사한 보수성 요구
- ~~Mitigation 미명시~~ → **Q-2026-05-22-KL02 ANSWERED (Stage 170, CSM 확답)**: 다중 Agent 페어링 가능하나 서명키가 특정 Agent user 에 바인딩되어 권장 = **active/passive**. 내장 HA/DR 자동화 없음 — Agent·Customer Server 의 감시·failover 는 고객 설계 (PS 범위). 미전달 요청은 Fireblocks 큐에 7일 durable·at-least-once → Agent 중단 시 요청 유실은 없음. 이 7일과 위 2h timeout 의 관계는 미확인 → **Q-2026-08-28-KL07**. 상세 [[entities/fireblocks/cosigner]] §"Stage 170"
- 비용 (Stage 170, CSM): Key Link = 유료 add-on, PS 구현 패키지 별도 견적, Luna 하드웨어·Thales 라이선스는 Thales 직접 구매 (Fireblocks 계약 외). 견적은 CSM 유보 → **Q-2026-08-28-KL08**

### Risk-KL02: Fireblocks Agent Open-Source Update Burden

- Agent 가 customer 호스팅 open-source TypeScript service
- Update 의 강제 minimum version / security patch deployment 정책이 PDFs 에 미명시 → **Q-2026-05-22-KL03**
- → Outdated Agent 가 long-term security debt 가능성. Mobile app 의 Stage 5 강제 update 메커니즘 (current/effective version) 과 다른 운영 모델

### Risk-KL03: Beta State Production Risk (Q-2026-05-19-S16 부분 ANSWERED)

- API prefix `/key-link-beta/` 가 catalog-level fact (Stage 18)
- 본 3 PDF 에 "Key Link workspace" 가 일관되게 별도 workspace type 으로 명시 — beta-specific 제약은 PDFs 에 명시 없음
- → **Specific limitation 식별 위해 Mode C 추가 ingest 필요** (별도 cluster ingest 잔존)
- Cold Wallet 의 Risk-G07 (approval-group 미지원) 패턴과 비교: Key Link 는 approval-group 지원 확인 (`Settings > Quorums > Security & compliance > Add validation keys`) — Cold Wallet 패턴과 같지 않음

### Risk-KL04: Validation Key Compromise

- Compromise 시 **위조된 signing key 등록 가능** — attacker 가 자체 HSM 의 키를 enable
- Stage 8 의 audit log 가 validation key 의 Submitted / Approved / Rejected / Activated / Deactivated 이벤트 추적
- Mitigation: approval group quorum (default Admin Quorum 또는 위임 group) — Key Link 의 governance plane
- 자세한 내용: [[vendors/fireblocks/security]] §"Stage 36 — Customer Signature Validation Plane"

### Risk-KL05: HSM Adaptor Cold-HSM Latency

- HSM Adaptor 가 **optional** component, cold (offline) HSM 과의 통신 매개
- Cold HSM signing 의 latency / batching pattern 명세 없음 → **Q-2026-05-22-KL04**
- Stage 9 의 Pending Signature 2h timeout 과의 호환성 미명시
- → 일부 chain 의 시간 제약 (Algorand 50min signing window / Tezos 30min / Polkadot 2h tx valid) 과 cold HSM 의 manual signing 사이클이 충돌 가능

**Stage 38 부분 ANSWERED** (Fireblocks blog × Thales 2025-09-23):
- Air-gap transport 메커니즘 = **USB · SFTP · data diodes** (vendor 공식 발언)
- "Hot / Warm / Cold signing workflows" 3-mode 가 vendor 공식 framing
- 단 cold-HSM signing latency 수치 / batching 패턴 / Pending Signature 2h timeout 호환성은 여전히 미명세

### Risk-KL06: Non-Interactive PoO Replay (★ specific 가능성)

- Non-interactive Proof of Ownership 의 메시지 = `Fireblocks|Proof of Ownership Message|<WorkspaceDisplayName>|<SdkApiKey>` + `signingDeviceKeyId` + `UnixTimeInSeconds`
- UnixTimeInSeconds 의 validity window 명시 없음 — attacker 가 같은 cert 를 다른 workspace 에 replay 시도 가능성?
  - WorkspaceDisplayName 이 message 에 포함되어 workspace cross-replay 방어 — 단 같은 workspace 내 replay window 미명시
- → **Q-2026-05-22-KL05** (Stage 36 신규)
- Mitigation 추정 (PDFs 미명시): SdkApiKey 가 GUID 라 키별 unique, UnixTimeInSeconds 가 nonce 역할 가능

### Risk-KL07: Workspace Type Immutability (Q-2026-05-22-KL01 ★ 부분 ANSWERED Stage 36)

- `hosted-mpc-workspace-configuration.md` p.1 직접 인용: "You must open and configure a **new workspace** for a Hosted MPC setup, as **modifying an existing SaaS MPC workspace is impossible**."
- → **Workspace type 은 immutable** — Hosted MPC ↔ SaaS MPC 변환 불가. Key Link 도 architectural symmetry 로 같은 invariant 추정
- **운영 영향**: MPC → Key Link migration = 새 Key Link workspace 생성 + cross-workspace asset transfer 가 유일한 경로
- **Same-organization mixed-plane**: Customer Domain (Stage 9 의 5-level hierarchy top) 안에 다양한 type 의 workspace 가능 — Customer Domain 이 workspace 들의 logical group, 각 workspace 는 type 고정
- **Cold Signing variant**: Hosted MPC + Cold Signing 의 경우도 새 workspace 필수 (기존 Cold Signing workspace 재사용 불가, `hosted-mpc-customer-side-setup.md` p.2)

### Stage 36 와 다른 Risk plane 의 cross-cut

| Stage | Risk plane | Key Link 와의 cross-cut |
|---|---|---|
| 8 (S08-S14) | SaaS architecture risks | Key Link 는 Fireblocks key share 0 → S08 (Single-signer SPOF) 자동 회피 |
| 10 (G01-G08) | Governance risks | G07 (Cold Wallet approval-group 미지원) 패턴 ≠ Key Link 의 approval-group 지원 |
| Stage 31 SPOC | DR 4-secret reconstruction | Key Link 는 MPC backup 자체 없음 → SPOC 형태가 다름 (customer HSM 자체 가 SPOC) |

## Sources (Stage 36 추가)
- `2026-05-22__support-fireblocks-io__fireblocks-key-link-overview-extracted.txt`, p.1-3 (Stage 36: Customer Server SPOF, Agent open-source)
- `2026-05-22__support-fireblocks-io__getting-started-with-fireblocks-key-link-extracted.txt`, p.1-9 (Stage 36: PoO methods, validation key governance)
- `2026-05-22__support-fireblocks-io__set-up-your-fireblocks-vault-with-key-link-extracted.txt`, p.1-4 (Stage 36: Vault key exclusivity)

## Stage 38 — Key Link × Thales Luna HSM (vendor blog 2025-09-23)

Fireblocks 공식 블로그 ("Enterprise Digital Asset Security with Fireblocks and Thales", 2025-09-23 by Adam Levine) 가 Key Link 의 후속 사실을 명시:

### Stage 38 신규 Risk plane 사실 (Risk 등급 아닌 architectural fact)

- **Thales Luna HSM** — Key Link 의 reference HSM partner. **FIPS 140-3 Level 3 + Common Criteria 인증**. PQC (post-quantum cryptography) readiness.
- **Hot / Warm / Cold signing workflows** — vendor 공식 3-mode framing 등장. "Warm" 의 기술 정의는 미명세 → **Q-2025-09-23-FB01**
- **Air-gap transport** — USB · SFTP · data diodes (Risk-KL05 의 부분 ANSWERED)
- **Customer key ownership** — "Institutions maintain full key ownership" — Stage 36 의 Key Link key-share-0 invariant 의 vendor 강조
- **관할권** — HKMA · HKSFC · JFSA 명시. KR 미명시 → **Q-2025-09-23-FB03**

### Stage 38 신규 Q

- **Q-2025-09-23-FB01** — Hot/Warm/Cold 3-mode 의 정확한 기술 정의 (특히 "Warm")
- **Q-2025-09-23-FB02** — SaaS Cold Wallet workspace vs Key Link Cold signing 의 관계
- **Q-2025-09-23-FB03** — KR VASP 환경 Key Link + Thales Luna 적용 vendor 공식 입장

자세히: [[open-questions/fireblocks]] §"Stage 38"

## Sources (Stage 38 추가)
- `2026-05-22__fireblocks-com__enterprise-digital-asset-security-thales.md` (Stage 38: Thales Luna HSM 통합, Hot/Warm/Cold 3-mode, air-gap transport)
