<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/4404971260050-Delete-users
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__delete-users.pdf
conversion_notes: |
  Manual extraction from PDF. UI chrome removed.
-->

# Delete users

*Updated 2 days ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

Workspace Owners can delete users from the Fireblocks Console. Deletion is immediate, does not require mobile approval, and revokes the user's access to the workspace.

## Before you delete a user

Before deleting a user, verify that:

- They are not required to reach the Admin Quorum threshold.
- They are not required to fulfill any Policy rules.

If you need to revoke access urgently and cannot update your Policies first, you can delete the user and edit Policies afterward. Any Policy rules that required the deleted user will be blocked until you modify and approve them.

## Delete a user

1. In the Fireblocks Console, go to **Settings > Users**.
2. Find the user you want to delete, then select the more actions menu (⋮) > **Delete User**.

## What happens when you delete a user

- The user's access to the workspace is revoked immediately.
- If the user has access to other workspaces, those are not affected.
- Fireblocks deletes the user's cloud-based key shares.
- The user's activity is preserved in transaction history and audit logs.
- The user ID remains in the user list with the status **deleted**.

## Allow Admins to delete users

By default, only the workspace Owner can delete users. To let Admins delete users with Approval group consent instead:

1. In the Fireblocks Console, go to **Settings > Quorums > Approval groups**.
2. Expand **User management**, then select **Edit** on the Delete users row.
3. Make sure that the Approval permission is set to **admin quorum or approval group**, then uncheck **Requires workspace owner approval**.

<!-- page: 2 -->

4. Select **Save**.
