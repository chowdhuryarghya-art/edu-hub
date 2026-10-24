import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cheatSheetsData } from '../data/interviewBank';
import { tracksConfig } from '../data/tracks';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  CheckSquare, 
  Square, 
  FileText,
  Sparkles,
  Layers
} from 'lucide-react';
import './CheatSheetBuilder.css';

export default function CheatSheetBuilder() {
  const allTrackKeys = Object.keys(cheatSheetsData);
  const [selectedTracks, setSelectedTracks] = useState(allTrackKeys);

  const toggleTrack = (key) => {
    if (selectedTracks.includes(key)) {
      if (selectedTracks.length > 1) {
        setSelectedTracks(selectedTracks.filter(k => k !== key));
      }
    } else {
      setSelectedTracks([...selectedTracks, key]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cheatsheet-page-container">
      {/* Top Header - Hidden during print */}
      <header className="cheatsheet-header no-print">
        <div className="cs-header-left">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} />
            <span>Edu Hub</span>
          </Link>
          <div className="cs-title-wrap">
            <FileText className="cs-icon" size={22} />
            <h1>Engineering Cheat Sheet & Summary Generator</h1>
          </div>
        </div>

        <div className="cs-actions">
          <button className="print-btn primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </header>

      {/* Track Selector Bar - Hidden during print */}
      <div className="cs-filter-bar no-print">
        <span className="filter-label">Select technologies to include in cheat sheet:</span>
        <div className="track-checkboxes">
          {tracksConfig.map(t => {
            const isChecked = selectedTracks.includes(t.id);
            return (
              <button
                key={t.id}
                className={`checkbox-chip ${isChecked ? 'checked' : ''}`}
                onClick={() => toggleTrack(t.id)}
                style={isChecked ? { borderColor: t.color, color: '#ffffff' } : {}}
              >
                {isChecked ? <CheckSquare size={16} color={t.color} /> : <Square size={16} />}
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Printable Document Sheet */}
      <main className="printable-sheet">
        <div className="sheet-watermark">
          <h2>EDU HUB · SENIOR ARCHITECT QUICK REVISION MATRIX</h2>
          <p>Generated for offline study and quick interview recall • Confidential</p>
        </div>

        <div className="sheet-grid">
          {selectedTracks.map(key => {
            const data = cheatSheetsData[key];
            if (!data) return null;
            return (
              <div key={key} className="sheet-track-block" style={{ '--track-accent': data.color }}>
                <div className="sheet-track-header">
                  <span className="bullet-indicator" style={{ backgroundColor: data.color }}></span>
                  <h3>{data.track}</h3>
                </div>

                <div className="sections-list">
                  {data.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="sec-box">
                      <h4>{sec.title}</h4>
                      <ul>
                        {sec.items.map((item, iIdx) => (
                          <li key={iIdx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
