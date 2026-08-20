<!--
source_url: https://docs.nodeinfra.com/security/ops/monitoring
path: /security/ops/monitoring
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: Prometheus · Grafana · 알림 라우팅 — 공격 징후를 실시간으로 탐지합니다.
-->

# 보안 모니터링

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation운영 보안보안 모니터링

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

노드월렛의 각 서비스는 보안 관련 메트릭을 **Prometheus 형식**으로 노출하고, **Grafana**에서 통합 대시보드를 제공합니다.
임계값 초과 시 알림이 PagerDuty · Slack · 이메일로 라우팅됩니다.

## ​관측 파이프라인

$!/$

## ​보안 관측 포인트

| 메트릭 유형 | 탐지 대상 |
| --- | --- |
| API 키 서명 검증 실패율 | 위조 요청 · 시간 동기화 문제 |
| 정책 거부율 (승인자) | 이상 거래 · 정책 오작동 |
| 서명 요청 대비 성공률 | 엔클레이브 이상 · HSM 연결 문제 |
| 잔액 검증 실패 | 원장 무결성 의심 |
| 트랜잭션 제출 실패율 | 체인 혼잡 · 키 로테이션 문제 |
| 감사 로그 해시 체인 이탈 | 변조 의심 |

알림 임계값 · PagerDuty · Slack 라우팅 · 대시보드 템플릿은 고객사 운영 정책에 맞춰 설계됩니다. 도입 시 노드인프라 팀과 협의하세요.⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
