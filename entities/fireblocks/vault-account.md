# Entity: Vault Account (Fireblocks)

## Summary

Fireblocks workspace에서 자산을 보유하는 단위. 본 자료에서 확인 가능한 운영 동사는 create / rename / hide / unhide / asset wallet 추가 / vault public key view 등이다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.6–8). 자세한 객체 구조(필드, 식별자, address와의 관계)는 본 자료에 없음.

## Key Concepts (vocabulary)

권한표 *Assets and addresses* 및 인접 항목 (p.6–8):

- **Create vault accounts** — Owner / Admin / NSA / Signer / Approver / Editor
- **Rename vault accounts** — 위와 같으나 Editor 제외
- **Hide or unhide vault accounts**
- **Add asset wallet to a vault account or whitelisted wallet** — NSA·Approver·Editor에 **TL** 라벨 (ALGO/XRP/SOL/XLM 토큰 wallet 불가)
- **Add/whitelist a new destination** (Network/exchange/fiat/internal/external wallets) — `Y (Q)`
- **Add a Fireblocks P2P Network connection** — `Y (Q)` (Owner/Admin/NSA만)
- **Add or approve a new EVM asset** / **non-EVM asset**
- **View or retrieve vault public keys via API** (p.8)

## Details

- Editor 본문에는 "Algorand 토큰 wallet 제외" 표현이 별도 등장 — 표 TL 라벨(4종 모두)과 표현 차이 가능 (p.3, p.5).
- "Create new vault addresses"가 Editor 책임 설명에 등장 — vault account 내부의 address 개념이 별도로 존재함을 시사 (p.3).
- 본 자료는 vault account의 정확한 구조·식별자·exchange/network connection과의 관계 모델을 명세하지 않는다.

## Related Pages

- [[entities/fireblocks/workspace]]
- [[entities/fireblocks/transaction]]
- [[entities/fireblocks/policy]]
- [[entities/fireblocks/user-roles/owner]]
- [[entities/fireblocks/user-roles/editor]]
- [[vendors/fireblocks/architecture]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.3, p.5–8
- `2026-05-18__support-fireblocks-io__minimum-balance.md`, p.1 (Stage 7: chain별 reserve)
- `2026-05-18__support-fireblocks-io__minimum-transaction-amounts.md`, p.1 (Stage 7)
- `2026-05-18__support-fireblocks-io__supported-blockchain-networks.md`, p.1–22 (Stage 7: chain type 분류)

## Chain-별 자산 운영 (Stage 7 cross-ref)

Vault account에 attach되는 asset wallet은 chain별로 운영 제약을 가진다. 자세한 카탈로그·운영 메타는 [[vendors/fireblocks/blockchains]]:

- **Minimum balance** (Base Reserve): chain별 reserve 요구 (ALGO/KSM/NEAR/DOT/XRP/SOL/XLM/TON 등)
- **Minimum transaction amounts**: chain별 최소 송금량 (BTC/BCH/LTC/ALGO/ADA/DOGE/TON 등)
- **Account 활성화**: Stellar(1 XLM 필수), Polkadot(0.01 DOT 이상), Near(token contract pre-funding)
- **Trust line**: XRP의 trust line은 reserve 미만 시 on-chain 자동 삭제
- **Token wallet 제약**: TL 라벨로 ALGO/XRP/SOL/XLM 토큰 wallet 생성 제한 (Stage 1 권한표)
- **Chain type 분류**: EVM account-based / non-EVM account-based / UTXO / Cosmos SDK
- **Internal transactions**: EVM의 일부 chain에서 smart contract 내부 native transfer 알림 지원 ([[entities/fireblocks/transaction]])

## Stage 9 — Asset Wallet / Deposit Address 정식 매핑 (★)

`account-and-wallet-structure.md`, p.1-2:

### Asset Type → Address 패턴 (3 유형)

| Asset 패턴 | 예시 | Permanent Address | Deposit Address 개수 | 분기자 |
|---|---|---|---|---|
| **UTXO-based** | BTC, BCH, LTC, DOGE | 1 | **N** | address 그 자체 |
| **Account-based (no tag)** | ETH, EVM 전반 | - | **1** (단일 강제) | - |
| **Account-based (tag/memo)** | XRP, XLM | - | 1 (on-chain 동일) | **N tags/memos** |

→ **EVM 의 "1 vault account = 1 address" 제약 정식 명시**. End-client 별 unique address 필요 시 individual vault account 필요 → intermediate vault 패턴.

### Vault Account Structure 패턴 (Stage 9 spine)

`vault-structure-best-practices.md`:
- **Omnibus**: 중앙 vault + intermediate vault per client (account-based 의 경우)
- **Segregated**: per-client/team/operation vault account

### Smart Contract 운영 권장 패턴 (`vault-structure-best-practices.md`, p.4)

Smart contract 의 privileged op 별 vault account 분리:
- **Mint** / **Burn** / **Pause** / **Deploy** / **Upgrade** / 기타 privileged call
- Policy rule 로 vault access 제한

### Withdrawal Vault Round-Robin 권장

`account-and-wallet-structure.md`, p.6-7 — chain-specific bottleneck 회피:
- **EVM**: nonce 가 순차 — 단일 vault stuck 시 전체 queue 정체 → 여러 vault round-robin
- **Bitcoin**: unconfirmed input **25 subsequent tx chain limit** (Bitcoin Core default) → 여러 vault round-robin

### Vault account 의 chain-specific 처리 cap

`primary-transaction-statuses.md`, p.4:
- **Solana**: vault account 당 동시 **5 tx queue** (6번째 이상은 Submitted 2h 대기 후 terminated)
- **EVM-compatible (Ethereum + Polygon 등)**: 동일 vault 에서 **1-tx serial per blockchain-standard**

### Whitelisted Address ≠ Vault address

`whitelisting-new-addresses.md`, p.1:
- Whitelisted address = **Vault 외부** deposit address
- 3 type: Internal (workspace 잔액 표시 + billable) / External (표시 안 됨) / Contract/Program

## Sources (추가)
- `2026-05-18__support-fireblocks-io__account-and-wallet-structure.md`, p.1-7 (Stage 9: 3-pattern address mapping + withdrawal vault quirk)
- `2026-05-18__support-fireblocks-io__vault-structure-best-practices.md`, p.4-6 (Stage 9: Smart contract per-op vault)
- `2026-05-18__support-fireblocks-io__primary-transaction-statuses.md`, p.4 (Stage 9: Solana 5-tx cap + EVM serial)
- `2026-05-18__support-fireblocks-io__whitelisting-new-addresses.md`, p.1-2 (Stage 9: Whitelisted address 외부성)

## Open Questions

- Q-2026-05-18-O01 — TL이 ALGO/XRP/SOL/XLM에만 적용되는 이유, 본문 Editor 설명과의 표현 차이
