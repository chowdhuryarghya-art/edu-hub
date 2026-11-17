import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tracksConfig } from '../data/tracks';
import { useUserPreference } from '../context/UserPreferenceContext';
import { 
  ArrowLeft, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  GraduationCap,
  Layers,
  Cloud,
  Coffee,
  Server,
  Terminal,
  BookOpen
} from 'lucide-react';
import './TutorialViewer.css';

const iconMap = {
  Cloud: Cloud,
  Layers: Layers,
  Coffee: Coffee,
  Server: Server,
  Terminal: Terminal
};

export default function TutorialViewer() {
  const { trackId } = useParams();
  const { activePersona } = useUserPreference();
  const [showAllTracks, setShowAllTracks] = useState(false);
  const track = tracksConfig.find(t => t.id === trackId) || tracksConfig[0];
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const IconComponent = iconMap[track.icon] || BookOpen;

  const displayedTracks = (activePersona && !showAllTracks)
    ? tracksConfig.filter(t => activePersona.recommendedTracks.includes(t.id))
    : tracksConfig;

  return (
    <div className={`tutorial-viewer-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Top Global Control Bar */}
      <header className="viewer-navbar">
        <div className="nav-left">
          <Link to="/" className="home-btn" title="Back to Edu Hub Portal">
            <ArrowLeft size={18} />
            <span>Edu Hub</span>
          </Link>
          <div className="track-title-indicator">
            <span className="track-dot" style={{ backgroundColor: track.color }}></span>
            <span className="track-name">{track.name} Tutorial</span>
          </div>
        </div>

        {/* Quick Track Switcher Pills */}
        <div className="track-switcher">
          {displayedTracks.map((t) => (
            <Link
              key={t.id}
              to={`/track/${t.id}`}
              className={`track-pill ${t.id === track.id ? 'active' : ''}`}
              style={t.id === track.id ? { borderColor: t.color, color: '#fff', background: `${t.color}25` } : {}}
            >
              {t.name}
            </Link>
          ))}
          {activePersona && (
            <button
              className="track-pill"
              onClick={() => setShowAllTracks(s => !s)}
              style={{ opacity: 0.65, fontSize: '0.72rem', background: 'transparent' }}
            >
              {showAllTracks ? '✕ Curated' : '+ More'}
            </button>
          )}
        </div>

        {/* Window controls */}
        <div className="nav-right">
          <button 
            className="control-action-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span>{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
          </button>

          <a 
            href={`/tutorials/${track.fileName}`} 
            target="_blank" 
            rel="noreferrer" 
            className="control-action-btn primary"
            title="Open in standalone tab"
          >
            <ExternalLink size={16} />
            <span>Open Standalone</span>
          </a>
        </div>
      </header>

      {/* Embedded Full Tutorial Iframe */}
      <main className="viewer-frame-container">
        <iframe
          key={track.id}
          src={`/tutorials/${track.fileName}`}
          title={`${track.name} Full Interactive Tutorial`}
          className="tutorial-iframe"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </main>
    </div>
  );
}
