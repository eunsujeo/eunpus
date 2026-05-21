---
type: entity
vendor: fireblocks
status: stable
tags: [signing, integration, api, identity]
stage_introduced: 1
last_updated_stage: 24
source_count: 5
related:
  - api-key
  - api-user
  - callback-handler
  - cosigner
  - csr
  - lifecycle-events
  - non-signing-admin
  - signer
---
# Entity: API Co-signer (Fireblocks)

> **상태: 부분 정의.** Stage 1에서는 이름만 확인; Stage 4에서 페어링·variant·Callback Handler 결합·재등록 흐름이 추가됨. 내부 cryptographic 명세는 추후 ingest 필요.

## Summary

Fireblocks가 제공하는 자동 서명 컴포넌트. Signer role은 Console+mobile 또는 **API Co-signer와 Callback Handler를 통해 programmatic**하게 동작할 수 있다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.3). API user는 Console에서 페어링 대상 Co-signer를 지정하며, **pairing token은 1시간 유효**, Co-signer는 **Callback Handler 서버의 SSL 공개키를 pin**한다 (`add-api-users.md` p.2; `re-enrolling-api-users.md` p.1–2).

## Key Concepts

- **API Co-signer** — Signer가 programmatic 서명을 수행할 때 사용 (`user-roles.md`, p.3)
- **Fireblocks Communal API Co-signer / Fireblocks Communal Test Co-signer** — **testnet 전용 공유 인프라 확정** (Stage 4, `add-api-users.md`, p.2)
- **SGX Co-signer** — Co-signer setup 시 "First user on this machine" 옵션 존재 (`add-api-users.md`, p.2). TEE/SGX 신뢰 환경 시사
- **Pairing token** — Console에서 복사 후 **1시간 유효** (`re-enrolling-api-users.md`, p.1)
- **SSL public key pinning** — Co-signer가 Callback Handler 서버 인증서의 공개키를 pin (`re-enrolling-api-users.md`, p.2)
- API user는 API Co-signer의 사용자 주체 (`user-roles.md`, p.1)

## Details

### 페어링 흐름 (Add API user 시점)

`add-api-users.md`, p.2:

1. `Add API user` 폼의 *Co-signer setup* 드롭다운에서 대상 선택
2. testnet은 *Fireblocks Communal Test Co-signer* 옵션
3. SGX Co-signer 신규 설치 시 *First user on this machine* 체크
4. Owner + Admin Quorum 승인
5. pairing token으로 Co-signer와 실제 페어링 (1시간 유효)
6. Owner가 Co-signer의 key shares 승인

### Re-enroll trigger

`re-enrolling-api-users.md`, p.1:

- 초기 Co-signer 서버 setup 오류
- 신·기존 Co-signer 인스턴스 페어링
- **Callback Handler 설정 변경** (예: 인증 방식 전환)

### Error 패턴

`re-enrolling-api-users.md`, p.1–2:

- HTTP 500 "Failed to pair device" — pairing token 만료 → fresh token으로 재페어링
- "Failed with error SSL public key does not match pinned public key" — Callback Handler SSL 인증서 변경/만료 → 재등록 + 재페어링 + Owner key share 승인

### API user 삭제 시

API user를 삭제해도 **Co-signer 페어링은 잔존** — unpairing은 별도 작업 (`rename-and-delete-api-users.md`, p.2). 절차는 본 자료에 없음 → Q-A02.

### Stage 24 — Callback Handler Key Model (★ 신규)

`cosigner-callbackhandler-secure-communication-authentication.md` 본문:

- **Co-signer private key (global)**: 해당 Co-signer 에 페어링된 **모든 API user** 의 Callback Handler request 서명에 재사용. 직접 인용: "The same Co-signer private key is used to sign request messages sent to the Callback Handler server for all API users paired with this Co-signer."
- **Callback Handler private key (per-API-user)**: API user 별 별도 — Co-signer 에 public key 등록. RSA 2048 only.

→ 비대칭: Co-signer 측 single global key compromise = blast radius 모든 API user. Callback Handler 측 per-user 격리.

### Stage 24 — Callback Handler Optional (★ 신규 default)

Callback Handler 미설정 = **Co-signer 자동 sign/approve** (default behavior). 외부 validation 없음. → [[vendors/fireblocks/risks]] §Risk-S16.

### 미해결 명세

- timeout / retry / idempotency / 실패 시 트랜잭션 처리 — 본 자료 외 필요 (Q-C01 잔존)
- 내부 cryptographic 메커니즘 (키 share 보관, mutual authentication 형태) — 별도 (Q-A05 ANSWERED Stage 8)

## Related Pages

- [[entities/fireblocks/callback-handler]]
- [[entities/fireblocks/api-user]] · [[entities/fireblocks/api-key]] · [[entities/fireblocks/csr]]
- [[entities/fireblocks/user-roles/signer]]
- [[entities/fireblocks/user-roles/non-signing-admin]]
- [[vendors/fireblocks/cosigner]]
- [[vendors/fireblocks/lifecycle-events]]
- [[entities/fireblocks/cosigner]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1, p.3
- `2026-05-18__support-fireblocks-io__add-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__re-enrolling-api-users.md`, p.1–2
- `2026-05-18__support-fireblocks-io__rename-and-delete-api-users.md`, p.2
- `2026-05-18__support-fireblocks-io__about-the-fireblocks-mobile-app.md`, p.2 (Stage 5: mobile app 대체)

## Mobile app의 대체 옵션 (Stage 5)

`about-the-fireblocks-mobile-app.md`, p.2 (인용):

> "You also have the option to replace the Fireblocks mobile app with an API Co-Signer to automate your approval and signing operations."

→ Mobile app과 API Co-Signer는 같은 역할(승인·서명)의 **두 평면**. 자세한 비교는 [[vendors/fireblocks/cosigner]] §"Mobile app의 대체 옵션".

## Open Questions

- Q-2026-05-18-C01 — API Co-signer + Callback Handler의 통신 흐름·payload·인증·응답 형식
- ~~Q-2026-05-18-C02~~ — **ANSWERED (Stage 4)**: Fireblocks Communal Test Co-signer는 testnet 전용
- Q-2026-05-18-A02 — API user unpair 절차
- Q-2026-05-18-A04 — Callback Handler 인증 방식의 종류
- Q-2026-05-18-A05 — SGX Co-signer와 일반 Co-signer 차이 / "First user on this machine"의 함의
