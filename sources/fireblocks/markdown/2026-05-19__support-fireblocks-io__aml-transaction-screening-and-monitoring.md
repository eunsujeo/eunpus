26. 5. 19. 오전 9:45                                            AML Transaction Screening & Monitoring – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience

                                                                          Fireblocks Help Center Search the Help Center /



        Fireblocks Help Center             Identity & Compliance             Anti-Money Laundering            AML: Overview


        AML Transaction Screening &
        Monitoring

            Note
               The AML integration is a premium feature that requires an additional purchase.
               Reach out to your Customer Success Manager if you do not have an
               agreement with an AML provider or you need help enabling the feature.
               Fireblocks is a US-based company and, as such, is subject to the Office of
               Foreign Assets Control (OFAC) sanctions and restrictions. Therefore, we are
               obligated to block all restricted addresses under OFAC on our system.



        Overview
        Since privacy is a key principle of blockchain technology, transactions on the blockchain do
        not contain any information about the people or organizations involved. However, criminals
        may try to use this anonymity to hide illicit fund transfers. To prevent funds from being sent
        to criminals or sanctioned parties, regulators in many jurisdictions have begun mandating
        the collection of personal data for users transacting on the blockchain.
        The Fireblocks AML feature allows you to automate real-time monitoring of your crypto
        transactions in order to ensure compliance with Anti-Money Laundering/Counter Financing
        of Terrorism (AML/CFT) regulations, prevent interactions with sanctioned entities, and
        identify customer behavior. You can integrate your Fireblocks account with Chainalysis or
        Elliptic, our third-party transaction monitoring providers, to retrieve AML/CFT information
        on your incoming and outgoing transactions. You can also implement your own custom
        screening logic for AML providers that are not natively supported.

            Note
https://support.fireblocks.io/hc/en-us/articles/360014290380-AML-Transaction-Screening-Monitoring                               1/8
26. 5. 19. 오전 9:45                                            AML Transaction Screening & Monitoring – Fireblocks Help Center

            You can only have one AML provider integrated with your workspace at a given time.
                 Don't see what you're looking for? Log in for the full Help Center experience
            To change AML providers, contact Fireblocks support.
                                                                          Fireblocks Help Center                                /
        In either case, your AML provider analyzes your transactions in real time and screens them
        based on the policy you create. The provider then returns a risk profile based on the
        transaction details (including addresses). You can approve, reject, or receive alerts for
        transactions in response to the provided risk information.
        You, the transaction owner, are responsible for compliance reporting. Fireblocks and the
        AML provider make reporting easy with auditable risk information available for export. In the
        event of a risky transaction in a jurisdiction that requires reporting, your compliance officer
        will need to file any regulatory requirements with the appropriate authorities.




        Benefits of AML Transaction Screening
              Set AML policies according to your compliance strategy
              Continuously monitor and stay up-to-date on risk information (AML/CFT and
              sanctions risk)
              Automatically register transactions with your transaction monitoring provider
              Automatically freeze risky inbound transactions
              Manually freeze and unfreeze transactions via the API
              Automatically prevent risky outbound transactions
              View risk information on your mobile device prior to authorizing outbound
              transactions
              Automatically associate customers with transactions using User IDs (optional)
              Access auditable risk information via the UI and API
              View and export auditable risk information for compliance and regulatory purposes




https://support.fireblocks.io/hc/en-us/articles/360014290380-AML-Transaction-Screening-Monitoring                                   2/8
26. 5. 19. 오전 9:45                                            AML Transaction Screening & Monitoring – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience
        Transaction screening flow                                                                                              /
                                                                          Fireblocks Help Center
        Outgoing




          1. You initiate a transaction in your Fireblocks workspace.
          2. The transaction passes through your AML Transaction Screening Policy to
             determine whether it should then be sent to your AML provider for screening.
          3. If the transaction should be screened according to your policy, Fireblocks sends the
             transaction’s details to the provider to receive the transaction’s risk information and
             to be registered for further monitoring. Fireblocks shares the following transaction
             information with your AML provider:
                       Asset
                       Amount
                       Origin address
                       Beneficiary address
                       Blockchain hash
          4. Your AML provider determines the transaction’s risk score and sends the result to
             your Fireblocks workspace. Learn how Fireblocks handles outgoing transactions
             when risk scores are not available immediately.
          5. The integration approves or rejects the transaction based on its risk information and
             your Post-Screening Policy.
https://support.fireblocks.io/hc/en-us/articles/360014290380-AML-Transaction-Screening-Monitoring                                   3/8
26. 5. 19. 오전 9:45                                            AML Transaction Screening & Monitoring – Fireblocks Help Center

        You can configure your Post-Screening Policy so that you receive alerts when the
                Don't see what you're looking for? Log in for the full Help Center experience
        transaction’s risk information becomes available from your AML provider. After the
        screening, recorded information can be viewed in your Transaction History, the Audit Log,
                                                    Fireblocks
        and your provider’s interface for auditing by          Help Center
                                                       your compliance  team.                     /



            Note
            If an outgoing transaction contains multiple destinations, each destination is
            screened individually. However, the entire transaction is approved or rejected based
            on the destination with the highest risk score. For example, if one destination receives
            a risk score that would be rejected based on your Post-Screening Policy, then the
            entire transaction is rejected.


        Incoming




          1. Fireblocks detects an incoming transaction to your workspace.
          2. After the transaction receives its first confirmation on the blockchain, the
             transaction passes through your AML Transaction Screening Policy to determine
             whether it should then be sent to your AML provider for screening.

https://support.fireblocks.io/hc/en-us/articles/360014290380-AML-Transaction-Screening-Monitoring                               4/8
26. 5. 19. 오전 9:45                                            AML Transaction Screening & Monitoring – Fireblocks Help Center

          3. If the transaction should be screened according to your policy, Fireblocks sends the
                 Don't see what you're looking for? Log in for the full Help Center experience
             transaction’s details to the provider to receive the transaction’s risk information and
             to be registered for further monitoring. Fireblocks shares the following transaction
             information with your AML provider: Fireblocks Help Center                            /
                       Asset
                       Amount
                       Origin address
                       Beneficiary address
                       Blockchain hash
          4. Your AML provider determines the transaction’s risk score and sends the result to
             your Fireblocks workspace. Learn how Fireblocks handles incoming transactions
             when risk scores are not available immediately.
          5. The integration approves or rejects the transaction based on its risk information and
             your Post-Screening Policy.
        You can configure your Post-Screening Policy so that you receive alerts when the
        transaction’s risk information becomes available from your AML provider. After the
        screening, recorded information can be viewed in the Transaction History, the Audit Log,
        and your provider’s interface for auditing by your compliance team.



        Screening statuses
        The screening status informs you of the status of Fireblocks' screening of your transaction.
              Completed: Screening has been completed successfully, meaning a successful
              result has arrived or the 6-hour timeout has been reached.
              Pending: Screening is still in progress. Transactions may have this screening status
              for up to 6 hours after registration with the transaction monitoring provider.
              Bypassed: Screening did not occur and the transaction was automatically accepted
              due to one of the following reasons:
                       Policy: If the Transaction Screening Policy defines the transaction to pass
                       screening.
                       Unsupported Asset: Assets that are not supported by the provider.
                       Unsupported Route: Some routes are not supported for screening.
                       Bypassed Failure: If the screening process failed, it may indicate that your
                       API Key is expired. By default, transactions with a screening failure are
                       bypassed. If you want to freeze transactions when a screening failure
                       occurs, you need to turn off the Bypass on Failure flag.
                       Manual: When a user manually bypasses a transaction's rejection using the
                       Fireblocks Console or the Fireblocks API.
              Failed: Screening failure. Only possible when Bypass on Failure is turned off.
https://support.fireblocks.io/hc/en-us/articles/360014290380-AML-Transaction-Screening-Monitoring                               5/8
26. 5. 19. 오전 9:45                                            AML Transaction Screening & Monitoring – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience
        Unsupported screening routes                                                                                            /
                                                                          Fireblocks Help Center
        Fireblocks does not support screening for the following source ⇒ destination pairs:
              Vault(s) ⇒ Vault(s)
              Vault(s) ⇒ Exchange(s)
              Gas Station ⇒ Vault(s)
              Non-custodial wallet(s) ⇒ Non-custodial wallet(s) in the same workspace
        For Vault(s) ⇒ Vault(s) and Vault(s) ⇒ Exchange(s), withdrawal pre-screening is
        unsupported, but the transaction is still registered with the provider after it is sent.

            Warning
            Although these transactions bypass pre-screening, they are still registered with your
            AML provider (Chainalysis or Elliptic) and count toward your usage quota.
            To prevent these transactions from being registered with your provider, configure
            your Transaction Screening Policy to PASS for Vault(s) ⇒ Vault(s) and/or Vault(s) ⇒
            Exchange(s). This ensures they bypass screening entirely and are not counted against
            your quota.


            Note
            When using Chainalysis V2, SOL transactions with an amount of 0.0 will bypass
            screening with a status of Unsupported Route.




        Unsupported assets
        Fireblocks does not support screening for non-fungible tokens (NFTs). Transactions that
        include NFTs will fail with a status of Unsupported Asset.



        For developers
        Want to integrate directly using the Fireblocks API? Learn more about Transaction
        Screening for developers.


https://support.fireblocks.io/hc/en-us/articles/360014290380-AML-Transaction-Screening-Monitoring                                   6/8
26. 5. 19. 오전 9:45                                            AML Transaction Screening & Monitoring – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience
                                              Was this article helpful?
                                                                      YesFireblocks
                                                                                 NoHelp Center                                  /


        ON THIS PAGE
              Overview
              Benefits of AML Transaction Screening
              Transaction screening flow
              Screening statuses
              Unsupported screening routes
              Unsupported assets
              For developers



             Related Articles
                     Set up an Elliptic integration
                     Customer Reference ID
                     AML Post-Screening Policy
                     AML Advanced Configuration settings
                     Transaction screening operations
                     Global Policy: How Fireblocks ensures OFAC sanctions compliance
                     Set up a Chainalysis integration
                     AML Transaction Screening Policy




      fireblocks.com          Status        API Docs         Console         info@fireblocks.com



      Fireblocks © 2026. All Rights Reserved. NMLS Registration Number: 2066055

https://support.fireblocks.io/hc/en-us/articles/360014290380-AML-Transaction-Screening-Monitoring                                   7/8
26. 5. 19. 오전 9:45                                            AML Transaction Screening & Monitoring – Fireblocks Help Center
      Privacy Policy
                     Don't see what you're looking for? Log in for the full Help Center experience

                                                                          Fireblocks Help Center                                /




https://support.fireblocks.io/hc/en-us/articles/360014290380-AML-Transaction-Screening-Monitoring                                   8/8
