'use strict';

// Generic inline HTTP proxy for `type: "proxy"` providers — DEFERRED.
//
// The intent of the `proxy` provider type is to support upstreams that need an
// on-the-fly HTTP server doing format translation / auth injection (e.g. an
// Anthropic /v1/messages bridge, or Ollama with a different wire format) WITHOUT
// requiring a bespoke per-provider bin file.
//
// No provider in providers.json currently uses this type, so the generic server
// is intentionally not implemented yet rather than shipping unexercised code.
// The custom inline proxies that exist today (agy, codex) spawn a local CLI and
// are NOT generic HTTP forwarders — they live under providers/<name>/ as
// `type: "custom"` and keep their own self-contained bin files.
//
// When the first real proxy provider is added, implement `createProxyServer`
// here (generic /v1/chat/completions, /v1/models, /v1/proxy-ref, SSE streaming,
// bearer auth, PID ref-counting) and have scripts/generate-bins.js emit a thin
// wrapper that requires it with the manifest entry (port, envKey, models).

function createProxyServer() {
  throw new Error(
    "provider type 'proxy' is not implemented yet — see providers/_shared/proxy.js",
  );
}

module.exports = { createProxyServer };
