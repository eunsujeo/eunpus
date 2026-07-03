# Fireblocks Gasless Service — Mode C 추출 (2026-07-03)

> 출처: Source Lake 의 헬프센터 PDF 14건 중 6건을 pdftotext 로 chunked 추출 (PDF 스냅샷 2026-05-18 저장분). Q-2026-07-03-G01 ANSWERED 근거. 인덱스: [[2026-07-03__support-fireblocks-io__gasless-service-index]].

## About the Fireblocks Gasless Service (p.1-4)

- **정의**: 지원 ERC-20 토큰의 **fee 지불을 전용 vault account 또는 제3자에게 위임** — 종속 vault 들이 base asset(ETH) 없이 토큰 전송 가능.
- **"Gasless Service is separate from the Fireblocks Gas Station and supports different protocols."** — Gas Station(자기 vault ETH 자동 충전)과 별개 제품.
- 용어: **Local gasless relay**(같은 워크스페이스의 전용 vault) / **External workspace gasless relay** / **Fireblocks workspace as a relay**(relay 제공자 측).
- **Relay mechanism = ERC-3009, ERC-2771, EIP-7702**.
- Applicable assets(구 Limited 기준): **Ethereum 의 USDC·DAI** + ERC-3009/2771/7702 를 쓰는 컨트랙트.
- 관련: Tron gasless via **GasFree** (2025.3) — Tron 은 별도 메커니즘.

## Universal Gasless (p.1-2)

- 기반 = **EIP-7702** (Pectra 업그레이드): EOA 를 smart contract 로 승격 — account abstraction·tx sponsorship·modular logic 을 EOA 구조 유지한 채 제공.
- 전작 **Limited Gasless**(USDC 등 특정 토큰 EIP-3009 + tokenization mint/burn EIP-2771)의 한계 해소 → **모든 이더리움 자산(ERC-20/721/1155)** 지원.
- 동작: **첫 gasless tx 때 vault account 가 EIP-7702 로 smart contract wallet 로 자동 승격** → 이후 지정 relay(local vault / external workspace / **Fireblocks relay — ETH 전혀 없어도 Fireblocks 가 gas 지불**)가 gas 부담.
- 다른 EVM 체인이 EIP-7702 를 통합하면 확장. "available in compatible EVM chains."

## Universal Gasless integrated chains (p.1-2)

- **Mainnet**: Ethereum(1) · Optimism(10) · **Base(8453)** · Arbitrum(42161) · Polygon PoS(137) · BSC(56)
- **Testnet**: Holesky·Hoodi·Sepolia · Optimism Sepolia · **Base Sepolia(84532)** · Arbitrum Sepolia · Polygon Amoy · BSC Testnet

## Configuring Universal Gasless transactions (p.1-2)

- Ethereum 기반 전 토큰 · 액션 = **Transfer, Contract Call, Mint, Burn**.
- Console: Settings > General > **Gasless transactions** → EVM 토글 → Universal gasless 선택 → relay 3택(This workspace / External workspace / Fireblocks) → 기본값 3모드(**On by default / Off by default / Off** — per-transaction 재정의 가능) → Policies 연동.

## Using the Fireblocks Gasless Relay (p.1-2)

- **프리미엄 기능** — 추가 구매 + Fireblocks Support 활성화(CSM 경유). testnet 30일 체험 가능.
- 정체: gas 지갑 관리·잔고 모니터링·충전 운영을 없애는 managed relay — **Fireblocks 가 gas 를 선지불하고 월말 통합 인보이스**(실비 + 구독료).
- ★ **"Gasless Relay does not support auto-boosting for stuck transactions"** — 막힌 tx 는 **수동 RBF boost** 필요.

## Gasless fee contingencies (p.1-2)

- Console 표시 케이스 열거: DEFAULT ON + REMOTE relay / DEFAULT ON + LOCAL relay / DEFAULT OFF / NOT ACTIVE(+설정 CTA tooltip) — 자산의 Gasless-fee 지원 여부 × relay 상태 조합.

## API 표면 교차 (developers 문서)

- `reference-api-error-codes.md`: **error 1455 (400, "Transaction, Gasless (meta-tx)") — "Missing Gasless configuration. Gasless transactions aren't set up for this workspace/asset. Configure Gasless (relayer/fee payer) or send a standard transaction."** → 트랜잭션 API 표면에 Gasless 경로 존재.

## 설계 함의 (docs-site)

- 이더리움·Base 스택에서 **sweep/전송 gas 를 relay 로 대납 가능** — Gas Station(충전)과 Gasless(대납)가 병존하는 선택지.
- Fireblocks relay 채택 시 gas 운영이 "vault ETH 관리" → "월말 인보이스 정산"으로 바뀜(회계 층 영향).
- stuck auto-boost 미지원 → 우리 막힘 점검(4장) + Admin boost(7장) 설계가 Gasless 에서도 그대로 필요.
- ERC-4337 paymaster 가 아니라 **EIP-7702 + relay** 아키텍처.
