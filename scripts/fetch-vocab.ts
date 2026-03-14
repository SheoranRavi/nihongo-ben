/**
 * One-time script to fetch N5 + N4 vocabulary from the JLPT Vocab API
 * and save it to src/data/words.json.
 *
 * Run with: npx tsx scripts/fetch-vocab.ts
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface ApiWord {
  word: string;       // kanji form (may be kana-only)
  furigana: string;   // hiragana reading
  romaji: string;
  meaning: string;
  part_of_speech: string;
}

interface Word {
  id: string;
  kanji?: string;
  reading: string;
  meaning: string;
  pos: string;
  example?: {
    ja: string;
    en: string;
  };
}

function slugify(reading: string, meaning: string): string {
  const cleanMeaning = meaning
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 30);
  return `${reading}-${cleanMeaning}`;
}

function normalizePos(pos: string): string {
  const p = pos.toLowerCase();
  if (p.includes('verb') || p.includes('godan') || p.includes('ichidan') || p.startsWith('v')) return 'verb';
  if (p.includes('noun') || p.startsWith('n')) return 'noun';
  if (p.includes('adjective') || p.includes('adj') || p.includes('-i') || p.includes('-na')) return 'adjective';
  if (p.includes('adverb') || p.startsWith('adv')) return 'adverb';
  if (p.includes('particle')) return 'particle';
  if (p.includes('conjunction')) return 'conjunction';
  if (p.includes('interjection') || p.includes('int')) return 'interjection';
  if (p.includes('expression') || p.includes('exp')) return 'expression';
  if (p.includes('pronoun')) return 'pronoun';
  if (p.includes('counter')) return 'counter';
  return pos || 'other';
}

async function fetchLevel(level: number): Promise<ApiWord[]> {
  console.log(`Fetching level ${level} from JLPT Vocab API...`);
  const url = `https://jlpt-vocab-api.vercel.app/api/words?level=${level}&limit=1500`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`JLPT API returned ${res.status}`);
  const data = await res.json() as { words: ApiWord[] };
  const words = data.words ?? data;
  const list = Array.isArray(words) ? words : [];
  console.log(`  Level ${level}: ${list.length} raw words`);
  return list;
}

async function fetchFromJlptApi(): Promise<Word[]> {
  const n5 = await fetchLevel(5);
  const n4 = await fetchLevel(4);
  const allRaw = [...n5, ...n4];

  const seen = new Set<string>();
  const result: Word[] = [];

  for (const w of allRaw) {
    const reading = w.furigana?.trim() || w.word?.trim();
    if (!reading) continue;

    const meaning = w.meaning?.trim();
    if (!meaning) continue;

    const isKanaOnly = /^[\u3040-\u30FF]+$/.test(w.word?.trim() || '');
    const kanji = isKanaOnly ? undefined : w.word?.trim();

    const id = slugify(reading, meaning);
    if (seen.has(id)) continue;
    seen.add(id);

    result.push({
      id,
      ...(kanji ? { kanji } : {}),
      reading,
      meaning,
      pos: normalizePos(w.part_of_speech || ''),
    });
  }

  console.log(`Fetched ${result.length} unique words (N5 + N4)`);
  return result;
}

async function enrichWithExamples(words: Word[]): Promise<Word[]> {
  console.log('Fetching example sentences from Tatoeba for a sample of words...');
  // Only fetch examples for first 200 words to avoid rate limiting
  // The JLPT API doesn't include examples in its response
  const enriched = [...words];
  let fetched = 0;

  for (let i = 0; i < Math.min(enriched.length, 200); i++) {
    const w = enriched[i];
    const query = w.kanji || w.reading;
    try {
      const url = `https://api.tatoeba.org/unstable/sentences?lang=jpn&query=${encodeURIComponent(query)}&limit=3`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json() as { data?: Array<{ text: string; translations?: Array<Array<{ lang: string; text: string }>> }> };
      const sentences = data.data || [];
      for (const sentence of sentences) {
        const enTranslations = sentence.translations?.flat().filter(t => t.lang === 'eng') || [];
        if (enTranslations.length > 0) {
          enriched[i] = { ...w, example: { ja: sentence.text, en: enTranslations[0].text } };
          fetched++;
          break;
        }
      }
    } catch {
      // skip on error
    }
    if (fetched % 20 === 0 && fetched > 0) {
      console.log(`  ${fetched} examples fetched so far...`);
    }
    // small delay to be polite
    await new Promise(r => setTimeout(r, 50));
  }

  console.log(`Enriched ${fetched} words with example sentences`);
  return enriched;
}

async function main() {
  const words = await fetchFromJlptApi();

  // Uncomment to also fetch Tatoeba examples (slower):
  // const enriched = await enrichWithExamples(words);

  const outPath = join(__dirname, '../src/data/words.json');
  writeFileSync(outPath, JSON.stringify(words, null, 2), 'utf-8');
  console.log(`Saved ${words.length} words to ${outPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
