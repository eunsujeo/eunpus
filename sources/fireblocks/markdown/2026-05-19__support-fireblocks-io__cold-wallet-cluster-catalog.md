<!--
status: cluster-catalog (Stage 14, v3.1/3.2.1)
priority: TIER1 (catalog index)
domain: Workspace-Management + Security-Access + Mobile-Recovery (5 priority domain 3중 직격)
-->

# Cluster: Cold Wallet (15 PDFs)

**CLUSTER CATALOG (Stage 14, v3.1/3.2.1)** — PDF 본문 미로드. 15 PDF 의 catalog + 5-priority-domain cross-cut mapping.

## Why TIER 1 Cluster
**5 priority domain 3중 직격**:
- **Workspace Management**: Cold Wallet = separate workspace type (Stage 9 의 Mainnet/Testnet 와 직교)
- **Security-Access**: Stage 10 Admin Quorum 의 "Cold Wallet workspace 특수 규칙" + Stage 10 Approval Group "Cold Wallet 미지원" + Stage 9 Vault Structure BP 의 "Cold Wallet 별도 workspace 구매" 보강
- **Mobile-Recovery**: Cold Wallet device key share backup (Mobile 의 cloud backup model 과 비교)

## Catalog (15 files)

### TIER 1 후보 (Meta hubs — 별도 lightweight index 작성)

| File | Tier | Cross-cut |
|---|---|---|
| `about-fireblocks-cold-wallet.pdf` | **1** | Cold Wallet meta hub |
| `cold-wallet-security-and-operational-best-practices.pdf` | **1** | Cold Wallet 운영 BP — Stage 10 의 8 Risk-G 와 cross-cut |
| `user-roles-for-cold-wallet-workspaces.pdf` | **1** | **Stage 1 의 9-role 와 비교 가능** — Cold Wallet 의 role pyramid 가 hot 과 어떻게 다른가? Q-G04 (Security Admin 멤버십) cross-cut |
| `cold-wallet-mobile-key-share-backup-and-recovery.pdf` | **1** | **Mobile-DR + Cold Wallet 교차점** — Cold Wallet 의 key share 가 mobile 에 있는지, 별도 device 인지 |

### TIER 2 후보 (placeholder markdown, 검색성)

**Setup / Prerequisites**:
- `prerequisites-for-fireblocks-cold-wallet.pdf`
- `cold-wallet-device-requirements.pdf` — device 사양 (별도 device? mobile?)
- `cold-wallet-enhanced-console-experience.pdf` — UI 차이

**Workspace Ops** (Stage 10 Admin Quorum "Cold Wallet 특수 규칙" 보강):
- `adding-users-to-a-cold-wallet-workspace.pdf` — Stage 10 의 "Support 경유 필수" 본문
- `adding-api-keys-to-a-cold-wallet-workspace.pdf`
- `deleting-a-user-from-a-cold-wallet-workspace.pdf` — Stage 10 의 "outstanding cancel + new submit"

**Device + Key Share**:
- `cold-wallet-workspace-key-backup.pdf` — Workspace Keys Backup 의 Cold Wallet variant
- `provisioning-an-owners-cold-wallet-device.pdf` — Owner setup
- `provisioning-a-signers-cold-wallet-device.pdf` — Signer setup
- `signing-transactions-with-your-cold-wallet-device.pdf` — Stage 8 의 3-share signing 의 Cold variant

**Integration**:
- `connecting-cold-wallet-with-hot-workspaces-via-p2p.pdf` — Cold ↔ Hot rebalancing path (Stage 9 Vault Structure BP 의 "Cold Wallet 별도 workspace + rebalancing")

## Cross-Cut Mapping

### Workspace Management spine

| File | 보강 대상 |
|---|---|
| About Fireblocks Cold Wallet | [[entities/fireblocks/workspace]] §"Cold workspace type" — Stage 9 Q-W01 응답 보강 |
| Prerequisites + Device Requirements | [[entities/fireblocks/workspace]] §"Cold setup constraints" |
| Adding/Deleting users + API keys | [[entities/fireblocks/workspace]] §"Cold Wallet 특수 규칙" |
| Workspace key backup | [[entities/fireblocks/workspace-keys-backup]] §"Cold variant" |
| Connecting Cold with hot via P2P | [[entities/fireblocks/workspace]] §"Hot ↔ Cold rebalancing" |

### Security-Access spine

| File | 보강 대상 |
|---|---|
| Cold Wallet Security & Operational BP | [[vendors/fireblocks/security]] / [[vendors/fireblocks/risks]] Risk-G07 (Cold Wallet approval group 미지원) |
| User roles for Cold Wallet workspaces | [[entities/fireblocks/admin-quorum]] §"Cold Wallet workspace 특수 규칙" (Stage 10), role 9개 중 Cold Wallet 적용 가능 role 명세 |
| Adding/Deleting users | [[entities/fireblocks/admin-quorum]] §"Support 경유 필수" 본문 응답 |

### Mobile-Recovery spine

| File | 보강 대상 |
|---|---|
| Cold Wallet Mobile Key Share B&R | [[entities/fireblocks/mobile-device]] §"Cold Wallet plane", [[entities/fireblocks/mpc-key-share]] §"Cold Wallet distribution model" |
| Provisioning Owner Cold Wallet device | [[entities/fireblocks/user-roles/owner]] §"Cold Wallet Owner setup" |
| Provisioning Signer Cold Wallet device | [[entities/fireblocks/user-roles/signer]] §"Cold Wallet Signer setup" |
| Signing transactions with Cold Wallet device | [[entities/fireblocks/transaction]] §"Cold Wallet signing flow" (Stage 8 의 3-share signing 의 Cold variant) |

## Open Questions 응답 후보 (promote 시)

- **Q-W01** (Workspace types) — Stage 9 partial answered. Cold Wallet variant 의 정식 명세 미명세 → `about-fireblocks-cold-wallet` + `prerequisites` body promote 시 응답
- **Q-G04** (Security Admin 멤버십 본문/표 불일치) — `user-roles-for-cold-wallet-workspaces` body promote 시 응답 가능
- **새 Q candidate**:
  - Cold Wallet 의 MPC 3-share 모델이 Hot 과 어떻게 다른가? (mobile + 2 Fireblocks SGX vs 별도 Cold device)
  - Cold ↔ Hot rebalancing 의 governance approval flow

## Promote 우선순위

1. **`about-fireblocks-cold-wallet`** — Cold Wallet plane 의 entry point
2. **`user-roles-for-cold-wallet-workspaces`** — 9-role 와 비교 (Q-G04 보강)
3. **`cold-wallet-mobile-key-share-backup-and-recovery`** — Mobile-DR + Cold Wallet 교차점, MPC 모델 분명화
4. **`cold-wallet-security-and-operational-best-practices`** — Stage 10 Risk-G07 보강
5. `connecting-cold-wallet-with-hot-workspaces-via-p2p` — Cold↔Hot rebalancing path

## Notes
- Cold Wallet 은 Stage 10 의 "Admin Quorum Cold Wallet 특수 규칙" + "Approval group 미지원" 으로 이미 spine 에 존재 — 본 cluster 가 본문 명세 보강 자료
- 본 catalog 는 lightweight index — 본문 fact 추측 금지
