---
title: 블록체인 매니저 — 가스 대납 PoC·출시 기준
status: Done
date: 2026-08-19
view: grid
group: 검증과 출시
---

# 확인된 범위와 출시 전 검증

2026-08-10 Approve Batch Sweep PoC는 Fireblocks의 Contract Call 제출·Network Records·부분 실패 대사를 확인했지만 Universal Gasless를 사용하지 않았다. Vault에 Sepolia ETH를 직접 넣었으므로 Gasless Contract Call, EIP-7702 Upgrade와 Relay 처리 결과는 별도 PoC가 필요하다.

## 현재 확인된 내용

| 항목 | 상태 | 근거 |
|---|---|---|
| `approve` 제출 | 확인 | `CONTRACT_CALL`로 제출하고 조회 시 `operation=APPROVE`로 분류 |
| `batchSweep` 실행 | 확인 | 운영 Vault의 Contract Call 한 건으로 여러 Vault 이동 |
| Network Records | 확인 | 성공한 원천 Vault·자산·금액 귀속 |
| 부분 실패 | 확인 | 최상위 거래 완료와 Leg 실패가 함께 존재 가능 |
| Universal Gasless Transfer | 미확인 | 기존 PoC에서 기본 자산 직접 사용 |
| Gasless `approve` | 미확인 | Contract Call과 Upgrade·Policy 결합 필요 |
| Gasless `batchSweep` | 미확인 | Relay·`msg.sender`·처리량 확인 필요 |
| TAP·Callback | 미확인 | Approve 분류와 Amount·Spender 검증 실측 필요 |

기존 실측 원문은 [Approve Batch Sweep PoC](../../BC/설계/95-approve-pull-poc-result.md)에 보존한다.

## 벤더 확인 항목

| 항목 | 확인할 내용 |
|---|---|
| 지원 범위 | 운영 Network·Asset·Transfer·Contract Call의 Universal Gasless 지원 |
| MPC와 EIP-7702 | Vault MPC 키가 Authorization Tuple을 만드는 절차와 승인 경로 |
| Delegate Code | 주소·공개 여부·Bytecode Hash·감사 보고서·버전 변경 통지 |
| 위임 조회·해제 | Vault별 Delegate 상태 조회, 0 주소 해제, 장애 시 복구 절차 |
| Policy | Upgrade Policy·Gasless Orchestrator·Initiator와 Signer 분리 |
| Contract Call | `approve`·`batchSweep`의 `useGasless` 처리와 Policy 매칭 |
| `msg.sender` | Gasless Batch 호출에서 Sweep 컨트랙트가 관찰하는 호출자 |
| 처리량 | Relay TPS·동시성·Rate Limit·대량 Vault 첫 Upgrade |
| RBF | Manual Boost API·권한·교체 상태·비용 식별 |
| 청구 자료 | 거래별 Relay 사용 내역과 월 인보이스 연결 필드 |

## Sandbox 시나리오

### 1. Transfer

- Upgrade 전 고객 Vault에서 Gasless 토큰 Transfer
- 첫 거래 완료 뒤 주소·키 불변 확인
- Delegate Code와 Upgrade 거래 연결
- 두 번째 거래에서 추가 Upgrade가 발생하지 않는지 확인

### 2. Approve

- 고객 Vault에서 `approve` Contract Call을 `useGasless: true`로 제출
- Fireblocks 조회 Operation과 TAP Rule 매칭 확인
- Spender·금액 상한·토큰 컨트랙트 제한 확인
- Callback Handler가 calldata를 동일하게 해석하는지 확인

### 3. Batch Sweep

- 운영 Vault의 `batchSweep` Contract Call을 Gasless로 제출
- Sweep 컨트랙트의 `msg.sender`가 등록 운영자와 일치하는지 확인
- 성공·부분 실패 Leg와 Network Records·컨트랙트 이벤트 대사
- 배치 크기 증가에 따른 Gas·Relay 지연·Webhook 지연 측정

### 4. 실패와 복구

- Gasless 미설정 Error 1455
- Upgrade Policy 차단
- Relay 거절
- Broadcast 전 Co-signer 실패
- 온체인 Revert
- 장기 Pending과 Manual RBF
- Webhook 누락·역순 뒤 조회 대사
- Fireblocks 접수 응답 유실 뒤 멱등 재시도

### 5. 비용

- 성공 거래의 Receipt 실비와 Relay 사용 내역 일치
- Revert 거래 청구
- Broadcast 전 거절 미청구
- RBF 교체 거래와 원본의 중복 청구 없음
- 월 구독료·가스 실비 분리
- USD 인보이스와 온체인 수수료의 환산 근거 확인

## 출시 기준

- [ ] 운영 대상 Network·Asset·Operation 조합이 계약과 Sandbox에서 모두 확인됐다.
- [ ] 첫 Upgrade·반복 거래·위임 조회·해제 절차가 재현된다.
- [ ] Transfer·Approve·Batch Sweep이 모두 `useGasless: true`로 완료된다.
- [ ] TAP과 Callback이 목적지·토큰·Spender·금액·Calldata를 Fail-close로 검증한다.
- [ ] Gasless 실패 시 직접 지불 자동 Fallback이 발생하지 않는다.
- [ ] Pending 탐지와 Manual RBF가 동일 실행 ID로 수렴한다.
- [ ] 성공·Revert·부분 실패가 고객 원장과 Sweep Leg에 정확히 반영된다.
- [ ] Delegate Code 주소·Hash·감사 자료·변경 통지 절차가 확보됐다.
- [ ] 온체인 실비·Relay 사용 내역·월 인보이스 대사가 재현된다.
- [ ] Relay 장애·지원 중단·계약 종료 시 출금 중지와 복구 Runbook이 있다.

## 단계적 적용

| 단계 | 범위 | 승격 조건 |
|---|---|---|
| Sandbox | 테스트 자산·소수 Vault | 전체 시나리오와 비용 대사 통과 |
| Pilot | 제한된 Network·금액·Vault | Pending·Revert·Upgrade 지표 안정 |
| 확대 | 운영 지원 자산 | Relay 처리량·인보이스 대사 확인 |
| 상시 운영 | 전체 승인 범위 | 정기 Delegate Code·Policy·비용 감사 |

지원 범위가 확인되지 않은 새 체인·자산은 기존 체인의 성공 결과를 근거로 자동 활성화하지 않는다. Network·Asset·Operation 조합마다 출시 게이트를 다시 적용한다.
