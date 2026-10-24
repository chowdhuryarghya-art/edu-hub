import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { questionsBank } from '../data/interviewBank';
import { tracksConfig } from '../data/tracks';
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  HelpCircle, 
  Award, 
  Clock, 
  Eye, 
  EyeOff,
  ChevronRight,
  Flame,
  Shuffle
} from 'lucide-react';
import './InterviewArena.css';

export default function InterviewArena() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTrack = searchParams.get('track') || 'all';

  const [selectedTrack, setSelectedTrack] = useState(initialTrack);
  const [mode, setMode] = useState('flashcards'); // 'flashcards' | 'mock'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes per question in mock mode
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [ratings, setRatings] = useState({}); // { [qId]: 'easy' | 'good' | 'hard' }

  // Load and filter questions
  useEffect(() => {
    let list = selectedTrack === 'all' 
      ? [...questionsBank] 
      : questionsBank.filter(q => q.trackId === selectedTrack);
    
    setQuestions(list);
    setCurrentIndex(0);
    setIsAnswerRevealed(false);
    setTimer(120);
    setIsTimerRunning(mode === 'mock');
  }, [selectedTrack, mode]);

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
    setRatings(prev => ({ ...prev, [currentQ.id]: rating }));
    handleNext();
  };

  const progressPercent = questions.length ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  return (
    <div className="arena-container">
      {/* Top Nav */}
      <header className="arena-header">
        <div className="header-left">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} />
            <span>Edu Hub</span>
          </Link>
          <div className="arena-title-wrap">
            <Flame className="arena-icon" size={22} />
            <h1>Senior Interview Simulation Arena</h1>
          </div>
        </div>

        <div className="mode-selector">
          <button 
            className={`mode-btn ${mode === 'flashcards' ? 'active' : ''}`}
            onClick={() => { setMode('flashcards'); setIsTimerRunning(false); }}
          >
            <HelpCircle size={15} />
            <span>Interactive Flashcards</span>
          </button>
          <button 
            className={`mode-btn ${mode === 'mock' ? 'active' : ''}`}
            onClick={() => { setMode('mock'); setIsTimerRunning(true); setTimer(120); }}
          >
            <Clock size={15} />
            <span>Timed Mock Mode (2m)</span>
          </button>
        </div>
      </header>

      {/* Filter and Stats Bar */}
      <div className="filter-stats-bar">
        <div className="track-tabs">
          <button 
            className={`tab-item ${selectedTrack === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedTrack('all')}
          >
            All Tracks ({questionsBank.length})
          </button>
          {tracksConfig.map(t => (
            <button
              key={t.id}
              className={`tab-item ${selectedTrack === t.id ? 'active' : ''}`}
              onClick={() => setSelectedTrack(t.id)}
              style={selectedTrack === t.id ? { color: t.color, borderColor: t.color } : {}}
            >
              {t.name}
            </button>
          ))}
        </div>

        <button className="shuffle-btn" onClick={handleShuffle} title="Shuffle Questions">
          <Shuffle size={15} />
          <span>Shuffle</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-wrap">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
      </div>

      {/* Main Flashcard / Question Area */}
      <main className="card-arena-main">
        <div className="q-index-row">
          <span className="q-number">Question {currentIndex + 1} of {questions.length}</span>
          <span className="q-track-tag" style={{ color: tracksConfig.find(t => t.id === currentQ.trackId)?.color }}>
            {currentQ.trackName} · {currentQ.category}
          </span>
          <span className="difficulty-badge">{currentQ.difficulty}</span>

          {mode === 'mock' && (
            <div className={`timer-box ${timer <= 20 ? 'urgent' : ''}`}>
              <Clock size={14} />
              <span>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
            </div>
          )}
        </div>

        <div className="question-display-box">
          <h2>{currentQ.question}</h2>
        </div>

        {/* Answer Reveal Area */}
        <div className="answer-section">
          {!isAnswerRevealed ? (
            <div className="hidden-answer-prompt">
              <p>Formulate your answer or speak it aloud before revealing model solution.</p>
              <button className="reveal-btn" onClick={() => setIsAnswerRevealed(true)}>
                <Eye size={18} />
                <span>Reveal Model Answer & Key Points</span>
              </button>
            </div>
          ) : (
            <div className="revealed-answer-box">
              <div className="revealed-header">
                <CheckCircle size={18} className="success-icon" />
                <h3>Senior / Architect Model Answer</h3>
                <button className="hide-btn" onClick={() => setIsAnswerRevealed(false)}>
                  <EyeOff size={14} />
                  <span>Hide</span>
                </button>
              </div>
              <p className="answer-text">{currentQ.answer}</p>

              <div className="key-points-box">
                <h4>🎯 High-Impact Talking Points:</h4>
                <ul>
                  {currentQ.keyPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Self Rating in Flashcard Mode */}
              <div className="rating-prompt">
                <span>How well did you know this?</span>
                <div className="rating-buttons">
                  <button className="rate-btn hard" onClick={() => handleRate('hard')}>Hard 😓</button>
                  <button className="rate-btn good" onClick={() => handleRate('good')}>Good 👍</button>
                  <button className="rate-btn easy" onClick={() => handleRate('easy')}>Mastered 🚀</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Bottom Controls */}
        <div className="arena-nav-controls">
          <button className="nav-btn" onClick={handlePrev} disabled={currentIndex === 0}>
            ← Previous
          </button>
          <button className="nav-btn primary" onClick={handleNext} disabled={currentIndex === questions.length - 1}>
            <span>Next Question</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}
