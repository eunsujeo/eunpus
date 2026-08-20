<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/6984668676124-MPC-CMP
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__mpc-cmp.pdf
status: full
priority: TIER2-promoted (구조적 가치 인해 사실상 TIER1급)
domain: Security-Access / Mobile-Recovery
-->

# MPC-CMP

*Updated 1 year ago*

## One-line summary

Fireblocks 자체 개발 **MPC-CMP 프로토콜** (Canetti, Makriyannis, Peled 논문 기반, NIST 2020 / ACM CCS 2020 발표) — ECDSA + EdDSA 용. **3 endpoint 분산 (2 Fireblocks cloud SGX + 1 customer mobile/SGX)**, **Additive Secret Sharing** (Shamir t=n) 으로 perfect secrecy, **3/3 within-group threshold + 1/N OR across signing groups**, **4 signing rounds (3 pre-processed)** + **마지막 라운드 QR offline 가능**, **Intel RDRAND HRNG** (NIST SP 800-90A 준수).

## Key Concepts

### MPC-CMP Protocol Identity
p.1:
- Fireblocks 가 개발한 protocol, ECDSA + EdDSA blockchain signature 에 적용
- **"removes the concept of a single private key"** — 키 자체가 어디에도 존재하지 않음 (key generation 중에도)
- 참조 논문: **Canetti, Makriyannis, Peled** — open-source MPC-CMP paper
- 학술 검증: **NIST 2020 + ACM CCS 2020** 채택, public repositories 에 공개

### Three-Endpoint Distributed Signing (★ 핵심 분포 모델)

p.1, 5-6:
- **3 endpoints** — servers 또는 mobile devices
- 각 endpoint 의 secret 은 randomized, **never shared** between them
- Distributed wallet creation: 3 endpoints 가 함께 public key (wallet address) 계산
- 서명 시 3 endpoints 모두 서명 프로세스 참가, 각자 tx + policy 검증

**2 Fireblocks Cloud + 1 Customer 분포** (p.5 diagram 명시):
```
Cloud Co-Signer (Key Share 1) — Fireblocks SGX server
Cloud Co-Signer (Key Share 2) — Fireblocks SGX server
Customer Co-Signer (Key Share 3) — customer mobile device 또는 customer SGX server
       ↓ (partial signatures)
     Aggregator → Full Signature → Blockchain
```

→ Stage 5 의 "1 mobile + 2 cloud" 모델과 **완전 일치**, but more precisely: **customer side 는 mobile 또는 customer-side SGX 서버**일 수 있음.

### Two Co-Signing Components (Customer vs Fireblocks)

p.5-6:
1. **Customer**:
   - Mobile device 또는 **SGX server** (each owned by 다른 팀 멤버)
   - Mobile: secure storage (iOS Keychain) + encryption
   - 접근 인증: PIN + (biometric or Yubikey NFC) — Stage 8 의 mobile-app security model 과 일치
2. **Fireblocks**:
   - SGX server co-signers (multiple)
   - "**safeguards in case keys owned by customers are compromised**"
   - 정책 logically enforce (tx amount threshold, destination address integrity)

→ "**None of the parties (neither Fireblocks nor the customer) can sign a transaction alone.**" — 양측 모두 threshold of co-signers 필요.

### Threshold Structure (★ Q-D04 응답)

p.6-7 diagrams:

**Single-Owner workspace 초기 상태:**
```
            [3/3]
           /  |  \
          /   |   \
   Owner   FB#2   FB#1
   Mobile  Cloud  Cloud
```
→ Owner + Fireblocks 2 co-signers 가 **3/3 threshold** 로 서명.

**추가 signer (User #2) 가입 후:**
```
                  [1/2]
                 /     \
              [3/3]   [3/3]
              / | \   / | \
           Owner FB FB User2 FB FB
```
→ Within each signing group: **3/3 threshold** (Owner-mobile + 2 FB cloud OR Signer-mobile + 2 FB cloud)
→ Across groups: **1/2 (1-of-N) OR** — 어느 한 그룹이 서명하면 valid

**핵심 명시**:
> "For every user added with signing permissions (**Admins and Signers**), a new and unique set of three key shares is **derived from the Owner's set of key shares**." (p.6)

> "**Admins and Signers have their own unique key share set. No two signing devices share the same key share set.**" (p.7)

→ **Owner 가 root key 의 origin** — Admin/Signer 의 key share set 은 Owner set 에서 파생. Owner = MPC-level root user (Best practices 문서의 "root user" 표현과 일치).

### MPC-CMP vs Naive Secret Sharing vs Multi-Sig

p.2-4:
| 속성 | Naive secret sharing | **Additive Secret Sharing (MPC-CMP)** | Multi-Sig |
|---|---|---|---|
| 1-share 노출 시 부분 정보 | 일부 누출 | **No info** (perfect secrecy) | N/A |
| Key 재조립 위치 | 어딘가 1곳 | **존재하지 않음** (key generation 중에도) | N/A |
| 업데이트 가능 | - | **Yes** (technology updates) | No (signing rules locked) |
| 사용자 추가 / 키 share 추가 | - | **Yes** (다른 device 영향 없음) | No (original rules 고정) |
| 위치 독립적 multi-authorizer | - | **Yes** | No |

### Additive Secret Sharing 정식 정의

p.2-3:
- "Additive Secret Sharing (more commonly known as **Shamir Secret Sharing with full threshold t=n**)"
- Shares 는 **simple addition** 만으로 조합 (Shamir 보다 효율적)
- "the secret itself **never exists** — even during the key generation ceremony"
- **Perfect secrecy** 제공 — attacker 가 모든 share 미만이면 정보 이론적으로 비밀 보호됨

### MPC-CMP 개선점 (vs GG18, p.4-5)

- **Minimal latency** — **4 rounds vs GG18 의 8 rounds (3 라운드는 pre-processed)** → **800% faster**
- **Offline signatures** — 마지막 라운드 **QR code** 로 offline 가능 → **true air-gapped wallet**
- **Proactive security**
- **Universal composability** — 다른 프로토콜과 조합해도 안전
- **Accountability** — 악의적 참가자 식별 가능

### Key Ceremony Security (Q-D04, Q-S 응답)

p.4:
- **HRNG (Hardware Random Number Generator)**: Intel RDRAND
- **NIST SP 800-90A 준수**
- **No manual steps** — 완전 자동화
- "If the MPC key generation process fails, **the key was not created.**" (atomicity)
- Each share = randomized within **hardware-isolated component**
- Extended workspace key 는 어디에도 저장 안 됨

### Backup 예외

p.4: "**The only exception is Workspace Key Backup and Recovery** where the key shares are **encrypted and backed up in a recovery package** for disaster scenarios."

→ Stage 5 의 cloud backup 모델 (passphrase-encrypted) 과 일치.

### User Onboarding 5-Stage Flow

p.5 diagram:
1. **Invitation Email** ("pending activation")
2. **Activation Link** (Auth0 생성 → "pending device pairing")
3. **Scan QR** (signing user 면 mobile app 다운로드 + key generate → "pending device setup")
4. **MPC** (Owner 가 mobile device 로 signing request 수신 + 사용자 capability 승인)
5. **Generate keys** (사용자가 mobile device 에서 key generation 완료)

→ Stage 2 의 Add user flow + Stage 4 의 Authentication doc 의 activation/refresh token 과 정합.

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__mpc-cmp.pdf` (8 pages).

## Related Pages (cite targets)
- [[vendors/fireblocks/mpc]]
- [[vendors/fireblocks/architecture]]
- [[vendors/fireblocks/cosigner]]
- [[entities/fireblocks/mpc-key-share]]
- [[entities/fireblocks/cosigner]]
- [[entities/fireblocks/api-co-signer]]
- [[entities/fireblocks/mobile-device]]
- [[entities/fireblocks/workspace-keys-backup]]
- [[entities/fireblocks/user-roles/owner]]
- [[entities/fireblocks/user-roles/admin]]
- [[entities/fireblocks/user-roles/signer]]
