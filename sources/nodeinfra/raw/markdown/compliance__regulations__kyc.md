<!--
source_url: https://docs.nodeinfra.com/compliance/regulations/kyc
path: /compliance/regulations/kyc
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 노드월렛은 KYC 자체를 수행하지 않고, KYC 시스템과 연계해 고객 등급별 정책을 차등 집행합니다.
-->

# KYC / 고객확인

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation국내·국제 규제KYC / 고객확인

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

## ​노드월렛의 KYC 책임 경계

KYC(Know Your Customer)는 **고객 신원 확인** 절차로, 보통 외부 KYC 시스템(전자 신분증·실명확인·CDD 절차)에서 처리됩니다. **노드월렛은 KYC 자체를 수행하지 않습니다**.
노드월렛이 담당하는 것은 KYC 시스템의 결과(고객 등급·승인 상태) 를 받아 **거래 단위 정책**에 반영하는 것입니다.
$!/$

## ​KYC 등급 → 정책 매핑 패턴

### ​1) wallet group 으로 등급 분리

각 고객 등급(Tier 1 / Tier 2 / Tier 3) 의 지갑 UUID 를 condition_set 으로 묶습니다.

```
-- condition_set: tier_1_wallets (제한적 권한)
INSERT INTO condition_sets (id, name, set_type, description)
VALUES ('11111...', 'tier_1_wallets', 'whitelist', 'KYC Tier 1 — limited');

INSERT INTO condition_set_items (condition_set_id, value, label)
VALUES
  ('11111...', 'wallet_uuid_1', 'customer A — Tier 1'),
  ('11111...', 'wallet_uuid_2', 'customer B — Tier 1');

-- condition_set: tier_3_wallets (전권)
INSERT INTO condition_sets (id, name, set_type, description)
VALUES ('33333...', 'tier_3_wallets', 'whitelist', 'KYC Tier 3 — full');
```

### ​2) Tier 별 정책 규칙

[`expression`](/compliance/rules/expression) 규칙으로 등급별 차등 한도 적용.

```
// Tier 1 : 일 1 SOL 한도
{
  "rule_type": "expression",
  "flow_type": "withdrawal",
  "priority": 40,
  "config": {
    "action": "DENY",
    "conditions": [
      { "field": "wallet_id", "operator": "in_condition_set",
        "value": { "type": "str", "value": "tier_1_wallets_uuid" } },
      { "field": "context.daily_withdrawal_total", "operator": "gt",
        "value": { "type": "int", "value": 1000000000 } }
    ]
  }
}

// Tier 3 : 일 1,000 SOL 한도
{
  "rule_type": "expression",
  "flow_type": "withdrawal",
  "priority": 40,
  "config": {
    "action": "DENY",
    "conditions": [
      { "field": "wallet_id", "operator": "in_condition_set",
        "value": { "type": "str", "value": "tier_3_wallets_uuid" } },
      { "field": "context.daily_withdrawal_total", "operator": "gt",
        "value": { "type": "int", "value": 1000000000000 } }
    ]
  }
}
```

### ​3) 등급 변경 시 워크플로

KYC 시스템에서 고객의 등급이 변경되면 (Tier 2 → Tier 3 승급):

1. KYC 시스템이 노드월렛 Admin API 호출 — Tier 2 condition_set 에서 해당 wallet 제거, Tier 3 으로 INSERT
2. `policy_change_log` 에 변경 기록 (누가·언제·왜)
3. hot reload 가 즉시 새 등급 정책 반영

또는 일괄 갱신 잡(예: 매일 자정) 으로 처리할 수도 있습니다.

## ​KYC 미완료 고객의 처리

KYC 가 아직 완료되지 않은 고객(`tier = pending`) 의 지갑은:

| 정책 | 권장 |
| --- | --- |
| 입금 | 허용 — 단, 후속 스윕은 통상 정책 |
| 출금 | 차단— KYC 완료 전까지 출금 금지 |
| 내부 이체 | 허용 (서비스 내부 잔액 이동) |

KYC 미완료 지갑을 별도 condition_set 으로 묶고, `expression` 으로 출금만 차단.

```
{
  "rule_type": "expression",
  "flow_type": "withdrawal",
  "priority": 25,
  "config": {
    "action": "DENY",
    "conditions": [
      { "field": "wallet_id", "operator": "in_condition_set",
        "value": { "type": "str", "value": "kyc_pending_wallets_uuid" } }
    ]
  }
}
```

## ​EDD (Enhanced Due Diligence)

고위험 등급(PEP, 고액 거래자) 은 추가 통제를 받습니다. [`approval_tier`](/compliance/rules/approval-tier) 를 EDD 게이트로 활용.

```
// EDD 대상자의 모든 출금은 수동 승인
{
  "rule_type": "expression",
  "priority": 70,
  "config": {
    "action": "DENY",  // 실제로는 expression 으로 Held 만 발생시킬 수 없으므로
    "conditions": [
      { "field": "wallet_id", "operator": "in_condition_set",
        "value": { "type": "str", "value": "edd_wallets_uuid" } }
    ]
  }
}
```

> **expression 의 한계** — `expression` 은 Allow/Deny 만 반환. Held 를 표현할 수 없습니다. EDD 대상자에게 수동 승인을 적용하려면 별도로 `approval_tier` 를 등록하고, EDD wallet 들만 별도 매치되도록 mint·priority 분리.

## ​정기 KYC 재검토 (Refresh KYC)

규제는 보통 1년~3년 주기로 KYC 갱신을 요구합니다. 갱신이 만료된 고객 대응:

1. KYC 시스템이 만료 임박 30일 전 노드월렛에 알림
2. 만료 7일 전 노드월렛이 해당 wallet 을 `kyc_refresh_due` condition_set 에 추가
3. 별도 expression 규칙으로 출금 한도 축소 또는 Held
4. KYC 갱신 완료 시 set 에서 제거

## ​STR/CTR 보고 시 KYC 데이터

의심거래(STR) 또는 고액(CTR) 보고 시 KYC 시스템의 고객 정보가 필요합니다. 노드월렛은 `wallet_id` 만 알고 있으므로:

```
보고 워크플로:
1. policy_decisions 에서 보고 대상 거래 추출 (Held/Deny 등)
2. wallet_id 기반으로 KYC 시스템 API 호출 → 고객 식별 정보 획득
3. 결합된 데이터로 보고서 생성
```

KYC 시스템과의 cross-reference 는 운영자의 책임 — 노드월렛은 wallet_id 만 제공합니다.

## ​한국 / EU / 미국 KYC 요건 매핑

| 규제 | 요구사항 | 노드월렛 대응 |
| --- | --- | --- |
| 한국 특금법 | 비대면 실명확인, 1년 주기 재확인 | KYC 시스템 + tier 매핑 |
| EU AMLD5 | 회원국별 차등 한도 | wallet group + expression |
| 미국 BSA / FinCEN | $10,000 임계치 CTR | per_tx_amount_limit + approval_tier |
| FATF R.10 | CDD 의무 | 외부 KYC 시스템 |
| FATF R.11 | 5년 보관 | activity_log + policy_decisions 5년 보존 |

## ​연관 페이지

## AML / 자금세탁방지

KYC 결과를 활용한 AML 통제 — 제재 명단, 한도.

## expression 규칙

Tier 별 차등 정책의 핵심 도구.⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
