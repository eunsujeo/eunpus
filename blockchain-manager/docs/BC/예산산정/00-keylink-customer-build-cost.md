---
title: Fireblocks Key Link — 고객 구축비 예산 산정
status: To Do
group: Fireblocks Key Link
---

Key Link 도입 때 고객이 준비하는 **Customer Server·Fireblocks Agent·HSM**의 구축비를 산정한다.
Fireblocks add-on·Professional Services·KeyLink Flow 가격은 회신 전이므로 이 예산에서 제외한다.

## 예산 결론

현재 기준안은 기존 Thales Luna를 활용하고 Customer Server를 직접 구현하는 경우다.

| 시나리오 | 초기 고객 구축비 | 연간 고객 운영비 | 적용 조건 |
|---|---:|---:|---|
| 기존 Luna 그대로 활용 | **3.1~5.0억 원** | **0.8~2.1억 원** | firmware·알고리즘·HA 구성이 요구사항 충족 |
| 기존 Luna upgrade | **3.4~6.0억 원** | **0.9~2.2억 원** | firmware·Client·partition·HA 보완 필요 |
| 신규 Luna 2대 HA + Backup | **4.1~7.5억 원** | **1.0~2.3억 원** | 신규 HSM과 backup 체계 조달 |
| 두 site에 Luna 4대 + Backup | **5.5~10.0억 원** | **1.2~2.8억 원** | 운영 site와 DR site에 각각 HA 구성 |

금액은 VAT를 제외한 내부 예산용 범위다. Fireblocks 사용료와 Fireblocks가 제공하는 구축 서비스 비용은 포함하지 않는다.

## 산정 범위

### 포함

- Customer Server 설계·개발·보안 강화·배포
- Fireblocks Agent 설치·pairing·배포·감시 구성
- Luna Client·PKCS#11·NTLS 연동
- Validation Key·Signing Key 등록과 Proof of Ownership 연동
- 주 시스템·대기 시스템과 HSM HA·backup·복구 구성
- 개발·UAT·운영·DR 환경의 VM·storage·monitoring
- 통합·장애·성능·보안 시험과 운영 문서

### 제외

- Fireblocks Key Link add-on
- Fireblocks Professional Services
- KeyLink Flow
- 기존 Fireblocks subscription
- blockchain network fee와 transaction 수수료
- VAT

제외 항목은 Fireblocks 견적을 받은 뒤 이 문서의 고객 구축비와 별도로 합산한다.

## 확인된 제품 사양

아래 값은 예산을 위한 임의 사양이 아니라 제공 문서와 담당자 답변에서 확인한 조건이다.

| 구성요소 | 확인된 조건 |
|---|---|
| Fireblocks Agent | 고객 host에서 실행하는 TypeScript service, Docker 지원 Linux, 환경당 8 GB RAM, 암호화된 100 GB SSD, Fireblocks endpoint로 outbound 연결 |
| Customer Server | 고객이 개발·호스팅, Agent 요청 검증·승인/거절, HSM 호출과 서명 결과 반환 |
| Luna 연결 | Customer Server host에 Luna Client 설치, Luna appliance와 NTLS 연결, Luna client 등록 |
| HSM interface | PKCS#11 |
| Signing Key | ECDSA `secp256k1`, EdDSA `ed25519` |
| HSM 복구 | Luna HA group·partition cloning·Luna Backup HSM 등 HSM 자체 기능 사용 |
| Agent 이중화 | Agent마다 별도 identity·queue, Signing Key는 특정 Agent user에 결속, 주 시스템·대기 시스템 권장 |
| Key Management Dashboard | Fireblocks Console의 `Settings > External Keys` 화면으로 별도 Dashboard 설치는 불필요. Customer Server·Agent·HSM은 대체하지 않음 |

Customer Server의 CPU·memory와 처리량 기준은 제공 자료에 없다. 아래 VM 수량과 사양은 비용 계산을 위한 내부 가정이다.

## 환경과 서버 수량 가정

| 환경 | Agent | Customer Server | 목적 |
|---|---:|---:|---|
| 개발 | 1 | 1 | interface·HSM 개발 |
| UAT | 1 | 1 | 업무·Policy·장애 시험 |
| 운영 | 2 | 2 | 주 시스템·대기 시스템 |
| DR | 1 | 1 | 재해복구 |
| 합계 | **5** | **5** | 총 10 node |

이 수량은 예산 확보용이다. Signing Key가 특정 Agent user에 결속되므로 운영의 대기 Agent 전환 방식은 Fireblocks 답변을 받은 뒤 확정한다.

### VM 단가 가정

| 항목 | 예산 가정 | 근거 성격 |
|---|---:|---|
| Agent node | 4 vCPU·8 GB RAM·암호화 100 GB SSD | CPU는 내부 가정, memory·storage는 담당자 안내 |
| Customer Server node | 4 vCPU·8 GB RAM·암호화 100 GB SSD | 제공 사양이 없어 Agent와 같은 크기로 임시 산정 |
| node 월 단가 | 20~50만 원 | VM·backup·monitoring·보안 도구를 포함한 내부 chargeback 가정 |
| 연간 node 비용 | 0.24~0.60억 원 | 10 node × 12개월 |

처리량 시험에서 Customer Server의 CPU·memory가 부족하면 운영·DR node만 상향한다.

## Customer Server 구축 사양

Customer Server가 이번 예산의 가장 큰 개발 항목이다. reference server를 그대로 운영에 쓰지 않고 다음 기능을 production 범위로 둔다.

| 영역 | 구현 범위 |
|---|---|
| Agent interface | `api/customer-server.api.yml` 계약에 맞춘 요청·응답 처리 |
| 요청 검증 | request ID, key ID, signing payload와 허용 transaction 확인 |
| 업무 통제 | 고객 승인 기록·정책과 비교해 승인 또는 거절 |
| HSM 연동 | Luna Client·PKCS#11 session, key lookup, ECDSA·EdDSA signing |
| PoO | Interactive challenge 처리와 필요 시 Non-interactive message 생성 |
| 중복 처리 | at-least-once 재전달에도 같은 request가 한 결정으로 수렴 |
| 오류 처리 | Agent·HSM·network timeout, 만료·실패 요청의 fail-close |
| 보안 | credential 분리, key material 비노출, 접근 제어, dependency patch |
| 관측 | health, 처리 지연, 승인·거절·오류, Agent·HSM 연결 상태 |
| 운영 | 주 시스템·대기 시스템 전환, 배포·rollback, 장애 접수 자료 |

Key Management Dashboard는 key 등록·상태·vault 할당을 제공하지만 위 Customer Server 기능을 대신하지 않는다.

## Fireblocks Agent 구축 사양

Agent는 새로 개발하지 않고 Fireblocks가 공개한 코드를 배포한다. 고객 구축 범위는 다음과 같다.

- 환경별 container image와 configuration 관리
- Signer 역할 API user 생성·승인과 pairing token 등록
- Fireblocks endpoint allowlist와 outbound network 구성
- Customer Server endpoint 연결
- process health·재시작·log·metric 연동
- version upgrade와 rollback 절차
- 주 Agent 장애 시 대기 Agent로 넘기는 운영 절차

Agent software 자체의 개발비는 잡지 않고 배포·보안·운영 자동화 공수만 계산한다.

## HSM 사양과 비용 시나리오

Fireblocks는 특정 Luna 모델을 강제하지 않는다. 다음 조건을 만족하는 현재 장비가 있으면 우선 재사용한다.

| 항목 | 최소 확인 내용 |
|---|---|
| Interface | PKCS#11 제공 |
| ECDSA | `secp256k1` 지원 |
| EdDSA | `ed25519` 지원. 담당자 안내는 Luna firmware 7.8.9 이상 |
| Client | Customer Server OS와 호환되는 Luna Client |
| Network | Customer Server와 NTLS 연결 |
| HA | Luna HA group 또는 동등한 장애 전환 |
| Backup | partition cloning 또는 Luna Backup HSM |
| Capacity | vault 수량에 필요한 ECDSA·EdDSA object와 증가분 수용 |

### HSM 장비비 가정

| 구성 | 장비비 예산 | 포함 가정 |
|---|---:|---|
| 기존 장비 활용 | 0억 원 | 기존 support·HA·backup 사용 |
| 기존 장비 보완 | 0.3~1.0억 원 | firmware·Client·license·partition·backup 보완 |
| 신규 2대 HA | 1.0~2.5억 원 | Network HSM 2대, Backup HSM 또는 동등한 backup, 초기 support |
| 신규 4대 두 site | 2.0~4.5억 원 | 운영·DR site 각 2대 HA, 공용 또는 별도 backup, 초기 support |

이 금액은 Thales 견적이 아닌 내부 예산 placeholder다. 모델·성능·partition·PED 방식·support 기간이 정해지면 실제 견적으로 교체한다.

## 구축 공수 산정

인력 단가는 외부 구축 인력의 제경비를 포함해 **1인월 2,000만 원**으로 가정한다.

| 작업 | 예상 공수 | 금액 |
|---|---:|---:|
| 아키텍처·보안 설계 | 1~2인월 | 0.2~0.4억 원 |
| Agent 배포·pairing·운영 자동화 | 1~1.5인월 | 0.2~0.3억 원 |
| Customer Server core 구현 | 3~4인월 | 0.6~0.8억 원 |
| 업무 검증·중복·오류 처리 | 1.5~2.5인월 | 0.3~0.5억 원 |
| Luna·PKCS#11·NTLS 연동 | 2~3인월 | 0.4~0.6억 원 |
| 주·대기·DR·monitoring | 2~3인월 | 0.4~0.6억 원 |
| 통합·장애·성능·보안 시험 | 2~3인월 | 0.4~0.6억 원 |
| 운영 문서·교육·사업관리 | 0.5~2인월 | 0.1~0.4억 원 |
| 합계 | **13~21인월** | **2.6~4.2억 원** |
| 예비비 20% | — | **0.5~0.8억 원** |
| 고객 시스템 구축비 | — | **3.1~5.0억 원** |

13~21인월은 4~6명 규모의 팀이 약 3~4개월 수행하는 범위다. 기존 내부 개발자가 수행하면 현금 지출은 줄지만 동일 공수를 내부 기회비용으로 본다.

## 연간 운영비 산정

| 항목 | 연간 가정 |
|---|---:|
| Agent·Customer Server node | 0.24~0.60억 원 |
| 운영·장애 대응 인력 0.5~1 FTE | 0.60~1.20억 원 |
| 기존 HSM 그대로 활용 시 support 증분 | 0~0.30억 원 |
| 기존 HSM 보완 시 support 증분 | 0.10~0.40억 원 |
| 신규 HSM 2대 HA 시 support | 0.20~0.50억 원 |
| 신규 HSM 4대 두 site 시 support | 0.40~1.00억 원 |

- 기존 HSM 그대로 활용: **연 0.84~2.10억 원**
- 기존 HSM 보완: **연 0.94~2.20억 원**
- 신규 HSM 2대 HA: **연 1.04~2.30억 원**
- 신규 HSM 4대 두 site: **연 1.24~2.80억 원**

운영 조직이 기존 HSM·container platform을 함께 담당하면 하단에 가까워지고, Key Link 전담 on-call과 별도 support 계약이 필요하면 상단에 가까워진다.

## 수량에 따라 바뀌는 비용

| 변수 | 비용 영향 |
|---|---|
| vault 수 | vault별 ECDSA·EdDSA key object와 등록·운영량 증가 |
| 지원 chain | Ed25519 필요 시 Luna firmware·장비 선택에 영향 |
| Customer Server 검증 범위 | 단순 key signing보다 업무 transaction 재검증이 많을수록 개발·시험 증가 |
| 운영·DR 분리 수준 | site·node·HSM 수와 장애 시험 증가 |
| 처리량 | Customer Server VM 크기와 HSM 성능 등급에 영향 |
| key ceremony | 승인자 수·오프라인 절차·감사 증적에 따라 운영 공수 증가 |

vault 수 자체가 Customer Server 개발비를 크게 바꾸지는 않지만 HSM object 용량과 key 등록·감사 운영량을 바꾼다.

## 현재 사용할 기준 예산

현재 Luna가 `secp256k1`·`ed25519`·PKCS#11·HA·backup 조건을 충족한다고 가정하면 다음 금액을 예산 초안으로 사용한다.

| 구분 | 기준 금액 |
|---|---:|
| 초기 고객 구축비 | **4.0억 원** |
| 초기 예산 범위 | **3.1~5.0억 원** |
| 연간 고객 운영비 | **1.2억 원** |
| 연간 예산 범위 | **0.8~2.1억 원** |

신규 Luna가 필요하면 초기 예산에 **1.0~2.5억 원**을 추가한다. Fireblocks 관련 가격은 회신 후 별도 항목으로 더하며 현재 기준 금액에는 포함하지 않는다.

## 출처

| ID | 출처 | 반영 범위 |
|---|---|---|
| FB-KL-001 | [Fireblocks Key Link Overview PDF](../../../../sources/fireblocks/pdf/2026-05-19__support-fireblocks-io__fireblocks-key-link-overview.pdf) | 고객 개발 Customer Server·Agent·HSM 구성 |
| FB-KL-002 | [Getting Started PDF](../../../../sources/fireblocks/pdf/2026-05-19__support-fireblocks-io__getting-started-with-fireblocks-key-link.pdf) | Agent setup·key 등록·PoO·Policy |
| FB-KL-003 | [Vault Setup PDF](../../../../sources/fireblocks/pdf/2026-05-19__support-fireblocks-io__set-up-your-fireblocks-vault-with-key-link.pdf) | vault별 key 할당·asset wallet 제약 |
| FB-KL-004 | [Key Management Dashboard PDF](../../../../sources/fireblocks/pdf/Managing%20keys%20with%20the%20Key%20Management%20Dashboard%20%E2%80%93%20Fireblocks%20Help%20Center.pdf) | Console 관리 기능과 API 대안 |
| FB-SUP-005 | Fireblocks 담당자 기술 질의응답, 2026-08-28 | Agent host·Luna·HA/DR·고객 구현 책임 |

공수·VM 단가·HSM 장비비는 제품 문서의 가격이 아니라 이 예산을 계산하기 위한 내부 가정이다.
