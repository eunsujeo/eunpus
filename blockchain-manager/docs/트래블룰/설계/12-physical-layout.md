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
    SVC["Service 백엔드<br/>출금·입금 유스케이스 · 상태 기계"]
    GATE["트래블룰 게이트 · 모듈<br/>라우터 + 어댑터"]
    WQ[("대기함<br/>사전 검증·승인 기록")]
    FBCLI["Fireblocks 스크리닝 클라이언트<br/>전용 API user · 요청 JWT 서명"]
    SEC[("시크릿 스토어 · KMS<br/>전용 API user API키·RSA 서명키")]
    RX["트래블룰 수신 컴포넌트<br/>별도 배포·얇게 · 공개 HTTPS 인바운드"]
    EN["우리 Enclave · VerifyVASP<br/>키·PII · 공개 HTTPS · 포트 21117"]
    CC["CODE-Cipher · CODE<br/>설치형 암호화 모듈"]
    AR["Address Registry<br/>개인지갑 등록·소유"]
  end

  HUB["VerifyVASP 중앙<br/>중계 · E2EE"]
  CV["CodeVASP 중앙<br/>중계"]
  NB["Notabene SaaS<br/>게이트웨이"]
  FB["Fireblocks · 벤더 SaaS<br/>스크리닝(validate) · Notabene 호스팅"]
  RVP["상대 VASP<br/>국내 · 해외"]

  SVC --- GATE
  GATE --- WQ
  GATE -.->|개인지갑| AR
  GATE -->|VerifyVASP 아웃바운드| EN
  GATE -->|CODE| CC
  GATE -->|validate 요청| FBCLI
  FBCLI -->|JWT 서명 · validate/full| FB
  FBCLI -.->|키 로드| SEC
  GATE -.->|직접 대안| NB
  EN --> RX
  RX -->|내부 API| SVC

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

- **트래블룰 게이트는 Service 백엔드 안 모듈**이다(파랑) — 자산 이동 경로가 아니라 업무층에 둔다(6·8장).
- **우리가 운영하는 설치물**(노랑) — VerifyVASP `Enclave`(키·PII·공개 HTTPS)·CODE `CODE-Cipher`(암호화 모듈)·트래블룰 `수신 컴포넌트`(별도 배포). 벤더가 강제하는 별도 배포물이라 우리 인프라 안에 새로 생긴다.
- **대기함**(초록)은 사전 검증·승인 기록 저장소 — 입금 대조의 재료(7.3·7.5).
- **외부 중앙**(회색) — VerifyVASP 중앙·CodeVASP·Notabene·Fireblocks. Notabene 는 경유(FB 통해)와 직접(대안) 둘 다 점선.
- **Fireblocks 스크리닝은 자산 경로 밖** — 트래블룰 검증 호출(`validate` → `validate/full`, 제출 전·자산 불이동)은 제출·전파(자산 이동, 범위 밖)를 타지 않고 전용 경로로 나간다(8장).
- **자격증명은 게이트 밖에 격리** — 게이트는 API user 키를 들지 않는다. **전용 API user(스크리닝 권한만)의 API키·RSA 서명키**는 **시크릿 스토어/KMS** 에 두고, 별도 **Fireblocks 스크리닝 클라이언트**가 로드해 요청 JWT 를 서명한다. 커스터디 등 다른 모듈의 API user 와 **분리**(다른 권한·자격증명) — VerifyVASP 키가 Enclave 에, CODE 키가 CODE-Cipher 에 격리되는 것과 같은 원리.

## 관련 장

- 게이트를 업무층 모듈로 두는 근거·포트-어댑터: **6장 · 8장**.
- 대기함 적재·대조가 실제로 도는 모습: **7.3 · 7.5**.
- 자체 설치물(Enclave·CODE-Cipher) 운영 요건·상호연동: **6장**.
- 외부 망 지형(도달성): **10장**.
