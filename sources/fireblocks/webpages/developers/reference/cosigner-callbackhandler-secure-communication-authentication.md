> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Securing communication

## Authenticating the Callback Handler Response Object

When setting up the Callback Handler server for an API user paired with the Co-signer, you can choose between five options to secure the communication between them.

This selection determines the payload structure of the POST request sent by the Co-signer to the Callback Handler server. It also defines how the request is authenticated by the Callback Handler. More details are provided below.

***

## Option 1: Public key authentication

In this option, the Co-signer and the Callback Handler exchange JSON Web Token (JWT) encoded messages, each signed with their respective private keys. The Co-signer's POST request to the Callback Handler server and the Callback Handler's response to the Co-signer are authenticated using their corresponding public keys.

### JWT-encoded signed request

* The Co-signer, acting as a client of the Callback Handler server, sends a POST request and uses its private key to sign the JWT-encoded message.
* The Callback Handler uses the Co-signer's public key to authenticate the message and ensure it originated from the Co-signer.
* You can retrieve the Co-signer's public key directly from the Co-signer ([see the guides](/reference/api-cosigner-maintenance)).

> **Note:** The same Co-signer private key is used to sign request messages sent to the Callback Handler server for all API users paired with this Co-signer.

### JWT-encoded signed response

* The Callback Handler responds with a JWT-encoded message signed with its private key.
* The Co-signer uses the Callback Handler's public key to authenticate the message and ensure it originated from it.
* You provide the API user's Callback Handler public key to the Co-signer during installation or while configuring the Callback Handler for that API user. This public key corresponds to the private key used by the Callback Handler to sign JWT-encoded response messages.

Follow these steps to generate a private-public key pair for signing JWT-encoded responses. This allows the Co-signer to authenticate your Callback Handler's responses using the corresponding public key:

1. Generate a private key using the following command:

```bash theme={"system"}
openssl genrsa -out callback_private.pem 2048
```

> **Note:** Only RSA 2048 bit keys are supported for public key Callback Handler response authentication.

2. Export the public key from the previously generated private key using the following command:

```bash theme={"system"}
openssl rsa -in callback_private.pem -outform PEM -pubout -out callback_public.pem
```

3. Use this public key to configure the Co-signer's Callback Handler for the specified API user.
4. Set up the Callback Handler as an HTTPS server using a certificate signed by a trusted Certificate Authority (CA). Configure the Callback Handler endpoints to **include** a `/v2` prefix in their URLs:

> `https://your_callback_base_url/v2/tx_sign_request`
> or
> `https://your_callback_base_url/v2/config_change_sign_request`

### Communication channel security

TLS communication between the Co-signer and the Callback Handler server requires the Callback Handler to operate as an HTTPS server with a certificate signed by a trusted Certificate Authority (CA).

***

## Option 2: Self-Signed Certificate-based communication (Certificate pinning)

In this option, a self-signed certificate or a certificate signed by a trusted Certificate Authority (CA) is used to establish certificate-pinning-based secure communication between the Co-signer and the Callback Handler. TLS certificate authentication occurs during SSL negotiation and is based on the certificate you provide to the Co-signer.

The certificate is provided to the Co-signer during installation or while configuring the Callback Handler for a specific API user. In this setup, both the Co-signer's POST request to the Callback Handler server and the server's response are in JSON format, instead of using signed JWTs.

Create a certificate and sign it yourself or have it signed by a trusted CA; set up an HTTPS server and configure your Callback Handler endpoints to respond to requests that **do not include** a `/v2` prefix:

> `https://your_callback_base_url/tx_sign_request`
> or
> `https://your_callback_base_url/config_change_sign_request`

***

## Option 3: Root-CA Certificate-based communication

> **Note:**
>
> This feature requires Co-signers version 2025.12.11 or newer.

In this option, a Root-CA certificate is used to establish certificate-based secure communication between the Co-signer and the Callback Handler. TLS certificate authentication occurs during SSL negotiation and is based on the Root-CA certificate you provide to the Co-signer.

The Root-CA certificate is provided to the Co-signer during installation or while configuring the Callback Handler for a specific API user. A certificate that was signed by the Root-CA needs to be provided to the Co-signer by the Callback Handler during the TLS certificate authentication.

In this setup, both the Co-signer's POST request to the Callback Handler server and the server's response are in JSON format, instead of using signed JWTs.

Create a certificate and have it signed by the Root-CA; set up an HTTPS server and configure your Callback Handler endpoints to respond to requests that **do not include** a `/v2` prefix:

> `https://your_callback_base_url/tx_sign_request`
> or
> `https://your_callback_base_url/config_change_sign_request`

***

## Option 4: Hybrid - Public key authentication with certificate pinning

> **Note:**
>
> This feature requires Co-signer version 2025.12.11 or newer and is currently supported only by the SGX cosigner.

This hybrid option combines the message-level security of Option 1(public key authentication) with the transport-level security of Option 2 (certificate pinning).

In this configuration:

* **TLS Layer**: The secure TLS connection is established using certificate pinning with a self-signed certificate or a certificate signed by a trusted Certificate Authority (CA), as described in Option 2.
* **Message Layer**: Communication messages are exchanged as JWT-encoded messages signed with private keys, exactly as described in Option 1.

This approach provides dual-layer security:

1. The TLS handshake authenticates the Callback Handler server using the pinned certificate
2. The JWT signatures authenticate individual messages using public key cryptography

### Configuration steps:

1. Create a certificate and sign it yourself or have it signed by a trusted CA

2. Provide the certificate to the Co-signer during installation or while configuring the Callback Handler for the specific API user

3. Generate and configure JWT signing keys as described in Option 1:
   1. Generate a private-public key pair for the Callback Handler
   2. Provide the public key to the Co-signer for JWT verification

4. Configure your Callback Handler endpoints to include a /v2 prefix (as in Option 1):

   > `https://your_callback_base_url/v2/tx_sign_request`
   > or
   > `https://your_callback_base_url/v2/config_change_sign_request`

5. Implement your Callback Handler to:
   1. Accept JWT-encoded requests from the Co-signer
   2. Respond with JWT-encoded messages signed with your private key

***

## Option 5: Hybrid - Public key authentication with Root-CA certificate

> **Note:**
>
> This feature requires Co-signer version 2025.12.11 or newer and is currently supported only by the SGX cosigner.

This hybrid option combines the message-level security of Option 1(public key authentication) with the transport-level security of Option 3 (Root-CA certificate validation).

In this configuration:

* **TLS Layer**: The secure TLS connection is established using Root-CA certificate validation, as described in Option 3.
* **Message Layer**: Communication messages are exchanged as JWT-encoded messages signed with private keys, exactly as described in Option 1.

This approach provides dual-layer security:

1. The TLS handshake authenticates the Callback Handler server using Root-CA certificate validation
2. The JWT signatures authenticate individual messages using public key cryptography

### Configuration steps:

1. Create a certificate and have it signed by your Root-CA

2. Provide the Root-CA certificate to the Co-signer during installation or while configuring the Callback Handler for the specific API user

3. Generate and configure JWT signing keys as described in Option 1:

   1. Generate a private-public key pair for the Callback Handler
   2. Provide the public key to the Co-signer for JWT verification

4. Configure your Callback Handler endpoints to include a `/v2` prefix (as in Option 1):

   > `https://your_callback_base_url/v2/tx_sign_request`
   > or
   > `https://your_callback_base_url/v2/config_change_sign_request`

5. Implement your Callback Handler to:

   1. Accept JWT-encoded requests from the Co-signer
   2. Respond with JWT-encoded messages signed with your private key

> **Note:**
>
> When adding the Callback Handler URL to the Co-signer, you should pass only the base URL + custom relative path.
> The `/v2/tx_sign_request` or `/v2/config_change_sign_request` relative paths will be automatically added upon each request made by the Co-signer.
>
> For example if you exposed the Callback Handler URL in the following path:
> `https://subdomain.example.com/fireblocks/callback_handler/v2/tx_sign_request`
>
> You should configure the following URL in the Co-signer:
> `https://subdomain.example.com/fireblocks/callback_handler`
