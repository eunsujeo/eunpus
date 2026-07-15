---
title: 12. 물리 배치 — 트래블룰 구성요소가 어디에 앉나
status: To Do
---

트래블룰 구성요소가 지갑 기반 배치 위 어디에 앉는지를 한 장에 그린다. 게이트를 왜 그 자리에 두는지의 근거는 6·8장이고, 이 장은 그 결론을 배치도로 요약한다.
지갑 기반 배치(커스터디·자산 이동 인프라)는 별도 물리 배치 문서에 있고, 여기서는 **트래블룰 구성요소만** 얹는다 — 제출·온체인 전파(자산 이동 경로)는 이 문서 범위 밖이다.

```mermaid
flowchart TB
  subgraph OURS["우리 인프라"]
    direction TB
    SVC["월렛(Service) 백엔드<br/>유스케이스 · 상태 흐름 · 매칭·귀속 판단"]
    GATE["컴플라이언스 서비스 · 별도 서비스<br/>라우터 + 어댑터 · 솔루션 연동 전담"]
    WQ[("대기함 · 컴플라이언스 DB<br/>사전 검증·승인 기록")]
    FBCLI["Fireblocks 스크리닝 클라이언트<br/>컴플라이언스 서비스 안 · 전용 API user · JWT 서명"]
    SEC[("시크릿 스토어 · KMS<br/>전용 API user API키·RSA 서명키")]
    RX["트래블룰 수신 컴포넌트<br/>별도 배포·얇게 · 공개 HTTPS 인바운드"]
    EN["우리 Enclave · VerifyVASP<br/>키·PII · 공개 HTTPS · 포트 21117"]
    CC["CODE-Cipher · CODE 직접 시<br/>조건부 설치물 (6장)"]
    AR["Address Registry<br/>개인지갑 등록·소유"]
  end

  HUB["VerifyVASP 중앙<br/>중계 · E2EE"]
  CV["CodeVASP 중앙<br/>중계"]
  NB["Notabene SaaS<br/>게이트웨이"]
  FB["Fireblocks · 벤더 SaaS<br/>스크리닝(validate/full) · Notabene 호스팅"]
  RVP["상대 VASP<br/>국내 · 해외"]

  SVC -->|TravelRuleChannel 호출| GATE
  GATE -->|귀속·실명 확인 조회 · 검증 기록 전달| SVC
  GATE --- WQ
  GATE -.->|개인지갑| AR
  GATE -->|VerifyVASP 아웃바운드| EN
  GATE -.->|CODE 직접 시| CC
  GATE -->|validate/full 요청| FBCLI
  FBCLI -->|JWT 서명 · validate/full| FB
  FBCLI -.->|키 로드| SEC
  GATE -.->|직접 대안| NB
  EN --> RX
  RX -->|위임| GATE

  EN <--> HUB
  CC <--> CV
  FB -.->|경유| NB
  HUB <--> RVP
  CV <--> RVP
  NB <--> RVP

  classDef ours fill:#dbeafe,stroke:#2563eb;
  classDef store fill:#dcfce7,stroke:#16a34a;
  classDef selfhost fill:#fef3c7,stroke:#d97706;
  classDef vendor fill:#f5f5f7,stroke:#86868b;
  classDef chain fill:#eef2ff,stroke:#818cf8;
  class SVC,GATE,FBCLI ours
  class WQ,SEC,AR store
  class RX,EN,CC selfhost
  class HUB,CV,NB,FB vendor
  class RVP chain
```

## 배치의 요점

색 — 파랑: 우리 서비스, 노랑: 자체 운영 설치물, 초록: 저장소, 회색: 외부 중앙. 점선은 조건부·대안 경로.

- **설치물 중 벤더가 강제하는 것은 Enclave 뿐** — 수신 컴포넌트는 인바운드 접점을 얇게 나눈 우리 선택(8·13장), CODE-Cipher 는 CODE 직접 어댑터를 붙일 때만 생긴다(6장).
- **대기함은 컴플라이언스 서비스가 보관(컴플라이언스 DB)** — 입금 도착 시 월렛의 입금 확인 질의에 대조 결과로 답한다(7.3·7.5).
- **스크리닝 호출은 자산 경로 밖** — `validate/full` 은 제출·전파를 타지 않고 전용 경로로 나간다(8장).
- **자격증명은 코드·설정 밖** — 전용 API user(스크리닝 용도 전용)의 키는 시크릿 스토어/KMS 에 두고, 서비스 안 스크리닝 클라이언트가 로드한다. 커스터디 등 다른 서비스의 자격증명과 분리.
