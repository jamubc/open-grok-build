#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const HOME = os.homedir();
const GROK_HOME = process.env.GROK_HOME || path.join(HOME, '.grok');
const GROK_CONFIG = process.env.GROK_CONFIG || path.join(GROK_HOME, 'config.toml');
const CLIPROXY_AUTH_DIR = process.env.CLIPROXY_AUTH_DIR || path.join(HOME, '.cli-proxy-api');
const LOCAL_BIN = process.env.LOCAL_BIN || path.join(HOME, '.local', 'bin');
const ENV_FILE = path.join(CLIPROXY_AUTH_DIR, 'grok-codex.env');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function mkdirSafe(...dirs) {
  for (const d of dirs) {
    fs.mkdirSync(d, { recursive: true, mode: 0o700 });
  }
}

function writeSecure(filePath, content, mode = 0o600) {
  const fd = fs.openSync(filePath, 'w', mode);
  fs.writeSync(fd, content);
  fs.closeSync(fd);
}

// ---------------------------------------------------------------------------
// 1. Setup Directories
// ---------------------------------------------------------------------------
mkdirSafe(CLIPROXY_AUTH_DIR, LOCAL_BIN, GROK_HOME);

// ---------------------------------------------------------------------------
// 2. Generate/Load API Key
// ---------------------------------------------------------------------------
let apiKey;
if (fs.existsSync(ENV_FILE)) {
  const existing = fs.readFileSync(ENV_FILE, 'utf8');
  const m = existing.match(/^GROK_CODEX_PROXY_API_KEY=(.+)$/m);
  if (m) apiKey = m[1];
}
if (!apiKey) {
  apiKey = crypto.randomBytes(24).toString('hex');
  writeSecure(ENV_FILE, `GROK_CODEX_PROXY_API_KEY=${apiKey}\n`);
}

// ---------------------------------------------------------------------------
// 3. Patch Grok config.toml
// ---------------------------------------------------------------------------
const modelBlock = [
  '',
  '[model.codex]',
  'model = "gpt-5.5"',
  'base_url = "http://127.0.0.1:8319/v1"',
  'name = "Codex (inline)"',
  'env_key = "GROK_CODEX_PROXY_API_KEY"',
  'api_backend = "chat_completions"',
  'auth_scheme = "bearer"',
  '',
].join('\n');

if (fs.existsSync(GROK_CONFIG)) {
  let toml = fs.readFileSync(GROK_CONFIG, 'utf8');
  // Remove existing [model.codex] section if present
  toml = toml.replace(/\[model\.codex\][\s\S]*?(?=\n\s*\[|$)/, '').trim() + '\n';
  // Append new model block
  toml = toml.trim() + '\n' + modelBlock;
  fs.writeFileSync(GROK_CONFIG, toml, 'utf8');
} else {
  fs.writeFileSync(GROK_CONFIG, modelBlock.trimStart(), 'utf8');
}

// ---------------------------------------------------------------------------
// 4. Write grok-codex wrapper to ~/.local/bin
// ---------------------------------------------------------------------------
const wrapperSrc = path.join(__dirname, '..', 'bin', 'grok-codex.js');
const wrapperDst = path.join(LOCAL_BIN, 'grok-codex');

fs.copyFileSync(wrapperSrc, wrapperDst);
fs.chmodSync(wrapperDst, 0o755);

// ---------------------------------------------------------------------------
// Done
// ---------------------------------------------------------------------------
console.log('installed grok-codex (Node-native inline proxy)');
console.log('model: gpt-5.5');
console.log("verify: grok-codex -p 'Say ok'");
