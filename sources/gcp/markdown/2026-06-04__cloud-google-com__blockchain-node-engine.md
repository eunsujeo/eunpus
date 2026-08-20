# Google Cloud Blockchain Node Engine (BNE) — extracted

> **출처**: Google Cloud 공식 문서 <https://cloud.google.com/blockchain-node-engine/docs/overview> (→ docs.cloud.google.com 리다이렉트), docs landing, product page. WebFetch 추출 2026-06-04.
> **fact tier**: official-vendor (Google Cloud 공식). 단 일부 하위 페이지(supported-networks / create-ethereum-node / secure-blockchain-nodes)는 404 또는 truncated → 해당 항목은 "doc 미확인" 으로 표기.
> meta: `../webpages/docs.cloud.google.com/blockchain-node-engine.meta.yml`

## 확정 (공식 문서 직접 확인)

- **정의**: "a fully-managed node-hosting service for Web3 development" — 기업이 **트랜잭션 relay, 스마트컨트랙트 배포, 블록체인 데이터 read/write** 를 할 수 있게 한다. Google Cloud 컴퓨트·네트워크 인프라 위에 구축.
- **관리형 운영**: 단일 작업(single-operation) 배포(region + network 선택), **multi-day genesis sync 지연 제거**, Google Cloud 상시 모니터링, **장애 시 자동 재시작(automatic restart during outages)**, **SLA 제공**, 전담 DevOps 필요 감소. (자체 호스팅 노드의 configurability 는 유지)
- **지원 체인**: **Ethereum 우선** — "Ethereum is the first blockchain supported by Blockchain Node Engine". Ethereum **Mainnet + Testnet**. (향후 확장 가능성 시사하나 본 문서엔 미상세)
- **접근 방식**: **REST API + RPC API** (docs 에 두 reference 모두 존재).
- **문서 구성(docs 섹션)**: What is BNE / Before you begin / Create a blockchain node / Audit logging / REST API / RPC API / Pricing / Quotas and limits / Release notes.
- **학습 자료**: "Running a Dedicated Ethereum RPC Node in Google Cloud"(90분), "Blockchain Node Hosting on Google Cloud"(45분).

## doc 미확인 (이번 fetch 로 확인 못 함 — fabrication 금지)

- 노드 타입(full / archive) 구분 — overview 미명시.
- 실행/합의 클라이언트(geth / erigon / lighthouse 등) — 미명시.
- 보안 접근 메커니즘 구체(Private Service Connect / allowlist / Cloud Armor DDoS / IAM) — secure 페이지 404.
- JSON-RPC / WebSocket 엔드포인트·인증 상세 — 미명시(REST/RPC API 존재만 확인).
- Pricing 수치, region 목록, quota 한도 — 미수집(Pricing/Quotas 섹션 존재만 확인).
- Ethereum 외 추가 체인 — 본 문서 기준 없음(Ethereum first).

## 분류 (BNE 의 성격)

- **전용(dedicated) 관리형 노드** 모델 — Alchemy/QuickNode 의 멀티테넌트 **공용 RPC** 와 대비. 내 전용 노드를 Google 이 운영.
- 표준 노드 인터페이스(RPC) 중심 — Alchemy Transfers / QuickNode Streams 류 **enhanced/indexing API 는 BNE 자체엔 없음**(별도 인덱싱 필요). (← overview/docs 범위 기반 추론, doc 명시 아님)
