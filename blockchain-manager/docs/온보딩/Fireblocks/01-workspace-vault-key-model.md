---
title: Fireblocks — Workspace·Vault·키 모델
status: Done
date: 2026-08-19
view: grid
group: 플랫폼
---

# Workspace와 키 경계

Workspace는 Fireblocks의 사용자·역할·Policy·MPC 키·감사 설정이 묶이는 기본 보안 경계다. Vault Account는 그 안에서 고객·상품·treasury 같은 자산 운영 단위를 표현한다.

## Workspace 분리 기준

| 분리 축 | 분리하는 이유 | 함께 두었을 때의 위험 |
|---|---|---|
| Production / Test | 키·자산·API·Policy 실수 격리 | 테스트 요청이 실자산 경로에 도달 |
| Hot·Warm / Cold | 서명 장치와 운영 절차가 다름 | 온라인 자동화와 오프라인 통제가 혼재 |
| 법인 | 권한·감사·계약·규제 주체 분리 | 법인 간 자산·운영 책임 혼동 |
| 고객 상품 / Treasury | 승인·한도·운영 시간이 다름 | 넓은 Policy와 역할이 모든 자산에 적용 |
| Direct Custody / Embedded Wallets | 키 구조와 일부 공유 설정이 다름 | 제품별 설정 충돌과 운영 복잡성 증가 |

[Fireblocks 공식 Direct Custody 개요](https://developers.fireblocks.com/docs/overview)는 Vault Account마다 자산별 wallet을 두고, workspace의 master key와 Vault Account ID를 이용해 wallet을 파생하는 구조를 설명한다. Workspace 분리는 파생 키·정책·감사 경계에 영향을 주므로 단순 UI 폴더처럼 다루지 않는다.

## Vault Account 모델

```mermaid
flowchart TB
    W[Workspace]
    W --> VC1[Vault: 고객 A]
    W --> VC2[Vault: 고객 B]
    W --> VT[Vault: Treasury]
    VC1 --> A1[ETH asset wallet]
    VC1 --> A2[BTC asset wallet]
    A1 --> D1[ETH address]
    A2 --> D2[BTC address 1]
    A2 --> D3[BTC address 2]

    classDef ws fill:#fcd535,stroke:#181a20,color:#181a20,font-weight:bold
    classDef vault fill:#fff3cd,stroke:#d6a800,color:#181a20
    classDef asset fill:#e8f0fe,stroke:#4a90e2,color:#181a20
    classDef addr fill:#e8f7f5,stroke:#2dbdb6,color:#181a20
    class W ws
    class VC1,VC2,VT vault
    class A1,A2 asset
    class D1,D2,D3 addr
```

계정 기반 자산은 일반적으로 asset wallet당 하나의 deposit address를 사용하고, UTXO 자산은 여러 주소를 만들 수 있다. 체인·자산별 지원은 다르므로 공통 API가 있다고 해서 주소 모델도 같다고 가정하지 않는다.

### 고객별 Vault와 omnibus

| 모델 | 장점 | 운영 비용·위험 |
|---|---|---|
| 고객별 Vault | 소유·잔액·Policy source가 명확 | Vault·asset wallet 수 증가, sweep·gas 운영 필요 |
| omnibus Vault | 자산 운용과 유동성 집중 | 입금 주소·tag 귀속, 내부 원장, 고객 간 분리 책임 증가 |
| 혼합 | 고액·기관 고객은 분리, 소액은 omnibus | 분류·이관·예외 정책이 복잡 |

Vault Account ID는 내부 고객 ID가 아니다. 삭제·숨김·마이그레이션, 이름 변경과 상관없이 영구 매핑 테이블을 두고, Fireblocks 이름 필드에 PII를 넣지 않는다.

## MPC-CMP

MPC는 완전한 개인키 한 개를 평상시에 한 장소에 조립하지 않고 여러 key share가 공동으로 서명을 만든다. Hot 모델에서는 API Co-signer, Warm 모델에서는 온라인 mobile signer, Cold 모델에서는 오프라인 mobile signer가 고객 측 share를 행사한다.

아래 그림은 **Direct Custody의 Fireblocks SaaS MPC** 구성을 나타낸다. Embedded Wallets와 Hosted MPC는 share 수·배치와 고객이 운영하는 구성요소가 다르므로 이 그림을 그대로 적용하지 않는다.

```mermaid
flowchart LR
    TX[승인된 transaction] --> P1[고객 측 share]
    TX --> P2[Fireblocks cloud share A]
    TX --> P3[Fireblocks cloud share B]
    P1 --> MPC[MPC-CMP protocol]
    P2 --> MPC
    P3 --> MPC
    MPC --> SIG[블록체인 서명]

    classDef tx fill:#fff3cd,stroke:#d6a800,color:#181a20
    classDef share fill:#e8f0fe,stroke:#4a90e2,color:#181a20
    classDef sig fill:#e8f7f5,stroke:#2dbdb6,color:#181a20
    class TX tx
    class P1,P2,P3 share
    class MPC,SIG sig
```

MPC는 키 침해 표면을 분산하지만 거래가 업무상 옳다는 판정은 하지 않는다. Policy, 사람 승인, Callback Handler, 원장 검증이 별도로 필요하다.

## 서명 배포 모델

| 모델 | 서명 키 통제 | 추가 책임 |
|---|---|---|
| Fireblocks SaaS MPC | 고객 측 share와 Fireblocks cloud shares가 공동 서명 | API Co-signer 또는 mobile signer 운영, vendor 의존성 |
| Hosted MPC | 고객 환경의 여러 Co-signer가 key shares를 호스팅 | enclave 배포, HA, patch, backup, 재해복구 |
| Key Link | 고객 HSM key를 Fireblocks 정책·거래 흐름에 연결 | HSM key lifecycle, chain별 지원과 transaction 검증 |

통제권을 더 가져오면 운영 책임도 이동한다. Hosted MPC·Key Link 채택은 키 소재의 위치뿐 아니라 장애 시 서명 가능성, quorum, patch window, backup 복구와 감사 범위를 함께 비교한다.

## 네 가지 자격증명

| 자격증명 | 용도 | 같게 취급하면 안 되는 것 |
|---|---|---|
| Console 인증 | 사람이 workspace UI에 접근 | MPC share·API private key |
| API RSA private key | Fireblocks API JWT 요청 서명 | 블록체인 자산 서명 키 |
| MPC key share | 자산 transaction 서명 참여 | API 인증 credential |
| Backup·recovery material | 비상 복구 | 일상 온라인 signer |

API private key가 탈취되면 공격자가 API user 권한으로 요청할 수 있지만 지정 signer와 Policy를 자동으로 우회하는 것은 아니다. 반대로 MPC share가 안전해도 과도한 Policy·자동 승인이 있으면 잘못된 거래가 정상 서명될 수 있다.

## Backup과 복구

Backup 존재 여부만 확인하지 않는다.

- backup material과 복호화에 필요한 비밀을 서로 다른 보관 주체·장소로 분리한다.
- 운영 Co-signer와 같은 계정·네트워크에 backup을 두지 않는다.
- Owner 부재, 장치 분실, 법인 변경을 포함한 복구 승인 절차를 정한다.
- 실제 운영 키를 노출하지 않는 통제된 복구 연습을 정기적으로 수행한다.
- 연습 결과, 참여자, 사용한 장비, 폐기 확인을 감사 기록으로 남긴다.
- vendor 지원이 필요한 단계와 예상 소요 시간을 RTO에 반영한다.

## Sandbox 주의

Developer Sandbox의 역할과 자동 승인 동작은 운영 Workspace와 다를 수 있다. Sandbox에서 transaction이 사람 승인 없이 성공했다는 결과는 production Policy·MPC·Co-signer 구조가 검증됐다는 증거가 아니다.

운영 전에는 production과 같은 분리 기준으로 test 환경을 만들고 다음을 다시 검증한다.

- 실제 역할과 designated signer
- Policy rule 순서와 누적 한도
- API Co-signer·Callback Handler
- IP allowlist와 credential rotation
- webhook 서명·중복·재전송
- backup·freeze·복구 runbook

## 설계 점검

- [ ] Workspace 분리 기준과 각 workspace의 법적·업무 소유자가 정해져 있다.
- [ ] Vault Account와 내부 계정 매핑이 이름이 아닌 불변 ID에 기반한다.
- [ ] 고객별·omnibus 모델의 sweep·gas·입금 귀속 정책이 있다.
- [ ] API key, MPC share, backup material의 접근 주체가 분리돼 있다.
- [ ] Owner 승계와 signer 장치 교체 절차를 실제로 연습했다.
- [ ] test 결과를 production 거버넌스 검증으로 과장하지 않는다.
