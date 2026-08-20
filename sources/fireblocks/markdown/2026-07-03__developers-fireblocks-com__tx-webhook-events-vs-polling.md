# Transaction webhook events vs polling 관찰 가능성 — 1차 추출 (2026-07-03)

> 출처: developers.fireblocks.com `reference/webhooks-structures-eventtypes-transaction.md` + `reference/monitoring-transaction-status.md` + `reference/transaction-objects.md` (fetch 2026-07-03). Q-2026-07-02-T03 ANSWERED · Q-2026-07-03-T04 부정 근거.

## Transaction webhook 이벤트 5종

| Event type | payload |
|---|---|
| `transaction.created` | TransactionDetails |
| `transaction.status.updated` | TransactionDetails |
| `transaction.approval_status.updated` | TransactionDetails |
| `transaction.network_records.processing_completed` | TransactionDetails |
| `transaction.alert.stuck_confirming` | TransactionAlertPayload (ATC 경보 · 2026-06-07 breaking change 예고) |

- 앞 4종 payload = **TransactionDetails** — `GET /v1/transactions` 응답과 같은 객체(status·subStatus·승인 상태 포함) → 폴링으로 동일 정보 관찰 가능.
- `alert.stuck_confirming` 만 별도 payload 의 경보성 이벤트 (Account Traffic Control) — 폴링으로는 "오래 CONFIRMING" 조건 검색으로 기능 대체.

## 감지 시점 (monitoring-transaction-status)

- **UTXO**: incoming tx 통지는 **mempool 등장 시점**에 생성.
- **Account-based(EVM)**: incoming tx 통지는 **mined 시점**에 생성.
- "Best practice = webhook" (벤더 권고) — 단 같은 TransactionDetails 를 폴링으로 읽을 수 있어 인바운드 차단 환경에선 폴링 대체 성립.

## networkStatus enum (transaction-objects)

`DROPPED`(low fee/mempool full 로 드랍) · `BROADCASTING` · `CONFIRMING` · `FAILED` · `CONFIRMED` — **ORPHANED 없음**. sub-statuses 전체 목록에도 reorg/orphan 항목 없음.
