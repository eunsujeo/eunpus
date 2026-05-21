# Fireblocks MPC Key Share 분포 & Hosted MPC 차이

## 1. 핵심 요약 (10초 이해)

Fireblocks 의 default SaaS MPC 는 **MPC-CMP protocol** (Canetti-Makriyannis-Peled, NIST 2020 / ACM CCS 2020 채택) 기반의 **3-of-3 additive secret sharing** 모델이다. 사용자(또는 Admin/Signer) 별로 **3개의 key share** 가 다음과 같이 분포된다:

```
3 endpoints (per signing group):
  - 1 Customer Co-Signer  (mobile device  OR  customer SGX server)
  - 2 Fireblocks Cloud Co-Signers (Azure SGX servers)
       ↓ (partial signatures)
     Aggregator → Full Signature → Blockchain
```

**핵심 규칙**: "**None of the parties (neither Fireblocks nor the customer) can sign a transaction alone.**" — Fireblocks 도, 고객도 단독 서명 불가.

**Hosted MPC** 는 이 모델의 변형으로, **3개 share 전체를 customer 환경 (cloud / on-prem) 에 호스팅** — Fireblocks 가 key share 0개 보유. Sovereign key management 가 필요한 regulatory / 내부 정책 시나리오용.

---

## 2. SaaS MPC (Default) — Share 분포 상세

### 2.1 3-share 위치 (Stage 8 확정)

| Share # | Host 위치 | Hardware 보호 | 사용 인증 |
|---|---|---|---|
| 1/3 | **Customer mobile device** (Owner/Admin/Signer 의 폰) | iOS Secure Enclave / Android TEE — 평문 추출 불가 | PIN + biometric (+ key 변경 시 recovery passphrase) |
| 2/3 | **Fireblocks Cloud Co-Signer #1** | Azure SGX (Intel TEE) | Fireblocks 측 |
| 3/3 | **Fireblocks Cloud Co-Signer #2** | Azure SGX (Intel TEE) | Fireblocks 측 |

**대안**: Customer 측 share 는 mobile 대신 **customer cloud / customer on-prem 의 API Co-Signer (SGX)** 위에 둘 수 있음 (`mpc-cmp.md` p.7).

### 2.2 Threshold 구조 (Q-D04 ANSWERED)

- **Within-group threshold = 3/3** (Owner-mobile + 2 Fireblocks cloud co-signers 모두 필요)
- **Across-group threshold = 1/N OR** (어느 signing group 이든 자체 3/3 만족하면 valid)
- 각 Admin/Signer 사용자는 **고유한 3-share set** 보유 — 모두 Owner 의 set 에서 derived (Owner = MPC-level root)
- "**No two signing devices share the same key share set.**" (`mpc-cmp.md` p.7)

### 2.3 Cryptographic 모델

- **Additive Secret Sharing** = "Shamir Secret Sharing with full threshold t=n" — share 조합이 단순 addition (Shamir 보다 효율)
- **Perfect secrecy** — attacker 가 모든 share 없이는 정보 이론적으로 보호
- "the secret itself **never exists** — even during the key generation ceremony" (`mpc-cmp.md`)
- **HRNG (Intel RDRAND), NIST SP 800-90A 준수** key generation
- **MPC-CMP** = ECDSA + EdDSA 모두 지원, 4 rounds (3 pre-processed) → GG18 대비 800% faster

### 2.4 Mobile share 의 Cloud Backup (Stage 5 확정)

`recovery-passphrase.md` p.1 직접 인용:
> "Fireblocks uses the recovery passphrase to create an **encrypted backup of the mobile device's private key share**, which is stored securely in **Fireblocks' cloud servers**."

→ Mobile share 자체는 device 내부에 있으나, **recovery passphrase 로 암호화된 encrypted backup** 이 Fireblocks cloud 에 별도 보관됨. 사용자 삭제 시 폐기 (`delete-users.md` p.1: "Fireblocks deletes the user's cloud-based key shares").

### 2.5 Mobile device 의 두 종류 키 분리 (Stage 8)

`security-aspects-signing-with-the-fireblocks-mobile-app.md` p.1 — Mobile secure environment 에 두 키가 분리되어 보관:
- **Private MPC-CMP key share** — transaction signing 용
- **Configuration key** — workspace 설정 / policy 변경 / 사용자 추가 등 **Admin Quorum approval** 용

둘 다 평문 추출 불가.

---

## 3. Hosted MPC — Share 분포 & 차이

### 3.1 정체성

`hosted-mpc-overview.md` p.1 직접 인용:
> "Hosted MPC feature allows you to **completely control the MPC key shares** by hosting all three Co-Signers in your own environment, either in the cloud or on-premises."

**동기**: regional regulators, 내부 정책, end-users 의 compliance 요건.

### 3.2 두 종류 Co-Signer

| 종류 | 정의 | Key share |
|---|---|---|
| **Primary Co-Signer** | Mobile Device + Fireblocks mobile app, 또는 SGX machine 위의 API Co-Signer | 1/3 |
| **Guard Co-Signer** | SGX machine (customer 측) | 1/3 (각 Guard 마다) |

Hosted MPC = **1 Primary Co-Signer + 2 Guard Co-Signers**, 총 3개 모두 customer 환경.

### 3.3 SaaS MPC vs Hosted MPC 직접 비교

| 항목 | Default SaaS MPC | Hosted MPC |
|---|---|---|
| **Customer 측 share** | 1 (mobile or API Co-Signer) | **3** (Primary + 2 Guard) |
| **Fireblocks 측 share** | **2** (Azure SGX cloud) | **0** |
| **Cryptographic ceremony 참여** | Fireblocks 가 2/3 share 로 참여 | Fireblocks **참여 불가** (share 0) |
| **Key generation / signing / proactive refresh 실행 위치** | Fireblocks cloud + customer | **전적으로 customer 환경** |
| **SGX 요구** | Fireblocks 측 SGX (기본) | **Customer 측 SGX 필수** (Mobile Primary 도 SGX 환경의 API Co-Signer 대안) |
| **Hosting** | Fireblocks SaaS | Customer cloud OR on-premises |
| **Policy enforcement / safeguard** | Fireblocks cloud share 가 enforcement layer | **Fully customer-controlled** |
| **운영 부담** | 낮음 (Fireblocks managed) | 높음 (customer 책임) |
| **BCM (Business Continuity Module)** | optional | **사실상 필요** — Aggregator 까지 customer 측 이동 |

### 3.4 Hosted MPC 의 sovereign architectural 의미 (Stage 22)

- Fireblocks 가 share 0개 = signing 의 모든 라운드 (key generation / signing / proactive refresh) 가 **customer 환경에서 실행**
- SaaS MPC 의 "2 Fireblocks cloud share 가 policy enforcement / safeguard 적용" 모델이 Hosted MPC 에서는 **fully customer-controlled** 로 이동
- **BCM 도입 시**: Aggregator 까지 customer-side 로 이동 → signing protocol 의 message orchestration 도 customer 인프라. **SaaS connectivity 없이도 signing 가능**.
- → Hosted MPC = **regulatory compliance / regional data residency / vendor lock-in 회피 시나리오의 1차 architectural answer**

### 3.5 Backup 모델 차이 (Stage 29-30)

| 항목 | SaaS MPC backup | Hosted MPC backup |
|---|---|---|
| Backup share 수 | **1** (mobile) | **3** (1 mobile + 2 Guard) |
| Mobile share 암호화 | passphrase | passphrase (동일) |
| Guard share 암호화 | N/A (Fireblocks cloud) | **RSA public key** (customer 업로드) |
| Air-gapped machine 수 | 1 | **2** (download + assembly 분리) |
| Trigger | Owner mobile approval | Owner mobile approval (Guard 자동 생성) |
| Backup file count | 6 files (ECDSA 3 + EDDSA 3, RSA-4096 + passphrase) | 더 많음 (Guard 별 RSA encrypted) |

→ Hosted MPC backup = **customer ownership 의 직접 결과**. Fireblocks 가 share 0개 보유하므로 customer 가 3-share 모두 backup 책임.

---

## 4. 확정 vs Hypothesis (Evidence Isolation)

### 확정 (Fireblocks 공식 출처)

- ✅ **SaaS MPC = 1 customer + 2 Fireblocks cloud (3-of-3)** — `mpc-cmp.md` p.7
- ✅ **Hosted MPC = 3 customer (1 Primary + 2 Guard), Fireblocks 0** — `hosted-mpc-overview.md` p.1
- ✅ **MPC-CMP protocol, ECDSA + EdDSA** — `mpc-cmp.md`
- ✅ **Mobile share 의 cloud backup (recovery passphrase 암호화)** — `recovery-passphrase.md` p.1
- ✅ **iOS Secure Enclave / Android TEE 평문 추출 불가** — `about-the-fireblocks-mobile-app.md` p.1
- ✅ **Within-group 3/3, across-group 1/N OR, no two devices share same set** — `mpc-cmp.md` p.7
- ✅ **None of the parties can sign alone** — `mpc-cmp.md`
- ✅ **Hosted MPC: customer cloud OR on-prem, SGX 필수** — `hosted-mpc-overview.md` p.1
- ✅ **Additive secret sharing, perfect secrecy, secret never materialized** — `mpc-cmp.md`

### Hypothesis / 추론

- 🔶 Hosted MPC 에서 BCM 이 "사실상 필요" — Stage 22 추론. 공식 문서는 BCM 을 짝 feature 로 명시하나 강제 여부는 미명세.
- 🔶 Hosted MPC 의 "Fireblocks 0 share" 가 Fireblocks 의 SaaS 부가 기능 (TAP / policy enforcement / fraud detection) 에 미치는 영향 — 본 자료에 명시 없음. Hosted MPC Workspace Configuration / Customer-Side Setup 문서가 TIER 3 placeholder 로만 ingest 되어 deep evidence 없음.

### 답 가능 범위

- **답 가능**: share 분포 (둘 다 명시), threshold, cryptographic 모델, backup 모델 차이, 동기·architectural 의미.
- **답 부족**: Hosted MPC 의 customer SGX 인프라 setup 절차 (TIER 3 placeholder), Mobile Primary 가 SGX API Co-Signer 와 어떻게 hybridize 되는지, Hosted MPC 에서 transaction throughput / latency 변화, Hosted MPC 와 Off-Exchange 의 정확한 연결.

---

## 5. 추천 / 운영 힌트

1. **SaaS MPC 선택 기준**: 보안·간편성·낮은 운영 부담 우선. Fireblocks dependency 수용 가능. 대다수 customer 의 default.
2. **Hosted MPC 선택 기준**: regional regulators (예: 한국 / 중동 일부 / EU 일부) 의 key custody local 요구, 내부 보안 정책상 vendor 측 share 보유 불가, end-user 가 sovereignty 요구하는 B2B2C, vendor lock-in 회피 전략.
3. **Hosted MPC 도입 시 인프라 전제**: SGX 머신 (cloud or on-prem) 2대 이상 + Aggregator/BCM 인프라 + 3-share backup 운영 (RSA keypair 관리 + 2 air-gapped 머신).
4. **Mobile share 분실 위험 관리** (양쪽 공통): recovery passphrase + cloud backup (SaaS) / RSA encrypted Guard backup (Hosted) — 4-secret reconstruction model 에서 1개라도 분실 시 DR 불능 (`recovering-private-key-material.md` Stage 31).
5. **Default SaaS MPC 에서도 customer share 를 mobile 대신 customer SGX 로 옮길 수 있다는 점** 기억 — Hosted MPC 까지 가지 않고도 일정 수준의 customer-side hardening 가능.

---

## Sources

- `entities/fireblocks/mpc-key-share.md` (curated entity — Stage 1-31 누적)
- `sources/fireblocks/markdown/2026-05-18__support-fireblocks-io__mpc-cmp.md` p.1-7
- `sources/fireblocks/markdown/2026-05-18__support-fireblocks-io__hosted-mpc-overview.md` p.1-2
- `sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__hosted-mpc-backup-and-recovery.md`
- `2026-05-18__support-fireblocks-io__about-the-fireblocks-mobile-app.md` p.1
- `2026-05-18__support-fireblocks-io__recovery-passphrase.md` p.1, p.3-4
- `2026-05-18__support-fireblocks-io__delete-users.md` p.1
- `2026-05-18__support-fireblocks-io__security-aspects-signing-with-the-fireblocks-mobile-app.md` p.1
- `2026-05-18__support-fireblocks-io__user-roles.md` p.1-6

## Related Wiki Pages

- `[[entities/fireblocks/mpc-key-share]]`
- `[[entities/fireblocks/cosigner]]`
- `[[entities/fireblocks/api-co-signer]]`
- `[[entities/fireblocks/workspace-keys-backup]]`
- `[[vendors/fireblocks/mpc]]`
- `[[vendors/fireblocks/architecture]]`
- `[[vendors/fireblocks/cosigner]]`
