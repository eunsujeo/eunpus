<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/27419996238620-USDC-Gateway-Overview
downloaded_at: 2026-08-11
original_pdf: 2026-08-11__support-fireblocks-io__usdc-gateway-overview.pdf
status: full
priority: TIER1
domain: Governance
extracted_with: pdftotext -layout (Stage 39 Mode C)
-->

# USDC Gateway Overview

26. 8. 11. 오후 12:55                                                  USDC Gateway Overview – Fireblocks Help Center


 USDC Gateway Overview
 4 min read

 USDC Gateway is a Fireblocks integration with Circle Gateway (https://www.circle.com/gateway) that gives
 your vault a single, unified USDC balance you can withdraw to any supported chain on demand,
 without pre-funding each chain individually.

      For full setup instructions, see the Console guide (https://support.fireblocks.io/hc/en-
      us/articles/27420202963612-USDC-Gateway-Prerequisites-and-Setup-Guide#h_01KREPP3EF0150YHSNHR6XF5FK) or
      the API guide (https://developers.fireblocks.com/docs/usdc-gateway).


      Beta feature: USDC Gateway is currently in beta and available through the Fireblocks API and
      Console. Behavior, endpoints, and limits may change. To request access, go to Labs
      (https://support.fireblocks.io/hc/en-us/articles/22235997516444-Fireblocks-Labs-Early-Access-Feature-Hub), or contact
      your Customer Success Manager (https://support.fireblocks.io/hc/en-us/requests/new?
      ticket_form_id=6947882197532).


 What is USDC Gateway?
 USDC Gateway connects your Fireblocks vault to Circle's cross-chain USDC infrastructure. Deposit
 USDC from any supported chain into a single consolidated balance, then withdraw to any Gateway-
 supported blockchain (https://support.fireblocks.io/hc/en-us/articles/27420202963612-USDC-Gateway-Prerequisites-and-
 Setup-Guide#h_01KTM72K9G6VQ9J2DN3SQHMAQW), regardless of where the funds originated. Fireblocks
 orchestrates the deposit, signing, and withdrawal flows end to end.
 Each vault account gets its own Gateway wallet. Deposits and withdrawals are standard Fireblocks
 transactions; they appear in your Transactions list, follow your Policy rules, trigger AML screening,
 and fire webhooks just like any other transfer. When you initiate a withdrawal, Fireblocks
 automatically selects which chain or chains to draw from to cover the amount while minimizing fees,
 based on your per-chain balances.

 When to use USDC Gateway
       Just-in-time liquidity. Keep one consolidated USDC balance and move funds to a specific
       chain only when a settlement, payout, or trade requires it.
       Chain-agnostic payouts. Accept the destination chain as a parameter at withdrawal time
       instead of holding USDC on every chain in advance.
       Reduce idle balances. Avoid splitting working capital across many chain-specific wallets.
https://support.fireblocks.io/hc/en-us/articles/27419996238620-USDC-Gateway-Overview                                          1/4


---

26. 8. 11. 오후 12:55                                                  USDC Gateway Overview – Fireblocks Help Center

 Activation
 Activation links a vault account to a USDC Gateway wallet. It's a configuration operation only; no
 funds move and no blockchain interaction occurs. Each wallet is scoped to the network type of your
 workspace (mainnet or testnet) and can be archived at any time. Archive blocks new deposits and
 withdrawals but does not affect any balance already held in Circle Gateway. Both operations are
 available via the API and the Console.

 Deposit automation
 The Deposit automation feature manages your USDC deposits to the Gateway, so you can focus on
 chain-agnostic withdrawals, drawing directly from your unified Gateway balance to a blockchain of
 your choice.
 When activating a Gateway wallet for a vault account, you can optionally enable the USDC deposit
 automation feature so that eligible deposit transactions are initiated automatically going forward,
 without requiring a manual trigger each time. If automation isn't enabled, deposits are initiated
 manually, either via the Console or the API.
 Automated deposits are triggered by a balance threshold, which you configure explicitly per vault
 account. A scheduler checks the vault's balance every 60 minutes by default; once the balance
 reaches your configured threshold, a deposit into the Gateway wallet is initiated automatically. The
 scheduler interval can be lowered via the API.
 When automation is enabled, deposit transactions are initiated by a dedicated service user called
 USDC Gateway Depositor. This initiator can only initiate transactions, but not sign them, so a
 designated signer is still required. Enabling the feature also requires a corresponding Policy rule; for
 the exact rule configuration, see Setting up policy rules for USDC Gateway
 (https://support.fireblocks.io/hc/en-us/articles/28897919442588-Setting-up-policy-rules-for-USDC-Gateway).

 Deposit
 A deposit moves USDC from a vault account on a specific chain into your unified Gateway balance.
 Deposits can be initiated via the Console from the USDC Gateway virtual asset wallet, or via the API.
 Contract approval
 The first time a deposit is initiated from a vault address on a given chain, Fireblocks automatically
 submits an Approve transaction to approve the Gateway smart contract to operate on that address.
 This approval transaction appears as a separate entry in your Transactions list. Once approved,
 subsequent deposits on the same chain proceed without an additional approval step.

 Balance
 Your Gateway balance is a single unified USDC balance held across Circle Gateway's smart contracts
 on all supported chains. You can view your total balance and per-chain breakdown either in the

https://support.fireblocks.io/hc/en-us/articles/27419996238620-USDC-Gateway-Overview                                  2/4


---

26. 8. 11. 오후 12:55                                                  USDC Gateway Overview – Fireblocks Help Center

 Console or via the Get Gateway wallet info API (https://developers.fireblocks.com/api-reference/vaults/get-circle-
 gateway-wallet-info).

 Withdrawal
 A withdrawal delivers USDC from your unified Gateway balance to any destination. Withdrawals can
 be initiated via the Console from the USDC Gateway virtual asset wallet, or via the API. You specify
 only the destination chain and amount, and Fireblocks automatically selects which chain to draw
 from based on your current Gateway balance.
 For fee details, see USDC Gateway: Prerequisites and setup guide (https://support.fireblocks.io/hc/en-
 us/articles/27420202963612-USDC-Gateway-Prerequisites-and-Setup-Guide#h_01KREPP3EF0150YHSNHR6XF5FK).

 Archive
 At any point, you can archive a Gateway wallet and withdraw all remaining funds to any destination.
 This can be done either via the API or from the Console. If deposit automation is enabled, archiving
 stops it immediately, and no further automated deposits are initiated.
 Archiving does not move funds on its own. If a Gateway wallet is archived while still holding a
 balance, that balance remains safely held in Circle Gateway, and archiving is fully reversible:
 reactivating the Gateway for the same vault account restores access to those funds.


https://support.fireblocks.io/hc/en-us/articles/27419996238620-USDC-Gateway-Overview                                  3/4


---

26. 8. 11. 오후 12:55                                                  USDC Gateway Overview – Fireblocks Help Center


      Related articles


           Verified Assets

           DeFi Earn

           Automation action failed: USD denomination is not supported for an asset

           Policy rule examples for On/Off-ramp orders

           Circle account

           Ethereal is now supported (January 2026)

           Mopay account

           On/Off-ramp orders overview


https://support.fireblocks.io/hc/en-us/articles/27419996238620-USDC-Gateway-Overview                                  4/4


---
