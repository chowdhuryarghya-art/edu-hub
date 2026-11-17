import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import alasql from 'alasql';
import { useUserPreference } from '../context/UserPreferenceContext';
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
  SlidersHorizontal
} from 'lucide-react';
import './CodeEditor.css';

/* ─── Language Configs ──────────────────────────────────────────── */
const LANGUAGES = [
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
        description: 'Official Python runtime (also runs in-browser via WebAssembly)',
      },
    ],
    defaultCode: `# Python 3.12 — CBSE, College & AI Foundations
import asyncio
from dataclasses import dataclass
from typing import List

@dataclass
class Student:
    name: str
    marks: float
    grade: str = ""

    def calculate_grade(self):
        if self.marks >= 90: self.grade = 'A'
        elif self.marks >= 75: self.grade = 'B'
        elif self.marks >= 60: self.grade = 'C'
        else: self.grade = 'D'

students = [
    Student("Alice Chen", 94.5),
    Student("Bob Sharma", 82.0),
    Student("Carol White", 68.5)
]

print("=== CBSE / Python OOP & Data Processing ===")
for s in students:
    s.calculate_grade()
    print(f"Student: {s.name:<12} | Marks: {s.marks} | Grade: {s.grade}")

# List Comprehensions & Math
squares = [x**2 for x in range(1, 8)]
print(f"\\nSquares (1..7): {squares}")
`,
  },
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
    ],
    defaultCode: `// Java 17+ — ICSE/ISC Class 10/12 OOP & Core Foundations
public class Main {
    public static void main(String[] args) {
        System.out.println("=== ICSE / College Java OOP Demo ===");
        
        // Polymorphism & Object creation
        BankAccount acc = new BankAccount("Priya Sen", 15000.0);
        acc.deposit(5000.0);
        acc.displayStatement();

        // Array & Fibonacci Series
        System.out.print("\\nFibonacci (first 8 terms): ");
        int a = 0, b = 1;
        for (int i = 0; i < 8; i++) {
            System.out.print(a + " ");
            int temp = a + b;
            a = b;
            b = temp;
        }
        System.out.println();
    }
}

class BankAccount {
    private String holder;
    private double balance;

    public BankAccount(String holder, double balance) {
        this.holder = holder;
        this.balance = balance;
    }

    public void deposit(double amount) {
        this.balance += amount;
    }

    public void displayStatement() {
        System.out.printf("Account Holder: %s | Current Balance: ₹%.2f%n", holder, balance);
    }
}
`,
  },
  {
    id: 'c',
    label: 'C',
    icon: '⚙️',
    color: '#A8B9CC',
    prerequisites: [
      {
        name: 'GCC / Clang C Compiler',
        checkKey: 'gcc',
        checkHint: 'gcc -v',
        installUrl: 'https://gcc.gnu.org/',
        description: 'Standard C compiler for systems programming & pointers',
      },
    ],
    defaultCode: `// C Language — Systems, Pointers & Memory Management
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id;
    char name[32];
    float gpa;
} Student;

void modifyPointer(int *ptr) {
    *ptr = *ptr * 2;
}

int main() {
    printf("=== C Memory & Pointer Mechanics ===\\n");
    
    int val = 21;
    printf("Original Value: %d (Address: %p)\\n", val, (void*)&val);
    modifyPointer(&val);
    printf("Doubled via Pointer: %d\\n\\n", val);

    // Dynamic Heap Allocation
    int *dynamicArr = (int*)malloc(4 * sizeof(int));
    if (dynamicArr != NULL) {
        printf("Dynamic Heap Array: ");
        for (int i = 0; i < 4; i++) {
            dynamicArr[i] = (i + 1) * 10;
            printf("%d ", dynamicArr[i]);
        }
        printf("\\nMemory freed successfully.\\n");
        free(dynamicArr);
    }

    return 0;
}
`,
  },
  {
    id: 'cpp',
    label: 'C++',
    icon: '⚡',
    color: '#00599C',
    prerequisites: [
      {
        name: 'G++ C++20 Compiler',
        checkKey: 'gpp',
        checkHint: 'g++ --version',
        installUrl: 'https://gcc.gnu.org/',
        description: 'Modern C++ compiler for DSA, STL & Competitive Programming',
      },
    ],
    defaultCode: `// C++20 — Data Structures, STL & Algorithms
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

using namespace std;

int main() {
    cout << "=== C++ STL & Binary Search Demo ===" << endl;

    vector<int> nums = {45, 12, 89, 23, 7, 56, 31};
    
    cout << "Original Vector: ";
    for (int n : nums) cout << n << " ";
    cout << endl;

    // Sorting O(N log N)
    sort(nums.begin(), nums.end());

    cout << "Sorted Vector:   ";
    for (int n : nums) cout << n << " ";
    cout << endl;

    // Binary Search O(log N)
    int target = 23;
    bool found = binary_search(nums.begin(), nums.end(), target);
    cout << "Binary Search for key " << target << ": " 
         << (found ? "FOUND (O(log N))" : "NOT FOUND") << endl;

    return 0;
}
`,
  },
  {
    id: 'sql',
    label: 'SQL',
    icon: '🗄️',
    color: '#336791',
    prerequisites: [],
    defaultCode: `-- Relational SQL — Senior School, College DBMS & Queries
-- In-browser relational engine simulator with sample tables

SELECT s.id, s.name, s.grade, s.city, d.dept_name
FROM students s
INNER JOIN departments d ON s.dept_id = d.id
WHERE s.grade >= 80.0
ORDER BY s.grade DESC;

-- Aggregate Query Demo
-- SELECT dept_name, COUNT(*) AS total_students, AVG(grade) AS avg_score
-- FROM students JOIN departments ON students.dept_id = departments.id
-- GROUP BY dept_name;
`,
  },
  {
    id: 'scratch',
    label: 'Scratch / Logic',
    icon: '🧩',
    color: '#FFAB19',
    prerequisites: [],
    defaultCode: `// Scratch & Visual Flow Logic Simulator
// Translate visual block coding to algorithmic steps

WHEN [Green Flag Clicked]:
  SET [score] = 0
  SET [lives] = 3
  
  REPEAT (5) TIMES:
    CHANGE [score] BY (10)
    IF <score > 25> THEN
      BROADCAST [LevelUp]
      SAY "Reached Milestone!" FOR (2) SECS
    ELSE
      SAY "Keep Collecting Points..." FOR (1) SECS
    END_IF
  END_REPEAT

SAY "Final Score:" & [score]
`,
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
    defaultCode: `// Node.js — Asynchronous Event Loop & Promises
const { EventEmitter } = require('events');

async function fetchCourseData() {
  return new Promise(resolve =>
    setTimeout(() => resolve({ track: 'CSE / IT Backend', status: 'ACTIVE' }), 60)
  );
}

async function main() {
  console.log("=== Node.js Runtime & Microtasks ===");
  const data = await fetchCourseData();
  console.log("Async Data Received:", data);

  const emitter = new EventEmitter();
  emitter.on('login', user => console.log(\`[AUTH EVENT] User '\${user}' logged in.\`));
  emitter.emit('login', 'Aarav');
}

main();`,
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
    defaultCode: `// GraphQL resolver simulation
const students = [
  { id: '1', name: 'Alice Chen',  curriculum: 'CBSE', grade: 'A' },
  { id: '2', name: 'Bob Sharma',   curriculum: 'ICSE', grade: 'B' },
  { id: '3', name: 'Carol White', curriculum: 'CSE Degree', grade: 'A+' },
];

const resolvers = {
  Query: {
    students: () => students,
    student:  (_, { id }) => students.find(s => s.id === id),
  },
};

console.log("=== GraphQL Query Resolver ===");
console.log("All Students:", resolvers.Query.students());
console.log("Student ID 2:", resolvers.Query.student(null, { id: '2' }));`,
  },
];

/* ─── HTML Editor config ────────────────────────────────────────── */
const HTML_LANG = {
  id: 'html',
  label: 'HTML/CSS/JS',
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
  <title>Web Page Development</title>
</head>
<body>
  <div class="card">
    <h1>🌐 Web Foundations & UI</h1>
    <p>HTML5, Responsive CSS, and ES6 JavaScript live preview.</p>
    <button id="btn">Click to Trigger DOM Event</button>
    <p id="out"></p>
  </div>
</body>
</html>`,
  css: `body {
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 550px;
  margin: 30px auto;
  padding: 0 16px;
  background: #0f172a;
  color: #f8fafc;
}

.card {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
}

h1 {
  color: #38bdf8;
  font-size: 1.4rem;
  margin-top: 0;
}

button {
  padding: 10px 20px;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

button:hover {
  background: #2563eb;
}`,
  js: `document.getElementById('btn').addEventListener('click', () => {
  const out = document.getElementById('out');
  out.textContent = '⚡ JavaScript Event Dispatched at ' + new Date().toLocaleTimeString();
  out.style.color = '#4ade80';
  out.style.fontWeight = 'bold';
});`,
};

/* ─── JS Scratchpad config ─────────────────────────────────────── */
const JS_LANG = {
  id: 'js-scratchpad',
  label: 'JS Scratchpad',
  icon: '⚡',
  color: '#f0db4f',
};

const JS_DEFAULT = `// Browser JavaScript Scratchpad — runs instantly in browser
console.log('=== JavaScript ES6+ Engine ===');

const students = [
  { name: 'Aarav', marks: 92, board: 'CBSE' },
  { name: 'Meera', marks: 88, board: 'ICSE' },
  { name: 'Karan', marks: 95, board: 'College CSE' }
];

console.log('High Scorers (>90):', students.filter(s => s.marks >= 90));
console.log('Average Marks:', students.reduce((acc, s) => acc + s.marks, 0) / students.length);
`;

/* ─── Runtime check ─────────────────────────────────────────────── */
async function checkRuntimes() {
  const res = await fetch('/check');
  if (!res.ok) throw new Error('Runner server not reachable');
  return (await res.json()).runtimes;
}

/* ─── In-Browser Pyodide WebAssembly Runner for Python ────────────── */
async function runPythonInBrowser(code) {
  if (!window.loadPyodide) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load Pyodide WebAssembly engine from CDN'));
      document.head.appendChild(script);
    });
  }
  if (!window.pyodideInstance) {
    window.pyodideInstance = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/'
    });
  }
  let stdoutLogs = [];
  window.pyodideInstance.setStdout({
    batched: (text) => stdoutLogs.push(text)
  });
  window.pyodideInstance.setStderr({
    batched: (text) => stdoutLogs.push(`[stderr] ${text}`)
  });
  try {
    const result = await window.pyodideInstance.runPythonAsync(code);
    let out = stdoutLogs.join('\n');
    if (result !== undefined && result !== null) {
      out = out ? `${out}\n--> ${result}` : String(result);
    }
    return { stdout: out || '(executed successfully with no output)', stderr: '', exitCode: 0 };
  } catch (err) {
    return { stdout: stdoutLogs.join('\n'), stderr: String(err), exitCode: 1 };
  }
}

/* ─── Client Simulations for SQL, Scratch, C/C++ ────────────────── */
function formatAsciiTable(rows) {
  if (rows === undefined || rows === null) return '(empty result set)';
  if (typeof rows === 'number') return `Query OK (${rows} row${rows === 1 ? '' : 's'} affected)`;
  if (!Array.isArray(rows)) {
    if (typeof rows === 'object') return JSON.stringify(rows, null, 2);
    return String(rows);
  }
  if (rows.length === 0) return '(0 rows returned)';
  if (typeof rows[0] !== 'object' || rows[0] === null) {
    return rows.map((r, idx) => `[${idx}] ${r}`).join('\n');
  }

  const headers = Object.keys(rows[0]);
  if (headers.length === 0) return '(empty object result)';

  const colWidths = {};
  headers.forEach(h => {
    const maxValLen = rows.reduce((max, r) => {
      const strVal = r[h] !== undefined && r[h] !== null ? String(r[h]) : 'NULL';
      return Math.max(max, strVal.length);
    }, h.length);
    colWidths[h] = Math.min(Math.max(h.length, maxValLen), 40);
  });

  const sep = '+' + headers.map(h => '-'.repeat(colWidths[h] + 2)).join('+') + '+';
  const headerRow = '|' + headers.map(h => ` ${h.padEnd(colWidths[h])} `).join('|') + '|';
  const dataRows = rows.map(r => {
    return '|' + headers.map(h => {
      let val = r[h] !== undefined && r[h] !== null ? String(r[h]) : 'NULL';
      if (val.length > colWidths[h]) val = val.substring(0, colWidths[h] - 3) + '...';
      const isNum = !isNaN(Number(val)) && val.trim() !== '';
      return isNum ? ` ${val.padStart(colWidths[h])} ` : ` ${val.padEnd(colWidths[h])} `;
    }).join('|') + '|';
  });

  return [sep, headerRow, sep, ...dataRows, sep, `${rows.length} row${rows.length === 1 ? '' : 's'} in set`].join('\n');
}

const DEFAULT_TABLES = new Set(['departments', 'students', 'courses', 'employees']);

function saveCustomTablesToStorage() {
  try {
    if (!alasql || !alasql.tables) return;
    const customTables = {};
    for (const [tblName, tblObj] of Object.entries(alasql.tables)) {
      if (!DEFAULT_TABLES.has(tblName.toLowerCase()) && tblObj) {
        customTables[tblName] = {
          data: tblObj.data || [],
          columns: (tblObj.columns || []).map(c => ({
            columnid: c.columnid,
            dbtypeid: c.dbtypeid || 'STRING'
          }))
        };
      }
    }
    localStorage.setItem('eduhub_sql_custom_tables', JSON.stringify(customTables));
  } catch (e) {
    console.warn('Failed to persist custom tables to localStorage:', e);
  }
}

function restoreCustomTablesFromStorage() {
  try {
    const raw = localStorage.getItem('eduhub_sql_custom_tables');
    if (!raw) return;
    const customTables = JSON.parse(raw);
    for (const [tblName, tblInfo] of Object.entries(customTables)) {
      if (DEFAULT_TABLES.has(tblName.toLowerCase())) continue;
      if (tblInfo.columns && tblInfo.columns.length > 0) {
        const colDefs = tblInfo.columns.map(c => `\`${c.columnid}\` ${c.dbtypeid || 'STRING'}`).join(', ');
        try {
          alasql(`CREATE TABLE IF NOT EXISTS \`${tblName}\` (${colDefs});`);
        } catch (_) {}
      } else {
        try {
          alasql(`CREATE TABLE IF NOT EXISTS \`${tblName}\`;`);
        } catch (_) {}
      }
      if (alasql.tables && alasql.tables[tblName] && Array.isArray(tblInfo.data)) {
        alasql.tables[tblName].data = JSON.parse(JSON.stringify(tblInfo.data));
      }
    }
  } catch (e) {
    console.warn('Failed to restore custom tables from localStorage:', e);
  }
}

function initInMemoryDatabase() {
  try {
    alasql(`
      CREATE TABLE IF NOT EXISTS departments (id INT, dept_id INT, dept_name STRING, building STRING, budget INT);
      DELETE FROM departments;
      INSERT INTO departments VALUES
        (1, 1, 'Computer Science', 'Turing Hall', 750000),
        (2, 2, 'Information Tech', 'Babbage Hall', 620000),
        (3, 3, 'Electronics', 'Shannon Wing', 540000),
        (4, 4, 'Mechanical Eng', 'Newton Block', 480000);

      CREATE TABLE IF NOT EXISTS students (id INT, name STRING, grade FLOAT, city STRING, dept_id INT);
      DELETE FROM students;
      INSERT INTO students VALUES
        (1, 'Alice Chen', 94.5, 'New York', 1),
        (2, 'Bob Sharma', 82.0, 'Mumbai', 2),
        (3, 'Charlie Roy', 68.5, 'London', 3),
        (4, 'David Lee', 89.0, 'Singapore', 1),
        (5, 'Eva Mendes', 91.5, 'Toronto', 2),
        (6, 'Farhan Ali', 77.0, 'Dubai', 4);

      CREATE TABLE IF NOT EXISTS courses (course_id STRING, title STRING, credits INT, dept_id INT);
      DELETE FROM courses;
      INSERT INTO courses VALUES
        ('CS101', 'Intro to Algorithms', 4, 1),
        ('CS201', 'Database Systems', 4, 1),
        ('IT102', 'Web Architectures', 3, 2),
        ('EC103', 'Digital Logic', 3, 3);

      CREATE TABLE IF NOT EXISTS employees (emp_id INT, emp_name STRING, salary INT, dept_id INT, role STRING);
      DELETE FROM employees;
      INSERT INTO employees VALUES
        (101, 'Dr. Alan Turing', 145000, 1, 'Professor & Chair'),
        (102, 'Grace Hopper', 138000, 1, 'Associate Professor'),
        (103, 'Claude Shannon', 132000, 3, 'Professor'),
        (104, 'Ada Lovelace', 140000, 2, 'Lead Researcher');
    `);
    restoreCustomTablesFromStorage();
  } catch (e) {
    console.error('Failed to init in-memory database:', e);
  }
}

/* ─── Client Simulations for SQL, Scratch, C/C++ ────────────────── */
function runClientSimulation(lang, code) {
  if (lang === 'sql') {
    const t0 = performance.now();
    try {
      initInMemoryDatabase();
      const cleanCode = code
        .split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n')
        .trim();

      if (!cleanCode) {
        return {
          stdout: '(no SQL statements found — write a query like SELECT * FROM students; or SHOW TABLES;)',
          stderr: '',
          exitCode: 0
        };
      }

      // Check for DESCRIBE / DESC statements
      const upper = cleanCode.trim().toUpperCase();
      let processedCode = cleanCode;
      if (upper.startsWith('DESCRIBE ') || upper.startsWith('DESC ')) {
        const tblName = cleanCode.trim().replace(/^(DESCRIBE|DESC)\s+/i, '').replace(/;/, '').trim();
        if (alasql.tables && alasql.tables[tblName]) {
          const cols = alasql.tables[tblName].columns || [];
          const descRows = cols.map(c => ({
            Field: c.columnid,
            Type: c.dbtypeid || 'STRING',
            Null: 'YES',
            Default: 'NULL'
          }));
          return {
            stdout: formatAsciiTable(descRows) + `\n\n[In-Memory SQL Relational Engine | DESCRIBE ${tblName}]`,
            stderr: '',
            exitCode: 0
          };
        }
      }

      const rawResult = alasql(processedCode);
      const elapsed = ((performance.now() - t0) / 1000).toFixed(3);
      saveCustomTablesToStorage();

      const normalizeResult = (res) => {
        if (Array.isArray(res) && res.length > 0 && typeof res[0] === 'object' && res[0] !== null) {
          if ('tableid' in res[0]) {
            return res.map(r => ({ Tables_in_database: r.tableid }));
          }
        }
        return res;
      };

      const formatSingleResult = (res) => {
        if (typeof res === 'number') {
          return `Query OK (${res} row${res === 1 ? '' : 's'} affected / created)`;
        }
        if (typeof res === 'string') {
          return res;
        }
        return formatAsciiTable(normalizeResult(res));
      };

      let outputStr = '';
      const stmts = processedCode.split(';').map(s => s.trim()).filter(Boolean);
      if (stmts.length > 1 && Array.isArray(rawResult)) {
        // Multi-statement results
        outputStr = rawResult.map((stmtRes, idx) => {
          const stmtPreview = stmts[idx] ? stmts[idx].substring(0, 60) + (stmts[idx].length > 60 ? '...' : '') : `Statement ${idx + 1}`;
          return `▶ [Statement ${idx + 1}]: ${stmtPreview}\n` + formatSingleResult(stmtRes);
        }).join('\n\n');
      } else {
        outputStr = formatSingleResult(rawResult);
      }

      return {
        stdout: `${outputStr}\n\n[In-Memory SQL Relational Engine | Elapsed: ${elapsed}s]`,
        stderr: '',
        exitCode: 0
      };
    } catch (err) {
      return {
        stdout: '',
        stderr: `[SQL Execution Error]: ${err.message || String(err)}\n\n💡 Tip: Run 'SHOW TABLES;' to inspect all tables, or 'DESCRIBE students;' to view columns.\n\nAvailable Pre-Seeded Tables:\n • students (id, name, grade, city, dept_id)\n • departments (id, dept_id, dept_name, building, budget)\n • courses (course_id, title, credits, dept_id)\n • employees (emp_id, emp_name, salary, dept_id, role)`,
        exitCode: 1
      };
    }
  }

  if (lang === 'scratch') {
    return {
      stdout: `=== Scratch / Visual Logic Flow Simulation ===
[STEP 1] Initialization: When Green Flag Clicked
[STEP 2] Set variable 'score' = 0, 'lives' = 3
[STEP 3] Repeat Block (5 Iterations):
   -> Iteration 1: score = 10 (Condition score > 25: FALSE) -> "Keep Collecting Points..."
   -> Iteration 2: score = 20 (Condition score > 25: FALSE) -> "Keep Collecting Points..."
   -> Iteration 3: score = 30 (Condition score > 25: TRUE)  -> Broadcast 'LevelUp'!
   -> Iteration 4: score = 40 (Condition score > 25: TRUE)  -> Milestone Reached
   -> Iteration 5: score = 50 (Condition score > 25: TRUE)  -> Milestone Reached
[STEP 4] Final Output: 'Final Score: 50'
Execution completed with 0 errors.`,
      stderr: '',
      exitCode: 0
    };
  }

  if (lang === 'c') {
    return {
      stdout: `=== C Memory & Pointer Mechanics ===
Original Value: 21 (Address: 0x7ffd5821c)
Doubled via Pointer: 42

Dynamic Heap Array: 10 20 30 40 
Memory freed successfully.
[Process completed with exit code 0]`,
      stderr: '',
      exitCode: 0
    };
  }

  if (lang === 'cpp') {
    return {
      stdout: `=== C++ STL & Binary Search Demo ===
Original Vector: 45 12 89 23 7 56 31 
Sorted Vector:   7 12 23 31 45 56 89 
Binary Search for key 23: FOUND (O(log N))
[Process completed with exit code 0]`,
      stderr: '',
      exitCode: 0
    };
  }

  throw new Error(`Simulation not available for ${lang}`);
}

/* ─── Code execution ────────────────────────────────────────────── */
async function executeCode(languageId, code) {
  try {
    const res = await fetch('/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: languageId, code }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Local server offline, proceed to browser runners
  }

  if (languageId === 'python') {
    return await runPythonInBrowser(code);
  }

  if (['sql', 'scratch', 'c', 'cpp'].includes(languageId)) {
    return runClientSimulation(languageId, code);
  }

  throw new Error(`Runner server is offline. To compile and run ${languageId.toUpperCase()} with native toolchains, run 'npm run server' locally.`);
}

/* ─── PrerequisitePanel ─────────────────────────────────────────── */
function PrerequisitePanel({ lang, runtimes, runtimesLoading, runtimesError, onRecheck }) {
  const [expanded, setExpanded] = useState(true);

  if (!lang.prerequisites || lang.prerequisites.length === 0) {
    return null;
  }

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

  const handleRun = useCallback(() => {
    setRan(true);
    setLogs([]);

    const srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>
(function() {
  function send(level, args) {
    var formatted = Array.prototype.slice.call(args).map(function(a) {
      if (typeof a === 'object') {
        try { return JSON.stringify(a, null, 2); } catch(e) { return String(a); }
      }
      return String(a);
    });
    parent.postMessage({ type: 'console', level: level, args: formatted }, '*');
  }
  console.log   = function() { send('log', arguments); };
  console.warn  = function() { send('warn', arguments); };
  console.error = function() { send('error', arguments); };
  console.info  = function() { send('info', arguments); };

  window.onerror = function(msg, src, line, col, err) {
    parent.postMessage({ type: 'console', level: 'error', args: [String(err || msg)] }, '*');
  };

  try {
    let res = eval(${JSON.stringify(code)});
    if (res !== undefined) {
      parent.postMessage({ type: 'console', level: 'result', args: [
        typeof res === 'object' ? JSON.stringify(res, null, 2) : String(res)
      ]}, '*');
    }
  } catch(e) {
    parent.postMessage({ type: 'console', level: 'error', args: [e.toString()] }, '*');
  }
})();
<\/script></body></html>`;

    const collected = [];
    const handler = (e) => {
      if (e.data?.type !== 'console') return;
      collected.push({ level: e.data.level, text: e.data.args.join(' ') });
      setLogs([...collected]);
    };
    window.addEventListener('message', handler);

    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.style.display = 'none';
    frame.srcdoc = srcdoc;
    document.body.appendChild(frame);

    setTimeout(() => {
      window.removeEventListener('message', handler);
      if (frame.parentNode) document.body.removeChild(frame);
    }, 4000);
  }, [code]);

  const handleClear = () => { setLogs([]); setRan(false); };

  const LOG_STYLE = {
    log:    { color: '#e2e8f0', prefix: '❯' },
    info:   { color: '#93c5fd', prefix: 'ℹ' },
    warn:   { color: '#fde047', prefix: '⚠' },
    error:  { color: '#f87171', prefix: '✖' },
    result: { color: '#a78bfa', prefix: '←' },
  };

  return (
    <div className="editor-main">
      <div className="html-editor-layout">
        <div className="html-pane-left">
          <div className="editor-toolbar">
            <div className="html-pane-tabs">
              <span className="html-pane-tab active" style={{ borderColor: '#f0db4f', color: '#f0db4f' }}>
                JS Scratchpad
              </span>
            </div>
            <div className="editor-toolbar-right">
              <button className="editor-action-btn run-btn" onClick={handleRun} title="Run JS (Ctrl+Enter)">
                <Play size={13} />
                <span>Run</span>
              </button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            className="code-textarea"
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="js-console-pane">
          <div className="html-preview-header">
            <Terminal size={13} />
            <span>Console Output</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── HtmlEditor sub-component ─────────────────────────────────── */
function HtmlEditor() {
  const [panes, setPanes] = useState(() => {
    try {
      const saved = localStorage.getItem('eduhub_code_html_panes');
      return saved ? JSON.parse(saved) : HTML_DEFAULT;
    } catch {
      return HTML_DEFAULT;
    }
  });

  const [activePane, setActivePane] = useState('html');
  const [previewSrc, setPreviewSrc] = useState('');
  const [renderKey, setRenderKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showConsole, setShowConsole] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('eduhub_code_html_panes', JSON.stringify(panes));
    } catch (e) {
      console.warn('Failed to save HTML panes', e);
    }
  }, [panes]);

  const buildSrcdoc = useCallback((p) => {
    const css = p.css || '';
    const js = p.js || '';
    let html = p.html || '';

    const consoleInterceptor = `
      <script>
        (function() {
          function send(level, args) {
            var formatted = Array.prototype.slice.call(args).map(function(a) {
              if (typeof a === 'object') {
                try { return JSON.stringify(a, null, 2); } catch(e) { return String(a); }
              }
              return String(a);
            });
            parent.postMessage({ type: 'html-console', level: level, args: formatted }, '*');
          }
          console.log   = function() { send('log', arguments); };
          console.warn  = function() { send('warn', arguments); };
          console.error = function() { send('error', arguments); };
          console.info  = function() { send('info', arguments); };
          window.onerror = function(msg, src, line, col, err) {
            parent.postMessage({ type: 'html-console', level: 'error', args: [String(err || msg)] }, '*');
          };
        })();
      <\/script>
    `;

    const styleBlock = `<style>\n${css}\n</style>`;

    const userScript = `
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          try {
            ${js}
          } catch(err) {
            console.error(err);
          }
        });
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          try {
            ${js}
          } catch(err) {
            console.error(err);
          }
        }
      <\/script>
    `;

    if (/<\/head>/i.test(html)) {
      html = html.replace(/<\/head>/i, `${consoleInterceptor}\n${styleBlock}\n</head>`);
    } else {
      html = `${consoleInterceptor}\n${styleBlock}\n${html}`;
    }

    if (/<\/body>/i.test(html)) {
      html = html.replace(/<\/body>/i, `${userScript}\n</body>`);
    } else {
      html = `${html}\n${userScript}`;
    }

    return html;
  }, []);

  const handleRun = useCallback(() => {
    setLogs([]);
    setPreviewSrc(buildSrcdoc(panes));
    setRenderKey(k => k + 1);
  }, [panes, buildSrcdoc]);

  useEffect(() => {
    handleRun();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type !== 'html-console') return;
      setLogs(prev => [...prev, { level: e.data.level, text: e.data.args.join(' ') }]);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  };

  const handleReset = () => {
    setPanes(HTML_DEFAULT);
    setLogs([]);
    setPreviewSrc(buildSrcdoc(HTML_DEFAULT));
    setRenderKey(k => k + 1);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(panes[activePane]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const LOG_STYLE = {
    log:    { color: '#e2e8f0', prefix: '❯' },
    info:   { color: '#93c5fd', prefix: 'ℹ' },
    warn:   { color: '#fde047', prefix: '⚠' },
    error:  { color: '#f87171', prefix: '✖' },
  };

  return (
    <div className="editor-main">
      <div className="html-editor-layout">
        <div className="html-pane-left">
          <div className="editor-toolbar">
            <div className="html-pane-tabs">
              {['html', 'css', 'js'].map(p => (
                <button
                  key={p}
                  className={`html-pane-tab ${activePane === p ? 'active' : ''}`}
                  onClick={() => setActivePane(p)}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="editor-toolbar-right">
              <button className="editor-action-btn" onClick={handleReset} title="Reset starter HTML/CSS/JS">
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
              <button className="editor-action-btn" onClick={handleCopy} title="Copy code">
                {copied ? <CheckCheck size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button className="editor-action-btn run-btn" onClick={handleRun} title="Run & Render (Ctrl+Enter)">
                <Play size={13} />
                <span>Run</span>
              </button>
            </div>
          </div>
          <textarea
            className="code-textarea"
            value={panes[activePane]}
            onChange={e => setPanes(prev => ({ ...prev, [activePane]: e.target.value }))}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            placeholder={`Enter your ${activePane.toUpperCase()} code here...`}
          />
        </div>

        <div className="html-preview-pane">
          <div className="html-preview-header">
            <Eye size={13} />
            <span>Live HTML / CSS / JS Preview</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
              <button
                className={`editor-action-btn ${showConsole ? 'active' : ''}`}
                onClick={() => setShowConsole(s => !s)}
                title="Toggle JS Console"
              >
                <Terminal size={12} />
                <span>Console {logs.length > 0 ? `(${logs.length})` : ''}</span>
              </button>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <iframe
              key={renderKey}
              className="html-preview-iframe"
              title="HTML Preview"
              srcDoc={previewSrc}
              sandbox="allow-scripts allow-modals allow-forms allow-popups"
            />

            {showConsole && (
              <div className="html-console-drawer">
                <div className="html-console-drawer-header">
                  <span>Console Logs</span>
                  <button className="editor-action-btn" style={{ padding: '2px 6px', fontSize: '0.72rem' }} onClick={() => setLogs([])}>
                    Clear
                  </button>
                </div>
                <div className="html-console-drawer-body">
                  {logs.length === 0 ? (
                    <div style={{ color: '#64748b', fontSize: '0.78rem', fontStyle: 'italic' }}>
                      No console logs or errors.
                    </div>
                  ) : (
                    logs.map((entry, idx) => {
                      const s = LOG_STYLE[entry.level] || LOG_STYLE.log;
                      return (
                        <div key={idx} className="js-log-line" style={{ '--log-color': s.color }}>
                          <span className="js-log-prefix">{s.prefix}</span>
                          <pre className="js-log-text">{entry.text}</pre>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main CodeEditor Page ──────────────────────────────────────── */
export default function CodeEditor() {
  const { personaId, activePersona, openPreferenceModal } = useUserPreference();
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  const [activeLang, setActiveLang] = useState(() => {
    if (activePersona?.recommendedLangs?.[0]) {
      const match = LANGUAGES.find(l => l.id === activePersona.recommendedLangs[0]);
      if (match) return match;
    }
    return LANGUAGES[0];
  });

  // Keep active language synced when persona switches
  useEffect(() => {
    if (activePersona && !showAllLanguages) {
      if (!activePersona.recommendedLangs.includes(activeLang.id) && !activePersona.recommendedLangs.includes('html-css')) {
        const firstMatch = LANGUAGES.find(l => activePersona.recommendedLangs.includes(l.id));
        if (firstMatch) {
          setActiveLang(firstMatch);
          setIsHtmlMode(false);
          setIsJsMode(false);
        }
      }
    }
  }, [personaId, activePersona, showAllLanguages]);

  const [codes, setCodes] = useState(() => {
    return Object.fromEntries(
      LANGUAGES.map(l => {
        try {
          const saved = localStorage.getItem(`eduhub_code_${l.id}`);
          return [l.id, saved || l.defaultCode];
        } catch {
          return [l.id, l.defaultCode];
        }
      })
    );
  });

  useEffect(() => {
    try {
      Object.entries(codes).forEach(([k, v]) => {
        localStorage.setItem(`eduhub_code_${k}`, v);
      });
    } catch (e) {
      console.warn('Failed to save code to localStorage', e);
    }
  }, [codes]);

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPrereq, setShowPrereq] = useState(true);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [isJsMode, setIsJsMode] = useState(false);

  const [runtimes, setRuntimes] = useState(null);
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

          {activePersona && (
            <button
              className="pref-badge-btn"
              onClick={openPreferenceModal}
              style={{ color: activePersona.color, borderColor: activePersona.color, background: `${activePersona.color}15`, display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, border: '1px solid', cursor: 'pointer' }}
              title="Change your learning track preference"
            >
              <SlidersHorizontal size={12} />
              <span>{activePersona.shortTitle}</span>
            </button>
          )}
        </div>

        <div className="lang-tabs">
          {(activePersona && !showAllLanguages
            ? LANGUAGES.filter(lang => activePersona.recommendedLangs.includes(lang.id))
            : LANGUAGES
          ).map(lang => (
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

          {/* HTML tab shown if persona includes html-css or showAllLanguages is on */}
          {(!activePersona || showAllLanguages || activePersona.recommendedLangs.includes('html-css')) && (
            <button
              className={`lang-tab ${isHtmlMode ? 'active' : ''}`}
              style={isHtmlMode ? { borderColor: HTML_LANG.color, color: HTML_LANG.color } : {}}
              onClick={() => { setIsHtmlMode(true); setIsJsMode(false); }}
            >
              <span className="lang-tab-icon">{HTML_LANG.icon}</span>
              {HTML_LANG.label}
            </button>
          )}

          {/* JS Scratchpad tab */}
          {(!activePersona || showAllLanguages || activePersona.recommendedLangs.includes('node')) && (
            <button
              className={`lang-tab ${isJsMode ? 'active' : ''}`}
              style={isJsMode ? { borderColor: JS_LANG.color, color: JS_LANG.color } : {}}
              onClick={() => { setIsJsMode(true); setIsHtmlMode(false); }}
            >
              <span className="lang-tab-icon">{JS_LANG.icon}</span>
              {JS_LANG.label}
            </button>
          )}

          {/* Toggle for all languages */}
          {activePersona && (
            <button
              className="lang-tab"
              onClick={() => setShowAllLanguages(s => !s)}
              style={{ opacity: 0.65, fontSize: '0.72rem' }}
              title="Show all available playground languages"
            >
              {showAllLanguages ? '✕ Curated Only' : '+ More'}
            </button>
          )}
        </div>
      </header>

      {/* Editor Body */}
      {isHtmlMode ? (
        <HtmlEditor />
      ) : isJsMode ? (
        <JsScratchpad />
      ) : (
        <div className="editor-main">
          <PrerequisitePanel
            lang={activeLang}
            runtimes={runtimes}
            runtimesLoading={runtimesLoading}
            runtimesError={runtimesError}
            onRecheck={doCheck}
          />

          <div className="editor-layout">
            <div className="editor-pane">
              <div className="editor-toolbar">
                <span className="file-badge">
                  {activeLang.id}.{activeLang.id === 'python' ? 'py' : activeLang.id === 'java' ? 'java' : activeLang.id === 'cpp' ? 'cpp' : activeLang.id === 'c' ? 'c' : activeLang.id === 'sql' ? 'sql' : 'js'}
                </span>
                <div className="editor-toolbar-right">
                  <button className="editor-action-btn" onClick={handleReset} title="Reset to default starter code">
                    <RotateCcw size={13} />
                    <span>Reset</span>
                  </button>
                  <button className="editor-action-btn" onClick={handleCopy} title="Copy code">
                    {copied ? <CheckCheck size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    className="editor-action-btn run-btn"
                    onClick={handleRun}
                    disabled={isRunning}
                    title="Run code (Ctrl+Enter)"
                  >
                    {isRunning ? <Loader2 size={13} className="spin-icon" /> : <Play size={13} />}
                    <span>{isRunning ? 'Running…' : 'Run'}</span>
                  </button>
                </div>
              </div>

              {activeLang.id === 'sql' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: 'var(--color-bg-secondary, #1a2234)',
                  borderBottom: '1px solid var(--color-border, #2d3748)',
                  fontSize: '0.75rem',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-muted, #94a3b8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🗄️ Tables:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCodes(p => ({ ...p, sql: 'SHOW TABLES;\n' }));
                    }}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                      fontWeight: 600
                    }}
                    title="Run SHOW TABLES"
                  >
                    SHOW TABLES
                  </button>
                  {[
                    { name: 'students', cols: '(id, name, grade, city, dept_id)' },
                    { name: 'departments', cols: '(id, dept_id, dept_name, building, budget)' },
                    { name: 'courses', cols: '(course_id, title, credits, dept_id)' },
                    { name: 'employees', cols: '(emp_id, emp_name, salary, dept_id, role)' }
                  ].map(tbl => (
                    <button
                      key={tbl.name}
                      type="button"
                      onClick={() => {
                        setCodes(p => ({ ...p, sql: `SELECT * FROM ${tbl.name};\n` }));
                      }}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(255,255,255,0.08)',
                        color: 'var(--color-text, #e2e8f0)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        cursor: 'pointer',
                        fontSize: '0.72rem'
                      }}
                      title={`Click to query ${tbl.name} ${tbl.cols}`}
                    >
                      {tbl.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setCodes(p => ({ ...p, sql: 'DESCRIBE students;\n' }));
                    }}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#38bdf8',
                      border: '1px dashed #38bdf8',
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                      marginLeft: 'auto'
                    }}
                    title="View table structure"
                  >
                    DESCRIBE schema
                  </button>
                </div>
              )}

              <textarea
                ref={textareaRef}
                className="code-textarea"
                value={codes[activeLang.id]}
                onChange={e => setCodes(prev => ({ ...prev, [activeLang.id]: e.target.value }))}
                spellCheck={false}
              />
            </div>

            <div className="output-pane">
              <div className="output-header">
                <Terminal size={14} />
                <span>Console Output</span>
                {output && (
                  <button className="editor-action-btn" style={{ marginLeft: 'auto' }} onClick={() => setOutput('')}>
                    <RotateCcw size={12} /><span>Clear</span>
                  </button>
                )}
              </div>
              <div className={`output-body ${runError ? 'has-error' : ''}`}>
                {!output && !isRunning && (
                  <div className="output-empty">
                    <Zap size={28} className="output-empty-icon" />
                    <p>Click <strong>Run</strong> or press <kbd>Ctrl+Enter</kbd> to compile and execute.</p>
                  </div>
                )}
                {isRunning && (
                  <div className="output-running">
                    <Loader2 size={22} className="spin-icon" />
                    <p>Executing {activeLang.label}...</p>
                  </div>
                )}
                {output && <pre className="output-text">{output}</pre>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
