<!--
source_url: https://docs.nodeinfra.com/security/index
path: /security/index
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 벤더 의존성을 최소화한 보안 모델 — 고객이 직접 키를 보유하고, 4축 격리로 자금을 지킵니다.
-->

# 보안 포털

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation개요보안 포털

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

## ​벤더 의존성 최소화 보안 모델

노드월렛의 보안 모델은 SaaS MPC · VASP 위탁과 다릅니다. 어느 쪽이 더 안전한 게 아니라 **서로 다른 리스크를 받아들이는 선택**이며, 노드월렛은 **벤더 의존성을 제거**하는 방향을 택합니다.

## VASP 위탁

**규제 위임 우선**
- 키: 위탁 기관 보관
- 정책: 위탁 기관
- 운영 부담: 낮음
**감수 리스크** — 위탁 기관 건전성 의존, 라이선스 종속, 정책 변경 시 외부 승인

## SaaS MPC

**빠른 도입 우선**
- 키: 벤더 샤드 보관
- 정책: 벤더 클라우드
- 운영 부담: 중간
**감수 리스크** — 벤더 탈취·폐업 시 자금 영향, 매 거래 외부 API 의존, 데이터 국외 이전

## 노드월렛

**벤더 無의존 우선**
- 키: 고객 HSM 내부
- 정책: 고객 SGX
- 운영 부담: 높음
**감수 리스크** — HSM·SGX 조달 및 키 세레머니 운영 부담
망분리 IDC · 벤더 無의존 · 데이터 국외 미이전이 필수인 고객이 **운영 복잡도**를 감수하고 노드월렛을 선택합니다. 자세한 기능·인증 비교는 [노드월렛 소개](/)에서 확인하세요.

## ​한 축이 뚫려도 나머지 축이 막습니다

노드월렛은 단일 방어선에 의존하지 않습니다. **4개의 직교 격리 축**이 동시에 성립해야 자금이 움직이며, 한 축이 탈취되어도 나머지 축이 구조적으로 거래를 차단합니다.
$!/$
$!/$

## ​1. 서비스 격리

체인에 나가는 모든 트랜잭션은 **3개의 독립된 서비스가 각자의 HSM 키로 서명**해야 통과합니다. 개시 → 승인 → 실행 세 게이트 중 하나라도 서명이 빠지면 거래는 거부됩니다.

- **개시 키** — 금융사 Spring 백엔드 + Java SDK가 서명. SDK·운영자 키 탈취에 대응.
- **승인 키** — 승인자가 정책 통과를 공동 서명. 정책 우회 시도를 차단.
- **실행 키** — SGX 엔클레이브가 체인 트랜잭션에 서명. 체인 서명 위조를 차단.

## 3-키 다중서명 자세히 보기

개시 · 승인 · 실행 3단계 서명 체인의 상세 흐름과 공격 시나리오.

## ​2. 테넌트 격리

각 테넌트는 고유한 `개시 키` · `승인 키` · `실행 키`를 보유합니다. 승인자와 SGX 엔클레이브는 공용 서비스지만 **키 세트는 테넌트별로 분리**되며, **SPKI-hash 바인딩**과 **payload tenant_id 검증**으로 테넌트 간 자금 흐름이 구조적으로 차단됩니다. 한 테넌트의 키가 탈취되어도 다른 테넌트의 자금은 영향받지 않습니다.

## 테넌트 격리 자세히 보기

테넌트별 개시 키, SPKI-hash 바인딩, payload tenant_id 검증 체계.

## ​3. 하드웨어 격리

모든 서명 키는 **FIPS 140-3 Level 3 HSM**(개시 키·승인 키) 또는 **Intel SGX 엔클레이브**(실행 키)에 봉인됩니다. HSM 외부로 평문 마스터 키가 노출된 적이 없으며, SGX 실드 블롭은 MRENCLAVE에 봉인되어 다른 이미지로는 언실 불가합니다.

## HSM

FIPS 140-3 Level 3, PKCS#11, 파티션 구조.

## TEE 엔클레이브

Intel SGX, MRENCLAVE 봉인, DCAP 원격 증명.

## ​4. 시간·증거 격리

모든 자금 이동은 **append-only 원장 + TEE 서명 영수증 + 주기 체크포인트** 3중 증거 체계로 기록됩니다. 작업별 TEE 영수증(Layer 1)이 실시간 사기를 차단하고, 해시 체인 체크포인트(Layer 2)가 사후 변조를 탐지합니다.

## 감사 로그 자세히 보기

Layer 1 실시간 방어 · Layer 2 사후 탐지 · 구조적 불변 조건.

## ​포털 구성

## 보안 아키텍처

3-키 다중서명, 테넌트 격리, 신뢰 경계, 망분리, 위협 모델.

## 키 관리

HSM(FIPS 140-3), Intel SGX TEE, 키 수명주기, 프로비저닝, 로테이션.

## 운영 보안

시스템 하드닝, 모니터링, 사고 대응, 백업/복구, 감사 로그.⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
