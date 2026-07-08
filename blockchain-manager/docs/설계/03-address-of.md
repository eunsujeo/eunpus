---
title: 3. 입금 주소 조회 — depositAddressOf
category: 블록체인매니저
status: To Do
---

생성과 정반대인 읽기 전용 동사 — 매니저가 백엔드 DB 에서 (accountId, asset)로 저장된 주소를 읽는다.
벤더 왕복 없이 백엔드 DB 만 읽는 조회 경로의 설계 근거를 정리한다.

# 입금 주소 조회 — depositAddressOf

생성과 정반대인 읽기 전용 — 매니저가 백엔드 DB 에서 (accountId, asset)로 그 주소를 읽는다

```
depositAddressOf(accountId, asset) → Address?
// 읽기 · 없으면 null (만들지 않는다 — 생성은 2장)
```

## 매니저가 백엔드 DB 에서 읽는다 — 벤더 왕복 없음

```mermaid
sequenceDiagram
    autonumber
    box rgb(219,234,254) Service 백엔드 — 어댑터 포함·한 프로세스
    participant BE as 유스케이스
    participant FBI as 블록체인 매니저 어댑터·포트
    end
    participant BDB as 백엔드 DB

    BE->>FBI: depositAddressOf(accountId, asset)
    FBI->>BDB: (accountId, asset)↔주소 읽기
    alt 있으면
        BDB-->>FBI: 주소 (이더리움·Base = 0xAb3… · memoTag null)
        FBI-->>BE: 주소
    else 없으면 — 아직 발급 전
        BDB-->>FBI: 없음
        FBI-->>BE: null
    end
    Note over FBI,BDB: 벤더(Fireblocks)를 거치지 않는다 — 백엔드 DB 만 읽는다
```

### 왜 DB 읽기인가 (결정)

고객이 입금 화면을 열 때마다 불려, 이 문서에서 호출 빈도가 가장 높은 동사다. 백엔드 DB 읽기라 벤더 API 한도·지연에 묶이지 않는다 — 벤더를 왕복하는 설계였다면 가장 잦은 호출이 가장 취약한 경로가 된다.

더 깊이: 조회/발급 분리의 근거 — 가이드 13.3.
