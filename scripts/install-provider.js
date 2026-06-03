#!/usr/bin/env node
'use strict';

// Single install entry point used by both the TUI and headless mode.
// Dispatches by provider type from the manifest:
//   passthrough -> generic installer in providers/_shared/install.js
//   custom      -> the provider's own providers/<dir>/lib/install.js
//   proxy       -> deferred (not yet implemented)
//
// Usage: node scripts/install-provider.js <name>

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const manifest = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'providers', 'providers.json'), 'utf8'),
);

const name = process.argv[2];
if (!name) {
  process.stderr.write('Usage: install-provider <name>\n');
  process.exit(1);
}

const entry = manifest[name];
if (!entry) {
  process.stderr.write(`Unknown provider: ${name}\n`);
  process.exit(1);
}

if (entry.type === 'passthrough') {
  try {
    require('../providers/_shared/install').installPassthrough(name, entry);
    process.exit(0);
  } catch (err) {
    process.stderr.write(`Failed to install ${name}: ${err.message}\n`);
    process.exit(1);
  }
} else if (entry.type === 'custom') {
  const dir = path.join(ROOT, 'providers', entry.dir || name);
  if (!fs.existsSync(dir)) {
    process.stderr.write(`Error: provider directory ${dir} does not exist.\n`);
    process.exit(1);
  }
  const res = spawnSync('node', ['lib/install.js'], { cwd: dir, stdio: 'inherit' });
  process.exit(res.status ?? 1);
} else if (entry.type === 'proxy') {
  process.stderr.write(
    `provider type 'proxy' is not implemented yet (${name}); see providers/_shared/proxy.js\n`,
  );
  process.exit(1);
} else {
  process.stderr.write(`Unknown provider type '${entry.type}' for ${name}\n`);
  process.exit(1);
}
