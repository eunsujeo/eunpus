# Entity: Designated Signer (Fireblocks)

## Summary

Policy가 특정 트랜잭션 타입에 대해 지정하는 서명자. **Non-Signing Admin과 Editor는 MPC 키를 보유하지 않지만, Policy가 designated signer를 정해둔 트랜잭션 타입에 한해 트랜잭션을 initiate할 수 있다** (source: `2026-05-18__support-fireblocks-io__user-roles.md`, p.2–3, p.5).

## Key Concepts

- 권한표 라벨 `NS` (Needs signer): "Only if you designate a signer for their transactions." (p.5)
- NSA와 Editor는 "internal exchange transfer를 제외한 모든 트랜잭션"을 designated signer 흐름으로 initiate 가능 (p.5)

## Details

- NSA: "can initiate transactions when the Policy assigns a designated signer" (p.2).
- Editor: "can also initiate certain transactions if the Policy defines another user capable of signing as a designated signer for that transaction type" (p.3).
- 권한표 *Initiate transactions*에서 NSA·Editor는 `Y (NS)` (p.6).
- 본 자료는 designated signer를 누가 어떻게 지정하는지(룰 표현 문법, 트랜잭션 타입의 범주)에 대한 구체 명세를 제공하지 않는다.

## Related Pages

- [[entities/fireblocks/policy]]
- [[entities/fireblocks/user-roles/non-signing-admin]]
- [[entities/fireblocks/user-roles/editor]]
- [[entities/fireblocks/transaction]]
- [[vendors/fireblocks/user-management]]

## Sources

- `2026-05-18__support-fireblocks-io__user-roles.md`, p.2–3, p.5–6

## Open Questions

- Q-2026-05-18-P01 — designated signer 룰 표현 문법
- Q-2026-05-18-P02 — "internal exchange transfer 제외" 패턴의 트랜잭션 타입 정의 위치
