<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/20919673259292-Business-Continuity-Module-BCM
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__business-continuity-module-bcm.pdf
status: full
priority: TIER2
domain: Workspace-Management / Operations / Security
-->

# Business Continuity Module (BCM)

*Updated 10 months ago*

## One-line summary

BCM = **Hosted MPC 고객 전용** on-prem 솔루션, Fireblocks SaaS unavailable 시에도 transaction signing 유지. **Dockerized 6-component** on-prem stack (BCM API + Aggregator + Redis + Offline Signing Console + Co-Signer Cluster + API Co-Signer) — Fireblocks Cloud Aggregator 기능을 customer 측에서 대체.

## Key Concepts

### 정체성 / Eligibility
p.1: BCM 은 **Fireblocks Hosted MPC customers 전용** — SaaS-only 고객은 사용 불가. SaaS outage / 연결 단절 시 customer infrastructure 만으로 signing 지속.

### Components (Docker images)

p.1-2 diagram:

| Component | 역할 | 개발/호스팅 |
|---|---|---|
| **BCM API** | public API entry point, tx 요청·인증 처리 | Fireblocks 개발 / customer 호스팅 |
| **BCM On-Prem MPC Aggregator** | MPC protocol message 순서 관리 (MPC broker) — BCM Primary ↔ Guard Co-Signer | Fireblocks 개발 / customer 호스팅 |
| **BCM DataStore (Redis)** | transit 중인 tx state 임시 저장 (Redis ≥ 6.2 non-clustered) | Fireblocks 개발 / customer 호스팅 |
| **Offline Signing Console** | proprietary QR display/scan camera 사용 web app, BCM modules 와 통신 | Fireblocks 개발 / customer 호스팅 |
| **Co-Signer Cluster** | BCM-version (secondary engine + publickey, aggregator URL 옵션) | Fireblocks |
| **API Co-Signer** | BCM-version | Fireblocks |
| **Offline Mobile Device** | Fireblocks Cool Wallet App + BCM support | (external 고객 인프라) |
| **Customer Backend** | vault/wallet/key data → BCM API 로 tx 직렬화 | Customer 개발/호스팅 |

→ Architecture 측면에서 **Cloud Aggregator 가 customer-side 로 이동**한 것이 핵심 차이.

### 보안 / 통신
p.2-3:
- TLS 통신, **customer-signed certificates**, private key authentication
- Signed **x-access-token JWTs**
- Secure certificate management

### High Availability
p.2: **Active-Active 와 Active-Passive HA 둘 다 지원**

### Requirements
p.3:
- SW: Primary & Guard Co-Signer v3.9.0+, Offline Mobile App v2.0.12+
- Infra: VM 16 GB RAM, Docker + Docker Compose, **TLS certs signed by Fireblocks**
- Optional: Nginx (TLS proxy), Kubernetes

### Cold Wallet 연계
p.2: "Integrates with Fireblocks' MPC infrastructure and **Cold Wallet apps**" — BCM 은 Cold Wallet 운영의 일부.

## Operational Implication

- **Continuity 모델 분리**:
  - SaaS-only customer → Fireblocks SaaS outage = signing halt
  - **Hosted MPC + BCM customer** → SaaS outage 후에도 on-prem stack 으로 signing 지속
- Workspace SPOF 축의 새로운 mitigation path

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__business-continuity-module-bcm.pdf` (3 pages).

## Related Pages (cite targets)
- [[vendors/fireblocks/architecture]]
- [[vendors/fireblocks/cosigner]]
- [[vendors/fireblocks/risks]]
- [[entities/fireblocks/cosigner]]
- [[entities/fireblocks/api-co-signer]]
- [[entities/fireblocks/workspace]]
