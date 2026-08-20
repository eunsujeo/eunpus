26. 5. 19. 오전 9:47                                                   Setting up Travel Rule integration – Fireblocks Help Center


                     Don't see what you're looking for? Log in for the full Help Center experience

                                                                             Fireblocks Help Center Search the Help Center /



        Fireblocks Help Center              Identity & Compliance               Travel Rule: Notabene


        Setting up Travel Rule integration

             Note
             The Travel Rule integration is a premium, opt-in feature that requires an additional
             purchase. Contact your Customer Success Manager for more information.


        Before you begin
           1. Create a Notabene account.
           2. Edit your Notabene account settings according to your preferences.
           3. Complete the process of enabling the Compliance tab.



        Initial setup
        After completing the prerequisite steps above, you can integrate the Travel Rule feature
        into your workspace.

             Note
             By default, your Notabene production environment is connected to your Fireblocks
             production environment, and your Notabene sandbox environment is connected to
             your Fireblocks sandbox environment. For any other configuration, contact Fireblocks
             Support.


        Connecting one Notabene entity
        To connect a single Notabene entity to your workspace:

https://support.fireblocks.io/hc/en-us/articles/8271611252764-Setting-up-Travel-Rule-integration                                   1/4
26. 5. 19. 오전 9:47                                                   Setting up Travel Rule integration – Fireblocks Help Center

           1. In the Fireblocks Console, go to Settings > Compliance > Travel rule > Connect
                  Don't see what you're looking for? Log in for the full Help Center experience
              provider.
           2. Enter the API key, Secret key, and VASP DID key that you retrieved from your
              Notabene dashboard.                   Fireblocks Help Center                        /
           3. Select Connect provider.
           4. Once approved, you receive an email notification that your Travel Rule integration
              has been set up.
           5. Integrate the Travel Rule Fireblocks SDK in order to submit transactions for Travel
               Rule validation.
        Connecting multiple Notabene entities
        To connect multiple Notabene entities to your workspace:
           1. Create all of your VASP entities in the Notabene Dashboard. The Gateway VASP will
              act as parent while the other VASPs will become subsidiaries. Learn more.
           2. Contact Notabene to establish the relationship between your Gateway and
              subsidiary VASPs.
           3. After Notabene has established the Gateway and subsidiary relationships, generate
              API credentials for your Gateway VASP using your Notabene dashboard.
           4. Update your Notabene settings to allow your subsidiary VASPs to be controlled by
              your Gateway.
           5. In the Fireblocks Console, go to Settings > Compliance > Travel rule > Connect
              provider.
           6. Enter your Gateway VASP’s API key, Secret key, and VASP DID from your Notabene
              dashboard.
           7. Select Connect provider.
           8. Once approved, you receive confirmation that your Travel Rule integration has been
              set up.
           9. Integrate the Travel Rule Fireblocks API calls so you can submit transactions for
              Travel Rule validation.
                       When integrating the Fireblocks API, you will create an encryption key for
                       your Gateway VASP. You should assign this encryption key to your
                       subsidiary VASPs as well.
        10. Use the Fireblocks API to define which vault accounts should be connected to
            which VASPs.
                    Each vault account may only be connected to a single VASP.
                    Each VASP can be connected to as many vault accounts as needed.
        When creating outgoing transactions, you can define the originatorVASPdid parameter to
        be any your VASPs. The VASP DID value must be valid.
        When receiving incoming transactions, the recipient vault account’s assigned VASP is used
        in the Travel Rule check. If no VASP DID is assigned to the recipient vault account, the
        Gateway VASP DID is used by default.
https://support.fireblocks.io/hc/en-us/articles/8271611252764-Setting-up-Travel-Rule-integration                                   2/4
26. 5. 19. 오전 9:47                                                   Setting up Travel Rule integration – Fireblocks Help Center

        Notabene   screening
             Don't see          settings
                       what you're looking for? Log in for the full Help Center experience
        After setting up the Travel Rule integration, we recommend defining which Notabene
        status your Travel Rule transaction must reach  in order
                                                   Fireblocks HelptoCenter
                                                                     complete the Fireblocks   /
        screening. You can configure these settings using your Notabene dashboard. Learn more.
        Updating your API keys
        To switch to a new set of Notabene API keys, submit a ticket to Fireblocks Support and
        provide your new API key, Secret key, and VASP DID key. The Fireblocks team will update
        the keys for your integration.



        Travel Rule Transaction Screening Policy
        The Travel Rule integration uses your workspace's Travel Rule Transaction Screening Policy
        to determine which incoming and outgoing transactions to screen. Upon activating the
        Travel Rule integration, the default Travel Rule Transaction Screening Policy is used until you
        create an optional custom policy.



        Travel Rule Post-Screening Policy
        The Travel Rule integration uses your workspace's Travel Rule Post-Screening Policy to pre-
        determine what action to take on a screened transaction based on the screening result
        returned by Notabene. Upon activating the Travel Rule integration, the default Travel Rule
        Post-Screening Policy is used until you create an optional custom policy.



        Testing transactions
        We recommend creating test transactions to verify functionality. You can use Notabene's
        RoboVASPs to test your Travel Rule transactions. Learn more.



                                                               Was this article helpful?
                                                                         Yes              No

        ON THIS PAGE
https://support.fireblocks.io/hc/en-us/articles/8271611252764-Setting-up-Travel-Rule-integration                                   3/4
26. 5. 19. 오전 9:47                                                   Setting up Travel Rule integration – Fireblocks Help Center

              Before you begin
                     Don't see what you're looking for? Log in for the full Help Center experience
              Initial setup
              Travel Rule Transaction Screening Policy Fireblocks Help Center                                                      /

              Travel Rule Post-Screening Policy
              Testing transactions


              Related Articles
                     Address Registry
                     Travel Rule Support Overview
                     401 Error, “Unauthorized: Access Denied”
                     About the Travel Rule
                     Troubleshooting user setup
                     Initial user setup
                     Manage your 2FA
                     Travel Rule Transaction Screening Policy




      fireblocks.com           Status         API Docs          Console         info@fireblocks.com



      Fireblocks © 2026. All Rights Reserved. NMLS Registration Number: 2066055
      Privacy Policy




https://support.fireblocks.io/hc/en-us/articles/8271611252764-Setting-up-Travel-Rule-integration                                       4/4
