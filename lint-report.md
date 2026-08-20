# Wiki Lint Report — Stage 35 prep (gap inventory)

_총 48 페이지 점검: vendors/fireblocks/ + entities/fireblocks/ + entities/fireblocks/user-roles/_

Lint 항목 출처: [prompts/update-wiki.md](prompts/update-wiki.md) §Lint 체크리스트

## 1. 6-section template 누락

⚠️ 11 / 48 페이지에서 누락:

- `entities/fireblocks/api-user.md` — 누락: ## Open Questions
- `entities/fireblocks/console-user.md` — 누락: ## Open Questions
- `entities/fireblocks/user-roles/admin.md` — 누락: ## Key Concepts, ## Details
- `entities/fireblocks/user-roles/approver.md` — 누락: ## Key Concepts, ## Details
- `entities/fireblocks/user-roles/editor.md` — 누락: ## Key Concepts, ## Details
- `entities/fireblocks/user-roles/non-signing-admin.md` — 누락: ## Key Concepts, ## Details
- `entities/fireblocks/user-roles/owner.md` — 누락: ## Key Concepts, ## Details
- `entities/fireblocks/user-roles/security-admin.md` — 누락: ## Key Concepts, ## Details
- `entities/fireblocks/user-roles/security-auditor.md` — 누락: ## Key Concepts, ## Details, ## Open Questions
- `entities/fireblocks/user-roles/signer.md` — 누락: ## Key Concepts, ## Details
- `entities/fireblocks/user-roles/viewer.md` — 누락: ## Key Concepts, ## Details, ## Open Questions

## 2. Sources 비어있는데 본문 주장 있는 페이지

⚠️ 2 페이지:

- `vendors/fireblocks/policy-engine.md`
- `vendors/fireblocks/tap.md`

## 3. 단방향 wikilink (양방향 갱신 누락)

⚠️ 138 단방향 link (37 페이지에서 누락)

Top 10 페이지 (out-link 많은 순):
- `lifecycle-events` → 미회신 link 12 개: cosigner, transaction, admin, policy, non-signing-admin...
- `user` → 미회신 link 11 개: policy, recovery-passphrase, admin-quorum, approval-group, designated-signer...
- `mpc` → 미회신 link 8 개: cosigner, risks, recovery-passphrase, 2fa, mobile-device...
- `overview` → 미회신 link 8 개: mpc, cosigner, policy-engine, risks, admin-quorum...
- `risks` → 미회신 link 8 개: api-key, admin-quorum, approval-group, api, mobile-device...
- `security` → 미회신 link 8 개: cosigner, policy, policy-engine, admin-quorum, approval-group...
- `user-management` → 미회신 link 8 개: cosigner, transaction, vault-account, api-co-signer, policy...
- `architecture` → 미회신 link 7 개: cosigner, policy-engine, mobile-device, mpc-key-share, authentication...
- `mobile-app` → 미회신 link 7 개: cosigner, policy, admin-quorum, 2fa, mobile-device...
- `api` → 미회신 link 6 개: callback-handler, transaction, workspace, ip-allowlist, api-co-signer...

## 4. open-questions Status 표기 일관성

- 총 Q entries (Details 섹션): 70
- `**Status**:` field 보유: 70
- Status 분포: {'answered': 21, 'partial': 7, 'open': 42}
- Summary 의 `ANSWERED` inline 마커 (참고용 중복 표기): 42

✅ **표기 일관** — 모든 Q entry 가 `**Status**: <state> (date, Stage N)` 형식 준수.

## 5. 중복 entity 정의 (동일 h1 title 다중 위치)

✅ 중복 entity 정의 없음 (canonical 1 페이지 원칙 준수)

## 6. Stage 라벨 정합 (wiki ↔ log.md)

- log.md stage 수: 21
- wiki 페이지에서 참조된 stage 수: 17
- ⚠️ wiki 가 참조하는데 log 에 없는 stage: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
- ℹ️ log 에 있지만 wiki 미참조 stage (최근 10개): ['20', '21', '23', '25', '26', '27', '32', '33', '34', '35'] (총 14 개)

---

## Summary — 발견된 issue 별 priority

| Issue | 건수 | Priority |
|---|---|---|
| 6-section 누락 | 11 | high |
| Sources 부재 + 본문 주장 | 2 | high |
| 단방향 wikilink | 138 | medium |
| Status field 부재 | 0 | - |
| 중복 entity | 0 | - |
| Stage orphan | 10 | medium |

→ **Plan 4 (Status 통일)** = 가장 큰 영향. Plan 3 종료 후 진행.
→ 단방향 wikilink + 6-section 누락 = 후속 stage 에서 점진 개선.
