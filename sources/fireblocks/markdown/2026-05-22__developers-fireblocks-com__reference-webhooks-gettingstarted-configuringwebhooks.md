> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Configuring webhooks

# Overview

There are two methods to configure webhooks using the Webhooks v2 service:

* Via the Fireblocks Console
* Via the Fireblocks API & SDKs (requires an API key with Admin-level permissions)

> **Before you begin**
>
> Please note the following:
>
> * Only Admin-level users (Owner, Admin, and Non-Signing Admin) can configure webhooks.
> * Each webhook URL must be a legal, globally available HTTPS address (e.g., [https://example.com](https://example.com)) accesible via **port 443**.
> * Webhook URLs cannot exceed 255 characters in length.
> * You can enter up to 10 webhook URLs.
>
> If you’re looking for information about Audit Event Webhooks for monitoring your workspace’s audit log, check out [this Help Center article](https://support.fireblocks.io/hc/en-us/articles/360022059440-Notification-Center) instead.

***

> **NOTE**
>
> Starting November 2025, `BALANCE_UPDATE` events are available through Webhooks V2. You can self-subscribe via the Console or API. Manual enablement by Fireblocks is no longer supported.

## Via the Console

### Creating a webhook

1. In the Fireblocks Console, go to **Developer center** > **Webhooks** and then select **Create webhook**.
2. On the Create webhook dialog, complete the following fields:
   1. **Endpoint URL:** Enter the webhook’s URL address.
   2. **Description:** Optionally, enter a short description of the webhook.
   3. **Status:** Select whether you want the webhook to be active or inactive.
   4. **Listen for:** Select an event category to listen for all its associated events, or select the specific events to listen for from each category.
3. Select **Create webhook**.

### Editing a webhook

1. In the Fireblocks Console, go to **Developer center** > **Webhooks**.
2. Find the webhook you want to edit, then select **More actions** (**...**) > **Edit webhook**.
3. On the Edit webhook dialog, make the necessary changes and then select **Save**.

### Deactivating & Activating a webhook

1. In the Fireblocks Console, go to **Developer center** > **Webhooks**.
2. Find the webhook you want to deactivate or activate, then select **More actions** (**...**) > **Deactivate webhook** or **Activate webhook**.
3. On the Deactivate or Activate webhook dialog, select **Deactivate** or **Activate**.

### Deleting a webhook

1. In the Fireblocks Console, go to **Developer center** > **Webhooks**.
2. Find the webhook you want to delete, then select **More actions** (**...**) > **Delete webhook**.
3. On the Delete webhook dialog, select **Delete**.

***

## Via the API & SDKs

### Creating a webhook

Use the **createWebhook** command, which uses the [Create a new webhook](/reference/createwebhook) endpoint.

```bash theme={"system"}
curl --request POST \
     --url 'https://api.fireblocks.io/v1/webhooks' \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '{"enabled":true}'
```

```typescript theme={"system"}
import { readFileSync } from 'fs';
import { Fireblocks, BasePath } from '@fireblocks/ts-sdk';
import type { FireblocksResponse, WebhooksV2ApiCreateWebhookRequest, Webhook } from '@fireblocks/ts-sdk';

// Set the environment variables for authentication
process.env.FIREBLOCKS_BASE_PATH = BasePath.Sandbox; // or assign directly to "https://sandbox-api.fireblocks.io/v1"
process.env.FIREBLOCKS_API_KEY = "my-api-key";
process.env.FIREBLOCKS_SECRET_KEY = readFileSync("./fireblocks_secret.key", "utf8");

const fireblocks = new Fireblocks();

let body: WebhooksV2ApiCreateWebhookRequest = {
  // CreateWebhookRequest
  createWebhookRequest: param_value,
  // string | A unique identifier for the request. If the request is sent multiple times with the same idempotency key, the server will return the same response as the first request. The idempotency key is valid for 24 hours. (optional)
  idempotencyKey: idempotencyKey_example,
};

fireblocks.webhooksV2.createWebhook(body).then((res: FireblocksResponse<Webhook>) => {
  console.log('API called successfully. Returned data: ' + JSON.stringify(res, null, 2));
}).catch((error:any) => console.error(error));
```

```python theme={"system"}
from fireblocks.models.create_webhook_request import CreateWebhookRequest
from fireblocks.models.webhook import Webhook
from fireblocks.client import Fireblocks
from fireblocks.client_configuration import ClientConfiguration
from fireblocks.exceptions import ApiException
from fireblocks.base_path import BasePath
from pprint import pprint

# load the secret key content from a file
with open('your_secret_key_file_path', 'r') as file:
    secret_key_value = file.read()

# build the configuration
configuration = ClientConfiguration(
        api_key="your_api_key",
        secret_key=secret_key_value,
        base_path=BasePath.Sandbox, # or set it directly to a string "https://sandbox-api.fireblocks.io/v1"
)

# Enter a context with an instance of the API client
with Fireblocks(configuration) as fireblocks:
    create_webhook_request = fireblocks.CreateWebhookRequest() # CreateWebhookRequest |
    idempotency_key = 'idempotency_key_example' # str | A unique identifier for the request. If the request is sent multiple times with the same idempotency key, the server will return the same response as the first request. The idempotency key is valid for 24 hours. (optional)

    try:
        # Create new webhook
        api_response = fireblocks.webhooks_v2.create_webhook(create_webhook_request, idempotency_key=idempotency_key).result()
        print("The response of WebhooksV2Api->create_webhook:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling WebhooksV2Api->create_webhook: %s\n" % e)
```

```java theme={"system"}
// Import classes:
import com.fireblocks.sdk.ApiClient;
import com.fireblocks.sdk.ApiException;
import com.fireblocks.sdk.ApiResponse;
import com.fireblocks.sdk.BasePath;
import com.fireblocks.sdk.Fireblocks;
import com.fireblocks.sdk.ConfigurationOptions;
import com.fireblocks.sdk.model.*;
import com.fireblocks.sdk.api.WebhooksV2Api;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class Example {
    public static void main(String[] args) {
        ConfigurationOptions configurationOptions = new ConfigurationOptions()
            .basePath(BasePath.Sandbox)
            .apiKey("my-api-key")
            .secretKey("my-secret-key");
        Fireblocks fireblocks = new Fireblocks(configurationOptions);

        CreateWebhookRequest createWebhookRequest = new CreateWebhookRequest(); // CreateWebhookRequest |
        String idempotencyKey = "idempotencyKey_example"; // String | A unique identifier for the request. If the request is sent multiple times with the same idempotency key, the server will return the same response as the first request. The idempotency key is valid for 24 hours.
        try {
            CompletableFuture<ApiResponse<Webhook>> response = fireblocks.webhooksV2().createWebhook(createWebhookRequest, idempotencyKey);
            System.out.println("Status code: " + response.get().getStatusCode());
            System.out.println("Response headers: " + response.get().getHeaders());
            System.out.println("Response body: " + response.get().getData());
        } catch (InterruptedException | ExecutionException e) {
            ApiException apiException = (ApiException)e.getCause();
            System.err.println("Exception when calling WebhooksV2Api#createWebhook");
            System.err.println("Status code: " + apiException.getCode());
            System.err.println("Response headers: " + apiException.getResponseHeaders());
            System.err.println("Reason: " + apiException.getResponseBody());
            e.printStackTrace();
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksV2Api#createWebhook");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Response headers: " + e.getResponseHeaders());
            System.err.println("Reason: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

### Updating a webhook

Use the **updateWebhook** command, which uses the [Update webhook](/reference/updatewebhook) endpoint.

```bash theme={"system"}
curl --request PATCH \
     --url 'https://api.fireblocks.io/v1/webhooks/webhookId' \
     --header 'accept: application/json' \
     --header 'content-type: application/json'
```

```typescript theme={"system"}
import { readFileSync } from 'fs';
import { Fireblocks, BasePath } from '@fireblocks/ts-sdk';
import type { FireblocksResponse, WebhooksV2ApiUpdateWebhookRequest, Webhook } from '@fireblocks/ts-sdk';

// Set the environment variables for authentication
process.env.FIREBLOCKS_BASE_PATH = BasePath.Sandbox; // or assign directly to "https://sandbox-api.fireblocks.io/v1"
process.env.FIREBLOCKS_API_KEY = "my-api-key";
process.env.FIREBLOCKS_SECRET_KEY = readFileSync("./fireblocks_secret.key", "utf8");

const fireblocks = new Fireblocks();

let body: WebhooksV2ApiUpdateWebhookRequest = {
  // UpdateWebhookRequest
  updateWebhookRequest: param_value,
  // string | The unique identifier of the webhook
  webhookId: 44fcead0-7053-4831-a53a-df7fb90d440f,
};

fireblocks.webhooksV2.updateWebhook(body).then((res: FireblocksResponse<Webhook>) => {
  console.log('API called successfully. Returned data: ' + JSON.stringify(res, null, 2));
}).catch((error:any) => console.error(error));
```

```python theme={"system"}
from fireblocks.models.update_webhook_request import UpdateWebhookRequest
from fireblocks.models.webhook import Webhook
from fireblocks.client import Fireblocks
from fireblocks.client_configuration import ClientConfiguration
from fireblocks.exceptions import ApiException
from fireblocks.base_path import BasePath
from pprint import pprint

# load the secret key content from a file
with open('your_secret_key_file_path', 'r') as file:
    secret_key_value = file.read()

# build the configuration
configuration = ClientConfiguration(
        api_key="your_api_key",
        secret_key=secret_key_value,
        base_path=BasePath.Sandbox, # or set it directly to a string "https://sandbox-api.fireblocks.io/v1"
)

# Enter a context with an instance of the API client
with Fireblocks(configuration) as fireblocks:
    webhook_id = '44fcead0-7053-4831-a53a-df7fb90d440f' # str | The unique identifier of the webhook
    update_webhook_request = fireblocks.UpdateWebhookRequest() # UpdateWebhookRequest |

    try:
        # Update webhook
        api_response = fireblocks.webhooks_v2.update_webhook(webhook_id, update_webhook_request).result()
        print("The response of WebhooksV2Api->update_webhook:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling WebhooksV2Api->update_webhook: %s\n" % e)
```

```java theme={"system"}
// Import classes:
import com.fireblocks.sdk.ApiClient;
import com.fireblocks.sdk.ApiException;
import com.fireblocks.sdk.ApiResponse;
import com.fireblocks.sdk.BasePath;
import com.fireblocks.sdk.Fireblocks;
import com.fireblocks.sdk.ConfigurationOptions;
import com.fireblocks.sdk.model.*;
import com.fireblocks.sdk.api.WebhooksV2Api;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class Example {
    public static void main(String[] args) {
        ConfigurationOptions configurationOptions = new ConfigurationOptions()
            .basePath(BasePath.Sandbox)
            .apiKey("my-api-key")
            .secretKey("my-secret-key");
        Fireblocks fireblocks = new Fireblocks(configurationOptions);

        UpdateWebhookRequest updateWebhookRequest = new UpdateWebhookRequest(); // UpdateWebhookRequest |
        UUID webhookId = UUID.fromString("44fcead0-7053-4831-a53a-df7fb90d440f"); // UUID | The unique identifier of the webhook
        try {
            CompletableFuture<ApiResponse<Webhook>> response = fireblocks.webhooksV2().updateWebhook(updateWebhookRequest, webhookId);
            System.out.println("Status code: " + response.get().getStatusCode());
            System.out.println("Response headers: " + response.get().getHeaders());
            System.out.println("Response body: " + response.get().getData());
        } catch (InterruptedException | ExecutionException e) {
            ApiException apiException = (ApiException)e.getCause();
            System.err.println("Exception when calling WebhooksV2Api#updateWebhook");
            System.err.println("Status code: " + apiException.getCode());
            System.err.println("Response headers: " + apiException.getResponseHeaders());
            System.err.println("Reason: " + apiException.getResponseBody());
            e.printStackTrace();
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksV2Api#updateWebhook");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Response headers: " + e.getResponseHeaders());
            System.err.println("Reason: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

### Deleting a webhook

Use the **deleteWebhook** command, which uses the [Delete a webhook](/reference/deletewebhook) endpoint.

```bash theme={"system"}
curl --request DELETE \
     --url 'https://api.fireblocks.io/v1/webhooks/webhookId' \
     --header 'accept: application/json'
```

```typescript theme={"system"}
import { readFileSync } from 'fs';
import { Fireblocks, BasePath } from '@fireblocks/ts-sdk';
import type { FireblocksResponse, WebhooksV2ApiDeleteWebhookRequest, Webhook } from '@fireblocks/ts-sdk';

// Set the environment variables for authentication
process.env.FIREBLOCKS_BASE_PATH = BasePath.Sandbox; // or assign directly to "https://sandbox-api.fireblocks.io/v1"
process.env.FIREBLOCKS_API_KEY = "my-api-key";
process.env.FIREBLOCKS_SECRET_KEY = readFileSync("./fireblocks_secret.key", "utf8");

const fireblocks = new Fireblocks();

let body: WebhooksV2ApiDeleteWebhookRequest = {
  // string | The unique identifier of the webhook
  webhookId: 44fcead0-7053-4831-a53a-df7fb90d440f,
};

fireblocks.webhooksV2.deleteWebhook(body).then((res: FireblocksResponse<Webhook>) => {
  console.log('API called successfully. Returned data: ' + JSON.stringify(res, null, 2));
}).catch((error:any) => console.error(error));
```

```python theme={"system"}
from fireblocks.models.webhook import Webhook
from fireblocks.client import Fireblocks
from fireblocks.client_configuration import ClientConfiguration
from fireblocks.exceptions import ApiException
from fireblocks.base_path import BasePath
from pprint import pprint

# load the secret key content from a file
with open('your_secret_key_file_path', 'r') as file:
    secret_key_value = file.read()

# build the configuration
configuration = ClientConfiguration(
        api_key="your_api_key",
        secret_key=secret_key_value,
        base_path=BasePath.Sandbox, # or set it directly to a string "https://sandbox-api.fireblocks.io/v1"
)

# Enter a context with an instance of the API client
with Fireblocks(configuration) as fireblocks:
    webhook_id = '44fcead0-7053-4831-a53a-df7fb90d440f' # str | The unique identifier of the webhook

    try:
        # Delete webhook
        api_response = fireblocks.webhooks_v2.delete_webhook(webhook_id).result()
        print("The response of WebhooksV2Api->delete_webhook:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling WebhooksV2Api->delete_webhook: %s\n" % e)
```

```java theme={"system"}
// Import classes:
import com.fireblocks.sdk.ApiClient;
import com.fireblocks.sdk.ApiException;
import com.fireblocks.sdk.ApiResponse;
import com.fireblocks.sdk.BasePath;
import com.fireblocks.sdk.Fireblocks;
import com.fireblocks.sdk.ConfigurationOptions;
import com.fireblocks.sdk.model.*;
import com.fireblocks.sdk.api.WebhooksV2Api;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class Example {
    public static void main(String[] args) {
        ConfigurationOptions configurationOptions = new ConfigurationOptions()
            .basePath(BasePath.Sandbox)
            .apiKey("my-api-key")
            .secretKey("my-secret-key");
        Fireblocks fireblocks = new Fireblocks(configurationOptions);

        UUID webhookId = UUID.fromString("44fcead0-7053-4831-a53a-df7fb90d440f"); // UUID | The unique identifier of the webhook
        try {
            CompletableFuture<ApiResponse<Webhook>> response = fireblocks.webhooksV2().deleteWebhook(webhookId);
            System.out.println("Status code: " + response.get().getStatusCode());
            System.out.println("Response headers: " + response.get().getHeaders());
            System.out.println("Response body: " + response.get().getData());
        } catch (InterruptedException | ExecutionException e) {
            ApiException apiException = (ApiException)e.getCause();
            System.err.println("Exception when calling WebhooksV2Api#deleteWebhook");
            System.err.println("Status code: " + apiException.getCode());
            System.err.println("Response headers: " + apiException.getResponseHeaders());
            System.err.println("Reason: " + apiException.getResponseBody());
            e.printStackTrace();
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksV2Api#deleteWebhook");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Response headers: " + e.getResponseHeaders());
            System.err.println("Reason: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

***

> **Migrating to Webhooks v2 from Webhooks v1?**
>
> Start with our [Webhooks v2 Migration Guide](/reference/webhook-v2-migration-guide) to learn more about the benefits of and key changes in the Webhooks v2 service, and to find a mapping guide for converting your Webhooks v1 events to Webhooks v2 events.
