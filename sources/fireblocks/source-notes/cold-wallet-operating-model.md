<!--
status: Mode C — full ingest
stage: 171
promoted_at: 2026-09-01
primary_extract: sources/fireblocks/markdown/2026-09-01__fireblocks__cold-wallet-primary-docs-extracted.md
external_extract: sources/monitoring/2026-09-01__cold-wallet-regulation-exchange-disclosures.md
-->

# Fireblocks Cold Wallet 공개 운영 자료 — Mode C source note

이 근거 노트는 2026-09-01에 확인한 Fireblocks 공식 문서와 규제기관·거래소 공개자료를 함께 검토하기 위해 작성했다. Fireblocks의 제품 절차와 외부 기관의 공개 비율은 적용 범위가 다르므로 나눠 기록했다.

## Fireblocks 문서에서 확인한 흐름

| 순서 | 확인된 내용 | 근거 |
|---|---|---|
| 1. Workspace 준비 | Workspace는 생성 전에 Cold Wallet 또는 Hot Wallet로 지정한다. Cold Wallet workspace는 Customer Success Manager와 onboarding 일정을 잡아 생성한다. | `FB-CW-01`, `FB-CW-02` |
| 2. Owner 기기 등록 | Owner 기기를 Signer보다 먼저 등록한다. 새 iOS 기기를 Supervised Mode로 준비하며 SIM과 MDM은 사용하지 않는다. 앱 설치와 등록 단계에서는 인터넷을 사용한다. | `FB-CW-03` |
| 3. Signer 기기 등록 | Owner가 ECDSA·EdDSA Add User 요청을 QR로 승인한다. Signer는 MPC-CMP 네 round 중 처음 세 round를 온라인에서 미리 처리한다. | `FB-CW-04` |
| 4. 오프라인 전환 | 등록과 pre-processing을 마치면 Apple ID에서 로그아웃하고 Bluetooth·Wi-Fi를 끈 뒤 Airplane Mode, 제한 profile, 적용 가능한 Single App Mode를 설정한다. | `FB-CW-03`, `FB-CW-04` |
| 5. 거래 서명 | Console의 미서명 거래 QR animation을 Cold Wallet 기기로 스캔하고 기기에서 승인·인증한다. 기기가 만든 transaction confirmation QR animation을 Console 카메라로 스캔하면 서명이 완료된다. 생성 후 8시간 안에 서명하지 않은 거래는 timeout으로 취소된다. | `FB-CW-05` |
| 6. Workspace 간 연결 | Hot·Cold workspace 간 자산 이동에는 Fireblocks P2P Network를 사용할 수 있다. 새 연결은 요청 측과 상대 측 Admin Quorum의 승인이 모두 필요하다. | `FB-CW-01`, `FB-CW-06` |

## 키와 통신 경계

- Fireblocks는 Hot·Warm·Cold를 세 번째 MPC key share의 위치와 승인 방식으로 구분한다. Cold Wallet의 세 번째 share는 air-gapped 모바일 기기에 있고 실제 거래의 마지막 MPC round는 QR로 완료한다. (`FB-CW-02`, `FB-CW-04`)
- 이번 추출본은 Cold Wallet의 첫 번째·두 번째 share 위치나 전체 share 분포를 직접 밝히지 않는다. 세 번째 share의 위치만으로 전체 분포가 Hot Wallet과 같다고 단정하지 않는다.
- Signature pre-processing은 처음 세 MPC round를 미리 끝내고 pre-processed signature를 기기에 저장하는 단계다. Fireblocks는 일반적인 적재량으로 2년 이상 사용할 수 있다고 설명한다. ECDSA 또는 EdDSA 잔여량이 초기 용량의 10% 미만이면 Audit Log event를 발행한다. (`FB-CW-04`)
- P2P transfer는 secure hardware enclave 안의 encrypted tunnel로 routing된다. Automated Address Authentication은 주소를 별도 메신저나 복사·붙여넣기로 전달하는 단계를 줄인다. (`FB-CW-06`)

## 복구 문서의 적용 범위

`FB-CW-07`은 일반 mobile key share 복구 문서다. OS cloud backup에는 Fireblocks key share material이 포함되지 않는다. Owner 복구에는 Support가 관여하고 경우에 따라 Disaster Recovery Service provider도 참여한다. 이를 Cold Wallet 전용 workspace key backup 절차로 확대하지 않는다.

## 규제·거래소 공개자료

| 자료 | 공개 내용 | 범위 |
|---|---|---|
| 금융위원회 (`REG-KR-01`) | 이용자 가상자산 경제적 가치의 80% 이상을 Cold Wallet에 보관하고 비율을 매일 점검 | 대한민국 가상자산사업자 규제 기준 |
| 빗썸 (`EX-BITHUMB-01`) | 2025-12-31 기준 자산의 95.6%를 Cold Wallet에 분리 보관 | 해당 기준일의 거래소 공지 |
| Coinbase Singapore (`EX-COINBASE-01`) | settlement wallet에 maximum·low balance threshold를 두고 기준에 따라 vault storage와 자산을 이동 | 싱가포르 법인의 소비자 보호 공개 |
| Coinbase Global (`EX-COINBASE-02`) | 2024 Q3 공시에서 수탁 자산 Hot Wallet 비중을 일반적으로 2% 이하로 유지하려고 한다고 기재 | 2024 Q3 공시 시점 |
| Gemini (`EX-GEMINI-01`) | segregated custody asset 전체와 exchange wallet asset 대부분을 offline air-gapped storage에 보관 | 정확한 exchange Cold 비율은 미공개 |
| Bitstamp (`EX-BITSTAMP-01`) | 공개 글에서 약 95%를 offline cold storage, 5%를 Hot Wallet에 보관한다고 설명 | 2022-11-14 게시물. 2026년 현재 비율로 단정하지 않음 |

각 수치는 기준일, 자산 범위, 산정 방식, 관할이 달라 같은 기준으로 단순 비교할 수 없다.

## Promote 반영 위치

- [[entities/fireblocks/workspace]] — workspace 구분과 P2P 연결
- [[entities/fireblocks/mobile-device]] — Owner·Signer 기기 등록과 오프라인 전환
- [[entities/fireblocks/transaction]] — 양방향 QR 서명과 8시간 timeout
- [[entities/fireblocks/workspace-keys-backup]] — 일반 mobile recovery와 Cold 전용 절차의 경계
- [[vendors/fireblocks/security]] — pre-processed signature 잔여량과 P2P 보안 속성
- [[vendors/fireblocks/architecture]] — 세 번째 share 위치, preprocessing, 마지막 QR round
- [[open-questions/fireblocks]] — Q-M05·Q-G06 부분 답변

## 원본

- `sources/fireblocks/markdown/2026-09-01__fireblocks__cold-wallet-primary-docs-extracted.md`
- `sources/monitoring/2026-09-01__cold-wallet-regulation-exchange-disclosures.md`
