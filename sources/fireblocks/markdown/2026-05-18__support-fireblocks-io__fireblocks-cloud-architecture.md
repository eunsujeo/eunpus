<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/6983991259036-Fireblocks-cloud-architecture
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__fireblocks-cloud-architecture.pdf
status: full
priority: TIER2
domain: Workspace-Management / Security-Access
-->

# Fireblocks cloud architecture

*Updated 5 months ago*

## One-line summary

**3 cloud providers 분할**: Azure (sensitive + SGX) / AWS (gateway+frontend, no secrets) / GCP Firebase (caching DB). **6 system components** (Shell Services / Co-signers / Core Components / Trusted Shared Services / Blockchain Nodes / Disaster Recovery). DR 서비스는 **xprv+fprv (extended ECDSA + EdDSA)** 재구성 가능 — 정기 사용 금지, **single point of compromise** 경고.

## Key Concepts

### 3-Cloud Provider 분할

p.1:
| Provider | 역할 | Secret 보관? |
|---|---|---|
| **Microsoft Azure** | core components, key share material, configs, policy rules, third-party API credentials, **SGX Confidential Enclaves** | YES |
| **Amazon AWS** | gateway + frontend, event orchestration | **NO** (no API keys, no MPC shares) |
| **Google Cloud Platform (Firebase)** | Console + mobile app **caching DB** | NO |

→ Azure 가 **모든 sensitive material 의 root**. AWS 는 외피 (gateway/frontend), GCP 는 caching layer.

### Co-Signer 분포 (Cloud 측면)

p.1: "Two co-signers are hosted on the Fireblocks SaaS cloud environment. The third co-signer is either **your mobile device** or **a self-hosted server (in your cloud environment or your on-premises data center)**."

→ Stage 8 MPC-CMP 문서의 "2 cloud + 1 customer" 모델 재확인. Customer 측은 mobile / customer cloud / customer on-prem 3 중 선택.

### Self-Hosted Co-Signer 권장 사항
p.2: "It is suggested to introduce **high availability (HA) and disaster recovery (DR)** using the Fireblocks Backup and Recovery procedures for a self-hosted co-signer."

→ Customer-side cosigner 도 HA/DR 권장.

### 6 System Components

p.2:

1. **Shell Services** (API gateways, event orchestration)
   - Frontend services + API Gateways + message queues
   - Client app ↔ core components orchestration
   - **No sensitive data**

2. **Transaction Signing Modules (Co-signers)**
   - **MPC private key shares + signing tx 보관**
   - Programmable interface 로 core services 와 통합
   - Sensitive data

3. **Core Components**
   - Core Fireblocks services + modules 실행
   - Sensitive data

4. **Trusted Shared Services**
   - Shared core services 실행 — **Fireblocks P2P Network 포함**
   - Sensitive data

5. **Blockchain Nodes Infrastructure**
   - Blockchain network 연결 + signed message broadcast
   - Public + private networks
   - 수직·수평 scale, 코드 최적화
   - **No sensitive data**

6. **Disaster Recovery Services** (★)
   - 재해 시 모든 자산 복구
   - **Extended ECDSA + EdDSA private keys (xprv+fprv)** 재구성 제공
   - **"Should be stored on an offline air-gapped machine with hardened access permissions"**
   - **"Should not be used regularly since reconstruction of the extended private keys introduces a single point of compromise"** ← 정식 SPOC 경고

### Deployment Diagram (p.3)

- **Azure (Core Services VPC)**: Auth Service · Policy Service · TAP · MPC · SGX · Co-Signer Engine · Secure Vault — Co-Signer 2개 + SGX CORE + SGX DMZ proxy
- **AWS Public VPC (Shell Services)**: Firestore · Transaction Manager · Dev API Gateway · Mobile Service · Web Console · API Gateway
- **AWS Public VPC (Node Infrastructure)**: Blockchain Nodes · Fireblocks Network · API Gateway

→ 두 AWS VPC (Shell + Node) 와 Azure (Core + SGX) 사이를 **PROXY + SGX DMZ** 가 매개.

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__fireblocks-cloud-architecture.pdf` (4 pages).

## Related Pages (cite targets)
- [[vendors/fireblocks/architecture]]
- [[vendors/fireblocks/security]]
- [[vendors/fireblocks/cosigner]]
- [[vendors/fireblocks/risks]]
- [[entities/fireblocks/workspace-keys-backup]]
- [[entities/fireblocks/cosigner]]
- [[entities/fireblocks/mpc-key-share]]
