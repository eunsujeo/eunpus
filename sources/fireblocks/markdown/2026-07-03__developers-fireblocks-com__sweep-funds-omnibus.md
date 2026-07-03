# Sweep Funds · Sweep to Omnibus — 1차 추출 (2026-07-03 fetch)

> 출처: developers.fireblocks.com `docs/sweep-funds.md` + `reference/sweep-to-omnibus-1.md`. Gasless 리서치(G01) 보강 + sweep 설계 근거.

## Sweep to Omnibus — vault 구조 (공식 3분류)

- **Intermediate vault accounts**: end-client 별 입금용 — API 로 필요한 만큼 생성.
- **Omnibus deposits**: sweep 되어 모이는 중앙 vault.
- **Withdrawal pool**: 출금용 vault — **체인 제약 때문에 복수 필요할 수 있음** (EVM nonce 직렬 등).

## Sweeping

- intermediate → omnibus 온체인 전송. **fee 발생**.
- 트리거는 고객 몫: 잔액 임계 / 고정 스케줄(일·주) / **네트워크 fee 유리할 때**. fee 모니터링: `GET /estimate_network_fee`.
- sweep 은 시간 민감도가 낮아 **fee 를 낮게 설정 가능**.
- 자동화: vault 별 `POST /transactions` + **API Co-Signer 권장**(서명까지 자동). Automation rules 기능 롤아웃 중(향후 자동 sweep·대사 rules).
- UTXO 제한: **BTC 1 tx = 250 UTXO**, Cardano 16KB. `getMaxSpendableAmount` 로 사전 확인. UTXO 는 **다중 목적지 1 tx** 가능(콜드+출금 지갑 동시), **account-based 는 deposit wallet 별 sweep**.

## Fueling — Gas Station vs Universal Gasless (공식 비교)

> sweep-to-omnibus-1 원문이 두 접근을 직접 비교:

- **Gas Station**: sweep 전에 각 intermediate vault 로 ETH 푸시 — vault 가 직접 gas 보유·지출. "ETH 를 source vault 에 보유해도 괜찮을 때".
- **Universal Gasless**: 지정 relay 가 거래 중 gas 대납 — vault 는 ETH 불요. ERC-20/721/1155 전부 sweep 지원.
  - ★★ **"does not relay native ETH transfers — Gas Station remains the right choice for sweeping ETH itself."** → **ETH 네이티브 전송은 gasless 대납 불가(공식 확정)** — G01 잔여 미확정 해소.
  - This workspace: 전용 vault 하나만 ETH 보유.
  - External workspace: **"compliance requirements that prohibit holding ETH in the sweeping workspace"** 대응 명시.
  - Fireblocks relay: **"no ETH holding required anywhere in your workspace."**

## Example (Step 1) — 우리 설계와의 일치

- ★ 전제 명시: **"backend 'internal ledger' that correlates your internal customer ref IDs with Fireblocks vault account IDs"** — ref↔vaultId 를 백엔드 DB 가 소유하는 우리 1장 설계와 벤더 가이드가 일치.
- 배치 생성: `createVaultAccount` 를 **name prefix + 순번** 으로 반복 + 각 vault 에 ETH 입금 주소 + omnibus(treasury) vault 생성. bulk 유스케이스.
