#!/usr/bin/env bash
# 로컬 개발 서버 기동 — Cloudflare/Wrangler 없이 Node.js만 사용한다.
#   ./dev.sh          기본 기동 (로컬 상태 보존)
#   ./dev.sh clean    로컬 상태 초기화 후 기동
#   PORT=9000 ./dev.sh  포트 변경
set -euo pipefail
cd "$(dirname "$0")"

PORT="${PORT:-8788}"
LOCAL_DIR=".local"
STATE_FILE="$LOCAL_DIR/state.json"

if [ -f .dev.vars ]; then
  echo "⚠  사용하지 않는 .dev.vars가 남아 있습니다. 다른 이름으로 옮기거나 삭제한 뒤 다시 실행하세요."
  exit 1
fi

# 로컬 문서 경로 — 저장소 루트 기준 논리 경로와 실제 디렉터리
DOCS_PATH="${DOCS_PATH:-blockchain-manager/docs}"
REPO_ROOT="$(cd ../.. && pwd)"
DOCS_DIR="$REPO_ROOT/$DOCS_PATH"

# 1) 이전 로컬 서버와 같은 포트의 잔류 프로세스 정리
pkill -f "scripts/local-server.mjs --port $PORT" 2>/dev/null || true
# 이전 버전 dev.sh에서 남은 Wrangler는 한 번 정리한다. 새 기동에서는 Wrangler를 실행하지 않는다.
pkill -f "wrangler pages dev public --port $PORT" 2>/dev/null || true
if lsof -tiTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  lsof -tiTCP:"$PORT" -sTCP:LISTEN | xargs kill 2>/dev/null || true
fi

# 2) 로컬 상태 초기화(선택)
if [ "${1:-}" = "clean" ]; then
  echo "🧹 로컬 보드 상태 초기화"
  rm -f "$STATE_FILE"
fi

# 3) bcm-api-docs 워처 — openapi.yaml 편집 시 build.py 자동 실행 (편집만으로 생성물 반영)
# 테스트 등에서 생략하려면 WATCH_API_DOCS=0 ./dev.sh
if [ "${WATCH_API_DOCS:-1}" != "0" ] && command -v python3 >/dev/null 2>&1 && [ -f ../bcm-api-docs/build.py ]; then
  node scripts/watch-api-docs.mjs &
  WATCH_PID=$!
fi
cleanup() {
  trap - EXIT INT TERM
  if [ -n "${WATCH_PID:-}" ]; then
    kill "$WATCH_PID" 2>/dev/null || true
    wait "$WATCH_PID" 2>/dev/null || true
  fi
  if [ -n "${SERVER_PID:-}" ]; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

# 4) Node 로컬 서버 기동 — 정적 앱·문서 API·상태 저장을 한 프로세스에서 처리
if [ ! -d "$DOCS_DIR" ]; then
  echo "⚠  로컬 문서 폴더 없음 — $DOCS_DIR"
  exit 1
fi
mkdir -p "$LOCAL_DIR"
node scripts/local-server.mjs \
  --port "$PORT" \
  --public-dir "$PWD/public" \
  --docs-dir "$DOCS_DIR" \
  --docs-path "$DOCS_PATH" \
  --state-file "$PWD/$STATE_FILE" &
SERVER_PID=$!
wait "$SERVER_PID"
