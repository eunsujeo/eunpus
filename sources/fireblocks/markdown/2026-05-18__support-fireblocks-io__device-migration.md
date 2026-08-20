<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/11288189152924-Device-migration
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__device-migration.pdf
-->

# Device migration

*Updated 4 months ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

> **Security warning**
> Device migration transfers your private key share to any new device without administrative approval. This presents security risks if the new device is compromised.

## Overview

Migrate your Fireblocks mobile app from your old device to a new device independently through an authentication process.

## Before you begin

Workspace Owners must enable device migration first:

1. In the Fireblocks Console, go to **Settings > General > Linked user migration**.
2. Restart your Fireblocks mobile app after enabling the feature.

## Migrate with your old device available

Install a fresh copy of the Fireblocks mobile app on your new device and tap **I have a new device**. Do not use a backup version of the mobile app!

### Export from your old device

1. Open the Fireblocks mobile app and go to **Settings > Linked users**.
2. Select the user to export.
   - For iOS devices, swipe right-to-left on the user and then tap **Export**.
   - For Android devices, tap the three dots next to the user's name and then tap **Export user**.

<!-- page: 2 -->

3. Enter your PIN, then tap **Continue**.
4. Enter your passphrase, then tap **Continue**.
5. Complete biometric authentication.

Your device generates a QR code valid for one hour.

### Import to your new device

1. On your new device, tap **Import existing user** (if this is the first user on the new device) or **Scan QR Code** (if the new device already has one or more users on it).
2. Enter a new PIN, then tap **Continue**.
3. For first-time users, tap **Allow** and provide biometric authentication.
4. Enter your passphrase and tap **Continue**.

The new device imports your profile and signing keys. After completion, your user and signing keys are automatically deleted from the old device. You'll also receive a confirmation email from Fireblocks Support that the mobile device assigned to your user has been reset, and that you need to pair your new device with the workspace.

## Migrate when your old device is unavailable

- **Workspace Owners**: Submit a request to Fireblocks Support for device re-enrollment assistance.
- **Other users**: Contact your workspace owner to request re-enrollment.

<!-- page: 3 -->

## Related Articles (from original)

- BCHA to XEC migration
- Polygon migration
- Polkadot Migration to Asset Hub
- MATIC to POL migration
