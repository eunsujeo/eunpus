<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/6429764039452-Recovery-Passphrase
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__recovery-passphrase.pdf
-->

# Recovery Passphrase

*Updated 2 years ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

## Overview

The workspace Owner, Admins, and Signers must create a recovery passphrase with the Fireblocks mobile app as part of their initial user setup. Fireblocks uses the recovery passphrase to create an encrypted backup of the mobile device's private key share, which is stored securely in Fireblocks' cloud servers.

This recovery passphrase is used for private key recovery, so in addition to memorizing it, you should keep a copy of it in a secure location that you can access quickly if necessary. However, it can be reset if you lose or forget it.

If your workspace Owner forgets their recovery passphrase, they cannot perform Owner-only administrative or approval actions until they recover their key share.

## Recovery passphrase requirements

Your recovery passphrase must contain the following:

- At least 10 characters
- At least one capital letter
- At least one number
- At least one special character

The Fireblocks mobile app validates that your recovery passphrase meets these requirements.

<!-- page: 2 -->

## Verifying your recovery passphrase

The Verify Passphrase feature on the Fireblocks mobile app lets the Owner, Admins, and Signers confirm their recovery passphrase without performing an actual recovery.

To use the Verify Passphrase feature, a user must have the Owner, Admin, or Signer role in at least one workspace, and they must have completed the user setup process on their mobile device.

### Using Verify Passphrase

To verify your recovery passphrase:

1. In the Fireblocks mobile app, tap **Settings > Verify recovery passphrase**.
2. On the Verify recovery passphrase screen, enter your recovery passphrase. The Fireblocks app simulates a recovery to validate the passphrase by downloading the backed-up copy of your key share from the Fireblocks cloud servers, then attempts to decrypt it using the passphrase you entered.
3. When you enter the correct passphrase, you receive a confirmation. When you enter an incorrect passphrase, you can try again on the same screen. However, if you enter an incorrect password three times in a row, you are blocked from trying again for five minutes.

Keep in mind that if you have linked multiple users to your Fireblocks mobile app, some users may have different recovery passphrases. If any of those users have other passphrases, or if they are inactive (e.g., removed from workspace, migrated to a new device, temporarily frozen, or never completed setup), either **Incorrect** or **Inactive** appears next to them.

## Periodic Passphrase Verification

> **Note**: The Periodic Passphrase Verification feature is available on the Fireblocks mobile app starting from version 2.5.7 for iOS and version 2.5.2 for Android.

Fireblocks recommends that workspace Owners, Admins, and Signers verify their recovery passphrase monthly, or any time they suspect they may have forgotten their recovery passphrase. To help with this, these users automatically receive a Periodic Passphrase Verification notification on their Fireblocks mobile app.

The Periodic Passphrase Verification notification does not affect these users' ability to perform workspace operations. It can be dismissed by swiping up the card in the app and

<!-- page: 3 -->

completed later if needed.

If you have linked multiple users to your Fireblocks mobile app, you will only receive one Periodic Passphrase Verification notification every 30 days. This notification verifies all linked users.

If some users appear as **Verified** but others as **Incorrect** after you verify your recovery passphrase, you can take one of two actions:

1. Select **Change all recovery passphrases** to reset the recovery passphrase for all the users linked to your Fireblocks mobile app. You'll need to enter your Fireblocks mobile app PIN, create a new passphrase that meets the minimum security requirements, and then verify all the linked users using the new passphrase.
2. Select **Verify another passphrase** to enter another recovery passphrase and verify additional users. You can repeat this process until all the linked users are verified, but if you have more than three unsuccessful attempts, you will be blocked from further attempts for five minutes.

### Risk assessment

Workspace Owners and Admins can review the status of key share risks in the workspace's audit logs. The logs include information such as when notifications to verify a passphrase were sent and whether a user correctly verified it.

## When to use your recovery passphrase for key recovery

There are three scenarios where you use your recovery passphrase for key recovery.

### Recovering your Owner key share using your passphrase

You are the workspace Owner and your device is lost or damaged, or you want to install the Fireblocks mobile app on a new device. Your private key share recovery method requires you to enter your recovery passphrase.

You can also perform key recovery without a password.

### Recovering your key share using another authorized signer's recovery passphrase

You have an Admin or Signer role in your workspace, and your signing device is lost or damaged (e.g., a natural disaster or a problematic mobile operating system update) so you have to use someone else's device to recover your private key share.

<!-- page: 4 -->

### Reconstructing the full private key for your workspace

You are the workspace Owner and you want to reconstruct your full private key as part of a Workspace Keys Recovery procedure.

We recommend occasionally verifying your Workspace Keys Recovery process using your recovery passphrase to ensure you can reconstruct your key when needed.

<!-- page: 5 -->

## Related Articles (from original)

- MPC-CMP rollout for Fireblocks mobile application
- Reset an Admin or Signer's Recovery Passphrase
- Reset the Owner's Recovery Passphrase
- Withdrawing your assets
- Settings & Configuration
- Verifying a recovery package
- Recovering private key material
- Reconstructing your workspace
- Third-Party Disaster Recovery Services
- What happens if I forgot my Fireblocks mobile application passphrase?
- Native Workspace Key Backup and Recovery with Python Script
- About Backup and Recovery
- Mobile Key Share Backup and Recovery with a Third-Party DRS
- Security & Maintenance Best Practices
- About the Fireblocks Recovery Utility
- How to perform Key Backup and Recovery
- Disaster Recovery Service: CoinCover
- Mobile Key Share Backup and Recovery
- Generating a Workspace Key Backup Package - Fireblocks Recovery Utility
