<!--
source: KR_Custodial_Wallet_Compliance_Guide.pdf
status: Mode C ingested (Stage 37)
priority: TIER1
domain: Compliance / KR Regulations (신규 도메인)
downloaded_at: 2026-05-22
-->

# KR Custodial Wallet Compliance Hub

**Mode C ingested (Stage 37)** — 12 페이지 본문 적재 완료. fact 50+ 가 docs-site 3 문서에 cross-cut 됨.

## Why TIER 1

- KR 수탁형 지갑 사업의 모든 법령·규정·신고제·제재실무를 단일 source 에 통합
- 5 priority domain (Workspace / Identity / Governance / Mobile / Security) 와 직교적인 **6 번째 신규 도메인 (Compliance)** entry point
- docs-site 의 3 개 기존 reference 문서 (custodial-wallet-db-design / nodewallet-bank-design / fireblocks-cold-wallet-bank-design) 의 KR section 의 ★ Hypothesis 다수에 직접 답변

## 핵심 cross-cut signal

### A. fireblocks-cold-wallet-bank-design 의 ★ Hypothesis ANSWERED
- **냉지갑 80% 비율** — 시행령 §11 위임 "≥70%" + 가상자산업감독규정 §9 "경제적 가치 80%" (PDF p.5–6, 1차: law.go.kr lsiSeq=263547)
- **특금법 / VACPA 시행일** — 2024-07-19 동일 시행
- **신고제 운영** — 3년 유효, 갱신 45일 전, 신규 3개월, 변경 45일 (PDF p.2–3)

### B. custodial-wallet-db-design 의 AML 보강
- **트래블룰 임계 = 100만원** (시행령 §10조의10)
- **기록보존 = 최소 5년** (특금법 §5조의4)

### C. nodewallet-bank-design 의 5 KR 규제 매핑 보강
- 5 규제 시행일 + 신고제 + 제재사례 cross-link

### D. 신규 fact (모든 docs-site 문서에 공통 적용)
- **대법원 2024도10710** (2024-12-12) — MPC·멀티시그 사업자의 "실질 통제" 시 VASP 평가 가능
- **4 종합검사 제재사례** — 두나무·코빗·빗썸·코인원 (2025-02 ~ 2026-04)
- **해외 비교 4 관할** — 미국 FinCEN MSB / EU MiCA CASP / 영국 FCA MLR / 싱가포르 MAS PSA

## Promote 후 작업 (Stage 37 완료 항목)

- [x] sources/compliance/source-notes/inventory.md (catalog + 50+ fact)
- [x] sources/compliance/source-notes/lightweight-index.md (본 파일)
- [x] open-questions/compliance.md (Q-CMP-01 ~ Q-CMP-08)
- [x] docs-site/fireblocks-cold-wallet-bank-design/risks-open-questions.html (§7.4 ANSWERED)
- [x] docs-site/fireblocks-cold-wallet-bank-design/bank-operations.html (§6.3 / §6.5 보강)
- [x] docs-site/fireblocks-cold-wallet-bank-design/index.html (80% 냉지갑 fact)
- [x] docs-site/fireblocks-cold-wallet-bank-design/cold-wallet-fundamentals.html
- [x] docs-site/nodewallet-bank-design/compliance-regulations.html (5 KR 규제 시행일)
- [x] docs-site/custodial-wallet-db-design/tables-aml.html (트래블룰 + 5년)
- [x] log.md Stage 37 entry

## Related

- [[sources/compliance/source-notes/inventory]]
- [[open-questions/compliance]]
- [[vendors/fireblocks/risks]] §"KR 규제 cross-cut"
- 1차 출처 (PDF footnote 75 개) — law.go.kr / fsc.go.kr / 대법원 / FinCEN / FCA / MAS / EUR-Lex
