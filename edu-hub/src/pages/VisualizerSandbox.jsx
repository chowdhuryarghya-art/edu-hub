import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Send, 
  Cpu, 
  Terminal, 
  Layers, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import './VisualizerSandbox.css';

export default function VisualizerSandbox() {
  const [activeTab, setActiveTab] = useState('eventloop'); // 'eventloop' | 'graphql'

  // Event Loop Visualizer State
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [activePhase, setActivePhase] = useState(null);

  const eventLoopSteps = [
    {
      title: '1. Synchronous Main Thread Execution',
      phase: 'sync',
      desc: 'Synchronous statements execute immediately on the V8 Call Stack.',
      log: 'Console: 1: Sync Script Start',
      codeHighlight: 'console.log("1: Sync Script Start");'
    },
    {
      title: '2. Enqueuing Timers, Microtasks & Immediates',
      phase: 'sync',
      desc: 'setTimeout scheduled in Timers Phase; setImmediate in Check Phase; nextTick enqueued in Microtask queue.',
      log: 'Scheduled: setTimeout(0), setImmediate(), process.nextTick(), Promise.then()',
      codeHighlight: 'setTimeout(cb, 0); setImmediate(cb); process.nextTick(cb);'
    },
    {
      title: '3. Synchronous Script Completion',
      phase: 'sync',
      desc: 'Synchronous script ends. Call stack becomes empty.',
      log: 'Console: 2: Sync Script End',
      codeHighlight: 'console.log("2: Sync Script End");'
    },
    {
      title: '4. Microtask Queue 1: process.nextTick()',
      phase: 'nextTick',
      desc: 'Before the event loop enters any phase, nextTick queue is drained with highest priority.',
      log: 'Console: 3: process.nextTick callback',
      codeHighlight: 'process.nextTick(() => console.log("3: process.nextTick callback"));'
    },
    {
      title: '5. Microtask Queue 2: Promise Jobs',
      phase: 'promises',
      desc: 'Promise .then() microtasks execute immediately after nextTick.',
      log: 'Console: 4: Promise.resolve callback',
      codeHighlight: 'Promise.resolve().then(() => console.log("4: Promise.resolve callback"));'
    },
    {
      title: '6. Event Loop Phase: Timers',
      phase: 'timers',
      desc: 'Libuv checks the timer min-heap for expired setTimeout/setInterval timers.',
      log: 'Console: 5: setTimeout(0) callback',
      codeHighlight: 'setTimeout(() => console.log("5: setTimeout(0) callback"), 0);'
    },
    {
      title: '7. Event Loop Phase: Check (setImmediate)',
      phase: 'check',
      desc: 'Check phase executes setImmediate() callbacks.',
      log: 'Console: 6: setImmediate callback',
      codeHighlight: 'setImmediate(() => console.log("6: setImmediate callback"));'
    }
  ];

  const handleNextStep = () => {
    if (currentStep < eventLoopSteps.length) {
      const step = eventLoopSteps[currentStep];
      setLogs(prev => [...prev, step.log]);
      setActivePhase(step.phase);
      setCurrentStep(s => s + 1);
    }
  };

  const handleResetLoop = () => {
    setCurrentStep(0);
    setLogs([]);
    setActivePhase(null);
  };

  // GraphQL Mock Playground State
  const [graphqlQuery, setGraphqlQuery] = useState(`query GetUserWithPosts {
  user(id: "usr_101") {
    name
    role
    email
    posts(limit: 2) {
      title
      likes
    }
  }
}`);

  const [graphqlResponse, setGraphqlResponse] = useState(JSON.stringify({
    data: {
      user: {
        name: "Alex Vance",
        role: "STAFF_ENGINEER",
        email: "alex@enterprise.io",
        posts: [
          { title: "Mastering Libuv Internals", likes: 342 },
          { title: "Optimizing DynamoDB Single-Table Design", likes: 512 }
        ]
      }
    }
  }, null, 2));

  const handleRunQuery = () => {
    try {
      if (graphqlQuery.includes('posts')) {
        setGraphqlResponse(JSON.stringify({
          data: {
            user: {
              name: "Alex Vance",
              role: "STAFF_ENGINEER",
              email: "alex@enterprise.io",
              posts: [
                { title: "Mastering Libuv Internals", likes: 342 },
                { title: "Optimizing DynamoDB Single-Table Design", likes: 512 }
              ]
            }
          }
        }, null, 2));
      } else {
        setGraphqlResponse(JSON.stringify({
          data: {
            user: {
              name: "Alex Vance",
              role: "STAFF_ENGINEER",
              email: "alex@enterprise.io"
            }
          }
        }, null, 2));
      }
    } catch (e) {
      setGraphqlResponse(JSON.stringify({ errors: [{ message: "Syntax error in GraphQL query" }] }, null, 2));
    }
  };

  return (
    <div className="visualizer-container">
      {/* Top Nav */}
      <header className="visualizer-header">
        <div className="v-header-left">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} />
            <span>Edu Hub</span>
          </Link>
          <div className="v-title-wrap">
            <Cpu className="v-icon" size={22} />
            <h1>Interactive Visualizers & Sandboxes</h1>
          </div>
        </div>

        <div className="v-tab-group">
          <button 
            className={`v-tab ${activeTab === 'eventloop' ? 'active' : ''}`}
            onClick={() => setActiveTab('eventloop')}
          >
            <Cpu size={15} />
            <span>Node.js Libuv Event Loop</span>
          </button>
          <button 
            className={`v-tab ${activeTab === 'graphql' ? 'active' : ''}`}
            onClick={() => setActiveTab('graphql')}
          >
            <Layers size={15} />
            <span>GraphQL Query IDE</span>
          </button>
        </div>
      </header>

      {/* Libuv Event Loop Interactive Visualizer */}
      {activeTab === 'eventloop' && (
        <main className="event-loop-visualizer">
          <div className="sim-toolbar">
            <div className="sim-status">
              <span>Step {currentStep} of {eventLoopSteps.length}</span>
              <span className="step-hint">{eventLoopSteps[currentStep]?.title || 'Execution complete!'}</span>
            </div>
            <div className="sim-actions">
              <button className="sim-btn reset" onClick={handleResetLoop}>
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>
              <button 
                className="sim-btn primary" 
                onClick={handleNextStep}
                disabled={currentStep >= eventLoopSteps.length}
              >
                <Play size={15} />
                <span>{currentStep === 0 ? 'Start Execution' : 'Step Next →'}</span>
              </button>
            </div>
          </div>

          <div className="visualizer-grid">
            {/* Visual Queue Architecture */}
            <div className="diagram-panel">
              <h3>Libuv Phase Architecture</h3>
              <div className="phase-stack">
                <div className={`phase-card ${activePhase === 'sync' ? 'active pulse' : ''}`}>
                  <span className="phase-name">1. V8 Call Stack (Synchronous Code)</span>
                  <span className="phase-desc">Executes top-level script</span>
                </div>

                <div className="microtasks-row">
                  <div className={`microtask-card ${activePhase === 'nextTick' ? 'active pulse' : ''}`}>
                    <span>⚡ process.nextTick() Queue</span>
                  </div>
                  <div className={`microtask-card ${activePhase === 'promises' ? 'active pulse' : ''}`}>
                    <span>🔮 Promise Microtasks</span>
                  </div>
                </div>

                <div className="loop-ring">
                  <div className={`loop-phase ${activePhase === 'timers' ? 'active' : ''}`}>
                    <span>⏱️ 1. Timers (setTimeout)</span>
                  </div>
                  <div className={`loop-phase ${activePhase === 'pending' ? 'active' : ''}`}>
                    <span>📥 2. Pending Callbacks</span>
                  </div>
                  <div className={`loop-phase ${activePhase === 'poll' ? 'active' : ''}`}>
                    <span>🌐 3. Poll Phase (I/O & Sockets)</span>
                  </div>
                  <div className={`loop-phase ${activePhase === 'check' ? 'active' : ''}`}>
                    <span>⚡ 4. Check (setImmediate)</span>
                  </div>
                  <div className={`loop-phase ${activePhase === 'close' ? 'active' : ''}`}>
                    <span>🚪 5. Close Callbacks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Execution Console Output */}
            <div className="console-panel">
              <div className="console-header">
                <Terminal size={15} />
                <span>Node.js stdout Execution Console</span>
              </div>
              <div className="console-body">
                {logs.length === 0 ? (
                  <span className="console-empty">Click "Start Execution" to step through the event loop.</span>
                ) : (
                  logs.map((l, i) => (
                    <div key={i} className="log-line">
                      <span className="log-idx">[{i + 1}]</span>
                      <span className="log-text">{l}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* GraphQL Mock Sandbox */}
      {activeTab === 'graphql' && (
        <main className="graphql-sandbox">
          <div className="sandbox-header-bar">
            <span>Mock GraphQL Endpoint: <code>https://api.eduhub.internal/graphql</code></span>
            <button className="run-query-btn" onClick={handleRunQuery}>
              <Play size={14} />
              <span>Execute Query</span>
            </button>
          </div>

          <div className="sandbox-split-view">
            <div className="editor-side">
              <div className="side-title">GraphQL Document / Query</div>
              <textarea
                className="graphql-textarea"
                value={graphqlQuery}
                onChange={e => setGraphqlQuery(e.target.value)}
                rows={12}
              />
            </div>

            <div className="response-side">
              <div className="side-title">JSON Execution Response</div>
              <pre className="graphql-response-pre">
                <code>{graphqlResponse}</code>
              </pre>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
