# Work with Fireblocks Gas Station — 1차 추출 (2026-07-03 fetch)

> 출처: developers.fireblocks.com `docs/work-with-gas-station.md`. GSN/paymaster 리서치 중 Fireblocks 자체 기능 확인용.

## 핵심 (원문 요지)

- EVM 은 gas 를 base asset 으로 내며 **발신 계정에서 차감**된다.
- **Fireblocks Gas Station** = 활성화된 vault account 에 **base asset(가스비)을 자동 충전(auto-fuel)** — omnibus vault 구조 고객용.
- Fireblocks 내부 vault 간 이동도 온체인이라, **deposit account → omnibus 로 sweep 할 때 gas 가 필요** — Gas Station 이 그 잔고 감시·수동 충전을 없애 준다.
- 트리거: 해당 vault 에 입·출금이 감지될 때마다 잔액 확인 → Gas Station 파라미터(gasThreshold/gasCap/maxGasPrice)에 따라 충전.
- **지원 네트워크: Ethereum + 워크스페이스의 모든 EVM 계열.**
- 대표 유스케이스: retail omnibus — COMPLETED 감지 → end-client vault 에서 omnibus 로 sweep. 거래소·렌딩·네오뱅크·은행 언급.

## 경계 (이 리서치의 판정)

- Fireblocks "Gas Station" 은 **GSN(Gas Station Network)과 이름만 유사** — meta-transaction relay / gas 대납(sponsorship)이 아니라 **자기 vault 에 gas 를 미리 채워 주는 운영 자동화**.
- developers.fireblocks.com **llms.txt 전수(743행)에서 paymaster / ERC-4337 / account abstraction / bundler / UserOperation / gasless / GSN 0건** (2026-07-03) → 공식 개발자 문서 표면에 AA/gas 대납 지원 없음(부정 확인). Embedded Wallets(NCW) 문서군 56건의 본문 내 언급 여부는 미확인.

## ★ 정정 (Stage 130)

위 "경계"의 부정 확인은 **developers.fireblocks.com 인덱스에 한정** — support.fireblocks.io 헬프센터에 **Gasless Service 섹션 실재** 확인(2026-07-03, Q-2026-07-03-G01). "Fireblocks 는 gas 대납 미지원" 으로 읽지 말 것.
