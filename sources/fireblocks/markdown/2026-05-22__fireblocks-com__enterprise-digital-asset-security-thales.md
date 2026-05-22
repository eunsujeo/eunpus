<!--
source_url: https://www.fireblocks.com/blog/enterprise-digital-asset-security-fireblocks-thales
downloaded_at: 2026-05-22
published_at: 2025-09-23
author: Adam Levine (SVP, Corporate Development & Partnerships, Fireblocks)
status: lightweight-index (Stage 38, Mode C ingest)
priority: TIER1
domain: Security-Access + Workspace-Management (Key Link cluster cross-cut)
-->

# Fireblocks × Thales — Enterprise Digital Asset Key Security Solution

**LIGHTWEIGHT INDEX (Stage 38, Mode C ingest)**. 1차 source (Fireblocks 공식 블로그).
marketing 톤이지만 Stage 36 Key Link cluster 의 후속 fact + Cold variant framing 의 vendor 공식 발언이 포함되어 wiki 적재.

## Why TIER 1

Stage 36 의 Key Link cluster (Risk-KL01–KL07) 의 후속 사실 + Stage 37 의 KR 컴플라이언스 옵션 C (Key Link + 자체 HSM) 의 구체 HSM 옵션 (Thales Luna) 으로 직접 cross-cut. KR 관할 미명시 = 별도 검증 항목.

## 핵심 fact (10)

1. **Title**: "Enterprise Digital Asset Security with Fireblocks and Thales"
2. **Published**: 2025-09-23
3. **Author**: Adam Levine — SVP, Corporate Development & Partnerships, Fireblocks
4. **통합 형태**: Fireblocks **KeyLink** 가 "secure middleware layer" 로 Thales Luna HSM 과 결합
   > "At the heart of this solution is Fireblocks KeyLink, our secure middleware layer that connects the Fireblocks platform to Thales Luna Hardware Security Modules (HSMs)"
5. **Thales 제품**: **Luna HSM** — FIPS 140-3 Level 3 + Common Criteria 인증
   > "Private keys remain within FIPS 140-3 Level 3 and Common Criteria certified hardware"
6. **3-mode signing workflow**: **Hot · Warm · Cold** — Cold variant 의 vendor 공식 framing
7. **Air-gapped workflow**: USB · SFTP · data diodes 사용 명시
8. **PQC readiness**:
   > "Thales Luna HSMs provide crypto agility and post-quantum cryptography (PQC) readiness"
9. **Customer key ownership**:
   > "Institutions maintain full key ownership while accessing enterprise-grade digital asset capabilities"
10. **관할권 명시**: HKMA · HKSFC · JFSA — **KR 미명시**

추가 fact:
- 거버넌스 기능 — 다중 승인 규칙, 주소 화이트리스팅, 거래 한도, immutable logs
- "organizational segmentation by business unit, geography, or regulatory jurisdiction"
- 별도 resource: "Thales-Fireblocks Digital Asset Key Security Solution Brief"

## Cross-cut Signal

### A. Stage 36 Key Link cluster (Risk-KL01–KL07) 후속

| Risk | Stage 36 상태 | Stage 38 추가 |
|---|---|---|
| **Risk-KL05 (HSM Adaptor cold-HSM latency)** | open — air-gap signing latency 미명세 | **부분 ANSWERED** — air-gap workflow 가 USB / SFTP / data diodes 임이 명시 (단 정확한 latency 수치는 여전히 미명세) |
| **Risk-KL04 (Validation Key Compromise)** | open | 변경 없음 |
| **Risk-KL01 (Customer Server SPOF)** | open | 변경 없음 |

### B. Cold variant framing (Stage 14 Cold Wallet cluster 와 cross-cut)

본 자료 = vendor 공식 **"Hot/Warm/Cold" 3-mode signing** 발언. Stage 14 cluster catalog 의 catalog-only fact 를 vendor 공식 발언으로 격상 가능.
단 SaaS Cold Wallet workspace 와 Key Link Cold signing 의 관계는 여전히 미명세 (별도 product 인가 같은 plane 인가).

### C. Stage 37 KR 컴플라이언스 옵션 C 보강

`docs-site/fireblocks-kr-vasp-compliance/deployment-checklist.html` §6.3 의 옵션 C (Key Link + 자체 HSM) — Thales Luna 가 구체 HSM 옵션으로 추가됨. 단 KR 관할 미명시는 별도 검증 항목.

## 새 Open Q (3)

- **Q-2025-09-23-FB01** — Key Link 의 "Hot/Warm/Cold" 3-mode 의 정확한 기술 정의 (특히 "Warm" 의 의미)
- **Q-2025-09-23-FB02** — SaaS Cold Wallet workspace 와 Key Link Cold signing 의 관계 (별도 product 인가 같은 plane 인가)
- **Q-2025-09-23-FB03** — HKMA · HKSFC · JFSA 명시 vs KR 미명시 — KR VASP 환경에서 Key Link + Thales Luna 적용 시 vendor 공식 입장

## Related

- [[vendors/fireblocks/risks]] §"Risk-KL01–KL07"
- [[vendors/fireblocks/security]] §"Customer Signature Validation Plane" (Stage 36)
- [[entities/fireblocks/workspace]] §"Key Link workspace type"
- [[open-questions/fireblocks]] §"Q-KL01–KL05" + 신규 Q-FB01–03
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__fireblocks-key-link-overview]]
- docs-site: `fireblocks-cold-wallet-bank-design/signing-flow.html` (Hot/Warm/Cold framing)
- docs-site: `fireblocks-kr-vasp-compliance/deployment-checklist.html` §6.3 (옵션 C)

## Promote condition (이미 Mode C ingested)

본 자료는 Stage 38 에서 Mode C 적재 완료. 다음 추가 자료가 발생 시 별도 stage:
- Thales-Fireblocks Solution Brief 본문 (현재 미적재)
- 한국 사례 (HKMA/HKSFC/JFSA 외 KR VASP customer announcement)
- Hot/Warm/Cold 3-mode 의 기술 spec 명세 자료
