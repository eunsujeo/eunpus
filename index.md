# waas-wiki — Catalog

Fireblocks-focused **Wallet-as-a-Service (WaaS)** 리서치 LLM wiki 의 전체 페이지 인덱스. 본 카탈로그는 [llm-wiki.md](llm-wiki.md) 패턴의 `index.md` (content-oriented catalog) 역할.

- 패턴 메타: [llm-wiki.md](llm-wiki.md)
- 운영 진입점: [CLAUDE.md](CLAUDE.md)
- 변경 이력: [log.md](log.md) (39 stage)
- Wiki health check: [lint-report.md](lint-report.md) (Stage 35)
- 프로젝트 개요: [README.md](README.md)

## Curated Wiki (LLM-authored)

> Schema convention: 6-section template (Summary / Key Concepts / Details / Related Pages / Sources / Open Questions). 모든 fact 에 `(source: …)` 출처 + 양방향 wikilink. 자세히: [prompts/update-wiki.md](prompts/update-wiki.md).

### Vendor Hubs (vendors/fireblocks/) — 16 docs
_벤더별 도메인 hub. 권한 / 아키텍처 / MPC / Policy / TAP / Cosigner / Compliance 등 영역 진입점_

- [API](vendors/fireblocks/api.md) — REST API / SDK / Webhook 표면.
- [Architecture](vendors/fireblocks/architecture.md) — 시스템 전반의 아키텍처: 어떤 컴포넌트가 있고 어떻게 통신하는가.
- [Authentication](vendors/fireblocks/authentication.md) — Console·API 사용자의 로그인 인증 모델 통합. SSO / 2FA / password / CSR / API key / IP allowlist 한 페이지.
- [Blockchains](vendors/fireblocks/blockchains.md) — Reference / catalog hub for Fireblocks의 blockchain 자산 도메인. Workspace management/security 도메인과 결이 다른 자산 평면. Chain-specific 자료는 placeholder...
- [Callback Handler](vendors/fireblocks/callback-handler.md) — Cosigner가 자동 서명 전에 호출하는 외부 검증 훅.
- [Compliance](vendors/fireblocks/compliance.md) — 컴플라이언스·인증·규제 대응 측면.
- [Cosigner](vendors/fireblocks/cosigner.md) — 고객 측에서 동작하는 자동 서명·정책 평가 컴포넌트.
- [Lifecycle Events](vendors/fireblocks/lifecycle-events.md) — Workspace user / 디바이스 / Owner의 lifecycle 이벤트(생성·수정·역할 변경·삭제·재인증·이전)와 각 단계의 거버넌스·운영 함의.
- [Mobile App](vendors/fireblocks/mobile-app.md) — Fireblocks mobile app 제품 전반: About / 인증·요구사항 / Updates / 승인 범위 / Labs(Batch) / New UX. Mobile device 자체의 사전 정의는 [[entities/fireblocks/mob...
- [MPC](vendors/fireblocks/mpc.md) — Fireblocks의 MPC(Multi-Party Computation) 구현. 키 생성/분산/서명/리프레시.
- [Overview](vendors/fireblocks/overview.md) — Fireblocks가 어떤 제품/플랫폼인지에 대한 1차 개관. 다른 모든 vendor 페이지의 진입점.
- [Policy Engine](vendors/fireblocks/policy-engine.md) — 거버넌스·승인 규칙을 정의하고 강제하는 정책 엔진.
- [Risks](vendors/fireblocks/risks.md) — Stage 1–4 자료에서 직접 확인된 리스크 / 단일 실패점 / 운영 부담. 외부 인시던트·CVE 등은 추후 자료.
- [Security](vendors/fireblocks/security.md) — Security / Governance hub — Fireblocks workspace의 운영 보안 체크리스트와 권장 사항을 한 페이지에 통합. 실제 위험·완화는 [[vendors/fireblocks/risks]], 규제·인증은 [[vendors...
- [TAP (Transaction Authorization Policy)](vendors/fireblocks/tap.md) — 트랜잭션 단위 권한·승인 규칙. Policy Engine 위에서 동작.
- [User Management](vendors/fireblocks/user-management.md) — Workspace 사용자 모델, 9개 user role, 권한 매트릭스, Sandbox 차이.

### Entities (entities/fireblocks/) — 23 docs
_고유 이름·반복 등장 명사 단위 entity. workspace / vault account / transaction / policy / MPC key share 등_

- [2FA (Two-Factor Authentication)](entities/fireblocks/2fa.md) — Fireblocks Console 로그인에 모든 사용자가 필수로 요구되는 2차 인증. TOTP (Time-based One-Time Password) 기반이며 Google / Microsoft / LastPass / Yubico Authentic...
- [Admin Quorum (Fireblocks)](entities/fireblocks/admin-quorum.md) — Workspace·Policy 변경의 다수결 승인 그룹. 권한표의 Q (Quorum required) 및 Q+O (Quorum + Owner) 라벨이 이 메커니즘을 표기한다 (source: 2026-05-18__support-fireblocks-...
- [API Co-signer (Fireblocks)](entities/fireblocks/api-co-signer.md) — 상태: 부분 정의. Stage 1에서는 이름만 확인; Stage 4에서 페어링·variant·Callback Handler 결합·재등록 흐름이 추가됨. 내부 cryptographic 명세는 추후 ingest 필요.
- [API Key](entities/fireblocks/api-key.md) — API user를 식별하는 자격증명. CSR로 발급되며 Console의 API users list에서 hover로 복사한다 (source: 2026-05-18__support-fireblocks-io__add-api-users.md, p.2). ...
- [API User (Fireblocks)](entities/fireblocks/api-user.md) — Fireblocks 플랫폼을 API를 통해 사용하는 사용자 유형. 할당된 role의 권한 범위 내에서 API를 사용하며, API Co-signer 기능에도 사용된다 (source: 2026-05-18__support-fireblocks-io__u...
- [Approval Group (Fireblocks)](entities/fireblocks/approval-group.md) — Workspace의 일부 작업에 대해 Owner를 요구하지 않는 위임 그룹. Settings > Quorums > Approval groups 화면에서 작업 단위(row) 별로 구성하며, Add user / Edit user / Delete us...
- [Callback Handler (Fireblocks)](entities/fireblocks/callback-handler.md) — 상태: Stage 24 명세 확보. Stage 1 name → Stage 4 SSL pinning / re-enroll → Stage 24: 5 auth options + payload format + key model 명세 (Q-A04 ANSW...
- [Console User (Fireblocks)](entities/fireblocks/console-user.md) — Fireblocks Console을 통해 플랫폼을 접근·운영하는 사용자 유형. 사용자는 할당된 role의 권한 범위 내에서 Console을 사용한다 (source: 2026-05-18__support-fireblocks-io__user-roles...
- [Cosigner (Fireblocks)](entities/fireblocks/cosigner.md) — 상태: 부분 정의. 본 자료에서는 명칭과 사용 맥락만 확인됨. 구체 명세는 추후 ingest 필요.
- [CSR (Certificate Signing Request)](entities/fireblocks/csr.md) — API user를 Fireblocks에 인증하는 1차 자산. RSA 4096 키쌍을 생성하고 그 결과로 만들어진 CSR을 Console에 업로드하면 Fireblocks가 API user의 X.509 신원으로 사용한다 (source: 2026-05...
- [Designated Signer (Fireblocks)](entities/fireblocks/designated-signer.md) — Policy가 특정 트랜잭션 타입에 대해 지정하는 서명자. Non-Signing Admin과 Editor는 MPC 키를 보유하지 않지만, Policy가 designated signer를 정해둔 트랜잭션 타입에 한해 트랜잭션을 initiate할 수...
- [IP Allowlist (API user)](entities/fireblocks/ip-allowlist.md) — API user의 API 호출을 사전 지정한 IP 주소로만 제한하는 네트워크 게이트. Workspace Owner만 수정 가능하며, /32 CIDR만 허용한다 (range 미지원) (source: 2026-05-18__support-fireblo...
- [Mobile Device](entities/fireblocks/mobile-device.md) — Fireblocks mobile app이 동작하는 사용자의 모바일 디바이스. 동시에 MPC key share host, 2FA TOTP secret host(추정), mobile app passphrase/6-digit PIN host로 기능하며...
- [MPC Key Share (Fireblocks)](entities/fireblocks/mpc-key-share.md) — 상태: 부분 정의. 본 자료에서는 lifecycle 측면(승인·provisioning·일부 role의 보유 여부)만 확인됨. 프로토콜, share 분포, threshold는 추후 ingest 필요.
- [Policy (Fireblocks)](entities/fireblocks/policy.md) — Fireblocks workspace의 거버넌스·서명 결정을 좌우하는 룰셋. 본 자료에서 확인 가능한 사실은 (1) 변경·승인에 Owner + Admin Quorum 필요 (Q+O), (2) designated signer·second autho...
- [Recovery Passphrase](entities/fireblocks/recovery-passphrase.md) — Owner의 개인 비밀로, Workspace Keys Backup의 암호화 키 역할을 한다 (source: 2026-05-18__support-fireblocks-io__transfer-workspace-owner.md, p.1). Owner 이...
- [Sandbox Workspace (Fireblocks Developer Sandbox)](entities/fireblocks/sandbox-workspace.md) — 개발과 실험을 위한 무료 가입 workspace 종류. 모바일 서명 디바이스를 요구하지 않으며 모든 트랜잭션이 auto-approve된다. 제공 role은 NSA, Editor, Viewer 3개뿐이며 backend service가 Owner r...
- [SSO (Single Sign-On)](entities/fireblocks/sso.md) — Fireblocks Console 로그인을 기업 IdP(Identity Provider)에 위임하는 옵션. email domain 기반 authorization으로 동작하며 SSO 자체는 login authorization만 다룬다 — works...
- [Transaction (Fireblocks)](entities/fireblocks/transaction.md) — Fireblocks workspace의 자산 이동·서명 객체. 본 자료에서는 트랜잭션의 lifecycle보다는 role 권한표가 노출하는 동사 vocabulary가 확인된다 (source: 2026-05-18__support-fireblocks-...
- [User (Fireblocks)](entities/fireblocks/user.md) — Fireblocks workspace에 등록된 주체. 정확히 하나의 [[entities/fireblocks/user-roles/owner]] 외 1–N명이 존재 가능하며, 각 user는 정확히 하나의 user role을 보유한다. lifecycl...
- [Vault Account (Fireblocks)](entities/fireblocks/vault-account.md) — Fireblocks workspace에서 자산을 보유하는 단위. 본 자료에서 확인 가능한 운영 동사는 create / rename / hide / unhide / asset wallet 추가 / vault public key view 등이다 (s...
- [Workspace Keys Backup](entities/fireblocks/workspace-keys-backup.md) — Workspace의 key 자산에 대한 Owner-managed 백업. Owner가 생성하며, 본인의 [[entities/fireblocks/recovery-passphrase]]로 암호화된다 (source: 2026-05-18__support-...
- [Workspace (Fireblocks)](entities/fireblocks/workspace.md) — Fireblocks의 최상위 격리·거버넌스 단위. 모든 사용자·role·Policy·MPC 자원이 workspace 단위로 관리된다. 모든 workspace는 정확히 1명의 Owner를 가지며 Owner가 Vault를 셋업한다 (source: 2...

### User Roles (entities/fireblocks/user-roles/) — 9 docs
_9 role 별 권한 정의 — Owner / Admin / NSA / Signer / Approver / Editor / Viewer / Security Auditor / Security Admin_

- [Admin (Fireblocks user role)](entities/fireblocks/user-roles/admin.md) — 모든 Signer 권한을 가지면서 추가로 네트워크 확장·whitelist 승인·workspace settings 편집·사용자 추가·inbound 트랜잭션 manual complete가 가능한 역할. Admin Quorum의 멤버로 workspac...
- [Approver (Fireblocks user role)](entities/fireblocks/user-roles/approver.md) — 트랜잭션을 initiate하고 approve할 수 있지만 sign은 불가한 역할. Policy의 second authorizer로 정의 가능하며, 트랜잭션 승인 워크플로우와 일반 계정 관리에 적합 (source: 2026-05-18__suppor...
- [Editor (Fireblocks user role)](entities/fireblocks/user-roles/editor.md) — View-only 쿼리·wallet 추가·exchange 연결·새 vault address 생성·트랜잭션 cancel이 가능한 운영 보조 role. Policy가 designated signer를 지정한 트랜잭션 타입에 한해 initiate 가능...
- [Non-Signing Admin (NSA, Fireblocks user role)](entities/fireblocks/user-roles/non-signing-admin.md) — 트랜잭션 승인과 관리 작업을 수행하지만 MPC key share를 보유하지 않는 관리자 role. Policy에서 second authorizer로 정의될 수 있으며, Policy가 designated signer를 지정한 트랜잭션 타입에 한해 ...
- [Owner (Fireblocks user role)](entities/fireblocks/user-roles/owner.md) — Workspace당 정확히 1명 존재하는 최상위 거버넌스 역할. MPC 서명 디바이스·신규 사용자·Policy 변경을 승인하며, Vault의 셋업을 책임진다 (source: 2026-05-18__support-fireblocks-io__user-...
- [Security Admin (Fireblocks user role)](entities/fireblocks/user-roles/security-admin.md) — IT/보안 인력을 위한 플랫폼 보안·운영 관리 role. user/2FA/IP allowlist/FSPM을 관리하지만 MPC 키를 보유하지 않으며 트랜잭션을 initiate하거나 sign할 수 없다. Console 로그인 시 자동으로 Securi...
- [Security Auditor (Fireblocks user role)](entities/fireblocks/user-roles/security-auditor.md) — 감사자·보안 인력에게 Console의 read-only 접근을 제공하는 role. Viewer보다 넓은 view 범위로 Settings, Policies, Fireblocks Security Posture Management (FSPM) 까지 열...
- [Signer (Fireblocks user role)](entities/fireblocks/user-roles/signer.md) — 트랜잭션을 initiate / approve / sign 모두 수행할 수 있는 핵심 서명자 role. Console과 mobile 또는 API Co-signer와 Callback Handler를 통해 programmatic하게 동작 가능하다 (s...
- [Viewer (Fireblocks user role)](entities/fireblocks/user-roles/viewer.md) — Workspace activity 전반에 대한 view-only 권한만 가지는 role. Settings 접근, 신규 트랜잭션 제출, connection 승인 제출 모두 불가. Console과 API를 통한 감사 용도에 적합 (source: 20...

### Entities (entities/canton/) — 1 doc
_Fireblocks 외 체인. 사용자 고려 네트워크(이더리움+Canton) 중 Canton 모델 (Stage 52 ingest)_

- [Canton Network](entities/canton/canton-network.md) — DAML active contract(ACS) 원장 + UTXO형 holdings + 권한 기반 2-step 전송(OFFER/ACCEPT/REJECT/WITHDRAW, Canton Coin 은 pre-approval 1-step). traffic(byte) 수수료, PartyId=hint::fingerprint, Synchronizer 2-phase commit finality. Fireblocks 가 Canton 지원 ([[entities/fireblocks/transaction]] 매핑). status: draft.

### Open Questions (open-questions/)
_확정 불가 fact 의 격리 영역. 71 Q-number pending (status 통일은 Plan 4 진행 예정)_

- [Open Questions — Fireblocks](open-questions/fireblocks.md) — 원본 자료로 아직 답하지 못한 질문을 모은다. 본문에 추측을 쓰지 말고 여기에 질문으로 적어라.

## Architecture Corpus

> Stage 32+ 의 generalized architecture publication. 33 D-series + 6 C-series + 5 E-series + 11 R-series + 6 T-series = 61 docs.

### docs/architecture/ — 61 docs (D/C/E/R/T series)
_D = corpus / C = consolidation / E = evolution / R = reasoning ops / T = theory stewardship_

- [Custody Wallet — AI-assisted Operational Governance Reasoning](docs/architecture/ai-assisted-operational-governance.md) — 본 문서의 위치 (Frontier Cluster D30): D3 governance + D12 operational + D29 autonomous treasury 위의 AI-assisted decision support specialization...
- [Custody Wallet — Approval State Machine & Governance Workflow Reasoning](docs/architecture/approval-state-machine-governance.md) — 본 문서의 위치: D2 의 "Approval success ≠ Signing success" 명제를 governance 관점으로 확장. Approval / Quorum / Policy / Escalation / Break-glass / Audit...
- [Custody Wallet — Audit / Event Sourcing / Evidence Chain Reasoning](docs/architecture/audit-event-sourcing-evidence-chain.md) — 본 문서의 위치: D1a (ledger truth) + D2 (signing truth) + D3 (governance truth) + D4 (recovery truth) 의 5 가지 truth domain 을 Unified Evidence Sp...
- [Custody Wallet — Autonomous Treasury Governance Reasoning](docs/architecture/autonomous-treasury-governance.md) — 본 문서의 위치 (Frontier Cluster D29): D17 treasury + D3 governance + D28 intent 위의 autonomous treasury specialization. Programmable treasury 의...
- [C1 — Master Corpus Index](docs/architecture/c1-master-corpus-index.md) — 본 문서의 위치 (Consolidation C1): 33-document D-series corpus 의 navigation layer. Document list 가 아닌 conceptual dependency map + reasoning pro...
- [C2 — Invariant Catalog](docs/architecture/c2-invariant-catalog.md) — 본 문서의 위치 (Consolidation C2): 33 documents 전체의 invariant extraction + categorization. Document-specific 가 아닌 cross-corpus 의 underlying law...
- [C3 — Cross-reference / Dependency Graph](docs/architecture/c3-dependency-graph.md) — 본 문서의 위치 (Consolidation C3): 33 documents 의 conceptual dependency map. Sequential reading order 가 아닌 graph topology + propagation. C-seri...
- [C4 — Anti-pattern / Failure Pattern Catalog](docs/architecture/c4-anti-pattern-catalog.md) — 본 문서의 위치 (Consolidation C4): 33 documents 에서 nation/identified anti-patterns 의 catalog + hierarchy. Corpus 의 reasoning 이 actively guards ...
- [C5 — Executive / Audience Reading Paths](docs/architecture/c5-audience-reading-paths.md) — 본 문서의 위치 (Consolidation C5): 33 documents 의 audience-specific navigation. Same corpus, different reconstruction paths. C-series 의 fifth s...
- [C6 — Open Questions / Frontier Boundary](docs/architecture/c6-open-questions-frontier-boundary.md) — 본 문서의 위치 (Consolidation C6 — closing): 33 documents 의 explicit uncertainty boundary. Corpus 가 의도적으로 미해결 영역 + frontier 의 ambiguity. C-seri...
- [Custody Wallet — CBDC / Sovereign Digital Money Reasoning](docs/architecture/cbdc-sovereign-digital-money.md) — 본 문서의 위치 (Frontier Cluster D27): D10 monetary + D11 compliance + D13 cross-border + D23 jurisdictional 위의 sovereign-issued digital money ...
- [Custody Wallet — Clearing / Prime Brokerage / Omnibus Semantics Reasoning](docs/architecture/clearing-prime-brokerage-omnibus.md) — 본 문서의 위치 (Liquidity Cluster D18): D17 treasury optimization 의 자연스러운 emerge form — omnibus + clearing + prime brokerage. D10 treasury + D1...
- [compliance-aml-sanctions-boundary](docs/architecture/compliance-aml-sanctions-boundary.md)
- [Custody Wallet — Consensus Failure / Chain Halt Reasoning](docs/architecture/consensus-failure-chain-halt.md) — 본 문서의 위치 (Crisis Cluster D22): D9 multi-chain + D1b reconciliation + D5 evidence 위의 chain-level catastrophic failure. D21 의 trust collaps...
- [cross-border-settlement-fx-liquidity](docs/architecture/cross-border-settlement-fx-liquidity.md)
- [cross-institution-liquidity-coordination](docs/architecture/cross-institution-liquidity-coordination.md)
- [custody-failure-generalization](docs/architecture/custody-failure-generalization.md)
- [Custody Wallet — Deposit Lifecycle Detailed Reasoning](docs/architecture/deposit-lifecycle.md) — 본 문서의 위치: D8 의 mirror — outbound 의 12-phase complexity 와 달리 deposit 은 2-domain reconciliation (Blockchain ↔ Ledger). Governance / Signing...
- [E1 — Incident-driven Corpus Evolution](docs/architecture/e1-incident-driven-corpus-evolution.md) — 본 문서의 위치 (Evolution E1): 39-document corpus 의 incident-driven update discipline. Failure exposure 가 corpus evolution 의 primary driver. St...
- [E2 — Regulatory / Sovereign Evolution](docs/architecture/e2-regulatory-sovereign-evolution.md) — 본 문서의 위치 (Evolution E2): E1 의 incident-driven 의 regulatory / sovereign dimension. Regulatory drift / sovereign reinterpretation / jurisdi...
- [E3 — AI / Automation Evolution Pressure](docs/architecture/e3-ai-automation-evolution-pressure.md) — 본 문서의 위치 (Evolution E3): E1 + E2 위의 AI / automation 의 evolutionary pressure. D29 + D30 의 evolution perspective. AI 가 humans 의 replacement...
- [E4 — Frontier Integration Discipline](docs/architecture/e4-frontier-integration-discipline.md) — 본 문서의 위치 (Evolution E4): D27-D32 frontier cluster 의 integration discipline. New emerging primitive 의 institutional adoption 의 framework. ...
- [E5 — Corpus Longevity / Knowledge Survivability](docs/architecture/e5-corpus-longevity-knowledge-survivability.md) — 본 문서의 위치 (Evolution E5 — closing): E1 + E2 + E3 + E4 의 final synthesis. Corpus 의 own survivability 의 architectural reasoning. Knowledge 의...
- [Custody Wallet — Identity / KYT / Counterparty Graph Reasoning](docs/architecture/identity-kyt-counterparty-graph.md) — 본 문서의 위치 (Trust Cluster D16): D15 의 "identity ambiguity = trust ceiling" 의 직접적 해결 단계. D11 compliance (KYT) + D15 transparency (verifiabil...
- [Custody Wallet — Institutional Privacy / Confidential Settlement Reasoning](docs/architecture/institutional-privacy-confidential-settlement.md) — 본 문서의 위치 (Frontier Cluster D31): D5 evidence + D15 transparency + D11 compliance 위의 confidential settlement specialization. Public transp...
- [Custody Wallet — Intent-based Settlement / Solver Networks Reasoning](docs/architecture/intent-based-settlement-solver-networks.md) — 본 문서의 위치 (Frontier Cluster D28): D8 withdrawal + D20 cross-institution + D27 sovereign + Liquidity cluster 위의 delegated execution market ...
- [Custody Wallet — Internal Netting / Internal Settlement Reasoning](docs/architecture/internal-netting-settlement.md) — 본 문서의 위치 (Liquidity Cluster D19): D18 의 internalized settlement 의 multi-party 확장. D17 treasury optimization 의 efficiency mechanism. Netti...
- [jurisdiction-split-regulatory-attack](docs/architecture/jurisdiction-split-regulatory-attack.md)
- [Custody Wallet — Multi-chain Adapter Pattern Reasoning](docs/architecture/multi-chain-adapter-pattern.md) — 본 문서의 위치: D1a-D8 + D6 의 generalized custody skeleton 을 chain semantic variance 관점에서 specialize. Multi-chain support 의 핵심은 RPC adapter 가 아...
- [operational-maturity-incident-command](docs/architecture/operational-maturity-incident-command.md)
- [Custody Wallet — Post-quantum Custody Survivability Reasoning](docs/architecture/post-quantum-custody-survivability.md) — 본 문서의 위치 (Frontier Cluster D32 — closing): D14 security + D4 recovery + D5 evidence + D31 confidentiality 위의 post-quantum (PQ) survivabil...
- [R0 — Reasoning Operations Charter](docs/architecture/r0-reasoning-operations-charter.md) — Generalized — institutional WaaS architecture corpus, reasoning operations layer.
- [R1 — Retrieval Discipline Architecture](docs/architecture/r1-retrieval-discipline-architecture.md) — Generalized — institutional WaaS architecture corpus, retrieval discipline layer.
- [R10 — Failure Modes of Long-lived Architecture Corpora](docs/architecture/r10-failure-modes-long-lived-corpora.md) — Generalized — institutional WaaS architecture corpus, failure-mode catalog at the corpus level.
- [R2 — Corpus Reasoning Flow](docs/architecture/r2-corpus-reasoning-flow.md) — Generalized — institutional WaaS architecture corpus, reasoning flow layer.
- [R3 — Contradiction Management Discipline](docs/architecture/r3-contradiction-management-discipline.md) — Generalized — institutional WaaS architecture corpus, contradiction management layer.
- [R4 — Ontology Stability Discipline](docs/architecture/r4-ontology-stability-discipline.md) — Generalized — institutional WaaS architecture corpus, ontology stability layer.
- [R5 — Evolution Governance Model](docs/architecture/r5-evolution-governance-model.md) — Generalized — institutional WaaS architecture corpus, evolution governance layer.
- [R6 — Knowledge Decay / Staleness Taxonomy](docs/architecture/r6-knowledge-decay-staleness-taxonomy.md) — Generalized — institutional WaaS architecture corpus, knowledge decay layer.
- [R7 — Historical Worldview Preservation Strategy](docs/architecture/r7-historical-worldview-preservation.md) — Generalized — institutional WaaS architecture corpus, historical worldview preservation layer.
- [R8 — Human Review Boundary / Escalation Criteria](docs/architecture/r8-human-review-boundary-escalation-criteria.md) — Generalized — institutional WaaS architecture corpus, human review boundary layer.
- [R9 — AI-assisted Reasoning Constraints](docs/architecture/r9-ai-assisted-reasoning-constraints.md) — Generalized — institutional WaaS architecture corpus, AI-assisted reasoning constraints layer.
- [Custody Wallet — Reconciliation / Settlement / Consistency Reasoning](docs/architecture/reconciliation-settlement-consistency.md) — 본 문서의 위치: D5 의 Unified Evidence Spine 위에서 5 truth domain (Blockchain / Ledger / Governance / Signing / Recovery) 의 cross-domain consisten...
- [Custody Wallet — Recovery Ceremony Generalization Reasoning](docs/architecture/recovery-ceremony-generalization.md) — 본 문서의 위치: D3 의 governance reasoning + D2 의 signing trust boundary + D1a 의 L7 cold plane (recovery metadata) 를 통합하여, recovery 를 governance...
- [regulatory-reporting-audit-interface](docs/architecture/regulatory-reporting-audit-interface.md)
- [security-threat-model-adversarial-resilience](docs/architecture/security-threat-model-adversarial-resilience.md)
- [Custody Wallet — Signing Workflow & MPC Orchestration Reasoning](docs/architecture/signing-workflow-orchestration.md) — 본 문서의 위치: D1a (9-plane DB schema) 위에서 실제 signing workflow 를 orchestration 관점으로 reasoning. Fireblocks 의 14-step transaction lifecycle / MP...
- [Custody Wallet — Stablecoin Depeg / Crisis Handling Reasoning](docs/architecture/stablecoin-depeg-crisis-handling.md) — 본 문서의 위치 (Crisis Cluster D21): D10 treasury (mint/burn) + D17-D20 liquidity cluster + D15 transparency 위의 stablecoin crisis specializatio...
- [systemic-liquidity-freeze](docs/architecture/systemic-liquidity-freeze.md)
- [T0 — Theory Stewardship Charter](docs/architecture/t0-theory-stewardship-charter.md) — Generalized — institutional WaaS architecture corpus, theory stewardship layer.
- [T1 — Corpus Drift Detection](docs/architecture/t1-corpus-drift-detection.md) — Generalized — institutional WaaS architecture corpus, stewardship practice for drift detection.
- [T2 — Contradiction Governance](docs/architecture/t2-contradiction-governance.md) — Generalized — institutional WaaS architecture corpus, stewardship practice for contradiction handling.
- [T3 — Institutional Memory Survivability](docs/architecture/t3-institutional-memory-survivability.md) — Generalized — institutional WaaS architecture corpus, stewardship practice for memory continuity.
- [T4 — Controlled Evolution Framework](docs/architecture/t4-controlled-evolution-framework.md) — Generalized — institutional WaaS architecture corpus, stewardship practice for evolution under constraint.
- [T5 — Stewardship Failure Modes](docs/architecture/t5-stewardship-failure-modes.md) — Generalized — institutional WaaS architecture corpus, stewardship practice failure catalog.
- [three-way-custody-decision-framework](docs/architecture/three-way-custody-decision-framework.md)
- [Custody Wallet — Transparency / Attestation / Proof Systems Reasoning](docs/architecture/transparency-attestation-proof-systems.md) — 본 문서의 위치 (Trust Cluster D15): D5 evidence + D10 monetary + D11 compliance + D14 security 위의 externally verifiable trust production. Inter...
- [가상자산 트래블룰 — Reference (한국 특금법 중심)](docs/architecture/travel-rule-kr-reference.md) — 규제 도메인 reference (Stage 148): FATF R.16 기원 · 특금법 100만원 기준 · 글로벌 임계값 비교 · VerifyVASP/CODE/Notabene 솔루션 지형 · 거래소 출금/입금대기 실무 · 2026 개정 동향(2차).
- [Custody Wallet — Treasury Optimization / Capital Efficiency Reasoning](docs/architecture/treasury-optimization-capital-efficiency.md) — 본 문서의 위치 (Liquidity Cluster D17): D10 treasury (mint/burn governance) + D13 cross-border (FX/liquidity routing) 위의 treasury optimization ...
- [treasury-reserve-mint-burn](docs/architecture/treasury-reserve-mint-burn.md)
- [Custody Wallet — Vault / Wallet / Ledger DB Schema Reasoning](docs/architecture/vault-wallet-ledger-db-schema.md) — 본 문서의 위치: Curated Wiki / Source Lake 와 별도의 architecture reasoning layer. Fireblocks vendor docs 의 정리/요약 문서가 아님. custody wallet backend 의 ...
- [withdrawal-lifecycle](docs/architecture/withdrawal-lifecycle.md)

### Persistence Architecture (persistence-architecture/) — 16 docs
_Stage 35 영속화 reference (7-DB split / storage class / state machine / append-only / cross-cutting / DB ops)_

- [01. Principles & Discipline](persistence-architecture/01-principles-and-discipline.md) — Persistence layer 의 운영 규율 — 모든 도메인이 따르는 cross-cutting 원칙
- [02. Wallet Topology](persistence-architecture/02-wallet-topology.md) — Customer → Vault → Wallet → Address 의 4-layer 식별 / 격리 persistence
- [03. Ledger & Settlement](persistence-architecture/03-ledger-settlement.md) — 자금의 source of truth — ledger_entries 의 append-only 영속화
- [04. Transaction Orchestration](persistence-architecture/04-transaction-orchestration.md) — Chain 상의 transaction 의 영속화 — broadcast / confirmation 의 retry-safe model
- [05. Approval & Governance](persistence-architecture/05-approval-governance.md) — Policy 결정의 영속화 — state machine + set-once + hot reload
- [06. Signing & Execution Boundary](persistence-architecture/06-signing-execution.md) — 서명 ceremony 의 영속화 — runtime-only / forbidden 의 경계가 가장 명확한 도메인
- [07. Deposit Observation](persistence-architecture/07-deposit-observation.md) — Chain 의 fact 를 internal ledger 로 controlled recognition
- [08. Withdrawal Lifecycle](persistence-architecture/08-withdrawal-lifecycle.md) — Approval + Signing + Broadcast + Confirmation + Ledger 의 통합 cascade
- [09. Reconciliation & Consistency](persistence-architecture/09-reconciliation-consistency.md) — Truth-domain cross-check 의 영속화 — session / snapshot / mismatch finding
- [10. Audit & Evidence Integrity](persistence-architecture/10-audit-evidence-integrity.md) — Hash chain + TEE-signed checkpoint 의 영속화 — 사후 변조 탐지의 최후 보루
- [11. Recovery & Ceremony](persistence-architecture/11-recovery-ceremony.md) — 키 / vault / cluster 의 복구 ceremony 의 영속화 — m-of-n quorum + 외부 evidence
- [12. Provider Mapping](persistence-architecture/12-provider-mapping.md) — External vendor (Fireblocks / NodeInfra / 등) 의 state 와 internal canonical 의 분리
- [13. Operational Monitoring](persistence-architecture/13-operational-monitoring.md) — Health / Drift signal / Alert 의 영속화 — 운영 visibility 의 backbone
- [14. Cross-cutting Concerns](persistence-architecture/14-cross-cutting-concerns.md) — Indexing / Retention / Hot-cold / Optimistic locking / Partitioning 의 통합 reference
- [15. DB Split & PostgreSQL Operational Considerations](persistence-architecture/15-db-split-and-postgresql.md) — 7-DB split 의 근거 + PostgreSQL 운영의 실무 고려사항
- [Institutional Persistence Architecture](persistence-architecture/index.md) — 수탁형 지갑의 물리 persistence 설계 reference

### Reference Architecture (reference-architecture/) — 7 docs
_Direct-build custodial wallet reference (aggregate / state machine / storage boundary / trust boundary / pattern)_

- [Core Aggregates](reference-architecture/aggregates.md) — Direct-build custodial wallet 의 19 개 recurring aggregate
- [Direct-build Custodial Wallet — Reference Architecture](reference-architecture/index.md) — Projection of the generalized custody corpus into a build-actionable blueprint
- [PM Decision Guide](reference-architecture/pm-decision-guide.md) — 만들기 전에 결정해야 할 것 + MVP → Production + Open risks
- [Vendor-independent Recurring Patterns](reference-architecture/recurring-patterns.md) — Fireblocks / NodeInfra / generalized corpus 에서 모두 반복되는 구조
- [State Machines](reference-architecture/state-machines.md) — Direct-build custodial wallet 의 6 개 핵심 state machine
- [Storage Boundaries](reference-architecture/storage-boundaries.md) — 무엇을 어디에 / 어떻게 / 절대 안 저장하는가
- [Trust Boundaries](reference-architecture/trust-boundaries.md) — 누가 누구를 신뢰하는가, 어디서 신뢰가 끊기는가

### Knowledge OS Guide (guide/) — 11 docs
_Onboarding + operating system guide_

- [1. Repository Structure](guide/01-repository-structure.md) — Repository 전체 지도 + source 와 reasoning 의 차이
- [2. Corpus Layers — D / C / E / R / T](guide/02-corpus-layers.md) — 5 개 layer 의 역할과 관계
- [3. Reasoning Lifecycle](guide/03-reasoning-lifecycle.md) — Source 가 corpus 의 reasoning 으로 변환되는 흐름
- [4. Invariants & Discipline](guide/04-invariants-and-discipline.md) — ≠ 명제 / Evidence-first / Entity-min 의 이유
- [5. Source Ingestion](guide/05-source-ingestion.md) — 새 vendor 자료를 corpus 에 추가하는 절차
- [6. Adding New Reasoning](guide/06-adding-reasoning.md) — 새 D-doc / 새 cluster 를 추가하는 기준과 절차
- [7. Governance & Stewardship Workflow](guide/07-stewardship.md) — corpus 를 살아 있는 system 으로 운영하기
- [8. Anti-patterns](guide/08-anti-patterns.md) — 절대 하면 안 되는 것들
- [9. Reading Paths](guide/09-reading-paths.md) — 독자별 추천 reading 순서
- [10. Walkthrough — NodeInfra Ingestion](guide/10-walkthrough-nodeinfra.md) — 실제 사례로 보는 source ingestion + corpus mapping
- [Knowledge Operating System Guide](guide/README.md) — 기관형 Reasoning Corpus 운영 가이드

## Operations Layer

> 운영 워크플로우 정의 — schema + skill + memory 3 평면.

### Prompts (prompts/) — schema source-of-truth
_LLM 에게 줄 운영 prompt. operating-principles 가 메타, 나머지는 작업별_

- [Extract Entities](prompts/extract-entities.md) — Markdown 변환본에서 개념(entity) 후보를 뽑아 entities/<vendor>/에 페이지를 생성/갱신할 때 쓰는 프롬프트.
- [Ingest Source (PDF / Webpage) — v3.2.2](prompts/ingest-pdf.md) — Operating policy: operating-principles.md v3.2.2.
- [Operating Principles (v3.2.2)](prompts/operating-principles.md) — Wiki 운영 방침 — Stage 12 (2026-05-19) 시점 추가 강화. Source Lake 가 370+ PDF 규모로 성장함에 따라 PDF raw read 자체를 중단 + markdown/lightweight index 중심 운영. S...
- [Update Wiki](prompts/update-wiki.md) — 이미 존재하는 위키 페이지를 수정·확장할 때의 규칙. ingest-pdf 또는 extract-entities 이후의 실제 쓰기 단계에 적용.

### Skill (.claude/skills/waas-wiki-curator/)
_자동 trigger 정의 — wiki query / source ingest / 새 entity 요청 시 자동 활성_

- [SKILL.md](.claude/skills/waas-wiki-curator/SKILL.md) — 7-step workflow + 3 trigger 분기 + Reference-ready 답변 모드
- [waas-wiki-curator.skill](.claude/skills/waas-wiki-curator.skill) (packaged) — portable .skill archive

## Published / Deployed

### docs-site/ — Cloudflare Pages 정적 사이트
- **Production**: <https://wiki-docs.pages.dev/>
- 현재 컨텐츠: `custodial-wallet-db-design/` 26 페이지 (Fireblocks DB 구조와 상태 흐름)
- 진입점: [docs-site/index.html](docs-site/index.html) (hub) + [docs-site/custodial-wallet-db-design/](docs-site/custodial-wallet-db-design/)

## Source Lake (raw, immutable)

> v3.2.2 정책: PDF 직접 read 금지, lazy-load, selective deep ingest. 자세히: [prompts/operating-principles.md](prompts/operating-principles.md).

- **PDF**: 458 files · meta.yml: 184 (un-cataloged: 274) — [sources/fireblocks/pdf/](sources/fireblocks/pdf/)
- **Markdown (변환본)**: 118 files — [sources/fireblocks/markdown/](sources/fireblocks/markdown/)
- **Webpages (meta.yml)**: 5 files — [sources/fireblocks/webpages/](sources/fireblocks/webpages/)
- **NodeInfra**: secondary vendor (Stage ingest 진행분) — [sources/nodeinfra/](sources/nodeinfra/)
- **Canton**: 4 sources (homepage·Musubi·Fireblocks recover-CC·Digital Asset docs v3.4) — [sources/canton/](sources/canton/) (Stage 52)

## Stage Log

전체 38 stage 진행. 최근 5개:

- **Stage 32**: D27-D32 — Frontier / Emerging Institutional Systems Cluster Sequential (2026-05-20)
- **Stage 32**: C1-C6 — Corpus Consolidation / Meta-Architecture Refinement (2026-05-20)
- **Stage 32**: E1-E5 — Post-corpus Evolution / Living Theory Maintenance (2026-05-20)
- **Stage 33**: R-series Reasoning Operations Layer (Retrieval / Reasoning Discipline)
- **Stage 34**: T-series Theory Stewardship Layer (Institutional Reasoning Maintenance)

→ 전체: [log.md](log.md)

## Tests

- [tests/README.md](tests/README.md)
- [tests/questions/generated-questions.md](tests/questions/generated-questions.md)
- [tests/questions/question-bank.yml](tests/questions/question-bank.yml)
- [tests/retrieval/gap-report.md](tests/retrieval/gap-report.md)
- [tests/retrieval/gap-report.yml](tests/retrieval/gap-report.yml)
- [tests/retrieval/promote-candidates.md](tests/retrieval/promote-candidates.md)
- [tests/retrieval/promote-candidates.yml](tests/retrieval/promote-candidates.yml)
- [tests/retrieval/retrieval-eval.md](tests/retrieval/retrieval-eval.md)
- [tests/retrieval/retrieval-eval.yml](tests/retrieval/retrieval-eval.yml)
- [tests/retrieval/tuning-notes.md](tests/retrieval/tuning-notes.md)
- [tests/triage/tier1-review.md](tests/triage/tier1-review.md)
- [tests/triage/triage-report.md](tests/triage/triage-report.md)
- [tests/triage/triage-report.yml](tests/triage/triage-report.yml)

---

_Generated: Plan 1 of llm-wiki principle alignment (Stage 35 prep). 갱신은 매 ingest stage 종료 시 또는 lint stage 에서._
