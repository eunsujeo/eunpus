# sources/fireblocks/markdown/

PDF → Markdown 변환 결과 저장 위치.

## 파일명 규칙

원본 PDF와 동일한 stem을 사용하고 확장자만 `.md`로 바꾼다.

- `2024-09-12__fireblocks-mpc-cmp-whitepaper.pdf` → `2024-09-12__fireblocks-mpc-cmp-whitepaper.md`

## 변환 시 보존할 것

- **페이지 번호**: 본문 안에 `<!-- page: N -->` 마커를 남기거나 섹션 헤더 옆에 `(p.N)`을 붙인다. 위키에서 인용할 때 페이지 단위로 출처를 표기하기 위함.
- 이미지/다이어그램: 가능하면 `../images/`에 저장하고 본문에서 상대경로로 참조.
- 표(table): GFM 표 형식 유지가 어려우면 HTML `<table>` 그대로 둬도 좋다.

## 변환 도구

아직 미정. 일단 수동 변환 또는 외부 도구(예: marker, pdfplumber, OCR 등)를 사용하고, 워크플로우가 자리잡으면 `../../../scripts/`에 자동화 스크립트를 추가한다.
