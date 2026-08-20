<!--
source_url: https://docs.nodeinfra.com/compliance/regulations/efta
path: /compliance/regulations/efta
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 전자금융거래법(전금법) — 영업시간 제한, 한도 관리, 감사 추적의 기술 요건 매핑.
-->

# 전자금융거래법

## 전자금융거래법 적용 범위

**전자금융거래법**(약칭 전금법) 은 전자적 수단을 통한 금융 거래에 적용되는 한국의 기본 규제입니다. 가상자산이 전금법의 직접 적용 대상인지는 사업 형태에 따라 다르지만, **노드월렛을 전통 금융 백오피스와 결합해 운영하는 은행·PG·증권사**는 전금법의 기술 요건을 동시에 충족해야 합니다.

## 시행령상 기술 요건과 노드월렛 매핑

### 1. 영업시간 제한 (시행규칙 별표)

은행·PG는 야간·휴일 거래를 제한할 의무가 있습니다. [`time_window`](/compliance/rules/time-window) 로 구현.

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

KST 09:00 ~ 18:00 외 출금 차단.

### 2. 1일 한도 / 1회 한도 관리

전금법 시행령은 고객 등급별 1일·1회 한도를 요구합니다.

| 규칙 | 매핑 |
| --- | --- |
| 1회 한도 | per_tx_amount_limit |
| 1일 한도 | daily_withdrawal_limit |
| 등급별 차등 | expression으로 wallet_id 그룹 분기 |

### 3. 인증 의무 (제15조)

거래 시 본인 확인 인증이 요구됩니다. 노드월렛 범위 밖이지만, **개시 키** 가 본인 확인을 거친 운영자/시스템에서만 사용되도록 보장하는 것은 노드월렛 책임. [3-키 다중서명](/security/architecture/multisig) 참고.

### 4. 부정거래 방지 (제22조)

| 요건 | 노드월렛 |
| --- | --- |
| 비정상 거래 차단 | velocity_window,per_tx_amount_limit |
| 본인 미인증 거래 차단 | 개시 키검증 (백엔드 책임) |
| 사고 시 즉시 정지 | global_halt |

### 5. 감사 추적 (제24조)

5년 이상의 거래 기록 보관 의무. 노드월렛의 `policy_decisions` 와 `signing_events` 가 영구 기록을 제공합니다.

## 권장 전금법 정책 세트 (은행 · PG)

## 전금법과 가이법의 중첩

| 영역 | 전금법 | 가이법 | 노드월렛 대응 |
| --- | --- | --- | --- |
| 영업시간 | 명시 | 미명시 | time_window(전금법용) |
| 1일/1회 한도 | 명시 | 권고 | daily_withdrawal_limit,per_tx_amount_limit |
| 사고 정지 | 명시 | 명시 | global_halt |
| 본인 확인 | 명시 | 명시 | KYC 시스템 +개시 키 |
| 감사 5년 | 명시 | 명시 | policy_decisions등 영구 |
| 이중 승인 | 권고 | 명시 | approval_tier |

두 법 모두 적용되는 사업자(예: 은행이 운영하는 가상자산 서비스)는 두 법의 가장 엄격한 요건을 기준으로 정책을 구성합니다.

## 한도값 권장 (참고)

전금법 시행규칙의 한도 (전자지급결제대행업자 기준 — 가상자산은 약간 다른 기준 적용 가능):

| 등급 | 1회 한도 | 1일 한도 |
| --- | --- | --- |
| 1등급 (신원확인 + 추가 인증) | 1억원 | 5억원 |
| 2등급 (신원확인) | 500만원 | 2,000만원 |
| 3등급 (간이확인) | 50만원 | 200만원 |

실제 가상자산 사업의 한도는 사업자별 정책 + 감독기관 협의 결과에 따릅니다. 위 값은 참고용.

## 시스템 가용성 (시행령 별표)

전금법은 시스템 가용성 보장도 요구합니다 (99.9% 등). 노드월렛의 가용성 보장:

- **승인자 분리 프로세스** — 단일 장애점 제거 (포트 8091 별도)
- **HSM HA** — Luna HA group binding
- **fail-closed** — 승인자 장애 시 출금 정지 (가용성 < 무결성)

가용성 vs 무결성 트레이드오프에서 **무결성을 우선**합니다 — 승인자 장애로 출금이 정지되는 것이 결정 우회보다 안전.

## 감사 산출물

| 감독 요구 | SQL / 출처 |
| --- | --- |
| 특정 영업시간 외 거래 차단 증거 | policy_decisions WHERE triggered_rules @> '[{"rule_name": "time_window"}]' |
| 한도 초과 차단 증거 | policy_decisions WHERE triggered_rules @> '[{"rule_name": "daily_withdrawal_limit"}]' |
| 본인 확인 미통과 차단 | 개시 키검증 로그 (별도 보안 로그) |
| 사고 시 출금 정지 증거 | policy_change_log의global_halt활성화 시각 +policy_decisions의 즉시 거부 행 |

자세한 보고서 생성은 [감사 리포트](/compliance/regulations/reports) 참고.

## 연관 페이지

## 가상자산이용자보호법

가이법과 전금법은 같은 기관에 같이 적용되는 경우가 많음.

## time_window 규칙

영업시간 제한의 핵심 도구.
