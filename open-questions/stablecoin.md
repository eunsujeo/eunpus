# Open Questions — Stablecoin (원화 스테이블코인)

> Stage 45 (2026-06-04) 도입. `sources/stablecoin/pdf/krw-stablecoin-architecture-proposal.pdf` (K-STAR 컨소시엄 「원화 스테이블코인 아키텍처 제안서」, 165p, Final) Mode C ingest 의 부산물.
> 본 제안서는 **권고 아키텍처** 이므로, hypothesis 영역은 (a) 제안서 본문 미명시, (b) Fireblocks 와의 개념 매핑이 등가인지 미검증, (c) 한국 제도 미확정에 따른 변수 — 3 유형으로 분류.
> Canonical reference: [[docs/architecture/krw-stablecoin-architecture-reference]]

## Q-2026-06-04-STBL01 — MPC-TSS 3주체 분산 vs Fireblocks 3-cloud 등가성

**Status**: open
**Stage**: 45
**Question**: 본 제안서는 키 조각(Secret Shares)을 발행사·수탁은행·제3 감사기관 등 **독립 기관**에 분산 저장하고 임계값 T-of-N 서명을 강제한다 (§3.6.2). Fireblocks 의 MPC-CMP 는 key share 를 **3-cloud(인프라)** 에 분할한다. 두 모델이 보안상 등가인가, 아니면 "기관 간 분산" 이 "인프라 간 분산" 과 다른 신뢰가정/공모 리스크 모델을 갖는가. 임계값 T 와 N 의 권장값도 제안서 미명시.
**Source**: krw-stablecoin-architecture-proposal §3.6.2 (p.68-70) ↔ [[vendors/fireblocks/mpc]]

## Q-2026-06-04-STBL02 — "서명 이전 정책 사전검증" 의 정책 표현식·충돌해소

**Status**: open
**Stage**: 45
**Question**: 제안서는 "모든 트랜잭션이 서명 이전 단계에서 AML·제재·이상거래·한도·운영모드 기준으로 사전 검증되고, 위반 거래는 기술적으로 생성·서명되지 않는다"(Pre-emptive Control, §3.6.2)고 하나, 정책 규칙의 표현식·우선순위·충돌해소 규칙은 미명시. Fireblocks Policy Engine 의 First-Match ordering 과 대비해 어떤 모델인지.
**Source**: krw-stablecoin-architecture-proposal §3.6.2 (p.69) ↔ [[vendors/fireblocks/policy-engine]]

## Q-2026-06-04-STBL03 — 한국 2단계 입법 확정이 참여자 구조에 미치는 변경

**Status**: open
**Stage**: 45
**Question**: 제안서 §4.2 의 8 참여자 구조(발행전담법인 등)는 한국 스테이블코인 2단계 입법 미확정 전제. 은행 51%+ 컨소시엄 발행 방안(§2.1.6) 등 발행주체·감독 프레임이 확정되면 참여자 정의·RACI(§4.3.1)·준비자산 분리 형태가 어떻게 바뀌는가. 1차 출처: 금융위 TF·국회 의원안.
**Source**: krw-stablecoin-architecture-proposal §2.1.6 (p.19), §4.2 (p.87-90)

## Q-2026-06-04-STBL04 — 운영 모드 4단계 전환 트리거 정량 임계치

**Status**: open
**Stage**: 45
**Question**: Normal/Restricted/Emergency/Halt 4 운영 모드(§4.2.2, 표 4.4)와 KRI 트리거 T1/T2(§4.4.2, 표 4.6)는 구조만 정의하고 정량 임계치(순상환율 %, 디페깅 bp, 가용성 SLA 등)는 "제도·리스크 모델에 따라 결정" 으로 보류. 실제 운영 임계치 설계 근거 필요.
**Source**: krw-stablecoin-architecture-proposal §4.2.2 (p.91-92), §4.4.2 (p.100)

## Q-2026-06-04-STBL05 — 직접구축 vs Fireblocks SaaS 의 발행관리/거버넌스 gap 정량화

**Status**: open
**Stage**: 45
**Question**: §6(3-way 비교)에서 Fireblocks SaaS 가 토큰통제·MPC·정책은 흡수하나 발행관리시스템(§3.3)·컴플라이언스(§3.7)·거버넌스(§4)는 별도 구축 필요로 정리. 실제 발행사가 SaaS 채택 시 자체 구축해야 하는 범위와 비용/기간을 정량 비교할 1차 근거(Fireblocks 측 stablecoin 발행 지원 범위 문서) 필요.
**Source**: krw-stablecoin-architecture-proposal §3.3, §3.7, §4 (종합) ↔ [[docs/architecture/three-way-custody-decision-framework]]

## Q-2026-06-04-STBL06 — KRW1 컴플라이언스 브리지 vs LayerZero OFT 의 체인 간 KYC 상태 유지

**Status**: open
**Stage**: 45
**Question**: KRW1 은 "네트워크 간 지갑 단위 KYC 상태를 유지하는 컴플라이언스 브리지" 를 독자 기능으로 제시(§7.1.2, 표 7.2)하나 구체 메커니즘 미공개. KRWQ 의 LayerZero OFT 표준 채택과 비교해 체인 간 준법 상태 전파 방식의 기술적 차이.
**Source**: krw-stablecoin-architecture-proposal §7.1.2 (p.136-137)

## Q-2026-08-20-STBL07 — 람다256 카드업권 PoC 의 월렛·키 관리 구조

**Status**: open
**Stage**: 165
**Question**: PoC 는 거래 생성·전송, 가스비 처리, 상태 추적, 취소·환불·정산 트랜잭션, 장애 대응까지 구현했다고 하나 (source: 2026-08-20__startupn-kr__lambda256-stablecoin-card-poc.md), 월렛 커스터디 모델 (MPC 여부·수탁 구조) 과 취소·환불의 온체인 표현 방식 (역방향 전송인가, 소각·재발행인가) 은 미공개. K-STAR 제안서 (람다256 공동 작성) §3.6.2 의 MPC-TSS 3주체 분산이 SCOPE 에 실제 구현돼 있는지도 미확인.
**Source**: 2026-08-20__startupn-kr__lambda256-stablecoin-card-poc.md ↔ [[docs/architecture/krw-stablecoin-architecture-reference]] · Q-2026-06-04-STBL01

## Q-2026-08-20-STBL08 — 에이전트 지갑 지출 통제 (x402/AgentCore) vs 커스터디 정책 엔진

**Status**: open
**Stage**: 165
**Question**: AWS AgentCore payments 는 세션별 지출 한도 + 명시적 사용자 승인 + 결제 credential 의 인프라 레이어 격리 (에이전트 코드의 credential 직접 접근 차단 — 발표 요약은 "우회 불가"로 표현) 로 통제한다 (source: 2026-08-20__aws-amazon-com__agentcore-payments-announcement.md, verbatim 아님 주의). Fireblocks Policy Engine (First-Match·TAP quorum) 과 비교해 정책 표현력·승인 모델이 어떻게 다른가.
**Update (2026-08-20)**: x402 스펙 1차 자료 수집 완료 (source: 2026-08-20__github-com__coinbase-x402.md) — 통제 축은 "클라이언트 서명 의도 범위" (facilitator·서버는 그 밖으로 자금 이동 불가, scheme=exact·/verify·/settle). Policy Engine 과의 구조 비교는 잔여.
**세미나 확인 후보 (2026-08-20)**: ① facilitator/sponsor 의 수수료·정산 모델 — 대납 가스·대행 수수료의 청구 구조를 이번 수집 공개 문서에서 확인하지 못함 (총비용을 가르는 항목). ② 고액 커머스 확장 시 결제 정책 표현력 보강 계획 (Payments 세션 기본 통제 = 금액·통화·만료 + 사용자 권한 부여·회수 중심).
**Update 2 (2026-08-20)**: AWS 개발자 문서 수집 (source: 2026-08-20__docs-aws-amazon-com__agentcore-payments-devguide.md) — 한도 모델 확인: 이번에 수집한 Payments 공개 문서 기준으로 세션당 금액(maxSpendAmount)·통화·만료와 사용자 권한 부여·회수를 확인했으며, merchant·asset 별 결제 정책식은 확인하지 못함. credential 은 Secrets Manager 격리 (에이전트 코드에 키 없음). 노출 상한 = 지갑 충전액. Fireblocks Policy Engine (First-Match rule·TAP quorum) 대비 "표현력은 얇고 노출 자체를 줄이는" 모델. x402 v2 exact **EVM** 의 통제 원자 = EIP-3009 authorization (value 정확 일치·시간 창·nonce — SVM 은 SPL TransferChecked 별도, source: 2026-08-20__github-com__x402-specification-v2.md). MPP (제2 프로토콜) 존재 확인.
**Source**: 2026-08-20__aws-amazon-com__agentcore-payments-announcement.md · 2026-08-20__github-com__coinbase-x402.md ↔ [[vendors/fireblocks/policy-engine]]
