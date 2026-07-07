26. 5. 19. 오전 9:48                                          Travel Rule compliance for exchange transactions – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience

                                                                            Fireblocks Help Center Search the Help Center /



        Fireblocks Help Center              Identity & Compliance             Travel Rule: Policies


        Travel Rule compliance for exchange
        transactions

            Console UI access is limited
            Access to the Binance, Bitstamp, and Bitfinex UI flow is currently available on an opt-
            in, customer-needs basis. API flows are now available for all customers.


        Overview
        Major exchanges, including Binance, Bitstamp, and Bitfinex, have introduced regulatory
        requirements under the Travel Rule. This mandates the collection of Personally Identifiable
        Information (PII) for certain crypto deposits and withdrawals. To ensure compliance, the
        specific personal information required varies based on the exchange and the regulatory
        requirements of your local entity (jurisdiction). Note that Binance US is not affected by this
        change.
        To meet these requirements securely, Fireblocks utilizes end-to-end encryption. The
        personal data is transmitted through an enhanced API using Fireblocks' Exchange Service
        Public Key. This guarantees the information remains encrypted until it is decrypted,
        processed, and submitted as part of the withdrawal or deposit request by the Exchange
        Service, adhering to the requirements of the specific exchange (e.g., Binance or Bitstamp).



        How it works
           1. In the Fireblocks Console, select Transfer on the left navigation pane.
           2. In the From or To fields, select Binance, Bitstamp, or Bitfinex (only in From).
           3. Choose from one of the options below.

https://support.fireblocks.io/hc/en-us/articles/20851702645404-Travel-Rule-compliance-for-exchange-transactions                         1/6
26. 5. 19. 오전 9:48                                          Travel Rule compliance for exchange transactions – Fireblocks Help Center

        OptionDon't
               1: Provide
                    see what required    personal
                             you're looking for? Log ininformation      byCenter
                                                         for the full Help localexperience
                                                                                 entity
        Select Add details to open the PII questionnaire.
                                                                            Fireblocks Help Center                                      /




        Follow the prompts on the Travel Rule details dialog based on your local entity and ensure
        all required parameters are verified for accuracy and completed in full.




https://support.fireblocks.io/hc/en-us/articles/20851702645404-Travel-Rule-compliance-for-exchange-transactions                             2/6
26. 5. 19. 오전 9:48                                          Travel Rule compliance for exchange transactions – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience

                                                                            Fireblocks Help Center                                      /




        Once done, select Save and then complete the transaction as you normally would.
        Option 2: Skip providing personal information
        Select the I acknowledge checkbox to confirm that you understand skipping the personal
        information step may result in the transaction being blocked, and complete the rest of the
        transaction details. Proceeding this way sends a standard transaction without the additional
        data.




https://support.fireblocks.io/hc/en-us/articles/20851702645404-Travel-Rule-compliance-for-exchange-transactions                             3/6
26. 5. 19. 오전 9:48                                          Travel Rule compliance for exchange transactions – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience

                                                                            Fireblocks Help Center                                      /




            Important
            While providing personal information is optional, doing so can reduce the risk of
            transaction delays or failures and help ensure regulatory compliance.




        Binance troubleshooting failed or blocked
        transactions
        In the event transactions are failing or appear frozen on Binance:
               Withdrawals: If a withdrawal fails, you may be required to complete a withdrawal PII
               questionnaire on the Binance platform.
               Deposits: If an incoming deposit is delayed or temporarily frozen, you may be
               required to complete a deposit PII questionnaire on the Binance platform.



        Withdrawal and deposit questionnaire parameters
https://support.fireblocks.io/hc/en-us/articles/20851702645404-Travel-Rule-compliance-for-exchange-transactions                             4/6
26. 5. 19. 오전 9:48                                          Travel Rule compliance for exchange transactions – Fireblocks Help Center

        The tables below outline the parameters for completing Binance's and Bitstamp’s
                Don't see what you're looking for? Log in for the full Help Center experience
        withdrawal and deposit questionnaires, as well as Bitfinex's withdrawal questionnaire, for
        certain crypto transactions. Each field is explained to provide you with the proper
        guidance.                                   Fireblocks Help Center                         /


        Binance
            Binance Withdrawal Questionnaire Fields
            Binance Deposit Questionnaire Fields
        Bitstamp
            Bitstamp Withdrawal Questionnaire Fields
            Bitstamp Deposit Questionnaire Fields
        Bitfinex
            Bitfinex Withdrawal Questionnaire Fields
        OKex
            OKex Withdrawal Questionnaire Fields
        TrustCo
            TrustCo Withdrawal Questionnaire Fields



        Additional resources
               To learn how to create transactions through the Fireblocks Console, see Creating a
               New Transaction – API Parameters.
               To integrate Travel Rule compliance into your own application, see our Developer
               Guide: Constructing Encrypted PII Messages for Exchanges via Fireblocks.
        Additional Binance information
               Travel Rule
               Crypto deposits
               Withdrawals
        Additional Bitstamp information
               Travel Rule information
               Travel Rule documentation
               Crypto withdrawal
        Additional Bitfinex information
https://support.fireblocks.io/hc/en-us/articles/20851702645404-Travel-Rule-compliance-for-exchange-transactions                         5/6
26. 5. 19. 오전 9:48                                          Travel Rule compliance for exchange transactions – Fireblocks Help Center

               Understanding the Travel Rule
                  Don't see what you're looking for? Log in for the full Help Center experience

                                                                            Fireblocks Help Center                                      /



                                                              Was this article helpful?
                                                                       Yes              No

        ON THIS PAGE
              Overview
              How it works
              Binance troubleshooting failed or blocked transactions
              Withdrawal and deposit questionnaire parameters
              Additional resources


              Related Articles
                     Binance IP address change
                     401 Error, “Notabene Permissions Error”
                     Creating new transfers
                     Withdrawing your assets




      fireblocks.com           Status        API Docs         Console          info@fireblocks.com



      Fireblocks © 2026. All Rights Reserved. NMLS Registration Number: 2066055
      Privacy Policy




https://support.fireblocks.io/hc/en-us/articles/20851702645404-Travel-Rule-compliance-for-exchange-transactions                             6/6
