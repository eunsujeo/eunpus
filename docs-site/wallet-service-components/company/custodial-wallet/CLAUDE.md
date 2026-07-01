# custodial-wallet — LLM Operating Entry Point

> 은행 수탁(custodial) 지갑 서비스의 **두 백엔드(Service·Admin) + Fireblocks 매니저** 모노레포 스켈레톤.
> 설계 원본: `docs-site/wallet-service-components/` 가이드 (0~17장). 이 저장소는 그 설계를
> **모듈 경계 = 설계 경계** 로 옮긴 것이다 (가이드 17장).

## 1. 정체성 (10초 이해)

- **무엇**: Kotlin + Spring Boot, Gradle 멀티모듈. **두 백엔드 물리 분리(Service / Admin)** ·
  3포트(Account / Transaction / ChainQuery). **매니저는 Fireblocks(유일한 라이브 어댑터)**, 태우는 체인은 **EVM(이더리움·Base)**.
- **상태**: **스켈레톤** — 구조·인터페이스·핵심 로직은 완성, 외부 I/O(Fireblocks SDK·DB)는
  `TODO("...")` 스텁. 실제 SDK 의존성은 의도적으로 비워 두었다 (빌드가 가볍고, 벤더 계약을 강제하지 않음).
- **자체 구축 엔진(engine/*)·체인 프로토콜 모듈(chains/*)은 없다** — Fireblocks 가 서명·nonce·전파·멀티체인 흡수를
  전부 벤더 안에서 끝내기 때문 (가이드 17.5). 벤더 없이 포트 계약을 검증하는 `adapters/fake` 만 그 자리에 둔다.
- **전제**: 출금 승인·온/오프램프·회계 원장은 **범위 밖** — 비즈니스 레이어가 결정하고, 여기는 승인된 지시를
  받아 집행만 한다 (가이드 0.3 · 11).

## 2. 빌드 · 테스트 · lint

```bash
./gradlew build              # 전체 빌드 + 테스트 (wrapper 미생성 시: gradle wrapper 먼저)
./gradlew ktlintCheck        # lint — .editorconfig 의 ktlint_official 스타일
./gradlew ktlintFormat       # format 자동 적용
./gradlew :apps:service-api:test     # ArchUnit 의존 방향 테스트 포함
./gradlew :apps:service-api:bootRun  # Service API 실행 (custody 어댑터는 application.yml 의 custody.provider 로 선택)
./gradlew :apps:admin-api:bootRun    # Admin API 실행 (정책·정합성·알림·sweep)
```

- JDK 21 (toolchain 고정). Spring Boot 3.4 / Kotlin 2.0 / coroutines (모든 포트는 `suspend`).
- **커밋 전 `ktlintFormat` 필수.** CI 게이트는 `build` + `ktlintCheck`.

## 3. 모듈 지도 — 어디에 무엇이 있나

| 모듈 | 가이드 | 핵심 타입 |
|---|---|---|
| `domain` | 13 | `AccountPort` · `TransactionPort` · `FeeBoostCapability` · `CancelCapability` · `DepositAddressIssuanceCapability` · `ChainQueryPort`(`transfersOf`/`balanceAt`/`query`) / `TransactionRequest` · `TxRef` · `TxStatus`(sealed) · `ChainSpecific`(sealed — `Evm` 만) · `ChainEvent`(sealed) · `Amount` · `Balance`(available/pending/locked) · `Transfer` · `ChainId`(value class — `ETHEREUM`·`BASE`) · `error/`(`UnsupportedCapabilityException`·`DuplicateRequestException`) |
| `shared` | — | `IdempotencyStore`(인터페이스) · `InMemoryIdempotencyStore` / `address/AddressRules`(로컬 EVM 주소 검증) |
| `backend/service` | 6·7·8·9 | Service 백엔드(고객 런타임) — `gateway/WalletGatewayService` · `gateway/AccountController` · `gateway/TransactionController` / `directory/AccountDirectory`(계정·주소 발급 결과 저장·소유) / `orchestration/WithdrawalOrchestrator` / `reconciliation/ReconciliationService`(정합성·@Scheduled sweep) / `alerts/NotificationFanout` · `alerts/Subscriber` · `alerts/DeliveryStore` |
| `backend/admin` | 17.2 | Admin 백엔드(운영·거버넌스 · 권한·감사 경계) — `policy/PolicyAdminService`(화이트리스트·한도·동결) / `sweep/SweepService`(sweep·rebalance). 스텁. 모듈 의존은 domain 만 |
| `adapters/fireblocks` | 14 | **유일한 라이브 어댑터**. `FireblocksAdapter`(AccountPort+TransactionPort + FeeBoost/Cancel/DepositAddressIssuance capability) · `FireblocksClient`(SDK 경계 스텁) · `FireblocksWebhookMapper` |
| `adapters/fake` | 17.2 | `FakeCustodyAdapter`(인메모리 — 벤더 없이 계약 테스트·백엔드 검증). 자체 구축 HD/인덱서/HSM 내부는 담지 않는다 |
| `adapters/chainquery-alchemy` | 13.4 | `AlchemyChainQueryAdapter`(선택 · ChainQueryPort 만) |
| `apps/service-api` | 17 | `ServiceApiApplication`(scans `backend.service`) · `CustodyAdapterConfig`(@ConditionalOnProperty `custody.provider`: fireblocks 기본 / fake 테스트) · **ArchUnit 테스트** |
| `apps/admin-api` | 17 | `AdminApiApplication`(scans `backend.admin` — 정책·sweep) |
| `apps/webhook-receiver` | 14.4 | `WebhookReceiverApplication` · `FireblocksWebhookController`(→ `backend.service.alerts`) |

## 4. 어겨선 안 되는 구조 규칙

1. **의존성은 안쪽으로만** (가이드 17.3) — `domain` 은 어떤 모듈도 의존하지 않는다.
   `backend/service → domain + shared`, `backend/admin → domain 만`. `adapters/* → domain (+shared)`.
   `apps/* → backend + adapters (DI wiring)`. Service·Admin 은 서로 의존하지 않는다(물리 분리, 양방향).
   Fireblocks SDK 타입은 `adapters/fireblocks` 밖으로 새면 안 된다. **`apps/service-api` 의 ArchUnit 테스트가 이 규칙들을 검사한다 — 깨면 빌드 실패.**
2. **domain 은 순수 Kotlin** — Spring·벤더 SDK import 금지 (`build.gradle.kts` 에 coroutines 외 의존 없음).
3. **포트 시그니처 변경은 설계 변경** — 가이드 13.3 과 동기화해서만 수정. 함수명은 가이드와 1:1
   (`createAccount`/`addressOf`(조회)/`issueDepositAddress`(발급 capability)/`getBalance`→`Balance`/`validateAddress`/`estimateFee`/`submitTransaction`/`getStatus`/`onChainEvent`/`boost`/`cancel`/`transfersOf`/`balanceAt`/`query`).
4. **capability 는 타입으로** — fee boost 는 `FeeBoostCapability`, cancel 은 `CancelCapability` 별도
   인터페이스 (보장 못 하는 어댑터는 미구현 허용 — 호출 측은 `is` 분기, 미구현 시 `UnsupportedCapabilityException`). `TxStatus`·`ChainSpecific` 은
   sealed — 새 상태/체인 특화는 추가만 하고 의미 변경 금지. 잔액 사용 가능 판정은 `Balance.available` 만.
5. **재서명 규칙** (가이드 4 · 11) — 수수료를 바꾸면 **재서명 필수**. EVM 재전송/boost 는 `FeeBoostCapability`
   경로로만. 지금은 조립·서명·전파·nonce 가 Fireblocks 안에서 끝나므로 그 순서 보증은 벤더 몫이다.
6. **서명 게이트는 우리 몫** (가이드 5) — Fireblocks 를 써도 **온프렘 API Co-signer(SGX/TEE) 의 Callback Handler**
   가 서명 직전 승인·거부를 건다. 이 게이트(목적지 화이트리스트·한도 재검증)를 "단순화" 명목으로 빼지 말 것.
7. **알림**: 전달 기록은 **구독자별** + 구독자별 실패 격리 (가이드 8.3).
8. **돈은 `Amount`(BigInteger 최소 단위)** — Double/Float 금지.
9. **주소 검증(validateAddress)은 로컬 체인 규칙(shared/AddressRules)** — 벤더 API 의존 금지 (가이드 13.3).
   지금은 EVM(이더리움·Base) 형식만 등록돼 있다.
10. **멱등 start 는 원자적 조건부 insert + lease(TTL)** (가이드 6.3) — 인메모리 single-flight 는
    단일 인스턴스용. 게이트웨이 멱등 키는 어댑터 dedup 키(Fireblocks `externalTxId`)까지 따라간다.
11. **주소 발급 = watch-list 등록과 한 흐름** (가이드 9.4) — `issueDepositAddress` 로 주소가 확보되면
    벤더 측 감시 등록까지가 한 흐름이다. 등록 실패 = 발급 실패. 발급 결과는 `directory` 가 저장·소유한다.
12. **알림은 미검증 신호** (가이드 8.3) — CONFIRMED 알림은 확정 판정 기준. reorg 무효화(`ChainEvent.Orphaned`)의
    **정정 이벤트 타입을 제거하지 말 것** — 비즈 레이어의 반영 철회(보상) 경로다.
13. **Service ↔ Admin 물리 분리** (가이드 17.2) — 고객 런타임(Service: gateway·directory·orchestration·
    reconciliation·alerts)과 운영·거버넌스(Admin: 정책·승인·동결·sweep)는 별도 backend·apps 모듈이다.
    서로를 컴파일 의존하지 않는다(양방향). webhook 팬아웃은 `backend.service.alerts` 로 간다.

## 4b. AI(LLM) 작업 가이드라인

- **보안 불변식은 단순화 대상이 아니다** — 스텁(`TODO`)을 채우거나 리팩터링할 때 위 5·6 의
  재서명·서명 게이트를 "테스트 편의" 나 "코드 간결성" 을 이유로 제거·우회하지 않는다.
- **포트 변경 = 가이드 동기화** — `domain` 포트 시그니처를 바꾸면 가이드 13.3 을, 가이드가 바뀌면
  포트를 같은 커밋·같은 작업에서 맞춘다. 한쪽만 바꾸고 끝내지 않는다.
- **벤더 사실 표기 규칙** — Fireblocks 동작을 주석·문서에 적을 때, 공식 문서로 확인 못 한 것은
  "적용 전 확인" 을 명시한다. LLM 일반 지식으로 벤더 API 이름·동작을 단정하지 않는다.
- **의사코드 ↔ Kotlin 이름 1:1** — 가이드 의사코드의 메서드·클래스명과 이 저장소의 이름을 일치시켜
  "가이드 N장" 주석만으로 상호 추적이 되게 유지한다.

## 5. 설계 결정 (의도적 — 바꾸지 말 것)

- **engine/chains 없음** (가이드 17.5) — 매니저로 Fireblocks 를 채택했으므로 서명·nonce·전파·멀티체인·인덱싱이
  전부 벤더 안에서 끝난다. 자체 구축 전환 때에만 `engine/*`·`chains/evm` 을 새 모듈로 추가하고, 그때도
  **도메인 포트와 두 백엔드는 그대로**다. 지금은 그 자리를 비워 두고 `adapters/fake` 로 벤더 없이 계약을 검증한다.
- **ChainId 는 enum 이 아니라 value class** — "EVM 체인 추가가 domain 을 바꾸지 않는다"(17.3)를 지키기 위해.
  현재 `ETHEREUM`·`BASE`. 새 EVM 체인은 어댑터의 체인·자산 등록만 늘리면 되고 backend·domain 은 0줄.
- **fake 는 계약 검증용** — 라이브 Fireblocks 와 같은 포트를 인메모리로 채운다. 자체 구축의 HD/인덱서/HSM
  내부는 담지 않는다(그건 훗날 engine/chains 자리). 계약 테스트를 fake·fireblocks 가 함께 통과하면 포트 의미가 구현과 무관함이 증명된다.

## 6. 흔한 작업 가이드

- **EVM 체인 추가**: `domain/ChainId` 에 상수 추가 + `shared/AddressRules` 의 when 에 chainId 추가(형식은 EVM 동일)
  + `adapters/fireblocks` 의 자산·체인 매핑 등록. backend·apps·domain 포트는 안 바뀐다.
- **custody 어댑터 선택**: `application.yml` 의 `custody.provider: fireblocks|fake` 한 줄.
- **자체 구축 전환** (가이드 17.5): `engine/*`·`chains/evm` 을 새 모듈로 추가하고 새 어댑터를 붙인다 —
  `settings.gradle.kts`·`apps/*-api` wiring 만 손대고 domain·backend 는 그대로.
- **스텁 채우기**: `TODO("...")` 는 전부 외부 I/O 경계 — Fireblocks SDK·영속 저장소. 채울 때
  해당 인터페이스(예: `FireblocksClient`)만 구현하면 되고 오케스트레이션 로직은 손대지 않는다.

## 7. 설계 참조

구현 의도가 궁금하면 코드 주석의 "가이드 N장" 표기를 따라 `docs-site/wallet-service-components/` 의
해당 페이지를 본다. 핵심: 0(두 층) · 13(포트) · 14(Fireblocks 어댑터) · 17(이 구조).

## 8. 2026-07-01 동기화 — Fireblocks-only · EVM-only · 두 백엔드 분리

가이드 17장의 새 모델(Fireblocks 채택 · EVM 이더리움·Base)로 구조를 정렬한 결정들:

- **매니저 = Fireblocks(유일한 라이브)** — 자체 구축 엔진(`engine/*`)·체인 프로토콜 모듈(`chains/*`)·
  `adapters/self-build`·`adapters/nodewallet`·`apps/indexer-worker` 를 전부 삭제. Fireblocks 가 서명·nonce·
  전파·멀티체인·인덱싱을 벤더 안에서 흡수하기 때문 (가이드 17.5).
- **테스트용 fake** — 삭제한 self-build 자리에 `adapters/fake`(`FakeCustodyAdapter`, 인메모리)를 둔다. 벤더 없이 계약 테스트·백엔드 검증용.
- **backend 물리 분리 (가이드 17.2 매핑)** — 단일 `backend` 를 `backend/service`(gateway·directory·orchestration·
  reconciliation(7)·alerts(8))와 `backend/admin`(정책·승인·동결·rebalance·sweep 스텁 — `policy/`·`sweep/`)로 나눔.
  패키지도 `backend.service.*`·`backend.admin.*`. Admin 은 domain 만 의존.
- **apps 정렬** — `apps/api` → `apps/service-api`(scans `backend.service`), 신규 `apps/admin-api`(scans `backend.admin`),
  `apps/webhook-receiver` 는 `backend.service.alerts` 로 팬아웃(→ `:backend:service` 의존).
- **domain EVM-only** — `ChainId` = `ETHEREUM`·`BASE`(BITCOIN·SOLANA·CANTON 제거). `ChainSpecific` 은 `Evm` 만
  (Utxo·Canton 제거). `TxStatus.AwaitingCounterparty`·`CantonTransactionType` 제거. `error/Errors` 는
  체인 특화 예외 대신 `UnsupportedCapabilityException`·`DuplicateRequestException`.
- ⚠ 컴파일 미검증 (환경에 gradle 없음) — 툴체인 확보 시 `./gradlew build` + `ktlintFormat` 필요.
