> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# REST API Guide

Fireblocks provides a robust REST API for developers to leverage Fireblocks' capabilities programmatically. Our REST API is the base layer for all Fireblocks SDKs.

If you prefer to work directly with the Fireblocks API, [view the complete Fireblocks REST API reference documentation](/reference/getconsoleusers).

To practice with our API before implementing any code, read the [Postman Guide](doc:postman-guide) containing the pre-defined API endpoints.

## OpenAPI Specification

[View the Fireblocks OpenAPI 3.0 specification](https://docs.fireblocks.com/api/v1/swagger.yaml).

Fireblocks uses the OpenAPI 3.0 (Swagger) format to maintain our API and provide the specification file for download.

The API Reference section is auto-generated from our OpenAPI specification. You can also import it into your tool of choice, such as Swagger UI, ReDoc, and so on.

If you prefer using Postman, you can also explore the API using our [Postman Guide](doc:postman-guide).

## Generating client libraries and SDKs

Using the Swagger Editor, you can generate your client libraries and SDKs in the language of your choice.

1. [Navigate to the publicly hosted Swagger Editor](https://editor.swagger.io/).
2. Copy [our latest OpenAPI specification file](https://docs.fireblocks.com/api/v1/swagger.yaml) and paste it into the editor window.
3. Select **Generate Client** on the top menu bar and select the language to download.
4. The last step is to set up the proper headers in order to authenticate with the Fireblocks API.

   [See here for more details on the JWT structure.](doc:signing-a-request-jwt-structure) You can see examples on how this is done for our SDKs so you can replicate this in the language of the generated client library.

## Fireblocks Developers Hub

Visit our [Developers Hub GitHub repository](https://github.com/fireblocks/developers-hub) for code examples, snippets, and other helpful resources that you can use as a reference.
