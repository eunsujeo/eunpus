---
title: Compliance Service API v0.0.1
status: To Do
view: doc
---

월렛 백엔드와 스펙을 맞추는 연동 계약 — HTTP 엔드포인트·공통 규약·메시지 큐 이벤트·인바운드 내부 API·타입 전체.
계약의 배경·시퀀스는 [설계 1장](../설계/01-interface.md), 판정 어휘의 근거는 [트래블룰 8장](../../트래블룰/설계/08-gate-port.md).

# Compliance Service API

`v0.0.1`

컴플라이언스 서비스는 규제 대응의 망·벤더 연동을 전담하는 별도 서비스다.
월렛 백엔드는 이 HTTP API 로 출금 확인·입금 판별의 망 조회를 요청하고,
비동기 판정의 도착은 메시지 큐 이벤트로 받는다.

아래 규약은 **모든 엔드포인트에 공통** 적용되며, 블록체인 매니저 API 와 같은 형식을 쓴다.

## 응답 형식

성공·에러 모두 같은 구조로 돌려준다. `meta.requestId` 로 요청을 추적한다.

단일 리소스:

```json
{
  "data": {
    "checkId": "chk_01J9Z",
    "verdict": "PENDING"
  },
  "meta": {
    "requestId": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
  }
}
```

에러:

```json
{
  "error": {
    "code": "CHECK_NOT_FOUND",
    "message": "withdrawal check not found"
  },
  "meta": {
    "requestId": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
  }
}
```

## 데이터 포맷

- **시각** — ISO 8601, UTC, 밀리초. 예: `2026-07-14T04:05:06.789Z`
- **금액** — 문자열(decimal). 예: `"1.5"`. float 가 아니라 decimal 로 파싱한다.
- **필드명** — camelCase (`withdrawalId` · `verificationRef`)
- **요청 추적** — 모든 응답에 `meta.requestId`
- **망 원어 비노출** — 응답은 공통 어휘(TrVerdict 등)만 싣는다. 벤더 판정 코드 등 망 원어 근거는 서비스가 감사 기록으로 보존한다.

## 에러 코드

판단은 `error.code` 로 한다.

| 코드 | HTTP | 뜻 |
|---|---|---|
| `VALIDATION_FAILED` | 400 | 요청 형식·값이 규약에 안 맞음 |
| `CHECK_NOT_FOUND` | 404 | 확인 건 없음 |
| `NOT_FOUND` | 404 | 그 밖의 리소스 없음 |
| `CONFLICT` | 409 | 멱등 충돌 — 같은 `withdrawalId` 로 다른 본문 재요청 |
| `NETWORK_UNAVAILABLE` | 502 | 망·벤더 장애 — 외부 이체는 fail-close 가 원칙 |
| `INTERNAL` | 500 | 서버 내부 오류 |

`INTERNAL`(500) 은 모든 엔드포인트에서 날 수 있어, 오퍼레이션별 응답 표기에서는 생략한다.

## 멱등

- **Create Withdrawal Check** — `withdrawalId` 가 멱등 키다. 같은 키 재요청은 새 확인을 만들지 않고 기존 확인을 `200` 으로 돌려준다. 같은 키에 다른 본문이면 `CONFLICT`(409).
- **제출 결과 보고** — 같은 `txHash` 재보고는 no-op 이다.

## 이벤트 (메시지 큐)

비동기 판정의 도착(승인·거절·PENDING 만료)은 이 HTTP API 가 아니라 **메시지 큐 이벤트**로 온다.

- **토픽**: `compliance` · 파티션 키 = `accountId` (기존 큐 규칙과 동일)
- 월렛은 이벤트 수신 후 Get Withdrawal Check 로 동봉물·증적을 가져간다. 이벤트가 유실돼도 폴링과 PENDING 만료 규칙이 흐름을 끝낸다.
- **PENDING 만료의 주인은 이 서비스** — 망별 시간 규칙([트래블룰 4장](../../트래블룰/설계/04-policy-and-timing.md))을 아는 쪽이 만료를 판정해 `REJECTED` 로 발행한다.

이벤트 본문은 [SettledEvent](#타입) 타입.

## API

### Counterparties

#### Search Counterparties

`GET` `https://{baseUrl}/compliance/travel-rule/counterparties`

출금 화면에서 사용자가 수취 거래소를 고르는 단계에 쓴다.
검색 대상은 망 실시간 조회가 아니라 **이 서비스 DB 의 명부 스냅샷**이다 — VerifyVASP 회원 명부(상호연동된 CODE 회원 포함)와 Notabene VASP 명부를 주기 동기화해 보관하고, 검색은 자체 DB 에서 답한다. 망 장애·지연이 출금 화면에 번지지 않고, `counterpartyId` 는 스냅샷의 우리 발급 안정 ID 다.
상대의 현재 상태(health·도달성)는 검색 시점이 아니라 **Create Withdrawal Check 시점에 망에 재확인**한다 — 스냅샷이 동기화 주기만큼 낡아도 판정은 안전하다.

_쿼리 파라미터_

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `query` | string | 필수 | 거래소 이름 (부분 일치) |

_응답_

`200` — 후보 목록

```json
{
  "data": [
    {
      "counterpartyId": "cpty_upbit",
      "name": "Upbit",
      "reachable": true,
      "network": "VERIFYVASP"
    }
  ],
  "meta": {
    "requestId": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
  }
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `data` | Counterparty 배열 | 필수 |  |
| `meta` | Meta | 필수 |  |

### Withdrawal Checks

#### Create Withdrawal Check

`POST` `https://{baseUrl}/compliance/travel-rule/withdrawal-checks`

출금 한 건의 트래블룰 확인을 시작한다. 동기 망(CODE·Notabene)은 최종 verdict 를 즉답하고, 비동기 망(VerifyVASP)은 `PENDING` 을 돌려준 뒤 결과를 큐 이벤트로 알린다.
`withdrawalId` 로 멱등 — 같은 키 재요청은 기존 확인을 돌려준다.

_요청 본문_

```json
{
  "withdrawalId": "wd_01H8X",
  "accountId": "acct_01H8X",
  "asset": "ETH",
  "amount": "1.5",
  "destinationAddress": "0x896B...0b9b",
  "beneficiary": {
    "name": "Bruce Wayne",
    "accountNumber": "0x896B...0b9b",
    "counterpartyId": "cpty_upbit"
  }
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `withdrawalId` | string | 필수 | 월렛의 출금 ID — 멱등 키 |
| `accountId` | string | 필수 | 계정 ID — 큐 파티션 키·감사 축 |
| `asset` | string | 필수 | 자산 심볼 |
| `amount` | string | 필수 | 금액(문자열) |
| `destinationAddress` | string | 필수 | 수취 주소 |
| `beneficiary` | Beneficiary | - | 수취인 정보 — 트래블룰 대상 거래만. 판별 결과 필요한데 없으면 `VALIDATION_FAILED` 에 부족 필드를 담아 돌려준다 |

_응답_

`201` — 확인 개시됨 (멱등 재요청이면 `200`)

```json
{
  "data": {
    "checkId": "chk_01J9Z",
    "withdrawalId": "wd_01H8X",
    "accountId": "acct_01H8X",
    "verdict": "PENDING",
    "attachment": null,
    "evidence": null
  },
  "meta": {
    "requestId": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
  }
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `data` | WithdrawalCheck | 필수 |  |
| `meta` | Meta | 필수 |  |

`409` — 같은 `withdrawalId` 에 다른 본문

#### Get Withdrawal Check

`GET` `https://{baseUrl}/compliance/travel-rule/withdrawal-checks/{checkId}`

settled 이벤트 수신 후 동봉물·증적을 가져가는 용도이자, 이벤트 유실 대비 폴링 겸용.

_응답_

`200`

```json
{
  "data": {
    "checkId": "chk_01J9Z",
    "withdrawalId": "wd_01H8X",
    "accountId": "acct_01H8X",
    "verdict": "APPROVED",
    "attachment": { "travelRuleMessage": "..." },
    "evidence": { "kind": "PRE_APPROVAL", "ref": "uuid-...", "settledAt": "2026-07-14T04:05:06.789Z" }
  },
  "meta": {
    "requestId": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
  }
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `data` | WithdrawalCheck | 필수 |  |
| `meta` | Meta | 필수 |  |

`404` — `CHECK_NOT_FOUND`

#### Report Withdrawal Result

`POST` `https://{baseUrl}/compliance/travel-rule/withdrawal-checks/{checkId}/report`

온체인 제출 후 tx hash 를 보고한다. 사후 보고가 필요 없는 망이면 서비스가 no-op 처리 — 월렛은 항상 호출한다.
실패는 재시도 대상일 뿐 출금 흐름을 막지 않는다.

_요청 본문_

```json
{
  "txHash": "0xabc..."
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `txHash` | string | 필수 | 온체인 거래해시 |

_응답_

`202` — 접수

```json
{
  "data": {
    "checkId": "chk_01J9Z"
  },
  "meta": {
    "requestId": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
  }
}
```

### Deposit Checks

#### Create Deposit Check

`POST` `https://{baseUrl}/compliance/travel-rule/deposit-checks`

입금 한 건에 대해 망에 물어보는 부분만 대행한다 — 대기함 대조·귀속 판단·가용 전이는 월렛 몫이다.

_요청 본문_

```json
{
  "sourceAddress": "0x1a2b...",
  "asset": "ETH",
  "amount": "1.5",
  "txHash": "0xdef...",
  "verificationRef": "uuid-..."
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `sourceAddress` | string | 필수 | 입금 source 주소 |
| `asset` | string | 필수 | 자산 심볼 |
| `amount` | string | 필수 | 금액(문자열) |
| `txHash` | string | 필수 | 온체인 tx |
| `verificationRef` | string | - | 대기함의 사전 검증 참조 — 있으면 능동 조회(Check Transaction Status)의 열쇠로 쓴다 |

_응답_

`200`

```json
{
  "data": {
    "registryMatched": false,
    "senderVerified": "VERIFIED",
    "counterpartyName": "Upbit"
  },
  "meta": {
    "requestId": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
  }
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `data` | DepositCheckResult | 필수 |  |
| `meta` | Meta | 필수 |  |

## 인바운드 내부 API — 월렛이 구현, 컴플라이언스가 호출

상대 VASP 의 사전 검증 요청(수신 질문)에 답하기 위한 계약. 응답 형식·에러 형식은 위 공통 규약과 동일하다.

#### Verify Address Attribution

`POST` `https://{walletBaseUrl}/internal/compliance/address-attribution`

"이 주소가 너희 고객 아무개 소유인가" — 주소↔계정은 월렛이 답하고, 실명 대조는 그 데이터를 가진 서비스에 이어 조회한 결과를 합쳐 돌려준다.

_요청 본문_

```json
{
  "address": "0x896B...0b9b",
  "name": "Bruce Wayne"
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `address` | string | 필수 | 확인 대상 주소 |
| `name` | string | - | 상대가 대조를 요청한 실명 (있으면) |

_응답_

`200`

```json
{
  "data": {
    "owned": true,
    "accountId": "acct_01H8X",
    "nameMatched": true
  },
  "meta": {
    "requestId": "3f9a1c2e-7b4d-4e2a-9c1f-0a2b3c4d5e6f"
  }
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `owned` | boolean | 필수 | 우리 고객의 주소인가 |
| `accountId` | string (null 가능) | - | 귀속 계정 |
| `nameMatched` | boolean (null 가능) | - | 실명 대조 결과 — `name` 이 안 왔으면 null |

#### Submit Pre-Verification

`POST` `https://{walletBaseUrl}/internal/compliance/pre-verifications`

수신한 트래블룰 정보를 월렛에 넘긴다 — 월렛이 대기함에 적재하고 도착 후 대조의 재료로 쓴다.
같은 `verificationRef` 재전달은 갱신(tx hash 후속 전달 포함)으로 처리한다.

_요청 본문_

```json
{
  "verificationRef": "uuid-...",
  "sourceAddress": "0x1a2b...",
  "beneficiaryAddress": "0x896B...0b9b",
  "asset": "ETH",
  "amount": "1.5",
  "txHash": null
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `verificationRef` | string | 필수 | 망 쪽 검증 참조 — tx hash 매핑·능동 조회의 열쇠 |
| `sourceAddress` | string | 필수 | 송신 주소 |
| `beneficiaryAddress` | string | 필수 | 우리 쪽 수취 주소 |
| `asset` | string | 필수 | 자산 심볼 |
| `amount` | string | 필수 | 금액(문자열) |
| `txHash` | string (null 가능) | - | tx hash 보고가 오면 후속 전달 |

_응답_

`202` — 접수 (월렛이 대기함 적재)

## 타입

### Meta

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `requestId` | string | 필수 | 요청 추적 id (모든 응답에 포함) |

### ErrorBody

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `code` | string | 필수 | 에러 코드 (공통 규약 표 참조) |
| `message` | string | 필수 | 사람이 읽는 설명 — 분기 판단은 `code` 로 한다 |

### TrVerdict

판정 어휘 — 망 원어를 이 넷으로 번역한다 ([트래블룰 8장](../../트래블룰/설계/08-gate-port.md)).

| 값 | 뜻 | 월렛의 처리 |
|---|---|---|
| `NOT_REQUIRED` | 임계 미만·면제 — 정보 교환 불필요 | 그대로 제출 진행 |
| `APPROVED` | 통과 | 동봉물 실어 제출(출금) · 가용 전이 재료(입금) |
| `PENDING` | 확인 중 — 비동기 승인 대기 | "트래블룰 확인 중" 유지, settled 이벤트 대기 |
| `REJECTED` | 거절 · PENDING 만료 | 출금 반려(잠긴 금액 가용 복귀) · 입금 보류 |

### Counterparty

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `counterpartyId` | string | 필수 | 후보 식별자 — Create Withdrawal Check 에 그대로 넘긴다 |
| `name` | string | 필수 | 표시명 |
| `reachable` | boolean | 필수 | 현재 구성으로 도달 가능한가 — 마지막 동기화 기준. 최종 확인은 Create Withdrawal Check 에서 |
| `network` | string | 필수 | 처리 망 표시 — `VERIFYVASP` `CODE_INTEROP` `NOTABENE`. 화면 안내·감사용 — 월렛 로직 분기 금지 |

### Beneficiary

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `name` | string | 필수 | 수취인 이름 |
| `accountNumber` | string | 필수 | 수취 계좌(주소) |
| `counterpartyId` | string (null 가능) | - | 수취 거래소 — counterparties 검색에서 고른 값 |

### WithdrawalCheck

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `checkId` | string | 필수 | 확인 건 식별자 — 서비스가 발급 |
| `withdrawalId` | string | 필수 | 월렛의 출금 ID (멱등 키) |
| `accountId` | string | 필수 | 계정 ID |
| `verdict` | TrVerdict | 필수 | 현재 판정 |
| `attachment` | Attachment (null 가능) | - | 제출 동봉물 — 없는 망은 null |
| `evidence` | Evidence (null 가능) | - | 통과 증적 — 판정 전이면 null |

### Attachment

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `travelRuleMessage` | string | 필수 | 매니저 제출 요청의 `travelRule` 필드에 그대로 싣는다 — 월렛은 내용을 해석하지 않는다 |

### Evidence

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `kind` | string | 필수 | 증적 종류 — 망별 목록은 미확정(아래) |
| `ref` | string | 필수 | 증적 참조 (예: 사전 승인 참조) |
| `settledAt` | string (ISO 8601) | 필수 | 판정 시각 |

### DepositCheckResult

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `registryMatched` | boolean | 필수 | source 가 등록·소유 인증된 개인지갑인가 (Address Registry) |
| `senderVerified` | string | 필수 | 송신측 검증 유무 능동 조회 결과 — `VERIFIED` `NOT_FOUND` `UNAVAILABLE`. UNAVAILABLE = 조회 열쇠 없음(사전 검증 기록이 없는 입금은 조회 불가) |
| `counterpartyName` | string (null 가능) | - | 식별된 송신 VASP (있으면) |

### SettledEvent

큐로 오는 비동기 판정 도착 이벤트 (HTTP 응답이 아니라 `compliance` 토픽으로 전달).

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `type` | string | 필수 | `withdrawal-check.settled` |
| `checkId` | string | 필수 | 확인 건 |
| `withdrawalId` | string | 필수 | 월렛의 출금 ID |
| `accountId` | string | 필수 | 파티션 키 |
| `verdict` | TrVerdict | 필수 | `APPROVED` 또는 `REJECTED` (PENDING 만료 포함) |
| `settledAt` | string (ISO 8601) | 필수 | 판정 시각 |

## 미확정

- **원화 임계 판정의 위치** — 벤더 지원 여부 미확정([트래블룰 14장](../../트래블룰/설계/14-fireblocks-questions.md) 문의 1). 어느 쪽이든 이 API 표면(verdict)은 바뀌지 않는다.
- **Evidence.kind 목록** — 망별 증적 종류 확정 후 enum 으로 못 박는다.
- **인증 방식** — 서비스 간 인증(월렛↔컴플라이언스·내부 API)은 인프라 결정과 함께 확정.
