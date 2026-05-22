// Cloudflare Pages — 단일 패스코드 접근 제어 (_worker.js 형태)
//
// _worker.js 는 Cloudflare Pages 가 무조건 인식 + 우선 처리 (functions/ 디렉토리 인식 문제 회피).
// 모든 요청을 이 worker 가 받고, 인증 통과 시 env.ASSETS.fetch(request) 로 정적 자산 응답.
//
// 환경변수 설정 (Cloudflare Dashboard → Pages → wiki-docs → Settings → Environment variables):
//   PASSCODE = <사용자가 정하는 값>
//   Production + Preview 양쪽 모두 설정 권장
//
// 세션 유지: 7 일 (Max-Age=604800)

const COOKIE_NAME = "wiki_auth";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // /login 은 인증 없이 처리
    if (url.pathname === "/login" || url.pathname === "/login/") {
      return await handleLogin(request, env);
    }

    // PASSCODE 환경변수 미설정 시 503
    if (!env.PASSCODE) {
      return new Response(
        "PASSCODE environment variable is not configured. Set it in Cloudflare Pages → Settings → Environment variables.",
        { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    // 쿠키 확인
    const cookie = parseCookie(request.headers.get("Cookie") || "");
    const authToken = cookie[COOKIE_NAME];
    const expectedToken = await sha256(env.PASSCODE);

    if (authToken && authToken === expectedToken) {
      // 인증 통과 → 정적 자산 응답
      return env.ASSETS.fetch(request);
    }

    // 인증 실패 → /login 으로 redirect (원래 URL 을 next 파라미터로 보존)
    const loginUrl = new URL("/login", url);
    loginUrl.searchParams.set("next", url.pathname + url.search);
    return Response.redirect(loginUrl.toString(), 302);
  },
};

async function handleLogin(request, env) {
  if (!env.PASSCODE) {
    return new Response("PASSCODE not configured", { status: 503 });
  }

  if (request.method === "POST") {
    const formData = await request.formData();
    const passcode = formData.get("passcode") || "";
    const nextPath = sanitizeNext(formData.get("next") || "/");

    if (passcode === env.PASSCODE) {
      const token = await sha256(env.PASSCODE);
      const cookie = `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_DURATION_SECONDS}`;
      return new Response(null, {
        status: 302,
        headers: {
          "Location": nextPath,
          "Set-Cookie": cookie,
        },
      });
    }

    return renderLoginPage(nextPath, "접근 코드가 일치하지 않습니다.");
  }

  // GET
  const url = new URL(request.url);
  const nextPath = sanitizeNext(url.searchParams.get("next") || "/");
  return renderLoginPage(nextPath);
}

function renderLoginPage(nextPath, errorMsg = "") {
  const errorHtml = errorMsg
    ? `<p class="error">${escapeHtml(errorMsg)}</p>`
    : "";
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Documentation Hub — 접근 코드</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, "Helvetica Neue", Arial, "Noto Sans KR", "Apple SD Gothic Neo", sans-serif;
    background: #fafafa;
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1d1d1f;
  }
  .card {
    background: white;
    padding: 40px;
    border-radius: 8px;
    border: 1px solid #e5e5e7;
    max-width: 380px;
    width: 100%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  h1 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 6px;
    letter-spacing: -0.01em;
  }
  p.sub {
    font-size: 14px;
    color: #86868b;
    margin: 0 0 24px;
    line-height: 1.5;
  }
  input[type=password] {
    width: 100%;
    padding: 10px 12px;
    font-size: 15px;
    border: 1px solid #d2d2d7;
    border-radius: 6px;
    margin-bottom: 12px;
    font-family: inherit;
  }
  input[type=password]:focus {
    outline: none;
    border-color: #0366d6;
    box-shadow: 0 0 0 3px rgba(3,102,214,0.15);
  }
  button {
    width: 100%;
    padding: 10px;
    background: #0366d6;
    color: white;
    border: 0;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
  }
  button:hover { background: #0246a8; }
  .error {
    font-size: 13px;
    color: #a8322a;
    margin: 0 0 12px;
    padding: 8px 12px;
    background: #fdecea;
    border: 1px solid #f5b9b3;
    border-radius: 4px;
  }
  .footer {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e5e5e7;
    font-size: 12px;
    color: #86868b;
    text-align: center;
  }
</style>
</head>
<body>
<div class="card">
  <h1>Documentation Hub</h1>
  <p class="sub">접근 코드를 입력하세요.</p>
  ${errorHtml}
  <form method="POST" action="/login">
    <input type="hidden" name="next" value="${escapeHtml(nextPath)}">
    <input type="password" name="passcode" placeholder="접근 코드" autofocus required autocomplete="current-password">
    <button type="submit">접속</button>
  </form>
  <div class="footer">non-public reference docs</div>
</div>
</body>
</html>`;
  return new Response(html, {
    status: errorMsg ? 401 : 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function parseCookie(cookieHeader) {
  const result = {};
  cookieHeader.split(";").forEach((part) => {
    const trimmed = part.trim();
    if (!trimmed) return;
    const idx = trimmed.indexOf("=");
    if (idx < 0) return;
    const key = trimmed.slice(0, idx);
    const value = trimmed.slice(idx + 1);
    result[key] = value;
  });
  return result;
}

async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeNext(nextPath) {
  if (typeof nextPath !== "string") return "/";
  if (!nextPath.startsWith("/")) return "/";
  if (nextPath.startsWith("//")) return "/";
  if (nextPath.startsWith("/login")) return "/";
  return nextPath;
}
