# 원장

수량 변동 이력 (불변 append-only). 거래마다 분개 생성. Σ entr_qty ≈ avbl_qty (대사 검증).

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| entr_id | VARCHAR(20) | PK | 분개ID |
| guid | VARCHAR(36) |  | 거래GUID(타서비스공통) |
| tx_id | VARCHAR(32) | FK | 거래ID |
| ast_id | VARCHAR(16) | FK | 자산ID (고객: daw_ast_m FK, 시스템: NULL) |
| tkn_id | VARCHAR(16) | FK | 토큰ID |
| blkc_ntwk_dvcd | VARCHAR(2) | FK | 블록체인네트워크구분코드 (tkn_id 역정규화, 원장 조회 필터) |
| tkn_smbl | VARCHAR(16) |  | 토큰심볼 (tkn_id 역정규화, 원장 조회 필터) |
| entr_typ_dvcd | VARCHAR(2) |  | 분개유형구분코드 |
| tkn_dcml | INT |  | 토큰소수자릿수 (시점 스냅샷, _qty base unit 해석 기준) (가격영향 — 마스터 비의존 자족(Coin 원칙) / daw-core 고유) |
| entr_qty | NUMERIC(78,0) |  | 분개수량 (base unit 정수) (이동 금액 / 양쪽 TX_AMT) |
| qty_bef | NUMERIC(78,0) |  | 거래전수량 (base unit 정수, 잔액 스냅샷) (이동 전 잔액 스냅샷(대사 근거) / 양쪽 AFTR_BAL 강화) |
| qty_aft | NUMERIC(78,0) |  | 거래후수량 (base unit 정수, 잔액 스냅샷) (이동 후 잔액 스냅샷 / 양쪽 강화) |
| evl_amt_bef | NUMERIC(18,2) |  | 거래전평가금액 |
| evl_amt_aft | NUMERIC(18,2) |  | 거래후평가금액 |
| prnc_bef | NUMERIC(18,2) |  | 거래전원금 |
| prnc_aft | NUMERIC(18,2) |  | 거래후원금 |
| apl_xrt | NUMERIC(18,8) |  | 적용환율 |
| entr_stcd | VARCHAR(1) |  | 분개상태코드 |
| rvrs_yn | VARCHAR(1) |  | 역분개여부 (역분개 여부(불변원장 정정) / daw-core) |
| rvrs_entr_id | VARCHAR(20) |  | 역분개대상분개ID |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |

**연관 관계**


• N:1 → daw_tx_l.
• N:1 → daw_ast_m.


불변. UPDATE/DELETE 없음.

<a id="daw_ldgr_bal_l"></a>
## daw_ldgr_bal_l — 원장일별수량

일별 수량 스냅샷. [확장 P2]

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| clcl_dt | VARCHAR(8) | PK | 산출일자 (YYYYMMDD, 마감 기준일) |
| ldgr_acnt_id | VARCHAR(16) | PK | 원장계좌ID |
| ast_id | VARCHAR(16) | FK | 자산ID (역정규화) |
| tkn_id | VARCHAR(16) | FK | 토큰ID (역정규화) |
| blkc_ntwk_dvcd | VARCHAR(2) | FK | 블록체인네트워크구분코드 (역정규화) |
| tkn_smbl | VARCHAR(16) |  | 토큰심볼 (역정규화) |
| tkn_dcml | INT |  | 토큰소수자릿수 (시점 스냅샷, _qty base unit 해석 기준) (가격영향 — 마스터 비의존 자족(Coin 원칙) / daw-core 고유) |
| avbl_qty | NUMERIC(78,0) |  | 가용수량 (마감, base unit 정수) |
| pend_qty | NUMERIC(78,0) |  | 대기수량 (마감, base unit 정수) |
| lock_qty | NUMERIC(78,0) |  | 잠금수량 (마감, base unit 정수) |
| tot_qty | NUMERIC(78,0) |  | 총수량 (가용+대기+잠금, base unit 정수) |
| krw_evl_amt | NUMERIC(18,2) |  | 원화평가금액 (보고용) |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |

**연관 관계**


• 일자별 1회 적재.


확장 예정 — 스키마만 선반영

<a id="daw_dlta_entr_l"></a>
## daw_dlta_entr_l — 델타원장내역

온체인 자산:양방향_화살표:자산 실제 이동분 (append-only). 옴니버스 내부 장부이동은 행 미생성. 방향은 from→to 쌍, mv_qty는 양수. nttg_btch_id NULL=미네팅 후보, 배치 귀속 시 write-once. 취소는 역델타 행 INSERT.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| dlta_id | VARCHAR(32) | PK | 델타ID |
| guid | VARCHAR(36) |  | 거래GUID(타서비스공통) |
| tx_id | VARCHAR(32) | FK | 거래ID |
| tx_typ_dvcd | VARCHAR(2) | FK | 거래유형구분코드 (daw_tx_l 역정규화 — 온램프/오프램프/외부출금/집금/리밸런싱) (거래헤더 거래유형 공유 — 델타 전용 코드 안 만듦, 유형별 집계 / daw-core 고유) |
| blkc_ntwk_dvcd | VARCHAR(2) | FK | 블록체인네트워크구분코드 (네팅 상계 단위) (네팅 GROUP BY 키 — (network,token) 단위로 상계 / daw-core 고유) |
| tkn_id | VARCHAR(16) | FK | 토큰ID (네팅 상계 단위) |
| tkn_smbl | VARCHAR(16) |  | 토큰심볼 (역정규화, 네팅 집계 조회) |
| tkn_dcml | INT |  | 토큰소수자릿수 (시점 스냅샷, mv_amt base unit 해석 기준) (가격영향 — 마스터 변경에 불변, 행에서 바로 해석 / daw-core 고유) |
| from_ast_id | VARCHAR(16) | FK | 출금측자산ID (NULL=외부주소) (이동 출발점 — 방향을 from→to 쌍으로 표현(부호코드 대체) / daw-core 고유) |
| from_wllt_typ | VARCHAR(2) |  | 출금측지갑유형 (회사/고객옴니버스/외부) (옴니버스 내부 장부이동은 행 미생성 — 실제 온체인 이동만 식별 / daw-core 고유) |
| from_addr | VARCHAR(128) |  | 출금측온체인주소 |
| to_ast_id | VARCHAR(16) | FK | 입금측자산ID (NULL=외부주소) (이동 도착점 / daw-core 고유) |
| to_wllt_typ | VARCHAR(2) |  | 입금측지갑유형 (회사/고객옴니버스/외부) |
| to_addr | VARCHAR(128) |  | 입금측온체인주소 |
| mv_qty | NUMERIC(78,0) |  | 이동수량 (base unit 정수, 항상 양수 절대값, 방향은 from→to로 파생) (네팅 SUM 대상 — 회사기준 순액은 from/to 보고 부호 환산 / daw-core 고유) |
| nttg_btch_id | VARCHAR(32) | FK | 네팅배치ID (NULL=미네팅 후보, 배치 귀속 시 write-once) (상태 UPDATE 대신 NULL여부로 미네팅/네팅 표현 — append-only 유지 / daw-core 고유) |
| rvrs_dlta_id | VARCHAR(32) | FK | 역델타대상ID (실패보상 시 부호반대 역행 INSERT, 원본 dlta_id 참조) (취소를 UPDATE 대신 역행 INSERT — 원장분개 rvrs_entr_id와 동일 패턴 / daw-core 고유) |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |

**연관 관계**


• N:1 → daw_tx_l.
• N:1 → daw_nttg_btch_l.
• from/to → daw_ast_m.


append-only. 상태 UPDATE 없음 — 네팅은 SUM, 취소는 역행 INSERT.

<a id="daw_nttg_btch_l"></a>
## daw_nttg_btch_l — 네팅배치

네팅 정산 배치. WHERE nttg_btch_id IS NULL 델타를 그룹키별 SUM(mv_qty). net_qty만 온체인 1회 전송(가스비 절감). 확정 시 묶인 델타 일괄 마감.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| nttg_btch_id | VARCHAR(32) | PK | 네팅배치ID |
| tkn_id | VARCHAR(16) | FK | 토큰ID |
| blkc_ntwk_dvcd | VARCHAR(2) | FK | 블록체인네트워크구분코드 (tkn_id 역정규화, 배치 조회) |
| tkn_smbl | VARCHAR(16) |  | 토큰심볼 (tkn_id 역정규화, 배치 조회) |
| tkn_dcml | INT |  | 토큰소수자릿수 (시점 스냅샷, net_amt base unit 해석 기준) (가격영향 — net_amt 해석 기준 / daw-core 고유) |
| from_ast_id | VARCHAR(16) | FK | 출금측자산ID (네팅 그룹키, 온체인 송신 주소 / NULL=외부) (네팅 GROUP BY 키 — 델타를 from/to로 그룹화한 결과, 온체인 송신 주소 / daw-core 고유) |
| from_addr | VARCHAR(128) |  | 출금측온체인주소 |
| to_ast_id | VARCHAR(16) | FK | 입금측자산ID (네팅 그룹키, 온체인 수신 주소 / NULL=외부) (네팅 GROUP BY 키 — 온체인 수신 주소 / daw-core 고유) |
| to_addr | VARCHAR(128) |  | 입금측온체인주소 |
| perd_strt_tmst | TIMESTAMP |  | 집계시작시각 |
| perd_end_tmst | TIMESTAMP |  | 집계종료시각 |
| net_qty | NUMERIC(78,0) |  | 순수량 (base unit 정수, 그룹 SUM(mv_qty), 온체인 전송량 — 방향은 from→to) (그룹별 SUM(mv_amt) — 방향코드 대신 from/to로 방향 표현, 배치 1행=온체인 1건 / daw-core 고유) |
| dlta_cnt | INT |  | 묶인 델타건수 (이 배치가 소비한 델타원장 행 수) (배치-델타 정합성 검증 / daw-core 고유) |
| nttg_stcd | VARCHAR(2) |  | 네팅상태코드 |
| bcm_tx_hash | VARCHAR(128) |  | BCM온체인거래해시 (정산 온체인 해시 / daw-core 고유) |
| settl_tmst | TIMESTAMP |  | 확정시각 |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |
| last_chng_empno | VARCHAR(6) |  | 최종변경직원번호 |
| last_chng_brcd | VARCHAR(4) |  | 최종변경부점코드 |

**연관 관계**


• N:1 → daw_tkn_m.
• 1:N → daw_dlta_entr_l.
• 1:N → daw_onch_exec_l.
• from/to → daw_ast_m.


방향코드 대신 from/to로 방향 표현.

<a id="daw_dlta_btch_map_l"></a>
## daw_dlta_btch_map_l — 델타배치매핑

델타-배치 귀속 매핑. 미네팅 조회는 daw_dlta_entr_l LEFT JOIN 이 테이블 WHERE map.dlta_id IS NULL.

| 컬럼 | 타입 | 키 | 설명 |
|---|---|---|---|
| dlta_id | VARCHAR(32) | PK,FK | 델타ID (daw_dlta_entr_l PK 1:1 — 매핑 존재 = 배치 귀속 완료) |
| nttg_btch_id | VARCHAR(32) | FK | 네팅배치ID (daw_nttg_btch_l FK) |
| frst_reg_empno | VARCHAR(6) |  | 최초등록직원번호 |
| frst_reg_brcd | VARCHAR(4) |  | 최초등록부점코드 |

**연관 관계**


• 1:1 → daw_dlta_entr_l.
• N:1 → daw_nttg_btch_l.