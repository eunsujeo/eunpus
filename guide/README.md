# Knowledge Operating System Guide
> 기관형 Reasoning Corpus 운영 가이드

이 가이드는 **이 repository 가 단순한 markdown 모음이 아니라 운영되는 reasoning system (추론 시스템) 이라는 사실** 을 처음 보는 사람에게 설명하는 onboarding + governance + architecture 문서입니다.

---

## 1. 무엇을 위한 가이드인가

이 repository (`waas-wiki/`) 는 **institutional wallet-as-a-service** 도메인을 다루는 **장기 운영형 reasoning corpus** 입니다. 구체적으로:

- 61 개의 generalized architecture 문서 (D/C/E/R/T-series)
- 2 개 vendor 의 source 자료 + 매핑 노트 (Fireblocks, NodeInfra)
- 운영 규율 (governance) 과 stewardship 실천 manual

이 가이드는 다음 8 가지를 달성할 수 있도록 설계되어 있습니다:

1. 새로운 사람이 repository 전체 구조를 이해할 수 있다.
2. 어떤 폴더가 무엇을 담는지 명확히 분간한다.
3. **source (원본 자료) 와 reasoning (추론)** 의 차이를 안다.
4. **invariant (≠ 명제)** 와 **cluster** 구조를 이해한다.
5. 새로운 source 를 추가할 수 있다.
6. 새로운 reasoning 문서를 추가할 수 있다.
7. governance / stewardship workflow 를 안다.
8. 어떤 행동이 **anti-pattern** 인지 안다.

---

## 2. 누구를 위한 가이드인가

| 독자 | 어떤 부분을 가장 먼저 보면 좋은가 |
|------|--------------------------------|
| **처음 합류한 사람** | [01-repository-structure](01-repository-structure.md) → [02-corpus-layers](02-corpus-layers.md) |
| **PM** | [01](01-repository-structure.md) → [10-walkthrough-nodeinfra](10-walkthrough-nodeinfra.md) → [05-source-ingestion](05-source-ingestion.md) |
| **Developer** | [02-corpus-layers](02-corpus-layers.md) → [03-reasoning-lifecycle](03-reasoning-lifecycle.md) → 관심 D-doc |
| **Security / Operator** | [04-invariants-and-discipline](04-invariants-and-discipline.md) → [07-stewardship](07-stewardship.md) |
| **Researcher** | [02](02-corpus-layers.md) → [03](03-reasoning-lifecycle.md) → [04](04-invariants-and-discipline.md) |
| **Future steward** | 전체 다 → 특히 [07](07-stewardship.md) + [08-anti-patterns](08-anti-patterns.md) |
| **AI / LLM 활용자** | [04-invariants-and-discipline](04-invariants-and-discipline.md) → [08-anti-patterns](08-anti-patterns.md) |

자세한 독자별 경로는 [09-reading-paths](09-reading-paths.md) 에 있습니다.

---

## 3. 가이드 전체 차례

| 파일 | 내용 | 분량 (대략) |
|------|------|-------------|
| [01-repository-structure.md](01-repository-structure.md) | Repository 전체 구조 + source 와 reasoning 의 차이 | 중 |
| [02-corpus-layers.md](02-corpus-layers.md) | D / C / E / R / T 5 layer 구조 | 중 |
| [03-reasoning-lifecycle.md](03-reasoning-lifecycle.md) | Source → Reasoning 까지의 lifecycle 흐름 | 중 |
| [04-invariants-and-discipline.md](04-invariants-and-discipline.md) | 왜 ≠ 명제, evidence-first, entity-min discipline 인가 | 중 |
| [05-source-ingestion.md](05-source-ingestion.md) | 새 vendor 자료를 어떻게 추가하는가 | 중 |
| [06-adding-reasoning.md](06-adding-reasoning.md) | 새 reasoning 문서는 언제 / 어떻게 추가하는가 | 중 |
| [07-stewardship.md](07-stewardship.md) | governance / stewardship workflow | 중 |
| [08-anti-patterns.md](08-anti-patterns.md) | 절대 하면 안 되는 행동들 | 짧음 |
| [09-reading-paths.md](09-reading-paths.md) | 독자별 추천 reading order | 짧음 |
| [10-walkthrough-nodeinfra.md](10-walkthrough-nodeinfra.md) | NodeInfra 를 corpus 에 추가한 실제 사례 | 중 |

---

## 4. 핵심 한 줄

이 corpus 의 운영 철학은 다음과 같이 요약됩니다:

> **Survivability > Elegance.**
> **Evidence > Plausibility.**
> **Visible uncertainty > False certainty.**
> **Human accountability > AI autonomy.**

쉽게 풀면:

- 멋진 문장보다 **수십 년 살아남는 reasoning** 이 더 가치 있다.
- 그럴듯한 추론보다 **출처가 있는 사실** 이 우선한다.
- 모르는 것을 모른다고 적는 것이 **안다고 가장하는 것보다 안전하다**.
- 결정의 책임은 **사람** 이 진다. AI 가 아니다.

이 4 가지가 모든 페이지의 reading 기준입니다. 어떤 글이 이 4 가지 중 하나라도 위반하면 — 그 글은 corpus 의 일부가 될 자격이 없습니다.

---

## 5. Final philosophy (짧게)

이 corpus 는:

- **최종 진리** 를 주장하지 않습니다. 매 reasoning 에 `★ Hypothesis` marker 로 불확실성을 표시합니다.
- **벤더 marketing 문구** 를 사용하지 않습니다. vendor docs 는 `sources/` 에 격리되고, 추론은 `docs/` 에 분리됩니다.
- **AI 가 생성한 글** 을 무비판 수용하지 않습니다. AI 는 제안할 수 있지만, 결정은 사람이 합니다 (R8, R9, T0).
- **앞선 문서를 silent 하게 수정하지 않습니다**. amendment 와 supersession 만 허용 (R7).

이 4 가지 약속이 **이 corpus 가 단순 wiki 와 다른 점** 입니다. 자세한 reasoning 은 [`docs/architecture/r0-reasoning-operations-charter.md`](../docs/architecture/r0-reasoning-operations-charter.md) 에 있습니다.

---

## 6. 시작하기

처음 보는 사람이라면 다음 순서로 읽기를 권장합니다:

1. **이 페이지 (README)** — 1 분
2. **[01-repository-structure](01-repository-structure.md)** — repository 전체 지도 (5 분)
3. **[02-corpus-layers](02-corpus-layers.md)** — D/C/E/R/T 5 layer (10 분)
4. **[10-walkthrough-nodeinfra](10-walkthrough-nodeinfra.md)** — 실제 사례 (10 분)
5. 필요한 만큼 나머지 가이드 또는 `docs/architecture/` 의 D-doc

총 **30 분** 이면 corpus 의 작동 원리를 이해할 수 있습니다.
