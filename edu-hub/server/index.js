import express from 'express';
import { execFile, execFileSync } from 'child_process';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';

const app = express();
app.use(express.json({ limit: '256kb' }));

const PORT = 4000;
const TIMEOUT_MS = 15_000; // 15 s hard limit per execution
const IS_WIN = process.platform === 'win32';

/* ─── Helper: find executable on PATH ─────────────────────────── */
function which(cmd) {
  try {
    const result = execFileSync(
      IS_WIN ? 'where' : 'which',
      [cmd],
      { encoding: 'utf8', timeout: 3000 }
    );
    // `where` can return multiple lines; take the first non-empty one
    return result.trim().split(/\r?\n/)[0].trim() || null;
  } catch {
    return null;
  }
}

/*
 * On Windows, `python` / `python3` may resolve to the Microsoft Store
 * app-execution alias (a stub under WindowsApps) that prints:
 *   "Python was not found; run without arguments to install from the Microsoft Store…"
 * and exits with code 9009.
 *
 * We detect the stub by checking whether the resolved path sits inside
 * the WindowsApps directory, and if so treat it as "not installed".
 * We also try `py` (Python Launcher for Windows) as the preferred
 * Windows-native way to invoke Python.
 */
function isWindowsStorePythonStub(resolvedPath) {
  if (!resolvedPath) return false;
  return resolvedPath.toLowerCase().includes('windowsapps');
}

function findPython() {
  // 1. Try `py` (Python Launcher — installed alongside official Python on Windows)
  const py = which('py');
  if (py && !isWindowsStorePythonStub(py)) return { cmd: 'py', args: [] };

  // 2. Try `python3` (standard on macOS / Linux)
  const py3 = which('python3');
  if (py3 && !isWindowsStorePythonStub(py3)) return { cmd: 'python3', args: [] };

  // 3. Try `python` — but reject the Windows Store stub
  const py2 = which('python');
  if (py2 && !isWindowsStorePythonStub(py2)) return { cmd: 'python', args: [] };

  return null; // genuinely not installed
}

/* ─── /check — probe installed runtimes ───────────────────────── */
app.get('/check', (_req, res) => {
  const pythonInfo = findPython();

  const runtimes = {
    java:   which('java'),
    javac:  which('javac'),
    mvn:    which('mvn'),
    node:   which('node'),
    npm:    which('npm'),
    // Expose the real Python cmd we will actually use (or null)
    python: pythonInfo ? pythonInfo.cmd : null,
    pip:    which('pip') || which('pip3'),
  };
  res.json({ runtimes });
});

/* ─── /run — execute code ─────────────────────────────────────── */
app.post('/run', (req, res) => {
  const { language, code } = req.body ?? {};

  if (!language || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing language or code.' });
  }

  // Create an isolated temp directory for this run
  const runId  = randomBytes(8).toString('hex');
  const runDir = join(tmpdir(), `eduhub-run-${runId}`);
  mkdirSync(runDir, { recursive: true });

  const cleanup = () => {
    try { rmSync(runDir, { recursive: true, force: true }); } catch {}
  };

  try {
    let cmd, args, filePath;

    switch (language) {
      /* ── Java ──────────────────────────────────────────────── */
      case 'java': {
        const classMatch = code.match(/public\s+class\s+(\w+)/);
        const className  = classMatch ? classMatch[1] : 'Main';
        filePath         = join(runDir, `${className}.java`);
        writeFileSync(filePath, code, 'utf8');

        // Compile first
        try {
          execFileSync('javac', [filePath], { cwd: runDir, timeout: TIMEOUT_MS, encoding: 'utf8' });
        } catch (compileErr) {
          cleanup();
          return res.json({ stdout: '', stderr: compileErr.stderr || String(compileErr), exitCode: 1 });
        }

        cmd  = 'java';
        args = ['-cp', runDir, className];
        break;
      }

      /* ── Node.js ───────────────────────────────────────────── */
      case 'node': {
        filePath = join(runDir, 'main.js');
        writeFileSync(filePath, code, 'utf8');
        cmd  = 'node';
        args = [filePath];
        break;
      }

      /* ── Python ────────────────────────────────────────────── */
      case 'python': {
        filePath = join(runDir, 'main.py');
        writeFileSync(filePath, code, 'utf8');

        const pythonInfo = findPython();
        if (!pythonInfo) {
          cleanup();
          return res.json({
            stdout:   '',
            stderr:   'Python is not installed or only the Microsoft Store stub was found.\n\nInstall Python from https://www.python.org/downloads/ and make sure to check "Add Python to PATH" during installation.\n\nAlternatively, install the Python Launcher (py) which is included with the official installer.',
            exitCode: 1,
          });
        }

        cmd  = pythonInfo.cmd;
        args = [...pythonInfo.args, filePath];
        break;
      }

      /* ── GraphQL (runs as Node.js) ─────────────────────────── */
      case 'graphql': {
        filePath = join(runDir, 'main.js');
        writeFileSync(filePath, code, 'utf8');
        cmd  = 'node';
        args = [filePath];
        break;
      }

      default:
        cleanup();
        return res.status(400).json({ error: `Unsupported language: ${language}` });
    }

    execFile(cmd, args, { cwd: runDir, timeout: TIMEOUT_MS, maxBuffer: 1024 * 512 }, (err, stdout, stderr) => {
      cleanup();
      res.json({
        stdout:   stdout  || '',
        stderr:   stderr  || '',
        exitCode: err ? (err.code ?? 1) : 0,
      });
    });

  } catch (err) {
    cleanup();
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`[edu-hub runner] listening on http://127.0.0.1:${PORT}`);
});
