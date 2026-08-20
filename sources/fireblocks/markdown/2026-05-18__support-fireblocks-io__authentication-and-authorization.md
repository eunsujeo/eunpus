<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/6991524928028-Authentication-and-authorization
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__authentication-and-authorization.pdf
status: full
priority: TIER1
domain: Identity-Authentication / Security-Access
-->

# Authentication and authorization

*Updated 2 years ago*

## One-line summary

Fireblocks platform 의 **core 인증 architecture meta 문서**. MPC-CMP 기반 signing 의 chain of trust (Root Key → Intermediate Cert → Co-Signer End Cert), mobile device activation/refresh/access token lifecycle (7d / —  / 6h), co-signer setup CSR flow, offline 3/3 threshold signing 흐름 일괄 설명.

## Key Concepts

### MPC-CMP 확정
- "**In the MPC-CMP implementation: The CMP algorithm is used as part of both offline and online signing protocols.**" (p.1)
- 참조 논문: "**UC Non-Interactive, Proactive, Threshold ECDSA**" (Canetti, Makriyannis, Peled) — CMP whitepaper (p.4)

### Root Key / Chain of Trust
- **Root Key**: Fireblocks Core Services 에 embedded 된 key pair, **certificate authority** 역할 (p.1)
- Core Services 는 Root Key 로 모든 entity 에 발급하는 access token 을 서명
- Customer components (online + offline co-signers) 는 Core Services public Root Key 를 사전 보유 → 받은 access token 의 서명 검증
- Chain of trust: **Co-Signer Certificate → Core Services Intermediate Certificate → Co-Signer End Certificate** (p.3)

### Token Lifecycle
- **Activation token**: user 생성 시 Core Services 가 발급, **valid 7 days (configurable)**, QR code 로 mobile app 에 전달 (p.2)
- **Refresh token**: mobile app 이 activation token 을 swap 하여 받음, mobile app 의 **KeyChain** 에 저장 (p.2)
- **Access token**: refresh token 을 swap 하여 발급, **valid 6 hours** (p.4)
- Preprocessing > 6h → flow 재시작하여 새 access token 획득

### Offline Mobile Device Authentication Setup (최초 등록 flow)
1. Core Services 가 activation token 생성·저장 (p.2)
2. User 최초 로그인 시 QR-encoded activation token 표시
3. Mobile app 이 QR 스캔 → activation token 을 on-premises Core Services 로 송신
4. Core Services 가 activation → refresh token 변환, mobile app 으로 반환
5. Mobile app 이 refresh token 을 **KeyChain** 에 저장
6. Mobile app 이 **configuration key pair** 생성 → public 만 Core Services 로 송신·저장

### Co-Signer Authentication Setup (per-instance, once)
- Co-signer 가 자신의 private/public key pair 생성 + co-signer certificate 작성 (p.3)
- Private key 는 **co-signer Configuration Database** 에 보관
- Co-signer → CSR → Core Services (via Co-Signer Broker)
- Core Services 가 image 에 내장된 **intermediate certificate** 로 co-signer cert 를 서명 → **co-signer end certificate** 발급
- End cert 는 Co-Signer Broker 통해 모든 co-signer 에 배포

### Offline Signing Device Preprocessing
- Mobile app refresh token → Core Services swap → access token (6h)
- 모든 CMP preprocessing messages 는 모든 co-signer 가 서명·검증
- 6h 초과 preprocessing 은 새 token 으로 재시작

### Co-Signer Authentication (per-transaction)
- 예시: threshold **3/3** (3 participating co-signers) (p.5)
- CMP signing 에서 **third co-signer 는 fully offline** — Console QR code 로 Co-Signer Broker 와 통신
- Flow:
  1. Core Services → Co-Signer Broker → all co-signers: 트랜잭션 처리 명령
  2. 각 co-signer 가 MPC 메시지 생성·co-signer private key 로 서명 → Broker
  3. Broker 가 모든 서명된 MPC 메시지 + end cert 를 broadcast
  4. 각 co-signer 가 end cert + chain of trust 로 메시지 검증
- MPC 프로토콜 라운드 수에 따라 step 2-4 반복

### Offline Signing Device Authentication (per-transaction)
- Console 로그인 → browser 가 access token 수신
- Designated offline signing device 가 Console 의 QR 스캔
- Offline Console 이 offline signer 의 QR 데이터 + user access token 을 Co-Signer Broker 로 송신
- Co-signers 가 offline signer 의 QR 서명 + access token 검증

## REST API References (links in original doc, not fully covered)
- Signing a request
- IP allowlisting
- Rate limiting

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__authentication-and-authorization.pdf` (7 pages).

## Related Pages (cite targets)
- [[vendors/fireblocks/authentication]]
- [[vendors/fireblocks/mpc]]
- [[vendors/fireblocks/architecture]]
- [[vendors/fireblocks/cosigner]]
- [[entities/fireblocks/cosigner]]
- [[entities/fireblocks/api-co-signer]]
- [[entities/fireblocks/mobile-device]]
- [[entities/fireblocks/mpc-key-share]]
- [[entities/fireblocks/csr]]
