# Entity: Cosigner (Fireblocks)

> **상태: 부분 정의.** 본 자료에서는 명칭과 사용 맥락만 확인됨. 구체 명세는 추후 ingest 필요.

## Summary

Fireblocks의 자동 서명 컴포넌트군. 본 자료에서는 **API Co-signer**와 **Fireblocks Communal API Co-signer** 두 명칭이 확인된다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.1, p.3). Mobile Co-signer 등 다른 형태에 대한 언급은 본 자료에 없다.

## Key Concepts

- **API Co-signer** — Signer가 programmatic 서명 시 사용 (`user-roles.md`, p.3), API user가 사용자 주체 (`user-roles.md`, p.1)
- **Fireblocks Communal API Co-signer / Communal Test Co-signer** — **testnet 전용 공유 인프라 확정** (Stage 4, `add-api-users.md`, p.2)
- **SGX Co-signer** — TEE/SGX 기반 신뢰 환경. "First user on this machine" 옵션 (`add-api-users.md`, p.2)
- **Pairing token 1시간 유효**, **Callback Handler SSL pinning** (`re-enrolling-api-users.md`, p.1–2)

## Details

본 자료에서 확인된 사실:

- "API users are also used in the API Co-signer feature." (p.1)
- Signer 설명: "operate via the Fireblocks Console and mobile app, or programmatically via an API Co-signer and Callback Handler." (p.3)
- NSA 설명: "Used as an API user for approving workspace configurations on mainnet Co-signers or on testnet workspaces using the Fireblocks Communal API Co-signer" (p.3)

키 share 위치, 배포 형태, 인증, payload, Callback Handler와의 통신 흐름 등은 본 자료에서 다루지 않는다.

## Related Pages

- [[entities/fireblocks/api-co-signer]]
- [[entities/fireblocks/callback-handler]]
- [[entities/fireblocks/api-user]]
- [[entities/fireblocks/user-roles/signer]]
- [[entities/fireblocks/user-roles/non-signing-admin]]
- [[vendors/fireblocks/cosigner]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1, p.3
- `2026-05-18__support-fireblocks-io__add-api-users.md`, p.2 (Communal Test Co-signer, SGX)
- `2026-05-18__support-fireblocks-io__re-enrolling-api-users.md`, p.1–2 (pairing token, SSL pinning)
- `2026-05-18__support-fireblocks-io__rename-and-delete-api-users.md`, p.2 (페어링 잔존성)

## Stage 8 — Co-Signer Architecture 정식 명세

### Chain of Trust (`authentication-and-authorization.md`, p.3)
```
Co-Signer Certificate (self-generated)
       ↓ (CSR via Co-Signer Broker)
Core Services Intermediate Certificate (built into image)
       ↓ (sign)
Co-Signer End Certificate (배포)
```
- Co-signer 가 자체 priv/pub key pair 생성, **Configuration Database** 에 private 보관
- CSR → Core Services 가 **intermediate cert 로 서명** → end cert 발급
- End cert 는 Co-Signer Broker 통해 모든 co-signer 에 배포

### SGX 환경 (`intel-sgx-secure-environments.md`, Q-A05 ANSWERED)

- Fireblocks 의 cloud co-signer 는 **SGX enclave 안에서 실행** — minimum 3-5 machines, 각각 **segregated network**
- "Keys cannot be extracted even if malware or hacker has control over the server's operating system"
- "**Information cannot be retrieved by hackers, inside colluders, or even Fireblocks employees.**"

→ **일반 Co-signer = SGX 강제**. 별도 plane 이 아니라 SGX 가 baseline.

### Two-Tier Co-Signer Model (`mpc-cmp.md`, p.5-6)

| Tier | 정체 | Key share | 정책 |
|---|---|---|---|
| **Customer Co-Signer** | Mobile device (Keychain/TEE) **또는** SGX server | 1/3 | Customer 측 |
| **Fireblocks Co-Signers (2개)** | Azure SGX server | 2/3 | "**Safeguards in case keys owned by customers are compromised**" — tx amount threshold, destination address integrity |

→ "**None of the parties (neither Fireblocks nor the customer) can sign a transaction alone.**"

### Communication (`mpc-cmp.md`, p.5)

- **Co-Signer Broker** 가 MPC 메시지 + end cert 를 broadcast
- 각 co-signer 가 메시지를 end cert + chain of trust 로 검증
- **Aggregator** 가 partial signature 들을 full signature 로 결합 → Blockchain

### Hosted MPC Variant (`hosted-mpc-overview.md`)

- **Primary Co-Signer** (1 share): 두 deployment 옵션
  - (a) Mobile device + Fireblocks mobile app — user-facing, biometric/Yubikey 인증
  - (b) SGX machine + API Co-Signer — automation-friendly, customer infrastructure 통합
- **Guard Co-Signer** (각 1 share, 총 2 shares): **SGX machine 한정** (Mobile 옵션 없음)
- 모두 customer 호스팅 → Fireblocks key share 0개 (sovereign key management plane)

→ Primary 의 두 옵션 선택은 **automation 요건 vs user-in-loop 요건** 의 trade-off. Mobile Primary = high-friction approval / API Co-Signer Primary = automation 가능. Guard 는 항상 SGX machine (signing ceremony 의 backbone).

### BCM Co-Signer Cluster (`business-continuity-module-bcm.md`)
- BCM 환경에서는 별도 versioned Co-Signer Cluster + API Co-Signer + Guard Co-Signer 가 customer 측에 배포
- Cloud Aggregator 기능이 customer-side **On-Prem MPC Aggregator** 로 대체됨

## Sources (추가)
- `2026-05-18__support-fireblocks-io__authentication-and-authorization.md`, p.3 (Stage 8: Chain of trust, CSR flow)
- `2026-05-18__support-fireblocks-io__intel-sgx-secure-environments.md`, p.1 (Stage 8: SGX 3-5 machines, segregated network)
- `2026-05-18__support-fireblocks-io__mpc-cmp.md`, p.5-6 (Stage 8: 3-endpoint signing, Co-Signer Broker, Aggregator)
- `2026-05-18__support-fireblocks-io__hosted-mpc-overview.md`, p.1 (Stage 8: Primary + Guard)
- `2026-05-18__support-fireblocks-io__business-continuity-module-bcm.md`, p.1-2 (Stage 8: BCM Co-Signer Cluster)

## Open Questions

- ~~Q-2026-05-18-C01~~ — **부분 ANSWERED (Stage 8)**: chain of trust + CSR flow 명세. Callback Handler payload 의 세부는 여전히 미명세
- ~~Q-2026-05-18-C02~~ — **ANSWERED (Stage 4)**: Communal Test Co-signer는 testnet 전용
- Q-2026-05-18-A02 — API user unpair 별도 작업 절차
- ~~Q-2026-05-18-A05~~ — **ANSWERED (Stage 8)**: 일반 Co-signer = SGX 강제. SGX 가 baseline
