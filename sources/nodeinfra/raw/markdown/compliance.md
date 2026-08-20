<!--
source_url: https://docs.nodeinfra.com/compliance
path: /compliance
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 승인자(정책 엔진)로 AML · KYC · 트래블룰 등 스테이블코인 컴플라이언스 정책을 실시간으로 집행합니다.
-->

# 컴플라이언스 포털

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation시작하기컴플라이언스 포털

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

## ​승인자 — 정책 엔진

노드월렛의 **승인자(정책 엔진)**는 모든 출금·전송·스윕 트랜잭션이 체인에 나가기 전에 정책 위반 여부를 검사하고, 통과한 요청에 대해서만 HSM에 보관된 정책 키로 공동 서명(co-sign)하는 독립된 서비스입니다. 컴플라이언스 팀이 정의한 규칙이 **코드 배포 없이 실시간**으로 집행되며, 정책 위반 요청은 체인 서명 단계에 도달조차 하지 않습니다.

- **망분리 환경 내부 서비스** — 코디네이터와 별도 프로세스(포트 8091)로 분리 운영, 단일 장애점 제거
- **HSM 기반 정책 키** — 정책 키는 PKCS#11 HSM 내부에서만 사용, 승인자 호스트가 탈취되어도 서명 불가
- **3-키 다중서명의 한 축** — `개시 키` · `승인 키` · `실행 키` 중 정책 엔진이 담당하는 `승인 키`

승인자의 역할이 보안 모델 안에서 어떻게 자리잡는지는 [보안 포털 — 3-키 다중서명](/security/architecture/multisig) 에서 확인할 수 있습니다.

## ​포털 구성

## 컴플라이언스 아키텍처

코디네이터 ↔ 승인자 ↔ HSM ↔ 콘솔 ↔ 원장 — 결정이 어디서 나고 어디로 기록되는지.

## 결정 라이프사이클

Allow · Held · Deny 3가지 판정, 우선순위 평가, hot reload, Held 큐 재평가.

## 컴플라이언스 포털 사용

규칙 등록·전환, 결정 이력 조회, 지갑 타임라인, 활동 로그.

## 규칙 레퍼런스

10종 규칙의 설정 스키마, 평가 로직, 콘솔 폼 매핑.

## 규제 매핑

AML · KYC · 트래블룰 · 가상자산이용자보호법 · 전자금융거래법.

## 감사 리포트

규제 제출용 거부 사유 통계 · 규칙 적중률 · 변경 이력 export.

## ​정책 규칙 한눈에 보기

승인자는 10종의 규칙을 조합하여 정책을 구성합니다. 규칙은 `approverdb.policy_rules` 테이블에 저장되며, [컴플라이언스 포털](/compliance/portal/overview) 또는 Admin API 로 조회·수정할 수 있습니다.

| 규칙 | 용도 | 상세 |
| --- | --- | --- |
| global_halt | 전체 또는 토큰별 출금 즉시 차단 | 사고 대응, 규제 긴급 명령 |
| address_list | 허용/차단 주소 리스트 (allowlist · denylist) | OFAC/UN 제재 명단, 트래블룰 VASP |
| address_cooldown | 출금 주소별 쿨다운 시간 | 이상 거래 지연 검토 |
| daily_withdrawal_limit | 일일 출금 한도 (지갑·토큰 단위) | AML 일일 한도 관리 |
| velocity_limit | 일일 출금 건수 제한 | 이상 거래 탐지 (FDS) |
| velocity_window | 슬라이딩 윈도우 금액·건수 제한 | 고빈도 이체 제한 |
| per_tx_amount_limit | 단일 트랜잭션 금액 상한 | 고액 거래 분리 승인 |
| approval_tier | 금액 구간별 수동 승인 요구 | 이중 승인 체계 |
| time_window | 운영 시간대 외 차단 | 영업시간 외 거래 차단 |
| expression | 필드/연산자 조합 커스텀 규칙 | 기관 고유 규칙 |

요청이 들어오면 승인자는 활성 규칙을 **우선순위 순서대로 평가**하여 **하나라도 Deny 면 즉시 거부**하고, 모두 통과한 경우에만 정책 키로 서명합니다. 자세한 흐름은 [결정 라이프사이클](/compliance/decision-lifecycle) 참고.

## ​규제 대응

승인자의 실시간 정책 집행은 다음 규제·가이드라인의 기술적 요구사항을 충족하도록 설계되었습니다.

- **AML / 자금세탁방지** — 일일 한도, 속도 제한, 제재 명단(OFAC/UN) 필터 — [상세](/compliance/regulations/aml)
- **KYC / 고객확인** — 고객 등급(tier)별 차등 한도 및 승인 요구 — [상세](/compliance/regulations/kyc)
- **트래블룰 (FATF R.16)** — 카운터파티 VASP 식별·허용 목록 관리 — [상세](/compliance/regulations/travel-rule)
- **가상자산이용자보호법** — 이상 거래 탐지, 이중 승인, 거래 지연 — [상세](/compliance/regulations/vacpa)
- **전자금융거래법** — 운영 시간대 제한, 한도 관리, 감사 추적 — [상세](/compliance/regulations/efta)
⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
