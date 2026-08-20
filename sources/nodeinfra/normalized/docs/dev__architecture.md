<!--
source_url: https://docs.nodeinfra.com/dev/architecture
path: /dev/architecture
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 노드월렛 Java SDK로 스테이블코인 백엔드 서비스를 구축하는 방법
-->

# 아키텍처

## 노드월렛 Java SDK

스테이블코인 금융 백엔드 서비스를 구축하기 위한 Java SDK입니다.

SDK는 노드월렛 접근 키 (다중서명)의 전체 라이프사이클을 관리합니다.
Ed25519 서명 키를 PKCS#11 HSM에 안전하게 보관하고, 모든 API 요청에 자동으로 서명을 수행합니다.
개발자는 서명 프로토콜을 직접 구현할 필요 없이, 비즈니스 로직에만 집중할 수 있습니다.

### 보안

- **HSM 기반 키 보호** — Ed25519 서명 키는 PKCS#11 토큰 내부에만 존재하며, JVM 메모리에 노출되지 않음
- **자동 요청 서명** — 정규 메시지 구성, SHA-256 해싱, Ed25519 서명, 헤더 첨부까지 SDK가 자동 처리
- **타임스탬프 검증** — 60초 윈도우 기반 리플레이 공격 방지
- **운영 환경 강제** — `mode=production` 설정 시 소프트웨어 HSM(SoftHSM2) 자동 차단

SDK가 수행하는 `개시 키` 서명은 3-키 다중서명의 한 축일 뿐입니다. 서버 측의 3-키 구조 · SGX 엔클레이브 · HSM 파티션 등 전체 보안 아키텍처는 [보안 포털](/security)에서 확인하세요.

### 편의성

- **단일 코드 패스** — 개발(SoftHSM2)과 운영(Thales Luna, Utimaco) 환경에서 동일한 코드
- **Spring Boot 지원** — Auto-Configuration으로 설정 간소화 ([스프링 연동](/dev/spring/setup))
- **타입 안전한 도메인 모델** — `SolanaAddress`, `WalletId`, `TokenId` 등 컴파일 타임 검증
- **멱등성 키 필수화** — 이체/출금 요청에 `reference_id`가 필수이므로 중복 처리 원천 방지
- **구조화된 예외 처리** — `ErrorCode` 33종 + 타입별 예외 클래스로 오류 원인 즉시 파악

## 지갑 종류

노드월렛은 한 테넌트 안에서 세 종류의 지갑을 운영합니다. 각 지갑은 역할과 라이프사이클이 다르며, 별도의 API로 조회합니다.

| 지갑 | 역할 | 누가 만드는가 | 테넌트당 개수 | 조회 API |
| --- | --- | --- | --- | --- |
| 사용자 지갑 | 사용자별 입금 주소 | SDK의client.wallets().create() | 사용자당 1개 | GET /v1/wallets,GET /v1/wallets/{id} |
| 집중 지갑 | 사용자 입금이 스윕되어 모이는 핫월렛. 출금 자금의 출처 | 테넌트 부트스트랩 시 시스템이 자동 생성 | 테넌트당 1개 | GET /v1/tenant/omnibus-wallet |
| 가스대납 지갑 | 스윕·출금 트랜잭션의 SOL 수수료 대납 | 테넌트 부트스트랩 시 시스템이 자동 생성 | 테넌트당 1개 | GET /v1/tenant/gas-payer-wallet |

### 자금 흐름

- 집중 지갑과 가스대납 지갑은 SDK API로 만들 수 없습니다. 테넌트 프로비저닝 시 시스템이 자동 생성하며, DB 무결성 제약(테넌트당 정확히 1개)으로 강제됩니다.
- 사용자 지갑의 잔액은 ledger상 사용자 계정에 기록되며, 실제 자산은 스윕 후 집중 지갑에 보관됩니다.
- 가스대납 지갑은 운영 가정상 SOL만 보유합니다. 잔액은 `balances["SOL"]`(lamports)에서 확인하며, 임계치 모니터링은 SDK 또는 운영 도구가 폴링으로 수행합니다.

## 다음 단계

## 빠른 시작

5분 안에 첫 API 호출하기

## 설치 가이드

Gradle 의존성 추가 및 PKCS#11 설정
