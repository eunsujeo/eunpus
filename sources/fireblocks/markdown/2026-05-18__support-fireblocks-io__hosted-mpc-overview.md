<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/12901739472924-Hosted-MPC-Overview
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__hosted-mpc-overview.pdf
status: full
priority: TIER2
domain: Workspace-Management / Security-Access
-->

# Hosted MPC Overview

*Updated 2 years ago*

## One-line summary

**Hosted MPC** = customer 가 **3개 co-signer 모두**를 자기 환경 (cloud / on-prem) 에 호스팅하는 모델 — 지역 규제·내부 정책·end-user 요건 충족용. Default SaaS MPC (1 customer + 2 Fireblocks) 와 대비. SGX Co-Signer 필수.

## Key Concepts

### 정체성

p.1:
- "Hosted MPC feature allows you to **completely control the MPC key shares** by hosting all three Co-Signers in your own environment, either in the cloud or on-premises."
- 동기: regional regulators, internal policies, end-users 의 compliance 요건

### 두 종류 Co-Signer

| 종류 | 정의 | Key share |
|---|---|---|
| **Primary Co-Signer** | Mobile Device + Fireblocks mobile app, **또는** SGX machine 위의 API Co-Signer | 1/3 |
| **Guard Co-Signer** | SGX machine | 1/3 (각 Guard 마다) |

- Hosted MPC = **1 Primary Co-Signer + 2 Guard Co-Signers** (총 3, 모두 customer 환경)

### SaaS MPC vs Hosted MPC 비교

| 모델 | Customer 측 | Fireblocks 측 |
|---|---|---|
| **Default SaaS MPC** | 1 key share (mobile or API Co-Signer) | **2 key shares** (Fireblocks cloud SGX) |
| **Hosted MPC** | **3 key shares** (Primary + 2 Guard) | 0 key shares |

→ Hosted MPC 에서 Fireblocks 는 key share 를 **전혀 보유하지 않음** (완전 customer ownership).

### 전제 조건

p.1 Notes:
- **SGX Co-Signers 필수** (Mobile Primary 도 SGX 환경의 API Co-Signer 대안)
- Cloud 또는 on-premises 둘 다 지원
- 별도 setup 가이드: "SGX API Co-Signer setup" 문서

### Related Documents (Hosted MPC 시리즈)
p.2:
- API Co-signer overview and usage
- **About Fireblocks Off Exchange** ← Off-Exchange 가 Hosted MPC 와 강하게 묶인 카테고리
- **Hosted MPC Customer-Side Setup** (TIER 3 placeholder)
- **Hosted MPC Workspace Configuration** (TIER 3 placeholder)
- **Hosted MPC Backup and Recovery** (TIER 3 placeholder)

→ 별도 Hosted MPC sub-series 가 존재하나 본 wiki 에서는 Overview 만 deep ingest, sub-series 는 raw PDF only.

## Implication

- **Customer ownership 의 deployment axis** 등장:
  - SaaS MPC: 보안·간편성, 단 Fireblocks dependency
  - Hosted MPC: 완전 ownership + regulatory fit, 단 운영 부담 + BCM 도입 필요
- **BCM** (Business Continuity Module) 은 Hosted MPC 의 disaster continuity 보완 — 두 feature 가 짝.
- Cosigner entity 의 SGX 요구 사항 추가 (Mobile + customer SGX 옵션).

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__hosted-mpc-overview.pdf` (2 pages).

## Related Pages (cite targets)
- [[vendors/fireblocks/architecture]]
- [[vendors/fireblocks/cosigner]]
- [[vendors/fireblocks/mpc]]
- [[entities/fireblocks/cosigner]]
- [[entities/fireblocks/api-co-signer]]
- [[entities/fireblocks/workspace]]
