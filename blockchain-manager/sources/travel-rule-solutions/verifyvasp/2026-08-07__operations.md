---
updatedAt: 2026-07-14T08:25:42.000Z
---

Fetch the complete documentation index at: https://docs.verifyvasp.com/llms.txt. Use this file to discover all available pages before exploring further.

# Operations

This section defines the operational regulations for VASPs to ensure stable operation of the Travel Rule Protocol. By adhering to these regulations, VASPs can minimize errors during inter-VASP verification processes and provide a stable user experience.

<Callout icon="💡" theme="default">
  ### This document is continuously updated.

  Each VASP’s operations manager is advised to review this guide periodically to ensure that no required maintenance procedures are omitted.
</Callout>

## Advance Notice of VASP Server Maintenance Schedule

VASPs must notify the VerifyVASP Operations Team of any planned server maintenance at least one week in advance. The notification can be made through the following methods:

### 1. Notification via Slack or Email

All VASPs participating in the VerifyVASP Alliance can communicate with the Operations Team through their dedicated Slack channel. If a server maintenance task is scheduled, the operations team must be notified via the Slack channel at least one week prior.

If you prefer to notify by email, please send the details to the address below:

* Contact: <support@verifyvasp.com>

<br />

### 2. Notification via VerifyVASP Console

VASPs can share their server maintenance schedule with other member VASPs via the VerifyVASP Console.

1. **Access \[Members] > \[My Schedule] Menu**\
   After logging in to the VerifyVASP Console, select \[Members] > \[My Schedule] from the left-hand menu.
2. **Click \[Register]**\
   A list of all maintenance schedules of participating VASPs in the VerifyVASP Alliance will be displayed. Click the \[Register] button to add your schedule.
3. **Enter Schedule and Reason**\
   Input the planned maintenance date and the reason for the maintenance.
4. **Complete Registration and Publish**\
   Once registered, the schedule will be visible to all members of the VerifyVASP Alliance.

<br />

## Data Retention (Automatic Deletion of Old Verification Data)

The Enclave can automatically delete old verification records so that personal and transaction data is not retained longer than necessary. This feature is **opt-in and disabled by default**.

To enable it, set the `VEGA_VERIFICATION_RETENTION_DAYS` environment variable to the number of days to keep data. Once set, the Enclave runs an hourly cleanup that deletes:

* `verifications` rows whose `created_at` is older than the configured period, and
* the related risk-screening result tables — Chainalysis Sanction, Chainalysis KYT, Chainalysis KYT Alerts, and Refinitiv WCO — for the same period, when those tables exist.

Notes:

* **Opt-in:** if the variable is unset, empty, or not a valid number, retention is disabled and no data is deleted.
* **Minimum period:** the value is enforced to be at least `1` day; a value below 1 is treated as 1 day.
* **Batched deletion:** rows are removed in small batches with a short pause between them to limit database load.
* **Required index:** before enabling retention, the `verifications` table must have an index whose leading column is `created_at` (`idx_verifications_created_at`). If it is missing, the Enclave logs an error at startup and keeps retrying instead of starting, to avoid full-table scans that would severely degrade performance. The current database schema already includes this index — see [Database Setup](https://docs.verifyvasp.com/reference/travelrule-database-setup).

<Callout icon="⚠️" theme="warn">
  Deleted verification data cannot be recovered. Make sure the retention period complies with your record-keeping obligations and that any required backups are in place before enabling this feature.
</Callout>