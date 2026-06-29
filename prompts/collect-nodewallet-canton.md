# Collection Prompt — NodeWallet(NodeInfra)의 Canton 지원 검증

> 용도: NodeInfra **gated 문서 밖**(공개 웹·언론·SNS·GitHub·파트너 공지 등)에서 "NodeWallet 이 Canton Network 를 네이티브 지원하는가 + VerifyVASP 류 Canton 트래블룰 연동이 실재하는가" 를 수집·검증하는 재사용 프롬프트.
> 다른 AI(또는 deep-research 에이전트)에 그대로 붙여넣어 쓴다. 출력은 출처·tier·확신도가 붙은 구조화 결과.

---

## 너의 임무

NodeInfra 의 수탁 제품 **NodeWallet** 이 **Canton Network 를 네이티브 지원**하는지, 그리고 **Canton 네이티브 트래블룰(예: VerifyVASP) 연동**이 실재하는지를, 아래 "이미 아는 것" 을 넘어서는 **새로운 1차/2차 근거**로 수집·검증하라. 영업 구두 주장과 실제 출시(shipped)·로드맵을 엄격히 구분하라.

## 이미 아는 것 (baseline — 재수집 금지, 이걸 넘어서라)

- NodeInfra gated 문서(`docs.nodeinfra.com`, Mintlify project `nodewallet`)를 **2026-05-20 및 2026-06-25** 두 번 크롤. 2026-06-25 기준 **94페이지**.
- 그 문서 전수에서 **Canton 0건**. 구체 지원 체인은 **Solana 만**(`Chain.SOLANA`, `chain_id: solana-localnet`, `SolanaAddress` 스키마).
- 단 멀티체인 **groundwork** 는 등장: `chain_id` 파라미터 신설 + 값 인코딩의 "per-chain … **EVM**" 언급. → 가리키는 미래 체인은 **EVM**, Canton 아님.
- `get-omnibus-wallet` 엔드포인트 존재(omnibus 모델은 NodeWallet 도 사용).
- 영업 담당자 구두 주장(2026-06): "Canton 네이티브 기능 제공 + VerifyVASP Canton 트래블룰 + 국내 10개+ 은행/PG/카드사와 **Solana** POC 진행 중". → "Solana POC" 만 baseline 과 정합, "Canton 네이티브" 는 **문서 미입증**.

## 어디를 뒤질 것 (gated 문서 밖)

1. **NodeInfra 공식 공개 채널** — nodeinfra.com(블로그·뉴스·press)·LinkedIn·X·미디엄·보도자료·채용공고(Canton/DAML 역량 언급 여부도 단서).
2. **GitHub / 패키지** — `nodeinfra`, `nodewallet` org/repo, Maven `com.nodeinfra:*` 아티팩트, npm/pypi. SDK 의 chain enum 에 Canton 추가 흔적.
3. **Canton 생태계 측** — Canton Foundation validator/파트너 명단, Splice/Canton Network 파트너 발표에 NodeInfra 등재 여부, docs.canton.network 의 wallet-gateway signing-provider 목록(현재 internal/participant/fireblocks/dfns/blockdaemon — NodeInfra 추가됐나).
4. **VerifyVASP 측** — verifyvasp.com·공지·파트너에 NodeInfra/Canton 연동 발표.
5. **한국 핀테크/가상자산 언론** — 디지털애셋·코인데스크코리아·전자신문 등. "노드인프라 캔톤", "노드월렛 Canton", "10개 은행 스테이블코인 POC" 보도.
6. **컨퍼런스/발표 자료** — 슬라이드·영상에서 Canton 로드맵 언급.

## 각 후보마다 판정할 5개 질문

1. **shipped vs 로드맵 vs 영업화법** — Canton 지원이 실제 출시인가, 발표된 로드맵인가, 근거 없는 구두인가?
2. **Canton external-signing 구현 여부** — `/v2/interactive-submission/{prepare,execute}`, EdDSA Ed25519, external party allocation 을 구현했다는 근거가 있나?
3. **blind-sign vs decode** — 서명 전 Canton tx 를 디코딩·검증하나, hash blind-sign 인가? (NodeWallet 의 3-키/SGX 다중서명이 Canton 에서 어떻게 작동하나)
4. **participant node 운영 주체** — NodeWallet 이 host 하나, 고객 IDC 인가?
5. **VerifyVASP 연동 형태** — Canton sub-transaction privacy 위에서 IVMS101 을 어떻게 싣나?

## 출력 형식 (각 발견마다)

```
- 주장/사실: <한 줄>
  - 출처: <URL>
  - tier: 1차(벤더 공식 문서/코드) | 1차(벤더 공지/블로그) | 2차(언론) | 3차(영업 구두/슬라이드)
  - 상태: shipped | 로드맵 | 영업화법 | 불명
  - baseline 과의 관계: 정합 | 신규 | ⚠️ 충돌
  - 확신도: 상/중/하 + 한 줄 근거
```

마지막에 **결론 한 단락**: "현 시점 NodeWallet 의 Canton 지원은 [shipped/로드맵/미입증] 이다 — 근거: …". 그리고 **남은 미확인 질문** 목록.

## 규율 (반드시 지킬 것)

- ★ **영업 구두 주장을 fact 로 승격 금지.** shipped 라고 쓰려면 1차 문서/코드/공식 공지가 있어야 한다.
- ★ baseline(Solana-only, Canton 0건)과 **충돌하는 주장은 반드시 ⚠️ 로 표시**하고, 충돌을 해소하는 1차 근거가 없으면 "미입증" 으로 남겨라.
- ★ 추측으로 빈칸 메우지 말 것. 못 찾으면 "근거 없음" 이라고 정직하게 적어라.
- ★ gated `docs.nodeinfra.com` 는 이미 전수했으므로 **다시 긁지 말 것** — 공개 경로만.
- 한국어 출처가 많으니 한·영 병행 검색.
