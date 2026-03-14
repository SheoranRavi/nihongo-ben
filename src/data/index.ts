import rawWords from './words.json';
import type { Word, Group } from '../types';
import { buildSemanticGroups } from './semanticGroups';
import { buildMoraGroups, buildConfusableGroups } from './phoneticGroups';

export const words: Word[] = rawWords as Word[];

export const wordMap: Map<string, Word> = new Map(words.map(w => [w.id, w]));

export const semanticGroups: Group[] = buildSemanticGroups(words);

export const moraGroups: Group[] = buildMoraGroups(words);

export const confusableGroups: Group[] = buildConfusableGroups(words);

export const allWordsGroup: Group = {
  id: 'all',
  label: 'All Words',
  wordIds: words.map(w => w.id),
};
