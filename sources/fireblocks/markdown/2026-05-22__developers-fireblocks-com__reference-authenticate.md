> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Authenticating the Callback Handler Request

> **Learn more about the API Co-Signer Callback Handler here**

## Overview

When your API Co-signer is configured with a Callback Handler, it sends a POST request to the Callback Handler. The POST request contains a JSON Web Token (JWT) encoded message signed with the API Co-Signer's private key. The Callback Handler uses the API Co-signer's public key to verify that every incoming JWT is signed correctly by the API Co-signer.

The Callback Handler's response is a JWT-encoded message signed with the Callback Handler's private key. This private key must be paired with the public key provided to the API Co-signer during the Callback Handler's setup.

***

## Keys Generation

* Generate a private key using the following command:

  `openssl genrsa -out callback_private.pem 2048`

> **Important**
>
> Fireblocks only supports RSA key 2048 bit for public key Callback Handler authentication.

* Export the public key from the previously generated private key using the following command:

  `openssl rsa -in callback_private.pem -outform PEM -pubout -out callback_public.pem`

* Write your callback logic, which should include checking that the message can be decoded using the API Co-signer public key. The API Co-signer public key can be obtained by running the command:

  `./cosigner print-public-key`
  Save the cosigner public key in a file on your Callback Handler server - `cosigner_public.pem`

* Set up an HTTPS server with a certificate signed by a trusted CA. Make sure the route has a "/v2" prefix. Your callback handler endpoints should respond to requests that include a “/v2” prefix: [https://your\_callback\_base\_url/v2/tx\_sign\_request](https://your_callback_base_url/v2/tx_sign_request) or [https://your\_callback\_base\_url/v2/config\_change\_sign\_request](https://your_callback_base_url/v2/config_change_sign_request)

> **Note:**
>
> When adding the Callback Handler URL to the Co-signer, you should pass only the base URL + custom relative path.
> The `</v2/tx\_sign\_request>` or `</v2/config\_change\_sign\_request>` relative paths will be automatically added upon each request made by the Co-signer.
>
> For example if you exposed the Callback Handler URL in the following path:
> [https://subdomain.example.com/fireblocks/callback\_handler/v2/tx\_sign\_request](https://subdomain.example.com/fireblocks/callback_handler/v2/tx_sign_request)
>
> You should configure the following URL in the Co-signer:
> [https://subdomain.example.com/fireblocks/callback\_handler](https://subdomain.example.com/fireblocks/callback_handler)
