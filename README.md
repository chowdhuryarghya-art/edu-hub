# Edu Hub — Developer Learning Portal

A modern, interactive web application for engineering interview prep and technology deep-dives. Covers AWS, GraphQL, Java Spring Boot, Node.js, and Python through full tutorials, hands-on tools, and a live code playground.

---

## Tech Tracks

| Track | Topics Covered |
|---|---|
| ☁️ **AWS Cloud** | Lambda, EC2, ECS/EKS, S3, DynamoDB, RDS, VPC networking, IAM, Serverless architecture |
| ⚡ **GraphQL** | SDL schema design, queries/mutations, resolvers, N+1 with DataLoader, subscriptions, Apollo Federation |
| ☕ **Java Spring Boot** | Bootstrap lifecycle, IoC/DI, Spring Data JPA, Hibernate, Spring Security 6, microservices |
| 🟢 **Node.js** | Libuv event loop phases, microtasks, Streams & backpressure, Worker Threads, memory profiling |
| 🐍 **Python** | Decorators, generators, AsyncIO, GIL, FastAPI, Pydantic v2, metaprogramming |

Each track has **28 in-depth modules** available as an interactive HTML tutorial.

---

## Features

### 📚 Interactive Tech Tracks
Full-page HTML tutorials for each technology, embedded in an iframe viewer with a quick track-switcher and fullscreen mode.

### 🏛️ System Design Canvas
Lucid/Draw.io-style drag-and-drop canvas for designing architectures, microservices, and data flows. Supports SVG/JSON export.

### 🔥 Mock Interview Arena
Timed 2-minute question cards with interactive flashcards and key talking points for senior-level interview prep.

### 📄 Cheat Sheet & PDF Builder
Select one or more technologies and generate a consolidated, print-ready cheat sheet.

### 📊 Readiness Matrix
Self-assessment dashboard to track confidence levels across all topics and identify weak areas.

### ▶️ Code Playground
Live code editor supporting **Java**, **Node.js**, **Python**, and **GraphQL** (as Node.js). Code executes on your local machine via a lightweight runner server.

- **Prerequisite checker** — on opening any language tab, the editor probes your system for the required runtimes (JDK, Node, Python, Maven) and shows live ✅ Installed / ❌ Not found badges with direct download links.
- **Tab key** inserts 4 spaces; **Ctrl+Enter** runs code.
- Output panel shows stdout/stderr with a success/error status badge.

---

## Getting Started

### Prerequisites
- **Node.js 18 LTS+** — [nodejs.org/en/download](https://nodejs.org/en/download)
- For Python execution: **Python 3.10+** — [python.org/downloads](https://www.python.org/downloads/) *(check "Add Python to PATH")*
- For Java execution: **JDK 17+** — [adoptium.net/temurin/releases](https://adoptium.net/temurin/releases/)

### Install dependencies
```bash
cd edu-hub
npm install
```

### Run (frontend + runner server together)
```bash
npm start
```
Opens the Vite dev server on **http://127.0.0.1:3000** and the code runner on **http://127.0.0.1:4000**.

### Run separately (two terminals)
```bash
# Terminal 1 — code execution server
npm run server

# Terminal 2 — Vite frontend
npm run dev
```

### Production build
```bash
npm run build
npm run preview
```

---

## Project Structure

```
edu-hub/
├── server/
│   └── index.js          # Local code execution server (Express, port 4000)
├── src/
│   ├── App.jsx            # Routes
│   ├── components/
│   │   └── CommandPalette  # Ctrl+K quick search
│   ├── data/
│   │   ├── tracks.js       # Track metadata
│   │   └── ...             # Interview bank, system design engine
│   └── pages/
│       ├── Home            # Landing page & feature grid
│       ├── TutorialViewer  # Iframe-embedded track tutorials
│       ├── SystemDesignCanvas
│       ├── InterviewArena
│       ├── CheatSheetBuilder
│       ├── ReadinessDashboard
│       └── CodeEditor      # Live code playground
├── public/
│   └── tutorials/          # Standalone HTML tutorial files
├── vite.config.js           # Vite + proxy config (/run, /check → :4000)
└── package.json
```

---

## How Code Execution Works

The **Code Playground** uses a two-process architecture:

1. **Vite frontend** (`:3000`) — React UI with the code editor and output panel.
2. **Runner server** (`:4000`, `server/index.js`) — Tiny Express server that:
   - `GET /check` — probes the system for installed runtimes using `where`/`which`. On Windows, automatically skips the Microsoft Store Python stub and prefers the `py` launcher.
   - `POST /run` — writes a temp file, shells out to `java`/`node`/`python`/`py`, and returns `{ stdout, stderr, exitCode }`.

Vite proxies `/run` and `/check` to `:4000`, so the frontend makes simple same-origin fetches with no CORS setup required.
