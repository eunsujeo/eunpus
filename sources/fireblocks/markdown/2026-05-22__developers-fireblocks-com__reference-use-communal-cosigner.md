> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Using the Communal Test Co-signer

> 1. **IMPORTANT**: The Communal Callback handler must NOT be used for performance testing.
> 2. Due to legal regulations, Fireblocks can not take custodial responsibility for Mainnet workspaces. Therefore, this option is available only to Testnet workspaces.

## Overview

Setting up a new Co-signer from scratch can be time-consuming. To accelerate development and prepare your workspace for automation and API-driven workflows, Fireblocks offers the option to use a Communal Test Co-signer before configuring your own.

The Communal Test Co-signer is hosted and managed by Fireblocks and serves all customers with Testnet workspaces. Any workspace owner can approve pairing API users with it, generate MPC key share sets, and use it to sign transactions.

When you start testing and verifying your signing or approval automation workflows, we recommend setting up your self-hosted API Co-signer instance and replacing the Communal Test Co-signer as soon as your instance is ready. To stop using the Communal Test Co-signer, unpair or delete the API users that were paired with it.

***

## Connecting to the Communal Test Co-signer

To use the Fireblocks Communal API Co-Signer, create a new API user using the Console in a testnet workspace and select the option to connect it with the Communal Co-signer.

Selecting a user role with [Signer](https://support.fireblocks.io/hc/en-us/articles/360012832959-User-roles#h_01H9P4D2W1436XZYXESPTQE2J7) or [Admin](https://support.fireblocks.io/hc/en-us/articles/360012832959-User-roles#h_01H9P4D2W1436XZYXESPTQE2J7) privileges will allow you to test transaction signing and approving workspace changes. If you only want to test approving workspace configuration changes, you can select the [Non-Signing Admin](https://support.fireblocks.io/hc/en-us/articles/360012832959-User-roles#h_01H9P4D2W1436XZYXESPTQE2J7) user role.

In a [Sandbox workspace](https://support.fireblocks.io/hc/en-us/articles/360020612820-Workspace-types), each API user is automatically paired with the Fireblocks Communal Test Co-signer. This co-signer manages the MPC key shares for all API users in the Sandbox environment across all workspaces.

***

## Testing a Callback Handler with the Communal Test Co-Signer

* [Setup a Co-signer Callback Handler](/reference/api-cosigner-setup-callback-handler) and configure it to use a public key for JWT-encoded message authentication.
* [Submit a request to Fireblocks support](https://support.fireblocks.io/hc/en-us/requests/new?ticket_form_id=5129187878556\&tf_5465594782876=issue_test_the_fireblocks_communal_api__cosigner_cosigner_setup_and_configuration__what_are_you_trying_to_do___test_the_fireblocks_communal_api_cosigner) to implement a Callback Handler for use with the Communal Test Co-Signer and provide the following details:
  * The workspace name
  * The API user's ID (API key)
  * The Callback Handler's URL (HTTPS)
  * The Callback Handler's public key
* Once Fireblocks Support sets up your Callback Handler, you can integrate and test it.

***

## Known limitations

For UTXO transactions, such as `BTC_TEST` in testnet workspaces, the Fireblocks Communal Test Co-Signer supports a maximum of 50 transaction inputs. The first 50 inputs from the transaction source vault account are selected automatically based on the requested amount.

For all other workspaces and signing configurations, up to 250 transaction inputs are supported for Bitcoin transactions.

If a transaction signed by the Fireblocks Communal Test Co-Signer fails because it requires more than 50 inputs, the transaction substatus will be `INTERNAL_ERROR`.
