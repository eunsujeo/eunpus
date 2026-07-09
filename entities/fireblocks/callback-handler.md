---
type: entity
vendor: fireblocks
status: stable
tags: [signing, integration]
stage_introduced: 1
last_updated_stage: 152
source_count: 5
related: [api-co-signer, api-user, callback-handler, cosigner, transaction]
---
# Entity: Callback Handler (Fireblocks)

> **상태: Stage 24 명세 확보.** Stage 1 name → Stage 4 SSL pinning / re-enroll → **Stage 24: 5 auth options + payload format + key model 명세 (Q-A04 ANSWERED, Q-C01 substantial advance)**. timeout/retry/idempotency 만 잔존.

## Summary

Co-signer의 자동 서명 흐름에 끼워 넣는 외부 검증 endpoint. Signer가 programmatic 서명 시 API Co-signer와 **함께** 사용된다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.3). Co-signer는 **Callback Handler 서버의 SSL 공개키를 pin**한다 (`re-enrolling-api-users.md`, p.2).

## Key Concepts

- Signer programmatic 동작의 한 축 — "via an API Co-signer and Callback Handler" (`user-roles.md`, p.3)
- **SSL public key pinning** — Co-signer가 Callback Handler의 SSL 공개키를 고정 신뢰. 키 변경/만료 시 페어링 실패 (`re-enrolling-api-users.md`, p.2)
- **인증 방식(authentication method)** 옵션이 존재. 변경 시 API user **재등록(re-enroll)** 필요 (`re-enrolling-api-users.md`, p.1)
- 요청 페이로드·응답 포맷(APPROVE/REJECT 등)은 본 자료에 없음 → Q-C01

## Details

### 페어링 시점

API user를 Co-signer와 페어링할 때 Callback Handler 인증서가 Co-signer 측으로 적재된다. 인증서가 바뀌면 재페어링 + Owner의 key share 승인이 필요 (`re-enrolling-api-users.md`, p.2).

### Re-enroll 요구 케이스

`re-enrolling-api-users.md`, p.1–2:

- Callback Handler **인증 방식 전환** ("switching the authentication method")
- Callback Handler **SSL 인증서 변경 또는 만료**

→ 둘 다 API user 재등록 → Co-signer 재페어링 → Owner의 key share 승인 흐름을 거친다.

### Stage 24 — Optional 성격 (★ 신규 운영 신호)

`create-api-co-signer-callback-handler.md` 직접 인용:
> "If a Callback Handler is not configured for an API user, the Co-signer will automatically sign or approve all requests it receives for that API user."

→ **Callback Handler 미설정 = Co-signer 자동 승인/서명 default**. 외부 validation 없이 자동 sign. 보안 의미: API user 가 production 에서 Callback Handler 없이 동작 가능 — 외부 business logic / compliance 검증 bypass. **Risk-S16 등재** (vendors/fireblocks/risks.md).

### Stage 24 — Authentication Options (★ Q-A04 ANSWERED)

`cosigner-callbackhandler-secure-communication-authentication.md` 본문:

| # | 명칭 | Message | TLS | Version | SGX only |
|---|---|---|---|---|---|
| **1** | **Public key authentication** | JWT (RSA 2048, 양방향 서명) | HTTPS + trusted CA (prod) | all | no |
| **2** | **Self-Signed Certificate pinning** | **JSON** (no JWT) | TLS cert pin (self-signed or CA) | all | no |
| **3** | **Root-CA Certificate** | **JSON** (no JWT) | TLS Root-CA validation | **v2025.12.11+** | no |
| **4** | **Hybrid — Public key + Cert pinning** | JWT | TLS cert pin | **v2025.12.11+** | **★ SGX only** |
| **5** | **Hybrid — Public key + Root-CA** | JWT | TLS Root-CA | **v2025.12.11+** | **★ SGX only** |

**Hybrid options (4/5)** = message-layer (JWT 서명) + TLS-layer (cert) **dual security**. SGX cosigner 한정.

### Stage 24 — Payload / URL Convention (★ Q-C01 substantial advance)

- **Endpoints**: `tx_sign_request` + `config_change_sign_request` (Co-signer → Callback Handler POST)
- **`/v2` URL prefix 분기** (auth option 별):
  - JWT-bearing (1, 4, 5): `https://<base>/v2/tx_sign_request`
  - JSON-bearing (2, 3): `https://<base>/tx_sign_request` (no `/v2` prefix)
- URL setting 시 base URL + custom relative path 만 입력 — `/v2/...` 는 자동 추가
- Production = HTTPS w/ trusted CA cert 강제 권장 / dev = HTTP 허용

### Stage 24 — Key Model 비대칭 (★ 신규 architectural 신호)

| 키 | 범위 | 비고 |
|---|---|---|
| **Co-signer private key** | **global** — 해당 Co-signer 에 페어링된 **모든 API user** 의 request 서명에 재사용 | 직접 인용: "The same Co-signer private key is used to sign request messages sent to the Callback Handler server for all API users paired with this Co-signer." |
| **Callback Handler private key** | **per-API-user** — API user 별 별도 public key 를 Co-signer 에 등록 | RSA 2048 only (response auth) |

→ Co-signer 측 single global key compromise = 모든 API user 의 request 서명 위조 가능. Callback Handler 측 key 는 per-user 격리.

### Stage 152 — 승인 단계 제약: rawTx 없음 · boost 연결 불가 (CSM 확답)

`sources/fireblocks/csm2_boost.txt` (Fireblocks CSM · Kakao PoC):

- **`rawTx` 는 서명 단계에만** 온다 — 승인 단계는 **직렬화(serialize) 이전**이라서다. 승인(특히 수동)은 오래 걸릴 수 있고 그 사이 on-chain fee 가 바뀌므로, Fireblocks 는 **승인 완료 후에야 직렬화**한다. 그래서 승인 콜백엔 rawTx 가 없다.
- **승인 콜백은 boost/drop 을 원본과 연결할 식별자를 주지 않는다** — `replaceTxByHash`·원 txId·nonce 가 승인 payload 에 없어, **approver-only 주체는 이 요청이 기존 tx 의 boost/drop 인지 결정적으로 판별 불가**. (signer 는 rawTx 의 nonce 로 유추 가능하나 approver 는 rawTx 가 없다.)
- **RETRY 우회** — 콜백은 cosigner 에 **RETRY 를 최대 20회·~3분 간격(총 ~1시간)** 반환할 수 있다. 그 창 동안 서버측 수동 승인 로직을 돌리는 용도. 단 **두 주체 co-approval(예: JV+은행) 모델엔 부적합** — [[open-questions/fireblocks]] Q-2026-07-09-C02.
- **현행 연결책** — `replacedTxHash` 는 콜백엔 없지만 "Get Transaction by Fireblocks ID" 로 조회하면 **boost·drop 공통으로 이전 tx id** 를 준다 → 이걸로 원본 연결. 콜백 payload 에 `replaceTxByHash` 포함은 **feature request open**. (internal note 는 고객이 설정 가능 → 침해 시 신뢰 불가라 연결 근거로 부적합.)

### 잔존 미명세 (본 자료 외 필요)

- timeout / idempotency (**RETRY 응답은 Stage 152 확인** — 최대 20회·~3분·~1h; APPROVE/REJECT·RETRY 외 IGNORE 등 나머지 semantics 는 잔존)
- 5 options 별 SLA 차이 (특히 Hybrid 의 latency)

## Related Pages

- [[vendors/fireblocks/callback-handler]]
- [[entities/fireblocks/api-co-signer]]
- [[entities/fireblocks/cosigner]]
- [[entities/fireblocks/api-user]]
- [[entities/fireblocks/transaction]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.3
- `2026-05-18__support-fireblocks-io__re-enrolling-api-users.md`, p.1–2
- `sources/fireblocks/webpages/developers/docs/create-api-co-signer-callback-handler.md` (Stage 24 Mode C, 47 lines)
- `sources/fireblocks/webpages/developers/reference/cosigner-callbackhandler-secure-communication-authentication.md` (Stage 24 Mode C, 185 lines)
- `sources/fireblocks/csm2_boost.txt` (Stage 152) — 승인 단계 rawTx 부재·boost/drop 연결 불가·RETRY(20회·~3분·~1h)·replacedTxHash 연결책 (Fireblocks CSM · Kakao PoC)

## Open Questions

- ~~Q-2026-05-18-A04~~ — **ANSWERED (Stage 24)**: 5 named auth options (Public key / Self-Signed Cert pin / Root-CA / 2 Hybrid). 적용처: 본 entity §"Authentication Options".
- ~~Q-2026-05-18-C01~~ — **partial advanced (Stage 24·152)**: payload format (JWT vs JSON) + URL convention (/v2 prefix) + key model 비대칭 + **RETRY(최대 20회·~3분·~1h, Stage 152)** 명세. 잔존: timeout/idempotency·IGNORE 등 나머지 응답 semantics.
- **Q-2026-07-09-C02** (신규, Stage 152) — 승인 단계에서 boost/drop 을 원본과 결정적으로 연결(이중 주체 zero-trust). 중앙 등록: [[open-questions/fireblocks]]. 현행 우회 = "Get Transaction by ID" 의 `replacedTxHash`.
