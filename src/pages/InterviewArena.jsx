import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { questionsBank } from '../data/interviewBank';
import { tracksConfig } from '../data/tracks';
import { useUserPreference } from '../context/UserPreferenceContext';
import { 
  ArrowLeft, 
  HelpCircle, 
  Award, 
  Clock, 
  Eye, 
  ChevronRight, 
  Flame, 
  Shuffle, 
  SlidersHorizontal, 
  ChevronDown,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import './InterviewArena.css';

export default function InterviewArena() {
  const [searchParams] = useSearchParams();
  const { activePersona, openPreferenceModal } = useUserPreference();
  
  const queryTrack = searchParams.get('track');
  const [selectedTrack, setSelectedTrack] = useState(() => {
    if (queryTrack) return queryTrack;
    return activePersona ? 'curated' : 'all';
  });

  const [mode, setMode] = useState('flashcards'); // 'flashcards' | 'mock'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes per question in mock mode
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [ratings, setRatings] = useState(() => {
    try {
      const saved = localStorage.getItem('eduhub_interview_ratings');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('eduhub_interview_ratings', JSON.stringify(ratings));
    } catch (e) {
      console.warn('Failed to save ratings', e);
    }
  }, [ratings]);

  // Load and filter questions
  useEffect(() => {
    let list = [];
    if (selectedTrack === 'curated' && activePersona) {
      list = questionsBank.filter(q => activePersona.recommendedTracks.includes(q.trackId));
      if (list.length === 0) list = [...questionsBank];
    } else if (selectedTrack === 'all') {
      list = [...questionsBank];
    } else {
      list = questionsBank.filter(q => q.trackId === selectedTrack);
    }
    
    setQuestions(list);
    setCurrentIndex(0);
    setIsAnswerRevealed(false);
    setTimer(120);
    setIsTimerRunning(mode === 'mock');
  }, [selectedTrack, mode, activePersona]);

  // Timer loop for Mock mode
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setIsAnswerRevealed(true);
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const currentQ = questions[currentIndex] || questionsBank[0];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setIsAnswerRevealed(false);
      setTimer(120);
      setIsTimerRunning(mode === 'mock');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setIsAnswerRevealed(false);
      setTimer(120);
      setIsTimerRunning(mode === 'mock');
    }
  };

  const handleShuffle = () => {
    setQuestions(prev => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsAnswerRevealed(false);
    setTimer(120);
  };

  const handleRate = (rating) => {
    if (currentQ) {
      setRatings(prev => ({ ...prev, [currentQ.id]: rating }));
    }
    handleNext();
  };

  const exportAnkiDeck = () => {
    const tsvHeader = "#separator:tab\n#html:true\n#tags column:3\n";
    const rows = questions.map(q => {
      const front = `<b>[${q.trackName} - ${q.difficulty}]</b><br/>${q.question}`;
      const back = `${q.answer}<br/><br/><b>Key Points:</b><ul>${q.keyPoints.map(kp => `<li>${kp}</li>`).join('')}</ul>`;
      const tags = `eduhub ${q.trackId} ${q.difficulty.toLowerCase()}`;
      return `${front.replace(/\t/g, ' ')}\t${back.replace(/\t/g, ' ')}\t${tags}`;
    }).join('\n');
    const blob = new Blob([tsvHeader + rows], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eduhub-anki-${selectedTrack}-deck.tsv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const displayedTrackTabs = (activePersona && !showAllTracks)
    ? tracksConfig.filter(t => activePersona.recommendedTracks.includes(t.id))
    : tracksConfig;

  const progressPercent = questions.length ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  return (
    <div className="arena-page">
      {/* Top Navbar (Matching Playground Navbar) */}
      <header className="arena-navbar">
        <div className="arena-nav-left">
          <Link to="/" className="arena-back-btn" title="Back to Edu Hub Portal">
            <ArrowLeft size={16} />
            <span>Edu Hub</span>
          </Link>
          <div className="arena-brand">
            <Flame className="arena-flame-icon" size={18} />
            <span>Interview &amp; Concept Mastery Arena</span>
          </div>
        </div>

        <div className="arena-nav-right">
          <div className="mode-selector">
            {activePersona && (
              <button
                className="mode-btn persona-mode-btn"
                onClick={openPreferenceModal}
                style={{
                  borderColor: activePersona.color || '#f59e0b',
                  color: activePersona.color || '#f59e0b',
                  background: `${activePersona.color || '#f59e0b'}18`
                }}
                title="Change your learning track preference"
              >
                <SlidersHorizontal size={13} />
                <span>Track: {activePersona.shortTitle}</span>
                <ChevronDown size={11} />
              </button>
            )}

            <button 
              className={`mode-btn ${mode === 'flashcards' ? 'active' : ''}`}
              onClick={() => { setMode('flashcards'); setIsTimerRunning(false); }}
            >
              <HelpCircle size={14} />
              <span>Interactive Flashcards</span>
            </button>
            <button 
              className={`mode-btn ${mode === 'mock' ? 'active' : ''}`}
              onClick={() => { setMode('mock'); setIsTimerRunning(true); setTimer(120); }}
            >
              <Clock size={14} />
              <span>Timed Mock Mode (2m)</span>
            </button>
            <button
              className="mode-btn anki-export-btn"
              onClick={exportAnkiDeck}
              title="Export flashcards to Anki TSV format"
            >
              <Award size={14} />
              <span>Export Anki (.tsv)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Filter and Stats Bar */}
      <div className="arena-filter-bar">
        <div className="arena-track-tabs">
          {activePersona && (
            <button 
              className={`arena-tab-item ${selectedTrack === 'curated' ? 'active' : ''}`}
              onClick={() => setSelectedTrack('curated')}
              style={selectedTrack === 'curated' ? { color: activePersona.color, borderColor: activePersona.color } : {}}
            >
              🎯 Curated ({activePersona.shortTitle})
            </button>
          )}

          {displayedTrackTabs.map(t => (
            <button
              key={t.id}
              className={`arena-tab-item ${selectedTrack === t.id ? 'active' : ''}`}
              onClick={() => setSelectedTrack(t.id)}
              style={selectedTrack === t.id ? { color: t.color, borderColor: t.color } : {}}
            >
              {t.name}
            </button>
          ))}

          {activePersona && (
            <button 
              className="arena-tab-item"
              onClick={() => setShowAllTracks(s => !s)}
            >
              {showAllTracks ? '✕ Curated Only' : '🌐 All Categories'}
            </button>
          )}

          {(!activePersona || showAllTracks) && (
            <button 
              className={`arena-tab-item ${selectedTrack === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedTrack('all')}
            >
              All Questions ({questionsBank.length})
            </button>
          )}
        </div>

        <button className="arena-shuffle-btn" onClick={handleShuffle} title="Shuffle Questions">
          <Shuffle size={14} />
          <span>Shuffle</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="arena-progress-bar-wrap">
        <div className="arena-progress-fill" style={{ width: `${progressPercent}%` }}></div>
      </div>

      {/* Card Stage */}
      {questions.length > 0 ? (
        <main className="arena-card-stage">
          <div className="arena-question-card">
            {/* Card Meta */}
            <div className="arena-card-meta">
              <div className="arena-meta-badges">
                <span className="arena-track-tag">
                  {currentQ.trackName}
                </span>
                <span className="arena-category-tag">{currentQ.category}</span>
                <span className={`arena-diff-tag diff-${currentQ.difficulty?.toLowerCase()}`}>
                  {currentQ.difficulty}
                </span>
              </div>

              {mode === 'mock' && (
                <div className={`mock-timer-pill ${timer <= 30 ? 'critical' : ''}`}>
                  <Clock size={13} />
                  <span>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                </div>
              )}
            </div>

            {/* Question Text */}
            <div className="arena-question-body">
              <span className="arena-q-label">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <h2 className="arena-q-title">{currentQ.question}</h2>
            </div>

            {/* Answer Stage */}
            {isAnswerRevealed ? (
              <div className="arena-answer-section">
                <div className="arena-answer-header">
                  <CheckCircle2 size={18} className="arena-ok-icon" />
                  <h3>Structured Answer &amp; Architectural Rationale</h3>
                </div>
                <p className="arena-answer-text">{currentQ.answer}</p>

                <div className="arena-key-points-box">
                  <div className="arena-key-points-header">
                    <Sparkles size={14} />
                    <span>Key Points &amp; Keywords</span>
                  </div>
                  <ul className="arena-key-points-list">
                    {currentQ.keyPoints.map((kp, idx) => (
                      <li key={idx}>{kp}</li>
                    ))}
                  </ul>
                </div>

                {/* Self Evaluation Rating */}
                <div className="arena-self-eval-box">
                  <span className="arena-eval-label">How well did you know this?</span>
                  <div className="arena-eval-btn-group">
                    <button className="arena-eval-btn again" onClick={() => handleRate('Again')}>
                      <span>Again</span>
                      <small>&lt; 1 min</small>
                    </button>
                    <button className="arena-eval-btn hard" onClick={() => handleRate('Hard')}>
                      <span>Hard</span>
                      <small>Review soon</small>
                    </button>
                    <button className="arena-eval-btn good" onClick={() => handleRate('Good')}>
                      <span>Good</span>
                      <small>Mastered</small>
                    </button>
                    <button className="arena-eval-btn easy" onClick={() => handleRate('Easy')}>
                      <span>Easy</span>
                      <small>Very confident</small>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="arena-reveal-cta-wrap">
                <button 
                  className="arena-reveal-btn"
                  onClick={() => { setIsAnswerRevealed(true); setIsTimerRunning(false); }}
                >
                  <Eye size={18} />
                  <span>Reveal Model Answer &amp; Key Points</span>
                </button>
              </div>
            )}

            {/* Bottom Nav Controls */}
            <div className="arena-card-bottom">
              <button 
                className="arena-nav-step-btn" 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
              >
                Previous
              </button>

              <span className="arena-step-counter">
                {currentIndex + 1} / {questions.length}
              </span>

              <button 
                className="arena-nav-step-btn primary" 
                onClick={handleNext} 
                disabled={currentIndex === questions.length - 1}
              >
                <span>Next Question</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </main>
      ) : (
        <div className="arena-empty-state">
          <p>No questions found for this track.</p>
        </div>
      )}
    </div>
  );
}
