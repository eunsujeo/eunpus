<!--
source_url: https://docs.nodeinfra.com/compliance/rules/velocity-limit
path: /compliance/rules/velocity-limit
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 지갑·토큰 단위 일일 출금 건수가 max_count 에 도달하면 Deny. EvaluationContext 의 사전계산 건수 사용.
-->

# velocity_limit — 일일 건수 제한

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation속도·시간 규칙velocity_limit — 일일 건수 제한

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

## ​한 줄 요약

`EvaluationContext.daily_withdrawal_count >= max_count` 이면 Deny. 단순 건수 카운터.

## ​Config 스키마

```
{
  "max_count": 10,
  "window_seconds": 86400
}
```

| 필드 | 타입 | 필수 | 의미 |
| --- | --- | --- | --- |
| max_count | integer | ✓ | 윈도우 내 최대 허용 건수 |
| window_seconds | integer | optional | 정보 표시용만— 실제 윈도우는 coordinator 가 결정 (보통 86400s = 1일) |

> **주의**: `window_seconds` 는 현재 평가 로직에 사용되지 **않습니다**. coordinator 가 `daily_withdrawal_count` 를 어떤 윈도우로 계산하느냐가 실질 윈도우입니다. 다른 윈도우(예: 시간 단위)를 원하면 [`velocity_window`](/compliance/rules/velocity-window) 사용.

## ​평가 로직

```
fn evaluate(ctx):
    count = ctx.context.daily_withdrawal_count ?? error
    if count >= config.max_count:
        return Deny("velocity limit exceeded")
    return Allow
```

DB 조회 없음. 사전계산값 의존.

## ​적용 가능한 Flow

- ✅ `withdrawal` (가장 일반적)
- ⚠️ `deposit` / `transfer` (coordinator 의 count 계산이 해당 flow 까지 커버해야 의미 있음)

## ​사용 패턴

### ​1) 일일 10건 제한

```
{
  "rule_type": "velocity_limit",
  "flow_type": "withdrawal",
  "mint": "*",
  "priority": 40,
  "config": { "max_count": 10, "window_seconds": 86400 }
}
```

지갑당 모든 토큰 합쳐 일일 10건까지.

### ​2) 토큰별 건수

```
{
  "rule_type": "velocity_limit",
  "flow_type": "withdrawal",
  "mint": "NATIVE_SOL",
  "priority": 40,
  "config": { "max_count": 5, "window_seconds": 86400 }
}
```

SOL 만 일일 5건. 다른 토큰엔 적용 안 됨.

## ​velocity_window 와의 차이

|  | velocity_limit | velocity_window |
| --- | --- | --- |
| 윈도우 | coordinator 가 결정 (보통 1일) | config 의window_seconds가 결정 |
| 검사 항목 | 건수만 | 건수 + 금액 합산 |
| DB 조회 | 없음 (사전계산 의존) | 매 평가 시velocity_windows테이블 |
| 정밀도 | 일 단위 | 초 단위 (슬라이딩) |

**경험칙**: 일 단위 건수 제한은 `velocity_limit`, 짧은 시간 내(예: 5분 내 10건) 빈도 제한은 `velocity_window`.

## ​운영 권장사항

- **단순 카운터** — 1일 누적 카운터 자체가 코디네이터 측에 이미 있으면 가장 가볍게 적용 가능.
- **금액 한도와 조합** — daily_withdrawal_limit 과 함께 등록.
- **이상 거래 탐지(FDS)** — 정상 사용자 평균 출금 건수의 3 표준편차 정도를 한도값으로. 더 정교한 패턴 탐지는 별도 FDS 시스템 + `expression` 규칙.

## ​콘솔 폼 매핑

| 폼 필드 | DB config 키 |
| --- | --- |
| max_count(number, ≥1) | config.max_count |
| window_seconds(number, ≥1) | config.window_seconds(정보 표시용) |

## ​감사 흔적

- **발화**: Deny 시 `triggered_rules.reason = "velocity limit exceeded"` + 현재 count 값이 `context` JSONB 에 기록

## ​한계

- **사전계산 의존** — coordinator 의 count 계산 정확도에 의존.
- **윈도우 슬라이딩 안 함** — `daily_withdrawal_count` 가 일 경계(자정)에서 리셋되는 카운터라면, 자정 직전 9건 + 자정 직후 9건이 모두 통과 가능. 슬라이딩이 필요하면 `velocity_window`.
⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
