import type { Group, Word } from '../types';

// Hiragana row definitions for initial mora grouping
const MORA_ROWS: { id: string; label: string; chars: string[] }[] = [
  { id: 'a-row',  label: 'あ行 (a)',  chars: ['あ','い','う','え','お'] },
  { id: 'ka-row', label: 'か行 (ka)', chars: ['か','き','く','け','こ','が','ぎ','ぐ','げ','ご'] },
  { id: 'sa-row', label: 'さ行 (sa)', chars: ['さ','し','す','せ','そ','ざ','じ','ず','ぜ','ぞ'] },
  { id: 'ta-row', label: 'た行 (ta)', chars: ['た','ち','つ','て','と','だ','ぢ','づ','で','ど'] },
  { id: 'na-row', label: 'な行 (na)', chars: ['な','に','ぬ','ね','の'] },
  { id: 'ha-row', label: 'は行 (ha)', chars: ['は','ひ','ふ','へ','ほ','ば','び','ぶ','べ','ぼ','ぱ','ぴ','ぷ','ぺ','ぽ'] },
  { id: 'ma-row', label: 'ま行 (ma)', chars: ['ま','み','む','め','も'] },
  { id: 'ya-row', label: 'や行 (ya)', chars: ['や','ゆ','よ'] },
  { id: 'ra-row', label: 'ら行 (ra)', chars: ['ら','り','る','れ','ろ'] },
  { id: 'wa-row', label: 'わ行 (wa)', chars: ['わ','を','ん'] },
  { id: 'kata',   label: 'カタカナ語 (katakana)', chars: [] }, // katakana words
];

// Normalize a reading for comparison: strip spaces, slashes, take first variant
function normalizeReading(r: string): string {
  return r.split(/[\s/]/)[0].trim();
}

function getFirstHiragana(reading: string): string {
  return normalizeReading(reading)[0] || '';
}

function isKatakana(ch: string): boolean {
  return ch >= '\u30A0' && ch <= '\u30FF';
}

export function buildMoraGroups(words: Word[]): Group[] {
  const buckets: Map<string, string[]> = new Map(MORA_ROWS.map(r => [r.id, []]));
  const other: string[] = [];

  for (const word of words) {
    const first = getFirstHiragana(word.reading);
    if (!first) { other.push(word.id); continue; }

    if (isKatakana(first)) {
      buckets.get('kata')!.push(word.id);
      continue;
    }

    let placed = false;
    for (const row of MORA_ROWS) {
      if (row.chars.includes(first)) {
        buckets.get(row.id)!.push(word.id);
        placed = true;
        break;
      }
    }
    if (!placed) other.push(word.id);
  }

  const groups: Group[] = MORA_ROWS.map(row => ({
    id: `mora-${row.id}`,
    label: row.label,
    wordIds: buckets.get(row.id)!,
  })).filter(g => g.wordIds.length > 0);

  if (other.length > 0) {
    groups.push({ id: 'mora-other', label: 'その他', wordIds: other });
  }

  return groups;
}

// Levenshtein distance using a single rolling row (O(n) space instead of O(m*n))
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  let row = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = row[j];
      row[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, row[j], row[j - 1]);
      prev = tmp;
    }
  }
  return row[n];
}

export function buildConfusableGroups(words: Word[]): Group[] {
  const normalized = words.map(w => ({ ...w, norm: normalizeReading(w.reading) }));

  // 1. Homophones: exact same normalized reading
  const byReading = new Map<string, string[]>();
  for (const w of normalized) {
    const arr = byReading.get(w.norm) ?? [];
    arr.push(w.id);
    byReading.set(w.norm, arr);
  }

  const homophoneIds = new Set<string>();
  const homophoneGroups: Group[] = [];
  for (const [reading, ids] of byReading) {
    if (ids.length >= 2) {
      homophoneGroups.push({
        id: `homophone-${reading}`,
        label: `${reading} (同音)`,
        wordIds: ids,
      });
      for (const id of ids) homophoneIds.add(id);
    }
  }

  // 2. Near-homophones: Levenshtein distance ≤ 1 for words ≤ 4 mora, ≤ 2 for longer
  // Use Union-Find to cluster similar-sounding words
  // Build adjacency (only among non-homophone words to avoid double counting)
  const nonHomophoneWords = normalized.filter(w => !homophoneIds.has(w.id));

  // Union-Find
  const parent = new Map<string, string>(nonHomophoneWords.map(w => [w.id, w.id]));
  function find(x: string): string {
    while (parent.get(x) !== x) {
      const p = parent.get(x)!;
      parent.set(x, parent.get(p) ?? p);
      x = p;
    }
    return x;
  }
  function union(x: string, y: string) {
    const px = find(x), py = find(y);
    if (px !== py) parent.set(px, py);
  }

  for (let i = 0; i < nonHomophoneWords.length; i++) {
    for (let j = i + 1; j < nonHomophoneWords.length; j++) {
      const a = nonHomophoneWords[i].norm;
      const b = nonHomophoneWords[j].norm;
      const maxLen = Math.max(a.length, b.length);
      const threshold = maxLen <= 3 ? 1 : 2;
      if (Math.abs(a.length - b.length) > threshold) continue;
      const dist = levenshtein(a, b);
      if (dist > 0 && dist <= threshold) {
        union(nonHomophoneWords[i].id, nonHomophoneWords[j].id);
      }
    }
  }

  // Collect clusters
  const clusters = new Map<string, string[]>();
  for (const w of nonHomophoneWords) {
    const root = find(w.id);
    const arr = clusters.get(root) ?? [];
    arr.push(w.id);
    clusters.set(root, arr);
  }

  const normMap = new Map(nonHomophoneWords.map(w => [w.id, w.norm]));
  const nearGroups: Group[] = [];
  for (const [, ids] of clusters) {
    if (ids.length >= 2) {
      nearGroups.push({
        id: `near-${ids[0]}`,
        label: `〜${normMap.get(ids[0])!}〜 (似た音)`,
        wordIds: ids,
      });
    }
  }

  return [...homophoneGroups, ...nearGroups];
}
