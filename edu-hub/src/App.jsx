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
import ProUpgradeModal from './components/ProUpgradeModal';
import PreferenceModal from './components/PreferenceModal';
import { UserPreferenceProvider } from './context/UserPreferenceContext';
import './App.css';

export default function App() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isProOpen, setIsProOpen] = useState(false);

  return (
    <UserPreferenceProvider>
      <div className="app-shell">
        <CommandPalette 
          isOpen={isCommandOpen} 
          onClose={setIsCommandOpen} 
          onOpenPro={() => setIsProOpen(true)}
        />
        <ProUpgradeModal 
          isOpen={isProOpen} 
          onClose={() => setIsProOpen(false)} 
        />
        <PreferenceModal />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                onOpenCommand={() => setIsCommandOpen(true)} 
                onOpenPro={() => setIsProOpen(true)}
              />
            } 
          />
          <Route path="/track/:trackId" element={<TutorialViewer />} />
          <Route path="/system-design-canvas" element={<SystemDesignCanvas onOpenPro={() => setIsProOpen(true)} />} />
          <Route path="/interview-arena" element={<InterviewArena onOpenPro={() => setIsProOpen(true)} />} />
          <Route path="/cheatsheets" element={<CheatSheetBuilder onOpenPro={() => setIsProOpen(true)} />} />
          <Route path="/readiness" element={<ReadinessDashboard onOpenPro={() => setIsProOpen(true)} />} />
          <Route path="/code-editor" element={<CodeEditor onOpenPro={() => setIsProOpen(true)} />} />
        </Routes>
      </div>
    </UserPreferenceProvider>
  );
}
