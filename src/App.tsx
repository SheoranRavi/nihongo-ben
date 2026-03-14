import { useState } from 'react';
import type { GroupMode } from './types';
import { wordMap, semanticGroups, moraGroups, confusableGroups } from './data/index';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WordGrid from './components/WordGrid';
import './App.css';

export default function App() {
  const [mode, setMode] = useState<GroupMode>('semantic');
  const [selectedId, setSelectedId] = useState<string | null>(
    semanticGroups[0]?.id ?? null
  );

  function handleModeToggle(newMode: GroupMode) {
    setMode(newMode);
    if (newMode === 'semantic') {
      setSelectedId(semanticGroups[0]?.id ?? null);
    } else {
      setSelectedId(moraGroups[0]?.id ?? null);
    }
  }

  const allGroups = [...semanticGroups, ...moraGroups, ...confusableGroups];
  const selectedGroup = selectedId ? allGroups.find(g => g.id === selectedId) ?? null : null;

  return (
    <div className="app">
      <Header mode={mode} onToggle={handleModeToggle} />
      <div className="layout">
        <Sidebar
          mode={mode}
          semanticGroups={semanticGroups}
          moraGroups={moraGroups}
          confusableGroups={confusableGroups}
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
