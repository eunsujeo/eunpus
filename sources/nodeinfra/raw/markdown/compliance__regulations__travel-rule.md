<!--
source_url: https://docs.nodeinfra.com/compliance/regulations/travel-rule
path: /compliance/regulations/travel-rule
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: VASP 간 카운터파티 정보 교환 의무. 정책 엔진은 허용된 VASP 주소로만 출금을 제한하는 기술 통제를 담당.
-->

# 트래블룰 (FATF R.16)

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation국내·국제 규제트래블룰 (FATF R.16)

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

## ​트래블룰이란

FATF Recommendation 16 (Travel Rule) 은 VASP(Virtual Asset Service Provider) 가 가상자산을 송금할 때 송금자·수취자 정보를 받는 VASP 에 전달할 것을 요구합니다.

| 규제권 | 임계치 | 시행 |
| --- | --- | --- |
| 한국 (특금법 시행령) | 100만원 이상 | 2022-03-25 시행 |
| 미국 (FinCEN Travel Rule) | $3,000 이상 | 1996 시행, 2019 가상자산 확장 |
| EU (TFR 2023/1113) | 모든 거래 | 2024-12-30 시행 |
| FATF (글로벌) | $1,000 / EUR 1,000 | 2019 권고 |

## ​노드월렛의 트래블룰 책임 경계

트래블룰은 두 단계로 나뉩니다.

1. **카운터파티 식별** — 수신 주소가 어느 VASP 의 hot wallet 인지 식별
2. **정보 교환** — 송금자·수취자 정보를 카운터파티 VASP 에 전달 (TRP, Sygna, Notabene 등 트래블룰 솔루션 사용)

**노드월렛은 첫 단계의 기술 통제만 담당합니다** — 미식별 주소로의 출금을 차단. 정보 교환 자체는 외부 트래블룰 솔루션의 영역입니다.

## ​패턴 1: VASP 화이트리스트

식별된 VASP 의 hot wallet 주소를 condition_set 으로 묶고, [`address_list`](/compliance/rules/address-list) whitelist 모드로 출금을 제한.

```
INSERT INTO condition_sets (id, name, set_type, description) VALUES
  ('vasp-allowlist-kr', 'vasp_allowlist_kr', 'whitelist',
   '한국 인가 VASP hot wallets — 2026-05-01 import');

INSERT INTO condition_set_items (condition_set_id, value, label) VALUES
  ('vasp-allowlist-kr', 'UpbitHot1...', 'Upbit hot wallet'),
  ('vasp-allowlist-kr', 'BithumbHot1...', 'Bithumb hot wallet'),
  ('vasp-allowlist-kr', 'CoinoneHot1...', 'Coinone hot wallet');
```

```
{
  "rule_type": "address_list",
  "flow_type": "withdrawal",
  "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "priority": 30,
  "config": {
    "condition_set_id": "vasp-allowlist-kr",
    "mode": "whitelist"
  }
}
```

USDC 출금은 인가 VASP hot wallet 으로만 가능. 미식별 주소(self-custody wallet 등)는 차단.

## ​패턴 2: 임계치 이하만 자유 / 임계치 초과는 화이트리스트

100만원 이하 거래는 임의 주소 허용 / 초과 거래는 VASP 화이트리스트 제한.
[`expression`](/compliance/rules/expression) 으로 조건부 적용:

```
{
  "rule_type": "expression",
  "flow_type": "withdrawal",
  "priority": 30,
  "config": {
    "action": "DENY",
    "conditions": [
      { "field": "amount", "operator": "gte",
        "value": { "type": "int", "value": 1000000 } },
      { "field": "destination", "operator": "not_in",
        "value": { "type": "string_list", "value": ["UpbitHot1...", "BithumbHot1..."] } }
    ]
  }
}
```

> 위 예시는 단순화. 실제로는 `not_in_condition_set` 가 더 적합하나 현재 `expression` 은 `in_condition_set` 만 지원합니다. 부정 매치는 `address_list` whitelist 와 임계치 규칙을 별도 행으로 등록해 우회 가능.

## ​VASP 식별 출처

$!/$
VASP 식별 데이터의 출처가 단일이 아니므로, 운영팀이 데이터를 검증·통합한 후 노드월렛 condition_set 으로 import 합니다. 자세한 큐레이션 절차는 [내부 cert 팩 — AML Sanctions Coverage](https://github.com/nodeinfra/nodewallet/blob/master/docs/compliance/aml-sanctions-coverage.md#vasp-%EC%8B%9D%EB%B3%84-%EC%86%8C%EC%8A%A4-%ED%86%B5%ED%95%A9) 참고.

## ​자기 보관(self-custody) 처리

EU TFR 2023/1113 은 1,000 EUR 초과 자기 보관 지갑 송금 시 추가 의무를 부과합니다. 노드월렛에서 자기 보관 주소 차단 또는 추가 절차 적용:

1. 미식별 주소(VASP 화이트리스트 외) 에 대한 출금에 [`approval_tier`](/compliance/rules/approval-tier) 의 `SINGLE_APPROVE` 적용
2. 운영자가 KYC 시스템에서 고객이 자기 보관 신고를 했는지 확인 후 결정 채널을 통해 해소
3. 미신고 자기 보관 주소는 정책 변경 없이 Held 만료(24h) → 자동 Deny

## ​송신 vs 수신

| 측면 | 노드월렛 대응 |
| --- | --- |
| 출금 (송신) | address_listwhitelist 로 카운터파티 VASP 만 허용 |
| 입금 (수신) | 입금 자체는 막을 수 없음. 단, 출처 검증 후 스윕을address_cooldown/approval_tier로 지연 |

송신 측 통제가 핵심이며, 수신 측은 후속 절차(KYC 결과·블록체인 분석)와 결합해 운영합니다.

## ​정보 교환 데이터 (요구되는 필드)

트래블룰 솔루션에서 교환하는 데이터(노드월렛 외부) :

| 필드 | 노드월렛 데이터 출처 |
| --- | --- |
| 송금자 이름·주소·계좌번호 | KYC 시스템 (외부) |
| 수취자 이름·주소·VASP 식별자 | 외부 카운터파티 입력 |
| 거래 식별자 | policy_decisions.request_id |
| 거래 금액 / 토큰 | policy_decisions.amount/mint |
| 거래 시각 | policy_decisions.decided_at |
| 체인 트랜잭션 해시 | auditdb.signing_events.tx_hash |

`request_id` ↔ `tx_hash` 는 `signing_events.chain_evidence_ref` 로 cross-DB join 가능.

## ​감사 흔적

- **차단된 미식별 주소 출금** — `policy_decisions WHERE verdict='REJECT' AND triggered_rules @> '[{"rule_name": "address_list"}]'`
- **VASP 화이트리스트 변경 이력** — `policy_change_log` 의 condition_set 관련 행
- **트래블룰 결정 이력 export** — 기간 + 임계치 초과 행만 추출하여 정형 보고서

자세한 보고서 생성은 [감사 리포트](/compliance/regulations/reports) 참고.

## ​한계

- **정보 교환 미포함** — 노드월렛은 차단/허용만 함. 카운터파티 VASP 에 정보 전달은 외부 솔루션.
- **VASP 식별 정확도 의존** — 잘못 식별된 주소(non-VASP 인데 화이트리스트에 포함)는 보안 게이트 약화.
- **체인 메모 미검사** — 일부 트래블룰 구현은 트랜잭션 메모 필드에 ID 를 첨부 — 노드월렛은 메모 내용을 평가에 사용하지 않음.

## ​연관 페이지

## address_list 규칙

VASP 화이트리스트의 핵심 도구.

## AML / 자금세탁방지

트래블룰은 AML 의 한 축.⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
