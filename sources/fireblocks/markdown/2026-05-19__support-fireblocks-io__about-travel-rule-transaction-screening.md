26. 5. 19. 오전 9:47                                               About Travel Rule transaction screening – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience

                                                                            Fireblocks Help Center Search the Help Center /



        Fireblocks Help Center              Identity & Compliance              Travel Rule: Notabene


        About Travel Rule transaction
        screening

            Note
            The Travel Rule integration is a premium, opt-in feature that requires an additional
            purchase. Contact your Customer Success Manager for more information.


        Overview
        Travel Rule transaction screening allows you to ensure you remain compliant with the Travel
        Rule through automated real-time monitoring of your crypto transactions. You can retrieve
        Travel Rule statuses on incoming and outgoing transactions by connecting your account to
        Notabene, a third-party partner that assists with Travel Rule compliance. The integration
        allows you to accept, reject, freeze, or send alerts for transactions in response to the
        information provided by Notabene.
        If the Anti-Money Laundering (AML) screening feature is enabled for your workspace, AML
        transaction screening takes place before Travel Rule transaction screening. Since different
        third-party integration partners perform AML screening, it requires an AML integration,
        which you can also ask your Customer Success Manager to enable for you.




https://support.fireblocks.io/hc/en-us/articles/21206799105308-About-Travel-Rule-transaction-screening                              1/5
26. 5. 19. 오전 9:47                                               About Travel Rule transaction screening – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience

                                                                            Fireblocks Help Center                                  /




                  3:09



        Transaction screening flow
        Outgoing




           1. You initiate a transaction in your Fireblocks workspace.
           2. Each transaction passes through your Travel Rule Transaction Screening Policy to
              determine whether it should then be sent to Notabene for Travel Rule screening. If
              you’re using the default Travel Rule Transaction Screening Policy, every transaction
              is sent for Travel Rule screening.

              If the outgoing transaction doesn’t contain a Travel Rule message, the transaction
              bypasses screening.
           3. If the transaction should be screened according to your policy, Fireblocks sends the
              transaction’s details to Notabene to check if it contains the information required for
              Travel Rule compliance. Fireblocks shares the following transaction information with
              Notabene:
                        Asset
                        Amount
https://support.fireblocks.io/hc/en-us/articles/21206799105308-About-Travel-Rule-transaction-screening                                  2/5
26. 5. 19. 오전 9:47                                               About Travel Rule transaction screening – Fireblocks Help Center

                          Origin address
                     Don't see what you're looking for? Log in for the full Help Center experience
                          Beneficiary address
                          Blockchain hash
                                                                            Fireblocks Help Center                                  /
           4. Notabene determines the transaction status based on whether it includes the data
              necessary for Travel Rule compliance and sends the status to your Fireblocks
              workspace.
           5. The integration approves, rejects, freezes, or sends alerts for the transaction based
              on its status and your Post-Screening Policy.
        You can view the screening information in your transaction log, audit log, and Notabene's
        interface for auditing by your compliance team.
        You can configure alerts to receive notifications when the transaction’s Travel Rule status
        becomes available from Notabene. After the screening, you can view the transaction
        information in the Fireblocks Console, via the Fireblocks API, or on your Notabene account.
        Learn how Notabene handles outgoing transactions flows.
        Incoming
           1. Fireblocks detects an incoming transaction to your workspace.
           2. After the transaction receives its first confirmation on the blockchain, the
              transaction passes through your Travel Rule Transaction Screening Policy to
              determine whether it should then be sent to Notabene for Travel Rule screening.
           3. If the transaction should be screened according to your policy, Fireblocks sends the
              transaction's details to Notabene to check if it contains the information required for
              Travel Rule compliance. If no Travel Rule message is included with the original
              incoming transaction, Fireblocks creates a blank Travel Rule message so the
              transaction can be screened.

               Fireblocks shares the following transaction information with Notabene:
                       Asset
                       Amount
                       Origin address
                       Beneficiary address
                       Blockchain hash
           4. Notabene determines the transaction status based on whether it includes the data
              necessary for Travel Rule compliance and sends the status to your Fireblocks
              workspace.
           5. The integration approves, rejects, freezes, or sends alerts for the transaction based
              on its status and your Post-Screening Policy.
        You can configure alerts to receive notifications when the transaction's Travel Rule status
        becomes available from Notabene. After the screening, you can view the transaction
https://support.fireblocks.io/hc/en-us/articles/21206799105308-About-Travel-Rule-transaction-screening                                  3/5
26. 5. 19. 오전 9:47                                               About Travel Rule transaction screening – Fireblocks Help Center

        information in the Fireblocks Console, via the Fireblocks API, or on your Notabene account.
               Don't see what you're looking for? Log in for the full Help Center experience
        Learn how Notabene handles incoming transaction flows.
                                                                            Fireblocks Help Center                                  /



        Unsupported routes
        The following transaction routes in Fireblocks are not subject to Travel Rule screening:
               Vault(s) ⇒ Vault(s)
               Vault(s) ⇒ Exchange(s)
               Gas Station ⇒ Vault(s)
               Non-custodial wallet(s) ⇒ Non-custodial wallet(s) in the same workspace



        Supported assets
        Notabene generally supports all assets listed on CoinGecko. Additionally, Fireblocks
        supports the subset of these assets listed in this table.

            Note
            You can also use the following testnet assets:
                     BTC_TEST (Bitcoin Test)
                     ETH_TEST4 (Ethereum Test Rinkeby)
                     XRP_TEST (Ripple Test)


        You can request support for screening additional assets that are part of Notabene’s list by
        submitting a request to Fireblocks Support. Make sure to list the specific assets you want
        to be supported.
        By default, incoming transfers from Fireblocks P2P Network connections have their
        screening status set to Unsupported Asset.



        Travel Rule screening statuses
        The following transaction statuses can appear for transactions in your workspace.
               Completed: Screening was completed successfully.
https://support.fireblocks.io/hc/en-us/articles/21206799105308-About-Travel-Rule-transaction-screening                                  4/5
26. 5. 19. 오전 9:47                                               About Travel Rule transaction screening – Fireblocks Help Center

               Pending: Screening is still in progress. You can choose whether to accept the
                   Don't see what you're looking for? Log in for the full Help Center experience
               pending transaction or wait until screening is complete. If you choose to wait, the
               transaction remains in Pending status for up to four hours or until the screening is
                                                     Fireblocks
               complete, whichever comes first. If the   status Help     changed after four hours, the /
                                                                      Center
                                                                 hasn’t
               screening is canceled.
               Rejected: Screening was rejected because the Virtual Asset Service Provider
               (VASP) does not have the destination address or the beneficiary VASP declined
               your request.
               Failed: Screening failed. Screenings can fail for various reasons, such as incomplete
               Travel Rule data or an internal server error.
               Blocking Time Expired: The amount of time defined for freezing and blocking
               transactions while waiting for a status has expired. The blocking time can be
               different for incoming and outgoing transactions depending on your advanced
               settings.
               Canceled: Screening was canceled. For outgoing transactions, you can choose
               whether to proceed with the transaction.



                                                              Was this article helpful?
                                                                        Yes             No

        ON THIS PAGE
              Overview
              Transaction screening flow
              Unsupported routes
              Supported assets
              Travel Rule screening statuses




      fireblocks.com           Status        API Docs          Console         info@fireblocks.com



      Fireblocks © 2026. All Rights Reserved. NMLS Registration Number: 2066055
      Privacy Policy



https://support.fireblocks.io/hc/en-us/articles/21206799105308-About-Travel-Rule-transaction-screening                              5/5
