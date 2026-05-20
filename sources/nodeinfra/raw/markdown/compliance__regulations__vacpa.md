<!--
source_url: https://docs.nodeinfra.com/compliance/regulations/vacpa
path: /compliance/regulations/vacpa
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 2024-07-19 시행 가상자산이용자보호법(가이법) — 이상거래 탐지, 이중 승인, 거래 지연 등 기술 요건 매핑.
-->

# 가상자산이용자보호법

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation국내·국제 규제가상자산이용자보호법

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

## ​가상자산이용자보호법 개요

**가상자산이용자보호법**(약칭 가이법)은 2024년 7월 19일 시행된 한국의 가상자산 이용자 보호 법률입니다. 핵심 요건:

1. **이상거래 상시 감시** — 정상 패턴 벗어난 거래의 실시간 탐지
2. **이용자 자산 보호** — 예치금·자산의 분리 보관, 분리 운영
3. **사고 대응** — 해킹·횡령 발생 시 즉시 출금 정지 의무
4. **불공정 거래 방지** — 시세조종·미공개 정보 이용 방지

## ​시행령상 기술 요건과 노드월렛 매핑

### ​1. 이상거래 상시 감시 (시행령 제7조)

| 요건 | 노드월렛 |
| --- | --- |
| 단시간 다수 거래 탐지 | velocity_window |
| 비정상 고액 거래 탐지 | per_tx_amount_limit,approval_tier |
| 미식별 주소 검토 | address_cooldown |
| 거부·보류 거래 기록 | policy_decisions영구 보관 (해시 체인) |

### ​2. 사고 대응 — 출금 즉시 정지 (제10조)

해킹·횡령 발생 시 노드월렛은 단일 토글로 출금 정지가 가능합니다.

```
{
  "rule_type": "global_halt",
  "flow_type": "withdrawal",
  "mint": "*",
  "priority": 10,
  "config": { "reason": "보안 사고 #2026-05-12-001 — 조사 중" }
}
```

활성화하면 즉시 핫리로드되어 모든 출금이 거부됩니다. [`global_halt`](/compliance/rules/global-halt) 참고.

### ​3. 이중 승인 (제11조)

일정 금액 이상의 거래는 이중 승인 의무. [`approval_tier`](/compliance/rules/approval-tier) 의 `SINGLE_APPROVE` 또는 `QUORUM_2_OF_3` 모드로 구현.

```
{
  "rule_type": "approval_tier",
  "flow_type": "withdrawal",
  "mint": "NATIVE_SOL",
  "priority": 80,
  "config": {
    "min_amount_lamports": 100000000000,
    "max_amount_lamports": 9223372036854775807,
    "approval_mode": "QUORUM_2_OF_3"
  }
}
```

100 SOL 이상 출금은 2-of-3 의식 승인 필요.

### ​4. 거래 지연 (제12조)

이상거래 의심 시 거래 진행을 일시 정지할 수 있어야 합니다. [`address_cooldown`](/compliance/rules/address-cooldown) 으로 신규 주소 거래를 자동 보류.

```
{
  "rule_type": "address_cooldown",
  "flow_type": "withdrawal",
  "mint": "*",
  "priority": 60,
  "config": {
    "cooldown_seconds": 86400,
    "max_amount_during_cooldown_lamports": 1000000000
  }
}
```

신규 출금 주소에 대해 1 SOL 초과는 24시간 동안 자동 Held.

### ​5. 운영 시간 통제 (가이드라인)

영업시간 외 출금 제한이 필요한 경우 [`time_window`](/compliance/rules/time-window).

### ​6. 감사 추적 (시행령 제15조)

모든 거래 결정과 정책 변경은 영구 기록되어야 합니다.

| 데이터 | 보관 위치 | 보관 기간 |
| --- | --- | --- |
| 거래 정책 결정 | policy_decisions(append-only, 해시 체인) | 5년 이상 |
| 정책 변경 이력 | policy_change_log(append-only) | 5년 이상 |
| 콘솔 활동 | consoledb.activity_log(append-only) | 5년 이상 |
| 체인 서명 이벤트 | auditdb.signing_events(해시 체인 + TEE 서명) | 영구 |

## ​권장 가이법 정책 세트

$!/$

## ​”이상거래” 정의의 운영 절차

이상거래 탐지는 **결정적 규칙(노드월렛)** 과 **확률적 모델(별도 FDS)** 의 결합이 일반적입니다.

| 단계 | 시스템 |
| --- | --- |
| 1. 실시간 1차 차단 | 노드월렛 정책 엔진 (velocity_window,per_tx_amount_limit) |
| 2. ML 기반 패턴 탐지 | 외부 FDS (transaction monitoring) |
| 3. FDS 탐지 결과 → 정책 반영 | 의심 wallet UUID 를 condition_set 에 추가 → expression 규칙 |
| 4. 보고 의무 발생 시 STR | 외부 보고 워크플로 |

노드월렛 단독으로 모든 이상 패턴을 잡지는 않습니다 — 외부 FDS 와 결합해 운영합니다.

## ​자산 분리 보관 (제3조)

가이법은 이용자 예치금과 자체 자산의 분리 보관을 요구합니다. 노드월렛은 **테넌트 격리** 모델로 이를 지원합니다.

- 테넌트별 별도 `개시 키` · `승인 키` · `실행 키`
- SPKI-hash 바인딩 + payload tenant_id 검증
- 정책도 테넌트별로 격리 (한 테넌트의 규칙이 다른 테넌트에 영향 없음)

자세한 모델은 [보안 포털 — 테넌트 격리](/security/architecture/tenant) 참고.

## ​감독·보고

금융감독원·금융정보분석원(FIU) 의 검사·보고 요구 발생 시:

| 요구 | 데이터 |
| --- | --- |
| 특정 기간 거부 거래 | policy_decisions WHERE verdict='REJECT' AND decided_at BETWEEN ... |
| 특정 wallet 의 모든 거래 | policy_decisions WHERE account_id = ... |
| 특정 거래의 결정 근거 | policy_decisions.triggered_rules+ 해시 체인 검증 결과 |
| 정책 규칙 스냅샷 | policy_rules의 특정 시점 (변경 이력으로 재구성) |

[감사 리포트](/compliance/regulations/reports) 페이지의 표준 SQL 쿼리로 즉시 생성 가능.

## ​시정조치·과징금 대응

위반 발견 시 금융위·금감원은 시정조치, 임원 해임 권고, 과징금을 부과할 수 있습니다. 노드월렛의 cert 패키지(자세한 내용은 [내부 cert 팩](https://github.com/nodeinfra/nodewallet/blob/master/docs/compliance/compliance-evidence-pack.md))는 다음을 입증합니다.

- 정책 규칙이 시행 시점에 활성화되어 있었음 (`policy_change_log`)
- 규칙 변경은 정당한 운영자에 의한 것이었음 (`policy_change_log.created_by`)
- 결정 결과는 사후 변조되지 않았음 (`policy_decisions` 해시 체인)

## ​연관 페이지

## AML / 자금세탁방지

가이법 + 특금법 중첩 영역 — 제재 명단, 한도.

## 전자금융거래법

또 다른 한국 규제 — 영업시간, 한도 관리.⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
