import type { Group, GroupMode } from '../types';
import styles from './Sidebar.module.css';

interface Props {
  mode: GroupMode;
  semanticGroups: Group[];
  moraGroups: Group[];
  confusableGroups: Group[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

interface SidebarSection {
  title: string;
  groups: Group[];
}

export default function Sidebar({
  mode,
  semanticGroups,
  moraGroups,
  confusableGroups,
  selectedId,
  onSelect,
}: Props) {
  const sections: SidebarSection[] = mode === 'semantic'
    ? [{ title: 'Categories', groups: semanticGroups }]
    : [
        { title: 'By First Sound (行)', groups: moraGroups },
        { title: 'Confusable Pairs', groups: confusableGroups },
      ];

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
