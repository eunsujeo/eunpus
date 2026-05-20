<!--
source_url: https://docs.nodeinfra.com/compliance/rules/global-halt
path: /compliance/rules/global-halt
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 모든 트랜잭션을 즉시 차단하는 사고 대응용 킬스위치. 토큰 단위 적용 가능.
-->

# global_halt — 전체 차단

## 한 줄 요약

활성화되어 있으면 평가된 모든 요청에 대해 **무조건 Deny** 를 반환합니다. 사고 대응·규제 긴급 명령 시 사용하는 킬스위치입니다.

## Config 스키마

```
{
  "reason": "긴급 점검 — 사고 #2026-05-12-001 조사 중"
}
```

| 필드 | 타입 | 필수 | 기본값 | 의미 |
| --- | --- | --- | --- | --- |
| reason | string | optional | "global halt active" | 거부 사유 메시지. 콘솔 결정 이력에 표시됨. |

## 평가 로직

```
fn evaluate(ctx):
    Deny { rule_name: "global_halt", message: config.reason }
```

DB 조회 없음. EvaluationContext 미사용. **항상 Deny**.

## 적용 가능한 Flow

- ✅ `withdrawal`
- ✅ `deposit` (입금된 자금의 스윕 차단 효과)
- ✅ `transfer`

## 사용 패턴

### 1) 전체 정지

```
{
  "rule_type": "global_halt",
  "mint": "*",
  "priority": 10,
  "config": { "reason": "보안 점검" }
}
```

모든 토큰, 모든 흐름에 대해 출금 정지. 사고 대응의 첫 액션.

### 2) 특정 토큰만 정지

```
{
  "rule_type": "global_halt",
  "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "priority": 10,
  "config": { "reason": "USDC 발행사 사고 — 자체 점검" }
}
```

USDC mint 주소만 명시 → USDC 출금만 차단, SOL·다른 SPL 은 계속 처리.

### 3) Flow 별 정지

규칙은 flow_type 별로 등록되므로, 입금 통제 페이지에서 등록하면 **스윕만** 정지하고 출금은 계속할 수 있습니다.

## 운영 권장사항

- **우선순위 10** — 다른 모든 규칙보다 먼저 평가되도록.
- **비활성화 = 해제** — global_halt 를 켰다 끌 때는 새 행을 등록하지 말고, 기존 행을 `is_active: false` 로 토글하세요. 이력 추적이 단순해집니다.
- **사유 의무화** — `reason` 을 비워두지 마세요. 결정 이력의 사유 컬럼이 비면 사후 감사 시 컨텍스트 복구가 어렵습니다. 사고 번호·조사 담당자 정도는 포함.

## 콘솔 폼 매핑

| 폼 필드 | DB config 키 |
| --- | --- |
| reason(텍스트, optional) | config.reason |

## 감사 흔적

- **변경**: `policy_change_log` — 등록·전환 시 `old_data` / `new_data` 기록
- **발화**: 매 Deny 마다 `policy_decisions` 에 INSERT, `triggered_rules = [{"rule_name": "global_halt", "reason": "..."}]`

## 한계

- 이미 진행 중인 평가(아직 응답 안 한 요청)에는 다음 평가부터 적용됨 (race window 약 1초)
- 입금된 자금이 옴니버스에 이미 도착한 상태라면, 그 자금을 외부로 빼내는 출금까지 막으려면 **별도로 withdrawal flow 의 global_halt** 도 활성화해야 합니다.
