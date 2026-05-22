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
    background: #f5ecd9;
    background-image:
      radial-gradient(circle at 20% 30%, #e8dcc0 0px, transparent 2px),
      radial-gradient(circle at 80% 20%, #efe2c4 0px, transparent 2px),
      radial-gradient(circle at 50% 80%, #ede0c2 0px, transparent 2px);
    background-size: 60px 60px, 80px 80px, 100px 100px;
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3a342c;
    padding: 20px;
  }

  .card {
    background: #fffefa;
    padding: 36px 32px 28px;
    border-radius: 16px;
    border: 1px solid #e6dcc6;
    max-width: 340px;
    width: 100%;
    box-shadow:
      0 4px 12px rgba(139, 111, 71, 0.08),
      0 1px 3px rgba(139, 111, 71, 0.04);
    position: relative;
  }

  /* Pixel art lock — CSS box-shadow technique */
  .pixel-stage {
    position: relative;
    width: 64px;
    height: 64px;
    margin: 0 auto 18px;
  }

  .pixel-lock {
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -32px;
    width: 4px;
    height: 4px;
    background: transparent;
    animation: bob 2.4s ease-in-out infinite;
    /* pixel grid 16x16, each px = 4px box-shadow offset */
    box-shadow:
      /* row 1: shackle top */
      24px 8px 0 #c9a76d,
      28px 8px 0 #c9a76d,
      32px 8px 0 #c9a76d,
      36px 8px 0 #c9a76d,
      /* row 2: shackle sides */
      20px 12px 0 #c9a76d,
      40px 12px 0 #c9a76d,
      /* row 3 */
      20px 16px 0 #c9a76d,
      40px 16px 0 #c9a76d,
      /* row 4 */
      20px 20px 0 #c9a76d,
      40px 20px 0 #c9a76d,
      /* row 5: body top */
      12px 24px 0 #8b6f47,
      16px 24px 0 #8b6f47,
      20px 24px 0 #8b6f47,
      24px 24px 0 #8b6f47,
      28px 24px 0 #8b6f47,
      32px 24px 0 #8b6f47,
      36px 24px 0 #8b6f47,
      40px 24px 0 #8b6f47,
      44px 24px 0 #8b6f47,
      48px 24px 0 #8b6f47,
      /* row 6 */
      12px 28px 0 #8b6f47,
      16px 28px 0 #a98860,
      20px 28px 0 #a98860,
      24px 28px 0 #a98860,
      28px 28px 0 #a98860,
      32px 28px 0 #a98860,
      36px 28px 0 #a98860,
      40px 28px 0 #a98860,
      44px 28px 0 #a98860,
      48px 28px 0 #8b6f47,
      /* row 7: keyhole */
      12px 32px 0 #8b6f47,
      16px 32px 0 #a98860,
      20px 32px 0 #a98860,
      24px 32px 0 #a98860,
      28px 32px 0 #5a4530,
      32px 32px 0 #5a4530,
      36px 32px 0 #a98860,
      40px 32px 0 #a98860,
      44px 32px 0 #a98860,
      48px 32px 0 #8b6f47,
      /* row 8: keyhole */
      12px 36px 0 #8b6f47,
      16px 36px 0 #a98860,
      20px 36px 0 #a98860,
      24px 36px 0 #a98860,
      28px 36px 0 #5a4530,
      32px 36px 0 #5a4530,
      36px 36px 0 #a98860,
      40px 36px 0 #a98860,
      44px 36px 0 #a98860,
      48px 36px 0 #8b6f47,
      /* row 9 */
      12px 40px 0 #8b6f47,
      16px 40px 0 #a98860,
      20px 40px 0 #a98860,
      24px 40px 0 #5a4530,
      28px 40px 0 #5a4530,
      32px 40px 0 #5a4530,
      36px 40px 0 #5a4530,
      40px 40px 0 #a98860,
      44px 40px 0 #a98860,
      48px 40px 0 #8b6f47,
      /* row 10 */
      12px 44px 0 #8b6f47,
      16px 44px 0 #a98860,
      20px 44px 0 #a98860,
      24px 44px 0 #a98860,
      28px 44px 0 #5a4530,
      32px 44px 0 #5a4530,
      36px 44px 0 #a98860,
      40px 44px 0 #a98860,
      44px 44px 0 #a98860,
      48px 44px 0 #8b6f47,
      /* row 11: bottom */
      12px 48px 0 #8b6f47,
      16px 48px 0 #8b6f47,
      20px 48px 0 #8b6f47,
      24px 48px 0 #8b6f47,
      28px 48px 0 #8b6f47,
      32px 48px 0 #8b6f47,
      36px 48px 0 #8b6f47,
      40px 48px 0 #8b6f47,
      44px 48px 0 #8b6f47,
      48px 48px 0 #8b6f47;
  }

  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }

  /* Sparkle dots around the lock */
  .sparkle {
    position: absolute;
    width: 3px;
    height: 3px;
    background: #d4a574;
    border-radius: 0;
    opacity: 0;
    animation: twinkle 2.4s ease-in-out infinite;
  }
  .sparkle.s1 { top: 4px; left: 4px; animation-delay: 0s; }
  .sparkle.s2 { top: 10px; right: 4px; animation-delay: 0.6s; }
  .sparkle.s3 { bottom: 14px; left: 2px; animation-delay: 1.2s; }
  .sparkle.s4 { bottom: 6px; right: 8px; animation-delay: 1.8s; }
  .sparkle.s5 { top: 50%; right: 0; animation-delay: 0.9s; }

  @keyframes twinkle {
    0%, 100% { opacity: 0; transform: scale(0.6); }
    50% { opacity: 1; transform: scale(1); }
  }

  h1 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 6px;
    letter-spacing: -0.01em;
    text-align: center;
    color: #3a342c;
  }
  p.sub {
    font-size: 13.5px;
    color: #8a7d65;
    margin: 0 0 22px;
    line-height: 1.5;
    text-align: center;
  }
  input[type=password] {
    width: 100%;
    padding: 11px 14px;
    font-size: 15px;
    border: 1.5px solid #e6dcc6;
    border-radius: 10px;
    margin-bottom: 12px;
    font-family: inherit;
    background: #fdfbf5;
    color: #3a342c;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  }
  input[type=password]::placeholder { color: #b8a890; }
  input[type=password]:focus {
    outline: none;
    border-color: #c9a76d;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(201, 167, 109, 0.18);
  }
  button {
    width: 100%;
    padding: 11px;
    background: linear-gradient(180deg, #c9a76d 0%, #b8945a 100%);
    color: #fffefa;
    border: 0;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    letter-spacing: 0.02em;
    transition: transform 0.1s, box-shadow 0.15s;
    box-shadow: 0 2px 4px rgba(139, 111, 71, 0.15);
  }
  button:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(139, 111, 71, 0.22);
  }
  button:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(139, 111, 71, 0.15);
  }
  .error {
    font-size: 13px;
    color: #a3543d;
    margin: 0 0 12px;
    padding: 9px 12px;
    background: #fcefe5;
    border: 1px solid #f0d2bc;
    border-radius: 8px;
    text-align: center;
  }
  .footer {
    margin-top: 22px;
    padding-top: 14px;
    border-top: 1px dashed #e6dcc6;
    font-size: 11.5px;
    color: #b8a890;
    text-align: center;
    letter-spacing: 0.04em;
  }

  /* Reduce motion 사용자 배려 */
  @media (prefers-reduced-motion: reduce) {
    .pixel-lock, .sparkle { animation: none; }
    .sparkle { opacity: 0.5; }
  }
</style>
</head>
<body>
<div class="card">
  <div class="pixel-stage">
    <span class="sparkle s1"></span>
    <span class="sparkle s2"></span>
    <span class="sparkle s3"></span>
    <span class="sparkle s4"></span>
    <span class="sparkle s5"></span>
    <div class="pixel-lock"></div>
  </div>
  <h1>Documentation Hub</h1>
  <p class="sub">접근 코드를 입력하세요</p>
  ${errorHtml}
  <form method="POST" action="/login">
    <input type="hidden" name="next" value="${escapeHtml(nextPath)}">
    <input type="password" name="passcode" placeholder="••••••••" autofocus required autocomplete="current-password">
    <button type="submit">접속</button>
  </form>
  <div class="footer">non-public reference</div>
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
