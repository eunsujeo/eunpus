# Prompt: Update Wiki

이미 존재하는 위키 페이지를 수정·확장할 때의 규칙. ingest-pdf 또는 extract-entities 이후의 실제 쓰기 단계에 적용.

---

## 핵심 원칙 (LLM에게 매번 상기시킬 것)

1. **원본 자료에 없는 내용은 쓰지 마라.** 모르면 `open-questions/<vendor>.md`로 옮겨라.
2. **모든 사실 진술에는 출처를 붙여라**: `(source: <filename>.md, p.N)` 또는 `(source: <url>, accessed YYYY-MM-DD)`.
3. **사전학습(prior knowledge)만으로 채워야 하면 명시하라**: `> [unverified — 사전학습 기반, 1차 자료로 확인 필요]`.
4. 다른 벤더의 일반 패턴을 이 벤더에 그대로 옮겨 쓰지 마라.

## 페이지 수정 규약

- 6 섹션 템플릿(Summary / Key Concepts / Details / Related Pages / Sources / Open Questions)을 유지하라.
- `Related Pages`는 새 링크가 생길 때마다 **양방향**으로 갱신한다 (A→B를 추가하면 B에도 A 링크 추가).
- 페이지 내 링크는 항상 **상대경로**.
- `Sources` 섹션은 그 페이지에 인용된 모든 출처를 중복 제거해 모은다.

## LLM에게 줄 입력

```
다음 파일을 수정하라:

대상 파일: vendors/<vendor>/<page>.md  (또는 entities/...)
근거 자료: sources/<vendor>/markdown/<filename>.md, p.X~Y
추가/변경할 내용 요약: <한두 줄>

수행할 일:

1. 대상 파일의 현재 상태를 읽어라.
2. 위 핵심 원칙을 어기지 않고 변경안을 diff로 보여라.
3. Related Pages 양방향 갱신이 필요하면 함께 보여라.
4. 추측이나 외삽이 필요한 부분은 open-questions/<vendor>.md 추가 항목으로 따로 보여라.
5. 내 승인을 받은 뒤에만 실제 파일을 수정하라.
```

## Lint 체크리스트 (정기적으로 실행)

- [ ] 모든 페이지에 6 섹션이 있는가
- [ ] Sources 섹션이 비어있는 페이지에 본문 주장이 들어있지는 않은가
- [ ] 양방향 링크가 한쪽만 걸려있지는 않은가
- [ ] open-questions에 `Status: answered` 표시 후 본문에 반영되지 않은 항목이 있는가
- [ ] 동일 entity가 여러 파일에 정의되어 있지는 않은가

## 관련 프롬프트

- [ingest-pdf.md](ingest-pdf.md)
- [extract-entities.md](extract-entities.md)
