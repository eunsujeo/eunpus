---
title: 에이전트 결제 — 발표 자료 이후 남은 확인 질문
status: To Do
date: 2026-08-31
---

# 발표 자료 이후 남은 확인 질문

AWS 담당자 발표 자료에도 나오지 않은 비용·운영 조건만 남긴다. 발표에서 확인된 Relayer의 `transferWithAuthorization` 실행, PaymentSession 한도, KMS·Nitro Enclaves 키 격리와 컴플라이언스 결제 사례는 [AWS의 Web3 키 격리와 AI 에이전트 결제 구조](04-aws-wallet-key-and-agent-payment.md)에 반영했다.

**Q1. facilitator/sponsor 의 수수료·정산 모델은 무엇인가?**
대납된 가스와 대행 수수료가 누구에게 어떻게 청구되는지가 총비용을 가른다. 공개 문서에서 확인하지 못했다 ([AgentCore payments](02-agentcore-payments.md) 통제 모델 절).

**Q2. Facilitator 역할은 실제로 어느 업체가 맡나?**
x402 스펙과 AWS 문서 모두 역할로만 두고 있다 — merchant 가 직접 운영하는 것이 일반적인지, 제3자 facilitator 서비스 시장이 있는지 ([AgentCore payments](02-agentcore-payments.md) 역할과 업체 표).

**Q3. 세션 한도 (금액·통화·만료) 이상의 결제 정책 표현력 계획이 있나?**
merchant·asset 별 정책식과 지원 예정 필드는 발표 자료와 공개 문서에서 확인되지 않는다 ([AgentCore payments](02-agentcore-payments.md) 통제 모델·비용 절).

**Q4. 법정화폐 결제 지원의 로드맵 시점은?**
x402 v2 의 asset 은 ISO 4217 통화 코드를 허용하고 AWS 는 법정화폐 지원을 로드맵에 두고 있다 ([개요](00-overview.md)). 시점·범위를 확인한다.
