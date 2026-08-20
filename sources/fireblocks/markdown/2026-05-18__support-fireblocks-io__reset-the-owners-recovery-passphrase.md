<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/12545705435164-Reset-the-Owner-s-Recovery-Passphrase
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__reset-the-owners-recovery-passphrase.pdf
-->

# Reset the Owner's Recovery Passphrase

*Updated 1 year ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

## Before you begin

Before you can reset your recovery passphrase, you must have completed the user setup process on your mobile device and linked it to your workspace. Additionally, the method you used for Workspace Keys Backup impacts some of the steps below.

Fireblocks recommends deleting or destroying any recovery packages linked to the recovery passphrase you have forgotten or no longer have access to so that others cannot access it. This ensures that no copy of your recovery package is beyond your control, especially if personnel changes involving the workspace Owner and Admins occur at your organization.

- If the Workspace Keys Backup was completed by your organization, destroy the recovery package internally.
- If the Workspace Keys Backup was completed by a third party, contact them and ask them to destroy the recovery package.

## Resetting the Owner's recovery passphrase

To reset your recovery passphrase as the workspace Owner:

1. In the Fireblocks mobile app, tap **Settings > Change Passphrase** (Android) or **Settings > Reset Recovery Passphrase** (iOS).
2. Enter your Fireblocks mobile app PIN.
3. On the Reset Recovery Passphrase window, tap **Enter passphrase**. Create a new recovery passphrase that meets the minimum security requirements, then tap **Continue**.
4. Confirm your recovery passphrase, then tap **Continue**.

<!-- page: 2 -->

5. Use biometric authentication to complete the process. Your new recovery passphrase can now be used in a future Key Share Recovery scenario.

## Requesting a new recovery package

After you have completed the above, you must request for a new recovery package to be created.

- If you did a Workspace Keys Backup using an offline environment, request a new recovery package from Fireblocks Support.
- If you did a Workspace Keys Backup through a third-party DRS provider, contact Fireblocks Support and ask to recreate the recovery package you have with your DRS provider.

<!-- page: 3 -->

## Related Articles (from original)

- Reset an Admin or Signer's Recovery Passphrase
- Transfer workspace Owner
- Recovery Passphrase
- Security & Maintenance Best Practices
- Admin Quorum
