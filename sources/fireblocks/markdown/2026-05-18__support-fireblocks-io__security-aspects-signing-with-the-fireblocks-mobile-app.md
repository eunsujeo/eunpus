<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/9205187986844-Security-aspects-Signing-with-the-Fireblocks-mobile-app
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__security-aspects-signing-with-the-fireblocks-mobile-app.pdf
status: full
priority: TIER1
domain: Mobile-Recovery / Security-Access
-->

# Security aspects: Signing with the Fireblocks mobile app

*Updated 5 months ago*

## One-line summary

Mobile app 의 두 가지 보안 기능 (MPC key share 보관 + auth/encryption 강제) 과 **3 key share 분산 signing scheme (1 mobile + 2 cloud + cloud mediator)** 의 정식 명시 문서. Configuration key vs MPC-CMP key share 분리, iOS Secure Enclave / Android TEE 보호, PIN + biometric/Yubikey 2-factor model, tx lifecycle stages.

## Key Concepts

### Mobile Device 의 두 종류 키 (separated by purpose)

p.1:
- **Private MPC-CMP key share**: Owner / Signer / Admin 의 private key share — **transaction signing** 에 사용
- **Configuration key**: workspace 설정 / policy / 사용자 추가 등 **Admin Quorum approval** 에 사용

→ 둘은 mobile device 의 같은 secure environment 안에 있지만 **분리된 키**이며 **별도 액션 카테고리**에 사용.

### Secure Environment 보호

p.1:
- iOS: **Secure Enclave**
- Android: **Trusted Execution Environment (TEE)**
- "Once key shares are created within the secure enclave (iOS) or trusted execution environment (TEE) (Android) of the mobile device, **they are never extracted in their plain (unencrypted) form.**"

p.5 diagrams: Co-Signer Encrypted Configuration Database + **Co-Signer DB Key (Encrypted with TEE key)** — "Keys and configuration **protected at use** AND **protected at rest**"

### App Security Model: "One thing you are, one thing you have"

p.2:
- **Something you remember**: 6-digit PIN code
- AND either:
  - Something you are: **fingerprint / face ID**
  - OR Something you have: **Yubikey NFC**

→ 두 요소 매 액션마다 강제 (Console 의 2FA 와 다른 plane — Console = 로그인 1회, Mobile = **action 마다**).

### Action별 Key 사용

p.2:
| Action | 사용 키 |
|---|---|
| Transaction signing | **MPC key share** |
| Transaction approval | **Configuration key** |
| Workspace / policy changes | **Configuration key** |

### Data Transfer
p.2: **TLS (bidirectional)** + **certificate pinning** — MITM / tampering / replay 방지.

### 3 Key Share 분산 Signing Scheme (★ 핵심 모델 확정)

p.3-4:
- 1 key share = **authorized signing device (mobile)**
- **2 key shares** = Fireblocks cloud (separately stored)
- 총 **3개 key share**, "**never combined in one place**"

Signing ceremony:
- **Cloud-based mediator** 가 mobile device 의 1 share + 클라우드의 2 share 를 검증
- "**The mobile device does not directly communicate with the cloud servers hosting the other key shares when signing.**"
- "**All 3 shares are never combined in the same place at once.**"
- "**The transaction is signed using the three key shares individually, one after another.**"

p.4 Important: "Since the three key shares are never combined in one place either in the cloud or on the same hardware, this distributed MPC signing scheme ensures **a unified private key can never be a single point of compromise.**"

### 초기 워크스페이스 상태 (Workspace bootstrap)

p.3: "**Initially, only your workspace Owner sets up a device with a private MPC-CMP key share stored on it.**"
- 이 시점에서 Owner = 유일한 approver + signer
- Owner 만 있을 때 본인 device 의 approve = sign 동시 trigger (separate authorization 단계 불필요)
- 추가 authorized approver/signer 가 생기면 Policy 룰이 Designated Signer 를 결정

### Transaction Lifecycle Stages

p.3: `Submitted → Pending Screening → Pending Authorization → Queued → Pending Signature → [Signing]`
- Designated Signer 는 **Pending Authorization** 단계에서 결정 (정책이 initiator-as-signer 허용 시 initiator)
- Technical signing 단계는 **Pending Signature** 부터 시작

### Signing Flow on Device

p.4:
1. Designated Signer 의 mobile app 알림: "approved transaction ready for signing"
2. App 의 prompt 따라 sign + broadcast
   - tx 상세 검토 + 확인
   - PIN 입력 + biometric 인증
3. **Key share ceremony** (cloud-based mediator 가 mobile + 2 cloud share 검증)
4. **Three key shares 가 individually, one after another 로 서명**

특이:
- Designated Signer 가 동시에 listed approver / initiator 이면 approval 이 sign 권한도 함께 부여 → 인증 + ceremony 완료 후 **자동 서명**
- Typed Message / Raw Signing 은 broadcast 자동화 X → API 로 retrieve 후 사용자가 직접 broadcast

### Biometric Data 처리

p.5:
- Fireblocks app 은 biometric 데이터 **저장하지 않음**
- 데이터는 device 의 secure environment (iOS Secure Enclave / Android TEE) 에만 보관
- Biometric 변경 → 다음 액션 시 에러 → **Owner = recovery / Signer-Approver = re-enroll** 분기

### Multi-Approver Workflow

p.2-3:
- 여러 approver 요구되는 Policy: 각 approver 가 자신의 device 에서 **encrypted configuration key** 로 approve
- 모든 approver 가 approve 한 뒤에야 Designated Signer 가 자신의 device 의 **MPC key share** 로 서명

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__security-aspects-signing-with-the-fireblocks-mobile-app.pdf` (6 pages).

## Related Pages (cite targets)
- [[vendors/fireblocks/mpc]]
- [[vendors/fireblocks/mobile-app]]
- [[vendors/fireblocks/architecture]]
- [[vendors/fireblocks/authentication]]
- [[entities/fireblocks/mobile-device]]
- [[entities/fireblocks/mpc-key-share]]
- [[entities/fireblocks/transaction]]
- [[entities/fireblocks/designated-signer]]
- [[entities/fireblocks/user-roles/owner]]
