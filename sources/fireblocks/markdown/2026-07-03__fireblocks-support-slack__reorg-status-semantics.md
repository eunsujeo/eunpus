# reorg 시 트랜잭션 상태 semantics — Fireblocks Support 확답 (2026-07-03)

> 출처: Slack 대화 — 질문자(사내), 답변자 **CSM(Fireblocks Support)**, "백엔드 팀에 의해 확인됨" 명시. 공개 문서가 아닌 support 채널 확답. Q-2026-07-03-T04 ANSWERED 근거.

## 확인된 사실 (Fireblocks 백엔드 팀 확인)

1. **CONFIRMING → BROADCASTING 회귀 없음** — reorg 가 나도 상태가 뒤로 돌아가지 않는다.
2. **reorg 로 거래가 취소(드랍)되면** Fireblocks 는 거래를 **실패·취소·만료**로 표시한다 — 예시 하위 상태 **`DROPPED_BY_BLOCKCHAIN`**.
3. **즉시 반영** — "reorg 가 해결될 때까지 기다리는" 지연·유예 없이 상태가 온체인 실제 상태와 동기화된다 (1차 답변, 최종 확답에도 유지).

## 후속 질의의 뉘앙스 (Bruce 지적 · 명시 확답은 취소 케이스에 한함)

- 얕은 reorg 로 잠깐 빠졌다 **재편입**되는 경우는 "취소"가 아니므로 FAILED/DROPPED 가 아닐 수 있음 — 상태가 실시간으로 온체인을 반영한다는 원칙상 **CONFIRMING 유지 + confirmation 수 재계산**으로 해석. (Support 답변은 "거래가 취소되면"의 케이스를 확답)

## 공식 문서 교차 확인

`reference-sub-statuses.md` (developers.fireblocks.com, FAILED sub-statuses):

> `DROPPED_BY_BLOCKCHAIN` — "The transaction failed before being confirmed on the blockchain, **or that the transaction was mined but dropped**. Funds become available again to the source account." (사유: RBF nonce 교체 · mempool 축출 · 노드 거부)

→ "mined but dropped" 가 reorg 드랍 케이스를 커버 — Support 확답과 공식 문서가 정합.

## 설계 반영 (docs-site)

- 입금 폴링 handler 의 무효화 판정: **status = FAILED(또는 CANCELLED·만료) + subStatus = `DROPPED_BY_BLOCKCHAIN`** → 가공본(잔액 반영분) 취소, 원본 보존.
- BROADCASTING 회귀를 처리할 필요 없음. 얕은 reorg 재편입은 CONFIRMING 유지라 별도 처리 불요(confirmation 재계산).
- 주기 대사는 여전히 최종 안전망(신호 누락 대비).
