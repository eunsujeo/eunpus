---
title: 2. 입금 주소 생성 — createDepositAddress
status: Done
---

(계정, 네트워크, 토큰)당 한 번 — 백엔드가 블록체인 매니저 API 를 호출하면 매니저가 자산 지갑을 활성화해 단일 주소를 얻는다. EVM 주소는 memoTag 가 null 이다.
(계정, 네트워크, 토큰)↔주소 매핑은 블록체인 매니저 DB 에 저장한다. 저장 못 한 경우의 복구도 매니저 안에서 처리한다.

```kotlin
fun createDepositAddress(accountId: AccountId, network: Network, token: Token): Address {
  return Address(value, memoTag)
}
```

## 자산 지갑 활성화

```mermaid
sequenceDiagram
    autonumber
    box rgb(219,234,254) Service 백엔드
    participant BE as 유스케이스
    end
    box rgb(220,252,231) 블록체인 매니저 — 별도 서비스
    participant BM as 블록체인 매니저 API
    participant MDB as 블록체인 매니저 DB
    end
    participant FB as Fireblocks SaaS · 벤더

    BE->>BM: API · createDepositAddress(accountId, network, token)
    BM->>MDB: (accountId, network, token) 조회
    alt 있으면 — 재사용
        MDB-->>BM: 기존 주소
        BM-->>BE: 주소 (0xAb3…)
    else 없으면
        BM->>FB: 벤더에 있는지 확인 — vault 자산 주소 조회 (addresses_paginated)
        alt 벤더에 있음 — 활성화됐는데 저장 못 한 경우
            FB-->>BM: 기존 주소
        else 벤더에도 없음 — 신규
            BM->>FB: 자산 지갑 활성화 createVaultAccountAsset · Idempotency-Key=f(accountId,network,token)
            FB-->>BM: 활성화 응답 · address 0xAb3… · memoTag=null
        end
        BM->>MDB: 주소 저장 · (계정,네트워크,토큰) UNIQUE
        BM-->>BE: 주소 (0xAb3…)
    end
    Note over BM,FB: EVM = 계정·자산당 주소 1개 · 활성화 1회. generateNewAddress 는 UTXO·Tag 전용의 다른 작업. 감시·귀속은 벤더 몫
```

### 주소의 두 규칙 (결정)

- **추가 주소는 vault 추가로**: EVM 은 (vault, 자산)당 주소가 **하나뿐**이라, 같은 자산의 주소가 더 필요하면 **vault account 를 더 만든다**.
- **감시 등록까지가 발급**: 주소는 감시(귀속) 등록까지 끝나야 "존재"한다 — 등록 안 된 주소로 온 입금은 감지하지 못하며 입금 사고의 최다 유형이다. 이 감시·귀속은 벤더 몫(vault 가 곧 감시 범위, 입금 감지 4장).

## 여러 네트워크 한 번에 — createDepositAddresses

고객이 한 토큰을 **여러 네트워크로 받고 싶을 때** 쓴다. USDC 를 이더리움·폴리곤·트론에서 받으려면 세 주소가 필요하고, 그때마다 단건 발급을 세 번 호출하는 대신 토큰 하나와 네트워크 목록으로 한 번에 묶는다.

```kotlin
fun createDepositAddresses(accountId: AccountId, token: Token, networks: List<Network>): List<AddressResult>
```

발급 규칙은 새로 생기지 않는다 — 네트워크마다 단건 발급과 결과가 같고 멱등하다. 계정은 하나이므로 vault 도 하나이고, **자산 지갑만 네트워크별로 여러 개 활성화**되는 것이다.

### 네트워크 목록은 누가 정하나 (결정)

**DAW-CORE 가 네트워크 목록을 함께 보낸다.** 매니저는 토큰 이름만 받아 네트워크를 스스로 채우지 않는다.

- 어떤 네트워크로 받을지는 **상품 결정**이다 — 같은 USDC 라도 서비스가 지원할 네트워크를 골라야 하고, 그 목록은 매니저가 알 이유가 없다.
- 매니저가 갖는 표는 **(네트워크, 토큰) → 벤더 assetId** 변환표 하나다. 토큰 하나가 어느 네트워크에서 지원되는지까지 매니저가 알면 상품 결정이 매니저로 새어 들어온다.

### 실패와 순서 (결정)

| 결정 | 값 | 이유 |
|---|---|---|
| 계정이 없을 때 | 요청 전체 404 | 계정은 경로에 하나뿐이라 네트워크별 사유가 아니다. 네트워크별 실패는 미지원 네트워크·벤더 오류만 남는다 |
| 네트워크별 실패 | 항목별 (전체 롤백 없음) | 세 네트워크 중 하나가 실패했다고 나머지 둘을 되돌리면, 멱등이라 결과는 같아도 벤더 호출을 두 배로 쓴다 |
| 응답 순서 | 요청 순서 고정 | 호출 쪽이 자기 목록과 위치로 대응한다 |
| 중복 네트워크 | 발급 1회 · 결과는 두 항목에 동일 | 같은 네트워크가 두 번 들어와도 벤더를 두 번 부르지 않는다 |
| 한 요청 상한 | 20네트워크 | 한 토큰이 지원되는 네트워크 수를 넉넉히 담는 크기. 벤더 호출 수는 줄지 않으므로 상한은 필요하다 |

HTTP 상태는 네트워크별 결과와 무관하게 200 이고, 판단은 항목별 에러 유무로 한다. 성공분은 멱등해 같은 주소가 다시 오므로 **같은 요청을 그대로 재시도**할 수 있다.

**벤더 호출 수는 줄지 않는다** — 네트워크마다 벤더를 한 번 부르므로 줄어드는 것은 백엔드↔매니저 왕복뿐이다. 순차 처리이고, 상한 20네트워크가 곧 지연의 상한이다.

**태그가 필요한 체인은 아직 못 다룬다** — 여러 네트워크를 다루면 XRP·XLM 처럼 주소 외에 태그·메모가 필요한 체인이 섞인다. 지금 `memoTag` 는 벤더 태그를 보관하지 않아 항상 null 이므로, 그런 체인을 지원하려면 태그 보관을 먼저 정해야 한다.
