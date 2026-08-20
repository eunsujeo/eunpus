# Open Questions — wallet-bank (daw-core)

> 1차 자료(sources/wallet-bank)에서 "미확정/미결정/구현 시 결정"으로 명시되었거나 원본에 부재한 사항. 코어 팀 결정 전까지 본문에 단정 진술 금지.

## 설계 미확정 (설계.txt 명시)

- **Q-2026-07-10-WB01** — 멀티체인에서 동일 자산의 체인 간 이동(브릿지) 포함 여부. Status: open (source: wallet-bank/설계/설계.txt)
- **Q-2026-07-10-WB02** — 가스비를 수수료 정책에 반영할지 여부. Status: open — 가스비 관리 "식별" 단계 (source: wallet-bank/설계/설계.txt)
- **Q-2026-07-10-WB03** — 개인지갑(unhosted) 주소 소유 확인(사전 등록 등) 절차 필요 여부. Status: open (source: wallet-bank/설계/설계.txt)
- **Q-2026-07-10-WB04** — 한도 초과 시 거래 거절 vs 보류 규칙. Status: open (source: wallet-bank/설계/설계.txt)
- **Q-2026-07-10-WB05** — 상대 VASP 거부 시 거래 처리 규칙, 반환 수수료 부담 주체. Status: open (source: wallet-bank/설계/설계.txt)

## 구현 시 결정 / 원본 부재

- **Q-2026-07-10-WB06** — 시스템자산 Redis↔DB(`daw_sys_ast_bal_m`) 동기화 주기. Status: open — 원본 "구현 시 결정" (source: wallet-bank/db/backend/system-asset.md)
- **Q-2026-07-10-WB07** — 네팅 배치 트리거 조건·주기(시간/건수/금액 임계). Status: open — 원본 미명시 (source: wallet-bank/db/backend/ledger.md)
- **Q-2026-07-10-WB08** — Outbox 이벤트 테이블 물리명. `infra.md` 에 헤더 테이블명 없이 컬럼만 기술됨. Status: open (source: wallet-bank/db/backend/infra.md)
- **Q-2026-07-10-WB09** — 커스터디 제공사 코드(`cstd_prvd_dvcd`) 전체 체계. 01:FIREBLOCKS, 02:SELF 만 예시. Status: open (source: wallet-bank/db/backend/account-asset.md)

## 미구현 (스키마만 선반영)

- **Q-2026-07-10-WB10** — `[확장 P1]` `daw_aml_scrn_l`(트래블룰 연계 필수) 구현 시점·연계 솔루션. Status: open
- **Q-2026-07-10-WB11** — `[확장 P2]` `daw_smrt_cntr_m`·`daw_ldgr_bal_l`·`daw_onch_sync_l`·`daw_acnt_cls_l` 구현 계획. Status: open (source: wallet-bank/db/backend/*)
