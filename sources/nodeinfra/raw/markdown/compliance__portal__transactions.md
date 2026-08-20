<!--
source_url: https://docs.nodeinfra.com/compliance/portal/transactions
path: /compliance/portal/transactions
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 최근 정책 결정 100건을 시간 역순으로 — 판정·적용 규칙·거래 ID.
-->

# 결정 이력

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation포털 사용결정 이력

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

## ​페이지 위치

**경로**: `/compliance/transactions` · **데이터**: `policy_decisions` (최근 100건, 시간 역순)
이 페이지는 승인자가 내린 모든 결정을 **시간 역순**으로 보여줍니다. 자동 승인된 거래, 차단된 거래, 보류된 거래 모두 포함됩니다.

## ​페이지 구성

```
┌──────────────────────────────────────────────────────────────────┐
│  결정 이력                                                        │
│  총 1,247건 · 차단 38건 · 보류 12건                              │
├──────────────────────────────────────────────────────────────────┤
│  [작업 ▾] [판정 ▾] [규칙 ▾] [토큰 ▾] [기간 ▾]                    │
├──────────────────────────────────────────────────────────────────┤
│  시각    │ 작업    │ 토큰 │ 금액  │ 보낸   │ 받는   │ 판정 │ 사유 │
│  14:32   │ 출금    │ SOL  │ 5.2   │ 8FE...3│ 7BA...c│ 차단 │ ofac │
│  14:28   │ 입금    │ USDC │ 1000  │ 9XD...a│ 6CB...e│ 승인 │  —   │
│  14:25   │ 내부송금│ SOL  │ 0.1   │ 5AF...f│ 8B2...c│ 승인 │  —   │
│  ...                                                              │
└──────────────────────────────────────────────────────────────────┘
```

## ​헤더 카운터

- **총 N건** — 최근 100건 (페이지에 표시된 행 수)
- **차단 M건** — 그 중 `verdict = REJECT` 인 건수
- **보류 K건** — 그 중 `verdict = REQUIRE_APPROVAL` (현재 Held 상태) 인 건수

## ​컬럼

| 컬럼 | 의미 |
| --- | --- |
| 시각 | KST (UTC+9) 표시. DB는decided_at TIMESTAMPTZ. |
| 작업 | flow_type라벨: “입금” (녹색), “출금” (foreground), “내부송금” (회색) |
| 토큰 | mint의 ticker (NATIVE_SOL→ “SOL”, SPL 은supported_tokens.symbol) |
| 금액 | amount(단위 변환 적용).tabular-nums정렬. |
| 보낸 주소 | 출금: 옴니버스 지갑 / 입금: 외부 송금자 —4...4축약 + hover copy |
| 받는 주소 | destination—4...4축약 |
| 판정 | AUTO_APPROVE(자동 승인 / 청록),HELD(보류 / 주황),DENY(차단 / 적색) |
| 적용된 규칙 | triggered_rulesJSONB 의rule_name+reason. 비어있으면 ”—“ |
| 거래 ID | request_idUUID 의 앞 8자. hover 시 전체 UUID. |

## ​판정 배지

```
[ 자동 승인 ]  — 청록 (#10B981 soft bg)
[   보류   ]  — 주황 (#F59E0B soft bg)
[   차단   ]  — 적색 (#EF4444 soft bg)
```

콘솔 `decision-badge.tsx` 컴포넌트의 토큰 색상 매핑입니다.

## ​필터 (개발 중)

상단 필터 바는 현재 플레이스홀더입니다. 출시 후 가능한 조합:

- **작업** — 입금 / 출금 / 내부송금 다중 선택
- **판정** — 자동 승인 / 보류 / 차단 다중 선택
- **적용된 규칙** — 특정 규칙명으로 필터 (예: `daily_withdrawal_limit` 만)
- **토큰** — mint 선택
- **기간** — 시작·종료 시각

## ​거부 사유 분석

`triggered_rules` 의 `rule_name` 별 적중률은 컴플라이언스 운영의 핵심 KPI 입니다. 다음 SQL 로 즉시 계산할 수 있습니다.

```
-- 최근 7일 거부 사유 분포
SELECT
  jsonb_array_elements(triggered_rules)->>'rule_name' AS rule,
  COUNT(*) AS hits
FROM policy_decisions
WHERE verdict = 'REJECT'
  AND decided_at > NOW() - INTERVAL '7 days'
GROUP BY rule
ORDER BY hits DESC;
```

규제 제출용 정형 리포트는 [감사 리포트](/compliance/regulations/reports) 참고.

## ​해시 체인

각 행은 `chain_hash = SHA-256(prev_hash || ...)` 로 이전 행에 묶여 있습니다. 콘솔은 해시 컬럼을 표시하지 않지만, 감사관이 SQL 로 체인 무결성을 검증할 수 있습니다.

```
-- 체인 연속성 검증 (예시; 실제 hash 계산은 별도 도구로)
SELECT seq, prev_hash, chain_hash
FROM policy_decisions
WHERE decided_at::date = '2026-05-12'
ORDER BY seq;
```

자세한 해시 체인 구조는 [내부 cert 팩 — Policy Audit Trail](https://github.com/nodeinfra/nodewallet/blob/master/docs/compliance/policy-audit-trail.md) 참고.

## ​Held 행의 동적 동작

`HELD` 행은 시간이 지나며 같은 `request_id` 의 후속 결정으로 **추가 행**이 생길 수 있습니다 (재평가 결과). 같은 `request_id` 의 여러 결정은 시간순으로 추적 가능합니다.

```
SELECT decided_at, verdict, triggered_rules
FROM policy_decisions
WHERE request_id = '...'
ORDER BY decided_at;
```

## ​연관 페이지

## 지갑 조회

특정 지갑에 대한 결정만 시간순으로 보기.

## 결정 라이프사이클

Allow / Held / Deny 의 의미와 전환 조건.⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
