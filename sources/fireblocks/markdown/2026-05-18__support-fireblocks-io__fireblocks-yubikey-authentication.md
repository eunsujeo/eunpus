<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/360015705919-Fireblocks-Yubikey-authentication
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__fireblocks-yubikey-authentication.pdf
status: full
priority: TIER2
domain: Identity-Authentication
-->

# Fireblocks Yubikey authentication

*Updated 8 months ago*

## One-line summary

Mobile app 의 biometric 대안으로 **YubiKey 5 NFC** (Yubico OTP mode) 지원. **Owner 가 YubiKey 사용 시 이후 추가되는 모든 user 가 YubiKey 강제** — Owner choice = workspace-wide enforcement. CSV (Public/Private Identity + Secret Key) 를 **Fireblocks Support PGP 공개키로 암호화** 하여 Support 에 전송 후 association.

## Key Concepts

### 적용 범위
p.1: Mobile app authentication 의 biometric 대안 (Console 2FA 와는 별개 plane).
- 기본: device biometric sensor (fingerprint / face ID)
- 대안: **YubiKey 5 NFC**

### Owner-Level Enforcement (★)
p.1: "If you use or change to YubiKey authentication for the workspace **Owner**, all users added to the workspace afterward will be **required to use YubiKey authentication as well**."

→ **Owner 의 mobile auth 선택이 후속 사용자 전체에 강제 전파**되는 governance 패턴. Owner SPOF / Owner-as-root spine 의 또 하나의 면.

### YubiKey 초기화 (Yubico OTP mode)
p.2-5:
1. YubiKey Personalization Tool 다운로드
2. Yubico OTP tab > Advanced > Configuration Slot 1
3. **Public Identity (1-16 bytes Modhex)**, **Private Identity (6 bytes Hex)**, **Secret Key (16 bytes Hex)** Generate
4. Write Configuration → YubiKey 에 기록

### Fireblocks Association
p.6-8:
- 결과를 **CSV** 로 export
- **Fireblocks Support PGP public key** (fingerprint `434A2601D7929FA499D4C058E0710CC2AC26A43D`, RSA 3072, created 2023-12-17) 로 암호화 (GPG: `gpg -e -r "Fireblocks Support" file.csv`)
- 암호화된 `.gpg` 파일을 Support request form 에 attach
- "**DO NOT send an unencrypted file**" 경고
- Support 가 device 를 workspace user 에 association

### Supported Models
p.8:
- **iOS + Android**: YubiKey 5C NFC, 5 NFC, 5C NFC FIPS, 5 NFC FIPS
- **Android only**: YubiKey 5Ci, 5Ci FIPS

## Implication
- "**Something you have**" (Yubikey NFC) 는 mobile-app security model 의 biometric 대체이지 추가가 아님 (Stage 8 mobile signing security 문서와 일치)
- **Owner-as-root** spine 확장: Owner 의 mobile auth 선택이 워크스페이스 전체 정책

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__fireblocks-yubikey-authentication.pdf` (9 pages).

## Related Pages (cite targets)
- [[vendors/fireblocks/authentication]]
- [[vendors/fireblocks/mobile-app]]
- [[entities/fireblocks/2fa]]
- [[entities/fireblocks/mobile-device]]
- [[entities/fireblocks/user-roles/owner]]
