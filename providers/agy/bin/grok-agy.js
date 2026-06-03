#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { startProxy } = require('../../_shared/proxy');

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'providers.json'), 'utf8'));
const models = manifest.agy.models.map(id => ({
  id,
  object: 'model',
  created: 1677610602,
  owned_by: 'google'
}));

startProxy({
  name: 'agy',
  port: 8318,
  envKey: 'GROK_AGY_PROXY_API_KEY',
  binaryName: 'agy',
  format: 'plain',
  models,
  spawnArgs: (model, prompt) => ['-p', prompt, '--print-timeout', '10m']
});
