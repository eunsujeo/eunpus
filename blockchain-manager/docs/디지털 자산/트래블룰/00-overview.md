---
title: 트래블룰 — 업무 구조와 문서 안내
status: Done
date: 2026-08-19
view: grid
---

# 트래블룰 업무 구조

트래블룰은 VASP 사이에서 송금인·수취인 정보를 별도 채널로 교환하고, 그 판정 결과를 출금 승인과 입금 가용 처리에 반영하는 업무다.

## 트래블룰 문서 구성

| 문서 | 다루는 범위 |
|---|---|
| [출금 처리](./01-withdrawal-flow.md) | 고객 요청부터 상대 검증, 온체인 제출, 결과 보고까지 |
| [IVMS101 필드](./02-ivms101-field-reference.md) | 표준 엔티티, 개인·법인·VASP 필드, 코드와 제약 |
| [표준과 VerifyVASP](./03-ivms101-verifyvasp-mapping.md) | InterVASP 정본과 VerifyVASP 제품 payload의 필드 매핑 |
| [입금 처리](./04-deposit-flow.md) | 사전 보고, 온체인 감지, 가용 보류, 반환 |
| [개인지갑](./05-self-hosted-wallet.md) | 소유·통제 증명과 위험 기반 정책 |
| [솔루션 비교](./06-solutions-and-reachability.md) | VerifyVASP·CODE·Notabene 구조와 도달성 |
