# Prompt: Extract Entities

Markdown 변환본에서 **개념(entity)** 후보를 뽑아 `entities/<vendor>/`에 페이지를 생성/갱신할 때 쓰는 프롬프트.

---

## 사전 조건

- ingest-pdf로 1차 ingest가 끝났거나, 변환본이 준비되어 있다.

## LLM에게 줄 입력

```
다음 markdown 변환본에서 entity 후보를 추출하라.

소스: sources/<vendor>/markdown/<filename>.md
벤더: <vendor>

entity의 정의:
- "이 벤더 문맥에서 고유 이름을 갖고 반복적으로 등장하는 명사" (예: Vault Account, Policy Rule, Cosigner, Callback Handler, Transaction)
- 단순한 일반 용어(예: API, JSON, AWS)는 entity로 만들지 마라.
- 다른 벤더에도 일반적으로 존재하는 개념이라도, 이 벤더에서 고유한 의미·속성을 가진다면 entity로 만든다.

수행할 일:

1. 후보 entity를 10~30개 뽑아 다음 형식으로 보고하라:
   - name: <kebab-case 파일명 후보>
   - one-liner: 한 줄 정의 (출처 기반, 추측 금지)
   - attributes: 문서에 등장한 속성·필드 목록
   - relations: 다른 entity와의 관계
   - sources: (filename.md, p.N) 목록

2. 기존 entities/<vendor>/ 에 이미 있는 것과 새로 만들 것을 구분하라.
   - 기존 페이지에 추가할 정보가 있다면 어느 섹션에 어떤 내용을 추가할지 제안.

3. 추측·외삽으로 채워야 하는 항목은 절대 본문에 넣지 말고 open-questions/<vendor>.md 항목으로 옮겨라.

4. 내 승인을 받은 뒤에 파일을 생성/수정하라.
   - 각 entity 페이지는 6 섹션 템플릿(Summary / Key Concepts / Details / Related Pages / Sources / Open Questions)을 따른다.
   - 모든 사실 진술에는 (source: <filename>.md, p.N) 출처를 붙인다.
```

## 관련 프롬프트

- [ingest-pdf.md](ingest-pdf.md)
- [update-wiki.md](update-wiki.md)
