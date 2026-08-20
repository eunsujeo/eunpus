# What Google's New Quantum Research Means for Institutional Crypto Security (Fireblocks 공식 블로그)

> source: https://www.fireblocks.com/blog/google-quantum-research-institutional-crypto-security
> fetched: 2026-08-20 (WebFetch 추출 — ★ 원문 verbatim 아님, 구조화 요약. 세부 인용 시 원문 재확인)
> 발행: 2026-04-01, Michael Gutkin (VP Research, Fireblocks)

## 양자 위협 평가

- secp256k1 (타원곡선) 파괴에 필요한 양자 자원: ≤1,200 논리 큐빗, ≤90만 Toffoli 게이트 (Google 연구 인용)
- 논리 큐빗 ≠ 물리 큐빗 — 1,200 논리 큐빗 ≈ 물리 큐빗 약 50만 개 필요. 현존 CRQC 는 이 규모에 없음
- 즉각적 위험 없음 — 수년 단위 엔지니어링 돌파 필요
- 공격 시나리오 2분: **at-rest** (노출된 공개키 대상 — 더 가까운 시간대) vs **on-spend** (트랜잭션 검증 전 조작 — 더 먼 시간대)
- "harvest now, decrypt later" 위험 명시 — 주소 위생으로 노출을 줄이고, PQ 마이그레이션으로 완전 제거

## MPC 와 PQC

- "코드 기반 및 다변수 구성이 다중 당사자 계산(MPC)에 더 자연스럽게 적합할 수 있다" — Fireblocks 연구팀 평가
- 검토 대상: NIST ML-DSA·SLH-DSA (최종 표준, FIPS 204·205) · FN-DSA (FIPS 206 개발 중) + NIST Round 2 추가 후보 — [정정 2026-08-20] 최초 요약이 셋을 모두 "최종 표준"으로 묶었으나 FN-DSA 는 아직 표준화 진행 중

## Fireblocks 준비 항목 (4축)

1. **블록체인 계층 추적** — Bitcoin (BIP 360 / P2MR), Ethereum, Solana 등 주요 네트워크의 PQ 전환 논의를 재단과 직접 협의하며 추적
2. **MPC 프로토콜 연구** — PQC 서명 스킴을 co-signer 모델에 통합하는 매핑. "블록체인이 특정 스킴으로 수렴할 때 MPC 구성이 준비돼 있어야 하고, 그 순간부터 시작하면 안 된다"
3. **내부 암호화 스택 감사** — 인증서 · 저장 데이터 암호화(at-rest) · 인증 메커니즘 · TLS · 제3자 통합
4. **표준 기구 참여** — 대규모 키 관리 운영 경험 기반

## 현재 보안 조치 — 주소 위생

- P2WPKH 기본값 (지출 시점까지 공개키 은닉)
- 주소 재사용 금지 원칙 — 사용 후 공개키가 노출되므로
- Fireblocks Network 의 자동 주소 로테이션

## 체인 쪽 전환 (ECDSA 대체) 에 대한 입장

- 가장 근본적인 의존성은 블록체인 자체의 채택 결정 — 온체인 서명 검증은 프로토콜 수준 결정
- co-signer 통합은 기반 네트워크가 수용할 때만 의미가 있다

## 로드맵

- **전체 PQC 전략 문서를 2026 하반기 공개 예정**
- 관련 이전 블로그: Part 1 (양자 위험 교육) · Part 2 (양자 시대 블록체인 진화)
