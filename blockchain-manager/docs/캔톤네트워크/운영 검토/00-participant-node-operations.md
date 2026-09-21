---
title: 참여자 노드 운영 — 무결성 확인·백업·보존·업그레이드
status: To Do
date: 2026-09-21
---

Canton 원장이 참여자 노드의 PostgreSQL 에 영속된다는 구조에서 나오는 운영 질문을 모았다. 개념 12장은 원장이 **어떻게 동작하는가**를 설명하는 문서라 **누가 어떤 절차로 운영하는가**를 다루지 않아, Canton 공식 문서에서 따로 확인했다.

출처는 `digital-asset/canton` 운영 문서를 **v3.5.18 태그로 고정해** 받은 스냅샷 8건과 `canton-network/cf-docs` 의 Pruning 개요 1건이다 (2026-09-21 확인). 원문은 `sources/canton-network/` 에 있고 해시는 `manifest.yml` 에 적었다.

## 출발점 — 로컬 DB 를 조작하면 어디까지 되나

이 문서가 나온 질문이다. **조작 자체는 가능하다.** 다만 남을 속이는 데는 쓰이지 못한다.

| | 근거 |
|---|---|
| **안 된다** — 내 DB 를 고쳐 없던 자산을 만들어 상대에게 인정받기 | 공유 컨트랙트는 당사자 노드 모두에 동일 사본으로 남는다 ([6장](../개념/06-architecture.md)) · 상태 변경은 이해관계자가 검증·confirm 해야 확정된다 ([3장](../개념/03-transaction-view.md)·[8장](../개념/08-transaction-flow.md)) · 순서는 시퀀서의 암호화 스트림이 기준이다 (6장) |
| **된다** — 나를 차단, 내 데이터 노출, 로컬 파티면 내 이름으로 서명, 내가 보는 화면을 속이기 | [11장](../개념/11-trust-model.md) ① 내 밸리데이터는 "가장 센 신뢰" 영역 · 로컬 파티는 키를 노드가 보관한다 ([4장](../개념/04-parties-and-components.md)) |

원장의 권위는 DB 가 아니라 다자 확인을 거친 합의 결과에 있고, DB 는 그 결과의 로컬 사본이다. 그래서 다음 질문이 남았다 — **그 로컬 사본이 어긋났는지 어떻게 아는가.** 답이 있다.

## 1. 분기 탐지 — ACS commitment

**개념은 [6장 「노드끼리 어긋나면 어떻게 아나」](../개념/06-architecture.md#노드끼리-어긋나면-어떻게-아나-acs-대조) 에 있다.** 여기서는 운영자가 쓰는 도구와 경보만 본다.

commitment 는 **SHA-256 해시**로 구간(commitment period)마다 오간다. 조사 명령 출력 예시에 `SHA-256:9a5a5575876d…` 형태로 찍힌다. 공식 문서는 이것을 "참여자 사이의 공통 ACS 상태에 대해 non-repudiation 을 세우는 것"이라고 적는다.

경보는 네 종류다.

| 오류 코드 | 의미 |
|---|---|
| `ACS_COMMITMENT_MISMATCH` | 나와 counter-participant 의 공통 ACS 상태에 **fork** 가 생겼다 |
| `ACS_COMMITMENT_ALARM` | 문서가 **"악의적 행위를 나타낸다"** 고 적는다. 받은 commitment 의 서명이 유효하지 않거나, 같은 구간에 대해 **올바로 서명된 서로 다른 commitment 두 개**를 같은 counter-participant 에게서 받은 경우 |
| `ACS_MISMATCH_NO_SHARED_CONTRACTS` | fork 의 특수한 경우. 상대는 그 구간에 commitment 를 보냈는데 나는 공유 활성 컨트랙트가 없다고 보는 상황 |
| `ACS_COMMITMENT_DEGRADATION` | 내 commitment 계산이 상대보다 뒤처져 catch-up 모드에 들어갔다. 상대가 나를 blacklist 할 수 있다 — 내가 상대의 pruning 을 막고 있기 때문 |

문서는 이 경보들을 소개하며 **"받은 commitment 가 변조의 증거를 보일 때"** 라는 표현을 직접 쓴다. 조사 도구는 관리 콘솔(또는 gRPC)의 `commitments.lookup_received_acs_commitments` · `lookup_sent_acs_commitments` 다. 어느 counter-participant 와 어느 구간에 불일치가 있는지 본다.

**탐지 범위에 유의한다.** 문서가 말하는 대조 대상은 counter-participant 와의 **공통 ACS 상태**이고, 주기는 reconciliation interval 단위다. 실시간 탐지가 아니며, 공유 상대가 없는 데이터를 이 방식으로 대조한다는 서술은 확인되지 않았다.

## 2. 백업과 복구

복구되면 참여자는 **synchronizer 에서 누락분을 재생**한다. 단 조건이 붙는다 — "synchronizer 의 백업이 참여자의 것보다 최신인 한".

**백업 순서가 프로토콜 요건이다.**

- mediator 와 participant 를 **sequencer 보다 먼저** 백업한다. 아니면 sequencer 에 재연결하지 못한다 (`ForkHappened`). mediator 와 participant 사이의 순서는 상관없다.
- 한 번에 전체를 뜨는 경우(예: 클라우드 RDS) 백업 중 어떤 구성요소도 DB 에 쓰지 않게 한다.
- **Ledger API 를 쓰는 앱의 상태는 participant 보다 먼저** 백업한다. 아니면 앱 상태를 리셋해야 한다.

synchronizer 를 백업에서 복구했는데 참여자가 그보다 앞서 있으면 참여자가 연결을 거부한다(`ForkHappened`). 참여자를 더 이전 백업으로 되돌리거나, 새 synchronizer 를 세우는 복구 전략으로 가야 한다.

**복구 후 남는 것**도 문서가 명시한다.

- **명령 중복제거 상태가 어긋난다.** 앱이 중복 명령을 다시 보내면 걸러지지 않고 수락될 수 있다. 참여자가 sequencer 의 이벤트를 다 처리하고, 복구 전 제출분이 다시 순서화될 여지가 없어질 때까지 이 상태가 이어진다.
- **Ledger API 이벤트 스트림이 달라진다.** 할당되는 ledger offset 이 달라질 수 있고, completion stream 의 거절이 누락될 수 있다. Ledger API 클라이언트는 이 차이를 다뤄야 한다 (무상태 앱은 영향 없음).

## 3. 보존과 pruning

pruning 은 **archived 컨트랙트와 오래된 트랜잭션만** 지운다. 활성 컨트랙트는 절대 지우지 않는다. 방식이 둘이다.

| | 내용 |
|---|---|
| 자동 | cron 식으로 시작 시각, 최대 수행 시간, 보존 기간을 지정. 내부 스토어만 지울지 Ledger API 가시 범위까지 지울지 선택 |
| 수동 | `find_safe_offset` 으로 offset 을 찾아 `prune` 호출. DB 유지보수·조각모음과 묶어 돌릴 수 있다 |

`prune` 과 `prune_internally` 가 나뉜다. 예를 들어 **Ledger API 이력은 3개월 유지하고 내부 스토어는 1개월까지** 지우는 구성이 가능하다. 문서는 **pruning 할 때마다 백업을 뜨는 것을 전제**로 요구한다.

최소 보존선이 있다. 참여자는 **중복제거 구간에서 가장 최근에 관찰한 트랜잭션을 지우지 않는다.** 구간 길이는 `ledger-api.max-deduplication-duration` 으로 설정하고, 이것이 최소 보존 기간이 된다. 그리고 1절에서 본 대로 counter-participant 전원의 일치 commitment 없이는 그 시점까지 prune 하지 못한다.

**sequencer 쪽은 다르게 동작하고, 여기에 위험이 하나 있다.** sequencer 는 멤버가 더 이상 필요 없다고 확인(acknowledge)하기 전에는 데이터를 지우지 않는다. 다만 응답하지 않는 멤버에 대비해 **운영자가 보존 기간을 정해 확인 없이 prune 할 수 있고, 그 경우 멤버가 나중에 그 데이터를 필요로 해도 복구할 수 없다.** 2절의 복구가 "synchronizer 의 백업이 참여자의 것보다 최신인 한" 성립한다는 조건과 함께 읽어야 한다 — 오래된 참여자 백업은 sequencer 가 이미 prune 한 구간을 재생하지 못해 못 쓰게 될 수 있다.

**규제 대응은 운영자 몫으로 돼 있다.** Pruning 개요는 GDPR·HIPAA 를 들며 "Canton 운영자가 합리적인 보존 기간을 선언하고 데이터가 삭제되도록 해야 한다"고 적는다. 과거 이력 조회가 규제상 필요하면 PQS 를 쓴다.

## 4. 고가용성 — 두 가지를 구분한다

이름이 비슷한 다른 장치가 둘이다.

**노드 복제본 HA** — 공유 DB 에 붙는 참여자 노드 복제본을 여러 개 띄운다. PostgreSQL 과 Oracle 만 지원하고, `replication.enabled = true` 로 켜며 Canton 2.4.0 부터 지원 스토리지에서는 기본 활성이다. active 복제본이 죽으면 자동 전환되고 수동 graceful failover 명령도 있다. Ledger API 앞에 로드밸런서를 두어 active 인스턴스로 보낸다.

운영 주의 — pruning 메서드는 **active 복제본에서** 호출해야 하고, 수동 pruning 은 failover 후 다른 노드에서 이어받는 기능이 없다.

**Party replication** — 11장이 완화책으로 든 "한 파티를 여러 노드가 호스팅"이 이쪽이다. 한 synchronizer 안에서 기존 파티를 추가 참여자에 복제한다. 파티와 대상 참여자가 **각각 topology transaction 으로 동의**해야 한다. 절차가 둘로 갈린다 — 아직 거래에 쓰이지 않은 파티는 간단한 절차, 이미 쓰인 파티는 offline party replication 절차다. 그래서 문서는 **새로 만든 파티는 쓰기 전에 복제하라**고 권한다.

★ **파티 offboarding 은 현재 지원되지 않는다.** 따라서 원래 참여자에서 파티를 떼어내는 party migration 도 안 된다. 노드를 바꾸는 시나리오를 잡을 때 걸릴 제약이다.

## 5. 업그레이드와 스키마 마이그레이션

내부 스토어 스키마는 Flyway 로 버전 관리된다 (6장에서 본 그대로). 공식 가이드는 **minor·patch 릴리스 기준**이고 major 는 다를 수 있다고 밝힌다.

- Canton 바이너리는 여러 protocol version 을 지원하고 새 버전은 하위호환으로 도입된다. 그래서 **노드마다 따로 업그레이드**할 수 있다 — 전원이 동시에 올릴 필요가 없다
- **HA 구성이면 업그레이드 전에 모든 노드를 내린다**
- 업그레이드 전에 DB 를 백업해 문제 시 이전 버전으로 되돌릴 수 있게 한다
- 필요한 **중단 시간은 업그레이드 테스트로 직접 측정**하라고 안내한다. 정해진 값을 주지 않는다

## 6. 아직 확인되지 않은 것

**용량 산정 기준은 못 찾았다.** `optimize/storage.rst` 가 있지만 내용은 DB 커넥션 풀 크기 튜닝이지 디스크 용량 산정이 아니다. 거래량 대비 증가율이나 ACS 와 이벤트 로그의 비율을 잡을 근거가 이번 검색 범위에는 없었다.

문서가 주는 것은 **pruning 이 크기를 제한하는 수단**이라는 데까지다. 실제 산정은 우리 거래량 가정으로 직접 측정하거나 벤더에 물어야 한다.

## 출처

`digital-asset/canton` 저장소, 태그 `v3.5.18` (커밋 `c548c9ba15d1f22f820ec2409d972b2b9e04a73b`), 2026-09-21 확인. 스냅샷 8건은 `sources/canton-network/` 에 있고 SHA-256 은 `manifest.yml` 에 적었다.

| 절 | 원문 |
|---|---|
| 1 | `participant/howtos/observe/commitments.rst` · `participant/howtos/troubleshoot/commitments.rst` |
| 1·3 | Pruning 개요 `canton-network/cf-docs` `docs-main/overview/reference/pruning.mdx` (ref `f28d96c3`) — 공개 주소 <https://docs.canton.network/overview/reference/pruning> |
| 2 | `participant/howtos/recover/backup-restore.rst` |
| 3 | `participant/howtos/operate/pruning/pruning.rst` |
| 4 | `participant/howtos/operate/ha/ha.rst` · `participant/howtos/operate/parties/party_replication.rst` |
| 5 | `participant/howtos/upgrade/index.rst` |
| 6 | `participant/howtos/optimize/storage.rst` (용량 산정 아님을 확인한 근거) |

## 관련 문서

- [6. 아키텍처 — 조율과 저장의 분리·영속](../개념/06-architecture.md) — 원장이 어디에 어떻게 남는지
- [7. 원장 모델](../개념/07-ledger-model.md) — 보관+생성·ACS·offset
- [11. 신뢰 모델](../개념/11-trust-model.md) — 내 밸리데이터를 어디까지 믿어야 하는지
- [무스비 PoC 노드인프라 요청](../무스비%20PoC/06-nodeinfra-asks.md) — AWS Sandbox·DevNet 범위의 PoC 체크리스트. 운영 전환 논의 때 이 문서를 함께 낸다
