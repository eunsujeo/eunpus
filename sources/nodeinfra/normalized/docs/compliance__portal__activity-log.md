<!--
source_url: https://docs.nodeinfra.com/compliance/portal/activity-log
path: /compliance/portal/activity-log
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 관리자 변경·조회의 5년 영구 감사 로그 — 누가, 언제, 무엇을, IP/UA 포함.
-->

# 활동 로그

## 페이지 위치

**경로**: `/compliance/activity-log` · **데이터**: `consoledb.activity_log` (최근 200건, 시간 역순)
콘솔에서 발생한 **모든 변경 및 민감 조회**는 이 페이지에 기록됩니다. 활동 로그는 **append-only**이며 5년 이상 보관됩니다 (KCMVP 권장).

## 활동 유형

| 활동 | 배지 색상 | 의미 |
| --- | --- | --- |
| 규칙 생성 | done (녹색) | POST /v1/admin/policies성공 |
| 규칙 수정 | pending (주황) | PUT /v1/admin/policies/{id}성공 |
| 규칙 비활성화 | reject (적색) | is_active: false변경 |
| 규칙 재활성화 | success (청록) | is_active: true변경 |
| 정책 시뮬레이션 | neutral (회색) | dry-run 평가 호출 |
| 조회 (검색·목록·상세) | neutral | 지갑 조회, 결정 이력 조회 등 |
| 엑셀 내보내기 | neutral | CSV/Excel 다운로드 |

## 컬럼

| 컬럼 | 내용 |
| --- | --- |
| 분류 | 활동의 scope:compliance/policies/wallets/transactions/auth |
| 대상 | 영향받은 객체의 ID (예:policy_id,wallet_id) |
| 활동 유형 | 위 표의 활동 라벨 + 배지 |
| 상세 | 변경 내용의 요약 (triggered_rules,old → new등) |
| 관리자 ID | admin pubkey 앞 8자 + hover 전체 |
| 접속 IP | X-Forwarded-For또는 직접 IP. 마스킹 없음 (감사 목적). |
| UA | User-Agent. 브라우저·OS 분리 표시. |
| 시각 | KST |

## 무엇이 기록되는가

**기록되지 않는 것**:

- 단순 페이지 네비게이션 (홈 → 컴플라이언스 등)
- 정적 메뉴 토글 (사이드바 collapse 등)

## 무결성

활동 로그는 두 단계로 보호됩니다.

1. **append-only 트리거** — `consoledb.activity_log` 테이블은 UPDATE/DELETE 차단 트리거가 걸려 있습니다. INSERT 만 허용.
2. **외부 해시 체인 (선택)** — 일간 스냅샷의 SHA-256 을 다른 시스템(예: 별도 cold storage) 에 보관하여 사후 변조를 탐지.

내부 cert 팩 [policy-audit-trail.md](https://github.com/nodeinfra/nodewallet/blob/master/docs/compliance/policy-audit-trail.md) 에 무결성 검증 SQL이 포함됩니다.

## 필터 (개발 중)

상단의 필터(기간·분류·관리자)와 Excel export 버튼은 현재 비활성 상태입니다.

## 조회 한도

- 페이지 표시: 최근 200건
- 그 이전 데이터는 SQL 또는 별도 export 도구로 조회 (`SELECT * FROM activity_log WHERE created_at BETWEEN ...`)

## 감사 SQL 예시

```
-- 특정 관리자의 최근 24시간 활동
SELECT created_at, scope, kind, target_id, detail
FROM activity_log
WHERE admin_id = '...'
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- 규칙 변경 이력 (특정 규칙)
SELECT al.created_at, al.admin_id, al.kind, al.detail, pcl.old_data, pcl.new_data
FROM activity_log al
LEFT JOIN approverdb.policy_change_log pcl
  ON pcl.row_id::text = al.target_id
WHERE al.target_id = '...'
  AND al.scope = 'policies'
ORDER BY al.created_at;

-- 비정상 패턴: 짧은 시간에 다수 규칙 변경 (오용 탐지)
SELECT admin_id, COUNT(*) AS changes, MIN(created_at), MAX(created_at)
FROM activity_log
WHERE kind IN ('규칙 생성', '규칙 수정', '규칙 비활성화', '규칙 재활성화')
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY admin_id
HAVING COUNT(*) > 10;
```

## 보존

| 단계 | 보존 기간 |
| --- | --- |
| 핫 (콘솔 표시 가능) | 1년 |
| 웜 (DB 직접 조회) | 5년 |
| 콜드 (압축 백업) | 7년 (KCMVP 일치) |

자세한 보존 정책은 [감사 리포트 — 보존](/compliance/regulations/reports#%EB%B3%B4%EC%A1%B4-%EC%A0%95%EC%B1%85) 참고.

## 연관 페이지

## 감사 리포트

규제 제출용 정형 리포트로 변환.

## 결정 이력

실제 정책 결정 결과 (활동 로그는 변경 행위, 결정 이력은 정책 결과).
