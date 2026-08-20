# blockchain-manager

디지털자산 지갑 플랫폼에서 **온체인 거래를 담당하는 블록체인 노드 연동** 모듈입니다. 코어 존에 위치합니다.

## 모듈 구조

```
blockchain-manager/
├── blockchain-manager-app/        # 애플리케이션 (부트스트랩)
│   └── manager-api/               # REST API 엔드포인트
├── blockchain-manager-domain/     # 도메인 모델 (순수 Kotlin, 프레임워크 의존 없음)
├── blockchain-manager-infra/      # 인프라스트럭처
│   ├── client/                    # 블록체인 노드 클라이언트
│   ├── messaging/                 # 메시징 (Kafka 등)
│   └── persistence/               # DB 영속성 (Spring Data JDBC)
└── blockchain-manager-support/    # 공통 유틸, 설정
```

### 의존성 방향

```
app(api) → domain ← infra
             ↑
           support
```


• `domain`은 프레임워크에 의존하지 않는 순수 Kotlin.
• `infra`가 `domain`의 Repository 인터페이스를 구현 (DIP).

## 기술 스택

| 항목 | 버전 |
|------|------|
| Kotlin | 2.x |
| JDK | 25 |
| Spring Boot | 4.0 (Spring Framework 7) |
| ORM | Spring Data JDBC |
| DB | PostgreSQL |
| 빌드 | Gradle Kotlin DSL |
| 테스트 | Kotest + MockK + Testcontainers |

## 빌드 / 실행

```sh
# 빌드
./gradlew build

# 로컬 실행 (port: 8083, management: 18083)
./gradlew :blockchain-manager-app:manager-api:bootRun --args='--spring.profiles.active=local'
```


Swagger UI: http://localhost:8083/swagger-ui.html


## 테스트

```sh
./gradlew test
```


• Testcontainers 사용 — **Docker 실행 필수**.

## 로컬 DB

```
jdbc-url : jdbc:postgresql://localhost:5432/daw_local
username : daw
password : daw
```

프로젝트 루트에서 `docker compose up -d`로 DB를 실행할 수 있습니다.

## 참고 문서

• 아키텍처 결정 기록: docs/adr/.