---
type: vendor-hub
vendor: fireblocks
status: draft
tags: [architecture]
stage_introduced: 7
last_updated_stage: 7
source_count: 2
related:
  - admin-quorum
  - api
  - architecture
  - blockchains
  - callback-handler
  - compliance
  - cosigner
  - mpc
  - policy-engine
  - risks
  - tap
  - user-management
  - workspace
---
# Fireblocks — Overview

> Fireblocks가 어떤 제품/플랫폼인지에 대한 1차 개관. 다른 모든 vendor 페이지의 진입점.

## Summary

_TODO: Fireblocks의 회사·제품 라인업·핵심 가치 제안은 추후 자료(웹사이트·whitepaper 등)로 채운다. 현재 자료는 Help Center의 IAM 문서만 보유._

본 자료에서 확인 가능한 부분만: Fireblocks는 **workspace**라는 격리 단위 위에 **9개 user role**과 **MPC 기반 서명**, **Admin Quorum 거버넌스**, **Policy 변경의 Q+O 승인**을 제공한다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.1–8). 자세한 사용자·거버넌스 모델은 [[vendors/fireblocks/user-management]] 참고.

## Key Concepts

- **Workspace** — 격리·거버넌스 단위. hot / cold / Sandbox 종류 (p.1, p.8)
- **User role** — 9개 (Owner / Admin / NSA / Signer / Approver / Editor / Viewer / Security Auditor / Security Admin) (p.1–4)
- **Admin Quorum + Owner** — 변경·승인의 거버넌스 흐름 (Q / Q+O / AG 라벨) (p.4–5)
- **MPC key share** — Owner 단독 provisioning (p.5)
- **API Co-signer, Callback Handler** — Signer의 programmatic 동작 표면 (이름만 확인됨, 내부 명세는 추후 자료) (p.3)

_TODO: 위 외에 Vault·Policy Engine·TAP·Compliance 등은 후속 ingest로 채운다._

## Details

_TODO: 회사·제품 라인업, 주요 사용처(거래소·커스터디·핀테크·게임 등), 경쟁군 위치 — 추후 자료로._

### Users & Governance (1차 자료 기반)

본 위키의 가장 잘 채워진 영역. 자세한 사항은 [[vendors/fireblocks/user-management]]를 참조:

- 9 user role의 권한 매트릭스 (User management / Transactions / Assets and addresses / Workspace management 4개 표)
- 라벨 vocabulary: Q (Quorum required) / Q+O (Quorum + Owner) / AG (Approval group) / NS (Needs signer) / TL (Token limits)
- Sandbox workspace의 별도 role 모델 (3 role, backend가 Owner 수행, auto-approve)


## Related Pages

- [[vendors/fireblocks/user-management]] — 9 role, 권한표, Sandbox 차이
- [[vendors/fireblocks/architecture]]
- [[vendors/fireblocks/mpc]]
- [[vendors/fireblocks/policy-engine]]
- [[vendors/fireblocks/tap]]
- [[vendors/fireblocks/cosigner]]
- [[vendors/fireblocks/callback-handler]]
- [[vendors/fireblocks/api]]
- [[vendors/fireblocks/compliance]]
- [[vendors/fireblocks/risks]]
- [[vendors/fireblocks/blockchains]] — 자산 도메인 (Stage 7, 100+ chain catalog hub)
- [[entities/fireblocks/workspace]]
- [[entities/fireblocks/admin-quorum]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1–8
  - 원본 URL: https://support.fireblocks.io/hc/en-us/articles/360012832959-User-roles

## Open Questions

페이지별 미해결은 [[open-questions/fireblocks]] 참조. 현재 알려진 큰 갭:

- 회사 개요·제품 라인업·가치 제안 — 1차 자료 부재
- MPC 프로토콜·share 분포 (Q-2026-05-18-M01)
- Policy 룰 표현 문법 (Q-2026-05-18-P01)
- API Co-signer / Callback Handler 명세 (Q-2026-05-18-C01)
- hot / cold workspace 비교 (Q-2026-05-18-W01)
