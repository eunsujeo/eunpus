---
type: entity
vendor: fireblocks
status: stable
tags: [signing, integration, key-link]
stage_introduced: 4
last_updated_stage: 36
source_count: 6
related: [api-co-signer, api-user, callback-handler, cosigner, non-signing-admin, signer]
---
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

## Stage 36 — Fireblocks Agent (Key Link 의 customer-side signing bridge)

`fireblocks-key-link-overview.md`, p.2-3 + `getting-started-with-fireblocks-key-link.md`, p.1-2 (Stage 36 Mode C).

Key Link workspace 의 customer-held key plane 에서 작동하는 **별도 cosigner 변형**. Stage 8 의 API Co-Signer / Mobile Co-Signer / SGX Co-Signer 와 **trust model 자체가 다름** — MPC share 보유 안 함.

### Fireblocks Agent 정체

| 항목 | 명세 |
|---|---|
| **언어** | TypeScript |
| **배포** | **Open-source repository** — 고객이 직접 호스팅 (on-prem) |
| **역할** | (1) Fireblocks SaaS 로부터 새 sign 요청 retrieve, (2) Customer Server 로 relay, (3) 서명 결과 반환 |
| **인증 주체** | **Signer-role API user** (pairing token 으로 페어링) |
| **MPC share 보유** | **없음** (signing 은 HSM 단독) |
| **SGX 요구** | **명시 없음** (Stage 8 의 일반 Co-signer SGX baseline 과 다름) |

### Agent ↔ API User 페어링 절차 (`getting-started-with-fireblocks-key-link.md`, p.2)

1. Fireblocks Agent 설치 (on-prem machine)
2. Agent 실행 → example server 또는 actual Customer Server 연결 → pairing token 입력 prompt
3. Console 에서 **Signer-role API user** 생성
4. **Admin Quorum approval** → pairing token 발급
5. Console 에서 발급된 pairing token 을 Agent prompt 에 입력 → 페어 완료

### Re-enroll (`getting-started-with-fireblocks-key-link.md`, p.2)

`Settings > Users > More Actions > Re-enroll API user` → **Owner approval** 필요 → 새 pairing token 발급.

### Stage 8 cosigner variants 와의 매트릭스 (Stage 36 보강)

| Variant | MPC share | SGX | Auth | Stage |
|---|---|---|---|---|
| Mobile Co-Signer | 1/3 (MPC-CMP) | Secure Enclave | mobile app | 8 |
| API Co-Signer (default) | 1/3 (MPC-CMP) | SGX baseline | API user + Callback Handler | 4-8 |
| Fireblocks Cloud Co-Signer (×2) | 2/3 (MPC-CMP) | Azure SGX (강제) | Core Services chain of trust | 8 |
| Hosted MPC Primary | 1/3 (MPC-CMP) | SGX | API user OR mobile | 8/22 |
| Hosted MPC Guard (×2) | 1/3 each (MPC-CMP) | SGX (강제) | customer-side TLS | 8/29 |
| **Key Link Agent (Stage 36)** | **0 (HSM 단독)** | **불요** | **Signer-role API user + pairing token** | **36** |

→ Fireblocks Agent 는 cosigner 의 *messaging layer only* — 실제 signing 은 Customer Server → HSM 으로 위임. cryptographic 책임이 customer 측 HSM 으로 100% 이동.

## Sources (Stage 36 추가)
- `2026-05-22__support-fireblocks-io__fireblocks-key-link-overview-extracted.txt`, p.2-3 (Stage 36: 4-component architecture, Agent open-source TS)
- `2026-05-22__support-fireblocks-io__getting-started-with-fireblocks-key-link-extracted.txt`, p.1-2 (Stage 36: Agent setup, pairing token, re-enroll)

## Stage 36 — API Co-signer Deployment Matrix (`api-cosigner-installation-flow.md`)

`api-cosigner-installation-flow.md` (Stage 36 Mode C, body via curl) — Stage 8 의 SGX baseline 의 정식 deployment matrix.

### 3-Step Installation Flow

| Step | 행동 |
|---|---|
| **1. 환경 설정** | Co-signer 가 동작할 deployment environment 준비. 네트워크 + 보안 설정 — Co-signer installation/operation 필요 도메인 access 허용 |
| **2. Workspace 에 Co-signer 등록** | Console 또는 API 로 API user 생성 → 그 API user 로 새 Co-signer 등록 |
| **3. 설치 + 페어링** | Co-signer 타입별 installation script 다운로드 실행. Policy 설정: designated signer = API user (paired with Co-signer) — 이 paired API user 가 designated signer 인 Policy rule 에서 자동 서명 |

### 6 Deployment Options (★ Stage 8 SGX baseline 의 cloud 매트릭스)

| Option | TEE / Confidential Compute | Cloud / On-prem |
|---|---|---|
| **Azure SGX** | Intel SGX | Microsoft Azure (★ Fireblocks 의 default cloud, Stage 8 cross-cut) |
| **On-Prem SGX** | Intel SGX | Customer 자체 데이터 센터 |
| **AWS Nitro** | AWS Nitro Enclaves | Amazon Web Services |
| **GCP Confidential Space** | Confidential Computing | Google Cloud Platform |
| **Alibaba Cloud SGX** | Intel SGX | Alibaba Cloud |
| **IBM Cloud SGX** | Intel SGX | IBM Cloud |

→ Stage 8 의 SGX baseline (cosigner = SGX 강제) 가 **Azure SGX 외에 AWS Nitro / GCP Confidential Space 도 baseline 인정**. Confidential compute 기술의 cloud 별 변형이 모두 신뢰 환경의 baseline.

### Hosted MPC + Customer-Side Setup 통합 (Stage 36 cross-cut)

`hosted-mpc-customer-side-setup.md` (Stage 36) 와 결합 시:
- Hosted MPC **최소 3 Co-Signer** 모두 SGX-enabled
- 6 deployment option 중 어느 조합도 가능 (cross-cloud HA 가능)
- "Configuring multiple API Co-Signers in high availability mode" 별도 article (본 wiki 아직 미ingest — KL02 retain)
- Azure Availability Zones (A & B) 가 typical HA 패턴

### Maintenance / Versioning (paired pages)

본 batch 에서 paired 로 ingest 된 page 들:
- `api-cosigner-maintenance.md` / `api-cosigner-maintenance-aws-nitro.md` / `api-cosigner-maintenance-gcp-confspace.md` / `api-cosigner-maintenance-sgx.md`
- `api-cosigner-versions.md` / `api-cosigner-versions-aws.md` / `api-cosigner-versions-gcp.md` / `api-cosigner-versions-sgx.md`
- `api-cosigner-management.md` / `api-cosigner-operate.md` / `api-cosigner-troubleshooting.md`

→ 모두 disk 저장 (`sources/fireblocks/markdown/2026-05-22__developers-fireblocks-com__reference-api-cosigner-*.md`) — Mode B catalog-only, body 미 deep ingest. 사용자가 deployment 진행 시 promote 후보.

## Sources (Stage 36 cosigner 추가)
- `2026-05-22__developers-fireblocks-com__reference-api-cosigner-installation-flow.md`, p.1-2 (Stage 36: 3-step flow, 6 deployment options)
