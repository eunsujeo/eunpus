<!--
status: extracted-source
collected_at: 2026-09-01
scope: Korean regulation and public exchange cold-wallet disclosures
-->

# Cold Wallet 규제·거래소 공개자료 추출본

이 파일은 금융위원회와 거래소·커스터디 업체가 공개한 Cold Wallet 관련 내용을 선별해 일정한 형식으로 정리한 추출본이다. 공개된 비율과 절차는 각 기관이 밝힌 기준일과 범위 안에서만 기록했다. 이를 각 거래소의 현재 운영 구조 전체로 확대 해석하지 않는다.

## REG-KR-01. 가상자산이용자보호법 하위규정

- 제목: 가상자산이용자보호법 시행령 및 가상자산업감독규정 제정
- URL: https://www.fsc.go.kr/no010101/81214
- 보충 Q&A: https://www.fsc.go.kr/po020201/83937?curPage=2
- 접근일: 2026-09-01
- 등급: 규제기관 1차 자료

확인 내용:

- 가상자산이용자보호법 하위규정은 이용자 가상자산 경제적 가치의 80% 이상을 Cold Wallet에 보관하도록 정했다.
- 경제적 가치는 가상자산 종류별 보관 수량에 전월 말일 기준 최근 1년간 일평균 원화환산액을 곱하고 그 값을 모두 더해 산출한다.
- 사업자는 하루 중 특정 시점의 보관 수량을 기준으로 비율을 매일 점검하고 80% 이상이 항상 유지되도록 내부통제장치를 마련해야 한다.
- Cold Wallet은 가상자산을 인터넷과 분리해 보관하는 방식이다.

## EX-BITHUMB-01. 빗썸 공지

- 제목: 가상자산 보관 및 보안 관련 공지
- URL: https://feed.bithumb.com/notice/1651735
- 기준일: 2025-12-31
- 접근일: 2026-09-01
- 등급: 거래소 공식 공지

확인 내용:

- 빗썸은 2025-12-31 기준 자산의 95.6%를 Cold Wallet에 분리 보관한다고 공개했다.
- 공지는 Cold Wallet을 인터넷과 차단된 물리적 격리 환경이라고 설명한다.
- 보관 비율과 보안 운영 방향은 밝히지만 세부 서명·리밸런싱 절차는 공개하지 않는다.

## EX-COINBASE-01. Coinbase Singapore 자산 보호 공개

- 제목: Coinbase Singapore Consumer Protection Disclosures
- URL: https://www.coinbase.com/en-gb/legal/consumer_protection_disclosures/singapore
- 접근일: 2026-09-01
- 등급: 거래소 공식 규제 공개

확인 내용:

- Coinbase Singapore는 고객 자산 가운데 소수만 일상 거래·출금에 쓰는 settlement wallet에 두고 대부분은 오프라인 vault storage에 보관한다고 공개한다.
- Settlement wallet 잔액은 maximum balance threshold와 low balance threshold로 관리한다.
- 순입금으로 settlement wallet 잔액이 maximum threshold를 넘으면 초과 자산이 vault storage로 자동 이동한다.
- 순출금으로 특정 자산의 잔액이 low threshold 아래로 내려가면 거래 패턴을 검토한 뒤 근거가 있을 때 vault storage에서 settlement wallet로 옮긴다.
- 이 내용은 Coinbase Singapore의 보호 체계에만 해당한다. Coinbase 그룹 전체가 같은 절차를 따른다고 일반화하지 않는다.

## EX-COINBASE-02. Coinbase Global 2024 Q3 10-Q

- 제목: Coinbase Global, Inc. Q3 2024 Form 10-Q
- URL: https://investor.coinbase.com/files/doc_events/2024/Oct/30/Coinbase-Global-Inc-Q3-2024-10Q.pdf
- 근거 위치: p.84
- 접근일: 2026-09-01
- 등급: SEC 제출 기업 공시

확인 내용:

- Coinbase는 수탁 자산의 Hot Wallet 비중을 일반적으로 2% 이하로 유지하려고 한다고 2024 Q3 10-Q에 기재했다.
- Cold Wallet의 private key material은 미국과 유럽의 시설에 보관한다고 기재했다.
- 이 수치는 2024 Q3 공시 당시의 정보이며 2026년 현재 비율로 단정하지 않는다.

## EX-GEMINI-01. Gemini Custody

- 제목: Secure Crypto Storage - Gemini Custody
- URL: https://www.gemini.com/institutions/custody
- 접근일: 2026-09-01
- 등급: 커스터디·거래소 공식 제품 문서

확인 내용:

- Gemini는 segregated custody asset 전체와 exchange wallet asset 대부분을 offline air-gapped storage에 보관한다고 공개한다.
- Custody 고객 자산은 독립적으로 확인할 수 있는 unique digital address로 분리해 관리한다고 설명한다.
- Gemini Instant Trade를 사용하면 offline storage에 있는 자산을 exchange account에 즉시 credit해 거래할 수 있다고 설명한다.
- 물리 보안, role-based governance, biometric access control을 사용한다고 공개한다.
- 이 페이지는 상세 리밸런싱 절차나 exchange wallet asset의 정확한 Cold Wallet 보관 비율을 공개하지 않는다.

## EX-BITSTAMP-01. Bitstamp 보안 설명

- 제목: What does a safe exchange look like?
- URL: https://blog.bitstamp.net/post/what-does-a-safe-exchange-look-like/
- 접근일: 2026-09-01
- 등급: 거래소 공식 블로그
- 게시일: 2022-11-14

확인 내용:

- Bitstamp는 공개 글에서 자금과 자산의 약 95%를 offline cold storage에, 5%를 즉시 출금을 위한 Hot Wallet에 보관한다고 설명한다.
- BitGo와 Copper를 외부 custody provider로 언급하며 이들이 보관하는 offline asset은 해당 업체의 보험으로 보호된다고 설명한다.
- 보안 통제로 복수의 서면 승인, 2FA, withdrawal confirmation, whitelist, multisig를 열거한다.
- 2022-11-14 게시물의 수치이므로 2026년 현재 운영 비율로 단정하지 않는다.

## 비교 제약

- 자료마다 비율 산정 방법, 기준일, 자산 범위, 법적 관할이 다르다.
- 한국의 80%는 법적 최소 보관 비율이다. 법적 기준과 거래소별 공개 비율은 산정 범위가 다르므로 단순 비교하지 않는다.
- 공개 자료만으로는 키 조각 분포, 서명 정족수, 기기 보관 장소, 담당자 동선, 비상 절차의 전체 내용을 알 수 없다.
- 거래소 사례는 공개된 사실을 비교하기 위한 자료다.
