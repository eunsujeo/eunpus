# coinbase/x402 — A payments protocol for the internet. Built on HTTP. (공식 저장소 README)

> source: https://github.com/coinbase/x402
> fetched: 2026-08-20 (WebFetch 추출 — ★ verbatim 아님, 구조화 요약. 스펙 본문은 저장소 내 별도 문서)

## 프로토콜 정의

- HTTP 기반 인터넷 결제 표준 — "402 Payment Required" 상태 코드 활용
- 암호화폐·법정화폐 네트워크 모두 지원

## 결제 흐름

1. 클라이언트 요청 → 서버가 `402 Payment Required` + PAYMENT-REQUIRED 헤더 (PaymentRequirements 객체) 응답
2. 클라이언트가 PaymentRequirements 중 하나를 골라 scheme·network 에 맞는 PaymentPayload 를 생성·서명
3. PAYMENT-SIGNATURE 헤더에 실어 재요청
4. 서버/facilitator 가 검증 → 정산 → 리소스 전달 (PAYMENT-RESPONSE 헤더)

## Scheme

- 자금 이동의 논리적 방식. 첫 공식 scheme 은 **exact** (정확한 금액 이체)
- 네트워크별로 다른 구현

## Facilitator

- 여러 네트워크의 결제 검증·정산을 대행
- `/verify` — PaymentPayload 검증 · `/settle` — 블록체인 제출·확인

## 지원 범위

- EVM · SVM (Solana) · Stellar 등 다중 체인. 스테이블코인·토큰·법정화폐

## 신뢰 모델

- Trust minimizing — facilitator 와 서버는 클라이언트가 서명한 의도 범위 내에서만 자금을 움직일 수 있다
- 권한 통제의 축은 클라이언트 서명

## 거버넌스

- Coinbase 개발 → x402 Foundation 으로 이전. 오픈 스탠다드
