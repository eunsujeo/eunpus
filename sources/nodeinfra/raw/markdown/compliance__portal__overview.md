<!--
source_url: https://docs.nodeinfra.com/compliance/portal/overview
path: /compliance/portal/overview
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 컴플라이언스 포털 — 규칙 등록·전환, 결정 이력 조회, 지갑 타임라인, 변경 감사 로그.
-->

# 포털 개요

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation포털 사용포털 개요

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

## ​포털이 무엇인가

**컴플라이언스 포털**은 노드월렛 콘솔의 한 섹션으로, 컴플라이언스 팀이 [정책 엔진](/compliance/architecture) 의 규칙을 **재배포 없이** 운영할 수 있게 합니다. 모든 변경은 Ed25519 서명된 Admin API 호출로 백엔드 승인자에 전달되며, `policy_change_log` 에 변경 이력이 영구 기록됩니다.
$!/$

## ​권한 모델 (4-role)

콘솔의 모든 페이지는 4 단계 권한으로 게이팅됩니다. 권한 적용은 **백엔드에서 강제**되며 콘솔 UI 는 1차 방어선 역할만 합니다.

| Role | 규칙 페이지 | 결정 이력 | 지갑 조회 | 활동 로그 |
| --- | --- | --- | --- | --- |
| admin | 등록·전환 | 조회 | 조회 | 조회 |
| operator | 등록·전환 | 조회 | 조회 | 조회 |
| auditor | 읽기 전용 | 조회 | 조회 | 조회 (전권) |
| viewer | 읽기 전용 | 조회 | 조회 | 조회 |

> **편집 vs 비활성화** — 현재 콘솔에서는 규칙 “편집” 버튼이 비활성화되어 있습니다. 변경하려면 비활성화 → 신규 등록 2단계로 진행합니다. 이렇게 하면 `policy_change_log` 에 “기존 규칙 종료 시각” 과 “신규 규칙 시작 시각” 이 명확하게 남아 감사 추적이 단순해집니다.

## ​페이지 구성

## 입금 통제

`flow_type=deposit` 규칙 등록·관리. 비정상 입금·VASP 화이트리스트.

## 출금 통제

`flow_type=withdrawal` 규칙. 한도·이중승인·OFAC·영업시간.

## 내부 거래 통제

`flow_type=transfer` 규칙. 빈도·승인 단계 제어.

## 결정 이력

최근 정책 결정 100건, 판정·적용 규칙·거래 ID.

## 지갑 조회

주소·UUID 로 단일 지갑의 90일 활동 타임라인.

## 활동 로그

관리자 변경·조회의 5년 영구 감사 로그.

## ​L자형 레이아웃

콘솔은 사이드바 + 톱바 + 메인 영역의 L자형 레이아웃입니다.

- **좌측 사이드바** — 섹션 스위처(자산/컴플라이언스/보안) + 컴플라이언스 5개 메뉴 (홈 / 정책 관리 / 트랜잭션 / 지갑 조회 / 활동 로그)
- **상단 톱바** — 브레드크럼 + 테마 토글 + 로그아웃
- **메인** — 페이지 헤더 + 필터 바 + 컨텐츠

진입 경로 `/compliance` 는 **컴플라이언스 홈 대시보드** 입니다 — 최근 정책 판정 요약, 활성 규칙 수, 최근 변경 활동을 한눈에 보여줍니다.

## ​라우팅 규칙

| 콘솔 경로 | 의미 |
| --- | --- |
| /compliance | 컴플라이언스 홈 대시보드 |
| /compliance/rules | 정책 관리 (기본: 입금 흐름) |
| /compliance/rules?flow=deposit | 입금 규칙 |
| /compliance/rules?flow=withdrawal | 출금 규칙 |
| /compliance/rules?flow=transfer | 내부 이체 규칙 |
| /compliance/transactions | 결정 이력 |
| /compliance/wallet-lookup | 지갑 조회 (?address=또는?id=쿼리로 북마크 가능) |
| /compliance/activity-log | 활동 로그 |

> 구 버전 (`/compliance/{deposit,withdrawal,internal}-rules` 3 페이지) 은 `/compliance/rules?flow=...` 한 페이지로 통합됐습니다. 흐름 전환은 페이지 상단의 토글로 이뤄집니다.

## ​인증

콘솔은 운영자의 Ed25519 keypair 로 로그인합니다. keypair 는 운영자 단말의 보안 모듈(macOS Keychain / Windows DPAPI / YubiKey)에 보관되며, **콘솔 자체는 keypair 를 보관하지 않습니다**.
로그인 시퀀스:

1. 운영자가 keypair 로 로그인 챌린지에 서명
2. 백엔드가 `consoledb.admins` 에서 pubkey 일치 + role 확인
3. 세션 토큰 발급 (httpOnly Secure SameSite=Strict 쿠키, 8h TTL)
4. 이후 모든 콘솔 API 호출은 토큰 + Ed25519 재서명(쓰기 작업)

자세한 토큰 모델은 [내부 설계 — console-backend-spec](https://github.com/nodeinfra/nodewallet/blob/master/docs/design/console-backend-spec.md) 참고.

## ​핵심 디자인 원칙

콘솔의 시각 디자인은 **데이터 우선 · 차분한 프로페셔널리즘** 입니다.

- 모든 액션은 **2단계 확인** (특히 비활성화·재활성화)
- 결정 배지는 단색 (자동 승인 = 청록, 보류 = 주황, 차단 = 적색)
- 숫자는 `tabular-nums` 로 자리수 정렬
- 주소·TxID 는 `4...4` 축약 + hover 시 full copy
- 페이지 전체 로딩 스피너 금지 — 스켈레톤 사용

자세한 디자인 시스템은 콘솔 저장소의 [DESIGN.md](https://github.com/nodeinfra/nodewallet/blob/master/console/DESIGN.md) 참고.⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
