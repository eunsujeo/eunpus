<!--
status: cluster-catalog (Stage 19, v3.2.2)
priority: TIER1 (catalog index)
domain: cosigner-deployment / customer-cloud / aws-nitro-tee
cluster: aws-nitro-cosigner
-->

# Cluster: AWS Nitro Co-signer (3 PDF + 4 AWS URL + 11 common URL + 3-way TEE plane)

**CLUSTER CATALOG (Stage 19, v3.2.2)** — PDF 본문 미로드. AWS Nitro Enclaves 기반 customer-cloud Co-signer deployment 의 catalog 통합.

## ★ Architecture Note (이전 답변 supersede)

**확정 사실** (Stage 15 catalog + Source Lake PDF evidence):
- AWS Co-signer 는 **Fireblocks 공식 supported customer-cloud plane**
- 기술 = **AWS Nitro Enclaves** (Intel SGX 가 아님 — 다른 TEE 기술)
- CloudFormation 템플릿 (IaC) 으로 공식 배포 방식 제공
- AWS 전용 install / version / maintenance reference URL 4건 dedicated

**Supersedes**: "AWS 의 SGX 지원이 제한적이므로 Azure / Mobile / On-prem 권장" 같은 일반 클라우드 지식 기반 추천은 **잘못됨** — Fireblocks 가 AWS Nitro Enclaves 를 1st-class TEE 환경으로 공식 지원하므로 AWS 가 customer-cloud Co-signer 의 valid first choice.

→ retrieval 시 본 catalog 가 AWS-관련 Co-signer 질문의 truth source. 외부 일반 지식 (예: "AWS 는 SGX 가 제한적") 적용 금지 — TEE 기술이 다름.

## Cluster Members

### Source Lake PDFs (3 — Stage 19 Mode B 신규)

| File | Owning lightweight index |
|---|---|
| `aws-nitro-cloudformation-solution-for-fireblocks-co-signer.pdf` | [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__aws-nitro-cloudformation-solution-for-fireblocks-co-signer]] |
| `api-co-signer-overview-and-usage.pdf` | [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__api-co-signer-overview-and-usage]] |
| `the-co-signer-management-tab.pdf` | [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__the-co-signer-management-tab]] |

### Stage 15 catalog AWS-specific URLs (4)

| URL | 역할 |
|---|---|
| `/docs/aws-nitro-api-co-signer` | AWS Nitro 환경 overview |
| `/reference/install-api-cosigner-aws` | AWS install procedure |
| `/reference/api-cosigner-versions-aws` | AWS version matrix |
| `/reference/api-cosigner-maintenance-aws-nitro` | AWS Nitro maintenance |

### Stage 15 catalog common (cloud-agnostic) Co-signer URLs (11)

| URL | 역할 |
|---|---|
| `/docs/cosigner-architecture-overview` | Architecture overview (★ 1순위 promote 후보 — Stage 13 식별) |
| `/docs/co-signer-security-checklist-defense-monitoring` | Security checklist (★ Stage 13 식별) |
| `/docs/multiple-cosigners-high-availability` | HA topology |
| `/docs/use-cosigners-for-signing-automation` | Signing automation |
| `/docs/create-api-co-signer-callback-handler` | Callback Handler 생성 |
| `/reference/api-cosigner-installation-flow` | Install flow (cloud-agnostic) |
| `/reference/api-cosigner-management` | Management API |
| `/reference/api-cosigner-operate` | Operations |
| `/reference/api-cosigner-troubleshooting` | Troubleshooting |
| `/reference/cosigner-callbackhandler-secure-communication-authentication` | Callback Handler 인증 (★ Q-A04 / Q-C01 응답 가능) |
| `/reference/install-api-cosigner-add-new-cosigner-p2` | 다중 Co-signer 추가 procedure (HA 토폴로지 관련) |
| `/api-reference/cosigners-beta/` 10 endpoints | Management API surface |

## Stage 24 Cross-cut — Callback Handler Auth Options × TEE plane (★ H-X1 hypothesis)

Stage 24 의 `cosigner-callbackhandler-secure-communication-authentication.md` 본문이 명시:
- **Options 4/5 (Hybrid: Public key + Cert pinning / Root-CA)** 가 "currently supported only by the **SGX cosigner**" + v2025.12.11+
- Options 1/2/3 는 모든 cosigner 환경 지원 (Co-signer version 제약만)

**H-X1 hypothesis** (★ unverified, 본 source 만으로 단정 불가):
- "SGX cosigner" 가 Intel SGX TEE 환경 한정 (Azure / on-prem) 을 지칭한다면 — **AWS Nitro Co-signer 는 Options 4/5 미지원**
- 또는 Fireblocks 내부에서 "SGX cosigner" 가 일반 Co-signer 의 historical 명칭일 가능성 (Stage 8 의 "Co-signer = SGX baseline" framing) — 이 경우 AWS Nitro 도 Options 4/5 가능
- 두 해석 모두 catalog level 에서 evidence 없음 — `install-api-cosigner-aws` 본문 또는 `api-cosigner-versions-aws` Mode C 필요

**운영 의미 (hypothesis 사실 시)**:
- AWS Nitro 환경 Co-signer 는 Options 1/2/3 만 가용
- AWS 환경에서 dual-layer auth (message + TLS) 필요 시 → SGX 환경 (Azure / on-prem) 전환 필요
- Hybrid 가 SGX 한정 = TEE-plane 별 Co-signer capability 분기 의 추가 evidence

→ Stage 19 의 3-way TEE plane 매트릭스 (AWS Nitro / Intel SGX / GCP Confidential Space) 가 install/maintenance 외에 **Callback Handler auth option 가용성** 측면에서도 분기 가능성 시사.

→ Promote 1순위: `install-api-cosigner-aws` (Stage 15 catalog) — H-X1 검증.

## 3-Way TEE Plane (★ Stage 19 신규 명시)

Customer cloud 옵션은 cloud-agnostic 추상이지만, 실제 deployment 는 **TEE 기술별 3 분기**:

| TEE 환경 | 환경명 | Install URL | Maintenance URL | Version URL | Overview URL |
|---|---|---|---|---|---|
| **AWS Nitro Enclaves** | AWS | `/reference/install-api-cosigner-aws` | `/reference/api-cosigner-maintenance-aws-nitro` | `/reference/api-cosigner-versions-aws` | `/docs/aws-nitro-api-co-signer` |
| **Intel SGX** | Azure / Azure Marketplace / on-prem | `/reference/install-api-cosigner-azure` + `-azure-marketplace` + `-onprem` | `/reference/api-cosigner-maintenance-sgx` | `/reference/api-cosigner-versions-sgx` | `/docs/intel-sgx-api-co-signer` |
| **GCP Confidential Space** | GCP | `/reference/install-api-cosigner-gcp` | `/reference/api-cosigner-maintenance-gcp-confspace` | `/reference/api-cosigner-versions-gcp` | `/docs/gcp-confidential-space-api-co-signer` |

**Additional cloud install** (Stage 15 catalog 확정, TEE 기술 본문 ingest 전까지 미명세):
- `/reference/install-api-cosigner-alibaba`
- `/reference/install-api-cosigner-ibm`

→ 총 **7 cloud / on-prem install matrix**, **3 main TEE plane**.

## Customer Cloud 의 Cloud-Agnostic Architecture (retrieval correction)

Stage 8 의 `vendors/fireblocks/architecture.md:116` + `mpc.md:172` 가 "customer cloud" 를 **cloud-agnostic** 옵션으로 명시한 것은 retrieval layer 에서 다음으로 해석:

- "Customer cloud" = AWS / Azure / GCP / Alibaba / IBM 중 어느 cloud 든 가능 (catalog 확정)
- 단 각 cloud 의 TEE 기술이 다름 → install / maintenance / version trace 분리
- TEE 기술별 **trust 모델 등가성** (Nitro ↔ SGX ↔ Confidential Space 가 Two-tier MPC 의 customer-share endpoint 로서 동등 보장 제공하는지) 은 본문 ingest 후만 확인 가능

## Cross-Cut Mapping (Curated Wiki 보강 후보 — 수정 안 함)

### Cosigner / Co-signer plane

| 자료 | 보강 대상 |
|---|---|
| AWS Nitro CloudFormation PDF | [[entities/fireblocks/api-co-signer]] §"AWS Nitro Enclaves 환경" / [[vendors/fireblocks/architecture]] §"Customer cloud TEE 분기" |
| API Co-signer overview PDF | [[entities/fireblocks/api-co-signer]] §"Overview + usage" / [[vendors/fireblocks/cosigner]] §"API Co-signer 운영 패턴" |
| Co-signer management tab PDF | [[entities/fireblocks/api-co-signer]] §"Management UI" / [[entities/fireblocks/admin-quorum]] §"Co-signer governance actions" |

### Architecture / TEE Plane

| 자료 | 보강 대상 |
|---|---|
| 3-way TEE plane (본 catalog) | [[entities/fireblocks/cosigner]] §"3 TEE plane (Nitro / SGX / Confidential Space)" / [[vendors/fireblocks/architecture]] §"Customer cloud 의 TEE 분기" / [[vendors/fireblocks/mpc]] §"TEE 기술별 customer-share endpoint" |

### Callback Handler / Authentication

| 자료 | 보강 대상 |
|---|---|
| `/reference/cosigner-callbackhandler-secure-communication-authentication` | [[entities/fireblocks/callback-handler]] §"인증 방식 종류" — Q-A04 응답 / [[entities/fireblocks/api-co-signer]] §"Callback Handler payload" — Q-C01 응답 |

### Management / Governance

| 자료 | 보강 대상 |
|---|---|
| `/api-reference/cosigners-beta/` 10 endpoints + Co-signer management tab | [[entities/fireblocks/admin-quorum]] §"Co-signer add/unpair governance" / [[entities/fireblocks/approval-group]] §"Co-signer 관련 actions" — Q-A02 (unpair 절차) 응답 |

### HA Topology

| 자료 | 보강 대상 |
|---|---|
| `/docs/multiple-cosigners-high-availability` + `install-api-cosigner-add-new-cosigner-p2` | [[vendors/fireblocks/architecture]] §"Co-signer HA topology" — Stage 8 의 "Active-Active + Active-Passive" 명제 보강 |

## Future Promote Signal (★ 사용자 명시)

다음 5 영역이 본 cluster 의 promote 우선 신호:

1. **AWS Nitro customer-cloud deployment** — CloudFormation parameter / instance type / IAM / VPC / region 결정
2. **Co-signer management plane** — cosigners-beta API ↔ UI mapping + governance approval 흐름
3. **Callback Handler auth** — Q-A04 (auth method 종류) + Q-C01 (payload spec) 응답
4. **HA topology** — 다중 Co-signer / multi-region 배포 패턴
5. **TEE boundary** — Nitro / SGX / Confidential Space 간 trust 모델 등가성

## Hypothesis Summary (★ Unverified — body 미로드)

| H | Hypothesis | 검증 source |
|---|---|---|
| H1 | CloudFormation 템플릿이 EC2 with Nitro Enclaves + Callback Handler infra + IAM/VPC 를 한 stack 으로 배포 | AWS Nitro CloudFormation PDF |
| H2 | Nitro Enclaves attestation 이 Fireblocks chain of trust 와 통합 | AWS Nitro overview URL |
| H3 | 3 TEE 환경이 Two-tier MPC 의 customer-share endpoint 로 등가 보장 제공 | 3 TEE plane docs |
| H4 | Stage 8 의 페어링 5-step + chain of trust + SSL pinning 이 모든 TEE 환경 공통 frame | `api-cosigner-installation-flow` URL |
| H5 | cosigners-beta API 10 endpoint 가 UI management tab 의 backing — `unpair-api-key` 가 Q-A02 의 정답 후보 | Co-signer management tab PDF + cosigners-beta API |

모든 hypothesis 는 Mode C promote 전까지 **fact 화 금지**.

## New Q Candidates (★ promote 시 정식 등록)

본 단계 (Mode B) 에서는 등록 보류. Mode C 시점에 일괄 등록 예약:

| Q-ID 예약 | 질문 | 우선순위 |
|---|---|---|
| Q-2026-05-19-C03 | 3 TEE 환경 (Nitro / SGX / GCP Confidential Space) 의 trust 모델 등가성? | ★ |
| Q-2026-05-19-A09 | AWS Nitro CloudFormation 의 prerequisites + parameter spec | ★ |
| Q-2026-05-19-S17 | Nitro Enclaves attestation 과 Fireblocks chain of trust 통합 모델 | ★ |
| Q-2026-05-19-G08 | Co-signer add / unpair / Callback Handler 변경의 governance flow (12 assignable actions 중 어느 것) | ★ |
| Q-2026-05-19-A10 | `cosigners-beta` 10 endpoint 의 payload schema + UI mapping | medium |
| Q-A02 (기존) → 응답 후보 | Co-signer management tab + cosigners-beta `unpair-api-key` 가 정답 source | (기존 Q 응답) |

## Promote 우선순위

1. **`aws-nitro-cloudformation-solution-for-fireblocks-co-signer`** — AWS 실제 설치의 entry point
2. **`/docs/cosigner-architecture-overview`** (Stage 15) — Stage 13 이미 식별, 3 TEE plane 의 정식 명세
3. **`/reference/install-api-cosigner-aws`** — AWS step-by-step
4. **`/reference/cosigner-callbackhandler-secure-communication-authentication`** — Q-A04 / Q-C01 동시 응답
5. **`api-co-signer-overview-and-usage`** + **`the-co-signer-management-tab`** — operational frame 완성

## Notes

- 본 catalog 는 lightweight — **본문 fact 추측 금지** 정책 유지
- 신규 entity 생성 보류 — Mode C promote 후에도 hub section 흡수 우선 검토 (entity-min discipline Stage 6–18 = 13 연속 0)
- **3 TEE plane** 명시는 catalog-level 확정 (Stage 15 URL 분기 evidence) — body fact 가 아님에 유의 (각 TEE 의 정확한 trust 모델은 body ingest 후)
- AWS Nitro Enclaves vs Intel SGX 의 **기술적 차이** 자체는 Fireblocks 공식 문서가 별도 환경으로 분리 운영함을 evidence 로 확정. 양쪽이 "TEE" 라는 일반 추상에서 동등인지는 hypothesis (H3)
