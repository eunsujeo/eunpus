> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Validating webhooks

## Method 2: Signature Verification

Fireblocks cryptographically signs every webhook, allowing you to verify authenticity and integrity.

### Signature methods

| Method | Header                       | Key Rotation |
| ------ | ---------------------------- | ------------ |
| JWKS   | Fireblocks-Webhook-Signature | ✅ Automatic  |
| Legacy | Fireblocks-Signature         | ❌ Manual     |

During migration, both headers are sent with each webhook.

## Validating webhooks (JWKS)

### How it works

The new signature uses Detached JWS (JSON Web Signature) format:

Fireblocks-Webhook-Signature: "\[header]..\[signature]"

The kid (key ID) is embedded in the JWS header, allowing automatic key lookup from the JWKS endpoint. The payload is sent separately in the request body (detached format).

### JWKS endpoints

Fireblocks publishes public keys in JWKS format for validating webhook signatures. Use the endpoint that matches your workspace's environment.

| Environment   | URL                                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------- |
| US Production | [https://keys.fireblocks.io/.well-known/jwks.json](https://keys.fireblocks.io/.well-known/jwks.json)                 |
| EU            | [https://eu-keys.fireblocks.io/.well-known/jwks.json](https://eu-keys.fireblocks.io/.well-known/jwks.json)           |
| EU2           | [https://eu2-keys.fireblocks.io/.well-known/jwks.json](https://eu2-keys.fireblocks.io/.well-known/jwks.json)         |
| Sandbox       | [https://sandbox-keys.fireblocks.io/.well-known/jwks.json](https://sandbox-keys.fireblocks.io/.well-known/jwks.json) |

#### Response format

```json theme={"system"}
{
  "keys": [
    {
      "kty": "RSA",
      "kid": "webhook-key-2025-01",
      "use": "sig",
      "alg": "RS512",
      "n": "0vx7agoebGcQemDqTnUt...",
      "e": "AQAB"
    }
  ]
}
```

| Field | Description                                              |
| ----- | -------------------------------------------------------- |
| kty   | Key type. Always RSA for Fireblocks webhook keys.        |
| kid   | Key ID. Matches the kid header in incoming webhook JWTs. |
| use   | Key usage. Always sig (signature verification).          |
| alg   | Algorithm. Fireblocks uses RS512 (RSA with SHA-512).     |
| n     | RSA modulus (Base64URL-encoded).                         |
| e     | RSA exponent (Base64URL-encoded).                        |

### Caching behavior

The JWKS endpoint returns caching headers to optimize performance:

* Cache-Control: public, max-age=3600, s-maxage=3600
* Access-Control-Allow-Origin: \*
* Content-Type: application/json

#### Code examples (JWKS)

```typescript theme={"system"}
import { createRemoteJWKSet, compactVerify } from 'jose';

// Initialize JWKS client (caches keys automatically)
const JWKS = createRemoteJWKSet(
  new URL('https://keys.fireblocks.io/.well-known/jwks.json')
);

async function verifyWebhookJWKS(
  rawBody: Buffer,
  jwsSignature: string
): Promise<boolean> {
  try {
    // Detached JWS format: "header..signature" (no payload)
    const [header, , sig] = jwsSignature.split('.');
    
    // Reconstruct full JWS with payload
    const payload = Buffer.from(rawBody).toString('base64url');
    const fullJws = `${header}.${payload}.${sig}`;
    
    // jose extracts kid from header and fetches correct key from JWKS
    await compactVerify(fullJws, JWKS);
    return true;
  } catch (error) {
    console.error('JWKS verification failed:', error);
    return false;
  }
}

// Usage: pass raw body and Fireblocks-Webhook-Signature header
const isValid = await verifyWebhookJWKS(rawBody, jwsSignatureHeader);
```

```python theme={"system"}
import base64
from jwcrypto import jwk, jws
from jwcrypto.common import json_decode
import requests

class FireblocksJWKSVerifier:
    def __init__(self, jwks_url: str = "https://api.fireblocks.io/.well-known/jwks.json"):
        self.jwks_url = jwks_url
        self._jwks = None
    
    def _fetch_jwks(self) -> jwk.JWKSet:
        """Fetch and cache JWKS from endpoint."""
        if self._jwks is None:
            response = requests.get(self.jwks_url)
            response.raise_for_status()
            self._jwks = jwk.JWKSet.from_json(response.text)
        return self._jwks
    
    def verify(self, raw_body: bytes, jws_signature: str) -> bool:
        """
        Verify Fireblocks webhook using JWKS.
        
        Args:
            raw_body: The raw request body as bytes
            jws_signature: The detached JWS from Fireblocks-Webhook-Signature header
        """
        try:
            # Detached JWS: "header..signature"
            parts = jws_signature.split('.')
            header, sig = parts[0], parts[2]
            
            # Reconstruct with base64url-encoded payload
            payload = base64.urlsafe_b64encode(raw_body).rstrip(b'=').decode()
            full_jws = f"{header}.{payload}.{sig}"
            
            # Verify using JWKS (kid extracted automatically from header)
            jwks = self._fetch_jwks()
            jws_obj = jws.JWS()
            jws_obj.deserialize(full_jws)
            jws_obj.verify(jwks)
            return True
        except Exception as e:
            print(f"JWKS verification failed: {e}")
            return False


# Usage
verifier = FireblocksJWKSVerifier()
is_valid = verifier.verify(raw_body, jws_signature_header)
```

```go theme={"system"}
package main

import (
	"context"
	"encoding/base64"
	"log"
	"strings"

	"github.com/lestrrat-go/jwx/v2/jwk"
	"github.com/lestrrat-go/jwx/v2/jws"
)

type JWKSVerifier struct {
	cache *jwk.Cache
	url   string
}

func NewJWKSVerifier(jwksURL string) (*JWKSVerifier, error) {
	cache := jwk.NewCache(context.Background())
	err := cache.Register(jwksURL, jwk.WithMinRefreshInterval(time.Hour))
	if err != nil {
		return nil, err
	}
	return &JWKSVerifier{cache: cache, url: jwksURL}, nil
}

// VerifyWebhookJWKS verifies Fireblocks webhook using JWKS.
// rawBody: The raw request body
// jwsSignature: The detached JWS from Fireblocks-Webhook-Signature header
func (v *JWKSVerifier) VerifyWebhookJWKS(rawBody []byte, jwsSignature string) bool {
	// Detached JWS: "header..signature"
	parts := strings.Split(jwsSignature, ".")
	if len(parts) != 3 {
		log.Println("Invalid JWS format")
		return false
	}
	header, sig := parts[0], parts[2]

	// Reconstruct with base64url-encoded payload
	payload := base64.RawURLEncoding.EncodeToString(rawBody)
	fullJws := header + "." + payload + "." + sig

	// Fetch keys and verify
	keySet, err := v.cache.Get(context.Background(), v.url)
	if err != nil {
		log.Printf("Failed to fetch JWKS: %v", err)
		return false
	}

	_, err = jws.Verify([]byte(fullJws), jws.WithKeySet(keySet))
	if err != nil {
		log.Printf("JWKS verification failed: %v", err)
		return false
	}
	return true
}

// Usage:
// verifier, _ := NewJWKSVerifier("https://api.fireblocks.io/.well-known/jwks.json")
// isValid := verifier.VerifyWebhookJWKS(rawBody, jwsSignatureHeader)

```

```java theme={"system"}
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.*;
import com.nimbusds.jose.jwk.source.*;
import java.net.URL;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

public class FireblocksJWKSVerifier {
    
    private final JWKSource<SecurityContext> jwkSource;
    
    public FireblocksJWKSVerifier(String jwksUrl) throws Exception {
        // Cache JWKS for 1 hour, refresh 5 min before expiry
        var cache = new DefaultJWKSetCache(1, 5, TimeUnit.HOURS);
        this.jwkSource = new RemoteJWKSet<>(new URL(jwksUrl), null, cache);
    }
    
    public FireblocksJWKSVerifier() throws Exception {
        this("https://keys.fireblocks.io/.well-known/jwks.json");
    }
    
    public boolean verify(byte[] rawBody, String jwsSignature) throws JOSEException {
        // Reconstruct full JWS from detached format (header..signature)
        String[] parts = jwsSignature.split("\\.");
        String payload = Base64.getUrlEncoder().withoutPadding().encodeToString(rawBody);
        String fullJws = parts[0] + "." + payload + "." + parts[2];
        
        JWSObject jws = JWSObject.parse(fullJws);
        
        // Get the key by kid from JWKS (cached)
        JWKSelector selector = new JWKSelector(
            new JWKMatcher.Builder().keyID(jws.getHeader().getKeyID()).build()
        );
        RSAKey rsaKey = (RSAKey) jwkSource.get(selector, null).get(0);
        
        return jws.verify(new RSASSAVerifier(rsaKey));
    }
}

```

### JWKS caching best practices

Cache the JWKS: Most libraries handle this automatically.
Respect Cache-Control: JWKS responses include max-age=3600 (1 hour). Refresh accordingly.
Handle rotation gracefully: Multiple keys will be present; the kid in the JWS header identifies which key to use.

### Common pitfalls

| Issue                            | Solution                                                                 |
| -------------------------------- | ------------------------------------------------------------------------ |
| Body parsing before verification | Use raw body parser middleware. JSON parsing alters whitespace/ordering. |
| Wrong JWKS URL                   | Use the correct endpoint for your environment                            |
| Stale JWKS cache                 | Refresh the cache if verification fails with an unknown kid              |
| Encoding issues                  | Ensure body is read as raw bytes, not string-converted                   |

***

## Legacy Static Key Validation

<Warning>
  **Migration notice**

  This method is being replaced by JWKS-based validation. Both headers are sent until March 20th, 2026. New integrations should use JWKS.
</Warning>

### How the signature works

Fireblocks signs every webhook event with their private key. The signature is sent in the Fireblocks-Signature HTTP header:

Fireblocks-Signature: Base64(RSA512(WEBHOOK\_PRIVATE\_KEY, SHA512(eventBody)))

Breakdown:

SHA512(eventBody) — Hash the raw request body with SHA-512\
RSA512 Sign — Fireblocks signs the hash with their private RSA key (PKCS#1 v1.5)\
Base64 Encode — The signature is base64-encoded for transport

Your job: Verify the signature using Fireblocks' public key to confirm authenticity.

### Public keys by environment

#### US Mainnet & Testnet

```pem theme={"system"}
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
```

#### EU & EU2 Mainnet & Testnet

```pem theme={"system"}
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA6hLRQL0jPf5OEuaDYGjO
xSyaYIlv08S0+4giiwgKSfV3Onc5hn03mvE0znzaUq2ReSxi9KYDdMYFfzf1uwF7
7kYy2MY0oTYGdQb+PS4Ym4R4tgZ2otuoAXt8YRKq2maWyguFiaowMcYwwAVQv8JB
afIm6Jq1nI6v1mEDVX065ePlBlAt+BGAqr6ahPxnaIz3L4eztpuNrt5nTbSxs7eF
aqQx1p56W1nl3Hl0V3tLkaXbuVtbFNR/mGMInrkPnpsG+mt35b9vmqAOvLPI0Cx1
59uVeEs62Hj1AOCRyT6SuwIaFynRj2KnD42ioQtkodHQ0xDtgdiYGsxuwQ9vTIe7
5oLsL8gBDeX5gdcTfSZhfGjZ7RggLNJ7vCAbYKMuUOdgWVMYnJfrhNLCq3zDSZPO
+H0x5m/Yeq/Hn5o7xCmLNT3qARfwDd5IHfQyXqVYB6TMU75xqH5fdSRw0iMdoPyL
ALnr9/JT0av3qssNMRdWCXr+j9Ys3NkfcbU/a49657mg8e2QGSkl9w39csEKojnr
omUz25szIL8CcXLmc5cAmnimFCe4L7UT4mvVP3+fOo+cbc/82zqA8tsSwd2Y93/6
ueGnNZD9V5rewrKjmdPfrwoI2gntzc8QJUu+nxAWhoqHV91AQeglu6WIF/DiEJC5
WPoNk2SdlAuA6RYmgB2YyikCAwEAAQ==
-----END PUBLIC KEY-----

```

#### Developer Sandbox

```pem theme={"system"}
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApZE6wL2+7P1ohvVYSpCd
gSgtmyGwiLbUC1UoGJhn1zwfY7ZWbNH7Pg8Osk8OzZTZHSG/arcgE8HnGCmGKtbE
QBkf2XlBRBQ01FcCMlZuJQJ3nElCPaMl9N6fq0VKNEIlVSVUpDCgvag5kFhDKS/L
p3YYJLFR46/hDlVLn+vM84diO3xGyMc16YJGNz7Z4jb8dmSZQE5E2XaQMDXW6uxC
c2ChjWJ3X5H70MzRG35JsN0j58SQTwbf4Pxm0aJfhPuaIBn3mJuZL5etsuFihoFG
FDnT+qWRcgD/pRNulBFAFhJeUnFrE4fFTJ1iaHhjBrStBCrxJk6QI0pGznoapTgA
2QIDAQAB
-----END PUBLIC KEY-----

```

### Step-by-step validation process

1. Extract the signature from the Fireblocks-Signature header
2. Base64 decode the signature to get raw bytes
3. Read the raw request body (do NOT parse or modify it)
4. Hash the body with SHA-512
5. Verify using RSA PKCS#1 v1.5 with the Fireblocks public key
6. Accept or reject the webhook based on the verification result

### Code examples (Legacy)

```typescript theme={"system"}
import crypto from 'crypto';

// Select the appropriate key for your environment
const FIREBLOCKS_PUBLIC_KEY_US = `-----BEGIN PUBLIC KEY-----
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
-----END PUBLIC KEY-----`;

function verifyWebhookSignature(
  rawBody: Buffer,
  signature: string,
  publicKey: string = FIREBLOCKS_PUBLIC_KEY_US
): boolean {
  try {
    const verifier = crypto.createVerify('RSA-SHA512');
    verifier.update(rawBody);
    return verifier.verify(publicKey, signature, 'base64');
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

/**
 * IMPORTANT:
 * This function requires the **raw request body**.
 * Do NOT use express.json() or any body parser that mutates the payload.
 *
 * Use:
 *   app.use(express.raw({ type: 'application/json' }))
 *
 * Otherwise, signature verification will fail.
 */
// Usage: pass raw request body (Buffer) and Fireblocks-Signature header value const isValid = verifyWebhookSignature(rawBody, signatureHeader);
```

```python theme={"system"}
import base64
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.backends import default_backend

# Select the appropriate key for your environment
FIREBLOCKS_PUBLIC_KEY_US = """-----BEGIN PUBLIC KEY-----
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
-----END PUBLIC KEY-----"""


def verify_webhook_signature(
    raw_body: bytes,
    signature: str,
    public_key_pem: str = FIREBLOCKS_PUBLIC_KEY_US
) -> bool:
    """
    Verify Fireblocks webhook signature.
    
    Args:
        raw_body: The raw request body as bytes
        signature: The base64-encoded signature from Fireblocks-Signature header
        public_key_pem: The Fireblocks public key in PEM format
    
    Returns:
        True if signature is valid, False otherwise
    """
    try:
        public_key = serialization.load_pem_public_key(
            public_key_pem.encode(),
            backend=default_backend()
        )
        signature_bytes = base64.b64decode(signature)
        
        # Verify: RSA-SHA512 with PKCS#1 v1.5 padding
        public_key.verify(
            signature_bytes,
            raw_body,
            padding.PKCS1v15(),
            hashes.SHA512()
        )
        return True
    except Exception as e:
        print(f"Signature verification failed: {e}")
        return False


# Usage: pass raw request body (bytes) and Fireblocks-Signature header value
is_valid = verify_webhook_signature(raw_body, signature_header)

# IMPORTANT:
# Signature verification requires the **raw request body bytes**.
#
# - Flask: use request.get_data()
# - FastAPI: use await request.body()
#
# Do NOT use request.json() or request.form(),
# as they modify the payload and will invalidate the signature.
```

```java theme={"system"}
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class FireblocksWebhookVerifier {

    // Select the appropriate key for your environment (base64-encoded, no PEM headers)
    private static final String FIREBLOCKS_PUBLIC_KEY_US = 
        "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA0+6wd9OJQpK60ZI7qnZG" +
        "jjQ0wNFUHfRv85Tdyek8+ahlg1Ph8uhwl4N6DZw5LwLXhNjzAbQ8LGPxt36RUZl5" +
        "YlxTru0jZNKx5lslR+H4i936A4pKBjgiMmSkVwXD9HcfKHTp70GQ812+J0Fvti/v" +
        "4nrrUpc011Wo4F6omt1QcYsi4GTI5OsEbeKQ24BtUd6Z1Nm/EP7PfPxeb4CP8KOH" +
        "clM8K7OwBUfWrip8Ptljjz9BNOZUF94iyjJ/BIzGJjyCntho64ehpUYP8UJykLVd" +
        "CGcu7sVYWnknf1ZGLuqqZQt4qt7cUUhFGielssZP9N9x7wzaAIFcT3yQ+ELDu1SZ" +
        "dE4lZsf2uMyfj58V8GDOLLE233+LRsRbJ083x+e2mW5BdAGtGgQBusFfnmv5Bxqd" +
        "HgS55hsna5725/44tvxll261TgQvjGrTxwe7e5Ia3d2Syc+e89mXQaI/+cZnylNP" +
        "SwCCvx8mOM847T0XkVRX3ZrwXtHIA25uKsPJzUtksDnAowB91j7RJkjXxJcz3Vh1" +
        "4k182UFOTPRW9jzdWNSyWQGl/vpe9oQ4c2Ly15+/toBo4YXJeDdDnZ5c/O+KKadc" +
        "IMPBpnPrH/0O97uMPuED+nI6ISGOTMLZo35xJ96gPBwyG5s2QxIkKPXIrhgcgUnk" +
        "tSM7QYNhlftT4/yVvYnk0YcCAwEAAQ==";

    private final PublicKey publicKey;

    public FireblocksWebhookVerifier() throws Exception {
        this.publicKey = loadPublicKey(FIREBLOCKS_PUBLIC_KEY_US);
    }

    private PublicKey loadPublicKey(String base64Key) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(base64Key);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePublic(spec);
    }

    /**
     * Verify Fireblocks webhook signature.
     *
     * @param rawBody   The raw request body as bytes
     * @param signature The base64-encoded signature from Fireblocks-Signature header
     * @return true if signature is valid, false otherwise
     */
    public boolean verifyWebhookSignature(byte[] rawBody, String signature) {
        try {
            byte[] signatureBytes = Base64.getDecoder().decode(signature);
            
            // SHA512withRSA uses PKCS#1 v1.5 padding
            Signature verifier = Signature.getInstance("SHA512withRSA");
            verifier.initVerify(publicKey);
            verifier.update(rawBody);
            
            return verifier.verify(signatureBytes);
        } catch (Exception e) {
            System.err.println("Signature verification failed: " + e.getMessage());
            return false;
        }
    }
}

// Usage: pass raw request body (byte[]) and Fireblocks-Signature header value
// boolean isValid = verifier.verifyWebhookSignature(rawBody, signatureHeader);

// IMPORTANT:
// Signature verification requires the raw request body.
// Use:
//
//   @RequestBody byte[] rawBody
//
// Do NOT bind the request to a POJO or String before verification,
// as this will alter the payload and break signature validation.
```

```go theme={"system"}
package main

import (
	"crypto"
	"crypto/rsa"
	"crypto/sha512"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"fmt"
	"log"
)

// Select the appropriate key for your environment
const fireblocksPublicKeyUS = `-----BEGIN PUBLIC KEY-----
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
-----END PUBLIC KEY-----`

func loadPublicKey(pemKey string) (*rsa.PublicKey, error) {
	block, _ := pem.Decode([]byte(pemKey))
	if block == nil {
		return nil, fmt.Errorf("failed to parse PEM block")
	}
	pub, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return nil, fmt.Errorf("failed to parse public key: %w", err)
	}
	rsaPub, ok := pub.(*rsa.PublicKey)
	if !ok {
		return nil, fmt.Errorf("not an RSA public key")
	}
	return rsaPub, nil
}

// VerifyWebhookSignature verifies Fireblocks webhook signature.
// rawBody: The raw request body as bytes
// signatureB64: The base64-encoded signature from Fireblocks-Signature header
func VerifyWebhookSignature(rawBody []byte, signatureB64 string, publicKey *rsa.PublicKey) bool {
	signature, err := base64.StdEncoding.DecodeString(signatureB64)
	if err != nil {
		log.Printf("Failed to decode signature: %v", err)
		return false
	}
	
	hash := sha512.Sum512(rawBody)
	
	err = rsa.VerifyPKCS1v15(publicKey, crypto.SHA512, hash[:], signature)
	if err != nil {
		log.Printf("Signature verification failed: %v", err)
		return false
	}
	return true
}

// Usage:
// publicKey, _ := loadPublicKey(fireblocksPublicKeyUS)
// isValid := VerifyWebhookSignature(rawBody, signatureHeader, publicKey)

// IMPORTANT:
// Signature verification requires the raw request body bytes.
// Use:
//
//   body, err := io.ReadAll(r.Body)
//
// Do NOT decode or unmarshal the body before verification,
// as this will modify the payload and invalidate the signature.
```
