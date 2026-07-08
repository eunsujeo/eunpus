---
title: 3. 입금 주소 조회 — depositAddressOf
status: To Do
---

생성과 정반대인 읽기 전용 동사 — 매니저가 블록체인 매니저 DB 에서 (accountId, asset)로 저장된 주소를 읽는다.
벤더 왕복 없이 매니저 자기 DB 만 읽고, 백엔드는 매니저 API 1홉으로 받는 조회 경로의 설계 근거를 정리한다.

# 입금 주소 조회 — depositAddressOf

생성과 정반대인 읽기 전용 — 매니저가 블록체인 매니저 DB 에서 (accountId, asset)로 그 주소를 읽고, 백엔드는 매니저 API 1홉으로 받는다

```
depositAddressOf(accountId, asset) → Address?
// 읽기 · 없으면 null (만들지 않는다 — 생성은 2장)
```

## 매니저가 자기 DB 에서 읽는다 — 벤더 왕복 없음

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

    BE->>BM: depositAddressOf(accountId, asset) — API
    BM->>MDB: (accountId, asset)↔주소 읽기
    alt 있으면
        MDB-->>BM: 주소 (이더리움·Base = 0xAb3… · memoTag null)
        BM-->>BE: 주소
    else 없으면 — 아직 발급 전
        MDB-->>BM: 없음
        BM-->>BE: null
    end
    Note over BM,MDB: 벤더(Fireblocks)를 거치지 않는다 — 매니저 자기 DB 만 읽는다
```

### 왜 DB 읽기인가 (결정)

고객이 입금 화면을 열 때마다 불려, 이 문서에서 호출 빈도가 가장 높은 동사다.

매니저가 **자기 DB 만 읽으므로** 벤더 API 한도·지연에 묶이지 않는다 — 벤더를 왕복하는 설계였다면 가장 잦은 호출이 가장 취약한 경로가 된다. 비용은 백엔드→매니저 내부 API 1홉이다.
