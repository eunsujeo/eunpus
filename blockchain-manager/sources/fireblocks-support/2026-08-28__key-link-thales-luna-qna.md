# Fireblocks 담당자 대화 — Key Link·Thales Luna

- 기록 수령일: 2026-08-28
- 자료 성격: Key Link 도입을 위한 기술·가격 질의응답
- 적용 범위: HSM 요구사항, Customer Server, Agent 실행 환경, HA·DR, 가격 구조
- 정규화: 사용자 제공 영문 답변을 문항별로 재배열한 한국어 기록. 기술 값과 제품명은 원문을 유지했다.
- 주의: Luna 펌웨어 수치는 Fireblocks 담당자가 Thales 통합 가이드를 인용한 2차 정보다.

## 1. HSM·Thales Luna 요구사항

Fireblocks 측은 특정 Luna 모델을 의무화하거나 인증하지 않으며 Key Link는 HSM-agnostic이라고 답했다. 요구사항은 하드웨어 모델이 아니라 알고리즘과 인터페이스 기준이다.

- Signing Key: ECDSA `secp256k1`, EdDSA `ed25519`
- Validation Key: RSA-2048
- HSM 인터페이스: PKCS#11

담당자가 인용한 Thales 통합 가이드 기준으로 ECDSA `secp256k1`은 Luna 7.x 펌웨어에서 동작하고, EdDSA `ed25519`는 Luna 펌웨어 7.8.9 이상이 필요하다. Thales의 시험 구성은 Luna Network HSM 펌웨어 7.8.4와 Luna Client 10.3.0이었고, 다른 Luna 모델도 해당 클라이언트와 호환되는 펌웨어를 사용하면 지원된다고 설명했다.

따라서 담당자는 Bitcoin·EVM만 대상으로 하면 현재 Luna 7.x를 사용할 수 있고, Solana처럼 `ed25519`를 쓰는 체인을 포함하면 7.8.9 이상을 조달 조건으로 두라고 안내했다.

## 2. Customer Server 구현 책임

Fireblocks는 인터페이스 계약과 동작하는 reference code를 제공하지만 production 구현은 고객이 구축·소유한다고 답했다.

- 공개 저장소: <https://github.com/fireblocks/fireblocks-agent>
- 인터페이스 계약: `api/customer-server.api.yml`
- 예제 서버: `examples/server`
- Thales Luna build 포함
- 예제는 production software가 아니라 reference code

직접 구축하지 않는 대안으로 Fireblocks 측은 **KeyLink Flow**를 제시했다. 이는 online server와 operator console을 패키징해 bespoke 구현의 상당 부분을 대체하는 제품이라고 설명했다. 지원 범위와 계약 조건은 별도 확인이 필요하다.

## 3. Fireblocks Agent 실행 환경

다음 값은 hard minimum이 아니라 deployment guidance다.

| 항목 | 담당자 안내 |
|---|---|
| OS | Ubuntu 22.04 LTS 이상 또는 Docker를 지원하는 Linux 배포판 |
| 메모리 | 환경당 8 GB RAM |
| 저장장치 | 암호화된 100 GB SSD |
| Runtime | Docker |
| Network | Fireblocks endpoint로의 안정적인 outbound 연결, firewall 목적지 제한 |

Luna Client는 Customer Server host에 설치한다. 이 host는 장비와 NTLS로 통신할 수 있어야 하고 Luna client로 등록돼야 한다. air-gapped cold 환경은 완전한 네트워크 격리와 encrypted media, SFTP 또는 data diode를 통한 전달을 사용한다고 설명했다.

VM과 container는 지원되며 Docker가 표준 배포 모델이다. Agent는 stateless로 설계돼 재시작·재배포할 수 있다고 답했다.

## 4. HA·DR

Fireblocks 측은 key recovery와 component redundancy를 구분했다.

### Key recovery

Key Link의 키는 고객 HSM에만 있으므로 백업·복구는 Luna native 기능으로 처리한다. 담당자는 HA group, partition cloning, Luna Backup HSM을 예로 들었다. Fireblocks 측 key material 복구 서비스가 이 역할을 대신하지 않는다.

### Component redundancy

한 workspace에 여러 Agent를 pair할 수 있지만 다음 제약이 있다.

- Agent마다 별도 identity와 Fireblocks 측 message queue를 가진다.
- Signing Key는 특정 Agent user에 결속되고, 해당 키의 요청은 그 Agent로 routing된다.

이 때문에 현재 권장 topology는 active/active가 아니라 **active/passive**다. Agent와 Customer Server에 대한 built-in HA·DR 자동화는 없으며 process supervision과 failover는 고객이 설계한다. Professional Services가 이 영역을 지원할 수 있다고 설명했다.

전달되지 않은 signing request는 Fireblocks 측 queue에 최대 7일간 durable하게 보존되고 at-least-once 방식으로 전달된다. Agent가 재접속하면 다시 전달되므로 고객 구현은 중복 요청을 안전하게 처리해야 한다.

## 5. 가격

Fireblocks 측은 다음 구조만 답하고 정확한 금액은 별도 상업 담당자에게 넘겼다.

- Key Link: Fireblocks subscription의 paid add-on
- Professional Services implementation package: 별도 견적
- Luna hardware·Thales license: Thales에서 직접 구매하며 Fireblocks 계약에 포함되지 않음

KeyLink Flow의 가격, 환경별 과금, Agent·workspace·key 수에 따른 과금 기준은 제공된 답변에 없다.

## 6. 원문 질의

1. 지원 또는 권장 Thales Luna 모델과 HSM 알고리즘·인터페이스 요구사항
2. production-ready Customer Server 또는 Thales Luna reference code 제공 여부
3. Fireblocks Agent 권장 host specification·OS와 VM/container 제한
4. 한 workspace의 multiple Agent, HA·DR reference architecture
5. Key Link 가격과 추가 비용
