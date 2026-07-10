---
type: vendor-hub
vendor: wallet-bank
status: draft
tags: [architecture, transaction, compliance, aml, policy]
stage_introduced: 155
last_updated_stage: 155
source_count: 1
related:
  - overview
  - travel-rule-flow
  - ledger-netting
---
# wallet-bank — Design Requirements

> 설계.txt 의 요구항목 목록과 성숙도 상태(식별/설계/개발). "코어가 무엇을 하고 무엇을 솔루션에 위임하는가"의 경계를 담는다 (source: wallet-bank/설계/설계.txt).

## Summary

각 항목은 성숙도 라벨이 붙어 있다: **식별**(요구만 식별) → **설계**(설계 진행) → **개발**(개발 착수). 다수가 "식별" 단계라 미확정 결정을 포함한다 — 미확정은 [[open-questions/wallet-bank]] 로 격리 (source: wallet-bank/설계/설계.txt).

## Key Concepts

- **솔루션 중립 계약** — 주소 발급/서명/전송/조회를 솔루션 중립 인터페이스로. 솔루션 교체 시 코어 무변경 목표 (설계, source: wallet-bank/설계/설계.txt).
- **계정 체계** — 사용자 계정과 운영 계정(수수료·미결·대사차이) 분리. 자산(코인)×체인 차원 확장 (설계, source: wallet-bank/설계/설계.txt).
- **exactly-once 입금 감지** — 체인별 컨펌 수·reorg 대응, 감지 이벤트 정확히 한 번 전달 (설계, source: wallet-bank/설계/설계.txt).
- **이중 전송 방지 + 논스 관리** — 전송 실패/재시도 시 이중 전송 방지 (설계, source: wallet-bank/설계/설계.txt).
- **fail-close** — 트래블룰/검증 서비스 장애 시 외부 이체 중단 (식별, source: wallet-bank/설계/설계.txt).

## Details — 요구항목 (BCM/LDG/INT/POL)

### 온체인·솔루션 계층 (BCM)
| 항목 | 상태 | 요점 |
|---|---|---|
| 지갑 솔루션 추상화 인터페이스 | 설계 | 솔루션 중립 계약, 교체 시 코어 무변경 |
| 주소 생성/관리 | 개발 | 계정↔주소 매핑은 코어 원장이 원본 보유, 재사용/폐기 정책 |
| 트랜잭션 브로드캐스트 (BCM-03) | 설계 | 이중 전송 방지, 논스 관리 |
| 입금 감지/컨펌 정책 (BCM-04) | 설계 | 체인별 컨펌·reorg, exactly-once |
| 가스비 관리 | 식별 | 가스 잔액 임계 알림, **수수료 정책 반영 여부 결정 대기** |
| 체인 장애 대응 | 식별 | 온체인만 지연·내부거래 정상, 복구 후 순차 처리 |
| 멀티체인 네트워크 지원 | 식별 | 체인별 어댑터만 추가, **브릿지 포함 여부 미확정** |
| 트래블룰 솔루션 연동 (BCM-08) | 식별 | 솔루션 중립 검증 IF, VASP 마스터·주소 귀속, fail-close |

### 계정·원장·정책 계층 (LDG/POL)
| 항목 | 상태 | 요점 |
|---|---|---|
| 계정 체계 설계 | 개발 | 사용자/운영 계정 분리, 자산×체인 확장 |
| 수수료 정책 (POL) | 설계 | 유형별 요율 테이블, 수수료는 별도 원장 계정 전기 |
| 거래 상태 머신 (LDG-03) | 설계 | 요청→검증→전기→확정/실패, 온체인은 브로드캐스트/컨펌 추가, 모든 전이 이벤트 기록 |
| 한도 정책 (POL-02) | 설계 | 일/월/건당·KYC 등급, **초과 시 거절 vs 보류 미정** |

### 외부 VASP / 트래블룰 (INT-05) → [[entities/wallet-bank/travel-rule-flow]]
| 항목 | 상태 | 요점 |
|---|---|---|
| VASP 식별/등록 연계 | 식별 | 등록·화이트리스트·주소 귀속은 BCM(솔루션), 코어는 승인/거부만 수신 |
| VASP 향 송신 이체 | 식별 | 검증 승인→BCM 전송 순서 코어 강제, BCM 은 무조건 실행(재검증 없음) |
| VASP 발 수신 처리 | 식별 | 트래블룰 정보↔온체인 입금 매칭, 미도착/불일치 시 보류 |
| 반환 처리 | 식별 | 사유별 경로(자동/운영), 반환 수수료 부담 주체 결정 |
| 개인지갑(비수탁) 이체 정책 | 식별 | 허용 여부·한도 별도, **주소 소유 확인 절차 미확정** |
| 트래블룰/AML 연계 | 식별 | 검증 대기 상태에서 훅 호출, fail-close |

## Related Pages

- [[vendors/wallet-bank/overview]]
- [[entities/wallet-bank/travel-rule-flow]]
- [[entities/wallet-bank/ledger-netting]]
- [[open-questions/wallet-bank]]

## Sources

- `wallet-bank/설계/설계.txt`

## Open Questions

- 브릿지·가스비 수수료 반영·개인지갑 주소 소유 확인·한도 초과 처리 등 "식별" 단계 미확정 → [[open-questions/wallet-bank]]
