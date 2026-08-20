<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/5530525064476-Transaction-lifecycle
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__transaction-lifecycle.pdf
status: full
priority: TIER1
domain: Governance / Workspace-Management / Security-Access
-->

# Transaction lifecycle

*Updated 5 months ago*

## One-line summary

Transaction 의 **정식 state machine** (outgoing 10-state + incoming 9-state flowchart) + **14-step technical schematic** — Stage 8 architecture 와 정합 / 확장. **Policy Engine TAPs**, **Secure Vault (PKI in enclave)**, **Co-Signer Engine**, **Auth Engine + Certificate Store**, **Screening Service** (Chainalysis / Elliptic / Notabene) 등 컴포넌트 다이어그램 공식화. **Zero-trust 아키텍처** 명시. Approval mobile device 의 서명 검증 흐름 + 4 user role (Initiator / Approver / Signer / Third party + API user).

## Key Concepts

### Outgoing Transaction 10-State Flow (p.2-3 flowchart)

```
[Submitted] → [Pending Screening?] → [Pending Authorization] → QUEUED
                                                                 ↓
                                                          PENDING_SIGNATURE
                                                          (Signer reject → CANCELLED)
                                                                 ↓
                                            (Successfully signed by all co-signers)
                                                                 ↓
                          ┌────────────────────────────────────┬─────────────┐
                          ↓                                    ↓             ↓
              PENDING_3RD_PARTY_MANUAL_APPROVAL        PENDING_3RD_PARTY  (3rd party path)
              (3rd party human approval)               (3rd party confirm wait)
                          ↓                                    ↓
                          └────────────────────────────────────┘
                                          ↓
                                    BROADCASTING (Tx ready, not yet sent)
                                          ↓
                                    CONFIRMING (sent, monitoring)
                                          ↓
                                    COMPLETED
```

추가 종착 상태:
- **CANCELLED**: Co-signer 또는 3rd party 가 cancel/reject
- **FAILED**: 어느 단계든 fail 가능 → tx processing 종료

### Incoming Transaction 9-State Flow (p.3 flowchart)

```
Start state 결정:
- AML/KYC enabled → PENDING_AML_SCREENING
- From network connections / exchanges / gas station → BROADCASTING
- AML/KYC disabled → CONFIRMING (즉시 monitor)

PENDING_AML_SCREENING
  ↓ (Rejected by AML/KYC → REJECTED)
  ↓
  ├─ (3rd party manual approval 필요) → PENDING_3RD_PARTY_MANUAL_APPROVAL
  ├─ (3rd party confirm 대기) → PENDING_3RD_PARTY
  ↓
  ├─ (Rejected/cancelled by 3rd party → CANCELLED)
  ↓
CONFIRMING (blockchain monitor)
  ↓
COMPLETED

User-initiated freeze (via API at any point) → REJECTED
Any state can fail → FAILED
```

### 색상 분류 (Console UI)
p.1:
- **Yellow**: Fireblocks ecosystem 내부 처리 중 (Submitted, Pending Screening, Authorization, Queued, Pending Signature)
- **Blue**: Fireblocks 외부 처리 중 (3rd party, blockchain — Pending 3rd Party, Broadcasting, Confirming)
- **Green**: COMPLETED
- **Red**: CANCELLED / FAILED / REJECTED

### 14-Step Transaction System Schematic (★ p.4-5)

```
1. User → API
2. API → JWT 서명된 access token 으로 변환
3. → Fireblocks Developer API Gateway
4. JWT 검증:
   4a. Certificate Store (frontend, user CRT 호스팅) + JWT claims
   4b. Auth Engine (SGX) 가 access token 검증
5. Transaction Manager 가 처리
   5a. Balance Service → Node infrastructure (잔액 부족 → fail)
   5b. (Optional) Screening Service → AML Provider API (Chainalysis / Elliptic / Notabene)
   5c. (Optional) Screening Service → Travel Rule Provider API
6. Balance + AML + Travel Rule pass → Policy Engine 으로 전송
7. Policy Engine (SGX, TAPs) 검증:
   - Auto-approve 또는 explicit approval 요구
   - Native tx type: 상세 제공. Raw Signing / Contract Call: 제한 정보
   - Approvers ← Auth Engine (각 approval 응답은 **mobile device 서명** + Auth Service 검증)
8. 충분한 approvals 수신 → Secure Vault 가 signing 개시
   - "**PKI is built into the enclave of the Policy Engine**"
   - "**All services in Fireblocks core infrastructure operate in a zero-trust configuration. Each service has a derivation of root CA and validates every handoff between services.**"
9. Vault 가 tx request 캐시 → Co-Signer Engine (UUID + Policy rules) 으로 forward
10. Co-Signer Engine → Co-Signer 1/2/3 (각각 SGX enclave 내부에서 key shard 로 검증)
    - "Every SGX service exists in zero-trust configuration, data is not passed between them during signing"
    - Partial signature hash validation 반환
    10a. (Optional) Co-Signer 3 → **Callback Handler** (attached) 에 approval request
11. Co-Signer Engine 이 partial signature hash 를 Auth Engine 으로 검증
12. → Secure Vault → 서명된 tx 생성
13. → Node infrastructure
14. → Blockchain
```

### Architecture 구성 요소 (Stage 8 architecture spine 확장)

p.4 diagram 의 명시적 컴포넌트:

| Component | 위치 | SGX | 역할 |
|---|---|---|---|
| Dev API GW | Fireblocks AWS | - | API gateway, JWT 검증 입구 |
| **Auth Engine** | Fireblocks Azure | **SGX** | Access token 검증, partial signature validation |
| Certificate Store | Fireblocks AWS | - | user CRT 호스팅, JWT signature verification |
| Transaction Manager | Fireblocks AWS | - | tx 처리 orchestration |
| **Balance Service** | Fireblocks AWS | - | Node infrastructure 조회 |
| **Screening Service** | Fireblocks AWS | - | AML + Travel Rule provider 호출 |
| **Policy Engine (TAPs)** | Fireblocks Azure | **SGX** | Policy 검증, approver notify |
| **Secure Vault** | Fireblocks Azure | **SGX** | PKI in enclave, signing 개시, tx caching, signed tx 생성 |
| **Co-Signer Engine** | Fireblocks Azure | **SGX** | Co-signer routing (UUID + Policy) |
| **Co-Signer 1/2/3** | (2 Fireblocks SGX + 1 Customer) | **SGX** | partial signature within enclave |
| **Callback Handler** | Customer On-Prem | - | (Optional) Co-Signer 3 의 외부 approval |
| Node | Fireblocks AWS | - | blockchain broadcast |
| AML providers | 3rd Party | - | **Chainalysis / Elliptic / Notabene** |

→ Stage 8 의 `fireblocks-cloud-architecture.md` 6 component 가 **세부 module 단위로 분해됨**:
- "Core Components" = Auth Engine + Policy Engine + Secure Vault + Co-Signer Engine (모두 SGX)
- "Shell Services" = Dev API GW + Transaction Manager + Balance Service + Screening Service + Certificate Store
- "Trusted Shared Services" = Policy Engine TAPs (transaction approval policy)

### Zero-Trust 아키텍처 (★ 새로 발견)

p.5: "All services in the Fireblocks core infrastructure operate in a **zero-trust configuration**. Each service has a **derivation of root CA** and **validates every handoff between services**."

추가: "Every SGX service exists in a zero-trust configuration, and data is not passed between them during the signing"

→ Stage 8 의 Root Key chain of trust 가 **서비스 간 zero-trust handoff** 까지 적용됨. SGX 서비스끼리도 derived cert 로 매 handoff 검증.

### Transaction Operations by Status (p.2)

가능한 operation (status 의존):
- **Cancel a transaction**
- **Retry a transaction**
- **Boost or drop an EVM transaction**
- **Boost a UTXO transaction**
- **Rescreen or bypass AML policy results**
- **Dismiss a transaction card**

### Special Cases (Raw Signing)

p.4:
- **Raw Signing outgoing**: 일반적으로 Pending Signature → Completed (broadcast 없음, retrieve via API)
- **Cached signature** (동일 raw data 재서명): Submitted → Completed (전체 ceremony 우회)

### User Participation (p.6-7)

| Role | 책임 |
|---|---|
| **Initiator** | "Initiate Transaction" 권한 필요. Console / API 통해 시작 |
| **Approvers** | Policy 가 선정, default = specified number 만족 시 통과, **한 명이라도 reject 시 tx rejected** |
| **Signer** | Policy 가 designated signer 선정, **MPC + SGX + Policy Engine** 다층 보호로 서명 |
| **Third parties** | exchange / fiat provider — 그들의 confirmation 대기 |
| **API user** | Initiator / Approver / Signer 어느 역할이든 가능 + **Freeze Transactions** 권한 있으면 특정 stage 에서 freeze 가능 |

→ Approvers 의 **unanimous-veto rule** (한 명 reject 면 fail) 정식 명시.

### API access surface

p.2:
- `GET /transactions` (history)
- `GET /transactions/{id}` (Fireblocks tx ID)
- `GET /transactions/external_id/{externalTxId}` (external tx ID)
- **Webhook notifications**: 모든 status change 알림
- Status / sub-status 는 **status code** 형식으로 API/webhook 에 노출

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__transaction-lifecycle.pdf` (7 pages).

## Related Pages (cite targets)
- [[vendors/fireblocks/architecture]]
- [[vendors/fireblocks/lifecycle-events]]
- [[vendors/fireblocks/policy-engine]]
- [[vendors/fireblocks/compliance]]
- [[entities/fireblocks/transaction]]
- [[entities/fireblocks/policy]]
- [[entities/fireblocks/cosigner]]
- [[entities/fireblocks/callback-handler]]
- [[entities/fireblocks/api-user]]
- [[entities/fireblocks/user-roles/approver]]
- [[entities/fireblocks/user-roles/signer]]
- [[entities/fireblocks/designated-signer]]
