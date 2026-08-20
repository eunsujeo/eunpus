<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/27420202963612-USDC-Gateway-Prerequisites-and-Setup-Guide
downloaded_at: 2026-08-11
original_pdf: 2026-08-11__support-fireblocks-io__usdc-gateway-prerequisites-and-setup-guide.pdf
status: full
priority: TIER1
domain: Governance
extracted_with: pdftotext -layout (Stage 39 Mode C)
-->

# USDC Gateway: Prerequisites and Setup Guide

26. 8. 11. 오후 12:56                                         USDC Gateway: Prerequisites and Setup Guide – Fireblocks Help Center


 USDC Gateway: Prerequisites and Setup
 Guide
 5 min read

 This guide covers prerequisites, activation, and your first deposit and withdrawal via the Fireblocks
 Console. All functionality is also available via the API — see the API guide
 (https://developers.fireblocks.com/docs/usdc-gateway). For flow details, see USDC Gateway Overview
 (https://support.fireblocks.io/hc/en-us/articles/27419996238620-USDC-Gateway-Overview).


      Beta feature: USDC Gateway is currently in Beta mode and is available via the Fireblocks
      Console. To request access, go to Labs (https://support.fireblocks.io/hc/en-us/articles/22235997516444-
      Fireblocks-Labs-Early-Access-Feature-Hub), or contact your Customer Success Manager
      (https://support.fireblocks.io/hc/en-us/requests/new?ticket_form_id=6947882197532).


 Prerequisites

   Prerequisite                                                                       Details

                         You should have both an Approve policy rule and a Transfer rule enabled for deposits to the gateway. The
                          Approve policy rule is intended for the first approval transaction from the vault account to the gateway
    Pre-defined            wallet. If deposit automation is enabled, a rule with the initiator set to the USDC Gateway Depositor
    Policy rules                         service user is also required. See Setting up policy rules for USDC Gateway
                          (https://support.fireblocks.io/hc/en-us/articles/28897919442588-Setting-up-policy-rules-for-USDC-
                                                                           Gateway).

                            A vault account exists to host the Gateway wallet. Each Gateway wallet is bound to exactly one vault
   Vault account
                                                                         account.

    USDC asset
                                         The vault account has at least one USDC asset wallet with a generated address.
      wallets

                        The vault account holds enough native gas (e.g. ETH on Ethereum, MATIC on Polygon) on every chain you
     Native gas           plan to deposit from, unless Gas Station or Universal Gasless is configured for the workspace, in which
      balance           case gas is covered automatically. Withdrawals do not require source-chain gas; Circle covers it and bills it
                                                                 to your Gateway balance.


 Step 1: Activate the Gateway wallet
 Activate via the Console


https://support.fireblocks.io/hc/en-us/articles/27420202963612-USDC-Gateway-Prerequisites-and-Setup-Guide                               1/7


---

26. 8. 11. 오후 12:56                                         USDC Gateway: Prerequisites and Setup Guide – Fireblocks Help Center

 Activation creates the Gateway wallet which is bound to the vault account. No funds move. You can
 enable deposit automation at this stage. See Deposit automation below.
 To activate, select the three-dots menu on any vault or USDC asset wallet and select Activate
 Gateway wallet.
 Deposit automation
 Instead of initiating deposits manually, you can now enable deposit automation so that eligible
 deposits are initiated automatically once your vault's balance on a given chain reaches a threshold
 you configure per vault account. A scheduler checks the balance every 60 minutes by default; this
 interval is configurable via API.
 This is set up during the activation flow: a toggle for deposit automation appears at the activation
 stage, and it's on by default.
 Automated deposits are initiated by a dedicated service user, USDC Gateway Depositor, which can
 only initiate transactions, but not sign them. A designated signer is also required, along with a
 corresponding Policy rule. The exact policy setup can be found here: Setting up policy rules for
 USDC Gateway (https://support.fireblocks.io/hc/en-us/articles/28897919442588-Setting-up-policy-rules-for-USDC-Gateway).

 Step 2: Deposit USDC into Gateway
 The first deposit from a vault address on a given chain triggers an automatic Approve transaction for
 Gateway smart contract approval. If your workspace policies don't already cover this, follow the
 policy setup guide for USDC Gateway (https://support.fireblocks.io/hc/en-us/articles/28897919442588-Setting-up-
 policy-rules-for-USDC-Gateway) to configure the required Approve rule. Once approved, subsequent
 deposits on the same chain proceed without an additional approval step.
 Deposit via the Console
 To deposit, navigate to the USDC Gateway virtual asset wallet record and initiate the deposit from
 there. If deposit automation is enabled, eligible deposits are initiated automatically and this manual
 step is not required.

 Step 3: Withdraw USDC from Gateway
 The destination can be anything — a Fireblocks vault account, a one-time address, or a whitelisted
 address. You specify only the destination chain, destination address, and amount; Fireblocks
 automatically selects which chain to draw from based on your current Gateway balance.
 Withdraw via the Console
 To withdraw, navigate to the USDC Gateway virtual asset wallet record and initiate the withdrawal
 from there.

 Check your Gateway balance

https://support.fireblocks.io/hc/en-us/articles/27420202963612-USDC-Gateway-Prerequisites-and-Setup-Guide                          2/7


---

26. 8. 11. 오후 12:56                                         USDC Gateway: Prerequisites and Setup Guide – Fireblocks Help Center


      Note: Gateway balance may be delayed depending on Circle's required block confirmations
      per chain. See Circle's supported blockchain reference
      (https://developers.circle.com/gateway/references/supported-blockchains#required-block-confirmations) for details.


 View balance breakdown via the Console
 To see your total balance and per-chain breakdown, select the "i" icon next to the USDC Gateway
 virtual asset wallet in the vault view.

 Manage your Gateway wallet settings
 Select the $ icon on the USDC Gateway virtual asset wallet to open the USDC Gateway settings
 modal for that vault. From here, you can update the vault's deposit automation configuration or
 archive its Gateway wallet.
 Archiving via the Console
 Archiving stops the Gateway wallet from accepting new deposits or withdrawals. It does not move
 funds — any USDC already held in Circle Gateway remains in place and becomes accessible again if
 you reactivate. If deposit automation was enabled, archiving stops it immediately, with no further
 automated deposits initiated.

 Supported chains
 The set of supported chains may expand during Beta phase.
 Mainnet USDC Gateway assets


https://support.fireblocks.io/hc/en-us/articles/27420202963612-USDC-Gateway-Prerequisites-and-Setup-Guide                          3/7


---

26. 8. 11. 오후 12:56                                         USDC Gateway: Prerequisites and Setup Guide – Fireblocks Help Center


                Chain                                  Fireblocks asset ID

  Arbitrum                              USDC_ARB_3SBJ


  Avalanche                             USDC_AVAX


  Base                                  USDC_BASECHAIN_ETH_5I5C


  Ethereum                              USDC


  HyperEVM                              USDC_B64VHHFG_XX2F


  OP Mainnet                            USDC_OPT_9T08


  Polygon PoS                           USDC_POLYGON_NXTB


  Sei                                   USDC_B68NGGMY_YSEF


  Sonic                                 USDC_E_B7GKLA1Z_TQ94


  Unichain                              USDC_B7V9C52Z_CYWP


  World Chain                           USDC_E_B7DRHSD9_OINX


 Testnet USDC Gateway assets


https://support.fireblocks.io/hc/en-us/articles/27420202963612-USDC-Gateway-Prerequisites-and-Setup-Guide                          4/7


---

26. 8. 11. 오후 12:56                                         USDC Gateway: Prerequisites and Setup Guide – Fireblocks Help Center


                 Chain                                      Fireblocks asset ID

  Arbitrum (Sepolia)                      USDC_ARB_SEPOLIA_V84S


  Arc                                     USDC_ARC_TEST_G5EN


  Avalanche (Fuji)                        USDC_AVAX_FUJI


  Base (Sepolia)                          USDC_BASECHAIN_ETH_TEST5_8SH8


  Ethereum (Sepolia)                      USDC_ETH_TEST5_0GER


  HyperEVM                                USDC_B6RLTAMC_VKLF


  OP Mainnet (Sepolia)                    USDC_OPT_SEPOLIA_AZBE


  Polygon PoS (Amoy)                      USDC_AMOY_POLYGON_TEST_7WWV


  Sei                                     USDC_B72Z7SP0_XAWM


  Sonic                                   USDC_B64G796G_SXBE


  Unichain (Sepolia)                      USDC_B6Y9TTZY_0809


  World Chain (Sepolia)                   USDC_B6YDJ0HK_6UDW


 Limits
 No minimum or maximum deposit or withdrawal amount is enforced at the Fireblocks layer. If Circle
 Gateway rate-limits an operation on its side, the transaction will fail with the error surfaced from
 Circle.

 Fees
 Withdrawals incur the following fees, charged in USDC against your Gateway balance:


https://support.fireblocks.io/hc/en-us/articles/27420202963612-USDC-Gateway-Prerequisites-and-Setup-Guide                          5/7


---

26. 8. 11. 오후 12:56                                         USDC Gateway: Prerequisites and Setup Guide – Fireblocks Help Center


         Fee                                                                          Amount

   Circle transfer
                                                                      0.005% of the withdrawal amount
        rate

    Withdrawal
   Source-chain                                    Variable — quoted by Circle per source chain at withdrawal time
       gas

                            Circle's Forwarding Service (https://developers.circle.com/gateway/references/forwarding-service)
    Withdrawal
                          covers destination-chain gas and delivery for the withdrawal. Its fee is deducted directly from the USDC
  forwarding fee
                                          delivered on the destination chain, in addition to the Circle transfer rate.


 Deposits incur only the standard source-chain gas fee. This is paid from the vault account's native
 gas balance, unless Gas Station or Universal Gasless is enabled, in which case gas is covered
 automatically. There is no Fireblocks-side or Circle-side fee for deposits.
 Fees are set by Circle Gateway and may change. For the current fee schedule, refer to Circle's
 documentation (https://developers.circle.com/gateway).


https://support.fireblocks.io/hc/en-us/articles/27420202963612-USDC-Gateway-Prerequisites-and-Setup-Guide                            6/7


---

26. 8. 11. 오후 12:56                                         USDC Gateway: Prerequisites and Setup Guide – Fireblocks Help Center


      Related articles


           USDC Gateway Overview

           Setting up policy rules for USDC Gateway

           Automation action failed: USD denomination is not supported for an asset

           Mopay account

           CloudFormation template for API Co-signers on AWS Nitro

           Setting up Travel Rule integration

           On/Off-ramp orders overview

           Boost or drop a stuck EVM-based transaction


https://support.fireblocks.io/hc/en-us/articles/27420202963612-USDC-Gateway-Prerequisites-and-Setup-Guide                          7/7


---
