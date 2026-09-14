# Universal Gasless feeInfo·feeUSD — 다른 사람의 질의응답

> 출처: 사용자가 2026-09-14 전달한 다른 사람의 질문과 Fireblocks 답변. 실제 회신 일시·원문 스레드 URL·응답자는 제공되지 않았다.
> 전달된 질문은 과금 5개 항목, 답변은 feeInfo 관련 3개 항목으로 서로 일치하지 않는다. 두 부분을 그대로 보존하며, 이 답변을 과금 5개 항목의 직접 답변으로 연결하지 않는다.
> 아래는 HTML 엔티티·서식만 정리한 원문이다.

## 질문 (원문)

we are currently learning more about Universal Gasless. As part of our internal technical and accounting review, could you please clarify the following regarding the Fireblocks-managed Relay? Some questions may fall outside the technical scope, so thank you in advance for your understanding.

1. Does Universal Gasless support transaction Boost? How are costs associated with Boost, failed transactions, or retries handled?
2. Does Fireblocks pay the gas fees upfront and invoice customers monthly?
3. Is the billing currency USD, and what payment methods are available?
4. Who determines the gas fee, and how is it calculated? Can customers set a maximum limit?
5. Are there any additional charges, such as Relay service fees, on top of the actual gas fees?

## 답변 (원문)

thanks for asking and please refer to the comments.

**1. Does `feeInfo` include the gas fee paid by the relay?**

Yes. The relay identity is stamped onto your own transaction when it is created, not only onto the relay's contract call, so your webhook receives `paidByRelay: true`, `relayId`, `relayType`, `relayName` and `feeUSD`.

A few implementation notes:

- **The webhook's `relayType` always returns `THIRD_PARTY`**, including for your own self-relay transactions. To distinguish `LOCAL` from `THIRD_PARTY` reliably, use the REST endpoint `GET /transactions/{id}`.
- **Read `feeInfo` rather than the top-level `fee` field.** For gasless transactions the REST API no longer exposes the deprecated top-level `fee`, but the webhook still sends it.
- **`relayName` is the relay workspace's display name**, not a fixed branded string. We'd recommend not building logic that depends on a specific value.
- **`relayId` is a vault account ID inside the relay's workspace**, so it won't resolve to anything in your own workspace. Treat it as an identifier only.

**2. Can `feeUSD` be used as the billing or settlement figure?**

No, `feeUSD` is display-only and should not be used for settlement.

The USD rate is snapshotted when the transaction is created, while the gas amount is only known at confirmation, so the two halves come from different moments in time. On a volatile chain that gap is material. The rate is also a cached spot rate, and it can be absent if the rate lookup failed.

The monthly gas reimbursement is a separate finance process computed from actual gas consumed; nothing in the billing path consumes `feeUSD`. If your goal is to reconcile against the invoice, it isn't the right number.

**3. Does a transaction that fails on-chain still include `feeInfo`?**

Yes. If the transaction broadcast and then reverted, the actual gas consumed is recorded before the transaction is marked failed, so you receive the real figure.

For reference, `-1` only appears when the transaction never reached the chain at all. Policy rejection, signing failure, or dropped before broadcast. A revert is not one of those cases. Note also that `-1` is only used on the deprecated top-level `fee` field; within `feeInfo`, a missing value means the field is omitted entirely rather than set to `-1`. Worth accounting for in your parsing logic.

## 적용 범위와 남은 확인

- 이 자료는 사용자에게 전달된 타인의 질의응답이며, 우리 Workspace의 API·Webhook 실측 결과가 아니다.
- 월 인보이스가 `feeUSD`를 사용하지 않는다는 설명만으로 정산용 USD 환율의 출처·기준 시각까지 확정할 수 없다.
- 실제 payload와 API 버전별 필드 위치·누락 형태, 청구 내역과 거래를 연결할 필드는 별도 확인 대상이다.
