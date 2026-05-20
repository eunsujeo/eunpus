<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/4407823826194-Add-API-users
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__add-api-users.pdf
-->

# Add API users

*Updated 2 days ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

Fireblocks API users let your organization automate workspace operations and integrate with third-party applications. Each API user has an associated API key.

You can use API users to:

- View the status of your workspace
- Initiate workspace operations
- Automatically approve workspace operations
- Automatically sign transactions
- Integrate Fireblocks with third-party applications

> **Important**: Only integrate with third-party applications you trust. If a third-party application is compromised, the attacker may be able to control your wallet.

Adding an API user is a two-step process: generate a CSR file, then create the API user in the Fireblocks Console.

## Generate a CSR file

A Certificate Signing Request (CSR) file is required to authenticate an API user. The CSR file authenticates the API user to Fireblocks.

Do not use the same CSR file for multiple API users in your mainnet workspace. You can reuse a CSR file across API users in your testnet workspace to verify functionality, or when all the relevant API users have read-only permissions.

To generate a CSR file, run the following command. It creates an RSA 4096 private key stored in `fireblocks_secret.key`. The only required attribute is your organization's name; you can leave the others empty.

```
openssl req -new -newkey rsa:4096 -nodes -keyout fireblocks_secret.key
```

<!-- page: 2 -->

> **Note**: If you're on a Windows machine, install OpenSSL first:
> 1. Install Win32OpenSSL using the default settings.
> 2. Type *OpenSSL Command Prompt* into the Windows search bar and open the application.

> **Warning**: Keep `fireblocks_secret.key` safe and secure. Do *not* share it with anyone.

## Create the API user

1. In the Fireblocks Console, go to **Developer Center > API users**.
2. Select **Add API user**.
3. In the **Name** field, enter a display name for the API user (up to 30 characters).
4. From the **Role** dropdown, select the appropriate role. API users use the same user roles as Console users. For third-party integrations, assign the Viewer role and give each third-party application its own dedicated API user.
5. Upload the CSR file you generated in the previous step to the **CSR file** field.
6. From the **Co-signer setup** dropdown, select the Co-signer this API user will pair with. In testnet workspaces, you can select the *Fireblocks Communal Test Co-signer* to verify functionality. If you're using this API user to install a new SGX Co-signer, also select **First user on this machine**.
7. Select **Add user**.

Adding an API user requires approval from the workspace Owner and the Admin Quorum, following the same approval flow used for Console users. Once approved, the API user appears in the API users list. To copy the API key, hover over the value in the **API User (ID)** column.

<!-- page: 3 -->

## Related Articles (from original)

- API Co-Signer troubleshooting after Azure Cloud maintenance (May 2022)
- API Co-Signer updates (December 2021)
- Allowlist IP addresses for API user requests
- Azure update for API Co-Signers (November 2022)
- Getting started with Fireblocks Key Link
- Developer Center
- API user stuck in Pending Setup status
- Re-enrolling API users
- Rename and delete API users
