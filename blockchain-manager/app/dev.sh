#!/usr/bin/env bash
# 로컬 개발 서버 기동 — 반복되는 사전 정리를 묶는다.
#   ./dev.sh          기본 기동 (tmp 캐시만 비워 빌드 레이스 방지, 로컬 KV 는 보존)
#   ./dev.sh clean    .wrangler 전체 삭제 후 기동 (_cf_ALARM 등 캐시 손상 시)
#   PORT=9000 ./dev.sh  포트 변경
set -euo pipefail
cd "$(dirname "$0")"

PORT="${PORT:-8788}"
DOCS_PORT="${DOCS_PORT:-8790}"

# 1) 토큰 확인
if [ ! -f .dev.vars ]; then
  echo "⚠  .dev.vars 없음 — 먼저: cp .dev.vars.example .dev.vars 후 GITHUB_TOKEN 채우기"
  exit 1
fi

# 로컬 문서 경로 — wrangler.toml 의 DOCS_PATH(저장소 루트 기준) 를 파일시스템 절대경로로 환산
# (grep 무매치가 pipefail+set -e 로 스크립트를 죽이지 않도록 || true 로 보호)
DOCS_PATH="$(grep -E '^DOCS_PATH[[:space:]]*=' wrangler.toml 2>/dev/null | head -1 | sed -E 's/[^=]*=[[:space:]]*"?([^"#]*)"?.*/\1/' | tr -d '\r' | sed 's/[[:space:]]*$//' || true)"
DOCS_PATH="${DOCS_PATH:-blockchain-manager/docs}"
REPO_ROOT="$(cd ../.. && pwd)"
DOCS_DIR="$REPO_ROOT/$DOCS_PATH"

# 2) 남은 wrangler·사이드카·포트 점유 정리
pkill -f "wrangler pages dev" 2>/dev/null || true
pkill -f "scripts/local-docs.mjs" 2>/dev/null || true
for p in "$PORT" "$DOCS_PORT"; do
  if lsof -ti:"$p" >/dev/null 2>&1; then lsof -ti:"$p" | xargs kill 2>/dev/null || true; fi
done

# 3) 캐시 청소
if [ "${1:-}" = "clean" ]; then
  echo "🧹 .wrangler 전체 삭제 (로컬 KV 상태도 초기화)"
  rm -rf .wrangler
else
  # 핫리빌드 레이스(middleware-loader.entry.ts) 방지 — tmp 만 비우고 KV state 는 보존
  rm -rf .wrangler/tmp
fi

# 4) 로컬 문서 사이드카 기동 — docs 를 파일시스템에서 직접 읽어 편집이 push 없이 바로 반영
if [ -d "$DOCS_DIR" ]; then
  node scripts/local-docs.mjs --dir "$DOCS_DIR" --docs-path "$DOCS_PATH" --port "$DOCS_PORT" &
  DOCS_PID=$!
  trap 'kill $DOCS_PID 2>/dev/null || true' EXIT INT TERM
  LOCAL_BINDING=(--binding "LOCAL_DOCS_URL=http://127.0.0.1:$DOCS_PORT")
  echo "🗂  로컬 문서 모드 — $DOCS_DIR (GitHub 안 읽음 · push 불필요)"
else
  LOCAL_BINDING=()
  echo "⚠  $DOCS_DIR 없음 — GitHub 에서 문서를 읽습니다(편집 반영에 push 필요)"
fi

# 5) 기동 (BOARD KV 는 wrangler.toml 이 바인딩)
echo "▶ http://localhost:$PORT  (종료: Ctrl+C · 캐시 손상 시: ./dev.sh clean)"
npx wrangler pages dev public --port "$PORT" ${LOCAL_BINDING[@]+"${LOCAL_BINDING[@]}"}
