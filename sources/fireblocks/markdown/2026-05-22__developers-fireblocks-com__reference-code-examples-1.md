> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Code Examples

> **Deprecation notice**
>
> Webhooks v1 will be deprecated on **June 15th, 2026**. Please use the Developer Center in the Fireblocks Console to upgrade to Webhooks V2, which offers improved reliability, performance, and observability.

Below are examples in Python and JavaScript demonstrating how to configure the webhook receiving endpoint on the customer's end, including the request validation mechanism:

> **Warning: For reference only**
>
> * These examples are **not production-ready** and are used only for reference.
> * These examples are configured to represent a production environment. Sandbox users should ensure they update the Public Key to the correct one, as mentioned [here](/reference/verify-requests).

```javascript theme={"system"}
const crypto = require("crypto");
const express = require("express");
const bodyParser = require('body-parser')

const port = 3000;

const publicKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA0+6wd9OJQpK60ZI7qnZG
jjQ0wNFUHfRv85Tdyek8+ahlg1Ph8uhwl4N6DZw5LwLXhNjzAbQ8LGPxt36RUZl5
YlxTru0jZNKx5lslR+H4i936A4pKBjgiMmSkVwXD9HcfKHTp70GQ812+J0Fvti/v
4nrrUpc011Wo4F6omt1QcYsi4GTI5OsEbeKQ24BtUd6Z1Nm/EP7PfPxeb4CP8KOH
clM8K7OwBUfWrip8Ptljjz9BNOZUF94iyjJ/BIzGJjyCntho64ehpUYP8UJykLVd
CGcu7sVYWnknf1ZGLuqqZQt4qt7cUUhFGielssZP9N9x7wzaAIFcT3yQ+ELDu1SZ
dE4lZsf2uMyfj58V8GDOLLE233+LRsRbJ083x+e2mW5BdAGtGgQBusFfnmv5Bxqd
HgS55hsna5725/44tvxll261TgQvjGrTxwe7e5Ia3d2Syc+e89mXQaI/+cZnylNP
SwCCvx8mOM847T0XkVRX3ZrwXtHIA25uKsPJzUtksDnAowB91j7RJkjXxJcz3Vh1
4k182UFOTPRW9jzdWNSyWQGl/vpe9oQ4c2Ly15+/toBo4YXJeDdDnZ5c/O+KKadc
IMPBpnPrH/0O97uMPuED+nI6ISGOTMLZo35xJ96gPBwyG5s2QxIkKPXIrhgcgUnk
tSM7QYNhlftT4/yVvYnk0YcCAwEAAQ==
-----END PUBLIC KEY-----`.replace(/\\n/g, "\n");

const app = express();

app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
    const message = JSON.stringify(req.body);
    const signature = req.headers["fireblocks-signature"];

    const verifier = crypto.createVerify('RSA-SHA512');
    verifier.write(message);
    verifier.end();

    const isVerified = verifier.verify(publicKey, signature, "base64");
    console.log("Verified:", isVerified);

    res.send("ok");
});

app.listen(port, () => {
    console.log(`Webhook running at http://localhost:${port}`);
});
```

```python theme={"system"}
import falcon
import json
import rsa
import base64

FIREBLOCKS_PUBLIC_KEY = """
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA0+6wd9OJQpK60ZI7qnZG
jjQ0wNFUHfRv85Tdyek8+ahlg1Ph8uhwl4N6DZw5LwLXhNjzAbQ8LGPxt36RUZl5
YlxTru0jZNKx5lslR+H4i936A4pKBjgiMmSkVwXD9HcfKHTp70GQ812+J0Fvti/v
4nrrUpc011Wo4F6omt1QcYsi4GTI5OsEbeKQ24BtUd6Z1Nm/EP7PfPxeb4CP8KOH
clM8K7OwBUfWrip8Ptljjz9BNOZUF94iyjJ/BIzGJjyCntho64ehpUYP8UJykLVd
CGcu7sVYWnknf1ZGLuqqZQt4qt7cUUhFGielssZP9N9x7wzaAIFcT3yQ+ELDu1SZ
dE4lZsf2uMyfj58V8GDOLLE233+LRsRbJ083x+e2mW5BdAGtGgQBusFfnmv5Bxqd
HgS55hsna5725/44tvxll261TgQvjGrTxwe7e5Ia3d2Syc+e89mXQaI/+cZnylNP
SwCCvx8mOM847T0XkVRX3ZrwXtHIA25uKsPJzUtksDnAowB91j7RJkjXxJcz3Vh1
4k182UFOTPRW9jzdWNSyWQGl/vpe9oQ4c2Ly15+/toBo4YXJeDdDnZ5c/O+KKadc
IMPBpnPrH/0O97uMPuED+nI6ISGOTMLZo35xJ96gPBwyG5s2QxIkKPXIrhgcgUnk
tSM7QYNhlftT4/yVvYnk0YcCAwEAAQ==
-----END PUBLIC KEY-----
"""

signature_pub_key = rsa.PublicKey.load_pkcs1_openssl_pem(FIREBLOCKS_PUBLIC_KEY)

class RequestBodyMiddleware(object):
    def process_request(self, req, resp):
        req.body = req.bounded_stream.read()

class AuthMiddleware(object):
    def process_request(self, req, resp):
        signature = req.get_header('Fireblocks-Signature')

        if signature is None:
            raise falcon.HTTPUnauthorized('Signature required')

        if not self._signature_is_valid(req.body, signature):
            raise falcon.HTTPUnauthorized('Invalid signature')

    def _signature_is_valid(self,  body, signature):
        try:
            hashing_alg = rsa.verify(body, base64.b64decode(signature), signature_pub_key)
            return hashing_alg == "SHA-512"
        except rsa.pkcs1.VerificationError:
            return False

class DummyRequest(object):
    def on_post(self, req, resp):
        obj = json.loads(req.body.decode("utf-8"))
        print(obj)
        resp.status = falcon.HTTP_201

# Create falcon app
app = falcon.API(
    middleware=[
        RequestBodyMiddleware(),
        AuthMiddleware()
    ]
)

app.add_route('/webhook', DummyRequest())

if __name__ == '__main__':
    from wsgiref import simple_server  # NOQA
    httpd = simple_server.make_server('127.0.0.1', 8000, app)
    httpd.serve_forever()
```
