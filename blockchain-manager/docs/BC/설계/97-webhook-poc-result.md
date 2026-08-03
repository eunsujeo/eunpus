---
title: 웹훅 수신 PoC 결과보고 — 감지 설계 실물 검증
status: Done
ref: 참고
---

[감지 상세](99-detection-detail.md)·[DB 설계](03-bcm-db.md)의 **수신 경로를 실물로 검증**한 PoC(bank-webhook) 결과다. 실제 Fireblocks 웹훅을 받아 측정한 값과 관찰한 사실만 적는다. 검증 코드는 fbhook 저장소, 진행 기록은 그쪽 NEXT.md.

## 환경

- Fireblocks **웹훅 v2** · US 프로덕션 스택(api.fireblocks.io) · testnet 입금 이벤트
- EKS `dev-temp-business`/`poc` — 수신 `https://bank-webhook.a3o18.cloud/webhook` (벤더 IP prefix list 허용) · 점검 `bank-webhook.pg166.io` (사내망)
- 인박스: MySQL(bank_service) `bcm_whk_l` — 설계 DDL 그대로 (JSONB→JSON 만 번역)

## 측정 한눈에

| # | 측정한 것 | 관찰 |
|---|---|---|
| 1 | JWKS 실서명 검증 (RS512 detached JWS) | 실이벤트 검증 통과 · 1바이트 변조·위조 서명은 401 |
| 2 | 중복 재전달 | 원문 바이트 + 원 서명 재전송 → PK 충돌로 `DUPLICATE` + **200**, 인박스 1행 유지 |
| 3 | 500 반복 후 복귀 | 다음 재시도에 전량 적재 — **유실 없음** |
| 4 | `resend_failed` 회수 | `202 {"total":1}` → 51초 뒤 재수신 |
| ★ | v2 payload 실물 구조 | `id`·`eventType`·`data.{id,status,subStatus,numOfConfirmations,source,destination}` 전부 확인 — `bcm_whk_l` 컬럼과 정합 |

## 재시도 간격 — 분 단위로 배증한다

2026-08-03, 알림 2건에 대해 2회 측정한 값:

```
1차 실패 후: +21~60초 → +1분 → +1분* → +3분 → +6분 …   (* 회차에 따라 1분 라운드 1~2회)
```

도착 시각이 **분 tick(:00)에 정렬**된다 — 벤더가 분 단위로 재전송을 배차하는 것으로 보인다. 공식 문서는 "지수 백오프 총 10회·합산 약 8시간"이라 밝히고 있고 자주 인용되는 초 단위 사다리(10·30·120·300·900초…)가 있는데, **측정값은 그와 다르다.** 총 회수·총 시간을 이 간격으로 다시 계산해야 한다.

## resend_failed — 전달 실패한 것만, 다음 분 배차로

`POST /v1/webhooks/{webhookId}/notifications/resend_failed` 를 호출해 측정한 것:

- 응답은 **`202 {"total":N}`** 이고, `N` 은 **호출 시점에 실패 상태인 알림 수만** 센다. 재시도 대기 중이던 2건 중 1건이 직전에 벤더 재시도로 전달되자 `total:1` 로 응답했다.
- **API 응답과 알림 도착은 따로다.** 호출하면 `202` 는 곧바로 오지만, **다시 보내달라고 한 웹훅 알림은 51초 뒤에 도착**했다 — 벤더가 분 단위로 배차하기 때문이다. 그래도 가만히 기다리는 것보다는 빨랐다(그냥 뒀으면 4분을 더 기다려야 했다). 이 API 는 "당장 당겨오는 버튼"이 아니라 "다음 배차에 태우는 버튼"이다.
- **실패한 것만 다시 보낸다.** 우리가 200 을 준 알림은 벤더 입장에서 전달 성공이라 재전송 대상이 아니다. 그래서 **200 을 준 뒤에 우리 쪽에서 잃어버린 알림은 이 API 로 되찾을 수 없다** — 그 공백은 tx 대사가 메운다. "최근 한 시간 것을 전부 다시 보내달라"는 식으로는 쓸 수 없다.

## payload 실물 구조와 인프라 관찰

- 최상위에 `id`(알림 UUID)·`eventType`·`resourceId`(= tx id)·`webhookId`·`workspaceId`·`createdAt`(epoch ms)가 온다.
- `transaction.created` 가 이미 `CONFIRMING` + `txHash` + `blockInfo` 를 담고 온다 — 입금 이벤트는 체인에 올라간 뒤부터 시작한다.
- `data.amountInfo` 는 **문자열 금액**이다 — 정밀도 손실을 피하려면 이 값을 쓴다.
- 수신 pod 는 스팟 노드 교체로 수시로 사라진다 — **인박스는 외부 DB 여야 한다**(pod 로컬 저장 불가). JWKS 아웃바운드는 사내 proxy 경유.
- 원본 샘플은 fbhook 저장소 `docs/payload-samples/`.

## 실물로 확인된 것

- 수신부 3단계(검증 → 적재 → 200)로 즉시 응답이 유지된다
- `noti_id` PK + INSERT IGNORE 만으로 중복 방어가 끝난다 — 중복도 200
- 장애 구간은 벤더 재시도로 메워진다 (500 을 반복해도 유실 없음)
- `bcm_whk_l` 스키마(컬럼·일시 규약)가 실물 payload 와 맞는다

## 범위 밖 (이 PoC 가 측정하지 않은 것)

분류·귀속, `bcm_tx_l` 전이 비교, outbox·relay 발행, tx 대사, 폭주 부하테스트(블록 파형 순간치).
