// 생성 자산은 API 내부의 ASSETS binding으로만 읽는다. 직접 URL 요청에는 원문을 노출하지 않는다.
export function onRequest() {
  return new Response('Not Found', {
    status: 404,
    headers: { 'Cache-Control': 'no-store' },
  });
}
