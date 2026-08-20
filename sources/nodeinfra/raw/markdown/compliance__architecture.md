<!--
source_url: https://docs.nodeinfra.com/compliance/architecture
path: /compliance/architecture
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 코디네이터 ↔ 승인자 ↔ HSM ↔ 콘솔 ↔ 원장. 정책 결정이 어디서 나고 어디로 기록되는지.
-->

# 컴플라이언스 아키텍처

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation시작하기컴플라이언스 아키텍처

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

## ​한 장 요약

노드월렛의 컴플라이언스는 **3개의 독립 컴포넌트**로 구성됩니다. 정책은 콘솔에서 관리되고, 결정은 승인자에서 평가되며, 증거는 원장에 영구 기록됩니다.
$!/$

| 컴포넌트 | 역할 | 소유자 |
| --- | --- | --- |
| 컴플라이언스 포털 | 규칙 등록·전환, 결정/지갑 조회, 활동 로그 | 컴플라이언스 팀 (admin/operator/auditor) |
| 승인자(정책 엔진) | 규칙 평가, HSM승인 키co-sign, Held 큐 관리 | 자동 (운영자 개입 없음) |
| 코디네이터 | 평가 컨텍스트 사전계산(잔액·일일누적), 승인자 호출 오케스트레이션 | 자동 |

## ​평가 흐름 (출금 예시)

$!/$
핵심 — **승인자는 ledger를 직접 조회하지 않습니다.** 잔액·일일누적 같은 상태값은 코디네이터가 미리 계산해 `EvaluationContext`로 전달합니다. 이 분리는 정책 엔진의 핫패스를 단순화하고, 잔액 일관성 보장 책임을 원장 트랜잭션 경계에 둡니다.

## ​데이터 모델

### ​approverdb (정책·결정)

| 테이블 | 용도 | 변경 가능 |
| --- | --- | --- |
| policy_rules | 활성 정책 규칙 정의 (10종) | ✓ admin 가능 (변경은policy_change_log에 기록) |
| policy_decisions | 모든 평가 결과의 해시 체인 | ✗ append-only (prevent_mutation()트리거) |
| held_deposits/held_withdrawals | Held 큐 (재평가 대상) | 결정 컬럼 set-once, payload 컬럼 immutable |
| velocity_windows | velocity_window규칙용 슬라이딩 윈도우 카운터 | append-only (INSERT-only 사용) |
| address_first_use | address_cooldown규칙용 최초 사용 시각 | insert-only |
| condition_sets/condition_set_items | address_list·expression규칙이 참조하는 주소 묶음 | ✓ admin 가능 |
| policy_change_log | 정책 변경 감사 로그 (CREATE/UPDATE/DELETE) | ✗ append-only |

### ​auditdb (서명 이벤트)

| 테이블 | 용도 |
| --- | --- |
| signing_events | 체인 서명 이벤트 +approver_decision_rationale(CBOR PolicyDecision) + 해시 체인 |
| key_lifecycle | 키 생성·로테이션·등록 이벤트 |
| master_key_operations | 마스터 KEK 프로비저닝 / TOFU 핀 / 컨피그 서명 증거 |

자세한 컬럼 정의와 해시 체인 구조는 [감사 로그](/security/ops/audit-logs) 와 [내부 cert 팩 — Policy Audit Trail](https://github.com/nodeinfra/nodewallet/blob/master/docs/compliance/policy-audit-trail.md) 참고.

## ​4-축 격리 안에서의 위치

승인자는 [보안 포털의 4-축 격리](/security) 중 **서비스 격리**(축 1)와 **시간·증거 격리**(축 4) 두 축에 동시에 기여합니다.

- **서비스 격리** — `승인 키`는 `개시 키`·`실행 키`와 분리된 HSM 파티션에 격리됩니다. 승인자 호스트가 탈취되어도 PKCS#11 외부로 키 자체는 노출되지 않습니다.
- **시간·증거 격리** — 모든 결정은 `policy_decisions` 의 해시 체인에 기록되며, 후속 `signing_events` 행이 `approver_decision_rationale` 로 결정 CBOR을 재포함합니다. 즉 **결정 → 서명 사이가 사후 변조 불가능한 cross-DB 증거**로 묶입니다.

## ​Hot Reload

규칙 변경은 **재배포 없이 즉시 반영**됩니다.

1. 콘솔/Admin API가 `policy_rules` 에 INSERT/UPDATE → `policy_change_log` 트리거 발화
2. 승인자 `loader` 태스크가 변경을 감지 (`ArcSwap` 기반 핫리로드)
3. 다음 `/v1/evaluate` 호출부터 새 규칙 적용

핫리로드는 **활성 규칙 집합 전체를 원자적으로 교체**합니다. 평가 중인 요청이 절반은 옛 규칙, 절반은 새 규칙을 본다는 race는 발생하지 않습니다.

## ​한계와 비책임

- **승인자는 잔액·재고를 보장하지 않음** — 잔액 부족 검출은 원장(coordinator + ledgerdb)의 책임입니다. 정책 엔진은 사전계산된 잔액을 **참고**할 뿐 권위 있는 상태로 보지 않습니다.
- **승인자는 체인 서명을 하지 않음** — `승인 키` co-sign 만 담당하고, 실제 Solana 트랜잭션 서명은 SGX 엔클레이브의 `실행 키`가 합니다.
- **승인자는 입금을 차단할 수 없음** — 입금 트랜잭션은 이미 체인에 실행된 사건입니다. `flow_type=deposit` 규칙은 **입금 후 후속 스윕**의 정책 결정에 적용되며, 입금 자체는 [입금 검증](https://github.com/nodeinfra/nodewallet/blob/master/docs/design/deposit_verification.md) 단계에서 처리됩니다.
⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
