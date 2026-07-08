---
title: 2. 입금 주소 생성 — createDepositAddress
category: 블록체인매니저
status: To Do
---

(account, asset)당 한 번 — 자산 지갑을 활성화해 단일 주소를 얻는다. EVM 주소는 memoTag 가 null 이다.
주소 발급 실패·저장 못 한 경우의 복구 절차와 주소의 두 규칙(vault 추가·감시 등록)을 함께 다룬다.

```
createDepositAddress(accountId, asset) → Address { value, memoTag? }
// EVM: memoTag=null · (account,asset)당 1개 · 활성화 1회(재시도 멱등)
```

## 자산 지갑 활성화 — (account, asset)당 한 번

```mermaid
sequenceDiagram
    autonumber
    box rgb(219,234,254) Service 백엔드 — 어댑터 포함·한 프로세스
    participant BE as 유스케이스
    participant FBI as 블록체인 매니저 어댑터·포트
    end
    participant BDB as 백엔드 DB
    participant FB as Fireblocks SaaS · 벤더

    BE->>FBI: createDepositAddress(accountId, asset)
    FBI->>BDB: (accountId, asset) 조회
    alt 있으면 — 재사용
        BDB-->>FBI: 기존 주소
        FBI-->>BE: 주소 (0xAb3…)
    else 없으면
        FBI->>FB: 벤더에 있는지 확인 — vault 자산 주소 조회 (addresses_paginated)
        alt 벤더에 있음 — 활성화됐는데 저장 못 한 경우
            FB-->>FBI: 기존 주소
        else 벤더에도 없음 — 신규
            FBI->>FB: 자산 지갑 활성화 createVaultAccountAsset · Idempotency-Key=f(accountId,asset)
            FB-->>FBI: 활성화 응답 · address 0xAb3… · memoTag=null
        end
        FBI->>BDB: 주소 저장 (accountId+asset ↔ 0xAb3…) · account·asset UNIQUE
        FBI-->>BE: 주소 (0xAb3…)
    end
    Note over FBI,FB: EVM = account·자산당 주소 1개 · 활성화 1회. generateNewAddress 는 UTXO·Tag 전용의 다른 작업. 감시·귀속은 벤더 몫
```

### 주소의 두 규칙 (결정)

- **추가 주소는 vault 추가로**: EVM 은 (vault, 자산)당 주소가 **하나뿐**이라, 같은 자산의 주소가 더 필요하면 **vault account 를 더 만든다**.
- **감시 등록까지가 발급**: 주소는 감시(귀속) 등록까지 끝나야 "존재"한다 — **등록 안 된 주소로 온 입금은 감지하지 못하며, 입금 사고의 최다 유형**이다. 이 감시·귀속은 벤더 몫(vault 가 곧 감시 범위, 입금 감지 4장).
