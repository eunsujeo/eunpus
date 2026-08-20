> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Setup API Co-signer Callback Handler

## Overview

<Info>
  ### The API Co-signer Callback Handler is an optional feature

  If a Callback Handler is not configured for an API user, the Co-signer will automatically sign or approve all requests it receives for that API user.
</Info>

The Fireblocks API Co-signer can connect to a user-hosted web server called the API Co-signer Callback Handler. This handler plays a critical role by receiving signing or approval requests from the Co-signer.

An optional connection to a Callback Handler can be configured for each API user paired with the Co-signer. This enables the application of custom business or security logic before transactions associated with the paired API user are automatically signed or approved.

Implementing the Callback Handler provides several benefits:

* **Enhanced control**: integrate your specific business rules and security protocols.
* **Improved compliance**: transactions are vetted to meet internal compliance standards.
* **Increased security**: the additional validation layer reduces the risk of unauthorized transactions.

This integration ensures secure, compliant and customized transaction management.

## Establishing a secure communication between the Co-signer and the Callback Handler

When configuring the Callback Handler server for an API user that is paired with the Co-signer, you can select one of the following options to secure the communication between the Co-signer (which acts as a client) and the Callback Handler server.

### Option 1: Public key authentication

In this option, the Co-signer and the Callback Handler exchange JSON Web Token (JWT) encoded messages, each signed with their respective private keys. The Co-signer's POST request to the Callback Handler server and the Callback Handler's response to the Co-signer are authenticated using their corresponding public keys.

While you can retrieve the Co-signer's public key directly from the Co-signer, you should provide the Callback Handler public key to the Co-signer during installation or while configuring the Callback Handler for an API user. This public key corresponds to the private key used by the Callback Handler to sign JWT-encoded response messages.

For development and testing purposes, the Callback Handler can be run over HTTP. However, for production environments, we strongly recommend using HTTPS with a valid TLS certificate from a trusted Certificate Authority (CA) to ensure secure communication between the Co-signer and the Callback Handler.

### Option 2: Certificate-based communication

In this option, a self-signed certificate or a certificate signed by a trusted Certificate Authority (CA) is used to establish certificate-pinning-based secure communication between the Co-signer and the Callback Handler. TLS certificate authentication occurs during SSL negotiation and is based on the certificate you provide to the Co-signer.

You provide the certificate to the Co-signer during installation or when configuring the Callback Handler for a specific API user. In this setup, both the Co-signer's POST request to the Callback Handler server and the server's response uses JSON format instead of signed JWTs.

<Info>
  ### Learn more about setting the API Co-signer Callback Handler in the [following Developer Guide](/reference/cosigner-callbackhandler-secure-communication-authentication).
</Info>
