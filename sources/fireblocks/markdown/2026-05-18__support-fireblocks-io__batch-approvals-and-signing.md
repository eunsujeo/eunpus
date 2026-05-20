<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/25477979558556-Batch-approvals-signing
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__batch-approvals-and-signing.pdf
-->

# Batch approvals & signing

*Updated 1 month ago* (as of 2026-05-18 capture)

<!-- page: 1 -->

## Overview

Batch Approvals & Signing allows you to process multiple transfer requests simultaneously from your Fireblocks mobile app. Instead of approving or signing transactions one at a time, you can select up to 10 requests and process them together with a single authentication. All transfers in your batch are processed in parallel, significantly reducing the total time compared to processing them individually.

**Batch Approvals (v3.4.0 or later)**: the foundational batch feature, which enables batching for pre-signature approval requests and unlocks the entire batch capability for your workspace. You must enable Batch Approvals before you can use Batch Signing.

**Batch Signing (v3.5.0 or later)**: extends your batch to also include signing-stage transfer requests. Requires Batch Approvals to be enabled first. Once enabled, you can create approval-only batches, signing-only batches, or mix both in a single batch.

### Key benefits:

- Process multiple requests with one PIN and biometric authentication
- Reduce time spent on repetitive signing
- Maintain security with built-in safeguards
- Handle both approvals and signatures in the same batch

## Enabling the feature

Batch approvals & signing is available in **Labs** within your workspace settings. Only workspace owners can enable this feature.

To enable:

<!-- page: 2 -->

1. In your Fireblocks Console, navigate to **Settings > Workspaces**.
2. Select your workspace.
3. Select the **Labs** tab.
4. Toggle on the features:
   - **Batch Approvals**: enable to process approval requests in batches
   - **Batch Signing**: enable to process signing requests in batches (requires the Batch approvals feature to be enabled first)

Batch approvals can be enabled independently. Batch signing requires Batch approvals to be enabled first.

## Adding requests to a batch

Requests must meet these criteria to be added to a batch:

- They must be transfer requests only
- They must arrive from the same workspace
- All requests must be assigned to the same user (cannot mix requests for different users)
- The requests must not be flagged for risk (e.g., malicious activity or other risk levels)
- The feature must be enabled for the workspace the request originates from

**Batch size limit**: Maximum 10 requests per batch, regardless of type. You can mix approval and signing requests (e.g., 3 approvals and 7 signatures).

## Creating a batch

- **From the request list**:

<!-- page: 3 -->

  - Look for the **+** icon on eligible request cards.
  - Tap the icon to add requests to your batch.
  - A counter shows how many requests are in your batch (e.g., "5 in batch").
- **From request details**: tap on a request to open the details screen, then tap **Add to Batch**.

<!-- page: 4 -->

- **Disabled icon**: If the **+** icon is grayed out, tap it to see why:
  - "Feature not enabled for this workspace"
  - "Can only batch requests for same user"
  - "Batch is full (maximum reached)"

## Reviewing your batch

<!-- page: 5 -->

Before processing, review the summary information and request list.

- **Summary displays**:
  - Number of requests by type (e.g., "1 approval, 5 signing requests")
  - Workspace name (e.g., "Production Workspace")
- **Request list**: tap any request to view full details. Remove requests by swiping left and tapping **Dismiss**, or by opening the request details and selecting **Remove**.
- **Biometric badge**: when your batch contains both approval and signing requests, a "2 biometrics required" badge appears below the request list.

## Processing your batch

Use PIN or biometrics to authenticate your batch before it is submitted for processing.

- **Authentication**: enter your PIN once per batch. Biometric authentication depends on your batch type:
  - **Approval-only batch**: one biometric authentication
  - **Signing-only batch**: one biometric authentication
  - **Mixed batch**: two biometric authentications (approval biometric is always first)
- **Canceling**

<!-- page: 6 -->

  - Cancel on first biometric (approvals) → entire batch is canceled
  - Cancel on second biometric (signing, mixed batches only) → signing is canceled, approvals continue
- **During processing**: a message displays: "Processing batch... Don't close the app." Each request is processed individually. Some requests may succeed while others fail.

> **Important**: keep the app open during processing. If you background or force-close the app, the batch can fail. Failed transfer requests are no longer valid and must be re-initiated from the Console.

## Long processing transfers (v3.5.0 or later)

In the batch review screen, transfers expected to take longer display a **Long processing** tag. Tap the tag to learn more. These are multi-input transfers that require additional processing time. Review these transfers before submitting your batch.

## Results

**Approval-only batch**: when all requests succeed, a full-screen success confirmation appears.

**Signing batch or mixed batch**:
- If all requests succeed: full-screen success confirmation with Done + 4-second auto-redirect.
- If one or more requests fail: results screen with successful and failed requests. Failed requests appear at the top with Fireblocks transaction ID. Use this ID to look up details in the Console. Failed transfer requests are no longer valid and must be re-initiated from the Console.

> **Note**: A signed transaction does not guarantee completion. Use the console to track its status.

<!-- page: 7 -->

If you background the app during processing, you can return to the results screen. If the app is closed completely, you return to the request list on relaunch.

## Batch selection mode

When you have one or more requests in your batch, you cannot approve or deny requests individually. Attempting individual actions displays: "Clear batch to approve individually."

Tap **Discard Batch** to clear all selections and exit batch mode.

## Troubleshooting

(short FAQ section: icon not appearing, grayed out, cross-workspace, app close, failed request info)

<!-- page: 8 -->

## Security

Batch processing maintains all existing security controls. Authentication is required for each batch operation. Risk-flagged transactions cannot be added to batches. All requests are processed individually after authentication. Failed requests do not affect successful completions in the same batch.

## Best practices

1. **Review carefully**: always review your batch before processing.
2. **Stay in the app**: don't close or background the app while processing.
3. **Group similar requests**: use the filter options.

<!-- page: 9 -->

## Need help?

Reach out to Fireblocks support for assistance with Batch approvals & signing.
