26. 5. 19. 오전 9:45                                                  Travel Rule Post-Screening Policy – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience

                                                                            Fireblocks Help Center Search the Help Center /



        Fireblocks Help Center              Identity & Compliance              About Compliance


        Travel Rule Post-Screening Policy

             Note
             The Travel Rule integration is a premium, opt-in feature that requires an additional
             purchase. Contact your Customer Success Manager for more information.


        Overview
        The Travel Rule Post-Screening Policy pre-determines what action to take on a screened
        transaction based on the screening result returned by Notabene.
        Fireblocks recommends using your Travel Rule provider as a resource when determining
        what actions to take against suspicious transactions.



        Default policy vs. custom policy
        The default Post-Screening Policy accepts, rejects, freezes, or sends alerts for transactions
        based on their Notabene screening status. The default policy operates on a first-match
        basis rule set. This means the first rule that matches the transaction's parameters is applied
        to the transaction and the action specified in the rule is performed.

                Default policy


        Alternatively, you can replace the default AML Post-Screening Policy with a custom policy
        that suits your business’s needs and risk strategies. Custom policies also operate on a first-
        match basis rule set.


https://support.fireblocks.io/hc/en-us/articles/11231950080156-Travel-Rule-Post-Screening-Policy                                 1/6
26. 5. 19. 오전 9:45                                                  Travel Rule Post-Screening Policy – Fireblocks Help Center

        When implementing a custom policy, the default policy rules remain at the bottom of the
                 Don't see what you're looking for? Log in for the full Help Center experience
        ruleset to ensure all transactions match a rule.
                                                                            Fireblocks Help Center                               /


        Building your Post-Screening Policy
        You can create and customize your Travel Rule Post-Screening Policy using the steps
        below.
        CSV Policy Upload
        To get started:
           1. Download the Transaction Post-Screening Policy template and read the instructions
              on the Instructions tab.
           2. Use the following rule parameters to build and customize your Travel Rule Post-
              Screening Policy rules.
        Alternative: Compliance Policy Editor (Early access)

             Important:
             This feature is not yet available to all customers. Contact your Customer Success
             Manager to learn more.

        To get started, in your Fireblocks Console:
           1. Navigate to Policies > Compliance policies > AML.
           2. Connect to your provider by following the prompts.
           3. Once connected, you can begin right away with the default screening rules that are
              automatically enabled.
           4. You can also use the Policy Editor and advanced configuration settings to build your
              custom AML Screening Policy rules following the rule parameters below.



        Rule parameters
        Direction
        This is the transaction’s source, such as a vault account or exchange account. You can enter
        one of the following:
               Inbound
https://support.fireblocks.io/hc/en-us/articles/11231950080156-Travel-Rule-Post-Screening-Policy                                     2/6
26. 5. 19. 오전 9:45                                                  Travel Rule Post-Screening Policy – Fireblocks Help Center

               Outbound
                  Don't see what you're looking for? Log in for the full Help Center experience
               Any direction
        Travel Rule Status                                                  Fireblocks Help Center                               /

        This is the transaction’s Travel Rule status as determined by Notabene. You can enter one of
        the following:
               Completed: Screening completed successfully.
               Pending: Screening is still in progress.
                      Saved: A transaction is created and saved, but is not sent, following one of
                      the types:
                              Below the established value threshold (BELOW_THRESHOLD)
                              A transfer to or from a non-custodial wallet (NON_CUSTODIAL)
                              An internal transfer within the same VASP
                 Regarding the Notabene integration, when a transaction is marked with a SAVED
                 status, Fireblocks sets the screening status to Completed. In this case, the Travel Rule
                 information is stored for record-keeping purposes only and not sent.
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
               Any status
        Amount
        The amount a transaction must be greater than to trigger the rule. You can enter the
        amount as the asset’s United States dollar (USD) equivalent or a specific quantity of an
        asset.
        Action
        This is the action Fireblocks performs when the rule is triggered. Select one of the following
        actions:
               Accept: The action approves the transaction.
                      For incoming transactions, funds become immediately spendable within the
                      wallet.
https://support.fireblocks.io/hc/en-us/articles/11231950080156-Travel-Rule-Post-Screening-Policy                                     3/6
26. 5. 19. 오전 9:45                                                  Travel Rule Post-Screening Policy – Fireblocks Help Center

                       For outgoing transactions, you can now sign them.
                  Don't see what you're looking for? Log in for the full Help Center experience
               Reject: This action stops the transaction.
                       For incoming transactions, Fireblocks    freezes
                                                    Fireblocks Help      the transaction's funds in the/
                                                                     Center
                       destination wallet. The wallet will continue functioning normally, but the
                       frozen funds cannot be spent until an Admin-level user unfreezes them via
                       the Console or API.
                       For outgoing transactions, Fireblocks prevents the transaction from being
                       sent. Admin-level users can bypass the policy and send rejected
                       transactions.
               Alert: This action approves the transaction and generates an alert on the Audit Log
               and an authorizer’s mobile device. The alert contains the transaction’s Travel Rule
               status. Learn more about configuring Travel Rule event notifications.
               Freeze: This action only applies to incoming transactions. Choose this action to
               stop the transaction and freeze the transaction's funds in the destination wallet.
               The wallet will continue functioning normally, but the frozen funds cannot be spent
               until an Admin-level user unfreezes them via the Console or API.
               Wait: This action only applies to transactions in Pending status. Choose this action
               to keep transactions in Pending status for up to four hours or until the transaction
               screening completes, whichever comes first. If the status hasn’t changed after four
               hours, the screening is canceled.
               Cancel: This action only applies to outgoing transactions in Blocking Time Expired
               status. Choose this action to cancel the transaction.



        Example policy
              Important
              We provide you with an example of a Travel Rule Post-Screening Policy below to
              demonstrate its capabilities and formatting. However, we will not provide a policy for
              you to copy and use.
              If you need assistance building a policy, we recommend contacting Notabene. They
              may have compliance experts as part of their team to assist you.


          Rule No.            Direction                              Travel Rule Status            Amount           Asset        Action

          1                   Any                                    Completed                     Any              Any          Accept

          2                   Any                                    Pending                       Any              Any          Wait
https://support.fireblocks.io/hc/en-us/articles/11231950080156-Travel-Rule-Post-Screening-Policy                                          4/6
26. 5. 19. 오전 9:45                                                  Travel Rule Post-Screening Policy – Fireblocks Help Center

          3                Outbound
                     Don't see what you're looking Failed
                                                   for? Log in for theAny        Any experience
                                                                      full Help Center   Reject

          4                   Outbound                               Rejected                      Any              Any          Reject
                                                                            Fireblocks Help Center                                        /
                                                                     Blocking Time
          5                   Outbound                                                             >$2000           Any          Cancel
                                                                     Expired

                                                                     Blocking Time
          6                   Outbound                                                             Any              Any          Accept
                                                                     Expired

          7                   Outbound                               Canceled                      Any              Any          Reject

          8                   Any                                    Canceled                      Any              Any          Alert

          9                   Inbound                                Failed                        Any              Any          Freeze

          10                  Inbound                                Rejected                      Any              Any          Freeze

                                                                     Blocking Time
          11                  Inbound                                                              Any              BTC          Freeze
                                                                     Expired

                                                                     Blocking Time
          12                  Inbound                                                              Any              Any          Accept
                                                                     Expired


         1. Accept all transactions in Completed status.
         2. Wait on all transactions in Pending status.
         3. Reject outgoing transactions in Failed status.
         4. Reject outgoing transactions in Rejected status.
         5. Cancel outgoing transactions in Blocking Time Expired status that are greater than
            $2000.
         6. Accept all other outgoing transactions in Blocking Time Expired status.
         7. Reject outgoing transactions in Canceled status.
         8. Generate alerts for all transactions in Canceled status.
         9. Freeze incoming transactions in Failed status.
        10. Freeze incoming transactions in Rejected status.
        11. Freeze incoming BTC transactions in Blocking Time Expired status.
        12. Accept all other incoming transactions in Blocking Time Expired status.



        Uploading your Post-Screening Policy - CSV Policy

        To upload your workspace’s Travel Rule Post-Screening Policy, go to Settings >
        Compliance > Travel Rule. Then select Change policy in the Post-screening row, and
        upload the template with your custom policy.
https://support.fireblocks.io/hc/en-us/articles/11231950080156-Travel-Rule-Post-Screening-Policy                                              5/6
26. 5. 19. 오전 9:45                                                  Travel Rule Post-Screening Policy – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience
                                              Was this article helpful?
                                                                            Fireblocks Help Center                               /
                                                                        Yes             No

        ON THIS PAGE
              Overview
              Default policy vs. custom policy
              Building your Post-Screening Policy
              Rule parameters
              Example policy
              Uploading your Post-Screening Policy - CSV Policy




      fireblocks.com           Status        API Docs          Console         info@fireblocks.com



      Fireblocks © 2026. All Rights Reserved. NMLS Registration Number: 2066055
      Privacy Policy




https://support.fireblocks.io/hc/en-us/articles/11231950080156-Travel-Rule-Post-Screening-Policy                                     6/6
