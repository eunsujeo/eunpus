<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/4407786072082-Re-enroll-a-user-s-mobile-device
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__re-enroll-a-users-mobile-device.pdf
-->

# Re-enroll a user's mobile device

*Updated 2 days ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

Admin-level users can re-enroll another user's mobile device from the Fireblocks Console when the user needs to re-link their device to the workspace. A user may need their device re-enrolled if they:

- Changed their device's biometric settings
- Uninstalled the Fireblocks mobile app
- Installed the Fireblocks mobile app on a new device
- Forgot the 6-digit PIN they set up for the Fireblocks mobile app

## Re-enroll a non-Owner device

> **Note**: If other users or workspaces are linked to the device, they must each be re-enrolled individually.

To re-enroll a user's mobile device:

1. In the Fireblocks Console, go to **Settings > Users**.
2. Find the user, then select the more actions menu (⋮) > **Re-enroll mobile device**.

An approval request is sent to the workspace Owner. After the Owner approves, the user logs in to the Fireblocks Console, scans the on-screen QR code with the Fireblocks mobile app, and follows the in-app instructions to complete re-enrollment.

If the user has signing privileges, the Owner must re-approve the user's Multi-Party Computation (MPC) key shares within two days of the user re-enrolling their device. Once the Owner approves the new MPC key shares, the user has two days to complete MPC registration.

## Re-enroll the workspace Owner's device

Re-enrolling the workspace Owner's mobile device requires Fireblocks Support and cannot be done through the Console. Contact Fireblocks Support to start the process. This applies even if the user is the Owner of a different workspace.

<!-- page: 2 -->

## Related Articles (from original)

- Temporary removal of Fireblocks iOS app from Apple App Store in France (February 2023)
- MPC-CMP rollout for Fireblocks mobile application
- Linked users - Fireblocks mobile app
- Send logs - Fireblocks mobile app
- Fireblocks mobile app updates
- Re-adding a user to the Fireblocks mobile app
- Operation Failed, something went wrong - Error 52
- Fireblocks mobile app update issues
- Why is my Fireblocks Android mobile application not working?
- About the Fireblocks mobile app
- Re-enrolling API users
- Mobile device minimum requirements
- Mobile authentication methods
