---
title: 가스 대납 — 보안·비용
status: Done
date: 2026-08-19
view: grid
group: 보안과 비용
---

# 대납 거래의 실패와 비용

가스 대납은 기본 자산 조달을 줄이지만 Relay·위임 코드·대납 정책·비용 정산 요소가 추가된다. 실패가 체인 전파 전인지, Pending 이후인지, 온체인 실행 중인지에 따라 비용 발생 여부가 달라진다.

## 실패 시점과 비용 발생

| 시점 | 예시 | 온체인 가스 소비 |
|---|---|---|
| 요청 검증 전 | 필수 필드·지원 자산·Gasless 설정 오류 | 없음 |
| Policy·Relay 검증 | Policy 차단·Relay 거절·잔고 부족 | 없음 |
| 서명·거래 생성 | Co-signer 장애·Upgrade 승인 실패 | 없음 |
| 네트워크 전파 후 Pending | 수수료 부족·nonce 대기·네트워크 혼잡 | 아직 확정되지 않음 |
| 온체인 Revert | 컨트랙트 조건 실패·Allowance 부족 | 발생 |
| 확정 | 토큰 이동 완료 | 발생 |

Fireblocks 담당자의 2026-08-18 개별 답변에 따르면 Fireblocks Relay에서 온체인 Revert는 네트워크가 가스를 소비했으므로 청구되고, Policy·검증 단계에서 Broadcast 전에 차단된 요청은 네트워크 비용이 발생하지 않는다. [Fireblocks Gasless Relay 공식 문서](https://support.fireblocks.io/hc/en-us/articles/23508430639516-Using-the-Fireblocks-Gasless-Relay)는 Relay의 가스 선지불·월말 통합 청구와 자동 boost 미지원을 별도로 설명한다.

## Pending과 RBF

Fireblocks Gasless Relay는 Stuck 거래를 자동 Boost하지 않는다. RBF는 동일 nonce의 교체 거래를 사용하는 방식이다.

같은 nonce의 RBF 교체 거래가 확정되면 원본과 교체분을 두 건의 독립 실행으로 합산하지 않는다. 담당자 답변 기준 Fireblocks Relay 청구에는 실제 네트워크에 포함된 교체 거래 비용이 반영되며, 대체된 원본을 중복 청구하지 않는다.

## EIP-7702 위임 상태

EIP-7702 위임은 거래 옵션이 아니라 계정 코드 상태다. Delegation Indicator에는 `0xef0100` 뒤에 Delegate 주소가 기록되며, 0 주소 해제나 새 코드 재위임으로 상태가 바뀔 수 있다.

[EIP-7702 명세](https://eips.ethereum.org/EIPS/eip-7702)는 위임 코드가 계정에 제한 없이 접근할 수 있으므로 Wallet이 임의 코드 Authorization 서명을 제공해서는 안 된다고 경고한다.

## Relay와 Paymaster 보안

| 경계 | 주요 위험 |
|---|---|
| Relay Policy | 허용되지 않은 자산·목적지·호출 대납 |
| Relay 자금 | 잔고 고갈·비용 폭증 |
| Paymaster | 검증 DoS·예치금 고갈 |
| Co-signer | 자동 승인 경로 침해 |
| Delegate Code | 계정 권한 탈취·업그레이드 위험 |
| Fallback | Gasless 실패 후 중복 일반 거래 |

## 비용 정산

같은 담당자 답변에서 Fireblocks-managed Relay 과금은 다음과 같이 확인됐다.

| 항목 | 확인된 조건 |
|---|---|
| 선지불 | Fireblocks가 네트워크 가스비를 먼저 지불 |
| 청구 주기 | 월말 통합 인보이스 |
| 통화 | USD, 기존 Fireblocks 계약 결제 절차 |
| 가스 단가 | 당시 네트워크 Base Fee·Priority Fee와 실제 Gas Used |
| 가스 마크업 | 없음 |
| 서비스 비용 | 별도 월 구독료 |
| 건별 Relay 수수료 | 없음 |
| 건별 가스 상한 | Fireblocks Relay 사용 시 지정 불가 |

계약 조건은 Workspace·계약 시점에 따라 달라질 수 있으므로 청구서와 활성 계약을 정본으로 삼는다.
