<!--
source_url: https://docs.nodeinfra.com/compliance/rules/per-tx-amount-limit
path: /compliance/rules/per-tx-amount-limit
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 단일 트랜잭션의 금액 + 수수료 합계가 상한을 초과하면 Deny. 토큰별 적용 가능.
-->

# per_tx_amount_limit — 건당 금액 상한

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation차단·한도 규칙per_tx_amount_limit — 건당 금액 상한

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

`amount + fee` 합계가 `max_amount` 를 초과하면 Deny. 단순 임계치 검사 — DB 조회 없이 O(1).

## ​Config 스키마

```
{
  "max_amount": 5000000000,
  "mint": "NATIVE_SOL"
}
```

| 필드 | 타입 | 필수 | 의미 |
| --- | --- | --- | --- |
| max_amount | integer (i64) | ✓ | 상한값 (raw units — lamports 또는 SPL 토큰 단위) |
| mint | string | optional | 적용 토큰. 지정하면 해당 토큰만, 미지정이면 규칙 행의mint컬럼 (와일드카드 가능) 사용 |

`config.mint` 와 규칙 행 `mint` 컬럼은 **별개**입니다 — config 의 mint 는 추가 필터입니다. 보통은 행 `mint` 컬럼만 사용하고 config.mint 는 비워둡니다.

## ​평가 로직

```
fn evaluate(ctx):
    if config.mint is set and config.mint != ctx.mint:
        return Allow  # 다른 토큰엔 적용 안 함
    total = ctx.amount + ctx.fee
    if total > config.max_amount:
        return Deny("over per-tx limit")
    return Allow
```

DB 조회 없음. EvaluationContext 미사용.

## ​적용 가능한 Flow

- ✅ `withdrawal`
- ✅ `deposit` (입금된 자금의 스윕 금액 상한)
- ✅ `transfer`

## ​단위 표기

| 토큰 | 1 단위 = | 1 표시 단위 |
| --- | --- | --- |
| SOL (NATIVE_SOL) | lamports | 1 SOL = 1,000,000,000 lamports |
| USDC (6 decimals) | smallest unit | 1 USDC = 1,000,000 |
| USDT (6 decimals) | smallest unit | 1 USDT = 1,000,000 |
| 임의 SPL (n decimals) | smallest unit | 1 토큰 = 10^n |

콘솔 폼은 raw units 를 직접 입력받습니다.

## ​사용 패턴

### ​1) 건당 5 SOL 상한 (출금)

```
{
  "rule_type": "per_tx_amount_limit",
  "flow_type": "withdrawal",
  "mint": "NATIVE_SOL",
  "priority": 50,
  "config": { "max_amount": 5000000000 }
}
```

### ​2) 건당 USDC 10,000 상한

```
{
  "rule_type": "per_tx_amount_limit",
  "flow_type": "withdrawal",
  "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "priority": 50,
  "config": { "max_amount": 10000000000 }
}
```

10,000 USDC × 1,000,000 = 10,000,000,000.

### ​3) 모든 토큰 일괄 상한 (lamports 환산은 부정확)

```
{
  "rule_type": "per_tx_amount_limit",
  "flow_type": "withdrawal",
  "mint": "*",
  "priority": 50,
  "config": { "max_amount": 100000000000 }
}
```

**경고**: 토큰 decimals 가 다르므로 `mint = "*"` + 단일 임계치는 의미가 흐려집니다. 보통 **토큰별로 행을 따로 등록**하세요.

## ​수수료 포함 이유

`max_amount` 는 `amount + fee` 와 비교합니다. 이유:

- 사용자가 99 USDC 출금 신청 + 수수료 1 USDC = 총 100 USDC 가 옴니버스에서 빠짐. 한도가 100 USDC 라면 이 거래는 차단되어야 함.
- 수수료를 무시하면 운영자가 한도를 회피 가능 (수수료를 임의로 부풀려서 한도 우회).

## ​운영 권장사항

- **토큰별 등록** — `*` 단일 한도 대신 토큰별로 행 분리.
- **단위 실수 방지** — config 등록 직후 [결정 이력](/compliance/portal/transactions) 으로 dry-run 결과 확인. 한 자리 오타로 한도가 10배 어긋날 수 있음.
- **approval_tier 와 조합** — 단순 차단 대신 한도 초과 시 수동 승인을 받고 싶으면 `per_tx_amount_limit` 대신 `approval_tier` 사용.

## ​콘솔 폼 매핑

| 폼 필드 | DB config 키 |
| --- | --- |
| max_amount(number) | config.max_amount |
| params_mint(optional 텍스트) | config.mint |

## ​감사 흔적

- **발화**: Deny 시 `triggered_rules.reason = "over per-tx limit"` + `config` 전체가 결정 행에 동시 기록

## ​한계

- **수수료 추정 의존** — `fee` 값은 코디네이터가 계산해 넘김. 체인 수수료가 실제보다 낮게 추정되면 한도를 우회 가능. 노드월렛은 보수적 fee 모델 사용.
- **다중 출금 합산 안 함** — 한 거래의 amount+fee 만 본다. “동시에 들어온 여러 거래의 합” 은 [`velocity_window`](/compliance/rules/velocity-window) 참고.
⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
