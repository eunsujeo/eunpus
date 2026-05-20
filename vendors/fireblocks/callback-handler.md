# Fireblocks — Callback Handler

> Cosigner가 자동 서명 전에 호출하는 외부 검증 훅.

## Summary

Co-signer 가 자동 서명 전에 호출하는 외부 검증 훅. **Stage 24** Mode C 로 5 auth options + payload format + key model 명세 확보 (Q-A04 ANSWERED, Q-C01 substantial advance).

본 자료 기반 사실:

- Signer가 "programmatically via an API Co-signer and Callback Handler"로 동작 (`user-roles.md`, p.3)
- **★ OPTIONAL**: Callback Handler 미설정 시 Co-signer 가 자동 sign/approve (`create-api-co-signer-callback-handler.md` 직접 인용). 외부 validation 없음 → **Risk-S16** 등재
- Co-signer 는 **Callback Handler 서버의 SSL 공개키를 pin**한다 (`re-enrolling-api-users.md`, p.2). Stage 24 의 Option 2 (Self-Signed Cert pinning) 의 wire-level instance.
- **Callback Handler 설정 변경 = API user 재등록 trigger** (`re-enrolling-api-users.md`, p.1). Stage 24: 5 auth options 사이 전환 시 정확한 trigger 매핑.

## Key Concepts

- **SSL public key pinning** — Co-signer가 Callback Handler 인증서의 공개키를 고정 신뢰 (`re-enrolling-api-users.md`, p.2)
- **인증 방식 (authentication method)** 옵션이 존재 — 변경 시 재등록 필요. 구체적 종류는 본 자료에 없음 → Q-A04
- 페어링 시점에 인증서가 Co-signer 측으로 적재됨 (`re-enrolling-api-users.md`, p.2)

## Details

### Stage 24 — 5 Authentication Options matrix

`cosigner-callbackhandler-secure-communication-authentication.md` 본문:

| # | 명칭 | Message | TLS | Version | SGX only |
|---|---|---|---|---|---|
| 1 | Public key authentication | JWT (RSA 2048) | HTTPS + trusted CA | all | no |
| 2 | Self-Signed Certificate pinning | JSON | TLS cert pin | all | no |
| 3 | Root-CA Certificate | JSON | TLS Root-CA | **v2025.12.11+** | no |
| 4 | Hybrid — Public key + Cert pinning | JWT | TLS cert pin | **v2025.12.11+** | **★ SGX only** |
| 5 | Hybrid — Public key + Root-CA | JWT | TLS Root-CA | **v2025.12.11+** | **★ SGX only** |

**선택 시 trade-off**:
- Option 1 = 가장 보편적, JWT 양방향 서명 (message-layer security)
- Options 2/3 = TLS-layer 한정 (JSON payload, simpler implementation)
- Options 4/5 = **Hybrid dual-layer** (message + TLS), SGX 한정. H-X1 hypothesis: AWS Nitro Co-signer 의 가용성은 본 source 만으로 단정 불가.

### Stage 24 — Payload / URL convention

- Endpoints (POST): `tx_sign_request` + `config_change_sign_request`
- **`/v2` prefix 분기**:
  - JWT-bearing (1, 4, 5): `https://<base>/v2/tx_sign_request`
  - JSON-bearing (2, 3): `https://<base>/tx_sign_request`
- URL config 시 base URL 만 입력 — `/v2/...` 자동 추가

### Stage 24 — Key Model 비대칭

- **Co-signer 측**: 단일 global private key 가 모든 페어링 API user 의 request 서명 재사용
- **Callback Handler 측**: API user 별 별도 public key 등록, RSA 2048

→ Co-signer 측 global key compromise = blast radius 최대. Callback Handler 측 per-user 격리.

### Stage 24 — Optional default behavior (★ Risk-S16)

Callback Handler 미설정 = Co-signer 자동 sign/approve. 외부 validation 없음 — `vendors/fireblocks/risks.md` §Risk-S16 참조.

### 재등록 트리거 (Callback Handler 측 변경)

`re-enrolling-api-users.md`, p.1–2:

- Callback Handler 설정 변경 (Stage 24: 5 auth options 사이 전환)
- Callback Handler SSL 인증서 변경 또는 만료 (Options 2/3/4/5 의 cert layer)
- 두 경우 모두 **API user 재등록 → Co-signer 재페어링 → Owner의 key share 승인**의 순서 필요

## Related Pages

- [[vendors/fireblocks/cosigner]]
- [[vendors/fireblocks/policy-engine]]
- [[vendors/fireblocks/api]]
- [[entities/fireblocks/callback-handler]]
- [[entities/fireblocks/api-co-signer]]
- [[entities/fireblocks/api-user]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.3
- `2026-05-18__support-fireblocks-io__re-enrolling-api-users.md`, p.1–2
- `sources/fireblocks/webpages/developers/docs/create-api-co-signer-callback-handler.md` (Stage 24 Mode C, setup guide)
- `sources/fireblocks/webpages/developers/reference/cosigner-callbackhandler-secure-communication-authentication.md` (Stage 24 Mode C, 5 options reference)

## Open Questions

- ~~Q-2026-05-18-A04~~ — **ANSWERED (Stage 24)** — 5 named auth options. 적용처: 본 hub §"5 Authentication Options matrix" + [[entities/fireblocks/callback-handler]] §"Authentication Options".
- ~~Q-2026-05-18-C01~~ — **partial advanced (Stage 24)** — payload (JWT vs JSON) + URL convention + key model 비대칭 명세. 잔존: timeout/retry/idempotency.
