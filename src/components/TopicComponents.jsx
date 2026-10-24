import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export function CodeBlock({ code, language = 'javascript' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-header">
        <span className="code-lang">{language}</span>
        <button className="copy-btn" onClick={handleCopy} title="Copy Code">
          {copied ? <Check size={14} className="copied" /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`accordion-card ${isOpen ? 'open' : ''}`}>
      <button className="accordion-trigger" onClick={onToggle}>
        <div className="accordion-q">
          <span className="q-badge">Q</span>
          <span className="q-text">{question}</span>
        </div>
        <div className="accordion-icon">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      {isOpen && (
        <div className="accordion-content">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
