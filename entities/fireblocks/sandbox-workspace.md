---
type: entity
vendor: fireblocks
status: stable
tags: [workspace, governance]
stage_introduced: 4
last_updated_stage: 4
source_count: 2
related: [api-user, editor, non-signing-admin, user-management, viewer, workspace]
---
# Entity: Sandbox Workspace (Fireblocks Developer Sandbox)

## Summary

개발과 실험을 위한 무료 가입 workspace 종류. 모바일 서명 디바이스를 요구하지 않으며 모든 트랜잭션이 auto-approve된다. 제공 role은 NSA, Editor, Viewer 3개뿐이며 backend service가 Owner role을 맡는다 (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.8).

## Key Concepts

- API user 생성 시 CSR 인증서가 **브라우저에서 자동 생성** (p.8)
- **Developer Area API Monitoring** — 24시간, 7일 단위로 API call/error를 표시 (p.8)
- **모바일 서명 디바이스 불필요. 모든 트랜잭션 auto-approve.** (p.8)
- 제공 role 3개: Non-Signing Admin / Editor / Viewer (p.8)
- **Backend service가 Owner role**을 맡고 auto-approval 처리 (p.8)
- Sandbox의 NSA는 mainnet/testnet에 없는 추가 능력 (p.8):
  - Creating and deleting users
  - Resetting 2FA for workspace users
  - **Signing transactions** (이름과 달리)

## Details

- 본 자료 §"User roles in Developer Sandboxes"에서 Sandbox와 mainnet/testnet workspace의 차이를 다룬다 (`user-roles.md`, p.8).
- hot / cold workspace에 대한 비교 정보는 본 자료에 부분적이며, hot workspace 한정이라 명시되어 있다 (`user-roles.md`, p.1).

### Sandbox와 testnet의 관계 (Stage 4 참고)

`add-api-users.md`, p.2는 **testnet** workspace에서 *Fireblocks Communal Test Co-signer*를 선택할 수 있다고 명시한다. Sandbox와 testnet이 어떻게 구분되는지(Sandbox ⊂ testnet 인지, 별개 종류인지)는 본 자료군에서 직접 비교 페이지가 없음 → [[open-questions/fireblocks]] Q-2026-05-18-W01과 함께 추적.

## Related Pages

- [[entities/fireblocks/workspace]]
- [[entities/fireblocks/user-roles/non-signing-admin]] — Sandbox의 사실상 최상위 role
- [[entities/fireblocks/user-roles/editor]]
- [[entities/fireblocks/user-roles/viewer]]
- [[entities/fireblocks/api-user]]
- [[vendors/fireblocks/user-management]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.1, p.8
- (cross-ref) `2026-05-18__support-fireblocks-io__add-api-users.md`, p.2 (testnet Communal Test Co-signer)

## Open Questions

- Q-2026-05-18-M02 — backend service가 Owner role을 맡을 때의 보안 모델
- Q-2026-05-18-W01 — hot / cold / Sandbox 종합 비교 자료 필요
