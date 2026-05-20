<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/9716757315996-Recovering-private-key-material
url_status: confirmed (Stage 31 Mode C 시점 real article ID 발견)
downloaded_at: 2026-05-19
original_pdf: 2026-05-19__support-fireblocks-io__recovering-private-key-material.pdf
status: full
priority: TIER1
domain: mobile-recovery / workspace-keys-backup / reconstruction
cluster: workspace-keys-backup
acquisition_method: pdftotext -layout → bash chunked sed (Stage 31 Mode C, 165 lines / 8.5 KB / 3 chunks)
supersedes: Stage 12 placeholder
-->

# Recovering Private Key Material (Stage 31 Mode C)

**Status**: deep-ingested Stage 31. PDF body 미 LLM context 전체 로드 — `pdftotext -layout` → 165-line text file → bash chunked sed (3 chunks).

**Supersedes Stage 12 placeholder** — Q-S09 의 reconstruction (operation) 측 1차 source. Backup (Stage 30) → reconstruction (본 source) → recovery full cycle 완성.

## Strict Warning (★ SPOC trigger)

직접 인용:
> "You should never perform this procedure unless a disaster event has occurred and you need to reconstruct your workspace."
> "Perform this procedure **only on an offline machine**. Performing this procedure on an online machine will result in your **private key being considered exposed and compromised**."

→ Stage 8 architecture 의 SPOC 경고가 본 reconstruction procedure 단계에서 explicit trigger. Online 실행 = 키 compromise 공식 선언.

## Recovery Procedure — 3-step (★ Q-S09 operation 측)

### Step 1: Open Recovery Utility on offline machine
- **Recover Private Keys** 선택 (또는 left menu 의 **Recover**)
- 미설치 시: online machine 에서 다운로드 → USB 등 removable media 전송 → offline install
- **"Do not connect the offline machine to any network during this process"**

### Step 2: Complete 4 fields (★ 4-secret reconstruction model)

| # | Field | 내용 | Source (Stage 30 backup) |
|---|---|---|---|
| 1 | **Recovery Kit** | Full recovery kit ZIP file | Stage 30 의 6-file backup package |
| 2 | **Recovery Private Key** | `fb-recovery-prv.pem` (matching public key 가 backup 시 사용된 RSA-4096 private key) | Stage 30 의 RSA keypair private key |
| 3 | **Mobile App Recovery Passphrase** | Workspace Owner's recovery passphrase | Owner mobile share 의 passphrase |
| 4 | **Recovery Private Key Passphrase** | RSA private key file 의 AES-128 protection passphrase | Stage 30 의 `openssl genrsa -aes128` 시 설정 |

→ **4 secrets required for reconstruction**. Any one missing = DR 불능 (catastrophic failure).

### Step 3: Select Recover
- Verification process 실행
- 완료 시 **Accounts page** 등장 (workspace reconstruction view)
- Learn more: "Reconstructing your workspace" (별도 doc)

## Auto-Generated Passphrase Variant (★ Q-S01 cross-cut)

직접 인용:
> "If you auto-generated a passphrase during your workspace's initial setup, select the Use auto-generated passphrase checkbox."

UI 변화:
- "Mobile App Recovery Passphrase" → **"Auto-Generate Private Key Passphrase"**
- 추가 field: **"Auto-Generated Passphrase Private Key"** (별도 RSA private key file)

→ Auto-passphrase = **2-key cryptographic system**:
1. Mobile share 자체의 passphrase (auto-generated)
2. 그 auto-generated passphrase 를 암호화하는 **별도 RSA keypair**

→ Q-S01 (Auto-passphrase cryptographic mechanism) 의 cryptographic structure partial signal. Generation algorithm / entropy / where stored 는 본 자료에 없음.

## JSON Automation (★ Recovery Utility v1.8.0+)

직접 인용 .json schema:
```json
{
  "Passphrase": "your passphrase",
  "rsaKeyPassphrase": "your rsaKeyPassphrase"
}
```

| Key | 내용 |
|---|---|
| `Passphrase` | Fireblocks Mobile App Recovery Passphrase of the workspace Owner |
| `rsaKeyPassphrase` | Recovery Private Key Passphrase (RSA private key passphrase) |

**Steps**:
1. Recovery Utility 에서 `Recover` 진입
2. `Upload Passphrase JSON File` 선택 → drag-drop 또는 manual select
3. Field name 정합 검증
4. Recovery Kit + Recovery Private Key 와 함께 자동 load 완료

→ 운영 automation 가능 (v1.8.0+) — passphrase manual entry 회피 + scripted DR 가능.

## Cross-Cut Signals (Related Articles)

- **Reconstructing your workspace** — next paired source (workspace 전체 재구성 절차)
- **Importing your private keys to an external wallet** — DR exit path (recovered keys 의 external wallet 으로 export)
- Disaster Recovery Service: CoinCover
- Third-Party Disaster Recovery Services
- About the Fireblocks Recovery Utility
- Native Workspace Key Backup and Recovery with Python Script (programmatic alternative)
- How to perform Key Backup and Recovery
- Verifying a recovery package

## Architectural 신호 (Stage 31)

1. **4-secret reconstruction model** — Recovery Kit ZIP + RSA private key + Mobile App passphrase + RSA private key passphrase
2. **Strict offline-only mandate** — online 실행 = "considered exposed and compromised" (explicit compromise signaling)
3. **Auto-passphrase = 2-key system** (cryptographic plane 식별, Q-S01 partial signal)
4. **JSON automation v1.8.0+** — passphrase manual entry alternative
5. **Backup → reconstruction full cycle complete** — Stage 29 (Hosted MPC backup) + Stage 30 (SaaS MPC backup) + Stage 31 (reconstruction)

## Q Resolution

### Q-S09 (DR Service xprv+fprv 생성·접근·운영 절차) → **answered (Stage 31)**

| 원 Q 요구사항 | Stage | Status |
|---|---|---|
| 생성 (creation) | Stage 30 | ✓ ANSWERED (6-file package + Recovery Utility) |
| 접근 (access — air-gapped) | Stage 29 + 30 + 31 | ✓ ANSWERED (offline machine + USB transfer + permanent network isolation) |
| **운영 (operation — reconstruction)** | **Stage 31** | ✓ ANSWERED (3-step + 4 secrets) |
| 검증 (verification) | Stage 30 + 31 | ✓ ANSWERED |
| storage | Stage 29-31 | ✓ ANSWERED (procedural air-gapped pattern) |
| rotation | — | **out-of-scope** (org compliance 결정) |
| formal air-gapped hardening (NIST/FIPS) | — | **out-of-scope** (customer compliance posture) |

→ **Vendor docs 영역 procedural answer complete**. 잔존 항목은 customer org compliance decisions.

### Q-S01 (Auto-passphrase cryptographic mechanism) → **partial signal advance**

Stage 31 발견 = **2-key cryptographic system** (mobile passphrase + RSA encryption keypair). Generation algorithm / entropy / where stored 잔존.

## Related cite targets
- [[entities/fireblocks/workspace-keys-backup]] §"Stage 31 — Reconstruction Procedure"
- [[entities/fireblocks/mpc-key-share]] §"Reconstruction 모델 (Stage 31)"
- [[entities/fireblocks/recovery-passphrase]] — Mobile App Recovery Passphrase (4-secret input #3)
- [[vendors/fireblocks/architecture]] §"Disaster Recovery Services" (full operational lifecycle)
- [[vendors/fireblocks/risks]] §"Risk-S09" (final fragility signals)

## Source
- `sources/fireblocks/pdf/2026-05-19__support-fireblocks-io__recovering-private-key-material.pdf`
- Acquisition: pdftotext + bash chunked sed (3 chunks, 165 lines)
