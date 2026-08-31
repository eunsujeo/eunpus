import { json, readState, putState } from './_lib.js';

// 대·중카테고리 순서를 KV(BOARD) 오버레이에 기록한다 — 커밋 없음.
export async function onRequestPut({ request, env }) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'JSON body 필요' }, 400);
  }

  const order = {
    categories: Array.isArray(payload.categories) ? payload.categories : [],
    subcategories:
      payload.subcategories && typeof payload.subcategories === 'object' ? payload.subcategories : {},
  };

  try {
    const state = await readState(env);
    state.order = order;
    await putState(env, state);
    return json({ ok: true });
  } catch (e) {
    return json({ error: String(e.message || e) }, 500);
  }
}
