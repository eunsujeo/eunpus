<!--
source_url: https://docs.nodeinfra.com/compliance/regulations/aml
path: /compliance/regulations/aml
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: OFAC·UN 제재 명단, 일일 한도, 속도 제한 — 정책 엔진이 AML 핵심 통제를 실시간 집행.
-->

# AML / 자금세탁방지

## AML 의 기술 요건

자금세탁방지(AML) 규제는 **거래 단위 통제**를 요구합니다. 노드월렛의 정책 엔진은 모든 출금·이체·스윕 트랜잭션이 체인에 나가기 전 다음 기술 통제를 자동 집행합니다.

| 요건 | 규칙 |
| --- | --- |
| 제재 명단 (OFAC SDN, UN, FATF blacklist) 차단 | address_list(blacklist) |
| 거액 단일 거래 임계치 | per_tx_amount_limit |
| 일일 누적 한도 | daily_withdrawal_limit |
| 고빈도 이상 거래 탐지 | velocity_window |
| 신규 카운터파티 검토 | address_cooldown |
| 사고 대응 | global_halt |

## 권장 AML 정책 구성

## 제재 명단 운영

OFAC SDN list 와 UN consolidated list 는 **공식 출처에서 정기 import** 합니다.

| 명단 | 출처 | 갱신 주기 | 형식 |
| --- | --- | --- | --- |
| OFAC SDN | treasury.gov/ofac/downloads | 매일 (변경 시) | XML / CSV |
| UN Security Council | un.org/securitycouncil/content/un-sc-consolidated-list | 변경 시 | XML / HTML |
| FATF High-Risk Jurisdictions | fatf-gafi.org | 분기 | PDF |

운영 절차:

1. 공식 사이트에서 명단 파일 다운로드 + 서명 검증
2. 노드월렛 condition_set 으로 import (SHA-256 + 시각을 description 에 기록)
3. 신규 condition_set 을 정책 규칙의 `condition_set_id` 로 가리키게 변경
4. 구 condition_set 보관 (감사용)

자세한 import 절차와 무결성 보장은 [내부 cert 팩 — AML Sanctions Coverage](https://github.com/nodeinfra/nodewallet/blob/master/docs/compliance/aml-sanctions-coverage.md) 참고.

## STR (Suspicious Transaction Report) 지원

의심거래보고(STR) 가 필요한 거래가 발견되면 다음 데이터로 보고서를 작성합니다.

| STR 필드 | 노드월렛 데이터 출처 |
| --- | --- |
| 거래 일시 | policy_decisions.decided_at |
| 송금자 정보 | policy_decisions.account_id→walletdb.wallets조인 |
| 수취자 주소 | policy_decisions.destination |
| 금액 / 토큰 | policy_decisions.amount/mint |
| 거래 ID | policy_decisions.request_id |
| 정책 결정 | policy_decisions.verdict |
| 적용된 규칙 | policy_decisions.triggered_rules |
| 해시 체인 | policy_decisions.chain_hash(증거 무결성) |

`policy_decisions` 의 해시 체인이 사후 변조를 차단하므로, 보고된 거래 데이터는 데이터 수정이 없었음을 증명할 수 있습니다.

## CTR (Currency Transaction Report) 임계치

대부분의 규제권은 **단일 거래 또는 일일 누적이 임계치**(예: 미국 USD 10,000 / 한국 KRW 1,000만원)를 초과할 경우 보고를 요구합니다.
권장 구성:

- `per_tx_amount_limit` — 임계치 자체를 차단 한도로 (운영자 검토 후 별도 절차)
- `approval_tier` — 임계치 초과 시 Held 처리 후 외부 승인 → 자동 STR/CTR 작성 워크플로 트리거

## 위험기반접근(RBA)

FATF 권장 RBA(Risk-Based Approach) — 고위험 고객에게 더 엄격한 통제. 노드월렛에서는:

1. **고객 등급 분리** — 고위험 고객의 wallet_id 를 `condition_sets` 로 묶음 (예: `high_risk_customers`)
2. **차등 규칙** — `expression` 으로 `wallet_id in high_risk_customers` 조건에 더 낮은 한도 적용
3. **EDD (Enhanced Due Diligence)** — 고위험 고객 거래는 모두 `approval_tier` 의 `SINGLE_APPROVE` 또는 `QUORUM_2_OF_3` 로 수동 검토

## 키워드별 정책 매핑

| AML 키워드 | 노드월렛 대응 |
| --- | --- |
| Sanctions screening | address_listdenylist + OFAC/UN import 절차 |
| Transaction monitoring | policy_decisions영구 기록 + 해시 체인 |
| Suspicious activity | velocity_window+ 별도 FDS +expression패턴 |
| CDD / Customer due diligence | wallet group → expression 차등 한도 |
| EDD / Enhanced due diligence | approval_tierHeld + 외부 승인 절차 |
| Politically Exposed Persons (PEP) | PEP 리스트 → condition_set →address_list(다만 PEP 는 송금자 정보로 식별, 노드월렛은 송금자보다 destination 중심) |
| Beneficial ownership | 노드월렛 범위 외 (KYC 시스템과 연계) |
| Travel rule | 트래블룰참고 |

## 한국 특정금융정보법 (특금법)

한국의 **특정금융정보법** 은 가상자산사업자(VASP) 에게 AML 의무를 부과합니다.

| 의무 | 노드월렛 대응 |
| --- | --- |
| 고객확인의무(CDD) | wallet_id와 KYC 시스템 연계 — 노드월렛 외부 |
| 의심거래보고(STR) | policy_decisions의 Held/Deny 행 → 보고 워크플로 트리거 |
| 고액현금거래보고(CTR) | per_tx_amount_limit+approval_tier으로 임계치 모니터링 |
| 트래블룰 (R.16) | 트래블룰참고 |

## 감사 증거

AML 감사 시 표준 산출물:

1. **정책 규칙 스냅샷** — 감사 시점의 `policy_rules` 전체 dump
2. **거부·보류 거래 목록** — 기간 내 `policy_decisions WHERE verdict IN ('REJECT', 'REQUIRE_APPROVAL')`
3. **변경 이력** — 같은 기간의 `policy_change_log`
4. **무결성 증거** — `policy_decisions` 의 해시 체인 검증 결과

정형 리포트는 [감사 리포트](/compliance/regulations/reports) 참고.

## 연관 페이지

## 트래블룰

FATF R.16 — VASP 간 카운터파티 정보 교환.

## address_list 규칙

OFAC/UN 명단 차단의 핵심 규칙.
