<!--
source_url: https://docs.nodeinfra.com/compliance/rules/address-cooldown
path: /compliance/rules/address-cooldown
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 새로 본 출금 주소에 대해 지정된 시간 동안 고액 출금을 Held. 첫 거래 지연 검토 패턴.
-->

# address_cooldown — 신규 주소 쿨다운

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation속도·시간 규칙address_cooldown — 신규 주소 쿨다운

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

`destination` 주소가 처음 본 주소이거나 `cooldown_seconds` 이내에 처음 본 주소이고, 금액이 `max_amount_during_cooldown_lamports` 를 초과하면 **Held** (Deny 아님 — 시간이 지나면 자동 해소).

## ​Config 스키마

```
{
  "cooldown_seconds": 604800,
  "max_amount_during_cooldown_lamports": 1000000000
}
```

| 필드 | 타입 | 필수 | 의미 |
| --- | --- | --- | --- |
| cooldown_seconds | integer (i64) | ✓ | 신규 주소로 분류되는 시간창 (초) |
| max_amount_during_cooldown_lamports | integer (i64) | ✓ | 쿨다운 중 허용되는 최대 금액. 초과 시 Held. (raw units) |

## ​평가 로직

```
fn evaluate(ctx):
    first_used = SELECT first_used_at FROM address_first_use
                 WHERE address = ctx.destination
    if first_used is None:
        # 처음 보는 주소
        if (ctx.amount + ctx.fee) > config.max_amount_during_cooldown_lamports:
            return Held("new address, amount above cooldown threshold")
        return Allow
    age = now() - first_used
    if age < config.cooldown_seconds:
        if (ctx.amount + ctx.fee) > config.max_amount_during_cooldown_lamports:
            return Held("address in cooldown window, amount above threshold")
        return Allow
    return Allow  # 쿨다운 지남
```

**DB 조회 필요** — `address_first_use` 테이블 lookup (`address` PK).
`address_first_use` 에 행을 INSERT 하는 것은 별도 처리 — 최초 거래(또는 첫 통과 거래) 가 발생할 때 coordinator 또는 평가 후처리에서 기록합니다.

## ​적용 가능한 Flow

- ✅ `withdrawal` — 가장 일반적 (신규 출금 대상 주소 검사)
- ⚠️ `deposit` — 첫 거래 송금자에 대한 스윕 쿨다운. 의미 있지만 입금자 주소가 매번 다른 옴니버스 패턴이면 false-positive 다수 발생 가능
- ⚠️ `transfer` — 내부 주소는 미리 생성되므로 의미 적음

## ​왜 Held 인가 (Deny 아님)

쿨다운 위반은 “지금은 안 되지만 시간이 지나면 자동 해소” 라는 본질을 가집니다.

- 쿨다운 시간이 지나면 동일 거래에 대해 같은 규칙이 Allow 반환
- coordinator 가 폴링하다 자동 해소 시점에 진행

[결정 라이프사이클 — Held](/compliance/decision-lifecycle#held-%EC%9E%90%EB%8F%99-%EA%B2%B0%EC%A0%95-%EB%B3%B4%EB%A5%98) 의 두 가지 Held 발화 규칙 중 하나입니다.

## ​사용 패턴

### ​1) 7일 쿨다운 + 1 SOL threshold

```
{
  "rule_type": "address_cooldown",
  "flow_type": "withdrawal",
  "mint": "NATIVE_SOL",
  "priority": 60,
  "config": {
    "cooldown_seconds": 604800,
    "max_amount_during_cooldown_lamports": 1000000000
  }
}
```

처음 출금하는 주소로 1 SOL 까지는 즉시 허용, 1 SOL 초과 시 7일 동안 Held.

### ​2) 24시간 + 100 USDC threshold

```
{
  "rule_type": "address_cooldown",
  "flow_type": "withdrawal",
  "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "priority": 60,
  "config": {
    "cooldown_seconds": 86400,
    "max_amount_during_cooldown_lamports": 100000000
  }
}
```

USDC 첫 출금은 24시간 동안 100 USDC 한도.

## ​운영 권장사항

- **threshold = 0** — 위반 시 무조건 Held 로 만들고 싶다면 `max_amount_during_cooldown_lamports: 0`. 신규 주소로의 모든 출금이 쿨다운 시간 동안 Held.
- **쿨다운 길이 트레이드오프** — 너무 길면 정상 사용자 불편(첫 출금 7일 보류는 PG 사용자에겐 받아들이기 어려움), 너무 짧으면 공격자 적응. 24~72시간이 일반적.
- **address_list whitelist 와 조합** — 이미 OFAC 통과한 알려진 VASP 는 화이트리스트로 cooldown 면제.

## ​콘솔 폼 매핑

| 폼 필드 | DB config 키 |
| --- | --- |
| cooldown_seconds(number, ≥1) | config.cooldown_seconds |
| max_amount_during_cooldown_lamports(number, ≥1) | config.max_amount_during_cooldown_lamports |

## ​감사 흔적

- **발화**: Held 시 `held_withdrawals` 또는 `held_deposits` 에 INSERT, `decision=HELD`, `reason="address in cooldown window..."`
- **재평가**: `/v1/poll` 호출마다 같은 로직 재실행. 쿨다운 만료 시 자동 Allow 로 전환 + `decision=AUTO_APPROVE` 로 set-once

## ​한계

- **address_first_use 초기 채움** — 시스템 초기 도입 시 기존 거래의 first_used 기록이 없으면 모든 주소가 “신규” 로 분류됨. 도입 첫날 백필 작업 필요.
- **첫 거래 기록 시점** — coordinator 가 평가 전에 INSERT 하면 동일 트랜잭션이 자기 자신을 신규로 인식할 race; 평가 후 INSERT 하면 첫 거래만 신규로 인식하고 두 번째부터 normal. 후자 패턴이 권장.
⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
