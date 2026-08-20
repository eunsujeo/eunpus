<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/aws-nitro-cloudformation-solution-for-fireblocks-co-signer
url_status: inferred (slug 기반 추정)
downloaded_at: 2026-05-19
status: lightweight-index (Stage 19, v3.2.2)
priority: TIER1
domain: cosigner-deployment / aws-nitro-tee / customer-cloud
cluster: aws-nitro-cosigner
-->

# AWS Nitro CloudFormation Solution for Fireblocks Co-Signer

**LIGHTWEIGHT INDEX (Stage 19, v3.2.2)** — PDF 본문 미로드. AWS customer-cloud Co-signer 의 공식 deployment 진입점.

## Why TIER 1
AWS 환경에서 Co-signer 를 운영할 때 **공식 권장 deployment 방식** 으로 추정되는 CloudFormation 템플릿 문서. Stage 8 의 "customer cloud" 옵션이 cloud-agnostic 명세였다면, 본 문서는 **AWS-specific 의 1st-class evidence**.

## Cross-cut Signal (★ catalog-level, body 미로드)

### AWS Nitro Customer-Cloud Deployment (★ future promote signal)
- CloudFormation **(infrastructure-as-code)** 기반 — manual 설치 대신 AWS-native 템플릿 일괄 배포
- Stage 8 의 customer-side share host 3 옵션 (mobile / customer cloud / customer on-prem) 중 **customer cloud 의 AWS 변형** 의 정식 evidence
- CloudFormation parameter / 사전조건 (IAM / VPC / region / Nitro-capable instance type) 등 deployment-time decision 모두 본 문서에 있을 가능성

### TEE Boundary — AWS Nitro vs Intel SGX (★ future promote signal)
- Stage 8 의 "일반 Co-signer = Intel SGX baseline" 명제는 **Azure/on-prem 기준**
- AWS 는 **Intel SGX 가 아닌 AWS Nitro Enclaves** 를 사용 (다른 TEE 기술)
- 두 TEE 가 Fireblocks 의 Two-tier MPC 모델의 customer-share endpoint 로서 **등가 보장** 을 제공하는지가 trust 모델 핵심
- Customer cloud 옵션은 cloud-agnostic 추상 — 실제로는 TEE 기술별 분기 (AWS Nitro / Intel SGX / GCP Confidential Space)

### CloudFormation as Co-signer Onboarding Pattern (★ future promote signal)
- Other cloud (Azure / GCP) 의 install 페이지가 별도 존재 — AWS 만 CloudFormation 방식인지, 모든 cloud 가 IaC 패턴인지가 deployment automation 표준화 영향

## Hypotheses (★ Unverified — body 미확인)

- **H1**: CloudFormation 템플릿은 EC2 with Nitro Enclaves + Callback Handler 인프라 + IAM + VPC 를 한 stack 으로 배포
- **H2**: Nitro Enclaves 의 attestation 메커니즘이 Fireblocks chain of trust (Stage 8 의 self-generated cert → CSR → Intermediate → End cert) 와 통합
- **H3**: Nitro-capable EC2 instance type 가 prerequisite (예: m5n, m5dn, c5n 등 일부 instance 만 Nitro Enclaves 지원 — 단 이는 본 wiki 외부 추정 정보, body 확인 필요)

## Related (catalog-level cross-link)

### Cluster
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__aws-nitro-cluster-catalog]] — 3-PDF + Stage 15 catalog 통합
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__api-co-signer-overview-and-usage]] — API Co-signer 전반
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__the-co-signer-management-tab]] — Management UI

### Curated Wiki (보강 후보, 수정 안 함)
- [[entities/fireblocks/api-co-signer]] §"AWS Nitro Enclaves 환경" (보강 후보)
- [[entities/fireblocks/cosigner]] §"3 TEE plane (Nitro / SGX / GCP)" (보강 후보)
- [[vendors/fireblocks/architecture]] §"Customer cloud 의 TEE 분기" (보강 후보)
- [[vendors/fireblocks/cosigner]] §"AWS Nitro deployment" (보강 후보)

### Stage 15 catalog 의 AWS-specific 4 URL (paired retrieval)
- `https://developers.fireblocks.com/docs/aws-nitro-api-co-signer` — overview
- `https://developers.fireblocks.com/reference/install-api-cosigner-aws` — install procedure
- `https://developers.fireblocks.com/reference/api-cosigner-versions-aws` — version matrix
- `https://developers.fireblocks.com/reference/api-cosigner-maintenance-aws-nitro` — maintenance

## Promote Condition
AWS 환경 Co-signer 설치 진행 시 (CloudFormation parameter / region / IAM / instance type 결정 필요시). Mode C promote → AWS-specific install procedure 본문 ingest.

## Notes
- 본 lightweight index 는 catalog 용도. **본문 fact 미확인** — CloudFormation parameter / 사전조건 / TEE attestation 흐름 모두 body ingest 후만 정식 fact 화.
- AWS Nitro Enclaves 가 Fireblocks 공식 지원 TEE 환경이라는 사실은 catalog-level 확정 (PDF 존재 + Stage 15 dedicated URL 4건).
