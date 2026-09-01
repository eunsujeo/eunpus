<!--
status: extracted-source
collected_at: 2026-09-01
collector: web snapshot and selective normalization
scope: Fireblocks Cold Wallet public primary documentation
-->

# Fireblocks Cold Wallet 공식 문서 추출본

이 파일은 2026-09-01에 접근한 Fireblocks 공식 페이지 중 Cold Wallet 구조·설정·서명·운영과 직접 관련된 내용을 선별하고 정규화한 추출본이다. 원문의 탐색·마케팅 영역은 제외했다. 각 절에 원문 URL을 적었다.

## FB-CW-01. Cold Wallet 개요

- 제목: About Fireblocks Cold Wallet
- URL: https://support.fireblocks.io/hc/en-us/articles/4405965412114-About-Fireblocks-Cold-Wallet
- 접근일: 2026-09-01
- 등급: 공식 제품 지원 문서

확인 내용:

- Cold Wallet workspace를 생성하려면 Customer Success Manager와 onboarding 일정을 잡아야 한다.
- Cold Wallet은 오프라인에 보관된 키로 거래에 서명한다.
- 오프라인 기기와 Console 사이에서 데이터를 옮길 때 QR animation을 사용한다.
- Console이 미서명 거래 데이터를 QR animation으로 표시하면 Cold Wallet 기기가 이를 스캔한다. 기기에서 서명한 뒤 생성된 QR animation을 Console 카메라로 다시 스캔해 서명을 완료한다.
- Workspace는 생성 전에 Cold Wallet 또는 Hot Wallet로 지정된다. 계약에 해당 제품이 포함된 경우 Cold Wallet이 제공된다.
- Hot과 Cold workspace를 함께 사용하면 Console에서 로그아웃하지 않고 workspace를 바꿀 수 있다.
- Fireblocks는 Hot·Cold workspace 간 자산 이동에 Fireblocks P2P Network를 사용하는 방법도 안내한다.
- Fireblocks는 복수 workspace 조합의 예로 Cold Wallet-managed vault 90%, Hot Wallet-managed vault 10%를 제시한다. 이 수치는 Fireblocks의 제품 가이드 예시이며 법령 기준이 아니다.

## FB-CW-02. Hot·Warm·Cold 구분

- 제목: Fireblocks Key Features & Capabilities
- URL: https://developers.fireblocks.com/docs/capabilities
- 접근일: 2026-09-01
- 등급: 공식 개발자 문서

확인 내용:

- Hot·Warm·Cold는 세 번째 MPC key share의 위치와 승인 방법에 따라 구분된다.
- Hot Wallet의 세 번째 key share는 API Co-Signer의 API user가 보유하며 승인을 자동화할 수 있다.
- Warm Wallet의 세 번째 key share는 인터넷에 연결된 모바일 기기에 있으며 Fireblocks 모바일 앱으로 승인한다.
- Cold Wallet의 세 번째 key share는 air-gapped 오프라인 모바일 기기에 있으며 양방향 QR 스캔으로 승인한다.
- Fireblocks workspace는 Hot·Warm 또는 Cold Wallet-only로 구성되며 하나의 workspace에 두 유형을 혼합하지 않는다.

## FB-CW-03. Owner 기기 등록

- 제목: Provisioning an Owner's Cold Wallet device
- URL: https://support.fireblocks.io/hc/en-us/articles/360021911260-Provisioning-an-Owner-s-Cold-Wallet-device
- 접근일: 2026-09-01
- 등급: 공식 운영 절차

확인 내용:

- Owner 기기를 Signer 기기보다 먼저 구성한다.
- Customer Success Manager와 예약한 onboarding session에서 등록한다.
- Cold Wallet 기기에 SIM card를 설치하지 않는다.
- Owner passphrase는 기록해 복구에 사용할 수 있도록 보관한다. Cold Wallet app에서는 passphrase reset을 지원하지 않는다.
- 준비물은 새 iOS 기기, Apple Configurator 2를 실행할 Mac, Console에 접속할 macOS 또는 Windows 컴퓨터다.
- Apple Configurator에서 기기를 Supervised Mode로 준비하고 MDM에 enroll하지 않는다.
- 초기 설정과 Cold Wallet app 다운로드 단계에서는 기기가 인터넷에 연결된다.
- Console 초대 링크로 workspace에 가입하고 2FA, biometric, passcode, recovery passphrase를 설정한다.
- 등록 후 Apple ID에서 로그아웃하고 Settings에서 Bluetooth와 Wi-Fi를 끈 뒤 Airplane Mode를 켠다.
- 제한 profile을 적용해 재시작 후에도 Bluetooth와 Wi-Fi가 꺼져 있도록 한다. 해당하는 기기·iOS version에는 Single App Mode도 적용한다.

## FB-CW-04. Signer 기기 등록

- 제목: Provisioning a Signer's Cold Wallet device
- URL: https://support.fireblocks.io/hc/en-us/articles/360020781559-Provisioning-a-Signer-s-Cold-Wallet-device
- 접근일: 2026-09-01
- 등급: 공식 운영 절차

확인 내용:

- Owner 기기가 준비된 뒤 Signer 기기를 등록한다.
- 등록에는 security manager, Owner, Signer가 참여한다. Security manager는 Fireblocks workspace role이 아니다.
- 개봉하지 않은 새 iOS 기기, Owner 기기, Apple Configurator가 있는 Mac, Console 접속용 컴퓨터를 사용한다.
- 기기를 Supervised Mode로 설정한 뒤 Cold Wallet app을 설치하고 workspace와 pairing한다.
- Owner는 ECDSA와 EdDSA에 대한 두 개의 Add User 요청을 각각 양방향 QR animation으로 승인한다.
- Signer는 recovery passphrase를 만든 뒤 signature pre-processing을 실행한다.
- Signature pre-processing은 MPC-CMP 통신 4 round 중 처음 3 round를 미리 완료하고 pre-processed signature를 기기에 저장한다. 이 단계에서는 Fireblocks cloud co-signer와 통신하려고 인터넷 연결을 사용한다.
- 마지막인 네 번째 round는 실제 거래 서명 시 QR 스캔으로 완료한다.
- Pre-processing을 마친 뒤 Apple ID에서 로그아웃하고 Bluetooth·Wi-Fi를 끈 뒤 Airplane Mode를 켠다. 이어서 제한 profile과 Single App Mode를 적용한다.
- Fireblocks는 일반적으로 2년 이상 사용할 수 있는 pre-processed signature를 기기에 로드한다고 설명한다. ECDSA 또는 EdDSA의 잔여 용량이 초기 용량의 10% 미만이면 Audit Log event를 발행한다.

## FB-CW-05. Cold Wallet 거래 서명

- 제목: Signing transactions with your Cold Wallet device
- URL: https://support.fireblocks.io/hc/en-us/articles/360021915320-Signing-transactions-with-your-Cold-Wallet-device
- 접근일: 2026-09-01
- 등급: 공식 운영 절차

확인 내용:

- Cold Wallet 거래는 생성 후 8시간 안에 서명되지 않으면 timeout으로 취소된다.
- Vault에서 transfer를 생성하면 Console의 Cold Wallet signing panel에 요청이 나타난다.
- Console에서 Sign을 선택하면 거래 정보가 담긴 QR animation이 표시된다.
- Signer는 Cold Wallet app으로 Console QR animation을 스캔한 뒤 Approve를 선택하고 PIN과 biometric ID로 인증한다.
- Cold Wallet app이 transaction confirmation QR animation을 만들면 Console의 Confirm mobile scan을 선택하고 컴퓨터 카메라로 스캔한다.
- Console은 서명 성공을 확인하고 Recent activity에 거래 상태를 표시한다.
- Owner는 같은 QR 경험으로 exchange connection 추가나 whitelisted address 추가 같은 workspace 변경을 승인할 수 있다.
- Non-Signing Admin과 Approver는 Cold Wallet app이 아니라 온라인 Fireblocks mobile app으로 workspace 변경 승인 알림을 받는다.

## FB-CW-06. P2P Network 연결

- 제목: About the P2P Network
- URL: https://support.fireblocks.io/hc/en-us/articles/6107038882460-About-the-P2P-Network
- 접근일: 2026-09-01
- 등급: 공식 제품 지원 문서

확인 내용:

- 새 P2P Network connection은 요청자와 상대방의 Admin Quorum이 모두 승인해야 한다.
- P2P Network transfer는 secure hardware enclave 안의 encrypted tunnel로 routing된다.
- Fireblocks는 Automated Address Authentication을 deposit address를 messenger로 공유하거나 복사·붙여넣기하는 절차를 줄이고 address spoofing·MITM 위험을 낮추는 기능으로 설명한다.
- 연결 상태에서는 deposit address가 바뀌어도 자동으로 remap한다.
- UTXO 기반 자산은 입금마다 address rotation을 사용할 수 있다. Ethereum 같은 account-based blockchain은 automatic address rotation을 지원하지 않는다.

## FB-CW-07. Mobile key share 백업과 복구

- 제목: Mobile Key Share Backup and Recovery
- URL: https://support.fireblocks.io/hc/en-us/articles/360016261160-Mobile-Key-Share-Backup-and-Recovery
- 접근일: 2026-09-01
- 등급: 공식 백업·복구 문서
- 범위 주의: 이 문서는 일반 mobile key share 복구를 설명한다. Cold Wallet 전용 절차와 동일하다고 단정하지 않는다.

확인 내용:

- Biometric 설정 변경, PIN 분실, 기기 분실·파손·교체, Fireblocks app 삭제는 mobile key share에 접근할 수 없게 되는 사유로 열거된다.
- 기기 OS cloud backup에는 Fireblocks key share material이 포함되지 않는다.
- Fireblocks는 Owner 외에 signing privilege를 가진 user를 최소 2명 두도록 안내한다.
- Owner 기기의 mobile key share recovery에는 Fireblocks Support와 경우에 따라 Disaster Recovery Service provider의 도움이 필요하다.
- Owner recovery에는 recovery passphrase를 쓰거나 다른 signing user의 mobile device를 쓰는 방법이 안내된다. Support의 identity verification과 SLA가 개입할 수 있다.

## 추출 경계

- 이 파일은 Fireblocks의 비공개 내부 운영, 고객별 계약 조건, 테넌트별 기능 플래그를 확인하지 않았다.
- Cold Wallet 전용 user-role 표, approval-group 지원 여부, workspace key backup 전체 절차는 이번 공개 원문 세트에서 본문 전체를 확보하지 못했다.
- `FB-CW-07`의 일반 mobile key share recovery를 Cold Wallet 전용 복구 절차로 외삽하지 않는다.
