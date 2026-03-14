import type { Group } from '../types';
import styles from './Sidebar.module.css';

export interface SidebarSection {
  title: string;
  groups: Group[];
}

interface Props {
  sections: SidebarSection[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function Sidebar({ sections, selectedId, onSelect }: Props) {
  return (
    <nav className={styles.sidebar}>
      {sections.map(section => (
        <div key={section.title} className={styles.section}>
          <div className={styles.sectionTitle}>{section.title}</div>
          <ul className={styles.list}>
            {section.groups.map(group => (
              <li key={group.id}>
                <button
                  className={`${styles.item} ${selectedId === group.id ? styles.active : ''}`}
                  onClick={() => onSelect(group.id)}
                >
                  <span className={styles.label}>{group.label}</span>
                  <span className={styles.badge}>{group.wordIds.length}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
