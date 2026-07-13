---
title: 14. API 레퍼런스 — 백엔드 연동 계약
status: To Do
---

매니저를 HTTP API 로 부르고 메시지 큐 이벤트를 consume 하는 백엔드 개발자를 위한 연동 계약이다.
1~10장에 흩어진 오퍼레이션·타입·열거형을 한곳에 모은 기준으로, 각 항목은 동작 이유가 담긴 장으로 링크한다.

## 읽는 법 · 범위

- **대상** — 매니저(별도 서비스)를 연동하는 Service·Admin 백엔드 개발자.
- **기준** — 오퍼레이션 시그니처·공통 타입·열거형의 정의는 이 장이 기준이다. 흐름·근거는 각 장을 본다.
- **표기** — 계약은 코틀린 시그니처 형태로 적는다. 실제 HTTP 경로·메서드는 구현(Swagger)을 따른다.
- **식별자** — `AccountId`·`Asset`·`WalletId` 는 문자열 별칭이다.

```kotlin
typealias AccountId = String   // 매니저 계정 매핑 id (우리 ref ↔ vault, 백엔드는 vaultId 를 모른다 · 9장)
typealias Asset = String       // 자산 식별 (체인 × 토큰)
typealias WalletId = String    // 사전 등록(화이트리스트) 지갑 id
```

## 공통 규약

- **멱등키(Idempotency-Key)** — 생성 계열은 키로 중복을 막는다. `createAccount` = f(ref), `createDepositAddress` = f(accountId, asset). 24시간 안의 재시도는 같은 결과를 돌려준다. 그 뒤의 영구 유일성은 매니저 DB 의 UNIQUE 제약이 보장한다(1·2장).
- **externalTxId** — 제출할 때 백엔드가 싣는 우리 요청 키다. 재제출 중복 차단 + 완료 이벤트 대응에 쓰고, 매니저는 완료 이벤트에 그대로 실어 되돌려준다(6·10·12장).
- **이벤트 전달 = at-least-once** — 같은 이벤트가 드물게 두 번 올 수 있다. 이벤트 ID(tx id 또는 externalTxId) 유일 기준으로 **상태 전이만 반영**하고, 오프셋은 원장 반영 성공 후 커밋한다(4장).
- **에러 구분** — `depositAddressOf` 는 계정 없음(`AccountNotFound`)과 주소 미발급(`null`)을 구분한다(3장). 제출 응답은 성공·확정 에러·애매한 에러 세 갈래다(6·10장).

## 계정 · 주소 API

```kotlin
fun createAccount(ref: String): Account                          // 1장 — vault 생성 · ref↔accountId 매핑
fun createDepositAddress(accountId: AccountId, asset: Asset): Address   // 2장 — 자산 지갑 활성화 · 주소 발급
fun depositAddressOf(accountId: AccountId, asset: Asset): Address?      // 3장 — DB 읽기 · 벤더 왕복 없음
```

- `createAccount` — 같은 `ref` 재요청은 같은 `accountId` 를 돌려준다(멱등). EVM 은 자산당 주소 하나라, 같은 자산의 주소를 더 두려면 계정을 더 만든다(2장).
- `depositAddressOf` — 세 갈래: 주소 있음 → `Address`, 계정 있고 주소 미발급 → `null`, 계정 없음 → `AccountNotFound`. 주소를 만들지는 않는다(생성은 `createDepositAddress`).

## 잔액 · 내역 API

```kotlin
fun balanceOf(accountId: AccountId, asset: Asset): Balance       // 8장 — vault 잔액(가용·대기·잠김)
fun transactionsOf(                                              // 8장 — 기간·상태로 거래 목록
  accountId: AccountId,
  after: Instant,
  before: Instant,
  status: TxStatus? = null,
): List<Transfer>
fun transactionOf(txId: String): Transfer?                     // 단건 조회 (벤더 getTransactionById · 00·8장)
```

- `balanceOf` 가 주는 값은 **vault 단위 벤더/온체인 잔액**이라 대사(reconciliation) 재료다 — 고객별 귀속 잔액이 아니다. 고객별 잔액·귀속은 백엔드(daw-core)가 원장으로 가진다(8·13장).
- `after`·`before` 는 **거래 시각(createdAt) 기준** 시간창이다(최신순 이력). 매니저 내부의 lastUpdated 감지 폴링과는 별개 — 목록 조회는 안정적 createdAt 정렬을 쓴다.

## 출금 · 수수료 API

```kotlin
fun estimateFee(request: FeeEstimateRequest): FeeEstimate        // 7장 — 낮음·보통·높음 추정 (from·to·asset·amount 만)
fun submitTransaction(request: TransactionRequest): SubmitResult        // 6장 — 제출 → 벤더 tx id
```

- `estimateFee` 는 보장값이 아니다 — 실제 수수료는 제출 시점에 다시 정한다. 대납 구성에선 이 값이 relay 실비 예측이다(7장, 가스 대납 문서).
- `submitTransaction` 의 응답 `SubmitResult` 의 `txId` 가 벤더 tx id 다. 상태 진행은 응답이 아니라 큐 이벤트(아래)로 따라간다.
- **`boost` · `cancel` 은 백엔드가 호출하지 않는다.** 막힌 출금은 매니저가 Admin 정책 안에서 **자동 boost**(같은 순번·수수료만 올린 재전송)하고, 백엔드는 이를 모른 채 같은 상태 흐름(CONFIRMING → COMPLETED)만 본다. `cancel` 은 자동 boost 로도 못 살린 예외에서 Admin 의 수동 최후수단이다(6장).

## 이벤트 (메시지 큐)

```kotlin
fun onChainEvent(topic: Topic, handler: (ChainEvent) -> Unit)    // 4장 — 토픽별 전용 컨슈머 등록
```

세 토픽으로 갈라 온다. 백엔드는 토픽마다 전용 컨슈머를 두고, 컨슈머 그룹은 토픽당 하나다.

| 토픽 | 담는 이벤트 | 파티션 키 | 소비 |
|---|---|---|---|
| `deposit-events` | 고객 입금 감지·확정 (DEPOSIT · UNMAPPED) | 고객 accountId | 입금 컨슈머 (5장) |
| `withdrawal-events` | 외부 출금 상태 변경 (WITHDRAWAL) | 출금 풀 vault 의 accountId | 출금 컨슈머 (6장) |
| `internal-events` | 내부 이체 완료 (INTERNAL — sweep·delta 구분은 externalTxId 로) | 출발 계정 accountId | 정산 컨슈머 (5·10장) |

- 같은 계정의 순서는 파티션이 보장한다. sweep·delta 같은 업무 의도는 매니저가 모르고(`INTERNAL` 까지만), 백엔드가 externalTxId 로 가른다(4·10장).
- 판단은 `status`(TxStatus 다섯)로 한다. `subStatus`·`networkStatus` 는 분기가 필요한 최소 집합만 보고 나머지는 로깅한다(4장).

## 공통 타입

```kotlin
data class Account(
  val ref: String,                     // 우리 참조 키 (영구 유일)
  val accountId: AccountId,            // vault 매핑 id
)

data class Address(
  val value: String,                   // 온체인 주소
  val memoTag: String? = null,         // EVM = null · Tag/Memo 체인만 사용
)

data class SubmitResult(
  val txId: String,                    // 벤더 tx id
)

data class FeeEstimate(
  val low: Fee,                        // 낮음·보통·높음 세 단계 추정
  val medium: Fee,
  val high: Fee,
)                                      // Fee 세부(가스 단가·한도 등)는 체인별 구현에서 정의

data class Balance(
  val available: BigDecimal,           // 가용
  val pending: BigDecimal,             // 대기 (확정 전)
  val locked: BigDecimal,              // 잠김 (전파 전 출금분 + 동결)
)

enum class PeerType { ADDRESS, ACCOUNT, WHITELISTED }

data class TransferPeer(               // 벤더 TransferPeerPath 대응 — from·to 공통
  val type: PeerType,
  val address: String? = null,         // type=ADDRESS     — 온체인 주소 (외부 출금 → ONE_TIME_ADDRESS)
  val accountId: AccountId? = null,    // type=ACCOUNT     — 우리 계정 (내부 이동 → VAULT_ACCOUNT)
  val walletId: WalletId? = null,      // type=WHITELISTED — 사전 등록 지갑 (→ EXTERNAL_WALLET)
)

data class TransactionRequest(
  val externalTxId: String,            // 우리 요청 키 — 재제출 중복 차단 · 완료 대응
  val from: TransferPeer,              // 보내는 쪽 — 우리 vault 라 type=ACCOUNT 만 허용
  val to: TransferPeer,                // 목적지 — 세 갈래
  val asset: Asset,
  val amount: BigDecimal,
  val note: String? = null,            // 벤더 거래 기록 메모
  val travelRule: TravelRule? = null,  // 게이트 산출물(암호화) — 매니저는 운반만
)

data class Transfer(
  val txId: String,                   // 벤더 tx id
  val txHash: String? = null,          // 온체인 거래해시 — 전파 후 채워짐
  val externalTxId: String? = null,    // 우리 요청 키
  val asset: Asset,
  val amount: BigDecimal,
  val from: String,                    // 발신 주소
  val to: String,                      // 목적지 주소
  val status: TxStatus,
  val numOfConfirmations: Int,
  val createdAt: Instant,              // 거래 생성 시각 — 목록 정렬·기간(after·before) 기준
  val lastUpdated: Instant,            // 마지막 상태 변경 시각
)

data class ChainEvent(
  val type: EventType,                 // 매니저가 체인+매핑으로 가른 분류
  val txId: String,                   // 벤더 tx id
  val txHash: String? = null,          // 온체인 거래해시 — 전파 후
  val externalTxId: String? = null,    // 우리 요청 키 (출금·내부이체)
  val accountId: AccountId,            // 파티션 키
  val asset: Asset,
  val to: String,                      // 목적지 주소 — 입금 판별
  val status: TxStatus,
  val numOfConfirmations: Int,
  val subStatus: String? = null,       // 벤더 상세 사유 — 최소 집합만 분기
  val networkStatus: String? = null,   // 체인 레이어 상태
)

class TravelRule                       // 게이트가 만든 암호화 산출물 · 매니저 미해석
                                       // 해외(Notabene)=메시지 · 국내(VerifyVASP)·개인지갑=없음 (12장)
```

## 열거형

```kotlin
enum class Topic { deposit, withdrawal, internal }   // 토픽명은 deposit-events 등
```

- **EventType** — `DEPOSIT`(고객 입금) · `UNMAPPED`(귀속 불명·보류) · `WITHDRAWAL`(외부 출금) · `INTERNAL`(내부 이체). 매니저가 발신자가 우리 vault 인지로 가른다(4장).
- **TxStatus** (공통 상태 다섯, 4장 기준) — `SUBMITTED`(제출·체인 미등장, 출금만) · `CONFIRMING`(체인 등장·컨펌 누적) · `COMPLETED`(DCCP 임계 도달·확정) · `REJECTED`(거부·차단, **일시적** — 사람 개입 여지) · `FAILED`(**영구** 실패). REJECTED ≠ FAILED 구분이 원장·화면 처리를 가른다.
- **PeerType** — `ADDRESS`(온체인 주소) · `ACCOUNT`(우리 계정) · `WHITELISTED`(사전 등록 지갑). 벤더 `TransferPeerPathType`(ONE_TIME_ADDRESS · VAULT_ACCOUNT · EXTERNAL_WALLET)로 매핑(6장).

## 상태 · 확정

- **TxStatus 기준**과 벤더 원어 번역, subStatus·networkStatus 분담은 [4장 공통 상태 다섯](04-detect-confirm.md#공통-상태-다섯-txstatus-기준).
- **확정 기준(DCCP)** — 체인별 확정 컨펌수 정책은 4장. 첫 COMPLETED 가 곧 finality 는 아니므로 `numOfConfirmations` 를 임계와 직접 비교한다.
- **백엔드 DB(daw-core) 매핑** — 매니저 TxStatus 를 daw-core 상태로 옮기는 대응·미해결(REJECTED 짝 등)은 [13장 백엔드 DB 정합](13-backend-db-alignment.md).

## 오퍼레이션 색인

| 오퍼레이션 | 종류 | 호출 | 장 |
|---|---|---|---|
| `createAccount` | API | Service | 1장 |
| `createDepositAddress` | API | Service | 2장 |
| `depositAddressOf` | API | Service | 3장 |
| `balanceOf` | API | Service·Admin | 8장 |
| `transactionsOf` · `transactionOf` | API | Service·Admin | 8장 (단건은 6장도) |
| `estimateFee` | API | Service | 7장 |
| `submitTransaction` | API | Service | 6장 |
| `boost` · `cancel` | 내부·운영 | 매니저 자동 · Admin | 6장 |
| `onChainEvent` (deposit·withdrawal·internal) | 이벤트 | Service | 4·5·6·10장 |
