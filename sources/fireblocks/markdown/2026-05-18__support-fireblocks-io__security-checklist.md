<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/360018469779-Security-checklist
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__security-checklist.pdf
-->

# Security checklist

*Updated 4 months ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

## Basic security

- User roles
- Admin Quorum

## Transaction security

- Fireblocks Policies
- Deposit Control and Confirmation Policy
- AML Transaction Screening Policy

## Authentication

- **User login IP whitelisting**: Restricts logins according to specific IP addresses. Contact support to enable.
- **Identity provider SSO setup**: Let users sign in to the Fireblocks workspace using a single sign-on (SSO) provider.

## Backup and Recovery

- **Auto-passphrase**: Auto-passphrase disables the manual entry of recovery passphrases for all users. The manual process is replaced with a secure random passphrase automatically generated on each user's mobile device and encrypted using an RSA key that you then provide to Fireblocks. This feature prevents losing or leaking passphrases by users. You can decrypt the passphrase on an offline machine in case recovery is necessary. Contact support to enable.

<!-- page: 2 -->

## Other security features

- **Withdrawal address whitelisting "cooling-off" period**: This sets a period before whitelisted addresses become active. Contact support to enable.
- **Emergency freeze**: Admins can freeze a workspace thereby blocking all user activity on the workspace. Users are then blocked from issuing transfers, whitelisting addresses, setting up new fiat and exchange connections, and adding Fireblocks P2P Network connections. Frozen workspaces can only be unfrozen when the owner contacts Fireblocks Support.
- **Security audit log**: Log, track, audit, and export your workspace events.

## Fireblocks API and API Co-Signer

### Fireblocks API security best practices

- Use a clean hardened machine with access limited to authorized personnel. Also, note that no inbound connections are allowed, and the outbound connection is allowed only on port 443.
- Do not move the API user's private key anywhere other than the machine.
- Use API IP whitelisting.
- If the API user has Admin privileges, activate **withdrawal address whitelisting suspension**. Contact support to enable.
- Fireblocks advises against disabling Linux UEFI secure boot on your API Co-Signer virtual machine, as this goes beyond the security risks introduced by not validating kernel code. We recommend working around any issues you have instead. Using TrendMicro Deep Security agent on Ubuntu 20.04 is one option for secure boot support.

### API Co-Signer security best practices

- Use a clean hardened machine for the callback handler with access limited to authorized personnel. Also, note that no outbound connections are allowed, and the inbound connection is allowed only from the API Co-Signer machine on port 443.
- Use the Callback Handler to log all approval requests.
- Consider using the Callback Handler to implement your additional programmatic protection logic against malicious withdrawals.
- Harden the API Co-Signer machine. Find detailed instructions in the SGX API Co-Signer setup guide.
- Create Policy rules that don't let API users initiate transfers above a specific amount threshold, within a specific timeframe, and without additional manual approval.

<!-- page: 3 -->

These rules should apply globally for all withdrawals and withdrawals from a specific external user wallet.

(Note: UEFI secure boot 권고 사항이 다시 한 번 반복됨)

## Related Articles (from original)

- DeFi security best practices
- Fireblocks Security Posture Management (FSPM)
- Is this email really from Fireblocks?
