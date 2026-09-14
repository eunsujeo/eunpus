import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { selectExportScope, excludeRefDocs, stripUnavailableLinks, assembleBoardHtml } from '../public/export.js';

function fixture() {
  const paths = ['docs/WaaS/Dfns/a.md', 'docs/WaaS/DAW 구축 설계/b.md', 'docs/WaaS/Dfns/ref.md'];
  const cards = paths.map((path, i) => ({ path, category: 'WaaS', subcategory: i === 1 ? 'DAW 구축 설계' : 'Dfns' }));
  const body = '[설계](../DAW%20구축%20설계/b.md#세부) [분류](?cat=WaaS&sub=DAW%20구축%20설계)';
  return {
    board: { cards, tree: { WaaS: ['Dfns', 'DAW 구축 설계'] } },
    docs: {
      [paths[0]]: { meta: {}, body, raw: body },
      [paths[1]]: { meta: {}, body: 'PRIVATE_DESIGN_SENTINEL' },
      [paths[2]]: { meta: { ref: '참고' }, body: 'REFERENCE_SENTINEL' },
    },
  };
}

test('explicit subgroup scope excludes linked groups and leaves original board intact', () => {
  const data = fixture();
  const scoped = selectExportScope(data.board, ['WaaS/Dfns']);
  assert.deepEqual(scoped.tree, { WaaS: ['Dfns'] });
  assert.equal(scoped.cards.length, 2);
  assert.equal(data.board.cards.length, 3);
  assert.deepEqual(selectExportScope(data.board, []).cards, []);
  assert.equal(selectExportScope(data.board, ['WaaS']).cards.length, 3);
});

test('reference removal cleans empty subgroups and encoded document links', () => {
  const data = fixture();
  data.docs['docs/WaaS/DAW 구축 설계/b.md'].meta.ref = '참고';
  excludeRefDocs(data);
  assert.equal(data.board.cards.length, 1);
  assert.deepEqual(data.board.tree, { WaaS: ['Dfns'] });
  assert.equal(data.docs['docs/WaaS/Dfns/a.md'].body, '설계 분류');
});

test('unavailable links become text but included anchors, external links and code survive', () => {
  const data = fixture();
  delete data.docs['docs/WaaS/DAW 구축 설계/b.md'];
  data.board = selectExportScope(data.board, ['WaaS/Dfns']);
  const body = [
    '[유지](a.md#제목) [웹](https://example.com/out.md)',
    '[제외](doc?path=docs%2FWaaS%2FDAW%20구축%20설계%2Fb.md)',
    '[공백](<../DAW 구축 설계/b.md>)',
    '```md\n[예시](missing.md)\n```',
  ].join('\n');
  data.docs['docs/WaaS/Dfns/a.md'].body = body;
  stripUnavailableLinks(data);
  assert.equal(data.docs['docs/WaaS/Dfns/a.md'].body,
    '[유지](a.md#제목) [웹](https://example.com/out.md)\n제외\n공백\n```md\n[예시](missing.md)\n```');
});

test('assembled HTML contains only selected non-reference document payloads', () => {
  const data = fixture();
  data.board = selectExportScope(data.board, ['WaaS/Dfns']);
  data.docs = Object.fromEntries(data.board.cards.map((c) => [c.path, data.docs[c.path]]));
  excludeRefDocs(data);
  const template = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
  const html = assembleBoardHtml({ html: template, css: '', mermaid: '', md: '', theme: '', app: '' }, data);
  assert.ok(!html.includes('PRIVATE_DESIGN_SENTINEL'));
  assert.ok(!html.includes('REFERENCE_SENTINEL'));
  assert.ok(html.includes('window.__STATIC_BOARD__'));
  assert.equal(data.docs['docs/WaaS/Dfns/a.md'].body, '설계 분류');
});

test('with-ref preserves explicitly included reference documents', () => {
  const data = fixture();
  assert.deepEqual(excludeRefDocs(data, true), []);
  assert.equal(Object.keys(data.docs).length, 3);
});
