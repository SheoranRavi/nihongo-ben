import { useState } from 'react';
import type { Word } from '../types';
import styles from './WordCard.module.css';

const POS_LABELS: Record<string, string> = {
  verb: 'V',
  noun: 'N',
  adjective: 'Adj',
  adverb: 'Adv',
  particle: 'Part',
  conjunction: 'Conj',
  interjection: 'Int',
  expression: 'Expr',
  pronoun: 'Pron',
  counter: 'Ctr',
  other: '',
};

interface Props {
  word: Word;
}

export default function WordCard({ word }: Props) {
  const [expanded, setExpanded] = useState(false);
  const posLabel = POS_LABELS[word.pos] ?? word.pos;

  return (
    <div
      className={`${styles.card} ${expanded ? styles.expanded : ''}`}
      onClick={() => setExpanded(e => !e)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setExpanded(v => !v)}
      aria-expanded={expanded}
    >
      <div className={styles.front}>
        {word.kanji && <div className={styles.kanji}>{word.kanji}</div>}
        <div className={styles.reading}>{word.reading}</div>
        <div className={styles.meaning}>{word.meaning}</div>
        {posLabel && <span className={`${styles.pos} ${styles[`pos-${word.pos}`]}`}>{posLabel}</span>}
      </div>
      {expanded && word.example && (
        <div className={styles.example}>
          <p className={styles.exampleJa}>{word.example.ja}</p>
          <p className={styles.exampleEn}>{word.example.en}</p>
        </div>
      )}
      {expanded && !word.example && (
        <div className={styles.example}>
          <p className={styles.noExample}>No example available</p>
        </div>
      )}
    </div>
  );
}
