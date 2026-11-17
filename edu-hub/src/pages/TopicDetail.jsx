import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { topicsData } from '../data/topics';
import { CodeBlock, AccordionItem } from '../components/TopicComponents';
import { 
  ArrowLeft, 
  Cloud, 
  Layers, 
  Coffee, 
  Server, 
  Terminal, 
  BookOpen, 
  HelpCircle, 
  Code, 
  Share2,
  Check
} from 'lucide-react';
import './TopicDetail.css';

const iconMap = {
  Cloud: Cloud,
  Layers: Layers,
  Coffee: Coffee,
  Server: Server,
  Terminal: Terminal
};

export default function TopicDetail() {
  const { topicId } = useParams();
  const topic = topicsData[topicId];
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons' | 'interview'
  const [openAccordion, setOpenAccordion] = useState(0); // first item open
  const [copiedLink, setCopiedLink] = useState(false);

  if (!topic) {
    return (
      <div className="not-found-container">
        <h2>Topic Not Found</h2>
        <p>The requested topic could not be found.</p>
        <Link to="/" className="back-home-btn">← Back to Edu Hub Home</Link>
      </div>
    );
  }

  const IconComponent = iconMap[topic.icon] || Code;
  const allTopicKeys = Object.keys(topicsData);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="topic-page">
      {/* Top Navigation Bar */}
      <header className="topic-nav-bar">
        <Link to="/" className="nav-back-link">
          <ArrowLeft size={18} />
          <span>Edu Hub Home</span>
        </Link>
        <div className="topic-quick-switch">
          <span>Switch Topic:</span>
          {allTopicKeys.map(k => {
            const t = topicsData[k];
            return (
              <Link 
                key={k} 
                to={`/topic/${k}`} 
                className={`switch-badge ${k === topicId ? 'active' : ''}`}
                style={k === topicId ? { borderColor: t.color, color: t.color } : {}}
              >
                {t.name}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Hero Header */}
      <div className="topic-hero" style={{ '--topic-accent': topic.color }}>
        <div className="topic-hero-content">
          <div className="hero-top-row">
            <div className="topic-hero-icon" style={{ backgroundColor: `${topic.color}20`, color: topic.color }}>
              <IconComponent size={36} />
            </div>
            <div className="hero-meta">
              <span className="hero-badge">{topic.badge}</span>
              <h1 className="hero-topic-title">{topic.title}</h1>
            </div>
          </div>
          <p className="hero-desc">{topic.overview}</p>

          <div className="hero-actions">
            <div className="tab-pill-group">
              <button 
                className={`tab-btn ${activeTab === 'lessons' ? 'active' : ''}`}
                onClick={() => setActiveTab('lessons')}
              >
                <BookOpen size={16} />
                <span>Architecture & Core Concepts ({topic.sections.length})</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
                onClick={() => setActiveTab('interview')}
              >
                <HelpCircle size={16} />
                <span>Interview Q&A Prep ({topic.interviewQA.length})</span>
              </button>
            </div>

            <button className="share-btn" onClick={handleShare}>
              {copiedLink ? <Check size={16} className="text-green" /> : <Share2 size={16} />}
              <span>{copiedLink ? 'URL Copied!' : 'Share Track'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="topic-main-container">
        {activeTab === 'lessons' && (
          <div className="lessons-view">
            {topic.sections.map((section, idx) => (
              <article key={section.id} className="lesson-card">
                <div className="lesson-header">
                  <div className="lesson-index-badge">0{idx + 1}</div>
                  <div className="lesson-title-area">
                    <span className={`difficulty-pill ${section.difficulty.toLowerCase()}`}>
                      {section.difficulty}
                    </span>
                    <h2>{section.title}</h2>
                    <p className="lesson-summary">{section.summary}</p>
                  </div>
                </div>

                <div className="lesson-body">
                  <div className="markdown-prose">
                    {section.content.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return <h3 key={pIdx}>{paragraph.replace('### ', '')}</h3>;
                      }
                      if (paragraph.startsWith('- ')) {
                        return (
                          <ul key={pIdx} className="bullet-list">
                            {paragraph.split('\n').map((li, liIdx) => (
                              <li key={liIdx}>{li.replace('- ', '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={pIdx}>{paragraph}</p>;
                    })}
                  </div>

                  {section.codeSnippet && (
                    <div className="lesson-code-section">
                      <div className="code-label">
                        <Code size={14} />
                        <span>Production Reference Code</span>
                      </div>
                      <CodeBlock code={section.codeSnippet} language={topic.id === 'python' ? 'python' : topic.id === 'springboot' ? 'java' : 'javascript'} />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="interview-view">
            <div className="interview-intro">
              <h2>Top Technical Interview Questions & Model Answers</h2>
              <p>Curated for Senior / Staff Engineer technical rounds focusing on internal mechanics and trade-offs.</p>
            </div>

            <div className="accordion-list">
              {topic.interviewQA.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  question={item.q}
                  answer={item.a}
                  isOpen={openAccordion === idx}
                  onToggle={() => setOpenAccordion(openAccordion === idx ? -1 : idx)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer Nav */}
      <footer className="topic-footer">
        <Link to="/" className="footer-home-link">← Return to All Tracks</Link>
        <p className="footer-brand">Edu Hub • Engineered for high-impact technical mastery</p>
      </footer>
    </div>
  );
}
