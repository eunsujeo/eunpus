<!--
source_url: https://docs.nodeinfra.com/security/architecture/trust-boundaries
path: /security/architecture/trust-boundaries
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: DMZ · 격리 구역 · 서명 서비스 · TEE — 경계마다 다른 인증 수단이 필요합니다.
-->

# 신뢰 경계

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation아키텍처신뢰 경계

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

노드월렛의 출금 요청은 하나의 매끄러운 흐름처럼 보이지만, 실제로는 **여러 신뢰 경계**를 통과합니다.
각 경계는 서로 다른 인증 수단과 검증 로직을 적용하며, 이전 경계의 신뢰를 그대로 이어받지 않습니다.
서명에 쓰이는 키들은 각자 다른 트러스트 도메인(HSM 또는 SGX 실드 블롭)에 상주합니다.

## ​경계 구조

$!/$

## ​경계별 인증

| 경계 | 통과 방법 | 검증 내용 |
| --- | --- | --- |
| 클라이언트 → 격리 구역 | TLS 1.3 + API 키 서명 (Ed25519, 60초 timestamp) + mTLS | 요청이 등록된 운영자에게서 왔고 변조되지 않았으며 정책을 통과함 |
| 격리 구역 → TEE | CBOR IPC (stdin/stdout) + DCAP 원격 증명 | MRENCLAVE가 일치하는 엔클레이브 이미지만 통과 |

## ​키별 보관 위치

| 키 | 보관 위치 | 접근 방식 |
| --- | --- | --- |
| 개시 키 | HSM 파티션 | 금융사 Spring 백엔드 + Java SDK가 PKCS#11로 호출 |
| 승인 키 | HSM 파티션 | 승인자가 PKCS#11로 호출 |
| 실행 키 | SGX 실드 블롭 (디스크) | 엔클레이브가EGETKEY로 언실 — HSM 접근 없음 |

## ​한 경계를 뚫어도

- **클라이언트만 뚫리면** — 승인자의 `승인 키` 공동 서명이 없으면 엔클레이브가 요청 자체를 거부. → [다중서명](/security/architecture/multisig)
- **격리 구역까지 뚫려도** — 엔클레이브는 CBOR IPC로만 통신하며, MRENCLAVE가 일치하는 이미지만 서명을 수행할 수 있음. DCAP 원격 증명을 거치지 않은 세션은 거부.
- **엔클레이브 호스트가 뚫리면** — SGX EPC 메모리는 CPU 내부 암호화로 RAM 덤프 불가. `sealed_blob`은 MRENCLAVE에 봉인되어 있어 다른 이미지로 언실 불가.
- **HSM 자체가 탈취되면** — FIPS 140-3 Level 3 물리 방호로 키 추출 불가. `실행 키`는 HSM 밖에 있어 HSM 손실 시에도 서명 서비스는 계속 동작.
⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
