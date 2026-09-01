# Configuring Multiple API Co-signers in High Availability

> Source: https://developers.fireblocks.com/docs/multiple-cosigners-high-availability
> Fetched: 2026-09-01 (curl, HTML → text 정규화)
> Mode: C (full ingest — 사용자 promote 승인 2026-09-01)

## Overview

You can configure multiple API Co-signers to operate in an active-active state, ensuring transaction operations align with your business continuity requirements. If one API Co-signer fails or becomes impaired, the remaining Co-signer(s) will continue signing transactions seamlessly.

## Configuring multiple Co-Signers to work in parallel

Upon completing the Co-signer's setup and configuration, you can configure them to work in parallel using the Policies.

Each API Co-signer must have at least one API user assigned the Signer role. These API users should be added to the Designated Signers / Groups field in the Policy for the transaction types the Co-signers are authorized to sign. You can add API users individually or as part of a user group. All designated signers for the rule must be API users. A combination of API users and Fireblocks Console users is not permitted. Refer to the following article to learn more about creating and modifying your Policies.

Once the Owner and Admin Quorum approve the Policy update, multiple Co-signers operate in parallel. Now, the transaction signing process follows these steps:

1. A transaction is initiated using the Console or APIs.
2. Fireblocks evaluates the transaction against the workspace's Policy to match it with the appropriate rule. The rule includes API users in the Designated Signers/Groups field.
3. Fireblocks calls all the Co-signers that are paired with the API users listed in the Policy rule's Designated Signers/Groups field to confirm their availability for signing.
4. Fireblocks identifies the first available API user with a paired Co-signer and sends the transaction to that Co-signer for signing.
5. If a Callback Handler is configured for the API Co-signer, it determines whether the transaction is signed or rejected based on the defined callback logic. If no Callback Handler is configured, the API user signs the transaction automatically.

## Configuring Policy rules for a group of API Co-signers

### Exchange or fiat accounts

You cannot add multiple API users or a user group to the Designated Signers/Groups field in rules in which the Source field contains an exchange or fiat account. Doing so causes transactions that match that rule to fail automatically. You must assign a single API user in Policy rules for exchange and fiat accounts.

### Policy Configuration

Depending on how you want to customize the Policy (i.e., whether you create inclusionary or exclusionary rules), you can use different methods to ensure transactions match the correct rule. In the following examples, Group 1 members are the API Co-Signers.

#### Method 1: Including API Co-Signers only for supported sources

| Rule | Initiator | Type | Source | Dest. | Whitelisted / OTA | Amount | Time Period | Asset | Action | Approved By | Designated Signers / Group |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Any | Tx | Any VA | Any | Whitelisted + OTA | $0 | Single Tx | Any | Allow | - | Group 1 |
| 2 | Any | Tx | Any | Any | Whitelisted + OTA | $0 | Single Tx | Any | Approved By | Tywin | - |

- Rule 1: This rule allows any single transaction from any vault account to any whitelisted destination or one-time address with an amount greater than $0 from any asset. However, all transactions that match this rule must be signed by one of the Group 1 members.
- Rule 2: This rule allows any single transaction from any source to any whitelisted destination or one-time address with an amount greater than $0 from any asset. However, all transactions that match this rule must be approved by Tywin.

Therefore, according to the first match principle, the API Co-signers only sign single transactions in which the source is a vault account.

#### Method 2: Excluding API Co-Signers from unsupported sources

| Rule | Initiator | Type | Source | Dest. | Whitelisted / OTA | Amount | Time Period | Asset | Action | Approved By | Designated Signers / Group |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Any | Tx | Any Exchange, Any Fiat | Any | Whitelisted + OTA | $0 | Single Tx | Any | Approved By | Tywin | - |
| 2 | Any | Tx | Any | Any | Whitelisted + OTA | $0 | Single Tx | Any | Approved By | Tywin | Group 1 |

- Rule 1: This rule allows any single transaction from any exchange or any fiat account to any whitelisted destination or one-time address with an amount greater than $0 from any asset. However, all transactions that match this rule must be approved by Tywin.
- Rule 2: This rule allows any single transaction from any source to any whitelisted destination or one-time address with an amount greater than $0 from any asset. However, all transactions that match this rule must be approved by Tywin and then signed by one of the members from Group 1.

Therefore, according to the first match principle, the API Co-Signers only sign single transactions in which the source is not an exchange or a fiat account.

## Multiple API Co-signers deployment options

Co-signers can be deployed either in the cloud or on-premise, depending on your requirements. For example, you can implement a cluster with three Co-signers in an active-active-passive architecture as follows:

- **Active-Active Co-signers**: Two API Co-signers are deployed in separate availability zones within a cloud service provider. This configuration eliminates a single point of failure and ensures continuous operation without downtime.
- **Passive Co-signer**: A third API Co-signer is deployed on-premise as a failover. This on-premise Co-signer ensures redundancy, allowing for uninterrupted operation during updates or maintenance of the cloud-based Co-signers.

## Backup & Recovery

Backing up the API Co-signer server and data is highly recommended for streamlining machine updates or replacement processes. This backup can also be used for disaster recovery (DR), however, it is recommended to set up an additional API Co-signer in high availability (active-active) and use it if something goes wrong. You can learn more about backing up and restoring the API Co-signer by referring to one of the articles below:

- SGX API Co-Signer Backup & Recovery
- AWS Nitro API Co-Signer Backup & Recovery

## Best practices

To ensure business continuity, install the API Co-signers in high availability using both on-prem data centers (when possible) and cloud service providers.

If only one infrastructure provider is available for hosting all the API Co-signers, follow the best practices for each cloud service provider for setting up cross-region replication and multiple API Co-signer instances on different data centers when deploying on-prem.
