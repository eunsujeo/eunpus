> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Resending & troubleshooting webhook notifications

Missed webhook notifications can occur due to various issues such as temporary downtime, connectivity problems, or unexpected errors in your webhook handler. These issues can prevent your server from acknowledging or processing events sent by Fireblocks.

To ensure no critical events are lost, Fireblocks provides multiple solutions for you to address your particular use case.

***

## Auto-retry mechanism

First, the Fireblocks server will look for a response to confirm the webhook notification was received. All webhook events should receive an HTTP 200 (OK) response.

If no response is received, Fireblocks will resend the 5xx request several more times. The retry schedule (in seconds) follows an exponential backoff of 10, 30, 120, 300, 900, 1800, 3600, 7200, and 14400.

### Retries for 4xx errors

Fireblocks will not attempt to retry sending webhook notifications for client-side errors (HTTP 4xx) except for the following cases:

* **429 - Too Many Requests:** Indicates rate limits have been exceeded.
* **408 - Request Timeout:** Indicates the server took too long to respond.

After a total of 10 failed attempts, the notification will be marked as failed, and no further retries will be made.

***

## Resending a single notification

Use this method when you need to troubleshoot or ensure the delivery of a specific event, such as a transaction update or status change.

> **Example use case**
>
> If your server fails to process a specific transaction notification, you can use this endpoint to retry only that notification, minimizing unnecessary retries.

### Via the Fireblocks Console

1. In the Fireblocks Console, go to **Developer center** > **Webhooks**, and then select the relevant endpoint URL from the Webhooks list.
2. In the Notification activity list, find the notification you want to resend and then select it.
3. On the Notification attempts dialog, select **Resend notification**.
4. Validate that you received the notification successfully.

### Via the Fireblocks API & SDKs

First, run the **getNotifications** command, which uses the [Get all notifications by webhook id](/reference/getnotifications) endpoint.

```bash theme={"system"}
curl --request GET \
     --url 'https://api.fireblocks.io/v1/webhooks/webhookId/notifications?order=DESC&pageSize=100' \
     --header 'accept: application/json'
```

```javascript theme={"system"}
import { readFileSync } from 'fs';
import { Fireblocks, BasePath } from '@fireblocks/ts-sdk';
import type { FireblocksResponse, WebhooksV2ApiGetNotificationsRequest, NotificationPaginatedResponse } from '@fireblocks/ts-sdk';

// Set the environment variables for authentication
process.env.FIREBLOCKS_BASE_PATH = BasePath.Sandbox; // or assign directly to "https://sandbox-api.fireblocks.io/v1"
process.env.FIREBLOCKS_API_KEY = "my-api-key";
process.env.FIREBLOCKS_SECRET_KEY = readFileSync("./fireblocks_secret.key", "utf8");

const fireblocks = new Fireblocks();

let body: WebhooksV2ApiGetNotificationsRequest = {
  // string
  webhookId: 44fcead0-7053-4831-a53a-df7fb90d440f,
  // 'ASC' | 'DESC' | ASC / DESC ordering (default DESC) (optional)
  order: ASC,
  // 'id' | 'createdAt' | 'updatedAt' | 'status' | 'eventType' | 'resourceId' | Sort by field (optional)
  sortBy: id,
  // string | Cursor of the required page (optional)
  pageCursor: pageCursor_example,
  // number | Maximum number of items in the page (optional)
  pageSize: 10,
};

fireblocks.webhooksV2.getNotifications(body).then((res: FireblocksResponse<NotificationPaginatedResponse>) => {
  console.log('API called successfully. Returned data: ' + JSON.stringify(res, null, 2));
}).catch((error:any) => console.error(error));
```

```python theme={"system"}
from fireblocks.models.notification_paginated_response import NotificationPaginatedResponse
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
    webhook_id = '44fcead0-7053-4831-a53a-df7fb90d440f' # str |
    order = DESC # str | ASC / DESC ordering (default DESC) (optional) (default to DESC)
    sort_by = updatedAt # str | Sort by field (optional) (default to updatedAt)
    page_cursor = 'page_cursor_example' # str | Cursor of the required page (optional)
    page_size = 100 # float | Maximum number of items in the page (optional) (default to 100)

    try:
        # Get all notifications by webhook id
        api_response = fireblocks.webhooks_v2.get_notifications(webhook_id, order=order, sort_by=sort_by, page_cursor=page_cursor, page_size=page_size).result()
        print("The response of WebhooksV2Api->get_notifications:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling WebhooksV2Api->get_notifications: %s\n" % e)
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

        UUID webhookId = UUID.fromString("44fcead0-7053-4831-a53a-df7fb90d440f"); // UUID |
        String order = "ASC"; // String | ASC / DESC ordering (default DESC)
        String sortBy = "id"; // String | Sort by field
        String pageCursor = "pageCursor_example"; // String | Cursor of the required page
        BigDecimal pageSize = new BigDecimal("100"); // BigDecimal | Maximum number of items in the page
        try {
            CompletableFuture<ApiResponse<NotificationPaginatedResponse>> response = fireblocks.webhooksV2().getNotifications(webhookId, order, sortBy, pageCursor, pageSize);
            System.out.println("Status code: " + response.get().getStatusCode());
            System.out.println("Response headers: " + response.get().getHeaders());
            System.out.println("Response body: " + response.get().getData());
        } catch (InterruptedException | ExecutionException e) {
            ApiException apiException = (ApiException)e.getCause();
            System.err.println("Exception when calling WebhooksV2Api#getNotifications");
            System.err.println("Status code: " + apiException.getCode());
            System.err.println("Response headers: " + apiException.getResponseHeaders());
            System.err.println("Reason: " + apiException.getResponseBody());
            e.printStackTrace();
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksV2Api#getNotifications");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Response headers: " + e.getResponseHeaders());
            System.err.println("Reason: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

After you retrieve the **id** value from the notification you want to resend, use the **resendNotificationById** command, which uses the [Resend notification by ID](/reference/resendnotificationbyid) endpoint.

```bash theme={"system"}
curl --request POST \
     --url 'https://api.fireblocks.io/v1/webhooks/webhookId/notifications/notificationId/resend' \
     --header 'accept: application/json'
```

```javascript theme={"system"}
import { readFileSync } from 'fs';
import { Fireblocks, BasePath } from '@fireblocks/ts-sdk';
import type { FireblocksResponse, WebhooksV2ApiResendNotificationByIdRequest } from '@fireblocks/ts-sdk';

// Set the environment variables for authentication
process.env.FIREBLOCKS_BASE_PATH = BasePath.Sandbox; // or assign directly to "https://sandbox-api.fireblocks.io/v1"
process.env.FIREBLOCKS_API_KEY = "my-api-key";
process.env.FIREBLOCKS_SECRET_KEY = readFileSync("./fireblocks_secret.key", "utf8");

const fireblocks = new Fireblocks();

let body: WebhooksV2ApiResendNotificationByIdRequest = {
  // string | The ID of the webhook
  webhookId: webhookId_example,
  // string | The ID of the notification
  notificationId: notificationId_example,
  // string | A unique identifier for the request. If the request is sent multiple times with the same idempotency key, the server will return the same response as the first request. The idempotency key is valid for 24 hours. (optional)
  idempotencyKey: idempotencyKey_example,
};

fireblocks.webhooksV2.resendNotificationById(body).then((res: FireblocksResponse<any>) => {
  console.log('API called successfully. Returned data: ' + JSON.stringify(res, null, 2));
}).catch((error:any) => console.error(error));
```

```python theme={"system"}
from fireblocks.client import Fireblocks
from fireblocks.client_configuration import ClientConfiguration
from fireblocks.exceptions import ApiException
from fireblocks.base_path import BasePath

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
    webhook_id = 'webhook_id_example' # str | The ID of the webhook
    notification_id = 'notification_id_example' # str | The ID of the notification
    idempotency_key = 'idempotency_key_example' # str | A unique identifier for the request. If the request is sent multiple times with the same idempotency key, the server will return the same response as the first request. The idempotency key is valid for 24 hours. (optional)

    try:
        # Resend notification by id
        fireblocks.webhooks_v2.resend_notification_by_id(webhook_id, notification_id, idempotency_key=idempotency_key).result()
    except Exception as e:
        print("Exception when calling WebhooksV2Api->resend_notification_by_id: %s\n" % e)
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

        String webhookId = "webhookId_example"; // String | The ID of the webhook
        String notificationId = "notificationId_example"; // String | The ID of the notification
        String idempotencyKey = "idempotencyKey_example"; // String | A unique identifier for the request. If the request is sent multiple times with the same idempotency key, the server will return the same response as the first request. The idempotency key is valid for 24 hours.
        try {
            CompletableFuture<ApiResponse<Void>> response = fireblocks.webhooksV2().resendNotificationById(webhookId, notificationId, idempotencyKey);
            System.out.println("Status code: " + response.get().getStatusCode());
            System.out.println("Response headers: " + response.get().getHeaders());
        } catch (InterruptedException | ExecutionException e) {
            ApiException apiException = (ApiException)e.getCause();
            System.err.println("Exception when calling WebhooksV2Api#resendNotificationById");
            System.err.println("Status code: " + apiException.getCode());
            System.err.println("Response headers: " + apiException.getResponseHeaders());
            System.err.println("Reason: " + apiException.getResponseBody());
            e.printStackTrace();
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksV2Api#resendNotificationById");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Response headers: " + e.getResponseHeaders());
            System.err.println("Reason: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

Lastly, validate that you received the notification successfully.

***

## Resending multiple notifications by resource ID

Use this method when you need to resend notifications for a particular resource, such as a vault account or transaction, after resolving server-side issues. This method will resend all notifications generated over the last 30 days for that resource.

> **Example use case**
>
> If your webhook server missed updates for a specific transaction due to an outage, you can use this endpoint to retrieve all missed notifications related to that transaction.

### Via the Fireblocks API & SDKs

First, run the **getNotifications** command, which uses the [Get all notifications by webhook id](/reference/getnotifications) endpoint.

```bash theme={"system"}
curl --request GET \
     --url 'https://api.fireblocks.io/v1/webhooks/webhookId/notifications?order=DESC&pageSize=100' \
     --header 'accept: application/json'
```

```javascript theme={"system"}
import { readFileSync } from 'fs';
import { Fireblocks, BasePath } from '@fireblocks/ts-sdk';
import type { FireblocksResponse, WebhooksV2ApiGetNotificationsRequest, NotificationPaginatedResponse } from '@fireblocks/ts-sdk';

// Set the environment variables for authentication
process.env.FIREBLOCKS_BASE_PATH = BasePath.Sandbox; // or assign directly to "https://sandbox-api.fireblocks.io/v1"
process.env.FIREBLOCKS_API_KEY = "my-api-key";
process.env.FIREBLOCKS_SECRET_KEY = readFileSync("./fireblocks_secret.key", "utf8");

const fireblocks = new Fireblocks();

let body: WebhooksV2ApiGetNotificationsRequest = {
  // string
  webhookId: 44fcead0-7053-4831-a53a-df7fb90d440f,
  // 'ASC' | 'DESC' | ASC / DESC ordering (default DESC) (optional)
  order: ASC,
  // 'id' | 'createdAt' | 'updatedAt' | 'status' | 'eventType' | 'resourceId' | Sort by field (optional)
  sortBy: id,
  // string | Cursor of the required page (optional)
  pageCursor: pageCursor_example,
  // number | Maximum number of items in the page (optional)
  pageSize: 10,
};

fireblocks.webhooksV2.getNotifications(body).then((res: FireblocksResponse<NotificationPaginatedResponse>) => {
  console.log('API called successfully. Returned data: ' + JSON.stringify(res, null, 2));
}).catch((error:any) => console.error(error));
```

```python theme={"system"}
from fireblocks.models.notification_paginated_response import NotificationPaginatedResponse
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
    webhook_id = '44fcead0-7053-4831-a53a-df7fb90d440f' # str |
    order = DESC # str | ASC / DESC ordering (default DESC) (optional) (default to DESC)
    sort_by = updatedAt # str | Sort by field (optional) (default to updatedAt)
    page_cursor = 'page_cursor_example' # str | Cursor of the required page (optional)
    page_size = 100 # float | Maximum number of items in the page (optional) (default to 100)

    try:
        # Get all notifications by webhook id
        api_response = fireblocks.webhooks_v2.get_notifications(webhook_id, order=order, sort_by=sort_by, page_cursor=page_cursor, page_size=page_size).result()
        print("The response of WebhooksV2Api->get_notifications:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling WebhooksV2Api->get_notifications: %s\n" % e)
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

        UUID webhookId = UUID.fromString("44fcead0-7053-4831-a53a-df7fb90d440f"); // UUID |
        String order = "ASC"; // String | ASC / DESC ordering (default DESC)
        String sortBy = "id"; // String | Sort by field
        String pageCursor = "pageCursor_example"; // String | Cursor of the required page
        BigDecimal pageSize = new BigDecimal("100"); // BigDecimal | Maximum number of items in the page
        try {
            CompletableFuture<ApiResponse<NotificationPaginatedResponse>> response = fireblocks.webhooksV2().getNotifications(webhookId, order, sortBy, pageCursor, pageSize);
            System.out.println("Status code: " + response.get().getStatusCode());
            System.out.println("Response headers: " + response.get().getHeaders());
            System.out.println("Response body: " + response.get().getData());
        } catch (InterruptedException | ExecutionException e) {
            ApiException apiException = (ApiException)e.getCause();
            System.err.println("Exception when calling WebhooksV2Api#getNotifications");
            System.err.println("Status code: " + apiException.getCode());
            System.err.println("Response headers: " + apiException.getResponseHeaders());
            System.err.println("Reason: " + apiException.getResponseBody());
            e.printStackTrace();
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksV2Api#getNotifications");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Response headers: " + e.getResponseHeaders());
            System.err.println("Reason: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

After you retrieve the **resourceId** value you need, run the **resendNotificationsByResourceId** command, which uses the [Resend notifications by resourceId](/reference/resendnotificationsbyresourceid) endpoint.

```bash theme={"system"}
curl --request POST \
     --url 'https://api.fireblocks.io/v1/webhooks/webhookId/notifications/resend_by_resource' \
     --header 'accept: application/json' \
     --header 'content-type: application/json'
```

```javascript theme={"system"}
import { readFileSync } from 'fs';
import { Fireblocks, BasePath } from '@fireblocks/ts-sdk';
import type { FireblocksResponse, WebhooksV2ApiResendNotificationsByResourceIdRequest } from '@fireblocks/ts-sdk';

// Set the environment variables for authentication
process.env.FIREBLOCKS_BASE_PATH = BasePath.Sandbox; // or assign directly to "https://sandbox-api.fireblocks.io/v1"
process.env.FIREBLOCKS_API_KEY = "my-api-key";
process.env.FIREBLOCKS_SECRET_KEY = readFileSync("./fireblocks_secret.key", "utf8");

const fireblocks = new Fireblocks();

let body: WebhooksV2ApiResendNotificationsByResourceIdRequest = {
  // ResendNotificationsByResourceIdRequest
  resendNotificationsByResourceIdRequest: param_value,
  // string | The ID of the webhook
  webhookId: webhookId_example,
  // string | A unique identifier for the request. If the request is sent multiple times with the same idempotency key, the server will return the same response as the first request. The idempotency key is valid for 24 hours. (optional)
  idempotencyKey: idempotencyKey_example,
};

fireblocks.webhooksV2.resendNotificationsByResourceId(body).then((res: FireblocksResponse<any>) => {
  console.log('API called successfully. Returned data: ' + JSON.stringify(res, null, 2));
}).catch((error:any) => console.error(error));
```

```python theme={"system"}
from fireblocks.models.resend_notifications_by_resource_id_request import ResendNotificationsByResourceIdRequest
from fireblocks.client import Fireblocks
from fireblocks.client_configuration import ClientConfiguration
from fireblocks.exceptions import ApiException
from fireblocks.base_path import BasePath

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
    webhook_id = 'webhook_id_example' # str | The ID of the webhook
    resend_notifications_by_resource_id_request = fireblocks.ResendNotificationsByResourceIdRequest() # ResendNotificationsByResourceIdRequest |
    idempotency_key = 'idempotency_key_example' # str | A unique identifier for the request. If the request is sent multiple times with the same idempotency key, the server will return the same response as the first request. The idempotency key is valid for 24 hours. (optional)

    try:
        # Resend notifications by resource Id
        fireblocks.webhooks_v2.resend_notifications_by_resource_id(webhook_id, resend_notifications_by_resource_id_request, idempotency_key=idempotency_key).result()
    except Exception as e:
        print("Exception when calling WebhooksV2Api->resend_notifications_by_resource_id: %s\n" % e)
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

        ResendNotificationsByResourceIdRequest resendNotificationsByResourceIdRequest = new ResendNotificationsByResourceIdRequest(); // ResendNotificationsByResourceIdRequest |
        String webhookId = "webhookId_example"; // String | The ID of the webhook
        String idempotencyKey = "idempotencyKey_example"; // String | A unique identifier for the request. If the request is sent multiple times with the same idempotency key, the server will return the same response as the first request. The idempotency key is valid for 24 hours.
        try {
            CompletableFuture<ApiResponse<Void>> response = fireblocks.webhooksV2().resendNotificationsByResourceId(resendNotificationsByResourceIdRequest, webhookId, idempotencyKey);
            System.out.println("Status code: " + response.get().getStatusCode());
            System.out.println("Response headers: " + response.get().getHeaders());
        } catch (InterruptedException | ExecutionException e) {
            ApiException apiException = (ApiException)e.getCause();
            System.err.println("Exception when calling WebhooksV2Api#resendNotificationsByResourceId");
            System.err.println("Status code: " + apiException.getCode());
            System.err.println("Response headers: " + apiException.getResponseHeaders());
            System.err.println("Reason: " + apiException.getResponseBody());
            e.printStackTrace();
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksV2Api#resendNotificationsByResourceId");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Response headers: " + e.getResponseHeaders());
            System.err.println("Reason: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

Lastly, validate that you received the notifications successfully.

> **Resource ID in the Console**
>
> You can also find a notification's resource ID in the Fireblocks Console by going to **Developer Center** > **Webhooks** and then selecting the relevant endpoint URL from the Webhooks list. Then, in the Notification activity list, you can find and copy the relevant resource ID.

***

## Resending all notifications for an endpoint

Use this method when you need to resend all the notifications for a particular endpoint after resolving server-side issues. This method will resend all notifications generated over the last 24 hours for that endpoint.

### Via the Fireblocks Console

1. In the Fireblocks Console, go to **Developer center** > **Webhooks**, and then select the relevant endpoint URL from the Webhooks list.
2. In the Notification activity list, select **Resend notifications**.
3. Validate that you received the notifications successfully.

***

## Endpoint auto-deactivated due to circuit breaker

In Webhooks V2, the circuit breaker monitors error rates for each webhook endpoint and suspends endpoints that exceed predefined thresholds. Errors include timeouts and any non-2xx status code. The circuit breaker evaluates error rates using a rolling 60-minute window, assessed on each delivery attempt.

Suspension policies vary by error rate severity:

* **50–80% error rate:** If your endpoint sustains this error rate for 4 consecutive hours, Fireblocks suspends it automatically.
* **Above 80% error rate:** If your endpoint's error rate exceeds this threshold within the rolling 60-minute window, Fireblocks suspends it immediately.

When your endpoint is suspended, Fireblocks notifies all Admin users in the workspace by email.

### Reactivating a suspended endpoint

Suspension is not automatically lifted. To reactivate your endpoint:

1. Identify and resolve the underlying issue causing delivery failures.
2. Reactivate the endpoint via the [Developer Center](https://console.fireblocks.io/v2/developer/webhooks) or by calling the [Update Webhook](/reference/updatewebhook) endpoint with `enabled` set to `true`.
3. Once reactivated, the circuit breaker immediately resumes monitoring the endpoint. If the error rate exceeds the above thresholds again, the endpoint will be suspended again.

> **No cooldown period before reactivation**
>
> There is no cooldown period before reactivation. It is your responsibility to ensure the issue is resolved *before* reactivating to avoid repeated suspension.
