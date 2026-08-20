# DB Schema 작성 규약 (DB 설계 문서)

DB schema 가 본문에 등장하는 문서의 패턴. 단순히 SQL DDL 을 dump 하는 것이 아니라, 각 컬럼의 의미와 운영 함의가 reader 에게 명확히 전달되어야 한다.

## 1. CREATE TABLE 직후 필드별 표

모든 `<pre><code>CREATE TABLE …</code></pre>` 뒤에 필드별 설명 표가 필수:

```html
<pre><code>CREATE TABLE foo (
  id           BINARY(16) PRIMARY KEY,
  name         VARCHAR(128) NOT NULL,
  status       ENUM('active', 'archived') NOT NULL,
  created_at   DATETIME(6) NOT NULL,
  ...
);</code></pre>

<div class="table-wrap">
<table>
<thead><tr><th style="width:24%">컬럼</th><th style="width:18%">자료형</th><th>역할</th></tr></thead>
<tbody>
<tr><td><code>id</code></td><td>BINARY(16) PK</td><td>고유 식별자</td></tr>
<tr><td><code>name</code></td><td>VARCHAR(128)</td><td>사람이 읽는 라벨</td></tr>
<tr><td><code>status</code></td><td>ENUM (2 값)</td><td>현재 상태 — <strong>active</strong> 활성 / <strong>archived</strong> 보관</td></tr>
<tr><td><code>created_at</code></td><td>DATETIME(6)</td><td>생성 시각. set-once</td></tr>
</tbody>
</table>
</div>
```

컬럼 너비: 24% / 18% / rest (Korean 컬럼명 충분, 자료형 짧게, 역할 풍부).

## 2. ENUM 컬럼 처리

ENUM 값이 ≤ 10 개:
- SQL 안에서는 단일 라인: `status ENUM('active', 'archived', 'failed') NOT NULL`
- 필드 표의 역할 셀에 각 값을 풀어쓰기: "<strong>active</strong> 활성 / <strong>archived</strong> 보관 / <strong>failed</strong> 실패"

ENUM 값이 > 10 개:
- SQL 도 줄바꿈으로
- 별도 표로 값별 의미 풀어쓰기

## 3. Audit 컬럼 패턴 (표준 schema discipline)

```sql
CREATE TABLE entity (
  id          BINARY(16) PRIMARY KEY,
  ...
  created_by  BINARY(16) NOT NULL,        -- 생성한 user. set-once
  created_at  DATETIME(6) NOT NULL,        -- set-once
  modified_by BINARY(16) NOT NULL,         -- 마지막 변경자 (변경 시 갱신)
  modified_at DATETIME(6) NOT NULL         -- 마지막 변경 시각
);
```

**`updated_at` 금지** — `modified_at` 사용. 이유: 본 코드베이스의 audit-strict 규약. CREATE 시점 (created_at, set-once) 과 변경 시점 (modified_at, mutable) 의 역할이 다름.

## 4. Change events 테이블 (audit trail)

본체 변경 이력은 별도 `*_change_events` 테이블 (append-only):

```sql
CREATE TABLE entity_change_events (
  id            BINARY(16) PRIMARY KEY,
  entity_id     BINARY(16) NOT NULL,
  event_type    ENUM('created', 'renamed', 'archived') NOT NULL,
  field_name    VARCHAR(64) NOT NULL,
  old_value     JSON,
  new_value     JSON,
  actor_user_id BINARY(16) NOT NULL,
  audit_event_id BINARY(16),                -- audit 평면 cross-DB binding
  occurred_at   DATETIME(6) NOT NULL,
  KEY (entity_id, occurred_at)
);
```

- `entity` 본체에는 마지막 modified_by/at 만 — "현재 스냅샷"
- `entity_change_events` 에는 모든 변경 이력 — "역사"

## 5. 다대다 관계는 junction table

다중 role 같은 다대다 관계를 본체에 단일 ENUM 으로 두지 말 것. junction table 로:

```sql
CREATE TABLE entity_roles (
  id          BINARY(16) PRIMARY KEY,
  entity_id   BINARY(16) NOT NULL,
  role        ENUM(...) NOT NULL,
  granted_by  BINARY(16) NOT NULL,
  granted_at  DATETIME(6) NOT NULL,
  revoked_by  BINARY(16),
  revoked_at  DATETIME(6),
  KEY (entity_id, role),
  KEY (entity_id, revoked_at)
);
```

장점:
- 한 entity 가 여러 role 동시 보유 가능
- 각 role 의 grant/revoke 가 독립적으로 audit
- revoked_at IS NULL 로 현재 active role 조회

## 6. Approval-gated action

특정 action (entity 생성, 정책 변경 등) 이 Admin Quorum 등의 승인을 거쳐야 하는 경우:

```sql
CREATE TABLE entity (
  ...
  created_by            BINARY(16) NOT NULL,   -- 요청자
  created_at            DATETIME(6) NOT NULL,
  approved_by_quorum_id BINARY(16) NOT NULL,   -- Quorum 의 id (FK → admin_quorums.id). set-once
  approved_at           DATETIME(6) NOT NULL,  -- threshold 충족 시각. set-once
  ...
);
```

- `created_by` = 요청 시작한 user
- `approved_by_quorum_id` = 승인한 quorum (당시의 quorum membership 은 시간이 지나면 변할 수 있음에 주의)
- `approved_at` = N-of-M 충족 시각
- 둘 다 set-once

## 7. Approver-level signature 는 audit 평면 위임

본 schema 의 `approved_by_quorum_id` 는 **quorum 의 id 만** 가리킨다. "그때 누가 sign 했는지" 의 individual signer trail 은 audit 평면 (`approval_decisions` 등) 에 보관.

이유: quorum membership 은 시간에 따라 변하므로 historical signer trail 이 별도로 필요. 그리고 본 schema 가 hairy 해지지 않도록.

이 위임은 "본 schema 의 범위 밖" callout 으로 명시:

```html
<div class="callout">
<div class="callout-title">본 schema 의 범위 밖 — 후속 검토 위치</div>
<ul>
<li><strong>Approver-level audit trail (N-of-M 의 specific signatures)</strong> — 본 schema 의 <code>approved_by_quorum_id</code> 는 quorum 자체의 id 만 가리키므로 "그 시점에 누가 sign 했는지" 의 trail 이 없음. → audit 평면의 <code>approval_decisions</code> + <code>audit_events</code> hash chain 패턴</li>
</ul>
</div>
```

## 8. Append-only / set-once marker

SQL comment 에 `★ append-only`, `★ set-once` 명시:

```sql
-- ★ append-only — 한 번 INSERT 된 row 는 UPDATE/DELETE 절대 불가 (trigger 로 강제)
CREATE TABLE chain_events (
  id              BINARY(16) PRIMARY KEY,
  ...
  observed_at     DATETIME(6) NOT NULL
);

CREATE TABLE entity (
  ...
  cleared_at      DATETIME(6),     -- ★ set-once — NULL → 값 1회만 허용
  ...
);
```

이 marker 는 wiki 내부 마커가 아니라 **schema discipline functional marker** — 유지 대상.

## 9. Reorg / unhappy path 표현 의무

특히 blockchain/external system 동기화 schema 는 reorg / out-of-order / partial failure 같은 unhappy path 가 발생 가능. 빈도는 낮아도 schema 가 표현 못 하면 발생 시 정정 불가.

표현 패턴:
- chain_events 같은 raw observation 테이블은 append-only (UPDATE/DELETE 금지)
- reorg 발생 시 row 삭제 안 함 — `reorged_at` 같은 별도 컬럼 set
- 새 chain branch 의 event 는 새 row 로 INSERT
- 이미 잔액 반영된 경우 ledger 평면에 reversal entry (append-only)

페이지에 "Reorg 처리" 절을 두고 chain 별 위험도 + 3~4 단계 schema 처리 명시.

## 10. 보안 / forbidden columns

다음은 절대 DB 에 plaintext 로 저장하지 않음:
- private key / mnemonic / reconstructed key / raw MPC share
- HSM PIN / TEE sealing key / DCAP attestation private key
- master KEK plaintext / API credential plaintext

저장 형태:
- HSM-wrapped (key ref 만 컬럼에) — 예: `api_credential_hsm_keyref VARCHAR(128) NOT NULL, -- ★ HSM-wrapped, never plaintext`
- TEE-sealed
- Hash 만 (검증용)

페이지에 "Forbidden columns 의 ABSENCE 가 schema 자체로 보이도록 audit" 명시.

## 11. Cross-page reference 가 sidebar 번호와 일치

페이지의 inline link `<a href="X.html">N. Label</a>` 의 N 이 sidebar 의 같은 페이지 번호와 일치해야 함. page split 후 어긋나기 쉬움. scripts/check-consistency.py 가 자동 sweep.
