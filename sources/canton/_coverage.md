<!--
purpose: docs.canton.network 사이드바 전수 커버리지 추적 (Stage 53~ Canton 검증 sweep)
fetched_at: 2026-06-10
note: 500+ 페이지 중 수탁형 Canton 위키 관련 묶음만 추적. Daml stdlib/언어·API ref·dev 모듈은 범위 밖(skip).
-->

# docs.canton.network 사이드바 커버리지 체크리스트

범례: ✅ 검증·promote 완료 / 🔲 관련(미검증, 우선순위) / ⬜ 범위 밖(skip)

## Overview — understand
- ✅ what-is-canton (Stage 53/54)
- ✅ core-concepts (Stage 56)
- ✅ global-synchronizer (Stage 54 — overview/introduction 으로 커버)
- ✅ canton-coin (Stage 54 — tokenomics burn-mint)
- 🔲 five-minute-overview · the-problem · cantons-solution · glossary · use-cases · who-should-read · cips-introduction · getting-app-featured

## Overview — learn
- ✅ architecture (Stage 55) · how-transactions-work (Stage 55/56) · cryptographic-keys (Stage 56)
- 🔲 ledger-model · privacy-model · trust-model · global-synchronizer-architecture · validator-architecture · multi-synchronizer · two-layer-consensus

## Overview — reference
- ✅ ordering-consensus (Stage 53) · external-party (Stage 53) · cip-0056 (Stage 53) · canton-coin-tokenomics (Stage 54)
- 🔲 canton-protocol-specification · ledger-model-detailed · synchronizer-overview · validator-node-components · super-validator-components · topology · transaction-lifecycle · smart-contract-consensus · reassignment-protocol · ledger-causality · pruning · decentralization · gsf-policies · tokenomics-of-gs · canton-name-service · splice-wallet-reference · sv-governance-reference · cip-index · cross-sync-dvp-example

## App Development (M1~M7 모듈·deep-dives·quickstart·stdlib)
- ✅ token-standard (Stage 53) · m4-canton-coin/m4-query-with-pqs (Stage 53 참고)
- 🔲 deep-dives: external-signing · external-signing-hashing-algorithm · external-signing-onboarding · external-signing-topology · external-signing-transactions · command-deduplication · explicit-contract-disclosure · multi-hosting · manage-daml-parties · token-standard(✅) · tokenomics  ← **수탁 관련 deep-dive**
- ⬜ M1~M7 학습 모듈 · Daml 언어/stdlib 레퍼런스 · tooling · troubleshooting (범위 밖)

## Global Synchronizer
- ✅ understand/overview · understand/introduction · understand/validator-roles (Stage 54) · canton-console/console-overview (Stage 56) · deployment/synchronizer-traffic (Stage 53) · production-operations/validator-disaster-recovery (Stage 53)
- 🔲 production-operations: key-management · kms-operations · party-management · multi-sig · node-backup-restore · disaster-recovery · validator-backups · validator-security · validator-upgrades  ← **수탁 운영 관련**
- 🔲 reference/crypto-schemes (알고리즘명 — Ed25519 등 확인처) · splice-fundamentals: rewards-minting · validator-liveness · sv-live-tokenomics · extension-synchronizers/bft-orderer
- ⬜ deployment(docker/k8s/oidc 등) · monitoring · troubleshooting · release-notes (범위 밖)

## Integrations
- ✅ overview (Stage 54) · wallet/guidance (Stage 54)
- 🔲 wallet: exchange-integration · proof-of-transfer · configuration · sdk-download / exchanges: guidance · node-operations / wallet-gateway: signing-providers · apis / wallets: canton-vs-web3 · for-users / integration-patterns · dapp-sdk/wallet-provider-integration  ← **수탁/거래소 통합 관련**

## API Reference
- ⬜ 전부 범위 밖 (Protobuf/gRPC/Java/JSON API 레퍼런스 — 필요 시 개별 조회)

---

## 우선순위 sweep 대상 (HIGH, 관련 🔲 중 핵심)
1. **수탁 직결**: integrations/wallet/exchange-integration · proof-of-transfer · exchanges/guidance · wallet-gateway/signing-providers · deep-dives/external-signing(+hashing-algorithm/onboarding/topology/transactions) · reference/crypto-schemes
2. **운영 직결**: production-operations/key-management · kms-operations · party-management · multi-sig · node-backup-restore · disaster-recovery
3. **개념 보강**: overview/learn(ledger-model · privacy-model · trust-model · two-layer-consensus) · overview/reference(topology · transaction-lifecycle · reassignment-protocol · pruning · canton-name-service)
4. **토큰경제**: splice-fundamentals(rewards-minting · validator-liveness) · reference/tokenomics-of-gs

---

## 진행 로그
- **Stage 57 (batch1, 수탁직결 6)** ✅ crypto-schemes · external-signing · external-signing-hashing-algorithm · exchange-integration · proof-of-transfer · wallet-gateway/signing-providers
  - 신규: 알고리즘 1차 확정(Ed25519/ECDSA-SHA256/SHA-256) · 외부서명 해시식(sha256(0x00000030‖0x03‖…)) · 서명 프로바이더(Fireblocks/Dfns/Blockdaemon) · proof-of-transfer+pruning(UpdateID 영속화 필수) · 거래소 omnibus(treasuryParty, <100 UTXO/transfer)
- **Stage 58 (batch2, 운영 6)** ✅ key-management · kms-operations · party-management · multi-sig · node-backup-restore · exchanges/guidance
  - 신규: root/intermediate 키 계층(root offline/air-gap) · KMS(AWS/GCP/Driver, envelope vs full) · n-of-m 멀티시그(3-of-5 PartyToParticipant, multi-host threshold, decentralized namespace) · PartyToParticipant permission(Submission/Confirmation/Observation) · 백업 순서(participant 먼저)·synchronous replication
- **Stage 59 (batch3, 개념 6)** ✅ ledger-model · privacy-model · trust-model · two-layer-consensus · topology · transaction-lifecycle
  - 신규: eUTXO·stakeholder 3역할(signatory/observer/controller)·Create/Exercise/Fetch · divulgence 주의 · trust model selective(자가호스팅=validator 신뢰 제거) · topology 매핑 정정(PartyToParticipant/OwnerToKeyMapping/PartyToKey/NamespaceDelegation, perm Observation/Confirmation/Submission) · 5-phase lifecycle·decisionTimeout
- **Stage 60 (batch4, 개념/토큰 6)** ✅ reassignment-protocol · pruning · canton-name-service · rewards-minting · validator-liveness · tokenomics-of-gs
  - 신규: pruning 심화(PQS·ACS commitment·30일 retention) · CNS(이름→party, DSO·소각) · 토큰경제 수치(10분 라운드/52,560yr·dev fund 5%·$2.85 liveness·median SV rate) · reassignment scope-out(단일 synchronizer)
- **Stage 61 (batch5/6 core)** ✅ glossary · use-cases · command-deduplication · explicit-contract-disclosure · multi-hosting · external-signing-onboarding
  - 신규: external party 온보딩 API(/v2/parties/external/generate-topology→allocate, MPC/HSM 키) · disclosed_contracts(created_event_blob) · dedup 정정(command ID vs submission ID) · multi-hosting≠multi-sig 구분 · Amulet=CC·DSO·Splice 용어
  - 🔲 잔여: canton-protocol-specification · ledger-causality · decentralization · external-signing-topology/transactions · five-minute/the-problem/cantons-solution/cips-introduction (저수확 예상)
- **Stage 62 (batch7 잔여 + API/stdlib 표본)** ✅ external-signing-transactions · ledger-causality · decentralization · admin-api(표본) · da-list(표본)
  - 신규: ledger causality(partial ordering·fuzzy time·divulgence 순서무보장 수탁 리스크) · submission_id 재서명 불필요 · admin-api "never expose to public internet"
  - **판정: API Reference(~250)+Daml stdlib(~120)+언어 ref = 기계적, promote 가능 서술 없음 → sweep 종료.** 수탁/아키텍처 content 페이지 전수 커버 완료.

## SWEEP 완료 (Stage 57~62)
content 페이지(Overview/Integrations/GS 운영·개념/관련 deep-dive) 전수 검증. 자동생성 ref(API/gRPC/Java/JSON/Daml stdlib)는 표본 점검 후 일괄 범위 밖 확정. Canton open Q: A11(Fireblocks status 매핑)만 open, 나머지 ANSWERED.
