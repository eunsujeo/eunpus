<!--
source_url: https://developers.fireblocks.com/reference/cosigner-callbackhandler-secure-communication-authentication
downloaded_at: 2026-05-19
original_file: sources/fireblocks/webpages/developers/reference/cosigner-callbackhandler-secure-communication-authentication.md
status: full
priority: TIER1
domain: cosigner-deployment / callback-handler / auth-spec
cluster: callback-handler
-->

# Securing communication — Callback Handler Auth Reference (Stage 24 Mode C)

**Status**: deep-ingested Stage 24. Body curl-saved + chunked load (3 sed-extracted chunks).

## 5 Authentication Options (Q-A04 ANSWERED 의 1차 source)

| # | 명칭 | Message layer | TLS layer | Version | SGX only |
|---|---|---|---|---|---|
| 1 | Public key authentication | JWT (RSA 2048) | HTTPS + trusted CA cert | all | no |
| 2 | Self-Signed Certificate pinning | JSON | TLS cert pin (self-signed or CA) | all | no |
| 3 | Root-CA Certificate | JSON | TLS Root-CA validation | **v2025.12.11+** | no |
| 4 | Hybrid — Public key + Cert pinning | JWT | TLS cert pin | **v2025.12.11+** | **★ SGX only** |
| 5 | Hybrid — Public key + Root-CA | JWT | TLS Root-CA | **v2025.12.11+** | **★ SGX only** |

→ Hybrid (4/5) = message-layer + TLS-layer dual security. SGX cosigner 한정.

## Payload / URL Convention (Q-C01 substantial advance)

- Endpoints (POST): `tx_sign_request` + `config_change_sign_request`
- **`/v2` URL prefix 분기**:
  - JWT-bearing options (1, 4, 5): `https://<base>/v2/tx_sign_request`
  - JSON-bearing options (2, 3): `https://<base>/tx_sign_request` (no prefix)
- URL setting 시 base URL + custom relative path 만 입력 (`/v2/...` 는 자동 추가)

## Key Model 비대칭 (★ 신규 architectural 신호)

- **Co-signer private key (global)**: 해당 Co-signer 에 페어링된 **모든 API user** 의 request 서명에 재사용
- **Callback Handler private key (per-API-user)**: API user 별 별도 public key 를 Co-signer 에 등록
- 직접 인용: "The same Co-signer private key is used to sign request messages sent to the Callback Handler server for all API users paired with this Co-signer."

## RSA 2048 키 생성 절차 (Option 1 의 response auth)
```bash
openssl genrsa -out callback_private.pem 2048
openssl rsa -in callback_private.pem -outform PEM -pubout -out callback_public.pem
```

## Related cite targets
- [[entities/fireblocks/callback-handler]] — 5 options 통합 위치
- [[vendors/fireblocks/callback-handler]] — 5 options + URL convention hub
- [[entities/fireblocks/api-co-signer]] — key model 비대칭
- [[sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__docs-create-api-co-signer-callback-handler]] — paired setup guide

## Source
- `sources/fireblocks/webpages/developers/reference/cosigner-callbackhandler-secure-communication-authentication.md` (raw, 185 lines, 3 chunks loaded via sed)
