<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/6984715167772-Intel-SGX-secure-environments
downloaded_at: 2026-05-18
original_pdf: 2026-05-18__support-fireblocks-io__intel-sgx-secure-environments.pdf
status: full
priority: TIER2
domain: Security-Access
-->

# Intel SGX secure environments

*Updated 3 years ago*

## One-line summary

Intel SGX = hardware enclave, HSM 동급 OS-isolation. Fireblocks 는 **minimum 3-5 machines (each on segregated network)** 에 SGX enclave 분산 운영 — private key shares + API keys (exchange credentials) 양쪽 보호. "Even Fireblocks employees cannot retrieve."

## Key Concepts

p.1:
- SGX = OS 로부터 isolated hardware enclave (HSM 유사)
- 보호 대상: crypto material + algorithm + sensitive code execution
- 위협 모델: 외부 hacker **+ insider (rogue admin)**

### vs HSM 비교
- Next-gen crypto (MPC, ZK proofs) 보호 가능
- Policy engines, whitelisting DBs, workflows 격리 가능
- ARM TrustZone (mobile, Yubikey) 와 end-to-end attestation 가능
- Public cloud + on-prem deployment scale

### Fireblocks 의 SGX 활용 (★)
p.1:
- **Minimum 3-5 machines** (each on **segregated network**) — SGX enclave 분산
- Private keys: SGX enclave 의 encrypted memory 안 → OS 권한 탈취되어도 추출 불가
- **API keys (exchange credentials)** 도 SGX TEE 에 저장 → "**information cannot be retrieved by hackers, inside colluders, or even Fireblocks employees.**"

### Runtime 동작
p.2 (6-step):
1. App 은 trusted (enclave) + untrusted 파트로 분할 build
2. App 실행 → enclave 가 trusted memory 에 생성
3. Trusted function call → 실행이 enclave 로 전이
4. Enclave 안에서만 평문 처리, 외부 access 차단
5. Function return → enclave data 는 trusted memory 에 잔류
6. App 은 normal 실행 계속
- Memory bus / system memory snoop 은 ciphertext 만 봄

## For full content
`sources/fireblocks/pdf/2026-05-18__support-fireblocks-io__intel-sgx-secure-environments.pdf` (3 pages).

## Related Pages (cite targets)
- [[vendors/fireblocks/cosigner]]
- [[vendors/fireblocks/architecture]]
- [[vendors/fireblocks/security]]
- [[entities/fireblocks/cosigner]]
- [[entities/fireblocks/api-co-signer]]
- [[entities/fireblocks/api-key]]
- [[entities/fireblocks/mpc-key-share]]
