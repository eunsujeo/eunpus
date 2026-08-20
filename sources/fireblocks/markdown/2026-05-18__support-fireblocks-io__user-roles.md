<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/360012832959-User-roles
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__user-roles.pdf
conversion_notes: |
  Manual extraction from PDF. UI chrome (search bar, footer, "Don't see what...") removed.
  Permission table cells with checkmarks normalized to Y/N; condition labels kept as-is.
-->

# User roles

*Updated 5 days ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

## Overview

Workspace roles control what each user can see and do in the Fireblocks Console and via the API. Your workspace Owner assigns roles to both Console and API users during setup, though some assignments require approval from the Admin Quorum. For setup instructions, see *Adding new Console users* and *User setup*.

Fireblocks supports two types of workspace users:

- **Console user**: Accesses and operates the Fireblocks Console according to the privileges of their assigned role.
- **API user**: Interacts with the Fireblocks platform via the API according to the privileges of their assigned role. API users are also used in the API Co-signer feature.

When adding users who can sign transactions, an MPC key share must be approved for their device during setup. Without this approval, their signing attempts will fail. To track MPC key share approval status, go to **Settings > Users** and check the **Status** column for the *Pending Owner MPC Key Approval* step.

For a complete breakdown of permissions, see the user role access tables below. For guidance on choosing the right roles for your team, see *Best practices for user roles*.

> **Looking for Cold Wallet user roles?**
> This article covers user roles in hot workspaces. For cold workspace user roles, see *User roles in cold workspaces*.

## Owner

The Owner is an Admin user who approves multi-party computation (MPC) signing devices, new users, and Policy changes. Every workspace requires one (and only one) Owner to set up the Vault.

<!-- page: 2 -->

For security, the Owner role must be assigned by Fireblocks Support. When the Owner wants to change their role, migrate to a new mobile device, or unfreeze the workspace, they must first verify their identity with Fireblocks Support via a short video call.

The Owner is typically responsible for:

- Approving new signing devices and MPC key shares
- Approving new workspace users
- Approving new external connections
- Creating API keys
- Deleting workspace users
- Enabling advanced workspace features
- Creating, editing, and approving workspace policies
- Approving Policy changes, together with the Admin Quorum
- Resetting Two-Factor Authentication (2FA)
- Emergency operations like freezing the workspace, creating a backup kit, and recovery

## Admin

An Admin has all Signer role permissions, can expand the network, approve new whitelisted addresses, edit all workspace settings, add new workspace users, and manually confirm and credit inbound transactions by marking them as complete.

Admins are typically responsible for:

- Independent initiation and signing of some transactions, as defined by the Policy
- Approving transactions initiated and signed by other users
- Part of the Admin Quorum for approving workspace and Policy changes (Owner approval also required for Policy changes)
- Ideal for smaller teams where a few users handle multiple operations
- Emergency operations like freezing the workspace

## Non-Signing Admin

A Non-Signing Admin can approve transactions and perform administrative operations, such as approving new whitelisted addresses, exchange accounts, and Fireblocks P2P Network connections, and adding new workspace users. This role does not hold an MPC key share, but can be defined as the second authorizer in the Policy and can initiate transactions when the Policy assigns a designated signer.

Non-Signing Admins are typically responsible for:

<!-- page: 3 -->

- Approving transactions before another user signs them
- Typically uses the Fireblocks Console, but can also use the Fireblocks mobile app to approve requests
- Part of the Admin Quorum for approving workspace changes
- Ideal for separating signing and approval responsibilities in your Policies
- Used as an API user for approving workspace configurations on mainnet Co-signers or on testnet workspaces using the Fireblocks Communal API Co-signer
- Emergency operations like freezing the workspace

## Signer

A Signer can initiate, approve, and sign transactions, and request to add whitelisted addresses and other new connections. Signers can operate via the Fireblocks Console and mobile app, or programmatically via an API Co-signer and Callback Handler.

## Approver

An Approver can initiate and approve transactions but cannot sign them. They can also request to add whitelisted addresses and other new connections. You can define an Approver as the second authorizer in Policies. This role works well for users focused on transaction approval workflows and general account oversight.

## Editor

An Editor can perform view-only queries, add wallets (except for Algorand token wallets), connect exchange accounts, create new vault addresses, and cancel transactions. An Editor can also initiate certain transactions if the Policy defines another user capable of signing as a designated signer for that transaction type. This role is well suited for API-based workflows involving transactions, vault management, and connection requests, as well as all transaction types except internal exchange transfers.

## Viewer

A Viewer has view-only privileges for all workspace activity. They cannot access settings, submit new transactions, or submit connections for approval. This role is suited for auditing

<!-- page: 4 -->

workspace activity via the Console or the API.

## Security Auditor

The Security Auditor role gives auditors and security personnel read-only access to the Console, including Settings, Policies, and Fireblocks Security Posture Management (FSPM). This role provides broader viewing access than the Viewer role but cannot perform any actions. To assign this role, go to **Settings > Users** and add it as you would any other role.

Security Auditors are typically responsible for:

- Reviewing all workspace settings for compliance audits
- Monitoring policy configurations
- Auditing workspace activity with full visibility

## Security Admin

The Security Admin role is designed for IT and security personnel to manage platform security and operational configurations. This role has broad administrative powers over users and settings but does not hold MPC keys and cannot initiate or sign transactions. When logging into the Fireblocks Console, users with this role automatically land on the **Security Center** page.

Security Admins are typically responsible for:

- Managing Console and API user lifecycles (create, delete, edit)
- Managing user groups and resetting 2FA
- Configuring and assigning IP allowlists for Console and API users
- Managing Fireblocks Security Posture Management (FSPM) and findings
- Participating in the Admin Quorum for workspace and policy changes
- Emergency operations such as freezing the workspace

## User role access tables

The tables below list what each role can and cannot do. Labels in cells indicate conditions that apply.

- **Q** (Quorum required): Must be approved by the Admin Quorum.

<!-- page: 5 -->

- **Q+O** (Quorum + owner required): Must be approved by both the Admin Quorum and the Owner.
- **AG** (Approval group): Only when part of an approval group that does not require the Owner.
- **NS** (Needs signer): Only if you designate a signer for their transactions. Non-Signing Admins and Editors can initiate all transactions except internal exchange transfers.
- **TL** (Token limits): These roles cannot create Algorand, Ripple, Solana, or Stellar token wallets.

### User management

| Does this role… | Owner | Admin | NSA | Signer | Approver | Editor | Viewer | SecAud | SecAdmin |
|---|---|---|---|---|---|---|---|---|---|
| Require the Fireblocks mobile app | Y | Y | Y | Y | Y | N | N | N | Y |
| Require a Fireblocks mobile app passphrase | Y | Y | N | Y | N | N | N | N | Y |
| Provision MPC signing keys | Y | N | N | N | N | N | N | N | N |
| Add Console or API users | Y (Q) | Y (Q) | Y (Q) | N | N | N | N | N | Y (Q) |
| Delete users | Y | Y (AG) | N | N | N | N | N | N | Y |
| Edit user details (name and email) | Y | Y | Y | N | N | N | N | N | Y |
| Add and manage user groups | Y | Y | Y | N | N | N | N | N | Y |
| Modify API User/Key IP Allowlist | Y | N | N | N | N | N | N | N | Y |
| Reset 2FA | Y | N | N | N | N | N | N | N | Y |
| Re-enroll devices | Y (Q) | Y (Q) | Y (Q) | N | N | N | N | N | Y (Q) |
| Request to re-enroll devices | Y | Y | Y | N | N | N | N | N | Y |

<!-- page: 6 -->

| Does this role… | Owner | Admin | NSA | Signer | Approver | Editor | Viewer | SecAud | SecAdmin |
|---|---|---|---|---|---|---|---|---|---|
| Approve re-enrolling devices | Y | N | N | N | N | N | N | N | Y (Q) |
| View all workspace users | Y | Y | Y | N | N | N | N | Y | Y |

### Transactions

| Does this role… | Owner | Admin | NSA | Signer | Approver | Editor | Viewer | SecAud | SecAdmin |
|---|---|---|---|---|---|---|---|---|---|
| Initiate transactions | Y | Y | Y (NS) | Y | Y | Y (NS) | N | N | N |
| Approve transactions | Y | Y | Y | Y | Y | N | N | N | N |
| Sign transactions | Y | Y | N | Y | N | N | N | N | N |
| Cancel transactions | Y | Y | Y | Y | Y | Y | N | N | N |
| Freeze/unfreeze transactions | Y | Y | Y | N | N | N | N | N | N |
| Edit transaction notes | Y | Y | Y | Y | Y | Y | N | N | N |
| Export transaction history | Y | Y | Y | Y | Y | Y | Y | N | N |
| Create and manage automation rules | Y | Y | Y | Y | N | Y | N | N | N |
| Create smart transfer tickets | Y | Y | Y | Y | N | Y (NS) | N | N | N |
| Fund smart transfer tickets | Y | Y | Y (NS) | Y | N | Y (NS) | N | N | N |

### Assets and addresses

| Does this role… | Owner | Admin | NSA | Signer | Approver | Editor | Viewer | SecAud | SecAdmin |
|---|---|---|---|---|---|---|---|---|---|
| Create vault accounts | Y | Y | Y | Y | Y | Y | N | N | N |

<!-- page: 7 -->

| Does this role… | Owner | Admin | NSA | Signer | Approver | Editor | Viewer | SecAud | SecAdmin |
|---|---|---|---|---|---|---|---|---|---|
| Rename vault accounts | Y | Y | Y | Y | Y | N | N | N | N |
| Add asset wallet to a vault account or whitelisted wallet | Y | Y | Y (TL) | Y | Y (TL) | Y (TL) | N | N | N |
| Hide or unhide vault accounts | Y | Y | Y | Y | Y | Y | N | N | N |
| Add/whitelist a new destination (Network, exchange, fiat, internal/external wallets) | Y (Q) | Y (Q) | Y (Q) | Y (Q) | Y (Q) | Y (Q) | N | N | N |
| Add a Fireblocks P2P Network connection | Y (Q) | Y (Q) | Y (Q) | N | N | N | N | N | N |
| Add or approve a new EVM asset | Y | Y | Y | Y | N | Y | N | N | N |
| Add or approve a new non-EVM asset | Y | Y | Y | Y | N | Y | N | N | N |

### Workspace management

| Does this role… | Owner | Admin | NSA | Signer | Approver | Editor | Viewer | SecAud | SecAdmin |
|---|---|---|---|---|---|---|---|---|---|
| View all workspace settings including audit logs | Y | Y | Y | N | N | N | N | Y | Y |
| Participate in the Admin Quorum | Y | Y | Y | N | N | N | N | N | Y |
| Change the Admin Quorum | Y (Q+O) | Y (Q+O) | Y (Q+O) | N | N | N | N | N | Y (Q+O) |
| Approve workspace policies, Policy changes | Y (Q+O) | Y (Q+O) | Y (Q+O) | N | N | N | N | N | Y (Q+O) |
| Add or modify AML connections and policies | Y | Y | Y | N | N | N | N | N | N |

<!-- page: 8 -->

| Does this role… | Owner | Admin | NSA | Signer | Approver | Editor | Viewer | SecAud | SecAdmin |
|---|---|---|---|---|---|---|---|---|---|
| Add or modify Travel Rule connections and policies | Y | Y | Y | N | N | N | N | N | N |
| Freeze the workspace | Y | Y | Y | N | N | N | N | N | Y |
| View or retrieve vault public keys via API | Y | Y | Y | Y | Y | Y | N | N | N |

## User roles in Developer Sandboxes

Sandbox workspaces are freely available to sign up for and are designed for quick development and experimentation:

- When creating API users, the CSR certificate required to generate the private key is automatically created in the browser.
- Access to the Developer Area API Monitoring feature, which displays the workspace's API calls and errors over 24-hour and 7-day time periods.
- No mobile signing devices are needed. All transactions are auto-approved, reducing the complexity of trying out the Fireblocks API.

### Differences in Sandbox user roles

Sandbox workspaces offer only three roles:

- Non-Signing Admin
- Editor
- Viewer

In Sandbox workspaces, a backend service takes the Owner role and manages auto-approvals automatically. The Non-Signing Admin therefore holds the highest permission level and gains capabilities not present in mainnet or testnet workspaces, including:

- Creating and deleting users
- Resetting 2FA for workspace users
- Signing transactions (despite the "non-signing" in the role's name)

<!-- page: 9 -->

## Related Articles (from original)

- Re-adding a user to the Fireblocks mobile app
- Troubleshooting user setup
- User roles for Cold Wallet workspaces
- Initial user setup
- Manage your 2FA
- Add users
- Best practices for choosing user roles
