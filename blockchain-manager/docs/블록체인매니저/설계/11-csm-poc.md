---
title: 11. CSM/PoC 확인 목록
status: To Do
---

설계 전반에서 벤더(Fireblocks)·relay 로 확정해야 할 항목을 모은다.
각 항목은 확정 전 CSM 문의나 PoC 로 검증하며, 답에 따라 관련 장의 설계가 조정된다.

## 출금 · relay (Universal Gasless)

| 확인 항목 | 왜 중요한가 | 관련 |
|---|---|---|
| relay(Gasless-Orchestrator)가 stuck tx 를 스스로 fee-bump 하나 | 지금 설계는 "미지원 → 우리가 감지·자동 boost 트리거" 전제. 자동 처리면 트리거 로직이 불필요해진다 | 4·6장 |
| gasless 에서 boost·cancel API 동작 방식 | 같은 순번 대체·relay fee 부담·정산이 실제로 어떻게 도는지 | 6장 |
| boost 인상 폭·fee 상한이 relay 설정인지 | 우리가 조절 가능한지, 자동 boost 정책을 어디에 둘지 | 6장 |
| relay 실패 모드·잔고 모니터링 수단 | 잔고 소진·거절 시 거래 실패 처리와 relay 급유 신호 (boost 로 안 풀리는 막힘) | 6장 |

## 서명 · EIP-7702

| 확인 항목 | 왜 중요한가 | 관련 |
|---|---|---|
| MPC(vault 키)가 7702 authorization 서명을 만드는 방식 | 출금 서명 경로의 핵심인데 공식 문서에 상세가 없다 | 6장 · 가스 대납 문서 |
| 위임 대상 지갑 코드의 정체·감사·해제 수단 | 위임 코드가 보안의 전부 — 공개 여부·감사 리포트·위임 조회/해제 | 가스 대납 문서 |

## 다중 vault · nonce

| 확인 항목 | 왜 중요한가 | 관련 |
|---|---|---|
| vault(EOA)별 nonce 직렬이 gasless relay 하에서도 유지되나 | 병렬 레인(다중 출금 vault) 전제의 근거. relay 가 vault 간 병렬 제출을 어떻게 다루는지 | 6장 |

## 확정 · DCCP

| 확인 항목 | 왜 중요한가 | 관련 |
|---|---|---|
| 커스텀 DCCP 임계 제출→검토→승인 절차·소요 | 임계는 Console 직접 설정이 아니라 Fireblocks Support 경유 | 4장 |
| EVM(이더리움·Base) 기본 임계 confirmation 값 | finality 판정 기준 · zero-confirmation 함정과 직결 | 4장 |
