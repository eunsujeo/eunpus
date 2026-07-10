<!--
source_url: https://github.com/fireblocks/plugin-based-callback-handler
downloaded_at: 2026-07-10
verified_from:
  - https://raw.githubusercontent.com/fireblocks/plugin-based-callback-handler/main/README.md
  - https://api.github.com/repos/fireblocks/plugin-based-callback-handler/contents/src/plugins
  - src/plugins/txid_validation.py
  - src/plugins/extra_signature.py
  - src/plugins/tx_policy_validation.py
  - src/plugins/psbt_validation.py
status: full
priority: TIER1
domain: callback-handler / validation
cluster: callback-handler
-->

# Fireblocks Plugin-Based Callback Handler (Stage 153 Mode C)

**Status**: promote-approved Stage 153. raw README + 4 plugin 소스 파일 직접 verify (WebFetch 요약 아닌 raw 파일 확인). 본문 코드 전체 미로드 — 검증 로직 요지만.

boilerplate 애플리케이션 — Callback Handler 서버를 처음부터 짜지 않도록 plugin 골격 + 사전 구성 plugin 4종 제공. (source: README.md)

## Architecture (본문 인용)

- **PluginInterface** (`src/plugins/interface.py`) 상속. 각 plugin 이 구현: `async def init(...)`, `async def process_request(self, data) -> bool`, `async def _create_db_instance(...)`, `async def set_db_instance(db)`, `def __repr__`. `process_request` 가 "entry point to your plugin logic".
- **plugin 등록**: `PLUGINS` 환경변수 — snake_case 이름 comma 구분. custom path 는 `"plugin_name:/path/to/plugin"`, path 생략 시 `src/plugins` default.
- **decision flow**: 각 plugin `process_request()` 가 **boolean** 반환 — `True` = approve, `False` = reject. handler 가 이 결과들로 Co-signer 에 보낼 최종 승인/거절 결정을 렌더.
- `src/plugins` 파일 목록 (verified): `interface.py`, `plugin_manager.py`, `txid_validation.py`, `extra_signature.py`, `tx_policy_validation.py`, `psbt_validation.py`, `tx_policy/` (dir), `__init__.py`.

## 4 사전 구성 plugin — 검증 항목 (각 소스 파일 verify)

### 1. Transaction ID Validation (`txid_validation.py` / `TxidValidation`)
- payload 의 `txId` 추출 → **DB 조회로 해당 txId 존재 여부 확인**. `exists = await self.db.execute_query(...)` → `return bool(exists)`.
- `True` = txId 가 DB 에 존재. `False` = 미존재. `txId` 없으면 PluginError.
- **의미**: Callback Handler 가 받은 요청이 **우리 시스템이 실제로 발행한 txId** 인지 대조 (out-of-band 발행 요청 차단). 서명 대상 자체가 아니라 요청 provenance 검증.

### 2. Extra Signature Validation (`extra_signature.py` / `ExtraSignature`)
- payload 의 `extraParameters.message` + `extraParameters.extraSignature` 필수. 둘 중 하나라도 없으면 "Missing extra signature/message" 에러.
- base64 디코드한 signature 를 **public key 로 RSA verify (PKCS1v15 + SHA256)** — message 에 대한 추가 서명 검증.
- 성공 시 `True` ("Signature verified successfully."), 실패 시 return False 가 아니라 PluginError 전파 ("Could not verify the extra signature").
- **의미**: Fireblocks 표준 JWT 인증 위에 **애플리케이션 계층 추가 서명**을 얹어, 요청이 우리 백엔드에서 승인·서명됐음을 이중 확인.

### 3. Transaction Policy Validation (`tx_policy_validation.py` / `TxPolicyValidation`)
- 요청 `data` → `Transaction` 객체 변환 후 로컬 **PolicyEngine** 에 `self._policy_engine.check_tx(tx)` → `return result.allow`.
- 초기화 소스: `_groups_to_users_mapping`, `_policy_dict`, `_policy_engine` (`PolicyEngine.from_policy_dict()`). 세부 비교 필드(amount/asset/src/dst)는 `tx_policy/` 패키지의 PolicyEngine 에 위임 — 본 excerpt 미노출.
- **의미**: Fireblocks TAP(policy engine) 과 **독립된, Callback Handler 측 자체 정책**을 서명 직전에 재평가. TAP 우회·오설정 대비 second-layer 정책.

### 4. PSBT Validation (`psbt_validation.py` / `PSBTValidation`)
- 사전 조건: `extraParameters.psbt` 존재, `sourceType == "VAULT"`, asset ∈ {`BTC`, `BTC_TEST`}.
- `psbt_to_signature_hashes(psbt)` (bitcointx 라이브러리) 로 PSBT 에서 서명 해시 집합 추출 → 각 signature request 의 `content` 가 그 집합에 있는지 대조: `if request.get('content') not in signature_hash_set` → 불일치 시 "Signature hash not found in PSBT".
- `True` = PSBT 가 DB 에 존재 AND 모든 서명 요청 해시가 PSBT 에서 추출한 해시와 일치.
- **의미**: BTC 판(版) — ETH "Validate raw transactions" 가이드의 해시 대조와 동형. **Co-signer 가 서명하려는 해시가 우리가 만든 PSBT 의 해시와 정확히 일치**하는지 확인 (서명 대상 변조 차단).

## 교차 정리 — Fireblocks 가 기대하는 검증 계층

이 boilerplate 가 예시하는 검증은 3 계층으로 요약:
1. **요청 provenance** — txId 가 우리 발행분인가 (plugin 1), 추가 서명이 우리 것인가 (plugin 2)
2. **정책 재평가** — Callback Handler 측 독립 정책 통과 여부 (plugin 3)
3. **서명 대상 무결성** — 서명될 해시가 우리가 만든 tx/PSBT 의 해시와 일치하는가 (plugin 4, ETH 가이드와 동형)

## Related cite targets
- [[entities/fireblocks/callback-handler]]
- [[vendors/fireblocks/callback-handler]]
- [[vendors/fireblocks/policy-engine]]
- [[sources/fireblocks/markdown/2026-05-22__developers-fireblocks-com__reference-validate-eth-raw-transactions]] — ETH 해시 대조 (plugin 4 와 동형)

## Source
- `https://github.com/fireblocks/plugin-based-callback-handler` (README + src/plugins/*.py raw verify, 2026-07-10)
