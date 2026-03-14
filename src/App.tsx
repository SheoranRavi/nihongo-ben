import { useState } from 'react';
import type { GroupMode } from './types';
import { wordMap, semanticGroups, moraGroups, confusableGroups } from './data/index';
import Header from './components/Header';
import Sidebar, { type SidebarSection } from './components/Sidebar';
import WordGrid from './components/WordGrid';
import './App.css';

const groupById = new Map(
  [...semanticGroups, ...moraGroups, ...confusableGroups].map(g => [g.id, g])
);

const SECTIONS: Record<GroupMode, SidebarSection[]> = {
  semantic: [{ title: 'Categories', groups: semanticGroups }],
  phonetic: [
    { title: 'By First Sound (行)', groups: moraGroups },
    { title: 'Confusable Pairs', groups: confusableGroups },
  ],
};

export default function App() {
  const [mode, setMode] = useState<GroupMode>('semantic');
  const [selectedId, setSelectedId] = useState<string | null>(
    semanticGroups[0]?.id ?? null
  );

  function handleModeToggle(newMode: GroupMode) {
    setMode(newMode);
    setSelectedId(SECTIONS[newMode][0].groups[0]?.id ?? null);
  }

  const selectedGroup = selectedId ? groupById.get(selectedId) ?? null : null;

  return (
    <div className="app">
      <Header mode={mode} onToggle={handleModeToggle} />
      <div className="layout">
        <Sidebar
          sections={SECTIONS[mode]}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <main className="main">
          <WordGrid group={selectedGroup} wordMap={wordMap} />
        </main>
      </div>
    </div>
  );
}
