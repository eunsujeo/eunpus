---
title: 5. 입금 — 한 건이 잔액이 되기까지
status: To Do
---

큐에 publish 된 입금 이벤트가 대기를 거쳐 가용이 되고 고객 vault 에서 옴니버스로 모이기까지를 다룬다.
감지는 블록체인 매니저 내부 폴링, 원장 반영은 백엔드 큐 컨슈머의 일이다. 감지·판정 기준은 4장을 그대로 쓴다. 입금이 지나는 상태 넷, reorg 예외, sweep 과 원장 반영 순서를 정리한다.

## 입금 한 건이 흐르는 길 — 매니저가 감지해 큐에 publish, 백엔드가 consume 해 확정까지

```mermaid
sequenceDiagram
    autonumber
    participant EXT as 외부 송신자
    participant CH as EVM 체인 (이더리움·Base)
    participant FB as Fireblocks (SaaS)
    box rgb(220,252,231) 블록체인 매니저 — 별도 서비스
    participant BM as 매니저 내부 폴링
    participant MDB as 블록체인 매니저 DB<br/>커서 · 주소 매핑 · 체크포인트
    end
    box rgb(254,249,195) 메시지 큐
    participant MQ as deposit-events
    end
    box rgb(224,242,254) Service 백엔드
    participant QC as 큐 컨슈머
    participant DB as 백엔드 DB
    end

    EXT->>CH: vault 주소로 송금
    Note over EXT,CH: 온체인 사건은 이 송금과 confirmation 누적뿐 — 둘 다 남(송신자·체인)의 일이다
    CH-->>FB: Fireblocks 가 자기 vault 범위를 감지
    Note over FB,DB: 여기서부터는 전부 오프체인 — 감지·폴링은 매니저, 기록·가용 처리는 백엔드 DB 의 일이고,<br/>입금 처리에서 우리는 체인에 아무 거래도 내지 않는다
    Note over BM,FB: 주기 폴링은 매니저 내부 구현 — outbound · 지난 폴 이후 갱신된 tx 만 받는다 (4장)
    BM->>MDB: 커서 읽기 — 마지막 처리 lastUpdated
    BM->>FB: GET /v1/transactions · orderBy=lastUpdated · after=커서 · limit=200
    FB-->>BM: status CONFIRMING (체인 등장·미확정)
    BM->>MDB: 목적지 vault → accountId 귀속 (주소 매핑) · tx 체크포인트
    BM->>MQ: publish — 입금 이벤트 status=CONFIRMING · 파티션 키=accountId
    MQ-->>QC: consume — 입금 이벤트 status=CONFIRMING
    QC->>DB: tx 기록 status=CONFIRMING · 금액은 대기(pending) 칸 — 가용엔 아직 안 더한다
    QC->>MQ: 오프셋 커밋 — 원장 반영 성공 후에만
    Note over CH,FB: confirmation 이 쌓인다 — numOfConfirmations 가 DCCP 임계에 닿을 때까지
    BM->>FB: GET /v1/transactions · 같은 조회, 다음 주기
    FB-->>BM: status COMPLETED (DCCP 임계 도달 = finality)
    BM->>MQ: publish — 입금 이벤트 status=COMPLETED
    MQ-->>QC: consume — 입금 이벤트 status=COMPLETED
    QC->>DB: tx 기록 status=COMPLETED · 금액은 대기 → 가용(available) 이동
    QC->>MQ: 오프셋 커밋 — 원장 반영 성공 후에만
    BM->>MDB: 커서 저장 — 처리 성공분까지, 다음 폴 시작점
```

오프셋 커밋을 **원장 반영에 성공한 뒤에만** 하므로, 처리에 실패하면 커밋이 안 되고 큐가 그 이벤트를 다시 보낸다(그래서 최소 한 번은 반영된다 — at-least-once). 같은 이벤트를 두 번 받아도 원장이 **이벤트 ID 에 unique 제약**을 걸어 두 번째는 무시하니 잔액이 이중으로 더해지지 않는다. 같은 계정의 이벤트는 파티션 키가 accountId 라 감지 → 확정 순서도 뒤집히지 않는다.

## 입금에서 보는 상태·하위 상태

Fireblocks 트랜잭션 상태는 전부 17가지지만 대부분은 출금 쪽 단계(제출·승인·서명·전파)이고 — 그쪽은 6페이지의 "상태 한 장" 표가 맡습니다 — **입금이 실제로 지나는 것은 아래 넷**입니다.

| status | 뜻 |
|---|---|
| `CONFIRMING` | 체인 등장, confirmation 누적 중 — 대기(pending)로 잡힌다 |
| `COMPLETED` | DCCP 임계 도달 = finality (final). 임계 확인 후 가용(available)에 더해진다. zero-confirmation 설정이면 여러 번 관찰될 수 있음(4장 함정) |
| `REJECTED` | AML 거절 또는 동결 — Admin 이 unfreeze 할 때까지 자산 잠금, 잔액 반영 보류 |
| `FAILED` | 영구 실패 (final) — 반영하지 않는다 |

각 status 는 `subStatus` 로 사유가 세분됩니다 — 매니저 내부 폴링이 분기하는 `status`·`numOfConfirmations` 에 사유를 더해주는 필드이고 큐 이벤트에 함께 실려 옵니다. 입금 관련은 아래가 전부이고, 특히 **REJECTED 의 동결 3종은 Admin 의 unfreeze 운영**이 걸립니다.

| 상위 | subStatus | 뜻 |
|---|---|---|
| CONFIRMING | `PENDING_BLOCKCHAIN_CONFIRMATIONS` | confirmation 대기 중 |
| COMPLETED | `CONFIRMED` | 필요한 confirmation 도달 |
| REJECTED | `AUTO_FREEZE` | 스크리닝 정책이 자동 동결 — Admin unfreeze 까지 잠금 |
| REJECTED | `FROZEN_MANUALLY` | Console/API 사용자가 수동 동결 — 동일 |
| REJECTED | `REJECTED_AML_SCREENING` | AML 고위험 판정 — 동일 |
| FAILED | `DROPPED_BY_BLOCKCHAIN` | 블록에 실렸다가 떨어짐(깊은 reorg 등) — 반영해 둔 잔액을 되돌린다(아래 절) |

전체 subStatus(실패 사유 수십 종)는 출금·운영 영역이라 벤더 레퍼런스의 몫이고 여기엔 입금에서 관찰되는 것만 실었다.

## 예외 — reorg 로 믿었던 입금이 뒤집히면

여기까지가 확정으로 가는 정상 경로였고 예외가 하나 남습니다. 이더리움·Base 는 체인 끝이 드물게 교체(reorg)될 수 있습니다.

- **1차 방어는 4장의 DCCP 임계 그 자체입니다** — 임계만큼 confirmation 이 쌓인 뒤에만 가용 처리하므로, 그보다 얕은 reorg 는 잔액에 닿지 못합니다.
- 임계보다 깊은 reorg(극히 드묾)로 거래가 블록에서 떨어지면 Fireblocks 는 즉시 **FAILED(또는 취소·만료) + subStatus `DROPPED_BY_BLOCKCHAIN`** 으로 표시합니다 — BROADCASTING 으로 되돌아가지 않습니다(Fireblocks Support 확인).
- 매니저가 이 신호를 큐에 publish 하면 백엔드는 **반영해 둔 잔액만 되돌리고 입금 기록은 보존**합니다.
- 잠깐 빠졌다 재편입되는 얕은 reorg 는 CONFIRMING 에 머물며 confirmation 수만 다시 셉니다.
- 최종 안전망은 여전히 **주기 대사**입니다.

## 입금 다음 — 고객 vault 에서 옴니버스로 (sweep)

고객별 vault 는 **입금 식별용**입니다 — EVM 은 vault·자산당 주소가 하나뿐이라(2장), 고객마다 vault 를 만들어야 "누가 보냈나"가 주소로 갈립니다. 하지만 **자산을 거기 두지 않습니다** — 가용 처리가 끝난 자산은 주기적으로 **옴니버스 vault 로 모읍니다(sweep)**.

고객별 잔액은 백엔드 DB 원장이 관리하므로, 온체인 보관은 집약할수록 키·운영 관리가 단순해집니다. 10장의 "온체인 지갑은 둘뿐" 모델이 이 sweep 을 전제로 합니다.

| vault | 역할 |
|---|---|
| **고객별 vault** (intermediate) | 1·2장에서 만든 고객당 vault — 입금 식별·수신 전용, 보관처 아님. |
| **옴니버스 vault** (omnibus deposits) | sweep 으로 모인 중앙 보관처 — 10장의 "고객 자산 지갑"이 이것. |
| **출금 풀** (withdrawal pool) | 출금 전용 vault — EVM 은 vault 당 nonce 가 직렬이라 **복수 vault round-robin** 으로 병렬화(6장 출금이 여기서 나간다). |

세 역할 분류는 Fireblocks 공식 omnibus 구조 그대로다(intermediate / omnibus deposits / withdrawal pool).

```mermaid
sequenceDiagram
    autonumber
    participant SW as sweep 작업<br/>Service 백엔드 · 주기 실행
    box rgb(220,252,231) 블록체인 매니저 — 별도 서비스
    participant BM as 블록체인 매니저 API
    end
    participant FB as Fireblocks (SaaS)
    participant RL as 지정 relay<br/>(Fireblocks Relay)
    box rgb(254,249,195) 메시지 큐
    participant MQ as internal-events
    end

    Note over SW: 트리거 — 잔액 임계 · 고정 스케줄 · 네트워크 fee 유리할 때<br/>대상 선정(가용 처리 끝난 고객 vault 잔액)은 백엔드 몫 — 자기 DB 조회
    SW->>BM: API — submitTransaction · 고객 vault → 옴니버스 (vault 별 1건 · gasless)
    BM->>FB: 거래 제출 — Fireblocks 연동은 매니저 내부 구현
    Note over FB: 그 vault 의 첫 gasless 거래면 위임 설정(upgrade)이 함께 처리된다 — 주소·키 불변
    FB->>RL: gas 부담 위임 — 거래 생성·서명 시점 (relay 거절이면 거래 실패)
    Note over FB,RL: gas 는 relay 가 지불 · 토큰은 고객 vault 에서 이동 — 월말 인보이스 정산
    FB-->>BM: 제출 접수
    BM-->>SW: 접수 응답 (txRef)
    Note over BM,RL: 여기까지 오프체인 — 온체인은 relay 가 전파한 뒤부터
    BM->>MQ: 매니저 내부 폴링이 내부 이동 완료를 publish → internal-events (4장)
    MQ-->>SW: consume — 완료 확인 후 sweep 기록 마감 (고객 원장 불변 · 온체인 위치만 이동)
```

이 한 건에서 누가 무엇을 하는지 역할로 나누면:

| 역할 | 하는 일 |
|---|---|
| **고객 (최종 사용자)** | **등장하지 않는다** — sweep 은 고객 요청 없이 도는 내부 운영이고, 고객 잔액은 DB 원장에 그대로다. 고객은 이 vault 의 키도, 존재도 모른다. |
| **Service 백엔드** | 대상 조회 → 매니저 API 로 제출 → 기록. 주기 실행이라 사람 개입이 없다. |
| **블록체인 매니저** | submitTransaction 을 받아 Fireblocks 에 제출하고, 이후 상태를 내부 폴링으로 추적해 큐에 publish 한다. |
| **고객별 vault (EOA)** | 토큰이 빠져나가는 발신 계정. **키는 수탁자 몫**(MPC — 벤더 share + co-signer share)이다. 첫 gasless 거래면 이 vault 의 위임 설정(upgrade)이 함께 처리된다. |
| **지정 relay** | 바깥 거래의 발신자 — 제출하고 gas 를 낸다(월말 인보이스). 내용은 위조하지 못한다 — vault 서명의 검증은 위임된 지갑 코드가 온체인에서 한다. |

서명이 두 겹이다 — vault 몫의 승인 서명(안쪽)과 relay 의 바깥 거래 서명. 이 구조는 출금(6장)과 같고 메커니즘 상세는 가스 대납 문서 9장.

| 결정 | 내용 |
|---|---|
| **트리거** | 잔액 임계 · 고정 스케줄 · 네트워크 fee 가 유리할 때 — sweep 은 시간에 급하지 않아 **낮은 fee 로 보낼 수 있다**. |
| **gas** | **Universal Gasless 로 대납** — 고객 vault 에 ETH 를 배포하지 않는다. 상세는 가스 대납 문서. |
| **서명 자동화** | API Co-Signer — 주기 실행이라 사람 개입 없이 서명까지 자동. |
| **고객 잔액** | **불변** — 고객별 잔액은 백엔드 DB 원장 몫이고, sweep 은 온체인 보관 위치만 옮긴다(회계 이벤트 아님). |
| **관찰·실패** | sweep tx 는 매니저 내부 폴링에 **내부 이동**으로 잡혀 같은 경로로 상태 추적·막힘 점검·boost 를 타고, 변경은 큐에 publish 된다(4장). |

감지·판정 기준(폴링 루프·DCCP·막힘 점검)은 4. 감지와 확정, 잔액의 세 칸(available·pending·locked)과의 맞물림은 8. 잔액과 내역 조회, 출금 쪽 상태 전이는 6. 출금 에서 이어집니다.
