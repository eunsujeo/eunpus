26. 5. 19. 오전 9:44                                                   AML Post-Screening Policy – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience

                                                                           Fireblocks Help Center Search the Help Center /



        Fireblocks Help Center             Identity & Compliance             About Compliance


        AML Post-Screening Policy

            Note
            The AML integration is a premium feature that requires an additional purchase. Reach
            out to your Customer Success Manager if you do not have an agreement with an AML
            provider or you need help enabling the feature.


        Overview
        The AML Post-Screening Policy pre-determines what action to take on a screened
        transaction based on the screening result returned by Chainalysis, Elliptic, or your third-
        party AML provider.
        Fireblocks recommends using your AML provider as a resource when determining what
        actions to take against suspicious transactions.



        Default policy vs. custom policy
        By default, the AML Post-Screening Policy accepts all transactions. The policy runs in the
        background of your operations, meaning:
               Your workflow remains the same since there are no rejections.
               You can automate registering each transaction with Chainalysis or Elliptic.
               You can view AML results on the Transaction History page in the Console and using
               the API.
        However, you can replace the default AML Post-Screening Policy with a custom policy that
        suits your business’s needs and risk strategies.


https://support.fireblocks.io/hc/en-us/articles/8593762897436-AML-Post-Screening-Policy                                      1/11
26. 5. 19. 오전 9:44                                                   AML Post-Screening Policy – Fireblocks Help Center

        Custom policies operate on a first-match basis rule set. This means the first rule that
                 Don't see what you're looking for? Log in for the full Help Center experience
        matches the transaction’s parameters is applied to the transaction and the action specified
        in the rule is performed. If there is no matching rule, the transaction is not screened and is
        accepted automatically.                      Fireblocks Help Center                            /




        Building your AML Post-Screening Policy
        You can create and customize your AML Post-Screening Policy using the steps below.
        CSV Policy Upload
        To get started:
          1. Download the AML Post-Screening Policy template and read the instructions on the
             Instructions tab.
          2. Use the following rule parameters to build and customize your post-screening rules.
        Alternative: Compliance Policy Editor (Early access)

            Important:
            This feature is not yet available to all customers. Contact your Customer Success
            manager to learn more.

        To get started, in your Fireblocks Console:
          1. Navigate to Policies > Compliance policies > AML.
          2. Connect to your provider by following the prompts.
          3. Once connected, you can begin right away with the default screening rules that are
             automatically enabled.
          4. You can also use the Policy Editor and advanced configuration settings to build your
             custom AML Screening Policy rules following the rule parameters below.




https://support.fireblocks.io/hc/en-us/articles/8593762897436-AML-Post-Screening-Policy                                   2/11
26. 5. 19. 오전 9:44                                                   AML Post-Screening Policy – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience
        Rule parameters                                                                                                   /
                                                                           Fireblocks Help Center
        Direction
        This parameter specifies whether the rule applies to incoming or outgoing transactions or
        both. You can select one of the following:
               Inbound: This applies the rule to incoming transactions that match the rule's
               parameters.
               Outbound: This applies the rule to outgoing transactions that match the rule's
               parameters.
               Any: This applies the rule to all incoming and outgoing transactions that match the
               rule's parameters.
        Risk Score
        This parameter specifies the amount of risk associated with the transaction according to
        Chainalysis. You can select one of the following:
               Any or Low: This applies the rule to transactions with any risk score that match the
               rule's parameters.
               Medium: This applies the rule to transactions with a “Medium”, “High”, or “Severe”
               risk score that match the rule’s parameters.
               High: This applies the rule to transactions with a "High" or “Severe” risk score that
               match the rule's parameters.
               Severe: This applies the rule only to transactions with a “Severe” risk score that
               match the rule’s parameters.

            Note
            The “Medium” and “Severe” risk scores are only available if using Chainalysis V2.

        There is also the "Unknown" risk score, which indicates that the transaction’s amount of risk
        has not yet been determined by Chainalysis. This means there may be indirect risk
        associated with the transaction. While this risk score can appear as a screening result from
        Chainalysis, you cannot use this value in your policy rules.

            Chainalysis severity scores
            Chainalysis also provides indirect severity scores that are not supported by
            Fireblocks. These scores are associated with Chainalysis severity alerts, which
            provide indirect attributions and analyses that are not instant. A single transfer can
            trigger multiple severity alerts over time.
https://support.fireblocks.io/hc/en-us/articles/8593762897436-AML-Post-Screening-Policy                                       3/11
26. 5. 19. 오전 9:44                                                   AML Post-Screening Policy – Fireblocks Help Center

            The severity scores are:
                 Don't see what you're looking for? Log in for the full Help Center experience
                Severe
                High                               Fireblocks Help Center                                                 /
                Medium
                Low
            These scores differ from the risk scores that are available on Fireblocks and used in
            your policy. The risk scores used by Fireblocks are Chainalysis "Know Your
            Transaction" (KYT) scores, which provide instant direct transaction analysis.
            Fireblocks does not currently support indirect severity scores in the AML Post-
            Screening Policy since the attributions are not instant. You can receive notifications
            of risky indirect exposure and ongoing attributions via severity alerts in your
            Chainalysis dashboard.


        Name
        This parameter specifies the transaction’s counterparty. For certain transactions, this
        information may be unavailable.
        Category
        This parameter specifies the risk category as defined by Chainalysis. For certain
        transactions, this information may be unavailable.
        You can select Any, which applies the rule to all of the categories below, or select one of
        the following categories for each rule. Listed below are the category IDs and their
        descriptions.
               1 - child abuse material
               2 - darknet market
               3 - sanctioned entity
               4 - no kyc exchange
               6 - stolen funds
               7 - mining pool
               9 - other
               10 - ethereum contract
               11 - hosted wallet
               12 - ransomware
               13 - mixing
               14 - ico
               15 - erc20 token
               16 - gambling
               17 - merchant services
               18 - scam
https://support.fireblocks.io/hc/en-us/articles/8593762897436-AML-Post-Screening-Policy                                       4/11
26. 5. 19. 오전 9:44                                                   AML Post-Screening Policy – Fireblocks Help Center

               19 - p2p exchange
                   Don't see what you're looking for? Log in for the full Help Center experience
               20 - none
               21 - exchange
               22 - mining                           Fireblocks Help Center                                               /
               23 - terrorist financing
               24 - atm
               25 - sanctioned jurisdiction
               26 - lending
               27 - decentralized exchange
               28 - fraud shop
               29 - illicit actor-org
               30 - infrastructure as a service
               31 - token smart contract
               32 - smart contract
               33 - protocol privacy
               34 - special measures
               35 - malware
               36 - online pharmacy
               37 - bridge
               38 - nft platform - collection
               39 - seized funds
               41 - unnamed service
               42 - stolen bitcoins
               43 - stolen ether
               45 - escort service
               46 - institutional platform
               47 - instant exchange
               999 - custom address
        Exposure type (Chainalysis V2 only)
        This parameter specifies whether the rule applies to transactions with direct exposure or
        indirect exposure to the counterparty. You can select one of the following:
               Any: This applies the rule to transactions with any exposure type.
               Direct: This applies the rule to transactions without any intermediaries between the
               source and destination of funds.
               Indirect: This applies the rule to transactions with intermediaries between the
               source and destination of funds.
        Amount
        This parameter specifies the United States dollar (USD) amount a transaction’s value must
        be higher than to trigger the rule. This value must be entered in USD.

https://support.fireblocks.io/hc/en-us/articles/8593762897436-AML-Post-Screening-Policy                                       5/11
26. 5. 19. 오전 9:44                                                   AML Post-Screening Policy – Fireblocks Help Center

        ActionDon't see what you're looking for? Log in for the full Help Center experience
        This parameter specifies the action to take when a transaction matches the rule. You can
        choose one of the following actions:      Fireblocks Help Center                         /
               Accept: This action approves the transaction.
                      For incoming transactions, funds become immediately spendable within the
                      wallet.
                      For outgoing transactions, you can have a designated signer who can
                      decide whether or not to sign transactions based on their risk score and
                      category.
               Reject: This action stops the transaction and generates an alert.
                       For incoming transactions, Fireblocks freezes the transaction’s funds in the
                       destination wallet. The wallet will continue to function normally, but the
                       frozen funds cannot be spent until an Admin-level user unfreezes them.
                       For outgoing transactions, Fireblocks prevents the transaction from being
                       sent to the risky counterparty. However, the rejected transaction’s funds
                       are not frozen since no illegal or illicit activity occurred. If necessary,
                       Admin-level users can bypass the policy and send rejected transactions.
               Alert: This action approves the transaction and generates an alert on the Audit Log
               and in the channels you've configured to receive AML notifications. The alert
               contains the transaction’s AML information.

            Note
            Transactions with an “Unknown” risk score do not generate alerts and cannot be
            rejected since they do not have any identifiable risk associated with them.




        Example Chainalysis policy
            Important
            We provide you with an example of an AML Post-Screening Policy below to
            demonstrate its capabilities and formatting. However, we will not provide a policy for
            you to copy and use.
            If you need assistance building a policy, we recommend contacting Chainalysis. They
            may have compliance experts as part of their team to assist you. Additionally, you can
            use Chainalysis alert rules as a reference for your own policy.

https://support.fireblocks.io/hc/en-us/articles/8593762897436-AML-Post-Screening-Policy                                   6/11
26. 5. 19. 오전 9:44                                                   AML Post-Screening Policy – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience
         Rule                 Direction            Risk Score           Name               Category            Amount     Action

         1                    Any                  Low                  Coinbase.com Any Center
                                                                         Fireblocks Help                       Any        Accept   /
         2                    Inbound              High                 Any                Scam                > $1,000   Reject

         3                    Outbound             High                 Any                Scam                > $1,000   Alert

         4                    Any                  Low                  Any                Sanctions           Any        Reject

         5                    Any                  High                 Any                Any                 Any        Reject

         6                    Any                  Low                  Any                Any                 > $500     Alert

         7                    Any                  Low                  Any                Any                 Any        Alert


          1. Any incoming and outgoing transactions associated with Coinbase.com are
             accepted.
          2. Incoming transactions greater than $1,000 with a “High” risk score and a category
             of “Scam” are rejected.
          3. Outgoing transactions greater than $1,000 with a “High” risk score and a category
             of “Scam” generate an alert.
          4. Any incoming and outgoing transactions with a “Low” risk score and a category of
             “Sanctions” are rejected.
          5. Any incoming and outgoing transactions with a “High” risk score are rejected.
          6. Any incoming and outgoing transactions greater than $500 with a “Low” risk score
             are accepted but generate an alert.
          7. Any incoming and outgoing transactions not specified above are accepted but
             generate an alert.



        Building your Elliptic AML Post-Screening Policy
        CSV Policy
        To get started, download the Post-Screening Policy template and read the instructions on
        the Instructions tab. Use the following rule parameters to build your custom AML Post-
        Screening Policy rules for the Elliptic integration.



        Rule parameters
        Direction
https://support.fireblocks.io/hc/en-us/articles/8593762897436-AML-Post-Screening-Policy                                                7/11
26. 5. 19. 오전 9:44                                                   AML Post-Screening Policy – Fireblocks Help Center

        This parameter specifies whether the rule applies to incoming or outgoing transactions or
                Don't see what you're looking for? Log in for the full Help Center experience
        both. You can select one of the following:
               Inbound: This applies the rule to incoming   transactions
                                                     Fireblocks Help Centerthat match the rule's  /
               parameters.
               Outbound: This applies the rule to outgoing transactions that match the rule's
               parameters.
               Any: This applies the rule to all incoming and outgoing transactions that match the
               rule's parameters.
        Risk Score
        This parameter specifies the amount of risk associated with the transaction according to
        Elliptic.
        You can select a risk score on a scale of 0.0-10.0, 10.0 being the highest possible amount
        of risk. Note that when you select a risk score for a rule, the rule also applies to transactions
        with a higher risk score that match it. For example, if you specify an 8.0 risk score for a rule,
        the rule also applies to transactions with a 9.0 or 10.0 risk score.
        There is also the No Risk Detected risk score. Rules with this value only apply to
        transactions with no risk detected. They do not apply to transactions with any amount of
        risk, such as 7 or even 0.
        Although Fireblocks receives additional risk information from Elliptic, only the Risk Score is
        used in the Post-Screening Policy since the parameter calculation can be adjusted in your
        Elliptic dashboard.
        Amount
        This parameter specifies the United States dollar (USD) amount a transaction’s value must
        be higher than to trigger the rule. This value must be entered in USD.
        Action
        This parameter specifies the action to take when a transaction matches the rule. You can
        choose one of the following actions:
               Accept: This action approves the transaction.
                      For incoming transactions, funds become immediately spendable within the
                      wallet.
                      For outgoing transactions, you can have a designated signer who can
                      decide whether or not to sign transactions based on their risk score and
                      category.
               Reject: This action stops the transaction and generates an alert.
                       For incoming transactions, Fireblocks freezes the transaction’s funds in the
                       destination wallet. The wallet will continue to function normally, but the
                       frozen funds cannot be spent until an Admin-level user unfreezes them.
https://support.fireblocks.io/hc/en-us/articles/8593762897436-AML-Post-Screening-Policy                                   8/11
26. 5. 19. 오전 9:44                                                   AML Post-Screening Policy – Fireblocks Help Center

                          For outgoing transactions, Fireblocks prevents the transaction from being
                     Don't see what you're looking for? Log in for the full Help Center experience
                          sent to the risky counterparty. However, the rejected transaction’s funds
                          are not frozen since no illegal or illicit activity occurred. If necessary,
                          Admin-level users can bypass Fireblocks
                                                          the policy Helpand send rejected transactions. /
                                                                          Center

               Alert: This action approves the transaction and generates an alert on the Audit Log
               and in the channels you've configured to receive AML notifications. The alert
               contains the transaction’s AML information.

             Note
             Transactions with a N/A risk score do not generate alerts and cannot be rejected
             since they do not have any identifiable risk associated with them.




        Example Elliptic policy
             Important
             We provide you with an example of an AML Post-Screening Policy below to
             demonstrate its capabilities and formatting. However, we will not provide a policy for
             you to copy and use.
             If you need assistance building a policy, we recommend contacting Elliptic. They may
             have compliance experts as part of their team to assist you. Additionally, you can use
             Elliptic alert rules as a reference for your own policy.


         Rule                          Direction                    Risk Score                 Amount                     Action

         1                             Inbound                      > 4.0                      > $2,000                   Reject

         2                             Any                          > 7.0                      Any                        Reject

         3                             Outbound                     Any                        > $2,000                   Alert

         4                             Any                          Any                        Any                        Accept


          1. Incoming transactions with a risk score greater than 4.0 and greater than $2,000
             will be rejected and will generate an alert.
          2. Any transactions (incoming or outgoing) with a risk score greater than 7.0 and any
             amount will be rejected and will generate an alert.

https://support.fireblocks.io/hc/en-us/articles/8593762897436-AML-Post-Screening-Policy                                            9/11
26. 5. 19. 오전 9:44                                                   AML Post-Screening Policy – Fireblocks Help Center

          3. Outgoing transactions with any risk score and greater than $2,000 will generate an
                 Don't see what you're looking for? Log in for the full Help Center experience
             alert.
          4. Accept any other transaction.
                                                                           Fireblocks Help Center                         /




        Uploading your Post-Screening Policy - CSV Policy

        To upload your workspace’s AML Post-Screening Policy, go to Settings > Compliance and
        select your AML provider. Then select Change policy in the Post-screening row, and
        upload the template with your custom policy.



                                                             Was this article helpful?
                                                                      Yes                 No

        ON THIS PAGE
              Overview
              Default policy vs. custom policy
              Building your AML Post-Screening Policy
              Rule parameters
              Example Chainalysis policy
              Building your Elliptic AML Post-Screening Policy
              Rule parameters
              Example Elliptic policy
              Uploading your Post-Screening Policy - CSV Policy



             Related Articles
                     Global Policy: How Fireblocks ensures OFAC sanctions compliance
                     AML Advanced Configuration settings
                     Transaction screening operations
                     AML Transaction Screening & Monitoring
https://support.fireblocks.io/hc/en-us/articles/8593762897436-AML-Post-Screening-Policy                                       10/11
26. 5. 19. 오전 9:44                                                   AML Post-Screening Policy – Fireblocks Help Center

                     Set up a Chainalysis integration
                     Don't see what you're looking for? Log in for the full Help Center experience
                     AML Transaction Screening Policy
                     Integrating third-party AML providersFireblocks Help Center
                                                           with your workspace                                            /

                     Set up an Elliptic integration
                     Customer Reference ID
                     Travel Rule Support Overview




      fireblocks.com          Status        API Docs         Console         info@fireblocks.com



      Fireblocks © 2026. All Rights Reserved. NMLS Registration Number: 2066055
      Privacy Policy




https://support.fireblocks.io/hc/en-us/articles/8593762897436-AML-Post-Screening-Policy                                       11/11
