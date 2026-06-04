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
