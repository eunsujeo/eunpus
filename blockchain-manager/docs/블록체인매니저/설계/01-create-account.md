---
title: 1. 계정 생성 — createAccount
status: In Progress
---

createAccount(uid) 는 블록체인 매니저 API 오퍼레이션 — Service 백엔드가 HTTP API 로 호출하면 매니저가 Fireblocks vault 를 만들고 Account { uid, accountId } 매핑을 블록체인 매니저 DB 에 저장한다.
고객당 한 번 — vault 를 만들며 재시도는 Idempotency-Key 와 블록체인 매니저 DB uid UNIQUE 로 중복을 막는다.

```
createAccount(uid) 리턴 Account { uid, accountId }
// accountId = vault 매핑 id
```

## createAccount — vault 를 만든다

```mermaid
sequenceDiagram
    autonumber
    box rgb(219,234,254) Service 백엔드
    participant BE as 유스케이스
    end
    box 블록체인 매니저 — 별도 서비스
    participant BM as 블록체인 매니저 API
    participant MDB as 블록체인 매니저 DB
    end
    participant FB as Fireblocks SaaS · 벤더

    BE->>BM: API createAccount(uid)
    BM->>MDB: uid 조회
    alt 있으면 — 재사용
        MDB-->>BM: 기존 accountId
        BM-->>BE: Account { uid, accountId }
    else 없으면
        BM->>FB: 벤더에 있는지 확인 — accounts_paged · namePrefix=uid
        alt 벤더에 있음 — 만들었는데 저장 못 한 경우
            FB-->>BM: 기존 vaultId
        else 벤더에도 없음 — 신규
            BM->>FB: createVaultAccount(name=uid) · Idempotency-Key=f(uid)
            FB-->>BM: vaultId
        end
        BM->>MDB: 저장 (uid ↔ vaultId · uid UNIQUE)
        BM-->>BE: Account { uid, accountId }
    end
    Note over BM,FB: 재시도는 Idempotency-Key 로 24h 같은 vaultId · 영구 유일성은 매니저 DB uid UNIQUE
```

### 한 번만 — 재시도·중복 방어 (결정)

- **재시도**: Idempotency-Key 로 24시간 내 재시도는 같은 vaultId (중복 vault 없음).
- **유일성**: 매니저 DB 의 uid UNIQUE 가 최종 방어 — 경합해도 이긴 값을 반환한다.
