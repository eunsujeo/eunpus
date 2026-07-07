26. 5. 19. 오전 9:47                                            Travel Rule Advanced Configuration settings – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience

                                                                            Fireblocks Help Center Search the Help Center /



        Fireblocks Help Center             Identity & Compliance              Travel Rule: Policies


        Travel Rule Advanced Configuration
        settings

            Note
            The Travel Rule integration is a premium, opt-in feature that requires an additional
            purchase. Contact your Customer Success Manager for more information.


        Overview
        You can configure additional Travel Rule settings to protect your workspace and ensure
        uninterrupted operations. These settings apply to your workspace and are not dependent
        on the Travel Rule provider you choose to use.




https://support.fireblocks.io/hc/en-us/articles/11232003438364-Travel-Rule-Advanced-Configuration-settings                           1/5
26. 5. 19. 오전 9:47                                            Travel Rule Advanced Configuration settings – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience

                                                                            Fireblocks Help Center                                   /




        Setting descriptions
        Bypass screening during service outages
        By default, this setting is enabled. This helps you avoid Travel Rule provider outages by
        bypassing screening and accepting transactions received during the outage. This also
        bypasses screening when Fireblocks does not receive a valid screening result before the
        corresponding transaction delay elapses. In both cases, you can view the bypass reason on
        the Transaction History page.
        When screening is bypassed, outgoing transactions will be sent and incoming transactions
        will not be frozen. Fireblocks will continue to request risk information for up to 6 hours from
        the time the transaction was registered. If risk information is received, the screening status
        will be updated for the transaction. However, if no risk information is received within 6
        hours, the screening will cease.
        Disabling this setting deactivates the bypass, which means that all transactions screened
        during the outage and all transactions that do not receive a valid screening result before
        the transaction delay elapses will fail automatically. Outgoing transactions will not be sent,
        and funds from incoming transactions will not be frozen.

https://support.fireblocks.io/hc/en-us/articles/11232003438364-Travel-Rule-Advanced-Configuration-settings                               2/5
26. 5. 19. 오전 9:47                                            Travel Rule Advanced Configuration settings – Fireblocks Help Center

        AdminsDon't
                canseeunfreeze
                       what you'retransactions
                                    looking for? Logfrozen
                                                     in for thebyfullthe
                                                                      Helppolicy
                                                                           Center experience
        By default, this setting is enabled. This allows Admin-level users to unfreeze funds
        associated with rejected incoming transactions.      TheyHelp
                                                      Fireblocks  canCenter
                                                                      unfreeze the funds using the                                   /
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
        the Fireblocks P2P Network–will be screened by your Travel Rule provider.
        Enabling this setting bypasses Travel Rule screening for all transactions initiated via the
        Fireblocks P2P Network.
        Inbound transaction delay
        By default, the Inbound transaction delay setting is set to 30 seconds. This means a
        screened incoming transaction stays locked in a pending state until your AML provider
        returns a screening result or until 30 seconds elapse.
               If you receive a screening result within the defined time period, you can freeze the
               transaction’s funds before they become spendable if necessary. Remember, funds
               that have been spent or internally transferred cannot be frozen.
               If you do not receive a screening result within the defined time period:
                        And the transaction bypasses screening, the transaction’s funds
                        automatically release into the destination wallet address. You can then
                        freeze the funds using the API. Remember, funds manually frozen via the
                        API can only be unfrozen by using the API. Fireblocks will continue to
                        request risk information for up to 6 hours from the time the transaction was
                        registered. If risk information is received, the screening status will be
                        updated for the transaction. However, if no risk information is received
                        within 6 hours, the screening will cease.
                        And the transaction doesn’t bypass screening, Travel Rule screening ceases
                        and the transaction’s funds are frozen.


https://support.fireblocks.io/hc/en-us/articles/11232003438364-Travel-Rule-Advanced-Configuration-settings                               3/5
26. 5. 19. 오전 9:47                                            Travel Rule Advanced Configuration settings – Fireblocks Help Center

        You can change this value to be greater or less than 30 seconds. The maximum inbound
                Don't see what you're looking for? Log in for the full Help Center experience
        transaction delay allowed is seven days.
        Outbound transaction delay                                          Fireblocks Help Center                                   /

        By default, the Outbound Transaction Delay setting is set to 0 seconds. This means a
        screened outgoing transaction uses the immediate response from your Travel Rule provider
        before proceeding.
               If you receive a screening result within the defined time period, the transaction is
               accepted or rejected according to your AML Post-Screening Policy. You can cancel
               the transaction before it’s created if necessary.
               If you do not receive a screening result within the defined time period:
                        And the transaction bypasses screening, the transaction is sent. Fireblocks
                        will continue to request risk information for up to 6 hours from the time the
                        transaction was registered. If risk information is received, the screening
                        status will be updated for the transaction. However, if no risk information is
                        received within 6 hours, the screening will cease.
                        And the transaction doesn’t bypass screening, AML screening ceases and
                        the transaction is not sent.
        You can change this value to be greater or less than the default setting. The maximum
        outbound transaction delay allowed is 90 minutes (5400 seconds). If you want to extend
        this limit, contact Customer Support to change your JWT lifetime limit.



        Default settings
        When your workspace has the Travel Rule integration enabled, it automatically uses the
        default Advanced Configuration settings. They are:
               Bypass screening during service outages: On
               Admins can unfreeze transactions frozen by the policy: On
               Admins can initiate transactions that bypass policy rules: On
               Bypass transactions made through the Fireblocks P2P Network: Off
               Inbound transaction delay: 30 seconds
               Outbound transaction delay: 0 seconds
        This means your workspace will:
               Bypass transaction screening in the event of a Notabene outage, when Fireblocks
               does not receive a valid screening result before the corresponding blocking timeout
               elapses, or both.
               Allow Admin-level users to unfreeze funds for rejected incoming transactions using
               the Console or the Fireblocks API.
https://support.fireblocks.io/hc/en-us/articles/11232003438364-Travel-Rule-Advanced-Configuration-settings                               4/5
26. 5. 19. 오전 9:47                                            Travel Rule Advanced Configuration settings – Fireblocks Help Center

               Allow Admin-level users to bypass rejection for outgoing transactions using the
                   Don't see what you're looking for? Log in for the full Help Center experience
               Fireblocks Console.
               Screen transactions made through the Fireblocks P2P Network.
               Automatically lock screened incoming  Fireblocks Help Center
                                                        transactions   for 30 seconds. These       /
               transactions remain in Pending status until the screening completes. If the defined
               time expires and no status has been received, the transaction adheres to your Post-
               Screening Policy actions defined for transactions in Blocking Time Expired status.
               Automatically lock screened outgoing transactions until you receive a screening
               result from Notabene. These transactions remain in Pending status until the
               screening completes.



        Custom settings
        To define custom advanced configuration settings tailored to your business and risk
        strategy, navigate to the Fireblocks Console and go to: Compliance > Travel Rule > [Your
        Travel Rule Provider] > Policy Editor > Settings.



                                                              Was this article helpful?
                                                                       Yes              No

        ON THIS PAGE
              Overview
              Setting descriptions
              Default settings
              Custom settings




      fireblocks.com           Status        API Docs         Console         info@fireblocks.com



      Fireblocks © 2026. All Rights Reserved. NMLS Registration Number: 2066055
      Privacy Policy


https://support.fireblocks.io/hc/en-us/articles/11232003438364-Travel-Rule-Advanced-Configuration-settings                           5/5
