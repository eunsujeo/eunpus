# sources/fireblocks/pdf/

**여기에 Fireblocks 관련 원본 PDF를 넣어라.**

## 파일명 규칙

`YYYY-MM-DD__<slug>.pdf`

예시:
- `2024-09-12__fireblocks-mpc-cmp-whitepaper.pdf`
- `2025-02-01__fireblocks-platform-overview.pdf`
- `2024-11-20__fireblocks-soc2-report.pdf`

- 날짜: 가능하면 **문서 발행일**, 없으면 다운로드일
- slug: 소문자 + 하이픈, 출처가 명확하게

## 메타데이터

같은 stem의 `.meta.yml`(또는 `.meta.md`)을 함께 두는 것을 권장한다:

```yaml
source_url: https://...
downloaded_at: 2026-05-18
doc_type: whitepaper      # whitepaper | docs | blog | pricing | report | ...
pages: 24
language: en
notes: |
  특이사항 메모
```

## 주의

- **이 폴더는 불변(immutable)** 이다. LLM이나 변환 스크립트가 여기 파일을 수정하면 안 된다.
- 변환된 Markdown은 `../markdown/`에 저장한다.
