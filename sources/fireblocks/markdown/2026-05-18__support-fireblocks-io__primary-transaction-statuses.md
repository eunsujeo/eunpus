<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/5536566813468-Primary-transaction-statuses
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__primary-transaction-statuses.pdf
status: full
priority: TIER1-light
domain: Governance / Workspace-Management
-->

# Primary transaction statuses

*Updated 6 days ago*

## One-line summary

Transaction state machine 의 **17 primary status 정식 enumeration** + API status code + 운영 시간 제약 (Auth/Signature 2h timeout / Cancelling 30s / Broadcasting 1min typical) + **chain-specific 처리 모델** (Solana 5-tx queue per vault account, EVM 1-tx serial per blockchain-standard) + **dApp Protection 3종** + **incoming Rejected = manual unfreeze 요구**.

## Key Concepts

### 17 Primary Status — API Code 매핑

| # | Console 표시 | API status code | 카테고리 (color) | 비고 |
|---|---|---|---|---|
| 1 | Submitted | `SUBMITTED` | Yellow | outgoing 첫 단계 (AML/KYT screening 미사용 시) |
| 2 | Pending Screening | `PENDING_AML_SCREENING` | Yellow | AML/Travel Rule 결과 대기. tx status ≠ screening status |
| 3 | Pending Security Screening | `PENDING_ENRICHMENT` | Yellow | dApp Protection / 보안 enrichment. 실패해도 fail 안 함 |
| 4 | Pending Authorization | `PENDING_AUTHORIZATION` | Yellow | **2-hour timeout → fail** |
| 5 | Queued | `QUEUED` | Yellow | signer 전송 전 대기 |
| 6 | Pending Signature | `PENDING_SIGNATURE` | Yellow | designated signer 서명 대기. **2-hour timeout → fail** |
| 7 | Pending email approval | `PENDING_3RD_PARTY_MANUAL_APPROVAL` | Blue | exchange 등 3rd party human approval (email) |
| 8 | Processing at the exchange | `PENDING_3RD_PARTY` | Blue | exchange processing — own substatus set |
| 9 | Broadcasting | `BROADCASTING` | Blue | blockchain 송신 중. **1-minute typical** |
| 10 | Confirming | `CONFIRMING` | Blue | blockchain monitor — own substatus set |
| 11 | Completed | `COMPLETED` | Green | **final**, own substatus set, multiple webhook 가능 (deposit confirmation policy 의존) |
| 12 | Signed | `SIGNED` | Yellow | **Solana Sign-Only 전용**, NOT BROADCAST BY FIREBLOCKS tag, 외부 broadcast |
| 13 | Cancelling | `CANCELLING` | Yellow | **30-second typical** |
| 14 | Cancelled | `CANCELLED` | Red | **final**, own substatus set |
| 15 | Blocked by policy | `BLOCKED` | Red | **final**, **Policy rule number 표시** |
| 16 | Rejected | `REJECTED` | Red | "Rejected by AML" 또는 "Manually frozen". **incoming = Admin unfreeze 필요** |
| 17 | Failed | `FAILED` | Red | **final**, 어느 상태에서든 fail 가능, own substatus set |

### Final States (4개)
- `COMPLETED` (성공)
- `CANCELLED` / `BLOCKED` / `FAILED` (실패)
- `REJECTED` 도 사실상 final (단 incoming 의 경우 asset 은 unfreeze 까지 잠금)

### 시간 제약 (★ 운영 spine)

| 제약 | 상태 | 동작 |
|---|---|---|
| **2 hours** | Pending Authorization | timeout → fail |
| **2 hours** | Pending Signature | timeout → fail |
| **30 seconds** | Cancelling (typical) | 길어지면 Status page 확인 |
| **1 minute** | Broadcasting (typical) | 길어지면 Status page 확인 |
| **2 hours** | Solana 6번째 이상 tx Submitted | 만료 → terminated |

### Chain-Specific 처리 모델

p.4:
- **EVM-compatible (Ethereum + Polygon 등)**: **1-tx serial per vault account per blockchain-standard**
  - 동일 vault 에서 Ethereum tx + Polygon tx → 둘 다 EVM 이므로 **순차** 처리
  - 동일 vault 에서 Bitcoin tx + Solana tx → 다른 standard 이므로 **병렬**
- **Solana**: **vault account 당 동시 5 tx queue**
  - 첫 tx broadcast 후 나머지 4개는 Queued 유지 → 순차 처리
  - 6번째 이상은 Submitted 상태로 max 2 hours 대기, 초과 시 terminated

→ Stage 7 의 "Solana 600 queue cap" (vault account 가 아닌 workspace-wide) 와 별도. Per-vault 한도는 **5**, workspace 한도는 600.

### dApp Protection / Pending Security Screening 3 type

p.3: enrichment 가능한 3 종 tx:
1. **Typed messages on any EVM blockchain**: typed message parse + signer 에게 표시
2. **Contract calls on Ethereum**: contract simulation → 영향받는 vault asset + 예상 final value + outgoing/incoming + 예상 fee 를 signer 에 표시
3. **Any transaction initiated by a dApp**: dApp + destination address anomaly scan, 의심스러우면 signer 에 notification (sanctioned destination 포함). **Signer 가 그래도 sign 선택 가능** (advisory)

### Queued Stuck 진단

p.4: tx 가 Queued 에 stuck 이면 다른 tx 가 Pending Signature 인지 확인. 자세한 details 페이지에 누가 approve/sign/reject 해야 하는지 표시.

### Broadcasting / Confirming 의 substatus 평면

- Broadcasting substatus: **API 만 노출**, webhook 미포함
- Confirming substatus: API + webhook 양쪽

### Cancel 가능 / 불가 경계

p.6: **Broadcasting 상태부터는 cancel 불가**. EVM 은 대신 **Replace-By-Fee (RBF)** 로 gas parameter update.

### Resolving Blocked

p.8: Blocked tx 는 violated Policy rule number 표시. 새 rule 을 first-match 원칙에 따라 더 앞 position 에 만들어 우회. (rule ordering = 거버넌스 변경 trigger)

### Signed (Solana Sign-Only) 특수 lifecycle

p.6-7:
- Fireblocks 가 broadcast 안 함 — signed payload 가 client (API caller / Wallet Connect) 에 반환
- **NOT BROADCAST BY FIREBLOCKS** 태그 자동 부착
- Lifecycle 은 계속 monitor — on-chain 감지 시 Completed/Failed 로 transition
- Timeout 내 broadcast 안 되면 자동 invalidate

### Webhook 알림 패턴

p.6: Completed 상태에 대해 multiple webhook 수신 가능 (zero-confirmation deposit policy 의 경우 blockchain appearance + 첫 confirmation + 추가 confirmation 마다)

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__primary-transaction-statuses.pdf` (10 pages).

## Related Pages (cite targets)
- [[entities/fireblocks/transaction]]
- [[entities/fireblocks/policy]]
- [[entities/fireblocks/vault-account]]
- [[vendors/fireblocks/lifecycle-events]]
- [[vendors/fireblocks/policy-engine]]
