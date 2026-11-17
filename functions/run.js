// Cloudflare Pages Function: /run
// Handles code execution on Cloudflare Edge via Judge0 CE Multi-Language Runner

function toBase64(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}

function fromBase64(str) {
  if (!str) return '';
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    const binary = atob(str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  }
}

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

    // Language ID mapping for Judge0 CE Sandbox
    const JUDGE0_LANG_MAP = {
      java:       62, // Java (OpenJDK 13.0.1)
      node:       93, // JavaScript / Node.js
      javascript: 93, // JavaScript / Node.js
      graphql:    93, // GraphQL (Node.js engine)
      python:     71, // Python (3.8.1)
      cpp:        54, // C++ (GCC 9.2.0)
      c:          50, // C (GCC 9.2.0)
    };

    const languageId = JUDGE0_LANG_MAP[language];

    if (!languageId) {
      return new Response(JSON.stringify({ 
        error: `Language '${language}' is not supported by edge runner.` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Encode source code in Base64 to support all Unicode symbols (e.g. ₹, emojis, etc.)
    const encodedSource = toBase64(code);

    // Call Judge0 CE execution gateway
    const judge0Res = await fetch('https://ce.judge0.com/submissions?base64_encoded=true&wait=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: encodedSource,
        language_id: languageId,
      }),
    });

    if (judge0Res.ok) {
      const data = await judge0Res.json();
      
      const rawStdout = fromBase64(data.stdout);
      const rawStderr = fromBase64(data.stderr);
      const rawCompile = fromBase64(data.compile_output);
      const rawMessage = data.message ? (data.message.startsWith('ey') ? fromBase64(data.message) : data.message) : '';

      const stdout = rawStdout;
      const stderr = [rawCompile, rawStderr, rawMessage].filter(Boolean).join('\n').trim();
      const exitCode = data.status?.id === 3 ? 0 : 1;

      return new Response(JSON.stringify({
        stdout: stdout || (exitCode === 0 && !stderr ? '(executed successfully with no output)' : ''),
        stderr,
        exitCode,
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If Judge0 returned non-200, return structured error
    const errText = await judge0Res.text();
    return new Response(JSON.stringify({
      stdout: '',
      stderr: `[Edge Execution Error]: Service returned HTTP ${judge0Res.status}. ${errText}`,
      exitCode: 1,
    }), {
      status: 200, // Return 200 with structured JSON so client UI displays stderr clearly
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({
      stdout: '',
      stderr: `[Edge Gateway Exception]: ${err.message || String(err)}`,
      exitCode: 1,
    }), {
      status: 200, // Return 200 so frontend catches and shows stderr in terminal instead of throwing
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
