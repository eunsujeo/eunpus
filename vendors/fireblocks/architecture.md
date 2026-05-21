---
type: vendor-hub
vendor: fireblocks
status: stable
tags: [architecture]
stage_introduced: 1
last_updated_stage: 31
source_count: 8
related:
  - authentication
  - callback-handler
  - cosigner
  - mobile-app
  - mobile-device
  - mpc
  - mpc-key-share
  - overview
  - policy-engine
---
# Fireblocks — Architecture

> 시스템 전반의 아키텍처: 어떤 컴포넌트가 있고 어떻게 통신하는가.

## Summary

_TODO: 컴포넌트 다이어그램·트랜잭션 라이프사이클·SaaS 내부 모듈 등 자세한 architecture는 추후 자료._

본 자료군(Stage 1–5 Help Center) 기반으로 확인 가능한 component 분포는 다음과 같다:

## Key Concepts (확인된 컴포넌트)

- **Fireblocks Console** — 웹 기반 관리 인터페이스 (`user-roles.md`, p.1)
- **Fireblocks SaaS** — 백엔드. Mobile app과 통신, current/effective version 결정 (`fireblocks-mobile-app-updates.md`, p.1)
- **Fireblocks mobile app** — User device 측, MPC key share host + 승인·서명 평면 ([[vendors/fireblocks/mobile-app]])
- **API surface** — REST/SDK/Webhook (Stage 4) + Webhook callback URL `auth.fireblocks.io/login/callback` (`configure-sso.md`)
- **API Co-Signer** — Customer-deployed 또는 Fireblocks Communal Test Co-signer (testnet) — Mobile app의 자동화 대체 (`about-the-fireblocks-mobile-app.md`, p.2; `add-api-users.md`, p.2)
- **Callback Handler** — Customer-deployed external endpoint, SSL pinning by Co-signer (Stage 4)
- **Fireblocks cloud servers** — Recovery passphrase로 encrypted된 MPC key share backup 저장 (`recovery-passphrase.md`, p.1)
- **Auth0** — SSO service provider (`configure-sso.md`, p.1)
- **Identity Provider (IdP)** — 외부, Google Workspace / Entra ID / Okta / OIDC / PingFederate / SAML / ADFS / LDAP
- **Vault Account** — Asset 보유 단위 ([[entities/fireblocks/vault-account]])
- **Policy Engine** — Workspace 거버넌스 룰

## Details

_TODO: 컴포넌트 다이어그램·신뢰 경계 다이어그램·완전한 데이터 흐름 추후._

### 신뢰 경계 (본 자료 기반)

| 영역 | 호스팅 | 신뢰 자산 |
|---|---|---|
| **Fireblocks SaaS** | Fireblocks | Console, API, version 결정, audit logs, cloud key share backup |
| **Auth0 (SSO)** | Fireblocks 측 service provider | SSO callback |
| **사용자 mobile device** | 사용자 | Primary MPC key share (secure enclave), PIN, biometric, mobile app passphrase, recovery passphrase 입력 |
| **고객 인프라** | 고객 | API Co-Signer instances (옵션 SGX), Callback Handler servers, CSR private keys |
| **외부 IdP** | 고객 또는 third-party | SSO authentication |
| **Blockchain** | Public | 서명된 트랜잭션 |

### Key Share 분포는 [[vendors/fireblocks/mpc]] §"Key Share 분포 모델"

### Node infrastructure (Stage 7)

`node-router.md` + `blockchains-sla.md` 기반 blockchain node 평면:

| Component | 위치 | SLA | 비고 |
|---|---|---|---|
| **Fireblocks-hosted nodes** | Fireblocks SaaS | 99.9% uptime | Default routing |
| **Certified vendor nodes** | Third-party (vetted) | 99.9% uptime | 동일 보장 |
| **Foundation-provided nodes** | Blockchain foundation | **No SLA** | foundation 의존 |
| **Customer-provided nodes (Node Router)** | 고객 인프라 또는 third-party | (고객 책임) | Premium, EVM only, no fallback to Fireblocks default |

**Node Router 흐름**:
- Static dedicated: tenant 단위 단일 node → 모든 outgoing tx (`sendRawTransaction`, `getTransactionCount` 등 tx prep+submission)
- On-demand: API 호출 시점에 node 지정
- 그 외 public op는 Fireblocks default node로 라우팅

자세한 내용은 [[vendors/fireblocks/blockchains]] §"Node Router" 참고.

### Mobile app vs API Co-Signer 평면 분리

`about-the-fireblocks-mobile-app.md`, p.2 — 두 평면이 동일 역할(승인·서명) 대체:

- **Mobile app**: human-driven, Console user, mobile device secure enclave
- **API Co-Signer**: automation-driven, API user, customer-deployed instance + Callback Handler

자동화·고빈도 서명 흐름은 API Co-Signer 권장.

## Related Pages

- [[vendors/fireblocks/overview]]
- [[vendors/fireblocks/mpc]] — Key share 분포 모델
- [[vendors/fireblocks/mobile-app]] — Mobile app 컴포넌트
- [[vendors/fireblocks/cosigner]] — Co-signer 평면
- [[vendors/fireblocks/callback-handler]]
- [[vendors/fireblocks/authentication]] — Auth0 / IdP / 2FA
- [[vendors/fireblocks/policy-engine]]
- [[entities/fireblocks/mpc-key-share]] · [[entities/fireblocks/mobile-device]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1
- `2026-05-18__support-fireblocks-io__configure-sso.md`, p.1
- `2026-05-18__support-fireblocks-io__about-the-fireblocks-mobile-app.md`, p.1–2
- `2026-05-18__support-fireblocks-io__fireblocks-mobile-app-updates.md`, p.1
- `2026-05-18__support-fireblocks-io__recovery-passphrase.md`, p.1
- `2026-05-18__support-fireblocks-io__add-api-users.md`, p.2
- `2026-05-18__support-fireblocks-io__node-router.md`, p.1–3 (Stage 7: Node Router infrastructure)
- `2026-05-18__support-fireblocks-io__blockchains-sla.md`, p.1 (Stage 7: 3 node type 분류)

## Stage 8 — Cloud Architecture 정식 명세 (`fireblocks-cloud-architecture.md`)

### 3-Cloud Provider 분할 (data 위치 기준)

| Provider | 역할 | Sensitive material |
|---|---|---|
| **Microsoft Azure** | Core services, Auth/Policy/TAP/MPC/SGX/Co-Signer Engine/Secure Vault, key shares, configs, policy rules, third-party API credentials, **SGX Confidential Enclaves** | YES |
| **Amazon AWS** | Shell Services VPC (Firestore, Transaction Manager, Mobile Service, Dev API Gateway, Web Console, API Gateway) + Node Infrastructure VPC (Blockchain Nodes, Fireblocks Network) | NO |
| **Google Cloud Platform (Firebase)** | Console + mobile app caching DB | NO |

→ **Azure = sensitive 의 root**, AWS = 외피 (gateway / frontend), GCP = caching.
→ Azure ↔ AWS 통신은 **SGX DMZ + PROXY** 매개.

### 6 System Components

1. **Shell Services** — API gateways, event orchestration, message queues (no sensitive data)
2. **Transaction Signing Modules (Co-signers)** — MPC private key shares + signing tx
3. **Core Components** — core service modules + sensitive data
4. **Trusted Shared Services** — shared modules + **Fireblocks P2P Network**
5. **Blockchain Nodes Infrastructure** — blockchain network broadcast (no sensitive data, scales V+H)
6. **Disaster Recovery Services** — 자산 복구, **extended ECDSA + EdDSA private keys (xprv+fprv) 재구성**, "**offline air-gapped machine with hardened access permissions**", "**Should not be used regularly — single point of compromise**" ← 정식 SPOC 경고.
   - **Backup unit (Stage 30 명세)** = **6 encrypted shares** (3 ECDSA + 3 EDDSA, cloud share RSA-4096 + mobile share passphrase). 자세한 backup procedure: [[entities/fireblocks/workspace-keys-backup]] §"Stage 30 — SaaS MPC variant".
   - **Reconstruction model (Stage 31 명세)** = offline-only Recovery Utility procedure with **4 secrets** (Recovery Kit ZIP + RSA private key + Mobile App Recovery Passphrase + RSA Private Key Passphrase). 직접 인용: "Performing this procedure on an online machine will result in your **private key being considered exposed and compromised**." → SPOC 경고의 explicit trigger.
   - **DR Service operational lifecycle (Stage 8 + 29 + 30 + 31 paired full)**:
     ```
     Backup → 6-file package → 4-secret reconstruction → workspace restored
     ```
   - Hosted MPC variant (3-share, Stage 29) 는 동일 spine 의 다른 plane.
   - **Q-S09 ANSWERED (Stage 31)** — procedural full cycle complete. Rotation + formal hardening 은 customer org compliance 영역.

### HA / Deployment 모델

- **Active-Active + Active-Passive HA** 둘 다 지원 (Tier 1 cloud providers)
- Co-signer 분포: 2 Fireblocks cloud + 1 customer (mobile / customer cloud / customer on-prem)
- Self-hosted co-signer 도 HA/DR 권장

### Authentication Architecture (`authentication-and-authorization.md`)

- **Root Key** (Core Services 의 CA) → **Intermediate Cert** → **Co-Signer End Cert** chain of trust
- Customer components 는 Core Services public Root Key 사전 보유 → 받은 access token 의 서명 검증
- Token lifecycle: activation token (7d) → refresh token (mobile KeyChain) → access token (6h)

### Customer Egress Plane (Stage 8 `fireblocks-ip-addresses-to-whitelist.md`)

3-region (US/EU/EU2) ingress + Cloudflare 범위:
- US: `3.133.194.13`
- EU: `3.126.240.51`
- EU2: `3.77.238.179`
- Webhook source: US `3.134.25.131`, EU `3.72.125.45 / 18.184.217.45 / 18.198.71.192`

→ Customer egress firewall config 의 정식 reference 등장. 3-region SaaS 배포 확인.

### BCM (Business Continuity Module) — Hosted MPC 전용 on-prem fallback

`business-continuity-module-bcm.md` Stage 8:
- Hosted MPC customer 전용, SaaS outage 시 signing 지속
- Components (Docker images): BCM API + BCM Aggregator + Redis + Offline Signing Console + Co-Signer Cluster (BCM-version) + API Co-Signer (BCM-version)
- Cloud Aggregator 기능이 customer-side 로 이동
- Active-Active + Active-Passive HA
- Signed x-access-token JWT + customer-signed TLS certs + private key auth
- Cold Wallet apps 와 통합

### Hosted MPC Variant (`hosted-mpc-overview.md`)

| 모델 | Customer 측 | Fireblocks 측 |
|---|---|---|
| Default SaaS MPC | 1 share (mobile or API Co-Signer) | 2 shares (Fireblocks Azure SGX) |
| Hosted MPC | **3 shares** (1 Primary + 2 Guard, all SGX) | **0 shares** |

**Sovereign key management framing** (Stage 22 보강):

`hosted-mpc-overview.md` p.1 직접 인용: "Hosted MPC feature allows you to **completely control the MPC key shares** by hosting all three Co-Signers in your own environment, either in the cloud or on-premises."

→ **Customer ownership deployment axis** — SaaS MPC 의 vendor partial-trust 모델과 대비. 동기: regional regulators / internal policies / end-users compliance 요건. Fireblocks 는 cryptographic 참여 없음 (key share 0개).

**BCM ↔ Hosted MPC pairing** (Stage 22 명시):

BCM 은 Hosted MPC 의 disaster continuity 보완 — 두 feature 가 **paired**. BCM 도입 시 Aggregator 까지 customer-side 로 이동 (위 §"BCM (Business Continuity Module)" 참조). SaaS-only customer 는 BCM 자격 없음 (Risk-S10) — Hosted MPC 가 BCM 의 prerequisite.

**Off-Exchange ↔ Hosted MPC pairing** (★ Stage 22 신규 cross-cut):

`hosted-mpc-overview.md` p.2 Related Documents 가 **About Fireblocks Off Exchange** 를 명시 — Off-Exchange product line 은 Hosted MPC 기반으로 운영. **두 요건이 paired product**: (a) sovereign key management (Hosted MPC), (b) counterparty exposure 격리 (Off-Exchange). 본 wiki 의 별도 product line 으로 분리되어 있으나 architecture 측면에서 cross-cut. Off-Exchange 자체 deep ingest 는 본 wiki 5 priority domain 밖.

**Hosted MPC sub-series (Stage 28 normalize 완료)**:

`hosted-mpc-overview.md` p.2 Related Documents 의 3 문서:
- **Hosted MPC Customer-Side Setup** — onboarding 절차 (→ Q-S10 1차 source, 미 deep-ingest)
- **Hosted MPC Workspace Configuration** — workspace 설정 (→ Q-S10 1차 source, 미 deep-ingest)
- **Hosted MPC Backup and Recovery** — DR 절차 (→ ✓ Stage 29 Mode C 완료, Q-S09 partial answered)

**Hosted MPC B&R Flow Detail (★ Stage 29 신규)**:

`hosted-mpc-backup-and-recovery.md` (Stage 29 Mode C):

```
Step 1: Initiate (Owner mobile app approval)
  ↓
  - Email kit: passphrase-encrypted mobile share → download → air-gapped machine #1
  - Guard Co-Signer #1 share: RSA-encrypted file on local host (자동 생성)
  - Guard Co-Signer #2 share: RSA-encrypted file on local host (자동 생성)
  ↓
Step 2: Assemble (copy 3 encrypted shares → air-gapped machine #2)
  ↓
  Final kit holds all 3 shares (1 passphrase + 2 RSA)
```

**Asymmetric encryption layers**:
- Mobile share: passphrase-encrypted (Owner recovery passphrase)
- Guard shares: RSA-encrypted (customer 가 Console 로 upload 한 RSA public key)

**Architectural 신호**:
1. **2 air-gapped machines** 요건 — download + assembly 분리 (security pattern)
2. **Approval-triggered automation** — backup approval = Guard share file 자동 생성
3. **RSA public key Console upload** = Guard share keystore — customer 측 RSA keypair 사전 생성 필수
4. **BCM ↔ B&R cross-cut**: BCM 도입 시 Aggregator 도 customer-side (이미 명시) — B&R 의 customer 책임은 BCM 환경에서 더 광범위 (signing protocol + backup 둘 다 customer)

→ 자세한 procedure 는 [[entities/fireblocks/workspace-keys-backup]] §"Stage 29 — Hosted MPC variant" + [[entities/fireblocks/mpc-key-share]] §"Hosted MPC Variant — Backup 모델".

## Sources (추가)
- `2026-05-18__support-fireblocks-io__fireblocks-cloud-architecture.md`, p.1-3 (Stage 8: 3-cloud provider, 6 components, SPOC 경고)
- `2026-05-18__support-fireblocks-io__authentication-and-authorization.md`, p.1-6 (Stage 8: Root Key chain of trust, token lifecycle)
- `2026-05-18__support-fireblocks-io__fireblocks-ip-addresses-to-whitelist.md`, p.1 (Stage 8: 3-region 배포)
- `2026-05-18__support-fireblocks-io__business-continuity-module-bcm.md`, p.1-3 (Stage 8: BCM on-prem stack)
- `2026-05-18__support-fireblocks-io__hosted-mpc-overview.md`, p.1 (Stage 8: Hosted MPC variant)
- `2026-05-18__support-fireblocks-io__intel-sgx-secure-environments.md`, p.1-2 (Stage 8: SGX 3-5 machines)
- `2026-05-18__support-fireblocks-io__mpc-cmp.md`, p.5 (Stage 8: Aggregator)

## Stage 9 — Transaction System Schematic 14-Step Flow (★ Stage 8 cloud-architecture 의 세부 확장)

`transaction-lifecycle.md`, p.4-5 + Stage 8 `fireblocks-cloud-architecture.md` 정합:

### Components — Stage 8 의 6 component 가 module 단위로 분해됨

| Stage 8 component | Stage 9 module (세부) | SGX | 호스팅 |
|---|---|---|---|
| **Shell Services** | Dev API Gateway / Transaction Manager / Balance Service / Screening Service / Certificate Store | - | Fireblocks AWS |
| **Core Components** | **Auth Engine** (SGX, token + signature 검증) / **Policy Engine TAPs** (SGX, tx approval) / **Secure Vault** (SGX, PKI in enclave) / **Co-Signer Engine** (SGX, routing) | YES | Fireblocks Azure |
| **Trusted Shared Services** | Fireblocks P2P Network (Stage 8) | - | - |
| **Co-signers** | Co-Signer 1/2 (Fireblocks SGX) + Co-Signer 3 (Customer mobile / SGX server) | YES | 양측 |
| **Blockchain Nodes** | Node | - | Fireblocks AWS |
| **DR Services** | (Stage 8 SPOC 경고) | - | offline air-gapped |

### 14-Step Transaction Flow

```
1. User → API
2. API → JWT 서명 access token
3. → Dev API Gateway
4. JWT 검증:
   4a. Certificate Store (user CRT) + JWT claims
   4b. Auth Engine (SGX) access token 검증
5. Transaction Manager:
   5a. Balance Service → Node (잔액 부족 → fail)
   5b. Screening Service → AML Provider (Chainalysis / Elliptic / Notabene)
   5c. Screening Service → Travel Rule Provider
6. Balance + AML + Travel Rule pass → Policy Engine
7. Policy Engine (SGX) 검증:
   - Auto-approve 또는 explicit approval 요구
   - Native tx: 상세 / Raw Signing+Contract: 제한 정보
   - Approvers ← Auth Engine 검증 (each approval = mobile device 서명)
8. 충분한 approvals → Secure Vault (SGX) signing 개시
   - "PKI built into enclave of Policy Engine"
   - **Zero-trust**: 모든 service handoff 마다 derived root CA 검증
9. Vault 가 tx request cache → Co-Signer Engine (UUID + Policy rules)
10. Co-Signer Engine → Co-Signer 1/2/3 (SGX enclave 내 key shard 검증)
    - "data is not passed between them during signing" (zero-trust)
    10a. Co-Signer 3 → Callback Handler (optional, attached)
11. Co-Signer Engine → Auth Engine 가 partial signature hash 검증
12. → Secure Vault → 서명된 tx 생성
13. → Node infrastructure
14. → Blockchain
```

### Zero-Trust 명시 (Stage 9, Q-S08 부분 응답)

p.5: "All services in the Fireblocks core infrastructure operate in a **zero-trust configuration**. Each service has a **derivation of root CA** and **validates every handoff between services**."

→ Stage 8 의 Root Key chain of trust 가 **service-to-service handoff 까지 적용**. SGX 끼리도 derived cert 검증.

### AML Provider 정식 명시 (Q-S03 부분 응답)

`transaction-lifecycle.md`, p.4 diagram: AML Providers 명시 — **Chainalysis / Elliptic / Notabene**.

### Mainnet/Testnet 분리

`account-and-wallet-structure.md`, p.2: Mainnet workspace 는 Mainnet node 만, Testnet workspace 는 Testnet node 만 연결 — **node-level network 분리**.

## Sources (추가)
- `2026-05-18__support-fireblocks-io__transaction-lifecycle.md`, p.1-7 (Stage 9: 14-step schematic + zero-trust + AML provider 명시)
- `2026-05-18__support-fireblocks-io__primary-transaction-statuses.md`, p.1-10 (Stage 9: tx state machine)
- `2026-05-18__support-fireblocks-io__account-and-wallet-structure.md`, p.1-7 (Stage 9: 5-level hierarchy + Mainnet/Testnet node 분리)
- `2026-05-18__support-fireblocks-io__vault-structure-best-practices.md`, p.1-7 (Stage 9: vault structure patterns + multi-workspace)

## Open Questions

- ~~완전한 컴포넌트 다이어그램~~ — **부분 해소** (Stage 8 cloud-architecture diagram 확보; 컴포넌트 간 message flow 의 세부 protocol 은 여전히 부분만 명세)
- ~~Q-2026-05-18-S08~~ — **ANSWERED (Stage 9)**: Auth Engine / Policy Engine TAPs / Secure Vault / Co-Signer Engine 각 module 의 책임 + zero-trust handoff 명세
- Q-2026-05-18-S09 — Hosted MPC + BCM + Cold Wallet 의 통합 deployment topology
