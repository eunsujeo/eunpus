# 15. DB Split & PostgreSQL Operational Considerations
> 7-DB split 의 근거 + PostgreSQL 운영의 실무 고려사항

이 문서는 본 reference 의 DB 분할 결정의 정당화 + PostgreSQL 의 운영 measure 를 정리합니다.

---

## 1. 7-DB split 의 근거

### 1.1 본 reference 의 DB 배치

| DB | 도메인 | Mutability profile |
|----|--------|-------------------|
| **walletdb** | Wallet Topology (customers, vaults, wallets, addresses) | `M-mut` 중심 + 일부 `A-set` |
| **ledgerdb** | Ledger & Settlement (ledger_accounts, ledger_entries, internal_transfers, withdrawals, withdrawal_events, deposit_observations) | `A-row` (entries) + `M-mut` (state) — 가장 mixed |
| **approverdb** | Approval & Governance (policy_rules, change_log, approval_requests, approval_decisions, held_decisions, condition_sets, initiator_nonce_seen) | `M-mut` (rules) + `A-row` (decisions, change_log) + `A-row` (nonce_seen) |
| **auditdb** | Audit Evidence + Signing Execution + Recovery Ceremony (audit_events, audit_checkpoints, signing_events, signing_requests, key_lifecycle, master_key_operations, recovery_events, ceremony_quorum_votes) | `A-row` (대부분) + hash chain |
| **chaindb** | Transaction Orchestration + Deposit Observation의 chain side (transactions, broadcast_attempts, confirmations, chain_events) | `A-row` + 일부 `M-mut` (transactions.status) |
| **providerdb** | Provider Mapping (provider_accounts, provider_external_references, provider_event_log, provider_state_diff) | mixed |
| **recondb** | Reconciliation & Consistency (reconciliation_sessions, snapshots, mismatch_findings, investigation_notes) | `A-row` + `M-mut` (state) |
| **monitordb** (옵션) | Operational Monitoring (health_checks, drift_signals, mismatch_alerts, incident_records) | mixed |

### 1.2 왜 split 하는가 — 5 가지 이유

#### 1.2.1 Mutability isolation

`A-row` (audit, ledger entries) 와 `M-mut` (wallet metadata, policy rules) 를 같은 DB 에 두면:
- 운영자가 `M-mut` 를 자주 update — autovacuum + bloat
- `A-row` 의 trigger 가 모든 query 에 평가됨 — performance overhead
- backup / replication 정책이 mixed (sync vs async)

분리하면:
- audit DB 는 **순수 append-only** profile — vacuum 최소, replication 정책 명확
- wallet DB 는 자유롭게 mutate — 단 audit trail 은 audit DB 로

#### 1.2.2 Blast-radius reduction

한 DB 의 corruption / 보안 사고 = 그 DB 의 도메인만 영향:
- ledgerdb 손상 = wallet topology 와 audit 는 무사
- approverdb 손상 = policy reset 가능; audit 는 보존

Single DB 라면 single point of failure.

#### 1.2.3 Operational separation

각 service 의 ownership 명확:
- Wallet Service → walletdb 만 write
- Ledger Service → ledgerdb 만 write
- Audit Service → auditdb 만 write
- ...

권한 escalation 회피:
- Wallet Service 의 compromise 가 ledger 직접 write 불가능 (다른 DB credentials 필요)

#### 1.2.4 Audit separation

External auditor 가 auditdb 만 read-only access — 다른 DB 의 운영 데이터에 접근하지 않고 audit defense 검증 가능. Privacy / regulatory 도 단순화.

#### 1.2.5 Runtime isolation

각 DB 의 connection pool / load 가 격리:
- ledgerdb 의 reconciliation query 가 무거워도 wallet API 에 영향 없음
- chaindb 의 backfill 작업이 audit chain 에 영향 없음

### 1.3 Trade-offs (분할의 cost)

| Trade-off | 영향 | 완화 |
|----------|------|------|
| **Cross-DB FK 불가** | application 검증 필요 + 정기 reconciliation | 본 reference 가 그 자체로 다룸 |
| **Multi-DB transaction 불가** | 2PC 또는 outbox pattern | outbox 권장 |
| **운영 복잡도 ↑** | DBA 가 7 개 instance 관리 | 자동화 + 표준화 |
| **Connection pool 의 multi-DB** | application 의 DB routing | service mesh 또는 application code |
| **Backup / restore 의 동기화** | 7 개 DB 의 backup window | 같은 시점 snapshot 권장 |
| **Schema migration 의 coordination** | 도메인 간 schema 변경 시 ordering | governance event |

본 reference 는 **multi-DB benefit > cost** 로 판단. 단, 작은 institution (단일 customer, 단일 chain) 에서는 single DB + schema-per-domain 도 valid.

### 1.4 단일 DB 의 대안

scale 이 작거나 운영 단순성이 critical 한 경우:

```
single DB (postgres) with schemas:
  - wallet_schema
  - ledger_schema
  - approver_schema
  - audit_schema
  - chain_schema
  - provider_schema
  - recon_schema
```

- Same DB 안에서 schema 분리 — 같은 connection pool
- Cross-schema FK 가능 — application integrity 단순
- Backup 단일 — operational 단순
- 단, blast-radius / runtime isolation 약함

institution 의 scale + 운영 capacity 에 따라 선택. 본 reference 의 7-DB 는 institutional 권장; small-scale 은 single-DB + schemas.

---

## 2. PostgreSQL 의 운영 considerations

### 2.1 Transaction isolation 가정

본 reference 의 모든 write transaction 은 **READ COMMITTED 또는 그 이상** 가정:

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- default
```

특정 case 에서 SERIALIZABLE 권장:
- Reconciliation session 의 snapshot — `SERIALIZABLE` 또는 `REPEATABLE READ`
- 같은 account 의 concurrent withdrawal — `SERIALIZABLE` (또는 row-level lock + READ COMMITTED)

```sql
-- Reconciliation snapshot
BEGIN ISOLATION LEVEL REPEATABLE READ;
  -- snapshot consistent across multiple SELECTs
COMMIT;
```

### 2.2 Deadlock-sensitive workflows

| Workflow | Deadlock 가능성 | 회피 |
|---------|----------------|------|
| Concurrent withdrawal (same source) | 높음 (ledger_accounts row lock) | 항상 같은 순서 lock + advisory lock |
| Internal transfer (debit + credit, 2 accounts) | 중간 (둘 다 lock) | account_id ascending order |
| Audit event hash chain (concurrent INSERT 같은 partition) | 중간 (audit_partition_state lock) | application 의 single-writer per partition 권장 |
| Reconciliation cross-DB query | 낮음 (read-only) | N/A |

```sql
-- 권장 pattern: account_id 정렬 후 lock
BEGIN;
  SELECT id FROM ledger_accounts
    WHERE id IN ($src, $dst)
    ORDER BY id  -- consistent ordering
    FOR UPDATE;
  -- ... operations ...
COMMIT;
```

### 2.3 Append-only 의 write amplification

`A-row` 테이블이 자주 INSERT 되면:
- WAL (Write-Ahead Log) 의 growth
- replication bandwidth 의 부담
- backup 의 incremental 크기

완화:
- Partitioning 으로 hot partition 만 active write
- WAL compression 활성화 (`wal_compression = on`)
- Read replica 의 async replication 으로 read load 분산

### 2.4 Reconciliation query 의 cost

Reconciliation 의 cross-domain query 가 무거움 — 큰 ledger 의 full scan 가능:

```sql
-- 무거운 query 예시
SELECT account_id, SUM(amount) FROM ledger_entries
WHERE state = 'confirmed' AND reversed_by_entry_id IS NULL
GROUP BY account_id;
-- 1억 row 의 ledger 면 분 단위 소요
```

완화:
- Read replica 에서 실행 (production write 영향 없음)
- 정기 batch 로 cache 결과 별도 테이블에 저장
- Partition pruning 활용 (time range)
- Statement timeout 으로 runaway query 차단:
  ```sql
  SET statement_timeout = '5min';
  ```

### 2.5 Partition pruning 의 활용 패턴

```sql
-- ✓ 좋은 query — partition key 가 WHERE 에
SELECT * FROM ledger_entries
WHERE created_at >= '2026-05-01' AND created_at < '2026-06-01'
  AND account_id = $1;
-- → 1 partition + index scan

-- ✗ 나쁜 query — partition key 없음
SELECT * FROM ledger_entries WHERE account_id = $1;
-- → 모든 partition scan (index 가 있어도 각 partition 별 scan)
```

원칙: 80% 이상의 query 가 partition key 포함하도록 application 설계.

### 2.6 Vacuum 의 운영

| 테이블 종류 | Vacuum 필요성 |
|------------|--------------|
| `A-row` (append-only) | 매우 낮음 — INSERT-only, 거의 dead tuples 없음 |
| `M-mut` (mutable) | 일반적 — autovacuum 충분 |
| `M-cache` (balance cache) | 자주 UPDATE — autovacuum 자주 |

PostgreSQL 의 autovacuum 설정 (예시 — institution scale 의존):

```ini
autovacuum_vacuum_threshold = 50
autovacuum_vacuum_scale_factor = 0.1
autovacuum_analyze_threshold = 50
autovacuum_analyze_scale_factor = 0.05
```

큰 테이블은 manual VACUUM 시도하면 long-running — 권장 off-peak.

---

## 3. Replication 의 전략

### 3.1 DB 별 replication 권장

| DB | Mode | 이유 |
|----|------|------|
| ledgerdb | **synchronous** | 자금 손실 zero tolerance |
| auditdb | **synchronous** | audit defense — 1 row 손실도 critical |
| approverdb | sync 권장 | governance evidence |
| walletdb | async OK (sync 권장) | metadata; 손실 시 정정 가능 |
| chaindb | async OK | chain 자체에 있음 — re-fetch 가능 |
| providerdb | async OK | provider 에서 re-ingest 가능 |
| recondb | async OK | reconciliation 자체가 evidence, 손실 시 재실행 |
| monitordb | async OK | metric — 일부 손실 acceptable |

### 3.2 Synchronous replication 설정

```ini
synchronous_commit = remote_apply
synchronous_standby_names = 'ANY 2 (standby1, standby2, standby3)'
```

`ANY 2 (...)`: 적어도 2 개의 standby 가 remote_apply 까지 도달해야 commit 성공. 1 개 standby 다운 시에도 운영 가능.

### 3.3 Cross-DC replication

institution 의 multi-DC 권장:

```
Primary DC (Seoul) → sync to Secondary DC (Daejeon)
Primary DC → async to Tertiary DC (DR site, 다른 region)
```

- Sync DC: 같은 metro / low latency
- Async DC: disaster recovery

자세한 cross-DC failover 는 [11-recovery-ceremony.md](11-recovery-ceremony.md) §8 참고.

### 3.4 Replication lag 모니터링

```sql
-- standby 의 lag (primary 에서)
SELECT
  client_addr,
  state,
  pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS lag_bytes,
  EXTRACT(EPOCH FROM (now() - reply_time)) AS lag_seconds
FROM pg_stat_replication;
```

institution 별 threshold:
- ledgerdb / auditdb: lag > 100ms 면 alert
- 다른 DB: lag > 1s 면 alert

---

## 4. Idempotency 강제의 SQL pattern

```sql
-- Application 의 표준 idempotency pattern:

WITH attempt AS (
  INSERT INTO withdrawals (id, reference_id, ...)
  VALUES (gen_random_uuid(), $reference_id, ...)
  ON CONFLICT (reference_id) DO NOTHING
  RETURNING id
)
SELECT id FROM attempt
UNION ALL
SELECT id FROM withdrawals WHERE reference_id = $reference_id
LIMIT 1;
```

`ON CONFLICT DO NOTHING` 으로 duplicate INSERT 회피 + 같은 reference_id 의 기존 row id 반환.

---

## 5. Outbox pattern (cross-DB consistency)

본 reference 의 cross-DB write 권장 pattern:

### 5.1 패턴

```
service 의 transaction:
  BEGIN ledgerdb transaction;
    -- 1. business operation (ledger_entries INSERT 등)
    INSERT INTO ledger_entries (...) VALUES (...);
    
    -- 2. outbox row INSERT (same DB transaction)
    INSERT INTO ledgerdb.outbox (id, target_db, target_aggregate, payload, ...)
    VALUES (..., 'auditdb', 'audit_events', $cbor_payload, ...);
  COMMIT;

별도 worker process:
  loop:
    rows = SELECT * FROM ledgerdb.outbox WHERE delivered_at IS NULL LIMIT 100;
    for row in rows:
      try:
        INSERT INTO target_db.target_table (...) VALUES (row.payload);
        UPDATE ledgerdb.outbox SET delivered_at = NOW() WHERE id = row.id;
      catch:
        increment retry_count;
        if retry_count > N: alert;
```

### 5.2 `outbox` 테이블의 schema

| 컬럼 | Class | 의미 |
|------|-------|------|
| `id` | PK | |
| `target_db` | `A-set` | `'auditdb'`, `'approverdb'`, ... |
| `target_aggregate_type` | `A-set` | |
| `target_aggregate_id` | `A-set` | |
| `payload` | `A-set` | event payload (CBOR or JSON) |
| `created_at` | `A-set` | |
| `delivered_at` | `M-mut` (NULL → set-once) | |
| `retry_count` | `M-mut` | |
| `last_attempt_at` | `M-mut` | |
| `last_error` | `M-mut` | |

### 5.3 Idempotency at target

target DB 의 INSERT 도 idempotent:

```sql
INSERT INTO audit_events (id, ...) VALUES ($outbox_id, ...)
ON CONFLICT (id) DO NOTHING;
```

같은 outbox row 의 두 번째 delivery 도 안전.

### 5.4 Eventual consistency 의 lag

- 평균 lag: 수십 ms ~ 수 초
- monitoring: outbox 의 oldest undelivered row 의 age
- threshold: 5 분 이상이면 alert

---

## 6. Schema migration 의 운영

### 6.1 Online migration 의 PostgreSQL 기법

| 기법 | 적용 |
|------|------|
| `CREATE INDEX CONCURRENTLY` | online index 생성 — table lock 없음 |
| `ALTER TABLE ... ADD COLUMN ... NULL` (with default value) | PG 11+: instant column add |
| `ALTER TABLE ... ADD COLUMN ... NOT NULL DEFAULT ...` | PG 11+: instant; 그 전 버전은 table rewrite |
| `ALTER TABLE ... VALIDATE CONSTRAINT` | constraint 추가 후 validation 별도 |
| `ALTER TABLE ... ATTACH PARTITION CONCURRENTLY` | PG 14+ |

### 6.2 Long-running migration 의 회피

- Column rename: 2-stage (add new column → migrate data → drop old column)
- Column type change: pg_repack 또는 partitioned approach
- Large index drop: `DROP INDEX CONCURRENTLY`

### 6.3 Migration 의 governance

| Migration 종류 | Governance |
|---------------|-----------|
| `M-mut` 컬럼 추가 / 변경 | 일반 review |
| `A-set` 컬럼 추가 | 일반 review |
| 새 trigger 추가 (append-only enforcement) | governance event |
| 기존 trigger 변경 (특히 append-only) | **charter-class** |
| Forbidden column 의식적 추가 | **금지** |
| 새 테이블 추가 | 일반 review |
| 테이블 drop | 절대 금지 (soft archive 만) |

---

## 7. Backup / restore 의 PostgreSQL 운영

### 7.1 Continuous backup

```ini
archive_mode = on
archive_command = 'gzip -1 -k <%p && aws s3 cp %p.gz s3://backup-bucket/wal/'
wal_level = replica  # for streaming replication
```

WAL archival 로 PITR (Point-in-Time Recovery) 가능.

### 7.2 Full snapshot

```bash
# nightly full backup
pg_basebackup -D /backup/$(date +%Y%m%d) -F tar -X stream -P
```

또는 cloud-native: AWS RDS automated snapshots, GCP Cloud SQL backups, Azure backup vault.

### 7.3 Backup verification

매주 sample restore:

```bash
# random recent backup 을 isolated environment 에 restore
# 그 환경에서 sample queries 실행 + audit chain replay
```

backup 의 integrity 자체가 audit defense — backup 손상 시 사고 시 evidence 없음.

### 7.4 WORM (Write-Once-Read-Many) archival

Cold tier 의 storage:
- AWS S3 + Object Lock (compliance mode)
- Azure Blob Storage + immutability policy
- 자체 hardware: write-once optical media (regulatory 요구 시)

retention period 동안 deletion 불가능 — 운영자 admin 도 우회 불가. audit defense 의 long-term anchor.

---

## 8. PostgreSQL 의 보안 considerations

### 8.1 Role / permission 의 격리

각 service 에 별도 DB user + minimal grants:

```sql
-- Wallet Service 의 user (walletdb 만 write)
CREATE USER wallet_service WITH PASSWORD '...';
GRANT CONNECT ON DATABASE walletdb TO wallet_service;
GRANT USAGE ON SCHEMA public TO wallet_service;
GRANT SELECT, INSERT, UPDATE ON wallets, vaults, customers, addresses TO wallet_service;
-- DELETE 권한 부여하지 않음 (soft delete 만)

-- Audit Service 의 user (auditdb 만 write)
CREATE USER audit_service WITH PASSWORD '...';
GRANT CONNECT ON DATABASE auditdb TO audit_service;
GRANT INSERT ON audit_events, audit_checkpoints TO audit_service;
-- UPDATE / DELETE 권한 절대 부여하지 않음

-- External Auditor 의 user (auditdb read-only)
CREATE USER external_auditor WITH PASSWORD '...';
GRANT CONNECT ON DATABASE auditdb TO external_auditor;
GRANT USAGE ON SCHEMA public TO external_auditor;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO external_auditor;
```

### 8.2 Superuser activity 의 audit

운영자 / DBA 의 superuser 활동도 audit:

```ini
# postgresql.conf
log_statement = 'ddl'  # log all DDL
log_min_duration_statement = 100ms  # log slow queries
log_connections = on
log_disconnections = on
```

별도 audit extension (pgaudit 등) 도 권장:

```sql
CREATE EXTENSION pgaudit;
SET pgaudit.log = 'role,ddl,write';
```

superuser 의 직접 SQL = high-severity audit event (외부 alert pipeline 으로).

### 8.3 Connection security

- TLS 강제: `ssl = on`, `ssl_cert_file`, `ssl_key_file`
- mTLS 권장 (client cert 검증)
- IP allowlist: `pg_hba.conf` 의 `hostssl` 에 client subnet 만
- 외부 노출 금지 — private network 만

### 8.4 Backup 의 encryption

- Backup at rest: KMS-managed encryption
- WAL archive: encrypted bucket
- Sample restore 시 decryption + isolation

---

## 9. PostgreSQL 의 large ledger scaling

### 9.1 PostgreSQL 의 scale 한계 (★ Hypothesis)

| Scale | Single instance |
|-------|----------------|
| ~ 100K transactions/day | 단일 instance OK |
| 100K - 10M transactions/day | partitioning + read replica 필요 |
| 10M+ transactions/day | sharding 또는 별도 architecture 검토 |

본 reference 의 7-DB 는 medium-scale (10K - 10M / day) 권장. 100M+ scale 은 별도 design.

### 9.2 Read replica 의 활용

```
write traffic → primary
read traffic (reconciliation, audit, reporting) → read replica
```

- read replica 의 lag: async 면 수십 ms ~ 초
- read replica 에서 무거운 query 실행해도 primary 영향 없음

### 9.3 Sharding 의 경계

PostgreSQL 의 native sharding 은 제한적. 큰 scale 에서:
- Citus extension (PostgreSQL-native sharding)
- 또는 application-level sharding (per-tenant 또는 per-chain)
- 또는 별도 architecture (e.g., TigerBeetle for ledger)

본 reference 의 scope 밖.

---

## 10. PostgreSQL extension 권장

| Extension | 용도 |
|-----------|------|
| `pgcrypto` | UUID 생성, hash 함수 |
| `pgaudit` | superuser activity audit |
| `pg_partman` | partition 자동 관리 |
| `pg_stat_statements` | slow query 분석 |
| `pg_repack` | online table rewrite |

설치는 schema migration 의 일부 (governance event).

---

## 11. Multi-DB consistency 의 가정

### 11.1 가정

- Cross-DB 의 atomic transaction 없음 (no 2PC by default)
- Cross-DB eventual consistency (outbox + worker)
- 각 도메인이 acceptable lag boundary 명시

### 11.2 Conflict 의 해결

cross-DB 의 mismatch 발견 시:
- 가장 **append-only / canonical** 한 source 우선
- 예: audit_events 의 fact ↔ ledger_entries 의 fact → 두 가 align 되어야; 안 되면 reconciliation finding

### 11.3 Reconciliation 의 cadence (재정리)

[14-cross-cutting-concerns.md §retention](14-cross-cutting-concerns.md) 의 cadence 적용. 각 DB 의 read replica 에서 정기 cross-DB query 로 정합성 검증.

---

## 12. 운영 안내 — 7-DB instance 의 manage

### 12.1 Connection pooling

- 각 service 가 자기 DB 에 connection pool (PgBouncer 등)
- 권장: per-service per-DB pool
- 단일 PgBouncer 가 multi-DB 라우팅 가능

### 12.2 Monitoring

각 DB 의 별도 monitoring:
- Replication lag
- Connection count
- Slow query rate
- Disk usage
- Vacuum activity
- WAL archive lag

dashboard 는 도메인 별 + 통합 view.

### 12.3 Patching / upgrade

- PostgreSQL major upgrade 는 모든 7 DB 의 coordinated upgrade
- 권장: rolling upgrade — DB 별 순서 (least critical 부터)
- Audit DB 는 가장 마지막 (가장 critical)
- Major upgrade 자체가 governance event + ceremony

### 12.4 DBA 의 권한

- 운영자 / DBA 의 superuser 활동도 audit (위 §8.2)
- Production 의 직접 SQL 은 emergency 시에만 + 외부 alert
- Schema migration 은 managed pipeline (Liquibase, Flyway 등) — manual SQL 금지

---

## 13. 본 reference 의 한계

본 reference 는 다음을 다루지 않습니다:

- **특정 PostgreSQL 버전 / 익스텐션 추천** — 운영 환경 의존
- **Cloud-managed vs self-managed** — institution decision
- **HA architecture detail** (Patroni / repmgr / pacemaker) — 별도 ops document
- **Capacity planning numerics** — institution scale 의존
- **Specific monitoring stack** — Prometheus / Datadog 등 — institution choice
- **Backup vendor 결정** — pgBackRest / Barman / cloud-native — institution choice
- **TPS / latency 의 구체적 수치** — institution scale 의존

이런 영역은 institution 의 별도 ops design.

---

## 14. 본 reference 의 완성도

다음 15 개 파일이 본 persistence architecture reference 의 전체입니다:

| # | 파일 | 다루는 도메인 |
|---|------|-------------|
| index | [index.md](index.md) | 전체 overview |
| 01 | [01-principles-and-discipline.md](01-principles-and-discipline.md) | Storage class + enforcement |
| 02 | [02-wallet-topology.md](02-wallet-topology.md) | Wallet Topology |
| 03 | [03-ledger-settlement.md](03-ledger-settlement.md) | Ledger & Settlement |
| 04 | [04-transaction-orchestration.md](04-transaction-orchestration.md) | Transaction Orchestration |
| 05 | [05-approval-governance.md](05-approval-governance.md) | Approval & Governance |
| 06 | [06-signing-execution.md](06-signing-execution.md) | Signing & Execution |
| 07 | [07-deposit-observation.md](07-deposit-observation.md) | Deposit Observation |
| 08 | [08-withdrawal-lifecycle.md](08-withdrawal-lifecycle.md) | Withdrawal Lifecycle |
| 09 | [09-reconciliation-consistency.md](09-reconciliation-consistency.md) | Reconciliation & Consistency |
| 10 | [10-audit-evidence-integrity.md](10-audit-evidence-integrity.md) | Audit & Evidence Integrity |
| 11 | [11-recovery-ceremony.md](11-recovery-ceremony.md) | Recovery & Ceremony |
| 12 | [12-provider-mapping.md](12-provider-mapping.md) | Provider Mapping |
| 13 | [13-operational-monitoring.md](13-operational-monitoring.md) | Operational Monitoring |
| 14 | [14-cross-cutting-concerns.md](14-cross-cutting-concerns.md) | Indexing / Retention / Hot-cold / Locking |
| 15 | [15-db-split-and-postgresql.md](15-db-split-and-postgresql.md) | DB split + PG operations |

본 reference 는 corpus 의 추상 layer ([docs/architecture/](../docs/architecture/), [reference-architecture/](../reference-architecture/)) 의 **physical implementation projection**. 새 theory 가 아닌 implementation-grade specification.

audit-reviewable schema 의 backbone — DBA / Backend Engineer / Security Engineer / Auditor / Reconciliation Engineer / Architecture Reviewer 의 공통 reference.
