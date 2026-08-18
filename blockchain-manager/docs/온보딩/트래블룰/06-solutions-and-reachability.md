---
title: 트래블룰 솔루션 — 구조와 상대 VASP 도달성
status: Done
date: 2026-08-18
view: grid
group: 솔루션과 운영
---

# 트래블룰 솔루션 비교

솔루션을 고를 때 기능 목록보다 먼저 확인할 것은 실제 거래 상대에게 도달할 수 있는가다. 같은 IVMS101을 사용하더라도 회원망, 상호운용 범위, 양사 실사, 관할 규칙, 자산·네트워크 지원이 맞지 않으면 거래할 수 없다.

## 세 솔루션의 기본 구조

```mermaid
flowchart TB
    OUR[우리 VASP]

    OUR --> VE[VerifyVASP Enclave]
    VE --> VC[VerifyVASP Central Server]
    VC --> RE[상대 VASP Enclave]

    OUR --> CA[CODE API 또는 Cipher]
    CA --> CC[CODE Central Server]
    CC --> RC[CODE·상호연동 VASP]

    OUR --> NA[Notabene API]
    NA --> NP[Notabene Protocol Router]
    NP --> RN[Notabene·상호연동 VASP]

    classDef ours fill:#fcd535,stroke:#181a20,color:#181a20,font-weight:bold
    classDef local fill:#fff3cd,stroke:#d6a800,color:#181a20
    classDef hub fill:#e8f0fe,stroke:#4a90e2,color:#181a20
    classDef peer fill:#e8f7f5,stroke:#2dbdb6,color:#181a20
    class OUR ours
    class VE,CA,NA local
    class VC,CC,NP hub
    class RE,RC,RN peer
```

| 항목 | VerifyVASP | CODE | Notabene |
|---|---|---|---|
| 기본 형태 | VASP 내부 Enclave·DB와 중앙 중계 | 중앙 API, 암호화 payload, 선택형 Cipher 모듈 | SaaS API·정책·웹훅·임베디드 UI |
| 출금 핵심 | 계정·사용자 사전 검증 후 txHash 보고 | 사전 승인 후 결과 보고 | transfer 생성·검증·정책 판정 |
| 입금 보완 | 사전 검증 ID 기반 상태 확인 | TXID 기반 Post-verification 지원 | Deposit Assist로 누락 정보 수집 |
| 개인정보 | VASP 간 E2EE, 중앙 서버 비복호화 설명 | VASP 간 암호화·요청 서명 | IVMS101 PII와 transfer 처리, self-encryption 경로 제공 |
| 개인지갑 | VASP 자체 정책과 결합 | 제품 흐름 확인 필요 | 서명·소액전송·화면·자기선언 지원 |
| 운영 부담 | Enclave·DB·공개 HTTPS·백업 운영 | API 서명·키·암호화와 수신 API 운영 | API·웹훅·정책·대시보드 운영 |

## VerifyVASP

VerifyVASP는 각 VASP 인프라에 Enclave와 전용 DB를 배치하고 Central Server가 요청을 중계한다. VASP 백엔드는 Enclave API를 호출하고, Enclave가 암복호화와 중앙 서버 통신을 담당한다.

### 출금 흐름

1. 수신 VASP 목록과 계정·주소를 확인한다.
2. 송금인·수취인 IVMS101을 포함한 User Verification을 요청한다.
3. 요청 접수 시 verification UUID를 받고 비동기 결과를 기다린다.
4. 수신 VASP가 고객 KYC와 수취인 정보를 대조한다.
5. 승인되면 온체인 전송한다.
6. txHash·vout을 verification UUID에 연결해 보고한다.

### VASP가 운영할 표면

- Verify User Account API
- Verify User API
- Check Transaction Status API
- Callback API
- Enclave 전용 DB와 키·백업·보존 정책
- Central Server가 접근할 공개 HTTPS endpoint와 방화벽

Central Server가 개인정보를 복호화·저장하지 않는다는 설명과 우리 Enclave DB에 검증정보·키가 저장된다는 사실을 구분한다. `중앙 무저장`을 전체 시스템 무저장으로 해석하지 않는다.

## CODE

CODE 공식 문서는 Pre-verification과 Post-verification 두 흐름을 제공한다.

### Pre-verification

1. VASP 목록과 공개키를 조회한다.
2. 목적지 주소가 수신 VASP 소유인지 확인한다.
3. 암호화한 개인정보와 거래 정보를 보내 자산 이전 승인을 요청한다.
4. 승인 후 온체인 전송한다.
5. 거래 결과를 상대에게 전달한다.

### Post-verification

사전 정보 교환을 완료하지 못한 입금은 TXID로 송신 VASP를 탐색하고, 탐색에 성공하면 필요한 정보를 사후 교환한다. 사전 기록이 없는 입금을 다룰 때 VerifyVASP의 verification UUID 기반 조회와 구분되는 중요한 차이다.

### 요청 보안

CODE 요청은 nonce, UTC 시각, 송신 VASP 공개키, Ed25519 서명, 송신 alliance 식별자를 헤더에 사용한다. 암호화된 요청에는 수신 VASP 공개키도 사용한다. 공개키가 교체돼 불일치 오류가 나면 새 키를 조회하고 제한적으로 재시도한다.

## Notabene

Notabene Transact는 transfer 생성, 상대 탐색, 관할별 개인정보 요구, 정책 판정, 웹훅, 개인지갑 증명 UI를 함께 제공한다.

### 주요 특징

- IVMS101 기반 개인정보 모델
- 관할·금액별 Presentation Definition
- VASP와 개인지갑 분류
- 서명·소액전송·화면·자기선언 소유 증명
- Withdrawal Assist·Deposit Assist·Counterparty Assist
- Fireblocks와 travel rule message 연동
- 고객 측 암호화를 통한 직접 전달 경로

개인지갑에는 VASP 간 메시지를 보낼 상대가 없어 transfer 최종 상태가 `SENT`가 아니라 `SAVED`가 될 수 있다. 이 상태를 VASP 검증 성공과 같은 의미로 매핑하지 않는다.

## 상호운용과 도달성

기술 연결과 실제 거래 가능을 나눠 확인한다.

| 단계 | 확인 질문 |
|---|---|
| 프로토콜 연결 | 두 솔루션 사이 메시지 변환 경로가 있는가 |
| 회원 디렉터리 | 상대 VASP가 검색되는가 |
| 정책 승인 | 양측이 서로 실사를 완료하고 거래를 허용했는가 |
| 방향 | 출금과 입금이 모두 가능한가 |
| 자산·네트워크 | 같은 심벌의 실제 네트워크까지 일치하는가 |
| 필수 필드 | 상대 프로토콜의 추가 개인정보를 제공할 수 있는가 |
| 운영 상태 | 상대 서버·콜백·키가 현재 정상인가 |

CODE는 VerifyVASP·GTR·Sygna 등과의 기술 상호운용을 설명하지만, 대시보드에 보이는 VASP가 내부 정책상 실제 연결됐다는 뜻은 아니라고 명시한다. 특히 VerifyVASP 연동 거래소와의 경로는 국내 거래만 지원된다는 제한을 안내한다.

상대 VASP가 여러 경로에서 보이면 다음 우선순위를 정책 데이터로 관리한다.

1. 양방향 운영 검증이 완료된 직접 연결
2. 국내 상호연동 경로
3. 글로벌 프로토콜 라우팅
4. 고객 소명·수동 처리
5. 지원하지 않는 상대

업무 코드에 `국내면 VerifyVASP, 해외면 Notabene` 같은 고정 분기를 넣지 않는다.

## 선택 기준

| 기준 | 확인할 내용 |
|---|---|
| 상대 도달성 | 주요 거래 상대와 양방향 실거래 가능 여부 |
| 규제 범위 | 국내·해외 관할과 개인지갑 정책 지원 |
| 데이터 모델 | IVMS101 정본과 제품 확장·필수 필드 차이 |
| 개인정보 | 암호화 주체, 저장 위치, 국외 이전, 삭제·백업 |
| 동기·비동기 | 출금 UX, 콜백, timeout, 사후 보완 흐름 |
| 장애 처리 | 재시도, 중복, 메시지 보존, 수동 운영 |
| 배포 운영 | Enclave·Cipher·API·웹훅·DB 운영 부담 |
| 감사 | 요청·판정·필드·상대·운영자 추적 가능성 |
| 계약 | 가격, SLA, 지원, 사고 통지, 데이터 처리 조건 |

## 도입 전에 수행할 연결 테스트

- 자연인·법인 출금 성공과 이름 불일치 거절
- 네트워크·주소·memo/tag 불일치
- 임계값 경계와 상대 관할의 추가 요구
- 상대 VASP callback 지연·중복·순서 역전
- txHash 보고 누락과 재전송
- 사전 메시지 없는 입금의 사후 탐색
- 개인지갑 서명·소액 전송·수동 증명
- 공개키 교체와 서명 오류
- 제품 장애 중 fail-close 동작
- 개인정보 삭제·백업 복원·감사 추출

제품 비교표만으로 도입을 확정하지 않는다. 우리가 실제 거래해야 하는 상위 상대 VASP 목록으로 양방향 연결 테스트를 통과한 경로를 운영 경로로 등록한다.
