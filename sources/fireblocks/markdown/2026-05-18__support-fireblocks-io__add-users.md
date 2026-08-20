<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/360021546999-Add-users
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__add-users.pdf
conversion_notes: |
  Manual extraction from PDF. UI chrome removed.
-->

# Add users

*Updated 2 days ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

Workspace Owners, Admins, and Non-Signing Admins can add and manage users from the Users page in the Fireblocks Console. The Users page lists all users in the workspace along with their roles and current status.

## Add a user

1. In the Fireblocks Console, go to **Settings > Users**, then select **Add user**.
2. On the Add user window, enter the new user's name and email address, then select a user role.
3. At the bottom of the window, select **Add user**.

> **Tip**: Assign user roles according to the principle of least privilege. Give each user only the permissions they need to do their job.

## Approval process

After a user is added, the workspace Owner and the Admin Quorum receive a request to approve the new user on their mobile devices. The approval threshold must be met within seven days, or the request expires and the user is not added.

The Owner's approval is *mandatory* and can count toward the approval threshold. For example, if the threshold is three out of five:

- Two Admins and the Owner meet the threshold, and the request is approved.
- Three Admins meet the threshold, but the request is not approved until the Owner also approves.

### Approving a user with signing privileges

If the new user's role can sign transactions, the Owner must also approve the derivation of a key share for the user's Multi-Party Computation (MPC) device. This is a separate approval from the initial user-add approval, and both must be granted before the user becomes active in the workspace.

## After approval

<!-- page: 2 -->

Once the Owner and the Admin Quorum approve the new user, the user can complete the initial user setup process.

## Related Articles (from original)

- User roles for Cold Wallet workspaces
- User roles
- Best practices for choosing user roles
