> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Caching Signatures

Some DeFi apps expect to receive the same signature for separate consecutive messages. Signature caching allows the most recent signature to be returned based on the content and the source, including the workspace ID, Vault account, and asset, or derivation path. This signature may be returned repeatedly, skipping additional approval and signing processes.

Signature caching is enabled for all users by default using [WalletConnect](https://support.fireblocks.io/hc/en-us/articles/5403817784732-Connecting-to-Web3-using-WalletConnect) or the [Fireblocks Chrome Extension](https://fireblocks.zendesk.com/hc/en-us/articles/5403962226332). However, you can opt out by [contacting Fireblocks Support](https://support.fireblocks.io/hc/en-us/requests/new).

Signature caching also works with [Typed Messages](/docs/typed-message-signing-1) and [Raw Signing](/docs/raw-signing) via the Fireblocks API.
