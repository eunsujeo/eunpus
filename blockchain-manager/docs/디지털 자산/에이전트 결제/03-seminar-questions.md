---
title: 에이전트 결제 — 세미나 확인 질문
status: To Do
date: 2026-08-21
---

# AWS 세션에서 확인할 질문

"Do Agents Dream of Electronic Payments" (AWS) 세션용 질문 목록이다. 각 질문은 이 카테고리 문서에서 공개 자료로 확인하지 못한 항목에서 나왔고, 답을 얻으면 해당 문서와 wiki open question (STBL08 연계 항목) 을 갱신한다.

**Q1. facilitator/sponsor 의 수수료·정산 모델은 무엇인가?**
대납된 가스와 대행 수수료가 누구에게 어떻게 청구되는지가 총비용을 가른다. 공개 문서에서 확인하지 못했다 ([AgentCore payments](02-agentcore-payments.md) 통제 모델 절).

**Q2. Facilitator 역할은 실제로 어느 업체가 맡나?**
x402 스펙과 AWS 문서 모두 역할로만 두고 있다 — merchant 가 직접 운영하는 것이 일반적인지, 제3자 facilitator 서비스 시장이 있는지 ([AgentCore payments](02-agentcore-payments.md) 역할과 업체 표).

**Q3. USDC 데모 구성에서 검증·정산은 누가 수행하나?**
직접 정산과 facilitator 위임 두 구성이 가능하다 ([AgentCore payments](02-agentcore-payments.md) 결제 흐름의 alt 분기). 데모가 어느 쪽인지 확인한다.

**Q4. 세션 한도 (금액·통화·만료) 이상의 결제 정책 표현력 계획이 있나?**
merchant·asset 별 정책식은 공개 문서에서 확인하지 못했고, 고액 커머스 확장 (AWS 로드맵) 에는 더 촘촘한 표현력이 필요해 보인다는 것이 팀 해석이다 ([AgentCore payments](02-agentcore-payments.md) 통제 모델·비용 절).

**Q5. 법정화폐 결제 지원의 로드맵 시점은?**
x402 v2 의 asset 은 ISO 4217 통화 코드를 허용하고 AWS 는 법정화폐 지원을 로드맵에 두고 있다 ([개요](00-overview.md)). 시점·범위를 확인한다.
