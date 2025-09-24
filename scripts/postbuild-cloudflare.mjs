#!/usr/bin/env node
import { existsSync, copyFileSync } from 'fs';
import { join } from 'path';

// After OpenNext build, copy _worker.js to assets directory
const sourceWorker = join(process.cwd(), '.open-next', '_worker.js');
const targetWorker = join(process.cwd(), '.open-next', 'assets', '_worker.js');

if (existsSync(sourceWorker)) {
  copyFileSync(sourceWorker, targetWorker);
  console.log('[postbuild] Copied _worker.js to assets directory');
} else {
  console.error('[postbuild] Warning: _worker.js not found in .open-next directory');
}