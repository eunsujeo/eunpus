---
title: Fireblocks Cold Wallet — ingest·promote·문서화 계획
status: Done
date: 2026-09-01
ref: 참고
---

# Cold Wallet 자료 정리 계획

이 계획은 Fireblocks Cold Wallet 공식 문서와 규제·거래소 공개자료를 원본으로 보존하고 확인한 내용을 기존 Fireblocks 위키에 promote한 뒤 운영 참고 문서로 발행한다. 당사 시스템의 목표 구조나 권장 설계는 범위에서 제외한다.

## 작업 범위

- Fireblocks 공식 Cold Wallet 문서의 날짜 고정 스냅숏과 출처 메타데이터 보존
- 금융위원회의 콜드월렛 보관 기준과 국내외 거래소 공개자료 보존
- Cold Wallet lightweight index의 Mode C full ingest
- 기존 Fireblocks hub·entity·open question 갱신
- `06-cold-wallet-operations.md` 발행과 Fireblocks 문서 색인 연결
- source manifest, 해시, 링크, frontmatter, 문서 빌드 검증

## 범위에서 제외하는 내용

- 당사 Hot·Cold 비율 결정
- 당사 자산별 임계치·리밸런싱 룰
- 당사 역할 배치·RACI·승인 정족수 제안
- 당사 Transaction Policy 규칙과 To-Be architecture
- 제품 도입·선정을 위한 결론
- Cloudflare Pages 실제 배포

## Phase 1. 원본 수집과 ingest

Fireblocks 공식 문서, 금융위원회 자료, 거래소 공시·보안 문서를 수집한다. 원본은 날짜가 붙은 스냅숏으로 보존하며 URL·수집일·자료 등급·SHA-256은 manifest에 기록한다. 기존 lightweight index는 삭제하거나 덮어쓰지 않는다.

완료 조건:

- 수집 대상별 local source ID 발급
- Fireblocks·규제·거래소 자료의 소유 경계 분리
- 원본과 정규화본의 구분
- manifest와 파일 해시 일치
- 리뷰 1 → 수정 1 → 리뷰 2 → 수정 2 완료

## Phase 2. Mode C promote

수집한 source에서 확인한 사실만 추출한다. 새 entity는 만들지 않고 `workspace`, `mobile-device`, `transaction`, `workspace-keys-backup`, `security`, `architecture`에 흡수한다. 기존 open question은 근거를 확보한 항목만 상태를 바꾼다.

완료 조건:

- 모든 fact에 local source와 원본 위치 표기
- 추정·외삽을 fact와 분리
- 양방향 위키링크와 source count 갱신
- `Stage 171` 작업 이력 기록
- 리뷰 1 → 수정 1 → 리뷰 2 → 수정 2 완료

## Phase 3. Cold Wallet 문서 발행

`06-cold-wallet-operations.md`에는 Fireblocks가 공개한 Cold Wallet 구조, 워크스페이스 제약, 기기 등록, QR 서명, Hot·Cold 이동, 백업·복구, 국내 규제, 거래소 공개 사례를 정리한다. 공식 절차와 외부 사례의 공개 수준을 구분하고 비공개 운영 내용은 추정하지 않는다.

완료 조건:

- frontmatter `status: Done`
- `00-overview.md` 문서 구성 표에 링크 추가
- 당사 설계 제안과 권고 문장 0건
- 확정 사실·공개 사례·미확인 경계 표시
- 리뷰 1 → 수정 1 → 리뷰 2 → 수정 2 완료

## Phase 4. 검증과 종결

소스 manifest와 해시, 상대경로 링크, frontmatter, 인용, 문서 빌드를 검사한다. 리뷰에서는 사실 정합성과 한국어 문체를 따로 살핀다.

완료 조건:

- source ID·URL·인용 누락 0건
- 깨진 local link 0건
- Blockchain Manager 정적 문서 빌드 성공
- 사용자가 만든 기존 미추적 파일을 변경하지 않음
- 리뷰 1 → 수정 1 → 리뷰 2 → 수정 2 완료

## 리뷰 방법

각 Phase가 끝날 때마다 두 번 리뷰한다. 첫 리뷰에서는 출처·수치·범위·추정 여부를 검사한다. 수정한 뒤 둘째 리뷰에서 링크·구조·문체와 남은 오류를 다시 확인한다. 두 리뷰 모두 `humanize-korean` fast 모드를 적용하되, 수치·고유명사·직접 인용·의미는 바꾸지 않는다.

## 종결 산출물

- Fireblocks Cold Wallet 원본 스냅숏과 manifest
- `sources/fireblocks/source-notes/cold-wallet-operating-model.md`
- promote된 Fireblocks hub·entity·open question
- `blockchain-manager/docs/디지털 자산/Fireblocks/06-cold-wallet-operations.md`
- `blockchain-manager/docs/디지털 자산/Fireblocks/00-overview.md` 색인 갱신
- `log.md` Stage 171 기록

## 진행 기록

| 단계 | 상태 | 리뷰 기록 |
|---|---|---|
| 계획 작성 | 완료 | 2회 리뷰·수정 완료 (`2026-09-01-001`, `002`) |
| Phase 1 | 완료 | 2회 리뷰·수정 완료 (`2026-09-01-003`~`008`) |
| Phase 2 | 완료 | 2회 리뷰·수정 완료 (`2026-09-01-009`~`014`) |
| Phase 3 | 완료 | 2회 리뷰·수정 완료 (`2026-09-01-015`~`020`) |
| Phase 4 | 완료 | 2회 리뷰·수정 완료 (`2026-09-01-021`~`026`) |
