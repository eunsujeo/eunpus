---
title: 4. 정책 2단과 시간 규칙
status: To Do
---

트래블룰 스크리닝은 정책 두 단으로 돈다 — Transaction Screening Policy 가 무엇을 검사할지 거르고, Post-Screening Policy 가 판정 결과별로 무엇을 할지 정한다. 둘 다 first-match 다.
여기에 더해 기본값 표 하나가 규제 태도를 결정한다 — 그중 Skip on failure 한 줄이 "제공자가 죽으면 검사 없이 흘려보낼 것인가"를 정한다. 이 정책·기본값은 전부 벤더(Fireblocks) 체계이고, 그 체계가 없는 국내(직접 연동) 경로의 자체 시간 규칙은 이 장 끝에 따로 둔다.

## 정책 2단 — 무엇을 검사하고, 무엇을 하나

스크리닝은 서로 다른 두 정책이 순서대로 맞물려 돈다. 둘 다 **first-match** — 위에서부터 첫 일치 규칙의 조치가 적용된다.

| 단 | 정책 | 무엇을 정하나 |
|---|---|---|
| ① | **Transaction Screening Policy** | 어떤 거래를 검사 대상으로 삼을지 |
| ② | **Post-Screening Policy** | 검사 결과(Notabene 판정)에 어떤 조치를 취할지 |

### ① Transaction Screening Policy — 무엇을 검사할지

default 는 **전량 검사**다. 아래 경우만 검사에서 빠진다.

- **미지원 경로** — 스크리닝이 적용되지 않는 경로. Vault→Vault 같은 내부 이동이 여기 해당한다(5장의 공식 미적용 경로와 같은 것).
- **미지원 자산** — 스크리닝 제공자가 다루지 않는 자산.
- **초기 정보 없음** — 판정에 필요한 기초 정보가 없는 거래 (벤더 용어 — 정확한 범위는 확인 필요).
- **AML(자금세탁방지) 미활성** — AML 통합이 꺼져 있으면 트래블룰 검사도 빠진다.

규칙은 다음 축의 조합으로 쓴다.

**규칙 = Source/Destination × Amount/AmountUSD × Asset × Action**

Action 은 세 가지다.

| Action | 뜻 |
|---|---|
| **Screen** | 검사 대상으로 보낸다 |
| **Bypass** | 검사 없이 통과시킨다 |
| **Freeze** | 검사 전 동결한다 |

### ② Post-Screening Policy — 결과에 무엇을 할지

Notabene 판정 상태별로 조치를 **사전에 정해 둔다.** 조치는 입금이냐 출금이냐에 따라 의미가 갈린다.

| 조치 | 입금이면 | 출금이면 |
|---|---|---|
| **Accept** | 자금 즉시 사용 가능 | 서명 진행 가능 |
| **Reject** | 자금 동결 — Admin unfreeze 필요 | 전송 차단 — Admin 우회 가능(기본값 On) |
| **Alert** | 승인 + Audit Log·승인자 모바일 알림 | 승인 + Audit Log·승인자 모바일 알림 |
| **Freeze** | 동결 (입금 전용) | — |
| **Wait** | Pending 상태 전용 — 최대 4시간 대기 후 스크리닝 취소 | Pending 상태 전용 — 최대 4시간 대기 후 스크리닝 취소 |
| **Cancel** | — | Blocking Time Expired 전용 — 거래 취소 |

**Accept / Reject / Alert / Freeze / Wait / Cancel** 은 정책 화면의 조치 이름 그대로다.

### 판정 상태 7종

Post-Screening 조치는 아래 판정 상태에 걸려 발동한다.

| 판정 상태 | 뜻 |
|---|---|
| **Completed** | 스크리닝 완료 |
| **Pending** | 판정 대기 중 — Wait 대상 |
| **Saved** | 임계값 미만 / non-custodial / 동일 VASP 내부 — 기록만 하고 미전송 |
| **Rejected** | 거절(상대 VASP 거절 등) |
| **Failed** | 검사 실패 |
| **Blocking Time Expired** | 차단 시간 초과 — Cancel 대상 |
| **Canceled** | 취소됨 |

VASP(가상자산사업자) 간 실제 메시지 전송이 없는 세 경우(임계값 미만·non-custodial·동일 VASP 내부)는 **Saved** 로 묶여 기록만 남는다. 이 7종이 우리 공통 어휘(TrVerdict 4종)로 어떻게 접히는지는 8장 세 어휘 대응표에 있다.

규칙이 first-match 라는 점이 안전망이다 — custom 정책을 위에 올려도 **default 규칙이 맨 아래 그대로 남아**, 어떤 거래도 규칙에 걸리지 않고 빠져나가지 못한다.

## 시간 규칙과 기본값 — Fireblocks 설정

정책이 "무엇을·어떻게"라면, 여기 기본값 표는 "언제까지·장애 때 어떻게"를 정한다. 전부 **Fireblocks 워크스페이스의 Compliance 설정**이고 표의 값이 공식 기본값이다 — 대부분 설정에서 우리가 바꾸지만, 일부(Outbound delay 연장 · Admin 허용 2종 끄기)는 Support 경유다. 특히 첫 줄 하나가 규제 태도를 좌우한다.

| 설정 | 기본값 | 뜻 |
|---|---|---|
| **Skip on failure**(장애 시 우회) | On | 제공자 장애·기한 내 무응답이면 검사 없이 통과. Off 로 바꾸면 해당 출금은 실패, 입금은 동결. |
| **Inbound delay** | 30초 (최대 7일) | 입금 판정을 기다리는 시간 — 초과 시 기본 설정에선 자금 방출. |
| **Outbound delay** | 0초 (최대 90분) | 출금은 즉시 응답 사용. 연장은 Support 경유(JWT lifetime 변경). |
| **Pending 대기** | 최대 4시간 | 이후 스크리닝 취소. |
| **Admin unfreeze 허용** | On | 동결 자금을 Admin 이 Console/API 로 해제. Off 는 Support 경유. |
| **Admin 의 정책 우회 출금** | On | Reject 된 출금을 Admin 이 우회 전송 가능. Off 는 Support 경유. |
| **P2P Network 우회** | Off | Fireblocks P2P Network 거래도 검사한다. |

Inbound delay 는 기본 30초지만 최대 7일까지 늘릴 수 있고, Outbound delay 는 기본 0초에 최대 90분까지다 — 입금은 넉넉히 기다릴 수 있고 출금은 짧게 잡혀 있는 비대칭이다.

## 결정 포인트 — Skip on failure 를 끌 것인가

여기부터는 설계 판단 영역이다. 위 기본값은 Fireblocks 공식 기본 설정이지만, 규제 태도에 맞게 바꿀지는 우리가 정한다.

기본값 **On** 은 "제공자가 죽으면 검사 없이 흘려보낸다"는 뜻이다. 규제 요구가 엄격하면 **Off 가 맞다** — 그러나 그 대가는 장애 중 출금 실패·입금 동결이다. 어느 쪽을 택할지는 규제 강도와 서비스 연속성 사이의 트레이드오프이며, **이는 설계 판단이다.** 참고로 국내(직접 연동) 경로는 8장이 이미 장애 시 차단(fail-close)을 전제하므로, 벤더 경로의 이 스위치를 같은 태도(Off)로 맞출지가 사실상 한 묶음의 결정이다.

함께 결정할 대상이 둘 더 있다 — **Admin 의 정책 우회 출금**과 **Admin unfreeze 허용** 이다. 둘 다 기본값 On 이라, Reject 된 출금을 Admin 이 우회 전송하고 동결 자금을 Admin 이 직접 해제할 수 있다. 편의는 크지만 감사 관점에서는 우회 경로가 열려 있는 셈이므로, 이 두 기본값도 감사 정책과 함께 결정 대상으로 두는 것을 제안한다.

## 국내(직접 연동) 경로의 시간 규칙 — 자체 설계 대상

위 표는 모두 벤더(Fireblocks) 기본값이다. 국내 직접 연동(VerifyVASP·CODE)에는 이 체계가 없어(6장) 같은 종류의 규칙을 우리가 정의한다. 7·8장이 "시간 규칙은 4장"으로 가리키는 국내 값이 여기다 — 값은 미정이고, 정의할 목록을 못 박는다.

| 규칙 | 대응하는 벤더 기본값 | 정할 것 |
|---|---|---|
| "트래블룰 확인 중" 만료 | Pending 대기(4시간) | 상대 승인(사람 심사 포함)을 얼마나 기다렸다 반려할지 (7.1 PENDING 만료) |
| 대기함 보존 기간 | — | 사전 검증만 오고 자금이 안 온 기록을 언제까지 대조 재료로 유지할지 (7.3 대기함) |
| 보고 미수신 시간 초과 | Inbound delay(30초) | tx hash 보고가 안 올 때 Check Transaction Status 능동 조회로 넘어가는 시점 |
| 능동 조회 재시도 | — | 조회 주기·횟수, 그래도 안 풀리면 입금대기 확정 (7.5 판별 5) |
| 장애 시 태도 | Skip on failure(On) | Enclave·중앙 서버 장애 시 통과냐 차단이냐 — 8장은 외부 이체 fail-close(차단)를 전제한다 |

## 두 정책이 다른 장과 만나는 곳

Post-Screening 조치는 입금·출금 두 갈래로 의미가 갈렸다. 각 조치가 실제 거래 흐름에서 어떻게 작동하는지는 다른 장이 맡는다.

- **출금 쪽 동작**(Reject 시 전송 차단·Admin 우회, Outbound delay 적용) — 2장.
- **입금 쪽 동작**(Reject·Freeze 시 자금 동결·Admin unfreeze, Inbound delay 적용) — 3장.
