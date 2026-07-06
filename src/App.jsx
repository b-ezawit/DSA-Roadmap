import React, { useState, useMemo, useEffect } from 'react';
import PARTS_DATA from './data/partsData';
import useLocalStorage from './hooks/useLocalStorage';
import RoadmapCanvas from './components/RoadmapCanvas';
import PartDetail from './components/PartDetail';
import './index.css';

// Background floating particles
function BgParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: Math.random() * 12 + 10,
    }));
  }, []);

  return (
    <div className="bg-particles" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function App() {
  // Persistent state
  const [checkedMap, setCheckedMap] = useLocalStorage('dsa_checked', {});
  const [customQuestions, setCustomQuestions] = useLocalStorage('dsa_custom_questions', {});
  const [theme, setTheme] = useLocalStorage('dsa_theme', 'dark');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // UI state
  const [selectedPart, setSelectedPart] = useState(null);

  // Global stats
  const totalStats = useMemo(() => {
    let totalQ = 0;
    let solvedQ = 0;
    PARTS_DATA.forEach((part) => {
      const builtIn = part.questions || [];
      const custom = customQuestions[part.id] || [];
      const all = [...builtIn, ...custom];
      totalQ += all.length;
      solvedQ += all.filter((q) => checkedMap[q.id]).length;
    });
    const pct = totalQ > 0 ? Math.round((solvedQ / totalQ) * 100) : 0;
    return { totalQ, solvedQ, pct };
  }, [checkedMap, customQuestions]);

  // Toggle checkbox
  const handleToggle = (qId) => {
    setCheckedMap((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Add custom question
  const handleAddQuestion = (partId, newQ) => {
    setCustomQuestions((prev) => ({
      ...prev,
      [partId]: [...(prev[partId] || []), newQ],
    }));
  };

  // Edit custom question
  const handleEditQuestion = (partId, updatedQ) => {
    setCustomQuestions((prev) => ({
      ...prev,
      [partId]: prev[partId].map((q) => (q.id === updatedQ.id ? updatedQ : q)),
    }));
  };

  // Delete custom question
  const handleDeleteQuestion = (partId, qId) => {
    setCustomQuestions((prev) => ({
      ...prev,
      [partId]: prev[partId].filter((q) => q.id !== qId),
    }));
    // Remove from checked state if deleted
    setCheckedMap((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app">
      <title>DSA Roadmap — A2SV Progress Tracker</title>
      <BgParticles />

      {/* Header */}
      <header className="header">
        <div className="header-brand">
          <div>
            <div className="header-title">DSA Roadmap</div>
            <div className="header-subtitle">A2SV Learning Journey</div>
          </div>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="header-stats">
          <div className="stat-chip">
            <span>30 Parts</span>
          </div>
          <div className="stat-chip">
            <span>
              <strong>{totalStats.solvedQ}</strong> / {totalStats.totalQ} solved
            </span>
          </div>
          <div className="stat-chip">
            <span>
              <strong>{totalStats.pct}%</strong> overall
            </span>
          </div>
        </div>
      </header>

      {/* Main Roadmap */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <RoadmapCanvas
          parts={PARTS_DATA}
          checkedMap={checkedMap}
          customQuestions={customQuestions}
          onPartClick={setSelectedPart}
        />
      </main>

      {/* Scroll hint */}
      <div className="scroll-hint" aria-hidden="true">
        Drag or scroll to explore the road
      </div>

      {/* Part Detail Modal */}
      {selectedPart && (
        <PartDetail
          part={selectedPart}
          checkedMap={checkedMap}
          customQuestions={customQuestions}
          onToggle={handleToggle}
          onAddQuestion={handleAddQuestion}
          onEditQuestion={handleEditQuestion}
          onDeleteQuestion={handleDeleteQuestion}
          onClose={() => setSelectedPart(null)}
        />
      )}
    </div>
  );
}

export default App;
