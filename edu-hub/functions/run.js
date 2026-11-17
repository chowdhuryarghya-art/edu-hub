// Cloudflare Pages Function: /run
// Handles code execution on Cloudflare Edge

export async function onRequestPost(context) {
  try {
    const { request } = context;
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON request body.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { language, code } = body || {};

    if (!language || typeof code !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing language or code.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. JavaScript / Node.js / GraphQL (Native V8 Isolate execution)
    if (['node', 'javascript', 'graphql'].includes(language)) {
      let stdout = '';
      let stderr = '';
      const customConsole = {
        log: (...args) => {
          stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') + '\n';
        },
        error: (...args) => {
          stderr += args.map(String).join(' ') + '\n';
        },
        warn: (...args) => {
          stdout += '[WARN] ' + args.map(String).join(' ') + '\n';
        },
        info: (...args) => {
          stdout += args.map(String).join(' ') + '\n';
        },
      };

      try {
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
        // Strip CommonJS require/module boilerplate if present in simple script
        const sanitizedCode = code.replace(/const\s+.*=\s*require\([^)]+\);?/g, '');
        const runner = new AsyncFunction('console', sanitizedCode);
        await runner(customConsole);

        return new Response(JSON.stringify({
          stdout: stdout || '(executed successfully with no console output)',
          stderr,
          exitCode: 0,
        }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return new Response(JSON.stringify({
          stdout,
          stderr: String(err),
          exitCode: 1,
        }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // 2. Multi-language sandboxed runner (Java, Python, C, C++) via Piston API
    const RUNTIME_MAP = {
      java:   { language: 'java', version: '15.0.2' },
      python: { language: 'python', version: '3.10.0' },
      c:      { language: 'c', version: '10.2.0' },
      cpp:    { language: 'c++', version: '10.2.0' },
    };

    const targetRuntime = RUNTIME_MAP[language];
    if (targetRuntime) {
      const pistonRes = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: targetRuntime.language,
          version: targetRuntime.version,
          files: [{ content: code }],
        }),
      });

      if (pistonRes.ok) {
        const data = await pistonRes.json();
        const run = data.run || {};
        const compile = data.compile || {};

        return new Response(JSON.stringify({
          stdout: run.stdout || '',
          stderr: (compile.stderr ? compile.stderr + '\n' : '') + (run.stderr || ''),
          exitCode: run.code ?? (compile.code ?? 0),
        }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ error: `Language '${language}' is not supported by edge runner.` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
