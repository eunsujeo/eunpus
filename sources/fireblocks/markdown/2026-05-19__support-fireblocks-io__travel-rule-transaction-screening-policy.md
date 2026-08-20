26. 5. 19. 오전 9:45                                              Travel Rule Transaction Screening Policy – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience

                                                                            Fireblocks Help Center Search the Help Center /



        Fireblocks Help Center              Identity & Compliance              About Compliance


        Travel Rule Transaction Screening
        Policy

            Note
            The Travel Rule integration is a premium, opt-in feature that requires an additional
            purchase. Contact your Customer Success Manager for more information.


        Overview
        The Transaction Screening Policy allows you to define which transactions to screen.



        Default policy vs. custom policy
        By default, the Transaction Screening Policy screens all your transactions except:
               If the transaction is part of an unsupported route.
               If the transaction includes an unsupported asset.
               If no initial Travel Rule information is included with the transaction.
               If AML screening is bypassed or not activated for your workspace.

                Default policy

        However, you can add a custom policy that defines which transactions are screened.
        Policies operate on a first-match basis rule set. This means the first rule that matches the
        transaction’s parameters is applied to the transaction, and the action specified in the rule is
        performed.

https://support.fireblocks.io/hc/en-us/articles/8271640646940-Travel-Rule-Transaction-Screening-Policy                              1/6
26. 5. 19. 오전 9:45                                              Travel Rule Transaction Screening Policy – Fireblocks Help Center

        When implementing a custom policy, the default policy rules remain at the bottom of the
                 Don't see what you're looking for? Log in for the full Help Center experience
        ruleset to ensure all transactions match a rule.
                                                                            Fireblocks Help Center                                  /


        Building your Transaction Screening Policy
        You can create and customize your Travel Rule Transaction Screening Policy using the steps
        below.
        CSV Policy Upload
        To get started:
           1. Download the Transaction Screening Policy template and read the instructions on
              the Instructions tab.
           2. Use the following rule parameters to build and customize your Travel Rule
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
        Source
        This is the transaction’s source. You can select one of the following values:
               Any
               Vault Account (e.g., Default vault account)
https://support.fireblocks.io/hc/en-us/articles/8271640646940-Travel-Rule-Transaction-Screening-Policy                                  2/6
26. 5. 19. 오전 9:45                                              Travel Rule Transaction Screening Policy – Fireblocks Help Center

               Any Vault Account
                  Don't see what you're looking for? Log in for the full Help Center experience
               Exchange (e.g., Binance, Coinbase)
               Any Exchange
                                                    Fireblocksaddresses
               Unknown–used for non-whitelisted external       Help Center                                                          /
               Network connection
               Any Network connection
        Sources must already be configured in your workspace for the rule to apply.
        Source Subtype
        When you select a specific source type, such as Vault Account or Exchange, you must
        enter the name of the source in this field.
        Leave this field blank when you select an “Any” source type.
        Destination
        This is the transaction’s destination. You can select one of the following values:
               Any
               Vault Account (e.g., Default vault account)
               Any Vault Account
               Exchange (e.g., Binance, Coinbase)
               Any Exchange
               Network connection
               Any Network connection
               Any Unmanaged Wallet
               One-Time Address
        Destinations must already be configured in your workspace for the rule to apply.
        Destination Subtype
        When you select a specific destination type, such as Vault Account or Exchange, you must
        enter the name of the destination in this field.
        Leave this field blank when you select an “Any” destination type.
        Amount/AmountUSD
        This is the asset quantity or dollar amount that a transaction’s value must be higher than to
        trigger the rule. You can enter one of the following values:
               Amount: The quantity of an asset. When you create rules using asset amounts, this
               field’s asset value and the Asset field’s value must match (e.g., > 0.01 ETH, ETH).
               AmountUSD: The US dollar amount (e.g., > $200).
        Asset
https://support.fireblocks.io/hc/en-us/articles/8271640646940-Travel-Rule-Transaction-Screening-Policy                                  3/6
26. 5. 19. 오전 9:45                                               Travel Rule Transaction Screening Policy – Fireblocks Help Center

        This is the asset to which you want to apply the rule. You can specify a single asset by
                 Don't see what you're looking for? Log in for the full Help Center experience
        entering its AssetID on Fireblocks, or you can enter Any to apply the rule to all assets in
        your workspace.
                                                                            Fireblocks Help Center                                            /
        Make sure to list only assets supported by Notabene.
        Action
        This is the action Fireblocks performs when the rule is triggered. Select one of the
        following:
               Screen: The transaction’s details are sent to Notabene to determine Travel Rule
               compliance.
               Bypass: The transaction is not screened and is automatically accepted.
               Freeze: Freeze the transaction’s assets in your workspace so they cannot be spent.
               Remember, transactions frozen by this action can only be unfrozen manually by an
               Admin-level user.
        Comments
        This field is optional. Use it to add any rule-specific information you want Fireblocks
        Support to be aware of when you submit your policy for review and implementation.



        Example policy
              Important
              We provide you with an example of a Travel Rule Transaction Screening Policy below
              to demonstrate its capabilities and formatting. However, we will not provide a policy
              for you to copy and use.
              If you need assistance building a policy, we recommend contacting Notabene. They
              may have compliance experts as part of their team to assist you.


          Rule No.         Source                          Destination              Amount                   Asset                   Action

          1                Vault                           Vault                    Any                      Any                     Pass

                                                           Default Vault
          2                Any                                                      >$100                    Any                     Screen
                                                           Account

          3                All Binance Accounts            Vault #2                 Any                      BTC                     Screen

          4                Any                             Any                      Any                      Any                     Pass

https://support.fireblocks.io/hc/en-us/articles/8271640646940-Travel-Rule-Transaction-Screening-Policy                                            4/6
26. 5. 19. 오전 9:45                                              Travel Rule Transaction Screening Policy – Fireblocks Help Center


                 Don't see what you're looking for? Log in for the full Help Center experience
           1. Skip screening on internal Vault-to-Vault transactions.
           2. Screen any incoming transactions to the Default vault account that are greater than
                                                   Fireblocks Help Center                       /
              $100.
           3. Screen any incoming BTC transactions from any Binance account to the Vault 2
              vault account.
           4. Skip screening on all other transactions.



        Uploading your Transaction Screening Policy - CSV
        Policy
        To upload your workspace’s Travel Rule Transaction Screening Policy, go to Settings >
        Compliance > Travel Rule. Then select Change policy in the Screening row, and upload
        the template with your custom policy.



                                                              Was this article helpful?
                                                                        Yes             No

        ON THIS PAGE
              Overview
              Default policy vs. custom policy
              Building your Transaction Screening Policy
              Rule parameters
              Example policy
              Uploading your Transaction Screening Policy - CSV Policy



              Related Articles
                     Address Registry
                     Travel Rule Support Overview
                     dApp Connection Policy
                     401 Error, “Unauthorized: Access Denied”
https://support.fireblocks.io/hc/en-us/articles/8271640646940-Travel-Rule-Transaction-Screening-Policy                              5/6
26. 5. 19. 오전 9:45                                              Travel Rule Transaction Screening Policy – Fireblocks Help Center

                     About the Travel Rule
                     Don't see what you're looking for? Log in for the full Help Center experience
                     Setting up Travel Rule integration
                     Publish a Policy                                       Fireblocks Help Center                                  /




      fireblocks.com           Status        API Docs          Console         info@fireblocks.com



      Fireblocks © 2026. All Rights Reserved. NMLS Registration Number: 2066055
      Privacy Policy




https://support.fireblocks.io/hc/en-us/articles/8271640646940-Travel-Rule-Transaction-Screening-Policy                                  6/6
