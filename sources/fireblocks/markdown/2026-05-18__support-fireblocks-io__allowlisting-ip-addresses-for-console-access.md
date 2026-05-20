<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/9189366603548-Allowlisting-IP-addresses-for-Console-access
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__allowlisting-ip-addresses-for-console-access.pdf
-->

# Allowlisting IP addresses for Console access

*Updated 1 year ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

## Overview

Fireblocks lets you limit which IP addresses can access your Console. Allowlisting certain IP addresses is an additional access control layer for your workspaces. This restricts workspace access to specific trusted networks you expect your organization to use and blocks access outside of them, reinforcing your organization's perimeter and making it more difficult for threat actors to breach your workspace.

By default, the IP allowlist is not activated. You can manage your IP address allowlist on the Settings page in your Console. After adding IP addresses to the allowlist, you can activate or deactivate the entire allowlist as needed. **The IP address allowlist only applies to the workspace where it was created**, so you must create an allowlist for each workspace to which you want limited access.

> **Important**: To prevent customers from locking themselves out of their workspaces, the IP address of the user currently editing the allowlist must be included to activate it.

When a user with multiple workspaces attempts to access the Fireblocks Console for a new or existing workspace where their IP address is not included in the allowlist, they will be unable to select that workspace after logging in. If the user only has one workspace, they will be denied access when logging in.

## Adding IP addresses to the allowlist

1. In the Fireblocks Console, go to **Settings > General** and select **Manage IP allowlist**.
2. Select **Add IP address**, then enter the IP address and a description. You can use IPv4 or IPv6 address formats. You can also use **CIDR notation or enter a range of IP**

<!-- page: 2 -->

**addresses**. When entering an address range, use this format: `12.123.456.789 - 12.123.456.799`.

3. Select **Add IP address**.

To enforce the allowlist of the IP addresses added, you must activate it.

## Activating the allowlist

Before you activate the allowlist, verify your IP address is included. You cannot activate the allowlist otherwise.

1. In the Fireblocks Console, go to **Settings > General** and select **Manage IP allowlist**.
2. Select **Activate allowlist**, then confirm the activation.

Now your workspace can only be accessed via the Console from the IP addresses specified in the allowlist. You can also deactivate the allowlist whenever needed.

## Managing your allowlist

When reviewing your allowlist in the Console, select **More Actions (...)** per an IP address to edit or remove it. Keep in mind that you will be unable to remove an IP address if doing so will prevent you from accessing the workspace.

**Allowlisting is by default assigned to the Admin Quorum to facilitate approvals.** However, you can also configure your workspace to assign allowlisting to a specific approval group under your settings by selecting **Quorums > Security & compliance**.

## Best practices

- Limit the allowlist to IP addresses that need access.
- Use subnets or an address range if your network has several IPs. However, be careful not to expand access beyond what's necessary.
- Keep the allowlist updated by regularly removing addresses that no longer require access.
- Be cautious of VPNs or other security layers that can change your IP address and prevent you from accessing your workspace.
- Educate users on the importance and implications of IP allowlisting.

<!-- page: 3 -->

- **Monitor the Audit Log to detect unauthorized attempts to access the Console** and identify when the allowlist requires updating. Learn which IP allowlist events are recorded in the Audit Log.
- Conduct periodic security audits to ensure the allowlist and other security measures are effective and up-to-date.
