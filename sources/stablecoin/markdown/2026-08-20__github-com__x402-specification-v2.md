# x402 Specification v2 (공식 스펙)

> source: https://raw.githubusercontent.com/x402-foundation/x402/main/specs/x402-specification-v2.md (x402 Foundation — 현재 정본)
> original_source: https://raw.githubusercontent.com/coinbase/x402/main/specs/x402-specification-v2.md (최초 추출본 — 정본이 Foundation 저장소로 이동, sponsor·SVM 검증 등 최신 정의는 Foundation 기준으로 아래에 보강)
> fetched: 2026-08-20 (WebFetch 추출 — ★ verbatim 아님, 구조화 요약. 필드 정밀 인용 시 원문 재확인)

## Scheme 4종 [보강 2026-08-20, Foundation 정본 스냅샷 7d5363a6 확인 — main 가변, core 서두는 3종만 나열하는 내부 불일치 있음]

- **exact** — 정확한 금액 이체 (이하 상세의 대상)
- **upto** — 최대 금액까지 승인, 실제 청구는 정산 시 사용량으로 확정 (스펙 명시 용례: LLM 토큰 생성 과금·대역폭·동적 컴퓨트)
- **batch-settlement** — 요청 시 암호학적 커밋만 받고 접근 즉시 허용, 정산은 나중 배치 (가스 > 건 가치, 결제 채널·법정화폐 청구 등). 동적 가격 지원 — 상한 커밋 후 실제 청구는 PAYMENT-RESPONSE 로
- **auth-capture** — 최대 금액 승인 후 나중 확정 청구. escrow 2단계 또는 환불 가능한 단발. captureAuthorizer 가 authorize·capture·void·refund·charge 권한 주체. exact 와 달리 void·refund·reclaim 반환 경로 내장

## PaymentRequired 응답 (402 와 함께)

필수: `x402Version: 2` · `resource` (URL·설명·MIME) · `accepts[]`. 선택: `error` · `extensions`.

`accepts[]` 의 PaymentRequirements:

| 필드 | 의미 |
|---|---|
| `scheme` | 결제 스킴 식별자 (예: "exact") |
| `network` | CAIP-2 형식 (예: eip155:84532) |
| `amount` | 원자 단위 토큰 수량 |
| `asset` | 토큰 컨트랙트 주소 또는 ISO 4217 코드 |
| `payTo` | 수취인 지갑 주소 |
| `maxTimeoutSeconds` | 결제 완료 최대 시간 |
| `extra` | 스킴별 추가 정보 (선택) |

## PaymentPayload (`PAYMENT-SIGNATURE` 헤더)

> [정정 2026-08-20] 최초 요약이 v1 헤더(X-PAYMENT)로 잘못 적었음. 공식 v2 HTTP transport = `PAYMENT-REQUIRED`(402 응답) / `PAYMENT-SIGNATURE`(재시도) / `PAYMENT-RESPONSE`(정산 결과). v1 이 `X-PAYMENT` 계열이다 (specs/transports-v2/http.md 확인).

필수: `x402Version: 2` · `accepted` (선택한 PaymentRequirements) · `payload` (스킴별). 선택: `resource` · `extensions`.

## exact 스킴 — EVM (assetTransferMethod 3종)

- [보강 2026-08-20, x402-foundation/x402 의 scheme_exact_evm.md 기준] 자산 이동 방식 3종 — `PaymentRequired.extra` 에 지정이 없으면 클라이언트 기본값은 `eip3009`:
  - **eip3009** (기본) — `transferWithAuthorization` 을 토큰 컨트랙트에서 직접 실행. 아래 상세는 이 방식 기준
  - **Permit2** — EIP-3009 미지원 ERC-20 의 범용 대안 (`permitWitnessTransferFrom` + Proxy). Permit2 컨트랙트에 대한 사전 allowance 필요 (1회 설정) — 마련 경로 3가지: ① 사용자가 직접 온체인 `approve(Permit2)` (본인 가스) ② `erc20ApprovalGasSponsoring` 확장 — facilitator 가 transfer→approve→settle 배치로 가스 대납 ③ `eip2612GasSponsoring` 확장 — 사용자가 EIP-2612 permit 서명
  - **ERC-7710** — delegation 을 지원하는 스마트 계정용 (1회·다회 사용 모두 가능)
- 기본 eip3009: **EIP-3009 (Transfer with Authorization)** 기반 — 가스리스 ERC-20 전송
- `payload` = EIP-712 `signature` + `authorization` 객체:
  - `from` (결제자) · `to` (수취인) · `value` (원자 단위)
  - `validAfter` / `validBefore` (유효 시간 창, Unix)
  - `nonce` (32바이트 랜덤 — 재생 공격 방지)
- 검증 6단계: ① EIP-712 서명 ② 결제자 잔액 ③ 금액 **정확히 일치** ④ 시간 창 ⑤ 파라미터 매칭 ⑥ 트랜잭션 시뮬레이션

## exact 스킴 — Solana (SVM)

- [보강 2026-08-20, x402-foundation/x402 의 scheme_exact_svm.md 기준] 서명 모델이 EVM 과 다르다: `extra.feePayer` 가 수수료 부담자인 **Sponsor** 의 공개키 — Sponsor 는 "merchant 자체 또는 제3자 facilitator" (MAY, 빈도 규정 없음). **클라이언트가 결제를 담은 온체인 트랜잭션을 구성해 부분 서명**(feePayer 서명 미포함) → Base64 로 PaymentPayload 에 실어 전송 → **Sponsor 가 feePayer 서명을 더해 완성본을 제출**
- 전송은 top-level `TransferChecked` 또는 다른 프로그램의 CPI 내부 명령이어도 된다 — 스마트 월렛 허용의 근거 (결제 결과가 기준)
- 검증 2경로: 표준 월렛 = 정적 명령어 레이아웃 fast path (3~7 명령) / 스마트 월렛 = 시뮬레이션 기반 (프로그램 allowlist 전제)
- Compute Unit 상한 설정, 목적지 ATA (Associated Token Account) 검증. 초과 지불은 허용, 부족은 거절

## Facilitator 인터페이스 (HTTP REST)

| 엔드포인트 | 역할 | 응답 |
|---|---|---|
| `POST /verify` | 온체인 실행 없이 검증만 | `{isValid, payer}` 또는 `{isValid:false, invalidReason, payer}` |
| `POST /settle` | scheme 별 정산 — exact·upto 는 트랜잭션 실행, batch-settlement 는 커밋 저장 (가치 이전은 후속 redemption) | `{success, transaction, network, payer}` 또는 `{success:false, errorReason, …}` |
| `GET /supported` | 지원 스킴/네트워크·확장·서명자 주소 | — |

## 에러 코드 (대표)

`insufficient_funds` · `invalid_exact_evm_payload_authorization_valid_after` / `_valid_before` (시간 창 위반) · `_value_mismatch` (금액 불일치) · `_signature` (서명 무효) · `_recipient_mismatch` · `invalid_network` · `invalid_scheme` / `unsupported_scheme` · `invalid_x402_version`

## v1 → v2 변경점

- 네트워크 식별자 CAIP-2 형식 도입
- PaymentPayload·PaymentRequired 재구조화, ResourceInfo 분리
- Extensions (프로토콜 확장) 지원
