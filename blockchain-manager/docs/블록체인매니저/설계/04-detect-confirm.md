---
title: 4. 감지와 확정 — 폴링 · 상태 판정 · DCCP
status: To Do
---

입·출금이 함께 쓰는 공통 기준 — 언제부터 믿는가, 그리고 어떻게 아는가.
블록체인 매니저(별도 서비스)가 내부 폴링으로 워크스페이스의 입금·출금·내부 이체 변경을 판정해 세 토픽(deposit·withdrawal·internal)으로 publish 하고 확정 기준(DCCP)이 언제부터 잔액에 반영할지를 정한다.

```kotlin
fun onChainEvent(topic: Topic, handler: (ChainEvent) -> Unit)

data class ChainEvent(
  val type: EventType,               // DEPOSIT · UNMAPPED · WITHDRAWAL · INTERNAL — 매니저가 체인+매핑으로 가르는 tx 분류 (sweep/delta 는 백엔드가 externalTxId 로)
  val txRef: String,                 // 벤더 tx id
  val externalTxId: String? = null,  // 우리 요청 키 (출금·내부이체) — 완료 대응·멱등
  val accountId: AccountId,          // 파티션 키 (내부이체 = 출발 계정)
  val asset: Asset,
  val to: String,                    // 목적지 주소 — 고객 입금 판별
  val status: TxStatus,              // SUBMITTED · CONFIRMING · COMPLETED · FAILED
  val numOfConfirmations: Int,
  val subStatus: String? = null,     // 벤더 상세 사유(수십 종) — 예: CONFIRMED · PENDING_BLOCKCHAIN_CONFIRMATIONS · DROPPED_BY_BLOCKCHAIN · AUTO_FREEZE · FROZEN_MANUALLY · REJECTED_AML_SCREENING
  val networkStatus: String? = null, // 체인 레이어 상태(NetworkStatus) — BROADCASTING · CONFIRMING · CONFIRMED · FAILED · DROPPED
)
```

이벤트는 **세 토픽**으로 갈라 publish 합니다 — 매니저가 폴링에서 이벤트 계열을 판정해 해당 토픽에 넣고, 백엔드는 토픽마다 전용 컨슈머를 둡니다.

| 토픽 | 담는 이벤트 | 파티션 키 | 소비 |
|---|---|---|---|
| `deposit-events` | 고객 입금 감지·확정 (DEPOSIT · UNMAPPED) | 고객 accountId — 천만 계정으로 분산 | 입금 컨슈머 (5장) |
| `withdrawal-events` | 외부 출금 상태 변경 (WITHDRAWAL) | 출금 vault 레인 accountId | 출금 컨슈머 (6장) |
| `internal-events` | 내부 이체 완료 (INTERNAL — sweep·delta 는 백엔드가 externalTxId 로 구분) | 출발 계정 accountId | 정산 컨슈머 (5·10장) |

**막힘은 세 토픽 어디에도 싣지 않습니다.** 새 거래 종류가 아니라 오래 CONFIRMING 인 tx 의 상태라, 막힘 점검이 별도 경보 채널로 흘립니다(수단은 열어 둠 · 막힘 점검 절). boost 로 되살아나면 그 상태 변경은 데이터 토픽에 정상 실린다.

**토픽을 나눈 이유는 소비 쪽입니다.** 가르면 각 컨슈머가 자기 계열만 맡는다(입금 원장 반영 · 출금 상태 추적 · 정산 닫기). 세 토픽 다 파티션 키가 계정 단위라 같은 계정 이벤트는 순서가 보장된다.

이 페이지는 세 토픽을 채우는 **매니저 내부 폴링과 확정 기준**을 정의하고, 입금(5장)·출금(6장)·내부 이체 정산(10장)이 각 토픽을 소비한다. 등록은 토픽별 한 번, publish 는 매니저가 판정할 때마다.

**처리는 백엔드 몫이고, 계약은 이렇습니다.**

- **라우팅은 매니저가 (publish 시점).** 업무 의도는 모르고, **발신자가 우리 vault 인지**로 방향을 가른다(source·dest 를 매핑과 대조):
  - **우리 vault 발** — 목적지 외부면 `WITHDRAWAL`, 우리 vault 면 `INTERNAL`. sweep/delta 구분은 정산 컨슈머가 externalTxId 로.
  - **외부 발** — 매핑된 입금 주소면 `DEPOSIT`, 없으면 `UNMAPPED`(귀속 불명 · 보류).
- **멱등** — 같은 이벤트가 두 번 올 수 있다(겹쳐 받기·재시도). 이벤트 ID(tx id·externalTxId) unique 로 상태 전이만 반영한다.
- **커밋** — 처리 성공 후에만 오프셋 커밋(at-least-once). 실패하면 재소비된다.
- **컨슈머 그룹은 토픽마다 하나** — 인스턴스가 여러 대여도 분배는 큐가 한다.

## 내부 이체 — 파티션 키·완료 대응 (결정)

sweep·델타처럼 우리 계정 둘이 얽히는 내부 이체는 **출발 계정 accountId 를 파티션 키**로 쓴다 — 옴니버스로 몰리는 핫 파티션을 피한다.

이런 이체는 요청·실행·완료가 두 시스템에 걸쳐 대응돼야 한다:

- **요청** — 백엔드가 **externalTxId(우리 요청 키)** 를 실어 매니저에 보낸다. sweep 인지 delta 인지 같은 **업무 의도는 백엔드가 externalTxId 기록에 쥐고 있고, 매니저에는 알리지 않는다**.
- **실행** — 매니저는 자기 DB 상태를 **처리중(processing)** 으로 두고 내부 전송을 실행한다. 매니저가 아는 건 "이건 내부 이체(`INTERNAL`)"까지다.
- **완료** — 완료·상태 변경 이벤트가 **externalTxId 를 달고** `internal-events` 로 오고, 정산 컨슈머는 externalTxId 로 원래 요청을 찾아 sweep/delta 를 가른 뒤 **업무 기록을 닫는다**(예: 델타 배치 완료 → 델타원장 PENDING→완료, 10장).

상태가 두 곳에 있는 셈이다 — **매니저 DB = 트랜잭션 진행**(processing→완료), **백엔드 DB = 업무 원장**(PENDING→완료). 둘을 잇는 열쇠가 externalTxId 다.

## 폴링 상세 흐름 — 커서 하나로 입·출금을 다 나른다

폴링은 **블록체인 매니저 내부 구현**입니다. 매니저가 계열을 갈라 판정하고 **입금은 `deposit-events`(5장), 외부 출금은 `withdrawal-events`(6장), 내부 이체는 `internal-events`(5·10장)**로 publish 합니다.

상태 필터는 대사·표적 조회(8장)에서 씁니다.

```mermaid
sequenceDiagram
    autonumber
    participant SUB as 매니저 내부 폴링<br/>블록체인 매니저 · 주기 실행
    participant MDB as 블록체인 매니저 DB<br/>커서 · 주소 매핑 · 체크포인트
    participant FB as Fireblocks (SaaS)
    box rgb(254,249,195) 메시지 큐 — 세 토픽
    participant MQ as deposit · withdrawal · internal<br/>파티션 키 = 계정 단위
    end
    participant BE as Service 백엔드<br/>토픽별 컨슈머 그룹 · 원장

    Note over SUB,FB: 주기(예: 15~30초)마다 실행 · 전부 outbound(egress 허용분)
    SUB->>MDB: 커서 읽기 = 마지막 처리 lastUpdated (T · Unix ms)
    MDB-->>SUB: T

    loop 페이지네이션 — limit 200, 다음 페이지 남으면 반복
        SUB->>FB: GET /v1/transactions · orderBy=lastUpdated · after=T · limit=200
        FB-->>SUB: 갱신된 tx 목록<br/>각 tx: id · src·dest 주소 · status · numOfConfirmations · lastUpdated
    end

    loop 받은 tx 각각 — lastUpdated 오름차순
        SUB->>MDB: 방향 판정(발신자가 우리 vault 인지) + accountId 귀속 · tx 상태 체크포인트 기록
        alt 우리 vault 발 — 외부 출금 · 내부 이체 (txRef 도 매칭)
            SUB-->>MQ: publish — 외부 출금 → withdrawal-events(6장) · 내부 이체 → internal-events(5·10장)
        else 입금 · CONFIRMING
            SUB-->>MQ: publish → deposit-events — 입금 감지 → 대기(pending) · available 불변
        else 입금 · COMPLETED 이고 임계 도달
            SUB-->>MQ: publish → deposit-events — 입금 확정 → 가용(available) 이동
        else 입금 · 아직 임계 미달
            Note over SUB: publish 없음 — 대기(pending) 그대로 둔다 · 다음 폴에서 다시 본다
        else 입금 · 무효화 (FAILED · DROPPED_BY_BLOCKCHAIN)
            SUB-->>MQ: publish → deposit-events — 무효화 · 반영해 둔 잔액을 되돌린다 (입금 기록은 남긴다)
        end
        opt 입금인데 주소가 우리 매핑에 없음
            SUB-->>MQ: publish → deposit-events — 귀속 불명 · 어느 고객인지 모름 · 알림<br/>기록은 tx 에 실린 vaultId 앞으로 남긴다 (고객 잔액 반영 보류)
        end
    end

    SUB->>MDB: 커서 저장 — 이번에 처리한 마지막 lastUpdated 를<br/>다음 폴의 시작점으로 기록
    Note over SUB,MDB: 처리·publish 실패 시 커서를 저장하지 않는다 → 다음 폴이 같은 구간을 다시 받는다(멱등이라 중복 무해)

    MQ-->>BE: consume — 같은 계정은 같은 파티션이라 감지 → 확정 순서 보장
    BE->>BE: 원장 반영 — 이벤트 ID(tx id) 멱등 upsert
    BE->>MQ: 오프셋 커밋 — 원장 반영 성공 후에만 · 실패 시 커밋하지 않아 재소비(at-least-once)
```

| 빠뜨리면 사고 나는 지점 | 어떻게 |
|---|---|
| **커서** | 마지막으로 처리한 tx 의 `lastUpdated`(Unix ms)를 **블록체인 매니저 DB** 에 영속. 주기마다 `after=커서`로만 받아 재조회량을 놓친 만큼으로 한정. |
| **필터 없이 훑기** | 서버측 status 필터는 한 번에 한 상태만 걸린다 — 모든 상태 전이를 빠짐없이 받으려면 필터 없이 커서로 훑고, 받은 tx 를 매니저가 분류한다. |
| **빠짐 방지** | 커서는 **처리 성공 후에만 저장** + 경계를 **살짝 겹쳐 받기**(after 를 조금 이전으로). 겹침은 백엔드의 멱등 upsert 가 흡수. |
| **페이지네이션** | `limit`(기본 200)이 가득 차면 다음 페이지 계속 — 한 주기에 밀린 분을 다 소진. |
| **오프셋 커밋** | 백엔드 컨슈머 그룹은 **원장 반영 성공 후에만** 오프셋 커밋. 실패하면 커밋하지 않아 재소비된다(at-least-once) — 중복은 아래 멱등이 흡수. |
| **멱등** | 이벤트 ID = tx id(또는 externalTxId) unique. 같은 이벤트가 두 번 소비되어도 백엔드는 상태 전이만 반영, 잔액 이중 반영 없음. |
| **reorg** | 확정으로 봤던 입금이 무효화되면 다음 폴에서 잡아 무효화 이벤트를 publish — 백엔드는 **반영해 둔 잔액만 되돌리고** 입금 기록은 보존. 신호는 FAILED + subStatus `DROPPED_BY_BLOCKCHAIN` (reorg 는 5장). |
| **감지 지연** | 지연 = **폴링 주기**(큐 전달 자체는 즉시). 짧게 잡으면 실시간에 근접하고 API 호출이 는다 — 확정 요건과 rate limit 사이에서 정한다. |

## 막힘 점검 — 오래 CONFIRMING 인 건 골라내기

webhook 의 막힘 경보(stuck_confirming)를 대체합니다 — 감지 폴링이 모든 CONFIRMING 을 이미 블록체인 매니저 DB 에 체크포인트로 기록해 두므로, 같은 폴링의 느슨한 주기(예: 5분) 작업이 **자기 DB 에서 오래된 대기 건을 조회**하면 끝입니다(벤더 호출 없음).

골라낸 건은 **별도 경보 채널**로 보냅니다 — 원장·정산 컨슈머가 소비하는 데이터 토픽(입금·출금·내부)이 아니라, 사람·운영이 받는 신호 경로입니다. 어떤 수단으로 흘릴지(운영 알림·모니터링·별도 큐 등)는 열어 둡니다. 감지 루프 안에서 못 잡는 이유는 하나 — 막힌 tx 는 **변화가 없어서** lastUpdated 커서에 다시 나타나지 않기 때문입니다.

```mermaid
sequenceDiagram
    autonumber
    participant SW as 막힘 점검<br/>매니저 내부 폴링의 두 번째 작업 · 예: 5분
    participant MDB as 블록체인 매니저 DB<br/>tx 상태 체크포인트 · 경보 기록
    participant AL as 별도 경보 채널<br/>운영 알림 · 수단은 열어 둠
    participant OPS as 운영 · 고객 안내<br/>사람 · 대사

    SW->>MDB: 오래된 대기 조회 — status=CONFIRMING 이고 created_at 이 체인별 임계보다 이전
    MDB-->>SW: 임계 초과 건 목록
    alt 없음
        Note over SW: 끝 — 다음 주기
    else 있음 — 이미 경보한 tx 는 건너뜀 (중복 경보 방지)
        alt 입금 건
            SW-->>AL: 막힘 경보 — 수신자는 개입 수단 없음 · 고객 안내 + 대사 대기
        else 외부 출금 · 내부 이체 건
            SW->>SW: 정책 내 자동 boost — fee 인상 재전송(RBF) (6장)
            SW-->>AL: 경보는 boost 로 못 살릴 때만 (최대 시도까지 해도 안 풀림 · relay 가 gas 못 댐)
        end
        AL-->>OPS: 사람·운영이 받아 처리 (원장·정산 컨슈머 아님)
    end
    Note over SW,MDB: 벤더 호출 없음 — 막힌 tx 는 변화가 없어 감지 폴링의 커서에는 다시 안 나타난다<br/>boost 로 되살아난 tx 의 상태 변경은 정상대로 데이터 토픽에 실린다
```

| 결정 | 어떻게 |
|---|---|
| **배치** | 별도 프로세스 불필요 — 매니저 내부 폴링의 **두 번째 주기 작업**(감지보다 느슨하게, 예: 5분). |
| **조회** | **블록체인 매니저 DB 쿼리** — `status=CONFIRMING` 이고 기록 시각이 임계보다 이전인 행. 벤더의 `status` 필터 조회는 대사·운영용으로만 남긴다(8장). |
| **막힘 판정** | 체류 시간이 **체인별 임계** 초과. 임계는 평시 confirmation 소요를 감안해 정한다. |
| **입금이 막히면** | 수신자라 개입 수단이 없다 — **별도 경보 채널로 알림 + 고객 "확인 중" 안내**가 전부이고, 해소는 체인 혼잡 해소 또는 대사가 잡는다. |
| **출금이 막히면** | 매니저가 **정책 내 자동 boost**(수수료 인상 재전송) — gas 는 relay 부담. 자동 boost 로도 못 살리면(최대 시도까지 boost 해도 안 풀리거나, relay 가 gas 를 못 대거나 거절) **별도 경보 채널로 올려** 사람이 relay 복구·수동 처리한다(cancel 은 예외). 상세 6장. |
| **경보 채널** | 원장·정산 컨슈머가 소비하는 데이터 토픽과 분리한다 — 사람·운영이 받는 신호라서. 구체 수단(운영 알림·모니터링·별도 큐 등)은 운영 설계에서 정한다. |
| **같은 건 중복 경보 방지** | 경보한 tx id 를 기록해 두고 다음 주기엔 건너뛴다. 해소(COMPLETED/FAILED 전이)되면 닫는다. |

## 폴링 생존 감시 — 죽은 폴링은 자기 죽음을 못 알린다

남은 구멍 하나. 위의 어느 장치도 **매니저 내부 폴링 자체가 죽은 것**은 못 잡습니다 — 막힘 점검은 "tx 가 막힘"을 보지 "폴링이 멈춤"을 보지 않고, 매니저 안에서 올리는 경보는 폴링이 죽는 순간 같이 멈춥니다.

그래서 생존 감시는 **매니저 밖(모니터링 시스템)**이 두 신호를 봅니다.

| 신호 | 무엇을 말하나 | 판정 |
|---|---|---|
| **heartbeat** (매 주기 실행 완료 시각을 블록체인 매니저 DB 에 기록) | 폴링이 **살아서 주기를 돌고 있나** | now − heartbeat 가 폴 주기의 몇 배(예: 5분)를 넘으면 **폴링 정지 경보**. tx 가 없어도 매 주기 갱신되므로 오경보 없음. |
| **커서 랙** (now − 커서 lastUpdated) | 처리가 **밀리고 있나** | 임계 초과면 **밀림 경보**. 단 커서는 갱신된 tx 가 있어야 앞으로 가므로, 조용한 시간대엔 자연히 커진다 — **heartbeat 와 함께 봐야** 오경보를 거른다. |

복구는 자동이다:

- **매니저(폴링) 재시작 → 커서부터 따라잡는다** — 멈춘 동안의 변경분이 페이지네이션으로 전부 소진되고 멱등 upsert 라 겹쳐 받아도 안전하다(위 표).
- **백엔드 컨슈머가 멈춘 동안도 마찬가지** — 큐는 durable 해서 이벤트가 큐에 남고, 오프셋은 원장 반영 성공 후에만 커밋되므로 재기동하면 마지막 커밋 지점부터 이어서 소비한다.
- 즉 정지의 피해는 유실이 아니라 **지연**이고, 생존 감시의 몫은 그 지연을 빨리 아는 것이다.

## 감지 경로 — 폴링(주) · 웹훅(보조) · 대사(안전망)

세 수단을 겹쳐 둡니다 — 백엔드는 어느 경로로 잡혔든 같은 이벤트를 큐에서 consume 합니다. 공통 원칙은 **주소를 하나씩 조회하지 않는다**는 점입니다 — 아래는 모두 워크스페이스·시간 범위 기준이라, 주소가 천만 개여도 부하는 **놓친 트랜잭션 수에 비례할 뿐 주소 수와 무관**합니다.

| 수단 | 무엇을 |
|---|---|
| **폴링** (주 경로 · 매니저 내부) | 트랜잭션 목록을 **갱신 시각 커서로 변경분만** 당겨 온다 — 감지의 기본. 루프 상세는 맨 위 절. |
| **웹훅** (보조 · 환경 허용 시 · 매니저가 수신) | 인바운드가 열린 환경이면 push 로 지연을 줄인다. 놓친 알림은 `POST /v1/webhooks/{id}/notifications/resend_failed` 로 재전송(v2 는 일정 기간 내). 누락·지연이 있어도 폴링이 메우므로 **신뢰의 근거는 아니다**. |
| **대사** (최종 안전망) | 그래도 어긋나면 주기 대사가 벤더 값과 기록을 맞춰 닫는다(회계 걸리는 숫자만 · 8장). |

세 경로가 겹칠 때의 규칙:

- 여러 경로가 같은 입금을 중복 관찰하므로, 매니저의 publish 와 백엔드의 반영 모두 **이벤트 ID = tx id(또는 externalTxId) unique 기준 멱등**으로 한 번만 건다 — 없는 돈을 두 번 반영하는 것이 가장 비싼 사고다.
- `status=COMPLETED` 로 거를 땐 `numOfConfirmations` 가 확정 임계 이상인지 함께 본다(위 zero-confirmation 함정).
- 폴링만으로도 완결되며 감지 지연은 **폴링 주기**만큼이다.

## 확정 기준 — confirm 과 finality, 그리고 DCCP

> **이 문서가 붙잡는 구분 — confirm(체인 등장) vs finality(확정)**
>
> 트랜잭션 하나의 상태는 Fireblocks 안에서 **BROADCASTING → CONFIRMING → COMPLETED** 순으로 흐른다. 이 중 직접 잔액을 움직일 때 붙잡아야 할 두 지점이 **CONFIRMING** 과 **COMPLETED** 다.
>
> **CONFIRMING = confirm 상태.** 트랜잭션이 체인에 올라가 블록에 담겼고 그 위로 confirmation 이 쌓이는 중이다 — 하지만 **아직 확정 아님**. 이 단계의 자금은 고객에게 "확인 중"으로만 보여주고 available 잔액에는 넣지 않는다.
>
> **COMPLETED = finality 상태.** confirmation 이 **DCCP(확정 정책)가 정한 임계 수**에 도달했다는 뜻이고 이때부터 이 자금을 **확정(finality)**으로 보고 available 에 반영한다.
>
> 둘을 프로그램으로 가르는 방법은 두 가지다 — `status` 값(CONFIRMING 인지 COMPLETED 인지)으로 갈리거나, tx 객체의 `numOfConfirmations`(실제 누적 confirmation 수)를 finality 임계값과 비교한다. 이 판정은 매니저 내부에서 이뤄지고 백엔드는 판정이 끝난 이벤트(감지/확정)를 큐에서 consume 한다.

### DCCP — 무엇이 CONFIRMING 을 COMPLETED 로 바꾸는가

CONFIRMING 에서 COMPLETED 로 넘어가는 **임계 confirmation 수를 정하는 정책**이 **DCCP(Deposit Control and Confirmation Policy)** 입니다. "finality"는 체인이 자연히 주는 성질이 아니라 DCCP 가 정의하는 확정 기준입니다.

커스텀 DCCP 는 **Console 에서 직접 설정하는 게 아니라**, 정책 템플릿을 작성해 **Fireblocks Support 에 제출 → 검토·승인 후 반영**됩니다. 어떤 임계를 요청할지 정하는 책임은 **Admin(운영)**, 큐 이벤트를 consume 해 잔액에 반영하는 런타임은 **Service** 의 몫입니다.

> **DCCP 임계값 — 기본값과 커스텀**
>
> Fireblocks 의 DCCP 기본 임계 confirmation 수는 체인마다 다르다.
>
> - **대부분의 체인 = 1** — 블록 하나면 확정으로 본다.
> - **ETC(이더리움 클래식)** — 과거 reorg 리스크가 커 임계가 매우 높다.
> - **finality 속성을 가진 체인** — 체인별로 고정(rigid)된 값을 쓴다.
> - **컨트랙트 호출(contract call)** — 단순 전송보다 보수적으로.
>
> 이 값은 **커스텀 DCCP** 로 조정할 수 있는데, 직접 설정이 아니라 **템플릿 작성 → Fireblocks Support 제출 → 검토·승인 후 반영**이다. EVM 대상(이더리움·Base)에서 어떤 임계를 요청할지는 자산·리스크 정책에 따라 Admin 이 정하고, Service 는 그 결과로 매니저가 publish 한 확정 이벤트만 신뢰하면 된다.

> **함정 — 첫 COMPLETED 를 곧 finality 로 단정하지 말 것 (zero-confirmation)**
>
> Deposit Policy 를 **zero-confirmation** 으로 두면, COMPLETED 가 **블록에 등장하는 시점에 먼저** 뜰 수 있고 이후 폴마다 관찰값(등장 + 1차 confirm + 추가 confirm)이 계속 갱신될 수 있다. 이 설정에서는 "COMPLETED 를 처음 관찰했다"가 곧 "충분한 confirmation 이 쌓였다"를 뜻하지 않는다.
>
> 그래서 매니저의 확정 판정은 status 만 보지 말고 **`numOfConfirmations` 를 finality 임계값과 직접 비교**하는 편이 안전하다. 어떤 임계를 finality 로 볼지는 위 DCCP 와 한 몸이다.
