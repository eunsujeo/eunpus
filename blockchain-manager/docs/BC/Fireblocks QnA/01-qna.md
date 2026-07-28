---
title: Fireblocks QnA — 담당자 확답 정리
status: To Do
---

Fireblocks 담당자에게 문의해 받은 답변을 질문 단위로 모은다.

## Rate limit — 담당자 확답 (2026-07)

**Q.** 폴링 트래픽이 "이상 트래픽"으로 감지돼 rate limit 에 걸릴 수 있나?
**A.** 아니다. rate limit 은 결정론적 per-60초 요청 카운터뿐이다. 이상·스파이크 감지, 적응형 스로틀, 임시 밴·누적 페널티가 없다. 꾸준한 폴링은 "이상"으로 취급되지 않고, 닿을 수 있는 건 정적 분당 한도뿐이다.

**Q.** 한도는 API user 마다 따로 받나?
**A.** 아니다. 워크스페이스 단위로 모든 API user 가 공유한다. 전용 Viewer(읽기전용) user 도 자기 예산이 없다 — 워크스페이스 총량으로 설계해야 한다.

**Q.** 우리가 쓰는 거래 조회 엔드포인트의 분당 한도는?
**A.** 목록 `GET /v1/transactions` 는 1,000/분, 단건 `GET /v1/transactions/{txId}` 는 1,500/분이다. 두 카운터는 독립이라 서로 경쟁하지 않는다. 최고 tier 라 더 높은 값은 없다. (계약 후 계정 설정 시 부여 — 현재 기본값 아님)

**Q.** 한도를 넘기지 않으려면 무엇으로 조절하나?
**A.** 모든 응답(성공·거절)에 `X-RateLimit-Limit`·`Remaining`·`WindowSize`·`Retry-After` 헤더가 온다. `Remaining`·`Retry-After` 로 선제 조절하고, 429 는 지수 백오프로 받는다(보조).

**Q.** 확정이 안 되고 오래 걸리는 tx 는 계속 조회해도 되나?
**A.** 안 된다. 고정 주기로 계속 조회하면 진행 중 tx 가 쌓여 사용량이 커진다. 지수 백오프(30초 → 1분 → 5분 → 15분 → 1시간) + 분당 단건 호출 총량 상한(최근·변화 가능성 높은 것 우선) + 일정 나이를 넘으면 조회를 멈추고 저빈도 대사나 운영 알림으로 넘기는 것이 필수다.

**Q.** 우리가 계획한 폴링 물량은 한도 안에 드나?
**A.** 목록 1,000/분 · 단건 1,500/분 안에 든다고 확인받았다(백오프 정책 포함 조건).

**Q.** 상태 추적에 폴링과 웹훅 중 무엇을 권장하나?
**A.** 웹훅이다. 반복 폴링의 rate 부담·타이밍 edge case 가 없다. 폴링은 인바운드 웹훅이 막힌 환경(은행 보안 정책 등)의 지원 대안으로 본다.

## 트랜잭션 조회 API — 담당자 확답 (2026-07)

**Q.** `after`/`before` 필터는 무엇을 기준으로 거르나?
**A.** 항상 생성 시각(createdAt) 기준이다. `orderBy` 와 무관하다. 그래서 조회 창을 벗어난 뒤 상태가 바뀐 tx 는 목록에 다시 뜨지 않는다 — 그런 건 단건 조회로 따로 쫓는다.

**Q.** `orderBy` 를 지정해도 되나?
**A.** 지정하면 next-page 커서가 반환되지 않는다. 그래서 지정하지 않는다.

**Q.** 특정 tx 의 갱신을 추적하는 권장 방법은?
**A.** 단건 조회(`GET /v1/transactions/{txId}`)가 권장 패턴이다. 요청량이 최소이고 rate limit 안에 넉넉히 든다.

**Q.** 확정·실패로 끝난 tx 의 객체도 더 바뀌나?
**A.** 바뀐다. 종결 이후에도 tx 객체(blockInfo 포함)는 체인에 변화가 생기면 갱신된다.

**Q.** EVM 과 UTXO 를 다르게 다뤄야 하나?
**A.** 아니다. API 표면 동작이 동일해 체인 타입 분기가 필요 없다.

**Q.** EVM(account 기반) 입금 통지는 언제 생성되나?
**A.** 채굴(mined) 시점에 생성된다.

**Q.** 한 번에 몇 건까지 받나? `after` 를 안 주면?
**A.** `limit` 은 기본 200·최대 500이다. `after` 미지정 시 기본 조회 범위가 "지난 90일"이고 바뀔 수 있어, 항상 명시한다.

**Q.** 조회는 어떤 권한으로 가능한가?
**A.** Viewer(읽기전용) 권한으로 가능하다 — 폴러를 읽기전용 user 로 분리할 수 있다. 단 rate 예산은 워크스페이스 공유다.

## 트랜잭션 상태·reorg — 담당자 확답 (2026-07)

**Q.** `numOfConfirmations` 값이 reorg 때 줄어들 수 있나?
**A.** 아니다. 한 번 올라간 값은 다시 줄지 않는다(늘기만 한다). reorg 로 블록이 교체돼도 감소하지 않고 그 자리에 멈춘다. 자산별 요구 컨펌 수가 상한이라, 그 이상으로는 안 늘고 COMPLETED 도 그 임계에서 뜬다.

**Q.** reorg 로 재채굴되면 tx 객체는 어떻게 바뀌나?
**A.** blockInfo(blockHash·blockHeight)가 새 블록으로 갱신되고, status 는 CONFIRMING 으로 유지된다.

**Q.** 재채굴되지 못하고 탈락하면?
**A.** `FAILED` + subStatus `DROPPED_BY_BLOCKCHAIN` 으로 전이한다.

**Q.** `BLOCKED` 는 최종 상태인가?
**A.** 최종(terminal)이다. 정책 규칙에 막힌 출금에 뜨고, 자금은 재사용하도록 즉시 풀린다. 이후 상태 전이는 없다.

**Q.** `REJECTED` 는 최종 상태인가?
**A.** 방향에 따라 다르다. 출금(outgoing) `REJECTED` 는 최종이라 자금이 즉시 반환된다. 입금(incoming) `REJECTED`(동결 케이스)는 최종이 아니라 보류(hold)로 다뤄야 한다 — Admin 이 해제(unfreeze)할 때까지 자금이 묶여 있고, Admin 조치로 결과가 바뀔 수 있다.

**Q.** 동결·해제 같은 상태 변화를 웹훅·조회로 잡을 수 있나?
**A.** 잡을 수 있다. status/subStatus 변화(동결·해제 포함)는 `transaction.updated` 웹훅을 발생시키고 `GET /v1/transactions/{txId}` 에도 반영된다.

## 공식 문서로 확인한 사실 (참고)

담당자 메신저 답변이 아니라 Fireblocks 공식 문서에서 확인한 것 — 답변마다 원본 출처 링크를 단다.

**Q.** 웹훅에 2xx 를 못 주면 어떻게 되나?
**A.** 지수 백오프로 총 10회 재시도(합산 약 8시간) 후 failed 로 마킹한다. ([Responses & retries](https://developers.fireblocks.com/reference/webhooks-gettingstarted-responsesretries))

**Q.** 실패 처리된 알림을 다시 받을 수 있나?
**A.** 재전송 API `resend_failed` 로 다시 받는다 — 원 이벤트로부터 30일 내, 같은 이벤트는 5분에 1회. ([Resend webhook notifications](https://developers.fireblocks.com/reference/resend-webhook-notifications))

**Q.** 수신 오류율이 높으면?
**A.** 오류율이 높은 endpoint 는 벤더가 자동 비활성화한다(circuit breaker). 재활성화 전까지 웹훅이 오지 않는다. ([Responses & retries](https://developers.fireblocks.com/reference/webhooks-gettingstarted-responsesretries))

**Q.** 웹훅 서명은 어떻게 검증하나?
**A.** JWKS 방식이다 — `Fireblocks-Webhook-Signature` 헤더, 공개키는 자동 조회·로테이션. ([Validating webhooks](https://developers.fireblocks.com/reference/validating-webhooks))

**Q.** 확정으로 볼 컨펌 수는 어떻게 정해지나?
**A.** DCCP(확정 정책)가 정한다. 기본은 대부분 체인 1(이더·Base 포함)·ETC 372·컨트랙트 호출 3 권장. 한도는 EVM 최소 1·이더 최대 100·신규 EVM L2 최대 30. 커스텀 임계는 정책 템플릿을 Support 에 제출해 승인 후 반영된다. ([About the DCCP](https://support.fireblocks.io/hc/en-us/articles/360013034359-About-the-Deposit-Control-and-Confirmation-Policy))

## 대기 중인 문의 (회신 전)

**Q.** WRITE 계열(`POST /transactions` 등)의 분당 한도는?
**A.** 미확인. 위 1,000/1,500 은 거래 조회 두 엔드포인트 한정이라, 출금·sweep·boost 제출량의 근거가 아직 없다 — 후속 문의 대상.

**Q.** 자산별 확정 임계 값은 얼마로 하나?
**A.** 논의 후 확정 예정(테스트넷 3, 메인넷은 협의 값). Base 의 컨펌 단위와 블록 간격 상수 유효성도 함께 확인한다.

**Q.** `transaction.status.updated` 는 컨펌마다 발생하나, 아니면 coarse 상태 변화(CONFIRMING·COMPLETED)에만 발생하나?
**A.** 미확인. 이 답에 따라 웹훅 순간 부하가 몇 배로 갈린다 — 컨펌마다면 진행 중 tx 전부가 매 블록 갱신된다. 회신 후 부하 기준 확정.
