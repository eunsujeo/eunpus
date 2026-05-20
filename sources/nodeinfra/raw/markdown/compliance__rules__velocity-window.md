<!--
source_url: https://docs.nodeinfra.com/compliance/rules/velocity-window
path: /compliance/rules/velocity-window
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 지정된 window_seconds 슬라이딩 윈도우 내 누적 건수·금액을 검사. 짧은 시간 내 고빈도/고금액 패턴 탐지.
-->

# velocity_window — 슬라이딩 윈도우 (건수 + 금액)

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation속도·시간 규칙velocity_window — 슬라이딩 윈도우 (건수 + 금액)

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

DB 의 `velocity_windows` 테이블에서 `(account_id, mint)` × `recorded_at >= now() - window_seconds` 범위의 SUM(amount), COUNT 를 계산. 신규 거래를 포함했을 때 한도 초과 시 Deny.

## ​Config 스키마

```
{
  "window_seconds": 3600,
  "max_amount_lamports": 10000000000,
  "max_count": 5
}
```

| 필드 | 타입 | 필수 | 의미 |
| --- | --- | --- | --- |
| window_seconds | integer (i64) | ✓ | 슬라이딩 윈도우 크기 (초) |
| max_amount_lamports | integer (i64) | ✓ | 윈도우 내 최대 누적 금액 (raw units; 이름은 lamports 지만 다른 토큰엔 해당 토큰 units) |
| max_count | integer (i64) | ✓ | 윈도우 내 최대 건수 |

## ​평가 로직

```
fn evaluate(ctx):
    window_start = now() - config.window_seconds
    sum_amount, count = SELECT SUM(amount), COUNT(*)
                       FROM velocity_windows
                       WHERE account_id = ctx.wallet_id
                         AND mint = ctx.mint
                         AND recorded_at >= window_start
    if count >= config.max_count:
        return Deny("velocity_window count exceeded")
    if sum_amount + ctx.amount > config.max_amount_lamports:
        return Deny("velocity_window amount exceeded")
    return Allow
```

**DB 조회 필요** — 매 평가 시 `velocity_windows` 테이블 SUM/COUNT 쿼리. `(account_id, mint, recorded_at)` 인덱스 필수.

## ​적용 가능한 Flow

- ✅ `withdrawal`
- ⚠️ `deposit` / `transfer` — `velocity_windows` 에 해당 flow 의 항목이 기록된다고 가정해야 의미 있음

## ​기록 메커니즘

이 규칙이 의미를 가지려면 **별도로 velocity_windows 에 행이 INSERT 되어야** 합니다. 그 INSERT 는 다음 시점에 발생합니다.

- 출금이 성공(체인 서명·전송 완료)할 때 coordinator 가 INSERT
- `withdrawal_id` 컬럼 UNIQUE 제약으로 dual-leg ceremony 의 두 leg 가 중복 기록되지 않음

`velocity_windows` 는 append-only 사용 패턴이며, 윈도우 밖 데이터는 별도 정리 잡으로 압축·아카이브.

## ​사용 패턴

### ​1) 1시간 내 5건 또는 10 SOL 제한

```
{
  "rule_type": "velocity_window",
  "flow_type": "withdrawal",
  "mint": "NATIVE_SOL",
  "priority": 60,
  "config": {
    "window_seconds": 3600,
    "max_amount_lamports": 10000000000,
    "max_count": 5
  }
}
```

### ​2) 5분 내 3건 (고빈도 탐지)

```
{
  "rule_type": "velocity_window",
  "flow_type": "withdrawal",
  "mint": "*",
  "priority": 60,
  "config": {
    "window_seconds": 300,
    "max_amount_lamports": 9223372036854775807,
    "max_count": 3
  }
}
```

amount 한도를 i64::MAX 로 두면 사실상 건수만 검사.

### ​3) 일일 누적 (velocity_limit 대체)

```
{
  "rule_type": "velocity_window",
  "flow_type": "withdrawal",
  "mint": "NATIVE_SOL",
  "priority": 60,
  "config": {
    "window_seconds": 86400,
    "max_amount_lamports": 100000000000,
    "max_count": 100
  }
}
```

`daily_withdrawal_limit` + `velocity_limit` 을 한 규칙으로 묶을 수 있지만, **DB 조회가 매 평가마다 발생**하므로 부하 차이 고려.

## ​velocity_limit 와의 차이 (재정리)

|  | velocity_limit | velocity_window |
| --- | --- | --- |
| 윈도우 | coordinator 사전계산 | config 의window_seconds |
| DB 조회 | 없음 | 매 평가 시 SUM/COUNT |
| 검사 항목 | 건수 | 건수 + 금액 |
| 정밀도 | 일 단위 | 초 단위 슬라이딩 |
| 적합 사례 | 일일 한도 | 짧은 시간 패턴 |

## ​운영 권장사항

- **인덱스 확인** — `(account_id, mint, recorded_at)` 복합 인덱스 필수. 큰 테이블에서 인덱스 누락 시 평가 latency 폭증.
- **파티셔닝** — 12개월 이상 데이터는 시간 파티션 권장 (윈도우 쿼리가 최근 파티션만 스캔).
- **여러 윈도우 조합** — “1시간 내 5건 + 1일 내 50건” 처럼 두 규칙을 priority 다르게 등록.

## ​콘솔 폼 매핑

| 폼 필드 | DB config 키 |
| --- | --- |
| window_seconds(number) | config.window_seconds |
| max_amount_lamports(number) | config.max_amount_lamports |
| max_count(number) | config.max_count |

## ​감사 흔적

- **발화**: Deny 시 `triggered_rules.reason` 에 `"velocity_window count exceeded"` 또는 `"velocity_window amount exceeded"` — 어느 한도에 걸렸는지 명시
- **기록**: 윈도우 데이터 자체는 `velocity_windows` 에 — DB 직접 쿼리로 패턴 분석 가능

## ​한계

- **윈도우 진입 race** — 매우 짧은 윈도우(< 1초) + 동시 다중 출금 시 SUM 시점과 INSERT 시점 차이로 한도 약간 초과 가능
- **mint별 따로 적용** — `mint = "*"` 로 등록해도 평가 시점에는 `ctx.mint` 별 그룹으로 카운트. 토큰 간 합산이 필요하면 expression 으로 구현
⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
