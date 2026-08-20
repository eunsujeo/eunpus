---
updatedAt: 2026-07-21T10:35:14.000Z
---

Fetch the complete documentation index at: https://devx.notabene.id/llms.txt. Use this file to discover all available pages before exploring further.

# Authentication

## Getting your API credentials

Once you are logged into your [account](https://app.eu1.notabene.id/), go to settings, then API credentials, and click the green button:

![](https://files.readme.io/4ea0fc26c842d765adfefde3f48981475d102d9e4574b0768efa3c6a1e0e2e65-image.png)

<br />

You will then see your client ID and client secret:

![](https://files.readme.io/f4a3148fdda97f739da2fa5c06e09727fb7e370e4665efb67586319825327e66-image.png)

Ensure you copy and save these before clicking the "Done" button, as the secret will not be retrievable again without rotating.

***

## Generating your accessToken

<br />

Using the client ID and secret that you got in the previous step, you can now post this to:

* <https://auth.notabene.id/oauth/token> for the [EU node;](https://app.eu1.notabene.id/)
* [https://us.auth.notabene.id/oauth/token](https://us.auth.notabene.id/oauth/token "https://us.auth.notabene.id/oauth/token") for the [US node;](https://app.us1.notabene.id/)&#x20;

Use for 'audience' the api url you received:

```json Request
{  
  "client_id": "MpiayP7gUCPVE3R8mzCXJuY9y2FieogB",  
  "client_secret": "qvC99YkO999999999ddfxcnFIwB_AQjal3324Hkmn2T3qCgALA_9VZGtjqo-jB_7O3j",  
  "grant_type": "client_credentials",  
  "audience": "https://api.eu1.notabene.id or https://api.us1.notabene.id"  
}
```

The accessToken you receive in the response is valid for 24 hours:

```json Response
{  
    "access_token": "eyJhbGcRiOiJSUzI1NiIsInR5cCI6432IkpXVCIsImtpZCI6IklkYzY4WffTU5NU9xVDZuaTA3SHYzYiJ9.eyJpc3MiOiJodHRwczovL2F1dGgubm90YWJlbmUuaWQvIiwic3ViIjoiNmk1RTFVRVIwWkliZEExMTdhU0FPd0d1ODZQN0E4R0VAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vYXBpLm5vdGFiZW5lLmRldiIsImlhdCI6MTY1MjE3MjQxNCwiZXhwIjoxNjUyMjU4ODE0LCJhenAiOiI2aTVFMVVFUjBaSWJkQTExN2FTQU93R3U4NlA3QThHRSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.IcB3DnElBAnEnW70gfgyDuk6yZD9wf_OQ6spbuO89wiOuSEJVQRfeIxmFz05e3B8B6gFoequZDVoE6eEiS0UOJasU_wTJn5-XL8fJLMWe84T1iMi1Xr62o34ulDbE3uUo48okhfx4YlHiBnLV-KMjBKl5a8K-1NCZqZ38yU4m1dBg5AUnkYRvTZSsYbsybDU5gD62e5jEZp_FuV61aCRatFnITX8DrBBEvKx5HyVgrg-U0UWNTz7yUmtw1Did15PCwbWWpcuwdCC0bXxdXsQnomvsZ1h1s_yrkqzkR6v9ux6k9-TPKskCBDlKOsgKxT_6lpg6OkhVu4-6Pf4wi0spg",  
    "expires_in": 86400,  
    "token_type": "Bearer"  
}
```

<br />

🚧 We recommend refreshing tokens when they expire, not on a daily schedule.