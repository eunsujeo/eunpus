---
title: 2. 컴플라이언스 DB — 테이블 초안
status: To Do
---

[0장](00-scope.md)이 확정한 컴플라이언스 DB 의 보관 데이터 — VASP 레지스트리(솔루션 목록·매핑·활성화)·check 상태·사전 검증 기록 — 의 테이블 초안이다.
필드 타입·의미는 [API 문서](../API/api.md)의 타입 정의와 짝이다. **PII 는 어느 테이블에도 없다** — 원문은 Enclave(국내)·벤더(해외)가 보관한다.

VASP 의 정체와 거래 허용(고객 화면 노출)은 이 DB 가 아니라 **월렛 백엔드의 VASP 마스터(`daw_vasp_m`)**에 있다 — 컴플라이언스는 솔루션 라우팅을 맡으므로, 여기 레지스트리는 솔루션 목록을 받아 두고 코어 `vasp_id` 와 매핑·활성화해 둔다([1장 처리 순서](01-interface.md)).

## 명명 규약

- **접두** — `cmpl_` (서비스 식별)
- **접미** — `_m`(마스터/기본) · `_l`(내역/로그) · `_h`(이력)
- **컬럼 축약** — `_dvcd`(구분코드) · `_stcd`(상태코드) · `_yn`(boolean) · `_qty`(수량) · `_cnt`(횟수) · `_dttm`(일시) · `_dt`(일자)
- **감사 컬럼** — 직원번호(`empno`)·부점코드(`brcd`) 같은 계정계 감사 컬럼은 두지 않는다 — 이 DB 를 만지는 주체는 서비스뿐이다. 행 생성·변경 시각은 테이블마다 업무 의미가 있는 일시 컬럼(`occr_dttm`·`sync_dttm`·`rcv_dttm`)이 담당한다.

## 테이블 한눈에

| 테이블 | 무엇을 저장하나 | 쓰는 곳 |
|---|---|---|
| `cmpl_vasp_m` | 컴플라이언스 VASP 레지스트리 — 솔루션 목록 + `cmpl_vasp_id`(우리 발급 안정 id) + 매핑된 코어 `vasp_id` + 활성화 | 동기화(목록 갱신) · List/Activate/Deactivate(운영) · Create Withdrawal Check 라우팅 |
| `cmpl_wdrl_chk_l` | check 상태 | Create/Get Withdrawal Check · Report · settled 발행 · PENDING 만료 스캔 |
| `cmpl_pre_vrfc_l` | 사전 검증 기록 | 인바운드 수신 적재 · TX_REPORT 갱신 · Create Deposit Check 대조 |

거래 허용 판단(고객 화면 노출 여부)은 여기 없다 — 월렛 백엔드의 VASP 마스터(`daw_vasp_m`, `vasp_stcd`)가 갖는다. 컴플라이언스의 활성화(`actv_yn`)는 **라우팅을 켜는** 다른 층이다 — Admin 이 VASP 를 온보딩할 때 코어가 `vasp_id` 를 만들어 컴플라이언스에 매핑·활성화한다([1장 처리 순서](01-interface.md)).

## cmpl_vasp_m — 컴플라이언스 VASP 레지스트리

컴플라이언스가 아는 VASP 한 항목이 한 행이다. **동기화**가 솔루션 목록을 받아 이 표를 채우고(신규 항목엔 `cmpl_vasp_id` 발급), Admin 이 온보딩하면 **활성화**가 코어 `vasp_id` 를 매핑하고 `actv_yn` 을 켠다. 한 행의 두 출처를 분리해 둔다 — 동기화는 목록 컬럼(`vasp_nm`·`rchbl_yn`·`sync_dttm`)만, 활성화는 매핑 컬럼(`vasp_id`·`actv_yn`)만 건드린다.

```sql
CREATE TABLE cmpl_vasp_m (
  cmpl_vasp_id   VARCHAR(64)  PRIMARY KEY,   -- 컴플라이언스 발급 안정 id ("vasp unique id") — Admin 브라우징·매핑 대상
  soln_dvcd      VARCHAR(16)  NOT NULL,      -- 솔루션 구분: VERIFYVASP | CODE_INTEROP | NOTABENE
  soln_vasp_id   VARCHAR(255) NOT NULL,      -- 솔루션 쪽 식별자 (vaspId · DID)
  vasp_nm        VARCHAR(255) NOT NULL,      -- 솔루션이 알려준 표시명
  vasp_id        VARCHAR(64)  NULL,          -- 매핑된 코어 VASP id (daw_vasp_m) — 활성화 때 채운다. 미매핑이면 NULL
  actv_yn        BOOLEAN      NOT NULL,      -- 활성화 여부 — 활성화 API 로 켠다. 해제해도 매핑(vasp_id)은 남긴다
  rchbl_yn       BOOLEAN      NOT NULL,      -- 이 항목으로 확인을 보낼 수 있는가 (마지막 동기화 기준)
  sync_dttm      TIMESTAMP    NOT NULL,      -- 마지막 동기화 일시
  reg_dttm       TIMESTAMP    NOT NULL,      -- 최초 등재(동기화) 일시
  last_chng_dttm TIMESTAMP    NOT NULL,      -- 매핑/활성화 마지막 변경 일시
  UNIQUE (soln_dvcd, soln_vasp_id)
);
CREATE INDEX idx_cmpl_vasp_by_core ON cmpl_vasp_m (vasp_id);
```

| 무엇 | 어떻게 |
|---|---|
| `cmpl_vasp_id` | 컴플라이언스가 발급하는 안정 id — Admin 이 목록에서 이 값으로 VASP 를 지목해 활성화한다. 동기화 재적재에도 안 바뀐다 |
| 동기화 UPSERT | 동기화는 `(soln_dvcd, soln_vasp_id)` 로 대조해 UPSERT 한다 — 신규면 `cmpl_vasp_id` 발급(`actv_yn`=false), 기존이면 목록 컬럼만 갱신하고 `vasp_id`·`actv_yn` 은 보존. **목록에서 사라진 항목은 삭제하지 않고 `rchbl_yn`=false** — 매핑·활성화를 잃지 않는다 |
| `vasp_id` 매핑 | 활성화 API(코어 → 컴플라이언스)가 코어가 만든 `vasp_id` 를 이 컬럼에 채운다. 출금 확인의 `vaspId` 를 이 값(인덱스 `idx_cmpl_vasp_by_core`)으로 조회해 솔루션 항목·라우팅을 정한다 |
| 다중 솔루션 | 같은 실물 VASP 가 여러 솔루션에 있으면 항목(행)이 여럿이라 `vasp_id` 가 여러 행에 붙는다 — 라우팅 규칙으로 하나를 고른다([1장](01-interface.md)) |

## cmpl_wdrl_chk_l — check 상태

출금 한 건의 트래블룰 확인(check) 한 건이 한 행이다. 월렛이 출금 확인을 요청하면 행이 생기고, 확인의 생애 — 요청 접수 → 솔루션 왕복 → 결과 확정(승인·거절·만료) → 제출 tx hash 보고 — 가 이 행에 쌓인다. 네 가지 일에 쓰인다:

- **멱등** — 같은 출금 건의 재요청을 새 확인으로 만들지 않고 기존 행으로 답한다 (`ext_tx_id` UNIQUE · `rqst_hash` 대조).
- **비동기 진행 추적** — 결과가 나중에 오는 솔루션(VerifyVASP)의 진행 상태를 들고 있다가, Callback 이 오면 확정한다.
- **조회·이벤트의 원천** — 상태 조회 응답과 결과 확정(settled) 이벤트가 이 행을 읽어 만들어진다.
- **만료 정리** — 기한이 지나도록 결과가 없는 건을 배치가 이 테이블에서 찾아 거절로 확정한다.

```sql
CREATE TABLE cmpl_wdrl_chk_l (
  chk_id          VARCHAR(64)  PRIMARY KEY,        -- chk_...  서비스 발급
  occr_dttm       TIMESTAMP    NOT NULL,           -- 발생일시 — 확인 요청이 접수돼 행이 생긴 시각
  ext_tx_id       VARCHAR(128) NOT NULL UNIQUE,    -- 멱등 키 (월렛·매니저와 같은 키)
  acnt_id         VARCHAR(64)  NOT NULL,           -- 고객 계정 ID
  vasp_id         VARCHAR(64)  NOT NULL,           -- 수취 VASP — 월렛이 지목한 값 (월렛 VASP 마스터의 id)
  soln_dvcd       VARCHAR(16)  NOT NULL,           -- 라우팅으로 확정된 솔루션 — 감사·재현용
  rqst_hash       VARCHAR(64)  NOT NULL,           -- 최초 요청 본문 해시 — 멱등 대조용
  vrdt_stcd       VARCHAR(16)  NOT NULL,           -- TrVerdict: NOT_REQUIRED | APPROVED | PENDING | REJECTED
  trvl_rule_msg   TEXT         NULL,               -- 제출에 실어 보낼 암호화 메시지 (Notabene 경로만 값)
  evdc_dvcd       VARCHAR(32)  NULL,               -- 통과 증적 종류 (enum 미확정 — API 문서)
  evdc_ref        VARCHAR(255) NULL,               -- 증적 참조 (예: 사전 승인 UUID)
  stld_dttm        TIMESTAMP    NULL,               -- 최종 결과 일시 — PENDING 이면 NULL
  pend_expr_dttm   TIMESTAMP    NULL,               -- PENDING 만료 스캔 기준 (시간 규칙: 트래블룰 4장)
  rpt_tx_hash     VARCHAR(128) NULL                -- 월렛이 제출 후 보고해 온 거래 해시
);
```

| 컬럼 | 뜻 |
|---|---|
| `chk_id` | 확인 건 식별자 — 서비스가 발급한다 |
| `occr_dttm` | 발생일시 — 확인 요청이 접수돼 행이 생긴 시각 |
| `ext_tx_id` | 이 확인이 어느 출금 건에 대한 것인가 — 월렛 DB 출금 건 식별자이자 블록체인 매니저 제출 키와 같은 값. UNIQUE 가 멱등의 물리 근거 — 같은 키 재요청은 이 행을 돌려준다 |
| `acnt_id` | 어느 고객 계정의 출금인가 |
| `vasp_id` | 수취 거래소 — 월렛이 지목한 VASP 마스터의 id. 컴플라이언스가 이 값으로 솔루션 항목을 찾아 라우팅한다 |
| `soln_dvcd` | 실제로 어느 솔루션으로 보냈는지 — 라우팅 결과를 남겨 사후 감사·재현에 쓴다 |
| `rqst_hash` | 최초 요청 본문의 해시 — 같은 키에 다른 내용의 재요청이 오면 이 값과 대조해 거절한다 |
| `vrdt_stcd` | 확인의 현재 결과 — NOT_REQUIRED(대상 아님) · APPROVED(통과) · PENDING(결과 대기) · REJECTED(거절·만료) |
| `trvl_rule_msg` | 통과 시 출금 제출에 실어 보낼 암호화 메시지 — 만드는 솔루션(Notabene)만 값이 있다 |
| `evdc_dvcd` · `evdc_ref` | 통과를 증명하는 기록의 종류와 참조 값 (예: 상대의 사전 승인 번호). 종류 목록은 미확정 |
| `stld_dttm` | 최종 결과가 난 일시 — 이 컬럼이 채워지면 결과가 더는 바뀌지 않는다. PENDING 이면 NULL |
| `pend_expr_dttm` | 결과 대기의 기한 — 만료 배치가 이 컬럼으로 기한 지난 건을 찾아 거절 확정한다 |
| `rpt_tx_hash` | 월렛이 온체인 제출 후 보고해 온 거래 해시 — 솔루션 사후 보고에 쓴다 |

솔루션 원어 근거(벤더 응답 코드 등)를 감사 기록으로 얼마나 둘지는 미정(0장 열린 결정) — 확정되면 append-only `_l` 테이블로 붙인다.

## cmpl_pre_vrfc_l — 사전 검증 기록

상대 거래소가 **자금을 보내기 전에** 먼저 보내오는 사전 검증(입금 예고)의 보관함이다. 이 시점에는 자금이 아직 없다 — 정보만 먼저 도착한 상태다. 행 하나의 생애:

1. **적재** — 상대의 사전 검증 요청이 수신되면 대조에 쓸 값만 추려 한 행으로 쌓는다 (이름 등 신원 정보는 저장하지 않는다).
2. **갱신** — 상대가 온체인 전송 후 거래 해시를 보고해 오면 같은 행에 채운다.
3. **대조** — 입금이 실제로 도착해 월렛이 확인을 요청하면, 이 테이블에서 맞는 행을 찾아 "예고됐던 입금"인지 답한다.
4. **정리** — 예고만 오고 자금이 끝내 안 온 행은 보존 기간이 지나면 배치가 정리한다 (기간 값 미정 — 아래).

```sql
CREATE TABLE cmpl_pre_vrfc_l (
  vrfc_ref     VARCHAR(128) PRIMARY KEY,    -- 솔루션이 발급한 검증 참조 UUID
  bnfc_addr    VARCHAR(128) NOT NULL,       -- 우리 쪽 수취 주소
  ast_cd       VARCHAR(32)  NOT NULL,       -- 자산 심볼
  amt          VARCHAR(78)  NOT NULL,       -- 금액 — 단위·표현은 대조 규칙과 함께 확정 (아래 미확정)
  src_addr     VARCHAR(128) NULL,           -- 사전 검증 시점엔 없을 수 있다
  tx_hash      VARCHAR(128) NULL,           -- 상대가 전송 후 보고해 오면 갱신
  mtch_dttm     TIMESTAMP    NULL,           -- 도착한 입금과 대조 성공한 일시
  rcv_dttm      TIMESTAMP    NOT NULL        -- 수신 일시
);
CREATE INDEX idx_cmpl_pre_vrfc_hash ON cmpl_pre_vrfc_l (tx_hash);
CREATE INDEX idx_cmpl_pre_vrfc_addr ON cmpl_pre_vrfc_l (bnfc_addr, ast_cd);
```

| 컬럼 | 뜻 |
|---|---|
| `vrfc_ref` | 솔루션이 발급한 검증 참조 — 최초 수신, 사후 tx hash 갱신, 솔루션 조회가 모두 이 값으로 같은 건임을 잇는다 |
| `bnfc_addr` | 예고된 입금의 우리 쪽 수취 주소 — 도착한 입금과 맞춰 보는 기본 키 중 하나 |
| `ast_cd` | 자산 심볼 |
| `amt` | 예고된 금액 — 단위·표현은 대조 규칙과 함께 확정(아래 미확정) |
| `src_addr` | 보내는 쪽 주소 — 사전 검증 시점엔 상대도 확정 못 할 수 있어 비어 있을 수 있다 |
| `tx_hash` | 상대의 사후 보고로 채워진다 — 있으면 정확 매칭, 없으면 주소·자산·금액 매칭. 대조 규칙 상세는 미확정(API 문서) |
| `mtch_dttm` | 도착한 입금과 대조 성공한 일시 — 채워진 행은 다른 입금과 다시 매칭하지 않는다(이중 매칭 방지) |
| `rcv_dttm` | 사전 검증이 수신된 일시 — 보존 기간 만료의 기준 (기간 값 미정 — 트래블룰 4장 국내 시간 규칙과 함께) |

PII(이름 등 신원 정보) 컬럼이 없는 것이 규칙이다 — 대조 키만 갖는다.

## 미확정

- **약어 검수** — `vrdt`·`evdc`·`bnfc`·`vrfc`·`soln`·`rchbl`·`actv` 등 새 축약어는 월렛 DB 약어집과 대조 후 확정.
- **일시 타입** — 월렛 DB 는 일시를 문자열 VARCHAR(16)(`YYYYMMDDHHMMSS` 계열)로 둔다. 이 DB 도 그에 맞출지 TIMESTAMP 로 갈지 결정.
- **금액 표현** — base unit 정수로 둘지 표시 단위 decimal 로 둘지 — 사전 검증 메시지의 금액 단위 확인·사전 검증 기록 대조 규칙과 함께 확정.
- **감사 기록(솔루션 원어 근거)의 범위** — 0장 열린 결정 1. 확정되면 append-only 테이블 추가.
- **evidence(`evdc_dvcd`) enum** — 솔루션별 증적 종류 확정 후.
- **다중 솔루션 라우팅 규칙** — 한 `vasp_id` 가 여러 솔루션 항목에 걸릴 때(국내·해외 동시) 어느 솔루션을 고를지 — 국내/해외·우선순위 규칙 확정.
- **동기화 항목 정체 판정** — 같은 실물 VASP 를 여러 솔루션에서 하나로 볼지, 솔루션 항목 단위로 둘지 — 지금은 항목 단위(행 여럿)로 둔다.

## 약어집 (부록)

축약 규칙은 영어 단어의 모음 탈락. 이 문서가 쓰는 축약 전부다.

| 축약 | 원어 | | 축약 | 원어 |
|---|---|---|---|---|
| `cmpl` | compliance | | `vrdt` | verdict |
| `vasp` | virtual asset service provider | | `evdc` | evidence |
| `wdrl` | withdrawal | | `vrfc` | verification |
| `chk` | check | | `bnfc` | beneficiary |
| `soln` | solution | | `amt` | amount |
| `rchbl` | reachable | | `ast` | asset |
| `actv` | active (활성화) | | | |
| `acnt` | account | | `src` | source |
| `rqst` | request | | `mtch` | match |
| `stld` | settled | | | |
| `pend_expr` | pending expire | | `rcv` | receive |
| `rpt` | report | | `nm` | name |
| `ext_tx` | external transaction | | | |
| `occr` | occur | | `dttm` | datetime |

접미: `_id` 식별자 · `_cd` 코드 · `_nm` 이름 · `_addr` 주소 · `_hash` 해시 · `_dvcd` 구분코드(종류 enum) · `_stcd` 상태코드(바뀌는 상태) · `_yn` boolean · `_qty` 수량 · `_cnt` 횟수 · `_dttm` 일시 · `_dt` 일자.
