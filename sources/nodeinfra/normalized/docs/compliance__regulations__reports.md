<!--
source_url: https://docs.nodeinfra.com/compliance/regulations/reports
path: /compliance/regulations/reports
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 규제 제출용 정형 리포트 — 거부 사유 통계, 규칙별 적중률, 변경 이력, 무결성 증거.
-->

# 감사 리포트

## 표준 리포트 카탈로그

규제기관·외부 감사·내부 감사에 자주 제출되는 5종 리포트입니다.

| 리포트 | 데이터 출처 | 산출 빈도 |
| --- | --- | --- |
| 거부 사유 통계 | policy_decisions WHERE verdict='REJECT' | 일·주·월 |
| 규칙 적중률 | policy_decisions.triggered_rules집계 | 월 |
| 정책 변경 이력 | policy_change_log | 분기·반기 |
| 고액 거래 보고서 (CTR) | policy_decisions WHERE amount > 임계치 | 일 |
| 무결성 증거 | policy_decisions.chain_hash검증 결과 | 분기 |

## 거부 사유 통계

기간 내 각 규칙이 얼마나 거부했는지 통계.

```
SELECT
  jsonb_array_elements(triggered_rules)->>'rule_name' AS rule_name,
  COUNT(*) AS deny_count,
  SUM(amount) AS total_amount_blocked,
  COUNT(DISTINCT account_id) AS affected_accounts
FROM policy_decisions
WHERE verdict = 'REJECT'
  AND decided_at BETWEEN '2026-04-01' AND '2026-05-01'
GROUP BY rule_name
ORDER BY deny_count DESC;
```

샘플 결과:

| 규칙 | 거부 건수 | 차단 금액 (lamports) | 영향받은 지갑 |
| --- | --- | --- | --- |
| daily_withdrawal_limit | 142 | 50,000,000,000 | 27 |
| address_list(OFAC) | 3 | 5,000,000,000 | 3 |
| time_window | 87 | 12,000,000,000 | 41 |
| per_tx_amount_limit | 31 | 28,000,000,000 | 19 |

## 규칙 적중률

활성 규칙 중 얼마나 자주 트리거되는지 — “유효한 통제” vs “사문화된 규칙” 식별에 사용.

```
WITH active_rules AS (
  SELECT id, rule_type, mint, priority FROM policy_rules WHERE is_active
),
deny_hits AS (
  SELECT
    jsonb_array_elements(triggered_rules)->>'rule_name' AS rule_name,
    COUNT(*) AS hits
  FROM policy_decisions
  WHERE decided_at > NOW() - INTERVAL '30 days'
  GROUP BY rule_name
)
SELECT
  ar.id,
  ar.rule_type,
  ar.mint,
  ar.priority,
  COALESCE(dh.hits, 0) AS hits_30d
FROM active_rules ar
LEFT JOIN deny_hits dh ON dh.rule_name = ar.rule_type
ORDER BY hits_30d DESC;
```

`hits_30d = 0` 인 활성 규칙은 다음 중 하나입니다:

1. 정상 동작 — 위반이 없어서 발화 안 됨 (예: global_halt)
2. 사문화 — 규칙이 너무 느슨해 의미 없음
3. 우선순위 이전 규칙에 가려짐

## 정책 변경 이력

기간 내 모든 규칙 변경 + 누가·언제.

```
SELECT
  pcl.changed_at,
  pcl.table_name,
  pcl.operation,
  pcl.row_id AS policy_id,
  pcl.changed_by,
  pcl.old_data->>'rule_type' AS rule_type,
  CASE pcl.operation
    WHEN 'INSERT' THEN '신규 등록'
    WHEN 'UPDATE' THEN
      CASE
        WHEN (pcl.old_data->>'is_active')::bool AND NOT (pcl.new_data->>'is_active')::bool THEN '비활성화'
        WHEN NOT (pcl.old_data->>'is_active')::bool AND (pcl.new_data->>'is_active')::bool THEN '재활성화'
        ELSE '수정'
      END
    WHEN 'DELETE' THEN '삭제'
  END AS action
FROM policy_change_log pcl
WHERE pcl.changed_at BETWEEN '2026-04-01' AND '2026-05-01'
  AND pcl.table_name = 'policy_rules'
ORDER BY pcl.changed_at DESC;
```

## 고액 거래 보고서 (CTR)

법정 임계치를 초과한 모든 거래(자동 승인 포함) — STR/CTR 보고 대상 후보.

```
SELECT
  decided_at AT TIME ZONE 'Asia/Seoul' AS kst_time,
  request_id,
  account_id,
  mint,
  amount,
  destination,
  verdict,
  jsonb_pretty(triggered_rules) AS rules
FROM policy_decisions
WHERE flow_type = 'withdrawal'
  AND amount >= 10000000000  -- 임계치 (예: 10 SOL × 10^9)
  AND decided_at BETWEEN '2026-04-01' AND '2026-05-01'
ORDER BY decided_at DESC;
```

`mint` 별로 임계치가 다르므로 실제 운영에서는 토큰별 분리 쿼리 또는 라이브 환율 조인.

## 무결성 증거

`policy_decisions` 해시 체인의 연속성 검증.

```
-- 인접 행의 chain_hash ↔ prev_hash 매칭 검증
WITH ordered AS (
  SELECT seq, prev_hash, chain_hash,
         LAG(chain_hash) OVER (ORDER BY seq) AS expected_prev
  FROM policy_decisions
  WHERE decided_at BETWEEN '2026-04-01' AND '2026-05-01'
)
SELECT seq, prev_hash, expected_prev,
       CASE WHEN prev_hash = COALESCE(expected_prev, 'GENESIS')
            THEN 'OK' ELSE 'BROKEN' END AS chain_status
FROM ordered
WHERE prev_hash != COALESCE(expected_prev, 'GENESIS');
```

`BROKEN` 행이 하나라도 나오면 체인 변조 신호 — 즉시 사고 대응.

## 보존 정책

| 데이터 | 보존 기간 |
| --- | --- |
| policy_decisions(정책 결정) | 5년 이상 (가이법·전금법) |
| policy_change_log(정책 변경) | 5년 이상 |
| auditdb.signing_events(체인 서명) | 영구 (TEE 서명 영수증 + 해시 체인) |
| consoledb.activity_log(콘솔 활동) | 5년 이상 |
| condition_sets변경 이력 | 5년 (제재 명단 import 추적) |

자세한 보존 정책과 cold storage 절차는 [내부 cert 팩 — Compliance Evidence Pack](https://github.com/nodeinfra/nodewallet/blob/master/docs/compliance/compliance-evidence-pack.md) 참고.

## CSV / Excel Export (개발 중)

콘솔의 [활동 로그](/compliance/portal/activity-log) 와 [결정 이력](/compliance/portal/transactions) 페이지에 Excel export 버튼이 추가될 예정입니다. 출시 전까지는 위 SQL 쿼리를 직접 실행해 CSV 로 export 합니다.

```
# psql 로 CSV export 예시
psql approverdb -c "\COPY ( <쿼리> ) TO 'report.csv' WITH (FORMAT csv, HEADER true);"
```

## 정형 리포트 자동화 (계획)

향후 다음 자동화가 추가됩니다.

1. **월간 자동 리포트** — 매월 1일 00:00 자동 실행, PDF + CSV
2. **임계치 기반 알람** — `daily_withdrawal_limit` 적중률이 평균의 3 표준편차 초과 시 슬랙/이메일
3. **STR/CTR 자동 작성** — 임계치 초과 거래에 대해 자동 폼 작성 (운영자 검토 후 제출)
4. **콘솔 리포트 탭** — 그래프·다운로드 버튼 포함

## 외부 감사 시 표준 산출물

ISO 27001 / SOC 2 / KCMVP / 가이법 검사 시 다음 패키지 준비:

| 산출물 | 위치 |
| --- | --- |
| 정책 규칙 현황 | policy_rulessnapshot (감사 시점) |
| 거부·보류 거래 30일 | 위 SQL |
| 변경 이력 1년 | policy_change_log |
| 무결성 검증 결과 | 해시 체인 검증 SQL 결과 |
| 시스템 가용성 메트릭 | 별도 모니터링 시스템 (Prometheus 등) |
| HSM 재검증 결과 | hw-revalidation-pack.md |

자세한 산출물 패키지 구성은 [내부 cert 팩 — Compliance Evidence Pack](https://github.com/nodeinfra/nodewallet/blob/master/docs/compliance/compliance-evidence-pack.md) 참고.

## 연관 페이지

## 컴플라이언스 아키텍처

데이터가 어디서 어디로 흐르는지.

## 활동 로그 페이지

콘솔에서 직접 활동 이력 확인.
