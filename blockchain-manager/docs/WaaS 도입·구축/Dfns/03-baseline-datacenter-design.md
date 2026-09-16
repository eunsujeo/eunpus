---
title: Dfns Baseline — 사내·AWS 인프라 설계
status: To Do
group: 구축·도입 검토
---

Vault 기반 Dfns Baseline의 공통 서비스·키 관리와 **사내 데이터센터·AWS 배치안**을 한곳에서 비교한다. 기존 사내안과 추가 AWS안은 검토 대안이며, 인프라를 생성하거나 AWS로 전환하기로 확정한 결과가 아니다.

노드 수·자원·망 분리·복구 목표는 고객 설계 제안이다. Dfns 제품 구성과 릴리스 제약은 [도입 개요](00-on-premise-deployment.md), 벤더가 제시한 배포 번들·설치 절차는 [배포 준비와 절차](02-deployment-procedure.md), 기능 지원의 전달용 질의는 [담당자 질문](04-vendor-questions.md)에서 확인한다. AWS-Native의 의미와 Baseline 비교도 개요 문서에서 다룬다.

## 환경별 차이

| 항목 | 사내 데이터센터안 | AWS안 |
|---|---|---|
| 실행 기반 | 자체 Kubernetes·Istio | EKS·Istio |
| 장애 구역 | 주센터 랙 3개 | 리전 1개·AZ 3개 |
| 데이터 서비스 | PostgreSQL·Kafka·Redis 자체 운영 | Aurora PostgreSQL·MSK·ElastiCache |
| Vault | 별도 VM 5개 | EKS 전용 worker 5개·Raft PVC |
| Vault 잠금 해제 | Shamir 수동 unseal | AWS KMS auto-unseal |
| MPC | 5개 party·3-of-5 | 5개 party·3-of-5 |
| 자원 합계의 범위 | 표에 적힌 VM·노드 36개, 176 vCPU·648 GiB | EKS worker만 16 EC2, 88 vCPU·352 GiB. 관리형 데이터 서비스 등 별도 |
| 선행 확인 | 비AWS 지원 번들·CPU·외부 Vault/DB | 계약 릴리스·AWS 서비스 조합·배치 설정 |

두 안 모두 개발·검증·운영의 클러스터·Vault·DB·키를 분리하고, 운영 환경 1개를 기준으로 산정한다. 고객 조직 전용 {{단일 테넌트::도입 조직 전용 환경이며 개인 고객이나 지갑 하나를 뜻하지 않는다.}} 구성이다. 합계 범위가 다르므로 위 숫자만으로 비용을 비교하지 않는다.

## 공통 연결과 서비스

이 문서의 계층은 역할별 묶음이다. Dfns의 L1~L4 배포 단계나 물리 네트워크 경계를 뜻하지 않으며, 각 그림에서는 필요한 계층만 표시한다.

먼저 DAW-CORE·DAWBC·Dfns·체인 노드의 관계를 보면 다음과 같다. **Dfns API 서버와 MPC signer는 Dfns가 제공하는 소프트웨어를 고객 환경에 설치하는 설계다.** 노드도 고객 소유이며 운영을 업체에 맡긴다.

```mermaid
%%{init: {"themeCSS": "foreignObject { line-height: 1.5; }"}}%%
flowchart TB
    subgraph CUSTOMER["고객 소유 환경"]
        subgraph BUSINESS["업무 계층"]
            CORE["DAW-CORE"]
            BC["DAWBC"]
            CORE --> BC
        end
        subgraph APPLICATION["애플리케이션 계층"]
            API["Dfns API 서버<br/>Dfns 제공 소프트웨어"]
        end
        subgraph SIGNING["서명 계층"]
            SIGN["Dfns MPC signer<br/>지갑 서명"]
        end
        subgraph EXTERNAL["외부 연동 계층"]
            NODE["고객 소유 블록체인 노드<br/>업체가 운영"]
        end
        BC -->|"내부 API 호출"| API
        API -->|"서명 요청 · 논리 흐름"| SIGN
        API -->|"RPC 조회·거래 전송"| NODE
    end

    style CUSTOMER fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style BUSINESS fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style APPLICATION fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style SIGNING fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style EXTERNAL fill:#f8fafc,stroke:#94a3b8,color:#0f172a
```

고객 소유 환경은 소유 범위를 나타낸다. 노드를 AWS·사내·업체 시설 중 어디에 설치할지는 운영 계약에서 확정한다. API에서 signer와 노드로 향하는 화살표는 Dfns 내부 구성요소를 생략한 **논리 흐름**이다. MPC Coordinator·Delivery Relay·Indexer·Worker 등의 실제 연결은 아래 상세 구성에서 다룬다. 일반 전송을 기준으로 한 그림이며, 외부 가스 대납 경로는 [법정화폐 가스 대납](../DAW%20구축%20설계/03-fiat-gas-sponsorship.md)에서 별도로 다룬다.

고객 지정 RPC 지원은 구축 전에 Dfns의 확인이 필요하다. 비AWS 배포 패키지의 지원은 사내안의 선행 조건이다.

DAWBC·DAW-CORE와 위탁 운영 노드까지 연결하는 업무 흐름과 운영 책임은 [DAW 통합 설계](../DAW%20구축%20설계/00-integration-plan.md)에 정리했다.

### 플랫폼 내부 서비스

API·대시보드·정책·MPC signer는 Kubernetes에서 실행한다. 데이터 서비스는 PostgreSQL·Kafka·Redis로 구성한다. **PostgreSQL·Redis는 비밀번호, Kafka는 SCRAM으로 인증**한다. Vault의 시크릿 전달·암호화·인증서 기능은 다음 절에서 설명한다.

```mermaid
%%{init: {"themeCSS": "foreignObject { line-height: 1.5; }"}}%%
flowchart TB
    CLIENT["고객 서비스 · 운영자"]
    subgraph ENV["고객 전용 환경 · Baseline"]
        subgraph ENTRY["진입 계층"]
            LB["서비스 진입점 · 로드밸런서"]
            INGRESS["Istio Ingress · TLS<br/>Kubernetes"]
            LB --> INGRESS
        end
        subgraph APPLICATION["애플리케이션 계층"]
            APP["API · Dashboard · 정책<br/>Indexer · Worker<br/>Kubernetes"]
        end
        subgraph SIGNING["서명 계층 · Kubernetes"]
            COORD["MPC Coordinator<br/>서명 작업 조율"]
            RELAY["Delivery Relay<br/>작업 · 메시지 전달"]
            SIGN["MPC signer 5개 party<br/>서명 임계값 3"]
            COORD -->|"작업 전달 · 논리 관계"| RELAY
            SIGN -->|"mTLS · 작업 가져오기"| RELAY
        end
        subgraph DATA["데이터 계층"]
            STORES["PostgreSQL · 서비스 데이터<br/>Kafka · 이벤트<br/>Redis · 캐시"]
        end
        subgraph KEYMGMT["키 관리 계층 · 키 조각 저장"]
            KEYS["MPC Keyshares store<br/>암호화된 키 조각<br/>엔진 · 상세 배치 확인 필요"]
        end
        INGRESS --> APP
        APP -->|"승인된 서명 요청"| COORD
        APP -->|"각 서비스에 개별 연결<br/>비밀번호 · SCRAM"| STORES
        SIGN -->|"키 조각 읽기 · 쓰기"| KEYS
    end
    CLIENT -->|"HTTPS"| LB
    classDef pending fill:#fffbeb,stroke:#b45309,color:#78350f,stroke-dasharray:5 5
    class KEYS pending

    style ENV fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style ENTRY fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style APPLICATION fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style SIGNING fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style DATA fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style KEYMGMT fill:#f8fafc,stroke:#94a3b8,color:#0f172a
```

Vault의 키 관리 기능은 다음 그림에서 따로 다룬다. 위 키 관리 계층에는 키 조각 저장소만 표시했다.

Coordinator에서 Relay로 이어지는 선은 작업 전달의 논리 관계다. Signer는 Relay에 mTLS로 연결해 작업을 가져오며, 각자의 키 조각으로 공동 서명한다. 5개 party·3-of-5는 온프레미스 개요 p.7의 기본 구성이다. Keyshares store의 엔진이나 일반 서비스 DB와의 공유 여부는 확정하지 않았으며, 엔진·party별 접근·복제·복구 요건은 [담당자 질문 Q03](04-vendor-questions.md)에 남겼다.

API와 운영 화면은 별도 VIP·호스트로 진입 경로를 나누고, 방화벽·Istio 정책·기관 IdP로 접근을 제한한다. L4만으로 사용자 인증이나 URL별 접근 제어를 수행하는 구성은 아니다. VIP 수와 ingress 배포 방식은 벤더의 호스트 구성과 맞춘다.

| 별도 연결 | 용도와 경계 |
|---|---|
| 허용 서비스·Vault Agent → Vault | 서비스별 시크릿·암호화·인증서 기능. signer마다 필요한 기능과 권한은 벤더 명세로 제한 |
| 애플리케이션 → PostgreSQL·Kafka·Redis | 서비스 데이터·이벤트·캐시. Keyshares store와 저장소를 공유한다고 가정하지 않음 |
| 지정 workload → 통제된 외부 연결 | 체인 RPC·웹훅 등의 허용 목적지만 연결 |
| 저장소 → 독립 백업 저장소 | 저장소별 백업 도구·보존 정책 사용. 백업 자격증명은 복구 대상 Vault와 독립 보관 |

실제 주소·포트·인증서 주체는 환경별 연결표와 벤더 명세로 확정한다. 공개 체인을 쓰려면 체인 네트워크에 연결되는 경로가 필요하다.

## 공통 Vault·키 관리

Baseline은 Vault KV·Transit·PKI를 사용한다. Vault Agent injector는 Pod에 Agent를 주입하고, Agent는 허용된 시크릿을 가져온다. 서비스 신원에는 Vault Kubernetes 인증과 서비스별 role을 사용한다. Vault 서버의 배치와 잠금 해제 방식은 실제 구축 환경에 맞춰 확정한다. ([배포 프로필 비교](00-on-premise-deployment.md#baseline과-aws-native-선택))

```mermaid
%%{init: {"themeCSS": "foreignObject { line-height: 1.5; }"}}%%
flowchart TB
    subgraph BASELINE["Baseline · 시크릿과 키 관리"]
        direction TB
        subgraph POD["서비스 실행 계층"]
            SERVICE["Dfns 서비스 · Kubernetes Pod<br/>서비스별 ServiceAccount"]
            AGENT["Vault Agent<br/>injector로 주입"]
            AGENT -->|"시크릿 전달"| SERVICE
        end
        subgraph KEYMGMT["키 관리 계층"]
        VAULT["고객 운영 Vault<br/>KV · Transit · PKI<br/>Kubernetes 인증 · role · policy"]
        end
        AGENT -->|"인증 · 허용된 KV 조회"| VAULT
        SERVICE -->|"허용된 암호화 · 인증서 기능"| VAULT
    end
    classDef trust fill:#eff6ff,stroke:#2563eb,color:#1e3a8a
    style BASELINE fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style POD fill:#fff,stroke:#64748b,color:#0f172a
    class VAULT trust
    style KEYMGMT fill:#f8fafc,stroke:#94a3b8,color:#0f172a
```

서비스에서 Vault로 향하는 선은 기능 의존을 나타낸다. 각 서비스와 발급 구성요소는 허용된 기능만 사용하며, 실제 호출 주체·주입 방식·권한은 배포 패키지로 확정한다. 서비스 실행 계층은 Vault를 사용하는 Pod의 역할을 묶은 것으로, 애플리케이션·서명 계층 중 허용된 서비스에 해당한다. Vault 상자는 역할을 구분한 것으로, Kubernetes 내부·외부의 물리 배치 위치를 지정하지 않는다.

### Vault 안의 역할

| 역할 | 제안 구성 | Dfns와 확인할 경계 |
|---|---|---|
| KV | 서비스별 DB·Kafka·Redis 자격증명, SMTP·OIDC·RPC 설정 | 실제 mount 경로·KV 버전·시크릿 스키마 |
| Transit | 서비스별 암호화키. **`aes256-gcm96`을 후보로 제안** | Dfns가 요구하는 키 타입·데이터키 사용 방식·암호문 형식 |
| PKI | 서명 계층용 전용 intermediate CA와 party별 인증서 | CN·SAN·EKU·TTL·갱신 방식, 사내 CA 연결 지원 |
| Kubernetes auth | 서비스마다 ServiceAccount·namespace·Vault role 연결 | TokenReview 접근·토큰 audience·갱신 방식 |
| Audit | 독립 저장·전송 경로, 디스크 사용량·전송 실패 경보 | 로그 보존 정책과 개인정보 처리 |

Transit의 `aes256-gcm96`은 **256비트 AES 키와 96비트 nonce**를 사용하는 Vault 키 타입이다. `exportable=false`, `allow_plaintext_backup=false`, `deletion_allowed=false`를 검토 기준으로 두되, Dfns bootstrap이 생성하는 키 설정을 먼저 확인한다. 키를 회전해도 기존 DB·백업의 암호문을 복호화하는 데 필요한 이전 버전을 즉시 삭제하지 않는다. [Transit 키 타입](https://developer.hashicorp.com/vault/docs/secrets/transit), [키 설정 예제](https://developer.hashicorp.com/vault/tutorials/encryption-as-a-service/eaas-transit)

애플리케이션은 자기 서비스 경로만 읽고, 다른 서비스의 시크릿·키 생성·키 삭제·관리 정책에는 접근하지 못하도록 설계한다. Vault에서 Kubernetes API로 TokenReview를 수행하는 연결도 준비한다. [Vault Kubernetes 인증](https://developer.hashicorp.com/vault/docs/auth/kubernetes)

Vault 서버의 HTTPS 인증서와 초기 배포용 자격증명은 환경별 PKI·별도 운영 보관소에서 준비한다. 아직 시작하지 않은 Vault에 접속해야 Vault 자체의 TLS 키나 복구 암호를 얻을 수 있는 순환 의존을 만들지 않는다. TLS 전 구간 적용, 전용 비관리자 계정, swap·core dump 비활성화는 [Vault 운영 강화 지침](https://developer.hashicorp.com/vault/docs/concepts/production-hardening)을 따른다.

### 지갑키와 다른 키의 분리

| 키 | 이 설계에서의 위치·책임 |
|---|---|
| 지갑 서명키 | Dfns signer에서 분산 생성하는 MPC 키 조각. ECDSA secp256k1 / Ed25519는 벤더 개요에 명시 |
| MPC Keyshares store | 일반 앱 DB와 접근 경계를 분리. party별 자격증명·데이터 접근 범위를 구분하는 구성을 벤더와 확정 |
| Transit 키 | 애플리케이션 데이터 또는 데이터키를 보호하는 키. 지갑 서명키로 대체하지 않음 |
| Vault 복구 자료 | 사내 Shamir unseal 조각 또는 AWS auto-unseal의 recovery key. MPC 키 조각과 별개이며 두 방식의 역할도 다름 |
| 플랫폼 issuer 키 | Ed25519 인증 토큰 서명키. 벤더 지정 시크릿 경로에 두고 auth 서비스만 접근 |
| mTLS 인증서 키 | 서비스·signer 신원용. 거래 서명키·Transit 키와 분리 |

지갑키·issuer 키·서명 계층 인증서의 벤더 근거는 [온프레미스 개요 7·9쪽](00-on-premise-deployment.md)이다. **Keyshares store의 저장 엔진·복제·백업·party별 분리 지원이 확인되지 않아 일반 PostgreSQL에 임의로 합치지 않는다.** 이 저장소의 주소·자원·복구 절차는 L4 Signing 배포 전 필수 확정 항목이다.

Kubernetes 관리자나 가상화 관리자가 모든 signer·볼륨에 접근할 수 있으면 MPC party를 5개로 나누는 것만으로 관리 권한이 분산되지는 않는다. 전용 노드·ServiceAccount·관리자 역할·변경 승인으로 접근을 제한하고, 독립 운영자나 별도 클러스터가 필요한 보안 요건이면 Dfns의 지원 토폴로지를 다시 확인한다.

## 사내 데이터센터 구성안

**구축 착수 전에 Dfns가 확인해야 할 두 가지가 있다.**

1. **비AWS 환경의 지원 배포 경로.** 기존 개요의 L1은 EKS·Aurora·MSK·ElastiCache·Route53·ACM·SSM을 생성한다. 직접 만든 Kubernetes에 chart만 설치하는 방식은 지원 경로가 아니라고 적혀 있다. 이번 설계에 맞는 온프레미스 Terraform 모듈·chart·배포 안내서 또는 동등한 지원 경로를 받아야 한다. (온프레미스 개요 5·17쪽)
2. **CPU 아키텍처.** 제공 자료의 애플리케이션 이미지는 arm64 전용이다. 사내 서버가 x86만 지원한다면 Dfns의 지원되는 amd64 이미지가 필요하다. 일반적인 x86 가상화 환경에 arm64 VM을 만든다고 해결되지 않는다. 이 설계는 애플리케이션용 arm64 실행 자원을 확보하는 조건이며, MPC signer와 부가 구성요소의 이미지 아키텍처도 별도 확인한다. (온프레미스 개요 6·17쪽)

Baseline이라는 이름만으로 비AWS 배포 지원이 확정되는 것은 아니다. 아래 구성은 그 지원 경로를 검토할 수 있도록 구체화한 제안이다. 소프트웨어 버전도 최신 버전으로 임의 조합하지 않고 Dfns 릴리스와 호환되는 Kubernetes·Istio·Vault·DB·Kafka·Redis 버전 목록으로 고정한다.

AWS에서도 Baseline을 사용하므로 플랫폼 역할은 유사하지만, 기반 서비스와 Vault 잠금 해제 방식의 대체가 필요하다. **L1 교체만으로 충분한지, L2~L4도 변경해야 하는지**를 [Dfns 담당자 확인 질문](04-vendor-questions.md)에 정리했다. 같은 문서에서 비AWS 지원 경로와 외부 Vault·DB·Keyshares 배치 지원도 확인한다.

애플리케이션과 MPC는 Kubernetes에 배치하고, Vault와 데이터 서비스는 별도 VM에서 운영하는 제안이다. Kubernetes 장애가 Vault까지 함께 중단시키는 상황을 줄이려는 선택이다. Vault 자체의 TLS 키와 복구 자격증명은 별도로 확보한다. **외부 Vault·DB endpoint 연결을 Dfns 배포 패키지가 지원하는지는 구축 전 확인한다.**

### 사내 서비스와 플랫폼의 연결

진입·애플리케이션·서명·데이터·키 관리·외부 연동을 **역할별 계층**으로 묶었다. 잠금 해제·백업은 다음 그림의 운영 계층에 모았다. 이 구분은 Dfns의 L1~L4 배포 단계나 물리 네트워크 구역을 뜻하지 않는다.

사내 주센터의 랙 A·B·C에 분산하는 기존 제안이다. 앱과 MPC는 Kubernetes에, Vault·PostgreSQL·Kafka·Redis는 각각 별도 VM에 배치한다. Keyshares store와 위탁 노드의 실제 설치 장소는 별도 확인하며, 계층 상자 안에 함께 있다고 같은 서버에 배치하는 것은 아니다.

```mermaid
%%{init: {"flowchart": {"nodeSpacing": 28, "rankSpacing": 45, "curve": "linear"}, "themeCSS": "foreignObject { line-height: 1.5; }"}}%%
flowchart TB
    CLIENT["DAWBC · 허용된 운영자"]
    subgraph ENTRY["진입 계층"]
        LB["내부 L4 · 이중화<br/>API · 운영 화면 접근 분리"]
        INGRESS["Istio Ingress · TLS<br/>Kubernetes"]
        LB --> INGRESS
    end
    subgraph APPLICATION["애플리케이션 계층"]
        APP["Dfns API · 정책 · Dashboard<br/>Indexer · Worker<br/>Kubernetes"]
    end
    subgraph SIGNING["서명 계층 · Kubernetes"]
        COORD["MPC Coordinator"]
        RELAY["Delivery Relay"]
        SIGN["MPC signer · 5개 party<br/>3-of-5 · 전용 노드"]
        COORD -->|"작업 전달 · 논리 관계"| RELAY
        SIGN -->|"mTLS · 작업 가져오기"| RELAY
    end
    subgraph DATA["데이터 계층 · 각각 별도 VM"]
        DB["PostgreSQL 3 · Patroni<br/>전용 etcd 3"]
        KAFKA["Kafka broker 3<br/>KRaft controller 3"]
        CACHE["Redis 3 · Sentinel 3"]
    end
    subgraph KEYMGMT["키 관리 계층"]
        KEYS["MPC Keyshares store<br/>party별 접근 분리<br/>배치 미확정"]
        VAULT["Vault 5노드 · Raft · 별도 VM<br/>KV · Transit · PKI"]
    end
    subgraph EXTERNAL["외부 연동 계층"]
        OUT["통제된 외부 연결"]
        RPC["위탁 노드 RPC · 웹훅 목적지<br/>설치 장소 별도 확인"]
        OUT --> RPC
    end
    CLIENT -->|"사설 경로 · HTTPS"| LB
    INGRESS --> APP
    APP -->|"승인된 작업"| COORD
    APP -->|"각 서비스에 개별 연결"| DATA
    APP --> OUT
    APP -->|"Vault 인증 · 허용 기능"| KEYMGMT
    SIGN -->|"Keyshares 읽기·쓰기<br/>Vault 키 보호·인증서"| KEYMGMT
    classDef runtime fill:#eff6ff,stroke:#2563eb,color:#1e3a8a
    classDef data fill:#ecfdf5,stroke:#047857,color:#064e3b
    classDef pending fill:#fffbeb,stroke:#b45309,color:#78350f,stroke-dasharray:5 5
    class INGRESS,APP,COORD,RELAY,SIGN runtime
    class DB,KAFKA,CACHE,VAULT data
    class KEYS pending
    style ENTRY fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style APPLICATION fill:#eff6ff,stroke:#93b4ee,color:#1e3a8a
    style SIGNING fill:#eff6ff,stroke:#93b4ee,color:#1e3a8a
    style DATA fill:#f0fdf4,stroke:#86bda5,color:#064e3b
    style KEYMGMT fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style EXTERNAL fill:#f8fafc,stroke:#94a3b8,color:#0f172a
```

계층 경계로 향하는 선은 라벨에 적힌 대상과의 연결을 묶어 표시한 것이다. API는 PostgreSQL·Kafka·Redis에 각각 연결하고, 키 관리 계층에서는 Vault에 접근한다. 세 데이터 서비스를 차례로 거치는 구조가 아니다. signer도 Vault와 Keyshares store에 각각 접근하며, Relay에서 작업을 가져오는 mTLS 연결은 signer가 시작한다. Coordinator에서 Relay로 향하는 선은 작업 전달의 논리 관계다.

PostgreSQL은 서비스별 DB와 비밀번호·TLS, Kafka는 SCRAM·TLS, Redis는 비밀번호·TLS를 적용한다. Vault·데이터 서비스의 외부 endpoint, signer별 Vault 기능과 Keyshares 접근 방식은 Dfns 지원 명세로 확정한다. Keyshares store의 엔진·배치·복구 방식과 위탁 노드의 설치 장소는 미확정이다. 모든 내부 통신과 방화벽 경로를 나열한 그림은 아니다.

**운영 계층 — 잠금 해제와 백업**은 아래에 따로 표시했다. 위 그림과 같은 Vault·데이터 저장소를 운영 관점에서 다시 그린 것이며, 추가 서버를 뜻하지 않는다. 실선은 잠금 해제 작업, 점선은 백업 경로다.

```mermaid
flowchart TB
    subgraph OPERATIONS["운영 계층"]
    subgraph UNSEAL["Vault 잠금 해제 · 운영 역할"]
        direction LR
        PEOPLE["담당자 5명 중 3명 참여<br/>Shamir unseal 조각"]
        V["재시작한 Vault 노드<br/>노드별 잠금 해제"]
        PEOPLE --> V
    end
    subgraph BACKUPS["백업 · 별도 자격증명으로 관리"]
        direction TB
        PG["PostgreSQL<br/>기본 백업 · WAL"]
        K["Kafka<br/>설정 · 필요 이벤트 보존"]
        VR["Vault<br/>Raft snapshot"]
        KS["Keyshares store<br/>벤더 복구 절차 확인 후"]
        STORE["독립 백업 저장소<br/>보조센터 복사"]
        PG -.-> STORE
        K -.-> STORE
        VR -.-> STORE
        KS -.-> STORE
    end
    end
    style OPERATIONS fill:#ffffff,stroke:#94a3b8,color:#0f172a
    classDef data fill:#ecfdf5,stroke:#047857,color:#064e3b
    classDef pending fill:#fffbeb,stroke:#b45309,color:#78350f,stroke-dasharray:5 5
    class V,PG,K,VR,STORE data
    class KS pending
    style UNSEAL fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style BACKUPS fill:#f8fafc,stroke:#94a3b8,color:#0f172a
```

Shamir 담당자는 서버가 아닌 운영 역할이다. 담당자 5명 중 3명이 참여해 재시작한 Vault 노드마다 잠금을 해제한다. 백업 저장소는 별도 자격증명으로 접근하고 보조센터로 복사한다. Kafka·Redis의 상세 장애 전환 조건, Redis·Kubernetes의 백업 여부와 전체 방화벽 경로는 아래 해당 절을 따른다.

### 배치 구역

아래 선은 배치 구역의 분류다. 네트워크 연결이나 호출 순서를 뜻하지 않는다. 데이터 운영 구역 안의 PostgreSQL·Kafka·Redis도 각각 별도 VM으로 구성하며, 상세 수량은 아래 자원표에 적었다.

```mermaid
%%{init: {"themeCSS": "foreignObject { line-height: 1.5; }"}}%%
flowchart TB
    SITE["사내 주센터<br/>랙 A · B · C"]
    subgraph EXECUTION["앱·서명 계층"]
    K8S["Kubernetes 구역<br/>Control plane 3개<br/>앱 worker 6개<br/>MPC worker 5개"]
    end
    subgraph VAULTZONE["키 관리 계층 · Vault"]
    VAULT["Vault 전용 VM 구역<br/>Vault 5노드 · Raft<br/>KV · Transit · PKI"]
    end
    subgraph DATAZONE["데이터 계층"]
    DATA["데이터 전용 VM 구역<br/>PostgreSQL 3 · etcd 3<br/>Kafka broker 3<br/>KRaft controller 3<br/>Redis 3 · Sentinel 3"]
    end
    subgraph KEYSTORE["키 관리 계층 · 키 조각"]
    KEYS["MPC Keyshares store<br/>party별 접근 분리 필요<br/>배치 · 엔진 · 복제 방식 미확정"]
    end
    SITE --- K8S
    SITE --- VAULT
    SITE --- DATA
    SITE --- KEYS
    classDef runtime fill:#eff6ff,stroke:#2563eb,color:#1e3a8a
    classDef data fill:#ecfdf5,stroke:#047857,color:#064e3b
    classDef pending fill:#fffbeb,stroke:#b45309,color:#78350f,stroke-dasharray:5 5
    class K8S,VAULT runtime
    class DATA data
    class KEYS pending
    style EXECUTION fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style VAULTZONE fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style DATAZONE fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style KEYSTORE fill:#f8fafc,stroke:#94a3b8,color:#0f172a
```

잠금 해제 담당자 5명은 서버 배치와 별개인 운영 역할이다. 재시작한 Vault 노드마다 3명이 참여하는 Shamir 절차는 아래 「Vault 자체의 잠금 해제」에서 설명한다. 독립 백업 저장소와 보조센터 복사 경로는 아래 「백업·복구·운영」에서 다룬다.

### 서버와 초기 자원 계획

아래는 **성능 측정 전 자원 예약안**이다. Dfns가 제시한 AWS 참조 환경의 약 32 vCPU를 사내 환경의 검증된 최소 사양으로 사용하지 않는다. 애플리케이션 worker는 6개로 시작해, 한 랙의 2개가 없어져도 4개가 남도록 잡았다. 실제 처리량·동시 서명·체인 인덱싱 부하를 측정한 뒤 조정한다. (벤더 참조 수치: 온프레미스 개요 14쪽)

| 역할 | 수량 | 노드당 초기 자원 | 배치와 저장소 |
|---|---:|---|---|
| 내부 L4 / HAProxy | 2 | 2 vCPU / 4 GiB | 기존 이중화 L4 장비가 있으면 대체. 두 랙에 분산 |
| Kubernetes control plane + etcd | 3 | 4 vCPU / 8 GiB | 랙마다 1개, OS 100 GiB + etcd 전용 SSD 100 GiB |
| 애플리케이션 worker | 6 | 8 vCPU / 32 GiB | **arm64**, 랙마다 2개, OS·이미지 캐시 200 GiB |
| MPC 전용 worker | 5 | 4 vCPU / 16 GiB | 이미지 아키텍처 확인 후 발주. party마다 노드 1개, 랙별 2·2·1 |
| Vault | 5 | 4 vCPU / 16 GiB | 전용 VM, 랙별 2·2·1, Raft용 SSD 200 GiB와 감사 로그 디스크 분리 |
| PostgreSQL + Patroni | 3 | 8 vCPU / 32 GiB | 랙마다 1개, 데이터 1 TiB + WAL 200 GiB부터 예약 |
| Patroni용 별도 etcd | 3 | 2 vCPU / 4 GiB | 랙마다 1개. Kubernetes etcd와 공유하지 않음 |
| Kafka broker | 3 | 8 vCPU / 32 GiB | 랙마다 1개, 데이터 SSD 1 TiB부터 예약 |
| Kafka KRaft controller | 3 | 2 vCPU / 4 GiB | 랙마다 1개, broker와 별도 VM |
| Redis + Sentinel | 3 | 4 vCPU / 16 GiB | 랙마다 1개. primary 1 + replica 2, Sentinel은 각 VM에 1개 |

표의 합계는 **36개 VM 또는 노드, 176 vCPU, 648 GiB 메모리**다. 물리 서버 수나 구매 수량을 뜻하지 않는다. **DAW-CORE·DAWBC·위탁 체인 노드, Keyshares store 전용 자원, 레지스트리, 백업, 모니터링, 사내 DNS·PKI·시간 서버, 보조센터는 합계에 포함하지 않았다.** 기존 공용 인프라를 사용할지 별도 증설할지 실사해 더한다.

각 replica를 같은 물리 호스트나 단일 스토리지 장비에 몰아두지 않는다. 특히 MPC worker 5개와 Vault 노드 5개는 각각 서로 다른 물리 호스트에 배치한다. VM 이름만 다르게 만드는 것으로 장애·권한 경계가 분리되지는 않는다.

| 장애 구역 | K8s control plane | 앱 worker | MPC party | Vault | DB / broker / controller / Redis |
|---|---|---|---|---|---|
| 랙 A | cp-1 | app-1, app-2 | signer-1, signer-2 | vault-1, vault-2 | 각 1개 |
| 랙 B | cp-2 | app-3, app-4 | signer-3, signer-4 | vault-3, vault-4 | 각 1개 |
| 랙 C | cp-3 | app-5, app-6 | signer-5 | vault-5 | 각 1개 |

이 배치는 한 랙을 잃어도 Vault Raft와 MPC에 각각 3개 이상이 남도록 한 것이다. **전체 서비스의 무중단을 보장하는 수치는 아니다.** ingress·DB·저장소·네트워크도 함께 살아 있어야 한다. Vault의 5노드·3개 장애 구역 근거는 [HashiCorp Raft 참조 구성](https://docs.hashicorp.com/vault/tutorials/day-one-raft/raft-reference-architecture), Kubernetes control plane 3개 구성은 [Kubernetes HA 가이드](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)를 참고했다.

### Vault 자체의 잠금 해제

**초기안은 외부 KMS 없이 Shamir 수동 unseal을 사용한다.** 초기화 때 unseal key를 5개 조각으로 나누고, 서로 다른 담당자 3명이 참여해야 잠금을 해제하도록 제안한다. 각 조각은 담당자별 암호화 매체와 별도 보관 절차로 관리하며 서버·Git·배포 runner·동일 비밀번호 관리자에 함께 넣지 않는다.

Vault 노드가 재시작하면 해당 노드마다 다시 잠금을 해제해야 한다. 따라서 5개 노드를 동시에 자동 재시작하지 않고, 담당자 참여가 가능한 작업 시간에 하나씩 교체한다. 이 운영 부담을 받아들이기 어렵다면 **사내 HSM 기반 auto-unseal**을 별도 검토한다. HSM 호환성·제품 에디션·라이선스 확인 전에는 자동 잠금 해제 기능이 준비됐다고 보지 않는다. [Vault Seal/Unseal](https://developer.hashicorp.com/vault/docs/concepts/seal)

기존 AWS 개요의 KMS auto-unseal에서 생성하는 것은 recovery key이고, 이 설계의 Shamir 초기화에서 생성하는 것은 **unseal key**다. 원문의 recovery key 보관 절차를 이름만 바꿔 적용하지 않는다. 초기 root token은 bootstrap 이후 폐기하고 일상 운영에는 범위를 제한한 인증을 사용한다.

### 데이터 서비스와 Kubernetes

#### PostgreSQL

PostgreSQL 3노드를 Patroni와 전용 etcd 3노드로 관리하고, primary endpoint는 현재 primary만 바라보는 내부 L4 health check로 제공한다. 서비스별 DB·사용자를 나누며 TLS와 비밀번호 인증을 사용한다. 초기안은 동기 replica 1개와 `synchronous_mode`·`synchronous_mode_strict`를 검토한다. 동기 replica가 없으면 쓰기를 멈추는 선택이며, 애플리케이션의 `synchronous_commit` 설정·타임아웃·강제 failover까지 검증해야 한다. 장애 시 데이터 손실이 언제나 0이라고 약속하지 않는다. [Patroni 복제 모드](https://patroni.readthedocs.io/en/latest/replication_modes.html)

이전 primary를 확실히 격리한 뒤 승격하도록 fencing·watchdog을 검증한다. DB endpoint, 연결 풀, TLS CA, 사용자 회전은 Dfns 클라이언트와 함께 시험한다. [Patroni watchdog](https://patroni.readthedocs.io/en/rel_3_3/watchdog.html)

#### Kafka

Broker 3개와 KRaft controller 3개를 분리한다. SCRAM over TLS를 사용하고 토픽별 ACL을 제한한다. 사용자명·비밀번호와 ACL은 벤더가 요구하는 형식으로 생성해 Vault KV에 전달한다. ZooKeeper 대신 KRaft를 사용하는 것은 **Dfns 지원 버전 확인을 전제로 한 제안**이다. [Kafka KRaft 운영](https://kafka.apache.org/41/operations/kraft/)

중요 토픽은 복제 수 3, `min.insync.replicas=2`, producer `acks=all`을 기준으로 검토한다. Broker 설정만으로 producer 동작까지 보장되지 않으므로 Dfns의 실제 producer 설정도 확인한다. 토픽 이름·partition 수·retention·내부 토픽 설정은 임의로 덮어쓰지 않는다. [Kafka 토픽 설정](https://kafka.apache.org/41/generated/topic_config.html)

#### Redis

Primary 1개·replica 2개에 Sentinel 3개를 두고, quorum 2를 제안한다. **Dfns 클라이언트의 Sentinel 지원을 확인한 뒤 확정한다.** 지원하지 않으면 Sentinel이 판별한 primary만 연결하는 벤더 승인 endpoint 방식을 정한다. TCP 포트가 열렸다는 이유만으로 primary로 판별하지 않는다. Redis는 비동기 복제이므로 failover 중 일부 쓰기가 손실될 수 있다. 캐시 재구성이 인증·멱등·서명 작업에 미치는 영향을 확인한다. [Redis Sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/)

#### Kubernetes와 Istio

Control plane 3개에 stacked etcd를 두고, API endpoint는 관리망에서만 접근한다. 사내 표준 배포판을 우선하되 Dfns가 지원하는 배포판·CNI·CSI를 확인한다. 외부 Vault Agent injector와 Istio sidecar가 함께 주입되는 Pod의 시작 순서·인증서 갱신·종료 처리를 검증한다.

서명 worker는 앱 worker와 분리하고 taint·node affinity·topology spread를 적용한다. Ingress는 앱 worker에 랙별로 분산 배치하고 자원을 예약한다. 전용 ingress 노드를 추가하는 경우 사내 자원표의 수량·자원 합계도 함께 늘린다. 무상태 서비스의 replica는 3개를 목표로 하되, cron·bootstrap·migration·coordinator는 벤더의 중복 실행 방지 방식에 맞춘다. 모든 workload를 일괄 3배로 복제하지 않는다. signer identity와 저장소를 보존하는 교체 절차를 사용하고, 단순 수평 확장으로 새 party를 생성하지 않는다.

### 네트워크·접근 경로

IP는 아래 역할별로 IPAM에서 할당한다. 실제 사내 CIDR·도메인을 제공받기 전에는 예시 주소를 운영값으로 확정하지 않는다. Kubernetes Pod·Service CIDR은 관리망·서비스망·기존 사내망과 겹치지 않게 예약한다.

| 출발 → 목적지 | 포트·방식 | 허용 범위 |
|---|---|---|
| 기관 서비스 → API ingress | HTTPS 443 | 등록한 호출 서비스만 |
| 운영자 관리망 → staff dashboard | HTTPS 443 | VPN·관리 단말·기관 IdP 정책 적용 |
| 배포 runner·운영 단말 → K8s API | TCP 6443 | 관리망만 |
| K8s control plane ↔ 자체 etcd | TLS 2379·2380 | control plane 구성원만 |
| Vault·Vault Agent → K8s API | TLS 6443 | Vault의 TokenReview 등 필요한 API만 RBAC로 허용 |
| 앱·signer·운영 도구 → Vault | TLS 8200 | 서비스별 인증·정책 적용 |
| Vault 노드 ↔ Vault 노드 | TCP 8201, Raft·클러스터 통신 | Vault 구성원만 |
| 앱 → PostgreSQL primary endpoint | TLS 5432 | 서비스별 DB 사용자 |
| 앱 → Kafka broker | SASL_SSL 전용 listener | listener 포트는 배포 패키지와 확정, 예산안은 9093 |
| 앱 → Redis / Sentinel | TLS 전용 listener | Redis 6379·Sentinel 26379를 후보로 두고 클라이언트 호환성 확인 |
| signer → Delivery Relay / Keyshares store | mTLS·벤더 전용 프로토콜 | 정확한 포트·대상 목록을 L4 Signing 명세로 확정 |
| 허용 workload → 사내 레지스트리·백업·로그 | HTTPS 등 기관 표준 | 역할별 endpoint만 |
| 지정 앱 → 외부 RPC·웹훅·시세 API | 통제된 egress | 목적지·포트·DNS·인증서 검증, 프록시 호환성 확인 |

위 표는 주요 서비스 경로다. CNI·CoreDNS·kubelet·CSI·Istio 제어 통신, Patroni DCS·복제·health check, Kafka controller·broker 간 복제, Redis 복제·Sentinel 통신, DNS·NTP·백업 경로를 포함한 전체 방화벽 규칙은 설치 버전·실제 endpoint를 기준으로 생성한다. 미확정 포트가 있다는 이유로 서버망 전체를 허용하지 않는다.

공용 인터넷 ingress는 초기안에서 두지 않는다. API·dashboard는 기관 내부 DNS와 신뢰된 TLS 인증서를 사용한다. WebAuthn의 RP ID와 origin이 사내 도메인에서 일치하는지 시험한다. 루트 CA·인증서 발급·초기 관리자 로그인은 Dfns가 지원하는 도메인 bootstrap 방식과 맞춰야 한다.

### 백업·복구·운영

#### 저장소별 복구 자료

| 대상 | 제안하는 보존·복구 방법 |
|---|---|
| PostgreSQL | 기본 백업 + 연속 WAL 보관. 별도 저장소로 복사하고 시점 복구 시험 |
| Vault | Raft snapshot, 키 버전·mount·정책 변경 직후와 정기 백업. unseal 조각은 snapshot과 분리 |
| MPC | 벤더의 Keyshares store 백업과 고객 보관 암호화 백업 절차. 알고리즘·복구 도구·스토리지 호환성 확보 |
| Kubernetes | etcd snapshot, 배포 코드·이미지 digest, 별도 보관하는 bootstrap 키·CA·at-rest 암호화 자료 |
| Kafka | 토픽·ACL·consumer 설정 백업과 필요 이벤트 보존. 복제 수 3만으로 오삭제 복구가 되지는 않음 |
| Redis | 실제 데이터 용도를 확인해 persistence·백업 결정. 캐시 재생성만으로 복구되는지 시험 |

PostgreSQL의 기본 백업과 WAL을 결합하는 시점 복구는 [공식 PITR 문서](https://www.postgresql.org/docs/17/continuous-archiving.html)를 따른다. 보조센터는 독립 백업 복구 대상으로 두며, Raft·etcd·MPC quorum을 WAN 너머로 임의 분산하지 않는다.

**복구 목표 제안은 DB RPO 5분, 전체 서비스 RTO 4시간**이다. 보장치가 아니라 모의 복구의 합격 목표다. 키 자료는 시간 단위 RPO만으로 관리하지 않고, 새 지갑·키 회전 결과를 운영에 사용하기 전에 필요한 키 버전과 복구 자료가 확보되는 절차를 검증한다. 그 절차를 Dfns가 제공하지 않으면 잃을 수 있는 지갑·키 범위와 보완책을 별도로 확정한다.

Vault snapshot이 DB의 암호화키 버전보다 오래되면 DB만 복구해도 복호화하지 못할 수 있다. DB·Vault·MPC·인증서·플랫폼 릴리스의 복구 조합을 하나의 백업 목록으로 기록한다. 백업을 여는 비밀번호와 저장소 접근 자격증명이 복구 대상 Vault에만 존재하지 않도록 한다.

#### 복구 순서

1. 복구 환경의 서명 작업 수신·거래 전송 경로를 차단하고, 원센터의 서명·전송 경로도 격리한다. 원센터 차단을 확인하지 못하면 복구 환경의 서명을 활성화하지 않는다.
2. 네트워크·DNS·시간 동기화·사내 PKI·관리 접근을 복구하되, 서명·전송 차단은 유지한다.
3. Vault와 데이터 저장소를 복구하고 Vault 노드별 잠금을 해제한다.
4. Kubernetes와 이미지 레지스트리를 복구한다. 재생성된 Pod·대기 작업이 자동으로 서명하거나 전송하지 않도록 차단 상태를 확인한다.
5. API·정책·인덱싱을 복구하고, 격리된 상태에서 MPC party identity·키 조각·인증서·지갑 공개키를 대조한다.
6. 체인 nonce·진행 중 거래·내부 기록을 대사하고 재처리 대상을 확정한다. DAWBC·DAW-CORE를 연결한 환경에서는 업무 요청 키·원금 잠금·이미 반영한 이벤트와 외부 대납업체의 예약·실행·청구도 함께 대사한다. 백업 이후 접수돼 로컬 기록에서 사라진 거래와 예약을 회수하기 전에는 새 전송을 허용하지 않는다.
7. 원센터 격리를 다시 확인한 뒤 복구 환경만 제한적으로 열어 검증 거래를 수행하고 서명을 재개한다. 동일 party나 복구 환경 두 곳을 동시에 활성화하지 않는다. 외부 relay가 이미 받은 서명·UserOperation은 원센터를 차단해도 남아 있을 수 있으므로, 해당 실행의 결과 또는 더 이상 실행될 수 없음을 확인할 때까지 같은 의도의 새 실행을 보류한다.

DB RPO 5분은 최근 5분의 업무 요청·원장·이벤트 중복 제거 기록을 잃어도 된다는 뜻이 아니다. DAWBC 실행 기록과 DAW-CORE 원장·처리 완료 기록의 별도 복구 목표를 정하고, 누락 구간을 복원할 조회·보존 계약을 확보한다. 복구 중에도 조회와 대사는 허용하되, 해소되지 않은 출금은 잠금·보류를 유지한다.

일상 경보에는 Vault sealed 상태·Raft quorum·디스크·감사 기록 실패, DB 복제 지연·WAL 적체, Kafka ISR·consumer lag, Redis failover, signer 가용 수·서명 지연, 인증서 만료·Webhook 실패를 넣는다. 로그·메트릭·OTLP는 기관 관측 시스템으로 보낸다. 벤더 번들에 Prometheus·Grafana가 포함된 것으로 가정하지 않는다. (온프레미스 개요 15쪽)

### 구축 순서와 완료 조건

아래는 **사내 배치를 전제로 우리가 제안하는 순서**다. 벤더 자료가 AWS 기준으로 설명한 설치 절차는 [배포 준비와 절차](02-deployment-procedure.md)에 따로 있으며, 0단계의 지원 경로가 확정되면 두 순서를 대조한다.

| 단계 | 실행 내용 | 완료 조건 |
|---|---|---|
| 0. 지원 경로 확정 | 비AWS 번들·CPU·버전·외부 데이터 서비스·Keyshares 사양 확보 | 사내 배포가 지원되는 조합과 설정 계약 확보 |
| 1. 기반 준비 | VLAN·L4·DNS·시간·PKI·레지스트리·독립 백업·배포 runner | TLS·이미지 검증·관리 접근·백업 접근 성공 |
| 2. L1에 해당하는 인프라 | VM·Kubernetes·PG·Kafka·Redis 생성 | 한 노드 장애와 primary 전환 시험 통과 |
| 3. L2에 해당하는 공통 서비스 | Vault 초기화·Shamir 보관·Istio·인증·정책·injector 구성 | 재시작한 Vault 잠금 해제, 서비스별 권한 경계 확인 |
| 4. L3 Product | 벤더 도구로 DB·토픽·시크릿 bootstrap, 앱 배포 | migration 성공, 내부 API·dashboard·관리자 passkey 확인 |
| 5. L4 Signing | 지정 저장소·MPC 5개 party·인증서·keystore 등록 | 지갑 생성과 시험 거래 전체 서명 성공 |
| 6. 운영 검증 | 한 랙 장애·Vault 재시작·DB 전환·복구·키 회전 | 아래 출시 항목 통과 |

실제 구현은 Dfns의 지원 모듈과 사내 가상화·네트워크 자동화를 연결한다. 현재 자료에는 vendor Terraform 변수·Helm values·설치 이미지 경로가 없으므로 이 문서에 실행 가능한 것처럼 임의의 설치 스크립트를 만들지 않는다. 필요한 설정 값은 다음 결정표로 수집한다.

| 구현 입력 | 확정 주체 |
|---|---|
| 가상화 플랫폼·arm64 자원·3개 장애 구역·스토리지 IOPS | 사내 인프라팀 |
| 사내 CIDR·DNS 존·VIP·PKI·관리 접속·egress | 네트워크·보안팀 |
| 지원 릴리스·이미지 아키텍처·chart·Terraform·운영 안내서 | Dfns |
| 외부 Vault·Shamir·Transit 키 스펙·CA 연동 | Dfns + 키 관리 담당 |
| Keyshares store 엔진·party 분리·백업·복구·지원 CPU | Dfns + 서명 운영 담당 |
| DB·Kafka·Redis 버전·TLS·HA endpoint·회전 방식 | Dfns + 데이터 운영팀 |
| 보존 기간·RPO/RTO·복구 승인자·당직·unseal 담당자 | 서비스 운영·보안팀 |

#### 출시 전 확인

- [ ] x86/arm64와 Dfns 전체 이미지 조합이 검증됐다.
- [ ] AWS API·AWS KMS·외부 Dfns 런타임 연결이 없어도 필요한 내부 기능이 동작한다.
- [ ] 기관 내부 TLS·WebAuthn·OIDC·이메일·RPC·Webhook 흐름이 정상이다.
- [ ] 서비스 A의 자격증명으로 서비스 B의 Vault 경로·DB·Kafka 토픽에 접근하지 못한다.
- [ ] 한 랙 장애 시 DB·Vault·MPC·ingress가 설계한 범위에서 복구된다.
- [ ] signer가 2개만 남으면 서명하지 못하고, 복구 시 party identity가 유지된다.
- [ ] Vault 노드의 재시작·unseal과 담당자 부재 시 대체 절차를 실제로 수행했다.
- [ ] DB·Vault·Keyshares store를 함께 복구해 기존 지갑의 정상 서명과 거래 대사가 확인됐다.
- [ ] DAW 통합 복구에서 백업 이후의 업무 요청·처리 이벤트·외부 대납 예약을 회수했고, 원센터 격리 뒤 늦게 실행된 거래도 중복 제출·중복 원장 반영 없이 처리했다.
- [ ] DB·Kafka·Redis·인증서·Transit 키 회전 후 기존 데이터와 백업이 정상 처리된다.
- [ ] 성능 실측·원센터 차단·보조센터 복구 시험을 통과해 최종 자원량과 RPO/RTO를 확정했다.

## AWS 구성안

DAW-CORE·DAWBC가 사내에 있으면 AWS까지 전용 회선 또는 VPN 경로를 준비한다. API는 고객 AWS 계정에 설치하며, 노드의 설치 장소는 운영 계약으로 정한다. 리전·서비스 버전·CPU와 Terraform·Helm의 배치 설정 지원을 계약 릴리스로 확인한다.

### AWS 서비스와 플랫폼의 연결

사내 구성안과 같은 역할별 계층으로 묶었다. 진입점·EKS·데이터 서비스는 고객 AWS 플랫폼 VPC의 3개 AZ에 배치하는 제안이며, Keyshares store의 엔진·상세 배치는 벤더 확인이 필요하다. EKS worker는 private subnet에 둔다. 계층 상자는 계정·VPC 경계가 아니다. AZ별 수량은 다음 절에서 다룬다.

API는 데이터 계층의 각 서비스에 개별 연결하며 키 관리 계층에서는 Vault에 접근한다. signer는 Keyshares store와 허용된 Vault 기능을 각각 사용한다. KMS·Secrets Manager·S3는 VPC 안에 설치하는 서버가 아니라 AWS 서비스이며, 필요한 VPC endpoint를 통해 접근하도록 설계한다.

```mermaid
%%{init: {"flowchart": {"nodeSpacing": 28, "rankSpacing": 45, "curve": "linear"}, "themeCSS": "foreignObject { line-height: 1.5; }"}}%%
flowchart TB
    CLIENT["DAWBC · 허용된 운영자"]
    subgraph ENTRY["진입 계층"]
        LB["내부 NLB<br/>API · 운영 화면 접근 분리"]
        INGRESS["Istio Ingress · TLS<br/>EKS"]
        LB --> INGRESS
    end
    subgraph APPLICATION["애플리케이션 계층"]
        APP["Dfns API · 정책 · Dashboard<br/>Indexer · Worker<br/>EKS"]
    end
    subgraph SIGNING["서명 계층 · EKS"]
        COORD["MPC Coordinator"]
        RELAY["Delivery Relay"]
        SIGN["MPC signer · 5개 party<br/>3-of-5 · 전용 노드"]
        COORD -->|"작업 전달 · 논리 관계"| RELAY
        SIGN -->|"mTLS · 작업 가져오기"| RELAY
    end
    subgraph DATA["데이터 계층 · AWS 관리형 서비스"]
        DB["Aurora PostgreSQL<br/>서비스별 DB · 비밀번호"]
        KAFKA["MSK Provisioned<br/>SCRAM · TLS"]
        CACHE["ElastiCache Redis OSS<br/>비밀번호 · TLS"]
    end
    subgraph KEYMGMT["키 관리 계층"]
        KEYS["MPC Keyshares store<br/>party별 접근 분리<br/>배치 미확정"]
        VAULT["Vault 5노드 · Raft<br/>EKS 전용 노드 · EBS<br/>KV · Transit · PKI"]
    end
    subgraph EXTERNAL["외부 연동 계층"]
        OUT["통제된 외부 연결"]
        RPC["위탁 노드 RPC · 웹훅 목적지<br/>설치 장소 별도 확인"]
        OUT --> RPC
    end
    CLIENT -->|"사설 경로 · HTTPS"| LB
    INGRESS --> APP
    APP -->|"승인된 작업"| COORD
    APP -->|"각 서비스에 개별 연결"| DATA
    APP --> OUT
    APP -->|"Vault 인증 · 허용 기능"| KEYMGMT
    SIGN -->|"Keyshares 읽기·쓰기<br/>Vault 키 보호·인증서"| KEYMGMT
    classDef runtime fill:#eff6ff,stroke:#2563eb,color:#1e3a8a
    classDef data fill:#ecfdf5,stroke:#047857,color:#064e3b
    classDef pending fill:#fffbeb,stroke:#b45309,color:#78350f,stroke-dasharray:5 5
    class INGRESS,APP,COORD,RELAY,SIGN runtime
    class DB,KAFKA,CACHE,VAULT data
    class KEYS pending
    style ENTRY fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style APPLICATION fill:#eff6ff,stroke:#93b4ee,color:#1e3a8a
    style SIGNING fill:#eff6ff,stroke:#93b4ee,color:#1e3a8a
    style DATA fill:#f0fdf4,stroke:#86bda5,color:#064e3b
    style KEYMGMT fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style EXTERNAL fill:#f8fafc,stroke:#94a3b8,color:#0f172a
```

**운영 계층**은 아래에 따로 표시했다. 위 연결도와 같은 Vault·MSK·Keyshares store를 운영 관점에서 다시 그린 것이며, 추가 인스턴스를 뜻하지 않는다. 실선은 자동 잠금 해제, 점선은 자격증명 연결 또는 백업 경로다.

```mermaid
%%{init: {"themeCSS": "foreignObject { line-height: 1.5; }"}}%%
flowchart TB
    subgraph OPERATIONS["운영 계층 · AWS"]
        direction LR
        subgraph UNSEAL["Vault 자동 잠금 해제"]
            direction TB
            VAULT["Vault · EKS 전용 노드"]
            KMS["AWS KMS<br/>Vault auto-unseal 전용 키"]
            VAULT -->|"자동 잠금 해제"| KMS
        end
        subgraph CREDENTIALS["MSK 자격증명 등록"]
            direction TB
            SCRAM["Secrets Manager<br/>MSK SCRAM 등록용"]
            MSK["MSK Provisioned"]
            SCRAM -.->|"자격증명 연결"| MSK
        end
        subgraph BACKUPS["백업 · 독립 계정"]
            direction TB
            VR["Vault<br/>Raft snapshot"]
            KEYS["Keyshares store<br/>벤더 복구 절차 확인 후"]
            BACKUP["독립 백업 계정 · S3<br/>별도 접근 권한 · 복구 키 관리"]
            VR -.-> BACKUP
            KEYS -.-> BACKUP
        end
    end
    classDef pending fill:#fffbeb,stroke:#b45309,color:#78350f,stroke-dasharray:5 5
    class KEYS pending

    style OPERATIONS fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style UNSEAL fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style CREDENTIALS fill:#f8fafc,stroke:#94a3b8,color:#0f172a
    style BACKUPS fill:#f8fafc,stroke:#94a3b8,color:#0f172a
```

백업 계정은 플랫폼 운영 계정과 분리한다. 플랫폼 운영 계정과 독립 백업 계정 모두 고객 소유 AWS 환경에 해당한다. Aurora·Kafka 등 데이터별 백업 경로는 복구 절에서 구분한다. Vault에 연결하는 주체와 권한은 Dfns 패키지의 서비스별 명세로 제한하며, 모든 서비스가 모든 Vault 기능을 호출한다는 뜻이 아니다.

### 초기 자원과 가용 영역 배치

| 구성요소 | 초기 예약안 | 배치·운영 기준 |
|---|---|---|
| EKS | 운영 클러스터 1개 | 제어 영역은 AWS 관리. 고객이 control plane VM 3개를 별도로 만들지 않음 |
| 앱·공통 worker | 6개, 노드당 8 vCPU / 32 GiB | AZ마다 2개. 제공 자료의 앱 이미지에 맞춰 arm64 우선, 전체 이미지 호환성 확인 |
| MPC worker | 5개, 노드당 4 vCPU / 16 GiB | party마다 전용 노드. AZ별 2·2·1, 이미지 CPU 아키텍처 별도 확인 |
| Vault worker | 5개, 노드당 4 vCPU / 16 GiB | Vault Pod당 전용 노드와 Raft PVC. AZ별 2·2·1, EBS 200 GiB부터 예약 |
| Aurora PostgreSQL | Serverless v2 writer 1 + reader 2 제안 | 인스턴스를 AZ별로 분산. ACU 최소·최대는 연결 수·부하와 장애 전환 시험으로 확정 |
| MSK Provisioned | broker 3개 제안 | AZ마다 1개. 인스턴스·디스크·토픽 복제·보존 용량은 처리량 측정 후 확정 |
| ElastiCache Redis OSS | primary 1 + replica 2 제안 | cluster mode disabled, AZ 분산·Multi-AZ 자동 장애 전환. 패키지 호환성 확인 |
| Keyshares store | 별도 산정 | 일반 서비스 DB와 공유한다고 가정하지 않음. 엔진·복제·party별 접근 확인 필요 |

EKS worker 예약안은 **16개 EC2, 88 vCPU, 352 GiB 메모리**다. Aurora·MSK·Redis의 관리형 자원, EBS, NLB, NAT·VPC endpoint, 로그·백업, DAW-CORE·DAWBC·체인 노드는 이 합계에 포함하지 않았다. 사내안의 36개 VM을 AWS EC2 36대로 치환하지 않는다.

앱·MPC·Vault는 node group, taint/toleration, 배치 제약으로 분리하고, party의 복구를 일반 앱 autoscaling처럼 처리하지 않는다. 서명 노드와 Vault는 초기 운영에서 On-Demand 용량을 사용하도록 제안한다. 복제 수와 PodDisruptionBudget만으로 AZ 장애 시 무중단이 보장되지는 않는다.

| AZ | 앱 worker | MPC party | Vault Raft |
|---|---:|---:|---:|
| A | 2 | 2 | 2 |
| B | 2 | 2 | 2 |
| C | 2 | 1 | 1 |

한 AZ가 중단돼도 MPC와 Vault 각각 3개 이상이 남도록 잡은 구성이다. 남은 party가 실제 서명할 수 있는지, DB·Relay·키 조각 저장소도 가용한지는 함께 시험한다. EBS 볼륨은 같은 AZ의 인스턴스에 연결하므로, 장애 AZ의 Vault PVC가 다른 AZ로 즉시 이동한다고 설계하지 않는다. 살아 있는 Raft quorum으로 서비스하고 벤더·Vault 절차에 따라 노드를 교체한다. [AWS EBS 볼륨](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html)

Aurora의 reader 장애 전환과 ElastiCache의 replica 승격 후에는 연결 재수립·진행 중 요청 대사를 시험한다. 클라이언트가 쓰기 요청을 무조건 반복하도록 만들지 않는다. [Aurora 고가용성](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.AuroraHighAvailability.html) · [ElastiCache Multi-AZ](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/AutoFailover.html)

### Baseline에서 KMS를 사용하는 이유

**Vault의 KV·Transit·PKI를 유지하면서, Vault 자체의 잠금 해제에 AWS KMS를 사용한다.** 이는 애플리케이션의 암호화 백엔드를 Vault Transit에서 AWS KMS로 바꾸는 것과 다르다.

서비스별 Vault KV·Transit·PKI와 API 요청 서명키의 역할은 앞의 공통 키 관리 절을 따른다. EBS·Aurora·백업의 저장 시 암호화도 지갑 MPC 키와 별개다.

Vault의 KMS 접근용 IAM 역할과 EBS·레지스트리 등 인프라 접근 권한은 Baseline에서도 필요할 수 있다. 이것이 Dfns의 DB·Kafka·Redis 인증을 AWS-Native의 IAM 인증으로 바꿨다는 뜻은 아니다. IRSA 또는 Pod Identity 지원은 패키지와 구성요소 버전별로 확정한다. [Vault AWS KMS seal 설정](https://developer.hashicorp.com/vault/docs/configuration/seal/awskms)

KMS auto-unseal에서 초기화로 발급되는 것은 **recovery key**다. 사내 Shamir안의 수동 unseal key와 구분한다. recovery key 5조각·3명 참여를 초기 운영안으로 두고 별도 보관하며, 초기 root token은 bootstrap 후 폐기한다. **recovery key만으로 KMS 장애나 키 삭제를 대신할 수 없다.** 복구에 필요한 KMS 키·정책·권한·연결도 함께 보호한다. [Vault Seal/Unseal](https://developer.hashicorp.com/vault/docs/concepts/seal)

Vault Pod와 앱을 같은 EKS에 두므로 제어 영역·클러스터 운영 장애를 공유한다. 전용 노드만으로 이 의존성이 사라지지는 않는다. Vault를 별도 EC2에 둘 필요가 있다면 외부 Vault endpoint와 bootstrap을 Dfns 패키지가 지원하는지 [담당자 질문 Q03](04-vendor-questions.md)으로 확인한 뒤 설계를 바꾼다.

### MSK SCRAM 자격증명

MSK의 SCRAM 인증은 **AWS Secrets Manager의 자격증명을 클러스터에 연결**해야 한다. AWS는 시크릿 이름에 `AmazonMSK_` 접두어와 고객 관리 KMS 키를 요구한다. Baseline에서도 이 MSK 측 등록 경로는 필요하며, 애플리케이션의 시크릿 전달 경로는 Vault로 유지한다. [AWS MSK SCRAM 설정](https://docs.aws.amazon.com/msk/latest/developerguide/msk-password-tutorial.html)

같은 자격증명을 MSK 등록용 Secrets Manager와 앱 전달용 Vault에서 어떻게 일치시킬지 확인해야 한다. **최초 생성·회전의 담당 주체, 갱신 순서, 실패 시 복구를 Dfns 배포 패키지에서 확인하기 전에는 자동 동기화가 있다고 가정하지 않는다.** 두 저장소를 운영자가 독립적으로 수정하는 구성은 피한다.

### AWS 네트워크·운영 접근

| 경로 | 설계 기준 |
|---|---|
| DAWBC → Dfns API | 내부 NLB와 사설 DNS. 허용된 경로에서 HTTPS 접근 |
| 운영자 → Dashboard·EKS 관리 | 기관 인증·관리 단말·SSM/VPN 등 승인된 관리 경로. 서비스 API와 접근 권한 분리 |
| EKS worker → EKS API | private endpoint 사용. 운영 도구의 사설 접속 경로도 먼저 확보 |
| 앱 → Aurora·MSK·Redis | private subnet, TLS와 서비스별 자격증명. 필요한 보안 그룹 간 연결만 허용 |
| signer → Relay·Keyshares store | 벤더 포트·mTLS 주체·party별 접근 명세 적용. 공개 인바운드 없음 |
| Vault → KMS | 전용 키 권한과 KMS endpoint 경로. 클러스터 장애 복구 시에도 확보 |
| Dfns → 위탁 RPC·웹훅 | 목적지와 호출 주체 제한. 외부 목적지라면 방화벽·프록시 등으로 통제 |
| 배포·worker → AWS 서비스 | ECR·S3·STS 또는 EKS Auth·KMS·SSM·로그 등 실제 의존 서비스의 endpoint와 DNS 준비 |

NAT Gateway는 주소 변환 경로이며 목적지 허용 목록을 집행하는 방화벽으로 취급하지 않는다. 외부 인터넷 통신이 필요하면 AZ별 출구 장애를 분리하고, 통제 장치와 함께 구성한다. 필요한 endpoint 종류는 선택한 IAM 방식과 AWS 서비스에 따라 달라진다. [EKS private cluster 요건](https://docs.aws.amazon.com/eks/latest/userguide/private-clusters.html) · [EKS subnet 설계](https://docs.aws.amazon.com/eks/latest/best-practices/subnets.html)

내부 NLB의 TLS 종료·Istio까지의 재암호화·호스트별 인증서는 Dfns 번들과 맞춘다. Route 53·ACM이 존재한다고 Vault PKI가 대체되는 것은 아니다. 도메인 소유·인증서 검증·내부 DNS 해석 경로를 각각 확인한다.

### AWS 백업·복구·운영

| 대상 | 준비할 자료와 확인 사항 |
|---|---|
| Vault | Raft snapshot, KMS seal 키와 사용 권한, TLS·CA·복구 운영 자격. 백업 접근이 복구 대상 Vault에만 의존하지 않도록 구성 |
| Aurora | 자동 백업·시점 복구와 보관 정책. 복원한 DB endpoint·서비스 계정·스키마·Vault 자격증명 대사 |
| MSK | 토픽·ACL·설정과 이벤트 보존·재처리 계획. broker 복제만으로 삭제·잘못된 이벤트·리전 장애 복구가 해결되지는 않음 |
| Redis | 데이터 용도별 재생성 가능 여부. 세션·잠금·작업 상태 등 손실 영향과 복원 필요성 확인 |
| MPC Keyshares | 벤더가 지원하는 party별 암호화 백업·복구 자료. 선택 S3 백업을 쓰면 고객 오프라인 복호화 키도 별도 관리 |
| 배포 상태 | 서명 검증된 번들·이미지 digest·계층별 Terraform 상태·고객 설정·버전 기록 |
| 감사 | 인프라 변경·Vault 접근·업무 요청·거래·대납 비용을 연결할 독립 로그 보관 |

보조 리전 복구는 별도 수용 시험으로 둔다. **S3에 복사한 snapshot만으로 Vault·MPC·DB 전체가 복구되는 것은 아니다.** 각 백업의 암호화 키·복호화 권한·리전별 seal 구성과 데이터 일관성을 검증한다. RPO·RTO는 목표를 먼저 정하고 실제 복구 시간을 측정해 확정한다.

복구 순서는 AWS 계정·IAM·DNS·KMS·네트워크 → EKS·스토리지·Vault → 데이터 서비스·Dfns 초기화 상태 → MPC party·키 조각 → API·관측·업무 대사 순으로 검토한다. 실제 의존 순서는 벤더 runbook으로 확정한다. 원센터의 서명·전파를 차단한 뒤 복구 환경을 활성화하고, 백업 이후의 요청·거래를 조회해 중복 제출과 중복 원장 반영을 막는다.

### AWS 구축 순서와 완료 조건

1. **릴리스·패키지 확정.** Baseline 프로필, 전체 이미지 CPU, AWS 리전·서비스 버전, 지정 RPC와 외부 연동 지원을 확인한다. 제공 자료의 최소 릴리스 숫자만으로 현재 지원 조합을 결정하지 않는다.
2. **L1 기반 생성.** 고객 계정·네트워크·EKS·Aurora·MSK·ElastiCache·DNS·TLS·운영 접속을 준비한다.
3. **L2 공통 기반.** Istio·Vault Raft·KMS auto-unseal·서비스 인증·스토리지를 구성하고 복구 자격증명을 분리 보관한다.
4. **L3 플랫폼.** 서비스 DB·토픽·시크릿과 초기화 작업을 적용한다. MSK 등록과 Vault 전달 자격증명의 일치를 검증한다.
5. **L4 MPC.** signer·Keyshares store·party identity를 구성하고 키 보관소와 조직을 연결한다.
6. **업무 검증.** DAWBC에서 고객 환경의 API로 지갑 생성·입금·ERC-20 전송·조회·웹훅·대납·업무 대사를 검증한다.
7. **장애·복구 검증.** AZ 장애, Vault 재시작, DB 승격, 자격증명 회전, 백업 복원, 기존 지갑 서명과 요청 중복 방지를 시험한다.

출시 전에는 다음 결과를 남긴다.

- [ ] 고객 환경의 API endpoint와 지정 RPC로 전체 거래 경로를 검증했다.
- [ ] 앱·MPC·Vault가 설계한 노드·AZ에 분리 배치됐고 장애 시 남은 자원으로 동작한다.
- [ ] 서비스별 Vault·DB·토픽·키 조각 권한과 대납 전용 지갑의 정책 경계를 확인했다.
- [ ] KMS 접근 실패와 Vault 재시작·복구를 시험하고 recovery key의 역할을 구분했다.
- [ ] MSK SCRAM 비밀번호 회전 후 Vault와 서비스 연결이 일치한다.
- [ ] DB·Vault·Keyshares를 복원해 기존 지갑 서명과 온체인·업무 원장 대사가 가능하다.
- [ ] 가스 비용의 지불자·업무 요청·정산 항목이 연결되고 원금을 중복 차감하지 않는다.
- [ ] 월 운영비와 복구 목표를 처리량·보존량·AZ 간 전송·로그·백업·지원 계약까지 포함해 산정했다.

공개 Dfns API에서 확인한 Sepolia 일반·대납 전송은 [API 비교 실측](../API%20비교/00-fireblocks-dfns-api.md)에 있다. 고객 AWS 계정의 Baseline을 검증한 결과는 아니며, 법정화폐 청구·Base·Solana 지원도 별도 확인한다. 업무 설계는 [DAW 통합 설계](../DAW%20구축%20설계/00-integration-plan.md), 전달할 질의는 [Dfns 담당자 질문](04-vendor-questions.md)에 연결한다.

## 확인한 자료

- Dfns 제공 자료: [온프레미스 배치 개요](00-on-premise-deployment.md) 5~9·11~17쪽, [Baseline / AWS-Native 비교](00-on-premise-deployment.md#baseline과-aws-native-선택) 2~3쪽, [배포 준비와 절차](02-deployment-procedure.md)
- Kubernetes: [HA 클러스터](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)
- HashiCorp: [Raft 참조 구성](https://docs.hashicorp.com/vault/tutorials/day-one-raft/raft-reference-architecture), [Seal/Unseal](https://developer.hashicorp.com/vault/docs/concepts/seal), [Transit](https://developer.hashicorp.com/vault/docs/secrets/transit), [Kubernetes 인증](https://developer.hashicorp.com/vault/docs/auth/kubernetes), [운영 강화](https://developer.hashicorp.com/vault/docs/concepts/production-hardening)
- 데이터 서비스: [Patroni 동기 복제](https://patroni.readthedocs.io/en/latest/replication_modes.html), [PostgreSQL PITR](https://www.postgresql.org/docs/17/continuous-archiving.html), [Kafka KRaft](https://kafka.apache.org/41/operations/kraft/), [Kafka 복제 설정](https://kafka.apache.org/41/generated/topic_config.html), [Redis Sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/)

외부 공식 문서 확인일은 2026-09-14다. 인용 문서의 버전은 해당 동작을 확인한 기준이며 Dfns의 승인 버전 목록을 대신하지 않는다.
