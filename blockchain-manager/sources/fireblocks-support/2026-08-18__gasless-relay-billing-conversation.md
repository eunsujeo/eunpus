# Fireblocks Gasless Relay 과금 질의응답 (2026-08-18 수신)

> 출처: Fireblocks 담당자 답변 (사용자 제공 대화 원문). Universal Gasless / Fireblocks-managed Relay 의 과금·정산 조건.
> 소비처: `blockchain-manager/docs/블록체인매니저/가스대납/05-decision.md`

## 우리 질문 (원문)

we are currently learning more about Universal Gasless. As part of our internal technical and accounting review, could you please clarify the following regarding the Fireblocks-managed Relay? Some questions may fall outside the technical scope, so thank you in advance for your understanding.

1. Does Universal Gasless support transaction Boost? How are costs associated with Boost, failed transactions, or retries handled?
2. Does Fireblocks pay the gas fees upfront and invoice customers monthly?
3. Is the billing currency USD, and what payment methods are available?
4. Who determines the gas fee, and how is it calculated? Can customers set a maximum limit?
5. Are there any additional charges, such as Relay service fees, on top of the actual gas fees?

## 벤더 답변 (원문)

1. The Fireblocks Gasless Relay does not handle stuck transactions automatically. If a transaction remains pending, it needs to be boosted manually via RBF (Replace-by-Fee).

On cost treatment:
- Transactions that revert on-chain: billable, since the network has already consumed the gas.
- Transactions blocked by policy or failing validation before broadcast: no gas is incurred, as nothing reaches the network.
- Boost (RBF) resubmissions: the gas of the replacement transaction is billable. Because RBF replaces the original at the same nonce, the original is dropped and you are not charged twice.

Reference: https://support.fireblocks.io/hc/en-us/articles/23508430639516-Using-the-Fireblocks-Gasless-Relay

2. Yes. Fireblocks pays the gas upfront, and you receive a consolidated invoice at the end of each month.

3. Billing is in USD. We deliberately do not price the service based on native tokens or on the ETH we purchase, as doing so could position Fireblocks as a custodian. Payment methods follow your existing Fireblocks contractual process.

4. The gas cost is determined by the network — the chain's base fee and priority fee, together with the gas consumed by the transaction. Fireblocks applies no markup: the fee is calculated against network conditions at the time of sending, and the relay pays that amount. What you are billed is the exact amount the relay spent. When using the Relay, a gas price ceiling cannot be specified per transaction.

5. Yes. The Gasless Relay is a premium feature requiring additional purchase, so billing has two components: a monthly service subscription, and reimbursement of the actual gas Fireblocks spent on your behalf. There is no per-transaction relay fee and no percentage markup applied to gas.

## 답변 요지

| 질문 | 답 |
|---|---|
| Boost 지원 | 자동 없음 — 수동 RBF (공개 문서와 일치) |
| 실패 비용 | **revert 는 청구**(가스가 소비됨) · 브로드캐스트 전 차단(정책·검증)은 미청구 · **RBF 교체분은 청구, 원본은 같은 nonce 로 드랍돼 이중 청구 없음** |
| 선지불·월말 인보이스 | 맞음 |
| 통화 | **USD**. 네이티브 토큰 기준 가격은 수탁 지위 우려로 의도적으로 배제. 결제는 기존 Fireblocks 계약 프로세스 |
| gas 단가 | 네트워크가 결정(base fee + priority fee × 소비 gas). **마크업 없음** — 청구액 = relay 가 실제 지불한 금액. **건별 상한 지정 불가** |
| 추가 수수료 | 월 구독료 + 실비 두 항목뿐. 건별 relay 수수료 없음, 퍼센트 마크업 없음 |
