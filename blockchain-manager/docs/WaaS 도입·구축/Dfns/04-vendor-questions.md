---
title: Dfns 담당자 확인 질문 — Baseline 배포
status: To Do
---

사내 데이터센터 전체 플랫폼 설계를 확정하기 위해 Dfns 담당자에게 확인할 질문이다. **아래는 질의 초안이며 아직 발송하거나 답변받지 않았다.** AWS 배치와 비교하되, 현재 설계 대상은 사내 데이터센터로 유지한다.

## AWS에서 구성해도 유사한가?

**제공 자료를 기준으로 보면 AWS에서도 Baseline을 사용하므로 플랫폼의 역할과 구조는 유사하다.** 온프레미스 개요는 고객 AWS 계정의 EKS·관리형 데이터 서비스 위에 Vault 또는 AWS 네이티브 시크릿 백엔드를 선택하는 구성을 설명한다. 배포 백엔드 자료는 Baseline을 기본 프로필로 명시한다. 따라서 **배치 장소인 AWS와 배포 프로필인 Enterprise AWS-Native를 구분**해야 한다. (온프레미스 개요 p.5·7, 배포 백엔드 p.2~3)

| 비교 대상 | 플랫폼·시크릿 구성 | 차이가 나는 부분 |
|---|---|---|
| AWS + Baseline | Kubernetes 위 앱·MPC, Vault KV·Transit·PKI | 제공 개요의 기반은 EKS·Aurora·MSK·ElastiCache 등. Vault는 AWS KMS auto-unseal 사용 |
| 사내 데이터센터 + Baseline | 같은 역할의 앱·MPC·Vault를 배치하는 설계 제안 | 자체 운영 Kubernetes·DB·Kafka·Redis, 사내 DNS·PKI, Vault Shamir unseal 등으로 대체. Dfns 지원 여부와 배포 변경 범위 확인 필요 |
| AWS + Enterprise AWS-Native | 자료상 앱 이미지·MPC·데이터 모델은 동일 | Vault 없이 Secrets Manager·KMS·IAM·cert-manager 등을 사용. 시크릿 전달·인증·초기화 구성이 달라짐 |

이는 제공 자료와 [사내 설계안](03-baseline-datacenter-design.md)을 대조한 설명이다. 구조가 유사하다는 점만으로 같은 설치 패키지·설정·노드 수를 그대로 사용할 수 있다고 판단하지 않는다. 특히 사내 설계안의 36노드 자원표는 AWS 배치 수량으로 제시한 값이 아니다.

## 담당자에게 전달할 질문

### Q01. 사내 데이터센터의 Baseline 전체 플랫폼 배포를 지원하나요?

저희는 고객 소유 AWS 계정이 아닌 **사내 데이터센터에 API·대시보드·정책·MPC·데이터 저장소 전체를 배치**하는 방안을 검토하고 있습니다. Baseline 프로필로 이 구성을 공식 지원하나요? 지원한다면 지원 Kubernetes 배포판·CPU 아키텍처·제품 버전과 설치 모듈·운영 문서를 제공해 주실 수 있나요?

기존 개요에는 고객이 만든 Kubernetes에 Helm chart만 설치하는 방식이 지원 경로가 아니라고 되어 있습니다. 사내 환경에서 사용해야 하는 지원 배포 경로와, 별도 개발·구축 지원이 필요한 범위를 확인 부탁드립니다.

### Q02. AWS Baseline과 비교할 때 어느 계층까지 변경해야 하나요?

자료상 AWS에서도 Baseline을 사용할 수 있고, 첫 계층 이후에는 표준 Kubernetes를 사용하는 것으로 이해했습니다. **AWS의 L1 기반 서비스를 사내 서비스로 대체하면 L2 Platform·L3 Product·L4 Signing은 같은 이미지·chart로 운영할 수 있나요?** 각 계층에서 설정 변경만 필요한지, 모듈 또는 애플리케이션 수정까지 필요한지 구분해 주세요.

특히 EKS·Aurora·MSK·ElastiCache·Route53·ACM·SSM의 대체 요건과, Vault의 AWS KMS auto-unseal을 Shamir 수동 unseal 또는 사내 HSM으로 바꿀 때의 지원 조건을 알고 싶습니다. AWS API·IAM 등에 남는 의존성이 있는지도 확인 부탁드립니다.

### Q03. Vault와 데이터 서비스를 Kubernetes 밖에서 운영할 수 있나요?

Kubernetes와 Vault가 함께 중단되는 상황을 줄이기 위해, 앱·MPC는 Kubernetes에 두고 **Vault와 PostgreSQL·Kafka·Redis는 별도 VM 또는 외부 서비스로 연결**하는 구성을 제안했습니다. 이 배치가 AWS Baseline과 사내 Baseline 각각에서 지원되나요? 권장 구성과 외부 endpoint·TLS·인증·초기화 설정 방법을 안내해 주세요.

MPC Keyshares store도 함께 확인 부탁드립니다. 지원 저장 엔진과 배치 위치, party별 접근 분리, 복제·백업·복구 방식은 무엇이며 두 환경에서 같은 구성을 사용할 수 있나요? Vault·일반 서비스 DB·키 조각 저장소를 함께 복구할 때 필요한 일관성 조건과 공식 복구 순서가 있다면 제공 부탁드립니다.

## 근거와 연결 문서

- [Dfns 온프레미스 배치 개요](00-on-premise-deployment.md): p.5 계층과 AWS 기반 서비스, p.6·17 이미지·설치 제약, p.7 시크릿 백엔드, p.12 Vault 초기화
- [Dfns 배포 백엔드 비교](02-deployment-backends.md): p.2 구성 비교, p.3 공통 구성과 기본 프로필
- [Baseline 사내 데이터센터 설계안](03-baseline-datacenter-design.md): 제안 배치·자원·Vault·저장소·복구 절차
