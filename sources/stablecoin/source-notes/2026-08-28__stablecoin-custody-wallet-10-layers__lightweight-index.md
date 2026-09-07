<!--
domain: Stablecoin / Custody Wallet Architecture / Bank-System Integration
status: lightweight-index (Mode B — 본문 deep ingest 보류)
priority: TIER 1 후보
stage: (제안) 174
received_at: 2026-09-02 (파일) · doc_date 2026-08-28
-->

# Lightweight Index — 스테이블코인 전용 수탁 지갑 시스템 (10개 계층 × 은행 시스템 접점)

| 항목 | 값 |
|---|---|
| 파일 | `sources/stablecoin/pdf/stablecoin-custody-wallet-10-layers.pdf` (34p) |
| 변환본 | `sources/stablecoin/markdown/2026-08-28__internal-digital-asset-team__stablecoin-custody-wallet-10-layers.md` (pdftotext, 페이지 마커 `--- p.N ---`) |
| 제목 | 스테이블코인 전용 수탁 지갑 시스템 — 10개 계층 구조와 은행 시스템 접점 |
| 저자·일자 | 디지털자산사업팀 (내부), 2026.8.28. HeadlessChrome 인쇄 PDF (2026-09-02 생성) |
| 성격 | **내부 검토 문서.** 표지에 "구조·사실관계·쟁점 정리 목적, 특정 구조 채택·사업 추진 판단 미포함" 명시 |
| Tier | 1 후보 — 수탁 지갑 아키텍처·은행 접점이 wiki 의 Architecture Reasoning Mode 와 blockchain-manager 설계 문서에 직결 |
| Mode | B. 표지(p.1~2)·장 제목·페이지 첫 줄만 확인. **본문 fact 미추출** |

## Evidence isolation

- 벤더 공식 근거가 아닌 **내부 작업 문서**. 인용 시 "내부 검토 문서 (source: …10-layers.md, p.N)" 로 표기하고 Fireblocks 공식 fact 와 같은 문장에서 섞지 않는다.
- 표지 전제(p.1): Fireblocks MPC 전제, 과도기 구조(파블 코리아 AWS 서울 리전 / 키관리존 / DMZ / PrivateLink), 달러 스테이블코인 취급, 기본법 시행 역산 일정. 이 전제들은 문서의 가정이며 wiki 확정 사실로 승격하지 않는다.
- 은행 시스템 구분(계정계·기간계·정보계·운영계·대외계·채널계)은 문서가 p.2 에서 "일반적인 은행 IT 구분에 따른 가정" 이라고 밝힘.

## 구성 (표지 목차 + 페이지 첫 줄 기준)

| 장 | 제목 | 페이지 |
|---|---|---|
| 0 | 개요 — 목적·전제·구성, 은행 시스템 구분 | p.1–2 |
| 1 | 참고 모델 — CEX 지갑 구조와 스테이블코인 수탁 지갑의 차이 | p.3–4 |
| 2 | 접점 총괄 — 계층 × 은행 시스템 매트릭스 | p.5 |
| 3 | 계층 ① Key Management & Signing — 키 관리·서명 | p.6–8 |
| 4 | 계층 ② Wallet Topology & Account Model — 지갑 계층 구조·계정 모델 | p.9–11 |
| 5 | 계층 ③ Chain Connectivity — 체인 연결 | p.12–13 |
| 6 | 계층 ④ Transaction Orchestration — 거래 처리 제어 | p.14–15 |
| 7 | 계층 ⑤ Ledger & Reconciliation — 원장·대사 | p.16–17 |
| 8 | 계층 ⑥ Compliance (AML · Travel Rule) — 준법감시 | p.18–19 |
| 9 | 계층 ⑦ Risk & Monitoring — 리스크·감시 | p.20–21 |
| 10 | 계층 ⑧ Issuer & Liquidity Integration — 발행사·유동성 연동 | p.22–23 |
| 11 | 계층 ⑨ Client Access & API — 고객 접점·API | p.24–25 |
| 12 | 계층 ⑩ Security, Infrastructure, Governance & Operations — 보안·기반·거버넌스·운영 | p.26–28 |
| 13 | 종합 — 은행 시스템별 접점 종합 | p.29–30 |
| 14 | 선결 결정과 협의 출발점(안) | p.31–32 |
| 부록 A | 규제 기준선 | p.33 |
| 부록 B | 용어 | p.34 |

각 계층 장은 말미에 "은행 시스템 접점" 정리를 둔다고 목차(p.2)에 명시.

## Cross-cut signal (장 제목 기반 예상 연결 — 본문 fact 아님)

| 계층 | 예상 연결 wiki / 설계 문서 | 확인 포인트 (promote 시) |
|---|---|---|
| ① 키 관리·서명 | [[vendors/fireblocks/mpc]] · [[vendors/fireblocks/security]] · docs/architecture Co-signer HA·키 관리 문서 | p.7 첫 줄에 TAP 룰 매칭 순서 언급 — wiki 의 First-Match Policy 서술과 정합 여부 |
| ② 지갑 구조·계정 모델 | [[entities/fireblocks/vault-account]] · blockchain-manager/docs/BC/설계/06-sweep.md | p.10 첫 줄에 KYT 미통과 입금 격리(quarantine) 언급 — sweep 설계의 격리 처리와 대조 |
| ③ 체인 연결 | blockchain-manager (노드 연동·웹훅 감지) | p.13 첫 줄에 발행사 이벤트(USDC Blacklisted/Pause, Tether AddedBlackList) 리스너 언급 |
| ④ 거래 처리 제어 | [[entities/fireblocks/transaction]] · blockchain-manager/docs/디지털 자산/가스대납/00-overview.md | p.15 첫 줄에 Tron 대역폭·에너지 모델 언급 — 현재 설계는 EVM 한정, 범위 차이 |
| ⑤ 원장·대사 | persistence-architecture/ · blockchain-manager DB 설계 | p.17 첫 줄에 체인 무관 잔고 vs 체인별 서브원장 쟁점 |
| ⑥ 준법감시 | sources/compliance/source-notes/lightweight-index.md · travel-rule sources | p.19 첫 줄에 출금 전 isBlacklisted 조회 언급 |
| ⑦ 리스크·감시 | [[vendors/fireblocks/risks]] | 알림 등급 체계(p.21) |
| ⑧ 발행사·유동성 | sources/circle · blockchain-manager/docs/BC/기능검토/04-usdc-gateway-fit.md | p.23 첫 줄에 CCTP 리밸런싱·체인별 재고 상하한 언급 |
| ⑨ 고객 접점·API | blockchain-manager API 문서 | p.25 첫 줄에 멱등성 키·웹훅 서명·재전송 언급 |
| ⑩ 보안·기반·운영 | [[vendors/fireblocks/security]] · Co-signer HA 문서 | p.27 공급망(SBOM·서명 빌드), p.28 키관리존 운영계 접점 |
| 13·14 종합·선결 결정 | docs/architecture (3-way 비교) · [[docs/architecture/krw-stablecoin-architecture-reference]] | p.32 에 선결 이슈 표 (# / 이슈 / 시스템 / 내용) |

## Related (후보)

- [[docs/architecture/krw-stablecoin-architecture-reference]] — 같은 domain 의 vendor-neutral 참고 문서
- [[open-questions/stablecoin]] — promote 시 신규 Q 수용처
- `sources/stablecoin/pdf/krw-stablecoin-architecture-proposal.meta.yml` — 같은 디렉터리의 선행 Mode C 사례

## Promote condition (Mode C)

- 사용자가 명시 promote 하고, 흡수처를 정한 뒤 — 후보: docs/architecture/ 에 vendor-neutral "수탁 지갑 10 계층 × 은행 접점" 문서 1건 (신규 entity 0), 또는 blockchain-manager/docs/BC/ 설계 문서와의 대조 메모.
- 장 단위 chunk(p.3–5 / 6–11 / 12–17 / 18–23 / 24–30 / 31–34) 로 변환본 lazy-load. 한 chunk 당 takeaway 5–15 bullet, 각 bullet `(source: 2026-08-28__internal-digital-asset-team__stablecoin-custody-wallet-10-layers.md, p.N)`.
- 특히 14장 선결 결정 표는 blockchain-manager 의 미확정 항목(NEXT.md)과 1:1 대조 가치가 높음.

## Curated wiki 영향

없음 — Mode B 단계. entity / hub / open-questions / log.md 미수정.
