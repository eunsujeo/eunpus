26. 5. 19. 오전 9:44                                                AML Transaction Screening Policy – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience

                                                                           Fireblocks Help Center Search the Help Center /



        Fireblocks Help Center             Identity & Compliance             About Compliance


        AML Transaction Screening Policy

            Note
            The AML integration is a premium feature that requires an additional purchase. Reach
            out to your Customer Success Manager if you do not have an agreement with an AML
            provider or you need help enabling the feature.


        Overview
        The Transaction Screening Policy allows you to define which transactions to screen. When
        Fireblocks screens a transaction, it sends the transaction's details to your Anti-Money
        Laundering (AML) provider for risk analysis, AML/Counter Financing of Terrorism
        (AML/CFT) monitoring, and sanctions monitoring.
        Fireblocks screens incoming and outgoing transactions to ensure compliance with
        transactional AML/CFT rules and sanctions. Fireblocks performs three types of screening
        operations:
              Screen deposits to Fireblocks: Fireblocks registers deposits to your workspace
              with your AML provider for risk analysis. You can choose to pass, screen, or freeze
              these transactions.
              Screen withdrawals from Fireblocks: Fireblocks receives risk information on the
              destination address before the withdrawal. You can choose to pass, screen, or
              freeze these transactions.
              Screen transaction data for registration with AML provider: Fireblocks registers
              completed transactions with your AML provider for further analysis. This can be
              specific venue combinations, such as vault account to vault account, or a manual
              re-screen of a specific transaction.

            Note

https://support.fireblocks.io/hc/en-us/articles/8334213558812-AML-Transaction-Screening-Policy                                1/7
26. 5. 19. 오전 9:44                                                AML Transaction Screening Policy – Fireblocks Help Center

            Screening withdrawals from your vault accounts to Fireblocks P2P Network
                Don't see what you're looking for? Log in for the full Help Center experience
            connections and exchanges is currently unavailable.
                                                                           Fireblocks Help Center                             /



        Default policy vs. custom policy
        By default, the Transaction Screening Policy requires all transactions to be screened,
        including internal transactions. However, you can replace the default Transaction Screening
        Policy with a custom policy that defines which transactions are screened.
        Custom policies operate on a first-match basis rule set. This means the first rule that
        matches the transaction’s parameters is applied to the transaction, and the action specified
        in the rule is performed. If there is no matching rule, the transaction is not screened and is
        accepted automatically.



        Building your Transaction Screening Policy
        You can create and customize your AML Transaction Screening Policy using the steps
        below.
        CSV Policy Upload
        To get started:
          1. Download the AML Transaction Screening Policy template and read the instructions
             on the Instructions tab.
          2. Use the following rule parameters to build and customize your screening policy.
        Alternative: Compliance Policy Editor (Early access)

            Important:
            This feature is not yet available to all customers. Contact your Customer Success
            Manager to learn more.

        To get started, in your Fireblocks Console:
          1. Navigate to Policies > Compliance policies > AML.
          2. Connect to your provider by following the prompts.
          3. Once connected, you can begin right away with the default screening rules that are
             automatically enabled.
https://support.fireblocks.io/hc/en-us/articles/8334213558812-AML-Transaction-Screening-Policy                                    2/7
26. 5. 19. 오전 9:44                                                AML Transaction Screening Policy – Fireblocks Help Center

          4. You can also use the Policy Editor and advanced configuration settings to build your
                Don't see what you're looking for? Log in for the full Help Center experience
             custom AML Screening Policy rules following the rule parameters below.
                                                                           Fireblocks Help Center                             /




        Rule parameters
        Source
        This is the transaction's source. You can select one of the following values:
              Any
              Vault Account (e.g., Default vault account)
              Any Vault Account
              Exchange (e.g., Binance, Coinbase)
              Any Exchange
              Unknown—used for non-whitelisted external addresses
              Network connection
              Any Network connection
              Any Unmanaged Wallet—used in conjunction with a Customer Reference ID




        Source Subtype
        When you select a specific source type, such as Vault Account or Exchange, you must
        enter the source's name in this field.
        Leave this field blank when you select an "Any" source type.

        Destination
        This is the transaction's destination. You can select one of the following values:
              Any
              Vault Account (e.g., Default vault account)
              Any Vault Account
              Exchange (e.g., Binance, Coinbase)
https://support.fireblocks.io/hc/en-us/articles/8334213558812-AML-Transaction-Screening-Policy                                    3/7
26. 5. 19. 오전 9:44                                                AML Transaction Screening Policy – Fireblocks Help Center

              Any Exchange
                 Don't see what you're looking for? Log in for the full Help Center experience
              Network connection
              Any Network connection
                                                   Fireblocks Help
              Any Unmanaged Wallet—used in conjunction        with Center
                                                                    a Customer Reference ID                                   /
              One Time Address

            Note
            The Any Unmanaged Wallet value refers to any whitelisted wallet address not
            managed by Fireblocks.


        Destination Subtype
        When you select a specific destination type, such as Vault Account or Exchange, you must
        enter the destination's name in this field.
        Leave this field blank when you select an "Any" destination type.

        Amount/AmountUSD
        This is the minimum asset quantity or dollar amount a transaction value must exceed to
        trigger the rule. You can enter one of the following values:
              Amount: The quantity of an asset. When you create rules using asset amounts, this
              field's asset value and the Asset field's value must match (e.g., > 0.01 ETH, ETH).
              AmountUSD: The US dollar amount (e.g., > $200).

        Asset
        This is the asset to which you want to apply the rule. You can specify a single asset by
        entering it as its AssetID on Fireblocks, or you can enter Any to apply the rule to all assets in
        your workspace.
        Make sure to list only assets your AML provider supports.

        Action
        This is the action Fireblocks performs when the rule is triggered. You can select one of the
        following:
              Screen: Screen the transaction and submit its details to your AML provider for risk
              analysis and monitoring.
              Pass: Skip screening and accept the transaction.
              Freeze: Freeze the transaction’s assets in your workspace so they cannot be spent.
              Remember, transactions frozen by this action need to be unfrozen manually by an
              Admin-level user.
https://support.fireblocks.io/hc/en-us/articles/8334213558812-AML-Transaction-Screening-Policy                                    4/7
26. 5. 19. 오전 9:44                                                AML Transaction Screening Policy – Fireblocks Help Center


        Comments Don't see what you're looking for? Log in for the full Help Center experience
        This field is optional. Use it to add any rule-specific information you want Fireblocks
                                                      Fireblocks                                                                         /
        Support to be aware of when you submit your        policyHelp  Center and implementation.
                                                                  for review



        Example policy
             Important
             We provide you with an example of a Transaction Screening Policy below to
             demonstrate its capabilities and formatting. However, we will not provide a policy for
             you to copy and use.
             If you need help building a policy, we recommend contacting your AML provider. They
             may have compliance experts as part of their team to assist you.


                                              Source                               Destination        Amount/
         Rule            Source                              Destination                                         Asset          Action
                                              Subtype                              Subtype            Amount USD

                         Any Vault                           Any Vault
         1                                                                                            Any                 Any   Pass
                         Account                             Account

                                                                                   Default vault
         2               Any                                 Vault Account                            Any                 Any   Screen
                                                                                   account

         3               Exchange             Binance        Vault Account Vault 2                    Any                 BTC   Screen

                                                             Any
         4               Any                                 Unmanaged             0x5...394          > 0.01 ETH          ETH   Screen
                                                             Wallet

                                              Default
                         Vault
         5                                    vault          Any                                      Any                 BTC   Screen
                         Account
                                              account

                         Any
         6                                                   Any                                      > $200              ETH   Screen
                         Exchange

         7               Any                                 Any                                      Any                 Any   Pass


          1. Skip screening on internal vault account-to-vault account transactions.
          2. Screen any incoming transactions to the Default vault account.
https://support.fireblocks.io/hc/en-us/articles/8334213558812-AML-Transaction-Screening-Policy                                               5/7
26. 5. 19. 오전 9:44                                                AML Transaction Screening Policy – Fireblocks Help Center

          3. Screen any incoming BTC transactions from any Binance account to the Vault 2
                Don't see what you're looking for? Log in for the full Help Center experience
             vault account.
          4. Screen any outgoing ETH transactions greater than 0.01 ETH to the unmanaged
             wallet address 0x5…394.              Fireblocks Help Center                                                      /
          5. Screen any outgoing BTC transactions from the Default vault account.
          6. Screen any incoming ETH transactions greater than $200 from any exchange.
          7. Skip screening on all other transactions.



        Uploading your Transaction Screening Policy - CSV
        Policy
        To upload your workspace’s AML Transaction Screening Policy, go to Settings >
        Compliance and select your AML provider. Then select Change policy in the Screening
        row, and upload the template with your custom policy.



                                                             Was this article helpful?
                                                                      Yes              No

        ON THIS PAGE
              Overview
              Default policy vs. custom policy
              Building your Transaction Screening Policy
              Example policy
              Uploading your Transaction Screening Policy - CSV Policy


             Related Articles
                     Global Policy: How Fireblocks ensures OFAC sanctions compliance
                     AML Post-Screening Policy
                     AML Advanced Configuration settings
                     Transaction screening operations
                     AML Transaction Screening & Monitoring
https://support.fireblocks.io/hc/en-us/articles/8334213558812-AML-Transaction-Screening-Policy                                    6/7
26. 5. 19. 오전 9:44                                                AML Transaction Screening Policy – Fireblocks Help Center

                     Set up a Chainalysis integration
                     Don't see what you're looking for? Log in for the full Help Center experience
                     Integrating third-party AML providers with your workspace
                     Set up an Elliptic integration                        Fireblocks Help Center                             /

                     Autofreeze assets from incoming transactions
                     Customer Reference ID




      fireblocks.com          Status        API Docs         Console         info@fireblocks.com



      Fireblocks © 2026. All Rights Reserved. NMLS Registration Number: 2066055
      Privacy Policy




https://support.fireblocks.io/hc/en-us/articles/8334213558812-AML-Transaction-Screening-Policy                                    7/7
