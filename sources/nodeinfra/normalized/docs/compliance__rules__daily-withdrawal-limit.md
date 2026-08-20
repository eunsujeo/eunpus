<!--
source_url: https://docs.nodeinfra.com/compliance/rules/daily-withdrawal-limit
path: /compliance/rules/daily-withdrawal-limit
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 지갑·토큰 단위 일일 누적 출금이 한도를 초과하면 Deny. EvaluationContext 의 사전계산값 사용.
-->

# daily_withdrawal_limit — 일일 누적 한도

## 한 줄 요약

`EvaluationContext.daily_withdrawal_total + (amount + fee)` 가 `limit_per_account_per_mint` 를 초과하면 Deny.

## Config 스키마

```
{
  "limit_per_account_per_mint": 100000000000
}
```

| 필드 | 타입 | 필수 | 의미 |
| --- | --- | --- | --- |
| limit_per_account_per_mint | integer (i64) | ✓ | 지갑(account_id) × 토큰(mint) 단위의 일일 누적 한도 (raw units) |

## 평가 로직

```
fn evaluate(ctx):
    today_total = ctx.context.daily_withdrawal_total ?? error
    new_total = today_total + (ctx.amount + ctx.fee)
    if new_total > config.limit_per_account_per_mint:
        return Deny("would exceed daily limit")
    return Allow
```

**DB 조회 없음** — `daily_withdrawal_total` 은 코디네이터가 미리 계산해 컨텍스트로 전달합니다. 일일 누적 계산은 원장 트랜잭션의 책임입니다.
`daily_withdrawal_total` 이 `None` (코디네이터가 계산을 누락) 이면 `PolicyError` → fail-closed (Deny) 로 처리됩니다.

## 적용 가능한 Flow

- ✅ `withdrawal` (가장 일반적)
- ⚠️ `deposit` (스윕 일일 한도) — 의미 있음
- ⚠️ `transfer` (내부 일일 한도) — 의미 있음

이름은 withdrawal-centric 이지만 모든 flow 에 적용 가능합니다. coordinator 가 `daily_withdrawal_total` 을 flow 별로 계산해 넘긴다고 가정.

## 사용 패턴

### 1) SOL 일일 100 SOL 한도

```
{
  "rule_type": "daily_withdrawal_limit",
  "flow_type": "withdrawal",
  "mint": "NATIVE_SOL",
  "priority": 40,
  "config": { "limit_per_account_per_mint": 100000000000 }
}
```

100 SOL × 10^9 = 100,000,000,000 lamports.

### 2) USDC 일일 1만 USDC

```
{
  "rule_type": "daily_withdrawal_limit",
  "flow_type": "withdrawal",
  "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "priority": 40,
  "config": { "limit_per_account_per_mint": 10000000000 }
}
```

10,000 USDC × 10^6 = 10,000,000,000.

## ”일일” 의 정의

- 윈도우: **UTC 00:00 ~ 다음 UTC 00:00** (코디네이터 설정)
- 갱신: 자정 경계 통과 시 `daily_withdrawal_total` 자동 리셋 (그 시점 이후 새 거래의 누적)
- KST 기준이 필요한 한국 운영자 — 코디네이터 측에서 윈도우 시작을 `09:00 UTC` (KST 18:00) 로 변경할 수 있도록 환경변수 제공. 자세한 절차는 [내부 cert 팩 — Policy Audit Trail](https://github.com/nodeinfra/nodewallet/blob/master/docs/compliance/policy-audit-trail.md) 참고.

## 키 단위

| 단위 | 의미 |
| --- | --- |
| account_id (지갑 UUID) | 한 지갑이 토큰 한 종류로 일일 100 SOL 까지 |
| mint | 토큰별 한도 따로 — SOL 100 + USDC 10,000 동시에 가능 |
| operator 단위 한도 | 현재 미지원. 필요시expression으로 보완 |

테넌트 단위(전체 옴니버스 합산) 한도는 daily_withdrawal_limit 으로 표현되지 않습니다 — daily_withdrawal_count 또는 별도 운영 통제로.

## 운영 권장사항

- **velocity_limit 과 조합** — 금액 한도(daily_withdrawal_limit) + 건수 한도(velocity_limit) 모두 등록하면 “큰 금액 한 번 vs 작은 금액 다수” 양쪽 패턴을 모두 통제.
- **고객 tier 차등** — 단일 한도 대신 고객 등급별 한도가 필요하면 wallet group 마다 다른 행을 등록하거나 [expression](/compliance/rules/expression) 사용.

## 콘솔 폼 매핑

| 폼 필드 | DB config 키 |
| --- | --- |
| limit_per_account_per_mint(number) | config.limit_per_account_per_mint |

## 감사 흔적

- **발화**: Deny 시 `triggered_rules.reason = "would exceed daily limit"` + 컨텍스트의 `daily_withdrawal_total` 도 `policy_decisions.context` JSONB 에 기록

## 한계

- **사전계산 의존** — coordinator 가 잔액 추정에 사용한 ledger 시점과 실제 평가 시점 사이의 race 가능. 거의 모든 경우 무시 가능한 size 지만, 부하 상황에서 동일 지갑 동시 출금 시 한도 약간 초과 가능. 이를 막으려면 ledger 측에서 출금 직전 단일 트랜잭션 안에서 일일누적을 다시 확인.
- **수수료 정확성** — `fee` 가 보수적으로 추정되어야 한도 회피가 안 됨.
