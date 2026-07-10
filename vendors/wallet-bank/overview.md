---
type: vendor-hub
vendor: wallet-bank
status: draft
tags: [architecture, workspace, transaction, custody, governance]
stage_introduced: 155
last_updated_stage: 155
source_count: 4
related:
  - architecture
  - data-model
  - design-requirements
  - ledger-netting
  - custody-mapping
  - travel-rule-flow
---
# wallet-bank (daw-core) — Overview

> 은행 자체 구축 **디지털자산 지갑 플랫폼**의 코어 시스템(내부 명칭 daw-core). Fireblocks 는 이 시스템이 참조하는 커스터디 제공사 중 하나일 뿐이며, 코어는 특정 솔루션에 의존하지 않도록 설계된다 (source: wallet-bank/설계/설계.txt).

## Summary

wallet-bank 는 Fireblocks 벤더 리서치와 달리 **은행 백엔드 팀이 직접 설계한 자체 코어 시스템**이다. DB 스키마 접두사 `daw_` (Digital Asset Wallet) 로 식별된다. 세 부분으로 구성된 1차 자료를 근거로 한다 (source: wallet-bank/README.md; wallet-bank/아키텍쳐/architecture.md; wallet-bank/설계/설계.txt; wallet-bank/db/backend/*).

- **blockchain-manager(BCM)** 는 코어 존에 위치해 온체인 거래(노드 연동)를 담당하는 하위 모듈이다 (source: wallet-bank/README.md).
- 코어(core)·BCM·커스터디 솔루션·트래블룰 솔루션의 책임이 명시적으로 분리된다: 판단은 (트래블룰) 솔루션, 솔루션 연동은 BCM, **순서 강제는 코어**가 담당 (source: wallet-bank/설계/설계.txt).

## Key Concepts

- **daw-core** — 은행 자체 디지털자산 지갑 코어. 잔액·원장·거래 상태의 정본(SSOT) 보유 (source: wallet-bank/db/backend/*).
- **솔루션 중립(vendor-neutral)** — 지갑 솔루션·트래블룰 솔루션 모두 공통 인터페이스로 추상화. 솔루션 교체 시 코어 무변경이 목표 (source: wallet-bank/설계/설계.txt).
- **커스터디 추상화** — `daw_cstd_map_m` 매핑 테이블로 외부 커스터디(01:FIREBLOCKS, 02:SELF …)를 격리 (ADR-006) (source: wallet-bank/db/backend/account-asset.md). → [[entities/wallet-bank/custody-mapping]]
- **base unit 정수 원장** — 수량은 `NUMERIC(78,0)` base unit 정수로 저장, 토큰 소수자릿수(`tkn_dcml`)를 행마다 스냅샷 (source: wallet-bank/db/backend/ledger.md).
- **append-only 불변원장** — 원장분개/델타원장은 UPDATE/DELETE 없음. 정정은 역분개·역델타 INSERT (source: wallet-bank/db/backend/ledger.md).
- **델타원장 + 네팅배치** — 옴니버스 내부 이동은 상계하고 순액(net)만 온체인 1회 전송해 가스비 절감 (source: wallet-bank/db/backend/ledger.md). → [[entities/wallet-bank/ledger-netting]]
- **잔액 SSOT 이원화** — 고객 잔액은 DB(`daw_ast_bal_m`), 시스템 자산 잔액은 Redis(`daw_sys_ast_bal_m` 는 복구 기준점) (source: wallet-bank/db/backend/account-asset.md; system-asset.md).

## Details

### 시스템 경계 (책임 분리)

| 주체 | 책임 | 근거 |
|---|---|---|
| **코어(daw-core)** | 잔액·원장·거래상태 정본, 순서 강제, 검증 결과 수신·반영 | 설계.txt |
| **BCM (blockchain-manager)** | 온체인 거래 전송·노드 연동, 커스터디/트래블룰 솔루션 연동 실행 | README.md, 설계.txt |
| **커스터디 솔루션** | 키 관리·서명 (Fireblocks 등, 코어는 vaultAccountId 등만 참조) | account-asset.md (daw_cstd_map_m) |
| **트래블룰 솔루션** | VASP 검증 판단 (코어는 승인/거부/보류 결과만 수신, 판단 근거 모름) | 설계.txt |

### 구성 문서 (이 hub 하위)

- [[vendors/wallet-bank/architecture]] — Kotlin/Spring Boot 멀티모듈·레이어·DIP
- [[vendors/wallet-bank/data-model]] — ~25 테이블 데이터 모델 hub
- [[vendors/wallet-bank/design-requirements]] — 설계.txt 15개 요구항목 + 상태(식별/설계/개발)

## Related Pages

- [[vendors/wallet-bank/architecture]]
- [[vendors/wallet-bank/data-model]]
- [[vendors/wallet-bank/design-requirements]]
- [[entities/wallet-bank/ledger-netting]]
- [[entities/wallet-bank/custody-mapping]]
- [[entities/wallet-bank/travel-rule-flow]]
- [[vendors/fireblocks/overview]] — 커스터디 제공사(01:FIREBLOCKS)로 참조되는 벤더
- [[open-questions/wallet-bank]]

## Sources

- `wallet-bank/README.md` — blockchain-manager 모듈 구조·기술 스택
- `wallet-bank/아키텍쳐/architecture.md` — 코어 아키텍처 template
- `wallet-bank/설계/설계.txt` — 설계 요구항목
- `wallet-bank/db/backend/*.md` — DB 스키마 7 파일

## Open Questions

- 미확정 항목은 [[open-questions/wallet-bank]] 로 격리.
