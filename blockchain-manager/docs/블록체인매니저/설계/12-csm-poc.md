---
title: 12. 확인·정합 목록
status: Done
---

설계 전반에서 빌드 전 확정해야 할 항목을 모은다 — 벤더(Fireblocks)·relay 로 검증할 것과, 백엔드와 계약으로 합의할 것.
앞 절들은 CSM 문의·PoC 로 검증하고 마지막 절은 백엔드와 정합하며, 답·합의에 따라 관련 장의 설계가 조정된다.

## 벤더 · relay 확정 (CSM/PoC)

### 출금 · relay (Universal Gasless)

| 확인 항목 | 왜 중요한가 | 관련 |
|---|---|---|
| relay(Gasless-Orchestrator)가 stuck tx 를 스스로 fee-bump 하나 | 지금 설계는 "미지원 → 우리가 감지·자동 boost 트리거" 전제. 자동 처리면 트리거 로직이 불필요해진다 | 4·6장 |
| gasless 에서 boost·cancel API 동작 방식 | 호출부는 **확인됨**(csm2): `createTransaction`+`replaceTxByHash`(RBF·같은 nonce)·`externalTxId` 재사용 가능·결과 type 변경은 CONTRACT_CALL 만. 잔여 = relay fee 부담·정산 흐름 | 6장 |
| boost 인상 폭·fee 상한이 relay 설정인지 | 우리가 조절 가능한지, 자동 boost 정책을 어디에 둘지 | 6장 |
| relay 실패 모드·잔고 모니터링 수단 | 잔고 소진·거절 시 거래 실패 처리와 relay 급유 신호 (boost 로 안 풀리는 막힘) | 6장 |
| **boost/drop 을 승인 단계에서 원본과 연결** (이중 주체 승인) | 승인 콜백엔 `replaceTxByHash`·원 txId·nonce 가 없어 **approver 가 boost/drop 인지 판별 불가**(csm2). 현행 우회 = "Get Transaction by ID" 의 `replacedTxHash`. 콜백 payload 포함은 **Fireblocks feature request open** | 6장 |

### 서명 · EIP-7702

| 확인 항목 | 왜 중요한가 | 관련 |
|---|---|---|
| MPC(vault 키)가 7702 authorization 서명을 만드는 방식 | 출금 서명 경로의 핵심인데 공식 문서에 상세가 없다 | 6장 · 가스 대납 문서 |
| 위임 대상 지갑 코드의 정체·감사·해제 수단 | 위임 코드가 보안의 전부 — 공개 여부·감사 리포트·위임 조회/해제 | 가스 대납 문서 |

### 다중 vault · nonce

| 확인 항목 | 왜 중요한가 | 관련 |
|---|---|---|
| vault(EOA)별 nonce 직렬이 gasless relay 하에서도 유지되나 | 병렬 레인(다중 출금 vault) 전제의 근거. relay 가 vault 간 병렬 제출을 어떻게 다루는지 | 6장 |

### 확정 · DCCP

| 확인 항목 | 왜 중요한가 | 관련 |
|---|---|---|
| 커스텀 DCCP 임계 제출→검토→승인 절차·소요 | 임계는 Console 직접 설정이 아니라 Fireblocks Support 경유 | 4장 |
| EVM(이더리움·Base) 기본 임계 confirmation 값 | finality 판정 기준 · zero-confirmation 함정과 직결 | 4장 |

## 백엔드와 정합 (상태 계약)

매니저가 큐로 흘리는 상태를 백엔드가 어떻게 읽고 원장에 반영할지는 **계약으로 합의**해야 한다 — 벤더 확인과 달리 우리 두 팀 사이의 약속이다.
확정된 enum·필드 정본은 이후 API 문서에 한 곳으로 모으고, 여기서는 **무엇을 합의할지**만 잡는다.

| 정합 항목 | 왜 정해야 하나 | 관련 |
|---|---|---|
| 공통 상태 5종 의미 | 백엔드가 잔액·화면을 SUBMITTED·CONFIRMING·COMPLETED·REJECTED·FAILED 다섯에만 맞춘다 — **COMPLETED = DCCP 임계 도달(finality)**, **REJECTED = 임시(unfreeze 대기) ≠ FAILED = 영구** 라는 합의 | 4·5·6장 |
| status·subStatus·networkStatus 세 축 역할 분담 | 백엔드가 어느 필드로 무엇을 판단할지 — **boost = networkStatus `DROPPED`(mempool 누락)**, **reorg 롤백 = subStatus `DROPPED_BY_BLOCKCHAIN`(블록 이탈)** | 4장 |
| reorg 무효화 수신 시 원장 롤백 계약 | 무효화 이벤트에 백엔드가 **반영해 둔 잔액만 되돌리고 입금 기록은 보존** — 되돌림 범위·순서 합의 | 5장 |
| REJECTED 동결 3종의 unfreeze 운영 흐름 | `AUTO_FREEZE`·`FROZEN_MANUALLY`·`REJECTED_AML_SCREENING` 자산 잠금을 백엔드가 어떻게 노출하고 Admin unfreeze 를 어떻게 대기하나 | 5장 |
| subStatus 최소 분기 집합 | 수십 종 중 백엔드가 실제로 분기할 것만 정하고 나머지는 로깅 — 분기 대상 목록 합의 | 5·6장 |
| 내부 이체 sweep/delta 재분류 | 매니저는 `INTERNAL` 까지만 준다(업무 의도 모름) — 정산 컨슈머가 **externalTxId 로 원래 요청을 찾아** sweep·delta 를 가르는 규약 | 4·10장 |
| 토픽·파티션 키·컨슈머 그룹 + 경보 채널 | `deposit`·`withdrawal`·`internal` 토픽별 이벤트 스키마·파티션 키·컨슈머 그룹, 그리고 막힘 경보를 흘릴 별도 채널 수단 | 4장 |
