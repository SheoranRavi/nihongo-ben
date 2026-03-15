import { useState } from 'react';
import type { GroupMode } from './types';
import { wordMap, semanticGroups, moraGroups, confusableGroups, allWordsGroup } from './data/index';
import Header from './components/Header';
import Sidebar, { type SidebarSection } from './components/Sidebar';
import WordGrid from './components/WordGrid';
import './App.css';

const groupById = new Map(
  [allWordsGroup, ...semanticGroups, ...moraGroups, ...confusableGroups].map(g => [g.id, g])
);

const allSection: SidebarSection = { title: '', groups: [allWordsGroup] };

const SECTIONS: Record<GroupMode, SidebarSection[]> = {
  semantic: [allSection, { title: 'Categories', groups: semanticGroups }],
  phonetic: [
    allSection,
    { title: 'By First Sound (行)', groups: moraGroups },
    { title: 'Confusable Pairs', groups: confusableGroups },
  ],
};

export default function App() {
  const [mode, setMode] = useState<GroupMode>('semantic');
  const [selectedId, setSelectedId] = useState<string | null>(
    semanticGroups[0]?.id ?? null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleModeToggle(newMode: GroupMode) {
    setMode(newMode);
    setSelectedId(SECTIONS[newMode][0].groups[0]?.id ?? null);
  }

  function handleSelect(id: string) {
    setSelectedId(id);
    setSidebarOpen(false);
  }

  const selectedGroup = selectedId ? groupById.get(selectedId) ?? null : null;

  return (
    <div className="app">
      <Header
        mode={mode}
        onToggle={handleModeToggle}
        onMenuToggle={() => setSidebarOpen(o => !o)}
        sidebarOpen={sidebarOpen}
      />
      <div className="layout">
        {sidebarOpen && (
          <div className="overlay" onClick={() => setSidebarOpen(false)} />
        )}
        <Sidebar
          sections={SECTIONS[mode]}
          selectedId={selectedId}
          onSelect={handleSelect}
          open={sidebarOpen}
        />
        <main className="main">
          <WordGrid group={selectedGroup} wordMap={wordMap} />
        </main>
      </div>
    </div>
  );
}
