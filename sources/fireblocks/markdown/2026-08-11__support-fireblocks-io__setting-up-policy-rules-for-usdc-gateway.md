<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/28897919442588-Setting-up-policy-rules-for-USDC-Gateway
downloaded_at: 2026-08-11
original_pdf: 2026-08-11__support-fireblocks-io__setting-up-policy-rules-for-usdc-gateway.pdf
status: full
priority: TIER1
domain: Governance
extracted_with: pdftotext -layout (Stage 39 Mode C)
-->

# Setting up policy rules for USDC Gateway

26. 8. 11. 오후 12:57                                            Setting up policy rules for USDC Gateway – Fireblocks Help Center


 Setting up policy rules for USDC Gateway
 2 min read

 Without the correct policy rules in place, USDC Gateway deposits might get blocked by Fireblocks’s
 policy, even if your Gateway is properly activated. This article walks you through setting up the exact
 rules required, based on your workspace configuration.
 Withdrawals
 Withdrawals from a Gateway-activated vault to any destination adhere to the same policy rules as
 any standard transfer in Fireblocks. No special configuration is required beyond your existing
 withdrawal rules.


 Deposits
 The first deposit for each USDC-supported blockchain involves two transactions:
       Approve: a one-time on-chain approval per blockchain that allows the USDC contract to
       interact with the Gateway.
       Transfer: the actual USDC deposit into the Gateway.
 The exact configuration depends on your workspace policy setup and whether the deposit
 automation feature is enabled. When it is enabled, you will also need a dedicated policy rule with the
 initiator set to a service user called USDC Gateway Depositor.

      Note: whichever configuration applies to you, the USDC Gateway Depositor can only initiate a
      transaction, but not sign one. Any rule involving it must designate a separate user with signing
      privileges for this purpose, or automated deposit transactions will fail with a blocked by policy
      verdict.

 If the Gateway deposit automation feature is configured (upon activation)

 We recommend enabling deposit automation so Gateway deposits are initiated automatically rather
 than requiring manual action. If it is enabled on your workspace, add a dedicated policy rule in
 addition to whichever of the rules below apply to your address policy setup:
       Initiator: set to USDC Gateway Depositor.
       Source and Destination: include the vaults where Gateway is activated.
https://support.fireblocks.io/hc/en-us/articles/28897919442588-Setting-up-policy-rules-for-USDC-Gateway                            1/4


---

26. 8. 11. 오후 12:57                                            Setting up policy rules for USDC Gateway – Fireblocks Help Center

       Signer: designate a user with signing privileges for the rule (since the USDC Gateway
       Depositor cannot sign transactions).
 Without these settings, automated deposit transactions will fail with a blocked by policy verdict
 even if your other rules are correct.


 Setting up deposit rules
 If One Time Address (OTA) is enabled
 Make sure you have a vault-to-vault rule for any Gateway-activated vault(s):
       An Approve rule
       A Transfer rule

 If transaction to a whitelisted Address is preferred
 Add two rules instead:
       Approve rule: whitelist the Gateway contract address for every USDC blockchain you aim to
       interact with (see tables below).


https://support.fireblocks.io/hc/en-us/articles/28897919442588-Setting-up-policy-rules-for-USDC-Gateway                            2/4


---

26. 8. 11. 오후 12:57                                            Setting up policy rules for USDC Gateway – Fireblocks Help Center


   To whitelist a USDC contract from the Fireblocks console:
       Go to Whitelisted Addresses in the left panel
       Select Add > Whitelisted Address Wallet (Type can be Internal or External)
       Add the required USDC contracts and asset IDs (see tables below)
       Approve all whitelisted addresses per your workspace's admin quorum
       Add the whitelisted address wallet to your policy rule to allow USDC Gateway deposits
       Transfer rule: a standard vault-to-vault transfer rule from the Gateway-activated vault to the
       Gateway destination. Note that when deposit automation is used, the initiator of this
       transaction is the USDC Gateway Depositor service user.
 Mainnet USDC Gateway Assets
 The Mainnet USDC Gateway Contract Address to whitelist:
 0x77777777Dcc4d5A8B6E418Fd04D8997ef11000eE

 For a table of the supported Mainnet assets, see here (https://support.fireblocks.io/hc/en-
 us/articles/27420202963612-USDC-Gateway-Prerequisites-and-Setup-Guide#h_01KREPP3E4KPT0ZC2VDMAQKWJ4).

 Testnet USDC Gateway Assets
 The Testnet USDC Gateway Contract Address to whitelist:
 0x0077777d7EBA4688BDeF3E311b846F25870A19B9

 For a table of the supported Testnet assets, see here (https://support.fireblocks.io/hc/en-
 us/articles/27420202963612-USDC-Gateway-Prerequisites-and-Setup-Guide#h_01KREPP3EA18TPP7DR48N8PATK).


https://support.fireblocks.io/hc/en-us/articles/28897919442588-Setting-up-policy-rules-for-USDC-Gateway                            3/4


---

26. 8. 11. 오후 12:57                                            Setting up policy rules for USDC Gateway – Fireblocks Help Center


      Related articles


            USDC Gateway: Prerequisites and Setup Guide

            USDC Gateway Overview

            Travel Rule Transaction Screening Policy

            Policy rules for swap orders

            Typed Message policy rules

            Policy rules for automation actions

            Policy rules for Solana program calls

            Policy rules for minting and burning tokens


https://support.fireblocks.io/hc/en-us/articles/28897919442588-Setting-up-policy-rules-for-USDC-Gateway                            4/4


---
