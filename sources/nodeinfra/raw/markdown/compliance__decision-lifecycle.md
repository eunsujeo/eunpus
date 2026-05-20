<!--
source_url: https://docs.nodeinfra.com/compliance/decision-lifecycle
path: /compliance/decision-lifecycle
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: Allow · Held · Deny 3가지 판정, 우선순위 평가, short-circuit, Held 큐 재평가, hot reload.
-->

# 결정 라이프사이클

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation시작하기결정 라이프사이클

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

## ​3가지 판정 결과

승인자는 매 요청에 대해 정확히 하나의 결정을 반환합니다. `shadow_mode`(관찰 전용 모드)는 **없습니다** — 모든 Deny 는 실제 차단으로 집행됩니다.

| 결정 | 의미 | 코디네이터 동작 |
| --- | --- | --- |
| Allow | 모든 활성 규칙 통과. 승인자가승인 키로 co-sign. | 엔클레이브에 전달 → 체인 서명 |
| Deny | 한 개 이상 규칙이 위반.triggered_rules에 위반 규칙 기록. | 호출자에 400 반환, 체인 서명 단계 미도달 |
| Held | 자동 결정 불가. 요청을held_*테이블에 보관 후 코디네이터의 polling 으로 재평가. | /v1/poll폴링 루프 진입 |

내부적으로는 `Verdict` (rule 단위) 와 `PolicyDecision` (전체 결정) 두 enum 이 있습니다. Allow 는 wire format 에서 `AutoApprove` 로 직렬화됩니다.

## ​우선순위 평가 · Short-Circuit

활성 규칙은 `priority` 오름차순으로 평가됩니다. **첫 번째 Deny 또는 Held 에서 즉시 반환** — 뒤따르는 규칙은 평가하지 않습니다.
$!/$
**우선순위 설계 가이드**

- **10~19** — 사고 대응 (`global_halt`). 다른 모든 검사를 우회해야 하므로 최저값.
- **20~39** — 정적 차단 (`address_list` denylist, `time_window`). DB 조회가 가볍거나 없음.
- **40~59** — 한도 (`per_tx_amount_limit`, `daily_withdrawal_limit`, `velocity_limit`).
- **60~79** — 동적 차단 (`address_cooldown`, `velocity_window`). DB 조회 필요.
- **80~99** — 수동 게이트 (`approval_tier`). 위에서 다 통과한 경우만 의미 있음.
- **100+** — 커스텀 (`expression`).

같은 priority 끼리는 평가 순서가 보장되지 않습니다 — 의존 관계가 있는 규칙은 priority 를 다르게 두세요.

## ​Held — 자동 결정 보류

`Held` 는 “지금 결정할 수 없으니 나중에 다시 검토하자” 라는 신호입니다. 이를 반환하는 규칙은 두 개입니다.

| 규칙 | Held 발화 조건 |
| --- | --- |
| address_cooldown | 출금 주소가 최근에 처음 사용됐고 금액이 threshold 초과 — 일정 시간 후 자동 해소 |
| approval_tier | 금액 구간이 수동 승인 모드 (SINGLE_APPROVE/QUORUM_2_OF_3) 에 해당 — 운영자의 별도 채널 승인 필요 |

### ​재평가 루프

$!/$
**중요한 성질**

- **Sticky decision** — 한번 `AUTO_APPROVE` 또는 `DENY` 로 전환되면 다시 `HELD` 로 돌아가지 않습니다. DB 트리거가 강제합니다.
- **Set-once approver 서명** — `auth_approver_sig` / `auth_approver_pubkey` 컬럼은 한번 INSERT 되면 변경 불가. 동일 요청에 대해 서로 다른 두 서명이 존재할 수 없습니다.
- **24h TTL** — 폴링은 기본 24시간까지. 그 안에 Allow/Deny 로 결정되지 않으면 코디네이터가 Deny 처리.
- **Idempotent** — `(initiator_pubkey, nonce)` 키로 중복 호출 방지 (`initiator_nonce_seen` 테이블).

### ​수동 승인 없는 이유

`Held` 는 운영자가 콘솔에서 “승인” 버튼을 눌러 해제하지 **않습니다**. 두 가지 이유 때문입니다.

1. **권한 분리** — 정책 엔진이 정책 키를 가지므로, 운영자가 정책 엔진의 결정을 우회할 수 있다면 정책 엔진의 의미가 무너집니다. 운영자가 결정을 바꾸려면 **규칙 자체를 수정**해야 합니다 (이건 변경 감사 로그에 남습니다).
2. **결정론적 재평가** — 동일한 입력 + 동일한 규칙 집합 → 동일한 결정. Held 가 풀리려면 시간(`address_cooldown`)·규칙 변경(`approval_tier` 한도 상향)·외부 상태(`velocity_window` 의 시간 경과) 중 하나가 바뀌어야 합니다.

따라서 `approval_tier` 의 `SINGLE_APPROVE` / `QUORUM_2_OF_3` 모드는 **외부 승인 채널**(예: 별도 의식·운영자 회의 후 한도 조정)을 거쳐 규칙을 일시 수정한 뒤 폴링이 자동으로 해소되는 방식으로 동작합니다.

## ​평가에 입력되는 컨텍스트

승인자는 ledger를 직접 조회하지 않습니다. 모든 상태값은 코디네이터가 미리 계산해 `EvaluationContext` 로 전달합니다.

```
pub struct PolicyContext {
    pub flow_type: FlowType,        // Withdrawal / Deposit / Transfer
    pub request_id: Uuid,
    pub wallet_id: Uuid,
    pub destination: String,
    pub amount: i64,
    pub fee: i64,
    pub mint: String,               // "NATIVE_SOL" 또는 SPL mint 주소
    pub context: EvaluationContext,
}

pub struct EvaluationContext {
    pub daily_withdrawal_total: Option<i64>,  // 오늘 누적 출금 (lamports)
    pub daily_withdrawal_count: Option<i64>,  // 오늘 누적 출금 건수
    pub account_balance: Option<i64>,         // 현재 잔액
}
```

규칙이 `EvaluationContext` 의 필드를 필요로 하지만 `None` 이라면, 규칙은 `PolicyError` 를 반환하고 결정은 fail-closed (Deny) 로 처리됩니다.

## ​Hot Reload

규칙 변경은 재배포 없이 반영됩니다. 구체적인 메커니즘:

1. Admin API (`POST/PUT/DELETE /v1/admin/policies/...`) 또는 콘솔에서 `policy_rules` 변경
2. DB 트리거가 `policy_change_log` 에 변경을 INSERT (created_by, old_data, new_data 모두 기록)
3. 승인자의 `loader` 태스크가 변경을 감지 — 새 규칙 집합을 빌드해 `ArcSwap` 에 원자적 교체
4. 다음 `/v1/evaluate` 호출부터 새 규칙 적용

**일관성 보장** — 평가 중인 단일 요청은 평가 시작 시점의 규칙 스냅샷을 끝까지 사용합니다. 평가 도중 규칙이 바뀌어 “절반은 옛 규칙, 절반은 새 규칙” 으로 보는 일은 없습니다.

## ​fail-closed

승인자가 다음 상황에 처하면 **거부(Deny) 로 처리**합니다 (fail-open 아님).

- DB 연결 실패
- 규칙 평가 중 패닉 또는 `PolicyError`
- 필수 `EvaluationContext` 필드 누락
- HSM 응답 실패 (`승인 키` co-sign 실패)
- 호출자 서명 검증 실패

운영 관점에서는 승인자 장애 = 출금 정지. 이는 의도된 안전 기본값입니다.⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
