> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Audit Log Events

<br />

# Overview

This page includes all Audit Log events and associated parameters. Sections are organized by Category.

# Administration

| Event ID                                                   | Subject                 | Event                        | Notification Subject                                                 |
| ---------------------------------------------------------- | ----------------------- | ---------------------------- | -------------------------------------------------------------------- |
| `EventId.ApiIpWhitelisting_ListUpdated`                    | Whitelisted IP          | List updated                 | API IP Whitelisting List Updated                                     |
| `EventId.AdminQuorum_ApprovedByAdmin`                      | Quorum                  | Approved                     | Admin Quorum Approved by admin                                       |
| `EventId.AdminQuorum_Cancelled`                            | Quorum                  | Canceled                     | Admin Quorum Cancelled                                               |
| `EventId.AdminQuorum_Rejected`                             | Quorum                  | Rejected                     | Admin Quorum Rejected                                                |
| `EventId.AdminQuorum_RequestSubmitted`                     | Quorum                  | Submitted request            | Admin Quorum Request Submitted                                       |
| `EventId.AdminQuorum_ThresholdChanged`                     | Quorum                  | Changed threshold            | Admin Quorum Threshold Changed                                       |
| `EventId.Authentication_LoginFailed`                       | Sign in                 | Failed                       | Authentication Login Failed                                          |
| `EventId.Authentication_PasswordChangeRequested`           | Sign in                 | Requested password change    | Authentication Password Change Requested                             |
| `EventId.Authentication_PasswordChanged`                   | Sign in                 | Changed password             | Authentication Password Changed                                      |
| `EventId.Authentication_2faReset`                          | Sign in                 | Reset 2FA                    | Authentication 2FA reset                                             |
| `EventId.DeviceRecover_Completed`                          | Device recovery         | Completed                    | Device Recover Completed                                             |
| `EventId.DeviceReset_ApprovedByAdmin`                      | Device reset            | Approved                     | Device Reset Approved by admin                                       |
| `EventId.DeviceReset_DeviceRecover`                        | Device reset            | Recovered                    | Device Reset Device Recover                                          |
| `EventId.DeviceReset_DeviceReset`                          | Device reset            | Completed                    | Device Reset Device Reset                                            |
| `EventId.DeviceReset_Rejected`                             | Device reset            | Rejected                     | Device Reset Rejected                                                |
| `EventId.DeviceReset_RequestSubmitted`                     | Device reset            | Submitted request            | Device Reset Request submitted                                       |
| `EventId.EditUser_ApprovedByAdmin`                         | Edit user               | Approved                     | Edit User Approved by admin                                          |
| `EventId.EditUser_Cancelled`                               | Edit user               | Canceled                     | Edit User Cancelled                                                  |
| `EventId.EditUser_EditRequestSubmitted`                    | Edit user               | Submitted request            | Edit User Edit request submitted                                     |
| `EventId.EditUser_EditRequestImplemented`                  | Edit user               | Edit request implemented     |                                                                      |
| `EventId.EditUser_Rejected`                                | Edit user               | Rejected                     | Edit User Rejected                                                   |
| `EventId.NewUserApproval_ApprovedByAdmin`                  | New user                | Approved                     | New User Approval Approved by admin                                  |
| `EventId.NewUserApproval_Cancelled`                        | New user                | Canceled                     | New User Approval Cancelled                                          |
| `EventId.NewUserApproval_Rejected`                         | New user                | Rejected                     | New User Approval Rejected                                           |
| `EventId.NewUserApproval_RequestSubmitted`                 | New user                | Submitted request            | New User Approval Request submitted                                  |
| `EventId.OneTimeAddress_ApprovedByAdmin`                   | One-time address        | Approved                     | One-time Address Approved by admin                                   |
| `EventId.OneTimeAddress_Cancelled`                         | One-time address        | Canceled                     | One-time Address Cancelled                                           |
| `EventId.OneTimeAddress_Rejected`                          | One-time address        | Rejected                     | One-time Address Rejected                                            |
| `EventId.OneTimeAddress_RequestSubmitted`                  | One-time address        | Submitted request            | One-time Address Request Submitted                                   |
| `EventId.OneTimeAddress_ToggledOff`                        | One-time address        | Turned off                   | One-time Address Toggled off                                         |
| `EventId.OneTimeAddress_ToggledOn`                         | One-time address        | Turned on                    | One-time Address Toggled on                                          |
| `EventId.ReEnrollDevice_ApprovedByAdmin`                   | Re-enroll mobile device | Approved                     | Re-enroll Device Approved by admin                                   |
| `EventId.ReEnrollDevice_Cancelled`                         | Re-enroll mobile device | Canceled                     | Re-enroll Device Cancelled                                           |
| `EventId.ReEnrollDevice_Completed`                         | Re-enroll mobile device | Completed                    | Re-enroll Device Completed                                           |
| `EventId.ReEnrollDevice_DeviceReEnrollmentCompleted`       | Re-enroll mobile device | Completed                    | Re-enroll Device Device Re-enrollment Completed                      |
| `EventId.ReEnrollDevice_DeviceRecover`                     | Re-enroll mobile device | Recovered                    | Re-enroll Device Device Recover                                      |
| `EventId.ReEnrollDevice_Rejected`                          | Re-enroll mobile device | Rejected                     | Re-enroll Device Rejected                                            |
| `EventId.ReEnrollDevice_RequestSubmitted`                  | Re-enroll mobile device | Submitted request            | Re-enroll Device Request Submitted                                   |
| `EventId.User_Deleted`                                     | User                    | Deleted                      | User Deleted                                                         |
| `EventId.User_LoggedIn`                                    | User                    | Signed in                    | User Logged In                                                       |
| `EventId.User_AccessDenied`                                | User                    | Access denied                | User Access denied                                                   |
| `EventId.UserGroups_ChangesApprovedByAdmin`                | User group              | Changes approved             | User Groups Active group changes request was approved by admin       |
| `EventId.UserGroups_ChangesRequestRejected`                | User group              | Changes rejected             | User Groups Active group changes request was rejected                |
| `EventId.UserGroups_ChangesWentIntoAffect`                 | User group              | Changes in effect            | User Groups Active group changes went into affect                    |
| `EventId.UserGroups_EditRequestImplemented`                | User group              | Edited                       | User Groups Edit request implemented                                 |
| `EventId.UserGroups_NewGroupApprovedAndCreated`            | User group              | Approved and created         | User Groups New group approved and created                           |
| `EventId.UserGroups_NewGroupRequestWasApprovedByAdmin`     | User group              | Approved                     | User Groups New group request was approved by admin                  |
| `EventId.UserGroups_NewGroupRequestWasRejected`            | User group              | Rejected                     | User Groups New group request was rejected                           |
| `EventId.UserGroups_UserCanceledActiveGroupChangesRequest` | User group              | Canceled change request      | User Groups User canceled active group changes request               |
| `EventId.UserGroups_UserDeletedAGroup`                     | User group              | Deleted                      | User Groups User deleted a group                                     |
| `EventId.UserGroups_UserDiscardedActiveGroupEditing`       | User group              | Discarded edits (DEPRECATED) | User Groups User discarded active group editing                      |
| `EventId.UserGroups_UserStartedEditingActiveGroup`         | User group              | Edited (DEPRECATED)          | User Groups User started editing active group                        |
| `EventId.UserGroups_SubmittedApprovalRequestGroupChanges`  | User group              | Requested change approval    | User Groups User submitted approval request for active group changes |
| `EventId.UserGroups_UserSubmittedNewGroupForApproval`      | User group              | Created                      | User Groups User submitted new group for approval                    |
| `EventId.UserManagement_DeviceRecover`                     | User                    | Recovered mobile device      | User Management Device Recover                                       |
| `EventId.UserManagement_DeviceReset`                       | User                    | Reset mobile device          | User Management Device Reset                                         |
| `EventId.UserManagement_Disabled`                          | User                    | Deactivated                  | User Management Disabled                                             |
| `EventId.UserManagement_RoleChanged`                       | User                    | Changed role                 | User Management Role Changed                                         |
| `EventId.LinkedUserMigration_InitiatedByUser`              | Linked user migration   | Initiated by user            | Linked user migration Initiated by user                              |
| `EventId.LinkedUserMigration_UserPairedSuccessfully`       | Linked user migration   | User paired successfully     | Linked user migration User paired successfully                       |
| `EventId.LinkedUserMigration_Activated`                    | Linked user migration   | Activated                    | Linked user migration Activated                                      |
| `EventId.LinkedUserMigration_Deactivated`                  | Linked user migration   | Deactivated                  | Linked user migration Deactivated                                    |
| `EventId.Notifications_EmailCreated`                       | Email Notification      | Created                      |                                                                      |
| `EventId.Notifications_EmailEnabled`                       | Email Notification      | Enabled                      |                                                                      |
| `EventId.Notifications_EmailDisabled`                      | Email Notification      | Disabled                     |                                                                      |
| `EventId.Notifications_EmailEdited`                        | Email Notification      | Edited                       |                                                                      |
| `EventId.Notifications_SlackCreated`                       | Slack Notification      | Created                      |                                                                      |
| `EventId.Notifications_SlackEnabled`                       | Slack Notification      | Enabled                      |                                                                      |
| `EventId.Notifications_SlackDisabled`                      | Slack Notification      | Disabled                     |                                                                      |
| `EventId.Notifications_SlackEdited`                        | Slack Notification      | Edited                       |                                                                      |
| `EventId.Notifications_WebhooksCreated`                    | Webhooks Notification   | Created                      |                                                                      |
| `EventId.Notifications_WebhooksEnabled`                    | Webhooks Notification   | Enabled                      |                                                                      |
| `EventId.Notifications_WebhooksDisabled`                   | Webhooks Notification   | Disabled                     |                                                                      |
| `EventId.Notifications_WebhooksEdited`                     | Webhooks Notification   | Edited                       |                                                                      |
| `EventId.Notifications_WebhooksDeleted`                    | Webhooks Notification   | Deleted                      |                                                                      |

# Assets

| Event ID                 | Subject | Event     | Notification Subject |
| ------------------------ | ------- | --------- | -------------------- |
| `EventId.Asset_Listed`   | Asset   | Listed    | Asset Listed         |
| `EventId.Asset_SetPrice` | Asset   | Set price | Asset Set price      |

# Automation

| Event ID                              | Event         | Subject         | Notification Subject          |
| ------------------------------------- | ------------- | --------------- | ----------------------------- |
| `EventId.AutomationRule_RuleCreated`  | Rule Created  | Automation Rule | Automation Rule Rule Created  |
| `EventId.AutomationRule_RuleEdited`   | Rule Edited   | Automation Rule | Automation Rule Rule Edited   |
| `EventId.AutomationRule_RuleEnabled`  | Rule Enabled  | Automation Rule | Automation Rule Rule Enabled  |
| `EventId.AutomationRule_RuleDisabled` | Rule Disabled | Automation Rule | Automation Rule Rule Disabled |
| `EventId.AutomationRule_RuleDeleted`  | Rule Deleted  | Automation Rule | Automation Rule Rule Deleted  |

# Compliance

| Event ID                                                 | Subject    | Event Description                      | Notification Subject                                                       |
| -------------------------------------------------------- | ---------- | -------------------------------------- | -------------------------------------------------------------------------- |
| `EventId.Transaction_AmlRegistrationComplated`           | Compliance | AML registration completed             | Transaction AML Registration complated                                     |
| `EventId.Transaction_AmlRegistrationStarted`             | Compliance | AML registration initiated             | Transaction AML Registration started                                       |
| `EventId.Transaction_AmlScreeningCompleted`              | Compliance | AML screening completed                | Transaction AML screening completed                                        |
| `EventId.Transaction_AmlScreeningFailed`                 | Compliance | AML screening failed                   | Transaction AML screening failed                                           |
| `EventId.Transaction_AmlScreeningInBackground`           | Compliance | AML screening in background            | Transaction AML screening in background                                    |
| `EventId.Transaction_AmlScreeningStarted`                | Compliance | AML screening initiated                | Transaction AML screening started                                          |
| `EventId.Transaction_ScreeningCompleted`                 | Compliance | Screening completed                    | Transaction Screening completed                                            |
| `EventId.Transaction_ScreeningStarted`                   | Compliance | Screening initiated                    | Transaction Screening Started                                              |
| `EventId.Transaction_ScreeningUpdateCompleted`           | Compliance | Screening update completed             | Transaction Screening update completed                                     |
| `EventId.Transaction_TravelRuleScreeningCompleted`       | Compliance | Travel rule screening completed        | Transaction Travel Rule screening completed                                |
| `EventId.Transaction_TravelRuleScreeningFailed`          | Compliance | Travel rule screening failed           | Transaction Travel Rule screening failed'                                  |
| `EventId.Transaction_TravelRuleScreeningStarted`         | Compliance | Travel rule screening initiated        | Transaction Travel Rule screening started', 'Travel Rule screening started |
| `EventId.Transaction_TravelRuleScreeningUpdateCompleted` | Compliance | Travel rule screening update completed | Transaction Travel Rule screening update completed                         |
| `EventId.Transaction_TravelRuleScreeningUpdateStarted`   | Compliance | Travel rule screening update initiated | Transaction Travel Rule screening update started                           |

# Developers

| Event ID                    | Subject          | Event                | Notification Subject      |
| --------------------------- | ---------------- | -------------------- | ------------------------- |
| `WebhookUrls_ListUpdated`   | Webhooks         | Updated URLs         | Webhook URLs List Updated |
| `Webhook_Added`             | Webhook endpoint | Added                |                           |
| `Webhook_Deleted`           | Webhook endpoint | Deleted              |                           |
| `Webhook_Activated`         | Webhook endpoint | Activated            |                           |
| `Webhook_Deactivated`       | Webhook endpoint | Deactivated          |                           |
| `Webhook_Updated`           | Webhook endpoint | Updated              |                           |
| `Webhook_Suspended`         | Webhook endpoint | Suspended            |                           |
| `Webhook_Suspended_Warning` | Webhook endpoint | Suspend warning sent |                           |

# Exchanges

| Event ID                                            | Subject          | Event     | Notification Subject                          |
| --------------------------------------------------- | ---------------- | --------- | --------------------------------------------- |
| `EventId.ExchangeConnection_Added`                  | Exchange account | Linked    | Exchange Connection Added                     |
| `EventId.ExchangeConnection_Removed`                | Exchange account | Unlinked  | Exchange Connection Removed                   |
| `EventId.ExchangeConnectionRequest_ApprovedByAdmin` | Exchange account | Approved  | Exchange Connection Request Approved by admin |
| `EventId.ExchangeConnectionRequest_Cancelled`       | Exchange account | Canceled  | Exchange Connection Request Cancelled         |
| `EventId.ExchangeConnectionRequest_Rejected`        | Exchange account | Rejected  | Exchange Connection Request Rejected          |
| `EventId.ExchangeConnectionRequest_Submitted`       | Exchange account | Submitted | Exchange Connection Request Submitted         |
| `EventId.FiatConnectionRequest_ApprovedByAdmin`     | Fiat account     | Approved  | FIAT Connection Request Approved by admin     |
| `EventId.FiatConnectionRequest_Rejected`            | Fiat account     | Rejected  | FIAT Connection Request Rejected              |
| `EventId.FiatConnectionRequest_Submitted`           | Fiat account     | Submitted | FIAT Connection Request Submitted             |
| `EventId.FiatConnectionRequest_Cancelled`           | Fiat account     | Canceled  | FIAT Connection Request Cancelled             |
| `EventId.FiatConnection_Added`                      | Fiat account     | Linked    | FIAT connection Added                         |
| `EventId.FiatConnection_Removed`                    | Fiat account     | Unlinked  | FIAT connection Removed                       |

# Keys

| Event ID                           | Subject        | Event                     | Notification Subject                  |
| ---------------------------------- | -------------- | ------------------------- | ------------------------------------- |
| ValidationKey\_SubmittedRequest    | Validation key | Submitted request         | Validation key Submitted request      |
| ValidationKey\_Approved            | Validation key | Approved                  | Validation key Approved               |
| ValidationKey\_Rejected            | Validation key | Rejected                  | Validation key Rejected               |
| ValidationKey\_Activated           | Validation key | Activated                 | Validation key Activated              |
| ValidationKey\_Deactivated         | Validation key | Deactivated               | Validation key Deactivated            |
| SigningKey\_SubmittedRequest       | Signing key    | Submitted request         | Signing key Submitted request         |
| SigningKey\_LinkedToUser           | Signing key    | Linked to user            | Signing key Linked to user            |
| SigningKey\_Enabled                | Signing key    | Enabled                   | Signing key Enabled                   |
| SigningKey\_AssignedToVaultAccount | Signing key    | Assigned to vault account | Signing key Assigned to vault account |
| SigningKey\_Deleted                | Signing key    | Deleted                   | Signing key Deleted                   |
| MPCKeySet\_Created                 | MPC key set    | Created                   |                                       |
| MPCKeySet\_Enabled                 | MPC key set    | Enabled                   |                                       |
| MPCKeySet\_Activated               | MPC key set    | Activated                 |                                       |

# Policies

| Event ID                                                                              | Subject                           | Event                             | Notification Subject                                                                    |
| ------------------------------------------------------------------------------------- | --------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------- |
| `EventId.Policy_PolicyReviewRejected`                                                 | TAP                               | Rejected policy                   | Policy Policy Review Rejected                                                           |
| `EventId.PolicyEditor_ASignerApprovedThePendingDraftPolicy`                           | TAP                               | Signed policy                     | Policy editor A signer approved the pending draft policy                                |
| `EventId.PolicyEditor_Deleted`                                                        | TAP                               | Deleted policy                    | Policy editor Deleted                                                                   |
| `EventId.PolicyEditor_PolicyPublished`                                                | TAP                               | Published policy                  | Policy editor Policy published                                                          |
| `EventId.PolicyEditor_TheDraftPolicyWasDiscarded`                                     | TAP                               | Discarded policy draft            | Policy editor The draft policy was discarded                                            |
| `EventId.PolicyEditor_TheDraftPolicyWasReverted`                                      | TAP                               | Reverted policy draft'            | Policy editor The draft policy was reverted                                             |
| `EventId.PolicyEditor_ThePendingPolicyWasRejected`                                    | TAP                               | Rejected policy                   | Policy editor The pending policy was rejected                                           |
| `EventId.PolicyEditor_ThePendingPolicyWasRejectedAndThePublishProcessHasBeenCanceled` | TAP                               | Rejected policy                   | Policy editor The pending policy was rejected and the publish process has been canceled |
| `EventId.PolicyEditor_ThePendingPolicyWentIntoEffect`                                 | TAP                               | Put policy into effect            | Policy editor The pending policy went into effect                                       |
| `EventId.PolicyEditor_UserMarkedTheDraftPolicyAsReadyToPublish`                       | TAP                               | Draft marked as ready to publish  | Policy editor User marked the draft policy as ready to publish                          |
| `EventId.PolicyEditor_UserRequestedToPublishTheDraftPolicy`                           | TAP                               | Requested policy draft publishing | Policy editor User requested to publish the draft policy                                |
| `EventId.PolicyEditor_UserStartedEditingTheDraftPolicy`                               | TAP                               | Edited draft                      | Policy editor User started editing the draft policy                                     |
| `EventId.PolicyEditor_PolicyReviewRejected`                                           | TAP                               | Rejected policy                   | Policy editor Policy Review Rejected                                                    |
| `EventId.IpAllowList_AllowListActivationRequestSubmitted`                             | IP address allowlist activation   | Submitted                         | Activation request submitted                                                            |
| `EventId.IpAllowList_AllowListActivationRequestApproved`                              | IP address allowlist activation   | Approved by quorum                | Activation request approved by quorum                                                   |
| `EventId.IpAllowList_AllowListActivationRequestSigned`                                | IP address allowlist activation   | Approved by user                  | Activation request approved by user                                                     |
| `EventId.IpAllowList_AllowListActivationRequestRejected`                              | IP address allowlist activation   | Rejected                          | Activation request rejected                                                             |
| `EventId.IpAllowList_AllowListActivationRequestCanceled`                              | IP address allowlist activation   | Canceled                          | Activation request canceled                                                             |
| `EventId.IpAllowList_AllowListActivationRequestFailed`                                | IP address allowlist activation   | Failed                            | Activation request failed                                                               |
| `EventId.IpAllowList_AllowListDeactivationRequestSubmitted`                           | IP address allowlist deactivation | Submitted                         | Deactivation request submitted                                                          |
| `EventId.IpAllowList_AllowListDeactivationRequestApproved`                            | IP address allowlist deactivation | Approved by quorum                | Deactivation request approved by quorum                                                 |
| `EventId.IpAllowList_AllowListDeactivationRequestSigned`                              | IP address allowlist deactivation | Approved by user                  | Deactivation request approved by user                                                   |
| `EventId.IpAllowList_AllowListDeactivationRequestRejected`                            | IP address allowlist deactivation | Rejected                          | Deactivation request rejected                                                           |
| `EventId.IpAllowList_AllowListDeactivationRequestCanceled`                            | IP address allowlist deactivation | Canceled                          | Deactivation request canceled                                                           |
| `EventId.IpAllowList_AllowListDeactivationRequestFailed`                              | IP address allowlist deactivation | Failed                            | Deactivation request failed                                                             |
| `EventId.IpAllowList_AddIpRequestSubmitted`                                           | IP address allowlist              | Approval submitted                | Add IP address request submitted                                                        |
| `EventId.IpAllowList_AddIpRequestApproved`                                            | IP address allowlist              | Approval approved by quorum       | Add IP address request approved by quorum                                               |
| `EventId.IpAllowList_AddIpRequestSigned`                                              | IP address allowlist              | Approval approved by user         | Add IP address request approved by user                                                 |
| `EventId.IpAllowList_AddIpRequestCanceled`                                            | IP address allowlist              | Approval canceled                 | Add IP address request canceled                                                         |
| `EventId.IpAllowList_AddIpRequestRejected`                                            | IP address allowlist              | Approval Rejected                 | Add IP address request rejected                                                         |
| `EventId.IpAllowList_AddIpRequestFailed`                                              | IP address allowlist              | Approval Failed                   | Add IP address request failed                                                           |
| `EventId.IpAllowList_UpdateIpRequestSubmitted`                                        | IP address allowlist              | Changes submitted                 | Update IP address request submitted                                                     |
| `EventId.IpAllowList_UpdateIpRequestApproved`                                         | IP address allowlist              | Changes approved by quorum        | Update IP address request approved by quorum                                            |
| `EventId.IpAllowList_UpdateIpRequestSigned`                                           | IP address allowlist              | Changes approved by user          | Update IP address request approved by user                                              |
| `EventId.IpAllowList_UpdateIpRequestCanceled`                                         | IP address allowlist              | Changes canceled                  | Update IP address request canceled                                                      |
| `EventId.IpAllowList_UpdateIpRequestRejected`                                         | IP address allowlist              | Changes rejected                  | Update IP address request rejected                                                      |
| `EventId.IpAllowList_UpdateIpRequestFailed`                                           | IP address allowlist              | Changes failed                    | Update IP address request failed                                                        |
| `EventId.IpAllowList_DeleteIpRequestSubmitted`                                        | IP address allowlist              | Deletion submitted                | Remove IP address request submitted                                                     |
| `EventId.IpAllowList_DeleteIpRequestSigned`                                           | IP address allowlist              | Deletion approved by user         | Remove IP address request approved by user                                              |
| `EventId.IpAllowList_DeleteIpRequestCanceled`                                         | IP address allowlist              | Deletion canceled                 | Remove IP address request canceled                                                      |
| `EventId.IpAllowList_DeleteIpRequestApproved`                                         | IP address allowlist              | Deletion approved by quorum       | Remove IP address request approved by quorum                                            |
| `EventId.IpAllowList_DeleteIpRequestRejected`                                         | IP address allowlist              | Deletion rejected                 | Remove IP address request rejected                                                      |
| `EventId.IpAllowList_DeleteIpRequestFailed`                                           | IP address allowlist              | Deletion failed                   | Remove IP address request failed                                                        |

# Security

| Event ID                      | Subject | Event            |
| :---------------------------- | :------ | :--------------- |
| EventId.Fspm\_FindingCreated  | FSPM    | Finding created  |
| EventId.Fspm\_FindingResolved | FSPM    | Finding resolved |
| EventId.Fspm\_FindingAccepted | FSPM    | Finding accepted |
| EventId.Fspm\_FindingReopened | FSPM    | Finding reopened |

# Settlements

| Event ID                                                       | Subject            | Event                             | Notification Subject                                     |
| -------------------------------------------------------------- | ------------------ | --------------------------------- | -------------------------------------------------------- |
| `EventId.NetworkConnection_Added`                              | Fireblocks network | Added connection                  | Network Connection Added                                 |
| `EventId.NetworkConnection_Created`                            | Fireblocks network | Made connection                   | Network Connection Created                               |
| `EventId.NetworkConnectionInvitation_ApprovedByAdmin`          | Fireblocks network | Approved invitation               | Network Connection Invitation Approved by admin          |
| `EventId.NetworkConnectionInvitation_Cancelled`                | Fireblocks network | Canceled invitation               | Network Connection Invitation Cancelled                  |
| `EventId.NetworkConnectionInvitation_ReceivedFromCounterparty` | Fireblocks network | Received invitation               | Network Connection Invitation Received from Counterparty |
| `EventId.NetworkConnectionRequest_ApprovedByAdmin`             | Fireblocks network | Invitation approved by connection | Network Connection Request Approved by admin             |
| `EventId.NetworkConnectionRequest_Cancelled`                   | Fireblocks network | Invitation canceled by connection | Network Connection Request Cancelled                     |
| `EventId.NetworkConnectionRequest_Rejected`                    | Fireblocks network | Invitation rejected by connection | Network Connection Request Rejected                      |
| `EventId.NetworkConnectionRoutingChange_Approved`              | Fireblocks network | Approved routing change           | Network Connection Routing Change Approved               |
| `EventId.NetworkConnectionRoutingChange_ApprovedByAdmin`       | Fireblocks network | Approved routing change (admin)   | Network Connection Routing Change Approved By Admin      |
| `EventId.NetworkConnectionRoutingChange_Rejected`              | Fireblocks network | Rejected routing change           | Network Connection Routing Change Rejected               |
| `EventId.NetworkConnectionRoutingChange_RequestSubmitted`      | Fireblocks network | Requested routing change          | Network Connection Routing Change Request Submitted      |
| `EventId.NetworkConnectionRoutingChange_RoutingChanged`        | Fireblocks network | Changed routing                   | Network Connection Routing Change Routing Changed        |
| `EventId.NetworkDiscoverability_TurnedOn`                      | Fireblocks network | Turned on discoverability'        | Network Discoverability Turned On                        |
| `EventId.NetworkDiscoverability_TurnedOff`                     | Fireblocks network | Turned off discoverability'       | Network Discoverability Turned Off                       |
| `EventId.NetworkProfile_Created`                               | Fireblocks network | Created profile'                  | Network Profile Created                                  |
| `EventId.NetworkProfileNameChange_ProfileRenamed`              | Fireblocks network | Approved profile name change      | Network Profile Name Change Profile Renamed              |
| `EventId.NetworkProfileNameChange_RequestSubmitted`            | Fireblocks network | Requested profile name change     | Network Profile Name Change Request Submitted            |
| `EventId.NetworkProfileRemoved_ProfileRemoved`                 | Fireblocks network | Removed profile                   | Network Profile Removed Profile Removed                  |
| `EventId.NetworkProfileRoutingChange_Approved`                 | Fireblocks network | Approved default routing change   | Network Profile Routing Change Approved                  |
| `EventId.NetworkProfileRoutingChange_ApprovedByAdmin`          | Fireblocks network | Approved default routing change'  | Network Profile Routing Change Approved By Admin         |
| `EventId.NetworkProfileRoutingChange_Rejected`                 | Fireblocks network | Rejected default routing change   | Network Profile Routing Change Rejected                  |
| `EventId.NetworkProfileRoutingChange_RequestSubmitted`         | Fireblocks network | Requested default routing change  | Network Profile Routing Change Request Submitted         |
| `EventId.NetworkProfileRoutingChange_RoutingChanged`           | Fireblocks network | Changed default routing           | Network Profile Routing Change Routing Changed           |
| `EventId.NetworkProfileRoutingChange_WaitingForApproval`       | Fireblocks network | Pending approval                  | Network Profile Routing Change Waiting For Approval      |
| `EventId.NetworkConnection_Removed`                            | Fireblocks network | Removed connection                | Network Connection Removed                               |
| `EventId.NetworkConnection_RemovedByCounterparty`              | Fireblocks network | Removed by connection             | Network Connection Removed by counterparty               |
| `EventId.NetworkConnectionInvitation_Rejected`                 | Fireblocks network | Rejected invitation               | Network connection invitation Rejected                   |
| `EventId.NetworkConnectionRequest_Submitted`                   | Fireblocks network | Sent invitation                   | Network connection request Submitted                     |

# Transactions

| Event ID                                                              | Subject              | Event                                   | Notification Subject                                           |
| --------------------------------------------------------------------- | -------------------- | --------------------------------------- | -------------------------------------------------------------- |
| `EventId.IncomingTransaction_AssociationFailed`                       | Incoming transaction | Failed                                  | Incoming Transaction Association Failed                        |
| `EventId.IncomingTransaction_Completed`                               | Incoming transaction | Completed                               | Incoming Transaction Completed                                 |
| `EventId.IncomingTransaction_Submitted`                               | Incoming transaction | Submitted                               | Incoming Transaction Submitted                                 |
| `EventId.IncomingTxAssociationFailed_FailedToAssociateIncomingTxHash` | Incoming transaction | Failed to associate incoming TX hash    | Incoming tx association failed FailedToAssociateIncomingTxHash |
| `EventId.InternalTransaction_Completed`                               | Internal transaction | Completed                               | Internal Transaction Completed                                 |
| `EventId.InternalTransaction_Submitted`                               | Internal transaction | Submitted                               | Internal Transaction Submitted                                 |
| `EventId.OutgoingTransaction_Completed`                               | Outgoing transaction | Completed                               | Outgoing Transaction Completed                                 |
| `EventId.OutgoingTransaction_Submitted`                               | Outgoing transaction | Submitted                               | Outgoing Transaction Submitted                                 |
| `EventId.Transaction_AlertedByAml`                                    | Transaction          | Flagged by AML                          | Transaction Alerted by AML                                     |
| `EventId.Transaction_AmlFailed`                                       | Transaction          | AML failed                              | Transaction AML Failed                                         |
| `EventId.Transaction_AmlScreeningBlockingPeriodTimedOut`              | Transaction          | AML screening blocking period timed out | Transaction AML screening blocking period timed out            |
| `EventId.Transaction_AmlResultRescreened`                             | Transaction          | AML result rescreened                   | Transaction AML Result Rescreened                              |
| `EventId.Transaction_ApprovedBy2ndTier`                               | Transaction          | Approved by 2nd tier                    | Transaction Approved by 2nd Tier                               |
| `EventId.Transaction_AuthorizationRequestInitiated`                   | Transaction          | Authorization request initiated         | Transaction Authorization Request Initiated                    |
| `EventId.Transaction_BlockedByPolicy`                                 | Transaction          | Blocked by TAP                          | Transaction Blocked by Policy                                  |
| `EventId.Transaction_BypassedAml`                                     | Transaction          | Bypassed AML                            | Transaction Bypassed AML                                       |
| `EventId.Transaction_Cancelled`                                       | Transaction          | Canceled                                | Transaction Cancelled                                          |
| `EventId.Transaction_Completed`                                       | Transaction          | Completed                               | Transaction Completed                                          |
| `EventId.Transaction_ConfirmationThresholdOverridden`                 | Transaction          | Confirmation threshold overridden       | Transaction Confirmation Threshold Overridden                  |
| `EventId.Transaction_DeclinedBy2ndTier`                               | Transaction          | Declined by 2nd tier                    | Transaction Declined by 2nd Tier                               |
| `EventId.Transaction_FundsUnfrozen`                                   | Transaction          | Funds unfrozen                          | Transaction Funds Unfrozen                                     |
| `EventId.Transaction_NoteChanged`                                     | Transaction          | Note changed                            | Transaction Note Changed                                       |
| `EventId.Transaction_Rejected`                                        | Transaction          | Rejected                                | Transaction Rejected                                           |
| `EventId.Transaction_RejectedByAml`                                   | Transaction          | Rejected by AML                         | Transaction Rejected by AML                                    |
| `EventId.Transaction_Signed`                                          | Transaction          | Signed                                  | Transaction Signed                                             |
| `EventId.Transaction_Submitted`                                       | Transaction          | Submitted                               | Transaction Submitted                                          |
| `EventId.Transaction_TransactionRejected`                             | Transaction          | Rejected                                | Transaction Transaction Rejected                               |
| `EventId.ExternalTransaction_Completed`                               | Transaction          | Completed                               | External Transaction Completed                                 |
| `EventId.ExternalTransaction_Submitted`                               | Transaction          | Submitted                               | External Transaction Submitted                                 |
| `EventId.Transaction_ScreeningIncomingStarted`                        | Transaction          | Screening incoming started              | Transaction Screening incoming started                         |
| `EventId.Transaction_AmlIncomingStarted`                              | Transaction          | AML Incoming Started                    | Transaction AML Incoming Started                               |
| `EventId.Transaction_AmlIncomingCompleted`                            | Transaction          | AML Incoming Completed                  | Transaction AML Incoming Completed                             |
| `EventId.Transaction_AmlIncomingFailed`                               | Transaction          | AML Incoming Failed                     | Transaction AML Incoming Failed                                |
| `EventId.Transaction_AmlIncomingInBackground`                         | Transaction          | AML Incoming in background              | Transaction AML Incoming in background                         |
| `EventId.Transaction_TrIncomingStarted`                               | Transaction          | TR Incoming started                     | Transaction TR Incoming started                                |
| `EventId.Transaction_TrIncomingCompleted`                             | Transaction          | TR Incoming completed                   | Transaction TR Incoming completed                              |
| `EventId.Transaction_TrIncomingFailed`                                | Transaction          | TR Incoming failed                      | Transaction TR Incoming failed                                 |
| `EventId.Transaction_ScreeningIncomingCompleted`                      | Transaction          | Screening incoming completed            | Transaction Screening incoming completed                       |

# Wallets

| Event ID                                                               | Subject           | Event                               | Notification Subject                                                    |
| ---------------------------------------------------------------------- | ----------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| `EventId.ColdWallet_DeviceHasLessThan10_RemainingSignatures`           | Cold wallet       | Requires signatures                 | Cold Wallet Device has less than 10% remaining signatures               |
| `EventId.VaultAccount_Added`                                           | Vault             | Created                             | Vault Account Added                                                     |
| `EventId.VaultAccount_AddedInBulk`                                     | Vault             | Bulk created                        | Vault Account Added in Bulk                                             |
| `EventId.VaultAccount_Archived`                                        | Vault             | Archived                            | Vault Account Archived                                                  |
| `EventId.VaultAccount_DisabledAutoFueling`                             | Vault             | Turned off auto-fueling             | Vault Account Disabled Auto Fueling                                     |
| `EventId.VaultAccount_EnabledAutoFueling`                              | Vault             | Turned on auto-fueling              | Vault Account Enabled Auto Fueling                                      |
| `EventId.VaultAccount_Renamed`                                         | Vault             | Renamed                             | Vault Account Renamed                                                   |
| `EventId.VaultAccount_SetHiddenOnUi`                                   | Vault             | Hidden                              | Vault Account Set Hidden On UI                                          |
| `EventId.VaultAccount_SetVisibleOnUi`                                  | Vault             | Made visible                        | Vault Account Set Visible On UI                                         |
| `EventId.VaultAccount_Unarchived`                                      | Vault             | Unarchived                          | Vault Account Unarchived                                                |
| `EventId.VaultDepositAddress_ChangedDescription`                       | Wallet            | Changed deposit address description | Vault deposit address Changed description                               |
| `EventId.VaultWallet_Added`                                            | Wallet            | Added                               | Vault wallet Added                                                      |
| `EventId.VaultWallet_AddedInBulk`                                      | Wallet            | Bulk added                          | Vault wallet Added in Bulk                                              |
| `EventId.VaultWallet_Archived`                                         | Wallet            | Archived                            | Vault wallet Archived                                                   |
| `EventId.VaultWallet_Unarchived`                                       | Wallet            | Unarchived                          | Vault wallet Unarchived                                                 |
| `EventId.BackupAndRecovery_SentVerifyPassphraseAlert`                  | Mobile passphrase | Sent verification alert             | Backup And Recovery Sent Verify Passphrase Alert                        |
| `EventId.BackupAndRecovery_VerifiedPassphrase`                         | Mobile passphrase | Verified passphrase                 | Backup And Recovery Verified Passphrase                                 |
| `EventId.HardKeyRecoveryProcess_RequestSubmitted`                      | Key backup        | Requested                           | Hard Key Recovery Process Request Submitted                             |
| `EventId.MobileKey_BackedUp`                                           | Mobile passphrase | Backed up                           | Mobile Key Backed Up                                                    |
| `EventId.WorkspaceKeyBackup_ApprovedByAdmin`                           | Key backup        | Approved                            | Workspace key backup Approved by admin                                  |
| `EventId.WorkspaceKeyBackup_ApprovedByAdminQuorum`                     | Key backup        | Approved by quorum                  | Workspace key backup Approved by admin quorum                           |
| `EventId.WorkspaceKeyBackup_Cancelled`                                 | Key backup        | Canceled                            | Workspace key backup Cancelled                                          |
| `EventId.WorkspaceKeyBackup_InternalErrorWhenGeneratingTheBackup`      | Key backup        | Error generating key backup         | Workspace key backup Internal error when generating the backup          |
| `EventId.WorkspaceKeyBackup_RequestSubmitted`                          | Key backup        | Requested                           | Workspace key backup Request Submitted                                  |
| `EventId.WorkspaceKeyBackup_TheProcessHasBeenRejectedByOnOfTheAdmins`  | Key backup        | Rejected                            | Workspace key backup The process has been rejected by on of the admins  |
| `EventId.WorkspaceKeyBackup_TheProcessHasBeenRejectedByOneOfTheAdmins` | Key backup        | Rejected                            | Workspace key backup The process has been rejected by one of the admins |
| `EventId.WorkspaceKeyBackup_TheWorkspaceOwnerHasInitiatedTheProcess`   | Key backup        | Initiated                           | Workspace key backup The workspace owner has initiated the process      |
| `EventId.WorkspaceKeyBackup_MarkedAsIncomplete`                        | Key backup        | Marked as incomplete                | Workspace key backup Marked as incomplete                               |
| `EventId.WorkspaceKeyBackup_MarkedAsCompleted`                         | Key backup        | Marked as completed                 | Workspace key backup Marked as completed                                |
| `EventId.WorkspaceKeyBackup_PendingApproval`                           | Key backup        | Pending approval                    | Workspace key backup Pending approval                                   |
| `EventId.WorkspaceKeyBackup_BackupSent`                                | Key backup        | Backup sent                         | Workspace key backup Backup sent                                        |
| `EventId.GasStation_LowFunds`                                          | Gas station       | Low funds                           | Gas Station Low funds                                                   |
| `EventId.GasStation_VaultChanged`                                      | Gas station       | Changed vault                       | Gas Station Vault changed                                               |
| `EventId.GasStation_SweepTransactionInitiated`                         | Gas station       | Initiated sweep                     | Gas Station Sweep transaction initiated                                 |
| `EventId.GasStation_FundsDeposited`                                    | Gas station       | Deposited funds                     | Gas Station Funds deposited                                             |
| `EventId.ExternalWallet_Added`                                         | Wallet            | Added                               | External wallet Added                                                   |
| `EventId.ExternalWallet_Removed`                                       | Wallet            | Removed                             | External wallet Removed                                                 |
| `EventId.MyWallet_Added`                                               | My wallet         | Added                               | My wallet Added                                                         |
| `EventId.MyWallet_Removed`                                             | My wallet         | Removed                             | My wallet Removed                                                       |

# Web3

| Event ID                                                        | Subject                      | Event              | Notification Subject                                     |
| --------------------------------------------------------------- | ---------------------------- | ------------------ | -------------------------------------------------------- |
| `EventId.Allowance_AmountModified`                              | Allowance                    | Changed            | Allowance Amount Modified                                |
| `EventId.Contract_Added`                                        | Contract                     | Added              | Contract Added                                           |
| `EventId.Contract_Removed`                                      | Contract                     | Removed            | Contract Removed                                         |
| `EventId.FireblocksExtensionConnected_ExtensionConnected`       | Fireblocks browser extension | Connected          | Fireblocks extension connected Extension Connected       |
| `EventId.FireblocksExtensionUpdated_ExtensionUpdated`           | Fireblocks browser extension | Updated            | Fireblocks extension updated Extension Updated           |
| `EventId.FireblocksExtensionDisconnected_ExtensionDisconnected` | Fireblocks browser extension | Disconnected       | Fireblocks extension disconnected Extension Disconnected |
| `EventId.Nft_MarkedAsSpam`                                      | NFT                          | Marked as spam     | NFT Marked as spam                                       |
| `EventId.Nft_MarkedAsNotSpam`                                   | NFT                          | Marked as not spam | NFT Marked as not spam                                   |

# Whitelist

| Event ID                                       | Subject             | Event     | Notification Subject                   |
| ---------------------------------------------- | ------------------- | --------- | -------------------------------------- |
| `EventId.Address_Removed`                      | Whitelisted address | Removed   | Address Removed                        |
| `EventId.Address_Whitelisted`                  | Whitelisted address | Added     | Address Whitelisted                    |
| `EventId.AddressWhitelisting_ApprovedByAdmin`  | Whitelisted address | Approved  | Address Whitelisting Approved by admin |
| `EventId.AddressWhitelisting_Cancelled`        | Whitelisted address | Canceled  | Address Whitelisting Cancelled         |
| `EventId.AddressWhitelisting_Rejected`         | Whitelisted address | Rejected  | Address Whitelisting Rejected          |
| `EventId.AddressWhitelisting_RequestSubmitted` | Whitelisted address | Requested | Address Whitelisting Request Submitted |
