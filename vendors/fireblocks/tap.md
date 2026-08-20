---
type: vendor-hub
vendor: fireblocks
status: stable
tags: [transaction, policy, governance, api]
last_updated_stage: 156
source_count: 1
related:
  - policy
  - policy-engine
  - designated-signer
  - approval-group
  - transaction
---
# Fireblocks — TAP (Transaction Authorization Policy)

> 트랜잭션 단위 권한·승인 규칙. Policy Engine 위에서 동작. 본 페이지는 **Policy Editor API 표면**(rule object schema · publish/edit · 검증 · 승인 관문)을 다룬다 — Console 측 개념 spine (3 action, first-match, 5 default rule, rule ordering) 은 [[entities/fireblocks/policy]] 가 canonical (★ 중복 정의 금지).

## Summary

TAP 는 Console 뿐 아니라 **Policy Editor API 로도 구성 가능**하다. Policy Rule object 배열을 publish request 로 보내면 draft 가 생성·검증되고, **발효는 반드시 Console 의 Owner "Review Policy changes" 리뷰 + mobile 승인을 거친다** — API 단독으로 정책이 발효되지 않는다 (source: `reference-configure-transaction-authorization-policy.md` §"Approving the Policy change inside the Console"). 엔드포인트 경로 그룹은 `policy-editor-beta`.

## Key Concepts

- **Policy Rule object 필수 필드**: `action` / `asset` / `amountCurrency` / `src`·`dst` / `amountScope` / `amount` / `periodSec` / `type` (source: `reference-configure-transaction-authorization-policy.md` §"The Policy Rules structure")
- **action enum = `ALLOW` / `BLOCK` / `2-TIER`** — Console 문서의 3-action (Allow / Approved by / Block, [[entities/fireblocks/policy]] Stage 10) 과의 명시적 대응은 본 자료에 없음 → Q-2026-07-14-01
- **amountScope** = `SINGLE_TX` | `TIMEFRAME`. TIMEFRAME 시 `periodSec`(초) 동안 누적 금액 매칭. SINGLE_TX 면 `periodSec: 0` 필수 (같은 문서 §"The Policy Rules structure")
- **transactionType 8종**: `TRANSFER`(default) / `CONTRACT_CALL` / `APPROVE` / `MINT` / `BURN` / `STAKE` / `RAW` / `TYPED_MESSAGE` (§"transactionType")
- **externalDescriptor** = rule 고유 string ID. 기존 rule overwrite 시 지정 + validation `checkResult` 에서 참조 (§"externalDescriptor")
- **operators** (initiator 지정) = `users[]` | `userGroups[]` | `wildcard: "*"` (§"Operators")
- **SRC·DST 구조** = array-of-arrays. 각 배열 = [wildcard] | [ID, Type] | [ID, Type, Subtype]. Type: `VAULT` / `EXCHANGE` / `UNMANAGED` / `NETWORK_CONNECTION` / `FIAT_ACCOUNT` / `ONE_TIME_ADDRESS`. **ONE_TIME_ADDRESS · UNMANAGED · NETWORK_CONNECTION 은 DST 전용** (§"SRC & DST", §"transactionType" Note)
- **발효 관문 (★)**: publish request 실행 → Owner 가 Console Settings 에서 "Review Policy changes" 리뷰 → mobile 승인. [[entities/fireblocks/policy]] 의 Q+O 거버넌스와 정합 (§"Approving the Policy change inside the Console")

## Details

### Publish / Edit 흐름

- **Send publish request for a set of policy rules** endpoint — 전체 Policy 를 rules 배열 payload 로 전달 (부분 patch 가 아니라 set 단위) (§"Publishing, approving and validating Policy rules")
- SDK: `publishPolicyRules` 메서드 (§"Publish a Policy using an SDK")
- **기존 rule 수정** = rule object 에 기존 `externalDescriptor` ID 를 넣어 overwrite. ID 는 **Get the active policy and its validation** endpoint 로 획득 (§"Edit an Existing Policy rule")
- draft 응답: `draftResponse` { `draftId`, `status` (예: `UNVALIDATED`), `rules[]` } (§"Policy examples")

### Rule 세부 키 (Customizing)

- **amountAggregation** — `operators` / `srcTransferPeers` / `dstTransferPeers` 각각 `ACROSS_ALL_MATCHES` 로 timeframe 누적 매칭 구성 (§"Time-Based Threshold")
- **applyForApprove** — Contract_Call rule 이 Web3 초기 "Approve" tx 를 매칭 (§"applyForApprove")
- **applyForTypedMessage** — Contract_Call rule 이 EIP-712 / ETH personal message 서명을 매칭. 별도 Typed_Message rule 로 분리 가능 (§"applyForTypedMessage")
- **rawMessageSigning** — `derivationPath`(필수) + `algorithm`(선택, 예: `MPC_ECDSA_SECP256K1`) 로 Raw Signing 메시지 매칭. source 가 "All vaults" 일 때 적용 (§"rawMessageSigning")
- **allowedAssetTypes** (예: `FUNGIBLE`), **dstAddressType** (`ONE_TIME` | `WHITELISTED`) — 예시 payload 에서 확인 (§"Policy examples")
- **designatedSigners** = { `users[]`, `usersGroups[]` } — [[entities/fireblocks/designated-signer]] 의 API 표현 (§"Policy examples")
- **authorizationGroups** = { `logic` (예: `OR`), `groups[]` ({ `th` = N-of-M threshold, `users[]`, `usersGroups[]` }), `allowOperatorAsAuthorizer` } — [[entities/fireblocks/approval-group]] 의 rule-level sub-quorum + [[vendors/fireblocks/api]] `transaction-authorization-objects` 의 `AuthorizationInfo` schema 와 정합 (§"Policy examples")

### Policy Validation

publish 제출 시 Fireblocks 가 rule 을 검증하고 응답에 반환 (§"Policy Validation"):

- `status` — Policy operation 상태 (예: `INVALID_CONFIGURATION`)
- `checkResult` { `errors` (총 개수), `results[]` { `index` (rule 위치), `externalDescriptor`, `status`, `errors[]` { `errorMessage`, `errorCode`, `errorCodeName`, `errorField` } } }

### Metadata 응답

`metadata` { `editedAt` / `editedBy` / `publishedAt` / `publishedBy` } — 편집·게시의 주체(user ID)와 시점이 응답에 남는다 (§"Metadata response object"). API 대행 서비스가 게시 요청 스냅샷 대조를 할 때의 기준 필드.

## Related Pages

- [[entities/fireblocks/policy]] — Console 측 canonical (3 action, first-match, 5 default rule, Q+O 거버넌스)
- [[vendors/fireblocks/policy-engine]]
- [[vendors/fireblocks/api]] — `transaction-authorization-objects` 3 schema (`AuthorizationInfo` 등)
- [[entities/fireblocks/designated-signer]] — rule object 의 `designatedSigners` 키
- [[entities/fireblocks/approval-group]] — rule object 의 `authorizationGroups` (th N-of-M)
- [[entities/fireblocks/transaction]]

## Sources

- `2026-05-22__developers-fireblocks-com__reference-configure-transaction-authorization-policy.md` (773 lines — rule object 구조 · publish/edit · Console 승인 관문 · validation · 예시 payload) (Stage 156 promote)

## Open Questions

- Q-2026-07-14-01 — API action enum `2-TIER` 와 Console 3-action "Approved by" 의 대응 여부
- Q-2026-07-14-02 — Policy Editor V2 표면과 `policy-editor-beta` 경로의 관계 · GA 상태
