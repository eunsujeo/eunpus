<!--
source_url: https://developers.circle.com/gateway/references/fees
downloaded_at: 2026-08-11
status: full
priority: TIER1
domain: Bridge / Circle Gateway
acquisition_method: "curl .md → file save (v3.2.2 Mode C)"
-->

# Gateway fees

> Understanding Gateway transfer fees and gas costs

Gateway charges a transfer fee and a gas fee for crosschain transfers. If you
use the [Circle Forwarding Service](/gateway/references/forwarding-service) to
handle the destination mint, Gateway also charges a forwarding fee.

## Transfer fee

Crosschain transfers incur a percentage-based fee of **0.005%** (0.5 basis
points) on the transfer amount.

* **When charged**: On crosschain transfers (source and destination are
  different blockchains)
* **Payment method**: Deducted from your unified USDC balance at the time of
  burn

Same-chain transfers (withdrawals where source and destination are the same
blockchain) do not incur the transfer fee.

## Gas fees

Each burn intent includes a gas fee that covers the cost of executing the burn
transaction on the source blockchain. The gas fee varies by source blockchain:

| Source blockchain | Gas fee (USDC) |
| ----------------- | -------------- |
| Arbitrum          | \$0.01         |
| Avalanche         | \$0.02         |
| Base              | \$0.01         |
| Ethereum          | \$1.00         |
| HyperEVM          | \$0.05         |
| OP                | \$0.0015       |
| Polygon PoS       | \$0.0015       |
| Sei               | \$0.001        |
| Solana            | \$0.15         |
| Sonic             | \$0.01         |
| Unichain          | \$0.001        |
| World Chain       | \$0.01         |

## Forwarding fees

When you use the
[Circle Forwarding Service](/gateway/references/forwarding-service) to handle
destination chain minting, Gateway charges an additional forwarding fee. The
forwarding fee has two parts:

* **Forwarding service fee**: A flat fee per transfer
* **Forwarding gas fee**: Covers the cost of executing the mint on the
  destination blockchain

The forwarding service fee is **\$0.05** per transfer on all destination
blockchains. The forwarding gas fee is approximately the same as the
[gas fee](#gas-fees) charged for a burn on the corresponding blockchain.

To estimate the forwarding fee before submitting a transfer, call the
[`/estimate`](/api-reference/gateway/all/estimate-transfer) endpoint with
`enableForwarder=true`. The returned `forwardingFee` value includes both the
service fee and the gas fee.

<Note>
  When the destination is Solana and
  [automatic Associated Token Account (ATA) creation](/gateway/references/forwarding-service#automatic-ata-creation-for-solana)
  is enabled, the forwarding fee also includes the Solana rent cost for the token
  account.
</Note>

For details on how the forwarding fee is collected across burn intents, see
[Fee collection](/gateway/references/forwarding-service#fee-collection) in the
Forwarding Service topic.

## Setting `maxFee`

When creating a [burn intent](/gateway/references/technical-guide#burn-intent),
set the `maxFee` field to cover the gas fee, the transfer fee, and any
forwarding fee:

```text theme={null}
maxFee ≥ gas fee + forwarding fee + (transfer amount * 0.00005)
```

For example, transferring 1,000 USDC from Base without forwarding:

* Gas fee: \$0.01
* Transfer fee: 1,000 \* 0.00005 = \$0.05
* Minimum `maxFee`: \$0.06 (60,000 in USDC subunits)

For the same transfer with the Forwarding Service enabled:

* Gas fee: \$0.01
* Forwarding fee: \$0.06 (service fee plus forwarding gas fee)
* Transfer fee: 1,000 \* 0.00005 = \$0.05
* Minimum `maxFee`: \$0.12 (120,000 in USDC subunits)

<Tip>
  Add a buffer to your `maxFee` calculation to account for gas fee fluctuations.
</Tip>

## Optimizing costs

To reduce overall costs:

* **Use low-cost source blockchains**: Keep the majority of your Gateway balance
  on blockchains with lower gas fees (such as OP, Polygon PoS, Sei, or Unichain)
* **Consolidate burn intents**: The gas cost of minting scales slower than
  multiple individual [CCTP](/cctp) transfers. Each additional burn intent adds
  approximately 60k gas to the mint transaction.
