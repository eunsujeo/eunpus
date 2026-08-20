<!--
source_url: https://docs.nodeinfra.com/compliance/rules/approval-tier
path: /compliance/rules/approval-tier
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 금액 구간에 따라 자동 / 단일 승인 / 2-of-3 의식 승인. 일정 금액 이상은 Held → 외부 채널 승인 후 해소.
-->

# approval_tier — 금액 구간별 수동 승인

## 한 줄 요약

`amount` 가 `[min_amount_lamports, max_amount_lamports]` 구간에 들면, `approval_mode` 에 따라 다음 동작:

- `AUTO` → Allow (자동 승인)
- `SINGLE_APPROVE` → **Held** (단일 운영자 외부 승인 필요)
- `QUORUM_2_OF_3` → **Held** (3인 중 2인 의식 승인 필요)

구간에 들지 않으면 Allow (passthrough — 다른 규칙이 검사).

## Config 스키마

```
{
  "min_amount_lamports": 0,
  "max_amount_lamports": 5000000000,
  "approval_mode": "AUTO"
}
```

| 필드 | 타입 | 필수 | 의미 |
| --- | --- | --- | --- |
| min_amount_lamports | integer (i64) | ✓ | 구간 최소 (이상) |
| max_amount_lamports | integer (i64) | ✓ | 구간 최대 (이하) |
| approval_mode | string | ✓ | "AUTO"/"SINGLE_APPROVE"/"QUORUM_2_OF_3" |

## 평가 로직

```
fn evaluate(ctx):
    if not (config.min_amount <= ctx.amount <= config.max_amount):
        return Allow  # 다른 구간 — 이 규칙 적용 안 함
    match config.approval_mode:
        "AUTO" => return Allow
        "SINGLE_APPROVE" => return Held("requires single-operator approval")
        "QUORUM_2_OF_3" => return Held("requires 2-of-3 quorum approval")
        _ => return Held("unknown approval mode")
```

DB 조회 없음. 입력 amount 만 검사.

## 적용 가능한 Flow

- ✅ `withdrawal` — 가장 일반적
- ✅ `transfer` — 고액 내부 이체 수동 승인
- ⚠️ `deposit` — 스윕 시점에 적용 가능, 다만 입금 자체는 차단 불가

## 사용 패턴 — 다중 구간 (계층 한도)

여러 행으로 등록해 **구간별 정책**을 구성합니다. 각 행은 priority 가 같아도 무방 — 구간이 겹치지 않으면 한 행만 매치.

```
// 0 ~ 5 SOL : 자동 승인
{
  "rule_type": "approval_tier",
  "mint": "NATIVE_SOL",
  "priority": 80,
  "config": {
    "min_amount_lamports": 0,
    "max_amount_lamports": 5000000000,
    "approval_mode": "AUTO"
  }
}

// 5 ~ 50 SOL : 단일 승인
{
  "rule_type": "approval_tier",
  "mint": "NATIVE_SOL",
  "priority": 80,
  "config": {
    "min_amount_lamports": 5000000001,
    "max_amount_lamports": 50000000000,
    "approval_mode": "SINGLE_APPROVE"
  }
}

// 50 SOL 초과 : 2-of-3 의식
{
  "rule_type": "approval_tier",
  "mint": "NATIVE_SOL",
  "priority": 80,
  "config": {
    "min_amount_lamports": 50000000001,
    "max_amount_lamports": 9223372036854775807,
    "approval_mode": "QUORUM_2_OF_3"
  }
}
```

i64::MAX = `9223372036854775807` 을 상한으로 두면 “그 이상 전체” 표현.

## Held 의 외부 해소

`SINGLE_APPROVE` / `QUORUM_2_OF_3` 모드는 **콘솔에 “승인 버튼”이 없습니다** — 운영자가 결정 자체를 우회할 수 없다는 원칙 때문 ([결정 라이프사이클 — 수동 승인 없는 이유](/compliance/decision-lifecycle#%EC%88%98%EB%8F%99-%EC%8A%B9%EC%9D%B8-%EC%97%86%EB%8A%94-%EC%9D%B4%EC%9C%A0) 참고).
해소 방법:

1. 별도의 외부 의식(운영자 회의, 키 의식, 별도 시스템 승인)을 거쳐 결정
2. 임시로 `approval_tier` 행을 수정해 해당 금액 구간을 `AUTO` 로 변경 (변경은 `policy_change_log` 에 기록)
3. coordinator 폴링이 다음 평가에서 Allow 받음
4. 평가 통과 후 즉시 `approval_tier` 를 원래대로 복원

이 패턴은 변경 자체가 감사 흔적으로 남고, 외부 승인 의식의 evidence (서명된 회의록, 별도 시스템 로그) 가 함께 묶여 sound 한 감사 추적을 제공합니다.

> **이중 키 의식과의 차이** — 노드월렛 자체의 3-키 다중서명(개시·승인·실행) 은 항상 적용됩니다. approval_tier 의 SINGLE_APPROVE / QUORUM_2_OF_3 는 그 위에 얹는 **운영 측 추가 게이트**로, 보안 키 의식과는 독립된 컴플라이언스 게이트입니다.

## 운영 권장사항

- **구간 경계 1 차이 주의** — 구간이 겹치면 priority 가 같을 때 어느 행이 매치되는지 보장 안 됨. 위 예시처럼 +1 차이로 엄격하게 분리.
- *** mint** — mint = `*` 로 등록하면 모든 토큰에 같은 lamports 한도 적용 — decimals 가 다르면 의미 흐림. 토큰별 등록 권장.
- **per_tx_amount_limit 와 조합** — 절대 한도(per_tx_amount_limit) 위에 approval_tier 를 얹음. 한도 자체가 너무 큰 거래는 차단, 그 안에서 구간별로 승인 강도 조정.
- **단일 승인 vs 의식** — 50 SOL 미만은 SINGLE_APPROVE, 그 이상은 QUORUM_2_OF_3 같은 패턴이 일반적.

## 콘솔 폼 매핑

| 폼 필드 | DB config 키 |
| --- | --- |
| min_amount_lamports(number) | config.min_amount_lamports |
| max_amount_lamports(number) | config.max_amount_lamports |
| approval_mode(dropdown: dual / single / auto) | config.approval_mode |

> **표기 매핑** — 콘솔 폼의 dropdown 값은 백엔드 `approval_mode` 와 다음과 같이 매핑됩니다: `auto` → `AUTO`, `single` → `SINGLE_APPROVE`, `dual` → `QUORUM_2_OF_3`.

## 감사 흔적

- **발화**: Held 시 `held_withdrawals` 에 INSERT, `decision=HELD`, `reason="requires single-operator approval"` 또는 `"requires 2-of-3 quorum approval"`
- **해소**: AUTO 로 변경된 규칙으로 다음 폴링 통과 시 `decision=AUTO_APPROVE` 로 set-once + `auth_approver_sig` 가 set-once 로 기록
- **추적**: 변경된 정책 행은 `policy_change_log` 에 `old_data` / `new_data` 로 남아, 누가 언제 무엇을 바꿔 해소했는지 영구 기록

## 한계

- **수동 승인 채널 외부** — 콘솔 자체에서는 승인 동작 없음. 외부 의식·다른 시스템 연동 필요.
- **타이밍 race** — 운영자 A가 규칙을 AUTO 로 바꾸자마자 운영자 B 가 별도 출금을 시도하면 B 의 출금도 통과. 의식 절차는 운영자 행동 약속에 의존.
