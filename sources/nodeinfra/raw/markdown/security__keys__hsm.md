<!--
source_url: https://docs.nodeinfra.com/security/keys/hsm
path: /security/keys/hsm
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: Thales Luna · YubiHSM (FIPS 140-3 Level 3) — 3개 키를 생성하고 그 중 2개를 상시 보호합니다.
-->

# HSM

$/$[Skip to main content](#content-area)[노드월렛 기술 문서  home page](/)Search...⌘ KAsk AI
-
Search...Navigation키 관리HSM

> ## Documentation Index
>
>
>
> Fetch the complete documentation index at: [https://docs.nodeinfra.com/llms.txt](https://docs.nodeinfra.com/llms.txt)
>
>
>
> Use this file to discover all available pages before exploring further.

노드월렛의 모든 서명 키는 **FIPS 140-3 Level 3 HSM** 내부에서 생성됩니다.
마스터 키는 HSM 내부에서 만들어지며 평문으로 외부에 노출된 적이 없습니다.
HSM은 3개 중 2개 키(`개시 키` · `승인 키`)를 **상시 보관**하고, 나머지 1개(`실행 키`)는 **프로비저닝 시 생성해 SGX 엔클레이브로 봉인 전달**합니다.
프로비저닝이 끝난 뒤 `실행 키`는 SGX 안에 실링되어 있고 HSM은 오프라인이어도 서명 서비스가 정상 동작합니다. → [TEE 엔클레이브](/security/keys/tee-enclave)

## ​3개 파티션 구조

노드월렛은 3-키 다중서명을 위해 HSM을 **3개의 독립 파티션**으로 분할합니다.
각 파티션은 서로 다른 토큰 PIN · 지정 서비스 접근 제한 · 독립된 운영자 쿼럼으로 보호됩니다.
아래 다이어그램은 **단일 HSM + 파티셔닝** 토폴로지를 가정합니다. 비용과 운영 부담이 적어 기본 구성으로 제공하며, 더 강한 격리가 필요하면 [키별로 독립 HSM을 배치](#%EB%8B%A4%EC%A4%91-hsm-%EB%B0%B0%EC%B9%98-%EA%B6%8C%EC%9E%A5)하는 구성을 권장합니다.
$!/$

| 파티션 | 접근 서비스 | 운영 시 HSM 접근 | 용도 |
| --- | --- | --- | --- |
| 개시 키 | 금융사 Spring 백엔드 + Java SDK | 매 개시 서명 | 모든 작업(Withdraw · Transfer · Unsafe-send · Sweep)의 개시 서명 (Ed25519) |
| 승인 키 | 승인자 | 매 co-sign | 정책 통과 공동 서명 |
| 실행 키 | SGX 엔클레이브 | 프로비저닝 시에만 | 마스터 키 생성 후 엔클레이브로 봉인 전달 — 이후 SGX 내부에서 서명 |

Deposit은 체인 이벤트를 관찰·검증하는 경로이므로 `개시 키` 서명을 사용하지 않으며, 입금된 자금의 이동은 `Sweep`에서 3키 의식을 거칩니다.

### ​운영자 쿼럼 (m-of-n)

각 파티션(또는 각 HSM)은 **독립된 m-of-n 운영자 쿼럼**으로 활성화와 키 관리 작업을 보호합니다.
Thales Luna의 PED 키, Utimaco의 관리자 역할이 이에 해당하며, 키별 위험도에 맞춰 서로 다른 임계값을 설정할 수 있습니다:

| 키 | 활성화 쿼럼 예시 | 근거 |
| --- | --- | --- |
| 개시 키 | 3-of-5 | 모든 작업의 개시 서명 — 보수적 쿼럼 |
| 승인 키 | 3-of-5 | 정책 co-sign — 높은 가치 |
| 실행 키 | 4-of-7 | 마스터 키 세레머니 — 최상위 민감도 |

m-of-n 쿼럼은 **파티션 활성화와 키 관리 작업** (생성 · 삭제 · 백업 · 로테이션) 시점에 적용됩니다. 매 트랜잭션 단위의 쿼럼은 HSM이 아닌 **애플리케이션 계층의 3-키 다중서명**으로 구현됩니다. → [다중서명 구조](/security/architecture/multisig)

### ​다중 HSM 배치 (권장)

더 강한 격리가 필요한 경우, **키별로 독립 HSM**을 배치하는 구성을 권장합니다. 단일 HSM의 펌웨어 취약점 · 관리자 침해 · 물리적 사고가 **다른 키로 전파되지 않습니다**.

- **공급사 다양화** — 예: `개시 키`·`승인 키`는 Thales Luna, `실행 키`는 Utimaco로 분산
- **네트워크 구간 분리** — 각 HSM을 서로 다른 VLAN · 관리 네트워크에 배치
- **실행 키 전용 HSM 오프라인 전환** — 프로비저닝 이후 서명에는 HSM 접근이 불필요하므로 콜드 스토리지로 보관 가능 → [TEE 엔클레이브](/security/keys/tee-enclave)
- **규제 대응** — 일부 규제 체계에서 키의 물리적 분리 보관을 요구

노드월렛의 PKCS#11 세션 모델은 **파티션 경계와 HSM 경계를 동일하게 다룹니다**. 단일 HSM + 파티셔닝에서 다중 HSM으로 전환할 때 노드월렛 코드 변경은 없으며, 배포 설정(PKCS#11 슬롯 매핑)만 조정하면 됩니다.

## ​FIPS 140-3 지원 모델

| 모델 | FIPS 레벨 | 폼팩터 | 권장 용도 |
| --- | --- | --- | --- |
| Thales Luna Network 7 | 140-3 Level 3 | 네트워크 어플라이언스 | 대규모 운영 환경 |
| Thales Luna PCIe 7 | 140-3 Level 3 | PCIe 카드 | 단일 서버 고성능 |
| Utimaco SecurityServer | 140-3 Level 3 | 네트워크/PCIe | 유럽 은행 권장 |
| YubiHSM 2 | 140-2 Level 3 | USB | 샌드박스 · 개발 환경 |

## ​키 생성과 래핑

- **상시 보관 키** (`개시 키` · `승인 키`) — HSM 내부 생성, PKCS#11 세션으로 서명 호출
- **프로비저닝 전용 키** (`실행 키` 마스터) — HSM 내부에서 생성된 뒤, 엔클레이브의 일회성 RSA 공개키로 **RSA-OAEP 래핑**되어 엔클레이브에 전달. 엔클레이브가 복호화 후 MRENCLAVE로 실링. 평문 마스터 키가 HSM 밖으로 노출되는 시점은 엔클레이브 내부뿐입니다.

## ​PKCS#11 인터페이스

모든 HSM 접근은 PKCS#11 v2.40 / v3.0 표준으로 이루어집니다.
서비스별로 다른 슬롯과 세션을 사용하며, 한 서비스의 세션은 다른 파티션에 접근할 수 없습니다.⌘ I[Powered byThis documentation is built and hosted on Mintlify, a developer documentation platform](https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=nodewallet)$/$Responses are generated using AI and may contain mistakes.
