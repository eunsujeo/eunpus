26. 5. 19. 오전 9:45                                Global Policy: How Fireblocks ensures OFAC sanctions compliance – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience

                                                                          Fireblocks Help Center Search the Help Center /



        Fireblocks Help Center            Identity & Compliance             About Compliance


        Global Policy: How Fireblocks
        ensures OFAC sanctions compliance
        Overview
        Fireblocks blocks outbound transactions to wallet addresses that are sanctioned by the U.S.
        Department of the Treasury’s Office of Foreign Assets Control (OFAC). Fireblocks’ Legal
        and Compliance team subscribes to OFAC’s public Specially Designated Nationals (SDN)
        list updates and adds OFAC-sanctioned addresses to our backend systems to block
        outgoing transactions to those addresses.
        You can familiarize yourself with OFAC’s sanctions program on OFAC’s FAQ page, including
        its 2022 guidance related to Tornado Cash. All sanctioned addresses linked to Tornado
        Cash are on OFAC’s SDN list and have been added to the Fireblocks backend system as
        blocked addresses.



        Blocking of outgoing transfers to sanctioned
        addresses
        When you submit a transfer request to a deposit address that is flagged on OFAC’s SDN list
        of sanctioned parties, Fireblocks will recognize the address from the corresponding list we
        update in our backend and automatically block the transfer.
        The Fireblocks Policy Engine first checks your submitted transfer against the list in our
        backend, even before checking it against your Policy rules. You can read more about the
        transaction flow for outgoing transfers here.
        When a transaction is blocked because the destination is a sanctioned deposit address,
        your transaction will fail. The reason for the failure message looks slightly different if you
        are using the Console or API.
https://support.fireblocks.io/hc/en-us/articles/6312767745820-Global-Policy-How-Fireblocks-ensures-OFAC-sanctions-compliance                 1/4
26. 5. 19. 오전 9:45                                Global Policy: How Fireblocks ensures OFAC sanctions compliance – Fireblocks Help Center


              Don't see what you're looking for? Log in for the full Help Center experience
        When you attempt to transfer to a sanctioned address through the Fireblocks Console:
              In your transaction panel, the failed transaction willCenter
                                                    Fireblocks Help  show:                                                                   /
                       Reason: Blocked by Policy
              In your transaction history, it will show:
                       Main status: BLOCKED
                       Sub-status: Blocked By Policy
        When you attempt to transfer to a sanctioned address through Fireblocks API:
              The response of the transaction details at your relevant endpoint will show:
                      Status field: BLOCKED
                      subStatus field: BLOCKED_BY_POLICY



        Blocking incoming transfers from sanctioned
        addresses
        While it is not possible to prevent receiving an incoming transaction to your wallet due to
        the nature of the blockchain, you can take steps to remain compliant if you receive funds
        from a sanctioned address.
        You can freeze funds received from sanctioned addresses or isolate them based on your
        internal compliance policies. Fireblocks recommends deploying a KYT/AML solution (we
        have native integrations with Chainalysis and Elliptic) that can automatically detect such
        high-risk transactions and take appropriate action based on your policies.



        How can I check if an address is sanctioned by
        OFAC?
        OFAC’s Specially Designated Nationals (SDN) database is public. You can download the
        latest list any time and search for an address.



        LEGAL DISCLAIMER

https://support.fireblocks.io/hc/en-us/articles/6312767745820-Global-Policy-How-Fireblocks-ensures-OFAC-sanctions-compliance                     2/4
26. 5. 19. 오전 9:45                                Global Policy: How Fireblocks ensures OFAC sanctions compliance – Fireblocks Help Center


                  Don't see what you're looking for? Log in for the full Help Center experience
            Important
            While Fireblocks maintains compliance with US OFAC (as defined above) sanctions as
            stated, each customer must comply with      all applicable
                                                     Fireblocks        export controls and trade
                                                                 Help Center                     /
            sanctions laws, rules, and regulations. Attempts to send assets to sanctioned
            addresses violate the Fireblocks Master Services Agreement ("Agreement") and may
            result in the termination of your agreement. Fireblocks takes no responsibility for
            customers' sanctions compliance. It is each customer's obligation to comply with
            their jurisdiction's laws.




                                                            Was this article helpful?
                                                                     Yes              No

        ON THIS PAGE
              Overview
              Blocking of outgoing transfers to sanctioned addresses
              Blocking incoming transfers from sanctioned addresses
              How can I check if an address is sanctioned by OFAC?
              LEGAL DISCLAIMER


             Related Articles
                     Set up an Elliptic integration
                     Customer Reference ID
                     AML Post-Screening Policy
                     AML Advanced Configuration settings
                     AML Transaction Screening & Monitoring
                     Set up a Chainalysis integration
                     AML Transaction Screening Policy




https://support.fireblocks.io/hc/en-us/articles/6312767745820-Global-Policy-How-Fireblocks-ensures-OFAC-sanctions-compliance                 3/4
26. 5. 19. 오전 9:45                                Global Policy: How Fireblocks ensures OFAC sanctions compliance – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience
      fireblocks.com          Status        API Docs         Console        info@fireblocks.com                                              /
                                                                          Fireblocks Help Center


      Fireblocks © 2026. All Rights Reserved. NMLS Registration Number: 2066055
      Privacy Policy




https://support.fireblocks.io/hc/en-us/articles/6312767745820-Global-Policy-How-Fireblocks-ensures-OFAC-sanctions-compliance                     4/4
