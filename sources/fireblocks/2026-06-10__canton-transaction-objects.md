<!--
source_url: https://developers.fireblocks.com/reference/transaction-objects · /reference/monitoring-transaction-status
fetched_at: 2026-06-10
status: full (WebFetch — Fireblocks 공식 개발자 문서)
priority: TIER1 (1차 — Fireblocks developers)
domain: fireblocks / canton / transaction-status
-->

# Fireblocks Transaction Objects — Canton transactionType (A11 해소)

> Q-2026-05-22-A11(Canton transactionType ↔ Fireblocks status 매핑·timeout) 을 Fireblocks 공식
> 개발자 문서로 해소. Fireblocks 는 Canton 2-step 을 generic status 로 뭉개지 않고 **전용
> `transactionType` 필드 + CantonHashes** 로 그대로 노출.

## (1) Canton transactionType enum (verbatim)

source: developers.fireblocks.com/reference/transaction-objects

- `OFFER` — "Transfer initiated. Sender has created a transfer offer awaiting the recipient's action.
  This is the first step in a 2-step transfer flow."
- `ACCEPT` — "Transfer completed. The recipient has accepted the pending transfer offer."
- `REJECT` — "Transfer failed. Recipient has rejected the pending transfer offer."
- `WITHDRAW` — "Transfer cancelled. Sender has withdrawn/cancelled their pending transfer offer."
- `PRE_APPROVAL` — "Transfer completed instantly. Recipient had pre-approved incoming transfers,
  enabling a 1-step transfer flow."

## (2) 추적 필드

- **`traceableId`** = "UpdateId of the original transfer offer or auto-approved transaction."
- **`CantonHashes`** = `offerUpdateId`·`acceptUpdateId`·`rejectUpdateId`·`withdrawUpdateId`·
  `preApprovalUpdateId`. **"For ACCEPT, REJECT, and WITHDRAW transaction types, the `offerUpdateId`
  links back to the original OFFER transaction, enabling full transaction lifecycle tracking."**
- 일반 **NetworkStatus** enum: `DROPPED`·`BROADCASTING`·`CONFIRMING`·`FAILED`·`CONFIRMED`. (Fireblocks
  전체 status/substatus lifecycle 은 /reference/statuses — 본 페이지엔 미열거.)

## (3) A11 결론

- **매핑 = ANSWERED**: Fireblocks 가 Canton 2-step 을 **동일 이름의 전용 `transactionType`**(OFFER/
  ACCEPT/REJECT/WITHDRAW/PRE_APPROVAL)로 노출하고, `traceableId`/`CantonHashes.offerUpdateId` 로
  OFFER↔후속 을 연결해 lifecycle 추적. 즉 "어느 status 로 collapse 되나" 가 아니라 **별도 필드로 그대로
  표면화**된다. → 출금 상태머신의 "수락 대기" 단계를 transactionType=OFFER 로 두고 ACCEPT/REJECT/
  WITHDRAW 로 전이.
- **timeout = 앱/정책 레벨**: 수신자가 수락 안 하면 송신자가 **`WITHDRAW`** 로 취소(Fireblocks 가 동작
  제공). "언제 withdraw 할지"(타임아웃)는 Fireblocks 가 강제하지 않는 **앱 정책**.

## Source

Fireblocks Developers — <https://developers.fireblocks.com/reference/transaction-objects>
