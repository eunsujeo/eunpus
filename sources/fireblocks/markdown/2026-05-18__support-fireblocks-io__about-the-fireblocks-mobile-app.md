<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/8744575638044-About-the-Fireblocks-mobile-app
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__about-the-fireblocks-mobile-app.pdf
-->

# About the Fireblocks mobile app

*Updated 3 years ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

The Fireblocks mobile app is a key component of your secure transaction approval and MPC-CMP signing workflows, as well as key workspace governance actions. The app has two primary purposes:

- It is where your workspace users who are authorized to sign and approve transactions complete these actions on their mobile devices.
- The app holds a cryptographic MPC key share in the secure enclave of each authorized user's device, which enables the device to be used for transaction signing.

Authorized users sign or approve transactions on compatible iOS or Android devices. Your workspace Owner and Admins also use it to approve workspace configuration changes, whitelisting of addresses, and external workspace connections for your workspace.

During the authorized user's initial setup, your workspace Owner approves and generates an MPC-CMP key share that is then stored in a secure enclave of their compatible mobile device.

> **Important**
>
> Since signing devices hold cryptographic MPC key shares in secure enclaves, the Fireblocks mobile app has hardware-encrypted data that does not upload itself to iCloud or Google Cloud.
>
> This is unique compared to your other phone apps. Therefore, you cannot do three things with the Fireblocks mobile app that you can with other apps:
>
> - Restore from iCloud
> - Uninstall, then re-install and connect to a workspace without assistance from your workspace Owner of Fireblocks Support
> - Add another biometric ID to your device, re-open the app, and continue to sign with it.
>
> This is why you should never uninstall your Fireblocks mobile app unless explicitly instructed to by Fireblocks Support. Doing so removes your signing key. Unless you are a

<!-- page: 2 -->

> workspace Owner, you have to re-download the app and re-enroll your device. If the Owner uninstalls the app, they must perform a Key Share Recovery for Owner's device.

You also have the option to replace the Fireblocks mobile app with an API Co-Signer to automate your approval and signing operations. This article is tailored toward mobile app users only.

<!-- page: 3 -->

## Related Articles (from original)

- Temporary removal of Fireblocks iOS app from Apple App Store in France (February 2023)
- MPC-CMP rollout for Fireblocks mobile application
- Re-enroll a user's mobile device
- Linked users - Fireblocks mobile app
- Send logs - Fireblocks mobile app
- Fireblocks mobile app updates
- Re-adding a user to the Fireblocks mobile app
- Operation Failed, something went wrong - Error 52
- Fireblocks mobile app update issues
- Unable to scan QR code
- Mobile device minimum requirements
- Mobile authentication methods
- Fireblocks mobile app on Android 15 unable to sign or approve notifications
- Why is my Fireblocks Android mobile application not working?
