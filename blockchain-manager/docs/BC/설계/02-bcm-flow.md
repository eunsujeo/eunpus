---
title: 블록체인 매니저 — 흐름
status: To Do
---

블록체인 매니저의 모든 흐름 — 계정·주소, 감지(웹훅), 입금, sweep, 출금, boost, 수수료·잔액·대사. 상태 enum 포함.
요청·응답의 필드 상세는 [블록체인 매니저 API](?cat=블록체인매니저&sub=API).

## 계정 생성 · 입금 주소 발급 · 조회

| 오퍼레이션 | API | 하는 일 | 멱등 |
|---|---|---|---|
| `createAccount` | `POST /accounts` | vault 를 만들고 ref↔accountId 매핑을 반환한다. ref = DAW-CORE 계정 ID (고객 `ACT-` · 운영 `SYS-`) | 같은 ref → 같은 accountId. 매니저 DB `ref` UNIQUE 가 최종 방어 — 경합해도 이긴 값을 반환 |
| `createDepositAddress` | `POST /accounts/{accountId}/assets/{asset}/address` | 자산 지갑을 활성화하고 입금 주소를 발급한다. EVM 은 자산당 주소 하나 | 같은 (accountId, asset) → 같은 주소 |
| `depositAddressOf` | `GET /accounts/{accountId}/assets/{asset}/address` | 발급된 주소를 매니저 DB 에서 읽는다 — 벤더 왕복 없음 | 주소 있음 → 주소 · 미발급 → `data: null` · 계정 없음 → `404 ACCOUNT_NOT_FOUND` |

경로는 base(`/blockchain/manage-api`)를 뗀 표기 — 전체 경로·필드는 [블록체인 매니저 API](?cat=블록체인매니저&sub=API).

```mermaid
sequenceDiagram
    autonumber
    participant BE as DAW-CORE
    box rgb(220,252,231) 블록체인 매니저
    participant BM as 매니저 API
    participant MDB as 매니저 DB
    end
    participant FB as Fireblocks

    BE->>BM: POST /accounts — ref
    BM->>MDB: ref 조회 — 있으면 기존 accountId 반환
    BM->>FB: createVaultAccount
    BM->>MDB: 매핑 저장 — ref UNIQUE
    BM-->>BE: accountId
    BE->>BM: POST /accounts/{accountId}/assets/{asset}/address
    BM->>FB: 자산 지갑 활성화 · 주소 생성
    BM->>MDB: (accountId, asset) ↔ 주소 저장
    BM-->>BE: 입금 주소
```

## 감지 — 웹훅 수신

온체인 상태 변경은 Fireblocks 웹훅으로 받는다. 매니저가 계열을 가려 세 토픽으로 publish 하고, 백엔드는 토픽별 컨슈머로 consume 한다. 감지용 상시 폴링은 없다 — 놓친 웹훅은 tx 대사(10분 주기 목록 대조)가 복구한다.

```mermaid
sequenceDiagram
    autonumber
    participant FB as Fireblocks
    box rgb(220,252,231) 블록체인 매니저
    participant WH as 웹훅 수신<br/>PUBLIC HTTPS
    participant WK as 판단 워커<br/>병렬 · tx 단위 잠금
    participant MDB as 매니저 DB<br/>주소 매핑 · 체크포인트
    end
    box rgb(254,249,195) 메시지 큐
    participant MQ as deposit · withdrawal · internal
    end

    FB->>WH: POST 알림 — tx 상태 변경 · tx 객체 동봉
    WH->>WH: 서명 검증 — Fireblocks 공개키 · 실패면 거절
    WH->>MDB: 수신 적재 — 알림 원본 · 키 = 웹훅 알림 id UNIQUE (중복이면 무시하고 200)
    WH-->>FB: 200 — 2xx 가 아니면 벤더가 재시도
    Note over WH,WK: 수신(검증 → 적재 → 200)과 판단·publish 는 분리 — 폭주는 워커 적체(지연)로만 나타난다

    loop 판단 — 워커가 미처리 알림을 집어 간다
        WK->>MDB: 미처리 알림 집기 · 방향 판단 + accountId 귀속 · 마지막 발행 상태 조회
        alt 발신자가 우리 vault · 목적지 외부
            WK-->>MQ: publish → withdrawal-events (WITHDRAWAL)
        else 발신자가 우리 vault · 목적지도 우리 vault
            WK-->>MQ: delta 면 publish → internal-events (INTERNAL) · sweep 이면 발행 생략
        else 발신자가 외부 · 매핑된 입금 주소
            WK-->>MQ: publish → deposit-events (DEPOSIT)
        else 발신자가 외부 · 매핑에 없는 주소
            WK->>WK: 귀속 불명 — 큐에 싣지 않는다 · 별도 알림 채널로 통지
        end
        WK->>MDB: 발행 상태 체크포인트 기록 + 처리 완료 마킹 — publish 성공 후에만
    end
```

수신·발행 규칙:

| 규칙 | 내용 |
|---|---|
| 서명 검증 | 모든 알림은 서명을 검증하고 통과한 것만 받는다 — JWKS 방식(`Fireblocks-Webhook-Signature` 헤더 · 공개키 자동 조회·로테이션). 발신 IP allowlist 를 겹친다 |
| 수신 확인 | 2xx 를 돌려줘야 전달 완료 — 아니면 벤더가 지수 백오프로 재시도한다(총 10회 시도 후 failed 마킹). 오류율이 높은 수신 endpoint 는 벤더가 자동 비활성화하므로 즉시 2xx + 비동기 처리 분리가 필수 |
| 유실 복구 | 재시도로도 못 받은 알림은 재전송 API(`resend_failed` — v2 는 30일)로 다시 받는다. 수신기 재기동 후 1회 호출한다 |
| 상태 전이만 publish | 체크포인트의 마지막 발행 상태와 비교해 앞으로 가는 전이만 발행한다. 같으면 생략, 과거로 돌아가면 무시 |
| 체크포인트는 publish 성공 후 | 기록 전에 중단되면 재발행된다 — 중복은 위 중복 반영 방지가 거른다 |
| 중복 반영 방지 | 같은 이벤트가 두 번 와도 한 번만 반영한다 — `txId`(또는 `externalTxId`) unique 로 가리고, 상태 전이만 반영한다 |
| 오프셋 커밋 | 원장 반영 성공 후에만 커밋한다. 실패하면 재소비된다 |
| 최종 안전망 | **tx 대사**(10분 주기 — 벤더 거래 목록과 기록을 대조)가 놓친 웹훅을 자동 복구하고 운영 알림을 올린다. 회계 숫자는 별도의 주기·일마감 대사 |

> 웹훅이 **한꺼번에 몰릴 때**(수신 3단계 고정·병렬 워커)와 **놓쳤을 때**의 정지·장애 시나리오는 참고 문서 [웹훅 감지 상세](99-detection-detail.md)에 있다.

## 상태 enum

### TxStatus — 공통 상태 다섯

| TxStatus | 뜻 | 블록체인 상태 (Pending → Confirmed → Finalized) | Fireblocks 원어 | 함께 실리는 subStatus (대표) | networkStatus |
|---|---|---|---|---|---|
| `SUBMITTED` | 제출됨 — 서명·전파 준비 중, 체인 미등장. 출금에서만 관찰 | 아직 없음 → 전파되면 Pending | PENDING_SIGNATURE · QUEUED · BROADCASTING | — | 서명 단계엔 없음 → BROADCASTING |
| `CONFIRMING` | 체인에 등장, 컨펌 누적 중 — 미확정 | Confirmed — 블록에 포함, finality 전 | CONFIRMING | PENDING_BLOCKCHAIN_CONFIRMATIONS | CONFIRMING |
| `COMPLETED` | 확정 — {{DCCP::Deposit Control & Confirmation Policy — 입금을 확정으로 볼 컨펌 수를 정하는 Fireblocks 정책. 상세는 아래 확정 기준 절}} 임계 컨펌 도달 | Finalized | COMPLETED | CONFIRMED | CONFIRMED |
| `REJECTED` | 거부·차단 — 임시. 사람 개입 여지 | 출금 차단은 체인에 없음 · 입금 동결은 Finalized | REJECTED · BLOCKED | AUTO_FREEZE · FROZEN_MANUALLY · REJECTED_AML_SCREENING | 출금은 없음 · 입금 동결은 CONFIRMED |
| `FAILED` | 영구 실패 — 사유 동반 | Pending 에서 증발 · revert 는 Confirmed 이후 | FAILED | DROPPED_BY_BLOCKCHAIN · 그 외 | FAILED · DROPPED |

판단은 TxStatus 다섯으로 한다. `REJECTED`(임시) ≠ `FAILED`(영구). 위 표의 subStatus·networkStatus 열은 **매니저가 벤더에게서 받아 번역에 쓰는 내부 값** — 어떤 TxStatus·이벤트를 낼지 매니저가 이 값으로 가른다. **이벤트에는 TxStatus 만 싣고 DAW-CORE 는 그것으로만 판단한다.**

**이 다섯은 블록체인 매니저 ↔ DAW-CORE 의 계약 어휘다** — 벤더 원어는 매니저 안에서 번역되고, 벤더가 바뀌어도 이 다섯은 유지된다. DAW-CORE `tx_stcd` 의 `PENDING`(미확정 전체)·`CONFIRMED`(확정)와는 별개 어휘다 — 섞어 쓰지 않는다.

### EventType — 이벤트 분류 셋

| EventType | 뜻 | 토픽 |
|---|---|---|
| `DEPOSIT` | 고객 입금 — 매핑된 주소로 수신 | deposit-events |
| `WITHDRAWAL` | 외부 출금 | withdrawal-events |
| `INTERNAL` | delta 정산 | internal-events |

## 확정 기준 — DCCP

CONFIRMING 을 COMPLETED 로 바꾸는 임계 컨펌 수는 {{DCCP::Deposit Control & Confirmation Policy — 벤더 공식 약어. support 문서가 이 표기를 그대로 쓴다}}(확정 정책)가 정한다.

- 기본 임계 — 대부분의 체인 1 (이더리움·Base 포함) · ETC 372 · 컨트랙트 호출 3 권장. 한도: EVM 최소 1 · 이더리움 최대 100 · 신규 EVM L2 최대 30.
- 커스텀 임계는 정책 템플릿을 Fireblocks Support 에 제출해 검토·승인 후 반영된다. 요청 값은 Admin 이 정한다.
- **확정 판단은 status 만 보지 않는다** — `numOfConfirmations` 를 임계와 직접 비교한다. zero-confirmation 설정에서는 COMPLETED 가 블록 등장 시점에 먼저 뜰 수 있다.

## 입금

```mermaid
sequenceDiagram
    autonumber
    participant EXT as 외부 송신자
    participant CH as 온체인
    participant FB as Fireblocks
    box rgb(220,252,231) 블록체인 매니저
    participant BM as 웹훅 수신
    end
    box rgb(254,249,195) 메시지 큐
    participant MQ as deposit-events
    end
    box rgb(224,242,254) DAW-CORE
    participant QC as 입금 컨슈머
    participant DB as DAW-CORE DB
    end

    EXT->>CH: vault 주소로 송금
    CH-->>FB: Fireblocks 가 자기 vault 범위를 감지
    FB->>BM: 웹훅 — CONFIRMING
    BM->>BM: 주소 매핑으로 accountId 귀속 · 체크포인트
    BM-->>MQ: publish — CONFIRMING · 파티션 키 accountId
    MQ-->>QC: consume
    QC->>DB: 기록 CONFIRMING · 금액은 대기(pending) — 가용엔 안 더한다
    QC->>MQ: 오프셋 커밋
    Note over CH,FB: 컨펌 누적 — DCCP 임계 도달까지
    FB->>BM: 웹훅 — COMPLETED
    BM-->>MQ: publish — COMPLETED
    MQ-->>QC: consume
    QC->>DB: 기록 COMPLETED · 대기 → 가용(available) 이동
    QC->>MQ: 오프셋 커밋
```

- 입금이 지나는 상태는 넷 — CONFIRMING · COMPLETED · REJECTED · FAILED. SUBMITTED 는 안 본다.
- **동결(REJECTED)** — subStatus `AUTO_FREEZE` · `FROZEN_MANUALLY` · `REJECTED_AML_SCREENING`. 돈은 체인에 도착·확정된 상태로 벤더 장부만 잠긴다. 해제(unfreeze)는 Admin 이 벤더 콘솔에서 하고, 상태 변경은 평소처럼 웹훅으로 잡힌다.
- **reorg 무효화(FAILED + `DROPPED_BY_BLOCKCHAIN`)** — 반영해 둔 잔액만 되돌리고 입금 기록은 보존한다. CONFIRMING 은 BROADCASTING 으로 되돌아가지 않는다.
- **귀속 불명** — 매핑에 없는 주소의 입금은 큐에 싣지 않고 별도 알림 채널로 통지한다. 수동 매핑 해소를 기다린다.

## sweep — 매니저 내부

입금이 확정되면 매니저가 내부에서 고객 vault 의 자산을 옴니버스 vault 로 옮긴다 — 확정은 sweep 대상 마킹까지, 제출은 주기 배치가 대상을 모아서 한다(주기·최소 금액은 운영 설정값). 백엔드는 sweep 을 호출하지 않고 큐 이벤트도 받지 않는다. 고객 원장은 불변이다.

| vault | 역할 |
|---|---|
| 고객별 vault (intermediate) | 입금 식별·수신 전용 — 보관처 아님 |
| 옴니버스 vault (omnibus deposits) | sweep 으로 모이는 중앙 보관처 |
| 출금 풀 (withdrawal pool) | 출금 전용 — 복수 vault round-robin |

```mermaid
sequenceDiagram
    autonumber
    box rgb(220,252,231) 블록체인 매니저
    participant BM as 매니저 sweep<br/>확정 마킹 + 주기 배치
    participant MDB as 매니저 DB
    end
    participant FB as Fireblocks
    participant RL as 지정 relay

    Note over BM: 입금 확정(COMPLETED)을 잡으면 그 고객 vault 를 sweep 대상으로 마킹
    BM->>MDB: sweep 대상 마킹
    Note over BM,MDB: 이하 주기 배치 — 대상을 모아 잔액 조회 후 제출 (주기·최소 금액은 운영 설정값)
    BM->>FB: vault 잔액 조회 — sweep 금액 = 조회 시점 전액
    BM->>FB: 거래 제출 — 고객 vault → 옴니버스 · gasless
    FB->>RL: gas 부담 위임 — relay 가 지불 · 월말 인보이스 정산
    FB-->>BM: 제출 접수 (txId)
    FB->>BM: 웹훅 — sweep 거래 상태 변경
    BM->>MDB: 체크포인트 갱신 — internal-events 에 싣지 않는다
```

sweep 거래도 막힘 점검·boost 를 동일하게 탄다. 정합은 대사가 확인한다.

## 출금

승인 완료된 출금 지시를 DAW-CORE가 `POST /transactions` 로 제출한다. `externalTxId` 가 멱등 키 — 같은 키 재제출은 중복 전송되지 않는다.

```mermaid
sequenceDiagram
    autonumber
    box rgb(224,242,254) DAW-CORE
    participant BE as 출금 유스케이스
    participant QC as 큐 컨슈머
    end
    box rgb(254,249,195) 메시지 큐
    participant MQ as withdrawal-events
    end
    box rgb(220,252,231) 블록체인 매니저
    participant BM as 매니저 API · 웹훅 수신
    end
    box rgb(254,226,226) 보안 존 SGX/TEE
    participant COS as API Co-signer
    end
    participant CB as Callback Handler
    participant FB as Fireblocks
    participant RL as 지정 relay
    participant CH as 온체인

    BE->>BM: POST /transactions — externalTxId · from=출금 풀 vault · gasless
    BM->>FB: createTransaction
    FB-->>BM: 벤더 txId
    BM-->>BE: 접수 — txId
    FB->>COS: 서명 요청 — 목적지·금액 원문 동반
    COS->>CB: 승인 질의 — 서명 직전 검증 (아래 표)
    CB-->>COS: approve / deny
    COS-->>FB: MPC 서명 share — deny 면 서명 거부
    FB->>RL: gas 부담 위임 — relay 거절이면 거래 실패
    RL->>CH: 전파 — relay 가 발신자로 제출하고 gas 를 낸다
    CH-->>FB: 블록 누적 → 확정
    FB->>BM: 웹훅 — 상태 변경 push
    BM-->>MQ: publish — SUBMITTED → CONFIRMING → COMPLETED
    MQ-->>QC: consume
    QC->>QC: externalTxId 로 출금 건 대응 · 상태 갱신 · 오프셋 커밋
```

서명은 두 겹이다:

| 서명 | 누가 | 강제하는 것 |
|---|---|---|
| 안쪽 — vault 승인 서명 | MPC — 벤더 share + Co-signer share. Callback Handler 검증 통과 건에만 share 를 보탠다 | 목적지·금액이 승인 기록과 다르면 서명이 만들어지지 않는다 |
| 바깥 — relay 거래 서명 | relay 가 자기 계정으로 서명·제출하고 gas 를 낸다 | relay 는 낼지 말지만 정한다 — 내용 위조 불가 |

### 서명 직전 검증 — Callback Handler 가 보는 것

네 항목 모두 DAW-CORE DB 읽기 전용 복제본으로 판단한다. 하나라도 어긋나면 deny — 서명이 만들어지지 않는다.

| 항목 | 확인하는 것 |
|---|---|
| 원문 일치 | 서명 요청의 chain·자산·금액·발신 vault·목적지가 접수·승인한 출금 지시와 같은가 |
| 요청 유효성 | 대응하는 출금 요청이 존재하고, 승인 완료 상태(트래블룰 확인 통과 포함)이며, 만료되지 않았는가 |
| 소비 상태 | 이 externalTxId 로 이미 서명이 만들어지지 않았는가 — 승인된 지시 1건에 서명 1번 |
| 운영 차단 상태 | 동결·비상 중지·체인 비활성에 걸리지 않는가 |

관문 밖에서 강제되는 것 — 고정 목적지 화이트리스트·한도는 벤더 정책(TAP), 고객 출금 주소는 접수 단계의 주소록 검사, 재제출 중복은 벤더의 externalTxId 차단.

## 막힘 점검 · 자동 boost

막힌 tx 는 변화가 없어 웹훅 알림이 오지 않는다 — 매니저의 주기 작업(예: 5분)이 자기 DB 에서 오래 CONFIRMING 인 건을 조회한다(벤더 호출 없음).

```mermaid
sequenceDiagram
    autonumber
    participant SW as 막힘 점검<br/>매니저 내부 주기 작업
    participant MDB as 매니저 DB
    participant AL as 별도 경보 채널

    SW->>MDB: 오래된 대기 조회 — CONFIRMING 이고 체인별 임계 초과
    MDB-->>SW: 대상 목록 — 이미 경보한 tx 는 건너뜀
    alt 입금 건
        SW-->>AL: 막힘 경보 — 고객 안내 · 대사 대기
    else 출금 · sweep 건
        SW->>SW: 자동 boost — 같은 순번 · fee 올린 재전송(RBF) · gas 는 relay 부담
        SW-->>AL: 경보는 boost 로 못 살릴 때만
    end
```

- boost 는 Admin 정책(대기 임계 · 최대 시도) 안에서 매니저가 자동 실행한다. 대체 거래(새 txId)는 원 txId 로 접어 발행한다 — 백엔드는 boost 를 모른다. 이력은 매니저 DB 에 남는다.
- relay 가 gas 를 못 대거나 최대 시도까지 안 풀리면 경보한다 — 사람이 relay 복구·수동 처리. cancel 은 이때의 최후수단이다.

## 수수료 관측 · 잔액 · 이력 · 대사

- **수수료** — 매니저 내부 주기 작업이 견적을 시계열로 기록한다. 제출 건에는 제출 시각의 시세를 대응시킨다. 실비 검증은 온체인 실측(gasUsed × 체결 단가)으로 하고, 월말 인보이스와 맞춘다.
- **잔액** — `balanceOf` 는 vault 잔액(가용·대기·잠김)을 준다. 대사에 쓴다 — 고객별 잔액은 DAW-CORE 원장이 담당한다.
- **이력** — `transactionsOf` 는 거래 시각(createdAt) 기준 목록(커서 페이지네이션), `transactionOf` 는 단건 조회.
- **대사** — 회계가 걸리는 숫자는 주기적으로 벤더 값과 직접 대조한다. 큐 경로와 무관하게 도는 독립 안전장치다.

## 원본 보관 — 일 배치

finalize 된 트랜잭션 원본을 일 배치로 매니저 DB(`bcm_raw_tx_l`)에 보관한다. 원본은 수신 버퍼(`bcm_whk_l`)에서 그 tx 의 마지막 COMPLETED 알림 payload 를 옮긴다 — 벤더 재조회 없음. 기존 웹훅 수신 → 번역 → 이벤트 경로는 건드리지 않는다.

## 매니저가 내보내는 신호

| 신호 | 내용 |
|---|---|
| heartbeat | 주기 작업(막힘 점검 등)별 실행 완료 시각 — 매니저 DB 에 기록 |
| 웹훅 수신 생존 | 마지막 수신 시각 · 수신 오류율 · 서명 검증 실패율 — 메트릭 |
| 판단 적체 | 수신 적재 대비 publish 지연 깊이 — 메트릭 |
| 대사 누락 건수 | tx 대사가 잡은 놓친 웹훅 수 — 0 에서 벗어나면 웹훅 경로 이상 신호 · 메트릭 + 운영 알림 |
| 벤더 호출 오류율 | 429 포함 — 메트릭 |

감시·경보 판단은 매니저 밖 모니터링이 한다.

## 미확정

- **rate limit 실제 한도 — 확인됨 (2026-07 회신).** 목록 `GET /v1/transactions` 1,000/분 · 단건 `GET /v1/transactions/{txId}` 1,500/분 — 독립 카운터·워크스페이스 공유·결정론적 분당 카운터(이상 트래픽 감지 없음, 최고 tier). tx 대사는 주기당 목록 조회 수 회라 여유가 크다. 상세·폴링 설계는 [감지 폴링 대체 설계](../../블록체인매니저/설계/99-polling-detection.md).
- **relay 의 stuck 자동 처리 여부** — 자동이면 막힘 점검의 boost 트리거를 뺀다 — 벤더 확인 후 확정.
- **7702 authorization 서명의 관문 통과 여부** — 이 서명이 TAP·Callback 경로를 지나는지 — 벤더 확인 후 확정.
- **귀속 불명 입금의 해소 절차** — 매핑 갱신을 누가 트리거하고 해소 후 이벤트를 다시 흘리는지 — DAW-CORE와 정합 후 확정.
