<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/7220224809756-Fireblocks-mobile-app-Signing-transactions-approving-changes-and-other-options
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__fireblocks-mobile-app-signing-and-approving.pdf
-->

# Fireblocks mobile app: Signing transactions, approving changes and other options

*Updated 8 months ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

## Overview

When you open your Fireblocks mobile app it will either show your most recent approval or signing requests, or a blank screen if you have no pending requests.

<!-- page: 2 -->

## Approval screens: What gets approved through the app?

The following is a partial list of actions that you can approve with the Fireblocks mobile app:

- Signing all transaction types
- Authorizing all transaction types including:
  - Transfers
  - Contract calls
  - Minting and burning

<!-- page: 3 -->

  - Staking
  - Typed and raw messages
- Approving connections for:
  - New exchange accounts
  - New fiat accounts
  - New Fireblocks P2P Network connections and routing changes
  - New whitelisted addresses
- Approving workspace settings changes for:
  - Enabling one-time address transactions
  - 'Approve' transactions - amount cap
  - Transaction Policy changes
  - Adding new users
  - Updating the admin quorum
- Owner approval of MPC keys for new users with signing privileges

Your workspace Policies control which users approve and sign transactions. Your workspace Admin Quorum settings control how many users with an Admin role are required to approve new connections and most workspace settings changes.

## Approving changes & signing transactions

The Fireblocks mobile app automatically receives requests from the Fireblocks Console and the API. If an action requires approval by more than one user, the minimum number of required users must approve the notification before it expires.

The notification request is removed from all other relevant users if any user denies approval.

### Approving a configuration change

Approve new connections or changes to workplace settings using the Fireblocks mobile app by following these steps:

1. Open your Fireblocks mobile app to view all available approval requests. If there are multiple requests you can swipe between them to view each one.

<!-- page: 4 -->

2. Select **View**.
3. Review the request details and confirm they are correct.
4. Select **Approve ✓** to continue or **Deny X** to delete the request.

<!-- page: 5 -->

5. Enter your PIN code.
6. Confirm your identity using biometric security.
7. You have completed your approval. If the request requires approval from additional users, they must approve it using their devices.

### Signing a transaction

Sign transactions using the Fireblocks mobile app by following these steps:

1. Open your Fireblocks mobile app to view all available requests. If there are multiple requests you can swipe between them to view each one.
2. Select **View**.
3. Review the transaction details and confirm the source, asset, amount, and destination are correct.

<!-- page: 6 -->

4. Select **Approve ✓** to continue or **Deny X** to delete the request.
5. Enter your PIN code.
6. Confirm your identity using biometric security.
7. You have completed your transaction signing. You can follow the transaction status in the Recent activity panel of your Fireblocks Console.

### Reviewing the destination address

If the transaction destination is an exchange account, whitelisted address, or one-time address, you can select the destination on the transaction review screen to see the full address. The transaction source and all other destination types do not expand to display additional information.

<!-- page: 7 -->

Return to the transaction signing request by tapping anywhere on the screen outside the destination details.

Additional address details are subject to the following conditions:

- Viewing exchange account destination details requires the Fireblocks app with version 2.0.4 and above for iOS and 1.0.54 for Android.
- Exchange account destination details are only shown to the users permitted to sign the transaction.
- Exchange-to-exchange transfers don't display additional address details.
- This feature is not available when using the Fireblocks Cold Wallet app.

## Fireblocks mobile app options

The main screen of your Fireblocks mobile app will either show as blank or show your most recent pending approval(s). Here, you can take different actions:

- Use the **scan QR** button at the top right to connect to a new Fireblocks workspace or a Web3 application.
- Use the gear (iOS) or hamburger (Android) **Settings** menu. The menu looks different on iOS (left, opens a new window) and Android (right, pop-out menu in the same window).

<!-- page: 8 -->

  - **Linked Users**: View and manage workspace users linked to the mobile device
  - **Connect DeFi app**: Another way to open the QR scanner to connect a DeFi app
  - **Change/reset recovery passphrase**: Change your recovery passphrase if you forget or lose access to it.
  - **Send logs**: If you have issues with your app, you can send your mobile app logs to Support.
  - **Privacy Policy**
  - **About**

<!-- page: 9 -->

## Related Articles (from original)

- Security & Maintenance Best Practices
- Admin Quorum
- Approval groups
- Security aspects: Signing with the Fireblocks mobile app
