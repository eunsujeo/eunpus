# Next Review Session — 6. Users

> docs-site 페이지 리뷰의 다음 차례 handoff 문서. 새 Claude Code 세션이 본 문서만 보고도 작업을 곧바로 이어갈 수 있도록 self-contained 하게 작성. 작성 시점: 2026-05-21.

## 1. 컨텍스트

- **작업 성격**: `wiki-docs.pages.dev` 의 27 페이지 (Fireblocks-mirrored 수탁형 지갑 DB 설계) 를 한 페이지씩 리뷰하며 일반 독자에게 읽기 쉽도록 정정
- **이미 리뷰 완료된 페이지** (이번 시리즈): 3. Workspace · 4. Vault · 5. Wallets · Addresses · Asset Wallet · 18. Deposit Observation Lifecycle · 19. Withdrawal Lifecycle
- **이번 차례**: [`docs-site/custodial-wallet-db-design/tables-user.html`](docs-site/custodial-wallet-db-design/tables-user.html) — "6. Users (Console / API / Mobile)"
- **사용할 skill**: [`.claude/skills/doc-author/`](.claude/skills/doc-author/) — description trigger 가 "이 페이지 리뷰" / "X 절 작성" 등에 매칭되어 새 세션에서도 자동 발동

## 2. 대상 페이지 인벤토리 (작성 시점 기준)

`tables-user.html` 의 현 구조:

- **h2**: "6. Users (Console / API / Mobile)"
- **section-subtitle**: "2 user type · 9 role · mobile device 의 secure enclave host"
- **h3 절** (5 개): `User Type 2 종` · `Unified users 테이블` · `Mobile Device — Primary MPC Share Host` · `Device Migration` · `Linked Users / Linked Workspaces`
- **CREATE TABLE** (4 개): `users` · `mobile_devices` · `mobile_device_events` · `device_user_links`
- **현재 상단에 "본 페이지의 출처" callout 없음** — 추가 필요

## 3. 알려진 work items

### 3.1 인라인 `.md` 출처 제거 (3 곳 — check-consistency.py 가 감지)

| 위치 | 패턴 |
|---|---|
| line 96 | `<code>user-roles.md</code>, p.1` |
| line 142 | `<code>about-the-fireblocks-mobile-app.md</code>, p.1` |
| line 175 | `<code>device-migration.md</code>, p.2` |

→ skill 의 [`references/provenance.md`](.claude/skills/doc-author/references/provenance.md) 룰에 따라 본문에서 제거하고 상단 callout 으로 일괄 disclosure 전환.

### 3.2 페이지 상단 "본 페이지의 출처" callout 추가
- 다른 리뷰된 페이지 ([`sm-deposit.html`](docs-site/custodial-wallet-db-design/sm-deposit.html), [`sm-withdrawal.html`](docs-site/custodial-wallet-db-design/sm-withdrawal.html)) 와 동일 패턴
- "Fireblocks 공식 문서에 정의된 사실 (그대로 받아도 안전)" vs "저자가 합리적으로 추정해서 그린 설계 (참고용, 본인 환경에서 검증 권장)" 두 갈래로 enumerate
- `callout-warn` 이 아닌 중립 `callout` 사용

### 3.3 CREATE TABLE 마다 필드별 설명 표 점검
4 개 테이블 각각 자료형 + 역할 + ENUM 값별 의미가 표로 풀어져 있는지 확인. 없으면 추가:
- `users` — Console / API 두 user type 의 통합 모델
- `mobile_devices` — MPC key share host 의 device 등록 정보
- `mobile_device_events` — device 의 enroll / re-enroll / migration 이력 (append-only)
- `device_user_links` — Linked Users / Linked Workspaces 관계 junction

표 너비: 24% / 18% / rest. ENUM 컬럼은 값별 의미를 역할 셀에 풀어쓰기.

### 3.4 평이한 한글 풀어쓰기 후보
다음 영문/약어가 본문에 어떻게 등장하는지 점검하고 필요 시 풀이 또는 glossary `(?)`:

- **Console user / API user** — 차이가 무엇이고 왜 같은 9 role 매트릭스를 쓰는가
- **9 role permission matrix** — Owner / Admin / NSA / Signer / Approver / Editor / Viewer / Auditor / Custom 등 — 각 role 의 책임 분기
- **Primary MPC Share Host** — mobile device 가 사용자 측 MPC key share 의 1 차 보관 장소라는 의미
- **Secure enclave / Hardware-encrypted** — iOS Keychain / Android TEE 같은 하드웨어 격리 메커니즘
- **Device Migration** — 사용자 본인 self-service 의 의미, 관리자 승인 없이 PIN+passphrase+biometric 3 중 인증으로만 진행되는 운영 시나리오
- **Linked Users / Linked Workspaces** — 한 device 가 여러 user / 여러 workspace 와 연결될 수 있다는 개념

### 3.5 다이어그램 추가 검토 (선택)
- **User type · role 분기 도식** — 9 role permission matrix 가 표로 길어진다면 mermaid graph 가 유용
- **Device → user → workspace 관계 도식** — Linked Users / Linked Workspaces 절의 다대다 관계 시각화
- 직전 페이지 (`tables-wallet.html`) 의 vault → wallet → address 관계 도식이 좋은 참고

## 4. 작업 순서

1. **현재 페이지 전체 read** — 5 개 h3 절을 모두 읽고 상태 파악
2. **변경 제안을 사용자에게 보고** — 작업 항목 목록 + 추가/제거할 내용 요약. 사용자 승인 대기
3. **승인된 변경을 순차 적용** — Edit 도구로 한 번에 하나씩
4. **mermaid 작성 시 entity 검증** — `<pre class="mermaid">` 의 `--&gt;` / `&amp;` / `</br>` 0 인지 확인
5. **`check-consistency.py` sweep** —
   ```bash
   python3 /Users/mob.bit/Workspace/waas-wiki/.claude/skills/doc-author/scripts/check-consistency.py \
     /Users/mob.bit/Workspace/waas-wiki/docs-site/custodial-wallet-db-design
   ```
   현재 39 occurrences (다른 리뷰 안 한 페이지들). 본 페이지의 3 곳이 사라지면 36 으로 줄어야 함
6. **사용자가 "배포해줘" 라고 명시 시에만 배포** — 아래 §7 참조

## 5. 적용할 skill 룰 (relevant references)

- **평이한 한글 + glossary tooltips** → [`writing-style.md`](.claude/skills/doc-author/references/writing-style.md)
- **출처 disclosure callout 템플릿** → [`provenance.md`](.claude/skills/doc-author/references/provenance.md)
- **DB schema 필드 표 + ENUM 풀어쓰기** → [`db-schema.md`](.claude/skills/doc-author/references/db-schema.md)
- **Mermaid 색/방향/caption** → [`diagrams.md`](.claude/skills/doc-author/references/diagrams.md)
- **wiki 잔재 정리 (.md / ★ / §)** → [`cleanup.md`](.claude/skills/doc-author/references/cleanup.md)
- **사이트 HTML scaffold + glossary tooltip 사전** → [`site-template-custodial-db.md`](.claude/skills/doc-author/references/site-template-custodial-db.md)

## 6. 성공 기준

- check-consistency.py 의 `[md_citation]` count 가 본 페이지 분 (3) 만큼 감소
- 페이지가 일반 독자가 막힘 없이 통과 가능한 상태 (사용자 추가 정정 요청 없음)
- 본 NEXT.md 를 **다음 차례 페이지로 갱신** (예: 7. 9 User Roles → `tables-role.html`)

## 7. 배포 안전 룰 (재확인 — 절대 위반 금지)

- **자동 deploy 금지**. 사용자가 "배포해줘" / "deploy" 라고 명시했을 때만 실행. 자세히: [`feedback_no_auto_deploy.md`](../../.claude/projects/-Users-mob-bit-Workspace-waas-wiki/memory/feedback_no_auto_deploy.md)
- **cwd 는 반드시 `docs-site/custodial-wallet-db-design/`** 또는 절대경로. wiki repo root 에서 `wrangler pages deploy .` 실행 시 raw Fireblocks PDF 등 wiki 전체가 public 으로 유출
- 권장 형태:
  ```bash
  cd /Users/mob.bit/Workspace/waas-wiki/docs-site/custodial-wallet-db-design && \
  npx wrangler pages deploy . --project-name=wiki-docs --branch=main --commit-dirty=true
  ```
- 배포 후 "Uploaded N files" 가 1000+ 이면 cwd 사고. 즉시 사용자 통지 + `wrangler pages deployment delete <id>` 안내

## 8. 작업 흐름의 끝

- 본 페이지 리뷰가 끝나면 본 `NEXT.md` 의 §2 / §3 / §6 을 **다음 차례 페이지 정보로 교체**해서 다음 세션에 또 이어질 수 있도록 갱신.
- 사이드바 순서 기준 다음 차례 후보: `tables-role.html` (7. 9 User Roles)

---

_본 파일은 단일 작업 handoff. 영속적인 운영 패턴은 `.claude/skills/doc-author/`, 사용자별 룰은 `~/.claude/projects/.../memory/` 에 있음._
