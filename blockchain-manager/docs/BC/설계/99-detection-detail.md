---
title: 웹훅 감지 상세 (참고) — 폭주 처리·유실 복구
status: To Do
ref: 참고
---

[흐름](02-bcm-flow.md) 감지 절의 심화 참고 문서다 — 웹훅이 **한꺼번에 몰릴 때**와 **놓쳤을 때**를 어떻게 견디는지만 따로 모았다. 본 흐름 이해에 필수는 아니고, 구현·부하 설계 때 본다.

## 입금이 몰릴 때 — 수신은 3단계, 처리는 뒤로

도착 속도는 벤더가 정한다. EVM 입금 통지는 채굴 시점에 생성돼 **블록 단위로 뭉쳐 온다** — 부하는 평균이 아니라 **체인별 블록 파형의 합**으로 잡는다.

- **이더** — 약 12초마다 블록. 그 블록에 담긴 tx 들이 한꺼번에 온다 (예: 10분 1만 건이면 블록당 ~200 tx).
- **Base** — 약 2초마다 블록. 뭉치는 작아도 **6배 잦아** 스트림이 촘촘하다.

두 체인이 겹쳐 오고, 여기에 **tx당 알림 수**가 곱해진다 — 생애 2~3개(created·CONFIRMING·COMPLETED)인지 **컨펌마다**인지에 따라 순간치가 몇 배로 갈린다(미확인 — Fireblocks QnA 대기 문의). 새 체인이 붙으면 그 파형이 더해진다. **정확한 순간 최댓값은 부하테스트로 확정한다.**

버티는 방법은 하나다 — **받는 일과 처리하는 일을 나눈다.** 수신부는 요청당 딱 3단계만 하고, 무거운 판단·발행은 뒤의 워커가 맡는다.

| 단계 | 수신부가 하는 일 |
|---|---|
| 서명 검증 | 진짜 벤더가 보낸 게 맞는지 확인 (공개키는 캐시에서만 읽어 네트워크 왕복 0) |
| 수신 적재 | 알림 원본을 버퍼 테이블(`bcm_whk_l`)에 저장. 같은 알림이 또 오면 키 충돌로 자동 무시 |
| 200 응답 | 저장 성공 즉시 "받았다" 응답 |

요청당 비용이 "저장 한 번(수 ms)"으로 고정이라, 아무리 몰려도 **수신부는 멈추지 않고 계속 즉시 응답**한다. 이게 핵심인 이유 — 벤더는 우리가 응답을 자꾸 못 하면 웹훅을 아예 꺼버리기 때문이다(circuit breaker). 판단 워커는 버퍼에 쌓인 걸 오래된 것부터 집어가고, 필요하면 여러 대로 늘릴 수 있다. **폭주의 대가는 "처리 지연"뿐이고, 유실은 없다.**

무거운 일은 판단 워커가 뒤에서 맡는다:

| 단계 | 판단 워커가 하는 일 |
|---|---|
| 집기 | 버퍼(`bcm_whk_l`)에서 미처리 알림을 오래된 것부터 꺼낸다 — **tx 단위 잠금**으로 같은 tx 의 동시 처리·대사 겹침을 막는다 |
| 분류·귀속 | 방향을 가린다(발신자가 우리 vault? 목적지가 매핑된 입금 주소?) + accountId 귀속(주소→계정 조회) |
| 전이 비교 | 마지막 발행 상태(`bcm_tx_l.last_pub_stcd`)와 견줘 **앞으로 가는 전이만** 가려낸다 (중간 전이는 기록만) |
| 발행·기록 | 해당 큐에 이벤트 발행 → `bcm_tx_l` 갱신 + 알림 처리 완료(`prcs_yn=Y`) — **발행 성공 후에만** |

받는 즉시 200, 무거운 처리는 뒤 워커로 — 호출 순서로 보면:

```mermaid
sequenceDiagram
  participant F as Fireblocks
  participant R as 수신부
  participant B as bcm_whk_l
  participant W as 판단 워커
  participant Q as deposit-events

  Note over F,R: 수신 — 요청당 딱 3단계
  F->>R: 웹훅 도착
  R->>R: 서명 검증
  R->>B: 적재
  R-->>F: 200
  Note over F,R: 폭주해도 이 경로는 그대로 — 저장 1번뿐이라 계속 즉시 200

  Note over B,W: 처리 — 뒤에서 비동기로
  W->>B: 오래된 것부터 꺼냄 (tx 단위 잠금)
  W->>Q: 발행 → 그 뒤 bcm_tx_l 갱신·처리 완료 (발행 성공 후)
  Note over B,W: 몰리면 버퍼에만 적체 — 워커가 밀릴 뿐 수신은 안 막힌다
```

색: **보라 = 벤더가 보낸 웹훅 도착 · 청록 = DB 테이블 · 노랑 = 메시지 큐.**

```anim
db
hook: Fireblocks 웹훅 | 도착
table: bcm_whk_l | 알림 | 처리
queue: deposit-events | 발행
step: 평상시 | 벤더가 웹훅을 보내면(도착) 수신부가 저장하고, 워커가 처리해 큐에 발행한다
ins: Fireblocks 웹훅 | 입금 감지
ins: bcm_whk_l | n-01 | 완료
ins: deposit-events | 감지
step: 폭주 — 웹훅이 쏟아진다 | 블록 뭉치로 웹훅이 한꺼번에 도착 — 수신부는 저장만 하고 즉시 200 (멈추지 않음)
ins: Fireblocks 웹훅 | 입금 감지
ins: Fireblocks 웹훅 | 입금 감지
ins: Fireblocks 웹훅 | 입금 감지
ins: bcm_whk_l | n-02 | 대기
ins: bcm_whk_l | n-03 | 대기
ins: bcm_whk_l | n-04 | 대기
step: 적체는 워커 쪽에만 | 수신은 계속 받고, 밀린 건 워커가 오래된 것부터 소화한다
upd: bcm_whk_l | 2 | 처리=완료
upd: bcm_whk_l | 3 | 처리=완료
ins: deposit-events | 감지
ins: deposit-events | 감지
step: 정상 복귀 | 남은 것도 처리 — 대가는 처리 지연뿐, 놓친 건 없다
upd: bcm_whk_l | 4 | 처리=완료
ins: deposit-events | 감지
```

**트랜잭션 이벤트는 5종**, 그중 **3종을 구독**한다:

| 이벤트 | 무엇을 알리나 | 구독 |
|---|---|---|
| `transaction.created` | tx 가 처음 생김 — 신규 감지(입금 등장)의 시작 | O |
| `transaction.status.updated` | 상태 전이(예: CONFIRMING → COMPLETED) — 확정·무효 이벤트 발행의 주 신호 | O |
| `transaction.approval_status.updated` | 승인 상태 변화 — 정책·승인 흐름 진행(주로 출금) | O |
| `transaction.alert.stuck` | 막혀서 수동 개입이 필요한 tx 경보 (콘솔에 Beta phase 로 표기) | X — 자체 막힘 점검(주기 작업이 DB 에서 오래 미확정인 걸 조회)이 대체 |
| `transaction.network_records.processing_completed` | 한 거래가 **여러 온체인 거래로 쪼개질 때**(컨트랙트 호출 등) 그 중간 거래들의 처리 완료를 알린다. 단순 전송이면 대상이 없어 뜨지 않는다 | X — 지금은 단순 스테이블코인 입출금이라 미구독. **컨트랙트 호출을 도입하면 그때 구독 검토** |

부하 검증 항목은 p99 응답(1초 이내 목표) · 오류율(circuit breaker 감안 ~0) · 적체 소화 속도.

## 이중처리는 어떻게 막나 — 멱등·크래시 세이프

돈이 걸린 감지에서 가장 비싼 사고는 **같은 입금을 두 번 반영**(유령 돈)하거나 **놓치는 것**(누락)이다. 재처리·재시작이 이 둘을 만들지 않도록 세 가지가 받친다.

- **인박스가 들고 있는다.** 수신은 알림을 `bcm_whk_l` 에 적재(`noti_id` PK 로 중복 방어)하고 200 을 준다. 워커가 발행·처리 완료 표시에 성공하기 전까지 알림은 `prcs_yn=N` 으로 남는다 — 큐가 죽어도 유실이 아니라 지연(백프레셔)이 된다.
- **발행 먼저, 표시는 나중에.** 워커는 큐에 발행한 **뒤에** `bcm_tx_l` 갱신 + `prcs_yn=Y` 를 기록한다. 그래서 "표시했는데 발행 안 한" 누락이 생기지 않는다. 발행 뒤 표시 전에 죽으면 재처리 때 한 번 더 발행되는데, 이건 컨슈머가 접는다.
- **컨슈머 멱등 + per-tx 락.** 컨슈머는 이벤트 id(tx id·externalTxId)로 dedup 해 재발행을 한 번으로 만든다(큐가 at-least-once 라 어차피 필요). 같은 tx 알림 2건이 동시에 처리돼 이중 발행되는 것은 tx 단위 잠금으로 막고, `last_pub_stcd` 전이 비교로 앞으로 가는 전이만 발행한다.

크래시가 어디서 나든 재처리 결과:

| 크래시 지점 | 재처리하면 | 결과 |
|---|---|---|
| 200 직후(whk_l 적재됨), 워커 전 | `prcs_yn=N` → 나중에 집음 | 정상 1회 |
| 벤더가 같은 알림 재전송 | `noti_id` PK 충돌 → 무시 | 이중 없음 |
| 발행 전 크래시 | `prcs_yn=N` → 재처리 → 발행 | 유실 없음 |
| 발행 후, `prcs_yn=Y` 표시 전 | 재처리 → 재발행 → 컨슈머가 `evnt_id` 로 dedup | 이중 효과 없음 |
| 큐 다운 | 발행 실패 → 표시 안 함 → 인박스에 남아 재시도 | 유실 없음 (백프레셔) |
| 같은 tx 알림 2건 동시 | per-tx 락으로 직렬화 | 이중 없음 |

**핵심은 순서다** — 반드시 **발행 → 표시**. 반대로 표시부터 하면 발행 전 죽을 때 이벤트가 영구 유실된다. 이 순서 + 컨슈머 멱등이 exactly-once 효과의 두 축이고, `noti_id` PK 는 벤더 재전송을 값싸게 거르는 보강이다.

## 웹훅을 놓쳤을 때 — 복구 3겹

웹훅은 유실·지연·순서 뒤바뀜이 있을 수 있다. 세 겹으로 메운다 — 앞의 둘은 벤더 기능이고, 마지막은 우리가 벤더 기록을 직접 대조하는 안전망이다.

| 복구 수단 | 무엇인가 | 언제 |
|---|---|---|
| **벤더 재시도** | 우리가 200 을 안 주면 벤더가 **자동으로 다시 보낸다** — 지수 백오프로 총 10회(10초 → … → 4시간, 합산 ~8시간). 우리가 할 일 없음 | 수신기가 잠깐 멈췄을 때 자동으로 메워짐 |
| **재전송 API** ([Fireblocks 문서](https://developers.fireblocks.com/reference/resend-webhook-notifications)) | 재시도로도 실패 처리된 알림을 **우리가 "다시 보내줘"라고 요청**하는 벤더 API (`POST /v1/webhooks/{id}/notifications/resend_failed`). 원 이벤트로부터 **30일 내** 가능 · 같은 이벤트는 5분에 1회. 수신기가 오래 정지했다 재기동하면 그 직후 한 번 호출해 정지 구간을 회수 | 수신기가 ~8시간 넘게 정지했을 때 재기동 후 |
| **tx 대사** | 벤더가 **알림을 만들지도 못한 구간**(벤더 장애 등)은 위 둘로 못 메운다. 그래서 우리가 주기적으로 벤더 거래 목록을 읽어 우리 기록과 대조 — 아래 절 | 최종 안전망 (10분 주기 상시) |

"재전송 API"의 요지는 **"벤더는 이미 만든 알림을 우리 요청으로 다시 보낼 수 있다"**는 것이다 — 벤더가 알림 자체를 안 만든 구간만 tx 대사의 몫으로 남는다.

### 재전송 API — 수신기가 오래 정지했다 재기동한 뒤

수신기가 ~8시간 넘게 멈추면 벤더 재시도가 소진돼 그 알림들은 벤더 쪽에서 "실패"로 표시된다. 재기동 직후 재전송 API 를 한 번 호출하면, 벤더가 실패 처리한 알림을 다시 보내 다운 구간을 메운다. 원 이벤트로부터 30일 안, 같은 이벤트는 5분에 한 번 제한이 있다. 벤더가 알림 자체를 안 만든 구간은 여기서 못 메우고 다음 절의 tx 대사가 맡는다.

벤더 재시도가 소진된 뒤, 재기동 후 우리가 회수를 요청하는 순서:

```mermaid
sequenceDiagram
  participant F as Fireblocks
  participant R as 수신부
  participant B as bcm_whk_l
  participant Q as deposit-events

  Note over F,R: 수신기 정지 8시간+
  F-xR: 웹훅 도착 (못 받음)
  F->>F: 지수 백오프 재시도 10회 (~8h)
  F->>F: 소진 → 실패로 표시

  Note over R,Q: 재기동 후 회수
  R->>F: 재전송 요청 (resend_failed)
  F->>R: 실패분 재전송
  R->>B: 적재
  Note over B,Q: 이후 워커가 처리해 큐로 발행
```

색: 보라 = 웹훅 도착·재전송 요청 · 청록 = 버퍼(`bcm_whk_l`) · 노랑 = 큐 · **빨강 깜박임 = 못 받아 유실 위험**.

```anim
db
hook: Fireblocks 웹훅 | 도착
source: 재전송 API | 요청
table: bcm_whk_l | 알림 | 처리
queue: deposit-events | 발행
step: ① 평상시 | 웹훅이 오면 버퍼에 적재하고 워커가 처리해 큐에 발행한다
ins: Fireblocks 웹훅 | 입금 감지
ins: bcm_whk_l | n-01 | 완료
ins: deposit-events | 감지
step: ② 수신기 정지 8시간+ — 장애! | 웹훅이 와도 못 받는다 · 벤더 재시도도 소진돼 벤더 쪽에서 "실패"로 표시된다(빨강)
ins: Fireblocks 웹훅 | 입금 감지
ins: Fireblocks 웹훅 | 입금 감지
alert: Fireblocks 웹훅 | 2
alert: Fireblocks 웹훅 | 3
step: ③ 재기동 → 재전송 요청 | 재기동하면 재전송 API 를 한 번 호출해 "실패분을 다시 보내줘"라고 요청한다
ins: 재전송 API | resend_failed
step: ④ 벤더가 실패분 재전송 | 벤더가 그 알림들을 다시 보낸다 → 버퍼에 적재되고 큐로 발행돼 공백이 메워진다
ins: bcm_whk_l | n-02 | 완료
ins: bcm_whk_l | n-03 | 완료
ins: deposit-events | 감지
ins: deposit-events | 감지
clear: Fireblocks 웹훅 | 2
clear: Fireblocks 웹훅 | 3
```

정지·장애가 어떻게 나든 복구는 "재기동 + 재전송 + (경우에 따라) 웹훅 재활성화"로 수렴하고, 어느 경우도 **유실은 없다**:

| 시나리오 | 그동안 | 복구 | 유실 |
|---|---|---|---|
| 판단 워커만 정지 (수신 정상) | 수신은 200 유지, 적체만 증가 | 재기동 → 밀린 것부터 소화 | 없음 — 가장 안전한 고장 |
| 수신기 정지 ≤ ~8시간 (배포·점검 포함) | 벤더 재시도가 대기해 준다 | 재기동만 하면 재시도가 이어짐 (+ 재전송 1회) | 없음 |
| 수신기 정지 > ~8시간 | 벤더 재시도 소진 → 실패 마킹 | **재전송 API 로 30일 내 회수** | 없음 |
| DB 만 다운 (수신이 500 응답) | 오류율 상승 → **웹훅 자동 차단(circuit breaker) 위험** | 복구 절차: 웹훅 활성 상태 확인 → 재활성화 → 재전송 | 없음 — 재활성화를 빠뜨리면 조용한 정지 |
| 벤더 장애·점검 | 알림 자체가 안 옴 (우리 오류는 0) | 벤더 상태 모니터링이 잡음 → **tx 대사가 최종 안전망** | 대사가 메움 |

### DB 만 다운 — 재활성화를 빠뜨리면 조용한 정지

위 표에서 가장 위험한 줄이다. 버퍼 적재가 실패하면 수신부가 200 대신 500 을 준다. 오류율이 오르면 벤더가 웹훅 구독을 스스로 꺼버린다(circuit breaker). 이때부터는 웹훅이 아예 오지 않는데도 우리 쪽 오류 로그는 잠잠해서 알아채기 어렵다 — 재활성화를 빠뜨리면 조용한 정지가 된다. 복구는 DB 를 살린 뒤 **구독 상태를 확인해 다시 켜고**, 꺼져 있던 구간은 재전송 API 와 tx 대사로 회수한다.

500 → 자동 차단 → 재활성화까지, 행위자 사이 호출 순서:

```mermaid
sequenceDiagram
  participant F as Fireblocks
  participant R as 수신부
  participant B as bcm_whk_l
  participant Q as deposit-events
  participant OP as 운영자

  Note over F,Q: 평상시
  F->>R: 웹훅 도착
  R->>B: 적재
  B-->>R: 성공
  R-->>F: 200
  Note over B,Q: 이후 워커가 처리해 큐로 발행

  Note over F,B: DB 다운 — 적재 실패
  F->>R: 웹훅 도착
  R->>B: 적재 시도
  B--xR: 실패
  R-->>F: 500

  Note over F,R: 오류율 급증 → 자동 차단
  F->>F: 오류율 임계 초과
  F->>F: 구독 비활성 (circuit breaker)
  Note over F,R: 웹훅이 더는 오지 않음 · 로그는 잠잠

  Note over OP,Q: 복구
  OP->>B: DB 복구
  OP->>F: 구독 상태 확인 → 재활성
  OP->>F: 재전송 요청 (resend_failed)
  F->>R: 실패분 재전송
  R->>B: 적재
  Note over B,Q: 이후 평상시 경로로 발행
```

색: 보라 = 웹훅 도착 · 청록 = 버퍼·수신 서버 상태 · 노랑 = 큐 · **빨강 깜박임 = 500 응답·웹훅 차단**.

```anim
db
hook: Fireblocks 웹훅 | 도착
table: bcm_whk_l | 알림 | 처리
table: 웹훅 수신 서버 | 상태
queue: deposit-events | 발행
step: ① 평상시 | 웹훅이 오면 버퍼에 적재(200)하고 발행한다 · 수신 서버 정상
ins: 웹훅 수신 서버 | 정상
ins: Fireblocks 웹훅 | 입금 감지
ins: bcm_whk_l | n-01 | 완료
ins: deposit-events | 감지
step: ② DB 다운 — 적재 실패로 500 | 웹훅은 오는데 버퍼에 못 넣는다 → 200 대신 500 을 준다(빨강)
ins: Fireblocks 웹훅 | 입금 감지
alert: Fireblocks 웹훅 | 2
step: ③ 오류율 급증 → 웹훅 자동 차단 | 벤더가 오류율을 보고 이 서버로의 웹훅을 꺼버린다(circuit breaker) · 이제 웹훅이 아예 안 온다 — 로그는 잠잠해 알아채기 어렵다
upd: 웹훅 수신 서버 | 1 | 상태=차단
alert: 웹훅 수신 서버 | 1
step: ④ 복구 — 재활성화 + 구간 회수 | DB 복구 후 재활성화해 수신 서버를 되살리고, 차단 구간은 재전송 API·tx 대사로 메운다
upd: 웹훅 수신 서버 | 1 | 상태=정상
clear: 웹훅 수신 서버 | 1
clear: Fireblocks 웹훅 | 2
ins: bcm_whk_l | n-02 | 완료
ins: deposit-events | 감지
```

## tx 대사 — 놓친 웹훅을 잡는 최종 안전망

10분 주기로 벤더 거래 목록을 읽어 우리 기록(`bcm_tx_l`)과 대조하되 **종결된 건만 본다** — 진행 중(`CONFIRMING`·`SUBMITTED`)은 웹훅이 계속 갱신하므로 대사의 몫이 아니고, 놓치면 사고 나는 **종결 결과만** 대조·복구한다. 없거나 뒤처진 종결 건을 **웹훅과 똑같은 처리 경로**로 흘려 복구한다(자금은 건별로 큐에 발행). 동시에 운영 알림도 올리는데, 건별이 아니라 **주기당 1건으로 집계**한다 — 크게 터진 뒤 수백 건이 잡혀도 사람에게 가는 알림은 하나다. 누락이 잡혔다는 것 자체가 웹훅 경로 이상 신호라, 급증할 때만 호출(page)로 올린다.

벤더 목록을 당겨 대조하고, 자금은 건별·운영 알림은 집계로 나누는 순서:

```mermaid
sequenceDiagram
  participant J as 대사 워커
  participant F as Fireblocks
  participant T as bcm_tx_l
  participant Q as deposit-events
  participant OP as 운영자

  Note over J,OP: 10분 주기
  J->>F: GET /v1/transactions (마지막 성공 이후 · 종결 상태만)
  F-->>J: 거래 목록
  J->>T: 우리 기록과 대조
  Note over J,T: 없거나 뒤처진 건 = 놓친 웹훅
  J->>Q: 복구 발행 (건별)
  J->>OP: 집계 알림 1건 (이번 주기 N건)
  J->>J: 커서 전진 (마지막 성공 시각)
```

색: 보라 = 웹훅 도착 · 청록 = DB · 노랑 = 큐 · **빨강 깜박임 = 장애·누락**. `bcm_tx_l` 의 "벤더 상태" 칸은 대사가 그 순간 벤더 목록에서 확인한 값이다(저장 컬럼이 아니라 대조용).

```anim
db
hook: Fireblocks 웹훅 | 도착
table: bcm_tx_l | 거래 | 우리 상태 | 벤더 상태
table: bcm_job_m | 대사작업 | 마지막성공
queue: deposit-events | 발행
step: ① 감지 웹훅 도착 | CONFIRMING 웹훅이 와서 우리 기록이 생긴다
ins: Fireblocks 웹훅 | 입금 감지
ins: bcm_tx_l | tx-91c | CONFIRMING | 
ins: bcm_job_m | tx-대사 | 11:50
step: ② 확정 웹훅 유실 — 장애! | COMPLETED 웹훅이 오지 않는다 — 우리 상태가 CONFIRMING 에 멈춰 빨갛게 경보
alert: bcm_tx_l | 1
step: ③ tx 대사 — 벤더 목록 대조 | 대사가 벤더 목록에서 이 거래를 확인 → 벤더는 COMPLETED, 우리는 CONFIRMING (한 줄에서 불일치가 보인다)
upd: bcm_tx_l | 1 | 벤더 상태=COMPLETED
step: ④ 복구 발행 | 웹훅과 같은 경로로 확정을 발행하고 운영 알림도 올린다 → 우리 상태를 맞추고 경보 해제
upd: bcm_tx_l | 1 | 우리 상태=COMPLETED
clear: bcm_tx_l | 1
ins: deposit-events | 입금 확정
step: ⑤ 커서 전진 | 마지막 성공 시각을 앞으로 — 다음 대사는 여기서 이어붙여 공백이 없다
upd: bcm_job_m | 1 | 마지막성공=12:00
```

- **종결된 건만 대조한다** — `COMPLETED`(입금 finality)와 종결 실패(`FAILED`·출금 `REJECTED`·`BLOCKED`)가 대상이다. 진행 중(`CONFIRMING`·`SUBMITTED`)은 웹훅이 갱신하니 그냥 두고, 입금 `REJECTED`(동결·보류)는 비종결이라 제외한다. 대사의 책임은 중간 컨펌까지 벤더와 맞추는 게 아니라 **종결 결과를 하나도 놓치지 않는 것**이다.
- **대조 범위** = 최근 1시간과 마지막 성공 대사 시각 중 이른 쪽부터 — 대사가 오래 멈춰도 재기동하면 공백 없이 이어붙는다(마지막 성공 시각은 `bcm_job_m` 이 들고 있다).
- **웹훅과 같은 처리 경로를 쓴다** — 대사가 잡은 건도 중복 방지·전이 비교를 그대로 지나므로 이중 반영이 없다.
- 호출량은 주기당 목록 조회 1~수 회라 벤더 한도에 영향이 없다.
