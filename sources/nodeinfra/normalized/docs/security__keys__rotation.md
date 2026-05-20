<!--
source_url: https://docs.nodeinfra.com/security/keys/rotation
path: /security/keys/rotation
downloaded_at: 2026-05-20
vendor: NodeInfra (Mintlify project: nodewallet)
access: gated (Mintlify password)
meta_description: 무중단 키 교체 — 이전 키와 신규 키가 병행 기간을 거칩니다.
-->

# 키 로테이션

운영 중인 키를 새 키로 교체할 때, 노드월렛은 병행 기간(parallel window)을 두어 서비스 중단 없이 전환합니다.
병행 기간 동안 시스템은 이전 키와 신규 키 양쪽 서명을 모두 유효하게 처리하며, 전환이 완료되면 이전 키는 폐기됩니다.

## 로테이션 유형

- **정기 로테이션** — 조직 정책에 따른 주기적 교체 (운영자 키 · 정책 키 등)
- **긴급 로테이션** — 탈취 의심 시 병행 기간 없이 즉시 교체 + 이전 키 즉시 폐기

## Admin API

로테이션은 [`rotate-signing-key`](/dev/api-reference/admin/rotate-signing-key) Admin API로 개시합니다.
응답에는 신규 키 지문과 병행 기간 만료 시각이 포함되며, 운영자는 이 기간 내에 SDK의 서명 키를 신규 키로 업데이트해야 합니다.
키별 로테이션 주기 · 병행 기간 · 긴급 로테이션 플레이북은 고객사의 운영 정책과 규제 요구사항에 따라 수립됩니다. 도입 시 노드인프라 팀에 문의해주세요.
