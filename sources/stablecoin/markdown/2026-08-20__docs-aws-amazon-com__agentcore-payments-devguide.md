# Amazon Bedrock AgentCore payments — How it works / Core concepts (AWS 공식 개발자 문서)

> source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/payments-how-it-works.html · payments-concepts.html
> fetched: 2026-08-20 (WebFetch 추출 — 본문 근접 재현, 2페이지 합본)

## 자원 모델 (control plane)

- **PaymentManager** — AWS 계정의 최상위 결제 자원. 인증은 `AWS_IAM` 또는 `CUSTOM_JWT`, IAM role 을 서비스가 runtime 에 assume. 생성 시 AgentCore Identity 에 workload identity 프로비저닝. 앱·환경·팀 단위로 분리 구성.
- **PaymentConnector** — 외부 결제 제공자 통합. 타입 2종: `CoinbaseCDP` (Coinbase Developer Platform 지갑) · `StripePrivy` (Privy 지갑 인프라). 커넥터는 정확히 하나의 Manager 에 속하고, 한 Manager 가 복수 커넥터 가능.
- **PaymentCredentialProvider** — 커넥터와 1:1. 벤더 credential (CDP API key·wallet secret, Privy app credential·authorization key) 을 **AgentCore Identity → AWS Secrets Manager** 에 저장, ARN 참조. runtime 에는 `GetResourcePaymentToken` 으로 토큰만 취득 — credential 이 Payments API 로 직접 전달되지 않음.

## 자원 모델 (data plane)

- **PaymentSession** — 에이전트↔최종 사용자 상호작용 하나의 지출 컨텍스트. 만료 시간 + 선택적 지출 한도 (`maxSpendAmount`, `currency`). 만료·한도 도달 시 이후 결제 거절. **서명 실패 시 차감액 자동 롤백.**
- **PaymentInstrument** — 사용자를 대신해 머천트에 지불하는 embedded crypto wallet. 체인별 별도 instrument (같은 주소를 체인 간 공유 불가). 상태: INITIATED / ACTIVE / FAILED / DELETED. 유일 타입 = `EMBEDDED_CRYPTO_WALLET`.

## 지갑 자금과 권한

- instrument 생성 직후 잔액 0 USDC. **사용자가 명시적으로 권한을 부여하기 전에는 에이전트가 거래 불가.**
- 충전·권한 부여는 Coinbase WalletHub / Privy wallet hub 프론트엔드에서 — crypto 이체 또는 카드·Apple Pay·Google Pay·ACH. 권한은 같은 화면에서 회수도 가능.

## 결제 흐름 (x402, runtime)

1. 에이전트가 유료 tool/endpoint 호출 (Gateway 경유 또는 직접)
2. 머천트가 `402 Payment Required` + 결제 payload (금액·수취인·자산·네트워크)
3. **한도 체크** — 세션 지출이 한도를 넘으면 거절
4. **서명** — Identity 에서 지갑 credential 취득, 결제 증명 구성, 커넥터의 외부 파트너를 통해 서명
5. 에이전트가 `X-PAYMENT` 헤더에 서명 payload 를 실어 원 요청 재시도
6. 머천트가 검증·온체인 정산 후 콘텐츠 반환
7. **상태 갱신** — 세션 지출 장부 커밋. 어느 단계든 실패하면 한도 예약 해제 + FAILED 기록

## 두 번째 프로토콜 — MPP (Machine Payments Protocol)

x402 와 흐름은 같고 헤더만 다르다: 챌린지가 x402 payload 대신 `WWW-Authenticate: Payment` 헤더로 오고, 재시도는 `X-PAYMENT` 대신 `Authorization` 헤더에 서명 credential 을 싣는다. AgentCore 는 x402 v1·v2 와 MPP 를 모두 지원.

## 유료 자원 발견·접근

- **AgentCore Gateway** — 유료 MCP 서버·API 연결. Coinbase **x402 Bazaar** 기존 통합으로 수천 개 유료 MCP tool 발견
- **AgentCore Browser** — x402 지원 페이월 웹사이트 자율 접근

## 역할 (personas)

- **Agent developer** — Manager/Connector 1회 설정 + SDK/data plane API 통합. 지출 가드레일 구성·결제 활동 모니터링·credential 정책 관리
- **End user** — 잔액 충전 + 에이전트 지출 권한·한도 설정, 자금 사용 내역 투명성
- **Merchant** — pay-per-use 가격 설정, x402 결제 수락, 결제 확인 후 콘텐츠 제공

## IAM 역할 모델 [보강 2026-08-20, payments-iam-roles 확인]

4-role 분리: Administrator(ControlPlaneRole — Manager·Connector·CredentialProvider 관리) / Agent developer(ManagementRole — instrument·세션 관리, **ProcessPayment 명시적 Deny**) / Payment execution(ProcessPaymentRole — 결제 실행 + 읽기) / Service role(ResourceRetrievalRole — 런타임 credential 취득). 문서 원문: "Do not include PaymentSession write permissions and ProcessPayment in the same role, or the caller can bypass payment limits by creating new sessions with elevated budgets."

## Observability

AgentCore Observability 로 결제 전 주기 로그·대시보드·메트릭 (성공률·지출 패턴·오류 진단).
