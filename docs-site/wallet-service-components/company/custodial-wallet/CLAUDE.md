# custodial-wallet — LLM Operating Entry Point

> 은행 수탁(custodial) 지갑 서비스의 **블록체인 매니저 + 지갑 서비스 백엔드** 모노레포 스켈레톤.
> 설계 원본: `docs-site/wallet-service-components/` 가이드 (0~17장). 이 저장소는 그 설계를
> **모듈 경계 = 설계 경계** 로 옮긴 것이다 (가이드 17장).

## 1. 정체성 (10초 이해)

- **무엇**: Kotlin + Spring Boot, Gradle 멀티모듈. 2층(지갑 서비스 백엔드 / 블록체인 매니저) ·
  3포트(Account / Transaction / ChainQuery) · custody 어댑터 교체(Fireblocks ↔ 자체 구축 ↔ NodeWallet).
- **상태**: **스켈레톤** — 구조·인터페이스·핵심 오케스트레이션 로직은 완성, 외부 I/O(벤더 SDK·노드 RPC·DB)는
  `TODO("...")` 스텁. 실제 SDK 의존성은 의도적으로 비워 두었다 (빌드가 가볍고, 어떤 벤더 계약도 강제하지 않음).
- **전제**: 출금 승인·온/오프램프·회계 원장은 **범위 밖** — 비즈니스 레이어가 결정하고, 여기는 승인된 지시를
  받아 집행만 한다 (가이드 0.3 · 11).

## 2. 빌드 · 테스트 · lint

```bash
./gradlew build              # 전체 빌드 + 테스트 (wrapper 미생성 시: gradle wrapper 먼저)
./gradlew ktlintCheck        # lint — .editorconfig 의 ktlint_official 스타일
./gradlew ktlintFormat       # format 자동 적용
./gradlew :apps:api:test     # ArchUnit 의존 방향 테스트 포함
./gradlew :apps:api:bootRun  # API 실행 (custody 어댑터는 application.yml 의 custody.provider 로 선택)
```

- JDK 21 (toolchain 고정). Spring Boot 3.4 / Kotlin 2.0 / coroutines (모든 포트는 `suspend`).
- **커밋 전 `ktlintFormat` 필수.** CI 게이트는 `build` + `ktlintCheck`.

## 3. 모듈 지도 — 어디에 무엇이 있나

| 모듈 | 가이드 | 핵심 타입 |
|---|---|---|
| `domain` | 13 | `AccountPort` · `TransactionPort` · `FeeBoostCapability` · `CancelCapability` · `DepositAddressIssuanceCapability` · `ChainQueryPort`(`transfersOf`/`balanceAt`/`query`) / `TransactionRequest` · `TxRef` · `TxStatus`(sealed) · `ChainSpecific`(sealed) · `ChainEvent`(sealed) · `Amount` · `Balance`(available/pending/locked) · `Transfer` · `ChainId`(value class) |
| `shared` | — | `IdempotencyStore`(인터페이스) · `InMemoryIdempotencyStore` / `address/AddressRules`(로컬 주소 검증) |
| `backend` | 6·7·8·9 | `gateway/WalletGatewayService` · `gateway/AccountController` · `gateway/TransactionController` / `directory/AccountDirectory`(계정·주소 발급 결과 저장·소유) / `reconciliation/ReconciliationService` / `alerts/NotificationFanout` · `alerts/Subscriber` · `alerts/DeliveryStore` / `orchestration/WithdrawalOrchestrator` |
| `engine/multichain` | 2 | **체인 SPI**: `ChainAdapter` · `ChainSource` · `SourceEvent` · `UnsignedTx` · `SignedTx` · `Confirmation` + `ChainAdapterRegistry`(`pickAdapter`) |
| `engine/indexer` | 3 | `SelfIndexer` · `ProjectionStore` · `RawEventStore`(append-only) · `ConfirmationPolicy` |
| `engine/tx-pipeline` | 4 | `TxPipeline`(`submit`/`resend`) · `StuckWatcher` · `SubmissionStore` (nonce 는 가이드 4.3 대로 chains/evm 의 `LocalNonceManager` 소관) |
| `engine/signing` | 5 | `SigningOrchestrator`(멱등 가드) · `Signer`(외부 MPC/HSM 경계) · `SignatureStore` |
| `chains/evm` | 2.4 | `EvmChainAdapter` · `EvmChainSource` · `LocalNonceManager`(드리프트 재동기화) |
| `chains/utxo` | 2.4 | `UtxoChainAdapter`(coin 선택 · RBF/CPFP) · `UtxoChainSource` |
| `chains/solana` | 2.4 | `SolanaChainAdapter`(blockhash · commitment · auto-retry, boost 없음) |
| `chains/canton` | 2.4 | `CantonChainAdapter`(broadcast=OFFER 제출 · 2-step 상태 · withdrawAndReoffer) |
| `adapters/fireblocks` | 14 | `FireblocksAdapter`(AccountPort+TransactionPort + FeeBoost/Cancel/DepositAddressIssuance capability) · `FireblocksClient`(SDK 경계 스텁) · `FireblocksWebhookMapper` |
| `adapters/self-build` | 15 | `SelfBuildAdapter`(세 포트 전부 + 세 capability — engine+chains 조립) · `HdWallet` |
| `adapters/nodewallet` | 16 | `NodeWalletAdapter`(Solana 전용 · FeeBoost/DepositAddressIssuance 미구현, Cancel 은 제품 위임) · `NodeWalletClient` |
| `adapters/chainquery-alchemy` | 13.4 | `AlchemyChainQueryAdapter`(ChainQueryPort 만) |
| `apps/api` | 17 | `ApiApplication` · `CustodyAdapterConfig`(@ConditionalOnProperty `custody.provider`) · **ArchUnit 테스트** |
| `apps/indexer-worker` | 3·7 | `IndexerWorkerApplication`(상시 수집 + 정합성 sweep) |
| `apps/webhook-receiver` | 14.4 | `WebhookReceiverApplication` · `FireblocksWebhookController` |

## 4. 어겨선 안 되는 구조 규칙

1. **의존성은 안쪽으로만** (가이드 17.3) — `domain` 은 어떤 모듈도 의존하지 않는다.
   `backend → domain` 만. `chains/* → engine/multichain → domain`. `adapters/* → engine/* + chains/* + domain`.
   `apps/* → adapters/* + backend`. **`apps/api` 의 ArchUnit 테스트가 이 규칙을 검사한다 — 깨면 빌드 실패.**
2. **domain 은 순수 Kotlin** — Spring·벤더 SDK import 금지 (`build.gradle.kts` 에 coroutines 외 의존 없음).
3. **포트 시그니처 변경은 설계 변경** — 가이드 13.3 과 동기화해서만 수정. 함수명은 가이드와 1:1
   (`createAccount`/`addressOf`(조회)/`issueDepositAddress`(발급 capability)/`getBalance`→`Balance`/`validateAddress`/`estimateFee`/`submitTransaction`/`getStatus`/`onChainEvent`/`boost`/`cancel`/`transfersOf`/`balanceAt`/`query`).
4. **capability 는 타입으로** — fee boost 는 `FeeBoostCapability`, cancel 은 `CancelCapability` 별도
   인터페이스 (Solana 처럼 보장 못 하는 어댑터는 미구현 허용 — 호출 측은 `is` 분기). `TxStatus`·`ChainSpecific` 은
   sealed — 새 상태/체인 특화는 추가만 하고 의미 변경 금지. 잔액 사용 가능 판정은 `Balance.available` 만.
5. **쓰기 파이프라인 순서 불변** (가이드 4 · 11): 멱등 확인 → 조립(순번 점유) → 서명 → 전파 → 기록.
   수수료를 바꾸면 **재서명 필수**. 재전송 자동화는 **fee-boostable 체인에만** (Canton OFFER 자동 재제출 금지).
6. **인덱서**: 모든 수신 이벤트는 가공 전에 `RawEventStore.append`(append-only) 먼저 (가이드 3.2).
7. **알림**: 전달 기록은 **구독자별** + 구독자별 실패 격리 (가이드 8.3).
8. **돈은 `Amount`(BigInteger 최소 단위)** — Double/Float 금지.
9. **주소 검증(validateAddress)은 로컬 체인 규칙(shared/AddressRules)** — 벤더 API 의존 금지 (가이드 13.3).
10. **전파 전 intent 기록** (가이드 4.3) — submit 경로는 BUILT → SIGNED → BROADCAST 상태머신.
    저장소 기록 없이 broadcast 금지. 복구는 기록된 단계에서 **같은 서명본 재전파**만 — SIGNED 는
    "이미 전파됐을 수 있음" 으로 취급하고, 새 조립·재서명으로 복구하면 새 nonce 이중 출금이 된다.
11. **서명 가드 키는 payload(sighash) 파생** (가이드 5.4) — 출금 논리 ID 를 쓰면 fee bump 재서명이
    가드에 걸려 옛(낮은 fee) 서명을 재사용한다. payload 가 바뀌면 자연히 새 키.
12. **서명자 측 인가 게이트 우회 금지** (가이드 5.5) — `Signer` 구현(self-build)은 sighash 만 받아
    바로 서명하면 안 된다. 원문 재검증(목적지 화이트리스트·한도)을 거치는 정책 게이트가 전제 —
    스텁을 채울 때 이 검증을 "단순화" 명목으로 빼지 말 것.
13. **멱등 start 는 원자적 조건부 insert + lease(TTL)** (가이드 6.3) — 인메모리 single-flight 는
    단일 인스턴스용. inflight 고착 방지를 위해 lease 만료 후 재실행을 허용하되, 재실행 전
    tx-pipeline 의 intent 기록을 먼저 확인한다.
14. **주소 발급 = watch-list 등록과 한 흐름** (가이드 9.4) — self-build/하이브리드에서
    `addressOf`/`issueDepositAddress` 로 주소가 확보되면 인덱서 감시 등록(등록 높이 기록)까지가 한 흐름이다. 등록 실패 = 발급 실패.
    등록 높이 이전 구간은 backfill 로 메운다.
15. **알림은 미검증 신호** (가이드 8.3) — CONFIRMED 알림은 인덱서 판정 기준. 정합성 MISMATCH·
    reorg 무효화의 **정정 이벤트 타입을 제거하지 말 것** — 비즈 레이어의 반영 철회(보상) 경로다.

## 4b. AI(LLM) 작업 가이드라인

- **보안 불변식은 단순화 대상이 아니다** — 스텁(`TODO`)을 채우거나 리팩터링할 때 위 10·11·12 의
  검증·기록 단계를 "테스트 편의" 나 "코드 간결성" 을 이유로 제거·우회하지 않는다. 그 단계들이 곧
  이 시스템의 존재 이유다.
- **포트 변경 = 가이드 동기화** — `domain` 포트 시그니처를 바꾸면 가이드 13.3 을, 가이드가 바뀌면
  포트를 같은 커밋·같은 작업에서 맞춘다. 한쪽만 바꾸고 끝내지 않는다.
- **벤더 사실 표기 규칙** — 벤더(Fireblocks·NodeWallet 등) 동작을 주석·문서에 적을 때, 공식 문서로
  확인 못 한 것은 "적용 전 확인" 을 명시한다. LLM 일반 지식으로 벤더 API 이름·동작을 단정하지 않는다.
- **의사코드 ↔ Kotlin 이름 1:1** — 가이드 의사코드의 메서드·클래스명과 이 저장소의 이름을 일치시켜
  "가이드 N장" 주석만으로 상호 추적이 되게 유지한다.

## 5. 설계 원본과 다른 결정 (의도적 — 바꾸지 말 것)

- **체인 SPI 위치**: `ChainAdapter` 인터페이스가 `engine/multichain` 에 있으므로 컴파일 의존은
  **`chains/* → engine/multichain`** 이다 (SPI 역전 — 구현이 인터페이스 쪽으로 의존. 가이드 Figure 17-1
  캡션에도 동일하게 명시됨). `engine/indexer·tx-pipeline·signing` 은 chains 를 모르고 SPI(레지스트리)만
  보며, engine 과 chains 를 함께 조립하는 것은 adapters/self-build 다.
- **ChainId 는 enum 이 아니라 value class** — "체인 추가가 domain 을 바꾸지 않는다"(17.3)를 지키기 위해.
- **SPI `ChainAdapter.addressOf(account)` 에는 asset 인자가 없다** (포트 `AccountPort.addressOf(account, asset)` 와 다름) —
  어댑터는 체인 고정이라 asset 의 일(체인 라우팅·xpub/coin type 선택)은 포트에서 끝나고, 한 체인 안에서
  주소는 계정만의 함수다 (ERC-20=ETH 주소·SPL=owner·Canton 무관). 반환 `Address` 의 asset 스탬프는
  포트 구현이 찍는다. 자산별 주소가 다른 체인이 실제로 오면 그때 인자를 되살린다 (가이드 2.4 · 9.2).

## 6. 흔한 작업 가이드

- **체인 추가**: `chains/<new>` 모듈 생성 → `ChainAdapter`(+필요시 `ChainSource`) 구현 →
  `apps/*` 의 레지스트리 wiring 한 줄. domain·backend·engine 은 건드리지 않는다.
- **custody 어댑터 교체**: `application.yml` 의 `custody.provider: fireblocks|selfbuild|nodewallet` 한 줄.
- **자체 구축 전환** (가이드 17.5): `engine/*`·`chains/evm` 의 TODO 를 채우고 `custody.provider: selfbuild`.
- **스텁 채우기**: `TODO("...")` 는 전부 외부 I/O 경계 — 벤더 SDK·노드 RPC·영속 저장소. 채울 때
  해당 인터페이스(예: `FireblocksClient`)만 구현하면 되고 오케스트레이션 로직은 손대지 않는다.

## 7. 설계 참조

구현 의도가 궁금하면 코드 주석의 "가이드 N장" 표기를 따라 `docs-site/wallet-service-components/` 의
해당 페이지를 본다. 핵심: 0(두 층) · 4(쓰기 순서) · 13(포트) · 17(이 구조).

## 8. 2026-06-11 동기화 — "주소 탄생" 모델 · ChainQuery 분리 · 유스케이스

가이드의 설계 진화(commit 896789c 까지)를 코드에 반영한 결정들:

- **addressOf 는 절대 새 주소를 만들지 않는다** (가이드 9.1 불변식) — `HdWallet.issuedAddressOf` 는 발급 장부 조회만. 재계산(bip32)은 검증·복구용. 첫 주소부터 `issueDepositAddress`(= `HdWallet.deriveNextAddress` + 디렉터리 + watch-list 등록).
- **custody 는 두 포트** — `SelfBuildAdapter` 에서 ChainQueryPort 분리 → `IndexerQueryAdapter` (custody 와 별개 슬롯, 하이브리드와 같은 클래스 한 벌. `chainquery.provider=indexer|alchemy`).
- **SPI 선택 capability 2종** (engine/multichain) — `DepositAddressDerivationCapability.deriveAddress(account, index)` (EVM·UTXO·Solana, 곡선별 계산만) / `OnLedgerAccountRegistrationCapability.registerAccount(account, pubkey)` (Canton: generate-topology→HSM 서명→allocate, 호출처는 포트 issueDepositAddress 첫 Canton 호출 — PartyId 선발급, createAccount 아님).
- **`TransactionPort.transactionsOf(account, range)`** — 내 거래 이력은 custody 가 준다(전 구현). 임의 "외부" 주소만 ChainQueryPort. 동사의 자리는 데이터의 주인이 정한다 (가이드 13.3).
- **`WalletGatewayService.openWallet`** — "지갑 개설" 한 요청 = createAccount → 첫 주소 확보, 멱등 키 하나 (가이드 9.1, `POST /accounts/open`). 클래스 kdoc 도 "게이트웨이(인증·멱등)+유스케이스" 로 정렬.
- ⚠ 본 동기화는 **컴파일 미검증** (환경에 gradle 없음) — 툴체인 확보 시 `./gradlew build` + `ktlintFormat` 필요.

## 9. 2026-06-15 동기화 — createAccount = 체인 무관 vault · Canton PartyId 선발급 이전

워크스루(`docs-site/wallet-design-walkthrough/`)의 설계 정정을 코드에 반영. 근거: `AccountPort.createAccount(ref)` 에 asset 인자가 없으므로 특정 체인의 일(Canton PartyId 온장 등록)을 할 수 없다 — 시그니처가 곧 증거.

- **PartyId 온장 등록을 createAccount → issueDepositAddress 첫 Canton 호출로 이전** (선발급). `OnLedgerAccountRegistrationCapability` 의 호출처가 바뀌었다 — `SelfBuildAdapter.createAccount` 는 순수 vault(`hd.allocateAccount`)만, 온장 등록 TODO 제거. `issueDepositAddress` 가 체인 분기: Canton 은 PartyId 없으면 선발급(재사용·선기록) + memo 채번, 그 외는 `hd.deriveNextAddress`.
- **선발급의 근거**: memo 는 PartyId 위에 붙는 라우팅 태그라 PartyId 가 먼저 존재해야 한다. ETH-only 계정엔 PartyId 를 만들지 않아(첫 Canton 발급 때만) 불필요한 유료 등록을 피한다.
- 영향 파일: `engine/multichain/ChainAdapter.kt`(SPI doc) · `chains/canton/CantonChainAdapter.kt`(addressOf·registerAccount doc) · `adapters/self-build/SelfBuildAdapter.kt`(createAccount·issueDepositAddress) · `domain/port/AccountPort.kt`(doc) · `backend/gateway/WalletGatewayService.kt`(stale "Canton 발급 미구현" 정정 — Canton 은 Stage 81 이후 발급 구현).
- ⚠ 컴파일 미검증 — 8절과 동일.
