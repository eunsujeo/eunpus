<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/4412016177554-Re-enrolling-API-users
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__re-enrolling-api-users.pdf
-->

# Re-enrolling API users

*Updated 2 days ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

Admin-level users can re-enroll an API user from the Fireblocks Console to reconnect the user to your Co-signer. You may need to re-enroll an API user if you:

- Receive errors during initial Co-signer server setup
- Pair the API user with a new or existing Co-signer instance
- Change the Co-signer Callback Handler configuration (for example, switching the authentication method)

## Re-enroll an API user

To re-enroll an API user:

1. In the Fireblocks Console, go to **Settings > Users**.
2. Find the API user, then select the more actions menu (⋮) > **Re-enroll API user**.

An approval request is sent to the workspace Owner. After the Owner approves, pair the API user with your Co-signer to complete re-enrollment. The Owner must then approve the Co-signer's key shares to finish the process.

## Troubleshooting

### "Failed to pair device, HTTP status 500"

When this error occurs, the FATAL line in the response indicates the failure:

```
customer_cosigner:26 INFO 10/05/2022 16:00:55,908 curl/curl_utils.cpp(23
customer_cosigner:26 INFO 10/05/2022 16:00:55,908 curl/curl_utils.cpp(24
FATAL 10/05/2022 16:00:56,409 main.cpp(566) std::__cxx11::string pair_de
```

This means the API user was re-enrolled, but the pairing token expired before it was entered. The pairing token is valid for one hour after you copy it from the Console.

<!-- page: 2 -->

To resolve this, re-enroll the API user, then redo the Co-signer pairing with a fresh pairing token.

### "Failed with error SSL public key does not match pinned public key"

This error means the SSL certificate on the Callback Handler server does not match the certificate on the Co-signer. The Callback Handler certificate has typically been changed or has expired.

To resolve this, re-enroll the API user, then re-pair the API user with the Co-signer so it picks up the updated certificate from the Callback Handler. After pairing, the workspace Owner must approve the Co-signer's key shares.

<!-- page: 3 -->

## Related Articles (from original)

- Re-enroll a user's mobile device
- Allowlist IP addresses for API user requests
- API user stuck in Pending Setup status
- Rename and delete API users
- Add API users
- Getting started with Fireblocks Key Link
- Developer Center
