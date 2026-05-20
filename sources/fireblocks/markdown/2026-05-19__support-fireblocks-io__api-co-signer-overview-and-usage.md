<!--
source_url: https://support.fireblocks.io/hc/en-us/articles/api-co-signer-overview-and-usage
url_status: inferred (slug 기반 추정)
downloaded_at: 2026-05-19
status: lightweight-index (Stage 19, v3.2.2)
priority: TIER1
domain: cosigner-deployment / api-cosigner-overview
cluster: aws-nitro-cosigner
-->

# API Co-signer — Overview and Usage

**LIGHTWEIGHT INDEX (Stage 19, v3.2.2)** — PDF 본문 미로드.

## Why TIER 1
Stage 8 의 entity-grade 명세 ([[entities/fireblocks/api-co-signer]], `add-api-users.md` + `re-enrolling-api-users.md`) 가 페어링·인증·에러 패턴 중심이라면, 본 문서는 **API Co-signer 의 전반 overview + usage pattern** 으로 추정 — Stage 8 의 부분 명세를 cloud-agnostic 운영 가이드로 보강하는 위치.

## Cross-cut Signal (★ catalog-level)

### API Co-signer Usage Pattern (★ future promote signal)
- 어떤 transaction class 에 API Co-signer 가 자동 응답하는지
- Mobile Co-signer 와의 trade-off (Stage 5 `about-the-fireblocks-mobile-app.md` 의 "API Co-Signer 가 mobile app 의 대체 옵션" 명제 보강)
- Stage 8 의 Signer role 정의 ("Console+mobile 또는 programmatically via API Co-signer") 의 deployment 측면

### Co-signer Management Plane (★ future promote signal)
- API user / API key / pairing token / Callback Handler 의 lifecycle 운영 (production 환경 다중 instance 관리)
- Stage 15 의 cosigners-beta API 10 endpoint (add / get / pair / unpair / rename / callback-handler update) 와 의미 매핑

### TEE-agnostic / TEE-specific 분기점 (★ future promote signal)
- "API Co-signer" 라는 단일 추상에서 실제 배포는 3 TEE 분기 (AWS Nitro / Azure SGX / GCP Confidential Space)
- 본 문서가 어느 layer 까지 cloud-agnostic 인지, 어디부터 TEE-specific 분기인지가 retrieval 구조 결정

## Hypotheses (★ Unverified — body 미확인)

- **H1**: 본 문서는 cloud-agnostic API Co-signer overview — TEE-specific 절차는 별도 docs 분리 (AWS Nitro / SGX / GCP Confidential Space)
- **H2**: Stage 8 의 페어링 5-step 워크플로 + chain of trust + SSL pinning 이 본 문서의 운영 frame 으로 일반화

## Related (catalog-level cross-link)

### Cluster
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__aws-nitro-cluster-catalog]]
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__aws-nitro-cloudformation-solution-for-fireblocks-co-signer]]
- [[sources/fireblocks/markdown/2026-05-19__support-fireblocks-io__the-co-signer-management-tab]]

### Curated Wiki (보강 후보)
- [[entities/fireblocks/api-co-signer]] §"Overview + usage pattern" (보강 후보)
- [[entities/fireblocks/cosigner]] §"API vs Mobile Co-signer 운영 trade-off" (보강 후보)
- [[vendors/fireblocks/cosigner]] §"API Co-signer cloud-agnostic 운영" (보강 후보)

### Stage 15 catalog (paired retrieval)
- `/docs/cosigner-architecture-overview`
- `/docs/use-cosigners-for-signing-automation`
- `/docs/multiple-cosigners-high-availability`
- `/reference/api-cosigner-installation-flow`
- `/reference/api-cosigner-operate`

## Promote Condition
API Co-signer 의 운영 frame / production 사용 pattern / TEE-agnostic vs TEE-specific 경계 명세 필요시.

## Notes
- 본 lightweight index 는 catalog 용도. 본문 fact 미확인.
