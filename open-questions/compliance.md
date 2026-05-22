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

---

## 통계 (Stage 37 기준)

- Open: 8
- ANSWERED: 0
- 도메인: KR Regulations (신규)
