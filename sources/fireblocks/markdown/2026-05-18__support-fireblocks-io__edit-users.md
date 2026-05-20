<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/9747031353244-Edit-users
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__edit-users.pdf
conversion_notes: |
  Manual extraction from PDF. UI chrome removed.
-->

# Edit users

*Updated 2 days ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

Admin-level users can edit other users' names and email addresses from the Users page in the Fireblocks Console. Changing a user's role is a separate process and is not done through the user edit flow.

## Edit a user's name and email

Before you begin:

- The workspace's Owner cannot change their own name or email address.
- You can only change a user's name or email address before they begin the setup process or after they complete it.
- Name and email changes apply only to the current workspace, not to other workspaces linked to the user's account.
- All users in a workspace must have unique email addresses.

To edit a user's name and email:

1. In the Fireblocks Console, go to **Settings > Users**.
2. Find yourself or the user you want to edit, then select the more actions menu (⋮) > **Edit user**.
3. Enter the user's first name, last name, and email address, then select **Save changes**.

> **Tip**: Communicate with the user before making changes. They receive automated notifications, but a heads-up avoids surprises.

After you save the changes, an email is sent to the user notifying them of the change and who initiated it, and an approval request is sent to the Owner and the Admin Quorum. Once approved, the changes take effect and the user receives a second email confirming the update.

You can use Approval groups to customize this approval flow.

## Change a user's role

The Fireblocks Console does not support changing a user's role directly (for example, from Viewer to Signer, or Signer to Admin). To change a user's role, delete the user and recreate

<!-- page: 2 -->

them with the new role.

Before deleting the user, verify whether they are needed to fulfill any Policy rules or complete the Admin Quorum. Removing them may affect workspace operations.

1. Delete the user.
2. Add the user again with the new role.

### Submit a request to Fireblocks Support

Use this option when deleting and recreating the user would be detrimental to your workspace.

1. Open a Support request.
2. On the form, set the following:
   - **Tasks**: User Operations
   - **User Operations**: Change user's role

All Support requests are subject to our SLA guidelines.

## Related Articles (from original)

- User roles for Cold Wallet workspaces
- User roles
- Best practices for choosing user roles
