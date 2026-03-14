import type { GroupMode } from '../types';
import styles from './Header.module.css';

interface Props {
  mode: GroupMode;
  onToggle: (mode: GroupMode) => void;
}

export default function Header({ mode, onToggle }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <span className={styles.jp}>日本語</span>
        <span className={styles.en}>Ben — N5 + N4 Vocabulary</span>
      </div>
      <div className={styles.toggle}>
        <button
          className={`${styles.btn} ${mode === 'semantic' ? styles.active : ''}`}
          onClick={() => onToggle('semantic')}
        >
          By Meaning
        </button>
        <button
          className={`${styles.btn} ${mode === 'phonetic' ? styles.active : ''}`}
          onClick={() => onToggle('phonetic')}
        >
          By Sound
        </button>
      </div>
    </header>
  );
}
