> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Connect to the Fireblocks Network

> The Fireblocks Network is a peer-to-peer, institutional liquidity and transfer network of 1,500+ liquidity providers, lending desks, and trading counterparties. Members can discover, connect, and settle with other Fireblocks Network members quickly, easily, and securely using features available only to Network members.

# Fireblocks Network features

To use Fireblocks Network features with a counterparty, connect to each other on the Network. Whether you prefer to make your Network profile discoverable or not, you can connect with other members in several ways.

Discoverable members show up in searches for connections. You can then request to add them as a connection from the search results. To connect with non-discoverable Network members you need to know their unique Network ID. If your profile is not discoverable, you can still search for other discoverable members and request to connect with them. Both your Admin Quorum as well as your counterparty’s Admin Quorum must approve new Network connections.

When you make transfers on the Fireblocks Network, you benefit from these Network features:

## Automated Address Authentication (AAA)

All Fireblocks Network transfers route through an encrypted tunnel within a secure hardware enclave. With AAA, you never have to store or share deposit addresses in poorly secured and error-prone ways, such as messenger apps or copying and pasting, which means you can:

* **Transfer faster:** Avoid time-consuming processes like manually whitelisting new deposit addresses, sending test transfers, and finding, copying, and pasting deposit addresses to send or receive a digital asset transfer.
* **Prevent errors:** Avoid manual, error-prone processes like tracking and copying and pasting addresses that can cause your assets or your counterparty’s assets to go to the wrong address.
* **Secure transfers:** Prevent Man-in-the-Middle and Address Spoofing attacks, where hackers use malware to replace addresses on infected devices, and intercept and replace addresses while you share them over messenger apps or copy and paste them. With AAA, you don’t need to manually manage or share deposit addresses.
* **Future-proof connections:** With AAA, connected counterparties stay connected even if your deposit address changes. AAA will automatically remap it without resharing or reconnecting.

## Flexible Network Routing

When you add new Network connections, you can define how incoming deposits are routed. You can tailor routing for Network deposits of both crypto and fiat in two ways

* **Route by Network profile:** Send all deposits from connections to your Network profile to a designated vault account, exchange account, or fiat account in your workspace.
* **Route by connection:** Tailor routing per connection. Each connection’s deposits can go to their own specific designated vault account, exchange account, or fiat account.

You can also execute all Flexible Network Routing configuration actions using the Fireblocks API. With maximum flexibility for routing and managing deposit addresses for Network transfers, you can capitalize on more opportunities faster and more easily using the Fireblocks Network.

## Automatic Address Rotation

When you transfer Bitcoin or other UTXO-based tokens with Fireblocks Network connections, your deposit addresses can rotate automatically for every incoming transfer. For certain tokens, a different unique identifier is rotated on every Network transfer instead of rotating addresses.

* For Ripple transfers on the Network, the deposit address stays the same, but the unique XRP tag is rotated every transfer.
* For EOS, Hedera, and Stellar transfers on the Network, the deposit address stays the same, but the unique memo ID is rotated every transfer.

For Network transfers on account-based blockchains like Ethereum, Automatic Address Rotation isn’t supported and there is no other unique identifier. You can transfer account-based assets on the Fireblocks Network. However, you can’t create unique identifiers like a deposit address, tag, or memo ID for each transfer for pseudo-anonymity on the blockchain.

Since Network transfers also use Automated Address Authentication, you don’t have to track or share the new addresses. This enables you to:

* Preserve privacy on the blockchain by preventing your transaction history from being easily discovered by someone searching for a deposit address.
* Avoid errors from manual address rotation, like forgetting to update a connection with your new address or a copy-and-paste error while tracking or sharing.

<Info>
  Learn how to connect over the Fireblocks Network in the Web Console [here](https://support.fireblocks.io/hc/en-us/articles/6107078528540-Configuring-your-Fireblocks-Network-profile).
</Info>

For API details, see the [Fireblocks Network APIs](/reference/getnetworkconnections) in the Fireblocks API reference.
