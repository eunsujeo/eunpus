---
type: vendor-hub
vendor: wallet-bank
status: draft
tags: [architecture, api]
stage_introduced: 155
last_updated_stage: 155
source_count: 2
related:
  - overview
  - data-model
---
# wallet-bank — Architecture

> 코어의 Kotlin/Spring Boot 멀티모듈 아키텍처. 의존성 역전(DIP)과 도메인 순수성을 축으로 한다 (source: wallet-bank/아키텍쳐/architecture.md).

## Summary

daw-core 는 Gradle 멀티모듈 + Feature 기반 Layered 아키텍처를 따른다. 도메인은 순수 Kotlin 으로 유지하고 인프라(DB·외부 API·메시징)를 어댑터로 격리한다 (source: wallet-bank/아키텍쳐/architecture.md). 기술 스택은 Kotlin 2.x · JDK 25 · Spring Boot 4.0 · Spring Data JDBC · PostgreSQL · Gradle Kotlin DSL · Kotest/MockK/Testcontainers (source: wallet-bank/README.md).

## Key Concepts

- **모듈 구조** — `{project}-app`(api/bat) · `{project}-domain` · `{project}-infra`(persistence/client/messaging) · `{project}-support` (source: wallet-bank/아키텍쳐/architecture.md).
- **의존성 방향** — domain 은 아무 모듈에도 의존하지 않음(순수 Kotlin). support→domain. infra→domain,support. app→전 모듈(조립 지점) (source: wallet-bank/아키텍쳐/architecture.md).
- **DIP** — domain 에 Repository 인터페이스(port)를 정의하고 infra/persistence 가 구현(adapter). application 은 domain 인터페이스에만 의존 (source: wallet-bank/아키텍쳐/architecture.md).
- **물리 컬럼명 격리** — 물리 컬럼명(메타 표준, 예 `tb_ldgr_m`·`ldgr_id`)은 infra 에서만 다룬다. domain 은 논리 모델만 안다 (source: wallet-bank/아키텍쳐/architecture.md).

## Details

### 레이어 규칙

| 레이어 | 역할 | 금지 |
|---|---|---|
| api | 요청 검증 + 응답 변환 | 비즈니스 로직 |
| application | 트랜잭션 경계, 유스케이스 오케스트레이션 | 도메인 로직 직접 구현 |
| domain | 비즈니스 로직, Repository 인터페이스 정의 | Spring/JDBC 등 외부 프레임워크 의존 |
| infra | Repository 구현체, 외부 API 클라이언트 | 비즈니스 판단 |

(source: wallet-bank/아키텍쳐/architecture.md)

### 핵심 원칙

1. 의존성 역전(DIP) — port(domain)/adapter(infra) 분리.
2. 도메인 순수성 — domain 에 Spring/JDBC 어노테이션 금지.
3. 인프라 분리 — 물리 컬럼명은 infra 전용.
4. API 응답 — 도메인 객체 직접 반환 금지, Response DTO 로 변환.
5. 비즈니스 로직 위치 — Service 는 오케스트레이션만, 판단은 Domain.
6. 피처 간 참조 — 다른 피처의 Repository 직접 접근 금지, Service 경유만.

(source: wallet-bank/아키텍쳐/architecture.md)

### 런타임

- 로컬 실행 포트 8083 (management 18083), Swagger UI `/swagger-ui.html`, 로컬 DB `daw_local`(PostgreSQL) (source: wallet-bank/README.md).
- Testcontainers 사용 — 테스트에 Docker 필수 (source: wallet-bank/README.md).

## Related Pages

- [[vendors/wallet-bank/overview]]
- [[vendors/wallet-bank/data-model]]

## Sources

- `wallet-bank/아키텍쳐/architecture.md`
- `wallet-bank/README.md`

## Open Questions

- 없음 (아키텍처 문서는 확정 규약으로 기술됨).
