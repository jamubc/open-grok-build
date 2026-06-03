#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { startProxy } = require('../../_shared/proxy');

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'providers.json'), 'utf8'));
const models = manifest.codex.models.map(id => ({
  id,
  object: 'model',
  created: 1677610602,
  owned_by: 'openai'
}));

startProxy({
  name: 'codex',
  port: 8319,
  envKey: 'GROK_CODEX_PROXY_API_KEY',
  binaryName: 'codex',
  format: 'json-lines',
  models,
  spawnArgs: (model, prompt) => [
    'exec',
    '--json',
    '--ephemeral',
    '--skip-git-repo-check',
    '--dangerously-bypass-approvals-and-sandbox',
    '--model', model,
    prompt
  ]
});
