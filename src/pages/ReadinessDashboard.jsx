import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { tracksConfig } from '../data/tracks';
import { 
  ArrowLeft, 
  Activity, 
  Award, 
  CheckCircle2, 
  Flame, 
  TrendingUp, 
  BookOpen, 
  Clock,
  Sparkles
} from 'lucide-react';
import './ReadinessDashboard.css';

export default function ReadinessDashboard() {
  const [readinessScores, setReadinessScores] = useState({
    aws: 85,
    graphql: 78,
    springboot: 92,
    nodejs: 88,
    python: 80
  });

  const handleScoreAdjust = (id, delta) => {
    setReadinessScores(prev => {
      const current = prev[id] || 70;
      const updated = Math.min(100, Math.max(0, current + delta));
      return { ...prev, [id]: updated };
    });
  };

  const avgScore = Math.round(
    Object.values(readinessScores).reduce((a, b) => a + b, 0) / Object.values(readinessScores).length
  );

  return (
    <div className="readiness-page-container">
      {/* Header */}
      <header className="readiness-header">
        <div className="rd-header-left">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} />
            <span>Edu Hub</span>
          </Link>
          <div className="rd-title-wrap">
            <Activity className="rd-icon" size={22} />
            <h1>Senior Engineering Readiness Matrix</h1>
          </div>
        </div>
      </header>

      {/* Top Summary Cards */}
      <div className="readiness-summary-grid">
        <div className="summary-card overall">
          <div className="summary-card-inner">
            <div className="summary-meta">
              <span className="summary-label">Overall Competency Score</span>
              <h2 className="score-val">{avgScore}%</h2>
              <span className="status-tag ready">
                <CheckCircle2 size={13} />
                <span>Senior / Staff Ready</span>
              </span>
            </div>
            <div className="score-ring">
              <Award size={48} className="award-icon" />
            </div>
          </div>
        </div>

        <div className="summary-card streak">
          <div className="summary-card-inner">
            <div className="summary-meta">
              <span className="summary-label">Revision Velocity</span>
              <h2 className="score-val">140+</h2>
              <span className="sub-label">Interactive topics & code patterns</span>
            </div>
            <Flame size={48} className="flame-icon" />
          </div>
        </div>
      </div>

      {/* Individual Track Competency Breakdown */}
      <main className="tracks-readiness-panel">
        <div className="panel-header">
          <h3>Domain-Level Competency Breakdown</h3>
          <span className="panel-subtitle">Self-assess your confidence across all 5 technical domains:</span>
        </div>

        <div className="tracks-bars-list">
          {tracksConfig.map(track => {
            const score = readinessScores[track.id] || 75;
            return (
              <div key={track.id} className="track-bar-card">
                <div className="t-bar-info">
                  <div className="t-bar-title-wrap">
                    <span className="t-dot" style={{ backgroundColor: track.color }}></span>
                    <span className="t-name">{track.name}</span>
                  </div>
                  <div className="score-controls">
                    <button className="score-adj-btn" onClick={() => handleScoreAdjust(track.id, -5)} title="Decrease confidence">-</button>
                    <span className="score-badge" style={{ color: track.color }}>{score}%</span>
                    <button className="score-adj-btn" onClick={() => handleScoreAdjust(track.id, 5)} title="Increase confidence">+</button>
                  </div>
                </div>

                <div className="bar-track-bg">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${score}%`, backgroundColor: track.color }}
                  ></div>
                </div>

                <div className="track-quick-actions">
                  <Link to={`/track/${track.id}`} className="t-action-link">
                    <BookOpen size={13} />
                    <span>Tutorial ({track.totalLessons} modules)</span>
                  </Link>
                  <Link to={`/interview-arena?track=${track.id}`} className="t-action-link">
                    <Clock size={13} />
                    <span>Mock Interview Q&A</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
