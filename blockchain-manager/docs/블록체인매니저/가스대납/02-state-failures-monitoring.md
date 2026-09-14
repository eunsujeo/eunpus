---
title: 블록체인 매니저 — 가스 대납 상태·운영
status: Done
view: grid
group: 적용 설계
---

# Relay 상태와 온체인 상태

Gasless 요청에는 Fireblocks 접수, Policy·Relay 승인, 네트워크 전파, 온체인 실행과 비용 청구가 연속해서 발생한다. 블록체인 매니저는 이 신호를 하나의 성공·실패 Boolean으로 합치지 않고 단계별 근거와 공통 TxStatus를 함께 기록한다.

## 단계별 기록

| 단계 | 관찰 근거 | 기록할 식별자·상태 | 비용 |
|---|---|---|---|
| 요청 생성 | 내부 실행 의도 | External Transaction ID·요청 Hash | 없음 |
| Fireblocks 접수 | API 응답 | Fireblocks Transaction ID·접수 시각 | 없음 |
| Policy·Relay 판정 | Fireblocks 상태·SubStatus | 차단·거절·설정 오류 원인 | Broadcast 전이면 없음 |
| 네트워크 전파 | Transaction Hash | 제출 시각·nonce·Network | 가스 소비 가능 |
| Pending | Fireblocks 조회·RPC | 마지막 관찰 블록·체류 시간 | 확정 전 |
| 확정·Revert | Receipt·Fireblocks 완료 상태 | Block·Gas Used·Effective Gas Price·Result | 발생 |
| 월 청구 | Fireblocks 인보이스 | 청구 기간·항목·USD 금액 | 계약 비용 확정 |

공통 TxStatus의 정의와 이벤트 발행은 [상태·이벤트·대사](../개요/05-state-events-reconciliation.md)를 따른다. Gasless 전용 상태를 공통 Enum에 추가하는 대신 Vendor 원인·Relay 단계·비용 상태를 별도 상세로 보존한다.

## 실패 분류

| 실패 | 재시도 전 확인 | 자동 처리 |
|---|---|---|
| Gasless 미설정·Error 1455 | Workspace·Asset·Relay 활성화 | 설정 수정 전 재시도 금지 |
| Policy 차단 | 위반 Rule·요청 Snapshot | 같은 요청 반복 금지 |
| Relay 거절 | Relay 가용성·계약·지원 Operation | 직접 지불 전환 금지 |
| Co-signer 결과 불명 | Fireblocks Transaction ID 존재 여부 | 조회로 복구 |
| Broadcast 결과 불명 | Transaction Hash·nonce·Vendor 조회 | 새 거래 생성 금지 |
| 장기 Pending | nonce·Mempool·Network Fee | 운영 승인 후 RBF |
| 온체인 Revert | Receipt·Revert 원인·Allowance·Contract 상태 | 원인 수정 후 새 실행 의도 |
| Webhook 누락·역순 | 조회 API·Checkpoint | 주기 대사로 수렴 |

## Pending과 RBF

Fireblocks Gasless Relay는 자동 Boost를 제공하지 않는다. 장기 Pending 거래는 일반 거래와 같은 Stuck 탐지 작업에서 찾고, 다음 순서로 처리한다.

1. Fireblocks Transaction ID와 Transaction Hash를 조회한다.
2. 동일 nonce의 확정·교체 거래가 있는지 확인한다.
3. 체인별 체류 기준과 현재 수수료를 확인한다.
4. 운영 권한으로 RBF Boost를 요청한다.
5. 원본과 교체 거래를 같은 실행 건으로 연결한다.
6. 최종 Receipt와 Fireblocks 상태를 대사한다.

RBF 요청을 새 고객 출금으로 발행하지 않는다. 교체 거래는 같은 nonce와 업무 실행 ID를 사용하며 고객 원장 이벤트도 최종 결과 한 번으로 수렴해야 한다.

## 비용 발생 상태

```mermaid
stateDiagram-v2
    [*] --> Requested
    Requested --> PreBroadcastRejected: 설정·Policy·Relay 거절
    Requested --> Broadcast: 네트워크 전파
    Broadcast --> Pending
    Pending --> Replaced: RBF
    Replaced --> Finalized
    Pending --> Finalized
    Pending --> Reverted
    PreBroadcastRejected --> [*]
    Finalized --> Invoiced
    Reverted --> Invoiced
    Invoiced --> Reconciled
```

- Pre-Broadcast Rejected: 네트워크 비용 없음
- Finalized: 확정 Receipt의 실비가 청구 대상
- Reverted: 자산 이동은 실패했지만 소비 가스는 청구 대상
- Replaced: 최종 포함된 교체 거래의 비용을 대사
- Invoiced: 월 구독료와 가스 실비를 분리

## Relay 수수료 필드 처리

다음은 2026-09-14 사용자가 전달한 [다른 사람의 Fireblocks 질의응답](../../../sources/fireblocks-support/2026-09-14__gasless-feeinfo-third-party-qna.md)에 따른다. 우리 Workspace의 실측 결과는 아니므로 [Gasless PoC](03-poc-and-release-gates.md)에서 재현을 확인한다.

| 필드·응답 | 담당자 설명과 처리 기준 |
|---|---|
| `feeInfo` | Relay가 대납한 가스비도 포함한다. 수수료는 이 객체에서 읽는다. |
| 최상위 `fee` | 폐기 예정 필드. Gasless REST 응답에서는 빠졌지만 Webhook에는 남아 있으므로 수수료 처리 기준으로 쓰지 않는다. |
| Relay 식별 정보 | Relay의 Contract Call뿐 아니라 고객 거래에도 생성 시 연결된다. Webhook에서 `paidByRelay: true`, `relayId`, `relayType`, `relayName`을 받는다. |
| Webhook `relayType` | Self-relay도 항상 `THIRD_PARTY`로 반환된다는 설명이다. `LOCAL`과 `THIRD_PARTY` 구분은 REST 단건 조회(`GET /transactions/{id}`, 답변 표기)를 사용한다. |
| `relayName` | Relay Workspace의 표시 이름이다. 특정 문자열로 Relay 종류를 판별하지 않는다. |
| `relayId` | Relay Workspace 안의 Vault Account ID다. Fireblocks-managed Relay ID를 우리 Workspace의 Vault ID로 조회하지 않고 식별자로 보존한다. |
| `feeUSD` | 표시 전용 값이다. 누락될 수 있으며 정산·인보이스 대사 금액으로 쓰지 않는다. |

온체인 Revert는 `FAILED` 처리 전에 실제 소비한 가스비가 기록되므로 `feeInfo`에 실비가 남는다. 실패 상태만 보고 비용을 0으로 덮어쓰지 않는다. 체인에 도달하지 않은 거래에서 쓰는 `-1`은 **최상위 `fee`에만** 해당한다. `feeInfo` 내부의 미확인 값은 `-1` 대신 필드가 생략되므로, 누락과 실제 0을 구분한다. 위 답변은 정확한 JSON 중첩 구조를 제공하지 않았으므로 필드 경로는 실제 payload로 확인한다.

## 모니터링

| 지표·경보 | 목적 |
|---|---|
| Error 1455·Relay 거절 증가 | 설정·지원 범위·벤더 장애 탐지 |
| Policy 차단 Rule별 건수 | 잘못된 요청과 Policy 변경 영향 구분 |
| Fireblocks 접수 후 Hash 미생성 시간 | 서명·Relay 단계 정체 탐지 |
| Network·Operation별 Pending P95·최대 | Stuck 임계 조정 |
| RBF·Revert 비율 | 수수료 정책·컨트랙트 실패 감시 |
| 첫 Upgrade 실패율 | EIP-7702·Policy·Co-signer 결합 문제 탐지 |
| Webhook 지연·누락·역순 | 이벤트 수렴 상태 확인 |
| Gas Used·Effective Gas Price | 체인 실비 계산 |
| 월 인보이스 미대사 금액·건수 | 청구 오류·식별자 누락 탐지 |

## 비용 대사

블록체인 매니저는 거래 실행 근거를 제공하고, 회계 정산 시스템이 월 인보이스와 연결한다.

**`feeUSD` 합계를 인보이스 금액으로 사용하지 않는다.** 위 담당자 답변에 따르면 `feeUSD`의 USD 환율은 거래 생성 시점에 저장한 캐시 현물 시세이고, 가스 사용량은 확정 시점에 결정된다. 환율 조회 실패 시 값이 없을 수도 있다. 월 가스비 상환은 실제 가스 소비를 기준으로 별도 재무 절차에서 계산하며 `feeUSD`를 사용하지 않는다. 정산용 환율의 출처·기준 시각과 인보이스 연결 필드는 여전히 확인이 필요하다.

대사 키에는 다음 정보가 필요하다.

- 내부 실행 ID·External Transaction ID
- Fireblocks Transaction ID
- Transaction Hash·Network·nonce
- 최종 Receipt의 Gas Used·Effective Gas Price
- 성공·Revert·RBF 관계
- Fireblocks 청구 기간과 인보이스 항목

월 구독료는 특정 거래의 Network Fee로 배분하지 않는다. 고객 과금에 포함할 경우 DAW-CORE의 별도 배부 정책이 필요하다.

## 장애 시 금지 사항

- Gasless 장애를 이유로 모든 거래를 `useGasless: false`로 전환
- Fireblocks 접수 결과가 불명확한 상태에서 새 External Transaction ID 발급
- Pending 거래를 실패로 끝내고 동일 출금을 새 nonce로 제출
- Revert 거래의 가스비를 성공 거래 비용에서 누락
- 월 인보이스 금액을 온체인 Receipt 대사 없이 고객에게 전가
