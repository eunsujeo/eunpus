---
title: 가상자산 트래블룰 — Reference (한국 특금법 중심)
layer: architecture
stage: 148
last_updated_stage: 149
date: 2026-07-08
status: draft
reasoning_mode: domain-reference (규제 도메인 — 설계 대상 아님, 설계 문서의 규제 전제를 공급)
source_primary: sources/travel-rule/markdown/2026-07-08__pdf__travel-rule-analysis-extracted.md
source_secondary:
  - sources/travel-rule/markdown/2026-07-08__support-upbit-com__travel-rule-guide.md
  - sources/travel-rule/markdown/2026-07-08__chainalysis-com__travel-rule-glossary.md
  - sources/travel-rule/webpages/ (Stage 146 Mode B 5건 — VerifyVASP 공개 리서치)
depends_on:
  - vendors/fireblocks/compliance.md — Fireblocks 쪽 Travel Rule 구현 (Notabene·TRLink·Screening 2단)
  - docs-site/travel-rule/ — 설계 문서 (병행 구성·트래블룰 게이트·시나리오 6종)
related_questions: open-questions/compliance.md Q-CMP-09 · Q-CMP-10 · Q-CMP-11
core_thesis: |
  트래블룰은 온체인 규칙이 아니라 VASP 사이의 오프체인 신원 메시징 의무다.
  한국은 100만원 기준 실시간 정보 제공을 세계에서 처음 전면 시행했고,
  실무의 뼈대는 "출금 = 사전 대조 후 전파, 입금 = 대조 실패 시 잔고 차단(입금대기)" 두 줄이다.
  설계 관점에서 이 규칙은 출금 파이프라인의 앞단 게이트와 입금 가용 전이 게이트로 나타난다
  (설계 반영: docs-site/travel-rule/ · Stage 147 결정 — 게이트는 블록체인 매니저 밖).
---

# 가상자산 트래블룰 — Reference (한국 특금법 중심)

> **본 문서의 위치**: 규제 도메인 reference. Fireblocks 쪽 구현은 [[vendors/fireblocks/compliance]] 가, 우리 설계 반영은 docs-site/travel-rule/ 이 맡고, 본 문서는 그 둘이 전제하는 **규제 자체** (기원·한국 법제·글로벌 비교·솔루션 지형·거래소 실무·개정 동향)를 한 곳에 모은다.
>
> **출처 표기**: `(PDF §절명)` = 가상자산_트래블룰_분석.pdf (2차 — 합성 리서치, 각주 39건), `(upbit)` = 업비트 공식 가이드 (1차), `(chainalysis)` = Chainalysis glossary (벤더 공식). 2차 단독 근거인 fact 는 절 단위로 명시한다.

> **본 문서가 답하는 핵심 질문**
> 1. 트래블룰은 무엇을, 누구에게, 언제부터 강제하는가?
> 2. 한국의 100만원 기준은 글로벌 임계값 지형에서 어디에 있는가?
> 3. VerifyVASP / CODE / Notabene 세 솔루션은 무엇이 다른가?
> 4. 거래소 실무에서 출금·입금은 각각 어떤 통제 경로를 지나는가?
> 5. 2026년 개정 추진은 무엇을 바꾸려 하고, 어디까지 확정인가?

---

## 0. 핵심 명제 (10초 이해)

- 트래블룰 = VASP 간 가상자산 이전 시 **송신인·수취인 신원 정보를 수집·기록·상호 교환**하도록 강제하는 AML 규제. SWIFT 의 전신송금 정보 체계를 가상자산에 이식한 것 (PDF §정의와 제도적 기원).
- 기원은 **FATF 권고안 16호의 2019년 가상자산 확대**. 한국은 특금법 시행령 제10조의10 으로 **2022-03-25 전면 시행** — 세계 최초 전면 도입국 (PDF §정의와 제도적 기원·§결론).
- 한국 기준: **원화 환산 100만원 이상** 이전 시 송신 VASP 가 송금인 실명·지갑 주소·신원 정보·생년월일 + 수취인 실명·지갑 주소를 수취 VASP 에 **실시간 제공** (PDF §정의와 제도적 기원).
- 실무 두 줄: **출금은 사전 대조 후 전파** (수취 VASP 의 성명 Match 신호가 와야 온체인 전파), **입금은 대조 실패 시 잔고 차단** (미연동·미등록 출처의 100만원 이상 = 입금대기 락업) (PDF §입출금 트랜잭션의 실무적 통제 플로우, upbit).
- 설계 반영은 완료 — 트래블룰 게이트는 블록체인 매니저 밖, Service 업무층 (Stage 147, docs-site/travel-rule/ 10장).

## 1. 정의와 기원

가상자산 트래블룰은 VASP 가 고객 요청으로 가상자산을 다른 VASP 에게 이전할 때, 자금 이동 추적을 위해 송신인·수취인의 신원 정보를 의무적으로 수집·기록·상호 교환하도록 강제하는 국제 AML 규제 체계다. 전통 금융권에서 은행 간 해외 송금 시 SWIFT 표준 형식으로 송출인·수취인 데이터를 기록·전송하던 시스템을 가상자산 메커니즘에 이식했다 (PDF §정의와 제도적 기원).

- 규제 근거: FATF 권고안 16호 — 2019년 가상자산·VASP 로 적용 범위 확대 (chainalysis).
- 목적: 자금세탁·테러자금 조달·제재 회피 방지 — 가상자산의 익명성·비가역성 악용 차단 (PDF §정의와 제도적 기원, chainalysis).

### VASP 의무 3종 (chainalysis)

| 의무 | 내용 |
|---|---|
| 데이터 제공 | 송금인·수취인 정보 수집·전송. 정보 누락·허위 기재는 그 자체로 위반 |
| 심사 | 전송 시 거래 상대방·제재 대상 심사. 제재 대상으로의 데이터 전송 = 트래블룰 위반 + 제재 위반 |
| 기록 보관 | 전송·심사를 입증하는 감사 가능한 증거. 당국은 주장이 아니라 문서를 요구 |

## 2. 한국 법제 — 특금법 100만원 기준

- 근거: 특정금융정보법 시행령 **제10조의10** (가상자산이전 시 정보제공), **2022-03-25 시행** (PDF §정의와 제도적 기원).
- 기준: **원화 환산가 100만원 이상**의 가상자산 이전.
- 제공 정보: 송금인 실명·지갑 주소·신원 정보·생년월일 + 수취인 실명·지갑 주소 — 실시간 제공 의무 (PDF §정의와 제도적 기원).
- 100만원 미만 반복 분할 송금(Structuring)은 시스템 필터링으로 적발 대상이고 (PDF §법인 VASP 판정 기준), 운영 VASP 도 "100만원 미만 입출금이 반복되면 이상입출금으로 반려될 수 있음"을 명시한다 (upbit).

## 3. 글로벌 임계값 비교 (chainalysis)

| 관할권 | 임계값 | 근거 |
|---|---|---|
| FATF (권고) | USD/EUR 1,000 | 권고안 16 |
| **한국** | **KRW 1,000,000** | 특금법 시행령 제10조의10 |
| EU | **0** (모든 가상자산) | 규정 2023/1113 (TFR, 2024-12 시행) |
| 미국 | $3,000 | BSA / 31 CFR 1010.410 |
| 영국 | 0 (가상자산) | MLR 2017 (2022 개정) |
| 싱가포르 | SGD 1,500 | MAS PSN02 |
| 스위스 | CHF 1,000 | FINMA 지침 |

- EU 의 zero-threshold 가 가장 엄격 — EU 접점이 있는 VASP 에게 사실상 글로벌 기준으로 작동 (chainalysis).
- 한국의 2026 개정 추진(국내거래소간 100만원 미만 확대 — 8절, ★ Stage 149 FSC 원문 확정)이 실현되면 EU 형 zero-threshold 에 근접하는 셈.

## 4. 솔루션 지형 — VerifyVASP / CODE / Notabene

국내 시장은 두나무 자회사 람다256 의 **VerifyVASP** 연합과 빗썸·코인원·코빗 합작 **CODE** 진영으로 양분되며, 글로벌 축은 **Notabene** 등 레그테크 SaaS 다. 셋 모두 데이터 표준은 **IVMS101** 로 같고, 통신 아키텍처가 다르다 (PDF §글로벌 규제 동향과 솔루션 아키텍처).

| 비교 축 | VerifyVASP | CODE | Notabene |
|---|---|---|---|
| 주체 | 람다256 (두나무 자회사) 주도 연합 | 빗썸·코인원·코빗 합작법인 | 글로벌 레그테크 기업 |
| 구현 | 비블록체인 API + **Enclave 서버** (각 VASP 인프라 설치형) | Corda 프라이빗 블록체인 → **VV 상호연동 과정에서 비블록체인으로 재개발** | 멀티 프로토콜 SaaS |
| 데이터 보안 | E2EE — 중앙 서버는 복호화 불가 | 노드 간 직접 합의 (중개자 배제) | 기업별 룰 엔진·오케스트레이션 |
| 상호운용 | CODE 와 상호연동 완료 | VerifyVASP 와 직접 통신망 | 글로벌 규격 연계 |

(표는 PDF §글로벌 규제 동향 — 2차. VV-CODE 상호운용은 **2022-04-25 0시 연동 완료·4대 거래소 간 100만원 이상 입출금 재개**로 확정 — 코인원 공지 + 언론 교차, ★ Stage 149. 당초 2022-03-25 시행과 동시 연동 예정이 1개월 지연. "금융당국 권고" 서술은 미확인 — 잔여는 Q-CMP-11.)

- VerifyVASP 동작 구조: 각 VASP 가 자기 인프라에 Enclave 서버를 설치 → 거래 발생 시 송신 VASP 의 Enclave 가 수취 VASP 로 주소 검증·계정 일치 조회 API 를 전송 → 중앙 서버는 중계만 (E2EE 라 PII 접근 불가) (PDF §글로벌 규제 동향; Enclave/VASP API 상세 목록은 sources/travel-rule/webpages/docs-verifyvasp-com__llms-index.meta.yml).
- IVMS101 casing 규약: Entities/Components = UpperCamel, elements = lowerCamel, values 비교는 case-insensitive (PDF §글로벌 규제 동향).
- Fireblocks 관점: 공식 제공자 목록은 Notabene(직접)·Sumsub·GTR(TRLink)·Chainalysis·Elliptic 이고 **VerifyVASP 는 부재** — 국내 망을 쓰면 게이트가 벤더 밖으로 나온다 ([[vendors/fireblocks/compliance]] §Travel Rule, docs-site/travel-rule/ 9장).

## 5. 출금 실무 플로우 (거래소 통제 경로)

PDF §입출금 트랜잭션의 실무적 통제 플로우 (2차) — 방향과 단계는 upbit 1차 가이드와 정합.

1. **원화 환산가 판정** — 출금 신청 즉시 실시간 시세로 환산. 100만원 미만이면 트래블룰 프로세스 유예, 이상이면 정보 제공 대상으로 강제 지정.
2. **수취처 데이터 매칭** — 이용자가 목적지 VASP 선택 + 수취인 실명 입력 (개인 회원: 받는 사람 이름 / 법인 회원: 법인명 + 대표자 이름 — upbit).
3. **VASP 간 신원 상호 조회** — 송신 측 Enclave 가 IVMS101 데이터를 수취 VASP 백엔드로 전달, 수취 측이 자체 KYC DB 와 성명 완전 일치 여부 검증.
4. **온체인 실행 결정** — Match 신호 수신 시에만 출금 승인·온체인 전파. 불일치면 즉시 거절.

계정주 확인 연동 VASP 로의 출금은 "업비트 계정주 = 입금받을 계정주 동일인" 확인 방식이고, 개인지갑 출금은 등록(화이트리스트)된 본인 지갑만 허용된다 (upbit).

## 6. 입금 실무 플로우 — 입금대기와 반환

- **곧바로 반영**: ① 100만원 미만, ② 트래블룰 연동 VASP 발 정상 식별 메시지 인입 건, ③ 사전 등록된 본인 개인지갑 발 (upbit; PDF §입금대기 대응 플로우).
- **입금대기 (잔고 차단·락업)**: 미연동 사업자 발 또는 미등록 개인지갑 발 100만원 이상 — 잔고 반영이 차단되고 계류 (PDF §입금대기 대응 플로우; upbit 는 "트래블룰 미준수 입금 건은 입금 반영 불가" 로 명시).
- **수동 해제**: 송신 측 고객 정보 화면·거래 원장 캡처 등 증빙을 제출해 준법부서 심사 (PDF — 2차). 계정주 확인 연동 VASP 발은 [추가확인] 버튼의 계정주 확인 절차, 위험평가 통과 해외 VASP 발은 입금 출처 확인 소명으로 해제 (upbit).
- **강제 반환**: 제3자 송금·미신고 해외 사업자 발 등 준수 불가 판정 건은 **원 송출처(FROM 주소)로 반환, 온체인 가스 차감 후 잔여만** 반환. 반환 대기 중 가격 변동 손실은 이용자 책임 (PDF §입금대기 대응 플로우 — 2차).

> **설계 접점**: 이 "입금대기" 가 docs-site/travel-rule/ 10장의 **가용 전이 게이트** 다 — 온체인 확정(DCCP)과 별개로 컴플라이언스 통과가 있어야 가용(available) 전이. 워크스루 5장의 REJECTED/동결 처리와 합류한다.

## 7. 개인지갑 (self-hosted) — 화이트리스트와 소유 증명

- 지원 지갑 5종: **메타마스크** (PC 웹 + 모바일 앱), **카이아·팬텀·폴카닷·케플러** (PC 웹 전용) (upbit).
- 등록 = 소유 증명: VASP 가 일회성 nonce 를 제시하고 이용자가 지갑 개인키로 서명 → 암호학적 소유 입증. 등록 완료된 본인 지갑만 자유 입출금 (PDF §개인지갑의 연동 및 소유권 검증 규격).
- 등록 전 입금된 건은 등록 후 반영 (upbit).
- 트래블룰 망(VV·CODE·Notabene)은 개인지갑 자체를 나르지 않으므로, 개인지갑 통제는 **각 VASP 의 등록부가 방어선** — 설계 반영은 docs-site/travel-rule/ 11.3·11.6 (주소 등록부 + 소유 인증 증적).

## 8. 2026 특금법 개정 동향 (★ Stage 149 — 방향 3건 1차 확정, 원문·시행일 잔여)

핵심 방향은 FSC 보도자료 "'26년 자금세탁방지 주요 업무 수행계획" (2026-02-05, fsc.go.kr/no010101/86209) 원문으로 확정. 개정령 원문·시행일 1차 확인은 Q-CMP-09 잔여.

- **100만원 미만 확대 (1차 확정)** — "국내거래소간 적용 대상을 100만원 미만 거래까지 확대" (FSC 보도자료 원문). PDF 의 "폐지" 표현보다 정확히는 국내거래소간 확대. 거래 건수의 60% 가 100만원 미만이라는 통계가 배경 (PDF — 2차).
- **수신거래소 의무 신설 (1차 확정)** — "송신거래소뿐 아니라 수신거래소에도 정보를 확보할 의무를 부과할 예정" (FSC 보도자료 원문). 검토 실패 시 수취 거절까지는 PDF 서술 (2차).
- **스테이블코인 (1차 확정)** — "개인지갑·해외사업자와의 스테이블코인 거래시에는 위험기반접근에 따른 대응조치 의무" (FSC 보도자료 원문). PDF 는 이를 "EDD" 로 좁혀 표현 (2차).
- **1,000만원 이상 해외 이전 일률 보고제 → 각사 관리로 완화 (언론 교차)** — 2026-03 입법예고 후 업계 반발로 각사 위험평가 관리 방식으로 조정 (zdnet 2026-05-29 · news1 · ajunews 2026-06-05).
- **시행 일정** — 개정 규정 2026-08-20 시행 (언론 보도 기준 — 원문 확인 잔여). FSC 계획 원문은 "법률 개정 과제는 상반기 중 개정안 마련·국회 제출 추진".
- **업계 반발**: DAXA 27개사 연대 의견서 — 해외 거래소 연동 중단(갈라파고스화) 우려 (PDF — 2차).
- **두나무 행정소송 1심 승소 (★ Stage 149 — 언론 다수 교차·ratio 정정)** — 서울행정법원 행정5부, 2026-04-09 선고: FIU 의 3개월 영업 일부정지 처분 취소. ratio 는 PDF 의 "소급 제재 위법" 이 아니라 **"100만원 미만 거래는 기준 미정비 → 고의·중과실 인정 어려움 → 처분 사유 불인정"**. 빗썸 취소소송은 별도 진행 중. 판결문 원문·사건번호는 Q-CMP-10 잔여.

## 9. Related Pages

- [[vendors/fireblocks/compliance]] — Fireblocks Travel Rule 구현 (Notabene 연동·TRLink·Screening/Post-Screening 2단·premium opt-in)
- docs-site/travel-rule/ — 설계 문서: 병행 구성 (국내 VerifyVASP · 해외 Notabene)·트래블룰 게이트 위치 (Stage 147)·시나리오 6종
- docs-site/wallet-design-walkthrough/05-deposit.html · 06-withdrawal.html — 게이트가 맞물리는 입출금 파이프라인
- [[open-questions/compliance]] — Q-CMP-09 (2026 개정 원문)·Q-CMP-10 (두나무 판결 원문)·Q-CMP-11 (VV-CODE 통합 1차 출처)
- docs/architecture/krw-stablecoin-architecture-reference.md — 같은 KR 규제 평면의 인접 reference (스테이블코인 EDD 접점)

## 10. Sources

- `sources/travel-rule/pdf/가상자산_트래블룰_분석.pdf` (11p, 2차 합성 리서치 — 각주 39건) → 추출본 `sources/travel-rule/markdown/2026-07-08__pdf__travel-rule-analysis-extracted.md`
- `sources/travel-rule/markdown/2026-07-08__support-upbit-com__travel-rule-guide.md` (1차 — 업비트 공식, 2026-07-01 갱신본)
- `sources/travel-rule/markdown/2026-07-08__chainalysis-com__travel-rule-glossary.md` (벤더 공식 glossary)
- `sources/travel-rule/webpages/*.meta.yml` (Stage 146 Mode B 5건 — VerifyVASP docs llms-index 등)

## 11. Open Questions

- Q-CMP-09 — 2026 특금법 시행령 개정안 원문·시행일 (★ Stage 149 partial — 방향 3건 FSC 보도자료 원문 확정·1,000만원 완화 언론 교차·시행일 2026-08-20 언론 기준. 잔여: 입법예고문·개정령 원문)
- Q-CMP-10 — 두나무 트래블룰 행정소송 1심 판결문 원문 (★ Stage 149 partial — 서울행정법원 행정5부 2026-04-09 원고 승소·ratio 확인. 잔여: 사건번호·판결문 원문)
- Q-CMP-11 — VerifyVASP-CODE 상호 통합의 1차 출처 (★ Stage 149 partial — 연동 완료 2022-04-25 확정, "금융당국 권고" 서술은 미확인으로 정정. 잔여: 당국 개입 실재·전 회원 도달 범위) (2022 금융당국 권고 포함)
