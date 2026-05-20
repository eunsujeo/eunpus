<!--
source_url: https://docs.nodeinfra.com/compliance/rules/address-list
path: /compliance/rules/address-list
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: condition_set 으로 정의된 주소 묶음에 대해 화이트리스트 또는 블랙리스트 적용. OFAC/UN 제재 명단·VASP 식별에 사용.
-->

# address_list — 주소 화이트/블랙리스트

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation차단·한도 규칙address_list — 주소 화이트/블랙리스트

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

`destination` 주소가 미리 등록된 `condition_set` 에 속하는지 검사하여, **whitelist 모드**면 속할 때만 Allow / **blacklist 모드**면 속하지 않을 때만 Allow 반환.

## ​Config 스키마

```
{
  "condition_set_id": "550e8400-e29b-41d4-a716-446655440000",
  "mode": "blacklist"
}
```

| 필드 | 타입 | 필수 | 의미 |
| --- | --- | --- | --- |
| condition_set_id | string (UUID) | ✓ | 참조할condition_sets.id |
| mode | string | ✓ | "whitelist"또는"blacklist" |

## ​condition_set 이란

`condition_sets` 와 `condition_set_items` 두 테이블이 짝을 이뤄 **재사용 가능한 주소 묶음**을 정의합니다.

```
INSERT INTO condition_sets (id, name, set_type, description)
VALUES ('550e...', 'ofac_sdn_2026q2', 'blacklist',
        'OFAC SDN list 2026-Q2 — 2026-05-01 import');

INSERT INTO condition_set_items (condition_set_id, value, label) VALUES
  ('550e...', 'BadActorAddress1111111111111111111111111111', 'SDN entity X'),
  ('550e...', 'BadActorAddress2222222222222222222222222222', 'SDN entity Y');
```

같은 condition_set 을 여러 정책 규칙이 참조할 수 있어, OFAC 명단 업데이트는 set 한 곳만 수정하면 모든 관련 규칙이 즉시 반영됩니다.

## ​평가 로직

```
fn evaluate(ctx):
    rows = SELECT value FROM condition_set_items
           WHERE condition_set_id = config.condition_set_id
    in_set = ctx.destination ∈ rows
    if config.mode == "whitelist":
        return Allow if in_set else Deny
    else:  # blacklist
        return Deny if in_set else Allow
```

**DB 조회 필요** — 매 평가마다 `condition_set_items` SELECT. 큰 set 의 경우 `(condition_set_id, value)` 인덱스 활용.

## ​적용 가능한 Flow

- ✅ `withdrawal` (외부 송금 차단/허용)
- ⚠️ `deposit` (송금자 주소 기준)
- ⚠️ `transfer` (내부 주소 묶음 화이트리스트)

내부 이체에서 `denylist` 모드는 사용 사례가 거의 없습니다 — 모든 대상이 내부 주소이기 때문입니다.

## ​사용 패턴

### ​1) OFAC denylist

```
{
  "rule_type": "address_list",
  "mint": "*",
  "priority": 20,
  "config": {
    "condition_set_id": "ofac_sdn_2026q2",
    "mode": "blacklist"
  }
}
```

OFAC SDN 명단에 있는 주소로의 출금 차단.

### ​2) VASP 화이트리스트 (트래블룰)

```
{
  "rule_type": "address_list",
  "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "priority": 30,
  "config": {
    "condition_set_id": "vasp_allowlist_kr",
    "mode": "whitelist"
  }
}
```

USDC 출금은 한국 인가 VASP 의 hot wallet 주소로만 허용 — 트래블룰 [FATF R.16](/compliance/regulations/travel-rule) 충족.

### ​3) 핫·콜드 월렛 화이트리스트 (내부 전용)

```
{
  "rule_type": "address_list",
  "mint": "*",
  "priority": 40,
  "config": {
    "condition_set_id": "internal_hot_cold_wallets",
    "mode": "whitelist"
  }
}
```

내부 이체에서 자금이 미리 정의된 hot/cold 주소로만 이동하도록 강제.

## ​운영 권장사항

- **set 업데이트 절차** — OFAC 명단 갱신 시: ① 신규 set 등록 → ② 정책 규칙의 `condition_set_id` 를 새 set 으로 변경 → ③ 구 set 보관 (감사용). 신규 set 을 만들고 규칙을 새 set 으로 가리키게 하면 변경 시점이 명확합니다.
- **set 크기** — 수십만 행까지 무리 없음. 단, 매 평가 시 SELECT 가 발생하므로 매우 큰 set 은 캐싱 검토 (향후 핫리로드).
- **import 의 무결성** — OFAC/UN 명단 파일은 서명된 출처에서 import 하고, `condition_sets.description` 에 import 시각·SHA-256 을 기록하세요. 자세한 절차는 [내부 cert 팩 — AML Sanctions Coverage](https://github.com/nodeinfra/nodewallet/blob/master/docs/compliance/aml-sanctions-coverage.md) 참고.

## ​콘솔 폼 매핑

| 폼 필드 | DB config 키 |
| --- | --- |
| condition_set_id(UUID 입력, 검증) | config.condition_set_id |
| mode(dropdown: whitelist/blacklist) | config.mode |

UUID 형식 검증이 폼 단계에서 적용됩니다.

## ​감사 흔적

- **변경**: `policy_change_log` + condition_set 자체의 변경도 `policy_change_log`
- **발화**: Deny 시 `policy_decisions.triggered_rules` 에 `rule_name: "address_list"` + `reason: "destination in blacklist"`

## ​한계

- **부분 매칭 불가** — `destination` 의 정확한 일치만 검사. 주소 패턴(접두사 등) 매칭은 [expression](/compliance/rules/expression) 으로 가능.
- **체인 메모 검사 없음** — 메모/태그가 있는 트랜잭션은 메모 내용이 아닌 destination 주소만 본다.
⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
