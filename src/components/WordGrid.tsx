import type { Word, Group } from '../types';
import WordCard from './WordCard';
import styles from './WordGrid.module.css';

interface Props {
  group: Group | null;
  wordMap: Map<string, Word>;
}

export default function WordGrid({ group, wordMap }: Props) {
  if (!group) {
    return (
      <div className={styles.empty}>
        <p>Select a group from the sidebar</p>
      </div>
    );
  }

  const words = group.wordIds
    .map(id => wordMap.get(id))
    .filter((w): w is Word => w !== undefined);

  return (
    <div className={styles.container}>
      <div className={styles.groupHeader}>
        <h2 className={styles.groupTitle}>{group.label}</h2>
        <span className={styles.count}>{words.length} words</span>
      </div>
      <div className={styles.grid}>
        {words.map(word => (
          <WordCard key={word.id} word={word} />
        ))}
      </div>
    </div>
  );
}
