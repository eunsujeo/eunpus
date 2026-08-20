<!--
source_url: https://docs.nodeinfra.com/security/architecture/multisig
path: /security/architecture/multisig
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 3개의 독립된 서비스가 각자의 HSM 키로 서명해야 체인 트랜잭션이 나갑니다. 한 서비스가 탈취되어도 나머지 키가 거래를 막습니다.
-->

# 3-키 다중서명

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation아키텍처3-키 다중서명

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

노드월렛의 체인 트랜잭션은 **3개의 독립된 서비스가 각자 자신의 HSM 키로 서명**해야 체인에 나갑니다.
어느 하나라도 서명이 빠지면 트랜잭션은 거부됩니다.
3개 키는 **개시 → 승인 → 실행**의 3단계 역할 분담을 구현합니다:

- **개시 키** — 요청이 시작됐음을 증명. 금융사 Spring 백엔드가 Java SDK를 통해 서명하며, Withdraw · Transfer · Unsafe-send · Sweep 모든 작업의 개시 서명을 담당합니다.
- **승인 키** — 정책 엔진이 규칙 통과를 공동 서명으로 증명.
- **실행 키** — 엔클레이브가 체인 트랜잭션에 실제 서명.

| 단계 | 키 | 소유 서비스 | 역할 |
| --- | --- | --- | --- |
| 개시 | 개시 키 | 금융사 Spring 백엔드 + Java SDK | 모든 작업의 개시 서명 |
| 승인 | 승인 키 | 승인자 (정책 엔진) | 정책 통과 공동 서명 |
| 실행 | 실행 키 | Intel SGX 엔클레이브 | 체인 트랜잭션 서명 |

엔클레이브가 발행하는 서명과 영수증은 [감사 로그](/security/ops/audit-logs)의 **Layer 1**을 구성하여, 원장 변조를 통한 자금 탈취를 실시간으로 차단합니다.

## ​서명 흐름

$!/$

1. 금융사 Spring 백엔드가 Java SDK를 통해 `개시 키`로 요청을 서명하여 승인자에 전달
2. 승인자가 정책을 평가하고, 통과하면 `승인 키`로 co-sign
3. SGX 엔클레이브가 `실행 키`로 Ed25519 서명 (직후 키 제로화) 후 체인 제출

## ​작업별 차이

| 작업 | 체인 서명 | 설명 |
| --- | --- | --- |
| Withdraw · Unsafe-send · Sweep | ✓ | 체인 트랜잭션. 3키 전부 사용. 개시 주체는 항상 Java SDK로, Sweep도 Withdraw와 동일한 서명 경로를 따릅니다. |
| Transfer | — | 내부 원장 이동.개시 키+승인 키만 서명하고, 체인 서명 대신 엔클레이브verify_and_authorize영수증이감사 로그 Layer 1에 기록됩니다. |
| Deposit | — | 관찰 경로. 체인 이벤트를 수집·검증하므로 서명 의식에 포함되지 않으며, 입금된 자금의 이동은Sweep에서 3키 의식을 거칩니다. |

## ​키 탈취 시나리오

| 탈취된 키 | 공격자가 할 수 있는 것 | 막히는 지점 |
| --- | --- | --- |
| 개시 키만 | 요청 위조 시도 | 승인자가 정책 위반으로 차단 →승인 키co-sign 없음 |
| 승인 키만 | 정책 우회 시도 | 유효한개시 키서명 없이는 요청 자체가 도달하지 않음 |
| 실행 키만 | 체인 서명 시도 | 개시 서명 없이는 서명 대상 요청 자체가 생성되지 않음 |
| HSM 전체 탈취 | 개시 키·승인 키접근 시도 | FIPS 140-3 Level 3 물리 방호 — 탈취되어도 키 추출 불가.실행 키는 SGX에 실링되어 HSM과 독립 —HSM참고 |
| SGX 호스트 탈취 | 실행 키서명 시도 | sealed blob은 MRENCLAVE에 봉인 — 다른 이미지로 언실 불가, EPC 메모리는 CPU 내부 암호화 —TEE 엔클레이브참고 |

⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
