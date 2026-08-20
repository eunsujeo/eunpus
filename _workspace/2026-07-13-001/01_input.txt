[S01 | 문서 서두]
블록체인 매니저는 코어 존의 별도 서비스로, 온체인 거래(노드 연동)를 담당한다.
백엔드(Service·Admin)는 이 HTTP API 로 계정·주소·잔액·거래를 다루고,
온체인 상태 변경은 메시지 큐 이벤트로 받는다.

아래 규약은 **모든 엔드포인트에 공통** 적용된다.

[S02 | 응답 형식 도입]
성공·목록·에러 모두 같은 구조로 돌려준다. `meta.requestId` 로 요청을 추적한다.

[S03 | 에러 코드 도입]
판단은 `error.code` 로 한다.

[S04 | 페이지네이션]
목록은 **커서 방식**이다. `limit`(기본 200, 최대 500)으로 크기를 정하고, 응답 `pagination.nextCursor` 를 다음 요청 `cursor` 로 넘겨 이어받는다. `hasMore` 가 false 면 마지막이다. `cursor`/`nextCursor` 는 **불투명 토큰**이라 파싱·구성하지 말고 받은 값을 그대로 전달한다(다음 페이지 위치·필터가 토큰에 담겨 있다).

[S05 | 데이터 포맷]
- **시각** — ISO 8601, UTC, 밀리초. 예: `2026-07-13T04:05:06.789Z`
- **금액** — 문자열(decimal). 예: `"1.5"`. float 가 아니라 decimal 로 파싱하라.
- **필드명** — camelCase (`externalTxId` · `numOfConfirmations`)
- **요청 추적** — 모든 응답에 `meta.requestId`
- **온체인 해시** — 전파 후 채워짐(그 전엔 null), `txHash`

[S06 | 멱등]
- **생성** — `createAccount` 는 `ref`, `createDepositAddress` 는 `(accountId, asset)` 로 멱등하다. 같은 값으로 재요청하면 매니저가 같은 결과를 돌려준다(백엔드가 별도 멱등키를 넣지 않는다).
- **출금 제출** — 본문 `externalTxId` 가 멱등 키다. 같은 키로 재제출해도 중복 전송되지 않는다.

[S07 | 이벤트 도입]
온체인 상태 변경(입금 감지·출금 확정 등)은 이 HTTP API 가 아니라 **메시지 큐 이벤트**로 온다. 백엔드는 토픽별 컨슈머로 받는다.

[S08 | UNMAPPED 각주]
`UNMAPPED`(귀속 불명)은 대응되는 고객 계정이 없어 이벤트의 `accountId` 가 null 일 수 있다.

[S09 | ChainEvent 필드 부연]
- `type` — DEPOSIT · UNMAPPED · WITHDRAWAL · INTERNAL
- `status` — 공통 상태 다섯 (아래 "상태 (TxStatus) 기준")
- `txHash` — 전파 후 채워짐
- `subStatus` — 벤더 상세 사유. 분기 필요한 최소 집합만 보고 나머지는 로깅한다
- `networkStatus` — 체인 레이어 상태

[S10 | 전달 보장]
- **at-least-once** — 같은 이벤트가 드물게 두 번 올 수 있다. 이벤트 ID(`txId` 또는 `externalTxId`) 유일 기준으로 **상태 전이만 반영**한다.
- **오프셋 커밋** — 원장 반영이 성공한 뒤에만.
- **순서** — 같은 계정은 파티션 키가 보장.
- `REJECTED`(일시적) ≠ `FAILED`(영구). 확정은 `numOfConfirmations` 를 체인별 임계와 직접 비교한다.

[S11 | 상태 기준 도입]
거래·이벤트의 `status` 는 이 다섯이 기준이다. 벤더 원어는 매니저가 이 다섯으로 번역하고, `subStatus`·`networkStatus` 는 분기 필요한 최소 집합만 본다.

[S12 | 상태 기준 마무리]
판단은 다섯(`status`)으로 한다. `REJECTED`(일시적) ≠ `FAILED`(영구) 구분이 원장·화면 처리를 가른다.
`daw-core tx_stcd` 는 백엔드 상태 대응(제안)이다 — `REJECTED` 는 daw-core 에 짝이 없어 미정, `CHECKING`·`CANCELLED` 는 daw-core 고유 상태.

[S13 | createAccount 설명]
`ref`(우리 참조 키)로 vault 를 만들고 `ref ↔ accountId` 매핑을 반환한다. `ref` 는 daw-core 계정 ID 를 쓴다 — 고객 `ACT-000123`, 운영(관리) `SYS-000001`.
고객 계정뿐 아니라 운영(관리) 계정도 이 오퍼레이션으로 만든다 — 운영 계정은 역할별로 HOT_OPS(운영)·FEE_MGT(가스비)·RESERVE(준비금)이 있다.
같은 `ref` 재요청은 같은 `accountId` 를 돌려준다 (매니저가 `ref` 로 멱등 보장).

[S14 | createDepositAddress 설명]
자산 지갑을 활성화하고 입금 주소를 발급한다. EVM 은 자산당 주소 하나다.
같은 (accountId, asset) 재요청은 같은 주소를 돌려준다 (매니저가 멱등 보장).

[S15 | depositAddressOf 설명]
발급된 입금 주소를 조회한다(벤더 왕복 없음).
- 주소 있음 → `data` 에 주소
- 계정은 있으나 주소 미발급 → `data: null` (주소를 만들지 않는다)
- 계정 없음 → `404 ACCOUNT_NOT_FOUND`

[S16 | balanceOf 설명]
vault 단위 잔액을 가용·대기·잠김으로 돌려준다.

[S17 | transactionsOf 설명]
거래 이력을 **거래 시각(createdAt) 기준·최신순**으로 조회한다. 기간(`after`/`before`)·상태로 좁히고 커서로 페이지네이션한다.
상태 변경 실시간 감지는 이 목록이 아니라 이벤트 큐가 담당한다(매니저 내부의 lastUpdated 감지 폴링과 별개).

[S18 | estimateFee 설명]
낮음·보통·높음 세 단계 수수료를 추정한다. 실제 수수료는 제출 시점에 정해진다.

[S19 | submitTransaction 설명]
출금(또는 내부 이체)을 제출한다. `externalTxId` 로 재제출 중복을 차단한다.
응답은 벤더 tx id(`txId`)이며, 이후 상태 진행은 메시지 큐 이벤트로 따라간다(Events).

[S20 | TravelRule 타입 설명]
트래블룰 게이트가 만든 **봉인된(암호화) 산출물**이다. 이 API(매니저)는 운반만 하고
내용을 파싱하지 않으므로, 여기서는 내부 구조를 펼치지 않고 불투명한 객체로 둔다.
- 실제 구조의 기준은 **IVMS101 표준 + 트래블룰 솔루션 스펙**(게이트 쪽 문서)이다 — 이 API 소관이 아니다.
- 시나리오별로 실림 여부가 다르다 — 해외(Notabene)=메시지 있음, 국내(VerifyVASP)·개인지갑=없음(`null`).

[S21 | TransferPeer 타입 설명]
벤더 TransferPeerPath 대응. from·to 공통. type 에 따라 필요한 식별 필드가 정해진다.

[S22 | Transfer 타입 설명]
거래 1건. 요청의 `from`/`to`(TransferPeer)는 여기선 확정된 온체인 주소 문자열로 나온다.

[S23 | FeeEstimateRequest 타입 설명]
수수료 추정에 필요한 전송 형태만. 트래블룰·externalTxId·메모는 넣지 않는다.

[S24 | Fee 타입 설명]
수수료 추정 한 단계. 세부(가스 단가·한도 등)는 체인별로 구현에서 정의.

[S25 | EventType 타입 설명]
이벤트 분류. 매니저가 발신자가 우리 vault 인지로 가른다.

[S26 | ChainEvent 타입 설명]
큐로 오는 온체인 상태 변경 이벤트 (HTTP 응답이 아니라 메시지 큐로 전달).
