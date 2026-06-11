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
    `deriveAddress` 성공 시 인덱서 감시 등록(등록 높이 기록)까지가 발급이다. 등록 실패 = 발급 실패.
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
- **가이드 13.3 변경 동기화 대기 (다음 코드 세션)** — 가이드 쪽이 먼저 갱신된 항목:
  `getBalance` 반환을 `Balance`(available/pending/locked 구분)로, `cancel` 을 capability
  (별도 인터페이스, NodeWallet/Solana 부재 허용)로, `ChainQueryPort` 에 도메인 동사
  (`transfersOf`/`balanceAt`) 추가. domain 포트·어댑터·ArchUnit 까지 함께 반영할 것.

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
