---
title: 웹훅 수신 PoC 결과보고 — 감지 설계 실물 검증
status: Done
ref: 참고
---

[감지 상세](99-detection-detail.md)·[DB 설계](03-bcm-db.md)의 **수신 경로를 실물로 검증**한 PoC(bank-webhook) 결과다. 검증 코드는 fbhook 저장소, 진행 기록은 그쪽 NEXT.md.

## 환경

- Fireblocks **웹훅 v2** · US 프로덕션 스택(api.fireblocks.io) · testnet 입금 이벤트
- EKS `dev-temp-business`/`poc` — 수신 `https://bank-webhook.a3o18.cloud/webhook` (벤더 IP prefix list 허용) · 점검 `bank-webhook.pg166.io` (사내망)
- 인박스: MySQL(bank_service) `bcm_whk_l` — 설계 DDL 그대로 (JSONB→JSON 만 번역)

## 검증 결과 한눈에

| # | 검증 항목 | 결과 | 설계 가정과 |
|---|---|---|---|
| 1 | JWKS 실서명 검증 (RS512 detached JWS) | 실이벤트 검증 통과, 1바이트 변조·위조 서명 401 | ✅ 일치 |
| ★ | v2 payload 실물 구조 | `id`·`eventType`·`data.{id,status,subStatus,numOfConfirmations,source,destination}` 전부 확인 | ✅ 일치 — 컬럼 설계 유효 |
| 2 | 중복 재전달 방어 | 원문 바이트+원 서명 재전송 → PK 충돌 `DUPLICATE` + **200**, 인박스 불변 | ✅ 일치 — PK 만으로 충분 |
| 3 | 장애 시 벤더 재시도 | 500 반복 후 복귀 → 다음 재시도에 전량 적재, **유실 없음** | ✅ 원리 일치 · **간격은 다름(아래)** |
| 4 | resend_failed 회수 | `202 {"total":1}` → 51초 뒤(분 tick) 재수신. 자연 재시도 회수와 병행 실증 | ✅ 일치 — 회수 API 동작 |

## 실측이 설계 가정과 다른 것 — 정정 후보

### 1. 재시도 간격 — 분 단위 배증 (99-detection-detail·QnA 정정)

문서 가정 10·30·120·300·900초와 달리, 실측(2026-08-03, 알림 2건×2회 실험)은 **분 단위 배증**:

```
1차 실패 후: +21~60초 → +1분 → +1분* → +3분 → +6분 …   (* 회차에 따라 1분 라운드 1~2회)
```

도착이 **분 tick(:00)에 정렬**되는 패턴 — 벤더가 분 단위 디스패처로 재전송하는 것으로 보인다. 총 10회·~8시간 도달 가정은 재계산 필요.

### 2. payload 를 JSON(B) 컬럼에 넣으면 와이어 바이트가 소실된다 (03-bcm-db 반영)

MySQL JSON(PostgreSQL JSONB 동일)은 저장 시 키 재정렬·공백 정규화를 한다. DB 에서 꺼낸 payload 로는 **detached JWS 재검증이 불가**했다(실측 401). 따라서:

- `bcm_raw_tx_l.payload_hash`(원문 SHA-256)는 **반드시 수신 시점의 와이어 바이트로 계산**해서 저장해야 한다.
- 바이트 수준 "원본 그대로"가 요구되면 TEXT 보관을 검토 (의미 수준 재처리만 필요하면 JSONB 유지 무방).

### 3. "즉시 응답" 원칙은 서명 검증의 외부 I/O 까지 포함해야 한다 (99-detection-detail 보강)

JWKS 조회가 타임아웃 없이 이벤트 루프에서 돌면, egress 이상 시 **평시에도** 수신기가 죽는다 — 실측: JWKS 무한 대기 → 벤더 재시도마다 스레드 잠김 → /health 기아 → liveness kill 크래시 루프. 수신부 요건에 명시 권고: **JWKS 조회 타임아웃(수 초) + 워커 스레드 분리 + 키 캐시**.

### 4. resend_failed 실측 노트 (QnA 보강)

- `POST /v1/webhooks/{webhookId}/notifications/resend_failed` → **202 `{"total":N}`** — `total` 은 **호출 시점에 실패 상태인 알림 수만** 센다. 재시도 대기 중이던 2건 중 1건이 직전에 자연 회복하자 `total:1` 로 응답.
- 재전송 도착도 **분 tick 정렬** — 호출 51초 뒤 도착 (자연 재시도 예정보다 4분 빠름). 회수는 "즉시"가 아니라 다음 분 배차로 이해할 것.
- 이미 2xx 를 받은(자연 회복 포함) 알림은 재전송 대상이 아니다 — 대사·복구 설계에서 resend 는 "실패분 전용" 도구.

### 5. 참고 실측 (가정 보강)

- `transaction.created` 가 이미 `CONFIRMING`+`txHash`+`blockInfo` 를 담고 온다 — 입금 이벤트는 체인 감지 시점부터 시작.
- 알림에는 최상위 `resourceId`(= tx id)·`webhookId`·`workspaceId` 가 있고, `data.amountInfo` 는 **문자열 금액**(정밀도 안전) — 파싱은 amountInfo 기준 권장.
- 인프라: 수신 pod 는 스팟 노드 eviction 으로 수시 교체된다 — **인박스는 반드시 외부 DB**(pod 로컬 저장 불가). JWKS 아웃바운드는 사내 proxy 경유.

## 그대로 확정된 설계 가정

- 수신부 3단계(검증→적재→200) 구조로 즉시 응답 유지 가능
- `noti_id` PK + INSERT IGNORE 만으로 중복 방어 완결 — 중복도 200
- 장애 구간 복구는 벤더 재시도로 충분 (500 반복에도 유실 없음)
- `bcm_whk_l` 스키마(컬럼·일시 규약) 실물 payload 와 정합

## 범위 밖 (이 PoC 가 검증하지 않은 것)

분류·귀속, `bcm_tx_l` 전이 비교, outbox·relay 발행, tx 대사, 폭주 부하테스트(블록 파형 순간치).
