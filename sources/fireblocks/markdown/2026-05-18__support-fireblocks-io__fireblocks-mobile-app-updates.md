<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/4410612487442-Fireblocks-mobile-app-updates
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__fireblocks-mobile-app-updates.pdf
-->

# Fireblocks mobile app updates

*Updated 3 years ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

The Fireblocks app for iOS and Android is continuously updated.

## Update scenarios

- **New features**, including added functionality and new types of operations such as modifying or approving workspace changes.
- **Bug fixes** and stability improvements to the Fireblocks mobile app.
- **Compatibility**
  - Compatibility with new mobile OS versions or mobile device form factors.
  - Compatibility between mobile devices and changes to the Fireblocks SaaS. Fireblocks typically holds a grace period for backward compatibility, in addition to notifying users they need to update the mobile app.

## Update process

The update process is as follows:

1. The Fireblocks mobile app can be updated automatically or manually by the user, depending on device settings.
2. New changes are applied the next time the user opens the Fireblocks mobile app. Fireblocks does not perform background updates.

## Current app version vs. effective app version

When the Fireblocks mobile app opens, it sends a request to Fireblocks SaaS with the current mobile app version. Fireblocks SaaS then responds with any changes that should be applied immediately, if available. The current app version is most often the same as the effective app version.

<!-- page: 2 -->

For example, a user updated their mobile app to the newest version but Fireblocks SaaS responds with the effective version, which is the prior version. In this case, the Fireblocks mobile app has already downloaded the changes needed for the newest version but has not applied them yet. When Fireblocks SaaS eventually responds with the latest version as the effective version instead, the Fireblocks mobile app then applies the new functionality introduced with it, even though the user already updated the app at an earlier time.

## Verifying your identity

Some app updates are only applied after requesting verification by the user. You will see a notification that reads **To complete this update, please verify your identity** when this occurs. This includes when the Fireblocks mobile app needs to apply updates to the private key shares stored on the mobile device. Key material is always stored in the secure enclave layer of the mobile device, therefore updating these components requires user verification using their Fireblocks PIN code, biometrics authentication (either face identification or fingerprint identification, depending on the mobile device), and the recovery passphrase.

## Automatic app updates

For the most complete, compatible, and stable version, Fireblocks recommends enabling **automatic app updates**.

<!-- page: 3 -->

## Related Articles (from original)

- About the Fireblocks mobile app
- Re-enroll a user's mobile device
- Linked users - Fireblocks mobile app
