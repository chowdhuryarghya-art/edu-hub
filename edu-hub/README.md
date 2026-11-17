# Edu Hub — Intelligent Developer & Student Learning Portal

A modern, interactive web application for curated computer science education, engineering interview preparation, and technology deep-dives. Features a zero-database user preference system that curates learning tracks, interview question banks, and playground simulators for **School Students (CBSE & ICSE)**, **College Students (CSE / IT)**, **IT Professionals**, and **General Learners**.

---

## 🎯 Target Learner Personas & Curation Matrix

Edu Hub dynamically adapts all portal views based on the learner's active profile:

| Language / Track | School (CBSE) | School (ICSE / ISC) | College (CSE / IT) | IT Professional | General Learner | Primary Focus Area |
|---|:---:|:---:|:---:|:---:|:---:|---|
| **🧩 Scratch / Block Coding** | ✅ | ✅ | ℹ️ | ℹ️ | ✅ | Visual logic & algorithmic flow |
| **🐍 Python** | ✅ (Class 11/12) | ℹ️ | ✅ | ✅ | ✅ | AI, automation & data science |
| **☕ Java Core & OOP** | ℹ️ | ✅ (Class 10/12) | ✅ | ✅ (Spring Boot) | ✅ | Object-oriented programming & enterprise |
| **⚡ C Systems** | ℹ️ | ℹ️ | ✅ | ℹ️ | ℹ️ | Memory management, pointers & OS |
| **🚀 C++ & DSA** | ℹ️ | ℹ️ | ✅ | ✅ | ℹ️ | Data structures & competitive coding |
| **🗄️ SQL & Databases** | ✅ | ✅ | ✅ | ✅ | ✅ | Relational schemas, queries & ACID |
| **🌐 Web Development** | ✅ | ✅ | ✅ | ✅ | ✅ | Semantic HTML5, CSS3 & JavaScript ES6+ |
| **🟢 Node.js & Express** | ℹ️ | ℹ️ | ✅ | ✅ | ℹ️ | Backend services & async event loop |
| **☕ Java Spring Boot** | ℹ️ | ℹ️ | ℹ️ | ✅ | ℹ️ | Enterprise microservices & JPA |
| **☁️ AWS Cloud & DevOps** | ℹ️ | ℹ️ | ℹ️ | ✅ | ℹ️ | Cloud architecture, serverless & VPC |
| **⚡ GraphQL** | ℹ️ | ℹ️ | ℹ️ | ✅ | ℹ️ | Schema design & Apollo Federation |

> **Note:** Tracks marked with ✅ are curated by default for that profile. Users can toggle `+ Explore All Tracks` or switch profiles with a single click at any time.

---

## 🚀 Key Features

### 👤 Zero-Database User Preference Architecture
- **No Database Required**: All preferences, active personas, and track progress are stored locally in browser `localStorage` (`eduhub_user_preference`).
- **Onboarding Modal**: Prompts first-time visitors to choose their learning path (CBSE, ICSE, College CSE, IT Pro, or General Learner).
- **1-Click Profile Switcher**: Prominently accessible in the top navigation bar across all pages.

### 📚 Interactive Multi-Chapter Tech Tracks
Comprehensive standalone HTML tutorials embedded in an interactive viewer with progress tracking:
- **☕ Java Core & ICSE/ISC OOP** (14 modules): Bytecode/JVM Architecture, Tokens/Types, Control Flow, 4 OOP Pillars, Classes/Constructors, Inheritance/Interfaces, Encapsulation, String Algorithms, Arrays & Matrices, Memory Model, Recursion, Exception Handling, Collections Framework, and Board Exam Revision.
- **🚀 C++ & Core DSA** (14 modules): Modern C++ Fast I/O, Pointers/Smart Pointers, OOP/RAII/Move Semantics, STL Vectors/Deque, STL Associative Maps/Sets & Custom Hashes, Monotonic Stacks/Queues, Asymptotic Complexity & Recursion, Two Pointers/Sliding Window, Binary Search Patterns, Linked Lists/LRU Cache, Binary Trees/BSTs, Heaps/Top-K, Graph Theory (BFS/DFS/Dijkstra/DSU), and Dynamic Programming.
- **🗄️ SQL & Relational Databases** (22 modules): DDL/DML, Joins, Aggregations, Subqueries, CTEs, Window Functions, Normalization (1NF–BCNF), Indexing & ACID Transactions.
- **⚡ C & Systems Programming** (14 modules): Memory Layout (Stack/Heap/BSS), Pointers & Pointer Arithmetic, Dynamic Allocation (`malloc`/`calloc`/`realloc`/`free`), Structs & Padding, Unions, Function Pointers, Bit Manipulation, String Mechanics, File I/O, POSIX Calls, and Low-Level Concurrency.
- **🌐 Web Foundations** (14 modules): Client-Server HTTP/HTTPS/DNS & Critical Rendering Path, Semantic HTML5/ARIA, CSS Box Model & Variables, Flexbox Deep Dive, CSS Grid & Auto-Fit/MinMax, Responsive & Container Queries, JS ES6+ Core & Closures, Functional JS & Arrays, DOM & Event Delegation, Event Loop & Microtasks, Fetch API & AbortController, Storage (localStorage/Cookies/IndexedDB), Web Security (XSS/CSRF/CORS/CSP), and Core Web Vitals.
- **🧩 Scratch & Algorithmic Logic** (12 modules): Algorithmic Thinking, 2D Stage Coordinates, Variables & Sensing, Conditionals & Booleans, Loops, Broadcast Events, Custom Blocks, Flowcharts, State Machines, Nested Loops, Data Structures (Lists), and Visual-to-Text Python/Java Translation.
- **☕ Java Spring Boot, 🟢 Node.js, 🐍 Python, ☁️ AWS Cloud, ⚡ GraphQL** (28 comprehensive deep-dive modules each).

### 🏛️ System Design & Flowchart Canvas
- Lucid/Draw.io-style drag-and-drop canvas for designing system architectures, microservices, and algorithmic flowcharts.
- Built-in templates: Distributed Cache, Microservices Architecture, Event-Driven Streaming, Load Balanced Web Cluster, Data Ingestion Pipeline, and **Algorithmic Flowchart (Binary Search & Decision Trees)**.
- Export diagrams to SVG, PNG, and JSON.

### 🔥 Mock Interview Arena
- Curated question bank filtered strictly by active persona (CBSE board questions, ICSE OOP questions, College placement DSA, and Senior IT Pro system design).
- Interactive flashcards with timed mock interview mode, Anki-style spaced review ratings, confidence tags, and key architectural talking points.

### ▶️ Multi-Language Code Playground
- Live code editor supporting **Python**, **Java**, **C/C++**, **SQL**, **HTML/CSS/JS (Live Preview)**, **Scratch/Logic Simulator**, **Node.js**, and **GraphQL**.
- **In-Browser Simulators**:
  - **SQL (AlaSQL)**: Multi-statement query execution with formatted ASCII table output and automatic `localStorage` synchronization across page refreshes.
  - **HTML/CSS/JS Sandbox**: Dynamic preview runner with isolated iframe sandbox, console output drawer, and shortcuts.
  - **Scratch Simulator**: Interactive block logic and sprite simulation engine.
- **Local Runner Integration**: Connects to the local Express runner server (`port 4000`) for executing native Python, Java, Node.js, and C/C++ code with live runtime prerequisite checks.

### 📄 Engineering Cheat Sheet & Summary Generator
- Consolidated, printable cheat sheets covering all 10 technology tracks.
- Real-time concept search, single-track isolation, copy to clipboard (`.md`), markdown file download, and clean print/PDF layouts.

### 📊 Readiness Matrix
- Self-assessment dashboard to track confidence levels across curriculum topics and identify weak areas.

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js 18 LTS+** — [nodejs.org/en/download](https://nodejs.org/en/download)
- *(Optional for local code execution)*:
  - **Python 3.10+** — [python.org/downloads](https://www.python.org/downloads/) *(check "Add Python to PATH")*
  - **JDK 17+** — [adoptium.net/temurin/releases](https://adoptium.net/temurin/releases/)
  - **GCC / G++ / Clang** (for C/C++ execution)

### Install dependencies
```bash
cd edu-hub
npm install
```

### Run Application (Frontend + Code Runner)
```bash
npm start
```
- **Vite Frontend**: [http://127.0.0.1:3000](http://127.0.0.1:3000)
- **Code Runner Server**: [http://127.0.0.1:4000](http://127.0.0.1:4000)

### Run Separately
```bash
# Terminal 1 — Local Runner Server
npm run server

# Terminal 2 — Vite Dev Frontend
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
edu-hub/
├── server/
│   └── index.js              # Local code execution server (Express, port 4000)
├── src/
│   ├── App.jsx                # App routes & PreferenceModal onboarding integration
│   ├── context/
│   │   └── UserPreferenceContext.jsx  # Zero-DB localStorage preference management
│   ├── components/
│   │   ├── PreferenceModal.jsx        # Onboarding & quick-switch persona modal
│   │   ├── PreferenceModal.css
│   │   └── CommandPalette.jsx         # Ctrl+K global search
│   ├── data/
│   │   ├── tracks.js           # Track metadata & persona mappings
│   │   ├── interviewBank.js    # Multi-persona interview questions & board problems
│   │   └── systemDesignEngine.js
│   └── pages/
│       ├── Home.jsx            # Curated dashboard & persona callout
│       ├── TutorialViewer.jsx  # Iframe tutorial viewer with track selector
│       ├── InterviewArena.jsx  # Curated interview arena & flashcards
│       ├── CodeEditor.jsx      # Multi-language code playground & simulators
│       ├── SystemDesignCanvas.jsx
│       ├── CheatSheetBuilder.jsx
│       └── ReadinessDashboard.jsx
├── public/
│   └── tutorials/              # Standalone interactive HTML study guides
│       ├── java-core.html      # ICSE/ISC & College Java OOP
│       ├── cpp-dsa.html        # Modern C++ & Placement DSA
│       ├── sql.html            # SQL, Normalization & ACID
│       ├── c-systems.html      # Memory, Pointers & POSIX
│       ├── web-foundations.html# HTML5, CSS3, Flex/Grid & JS ES6+
│       ├── scratch-logic.html  # Visual Algorithmic Logic
│       ├── python.html
│       ├── springboot.html
│       ├── nodejs.html
│       ├── aws.html
│       └── graphql.html
├── vite.config.js               # Proxy config (/run, /check → :4000)
└── package.json
```

---

## 🔒 Security & Privacy

- All user preference choices are stored strictly within the user's browser via standard Web Storage APIs (`localStorage`).
- No database credentials, tracking tokens, or private telemetry are stored or transmitted.
- Local code execution is strictly bound to `127.0.0.1` (localhost) with input sanitization and timeout protections.
