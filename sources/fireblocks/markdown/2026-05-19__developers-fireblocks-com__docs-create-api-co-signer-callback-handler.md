<!--
source_url: https://developers.fireblocks.com/docs/create-api-co-signer-callback-handler
downloaded_at: 2026-05-19
original_file: sources/fireblocks/webpages/developers/docs/create-api-co-signer-callback-handler.md
status: full
priority: TIER1
domain: cosigner-deployment / callback-handler
cluster: callback-handler
-->

# Setup API Co-signer Callback Handler (Stage 24 Mode C)

**Status**: deep-ingested Stage 24. Body curl-saved + chunked load. Full body 미로드 (LLM context 보호).

## Key facts (본문 인용)

### Optional 성격 (★ 신규 운영 신호)
"If a Callback Handler is not configured for an API user, the Co-signer will automatically sign or approve all requests it receives for that API user." (line 9-10)

→ Callback Handler 미설정 = **Co-signer 자동 승인/서명 default**. 외부 validation 없음. → Risk-S16 등재.

### 2 옵션 high-level (DOC1 본문 — 사용자가 처음 보는 setup guide)
- **Option 1: Public key authentication** — JWT 기반 양방향 서명, RSA 2048
- **Option 2: Certificate-based** — TLS cert pinning, JSON payload

→ Setup guide 는 2 옵션만 high-level 제시. 상세 5 option matrix (Hybrid 포함) 은 reference doc (sources/.../reference/cosigner-callbackhandler-secure-communication-authentication.md) 참조.

### Production vs Dev
- Production: HTTPS w/ trusted CA cert 권장
- Dev/Test: HTTP 허용

## Related cite targets
- [[entities/fireblocks/callback-handler]]
- [[vendors/fireblocks/callback-handler]]
- [[entities/fireblocks/api-co-signer]]
- [[sources/fireblocks/markdown/2026-05-19__developers-fireblocks-com__reference-cosigner-callbackhandler-secure-communication-authentication]] — paired deep ingest

## Source
- `sources/fireblocks/webpages/developers/docs/create-api-co-signer-callback-handler.md` (raw, 47 lines)
