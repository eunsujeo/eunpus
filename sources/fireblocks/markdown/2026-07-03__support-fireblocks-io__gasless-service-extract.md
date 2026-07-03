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

---

## 2차 추출 (Stage 136) — 나머지 5건 + 잘렸던 뒷부분. Gasless Service 섹션 11/11 완료

### Using the Fireblocks Gasless Relay (뒷부분 보강)

- 지원: **"All EVM-compatible blockchains"** (Ethereum·Polygon·Arbitrum·Optimism 등) + **그 위의 모든 토큰**. 일부 non-EVM(특정 USDC 오퍼레이션 포함)은 CSM 문의.
- 연결 절차: Console 설정(Fireblocks relay 선택) → Support 요청 → CSM 이 대상 체인·월 거래량·유스케이스 확인 → **서비스 계약 서명** → Support 가 활성화.

### Using a local gasless relay (p.1-2)

- 사용 조건: base asset 보유에 제약이 없고, **vault 하나로 워크스페이스 전체의 fee 를 관리**하고 싶을 때.
- relay vault 의 잔고 관리는 **고객 책임**.

### Using an external workspace as a gasless relay (p.1-2)

- 목적: 멀티 워크스페이스 조직의 gas 일원화 + **규제 유연성** — 원문 사례: *"US 워크스페이스는 스테이블코인만 보유, EU 워크스페이스가 ETH 를 보유하고 gas 를 지불 → US 워크스페이스는 컴플라이언스 유지"*. (★ "운영용 가상자산 미보유" 규제 대응 패턴을 벤더가 직접 명시)
- **추가 비용 없음** — 자기 소유 워크스페이스 간이면 제3자 서비스 아님. 리포팅 분리 이점.
- 설정 시 feature enablement request 필요.

### Using a workspace as a gasless relay provider (p.1-2)

- 아무 워크스페이스나 relay 제공자 가능 — 자기 소유 또는 **다른 Fireblocks 고객에게 relay 서비스 제공** 가능(합의 후 Support 가 연결).
- ★ relay 워크스페이스는 **API Co-Signer 필수**.
- **Gasless Orchestrator** 가 gasless 거래를 initiate — relay 측 Policy 에 ① Gasless Orchestrator 발신 허용 ② API Co-Signer 를 signer 로 지정하는 rule 필요.
- dependent 워크스페이스별 vault 배정 — 하나로 전부 서비스 or 각각 분리.

### Gasless settings for individual transfers (p.1-2)

- Transfer 다이얼로그에 gasless fee 설정 표시. relay 미설정이면 소스 vault 에서 fee 차감. **건별로 direct fee 로 전환(=gasless 끄기)** 가능.
- 상태 추적은 일반 거래와 동일. **relay 상호작용은 서명 단계·거래 생성 시점**(체인 전송 전)에 발생.
- ★ 실패 모드: **"relay 가 요청을 거절하거나 fuel 하지 못하면 gasless 거래는 실패할 수 있다"** — relay 잔고·정책이 새로운 실패 지점.

### Configuring Universal Gasless (뒷부분 보강 — Policy 요건)

- **Vault account upgrade policy** 타입 신설 — 승격된 vault 의 Universal Gasless 발신을 Allow 하는 rule 필요.
- **Gasless-Orchestrator 컨트랙트가 자동 추가** — relay 워크스페이스의 Contract call policy 에 **Gasless-Orchestrator 를 initiator 로 명시하는 rule 필수** (anyone initiator rule 이 있어도 별도 필요). initiator ≠ signer.
- vault 의 자산 승격은 **첫 거래 완료 후** 적용.

### Configuring Solana Gasless (p.1-2)

- SPL 토큰 전송의 fee(SOL)를 **다른 vault(local relay)가 지불** — **Solana Fee Payer** 기능 활용. SOL base token 자체는 제외.
- ★ **두 vault 공동 서명**(local relay + token owner) + **local relay 와 key set 을 공유하는 vault 에서만** 전송 가능.
- Embedded Wallets 미통합 (통합 시 공지 예정).

### 커버리지

- Gasless Service 섹션 11건: **11/11 추출 완료**. 인접 gasless tokenization 4건(PDF 보유)은 tokenization 주제라 미추출 — 필요 시 별도.
