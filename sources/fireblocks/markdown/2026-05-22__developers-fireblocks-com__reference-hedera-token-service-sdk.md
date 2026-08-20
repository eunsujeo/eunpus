> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Hedera Token Service SDK

> **This Tool Utilizes Fireblocks RAW Signing**
>
> Raw Signing is an insecure signing method and is not generally recommended.
> Bad actors can trick someone into signing a valid transaction message and use it to steal funds.
>
> For this reason, Raw Signing is a premium feature that requires an additional purchase and is not available in production workspaces by default. If you're interested in this feature and want to see if your use case is eligible for it, please contact your Customer Success Manager.
>
> **Note:** Fireblocks Sandbox workspaces have Raw Signing enabled by default to allow for testing purposes.

This library provides an implementation of the Hedera Client designed for signing operations with the Fireblocks TypeScript SDK. It adheres to [HIP-338](https://hips.hedera.com/hip/hip-338).

Internally, the implementation acts as a wrapper utilizing Raw Signing. It manages all necessary raw signing calls, abstracting the complexities to ensure easy and seamless integration with both Fireblocks and the Hedera SDK.

Additionally, this library supports any token operations on the Hedera blockchain that are not yet natively available through the Fireblocks console and APIs. For code examples and further guidance on how to use the library, please visit the [GitHub repository](https://github.com/fireblocks/hbar-fireblocks-sdk).
