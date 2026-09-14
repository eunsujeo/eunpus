---
title: 노드 운영업체 RPC 연결 명세 — 고객 제안 초안
status: To Do
---

고객이 연결 명세를 제안하고, Dfns가 기능 호환성을 확인하며, 노드 업체가 구축·운영하는 계약이다. 고객 소유 노드를 전제로 한다. 설치 위치·접속 주소·용량·운영 수치는 아직 합의 전이며 이 문서는 업체에 발송하지 않았다.

공통 계약을 먼저 정하고, 체인별 부록을 붙인다. 사용자는 EVM 체인 1개 + ERC-20 자산 1개를 1차 범위로 선택했다. 아래 메서드 표는 이 범위의 검토 후보이며, 구체적인 네트워크·토큰을 정한 뒤 보완한다. Dfns의 확정 필수 메서드 목록으로 제시하는 것은 아니다. [전체 설계 계획](00-integration-plan.md#6-설계구현-순서)

## 1. 연결과 소유권

| 항목 | 우리가 제안하는 계약 |
|---|---|
| 노드 소유·운영 | 고객 소유·업체 운영. 장비/VM·데이터·운영 계정의 인도·종료 시 회수 조건 명시 |
| 호출 주체 | 고객 인프라의 Dfns 블록체인 연동·인덱싱 구성요소. DAWBC 보완 조회가 필요하면 별도 읽기 전용 자격 부여 |
| endpoint | 네트워크별 안정적인 RPC 진입점과 이중화 backend. 체인 ID·네트워크 이름을 함께 등록 |
| 망 | 허용한 고객 workload만 접근. 설치 위치에 따라 사내망 또는 사설 연결 경로 확정 |
| 전송 보안 | HTTPS와 인증을 기본 제안. mTLS 또는 지원되는 인증 헤더는 Dfns 클라이언트 호환성 확인 후 선택 |
| 자격증명 | 런타임 RPC 자격과 노드 관리 자격 분리. Dfns가 지정한 시크릿 경로에 보관하고 교체·만료 시험 |
| 조회·전파 권한 | 일반 조회와 서명된 거래 전파를 용도별로 제한. 노드의 계정 잠금 해제·지갑 서명 API는 업무 endpoint에 노출하지 않음 |
| WebSocket | Dfns가 요구하는 경우 제공. 연결 재수립·구독 재생성·누락 구간 조회 책임을 명시 |

업체는 전용 노드의 RPC를 제공하며 고객 지갑키로 거래를 서명하지 않는다. 고객 지갑의 MPC signer·Vault·정책 변경 권한은 별도 고객 운영 경계에 둔다. 노드 운영용 키·접근 계정이 필요하면 지갑 서명키와 구분해 관리한다.

## 2. EVM 기능 부록 · 검토 후보

| 용도 | 후보 메서드 | 확인할 계약 |
|---|---|---|
| 네트워크·동기화 | `eth_chainId`, `eth_blockNumber`, `eth_syncing` | 잘못된 체인과 동기화 지연을 정상 노드로 취급하지 않음 |
| 블록·거래·결과 | `eth_getBlockByNumber`, `eth_getBlockByHash`, `eth_getTransactionByHash`, `eth_getTransactionReceipt` | 블록 본문·receipt·실패 여부·로그·가스 사용 데이터와 과거 조회 범위 |
| 토큰·이벤트 | `eth_getLogs`, `eth_call`, `eth_getCode` | 로그 구간·응답 제한·필터·과거 블록 조회 범위 |
| 잔액·nonce | `eth_getBalance`, `eth_getTransactionCount` | `latest`·`pending` 등 지원 기준과 backend별 시점 차이 |
| 수수료 | `eth_estimateGas`, `eth_gasPrice`, `eth_feeHistory`, `eth_maxPriorityFeePerGas` | 해당 체인·Dfns 버전이 실제 사용하는 메서드와 오류 처리 |
| 전파 | `eth_sendRawTransaction` | 서명된 bytes를 그대로 전달. 접수 결과·중복·nonce 관련 오류 원문 보존 |
| 확정 관측 | `safe`·`finalized` block tag | 체인별 지원과 의미를 확인. 내부 DCCP 정책과 별도 |
| 과거 상태·trace | 별도 합의 | native 내부 이동 감지·재인덱싱 등 Dfns 요구에 따라 trace/추가 API 확인 |

메서드 역할과 block tag의 기술 기준은 [Ethereum JSON-RPC](https://ethereum.org/developers/docs/apis/json-rpc/)를 참고했다. 특정 블록의 상태 조회를 일관되게 묶는 경우 [EIP-1898](https://eips.ethereum.org/EIPS/eip-1898)의 block hash 지정 지원을 검토한다. **이 표만으로 모든 체인의 인덱싱·입금 감지가 충족된다고 보장하지 않는다.** 공식 문서 확인일: 2026-09-14.

과거 블록·receipt·로그 보관과 과거 상태 조회는 구분해 기간·범위를 적는다. archive라는 이름만으로 필요한 데이터를 모두 받을 수 있다고 판단하지 않는다. Solana 후보는 아래 6절에 정리했다. EVM과 서로 다른 항목 식별·확정 기준을 적용한다.

## 3. 장애 전환과 재시도

1. 업체는 체인별 이중화 backend와 단일 진입점 또는 Dfns가 지원하는 다중 endpoint를 제안한다. 물리 장애 구역과 공유 스토리지·네트워크 의존성을 명시한다.
2. 건강 판정에는 체인 ID·동기화·블록 높이/해시·최신 블록 지연을 포함한다. `eth_syncing=false`나 TCP 응답 하나만으로 정상 판정하지 않는다.
3. gateway와 Dfns 중 누가 장애 전환을 담당하는지 하나의 계약으로 정한다. 두 계층의 재시도가 겹치지 않도록 전체 timeout·재시도 예산을 맞춘다.
4. gateway는 거래를 재구성·재서명하거나 nonce·수수료를 바꾸지 않는다. 초기안은 전파 요청 자동 재시도를 gateway에서 수행하지 않고, 결과 불명을 호출자에 전달하는 것이다. Dfns 동작과 대조해 확정한다.
5. 조회는 블록 기준을 고정할 수 있는지 검토한다. `latest`·`pending` 관측이 다른 노드의 결과를 한 시점 데이터처럼 합치지 않는다.
6. WebSocket 재연결은 과거 알림 전달을 보장하지 않는다. 재조회 시작점·중첩 구간·중복 제거·체크포인트를 Dfns와 합의한다.

전파 API의 timeout은 체인 미전파 증거가 아니다. 원본 거래 해시·접수 로그·조회 결과를 대조해 복구한다. 원장·출금 재시도 판단은 [DAWBC 핵심 계약](01-core-contracts.md)을 따른다.

## 4. 용량·SLO·관측의 합의 항목

| 합의할 값 | 산정·검증 기준 |
|---|---|
| 정상/피크 RPS·동시 호출 | 송금량뿐 아니라 인덱싱·토큰 조회·확정 추적·대사·장애 복구 부하를 함께 측정 |
| 단건·batch·로그 조회 제한 | 최대 batch 수, 요청/응답 크기, 블록 구간·로그 건수, 페이지/분할 규칙을 명시 |
| 지연·timeout·오류율 | 일반 조회·과거 조회·전파를 구분해 p95/p99·오류율·timeout을 합의 |
| 동기화 지연·장애 전환 | 체인별 허용 지연·판정 주기·제외/복귀·failover 목표를 측정 가능한 값으로 결정 |
| 재인덱싱 | 최대 장애/복구 기간에 필요한 이력 범위, 백필 처리량, 정상 트래픽과 자원 격리 |
| 운영 증빙 | 시각·request ID·메서드·backend·지연·오류·체인 ID·블록 기준. 인증 헤더와 비밀 값은 로그에서 제외 |
| 운영 지원 | 점검 통지·긴급 패치·당직·장애 등급·원인 분석·Dfns 공동 대응과 계약 종료 시 인도 |

노드 수나 보장 TPS는 입력 없이 정하지 않는다. 초기 운영 부하를 측정한 뒤 조회·전파·백필 예산을 나누며, 대량 과거 조회가 출금 경로를 고갈시키지 않는지 검증한다.

## 5. 연결 인수 시험

| 시험 | 기대 결과 |
|---|---|
| 정상 RPC | Dfns에서 지갑 입금·출금·확정·과거 이력 조회까지 수행 |
| 자격 오류·교체 | 잘못된 자격은 차단, 교체는 정해진 절차로 성공, 관리 endpoint는 접근 불가 |
| 다른 체인·뒤처진 노드 | 정상 pool에서 제외되며 잘못된 잔액·확정으로 업무 처리하지 않음 |
| 전파 후 응답 유실 | 원본 요청을 대사해 중복 출금을 만들지 않음 |
| backend 장애·복귀 | 거래 조회와 감지 체크포인트가 복구되고 누락·중복 원장 반영 없음 |
| 과거 로그·재인덱싱 | 합의한 최대 범위의 조회·복구를 부하 제한 안에서 완료 |
| reorg | 테스트 환경의 재편으로 기존 블록 관측 변경과 입금/출금 상태 정정을 확인 |

시험은 먼저 격리된 검증 환경에서 수행한다. 실제 운영 체인의 장애나 재편을 유발하는 작업은 이 설계 범위에 포함하지 않는다.

## 6. Base·Solana 확장 부록

Base도 EVM 메서드 후보를 출발점으로 삼되, L2 확정·수수료·노드 역할과 필요한 상위 체인 의존성을 별도 계약에 기록한다. **일반 노드 RPC, bundler API, paymaster API는 서로 다른 서비스**다. ERC-4337을 선택했다고 기존 노드 업체가 bundler·paymaster까지 제공한다고 가정하지 않는다. [ERC-4337 Paymasters](https://docs.erc4337.io/paymasters/index.html)

| Solana 용도 | RPC 후보 | 합의할 내용 |
|---|---|---|
| 네트워크·건강 | getGenesisHash, getHealth, getVersion, getSlot, getBlockHeight | 올바른 cluster와 지연 검증. commitment별 관측 차이 |
| 메시지 수명 | getLatestBlockhash | blockhash·lastValidBlockHeight 반환과 노드 간 시점 차이 |
| 거래·이력 | getTransaction, getBlock, getSignatureStatuses, getSignaturesForAddress | 거래 version·과거 보관·페이지·실패·instruction 데이터 제공 범위 |
| 계정·자산 | getAccountInfo, getTokenAccountsByOwner | mint·token program·owner·token account·정밀도 검증 |
| 비용·시뮬레이션 | getFeeForMessage, getRecentPrioritizationFees, getMinimumBalanceForRentExemption, simulateTransaction | 기본/우선순위 비용·계정 생성 자금 분리, 시뮬레이션 기준 slot |
| 전파 | sendTransaction | 서명된 bytes 유지, 접수와 확정 분리, 클라이언트/노드 재전파 예산 |

Solana 메서드의 기준은 [공식 RPC 목록과 sendTransaction](https://solana.com/docs/rpc/http/sendtransaction), [getLatestBlockhash](https://solana.com/docs/rpc/http/getlatestblockhash)다. 위 표는 Dfns 필수 목록이 아닌 고객 검토 후보다. 구독 방식·Token-2022·대납 공동 서명·durable nonce 경로는 지원 릴리스와 추가 대조한다.

### 외부 대납업체와 맞출 연결 조건

업체가 조회·시뮬레이션·전파에 실제 사용하는 RPC와 데이터 보관 위치를 각각 명시하게 한다. 고객 지정 노드를 지원하면 endpoint·인증·timeout·전파 책임을 같은 계약에 연결한다. 업체 공용 RPC만 지원한다면 현재 고객 노드 설계의 변경·예외로 기록하고 채택 여부를 결정한다. 업체 장애 시 DAWBC가 별도 전파 경로로 임의 재제출하지 않는다.

추가 인수 시험은 Base의 확정/비용 관측, Solana의 blockhash 만료·다른 cluster·지원되지 않는 거래 version·토큰 계정 생성·전파 응답 유실을 포함한다. 구체 체인·릴리스가 정해진 뒤 실제 호출 목록과 데이터 보관 범위를 고정한다.

## 연결 문서

- [통합 구성·계획](00-integration-plan.md), [계정·API·이벤트 계약](01-core-contracts.md)
- [Dfns 담당자 질문 Q04·Q05](../Dfns/04-vendor-questions.md): 우리가 제안한 명세와 지원 릴리스의 대조
