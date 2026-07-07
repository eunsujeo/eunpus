26. 5. 19. 오전 9:46                                              AML Advanced Configuration settings – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience

                                                                          Fireblocks Help Center Search the Help Center /



        Fireblocks Help Center             Identity & Compliance             AML: Policies


        AML Advanced Configuration
        settings

            Note
            The AML integration is a premium feature that requires an additional purchase. Reach
            out to your Customer Success Manager if you do not have an agreement with an AML
            provider or you need help enabling the feature.


        Overview
        You can configure additional Anti-Money Laundering (AML) settings to protect your
        workspace and ensure uninterrupted operations. These settings apply to your workspace
        and are not dependent on the AML provider you choose to use.




https://support.fireblocks.io/hc/en-us/articles/8332157003676-AML-Advanced-Configuration-settings                              1/6
26. 5. 19. 오전 9:46                                              AML Advanced Configuration settings – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience

                                                                          Fireblocks Help Center                               /




        Setting descriptions
        Bypass screening during service outages (Skip on failure)
        By default, this setting is enabled. This helps you avoid AML provider outages by bypassing
        screening and accepting transactions received during the outage. This also bypasses
        screening when Fireblocks does not receive a valid screening result before the
        corresponding transaction delay elapses. In both cases, you can view the bypass reason on
        the Transaction History page.
        When screening is bypassed, outgoing transactions are sent, and incoming transactions are
        not frozen. Fireblocks continues polling your AML provider for screening results throughout
        the configured transaction delay period. If the delay expires without results and bypass is
        enabled, Fireblocks may continue polling in the background until the total polling time
        reaches 6 hours from when the transaction was registered. During background polling, the
        transaction has already been processed, but if screening results are received, the screening
        status is updated. Background polling only occurs if the configured delay is less than 6
        hours. Learn more about polling during delay periods.
        Disabling this setting deactivates the bypass, which means that all transactions screened
        during the outage, and all transactions that do not receive a valid screening result before
https://support.fireblocks.io/hc/en-us/articles/8332157003676-AML-Advanced-Configuration-settings                                  2/6
26. 5. 19. 오전 9:46                                              AML Advanced Configuration settings – Fireblocks Help Center

        the transaction delay elapses, fail automatically. Outgoing transactions are not sent, and
                Don't see what you're looking for? Log in for the full Help Center experience
        funds from incoming transactions are frozen.
        Admins can unfreeze transactions  frozenHelpbyCenter
                                      Fireblocks       the policy                                                              /

        By default, this setting is enabled. This allows Admin-level users to unfreeze funds
        associated with rejected incoming transactions. They can unfreeze the funds using the
        Console or the API.
        Disabling this setting prevents all users from unfreezing funds. You must submit a request
        to Fireblocks Support to unfreeze funds.
        Admins can initiate transactions that bypass policy rules
        By default, this setting is enabled. This allows Admin-level users to bypass rejection on
        outgoing transactions and send them.
        Disabling this setting prevents all users from bypassing rejection on outgoing transactions.
        You must submit a request to Fireblocks Support to bypass the rejection and send the
        transactions.
        Bypass transactions made through the Fireblocks P2P Network
        By default, this setting is disabled. This means that all transactions–even those initiated via
        the Fireblocks P2P Network–will be screened by your AML provider.
        Enabling this setting bypasses AML screening for all transactions initiated via the Fireblocks
        P2P Network.
        Inbound transaction delay
        By default, the Inbound Transaction Delay setting is set to 30 seconds. This means a
        screened incoming transaction stays locked in a pending state until your AML provider
        returns a screening result or until 30 seconds elapse. The maximum inbound transaction
        delay allowed is 7 days.

        Understanding active and background polling
        During the configured delay period, transactions remain in "pending screening" status while
        Fireblocks actively polls your AML provider for results (active polling). If the delay expires
        without results and bypass is enabled, the transaction proceeds, but Fireblocks may
        continue checking for results (background polling). If results arrive during background
        polling, the screening status is updated, but the transaction status does not change.
        Active polling continues for your entire configured delay period. If your delay is less than 6
        hours and bypass is enabled, background polling continues until 6 hours of total polling
        time is reached. If your delay is 6 hours or longer, no background polling occurs.


https://support.fireblocks.io/hc/en-us/articles/8332157003676-AML-Advanced-Configuration-settings                                  3/6
26. 5. 19. 오전 9:46                                              AML Advanced Configuration settings – Fireblocks Help Center


            NoteDon't see what you're looking for? Log in for the full Help Center experience
            If using Chainalysis V2, the default Inbound Transaction Delay setting is 10 minutes
            (600 seconds). This is because transaction     screening
                                                      Fireblocks Help can only start after the first
                                                                      Center                                                   /
            block has been confirmed and different types of assets have different confirmation
            times for the first block. In order to account for this variety, we recommend using a
            10-minute inbound transaction delay.

              If you receive a screening result within the defined time period, you can freeze the
              transaction’s funds before they become spendable if necessary. Remember, funds
              that have been spent or internally transferred cannot be frozen.
              If you do not receive a screening result within the defined time period:
                       And the transaction bypasses screening, the transaction’s funds
                       automatically release into the destination wallet address. You can then
                       freeze the funds using the API. Remember, funds manually frozen via the
                       API can only be unfrozen by using the API. If your configured delay is less
                       than 6 hours, Fireblocks continues polling in the background until total
                       polling time reaches 6 hours. If screening results are received during
                       background polling, the screening status is updated.
                       And the transaction doesn’t bypass screening, AML screening ceases and
                       the transaction’s funds are frozen.
        Outbound transaction delay
        By default, the Outbound Transaction Delay setting is set to 0 seconds. This means a
        screened outgoing transaction uses the immediate response from your AML provider
        before proceeding.
              If you receive a screening result within the defined time period, the transaction is
              accepted or rejected according to your AML Post-Screening Policy. You can cancel
              the transaction before it’s created if necessary.
              If you do not receive a screening result within the defined time period:
                       And the transaction bypasses screening, the transaction is sent. If your
                       configured delay is less than 6 hours, Fireblocks continues polling in the
                       background until total polling time reaches 6 hours. If screening results are
                       received during background polling, the screening status is updated.
                       And the transaction doesn’t bypass screening, AML screening ceases and
                       the transaction is not sent.
        You can change this value to be greater or less than the default setting. The maximum
        outbound transaction delay allowed is 90 minutes (5400 seconds). If you want to extend
        this limit, contact Customer Support to change your JWT lifetime limit.


https://support.fireblocks.io/hc/en-us/articles/8332157003676-AML-Advanced-Configuration-settings                                  4/6
26. 5. 19. 오전 9:46                                              AML Advanced Configuration settings – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience
        Default settings                                                                                                       /
                                                                          Fireblocks Help Center
        When your workspace has Transaction Screening enabled, it automatically uses the default
        Advanced Configuration settings. They are:
              Bypass screening during service outages (Skip on failure): On
              Admins can unfreeze transactions frozen by the policy: On
              Admins can initiate transactions that bypass policy rules: On
              Bypass transactions made through the Fireblocks P2P Network: Off
              Inbound transaction delay: 30 seconds (10 minutes if using Chainalysis V2)
              Outbound transaction delay: 0 seconds
        This means that your workspace:
              Bypasses transaction screening in the event of an AML provider service outage and
              when Fireblocks does not receive a valid screening result before the corresponding
              transaction delay elapses.
              Allows Admin-level users to unfreeze funds for rejected incoming transactions
              using the Console or Fireblocks API.
              Allows Admin-level users to bypass rejection for outgoing transactions using the
              Fireblocks Console.
              Screens transactions made through the Fireblocks P2P Network.
              Automatically locks screened incoming transactions until your AML provider returns
              a result or 30 seconds elapse (10 minutes if using Chainalysis V2).
              Uses the immediate screening response from your AML provider for your outgoing
              transactions.



                                                             Was this article helpful?
                                                                      Yes             No

        ON THIS PAGE
              Overview
              Setting descriptions
              Default settings


             Related Articles

https://support.fireblocks.io/hc/en-us/articles/8332157003676-AML-Advanced-Configuration-settings                                  5/6
26. 5. 19. 오전 9:46                                              AML Advanced Configuration settings – Fireblocks Help Center

                     Settings & Configuration
                     Don't see what you're looking for? Log in for the full Help Center experience
                     AML Transaction Screening & Monitoring
                     Set up a Chainalysis integration                     Fireblocks Help Center                               /

                     AML Transaction Screening Policy
                     Integrating third-party AML providers with your workspace
                     Configuring Solana Gasless transactions
                     Global Policy: How Fireblocks ensures OFAC sanctions compliance
                     Set up an Elliptic integration
                     Customer Reference ID
                     AML Post-Screening Policy
                     Transaction screening operations




      fireblocks.com          Status        API Docs         Console         info@fireblocks.com



      Fireblocks © 2026. All Rights Reserved. NMLS Registration Number: 2066055
      Privacy Policy




https://support.fireblocks.io/hc/en-us/articles/8332157003676-AML-Advanced-Configuration-settings                                  6/6
