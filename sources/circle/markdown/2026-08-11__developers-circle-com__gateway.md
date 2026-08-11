<!--
source_url: https://developers.circle.com/gateway
downloaded_at: 2026-08-11
original_pdf: sources/circle/Circle Gateway - Circle Docs.pdf
status: full
priority: TIER1
domain: Bridge / Circle Gateway
extracted_with: pdftotext -layout (Stage 39 Mode C)
-->

# Circle Gateway

26. 8. 11. 오후 12:56                                            Circle Gateway - Circle Docs


             Gateway              Circle Gateway


     Gateway

                                                                                                 Copy page
     Circle Gateway


     Circle Gateway enables a unified USDC balance across multiple blockchains. Deposit USDC to
     non-custodial Gateway Wallet contracts on any supported source blockchain, then mint USDC
     instantly (<500 ms) on any destination blockchain using a single API call.

     Gateway is fully permissionless, and you can start integrating with it immediately with no sign-
     up needed. Check out the quickstart guides for EVM and Solana.


                Use Unified Balance Kit to simplify Gateway integrations.


                Unified Balance Kit handles deposit, transfer, and spend flows so you can build Gateway-powered
                features in just a few lines of code.


     Key features


           Unified crosschain balance                                Instant transfers


           Hold USDC across multiple blockchains                     Transfer USDC in under 500 ms after
           and access it as a single balance on any                  your balance is established, with no
           supported destination blockchain                          waiting for source blockchain finality


           Non-custodial                                             ERC-1271 contract signatures


           Retain full ownership of deposited                        Authorize transfers from smart
           USDC with signature-based                                 contracts and smart contract wallets
           authorization and a 7-day trustless                       with ERC-1271, without requiring a
           withdrawal option

https://developers.circle.com/gateway                                                                             1/4


---

26. 8. 11. 오후 12:56                                 Circle Gateway - Circle Docs

                                                          separate EOA delegate. See ERC-1271
                                                          programmable authorization.


     What you can build


     Gateway enables applications that require instant access to USDC across blockchains. Here are
     some common use cases:


                      Chain abstraction


                      Crosschain liquidity


                      Payment routing


                      Treasury management


                      Agentic commerce


     Get started


           Create and transfer a unified balance          Transfer from a smart contract account


           Build a script to deposit USDC on              Authorize Gateway transfers with ERC-
           multiple blockchains and transfer it           1271 using a Circle SCA
           instantly to a destination blockchain


           Set up webhooks                                Supported blockchains


           Receive real-time notifications for            View the blockchains where you can
           Gateway events on your registered              deposit and mint USDC with Gateway
           wallet addresses


https://developers.circle.com/gateway                                                                2/4


---

26. 8. 11. 오후 12:56                                                 Circle Gateway - Circle Docs

     Related products


     CCTP and Gateway offer different approaches to crosschain transfers. This table compares the
     two approaches.


       Attribute                        CCTP                                   Gateway


       Use case                         Transfer USDC from one                 Hold a unified USDC balance accessible on
                                        blockchain to another                  any supported blockchain

       Transfer speed                   Fast Transfer: ~8-20 seconds           Instant (<500 ms) after balance is
                                        Standard Transfer: 15-19 minutes       established
                                        (Ethereum/L2s)

       Balance model                    Point-to-point transfers               Unified crosschain balance

       Custody                          Non-custodial                          Non-custodial with 7-day trustless
                                                                               withdrawal option

       Supported                        View list                              View list

       blockchains


     Was this page helpful?                                                                            Yes            No


         CCTP chain domains V1
            Previous


                                                                                        Gateway supported blockchains
                                                                                                                    Next


        Legal                                                          Privacy


        Developer Terms                                                Privacy Policy

        Service Terms                                                  Cookie Policy


https://developers.circle.com/gateway                                                                                      3/4


---

26. 8. 11. 오후 12:56                     Circle Gateway - Circle Docs
        Acceptable Use                     Your Privacy Choices


        Support


        Help


https://developers.circle.com/gateway                                  4/4


---
