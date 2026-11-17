import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { tracksConfig } from '../data/tracks';
import { useUserPreference, PERSONAS } from '../context/UserPreferenceContext';
import {
  Cloud,
  Layers,
  Coffee,
  Server,
  Terminal,
  ArrowRight,
  BookOpen,
  Search,
  Sparkles,
  Code2,
  GraduationCap,
  ExternalLink,
  HelpCircle,
  Activity,
  FileText,
  Command,
  Flame,
  Layout,
  Play,
  Crown,
  School,
  Briefcase,
  Database,
  Globe,
  Puzzle,
  Cpu,
  SlidersHorizontal,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Compass
} from 'lucide-react';
import './Home.css';

const iconMap = {
  Cloud: Cloud,
  Layers: Layers,
  Coffee: Coffee,
  Server: Server,
  Terminal: Terminal,
  Code2: Code2,
  Cpu: Cpu,
  Database: Database,
  Globe: Globe,
  Puzzle: Puzzle,
  School: School,
  GraduationCap: GraduationCap,
  BookOpen: BookOpen,
  Briefcase: Briefcase,
};

export default function Home({ onOpenCommand, onOpenPro }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('curated'); // 'curated' | 'all'
  const { personaId, activePersona, openPreferenceModal } = useUserPreference();

  // Curated tracks matching persona
  const curatedTracks = tracksConfig.filter(t => {
    if (!personaId) return true;
    return (
      t.personas?.includes(personaId) ||
      activePersona?.recommendedTracks?.includes(t.id)
    );
  });

  const displayList = activeTab === 'curated' && personaId ? curatedTracks : tracksConfig;

  const filteredTracks = displayList.filter(t => {
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.badge.toLowerCase().includes(q)
    );
  });

  const scrollToTracks = (e) => {
    e.preventDefault();
    const el = document.getElementById('tracks-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="edu-home">
      {/* Top Header Navbar */}
      <nav className="home-top-nav">
          <div className="top-nav-links">
            {/* 1. Tutorials */}
            <a href="#tracks-section" onClick={scrollToTracks} className="nav-pill-link highlight-pill">
              <BookOpen size={14} />
              <span>Tutorials</span>
            </a>

            {/* 2. Code Playground */}
            <Link to="/code-editor" className="nav-pill-link">
              <Play size={14} style={{ color: '#ea580c' }} />
              <span>Code Playground</span>
            </Link>

            {/* 3. Mock Interview Arena */}
            <Link to="/interview-arena" className="nav-pill-link">
              <Flame size={14} style={{ color: '#f59e0b' }} />
              <span>Mock Interview Arena</span>
            </Link>

            {/* 4. System Design Canvas */}
            <Link to="/system-design-canvas" className="nav-pill-link">
              <Layout size={14} style={{ color: '#2563eb' }} />
              <span>System Design Canvas</span>
            </Link>

            {/* 5. Cheat Sheets */}
            <Link to="/cheatsheets" className="nav-pill-link">
              <FileText size={14} style={{ color: '#10b981' }} />
              <span>Cheat Sheets</span>
            </Link>

            {/* 6. Readiness Matrix */}
            <Link to="/readiness" className="nav-pill-link">
              <Activity size={14} style={{ color: '#8b5cf6' }} />
              <span>Readiness Matrix</span>
            </Link>

            {/* Right side actions */}
            <div className="top-nav-right-actions">
              {/* Persona Switcher Pill */}
              <button
                className="nav-pill-link profile-switcher-pill"
                onClick={openPreferenceModal}
                style={{
                  background: activePersona ? `${activePersona.color}15` : 'rgba(2, 132, 199, 0.1)',
                  borderColor: activePersona?.color || '#0284c7',
                  color: activePersona?.color || '#0284c7'
                }}
                title="Change your learning track"
              >
                <span className="dot" style={{ backgroundColor: activePersona?.color || '#0284c7' }}></span>
                <span>{activePersona ? `🎯 Track: ${activePersona.shortTitle}` : '✨ Set Track'}</span>
                <ChevronDown size={13} />
              </button>

              <button className="command-trigger-btn" onClick={onOpenCommand} title="Quick Search (Ctrl+K)">
                <Command size={13} />
                <span>Ctrl + K</span>
              </button>

              {onOpenPro && (
                <button className="nav-pill-link pro-nav-btn" onClick={onOpenPro} title="Upgrade to Edu Hub Pro">
                  <Crown size={13} style={{ color: '#f59e0b' }} />
                  <span>Pro</span>
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="hero-section">
          <div className="hero-pill">
            <Sparkles size={15} />
            <span>Interactive Engineering &amp; Computer Science Portal</span>
          </div>
          <h1 className="hero-title">
            <span>Edu Hub</span> Learning Studio
          </h1>
          <p className="hero-subtitle">
            Curated interactive tutorials, live sandboxed code playground, timed mock interviews, and system design canvases scoped to your learning path.
          </p>

          {/* Live Search */}
          <div className="search-bar-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search concepts, languages (Python, Java, C++, SQL, AWS), or press Ctrl+K..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                Clear
              </button>
            )}
          </div>
        </header>

        {/* Active Persona Banner / Curator Callout */}
        {activePersona && (
          <section className="persona-focus-banner" style={{ '--banner-accent': activePersona.color }}>
            <div className="persona-banner-content">
              <div className="persona-banner-badge" style={{ color: activePersona.color, background: `${activePersona.color}15` }}>
                <CheckCircle2 size={15} />
                <span>Active Track: {activePersona.title}</span>
              </div>
              <h3 className="persona-banner-title">{activePersona.badge}</h3>
              <p className="persona-banner-desc">{activePersona.description}</p>
              <div className="persona-banner-tags">
                <span className="persona-tag-label">Target Languages:</span>
                {activePersona.recommendedLangs.map(l => (
                  <span key={l} className="persona-lang-pill">{l.toUpperCase()}</span>
                ))}
              </div>
            </div>
            <div className="persona-banner-actions">
              <button className="persona-switch-btn" onClick={openPreferenceModal}>
                <SlidersHorizontal size={14} />
                <span>Update Preference</span>
              </button>
              <Link to="/code-editor" className="persona-playground-btn" style={{ background: activePersona.color }}>
                <Play size={14} />
                <span>Open Playground</span>
              </Link>
            </div>
          </section>
        )}

        {/* Interactive Tools Grid */}
        <section className="interactive-feature-grid">
          <a href="#tracks-section" onClick={scrollToTracks} className="feature-card">
            <div className="feature-icon-box blue">
              <BookOpen size={20} />
            </div>
            <div className="feature-info">
              <h3>Interactive Tutorials</h3>
              <p>Multi-chapter study guides with theory, implementation code, and concept Q&amp;A cards.</p>
            </div>
            <ArrowRight size={16} className="feat-arrow" />
          </a>

          <Link to="/code-editor" className="feature-card">
            <div className="feature-icon-box orange">
              <Play size={20} />
            </div>
            <div className="feature-info">
              <h3>Code Playground</h3>
              <p>In-browser SQL engine, HTML live preview, Scratch flow simulator, and native runners.</p>
            </div>
            <ArrowRight size={16} className="feat-arrow" />
          </Link>

          <Link to="/interview-arena" className="feature-card">
            <div className="feature-icon-box orange">
              <Flame size={20} />
            </div>
            <div className="feature-info">
              <h3>Mock Interview Arena</h3>
              <p>Timed 2-minute flashcards covering CBSE/ICSE board problems, DSA, and System Design.</p>
            </div>
            <ArrowRight size={16} className="feat-arrow" />
          </Link>

          <Link to="/system-design-canvas" className="feature-card">
            <div className="feature-icon-box blue">
              <Layout size={20} />
            </div>
            <div className="feature-info">
              <h3>System Design Canvas</h3>
              <p>Drag-and-drop architecture studio with microservice templates and SVG/JSON export.</p>
            </div>
            <ArrowRight size={16} className="feat-arrow" />
          </Link>
        </section>

        {/* Tracks Grid Section */}
        <section id="tracks-section" className="topics-container">
          <div className="section-header">
            <div className="section-title-wrap">
              <Compass className="section-icon" size={22} />
              <h2>{activeTab === 'curated' && personaId ? `Curated Tracks for ${activePersona?.shortTitle}` : 'All Curriculum Tracks'}</h2>
              <span className="count-badge">{filteredTracks.length} available</span>
            </div>

            {personaId && (
              <div className="track-filter-tabs">
                <button
                  className={`filter-tab-btn ${activeTab === 'curated' ? 'active' : ''}`}
                  onClick={() => setActiveTab('curated')}
                >
                  🎯 Curated ({curatedTracks.length})
                </button>
                <button
                  className={`filter-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  🌐 All Tracks ({tracksConfig.length})
                </button>
              </div>
            )}
          </div>

          <div className="topics-grid">
            {filteredTracks.map((track) => {
              const IconComp = iconMap[track.icon] || BookOpen;
              const isCurated = curatedTracks.some(ct => ct.id === track.id);
              return (
                <Link
                  key={track.id}
                  to={`/track/${track.id}`}
                  className={`topic-card ${isCurated ? 'is-curated' : ''}`}
                  style={{ '--accent-color': track.color }}
                >
                  <div className="card-top">
                    <div className="topic-icon-wrap" style={{ color: track.color }}>
                      <IconComp size={22} />
                    </div>
                    <div className="badges-group">
                      {isCurated && <span className="curated-mini-badge">Curated</span>}
                      <span className="topic-badge">{track.badge}</span>
                    </div>
                  </div>

                  <div className="card-body">
                    <h3 className="topic-title">{track.name}</h3>
                    <p className="topic-tagline">{track.tagline}</p>
                  </div>

                  <div className="card-footer">
                    <span className="qa-count">📘 {track.modulesCount || 10} In-Depth Modules</span>
                    <span className="explore-action">
                      <span>Start Learning</span>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Jump Bar */}
        <section className="quick-matrix-section">
          <div className="quick-matrix-header">
            <h3>⚡ Quick Track Jump</h3>
          </div>
          <div className="matrix-pills-row">
            {tracksConfig.map(t => (
              <Link key={t.id} to={`/track/${t.id}`} className="matrix-quick-pill">
                <span>{t.icon === 'Coffee' ? '☕' : t.icon === 'Database' ? '🗄️' : t.icon === 'Globe' ? '🌐' : '📘'} {t.name}</span>
              </Link>
            ))}
          </div>
        </section>
    </div>
  );
}
