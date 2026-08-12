<!--
source_url: https://developers.circle.com/gateway/references/technical-guide
downloaded_at: 2026-08-11
status: full
priority: TIER1
domain: Bridge / Circle Gateway
acquisition_method: "curl .md → file save (v3.2.2 Mode C)"
-->

# Gateway technical guide

Circle Gateway consists of
[two smart contracts](/gateway/references/contract-addresses) (each deployed on
multiple blockchains), and an offchain system. Users deposit USDC into Gateway
Wallet contracts on any supported source chain. Once their deposits are
finalized, they can instantly transfer their USDC to a destination chain through
an API call, followed by a contract call to the Gateway Minter on the
destination chain. The contracts, together with the offchain system, ensure the
integrity of the USDC supply and prevent double-spending.

Compared to [CCTP](/cctp), Gateway allows users to front-load the finalization
wait time rather than requiring finality in the middle of a transfer flow. This
enables users to use all of their USDC instantly on any blockchain (even in
amounts exceeding the balance held on any single blockchain), without needing to
decide beforehand what amount or destination is needed. As such, it is optimized
for use-cases requiring capital efficiency, low latency, and chain abstraction.

## Gateway Wallet contracts

The wallet contract accepts deposits from users via direct transfer, EIP-2612
permit, or ERC-3009 authorization. It's deployed to multiple blockchains so
users can deposit from whatever source chain they hold USDC on. The contract is
non-custodial, meaning users always have full control over their USDC and Circle
can't transfer or burn any USDC without explicit user authorization. Once USDC
is deposited and the deposit events are finalized onchain, the USDC can be used
crosschain.

To preserve the non-custodial nature of the USDC held in the Gateway Wallet
contract, there is a trustless withdrawal mechanism that may be used in the
unlikely event that Circle's APIs are down for an extended period or service is
otherwise unavailable. To withdraw USDC onchain with no API interaction, users
must first initiate a withdrawal with a transaction, wait for a 7-day withdrawal
delay period, and then the user may complete the withdrawal and receive the
USDC. This delay is what allows the Gateway System to safely issue attestations
to instantly transfer USDC to other blockchains, since it guarantees that there
is sufficient time to submit the corresponding burn transaction.

## Gateway Minter contracts

The
[minter contract](/gateway/references/contract-interfaces-and-events#gatewayminter)
accepts attestations signed by the Gateway System and mints USDC to the
specified destination. It's also deployed to multiple blockchains, including
blockchains that may not yet support the wallet contract.

## Gateway system

Circle runs an offchain, automated system that serves an API for user
interaction, observes onchain events, and ensures that every mint on a
destination chain corresponds 1:1 with a burn on each source chain.

### Balances

At the center of the system is an offchain ledger that represents the USDC
balances that are deposited and are available for use in instant transfers.
These balances are tracked for every combination of blockchain, token, and
address. They're eventually consistent with onchain state, where safety is
ensured by mechanisms built into the wallet contract.

### Inputs

The following table describes the main inputs to the Gateway System, along with
what it does in response to each.

| Input                                 | Response                             |
| ------------------------------------- | ------------------------------------ |
| `Deposit` event                       | Increment balance                    |
| Transfer request (attestation issued) | Decrement balance                    |
| `AttestationUsed` event               | Submit burn intents to source chains |
| Attestation expires unused            | Increment balance                    |
| `WithdrawInitiated` event             | Decrement balance                    |

All onchain events are only observed as they're finalized. See
[Required block confirmations](/gateway/references/supported-blockchains#required-block-confirmations)
for the details on finality on each supported chain.

## Core primitives

The contracts and API share a set of primitives that are used to represent
transfers consistently, both when interacting with the API and as inputs to the
smart contracts. There is also a byte encoding for each that's used across
blockchains. See the
[source code of the EVM contracts](https://github.com/circlefin/evm-gateway-contracts)
for details about widths, offsets, and type markers.

<Note>
  Solana uses different message encodings and signing requirements to accommodate
  transaction size limits. See
  [Solana programs and interfaces](/gateway/references/solana-programs) for
  Solana-specific details.
</Note>

### Transfer specification

A
[transfer specification](https://github.com/circlefin/evm-gateway-contracts/blob/master/src/lib/TransferSpec.sol)
describes everything about a transfer from one domain to another. It's embedded
in the other two primitives, and its `keccak256` hash is used as a crosschain
identifier and replay protection.

**`TransferSpec`**

| Field                  | Description                                                                   |
| ---------------------- | ----------------------------------------------------------------------------- |
| `version`              | The protocol version, used for forward compatibility. Always set to 1.        |
| `sourceDomain`         | The domain of the wallet contract from which this transfer came               |
| `destinationDomain`    | The domain of the minter contract from which this transfer is valid           |
| `sourceContract`       | The address of the wallet contract on the source domain                       |
| `destinationContract`  | The address of the minter contract on the destination domain                  |
| `sourceToken`          | The token address on the source domain                                        |
| `destinationToken`     | The token address on the destination domain                                   |
| `sourceDepositor`      | The address to debit in the wallet contract on the source domain              |
| `destinationRecipient` | The address to receive the USDC on the destination domain                     |
| `sourceSigner`         | The signer who signed for the transfer (may be the same as `sourceDepositor`) |
| `destinationCaller`    | The address of the caller who may use the attestation (0 for any caller)      |
| `value`                | The amount to be transferred                                                  |
| `salt`                 | An arbitrary value that can make the transfer spec hash unique                |
| `hookData`             | Arbitrary bytes that may be used for onchain composition                      |

### Burn intent

A
[burn intent](https://github.com/circlefin/evm-gateway-contracts/blob/master/src/lib/BurnIntents.sol)
is constructed and signed by the user, and provided to the Gateway API during a
transfer request. This is used to authenticate the user (since it must be signed
by the address specified in the `sourceSigner` field of the transfer spec) as
well as to declare the parameters of the desired transfer.

**`BurnIntent`**

| Field            | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| `maxBlockHeight` | The expiration block height on the source chain            |
| `maxFee`         | The maximum fee that may be collected by Circle            |
| `spec`           | The transfer specification describing the desired transfer |

<Note>
  **Note**: When Arbitrum is the source chain, the `maxBlockHeight` in the burn
  intent should be in terms of the **Ethereum L1 block height**. Refer to the
  [Arbitrum
  Docs](https://docs.arbitrum.io/build-decentralized-apps/arbitrum-vs-ethereum/block-numbers-and-time)
  to learn more about Arbitrum's behavior around block height.
</Note>

<Note>
  **Note**: When Solana is the source chain, `maxBlockHeight` refers to the last
  slot before the signed message is invalid.
</Note>

This user-signed payload is what Gateway System uses to prove to the wallet
contract on the source chain that the user intended to make the specified
transfer. Without this user signature, Circle is unable to unilaterally burn or
transfer user assets from the wallet contract to complete the transfer loop. To
further cement the non-custodial nature of the wallet contract, burn intents
expire so that the Gateway System doesn't hold "active" intents for long.

At the time of the transfer request, the Gateway System verifies that the user's
signature is valid, that the expiry block is sufficiently far in the future (at
least the wallet's `withdrawalDelay` from the current block), and that the fee
is sufficient to cover both the gas for the burn transaction and the transfer
fee.

If multiple burn intents share a common `sourceSigner` and the relevant
blockchains all share the same signature scheme (such as multiple EVM
blockchains), burn intents may be packed together into a burn intent set and
signed as a single payload:

**`BurnIntentSet`**

| Field     | Description                                            |
| --------- | ------------------------------------------------------ |
| `intents` | An array of burn intents describing multiple transfers |

<Note>
  **Note**: You can include a maximum of 16 burn intents in a single transfer
  request. The Gateway API returns a `400` error for requests that include more
  than 16 burn intents.
</Note>

<Note>
  **Note**: Burn intent sets are only supported on EVM blockchains. On Solana,
  each transfer must be specified as a separate signed `BurnIntent`. See [Solana
  programs and interfaces](/gateway/references/solana-programs) for details.
</Note>

For EVM blockchains, this structure is signed as EIP-712 typed data. For other
blockchains, it's signed in its byte-encoded form.

#### Signatures

Gateway supports Externally Owned Account (EOA) signatures, verified with a
static ECDSA check. On EVM blockchains, it also supports smart contract
signatures, verified with ERC-1271. This lets smart contracts and smart contract
accounts (SCAs) authorize transfers directly with their own validation logic.
See [ERC-1271 programmable authorization](/gateway/references/erc-1271) for
details.

### Attestation

An
[attestation](https://github.com/circlefin/evm-gateway-contracts/blob/master/src/lib/Attestations.sol)
is constructed and signed by the Gateway System in response to a transfer
request. It proves to the minter contract that at the time of the transfer
request, the user had a sufficient balance in the wallet contracts and all other
details of the transfer were valid, so the mint is safe to perform. Attestations
expire after 10 minutes.

**`Attestation`**

| Field            | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| `maxBlockHeight` | The expiration block height on the destination chain       |
| `spec`           | The transfer specification describing the desired transfer |

<Note>
  **Note**: When Arbitrum is the destination chain, the `maxBlockHeight` in the
  attestation is returned in terms of the **Ethereum L1 block height**. Refer to
  the [Arbitrum
  Docs](https://docs.arbitrum.io/build-decentralized-apps/arbitrum-vs-ethereum/block-numbers-and-time)
  to learn more about Arbitrum's behavior around block height.
</Note>

The transfer specification contained in an attestation is identical to what was
signed by the user. Because of this, its `keccak256` hash is emitted during the
mint transaction and the same hash is emitted during the corresponding burn
transaction. This allows for crosschain traceability and reconciles the 1:1
relationship between mints and burns in the system.

When a transfer involves multiple source domains (such as when the user passes a
burn intent set or multiple standalone burn intents), the Gateway System
constructs and signs an attestation set:

**`AttestationSet`**

| Field          | Description                                            |
| -------------- | ------------------------------------------------------ |
| `attestations` | An array of attestations describing multiple transfers |

While events are emitted for each attestation contained in a set, the entire
transaction is atomic and only one mint (of the total value of all contained
attestations) happens during the transaction.

## Key operations

The Gateway System supports the following key operations.

### Deposit

To deposit USDC into the Gateway System, users may choose between several
onchain deposit methods:

| Method                                                 | Description                                                            |
| ------------------------------------------------------ | ---------------------------------------------------------------------- |
| [`deposit`][deposit]                                   | Deposit to the contract after granting an allowance for the token      |
| [`depositFor`][depositFor]                             | Same as `deposit`, but credit the USDC to another depositor's balance  |
| [`depositWithPermit`][depositWithPermit]               | Deposit using a signed EIP-2612 permit (credited to the signer)        |
| [`depositWithAuthorization`][depositWithAuthorization] | Deposit using a signed ERC-3009 authorization (credited to the signer) |

[deposit]: /gateway/references/contract-interfaces-and-events#deposit

[depositFor]: /gateway/references/contract-interfaces-and-events#depositfor

[depositWithPermit]: /gateway/references/contract-interfaces-and-events#depositwithpermit

[depositWithAuthorization]: /gateway/references/contract-interfaces-and-events#depositwithauthorization

<Warning>
  **Warning:** Directly transferring USDC to the Gateway Wallet contract with a
  standard ERC-20 transfer will result in loss of that USDC. You must use one of
  the deposit methods on the wallet contract to get a unified USDC balance.
</Warning>

It's important to note that before deposited USDC shows up in the Gateway System
and may be used for transfers, the deposit transactions must be finalized
onchain. See
[Required block confirmations](/gateway/references/supported-blockchains#required-block-confirmations)
for more details about what's considered finalized on each supported blockchain.

### Check balances

Use the `/v1/balances` endpoint of the API to check the latest available balance
recorded by the Gateway System. These balances are what's available to be
instantly transferred using a transfer request.

### Check pending deposits

Use the [`/v1/deposits`](/api-reference/gateway/all/get-deposits) endpoint to
check pending deposits. A deposit is in `pending` state when the user has
submitted the deposit transaction but it has not yet been processed by the
Gateway service.

### Instant transfer

First, construct a burn intent or burn intent set describing the desired
transfer. Sign it with the address that owns the USDC or is an authorized
delegate (see below for more information about delegates).

Pass the burn intents to the `/v1/transfer` endpoint of the API to request an
attestation from the Gateway System. If the transfer is valid and the request is
not forwarded, the API responds with top-level `attestation` and `signature`
fields for the destination domain.

Forwarded requests may omit those fields. To retrieve the richer transfer
record, including `burnIntents` and nested `attestation.payload` and
`attestation.signature` fields, use
[`GET /v1/transfer/{id}`](/api-reference/gateway/all/get-transfer-by-id).

Next, make a contract call to the minter contract on the destination chain using
the attestation and signature when mint submission is not being forwarded. To
atomically compose this mint with other onchain actions, use a multi-call
contract.

Note that if `destinationCaller` is specified in any of the transfer specs, it
must match the sender of the transaction (this can be used to prevent
front-running a mint when it's intended to be composed with other actions in the
same transaction).

The Gateway System ensures that if an attestation is used, the corresponding
burn transaction is submitted to all involved source chains.

### Withdrawal

There are two ways to remove USDC from the Gateway system:
[instant transfers](#instant) and [trustless withdrawals](#trustless).

#### Instant

The destination chain of a transfer may be the same as the source chain. This
means that to withdraw USDC from the wallet contract on the same blockchain, the
transfer flow described in the preceding section applies. The only
[fee](/gateway/references/fees) for same chain withdrawals is to cover gas for
the burn transaction (no other transfer fee is charged).

The reason same chain withdrawals still involve a mint and burn rather than just
a transfer out of the wallet contract is to ensure that there are no methods of
removing USDC from the wallet contract that don't involve a user signature.

#### Trustless

In the unlikely event that Circle's APIs are down for an extended period or
service is unavailable for any other reason, users can trustlessly withdraw USDC
with a delay.

First, make a contract call to the
[`initiateWithdrawal`](/gateway/references/contract-interfaces-and-events#initiatewithdrawal)
method with the desired amount to withdrawal. After a delay of 7 days, make a
contract call to the
[`withdraw`](/gateway/references/contract-interfaces-and-events#withdraw) method
to complete the withdrawal.

### Delegates

Gateway lets you delegate your deposit so that a different account can authorize
transfers on your behalf. Any user can add one or more other addresses that are
allowed to sign transfer requests for their deposited USDC. This acts as a full
allowance for that balance.

The delegate account can be any account whose signatures Gateway accepts,
including an EOA or a smart contract using
[ERC-1271](/gateway/references/erc-1271). This is built into Gateway through its
[delegate mechanism](https://github.com/circlefin/evm-gateway-contracts/blob/master/src/modules/wallet/Delegation.sol).

#### Adding a delegate

To add a delegate, use the
[`addDelegate`](/gateway/references/contract-interfaces-and-events#adddelegate)
method on the wallet contract. This needs to be done for each wallet contract
where the depositor address holds USDC across all blockchains.

#### Removing a delegate

To remove a delegate (for key rotation or other purposes), use the
[`removeDelegate`](/gateway/references/contract-interfaces-and-events#removedelegate)
method of the wallet contract. This needs to be done for each wallet contract
where the depositor address holds USDC across all blockchains.

Note that when delegates are removed, signatures they produced are still valid
for the purpose of fulfilling burn intents onchain. This ensures that burns may
be executed safely even in the event of a revocation. The API still reflects
revocations as soon as they're finalized onchain.

## Implementation considerations

When building directly with Gateway contracts and APIs, keep these safety checks
in your application flow:

* Use the Gateway Wallet deposit methods only. Do not expose the Gateway Wallet
  contract as a generic ERC-20 recipient; standard ERC-20 transfers to the
  Gateway Wallet contract result in loss of USDC.
* Prefer signature-based or bounded authorization for deposits where possible.
  Use `depositWithPermit` or `depositWithAuthorization` when the token and
  wallet support them. If your flow uses `approve` followed by `deposit`, treat
  them as two separate transactions and surface their status separately.
* Treat pending deposits separately from available balance. Deposits must be
  finalized and processed by the Gateway System before they can be used for
  instant transfers.
* Treat delegates as high-privilege signers. A delegate can sign transfer
  requests for deposited USDC on the wallet contract where it is authorized. Add
  delegates only where needed, monitor them, and remove them during key rotation
  or access removal.
* Do not assume delegate removal cancels signed burn intents. Burn intents that
  were signed before revocation remain valid for onchain execution until they
  expire.
* For ERC-1271 contract signers, see
  [ERC-1271 programmable authorization](/gateway/references/erc-1271#limitations-and-considerations).
* Track expiry and transfer records. Burn intents expire according to
  `maxBlockHeight`, and Gateway attestations expire if unused. For forwarded
  transfers, store the returned transfer `id` and use `GET /v1/transfer/{id}` to
  check status.
* Use `destinationCaller` for composed mint flows where only a specific caller
  should be able to use the attestation. This can help prevent third-party mint
  front-running when the mint is intended to be part of another onchain action.
* Include the trustless withdrawal path in recovery planning. If Circle's APIs
  are unavailable for an extended period, users can initiate a withdrawal and
  complete it after the 7-day delay.

## Security audit

The Gateway smart contracts have been independently audited by two third-party
security firms:

* [ChainSecurity audit report](https://6778953.fs1.hubspotusercontent-na1.net/hubfs/6778953/CCTP/%5BPublic%5D%20%5BChainSecurity%5D%20Circle_Gateway_audit.pdf)
* [OtterSec audit report](https://6778953.fs1.hubspotusercontent-na1.net/hubfs/6778953/Circle%20Gateway%20Audit%20-%20OtterSec%20-%207-21-2025.pdf)
