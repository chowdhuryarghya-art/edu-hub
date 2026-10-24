import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { tracksConfig } from '../data/tracks';
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
  Play
} from 'lucide-react';
import './Home.css';

const iconMap = {
  Cloud: Cloud,
  Layers: Layers,
  Coffee: Coffee,
  Server: Server,
  Terminal: Terminal
};

export default function Home({ onOpenCommand }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTracks = tracksConfig.filter(t => {
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.badge.toLowerCase().includes(q)
    );
  });

  return (
    <div className="edu-home">
      {/* Top Header / Quick Action Bar */}
      <nav className="home-top-nav">
        <div className="brand-badge">
          <GraduationCap size={20} className="brand-icon" />
          <span>Edu Hub v2.0</span>
        </div>

        <div className="top-nav-links">
          <Link to="/system-design-canvas" className="nav-pill-link highlight-pill" style={{ '--pill-color': '#3b82f6' }}>
            <Layout size={14} />
            <span>System Design Canvas</span>
          </Link>
          <Link to="/interview-arena" className="nav-pill-link" style={{ '--pill-color': '#f59e0b' }}>
            <Flame size={14} />
            <span>Mock Interview Arena</span>
          </Link>
          <Link to="/cheatsheets" className="nav-pill-link" style={{ '--pill-color': '#10b981' }}>
            <FileText size={14} />
            <span>Cheat Sheets</span>
          </Link>
          <Link to="/readiness" className="nav-pill-link" style={{ '--pill-color': '#8b5cf6' }}>
            <Activity size={14} />
            <span>Readiness Matrix</span>
          </Link>
          <Link to="/code-editor" className="nav-pill-link" style={{ '--pill-color': '#e535ab' }}>
            <Play size={14} />
            <span>Code Playground</span>
          </Link>
          <button className="command-trigger-btn" onClick={onOpenCommand} title="Quick Search (Ctrl+K)">
            <Command size={14} />
            <span>Ctrl + K</span>
          </button>
        </div>
      </nav>

      {/* Hero Banner */}
      <header className="hero-section">
        <div className="hero-pill">
          <Sparkles size={16} />
          <span>Interactive Engineering Mastery & Architecture Studio</span>
        </div>
        <h1 className="hero-title">
          <span>Edu Hub</span> Developer Portal
        </h1>
        <p className="hero-subtitle">
          Unified portal linking full interactive tutorials, visual system design flow evaluators, timed interview simulators, and cheat sheets for AWS, GraphQL, Java Spring Boot, Node.js, and Python.
        </p>

        {/* Live Search */}
        <div className="search-bar-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search tracks, concepts, or press Ctrl+K to jump..."
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

      {/* Feature Showcase Grid */}
      <section className="interactive-feature-grid">
        <Link to="/system-design-canvas" className="feature-card blue-glow">
          <div className="feature-icon-box blue">
            <Layout size={24} />
          </div>
          <div className="feature-info">
            <h3>System Design Canvas</h3>
            <p>Lucid & Draw.io style canvas to design architectures, microservices, flows, and export SVG/JSON diagrams.</p>
          </div>
          <ArrowRight size={18} className="feat-arrow" />
        </Link>

        <Link to="/interview-arena" className="feature-card arena-glow">
          <div className="feature-icon-box orange">
            <Flame size={24} />
          </div>
          <div className="feature-info">
            <h3>Mock Interview Arena</h3>
            <p>Timed 2-minute questions, interactive flashcards & key talking points.</p>
          </div>
          <ArrowRight size={18} className="feat-arrow" />
        </Link>

        <Link to="/cheatsheets" className="feature-card green-glow">
          <div className="feature-icon-box green">
            <FileText size={24} />
          </div>
          <div className="feature-info">
            <h3>Cheat Sheet & PDF Builder</h3>
            <p>Select multiple technologies and generate a print-ready 1-page summary.</p>
          </div>
          <ArrowRight size={18} className="feat-arrow" />
        </Link>

        <Link to="/code-editor" className="feature-card pink-glow">
          <div className="feature-icon-box pink">
            <Play size={24} />
          </div>
          <div className="feature-info">
            <h3>Code Playground</h3>
            <p>Run Java, Node.js, Python & GraphQL live with prerequisite checks and sandboxed execution.</p>
          </div>
          <ArrowRight size={18} className="feat-arrow" />
        </Link>
      </section>

      {/* Main Track Cards */}
      <main className="topics-container">
        {/* ⑦ Section divider */}
        <div className="section-divider">
          <div className="section-divider-line" />
          <div className="section-divider-pill">
            <BookOpen size={12} />
            <span>Interactive Tech Tracks</span>
          </div>
          <div className="section-divider-line" />
        </div>
        <div className="section-header" style={{ marginBottom: '24px' }}>
          <div className="section-title-wrap">
            <h2>All Tracks</h2>
          </div>
          <span className="count-badge">{filteredTracks.length} Full Tutorials Available</span>
        </div>

        <div className="topics-grid">
          {filteredTracks.map((track) => {
            const IconComponent = iconMap[track.icon] || Code2;
            return (
              <Link 
                key={track.id} 
                to={`/track/${track.id}`} 
                className="topic-card"
                style={{ '--accent-color': track.color }}
              >
                <div className="card-top">
                  <div className="topic-icon-wrap" style={{ backgroundColor: `${track.color}15`, color: track.color }}>
                    <IconComponent size={28} />
                  </div>
                  <span className="topic-badge">{track.badge}</span>
                </div>

                <div className="card-body">
                  <h3 className="topic-title">{track.name}</h3>
                  <p className="topic-tagline">{track.tagline}</p>
                </div>

                <div className="card-footer">
                  <span className="qa-count">{track.totalLessons} In-Depth Modules</span>
                  <div className="explore-action">
                    <span>Open Tutorial</span>
                    <ArrowRight size={16} className="arrow-icon" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredTracks.length === 0 && (
          <div className="no-results">
            <Sparkles size={40} />
            <h3>No matching tracks found</h3>
            <p>Try searching for "AWS", "GraphQL", "Spring", "Node", or "Python".</p>
          </div>
        )}
      </main>

      {/* ⑥ Quick Jump Bar */}
      <section className="quick-matrix-section">
        <div className="matrix-card">
          <h3>Quick Track Jump</h3>
          <div className="quick-links-row">
            {tracksConfig.map(t => (
              <Link
                key={t.id}
                to={`/track/${t.id}`}
                className="quick-pill"
                style={{ '--pill-color': t.color }}
              >
                <span className="dot" style={{ backgroundColor: t.color }}></span>
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
