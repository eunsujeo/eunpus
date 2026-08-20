# Open Questions — Compliance (KR Regulations)

> Stage 37 (2026-05-22) 도입. `sources/compliance/KR_Custodial_Wallet_Compliance_Guide.pdf` Mode C ingest 의 부산물.
> 1차 출처 (law.go.kr / 대법원 판결문 원본 / FSS 보도자료 등) 의 직접 검증 시 ANSWERED 처리.

## Q-CMP-01 — 2026 시행령·감독규정 개정안 정식 시행일

**Status**: open
**Stage**: 37
**Question**: 2026-03-30 예고된 시행령·감독규정 개정안의 정식 시행일 (PDF 인용 "2026-08 시행 예정"). 대주주 범위 구체화, 신고사항 세분화, 고위험 고객 강화 고객확인 명확화 등.
**Source**: KR_Custodial_Wallet_Compliance_Guide.pdf p.9 §68

## Q-CMP-02 — 대법원 2024도10710 판결 ratio decidendi

**Status**: open
**Stage**: 37
**Question**: 본 판결의 ratio 원문 — PDF 의 인용 (`불특정 다수인의 편익을 위하여 가상자산 거래를 하고 대가를 받는 행위를 계속·반복하면 원칙적으로 VASP 에 해당할 수 있다`) 은 요약. 원문 사실관계 + 법리 적용 단계 확인 필요. MPC·멀티시그 사업자 적용 시 "실질 통제" 기준 정형화 가능 여부.
**Source**: KR_Custodial_Wallet_Compliance_Guide.pdf p.2 §15 → 1차: law.go.kr precInfoP precSeq=600579

## Q-CMP-03 — 4 종합검사 제재 원문

**Status**: open
**Stage**: 37
**Question**: 두나무·코빗·빗썸·코인원 종합검사 결과의 FSS/FIU 보도자료 원본. PDF 의 위반 건수/금액/조치는 요약. 원본의 위반 사유 분류 + 시정명령 본문 + 행정처분서 확인 필요.
**Source**: KR_Custodial_Wallet_Compliance_Guide.pdf p.7 §32, §48, §49, §50 → 1차: fsc.go.kr 보도자료

## Q-CMP-04 — ISMS·ISMS-P 인증 vs 신고요건 매핑

**Status**: open
**Stage**: 37
**Question**: PDF 는 "ISMS 인증을 신고요건으로 삼고" 명시 (p.3). 정확히 ISMS 인지 ISMS-P 인지 + 신고심사에서 어떻게 평가되는지 + 인증 갱신 시 신고에 미치는 영향. 또한 PDF §36 "ISMS 보유로 끝나지 않고, 취약점평가와 사후보완 보고까지 포함하는 작동체계여야 한다" 의 시행세칙.
**Source**: KR_Custodial_Wallet_Compliance_Guide.pdf p.5 §36

## Q-CMP-05 — "법령준수체계" 요건의 시행세칙

**Status**: open
**Stage**: 37
**Question**: 2024-06 신고서 개정으로 추가된 "특정금융정보법, 가상자산이용자보호법 등 가상자산 관련 법령을 준수하기 위한 조직·인력·전산설비 및 내부통제체계" (PDF p.3 §23) 의 평가 기준. 신고심사 시 어느 정도까지 요구되는지.
**Source**: KR_Custodial_Wallet_Compliance_Guide.pdf p.3 §23

## Q-CMP-06 — "동종·동량" 보유 의무의 실무 해석

**Status**: open
**Stage**: 37
**Question**: 이용자보호법 시행령의 "이용자 가상자산과 동종·동량의 가상자산을 실질적으로 보유" 의 실무 인터프리테이션. 잠시 차이 (sweep timing, rebalancing 중) 가 허용되는 buffer 가 있는지, 회계 처리 단위, 검사 시 평가 시점.
**Source**: KR_Custodial_Wallet_Compliance_Guide.pdf p.5 §41

## Q-CMP-07 — 미신고 해외 VASP 의 "한국인 유치" 판단 기준

**Status**: open
**Stage**: 37
**Question**: PDF p.2 의 "해외 미신고 VASP 단속 시 한국어 홈페이지, 원화결제 지원, 한국인 유치 이벤트 등이 영업성 판단요소로 제시" — 정확한 cumulative test 인지, 단일 요소 충족 시 영업성 인정인지. 2022-08-18 의 16개 외국 VASP 차단 조치 (PDF §51) 의 판단 자료.
**Source**: KR_Custodial_Wallet_Compliance_Guide.pdf p.2 §18, p.7 §51

## Q-CMP-08 — MPC·멀티시그 사업자의 "실질 통제" 기준

**Status**: open
**Stage**: 37
**Question**: 대법원 2024도10710 ratio 의 wallet architecture 적용 — "사업자가 이용자의 자산 이동을 실질적으로 통제하거나 승인권을 행사하면 보관 또는 관리 또는 이전 행위로 평가" (PDF §15). MPC 의 share 분포 / 임계 / 사업자 보유 share 수에 따른 판단 임계점. Fireblocks SaaS (Fireblocks 2 share + customer 1 share) vs Hosted MPC (customer 3 share) vs Key Link (customer HSM 직접) 의 평가 결과 차이.
**Source**: KR_Custodial_Wallet_Compliance_Guide.pdf p.2 §15

## Q-CMP-09 — 2026 특금법 시행령 개정안 원문·시행일

**Status**: partial-answered (★ Stage 149)
**Stage**: 148
**Question**: 가상자산_트래블룰_분석.pdf (2차) 가 기술하는 2026 개정 추진 4건의 1차 확인 — ① 100만원 기준 폐지 (전 거래 확대), ② 수취 VASP(Beneficiary) 정보 수집·검토 의무 + 검토 실패 시 수취 거절, ③ 국외 발행 스테이블코인 EDD 의무, ④ 1,000만원 이상 해외 이전 의무 보고제의 자율 관리 선회. 입법예고문·시행령 개정안 원문과 확정 시행일. Q-CMP-01 (2026 개정안 시행일) 과 같은 개정 사이클인지도 확인.
**Source**: 가상자산_트래블룰_분석.pdf §2026년 특금법 개정과 규제 고도화 시나리오 → 1차: FIU/FSC 보도자료 (fsc.go.kr no010101/86209 — '26년 자금세탁방지 주요 업무 수행계획)
**진전 (Stage 149 — 웹 리서치)**:
- **①②③ 1차 확정** — FSC 보도자료 "'26년 자금세탁방지 주요 업무 수행계획" (2026-02-05, fsc.go.kr/no010101/86209) 원문: "국내거래소간 적용 대상을 100만원 미만 거래까지 확대" · "송신거래소뿐 아니라 수신거래소에도 정보를 확보할 의무를 부과할 예정" · "개인지갑·해외사업자와의 스테이블코인 거래시에는 위험기반접근에 따른 대응조치 의무를 부과할 예정" (PDF 의 "EDD" 표현보다 넓은 "위험기반 대응조치")
- **④ 언론 교차 확인** — 2026-03 입법예고(1,000만원 이상 해외 이전 일률 보고) → 업계 반발 → 각사 위험평가 관리로 완화 (zdnet 2026-05-29 단독 · news1 6188489 · ajunews 2026-06-05)
- **시행일** — 개정 규정 2026-08-20 시행 (언론 보도 기준 — Q-CMP-01 의 "2026-08 시행 예정" 과 동일 사이클로 추정)
- **잔여**: 입법예고문·개정령 원문 (법제처 공고), 시행일의 1차 확인

## Q-CMP-10 — 두나무 트래블룰 행정소송 1심 판결문 원문

**Status**: partial-answered (★ Stage 149)
**Stage**: 148
**Question**: PDF 인용 — "100만원 미만 거래에 법령상 의무 규격이 없던 시기의 소급 제재는 재량권 이탈로 위법" (두나무 승소, 영업일부정지 3개월 + 과태료 처분 취소). 사건번호·판결문 원문·ratio 확인. 빗썸(6개월)·코인원(3개월)·코빗(과태료) 제재 건의 병행 쟁송 현황도.
**Source**: 가상자산_트래블룰_분석.pdf §실효성 논란과 업계의 집단 반발 및 사법부의 판단 → 1차: 법원 판결문 (사건번호 미상)
**진전 (Stage 149 — 웹 리서치, 언론 다수 교차)**:
- **서울행정법원 행정5부(재판장 이정원), 2026-04-09 선고 — 원고(두나무) 승소**, FIU 의 3개월 영업 일부정지 처분 취소 (fnnews 202604091404269769 · digitaltoday 655257 · ajunews 20260409134110670)
- **ratio 는 PDF 서술과 다름** — PDF 의 "소급 제재 위법" 이 아니라: 100만원 미만 거래는 기준이 충분히 정비되지 않았고, "사후적으로 의무이행이 충분하지 않았다 해서 고의 또는 중과실로 필요한 조치를 하지 않은 경우로 보기 어렵다" → 처분 사유 불인정
- 빗썸의 영업정지 취소소송은 별도 진행 중 — 첫 공방 (bizhankook 32110)
- **잔여**: 사건번호·판결문 원문 (law.go.kr 등재 대기 가능성)

## Q-CMP-11 — VerifyVASP-CODE 상호 통합의 1차 출처

**Status**: partial-answered (★ Stage 149)
**Stage**: 148
**Question**: "CODE 가 Corda 기반 설계를 비블록체인으로 재개발해 VerifyVASP 와 상호연동 완성" (PDF — 2차) + "2022-04-25 금융당국 권고로 두 망 상호 통합" (open-questions/fireblocks.md Q-2026-07-08-C03 진전 항목 — 역시 2차). 통합 완료 시점·범위(전 회원 자동 도달 여부)·금융당국 권고 원문.
**Source**: 가상자산_트래블룰_분석.pdf §글로벌 규제 동향과 솔루션 아키텍처 → 1차: 금융위 보도자료·CODE/람다256 공식 발표
**진전 (Stage 149 — 웹 리서치)**:
- **연동 완료 시점 확정**: 2022-04-25 0시부터 4대 거래소(업비트↔빗썸·코인원·코빗) 간 100만원 이상 입출금 재개 — 코인원 공지(coinone.co.kr/info/notice/1673, VASP 공식) + fnnews·한경 교차. 당초 2022-03-25 시행과 동시 연동 예정이 1개월 지연된 것
- **★ 정정**: "2022-04-25 금융당국 권고" (Stage 146 기록·docs-site 9장) 는 확인 안 됨 — 4-25 는 권고일이 아니라 **연동 완료일**. 언론·공지는 거래소 간 연동 작업 완료로 서술. docs-site 9장·Q-C03 진전 항목 정정 완료 (Stage 149)
- **잔여**: 당국 권고·개입의 실재 여부 (있다면 원문), 전 회원 자동 도달 범위 (VV 회원 ↔ CODE 회원 전면 도달인지)

## Q-CMP-12 — 개인지갑 등록의 Fireblocks 반영 수단은 무엇인가?

**Status**: open
**Stage**: 157
**Question**: 컴플라이언스 api.md 는 "개인지갑 등록·소유 증명을 벤더(Address Registry)에 반영 대행" 으로 계약했는데, Fireblocks **Address Registry 는 LEI 기반 VASP 법인 조회 기능이라 개인지갑 등록을 받지 않는다** (reference-address-registry.md — 커버리지 Fireblocks network 내부만, 비고객 주소는 `not_found`). 실제 대응물 후보는 **whitelisted internal/external wallet** (Admin Quorum 게이트·immutable·wallet 당 asset 당 1주소 — whitelisting-new-addresses.md p.1-2) 또는 OTA + Policy 제한. 어느 쪽으로 반영할지, 그리고 소유 증명(ownershipProof)을 벤더 쪽에 남길 수단이 있는지.
**Where this came up**: blockchain-manager/docs/컴플라이언스/API/api.md §Register Wallet · [[vendors/fireblocks/compliance]] §Address Registry
**Sources to check**: external wallet API (`POST /v1/external_wallets`) · OTA 문서 · Notabene end-user wallet 검증

---

## 통계 (Stage 157 기준)

- Open: 12 (그중 partial-answered: 3 — Q-CMP-09·10·11)
- ANSWERED: 0
- 도메인: KR Regulations + 벤더 반영 수단 (Q-CMP-12)
