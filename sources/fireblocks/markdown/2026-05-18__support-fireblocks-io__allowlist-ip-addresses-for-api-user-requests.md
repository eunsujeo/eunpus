<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/4405980040210-Allowlist-IP-addresses-for-API-user-requests
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__allowlist-ip-addresses-for-api-user-requests.pdf
-->

# Allowlist IP addresses for API user requests

*Updated 2 days ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

Allowlisting IP addresses restricts an API user's API calls to specific addresses you trust. Fireblocks recommends allowlisting IP addresses for all API users in your workspace. Without allowlisting, a stolen API key can be used from any machine on the internet. Only workspace Owners can allowlist IP addresses for an API user.

Allowlisting accepts only /32 CIDR notation. IP ranges are not supported.

To allowlist IP addresses for an API user:

1. In the Fireblocks Console, go to **Developer Center > API users**.
2. Find the API user, then select the more actions menu (⋮) > **Allowlist IP address**.
3. Add or remove IP addresses, separating multiple addresses with commas.
4. Select **Save**.

<!-- page: 2 -->

## Related Articles (from original)

- Binance IP address change
- Operating the Allowlist contract
- Add API users
- Whitelisting new addresses
- Getting started with Fireblocks Key Link
- Developer Center
- Re-enrolling API users
- Address whitelist suspension property
- Rename and delete API users
- API user stuck in Pending Setup status
