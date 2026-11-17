import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cheatSheetsData } from '../data/interviewBank';
import { tracksConfig } from '../data/tracks';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  CheckSquare, 
  Square, 
  FileText,
  Search,
  Sparkles,
  Grid,
  List,
  RotateCcw
} from 'lucide-react';
import './CheatSheetBuilder.css';

export default function CheatSheetBuilder() {
  const allTrackKeys = Object.keys(cheatSheetsData);
  const [selectedTracks, setSelectedTracks] = useState(allTrackKeys);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'compact'
  const [copied, setCopied] = useState(false);

  const toggleTrack = (key) => {
    if (selectedTracks.includes(key)) {
      if (selectedTracks.length > 1) {
        setSelectedTracks(selectedTracks.filter(k => k !== key));
      }
    } else {
      setSelectedTracks([...selectedTracks, key]);
    }
  };

  const selectAll = () => setSelectedTracks(allTrackKeys);
  const selectSingle = (key) => setSelectedTracks([key]);

  const handlePrint = () => {
    window.print();
  };

  const generateMarkdownString = () => {
    let md = `# Edu Hub — Senior Engineering Revision & Cheat Sheet Matrix\n\n`;
    md += `*Generated for rapid interview recall and high-yield offline reference.*\n\n---\n\n`;

    selectedTracks.forEach(key => {
      const data = cheatSheetsData[key];
      if (!data) return;
      md += `## 📌 ${data.track}\n\n`;
      data.sections.forEach(sec => {
        md += `### ${sec.title}\n\n`;
        sec.items.forEach(item => {
          md += `- ${item}\n`;
        });
        md += `\n`;
      });
      md += `---\n\n`;
    });
    return md;
  };

  const copyMarkdown = async () => {
    const md = generateMarkdownString();
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy to clipboard', e);
    }
  };

  const exportMarkdown = () => {
    const md = generateMarkdownString();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eduhub-engineering-cheatsheet.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Helper to format text with code blocks and bold headers
  const renderFormattedItem = (text) => {
    // If text has `:` as delimiter for term, bold the first part
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} className="cs-inline-code">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) {
      return selectedTracks;
    }
    const q = searchQuery.toLowerCase();
    return selectedTracks.filter(key => {
      const data = cheatSheetsData[key];
      if (!data) return false;
      if (data.track.toLowerCase().includes(q)) return true;
      return data.sections.some(sec => 
        sec.title.toLowerCase().includes(q) ||
        sec.items.some(it => it.toLowerCase().includes(q))
      );
    });
  }, [selectedTracks, searchQuery]);

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
            <div>
              <h1>Engineering Cheat Sheets &amp; Revision Matrix</h1>
              <p className="cs-subtitle">High-yield concepts, syntax blueprints, and architectural quick-reference cards</p>
            </div>
          </div>
        </div>

        <div className="cs-actions">
          <button className="action-btn" onClick={copyMarkdown} title="Copy markdown to clipboard">
            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy (.md)'}</span>
          </button>
          <button className="action-btn" onClick={exportMarkdown} title="Download markdown file">
            <Download size={16} />
            <span>Export (.md)</span>
          </button>
          <button className="action-btn primary" onClick={handlePrint} title="Print or save as PDF">
            <Printer size={16} />
            <span>Print / PDF</span>
          </button>
        </div>
      </header>

      {/* Control & Filter Toolbar */}
      <div className="cs-filter-bar no-print">
        <div className="cs-filter-top-row">
          <div className="cs-search-box">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search concepts, commands, or data structures (e.g. JOIN, Pointers, ACID, Event Loop)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>

          <div className="cs-view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Matrix Grid View"
            >
              <Grid size={15} />
              <span>Grid</span>
            </button>
            <button 
              className={`view-btn ${viewMode === 'compact' ? 'active' : ''}`}
              onClick={() => setViewMode('compact')}
              title="Compact List View"
            >
              <List size={15} />
              <span>Compact</span>
            </button>
          </div>
        </div>

        <div className="cs-track-selection-row">
          <div className="track-selection-header">
            <span className="filter-label">Filter Curriculum Tracks ({selectedTracks.length} of {allTrackKeys.length} selected):</span>
            <div className="selection-quick-actions">
              <button className="quick-action-link" onClick={selectAll}>Select All</button>
              <span className="divider">•</span>
              <button className="quick-action-link" onClick={() => setSelectedTracks(['sql', 'python', 'cpp-dsa'])}>Core 3</button>
            </div>
          </div>

          <div className="track-checkboxes">
            {tracksConfig.map(t => {
              const isChecked = selectedTracks.includes(t.id);
              const hasData = Boolean(cheatSheetsData[t.id]);
              if (!hasData) return null;

              return (
                <button
                  key={t.id}
                  className={`checkbox-chip ${isChecked ? 'checked' : ''}`}
                  onClick={() => toggleTrack(t.id)}
                  style={isChecked ? { borderColor: t.color, background: `${t.color}22` } : {}}
                >
                  {isChecked ? <CheckSquare size={15} color={t.color} /> : <Square size={15} />}
                  <span style={isChecked ? { color: '#f8fafc', fontWeight: 600 } : {}}>{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Printable Document Sheet */}
      <main className={`printable-sheet ${viewMode}`}>
        <div className="sheet-watermark">
          <div className="watermark-brand">
            <Sparkles size={18} color="#38bdf8" />
            <h2>EDU HUB · SENIOR ENGINEERING REVISION MATRIX</h2>
          </div>
          <p>Curated rapid interview review, systems blueprints &amp; syntax formulas • Offline Ready</p>
        </div>

        {filteredTracks.length === 0 ? (
          <div className="no-results-box">
            <FileText size={36} className="no-res-icon" />
            <h3>No cheat sheet entries match "{searchQuery}"</h3>
            <p>Try clearing your search query or enabling more curriculum tracks above.</p>
            <button className="reset-btn" onClick={() => { setSearchQuery(''); selectAll(); }}>
              <RotateCcw size={14} /> Reset Filters
            </button>
          </div>
        ) : (
          <div className={`sheet-grid ${viewMode}`}>
            {filteredTracks.map(key => {
              const data = cheatSheetsData[key];
              if (!data) return null;
              return (
                <div key={key} className="sheet-track-block" style={{ '--track-accent': data.color }}>
                  <div className="sheet-track-header">
                    <div className="track-header-left">
                      <span className="bullet-indicator" style={{ backgroundColor: data.color }}></span>
                      <h3>{data.track}</h3>
                    </div>
                    <button 
                      className="isolate-btn no-print" 
                      onClick={() => selectSingle(key)}
                      title="Focus on this track only"
                    >
                      Focus
                    </button>
                  </div>

                  <div className="sections-list">
                    {data.sections.map((sec, sIdx) => {
                      // If search query is active, filter items inside section
                      const matchedItems = searchQuery.trim() 
                        ? sec.items.filter(it => it.toLowerCase().includes(searchQuery.toLowerCase()) || sec.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        : sec.items;

                      if (matchedItems.length === 0) return null;

                      return (
                        <div key={sIdx} className="sec-box">
                          <h4>{sec.title}</h4>
                          <ul>
                            {matchedItems.map((item, iIdx) => (
                              <li key={iIdx}>
                                {renderFormattedItem(item)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
