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
| `domain` | 13 | `AccountPort` · `TransactionPort` · `FeeBoostCapability` · `ChainQueryPort` / `TransactionRequest` · `TxRef` · `TxStatus`(sealed) · `ChainSpecific`(sealed) · `ChainEvent`(sealed) · `Amount` · `ChainId`(value class) |
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
| `adapters/fireblocks` | 14 | `FireblocksAdapter`(AccountPort+TransactionPort+FeeBoostCapability) · `FireblocksClient`(SDK 경계 스텁) · `FireblocksWebhookMapper` |
| `adapters/self-build` | 15 | `SelfBuildAdapter`(세 포트 전부 — engine+chains 조립) · `HdWallet` |
| `adapters/nodewallet` | 16 | `NodeWalletAdapter`(Solana 전용 · FeeBoostCapability 미구현) · `NodeWalletClient` |
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
   (`createAccount`/`deriveAddress`/`getBalance`/`validateAddress`/`estimateFee`/`submitTransaction`/`getStatus`/`cancel`/`onChainEvent`/`boost`/`query`).
4. **capability 는 타입으로** — fee boost 는 `FeeBoostCapability` 별도 인터페이스. `TxStatus`·`ChainSpecific` 은
   sealed — 새 상태/체인 특화는 추가만 하고 의미 변경 금지.
5. **쓰기 파이프라인 순서 불변** (가이드 4 · 11): 멱등 확인 → 조립(순번 점유) → 서명 → 전파 → 기록.
   수수료를 바꾸면 **재서명 필수**. 재전송 자동화는 **fee-boostable 체인에만** (Canton OFFER 자동 재제출 금지).
6. **인덱서**: 모든 수신 이벤트는 가공 전에 `RawEventStore.append`(append-only) 먼저 (가이드 3.2).
7. **알림**: 전달 기록은 **구독자별** + 구독자별 실패 격리 (가이드 8.3).
8. **돈은 `Amount`(BigInteger 최소 단위)** — Double/Float 금지.
9. **주소 검증(validateAddress)은 로컬 체인 규칙(shared/AddressRules)** — 벤더 API 의존 금지 (가이드 13.3).

## 5. 설계 원본과 다른 결정 (의도적 — 바꾸지 말 것)

- **체인 SPI 위치**: `ChainAdapter` 인터페이스가 `engine/multichain` 에 있으므로 컴파일 의존은
  **`chains/* → engine/multichain`** 이다 (SPI 역전 — 구현이 인터페이스 쪽으로 의존. 가이드 Figure 17-1
  캡션에도 동일하게 명시됨). `engine/indexer·tx-pipeline·signing` 은 chains 를 모르고 SPI(레지스트리)만
  보며, engine 과 chains 를 함께 조립하는 것은 adapters/self-build 다.
- **ChainId 는 enum 이 아니라 value class** — "체인 추가가 domain 을 바꾸지 않는다"(17.3)를 지키기 위해.

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
