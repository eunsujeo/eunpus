<!--
source_url: https://docs.nodeinfra.com/security/keys/lifecycle
path: /security/keys/lifecycle
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 생성 · 봉인 · 활성 · 교체 · 폐기 — FIPS 140-3 요구사항에 따른 전체 수명 관리.
-->

# 키 수명주기

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation키 관리키 수명주기

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

노드월렛의 모든 키는 **5단계 수명주기**를 따릅니다.
각 단계 전환은 권한 검증과 증인 서명을 필요로 하며, 모든 이벤트는 append-only 감사 로그에 기록됩니다.

## ​수명주기 상태

$!/$

## ​각 상태의 의미

| 상태 | 의미 | 전환 요건 |
| --- | --- | --- |
| 생성 (Generated) | HSM 내부에서 생성된 상태 | 보안 책임자 + M-of-N 증인 |
| 봉인 (Sealed) | 키 봉투가 물리 보관소에 격납되어 사용 대기 | 봉투 서명 + 보관 위치 기록 |
| 활성 (Active) | 실제 서명에 사용 중 | 활성화 명령 + 감사 로그 |
| 교체 (Rotating) | 신규 키와 이전 키가 동시에 유효 | 로테이션 개시 승인 |
| 폐기 (Revoked) | HSM에서 제거, 다시 사용 불가 | 폐기 명령 + 확인 증인 |

## ​감사 로그 이벤트

수명주기의 모든 전환은 다음 형식으로 기록됩니다:

- `key.generated` — 키 생성, 생성 세레머니 참여자 서명
- `key.sealed` — 봉투 보관 위치, 봉인 해시
- `key.activated` — 활성화 시각, 활성화 승인자
- `key.rotation.started` — 로테이션 개시, 병행 기간 설정
- `key.rotation.completed` — 신규 키 단독 활성
- `key.revoked` — 폐기 사유 (정기/긴급/탈취 의심)

## ​폐기 조건

키는 다음 조건에서 즉시 폐기됩니다:

- **탈취 의심** — 이상 징후 탐지 시 즉시 폐기 + 신규 키로 로테이션
- **정기 로테이션** — 조직 정책에 따른 주기적 교체 (연 1회 권장)
- **하드웨어 교체** — HSM 모듈 교체 시 기존 키 폐기
- **인증 만료** — FIPS 인증 주기 만료 시 재생성
⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
