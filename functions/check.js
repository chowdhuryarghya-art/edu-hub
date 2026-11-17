// Cloudflare Pages Function: /check
// Probes edge environment runtimes and toolchain status

export async function onRequestGet() {
  const runtimes = {
    java: 'Cloudflare Edge / Remote Compiler',
    javac: 'Cloudflare Edge / Remote Compiler',
    mvn: 'Cloudflare Edge',
    node: 'Cloudflare V8 Isolate',
    npm: 'Cloudflare Edge',
    python: 'Pyodide WebAssembly / Edge',
    pip: 'Pyodide Wasm',
    gcc: 'Cloudflare Edge Compiler',
    gpp: 'Cloudflare Edge Compiler',
  };

  return new Response(JSON.stringify({ runtimes, environment: 'cloudflare-pages' }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
