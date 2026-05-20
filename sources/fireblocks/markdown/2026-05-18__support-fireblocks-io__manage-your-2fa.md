<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/360012705600-Manage-your-2FA
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__manage-your-2fa.pdf
-->

# Manage your 2FA

*Updated 2 days ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

Two-factor authentication (2FA) is required for all users to sign in to the Fireblocks Console. This article covers setting up 2FA on a new device, resetting your 2FA if you lose access, and migrating your 2FA to a new device.

Fireblocks supports any Time-based One-Time Password (TOTP) authenticator app, such as Google Authenticator, Microsoft Authenticator, LastPass Authenticator, or Yubico Authenticator.

## Set up 2FA

To set up 2FA:

1. Install a TOTP authenticator app on your mobile device.
2. Go to the Fireblocks Console Login page and enter your login details. A 2FA QR code displays.
3. In your authenticator app, scan the QR code to add Fireblocks as a new account.
4. Enter the 6-digit code from your authenticator app into the Fireblocks Console.

After setup, enter the 6-digit code from your authenticator app each time you sign in to the Fireblocks Console.

> **Note**: If your 2FA code is rejected, verify that the time is correct on both your computer and mobile device. TOTP codes are time-sensitive.

If you're completing initial user setup, return to user setup for the next onboarding step.

## Reset your 2FA

If you lose access to your 2FA device, your workspace Owner must reset your 2FA before you can sign in again.

1. Contact your workspace Owner to request a 2FA reset.
2. After the Owner resets your 2FA, you'll receive a confirmation email.
3. Sign in to the Fireblocks Console and set up 2FA again as described above.

<!-- page: 2 -->

## Migrate your 2FA to a new device

Migrate your 2FA before you stop using your old device. Once your old device is no longer accessible, you'll need to ask your workspace Owner to reset your 2FA.

1. On your old device, use your authenticator app's export or transfer feature to generate a QR code for your Fireblocks account. For example, in Google Authenticator: sidebar menu > **Transfer accounts** > **Export accounts**.
2. On your new device, install the same authenticator app and scan the QR code from your old device.
3. Sign in to the Fireblocks Console using a code from your new device to confirm setup.

<!-- page: 3 -->

## Related Articles (from original)

- Reset a user's 2FA
- Re-adding a user to the Fireblocks mobile app
- Troubleshooting user setup
- User roles
- Initial user setup
- Setting up Travel Rule integration
- Cold Wallet device can't read QR code animation
- Two-factor authentication (2FA) failure
