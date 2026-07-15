---
title: Compliance Service API v0.0.2
status: To Do
view: doc
---

월렛 백엔드와 스펙을 맞추는 연동 계약 — HTTP 엔드포인트·공통 규약·메시지 큐 이벤트·인바운드 내부 API·타입 전체.
계약의 배경·시퀀스는 [설계 1장](../설계/01-interface.md), verdict 값의 근거는 [트래블룰 8장](../../트래블룰/설계/08-gate-port.md).

# Compliance Service API

`v0.0.2`

컴플라이언스 서비스는 규제 대응의 솔루션·벤더 연동을 전담하는 별도 서비스다.
월렛 백엔드는 이 HTTP API 로 출금 확인·입금 판별의 솔루션 조회를 요청하고,
비동기 확인의 결과 도착은 메시지 큐 이벤트로 받는다.

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
- **필드명** — camelCase (`externalTxId` · `travelRuleMessage`)
- **요청 추적** — 모든 응답에 `meta.requestId`
- **솔루션 원어 비노출** — 응답은 공통 어휘(TrVerdict 등)만 싣는다. 벤더 응답 코드 등 솔루션 원어 근거는 서비스가 감사 기록으로 보존한다.
- **curl 예시의 인증 헤더는 생략** — 서비스 간 인증 방식은 미확정(아래 미확정 절).

## 에러 코드

판단은 `error.code` 로 한다.

| 코드 | HTTP | 뜻 |
|---|---|---|
| `VALIDATION_FAILED` | 400 | 요청 형식·값이 규약에 안 맞음 |
| `CHECK_NOT_FOUND` | 404 | check 없음 |
| `NOT_FOUND` | 404 | 그 밖의 리소스 없음 |
| `CONFLICT` | 409 | 멱등 충돌 — 같은 `externalTxId` 로 다른 본문 재요청 |
| `NETWORK_UNAVAILABLE` | 502 | 솔루션·벤더 장애 — 외부 이체는 fail-close 가 원칙 |
| `INTERNAL` | 500 | 서버 내부 오류 |

`INTERNAL`(500) 은 모든 엔드포인트에서 날 수 있어, 오퍼레이션별 응답 표기에서는 생략한다.

## 멱등

- **Create Withdrawal Check** — `externalTxId` 가 멱등 키다. 같은 키 재요청은 새 check 를 만들지 않고 기존 check 를 `200` 으로 돌려준다. 같은 키에 다른 본문이면 `CONFLICT`(409) — 서비스가 최초 요청의 본문 해시를 check 에 보관해 대조한다.
- **제출 결과 보고** — 같은 `txHash` 재보고는 no-op 이다.

## 이벤트 (메시지 큐)

비동기 확인의 결과 도착(승인·거절·PENDING 만료)은 이 HTTP API 가 아니라 **메시지 큐 이벤트**로 온다.

- **토픽**: `compliance` · 파티션 키 = `accountId` (기존 큐 규칙과 동일)
- 월렛은 이벤트의 verdict 로 바로 진행한다 — 비동기 경로는 travelRuleMessage 가 없어 이벤트만으로 충분하다. Get Withdrawal Check 는 이벤트 유실 대비 폴링·재기동 복구 전용이고, 그마저 놓쳐도 PENDING 만료 규칙이 흐름을 끝낸다.
- **PENDING 만료의 주인은 이 서비스** — 솔루션별 시간 규칙([트래블룰 4장](../../트래블룰/설계/04-policy-and-timing.md))을 아는 쪽이 만료를 가려 `REJECTED` 로 발행한다.

이벤트 본문은 [SettledEvent](#타입) 타입.

## API

### Counterparties

#### List Counterparties

`GET` `https://{baseUrl}/compliance/travel-rule/counterparties`

출금 화면에서 고객에게 보여줄 수취 거래소 목록을 내려준다 — 고객은 이 중 하나를 고른다.

```bash
curl "https://{baseUrl}/compliance/travel-rule/counterparties"
```

목록의 원천은 솔루션 실시간 조회가 아니라 **컴플라이언스 DB 의 거래소 목록**이다 — VerifyVASP 회원 목록(상호연동된 CODE 회원 포함)과 Notabene VASP 목록을 주기 동기화해 보관한다. 솔루션 장애·지연이 출금 화면에 번지지 않고, `counterpartyId` 는 이 목록에 붙는 우리 발급 안정 ID 다.
상대의 현재 상태(health·도달성)는 목록 시점이 아니라 **Create Withdrawal Check 시점에 솔루션에 재확인**한다 — 목록이 동기화 주기만큼 낡아도 확인은 안전하다.

**응답**

`200` — 거래소 목록

```json
{
  "data": [
    {
      "counterpartyId": "cpty_upbit",
      "name": "Upbit",
      "reachable": true
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

출금 한 건의 트래블룰 확인을 시작한다. **거래소 선택 출금 전용이다** — 개인지갑 출금은 등록 지갑 확인을 월렛이 자체 처리하므로 이 API 를 부르지 않는다. 동기 솔루션(CODE·Notabene)은 최종 verdict 를 즉답하고 — **이때 travelRuleMessage·증적까지 실려 와 이 응답만으로 제출 가능하다** — 비동기 솔루션(VerifyVASP)은 `PENDING` 을 돌려준 뒤 결과를 큐 이벤트로 알린다.
`externalTxId` 로 멱등 — 같은 키 재요청은 기존 check 를 돌려준다.

```bash
curl -X POST "https://{baseUrl}/compliance/travel-rule/withdrawal-checks" \
  -H "Content-Type: application/json" \
  -d '{
    "externalTxId": "WD-000123",
    "accountId": "acct_01H8X",
    "asset": "ETH",
    "amount": "1.5",
    "destinationAddress": "0x896B...0b9b",
    "beneficiary": { "name": "Bruce Wayne", "accountNumber": "0x896B...0b9b", "counterpartyId": "cpty_upbit" }
  }'
```

**요청 본문**

```json
{
  "externalTxId": "WD-000123",
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
| `externalTxId` | string | 필수 | 월렛 DB 의 출금 건 식별자 — 멱등 키. 블록체인 매니저 제출에 쓰는 키와 같은 것 — 한 출금을 양쪽에서 같은 키로 추적한다 |
| `accountId` | string | 필수 | 계정 ID — 큐 파티션 키·감사 축 |
| `asset` | string | 필수 | 자산 심볼 |
| `amount` | string | 필수 | 금액(문자열) |
| `destinationAddress` | string | 필수 | 수취 주소 |
| `beneficiary` | Beneficiary | - | 수취인 정보 — 트래블룰 대상 거래만. 판별 결과 필요한데 없으면 `VALIDATION_FAILED` 에 부족 필드를 담아 돌려준다 |

**응답**

`201` — check 생성됨 (멱등 재요청이면 `200`)

```json
{
  "data": {
    "checkId": "chk_01J9Z",
    "externalTxId": "WD-000123",
    "accountId": "acct_01H8X",
    "verdict": "PENDING",
    "travelRuleMessage": null,
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

`409` — 같은 `externalTxId` 에 다른 본문

#### Get Withdrawal Check

`GET` `https://{baseUrl}/compliance/travel-rule/withdrawal-checks/{checkId}`

이벤트 유실 대비 폴링·재기동 복구 전용 — 정상 흐름에서는 호출하지 않는다. 동기 건은 Create 응답으로, 비동기 건은 settled 이벤트의 verdict 로 끝난다(비동기 경로는 travelRuleMessage 가 없다).

```bash
curl "https://{baseUrl}/compliance/travel-rule/withdrawal-checks/chk_01J9Z"
```

**응답**

`200`

```json
{
  "data": {
    "checkId": "chk_01J9Z",
    "externalTxId": "WD-000123",
    "accountId": "acct_01H8X",
    "verdict": "APPROVED",
    "travelRuleMessage": null,
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

온체인 제출 후 tx hash 를 보고한다. 사후 보고가 필요 없는 솔루션이면 서비스가 no-op 처리 — 월렛은 항상 호출한다.
실패는 재시도 대상일 뿐 출금 흐름을 막지 않는다.

```bash
curl -X POST "https://{baseUrl}/compliance/travel-rule/withdrawal-checks/chk_01J9Z/report" \
  -H "Content-Type: application/json" \
  -d '{ "txHash": "0xabc..." }'
```

**요청 본문**

```json
{
  "txHash": "0xabc..."
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `txHash` | string | 필수 | 온체인 거래해시 |

**응답**

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

입금 한 건의 트래블룰 확인. 서비스가 **자기 대기함(컴플라이언스 DB 의 사전 검증 기록)과 대조**하고, 대조가 안 되면 능동 조회(보고 미수신 건 — Check Transaction Status · 기록 자체가 없으면 — TXID 역추적)까지 안에서 처리해 결과만 돌려준다. 귀속 판단·가용 전이는 월렛 몫이다.

```bash
curl -X POST "https://{baseUrl}/compliance/travel-rule/deposit-checks" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceAddress": "0x1a2b...",
    "asset": "ETH",
    "amount": "1.5",
    "txHash": "0xdef..."
  }'
```

**요청 본문**

```json
{
  "sourceAddress": "0x1a2b...",
  "asset": "ETH",
  "amount": "1.5",
  "txHash": "0xdef..."
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `sourceAddress` | string | 필수 | 입금 source 주소 |
| `asset` | string | 필수 | 자산 심볼 |
| `amount` | string | 필수 | 금액(문자열) |
| `txHash` | string | 필수 | 온체인 tx |

**응답**

`200`

```json
{
  "data": {
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

상대 VASP 의 사전 검증 요청(수신 질문)에 답하기 위한 계약. 수신 기록의 적재·tx hash 갱신은 서비스 내부(컴플라이언스 DB 대기함)라 월렛 API 가 없다. 응답 형식·에러 형식은 위 공통 규약과 동일하다.

#### Verify Address Attribution

`POST` `https://{walletBaseUrl}/internal/compliance/address-attribution`

"이 주소가 너희 고객 아무개 소유인가" — 주소↔계정은 월렛이 답하고, 실명 대조는 그 데이터를 가진 서비스에 이어 조회한 결과를 합쳐 돌려준다.

```bash
curl -X POST "https://{walletBaseUrl}/internal/compliance/address-attribution" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x896B...0b9b",
    "asset": "ETH",
    "name": "Bruce Wayne"
  }'
```

**요청 본문**

```json
{
  "address": "0x896B...0b9b",
  "asset": "ETH",
  "name": "Bruce Wayne"
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `address` | string | 필수 | 확인 대상 주소 |
| `asset` | string | 필수 | 자산 심볼 — 같은 주소 문자열이 여러 체인에 있을 수 있어 체인 특정에 쓴다 |
| `name` | string | - | 상대가 대조를 요청한 실명 (있으면) |

**응답**

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
| `owned` | boolean | 필수 | 우리 고객의 주소인가 — `false` 는 "아니다"라는 확정 답 |
| `accountId` | string (null 가능) | - | 귀속 계정 |
| `nameMatched` | boolean (null 가능) | - | 실명 대조 결과 — `name` 이 안 왔으면 null |

**요구사항**

- **확정 답만 준다** — 실명 데이터 서비스 장애 등으로 확인이 불가하면 `owned: false` 가 아니라 **에러(`INTERNAL` 등)로 응답**한다. `false` 는 상대에게 거절로 회신되는 확정 답이다.
- **무저장** — `name` 은 대조에만 쓰고 저장·로그에 남기지 않는다 (PII).
- **응답 시간** — 상대 VASP 의 동기 왕복이 이 응답을 기다린다. 제한 값은 미정([트래블룰 4장](../../트래블룰/설계/04-policy-and-timing.md) 국내 시간 규칙과 함께).
- **대조 항목의 확장** — 이름 외 항목(생년월일 등)이 요구되는지는 Enclave 콜백 페이로드 확인 후 확정(아래 미확정).

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

verdict 의 값 — 솔루션 원어를 이 넷으로 번역한다 ([트래블룰 8장](../../트래블룰/설계/08-gate-port.md)).

| 값 | 뜻 |
|---|---|
| `NOT_REQUIRED` | 트래블룰 대상 아님 — 한국 기준(원화 100만원) 미만이거나 솔루션이 수취를 개인지갑으로 판별 |
| `APPROVED` | 통과 — 정보 교환·검증이 승인됐다 |
| `PENDING` | 아직 결과가 없다 — 결과가 나면 큐 이벤트(`withdrawal-check.settled`)로 알린다 |
| `REJECTED` | 거절 — 상대 거절 또는 PENDING 만료 |

### Counterparty

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `counterpartyId` | string | 필수 | 거래소 식별자 — 고객이 고른 항목의 이 값을 Create Withdrawal Check 에 그대로 넘긴다 |
| `name` | string | 필수 | 표시명 |
| `reachable` | boolean | 필수 | 이 거래소로 지금 트래블룰 확인을 보낼 수 있는가 — 마지막 동기화 기준. 최종 확인은 Create Withdrawal Check 에서 |

### Beneficiary

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `name` | string | 필수 | 수취인 이름 |
| `accountNumber` | string | 필수 | 수취 계좌(주소) |
| `counterpartyId` | string (null 가능) | - | 수취 거래소 — 거래소 목록(List Counterparties)에서 고른 값 |

### WithdrawalCheck

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `checkId` | string | 필수 | check 식별자 — 서비스가 발급 |
| `externalTxId` | string | 필수 | 월렛 DB 의 출금 건 식별자 (멱등 키) |
| `accountId` | string | 필수 | 계정 ID |
| `verdict` | TrVerdict | 필수 | 현재 verdict |
| `travelRuleMessage` | string (null 가능) | - | 제출 시 실어 보내는 암호화 메시지 — Notabene 경로만 값, 없는 솔루션은 null. 월렛은 내용을 해석하지 않는다 |
| `evidence` | Evidence (null 가능) | - | 통과 증적 — 결과가 나기 전이면 null |

### Evidence

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `kind` | string | 필수 | 증적 종류 — 솔루션별 목록은 미확정(아래) |
| `ref` | string | 필수 | 증적 참조 (예: 사전 승인 참조) |
| `settledAt` | string (ISO 8601) | 필수 | 결과가 난 시각 |

### DepositCheckResult

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `senderVerified` | string | 필수 | 송신측 검증 유무 능동 조회 결과 — 아래 값 |
| `counterpartyName` | string (null 가능) | - | 식별된 송신 VASP (있으면) |

`senderVerified` 값:

| 값 | 뜻 |
|---|---|
| `VERIFIED` | 송신측이 사전 검증을 했음이 확인됨 — 대기함 대조 또는 능동 조회 |
| `NOT_FOUND` | 송신측에 검증 기록 없음 |
| `UNAVAILABLE` | 확인 불가 — 대조 기록이 없고 TXID 역추적도 안 되는 솔루션 |

### SettledEvent

큐로 오는 비동기 확인 결과 이벤트 (HTTP 응답이 아니라 `compliance` 토픽으로 전달). settled = check 가 최종 결과(APPROVED·REJECTED — PENDING 만료 포함)에 도달해 더는 바뀌지 않는다.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `type` | string | 필수 | `withdrawal-check.settled` |
| `checkId` | string | 필수 | check 식별자 |
| `externalTxId` | string | 필수 | 월렛 DB 의 출금 건 식별자 |
| `accountId` | string | 필수 | 파티션 키 |
| `verdict` | TrVerdict | 필수 | `APPROVED` 또는 `REJECTED` (PENDING 만료 포함) |
| `settledAt` | string (ISO 8601) | 필수 | 결과가 난 시각 |

## 미확정

- **원화 임계 판단의 위치** — 벤더 지원 여부 미확정([트래블룰 14장](../../트래블룰/설계/14-fireblocks-questions.md) 문의 1). 어느 쪽이든 이 API 표면(verdict)은 바뀌지 않는다.
- **Evidence.kind 목록** — 솔루션별 증적 종류 확정 후 enum 으로 못 박는다.
- **인증 방식** — 서비스 간 인증(월렛↔컴플라이언스·내부 API)은 인프라 결정과 함께 확정.
- **대기함 대조 규칙** — 키 조합(txHash 우선 · 주소·금액 일치 범위)은 구현 전 확정.
- **Enclave 콜백 페이로드** — 수신 질문에 어떤 필드가 평문으로 오는지(실명 외 항목 포함 여부) — Enclave 설치 검증 때 확정.
