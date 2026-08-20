<!--
source_url: https://docs.nodeinfra.com/security/architecture/tenant
path: /security/architecture/tenant
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 테넌트별 개시 키와 SPKI-hash 바인딩으로 테넌트 간 자금 흐름을 구조적으로 차단합니다.
-->

# 테넌트 격리

노드월렛은 단일 배포 안에 **다수의 테넌트**(계열사 · 부서 · 상품군 등)를 격리 운영하도록 설계되었습니다. 한 테넌트의 키가 탈취되어도 다른 테넌트의 자금은 영향받지 않으며, 공용 서비스(승인자 · SGX 엔클레이브 · 원장 DB)를 사용하면서도 **3개 키를 모두 테넌트별로 분리**하여 테넌트 경계를 구조적으로 강제합니다.

## 테넌트별 3-키 세트

각 테넌트는 고유한 `개시 키` · `승인 키` · `실행 키`를 보유합니다. 승인자와 SGX 엔클레이브는 공용 서비스지만 **키 세트는 테넌트별로 완전히 분리**되며, 승인자는 payload의 `tenant_id`로 해당 테넌트의 `승인 키`를 선택해 co-sign하고, 엔클레이브도 같은 방식으로 테넌트의 `실행 키`를 선택합니다.

## SPKI-hash 바인딩

테넌트 등록(`register_enclave`) 시점에 엔클레이브가 해당 테넌트 공개키의 **SPKI-hash**와 **blob_hash**를 원장에 기록합니다. 매 서명 요청마다 이 해시와 대조하여 **다른 테넌트 키로 서명된 요청은 구조적으로 거부**됩니다. 원장은 append-only이므로 등록 이후 해시를 변조하면 [감사 로그 Layer 1](/security/ops/audit-logs)에서 즉시 탐지됩니다.

## payloadtenant_id검증

모든 서명 payload(`SigningPayload v1`)는 `tenant_id` · `nonce` · `protocol_version` 필드를 포함합니다. 승인자와 엔클레이브는 payload의 `tenant_id`로 해당 테넌트의 `승인 키` · `실행 키`를 조회해 서명하며, `tenant_id`가 등록된 테넌트의 개시 키 공개키와 일치하지 않으면 요청을 거부합니다. **테넌트 경계는 3개 키 모두에서 교차 검증**됩니다.

## 한 테넌트가 탈취되어도

| 탈취 시나리오 | 다른 테넌트 영향 | 막히는 지점 |
| --- | --- | --- |
| 테넌트 A의개시 키탈취 | 없음 | 테넌트 B의 payload는 테넌트 A 키로 서명 불가 — SPKI 바인딩이 거부 |
| 테넌트 A의승인 키또는실행 키탈취 | 없음 | 키 자체가 테넌트별이라 다른 테넌트 서명에 사용 불가 |
| 테넌트 A의 운영자 키 탈취 | 없음 | 테넌트 A 내에서도승인 키co-sign 필수 —서비스 격리가 중첩 방어 |
| 테넌트 A의 정책 우회 시도 | 없음 | 승인자가 테넌트별 정책으로 판단, 다른 테넌트 정책에 영향 없음 |
| 공용 서비스(승인자 · 엔클레이브) 호스트 탈취 | 없음 | HSM 물리 방호로개시 키·승인 키추출 불가 + SGX MRENCLAVE 봉인으로실행 키추출 불가 —HSM·TEE참고 |

관련: [3-키 다중서명](/security/architecture/multisig) · [신뢰 경계](/security/architecture/trust-boundaries)
