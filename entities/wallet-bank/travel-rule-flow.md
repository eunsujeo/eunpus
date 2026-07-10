---
type: entity
vendor: wallet-bank
status: draft
tags: [compliance, aml, transaction, integration]
stage_introduced: 155
last_updated_stage: 155
source_count: 3
related:
  - design-requirements
  - data-model
  - overview
---
# Travel Rule & VASP Flow (daw-core)

> 외부 VASP 이체 5종의 책임 분리와 순서 강제. **판단은 트래블룰 솔루션, 연동은 BCM, 순서 강제는 코어** (source: wallet-bank/설계/설계.txt).

## Summary

거래소 등 외부 VASP 지갑과의 이체는 제휴 계약 없이도 규제(트래블룰)가 강제하는 영역이라 외부 지갑 연동(PTN)과 다르다. 코어는 VASP 마스터 데이터를 보유하지 않고(코어 밖), 검증 결과(승인/거부/보류)만 수신해 판단 근거를 모른 채 순서만 강제한다 (source: wallet-bank/설계/설계.txt).

## Key Concepts

- **순서 강제** — 검증 승인 전 BCM 전달 불가. 거래 상태 머신(`daw_tx_l`)으로 순서 보장. BCM 은 전달받은 건을 무조건 실행(재검증 없음) (source: wallet-bank/설계/설계.txt).
- **fail-close** — 검증 서비스 장애 시 외부 이체 중단 (source: wallet-bank/설계/설계.txt).
- **VASP 마스터** — `daw_vasp_m`(`trvl_rule_yn`·`natn_cd`), 거래 연결은 `daw_tx_ext_dst_l.vasp_id` FK (미등록 개인지갑은 NULL) (source: wallet-bank/db/backend/master.md; transaction.md).
- **AML 심사 기록** — `daw_aml_scrn_l` (사전/사후모니터링/STR, `scrn_rslt_dvcd` 00정상~03차단, 송·수신 VASP) [확장 P1 필수] (source: wallet-bank/db/backend/control.md).

## Details — VASP 이체 5종 (source: wallet-bank/설계/설계.txt)

| 흐름 | 핵심 규칙 | 연계 |
|---|---|---|
| VASP 식별/등록 | 등록·화이트리스트·주소 귀속은 BCM(솔루션), 코어는 승인/거부만 수신 | INT-05, BCM-08 |
| VASP 향 송신 | 검증 승인→BCM 전송 순서 코어 강제, BCM 재검증 없음, 상대 거부 시 처리 규칙 | INT-05, BCM-03, LDG-03 |
| VASP 발 수신 | 트래블룰 정보↔온체인 입금 매칭, 미도착/불일치 시 보류 | BCM-04, INT-05 |
| 반환 처리 | 사유별 경로(자동/운영), 반환 수수료 부담 주체 | LDG-03, BCM-03 |
| 개인지갑(비수탁) | 허용 여부·한도 별도, 주소 소유 확인 절차 미확정 | INT-05, POL-02 |

### 실패·보류 자금 처리
검증 실패·상대 거부·출금 실패 자금은 별단원장(`daw_susp_l`, ADR-004)에 임시 보관 후 환급(`daw_susp_rfnd_l`). 원소유 자산이 환급 기본 목적지 (source: wallet-bank/db/backend/control.md).

## Related Pages

- [[vendors/wallet-bank/design-requirements]]
- [[vendors/wallet-bank/data-model]]
- [[entities/wallet-bank/ledger-netting]]
- [[vendors/fireblocks/compliance]] — Fireblocks 측 컴플라이언스 대비

## Sources

- `wallet-bank/설계/설계.txt`
- `wallet-bank/db/backend/master.md`
- `wallet-bank/db/backend/transaction.md`
- `wallet-bank/db/backend/control.md`

## Open Questions

- 상대 VASP 거부 시 거래 처리 규칙·반환 수수료 부담 주체·개인지갑 주소 소유 확인 → [[open-questions/wallet-bank]]
