import type { Group, Word } from '../types';
import { wordCategories } from './wordCategories';

/**
 * Category definitions with display labels, ordered as they should appear in the sidebar.
 */
const CATEGORIES: { id: string; label: string }[] = [
  { id: 'food', label: 'Food & Drink' },
  { id: 'animals', label: 'Animals' },
  { id: 'nature', label: 'Nature & Geography' },
  { id: 'weather', label: 'Weather' },
  { id: 'body', label: 'Body' },
  { id: 'health', label: 'Health & Medicine' },
  { id: 'family', label: 'Family' },
  { id: 'people', label: 'People & Occupations' },
  { id: 'clothing', label: 'Clothing & Accessories' },
  { id: 'household', label: 'Household Items' },
  { id: 'places', label: 'Places & Buildings' },
  { id: 'transport', label: 'Transport' },
  { id: 'school', label: 'School & Education' },
  { id: 'work', label: 'Work & Business' },
  { id: 'hobby', label: 'Hobbies & Entertainment' },
  { id: 'colors', label: 'Colors' },
  { id: 'time', label: 'Time & Calendar' },
  { id: 'numbers', label: 'Numbers & Counting' },
  { id: 'directions', label: 'Directions & Location' },
  { id: 'verbs_action', label: 'Verbs — Actions' },
  { id: 'verbs_motion', label: 'Verbs — Motion' },
  { id: 'verbs_comm', label: 'Verbs — Communication' },
  { id: 'verbs_state', label: 'Verbs — State & Change' },
  { id: 'adj_physical', label: 'Adjectives — Physical' },
  { id: 'adj_quality', label: 'Adjectives — Quality' },
  { id: 'adverbs', label: 'Adverbs' },
  { id: 'pronouns', label: 'Pronouns & Question Words' },
  { id: 'expressions', label: 'Expressions' },
  { id: 'society', label: 'Society & Culture' },
];

export function buildSemanticGroups(words: Word[]): Group[] {
  const buckets = new Map<string, string[]>();
  for (const cat of CATEGORIES) {
    buckets.set(cat.id, []);
  }
  buckets.set('other', []);

  for (const word of words) {
    const cat = wordCategories[word.id];
    if (cat && buckets.has(cat)) {
      buckets.get(cat)!.push(word.id);
    } else {
      buckets.get('other')!.push(word.id);
    }
  }

  const groups: Group[] = CATEGORIES
    .map(cat => ({
      id: cat.id,
      label: cat.label,
      wordIds: buckets.get(cat.id)!,
    }))
    .filter(g => g.wordIds.length > 0);

  const otherIds = buckets.get('other')!;
  if (otherIds.length > 0) {
    groups.push({ id: 'other', label: 'Other', wordIds: otherIds });
  }

  return groups;
}
