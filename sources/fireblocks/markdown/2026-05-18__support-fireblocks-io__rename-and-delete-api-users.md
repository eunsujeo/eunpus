<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/27491829465372-Rename-and-delete-API-users
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__rename-and-delete-api-users.pdf
-->

# Rename and delete API users

*Updated 2 days ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

You can rename and delete API users from the Developer Center in the Fireblocks Console. Renaming is reversible; deletion is permanent and can break active integrations or Policy rules.

## Rename an API user

Admin-level users can rename API users. Renaming does not change the user's API key or affect any integration using it.

To rename an API user:

1. In the Fireblocks Console, go to **Developer Center > API users**.
2. Find the API user, then select the more actions menu (⋮) > **Rename**.
3. In the **API user name** field, enter a new name, then select **Save**.

An approval request is sent to the workspace Owner and the Admin Quorum. Once approved, the new name takes effect.

## Before you delete an API user

Before deleting an API user, verify that:

- The API user is not required to reach the Admin Quorum threshold.
- The API user is not required to fulfill any Policy rules.
- The API user is not actively used by a third-party integration. Deleting the API user breaks the integration.

If you need to revoke access urgently and cannot update your Policies first, you can delete the API user and edit Policies afterward. Any Policy rules that required the deleted API user will be blocked until you modify and approve them.

## Delete an API user

By default, only the workspace Owner can delete API users. Deletion is immediate, does not require mobile approval, and revokes the API user's access to the workspace.

1. In the Fireblocks Console, go to **Developer Center > API users**.

<!-- page: 2 -->

2. Find the API user, then select the more actions menu (⋮) > **Delete**.

## What happens when you delete an API user

- The API user's access to the workspace is revoked immediately.
- The API key becomes invalid. Any third-party integration using it stops working.
- In-flight transactions signed by the API user fail. New signing requests are rejected.
- The API user remains paired with any Co-signer it was paired with. Unpairing is a separate operation.
- The API user's activity is preserved in audit logs.
- The API user remains in the API users list.

## Allow Admins to delete API users

By default, only the workspace Owner can delete API users. To let Admins delete API users with Approval group consent, configure the same **Delete users** permission used for Console users. See *Delete users* for the procedure.

<!-- page: 3 -->

## Related Articles (from original)

- Allowlist IP addresses for API user requests
- Add API users
- Getting started with Fireblocks Key Link
- Developer Center
- Re-enrolling API users
- API user stuck in Pending Setup status
