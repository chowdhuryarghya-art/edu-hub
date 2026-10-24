import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TutorialViewer from './pages/TutorialViewer';
import InterviewArena from './pages/InterviewArena';
import CheatSheetBuilder from './pages/CheatSheetBuilder';
import ReadinessDashboard from './pages/ReadinessDashboard';
import SystemDesignCanvas from './pages/SystemDesignCanvas';
import CodeEditor from './pages/CodeEditor';
import CommandPalette from './components/CommandPalette';
import './App.css';

export default function App() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  return (
    <div className="app-shell">
      <CommandPalette isOpen={isCommandOpen} onClose={setIsCommandOpen} />
      
      <Routes>
        <Route path="/" element={<Home onOpenCommand={() => setIsCommandOpen(true)} />} />
        <Route path="/track/:trackId" element={<TutorialViewer />} />
        <Route path="/system-design-canvas" element={<SystemDesignCanvas />} />
        <Route path="/interview-arena" element={<InterviewArena />} />
        <Route path="/cheatsheets" element={<CheatSheetBuilder />} />
        <Route path="/readiness" element={<ReadinessDashboard />} />
        <Route path="/code-editor" element={<CodeEditor />} />
      </Routes>
    </div>
  );
}
