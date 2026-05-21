---
type: vendor-hub
vendor: fireblocks
status: stable
tags: [signing, integration]
stage_introduced: 4
last_updated_stage: 24
source_count: 7
related:
  - api-co-signer
  - architecture
  - callback-handler
  - cosigner
  - mpc
  - signer
  - user-management
---
# Fireblocks — Cosigner

> 고객 측에서 동작하는 자동 서명·정책 평가 컴포넌트.

## Summary

_TODO: Cosigner의 전체적 역할·배포 형태(API/Mobile/Communal/SGX 등)는 추후 자료로 채운다._

본 자료(`user-roles.md`)에서 확인된 사실:

- **API Co-signer**가 존재하고, Signer가 Console·mobile 대신 programmatic으로 동작할 때 **Callback Handler**와 함께 사용된다 (p.3).
- **Fireblocks Communal API Co-signer**가 별도 명칭으로 등장하며 NSA가 testnet workspace에서 workspace 설정 승인용 API user로 사용한다 (p.3).
- API user가 API Co-signer 기능의 사용자 주체로 명시되어 있다 (p.1).

## Key Concepts

- **API Co-signer** — Signer의 programmatic 서명 경로 (`user-roles.md`, p.3)
- **Fireblocks Communal API Co-signer / Fireblocks Communal Test Co-signer** — **testnet 전용 공유 인프라 확정** (Stage 4, `add-api-users.md`, p.2: "In testnet workspaces, you can select the Fireblocks Communal Test Co-signer to verify functionality")
- **SGX Co-signer** — Co-signer setup 시 "First user on this machine" 옵션이 등장 (`add-api-users.md`, p.2). TEE(SGX) 기반 신뢰 환경 사용을 시사
- **Pairing token** — Console에서 복사 후 **1시간 유효** (`re-enrolling-api-users.md`, p.1)
- **Callback Handler SSL pinning** — Co-signer가 Callback Handler 서버의 SSL 공개키를 pin. 키 미스매치 시 페어링 실패 (`re-enrolling-api-users.md`, p.2)

## Details

- 배포 요구사항, 키 share 보관, 네트워크 흐름, 인증, payload 등 구체 명세는 본 자료에서 다루지 않는다.
- entity 단위 사전 정의는 [[entities/fireblocks/cosigner]] / [[entities/fireblocks/api-co-signer]]를 참고.

### Mobile app의 대체 옵션 (Stage 5)

`about-the-fireblocks-mobile-app.md`, p.2 — Mobile app의 명시적 대체:

> "You also have the option to replace the Fireblocks mobile app with an API Co-Signer to automate your approval and signing operations."

즉 자동화·서드파티 통합 흐름에서 mobile app(사람-기반)과 API Co-Signer(서비스-기반)는 동일 역할(승인·서명)을 수행하는 **두 평면**. 권한 모델·MPC key share 보유 모델은 다름:

| | Mobile app | API Co-Signer |
|---|---|---|
| 주체 | Console user | API user |
| Key share host | 사용자 mobile device secure enclave | Co-signer instance (SGX 가능) |
| 인증 layer | PIN + biometric + passphrase + recovery passphrase | CSR + API key + IP allowlist + Callback Handler |
| 자동화 | (사람 액션 필요) | 가능 |

### API user와의 페어링 흐름 (Stage 4)

`add-api-users.md`, p.2 + `re-enrolling-api-users.md`, p.1:

1. API user 생성 시 Co-signer setup 드롭다운에서 페어링 대상 선택
2. testnet의 경우 Fireblocks Communal Test Co-signer 선택 가능
3. SGX Co-signer 신규 설치 시 "First user on this machine" 체크
4. Owner + Admin Quorum 승인 후 pairing token으로 Co-signer와 페어링 (token 1시간 유효)
5. Owner가 Co-signer의 key shares를 별도로 승인 → 서명 가능

### Re-enroll trigger

`re-enrolling-api-users.md`, p.1:

- 초기 Co-signer 서버 setup 오류
- 신·기존 Co-signer 인스턴스 페어링
- **Callback Handler 설정 변경 (예: 인증 방식 전환)** ← Callback Handler 설정 변경이 재페어링을 요구

### Co-signer 페어링 잔존성

API user 삭제 시에도 **Co-signer 페어링은 그대로 유지**되며 unpairing은 별도 작업 (`rename-and-delete-api-users.md`, p.2) → [[open-questions/fireblocks]] Q-2026-05-18-A02.

## Related Pages

- [[vendors/fireblocks/mpc]]
- [[vendors/fireblocks/architecture]]
- [[vendors/fireblocks/callback-handler]]
- [[vendors/fireblocks/user-management]]
- [[entities/fireblocks/cosigner]]
- [[entities/fireblocks/api-co-signer]]
- [[entities/fireblocks/callback-handler]]
- [[entities/fireblocks/user-roles/signer]]

## Stage 24 — Callback Handler Authentication 통합 framing

Co-signer ↔ Callback Handler 통신은 **두 layer 의 trust**:

| Layer | Source | Mechanism |
|---|---|---|
| **Co-signer 자체 trust** | Stage 8 `authentication-and-authorization.md` | Co-signer Certificate (self-generated) → CSR via Co-Signer Broker → Core Services Intermediate Cert → End cert 배포 |
| **Callback Handler trust** | Stage 24 `cosigner-callbackhandler-secure-communication-authentication.md` | 5 auth options (Public key JWT / Self-Signed Cert pin / Root-CA / 2 Hybrid) |

→ **Stage 8 chain of trust = Co-signer 의 platform identity** (Fireblocks 가 보증), **Stage 24 5 options = Callback Handler ↔ Co-signer 의 customer-side application trust** (customer 가 선택).

**Co-signer version dependency**:
- Options 3, 4, 5 require **Co-signer v2025.12.11+**
- Options 4, 5 are **SGX cosigner only** — H-X1 hypothesis: AWS Nitro Co-signer (Stage 19) 의 Options 4/5 가용성은 본 source 만으로 단정 불가, **`install-api-cosigner-aws` 추가 promote 필요**

**Optional default 위험 (★ Risk-S16)**: Callback Handler 미설정 = Co-signer 자동 sign/approve, 외부 validation 없음. [[vendors/fireblocks/risks]] §Risk-S16 참조.

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1, p.3
- `2026-05-18__support-fireblocks-io__add-api-users.md`, p.2 (Communal Test Co-signer, SGX, First user on this machine)
- `2026-05-18__support-fireblocks-io__re-enrolling-api-users.md`, p.1–2 (pairing token, SSL pinning)
- `2026-05-18__support-fireblocks-io__rename-and-delete-api-users.md`, p.2 (페어링 잔존성)
- `2026-05-18__support-fireblocks-io__about-the-fireblocks-mobile-app.md`, p.2 (Stage 5: mobile app 대체 옵션)
- `sources/fireblocks/webpages/developers/docs/create-api-co-signer-callback-handler.md` (Stage 24: setup guide)
- `sources/fireblocks/webpages/developers/reference/cosigner-callbackhandler-secure-communication-authentication.md` (Stage 24: 5 options reference)

## Open Questions

- ~~Q-2026-05-18-C01~~ — **partial advanced (Stage 24)**: payload format + URL convention + key model 명세 (`cosigner-callbackhandler-secure-communication-authentication.md`). 잔존: timeout/retry/idempotency.
- ~~Q-2026-05-18-C02~~ — **ANSWERED (Stage 4)**: Fireblocks Communal Test Co-signer는 testnet 전용 (`add-api-users.md`, p.2)
- Q-2026-05-18-A02 — API user unpair 별도 작업의 절차
- ~~Q-2026-05-18-A04~~ — **ANSWERED (Stage 24)**: 5 named auth options (Public key / Self-Signed Cert pin / Root-CA / 2 Hybrid). 적용처: [[entities/fireblocks/callback-handler]], [[vendors/fireblocks/callback-handler]].
- ~~Q-2026-05-18-A05~~ — **ANSWERED (Stage 8)**: 일반 Co-signer = SGX baseline. "First user on this machine" = SGX provisioning anchor
