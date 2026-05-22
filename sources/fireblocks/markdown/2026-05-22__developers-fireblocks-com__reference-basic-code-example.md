> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Basic Callback Handler example

## Request payload example

This example demonstrates the raw and decoded JWT payload sent by the Co-Signer to the Callback Handler.

Additionally, it includes a test private key that signed the payload and the corresponding public key that should be used for signature validation:

> **The provided Private Key is for example purposes only and should not be used in your production system.**

> **The provided example may contain properties that are not sent by default. Customers should ensure they DO NOT expect to receive values that are not documented in the Approve Transactions and Approve Configuration Changes sections.**

```text theme={"system"}
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eElkIjoiOWM3OTRjZWUtN2UyNy00NmM5LTllOWEtZWQ2ODI5NWZmMDZiIiwib3BlcmF0aW9uIjoiVFJBTlNGRVIiLCJzb3VyY2VUeXBlIjoiVkFVTFQiLCJzb3VyY2VJZCI6IjAiLCJkZXN0VHlwZSI6IlZBVUxUIiwiZGVzdElkIjoiMSIsImFzc2V0IjoiRVRIIiwiYW1vdW50IjowLjAxLCJhbW91bnRTdHIiOiIwLjAxMDAwMDAwMDAwMDAwMDAwMCIsInJlcXVlc3RlZEFtb3VudCI6MC4wMSwicmVxdWVzdGVkQW1vdW50U3RyIjoiMC4wMSIsImZlZSI6IjAuMDAwNTk3ODAzNzYyMjQxMDAwIiwiZGVzdEFkZHJlc3NUeXBlIjoiV0hJVEVMSVNURUQiLCJkZXN0QWRkcmVzcyI6IjB4NWRDNjlCMUZiYjEzQmFmZDA5YWY4OGE3ODJGMEYyODU3NzJBZDVmOCIsImRlc3RpbmF0aW9ucyI6W3siYW1vdW50TmF0aXZlIjowLjAxLCJhbW91bnROYXRpdmVTdHIiOiIwLjAxIiwiYW1vdW50VVNEIjoxOC43NDI5MjkzNywiZHN0QWRkcmVzc1R5cGUiOiJXSElURUxJU1RFRCIsImRzdElkIjoiMSIsImRzdFdhbGxldElkIjoiIiwiZHN0TmFtZSI6Ik5ldHdvcmsgRGVwb3NpdHMiLCJkc3RTdWJUeXBlIjoiIiwiZHN0VHlwZSI6IlZBVUxUIiwiZGlzcGxheURzdEFkZHJlc3MiOiIweDVkQzY5QjFGYmIxM0JhZmQwOWFmODhhNzgyRjBGMjg1NzcyQWQ1ZjgiLCJhY3Rpb24iOiJBTExPVyIsImFjdGlvbkluZm8iOnsiY2FwdHVyZWRSdWxlTnVtIjo1LCJydWxlc1NuYXBzaG90SWQiOjgxNjQsImJ5R2xvYmFsUG9saWN5IjpmYWxzZSwiYnlSdWxlIjp0cnVlLCJjYXB0dXJlZFJ1bGUiOiJ7XCJ0eXBlXCI6XCJUUkFOU0ZFUlwiLFwidHJhbnNhY3Rpb25UeXBlXCI6XCJUUkFOU0ZFUlwiLFwiYXNzZXRcIjpcIipcIixcImFtb3VudFwiOjAsXCJvcGVyYXRvcnNcIjp7XCJ3aWxkY2FyZFwiOlwiKlwifSxcImFwcGx5Rm9yQXBwcm92ZVwiOnRydWUsXCJhY3Rpb25cIjpcIkFMTE9XXCIsXCJzcmNcIjp7XCJpZHNcIjpbW1wiKlwiXV19LFwiZHN0XCI6e1wiaWRzXCI6W1tcIipcIl1dfSxcImRzdEFkZHJlc3NUeXBlXCI6XCIqXCIsXCJhbW91bnRDdXJyZW5jeVwiOlwiVVNEXCIsXCJhbW91bnRTY29wZVwiOlwiU0lOR0xFX1RYXCIsXCJwZXJpb2RTZWNcIjowfSJ9fV0sInJhd1R4IjpbeyJrZXlEZXJpdmF0aW9uUGF0aCI6IlsgNDQsIDYwLCAwLCAwLCAwIF0iLCJyYXdUeCI6IjAyZWYwMTA0ODQzYjlhY2EwMDg1MDZhMGMxOTg3ZDgyNTIwODk0NWRjNjliMWZiYjEzYmFmZDA5YWY4OGE3ODJmMGYyODU3NzJhZDVmODg3MjM4NmYyNmZjMTAwMDA4MGMwIiwicGF5bG9hZCI6Ijc3YjRlNzQwOTljZTkwYzA4NTAzYzBlMGJiNmU2NzJkYmUxYzVlM2UxMjdjZTMzM2JmMjJlYjU4MWNkM2Y2Y2UifV0sInBsYXllcnMiOlsiMjE5MjZlY2MtNGE4YS00NjE0LWJiYWMtN2M1OTFhYTdlZmRkIiwiMjc5MDA3MzctNDZmNi00MDk3LWExNjktZDBmZjQ1NjQ5ZWQ1IiwiZjg5Y2FjNTAtYzY1Ni00ZTc0LTg3OWYtMDQxYWZmOGQwMWI1Il0sInJlcXVlc3RJZCI6IjljNzk0Y2VlLTdlMjctNDZjOS05ZTlhLWVkNjgyOTVmZjA2YiJ9.aE1ZOSQreBU23q3e-Dx6Z76tFgURfDU8Szj1XESN1-LczwFpCXJeexOLJ4L5IoAHpp8FV8f1vg1yu_-iV1ZiPsCR8K9fcLQmTGF21Y43w18s1nvY8rqSKX64sHDWoBTUN1oJFhjzzi1ovpmcASBj3_yWJIv6-RfW20l30_f6ggMXZDE0QImCSYtRL2m5YIBr8wVe2rMleFLCQLUQTLVXyE-oxxbCfy-R_FqWv-dn7CaQSFkztm8fCn2_jnxlHs0phuOxSucwrOM7UkVr7qM8uTWhvdeTkYPjVBcj5lpgYwb8Fo2F0fnIvgcvRaz8r4LjVrj6hVwRHH809jt0ouzVeg
```

```json theme={"system"}
{
  "txId": "9c794cee-7e27-46c9-9e9a-ed68295ff06b",
  "operation": "TRANSFER",
  "sourceType": "VAULT",
  "sourceId": "0",
  "destType": "VAULT",
  "destId": "1",
  "asset": "ETH",
  "amount": 0.01,
  "amountStr": "0.010000000000000000",
  "requestedAmount": 0.01,
  "requestedAmountStr": "0.01",
  "fee": "0.000597803762241000",
  "destAddressType": "WHITELISTED",
  "destAddress": "0x5dC69B1Fbb13Bafd09af88a782F0F285772Ad5f8",
  "destinations": [
    {
      "amountNative": 0.01,
      "amountNativeStr": "0.01",
      "amountUSD": 18.74292937,
      "dstAddressType": "WHITELISTED",
      "dstId": "1",
      "dstWalletId": "",
      "dstName": "Network Deposits",
      "dstSubType": "",
      "dstType": "VAULT",
      "displayDstAddress": "0x5dC69B1Fbb13Bafd09af88a782F0F285772Ad5f8",
      "action": "ALLOW",
      "actionInfo": {
        "capturedRuleNum": 5,
        "rulesSnapshotId": 8164,
        "byGlobalPolicy": false,
        "byRule": true,
        "capturedRule": "{\"type\":\"TRANSFER\",\"transactionType\":\"TRANSFER\",\"asset\":\"*\",\"amount\":0,\"operators\":{\"wildcard\":\"*\"},\"applyForApprove\":true,\"action\":\"ALLOW\",\"src\":{\"ids\":[[\"*\"]]},\"dst\":{\"ids\":[[\"*\"]]},\"dstAddressType\":\"*\",\"amountCurrency\":\"USD\",\"amountScope\":\"SINGLE_TX\",\"periodSec\":0}"
      }
    }
  ],
  "rawTx": [
    {
      "keyDerivationPath": "[ 44, 60, 0, 0, 0 ]",
      "rawTx": "02ef0104843b9aca008506a0c1987d825208945dc69b1fbb13bafd09af88a782f0f285772ad5f8872386f26fc1000080c0",
      "payload": "77b4e74099ce90c08503c0e0bb6e672dbe1c5e3e127ce333bf22eb581cd3f6ce"
    }
  ],
  "players": [
    "21926ecc-4a8a-4614-bbac-7c591aa7efdd",
    "27900737-46f6-4097-a169-d0ff45649ed5",
    "f89cac50-c656-4e74-879f-041aff8d01b5"
  ],
  "requestId": "9c794cee-7e27-46c9-9e9a-ed68295ff06b"
}
```

```yaml theme={"system"}
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJtgGHPlbV5KB1
yzPslxYnFiYeogUX0w6rd9Ee+zAljQ2msEP45NCaHwPX6fsukQnw+w7hlvr52aVR
vKJKFmXnNMTSEd9v358053gJCzyVd9hKFnVO/04uwFTIwXX11VPd8XWZy6ue8meE
qztGfJJvvDtHnbmJUFgf48DBv04hUzDm7yS2CJsO0UR91WQRwlTDkMUs4b2jJ4AN
oLFaHlw+HAkKQH+O4g+WEfq+GQWnxq57L5U90TH4/+vELy54gOicojww6t/rTrjz
WRjzJxfE6Ue3Tbpf7tfVMrlCsD+q3958q+m5a6O/KmwyfMo6P/yUt66W1KhK4Wmg
v6YGY8J7AgMBAAECggEAG/rcvxNlJ+S/uLHta8n7dIQ3LnRKtjwnIp7gtGZN4++V
2gOaXNSfS7m1+/CE0Lf6w+GMy2XOPkk0DEtZIbjLUuU4Jhb87P+n4xv2mR6PaAEI
piJJDHe6sx59GZ9IYHJCi3IP3ju+fIe4gf00oDmYddpg82AMGWGP5Ss1FPXB/eTV
QT+5qwnZz2qqkzpk8QDcNjK/fsuuIaJg6RDC5NbXFuMr4NXKkXzDPkmzCgFowHAR
J5Jqf4y2YArKV7kwEgW+naUAESPLWFUCaoLmCJxw7fbqHkUHYKHfWk9M9t9C0boL
b0G9zbsAI/ip9YxuKzXi0E8lTkFH8q7Fssa5m/Gp/QKBgQD057qo2hq2zWXRXZ7W
Q9nta3uNdsxhRPeC/z9ejUIy4kC7/ZbQ04+i+Tefwz4kjSVxSobb4Y7Bh8e4/tpw
alyvTIyEys25G6vkFJh8MXojxQEgU1ImMnsFEqZVKsUilz/+aDG3POvihF4jwKbF
GJCUhFG8mFzsFQLtYKmmp5NOXQKBgQDS2VWyS3d7arZyAdCjI3pw+SV/iF/bJ7wT
NK2N6RHpfVwnnDk/AyFxQy2k53VwXASwYVsDkEZiPz1lqlV5xltcx3GDR5xhRdol
M4i0H+Qc+bYXjy+O99LYgRODzTsq8PQmUADL9xAF+Df3CW4sTZ5Izi46Hq9uMFa6
bA0IH5nWtwKBgGkuuUFZ4w1N7APelKBrpcZNWlQoiKDiEPenDp1aR+s4txrGUCbC
JjeVl6k7Ho5uPH2Kx57aIgjGeyXd9w0+8S2sz9EclPyCgPHFUrRMP6vrKY+rmWWk
WqeUGfIMG3y+vxJRx8BuHtU7in8Kd9XAth/DMKOyQH54i7hNwq87241VAoGAQax6
Oc+xxppFe5s/HiFF2Pxxhpi2qq9ksGK/EC2ha6WlV50cY5kZCItRI0UI2ld/CmU4
kRKWKbHi8NCuUQDMokho/egHOHEmcmHr2Zb5WWEaK5poyNI+NTt3FZ2OKWDl2y0e
Immw7vsSi3q/e0Mt4yV9VpMKN3sM+IIBSR92rl8CgYEAlfUVoSXRVOxh29dI65Qi
5IfJmg1mQnHWE2RfuZqtTcYisvbQejygsoyh1ZydEUSsX5rUbkc3/qqW5N4pEYVt
ZHCn7MJHot44SA3XDn2dGRQAL5UQJJK5nHRVeBuoJtnNyzhxbZH3M56sT4o5i6UC
TFalBSOqnaPpYIxV2fgCdyE=
-----END PRIVATE KEY-----
```

```yaml theme={"system"}
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAybYBhz5W1eSgdcsz7JcW
JxYmHqIFF9MOq3fRHvswJY0NprBD+OTQmh8D1+n7LpEJ8PsO4Zb6+dmlUbyiShZl
5zTE0hHfb9+fNOd4CQs8lXfYShZ1Tv9OLsBUyMF19dVT3fF1mcurnvJnhKs7RnyS
b7w7R525iVBYH+PAwb9OIVMw5u8ktgibDtFEfdVkEcJUw5DFLOG9oyeADaCxWh5c
PhwJCkB/juIPlhH6vhkFp8auey+VPdEx+P/rxC8ueIDonKI8MOrf606481kY8ycX
xOlHt026X+7X1TK5QrA/qt/efKvpuWujvypsMnzKOj/8lLeultSoSuFpoL+mBmPC
ewIDAQAB
-----END PUBLIC KEY-----
```

***

## Response payload example

This example demonstrates the raw and decoded JWT response returned from the Callback Handler to the Co-signer. The response is signed using the Callback Handler's private key. The Co-signer then verifies the signature using the predefined public key configured during the Co-signer installation phase.

For simplicity, the examples use the same private/public key pair as in the **Request Example** section:

> **Please note that the iat value is not required in the actual response and will be ignored by the Co-Signer. It is included here because the JWT signature library automatically adds this field.**

```text theme={"system"}
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiJSRUpFQ1QiLCJyZXF1ZXN0SWQiOiI5Yzc5NGNlZS03ZTI3LTQ2YzktOWU5YS1lZDY4Mjk1ZmYwNmIiLCJyZWplY3Rpb25SZWFzb24iOiJMb2dpYyByZXR1cm5lZCBmYWxzZSIsImlhdCI6MTcyMDQ3MjU5NH0.CGJ7D0KHb2K0F0ibStAAy8MyvXIZR-sQsFRiHRebXPEVMOdjEooaDac9PZYTgmuMJANDtsDAy9bbIggaTraeGxLtHPS4TvQdOA1GX74gWlkBHktJxtGxngsSwbZ-clvCSrwQ0AQcwqCv1OozXRmt_SGberuJpVIUbNc1HWlKAbti4dIcN_irTp2Xwq9WmGRwF16rkK97JdtMbhPBF9t56kdYrHccKU9q69_4Q7zG8I9yXgYKTQ1XctJiGjg06dPR3fDEVeN_ibUXSU5h1sXnd3gvpbUNmEOYAREDKZAk_FMSdMmiC9Prp0t9g-xDtoSear6vN-ovxk_64AwMLxqsEg
```

```json theme={"system"}
{
  "action": "REJECT",
  "requestId": "9c794cee-7e27-46c9-9e9a-ed68295ff06b",
  "rejectionReason": "Logic returned false",
  "iat": 1720472594
}
```

***

## API Co-Signer basic Callback Handler server example

Here is a code example for a basic Callback Handler application. The application is designed to handle POST requests from the Co-signer at the endpoint /v2/tx\_sign\_request.

* It validates that the received payload is signed with the correct private key.
* If the verification is successful, it responds with a 200 status code, the `REJECT` action, and the `rejectionReason` in the response body.
* If the verification fails, it responds with a 401 status code.

```javascript theme={"system"}
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const privateKey = fs.readFileSync("callback_private.pem");
const cosignerPubKey = fs.readFileSync("cosigner_public.pem");
const app = express();

app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());

app.use(function (req) {
  req.rawBody = "";
  req.setEncoding("utf8");
  req.on("data", function(chunk) {
    req.rawBody += chunk;
  });
  req.on("end", function () {
   req.next();
  });
});

app.post("/v2/tx_sign_request", async (req, res) => {
  let verified;
  try {
  const tx = jwt.decode(req.rawBody);
  const { requestId } = tx;
  verified = jwt.verify(req.rawBody, cosignerPubKey);
  if (verified) {
    let action = "REJECT";
    let rejectionReason = "Logic returned false";
    const signedRes = jwt.sign(
      {
        action,
        requestId,
        rejectionReason
      },
      privateKey,
      { algorithm: "RS256" }
    );
    res.send(signedRes);
  }
  } catch (e) {
    res.sendStatus(401);
  }
});
app.listen(3000);
```

```python theme={"system"}
from pathlib import Path
from wsgiref.simple_server import make_server
import falcon
import jwt
callback_handler_prikey = None
cosigner_pubkey = None

# Load keys.
f1 = Path("callback_private.pem")
if f1.is_file(): callback_handler_prikey = f1.read_bytes()
f2 = Path("cosigner_public.pem")
if f2.is_file(): cosigner_pubkey = f2.read_bytes()

class JWTTransferRequest(object):
    def on_post(self, req, resp):
        raw_req = req.bounded_stream.read()
        req = jwt.decode(raw_req, cosigner_pubkey, algorithms=["RS256"])
        resp.body = jwt.encode({'action': 'APPROVE', 'requestId': req['requestId']}, callback_handler_prikey, algorithm="RS256")
        resp.status = falcon.HTTP_200

# Create falcon app
app = falcon.App()
app.add_route('/v2/tx_sign_request', JWTTransferRequest())
app.add_route('/v2/config_change_sign_request', JWTTransferRequest())
if __name__ == '__main__':
    with make_server('', 80, app) as httpd:
        print('Serving on port 80...')
        # Serve until process is killed
        httpd.serve_forever()
JWTTransferRequest()
```
