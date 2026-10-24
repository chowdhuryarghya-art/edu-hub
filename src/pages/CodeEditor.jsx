import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Copy,
  CheckCheck,
  Terminal,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  Code2,
  AlertTriangle,
  RefreshCw,
  ServerCrash,
  Globe,
  Eye,
  Zap,
} from 'lucide-react';
import './CodeEditor.css';

/* ─── Language Configs ──────────────────────────────────────────── */
const LANGUAGES = [
  {
    id: 'java',
    label: 'Java',
    icon: '☕',
    color: '#6DB33F',
    prerequisites: [
      {
        name: 'Java JDK 17+',
        checkKey: 'javac',
        checkHint: 'javac -version',
        installUrl: 'https://adoptium.net/temurin/releases/',
        description: 'Eclipse Temurin OpenJDK — free LTS build for all platforms',
      },
      {
        name: 'Maven (optional)',
        checkKey: null,
        checkHint: 'mvn -version',
        installUrl: 'https://maven.apache.org/download.cgi',
        description: 'Only needed for multi-module / Spring Boot projects',
      },
    ],
    defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");

        // Fibonacci
        int a = 0, b = 1;
        System.out.print("Fibonacci: ");
        for (int i = 0; i < 10; i++) {
            System.out.print(a + " ");
            int tmp = a + b; a = b; b = tmp;
        }
        System.out.println();
    }
}`,
  },
  {
    id: 'node',
    label: 'Node.js',
    icon: '⬡',
    color: '#339933',
    prerequisites: [
      {
        name: 'Node.js 18 LTS+',
        checkKey: 'node',
        checkHint: 'node -v',
        installUrl: 'https://nodejs.org/en/download',
        description: 'Official Node.js LTS — includes npm',
      },
    ],
    defaultCode: `// Node.js example
const { EventEmitter } = require('events');

async function fetchData() {
  return new Promise(resolve =>
    setTimeout(() => resolve({ message: 'Hello from Node.js!' }), 50)
  );
}

async function main() {
  const data = await fetchData();
  console.log(data.message);

  const nums = [1, 2, 3, 4, 5];
  console.log('Doubled:', nums.map(n => n * 2));

  const emitter = new EventEmitter();
  emitter.on('greet', name => console.log(\`Hi, \${name}!\`));
  emitter.emit('greet', 'World');
}

main();`,
  },
  {
    id: 'python',
    label: 'Python',
    icon: '🐍',
    color: '#3776AB',
    prerequisites: [
      {
        name: 'Python 3.10+',
        checkKey: 'python',
        checkHint: 'python3 --version',
        installUrl: 'https://www.python.org/downloads/',
        description: 'Official Python runtime — includes pip',
      },
    ],
    defaultCode: `import asyncio
from dataclasses import dataclass
from typing import List

@dataclass
class Student:
    name: str
    grade: float

    def letter_grade(self) -> str:
        if self.grade >= 90: return 'A'
        if self.grade >= 80: return 'B'
        if self.grade >= 70: return 'C'
        return 'F'

async def process(students: List[Student]):
    for s in students:
        await asyncio.sleep(0)
        print(f"{s.name}: {s.grade} -> {s.letter_grade()}")

students = [Student("Alice", 95), Student("Bob", 82), Student("Carol", 67)]
asyncio.run(process(students))

squares = [x**2 for x in range(1, 6)]
print("Squares:", squares)`,
  },
  {
    id: 'graphql',
    label: 'GraphQL',
    icon: '◈',
    color: '#E535AB',
    prerequisites: [
      {
        name: 'Node.js 18 LTS+',
        checkKey: 'node',
        checkHint: 'node -v',
        installUrl: 'https://nodejs.org/en/download',
        description: 'GraphQL JS runs on Node — required for graphql-js & Apollo',
      },
    ],
    defaultCode: `// GraphQL resolver simulation — runs as plain Node.js
// Install for real server: npm install graphql @apollo/server

const users = [
  { id: '1', name: 'Alice Chen',  email: 'alice@example.com',  role: 'ADMIN' },
  { id: '2', name: 'Bob Smith',   email: 'bob@example.com',    role: 'DEVELOPER' },
  { id: '3', name: 'Carol White', email: 'carol@example.com',  role: 'VIEWER' },
];

const resolvers = {
  Query: {
    users: () => users,
    user:  (_, { id }) => users.find(u => u.id === id),
  },
};

function execute(queryName, args = {}) {
  const resolver = resolvers.Query[queryName];
  if (!resolver) throw new Error(\`No resolver for "\${queryName}"\`);
  return resolver(null, args);
}

console.log("=== users ===");
execute('users').forEach(u => console.log(\`  \${u.id}: \${u.name} [\${u.role}]\`));

console.log("\\n=== user(id: '2') ===");
console.log(JSON.stringify(execute('user', { id: '2' }), null, 2));`,
  },
];

/* ─── HTML Editor config (separate — no server needed) ──────────── */
const HTML_LANG = {
  id: 'html',
  label: 'HTML',
  icon: '🌐',
  color: '#e34c26',
  isHtml: true,
  prerequisites: [],
};

const HTML_DEFAULT = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Edit the HTML, CSS, and JS panes — the preview updates on Run.</p>
  <button id="btn">Click me</button>
  <p id="out"></p>
</body>
</html>`,
  css: `body {
  font-family: system-ui, sans-serif;
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
  background: #f8fafc;
  color: #1e293b;
}

h1 {
  color: #e34c26;
}

button {
  padding: 8px 18px;
  background: #e34c26;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
}

button:hover {
  background: #c0392b;
}`,
  js: `document.getElementById('btn').addEventListener('click', () => {
  const out = document.getElementById('out');
  out.textContent = 'Button clicked at ' + new Date().toLocaleTimeString();
  out.style.color = '#e34c26';
  out.style.fontWeight = 'bold';
});`,
};

/* ─── JS Scratchpad config (browser-side, no server) ────────────── */
const JS_LANG = {
  id: 'js-scratchpad',
  label: 'JS Scratchpad',
  icon: '⚡',
  color: '#f0db4f',
};

const JS_DEFAULT = `// Browser JavaScript Scratchpad
// console.log, warn, error and expression results appear in the output panel.
// Runs entirely in your browser — no Node.js required.

// ── Basic output ──────────────────────────────────────
console.log('Hello from the JS Scratchpad!');
console.log('Current time:', new Date().toLocaleTimeString());

// ── Array & object exploration ────────────────────────
const users = [
  { name: 'Alice', role: 'Admin',     score: 98 },
  { name: 'Bob',   role: 'Developer', score: 74 },
  { name: 'Carol', role: 'Viewer',    score: 61 },
];

const admins = users.filter(u => u.score > 70);
console.log('High scorers:', admins.map(u => u.name));

// ── Async / Promise demo ──────────────────────────────
async function fetchMock() {
  return new Promise(resolve =>
    setTimeout(() => resolve({ status: 'ok', data: [1, 2, 3] }), 100)
  );
}

fetchMock().then(res => console.log('Async result:', JSON.stringify(res)));

// ── Error example ─────────────────────────────────────
try {
  null.property;
} catch (e) {
  console.error('Caught:', e.message);
}

// ── Expression result (last evaluated value) ─────────
[1, 2, 3, 4, 5].reduce((a, b) => a + b, 0);
`;

/* ─── Runtime check ─────────────────────────────────────────────── */
async function checkRuntimes() {
  const res = await fetch('/check');
  if (!res.ok) throw new Error('Runner server not reachable');
  return (await res.json()).runtimes; // { java, javac, node, python, ... }
}

/* ─── Code execution ─────────────────────────────────────────────── */
async function executeCode(languageId, code) {
  const res = await fetch('/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language: languageId, code }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Server error ${res.status}`);
  }
  return res.json(); // { stdout, stderr, exitCode }
}

/* ─── PrerequisitePanel ─────────────────────────────────────────── */
function PrerequisitePanel({ lang, runtimes, runtimesLoading, runtimesError, onRecheck }) {
  const [expanded, setExpanded] = useState(true);

  const getStatus = (checkKey) => {
    if (runtimesLoading) return 'loading';
    if (runtimesError)   return 'unknown';
    if (!checkKey)       return 'optional';
    return runtimes?.[checkKey] ? 'installed' : 'missing';
  };

  const hasAnyMissing = lang.prerequisites.some(p =>
    p.checkKey && getStatus(p.checkKey) === 'missing'
  );

  return (
    <div className={`prereq-panel ${hasAnyMissing ? 'has-missing' : ''}`}>
      <button className="prereq-header" onClick={() => setExpanded(e => !e)}>
        <span className="prereq-title">
          {hasAnyMissing
            ? <AlertTriangle size={14} className="prereq-icon-warn" />
            : <CheckCircle2 size={14} className="prereq-icon-ok" />
          }
          System Prerequisites — {lang.label}
          {hasAnyMissing && <span className="prereq-missing-badge">Missing</span>}
        </span>
        <span className="prereq-header-right">
          <button
            className="recheck-btn"
            onClick={(e) => { e.stopPropagation(); onRecheck(); }}
            title="Re-check installed runtimes"
          >
            <RefreshCw size={12} />
            Re-check
          </button>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {expanded && (
        <div className="prereq-body">
          <ul className="prereq-list">
            {lang.prerequisites.map((p) => {
              const status = getStatus(p.checkKey);
              return (
                <li key={p.name} className={`prereq-item status-${status}`}>
                  <div className="prereq-item-row">
                    <span className="prereq-status-icon">
                      {status === 'loading'   && <Loader2 size={13} className="spin-icon" />}
                      {status === 'installed' && <CheckCircle2 size={13} style={{ color: '#10b981' }} />}
                      {status === 'missing'   && <XCircle size={13} style={{ color: '#ef4444' }} />}
                      {status === 'optional'  && <CheckCircle2 size={13} style={{ color: '#6b7280' }} />}
                      {status === 'unknown'   && <AlertTriangle size={13} style={{ color: '#f59e0b' }} />}
                    </span>
                    <span className="prereq-name">{p.name}</span>
                    <span className={`prereq-badge ${status}`}>
                      {status === 'loading'   ? 'Checking…' :
                       status === 'installed' ? 'Installed' :
                       status === 'missing'   ? 'Not found' :
                       status === 'optional'  ? 'Optional'  : 'Unknown'}
                    </span>
                    <code className="prereq-cmd">{p.checkHint}</code>
                    {(status === 'missing' || status === 'optional') && (
                      <a href={p.installUrl} target="_blank" rel="noreferrer" className="prereq-link">
                        Install <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                  <p className="prereq-desc">{p.description}</p>
                </li>
              );
            })}
          </ul>

          {runtimesError && (
            <div className="prereq-server-warn">
              <ServerCrash size={13} />
              <span>Runner server not reachable — start it with <code>npm run server</code></span>
            </div>
          )}

          {!runtimesError && !hasAnyMissing && !runtimesLoading && (
            <div className="prereq-all-ok">
              <CheckCircle2 size={13} />
              <span>All required runtimes detected — editor is ready.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── JsScratchpad sub-component ───────────────────────────────── */
function JsScratchpad() {
  const [code, setCode]     = useState(JS_DEFAULT);
  const [logs, setLogs]     = useState([]);
  const [ran, setRan]       = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef         = useRef(null);
  const logsEndRef          = useRef(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleRun = useCallback(() => {
    setLogs([]);
    setRan(true);

    // Build an srcdoc that intercepts all console methods and postMessages them back
    const srcdoc = `<!DOCTYPE html><html><body><script>
(function () {
  const LEVELS = ['log','warn','error','info','debug'];
  LEVELS.forEach(level => {
    const orig = console[level].bind(console);
    console[level] = function (...args) {
      orig(...args);
      parent.postMessage({ type: 'console', level, args: args.map(a => {
        try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); }
        catch { return String(a); }
      })}, '*');
    };
  });
  window.onerror = (msg, src, line, col, err) => {
    parent.postMessage({ type: 'console', level: 'error', args: [String(err || msg)] }, '*');
  };
  window.onunhandledrejection = (e) => {
    parent.postMessage({ type: 'console', level: 'error', args: ['Unhandled rejection: ' + e.reason] }, '*');
  };

  // Capture last expression value
  let __result__;
  try {
    __result__ = eval(${JSON.stringify(code)});
    if (__result__ !== undefined) {
      parent.postMessage({ type: 'console', level: 'result', args: [
        typeof __result__ === 'object' ? JSON.stringify(__result__, null, 2) : String(__result__)
      ]}, '*');
    }
  } catch(e) {
    parent.postMessage({ type: 'console', level: 'error', args: [e.toString()] }, '*');
  }
})();
<\/script></body></html>`;

    // Listen for messages from the iframe
    const collected = [];
    const handler = (e) => {
      if (e.data?.type !== 'console') return;
      collected.push({ level: e.data.level, text: e.data.args.join(' ') });
      setLogs([...collected]);
    };
    window.addEventListener('message', handler);

    // Create a throwaway iframe, run the code, clean up after 5 s
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.style.display = 'none';
    frame.srcdoc = srcdoc;
    document.body.appendChild(frame);

    setTimeout(() => {
      window.removeEventListener('message', handler);
      document.body.removeChild(frame);
    }, 5000);
  }, [code]);

  // Ctrl+Enter
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleRun]);

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = e.target;
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    setCodes_local(el, start, end);
  };

  // local helper — avoid closure staleness
  const setCodes_local = (el, start, end) => {
    setCode(prev => {
      const next = prev.slice(0, start) + '    ' + prev.slice(end);
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + 4; });
      return next;
    });
  };

  const handleReset = () => { setCode(JS_DEFAULT); setLogs([]); setRan(false); };
  const handleCopy  = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const handleClear = () => { setLogs([]); setRan(false); };

  const LOG_STYLE = {
    log:    { color: '#e2e8f0', prefix: '❯' },
    info:   { color: '#93c5fd', prefix: 'ℹ' },
    warn:   { color: '#fbbf24', prefix: '⚠' },
    error:  { color: '#f87171', prefix: '✕' },
    debug:  { color: '#a78bfa', prefix: '◎' },
    result: { color: '#34d399', prefix: '←' },
  };

  return (
    <div className="html-editor-root">
      {/* Top bar */}
      <div className="html-editor-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="lang-dot" style={{ backgroundColor: JS_LANG.color, width: 8, height: 8, borderRadius: '50%', flexShrink: 0 }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>JavaScript Scratchpad</span>
          <span className="panel-hint" style={{ marginLeft: 4 }}>Ctrl+Enter to run</span>
        </div>
        <div className="panel-actions">
          <button className="editor-action-btn" onClick={handleReset}><RotateCcw size={13} /><span>Reset</span></button>
          <button className="editor-action-btn" onClick={handleCopy}>
            {copied ? <CheckCheck size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button className="run-btn" onClick={handleRun}><Play size={14} /><span>Run</span></button>
        </div>
      </div>

      {/* Split: editor left, console output right */}
      <div className="html-editor-body">
        {/* Code */}
        <div className="html-code-pane">
          <textarea
            ref={textareaRef}
            className="code-textarea"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={handleTabKey}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
          />
        </div>

        {/* Console output */}
        <div className="js-console-pane">
          <div className="html-preview-header">
            <Terminal size={13} />
            <span>Console Output</span>
            <span className="panel-hint">Browser JS engine</span>
            {logs.length > 0 && (
              <button className="editor-action-btn" style={{ marginLeft: 'auto' }} onClick={handleClear}>
                <RotateCcw size={12} /><span>Clear</span>
              </button>
            )}
          </div>
          <div className="js-console-body">
            {!ran && (
              <div className="output-empty">
                <Zap size={28} className="output-empty-icon" />
                <p>Click <strong>Run</strong> or press <kbd>Ctrl+Enter</kbd> to execute.</p>
                <p className="output-empty-sub">Runs in your browser — no Node.js needed. <code>console.log</code>, <code>warn</code>, <code>error</code> all captured.</p>
              </div>
            )}
            {ran && logs.length === 0 && (
              <div className="output-empty">
                <p style={{ color: 'var(--text-muted)' }}>(no output)</p>
              </div>
            )}
            {logs.map((entry, i) => {
              const s = LOG_STYLE[entry.level] || LOG_STYLE.log;
              return (
                <div key={i} className="js-log-line" style={{ '--log-color': s.color }}>
                  <span className="js-log-prefix">{s.prefix}</span>
                  <pre className="js-log-text">{entry.text}</pre>
                </div>
              );
            })}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main CodeEditor Page ──────────────────────────────────────── */
/* ─── HtmlEditor sub-component ─────────────────────────────────── */
function HtmlEditor() {
  const HTML_PANES = ['html', 'css', 'js'];
  const PANE_LABELS = { html: 'HTML', css: 'CSS', js: 'JavaScript' };
  const PANE_COLORS = { html: '#e34c26', css: '#264de4', js: '#f0db4f' };

  const [panes, setPanes]         = useState(HTML_DEFAULT);
  const [activePane, setActivePane] = useState('html');
  const [previewSrc, setPreviewSrc] = useState('');
  const [copied, setCopied]       = useState(false);
  const textareaRef               = useRef(null);

  // Build the srcdoc string from the three panes
  const buildSrcdoc = useCallback((p) =>
    p.html.replace(
      '</head>',
      `<style>${p.css}</style></head>`
    ).replace(
      '</body>',
      `<script>${p.js}<\/script></body>`
    ),
  []);

  // Run on mount so the preview shows immediately
  useEffect(() => {
    setPreviewSrc(buildSrcdoc(panes));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRun = useCallback(() => {
    setPreviewSrc(buildSrcdoc(panes));
  }, [panes, buildSrcdoc]);

  // Ctrl+Enter
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleRun]);

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = e.target;
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const val   = panes[activePane];
    setPanes(prev => ({ ...prev, [activePane]: val.slice(0, start) + '    ' + val.slice(end) }));
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + 4; });
  };

  const handleReset = () => {
    setPanes(HTML_DEFAULT);
    setPreviewSrc(buildSrcdoc(HTML_DEFAULT));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(panes[activePane]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="html-editor-root">
      {/* Top bar */}
      <div className="html-editor-topbar">
        <div className="html-pane-tabs">
          {HTML_PANES.map(p => (
            <button
              key={p}
              className={`html-pane-tab ${activePane === p ? 'active' : ''}`}
              style={activePane === p ? { borderColor: PANE_COLORS[p], color: PANE_COLORS[p] } : {}}
              onClick={() => { setActivePane(p); requestAnimationFrame(() => textareaRef.current?.focus()); }}
            >
              <span className="html-pane-dot" style={{ background: PANE_COLORS[p] }} />
              {PANE_LABELS[p]}
            </button>
          ))}
        </div>
        <div className="panel-actions">
          <button className="editor-action-btn" onClick={handleReset}>
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
          <button className="editor-action-btn" onClick={handleCopy}>
            {copied ? <CheckCheck size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button className="run-btn" onClick={handleRun}>
            <Play size={14} />
            <span>Run</span>
          </button>
        </div>
      </div>

      {/* Split: code textarea left, preview right */}
      <div className="html-editor-body">
        {/* Code pane */}
        <div className="html-code-pane">
          <textarea
            ref={textareaRef}
            className="code-textarea"
            value={panes[activePane]}
            onChange={e => setPanes(prev => ({ ...prev, [activePane]: e.target.value }))}
            onKeyDown={handleTabKey}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
          />
        </div>

        {/* Live preview pane */}
        <div className="html-preview-pane">
          <div className="html-preview-header">
            <Eye size={13} />
            <span>Live Preview</span>
            <span className="panel-hint">Ctrl+Enter to refresh</span>
          </div>
          <iframe
            className="html-preview-iframe"
            title="HTML Preview"
            srcDoc={previewSrc}
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Main CodeEditor Page ──────────────────────────────────────── */
export default function CodeEditor() {
  const [activeLang, setActiveLang]       = useState(LANGUAGES[0]);
  const [codes, setCodes]                 = useState(() =>
    Object.fromEntries(LANGUAGES.map(l => [l.id, l.defaultCode]))
  );
  const [output, setOutput]               = useState('');
  const [isRunning, setIsRunning]         = useState(false);
  const [runError, setRunError]           = useState(false);
  const [copied, setCopied]               = useState(false);
  const [showPrereq, setShowPrereq]       = useState(true);
  const [isHtmlMode, setIsHtmlMode]       = useState(false);
  const [isJsMode, setIsJsMode]           = useState(false);

  // Runtime check state
  const [runtimes, setRuntimes]           = useState(null);
  const [runtimesLoading, setRuntimesLoading] = useState(true);
  const [runtimesError, setRuntimesError] = useState(false);

  const textareaRef = useRef(null);

  const doCheck = useCallback(async () => {
    setRuntimesLoading(true);
    setRuntimesError(false);
    try {
      const r = await checkRuntimes();
      setRuntimes(r);
    } catch {
      setRuntimesError(true);
    } finally {
      setRuntimesLoading(false);
    }
  }, []);

  useEffect(() => { doCheck(); }, [doCheck]);

  useEffect(() => {
    if (!isHtmlMode && !isJsMode) {
      textareaRef.current?.focus();
      setOutput('');
      setRunError(false);
    }
  }, [activeLang, isHtmlMode, isJsMode]);

  const handleCodeChange = (e) =>
    setCodes(prev => ({ ...prev, [activeLang.id]: e.target.value }));

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el    = e.target;
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const val   = codes[activeLang.id];
    setCodes(prev => ({ ...prev, [activeLang.id]: val.slice(0, start) + '    ' + val.slice(end) }));
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + 4; });
  };

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput('');
    setRunError(false);
    try {
      const { stdout, stderr, exitCode } = await executeCode(activeLang.id, codes[activeLang.id]);
      const combined = [stdout, stderr].filter(Boolean).join('\n');
      setOutput(combined || '(no output)');
      setRunError(exitCode !== 0);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
      setRunError(true);
    } finally {
      setIsRunning(false);
    }
  }, [activeLang, codes]);

  const handleReset = () => {
    setCodes(prev => ({ ...prev, [activeLang.id]: activeLang.defaultCode }));
    setOutput('');
    setRunError(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codes[activeLang.id]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  useEffect(() => {
    if (isHtmlMode || isJsMode) return;
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleRun, isHtmlMode, isJsMode]);

  return (
    <div className="code-editor-page">
      {/* Navbar */}
      <header className="editor-navbar">
        <div className="editor-nav-left">
          <Link to="/" className="editor-back-btn">
            <ArrowLeft size={17} />
            <span>Edu Hub</span>
          </Link>
          <div className="editor-brand">
            <Code2 size={18} style={{ color: isHtmlMode ? HTML_LANG.color : isJsMode ? JS_LANG.color : activeLang.color }} />
            <span>Code Playground</span>
          </div>
        </div>

        <div className="lang-tabs">
          {LANGUAGES.map(lang => (
            <button
              key={lang.id}
              className={`lang-tab ${!isHtmlMode && !isJsMode && activeLang.id === lang.id ? 'active' : ''}`}
              style={!isHtmlMode && !isJsMode && activeLang.id === lang.id ? { borderColor: lang.color, color: lang.color } : {}}
              onClick={() => { setIsHtmlMode(false); setIsJsMode(false); setActiveLang(lang); }}
            >
              <span className="lang-tab-icon">{lang.icon}</span>
              {lang.label}
            </button>
          ))}
          {/* HTML tab */}
          <button
            className={`lang-tab ${isHtmlMode ? 'active' : ''}`}
            style={isHtmlMode ? { borderColor: HTML_LANG.color, color: HTML_LANG.color } : {}}
            onClick={() => { setIsHtmlMode(true); setIsJsMode(false); }}
          >
            <span className="lang-tab-icon">{HTML_LANG.icon}</span>
            {HTML_LANG.label}
          </button>
          {/* JS Scratchpad tab */}
          <button
            className={`lang-tab ${isJsMode ? 'active' : ''}`}
            style={isJsMode ? { borderColor: JS_LANG.color, color: JS_LANG.color } : {}}
            onClick={() => { setIsJsMode(true); setIsHtmlMode(false); }}
          >
            <span className="lang-tab-icon">{JS_LANG.icon}</span>
            {JS_LANG.label}
          </button>
        </div>

        <div className="editor-nav-right">
          {!isHtmlMode && !isJsMode && (
            <button
              className="prereq-toggle-btn"
              onClick={() => setShowPrereq(s => !s)}
              title="Toggle prerequisites panel"
            >
              {runtimesLoading
                ? <Loader2 size={14} className="spin-icon" />
                : runtimesError
                  ? <AlertTriangle size={14} />
                  : <CheckCircle2 size={14} />
              }
              <span>Prerequisites</span>
            </button>
          )}
          {(isHtmlMode || isJsMode) && (
            <div className="html-no-prereq-badge">
              <Globe size={13} />
              <span>Runs in browser — no install needed</span>
            </div>
          )}
        </div>
      </header>

      {/* Prerequisites Panel — only for server-run languages */}
      {!isHtmlMode && !isJsMode && showPrereq && (
        <PrerequisitePanel
          lang={activeLang}
          runtimes={runtimes}
          runtimesLoading={runtimesLoading}
          runtimesError={runtimesError}
          onRecheck={doCheck}
        />
      )}

      {/* HTML Editor — full-height split layout */}
      {isHtmlMode && <HtmlEditor />}

      {/* JS Scratchpad — browser-side JS with console capture */}
      {isJsMode && <JsScratchpad />}

      {/* Standard Editor + Output Layout for other languages */}
      {!isHtmlMode && !isJsMode && (
        <div className="editor-layout">
          {/* Code Panel */}
          <div className="editor-panel">
            <div className="panel-header">
              <div className="panel-title">
                <span className="lang-dot" style={{ backgroundColor: activeLang.color }}></span>
                <span>{activeLang.label}</span>
                <span className="panel-hint">Ctrl+Enter to run</span>
              </div>
              <div className="panel-actions">
                <button className="editor-action-btn" onClick={handleReset} title="Reset to default">
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
                <button className="editor-action-btn" onClick={handleCopy} title="Copy code">
                  {copied ? <CheckCheck size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  className={`run-btn ${isRunning ? 'running' : ''}`}
                  onClick={handleRun}
                  disabled={isRunning}
                  title="Run code (Ctrl+Enter)"
                >
                  {isRunning ? <Loader2 size={15} className="spin-icon" /> : <Play size={15} />}
                  <span>{isRunning ? 'Running…' : 'Run'}</span>
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              className="code-textarea"
              value={codes[activeLang.id]}
              onChange={handleCodeChange}
              onKeyDown={handleTabKey}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
            />
          </div>

          {/* Output Panel */}
          <div className={`output-panel ${runError ? 'has-error' : output ? 'has-output' : ''}`}>
            <div className="panel-header">
              <div className="panel-title">
                <Terminal size={14} />
                <span>Output</span>
                {output && (
                  <span className={`status-pill ${runError ? 'error' : 'success'}`}>
                    {runError
                      ? <><XCircle size={11} /> Error</>
                      : <><CheckCircle2 size={11} /> Success</>
                    }
                  </span>
                )}
              </div>
              {output && (
                <button className="editor-action-btn" onClick={() => setOutput('')}>
                  <RotateCcw size={13} />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <div className="output-content">
              {isRunning && (
                <div className="output-loading">
                  <Loader2 size={20} className="spin-icon" />
                  <span>Running {activeLang.label} on your machine…</span>
                </div>
              )}
              {!isRunning && !output && (
                <div className="output-empty">
                  <Play size={32} className="output-empty-icon" />
                  <p>Click <strong>Run</strong> or press <kbd>Ctrl+Enter</kbd> to execute your {activeLang.label} code.</p>
                  <p className="output-empty-sub">Code runs on <strong>your local machine</strong> via the edu-hub runner server.</p>
                </div>
              )}
              {!isRunning && output && (
                <pre className={`output-text ${runError ? 'error-text' : ''}`}>{output}</pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
