# company — 회사 위키(Confluence) 정리본 + 구현 스켈레톤

`wallet-service-components` 가이드(0~17장)를 회사에 옮기기 위한 산출물 폴더.

## 구성

| 경로 | 내용 |
|---|---|
| `confluence/` | Confluence 붙여넣기용 정리 문서 6편 — 가이드 전체가 아니라 회사 공유에 필요한 핵심만 압축. Confluence wiki markup 형식 (`{plantuml}` · `{info}` 매크로 사용) |
| `custodial-wallet/` | 가이드 17장 구조 그대로의 **Kotlin + Spring Gradle 멀티모듈 스켈레톤**. 진입점은 [`custodial-wallet/CLAUDE.md`](custodial-wallet/CLAUDE.md) |

## Confluence 로 옮기기

1. Confluence 에서 새 페이지 → 삽입(+) → **위키 마크업(Wiki markup)** → `confluence/NN-*.txt` 내용 붙여넣기.
2. 다이어그램은 `{plantuml}` 매크로를 쓴다 — PlantUML 플러그인이 없는 스페이스라면 해당 블록을 코드 블록으로 두거나 이미지로 대체.
3. 문서 순서: 00 → 05. 각 문서 끝의 "더 보기" 가 원본 가이드 페이지를 가리킨다.

원본 가이드의 개별 페이지를 통째로 옮기고 싶을 때는 각 HTML 페이지 우하단의 **⇄ Confluence** 버튼(전체 변환)을 쓰면 된다.

## 주의

- 이 폴더는 `docs-site/` 안에 있으므로 **Cloudflare Pages 배포 시 함께 업로드된다** (코드 스켈레톤 포함).
  외부 공개를 원치 않으면 배포 전에 이 폴더를 제외하거나 위치를 옮길 것.
- `custodial-wallet/` 은 스켈레톤이다 — 외부 I/O(벤더 SDK·노드 RPC·DB)는 `TODO()` 스텁. 빌드·실행 전 [`CLAUDE.md`](custodial-wallet/CLAUDE.md) 의 "빌드 · 테스트 · lint" 절 참조.
