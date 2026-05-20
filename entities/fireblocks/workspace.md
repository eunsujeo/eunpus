# Entity: Workspace (Fireblocks)

## Summary

Fireblocks의 최상위 격리·거버넌스 단위. 모든 사용자·role·Policy·MPC 자원이 workspace 단위로 관리된다. **모든 workspace는 정확히 1명의 Owner를 가지며 Owner가 Vault를 셋업**한다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.1). Workspace 종류는 hot / cold / Sandbox 세 가지가 본 자료에서 확인된다 (p.1, p.8).

## Key Concepts

- **Owner 1명 unique** — "Every workspace requires one (and only one) Owner to set up the Vault" (p.1)
- **Workspace 종류**
  - **Hot workspace** — 본 자료가 다루는 기본 종류 (p.1)
  - **Cold workspace** — 별도 article에서 다루며 본 자료에서 범위 밖 (p.1)
  - **Sandbox workspace (Developer Sandbox)** — 무료, 자동 승인, 3 role만, backend가 Owner role 수행 (p.8) → [[entities/fireblocks/sandbox-workspace]]
- **Workspace 단위 작업**
  - Freeze the workspace (Owner/Admin/NSA/Security Admin) (p.8)
  - Approve workspace policies, Policy changes — `Y (Q+O)` (p.7)
  - Change Admin Quorum — `Y (Q+O)` (p.7)
  - AML, Travel Rule connections·policies 추가·수정 (p.7–8)

## Details

- Workspace는 user role을 통해 Console·API 권한을 통제하며, 일부 권한은 Admin Quorum 또는 Approval group 흐름을 거친다 (p.1, p.5).
- "Looking for Cold Wallet user roles?" 안내가 본문에 있어 cold/hot이 명시적으로 별도 모델임을 알 수 있다 (p.1).
- Sandbox는 mainnet/testnet과 별도의 role 모델을 가진다 (p.8) — Sandbox NSA가 mainnet/testnet NSA에 없는 추가 능력(서명 포함)을 갖는다.

## Related Pages

- [[entities/fireblocks/user-roles/owner]]
- [[entities/fireblocks/admin-quorum]]
- [[entities/fireblocks/policy]]
- [[entities/fireblocks/sandbox-workspace]]
- [[entities/fireblocks/vault-account]]
- [[vendors/fireblocks/user-management]]
- [[vendors/fireblocks/overview]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1, p.7–8
- `2026-05-18__support-fireblocks-io__freeze-workspace.md`, p.1 (Stage 6: Emergency Freeze 모델 확정)
- `2026-05-18__support-fireblocks-io__node-router.md`, p.3 (Stage 7: tenant 단위 Node Router)

## Freeze 모델 (Stage 6 확정)

`freeze-workspace.md`, p.1 + Stage 1 권한표 (`user-roles.md`, p.8 *Freeze the workspace*):

### Actor

**Admin-level 4 role** (Owner / Admin / Non-Signing Admin / Security Admin) — 본문 명시. 권한표와 정합.

### Freeze 효과

- **모든 user role이 Viewer로 강제 변경 (Owner 포함)**
- 차단: transfer 발행 / address whitelisting / 새 fiat·exchange / P2P Network connection
- **Incoming transfer는 계속 수신** — 자동 완료 vs Pending 처리는 미명세 (Q-O05)

### 절차

- Freeze: `Settings > General > Freeze workspace > Freeze workspace`
- Unfreeze: **Owner만, Fireblocks Support 경유 필수** (Console 불가)

### Owner identity 절차 패턴과의 정합

Stage 3에서 확립된 "모든 Owner-touching critical 작업은 Support 영상 통화 신원 확인 경유" 패턴에 정합. Workspace unfreeze는 Owner identity 인프라에 의존.

자세한 lifecycle 절차는 [[vendors/fireblocks/lifecycle-events]] §"Emergency Workspace Freeze".

## Node Router는 tenant(workspace) 단위 (Stage 7 cross-ref)

`node-router.md`, p.3 — Node Router의 static dedicated route는 "tenant"(= workspace) 단위로 적용:

> "Only a single node can be provided in the Static Dedicated Route case. This node will be used for all vaults related to the tenant."

→ 한 workspace의 모든 vault account는 동일한 customer-provided node로 라우팅. Multi-tenant 운영 시 workspace별 별도 node 가능. 자세한 내용은 [[vendors/fireblocks/blockchains]] §"Node Router".

## Stage 9 — Workspace Hierarchy + Type 정식 명세 (Q-W01 부분 응답)

### 5-Level 계층 (`account-and-wallet-structure.md`, p.1)

```
Customer Domain (logical group, top)
  └── Workspace (Hot/Cold, Mainnet/Testnet)
        └── Vault Account
              └── Asset Wallet (1 per asset type per vault account)
                    └── Deposit Address
```

### Workspace Type 매트릭스

`account-and-wallet-structure.md`, p.2:

| 축1 (Storage) | 축2 (Network) |
|---|---|
| **Hot workspace** — online 운영 | **Mainnet** — staging + production, Mainnet node 만 연결 |
| **Cold workspace** — offline storage (별도 product 구매) | **Testnet** — sandbox + development, Testnet node 만 연결 |

→ **Mainnet/Testnet 은 node-level 분리** (cross-network 없음).
→ **Hot/Cold** 와 **Omnibus/Segregated** 는 직교 — 두 vault 구조는 단일 workspace 공존 가능.
→ Sandbox = Testnet workspace 의 한 use case 분류.

### Default Vault Visibility (★)

`vault-structure-best-practices.md`, p.6:
> "By default, all users in the workspace have visibility to **all of the Vault accounts in the workspace**."

→ workspace 가 권한 분리의 **최소 단위**. Vault account level 의 user-별 visibility 제한은 self-service 불가, **별도 workspace 분리** 또는 API custom UI 필요.

### Multi-Workspace 필요 6 trigger (`vault-structure-best-practices.md`, p.5-6)

1. 독립 client set / policy
2. End client/investor 에 workspace access 제공
3. Employee viewing privilege 차등
4. **다른 configuration** (AML default, DeFi approval cap, Raw Signing 허용)
5. 별도 **geographical location**
6. Cold Wallet 분리

### High-Value Tokenization 권장 (>$10M, 3-workspace)

`vault-structure-best-practices.md`, p.5:
1. **Administrative workspace** — smart contract deploy/upgrade
2. **Operational workspace** — minting/burning
3. **Custodial workspace** — custody

→ workspace 가 자산 lifecycle 의 책임 영역 분리까지 활용.

### Vault Structure 2 패턴 (단일 workspace 공존)

- **Segregated**: per-client/team/operation vault, blockchain = single source of truth
- **Sweep-to-Omnibus**: Intermediate → Sweeping → Deposit Omnibus → Withdrawal Pool → External

### Treasury / Withdrawal / Gas Station Vault 권장

- Treasury = 가장 restrictive policy
- Withdrawal vault 분산 = chain quirk 회피 (EVM nonce / BTC 25-tx)
- Gas Station vault = `balance < gasThreshold && new token transferred` 시 자동 base asset 충당

## Sources (추가)
- `2026-05-18__support-fireblocks-io__account-and-wallet-structure.md`, p.1-2 (Stage 9: 5-level hierarchy + Hot/Cold + Mainnet/Testnet)
- `2026-05-18__support-fireblocks-io__vault-structure-best-practices.md`, p.1-6 (Stage 9: vault structure patterns + multi-workspace triggers + default visibility)

## Open Questions

- ~~Q-2026-05-18-W01~~ — **ANSWERED (Stage 9)**: Hot/Cold 직교 + Mainnet/Testnet node-level 분리 명세. Sandbox 는 Testnet workspace 의 use case
- Q-2026-05-18-O05 — Workspace freeze 시 incoming transfer 자동 완료 vs Pending
