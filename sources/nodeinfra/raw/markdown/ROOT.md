<!--
source_url: https://docs.nodeinfra.com/
path: /
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 국내 금융 및 가상자산 규제를 준수하는 온프레미스 스테이블코인 지갑 인프라
-->

# 노드월렛 기술 문서

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation노드월렛 기술 문서

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

## 데모

노드월렛을 활용하여 금융기관에서 구현 가능한 다양한 스테이블코인 금융 서비스들을 체험하세요.

## 백엔드 개발

노드월렛 Java SDK와 Spring으로 스테이블코인 백엔드를 구현하세요.

## 컴플라이언스

노드월렛에서 AML, KYC, 트래블룰 등 스테이블코인 컴플라이언스 정책들을 설정하세요.

## 보안

노드월렛을 망분리 환경에서 HSM을 사용하여 안전하게 운영하세요.
노드월렛은 은행, 카드사, PG/결제사, 증권사, 공공기관을 위한 온프레미스 스테이블코인 핫월렛 인프라입니다.
망분리 데이터센터에 설치하여 운영하며, 금융기관 내 각 부서가 자신의 업무 영역을 독립적으로 다룰 수 있도록 설계되었습니다:

- **개발팀** — 블록체인 서명 프로토콜을 밑바닥부터 구현하지 않으셔도 됩니다. Java SDK와 Spring Boot 자동 설정으로 HSM 연동·멱등성·타입 안전성까지 SDK가 알아서 처리합니다. → [백엔드 개발](/dev/quickstart)
- **컴플라이언스팀** — 규제가 바뀔 때마다 IT팀에 요청하고 배포를 기다리지 않으셔도 됩니다. 승인자 관리자 페이지에서 AML·KYC·트래블룰·제재 명단을 직접 조정하고, 감사 보고서도 원하는 시점에 바로 내보내세요. → [컴플라이언스](/compliance)
- **보안/운영팀** — 핫월렛 사고 뉴스를 보며 밤잠 설치지 않으셔도 됩니다. HSM(FIPS 140-3)과 Intel SGX TEE가 키를 보호하고, 3-키 다중서명이 단일 서비스 탈취를 차단합니다. → [보안](/security)

## ​다른 솔루션과의 비교

주요 커스터디 솔루션과의 구조적 차이입니다. (공개 문서 기준, 2026-04-16 조사)

| 항목 | VASP 하이브리드 | Cloud MPC 계열 | 노드월렛 (본 POC) |
| --- | --- | --- | --- |
| 제품 종류 | VASP + SaaS | SaaS | 설치형 소프트웨어 |
| 망분리 대응 | X | X | O |
| 배포 모드 | 클라우드 | 클라우드 | 망분리 IDC |
| 보안 모듈 | MPC | MPC | HSM + SGX |
| 키 소유권 | 벤더 샤드 보관 | 벤더 샤드 보관 | 고객 직접 보유 |
| 정책 실행 위치 | 벤더 클라우드 | 벤더 클라우드 | 고객 인프라 |
| 개발/운영 인증 | VASP, ISMS | SOC 2 | ISMS (예정) |
| 제품 보안/조달 인증 | — | — | 보안기능확인서, KCMVP, GS (진행중) |
| 적합 환경 | 국내 거래소 환경 | 글로벌 SaaS 환경 | 국내 금융기관 환경 |
| 외부 의존성 | SW + 정책 + 키(샤드) + 라이센스 | SW + 정책 + 키(샤드) | 없음 (SW 고객 설치 및 운영) |

각 항목의 근거 및 세부 비교는 [보안 아키텍처](/security) 및 [컴플라이언스](/compliance) 문서에서 확인하실 수 있습니다.⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
