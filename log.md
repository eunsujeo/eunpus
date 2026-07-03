# Wiki Log

Chronological append-only record of ingests, queries, and lint passes.

Entry format: `## [YYYY-MM-DD] <action> | <vendor> | <title>`

Quick scan:
```
grep "^## \[" log.md | tail -5
```

---

## [2026-05-18] ingest | fireblocks | User roles (Help Center)

- **Source PDF**: `sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__user-roles.pdf`
- **Markdown**: `sources/fireblocks/markdown/2026-05-18__support-fireblocks-io__user-roles.md`
- **Original URL**: https://support.fireblocks.io/hc/en-us/articles/360012832959-User-roles
- **Stage**: 1 of 3 (per Fireblocks ingest plan; Stage 2 = Add/Edit/Delete users, Stage 3 = Reset 2FA/Re-enroll/Transfer Owner)

### Files created (22)

- Source: `meta.yml`, normalized PDF (rename), markdown conversion (3 files)
- Vendor: `vendors/fireblocks/user-management.md` (1 file)
- Role entities (`entities/fireblocks/user-roles/`): owner, admin, non-signing-admin, signer, approver, editor, viewer, security-auditor, security-admin (9 files)
- Supporting entities (`entities/fireblocks/`): admin-quorum, approval-group, designated-signer, console-user, api-user, api-co-signer, mpc-key-share, sandbox-workspace (8 files)
- Meta: `log.md` (this file, 1)

### Files modified (8)

- Entities: `workspace.md`, `policy.md`, `transaction.md`, `vault-account.md`, `cosigner.md`
- Vendor: `overview.md`, `cosigner.md`
- Open Questions: `open-questions/fireblocks.md` (예시 1건 → 실제 질문 13건)

### Open Questions added (13)

`Q-2026-05-18-G01..G04`, `M01..M02`, `C01..C02`, `P01..P03`, `W01`, `O01`

### Notes

- 파일명 정규화: `YYYY-MM-DD__support-fireblocks-io__<slug>.{pdf,md}` (다운로드일 사용)
- Wiki link 형식: `[[entities/fireblocks/...]]` / `[[vendors/fireblocks/...]]` (prefix 포함, wikilink only)
- 본 자료는 Fireblocks Help Center의 IAM 단일 카테고리. MPC 프로토콜·Policy 룰 문법·Callback Handler payload 등은 다루지 않음 → Open Questions로 기록.

## [2026-05-18] ingest | fireblocks | Add users + Edit users + Delete users (Stage 2)

- **Source PDFs**:
  - `sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__add-users.pdf` (URL: https://support.fireblocks.io/hc/en-us/articles/360021546999-Add-users)
  - `sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__edit-users.pdf` (URL: https://support.fireblocks.io/hc/en-us/articles/9747031353244-Edit-users)
  - `sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__delete-users.pdf` (URL: https://support.fireblocks.io/hc/en-us/articles/4404971260050-Delete-users)
- **Markdowns**: 동일 stem 3개 in `sources/fireblocks/markdown/`
- **Stage**: 2 of 3 (User lifecycle CRUD; Stage 3 = Reset 2FA + Re-enroll device + Transfer Owner)

### Files created (13)

- Source: 3 PDF renames + 3 `meta.yml` + 3 markdown = 9
- Vendor: `vendors/fireblocks/lifecycle-events.md` (신규)
- Entity: `entities/fireblocks/user.md` (통합 User entity, 신규)
- (log entry 본 항목 자체 1)
- 총 13 (rename 3 + create 10)

### Files modified (11)

- Entities (8): `admin-quorum` (Owner counting rule 확정), `approval-group` (stub → 본격), `mpc-key-share` (cloud-based 용어, derivation 별도 승인), `policy` (user 삭제 시 rule block), `user-roles/owner` (lifecycle 권한 확장), `user-roles/admin` (Delete AG 위임), `user-roles/non-signing-admin` (Add/Edit 본문 actor), `user-roles/security-admin` (본문/표 불일치 노트)
- Vendor (1): `vendors/fireblocks/user-management.md` (lifecycle-events 링크, 본문/표 불일치 노트)
- Open Questions (1): `open-questions/fireblocks.md` (Q-G02 answered, L01–L07, M03–M04 추가)
- Log (1): 본 항목

### Open Questions

- **Answered**: Q-2026-05-18-G02 — Owner는 mandatory + threshold count 포함 (`add-users.md`, p.1)
- **Added (9)**: L01 (Admin-level 정의), L02 (Add 본문/표 불일치), L03 (Add/Delete approval 비대칭), L04 (setup 진행 중 Edit 차단), L05 (deleted user ID + email unique 충돌), L06 (Approval groups customize 범위), L07 (Role 변경 Support SLA), M03 (cloud 외 key share 분포), M04 (key share derivation 메커니즘)

### Notes

- Add users 본문은 actor를 O/A/NSA로만 명시하나 User roles 권한표는 SecAdmin도 `Y (Q)` — 본문/표 불일치는 Q-L02로 추적.
- Delete의 immediate console 동작 + Add의 7-day mobile approval 비대칭은 Q-L03로 추적.
- "cloud-based key shares" 용어가 Delete users에서 처음 확정 — MPC 분포 모델 이해의 한 조각.
- Stage 3 ingest 대상: Reset 2FA / Re-enroll mobile device / Transfer workspace Owner. Owner identity 인프라(passphrase, recovery, board resolution) 등이 거기서 등장 예정.

## [2026-05-18] ingest | fireblocks | API User × 4 + Authentication and Access × 3 (Stage 4)

- **Source PDFs (7)**:
  - `sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__add-api-users.pdf` (URL: https://support.fireblocks.io/hc/en-us/articles/4407823826194-Add-API-users)
  - `…re-enrolling-api-users.pdf` (URL: …4412016177554)
  - `…rename-and-delete-api-users.pdf` (URL: …27491829465372)
  - `…allowlist-ip-addresses-for-api-user-requests.pdf` (URL: …4405980040210)
  - `…configure-sso.pdf` (URL: …10031671057692)
  - `…manage-your-2fa.pdf` (URL: …360012705600)
  - `…reset-your-password.pdf` (URL: …360011700760)
- **Markdowns**: 동일 stem 7개 in `sources/fireblocks/markdown/`
- **Stage**: 4 (API user + Authentication/Access; Stage 3 skip — Reset 2FA / Re-enroll device / Transfer Owner는 추후로)
- **Decision (사용자 지정, 본 단계)**: IdP별 entity 분리 대신 sso entity 안 catalog 구조 사용. 반복·독립 governance 특성 확인 시 entity 승격.

### Files created (28)

- Source: 7 PDF rename + 7 `meta.yml` + 7 markdown = 21
- Vendor: `vendors/fireblocks/authentication.md` (신규)
- Entity: `entities/fireblocks/csr.md`, `api-key.md`, `ip-allowlist.md`, `2fa.md`, `sso.md` (신규 5)
- (log entry 본 항목 1)

### Files modified (18)

- Vendor (5): `api.md` (Stub → 부분 채움), `lifecycle-events.md` (API user lifecycle 절), `cosigner.md` (Communal Test confirmed, SGX, pairing, SSL pin), `callback-handler.md` (SSL pin, re-enroll trigger), `user-management.md` (Console vs API 인증 모델)
- Entity (11): `api-user` (대폭 확장), `api-co-signer` (페어링·variant·SSL pin), `callback-handler` (SSL pin), `cosigner` (Communal Test, SGX, pairing), `mpc-key-share` (Co-signer key share 승인), `user` (API lifecycle), `console-user` (인증 모델), `admin-quorum` (API user 흐름 적용), `approval-group` (API Delete 동일 설정), `policy` (API user delete → rule block), `sandbox-workspace` (testnet 관계 노트)
- Open Questions (1): `open-questions/fireblocks.md` (C02 answered, A01–A07/AU01–AU05 추가 12건)
- Log (1): 본 항목

### Files renamed (7)

- 4 API User PDFs + 3 Authentication & Access PDFs → `2026-05-18__support-fireblocks-io__<slug>.pdf`

### Open Questions

- **Answered**: Q-2026-05-18-C02 — Fireblocks Communal Test Co-signer는 testnet 전용 (`add-api-users.md`, p.2)
- **Added (12)**:
  - **API (7)**: A01 (Admin-level 정의 cross-ref), A02 (unpair 절차), A03 (key/CSR rotation), A04 (Callback Handler auth method 종류), A05 (SGX 신뢰 모델), A06 (`/32` NAT/VPN), A07 (audit log 표면)
  - **Authentication (5)**: AU01 (Auth0 의존성), AU02 (ADFS/LDAP Support 경유 이유), AU03 (SSO domain × workspace user list 연결), AU04 (WebAuthn/FIDO2 지원), AU05 (비밀번호 정책)

### Notes

- API user는 Console user와 **동일한 9 role 매트릭스**를 공유 — 권한 모델 통합. 차이는 인증·자격증명·자동화 표면.
- API user Delete의 AG 위임은 **Console user Delete와 동일 설정 행을 재사용** (`rename-and-delete-api-users.md`, p.2). 별도 row 없음.
- API user 삭제 시 **Co-signer 페어링은 그대로** — unpairing 별도 작업 (Q-A02 추적).
- SSO는 login authorization만 다루며 user 추가/삭제와 분리 (`configure-sso.md`, p.1). Auth0가 service provider.
- 2FA는 모든 Console user 필수 (TOTP만; FIDO2/WebAuthn 지원 여부 미확인 — Q-AU04).
- IdP entity 분리는 보류 — 본 자료에서 IdP별 독립 governance/permission 특성 미확인. SSO entity 내 카탈로그 절로 운영.
- Stage 3 (Reset 2FA / Re-enroll mobile device / Transfer workspace Owner) 잔존. Owner identity·DR 흐름은 그쪽에서 보강.

## [2026-05-18] ingest | fireblocks | Reset 2FA + Re-enroll mobile device + Transfer Owner (Stage 3)

- **Source PDFs (3)**:
  - `sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__reset-a-users-2fa.pdf` (URL: …360021707679)
  - `…re-enroll-a-users-mobile-device.pdf` (URL: …4407786072082)
  - `…transfer-workspace-owner.pdf` (URL: …10371416837788)
- **Markdowns**: 동일 stem 3개 in `sources/fireblocks/markdown/`
- **Stage**: 3 (Owner identity·DR·device lifecycle 평면 본격 도입)
- **Strategy (사용자 지정)**: 기존 entity 재사용 우선, 신규 entity 최소화 (3개), relationship/citation 강화, 반복 등장 개념만 승격.

### Files created (12)

- Source: 3 PDF rename + 3 `meta.yml` + 3 markdown = 9
- Entity 신규 3개:
  - `entities/fireblocks/mobile-device.md` — MPC share + 2FA + mobile app + PIN의 통합 호스트
  - `entities/fireblocks/recovery-passphrase.md` — Owner identity verify 자산
  - `entities/fireblocks/workspace-keys-backup.md` — Owner 관리 DR 자산

### Files modified (10)

- Vendor (3): `lifecycle-events.md` (Mobile Device lifecycle / User-level 2FA Reset / Owner Transfer 3 절 신설), `risks.md` (Owner SPOF / DR / API credential / 시간 윈도우 본격 채움), `user-management.md` (Stage 3 actor 매트릭스 확장)
- Entity (8): `2fa.md` (admin-perspective reset 흐름), `mpc-key-share.md` (2-day windowing), `user-roles/owner.md` (Owner Identity 절차 종합·DR 자산·board resolution path), `user-roles/admin.md` (re-enroll device, Owner 이전 사전 role), `user-roles/signer.md` (Owner 이전 사전 role), `user.md` (Mobile device lifecycle / 2FA reset / Owner identity 자산), `console-user.md` (Mobile device 의존성·Linked users), `admin-quorum.md` (Re-enroll devices Q 라벨 cross-validation)
- Open Questions (1): D01–D03, O02, O03, W02 신규 6건; W01·M01·M02·L02·O01에 cross-ref
- Log (1): 본 항목

### Files renamed (3)

- `Reset a user's 2FA …` / `Re-enroll a user's mobile device …` / `Transfer workspace Owner …` PDF → 정규화 명칭

### Open Questions

- **Added (6)**:
  - **Device (3)**: D01 (PIN ≟ passphrase), D02 (linked users 격리 모델), D03 (2-day window 만료 동작)
  - **Operations (2)**: O02 (Owner 부재 정의·검증), O03 (board resolution 형식 요건)
  - **Workspace (1)**: W02 (recovery passphrase 분실 경로)

### Notes

- 본 Stage로 모든 Owner-touching 절차가 **Fireblocks Support 영상 통화 신원 확인**을 요구한다는 패턴이 일관되게 확인됨 (`reset-a-users-2fa.md` p.1; `re-enroll-a-users-mobile-device.md` p.1; `transfer-workspace-owner.md` p.1; Stage 1 `user-roles.md` p.2).
- **Mobile device** entity가 정식 승격됨 — Stage 1부터 권한표·다수 role entity에서 link만 되어 있던 평면.
- **Recovery passphrase + Workspace Keys Backup** 자산 쌍이 Owner identity의 DR 평면을 형성. backup의 정확한 구성은 미명세(Q-M03 추적).
- **Linked users / linked workspaces 모델** 첫 등장 — 한 device가 multi-user/multi-workspace host가 되는 패턴. 격리 모델은 미명세(Q-D02).
- **시간 윈도우 누적**: 7-day(Add) / 2-day×2(Mobile re-enroll) / 1-hour(API pairing) / 3–5 영업일(Owner transfer) — risks 페이지에 종합 정리.
- **본 자료군(Help Center IAM·인증·API·lifecycle 13개) ingest 완료**. Fireblocks 위키는 일단 governance/lifecycle/authentication domain이 안정화된 상태.
- **다음 ingest 후보**: MPC-CMP whitepaper / Cosigner 배포 가이드 / Policy Engine reference / Callback Handler reference 등 기술 명세 자료. 현재 wiki의 Open Questions를 그 자료들이 답해 줄 것.

## [2026-05-18] ingest | fireblocks | Mobile App × 13 (Stage 5) — Workspace Management Domain 완성 마일스톤

- **Source PDFs (13)** in `sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__*.pdf`:
  - 개요: about-the-fireblocks-mobile-app (8744575638044)
  - 인증·요구사항: mobile-authentication-methods (360020429559), mobile-device-minimum-requirements (360019873120)
  - Lifecycle: device-migration (11288189152924), linked-users-fireblocks-mobile-app (4406705242642), re-adding-a-user-to-the-fireblocks-mobile-app (13548929359260)
  - Updates: fireblocks-mobile-app-updates (4410612487442)
  - Recovery: recovery-passphrase (6429764039452), reset-an-admin-or-signers-recovery-passphrase (12545691460252), reset-the-owners-recovery-passphrase (12545705435164)
  - 운영: fireblocks-mobile-app-signing-and-approving (7220224809756)
  - 기능: batch-approvals-and-signing (25477979558556), new-mobile-experience-request-management (25477807296540)
- **Stage**: 5 (Mobile App domain + **Workspace Management Domain 완성 마일스톤**)
- **Strategy (사용자 지정)**: workspace-management domain 안정화 / 신규 entity 최소화 (0개) / relationship·citation 강화 / 반복 등장 개념만 승격.

### Files created (27)

- Source: 13 PDF rename + 13 `meta.yml` + 13 markdown
- Vendor 신규: `vendors/fireblocks/mobile-app.md` (1)

### Files modified (23)

- Vendor (6): `lifecycle-events` (Mobile App-Side Lifecycle 절), `risks` (Stage 5에서 6개 신규 절), `mpc` (Cloud backup 모델 + MPC-CMP 확정), `authentication` (mobile auth methods), `cosigner` (mobile 대체), `architecture` (컴포넌트 분포 본격 채움)
- Entity (15):
  - 대폭 확장 3개: `mobile-device`, `mpc-key-share`, `recovery-passphrase`
  - 확장 1개: `workspace-keys-backup`
  - Cross-ref: `2fa`, `owner`, `admin`, `signer`, `non-signing-admin`, `transaction`, `policy`, `admin-quorum`, `api-co-signer`, `user`, `console-user`
- Open Questions (1) + Log (1)

### Files renamed (13)

13 Mobile App PDF → 정규화 명칭

### Open Questions

- **Answered**:
  - Q-2026-05-18-W02 — Mobile app self-reset + Owner의 새 recovery package 요청
  - Q-2026-05-18-D01 — PIN / passphrase / recovery passphrase 세 별개 layer
- **Partial answered**:
  - Q-2026-05-18-M03 — Cloud는 mobile device share의 passphrase-encrypted backup. 잔존 → Q-D04
  - Q-2026-05-18-D02 — User별 cryptographic 독립 확정. 잔존: 디바이스 compromise 영향
  - Q-2026-05-18-AU04 — Yubikey 확정. 잔존: FIDO2/WebAuthn protocol-level
  - Q-2026-05-18-M01 — MPC-**CMP** variant 확정 (라운드·threshold 등 세부는 미해소)
  - Q-2026-05-18-M02 — 본 자료군 한도에서 답함
- **Added (8)**:
  - Device (5): D04 (cloud backup crypto), D05 (migration bypass 거버넌스), D06 (Periodic Verification 강제), D07 (Workspace Keys Recovery 절차), D08 (Risk-flagged 기준)
  - Policy (2): P04 (workspace settings 표현), P05 (Long processing / multi-input 정의)
  - Operations (1): O04 (Off-exchange policy / DRS finalization)

### Workspace Management Domain 완성 마일스톤

Stage 1–5 누적으로 Fireblocks Help Center의 **Workspace Management 카테고리 자료 26건** ingest 완료:
- Stage 1 (1): User roles
- Stage 2 (3): Add / Edit / Delete users
- Stage 3 (3): Reset 2FA / Re-enroll mobile device / Transfer Owner
- Stage 4 (7): API user (4) + Authentication & Access (3)
- **Stage 5 (13): Mobile App 전체**

도메인 커버리지: User identity / Authentication / User lifecycle / Owner DR / Mobile device lifecycle / API user lifecycle / Mobile app 전체 / Recovery & DR — 모두 ✅.

### Notes

- **Cloud backup 모델 확정**이 본 Stage의 가장 큰 수확. Stage 2의 "cloud-based key shares 삭제" → Stage 5의 "passphrase-encrypted backup of mobile device's private key share" 직접 연결.
- **MPC-CMP** variant 사용 명시 (Stage 1 단서를 직접 본문에서 확인).
- **3 비밀 layer (PIN / passphrase / recovery passphrase)** 직접 확인 — `device-migration.md` p.2 export 절차가 결정적.
- **Mobile vs API Co-Signer 두 평면**이 명시적 대체 옵션. 자동화 전략 기준 확립.
- **Device migration self-service의 admin approval bypass** — 거버넌스 측면 핵심 발견. risks.md 별도 절.
- **신규 entity 0개** — 사용자 방침 ("재사용 우선, 반복 등장 개념만 승격") 준수. 모든 추가 정보는 기존 entity 확장 또는 vendor page 신설(mobile-app)로 흡수.
- **다음 ingest 후보**:
  - MPC-CMP whitepaper / 기술 spec — Q-M01 / Q-D04 해소
  - Cosigner 배포 가이드 (SGX 포함) — Q-C01 / Q-A04 / Q-A05 해소
  - Policy Engine reference — Q-P01–P05 해소
  - Off-exchange / DRS 자료 — Q-O04 / Q-D07 해소
  - Other WaaS vendors (Privy / Coinbase / BitGo / Dfns) — 비교 분석 시작

## [2026-05-18] ingest | fireblocks | Security & Privacy × 5 (Stage 6)

- **Source PDFs (5)**:
  - security-checklist (360018469779)
  - support-verification-requests (25216149364892)
  - allowlisting-ip-addresses-for-console-access (9189366603548)
  - freeze-workspace (360019866280)
  - is-this-email-really-from-fireblocks (14826762746780)
- **Stage**: 6 (Security & Privacy domain — security/governance hub 구축)
- **Strategy (사용자 지정)**: workspace-management/security 도메인 안정화 / security.md를 security/governance hub로 / 신규 entity 최소화 / audit 관련 개념은 기존 entity/vendor에 흡수 / relationship·citation 강화.

### Files created (11)

- Source: 5 PDF rename + 5 `meta.yml` + 5 markdown
- Vendor 신규: `vendors/fireblocks/security.md` (1)
- **신규 entity: 0** (audit-log는 entity 미생성 — security-auditor / security-admin entity + compliance vendor + security vendor에서 통합)

### Files modified (19)

- Vendor (6): `risks` (4 신규 절: phishing, auto-passphrase trade-off, Console IP allowlist 운영, Batch는 Stage 5 그대로), `lifecycle-events` (Emergency Workspace Freeze), `authentication` (DKIM/DMARC, Console IP allowlist, User login IP whitelisting), `compliance` (Stage 1 stub → 본격 채움), `mobile-app` (Support verification request 평면), `user-management` (Freeze actor 4 role)
- Entity (11): `ip-allowlist` (두 평면 분리), `recovery-passphrase` (Auto-passphrase), `policy` (Policy 종류 + API user 권장), `workspace` (Freeze 모델 확정), `mobile-device` (Support verification 평면), `admin-quorum` (Security & compliance 위임), `approval-group` (두 위임 메뉴), `user-roles/owner` (Unfreeze Support), `user-roles/admin`, `user-roles/non-signing-admin`, `user-roles/security-admin` (Freeze 권한)
- Open Questions (1) + Log (1)

### Files renamed (5)

5 Security & Privacy PDF → 정규화 명칭

### Open Questions

- **Partial answered**:
  - Q-2026-05-18-A06 — Console IP allowlist는 CIDR/range, API는 `/32`. 두 평면 분리 확정
  - Q-2026-05-18-A07 — Audit log export 기능 확정. API endpoint·retention·SIEM forwarding 잔존
  - Q-2026-05-18-G03 — 두 위임 메뉴 확인 (User management + Security & compliance)
- **Added (8)**:
  - Security (7): S01–S07 (Auto-passphrase / Deposit Control Policy / AML Screening Policy / cooling-off / suspension / Support verification rollout / FSPM)
  - Operations (1): O05 (freeze incoming transfer 처리)
- **카테고리 신설**: S (Security)

### Notes

- **security.md hub** — Security checklist의 6 카테고리 통합. risks/compliance와 cross-ref. 향후 SOC2/compliance 자료 추가 시 hub로 확장 가능.
- **ip-allowlist entity 두 평면 분리**가 본 Stage 가장 중요한 정합성 작업. API user (`/32`)와 Console (CIDR/range)가 별개 평면임 확정 (Q-A06).
- **Auto-passphrase** 옵션은 사용자 인적 오류 제거 + RSA key SPOF 추가 trade-off (Q-S01 추적).
- **Phishing 방어 / Support verification** = social engineering 방어 평면 — risks + mobile-app + security 모두에 cross-ref.
- **Emergency Workspace Freeze**: 4 Admin-level role freeze, Owner-only + Support unfreeze. Stage 3의 "Owner-touching critical = Support 영상 통화" 패턴에 정합.
- **Audit log entity 미생성** (사용자 방침) — security-auditor / security-admin / compliance / security vendor에서 cross-ref 강화.
- **신규 entity 0개** — 모든 정보가 기존 entity 확장으로 수용. relationship/citation 강화 중심 유지.
- **다음 ingest 후보**: FSPM (Q-S07), Policy Engine reference (Q-S02/S03/P01–P05), Auto-passphrase docs (Q-S01), MPC-CMP whitepaper, Other WaaS vendors 비교.

## [2026-05-18] ingest | fireblocks | Blockchains × 20 (Stage 7) — Lightweight reference/catalog ingest

- **Source PDFs (20)**:
  - **Core (8, full markdown)**: about-blockchains / supported-blockchain-networks / blockchain-data-sheets / node-router / blockchains-sla / minimum-balance / minimum-transaction-amounts / blockchains-that-support-internal-transactions
  - **Chain-specific (12, placeholder markdown)**: algorand-blockchain-limitations / tezos-blockchain-limitations / filecoin-blockchain-functionality-overview / flare-introduction / funding-a-new-stellar-account / kusama-transaction-fee-estimation / moonbeam-and-moonriver-transaction-support / near-tokens-initial-deposit / polkadot-dot-minimum-balance-and-fee-estimation / removing-a-ripple-xrp-trust-line / solana-maximum-queued-transactions / songbird-support-and-the-flare-airdrop
- **Stage**: 7 (Blockchains reference/catalog — 자산 도메인 첫 본격 진입)
- **Strategy (사용자 지정)**: Reference/catalog 성격이 강하므로 **placeholder markdown 기반 인덱싱 전략**. governance/signing 흐름과 강하게 연결되는 chain만 추후 selective full ingest 승격. 신규 entity 0개.

### Files created (21)

- Source: 20 PDF rename + 20 `meta.yml` + 20 markdown (8 full + 12 placeholder)
- Vendor 신규: `vendors/fireblocks/blockchains.md` (1) — **catalog/reference hub**
- **신규 entity: 0** (사용자 방침 strict 준수)

### Files modified (8)

- Vendor (3): `overview.md` (blockchains hub link), `architecture.md` (Node infrastructure 절 신설), `risks.md` (3 신규 절: Foundation node SLA, Node Router no-fallback, Chain-specific quirks)
- Entity (3): `vault-account.md` (chain-별 자산 운영), `transaction.md` (chain-별 transaction 제약), `workspace.md` (Node Router tenant 단위)
- Open Questions (1) + Log (1)

### Files renamed (20)

20 Blockchain PDF → 정규화 명칭

### Open Questions

- **Added (3)**:
  - Blockchain (3): B01 (SLA × Internal-tx 매트릭스 운영 의미), B02 (Node Router static vs on-demand trade-off), B03 (Internal tx 감지 메커니즘)
- **카테고리 신설**: B (Blockchain)

### Notes

- **Placeholder 인덱싱 전략** — 본 Stage 핵심. 20개 PDF 모두 정규화·meta·markdown 변환 진행하되, chain-specific 12개는 one-line summary + 원본 PDF reference만 포함. 추후 selective full ingest로 승격.
- **blockchains.md hub** — 자산 도메인 첫 본격 vendor page. Chain 종류 vocabulary (EVM/non-EVM/UTXO/Cosmos SDK), 3 node type SLA 모델, Node Router 평면, Min balance/amount, Internal tx 정의, 12개 chain-specific quirks 인덱스 통합.
- **신규 entity 0개** — 사용자 방침 ("reference/catalog 성격, 신규 entity 최소화") 준수. 모든 정보가 기존 entity 확장 또는 blockchains.md hub로 흡수.
- **Selective full ingest 승격 기준**: (a) governance/signing/relationship 흐름과 강하게 연결, (b) 다른 chain의 패턴 일반화에 메타 가치, (c) 사용자 명시 요청.
- **자산 도메인 vs 워크스페이스 도메인** — 두 평면 직교. 본 Stage는 자산 도메인을 가볍게 진입, 깊은 연결은 향후 selective ingest로.
- **다음 ingest 후보**: (자산 도메인 보강) DeFi connections / Staking / Tokenization 자료 / (워크스페이스 보강) Policy Engine reference / FSPM docs / MPC-CMP whitepaper / (벤더 비교) Other WaaS vendors (Privy / Coinbase / BitGo / Dfns).

## [2026-05-18] ingest | fireblocks | Architecture/MPC/Auth/Audit × 12 (Stage 8) — 신규 운영 방침 적용 첫 batch

- **Source PDFs (84 추가, 12 deep ingest)**:
  - **TIER 1 (4, full markdown)**: authentication-and-authorization / security-aspects-signing-with-the-fireblocks-mobile-app / best-practices-for-choosing-user-roles / audit-log
  - **TIER 2 (8, full markdown으로 ingest 했으나 신규 entity 0)**: mpc-cmp / intel-sgx-secure-environments / business-continuity-module-bcm / fireblocks-yubikey-authentication / fireblocks-ip-addresses-to-whitelist / fireblocks-cloud-architecture / fireblocks-architecture-introduction / hosted-mpc-overview
  - **TIER 3 (72, Source Lake raw PDF only)**: chain-specific asset wallet, asset/balance/price views, OTA, Parallel tx, Tags, Vault HD paths, Embedded Wallets, Key Link, MPC-BAM, Hosted MPC sub-docs, webhooks (4), AML integrations, Cardano Raw Signing, etc.
- **Stage**: 8 (Architecture / MPC / Identity-Auth / Security-Access domain — 신규 운영 방침 적용 첫 batch)
- **Strategy (사용자 신규 방침)**: Source Lake (PDF) ≠ Curated Wiki (entity). 5 priority domain 만 deep ingest. Entity 최소화. Audit/chain-specific/minor UI/edge-case → 흡수. 새 PDF = 새 entity ≠ default.

### Files created (24)

- Source: 12 PDF rename + 12 `meta.yml` + 12 markdown = 36
- **신규 entity: 0** (사용자 방침 strict 준수, Stage 5-6-7-8 4 stage 연속)
- 신규 vendor page: 0

### Files modified (12)

- Vendor (4): `mpc.md` (MPC-CMP 정식 명세 + Q-M01/M03/D04 ANSWERED), `architecture.md` (3-cloud + 6 components + BCM + Hosted MPC + DR SPOC), `security.md` (audit log + auth architecture + MPC spine + SGX + DR + BCM), `risks.md` (S08-S14 7 신규 리스크 절)
- Entity (6): `mpc-key-share.md` (Stage 8 MPC-CMP 정식 명세 + 2-key 분리), `mobile-device.md` (Stage 8 두 종류 키 + token lifecycle + Yubikey), `cosigner.md` (Stage 8 chain of trust + SGX baseline + 2-tier), `ip-allowlist.md` (Stage 8 customer-side firewall plane), `admin-quorum.md` (Stage 8 Quorum vs Policies 기능 분리), `user-roles/owner.md` (Stage 8 MPC-level root + 9 책임 + Yubikey 전파), `2fa.md` (Stage 8 Yubikey mobile plane)
- Open Questions (1) + Log (1)

### Files renamed (12)

12 TIER 1+2 PDF → 정규화 명칭 (TIER 3 72개는 raw 유지 — PDF collection ≠ deep ingest 원칙)

### Open Questions

- **ANSWERED**: M01 (MPC-CMP 정식), M02 (3-endpoint signing), M03 (cloud 2 + customer 1), D04 (3/3 within + 1/N OR), A05 (SGX baseline), A07 (Audit Log + SIEM API), AU04 (Yubikey 5 NFC + biometric)
- **부분 advanced**: C01 (chain of trust 명세), G01 (Threshold changed audit event 신호)
- **신규 7건 추가**:
  - Security (7): S08 (Single-signer SPOF mitigation threshold), S09 (DR Service xprv+fprv 운영 절차), S10 (BCM 도입 의사결정 기준), S11 (Owner Yubikey 후 기존 사용자 처리), S12 (3-region SaaS region selection), S13 (Sec-Auditor/Admin audit access plane), S14 (Configuration key lifecycle)

### Notes — 핵심 발견

- **MPC-CMP architecture 완전 명세 확보** (Stage 8 의 최대 성과):
  - Protocol: Canetti-Makriyannis-Peled paper, NIST 2020 / ACM CCS 2020
  - Threshold: 3/3 within group + 1/N OR across groups
  - Owner = MPC-level cryptographic root (모든 Admin/Signer set 이 Owner set 에서 derived)
  - Additive Secret Sharing (Shamir t=n), perfect secrecy
  - HRNG Intel RDRAND, NIST SP 800-90A
  - 4 rounds (3 pre-processed) vs GG18 8 rounds → 800% faster
  - 마지막 라운드 QR offline → air-gapped wallet
- **Mobile device dual-key 분리** 확정 — MPC-CMP key share (signing) + Configuration key (governance/Admin Quorum)
- **Cloud architecture 3-provider 분할** — Azure (sensitive + SGX) / AWS (frontend, no secrets) / GCP Firebase (caching)
- **6 system component** + **DR SPOC 공식 경고** (xprv+fprv 정기 사용 금지)
- **BCM = Hosted MPC 전용** on-prem fallback stack 정식 명세
- **Hosted MPC variant** = 1 Primary + 2 Guard (모두 customer 호스팅), Fireblocks 0 key shares
- **Audit Log 영구 보존 + SIEM API endpoint** + 20+ 카테고리 enumeration (Workspace Key Backup 9-stage lifecycle 등)
- **Owner-Yubikey workspace-wide 강제 전파** 패턴 새로 발견
- **3-region SaaS (US/EU/EU2)** 배포 확인 — APAC 데이터 거주성 미명세
- **Single-signer = SPOF** 공식 인정

### Strategy 검증

- **Source Lake vs Curated Wiki 분리 원칙**이 정상 동작 — 84 PDF 중 deep ingest 12 + raw-only 72 가 명확히 분리됨
- **Entity 최소화** 강력 유지: Stage 5/6/7/8 연속 **4 stage 신규 entity 0건**
- TIER 3 72개 raw PDF 는 모두 unnormalized filename 유지 (사용자 mass-rename 승인 시 일괄 처리 가능)
- 7-spine relationship (Owner SPOF / 3-Admin-class / 2-approval-menu / 2-IP-plane / 3-secret-layer / Cloud backup / Owner-touching=Support) 에 **MPC spine 추가** = "MPC 3-endpoint with Owner-as-root"

### 다음 ingest 후보

- (deferred from TIER 3) FSPM 자료 (Q-S07), Policy Engine reference (P01-P05), Hosted MPC Customer-Side Setup / Backup and Recovery (S09/S10), Embedded Wallets / Key Link (separate product line)
- (자산 도메인) Vault Structure Best Practices, Whitelisting new addresses, OTA Transactions
- (벤더 비교) Privy / Coinbase / BitGo / Dfns

## [2026-05-18] ingest | fireblocks | Transaction lifecycle × 6 (Stage 9) — Transaction Domain spine 확립

- **Source PDFs (36 추가, 6 deep ingest)**:
  - **TIER 1 (1, full markdown)**: transaction-lifecycle (★ 17-status state machine + 14-step technical schematic + zero-trust + AML providers 명시)
  - **TIER 2 (5, condensed markdown)**: primary-transaction-statuses / vault-structure-best-practices / account-and-wallet-structure / whitelisting-new-addresses / one-time-address-ota-feature
  - **TIER 3 (30, Source Lake raw PDF only)**: 22 fee 관련 (EVM/UTXO Overview/Selecting/Validation/Rates/Net-gross/Adjusting/MaxFee/Min-gas/Ethereum-params + tx-fee-representation + withdrawal-fees + viewing-spent-fees) + 8 substatus enumerations (Failed/Cancelled/Rejected/Blocked/Completed/Confirming/Broadcasting/Pending-third-party) + Cancel/Retry/Dismiss tx + Multi-input/destination + mempool/stuck + chain-specific (Doge/Zcash/XRP-transfers/XRP-SDK/Cardano-Raw/Movement)
- **Stage**: 9 (Transaction Domain — outgoing/incoming state machine, technical schematic, governance integration)
- **Strategy**: Stage 8 의 5 priority domain 외라서 strict 흡수 전략. Transaction 은 governance/architecture 와 직접 cross-cut 이므로 lifecycle meta 문서만 deep, 나머지는 운영 detail 로 placeholder.

### Files created (12)

- Source: 6 PDF rename + 6 `meta.yml` + 6 markdown (1 full + 5 condensed) = 18
- **신규 entity: 0** (연속 4 stage = Stage 6/7/8/9 = 신규 entity 0건 유지)
- 신규 vendor page: 0

### Files modified (8)

- Entity (5): `transaction.md` (Stage 9 state machine + 14-step + 시간 제약 + chain-specific quirk + dApp Protection + RBF + Approver unanimous-veto), `workspace.md` (5-level hierarchy + Hot/Cold + Mainnet/Testnet + default visibility + multi-workspace 6 trigger + 3-workspace tokenization), `vault-account.md` (3-pattern address mapping + smart contract per-op vault + withdrawal round-robin), `policy.md` (Policy Engine 14-step 내 위치 + Whitelist vs OTA + AML workspace default), `admin-quorum.md` (Whitelist vs OTA governance scope)
- Vendor (2): `architecture.md` (Stage 8 6-component → Stage 9 module 분해 + AML providers + zero-trust handoff), `lifecycle-events.md` (Transaction lifecycle vs User/Device lifecycle 직교 명시)
- Open Questions (1) + Log (1)

### Files renamed (6)

6 TIER 1+2 PDF → 정규화 명칭 (TIER 3 30개는 raw 유지)

### Open Questions

- **ANSWERED**:
  - Q-W01 (Hot/Cold 직교 + Mainnet/Testnet node 분리)
  - Q-S08 (Azure 내 Auth Engine / Policy Engine TAPs / Secure Vault / Co-Signer Engine module 책임 + zero-trust handoff)
- **부분 advanced**:
  - Q-P02 (chain-specific tx 처리 모델 — EVM blockchain-standard 직렬화 + Solana 5-tx queue + BTC 25-tx chain)
  - Q-S03 (AML provider 명시 — Chainalysis / Elliptic / Notabene)
- **신규 0건** — 모든 발견이 기존 Q 응답 또는 기존 entity/hub 흡수

### Notes — 핵심 발견

- **Transaction Lifecycle 14-step technical schematic** 정식 다이어그램:
  - User → API → Dev API Gateway → JWT 검증 (Cert Store + Auth Engine SGX) → Transaction Manager → Balance Service + Screening Service (AML/Travel Rule) → **Policy Engine (SGX, TAPs)** → approvers (mobile device 서명) → **Secure Vault (SGX, PKI in enclave)** → Co-Signer Engine (SGX) → Co-Signer 1/2/3 (SGX) → (optional Callback Handler) → Auth Engine 검증 → signed tx → Node → Blockchain
- **Zero-trust 명시** — Stage 8 의 Root Key chain of trust 가 **service-to-service handoff 까지** 적용. "Every SGX service exists in zero-trust configuration, data is not passed between them during signing"
- **AML 공급자 정식 명시** — Chainalysis / Elliptic / Notabene (Q-S03 부분 응답)
- **17 Primary Status enumeration** + API status code 완전 매핑 (SUBMITTED / PENDING_AML_SCREENING / PENDING_ENRICHMENT / PENDING_AUTHORIZATION / QUEUED / PENDING_SIGNATURE / PENDING_3RD_PARTY_MANUAL_APPROVAL / PENDING_3RD_PARTY / BROADCASTING / CONFIRMING / COMPLETED / SIGNED / CANCELLING / CANCELLED / BLOCKED / REJECTED / FAILED)
- **시간 제약 정식 명세**: Authorization 2h / Signature 2h / Cancelling 30s / Broadcasting 1min / Solana 6th-tx wait 2h
- **Chain-specific tx 처리 모델**:
  - EVM-compatible: 동일 vault account 의 **blockchain-standard 단위 직렬화** (ETH+POLY 순차, BTC+SOL 병렬)
  - Solana: vault account 당 동시 **5 tx queue** (6번째 이상 2h 대기 후 terminated)
  - EVM withdrawal: nonce stuck risk → **multi vault round-robin**
  - Bitcoin withdrawal: **25 tx unconfirmed chain limit** (Bitcoin Core default) → multi vault round-robin
- **Approvers Unanimous-Veto Rule**: 한 명이라도 reject → tx 즉시 fail
- **Outgoing vs Incoming Rejected 비대칭**: outgoing rejected = 자산 즉시 사용 가능, **incoming rejected = Admin unfreeze 필요**
- **Workspace 5-level hierarchy 확립**: Customer Domain > Workspace > Vault Account > Asset Wallet > Deposit Address
- **Hot/Cold ⊥ Mainnet/Testnet** 두 직교 축 명시
- **Default vault visibility = all users see all vaults** — workspace 가 권한 격리의 최소 단위 (Q-W01 spine 응답)
- **3 asset address 패턴 매핑**:
  - UTXO: 1 permanent + N deposit
  - Account-based no-tag (ETH): 단일 (강제)
  - Account-based with tag/memo (XRP): 1 address + N tags
- **Whitelist vs OTA 의 Admin Quorum scope**:
  - Whitelist: per-address Admin Quorum approval **필수**
  - OTA: per-address quorum **없음**, feature activation 만 Owner OR Approval group, **Policy 가 사실상 유일한 자동 방어선**
- **High-Value Tokenization 3-workspace 패턴** (>$10M): Administrative + Operational + Custodial
- **dApp Protection (Pending Security Screening)**: 3 type — typed message EVM / contract call Ethereum / dApp-initiated (advisory only)
- **Replace-By-Fee (RBF) for EVM** during Broadcasting (cancel 대안)

### Strategy 검증

- **5 priority domain 외 batch 도 신규 entity 0건 유지** — 운영 방침 견고함
- TIER 3 처리 비율 = 30/36 = **83%** (Source Lake 만 보관) — PDF collection ≠ deep ingest 원칙 명확히 적용
- Transaction Domain 은 governance/architecture cross-cut 이므로 lifecycle meta + status enumeration 만 deep, 나머지 chain-specific fee 운영 detail 은 raw 유지
- 8 substatus enumerations 도 placeholder 생성 안 함 — primary status entity 흡수에 substatus 정보는 후속 ingest 시 promotion 가능

### 다음 ingest 후보

- (운영 spine 보강) 8 substatus enumerations 중 Failed/Cancelled/Rejected (governance 영향) 선택적 promotion
- (smart contract / Web3) NFT token support, Web3 audit log events, Fireblocks Extension (Stage 8 audit log 에서 언급)
- (Hosted MPC 보강) Customer-Side Setup / Workspace Configuration / Backup and Recovery (Stage 8 의 후속 → S09/S10 응답)
- (compliance) FSPM, Travel Rule Support best practices
- (Embedded Wallets / Key Link product line) 별도 vendor section 으로 evaluate
- (벤더 비교) Privy / Coinbase / BitGo / Dfns

## [2026-05-18] ingest | fireblocks | Governance spine × 12 (Stage 10) — Admin Quorum / Approval Groups / Policy / FSPM 정식 명세

- **Source PDFs (250+ 추가, 12 ingest)**:
  - **TIER 1 (6, full markdown)**: admin-quorum / approval-groups / about-policies / how-policies-work / about-the-deposit-control-and-confirmation-policy / fireblocks-security-posture-management-fspm
  - **TIER 2 (6, 1 full + 5 meta-only)**: user-group-management (full markdown) / policy-rule-parameters / policy-best-practices / policy-examples / override-the-dccp-for-specific-transactions / about-automation (5 meta-only, markdown deferred)
  - **TIER 3 (~240, Source Lake raw PDF only)**: 50+ exchange-specific connection / 12+ fiat (Bridge/Lynq/BLINC/TKB/Yellow Card/Alfred/etc) / 22+ fee mechanics (EVM/UTXO + TON/TRON/Solana priority/EOS/ASTR/Cardano/XRP) / 10+ Gas Station ops / 8+ Gasless / 6 Smart Transfers / 7 Off Exchange / 5 Network/Provider / Cross-chain/Swap/Wrap/On-Off-ramp / substatuses / chain-specific tx ops
- **Stage**: 10 (Governance domain — Admin Quorum + Approval Group + Policy + DCCP + FSPM 정식 명세)
- **Strategy**: 5 priority domain 중 **Governance + Security-Access** 직격. Stage 6-9 의 entity 최소화 원칙 유지 + User group 은 별도 entity 만들지 않고 cross-cite 흡수.

### Files created (24)

- Source: 12 PDF rename + 12 meta.yml + 7 markdown (6 TIER 1 full + 1 TIER 2 full) = 31
- **신규 entity: 0** (Stage 6/7/8/9/10 **5 stage 연속** 신규 entity 0건)
- 신규 vendor page: 0

### Files modified (8)

- Entity (4): `admin-quorum.md` (Stage 10 정식 명세 + API Admin -1 효과 + Cold Wallet 특수), `approval-group.md` (Stage 10 12 actions + 4 categories + permission filter + User group prerequisite), `policy.md` (Stage 10 5 default rules + first-match + 3 action + sub-quorum + DCCP), `user-roles/security-auditor.md` (Stage 10 FSPM access plane)
- Vendor (2): `security.md` (Stage 10 3-level governance architecture + FSPM + Audit vs Posture plane 분리), `risks.md` (Stage 10 8 Risk-G 절 — API Admin quorum-1 / API approval group / User group TAP cascade / Policy block-all / first-match brittleness / All Admins onboarding / Cold Wallet approval-group 부재 / FSPM add-on)
- Open Questions (1) + Log (1)

### Files renamed (12)

12 TIER 1+2 PDF → 정규화 명칭 (TIER 3 240+ 는 raw 유지)

### Open Questions

- **ANSWERED**:
  - Q-G01 (Admin Quorum threshold All/Number + default "All Admins")
  - Q-G03 (4 UI categories — Sec&compliance / User mgmt / FB Network / External accounts)
  - Q-G04 (Owner/Admin/NSA 자동 멤버, role-based)
  - Q-L06 (12 assignable actions + 5 Owner-mandatory)
  - Q-S02 (DCCP confirmation 정책 + lock state)
  - Q-S07 (FSPM AI-based attack simulator + Gemini)
- **부분 advanced**:
  - Q-P01 (Policy 2 component + 3 action + 5 default rules — parameter table은 TIER 3 보류)
  - Q-S13 (Security Auditor 가 FSPM access, Audit Log plane 은 여전히 미명시)
- **신규 0건** — 모든 발견이 기존 Q 응답 또는 risks.md 의 Risk-G01~G08 8 절로 흡수

### Notes — 핵심 발견

#### Governance 3-Level Architecture 정식 확립

```
Admin Quorum  (workspace-default, role-based 자동 멤버십)
  └── Approval group  (action-level 위임, 12 actions, 4 categories, user group base)
        └── Policy Approved by sub-quorum  (rule-level N-of-M, user group 기반)
              └── User group  (멤버 집합, 별도 entity X)
```

#### Admin Quorum 정식 명세
- 멤버십 자동 (Owner/Admin/NSA, role-based)
- Threshold: All (dynamic) 또는 Number, **default "All Admins"**
- 변경 = Owner mandatory + Current Quorum approve (메타-거버넌스)
- API Admin = quorum −1 효과 (auto-approve)
- Cold Wallet workspace 특수: 일부 액션 Support 경유 필수, approval group 미지원

#### Approval Group 정식 명세
- **12 assignable actions** (whitelist / IP allowlist / OTA / Policy / users / re-enroll / user groups / P2P / exchange / fiat / Automation)
- **4 UI categories** (Stage 6 의 "두 위임 메뉴" 가 실제로 4 카테고리)
- **5 Owner-mandatory default actions** (OTA / Policy / users / re-enroll / user groups)
- Permission filter: action 권한 없는 role 자동 제외 (예: Signer 가 Policy approval group 에 있어도 카운트 X)
- Cold Wallet 미지원

#### Policy 정식 명세
- **Primary security control** (공식)
- 2 component: Parameters + Actions
- 3 action: Allow / **Approved by** (user/group, sub-quorum 가능) / Block
- **First-match principle**, rule order = governance 결정
- **5 default rules** (Transfer NFT / Transfer asset / Contract Call / Approve / **All-block last 삭제 불가**) — default-deny architecture
- Custom Policy 도입 = default 즉시 삭제 (one-way replacement)
- Premium features: Raw Signing / Mint / Burn
- 관리권: Owner + Admin + NS-Admin (approval group approve 필요)

#### DCCP 명세
- Confirmation 횟수 정책 (in + out)
- Clear 전 = inflow/outflow lock
- UTXO: clear 후 즉시 spendable
- Stage 9 Confirming → Completed transition trigger

#### FSPM 정식 명세 (★ 가장 인상적 새 spine)
- **Add-on**, **Security Auditor 가 access role 포함** (Audit Log 와 별개 plane)
- **AI-based attack simulator** — Google Gemini private deploy
- **3-step Agentic Policy Analyzer**:
  1. Weakest link detection (unilateral 가능 user)
  2. High-value targeting
  3. **Autonomous drain simulation** (ReAct loop, single hop + lateral movement)
- **6 monitoring 영역**: over-permissive policies / unused users + access gaps / weak approval group thresholds / risky settings / token allowances / outdated software
- **SOC2 compliance violation 매핑**
- AI 안전성: no fine-tuning, session-level isolation, every attack policy-engine validated, AI 가 policy 직접 변경 불가

#### Audit vs Posture Plane 분리 (Stage 8 + Stage 10 통합)

| Plane | Access | 목적 | Stage |
|---|---|---|---|
| Audit Log | Owner/Admin/NSA | post-incident forensic | 8 |
| FSPM | Owner/Admin/NSA/**Security Auditor** | pre-incident posture | 10 |

→ 두 평면이 명확히 분리. Security Auditor 는 FSPM 만 가능.

#### 8 신규 Risk-G 카테고리 (risks.md 흡수)
- API Admin = quorum −1, API approval group fully-controlled, User group 삭제 TAP cascade, Policy block-all default 의존, First-match ordering brittleness, "All Admins" default 의 onboarding friction, Cold Wallet approval-group 미지원, FSPM add-on cost

### Strategy 검증

- **TIER 3 처리 비율 = 240/250 = 96%** (Source Lake raw 만) — PDF collection ≠ deep ingest 원칙 견고함
- **5 stage 연속 신규 entity 0** = Curated Wiki entity count 32+9=41 유지
- User group = 새 governance entity 후보였으나 approval-group + policy 의 cross-cite 흡수로 처리 (entity 최소화 원칙)
- 12 actions enumeration 으로 Q-G03/L06 동시 응답
- FSPM 으로 Q-S07 (이전 stage 의 가장 strict open Q 중 하나) 응답

### 다음 ingest 후보

- (governance 보강) Policy rule parameters (full markdown으로 promotion if Q-P01 detail 필요), Policy examples
- (smart contract / DeFi) Policies for EVM DeFi operations / Policy rules for minting and burning tokens / Cross-chain bridging
- (compliance) FSPM 의 SOC2 compliance violation 상세 매핑
- (Hosted MPC 보강) Customer-Side Setup / Backup and Recovery
- (벤더 비교) Privy / Coinbase / BitGo / Dfns

## [2026-05-19] policy-update + ingest | fireblocks | Tokenization product line × 33 (Stage 11) — Lazy-load policy 도입, Source Lake hygiene only

- **Operating policy update (v2)**: `prompts/operating-principles.md` 신설 — Source Lake 250+ PDF 규모 도달에 따른 **lazy-load + selective ingest** 모드 강제. Context 보호 원칙 도입 (수십 PDF 동시 read 금지).
- **Source PDFs (33 추가, 0 deep ingest)**:
  - **TIER 1 catalog placeholder (1)**: about-tokenization-on-fireblocks (markdown = product line catalog, 본문 미로드)
  - **TIER 2 meta-only (2)**: roles-in-fireblocks-smart-contracts, best-practices-when-assigning-token-contract-roles
  - **TIER 3 raw PDF only (30)**: 4 chain-specific tokenization + 11 contract operations + 5 token mgmt + 3 smart contract infra + 2 ABI + 3 Gasless contract + 2 use case BP

### Stage 11 Characteristic

- **이전 stage 와 다른 특징**: 신규 PDF 본문 read **1건만** (about-tokenization, 그것도 metadata 만 반환됨), entity/hub 수정 **0건**, Open Questions 신규/응답 **0건**.
- 신규 운영 방침 적용 첫 stage. **Catalog-only stage** (이전 Stage 8/9/10 의 deep ingest 패턴 종료).

### Why Tokenization Was Deferred

- Tokenization = **별도 product line** (Embedded Wallets / Key Link / Off Exchange / Cold Wallet 처럼)
- **5 priority domain 외** (Workspace Mgmt / Identity-Auth / Governance / Mobile-DR / Security-Access)
- Cross-cut governance 영역 (smart contract roles) 은 Stage 9 Vault Structure BP + Stage 10 Policy entity 가 이미 high-level 로 cover
- 사용자 active operational domain 으로 격상 시 promote 가능

### Files

- Source: 3 PDF rename + 3 meta.yml + 1 placeholder markdown (catalog)
- **신규 entity: 0** — Stage 6/7/8/9/10/11 **6 stage 연속 0** 유지
- 신규 vendor page: 0
- 수정 entity: 0
- 수정 hub: 0
- 신규 meta file: `prompts/operating-principles.md` (운영 방침 v2)

### Operating Principles v2 핵심 변경

1. **Source 수집 ≠ 즉시 deep ingest** 강조
2. **PDF 전체 본문을 한 번에 context 에 로드 금지**
3. **markdown 전체 한 번에 read 금지**
4. **신규 PDF 처리 3-step**: domain relevance → tier 분류 → deep ingest 필요성 평가
5. **5 priority domain 만 deep ingest** 대상 유지 (Tokenization 제외 명시)
6. **TIER 3 = deep ingest 금지** (raw PDF 보존 + placeholder/index 만)
7. **Lazy-load 패턴**: 신규 batch 시 filename triage → TIER 1/2 후보만 선택적 본문 read → TIER 3 는 raw 유지

### Tokenization Source Lake Catalog (33 files)

`sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__about-tokenization-on-fireblocks.md` 에 전체 catalog 정리. 향후 promote 시 그 파일이 entry point.

### 다음 ingest 후보 (lazy-load 모드 적용)

- 사용자가 명시 priority domain 의 추가 자료를 추가하면 → 그때만 deep ingest
- Tokenization 은 사용자가 명시 요청 시 promote (별도 vendor section 생성 가능)
- 현 시점 active domain 은 governance 가 가장 spine-rich (Stage 10) — 이 영역 후속 자료 우선

### Strategy 검증

- **신규 33 PDF 중 deep ingest 0건** = lazy-load policy 의 strict 적용 첫 사례
- Catalog markdown 1개 + meta.yml 3개 = Source Lake hygiene 최소화
- Stage 6-11 6 stage 연속 신규 entity 0 → **entity explosion 방지** 목표 견고

## [2026-05-19] policy-update + ingest | fireblocks | Backup & Recovery + Developer/API × 11 (Stage 12) — v3 policy 도입, PDF raw read 중단

- **Operating policy update (v3)**: `prompts/operating-principles.md` 업데이트 — **PDF raw read 자체를 중단**, markdown/lightweight index 중심 운영. Source Lake 가 370+ PDF 규모로 성장, recovery/architecture/mobile/MPC 등 대형 PDF 본문 직접 로드 금지.
- **Source PDFs**:
  - **TIER 1 lightweight markdown (5)**: about-backup-and-recovery / mobile-key-share-backup-and-recovery / third-party-disaster-recovery-services / security-and-maintenance-best-practices / raw-signing
  - **TIER 2 meta.yml only (6)**: how-to-perform-key-backup-and-recovery / introduction-to-native-backup-and-recovery / about-the-fireblocks-recovery-utility / recovering-private-key-material / reconstructing-your-workspace / mobile-key-share-backup-and-recovery-with-a-third-party-drs
  - **Cluster 4 catalog (1 markdown for 9 raw PDFs)**: developer-center-catalog (Raw Signing 만 TIER 1 lightweight, Typed Message + 7개는 raw 유지)
- **Stage**: 12 (Backup & Recovery cluster spine 강화 + v3 policy 도입)

### v3 Policy 핵심 변경

1. **PDF raw read 금지** — `Read` tool 로 PDF 직접 호출 차단
2. **markdown 또는 lightweight index 만 LLM read 대상**
3. **필요시 외부 도구로 PDF → markdown 변환 후 사용자 제공**
4. **recovery / architecture / mobile / MPC** 4 도메인은 특히 strict

### Stage 12 Characteristic

- **PDF 본문 read 0건** (이전 stage 와 가장 큰 차이)
- 모든 TIER 1 markdown = **lightweight index** (filename + URL + domain + cross-cut signal + promote condition)
- 본문 fact 추측 없음 → **기존 entity 에 cite 추가 0건**
- 신규 entity 0 (Stage 6/7/8/9/10/11/12 = **7 stage 연속 0**)

### Files

- Source: 11 PDF rename + 11 meta.yml + 6 markdown (5 TIER 1 lightweight + 1 Cluster 4 catalog)
- 신규 entity: **0** (7 stage 연속)
- 신규 vendor page: 0
- 수정 entity: **0** (v3 policy: PDF body 미로드 → cite 추가 안 함)
- 수정 hub: 0
- 수정 meta file: `prompts/operating-principles.md` (v2 → v3)

### Cluster 3 (Backup & Recovery / DRS) Source Lake 상태

- 5 TIER 1 lightweight index 생성 (`about-backup-and-recovery.md` 가 22-PDF cluster catalog 포함)
- 6 TIER 2 meta.yml only deferred
- 11 TIER 3 = raw PDF (Recovery Utility ops / scripts / chain-specific / DRS provider specific)

### Cluster 4 (Developer / API) Source Lake 상태

- 1 catalog markdown (`developer-center-catalog.md`) 으로 9개 file index
- `Raw Signing` 만 TIER 1 lightweight (renamed)
- `Typed Message Signing` + 7개는 raw 유지 (no rename, no meta.yml)

### Open Questions (현재 stage 변화 없음)

- Q-S09 (DR Service 운영 절차) — Stage 12 에서 `third-party-disaster-recovery-services.pdf` 가 후속 자료로 식별됨. promote 시 응답 가능. 현재는 lightweight index 만.
- Q-W02 / Q-M03 — `mobile-key-share-backup-and-recovery.pdf` 가 보강 후보 식별됨. promote 시 응답 가능.

### Strategy 검증

- **v3 policy 즉시 적용**: 사용자가 PDF raw read 중단 지시 → 즉시 운영 방침 업데이트 + 진행 중인 Stage 12 도 lightweight markdown 으로 전환
- **본문 fact 없는 entity cite 시도 안 함** → 추측 금지 원칙 견고
- **5 stage 연속 신규 entity 0 유지** + Stage 12 도 0 = **7 stage 연속 0**
- Lightweight index 가 향후 promote 시 entry point 역할

### 다음 ingest 후보 (v3 mode)

- 사용자가 외부 도구로 PDF → markdown 변환 후 제공 시:
  - Q-S09 응답 위해 `third-party-disaster-recovery-services` 본문 promote 우선
  - Q-W02 보강 위해 `mobile-key-share-backup-and-recovery` 본문 promote
- 또는 Compliance/AML/Travel Rule cluster (Stage 12 직전 batch) lightweight index 생성
- 또는 Cold Wallet cluster lightweight index 생성

### Source Lake 통계

- Raw PDF (총): 370+
- Normalized: 96+ (Stage 12 +11 rename)
- meta.yml: 96+
- markdown (full + placeholder + index): 85+

## [2026-05-19] policy-update | fireblocks | v3.1 balance 보강

- **Operating policy v3.1**: 사용자 피드백 반영, 2 보강:
  1. **TIER 2 = 기본 meta.yml + 검색성/promote 가능성 있으면 placeholder markdown 까지 허용** (full markdown 은 보류)
  2. **Context/token 안정성 유지** — 단, **deep ingest 시 citation 품질을 위해 chunk/page 단위 근거 확보** (균형)

### Stage 12 후속 처리

- Stage 12 의 6 TIER 2 항목을 meta.yml only → **placeholder markdown 으로 격상**:
  - `how-to-perform-key-backup-and-recovery.md`
  - `introduction-to-native-backup-and-recovery.md`
  - `about-the-fireblocks-recovery-utility.md`
  - `recovering-private-key-material.md`
  - `reconstructing-your-workspace.md`
  - `mobile-key-share-backup-and-recovery-with-a-third-party-drs.md`
- 각 placeholder = filename + URL + domain tag + tier + cross-cut signal + promote condition (본문 fact 추측 금지)
- 검색성 확보 (filename + cross-cut 으로 query 가능)
- 신규 entity 0 유지 (Stage 6-12 = 7 stage 연속)

### v3.1 변경 정리

| 측면 | v3 | v3.1 |
|---|---|---|
| TIER 2 처리 | meta.yml only | meta.yml + placeholder markdown 허용 |
| Context/token 안정성 | 절대 우선 | 우선 + citation 품질 balance |
| PDF raw read | 금지 | 금지 (unchanged) |
| Deep ingest 방식 | 외부 도구 의존 | chunk/page 근거 확보 권장 |

### Source Lake 통계 (Stage 12 post-v3.1)

- Raw PDF (총): 370+
- Normalized: 96+
- meta.yml: 96+
- markdown (full + placeholder + index): **91+** (Stage 12 v3.1 에서 +6)

## [2026-05-19] policy-update + crawl | fireblocks | Developer Docs webpage source × 3 seed (Stage 13)

- **Operating policy v3.2**: Webpage source 를 Source Lake 운영에 추가. PDF 와 동일 원칙 (lightweight index 우선, 본문 deep ingest 보류).
- **Seed URLs (3 webpage)**:
  - https://developers.fireblocks.com/docs/introduction (TIER 2, developer / platform overview)
  - https://developers.fireblocks.com/reference/api-overview (TIER 2, developer / API)
  - https://developers.fireblocks.com/reference/typescript-sdk (TIER 3, developer / SDK)
- **Crawl method**: WebFetch tool, in-body card 링크 + 인-text 링크만 추출. **Sidebar nav 미수집** (JS-rendered, WebFetch 한계).
- **Collected URLs**: 29 unique (15 /docs/ + 13 /reference/ + 1 special `/llms.txt`)
- **Stage**: 13 (Webpage source 도입 + v3.2 policy)

### Files

- `sources/fireblocks/webpages/developers/docs/introduction.meta.yml` (신규)
- `sources/fireblocks/webpages/developers/reference/typescript-sdk.meta.yml` (신규)
- `sources/fireblocks/webpages/developers/reference/api-overview.meta.yml` (신규)
- `sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__docs-introduction.md` (lightweight index)
- `sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__reference-api-overview.md` (lightweight index)
- `sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__reference-typescript-sdk.md` (catalog-only per user spec)
- `sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__sitemap.md` ★ — **29 URL catalog/sitemap**, 5-priority-domain cross-cut mapping 포함
- `prompts/operating-principles.md` — v3.2 §"Webpage Source" 절 추가

### Stage 13 Characteristic

- **PDF 본문 read 0건** (v3.1 유지)
- **webpage body deep ingest 0건** — meta + lightweight markdown only
- **신규 entity 0** — Stage 6/7/8/9/10/11/12/13 = **8 stage 연속 0**
- **수정 entity/hub 0** (본문 fact 없음)

### Sitemap 의 5-priority-domain Cross-cut Mapping

| URL | Domain | Wiki 보강 후보 |
|---|---|---|
| /docs/manage-api-keys | Identity-Auth | api-key entity / csr entity |
| /docs/overview | Workspace Mgmt | vault-account entity |
| /docs/workspace-environments | Workspace Mgmt | workspace entity (Q-W01 보강 후보) |
| /reference/create-vault-account | Workspace Mgmt | vault-account entity |
| /reference/create-transactions | Governance | transaction entity (API 측) |
| /reference/webhooks-overview | Security-Access | webhook plane (Stage 8) |
| /reference/configure-webhook-urls | Security-Access | webhook plane |
| /docs/define-aml-policies | Governance | policy entity / AML cluster |

### Promote 우선순위 (사용자 결정 후 진행)

1. **`https://developers.fireblocks.com/llms.txt`** ★ — LLM-friendly 전체 sitemap entry, 모든 후속 ingest 시작점 후보
2. `/docs/manage-api-keys` — api-key entity 보강
3. `/docs/workspace-environments` — Q-W01 본문 보강
4. `/reference/api-overview` 본문 — API surface entity 강화
5. `/reference/webhooks-overview` + `/reference/configure-webhook-urls` — Stage 8 webhook IP plane 보강

### Sidebar 미수집 한계

- WebFetch 의 모델이 client-rendered (JS) sidebar 를 보지 못함
- 전체 sitemap 수집 필요시 별도 도구:
  - `https://developers.fireblocks.com/llms.txt` 직접 fetch
  - browser automation (Playwright / Puppeteer)
  - sitemap.xml 검색

### v3.2 변경 정리

| 측면 | v3.1 | v3.2 |
|---|---|---|
| Source 종류 | PDF only | PDF + **Webpage** |
| 저장 구조 | sources/fireblocks/pdf/ + markdown/ | + sources/fireblocks/webpages/ |
| 본문 deep ingest | 외부 도구 의존 | 동일 |
| 크롤링 방법 | N/A | WebFetch (body deep ingest 금지, sidemap 추출 허용) |
| meta.yml 추가 필드 | - | `source_type` / `crawl_status` |

## [2026-05-19] catalog | fireblocks | AML/Compliance × 29 + Cold Wallet × 15 (Stage 14, A 단계)

- **A → B → C 순서 중 A 단계**: AML/Compliance + Cold Wallet cluster 를 catalog-first 처리 (v3.1/3.2.1 준수, 본문 deep ingest 0)
- **Source PDFs (44 rename + meta.yml + 10 markdown)**:
  - **AML/Compliance cluster (29)**:
    - TIER 1 lightweight index (4): compliance-integrations / aml-transaction-screening-and-monitoring / about-the-travel-rule / global-policy-ofac-sanctions-compliance
    - TIER 2 placeholder (16): AML/Travel Rule policies + screening ops + providers (Chainalysis/Elliptic/TRUST) + customer reference id + autofreeze + BYO screening
    - TIER 3 raw + meta (9): policy templates + UI ops (changing/deleting/disconnecting)
    - Cluster catalog: `aml-compliance-cluster-catalog.md`
  - **Cold Wallet cluster (15)**:
    - TIER 1 lightweight index (4): about-fireblocks-cold-wallet / cold-wallet-security-and-operational-best-practices / user-roles-for-cold-wallet-workspaces / cold-wallet-mobile-key-share-backup-and-recovery
    - TIER 2 placeholder (11): prerequisites + device requirements + console UX + workspace key backup + user/API ops + provisioning + signing + connect-via-P2P
    - Cluster catalog: `cold-wallet-cluster-catalog.md`
- **Stage**: 14 (A 단계 완료)

### Stage 14 Characteristic

- **PDF 본문 read 0건** (v3.1 strict 유지)
- 모든 markdown = lightweight index 또는 cluster catalog
- 본문 fact 추측 0
- **신규 entity 0** — Stage 6-14 = **9 stage 연속 0**
- **수정 entity/hub 0** (본문 미로드)

### Files Created

- **PDF rename**: 44 (29 AML + 15 Cold Wallet)
- **meta.yml**: 44
- **markdown**: 10 (2 cluster catalog + 8 TIER 1 lightweight index)

### 5-Priority-Domain Cross-Cut Mapping (식별)

**AML/Compliance cluster → Governance + Security-Access spine**:
- Compliance Integrations → [[vendors/fireblocks/compliance]] §"Provider plane" (Stage 9 Step 5b/5c 보강)
- AML Transaction Screening & Monitoring → **Q-S03 응답 후보** (Stage 6 unsolved)
- Global Policy OFAC → **새 spine 후보**: Customer Policy vs Fireblocks Global Policy 2 평면 분리
- Provider files (Chainalysis/Elliptic/TRUST) → Stage 9 14-step schematic 의 AML/Travel Rule Provider plane 본문 명세
- Customer Reference ID → [[entities/fireblocks/transaction]] §"Travel Rule fields"
- Autofreeze incoming tx → Stage 9 incoming Rejected pattern + [[vendors/fireblocks/risks]]

**Cold Wallet cluster → Workspace Mgmt + Security-Access + Mobile-Recovery 3중 spine**:
- About Fireblocks Cold Wallet → **Q-W01 보강 후보** (Cold variant 본문)
- User roles for Cold Wallet workspaces → **Q-G04 보강 후보** (Security Admin 멤버십 본문/표 불일치)
- Cold Wallet Mobile Key Share B&R → **MPC 모델 분명화** (Cold variant 의 share 분포 — 새 Q candidate)
- Cold Wallet Security & Ops BP → Stage 10 Risk-G07 (Cold Wallet approval group 미지원) 보강
- Cold Wallet ↔ Hot Wallet via P2P → [[entities/fireblocks/workspace]] §"Hot ↔ Cold rebalancing"

### Open Questions 응답 후보 (promote 시)

**기존 Q 의 본문 응답 후보**:
- Q-S03 (AML Transaction Screening Policy 동작) ← `aml-transaction-screening-and-monitoring` + `aml-transaction-screening-policy`
- Q-W01 보강 (Cold variant) ← `about-fireblocks-cold-wallet` + `prerequisites` + `device-requirements`
- Q-G04 보강 (Security Admin 멤버십 본문/표 불일치) ← `user-roles-for-cold-wallet-workspaces`

**새 Q candidate (Stage 14 식별)**:
- Customer Policy vs Fireblocks Global Policy 의 hierarchy + bypass 가능성 (← `global-policy-ofac-sanctions-compliance`)
- Cold Wallet 의 MPC share 분포가 Hot 과 동일한가? (← `cold-wallet-mobile-key-share-backup-and-recovery` + `cold-wallet-device-requirements`)
- Cold ↔ Hot rebalancing 의 governance approval flow (← `connecting-cold-wallet-with-hot-workspaces-via-p2p`)
- AML/Travel Rule provider 의 fail-on-unknown vs pass-on-unknown workspace default (Stage 9 Vault Structure BP 의 multi-workspace 6 trigger 중 "different AML defaults" 와 cross-cut)

### Promote 우선순위 (사용자 결정 후)

**AML/Compliance**:
1. `compliance-integrations` (entry hub)
2. `aml-transaction-screening-and-monitoring` (Q-S03)
3. `global-policy-ofac-sanctions-compliance` (새 spine: Global vs Customer Policy)
4. `about-the-travel-rule` (Travel Rule plane)
5. `customer-reference-id` (Travel Rule 의 운영 영향 큰 필드)

**Cold Wallet**:
1. `about-fireblocks-cold-wallet` (entry)
2. `user-roles-for-cold-wallet-workspaces` (Q-G04)
3. `cold-wallet-mobile-key-share-backup-and-recovery` (MPC 모델 분명화)
4. `cold-wallet-security-and-operational-best-practices` (Risk-G07)
5. `connecting-cold-wallet-with-hot-workspaces-via-p2p` (Cold ↔ Hot)

### Source Lake 통계 (Stage 14 post)

- Raw PDF (총): 370+
- Normalized: **140+** (Stage 14 +44 rename = ~96 → ~140)
- meta.yml: **140+**
- markdown (full + placeholder + index + catalog): **101+** (Stage 14 +10)

### Next: B → llms.txt fetch, C → Curated Wiki health check

---

## Stage 15 (2026-05-19) — B 단계: llms.txt URL inventory (no-body-load pipeline)

### Trigger
사용자 요청 (이전 turn 의 fetch 실패 후): "llms.txt WebFetch 전체 로드 중단. 오류: Request too large (max 32MB). 1. llms.txt 전체 본문 로드 금지 2. curl/wget 으로 파일 저장만 3. line-based / chunk-based 처리 4. head / grep / split 으로 URL만 추출 5. 전체 내용 context 미로드". 보고 범위: URL 개수 + docs/reference 분포 + 5 priority domain cross-cut + promote 후보.

### Approach (v3.2.2 신규 규칙 확립)
- WebFetch 사용 금지 (대형 파일 한계 + context token 보호)
- `curl -L` 로 파일 저장만 (이미 로컬 저장 완료: 141,106 bytes / 709 lines)
- bash pipeline 으로 URL inventory 추출:
  - `grep -Eo` → URL 만
  - `sort -u` → dedupe
  - `grep -E /docs/|/reference/|/api-reference/` → filtered
  - `uniq -c | sort -rn` → 분포 카운트만 context 로
- 본문 line 은 context 로 절대 가져오지 않음

### Source files (on-disk, no LLM read)
| File | size |
|---|---|
| `sources/fireblocks/webpages/developers/llms.txt` | 141,106 bytes / 709 lines |
| `sources/fireblocks/webpages/developers/llms-urls.txt` | 716 lines (unique URLs) |
| `sources/fireblocks/webpages/developers/llms-docs-reference-urls.txt` | 714 lines |

### URL Inventory (716 unique)

| Path prefix | count |
|---|---:|
| `/api-reference/` | **419** |
| `/reference/` | **166** |
| `/docs/` | **129** (121 unique slugs) |
| `/openapi/` | 1 |

→ 기존 sitemap (29 URLs, in-body card 추출) 대비 **716 URLs (24.7배)** — full sitemap 확보.

### Top api-reference tag groups (★ 5 priority domain cross-cut)

| Group | endpoints | Cross-cut |
|---|---:|---|
| `compliance` | 36 | Stage 14 AML cluster ★ |
| `vaults` | 35 | Workspace-Management ★ |
| `trlink` | 28 | Stage 14 Travel Rule |
| `tokenization` | 24 | (별도 product) |
| `webhooks-v2` | 15 | Stage 8 webhook plane ★ |
| `transactions` | 13 | Governance ★ |
| `cosigners-beta` | 10 | Stage 8 cosigner plane ★ |
| `policy-editor-beta` + `policy-editor-v2-beta` | 9 | Stage 10 Policy ★ |
| `admin-quorum` | 1 | Stage 10 Admin Quorum spine ★ |
| `whitelist-ip-addresses` | 1 | Security-Access ★ |
| `audit-logs` | 1 | Security-Access ★ |
| `workspace` + `workspace-status-beta` | 3 | Workspace-Management ★ |
| `users` + `user-groups-beta` + `console-user` + `api-user` | 10 | Identity-Auth ★ |

### 5 Priority Domain promote candidates (/docs/)

- **Governance** (7): define-approval-quorums, define-confirmation-policy, define-aml-policies, define-travel-rule-policies, set-transaction-authorization-policy, integrating-third-party-aml-providers + admin-quorum API
- **Identity-Authentication** (11): manage-api-keys, generate-a-csr-for-an-api-user, whitelist-ips-for-api-keys, cli-authentication, cosigner-architecture-overview, multiple-cosigners-high-availability, use-cosigners-for-signing-automation, associating-end-clients-with-transactions
- **Workspace-Management**: workspace-environments (Q-W01 직접 보강), overview (vault accounts)
- **Mobile-Recovery** (4): backup-and-recovery-overview, embedded-wallet-backup-and-recovery, embedded-wallet-disaster-recovery, embedded-wallet-mpc-key-generation
- **Security-Access** (5): raw-signing, whitelist-addresses, whitelist-ips-for-api-keys, co-signer-security-checklist-defense-monitoring + webhook v2 API

### Top Promote Candidates (사용자 결정 후 진행)

**TIER 1 후보 (5)**:
1. `/docs/define-approval-quorums` — Stage 10 Admin Quorum spine 직접 보강
2. `/docs/manage-api-keys` — Stage 4 api-key entity Q 응답
3. `/docs/cosigner-architecture-overview` — Stage 8 cosigner plane 본문 보강
4. `/docs/workspace-environments` — Stage 9 Q-W01 (Mainnet/Testnet) 응답
5. `/docs/co-signer-security-checklist-defense-monitoring` — Stage 8 의 webhook + cosigner security cross-cut

**TIER 2 placeholder 후보 (5)**:
6. `/docs/embedded-wallet-mpc-key-generation` — MPC 모델 (Cold Wallet 비교)
7. `/docs/set-transaction-authorization-policy` — TAP
8. `/docs/define-travel-rule-policies` — Stage 14 Travel Rule
9. `/docs/raw-signing` — Stage 12 raw-signing 보강
10. `/docs/integrating-third-party-aml-providers` — Stage 14 AML providers

### Outputs

- **새 sitemap markdown** (full inventory):
  - `sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__llms-txt-sitemap.md`
- **기존 sitemap markdown** 에 SUPERSEDED 표시:
  - `sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__sitemap.md`
- **operating-principles.md v3.2.2** — 대형 텍스트 파일 처리 규칙 (curl 저장 + bash pipeline + 본문 미로드)

### Entity count (Stage 15)
- 신규 entity: **0** (catalog only)
- Stage 6-15 = **10 stage 연속 0** (entity minimization discipline 유지)

### Operating Principles 강화
- **v3.2.2** 추가: 대형 텍스트 파일 (llms.txt, sitemap.xml, 100 KB+ markdown / json) 본문 LLM 미로드, bash pipeline 으로 file-level 처리, 분포/카운트만 context 로 가져옴
- WebFetch 32 MB 한계 + context token 보호 cross-cut

### Source Lake 통계 (Stage 15 post)

- Raw PDF: 370+ (unchanged)
- Normalized: 140+ (unchanged)
- meta.yml: 140+ (unchanged)
- markdown: **102+** (Stage 15 +1: llms-txt-sitemap)
- developer webpages: 5 markdown + 3 meta.yml + 3 local files (llms.txt + 2 derived URL lists)
- **새 catalog scale**: 716 URLs available for selective promote

### Next: C 단계 — Curated Wiki health check / lint

---

## Stage 16 (2026-05-19) — C 단계: Curated Wiki health check + P1/P2/P3 patches

### Trigger
사용자 요청: "권장 순서대로 진행. P2 → P3 (broken wikilink) → P1 (Q status sync). 현재는 신규 ingest 보다 relationship integrity / Open Question consistency / knowledge hygiene 우선. 특히: Summary ↔ Detail drift 제거, ANSWERED Q 의 cite/owning hub 연결, stale forward-link 제거."

### Health Check 결과 (요약)
- **Critical**: Open Q status mismatch 15 건 + Broken wikilink 3 건
- **Warning**: ingest-pdf.md v3.2.2 stale / policy-engine + tap stub / Stage 11–15 미반영 / audit-log + FSPM owning hub 미명시
- **Cleanup**: section title stale / vendor-entity stem 중복 README 부재 / Source markdown status 표기 비일관
- **No action**: orphan 0 / entity-min discipline 구조적 건전

### P2 / P3 — Broken wikilink 정리 (완료)

| 깨진 링크 | 사용처 | 변경 |
|---|---|---|
| `[[entities/fireblocks/audit-log]]` | [entities/fireblocks/user-roles/security-auditor.md](entities/fireblocks/user-roles/security-auditor.md) | → `[[vendors/fireblocks/security]] §"Stage 8 — Audit Log 정식 명세"` (audit-log entity 미생성 정책 명시) |
| `[[entities/fireblocks/fspm]]` | security-auditor.md + [entities/fireblocks/user-roles/security-admin.md](entities/fireblocks/user-roles/security-admin.md) | → `[[vendors/fireblocks/security]] §"FSPM"` (FSPM entity 미생성 정책 명시) |
| `[[vendors/fireblocks/governance]]` | [vendors/fireblocks/lifecycle-events.md:56](vendors/fireblocks/lifecycle-events.md#L56) | → `[[entities/fireblocks/user-roles/owner]] / [[vendors/fireblocks/user-management]] §"Transfer Owner"` (governance hub 부재 사실 반영) |

→ **Broken wikilink 0 건** (재검증 완료).

### P1 — ANSWERED Q status sync (완료)

[open-questions/fireblocks.md](open-questions/fireblocks.md) 의 detail status 를 Summary (Stage 2–10 누적) 와 정합.

| Q-ID | Before | After | Hub/Entity cite 추가 |
|---|---|---|---|
| Q-G01 | open | **answered (Stage 10)** | [[entities/fireblocks/admin-quorum]] §"Threshold 정책" |
| Q-G03 | partial (Stage 6) | **answered (Stage 10)** (Stage 6 partial 보존) | [[entities/fireblocks/approval-group]] §"4 UI Categories" |
| Q-G04 | open | **answered (Stage 10)** | [[entities/fireblocks/admin-quorum]] §"멤버십 — role-based" |
| Q-L06 | open | **answered (Stage 10)** | [[entities/fireblocks/approval-group]] §"12 actions + 5 Owner-mandatory" |
| Q-M01 | open | **answered (Stage 8)** | [[entities/fireblocks/mpc-key-share]] + [[vendors/fireblocks/mpc]] |
| Q-M02 | open | **answered (Stage 8)** | [[entities/fireblocks/sandbox-workspace]] + [[vendors/fireblocks/mpc]] |
| Q-M03 | partial (Stage 5) | **answered (Stage 8)** (Stage 5 보존) | [[entities/fireblocks/mpc-key-share]] §"3-endpoint distribution" |
| Q-D04 | open | **answered (Stage 8)** | [[entities/fireblocks/mpc-key-share]] §"Threshold rule + Cloud backup" |
| Q-W01 | open | **answered (Stage 9)** | [[entities/fireblocks/workspace]] §"Hot/Cold ⊥ Mainnet/Testnet" |
| Q-A05 | open | **answered (Stage 8)** | [[entities/fireblocks/api-co-signer]] §"SGX baseline" |
| Q-A07 | partial (Stage 6) | **answered (Stage 8)** (Stage 6 보존) | [[vendors/fireblocks/security]] §"Stage 8 — Audit Log 정식 명세" |
| Q-AU04 | partial (Stage 5) | **answered (Stage 8)** (Stage 5 보존) | [[entities/fireblocks/2fa]] §"Yubikey 5 NFC" |
| Q-S02 | open | **answered (Stage 10)** | [[entities/fireblocks/policy]] §"DCCP" |
| Q-S07 | open | **answered (Stage 10)** | [[vendors/fireblocks/security]] §"FSPM" (entity 미생성 명시) |
| Q-S08 | open | **answered (Stage 9)** | [[vendors/fireblocks/architecture]] §"Azure module 책임" |
| Q-P01 | open | **partial answered (Stage 10)** | [[entities/fireblocks/policy]] §"Policy 2-component + 3 action + 5 default" |
| Q-P02 | open | **partial answered (Stage 9)** | [[entities/fireblocks/transaction]] §"chain-specific 처리 모델" |
| Q-S13 | open | **partial answered (Stage 10)** | [[entities/fireblocks/user-roles/security-auditor]] §"FSPM Access Plane" |

→ **Status drift 0 건** (22 Q 전수 재검증 완료).

### 부수 변경
- Section title: `## Stage 8 누적 ANSWERED 상태` → `## 누적 ANSWERED 상태 (Stage 2–10)` + Stage 11–15 catalog-only 명시 (Cleanup P8)
- audit-log / FSPM 의 owning hub = [[vendors/fireblocks/security]] 명시 (entity-min discipline 사유) — Warning W-4 의 owning section 결정

### 남은 patches (deferred — 사용자 결정 대기)
- **P4** (ingest-pdf.md v3.2.2 align)
- **P5** (policy-engine + tap stub 정리 or redirect)
- **P6** (Stage 11–15 summary + 새 Q candidate 4 건 등록)
- **P7** (security/compliance/user-management hub 의 audit-log / FSPM section anchor 명시)
- **P8** (✓ 부분 완료 — Stage 11–15 catalog-only 1 줄만 추가)
- **P9** (llm-wiki.md 의 vendor-entity stem 중복 룰 한 단락 추가)
- **P10** (Source markdown status 표기 정규화, 96 파일 영향)

### Entity count (Stage 16)
- 신규 entity: **0**
- Stage 6–16 = **11 stage 연속 0** (entity minimization discipline 유지)

### Source Lake 통계 (Stage 16 post)
- Raw PDF: 370+ (unchanged)
- Normalized: 140+ (unchanged)
- meta.yml: 140+ (unchanged)
- markdown: 102+ (unchanged)
- Curated Wiki: 16 hubs + 24 entities + 9 user-roles + 1 open-questions = **50 markdowns**
- **모든 wikilink valid** + **모든 ANSWERED Q detail status synced**

### Next: P4–P10 deferred. 사용자 결정 후 진행.

---

## Stage 17 (2026-05-19) — P4 + P6 + P7 maintenance batch

### Trigger
사용자 요청: "P4 → P6 → P7 순서. ingest-pdf.md 를 v3.2.2 운영 현실과 정합 + Open Questions 를 future promote/retrieval layer 로 유지. 신규 지식 생성 < knowledge maintenance / retrieval consistency / promote readiness."

### P4 — `prompts/ingest-pdf.md` v3.2.2 align (완료)

[prompts/ingest-pdf.md](prompts/ingest-pdf.md) 를 v1 → v3.2.2 전면 재작성. 핵심 변경:

- **처리 모드 3 분기 도입**:
  - **Mode A (catalog-only)**: TIER 3 또는 cluster (>10 file batch) — rename + meta.yml + cluster-catalog. 본문 미로드.
  - **Mode B (lightweight-index)**: TIER 1 후보 + 본문 deep ingest 결정 보류 — filename + URL + tier + cross-cut signal. 본문 fact 추측 금지.
  - **Mode C (full ingest)**: 사용자 promote 후만 — 외부 도구 chunked extraction → markdown chunk read.
- **PDF/webpage 직접 Read tool 호출 금지** 명시
- **대형 텍스트 파일 (llms.txt 등) 처리** = `operating-principles.md` §"대형 텍스트 파일 처리" 참조
- **Entity 최소화 (Stage 6–16 = 11 연속 0)** 의 점검 항목 명시 — 신규 entity 생성 전 hub section 흡수 가능성 우선 확인
- **출력 규약 모든 모드 통일**: 1–4 보고 → 승인 → 5 수정 → 6 log entry

→ Stage 1–7 의 full-read 패턴이 Stage 8+ 의 lazy-load / catalog-first 패턴과 충돌하던 stale state 해소.

### P6 — Stage 11–15 summary + 4 신규 Q candidates 등록 (완료)

#### Stage 11–17 summary 추가
[open-questions/fireblocks.md](open-questions/fireblocks.md) Summary 에 7 줄 추가:
- Stage 11 (Tokenization 33 PDF) / Stage 12 (Backup-Recovery 22 + v3 policy 채택) / Stage 13 (Webpage source + v3.2.1) / Stage 14 (AML+Cold Wallet cluster + 4 신규 Q 식별) / Stage 15 (llms.txt + v3.2.2) / Stage 16 (health check + P1/P2/P3) / Stage 17 (P4/P6/P7).
- 모든 stage 에서 ANSWERED 0건 + 신규 entity 0건 명시
- 카테고리 분류 위치 정리

#### 신규 Q 4건 등록 ([open-questions/fireblocks.md](open-questions/fireblocks.md#stage-14-신규-open-questions-cluster-catalog-식별-body-less))

| Q-ID | 제목 | Cluster | Where |
|---|---|---|---|
| **Q-2026-05-19-G05** | Customer Policy vs Fireblocks Global Policy hierarchy + bypass 가능성 | Stage 14 AML | policy / compliance / risks |
| **Q-2026-05-19-M05** | Cold Wallet 의 MPC share 분포가 Hot Wallet 과 동일한가? | Stage 14 Cold Wallet | mpc-key-share / mpc / workspace |
| **Q-2026-05-19-G06** | Cold ↔ Hot rebalancing 의 governance approval flow | Stage 14 Cold Wallet | workspace / admin-quorum / transaction / risks |
| **Q-2026-05-19-S15** | AML/Travel Rule provider 의 fail-on-unknown vs pass-on-unknown workspace default | Stage 14 AML | policy / compliance / workspace |

각 Q 에:
- Why it matters + Where this came up + Sources to check + Hypotheses (unverified) + Status (open) + Cluster + Related Q
- **본문 fact 추측 없이 등록** (catalog cross-cut signal 만)
- promote 시점에 catalog 의 TIER 1 lightweight index 본문 읽고 응답

#### Stage 11–15 Catalog Sources 절 추가
Source Lake 의 catalog/index 위치를 wikilink 로 명시 — promote 시 retrieval 용도.

### P7 — Hub anchor 확정 (완료)

P2/P3 의 redirect 가 가리키는 anchor 들이 실제로 존재하는지 확인 + 누락된 anchor 1건 추가:

| Anchor | 파일 | 상태 |
|---|---|---|
| `vendors/fireblocks/security.md` §"Stage 8 — Audit Log 정식 명세" | line 175 | ✓ 기존 존재 |
| `vendors/fireblocks/security.md` §"FSPM (Fireblocks Security Posture Management)" | line 294 | ✓ 기존 존재 |
| `vendors/fireblocks/compliance.md` §"Audit Log 흐름 (Stage 6 통합)" | line 28 | ✓ 기존 존재 |
| `vendors/fireblocks/compliance.md` §"FSPM (cross-ref)" | line 50 | ✓ 기존 존재 |
| **`vendors/fireblocks/user-management.md` §"Transfer Owner"** | line 62 | **★ 추가** (P3 redirect target) |

[vendors/fireblocks/user-management.md](vendors/fireblocks/user-management.md) 에 `### Transfer Owner` subsection 추가:
- transfer-workspace-owner.md (Stage 3) 본문 인용 — 현 Owner 참여 가능 / 부재 두 경로
- [[entities/fireblocks/user-roles/owner]] §"Transfer Owner" + [[vendors/fireblocks/lifecycle-events]] cross-cut
- Q-O02 / Q-O03 (board resolution 형식 요건) 의 owning anchor 역할

### 최종 검증
- **Broken wikilink 0건** (전수 재검증)
- **신규 Q 4건 모두 detail 등록 + Sources 라벨링**
- **모든 P7 anchor 존재 확인**

### Entity / Q count (Stage 17 post)
- 신규 entity: **0** (Stage 6–17 = **12 stage 연속 0**)
- 신규 Q: **+4** (Stage 14 catalog 식별분, Stage 17 에서 정식 등록)
- 누적 Q: 47 → 51 (Q-G02/G03/G04 etc. 22 ANSWERED, 4 partial, 25 open)

### Source Lake 통계 (unchanged)
- Raw PDF: 370+ / Normalized: 140+ / meta.yml: 140+ / markdown: 102+ / Curated Wiki: 50 markdowns

### 남은 deferred patches
- **P5**: policy-engine + tap stub 정리 or redirect (15분) — vendor hub 측 governance 영역 보강 시점에
- **P9**: llm-wiki.md / README.md 의 vendor-entity stem 중복 룰 한 단락 추가 (5분)
- **P10**: Source markdown status 표기 정규화 (96 파일 영향, optional)

### Next: 사용자 결정 대기. **retrieval-ready 상태**:
- Open Q 51 건 (22 ANSWERED + 4 partial + 25 open) — 모두 owning entity/hub wikilink + 출처 cite
- 4 신규 Q (G05/M05/G06/S15) 는 Stage 14 cluster catalog + TIER 1 lightweight index 8건과 연결 — promote 시점에 즉시 응답 가능
- ingest-pdf.md 가 v3.2.2 운영 모드 (catalog-only / lightweight-index / full ingest) 분기를 명시 — 사용자 promote 결정 패턴 통일

---

## Stage 18 (2026-05-19) — Key Link cluster lightweight ingest (Mode B)

### Trigger
사용자 요청 (Option B): "Key Link 3 PDF cluster 처리 — body 미로드, lightweight index 중심, cross-cut signal 확보, promote readiness 확보, 신규 entity 생성 금지. signing key plane / validation key plane / customer-held key architecture / MPC plane boundary 를 future promote signal 로 명시. Trust model / signing flow / chain support 는 본문 ingest 전까지 hypothesis 수준 유지."

### 처리 모드
**Mode B (lightweight-index)** per [prompts/ingest-pdf.md](prompts/ingest-pdf.md) v3.2.2 — Source Lake hygiene (rename + meta.yml) + 3 TIER 1 lightweight index + 1 cluster catalog. PDF body 미로드.

### Source Lake hygiene (3 PDF normalized)

| Before | After |
|---|---|
| `Fireblocks Key Link Overview – Fireblocks Help Center.pdf` | `2026-05-19__support-fireblocks-io__fireblocks-key-link-overview.pdf` + `.meta.yml` |
| `Getting started with Fireblocks Key Link – Fireblocks Help Center.pdf` | `2026-05-19__support-fireblocks-io__getting-started-with-fireblocks-key-link.pdf` + `.meta.yml` |
| `Set up your Fireblocks Vault with Key Link – Fireblocks Help Center.pdf` | `2026-05-19__support-fireblocks-io__set-up-your-fireblocks-vault-with-key-link.pdf` + `.meta.yml` |

각 meta.yml 에 `url_status: inferred` 명시 (slug 기반 추정, 실 article ID 미확인).

### Lightweight Index 4건 신규

| File | 역할 |
|---|---|
| `2026-05-19__support-fireblocks-io__fireblocks-key-link-overview.md` | Entry hub — MPC plane boundary 정의 |
| `2026-05-19__support-fireblocks-io__getting-started-with-fireblocks-key-link.md` | Onboarding workflow |
| `2026-05-19__support-fireblocks-io__set-up-your-fireblocks-vault-with-key-link.md` | Vault Account 결합 패턴 |
| `2026-05-19__support-fireblocks-io__key-link-cluster-catalog.md` | Cluster catalog + hypothesis 통합 + Q candidate 예약 |

### Cross-cut Signal 식별 (★ future promote signal)

본 cluster 에서 catalog-level 로 식별한 4 plane (모두 catalog cross-cut, body 미로드):

1. **Signing Key Plane** — customer-held private signing key 등록·관리 (Stage 15 API 의 4 endpoint)
2. **Validation Key Plane** — Fireblocks-side signature 검증용 public key 관리 (Stage 15 API 의 4 endpoint)
3. **Customer-Held Key Architecture** — Fireblocks 가 키 보유 안 함 + keyId↔user 매핑 (Stage 15 API 의 `set-agent-user-id`)
4. **MPC Plane 과의 Boundary** — Stage 8 의 MPC-CMP 3-share 모델과 직교하는 별도 plane 가능성 (★ 최우선 promote signal)

### Hypothesis 5건 (★ Unverified — body 미로드)

| H | Hypothesis |
|---|---|
| H1 | Key Link = customer-held signing key (HSM / cold storage / external custodian) 통합 plane. Fireblocks 가 MPC share 보유 안 함 |
| H2 | Asymmetric key pair (customer-private signing + Fireblocks-side validation) |
| H3 | Vault Account-level 격리 (MPC + Key Link 혼재 불가) |
| H4 | Beta state — production governance plane 일부 미지원 가능성 |
| H5 | 외부 co-signer 패턴 signing flow (Fireblocks → customer endpoint → sign → return) |

모든 hypothesis 는 promote (Mode C) 전까지 **fact 화 금지**.

### New Q Candidates (★ promote 시 정식 등록)

Cluster catalog 에 6 ID 예약 (Mode B 단계 등록 보류):

| Q-ID 예약 | 우선순위 |
|---|---|
| Q-2026-05-19-M06 (signing flow vs MPC) | ★ |
| Q-2026-05-19-W03 (Vault Account asset-level 격리) | ★ |
| Q-2026-05-19-G07 (governance plane 적용 범위) | ★ |
| Q-2026-05-19-S16 (Beta state 리스크) | ★ |
| Q-2026-05-19-AU06 (authentication ↔ keyId 매핑) | medium |
| Q-2026-05-19-A08 (chain support 매트릭스) | medium |

### Curated Wiki 영향
- **수정 0 건** — Mode B 정책 준수 (entity/hub 수정은 Mode C promote 후만)
- 보강 후보 hub/entity 는 cluster catalog 의 Cross-Cut Mapping 절에 wikilink 로 catalog
- 신규 entity: **0** (Stage 6–18 = **13 stage 연속 0**)

### Entity-min discipline 검증
Cluster catalog 가 새 plane 후보 ("customer-held key plane") 식별. 본문 ingest 후 신규 entity 생성 유혹 발생 가능성에 대해 **사전 mitigation**:
- 새 plane 이 [[entities/fireblocks/mpc-key-share]] entity scope 의 generalization 으로 흡수 가능한가?
- [[entities/fireblocks/vault-account]] §"Key Link variant" 로 처리 가능한가?
- [[vendors/fireblocks/architecture]] §"Customer-held key plane" hub section 으로 owning 가능한가?
- 위 3 옵션 모두 unfit 일 때만 신규 entity 생성 (Stage 11–17 의 entity-min 기준 유지)

→ Mode C promote 시점에 entity scope 결정 우선 — body fact 확인 후 hub section 흡수 가능성 먼저 검증.

### Source Lake 통계 (Stage 18 post)
- Raw PDF: 370+ (rename 3건 — 같은 file count)
- Normalized: 140+ → **143+** (+3 Key Link)
- meta.yml: 140+ → **143+** (+3 Key Link)
- markdown: 102+ → **106+** (+4: 3 lightweight index + 1 cluster catalog)
- Curated Wiki: 50 markdowns (unchanged)

### Next
- Mode B 완료. Mode C promote 진행 여부는 사용자 결정.
- Promote 진행 시 외부 도구로 3 PDF body chunked text 추출 → 사용자 제공 → Open Q 6건 정식 등록 + entity/hub 보강.
- Cluster catalog 가 retrieval-ready 상태 — 본 cluster 의 cross-cut signal 은 향후 [[entities/fireblocks/mpc-key-share]] / [[vendors/fireblocks/architecture]] 보강 시 즉시 참조 가능.

---

## Stage 19 (2026-05-19) — AWS Nitro Co-signer cluster lightweight ingest + retrieval correction (Mode B)

### Trigger
사용자 retrieval 질문 ("cosigner aws 환경에서 세팅"). 이전 답변 (Stage 18 직후 turn) 이 일반 클라우드 지식 ("AWS SGX 지원 제한적") 을 Fireblocks 공식 근거와 혼합하여 잘못된 recommendation 도출 → catalog 전수 재검색 → AWS Nitro Enclaves 공식 지원 evidence 다수 발견 → 정정 + Mode B 처리.

### 결정적 evidence (이전 잘못 판단의 catalog 출처)

**Source Lake (renamed 안 됐던 raw PDF)**:
- `AWS Nitro CloudFormation Solution for Fireblocks Co-Signer – Fireblocks Help Center.pdf` ← 핵심 evidence
- `API Co-signer overview and usage – Fireblocks Help Center.pdf`
- `The Co-signer management tab – Fireblocks Help Center.pdf`

**Stage 15 llms.txt catalog — AWS-specific 4 URL + 3-way TEE plane 분기**:
- AWS Nitro: 4 dedicated URLs (`/docs/aws-nitro-api-co-signer`, install/maintenance/versions 별도)
- Intel SGX (Azure / on-prem): 3 dedicated URLs (`/docs/intel-sgx-api-co-signer`, maintenance/versions)
- GCP Confidential Space: 3 dedicated URLs (`/docs/gcp-confidential-space-api-co-signer`, maintenance/versions)
- 추가 install cloud: Azure Marketplace / Alibaba / IBM / On-prem (총 7 cloud install matrix)

### Evidence isolation 룰 위반 사례 (memory 저장)
[/Users/mob.bit/.claude/projects/-Users-mob-bit-Workspace-waas-wiki/memory/feedback_evidence_isolation.md](file:///Users/mob.bit/.claude/projects/-Users-mob-bit-Workspace-waas-wiki/memory/feedback_evidence_isolation.md) 저장:
- Fireblocks 공식 근거 vs LLM 일반 지식 절대 혼합 금지
- "wiki 에 없음" 결론은 4 source 전수 검색 후만 (curated / raw PDF / markdown / Stage 15 sitemap)
- catalog-only 문서도 evidence 로 취급

### 처리 모드
**Mode B (lightweight-index)** per [prompts/ingest-pdf.md](prompts/ingest-pdf.md) v3.2.2 — body 미로드 + lightweight markdown + cluster catalog.

### Source Lake hygiene (3 PDF normalized)

| Before | After |
|---|---|
| `AWS Nitro CloudFormation Solution for Fireblocks Co-Signer.pdf` | `2026-05-19__support-fireblocks-io__aws-nitro-cloudformation-solution-for-fireblocks-co-signer.pdf` + `.meta.yml` |
| `API Co-signer overview and usage.pdf` | `2026-05-19__support-fireblocks-io__api-co-signer-overview-and-usage.pdf` + `.meta.yml` |
| `The Co-signer management tab.pdf` | `2026-05-19__support-fireblocks-io__the-co-signer-management-tab.pdf` + `.meta.yml` |

각 meta.yml 에 `url_status: inferred`.

### Lightweight Index 4건 신규

| File | 역할 |
|---|---|
| `aws-nitro-cloudformation-solution-for-fireblocks-co-signer.md` | AWS 설치 진입점, CloudFormation 운영 신호 |
| `api-co-signer-overview-and-usage.md` | API Co-signer 전반 overview + usage pattern |
| `the-co-signer-management-tab.md` | Management UI + cosigners-beta API 매핑 + Q-A02 응답 후보 |
| `aws-nitro-cluster-catalog.md` | Cluster 통합 + 3-way TEE plane + 11 common URL cross-link + supersede note |

### Future Promote Signal 5건 (★ 사용자 명시)

1. **AWS Nitro customer-cloud deployment** — CloudFormation parameter / instance type / IAM / VPC
2. **Co-signer management plane** — cosigners-beta API ↔ UI mapping + governance approval
3. **Callback Handler auth** — Q-A04 + Q-C01 응답
4. **HA topology** — 다중 Co-signer / multi-region 배포
5. **TEE boundary** — Nitro / SGX / Confidential Space 간 trust 모델 등가성

### 3-way TEE Plane 명시 (Stage 19 신규 retrieval signal)

Customer cloud 옵션이 cloud-agnostic 추상이라는 Stage 8 명제를 **TEE 기술 분기 매트릭스** 로 확장:

| TEE | 환경 | Install URL | Maintenance | Version |
|---|---|---|---|---|
| AWS Nitro Enclaves | AWS | install-api-cosigner-aws | maintenance-aws-nitro | versions-aws |
| Intel SGX | Azure / Marketplace / on-prem | install-api-cosigner-azure (+marketplace, +onprem) | maintenance-sgx | versions-sgx |
| GCP Confidential Space | GCP | install-api-cosigner-gcp | maintenance-gcp-confspace | versions-gcp |

→ retrieval layer 에 "customer cloud = 3 TEE plane 분기" 사실 등록 (cluster catalog).

### Hypothesis 5건 + Q candidate 5건 예약 (Mode C promote 시 정식 등록)

| Q-ID 예약 | 우선순위 |
|---|---|
| Q-2026-05-19-C03 (3 TEE 등가성) | ★ |
| Q-2026-05-19-A09 (AWS Nitro CFN prerequisites) | ★ |
| Q-2026-05-19-S17 (Nitro attestation ↔ chain of trust) | ★ |
| Q-2026-05-19-G08 (Co-signer governance actions) | ★ |
| Q-2026-05-19-A10 (cosigners-beta payload schema) | medium |
| Q-A02 (기존) → 응답 후보 | (기존 Q 응답 evidence) |

### Curated Wiki 영향
- **수정 0건** — Mode B 정책 (entity/hub 수정은 Mode C promote 후만)
- 보강 후보 hub/entity 는 cluster catalog 의 Cross-Cut Mapping 절에 wikilink 로 catalog 등록
- 신규 entity: **0** (Stage 6–19 = **14 stage 연속 0**)

### Retrieval correction note (★ cluster catalog 의 Architecture Note 절)
"AWS 의 SGX 지원이 제한적이라 Azure / Mobile / On-prem 권장" 같은 일반 클라우드 지식 기반 추천은 **잘못됨** — Fireblocks 가 AWS Nitro Enclaves 를 1st-class TEE 환경으로 공식 지원하므로 AWS 는 customer-cloud Co-signer 의 valid first choice. 본 cluster catalog 가 AWS-관련 Co-signer 질문의 truth source — 외부 일반 지식 적용 금지.

### Source Lake 통계 (Stage 19 post)
- Raw PDF: 370+ (rename 3건)
- Normalized: 143+ → **146+** (+3)
- meta.yml: 143+ → **146+** (+3)
- markdown: 106+ → **110+** (+4: 3 lightweight index + 1 cluster catalog)
- Curated Wiki: 50 markdowns (unchanged)

### Next
- Mode B 완료. Mode C promote 진행 여부는 사용자 결정.
- 1순위 promote 후보: `aws-nitro-cloudformation-solution.pdf` + `/docs/cosigner-architecture-overview` (Stage 13 식별) — AWS 설치 + 3 TEE 명세 동시 응답 가능.

---

## Stage 20 (2026-05-19) — Retrieval Loop MVP (P1 + P3)

### Trigger
사용자 결정 (이전 design proposal 후): P1 + P3 MVP 부터 진행. Q1-Q7 설정 확정 — rule-based + hybrid eval + entity/hub/cluster scope + draft-only Source automation + on-demand refresh + Python + PASS≥70% / FAIL+PROMOTE≤20% target.

### Goal
- 사용자 질문 자동 생성
- retrieval 품질 visibility 확보
- retrieval gap 발견 (예비 — gap detector 는 P4)

### 신규 파일 (5)

| File | LOC | 역할 |
|---|---|---|
| [scripts/lib/wiki_scanner.py](scripts/lib/wiki_scanner.py) | ~200 | Curated Wiki + Source Lake parsing (body 미로드 정합) |
| [scripts/generate_questions.py](scripts/generate_questions.py) | ~250 | Rule-based question bank 생성 (6 question types) |
| [scripts/retrieval_eval.py](scripts/retrieval_eval.py) | ~250 | Predicted retrievability 분류 + Q7 target check |
| [scripts/README.md](scripts/README.md) | updated | Active + planned scripts |
| [tests/README.md](tests/README.md) | new | Loop usage guide |

### 출력 파일 (4, auto-generated)

```
tests/questions/question-bank.yml        # 108 questions, 정형 metadata
tests/questions/generated-questions.md   # 사람 읽기용 view
tests/retrieval/retrieval-eval.yml       # 분류 결과 + rates + Q7 target
tests/retrieval/retrieval-eval.md        # 사람 읽기용 분류 표
```

### Question Bank — 108 questions (Stage 20 첫 generation)

| Type | Count | 생성 방식 |
|---|---:|---|
| definition | 32 | entity 당 1개 (rule_based:entity_def) |
| workflow | 20 | hub 당 1개 (rule_based:hub_workflow) |
| comparison | 5 | predefined pair (rule_based:entity_pair) |
| verification | 51 | open + partial Q 당 1개 (rule_based:open_q_verify) |

각 question metadata: id / answer_type / difficulty / generator / source_seed / expected_entity-hub-cluster / expected_source_candidates / expected_confidence / promote_expected / related_open_questions

### Retrieval Eval — 108 questions 분류

**Distribution (all)**:
| Class | Count | Rate |
|---|---:|---:|
| PASS | 51 | 47.2% |
| WEAK | 5 | 4.6% |
| PROMOTE_NEEDED | 50 | 46.3% |
| FAIL | 2 | 1.9% |

**Retrieval Quality (non-verification, n=57) — Q7 측정 영역**:
| Class | Count | Rate |
|---|---:|---:|
| **PASS** | 51 | **89.5%** (target ≥ 70% ✓) |
| WEAK | 0 | 0.0% |
| PROMOTE_NEEDED | 4 | 7.0% |
| FAIL | 2 | 3.5% |
| **FAIL+PROMOTE** | 6 | **10.5%** (target ≤ 20% ✓) |

→ **Q7 target 양 항목 모두 ✓ 충족**.

**Open Q Backlog (verification, n=51)**:
- open (PROMOTE_NEEDED): 46 — Mode C 후보
- partial answered (WEAK): 5 — Mode B/C 보강 후보
- answered (PASS): 0

→ Verification class 는 의도된 Open Q 상태 측정 (retrieval quality 와 분리).

### 의미 있는 신호 (eval 가 catch 한 것)

**FAIL (2)**:
- `Q-gen-wf-011` Policy Engine 운영 절차? — hub is empty stub (577 bytes)
- `Q-gen-wf-014` TAP 운영 절차? — hub is empty stub (560 bytes)

→ Stage 16 health check Warning W-2 (policy-engine/tap stub) 와 정확히 일치. 자동 분류가 manual lint 결과 재현.

**PROMOTE_NEEDED (4 non-verification)**:
- 4 cluster catalog scenario questions (AML/Compliance / AWS Nitro / Cold Wallet / Key Link) — 모두 body 미로드 cluster catalog. Mode C promote 시 즉시 해결 가능.

### 핵심 설계 결정 (실행 중 도출)

1. **Q7 metric scope = non-verification only** — verification class 의 open Q → PROMOTE_NEEDED 는 의도된 신호이므로 retrieval quality 측정에서 분리. 두 메트릭을 별도 표시 (retrieval quality + open Q backlog).
2. **Legacy 'no-status' source = full-ingest 인정** — Stage 1-7 ingests 의 source markdown 은 `status:` 필드 부재이나 body 50+ lines = full 인정. `SourceMarkdown.is_full_ingest()` 가 두 path 처리 (explicit status:full OR no status + line_count ≥ 50).
3. **Cite sort by ingest depth** — `expected_source_candidates` 는 full-ingest cite 우선 정렬 → eval 정확도 향상.

### v3.2.2 정합 검증
- PDF body 미로드 ✓ (scanner 는 markdown / filename / meta.yml 만)
- llms.txt body 미로드 ✓ (URL list 만, body grep 안 함)
- Entity 자동 생성 금지 ✓ (script 가 entity 생성 안 함)
- Curated Wiki 자동 수정 금지 ✓ (read-only)
- LLM 호출 0 ✓ (rule-based only, LLM tiebreaker 는 stub)

### Entity / Stage count
- 신규 entity: **0** (Stage 6–20 = **15 stage 연속 0**)
- Curated Wiki 수정: 0건 (read-only 자동화만)
- 신규 자동화 scripts: 3 (+ shared lib + 2 README)

### Next (deferred, P4+)
- **P4**: `retrieval_gap_detector.py` (실 answer 분석) + `promote_candidates.py` (Mode B/C 추천 with rationale)
- **P5**: `source_triage.py` (신규 PDF/webpage rename + meta.yml + draft index, approval-gated)
- **P6** (옵션): LLM-assisted question phrasing 다양화

### 운영 활용 시점
- 신규 PDF / lightweight index 추가 후 → `generate_questions.py` + `retrieval_eval.py` 재실행
- Curated Wiki entity/hub 수정 후 → 동일
- Open Q 응답 후 → verification metric 자동 갱신
- Stage 진행 마무리 시점 → eval snapshot 으로 progress 추적

---

## Stage 21 (2026-05-19) — Retrieval Loop P4: Gap Detector + Promote Recommendation

### Trigger
사용자 결정 (P3 MVP 후): P4 진행. 실제 gap → Mode B/C promote 후보까지 연결. 우선순위 명시: (1) FAIL 2건 hub_stub, (2) PROMOTE_NEEDED 4건 cluster catalogs, (3) partial/open Q backlog high-value.

### 신규 파일 (2 scripts + lib 확장)

| File | LOC | 역할 |
|---|---|---|
| [scripts/retrieval_gap_detector.py](scripts/retrieval_gap_detector.py) | ~230 | Non-PASS 질문의 gap signal 추출 + evidence 매칭 |
| [scripts/promote_candidates.py](scripts/promote_candidates.py) | ~280 | Source 후보 aggregate + priority tier + Mode 추천 |
| [scripts/lib/wiki_scanner.py](scripts/lib/wiki_scanner.py) | +60 | 키워드 search 함수 4개 + Open Q linkage helper |

### 자동 생성 산출물 (2 신규)

| File | 내용 |
|---|---|
| [tests/retrieval/gap-report.yml](tests/retrieval/gap-report.yml) + `.md` | 57 gap entries (signal + evidence + recommended_mode) |
| [tests/retrieval/promote-candidates.yml](tests/retrieval/promote-candidates.yml) + `.md` | 44 unique candidates, priority tier 별 ranked |

### Gap Detection 결과 (Stage 20 eval 의 57 non-PASS)

**By signal**:
| Signal | Count |
|---|---:|
| `open_q_unanswered` | 46 |
| `open_q_partial` | 5 |
| `catalog_only_cluster` | 4 |
| `hub_stub` | 2 |

**By recommended mode**:
| Mode | Count |
|---|---:|
| `mode_c` | 52 |
| `none` | 3 (evidence 부재) |
| `hub_content_draft` | 2 |

### Promote Candidates 결과 — Priority Tier (★ user 명시)

| Tier | 의미 | Count |
|---|---|---:|
| **T1** | hub_stub (FAIL fix 최우선) | 2 |
| **T2** | cluster_catalog (PROMOTE_NEEDED non-verification) | 4 |
| **T3** | high-value Open Q (≥ 2 priority-domain Q) | 13 |
| **T4** | rest | 25 |

### Top 6 후보 (Priority T1 + T2)

| Rank | T | Mode | Score | Gaps | OpenQ | Identifier |
|---:|---:|---|---:|---:|---:|---|
| 1 | T1 | `hub_content_draft` | 9.6 | 1 | 4 | vendors/fireblocks/policy-engine |
| 2 | T1 | `hub_content_draft` | 7.2 | 1 | 3 | vendors/fireblocks/tap |
| 3 | T2 | `mode_c` | 4.68 | 1 | 2 | cold-wallet cluster |
| 4 | T2 | `mode_c` | 4.2 | 1 | 2 | aml-compliance cluster |
| 5 | T2 | `mode_c` | 1.2 | 1 | 0 | aws-nitro-cosigner cluster |
| 6 | T2 | `mode_c` | 1.2 | 1 | 0 | key-link cluster |

### 신규 Mode 도입: `hub_content_draft` + `entity_deepen`

기존 3 mode (A/B/C) 만으로 부족한 케이스 발견:
- **`hub_content_draft`**: hub 가 empty stub 이지만 backing entity/source 이미 존재 → PDF ingest 불필요, 기존 자료 manual draft
- **`entity_deepen`** (★ marker): PDF 이미 source markdown 으로 full-ingest 되어 있으나 entity/hub 가 fact 미흡 cite → 새 ingest 불필요, 기존 markdown 재추출

→ Top 20 중 4건이 `entity_deepen` (add-api-users, whitelisting-new-addresses, blockchain-data-sheets, hosted-mpc-overview 등 Stage 1-7 ingest 자료).

### 핵심 설계 결정

1. **Priority tier first, score second**: `sort(key=(tier, -score))` — 사용자 priority hierarchy 가 score 보다 우선
2. **Already-ingested detection**: PDF 후보 → source markdown stem 매칭 + `is_full_ingest()` → entity_deepen 모드로 자동 전환
3. **Heuristic operational decisions**: candidate identifier 의 키워드로 7-pattern operational decision 추천 (AWS Nitro / Cold Wallet / Key Link / AML / policy-engine / cosigner / Callback Handler / audit-log)

### Top T3 highlights (Open Q 응답 후보)

| Rank | Mode | Identifier | 해결 가능 Open Q |
|---|---|---|---|
| 7 | `entity_deepen` ★ | `add-api-users.pdf` | Q-A01 / A02 / A03 / C01 / D02 등 9건 — re-extract from existing markdown |
| 8 | `mode_c` | `mobile-device-minimum-requirements.pdf` | Q-D03 / D08 등 4건 — body chunked 필요 |
| 11 | `mode_c` | `cold-wallet-mobile-key-share-backup-and-recovery.pdf` | Q-M05 / Q-D04 등 — Stage 14 cluster 의 핵심 |
| 12 | `mode_c` | `aml-transaction-screening-and-monitoring.pdf` | Q-S03 / S15 — Stage 14 AML |

### v3.2.2 정합 검증
- PDF body 미로드 ✓ (filename 매칭만)
- llms.txt body 미로드 ✓ (URL list 매칭만)
- Entity 자동 생성 금지 ✓
- Curated Wiki 자동 수정 금지 ✓ (read-only, 후보 추천만)
- LLM 호출 0 ✓ (rule-based only)

### Stage 19 의 잘못된 답변 패턴이 자동 탐지되는가? (회고적 검증)

Stage 19 의 "AWS SGX 제한적" 잘못된 recommendation 은 일반 지식 주입 — gap detector 의 직접 신호는 아니지만, `aws-nitro-cosigner` 가 T2 promote candidate 로 등재된 사실 자체가 retrieval visibility 를 제공. 향후 P5 (real-answer eval mode) 추가 시 "answer 가 expected_source_candidates 를 cite 안 함" 자동 탐지 가능 (현 P4 는 predicted mode only).

### Entity / Stage count
- 신규 entity: **0** (Stage 6–21 = **16 stage 연속 0**)
- Curated Wiki 수정: 0건 (read-only)
- 신규 자동화 scripts: 2 (gap + promote) + lib 확장

### Next (deferred)
- **P5**: `source_triage.py` (신규 PDF/webpage rename + meta.yml + draft index, approval-gated)
- **Real-answer eval**: 사용자/LLM actual answer 분석 mode 추가 (현재 P4 는 predicted mode)
- **Stage 21 의 T1 후보 즉시 처리** 옵션: vendors/fireblocks/policy-engine.md + tap.md 의 hub_content_draft 실행 (사용자 결정)

### 운영 활용 시나리오
- 신규 Source 추가 후 → 4-step loop 재실행 → 새 promote candidate 자동 생성
- Mode C promote 진행 결정 시 → promote-candidates.md 의 T2/T3 rank 1-3 후보 검토
- Stage 진행 마무리 시 → eval + gap snapshot 으로 progress 추적

---

## Stage 22 (2026-05-19) — Entity-Deepen: hosted-mpc-overview + retrieval tuning finding

### Trigger
사용자 결정 (P4 결과 + add-api-users 분석 후 pivot): hosted-mpc-overview entity_deepen 으로 진행 — 5 user-priority spine (Hosted MPC / BCM / Recovery / Cold Wallet / AWS Nitro) 중 4개 직접 영향. `architecture reasoning + retrieval precision + cross-cut discovery` 가 Open Q 해결 개수보다 우선.

### add-api-users 분석 결과 (P4 false positive 기록)

**`tests/retrieval/tuning-notes.md` 신규** — P5+ 의 retrieval engine 알고리즘 튜닝 입력으로 누적:
- P4 가 add-api-users.pdf 를 9 Open Q resolve 예상으로 표시했으나 실 yield 는 ~10% (1 partial Q + 2 minor)
- 원인: generic keyword ("API user", "API key") 매칭 false positive
- 4가지 보강 가설 (H1-H4) 기록 — Q `Sources to check` 필드 직접 일치 / H2/H3 section 가중치 / where_came_up 교집합 / generic token blacklist

### Patch 진행 (6건, Option A)

| # | 파일 | 변경 |
|---|---|---|
| P1 | [vendors/fireblocks/architecture.md](vendors/fireblocks/architecture.md) §"Hosted MPC Variant" | 4 framing 추가 — sovereign / BCM pairing / Off-Exchange / sub-series pointer |
| P2 | [vendors/fireblocks/mpc.md](vendors/fireblocks/mpc.md) §"Hosted MPC Variant" | sovereign framing + sub-series pointer |
| P3 | [entities/fireblocks/cosigner.md](entities/fireblocks/cosigner.md) §"Hosted MPC Variant" | Primary 2 옵션 / Guard SGX 한정 명확 구분 |
| P4 | [entities/fireblocks/mpc-key-share.md](entities/fireblocks/mpc-key-share.md) §"Hosted MPC Variant" | 3-of-3 sovereign + BCM Aggregator 이동 |
| P5 | [open-questions/fireblocks.md](open-questions/fireblocks.md) Q-S09 + Q-S10 | source pointer 강화 (★ status 불변) |
| P6 | [vendors/fireblocks/risks.md](vendors/fireblocks/risks.md) §"Risk-S15" 신규 | Off-Exchange ↔ Hosted MPC paired product |

### 신규 architectural cross-cut: Off-Exchange ↔ Hosted MPC (★)

본 stage 의 핵심 발견. `hosted-mpc-overview.md` p.2 Related Documents 가 **About Fireblocks Off Exchange** 를 명시 — Off-Exchange product line 은 Hosted MPC 기반으로 운영. 두 요건이 paired:
- **Sovereign key management** (Hosted MPC = 3-of-3 customer-side)
- **Counterparty exposure 격리** (Off-Exchange)

→ 본 wiki 의 어디에도 cited 되지 않았던 architectural cross-cut. Risk-S15 신규 + architecture.md cross-cut 절 추가로 spine 보존.

### Sovereign Key Management Framing 도입

`hosted-mpc-overview.md` p.1 직접 인용 ("completely control the MPC key shares") 으로 4 entity/hub 의 Hosted MPC variant 절을 share count 표 수준 → architectural reasoning layer 로 격상:
- **SaaS MPC** = vendor partial-trust (Fireblocks 2/3 + safeguard policy)
- **Hosted MPC** = customer ownership axis (Fireblocks 0/3, cryptographic 참여 불가)
- **BCM 도입 시 추가 변화** = Aggregator 까지 customer-side, signing protocol 의 message orchestration 도 customer 인프라

→ "regulatory compliance / regional data residency / vendor lock-in 회피" 시나리오의 1차 architectural answer 명시.

### Source pointer 강화 (Q-S09 / Q-S10)

**Q-S09** (DR xprv+fprv 절차): `hosted-mpc-overview.md` p.2 Related Documents 가 **Hosted MPC Backup and Recovery** sub-series 를 1차 source 로 명시. Hosted MPC 환경의 DR 절차가 SaaS MPC 와 다른 plane 임이 catalog-level 확정.

**Q-S10** (BCM 도입 threshold): **Hosted MPC ↔ BCM pairing 공식 확정** (`hosted-mpc-overview.md` + `business-continuity-module-bcm.md` cross-cite). 도입 threshold 의 1차 source 는 **Hosted MPC Customer-Side Setup / Workspace Configuration** sub-series (TIER 3 placeholder).

→ 두 Q 모두 **status 불변** (still open), source pointer 만 강화. Promote (Mode C) 시 sub-series 본문 추출 필요.

### Eval 재실행 검증

```
Retrieval Quality (n=57):  PASS 89.5% / FAIL+PROMOTE 10.5%   → Q7 ✓ 변화 없음
Open Q Backlog (n=51):     open 46 / partial 5 / answered 0   → 변화 없음
```

→ entity_deepen 작업이 eval 분류에 영향 없음 (Curated Wiki 보강만, status 불변 의도 부합).

### v3.2.2 정합 검증

- PDF body 미로드 ✓ (이미 ingest 된 hosted-mpc-overview.md 의 본문 인용만, hosted-mpc-overview.pdf 의 raw read 안 함)
- 신규 entity 생성: **0** (Off-Exchange entity 만들지 않음 — 별도 product line 정책 유지)
- 새 hub 생성: 0
- Open Q status 변경: 0 (source pointer 만)
- LLM 호출 0 (manual entity_deepen)

### Entity / Stage count
- 신규 entity: **0** (Stage 6–22 = **17 stage 연속 0**)
- 신규 hub: 0
- Curated Wiki 보강: 6 파일 (architecture / mpc / cosigner / mpc-key-share / open-questions / risks)
- 신규 Risk 등재: Risk-S15 (Off-Exchange ↔ Hosted MPC pairing)

### 운영 가치 (이번 Stage 의 architectural yield)

| 영역 | yield |
|---|---|
| **Sovereign key management framing** | 4 페이지 일관, SaaS vs Hosted vs BCM 의 trust 모델 명확 layered |
| **Off-Exchange ↔ Hosted MPC cross-cut** | 신규 architectural insight, Risk-S15 등재 |
| **BCM ↔ Hosted MPC pairing 명시** | architecture.md 두 절 통합 framing |
| **Hosted MPC sub-series pointer** | Q-S09 / Q-S10 promote 시 1차 source 즉시 확인 가능 |
| **Primary vs Guard Co-Signer 분기** | cosigner entity 의 deployment 옵션 명확 (Mobile / SGX 의 automation trade-off) |

→ add-api-users (~10% yield) 대비 **architecture reasoning 측면 약 3-5배 yield 실현**.

### Next (deferred)
- **P5 자동화** (`source_triage.py`) — 신규 PDF auto-rename + meta.yml + draft index (approval-gated)
- **Retrieval engine tuning** (P5+) — `tests/retrieval/tuning-notes.md` 의 H1-H4 가설 알고리즘 적용
- **다음 entity_deepen 후보**: whitelisting-new-addresses.pdf (T3 promote candidate, governance/security spine) — 사용자 결정
- **Off-Exchange × Hosted MPC** 의 정식 Q candidate 등록 (Q-G09 또는 Q-S16 예약 가능) — 사용자 결정

---

## Stage 23 (2026-05-19) — Retrieval Engine Tuning: H1-H4 구현 + 검증

### Trigger
사용자 결정 (Stage 22 hosted-mpc-overview deepen 후): 추가 ingest 보다 retrieval precision tuning 우선. tuning-notes.md 의 H1-H4 가설을 알고리즘 구현으로 적용 + 효과 검증.

### 구현 (4 hypotheses)

| H | 위치 | weight |
|---|---|---|
| **H1** explicit `Sources to check` slug match | wiki_scanner + gap_detector | +10 score per match (non-generic overlap 요구) |
| **H2** section header match | wiki_scanner `_score_against_sections` | +3 per keyword in H2/H3 헤더 |
| **H3** already-cited by Q target entity | promote_candidates `enrich` + `build_citation_index` | 0.5x score if cited_by_target ≥ 2 |
| **H4** generic token down-weight | wiki_scanner `_kw_weight` + GENERIC_TOKENS set | 0.3x weight per generic-only match |

### 변경 파일

| File | 변경 |
|---|---|
| [scripts/lib/wiki_scanner.py](scripts/lib/wiki_scanner.py) | OpenQuestion `sources_to_check` + `explicit_sources` 필드 / SourceMarkdown `sections` 필드 / GENERIC_TOKENS / _kw_weight / _score_against_sections / build_citation_index / _resolve_explicit_sources |
| [scripts/retrieval_gap_detector.py](scripts/retrieval_gap_detector.py) | collect_evidence 가 explicit_sources 보유 + section-aware search 호출 |
| [scripts/promote_candidates.py](scripts/promote_candidates.py) | Candidate 에 cited_by_target/cited_by_total 필드 + H3 score multiplier + enrich() citation_idx 통합 |
| [tests/retrieval/tuning-notes.md](tests/retrieval/tuning-notes.md) | Finding 2026-05-19-002 추가 (Stage 23 결과) |

### Stage 21 → Stage 23 비교 (동일 input)

**add-api-users.pdf** (Stage 22 entity_deepen 의 false positive 사례):
- Stage 21: rank 7, score 11.88, 9 OpenQ resolve 예상
- Stage 23: **rank 23, score 3.51** — 정확히 demoted
- 원인: H3 (cited_by_target = 1) + H4 (generic keyword down-weight)

**기타 already-cited demotions**:
- recovery-passphrase.md → rank 24 (cited_by_target = 4)
- support-verification → rank 25 (cited_by_target = 3)
- rename-and-delete-api-users → rank 47 (cited_by_target = 2)

**신규 surface high-quality 후보** (H1 explicit + H2 section):
- `/docs/create-api-co-signer-callback-handler` → rank 9 — **Q-A04 직접 evidence**
- `/api-reference/cosigners-beta/...` → rank 11 — **Q-A02 unpair 직접 evidence**
- best-practices-for-choosing-user-roles → rank 7-8 — Stage 8 deep ingest 의 spine

### Q7 eval target 영향
- PASS 89.5% / FAIL+PROMOTE 10.5% — **변화 없음** (eval 엔진은 gap/promote 와 독립)
- 정합 검증: tuning 은 retrieval 후보 ranking 만 변경, 평가 분류는 unchanged

### v3.2.2 정합
- PDF body 미로드 ✓ (모든 scoring 은 metadata + filename + section header 만)
- llms.txt body 미로드 ✓ (URL list grep 만)
- 신규 entity 0 (Stage 6–23 = **18 stage 연속 0**)
- Curated Wiki 수정 0 (read-only tuning)
- LLM 호출 0 (rule-based scoring + LLM tiebreaker stub 유지)

### 추가 보강 (실행 중 발견)

H1 의 `_resolve_explicit_sources` 가 처음에 false positive 다수 생성 — "Add users 후속 문서" 같은 generic phrase 가 add-users / add-api-users 모두 매칭. **non-generic overlap 요구** 조건 추가하여 차단. Stop list 도 확장 (후속/문서/가이드라인/article/whitepaper 등).

### 검증된 보강 영역 (user 명시 요청 정합)

| 영역 | 검증 |
|---|---|
| evidence weighting | ✓ H1+H2 로 신뢰 높은 source 가중치 |
| Open Q linkage precision | ✓ explicit_sources 매칭으로 sitemap URL 후보 surface (Q-A02, Q-A04) |
| architecture source 우선순위 | ✓ best-practices-for-choosing-user-roles 같은 Stage 8 deep ingest 가 정확히 상위 |
| generic keyword suppression | ✓ add-api-users 가 11.9 → 3.5 로 demote |

### 남은 한계 + H5+ 후보 (tuning-notes 에 기록)
- H5: slug-frequency 기반 IDF 가중치
- H6: Q-specific entity boost
- H7: domain context-aware generic
- H8: LLM tiebreaker 실제 구현 (Q2=(c))

### Next 옵션
1. **High-rank 신규 후보 entity_deepen**: `best-practices-for-choosing-user-roles` (rank 7-8) — Stage 8 Owner spine
2. **새 high-quality URL promote**: `/docs/create-api-co-signer-callback-handler` (Q-A04) / `/api-reference/cosigners-beta/` (Q-A02) — Mode C
3. **H5-H8 추가 tuning**: slug-frequency IDF 또는 LLM tiebreaker
4. **P5 자동화**: source_triage.py (신규 PDF auto-rename + meta.yml)

---

## Stage 24 (2026-05-19) — Mode C: Callback Handler Authentication (R1 + Acquisition Method B)

### Trigger
사용자 결정 (Stage 23 retrieval tuning 후 H1-H4 가 surface 한 후보): Q-A04 직접 evidence + Q-C01 substantial advance + Callback Handler control-plane semantics 가 high-yield. Acquisition Method B (curl save + bash chunked grep/sed extraction, body 미 LLM context 전체 로드).

### Source 확보 (Method B)
2 URL curl save → bash exploration (wc/head/grep section headers) → sed chunked extraction:
- `sources/fireblocks/webpages/developers/docs/create-api-co-signer-callback-handler.md` (47 lines, 3.5 KB)
- `sources/fireblocks/webpages/developers/reference/cosigner-callbackhandler-secure-communication-authentication.md` (185 lines, 9.7 KB, 3 sed chunks)

**v3.2.2 정합**: file save 후 wc/head/grep 으로 structure 만 확인, 그 후 sed 로 필요한 section 만 chunked load. Full body 가 LLM context 에 한 번에 진입한 적 없음.

### 핵심 발견 — Q-A04 ANSWERED + Q-C01 partial advanced

**5 Authentication Options** (Q-A04 의 정확한 답):

| # | 명칭 | Message layer | TLS layer | Version | SGX only |
|---|---|---|---|---|---|
| 1 | Public key authentication | JWT (RSA 2048) | HTTPS + trusted CA | all | no |
| 2 | Self-Signed Certificate pinning | JSON | TLS cert pin | all | no |
| 3 | Root-CA Certificate | JSON | TLS Root-CA | **v2025.12.11+** | no |
| 4 | Hybrid — Public key + Cert pin | JWT | TLS cert pin | **v2025.12.11+** | **★ SGX only** |
| 5 | Hybrid — Public key + Root-CA | JWT | TLS Root-CA | **v2025.12.11+** | **★ SGX only** |

**Payload / URL Convention** (Q-C01 advance):
- Endpoints (POST): `tx_sign_request` + `config_change_sign_request`
- `/v2` prefix 분기: JWT options (1,4,5) = `/v2/...` / JSON options (2,3) = no prefix
- Co-signer private key (**global**) — 모든 페어링 API user request 서명 공유
- Callback Handler private key (**per-API-user**) — RSA 2048, API user 별 격리

**★ 신규 architectural 신호 3건**:
1. **Callback Handler OPTIONAL** — 미설정 시 Co-signer 자동 sign/approve default (Risk-S16 등재)
2. **Key model 비대칭** — Co-signer global vs Callback Handler per-user (blast radius 차이)
3. **Dual-layer auth (Hybrid Options 4/5)** — message-layer JWT + TLS-layer cert 동시. SGX only.

### Patch 진행 (8건, Option B)

| # | 파일 | 변경 |
|---|---|---|
| P1 | [entities/fireblocks/callback-handler.md](entities/fireblocks/callback-handler.md) | 5 options 표 + payload/URL convention + key model 비대칭 + Optional default + Open Q sync |
| P2 | [vendors/fireblocks/callback-handler.md](vendors/fireblocks/callback-handler.md) | TODO 라벨 제거 + Stage 24 4 section 추가 + Open Q sync |
| P3 | [entities/fireblocks/api-co-signer.md](entities/fireblocks/api-co-signer.md) | Callback Handler Key Model 비대칭 + Optional default section |
| P4 | [vendors/fireblocks/cosigner.md](vendors/fireblocks/cosigner.md) | Stage 8 chain-of-trust + Stage 24 5 options 의 layered framing |
| P5 | [open-questions/fireblocks.md](open-questions/fireblocks.md) | **Q-A04 status: open → answered** (5 options 명세) + **Q-C01 status: open → partial advanced** (payload + URL + key model) |
| P6 | [vendors/fireblocks/risks.md](vendors/fireblocks/risks.md) | **Risk-S16 신규** — Callback Handler 미설정 = auto-sign default |
| P7 | Source Lake hygiene | 2 meta.yml + 2 lightweight markdown index (developers/docs/ + developers/reference/) |
| P8 | [aws-nitro-cluster-catalog.md](sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__aws-nitro-cluster-catalog.md) | H-X1 hypothesis (SGX-only Options 4/5 × AWS Nitro 가용성 미확정) cross-cut signal |

### Eval 검증 (Stage 23 → Stage 24)

| Metric | Stage 23 | Stage 24 | 변화 |
|---|---|---|---|
| verification 총수 | 51 | **50** | Q-A04 answered 후 verification set 제외 |
| open (PROMOTE_NEEDED) | 46 | **44** | Q-A04 + Q-C01 2건 이탈 |
| partial answered (WEAK) | 5 | **6** | Q-C01 추가 (open → partial) |
| answered (PASS) | 0 | 0 | unchanged |
| **Retrieval Quality (non-verification)** | 89.5% PASS / 10.5% FP | **89.5% PASS / 10.5% FP** | **변화 없음** |

→ Q7 target ✓ 유지. Open Q backlog 가 작지만 의미있는 감소 (46 → 44).

### Hypothesis 유지 (★ H-X1)

`cosigner-callbackhandler-secure-communication-authentication.md` 의 "currently supported only by the SGX cosigner" 가:
- (a) Intel SGX TEE 환경 한정 (Azure / on-prem) — AWS Nitro Co-signer 는 Options 4/5 미지원
- (b) Fireblocks 일반 Co-signer (Stage 8 SGX baseline) — 모든 환경 가용

본 source 만으로 단정 불가. Stage 19 AWS Nitro cluster catalog 의 §"Callback Handler Auth Options × TEE plane" 에 H-X1 hypothesis 등재. 검증 = `install-api-cosigner-aws` 또는 `api-cosigner-versions-aws` 추가 Mode C 필요.

### 운영 결정 enabled (★ user 명시 영역)

| 영역 | 답 가능 (Stage 24 이후) |
|---|---|
| Co-signer 배포 시 auth option 선택 | ✓ 5 option 매트릭스 + version/TEE 제약 |
| Production vs dev TLS 요건 | ✓ HTTPS w/ trusted CA cert 강제 (prod), HTTP 허용 (dev) |
| /v2 URL routing 설계 | ✓ JWT vs JSON 분기 명확 |
| Callback Handler 미설정 정책 | ✓ Risk-S16 명시, 조직 표준화 필요 |
| AWS Nitro 환경의 Hybrid 가용성 | ★ H-X1 hypothesis 유지, 추가 promote 필요 |

### v3.2.2 정합 검증
- PDF body 미로드 ✓ (webpage source 2건 모두 curl save + chunked load)
- 신규 entity 0 ✓ (Stage 6–24 = **19 stage 연속 0**)
- 새 hub 0 ✓
- Open Q status 변경: 2건 (Q-A04 answered, Q-C01 partial advance) — 명시적 evidence 기반
- LLM 호출 0 (manual deep ingest, body chunked load only)
- Risk 신규 등재: Risk-S16

### Callback Handler mini-cluster 처리 결과

| URL | 처리 상태 |
|---|---|
| `/docs/create-api-co-signer-callback-handler` | **Stage 24 Mode C ✓** (setup guide) |
| `/reference/cosigner-callbackhandler-secure-communication-authentication` | **Stage 24 Mode C ✓** (5 options reference) |
| `/reference/plugin-based-callback-handler` | Stage 15 catalog only — Q-C01 잔존 (timeout/retry) 의 후보 |
| `/api-reference/cosigners-beta/update-api-key-callback-handler` | Stage 15 catalog only — management API |

### Next 옵션
1. **`install-api-cosigner-aws` Mode C** — H-X1 hypothesis (AWS Nitro × Options 4/5) 검증, AWS Nitro Co-signer cluster catalog 본문 보강
2. **`/reference/plugin-based-callback-handler` Mode C** — Q-C01 잔존 (timeout/retry/idempotency) 해결 가능
3. **P5 source_triage.py** — 신규 PDF auto-rename 자동화
4. **H5+ retrieval tuning** — slug-frequency IDF / LLM tiebreaker 등

---

## Stage 25 (2026-05-19) — P5 Source Lake Auto-Triage (`source_triage.py`)

### Trigger
사용자 결정 (Stage 24 high-yield Mode C 후): 추가 Mode C 연속 진행보다 신규 source 자동 triage 운영 기반 확보 우선. Q4=(b) 설정 = rename/meta auto + markdown draft-only.

### 신규 파일 (2 scripts + 2 README update)

| File | LOC | 역할 |
|---|---|---|
| [scripts/lib/triage.py](scripts/lib/triage.py) | ~140 | slug normalization + 5 domain keyword 매칭 + TIER 3 product line 식별 + Mode 추천 |
| [scripts/source_triage.py](scripts/source_triage.py) | ~210 | CLI entry: dry-run / --apply-hygiene / --draft-markdown 3 모드 |
| [scripts/README.md](scripts/README.md) | updated | P5 추가 + 전체 active scripts (P1-P5) 정합 |
| [tests/README.md](tests/README.md) | updated | P5 usage + approval gate 설명 |

### 자동 생성 산출물 (dry-run 결과)

| File | 내용 |
|---|---|
| [tests/triage/triage-report.yml](tests/triage/triage-report.yml) | 정형 분류 결과 |
| [tests/triage/triage-report.md](tests/triage/triage-report.md) | 사람 view + domain 별 grouped 표 |

### Dry-run 결과 (312 non-normalized PDFs)

**By Tier**:
| Tier | Count |
|---|---:|
| TIER 1 (5 priority domain) | 45 |
| TIER 2 (placeholder) | 183 |
| TIER 3 (out-of-scope product) | 84 |

**By Domain** (TIER 1):
- governance: 17 (policy / approval / deposit-control / blocked-by-policy 등)
- workspace-management: 16
- mobile-recovery: 8 (disaster-recovery-coincover / station70 / MPC variant 등)
- security-access: 4

**By Recommended Mode**:
| Mode | Count |
|---|---:|
| `mode_a` (hygiene only) | 267 |
| `mode_b_cluster` (TIER 1 + ≥ 4 siblings) | 41 |
| `mode_b` (TIER 1 singleton) | 4 |

### 핵심 설계 결정

1. **3 모드 분리** — dry-run (default) / apply-hygiene / draft-markdown — Q4=(b) 의 "rename/meta auto, markdown draft-only" 직접 구현
2. **Two-pass triage** — pass 1 으로 domain/tier 결정, pass 2 로 sibling count 기반 mode 재계산 (cluster detection)
3. **TIER 3 keyword 명시 enumeration** — off-exchange / fiat / gas-station / staking / smart-transfer / tokenization / nft / earn / web3 / automation 등 (Source Lake 분석 결과 기반)
4. **Marketing suffix 제거 패턴** — "– Fireblocks Help Center" 자동 strip
5. **Draft 격리** — `tests/triage/drafts/` 로 분리 저장, `sources/fireblocks/markdown/` 자동 진입 금지

### 검증된 분류 품질 (dry-run report 샘플)

**TIER 1 mode_b_cluster 정확도 (sample)**:
- `approval-and-signing-notification-expiration` → governance ✓
- `disaster-recovery-service-coincover` → mobile-recovery ✓
- `policy-rules-for-solana-program-calls` → governance ✓
- `policy-export` / `edit-a-policy` / `create-a-policy` → governance ✓ (policy cluster)

**TIER 3 정확도 (sample)**:
- `about-embedded-wallets` → TIER 3 ✓
- `about-fireblocks-off-exchange` → TIER 3 ✓
- `alfred-pay` → TIER 3 ✓ (fiat)
- `automation-rule-example-*` → TIER 3 ✓

### v3.2.2 정합 검증
- PDF body 미로드 ✓ (filename + size 만)
- 자동 entity 생성 0 ✓
- 자동 curated wiki 수정 0 ✓
- 자동 sources/markdown/ 진입 0 ✓ (draft 는 tests/triage/drafts/)
- 자동 Mode C 진입 0 ✓ (Mode C 는 recommendation 만)
- LLM 호출 0 ✓ (rule-based heuristic)

### Approval Gate 명확화 (Q4=(b))

| 작업 | Approval 필요 여부 |
|---|---|
| Rename PDF + meta.yml 생성 | `--apply-hygiene` flag 필요 (즉 사용자가 직접 명령으로 실행) |
| Lightweight markdown draft 생성 | `--draft-markdown` flag 필요 + tests/triage/drafts/ 격리 — 사용자 검토 후 수동 이동 |
| sources/markdown/ 진입 | 자동 안 함 — 영구 사용자 수동 작업 |
| entity/hub 보강 | 자동 안 함 — Mode C 진행 시점 사용자 결정 |

### Entity / Stage count
- 신규 entity: **0** (Stage 6–25 = **20 stage 연속 0**)
- 신규 hub: 0
- 자동화 scripts: P1-P5 = 5 active + 2 shared lib
- Source Lake 미변경 (dry-run 만 진행)

### Stage 25 의 실행 옵션 (현재 dry-run 만)

본 stage 는 dry-run 으로 종료. 사용자 결정에 따라:
1. **`--apply-hygiene` 실행**: 312 PDF rename + 312 meta.yml 생성 → Source Lake 통계 312 normalized PDF 추가, 458 → 458+312=770 normalized
2. **`--apply-hygiene --draft-markdown` 실행**: 위 + TIER 1 49 markdown draft 생성 (tests/triage/drafts/)
3. **추가 검증 후 실행**: 사용자가 dry-run report 검토 후 결정

### Next 옵션
1. **`--apply-hygiene` 실행** — 312 non-normalized PDF 의 Source Lake hygiene 완료
2. **`--apply-hygiene --draft-markdown`** — 위 + TIER 1 49 markdown draft 생성 (검토 가능 형태)
3. **추가 H5+ retrieval tuning** — slug-frequency IDF / LLM tiebreaker
4. **추가 Mode C** — `install-api-cosigner-aws` (H-X1 검증) 또는 `/reference/plugin-based-callback-handler` (Q-C01 잔존)
5. **새 entity_deepen 후보** (high-rank, Stage 23 surface 분)

---

## Stage 26 (2026-05-19) — Triage Algorithm Tuning (estimate_tier strict TIER 3 priority)

### Trigger
사용자 결정 (Stage 25 TIER 1 review 후): TIER 1 review 가 발견한 7 mis-classification 사례 — domain keyword 와 TIER 3 keyword 가 동시 매칭 시 product line 으로 demote 권장.

### 알고리즘 변경

**Before** (`scripts/lib/triage.py`):
```python
def estimate_tier(slug, domain, t3_matches):
    if t3_matches and (domain == "unknown" or len(t3_matches) >= 2):
        return "3"
    if domain != "unknown":
        return "1"
    return "2"
```
→ Domain 매칭 + 단일 TIER 3 keyword 시 TIER 1 우선 (product line keyword 무시)

**After** (Stage 26):
```python
def estimate_tier(slug, domain, t3_matches):
    if t3_matches:
        return "3"
    if domain != "unknown":
        return "1"
    return "2"
```
→ **ANY TIER 3 keyword match → TIER 3** (보수적, product line 우선)

### 부수 변경
- `TIER3_KEYWORDS` 에서 `travel-rule` 제거 — Stage 14 AML/Compliance cluster 가 in-scope compliance spine 으로 처리

### 결과 (Stage 25 → Stage 26)

| Metric | Stage 25 | Stage 26 | 변화 |
|---|---:|---:|---|
| TIER 1 | 45 | **38** | -7 (mis-classification 해소) |
| TIER 2 | 183 | 183 | unchanged |
| TIER 3 | 84 | **91** | +7 (정확 demote) |
| HIGH confidence | 34 | 34 | **unchanged ✓** (Top 10 stable) |
| Singleton weak | 4 | 4 | unchanged |
| **REVIEW (TIER 3 overlap)** | 7 | **0** | **완전 해소 ✓** |
| `mode_b_cluster` | 41 | 34 | -7 (demoted product line 자료) |
| `mode_a` | 267 | 274 | +7 |

### 정확히 demote 된 7건

| Original (slug) | Domain matched | TIER 3 keyword | Stage 25 | Stage 26 |
|---|---|---|---|---|
| `policies-for-evm-defi-operations` | governance (policies) | **evm-** | TIER 1 | **TIER 3** ✓ |
| `policy-rules-for-automation-actions` | governance (policy) | **automation** | TIER 1 | **TIER 3** ✓ |
| `adding-evm-assets-to-a-workspace` | workspace-mgmt (workspace) | **evm-** | TIER 1 | **TIER 3** ✓ |
| `adding-non-evm-assets-to-a-workspace` | workspace-mgmt (workspace) | **evm-** | TIER 1 | **TIER 3** ✓ |
| `using-a-local-gasless-relay-in-your-workspace` | workspace-mgmt (workspace) | **gasless** | TIER 1 | **TIER 3** ✓ |
| `using-a-workspace-as-a-gasless-relay-provider` | workspace-mgmt (workspace) | **gasless** | TIER 1 | **TIER 3** ✓ |
| `using-an-external-workspace-as-a-gasless-relay` | workspace-mgmt (workspace) | **gasless** | TIER 1 | **TIER 3** ✓ |

→ 모두 EVM DeFi / EVM asset onboarding / gasless relay / automation rule product line 으로 정확 분류.

### Top 10 HIGH (governance/policy cluster) — 변경 없음

unchanged from Stage 25 (모두 깨끗한 policy cluster, TIER 3 overlap 0):
1-10: approval / blocked-by-policy / build-DCCP / create-policy / default-DCCP / edit-policy / how-to-build-ruleset / policy-export / policy-inspector / policy-on-off-ramp

→ **알고리즘 변경이 false-demote 발생 안 함** — 진짜 TIER 1 governance/policy spine 보존.

### 검증: 알고리즘의 false-demote 위험

본 알고리즘 변경의 위험 = "domain keyword + 가짜 TIER 3 keyword 우연 매칭" 시 진짜 TIER 1 demote. 검증 결과:
- 7건 demoted: 모두 명백한 product line 자료 (EVM / gasless / automation) ✓
- 34 HIGH 보존: 모두 policy / approval / vault / recovery / disaster-recovery — TIER 3 keyword 매칭 없음 ✓
- 4 singleton weak 보존: whitelist / allowlist — TIER 3 keyword 매칭 없음 ✓
- TIER 2 183건 변화 없음 ✓

→ **false-demote 0건** in current Source Lake. 알고리즘 변경은 안전.

### v3.2.2 정합
- `lib/triage.py` 단일 함수 1개 + TIER3_KEYWORDS list 1개 변경
- read-only 검증 (source_triage dry-run + triage_review)
- 파일 rename 0건 / meta.yml 생성 0건 / markdown draft 0건
- 신규 entity 0 (Stage 6–26 = **21 stage 연속 0**)

### Source Lake 영향 (★ 변경 0건)
- Non-normalized PDF: 312 (변화 없음, dry-run 만)
- Normalized PDF: 146 (변화 없음)
- meta.yml: 146 (변화 없음)
- markdown: 110+ (변화 없음)

### tuning-notes.md 보강 (P5 알고리즘 finding)

`tests/retrieval/tuning-notes.md` 에 추가 가능한 finding (informational):
- Source triage 의 estimate_tier 가 "single TIER 3 keyword + domain match" 시 잘못 TIER 1 분류
- 해결: TIER 3 keyword ANY match → TIER 3 priority (Stage 26)
- 향후 보강: TIER 3 keyword 의 false positive 가능성 (예: "automation" 이 governance automation rule 외 다른 context 에서도 나타날 가능성) — 본 wiki Source Lake 에서는 false positive 0건 확인됨

### Next 옵션
1. **Top 10 HIGH sample apply** — governance/policy cluster 10건 `--apply-hygiene` (manual approval 후)
2. **TIER 1 38건 전체 apply** — sample 검증 통과 시 전체 진행
3. **`hosted-mpc-backup-and-recovery` Mode C** — Q-S09 1차 source (Stage 25 review 가 surface)
4. **`policy-for-cold-wallet` Mode C** — Cold Wallet × governance cross-cut
5. **다른 작업**

---

## Stage 27 (2026-05-19) — Sample Apply: Top 10 HIGH (governance/policy cluster)

### Trigger
사용자 결정 (Stage 26 algorithm 보강 후): TIER 1 38건 전체 apply 전에 Top 10 HIGH sample 로 `source_triage.py --apply-hygiene` 실제 동작 검증.

### 스크립트 보강 (`source_triage.py`)
- **`--only-slugs <comma-list>`** flag 추가 — sample apply 지원
- **target-exists 안전 체크** 추가 — 정규화 대상 파일이 이미 있으면 skip + warning
- read-only validate / partial apply 가능

### Apply 결과

**Counts (before → after)**:
| Metric | Before (Stage 26) | After (Stage 27) | 변화 |
|---|---:|---:|---|
| Normalized PDF | 146 | **156** | +10 |
| Non-normalized PDF | 312 | **302** | -10 |
| meta.yml | 146 | **156** | +10 |

**Original → Normalized mapping (10건)**:
| Original | Normalized |
|---|---|
| `Approval and signing notification expiration – Fireblocks Help Center.pdf` | `2026-05-19__support-fireblocks-io__approval-and-signing-notification-expiration.pdf` |
| `Blocked by policy substatuses – Fireblocks Help Center.pdf` | `2026-05-19__support-fireblocks-io__blocked-by-policy-substatuses.pdf` |
| `Build a custom Deposit Control and Confirmation Policy – Fireblocks Help Center.pdf` | `2026-05-19__support-fireblocks-io__build-a-custom-deposit-control-and-confirmation-policy.pdf` |
| `Create a Policy – Fireblocks Help Center.pdf` | `2026-05-19__support-fireblocks-io__create-a-policy.pdf` |
| `Default Deposit Control and Confirmation Policy – Fireblocks Help Center.pdf` | `2026-05-19__support-fireblocks-io__default-deposit-control-and-confirmation-policy.pdf` |
| `Edit a Policy – Fireblocks Help Center.pdf` | `2026-05-19__support-fireblocks-io__edit-a-policy.pdf` |
| `How to build a Policy ruleset – Fireblocks Help Center.pdf` | `2026-05-19__support-fireblocks-io__how-to-build-a-policy-ruleset.pdf` |
| `Policy export – Fireblocks Help Center.pdf` | `2026-05-19__support-fireblocks-io__policy-export.pdf` |
| `Policy inspector_ Transparent transaction diagnostics – Fireblocks Help Center.pdf` | `2026-05-19__support-fireblocks-io__policy-inspector-transparent-transaction-diagnostics.pdf` |
| `Policy rule examples for On_Off-ramp orders – Fireblocks Help Center.pdf` | `2026-05-19__support-fireblocks-io__policy-rule-examples-for-on-off-ramp-orders.pdf` |

**File changes (git diff equivalent)**:
- Renamed: 10 PDFs
- Created: 10 meta.yml files
- Modified: 0 (no existing files touched)
- Deleted: 0 (rename = move, original goes away naturally)
- 실패/충돌: 0건

### Sample meta.yml 검증

```yaml
url: https://support.fireblocks.io/hc/en-us/articles/create-a-policy
url_status: inferred (slug 기반 추정, 실 article ID 미확인)
fetched_at: 2026-05-19
source_type: pdf
domain: governance
tier: 1
title: "Create a Policy"
crawl_status: not-fetched (body 미로드)
promote_condition: "Source Lake hygiene only — full ingest 필요시 결정"
recommended_mode: mode_b_cluster
triage_stage: Stage 25 (source_triage.py auto)
```

✓ Convention 정합 (date prefix / host slug / kebab-case body / `url_status: inferred` 명시 / TIER 1 / domain).

### Retrieval Eval 영향 (변화 0)

- PASS 89.5% / FAIL+PROMOTE 10.5% — **Q7 ✓ 유지**
- Open Q backlog: open 44 / partial 6 / answered 0 — **변화 없음**
- 본 Stage 의 변경은 Source Lake metadata layer 만 — Curated Wiki 미영향

### 안전성 검증

| 항목 | 결과 |
|---|---|
| 파일 rename | 10건 정확 (no missed / no extra) |
| meta.yml 생성 | 10건 정확 |
| Target-exists 충돌 | 0건 (safety check 통과) |
| Curated Wiki 수정 | 0건 (스크립트는 entities/ vendors/ 미접근) |
| Entity 생성 | 0건 (Stage 6–27 = **22 stage 연속 0**) |
| markdown draft | 0건 (사용자 명시 — `--draft-markdown` flag 미사용) |
| Mode C 진입 | 0건 |
| Wikilink 깨짐 | 0건 |

### TIER 1 38건 전체 apply 가능 여부 평가

**판정: 안전. 진행 가능.**

근거:
1. **알고리즘 검증 완료** (Stage 26): false-demote 0건, mis-classification 7건 해소
2. **스크립트 검증 완료** (Stage 27): 10 sample 정확 rename + meta.yml 생성, 충돌/실패 0
3. **Approval gate 작동**: `--only-slugs` filter 로 partial apply 안전성 입증
4. **Source Lake metadata layer 만 변경**: Curated Wiki / eval / Q backlog 모두 영향 0
5. **Reversibility 가능**: 필요 시 normalize 안 된 형태로 rename 복귀 (스크립트 추가 시)

권장 다음 단계:
- **TIER 1 나머지 28건 sample apply** (mobile-recovery 8 + workspace-mgmt 11 + security-access 4 + governance 잔여 5) — 같은 `--only-slugs` 패턴
- 또는 **전체 TIER 1 38건** `--only-slugs <38-slug-list>` 일괄 apply
- **TIER 2/3 (264건)** 은 별도 stage — apply 가치 낮음 (deep ingest 후보 아님), hygiene only

### Next 옵션
1. **TIER 1 나머지 28건 apply** (governance 잔여 5 + mobile-recovery 8 + workspace-mgmt 11 + security-access 4)
2. **TIER 1 38건 전체 apply** (위 + 본 stage 10건 외 28건 = 38)
3. **TIER 2 + TIER 3 apply** (264건 hygiene only, 별도 stage)
4. **Mode C 진행** — `hosted-mpc-backup-and-recovery` (Q-S09) 또는 `policy-for-cold-wallet` (Cold × governance)
5. **다른 retrieval tuning / entity_deepen**

---

## Stage 28 (2026-05-19) — TIER 1 Hygiene Complete (28 remaining apply)

### Trigger
사용자 결정 (Stage 27 sample 검증 통과 후): TIER 1 나머지 28건 일괄 apply. Top 10 sample 과 동일 패턴 (`--only-slugs` filter + `--apply-hygiene`).

### Apply 결과

**Counts (Stage 27 → Stage 28)**:
| Metric | Before | After | 변화 |
|---|---:|---:|---|
| Normalized PDF | 156 | **184** | +28 ✓ |
| Non-normalized PDF | 302 | **274** | -28 ✓ |
| meta.yml | 156 | **184** | +28 ✓ |
| **TIER 1 remaining** | 28 | **0** ✓ | TIER 1 hygiene **complete** |

**실패/충돌**: **0건** (모든 28 PDF 정확 rename + meta.yml 생성)

### Domain 분포 (Stage 28 처리분 28건)

| Domain | Count | Slug 예시 |
|---|---:|---|
| **mobile-recovery** | 8 | disaster-recovery-service-coincover / station70, recovery-utility-release-notes, hosted-mpc-backup-and-recovery, native-workspace-key-backup-and-recovery-with-python-script, using-the-recovery-tool-for-raw-signing, verifying-a-recovery-package, generating-a-workspace-key-backup-package |
| **workspace-management** | 11 | fireblocks-vault-hd-derivation-paths, vault-key-derivation-tool, hosted-mpc-workspace-configuration, integrating-third-party-aml-providers-with-your-workspace, manage-vault-accounts, naming-vault-accounts, policy-for-cold-wallet, the-fireblocks-vault, using-tags-for-vault-management, vault-account-balances, view-vault-accounts-with-auto-fueling-enabled |
| **governance** | 5 | publish-a-policy, policy-rules-for-solana-program-calls, policy-rules-for-minting-and-burning-tokens, policy-rules-for-specific-contract-call-methods, typed-message-policy-rules |
| **security-access** | 4 | address-whitelist-suspension-property, ip-allowlisting-for-webhooks-notifications, operating-the-allowlist-contract, whitelisted-wallet-balances |

→ 합계 28 ✓

### 전체 TIER 1 hygiene 완료 (Stage 27 + Stage 28 = 38건)

| Stage | Domain breakdown | Count |
|---|---|---:|
| Stage 27 (Top 10 HIGH) | governance 10 | 10 |
| Stage 28 (나머지) | governance 5, workspace-mgmt 11, mobile-recovery 8, security-access 4 | 28 |
| **Total TIER 1** | governance 15 + workspace-mgmt 11 + mobile-recovery 8 + security-access 4 | **38** ✓ |

→ Source Lake 의 모든 TIER 1 (5 priority domain 매칭) non-normalized PDF 가 정규화 완료.

### Git diff 규모

- Renamed: 28 PDFs (mv operations)
- Created: 28 meta.yml files
- Modified: 0 (no existing files touched)
- Deleted: 0 (rename = move)
- Curated Wiki: 0 (entities/ vendors/ 미접근)
- Scripts: 0 (변경 없음, 이미 Stage 27 에 `--only-slugs` flag 추가)
- Test outputs: triage-report.{yml,md} 갱신 (자동)

### High-Value Source 식별 (★ 본 stage 가 surface)

normalized 가 된 28건 중 즉시 Mode C 후보로 가치 높은 source:

| Source | 가치 |
|---|---|
| **`hosted-mpc-backup-and-recovery`** | **Q-S09 직접 evidence** (Stage 22 의 1차 source pointer). DR 절차 명세. ★ 1순위 promote 후보 |
| **`hosted-mpc-workspace-configuration`** | **Q-S10 직접 evidence** (BCM 도입 threshold). ★ paired with above |
| **`policy-for-cold-wallet`** | Stage 14 Cold Wallet × governance cross-cut (Risk-G07 보강 candidate) |
| **`integrating-third-party-aml-providers-with-your-workspace`** | Stage 14 AML cluster Q-S03/S15 보강 candidate |
| **`disaster-recovery-service-coincover`** / **`station70`** | Q-S09 의 third-party DRS provider 명세 |
| **`policy-rules-for-solana-program-calls`** | Stage 10 policy spine 의 chain-specific 확장 |
| **`generating-a-workspace-key-backup-package-fireblocks-recovery-utility`** | Workspace Keys Recovery (Q-D07) 1차 source |

### v3.2.2 정합 검증

| 항목 | 결과 |
|---|---|
| 파일 rename | 28 정확 |
| meta.yml 생성 | 28 정확 |
| markdown draft | 0 (사용자 명시) |
| Curated Wiki 수정 | 0 |
| Entity 생성 | 0 (Stage 6–28 = **23 stage 연속 0**) |
| Mode C 진입 | 0 |
| PDF body 읽기 | 0 |
| Wikilink 깨짐 | 0 |
| Q7 eval | 89.5% / 10.5% (unchanged) ✓ |

### TIER 2 / TIER 3 로 진행 가능 여부 평가

**판정**: **안전, 진행 가능 — 단 가치-비용 trade-off 평가 필요**.

**기술적 안전성** (3 검증 통과):
1. ✓ 알고리즘 검증 (Stage 26): false-demote 0
2. ✓ Top 10 sample (Stage 27): 정확 동작
3. ✓ Full TIER 1 28 (Stage 28): 정확 동작, 충돌 0

**가치 평가**:
- **TIER 2 (183건)**: placeholder 자료, 5 priority domain 외 keyword 없음. hygiene 자체는 정확하나 **promote 가치 낮음** (Mode B/C 후보 아님). Source Lake naming hygiene 만 향상.
- **TIER 3 (91건)**: product line (off-exchange / fiat / gas-station / staking / smart-contract / tokenization / nft / web3 / EVM / gasless / automation). 본 wiki 5 priority domain 밖. **hygiene 만 가치 있음** — Mode A 적합.

**권장 진행 방식**:
- **Option α** (점진): TIER 3 91건 먼저 (clean cluster), 그 후 TIER 2 183건
- **Option β** (일괄): TIER 2 + TIER 3 합쳐 274건 한 번에
- **Option γ** (보류): TIER 2/3 은 retrieval automation 측면 가치 낮으므로 보류, 우선 Mode C 진행 (`hosted-mpc-backup-and-recovery` Q-S09)

### Next 옵션
1. **`hosted-mpc-backup-and-recovery` Mode C** — Q-S09 직접 evidence (★ Stage 22 의 1차 source pointer, 본 stage normalize 완료)
2. **TIER 3 91건 hygiene apply** — clean cluster, product line 분류
3. **TIER 2 183건 hygiene apply** — placeholder, naming hygiene
4. **TIER 2 + TIER 3 일괄 apply** (274건)
5. **다른 Mode C 또는 entity_deepen / H5+ tuning**

진행할 옵션 결정해주세요.

---

## Stage 29 (2026-05-19) — Mode C: Hosted MPC Backup and Recovery (Q-S09 partial)

### Trigger
사용자 결정 (Stage 28 TIER 1 hygiene complete 후): `hosted-mpc-backup-and-recovery.pdf` Mode C 우선 (Stage 22 Q-S09 1차 source pointer + Stage 28 normalize 완료). Hosted MPC / BCM / Recovery / Cold Wallet spine 직접 영향.

### Source 확보 (PDF Mode C, Method B-equivalent)

**시도된 acquisition methods**:
- curl (support URL): HTTP 403 (Cloudflare challenge)
- WebFetch: HTTP 403 (동일)
- **pdftotext (Poppler 26.04.0)**: ✓ 성공 — filesystem 만 사용 (body 미 LLM context 전체 로드)

**Pipeline**:
```
sources/.../pdf/hosted-mpc-backup-and-recovery.pdf
  ↓ pdftotext -layout
/tmp/waas-mode-c/hosted-mpc-backup-and-recovery.txt (87 lines, 4 KB)
  ↓ wc + grep section headers + sed chunked (3 × 30-line)
relevant section content → LLM context
```

→ **v3.2.2 정합**: PDF body 미 LLM context 전체 로드. Stage 24 의 Method B (curl + bash chunked) 동일 패턴 — PDF source 에 대해 `pdftotext` 가 curl 대응 도구.

### 신규 architectural 신호 (Stage 29 확보)

| 신호 | Description | 출처 |
|---|---|---|
| **3-share backup kit** | Hosted MPC = 1 mobile + 2 Guard (SaaS MPC = 1 mobile only) | Step 1 본문 |
| **2 air-gapped machines** | download + assembly 분리 (security pattern) | Step 1 + Step 2 |
| **RSA public key Console upload** | Guard share 암호화 keystore (customer 사전 RSA keypair 생성 필수) | Step 1 Note |
| **Asymmetric encryption layers** | mobile=passphrase, Guard=RSA — 두 plane 별개 protection | Step 1 |
| **Approval-triggered automation** | Backup approval = Guard share file 자동 생성 | Step 1 |

### Patch 진행 (7건, Option A)

| # | 파일 | 변경 |
|---|---|---|
| P1 | `sources/.../markdown/hosted-mpc-backup-and-recovery.md` | **신규** status:full body markdown |
| P2 | `sources/.../pdf/hosted-mpc-backup-and-recovery.meta.yml` | URL inferred → **confirmed** (real article ID `12902205245340` 발견) + crawl_status full-body |
| P3 | [entities/fireblocks/workspace-keys-backup.md](entities/fireblocks/workspace-keys-backup.md) | §"Stage 29 — Hosted MPC variant" 신규 (3-share matrix + 2-step workflow + RSA Console upload + Q-S09 partial 영역 표기) |
| P4 | [entities/fireblocks/mpc-key-share.md](entities/fireblocks/mpc-key-share.md) | §"Hosted MPC Backup 모델" — SaaS vs Hosted backup 비교 표 |
| P5 | [vendors/fireblocks/architecture.md](vendors/fireblocks/architecture.md) | §"Hosted MPC sub-series" + 신규 §"Hosted MPC B&R Flow Detail" + sub-series Stage 28 normalize 상태 표기 |
| P6 | [open-questions/fireblocks.md](open-questions/fireblocks.md) | **Q-S09 status: open → partial answered (Stage 29)** + 잔존 영역 explicit list |
| P7 | [vendors/fireblocks/risks.md](vendors/fireblocks/risks.md) | Risk-S09 cross-cut: 2 air-gapped machine 운영 burden + RSA keypair lifecycle + sovereign key trade-off |

### Eval 검증

| Metric | Stage 28 | Stage 29 | 변화 |
|---|---:|---:|---|
| verification 총수 | 51 → 50 | **50** | unchanged (Q-S09 still in set, partial) |
| open (PROMOTE_NEEDED) | 44 | **43** | -1 (Q-S09 transition) |
| partial answered (WEAK) | 6 | **7** | +1 (Q-S09 추가) |
| **Q7 retrieval quality** | 89.5% / 10.5% | **89.5% / 10.5%** | unchanged ✓ |

→ Q-S09 transition (open → partial) 정확히 반영. Open Q backlog 1건 advance.

### Q resolution 정리

| Q | Before | After | 잔존 |
|---|---|---|---|
| **Q-S09** | open (Stage 22 source pointer) | **partial answered (Stage 29)** | xprv+fprv / hardening 표준 / rotation / Recovery utility 절차 → paired Mode C `generating-a-workspace-key-backup-package-fireblocks-recovery-utility` |
| Q-S10 | open | **unchanged** | BCM adoption threshold — paired source 필요 (`hosted-mpc-workspace-configuration`) |
| Q-D07 (Workspace Keys Recovery 절차) | open | **partial signal** | 3-share assembly 패턴 보조 evidence |

### Hypothesis 유지 (★ Q-S09 잔존)

본 source 본문에서 명시 없음 — paired Mode C 시 추가 검증:
- **xprv+fprv** (extended private keys) — 본문에 "key shares" 표현만 있고 extended key 명시 없음. SaaS MPC 의 xprv+fprv 와 Hosted MPC 의 3-share kit 의 관계 불명
- **Air-gapped machine hardening 표준** — network isolation / physical security 의 정확한 요구사항
- **Rotation 정책** — backup kit 갱신 주기 / 사유

### Risk-S09 cross-cut 등재

Hosted MPC sovereign key 의 운영 cost 측면 — **3 운영 plane** (signing infra + BCM stack + B&R kit) 모두 customer 책임. Single air-gapped 머신 운영 시 download/assembly compromise 동시 노출 가이드 위반 위험.

### v3.2.2 정합 검증

- PDF body 미 LLM context 전체 로드 ✓ (pdftotext + bash chunked sed)
- 신규 entity 0 ✓ (Stage 6–29 = **24 stage 연속 0**)
- 새 hub 0 ✓
- Open Q status 변경: 1건 (Q-S09 partial advance) — 명시적 evidence 기반
- LLM 호출 0 ✓ (manual chunked extraction)
- Curated Wiki 보강: 3 entity/hub 정합 + 1 신규 risk subsection

### 운영 결정 enabled (★ user 명시 영역)

| 영역 | 답 가능 (Stage 29 이후) |
|---|---|
| Hosted MPC B&R 절차 표준화 | ✓ 2-step + 3-share + 2 air-gapped |
| RSA keypair lifecycle 관리 | ✓ customer Console upload + Guard share decryption 의존성 |
| BCM ↔ B&R cost trade-off | ✓ Hosted MPC = 3 customer-managed plane (signing + BCM + B&R) |
| sovereign key adoption ROI | ✓ Stage 22 의 sovereign framing 의 운영 cost 측면 명확화 |
| Cold Wallet ↔ Hosted MPC B&R 비교 | ★ Stage 14 Cold Wallet cluster catalog 의 paired source 필요 |

### Stage 28 의 high-value source 평가 검증

Stage 28 가 normalize 한 38 TIER 1 자료 중:
- **`hosted-mpc-backup-and-recovery.pdf`** ← 본 stage 처리 (Q-S09 partial)
- **`hosted-mpc-workspace-configuration.pdf`** ← Q-S10 1차 source, paired Mode C 후보 (defer)
- **`generating-a-workspace-key-backup-package-fireblocks-recovery-utility.pdf`** ← Q-S09 잔존 영역 (xprv+fprv / hardening) candidate
- **`policy-for-cold-wallet.pdf`** ← Cold Wallet × governance cross-cut
- 등

→ Stage 28 의 hygiene complete 가 본 Mode C 의 즉시 진행 가능성을 입증. Source Lake operational readiness 검증.

### Next 옵션
1. **paired Mode C** — `hosted-mpc-workspace-configuration` (Q-S10 BCM adoption threshold) — 본 stage 의 자연스러운 다음 단계
2. **paired Mode C** — `generating-a-workspace-key-backup-package-fireblocks-recovery-utility` — Q-S09 잔존 영역 (xprv+fprv / hardening) 해소
3. **paired Mode C** — `policy-for-cold-wallet` (Cold Wallet × governance Risk-G07 보강)
4. **TIER 3 hygiene apply** — 91건 product line 정규화 (가치 낮으나 Source Lake 청결)
5. **다른 entity_deepen / H5+ retrieval tuning**

---

## Stage 30 (2026-05-19) — Mode C: Workspace Key Backup Package (Q-S09 substantial advance)

### Trigger
사용자 결정 (Stage 29 Hosted MPC variant 후): paired Mode C 로 SaaS MPC variant 본문 ingest. Q-S09 잔존 영역 (xprv+fprv / Recovery utility / hardening / rotation) 해소 우선.

### Source 확보
- PDF (2.7 MB) → pdftotext -layout → 347 lines / 19 KB text
- 5 chunks via sed (각 50-70 lines) — body 미 LLM context 전체 로드 ✓
- v3.2.2 정합 (외부 도구 + chunked) ✓

### 신규 architectural 신호 6건

| 신호 | Description |
|---|---|
| **6-file backup package** | 2 curves (ECDSA + EDDSA) × 3 shares = 6 encrypted files |
| **RSA-4096 + AES-128** | Cryptographic spec (Stage 29 generic "RSA" → 정확 spec) |
| **Recovery Utility app** | Dedicated offline tool, Console 다운로드, USB transfer pattern |
| **48-hour approval window** | Owner + Admin Quorum 승인. 초과 시 process 재시작 |
| **Once-only backup kit download** | Single attempt — 실패 시 process 전체 재시작 |
| **QR-code / short-key bridge** | Offline ↔ online air-gapped bridge mechanism |

### Patch 진행 (7건, Option A)

| # | 파일 | 변경 |
|---|---|---|
| P1 | `sources/.../markdown/...generating-a-workspace-key-backup-package....md` | **신규** status:full body markdown (6-file + Recovery Utility + RSA-4096 + 48h + once-only) |
| P2 | `sources/.../pdf/...meta.yml` | URL inferred → **confirmed** (article ID `9716732961820`) + crawl_status full |
| P3 | [entities/fireblocks/workspace-keys-backup.md](entities/fireblocks/workspace-keys-backup.md) | §"Stage 30 — SaaS MPC variant (Recovery Utility flow)" 신규 + SaaS vs Hosted backup 비교 표 |
| P4 | [entities/fireblocks/mpc-key-share.md](entities/fireblocks/mpc-key-share.md) | §"SaaS MPC Backup 모델" 신규 (6-file + RSA-4096 + AES-128) |
| P5 | [vendors/fireblocks/architecture.md](vendors/fireblocks/architecture.md) | DR Service spec 보강 (xprv+fprv = 6 encrypted shares + Stage 30 cross-ref) |
| P6 | [open-questions/fireblocks.md](open-questions/fireblocks.md) | **Q-S09 partial answered → partial answered (substantial advance, Stage 30)** + 잔존 영역 명시 |
| P7 | [vendors/fireblocks/risks.md](vendors/fireblocks/risks.md) | Risk-S09 cross-cut 강화 (48h window / once-only / RSA private key 분실 / QR bridge spoofing / DR readiness 검증) |

### SaaS MPC vs Hosted MPC backup 비교 (Stage 29 + Stage 30 paired)

| 항목 | SaaS MPC (Stage 30) | Hosted MPC (Stage 29) |
|---|---|---|
| File count | **6 files** (ECDSA + EDDSA × 3) | 3 files |
| Curves | **ECDSA + EDDSA 명시** | "key shares" (curve 명시 없음) |
| Cloud share encryption | RSA-4096 (customer upload) | N/A |
| Guard share encryption | N/A | RSA (customer upload) |
| Mobile share encryption | passphrase | passphrase |
| RSA spec | **RSA-4096 + AES-128** | generic "RSA" |
| Tool | **Recovery Utility app** | (별도 명시 없음) |
| Air-gapped 머신 수 | 1 (Recovery Utility offline) + online | 2 (download + assembly) |
| Approval window | **48 hours** | (명시 없음) |
| Download | **Once only** | (명시 없음) |

→ 두 source paired 로 Workspace Keys Backup spine 의 **full operational reasoning layer** 완성.

### Q resolution 정리

| Q | Before | After (Stage 30) |
|---|---|---|
| **Q-S09** | partial answered (Stage 29, Hosted MPC procedure outline) | **partial answered (substantial advance, Stage 30)** — Hosted (Stage 29) + SaaS Recovery Utility full (Stage 30). xprv+fprv backup 단위 = 6 files. Rotation / reconstruction / DR Service operation 잔존. |
| Q-D07 (Workspace Keys Recovery) | open | **partial signal** (backup 측 명세, reconstruction 측 별도) |

### Eval 검증

| Metric | Stage 29 | Stage 30 | 변화 |
|---|---:|---:|---|
| verification 총수 | 50 | **50** | unchanged (Q-S09 still partial) |
| open (PROMOTE_NEEDED) | 43 | **43** | unchanged |
| partial answered (WEAK) | 7 | **7** | unchanged (Q-S09 substantial advance 라벨만, status 자체는 partial 유지) |
| answered (PASS) | 0 | 0 | unchanged |
| **Q7 retrieval quality** | 89.5% / 10.5% | **89.5% / 10.5%** | unchanged ✓ |

→ Status 변경 없음 (substantial advance 는 partial 안의 quality 향상). Eval 통계는 동일하지만 Q-S09 의 답 깊이는 큰 폭 advance.

### Hypothesis 잔존 (★ explicit remaining scope)

본 source + Stage 29 paired 로도 미해결:
- **Rotation 정책** — 본 자료에 명시 없음
- **Recovery/reconstruction procedure** — 별도 doc **"Recovering private key material"** (Stage 30 Related Articles 명시) 가 1차 source → paired Mode C 후보
- **DR Service operation 측면** — Fireblocks 측의 SPOC-classified DR service 운영 (Stage 8 architecture 의 SPOC 경고)
- **Formal air-gapped hardening 표준** — NIST CSP / FIPS 같은 formal 표준은 본 자료 없음 (procedural pattern 만)

### v3.2.2 정합 검증
- PDF body 미 LLM context 전체 로드 ✓ (pdftotext + chunked sed, 5 chunks)
- 신규 entity 0 ✓ (Stage 6–30 = **25 stage 연속 0**)
- 새 hub 0 ✓
- Open Q status 변경 0 (substantial advance 는 partial 의 quality 향상)
- LLM 호출 0 (manual chunked extraction)
- Curated Wiki 보강: 3 entity/hub + 2 risk strengthening

### 운영 결정 enabled (★ user 명시 영역)

| 영역 | 답 가능 (Stage 30 이후) |
|---|---|
| SaaS MPC backup ceremony 표준화 | ✓ 6-file + Recovery Utility + 48h + once-only |
| RSA keypair lifecycle (SaaS) | ✓ RSA-4096 + AES-128 + Recovery Utility 또는 manual openssl |
| Hosted MPC vs SaaS backup 비교 | ✓ Stage 29 + Stage 30 paired full comparison |
| DR readiness 검증 | ✓ "testnet workspace first" 권장 + Recovery Utility flow 실행 |
| operational fragility 평가 | ✓ 48h window / once-only / QR bridge / RSA private key 분실 risks |
| sovereign backup adoption ROI | ✓ 두 plane (SaaS + Hosted) 모두 customer-managed operational cost 명확 |

### Recovery 측 reconstruction Mode C (★ future)

본 stage 의 자연스러운 paired:
- **`recovering-private-key-material.pdf`** — Q-S09 잔존 영역 (reconstruction) 의 1차 source
  - 6-file backup package 가 어떻게 reconstruction 되는지
  - air-gapped 환경에서 xprv+fprv 재구성 procedure
  - DR Service operation 측면

본 source 는 Stage 12 placeholder 또는 Source Lake raw 상태. 추가 Mode C 시 Q-S09 full answer 가능성 평가.

### Next 옵션
1. **`recovering-private-key-material` Mode C** — Q-S09 잔존 reconstruction 영역 해소 (paired with Stage 30)
2. **`hosted-mpc-workspace-configuration` Mode C** — Q-S10 BCM adoption threshold
3. **`policy-for-cold-wallet` Mode C** — Stage 14 Cold Wallet × governance Risk-G07
4. **TIER 3 hygiene apply** (91건)
5. **다른 entity_deepen / H5+ tuning**

---

## Stage 31 (2026-05-19) — Mode C: Reconstruction (Q-S09 ANSWERED) + Fireblocks Deepening Close

### Trigger
사용자 결정 (Stage 30 backup spine 완성 후): `recovering-private-key-material.pdf` Mode C 로 Q-S09 reconstruction (operation) 잔존 영역 해소. **본 stage = 마지막 Fireblocks deepening stage**. 이후 custody wallet 시스템 설계 / DB 설계 단계 전환.

### Source 확보
- PDF (1.2 MB) → pdftotext -layout → 165 lines / 8.5 KB text
- 3 chunks via sed — body 미 LLM context 전체 로드 ✓
- Stage 12 placeholder (TIER 2-deferred) → **Stage 31 full body markdown** (TIER 1, status:full) 승격

### 신규 architectural 신호 5건

| 신호 | Description |
|---|---|
| **4-secret reconstruction model** | Recovery Kit ZIP + RSA private key + Mobile passphrase + RSA private key passphrase |
| **Strict offline-only mandate** | Online 실행 시 키 "considered exposed and compromised" (vendor 공식 compromise 선언) |
| **Auto-passphrase = 2-key system** | Mobile passphrase + 그 passphrase 의 별도 RSA encryption keypair → reconstruction 시 5 secrets |
| **JSON automation v1.8.0+** | Passphrase manual entry 회피 alternative |
| **Backup → reconstruction full cycle complete** | Stage 29 + 30 + 31 paired full operational lifecycle |

### Patch 진행 (7건, Option A)

| # | 파일 | 변경 |
|---|---|---|
| P1 | `sources/.../recovering-private-key-material.md` | Stage 12 placeholder → **status:full** body markdown (Stage 31 Mode C) |
| P2 | `sources/.../recovering-private-key-material.meta.yml` | URL inferred → **confirmed** (article ID `9716757315996`) |
| P3 | [entities/fireblocks/workspace-keys-backup.md](entities/fireblocks/workspace-keys-backup.md) | §"Stage 31 — Reconstruction Procedure" 신규 (3-step + 4-secret model + auto-passphrase variant + JSON automation + full cycle 흐름) |
| P4 | [entities/fireblocks/mpc-key-share.md](entities/fireblocks/mpc-key-share.md) | §"Reconstruction 모델 (Stage 31)" 신규 |
| P5 | [vendors/fireblocks/architecture.md](vendors/fireblocks/architecture.md) | DR Service operational lifecycle full (Stage 8 + 29 + 30 + 31 paired) |
| P6 | [open-questions/fireblocks.md](open-questions/fireblocks.md) | **Q-S09: partial → ANSWERED (procedural full cycle, Stage 31)** + **Q-S01: open → partial signal (Stage 31)** |
| P7 | [vendors/fireblocks/risks.md](vendors/fireblocks/risks.md) | Risk-S09 final fragility signals (6 reconstruction-side signals: offline mandate / 4-secret aggregation / 5-secret auto / JSON file consolidation / version dependency / DR test fragility) |

### Eval 검증 (Stage 30 → Stage 31)

| Metric | Stage 30 | Stage 31 | 변화 |
|---|---:|---:|---|
| verification 총수 | 50 | **49** | Q-S09 answered 후 verification set 제외 |
| open (PROMOTE_NEEDED) | 43 | **42** | Q-S01 partial 전환 (-1) |
| partial answered (WEAK) | 7 | **7** | Q-S09 leaving + Q-S01 entering = 0 net |
| answered (PASS) | 0 | 0 | unchanged (verification answered Q 는 set 에서 제외) |
| **Q7 retrieval quality** | 89.5% / 10.5% | **89.5% / 10.5%** | unchanged ✓ |

→ Q-S09 transition + Q-S01 transition 정확 반영. Q backlog: open 1 감소, verification 총 1 감소 (Q-S09 answered).

### Q resolution 정리

| Q | Before | After (Stage 31) |
|---|---|---|
| **Q-S09** | partial answered (substantial advance, Stage 30) | **ANSWERED (procedural full cycle, Stage 31)** — Stage 29 + 30 + 31 paired evidence. 잔존 (rotation / formal hardening) 은 org compliance 영역, vendor docs 외. |
| **Q-S01** | open | **partial signal (Stage 31)** — Auto-passphrase = 2-key system 식별. Generation algorithm / entropy / storage 잔존. |
| Q-D07 (Workspace Keys Recovery) | partial signal (Stage 30) | **partial signal advance** — reconstruction 측 본문 추가 (full cycle 명시) |

### Backup → Reconstruction Full Cycle (Stage 29 + 30 + 31 통합)

```
BACKUP (Stage 30 SaaS / Stage 29 Hosted):
  Console → Recovery Utility → RSA keypair 생성
  ↓
  Owner + Admin Quorum approval (48h) → QR/short-key bridge
  ↓
  6-file (SaaS) 또는 3-share (Hosted) backup package download (once-only)

RECONSTRUCTION (Stage 31):
  Offline machine ONLY → Recovery Utility → Recover Private Keys
  ↓
  4-secret input: Recovery Kit ZIP + RSA private key + Mobile passphrase + RSA private key passphrase
  (Auto-passphrase variant = 5 secrets)
  ↓
  Verification → Accounts page → xprv + fprv reconstruction complete
```

→ DR Service operational lifecycle 의 procedural answer **complete**. Customer org compliance 영역만 잔존 (rotation / formal hardening).

### v3.2.2 정합 검증
- PDF body 미 LLM context 전체 로드 ✓ (pdftotext + 3 chunks sed)
- 신규 entity 0 ✓ (Stage 6–31 = **26 stage 연속 0**)
- 새 hub 0 ✓
- Open Q status 변경: 2건 (Q-S09 partial→answered, Q-S01 open→partial) — 명시적 evidence 기반
- LLM 호출 0 (manual chunked extraction)

### Risk-S09 final framing (Stage 31 추가 6 signals)

- Offline-only mandate (online 실행 = 공식 compromise)
- 4-secret single-point aggregation
- Auto-passphrase +1 secret (5 total) trade-off
- JSON automation 의 plaintext consolidation risk
- Recovery Utility version dependency
- DR test 의 production key compromise risk (testnet first 권장)

→ Stage 8 SPOC 경고가 procedural 실제 의미로 완전 framing.

---

## ★ Fireblocks Deepening Close (Stage 6–31)

**26 stages 누적 결과** (Stage 6 entity-min discipline 시작 이후):

### Curated Wiki 최종 통계
- **Vendor hubs**: 16
- **Entities**: 24
- **User roles**: 9
- **Open Questions**: 73 (answered 25 / partial answered 7 / open 42)
- **Source Lake**:
  - Raw PDF: 605
  - Normalized PDF: 184 (TIER 1 모두 정규화 + meta.yml)
  - Markdown ingest: ~112 (TIER 1 lightweight indexes + cluster catalogs + full body)
  - Sitemap: 716 URLs (Stage 15 llms.txt)
- **Risks 등재**: 16 (S01-S16, G01-G07)
- **신규 entity 생성**: **0** (Stage 6–31 = **26 stage 연속 0**, entity-min discipline 완전 유지)

### Automation scripts (P1–P5 MVP)
- `lib/wiki_scanner.py` (H1-H4 retrieval tuning 통합)
- `lib/triage.py` (TIER 분류 알고리즘, Stage 26 보강)
- `generate_questions.py` (P1, Stage 20)
- `retrieval_eval.py` (P3, Stage 20)
- `retrieval_gap_detector.py` (P4, Stage 21)
- `promote_candidates.py` (P4, Stage 21)
- `source_triage.py` (P5, Stage 25, `--only-slugs` filter Stage 27)
- `triage_review.py` (Stage 25 TIER 1 review)

### Q7 retrieval quality 유지
- **PASS 89.5% / FAIL+PROMOTE 10.5%** (target ≥ 70% / ≤ 20%) — 26 stages 동안 unchanged ✓

### Spine 완성도

| Domain | Hub | Entity | Open Q (open/partial/answered) | 최근 deepening |
|---|---|---|---|---|
| Workspace Management | architecture / blockchains / lifecycle-events / user-management / overview | workspace / vault-account / sandbox-workspace | partial-strong | Stage 22 (Hosted MPC) |
| Identity-Auth | authentication / api / cosigner / callback-handler / user-management | api-user / api-key / csr / console-user / 2fa / sso / cosigner / api-co-signer / callback-handler / user-roles ×9 | answered-many | Stage 24 (Callback Handler) |
| Governance | policy-engine* / tap* / compliance | policy / admin-quorum / approval-group / designated-signer / transaction | answered-many | Stage 14 / 16 |
| Mobile-Recovery | mobile-app / mpc | mobile-device / mpc-key-share / recovery-passphrase / workspace-keys-backup | **Stage 31 Q-S09 ANSWERED** | **Stage 29-31** |
| Security-Access | security / risks | ip-allowlist / cosigner | answered-many | Stage 16 |

*policy-engine / tap = empty stub (Stage 16 health check W-2 식별, future deferred)

### Architectural reasoning layer 완성 영역
- 3-Level Governance (Admin Quorum → Approval Group → Policy sub-quorum)
- 3-endpoint signing (MPC-CMP 2 cloud + 1 customer)
- 3-way TEE plane (AWS Nitro / Intel SGX / GCP Confidential Space)
- 5-option Callback Handler authentication
- 5-priority-domain spine (Workspace-Management / Identity-Auth / Governance / Mobile-Recovery / Security-Access)
- SaaS MPC vs Hosted MPC variant (2 plane)
- Backup → Reconstruction full cycle (4-5 secret model)
- BCM ↔ Hosted MPC pairing
- Off-Exchange ↔ Hosted MPC pairing (Stage 22)
- Sovereign key management framing

### 다음 단계 (★ Fireblocks → Generalized Wallet Architecture Design)

본 stage 이후 추가 Fireblocks deepening 중단. **Fireblocks reasoning 을 일반화한 custody wallet 설계 단계** 로 전환:

1. **Custody wallet architecture** — vault / wallet / asset / transaction model 일반화
2. **Signing / approval workflow** — Admin Quorum + Approval Group + Policy 의 generalized form
3. **Vault / wallet / transaction model** — Vault Account 의 일반화된 hierarchy
4. **Recovery / DR model** — backup → reconstruction full cycle 의 generalized procedure + secret aggregation 패턴
5. **Audit / webhook / callback architecture** — Callback Handler 5-option + Audit Log + webhook plane
6. **Governance / policy model** — Policy Engine + DCCP + 3-level Governance 의 generalized form

Source Lake 의 Fireblocks 자료는 **reference / 검증 source** 로 유지. Curated Wiki 의 entity / hub spine 은 generalized 설계의 reasoning baseline.

**Fireblocks deepening close timestamp**: 2026-05-19, Stage 31.

---

## Stage 32 D1a — Vault / Wallet / Ledger DB Schema Reasoning (2026-05-19)

### 새 layer 도입: `docs/architecture/`

**Curated Wiki / Source Lake 와 별도의 architecture reasoning 전용 layer**. Fireblocks vendor docs 의 정리/요약이 아니라 **generalized custody wallet design reasoning** 을 영속 저장.

### 신규 파일

- `docs/architecture/vault-wallet-ledger-db-schema.md` (D1a) — 9-plane DB topology / aggregate boundary / ER diagram + table / append-only vs mutable / event sourcing boundary / recovery metadata 격리 / SaaS·self-hosted·direct-build ownership 비교 / Q1-Q10 reasoning / org policy 영역 분리.

### 9-Plane DB Topology 정의

| Plane | 책임 | 저장 특성 |
|---|---|---|
| L1 Identity / Tenancy | Tenant / Workspace / User / Membership / Role / API Key | mutable + audit-emit |
| L2 Custody Hierarchy | Vault / Wallet / Address / Asset Registry | mostly mutable + immutable key-ref |
| L3 Ledger | Internal double-entry Account / Entry | **append-only** |
| L4 Operational State | Transaction / Signing Request / Approval Request / Policy Eval | state-machine + transition log |
| L5 Policy / Config | Policy Version / Approval Group / Quorum / Callback Config | **versioned** (publish=immutable) |
| L6 Audit / Event | Audit Log / Webhook Event / State Transition Log | **append-only, immutable** |
| L7 Recovery / DR | Recovery Kit / Custodian Dist / DR Exercise / Air-gapped Machine | **cold storage class (별도 plane)** |
| L8 Signer Topology | MPC Signer / Cosigner / TEE Attestation | operational metadata **only** (no secrets) |
| L9 Blockchain Cache | Network / Blockheight / Confirmed Tx Cache / Mempool | rebuildable cache |

### Core invariants 정립

1. **Secrets 자체는 DB 에 절대 저장 금지** — DB 는 reference / lifecycle state / metadata / verification public material 만.
2. **append-only / mutable / secret metadata / recovery metadata 4 종 분리** = schema 의 핵심 invariant.
3. **Selective Event Sourcing** — L3 Ledger + L6 Audit/Webhook + Approver Decision 만 full ES. 나머지는 CRUD + outbox emission.
4. **L7 별도 storage class** (4 motive: access policy / backup cadence / compliance regime / blast radius).
5. **Vendor lock-in pivot point**: L3 (Ledger) + L6 (Audit).

### 10 reasoning question 정답 (요약)

| Q | 답 |
|---|---|
| Q1 Vault 는 governance boundary? | No — Workspace 가 governance, Vault 는 custody grouping |
| Q2 Wallet 은 asset-specific? | Yes — (vault × asset) deterministic address tree |
| Q3 Ledger append-only? | Yes — double-entry + compensating entry 패턴 |
| Q4 Blockchain ↔ internal reconcile? | Watermark + confirmation depth + reorg compensating LedgerEntry |
| Q5 Approval 별도 aggregate? | Yes — Transaction 과 lifetime / progression 독립 |
| Q6 SigningRequest 와 Transaction 분리? | Yes — 1 Tx → N Signing, signer plane coupling 격리 |
| Q7 Recovery metadata 별도 storage class? | 4 motive (access / backup / compliance / blast radius) |
| Q8 Audit Log: ES vs append-only? | append-only log 권장; Ledger / Approval Decision 만 ES |
| Q9 Callback ↔ Transaction 연결? | Tx.id → SigningRequest.tx_id → CallbackEvent.signing_request_id |
| Q10 SaaS / self-hosted / direct-build ownership? | 동일 9-plane; 누가 어느 plane 을 소유하는가만 다름 |

### Aggregate roots 식별

Tenant / Workspace / Vault / Wallet / Transaction / SigningRequest / ApprovalRequest / PolicyVersion / RecoveryKit / MpcSigner

**Aggregate 가 아닌 것** (pure event store): AuditLog / LedgerEntry / WebhookEvent / ApproverDecision

### 다음 단계 (D1b 이후)

- D1b — Reconciliation (watermark / confirmation / reorg compensation 알고리즘)
- D2 — Signing Orchestration (L4 SigningRequest + L8 signer plane state machine)
- D3 — Approval State Machine (L4 ApprovalRequest + policy evaluation engine)
- D4 — Recovery Ceremony Generalized (L7 break-glass procedure full cycle)
- D5 — Audit / Webhook / Event Sourcing (L6 outbox + consumer + projection pattern)
- D6 — 3-way Decision Framework (SaaS / self-hosted / direct-build 의사결정 framework)

### Uncertainty boundary 유지

- 9-plane / aggregate boundary / ES boundary / L7 격리 = **generalized architecture pattern (Hypothesis ★)**. 특정 vendor internal schema 와 동일하다고 주장하지 않음.
- 추천 pattern (§8) 은 운영 관점 권장 — fact 분리.
- §10 에 org / compliance / cost / sovereignty 별 결정 영역 명시.

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/vault-wallet-ledger-db-schema.md` | **신규 생성** (~12 sections + Mermaid topology + Mermaid ER diagram + entity table) |
| `log.md` | Stage 32 D1a 항목 append (본 항목) |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 27 consecutive stages: 6-32).

### Spine 상태

- Curated Wiki entity / hub: unchanged (27 stages 누적)
- Source Lake: unchanged
- 신규 layer: `docs/architecture/` (1 file)
- Retrieval Q7 metrics: unchanged

---

## Stage 32 D2 — Signing Workflow & MPC Orchestration Reasoning (2026-05-19)

### 신규 파일

- `docs/architecture/signing-workflow-orchestration.md` (D2) — 10 sub-plane signing workflow / MPC orchestration runtime model / 4 분리 state machine (Tx / Approval / SigningRequest / Broadcast) / Callback B5 trust boundary 5-auth + 2-key asymmetry / 4-layer idempotency + 3 retry 종류 / Reconciliation boundary (D1b handoff) / TEE B3 + Signer Topology B9 / 3-way burden map / Q1-Q10 reasoning / org policy 영역 분리.

### 호환성 정책 적용

D1a 의 Mermaid 호환성 fix 결과 직접 반영:
- `graph TB` 만 사용 (`flowchart` / `stateDiagram-v2` / `erDiagram` 회피)
- 모든 node label `"..."` quote
- classDef trailing semicolon 제거
- `subgraph X["label"]` 회피
- State machine 은 graph TB transition 방식 (Option y)

### Core invariants 정립

1. **Approval success ≠ Signing success ≠ Blockchain confirmation** — 3 phase 독립 trust system.
2. **4 분리 state machine** — Tx / Approval / SigningRequest / Broadcast. 단일 SM 통합 시 governance / cryptographic / network 관심사 혼재.
3. **S5 MPC orchestration = runtime stateful plane** — persistent storage 아닌 in-memory coordinator + heartbeat. 의도된 simplification (Round 의 ephemeral state 가 SM persistent boundary 안에 들어오면 ES 복잡도 폭증).
4. **MPC retry ≠ idempotent retry** — nonce reuse = key leak. 매 retry 는 새 SigningAttempt + 새 nonce.
5. **Callback Handler = B5 trust boundary, fail-closed default** — enable 시 handler 응답 없음/검증 실패/timeout 모두 CALLBACK_DENIED.
6. **D2 boundary = INCLUDED_IN_BLOCK 까지** — depth / reorg / finality 처리는 D1b 영역.
7. **Lock-in pivot point**: S5 orchestrator + S8 multi-RPC + S9 confirmation tracking = burden 의 ~80% (★ Hypothesis).

### 10 reasoning question 정답 (요약)

| Q | 답 |
|---|---|
| Q1 SigningRequest 와 Transaction 분리? | 1 Tx → N attempt + signer coupling 격리 + MPC ephemeral state 분리 |
| Q2 Approval success ≠ Signing success? | 다른 trust domain (governance vs cryptographic) + callback 별개 gate |
| Q3 Signing success ≠ Blockchain confirmation? | Sign → mempool → block → confirmed → final 각 → 별개 trust assumption |
| Q4 Callback Handler operational 의미? | B5 boundary 가 customer governance plane 을 vendor signing pipeline 에 inject |
| Q5 Offline approval vs online signing? | Approval SLA = hours/days, Signing SLA = seconds/minutes (MPC realtime round) |
| Q6 MPC orchestration state machine? | SIGNING_IN_PROGRESS = single state, sub-state (round X) = heartbeat only |
| Q7 Partial signature lifecycle? | Ephemeral runtime memory only; persistence = evidence digest + attestation |
| Q8 MPC retry 가 어려운 이유? | Nonce reuse → mathematically derivable key (general MPC property) |
| Q9 Blockchain-specific complexity? | Account vs UTXO / finality / mempool / RBF / reorg depth — adapter pattern, D1b owner |
| Q10 Vendor abstraction 이 숨기는 complexity? | S5/S8/S9 + chain adapter + audit aggregation = direct-build 시 customer burden 90% |

### 4 분리 state machine

| SM | Aggregate | Terminal |
|---|---|---|
| TransactionStateMachine | Transaction | CONFIRMED / FAILED / CANCELLED |
| ApprovalRequestStateMachine | ApprovalRequest | APPROVED / REJECTED / EXPIRED |
| SigningRequestStateMachine | SigningRequest | ARTIFACT_PERSISTED / FAILED |
| BroadcastStateMachine | BroadcastAttempt | CONFIRMED / REJECTED / REPLACED |

### Trust boundary 식별 (B1-B9)

새로 식별된 boundary:
- **B8 RPC / Chain Provider** (signing 시 broadcast 신뢰 boundary)
- **B9 Signer Topology** (rogue signer / stale signer 차단)

기존 (Curated Wiki) boundary:
- B3 TEE (Stage 19), B5 Callback Handler (Stage 24), B7 Approval (Stage 14 / 16)

### 10 sub-plane signing workflow (S1-S10)

S1 Request / S2 Policy eval / S3 Approval coupling / S4 Callback coupling (B5) / S5 MPC orchestration (runtime) / S6 Signer endpoint / S7 Artifact / S8 Broadcast / S9 Confirmation tracking / S10 Signing audit

→ S5 만 runtime stateful, 나머지는 persistent (storage class 별 D1a 매핑).

### 3-way burden 비교

- SaaS: customer burden ~15% (callback impl + approver mobile + policy design)
- Hosted MPC: ~40% (+ cosigner hosting + key share + audit mirror)
- Direct-build: ~100% (+ MPC lib + orchestrator availability + multi-RPC + reorg + TEE + signer enrollment)

★ Hypothesis — operational reasoning 기반, vendor 별 측정 아님.

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/signing-workflow-orchestration.md` | **신규 생성** (~13 sections + Mermaid 10+ diagrams) |
| `log.md` | Stage 32 D2 항목 append (본 항목) |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 28 consecutive stages: 6-32).

### 다음 단계 (D3 이후)

- D1b — Blockchain Reconciliation (watermark / depth / reorg compensation algorithm)
- D3 — Approval State Machine (policy evaluation engine / quorum / escalation / delegation)
- D4 — Recovery Ceremony Generalized (L7 cold plane break-glass full cycle)
- D5 — Audit / Event Sourcing (L6 outbox + consumer + projection pattern)
- D6 — 3-way Decision Framework

### Uncertainty boundary 유지

- 10 sub-plane / 4 SM / B5 fail-closed / MPC retry non-idempotent / orchestrator burden 80% = **generalized architecture pattern (Hypothesis ★)**.
- Fireblocks 의 3-endpoint MPC-CMP / 5-callback auth / 3-way TEE 는 reference model 로 인용.
- §9.4 추천 architecture = 운영 관점 권장 — fact 와 분리.
- §11 에 org policy 영역 명시.

### Spine 상태

- Curated Wiki entity / hub: unchanged (28 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: 2 files (D1a + D2)
- Retrieval Q7 metrics: unchanged

---

## Stage 32 D3 — Approval State Machine & Governance Workflow Reasoning (2026-05-19)

### 신규 파일

- `docs/architecture/approval-state-machine-governance.md` (D3) — G1-G10 governance sub-plane / 11-state governance state machine / quorum collection model / policy evaluation lifecycle / two-clock timeout (window vs evidence freshness) / escalation vs break-glass 분리 / governance audit immutability / Approval ↔ Signing boundary / 10-item operational fragility map / 3-way governance burden / Q1-Q10 reasoning.

### Core invariants 정립

1. **Policy pass ≠ Approval complete ≠ Signing authorized ≠ Signing success** — 4 단계 분리.
2. **Approval aggregate ⊥ Signing aggregate** — 다른 trust domain (human governance vs cryptographic execution).
3. **Approval evidence freshness > approval timestamp** — "fresh enough to authorize now" 가 core invariant.
4. **PartiallyApproved 는 1급 operational state** — quorum collection 의 대부분 시간 + fragility surface.
5. **STALE_EVIDENCE 는 별도 terminal-fail state** — timeout 과 분리 (policy version drift / freshness loss 의 forensic).
6. **Append-only governance evidence chain** — current state 보다 evidence chain 이 audit subject.
7. **Emergency break-glass = 위험 ↑ + audit ↑↑** — bypass 의 audit + post-hoc review SLA 가 마지막 방어선.
8. **Human coordination = irreducible fragility** — automation 의 자연 limit.

### 11-state governance state machine

DRAFT → POLICY_EVALUATING → AWAITING_APPROVAL → PARTIALLY_APPROVED → {APPROVED / REJECTED / EXPIRED / CANCELLED / ESCALATED / EMERGENCY_APPROVED / STALE_EVIDENCE}

→ 단순 3-state (Pending/Approved/Rejected) 가 governance fragility 표현 불가. 특히 PARTIALLY_APPROVED + STALE_EVIDENCE + ESCALATED + EMERGENCY_APPROVED 4 개 state 가 forensic / SLA / risk metric 의 기반.

### 10 reasoning question 정답 (요약)

| Q | 답 |
|---|---|
| Q1 11-state 이유? | PartiallyApproved + StaleEvidence + Escalated + Emergency 4 state 가 governance forensic 의 기반 |
| Q2 Approval ≠ Signing? | 다른 trust domain; envelope 검증이 firewall |
| Q3 Quorum collection 이 어려운 이유? | Threshold mode 다양성 + concurrent race + role 변경 + duplicate + policy drift |
| Q4 Policy eval lifecycle invariant? | PolicyVersion pinning at request time (D1a L5 versioned-immutable 활용) |
| Q5 Expiration semantics? | Two-clock: Window (W) vs Freshness (F) — 다른 invariant, 다른 audit |
| Q6 Re-approval / cancel / escalation 분리? | 셋은 다른 governance event, 다른 audit trail |
| Q7 Break-glass 위험? | abuse vector + frequency = anomaly signal; quorum + post-hoc review 강제 |
| Q8 Approval ↔ Signing coupling? | Signed decision envelope = trust boundary protocol; 1 envelope = 1 SigningRequest 권장 |
| Q9 Audit immutability 이유? | non-repudiation + forensic reconstruction + 규제 (SOC2/ISO/SOX) |
| Q10 Multi-actor coordination irreducible complexity? | Human approver 가용성 = automation 의 자연 limit |

### G1-G10 governance sub-plane

G1 Policy / G2 Approval Request / G3 Quorum collection / G4 Approver identity / G5 Notification / G6 Freshness / G7 Escalation / G8 Break-glass / G9 Governance audit / G10 Decision delivery

→ G3 / G8 / G9 = append-only. G6 = runtime invariant (persist 안 함, 매 check 재계산). G10 = trust boundary (Signing 으로의 envelope handoff).

### 10-item operational fragility map (mitigation 명시)

| # | Fragility | Mitigation |
|---|---|---|
| F1 | Partial approval 장기 정체 | Escalation rule + SLA monitoring |
| F2 | Approver role 변경 | Decision validity = decision-time role only |
| F3 | Policy version drift | PolicyVersion pinning at request time |
| F4 | Concurrent approval race | Append-only events + atomic threshold check |
| F5 | Replay approval | Envelope nonce + single-use property |
| F6 | Duplicate approval | Last-decision-wins + audit on change |
| F7 | Signing retry 시 재승인 | Org policy: re-approve or reuse |
| F8 | Timeout ambiguity | W vs F 분리 + separate audit |
| F9 | Emergency abuse | Break-glass quorum + frequency SLO |
| F10 | Human coordination dependency | Irreducible — design with awareness |

→ F4-F6 = concurrency (fully mitigatable); F3/F7 = versioning (policy-driven); F1/F8 = temporal (hybrid); F2/F9/F10 = human/cultural (irreducible).

### 3-way governance burden 비교

- SaaS: customer governance burden ~25% (정책 작성 + approver onboarding + break-glass authority + audit export)
- Hosted MPC: ~50% (+ custom escalation + audit mirror + policy migration + IdP 통합)
- Direct-build: ~100% (+ policy engine 자체 구축 + quorum collection 서비스 + mobile approval app + notification fan-out + audit storage + break-glass system + freshness runtime + escalation engine + envelope protocol)

Governance lock-in pivot: G1 policy engine + G5 notification + G3 quorum UI + G7 escalation engine + G9 audit storage = burden 의 ~80% (★ Hypothesis).

### Escalation vs Break-glass 분리

| 차원 | Escalation | Break-glass |
|---|---|---|
| 언제 | normal flow 미완료 | emergency |
| Authorize | escalation rule | emergency authority (별도 quorum) |
| Audit | 표준 | mandatory post-hoc review + 별도 class |
| 빈도 | 일상적 | 드문 (frequency = anomaly signal) |
| Auto | rule-driven 가능 | human-only |
| PolicyVersion | 기존 pinned | break-glass policy / override clause |

### Recovery governance 연결 (Stage 29-31 활용)

Recovery ceremony 의 governance burden:
- 48h approval window = approval freshness 의 특수 사례
- Once-only download fragility = governance evidence 의 single-use property
- Custodian distribution = quorum 의 oversized form

→ Recovery 는 break-glass + 강화된 quorum 의 결합. 일반 approval flow 보다 governance complexity 1 단계 위 — D4 의 reasoning baseline.

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/approval-state-machine-governance.md` | **신규 생성** (~13 sections + Mermaid 10+ diagrams) |
| `log.md` | Stage 32 D3 항목 append (본 항목) |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 29 consecutive stages: 6-32).

### Mermaid 호환성 정책 유지

D1a / D2 의 fix 결과 직접 반영:
- `graph TB` 만 사용
- 모든 node label `"..."` quote
- classDef trailing semicolon 제거
- State machine = graph TB transition 방식 (Option y)

### Uncertainty boundary 유지

- G1-G10 / 11-state SM / two-clock model / break-glass abuse pattern / 80% burden 분포 = **generalized governance architecture pattern (Hypothesis ★)**.
- Fireblocks 의 3-level governance 는 reference model 로 인용.
- §10.2 burden 백분율 = operational reasoning estimate, 측정값 아님.
- §10.4 추천 architecture = 운영 권장, fact 아님.
- §11 에 org policy 영역 명시 (W / F / threshold mode / role change 처리 / re-approval / break-glass authority / DSL 선택 / 등).

### 다음 단계 (D4 이후)

- D1b — Blockchain Reconciliation (watermark / depth / reorg compensation algorithm)
- D4 — Recovery Ceremony Generalized (Stage 29-31 의 generalized full cycle, §6.5 reasoning 확장)
- D5 — Audit / Event Sourcing (G9 governance audit + L6 audit 통합 outbox + projection)
- D6 — 3-way Decision Framework (§10.4 의사결정 framework formalize)

### Spine 상태

- Curated Wiki entity / hub: unchanged (29 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: 3 files (D1a + D2 + D3)
- Retrieval Q7 metrics: unchanged

---

## Stage 32 D4 — Recovery Ceremony Generalization Reasoning (2026-05-19)

### 신규 파일

- `docs/architecture/recovery-ceremony-generalization.md` (D4) — Core thesis: "Recovery is not a backup procedure. Recovery is a governance ceremony under cryptographic risk." / R1-R10 recovery sub-plane / 12-state recovery ceremony SM / custodian quorum vs admin quorum 비교 / 4-5 secret reconstruction generalized form / secret material lifecycle (R6 exposure boundary) / 3-clock recovery window model / re-enrollment mandatory invariant / break-glass recovery 의 specialized form / recovery audit immutability / 10-item operational fragility map / Recovery ↔ Approval ↔ Signing ↔ Ledger boundary / 3-way burden / Q1-Q10 reasoning.

### Core invariants 정립

1. **Recovery ≠ backup procedure** — governance ceremony under cryptographic risk (core thesis).
2. **Recovery authorization ≠ Recovery safety** — governance OK 해도 R6 exposure window 위험 잔존.
3. **One-time download ≠ Secure custody** — single-use 는 replay protection 일 뿐, leak 차단 아님.
4. **Recovery completion ≠ Operational recovery success** — secret 복원 ≠ downstream 정상 작동.
5. **Approval success ≠ Recovery success** — D3 통과는 recovery flow 의 시작점.
6. **ARTIFACT_ACCESSIBLE = high-risk temporal state** — 가장 짧고 가장 위험.
7. **Re-enrollment mandatory** — recovery 사용 자체가 "기존 key 노출됐을 수 있다" 의 신호 → rotation 필수 invariant.
8. **Recovery break-glass = governance 의 최상위 위험 surface** — direct fund loss vector.
9. **R6 (Secret Material) DB 절대 저장 금지** — D1a §7.2 directive 의 직접 결과.
10. **Recovery 는 SaaS 에서도 customer 책임이 가장 큰 영역** — sovereignty 의 핵심.

### 12-state recovery ceremony state machine

DRAFT → AUTHORIZATION_PENDING → QUORUM_COLLECTING → RECOVERY_APPROVED → RECOVERY_WINDOW_OPEN → **ARTIFACT_ACCESSIBLE** → RECOVERY_IN_PROGRESS → **RE-ENROLLMENT_REQUIRED** → RECOVERY_COMPLETED / RECOVERY_FAILED / RECOVERY_EXPIRED / EMERGENCY_RECOVERY

→ 3 high-risk temporal states (RECOVERY_WINDOW_OPEN / ARTIFACT_ACCESSIBLE / RECOVERY_IN_PROGRESS) 가 monitoring + auto-expiry 의 primary target. EMERGENCY_RECOVERY 도 RE-ENROLLMENT 통과 의무.

### 10 reasoning question 정답 (요약)

| Q | 답 |
|---|---|
| Q1 Recovery ≠ backup procedure? | governance ceremony + non-idempotent + rare + human-coord + cryptographic risk |
| Q2 Authorization ≠ safety? | governance 가 R6 exposure window leak 막을 수 없음; 책임 3분 (governance / cryptographic / operational) |
| Q3 One-time download ≠ secure? | replay protection 일 뿐; 한 번 access 안에서도 R6 exposure |
| Q4 Recovery completion ≠ operational success? | SM 의 terminal 도 downstream 정상 작동 보장 못 함 |
| Q5 Custodian set ≠ operational admin? | 운영팀 compromise 시 recovery authority 보존 + 책임 무게 |
| Q6 Re-enrollment mandatory? | recovery 사용 자체가 노출 신호; rotation 없이는 보안 가정 위반 |
| Q7 Recovery break-glass 위험? | direct fund loss vector + quorum bypass = safety property 무력화 |
| Q8 Recovery 가 SaaS 에서도 customer 책임 큰 이유? | sovereignty 핵심; vendor 사라져도 fund control 가능해야 |
| Q9 Exposure window mitigation 한계? | 항상 잔여 위험 존재; "secure recovery" = acceptable residual risk |
| Q10 Human coordination irreducible? | operator × custodian × witness 가용성 곱; automation limit |

### R1-R10 recovery sub-plane

R1 Recovery Request / R2 Recovery Authorization (D3 link) / R3 Custodian Quorum / R4 Recovery Window / **R5 Recovery Artifact (high-risk)** / **R6 Secret Material (DB 저장 금지)** / R7 Recovery Session / R8 Re-enrollment / R9 Recovery Audit / **R10 Break-glass Recovery (최상위 위험)**

→ R5 / R6 / R10 = critical risk surfaces. R3 / R9 = append-only. R4 = runtime invariant. R8 = mandatory post-condition.

### 3-clock recovery window model (D3 two-clock 의 확장)

| Clock | 측정 | 의미 |
|---|---|---|
| W_auth | from RecoveryRequest | 인가 결정 시간 |
| W_window | from quorum reached | recovery 수행 가능 시간 |
| W_art | from artifact first-access | 단일 access 의 짧은 validity |

→ Recovery 의 high-risk 성격 반영, normal approval 보다 1 clock 추가.

### 4-5 secret reconstruction generalized form (Stage 29-31)

1. Workspace recovery passphrase
2. Encrypted backup package
3. Custodian shard set (M-of-N)
4. Recovery utility tool / private key
5. (optional) Vendor-side participation key

각 component = 다른 custodian + 다른 storage + 다른 access policy. 모두 모여야 reconstruction 가능.

### 10-item operational fragility map (mitigation 명시)

| # | Fragility | Mitigation |
|---|---|---|
| F1 | Custodian unavailability | Oversized N + annual roster review + DR drill |
| F2 | Human timing dependency | Pre-scheduled custodian SLA + multi-timezone |
| F3 | Secret material exposure | HSM/TEE reconstruction + air-gap + memory hygiene |
| F4 | Artifact duplication | Witness-required ceremony + no screen capture |
| F5 | One-time access failure | Pre-flight check + retry as new full flow |
| F6 | Recovery timing expiration | Explicit deadline + extend procedure |
| F7 | Emergency recovery abuse | Emergency quorum + post-hoc review SLA + frequency monitoring |
| F8 | Re-enrollment failure | Verification test tx + rollback plan |
| F9 | Recovery proof insufficiency | Append-only chain + signed custodian decisions |
| F10 | Recovery coordination fatigue | Mandatory DR exercise + runbook freshness |

→ 분류: Cryptographic exposure (F3, F4) / Human availability (F1, F2, F10, irreducible) / Operational mistake (F5, F8, F9) / Temporal (F6) / Governance abuse (F7).

### Recovery ↔ Approval ↔ Signing ↔ Ledger boundary

| Boundary 출력 | Trust property | Persistence |
|---|---|---|
| Governance signed envelope (D3) | non-repudiation + freshness | persisted (audit) |
| Signed tx artifact (D2) | cryptographic finality | persisted (event store) |
| **Reconstructed key (D4 R6)** | **ephemeral high-risk** | **never persisted** |
| Confirmed ledger entry (D1a L3) | accounting integrity | persisted (append-only) |

→ R6 가 다른 셋과 근본적으로 다른 invariant — persistence 가 violation.

### 3-way recovery burden 비교

- SaaS: customer recovery burden ~50% (custodian set + passphrase 보관 + airgapped machine + DR exercise + re-enrollment validation)
- Hosted MPC: ~75% (+ recovery utility integration + backup orchestration + cosigner re-enrollment + audit storage)
- Direct-build: ~100% (+ cryptographic split scheme + recovery utility 자체 구축 + MPC re-enrollment protocol + custodian coordination system + break-glass governance + chain-specific re-enrollment)

→ Recovery 는 SaaS 에서도 customer 책임이 가장 큰 영역 (sovereignty design intent). Lock-in pivot: R6 + R8 + R3 + R9 = burden 의 ~70%.

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/recovery-ceremony-generalization.md` | **신규 생성** (~14 sections + Mermaid 10+ diagrams) |
| `log.md` | Stage 32 D4 항목 append (본 항목) |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 30 consecutive stages: 6-32).

### Stage 29-31 generalized full cycle

D4 는 Stage 29-31 의 Fireblocks-specific Workspace Keys Backup / Recovery Utility / Reconstruction 을 generalized form 으로 reasoning:
- Stage 29 (48h approval window) → §5 W_auth / W_window
- Stage 30 (once-only download) → §5.2 single-use property + §5.3 single-use ≠ safe
- Stage 31 (4-5 secret reconstruction) → §3.3 generalized 4-5 component model

### Mermaid 호환성 정책 유지

D1a / D2 / D3 의 fix 결과 직접 반영:
- `graph TB` 만 사용
- 모든 node label `"..."` quote
- classDef trailing semicolon 제거
- State machine = graph TB transition 방식

### Uncertainty boundary 유지

- R1-R10 / 12-state SM / 3-clock model / 4-5 secret reconstruction generalized / exposure window invariant / break-glass abuse pattern / 70% burden 분포 = **generalized recovery architecture pattern (Hypothesis ★)**.
- Fireblocks 의 Workspace Keys Backup / Recovery Utility (Stage 29-31) 은 reference implementation.
- §11.2 burden 백분율 = operational reasoning estimate.
- §11.5 추천 architecture = 운영 권장.
- §13 에 org policy 영역 명시 (custodian N / threshold M / crypto split scheme / window durations / re-enrollment policy / break-glass authority / DR exercise frequency / 등).

### 다음 단계 (D5 이후)

- D1b — Blockchain Reconciliation (watermark / depth / reorg compensation algorithm)
- D5 — Audit / Event Sourcing (G9 governance + R9 recovery + L6 audit 통합 outbox + projection)
- D6 — 3-way Decision Framework (recovery + signing + governance 의사결정 framework)
- D7 — Deposit Lifecycle
- D8 — Withdrawal Lifecycle (D2 + D3 + D4 통합 outbound flow)

### Spine 상태

- Curated Wiki entity / hub: unchanged (30 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: 4 files (D1a + D2 + D3 + D4)
- Retrieval Q7 metrics: unchanged

---

## Stage 32 D5 — Audit / Event Sourcing / Evidence Chain Reasoning (2026-05-19)

### 신규 파일

- `docs/architecture/audit-event-sourcing-evidence-chain.md` (D5) — Core thesis: "Custody systems are fundamentally evidence systems." / Unified Evidence Spine (5 truth domain 통합) / E1-E10 evidence sub-plane / 7-tier history decomposition / Cross-domain event lineage with 6-question framework / Event sourcing reasoning + ES ≠ audit safety limitation / 5-clock temporal semantics / Causality model (correlation_id + causation_id) / Replay vs deterministic replay / Forensic reconstruction flow / Multi-tier retention lifecycle / 10-item operational fragility map / Audit limitations (append-only ≠ tamper-proof / replay ≠ deterministic / stored ≠ complete / timestamp ≠ ordering) / 3-way evidence burden / Q1-Q10 reasoning.

### Core invariants 정립

1. **Custody systems are fundamentally evidence systems** — core thesis.
2. **Current state ≠ Reconstructable truth** — "지금 무엇" 은 "어떻게 그 상태가 됐는가" 모름.
3. **Audit log ≠ Evidence chain** — correlation + lineage + causality 가 추가되어야 evidence chain.
4. **Append-only ≠ Tamper-proof** — application invariant ≠ storage substrate 무결성.
5. **5 truth domains 독립**: Governance (D3) / Signing (D2) / Recovery (D4) / Ledger (D1a L3) / Blockchain (D1a L9).
6. **Reconstructability = core custody invariant** — 6-question (why / who / under which policy / from which request / signed by which authority / affecting which ledger mutation) 답 가능.
7. **Absence of evidence ≠ Evidence of absence** — missing event 는 hypothesis trigger, conclusion 아님.
8. **Timestamp ≠ Trustworthy ordering** — causation_id chain primary, timestamp secondary.
9. **ES ≠ Automatic audit safety** — ES 는 starting point, 7 영역 (tamper detection / completeness / cross-domain ordering / human evidence / deterministic replay / schema evolution / retention) 보완 필요.
10. **Human evidence dependency = irreducible** — out-of-band approval / physical ceremony / witness 는 system 밖.

### 10 reasoning question 정답 (요약)

| Q | 답 |
|---|---|
| Q1 Custody = evidence system 이유? | Reconstructability + non-repudiation + cross-domain forensic 모두 evidence chain 의 quality 의존 |
| Q2 Current state ≠ reconstructable truth? | Current = query 시점만 답; reconstructable = 임의 t 의 state 답 가능 |
| Q3 Audit log ≠ evidence chain? | Audit = raw event; evidence = correlation + lineage + envelope signing + graph |
| Q4 Ledger truth ≠ Blockchain truth? | Ledger 는 internal accounting; blockchain 은 external authoritative; reconcile 필요 |
| Q5 Approval truth ≠ Signing truth? | 다른 trust domain; cross-domain consistency check 가 evidence spine 의 핵심 기능 |
| Q6 Recovery evidence ≠ Recovery safety? | Evidence complete 해도 R6 exposure window leak 은 capture 안 됨 |
| Q7 Missing event ≠ Event absence? | Pipeline failure / outbox down / retention 만료 / 외부 system → missing event 가 absence 증명 아님 |
| Q8 Replay ≠ Deterministic replay? | 외부 의존 / wall-clock / non-determinism 있으면 replay ≠ original |
| Q9 Append-only ≠ Tamper-proof? | App-level ≠ substrate-level; hash chain + WORM + anchoring stack 필요 |
| Q10 Timestamp ≠ Trustworthy ordering? | Distributed clock untrusted; causation_id chain 또는 single-source sequence |

### Unified Evidence Spine (5 truth → 1 backbone)

```
Governance truth (D3) ─┐
Signing truth (D2)    ─┤
Recovery truth (D4)   ─┼→ Unified Evidence Spine → Reconstructability / Forensic / Compliance / Reconciliation / Causal traceability
Ledger truth (D1a L3) ─┤
Blockchain (D1a L9)   ─┘
```

### E1-E10 evidence sub-plane

E1 Event capture / E2 Audit log plane / E3 Evidence chain plane (correlation) / E4 Causality plane (lineage) / E5 Snapshot plane (point-in-time) / E6 Retention plane (tiered) / E7 Replay plane (deterministic+forensic) / E8 Forensic plane (incident query) / E9 Cross-domain correlation / E10 Compliance / non-repudiation

### 7-tier history decomposition

1. Event log (raw, transient)
2. Audit log (governance-relevant, append-only)
3. Evidence chain (correlated + lineaged)
4. Ledger history (D1a L3)
5. Blockchain history (D1a L9)
6. Governance history (D3 G9)
7. Recovery history (D4 R9)

→ Truth ranking: Blockchain > Ledger (충돌 시 ledger reconcile); Governance ⊥ Signing (충돌 자체가 incident); Recovery > Governance (forensic 중요도).

### 5-clock temporal semantics

| Clock | 의미 |
|---|---|
| T1 Event time | 도메인 관점 발생 시각 |
| T2 Observation time | system 인지 시각 |
| T3 Processing time | system process 시작 |
| T4 Confirmation time | external finality 시각 |
| T5 Recovery exposure time | secret visible window (D4-specific) |

→ Cross-domain ordering 은 causation_id chain primary, timestamp secondary.

### 6-question causal traceability framework

- Why (policy + reason)
- Who (approver identity at decision time)
- Under which policy (PolicyVersion pinned)
- From which request (correlation_id)
- Signed by which authority (signer set)
- Affecting which ledger mutation (LedgerEntry FK)

→ 단일 query (correlation_id + causation graph traversal) 로 답 가능 = causal traceability 달성.

### Envelope schema (필수 field)

event_id / event_type / correlation_id / causation_id / event_time / observation_time / processing_time / actor / workspace_id / envelope_signature / schema_version

### Selective ES boundary (D1a §6.1 재확인 + 확장)

- **Full ES**: L3 Ledger / L6 Audit / Approver Decision (D3 G3) / Recovery Custodian Decision (D4 R3)
- **CRUD + outbox emission**: L1 / L2 / L4 / L5 / L7 / L8, Transaction lifecycle, Signing lifecycle, Approval lifecycle, Recovery lifecycle
- 전체 ES 강제 = anti-pattern (reorg replay / schema evolution / migration burden 폭증)

### Audit limitations 4-tier (boundary 명시)

| Limitation | Operational mitigation |
|---|---|
| Append-only ≠ tamper-proof | hash chain + external anchoring + WORM + signed envelope + distributed consensus |
| Replay ≠ deterministic | external evidence mirror + dependency pinning |
| Stored ≠ complete | human + physical evidence capture procedure |
| Timestamp ≠ ordering | causation_id primary, timestamp secondary |

### 10-item operational fragility (mitigation 명시)

| # | Fragility | Mitigation |
|---|---|---|
| F1 | Cross-system clock skew | HLC / causation_id primary / blockchain anchoring |
| F2 | Missing event ingestion | transactional outbox + observability metric |
| F3 | Duplicate event | consumer idempotency via event_id |
| F4 | Replay inconsistency | dependency pinning + external evidence capture |
| F5 | Event ordering ambiguity | single-source sequence per aggregate |
| F6 | Correlation failure | envelope schema validation + lineage check |
| F7 | Partial evidence retention | tier-aware access policy |
| F8 | Retention expiration | explicit retention policy + legal hold |
| F9 | Human-side evidence gap | procedural witness + signed paper + photo archive (★ irreducible) |
| F10 | External dependency evidence loss | mirror external evidence at consumption time |

→ 분류: Distributed (F1, F3, F5) / Pipeline reliability (F2, F6, F7) / Replay limit (F4) / Retention governance (F7, F8) / **Out-of-system irreducible (F9, F10)**.

### Multi-tier retention model

Hot (0-90d, OLTP) → Warm (90d-2y, warm) → Cold (2y-7y, archive) → WORM (7y-forever, immutable retention) → Purge (only when 규제 allows)

→ Recovery evidence (D4 R9) = always WORM. Right-to-erasure (GDPR) tension: PII / audit 분리 storage 가 해결 패턴.

### 3-way evidence burden 비교

- SaaS: customer evidence burden ~40% (vendor data export + SIEM ingestion + cross-domain correlation + compliance officer + forensic tooling)
- Hosted MPC: ~65% (+ audit mirror infrastructure + tier management + replay partial + retention enforcement)
- Direct-build: ~100% (+ event store infrastructure + hash chain + external anchoring + lineage engine + forensic tooling + replay engine + tier-aware storage + compliance reporting + retention enforcement + PII/audit separation)

→ Evidence 는 SaaS 사용해도 customer 책임이 상당 큰 영역 — vendor 의 evidence 가 customer 의 forensic / 규제 / cross-domain reasoning 의 **input** 일 뿐 완결 안 됨. Lock-in pivot: E2+E6 storage / E3+E4 correlation+causality / E7 replay / E10 compliance = burden 의 ~80% (★ Hypothesis).

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/audit-event-sourcing-evidence-chain.md` | **신규 생성** (~14 sections + Mermaid 10+ diagrams) |
| `log.md` | Stage 32 D5 항목 append (본 항목) |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 31 consecutive stages: 6-32).

### Mermaid 호환성 정책 유지

D1a / D2 / D3 / D4 의 fix 결과 직접 반영:
- `graph TB` 만 사용
- 모든 node label `"..."` quote
- classDef trailing semicolon 제거
- State machine = graph TB transition 방식

### Uncertainty boundary 유지

- E1-E10 / 7-tier history / 5-clock model / causation_id primary / selective ES boundary / 80% burden 분포 / human evidence irreducible = **generalized audit architecture pattern (Hypothesis ★)**.
- Fireblocks 의 audit log / lifecycle events 은 reference model 로 인용.
- §11.2 burden 백분율 = operational reasoning estimate.
- §11.5 추천 architecture = 운영 권장.
- §10 audit limitation = distributed system literature (Lamport, ES community) 의 standard 입장.
- §13 에 org policy 영역 명시 (retention per tier / anchoring 주기 / lineage storage model / replay engine choice / right-to-erasure handling / etc).

### 다음 단계 (D6 이후)

- D1b — Blockchain Reconciliation (truth ranking + watermark + reorg compensation)
- D6 — 3-way Custody Decision Framework (evidence ownership + signing + governance + recovery sovereignty 결정)
- D7 — Deposit Lifecycle (deposit detection + evidence emission + ledger entry, cross-domain lineage application)
- D8 — Withdrawal Lifecycle (D2 + D3 + D4 + D5 통합 outbound flow + 매 stage evidence spec)

→ Evidence spine (D5) 는 D1b / D6 / D7 / D8 모두의 baseline.

### Spine 상태

- Curated Wiki entity / hub: unchanged (31 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: 5 files (D1a + D2 + D3 + D4 + D5)
- Retrieval Q7 metrics: unchanged

### Architecture reasoning layer 누적 결과 (D1a-D5)

| 문서 | 핵심 명제 | 주요 invariant |
|---|---|---|
| D1a | 9-plane DB | secrets DB 저장 금지 / append-only invariant / selective ES |
| D2 | 4 state machine 분리 | Approval ≠ Signing ≠ Broadcast ≠ Confirmation; MPC retry non-idempotent; callback B5 fail-closed |
| D3 | 11-state governance SM | Policy pass ≠ Approval complete ≠ Signing authorized ≠ Signing success; two-clock freshness; human coordination irreducible |
| D4 | 12-state recovery SM | Recovery = governance ceremony under cryptographic risk; recovery authorization ≠ safety; re-enrollment mandatory |
| D5 | Unified Evidence Spine | Custody = evidence system; 5 truth domain 통합; reconstructability = core invariant; append-only ≠ tamper-proof |

→ 5 문서 = 5 trust domain × 1 evidence backbone 의 완성된 generalized custody architecture reasoning skeleton.

---

## Stage 32 D1b — Reconciliation / Settlement / Consistency Reasoning (2026-05-19)

### 신규 파일

- `docs/architecture/reconciliation-settlement-consistency.md` (D1b) — Core thesis: "Reconciliation is not balance comparison. Reconciliation is cross-truth-domain consistency proof." / 5 truth domain authority mapping (Blockchain settlement / Ledger accounting / Governance authorization / Signing cryptographic execution / Recovery key custody) / 6 settlement state progression / 4 balance type model / Cross-domain consistency graph + 5-question framework / Deposit reconciliation lifecycle (2-domain) / Withdrawal reconciliation lifecycle (5-domain) / Reorg handling (compensating LedgerEntry pattern) / 4-type drift detection framework / Exception workflow + manual ledger entry governance / Temporal consistency reasoning / 10-item operational fragility map / Audit limitations / 3-way reconciliation burden / Q1-Q10 reasoning.

### Core invariants 정립

1. **Reconciliation ≠ balance comparison** — cross-truth-domain consistency proof (core thesis).
2. **5 truth domain authority 의 phase 의존성** — phase 별 authoritative truth 가 다름.
3. **Settlement ≠ Confirmation** — confirmation 은 chain-side fact, settlement 은 multi-domain agreement.
4. **6 settlement state**: Broadcasted / Included / Confirmed / Economically Finalized / Ledger Finalized / Reconciled.
5. **4 balance type**: Pending / Available / Settled / Finalized — 각각 다른 economic risk.
6. **Reorg recovery ≠ Simple rollback** — append-only invariant + compensating LedgerEntry pattern.
7. **Drift detection = reconciliation 의 핵심** — balance equality 가 아닌 inter-domain event missing/excess.
8. **Deposit = 2-domain, Withdrawal = 5-domain reconciliation** — Recovery 경유 시 6-domain.
9. **Reconciliation 자동화 한계** — exception workflow + investigator team 은 irreducible.
10. **External-domain reconciliation** = third-party trust class — 가장 어려운 영역.

### 10 "≠" 명제 통합 (D1b 측면)

| Proposition |
|---|
| Blockchain balance ≠ Ledger balance |
| Settlement ≠ Confirmation |
| Observed tx ≠ Credited deposit |
| Broadcast success ≠ Withdraw completed |
| Ledger entry ≠ Economic finality |
| Missing tx ≠ Missing funds |
| Reconciliation success ≠ No hidden inconsistency |
| Balance equality ≠ State consistency |
| Reorg recovery ≠ Simple rollback |
| Snapshot consistency ≠ Temporal consistency |

### 10 reasoning question 정답 (요약)

| Q | 답 |
|---|---|
| Q1 Reconciliation = consistency proof? | Balance 일치는 1 dimension; 5 truth domain evidence + lineage + ordering cross-consistency 가 진짜 reconciliation |
| Q2 Settlement ≠ Confirmation? | Confirmation 은 chain-side; Settlement 은 multi-domain (chain final + ledger commit + cross-domain agree) |
| Q3 Why 4 balance type? | Pending/Available/Settled/Finalized 가 각각 다른 economic risk; 단일 balance 는 4 의미 collapse |
| Q4 Reorg recovery ≠ Rollback? | Append-only invariant + compensating LedgerEntry; history mutation 금지 |
| Q5 Drift detection 핵심 이유? | Balance equality 만으로는 missing event 안 보임; 4 drift type detection 이 reconciliation 핵심 output |
| Q6 자동화 한계 이유? | Indexer lag / spam filter / smart contract 비표준 / external evidence / adversarial = manual investigation 필요 |
| Q7 Snapshot ≠ Temporal? | Snapshot 은 dimension equality; temporal 은 event sequence + lineage + ordering 무결성 |
| Q8 External domain 한계? | CEX/bridge/sub-custodian/oracle 의 evidence = third-party trust class |
| Q9 Deep reorg governance? | Depth N>10 reorg = chain 자체 governance event; 자동화 불가 manual decision |
| Q10 SaaS 에서도 customer 책임 큰 이유? | Vendor 가 indexing+shallow reorg 까지만 흡수; exception + cross-domain proof + 외부 domain = customer scope |

### 5 truth domain authority mapping

| Phase | Authoritative truth |
|---|---|
| Authorization | Governance |
| Signing | Signing (cryptographic) |
| Broadcasting | Signing → Blockchain |
| Mempool | Blockchain (limited) |
| Confirmed | Blockchain |
| Economically final | Blockchain |
| Ledger entry | Ledger |
| Reconciled | Cross-domain consistency |

→ Authority 충돌 시 resolution: Blockchain > Ledger (충돌 시 compensating); Governance ⊥ Signing (충돌 = incident); Signing artifact valid but no on-chain = retain + new broadcast; Chain finality + no ledger = drift alert.

### Settlement state 진행

```
Broadcasted (Signing) → Included (Blockchain depth=0)
→ Confirmed (Blockchain depth threshold)
→ Economically Finalized (Blockchain beyond reorg)
→ Ledger Finalized (Ledger commit)
→ Reconciled (Cross-domain consistency proof)
```

→ Reorg 시 transition reversal: Included → Broadcasted, Confirmed → Broadcasted, 등.

### 4 balance type (economic risk 별)

| Balance | Spendable? | Risk |
|---|---|---|
| Pending | 보통 No | Full reorg/drop risk |
| Available | Yes (conservative) / No (strict) | Reorg risk (depth-dependent) |
| Settled | Yes | Negligible reorg risk + ledger drift 가능 |
| Finalized | Yes (full confidence) | None |

### 4 drift type

| Type | Drift |
|---|---|
| 1 | Blockchain inflow exists but no Ledger mutation |
| 2 | Ledger withdrawal exists but no chain settlement |
| 3 | Approval exists but signing missing |
| 4 | Signing exists but reconciliation absent |

→ 각각 시간-window check + cross-domain query 로 detection. Severity 별 SLA: Low/Medium (auto) / High (alert + on-call) / Critical (incident + freeze).

### Deposit vs Withdrawal reconciliation 분리

| Flow | Domain count | Special property |
|---|---|---|
| Deposit | **2-domain** (Blockchain ↔ Ledger) | Governance/Signing/Recovery 미관여 |
| Withdrawal | **5-domain** (Gov → Sig → Chain → Led → Recon) | 모든 domain evidence chain |
| Recovery 경유 Withdrawal | **6-domain** (+ Recovery) | Verification test tx + re-enrollment cross-ref |

### Reorg 3 분류

| Type | Depth | Handling |
|---|---|---|
| Shallow | 1-2 | Auto compensating LedgerEntry |
| Deep | 3-N | Manual review + investigator |
| Hard fork / split | Extreme | Governance decision (chain split policy) |

### 10-item operational fragility (mitigation 명시)

| # | Fragility | Mitigation |
|---|---|---|
| F1 | Chain reorg | Compensating entry + chain-specific policy |
| F2 | Partial ingestion | Redundant indexer + checkpoint + lag alert |
| F3 | Duplicate observation | Idempotency via tx_hash + lineage check |
| F4 | Delayed indexing | Multi-provider redundancy + lag SLO |
| F5 | Out-of-order event | correlation_id ordering + atomic projection |
| F6 | Ledger drift | Drift detection + alert + reconciliation proof |
| F7 | Broadcast ambiguity | Chain-specific stuck handling + RBF/cancel |
| F8 | Confirmation race | Depth-buffered threshold |
| F9 | External dependency mismatch | External evidence mirror + signed attestation + manual review |
| F10 | Human exception workflow | Irreducible — exception queue + investigator team + SLA |

→ 분류: Chain-side (F1, F4, F7, F8) / Pipeline (F2, F3, F5, F6) / **External + Human irreducible (F9, F10)**.

### 3-way reconciliation burden

- SaaS: customer reconciliation burden ~45% (exception queue + investigator + cross-domain proof + external domain + retention + pattern analysis)
- Hosted MPC: ~70% (+ drift extension + audit mirror + custom reorg policy)
- Direct-build: ~100% (+ multi-RPC indexer + chain adapter per chain + reorg/compensating logic + drift engine + confirmation per asset + settlement proof infra + mempool monitoring + 4-balance SM)

→ Reconciliation lock-in pivot: multi-chain adapter + indexer redundancy + compensating entry + exception/investigator = burden 의 ~80%. **External domain (CEX/bridge/sub-custodian) 노출 정도가 complexity 의 핵심 결정**.

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/reconciliation-settlement-consistency.md` | **신규 생성** (~16 sections + Mermaid 10+ diagrams) |
| `log.md` | Stage 32 D1b 항목 append (본 항목) |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 32 consecutive stages: 6-32).

### Mermaid 호환성 정책 유지

D1a / D2 / D3 / D4 / D5 의 fix 결과 직접 반영:
- `graph TB` 만 사용
- 모든 node label `"..."` quote
- classDef trailing semicolon 제거
- State machine = graph TB transition 방식

### D2 → D1b handoff 완성

D2 §7 의 boundary 가 D1b 에 의해 owner 확정:
- D2: BroadcastAttempt 제출 + mempool entry + INCLUDED_IN_BLOCK 까지
- D1b: confirmation depth + reorg detection + compensating entry + finality threshold + stuck tx replacement + chain-specific 처리 + cross-domain reconciliation

### Uncertainty boundary 유지

- 5 truth domain authority / 6 settlement state / 4 balance type / 4 drift type / compensating entry pattern / chain-specific finality threshold / 80% burden 분포 / external-domain irreducible = **generalized reconciliation architecture pattern (Hypothesis ★)**.
- Fireblocks 의 reconciliation 구현은 reference model.
- §2.4 chain-specific finality 는 일반 blockchain knowledge — 시간에 따라 변화.
- §13.2 burden 백분율 = operational reasoning estimate.
- §13.4 추천 = 운영 권장.
- §15 에 org policy 영역 명시 (confirmation/finality threshold per asset / Pending UX / Available 정책 / reorg policy per chain / stuck tx 대응 / drift severity SLA / exception queue routing / manual entry authority / external domain integration / proof cadence / 등).

### 다음 단계 (D1b 이후)

- D6 — 3-way Custody Decision Framework (§13.4 의사결정 framework formalize, 전체 6 영역 ownership)
- D7 — Deposit Lifecycle (§5 deposit reconciliation 의 detailed phase decomposition)
- D8 — Withdrawal Lifecycle (§6 의 D2 + D3 + D4 + D5 + D1b 통합 detailed outbound flow)
- (Optional D9) — Multi-chain adapter pattern detail

### Spine 상태

- Curated Wiki entity / hub: unchanged (32 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: 6 files (D1a + D2 + D3 + D4 + D5 + D1b)
- Retrieval Q7 metrics: unchanged

### Architecture reasoning layer 누적 결과 (D1a + D2 + D3 + D4 + D5 + D1b)

| 문서 | 핵심 명제 |
|---|---|
| D1a | 9-plane DB / secrets DB 저장 금지 / selective ES |
| D2 | 4 state machine 분리 / MPC retry non-idempotent / B5 fail-closed |
| D3 | 11-state governance SM / two-clock freshness / human coordination irreducible |
| D4 | Recovery = governance ceremony under cryptographic risk |
| D5 | Custody = evidence system / Unified Evidence Spine |
| D1b | Reconciliation = cross-truth-domain consistency proof / 5 truth × 6 settlement × 4 balance |

→ 6 문서 = (5 trust domain + 1 evidence backbone) × cross-domain reconciliation 의 완성된 generalized custody architecture reasoning skeleton.

---

## Stage 32 D8 — Withdrawal Lifecycle Detailed Reasoning (2026-05-19)

### 신규 파일

- `docs/architecture/withdrawal-lifecycle.md` (D8) — Core thesis: "Withdrawal is not a transfer request. Withdrawal is a multi-domain state transition from user intent to economic finality." / 12 phase decomposition (W1-W12) / Cross-domain truth authority per phase / 4-tier authorization (Identity / Policy / Governance / Cryptographic) / 6 settlement state progression / 5 balance state model / Failure / retry semantic / Cancellation phase-specific reasoning / **5 ledger mutation timing model 비교 (M1 Approval / M2 Signing / M3 Broadcast / M4 Confirmation / M5 Finality)** / 5-domain reconciliation / Exception workflow / 9-clock temporal semantics / 12-question evidence chain framework / 10-item operational fragility / 3-way burden / Q1-Q10 reasoning.

### Core invariants 정립

1. **Withdrawal = multi-domain state transition** (core thesis) — 12 phase × 5 truth × 9 clock × 5 balance × 5 ledger timing.
2. **10-tier "≠" 통합**:
   - Withdrawal request ≠ Authorized withdrawal
   - Approval success ≠ Signing success
   - Signing success ≠ Broadcast success
   - Broadcast success ≠ Settlement finality
   - Settlement finality ≠ Ledger finalization
   - Ledger mutation ≠ Reconciled state
   - Pending withdrawal ≠ Economic outflow
   - Cancellation ≠ State rollback
   - Retry ≠ Idempotent retry
   - Successful withdrawal ≠ Complete evidence
3. **4-tier authorization**: Identity (W1) → Policy (W2) → Governance (W3-W4) → Cryptographic (W5-W7).
4. **5 balance state**: Available / Reserved / Pending withdrawal / Settled outflow / Finalized.
5. **5 ledger mutation timing model** — Asset class 별 권장 다름; **Hybrid shadow ledger + real ledger** 패턴 권장.
6. **Cancellation phase-specific** — before W3 (easy) / W3-W7 (medium) / W8-W9 (hard, chain action) / W10+ (impossible, compensating new withdrawal).
7. **5-domain reconciliation 5-question framework** — backing chain tx? signing artifact? signing request? governance envelope? policy version?
8. **9-clock temporal** — Request → Approval → Signing → Broadcast → Inclusion → Confirmation → Finality → Ledger mutation → Reconciliation.
9. **12-question evidence chain framework** — withdrawal 의 모든 forensic question.
10. **Withdrawal customer burden in SaaS ~35%** — single-step UX 와 multi-domain reality 의 분리.

### 12-phase withdrawal lifecycle

W1 Intent → W2 Policy eval → W3 Approval collection → W4 Approval envelope → W5 Signing gate → W6 MPC signing → W7 Signing artifact → W8 Broadcast → W9 Mempool/inclusion → W10 Confirmation → W11 Ledger mutation → W12 Reconciliation + Evidence closure

### 10 reasoning question 정답 (요약)

| Q | 답 |
|---|---|
| Q1 Withdrawal ≠ transfer request? | 12 phase × 5 truth × multi-domain authority transition; output = fund transfer + evidence chain artifact |
| Q2 매 phase success 다음 phase 보장 안 함? | 4-tier authorization 의 각 layer 가 다른 trust domain |
| Q3 Ledger mutation timing design decision? | 5 model (M1-M5) 각각 accounting risk / UX / liquidity / rollback complexity trade-off; hybrid shadow+real 권장 |
| Q4 Cancellation ≠ Rollback? | Cancellation = future action 차단 (event emit); rollback = history mutation (append-only 위반) |
| Q5 Pending withdrawal ≠ Economic outflow? | Reorg/drop 시 복귀 가능; 5-state 분리 모델 |
| Q6 MPC retry nonce reuse 위험 (withdrawal)? | 매 retry 새 nonce; idempotent retry 불가능; max retry 도과 시 W2 재시작 |
| Q7 Stale approval 영향? | W3 → W6 사이 freshness 검증; PolicyVersion drift 시 STALE_EVIDENCE 재인가 |
| Q8 5-domain reconciliation 의미? | "돈이 빠졌는가" 1-dimension 이 아닌 governance/signing/chain/ledger/reconciliation cross-consistency |
| Q9 Successful withdrawal ≠ Complete evidence? | W12 후에도 operator intent / external domain / side-channel 의 gap |
| Q10 Withdrawal SaaS 흡수 영역? | SaaS 가 W1-W11 흡수; customer 책임 ~35% (policy + approver + W12 reconciliation + exception + evidence + incident + external domain) |

### 5 ledger mutation timing model 비교 (핵심)

| Model | Accounting risk | UX | Liquidity | Rollback complexity | 권장 use case |
|---|---|---|---|---|---|
| M1 Approval-time | Highest | Earliest | Same | High | (rare) |
| M2 Signing-time | High | Good | Same | High | (rare) |
| M3 Broadcast-time | Medium | Acceptable | Same | Medium | Test / low-value |
| **M4 Confirmation-time** | Low | Delayed | Reserved separately | Low | Stablecoin / hot wallet |
| **M5 Finality-time** | Lowest | Latest | Reserved separately for long | Lowest | BTC / high-value |

→ **Hybrid shadow ledger (reserved) + real ledger (M4-M5)** 패턴 권장.

### Cancellation phase-specific matrix

| Phase | Cancellation | Side effect |
|---|---|---|
| Before W3 | Easy (cancel ApprovalRequest) | reserved → available |
| W3-W4 | Medium (cancel envelope) | governance audit + envelope invalidation |
| W6-W7 | Hard (artifact 폐기 + lock) | signing audit + non-broadcast lock |
| W8-W9 | Hard (RBF / cancel-replace on chain) | chain-specific cancel cost |
| W10+ | **Impossible** | compensating new withdrawal (separate lifecycle) |

### 9-clock temporal semantics for withdrawal

T1 Request → T2 Approval → T3 Signing → T4 Broadcast → T5 Inclusion → T6 Confirmation → T7 Economic finality → T8 Ledger mutation → T9 Reconciliation

→ Best case minutes / Typical (BTC finality) ~1-2h / Worst case (L2 Optimistic) ~7d.

### 12-question evidence chain framework

| Q | Answer source |
|---|---|
| Why initiated? | E1 + E2 policy reason |
| Who requested? | E1 actor |
| Under which policy version? | E2 PolicyVersion hash |
| Who approved? | E3 ApproverDecision list |
| When did quorum reach? | E3 → E4 |
| Which envelope authorized signing? | E4 envelope_id |
| Which signers participated? | E6 participant set |
| What was signed? | E7 SigningArtifact tx hash |
| Where broadcasted? | E8 RPC endpoint(s) |
| When included? | E9 block hash + time |
| When finality? | E10 confirmation depth |
| How reconciliation proven? | E12 proof artifact |

### 10-item operational fragility (mitigation 명시)

| # | Fragility | Mitigation |
|---|---|---|
| F1 | Approval bottleneck | Escalation + multi-timezone + emergency authority |
| F2 | MPC retry abuse | Retry limit + abuse pattern detection |
| F3 | Broadcast failure cascade | Multi-RPC + circuit breaker |
| F4 | Stuck tx in mempool | RBF / cancel-replace + fee oracle |
| F5 | Reorg cascade | Compensating entry + deep reorg manual |
| F6 | Ledger projection lag | Projection SLA + auto-catchup |
| F7 | Drift accumulation | Periodic full reconciliation + cumulative metric |
| F8 | Exception backlog | Investigator sizing + tier-1 auto-resolution |
| F9 | External domain mismatch | External evidence mirror + signed attestation |
| F10 | Withdrawal authority abuse | Governance independence + dual approval + frequency SLO |

→ 분류: Human (F1, F8, irreducible) / Chain (F3, F4, F5) / System (F6, F7) / Cryptographic (F2) / External + Security (F9, F10).

### 3-way withdrawal burden

- SaaS: customer withdrawal burden ~35% (policy + approver + W12 reconciliation + exception + evidence + incident + external domain)
- Hosted MPC: ~60% (+ cosigner hosting + audit mirror + custom retry + custom reorg)
- Direct-build: ~100% (+ MPC orchestration + multi-RPC + chain adapter + reorg/stuck + mempool + fee oracle + confirmation per asset + ledger projection + drift detection + exception engine + evidence infra)

→ Lock-in pivot: multi-chain MPC orchestration + reorg/stuck handling + cross-domain reconciliation + exception/investigator = burden 의 ~80%.

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/withdrawal-lifecycle.md` | **신규 생성** (~18 sections + Mermaid 10+ diagrams) |
| `log.md` | Stage 32 D8 항목 append (본 항목) |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 33 consecutive stages: 6-32).

### Mermaid 호환성 정책 유지

D1a / D2 / D3 / D4 / D5 / D1b 의 fix 결과 직접 반영:
- `graph TB` 만 사용
- 모든 node label `"..."` quote
- classDef trailing semicolon 제거
- State machine = graph TB transition 방식

### 다음 단계 (D8 이후)

- D7 — Deposit Lifecycle (2-domain Blockchain↔Ledger 의 detailed phase, withdrawal 의 mirror 이지만 governance/signing 미관여로 simpler)
- D6 — 3-way Custody Decision Framework (전체 architecture reasoning 의 의사결정 framework)
- (Optional D9) — Multi-chain adapter pattern detail

### Uncertainty boundary 유지

- 12 phase / 4-tier authorization / 5 balance state / 5 ledger timing model / 9-clock / 12-question framework / 80% burden 분포 = **generalized withdrawal architecture pattern (Hypothesis ★)**.
- Fireblocks 의 withdrawal 구현은 reference model.
- §8 timing model trade-off matrix = operational reasoning, 측정값 아님.
- §15.2 burden 백분율 = operational reasoning estimate.
- §15.4 추천 = 운영 권장.
- §13 limitation = D1b + D5 의 직접 적용.
- §17 에 org policy 영역 명시 (ledger timing per asset / approval window / freshness TTL / MPC retry / confirmation per asset / finality per chain / RBF policy / cancellation governance / reconciliation cadence / investigator team / pending UX / reserved lifetime / stuck threshold / manual entry authority / external domain / velocity limits / emergency / compensating / audit retention / 24/7 ops).

### Spine 상태

- Curated Wiki entity / hub: unchanged (33 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: 7 files (D1a + D2 + D3 + D4 + D5 + D1b + D8)
- Retrieval Q7 metrics: unchanged

### Architecture reasoning layer 누적 결과 (D1a + D2 + D3 + D4 + D5 + D1b + D8)

| 문서 | 핵심 명제 |
|---|---|
| D1a | 9-plane DB / secrets DB 저장 금지 |
| D2 | 4 state machine 분리 / MPC retry non-idempotent |
| D3 | 11-state governance SM / two-clock freshness |
| D4 | Recovery = governance ceremony under cryptographic risk |
| D5 | Custody = evidence system / Unified Evidence Spine |
| D1b | Reconciliation = cross-truth-domain consistency proof |
| D8 | Withdrawal = multi-domain state transition from user intent to economic finality |

→ 7 문서 = 5 trust domain + 1 evidence backbone + cross-domain reconciliation + outbound lifecycle 의 generalized custody architecture reasoning skeleton.

---

## Stage 32 D7 — Deposit Lifecycle Detailed Reasoning (2026-05-19)

### 신규 파일

- `docs/architecture/deposit-lifecycle.md` (D7) — Core thesis: "Deposit is not transaction detection. Deposit is controlled ledger recognition of external settlement." / 9 phase decomposition (DP1-DP9) / 2-domain reconciliation / **Bridge layer (custody policy plane)** 가 chain observation 을 ledger truth 로 translate 하는 judgment / 4 attribution model (HD-derived / shared+memo / smart contract / sender-based) / 5 recognition gate (attribution / asset registry / risk / confirmation / spam) / 6 deposit settlement state / 4 deposit balance state / 4 recognition timing model (M-D1 to M-D4) / Reorg compensating credit pattern / Double-credit prevention (composite unique key) / 4 drift type / Customer cooperation irreducibility / 6-clock temporal / 10-question evidence chain / 10-item fragility / 3-way burden / Q1-Q10 reasoning.

### Core invariants 정립

1. **Deposit = controlled ledger recognition of external settlement** (core thesis) — observation 이 곧 deposit 아님.
2. **10-tier "≠" 명제**:
   - Observed tx ≠ Valid deposit
   - Included tx ≠ Creditable settlement
   - Confirmation ≠ Economic finality
   - Deposit recognition ≠ Spendable balance
   - Ledger credit ≠ Reconciled state
   - Address ownership ≠ Economic ownership
   - Missing deposit ≠ Missing funds
   - Duplicate observation ≠ Duplicate deposit
   - Deposit reversal ≠ Simple rollback
   - Indexed event ≠ Complete truth
3. **2-domain reconciliation** (Blockchain ↔ Ledger) — Withdrawal 의 5-domain 대비 simpler 하지만 own complexity 존재 (attribution / risk / spam / reorg).
4. **5 recognition gate** — attribution + asset registry + risk + confirmation + spam 모두 통과해야 credit.
5. **Bridge layer = policy-driven judgment** — chain observation 을 ledger truth 로 translate 하는 권한.
6. **Compensating credit pattern (reorg)** — append-only invariant 유지 + customer notification.
7. **Composite unique key dedup** — (tx_hash, log_index, recipient_address) 의 DB constraint.
8. **Attribution complexity = deposit-specific** — 4 model + multi-key + ambiguity 처리.
9. **Customer cooperation irreducible** — 일부 attribution / source-of-funds 는 system 자체로 resolve 불가.
10. **Deposit customer burden in SaaS ~25%** — withdrawal 보다 SaaS 흡수 비중 ↑.

### 9-phase deposit lifecycle

DP1 Blockchain observation → DP2 Address attribution → DP3 Deposit detection → DP4 Risk gating → DP5 Confirmation tracking → DP6 Deposit recognition → DP7 Ledger credit → DP8 Spendability transition → DP9 Reconciliation + Evidence closure

### Withdrawal (D8) vs Deposit (D7) asymmetry

| 차원 | Withdrawal | Deposit |
|---|---|---|
| Phase | 12 | 9 |
| Truth domain | 5 (Gov/Sig/Chain/Led/Recon) | 2 (Chain/Led) |
| User intent | explicit | implicit (external sender) |
| Governance | mandatory | default 미관여 |
| Signing | mandatory | 미관여 |
| Cancellation | phase-specific | 불가능 (sender's chain action) |
| Customer burden in SaaS | ~35% | ~25% |
| Direction | outflow (debit) | inflow (credit) |

### 10 reasoning question 정답 (요약)

| Q | 답 |
|---|---|
| Q1 Deposit ≠ tx detection? | 9 phase + 2 truth + 5 recognition gate; bridge layer 의 judgment |
| Q2 Observed tx ≠ Valid deposit? | 5 gate 통과 필요 (attribution + asset + risk + confirmation + spam) |
| Q3 Address ownership ≠ Economic ownership? | Chain-side ownership ≠ internal attribution |
| Q4 Confirmation ≠ Economic finality? | Chain fact ≠ reorg risk negligible; shallow reorg 가능 |
| Q5 Recognition ≠ Spendable? | Hold policy (time/depth/risk-based) + 4-state transition |
| Q6 Double-credit prevention? | (tx_hash, log_index, recipient) composite unique key |
| Q7 Reorg reversal ≠ Rollback? | Compensating debit entry (append-only); customer notification |
| Q8 Attribution complexity 본질? | 4 model + multi-key + ambiguity (memo collision / unknown sender / contract upgrade) |
| Q9 Spam/dust 정책? | Dust threshold / blacklist / mixer / sanctioned; risk engine + compliance |
| Q10 Customer cooperation irreducible? | Memo 누락 / attribution collision / source-of-funds = system 외부 evidence |

### 4 attribution model 비교

| Model | Privacy | Complexity | Risk |
|---|---|---|---|
| M1 HD-derived per-customer | High | Address generation | Address loss → fund inaccessible |
| M2 Shared + memo/tag (XRP/Stellar/Cosmos) | Medium | Memo enforcement | Memo 누락 = unattributable |
| M3 Smart contract event parsing | Variable | Event parsing + ABI | Contract upgrade 시 깨짐 |
| M4 Sender-based | Low | Sender whitelist | Sender spoofing |

### 4 recognition timing model

| Model | Recognition state | Trade-off | 권장 |
|---|---|---|---|
| M-D1 Observed | DS1 | Highest reversal risk | Test only |
| M-D2 Included | DS2 | Reorg risk | Low-value |
| **M-D3 Confirmed** | DS3 | Balanced | Stablecoin |
| **M-D4 Finalized** | DS4 | Strict safety | BTC / high-value |

### 4 deposit balance state

| State | Spendable? | Risk |
|---|---|---|
| Pending | No | Reorg / attribution fail |
| Available | Yes (with hold lift) | Deep reorg |
| Settled | Yes | None |
| Finalized | Yes (full confidence) | None |

### 4 deposit drift type

| Type | Drift |
|---|---|
| DD1 | Chain tx + attribution OK but no LedgerEntry |
| DD2 | LedgerEntry exists but no backing chain tx |
| DD3 | Multiple LedgerEntries for same chain tx (double-credit BUG) |
| DD4 | Chain tx exists but attribution unresolved |

### 10-item operational fragility (mitigation 명시)

| # | Fragility | Mitigation |
|---|---|---|
| F1 | Chain reorg | Compensating entry + chain policy |
| F2 | Delayed indexing | Multi-indexer + lag SLO |
| F3 | Duplicate observation | DB unique constraint |
| F4 | Attribution ambiguity | Multi-key attribution + memo enforcement + manual review |
| F5 | Partial ingestion | Redundant indexers + checkpoint + replay |
| F6 | Confirmation race | Depth-buffered threshold + per-asset |
| F7 | External transfer uncertainty | External attestation + cross-evidence |
| F8 | Deposit spam | Spam filter + quarantine |
| F9 | Replay ambiguity | Idempotent insert + lineage |
| F10 | Human investigation dependency | **Irreducible — customer contact workflow + KYC integration** |

→ 분류: Chain (F1, F2, F6) / Pipeline (F3, F5, F9) / **Attribution (F4, F8 deposit-specific)** / **External + Human irreducible (F7, F10)**.

### Bridge / CEX / OTC double-credit 위험

- Bridge: source chain lock event + destination chain mint event → destination 만 credit
- Cross-chain bridge fail (source lock but no destination mint) = 별도 reconciliation
- CEX → custody deposit = exchange evidence + own chain observation 둘 다 필요

### 3-way deposit burden

- SaaS: customer deposit burden ~25% (risk integration + token whitelist requests + reconciliation + exception + external evidence + customer cooperation)
- Hosted MPC: ~50% (+ custom attribution + recognition policy + audit mirror + hold policy)
- Direct-build: ~100% (+ multi-RPC indexer + chain adapter per chain + HD-derivation + memo + token registry + risk engine + spam filter + reorg/compensating + reconciliation engine)

→ Lock-in pivot: multi-chain indexer + adapter + token registry + spam + reorg/compensating + risk engine = burden 의 ~80%.

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/deposit-lifecycle.md` | **신규 생성** (~18 sections + Mermaid 10+ diagrams) |
| `log.md` | Stage 32 D7 항목 append (본 항목) |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 34 consecutive stages: 6-32).

### Mermaid 호환성 정책 유지

D1a / D2 / D3 / D4 / D5 / D1b / D8 의 fix 결과 직접 반영:
- `graph TB` 만 사용
- 모든 node label `"..."` quote
- classDef trailing semicolon 제거
- State machine = graph TB transition 방식

### 다음 단계 (D7 이후)

- **D6 — 3-way Custody Decision Framework** (next planned): 전체 architecture reasoning 의 의사결정 framework. SaaS vs Hosted MPC vs Direct-build 의 sovereignty / governance / recovery / evidence / reconciliation / operational survivability ownership 결정.
- (Optional D9) — Multi-chain adapter pattern detail.

### Uncertainty boundary 유지

- 9 phase / 4 attribution model / 5 recognition gate / 4 timing model / 4 balance state / 4 drift type / compensating credit / 80% burden 분포 = **generalized deposit architecture pattern (Hypothesis ★)**.
- Fireblocks 의 deposit 구현은 reference model.
- §4.4 timing model trade-off = operational reasoning, 측정값 아님.
- §15.2 burden 백분율 = operational reasoning estimate.
- §15.4 추천 = 운영 권장.
- §13 limitation = D1b + D5 의 직접 적용.
- §17 에 org policy 영역 명시 (recognition timing per asset / confirmation per asset / attribution model / memo enforcement / asset whitelist / token registry / dust threshold / spam blacklist / risk provider / sanctioned list / hold policy / large deposit governance / reorg policy / notification policy / manual credit authority / external integration / reconciliation cadence / source-of-funds / audit retention / customer investigation SLA).

### Spine 상태

- Curated Wiki entity / hub: unchanged (34 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: 8 files (D1a + D2 + D3 + D4 + D5 + D1b + D8 + D7)
- Retrieval Q7 metrics: unchanged

### Architecture reasoning layer 누적 결과 (D1a + D2 + D3 + D4 + D5 + D1b + D8 + D7)

| 문서 | 핵심 명제 |
|---|---|
| D1a | 9-plane DB / secrets DB 저장 금지 |
| D2 | 4 state machine 분리 / MPC retry non-idempotent |
| D3 | 11-state governance SM / two-clock freshness |
| D4 | Recovery = governance ceremony under cryptographic risk |
| D5 | Custody = evidence system / Unified Evidence Spine |
| D1b | Reconciliation = cross-truth-domain consistency proof |
| D8 | Withdrawal = multi-domain state transition from user intent to economic finality |
| D7 | Deposit = controlled ledger recognition of external settlement (2-domain, attribution-heavy) |

→ 8 문서 = 5 trust domain + 1 evidence backbone + cross-domain reconciliation + outbound + inbound lifecycle 의 완성된 generalized custody architecture reasoning skeleton.

---

## Stage 32 D6 — 3-Way Custody Decision Framework (2026-05-19)

### 신규 파일

- `docs/architecture/three-way-custody-decision-framework.md` (D6) — Core thesis: "Custody architecture selection is fundamentally a sovereignty vs operational burden allocation problem." / D1a-D8 의 8 reasoning skeleton synthesis / 3 model generalized definition (SaaS / Hosted MPC / Direct-build) / Sovereignty vs burden matrix / Ownership allocation per domain 통합 / **Recovery sovereignty = ultimate custody sovereignty** / Evidence ownership / Reconciliation burden / Governance ownership / Signing ownership / Human operational burden / **10 failure-state scenarios** / **5-dimension organizational maturity** / **10 anti-pattern catalog** / 5 decision axes / Hybrid pattern reasoning / Re-evaluation cadence.

### Core invariants 정립

1. **Custody architecture selection = sovereignty vs operational burden allocation** (core thesis).
2. **3 모델 모두 customer 책임 0 불가능** — SaaS 도 governance / recovery / evidence / external reconciliation / compliance / incident response 는 customer.
3. **"Self-hosted = Sovereign" false equivalence** — sovereignty 는 survivability 의 함수, ownership sum 아님.
4. **Recovery sovereignty = ultimate custody sovereignty** — vendor 사라져도 fund control 가능?
5. **Operational survivability >> steady-state capability** — failure-state 가 model 선택 결정 factor.
6. **Technical capability ≠ Organizational readiness** — 도구 ≠ 조직 능력.
7. **Custody complexity 는 signing 보다 governance/reconciliation/evidence/recovery/exception** — "키 관리" 아닌 "운영 survivability".
8. **Human coordination = irreducible** — automation limit.
9. **5-dimension maturity** — technical / operational / governance / compliance / incident-response.
10. **정답 architecture 없음** — context-dependent trade-off framework.

### 10 "≠" 명제 통합

| Proposition |
|---|
| Self-custody ≠ Full sovereignty |
| SaaS ≠ No responsibility |
| Direct-build ≠ Maximum security |
| MPC ≠ Governance safety |
| Air-gap ≠ Operational resilience |
| Evidence retention ≠ Forensic readiness |
| Recovery capability ≠ Recovery survivability |
| Operational control ≠ Operational maturity |
| Decentralization ≠ Reduced governance burden |
| Technical capability ≠ Organizational readiness |

### 3 model generalized 정의

| 모델 | Vendor 의존 | Customer 책임 |
|---|---|---|
| SaaS Custody | 매우 높음 | ~25-45% (D7/D8 burden 기준) |
| Hosted MPC / 설치형 WaaS | 중간 | ~50-70% |
| Direct-build | 매우 낮음 | ~100% |

→ 3 모델은 spectrum (discrete point 아님), hybrid 가 흔함.

### Recovery sovereignty (§4 핵심)

| Component | SaaS | Hosted MPC | Direct-build |
|---|---|---|---|
| Custodian quorum | Customer | Customer | Customer |
| Passphrase | Customer | Customer | Customer |
| Backup package | Customer + vendor encrypted | Customer 더 큼 | Customer |
| Recovery utility | **Vendor-dependent** ★ | Vendor + customer | Customer |
| Re-enrollment | **Vendor-dependent** ★ | Customer cosigner | Customer |
| DR exercise | Customer | Customer | Customer |

→ **SaaS recovery sovereignty 의 weakness**: Recovery utility + re-enrollment 의 vendor 의존. Mitigation: standardized backup format / vendor-independent recovery tool / multi-vendor re-enrollment / external recovery escrow.

### 10 failure-state scenarios

| Scenario | SaaS weakness | Direct-build weakness |
|---|---|---|
| S1 Vendor disappearance | **Critical** | Low |
| S2 Cloud outage | Medium | Low |
| S3 Insider compromise | Low (vendor's controls) | **High (customer's only)** |
| S4 Governance corruption | Vendor 도움 | Customer 책임 |
| S5 Recovery failure | Customer 책임 (모델 무관) | Customer 책임 |
| S6 Evidence loss | Vendor retention 의존 | Customer 책임 |
| S7 Drift accumulation | Vendor reconciliation 도움 | Customer 책임 |
| S8 Custodian unavailability | Customer 책임 (모델 무관) | Customer 책임 |
| S9 Human coordination collapse | Lower (smaller team) | **Higher (larger team)** |
| S10 Regulatory escalation | Vendor compliance 도움 | Customer 책임 |

→ 각 model 의 strength/weakness 다름. SaaS 는 S1 에 weak, Direct-build 는 S9 에 weak.

### 5-dimension organizational maturity

| Maturity | Indicators |
|---|---|
| Technical | engineering team / chain expertise / DevOps |
| Operational | on-call rotation / SLA monitoring / runbook / DR exercise |
| Governance | quorum coverage / approver training / policy review / break-glass discipline |
| Compliance | regulator relationship / KYC integration / AML / audit history |
| Incident response | postmortem / forensic tooling / red team / threat model |

### Organization-model mapping (★ Hypothesis starting point)

| Organization | Maturity (T/O/G/C/IR) | 권장 |
|---|---|---|
| Startup (early) | L/L/L/L/L | SaaS |
| Startup (scaling) | M/M/M/M/M | SaaS or Hosted MPC |
| Crypto Exchange (mid) | H/H/M/M/M | Hosted MPC + 자체 reconciliation |
| Crypto Exchange (large) | H/H/H/H/H | Direct-build |
| Bank (entering crypto) | M-H/H/H/H/H | Hosted MPC + bank governance overlay |
| Stablecoin Issuer | H/H/H/H/M | Direct-build |
| Infra Provider | H/H/H/H/H | Direct-build (vendor 자체) |
| Sovereign Entity (CBDC) | H/H/Max/Max/Max | Direct-build |
| Family office | L-M/L/M/L/L | SaaS |
| DAO / DeFi | M-H/L/L/L/L | Hybrid (multi-sig + SaaS) |

### 10 anti-pattern catalog

| # | Anti-pattern | 진실 |
|---|---|---|
| 1 | MPC = solved custody | MPC 는 signing 의 일부만 해결; governance/reconciliation/evidence/recovery burden 잔존 |
| 2 | Self-hosted = sovereign | Self-hosted SaaS 는 vendor lock-in 잔존; recovery sovereignty 가 진짜 test |
| 3 | SaaS = outsourced responsibility | SaaS 도 customer 책임 ~25-45% |
| 4 | Air-gap = secure | Air-gap 는 mitigation 의 한 layer; supply chain / physical / human / side-channel 잔존 |
| 5 | Direct-build = institutional-grade | Institutional-grade 는 maturity 의 함수, 자체 구축 자동 등급 아님 |
| 6 | Append-only = forensic complete | Hash chain / WORM / external anchoring / signing 추가 필요 |
| 7 | Recovery exists = survivable | DR exercise / custodian maintenance / utility maintenance 없으면 작동 안 함 |
| 8 | Reconciliation automated = safe | Exception capacity 가 safety 결정 factor |
| 9 | Multi-sig = governance | Multi-sig 는 crypto primitive; governance 는 state machine + freshness + escalation + audit |
| 10 | More control = better | Maturity 가 부족하면 over-control 도 anti-pattern |

### 5 decision axes

1. **Sovereignty requirement** — regulatory / business / philosophical
2. **Operational tolerance** — burden customer can absorb
3. **Organizational maturity** — 5-dimension
4. **Survivability target** — failure-state plan
5. **Asset characteristic** — volume / chain / regulation

### Hybrid pattern (common)

- SaaS + 자체 reconciliation engine (vendor evidence + own cross-system)
- SaaS + 자체 backup escrow (recovery sovereignty)
- Hosted MPC + 자체 governance plane (compliance 우선)
- Direct-build + vendor 일부 service (예: indexer outsource)

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/three-way-custody-decision-framework.md` | **신규 생성** (~15 sections + Mermaid 10+ diagrams) |
| `log.md` | Stage 32 D6 항목 append (본 항목) |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 35 consecutive stages: 6-32).

### Mermaid 호환성 정책 유지

D1a / D2 / D3 / D4 / D5 / D1b / D7 / D8 의 fix 결과 직접 반영:
- `graph TB` 만 사용
- 모든 node label `"..."` quote
- classDef trailing semicolon 제거
- State machine = graph TB transition 방식

### Architecture reasoning layer 완성

**9 문서 = generalized custody architecture reasoning skeleton 완성**.

D6 는 D1a-D8 의 8 reasoning skeleton 을 organization-facing decision framework 로 통합한 final synthesis. 9 문서 모두 entity-min discipline 유지 (35 consecutive stages: 6-32, 신규 entity 0).

### 다음 단계 (D6 이후)

본 문서로 D 시리즈의 closing synthesis 완료. 다음 specialized domain 후보:

- **D9 — Multi-chain Adapter Pattern** (EVM vs UTXO / finality variance / mempool / bridge / chain abstraction)
- **D10 — Treasury / Reserve / Mint-Burn Architecture** (issuance authority / reserve reconciliation / stablecoin accounting)
- **D11 — Compliance / AML / Sanctions Boundary** (policy enforcement / monitoring / freeze / travel rule)

### Uncertainty boundary 유지

- 3-model spectrum / 5 sovereignty dimension / 10 failure scenarios / 5 maturity dimension / 10 anti-pattern / 5 decision axes / hybrid 흔함 = **generalized decision architecture pattern (Hypothesis ★)**.
- D1a-D8 burden 백분율 = operational reasoning estimate.
- §11.3 organization-model mapping = starting point.
- §13.3 decision flowchart = simplification.
- §14 에 org policy 영역 명시 (vendor scorecard / pricing / migration / compliance regime / multi-region / chain support / DeFi / treasury / cross-border / audit firm / insurance / token registry / bridge / break-glass authority / DR exercise / custodian incentive / utility maintenance / token whitelist).
- "정답 architecture" 제시 안 함 — context-dependent framework.

### Spine 상태

- Curated Wiki entity / hub: unchanged (35 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: **9 files (D1a + D2 + D3 + D4 + D5 + D1b + D7 + D8 + D6)**
- Retrieval Q7 metrics: unchanged

### Architecture reasoning layer 완성 (D1a-D8 + D6)

**9 문서 = generalized custody architecture reasoning skeleton 완성**.

| 문서 | 핵심 명제 |
|---|---|
| D1a | 9-plane DB / secrets DB 저장 금지 |
| D2 | 4 state machine 분리 / MPC retry non-idempotent |
| D3 | 11-state governance SM / two-clock freshness |
| D4 | Recovery = governance ceremony under cryptographic risk |
| D5 | Custody = evidence system / Unified Evidence Spine |
| D1b | Reconciliation = cross-truth-domain consistency proof |
| D7 | Deposit = controlled ledger recognition of external settlement |
| D8 | Withdrawal = multi-domain state transition |
| **D6** | **Custody architecture = sovereignty vs operational burden allocation** |

→ D6 는 D1a-D8 의 reasoning 을 organization-facing decision framework 로 통합한 **final synthesis**. D series 완성.

---

## Stage 32 D9 — Multi-chain Adapter Pattern (2026-05-19)

### 신규 파일

- `docs/architecture/multi-chain-adapter-pattern.md` (D9) — Core thesis: "Multi-chain custody is not multi-RPC support. It is semantic normalization across heterogeneous settlement systems." / 6 chain model (EVM / UTXO / Solana-style / Rollup / Bridge / Account abstraction) / 10-dimension variance map / UTXO vs Account fundamental difference / 3 finality model (probabilistic / deterministic / hybrid) / 5 mempool model / 4 replacement mechanism / 5 bridge risk / Rollup 4-state settlement (L2 incl → L2 final → L1 submit → L1 final + trustless withdrawal) / Adapter layer = semantic normalization (10 role) / Cross-chain reconciliation complexity / Multi-chain evidence normalization / Limitations / 3-way burden / Q1-Q10.

### Core invariants 정립

1. **Multi-chain = semantic normalization, not multi-RPC** (core thesis).
2. **10-tier "≠" 명제**:
   - Same tx model ≠ Same settlement semantics
   - Confirmation ≠ Finality
   - Finality ≠ Irreversibility
   - Included tx ≠ Ordered tx
   - Broadcast success ≠ Mempool visibility
   - Nonce sequencing ≠ Deterministic ordering
   - Bridge transfer ≠ Native settlement
   - Wrapped asset ≠ Underlying asset
   - Rollup state ≠ L1 settlement
   - Chain support ≠ Semantic equivalence
3. **6 chain model generalized** — EVM / UTXO / Parallel runtime (Solana) / Rollup (Optimistic+ZK) / Bridge-mediated / Account abstraction.
4. **10-dimension variance** — finality / reorg / mempool / replacement / fee / ordering / state / address / indexing / confirmation reliability.
5. **UTXO vs Account = fundamental difference** — state model → tx model → signing → reconciliation → replay 모두 다름.
6. **Finality 3-model** — Probabilistic (BTC) / Deterministic (Cosmos) / Hybrid (Ethereum post-merge, Solana).
7. **Bridge = additional trust domain** — 5 risk (insolvency / halt / exploit / governance attack / oracle manipulation).
8. **Rollup 4-state** — L2 inclusion (sequencer trust) → L2 finality → L1 submission → L1 finality (+ trustless withdrawal).
9. **Adapter = semantic normalization layer** — 10 role (finality / confirmation / replacement / event / fee / address / tx / indexing / evidence / reconciliation). RPC translation 은 network layer.
10. **Chain upgrade = silent semantic drift** — hard fork / soft fork / consensus upgrade 가 adapter assumption invalidate.

### 10 reasoning question 정답 (요약)

| Q | 답 |
|---|---|
| Q1 Multi-chain ≠ multi-RPC? | 10 dimension × N chain × evolving = semantic normalization burden |
| Q2 UTXO vs Account fundamental? | State (set vs global) → tx (consume+produce vs mutation) → signing (multi vs single) → reconciliation (UTXO vs balance) → replay (once-spent vs nonce) |
| Q3 Confirmation ≠ Finality? | Confirmation = chain fact (depth); Finality = irreversibility guarantee; 3 model |
| Q4 Finality ≠ Irreversibility? | Final 도 social consensus; 51% / hard fork / chain bug 로 reversal 가능; economic + game-theoretic, mathematical 아님 |
| Q5 Bridge ≠ Native? | Bridge 5 risk + wrapped asset = derivative (다른 risk profile) |
| Q6 Rollup state ≠ L1 settlement? | L2 inclusion = sequencer trust; L1 finality = trustless; 4-state progression + challenge period |
| Q7 Same confirmation count ≠ Same risk? | BTC 6 conf 60min strong vs ETH 6 block 72s weak; chain-specific + value-specific |
| Q8 Adapter = semantic normalization? | 10 normalize role; RPC translation 은 network layer 만 |
| Q9 Cross-chain reconciliation complexity? | Different finality + bridge integrity + wrapped accounting + cross-chain ordering + reorg cascade; polynomial 이상 |
| Q10 Chain upgrade = silent drift? | Fork/consensus/EIP/SIP 가 adapter assumption invalidate; monitoring + version + canary 필요 |

### 6 chain model + custody impact

| 모델 | Core property | Custody impact |
|---|---|---|
| EVM account | Global mutable + nonce + sequential | Balance tracking + nonce mgmt |
| UTXO | Unspent set + parallel-ready | UTXO tracking + multi-sig per tx |
| Parallel runtime | Account + parallelism via access list | Parallel signing 가능 |
| Rollup / L2 | Nested settlement; sequencer 의존 | L2/L1 multi-layer evidence |
| Bridge-mediated | Source lock + dest mint | Additional trust + wrapped accounting |
| Account abstraction | SC = account; custom signature/nonce/fee | Custom signing scheme |

### 10-dimension chain variance map

D1 Finality / D2 Reorg depth / D3 Mempool visibility / D4 Tx replacement / D5 Fee market / D6 Ordering guarantee / D7 State mutation / D8 Address model / D9 Event indexing / D10 Confirmation reliability

→ 10 dimension × 6 model × N chain instance = multiplicative complexity. Multi-chain custody 의 complexity 가 chain 수의 선형이 아닌 multi-dimensional product.

### 5 mempool model

- Public mempool (BTC, ETH legacy)
- Private mempool / MEV-protected (Flashbots)
- Sequencer-only (rollups)
- No mempool / instant inclusion (Cosmos, Solana 부분)
- Hybrid (modern Ethereum)

### 4 replacement mechanism

| Mechanism | Same economic event? |
|---|---|
| RBF | Yes (higher fee, same UTXO/recipient/amount) |
| CPFP | Yes (child tx as side payment) |
| Nonce-replace | **No (different tx content possible)** |
| Cancel-replace | Economic event cancellation |

→ Replacement 4 종류는 economic 의미 다름 — custody system 이 명시적 구분 필요.

### Adapter layer 10 normalization role

1. Normalize finality (chain threshold → 공통 Settled/Final state)
2. Normalize confirmation (chain depth → 공통 policy)
3. Normalize replacement (RBF/CPFP/nonce → 공통 event)
4. Normalize event lineage (chain format → 공통 envelope)
5. Normalize fee model (EIP-1559/legacy/fixed → 공통 abstraction)
6. Normalize address model (UTXO/EVM/contract → 공통 registry)
7. Normalize tx model (UTXO/account → 공통 SigningRequest)
8. Normalize indexing (logs/receipts/state diff → 공통 capture)
9. Normalize evidence (chain → 공통 D5 chain)
10. Normalize reconciliation (chain reorg → 공통 D1b compensating entry)

### 3-way multi-chain burden

- SaaS: customer multi-chain burden ~30% (bridge choice + cross-chain reconciliation + chain whitelist requests + wrapped accounting + asset universe decision)
- Hosted MPC: ~60% (+ per-chain adapter config + audit mirror + custom reorg policy per chain)
- Direct-build: ~100% (+ per-chain adapter engineering + per-chain reorg/mempool + per-chain indexing/finality + chain upgrade monitoring + bridge integration per bridge + cross-chain reconciliation engine)

→ Lock-in pivot: per-chain adapter + chain upgrade + bridge integration + multi-chain evidence/forensic = burden 의 ~80%.

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/multi-chain-adapter-pattern.md` | **신규 생성** (~16 sections + Mermaid 10+ diagrams) |
| `log.md` | Stage 32 D9 항목 append (본 항목) |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 36 consecutive stages: 6-32).

### Mermaid 호환성 정책 유지

D1a / D2 / D3 / D4 / D5 / D1b / D7 / D8 / D6 의 fix 결과 직접 반영:
- `graph TB` 만 사용
- 모든 node label `"..."` quote
- classDef trailing semicolon 제거
- State machine = graph TB transition 방식

### 다음 단계 (D9 이후)

- D10 — Treasury / Reserve / Mint-Burn Architecture (stablecoin issuance + reserve reconciliation + accounting semantics; D7/D8 + D9 응용)
- D11 — Compliance / AML / Sanctions Boundary (policy enforcement + monitoring + freeze + travel rule; D3 + D7/D8 compliance side)
- D12 — Operational Maturity / Incident Command (incident response + forensic + postmortem + red team + threat model; D6 organizational maturity detail)

### Uncertainty boundary 유지

- 6 chain model / 10 variance dimension / 5 mempool model / 4 replacement mechanism / 5 bridge risk / 2-type rollup / 10 adapter normalization role / 80% burden 분포 = **generalized multi-chain architecture pattern (Hypothesis ★)**.
- §2.1 chain-specific variance 표 = starting point, 시간에 따라 변화.
- §4.4 confirmation depth 권장값 = industry common practice.
- §13.2 burden 백분율 = operational reasoning estimate.
- §13.5 추천 = 운영 권장.
- §12 limitation = chain semantics 의 standard 입장.
- §15 에 org policy 영역 명시 (~20 영역).

### Spine 상태

- Curated Wiki entity / hub: unchanged (36 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: **10 files (D1a + D2 + D3 + D4 + D5 + D1b + D7 + D8 + D6 + D9)**
- Retrieval Q7 metrics: unchanged

### Architecture reasoning layer 누적 결과 (D1a-D8 + D6 + D9)

**10 문서 = generalized custody + specialized chain architecture reasoning skeleton**.

| 문서 | 핵심 명제 |
|---|---|
| D1a | 9-plane DB / secrets DB 저장 금지 |
| D2 | 4 state machine 분리 / MPC retry non-idempotent |
| D3 | 11-state governance SM / two-clock freshness |
| D4 | Recovery = governance ceremony under cryptographic risk |
| D5 | Custody = evidence system / Unified Evidence Spine |
| D1b | Reconciliation = cross-truth-domain consistency proof |
| D7 | Deposit = controlled ledger recognition of external settlement |
| D8 | Withdrawal = multi-domain state transition |
| D6 | Custody architecture = sovereignty vs operational burden allocation |
| **D9** | **Multi-chain custody = semantic normalization across heterogeneous settlement systems** |

→ D9 는 D1a-D8 + D6 의 generalized skeleton 위의 **first specialized domain**. Chain semantic 의 변화가 모든 prior reasoning 에 어떻게 propagate 되는가의 reasoning.

---

## Stage 32 D10 — Treasury / Reserve / Mint-Burn Architecture (2026-05-19)

### 신규 파일

- `docs/architecture/treasury-reserve-mint-burn.md` (D10) — Core thesis: "Stablecoin issuance is not token minting. It is synchronized multi-domain monetary state management." / **6 truth domain** (Reserve / Treasury Ledger / Mint-Burn Governance / Blockchain Supply / Redemption Settlement / Evidence/Attestation) / Mint lifecycle 11-phase / Burn-redemption lifecycle 10-phase / **5 reserve model** (Segregated / Omnibus / Multi-bank / Custodian / Tokenized) / **6 supply type** (Total minted / Treasury-held / Circulating / Locked / Bridged / Wrapped) / Treasury governance = custody + financial governance / **Proof-of-Reserve 의 4 component + limitations** / 4-pair cross-domain reconciliation / Cross-chain wrapped supply explosion / 10 treasury risks / Monetary evidence chain / 3-way burden / Q1-Q10.

### Core invariants 정립

1. **Stablecoin = synchronized multi-domain monetary state management** (core thesis).
2. **10-tier "≠" 명제**:
   - Mint request ≠ Supply increase finality
   - Burn request ≠ Supply reduction finality
   - Reserve balance ≠ Circulating supply truth
   - Treasury wallet ≠ Reserve ownership
   - Proof-of-reserve ≠ Solvency proof
   - Token existence ≠ Redeemability
   - Redemption request ≠ Settlement completion
   - Reserve segregation ≠ Bankruptcy remoteness
   - Supply equality ≠ Economic backing integrity
   - Fiat settlement ≠ On-chain finality
3. **6 truth domain** — 5-domain (D1b) 보다 큼; off-chain Reserve / Redemption settlement 추가 (third-party trust class).
4. **5 reserve model** trade-off — governance / reconciliation / insolvency risk / operational burden / evidence 각각 다름.
5. **6 supply type 분리** — 단일 "supply" 가 4-5 의미 collapse.
6. **Monetary governance = custody governance + financial governance** — two layers stack.
7. **PoR ≠ Solvency proof** — assets snapshot, liabilities + redeemability 미포함; trust chain nested (issuer + auditor + bank).
8. **Wrapped supply explosion** — same underlying 의 multi-wrap = trust nested chain, exponential reconciliation complexity.
9. **Banking dependency irreducible** — fiat settlement / regulatory freeze / banking infra 의 customer 외 dependency.
10. **Stablecoin issuance = money-state evidence system** — output = token + cross-domain monetary evidence chain.

### 10 reasoning question 정답 (요약)

| Q | 답 |
|---|---|
| Q1 Stablecoin = state management? | 6-domain synchronized; mint/burn 은 cross-domain operation |
| Q2 Mint ≠ Supply finality? | 11-phase × failure point (fiat/governance/signing/chain/reconciliation) |
| Q3 PoR ≠ Solvency proof? | PoR = assets snapshot; Solvency = assets - liabilities; PoR + PoL 필요 |
| Q4 Reserve ≠ Circulating supply truth? | Reserve = off-chain target; Circulating = subset 분리; 일치 시점 다름 |
| Q5 Token ≠ Redeemability? | Redemption gate (KYC / compliance / liquidity / banking) |
| Q6 Reserve segregation ≠ Bankruptcy remoteness? | Segregation = bookkeeping; remoteness = legal property (trust / regulatory) |
| Q7 Wrapped multiplicative risk? | Same underlying multi-wrap = nested trust chain, exponential cross-chain reconciliation |
| Q8 Monetary governance = custody + financial? | Two layers stack; 단일 SM 아닌 layered (approver / SLA / audit / quorum / break-glass 다름) |
| Q9 Mass redemption cascade? | Banking-style run-on-bank; T4 trigger → mass demand → liquidity stress → run |
| Q10 Treasury SaaS customer 책임 큰 이유? | Banking + compliance + regulatory + monetary governance = vendor 흡수 못함 |

### 6 truth domain for treasury

| Domain | Trust class | Authority |
|---|---|---|
| Reserve (off-chain) | Third-party (bank / custodian) | Bank statement + custodian attestation |
| Treasury ledger (internal) | Own | Full control |
| Mint-Burn governance | Own + D3 | Issuance authority |
| Blockchain supply | Blockchain | Settlement authority |
| Redemption settlement (off-chain) | Third-party | Bank + own ops |
| Evidence / attestation | Own + auditor | Cross-domain validation |

### 5 reserve model 비교

| Model | Insolvency risk | Operational | Evidence |
|---|---|---|---|
| Segregated | Per-customer (bankruptcy remote 가능) | Heavy | Per-customer |
| Omnibus | Pool 의 bankruptcy risk | Light | Single |
| Multi-bank | Diversified | Medium-heavy | Cross-bank |
| Custodian | Custodian bankruptcy | Medium | Custodian-dependent |
| Tokenized | Tokenization issuer risk | Medium | On-chain native |

### 6 supply type

| Supply | 의미 | Backing 의무 |
|---|---|---|
| Total minted | mint event 누적 | Yes (모든 backing) |
| Treasury-held | issuer 자체 보유 | Self-circular |
| Circulating | 외부 transferable | **Yes — 가장 중요** |
| Locked | vesting / contract / staking | Yes (when unlock) |
| Bridged | source lock + dest mint | Source backing 그대로 |
| Wrapped | Third-party wrapping | **Independent backing risk** |

### Treasury governance = custody + financial 2-layer

| Dimension | Custody governance | Financial governance |
|---|---|---|
| Approver | Operations | Treasury / CFO / compliance |
| SLA | minutes-hours | hours-days |
| Audit | governance audit | financial audit |
| Quorum | M-of-N admin | M-of-N treasury committee |
| Break-glass | operational emergency | financial crisis (run-on-bank) |

### PoR 4 component + limitations

| Component | 한계 |
|---|---|
| Reserve attestation | Bank/custodian own risk |
| Supply snapshot | Real-time 부정확 |
| Reserve ≥ Supply check | Liabilities 미포함 |
| Auditor signed proof | Auditor own risk |

→ ZK-based PoR (emerging) = real-time + privacy-preserving solvency proof, mainstream 아님.

### Cross-chain wrapped supply explosion

```
Native USDT (Ethereum)
  → bridged to Tron/BSC/Polygon/Avalanche (10+ chains)
    → wrapped by third-party on each chain
      → bridged again to L2s/sidechains
```

→ Effective monetary state = source reserve × N chain × M wrapper layer. Reconciliation exponentially explodes.

### 10 treasury risks (mitigation 명시)

| # | Risk | Mitigation |
|---|---|---|
| T1 | Bank failure | Multi-bank diversification + bankruptcy remoteness |
| T2 | Treasury compromise | MPC + recovery ceremony + rotation policy |
| T3 | Unauthorized mint | Multi-layer governance + cap policy + monitoring |
| T4 | Redemption freeze | Liquidity ratio + redemption SLA + transparency |
| T5 | Reserve drift | Frequent reconciliation + delta investigation |
| T6 | Delayed fiat settlement | Multi-bank rail + same-day settlement |
| T7 | Wrapped supply mismatch | Wrapper whitelist + attestation requirement |
| T8 | Bridge insolvency | Bridge diversification + insurance + monitoring |
| T9 | Emergency governance abuse | Multi-sig emergency authority + post-hoc review SLO |
| T10 | Regulatory freeze | Multi-jurisdiction + legal counsel + compliance integration |

→ 분류: Banking (T1, T6) / Cryptographic (T2) / Governance (T3, T9) / Operational (T4, T5) / External-dependency (T7, T8) / **Regulatory irreducible (T10)**.

### 3-way treasury burden

- SaaS + managed treasury: customer treasury burden ~60% (banking ops + compliance + reserve reconciliation + redemption + PoR + wrapped tracking + regulatory + governance design)
- Hosted MPC / partial: ~80% (+ mint orchestration + treasury ledger 자체 + audit mirror)
- Direct-build: ~100% (+ token contract + mint/burn governance system + treasury ledger infra + multi-chain supply + bridge reconciliation + PoR pipeline + treasury security)

→ Treasury 는 SaaS 에서도 customer 책임 ~60% — banking + regulatory + monetary governance 가 vendor 흡수 못함. Lock-in pivot: banking ops + compliance/regulatory + PoR + cross-chain wrapped tracking = burden 의 ~80%.

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/treasury-reserve-mint-burn.md` | **신규 생성** (~15 sections + Mermaid 10+ diagrams) |
| `log.md` | Stage 32 D10 항목 append (본 항목) |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 37 consecutive stages: 6-32).

### Mermaid 호환성 정책 유지

D1a-D9 의 fix 결과 직접 반영:
- `graph TB` 만 사용
- 모든 node label `"..."` quote
- classDef trailing semicolon 제거

### 다음 단계 (D10 이후)

- D11 — Compliance / AML / Sanctions Boundary (D3 + D7/D8 + D10 의 compliance dimension)
- D12 — Operational Maturity / Incident Command (D6 maturity detail + incident response)
- D13 — Cross-border Settlement / FX / Liquidity Routing (stablecoin cross-border + FX)

### Uncertainty boundary 유지

- 6 truth domain / 5 reserve model / 6 supply type / 4 PoR component / 10 treasury risk / 4-pair reconciliation / 80% burden 분포 = **generalized monetary custody architecture pattern (Hypothesis ★)**.
- §4.4 tokenized reserve + §5.5 wrapped supply explosion = emerging pattern.
- §7.6 ZK-based PoR = emerging research.
- §9.2 mass redemption cascade = systemic risk model (Hypothesis level).
- §12.2 burden 백분율 = operational reasoning estimate.
- 본 문서는 **특정 stablecoin implementation 설명 아님** — generalized pattern.
- §14 에 org policy 영역 명시 (~20 영역).

### Spine 상태

- Curated Wiki entity / hub: unchanged (37 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: **11 files** (D1a + D2 + D3 + D4 + D5 + D1b + D7 + D8 + D6 + D9 + D10)
- Retrieval Q7 metrics: unchanged

### Architecture reasoning layer 누적 (D1a-D9 + D10)

**11 문서 = generalized custody + chain specialization + monetary specialization**.

| 문서 | 핵심 명제 |
|---|---|
| D1a | 9-plane DB |
| D2 | 4 state machine 분리 |
| D3 | 11-state governance SM |
| D4 | Recovery = governance ceremony |
| D5 | Custody = evidence system |
| D1b | Reconciliation = cross-truth-domain consistency proof |
| D7 | Deposit = controlled ledger recognition |
| D8 | Withdrawal = multi-domain state transition |
| D6 | Custody architecture = sovereignty vs operational burden |
| D9 | Multi-chain = semantic normalization |
| **D10** | **Stablecoin issuance = synchronized multi-domain monetary state management** |

→ D10 = D6 generalized framework + D9 multi-chain specialization 위의 **monetary specialization**. Custody architecture 의 financial application.

---

## Stage 32 D11 — Compliance / AML / Sanctions Boundary (2026-05-19)

### 신규 파일

- `docs/architecture/compliance-aml-sanctions-boundary.md` (D11) — Core thesis: "Compliance in institutional custody is not a filtering layer. It is policy-constrained state transition governance across financial, legal, and settlement domains." / 10 compliance sub-plane (C1-C10: Screening / Monitoring / Risk scoring / Review / Decision / Hold-freeze / Travel rule / Reporting / Evidence / Jurisdiction) / Deposit-side + withdrawal-side AML lifecycle / Sanctions enforcement semantics / **6 freeze type** (Soft / Hard / Treasury-level / Smart-contract / Redemption / Jurisdiction-scoped) / Blacklist governance / Travel rule = cross-domain identity coordination problem / Risk scoring limitations / Cross-chain compliance / Compliance evidence chain / Jurisdictional variance / 10 operational fragility / 3-way burden (compliance 가 가장 vendor 흡수 적음 ~80%) / Q1-Q10.

### Core invariants 정립

1. **Compliance = policy-constrained state transition governance across financial / legal / settlement domains** (core thesis).
2. **Compliance ≠ Filter** — binary pass/block 아닌 multi-stage governance lifecycle.
3. **20-tier "≠" 명제 통합**:
   - Monitoring ≠ Enforcement
   - KYT ≠ Economic attribution
   - Address ownership ≠ Beneficial ownership
   - Risk score ≠ Criminal certainty (Ground truth)
   - Freeze capability ≠ Legal authority
   - Blacklist ≠ Prevented settlement
   - Compliance approval ≠ Regulatory safety
   - Travel rule compliance ≠ Counterparty trust
   - Flagged tx ≠ Illicit activity
   - Sanctions screening ≠ Complete detection
   - Detection ≠ Attribution
   - Observation ≠ Enforcement
   - Freeze ≠ Confiscation
   - Regulatory request ≠ Governance authorization
   - Compliance evidence ≠ Legal proof
   - Address cluster ≠ Entity identity
   - On-chain traceability ≠ Economic traceability
   - Cross-chain visibility ≠ Cross-chain control
   - Automated screening ≠ Compliance completeness
   - Monitoring coverage ≠ Operational survivability
4. **6 freeze type** with different authority + survivability — Smart-contract freeze 가 가장 powerful + 가장 abuse risk.
5. **Travel rule = cross-domain identity coordination problem** — counterparty + jurisdiction + privacy.
6. **Risk score = probabilistic heuristic** — graph / mixer / bridge / privacy chain 한계.
7. **Cross-chain visibility ≠ control** — wrapped / bridge / privacy chain 의 control gap.
8. **Compliance evidence ≠ Legal proof** — operational audit ≠ court-admissible.
9. **Compliance SaaS customer burden ~80%** — 가장 vendor 흡수가 적은 영역.
10. **Compliance system = evidence-producing governance system** — output 은 freeze action + regulator submission evidence chain.

### 10 reasoning question 정답 (요약)

| Q | 답 |
|---|---|
| Q1 Compliance ≠ Filter? | Multi-stage governance lifecycle (screen→monitor→score→review→decide→act→escalate→report→retain) |
| Q2 Monitoring ≠ Enforcement? | Observation ≠ action with authority |
| Q3 KYT ≠ Economic attribution? | Chain heuristic ≠ actual entity (off-chain identity 필요) |
| Q4 Risk score ≠ Ground truth? | Probabilistic; graph/mixer/privacy/cross-chain 한계 |
| Q5 Sanctions screening ≠ Complete detection? | List lag / address rotation / cluster / privacy / cross-chain obfuscation |
| Q6 Freeze ≠ Confiscation? | Movement 차단 (own) ≠ ownership transfer (legal order) |
| Q7 Travel rule ≠ Counterparty trust? | Process compliance ≠ payload accuracy |
| Q8 Cross-chain visibility ≠ control? | Observe 가능해도 freeze 불가 (wrapped / bridge / privacy) |
| Q9 Compliance evidence ≠ Legal proof? | Operational audit ≠ court-admissible (chain of custody / notarization) |
| Q10 Compliance SaaS customer 책임 큰 이유? | Regulator relationship + officer liability + jurisdictional policy + analyst team = vendor 흡수 못함 |

### 10 compliance sub-plane (C1-C10)

C1 Screening (pre-action) / C2 Monitoring (continuous) / C3 Risk scoring (heuristic) / C4 Review (analyst) / C5 Decision / C6 Hold/Freeze (enforcement) / C7 Travel rule / C8 Reporting (SAR/STR/CTR) / C9 Evidence / C10 Jurisdiction

### 6 freeze type 비교

| Type | Scope | Authority | Reversibility |
|---|---|---|---|
| Soft freeze | own custody | own ops | high |
| Hard freeze | own custody | compliance officer | medium |
| Treasury-level | issuer tokens | treasury committee | medium |
| Smart-contract | on-chain global | contract owner | high (upgrade) |
| Redemption | banking rail | own + bank | medium |
| Jurisdiction-scoped | per region | regional compliance | high |

### 10 operational fragility (mitigation)

| # | Fragility | Mitigation |
|---|---|---|
| F1 | False positive overload | Threshold tuning + tiered review + auto-resolve |
| F2 | Analyst fatigue | Tooling + sizing + rotation |
| F3 | Jurisdiction conflict | Legal counsel + most-strict default |
| F4 | Emergency freeze abuse | Multi-sig + post-hoc review + transparency |
| F5 | Incomplete attribution | Multi-source + manual review |
| F6 | Cross-chain visibility gaps | Cross-chain vendor + manual + policy |
| F7 | Delayed regulatory escalation | SAR automation + SLA |
| F8 | Monitoring vendor dependency | Multi-vendor + own fallback |
| F9 | Evidence retention mismatch | Worst-case retention + per-jurisdiction |
| F10 | Human escalation irreducibility | **Irreducible** — team sizing + training |

### 3-way compliance burden

- SaaS: customer burden ~80% (analyst + compliance officer + decision + reporting + regulator + jurisdictional + evidence + travel rule + legal counsel)
- Hosted MPC: ~90% (+ audit mirror + custom screening + own monitoring)
- Direct-build: ~100% (+ sanctions infra + monitoring engine + risk scoring + travel rule protocol + reporting pipeline + long-term retention)

→ Compliance 는 SaaS 에서도 customer burden **~80%** — 가장 vendor 흡수 적은 영역. 이유: regulator relationship + officer liability + jurisdictional policy + analyst staffing = vendor 가 대리 못함. Lock-in pivot: analyst team + compliance officer + legal counsel = burden 의 ~80%.

### Travel rule = cross-domain identity coordination

5 fragility: Counterparty identification / Payload exchange protocol fragmentation / Off-chain identity dependency / Settlement timing mismatch / Privacy vs compliance tension

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/compliance-aml-sanctions-boundary.md` | **신규 생성** (~16 sections + Mermaid 10+ diagrams) |
| `log.md` | Stage 32 D11 항목 append (본 항목) |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 38 consecutive stages: 6-32).

### Mermaid 호환성 정책 유지

D1a-D10 의 fix 결과 직접 반영.

### 다음 단계 (D11 이후)

- D12 — Operational Maturity / Incident Command (D6 maturity detail + incident response + crisis governance + DR exercise)
- D13 — Cross-border Settlement / FX / Liquidity Routing

### Uncertainty boundary 유지

- 10 compliance sub-plane / 6 freeze type / 6 risk source / 5 travel rule fragility / 10 operational fragility / 80% burden 분포 = **generalized compliance architecture pattern (Hypothesis ★)**.
- §3.1 sanctions list + §6.2 travel rule protocol = 시간에 따라 변화 (current industry snapshot).
- §13.2 burden 백분율 = operational reasoning estimate.
- §13.5 추천 = 운영 권장.
- §10 jurisdictional variance = regulatory landscape (변화 빠름).
- 본 문서는 **특정 jurisdiction 법률 자세한 설명 아님** — generalized pattern. Specific compliance 은 legal counsel.
- §15 에 org policy 영역 명시 (~20 영역).

### Spine 상태

- Curated Wiki entity / hub: unchanged (38 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: **12 files** (D1a + D2 + D3 + D4 + D5 + D1b + D7 + D8 + D6 + D9 + D10 + D11)
- Retrieval Q7 metrics: unchanged

### Architecture reasoning layer 누적 (D1a-D10 + D11)

**12 문서 = generalized + chain specialization + monetary specialization + compliance specialization**.

| 문서 | 핵심 명제 |
|---|---|
| D1a | 9-plane DB |
| D2 | 4 state machine 분리 |
| D3 | 11-state governance SM |
| D4 | Recovery = governance ceremony |
| D5 | Custody = evidence system |
| D1b | Reconciliation = cross-truth-domain consistency proof |
| D7 | Deposit = controlled ledger recognition |
| D8 | Withdrawal = multi-domain state transition |
| D6 | Custody architecture = sovereignty vs operational burden |
| D9 | Multi-chain = semantic normalization |
| D10 | Stablecoin = synchronized multi-domain monetary state management |
| **D11** | **Compliance = policy-constrained state transition governance across financial, legal, settlement domains** |

→ D11 = D3 governance + D5 evidence + D7/D8 lifecycle + D9 multi-chain + D10 monetary 의 compliance dimension. Custody architecture 의 legal / regulatory application.

---

## Stage 32 D12-D14 Sequential — Operational Maturity / Cross-border / Security (2026-05-19)

### 신규 파일 (3개, sequential 생성)

- `docs/architecture/operational-maturity-incident-command.md` (D12)
- `docs/architecture/cross-border-settlement-fx-liquidity.md` (D13)
- `docs/architecture/security-threat-model-adversarial-resilience.md` (D14)

### D12 — Operational Maturity / Incident Command

**Core thesis**: "Operational survivability in institutional custody is not engineering reliability. It is human-coordinated incident command under uncertainty, time pressure, and irreversible consequences."

핵심 invariants:
- 5-dimension maturity (Technical / Operational / Governance / Compliance / Incident response) × 4-level scale (Ad-hoc → Defined → Practiced → Optimized)
- 10 incident category × 4 tier severity
- ICS (Incident Command System): single IC + role clarity (Operations / Liaison / Planning / Logistics / Scribe)
- Crisis governance ≠ accelerated normal governance (다른 authority + SLA + audit + mandatory post-hoc review)
- 5-level DR exercise (Tabletop → Walk-through → Simulated → Chaos)
- Postmortem 5-step (Timeline → Root cause → Action item → Tracking → Pattern detection)
- Blameless postmortem principle

10 "≠" 명제:
- Engineering uptime ≠ Operational survivability
- Runbook exists ≠ Runbook works under stress
- Postmortem written ≠ Learning happened
- On-call rotation ≠ 24/7 capability
- Incident closed ≠ Incident resolved
- Recovery exercised ≠ Recovery proven
- Documented procedure ≠ Practiced procedure
- Tool exists ≠ Operator can use under stress
- Team size adequate ≠ Coverage adequate
- Crisis governance ≠ Normal governance accelerated

3-way burden: SaaS ~50% / Hosted ~75% / Direct-build ~100% (operational maturity 는 model 무관 customer 책임 큼).

### D13 — Cross-border Settlement / FX / Liquidity Routing

**Core thesis**: "Cross-border crypto settlement is not currency conversion. It is multi-jurisdiction monetary state coordination across asymmetric banking, regulatory, and liquidity domains."

핵심 invariants:
- 5 cross-border layer (Currency / Jurisdiction / Banking / Liquidity / Compliance)
- Cross-border lifecycle 10-phase (Request → Screening → FX quote → Liquidity routing → Settlement leg 1 → FX execution → Settlement leg 2 → Reconciliation → Reporting → Evidence)
- 4 FX risk (Quote / Execution / Settlement / Translation)
- 7 liquidity venue (CEX / DEX / OTC / Market maker / Bridge / AMM aggregator / Internal)
- Correspondent banking 5 issue (Latency / Cost / De-risking / Settlement risk / Visibility)
- 8 settlement venue 비교 (SWIFT / Fedwire / RTP / ACH / SEPA / Stablecoin / CBDC / Cash)

10 "≠" 명제:
- Crypto transfer ≠ Cross-border settlement
- FX hedged ≠ FX exposure eliminated
- Same currency ≠ Same settlement venue
- Stablecoin == USD ≠ Sovereign US asset
- Liquidity exists ≠ Routable liquidity
- Faster chain ≠ Faster settlement
- Banking corridor exists ≠ Corridor available
- Multi-currency support ≠ FX risk managed
- Cross-border execution ≠ Cross-border settlement final
- On-chain finality ≠ Off-ramp finality

3-way burden: SaaS ~85% / Hosted ~95% / Direct-build ~100% (D11 compliance 와 함께 vendor 흡수 가장 적은 영역 — banking + FX + jurisdictional 모두 customer).

### D14 — Security / Threat Model / Adversarial Resilience

**Core thesis**: "Custody security is not access control. It is adversarial state-of-mind embedded in every architectural decision."

핵심 invariants:
- 7 threat actor taxonomy (Opportunistic / Targeted external / **Insider** / Nation-state / Supply chain / Social engineering / Adversarial collaboration)
- 10-layer defense in depth (Physical / Network / Host / Application / Cryptographic / IAM / Authorization / Monitoring / Response / Recovery)
- Zero-trust principle (6 component)
- 5 insider type + insider threat = irreducible
- 7 supply chain layer (SW deps / Build tooling / Container / Hardware / Vendor SaaS / Crypto library / Custody framework)
- 9 social engineering vector (incl. deepfake emerging)
- Cryptographic agility mandatory (algorithm break / quantum / implementation / side-channel)
- 7 side-channel type
- Red / Blue / Purple team
- Security incident 의 unique aspects (active adversary, forensic critical, containment dilemma)

10 "≠" 명제:
- Encryption ≠ Security
- Audit pass ≠ Secure
- No incident ≠ Not breached
- Access control ≠ Authorization
- Multi-factor ≠ Strong authentication
- Defense layers ≠ Defense in depth
- Best practice ≠ Threat-informed practice
- Compliance ≠ Security
- Pentested ≠ Hardened
- Security tool deployed ≠ Threat mitigated

3-way burden: SaaS ~50% / Hosted ~75% / Direct-build ~100%. Security 는 cross-cutting concern — D1a (secrets DB 저장 금지) / D3 (quorum) / D4 (custodian distribution) / D5 (immutability) 모두가 security.

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/operational-maturity-incident-command.md` | **신규 생성** (D12, ~14 sections + Mermaid 10+ diagrams) |
| `docs/architecture/cross-border-settlement-fx-liquidity.md` | **신규 생성** (D13, ~13 sections + Mermaid 10+ diagrams) |
| `docs/architecture/security-threat-model-adversarial-resilience.md` | **신규 생성** (D14, ~15 sections + Mermaid 10+ diagrams) |
| `log.md` | Stage 32 D12-D14 통합 항목 append (본 항목) |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 41 consecutive stages: 6-32).

### Mermaid 호환성 정책 유지

D1a-D11 의 fix 결과 직접 반영:
- `graph TB` 만 사용
- 모든 node label `"..."` quote
- classDef trailing semicolon 제거

### Architecture reasoning layer 완성 (D1a-D14)

**15 문서 (D1a + D1b + D2 + D3 + D4 + D5 + D6 + D7 + D8 + D9 + D10 + D11 + D12 + D13 + D14) = generalized + 4 specialization (chain / monetary / compliance / security) + 2 operational (incident / cross-border) 의 완성된 custody architecture reasoning corpus**.

| 문서 | 핵심 명제 |
|---|---|
| D1a | 9-plane DB |
| D2 | 4 state machine 분리 |
| D3 | 11-state governance SM |
| D4 | Recovery = governance ceremony |
| D5 | Custody = evidence system |
| D1b | Reconciliation = cross-truth-domain consistency proof |
| D7 | Deposit = controlled ledger recognition |
| D8 | Withdrawal = multi-domain state transition |
| D6 | Custody architecture = sovereignty vs operational burden |
| D9 | Multi-chain = semantic normalization |
| D10 | Stablecoin = synchronized multi-domain monetary state management |
| D11 | Compliance = policy-constrained governance across financial / legal / settlement domains |
| **D12** | **Operational survivability = human-coordinated incident command under uncertainty** |
| **D13** | **Cross-border = multi-jurisdiction monetary state coordination** |
| **D14** | **Security = adversarial state-of-mind embedded in every architectural decision** |

### Corpus 구조

```
Generalized skeleton (D1a-D8 + D6):
  D1a Schema / D2 Signing / D3 Governance / D4 Recovery / D5 Evidence /
  D1b Reconciliation / D7 Deposit / D8 Withdrawal / D6 Decision Framework

Specialized domains (D9-D14):
  D9  Chain semantic
  D10 Monetary (stablecoin)
  D11 Compliance (legal / regulatory)
  D12 Operational (incident / crisis)
  D13 Cross-border (FX / liquidity / banking)
  D14 Security (adversarial, cross-cutting)
```

### Burden 누적 (★ Hypothesis — 각 specialization 별 customer burden in SaaS)

| Domain | SaaS customer burden |
|---|---|
| Generalized custody (D6) | ~25-45% |
| Signing (D2) | ~15% |
| Governance (D3) | ~25% |
| Recovery (D4) | ~50% |
| Evidence (D5) | ~40% |
| Reconciliation (D1b) | ~45% |
| Deposit (D7) | ~25% |
| Withdrawal (D8) | ~35% |
| Multi-chain (D9) | ~30% |
| Treasury (D10) | ~60% |
| **Compliance (D11)** | **~80%** |
| **Operational (D12)** | **~50%** |
| **Cross-border (D13)** | **~85%** |
| **Security (D14)** | **~50%** |

→ **Compliance + Cross-border** = customer burden 가장 큼 (vendor 가 흡수 못함).
→ **Signing + Multi-chain** = vendor 흡수 가장 큼 (technical infrastructure).

### Uncertainty boundary 유지

- 모든 D-series 의 sub-plane / classification / lifecycle / burden 백분율 = **generalized architecture pattern (Hypothesis ★)**.
- 본 corpus 는 **특정 vendor / specific implementation 설명 아님** — generalized custody architecture skeleton.
- 각 문서의 §13-15 open questions / org policy 영역 = customer 의사결정.
- 모든 "≠" 명제 = reasoning baseline, 정답 아님.

### Spine 상태

- Curated Wiki entity / hub: unchanged (41 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: **15 files** (D1a + D1b + D2 + D3 + D4 + D5 + D6 + D7 + D8 + D9 + D10 + D11 + D12 + D13 + D14)
- Retrieval Q7 metrics: unchanged

### 다음 단계 (D14 이후)

D-series **corpus 완성**. 가능한 다음 단계:

- **D15+ specialization** — emerging domain (DeFi composability / RWA tokenization / CBDC / Privacy-preserving custody)
- **D-impl phase** — implementation-side detail (SQL DDL / API design / specific scheme selection / specific chain adapter)
- **D-review phase** — corpus 내부 cross-consistency review + gap analysis
- **Retrieval / question bank refresh** — 본 corpus 기반 Q1-Q? 생성 + retrieval eval

Architecture reasoning skeleton 자체는 D14 로 closing — D1a-D14 의 15 문서가 generalized custody architecture 의 reasoning foundation.

---

## Stage 32 D15-D16-D24 — Trust / Transparency / Identity Cluster Sequential (2026-05-19)

### Cluster thesis

> **Trust is an operationally reconstructed property across evidence, identity, compliance, and settlement domains.**

또는:

> Institutional trust in digital asset systems is not produced by centralized statements alone. It emerges from continuously verifiable evidence, attributable identity relationships, and survivable governance coordination.

### 신규 파일 3개 (sequential, cluster inheritance)

- `docs/architecture/transparency-attestation-proof-systems.md` (D15)
- `docs/architecture/identity-kyt-counterparty-graph.md` (D16)
- `docs/architecture/regulatory-reporting-audit-interface.md` (D24, cluster closing)

### D15 — Transparency / Attestation / Proof Systems

**Core thesis**: "Transparency is not disclosure. It is externally verifiable consistency evidence across financial, operational, and settlement domains."

핵심 invariants:
- 8-layer transparency architecture (Disclosure / Attestation / Proof / Snapshot / Continuous monitor / Verifier tooling / Methodology / Public evidence chain)
- Trust trinity: Cryptographic primitive × Open methodology × Accessible tooling
- PoR/PoL semantics + ZK-PoL emerging
- Snapshot vs continuous truth (window dressing risk)
- Verifier capability ≠ Verifier intent

5 "≠":
- Transparency ≠ Disclosure
- Proof-of-reserve ≠ Solvency proof
- Snapshot truth ≠ Continuous truth
- Public visibility ≠ Verifiability
- Evidence publication ≠ Trust elimination

3-way burden: SaaS ~80% / Hosted ~90% / Direct-build ~100%.

D16 bridge invariants: public verifiability boundary / identity ambiguity / attribution limitation / counterparty trust dependency / proof visibility gap.

### D16 — Identity / KYT / Counterparty Graph

**Core thesis**: "Blockchain addresses are settlement identifiers, not institutional identities. Institutional trust requires probabilistic cross-domain attribution."

**Secondary thesis**: "Identity in digital asset systems is reconstructed, inferred, and continuously revised — not statically owned."

핵심 invariants:
- 3-layer identity model (Settlement L1 / Operational L2 / Beneficial L3)
- 7 attribution evidence types with confidence weights
- Counterparty graph: directed multi-hop trust network
- Probabilistic identity = Bayesian update + confidence threshold
- Cross-chain identity attribution challenge (entity continuity ≠ chain linkage)
- KYT graph poisoning risk
- Multi-vendor KYT for corroboration

5 "≠":
- Address ≠ Identity
- KYT cluster ≠ Beneficial ownership
- Monitoring visibility ≠ Attribution certainty
- Cross-chain linkage ≠ Entity continuity
- Graph confidence ≠ Legal proof

3-way burden: SaaS ~75% / Hosted ~85% / Direct-build ~100%.

D24 bridge invariants: regulator evidence dependency / attribution confidence boundary / reporting ambiguity / institutional disclosure requirement / regulatory evidence reconstruction.

### D24 — Regulatory Reporting / Audit Interface (Cluster Closing)

**Core thesis**: "Regulatory reporting is not document generation. It is externally consumable reconstruction of institutional evidence state."

**Secondary thesis**: "Auditability is the ability to reconstruct institutional truth under external scrutiny."

핵심 invariants:
- 9-phase reporting lifecycle
- Reconstruction ≠ Re-creation
- 5-question audit reconstruction (D5 §6.3 의 regulator 적용)
- Translation layer (technical → regulatory)
- Materiality threshold + restatement risk
- Audit window 5-dimension (Temporal / Entity / Functional / Jurisdictional / Materiality)
- Algorithmic explainability emerging requirement
- "Reporting also evidence-producing" (self-application)

5 "≠":
- Report generation ≠ Auditability
- Evidence availability ≠ Regulator understanding
- Disclosure completeness ≠ Truth completeness
- Audit readiness ≠ Operational readiness
- Compliance reporting ≠ Regulatory safety

3-way burden: SaaS ~95% / Hosted ~98% / Direct-build ~100% — **모든 architecture 중 customer 책임 가장 큰 영역**.

### Cluster Closing Summary

3-document cluster integration:

```
D15 Transparency (verifiability layer)
  ↓
D16 Identity (attribution layer)
  ↓
D24 Reporting (reconstruction layer)
  ↓
Externally reconstructable institutional trust
```

**15 "≠" cluster-wide propositions**:
- D15: Transparency / PoR / Snapshot / Visibility / Publication
- D16: Address / KYT cluster / Monitoring visibility / Cross-chain linkage / Graph confidence
- D24: Generation / Availability / Disclosure / Audit readiness / Compliance reporting

**Customer burden 누적 in SaaS**:
- D15 ~80%
- D16 ~75%
- **D24 ~95%** (highest)
- → Trust cluster 가 customer 책임 가장 큰 영역. Vendor 본질적 흡수 못함.

**Public trust vs Institutional truth separation**:
- Public trust = emerging from verifiable evidence + tooling + community (D15 focus)
- Institutional truth = internal evidence + reconstruction + regulator-facing (D24 focus)
- Bridge = identity attribution (D16) enables both

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/transparency-attestation-proof-systems.md` | **신규 생성** (D15, ~14 sections + Mermaid 10+ diagrams) |
| `docs/architecture/identity-kyt-counterparty-graph.md` | **신규 생성** (D16, ~14 sections + Mermaid 10+ diagrams) |
| `docs/architecture/regulatory-reporting-audit-interface.md` | **신규 생성** (D24, ~15 sections + Mermaid 10+ diagrams + cluster closing) |
| `log.md` | Stage 32 D15-D16-D24 Trust cluster 통합 항목 append |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 44 consecutive stages: 6-32).

### Mermaid 호환성 정책 유지

D1a-D14 의 fix 결과 직접 반영 (graph TB / quoted labels / no trailing semicolon).

### Architecture reasoning layer 누적 (18 documents)

**Generalized skeleton (D1a-D8 + D6)**:
- D1a / D1b / D2 / D3 / D4 / D5 / D6 / D7 / D8

**Specialized domains (D9-D14)**:
- D9 (chain) / D10 (monetary) / D11 (compliance) / D12 (operational) / D13 (cross-border) / D14 (security)

**Trust cluster (D15-D16-D24)** (NEW):
- D15 (transparency) / D16 (identity) / D24 (reporting)

→ 18 documents = generalized + 6 specialized + 3 trust cluster.

### Trust Cluster 의 core insight

| Cluster contribution | 내용 |
|---|---|
| **Trust ≠ Centralized statement** | Trust = verifiable evidence + attributable identity + reconstructable reporting |
| **Verifiability + Identity + Reconstruction = institutional trust foundation** | 3 layer 모두 필요 |
| **Identity uncertainty 가 trust ceiling** | Perfect transparency 도 identity ambiguity 면 incomplete |
| **External reconstruction 이 audit 의 본질** | Document generation 이 아닌 historical state replay |
| **Algorithmic decisions 의 explainability** | Emerging requirement, regulator-facing 의 새 challenge |

### Uncertainty boundary 유지

- 모든 cluster documents 의 sub-plane / classification / lifecycle / burden 백분율 = **generalized trust architecture pattern (Hypothesis ★)**.
- ZK-PoL (D15) / continuous attestation (D15) / algorithmic explainability (D24) = emerging research / regulatory landscape.
- §11.2 burden 백분율 = operational reasoning estimate.
- 각 문서 의 §13 / §15 에 org policy 영역 명시.

### Spine 상태

- Curated Wiki entity / hub: unchanged (44 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: **18 files**
- Retrieval Q7 metrics: unchanged

### Next Cluster Recommendation

**Monetary / Liquidity Cluster** (D17-D20):
- D17 Treasury Optimization / Capital Efficiency
- D18 Clearing / Prime Brokerage / Omnibus
- D19 Internal Netting / Internal Settlement
- D20 Cross-institution Liquidity Coordination

→ Theme: institutional liquidity operating system

Boundary inherited:
- Trust boundary (D15-D16-D24)
- Evidence boundary (D5)
- Identity boundary (D16)
- Settlement boundary (D1b, D8, D13)
- Regulatory boundary (D11, D24)

### Architecture reasoning corpus 정의

| 문서 | 핵심 명제 (short) |
|---|---|
| D1a | 9-plane DB / secrets DB 저장 금지 |
| D2 | 4 state machine 분리 / MPC retry non-idempotent |
| D3 | 11-state governance SM / two-clock freshness |
| D4 | Recovery = governance ceremony |
| D5 | Custody = evidence system |
| D1b | Reconciliation = cross-truth-domain consistency proof |
| D7 | Deposit = controlled ledger recognition |
| D8 | Withdrawal = multi-domain state transition |
| D6 | Custody architecture = sovereignty vs operational burden |
| D9 | Multi-chain = semantic normalization |
| D10 | Stablecoin = synchronized multi-domain monetary state management |
| D11 | Compliance = policy-constrained governance across financial/legal/settlement |
| D12 | Operational survivability = human-coordinated incident command |
| D13 | Cross-border = multi-jurisdiction monetary state coordination |
| D14 | Security = adversarial state-of-mind embedded in every architectural decision |
| **D15** | **Transparency = externally verifiable consistency evidence** |
| **D16** | **Identity = reconstructed, inferred, continuously revised** |
| **D24** | **Reporting = externally consumable reconstruction of institutional evidence state** |

→ 18 문서 = generalized custody (9) + chain/monetary/compliance/operational/cross-border/security specialization (6) + trust cluster (3) 의 완성된 architecture reasoning corpus.

---

## Stage 32 D17-D18-D19-D20 — Monetary / Liquidity Cluster Sequential (2026-05-20)

### Cluster thesis

> **Institutional liquidity systems are continuously coordinated monetary state synchronization systems across treasury, settlement, credit, governance, and risk domains.**

또는:

> **Liquidity is not stored money. It is operationally routable settlement capacity under governance and risk constraints.**

### 신규 파일 4개 (sequential, cluster inheritance)

- `docs/architecture/treasury-optimization-capital-efficiency.md` (D17)
- `docs/architecture/clearing-prime-brokerage-omnibus.md` (D18)
- `docs/architecture/internal-netting-settlement.md` (D19)
- `docs/architecture/cross-institution-liquidity-coordination.md` (D20, cluster closing)

### D17 — Treasury Optimization / Capital Efficiency

**Core thesis**: "Treasury optimization is not balance maximization. It is survivable liquidity allocation under settlement, redemption, and operational uncertainty."

핵심 invariants:
- 8 treasury tier (Hot/Warm/Cold/External venue/Banking/Tokenized/Bridge-locked/Reserved)
- Time-bucketed deployable liquidity (L_now / L_1h / L_1d / L_1w)
- 7 fragmentation source (multi-chain/venue/jurisdiction/asset/tier/currency/counterparty)
- 4-stage stress response (Normal→Elevated→High→Crisis)
- 5 survivability metric

5 "≠": Capital efficiency ≠ Liquidity safety / Idle reserve ≠ Inefficient / Yield ≠ Optimization / Available ≠ Deployable / Visibility ≠ Mobility

3-way burden: SaaS ~70% / Hosted ~85% / Direct-build ~100%.

D18 bridge: omnibus liquidity semantics / pooled reserve coordination / settlement batching / internalized settlement need / treasury routing complexity.

### D18 — Clearing / Prime Brokerage / Omnibus Semantics

**Core thesis**: "Omnibus settlement is not pooled custody. It is delegated settlement abstraction under layered ownership and exposure boundaries."

**Secondary thesis**: "Prime brokerage is not asset storage. It is coordinated exposure and settlement delegation."

핵심 invariants:
- 3-layer omnibus ownership (Custody/Beneficial/Operational)
- Segregated vs omnibus 비교
- Clearing 7-phase lifecycle
- Internalized settlement = book entry only (zero on-chain cost, but operator trust)
- Prime broker 4-role combination (Counterparty/Creditor/Custodian/Settlement agent)
- Rehypothecation 의 capital efficiency vs visibility loss

5 "≠": Omnibus balance ≠ Economic ownership / Custody visibility ≠ Settlement authority / Internal settlement ≠ Economic finality / Clearing efficiency ≠ Risk reduction / Prime broker ≠ Neutral intermediary

3-way burden: SaaS ~80% / Hosted ~90% / Direct-build ~100%.

D19 bridge: internal settlement dependency / exposure compression logic / netting opportunity / bilateral settlement redundancy / liquidity reuse boundary.

### D19 — Internal Netting / Internal Settlement

**Core thesis**: "Internal netting is not accounting simplification. It is liquidity compression through deferred external settlement dependency."

핵심 invariants:
- 3 netting type (Bilateral/Multilateral/Multilateral with novation CCP)
- Quadratic efficiency improvement via multilateral
- Liquidity multiplier effect (compression × demand smoothing)
- 5 settlement cycle (Real-time / Hourly / EOD / EOW / Continuous)
- Close-out netting 의 legal mechanism
- 9-phase internal settlement lifecycle
- 4-layer visibility (Gross/Bilateral/Multilateral)
- Contagion propagation 의 network topology effect

5 "≠": Net exposure ≠ Eliminated exposure / Internal settlement ≠ Final settlement / Deferred ≠ Reduced risk / Liquidity reuse ≠ Creation / Efficiency ≠ Crisis survivability

3-way burden: SaaS ~85% / Hosted ~95% / Direct-build ~100%.

D20 bridge: inter-institution liquidity dependency / coordinated treasury movement / shared settlement timing / systemic liquidity coupling / federation-like behavior.

### D20 — Cross-institution Liquidity Coordination (Cluster Closing)

**Core thesis**: "Institutional liquidity coordination is not asset interoperability. It is synchronized survivability management across independently governed monetary systems."

**Secondary thesis**: "Cross-institution settlement systems behave like loosely coupled monetary federations under stress."

핵심 invariants:
- 3 cross-institution settlement model (Bilateral/Multilateral via CCP/Hybrid)
- 3-tier coordination (Bilateral agreement/Multilateral protocol/Shared infrastructure)
- 5 routing decision factor + multi-route redundancy
- Federation-like treasury behavior:
  - Liquidity hoarding (individual rational, collective irrational)
  - Synchronized freeze risk
  - Mutual support agreement
- PvP / DvP synchronization
- 3 coupling intensity (Low/Medium/High) with systemic risk trade-off
- 6 defensive behavior (Hoarding/Tightening/Freeze/Deleveraging/Closing/Margin call)
- Trust failure cascade (Direct exposure / Perceived similarity / Information cascade / Liquidity withdrawal / Asset price impact)
- Tragedy of the commons (game-theoretic)

5 "≠": Interoperability ≠ Coordination / Shared liquidity ≠ Shared governance / Settlement routing ≠ Settlement certainty / Liquidity federation ≠ Systemic safety / Cross-institution visibility ≠ Cross-institution control

3-way burden: SaaS ~100% / Hosted ~100% / Direct-build ~100% (cross-institution coordination 은 model 무관 100% customer — vendor 가 own institutional boundary 밖).

### Cluster Closing Summary

4-document cluster integration:

```
D17 Treasury optimization (own treasury)
  ↓
D18 Omnibus / clearing (within institution, multi-customer)
  ↓
D19 Internal netting (within institution, multi-party)
  ↓
D20 Cross-institution (across institutions)
  ↓
Institutional liquidity operating system
```

**20 "≠" cluster-wide propositions**: D17 (5) + D18 (5) + D19 (5) + D20 (5).

**Customer burden 누적 in SaaS**:
- D17 ~70%
- D18 ~80%
- D19 ~85%
- **D20 ~100%** (highest in entire corpus)

→ Liquidity cluster 의 burden 이 cross-institution 으로 갈수록 vendor 흡수 불가능 (own institutional boundary 밖).

**Liquidity as routable settlement capacity**:
- D17: own routing
- D18: customer-level abstraction
- D19: settlement minimization
- D20: cross-institution routing
- → Routing 의 multi-scale architecture.

**Monetary federation systemic property**:
- Federation = independent governance + emergent collective behavior
- Individual rationality 의 collective irrationality (tragedy of commons)
- 새 layer 의 efficiency 가 새 layer 의 systemic risk 와 trade-off

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/treasury-optimization-capital-efficiency.md` | **신규 생성** (D17, ~13 sections + Mermaid 10+ diagrams) |
| `docs/architecture/clearing-prime-brokerage-omnibus.md` | **신규 생성** (D18, ~14 sections + Mermaid 10+ diagrams) |
| `docs/architecture/internal-netting-settlement.md` | **신규 생성** (D19, ~15 sections + Mermaid 10+ diagrams) |
| `docs/architecture/cross-institution-liquidity-coordination.md` | **신규 생성** (D20, ~15 sections + Mermaid 10+ diagrams + cluster closing) |
| `log.md` | Stage 32 D17-D20 Liquidity cluster 통합 항목 append |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 48 consecutive stages: 6-32).

### Mermaid 호환성 정책 유지

D1a-D16+D24 의 fix 결과 직접 반영.

### Architecture reasoning corpus 누적 (22 documents)

| Cluster | Documents |
|---|---|
| Generalized skeleton | D1a, D1b, D2, D3, D4, D5, D6, D7, D8 |
| Single specialization | D9 (chain), D10 (monetary base), D11 (compliance), D12 (operational), D13 (cross-border), D14 (security) |
| Trust cluster | D15 (transparency), D16 (identity), D24 (reporting) |
| **Liquidity cluster** | **D17 (treasury), D18 (omnibus), D19 (netting), D20 (cross-institution)** |

### Architecture reasoning corpus 의 핵심 명제 누적

| # | Doc | Core thesis (compressed) |
|---|---|---|
| 1 | D1a | 9-plane DB / secrets DB 저장 금지 |
| 2 | D2 | 4 state machine 분리 / MPC retry non-idempotent |
| 3 | D3 | 11-state governance SM / two-clock freshness |
| 4 | D4 | Recovery = governance ceremony under cryptographic risk |
| 5 | D5 | Custody = evidence system / Unified Evidence Spine |
| 6 | D1b | Reconciliation = cross-truth-domain consistency proof |
| 7 | D7 | Deposit = controlled ledger recognition |
| 8 | D8 | Withdrawal = multi-domain state transition |
| 9 | D6 | Custody architecture = sovereignty vs operational burden |
| 10 | D9 | Multi-chain = semantic normalization |
| 11 | D10 | Stablecoin = synchronized multi-domain monetary state management |
| 12 | D11 | Compliance = policy-constrained governance across financial/legal/settlement |
| 13 | D12 | Operational survivability = human-coordinated incident command |
| 14 | D13 | Cross-border = multi-jurisdiction monetary state coordination |
| 15 | D14 | Security = adversarial state-of-mind embedded in every architectural decision |
| 16 | D15 | Transparency = externally verifiable consistency evidence |
| 17 | D16 | Identity = reconstructed, inferred, continuously revised |
| 18 | D24 | Reporting = externally consumable reconstruction of institutional evidence state |
| 19 | **D17** | **Treasury optimization = survivable liquidity allocation under uncertainty** |
| 20 | **D18** | **Omnibus = delegated settlement abstraction under layered ownership** |
| 21 | **D19** | **Internal netting = liquidity compression through deferred external settlement dependency** |
| 22 | **D20** | **Cross-institution liquidity = synchronized survivability management across independently governed monetary systems** |

### Uncertainty boundary 유지

- 모든 cluster documents 의 sub-plane / classification / lifecycle / burden 백분율 = **generalized monetary architecture pattern (Hypothesis ★)**.
- §1.4 multiplier effect / §6.2 coupling / §7.5 tragedy of commons = game-theoretic + financial industry pattern.
- §12.2 burden 백분율 = operational reasoning estimate.
- 각 문서 §13 / §15 에 org policy 영역 명시.

### Spine 상태

- Curated Wiki entity / hub: unchanged (48 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: **22 files**
- Retrieval Q7 metrics: unchanged

### Next Cluster Recommendation

**Crisis / Survivability Cluster** (D21-D26):
- D21 Stablecoin Depeg / Crisis Handling
- D22 Consensus Failure / Chain Halt
- D23 Jurisdiction Split / Regulatory Attack
- D25 Systemic Liquidity Freeze
- D26 Custody Failure Generalization

→ Theme: catastrophic failure architecture

Boundary inherited:
- Liquidity boundary (D17-D20)
- Settlement boundary (D1b, D8, D13, D19, D20)
- Treasury boundary (D10, D17)
- Evidence boundary (D5, D15)
- Trust boundary (D15-D16-D24)
- Survivability boundary (D6, D12)
- Security boundary (D14)

→ D-series corpus 가 22 documents 로 성장; crisis cluster 시 generalized custody architecture 의 catastrophic failure dimension 완성.

---

## Stage 32 D21-D26 — Crisis / Survivability Cluster Sequential (2026-05-20)

### Cluster thesis

> **Institutional custody systems are not ultimately tested during steady-state operation. They are tested when trust, liquidity, settlement, governance, and coordination fail simultaneously.**

또는:

> **Survivability is the residual institutional capability that remains after core assumptions collapse.**

### 신규 파일 5개 (sequential, cluster inheritance; D24 는 Trust cluster 에 이미 존재)

- `docs/architecture/stablecoin-depeg-crisis-handling.md` (D21)
- `docs/architecture/consensus-failure-chain-halt.md` (D22)
- `docs/architecture/jurisdiction-split-regulatory-attack.md` (D23)
- `docs/architecture/systemic-liquidity-freeze.md` (D25)
- `docs/architecture/custody-failure-generalization.md` (D26, cluster closing)

### D21 — Stablecoin Depeg / Crisis Handling

**Core thesis**: "Stablecoin depeg events are synchronized trust, liquidity, redemption, and coordination crises across monetary domains."

핵심: 6 depeg type / 4-phase crisis lifecycle / Reflexive depeg dynamics / Confidence contagion (inter-stablecoin/cross-domain/reputational) / Redemption asymmetry / Survivability ceiling.

5 "≠": Peg deviation ≠ Insolvency / Redemption pressure ≠ Immediate failure / Reserve equality ≠ Market confidence / Treasury freeze ≠ Settlement stop / Market recovery ≠ Trust recovery.

3-way burden: SaaS ~95% / Hosted ~98% / Direct-build ~100%.

### D22 — Consensus Failure / Chain Halt

**Core thesis**: "Blockchain consensus failures are settlement truth fragmentation events."

핵심: 5 consensus failure type (Halt / Finality regression / Deep reorg / Validator collusion / Software fork) / 3-layer settlement truth (Cryptographic / Consensus / Social) / 4-phase chain halt lifecycle / Hard fork chain selection dilemma / Replay attack risk.

5 "≠": Chain halt ≠ Settlement halt / Finality ambiguity ≠ Double-spend certainty / Canonical ≠ Permanent / Reorg recovery ≠ State certainty / Technical ≠ Institutional recovery.

3-way burden: SaaS ~85% / Hosted ~95% / Direct-build ~100%.

### D23 — Jurisdiction Split / Regulatory Attack

**Core thesis**: "Regulatory fragmentation is institutional governance partitioning across legal sovereignty domains."

핵심: 5 jurisdictional conflict type / 4-tier sovereignty hierarchy / 5 regulatory attack vector / Split-brain governance / Sovereignty partition dynamics / 7-phase regulatory escalation / Legal vs operational recovery timescale asymmetry.

5 "≠": Compliance divergence ≠ Institutional illegality / Regulatory freeze ≠ Asset confiscation / Jurisdiction visibility ≠ Jurisdiction control / Cross-border operation ≠ Unified governance / Legal recovery ≠ Operational recovery.

3-way burden: SaaS ~100% / Hosted ~100% / Direct-build ~100% (jurisdictional crisis = customer's own legal entity matter).

### D25 — Systemic Liquidity Freeze

**Core thesis**: "Systemic liquidity crises emerge when institutions lose confidence in coordinated settlement continuity. Liquidity freezes are coordination failures masquerading as balance shortages."

핵심: 3-phase freeze propagation (Initial trigger / Defensive cascade / Systemic stuck) / Hoarding game theory / Refusal cascade / Trust collapse cascading layers / Treasury hoarding network / Routing collapse 5-stage / Hidden circular dependency deadlock / Central bank backstop role.

5 "≠": Asset ownership ≠ Settlement liquidity / Treasury visibility ≠ Usability / Coordinated freeze ≠ Insolvency / Liquidity support ≠ Confidence restoration / Emergency routing ≠ Settlement continuity.

3-way burden: SaaS ~100% / Hosted ~100% / Direct-build ~100% (systemic crisis는 model 무관).

### D26 — Custody Failure Generalization (Cluster Closing)

**Core thesis**: "Institutional custody failures are cascading coordination failures across governance, liquidity, settlement, evidence, and trust domains. Every architecture contains latent failure topologies, visible only under stress."

핵심: 6 failure domain (Governance/Liquidity/Settlement/Evidence/Trust/Identity) / Cascading coordination failures / Hidden coupling topology / 5-layer survivability (Asset/Operational/Institutional/Reputational/Regulatory) / Residual institutional capability / Operational entropy / 6 failure pattern + pattern-specific response / 7-phase reconstruction.

5 "≠": Technical failure ≠ Institutional failure / System recovery ≠ Trust recovery / Surviving assets ≠ Surviving institution / Evidence preservation ≠ Reputation preservation / Partial continuity ≠ Survivability.

3-way burden: SaaS ~95-100% / Hosted ~98-100% / Direct-build ~100%.

### Cluster Closing Summary

5-document cluster integration:

```
D21 Trust collapse (stablecoin depeg)
  ↓
D22 Settlement truth fragmentation (chain halt)
  ↓
D23 Governance fragmentation (jurisdictional split)
  ↓
D25 Systemic liquidity freeze (coordination collapse)
  ↓
D26 Generalized failure taxonomy ← cluster closing
  ↓
Catastrophic institutional failure architecture
```

**25 "≠" cluster-wide propositions** (5 per document).

**Customer burden in crisis** ~95-100% across all models — vendor 의 own institutional boundary 의 fundamental limit, crisis 는 model 무관.

**6 failure domains** (D26 synthesis):
1. Governance (D3, D23)
2. Liquidity (D17, D25)
3. Settlement (D1b, D22)
4. Evidence (D5, D15)
5. Trust (D21, D24)
6. Identity (D16)

**Latent failure topology recognition**:
- Pre-crisis: invisible
- Crisis-time: catastrophic
- Discipline: continuous stress test + tabletop + red team + DR exercise

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/stablecoin-depeg-crisis-handling.md` | **신규 생성** (D21) |
| `docs/architecture/consensus-failure-chain-halt.md` | **신규 생성** (D22) |
| `docs/architecture/jurisdiction-split-regulatory-attack.md` | **신규 생성** (D23) |
| `docs/architecture/systemic-liquidity-freeze.md` | **신규 생성** (D25) |
| `docs/architecture/custody-failure-generalization.md` | **신규 생성** (D26, cluster closing) |
| `log.md` | Stage 32 D21-D26 Crisis cluster 통합 항목 append |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 53 consecutive stages: 6-32).

### Mermaid 호환성 정책 유지

D1a-D20 의 fix 결과 직접 반영.

### Architecture reasoning corpus 누적 (27 documents)

| Cluster | Documents | Theme |
|---|---|---|
| Generalized skeleton | D1a, D1b, D2, D3, D4, D5, D6, D7, D8 | what custody is |
| Single specialization | D9, D10, D11, D12, D13, D14 | how custody runs |
| Trust cluster | D15, D16, D24 | how custody is verifiable |
| Liquidity cluster | D17, D18, D19, D20 | how custody scales monetary |
| **Crisis cluster** | **D21, D22, D23, D25, D26** | **how custody fails and survives** |

### Cluster integration thesis

| Cluster | Final statement |
|---|---|
| Foundation | Custody = evidence-producing settlement governance system |
| Infrastructure | Custody operates across chain/monetary/compliance/operational/cross-border/security domains |
| Trust | Trust = operationally reconstructed property across evidence, identity, reporting |
| Liquidity | Liquidity = operationally routable settlement capacity under governance + risk |
| **Crisis** | **Survivability = residual institutional capability after core assumption collapse** |

### Uncertainty boundary 유지

- 모든 cluster documents 의 sub-plane / classification / lifecycle / burden 백분율 = **generalized crisis architecture pattern (Hypothesis ★)**.
- §1.4 / §5.4 historical examples + behavioral finance + game theory = reasoning baseline.
- §11.2 burden 백분율 = estimate.
- 각 문서 §13 / §14 에 org policy 영역 명시.

### Spine 상태

- Curated Wiki entity / hub: unchanged (53 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: **27 files**
- Retrieval Q7 metrics: unchanged

### Post-cluster Optional Domains

다음 optional deep-dive 후보:

- CBDC / Sovereign Digital Money
- Intent-based Settlement / Solver Networks
- Autonomous Treasury Governance
- AI-assisted Operational Governance
- Cross-chain Shared Sequencer Systems
- Tokenized Real-world Asset Infrastructure
- Institutional Privacy / Confidential Settlement
- Post-quantum Custody Survivability

→ Foundation + Infrastructure + Trust + Liquidity + Crisis 의 5 cluster 가 generalized custody architecture reasoning corpus 의 core. Post-cluster 는 emerging / specialized domain 의 deep-dive.

---

## Stage 32 D27-D32 — Frontier / Emerging Institutional Systems Cluster Sequential (2026-05-20)

### Runner thesis

> **Post-custody institutional systems are not merely extensions of current financial infrastructure. They are attempts to redesign coordination, settlement, governance, and survivability primitives for programmable monetary systems.**

또는:

> **The next generation of institutional systems emerges where custody, liquidity, governance, computation, and sovereignty converge.**

### 신규 파일 6개 (sequential, cluster inheritance, frontier)

- `docs/architecture/cbdc-sovereign-digital-money.md` (D27)
- `docs/architecture/intent-based-settlement-solver-networks.md` (D28)
- `docs/architecture/autonomous-treasury-governance.md` (D29)
- `docs/architecture/ai-assisted-operational-governance.md` (D30)
- `docs/architecture/institutional-privacy-confidential-settlement.md` (D31)
- `docs/architecture/post-quantum-custody-survivability.md` (D32, cluster + corpus closing)

### D27 — CBDC / Sovereign Digital Money

**Core thesis**: "CBDCs are programmable sovereign monetary coordination systems."

핵심: 2 CBDC type (Wholesale/Retail) / 4 settlement model / 5-level programmability spectrum / Sovereign control mechanisms / Cross-CBDC interoperability.

5 "≠": Digital fiat ≠ CBDC / Programmable money ≠ Monetary efficiency / Sovereign control ≠ Institutional survivability / State visibility ≠ Economic certainty / CBDC interoperability ≠ Monetary unification.

### D28 — Intent-based Settlement / Solver Networks

**Core thesis**: "Intent-based systems are delegated coordination markets for settlement execution."

핵심: Intent vs Transaction / 4 auction mechanism / Solver trust 6 dimension / MEV management / Front-running protection (private mempool / batch auction) / Solver whitelist.

5 "≠": Intent ≠ Guaranteed settlement / Solver optimization ≠ User sovereignty / Delegated execution ≠ Delegated risk / Routing efficiency ≠ Settlement certainty / Intent abstraction ≠ Coordination elimination.

### D29 — Autonomous Treasury Governance

**Core thesis**: "Autonomous treasury systems are programmable governance systems operating under uncertainty + survivability constraints."

핵심: 4-level autonomy spectrum / Policy validation / Treasury agent anatomy / 5-level override hierarchy / Multi-agent coordination / Hybrid survivability.

5 "≠": Automation ≠ Governance elimination / Autonomous execution ≠ Autonomous accountability / Treasury optimization ≠ Safety / Policy automation ≠ Correctness / Machine governance ≠ Institutional survivability.

### D30 — AI-assisted Operational Governance

**Core thesis**: "AI-assisted governance is probabilistic operational coordination under uncertainty + evidence incompleteness + institutional accountability."

핵심: 5-level AI involvement / 8 AI limitations (hallucination, bias, OOD, etc.) / Operational copilot use cases / Human-AI 5 collaboration model / Accountability hierarchy / 10 frontier risks.

5 "≠": Recommendation ≠ Authority / Prediction ≠ Institutional truth / AI visibility ≠ AI understanding / Operational assistance ≠ Governance delegation / Explainability ≠ Accountability.

### D31 — Institutional Privacy / Confidential Settlement

**Core thesis**: "Institutional privacy systems are selective visibility coordination systems balancing confidentiality / auditability / survivability."

핵심: 5 visibility tier (Public/Customer/Counterparty/Regulator/Auditor) / 3 technical approach (ZK/MPC/TEE) / 6 selective disclosure mechanism / Audit-preserving confidentiality / Lawful intercept design / Confidential evidence chain.

5 "≠": Privacy ≠ Opacity / Confidentiality ≠ Non-auditability / Hidden state ≠ Hidden liability / Selective disclosure ≠ Trust elimination / Encrypted settlement ≠ Survivable settlement.

### D32 — Post-quantum Custody Survivability (Cluster + Corpus Closing)

**Core thesis**: "Post-quantum survivability is institutional continuity under foundational trust primitive disruption."

핵심: Quantum threat model (Shor/Grover) / NIST PQC families / Hybrid signature transition / 7-phase migration / 7-component crypto-agility / Historical signature challenge / Multi-decade institutional continuity / Recovery system PQ considerations.

5 "≠": Algorithm upgrade ≠ Survivability / PQ migration ≠ Institutional readiness / Cryptographic strength ≠ Operational continuity / Signature validity ≠ Historical trust continuity / Quantum resistance ≠ Governance survivability.

### Cluster Closing Summary

6-document cluster integration:

```
D27 Sovereign monetary redesign (CBDC)
D28 Coordination market delegation (intent)
D29 Programmable governance (autonomous treasury)
D30 AI-assisted operations
D31 Selective visibility privacy
D32 Quantum-survivable cryptographic trust
↓
Future institutional operating systems under conservative survivability discipline
```

**30 "≠" cluster-wide propositions** (5 per document).

**Frontier 의 common pattern**:
- Emerging maturity (early-stage)
- Trust evolution (primitive redesign)
- Coordination challenge (multi-party)
- Cautious adoption (gradual + reversible)
- Skill / talent (specialized expertise)
- Regulatory uncertainty (evolving)

**Frontier 의 critical principle**:
- Conservative institutional approach
- Human accountability retention
- Survivability > efficiency
- Evidence > convenience
- Uncertainty acknowledgment
- **Hype 회피, fundamentals 유지**

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/cbdc-sovereign-digital-money.md` | **신규 생성** (D27) |
| `docs/architecture/intent-based-settlement-solver-networks.md` | **신규 생성** (D28) |
| `docs/architecture/autonomous-treasury-governance.md` | **신규 생성** (D29) |
| `docs/architecture/ai-assisted-operational-governance.md` | **신규 생성** (D30) |
| `docs/architecture/institutional-privacy-confidential-settlement.md` | **신규 생성** (D31) |
| `docs/architecture/post-quantum-custody-survivability.md` | **신규 생성** (D32, cluster + corpus closing) |
| `log.md` | Stage 32 D27-D32 Frontier cluster 통합 항목 append |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 59 consecutive stages: 6-32).

### Mermaid 호환성 정책 유지

D1a-D26 의 fix 결과 직접 반영.

### Architecture reasoning corpus 최종 완성 (33 documents)

```
D-series corpus 최종 구성:

Foundation     [D1a, D1b, D2, D3, D4, D5, D6, D7, D8]       9 docs  (what custody is)
Specialization [D9, D10, D11, D12, D13, D14]                6 docs  (how custody runs)
Trust          [D15, D16, D24]                              3 docs  (how custody is verifiable)
Liquidity      [D17, D18, D19, D20]                         4 docs  (how custody scales monetary)
Crisis         [D21, D22, D23, D25, D26]                    5 docs  (how custody fails and survives)
Frontier       [D27, D28, D29, D30, D31, D32]               6 docs  (how custody evolves into future)
─────────────────────────────────────────────────────────────────────────────────
Total                                                      33 docs
```

### Architecture reasoning corpus 최종 thesis (6 clusters)

| Cluster | Final statement |
|---|---|
| Foundation | Custody = evidence-producing settlement governance system |
| Specialization | Custody runs across chain/monetary/compliance/operational/cross-border/security domains |
| Trust | Trust = operationally reconstructed property across evidence/identity/reporting |
| Liquidity | Liquidity = operationally routable settlement capacity under governance + risk |
| Crisis | Survivability = residual institutional capability after core assumption collapse |
| **Frontier** | **Future institutional systems converge custody+liquidity+governance+computation+sovereignty under conservative survivability discipline** |

### Common invariants across all 33 documents

- Evidence-first reasoning
- Append-only invariant
- Trust-boundary separation
- Cross-domain consistency
- Human operational irreducibility
- Sovereignty / governance separation
- Uncertainty boundary
- Survivability > efficiency

### Common anti-patterns avoided across all 33 documents

- Single-vendor / single-system reliance
- Technical optimization over institutional discipline
- Hype framing (crypto-utopian / AI-hype / trustless / decentralization marketing)
- Static vs dynamic perspective
- Steady-state over failure-state focus

### Uncertainty boundary 유지

- 본 cluster 는 **emerging + speculative** — frontier domains 의 active evolution.
- 모든 reasoning = generalized pattern (Hypothesis ★).
- PQ timeline / AI capability / CBDC adoption / quantum threat 등 의 active uncertainty.
- 각 문서 의 §13 / §14 에 frontier policy 영역 명시.

### Spine 상태

- Curated Wiki entity / hub: unchanged (59 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: **33 files** (D-series corpus 완성)
- Retrieval Q7 metrics: unchanged

### D-series corpus 완성

**33 documents = comprehensive generalized custody architecture corpus**.

| Discipline | 결과 |
|---|---|
| Entity-min discipline | 59 consecutive stages, 0 new entities |
| Curated Wiki untouched | 그대로 유지 |
| Hypothesis marking | 모든 generalized reasoning |
| Mermaid 호환성 | `graph TB` + quoted labels + no trailing semicolon |
| Cross-cluster consistency | inheritance via reference + bridge |
| Anti-pattern avoidance | hype-free, fundamentals-focused |

### Post-corpus optional domains (still open)

- Autonomous Market Structure
- Machine-to-machine Treasury
- Synthetic Sovereign Liquidity
- Global Shared Settlement Layer
- Autonomous Regulatory Coordination
- Civilization-scale Financial Survivability
- Interplanetary Settlement Theory (extreme speculative)

→ 33 documents = core corpus. Further extension 은 optional + speculative.

---

## Stage 32 C1-C6 — Corpus Consolidation / Meta-Architecture Refinement (2026-05-20)

### Runner thesis

> **A large architecture corpus is not complete when documents exist. It becomes complete when invariants, boundaries, dependencies, and reading paths become reconstructable.**

또는:

> **The final stage of institutional architecture work is not expansion. It is consolidation, compression, indexing, and survivable knowledge reconstruction.**

### 신규 파일 6개 (consolidation, meta-architecture)

- `docs/architecture/c1-master-corpus-index.md` (C1)
- `docs/architecture/c2-invariant-catalog.md` (C2)
- `docs/architecture/c3-dependency-graph.md` (C3)
- `docs/architecture/c4-anti-pattern-catalog.md` (C4)
- `docs/architecture/c5-audience-reading-paths.md` (C5)
- `docs/architecture/c6-open-questions-frontier-boundary.md` (C6, C-series + corpus closing)

### C1 — Master Corpus Index

**Core thesis**: "A corpus index is not a document list. It is a navigable map of conceptual dependencies and reasoning progression."

핵심: 33 docs 의 6-cluster topology / Reading order vs reasoning order 분리 / Cluster maturity gradient (production vs emerging) / Cross-cluster bridge points / Thematic grouping alternative / Hub documents 식별 (D5, D6) / Standalone documents 식별 (D1a, D27, D31).

### C2 — Invariant Catalog

**Core thesis**: "The real structure of the corpus is not its documents. It is the invariant system repeated across domains."

핵심: 7 top-level architectural laws (Evidence>State / Survivability>Efficiency / Append-only / Trust boundaries / Human accountability / Cross-domain consistency / Structural uncertainty) / 8 cross-domain "≠" families (150+ ≠ propositions catalog) / 14+ trust boundary catalog (B1-B14) / 10 survivability principles / Temporal semantics (multi-clock invariant) / Operational burden patterns.

### C3 — Cross-reference / Dependency Graph

**Core thesis**: "The architecture corpus behaves like a dependency graph, not a linear book."

핵심: 3-tier dependency (Strong/Medium/Weak) / Foundation 의 broadcast role / Crisis 의 inheritance / Frontier 의 separability / Bridge invariant chain (예: append-only 의 propagation across 10 docs) / Hidden coupling 5-type / Reasoning propagation pattern / Cyclic dependency (rare) / Sparse graph density ~20%.

### C4 — Anti-pattern / Failure Pattern Catalog

**Core thesis**: "The anti-patterns reveal the real conceptual boundaries of the corpus."

핵심: D6 top 10 anti-patterns (MPC/Self-hosted/SaaS/Air-gap/Direct-build/Append-only/Recovery/Reconciliation/Multi-sig/More-control) / 8 illusion families (governance/decentralization/transparency/solvency/automation/privacy/efficiency/vendor) / Recurring misconception catalog / Hidden simplification 5 category / Crisis-time anti-patterns / Frontier hype-cycle anti-patterns / Vendor lock-in anti-patterns / Best practice limits.

### C5 — Executive / Audience Reading Paths

**Core thesis**: "Different institutional audiences reconstruct different subsets of truth from the same corpus."

핵심: 8 audience profiles (Executive/Engineer/Governance/Treasury/Regulator-facing/Crisis-response/Sovereign-CBDC/Frontier-research) / Audience-specific path 각각 / 4-level progressive learning ladder (Quick overview 2-4h → Functional 1d → Comprehensive 3d → Mastery 5-7d) / Operational role × document matrix / Universal docs (D5, D6, D26) / Onboarding path structure.

### C6 — Open Questions / Frontier Boundary (C-series + Corpus Closing)

**Core thesis**: "A mature architecture corpus preserves uncertainty explicitly instead of pretending completeness."

핵심: 6 uncertainty domain catalog / Cross-cluster unresolved questions / Out-of-scope explicit declaration / Frontier boundary 의 evolution / Future research agenda / Civilization-scale horizon (acknowledgment) / Unknown unknowns 의 explicit acknowledgment / Living document discipline / Corpus self-limitations / **Final corpus spirit** (Evidence-first / Survivability-first / Operational realism / Cross-domain consistency / Human accountability / Conservative institutional discipline).

### Cluster Closing Summary

6-document consolidation integration:

```
C1 Master Index (navigation map)
C2 Invariant Catalog (top-level laws)
C3 Dependency Graph (topology)
C4 Anti-pattern Catalog (boundary)
C5 Audience Reading Paths (audience guide)
C6 Open Questions (uncertainty + closing)
↓
Meta-architecture consolidation layer
```

### Corpus Final State

**33 D-documents + 6 C-documents = 39 documents**:
- D-series: generalized custody architecture reasoning (production-grade + frontier emerging)
- C-series: corpus consolidation + meta-architecture (navigation + invariant + dependency + anti-pattern + audience + uncertainty)

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/c1-master-corpus-index.md` | **신규 생성** |
| `docs/architecture/c2-invariant-catalog.md` | **신규 생성** |
| `docs/architecture/c3-dependency-graph.md` | **신규 생성** |
| `docs/architecture/c4-anti-pattern-catalog.md` | **신규 생성** |
| `docs/architecture/c5-audience-reading-paths.md` | **신규 생성** |
| `docs/architecture/c6-open-questions-frontier-boundary.md` | **신규 생성** (C-series + corpus closing) |
| `log.md` | Stage 32 C-series 통합 항목 append |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 65 consecutive stages: 6-32).

### Mermaid 호환성 정책 유지

D-series fix 결과 직접 반영.

### Corpus 의 최종 spirit

> The architecture corpus is a navigable map of evidence-first survivability reasoning for institutional custody systems — preserved as a network of conceptual dependencies, recurring invariants, anti-pattern warnings, audience-aware pathways, and explicit uncertainty boundaries — under conservative institutional discipline that retains human accountability, acknowledges deep uncertainty, and refuses hype.

### Discipline 의 final

- No hype
- No vendor dependence
- No ideology-first framing
- No "final truth" claim
- No reduction of uncertainty

### Spine 상태

- Curated Wiki entity / hub: unchanged (65 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: **39 files** (33 D + 6 C)
- Retrieval Q7 metrics: unchanged

### Corpus 최종 완성

```
Architecture corpus 최종 구성:

D-series (Reasoning corpus):
  Foundation cluster      D1a, D1b, D2-D8, D6                 9 docs
  Specialization cluster  D9-D14                              6 docs
  Trust cluster           D15, D16, D24                       3 docs
  Liquidity cluster       D17-D20                             4 docs
  Crisis cluster          D21-D23, D25, D26                   5 docs
  Frontier cluster        D27-D32                             6 docs
  ─────────────────────────────────────────────────────────────────
  D-series subtotal                                           33 docs

C-series (Consolidation corpus):
  C1 Master Index
  C2 Invariant Catalog
  C3 Dependency Graph
  C4 Anti-pattern Catalog
  C5 Audience Reading Paths
  C6 Open Questions / Frontier Boundary
  ─────────────────────────────────────────────────────────────────
  C-series subtotal                                            6 docs

  ═════════════════════════════════════════════════════════════════
  Total corpus                                                39 docs
  ═════════════════════════════════════════════════════════════════
```

### Stage 32 final completion

- Started: 2026-05-19 (Fireblocks deepening close, D series start)
- Completed: 2026-05-20 (corpus consolidation closing)
- 39 architecture documents generated
- 65 consecutive stages with entity-min discipline
- Zero modifications to Curated Wiki entity/hub spine
- Zero new Source Lake material
- All reasoning generalized + hypothesis-marked + uncertainty-bounded

### Corpus 의 ongoing nature

본 corpus 의 closing 은 **publication state, not completion**. Living document 의 continuation:
- Frontier maturation → cluster reorganization
- New incident → D26 + cluster update
- New regulation → D11, D24 update
- New chain / protocol → D9 extension
- AI capability advance → D30 update
- PQ standard finalization → D32 update

→ Reader 의 institutional application + critique + industry engagement = corpus 의 evolution.

---

## Stage 32 E1-E5 — Post-corpus Evolution / Living Theory Maintenance (2026-05-20)

### Runner thesis

> **A mature institutional architecture corpus is not static knowledge. It is a continuously stress-tested reasoning system evolving through new incidents, technologies, regulations, and operational realities.**

또는:

> **The final form of institutional architecture work is not completion. It is disciplined evolution under uncertainty.**

### 신규 파일 5개 (E-series, post-corpus living theory)

- `docs/architecture/e1-incident-driven-corpus-evolution.md` (E1)
- `docs/architecture/e2-regulatory-sovereign-evolution.md` (E2)
- `docs/architecture/e3-ai-automation-evolution-pressure.md` (E3)
- `docs/architecture/e4-frontier-integration-discipline.md` (E4)
- `docs/architecture/e5-corpus-longevity-knowledge-survivability.md` (E5, E-series + corpus final closing)

### E1 — Incident-driven Corpus Evolution

**Core thesis**: "Institutional architecture theories evolve primarily through failure exposure, not through steady-state optimization."

핵심: 4-tier corpus impact (Local/Document/Cluster/Corpus) / Incident integration 9-phase lifecycle / Invariant stress test 3-outcome (Confirmation/Refinement/Contradiction) / Hidden coupling discovery / Anti-pattern lifecycle / Survivability re-evaluation / Update governance discipline / Conservative tier choice principle.

5 "≠": Incident ≠ Invariant invalidation / Failure ≠ Theory collapse / New exploit ≠ Architectural obsolescence / Patch ≠ Survivability improvement / Operational surprise ≠ Theoretical failure.

### E2 — Regulatory / Sovereign Evolution

**Core thesis**: "Institutional architecture evolves not only through technology, but through sovereign and regulatory reinterpretation of legitimacy."

핵심: 4 evolution source (Reactive/Strategic/Geopolitical/Doctrinal) / 9-phase regulatory mutation lifecycle / Sovereign reinterpretation of legitimacy / Jurisdictional evolution patterns / Multi-year legal recovery timescale / Industry-regulator dialogue / Sovereign vs market tension / Industry consolidation under regulation.

5 "≠": Regulation update ≠ Architectural replacement / Legal clarity ≠ Operational certainty / Sovereign coordination ≠ Governance convergence / Compliance adaptation ≠ Institutional survivability / Regulatory alignment ≠ Strategic safety.

### E3 — AI / Automation Evolution Pressure

**Core thesis**: "AI pressure transforms institutional systems not by replacing humans, but by continuously reshaping coordination, accountability, and operational expectations."

핵심: 5 evolutionary pressure (Speed/Cost/Capability/Explainability/Accountability) / AI capability evolution trajectory / Operational expectation drift / Accountability persistence (no transfer to AI) / Probabilistic institutional reasoning / 10 AI-specific institutional risks / Coordination 의 AI-mediated evolution / Conservative discipline > hype.

5 "≠": AI augmentation ≠ Governance automation / Model capability ≠ Institutional trustworthiness / Automation pressure ≠ Operational maturity / Probabilistic recommendation ≠ Operational truth / AI explainability ≠ Accountability preservation.

### E4 — Frontier Integration Discipline

**Core thesis**: "Emerging financial primitives should not automatically enter institutional architecture. They must survive conservative survivability scrutiny first."

핵심: 10-criteria frontier evaluation framework / 5-stage institutionalization ladder (Research → Experimentation → Pilot → Limited production → Mature) / Hype filter discipline / Speculative domain isolation / Survivability filter / Trust boundary preservation under frontier / Frontier containment discipline / Patience > Speed principle.

5 "≠": Innovation ≠ Institutional viability / Frontier adoption ≠ Survivability gain / Decentralization ≠ Governance reduction / Novel primitive ≠ New invariant / Experimental success ≠ Institutional readiness.

### E5 — Corpus Longevity / Knowledge Survivability (E-series + Corpus Final Closing)

**Core thesis**: "The survivability of institutional knowledge is itself an architectural problem."

**Secondary thesis**: "A theory corpus survives only if its reasoning remains reconstructable across organizational, technological, and generational change."

핵심: Multi-decade horizon definition / 5-layer knowledge survivability (Documentation/Archive/Reconstructability/Transfer/Living understanding) / Reasoning preservation > document preservation / Institutional memory multi-layer / Generational transfer / Corpus portability (linguistic/technical/organizational/industry/cultural/temporal) / Living document discipline / Corpus 의 own meta-architecture (self-application) / Long-term evolution governance / Honest limits acknowledgment / **Final corpus spirit declaration**.

5 "≠": Documentation ≠ Knowledge survivability / Archive ≠ Reconstructability / Stored corpus ≠ Operational continuity / Knowledge transfer ≠ Institutional understanding / Corpus stability ≠ Corpus survivability.

### E-series Cluster Closing Summary

5-document evolution integration:

```
E1 Incident-driven evolution
E2 Regulatory / sovereign evolution
E3 AI / automation pressure
E4 Frontier integration discipline
E5 Knowledge survivability ← E-series + corpus final closing
↓
Living theory maintenance layer
```

**25 "≠" cluster-wide propositions** (5 per document).

### Architecture Corpus 최종 완성 (44 documents)

```
Architecture corpus 최종 구성:

D-series (Reasoning corpus):
  Foundation     D1a, D1b, D2-D8, D6        9 docs
  Specialization D9-D14                     6 docs
  Trust          D15, D16, D24              3 docs
  Liquidity      D17-D20                    4 docs
  Crisis         D21-D23, D25, D26          5 docs
  Frontier       D27-D32                    6 docs
                                          ────────
  D-series subtotal                        33 docs

C-series (Consolidation corpus):
  C1-C6                                     6 docs
                                          ────────
  C-series subtotal                         6 docs

E-series (Evolution / maintenance corpus):
  E1-E5                                     5 docs
                                          ────────
  E-series subtotal                         5 docs

  ═════════════════════════════════════════════════
  Total                                    44 docs
  ═════════════════════════════════════════════════
```

### Corpus 의 3-layer architecture

| Layer | Documents | Purpose |
|---|---|---|
| **D-series (reasoning)** | 33 docs | what + why (content) |
| **C-series (consolidation)** | 6 docs | navigation + meta-architecture |
| **E-series (evolution)** | 5 docs | maintenance + survivability |

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/e1-incident-driven-corpus-evolution.md` | **신규 생성** |
| `docs/architecture/e2-regulatory-sovereign-evolution.md` | **신규 생성** |
| `docs/architecture/e3-ai-automation-evolution-pressure.md` | **신규 생성** |
| `docs/architecture/e4-frontier-integration-discipline.md` | **신규 생성** |
| `docs/architecture/e5-corpus-longevity-knowledge-survivability.md` | **신규 생성** (E-series + corpus final closing) |
| `log.md` | Stage 32 E-series 통합 항목 append |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 70 consecutive stages: 6-32).

### Corpus 의 final definition

> The architecture corpus is a multi-layer living reasoning system — comprising 33 D-documents of generalized institutional custody reasoning, 6 C-documents of consolidation/meta-architecture navigation, and 5 E-documents of evolution/maintenance discipline — designed for multi-decade institutional knowledge survivability under conservative discipline that retains human accountability, acknowledges deep uncertainty, refuses hype, and welcomes ongoing critique + extension.

### Final discipline declaration

- **No final theory claim**
- **No inevitability framing**
- **No automation utopianism**
- **No ideology-first reasoning**
- **No survivability compromise for elegance**
- **No vendor recapture**
- **No hype**

### Final corpus spirit (10 commitments)

1. Evidence-first reasoning
2. Survivability-first
3. Operational realism
4. Cross-domain consistency
5. Human accountability
6. Explicit uncertainty
7. Conservative institutional discipline
8. Living document (not static text)
9. Multi-generational ambition
10. Honest limits

### Spine 상태

- Curated Wiki entity / hub: unchanged (70 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: **44 files** (33 D + 6 C + 5 E)
- Retrieval Q7 metrics: unchanged

### Stage 32 final final stats

- Started: 2026-05-19 (Fireblocks deepening close)
- Completed: 2026-05-20 (corpus 3-layer final closing)
- **44 architecture documents generated**:
  - 33 D-series (reasoning corpus)
  - 6 C-series (consolidation corpus)
  - 5 E-series (evolution corpus)
- **70 consecutive stages** with entity-min discipline
- **Zero modifications** to Curated Wiki entity/hub spine
- **Zero new** Source Lake material
- All reasoning generalized + hypothesis-marked + uncertainty-bounded

### Corpus 의 ongoing nature (final)

본 corpus 의 closing 은 **publication state, not completion**. Living document 의 continuation:

- E1 incident-driven update
- E2 regulatory adaptation
- E3 AI pressure response
- E4 frontier integration (gradual)
- E5 knowledge survivability (multi-decade)

→ Reader 의 institutional application + critique + industry engagement + multi-generational stewardship = corpus 의 evolution.

### Corpus 의 multi-decade ambition

- 1-5y: operational use (current relevance)
- 5-15y: strategic + maturation
- 15-50y: institutional continuity (E5 §1.1)
- Beyond: explicit out-of-scope

본 corpus 는 honest ambition + honest limits 의 declaration 으로 publication state 에 도달.


---

## Stage 33 — R-series Reasoning Operations Layer (Retrieval / Reasoning Discipline)

**Date:** 2026-05-20
**Trigger:** Post-publication transition — corpus operationalization, not content expansion.
**Mode:** Architecture Reasoning Mode, sequential runner pattern.
**Core thesis:** More documents ≠ better reasoning. Corpus scale introduces retrieval noise, ontology drift, contradiction risk, stale assumptions, reasoning fragmentation. R-series operationalizes the corpus as a governed institutional reasoning system rather than a static publication artifact.

### Stage 33 의 motivation

The D/C/E corpus reached **publication state** at Stage 32 (44 docs across 3 layers). Stage 33 addresses what was structurally missing: the layer that governs **how the corpus is used, retrieved, reasoned over, contested, evolved, and preserved** across multi-decade institutional horizons.

The problem is no longer document generation. The problem is **disciplined reasoning continuity under scale, ambiguity, and evolving institutional reality**.

### R-series 신규 11 docs

| Doc | Title | Core concern |
|---|---|---|
| R0 | Reasoning Operations Charter | R-series proposal + folder topology + corpus lifecycle + 10 operational invariants |
| R1 | Retrieval Discipline Architecture | 6-stage retrieval pipeline; over-retrieve, re-rank, cite, surface negatives loudly |
| R2 | Corpus Reasoning Flow | 7-stage reasoning discipline; 6-section output template; escalation triggers |
| R3 | Contradiction Management Discipline | T1-T5 contradiction classification; preservation > resolution |
| R4 | Ontology Stability Discipline | Layer-1-to-5 ontology; sense management; conservative refactor policy |
| R5 | Evolution Governance Model | C0-C8 change classification; cycle-based cadence; rotating stewardship; audit trail |
| R6 | Knowledge Decay / Staleness Taxonomy | Class A-E decay rates; refresh cadence per class; sunset process |
| R7 | Historical Worldview Preservation | 4-layer preservation; no silent rewrite; no retroactive correction |
| R8 | Human Review Boundary / Escalation Criteria | Zone A / B / C operations; escalation signals; reviewer accountability |
| R9 | AI-assisted Reasoning Constraints | Forbidden actions; required disclaimers; trace requirement; calibration |
| R10 | Failure Modes of Long-lived Architecture Corpora | 12 corpus-level failure modes; compound risks; honest-failure stance |

### Stage 33 corpus expansion

```
  ═════════════════════════════════════════════════
  Architecture Corpus — Stage 33 state
  ═════════════════════════════════════════════════
  D-series (domain reasoning)              33 docs
  C-series (consolidation)                  6 docs
  E-series (evolution)                      5 docs
  R-series (reasoning operations)          11 docs
                                          ────────
  Total                                    55 docs
  ═════════════════════════════════════════════════
```

### Corpus 의 4-layer architecture (Stage 33+)

| Layer | Documents | Purpose |
|---|---|---|
| **D-series (domain)** | 33 docs | what + why (architectural content) |
| **C-series (consolidation)** | 6 docs | meta-structure (navigation + invariants + dependencies + anti-patterns + paths + open questions) |
| **E-series (evolution)** | 5 docs | how the corpus evolves (incident / regulatory / AI / frontier / longevity pressures) |
| **R-series (reasoning operations)** | 11 docs | how the corpus is operated (retrieval / reasoning / contradiction / ontology / governance / decay / history / human boundary / AI constraints / failure modes) |

**Position relationship:** D produces content; C produces meta-structure of content; E produces evolution thesis for content; **R produces operational discipline for D/C/E themselves**.

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/r0-reasoning-operations-charter.md` | **신규 생성** |
| `docs/architecture/r1-retrieval-discipline-architecture.md` | **신규 생성** |
| `docs/architecture/r2-corpus-reasoning-flow.md` | **신규 생성** |
| `docs/architecture/r3-contradiction-management-discipline.md` | **신규 생성** |
| `docs/architecture/r4-ontology-stability-discipline.md` | **신규 생성** |
| `docs/architecture/r5-evolution-governance-model.md` | **신규 생성** |
| `docs/architecture/r6-knowledge-decay-staleness-taxonomy.md` | **신규 생성** |
| `docs/architecture/r7-historical-worldview-preservation.md` | **신규 생성** |
| `docs/architecture/r8-human-review-boundary-escalation-criteria.md` | **신규 생성** |
| `docs/architecture/r9-ai-assisted-reasoning-constraints.md` | **신규 생성** |
| `docs/architecture/r10-failure-modes-long-lived-corpora.md` | **신규 생성** |
| `docs/architecture/c1-master-corpus-index.md` | **Stage 33 amendment** (§13 추가, §0-§12 worldview preserved per R7) |
| `log.md` | Stage 33 R-series 통합 항목 append |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 71 consecutive stages: 6-33).

### R0 charter 의 10 operational invariants

1. Conservative retrieval (top-k 절대 authoritative 금지)
2. Hypothesis preservation (★ markers 영구 보존)
3. Contradiction preservation (apparent + real contradictions catalogued, not smoothed)
4. Ontology stability (core terms 강제 versioned)
5. Worldview preservation (every assertion as-of dated; historical worldviews retrievable)
6. Human accountability (charter / ontology / contradiction T3 / sunset Class A = human-only)
7. AI bounded reasoning (retrieve / summarize / draft / detect — never decide / rewrite / close)
8. Survivability priority (survivability > elegance; continuity > novelty)
9. No closure-by-claim ("corpus complete" 자체가 failure mode)
10. No vendor recapture (single vendor terminology / capability surface / marketing frame 절대 collapse 금지)

### R-series 의 final positioning

> The corpus is not a publication. It is an institution.
> Publication is what makes it readable. Operations are what make it survive.

R-series converts "we wrote 44 documents" into "we run a multi-decade institutional reasoning system." The conversion is **not automatic** — it must be governed.

### Stage 33 의 disciplined claims (★ Hypothesis 모두)

- R-series cannot prevent corpus failure.
- R-series can make failure **visible**, **slow**, and **recoverable**.
- A corpus that maintains R1-R9 over 20 years will exhibit observable durability.
- A corpus that does not maintains R1-R9 will collapse into one of the 12 R10 failure modes.
- This is the most honest claim Stage 33 can make.

### Spine 상태

- Curated Wiki entity / hub: unchanged (71 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: **55 files** (33 D + 6 C + 5 E + 11 R)
- C1 master index: amended §13 (Stage 33 R-series registration); §0-§12 preserved per R7
- Retrieval Q7 metrics: unchanged

### Stage 33 closing position

본 corpus 는 publication artifact 에서 **governed institutional reasoning system** 으로 전환되었음. R-series 는 그 전환의 discipline declaration.

- **R0**: charter — orientation + 10 invariants
- **R1-R2**: retrieval + reasoning — daily operations
- **R3-R4**: contradiction + ontology — slow-burn risks
- **R5**: governance — who/when/authority
- **R6-R7**: decay + history — multi-year horizon
- **R8-R9**: human boundary + AI constraints — accountability layer
- **R10**: failure modes — honest stance about mortality

### Stage 33 deferrals (intentional)

- Operational artifacts (`_history/`, `_ontology/`, `_contradictions/`, `_stewardship/`) — institutional implementation, not corpus content
- Backfill R7 snapshots for 44 existing D/C/E docs — future stage
- Initial seed registries (ontology / contradiction) — future stage
- Stewardship council formation — institutional decision, not corpus-internal
- AI-assistant configuration governance trail — institutional decision

R-series 는 **discipline specification**; implementation 은 operating stewards 의 일.

### Multi-decade horizon (Stage 33 framing)

- 1-5y: R-series enforcement learning curve; first contradictions registered; first ontology audit
- 5-15y: first stewardship rotation cycle; first major supersessions; first charter review proposal
- 15-50y: cross-generation stewardship; multi-fork ecosystem; institutional continuity test (E5 §1.1)
- Beyond: explicit out-of-scope; corpus has either institutionalized into something larger, forked beyond recognition, or sunset gracefully

### Closing invariant (Stage 33)

> The discipline is not to prevent the corpus from dying.
> The discipline is to make its death **visible**, **slow**, and **recoverable** — and, in the meantime, to make every retrieval, every reasoning act, every contradiction, every ontology choice, every governance decision **honest and inspectable**.
>
> Stage 33 의 R-series 는 이 discipline 의 declaration. 그 이상도 그 이하도 아님.


---

## Stage 34 — T-series Theory Stewardship Layer (Institutional Reasoning Maintenance)

**Date:** 2026-05-20
**Trigger:** Post-R-series transition — operationalizing discipline into practice.
**Mode:** Architecture Reasoning Mode, sequential runner pattern (S1-S5 stages).
**Core thesis:** A mature institutional reasoning system survives not by remaining unchanged, but by evolving slowly, visibly, and reconstructably under disciplined stewardship. Long-lived institutional theories are governed ecosystems of evolving constraints, not frozen collections of truths.

### Stage 34 의 motivation

Stage 33 R-series 가 **discipline specification** (rules) 을 정의했다. Stage 34 T-series 는 **stewardship practice** (rules 가 인간 손에 의해 어떻게 운영되는가) 을 정의한다.

R-series 만으로는 충분하지 않다. Rules 는 practice tradition 없이는 시간이 지나면서 형식화되고 잊혀진다. T-series 는 R-series 를 **living stewards 의 손에 load-bearing** 하게 만드는 layer.

### T-series 신규 6 docs

| Doc | Title | Core concern |
|---|---|---|
| T0 | Theory Stewardship Charter | T-series proposal + 10 stewardship spirit commitments + multi-cadence (weekly/monthly/quarterly/semi-annual/annual/multi-year) |
| T1 | Corpus Drift Detection | 5 drift species (D1-D5); multi-cadence sampling; semantic erosion map; reinterpretation propagation flow |
| T2 | Contradiction Governance | 5-question triage algorithm; steelman conversation; multi-perspective coexistence; unresolved tension as feature |
| T3 | Institutional Memory Survivability | 6 lifecycle stages (Live→Eternal); 6-class memory artifact taxonomy (M1-M6); tacit-to-explicit conversion; succession map; survivability tiers (S1-S5) |
| T4 | Controlled Evolution Framework | 4 evolution categories (EV1-EV4); "not yet" as default response; frontier containment; maturity thresholds |
| T5 | Stewardship Failure Modes | 10 steward-internal failure modes (SF1-SF10); self-recognition discipline; compound failures |

### Stage 34 corpus expansion

```
  ═════════════════════════════════════════════════
  Architecture Corpus — Stage 34 state
  ═════════════════════════════════════════════════
  D-series (domain reasoning)              33 docs
  C-series (consolidation)                  6 docs
  E-series (evolution)                      5 docs
  R-series (reasoning operations)          11 docs
  T-series (theory stewardship)             6 docs
                                          ────────
  Total                                    61 docs
  ═════════════════════════════════════════════════
```

### Corpus 의 5-layer architecture (Stage 34+)

| Layer | Documents | Purpose | Voice |
|---|---|---|---|
| **D-series (domain)** | 33 docs | what + why (architectural content) | Architectural |
| **C-series (consolidation)** | 6 docs | meta-structure | Navigational |
| **E-series (evolution)** | 5 docs | how the corpus evolves | Historical-forward |
| **R-series (reasoning operations)** | 11 docs | how the corpus is operated (rules) | Specification |
| **T-series (theory stewardship)** | 6 docs | how stewards practice operation (manual) | Practitioner |

**R-series vs T-series:** R defines; T executes. R is what is required; T is what compliance looks like in practice.

### 영향 받은 파일

| 파일 | 변경 |
|---|---|
| `docs/architecture/t0-theory-stewardship-charter.md` | **신규 생성** |
| `docs/architecture/t1-corpus-drift-detection.md` | **신규 생성** |
| `docs/architecture/t2-contradiction-governance.md` | **신규 생성** |
| `docs/architecture/t3-institutional-memory-survivability.md` | **신규 생성** |
| `docs/architecture/t4-controlled-evolution-framework.md` | **신규 생성** |
| `docs/architecture/t5-stewardship-failure-modes.md` | **신규 생성** |
| `docs/architecture/c1-master-corpus-index.md` | **Stage 34 amendment** (§14 추가, §0-§13 worldview preserved per R7) |
| `log.md` | Stage 34 T-series 통합 항목 append |

신규 entity / hub / 기존 Curated Wiki 수정 **0건** (entity-min discipline 72 consecutive stages: 6-34).

### T0 의 10 stewardship spirit commitments

1. Visible evolution (every change leaves a trace future steward can read)
2. Recoverable reasoning (new steward 6y from now can reconstruct why invariant exists)
3. Explicit uncertainty (write "we don't know" before "we believe")
4. Human accountability (no anonymized decisions)
5. Conservative adaptation (when in doubt, defer and surface)
6. Survivability over elegance (durable framing over clever framing)
7. Append-only history (never edit published content; supersede or annotate)
8. Anti-hype discipline (refuse buzzwords until E4 institutionalization)
9. Cross-domain consistency (check cluster interactions before cluster-local changes)
10. Contradiction surfacing (name disagreements rather than smooth them)

### Stage 34 의 5 mandatory summary outputs (per stage runner)

각 T-doc 의 §17 (or §16) 에 다음을 포함:

1. **Stewardship reasoning** — practice 의 framing
2. **Failure / survivability implication** — 없을 때 무엇이 무너지는가
3. **Corpus continuity implication** — 시간 축에서의 역할
4. **Institutional memory implication** — 무엇이 memory 로 축적되는가
5. **Drift / entropy implication** — 자연 entropy 방향에 대한 negentropy 역할
6. **Revision governance proposal** — R5 governance 와의 연결

### Stage 34 의 disciplined claims (★ Hypothesis 모두)

- R-series 만으로는 stewardship 이 1-2 rotation 안에 degrade.
- T-series 가 R-series 를 living stewards 의 손에 load-bearing 하게 만든다.
- A corpus 의 multi-decade survivability 는 D/C/E content 의 quality 보다 R/T survival 에 더 의존.
- T-series 는 corpus failure 를 막을 수 없다. T-series 는 stewardship failure 를 visible, slow, recoverable 하게 만든다.
- 가장 솔직한 claim: stewardship 은 fallible practice 이고, T-series 는 그 사실을 받아들이는 layer.

### Spine 상태

- Curated Wiki entity / hub: unchanged (72 stages 누적)
- Source Lake: unchanged
- `docs/architecture/`: **61 files** (33 D + 6 C + 5 E + 11 R + 6 T)
- C1 master index: amended §14 (Stage 34 T-series registration); §0-§13 preserved per R7
- Retrieval Q7 metrics: unchanged

### Stage 34 closing position

본 corpus 는 다음 transitions 완료:

- Stage 1-31: Fireblocks deepening (vendor-specific reasoning)
- Stage 32: Generalized architecture corpus (publication state, 44 docs)
- Stage 33: Governed reasoning system (R-series, 55 docs, discipline declaration)
- Stage 34: Operational institution (T-series, 61 docs, practice manual)

→ Static artifact 에서 → governed system → operational institution 으로의 multi-stage transition 완성.

### Stage 34 의 5-layer 의미

- **D / C / E**: corpus 가 무엇을 말하는가 + 어떻게 구조화되는가 + 왜 evolve 하는가
- **R**: corpus 를 어떻게 운영해야 하는가 (discipline)
- **T**: stewards 가 그 운영을 실제로 어떻게 practice 하는가 (manual)

★ Hypothesis: D/C/E only = publication. + R = discipline declaration. + T = operational institution. Stage 34 가 artifact → institution transition 완성.

### Multi-decade horizon (Stage 34 framing)

- **1-5y**: T-series practice ramp; first quarterly drift reports; first decision journals; first apprenticeship pairings
- **5-15y**: first stewardship rotation cycles; first compound T5 failures observed and addressed; institutional memory artifact accumulation
- **15-50y**: cross-generation stewardship; multi-rotation T3 succession discipline; first major recovery from R10-level corpus failure (if it occurs)
- **Beyond**: explicit out-of-scope; either institutionalized into larger system, forked beyond recognition, or sunset gracefully

### Stewardship spirit (10 commitments) reaffirmed

T0 의 10 commitments + Stage 32 의 corpus 10 commitments + R0 의 10 operational invariants
= corpus 의 multi-layer commitment 구조.

각 layer (corpus / discipline / practice) 가 자신의 commitments 를 갖고, 함께 institutional reasoning system 의 spirit 을 구성.

### Closing invariant (Stage 34)

> Discipline lives in practice, not in specification.
> R-series defines the rules. T-series defines what compliance looks like in human hands.
> A corpus that has both will degrade slowly, visibly, recoverably.
> A corpus that has only one will degrade silently.

본 corpus 의 closing state at Stage 34: **operational institution**, ready for multi-decade stewardship under disciplined practice — with full acknowledgment that the discipline itself can fail in 10 named ways, and that naming those ways honestly is part of the practice.



## Stage 35 (2026-05-21) — Wiki Health Check + llm-wiki Alignment

본 stage 는 [llm-wiki.md](llm-wiki.md) 원칙 대비 현재 wiki 상태를 정량 평가하고 (Plan 3 lint), 누락된 foundation (Plan 1 index.md, Plan 2 CLAUDE.md) 을 보강한다.

### Plan 1 — Root index.md 생성 ✅

- 산출물: [index.md](index.md) (258 lines, 31 KB)
- 11 sub-section (Curated Wiki / Architecture Corpus / Operations Layer / Source Lake / etc.)
- 177 relative links, broken 0 (Plan 2 CLAUDE.md placeholder 해결 후)
- README.md 에 index.md / CLAUDE.md / log.md 진입점 link 추가

### Plan 2 — CLAUDE.md schema entry point ✅

- 산출물: [CLAUDE.md](CLAUDE.md) (150 lines, 9 section)
- 분산된 5 schema source (prompts/ 4 + skill 1) 를 단일 orientation 진입점으로 위임
- 핵심: 3-layer architecture / 3 trigger 분기 / 핵심 discipline / 페이지 작성 규약 / Reference-ready 답변 형식 / 출력 규약
- Broken link 0

### Plan 3 — Lint pass (read-only inventory)

[lint-report.md](lint-report.md) 참조. 48 wiki 페이지 점검:

| Issue | 건수 | Priority |
|---|---|---|
| 6-section 누락 | 11 | high (user-roles 9 + api-user + console-user) |
| Sources 부재 + 본문 주장 | 2 | high (policy-engine.md, tap.md — TODO 가득) |
| 단방향 wikilink | 138 | medium (37 페이지) |
| Status 표기 불일치 | ~41 | high (Plan 4 대상) |
| 중복 entity | 0 | - |
| Stage orphan (wiki→log) | 10 | medium (early stage 1-10 references) |

### 발견된 architectural 관찰

- **user-roles/ 9 페이지** 중 8 개가 Key Concepts / Details 섹션 없음 — 간략 작성. 6-section template 의 의도된 예외인지 미정 → Open Q 후보.
- **policy-engine / tap** vendor hub 2 개가 `_TODO_` 가득 — Sources 부재 + Key Concepts 도 TODO. Stage 1-5 자료 부족분 그대로 잔존. Stage 10 의 about-policies / how-policies-work ingest 결과를 policy entity 에는 반영했으나 vendor hub 는 미갱신.
- **Stage 1-10 references in wiki, missing in log.md** — log.md 가 Stage 11 이후 format 으로 정리됐을 가능성. 데이터 손실 아니라 log format 진화.

### 영향받은 페이지

- 신규: `index.md`, `CLAUDE.md`, `lint-report.md`
- 갱신: `README.md` (3 link 추가)
- 신규 entity: **0** (Stage 6-35 = 29 stage 연속 0 streak 유지)

### Next — Plan 4 (Status 표기 통일)

- Target: open-questions/fireblocks.md 의 71 Q-number 전수
- 현재: `Status: answered` 형식 1/71, `ANSWERED` inline 42/71
- Action: 표준 `Status: open | partial-answered | answered` + `Answer: <wiki link>` 정형화
- 산출물: open-questions/fireblocks.md 갱신 + diff 보고 → 승인 대기


### Plan 4 — Open-Q Status 표기 통일 ✅ (no real work needed)

**결론: lint 의 false positive — 작업할 issue 없음.**

- 초기 lint regex (`Status:\s*([a-z-]+)`, lowercase only) 가 실제 wiki 의 `**Status**: answered (date, Stage X)` bold 형식을 매치 못 함
- 정확한 측정 결과 (재실행 lint):
  - 총 Q entries (Details 섹션): **70**
  - `**Status**:` field 보유: **70 / 70** ✅
  - 분포: open 42 / answered 21 / partial 7
  - Summary 섹션의 `ANSWERED` inline 마커 42 = 중복 참고 표기 (Status field 와 별개 plane)
- 발견된 변형: 일부 Q 는 `**Stage N Answer**` 또는 `**Partial Answer**` field name 사용 (semantically 동일, 형식 통일성 marginal)
- **갱신**: [lint-report.md](lint-report.md) §4 가 corrected regex 로 재생성됨. Summary table 도 갱신.

**Plan 4 lesson**: lint 자동화 시 regex 가 실제 wiki 형식을 cover 하는지 verify 필요. Lint script 자체도 wiki 의 작성 convention 와 함께 evolve.


### Plan 5 — YAML Frontmatter 도입 ✅

**Scope**: vendors/fireblocks/ (16) + entities/fireblocks/ (23) + user-roles/ (9) = **48 files**. open-questions / architecture corpus 는 다른 schema 필요로 별도 stage 권장.

**Spec** (CLAUDE.md §"YAML Frontmatter" 영속):
```yaml
type: vendor-hub | entity | user-role
vendor: fireblocks
status: stable | draft | placeholder
tags: [taxonomy ...]
stage_introduced: <N>
last_updated_stage: <N>
source_count: <N>
related: [entity-slug ...]
```

**자동 적용 logic**:
- `type` = directory 기반 (vendors/ → vendor-hub, entities/ → entity, user-roles/ → user-role)
- `status` = TODO count + Sources content presence 기반 heuristic (draft 7 / stable 41)
- `tags` = filename keyword + 도메인 taxonomy 매핑
- `stage_introduced` / `last_updated_stage` = 본문 "Stage N" 첫/마지막 match
- `source_count` = `## Sources` 섹션 bullet 수
- `related` = `## Related Pages` 의 wikilink 추출

**적용 결과**: 48 / 48 files updated, 0 skipped.

**Status 분포**: stable 41 · draft 7 (`api`, `compliance`, `policy-engine`, `tap` vendor hub 4 + entity 일부 — _TODO_ 가 많거나 Sources 부재).

**활용 가능성**:
- Obsidian Dataview: `LIST FROM #fireblocks WHERE type = "entity" AND "mpc" in tags`
- grep-friendly filter: `grep -l "tags: \[.*mpc" entities/fireblocks/*.md`
- Stage drift detection: `last_updated_stage` 가 오래된 entity 식별

**영향**:
- 신규 파일: 0 (모두 기존 파일 헤더 추가)
- 신규 entity: 0 (Stage 6-35 = 29 stage 연속 0 streak)

---

## Stage 35 closing position

[llm-wiki.md](llm-wiki.md) 원칙 alignment 완료. 본 stage 의 출력 정리:

### 산출물

| Plan | Deliverable | 상태 |
|---|---|---|
| 1 | [index.md](index.md) (258 lines, 31 KB) | ✅ |
| 2 | [CLAUDE.md](CLAUDE.md) (165 lines, schema entry point) | ✅ |
| 3 | [lint-report.md](lint-report.md) (6 lint category, summary table) | ✅ |
| 4 | open-questions Status 표기 일관 확인 (lint false positive) | ✅ |
| 5 | YAML frontmatter 48 files | ✅ |

### llm-wiki.md 준수 점수 (자가 평가)

| 영역 | Before Stage 35 | After Stage 35 |
|---|---|---|
| 3-layer architecture | 95% | 95% (변함 없음) |
| Schema 단일 진입점 | ⚠️ 5 곳 분산 | ✅ CLAUDE.md 통합 |
| index.md (catalog) | ❌ 부재 | ✅ root index.md |
| log.md (chronological) | ✅ | ✅ |
| Ingest workflow | ✅ 95% | ✅ 95% |
| Query (Reference-ready) | ⚠️ 70% | ⚠️ 70% (skill 도입 완료, file-back-as-page 패턴 미도입) |
| Lint cadence | ⚠️ 50% | ✅ Stage 35 정기 lint 패턴 확립 |
| YAML frontmatter (Dataview) | ❌ | ✅ 48 files |
| Search engine (qmd 등) | ❌ | ❌ (도입 보류) |
| **종합** | **~75%** | **~88%** |

### Stage 35 invariant

> Wiki 의 maintenance 비용은 자동화의 함수다.
> Lint script 가 wiki 의 실제 convention 와 함께 evolve 하지 않으면 false positive 가 새로운 oneset 으로 누적된다.
> Plan 4 의 false positive 는 그 경계의 첫 실증.
> Stage 35 의 closing rule: **lint regex 갱신은 wiki 형식 변경과 동일한 stage 안에서**.

### Next stages 후보

- ~~Stage 36: Search engine 도입~~ → Stage 37 로 displace (Stage 36 은 Key Link ingest 로 사용됨)
- Stage 37: Search engine 도입 (qmd 또는 ripgrep + index) **또는** File-back-as-page 패턴 정형화
- Stage 38: 단방향 wikilink 138 → 양방향 정리
- Stage 39: 6-section 누락 11 페이지 보강 (user-roles 9 + api-user / console-user)
- Stage 40+: 외부 vendor 도입 (Privy / Coinbase WaaS / BitGo / Dfns)

---

## Stage 36 (2026-05-22) — Key Link Cluster Mode C Deep Ingest + Reference Mass-Fetch

### Trigger

사용자 직접 요청 (Trigger 1 — 새 source ingest):
1. `https://developers.fireblocks.com/reference/data-objects` 확인 후 reference cluster 전체 mass-fetch (option 2)
2. Key Link cluster Mode C deep ingest

### Source

- **Key Link Mode C** (3 PDFs, body ingest via `pdftotext` 외부 추출):
  - `2026-05-22__support-fireblocks-io__fireblocks-key-link-overview-extracted.txt` (98 lines, 4.7KB)
  - `2026-05-22__support-fireblocks-io__getting-started-with-fireblocks-key-link-extracted.txt` (343 lines, 19KB)
  - `2026-05-22__support-fireblocks-io__set-up-your-fireblocks-vault-with-key-link-extracted.txt` (115 lines, 6KB)
  - 본 3 PDF 는 Stage 18 에서 catalog-only / lightweight-index 단계 → Stage 36 에서 promote (Mode C)
- **Reference mass-fetch (Mode A+B)**: `developers.fireblocks.com/reference/*.md` 163개 disk 저장 (sequential curl, body LLM read 없음). 1 FAIL (URL log-truncated, 추후 재시도). 기존 fetched 3 + 신규 159 = **162 / 166** 확보.

### ANSWERED

- **Q-2026-05-19-M06**: Key Link signing flow = 외부 HSM 단독 서명. Fireblocks key share 0개. Customer HSM signature → Fireblocks validation key 로 검증 (asymmetric pair). 4-component pipeline.
- **Q-2026-05-19-G07**: 3-level governance (Admin Quorum / Approval Group / Policy) 모두 적용. `Settings > Quorums > Security & compliance > Add validation keys` 전용 group.
- **Q-2026-05-19-AU06**: Signer-role API user + pairing token. Re-enroll = Owner approval.
- **Q-2026-05-19-W03 (partial)**: Vault account = ECDSA 1 + EdDSA 1 전속. Workspace-level Key Link/MPC 공존 여부는 미명시 → Q-KL01.
- **Q-2026-05-19-S16 (partial)**: Beta state 재확인, specific limitation 본 3 PDF 에 미명시.
- **Q-2026-05-19-A08 (partial)**: ECDSA + EdDSA algorithm 단위 지원. Chain matrix = algorithm 결정.

### 영향받은 페이지 (8)

- [[entities/fireblocks/mpc-key-share]] §"Stage 36 — MPC plane vs Key Link plane boundary"
- [[entities/fireblocks/cosigner]] §"Stage 36 — Fireblocks Agent"
- [[entities/fireblocks/workspace]] §"Stage 36 — Key Link Workspace Variant"
- [[entities/fireblocks/vault-account]] §"Stage 36 — Key Link Vault Binding"
- [[entities/fireblocks/transaction]] §"Stage 36 — Key Link Signing Flow"
- [[vendors/fireblocks/architecture]] §"Stage 36 — Key Link Customer-Held Key Plane"
- [[vendors/fireblocks/security]] §"Stage 36 — Customer Signature Validation Plane"
- [[vendors/fireblocks/risks]] §"Stage 36 — Key Link Risks" (7 신규 risk)

### 신규 entity 0 (★ 연속 29 stage 0 streak 유지)

흡수 매핑:
- Fireblocks Agent → `entities/cosigner` (cosigner variant 추가)
- Validation key + Signing key (customer-held) → `entities/mpc-key-share` + `vendors/security` (key plane boundary)
- Key Link workspace → `entities/workspace` (workspace type 축 추가)

### 신규 Q 5건 (KL01–KL05, 모두 open)

- KL01: Key Link / MPC workspace same-organization 공존
- KL02: Customer Server fail 시 fallback
- KL03: Fireblocks Agent open-source update 정책
- KL04: HSM Adaptor cold-HSM signing latency
- KL05: Non-Interactive PoO replay window

### 부수 작업 (이번 turn 에 함께 처리)

- **27 custodial 페이지 사이드바 ← Documentation Hub** 링크 추가 + CSS `.nav-up` 룰
- **SPOC tooltip** 5 docs-site 페이지 + skill dictionary 항목 추가
- **doc-author skill** site-template-custodial-db.md 에 SPOC 정의 추가
- **Reference cluster catalog** markdown 생성 예정 (`_catalog_2026-05-22__developers-reference-batch.md`)

### Stage 36 invariant

> External 도구 (`pdftotext`) 가 PDF/HTML 의 raw read 금지 정책의 실제 enabler.
> v3.2.2 의 "외부 도구 chunked extract" 가 실제 운영에 어떻게 작동하는지 — pdftotext 가 PDF → text 추출, classifier 회복 시 chunk read 가능.
> Mode C 의 chunk read 는 LLM 의 직접 PDF read 가 아니라 외부에서 가공된 텍스트의 read 임이 이번 stage 에서 정형화됨.

### Stage 36 closing rule

> Catalog-level Q candidate (Stage 18 의 M06/W03/G07/S16/AU06/A08) 가 Mode C ingest 에서 일괄 ANSWERED 되는 패턴 — promote 결정 시점에 candidate 가 정식 등록되는 lazy-registration 모델. 향후 Mode C promote 의 표준 flow.

## Stage 37 (2026-05-22) — KR Compliance Domain 신설 + Mode C Ingest

### source
- `sources/compliance/KR_Custodial_Wallet_Compliance_Guide.pdf` (12 페이지, ChatGPT 생성 종합 보고서, 75 footnote 1차 출처)

### 분류
- TIER 1, 신규 도메인 (**Compliance / KR Regulations** — 6 번째 도메인)
- Mode C ingest (사용자 명시 승인)

### ANSWERED
- fireblocks-cold-wallet-bank-design 의 §7.4 의 5 KR 규제 ★ Hypothesis → 정식 fact 화 (시행일, 1차 출처 URL 병기)
- "KR 특금법 cold storage 비율" → **가상자산업감독규정 §9 = 경제적 가치 80%** (시행령 위임 "≥70%")
- 트래블룰 임계 = **100만원 이상** (특금법 시행령 §10조의10)
- 기록보존 = **최소 5년** (특금법 §5조의4)
- 신고 유효 = **3년**, 갱신 45일 전, 신규 심사 3개월, 변경 45일

### 신규 entity
- **0** (28+1 stage 연속 0 streak 유지)
- 흡수 매핑: 모든 KR 법령 fact 가 기존 docs-site 3 문서 + sources/compliance/source-notes 에 흡수

### 영향받은 페이지
**신규**:
- `sources/compliance/source-notes/inventory.md` — 12 페이지 catalog + 50+ fact + 8 KR 법령 매핑 + 4 종합검사 제재 + 해외 비교
- `sources/compliance/source-notes/lightweight-index.md` — TIER 1 hub + cross-cut signal
- `open-questions/compliance.md` — Q-CMP-01 ~ Q-CMP-08 (신규 도메인 8 Q)

**보강**:
- `docs-site/fireblocks-cold-wallet-bank-design/risks-open-questions.html` §7.4 (KR 규제 매핑 ANSWERED + 4 종합검사 제재사례 + 신고제 운영)
- `docs-site/fireblocks-cold-wallet-bank-design/bank-operations.html` §6.3 + §6.5 (KR 망분리 + 14-row 감사 매핑 매트릭스 + 4 종합검사 공통 위반)
- `docs-site/fireblocks-cold-wallet-bank-design/index.html` (80% 냉지갑 fact 인용)
- `docs-site/fireblocks-cold-wallet-bank-design/cold-wallet-fundamentals.html` (multi-workspace trigger #6 의 KR 근거 명시)
- `docs-site/nodewallet-bank-design/compliance-regulations.html` (5 → 8 규제 한눈에 표 + 시행일 + 1차 출처 + 4 임계값 callout)
- `docs-site/custodial-wallet-db-design/tables-aml.html` (KR Travel Rule 100만원 + 5년 보존 + 신규 서비스 위험평가 callout)

### 신규 Q 8건 (CMP-01 ~ CMP-08, 모두 open)

- CMP-01: 2026-03-30 예고된 시행령·감독규정 개정안 정식 시행일
- CMP-02: 대법원 2024도10710 판결 ratio decidendi 원문
- CMP-03: 4 종합검사 제재 원문 (두나무·코빗·빗썸·코인원)
- CMP-04: ISMS·ISMS-P 인증 vs 신고요건 매핑
- CMP-05: "법령준수체계" 요건의 시행세칙
- CMP-06: "동종·동량" 보유 의무의 실무 해석
- CMP-07: 미신고 해외 VASP 의 "한국인 유치" 판단 기준
- CMP-08: MPC·멀티시그 사업자의 "실질 통제" 기준 (2024도10710 wallet architecture 적용)

### Stage 37 invariant

> 6 번째 도메인 (Compliance) 신설 시 신규 entity 0 패턴 유지 — KR 법령 fact 는 sources/compliance/ + docs-site 의 cross-cut 형태로 흡수.
> ChatGPT-generated 2차 source 의 Mode C ingest 는 **1차 출처 URL 병기 + evidence isolation rule 엄수** 의 새 운영 sample. ChatGPT 의 해석/연결 추론은 공식 fact 로 표기 금지.

### Stage 37 closing rule

> 새 도메인 도입 시 (1) inventory + lightweight-index 의 catalog, (2) open-questions/&lt;domain&gt;.md 의 신규 Q 등록, (3) docs-site 의 cross-cut 보강, (4) log.md Stage entry — 4 단계 절차를 표준 flow 로 정형화.

## Stage 38 (2026-05-22) — Fireblocks × Thales Luna HSM (vendor blog) Mode C Ingest

### source
- `https://www.fireblocks.com/blog/enterprise-digital-asset-security-fireblocks-thales` (Fireblocks 공식 블로그, 2025-09-23, by Adam Levine SVP)
- 적재 위치: `sources/fireblocks/markdown/2026-05-22__fireblocks-com__enterprise-digital-asset-security-thales.md`

### 분류
- TIER 1, 1차 source (vendor 공식 블로그)
- Mode C ingest (사용자 명시 승인)
- Stage 36 Key Link cluster 의 후속 + Stage 37 KR 컴플라이언스 옵션 C 의 보강

### ANSWERED 1 partial
- **Q-2026-05-22-KL04 (partial)** — Air-gap transport 메커니즘 = USB · SFTP · data diodes (vendor 공식 발언)

### 신규 Q 3건
- **Q-2025-09-23-FB01** — Hot/Warm/Cold 3-mode 의 정확한 정의 (특히 "Warm")
- **Q-2025-09-23-FB02** — SaaS Cold Wallet workspace vs Key Link Cold signing 의 관계
- **Q-2025-09-23-FB03** — KR VASP 환경 Key Link + Thales Luna 적용 vendor 공식 입장 (HKMA/HKSFC/JFSA 명시, KR 미명시)

### 핵심 fact
- **Fireblocks KeyLink ↔ Thales Luna HSM** 통합. "secure middleware layer" 표현
- **Thales Luna HSM** — FIPS 140-3 Level 3 + Common Criteria 인증, PQC readiness
- **Hot · Warm · Cold signing workflows** — vendor 공식 3-mode framing 등장
- **Air-gap transport** — USB · SFTP · data diodes (Cold workflow 의 명시 매체)
- **Customer key ownership** — "Institutions maintain full key ownership"
- **관할권 명시** — HKMA · HKSFC · JFSA. **KR 미명시**
- Resource: "Thales-Fireblocks Digital Asset Key Security Solution Brief" (현재 미적재)

### 신규 entity
- **0** (30 stage 연속 0 streak 유지)
- 흡수 매핑: Thales Luna HSM → `vendors/fireblocks/security` 의 HSM 항목에 흡수 (별도 entity 미생성)

### 영향받은 페이지
**신규**:
- `sources/fireblocks/markdown/2026-05-22__fireblocks-com__enterprise-digital-asset-security-thales.md` (lightweight-index + 10 핵심 fact + cross-cut signal)

**보강**:
- `open-questions/fireblocks.md` — Stage 38 entry: Q-KL04 부분 ANSWERED + 신규 Q-FB01/FB02/FB03
- `vendors/fireblocks/risks.md` — Risk-KL05 의 air-gap transport 부분 ANSWERED + Stage 38 — Key Link × Thales 섹션
- `vendors/fireblocks/security.md` — Stage 38 — Thales Luna HSM 통합 cross-cut + Stage 36 Customer Signature Validation Plane 와의 관계
- `docs-site/fireblocks-cold-wallet-bank-design/signing-flow.html` — Hot/Warm/Cold 3-mode vendor 공식 framing callout
- `docs-site/fireblocks-cold-wallet-bank-design/risks-open-questions.html` §7.4d/e — KR 미명시 검증 항목 + Hot/Warm/Cold 3-mode 부분 ANSWERED 표
- `docs-site/fireblocks-cold-wallet-bank-design/bank-operations.html` §6.3 — 옵션 C-Thales 행 추가 (Key Link + Thales Luna HSM)
- `docs-site/fireblocks-kr-vasp-compliance/deployment-checklist.html` §6.6 — Thales Luna HSM + Hot/Warm/Cold + air-gap transport 3 신규 점검 항목

### Stage 38 invariant

> 1차 source (vendor 공식 블로그) 의 Mode C ingest 는 marketing 톤이라도 (a) vendor 공식 framing (Hot/Warm/Cold 3-mode 같은), (b) 인증 등급 (FIPS 140-3 L3 + Common Criteria) 같은 명시적 fact, (c) 관할권 명시 vs 미명시 (HKMA/HKSFC/JFSA vs KR) 가 가치. 단 fact 추출 후 1차 source 의 marketing 해석은 wiki 본문에 반영 금지.

### Stage 38 closing rule

> vendor blog 처럼 짧은 1차 source 라도 (a) 직접 인용 가능한 표현, (b) 다른 wiki/docs 의 ★ Hypothesis 답변, (c) 새 Open Q 후보 의 3 축에서 추출. 셋 다 0 이면 Mode A (catalog-only) 가 적절.


## Stage 39 (2026-05-27) — DAW 회계 설계 자문 자료 Mode C ingest

### Trigger
사용자 명시: "이 문서는 공식문서는 아니고 현재 설계 초기 단계로 작성한거에요. 이 부분 참고해서 MODE C 로 진행해 주세요."

### Source 추가
- `sources/bank/DAW_회계설계_자문요청.pptx` (binary, 11 슬라이드, 카뱅 회계자금 개발팀, 2026-04-30 자문 미팅)
- `sources/bank/2026-04-30__bank__DAW_accounting_design_consultation-extracted.md` (외부 도구 unzip + python regex 로 추출한 텍스트 + 메타데이터)

### Classification
- **TIER 1** — 도입 reference 의 회계 영역 직접 영향
- **Confidential** — 카뱅 internal 자료 (DAW / KRWK / 5,010 등 수치 포함). docs-site 공개 site 노출 시 일반화 필수
- **work-in-progress 설계** — vendor 공식 자료 아님. 회계법인 / 외부 감사 검증 전 초안

### docs-site 영향 — 신규 도메인 I. Accounting & Reconciliation

신규 2 페이지 (13 → 16 → **18 페이지** 로 확장):
- `docs-site/fireblocks-custodial-wallet-db-design/accounting-ledger.html` (15) — 3 계층 정합 / 회계 항등식 / 4 원장 / 거래 매트릭스 / 손익 계정 / 외화환산
- `docs-site/fireblocks-custodial-wallet-db-design/reconciliation-close.html` (16) — 4 단계 대사 (L1-L4) / 결산·마감 / 정정 절차 / 외부 감사 대응

### Confidential 처리

PPT 의 specific 명칭·수치 모두 일반화:
- "카뱅" → "은행 도입 시" / "본 은행"
- "DAW" → "수탁 시스템"
- "KRWK" → "원화 stablecoin (KRW-pegged)"
- "USDC" → "달러 stablecoin (USDC 등)"
- 수치 (5,010 / 5,000 / 100 KRWK) — 제거 또는 추상 (X / Y) 또는 예시 일반화

### 출처 callout — 3-tier 신규

본 영역의 출처 분류를 3-tier 로 명시 (vendor 공식 자료 부재):
1. Fireblocks 공식 사실 — URL 링크
2. 일반 수탁업 회계 패턴 — 업계 표준 (이중부기 / 회계 항등식 / 외화환산 / 결산)
3. 본 reference 의 권장 설계 (work-in-progress) — 운영 시작 전 회계법인 / 외부 감사 검증 권장

### 페이지 번호 / 사이드바 일괄 갱신

- 18 페이지 (0-17) 구조로 사이드바 모두 갱신 (Python 스크립트 일괄)
- 기존 db-ops 의 페이지 번호: 15 → 17
- 신규 도메인 I 가 G (Audit) 와 H (Ops) 사이에 위치
- index.html overview 표 + lead 문구 + docs-site 카드 description 모두 갱신

### invariant — Mode C ingest 의 confidential 처리

> Internal 자료 (회사 명칭 · 수치 · 자체 약어 포함) 의 Mode C ingest 시 다음 규칙: (a) extracted 본문은 sources/ 에 raw 보관 (5 년 audit), (b) docs-site 적재 시 specific 명칭/수치 모두 일반화, (c) "vendor 공식이 아닌 work-in-progress 설계" 라벨 명시, (d) 회계 · 법무 · 외부 감사 검증 권장 callout 필수.

### 신규 entity 0 / 신규 페이지 +2

## Stage 40 (2026-06-01) — DCCP (Deposit Control and Confirmation Policy) Mode C ingest

- source: 3 Fireblocks Help Center articles (전부 TIER1 full ingest)
  - `default-deposit-control-and-confirmation-policy.md` (2 pages)
  - `build-a-custom-deposit-control-and-confirmation-policy.md` (5 pages)
  - `blockchain-confirmation-limitations.md` (8 pages)
- ANSWERED (partially): **Q-2026-05-18-B03** (internal-tx 감지 메커니즘) — confirmation/finality 차원의 truth-determination 정책은 명시화 (SOL 의 empirical "reversion has never happened before" 인용); indexer 의 RPC 구현 자체 (`debug_traceTransaction` 등) 는 여전히 비공개
- 신규 Open Q: **Q-2026-05-29-DC01 ~ DC07** (7 건)
  - DC01: contract-call 의 3-conf "recommended" 가 default 인지 권장값인지
  - DC02: Custom DCCP 의 Fireblocks Support review SLA / lead-time
  - DC03: Custom DCCP 변경 audit trail (customer 측 노출)
  - DC04: "Override the DCCP for specific transactions" 별도 plane 메커니즘
  - DC05: KR 은행 compliance — SOL `Confirmed` vs `Finalized` 의무 판단
  - DC06: Finality 체인의 chain-자체 finality 실패 시 webhook re-emit 정책
  - DC07: Max confirmations table 의 신규 체인 추가 catalog 업데이트 주기
- 영향받은 페이지:
  - `vendors/fireblocks/blockchains.md` — §"Deposit Control and Confirmation Policy (DCCP) — Stage 40" 신규 (default + custom + min/max + finality + SOL `Confirmed` 정책 + 운영 함의). source_count 9→12, tags 추가 (transaction, policy), last_updated_stage:40
  - `entities/fireblocks/transaction.md` — §"Stage 40 — DCCP 와 confirmation lifecycle" 신규 (Stage 9 17-status state machine 의 `CONFIRMING` → `COMPLETED` 전이 trigger 로 연결)
  - `open-questions/fireblocks.md` — Q-B03 부분 ANSWERED + 신규 DC01~DC07 등록

### 핵심 fact (Fireblocks 공식 source)

- **ETC default = 372 confirmations** (51% attack risk 명시 인용)
- **EVM minimum = 1 conf rigid** (0 불가)
- **Max conf 등급별**: 1 / 2 / 3 / 20 / 30 / 100 / 300 / 1200 (chain 별 hard limit)
  - Ethereum max 100, Polygon max 300, ETC max 1200
- **Finality 체인 dual-level**: SOL/POLKADOT = `Confirmed` 1 / `Finalized` 2 — Fireblocks 는 **`Confirmed`** 사용
- **★ SOL 직접 인용**: "we only mark confirmed blocks as completed... **Based on our analysis, a reversion has never happened before.**"
- **Custom DCCP self-service 불가** — Fireblocks Support 제출 → review/approval/implementation
- **6-parameter first-match rule**: Source / Destination / Amount / Asset / Blockchain / # Conf
- **`Minimum` 의 dynamic mapping**: BTC vault-to-vault = 0 conf, Polygon vault-to-vault = 1 conf

### invariant — DCCP 의 truth-determination 평면

> Fireblocks 의 deposit completion 결정은 단순 N-block 누적이 아니라 (a) chain 별 finality 정책 (rigid finality property 포함) + (b) Fireblocks 의 empirical risk monitoring 의 합성. Indexer 의 RPC method 구현은 비공개지만 정책 layer 는 customer 가 override 가능 (Custom DCCP 경유 Fireblocks Support). KR 은행 도입 시 SOL `Confirmed` 사용이 규제 관점에서 인정되는지 별도 확인 영역 (Q-DC05).

### 신규 entity 0 (29 stage 연속 0 streak 유지)

DCCP 는 vendors/fireblocks/blockchains.md 의 sub-domain + entities/fireblocks/transaction.md 의 confirmation lifecycle 로 흡수.

## Stage 41 (2026-06-01) — Vendor-Neutral Blockchain Indexer Reference Mode C ingest

- source: `sources/indexer/블록체인 인덱서 구현과 운영에 대한 심층 분석 보고서.pdf` (16 페이지, Korean)
- external references: 28 (Polkadot · SubQuery · The Graph · NEAR · Solana · Ethereum · Blockscout · Firehose · Kafka · Postgres · Elasticsearch · RocksDB · Geth · AWS gp3 / S3 / m7i)
- 자료 성격: **vendor-neutral generalized reference** — Fireblocks 도메인 외부. docs/architecture/ Stage 32+ generalized publication 영역에 흡수.

### 신규 페이지

1. **Layer 1**: `sources/indexer/2026-06-01__블록체인-인덱서-심층-분석-보고서.md` — TIER1 full ingest. 4 구현 패턴 · 참조 아키텍처 · 8 NFR axis · 5 대표 사례 비교 · 비용 모델 (AWS 공식 단가 직접 인용) · 11 체크리스트.
2. **Layer 2**: `docs/architecture/blockchain-indexer-architecture-reference.md` — Stage 41 wiki 페이지. §11 "Fireblocks 와의 관계" 신규 추가 (vendor-neutral reference 를 Fireblocks SaaS 모델과 대비).

### 영향받은 페이지 (cross-ref 양방향)

- `vendors/fireblocks/blockchains.md` § DCCP 끝부분 — "Vendor-neutral indexer reference 와의 대비" subsection 추가
- `docs/architecture/multi-chain-adapter-pattern.md` § 9.4 Adapter internal layers — indexer layer 의 generalized 참조 link
- `docs/architecture/deposit-lifecycle.md` § 1.3 — indexer truth-determination 정책의 vendor-neutral guidance link
- `open-questions/fireblocks.md` Q-2026-05-18-B03 — Stage 41 추가 부분 답 (4 pattern 분류 + Fireblocks 구현 추정)

### 신규 Open Q (3 건)

- Q-2026-06-01-IDX01: 11 체크리스트를 Fireblocks SaaS 모델에 적용 시 customer 가 verify 가능한 항목 범위
- Q-2026-06-01-IDX02: 설치형 WaaS (Hosted MPC / BCM) 의 indexer 평면 vendor/customer 분리 boundary
- Q-2026-06-01-IDX03: KR 금융위 가상자산 가이드 (2026) 가 요구하는 audit/trace 항목과 본 reference 모니터링 지표 매핑

### 핵심 fact (vendor-neutral)

- **4 구현 패턴**: P1 풀노드 pull / P2 이벤트 스트리밍 / P3 트랜잭션·이벤트 스캔 / P4 상태 스냅샷·레이크 — 실무에서는 2~3 조합
- **참조 아키텍처 핵심**: 수집-질의 분리 (Graph Node = query node + indexing node + Postgres shard; Blockscout = indexer/API/UI 분리; Solana = Geyser 외부화)
- **공통 5 entity**: `Block` / `Transaction` / `Log/Event` / `StateChange` / `Checkpoint` — EVM·Substrate·NEAR·Solana 공통 적용
- **확정성 = API 계약**: `processed` / `confirmed` / `finalized` 를 spec 에 노출하지 않으면 UX·데이터팀 불일치
- **비용 모델 공식 단가**: AWS gp3 $0.08/GB-month, S3 Standard $0.023/GB-month + $0.005/1k req. Geth hash archive 20TB = $1,638.40/월 (스토리지만)
- **The Graph 의 슬래싱 모델**: GRT staking + signed receipt + RAV → 데이터 평면 / 결제 평면 분리
- **NEAR Lake 2026-03-24 신규 인덱싱 중단** — Neardata / Nearcore Indexer 권장
- **Solana slot 400–600ms** — 저지연 indexer 의 설계 목표 "한 슬롯 이내 또는 수 슬롯 이내"

### invariant — vendor-neutral / SaaS 흡수 경계

> SaaS (Fireblocks) 는 indexer 의 4 pattern + projection + confirmation policy + reorg handling + webhook 송출까지 흡수해 customer 에게 정책 layer (DCCP) override 만 노출. Direct-build path 는 본 reference 의 전체 영역이 customer 책임. 설치형 WaaS 도 projection 이후는 customer 영역 — 본 reference §4~§6 동일 적용. **선택은 risk model + trust model 의 일부**, 단순 성능 문제가 아님.

### 신규 entity 0 (30 stage 연속 0 streak 유지)

Vendor-neutral indexer reference 는 docs/architecture/ 의 단일 페이지로 흡수.

## Stage 42 (2026-06-01) — Vendor-Specific Indexer Hypothesis Mode C ingest (★ UNVERIFIED tier)

- source: 2 LLM 생성 자료 (사용자 명시 확인)
  - `sources/indexer/블록체인_인덱서_구현_리서치.md` (36 KB, 본문)
  - `sources/indexer/엔터프라이즈_블록체인_인덱서_설계_구조.html` (30 KB, 시각화 짝)
- 자료 성격: **★ UNVERIFIED hypothesis tier** — Fireblocks / BitGo / Coinbase Mesh 의 vendor-specific 구현 분석이지만 공식 source cross-verify 안 됨. 사용자 결정으로 "unverified vendor analysis" tier 로 분리 보존.

### 신규 페이지

1. **Layer 1 metadata**: 두 raw 파일에 disclaimer comment 추가 (LLM 생성 출처 명시 + tier 분류 + 사용 시 주의 + 짝 자료 cross-ref)
2. **Layer 2 hypothesis page**: `docs/architecture/vendor-indexer-implementations-hypothesis.md` — Stage 41 reference 와 분리된 hypothesis tier 페이지. 모든 fact 에 "본 자료에 따르면" hedged 표현. 17 개 Q-VRF cross-verification 항목 명시.

### 영향받은 페이지 (cross-ref 양방향)

- `docs/architecture/blockchain-indexer-architecture-reference.md` §11.4 — Stage 42 hypothesis 페이지 link 추가 (tier 차이 명시)
- `open-questions/fireblocks.md` Q-2026-05-18-B03 — Stage 42 hypothesis-tier additional context 추가 (UNVERIFIED 라벨)

### 핵심 hypothesis (모두 unverified, fact 승격 조건부)

- **Fireblocks**: 송신 1분 / 수신 10분 timeout, UTXO mempool 즉시 vs Account block-mined 후, ATC + `stuck_confirming` 지표, Solana 1,000 동시 pending (공식 600 과 mismatch), Stellar 10 wallet/TPS 라운드 로빈, BTC 30초 batching + CPFP, Chainalysis/Elliptic 실시간 API
- **BitGo**: BigInt 라이브러리 (256bit → 6 field 분할), 단일 스레드 EVM + Parity tracing 아웃소싱, CREATE2 dynamic wallet + Gas Tanks 중앙 풀, TAP Universe 오프체인 영수증
- **Coinbase Mesh**: BadgerDB 4 파라미터 튜닝 (Compression=None, NumMemtables=1 등), WaitTable 패턴 (BlockSeen vs AddBlock 분리, mutex 채널 wake), Mina Mesh 4 계층
- **Modern Decoupled ETL**: cryo (Paradigm) + Reth ExEx, Kafka 3-partition (blocks/transactions/logs), Flink 디코딩 + 스키마 replay, Bloom filter 매칭

### 신규 Open Q

- **Q-2026-06-01-IDX04**: 17 Q-VRF 항목 중 우선 cross-verify priority
- **Q-2026-06-01-IDX05**: Hypothesis 가 vendor 공식 검증 실패 시 보존 정책

### invariant — Tier 분리 강제

> LLM 생성 자료를 wiki 에 흡수할 때: (a) sources/ 에 raw 보존 + disclaimer comment, (b) 별도 hypothesis-tier 페이지 (절대 fact-tier 페이지에 직접 흡수 ✗), (c) 모든 fact 에 "본 자료에 따르면" hedged 표현, (d) cross-verification 필요 항목을 Q-VRF-NN 으로 enumerate, (e) Fireblocks 공식 fact 와 동일 tier 로 표시 금지. **Evidence Isolation 룰의 직접 적용**.

### 신규 entity 0 (31 stage 연속 0 streak 유지)

LLM 생성 hypothesis 는 docs/architecture/ 의 별도 hypothesis 페이지로 격리. 기존 fact-tier 페이지 오염 없음.

## Stage 43 (2026-06-01) — Vendor-Specific Indexer Hypothesis 추가 자료 (B3) Mode C ingest

- source: `sources/indexer/블록체인 인덱서 구현 사례와 Fireblocks 사례 분석.md` (242 lines, ChatGPT 추정)
- 자료 성격: B1/B2 와 같이 LLM 생성이지만 **한 단계 신뢰도 ↑** — ChatGPT citation tag (`citeturn34view0` 등) 본문 포함 + 자체 tier 분리 (공개 확인 / 합리적 추론 / 미확인)

### 영향

- Layer 1: B3 raw 에 disclaimer comment 추가 (B1/B2 와 같은 패턴)
- Layer 2: Stage 42 hypothesis 페이지 `docs/architecture/vendor-indexer-implementations-hypothesis.md` 에 §5 신규 추가 (5.1 자체 tier 분류 / 5.2 Stage 41 cross-confirm / 5.3 비용 데이터 / 5.4 Fireblocks 핵심 해석 / 5.5 Q-VRF 일부 답)
- §7 / §8 renumber (B3 section 삽입에 따른 chapter 재배치)
- §8 Q-VRF list 에 Stage 43 update mark — Q-VRF-01 (UTXO/Account mempool timing) + Q-VRF-08 (Chainalysis/Elliptic) 의 cross-verify path 명확화 (B3 가 Fireblocks 공식 docs 명칭 인용)
- 신규 Q-VRF-18~22 (5건, B3 추가 영역): Alchemy / QuickNode pricing, Subgraphs sunset, AWS MSK 예시, QuickNode exactly-once
- Stage 41 reference `blockchain-indexer-architecture-reference.md` §9.3 신규 — hypothesis-tier 비용 데이터 cross-ref (★ unverified 명시)

### B3 가 Stage 41 fact 와 cross-confirm 한 항목 (fact-tier 강화)

- Geth path-based archive flat state 2TB / trie data 6.5TB ✓
- Infura `removed=true` + 재조직 시 중복 가능성 ✓
- The Graph query nodes ↔ index nodes 분리 권장 ✓

→ Stage 41 fact-tier 의 신뢰도 강화. 동일 fact 가 독립 source 두 곳에서 일치 확인.

### B3 가 답하지 못하는 항목 (B1 only, 여전히 unverified)

- 1분 / 10분 timeout (Q-VRF-02)
- ATC + `stuck_confirming` (Q-VRF-03)
- Stellar 10 wallet 라운드 로빈 (Q-VRF-04)
- BTC 30초 batching (Q-VRF-05)
- Solana 1,000 동시 (Q-VRF-06)

→ B1 의 가장 specific 한 수치는 B3 가 다루지 않음 — Q-VRF priority 결정 시 우선순위 ↓ 영역.

### invariant — Tier-aware Mode C 흡수 패턴

> 동일 도메인의 다중 LLM 생성 자료 ingest 시: (a) 각 자료의 tier 평가 분리 (B1/B2 vs B3 처럼 자체 tier 분리 여부 / citation tag 여부), (b) Stage 41 fact 와의 cross-confirm 영역은 fact-tier 강화 효과 명시, (c) cross-confirm 안 되는 specific fact 는 unverified 유지, (d) cross-verify path 가 명확한 항목 (vendor 공식 docs 명칭 인용 등) 은 Q-VRF 에 path 명시 — 운영 결정 시 우선 verify priority 결정 도움.

### 신규 entity 0 (32 stage 연속 0 streak 유지)

B3 는 Stage 42 hypothesis 페이지의 §5 로 흡수, 별도 페이지 안 만듦.

## Stage 44 (2026-06-01) — B4 거래소 비교 보고서 Mode C ingest (★ 외부 URL traceability 최고)

- source: `sources/indexer/Fireblocks와 국내외 거래소의 블록체인 인덱서 설계·구현 비교 보고서.pdf` (9 페이지, Korean, ChatGPT 추정)
- 자료 성격: B1/B2/B3 와 같은 LLM 생성, but **36 외부 URL footnote 본문 명시** + 자체 tier 분류 ("확인됨 / 부분 확인 / 미확인") 일관 적용 + 7 거래소 비교

### 핵심 신규 fact (B4 가 외부 URL footnote 로 정리)

- **Coinbase ChainStorage** (Part 1 blog): raw block lake (S3 + DynamoDB) + ELT + chain-native parser + **reorg = add/remove event sequence 적재** + Merkle 검증 + node failover + AWS Ethereum 1-2초 freshness · 1000 blocks/sec
- **Coinbase ChainNode** (Part 3 blog): Temporal workflows + DynamoDB sink + Golang RPC + ChainStorage 변경분 지속 복제
- **CDP Webhooks**: at-least-once, 최대 60회 재시도, <500ms freshness
- **Binance tech blog**: Flink + Kafka + Hive + S3 + ElasticSearch + Snowflake stack
- **Binance WebSocket**: 단일 연결 최대 1024 streams
- **Korbit** (tech blog 22-23): Kafka 중심 Event Sourcing + Temporal + Go (Open API/주문) + Rust (체결/시세) + gRPC/protobuf + AWS EKS + Chainalysis 통합
- **Korbit Temporal**: durable timer (`Workflow.sleep`), Activity Retry Policy, Replay, `ALLOW_DUPLICATE_FAILED_ONLY`, `continueAsNew`, Slack Fail-safe, Chronos (입출금 중단/재개 예약 + 수수료 지갑 자동 충전)
- **Coinone status enum 세분화**: `DEPOSIT_WAIT` / `DEPOSIT_SUCCESS` / `DEPOSIT_REJECT` / `WITHDRAWAL_REGISTER` / `WITHDRAWAL_WAIT` / `WITHDRAWAL_REFUND_FAIL` + 백엔드 MSA + Replica DB + AWS DMS + Spring Batch + AML
- **Upbit Private WS** 운영 제약: idle timeout 120초, `minimum_deposit_confirmations` 노출, myAsset 최초 구독 시 수분 지연 가능

### 영향

- Layer 1: 신규 markdown extract `sources/indexer/2026-06-01__Fireblocks와-국내외-거래소-인덱서-비교-보고서.md` + 원본 PDF
- Layer 2: Stage 42 hypothesis 페이지 §6 신규 (B4 흡수 6.1~6.8)
- §7 / §8 / §9 renumber (B4 section 삽입에 따른 chapter 재배치)
- Stage 41 reference `blockchain-indexer-architecture-reference.md` §9.3a 신규 — Coinbase ChainStorage cross-confirm + Korbit reference 추가
- Q-2026-05-18-B03 추가 답 (Stage 44, hypothesis-tier): Fireblocks 의 indexer 비공개는 의도적 — "범용 인덱서 회사" 아님

### B4 가 Stage 41 fact 와 cross-confirm 한 항목 (fact-tier 강화)

- Coinbase reorg = add/remove event sequence → Stage 41 §8.2 idempotent projection 패턴과 정합
- Coinbase serving 분리 (S3 + DynamoDB + Delta Lake + Kafka + K8s + Spark) → Stage 41 §3 참조 아키텍처와 정합
- Fireblocks externalTxId 영구 멱등성 + JWKS 검증 → 본 wiki Stage 36 transaction.md + Stage 4 webhook docs 와 정합

### 신규 Q-VRF (Stage 44, 9 건)

- Q-VRF-23~31: Coinbase ChainStorage/ChainNode 디테일, Binance tech blog stack, Korbit tech blog + Temporal 워크플로 — **모두 외부 URL traceable** (Q-VRF priority 결정 시 cross-verify path 가장 명확)

### invariant — Outside URL traceability tier

> LLM 생성 자료의 hypothesis tier 안에서도 외부 URL footnote 의 명시 여부에 따라 cross-verify priority 가 다름. B4 처럼 36 외부 URL 직접 인용 자료 = 가장 높은 priority (URL 추적으로 paragraph-level 확인 가능). B1/B2 처럼 URL 없음 = 가장 낮은 priority. Q-VRF 분류 시 외부 URL 명시 여부를 별도 column 으로 관리 필요.

### 신규 entity 0 (33 stage 연속 0 streak 유지)

B4 는 Stage 42 hypothesis 페이지의 §6 으로 흡수, 별도 페이지 안 만듦.

## Stage 45 (2026-06-04) — 원화 스테이블코인 아키텍처 제안서 (K-STAR) Mode C ingest (신규 도메인)

- source: krw-stablecoin-architecture-proposal.pdf (165p, K-STAR 컨소시엄: 카이아DLT·람다256·안랩블록체인·오픈에셋, Final 2026-02-13, 배포등급 Limited)
- 소스 위생: `sources/indexer/` → `sources/stablecoin/` 신설 이동 + meta.yml + 페이지마커 markdown 추출 (`2026-02-13__k-star__krw-stablecoin-architecture-proposal.md`, 166p)
- 추출 방식: `pdftotext` 외부 도구 (PDF Read tool 직접 호출 금지 규칙 준수, context 보호)
- 신규 페이지: `docs/architecture/krw-stablecoin-architecture-reference.md` (8장 전체, 절번호 출처), `open-questions/stablecoin.md` (Q-2026-06-04-STBL01~06)
- 흡수 범위: 토큰통제(USDT/USDC 함수)·4레이어·발행/상환 플로우·발행관리시스템(요청ID 멱등성)·블록체인/SC 6기능·필수인프라(노드/탐색기/브릿지/오라클)·지갑커스터디서명(MPC-TSS+HSM+사전통제)·KYT/KYB/AML/FRAML·데이터대시보드·상호운용성·오케스트레이션(온체인FX)·운영4모드·8참여자·RACI·KRI/트리거·PoC(KRW1/KRWQ)·해외(JPYC/PHPC)
- Fireblocks 3-way 매핑: MPC-TSS↔[[vendors/fireblocks/mpc]], 사전통제↔[[vendors/fireblocks/policy-engine]]/[[vendors/fireblocks/tap]], SoD/다자승인↔[[entities/fireblocks/cosigner]], 인프라↔[[docs/architecture/blockchain-indexer-architecture-reference]]
- 영향받은 페이지(역방향 링크): blockchain-indexer-architecture-reference.md / mpc.md / policy-engine.md 의 Related Pages 3건
- 신규 entity: 0 (신규 *도메인* reference 이므로 Fireblocks entity streak 34 stage 연속 0 무영향)

## Stage 46 (2026-06-04) — Ethereum nonce 관리 (Chainstack) Mode C ingest (신규 도메인)

- source: chainstack.com/ethereum-nonce-management (vendor 기술 블로그, WebFetch 추출 → `tool-extracted` tier)
- 소스 위생: `sources/nonce/webpages/chainstack.com/` meta.yml + markdown 추출본(`2026-06-04__chainstack-com__ethereum-nonce-management.md`)
- 신규 페이지: `docs/architecture/nonce-management-reference.md` (EVM tx nonce 전용), `open-questions/nonce.md` (Q-2026-06-04-NONCE01~03)
- ★ 용어 구분: (B) EVM **트랜잭션 nonce** vs (A) MPC **서명 nonce** — §0.1 혼동방지 (evidence isolation 룰 적용)
- 흡수 범위: nonce 규칙(no-gap)·stuck cascade·concurrency race·local tracker(ethers v6)·eth_getTransactionCount pending/latest·replacement(같은 nonce+양 fee≥10%)·cancellation·mempool 캡(~16/~64 Geth·Reth)·Flashbots private route·L2 sequencer force-inclusion·build-vs-buy(ethers NonceManager/OZ Defender)
- Fireblocks 대비: `failOnLowFee`(=pre-emptive fail > stuck) · multiple withdrawal vault round-robin
- 영향받은 페이지(역링크): transaction.md / multi-chain-adapter-pattern.md / withdrawal-lifecycle.md / signing-workflow-orchestration.md 4건
- 미처리 보류: `sources/nonce/블록체인 nonce 관리 사례와 권장 아키텍처.pdf` (별도 promote 시 nonce-management-reference 에 통합)
- 신규 entity: 0 (신규 도메인 reference; Fireblocks entity streak 35 stage 연속 0 무영향)

## Stage 47 (2026-06-04) — Coinbase "Dedicated Architecture for Solana" Mode C ingest (official fact-tier)

- source: coinbase.com/blog/a-dedicated-architecture-for-solana-at-coinbase (Bill Sahin·Linda Liu·Andrew Allen·Ning Wei·Xiaying Peng, 2026-01-30)
- ★ Cloudflare 로 자동 fetch 불가(WebFetch/curl 403, Wayback·archive.today 미아카이브) → 사용자가 PDF 저장 투입 → `pdftotext` 추출 (PDF 직접 Read 없음)
- 소스: pdf rename + `sources/indexer/markdown/2026-06-04__coinbase__dedicated-architecture-for-solana.md` + meta.yml crawl_status full-text-extracted
- 흡수: `blockchain-indexer-architecture-reference.md` §9.3b 신규 (Coinbase Solana I/O 공식 자료) + Sources 1건
- 핵심: chain-agnostic→Solana 전용 이탈, Geyser hybrid push+pull, 전용 Kafka 병렬, high-water mark ordering, 30일 Shadow Mode→2025-09-10 prod, 12x throughput / 5x withdrawal / 8x spike 흡수 / deposit latency 20%↓
- fact-tier 강화: §9.3a B4 hypothesis(Coinbase ChainStorage)와 tier 구분 — official-tier 로 본 reference §3/§8.2 패턴 실증 cross-confirm. Solana nonce 미사용 → nonce-management-reference §0 경계 cross-link
- 신규 entity: 0, 신규 page: 0 (기존 indexer reference 에 흡수 — entity-min, streak 36)

## Stage 48 (2026-06-04) — SQD/Subsquid 인덱서 클러스터 + educative triage (Plan A)

- sources(4 URL): docs.sqd.dev ×3 (processors/architecture, vs-the-graph, bayc tutorial) + educative.io/coinbase-system-design
- triage 결정:
  - SQD 3개 = **Mode C** (vendor-official) → WebFetch 추출 → `sources/indexer/markdown/2026-06-04__sqd-dev__squid-sdk-cluster.md` + meta
  - educative = **Mode A catalog-only** (제3자 인터뷰 글, fact-tier 아님; vault-wallet-ledger-db-schema/withdrawal/deposit/reconciliation 와 중복 → evidence isolation 위해 본문 미로드). meta 만.
- 흡수: `blockchain-indexer-architecture-reference.md` **§7.6 신규** (SQD/Subsquid — The Graph §7.1·SubQuery §7.3 의 peer 위치) + §6 스택표 1행 + Sources 1건
- 핵심: EvmBatchProcessor·ctx.blocks batch·boundary block·isHead·setFields·filter-before-decode·batch insert·schema codegen·unfinalized 지원·custom sink(BigQuery/Parquet)
- ★ vs-The-Graph 수치(1k~50k vs 100~150 blocks/sec 등)는 **SQD 자체 주장(편향)** → Q-VRF-32 추가(vendor-indexer-implementations-hypothesis.md), §7.6 본문 inline caveat 병행
- 신규 entity: 0, 신규 page: 0 (entity-min, indexer reference 흡수, streak 37)

## Stage 49 (2026-06-04) — GCP Blockchain Node Engine 공식 문서 Mode C ingest (official fact-tier)

- source: cloud.google.com/blockchain-node-engine (→ docs.cloud.google.com), overview/landing/product. WebFetch 추출
- crawl_status: partial — overview/landing OK, supported-networks·create-node·secure 페이지 404/truncated
- 확정: 완전관리형 노드 호스팅(Web3), Ethereum first(mainnet+testnet), REST+RPC API, single-op 배포·multi-day sync 제거·자동 재시작·SLA·상시 모니터링
- doc 미확인(fabrication 금지): node type(full/archive)·클라이언트·보안(PSC/Cloud Armor/IAM)·pricing·멀티체인 → Q-VRF-33 분리
- 흡수: blockchain-indexer-architecture-reference §9.4 신설(관리형 전용 노드 = 노드 호스팅 3 모델 중 ③) + §9.2.3 cross-link
- 추가: docs-site/wallet-service-components abstraction 페이지 SaaS 비교표·어댑터 매핑에 GCP BNE 행 반영
- 소스: sources/gcp/ 신설 (markdown 추출본 + meta.yml)
- 신규 entity: 0, 신규 page: 0 (entity-min, indexer reference 흡수, streak 38)

## Stage 50 (2026-06-08) — Fireblocks REST endpoint surface (read/write) ingest → api.md TODO 해소
- source: developers.fireblocks.com 공식 API reference — `llms.txt` 인덱스 + `api-reference/{vaults,transactions,webhooks-v2}/*` (web fetch, 2026-06-08). 개별 page 는 JS 렌더 stub → `.md` 변형/llms.txt 로 method+path 확보
- 범위: 수탁 "블록체인 매니저" 가 쓰는 그룹만 (Vault / Transactions / Webhooks v2). Policies(TAP)·Network·Exchange 제외
- 흡수: `vendors/fireblocks/api.md` **Stage 50 섹션 신설** — Vault/Transactions/Webhooks 를 read/write 로 구분한 endpoint 표. 기존 REST TODO(line 28/46/50/84) → Stage 50 참조로 갱신, frontmatter last_updated_stage 36→50
- 경로 직접 확인(✅): POST /v1/transactions, POST /v1/transactions/{txId}/drop, POST /v1/transactions/estimate_fee, GET /v1/transactions/{txId}, POST /v1/vault/accounts, POST /v1/vault/accounts/{id}/{asset}/addresses, POST /v1/webhooks, GET /v1/vault/accounts_paged. 나머지(○)는 reference 페이지 존재 + REST 표준 경로
- read/write 본질: WRITE=상태변경(생성·drop·cancel·webhook 설정), READ=조회, event=webhook push. estimate_fee 는 POST지만 read 성격
- docs-site wallet-service-components 11장(AccountPort/TransferPort/IndexerPort) 의 실제 endpoint 근거로 연계
- 신규 Q: Q-2026-06-08-A13(Policies/Network/Exchange endpoint) · A14(set_confirmation_threshold↔DCCP). A15(webhook v1→v2)=ANSWERED 동일 Stage: v1 2026-06-15 EOL, 신규=v2, 이벤트 점표기(transaction.status.updated)
- 신규 entity: 0, 신규 page: 0 (기존 vendor-hub api.md 흡수, streak 39)

## Stage 51 (2026-06-09) — NodeWallet (NodeInfra) promote → 신규 vendor 페이지 + docs-site 옵션2 기성품 반영
- source: sources/nodeinfra/ (Stage 35 gated-docs ingest). 사용자 promote 승인 후 curated 진입
- 신규 page +1: vendors/nodeinfra/nodewallet.md (vendor-hub, status=draft) — 벤더 주장 tier 명시
  - 온프렘 스테이블코인 수탁(은행·카드사·PG·증권·공공), Solana 전용, 망분리 IDC, 벤더 무의존
  - HSM(FIPS 140-3)+SGX TEE, 3-키 다중서명(개시/승인/실행), 코디네이터·승인자·원장 아키텍처
  - 4-축 격리, trust boundaries(DCAP 원격증명·MRENCLAVE), 컴플라이언스 정책 룰, Java/Spring SDK
  - NodeInfra 자체 비교표(VASP/Cloud MPC/NodeWallet) 흡수 — 키 소유권·정책 실행 위치 차이
- docs-site wallet-service-components 10.5 에 "옵션 2 기성품 = NodeWallet" 한 단락 (custody 옵션 2 archetype)
- docs-site 신규 13. NodeWallet 어댑터 페이지 (옵션2 custody 제품, Fireblocks 대비·3-키 의식 다이어그램) + 사이드바 14곳·overview·root 반영
- 정합: 본 wiki 의 custody 옵션 1(Fireblocks SaaS MPC) / 옵션 2(자체 custody=NodeWallet 류) 축과 연결
- 신규 Q: N01(4축 명칭) N02(멀티체인 로드맵) N03(ISMS 상태) N04(다이어그램 미수집)
- 신규 entity: 0, 신규 vendor page: +1 (사유: 사용자 promote 승인, 옵션 2 레퍼런스). entity-min streak 는 Fireblocks 도메인 기준 유지

## Stage 52 (2026-06-09) — Canton ingest → 신규 Canton 엔티티 + docs-site 멀티체인 모델 반영
- 계기: 사용자 고려 네트워크 = 이더리움 + Canton. docs.digitalasset.com(v3.4) 1차 문서 promote 승인
- source: sources/canton/ 4건 — homepage(Mode B) · Musubi intro(활용사례) · Fireblocks recover-CC(복구 운영) · **신규 digitalasset-docs-canton-model(2026-06-09, token-standard/traffic/parties/synchronizer)**
- 신규 entity +1: entities/canton/canton-network.md (status=draft) — **Canton 은 Fireblocks 아닌 독립 체인이라 흡수 시 범주 오류 → 신설**. entity-min 0-streak 종료(사유 명시)
  - 원장 = ACS active contract, 토큰 holdings = UTXO(가용/locked) — **"nonce·UTXO 둘 다 아님" 초기 추정 정정**
  - 전송 기본 2-step(TransferInstruction: Accept/Reject/Withdraw), Canton Coin 은 Transfer Pre-approval=1-step → Fireblocks PRE_APPROVAL 과 정합
  - PartyId = hint::fingerprint(서명 pubkey sha256), traffic(byte) 수수료(CC burn 선구매), Synchronizer 2-phase commit finality
- 중앙 등록: Q-2026-05-22-A11(기존 api.md/transaction.md 인라인 → open-questions/fireblocks.md), 신규 C01(finality 수치)·C02(traffic 산정식)
- 추가 fetch(docs.digitalasset.com traffic-management + docs.sync.global FAQ/deployment): **C02 ANSWERED** — traffic 산정식 `base_event_cost + Σ(storage + writeCost×#recipients×costMultiplier/10000)`, estimate=`/v2/interactive-submission/prepare`
- 양방향 wikilink: entities/fireblocks/transaction · vendors/fireblocks/api ↔ [[entities/canton/canton-network]]
- index.md: entities/canton 섹션 + Source Lake canton 4소스 카탈로그
- docs-site wallet-service-components: 2(멀티체인) 2.2 표에 Canton 3번째 열 완전 충전 + 콜아웃 "account/UTXO 아님" 정정 / 9(출금)·11(추상화) 2-step 정합
- ANSWERED: Q-2026-06-09-C02 (traffic 산정식). A11(Fireblocks status 매핑)·C01(finality 정확 수치, 1차 페이지 3곳 모두 수치 없음)은 open 유지

## Stage 53 (2026-06-10) — Canton 공식 문서 리뉴얼본(docs.canton.network) promote
- 계기: 사용자 — "docs.canton.network 캔톤 문서 리뉴얼됨, promote". llms.txt 로 docs.digitalasset.com **후속 사이트** 확인
- source: sources/canton/ +1 — **신규 docs-canton-network-renewed(2026-06-10)**: ordering-consensus · token-standard(CIP-0056) · synchronizer-traffic · external-party · validator-disaster-recovery
- 신규/정밀화 사실 5건:
  - **BFT orderer**(C01 메커니즘 보강): native BFT(ISS+Narwhal, `Mempool→Availability→Consensus→Output`, <1/3 Byzantine fault), 2-layer 합의. **finality 수치는 리뉴얼본에도 없음 확인** → C01 수치 open 유지
  - **traffic 구체 수치**(C02 구체화): `메시지크기×(1+recipients×factor/10000)`, 무료 400,000 byte/20분, 추가 $60/MB, factor 4bp, 최소 top-up 200,000 byte. **기존 "10분 mining round" → "20분 window" 정정**
  - **CIP-0056** token standard + 신규 인터페이스(TransferFactory/AllocationFactory/BatchMergeUtility/MergeDelegation), **지갑당 ~10 UTXO 유지 권장**(Holding storage+compute 비용)
  - **external party** = 자체 namespace·자체 signing key, no SPN. external signing 2-step(Preparing PN + Executing PN), party 가 tx-tree hash 서명, **키는 party 만 통제 → MPC/HSM 수탁 모델과 정합**
  - **disaster recovery 1차 출처화**: 3 경로(단일노드 DB복원 / 광범위 identities 재온보딩 / synchronizer roll-forward LSU), external party 별도 절차(완전 새 validator + CC Scan ACS import)
- 갱신: entities/canton/canton-network.md(source_count 4→5, last_updated_stage 53), open-questions C01(메커니즘 보강·수치 open)·C02(구체 수치)
- docs-site canton-network: page2(BFT 콜아웃·external party 표/서명 2-step·finality 재확인) / page3(traffic 공식·파라미터 표 정정·~10 UTXO·$60/MB) / page1(~10 UTXO 병합 콜아웃) / page5(3 복구 경로·external party 별도 복구)
- 신규 entity: 0 (기존 canton-network 엔티티 갱신만). ANSWERED 진전: C02 구체화. C01 메커니즘 보강(수치 open)

## Stage 54 (2026-06-10) — Canton 4 페이지 + wallet/guidance 대조 → C01 ANSWERED + 수탁 통합 핵심 promote
- 계기: 사용자 — what-is-canton · choose-your-path · global-synchronizer/overview · integrations/overview 체크 요청 → integrations 가 안내한 **integrations/wallet/guidance** 추가 fetch
- **C01 ANSWERED**: wallet/guidance 에 문자 그대로 **"Finality usually takes 3-10s."** — verbatim 재확인(별도 prompt 로 WebFetch 요약 주입 아님 검증, evidence isolation 준수). 그간 "검색 요약 only" 로 격리하던 3-10초가 1차 출처로 확정
- 신규 사실:
  - Global Synchronizer = **2/3 majority BFT**(기존 <1/3 fault 와 동치). **Super Validator**(인프라·sequencing·CC 검증·거버넌스) vs **Validator**(party host·검증). 거버넌스 = GSF + Linux Foundation
  - Canton Coin **burn-mint equilibrium**: 수수료 CC 는 소각=유통 제거, validator 는 infra/사용량/liveness 로 mint 보상 → burn 모델 확정
  - **수탁 통합(wallet/guidance)**: 입금 식별 = **memo tag**(`splice.lfdecentralizedtrust.org/reason`), **별도 입금주소 없음**(XRP destination-tag 류) / **party = 계정당 1개, ephemeral 금지**(`name::fingerprint` max185) / 입금 = **"TransferIn"** 이벤트 / API `/v2/interactive-submission/{prepare,execute}`·`/v2/state/{active-contracts,ledger-end}` / 대사는 synchronizer `recordTime` / multi-host party / DevNet·TestNet·MainNet 3환경 / locked UTXO "locked by DSO"
  - choose-your-path 에 EVM 개발자 경로 존재 → 우리 EVM-대비 서술 방식 공식 권장과 일치
- 갱신: source append(섹션 6~10), entity(2/3 BFT·SV/Validator·tokenomics·finality·수탁 통합 Details, last_updated 54), open-questions C01 ANSWERED
- docs-site canton-network: page0/2(2/3 BFT·SV/Validator·finality 3-10초 확정) / page2(party-per-account) / page3(burn-mint) / page4(memo-tag 입금·TransferIn·recordTime 대사) / page5(multi-host·3환경)
- 신규 entity: 0 (canton-network 갱신만). ANSWERED: **C01** (Canton open Q 전부 해소 — A11 만 Fireblocks 매핑으로 open 유지)

## Stage 55 (2026-06-10) — Canton architecture 검증 + 6.수탁통합 페이지 신설
- 계기: 사용자 — overview/learn/architecture 도 promote 됐는지 검증 요청 → 핵심 개념 대부분 기존 promote 와 중복 확인, 소량 신규 2건만 promote
- 신규 2건 (둘 다 개념적, 충돌 없음):
  - **프라이버시 메커니즘 = sub-transaction views**: 트랜잭션이 view 로 분해, 각 party 는 자기 view 만, Synchronizer 는 복호화 안 함(coordination vs storage 분리). 기존 "당사자만 본다" 결론의 메커니즘. party = on-ledger 신원(주소/EOA 해당)
  - **Synchronizer 토폴로지 옵션**: single/multiple/global 구성 지원(본 위키는 global 중심)
  - architecture 페이지에도 finality 수치 없음(일관)
- 사이드바: 사용자 요청으로 **신규 "6. 수탁 통합 — wallet/guidance" 페이지(custody.html)** 신설 — Stage 54 의 wallet/guidance 수탁 사실(memo-tag 입금·party 운용·prepare/sign/execute API·TransferIn·운영·EVM→Canton 체크리스트)을 한 페이지로 통합(요약+딥페이지 링크). 7개 페이지 사이드바에 "F. 수탁 통합" 추가, page0 읽기순서·page5 footer·루트 허브 카드 Pages 6→7 반영
- 갱신: source append(섹션 11), entity(프라이버시 view·토폴로지, last_updated 55), docs-site page2(views 메커니즘·토폴로지 콜아웃) + 신규 custody.html
- check-consistency PASS(7페이지). 신규 entity: 0. Canton open Q: A11 만 open(C01·C02 ANSWERED 유지)

## Stage 56 (2026-06-10) — Canton 6 페이지 추가 검증 → 암호키 모델 등 신규 promote
- 계기: 사용자 무작위 6 링크 검증 요청(core-concepts·how-transactions-work·cryptographic-keys·console-overview·gs-introduction·validator-roles)
- 대조 결과: 핵심 개념 대부분 기존 promote 와 중복(party·validator·synchronizer·ACS·views+2PC·SV/Validator·CC). 모순 없음. finality 수치 6페이지 모두 없음(일관). 신규 4건만:
  - **A 암호키 모델**(cryptographic-keys, 가장 실질적·수탁 직결): namespace root key(namespace=root key hash) / external party 서명키(권장 저장 offline) / node signing key(sequencer 인증·ACS commitment) / encryption key(asymmetric+session symmetric). 저장 옵션 DB/in-memory/offline/KMS. (알고리즘명 없음 — EdDSA 는 fireblocks 근거 유지)
  - **B stakeholder/choice**(core-concepts): stakeholder = signatory+observer, contract immutable(created/archived), choice = consuming(archive)/non-consuming(유지)
  - **C 운영 구체치**: 환경 4단계 LocalNet→DevNet→TestNet→MainNet(DevNet secret 1h·sponsor 제공), validator SLA 99%+·패치 1주/마이너 2주
  - **D Canton Console**: 운영자 CLI(복구·repair), Ledger API 와 별개
- 갱신: source append(섹션 12), entity(암호키·stakeholder/choice·4환경 Details, last_updated 56)
- docs-site: page2(키 모델 표+보관 콜아웃) / page1(stakeholder·choice·immutable) / page5(4환경·SLA·Console) / custody(4환경)
- check-consistency PASS(7페이지). 신규 entity 0. Canton open Q: A11 만 open

## Stage 57-62 (2026-06-10) — docs.canton.network 사이드바 전수 sweep (배치 1~7)
- 계기: 사용자 — "왼쪽 사이드바 전부 재확인". llms.txt 로 500+ 페이지 인벤토리 추출, sources/canton/_coverage.md 체크리스트로 추적. content 페이지 전수 검증 + 신규만 promote, 자동생성 ref 는 표본 후 일괄 범위 밖.
- **Stage 57 (batch1 수탁직결)** 734dc13 — 암호 알고리즘 1차 확정(Ed25519/ECDSA-SHA256/SHA-256) · 외부서명 해시식 · 서명 프로바이더(Fireblocks/Dfns/Blockdaemon) · proof-of-transfer+pruning(UpdateID 영속화) · 거래소 omnibus(treasuryParty, <100 UTXO/transfer)
- **Stage 58 (batch2 운영)** 90bf6fc — root/intermediate 키 계층(root offline/air-gap) · KMS(AWS/GCP/Driver, envelope vs full) · n-of-m multi-sig(3-of-5) · PartyToParticipant permission · 백업 순서·synchronous replication
- **Stage 59 (batch3 개념)** 5bbbd3c — eUTXO·stakeholder 3역할 · divulgence 주의 · trust model(자가호스팅=validator 신뢰 제거) · topology 매핑 정정 · 5-phase lifecycle·decisionTimeout
- **Stage 60 (batch4 개념/토큰)** 8a83c9a — pruning 심화(PQS·ACS commitment·30일) · CNS(이름→party) · 토큰경제 수치(10분 라운드/52,560yr·dev fund 5%·$2.85 liveness·median SV rate) · reassignment scope-out
- **Stage 61 (batch5/6 deep-dive)** 375adb2 — external party 온보딩 API(generate-topology→allocate) · disclosed_contracts · dedup 정정(command ID) · multi-hosting≠multi-sig · Amulet=CC·DSO·Splice
- **Stage 62 (batch7 잔여+API 표본)** — ledger causality(partial ordering·fuzzy time·divulgence 순서무보장 수탁 리스크) · submission_id 재서명 불필요 · **API/stdlib ~370 자동생성 ref 일괄 범위 밖 확정**
- 영향: source(섹션 11~17 append) · entity/canton/canton-network(Key Concepts 대폭 확충, last_updated 62) · docs-site canton-network 전 페이지(page1~5·custody) · _coverage.md 체크리스트
- 신규 entity: 0. Canton open Q: A11 만 open(C01·C02 ANSWERED). 사실 모순 0건, finality 외 추정 promote 0건(evidence isolation 유지)

## Stage 63 (2026-06-10) — docs-site/canton-network 재검토 정리 (구조)
- 사용자 재검토 요청. 자동 점검 PASS·잔재 0·링크 정상 확인. 실질 이슈 2건 수정:
  - model.html: `choice` 정의 한 문단 내 중복 서술 제거
  - validator.html 과적재 해소: sweep 중 2.1(행위자)에 쌓인 키·서명·멀티시그를 **신규 "2.2 키·서명·정족수" 절로 분리**(Synchronizer→2.3, 거래확정→2.4, 확정시간→2.5), 겹치던 키보관 callout 2개→1개 병합, party-per-account 는 2.1 로 이동
- 사실 변경 없음(presentation only), check-consistency PASS

## Stage 64 (2026-06-10) — canton-network 사실 정정: "Nodeinfra" 운영형 예시 제거
- 사용자 지적: NodeInfra 의 NodeWallet 은 Solana 전용(vendors/nodeinfra/nodewallet.md:67 "EVM/BTC 커버 불가") → Canton 미지원인데 page5 "운영형(Nodeinfra)" 로 박은 게 오류. Canton 맥락 Nodeinfra 언급은 Musubi operator 한 줄뿐(모호)
- 정정: page5 제목 "직접 구현 vs 운영형(Nodeinfra)" → **"직접 운영 vs 위탁 운영"**(7 사이드바·h2·title·meta·index 0.4·indexer 다음·루트 허브 카드 일괄), 5.1 bullet 일반화, **"벤더가 Canton 지원하는지 먼저 확인" caveat 추가**(NodeWallet=Solana 전용 명시, Canton 서명 위탁은 Wallet Gateway 서명 프로바이더 Fireblocks/Dfns 가 직접 경로). entity Musubi 라인(Startale+Nodeinfra operator)은 source 충실 인용이라 유지
- evidence isolation: 약근거(Musubi 1줄) 벤더를 수탁 관리형 예시로 단정하지 않음. check PASS

## Stage 65 (2026-06-10) — musubinetwork Custodian Track 검토·promote
- 사용자: musubinetwork 검토. Custodian/Institution Track + why-canton·ethereum-comparison fetch
- Startale·Nodeinfra 역할 재확인: 공식 문구 "operated by Startale and Nodeinfra" 한 줄, **운영 범위 미상**(Canton validator 운영 명시 없음) → Stage 64 정정 타당성 확정, entity Musubi 라인에 "(운영 범위 미상)" 보강
- Canton-레벨 fact promote (Musubi 가 corroborate):
  - **allowance/approve 패턴 없음** — holding 은 owner sole signatory, ERC-20 approve/allowance 부재 → infinite-approval 공격면 구조적 부재(수탁 보안 이점)
  - **named-role 다중서명** — EVM 익명 interchangeable n-of-m 이 아니라 지정 party named-role 서명(DAML choice-level)·순차 rolling approval·maker-checker 암호학적 강제
- Musubi 사례(2차·POC 라벨): delegated custody(institution→custodian, Zodia·KODA 거론, Musubi 자산 미보유=CLS 식), 컴플라이언스-as-precondition(ExecuteSettlement), sub-tx privacy PII 온원장, 실배포 거론(DTCC·Goldman·HSBC·Deutsche Börse·Progmat). **Musubi 도 finality 수치 없음 → C01 재확인**
- 신규 source: musubi-custodian-track(2차 출처·testnet POC 명시). entity source_count 5→6, last_updated 65
- docs-site: operations(allowance/approve 없음 콜아웃) + validator 2.2(named-role/순차/maker-checker 보강)
- evidence isolation: Canton fact vs Musubi 고유설계(4-leg FX DvP·FXOrder·JWT) 분리, 후자는 사례로만

## Stage 66 (2026-06-10) — musubinetwork introduction 링크 전수 promote
- 사용자: introduction 의 모든 링크 promote. introduction outbound = 4개(compliance/compliant-payments·institution/overview·custodian/overview·market-maker/overview) 전수 fetch
- 결과: **새 Canton 프로토콜 fact 없음** — 전부 Stage 65 promote 분(holding sole-signatory·no-allowance, sub-tx privacy, named-role) 재확인 또는 Musubi-FX 앱 고유
- 기록(사례): 참여자 역할, custodian 통합 3 seam(Party ID 백엔드 배포·견적 co-sign·settlement stream→컴플라이언스 bridge), MM 재고 자기 Canton Holding 보유, compliant-payments 5 choice. "~4초 atomic DvP"는 앱 주장이라 Canton finality 로 promote 안 함(C01 유지)
- source 섹션 6 append, entity Musubi 사례에 통합 패턴 1줄 + last_updated 66. docs-site 변경 없음(배포 없음)
- Musubi 검토 최종 종결: Canton-레벨 promote 는 Stage 65, introduction 링크 전수 확인은 Stage 66

## Stage 68 (2026-06-10) — canton-network 가독성 보강(질문 대응): 비교 그림·애니메이션·은행 예시
- 사용자 질문 5건 대응:
  - 0.2 "상태 표현" 의미 불명 → glossary tooltip 추가(원장이 현재 상태를 어떤 자료구조로 저장하나)
  - 0.3 "API 는 누구 것" → Ledger API 노드 라벨 "participant node 가 노출" + 캡션에 명시
  - 원장 모델 어려움 → model.html Figure 1-1(EVM 숫자 vs Canton ACS/Holding 구조 mermaid) + Figure 1-2(순수 CSS 애니메이션: 40 송금 시 EVM 숫자 100→60 vs Canton 조각 [30][20] 소비→거스름 [10] 생성)
  - "조립은 utxos 로" 불명 → 설계 포인트 bullet 평이하게 재서술(판단=available 합계, 조립=조각 골라 씀, 비트코인 coin-select 예)
  - 2.1 셋의 관계 감 안 잡힘 → Figure 2-0 + 국내은행 A ↔ 해외은행 B 예시 + "셋의 관계 한 줄" 콜아웃
- presentation only(사실 변경 없음), check-consistency PASS. model.html 첫 mermaid·애니메이션 도입

## Stage 69 (2026-06-10) — 0. Canton 개요 리뷰: "용어 먼저" 프라이머 추가
- 사용자 리뷰: Canton 모르는 상태에서 party/participant/Synchronizer 가 정의 없이 나와 어려움 + "UTXO 형 holdings"·"contract" 가 뭔지 불명
- 0.1 에 **"먼저 — 용어 6개 (1분)" 콜아웃** 추가: contract(상태 한 조각, created/archived) · ACS(보유 contract 묶음=현재 상태) · holding(UTXO형, 잔액=조각 합) · party(신원) · participant=validator(검증 노드) · Synchronizer(공용 합의). 각 항목에 1·2장 포인터. "구조 요약" 문장을 프라이머 뒤로 배치 + holding tooltip 보강
- presentation only, check PASS

## Stage 70 (2026-06-10) — Confluence export: flowchart 변환 Graphviz → PlantUML
- 사용자 Confluence 이슈 4건(Graphviz): NODE 예약어 충돌·크기 과대·색 없음·선 지저분
- confluence-export.js 의 flowToGraphviz → flowToPlantuml 교체(canton-network + wallet-service-components 동기):
  - alias(n_<id>/cluster_<id>)로 예약어 회피 / scale max 1000·nodesep·ranksep 로 크기 / classDef→노드별 hex 색(#back;line) / skinparam linetype ortho 로 선 정리
  - 부수 버그 수정(기존 Graphviz도 있던): classDef/class 의 `;` 미처리로 색 누락 / 단독 노드선언이 ⚠수동 / cluster id 가 phantom 노드 / A-->B-->C 체인·{decision}·<--> 미지원 → 모두 처리
- node --check + 함수 단위 변환 테스트로 검증(중첩 subgraph·색·체인·cluster 엣지 정상)

## Stage 71 (2026-06-10) — Confluence export: 용어패널 + 네비링크 제거 (사용자 3요청)
1. 미리보기: 렌더링 미리보기는 Confluence 엔진 필요라 미구현(마크업 복사 방식 유지). 다이어그램 PlantUML 서버 미리보기는 외부전송이라 보류(옵션 제안만)
2. tooltip: 변환 때 버려지던 glossary(data-tip)을 모아 문서 끝 {info:title=용어 풀이} 패널로(term — 정의). hover 없는 Confluence 대체
3. 네비 링크: "다음/이전/처음으로 — …" 문단을 변환 시 제거
- canton-network + wallet-service-components 동기, node --check + 정규식 테스트

## Stage 72 (2026-06-10) — Super Validator 명단·거버넌스 1차 확정(Figure 0-1 "실제로 누구")
- 사용자: 0.3 구성도의 각 박스가 어떤 기관인지. canton.foundation(구 sync.global, 301)·press 1차 확인
- 확정: **54 SV 노드**, 거버넌스 **Canton Foundation**(구 GSF, 2025-09-22 개명, Linux Foundation 파트너십 출범). Premier Members: 5North·7Ridge·Broadridge·Cumberland·Gas Station·Digital Asset·Euroclear·Liberty City Ventures·Obsidian Systems·SBI Digital Asset·T-RIZE·Tradeweb. 2025-03-19 Goldman Sachs·HK FMI·Moody's 합류
- 매핑: 초록=우리 은행/수탁사, 파랑=우리/위탁 운영사(서명위탁=Fireblocks/Dfns), 보라=Global Synchronizer, 회색=SV(위 기관들)
- 신규 source canton-foundation-supervalidators(1차). entity(source 6→7, SV 거버넌스 정정, last_updated 72) + docs-site Figure 0-1 "실제로 누구인가" callout
- evidence isolation: SV 명단은 추측 안 하고 1차 확인 후만 기재. 명단/노드수는 시점 가변 명시

## Stage 73 (2026-06-10) — 공식 Canton Wallet SDK(canton-network/wallet) Fireblocks 드라이버 promote
- 사용자: github.com/canton-network/wallet · core/signing-fireblocks promote 여부 → 미promote 였음, 확인 후 반영
- 1차 확정: canton-network/wallet = 공식 **TypeScript** 프레임워크(Wallet Gateway+dApp SDK+Wallet SDK). 서명 드라이버 core-signing-{internal(Ed25519)/participant/fireblocks/blockdaemon}. **core-signing-fireblocks** = SigningDriverInterface(@canton-network/core-signing-lib) 구현, Fireblocks API 서명. 셋업 RSA-4096(FIREBLOCKS_SECRET)·API User(CSR)·API Key — API 인증용(온원장 서명과 별개 층). Wallet SDK = synchronizer 인증·external keypair party allocate·ACS·prepared tx 검증·서명/제출
- 정정: 기존 "Fireblocks Java SDK" → Canton wallet SDK 의 fireblocks 드라이버는 TS
- 신규 source canton-wallet-sdk-github(1차). entity(source 7→8, 서명 SDK 드라이버 bullet, last_updated 73) + custody 6.3(공식 core-signing-* 드라이버·Java SDK 정정)

## Stage 74 (2026-06-10) — canton-network/wallet core 모듈·Gateway·SigningDriverInterface 이어서 promote
- 사용자: 같은 레포 다른 모듈 이어서 확인
- 신규: core 36모듈 중 수탁 관련(acs-reader·ledger-client±types/proto·token-standard±service·tx-parser/visualizer·wallet-auth·wallet-store inmemory/sql·splice·amulet). **서명 드라이버 5종**(internal/participant/fireblocks/blockdaemon/**dfns**+lib+store-sql) — Stage 73 의 4종 표기 보강(dfns)
- SigningDriverInterface = {partyMode, signingProvider, controller(authContext?)→Methods(OpenRPC)} — Fireblocks/Dfns/HSM 구현 지점
- Wallet SDK = @canton-network/wallet-sdk(NodeJS). Wallet Gateway(remote) = RPC 서버 :3030, /api/v0/{dapp,user}, 서명을 드라이버로 라우팅, Postgres(wallet/signing-credential 분리), Canton+CantonTestnet
- source(canton-wallet-sdk-github) 섹션 4 append, entity(드라이버 5종·인터페이스·Gateway·building blocks, last_updated 74), custody 6.3(dfns 추가 + '공식 SDK 가 주는 것' callout)

## Stage 75 (2026-06-10) — signing-fireblocks 구현 코드 + acs-reader 확정
- raw fireblocks.ts: **EdDSA Ed25519**(PublicKeyInformationAlgorithmEnum.EddsaEd25519) + **Fireblocks Raw Signing**(createTransaction operation:'RAW')로 prepared tx hash(content:txHash) 서명, 공개키 getPublicKeyInfo. → "Fireblocks EdDSA Raw Signing" 을 공식 드라이버 코드로 확정(PartyId fingerprint Ed25519 와 정합)
- acs-reader: ACSReader.read()/readJsContracts()/paginated.read(), 필터 templateIds/parties(filterByParty)/interfaceIds, caching. (includeLocked 문서 API 엔 없음)
- token-standard README=TBD, ledger-client README 미노출 — 보류
- source 섹션 5 append, entity(Fireblocks 서명 구현 코드 확정·last_updated 75), custody 6.3 Fireblocks callout 한 줄

## Stage 76 (2026-06-10) — token-standard·ledger-client src 확정 + wallet SDK sweep 종료
- raw src 확인: CIP-0056 interface ID 정확값(Holding/TransferInstruction/TransferFactory/Allocation*/Metadata/MergeDelegation/BatchMergeUtility), token-standard-client=Splice OpenAPI 4종 래퍼(전송/holding 은 registry API 경유), ledger-client=JSON /v2(allocateExternalParty·generateTopology·connected-synchronizers — Stage 61 온보딩 엔드포인트 코드 확정)
- 두 API 면: Ledger JSON /v2(party/user/onboarding/state) + token-standard registry OpenAPI(전송/holding/allocation)
- **wallet SDK sweep 종료**: 수탁/Canton 관련 모듈 전수, 나머지 36모듈 plumbing/codegen 은 범위 밖
- 대부분 기존(Stage 53·61) 코드 확정. 새 개념 없어 docs-site 무변경, source 섹션 6·7 + entity(두 API 면·interface ID, last_updated 76)

## Stage 77 (2026-06-10) — wallet-service-components: Canton 지식으로 정정·크로스링크
- @docs-site/wallet-service-components 점검: Canton 깊이 추가 대신 그동안 확정된 사실로 정정 4건
  - example-fireblocks 14.8: "서명 알고리즘 적용 전 확인" → **EdDSA Ed25519 Raw Signing** 해소(공식 core-signing-fireblocks 드라이버·CC 복구) + 14.8 에 공식 드라이버·canton-network 크로스링크
  - project-structure: 공식 Canton wallet SDK·Gateway 는 **TypeScript(NodeJS)** — JVM 스택은 DAML Java Ledger API(gRPC) 직접/Gateway 별도 (nuance)
  - multichain 2.2 traffic tooltip: "10분 무료 충전" → "20분 window/400,000 byte"
  - multichain·fireblocks: **canton-network 심화 가이드 크로스링크** 추가(기존 없음)
- A11(transactionType↔Fireblocks 상태·timeout)은 여전히 open → "확인 필요" 유지. check PASS

## Stage 78 (2026-06-10) — A11 ANSWERED: Fireblocks Canton transactionType (마지막 Canton open Q 해소)
- 사용자 지목 developers.fireblocks.com/reference/{transaction-objects,monitoring-transaction-status} 확인
- A11 해소: Fireblocks 가 Canton 2-step 을 generic status 로 collapse 안 하고 **전용 transactionType**(OFFER/ACCEPT/REJECT/WITHDRAW/PRE_APPROVAL)로 노출 + traceableId·CantonHashes(offer/accept/reject/withdraw/preApprovalUpdateId, offerUpdateId 로 연결) lifecycle 추적. NetworkStatus(BROADCASTING/CONFIRMING/CONFIRMED/FAILED/DROPPED) 별도. timeout=송신자 WITHDRAW(앱 정책)
- 신규 source fireblocks/2026-06-10__canton-transaction-objects. open-questions A11 ANSWERED, entities/canton/canton-network(A11·2-step bullet·source 8→9·last_updated 78), entities/fireblocks/transaction(A11 ANSWERED), vendors/fireblocks/api A11 ANSWERED
- docs-site: canton-network(operations 3.2·custody 6.3 Fireblocks)·wallet-service-components(example-fireblocks 14.8 '확인 필요'→해소, abstraction 156·256, multichain 90) 의 A11 '미확정' 콜아웃 전부 해소로 갱신
- **Canton open Q 전부 ANSWERED**(A11·C01·C02). check PASS(양 사이트)

## Stage 81 (2026-06-12) — Fireblocks 의 Canton = tag/memo 형 자산 (콘솔 1차 증거 + dev 문서)
- source: 사용자 FB 콘솔 스크린샷(1차 — Canton 자산 PERMANENT ADDRESS+Memo, +Add 로 memo 자동 생성) + developers.fireblocks.com (direct-custody-wallets: 같은 온체인 주소+tag 구분 / create-deposit-address: UTXO·tag 형 전용)
- 함의: issueDepositAddress 의 Canton 동작 = (같은 PartyId, 새 memo) — "발급 없음·memo 는 백엔드" 모델 정정. 발급물 재정의 = 입금 식별자(주소+memo 쌍)
- 영향: entities/canton(Stage 81 블록), wallet-design-walkthrough 0~4p 피벗. 가이드(13.3·9.x·14·15)·스켈레톤 동기화는 NEXT.md 백로그
- 신규 entity: 0 · ⚠️ memo 생성 보장 규칙 미명시 — 통합 테스트 확정 항목

## Stage 80 (2026-06-12) — Musubi institution 측 10페이지 웹 검토 → 승인 2층·상태 모델 promote
- source: musubinetwork.com/institution/* (api-reference·integration 4종·compliance·security·custody-and-trust·settlement-flow·overview) — 웹 확인, ⚠️ 2차·testnet POC·WebFetch 요약 기반
- 신규 fact: 승인 2층(intent_signature=기관 개인키 주문 서명 / custodian co-sign 별도) · 상태 enum(PENDING→QUOTED→EXECUTING→SETTLED + EXPIRED·FAILED, 사유 5종) · cancel=PENDING/QUOTED 만 · 4-leg 경로에 "Musubi 결제 주소" 경유(화이트리스트 대상) · institution 은 custodian Canton 인프라 활용 가능(자체 노드 불요) · kyc_aml_ref 검증 모델 · JP/KR 보고 임계 · Travel Rule 등 roadmap · 페이지 간 불일치 기록(~15초 vs ≈4초, 보존기간)
- 영향받은 페이지: entities/canton/canton-network.md (Stage 80 블록), docs-site/canton-network/integration.html 5.5 (승인 2층·상태 모델·onboarding 부분 확인 — 기존 '미확인' 1건을 '부분 확인' 으로 격하)
- 신규 entity: 0 (canton-network 흡수)

## Stage 79 (2026-06-10) — canton-network 5.5 Musubi 사용 vs 미사용 비교
- 사용자: canton-network 에 Musubi 사용/미사용 정리. page5 에 "5.5 (참고) 응용 네트워크 — Musubi 를 쓸 것인가" 추가(5.1~5.4 노드운영 축과 구분 — 응용 네트워크 합류 축)
- 비교표(무엇·결제 atomic 4-leg DvP·RFQ 유동성·컴플라이언스 on-ledger·수탁/키·통제·범위 VASP FX 특화·성숙도 testnet POC) + 언제 무엇(한일 FX 결제=Musubi, 일반 수탁/전송=직접 Canton). 우리 국내↔해외은행 송금 시나리오와 연결
- 기존 promote 사실(Stage 65 musubi-custodian-track)의 presentation. 2차·POC caveat 명시. check PASS

## Stage 83 (2026-06-24) — 직접 구축 멀티체인 매니저 참조도 catalog (Mode A)
- source: sources/bank/2026-06.md (general-knowledge 다이어그램 — vendor evidence 아님). provenance 헤더 부착(evidence_class·absorption map)
- 흡수: persistence-architecture 02·04·06·07·13 / reference-architecture recurring-patterns·index §3.1 — 전 구성요소(Indexer·Re-org·Nonce·Gas Bump·Adapter·RPC Pool·KMS/Vault Signer)가 기존 direct-build reference 에 이미 존재
- 결정: Mode C(full ingest) 부적합 → Mode A(catalog-only). 신규 fact 0 이라 curated 본문 주입 시 중복 누적 우려 → 본문 미주입, source 라벨 + 본 log 기록만
- 신규 entity: 0 (전량 흡수)

## Stage 84 (2026-06-24) — Canton+Fireblocks Raw Signing 서명 시퀀스 다이어그램 문서화
- 계기: 무스비 PoC 대화에서 "악의적 fund-drain tx 를 byte[] 로 사인하는 게 막아지나" 질문 → external-signing end-to-end 흐름을 mermaid 시퀀스로 정리
- 추가: entities/canton/canton-network.md "### Fireblocks Raw Signing 서명 시퀀스 + fund-drain 방어 (★ Stage 84)" — prepare/execute 분리, 서명 전 tx-decode 검증 박스(fund-drain 방어 지점), Raw/EdDSA Ed25519, TAP 제한 정보, approve/allowance 부재
- 근거: 기존 1차 source 조합(docs-canton-network-renewed wallet/guidance, canton-wallet-sdk-github ★ Stage 73-75, policy.md, ★ Stage 65) — 신규 source 0
- frontmatter last_updated_stage 82→84. 신규 entity: 0
- docs-site 공개: 사용자 명시 지시로 canton-network/custody.html 6.3 에 Figure 6-2(전체 호출 시퀀스) + "blind signing 과 fund-drain — 백엔드 탈취/다중서명 방어" callout 추가. 검증 스크립트 PASS. wrangler deploy(docs-site/, 1 file 변경, 총 287) → https://wiki-docs.pages.dev/canton-network/custody.html
- 보강 사실(백엔드 탈취 single point): 단일 백엔드+Raw Signing 의 신뢰점 한계 → multi-sig n-of-m(★ Stage 58)·독립 승인 평면(policy.md)·결정적 hash 재계산(★ Stage 57)이 본질 방어. approve/allowance 부재(★ Stage 65)로 권한위임형 drain 은 구조적 차단

## Stage 85 (2026-06-24) — Fireblocks-Canton 추가 수집 (Mode B) + C03 negative finding
- 계기: 사용자 "fireblocks canton 자료 좀더 수집". Fireblocks dev docs 인덱스(llms.txt 743행) 전수 → **Canton 전용 dev doc 부재** 확인(1차 기술 출처 = transaction-objects + wallet SDK 가 전부)
- 신규 source 2 (Mode B, sources/canton/): ① 2026-06-24__fireblocks-canton-launch-prnewswire (공지 전문, 발행 2026-02-03 — SV·Trust Company CC 수탁·MPC, node 운영 서술 부재 / CSO·Canton Foundation ED 인용) ② 2026-06-24__fireblocks-ownera-canton-connectivity (발행 2024-11-15 — Ownera 라우터로 FN↔Canton·Corda 토큰자산 유통, 4번째 접점)
- canton-network.md: Stage 82 세 역할 절에 Ownera 별개 접점(★ Stage 85) 추가 · Q-C03 에 negative finding(공개 1차로 답 불가 확정, PoC 테스트로만 해소) · Sources +2 · frontmatter source_count 10→12, last_updated_stage 84→85
- 신규 entity: 0 (canton-network 흡수). docs-site 미반영(curated only)

## Stage 86 (2026-06-25) — NodeWallet Canton 지원 deep-research 반영 (Q-N02)
- 계기: NodeInfra 담당자 "Canton 네이티브 + VerifyVASP Canton 트래블룰" 구두 주장 검증. prompts/collect-nodewallet-canton.md 로 deep-research 실행(99 agent·587 tool·3-vote 검증)
- 결과: **Canton 네이티브·VerifyVASP Canton 트래블룰 모두 공개 1차 미입증(영업화법)**. NodeInfra=Canton 에 NaaS 호스팅으로만 등재(canton.foundation/validators), 공식 custody 디렉터리(cantonecosystem.com) 부재, 자사 홈페이지 Canton/Solana/VerifyVASP 무언급, VerifyVASP=체인 비종속 off-chain 메시징. Solana POC 만 정합
- ★ evidence-of-absence 아님 — closed/gated 라 비공개 PoC 배제 불가, "공개 1차 미입증" 한정
- 부수확 반영: Canton external-signing 프로토콜은 decode+hash 독립 재계산(verified hash-signing, blind 아님)로 문서화 — canton-network.md Stage 84 시퀀스 절에 ★ Stage 86 bullet 추가("프로토콜은 verified, Raw Signing 으로 끼우면 검증 책임이 우리 쪽" 정정). last_updated_stage 85→86
- 반영: vendors/nodeinfra/nodewallet.md Q-N02 부분진전·§제약 caveat·last_updated_stage 51→86. 신규 entity: 0. gated docs.nodeinfra.com 재크롤 안 함(공개 경로만)

## Stage 87 (2026-07-01) — wallet-design-walkthrough Fireblocks 채택 전면 개편 (Canton 제거)
- 계기: 사용자 전제 변경 6건 — ① Fireblocks 채택(자체 매니저 아님) ② FB API confirm↔finality 분리 질문 ③ Canton 은 FB 미지원 → 처음엔 2차 트랙 분리, 이후 "Canton 완전 제거"로 재지시 ④ 지갑백엔드↔블록체인매니저 통로(포트)가 1차 목표 ⑤ Admin/Service 물리 분리 ⑥ 지원 네트워크에 Base 추가
- 새 척추: 지갑 백엔드(Service·Admin 물리 분리, 별도 배포·권한·감사 경계) ↔ Fireblocks 매니저 통로(포트) · 체인 = EVM(이더리움·Base) 단일 · 4분면/자체 매니저/전환 서사 전면 폐기
- confirm/finality (질문 ②, docs-site 반영): FB status BROADCASTING→CONFIRMING(체인 등장·미확정)→COMPLETED(DCCP 임계 도달=finality), numOfConfirmations 로 confirm↔finality 판별, networkStatus 하위값, zero-conf 다중 webhook caveat, reorg=ORPHANED(EVM 속성). 근거: entities/fireblocks/transaction.md(:104-121·:289·:443-460)·reference-transaction-objects.md:151·default-deposit-control-and-confirmation-policy.md (ETC 372·contract call 최소 3·대부분 1)
- 영향: docs-site/wallet-design-walkthrough/ 9페이지 전면 — index·00-cast(앵커, 직접) + 01-03(FB×EVM 단일·Service) + 04(FB webhook+DCCP, DCCP=Admin/webhook=Service) + 05-06(estimateFee·createTransaction·"상태 한 장" FB 리맵·boost/cancel/TAP=Admin) + 07(잔액 3칸→FB finality) + 08("전환"→"확장"·monorepo·인프라 FB-primary·sweep 재프레이밍). 서브에이전트 5그룹 병렬
- 검증 통과: Canton 잔재 0(Canton·PartyId·OFFER/ACCEPT·party·traffic·4분면·전환) · 제목 통일 9/9 · mermaid endpoint 미선언 0 · AWAITING_ACCEPT 0 · Service/Admin 일관(01-03=Service 전용) · 진짜 이모지 0 · § 0 · 깨진 링크·canton-track 링크 0
- 판단 보류 5건(사용자 확인 대기): 07 잠김=lockedAmount+AML frozen 합산 / 03 안티패턴 "벤더 왕복 금지"로 치환 / 01 "비용 0" 헤드라인 제거 / 06 FB 내부 상태명은 대표값("어댑터가 번역") / 08 링크 대상 wallet-service-components 가이드는 옛 모델 가능성(범위 밖)
- 신규 entity: 0. docs-site 미배포(로컬만 — no-auto-deploy)

## Stage 88 (2026-07-02) — open-Q promote: Transactions status 서버측 필터
- source: docs-site 07-balance-history `transactionsOf` 상태별 조회 설계 검토 중 fact query
- 신규 Q: Q-2026-07-02-T01 (List Transactions 가 status 로 서버측 필터를 지원하는가) — 카테고리 **T (Transaction API)** 신설, **즉시 ANSWERED**
- 답 (1차 자료: `fireblocks/fireblocks-openapi-spec` open_api_spec.yml · `GET /transactions`): 서버측 status 필터 지원 = **`status` 단수 파라미터**("filter by one of the statuses"). 함께 before/after(Unix ms)·orderBy(createdAt|lastUpdated)·sort(ASC|DESC)·limit(기본200)·sourceType/destType·assets·txHash. 다중 상태=호출 분리, finality=COMPLETED+numOfConfirmations≥DCCP
- ANSWERED: Q-2026-07-02-T01
- 영향받은 페이지: open-questions/fireblocks.md
- 신규 entity: 0

## Stage 89 (2026-07-02) — wallet-design-walkthrough 정리 + webhook 복구 절 + T02
- 계기: 사용자 리뷰 5건 — ① 1p "무엇·언제"·시그니처 주석·"비교" 섹션 제거 ② 2·3p "정리/식별자의 출처" 재진술 표+뒤 문단 제거(다이어그램 캡션과 중복) ③ `createDepositAddress`/`getDepositAddress` 인자 `ref`→`accountId`(주소는 계정 밑에 생김·FB generateNewAddress 는 vaultAccountId 기준·7p `getBalance(계정)` 과 일관) ④ 7p "두 백엔드가 각각 부른다" 표 제거(위 문단 재진술, note 정보는 문단에 흡수) ⑤ webhook 실패 대응 fact query
- 포트 표면 확정: `ref` 를 받는 동사는 `createAccount` 하나뿐(name=ref get-or-create 지점), 이후 createDepositAddress/getDepositAddress/getBalance/transactionsOf 는 accountId(계정) 기준
- webhook 복구 (fact query, evidence isolation): 4p 에 "webhook 놓쳤을 때 — 재전송·polling·대사 3단" 절 추가. 확정 근거 = ① resend/resend_failed·notifications 이력 endpoint + v2 30일 재전송 창(vendors/fireblocks/api.md Webhooks v2·reference-webhook-v2-migration-guide.md) ② List Transactions `orderBy=lastUpdated`+`after`+status backfill(T01 ANSWERED). 핵심 = 워크스페이스·시간 범위 기준이라 부하가 주소 수 아닌 놓친 tx 수에 비례 + tx id/externalTxId 멱등 upsert
- 신규 Q: Q-2026-07-02-T02 (webhook notifications 조회·재전송의 페이지네이션·rate limit, 대량 실패 시) — open. 페이지네이션·rate limit 수치는 1차 자료 미확인
- ANSWERED: (없음) · 재확인: Q-2026-07-02-T01
- 영향받은 페이지: docs-site/wallet-design-walkthrough/ 01·02·03·04·07 + open-questions/fireblocks.md
- 신규 entity: 0 · docs-site 미배포(로컬만 — no-auto-deploy)

## Stage 90 (2026-07-02) — 인바운드 차단 환경: webhook 불가 → polling primary
- 계기: 사용자 환경 제약 — "webhook 이용 못 하는 조건이 있다, Fireblocks→은행 호출이 안 될 수 있다" (은행·규제망 인바운드 차단)
- 판단: webhook = Fireblocks→우리 인바운드 → 방화벽에 막힐 수 있음. 해법 = 방향 반전, 우리가 Fireblocks 로 나가는 outbound 폴링(GET /v1/transactions, orderBy=lastUpdated+after+status). egress 만 열면 됨
- 근거(1차): webhook 발신 IP=Fireblocks(architecture.md:158) · Customer Egress Plane whitelist(architecture.md:152) · Fireblocks Agent 서명 요청 폴링 선례(architecture.md:319·342) · List Transactions status/커서(T01 ANSWERED). 전송 방향만 push→pull, 상태·확정 판정 동일(감지 지연=폴링 주기)
- 반영: 04-deposit 에 "인바운드를 막는 환경(은행 등)" warn callout 추가 + 복구 절을 "webhook 이 없거나 놓쳤을 때 — polling·재전송·대사"로 재구성(polling=주 경로 겸 백업, resend=webhook 쓸 때만). resend_failed 는 인바운드 막힌 환경엔 무용 명시
- 신규 Q: Q-2026-07-02-T03 (폴링이 webhook 이벤트를 완전 대체하는가 — 초기 INCOMING 감지 시점·approval_status·webhook 전용 이벤트 유무) — open
- ANSWERED: (없음) · 재확인: Q-2026-07-02-T01
- 영향받은 페이지: docs-site/wallet-design-walkthrough/04-deposit + open-questions/fireblocks.md
- 신규 entity: 0 · docs-site 미배포(로컬만 — no-auto-deploy)

## Stage 91 (2026-07-02) — 04-deposit 하단: webhook 없이 폴링 감지 상세 흐름
- 계기: 사용자 지시 — "webhook 사용 못 해"를 가정하고 입금 페이지 하단에 flow 까지 상세 작성
- 추가: 04-deposit "webhook 없이 — 폴링으로 감지하는 상세 흐름" 절 — 커서(lastUpdated) 기반 폴링 루프 sequenceDiagram(페이지네이션·상태 분류·커서 전진·멱등 upsert·reorg) + "루프의 급소" 표(커서/빠짐 방지/페이지네이션/멱등/reorg/감지 지연)
- 설계 요지: 상태 필터 없이 커서로 훑어 모든 전이 수신 → dest 주소를 백엔드 DB 매핑으로 (accountId,asset) 역참조 → CONFIRMING=대기·COMPLETED+임계=가용, 판정 로직은 webhook 과 동일(받는 방법만 다름). 커서는 처리 성공 후 전진 + 경계 겹쳐받기, tx id 멱등 upsert 로 중복 무해. 부하는 주소 수 아닌 갱신 tx 수에 비례
- 미확정 유지: 폴링의 push 이벤트 100% 대체 여부(초기 감지 시점·승인 상태 이벤트) = Q-2026-07-02-T03
- 영향받은 페이지: docs-site/wallet-design-walkthrough/04-deposit
- 신규 entity: 0

## Stage 92 (2026-07-03) — 04-deposit 폴링 흐름: 시간 커서 명시 + 코드 블록
- 계기: 사용자 질문 "마지막 커서가 시간이야?" → 확정: 커서 = lastUpdated(Unix ms) 시간값. 한 줄 명시로 부족, 코드로도 설명 요청
- 추가: 04-deposit 상세 흐름 절에 ① 커서=lastUpdated(Unix ms) 명시 + 같은-ms 경계 → 겹쳐 받기+멱등 서술 ② 폴링 루프 pseudocode 블록(getTransactions orderBy=lastUpdated·after·limit200·sort ASC / 페이지네이션 / 주소 역참조 / CONFIRMING=pending·COMPLETED+임계=available·ORPHANED=revert / maxSeen 커서 성공후 전진 / OVERLAP_MS 겹침)
- 다이어그램 커서 읽기 라인에 (T · Unix ms) 주석
- 미확정 유지: opaque page 커서 제공 여부(주면 같은-ms 경계에서 더 안전) — T02/PoC
- 영향받은 페이지: docs-site/wallet-design-walkthrough/04-deposit
- 신규 entity: 0

## Stage 93 (2026-07-03) — 04-deposit: 폴링 메인·웹훅 서브 재구성 + !dest 로직 정정
- 계기: 사용자 결정 — "우리는 웹훅 안 쓰고 폴링. 폴링 메인, 웹훅 서브" + "우리 주소 아닌 게 올 수 있나?" 질문(코드 !dest 단일 스킵의 오류)
- 재구성(폴링 메인): 무엇·언제=폴링 outbound 감지·webhook 은 보조 명시 / 메인 다이어그램 webhook 시퀀스 → 폴링 워커 시퀀스(POLL→FB 조회, webhook 은 Note 로 보조) / warn callout "인바운드 막는 환경" → 일반 callout "웹훅은 보조 — 왜 폴링이 주 경로인가" / 개요 표 제목·순서 "폴링(주)·웹훅(보조)·대사(안전망)" / 상세 절 제목 "webhook 없이 —" → "폴링 감지 상세 흐름"
- !dest 정정(fact 근거: List Transactions 워크스페이스 스코프·양방향, 8 destination type VAULT_ACCOUNT/EXTERNAL/OTA — api.md:121-132,314,353): 코드·다이어그램에서 단일 `if(!dest)skip` → ① 방향 판정(destination.type=VAULT_ACCOUNT & source≠VAULT_ACCOUNT 만 입금) ② vaultAccountId 로 계정 귀속(주소 문자열 아님) ③ 주소 미매핑(out-of-band)=스킵 아님, 계정 귀속+경보 ④ ORPHANED 되돌림 우선 분기
- 확정 vs 추정: 스코프·양방향·destination type=확정 / "vaultId 귀속+미등록 경보" 분기=설계 권고
- 영향받은 페이지: docs-site/wallet-design-walkthrough/04-deposit
- 신규 entity: 0 · 미배포(로컬만)

## Stage 94 (2026-07-03) — 폴링 메인·웹훅 서브 전 페이지 전파 (00·02·06·07·08)
- 계기: 사용자 "4페이지 기준에 맞춰 반영" — 4p 의 폴링 메인·웹훅 서브 결정이 다른 페이지에 미반영이라 webhook 을 주/유일 경로로 서술한 곳 정정
- 00-cast: 물리 다이어그램 webhook 수신기 → 폴링 워커(POLL), 화살표 FBV→WH(webhook) → POLL→FBV(주기 조회 outbound) + FBV-.->POLL(webhook 보조·옵션), FBV 라벨 "webhook 발신" 제거, 캡션에 폴링 감지 문장 추가, "직접 만드는 것" M3 webhook 수신·정합 → 폴링 감지·정합, 매트릭스 수신·확정 이벤트 표면 webhook → 거래 조회 폴링(webhook 옵션), 구성요소 문장 webhook 수신기 → 폴링 워커
- 08-switch-extend: 인프라 다이어그램 동일 패턴(HOOK=폴링 워커, HOOK→FB outbound + FB-.->HOOK 보조), 모듈 apps/webhook-receiver → apps/poller, "webhook 이 유일한 수신 지점" → "폴링 워커 outbound 조회가 주 수신 경로(webhook 보조)", 문장·캡션 webhook 수신기 → 폴링 워커
- 07-balance-history: "주 경로인 webhook" → "주 감지 경로인 폴링", 표 행 "webhook 보완" → "실시간 감지(주 경로)", table-note "실시간 감지는 webhook 몫" → "폴링이 주 경로", "통지" 표현 3곳 → 조회/폴링/대사 중립화
- 06-withdrawal: 출금 상태 추적 다이어그램 "상태 변화 webhook push" → "폴링으로 조회"
- 02: "webhook 통지 4p" → "입금 감지 4p"
- 변경 불필요 확인: 09(onChainEvent=포트 추상, 폴링으로 채움) · index(webhook 무관) · 상태어휘/DCCP/대사 로직(전송 방향 무관)
- 영향받은 페이지: 00·02·06·07·08 (+ 04 는 Stage 93)
- 신규 entity: 0 · 미배포(로컬만)

## Stage 95 (2026-07-03) — open-Q promote: Vault·Address 생성 API semantics (V01)
- source: docs-site 1·2페이지 createAccount vs createDepositAddress get-or-create 계약 구분 검토 중 fact query
- 신규 Q: Q-2026-07-03-V01 (Vault·Address 생성 API 유일성·멱등·검색) — 카테고리 **V (Vault/Address API)** 신설, open
- 확정 재확인 (wiki): createVaultAccount body(name·customerRefId·hiddenOnUI·autoFuel) · customerRefId=AML 귀속(유니크 아님) · 멱등키는 externalTxId(tx)·webhook 전용, vault/주소 생성엔 없음 · **EVM 1 vault=1 address 단일 강제**(vault-account.md:70-76) · accounts_paged 존재(api.md:288)
- 미확인(openapi-spec 확인 대상): ① createVaultAccount name 중복 거부 여부 ② accounts_paged name/namePrefix 필터 ③ Idempotency-Key 헤더(vault·주소) ④ generateNewAddress EVM 2차 호출 동작 ⑤ EVM 주소 생성 시점(asset 활성화 vs 명시 호출)
- 핵심 발견: get-or-create 계약 차이의 하드 근거 = 벤더 유일성 보장 유무(주소=EVM 1강제 O / vault name=X)
- ANSWERED: (없음) · 영향받은 페이지: open-questions/fireblocks.md
- 신규 entity: 0

## Stage 96 (2026-07-03) — V01 ANSWERED (Vault·Address API 1차 확인) + 1페이지 반영
- source: developers.fireblocks.com llms.txt → api-reference(.md) + fireblocks/fireblocks-openapi-spec open_api_spec.yml (master, 14688행). extract 저장: sources/fireblocks/markdown/2026-07-03__developers-fireblocks-com__vault-address-api-semantics.md
- V01 5개 전부 확정: ① createVaultAccount name=optional·유니크 없음(중복 vault 가능, name=라벨) ② accounts_paged namePrefix 서버측 필터 지원(prefix, 결과 복수 가능) ③ Idempotency-Key POST/PUT·max40·24h·첫 응답 반환(재실행 없음) ④⑤ 주소 발급은 UTXO/Tag ONLY → EVM(account-based) 실패, EVM 단일 주소는 asset wallet 활성화 유래
- 설계 확정: createAccount = Idempotency-Key=f(ref)(24h 재시도 멱등) + DB ref UNIQUE(영구) ; name(namePrefix) 검색은 fallback. createDepositAddress(EVM)=create-address 호출 안 함(활성화 단일 주소 재사용)
- 반영: docs-site 01-create-account 다이어그램(ref 조회→없으면 createVaultAccount+Idempotency-Key→ref UNIQUE 저장→Note) + "한 번만 — 재시도·중복 방어" 결정 callout
- ANSWERED: Q-2026-07-03-V01
- 영향받은 페이지: open-questions/fireblocks.md · docs-site/wallet-design-walkthrough/01-create-account · sources/(신규 extract)
- 신규 entity: 0

## Stage 97 (2026-07-03) — 2페이지 EVM 주소 발급 정정 (활성화 유래) + 00-cast 매트릭스
- 계기: V01 확정 — EVM 은 create-address(generateNewAddress) 호출이 account-based 실패, 단일 주소는 자산 지갑 활성화(POST .../{assetId}, CreateVaultAssetResponse.address)에서 나옴. 2페이지가 generateNewAddress 채번으로 서술돼 있어 정정
- 근거 보강: openapi spec L504(POST .../{assetId}=create vault wallet) + L8756 CreateVaultAssetResponse(address·legacyAddress·tag·activationTxId) → source extract 갱신
- 02-issue-deposit-address: 무엇·언제("채번"→"자산 지갑 활성화해 단일 주소"), h2("없으면 채번"→"없으면 활성화"), 다이어그램(generateNewAddress→자산 지갑 활성화 POST .../{assetId}, Note에 generateNewAddress=UTXO/Tag 전용·EVM 실패 명시, 활성화 응답 address), 캡션 동일 반영
- 00-cast 매트릭스: 입금 주소 생성 표면 generateNewAddress → createVaultAsset(자산 지갑 활성화, EVM=단일)
- 영향받은 페이지: docs-site 02·00-cast · sources extract
- 신규 entity: 0

## Stage 98 (2026-07-03) — createDepositAddress get-or-create 폐기 → create-once 대칭 (2페이지)
- 계기: 사용자 제공 1차 페이지 "Create Vault Wallets" — EVM(account-based no-tag)은 (vault account, 자산)당 주소 1개, 추가는 vault account 추가로만. 주소 생성이 두 작업으로 갈림: createVaultAccountAsset(자산 지갑 생성·응답 address=EVM 주소) vs createVaultAccountAssetAddress(generate_new_address, UTXO·Tag 전용)
- 결론: createDepositAddress(EVM) = createVaultAccountAsset 1회 = create-once(1페이지 createAccount 와 대칭). 반복 조회는 getDepositAddress. "get-or-create" 라벨 폐기
- 소스 저장: sources/fireblocks/markdown/2026-07-03__developers-fireblocks-com__create-vault-wallets.md (1차 페이지) + vault-address-api-semantics.md 에 두 작업 구분 보강
- 2페이지 정정: subtitle·무엇·언제·시그니처·h2·다이어그램·캡션에서 get-or-create 제거 → "자산 지갑 활성화 1회 · Idempotency-Key=f(accountId,asset) · (account,asset) UNIQUE", 1페이지와 대칭. generateNewAddress=UTXO/Tag 다른 작업 명시
- V01 답 #4·5 에 createVaultAccountAsset vs createVaultAccountAssetAddress 구분 + 1차 페이지 출처 보강
- 영향받은 페이지: docs-site 02 · open-questions · sources(신규 1 + 보강 1)
- 신규 entity: 0

## Stage 99 (2026-07-03) — createAccount/createDepositAddress 다이어그램: 있으면 return 명시 (alt/else)
- 계기: 사용자 결정 — 반복 호출 시 "있으면 그대로"는 에러가 아니라 return-existing(멱등). 다이어그램에 명시적 return 화살표로 표현
- 1·2페이지 다이어그램을 alt/else 로: 조회 → [있으면: 기존 값 read-back → BE 반환] / [없으면: 생성·활성화(Idempotency-Key) → UNIQUE 저장 → BE 반환]. 두 create 동사 대칭
- 1페이지 callout 정정: "이중 온보딩은 여기서 거른다" → "중복 row 를 막고, 경합 시 이긴 값을 읽어 그대로 반환(에러 아님)"
- 설계 확정: verb 는 멱등(return-existing), 유일성은 DB 제약이 담당(경합=read-back), 이상 탐지는 상위 업무층. 에러는 같은 키·속성 충돌 시에만(409)
- 영향받은 페이지: docs-site 01·02
- 신규 entity: 0

## Stage 100 (2026-07-03) — 1·2페이지 다이어그램에 복구 fallback 분기 추가
- 계기: 사용자 지시 — 복구 fallback 도 다이어그램에 표현
- 1페이지: "없으면" 분기 안에 중첩 alt — 벤더 복구 확인(accounts_paged·namePrefix=ref) → [있으면: 고아 vault 기존 vaultId 복구] / [없으면: createVaultAccount+Idempotency-Key]. Note 에 "그 밖 갭은 name 검색 복구" 추가
- 2페이지: 동일 패턴 — 복구 확인(vault 자산 주소 조회 addresses_paginated) → [있으면: 기존 주소 복구(활성화됐는데 저장 못 한 경우)] / [없으면: createVaultAccountAsset+Idempotency-Key]. 복구 조회는 확정 endpoint(GET addresses_paginated, api.md:291)라 재활성화 semantics 미확정과 무관
- 두 create 동사 대칭 유지: 조회 → 있으면 return / 없으면 [벤더 복구 → 생성] → UNIQUE 저장 → return
- 영향받은 페이지: docs-site 01·02
- 신규 entity: 0

## Stage 101 (2026-07-03) — 1·2페이지 문구 순화: "복구 확인·고아" → "벤더에 있는지 확인"
- 계기: 사용자 피드백 — 복구/고아 같은 용어 대신 평이하게
- 1페이지: 다이어그램 "복구 확인"→"벤더에 있는지 확인", "고아 vault"→"만들었는데 저장 못 한 경우", "(복구)" 제거, "진짜 신규"→"신규", Note "name 검색 복구"→"name 검색으로 벤더 확인", callout "복구 fallback"→"벤더에 있는지 확인하는 fallback"
- 2페이지: 동일 순화. 04 ORPHANED(고아 블록)·06 중단 복구 책임은 다른 의미의 정당한 용어라 유지
- 영향받은 페이지: docs-site 01·02
- 신규 entity: 0

## Stage 102 (2026-07-03) — 2페이지 본문 정리: 1페이지와 같은 골격으로
- 계기: 사용자 승인 — 부제·시그니처·다이어그램이 이미 말한 무엇·언제 문단 + 긴 캡션 제거
- 제거: 무엇·언제 문단(19행) · 다이어그램 캡션(53행) — create-once/활성화/memoTag/Idempotency-Key/UNIQUE/getDepositAddress 등 전부 부제·시그니처·다이어그램 스텝·Note 와 중복
- 보존(callout "주소의 두 규칙"): ① 추가 주소는 vault account 추가로(EVM 1주소 강제 귀결) ② 감시 등록까지가 발급 — 미등록 주소 입금은 감지 불가·입금 사고 최다 유형
- 결과 골격: 제목 → 부제 → 시그니처 → 다이어그램 → callout → foot (1페이지와 대칭)
- 영향받은 페이지: docs-site 02
- 신규 entity: 0

## Stage 103 (2026-07-03) — 3페이지 본문 정리: 1·2페이지와 같은 골격으로
- 계기: 사용자 승인 — 부제·시그니처·다이어그램과 중복인 무엇·언제 문단 + 캡션 제거
- 제거: 무엇·언제(읽기 전용·저장된 값·생성과 정반대 = 부제·시그니처 중복) · 캡션(저장한 주소 읽기·EVM 주소·memoTag null·벤더 왕복 없음 = 다이어그램 스텝·Note·h2 중복)
- 보존(callout "왜 DB 읽기인가"): 호출 빈도 최다 동사(입금 화면마다) → DB 읽기라 벤더 API 한도·지연에 안 묶임 — 벤더 왕복이면 가장 잦은 호출이 가장 취약한 경로
- 결과 골격: 제목 → 부제 → 시그니처 → 다이어그램 → callout → foot (1·2페이지와 대칭)
- 영향받은 페이지: docs-site 03
- 신규 entity: 0

## Stage 104 (2026-07-03) — getDepositAddress: 없으면 null 반환 명시 (3페이지)
- 계기: 사용자 질문 "읽기 전용인데 없으면 뭘 리턴?" → 결정: null/Optional (에러 아님·몰래 생성 금지)
- 근거: ① 미발급은 정상 상태(자산별 최초 1회 활성화 모델이라 아직 없을 수 있음) — 예외는 불변식 위반에만 ② 읽기가 쓰기 되면 계약·권한 경계 붕괴(read-through 금지) ③ 없을 때의 처리(2p 호출/미지원 안내)는 유스케이스의 업무 결정
- 반영: 시그니처 `→ Address?  // 없으면 null (만들지 않는다 — 생성은 2p)` + 다이어그램 alt(있으면 주소 / 없으면 null·생성 여부는 유스케이스 결정)
- 영향받은 페이지: docs-site 03
- 신규 entity: 0

## Stage 105 (2026-07-03) — 컴포넌트 가이드 13.10: 포트 동사의 반환 계약
- 계기: 사용자 — verb 반환 계약(반복=return-existing·없음=null·예외=불변식 위반만)을 워크스루 밖 어딘가에 기록
- 위치: docs-site/wallet-service-components/abstraction.html 13장에 13.10 신설 (워크스루 3p foot 이 이미 이 페이지를 링크)
- 내용: 3행 계약 표(create 재호출=기존 값 멱등 반환·유일성은 DB UNIQUE·경합=read-back / get 없음=null·read-through 금지·후속은 유스케이스 / 에러=불변식 위반 전용·에러 채널 오염 방지) + 갈림 기준 "없음이 정상이면 null, 없음이 사고면 NotFound"(사전 전량 발급 불변식이면 NotFound) + HTTP null→404 번역은 별개 층
- 영향받은 페이지: docs-site/wallet-service-components/abstraction
- 신규 entity: 0

## Stage 106 (2026-07-03) — 4페이지 리뷰 적용: 중복 축소 + webhook 잔재 정정
- 계기: 사용자 승인 — 증축 과정에서 쌓인 반복(폴링 주·웹훅 보조 4곳, 커서 설명 3곳, 주소 무관 2곳) 정리
- 제거: 무엇·언제 문단(폴링 논리=callout·감지≠확정=confirm/finality callout·인덱서 없음=다이어그램 중복) · 상세 다이어그램 캡션(다이어그램+코드+표와 전면 중복, "webhook 방식과 같다" 낡은 프레임)
- 축소: 메인 캡션 → 유니크 2문장(ERC-20 같은 경로 / 조회라 유실 없음·최종은 대사) · 코드 인트로 한 줄 · "감지 경로" 절 도입의 반복 문장 · table-note 주소 무관 문장(97행에 유지)
- 정정: zero-conf callout webhook 잔재("COMPLETED webhook 을 받았다"→"COMPLETED 를 관찰했다"·폴마다 갱신) · 표 제목 "루프의 급소"→"빠뜨리면 사고 나는 지점"(평이한 한글)
- 유지: confirm/finality·DCCP·reorg·networkStatus·웹훅은 보조 callout(canonical)·3수단 표·코드·급소 표(요약 레퍼런스)
- 영향받은 페이지: docs-site 04
- 신규 entity: 0

## Stage 107 (2026-07-03) — DCCP "설정=Admin" 정정: Support 제출·승인 (셀프서비스 불가)
- 계기: 사용자 지적 — DCCP 는 Admin 이 설정하는 게 아닌데 tooltip 이 "(설정은 Admin)"
- 근거(1차): build-a-custom-deposit-control-and-confirmation-policy.md — "template download → modify → Fireblocks Support 제출 → review/approval/implementation. Customer self-service 불가"
- 정정: DCCP tooltip 3곳(04·06·07) "(설정은 Admin)" → "(커스텀 변경은 Fireblocks Support 제출·승인)" · 04 본문 5곳 — h2 괄호 제거, 절차(템플릿→Support 제출→검토·승인 반영) 명시, "조정 권한과 책임은 Admin" → "어떤 임계를 요청할지는 Admin(운영)"으로 역할 재정의(판단·요청=Admin, 반영=Support)
- 영향받은 페이지: docs-site 04·06·07
- 신규 entity: 0

## Stage 108 (2026-07-03) — 4페이지: "웹훅은 보조" callout + 메인 캡션 제거
- 계기: 사용자 지시 — 웹훅 보조 rationale callout 제거 가능("감지 경로" 표의 웹훅 행과 다이어그램 Note 가 커버), 메인 다이어그램 캡션(ERC-20·조회 유실 없음·대사)은 다이어그램 밑에 어울리지 않음
- 제거: "웹훅은 보조 — 왜 폴링이 주 경로인가" callout · 메인 다이어그램 캡션 전체
- 잔존 커버: 웹훅=보조는 메인 다이어그램 Note + "감지 경로" 표 웹훅 행 / 대사=표 대사 행. ERC-20 같은 주소·같은 경로 fact 는 이 페이지에서 사라짐(필요 시 재배치 후보)
- 영향받은 페이지: docs-site 04
- 신규 entity: 0

## Stage 109 (2026-07-03) — 4페이지: networkStatus callout 제거
- 계기: 사용자 승인 — 검토 결과 ① callout enum(DROPPED·BROADCASTING·CONFIRMING·CONFIRMED·FAILED)에 ORPHANED 가 없어 reorg 본문("networkStatus 가 ORPHANED 로 바뀐다")과 내부 불일치 ② enum 전체 나열은 이 페이지 필요 이상 ③ Base L2 문단은 networkStatus 와 무관한 DCCP 내용(DCCP callout 이 커버)
- 제거: networkStatus callout 통째(2문단). reorg 본문은 유지(상세 다이어그램 ORPHANED 분기·코드 revert·급소 표가 참조하는 load-bearing)
- 잔여 확인 대상: ORPHANED 의 정확한 소속 평면(NetworkStatus enum 5개엔 없음) — 별도 확인 필요 시 open-Q 후보
- 영향받은 페이지: docs-site 04
- 신규 entity: 0

## Stage 110 (2026-07-03) — open-Q promote: ORPHANED 실재 여부 (T04) — fabrication 의심 보고
- 계기: 04 networkStatus callout 검토에서 enum(5값)에 ORPHANED 부재 발견 → 전수 검색
- ★ 발견: ORPHANED 는 4-source(curated·markdown·webpages/sitemap·PDF 파일명) + openapi spec 전부 0건. 우리 docs-site 산출물에만 존재 → 사전학습 지식 혼입(fabrication) 가능성 높음. 사용자에게 정직 보고
- 신규 Q: Q-2026-07-03-T04 (reorg 무효화를 어떤 신호로 노출하는가 — ORPHANED 실재 여부) — open. hypotheses: DROPPED / status FAILED·REJECTED / 별도 이벤트
- 확정 유지: networkStatus 필드 + enum 5값(api.md:136-140) · reorg=EVM 성질
- 후속 후보(승인 대기): docs-site 04·06 등의 ORPHANED 서술을 중립 표현("벤더 무효화 신호 — 확인 중")으로 정정
- 영향받은 페이지: open-questions/fireblocks.md
- 신규 entity: 0

## Stage 111 (2026-07-03) — T03 ANSWERED (문서 대조) + T04 부정 근거 확정
- 계기: 사용자 "확인을 어떻게 해?" → 방법 3층(① 벤더 문서 대조 ② 샌드박스 PoC ③ Support 질의) 중 ①을 즉시 실행
- source: developers.fireblocks.com reference/webhooks-structures-eventtypes-transaction.md · monitoring-transaction-status.md · transaction-objects.md · (로컬) reference-sub-statuses.md. extract: sources/fireblocks/markdown/2026-07-03__developers-fireblocks-com__tx-webhook-events-vs-polling.md
- T03 ANSWERED: tx webhook 5종 중 4종 payload=TransactionDetails(폴링과 같은 객체·승인 상태 포함) → 폴링 대체 성립. 예외 alert.stuck_confirming(ATC 경보)만 webhook 전용 — 폴링의 "오래 CONFIRMING" 검색으로 기능 대체. 감지 시점: EVM=mined·UTXO=mempool(폴링·webhook 동일 기록, 차이=폴 주기)
- T04 부정 근거: networkStatus enum(1차 재확인)·sub-statuses 전체·monitoring 페이지 모두 ORPHANED/reorg 0건 → ORPHANED 부재 확정. 잔여=실제 reorg 신호(PoC/Support 로만 해소)
- 후속 대기: docs-site 04·06 ORPHANED 서술 정정(승인 대기)
- ANSWERED: Q-2026-07-02-T03
- 영향받은 페이지: open-questions/fireblocks.md · sources(신규 extract 1)
- 신규 entity: 0
