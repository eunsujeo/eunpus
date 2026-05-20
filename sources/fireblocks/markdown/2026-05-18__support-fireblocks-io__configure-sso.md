<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/10031671057692-Configure-SSO
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__configure-sso.pdf
-->

# Configure SSO

*Updated 2 days ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

Fireblocks supports single sign-on (SSO) for the Fireblocks Console using your enterprise identity provider (IdP). SSO replaces username and password authentication, streamlines the sign-in experience, and reduces the number of passwords each user has to manage.

SSO authorizes users based on their email domain. To sign in via SSO, users must have a Fireblocks workspace account created with an authorized domain. You choose which domains are authorized for your workspace.

Fireblocks supports the following SSO integrations:

- Google Workspace
- Microsoft Entra ID (formerly Azure AD)
- Okta
- OpenID Connect
- PingFederate
- SAML 2.0 and SAML 3.0

ADFS and LDAP / Active Directory are also supported but require Fireblocks Support to handle the setup. Contact Fireblocks Support to use either.

> **Note**: SSO only affects login authorization. Adding or removing users in your workspace is still done in the Fireblocks Console by the Owner or an Admin.

## Google Workspace

To allow your users to sign in to the Fireblocks Console using Google Workspace, register your application in the Google developer console. You must be an administrator in your Google Workspace organization before registering the app.

1. Register your application using Google's OAuth 2.0 setup procedure. Save the **Client ID** and **Client Secret** that Google generates.
2. On the OAuth consent screen, add `auth0.com` to the list of authorized domains.
3. Select **Web application** as the application type and set these values:

<!-- page: 2 -->

| Field | Value |
|---|---|
| Name | Your application name |
| Authorized JavaScript origins | `https://YOUR_DOMAIN` |
| Authorized redirect URLs | `https://auth.fireblocks.io/login/callback` |

4. Send Fireblocks Support the following:
   - Client ID
   - Client Secret
   - Domains in your organization that should be required to sign in via SSO

## Microsoft Entra ID (formerly Azure AD)

1. Register your application following Microsoft's *Quickstart: Register an application with the Microsoft identity platform*. During registration, configure:
   - **Supported account types**: To allow users from external organizations such as other Entra ID directories, select **Accounts in any organizational directory (Any Entra ID directory - Multitenant)**.
   - **Redirect URL**: Select **Web** as the redirect type and enter `https://auth.fireblocks.io/login/callback`.
2. Create a Client Secret by following Microsoft's *Add Credentials to your web application* procedure. Save the Client Secret value.
3. Send Fireblocks Support the following:
   - Client ID
   - Client Secret
   - Domains in your organization that should be required to sign in via SSO

> **Note**: Send the Client Secret value, not the Client Secret ID. This is a common mistake.

## Okta

1. Sign in to Okta and create a SAML application using the *App Integration Wizard* and *SAML App Wizard*.
2. When configuring the SAML integration, use the values Fireblocks provides for:
   - Single sign-on URL
   - Recipient URL
   - Destination URL
   - Entity ID
3. Complete the SAML setup by selecting **View Setup Instructions**. Save the IdP single sign-on URL and download the X.509 certificate.

<!-- page: 3 -->

### Configure required attributes

Fireblocks needs three attribute statements on your Okta application to map Service Provider IDs to your IdP IDs. In the Okta application's SAML settings, add the following attribute statements:

| Name | Name format | Value |
|---|---|---|
| firstName | Unspecified | user.firstName |
| lastName | Unspecified | user.lastName |
| email | Unspecified | user.email |

Retrieve your IdP metadata XML file:

1. In the Okta app, go to **Applications > your application > Sign On**.
2. Select the IdP metadata link to find the XML file, then save it as `customer-metadata.xml`.

Send Fireblocks Support the following:

- `customer-metadata.xml`
- X.509 certificate
- Domains in your organization that should be required to sign in via SSO

## OpenID Connect

To allow your users to sign in to the Fireblocks Console using an OpenID Connect (OIDC) IdP, register your application with the IdP. The procedure varies by IdP — follow your IdP's documentation. When configuring, set the callback URL to `https://auth.fireblocks.io/login/callback`.

Send Fireblocks Support the following:

- **Issuer URL**: the URL where Auth0 can find the OpenID Provider Configuration Document, typically available at `/.well-known/openid-configuration`. You can enter the base URL or the full URL.
- **Client ID**: the unique identifier for your registered application.
- Domains in your organization that should be required to sign in via SSO

## PingFederate

Auth0 acts as the service provider for the PingFederate Server. To connect your PingFederate server to Auth0, retrieve an X.509 signing certificate from the IdP in PEM or CER format. The methods for retrieving this certificate vary — see the PingFederate documentation for instructions on managing your server's certificates.

<!-- page: 4 -->

Convert the certificate to Base64. You can use an online tool or run:

```
cat signing-cert.crt | base64
```

Send Fireblocks Support the following:

- PingFederate Server URL
- X.509 certificate (Base64-encoded)

## SAML 2.0 and SAML 3.0

The SAML 2.0 and SAML 3.0 setup is similar to Okta. Fireblocks provides values for the following SAML fields:

- Single sign-on URL
- Recipient URL
- Destination URL
- Entity ID

Once your SAML integration is configured, send Fireblocks Support the following:

- Your IdP metadata, saved as `customer-metadata.xml`
- X.509 certificate
- Domains in your organization that should be required to sign in via SSO

## Change your SSO provider

To change which SSO provider you use to sign in to the Fireblocks Console, contact Fireblocks Support. Changing SSO providers requires approval from the workspace Owner.
