<!--
source_url: https://docs.nodeinfra.com/compliance/rules/time-window
path: /compliance/rules/time-window
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 운영 시간대 외 트랜잭션 Deny. 시간대 오프셋 지정 가능, 자정 wraparound 지원.
-->

# time_window — 영업시간 제한

## 한 줄 요약

현재 시각의 (timezone 적용된) 시간이 `[start_hour, end_hour)` 범위에 들지 않으면 Deny.

## Config 스키마

```
{
  "start_hour": 9,
  "end_hour": 18,
  "timezone_offset_hours": 9
}
```

| 필드 | 타입 | 필수 | 의미 |
| --- | --- | --- | --- |
| start_hour | integer (0–23) | ✓ | 허용 시간 시작 (해당 시각 포함) |
| end_hour | integer (0–23) | ✓ | 허용 시간 종료 (해당 시각 미포함) |
| timezone_offset_hours | integer (-12 ~ +14) | ✓ | UTC 대비 오프셋 (KST = +9, EST = -5) |

## 평가 로직

```
fn evaluate(ctx):
    utc_hour = now().hour()
    local_hour = (utc_hour + config.timezone_offset_hours) mod 24
    if config.start_hour <= config.end_hour:
        # 통상 윈도우 (예: 9-18)
        in_window = config.start_hour <= local_hour < config.end_hour
    else:
        # 자정 wraparound (예: 22-06)
        in_window = local_hour >= config.start_hour or local_hour < config.end_hour
    if not in_window:
        return Deny("outside operating hours")
    return Allow
```

DB 조회 없음. EvaluationContext 미사용. **시간 함수만 사용 — 결정적**.

## 적용 가능한 Flow

- ✅ `withdrawal` — 가장 일반적
- ⚠️ `deposit` — 영업시간 외 스윕 정지 (자동 청산 잡 의도면 의미 적음)
- ⚠️ `transfer` — 야간 내부 이체 금지

## 사용 패턴

### 1) KST 영업시간 (09:00 ~ 18:00)

```
{
  "rule_type": "time_window",
  "flow_type": "withdrawal",
  "mint": "*",
  "priority": 30,
  "config": {
    "start_hour": 9,
    "end_hour": 18,
    "timezone_offset_hours": 9
  }
}
```

### 2) 24시간 운영 중 새벽 차단 (KST 22:00 ~ 다음날 06:00)

```
{
  "rule_type": "time_window",
  "flow_type": "withdrawal",
  "mint": "*",
  "priority": 30,
  "config": {
    "start_hour": 6,
    "end_hour": 22,
    "timezone_offset_hours": 9
  }
}
```

자정 wraparound 가 아니라 “06~22 만 허용” 패턴으로 표현 — 즉 22:00 ~ 다음날 06:00 가 차단.

### 3) 자정 wraparound (예: 22:00 ~ 06:00 만 허용 — 비정상 케이스)

```
{
  "rule_type": "time_window",
  "flow_type": "withdrawal",
  "mint": "*",
  "priority": 30,
  "config": {
    "start_hour": 22,
    "end_hour": 6,
    "timezone_offset_hours": 9
  }
}
```

start > end 이면 wraparound 로 해석. 22:00 ~ 다음날 06:00 만 허용. (실용 사례 거의 없음 — 야간 일괄 처리 등)

## 시간대 표기

`timezone_offset_hours` 는 **고정 정수**입니다 — DST(서머타임) 지원 안 함.

| 지역 | 오프셋 |
| --- | --- |
| 한국 (KST) | +9 |
| 일본 (JST) | +9 |
| 싱가포르 (SGT) | +8 |
| 영국 (GMT, 겨울) | 0 |
| 영국 (BST, 여름) | +1 —DST 자동 미지원, 필요시 수동 변경 |
| 미국 동부 (EST) | -5 |

DST 가 적용되는 지역(미국·유럽 일부)은 봄·가을마다 운영자가 직접 오프셋을 변경하거나, [expression](/compliance/rules/expression) 으로 분기 처리.

## 운영 권장사항

- **global_halt 가 우선** — time_window 가 발화하기 전 사고 대응이 가능하도록 priority 를 global_halt(10) 보다 크게.
- **분 단위 정밀도 없음** — 09:30 같은 시작 시각은 표현 불가. 분 단위가 필요하면 [expression](/compliance/rules/expression) 으로 `context.now_minutes` 같은 필드를 구현 (현재 미지원).
- **공휴일 처리 없음** — 평일·주말·공휴일 구분 없음. 공휴일 차단이 필요하면 expression 또는 외부 스케줄러로 보완.

## 콘솔 폼 매핑

| 폼 필드 | DB config 키 |
| --- | --- |
| start_hour(number, 0–23) | config.start_hour |
| end_hour(number, 0–23) | config.end_hour |
| timezone_offset_hours(number, -12 ~ +14) | config.timezone_offset_hours |

폼에서 범위 검증.

## 감사 흔적

- **발화**: Deny 시 `triggered_rules.reason = "outside operating hours"` + 현재 local_hour 가 `context` 또는 `reason` 에 포함

## 한계

- **시계 동기화 의존** — 승인자 호스트의 시스템 시계가 부정확하면 잘못된 차단/허용. NTP 동기화 필수 (FIPS 140-3 운영 요건과 일치).
- **DST 미지원** — 위 참고.
- **분 단위 미지원** — 위 참고.
