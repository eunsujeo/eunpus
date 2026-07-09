#!/usr/bin/env bash
# 로컬 개발 서버 기동 — 반복되는 사전 정리를 묶는다.
#   ./dev.sh          기본 기동 (tmp 캐시만 비워 빌드 레이스 방지, 로컬 KV 는 보존)
#   ./dev.sh clean    .wrangler 전체 삭제 후 기동 (_cf_ALARM 등 캐시 손상 시)
#   PORT=9000 ./dev.sh  포트 변경
set -euo pipefail
cd "$(dirname "$0")"

PORT="${PORT:-8788}"

# 1) 토큰 확인
if [ ! -f .dev.vars ]; then
  echo "⚠  .dev.vars 없음 — 먼저: cp .dev.vars.example .dev.vars 후 GITHUB_TOKEN 채우기"
  exit 1
fi

# 2) 남은 wrangler·포트 점유 정리
pkill -f "wrangler pages dev" 2>/dev/null || true
if lsof -ti:"$PORT" >/dev/null 2>&1; then
  lsof -ti:"$PORT" | xargs kill 2>/dev/null || true
fi

# 3) 캐시 청소
if [ "${1:-}" = "clean" ]; then
  echo "🧹 .wrangler 전체 삭제 (로컬 KV 상태도 초기화)"
  rm -rf .wrangler
else
  # 핫리빌드 레이스(middleware-loader.entry.ts) 방지 — tmp 만 비우고 KV state 는 보존
  rm -rf .wrangler/tmp
fi

# 4) 기동 (BOARD KV 는 wrangler.toml 이 바인딩)
echo "▶ http://localhost:$PORT  (종료: Ctrl+C · 캐시 손상 시: ./dev.sh clean)"
exec npx wrangler pages dev public --port "$PORT"
