#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const { mkdirSafe, writeSecure } = require('../../_shared/install');
const { GROK_HOME, GROK_CONFIG, LOCAL_BIN } = require('../../_shared/config');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const HOME = os.homedir();
const CLIPROXY_AUTH_DIR = process.env.CLIPROXY_AUTH_DIR || path.join(HOME, '.cli-proxy-api');
const ENV_FILE = path.join(CLIPROXY_AUTH_DIR, 'grok-agy.env');

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
  const m = existing.match(/^GROK_AGY_PROXY_API_KEY=([^\r\n]+)/m);
  if (m) apiKey = m[1];
}
if (!apiKey) {
  apiKey = crypto.randomBytes(24).toString('hex');
  writeSecure(ENV_FILE, `GROK_AGY_PROXY_API_KEY=${apiKey}\n`);
}

// ---------------------------------------------------------------------------
// 3. Patch Grok config.toml
// ---------------------------------------------------------------------------
const modelBlock = [
  '',
  '[model.agy]',
  'model = "gemini-3.5-flash"',
  'base_url = "http://127.0.0.1:8318/v1"',
  'name = "Antigravity (inline)"',
  'env_key = "GROK_AGY_PROXY_API_KEY"',
  'api_backend = "chat_completions"',
  'auth_scheme = "bearer"',
  '',
].join('\n');

if (fs.existsSync(GROK_CONFIG)) {
  let toml = fs.readFileSync(GROK_CONFIG, 'utf8');
  // Remove existing [model.agy] section if present
  toml = toml.replace(/\[model\.agy\][\s\S]*?(?=\n\s*\[|$)/, '').trim() + '\n';
  // Append new model block
  toml = toml.trim() + '\n' + modelBlock;
  fs.writeFileSync(GROK_CONFIG, toml, 'utf8');
} else {
  fs.writeFileSync(GROK_CONFIG, modelBlock.trimStart(), 'utf8');
}

// ---------------------------------------------------------------------------
// 4. Write grok-agy wrapper to ~/.local/bin
// ---------------------------------------------------------------------------
const wrapperSrc = path.join(__dirname, '..', 'bin', 'grok-agy.js');
const wrapperDst = path.join(LOCAL_BIN, 'grok-agy');

fs.copyFileSync(wrapperSrc, wrapperDst);
fs.chmodSync(wrapperDst, 0o755);

// ---------------------------------------------------------------------------
// Done
// ---------------------------------------------------------------------------
console.log('installed grok-agy (Node-native inline proxy)');
console.log('model: gemini-3.5-flash');
console.log("verify: grok-agy -p 'Say ok'");
