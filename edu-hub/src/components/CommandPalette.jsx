import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tracksConfig } from '../data/tracks';
import { questionsBank } from '../data/interviewBank';
import { Search, X, ArrowRight, BookOpen, HelpCircle, Activity, FileText, Crown, Layout, Play } from 'lucide-react';
import './CommandPalette.css';

export default function CommandPalette({ isOpen, onClose, onOpenPro }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(prev => !prev);
      }
      if (e.key === 'Escape') {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Build searchable items
  const trackResults = tracksConfig.filter(t => 
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.tagline.toLowerCase().includes(query.toLowerCase())
  ).map(t => ({
    type: 'track',
    title: `${t.name} Tutorial`,
    subtitle: t.tagline,
    url: `/track/${t.id}`,
    icon: BookOpen,
    badge: 'Tutorial'
  }));

  const qaResults = questionsBank.filter(q => 
    q.question.toLowerCase().includes(query.toLowerCase()) ||
    q.answer.toLowerCase().includes(query.toLowerCase()) ||
    q.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6).map(q => ({
    type: 'qa',
    title: q.question,
    subtitle: `${q.trackName} · ${q.category}`,
    url: `/interview-arena?track=${q.trackId}`,
    icon: HelpCircle,
    badge: q.trackName
  }));

  const quickTools = [
    { title: 'Edu Hub Pro & Architect Studio', subtitle: 'Unlock FAANG System Design & Anki Kits', action: 'pro', icon: Crown, badge: 'Pro' },
    { title: 'System Design Canvas & Architecture Studio', subtitle: 'Design Microservices & Event-Driven Systems', url: '/system-design-canvas', icon: Layout, badge: 'Canvas' },
    { title: 'Interactive Mock Interview Arena', subtitle: 'Timed questions & flashcards', url: '/interview-arena', icon: HelpCircle, badge: 'Tool' },
    { title: 'Code Playground & Runtimes', subtitle: 'Live execution for Python, Java, JS, HTML', url: '/code-editor', icon: Play, badge: 'Sandbox' },
    { title: 'Cheat Sheet & Summary Builder', subtitle: 'Custom revision & markdown/PDF export', url: '/cheatsheets', icon: FileText, badge: 'Export' },
    { title: 'Readiness & Analytics Dashboard', subtitle: 'Track your competency matrix', url: '/readiness', icon: Activity, badge: 'Analytics' }
  ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()));

  const allResults = [...trackResults, ...quickTools, ...qaResults];

  const handleSelect = (item) => {
    if (item.action === 'pro' && onOpenPro) {
      onClose(false);
      onOpenPro();
      return;
    }
    if (item.url) {
      navigate(item.url);
      onClose(false);
    }
  };

  return (
    <div className="command-palette-backdrop" onClick={() => onClose(false)}>
      <div className="command-palette-modal" onClick={e => e.stopPropagation()}>
        <div className="palette-input-wrapper">
          <Search className="palette-search-icon" size={20} />
          <input
            type="text"
            className="palette-search-input"
            placeholder="Type a command or search AWS, GraphQL, Spring, Node, Python..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button className="palette-close-btn" onClick={() => onClose(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="palette-results-list">
          {allResults.length > 0 ? (
            allResults.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`palette-item ${selectedIndex === idx ? 'selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="item-icon-box">
                    <Icon size={18} />
                  </div>
                  <div className="item-text-box">
                    <div className="item-title-row">
                      <span className="item-title">{item.title}</span>
                      <span className="item-badge">{item.badge}</span>
                    </div>
                    <span className="item-subtitle">{item.subtitle}</span>
                  </div>
                  <ArrowRight size={14} className="item-arrow" />
                </div>
              );
            })
          ) : (
            <div className="palette-empty">
              <p>No results found for "<strong>{query}</strong>"</p>
            </div>
          )}
        </div>

        <div className="palette-footer">
          <span>Navigate with <kbd>↑</kbd> <kbd>↓</kbd></span>
          <span>Select with <kbd>Enter</kbd></span>
          <span>Close with <kbd>Esc</kbd></span>
        </div>
      </div>
    </div>
  );
}
