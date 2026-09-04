# Open Questions — Fireblocks

원본 자료로 아직 답하지 못한 질문을 모은다. **본문에 추측을 쓰지 말고 여기에 질문으로 적어라.**

## 형식

각 질문은 다음 형식으로 적는다:

```
### Q-YYYY-MM-DD-NNN: <질문>

- **Why it matters**: 왜 이게 중요한가
- **Where this came up**: 어떤 페이지를 작성하다가 막혔는가 (예: vendors/fireblocks/mpc.md)
- **Hypotheses (unverified)**: (선택) 가설을 적되, 반드시 "unverified"임을 명시
- **Sources to check**: 어느 자료를 확인하면 답할 수 있을지 (예: CMP whitepaper, docs.fireblocks.com/...)
- **Status**: open / answered / abandoned
```

## Summary

- **Stage 171** (2026-09-01) — Cold Wallet 공식 문서 Mode C promote. Q-M05·Q-G06 **부분 ANSWERED**. 신규 질문·entity 없음.
- **Stage 173** (2026-09-04) — vault 간 이동의 거래·웹훅 형태 PoC 실측. Q-2026-09-04-T01 등록 즉시 **ANSWERED**. 신규 entity 없음.

- **Stage 1** (2026-05-18) — 13건 추가 (G01–G04, M01–M02, C01–C02, P01–P03, W01, O01)
- **Stage 2** (2026-05-18) — G02 **ANSWERED**; 신규 9건 추가 (L01–L07, M03–M04)
- **Stage 4** (2026-05-18) — C02 **ANSWERED**; 신규 12건 추가 (A01–A07, AU01–AU05)
- **Stage 3** (2026-05-18) — 신규 6건 추가 (D01–D03, O02–O03, W02); W01·M01·M02·L02·O01 등 일부에 cross-ref
- **Stage 5** (2026-05-18) — **W02 ANSWERED**, **D01 ANSWERED**, M03/D02/AU04/M02 partial answered, M01 partial (MPC-CMP 확정); 신규 5건 추가 (D04–D08, P04–P05, O04). **Workspace Management Domain 완성 마일스톤**
- **Stage 6** (2026-05-18) — A06/A07/G03 partial answered; 신규 8건 추가 (S01–S07, O05). 카테고리 **S (Security)** 신설
- **Stage 7** (2026-05-18) — Lightweight blockchain reference ingest (placeholder 전략). 신규 3건 추가 (B01–B03). 카테고리 **B (Blockchain)** 신설
- **Stage 8** (2026-05-18) — 신규 운영 방침 (Source Lake vs Curated Wiki 분리, 5 priority domain, entity 최소화) 적용. **84 PDF** 추가 중 **TIER 1 (4건 deep ingest)** + **TIER 2 (8건 cite + placeholder)** 만 처리. TIER 3 (72건) Source Lake raw 보관.
  - **ANSWERED**: M01 (MPC-CMP 정식 명세), M02 (3-endpoint signing), D04 (3/3 within + 1/N OR), A05 (SGX baseline), A07 (Audit Log no-expire + SIEM API), AU04 (mobile plane Yubikey 5 NFC + biometric)
  - **Partial advanced**: C01 (chain of trust 명세), G01 (Threshold changed audit event 신호)
  - **신규 5건 추가**: S08 (Single-signer SPOF 공식 인정), S09 (DR Service SPOC 경고), S10 (SaaS outage = Hosted MPC 외 signing halt), S11 (Owner Yubikey 강제 전파), S12 (3-region SaaS region-specific outage), S13 (Audit Log Admin-level access), S14 (Mobile device dual-key SPOF). 카테고리 **S 확장**.
- **Stage 9** (2026-05-18) — Transaction domain 36 PDF 추가 중 **TIER 1 (1건 = Transaction lifecycle)** + **TIER 2 (5건 = Primary statuses / Vault Structure BP / Account-wallet / Whitelisting / OTA)** 처리. TIER 3 (30건, 거의 모두 chain-specific fees + UI ops + substatuses) Source Lake raw 보관.
  - **ANSWERED**: W01 (Hot/Cold 직교 + Mainnet/Testnet node 분리), S08 (Azure module 책임 명세 — Auth Engine/Policy Engine TAPs/Secure Vault/Co-Signer Engine + zero-trust)
  - **Partial advanced**: P02 (chain-specific tx 처리 모델), S03 (AML provider 명시 — Chainalysis/Elliptic/Notabene)
  - **신규 0건** — 모든 발견이 기존 Q 응답 또는 기존 entity/hub 흡수. **연속 4 stage (6/7/8/9) 신규 entity 0** 유지.
- **Stage 10** (2026-05-18) — Governance domain 250+ PDF 추가 중 **TIER 1 (6건 deep) + TIER 2 (1 full + 5 meta-only) = 12 ingest**. TIER 3 (~240건, exchange/fiat/Gas Station/Gasless/Smart Transfers/Off Exchange/fees/chain-ops) Source Lake raw.
  - **TIER 1**: Admin Quorum / Approval groups / About Policies / How Policies work / DCCP / FSPM
  - **ANSWERED**: G01 (Admin Quorum threshold 정책 — All/Number + default "All Admins"), G03 (4 UI categories: Sec & compliance / User mgmt / FB Network / External accounts), G04 (멤버십 자동 role-based), L06 (12 assignable actions + 5 Owner-mandatory), S02 (DCCP 정의), S07 (FSPM AI-based attack simulator)
  - **부분 advanced**: P01 (Policy 2-component + 3 action + 5 default rules, parameter table 은 TIER 3 보류), S13 (Security Auditor 가 FSPM access, Audit Log 는 미명시)
  - **신규 0건** — User group 은 별도 entity 만들지 않고 approval-group + policy entity 에 cross-cite 흡수. **연속 5 stage (6/7/8/9/10) 신규 entity 0** 유지.
  - **신규 Risk Q 0건** — Stage 8 의 S08-S14 7건 + 새로 식별된 Risk-G01~G08 8건은 risks.md hub 에 직접 흡수 (Open Q 신설 안 함, 기존 entity/hub 의 risk section 으로).
- **Stage 11** (2026-05-19) — Tokenization 33 PDF cluster catalog-first 처리. 본문 미로드 (catalog only). ANSWERED 0건, 신규 entity 0건, 신규 Q 0건. **연속 6 stage 신규 entity 0**.
- **Stage 12** (2026-05-19) — Backup & Recovery 22 PDF — TIER 1 lightweight index 5건 + TIER 2 placeholder 6건. PDF 본문 미로드 (v3 policy 채택). ANSWERED 0건, 신규 entity 0건. **operating-principles v3 → v3.1** (PDF raw read 중단, TIER 2 placeholder 허용).
- **Stage 13** (2026-05-19) — Fireblocks Developer Docs webpage source 도입. 3 seed page (introduction / api-overview / typescript-sdk) lightweight index + sitemap (29 URLs in-body card). **operating-principles v3.1 → v3.2.1** (Webpage Source 5 원칙). ANSWERED 0건, 신규 entity 0건.
- **Stage 14** (2026-05-19) — AML/Compliance 29 PDF + Cold Wallet 15 PDF cluster catalog-first. TIER 1 lightweight index 8건 (AML 4 + Cold Wallet 4). 본문 미로드. ANSWERED 0건, 신규 entity 0건. **신규 Q candidate 4건 식별** (G05/M05/G06/S15 — 본 stage 에서 정식 등록). **연속 9 stage 신규 entity 0**.
- **Stage 15** (2026-05-19) — `developers.fireblocks.com/llms.txt` URL inventory 716개 추출 (bash pipeline only, 본문 미로드). **operating-principles v3.2.1 → v3.2.2** (대형 텍스트 파일 처리 규칙). sitemap-full markdown 1건 추가. ANSWERED 0건, 신규 entity 0건.
- **Stage 16** (2026-05-19) — Curated Wiki health check + P1/P2/P3 patches. Broken wikilink 3건 정리 + 18 Q status drift sync + section title 정리. 신규 ANSWERED 0건 (재정합만), 신규 Q 0건. **연속 11 stage 신규 entity 0**.
- **Stage 17** (2026-05-19) — P4 (ingest-pdf.md v3.2.2 align) + P6 (Stage 11–15 summary + Q-G05/M05/G06/S15 등록) + P7 (hub anchor 명시). 신규 Q **4건** (G05/M05/G06/S15) 추가. 신규 entity 0건.
- 카테고리: Governance (G), MPC (M), Cosigner/Callback (C), Policy (P), Workspace (W), Operations (O), Lifecycle (L), API (A), Authentication (AU), Device (D), Security (S), **Blockchain (B)**

## 누적 ANSWERED 상태 (Stage 2–10)

> Stage 11–17 은 catalog/maintenance stage — 신규 ANSWERED 없음, Source Lake catalog 확장 + Curated Wiki hygiene 작업만.



- ~~Q-M01~~ **ANSWERED** — MPC-CMP 정식 명세 (`mpc-cmp.md` Stage 8)
- ~~Q-M02~~ **ANSWERED** — 3-endpoint signing (1 customer + 2 Fireblocks cloud)
- ~~Q-M03~~ **ANSWERED** — Cloud key share 분포 (2 in Fireblocks cloud, encrypted backup 별도)
- ~~Q-D04~~ **ANSWERED** — Threshold 3/3 within group + 1/N OR across groups
- ~~Q-D01~~ **ANSWERED** (Stage 5)
- ~~Q-W02~~ **ANSWERED** (Stage 5)
- ~~Q-G02~~ **ANSWERED** (Stage 2)
- ~~Q-C02~~ **ANSWERED** (Stage 4)
- ~~Q-A05~~ **ANSWERED** (Stage 8) — Co-signer = SGX baseline
- ~~Q-A07~~ **ANSWERED** (Stage 8) — Audit Log + SIEM API endpoint
- ~~Q-AU04~~ **ANSWERED** (Stage 8) — Yubikey 5 NFC + biometric, Yubico OTP mode
- ~~Q-W01~~ **ANSWERED** (Stage 9) — Hot/Cold workspace + Mainnet/Testnet node-level 분리 (`account-and-wallet-structure.md`)
- ~~Q-S08~~ **ANSWERED** (Stage 9) — Azure 내 Auth Engine / Policy Engine TAPs / Secure Vault / Co-Signer Engine 각 module 책임 + zero-trust handoff (`transaction-lifecycle.md`)
- ~~Q-P02~~ **부분 ANSWERED** (Stage 9) — EVM blockchain-standard 직렬화 + Solana 5-tx queue + BTC 25-tx chain limit 의 tx 처리 모델 명세
- ~~Q-G01~~ **ANSWERED** (Stage 10) — Admin Quorum threshold 정책 (All/Number + default "All Admins"), 변경 절차 + Owner mandatory + Support escape
- ~~Q-G03~~ **ANSWERED** (Stage 10) — 4 UI categories (Sec&compliance / User mgmt / FB Network / External accounts), 12 assignable actions, permission filter
- ~~Q-G04~~ **ANSWERED** (Stage 10) — Owner/Admin/NSA 자동 멤버 (role-based). Security Admin 의 멤버십 본문/표 불일치는 후속
- ~~Q-L06~~ **ANSWERED** (Stage 10) — 12 assignable actions + 5 Owner-mandatory default actions
- ~~Q-P01~~ **부분 ANSWERED** (Stage 10) — Policy 2 component (Parameters+Actions), 3 action (Allow/Approved by/Block), first-match, 5 default rules. 상세 parameter table 은 TIER 3 보류
- ~~Q-S02~~ **ANSWERED** (Stage 10) — DCCP = confirmation 횟수 정책, inflow/outflow lock state
- ~~Q-S07~~ **ANSWERED** (Stage 10) — FSPM = AI-based attack simulator (Google Gemini private deploy), 6 monitoring 영역, 3-step Agentic Policy Analyzer
- ~~Q-S13~~ **부분 ANSWERED** (Stage 10) — Security Auditor 가 FSPM access role 에 포함 (Audit Log 와 별개 plane), Security Admin 의 plane 은 여전히 미명세

## Key Concepts

- 추측 금지. 모르면 여기에 질문으로 옮긴다.
- 답이 발견되면 해당 위키 페이지에 출처와 함께 반영하고, 여기에는 `Status: answered` + 답을 적은 위키 페이지 링크를 남긴다.

## Details

### Governance

### Q-2026-05-18-G01: Admin Quorum threshold(N of M)는 어떻게 결정·변경되는가?

- **Why it matters**: Quorum 수치에 따라 거버넌스의 단일 실패점·운영 부담이 결정됨.
- **Where this came up**: [[entities/fireblocks/admin-quorum]], [[vendors/fireblocks/user-management]]
- **Sources to check**: Add users 후속 문서, "Admin Quorum" 전용 Help Center article, Quorums settings 가이드
- **Status**: **answered (2026-05-18, Stage 10)**
- **Answer**: Threshold 정책 = **All Admins** (default) 또는 **Number (N of M)** 두 모드. 변경은 **Admin Quorum 자체로 승인** (Owner 필수 참여) + Support escape path 존재. Owner 는 항상 mandatory member. 적용처: [[entities/fireblocks/admin-quorum]] §"Threshold 정책" / "Stage 10 명세". 출처: `admin-quorum.md` (Stage 10).

### Q-2026-05-18-G02: Q+O 라벨의 정확한 의미 — Owner가 Quorum count에 포함되는가?

- **Why it matters**: Add users 본문이 정확한 룰을 명시하는지 확인 필요했음. 다른 Q+O 액션도 같은 룰인지도.
- **Where this came up**: [[entities/fireblocks/admin-quorum]], [[entities/fireblocks/user-roles/owner]]
- **Sources to check**: Add users PDF (Stage 2에서 확인됨)
- **Status**: **answered (2026-05-18, Stage 2)**
- **Answer**: Add user 흐름에서 **"The Owner's approval is mandatory and can count toward the approval threshold"** (`add-users.md`, p.1). 예: threshold 3 of 5일 때 (a) 2 Admins + Owner = 충족, (b) 3 Admins 단독 = Owner 추가 승인 전까지 미충족. 반영 위치: [[entities/fireblocks/admin-quorum]] §"Owner counting rule".
- **Caveat**: 본 룰은 Add user 흐름에서 명시된 것이며, 다른 Q+O 액션(Policy 변경, Admin Quorum 변경 등)에도 일반화되는지는 아직 명시적 확인 없음 → Q-2026-05-18-G05 (추적용 후속 질문)으로 분리 가능. 일단 본 자료에서 다루는 모든 사용자 lifecycle Q 흐름(Add/Edit)에서는 동일 패턴 가정.

### Q-2026-05-18-G03: Approval group과 Admin Quorum의 멤버십·우선순위 관계는?

- **Why it matters**: 위임 그룹과 기본 Admin Quorum의 정확한 관계 + 어떤 영역들이 위임 가능한지 명세.
- **Where this came up**: [[entities/fireblocks/approval-group]], [[entities/fireblocks/admin-quorum]]
- **Sources to check**: Quorums 설정 문서 (Stage 6에서 일부 명세 확인됨)
- **Status**: **answered (2026-05-18, Stage 10)** (Stage 6 partial → Stage 10 complete)
- **Stage 10 Answer**: Approval Group 의 위임 영역은 **4 UI categories** 로 정형화: (1) Security & compliance, (2) User management, (3) Fireblocks Network, (4) External accounts. 각 category 내에서 **12 assignable actions** 가 위임 가능. Approval group → Admin Quorum 우선순위는 first-match (정의된 group 우선 적용). 적용처: [[entities/fireblocks/approval-group]] §"4 UI Categories", [[entities/fireblocks/admin-quorum]] §"Approval Group ↔ Admin Quorum 관계". 출처: `approval-groups.md`, `about-policies.md` (Stage 10).
- **Stage 6 partial (보존)**: 본 자료군에서 **두 위임 메뉴**가 확인됨: (a) `Settings > Quorums > Approval groups`, (b) `Settings > Quorums > Security & compliance` (`allowlisting-ip-addresses-for-console-access.md`, p.2).

### Q-2026-05-18-G04: Admin Quorum 멤버 자격이 자동인지 별도 지정인지?

- **Why it matters**: 권한표 *Participate in the Admin Quorum* 행은 Owner/Admin/NSA/SecAdmin에 ✓ — 4 role 전원이 자동으로 멤버가 되는지, 별도 지정 필요한지 본 자료에 명시 없음.
- **Where this came up**: [[entities/fireblocks/admin-quorum]], [[entities/fireblocks/user-roles/security-admin]]
- **Sources to check**: Admin Quorum 전용 Help Center article
- **Status**: **answered (2026-05-18, Stage 10)**
- **Answer**: **Role-based automatic membership**. Owner / Admin / Non-Signing Admin 은 자동으로 Admin Quorum 멤버. Security Admin 은 권한표 ✓ 와 본문 사이 불일치 — Stage 10 자료(`admin-quorum.md`)는 SecAdmin 의 자동 가입을 명시하지 않음 → 본문/표 불일치는 후속 (`user-roles.md` 본문/표 검증). 적용처: [[entities/fireblocks/admin-quorum]] §"멤버십 — role-based". 출처: `admin-quorum.md` (Stage 10).

### MPC

### Q-2026-05-18-M01: Fireblocks가 사용하는 MPC 프로토콜·share 분포·threshold는?

- **Why it matters**: 자산 통제의 신뢰 모델·복구 가능성·성능 특성이 모두 여기서 결정됨.
- **Where this came up**: [[entities/fireblocks/mpc-key-share]], [[vendors/fireblocks/mpc]]
- **Hypotheses (unverified)**: MPC-CMP 변형일 가능성 (Re-enroll 문서의 Related Articles에 "MPC-CMP rollout for Fireblocks mobile application" 등장; 다음 ingest에서 확인 필요)
- **Sources to check**: Fireblocks MPC-CMP whitepaper, docs.fireblocks.com의 MPC 문서
- **Status**: **answered (2026-05-18, Stage 8)**
- **Answer**: **MPC-CMP (Canetti-Makriyannis-Peled)** 정식 채택 확정. Threshold-ECDSA + DKG (Distributed Key Generation) + non-interactive online signing + proactive refresh. 3-endpoint signing (1 customer + 2 Fireblocks cloud), 단일 endpoint compromise 로 키 누출 불가. 적용처: [[entities/fireblocks/mpc-key-share]] §"MPC-CMP 정식 명세", [[vendors/fireblocks/mpc]] §"Stage 8 — MPC-CMP". 출처: `mpc-cmp.md`, `security-aspects-signing-with-the-fireblocks-mobile-app.md` (Stage 8).

### Q-2026-05-18-M02: Sandbox에서 "backend service takes Owner role"의 보안 모델은?

- **Why it matters**: backend가 Owner 권한을 자동 수행한다면 Sandbox에서 Fireblocks가 보유하는 키 권한 범위가 mainnet/testnet과 다를 가능성.
- **Where this came up**: [[entities/fireblocks/sandbox-workspace]]
- **Sources to check**: Sandbox workspace 전용 docs
- **Status**: **answered (2026-05-18, Stage 8)**
- **Answer**: Sandbox 의 "backend takes Owner role" 은 MPC 3-endpoint signing 의 일반 패턴 안에서 작동 — Fireblocks cloud 가 customer-side endpoint 도 보유하는 형태 (1 customer + 2 Fireblocks 의 customer 자리에 cloud-managed share). 즉 Sandbox 에서는 Fireblocks 가 keep 하는 share 가 mainnet 의 2 cloud 외에 추가 1 share 까지 합쳐 사실상 single-tenant 안에서 모두 보유. 적용처: [[entities/fireblocks/sandbox-workspace]] §"Sandbox MPC 모델", [[vendors/fireblocks/mpc]] §"3-endpoint signing". 출처: `security-aspects-signing-with-the-fireblocks-mobile-app.md` (Stage 8).

### Cosigner / Callback Handler

### Q-2026-05-18-C01: API Co-signer + Callback Handler의 통신 흐름·payload·인증·응답 형식은?

- **Why it matters**: WaaS의 자동화·외부 검증 훅 설계의 핵심.
- **Where this came up**: [[entities/fireblocks/api-co-signer]], [[entities/fireblocks/callback-handler]], [[entities/fireblocks/user-roles/signer]]
- **Sources to check**: docs.fireblocks.com의 Cosigner / Callback Handler reference
- **Status**: **partial advanced (2026-05-19, Stage 24)** (Stage 8 chain-of-trust → Stage 24 payload + URL + key model)
- **Stage 24 Answer**: **Payload format** = JWT (Options 1, 4, 5) vs JSON (Options 2, 3). **Endpoints** = `tx_sign_request` + `config_change_sign_request`. **URL prefix**: `/v2/` for JWT options, no prefix for JSON. **Key model 비대칭**: Co-signer private key 는 global (모든 페어링 API user 의 request 서명 공유), Callback Handler private key 는 per-API-user (RSA 2048). 직접 인용: "The same Co-signer private key is used to sign request messages sent to the Callback Handler server for all API users paired with this Co-signer." 적용처: [[entities/fireblocks/callback-handler]] §"Payload / URL Convention" + §"Key Model 비대칭". 출처: `cosigner-callbackhandler-secure-communication-authentication.md` (Stage 24 Mode C).
- **Stage 8 (보존)**: Chain of trust (Co-Signer cert → CSR → Core Services Intermediate → End cert via Co-Signer Broker), SSL pinning, Aggregator 가 partial signature 결합.
- **잔존**: timeout / retry / idempotency / 실패 시 트랜잭션 처리 / APPROVE/REJECT 외 응답 semantics — 본 자료 외 필요 (`/reference/plugin-based-callback-handler` 또는 `/reference/api-cosigner-troubleshooting` 가 후속 candidate).

### Q-2026-05-18-C02: Fireblocks Communal API Co-signer가 testnet 한정 공유 인프라인가?

- **Why it matters**: NSA가 testnet에서 사용한다는 맥락만 있을 뿐, mainnet과의 차이·공유 인프라 여부가 모호.
- **Where this came up**: [[entities/fireblocks/api-co-signer]], [[entities/fireblocks/user-roles/non-signing-admin]]
- **Sources to check**: Add API users PDF (Stage 4에서 확인됨)
- **Status**: **answered (2026-05-18, Stage 4)**
- **Answer**: **Testnet 전용 공유 인프라 확정**. `add-api-users.md` p.2: "In testnet workspaces, you can select the *Fireblocks Communal Test Co-signer* to verify functionality. If you're using this API user to install a new SGX Co-signer, also select **First user on this machine**." 즉 (a) testnet workspace에서만 옵션으로 나타나고 (b) 검증 목적으로 사용. 반영 위치: [[entities/fireblocks/api-co-signer]], [[entities/fireblocks/cosigner]], [[vendors/fireblocks/cosigner]]

### Policy

### Q-2026-05-18-P01: designated signer / second authorizer의 룰 표현 문법은?

- **Why it matters**: Policy 작성·검토의 기본 어휘.
- **Where this came up**: [[entities/fireblocks/designated-signer]], [[entities/fireblocks/policy]]
- **Sources to check**: TAP / Policy Engine 전용 문서
- **Status**: **partial answered (2026-05-18, Stage 10)**
- **Partial Answer**: Policy = **2 components** (Parameters + Actions). Actions = **3 종류** (Allow / Approved by / Block). 평가 = **first-match**. **5 default rules** 기본 활성. 적용처: [[entities/fireblocks/policy]] §"Policy 2-component + 3 action + 5 default". 출처: `about-policies.md`, `how-policies-work.md` (Stage 10).
- **잔존**: 상세 parameter table (source/destination/amount/asset 등 가능한 필드 enumeration) 은 TIER 3 보류.

### Q-2026-05-18-P02: "internal exchange transfer 제외" 표현의 트랜잭션 타입 정의 위치는?

- **Why it matters**: NSA·Editor의 NS 권한 범위를 정확히 이해하려면 Fireblocks의 트랜잭션 타입 분류표가 필요.
- **Where this came up**: [[entities/fireblocks/user-roles/non-signing-admin]], [[entities/fireblocks/user-roles/editor]], [[entities/fireblocks/transaction]]
- **Sources to check**: docs.fireblocks.com Transactions API reference
- **Status**: **partial answered (2026-05-18, Stage 9)**
- **Partial Answer**: Stage 9 의 `transaction-lifecycle.md` + `primary-transaction-statuses.md` 로 chain-specific tx 처리 모델 명세 — EVM (blockchain-standard 직렬화) / Solana (5-tx queue) / BTC (25-tx chain limit) 등 chain 별 quirk 가 17 status state machine 으로 흡수. 적용처: [[entities/fireblocks/transaction]] §"chain-specific 처리 모델". 출처: `transaction-lifecycle.md`, `primary-transaction-statuses.md` (Stage 9).
- **잔존**: "internal exchange transfer" 의 정확한 타입 정의 (어떤 source/destination 조합) 는 Transactions API reference TIER 3 보류.

### Q-2026-05-18-P03: "Smart transfer ticket"과 "Automation rule"의 정의·차이는?

- **Why it matters**: 권한표에 등장하지만 본 자료에 정의 없음.
- **Where this came up**: [[entities/fireblocks/transaction]]
- **Sources to check**: docs.fireblocks.com의 Smart Transfer / Automation 문서
- **Status**: **partial answered (2026-08-06, Stage 163)**
- **Partial Answer**: Smart Transfer = **Fireblocks Network 위의 티켓 기반 정산**. ticket 에 term(leg) 을 여러 개 달고 양쪽이 이행하면 `fulfilled`. 정산 방식 `ASYNC`(다리별 즉시 전송, 원자적 아님) / `DVP`(Early Access, 스마트컨트랙트 approve 기반). 중개자가 제3자 둘의 티켓을 API 로 열 수 있고 세 당사자가 같은 Network Profile 로 연결돼야 한다. 적용처: [[vendors/fireblocks/api]] §"Smart Transfer — 티켓 기반 정산".
- **잔존**: **Automation rule** 의 정의는 여전히 없음.

### Workspace

### Q-2026-05-18-W01: hot / cold / Sandbox 세 workspace 종류의 비교?

- **Why it matters**: 본 자료는 hot 한정. cold workspace의 role·아키텍처는 별도 article에서 다룸 (p.1). 세 종류를 비교 가능한 자료가 필요.
- **Where this came up**: [[entities/fireblocks/workspace]], [[entities/fireblocks/sandbox-workspace]]
- **Sources to check**: "User roles in cold workspaces" article, Cold/Hot/Sandbox 비교 docs
- **Status**: **answered (2026-05-18, Stage 9)**
- **Answer**: **Hot/Cold workspace** 는 별도 workspace type (separate Account ID + 별도 구매). **Mainnet/Testnet** 은 같은 workspace 내 **node-level 분리**. 두 차원이 직교: hot/cold (workspace 분리) ⊥ mainnet/testnet (node 분리). Sandbox 는 testnet 전용 + Fireblocks backend 가 Owner role 보유 (Q-M02 cross). 적용처: [[entities/fireblocks/workspace]] §"Hot/Cold ⊥ Mainnet/Testnet", [[entities/fireblocks/sandbox-workspace]] §"Sandbox = testnet + backend Owner". 출처: `account-and-wallet-structure.md` (Stage 9).

### Operations

### Q-2026-05-18-O01: TL(Token limits)이 ALGO/XRP/SOL/XLM에만 적용되는 이유는?

- **Why it matters**: 다른 자산의 token wallet 정책이 다른지 확인 필요. 또한 Editor 본문 설명("except for Algorand token wallets") vs 표 라벨(ALGO/XRP/SOL/XLM 4종)의 표현 차이도 확인.
- **Where this came up**: [[entities/fireblocks/user-roles/editor]], [[entities/fireblocks/vault-account]]
- **Sources to check**: docs.fireblocks.com의 token wallet 정책, 자산 지원 매트릭스
- **Status**: open

### Lifecycle (Stage 2에서 추가)

### Q-2026-05-18-L01: "Admin-level users"의 정확한 role 집합 정의는?

- **Why it matters**: Edit users 본문은 actor를 "Admin-level users"라고만 표현하나 정의가 없음. User roles 권한표(`user-roles.md`, p.5)의 *Edit user details*는 O/A/NSA/SecAdmin에 ✓ — 4 role 모두 "Admin-level"인가?
- **Where this came up**: [[entities/fireblocks/user-roles/admin]], [[entities/fireblocks/user-roles/security-admin]], [[vendors/fireblocks/lifecycle-events]]
- **Sources to check**: Fireblocks 용어 정의 페이지, Help Center 글로서리
- **Status**: open

### Q-2026-05-18-L02: Add users 본문은 O/A/NSA만 — 권한표의 SecAdmin Y(Q)와 불일치?

- **Why it matters**: 본문이 narrow하게 쓰여진 것인지, 의도적으로 SecAdmin이 Add 흐름에서 제외되는지에 따라 운영 권한 모델 해석이 달라짐.
- **Where this came up**: [[entities/fireblocks/user-roles/security-admin]], [[vendors/fireblocks/user-management]]
- **Sources to check**: Security Admin 전용 문서, Fireblocks Console 실제 동작
- **Status**: open

### Q-2026-05-18-L03: Add는 mobile approval, Delete는 즉시 — 비대칭의 이유는?

- **Why it matters**: 보안 모델 해석. 보통 destructive op일수록 더 엄격한 승인을 요구하는 게 일반적이지만 Fireblocks는 반대 (Add는 7-day mobile approval, Delete는 console 즉시). 의도된 trade-off가 있을 것.
- **Where this came up**: [[entities/fireblocks/user-roles/owner]], [[vendors/fireblocks/lifecycle-events]]
- **Hypotheses (unverified)**: emergency revoke를 위해 Delete를 빠르게 만들고, recovery(restore)는 없으므로 destructive이지만 audit log 보존으로 사후 추적은 가능 (본 자료의 정황 일치, 명시적 확인 필요)
- **Sources to check**: Security & Maintenance Best Practices 문서
- **Status**: open

### Q-2026-05-18-L04: setup 진행 중에 Edit가 차단되는 동작 이유와 회피 경로는?

- **Why it matters**: 운영 중 race condition / 데이터 일관성. setup이 막혀있는 사용자의 이메일 오타를 어떻게 고칠 수 있는지(또는 setup 완료까지 기다려야 하는지)가 실무에 영향.
- **Where this came up**: [[entities/fireblocks/user]], [[vendors/fireblocks/lifecycle-events]]
- **Sources to check**: Troubleshooting user setup 문서
- **Status**: open

### Q-2026-05-18-L05: deleted user의 user ID 잔존과 email unique 룰의 충돌 — 같은 email로 재추가 가능한가?

- **Why it matters**: 동일 인물을 다른 role로 다시 추가할 수 있는지(role 변경 옵션 A의 핵심)가 결정됨. `delete-users.md` p.1는 "user ID remains in the user list with the status deleted" 명시; `edit-users.md` p.1는 "All users in a workspace must have unique email addresses" 명시. deleted user의 email이 어떻게 처리되는지가 모호.
- **Where this came up**: [[entities/fireblocks/user]], [[vendors/fireblocks/lifecycle-events]]
- **Sources to check**: 실제 Console 동작, Fireblocks Support FAQ
- **Status**: open

### Q-2026-05-18-L06: Approval groups로 add/edit/delete 흐름의 무엇을 customize할 수 있는가?

- **Why it matters**: Approval group은 customize 평면이라 명시되지만 항목 범위가 모호. membership? threshold? Owner 요구 토글? 어떤 작업별로 가능한지가 거버넌스 설계의 핵심.
- **Where this came up**: [[entities/fireblocks/approval-group]], [[entities/fireblocks/admin-quorum]]
- **Hypotheses (unverified)**: Delete users row 사례(`delete-users.md`, p.1–2)에서 보이는 두 토글(Approval permission, Requires workspace owner approval)이 표준이며 모든 User management row에 적용되는 것으로 추정 (확인 필요)
- **Sources to check**: Quorums > Approval groups 전용 문서
- **Status**: **answered (2026-05-18, Stage 10)**
- **Answer**: Approval Group 으로 위임 가능한 작업은 **12 assignable actions** (`approval-groups.md` Stage 10). 그 중 **5 Owner-mandatory default actions** 는 Owner 승인이 항상 필요 (위임 불가능 항목). 위 hypotheses 의 두 토글 (Approval permission + Requires workspace owner approval) 패턴은 12 actions 전체에 일반화됨이 Stage 10 자료로 확정. 적용처: [[entities/fireblocks/approval-group]] §"12 assignable actions + 5 Owner-mandatory". 출처: `approval-groups.md` (Stage 10).

### Q-2026-05-18-L07: Role 변경의 Fireblocks Support 경로 — SLA·처리시간·내부 메커니즘은?

- **Why it matters**: delete+recreate가 detrimental일 때 사용. 어떤 변경 패턴이 Support 경유로만 가능한지·시간이 얼마나 걸리는지가 운영 영향.
- **Where this came up**: [[entities/fireblocks/policy]], [[vendors/fireblocks/lifecycle-events]]
- **Sources to check**: SLA guidelines, Fireblocks Support 절차 문서
- **Status**: open

### MPC (Stage 2에서 추가)

### Q-2026-05-18-M03: cloud-based key shares 외 다른 key share의 분포는?

- **Why it matters**: Delete users는 "Fireblocks deletes the user's cloud-based key shares" — Fireblocks가 cloud에 일부 share를 보유함을 확정.
- **Where this came up**: [[entities/fireblocks/mpc-key-share]]
- **Sources to check**: Recovery Passphrase 문서 (Stage 5에서 수집됨)
- **Status**: **answered (2026-05-18, Stage 8)** (Stage 5 partial → Stage 8 complete)
- **Stage 8 Answer**: Share 분포 = **2 in Fireblocks cloud (active MPC endpoints)** + **1 on customer-held device** (mobile device secure enclave, 또는 Co-signer for API user). Stage 5 의 cloud backup 은 그 위에 layered 된 별도 (passphrase-encrypted backup of mobile share, not an active signing endpoint). 적용처: [[entities/fireblocks/mpc-key-share]] §"Stage 8 — 3-endpoint distribution". 출처: `security-aspects-signing-with-the-fireblocks-mobile-app.md`, `mpc-cmp.md` (Stage 8).
- **Stage 5 partial (보존)**: `recovery-passphrase.md` p.1: "Fireblocks uses the recovery passphrase to create an encrypted backup of the mobile device's private key share, which is stored securely in Fireblocks' cloud servers." Primary host는 mobile device의 secure enclave. iCloud/Google Cloud 백업은 없음 (`about-the-fireblocks-mobile-app.md`, p.1).

### Q-2026-05-18-M04: MPC key share derivation(Add 시점)의 cryptographic 메커니즘은?

- **Why it matters**: signing role의 새 user 추가 시 Owner가 별도로 승인하는 "derivation"의 실제 절차(round, 시간, 실패 처리, replay 보호 등)가 보안에 영향.
- **Where this came up**: [[entities/fireblocks/mpc-key-share]], [[entities/fireblocks/user-roles/owner]]
- **Sources to check**: MPC-CMP whitepaper, Initial user setup 문서
- **Status**: **partial-answered (2026-08-05, Stage 161)**
- **Stage 161 partial answer (Fireblocks 담당자 확답)**: 시점·선행조건 확정 — 디바이스 합류 시 key share 발급, Owner 명시 승인 선행, 동일 master seed 기반(마스터 키·주소 불변). 암호학적 절차(round·시간·실패 처리·replay 보호)는 여전히 미답. 재수행(리허설) 가능 여부도 미답 — 재문의 대상. 적용처: [[vendors/fireblocks/mpc]] §"키 생성(DKG) 시점", [[entities/fireblocks/mpc-key-share]].

### API (Stage 4에서 추가)

### Q-2026-05-18-A01: "Admin-level users"가 API user rename·re-enroll에도 등장 — Q-L01과 같은 정의 집합인가?

- **Why it matters**: Edit users / Re-enrolling API users / Rename and delete API users 본문 모두 "Admin-level users"라는 표현 사용. 정의 일관성이 없으면 권한 모델 해석이 흩어진다.
- **Where this came up**: [[entities/fireblocks/api-user]], [[vendors/fireblocks/lifecycle-events]]
- **Sources to check**: Fireblocks 용어 정의, Help Center 글로서리
- **Status**: open

### Q-2026-05-18-A02: API user unpair(Co-signer로부터 분리) 절차는?

- **Why it matters**: Rename and delete API users 문서가 "Unpairing is a separate operation"이라 명시하지만 절차는 없음. API user 삭제 후에도 Co-signer 측에 잔존하는 페어링 상태가 보안·운영에 영향.
- **Where this came up**: [[entities/fireblocks/api-co-signer]], [[entities/fireblocks/cosigner]]
- **Sources to check**: Co-signer 운영 가이드
- **Status**: open

### Q-2026-05-18-A03: API key/CSR의 만료·rotation·grace period 정책은?

- **Why it matters**: Add API users는 발급만 다루고 lifecycle 시간 제약은 없음. enterprise 운영에 중요.
- **Where this came up**: [[entities/fireblocks/csr]], [[entities/fireblocks/api-key]]
- **Sources to check**: API 보안 가이드, Developer Center 문서
- **Status**: open

### Q-2026-05-18-A04: Co-signer Callback Handler의 "authentication method"는 어떤 종류가 있는가?

- **Why it matters**: Re-enrolling API users는 "switching the authentication method"가 재등록 트리거임만 명시하고 종류는 없음. (JWT/JWS/HMAC 등?) Callback Handler payload 명세의 일부.
- **Where this came up**: [[entities/fireblocks/callback-handler]], [[vendors/fireblocks/callback-handler]]
- **Sources to check**: Callback Handler 구현 가이드
- **Status**: **answered (2026-05-19, Stage 24)**
- **Answer**: **5 named authentication options** — (1) Public key authentication (JWT, RSA 2048 양방향 서명), (2) Self-Signed Certificate pinning (JSON payload, TLS cert pin), (3) Root-CA Certificate (JSON, Root-CA TLS validation, **v2025.12.11+**), (4) Hybrid — Public key + Cert pinning (JWT + cert TLS, **v2025.12.11+ SGX only**), (5) Hybrid — Public key + Root-CA (JWT + Root-CA TLS, **v2025.12.11+ SGX only**). 적용처: [[entities/fireblocks/callback-handler]] §"Authentication Options" + [[vendors/fireblocks/callback-handler]] §"5 Authentication Options matrix". 출처: `cosigner-callbackhandler-secure-communication-authentication.md` (Stage 24 Mode C).
- **Caveat (H-X1 hypothesis)**: Options 4/5 의 "SGX cosigner only" 제약이 AWS Nitro Co-signer (Stage 19) 에 미지원 의미하는지는 본 source 만으로 단정 불가. `install-api-cosigner-aws` 추가 promote 필요.

### Q-2026-05-18-A05: SGX Co-signer와 일반 API Co-signer의 차이·신뢰 모델은? "First user on this machine"의 함의는?

- **Why it matters**: SGX는 TEE(Trusted Execution Environment)의 한 형태. 일반 Co-signer와 신뢰 모델·키 보관 방식이 다를 가능성. "First user on this machine"이 SGX 머신 단위 초기화 표식인 듯한데 확인 필요.
- **Where this came up**: [[entities/fireblocks/api-co-signer]], [[entities/fireblocks/cosigner]]
- **Sources to check**: API Co-signer 배포 가이드, SGX 관련 release notes
- **Status**: **answered (2026-05-18, Stage 8)**
- **Answer**: **API Co-signer = Intel SGX baseline 확정** (별도 "SGX vs non-SGX" 분리 없음). SGX enclave 가 key share 보관 + signing ceremony 수행, host OS 가 compromise 되어도 key 누출 불가. "First user on this machine" 은 SGX enclave 의 초기 provisioning 절차의 anchor (machine-level 키 첫 등록). 적용처: [[entities/fireblocks/api-co-signer]] §"SGX baseline", [[vendors/fireblocks/cosigner]] §"SGX 모델". 출처: `intel-sgx-secure-environments.md` (Stage 8).

### Q-2026-05-18-A06: API user IP allowlist `/32 CIDR` 한정 — 기업 NAT/VPN 운영 노하우는?

- **Why it matters**: range 미지원이 명시되어 있는데 NAT/VPN/cloud egress 환경에서는 `/32` 단위 등록이 까다로움. 변경 시 Owner 단독 권한이라 운영 부담.
- **Where this came up**: [[entities/fireblocks/ip-allowlist]]
- **Sources to check**: Console IP allowlist 자료 (Stage 6에서 수집됨)
- **Status**: **partial answered (2026-05-18, Stage 6)**
- **Partial Answer**: Stage 6 자료(`allowlisting-ip-addresses-for-console-access.md`, p.1–2)로 **Console IP allowlist는 별개 평면**임이 확정. **Console allowlist는 CIDR + range 모두 지원**하므로 NAT/VPN 운영이 더 용이. API user IP allowlist는 여전히 `/32` only로 엄격. 두 평면 비교는 [[entities/fireblocks/ip-allowlist]] §"Stage 6 — 두 평면 분리". 두 평면의 운영 정책을 별도로 평가 필요. 자체 운영 노하우(NAT 환경에서 `/32` 다수 관리 등)는 본 자료에 없음 — 잔존.

### Q-2026-05-18-A07: API user의 audit log 조회·내보내기 표면은?

- **Why it matters**: Delete 시 audit logs에 activity 보존이라 했으나 조회·내보내기 표면(API endpoint, retention 등)이 본 자료에 없음. 컴플라이언스 요건과 연결.
- **Where this came up**: [[entities/fireblocks/api-key]], [[vendors/fireblocks/compliance]]
- **Sources to check**: Audit logs API reference (Stage 6에서 부분 명세 확인)
- **Status**: **answered (2026-05-18, Stage 8)** (Stage 6 partial → Stage 8 complete)
- **Stage 8 Answer**: Audit Log 정식 명세 (`audit-log.md` Stage 8) — **no-expire 영구 보존**, 20+ event category enumeration, Settings > Audit log 에서 view/filter/export, **Fireblocks API endpoint 통해 외부 SIEM (Splunk/Datadog) forwarding 가능**. Access 권한: **Owner / Admin / Non-Signing Admin only**. 적용처: [[vendors/fireblocks/security]] §"Stage 8 — Audit Log 정식 명세", [[vendors/fireblocks/compliance]] §"Audit Log 흐름". 출처: `audit-log.md` (Stage 8).
- **Stage 6 partial (보존)**: `security-checklist.md` p.2 — "Security audit log: Log, track, audit, and **export** your workspace events." 즉 export 기능 존재 확정. `allowlisting-ip-addresses-for-console-access.md` p.3 — IP allowlist events도 audit log에 기록.

### Authentication (Stage 4에서 추가)

### Q-2026-05-18-AU01: Auth0가 SSO callback의 service provider — Fireblocks 인증이 Auth0에 위임된 구조의 운영·장애 영향은?

- **Why it matters**: `auth0.com` authorized domain, `auth.fireblocks.io/login/callback` callback URL이 모든 IdP 공통. Auth0 장애 시 Fireblocks Console 로그인 전체 영향 가능성.
- **Where this came up**: [[entities/fireblocks/sso]], [[vendors/fireblocks/authentication]]
- **Sources to check**: 운영 best practices, status.fireblocks.com 과거 인시던트
- **Status**: open

### Q-2026-05-18-AU02: ADFS/LDAP은 왜 Fireblocks Support 경유만 가능한가?

- **Why it matters**: 다른 6 IdP는 self-setup인데 두 IdP만 Support 의존. 기술적 제약(legacy protocol)인지, 정책(SLA·전담 검증) 때문인지에 따라 enterprise 채택성에 영향.
- **Where this came up**: [[entities/fireblocks/sso]]
- **Sources to check**: Fireblocks Support 안내, IdP 관련 release notes
- **Status**: open

### Q-2026-05-18-AU03: SSO domain 기반 authorization과 workspace user list가 정확히 어떻게 연결되는가?

- **Why it matters**: Configure SSO 문서는 "SSO only affects login authorization"이라 강조하면서 domain authorize를 설명. domain만 일치하면 누구나 로그인 가능한 게 아닐 텐데(workspace user list가 별도 평면) 정확한 연결 메커니즘 명세가 없음.
- **Where this came up**: [[entities/fireblocks/sso]], [[entities/fireblocks/console-user]]
- **Sources to check**: SSO 통합 가이드, Auth0 + Fireblocks 구성 문서
- **Status**: open

### Q-2026-05-18-AU04: 2FA는 TOTP만 — WebAuthn / FIDO2 / hardware key 지원 여부는?

- **Why it matters**: Manage your 2FA는 TOTP만 명시. enterprise는 FIDO2/hardware key 요구가 일반적.
- **Where this came up**: [[entities/fireblocks/2fa]], [[entities/fireblocks/mobile-device]]
- **Sources to check**: "Mobile authentication methods" (Stage 5에서 수집됨)
- **Status**: **answered (2026-05-18, Stage 8)** (Stage 5 partial → Stage 8 complete)
- **Stage 8 Answer**: **Yubikey 5 NFC + biometric, Yubico OTP mode** 정식 명세 (`fireblocks-yubikey-authentication.md` Stage 8). Mobile plane 에서 Yubikey 가 biometric 의 alternative + Owner Yubikey 채택 후 "all users added afterward" 도 Yubikey 강제 전파 (→ Q-S11). Console 로그인 plane 의 FIDO2/WebAuthn 직접 지원은 여전히 본 자료에 명시 없음 (Yubikey 5 NFC 가 FIDO2 hardware key 이므로 effective 지원). 적용처: [[entities/fireblocks/2fa]] §"Yubikey 5 NFC", [[entities/fireblocks/mobile-device]] §"Yubikey 인증 plane". 출처: `fireblocks-yubikey-authentication.md` (Stage 8).
- **Stage 5 partial (보존)**: Yubikey 지원 확정 (`mobile-authentication-methods.md`, p.1) — Mobile app의 device-level 인증에서 built-in biometric의 alternative로.

### Q-2026-05-18-AU05: 비밀번호 정책 (length / complexity / rotation / lockout)은? SSO 미사용 사용자에 어떤 룰이 적용?

- **Why it matters**: Reset your password는 self-service flow만 다룸. 룰셋은 별도 문서 필요.
- **Where this came up**: [[entities/fireblocks/console-user]], [[entities/fireblocks/sso]]
- **Sources to check**: Security & Maintenance Best Practices
- **Status**: open

### Device (Stage 3에서 추가)

### Q-2026-05-18-D01: 6-digit PIN과 mobile app passphrase의 관계는?

- **Why it matters**: 두 비밀이 별개 layer인지 한쪽이 다른쪽의 표면인지 모호.
- **Where this came up**: [[entities/fireblocks/mobile-device]]
- **Sources to check**: "Mobile authentication methods" 문서 (Stage 5에서 수집됨)
- **Status**: **answered (2026-05-18, Stage 5)**
- **Answer**: **세 별개 layer**. (1) 6-digit PIN = mobile app 로컬 잠금/액션 인증, (2) Mobile app passphrase = 권한표 role별 요구 (Owner/Admin/Signer/SecAdmin), (3) Recovery passphrase = cloud backup 암호화 키. `device-migration.md` p.2의 export 절차에서 PIN + passphrase + biometric이 모두 별도 입력되어 세 layer가 동시 존재함을 직접 확인. 적용처: [[entities/fireblocks/mobile-device]] §"3 비밀 layer".

### Q-2026-05-18-D02: Linked users / linked workspaces의 정확한 격리 모델은?

- **Why it matters**: 각 user-workspace 페어의 MPC share·passphrase가 어떻게 격리되는지.
- **Where this came up**: [[entities/fireblocks/mobile-device]], [[entities/fireblocks/console-user]]
- **Sources to check**: "Linked users - Fireblocks mobile app" 문서 (Stage 5 수집됨)
- **Status**: **partial answered (2026-05-18, Stage 5)**
- **Partial Answer**: UI 격리는 명확 (`linked-users-fireblocks-mobile-app.md`, p.1–2). User별 cryptographic 독립 확정 — `recovery-passphrase.md` p.2에서 각 linked user가 다른 recovery passphrase 가질 수 있고 verify 결과가 user별 다름 (Verified / Incorrect / Inactive). Periodic Verification 알림은 device 단위 1회로 전체 linked user 검증.
- **잔존**: 디바이스 자체 compromise 시 모든 linked user/workspace에 동시 영향인가? (secure enclave 보호의 한계는 본 자료에 없음)

### Q-2026-05-18-D03: Mobile device 재등록 후 2-day window 만료 시 동작은?

- **Why it matters**: signing role 사용자의 device 재등록 → Owner의 MPC 재승인 2일 + 사용자 MPC 등록 2일이라는 2단계 windowing이 있으나, 각 단계 만료 시 동작(처음부터 재시작? Owner 재요청 필요? 사용자 비활성?)이 본 자료에 없음.
- **Where this came up**: [[entities/fireblocks/mobile-device]], [[entities/fireblocks/mpc-key-share]]
- **Sources to check**: Troubleshooting user setup, "API user stuck in Pending Setup status" (API 측 유사 패턴)
- **Status**: open

### Operations (Stage 3에서 추가)

### Q-2026-05-18-O02: "Owner 부재"의 정의·Fireblocks Support의 검증 기준은?

- **Why it matters**: `transfer-workspace-owner.md` p.1은 "If the current Owner cannot participate"라 함. 사망 / incapacitated / uncooperative / unreachable 등 다양한 상황이 가능하고, 검증 기준에 따라 board resolution path 발동의 안전성이 다름.
- **Where this came up**: [[entities/fireblocks/user-roles/owner]], [[vendors/fireblocks/risks]]
- **Sources to check**: Fireblocks Support 절차 가이드, SLA 문서
- **Status**: open

### Q-2026-05-18-O03: Board resolution의 형식 요건은? Stakeholder quorum의 정의는?

- **Why it matters**: 신임 Owner 임명을 위한 보드 결의의 형식·인증·필요 quorum이 명시되지 않음. 이는 enterprise governance에 직접 영향.
- **Where this came up**: [[entities/fireblocks/user-roles/owner]], [[vendors/fireblocks/risks]]
- **Sources to check**: Security & Maintenance Best Practices, enterprise onboarding 가이드
- **Status**: open

### Workspace (Stage 3에서 추가)

### Device (Stage 5에서 추가)

### Q-2026-05-18-D04: Cloud backup of MPC key share — Fireblocks가 decrypt 가능한가? threshold 참여 가능한가?

- **Why it matters**: `recovery-passphrase.md` p.1는 Fireblocks cloud에 mobile device key share의 encrypted backup이 있음을 확정. recovery passphrase는 user-held secret이지만 Fireblocks가 자체로 decrypt할 수 있는지(키 보관 정책), 또는 cloud share가 signing ceremony의 threshold에 참여 가능한지가 신뢰 모델 핵심.
- **Where this came up**: [[entities/fireblocks/mpc-key-share]], [[entities/fireblocks/recovery-passphrase]], [[vendors/fireblocks/mpc]]
- **Sources to check**: MPC-CMP whitepaper, MPC 아키텍처 문서
- **Status**: **answered (2026-05-18, Stage 8)**
- **Answer**: Threshold 룰 = **3/3 within group + 1/N OR across groups**. Cloud backup 은 passphrase-encrypted 라 Fireblocks 단독 decrypt **불가** (recovery passphrase = user-held secret). Backup share 는 active signing ceremony 의 threshold endpoint 가 아니며, recovery 시나리오에서만 복호화. 적용처: [[entities/fireblocks/mpc-key-share]] §"Threshold rule + Cloud backup decryption". 출처: `mpc-cmp.md`, `recovery-passphrase.md` (Stage 8).
- **Related**: Q-M01 (전체 MPC 프로토콜)

### Q-2026-05-18-D05: Device migration의 admin approval bypass 거버넌스는?

- **Why it matters**: `device-migration.md` p.1 명시적 security warning. Owner가 enable/disable 가능하다는 점이 유일한 거버넌스 통제. 강제 disable의 적용 시점, audit log 기록, role별 enable 가능 여부 등이 미명세.
- **Where this came up**: [[entities/fireblocks/mobile-device]], [[vendors/fireblocks/risks]]
- **Sources to check**: Workspace settings administration 문서
- **Status**: open

### Q-2026-05-18-D06: Periodic Passphrase Verification — 강제 가능한가? 외부 SIEM forwarding 가능한가?

- **Why it matters**: `recovery-passphrase.md` p.2–3 — 월 1회 알림이지만 dismiss 가능. 컴플라이언스 환경에서 강제 검증·외부 시스템 알림이 필요할 수 있음.
- **Where this came up**: [[entities/fireblocks/recovery-passphrase]], [[vendors/fireblocks/risks]]
- **Sources to check**: Security & Maintenance Best Practices
- **Status**: open

### Q-2026-05-18-D07: Workspace Keys Recovery (full private key reconstruction) — 자세한 절차는?

- **Why it matters**: `recovery-passphrase.md` p.4의 세 번째 recovery scenario. Full private key 재구성이라는 표현이 등장하지만 절차·참여자·결과물의 형태가 본 자료에 없음.
- **Where this came up**: [[entities/fireblocks/workspace-keys-backup]], [[vendors/fireblocks/mpc]]
- **Sources to check**: "About Backup and Recovery", "Reconstructing your workspace" 문서
- **Status**: open

### Q-2026-05-18-D08: Risk-flagged transactions — 기준·종류는?

- **Why it matters**: `batch-approvals-and-signing.md` p.2는 risk-flagged transaction을 batch에서 제외. `new-mobile-experience-request-management.md` p.4는 dismiss 불가 항목으로 분류. 어떤 룰·시그널이 flag를 trigger하는지 본 자료에 명시 없음.
- **Where this came up**: [[vendors/fireblocks/mobile-app]]
- **Sources to check**: Transaction risk 관련 문서, Policy Engine
- **Status**: open

### Policy (Stage 5에서 추가)

### Q-2026-05-18-P04: "Approve" amount cap / one-time address enable 등 workspace settings의 정확한 의미·룰 표현은?

- **Why it matters**: `fireblocks-mobile-app-signing-and-approving.md` p.3에 workspace settings 승인 항목으로 등장. 각 setting의 정확한 동작·표현 문법이 본 자료에 없음.
- **Where this came up**: [[entities/fireblocks/policy]]
- **Sources to check**: Policy Engine reference, Settings & Configuration
- **Status**: open

### Q-2026-05-18-P05: "Long processing transfers" (multi-input) — 정확한 정의·사례는?

- **Why it matters**: `batch-approvals-and-signing.md` p.6 (v3.5.0+) — multi-input transfer가 추가 처리 시간을 요구한다는 표현. 어떤 트랜잭션이 multi-input인지 (UTXO 모델? batched send?)가 본 자료에 없음.
- **Where this came up**: [[vendors/fireblocks/mobile-app]], [[entities/fireblocks/transaction]]
- **Sources to check**: Transaction types reference
- **Status**: open

### Operations (Stage 5에서 추가)

### Q-2026-05-18-O04: "Off-exchange policy" / "DRS finalization" — dismiss 불가 요청 유형 — 별도 흐름인가?

- **Why it matters**: `new-mobile-experience-request-management.md` p.4 — dismiss 불가 항목에 "off-exchange policy requests"와 "DRS finalization requests"가 등장. 본 자료군에 두 흐름의 상세 명세 없음.
- **Where this came up**: [[vendors/fireblocks/mobile-app]]
- **Sources to check**: Off-exchange · DRS 관련 별도 문서
- **Status**: open

### Security (Stage 6에서 추가)

### Q-2026-05-18-S01: Auto-passphrase의 cryptographic 메커니즘은?

- **Why it matters**: `security-checklist.md` p.1는 manual entry 대체 옵션으로 RSA-encrypted auto-passphrase 명시. RSA key 형식·길이·storage 정책·Fireblocks 측 access policy가 신뢰 모델의 핵심.
- **Where this came up**: [[entities/fireblocks/recovery-passphrase]], [[vendors/fireblocks/security]], [[vendors/fireblocks/risks]]
- **Sources to check**: Auto-passphrase 전용 docs (Support enable 안내 자료)
- **Status**: **partial signal (Stage 31)**
- **Stage 31 partial signal**: `recovering-private-key-material.md` reconstruction 절에서 auto-passphrase variant 식별 — **2-key cryptographic system**: (a) mobile share 의 passphrase (auto-generated), (b) 그 passphrase 자체를 암호화하는 **별도 RSA keypair**. Reconstruction 시 추가 field 등장 ("Auto-Generated Passphrase Private Key" = 별도 RSA private key file). 즉 auto-passphrase 는 mobile passphrase 와 그 passphrase 의 RSA encryption keypair 두 plane 의 nested cryptographic structure. 적용처: [[entities/fireblocks/workspace-keys-backup]] §"Stage 31 — Auto-Passphrase Variant".
- **잔존**: passphrase **generation algorithm** / **entropy source** / **where stored** (Fireblocks 측 access 가능성) — 본 자료에 명시 없음, Auto-passphrase 전용 docs 또는 Support enable 안내 자료 필요.

### Q-2026-05-18-S02: Deposit Control and Confirmation Policy의 정확한 동작은?

- **Why it matters**: Stage 6 자료에서 Policy 종류로 명시되었으나 룰 표현·평가 흐름·일반 Policy와의 관계 불명.
- **Where this came up**: [[entities/fireblocks/policy]], [[vendors/fireblocks/policy-engine]]
- **Sources to check**: Policy Engine reference
- **Status**: **answered (2026-05-18, Stage 10)**
- **Answer**: DCCP = **Deposit Control and Confirmation Policy** = **chain confirmation 횟수 정책** + **inflow/outflow lock state**. 자산별 confirmation 수가 도달하기 전 까지 inflow lock (deposit 자체는 받지만 사용 잠금) / outflow 정책 설정. 일반 Policy 와 분리된 **별도 policy plane**. 적용처: [[entities/fireblocks/policy]] §"DCCP — Deposit Control plane", [[vendors/fireblocks/security]] §"DCCP". 출처: `about-the-deposit-control-and-confirmation-policy.md` (Stage 10).

### Q-2026-05-18-S03: AML Transaction Screening Policy의 정확한 동작은?

- **Why it matters**: AML 통합 Policy 종류. Stage 1의 *Add or modify AML connections and policies* 권한과의 관계, 어떤 외부 KYT/AML provider와 통합되는지 미명세.
- **Where this came up**: [[entities/fireblocks/policy]], [[vendors/fireblocks/compliance]]
- **Sources to check**: AML 통합 가이드, KYT 파트너 문서
- **Status**: open

### Q-2026-05-18-S04: Withdrawal address whitelisting cooling-off period의 기본값·설정 범위는? (★ Stage 157 partial — 공개 미문서화 확인)

- **Why it matters**: 화이트리스트 활성화 전 대기 기간. 길이가 운영 정책의 핵심.
- **Where this came up**: [[vendors/fireblocks/security]]
- **Sources to check**: Whitelisting docs
- **Status**: open (partial)
- **Stage 157 확인**: developers `/docs/whitelist-addresses` fetch + 웹 검색 — 기간·설정 범위 **공개 문서 미명세**. Support enable 전용 설정으로 확인. API 흔적은 wallet 객체의 `activationTime` 필드뿐 ([[entities/fireblocks/vault-account]]). 잔여: Support 문의로만 확정 가능

### Q-2026-05-18-S05: Withdrawal address whitelisting suspension의 정확한 동작은?

- **Why it matters**: Admin 권한 API user에 권장되는 추가 보호 메커니즘. 어떤 행동이 suspended되는지, 해제 절차는?
- **Where this came up**: [[vendors/fireblocks/security]], [[entities/fireblocks/api-user]]
- **Sources to check**: Whitelisting suspension docs
- **Status**: open

### Q-2026-05-18-S06: Support verification requests의 rollout 일정·범위는?

- **Why it matters**: 점진적 rollout 중. 모든 고객에 적용 시점·조건 미명세.
- **Where this came up**: [[vendors/fireblocks/security]], [[entities/fireblocks/mobile-device]]
- **Sources to check**: Customer Success Manager 안내
- **Status**: open

### Q-2026-05-18-S07: FSPM (Fireblocks Security Posture Management) entity-grade 명세는?

- **Why it matters**: Stage 1부터 권한표·여러 Related Articles에 등장하지만 본 자료군에 정의 깊지 않음. Security Center 페이지 외 자세한 기능, findings 종류, integration 표면 미명세.
- **Where this came up**: [[entities/fireblocks/user-roles/security-admin]], [[entities/fireblocks/user-roles/security-auditor]], [[vendors/fireblocks/compliance]], [[vendors/fireblocks/security]]
- **Sources to check**: FSPM 전용 docs
- **Status**: **answered (2026-05-18, Stage 10)**
- **Answer**: FSPM = **AI-based attack simulator** (Google Gemini private deploy). **6 monitoring 영역**: (1) over-permissive/stale policies, (2) unused users/access gaps, (3) weak approval group thresholds, (4) risky unused workspace settings, (5) risky token allowances, (6) outdated security software. **3-step Agentic Policy Analyzer**. Access role: Owner / Admin / Non-Signing Admin / **Security Auditor**. Audit Log 와 별개 plane (pre-incident posture vs post-incident forensic). 별도 entity 미생성 — [[vendors/fireblocks/security]] §"FSPM" 이 owning hub. 출처: `fireblocks-security-posture-management-fspm.md` (Stage 10).

### Q-2026-05-18-O05: Workspace freeze 시 incoming transfer 처리는?

- **Why it matters**: `freeze-workspace.md` p.1: "The workspace still receives incoming transfers while frozen." — incoming transfer가 자동 완료되는지, Pending으로 보류되는지 미명세. 운영·정산에 직접 영향.
- **Where this came up**: [[entities/fireblocks/workspace]], [[vendors/fireblocks/lifecycle-events]]
- **Sources to check**: Freeze workspace 보완 자료
- **Status**: open

### Blockchain (Stage 7에서 추가)

### Q-2026-05-18-B01: SLA-covered 리스트와 Internal-tx 지원 리스트 비교의 운영적 의미는?

- **Why it matters**: 두 매트릭스가 별도로 관리됨 — `blockchains-sla.md` (~30 chain SLA-covered) vs `blockchains-that-support-internal-transactions.md` (~35 mainnet internal-tx). 교집합/차이가 운영 의사결정에 영향. SLA + Internal-tx 모두 포함된 chain은 가장 안정적, 한쪽만 포함된 chain은 운영 부담이 다름.
- **Where this came up**: [[vendors/fireblocks/blockchains]], [[vendors/fireblocks/risks]]
- **Sources to check**: Fireblocks chain support roadmap, certified vendor 정책
- **Status**: open

### Q-2026-05-18-B02: Node Router static vs on-demand 사용 시점·trade-off?

- **Why it matters**: Static dedicated은 단일 node로 simple하나 fallback 없음 → SPOF. On-demand는 multi-node 지원하나 API 호출마다 node 지정 부담. EVM only 제약 + Fireblocks default node로의 자동 fallback 부재가 운영 설계에 영향.
- **Where this came up**: [[vendors/fireblocks/blockchains]], [[vendors/fireblocks/risks]], [[vendors/fireblocks/architecture]]
- **Sources to check**: Node Router 운영 가이드 (Customer Success Manager 안내)
- **Status**: open

### Q-2026-05-18-B03: Internal transaction 감지 메커니즘은?

- **Why it matters**: `blockchains-that-support-internal-transactions.md` p.1은 internal tx가 "smart contract 실행 흐름의 일부, 별도 hash 없음"이라 명시. Fireblocks가 어떻게 감지하는지(trace API, archive node, debug_traceTransaction 등) 미명세. 어떤 chain은 지원되고 어떤 chain은 미지원인지의 implementation 결정 이유와 직결.
- **Where this came up**: [[entities/fireblocks/transaction]], [[vendors/fireblocks/blockchains]]
- **Sources to check**: Fireblocks engineering docs, blockchain RPC support 매트릭스
- **Status**: **partially answered (2026-05-29, Stage 40 + 2026-06-01, Stage 41)**
- **Partial answer (Stage 40)**: Indexer 의 internal-tx 감지 RPC 구현 자체는 여전히 비공개. 다만 confirmation/finality 차원의 truth-determination 정책은 명시화됨 — Fireblocks 는 chain-level finality 외에 **자체 empirical risk monitoring** 으로 deposit completion 결정 (source: `blockchain-confirmation-limitations.md`, p.6 SOL 관련 인용 "Based on our analysis, a reversion has never happened before"). 즉 indexer 의 truth 는 단순 N-block 누적이 아니라 chain 별 finality 정책 + empirical 평가의 합성.
- **Additional context (Stage 41)**: Vendor-neutral indexer reference 의 4 implementation pattern (P1 풀노드 pull / P2 이벤트 스트리밍 / P3 트랜잭션·이벤트 스캔 / P4 상태 스냅샷·레이크) 기반으로 Fireblocks 구현 분류 가능 — EVM 은 P1 (eth_subscribe + tracing API) + P3 (event/log scan with filter) 추정, Solana 는 P2 (Geyser / Yellowstone 또는 자체 구현) 추정. `evmTransferType=INTERNAL` 노출 (Stage 36 `transaction-objects.md`) 으로 보아 trace API 기반. 자세한 일반화 분석은 [[docs/architecture/blockchain-indexer-architecture-reference]] §11.4 참조.
- **Hypothesis-tier additional context (Stage 42, ★ UNVERIFIED)**: LLM 생성 자료 ([[docs/architecture/vendor-indexer-implementations-hypothesis]]) 에 따르면 Fireblocks 의 구체 구현은 — (a) UTXO mempool 즉시 vs Account block-mined 후 알림 이원화, (b) **송신 1분 / 수신 10분 timeout window**, (c) Chainalysis/Elliptic 실시간 API 연결, (d) **ATC (Account Traffic Control) 아키텍처 + `stuck_confirming` 지표** 로 stuck nonce 자동 재할당, (e) Solana 1,000 동시 pending (단, 공식 600 과 mismatch). ★ 이 모든 fact 는 **cross-verify 안 됨** — Q-VRF-01~08 항목 통과 후만 fact 승격. 운영 결정에 직접 사용 금지, vendor Solutions Engineer 검증 필수.
- **Hypothesis-tier 추가 (Stage 44, B4 ChatGPT)**: B4 자료가 36 외부 URL footnote 직접 인용으로 정리 — Fireblocks 영역의 자체 결론: **"Fireblocks 는 범용 인덱서 제품을 공개적으로 노출하지 않음"**. B4 의 자체 분류: (a) "확인됨" = `/blockchains` + 자산 API, EVM receipt, network routing, Webhooks v2, externalTxId 영구 멱등성, multi-destination batching, (b) "부분 확인" = 노드 운영 + 큐 기반 권장 아키텍처, (c) "미확인" = 노드 토폴로지 / Kafka / DB / 스트리밍 버스 / 캐시 / 검색·분석 스토어 / 백필. → **Q-B03 의 정책적 답**: Fireblocks 의 indexer 비공개는 의도적 — "범용 인덱서 회사" 아닌 "트랜잭션 제어·정합성·서명·이벤트 전달 신뢰성" 중심. KR 거래소 reference 사례로 **Korbit** 의 Kafka + Temporal + Go/Rust + gRPC + EKS + Chainalysis 통합 (B4 footnote 22-23) — 본 wiki 사상 첫 KR 거래소 공개 사례 정리. 자세한 7 거래소 비교 + Coinbase ChainStorage 분석은 hypothesis 페이지 §6 참조.
- **Caveat**: 본 분석은 vendor-neutral pattern 매핑 + Fireblocks API 노출 분석 기반의 추정. 구체 RPC method (`debug_traceTransaction` vs `trace_*` vs receipt log) 는 Fireblocks 비공개 → engineering-level 문의 필요.

### Q-2026-05-29-DC01: Contract call 의 3-confirmation "recommended" 가 default 인지 권장값인지?

- **Why it matters**: `default-deposit-control-and-confirmation-policy.md` p.1 은 "Fireblocks recommends configuring contract call operations with a minimum of 3 confirmations." 라고만 명시 — 자동 적용 default 인지, customer 가 custom DCCP 에 명시해야 적용되는지 분기 불명. Contract call 의 latency / risk 추정에 직결.
- **Where this came up**: [[vendors/fireblocks/blockchains]], [[entities/fireblocks/transaction]]
- **Sources to check**: "Override the DCCP for specific transactions" article (related), Fireblocks Support 직접 문의
- **Status**: open

### Q-2026-05-29-DC02: Custom DCCP 의 Fireblocks Support review SLA / lead-time?

- **Why it matters**: `build-a-custom-...md` p.1 — customer 가 template 제출 후 Fireblocks Support 의 "review, approval, and implementation" 거치는데, lead-time 명시 없음. KR 은행이 신규 자산/체인 추가 시 confirmation 정책 변경 lead-time 이 운영 risk.
- **Where this came up**: [[vendors/fireblocks/blockchains]], [[entities/fireblocks/transaction]]
- **Sources to check**: Customer Success Manager / SOW
- **Status**: open

### Q-2026-05-29-DC03: Custom DCCP 변경 audit trail (customer 측 노출 여부)?

- **Why it matters**: 정책 변경이 Fireblocks Support 경유라면 customer 측 audit log 에 어떤 형태로 노출되는지 (Audit Log 시스템 에 entry 가 남는지, change ticket 으로만 추적되는지) — KR 규제 (외부감사인 검증 가능성) 관점에서 핵심.
- **Where this came up**: [[vendors/fireblocks/blockchains]], [[vendors/fireblocks/audit]]
- **Sources to check**: Fireblocks Audit Log spec, change management process docs
- **Status**: open

### Q-2026-05-29-DC04: "Override the DCCP for specific transactions" 의 별도 plane 메커니즘?

- **Why it matters**: A2/A3 의 Related Articles 에 "Override the DCCP for specific transactions" 가 별도 article 로 존재. Custom DCCP (정책 layer) 와 per-tx override (operational layer) 가 분리된 plane 인지, 동일한 메커니즘인지 — runtime authorization 흐름과 직결.
- **Where this came up**: [[vendors/fireblocks/blockchains]], [[entities/fireblocks/transaction]]
- **Sources to check**: "Override the DCCP for specific transactions" article ingest 필요
- **Status**: open

### Q-2026-05-29-DC05: KR 은행 compliance — SOL `Confirmed` (1 slot) vs `Finalized` (2 slot)?

- **Why it matters**: Fireblocks 는 SOL 의 `Confirmed` 사용. KR 금융위 / 금감원의 reorg risk 평가 기준이 deterministic finality (`Finalized`) 를 요구할 가능성. Fireblocks 의 empirical "reversion has never happened" 평가가 한국 규제 관점에서 인정되는지 불명.
- **Where this came up**: [[vendors/fireblocks/blockchains]], [[entities/fireblocks/transaction]], [[vendors/fireblocks/kr-compliance]]
- **Sources to check**: 금융위 가상자산 가이드 (2026), 금감원 검사 매뉴얼
- **Status**: open

### Q-2026-05-29-DC06: Finality 체인의 chain-자체 finality 실패 시 Fireblocks webhook re-emit 정책?

- **Why it matters**: Rigid finality 체인도 chain-level 사고 (validator collusion, social fork) 시 finality 실패 가능. Fireblocks 가 이미 `COMPLETED` 로 emit 한 webhook 을 어떻게 reverse 하는지 명세 없음.
- **Where this came up**: [[vendors/fireblocks/blockchains]], [[entities/fireblocks/transaction]], [[vendors/fireblocks/risks]]
- **Sources to check**: webhook re-emit 정책 docs (이미 일부 ingest: `reference-resend-webhook-notifications.md`)
- **Status**: open

### Q-2026-05-29-DC07: Max confirmations table 의 신규 체인 추가 catalog 업데이트 주기?

- **Why it matters**: `blockchain-confirmation-limitations.md` p.1 — "For most newly supported assets see Blockchain data sheets on Fireblocks". 신규 체인 추가 시 max conf 가 30 (EVM 기본) 으로 자동 설정인지, chain 별 평가 후 결정인지 불명. KR 은행이 신규 chain 지원 시점에 default risk 평가 가능 여부와 직결.
- **Where this came up**: [[vendors/fireblocks/blockchains]]
- **Sources to check**: `blockchain-data-sheets.md` (이미 ingest, p.1-3), Fireblocks chain 추가 changelog
- **Status**: open

### Q-2026-05-18-W02: Recovery passphrase 분실 시 복구 경로는? Workspace Keys Backup도 함께 무력화되는가?

- **Why it matters**: Recovery passphrase는 Owner의 개인 비밀로 Workspace Keys Backup 암호화 키 + Owner 이전 verify 자산 두 역할을 한다.
- **Where this came up**: [[entities/fireblocks/recovery-passphrase]], [[entities/fireblocks/workspace-keys-backup]], [[vendors/fireblocks/risks]]
- **Sources to check**: "Reset the Owner's Recovery Passphrase" 문서 (Stage 5에서 수집됨)
- **Status**: **answered (2026-05-18, Stage 5)**
- **Answer**: **Mobile app self-service reset 가능** (Admin/Signer: `reset-an-admin-or-signers-recovery-passphrase.md`, p.1; Owner: `reset-the-owners-recovery-passphrase.md`, p.1–2). Owner는 추가로 **기존 recovery package 파기 + 새 recovery package 요청** (Fireblocks Support 경유, offline 또는 third-party DRS). 적용처: [[entities/fireblocks/recovery-passphrase]] §"Reset 절차".
- **Caveat**: 분실 + device까지 분실 시(즉 mobile app 자체 접근 불가)의 회복 경로는 본 자료에 명시 없음 — Workspace Keys Recovery 시나리오 (Q-D07)와 결합 필요.

## Related Pages

- [[vendors/fireblocks/overview]]
- [[vendors/fireblocks/user-management]]

## Sources

질문을 제기한 원본 자료:

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1–8 (Stage 1: G01–G04, M01–M02, C01–C02, P01–P03, W01, O01)
- `2026-05-18__support-fireblocks-io__add-users.md`, p.1–2 (Stage 2: G02 answer, L02–L03, M04)
- `2026-05-18__support-fireblocks-io__edit-users.md`, p.1–2 (Stage 2: L01, L04, L06, L07)
- `2026-05-18__support-fireblocks-io__delete-users.md`, p.1–2 (Stage 2: L03, L05, L06, M03)
- `2026-05-18__support-fireblocks-io__add-api-users.md`, p.1–2 (Stage 4: C02 answer, A01, A03, A05)
- `2026-05-18__support-fireblocks-io__re-enrolling-api-users.md`, p.1–2 (Stage 4: A01, A04)
- `2026-05-18__support-fireblocks-io__rename-and-delete-api-users.md`, p.1–2 (Stage 4: A01, A02, A07)
- `2026-05-18__support-fireblocks-io__allowlist-ip-addresses-for-api-user-requests.md`, p.1 (Stage 4: A06)
- `2026-05-18__support-fireblocks-io__configure-sso.md`, p.1–4 (Stage 4: AU01–AU03)
- `2026-05-18__support-fireblocks-io__manage-your-2fa.md`, p.1–2 (Stage 4: AU04)
- `2026-05-18__support-fireblocks-io__reset-your-password.md`, p.1 (Stage 4: AU05)
- `2026-05-18__support-fireblocks-io__re-enroll-a-users-mobile-device.md`, p.1 (Stage 3: D01, D02, D03)
- `2026-05-18__support-fireblocks-io__reset-a-users-2fa.md`, p.1 (Stage 3: cross-ref)
- `2026-05-18__support-fireblocks-io__transfer-workspace-owner.md`, p.1–2 (Stage 3: O02, O03, W02)
- `2026-05-18__support-fireblocks-io__about-the-fireblocks-mobile-app.md`, p.1–2 (Stage 5: D04, M03 partial)
- `2026-05-18__support-fireblocks-io__mobile-authentication-methods.md`, p.1 (Stage 5: AU04 partial)
- `2026-05-18__support-fireblocks-io__device-migration.md`, p.1–2 (Stage 5: D01 answer, D05)
- `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.1–4 (Stage 5: M03 partial, D02 partial, D06)
- `2026-05-18__support-fireblocks-io__reset-the-owners-recovery-passphrase.md`, p.1–2 (Stage 5: W02 answer)
- `2026-05-18__support-fireblocks-io__reset-an-admin-or-signers-recovery-passphrase.md`, p.1 (Stage 5: W02 answer)
- `2026-05-18__support-fireblocks-io__batch-approvals-and-signing.md`, p.2, p.6 (Stage 5: D08, P05)
- `2026-05-18__support-fireblocks-io__new-mobile-experience-request-management.md`, p.4 (Stage 5: D08, O04)
- `2026-05-18__support-fireblocks-io__fireblocks-mobile-app-signing-and-approving.md`, p.3 (Stage 5: P04)
- `2026-05-18__support-fireblocks-io__linked-users-fireblocks-mobile-app.md`, p.1–2 (Stage 5: D02 partial)
- `2026-05-18__support-fireblocks-io__security-checklist.md`, p.1–3 (Stage 6: S01–S05, S07)
- `2026-05-18__support-fireblocks-io__support-verification-requests.md`, p.1–2 (Stage 6: S06)
- `2026-05-18__support-fireblocks-io__allowlisting-ip-addresses-for-console-access.md`, p.1–3 (Stage 6: A06 partial, A07 partial, G03 partial)
- `2026-05-18__support-fireblocks-io__freeze-workspace.md`, p.1 (Stage 6: O05)
- `2026-05-18__support-fireblocks-io__is-this-email-really-from-fireblocks.md`, p.1 (Stage 6: phishing context)
- `2026-05-18__support-fireblocks-io__blockchains-sla.md`, p.1–2 (Stage 7: B01)
- `2026-05-18__support-fireblocks-io__blockchains-that-support-internal-transactions.md`, p.1 (Stage 7: B01, B03)
- `2026-05-18__support-fireblocks-io__node-router.md`, p.1–3 (Stage 7: B02)
- `2026-05-18__support-fireblocks-io__authentication-and-authorization.md`, p.1–7 (Stage 8: MPC-CMP architecture)
- `2026-05-18__support-fireblocks-io__security-aspects-signing-with-the-fireblocks-mobile-app.md`, p.1–6 (Stage 8: M01/M02/M03 answers)
- `2026-05-18__support-fireblocks-io__best-practices-for-choosing-user-roles.md`, p.1–5 (Stage 8: S08 single-signer SPOF, Owner 9 책임)
- `2026-05-18__support-fireblocks-io__audit-log.md`, p.1–12 (Stage 8: A07 answer, S13 audit access)
- `2026-05-18__support-fireblocks-io__mpc-cmp.md`, p.1–8 (Stage 8: M01/D04 answers)
- `2026-05-18__support-fireblocks-io__intel-sgx-secure-environments.md`, p.1–3 (Stage 8: A05 answer)
- `2026-05-18__support-fireblocks-io__business-continuity-module-bcm.md`, p.1–3 (Stage 8: S10 Hosted MPC requirement)
- `2026-05-18__support-fireblocks-io__fireblocks-yubikey-authentication.md`, p.1–9 (Stage 8: AU04 answer, S11 Owner Yubikey 강제 전파)
- `2026-05-18__support-fireblocks-io__fireblocks-ip-addresses-to-whitelist.md`, p.1 (Stage 8: S12 3-region SaaS)
- `2026-05-18__support-fireblocks-io__fireblocks-cloud-architecture.md`, p.1–4 (Stage 8: S09 DR SPOC, 3-cloud)
- `2026-05-18__support-fireblocks-io__hosted-mpc-overview.md`, p.1–2 (Stage 8: Hosted MPC variant)

## Stage 8 신규 Open Questions

### Q-2026-05-18-S08: Single-Signer Workspace SPOF 의 권장 mitigation 시점·임계

- **Why it matters**: Fireblocks 가 single-signer = SPOF 임을 공식 인정. 단 "언제부터 additional signer 도입을 의무화하는지" 의 threshold 는 명시 없음 (자산 규모? user 수? 운영 시간?).
- **Where this came up**: [[vendors/fireblocks/risks]], [[entities/fireblocks/user-roles/owner]]
- **Sources to check**: Cold Wallet Security Best Practices, Vault Structure Best Practices (TIER 3 placeholder)
- **Status**: **answered (2026-05-18, Stage 9)**
- **Answer**: Stage 9 `transaction-lifecycle.md` 가 Azure 내 module 책임 명세 제공 — **Auth Engine** (JWT 검증) / **Policy Engine TAPs** (정책 평가) / **Secure Vault** (key share storage) / **Co-Signer Engine** (MPC ceremony). 각 module 간 zero-trust handoff. Single-signer SPOF mitigation 자체는 Vault Structure BP (Stage 9) 의 "Cold Wallet 별도 workspace + rebalancing" + Owner Yubikey 강제 (Stage 8) 패턴으로 흡수. 적용처: [[vendors/fireblocks/architecture]] §"Azure module 책임", [[vendors/fireblocks/risks]] §"Single-signer SPOF mitigation". 출처: `transaction-lifecycle.md` (Stage 9).

### Q-2026-05-18-S09: Disaster Recovery Service (xprv+fprv) 생성·접근·운영 절차

- **Why it matters**: DR 자체가 SPOC 라 명시되어 정기 사용 금지지만, 정확한 생성·검증·storage·rotation 절차는 미명세. Air-gapped requirement 의 구체 정의 (network isolation, physical security 표준) 도 없음.
- **Where this came up**: [[vendors/fireblocks/architecture]], [[vendors/fireblocks/risks]], [[entities/fireblocks/workspace-keys-backup]]
- **Sources to check**: Hosted MPC Backup and Recovery (TIER 3 placeholder), Workspace Key Backup 전용 가이드
- **Status**: **answered (procedural full cycle, 2026-05-19, Stage 31)**
- **Stage 31 Answer (Reconstruction, operation 측)**: `recovering-private-key-material.md` (Mode C 직접 인용). **3-step procedure on offline machine** with **4-secret reconstruction model**: (1) Recovery Kit ZIP + (2) `fb-recovery-prv.pem` RSA-4096 private key + (3) Mobile App Recovery Passphrase + (4) RSA Private Key Passphrase (AES-128). **Strict offline-only mandate** — 직접 인용: "Performing this procedure on an online machine will result in your **private key being considered exposed and compromised**." Auto-passphrase variant = **5 secrets** (추가 RSA keypair). **JSON automation v1.8.0+** 으로 passphrase manual entry 회피 가능 (`{"Passphrase": ..., "rsaKeyPassphrase": ...}`). 적용처: [[entities/fireblocks/workspace-keys-backup]] §"Stage 31 — Reconstruction Procedure", [[entities/fireblocks/mpc-key-share]] §"Reconstruction 모델", [[vendors/fireblocks/architecture]] §"Disaster Recovery Services" (full operational lifecycle). 출처: `recovering-private-key-material.md` (Stage 31 Mode C).
- **Status (이전)**: ~~partial answered (substantial advance, 2026-05-19, Stage 30)~~
- **Stage 30 Answer (SaaS MPC variant + Recovery Utility)**: `generating-a-workspace-key-backup-package-fireblocks-recovery-utility.md` (Mode C 직접 인용). **6-file backup package** = 2 curves × 3 shares: ECDSA cloud × 2 + ECDSA mobile + EDDSA cloud × 2 + EDDSA mobile. Cloud shares = **RSA-4096 + AES-128** (customer-upload public key) / Mobile shares = **Owner passphrase**. **Recovery Utility app** (Console 다운로드, OS-specific, USB → air-gapped machine, "permanently disconnected from all networks"). Approval flow: Owner + Admin Quorum, **48-hour window** (초과 시 process 재시작), **QR code 또는 short key** 로 offline ↔ online air-gapped bridge, 양쪽 public key 일치 검증 + PIN + biometric. **Backup kit can only be downloaded once** — operational fragility signal. → xprv (ECDSA extended private key) + fprv (EDDSA extended private key) reconstruction 의 backup 단위 명확화. 적용처: [[entities/fireblocks/workspace-keys-backup]] §"Stage 30 — SaaS MPC variant", [[entities/fireblocks/mpc-key-share]] §"SaaS MPC Backup 모델", [[vendors/fireblocks/architecture]] §"Disaster Recovery Services". 출처: `generating-a-workspace-key-backup-package-fireblocks-recovery-utility.md` (Stage 30 Mode C).
- **Stage 29 Answer (보존, Hosted MPC variant)**: Hosted MPC backup procedure 명세 — 3-share kit (1 mobile passphrase + 2 Guard RSA-encrypted), 2-step + 2 air-gapped machines, approval-triggered Guard share file 자동 생성, RSA public key Console upload. 두 variant 가 paired plane (SaaS = 6 files / Hosted = 3 shares).
- **Stage 22 source pointer (보존)**: `hosted-mpc-overview.md` p.2 가 Hosted MPC Backup and Recovery sub-series 를 명시.
- **Full operational cycle (Stage 29 + 30 + 31 paired evidence)**:
  ```
  BACKUP (Stage 30 SaaS 6-file / Stage 29 Hosted 3-share) → encrypted package
   ↓
  RECONSTRUCTION (Stage 31): offline Recovery Utility + 4-5 secrets
   ↓
  Workspace 재구성 → Accounts page
  ```
- **잔존 영역 (★ out-of-scope for vendor docs — customer org compliance 결정)**:
  - **Rotation 정책** — backup kit 갱신 주기 / 사유 = **customer org compliance** (vendor 영역 아님)
  - **Air-gapped machine formal hardening 표준** (NIST CSP / FIPS) = **customer compliance posture** (vendor 영역 아님)
  - 두 항목은 Fireblocks vendor 가 일률 강제하지 않고 customer 가 자체 org policy 로 결정. Procedural Q-S09 는 Stage 29 + 30 + 31 paired evidence 로 **vendor-domain answer complete**.

### Q-2026-05-18-S10: BCM 도입 의사결정 기준 (SaaS-only vs Hosted MPC + BCM)

- **Why it matters**: SaaS-only 고객은 SaaS outage 시 signing halt. BCM 도입은 Hosted MPC 전환 필요 → 인프라·운영 비용 증가. Switching threshold 가 명시 안 됨.
- **Where this came up**: [[vendors/fireblocks/risks]], [[vendors/fireblocks/architecture]]
- **Sources to check**: Hosted MPC Customer-Side Setup, Hosted MPC Workspace Configuration (TIER 3 placeholder)
- **Status**: open
- **Source pointer (Stage 22 보강)**: **Hosted MPC ↔ BCM pairing 공식 확정** — `hosted-mpc-overview.md` p.1–2 + `business-continuity-module-bcm.md` p.1 cross-cite. BCM 은 Hosted MPC customer 전용 (SaaS-only 자격 없음). 도입 threshold 의 1차 source 는 **Hosted MPC Customer-Side Setup / Workspace Configuration** sub-series (TIER 3 placeholder). Promote (Mode C) 시 sub-series body 추출 필요. 적용처: [[vendors/fireblocks/architecture]] §"Hosted MPC Variant — BCM ↔ Hosted MPC pairing".

### Q-2026-05-18-S11: Owner Yubikey 채택 후 기존 사용자 처리

- **Why it matters**: "All users added afterward" — 그렇다면 **이미 있던** 사용자는? 그대로 biometric 유지? 강제 마이그레이션?
- **Where this came up**: [[entities/fireblocks/2fa]], [[entities/fireblocks/user-roles/owner]]
- **Sources to check**: Fireblocks Yubikey authentication 후속 자료, Mobile authentication methods (Stage 5)
- **Status**: open

### Q-2026-05-18-S12: 3-region SaaS 의 region selection·data residency 정책

- **Why it matters**: US/EU/EU2 만 존재. 한국·일본 등 APAC 고객의 data residency / GDPR 외 지역 정책 처리 미명세.
- **Where this came up**: [[vendors/fireblocks/architecture]], [[vendors/fireblocks/compliance]]
- **Sources to check**: Fireblocks data residency 정책 문서 (외부), region migration 가이드
- **Status**: open

### Q-2026-05-18-S13: Security Auditor / Security Admin 의 Audit Log access

- **Why it matters**: Audit Log doc 은 "Owner, Admin, NS-Admin" 만 명시. Security Auditor / Security Admin 의 audit-log access plane (별도? 동일?) 미명세.
- **Where this came up**: [[entities/fireblocks/user-roles/security-auditor]], [[entities/fireblocks/user-roles/security-admin]], [[vendors/fireblocks/security]]
- **Sources to check**: Security Audit Log 별도 문서 (Stage 6 security-checklist 에서 언급), FSPM 문서
- **Status**: **partial answered (2026-05-18, Stage 10)**
- **Partial Answer**: Stage 10 `fspm.md` — **Security Auditor 는 FSPM access role 에 포함** (Owner/Admin/NSA/Security Auditor). Audit Log 와 FSPM 은 **별개 plane**: Audit Log (post-incident forensic, Owner/Admin/NSA only) vs FSPM (pre-incident posture, Owner/Admin/NSA + Security Auditor). 적용처: [[entities/fireblocks/user-roles/security-auditor]] §"FSPM Access Plane", [[vendors/fireblocks/security]] §"FSPM vs Audit Log". 출처: `fireblocks-security-posture-management-fspm.md` (Stage 10).
- **잔존**: Security Admin 의 Audit Log access 는 여전히 본 자료에 명시 없음 — 권한표 ✓ vs 본문 silence 의 불일치는 미해소.

### Q-2026-05-18-S14: Mobile Device Configuration key 의 생성·rotation·compromise 처리

- **Why it matters**: Mobile device 가 MPC share + Configuration key 의 dual host. Configuration key 의 lifecycle (생성·rotation·compromise 시 처리) 은 명시 없음.
- **Where this came up**: [[entities/fireblocks/mobile-device]], [[entities/fireblocks/mpc-key-share]]
- **Sources to check**: Mobile app deep technical doc, Re-enrollment 의 Configuration key 처리 절차
- **Status**: open

## Stage 9 Sources (추가)

- `2026-05-18__support-fireblocks-io__transaction-lifecycle.md`, p.1-7 (Stage 9: tx state machine + 14-step schematic + zero-trust + AML providers)
- `2026-05-18__support-fireblocks-io__primary-transaction-statuses.md`, p.1-10 (Stage 9: 17 status + API codes + 시간 제약 + chain-specific quirk)
- `2026-05-18__support-fireblocks-io__vault-structure-best-practices.md`, p.1-7 (Stage 9: Segregated vs Omnibus + multi-workspace 6 trigger + default visibility)
- `2026-05-18__support-fireblocks-io__account-and-wallet-structure.md`, p.1-9 (Stage 9: 5-level hierarchy + asset address 3 패턴 + withdrawal round-robin)
- `2026-05-18__support-fireblocks-io__whitelisting-new-addresses.md`, p.1-5 (Stage 9: Internal/External/Contract + Admin Quorum approval)
- `2026-05-18__support-fireblocks-io__one-time-address-ota-feature.md`, p.1-2 (Stage 9: OTA Admin Quorum 우회 path)

## Stage 10 Sources (추가)

- `2026-05-18__support-fireblocks-io__admin-quorum.md`, p.1-5 (Stage 10: Admin Quorum 정식 명세 — Q-G01/G04 ANSWERED)
- `2026-05-18__support-fireblocks-io__approval-groups.md`, p.1-4 (Stage 10: 12 actions + 4 categories + Owner mandatory 5 — Q-G03/L06 ANSWERED)
- `2026-05-18__support-fireblocks-io__about-policies.md`, p.1-5 (Stage 10: 3 action + 5 default rules — Q-P01 부분)
- `2026-05-18__support-fireblocks-io__how-policies-work.md`, p.1-5 (Stage 10: first-match + rule ordering + sub-quorum)
- `2026-05-18__support-fireblocks-io__about-the-deposit-control-and-confirmation-policy.md`, p.1-2 (Stage 10: DCCP — Q-S02 ANSWERED)
- `2026-05-18__support-fireblocks-io__fireblocks-security-posture-management-fspm.md`, p.1-7 (Stage 10: FSPM — Q-S07 ANSWERED)
- `2026-05-18__support-fireblocks-io__user-group-management.md`, p.1-10 (Stage 10: User group, 별도 entity 안 만듦)

## Stage 14 신규 Open Questions (cluster catalog 식별, body-less)

> 본 4 건은 AML/Compliance + Cold Wallet cluster catalog (Stage 14) 의 cross-cut signal 식별에서 도출. 본문 fact 미확인 상태로 등록 — promote 시 응답.

### Q-2026-05-19-G05: Customer Policy vs Fireblocks Global Policy 의 hierarchy + bypass 가능성

- **Why it matters**: Stage 14 의 `global-policy-ofac-sanctions-compliance` catalog 가 Fireblocks **Global Policy** (vendor-side enforcement, 모든 workspace 적용) 의 존재를 명시. 이는 Stage 10 의 Customer-defined Policy (TAP / Approval Group / Admin Quorum) 위에 있는 **별도 plane**. 둘의 우선순위 (Global 우선? Customer override 가능?), bypass 절차, audit log 위치가 governance 모델 핵심.
- **Where this came up**: [[entities/fireblocks/policy]], [[vendors/fireblocks/compliance]], [[vendors/fireblocks/risks]]
- **Sources to check**: `global-policy-ofac-sanctions-compliance.pdf` (TIER 1 lightweight index, Stage 14), Travel Rule policy doc, Stage 10 Policy spine
- **Hypotheses (unverified)**: Global Policy = OFAC sanctions 같은 vendor-mandatory blocklist, Customer Policy 의 Allow 결정을 override. Bypass 는 Fireblocks Support 경유만 가능 (Stage 10 의 "Support escape path" 패턴과 일관).
- **Status**: open
- **Cluster**: Stage 14 AML/Compliance

### Q-2026-05-19-M05: Cold Wallet 의 MPC share 분포가 Hot Wallet 과 동일한가?

- **Why it matters**: Stage 8 의 Hot Wallet MPC 분포 = 2 cloud + 1 mobile device (Q-M01/M02/M03 ANSWERED). Cold Wallet 은 별도 device 필요 (`cold-wallet-device-requirements`) — 그렇다면 share 분포가 (a) 2 cloud + 1 Cold Wallet device 인지, (b) 3 Cold Wallet device (Fireblocks cloud 무관여) 인지, (c) 다른 구조인지가 Cold 의 신뢰 모델 + offline 성격을 결정.
- **Where this came up**: [[entities/fireblocks/mpc-key-share]], [[vendors/fireblocks/mpc]], [[entities/fireblocks/workspace]]
- **Sources checked**: `2026-09-01__fireblocks__cold-wallet-primary-docs-extracted.md` (`FB-CW-02`, `FB-CW-04`)
- **Answer (partial)**: Fireblocks는 Hot·Warm·Cold를 세 번째 MPC key share의 위치와 승인 방식으로 구분한다. Cold Wallet의 세 번째 share는 air-gapped 모바일 기기에 있고 양방향 QR로 승인한다. Signer 등록 때 Fireblocks cloud co-signer와 통신해 MPC-CMP 통신 4 round 중 처음 3 round를 pre-processing하고 실제 거래에서는 마지막 round를 QR로 완료한다. 공식 문서에서 확인되는 범위는 세 번째 share의 위치와 cloud co-signer의 pre-processing 참여까지다. 첫 번째·두 번째 share의 위치와 전체 share 분포는 원본 추출본에 직접 나와 있지 않으므로 Cold Wallet의 전체 분포가 Hot Wallet과 같은지는 확정할 수 없다.
- **Status**: **partial answered (2026-09-01, Stage 171)**
- **Cluster**: Stage 14 Cold Wallet

### Q-2026-05-19-G06: Cold ↔ Hot rebalancing 의 governance approval flow

- **Why it matters**: Stage 9 Vault Structure BP 가 "Cold Wallet 별도 workspace + rebalancing" 권장. Stage 14 catalog 의 `connecting-cold-wallet-with-hot-workspaces-via-p2p.pdf` 가 rebalancing path 의 P2P connection 모델 시사. 그러나 (a) rebalancing transaction 의 approval flow (Admin Quorum / Approval Group 적용), (b) Hot → Cold 와 Cold → Hot 의 비대칭 거버넌스 (Cold → Hot 은 더 strict?), (c) Cold Wallet 의 approval-group 미지원 (Risk-G07) 환경에서 어떻게 작동하는지가 운영 모델 핵심.
- **Where this came up**: [[entities/fireblocks/workspace]], [[entities/fireblocks/admin-quorum]], [[entities/fireblocks/transaction]], [[vendors/fireblocks/risks]]
- **Sources checked**: `2026-09-01__fireblocks__cold-wallet-primary-docs-extracted.md` (`FB-CW-01`, `FB-CW-06`)
- **Answer (partial)**: Hot·Cold workspace 간 자산 이동에는 Fireblocks P2P Network를 사용할 수 있다. 새 P2P Network connection은 요청 측과 상대 측 Admin Quorum의 승인이 모두 필요하다. 이는 connection 생성에 관한 승인 요건이다. 공개 문서에서는 개별 transfer의 approval flow, Hot→Cold와 Cold→Hot의 비대칭 규칙, Support 개입 여부를 확인하지 못했다.
- **Status**: **partial answered (2026-09-01, Stage 171)**
- **Cluster**: Stage 14 Cold Wallet
- **Related**: Risk-G07 (Cold Wallet approval-group 미지원)

### Q-2026-05-19-S15: AML / Travel Rule provider 의 fail-on-unknown vs pass-on-unknown workspace default

- **Why it matters**: Stage 9 Vault Structure BP 의 multi-workspace 6 trigger 중 "different AML defaults" 가 별도 workspace 분리의 정당화 근거로 등장. Stage 14 의 `aml-transaction-screening-and-monitoring` + `chainalysis-integration` + `elliptic-integration` + `notabene-integration` catalog 가 3 provider 통합 시사. 각 provider 통합의 unknown counterparty 처리 default (fail-closed = block / fail-open = pass) 가 다른지, workspace 별 override 가 가능한지가 compliance 운영 모델 + workspace 분리 의사결정 핵심.
- **Where this came up**: [[entities/fireblocks/policy]], [[vendors/fireblocks/compliance]], [[entities/fireblocks/workspace]]
- **Sources to check**: `aml-transaction-screening-and-monitoring.pdf` + provider 별 integration doc 3건 (Chainalysis / Elliptic / Notabene) (TIER 1 lightweight index + cluster catalog, Stage 14)
- **Hypotheses (unverified)**: Default 는 fail-closed (block unknown), workspace policy 에서 override 가능 (낮은 risk 자산 / testnet 등). Provider 별 차이는 risk scoring 알고리즘 + 데이터 coverage 차이로 인한 unknown 비율 차이.
- **Status**: open
- **Cluster**: Stage 14 AML/Compliance
- **Related**: Q-2026-05-18-S03 (AML Transaction Screening Policy)

## Stage 11–15 Catalog Sources (참조 — body 미로드)

> Stage 11–15 는 cluster catalog / lightweight index 만 — PDF body 미로드. 본문 fact 가 필요한 경우 promote 후 사용.

- **Stage 11 (Tokenization, 33 PDF)**: TIER 1 lightweight index `2026-05-19__support-fireblocks-io__about-tokenization-on-fireblocks.md` + TIER 3 raw 32건 (cluster catalog markdown 미생성 — Stage 11 시점은 cluster-catalog 패턴 도입 전)
- **Stage 12 (Backup & Recovery, 22 PDF)**: 5 TIER 1 lightweight index + 6 TIER 2 placeholder
- **Stage 13 (Developer Docs webpages)**: [[sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__sitemap]] (in-body card 29 URLs) + 3 seed page index
- **Stage 14 (AML/Compliance 29 + Cold Wallet 15)**: [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__aml-compliance-cluster-catalog]] + [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__cold-wallet-cluster-catalog]] + 8 TIER 1 lightweight index
- **Stage 15 (llms.txt full sitemap)**: [[sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__llms-txt-sitemap]] (716 URLs)

## Stage 36 (2026-05-22) — Key Link Cluster Mode C Deep Ingest

3 PDF body ingest (extracted via pdftotext): `fireblocks-key-link-overview.md` + `getting-started-with-fireblocks-key-link.md` + `set-up-your-fireblocks-vault-with-key-link.md`. Parallel: `developers.fireblocks.com/reference/*.md` 163개 mass-fetch (Mode B disk-only, body 미read).

### Q candidates 정식 등록 (Stage 18 catalog 에서 등록 보류 → Stage 36 에서 일괄 등록)

#### Q-2026-05-19-M06 — Key Link signing flow vs MPC — **ANSWERED (Stage 36)**

- **Why it matters**: Key Link 가 MPC plane 과 어떻게 다른 trust model 인지가 product line 의 정체성
- **Where this came up**: [[entities/fireblocks/mpc-key-share]], [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__key-link-cluster-catalog]]
- **Answer**: 외부 HSM 단독 서명. Fireblocks 가 key share 0개. MPC plane 자체 없음. Customer HSM signature → Fireblocks validation key 로 검증 (asymmetric pair). 4-component pipeline: Fireblocks Agent (TS open-source) → Customer Server → HSM → 역경로
- **Status**: answered
- **Sources**: `2026-05-22__support-fireblocks-io__fireblocks-key-link-overview-extracted.txt` p.1-3, `getting-started-with-fireblocks-key-link-extracted.txt` p.1-9
- **Applied to**: [[entities/fireblocks/mpc-key-share]] §"Stage 36 — MPC plane vs Key Link plane boundary", [[entities/fireblocks/transaction]] §"Stage 36 — Key Link Signing Flow", [[vendors/fireblocks/architecture]] §"Stage 36 — Key Link Customer-Held Key Plane"

#### Q-2026-05-19-W03 — Vault Account 의 Key Link / MPC 공존 — **부분 ANSWERED (Stage 36)**

- **Why it matters**: Vault account 단위 격리 모델 — 한 vault 안에 두 plane 의 asset 가능 여부
- **Answer (partial)**: Key Link workspace 의 vault account 는 **ECDSA 1 + EdDSA 1 = 2 key 전용**. 한 key 가 한 vault 전속 (다른 vault 재사용 불가). 같은 workspace 안에서 MPC + Key Link asset 공존 여부는 미명시 — workspace-level 분리 가능성 강함 (Key Link workspace = 별도 type). 이 부분은 Q-KL01 으로 분리
- **Status**: partial
- **Sources**: `set-up-your-fireblocks-vault-with-key-link-extracted.txt` p.1-4
- **Applied to**: [[entities/fireblocks/vault-account]] §"Stage 36 — Key Link Vault Binding", [[entities/fireblocks/workspace]] §"Stage 36 — Key Link Workspace Variant"

#### Q-2026-05-19-G07 — Key Link governance plane — **ANSWERED (Stage 36)**

- **Why it matters**: 어떤 governance feature (Admin Quorum / Approval Group / Policy) 가 Key Link asset 에 적용 가능한가
- **Answer**: 3-level governance 모두 적용. (a) Admin Quorum 이 API user (Signer role) 생성 승인 — Agent 페어링 prerequisite. (b) Approval Group: `Settings > Quorums > Security & compliance > Add validation keys` 전용 group. (c) Policy rule 의 designated signer = Signer-role API user (Agent 페어된) 강제. Cold Wallet Risk-G07 (approval-group 미지원) 패턴 ≠ Key Link
- **Status**: answered
- **Sources**: `getting-started-with-fireblocks-key-link-extracted.txt` p.2-3, p.7
- **Applied to**: [[entities/fireblocks/workspace]] §"Stage 36", [[vendors/fireblocks/security]] §"Stage 36 — Customer Signature Validation Plane"

#### Q-2026-05-19-S16 — Key Link beta production-readiness — **부분 ANSWERED (Stage 36)**

- **Why it matters**: Beta 상태의 specific limitation 식별
- **Answer (partial)**: Catalog-level beta fact 재확인 (API prefix `/key-link-beta/`). 본 3 PDF 에는 Key Link workspace 가 일관되게 별도 workspace type 으로 명시 — beta-specific 제약 미명시. Cold Wallet 의 G07 패턴 (approval-group 미지원) 과는 다름 (Key Link 는 approval-group 지원). Specific limitation 식별 위해 추가 cluster ingest 필요 → 향후 Mode C 잔존
- **Status**: partial
- **Applied to**: [[vendors/fireblocks/risks]] §"Risk-KL03"

#### Q-2026-05-19-AU06 — Key Link signing key authentication — **ANSWERED (Stage 36)**

- **Why it matters**: 어떤 customer-side credential 이 keyId 와 매핑되는가
- **Answer**: **Signer-role API user + pairing token**. Procedure: API user 생성 → Admin Quorum approval → pairing token 발급 → Agent 에 입력 → 페어 완료. Re-enroll = Owner approval 필요. 신규 signing key 등록 시 `set-agent-user-id` 로 keyId ↔ API user 매핑
- **Status**: answered
- **Sources**: `getting-started-with-fireblocks-key-link-extracted.txt` p.2
- **Applied to**: [[entities/fireblocks/cosigner]] §"Stage 36 — Fireblocks Agent"

#### Q-2026-05-19-A08 — Key Link chain / algorithm support — **부분 ANSWERED (Stage 36)**

- **Why it matters**: Key Link 의 자산군 — MPC 와 동일? 별도 매트릭스?
- **Answer (partial)**: **ECDSA + EdDSA 알고리즘 단위 지원** (MPC-CMP 와 동일 algorithm 매트릭스). Vault account 당 ECDSA 1 + EdDSA 1 = 2 key 전용. Asset wallet 활성화 = 해당 asset 의 underlying protocol algorithm 의 key 가 vault 에 assigned 여부. Specific chain matrix 는 algorithm 결정 (별도 chain whitelist 미명시 → Mode C 추가 필요)
- **보강 (Stage 170, CSM 확답 — `2026-08-28__fireblocks-csm__key-link-thales-luna-qna.txt`)**: API 가 받는 서명 알고리즘은 **ECDSA secp256k1 · EdDSA ed25519 딱 2종**, HSM 은 이를 **PKCS#11** 로 노출, validation key = **RSA-2048**. Luna 펌웨어 제약(2차, Thales 가이드 인용): ed25519 는 7.8.9+, secp256k1 은 7.x 전부. Applied to [[vendors/fireblocks/security]] §"Stage 170"
- **Status**: partial (알고리즘 2종·인터페이스 확정, 체인 단위 매트릭스는 여전히 알고리즘 결정 — 별도 whitelist 미명시)
- **Sources**: `set-up-your-fireblocks-vault-with-key-link-extracted.txt` p.2-3, `getting-started-with-fireblocks-key-link-extracted.txt` p.4
- **Applied to**: [[entities/fireblocks/vault-account]] §"Stage 36"

### 신규 Q (Stage 36 본문 read 후 발견)

#### Q-2026-05-22-KL01: Key Link workspace 와 MPC workspace 의 same-organization 공존? — **부분 ANSWERED (Stage 36)**

- **Why it matters**: Migration path (MPC → Key Link 전환) + 운영 변경 영향 + Customer Domain 의 mixed-plane 가능 여부
- **Where this came up**: [[entities/fireblocks/workspace]] §"Stage 36", [[vendors/fireblocks/risks]] §"Risk-KL07"
- **Answer (partial, Stage 36)**: Hosted MPC 의 invariant 명시 — "modifying an existing SaaS MPC workspace is impossible" (`hosted-mpc-workspace-configuration.md` p.1). Workspace type 은 immutable. Key Link 도 같은 패턴 추정 (architectural symmetry). Customer Domain (Stage 9 5-level hierarchy top) 안에 mixed-plane workspace 공존 가능 — 각 workspace 가 type 고정. **Migration = 새 workspace + cross-workspace asset transfer**. Key Link 자체에 명시적 inavariant 는 별도 ingest 필요.
- **Sources**: `2026-05-22__support-fireblocks-io__hosted-mpc-workspace-configuration-extracted.txt` p.1, `hosted-mpc-customer-side-setup-extracted.txt` p.2
- **Status**: partial — Key Link 자체 invariant 의 직접 명시는 후속 ingest 필요

#### Q-2026-05-22-KL02: Customer Server fail 시 transaction signing fallback? — **ANSWERED (Stage 170)**

- **Why it matters**: Risk-KL01 의 mitigation 명시 부재 — Active-Active HA 권장 여부, Retry policy, Stage 9 의 Pending Signature 2h timeout 과의 호환성
- **Where this came up**: [[vendors/fireblocks/risks]] §"Risk-KL01"
- **Sources to check**: Fireblocks Agent open-source repo, Key Link advanced ops PDF
- **답 (Stage 170, CSM 확답 2026-08-28 — `2026-08-28__fireblocks-csm__key-link-thales-luna-qna.txt`)**: ① 다중 Agent 를 한 workspace 에 페어링 가능. 제약 = Agent 별 고유 identity + Fireblocks 측 전용 큐, 서명키는 특정 Agent user 에 바인딩(요청이 그 Agent 로 라우팅) → **권장 토폴로지 active/passive** (active/active 아님) ② Key Link 에 Agent·Customer Server 의 **내장 HA/DR 자동화 없음** — 감시·failover 는 고객 설계(PS 범위) ③ 미전달 서명 요청은 **Fireblocks 큐에 최대 7일 durable · at-least-once** — Agent 중단·재시작으로 유실 없음 ④ 키 복구는 Luna 네이티브(HA group·partition cloning·Backup HSM), Fireblocks 측 DR 서비스 불요. Pending Signature 2h 와 7일 큐의 관계는 별도 → Q-2026-08-28-KL07
- **Applied to**: [[vendors/fireblocks/risks]] §Risk-KL01 · [[entities/fireblocks/cosigner]] §"Stage 170" · [[entities/fireblocks/transaction]] §"Stage 36"
- **Status**: ANSWERED (레퍼런스 아키텍처 문서 유무는 미답)

#### Q-2026-05-22-KL03: Fireblocks Agent (open-source TS) update 정책?

- **Why it matters**: Open-source customer-hosted service 의 minimum version 강제 / security patch deployment 정책
- **Where this came up**: [[vendors/fireblocks/risks]] §"Risk-KL02"
- **Sources to check**: Fireblocks Agent GitHub repo README, Key Link release notes
- **Status**: open

#### Q-2026-05-22-KL04: HSM Adaptor cold-HSM signing latency / batching?

- **Why it matters**: Cold HSM signing 의 manual sign 사이클 vs Stage 9 의 Pending Signature 2h timeout + chain-specific 시간 제약 (Algorand 50min, Tezos 30min, Polkadot 2h)
- **Where this came up**: [[vendors/fireblocks/risks]] §"Risk-KL05"
- **Sources to check**: HSM Adaptor reference architecture, Cold HSM signing case study
- **Status**: open

#### Q-2026-05-22-KL05: Non-Interactive PoO replay window?

- **Why it matters**: UnixTimeInSeconds 의 validity window 명시 없음 — same-workspace replay 가능성
- **Where this came up**: [[vendors/fireblocks/risks]] §"Risk-KL06"
- **Hypotheses (unverified)**: SdkApiKey GUID + UnixTimeInSeconds 가 nonce 역할 가능 — 단 server-side replay protection 강제 미명시
- **Sources to check**: Key Link API reference (`add-a-new-signing-key` endpoint spec)
- **Status**: open

### Stage 36 Summary

- **ANSWERED 4 full + 2 partial**: M06 / G07 / AU06 (full) + W03 / S16 / A08 (partial)
- **신규 Q 5건**: KL01-KL05 (모두 open)
- **신규 entity 0건**: Fireblocks Agent → cosigner, Validation/Signing key → security + mpc-key-share, Key Link workspace → workspace 흡수. **연속 29 stage 신규 entity 0** 유지
- **신규 Risk 7건**: Risk-KL01–KL07 모두 [[vendors/fireblocks/risks]] hub 흡수
- **영향 페이지 8**: architecture / mpc-key-share / cosigner / workspace / vault-account / transaction / security / risks
- **Mass-fetch parallel**: `developers.fireblocks.com/reference/*.md` 163개 disk 저장 (Mode A+B 하이브리드, body 미read)

## Stage 38 (2026-05-22) — Thales Luna HSM 통합 (vendor blog)

### ANSWERED 부분

#### Q-2026-05-22-KL04 (partial): Air-gap transport 메커니즘

- **Status**: **부분 ANSWERED (Stage 38)**
- **What's confirmed**: USB · SFTP · data diodes 가 Cold workflow 의 air-gap transport 매체임이 vendor 공식 발언으로 확인 (Fireblocks blog 2025-09-23)
- **Still open**: 정확한 cold-HSM signing latency 수치 / batching 패턴 / Pending Signature 2h timeout 과의 호환성 미명세
- **Source**: `sources/fireblocks/markdown/2026-05-22__fireblocks-com__enterprise-digital-asset-security-thales.md`

### 신규 Q (3) — Key Link × Thales × Cold variant

#### Q-2025-09-23-FB01: Key Link 의 Hot/Warm/Cold 3-mode 의 정확한 기술 정의

- **Why it matters**: Vendor 공식 발언에서 "Hot, Warm, Cold signing workflows" 가 등장 (Stage 38). 단 "Warm" 의 기술 정의 (Hot 와 Cold 의 중간 — 어떤 격리 수준? 어떤 transport?) 명시 없음
- **Where this came up**: Stage 38, Fireblocks blog × Thales
- **Hypotheses (unverified)**:
  - Warm = HSM partition 이 online 이지만 별도 격리 zone (예: jump server 경유)
  - Warm = Cold HSM 의 batch online 모드 (정기적 batch signing)
- **Sources to check**: Thales-Fireblocks Solution Brief (미적재), HSM Adaptor reference architecture
- **Status**: open

#### Q-2025-09-23-FB02: SaaS Cold Wallet workspace vs Key Link Cold signing 의 관계

- **Why it matters**: Fireblocks 에 (a) SaaS Cold Wallet workspace (Stage 14 cluster, 별도 product) 와 (b) Key Link Cold signing workflow (Stage 38, customer HSM 기반) 가 동시 존재. 둘이 별개 product 인지, 같은 plane 의 variant 인지, 혼합 사용 가능한지 명시 없음
- **Where this came up**: Stage 38, Fireblocks blog × Thales
- **Hypotheses (unverified)**:
  - 별개 product — SaaS Cold = Fireblocks 관리 cold facility, Key Link Cold = customer HSM 의 cold mode
  - 혼합 — 한 workspace 안에서 SaaS Cold vault + Key Link Cold vault 가능?
- **Sources to check**: Cold Wallet cluster (Stage 14) 의 본문 Mode C ingest, Key Link 의 workspace type 명세
- **Status**: open

#### Q-2025-09-23-FB03: KR VASP 환경의 Key Link + Thales Luna 적용

- **Why it matters**: Fireblocks blog (Stage 38) 가 HKMA · HKSFC · JFSA 의 관할권을 명시했으나 **KR 미명시**. KR 가상자산이용자보호법 (Stage 37) 의 콜드월렛 80% + 망분리 해석 환경에서 Key Link + Thales Luna 의 적용 옵션 vendor 공식 입장 없음
- **Where this came up**: Stage 38, Fireblocks blog × Thales (KR 관할권 누락)
- **Cross-cut**: docs-site/fireblocks-kr-vasp-compliance/out-of-scope.html + open-questions/compliance.md
- **Sources to check**: Fireblocks Sales 직접 협의, KR VASP 사례 (현재 공개 case 부재)
- **Status**: open

### Stage 38 Summary

- **ANSWERED 1 partial**: Q-2026-05-22-KL04 (air-gap transport = USB/SFTP/data diodes)
- **신규 Q 3건**: FB01 / FB02 / FB03 (모두 open)
- **신규 entity 0건**: Thales Luna HSM → vendors/fireblocks/security 의 HSM 항목에 흡수. **연속 30 stage 신규 entity 0** 유지
- **영향 페이지**: vendors/fireblocks/security · risks + docs-site 의 cold-wallet-bank-design/signing-flow + risks-open-questions + kr-vasp-compliance/deployment-checklist

## Stage 52 (2026-06-09) — Canton ingest (중앙 등록)

> Canton 관련 Q 가 vendors/fireblocks/api.md · entities/fireblocks/transaction.md 에 인라인으로만 있어 중앙 미등록 상태였음. Canton 엔티티 신설(entities/canton/canton-network.md) 계기로 중앙 등록.

#### Q-2026-05-22-A11: Canton 2-step transferType ↔ Fireblocks transaction status 매핑 — **ANSWERED (Stage 78)**

- **Why it matters**: Canton transactionType(OFFER / ACCEPT / REJECT / WITHDRAW / PRE_APPROVAL)이 Fireblocks 의 어느 transaction status 에 대응하는지, OFFER 후 상대 수락 대기의 timeout 처리가 어떤지. 출금 상태머신 설계에 직접 영향.
- **답 (Stage 78, developers.fireblocks.com/reference/transaction-objects)**: Fireblocks 는 generic status 로 collapse 하지 않고 **전용 `transactionType` 필드**로 동일 이름(OFFER/ACCEPT/REJECT/WITHDRAW/PRE_APPROVAL)을 노출. `traceableId` = 원 OFFER UpdateId, **`CantonHashes`**(offer/accept/reject/withdraw/preApprovalUpdateId)로 OFFER↔후속 연결("offerUpdateId links back … enabling full lifecycle tracking"). 일반 NetworkStatus(BROADCASTING/CONFIRMING/CONFIRMED/FAILED/DROPPED)는 별도. → 출금 상태머신은 transactionType=OFFER 를 "수락 대기" 로 두고 ACCEPT/REJECT/WITHDRAW 전이.
- **timeout**: Fireblocks 강제 아님 = 수락 안 되면 송신자가 `WITHDRAW`(언제는 앱 정책).
- **source**: developers.fireblocks.com transaction-objects (sources/fireblocks/2026-06-10__canton-transaction-objects)
- **Status**: ANSWERED (매핑 확정; timeout=앱 정책)

#### Q-2026-06-09-C01: Canton finality 정확 수치 — **ANSWERED (Stage 54)**

- **Why it matters**: Synchronizer Mediator 의 2-phase commit 확정 시점.
- **경과 (Stage 52~53)**: 1차 페이지 5곳+(subnet · canton-network-overview · sync.global FAQ · ordering-consensus · global-synchronizer overview) 모두 수치 없음. "3-10초" 는 검색 요약에만 → 격리. 메커니즘만 확정(2/3 BFT orderer + Mediator 2-phase commit).
- **답 (Stage 54)**: docs.canton.network/**integrations/wallet/guidance** 에 문자 그대로 **"Finality usually takes 3-10s."** verbatim 재확인(WebFetch 요약 주입 아님 — 별도 prompt 로 검증). 그동안 검색 요약에만 있던 "3-10초" 가 1차 출처(수탁 통합 가이드)에서 확인됨. "usually" 라 환경별 편차 여지.
- **source**: docs-canton-network-renewed (wallet/guidance)
- **Status**: ANSWERED

#### Q-2026-06-09-C02: tx 당 traffic 비용 산정식 — **ANSWERED (Stage 52, 구체화 Stage 53)**

- **Why it matters**: traffic(byte) 비용의 구체적 tx 단위 산정.
- **답 (Stage 52)**: `총비용 = base_event_cost + Σ(envelope 비용)`. envelope 비용 = storage(payload byte) + network(`writeCost × #recipients × costMultiplier / 10_000`). 실무 estimate = `/v2/interactive-submission/prepare`, 실측 = participant 로그 `EventCost`.
- **구체 수치 (Stage 53, docs.canton.network synchronizer-traffic)**: 메시지 비용 = `메시지크기 × (1 + recipients × readVsWriteScalingFactor/10000)`. 예) factor4·1MB·10수신 = `1,000,000×(1+10×0.004)=1,040,000` byte. 파라미터(all networks): 무료 base **400,000 byte/20분 window**(선형 회복), 추가 traffic **$60 USD/MB**(CC 환산), readVsWrite **4 bp(0.004)**, 최소 top-up **200,000 byte**, validator 앱 built-in auto top-up. (★ 기존 "10분 mining round" → "20분 window" 로 정정)
- **source**: docs.digitalasset.com traffic-management + docs.canton.network synchronizer-traffic (Stage 52·53)
- **Status**: ANSWERED

### Stage 52 Summary

- **신규 Q 중앙 등록 3건**: A11(기존 인라인 → 중앙) · C01 · C02 — **C02 ANSWERED(traffic 산정식)**, A11·C01 open
- **신규 entity +1**: entities/canton/canton-network.md — Canton 은 Fireblocks 아닌 독립 체인이라 흡수 불가(범주). **연속 0-streak 종료**
- **영향 페이지**: entities/canton/canton-network · index.md · docs-site/wallet-service-components(2·9·11·14)

### Q-2026-07-02-T01: List Transactions 엔드포인트가 status/statuses 로 서버측 필터를 지원하는가

- **Why it matters**: confirming / finality(COMPLETED) 상태별로 트랜잭션 목록을 조회하려 할 때, 서버가 상태로 필터해 주면(쿼리 파라미터) 클라이언트가 전체를 받아 거르지 않아도 돼 트래픽·페이지네이션 부담이 준다. 지갑 백엔드의 `transactionsOf` 조회 설계에 직접 영향.
- **Where this came up**: docs-site/wallet-design-walkthrough/07-balance-history.html — `transactionsOf(account, 기간)` 목록 조회. **응답에 상태·`numOfConfirmations` 가 실린다는 점은 확정** (source: `primary-transaction-statuses.md` 17 primary status; docs-site 07-balance-history), **서버측 status 필터 파라미터 여부는 미확인**.
- **Hypotheses (unverified)**: Fireblocks List Transactions(`GET /v1/transactions`)가 `status`/`statuses` 계열 쿼리 파라미터로 서버측 필터를 지원한다고 일반적으로 알려져 있으나 — unverified, 1차 자료로 확인 필요.
- **Sources to check**: developers.fireblocks.com List Transactions endpoint reference (query params: status/statuses/orderBy/before/after), api-reference/transactions
- **답 (Stage 88, `fireblocks/fireblocks-openapi-spec` → `open_api_spec.yml` · `GET /transactions` "List transaction history")**: 서버측 status 필터 **지원 확정**. 파라미터명은 **`status`(단수 · 한 번에 하나)** — *"You can filter by one of the statuses."* (복수 `statuses` 아님). 함께: `before`/`after`(Unix ms), `orderBy`(createdAt|lastUpdated), `sort`(ASC|DESC), `limit`(기본 200), `sourceType`/`sourceId`, `destType`/`destId`, `assets`(콤마 구분), `txHash`. SDK: `fireblocks.get_transactions(status, after)` / `getTransactions({status})`. 다중 상태는 호출 분리 또는 클라이언트 필터. finality 판정은 status=COMPLETED + `numOfConfirmations ≥ DCCP 임계`(zero-conf 대비).
- **Status**: ANSWERED

### Stage 88 Summary

- **신규 Q 중앙 등록 1건**: T01 (List Transactions status 서버측 필터) — **ANSWERED (1차 자료: fireblocks-openapi-spec `GET /transactions`, `status` 단수 파라미터)**. 카테고리 **T (Transaction API)** 신설
- **출처 트리거**: docs-site 07-balance-history `transactionsOf` 상태별 조회 설계 검토 중 fact query
- **신규 entity 0**

### Q-2026-07-02-T02: webhook notifications 조회·재전송의 페이지네이션·rate limit (대량 실패 시)

- **Why it matters**: 천만 개 규모 주소의 워크스페이스에서 webhook 이 대량 실패·지연했을 때, 복구 1차 수단인 재전송(`POST /v1/webhooks/{id}/notifications/resend_failed`)과 전송 이력 조회(`GET /v1/webhooks/{id}/notifications`)의 **배치 크기·페이지네이션·rate limit** 이 실제 운영 처리량을 좌우한다. 수천+ 실패 알림을 한 번에 재전송할 수 있는지, 커서·limit 규약이 무엇인지가 backfill 설계에 직접 영향.
- **Where this came up**: docs-site/wallet-design-walkthrough/04-deposit.html — "webhook 놓쳤을 때" 복구 3단(재전송·polling·대사) 설계 중 fact query. **재전송·notifications 이력 endpoint 존재는 확정** (source: `vendors/fireblocks/api.md` Webhooks v2 · `reference-webhook-v2-migration-guide.md`, v2 = 30일 재전송 창), **페이지네이션·rate limit 수치는 미확인**.
- **Hypotheses (unverified)**: `GET /v1/webhooks/{id}/notifications` 가 표준 cursor/limit 페이지네이션을 따르고 resend 계열에 별도 rate limit 이 있을 것으로 추정 — 1차 자료(openapi-spec Webhooks v2 경로 · rate limit 문서)로 확인 필요.
- **Sources to check**: `fireblocks/fireblocks-openapi-spec` open_api_spec.yml 의 `/webhooks/{id}/notifications*` · developers.fireblocks.com rate-limits 페이지
- **Status**: open

### Stage 89 Summary

- **신규 Q 중앙 등록 1건**: T02 (webhook notifications 조회·재전송의 페이지네이션·rate limit) — **open**. 카테고리 T (Transaction/Webhook API)
- **출처 트리거**: docs-site 04-deposit "webhook 놓쳤을 때" 복구 절 설계 중 fact query (천만 주소 규모 webhook 실패 대응)
- **확정 재확인**: resend/resend_failed·notifications 이력 endpoint 존재 + v2 30일 재전송 창 (api.md) · List Transactions `orderBy=lastUpdated`+`after` backfill (T01 ANSWERED)
- **신규 entity 0**

### Q-2026-07-02-T03: 인바운드 차단 환경에서 폴링이 webhook 이벤트를 완전 대체하는가

- **Why it matters**: 은행·규제망은 외부 SaaS 의 인바운드 연결을 차단하는 경우가 많아 **webhook(Fireblocks→우리 push) 자체를 못 쓸 수 있다**. 이때 감지는 아웃바운드 폴링(`GET /v1/transactions`)으로 뒤집는데, 폴링이 webhook 이벤트 전체를 빠짐없이 대체하는지가 이 환경의 감지 설계 완결성을 좌우한다. 특히 ① 초기 INCOMING 감지 시점(첫 mempool/등장 이벤트)이 폴링으로도 동일 시점에 관찰되는지 ② `transaction.approval_status.updated` 같은 승인 상태 전이가 tx 조회 응답에 실려 폴링만으로 추적 가능한지 ③ webhook 으로만 오고 조회로는 안 오는 이벤트 유형이 있는지.
- **Where this came up**: docs-site/wallet-design-walkthrough/04-deposit.html — "인바운드를 막는 환경" callout + "webhook 이 없거나 놓쳤을 때" polling-primary 절 설계. **폴링 감지 자체는 확정**(List Transactions status/커서, T01 ANSWERED; 서명 경로 Fireblocks Agent 폴링, `vendors/fireblocks/architecture.md:319·342`; egress whitelist `architecture.md:152`; webhook 발신 IP `architecture.md:158`). **폴링이 push 이벤트를 100% 커버하는지는 미확인**.
- **Hypotheses (unverified)**: 입·출금 상태·confirmation·승인 상태는 tx 객체(`GET /v1/transactions`, `GET /v1/transactions/{txId}`)에 실려 폴링으로 관찰 가능하고, 폴링 주기만큼 감지 지연이 생길 뿐 이벤트 유실은 없다고 추정 — 단, 초기 감지 지연·webhook 전용 이벤트 존재 여부는 1차 자료 확인 필요.
- **Sources to check**: `fireblocks/fireblocks-openapi-spec` open_api_spec.yml 의 `GET /transactions` 응답 스키마(approvalStatus·createdAt vs lastUpdated) vs Webhooks v2 event type 목록(`reference-webhooks-structures-eventtypes.md`) 대조 · developers.fireblocks.com polling vs webhook 가이드
- **답 (Stage 111, 1차: `reference/webhooks-structures-eventtypes-transaction.md` + `reference/monitoring-transaction-status.md`, 2026-07-03 fetch)**: **사실상 대체 가능 확정.**
  1. Transaction webhook 이벤트는 5종 — `transaction.created` / `transaction.status.updated` / `transaction.approval_status.updated` / `transaction.network_records.processing_completed` / `transaction.alert.stuck_confirming`.
  2. **앞 4종의 payload = TransactionDetails** — `GET /v1/transactions` 로 읽는 것과 같은 객체(승인 상태도 tx 객체 필드로 실림) → **폴링으로 전부 관찰 가능**. 이벤트는 "그 객체가 바뀌었다"는 push 일 뿐 별도 정보가 없음.
  3. 유일한 예외 = `transaction.alert.stuck_confirming` (ATC 경보, 별도 payload·2026-06-07 breaking change 예고) — webhook 전용 알림성 이벤트. 단 기능적으로는 "오래 CONFIRMING 인 tx 를 폴링으로 골라내기"(docs-site 7p 막힌 출금 점검)로 동등 대체.
  4. **초기 감지 시점 확정**: account-based(EVM) 입금 통지는 **mined 시점**에 생성(UTXO 는 mempool 시점) — 폴링·webhook 이 같은 내부 기록을 읽으므로 차이는 폴 주기뿐. ("best practice = webhook" 은 벤더 권고이나 은행 인바운드 차단 환경에선 폴링으로 동일 정보 관찰.)
- **Status**: ANSWERED (alert 이벤트 1종만 webhook 전용 — 기능 대체 가능)

### Stage 90 Summary

- **신규 Q 중앙 등록 1건**: T03 (인바운드 차단 환경 폴링이 webhook 이벤트를 완전 대체하는가) — **open**. 카테고리 T
- **출처 트리거**: 사용자 환경 제약 — webhook(Fireblocks→은행 인바운드) 차단 가능 → 폴링 primary 재프레이밍
- **확정 재확인**: outbound 폴링 감지(List Transactions, T01) + Fireblocks Agent 폴링 선례(architecture.md:319·342) + egress whitelist(architecture.md:152) — Fireblocks 통합을 아웃바운드 전용으로 운영 가능
- **영향 페이지**: docs-site/wallet-design-walkthrough/04-deposit (인바운드 차단 callout + polling-primary 절)
- **신규 entity 0**

### Q-2026-07-03-V01: Vault·Address 생성 API 의 유일성·멱등·검색 semantics (createAccount / createDepositAddress get-or-create 실현 전제)

- **Why it matters**: 지갑 백엔드의 `createAccount`(vault) 와 `createDepositAddress`(주소) 를 get-or-create/재시도 복구로 설계하려면 벤더 API 가 유일성·멱등·이름 검색을 어디까지 보장하는지가 전제다. 특히 ① 계정은 벤더가 유일성을 **안** 보장해 우리 DB UNIQUE + 복구가 필요하고 ② 복구를 name 검색으로 하려면 `accounts_paged` 가 name 필터를 지원해야 하는데 미확인. 이 API 세부가 1·2페이지 설계의 실현 가능성을 좌우.
- **Where this came up**: docs-site/wallet-design-walkthrough/01-create-account·02-issue-deposit-address — createAccount=create+복구 vs createDepositAddress=get-or-create 계약 구분 검토 중 fact query.
- **확정 재확인 (wiki 인용)**:
  - createVaultAccount 요청 = `POST /v1/vault/accounts`, body `name`·`hiddenOnUI`·`customerRefId?`·`autoFuel` (`entities/fireblocks/vault-account.md` VaultAccount schema; `vendors/fireblocks/api.md:370`)
  - `customerRefId` = **AML funds-owner 귀속용**, 유니크·멱등 키 아님 (`vault-account.md:179·185`)
  - 멱등 키는 **트랜잭션(externalTxId, max255)·webhook 등록에만** 존재, **vault·주소 생성엔 wiki 상 없음** (`entities/fireblocks/transaction.md:394-406`, `api.md:324`)
  - **EVM = "1 vault account = 1 deposit address" 단일 강제** — account-based(no tag) 주소 개수 1, end-client별 unique 주소는 vault 분리(intermediate) (`vault-account.md:70-76`, source `account-and-wallet-structure.md` p.1-2). UTXO=N, tag계열=1주소+N tag
  - `GET /v1/vault/accounts_paged` 존재(paginated 목록) (`api.md:288`); 주소 발급 `POST /v1/vault/accounts/{vaultAccountId}/{assetId}/addresses` (`api.md:281`)
- **미확인 (openapi-spec 1차 확인 대상)**:
  1. createVaultAccount 가 **name 중복을 거부**하는가 (유니크 강제 여부) — 없으면 중복 vault 생성 가능 = 크래시 갭 근거
  2. `accounts_paged` 가 **name/namePrefix 쿼리 필터**를 지원하는가 — 없으면 name 검색 복구는 전 계정 페이지네이션이라 대규모(천만 계정)에 비현실적
  3. createVaultAccount·주소 발급에 **`Idempotency-Key` 헤더** 지원 여부 (Fireblocks 가 POST 에 24h Idempotency-Key 를 일반 지원한다고 알려짐 = 사전지식, 1차 미확인)
  4. **generateNewAddress 를 EVM 에서 2차 호출** 시 동작 — 기존 주소 반환 / 에러 / no-op 중 무엇인지 (단일 강제 "제약"만 확정)
  5. EVM 주소 **생성 시점** — asset wallet 활성화(`POST .../{assetId}`) 시 자동 생성인지, 명시적 generateNewAddress 호출인지
- **Sources to check**: `fireblocks/fireblocks-openapi-spec` open_api_spec.yml 의 `POST /vault/accounts`(request body·headers·유니크), `GET /vault/accounts_paged`(query params — namePrefix?), `POST /vault/accounts/{id}/{assetId}/addresses`(EVM 동작) · developers.fireblocks.com create-vault-account / create-address reference
- **답 (Stage 96, 1차: developers.fireblocks.com llms.txt→api-reference + `fireblocks-openapi-spec` open_api_spec.yml master; extract `sources/fireblocks/markdown/2026-07-03__developers-fireblocks-com__vault-address-api-semantics.md`)**:
  1. **name = optional, 유니크 강제 없음** — `POST /vault/accounts` requestBody schema(spec L72-114)에 개별 `required` 목록 없음, name/hiddenOnUI/customerRefId/autoFuel 전부 optional, 중복 거부 표현 전무 → **같은 name·무명으로 중복 vault 생성 가능(name=라벨)**.
  2. **accounts_paged namePrefix 지원** — `GET /vault/accounts_paged`(spec L115~) query param `namePrefix`(+nameSuffix) required:false → **서버측 prefix 필터 가능**(전 계정 페이지네이션 불필요). 단 name 비유니크라 결과 복수 가능 → 정확일치 클라이언트 재확인.
  3. **Idempotency-Key 지원 확정** — POST·PUT 헤더 `Idempotency-Key`(max 40자), 같은 키는 첫 응답(에러 포함) 그대로 반환·재실행 없음, **24h 보관**(api-idempotency). → createVaultAccount·주소생성 POST 에 적용 가능.
  4·5. **EVM 주소** — `POST .../{assetId}/addresses`(`generate_new_address`=`createVaultAccountAssetAddress`) 는 *"UTXO or Tag/Memo ONLY, account based 는 실패"* → **EVM 은 추가 주소 생성 불가, 단일 주소는 자산 지갑 생성(`createVaultAccountAsset`, Create Vault Wallet) 응답의 address**. 추가 주소는 vault account 추가로만. (1차 페이지: `sources/fireblocks/markdown/2026-07-03__developers-fireblocks-com__create-vault-wallets.md`)
- **Status**: ANSWERED

### Stage 95 Summary

- **신규 Q 중앙 등록 1건**: V01 (Vault·Address 생성 API 유일성·멱등·검색 semantics) — **open**. 카테고리 **V (Vault/Address API)** 신설
- **출처 트리거**: docs-site 1·2페이지 createAccount(create+복구) vs createDepositAddress(get-or-create) 계약 구분 검토 중 fact query
- **확정 재확인**: customerRefId=AML(유니크 아님) · 멱등키는 tx/webhook 전용 · **EVM 1 vault=1 address 단일 강제**(vault-account.md:70-76) · vault name 유니크는 벤더가 보장 안 함(→ 우리 DB UNIQUE 필요)
- **핵심 발견**: get-or-create 계약 차이의 하드 근거 = **벤더의 유일성 보장 유무** (주소=EVM 1강제 보장 O / vault name=보장 X)
- **신규 entity 0**

### Q-2026-07-03-T04: reorg 무효화를 Fireblocks 가 어떤 신호로 노출하는가 — "ORPHANED" 는 실재하는가

- **Why it matters**: 입금 페이지(docs-site 04)의 reorg 처리(가공분 되감기)와 폴링 코드가 `networkStatus === "ORPHANED"` 신호에 기대고 있다. 이 신호의 실재·정확한 필드/값이 확인되지 않으면 reorg 감지 로직 자체가 성립하지 않는다.
- **Where this came up**: docs-site 04-deposit networkStatus callout 검토 중 — callout 의 NetworkStatus enum(DROPPED·BROADCASTING·CONFIRMING·CONFIRMED·FAILED, source: `vendors/fireblocks/api.md:136-140` ← reference-transaction-objects)에 ORPHANED 가 없는 내부 불일치 발견.
- **★ Evidence 상태 (4-source 전수 + spec, 2026-07-03)**: ORPHANED 는 **curated wiki 0건 · markdown sources 0건 · webpages/sitemap 0건 · PDF 파일명 0건 · `fireblocks-openapi-spec` open_api_spec.yml 0건**. 존재하는 곳은 **우리 docs-site 산출물뿐**(wallet-design-walkthrough 04·06, wallet-service-components 일부, Kotlin 스켈레톤) → **사전학습 지식 혼입(fabrication) 가능성 높음**. log Stage 87 이 근거로 적은 transaction.md:104-121 도 현재 grep 0건.
- **확정 (wiki)**: `networkStatus` 필드 자체와 enum 5값(DROPPED/BROADCASTING/CONFIRMING/CONFIRMED/FAILED)은 확정 (api.md:136-140). reorg 가 EVM 성질이라는 것도 일반 사실.
- **Hypotheses (unverified)**: reorg 무효화는 ORPHANED 가 아니라 ① `networkStatus=DROPPED` ② 상위 status 의 FAILED/REJECTED ③ 별도 이벤트 중 하나로 노출될 가능성. 1차 자료 확인 전까지 docs-site 의 ORPHANED 서술은 미확정 취급.
- **Sources to check**: developers.fireblocks.com transaction statuses / transaction-objects(networkStatus) · support.fireblocks.io reorg 관련 문서 · Webhooks v2 event types
- **추가 부정 근거 (Stage 111, 1차 fetch)**: ① `reference/transaction-objects.md` 의 networkStatus enum = DROPPED·BROADCASTING·CONFIRMING·FAILED·CONFIRMED — **ORPHANED 없음** ② `reference-sub-statuses.md` 전체 목록에도 reorg/orphan 항목 없음 ③ `monitoring-transaction-status.md` 에 reorg 언급 없음. → **ORPHANED 는 실재하지 않는 것으로 사실상 확정**(docs-site 서술은 사전학습 혼입 — 정정 필요). 잔여: reorg 무효화 시 실제 신호(DROPPED? status 전이? 이벤트?)는 문서 미명시 — **샌드박스 PoC 또는 Fireblocks Support 질의로만 해소 가능**.
- **답 (Stage 129, Fireblocks Support 확답 — Slack, 백엔드 팀 확인, extract `sources/fireblocks/markdown/2026-07-03__fireblocks-support-slack__reorg-status-semantics.md`)**:
  1. **CONFIRMING → BROADCASTING 회귀 없음.**
  2. **reorg 로 거래가 취소(드랍)되면 실패·취소·만료로 표시** — 하위 상태 예시 **`DROPPED_BY_BLOCKCHAIN`**. 즉시 반영(유예 없음).
  3. 공식 문서 교차 확인: `reference-sub-statuses.md` 의 `DROPPED_BY_BLOCKCHAIN` = "…or that the transaction was **mined but dropped**" — reorg 드랍 커버.
  4. 얕은 reorg 재편입 케이스는 명시 확답 밖 — 상태 실시간 반영 원칙상 CONFIRMING 유지·confirmation 재계산으로 해석.
  → 무효화 판정 = **status FAILED(또는 CANCELLED·만료) + subStatus `DROPPED_BY_BLOCKCHAIN`**.
- **Status**: ANSWERED (Support 확답 + 공식 substatus 교차) · 정본 반영: [[entities/fireblocks/transaction]] "reorg 시 상태 전이" 절 (Stage 150, raw `sources/fireblocks/csm.txt`)

### Q-2026-07-09-C02: boost/drop 을 승인 단계에서 원본과 결정적으로 연결 — 이중 주체 zero-trust 승인

- **Why it matters**: 우리 거버넌스는 **JV·운영사 두 주체 co-approval** 인데 둘은 다른 trust boundary(직접 API 불가·zero-trust). boost/drop tx 를 원본과 연결하려면 **Fireblocks 가 서명한 콜백 payload** 안에 불변 식별자가 있어야 하나, **승인 단계 payload 엔 없다** → 승인자가 이 요청이 기존 tx 의 boost/drop 인지 판별 불가. approver-only 주체(은행)는 JV 가 만든 dropTransaction 응답도 신뢰 못 함.
- **확정 (CSM, `sources/fireblocks/csm2_boost.txt`)**: ① `rawTx` 는 서명 단계에만(승인 = 직렬화 이전 — fee 변동 때문에 승인 후 직렬화) ② 승인 콜백에 `replaceTxByHash`·원 txId·nonce 없음 ③ **RETRY 우회(최대 20회·~3분·~1h)** 는 이중 주체 co-approval 엔 부적합 ④ 현행 연결책 = **"Get Transaction by ID" 의 `replacedTxHash`**(boost·drop 공통). internal note 는 고객 설정 가능이라 침해 시 신뢰 불가.
- **요청 (feature request open)**: 승인+서명 콜백 payload 에 `replaceTxByHash`(또는 originalTxId) 포함. Fireblocks 제품팀 검토 중(플로우 다이어그램 제출 요청받음).
- **적용처**: [[entities/fireblocks/callback-handler]] §"승인 단계 제약", [[entities/fireblocks/transaction]] §"Boost (RBF) 메커니즘".
- **Status**: OPEN — Fireblocks 제품팀 검토 중. 현행 우회("Get Transaction by ID" `replacedTxHash`)로 진행 가능.

### Q-2026-07-03-G01: Fireblocks Gasless Service 의 정체와 설계 적용 가능성

- **Why it matters**: 수수료 설계(워크스루 6장 estimateFee·출금 gas)에서 GSN/paymaster 계열 gas 대납을 검토 중, **Fireblocks 자체 Gasless Service 가 실재**함을 확인(사용자 스크린샷 + sitemap). 이 기능의 메커니즘에 따라 "고객 vault 에 ETH 없이 sweep/전송" 이 벤더 네이티브로 가능할 수 있어 Gas Station·수수료 설계 전반에 영향.
- **Where this came up**: GSN/paymaster 리서치(Stage 129) — dev docs llms.txt 0건으로 "미지원" 판정했으나 **범위 오류**: support 헬프센터에 Gasless Service 섹션 존재. 부정 확인 정정.
- **확정**: 문서 15건 존재(제목·URL — `sources/fireblocks/markdown/2026-07-03__support-fireblocks-io__gasless-service-index.md`). 본문은 Cloudflare 차단(curl·WebFetch 403)으로 미수집.
- **Hypotheses (제목 기반 추정, unverified)**: ① relay 주체 3형태(local/외부 워크스페이스/Fireblocks Relay)를 고르는 대납 모델 ② Solana Gasless 존재 → ERC-4337 이 아닌 자체 relay 아키텍처 ③ "Universal Gasless" 가 체인 통합판, "integrated chains" 문서가 지원 체인 목록 ④ fee contingencies = 대납 실패·정산 처리.
- **확인 질문**: 누가 gas 를 내나(relay 워크스페이스의 잔고?) · 발신 vault 에 base asset 없이 ERC-20 전송이 되나(sweep 에 적용 가능?) · 지원 체인(EVM 전반? Base?) · Gas Station 과의 관계(대체? 병행?) · 수수료 정산 방식 · API 표면(createTransaction 옵션?)
- **Sources to check**: 사용자 브라우저로 본문 제공(About/Universal Gasless/integrated chains 우선) · Fireblocks SA/Support
- **답 (Stage 131 — Source Lake 의 헬프센터 PDF 14건 발견, 6건 pdftotext Mode C 추출: `2026-07-03__support-fireblocks-io__gasless-service-extract.md`)**:
  1. **실재 확정** — Gasless Service 는 Gas Station 과 "별개 제품, 다른 프로토콜"(원문 명시). fee 지불을 전용 vault/제3자/Fireblocks 에 위임.
  2. **메커니즘 = ERC-3009 · ERC-2771 · EIP-7702** (ERC-4337 paymaster 아님). **Universal Gasless = EIP-7702 기반** — 첫 gasless tx 때 vault(EOA)가 smart contract wallet 로 자동 승격, 전 이더리움 자산(ERC-20/721/1155)·Transfer/Contract Call/Mint/Burn 지원. 구 Limited Gasless = Ethereum USDC·DAI(3009)+tokenization(2771).
  3. **relay 3형태 확정**: local vault / external workspace / **Fireblocks Relay(프리미엄 — Fireblocks 가 gas 선지불, 월말 통합 인보이스 = 실비+구독료, CSM 경유 활성화)**.
  4. **지원 체인**: Ethereum·Optimism·**Base**·Arbitrum·Polygon·BSC (+각 testnet, Base Sepolia 포함). Solana·Tron(GasFree) 은 별도 메커니즘.
  5. **운영 caveat**: Gasless Relay 는 **stuck tx auto-boost 미지원 — 수동 RBF boost 필요**. API 표면: error 1455 "Missing Gasless configuration"(relayer/fee payer 설정). Console: Settings>General>Gasless transactions, 기본값 3모드+per-tx 재정의, Policies 연동.
- **보강 (Stage 137, `docs/sweep-funds` + `reference/sweep-to-omnibus-1` fetch)**: ★ **ETH 네이티브 전송은 Universal Gasless 대납 불가 공식 확정** — "does not relay native ETH transfers — Gas Station remains the right choice for sweeping ETH itself". external relay 의 컴플라이언스 용도("prohibit holding ETH in the sweeping workspace")·Fireblocks relay 의 "no ETH holding required anywhere" 원문 확보. sweep 가이드가 ref↔vaultId 내부 원장 전제를 명시(우리 1장 설계와 일치).
- **잔여 확인 추가 (Stage 168 — validity window fact query)**:
  1. **Universal Gasless 의 온체인 유효기간(4337 `validUntil` 상당) 지원 여부** — 헬프센터 추출 6건·인덱스 15건·curated·sitemap 4-source 전수 검색에서 언급 0건. 구조상 7702 노선이라 UserOperation validUntil 이 실릴 자리가 없고, 위임 코드가 시간창 검증을 내장하는지는 MPC↔7702 내부 동작과 같은 묶음(위임 코드 내부 미공개).
  2. **gasless 거래에도 `transactionTimeout`(workspace 기본 + per-signer/per-tx 재정의 — [[entities/fireblocks/transaction]] §시간 제약, source: reference-sub-statuses.md)이 적용되는지** — 일반 거래 문서라 gasless 경유 명시 없음. 답에 따라 서명-전 층의 마감일 제어 커버리지가 갈림. CSM 질문 후보.
- **잔여 2건 확답 (Stage 169 — CSM Q&A, `sources/fireblocks/markdown/2026-08-24__fireblocks-csm__universal-gasless-validity-window.txt`)**:
  1. **온체인 유효기간 있음·고정** — delegate(UniversalGaslessDelegate) 의 EIP-712 struct `AuthorizedExecutions(Execution[] calls, uint256 deadline, bytes32 mode, uint256 nonce, address relayer)` 의 `deadline`. `execute()` 가 nonce 소비 전 `block.timestamp <= deadline` 검사(늦으면 revert) — 4337 `validUntil` 동등. `validAfter`·블록번호 변형 없음. **deadline = 서명 시각+2시간, enclave 계산, API 필드 없음**(설계 고정값). 부가 보장: relayer 주소가 digest 에 바인딩(지정 relayer 만 제출 가능, 유출 서명 무력)·nonce 단회. → Stage 168 의 "위임 코드가 시간창 검증을 내장하는지" 가설이 사실로 확정.
  2. **gasless 에도 pre-broadcast 만료 적용** — `configurations.expiresAfterSeconds`, 공유 거래 생성 경로라 gasless carve-out 없음. 기본 비활성(요청 시 활성화)·10분~24시간(workspace 기본값 동일 한도)·dev doc '300' 오기(→'600'초 수정 예정). 두 층 모두 pre-broadcast: 거래 expiresAt 만료(유예 없음) + signing token 단축(enclave 강제). 두 메커니즘은 독립·정렬 불가(10분 floor vs 2h 고정). ※ `transactionTimeout` 과의 명칭 관계는 답변에 없음 — 미확인으로 유지.
- **Status**: ANSWERED (잔여 CSM/PoC: 정산 세부 단가·구독료 · MPC↔7702 위임 내부 동작 · expiresAfterSeconds↔transactionTimeout 명칭 관계)

### Stage 96 Summary

- **V01 ANSWERED** (1차: developers.fireblocks.com llms.txt→api-reference + `fireblocks-openapi-spec` open_api_spec.yml master). 5개 항목 전부 확정:
  - name optional·유니크 없음(중복 vault 가능) · accounts_paged **namePrefix 필터 지원** · **Idempotency-Key**(POST/PUT·40자·24h) · EVM 주소는 **UTXO/Tag only 라 account-based 실패**(단일 주소=wallet 활성화 유래)
- **소스 저장**: `sources/fireblocks/markdown/2026-07-03__developers-fireblocks-com__vault-address-api-semantics.md` (Mode C extract)
- **설계 반영**: docs-site 01-create-account 에 Idempotency-Key=f(ref)·ref UNIQUE·name=라벨 fallback 반영(다이어그램 + "재시도·중복 방어" 결정 callout)
- **신규 entity 0**

### Q-2026-07-07-C01: Notabene 통합 vs TRLink(Travel Rule Support) 의 관계

- **Why it matters**: 트래블룰 도입 시 어느 통합 경로를 쓸지가 첫 결정. 두 문서군이 서로를 언급하지 않아 병행인지 세대교체인지 불명.
- **확정**: Notabene 통합 = 기본 파트너십, `/v1/screening/travel-rule/*` (validate·validate/full·vasp). TRLink = 제공자 중립 레이어, 명시 파트너 Sumsub·GTR, `/v1/screening/trlink/*`, 법적 실체 단위 설정 (Stage 143 — developers reference 2건 + support PDF).
- **확인 질문**: 신규 도입 권장 경로는? Notabene 을 TRLink 파트너로도 붙일 수 있나? 기능 차이(정책 3단 vs 2단)?
- **Sources to check**: CSM · developers.fireblocks.com Travel Rule 섹션 잔여 페이지
- **보강 (Stage 144)**: compliance-integrations.md p.3 의 연결 가능 제공자 목록에 Chainalysis·Notabene·Sumsub·Elliptic 이 병렬 등재 — Notabene(직접 통합)과 Sumsub(TRLink 파트너)가 같은 목록에 있어 병행을 시사하나 명시는 없음.
- **Status**: open (partial)

### Q-2026-07-07-C02: Travel Rule 의 TAP 상호작용 · 관할권 임계값 · Blocking Time 기본값

- **Why it matters**: 출금 파이프라인(워크스루 6장)에서 스크리닝 게이트의 정확한 위치(서명 전 어느 단계, TAP 과의 선후)와 한국 임계값(원화 100만원 기준 적용 방식)이 설계·정책 작성에 필요.
- **확정 (Stage 143)**: Post-Screening Accept 의 출금 설명 "you can now sign them" → 스크리닝은 서명 전 게이트 (travel-rule-post-screening-policy.md, p.3). Wait 은 Pending 최대 4시간. Blocking Time 은 in/out 별 advanced settings 로 조정 가능 — 기본값은 미확인.
- **확인 질문**: TAP 평가와 Travel Rule 스크리닝의 순서? 한국 관할 임계값 설정 방법(AmountUSD 만 지원?)? Blocking Time 기본값?
- **답 (Stage 144 — advanced-configuration·about 등 잔여 전량 추출)**: ① delay 기본값 확정 — Inbound 30초(최대 7일)·Outbound 0초(최대 90분, JWT lifetime)·Pending 최대 4시간. ② TAP 용어는 compliance 문서군 19종 전체에 부재 — 확정된 순서는 OFAC 백엔드 대조가 "사용자 Policy 규칙보다 먼저"(global-policy-ofac, p.1), AML → Travel Rule(compliance-integrations, p.1–2)뿐. ③ 임계값은 "관할권이 결정"만 — 한국 수치 적용 방법 미확정.
- **Status**: open (partial — 한국 임계값·TAP 명세만 잔여, CSM 대상)

### Q-2026-07-08-C03: VerifyVASP(국내 트래블룰 망) 를 Fireblocks 와 함께 쓸 수 있는가

- **Why it matters**: 국내 VASP 상대 트래블룰은 국내 연합망(VerifyVASP 등)이 실무 축이 될 가능성이 큼. Fireblocks 확인 문서(Stage 143·144, 19종 + developers 3건)의 제공자 목록에는 부재 — Notabene(직접)·Sumsub·GTR(TRLink)·Chainalysis·Elliptic 뿐. 지원 여부에 따라 트래블룰 게이트가 벤더 안(정책 틀 유지)이냐 우리 업무층(가용 전이 게이트 자체 설계)이냐가 갈림.
- **확정**: VerifyVASP = 체인 비종속 오프체인 P2P 메시징(FATF R.16) — Stage 86 deep-research (vendors/nodeinfra/nodewallet.md). TRLink 파트너 목록은 GET /v1/screening/trlink/partners 로 조회 가능.
- **확인 질문**: TRLink 파트너로 VerifyVASP 등록 가능? Notabene↔VerifyVASP 상호운용? 국내/해외 병행 라우팅 시 벤더 정책 틀과의 관계?
- **Sources to check**: CSM · GET /v1/screening/trlink/partners 실조회 · VerifyVASP 측 문서
- **설계 반영**: docs-site/travel-rule/ 9장 "VerifyVASP 를 쓴다면" (경로 A/A′/B)
- **진전 (Stage 146 — 공개 리서치, sources/travel-rule/webpages/ Mode B 5건 · Stage 148 클러스터 이동)**:
  1. **구조 확정**: 폐쇄형 연합망(150+ 회원·30+ 관할권) — 설치형 Enclave(Docker, 키·PII 보관) + 중앙 API. IVMS101. 출금 사전 허가형(주소 소유 확인 → PII 전송·사전 승인 → 전송 → tx hash 보고). 입금은 수신용 VASP API(Verify User·Verify User Account·Callback)를 우리가 구현하는 요청-응답. non-custodial 미지원.
  2. **경로 A′ 가설**: "Code·GTR·VerifyVASP·Sumsub 상호운용"(Sumsub 아티클, 논문 인용 2차) — GTR·Sumsub = Fireblocks TRLink 파트너 → TRLink 경유 도달 가능성. 실효(회원별 도달)는 미확인.
  3. **국내 맥락**: 임계값 100만원(2022-03-25) · CODE↔VerifyVASP 상호 연동 완료(2022-04-25 0시 — 4대 거래소 입출금 재개. ★ Stage 149 정정: 당초 "금융당국 권고" 로 기록했으나 미확인 — 코인원 공지·언론 교차로는 거래소 간 연동 작업 완료) · VerifyVASP 유료화 후 CODE 병행 사례 (2차 출처).
  4. Notabene 은 VerifyVASP 지원을 "보안 검토 대기"로 검토 중 — 미완 (Notabene 분석 페이지).
- **잔여 확인 질문**: 경로 A′ 실효(Sumsub/GTR 고객 ↔ VerifyVASP 회원 실제 도달) · TRLink 파트너 직접 등록 가능성 · Enclave 운영 요건(리소스·보안 요구)·가격 · 해외 상대 커버리지
- **Status**: open (구조·국내 맥락 확정, 도달 경로 실효만 잔여 — CSM·Sumsub 대상)

### Q-2026-07-14-01: API action enum `2-TIER` 와 Console 3-action "Approved by" 의 대응

- **Why it matters**: Policy Editor API 로 정책을 운반하는 정책 관리 서비스(blockchain-manager/docs/정책관리)가 rule 을 다룰 때, API enum 과 Console 개념 모델의 대응이 확정돼야 감사 기록·대조가 정확해진다.
- **확정 (Stage 156)**: API rule object 의 action = `ALLOW` / `BLOCK` / `2-TIER` (reference-configure-transaction-authorization-policy.md §"The Policy Rules structure"). Console 문서의 3-action = Allow / Approved by / Block (how-policies-work.md, p.1 — Stage 10). 두 문서 모두 상호 대응을 명시하지 않음.
- **확인 질문**: `2-TIER` = "Approved by" 인가? `authorizationGroups` 가 있는 rule 은 action 을 어떤 값으로 두는가?
- **Sources to check**: developers.fireblocks.com Policy Editor API reference (endpoint schema) · CSM
- **Status**: open

### Q-2026-07-14-02: Policy Editor V2 표면과 `policy-editor-beta` 경로의 관계 · GA 상태

- **Why it matters**: blockchain-manager 정책관리 설계(01-policy-change.md)는 "Policy Editor V2 기준, Beta 표면은 쓰지 않는다"로 결정했는데, wiki 에 ingest 된 API 가이드(Stage 156 promote)의 엔드포인트 경로는 `policy-editor-beta` 다. 구현 착수 전 어느 표면이 정본인지 확정 필요.
- **확정 (Stage 156)**: reference-configure-transaction-authorization-policy.md 의 endpoint 링크는 전부 `/api-reference/policy-editor-beta/*` (send-publish-request-for-a-set-of-policy-rules · get-the-active-policy-and-its-validation). V2 표면의 존재·경로는 wiki 4-source 에 근거 없음.
- **확인 질문**: V2 표면의 정식 경로·GA 여부? beta 와 draft/publish 분리 모델 차이? 마이그레이션 예정?
- **Sources to check**: developers.fireblocks.com API reference 최신판 · changelog · CSM
- **Status**: open

### Q-2026-07-22-01: Base COMPLETED (시퀀서 층) 의 메인넷 동일 여부

- **Why it matters**: Base 입금 확정 판정(`COMPLETED && 컨펌 ≥ 임계`)의 보증 수준이 시퀀서 층으로 확정되면, safe/finalized 보증이 필요한 입금은 자체 L1 확인 층이 필수가 된다. 테스트넷 관측의 메인넷 일반화 확인 필요.
- **확정 (Stage 158)**: Base 테스트넷 콘솔 직접 테스트에서 COMPLETED 도달 1초 미만 — 시퀀서 soft confirmation 기준 (L1 safe 5~10분과 양립 불가한 속도).
- **확인 질문**: 메인넷도 동일 메커니즘인가? `numOfConfirmations` 의 분모는 Base 블록인가?
- **Sources to check**: CSM 확답 · 메인넷 소액 테스트
- **Status**: open

### Q-2026-07-22-02: Base 시퀀서 장애·드랍 시 COMPLETED 이후 상태 전이

- **Why it matters**: COMPLETED 가 시퀀서 약속 층이라면, L1 게시 전에 시퀀서가 블록을 되돌리는 경우 이미 COMPLETED 된 tx 의 전이(FAILED + `DROPPED_BY_BLOCKCHAIN` 적용 여부)가 입금 무효 처리 설계의 전제가 된다.
- **확인 질문**: L2 층 드랍도 `DROPPED_BY_BLOCKCHAIN` 으로 전이하는가? Fireblocks 가 L1 게시 전 시퀀서 되돌림을 감지·반영하는가?
- **Sources to check**: CSM · support.fireblocks.io substatus 문서
- **Status**: open

### Q-2026-08-06-01: Fireblocks Network 전송의 정산 방식

- **Why it matters**: Network transfer 가 온체인 전송인지 Fireblocks 내부 장부 이동(오프체인 넷팅)인지에 따라 확정 판정 근거가 달라진다. 온체인이면 기존 컨펌 임계 로직이 그대로 적용되고, 내부 이동이면 컨펌 개념 자체가 없어 별도 확정 신호가 필요하다.
- **확인 질문**: Network transfer 가 블록체인에 기록되는가? `numOfConfirmations` 가 채워지는가? Automatic Address Rotation 이 "주소가 회전한다" 고 말하는 것은 온체인 전송을 전제하는가?
- **Sources to check**: support.fireblocks.io Fireblocks Network 섹션 · CSM 확답
- **Status**: open

### Q-2026-08-06-02: Fireblocks Network 이용 비용

- **Why it matters**: 도입 판단의 전제. 회원 자격·연결 수·전송량 중 무엇에 과금되는지에 따라 화이트리스트 제거의 이득과 비교 가능해진다.
- **확인 질문**: Network 이용에 별도 요금이 있는가? 계약 등급에 포함되는가?
- **Sources to check**: 계약 문서 · CSM 확답
- **Status**: open

### Q-2026-08-06-03: Network 연결 해제 시 동작

- **Why it matters**: 상대가 연결을 끊으면 그 연결로 지정된 routing 과 진행 중 전송이 어떻게 되는지가 운영 절차의 전제다. `NONE` routing 이 입금 실패를 낳는다는 사실과 맞물려, 해제가 곧 입금 실패로 이어지는지 확인이 필요하다.
- **확인 질문**: 연결 해제는 한쪽이 단독으로 가능한가? Admin Quorum 승인 대상인가? 해제 후 그 연결로 온 입금은 실패하는가, profile routing 으로 흡수되는가?
- **Sources to check**: support.fireblocks.io Fireblocks Network 섹션 · network-connections DELETE API
- **Status**: open

### Q-2026-08-06-04: DVP 정산의 컨트랙트 구조와 지원 범위

- **Why it matters**: `ASYNC` 는 다리별 즉시 전송이라 한쪽만 이행되는 상태가 성립한다. 원자적 교환이 필요한 정산은 `DVP` 가 전제인데, Early Access 라 사용 가능 여부부터 확인해야 한다.
- **확인 질문**: 어떤 컨트랙트인가(Fireblocks 배포 컨트랙트인가 표준 escrow 인가)? 지원 체인·자산 범위? Early Access 활성 조건? 한쪽이 이행하지 않으면 approve 한 자산은 어떻게 회수되는가?
- **Sources to check**: CSM 확답 · developers.fireblocks.com Smart Transfers Developer Guide
- **Status**: open

### Q-2026-08-06-05: Smart Transfer 티켓이 Admin Quorum · Policy 대상인가

- **Why it matters**: create ticket 권한이 Editor 까지 열려 있는데 Admin Quorum 승인 언급이 없다. 티켓 이행이 곧 자금 이동이므로, 승인 관문이 없다면 Policy 층에서 막아야 한다.
- **확인 질문**: 티켓 생성·이행이 Admin Quorum 승인 대상인가? Policy 의 source/destination 규칙이 Smart Transfer 이행 전송에 적용되는가? `NETWORK_CONNECTION` peer 로 평가되는가?
- **Sources to check**: about-policies 재확인 · CSM 확답
- **Status**: open

### Q-2026-08-20-01: MPC-CMP (ECDSA 기반) 커스터디의 PQC 전환 경로

- **Why it matters**: 체인 네이티브 서명 키는 체인 프로토콜에 종속돼 (ECDSA/EdDSA) 사업자가 단독으로 PQC 로 바꿀 수 없다 (컨트랙트가 검증하는 스마트 계정은 예외 경로). HNDL 공격 관점에서 서명 키보다 통신·백업 구간이 먼저 노출된다는 업계 주장도 있다 (source: 2026-08-20__newstheai-com__hancomwith-the-shift-strategy.md — 한컴위드, ECC 가 양자컴퓨터에 직접 위협). Fireblocks 측 PQC 로드맵은 wiki 4-source 어디에도 없음.
- **확인 질문**: Fireblocks 는 MPC-CMP 키 체계·co-signer 통신·key backup 각각에 PQC 계획이 있는가? 하이브리드 (기존 채널 위 PQC 계층) 접근인가?
- **Sources to check**: Fireblocks 공식 blog/docs PQC 검색 · CSM 확답
- **부분 답 (2026-08-20)**: Fireblocks 공식 블로그 (2026-04-01, VP Research Michael Gutkin) 수집 — PQC 계획 있음 (4축: 체인 계층 추적(BIP 360/P2MR 등·재단 협의) · PQC 서명의 co-signer 모델 통합 연구 · 내부 스택 감사(인증서·at-rest·인증·TLS·3rd-party) · 표준 기구 참여). 코드 기반·다변수 PQC 가 MPC 에 자연스럽게 적합할 수 있다 평가, NIST ML-DSA·SLH-DSA·FN-DSA + Round 2 후보 검토. 현재 조치는 주소 위생 (P2WPKH 공개키 은닉 · Network 자동 주소 로테이션 · 주소 재사용 금지). 체인 쪽 전환은 프로토콜 결정 종속 — "수렴 시점에 MPC 구성이 준비돼 있게 한다". (source: 2026-08-20__fireblocks-com__google-quantum-research-institutional-crypto-security.md)
- **잔여**: 하이브리드 (기존 채널 위 PQC 계층) 접근 여부 · key backup 평면의 계획 — 전체 PQC 전략 문서 (2026 하반기 공개 예고) 대기
- **Status**: partial-answered

### Q-2026-08-28-KL06: KeyLink Flow 의 정체·통제 범위·가격

- **Why it matters**: CSM 확답(2026-08-28)이 Customer Server 를 직접 구축하지 않을 때의 제품화 대안으로 **KeyLink Flow** (운영 콘솔을 갖춘 패키지형 온라인 서버, 맞춤 개발 대부분 대체) 를 제시. 채택 시 Customer Server 구축·소유 부담(Risk-KL01·KL02)의 상당 부분이 벤더 패키지로 이동하나, 공개 자료·wiki 4-source 에 KeyLink Flow 문서 없음.
- **확인 질문**: 호스팅 주체(고객 인프라 vs Fireblocks)? HSM 연결 방식(PKCS#11 Luna 포함?)과 지원 HSM? Policy·Audit Log 연동 범위? 커스텀 검증 로직 삽입 가능 여부? 과금(add-on 별도?)? Cold(offline) 모드 지원?
- **Sources to check**: CSM 후속 · support.fireblocks.io Key Link 섹션 재검색
- **Status**: open

### Q-2026-08-28-KL07: 7일 durable 서명 요청 큐와 Pending Signature 2h timeout 의 관계

- **Why it matters**: CSM 확답 — 미전달 서명 요청은 Fireblocks 측 큐에 최대 7일 보존·at-least-once. 반면 transaction state machine 은 Pending Signature 2h 미서명 시 fail ([[entities/fireblocks/transaction]] §"시간 제약"). 두 수치가 다른 층(전달 큐 vs tx 수명)인지에 따라 Agent 장애 허용 시간이 2h 인지 7일인지 갈림 — Risk-KL01 의 실제 RTO 기준.
- **확인 질문**: Agent 가 3h 뒤 재접속하면 큐의 요청은 재전달되나, 이미 TIMEOUT 된 tx 는 어떻게 되나? `transactionTimeout` 재정의가 이 창을 늘리나? 7일 보존은 Key Link 전용인가?
- **Sources to check**: CSM 후속 · fireblocks-agent 저장소 README (큐 semantics)
- **Status**: open

### Q-2026-08-28-KL08: Key Link 가격 구조

- **Why it matters**: 도입 예산 산정. CSM 은 가격을 담당자(Ben Han · Shane Verner)에게 위임.
- **확정 조각 (CSM 2026-08-28, `2026-08-28__fireblocks-csm__key-link-thales-luna-qna.txt`)**: Key Link = Fireblocks 구독의 **유료 add-on** · Professional Services 구현 패키지 **별도 견적** · Luna 하드웨어·Thales 라이선스는 **Thales 직접 구매, Fireblocks 계약 외**
- **확인 질문**: add-on 단가 체계(workspace 당? 키 당? 거래량?) · 개발·UAT·운영·DR workspace 별 견적 · PS 패키지 범위·필수 여부 · KeyLink Flow 별도 과금 여부
- **Sources to check**: Fireblocks 영업 담당 회신
- **Status**: open

### Q-2026-09-01-C01: SGX enclave 키로 암호화된 secrets.db 의 cross-machine 복호화 메커니즘

- **Why it matters**: 장비 교체(migration) 절차의 신뢰 경계. `secrets.db` 는 "encrypted with a key generated in a secure SGX enclave" 인데, 공식 절차는 `secrets.db` + `ra_loader_enclave.signed.so` 를 **다른 물리 장비**에 복사 후 `./cosigner start` 로 복구된다고 명시 — SGX sealing 은 통상 machine-bound 인데 어떤 메커니즘(remote attestation 재발급? loader 를 통한 re-seal? Fireblocks 서버 개입?)으로 이동성이 성립하는지 미명세. PM 2대 HA 운영 시 백업 반출·복구 설계의 전제가 됨.
- **Where this came up**: [[entities/fireblocks/cosigner]] §"Stage 172 — SGX Co-signer 백업·장비 교체"
- **확인 질문**: 새 장비에서 첫 start 시 Fireblocks 측 재승인(Owner key share 승인 등)이 필요한가? 복사만으로 기존 페어링·key share 가 그대로 유효한가?
- **Sources to check**: `api-cosigner-troubleshooting.md` (저장본) · Fireblocks Support/CSM
- **Status**: open

### Q-2026-09-04-T01: vault → vault 이동은 입금 감지에 잡히나 (거래 1건 vs 출금+입금 2건, 자기 주소 인식 여부) — **ANSWERED (Stage 173)**

- **Why it matters**: 내부 이동(sweep·delta·rebalancing)이 고객 입금으로 오발행되면 유령 입금이 된다. 방향 판정 규칙([[entities/fireblocks/transaction]] §"Stage 173", 블록체인매니저/설계/04)이 내부 이동에도 맞는지 확정해야 한다.
- **Where this came up**: [[entities/fireblocks/transaction]], [[entities/fireblocks/vault-account]], blockchain-manager/docs/블록체인매니저/설계/04-detect-confirm.md
- **이전 근거**: `2026-05-22__developers-fireblocks-com__reference-transaction-webhooks.md` rewardsInfo 설명의 부수 문장("vault-to-vault 거래에만 양쪽 필드가 나타난다")만 있어 간접 근거로 분류.
- **답 (PoC 실측 2026-09-04, `blockchain-manager/docs/BC/설계/92-vault-to-vault-poc-result.md`)**: ① destination `VAULT_ACCOUNT` 지정 → 거래 1건, source·destination 모두 vault, 받는 vault 기준 입금 거래 없음, 웹훅 7건. ② destination `ONE_TIME_ADDRESS`(자기 vault 주소) → 같은 txHash 로 거래 2건. 출금 거래 + 체인 반영 44초 뒤 생성되는 입금 거래(source `UNKNOWN`/`External`, externalTxId 없음). Fireblocks 는 자기 주소를 vault 로 되돌려 인식하지 않는다. 웹훅 7 + 2 = 9건. ③ 두 방식 모두 conf 3 에서 COMPLETED.
- **Applied to**: [[entities/fireblocks/transaction]] §"Stage 173" · 블록체인매니저/설계/04-detect-confirm.md (내부 이동 VAULT_ACCOUNT 지정 규칙 · sourceAddress 2차 방어) · BC/설계/99-detection-detail.md · BC/Fireblocks QnA/01-qna.md
- **남은 것**: DCCP vault-to-vault 0 conf 적용 시 웹훅 형태 · 다른 workspace 의 vault 주소로 보낸 경우 · Universal Gasless 경로. 별도 Q 로 승격할 만큼의 필요는 아직 없음.
- **Status**: **answered (2026-09-04, Stage 173)**
