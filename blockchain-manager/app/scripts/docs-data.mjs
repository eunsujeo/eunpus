import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';

export const STATUSES = ['To Do', 'In Progress', 'Done', '아카이브'];

export function normalizeStatus(status) {
  return STATUSES.includes(status) ? status : 'To Do';
}

export function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!match) return { meta: {}, body: text, raw: null };
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const keyValue = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (keyValue) meta[keyValue[1]] = keyValue[2].trim().replace(/^["']|["']$/g, '');
  }
  return { meta, body: text.slice(match[0].length), raw: match[0] };
}

export function cardDate(meta, fallback) {
  return /^\d{4}-\d{2}-\d{2}$/.test(meta.date || '')
    ? `${meta.date}T00:00:00.000Z`
    : fallback;
}

export function byManifest(items, order) {
  const index = (item) => {
    const found = (order || []).indexOf(item);
    return found === -1 ? Number.MAX_SAFE_INTEGER : found;
  };
  return [...items].sort((a, b) => {
    const orderDiff = index(a) - index(b);
    return orderDiff !== 0 ? orderDiff : a.localeCompare(b);
  });
}

async function entries(dir) {
  try {
    return (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

function relativePosix(base, file) {
  return relative(base, file).split(sep).join('/');
}

async function card({ absFile, dir, docsPath, category, subcategory, updatedAtByRelative }) {
  const raw = await readFile(absFile, 'utf8');
  const { meta, body } = parseFrontmatter(raw);
  const rel = relativePosix(dir, absFile);
  const fileStat = await stat(absFile);
  const name = rel.split('/').at(-1);
  return {
    path: `${docsPath}/${rel}`,
    name,
    title: meta.title || name.replace(/\.md$/, ''),
    category,
    subcategory,
    seedStatus: normalizeStatus(meta.status),
    view: meta.view || '',
    embed: meta.embed || '',
    group: meta.group || '',
    summary: body
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .slice(0, 2),
    updatedAt: cardDate(meta, updatedAtByRelative.get(rel) || fileStat.mtime.toISOString()),
  };
}

export async function buildBoardBase({ dir, docsPath, updatedAtByRelative = new Map() }) {
  const normalizedDir = resolve(dir);
  const normalizedDocsPath = docsPath.replace(/\/+$/, '');
  const treeDirs = {};
  const cards = [];
  let gitOrder = null;

  try {
    gitOrder = JSON.parse(await readFile(join(normalizedDir, '.board-order.json'), 'utf8'));
  } catch {
    // 순서 파일이 없거나 잘못됐으면 소비자가 가나다순으로 정렬한다.
  }

  for (const categoryEntry of (await entries(normalizedDir)).filter((entry) => entry.isDirectory())) {
    const categoryDir = join(normalizedDir, categoryEntry.name);
    const categoryEntries = await entries(categoryDir);
    const subcategories = categoryEntries.filter((entry) => entry.isDirectory());
    treeDirs[categoryEntry.name] = subcategories.map((entry) => entry.name);

    for (const file of categoryEntries.filter((entry) => entry.isFile() && entry.name.endsWith('.md'))) {
      cards.push(await card({
        absFile: join(categoryDir, file.name),
        dir: normalizedDir,
        docsPath: normalizedDocsPath,
        category: categoryEntry.name,
        subcategory: '',
        updatedAtByRelative,
      }));
    }

    for (const subcategoryEntry of subcategories) {
      const subcategoryDir = join(categoryDir, subcategoryEntry.name);
      for (const file of (await entries(subcategoryDir)).filter(
        (entry) => entry.isFile() && entry.name.endsWith('.md')
      )) {
        cards.push(await card({
          absFile: join(subcategoryDir, file.name),
          dir: normalizedDir,
          docsPath: normalizedDocsPath,
          category: categoryEntry.name,
          subcategory: subcategoryEntry.name,
          updatedAtByRelative,
        }));
      }
    }
  }

  cards.sort((a, b) => a.path.localeCompare(b.path));
  return { treeDirs, cards, gitOrder };
}

export function materializeBoard(base, state = {}) {
  const order = state.order || base.gitOrder || { categories: [], subcategories: {} };
  const statuses = state.statuses || {};
  const tree = {};
  for (const category of byManifest(Object.keys(base.treeDirs), order.categories)) {
    tree[category] = byManifest(
      base.treeDirs[category],
      order.subcategories && order.subcategories[category]
    );
  }
  const cards = base.cards
    .map(({ seedStatus, ...cardMeta }) => ({
      ...cardMeta,
      status: normalizeStatus(statuses[cardMeta.path] || seedStatus),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return { tree, cards };
}

export function resolveDocPath({ dir, docsPath, logicalPath }) {
  const normalizedDir = resolve(dir);
  const normalizedDocsPath = docsPath.replace(/\/+$/, '');
  if (
    typeof logicalPath !== 'string' ||
    !logicalPath.startsWith(`${normalizedDocsPath}/`) ||
    logicalPath.includes('..')
  ) {
    return null;
  }
  const abs = resolve(normalizedDir, logicalPath.slice(normalizedDocsPath.length + 1));
  return abs.startsWith(`${normalizedDir}${sep}`) ? abs : null;
}
