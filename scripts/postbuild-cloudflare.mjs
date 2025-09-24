#!/usr/bin/env node
import { existsSync, copyFileSync, readdirSync } from 'fs';
import { join } from 'path';

// After OpenNext build, copy worker.js to _worker.js (Cloudflare Pages requirement)
const sourceWorker = join(process.cwd(), '.open-next', 'worker.js');
const targetWorker = join(process.cwd(), '.open-next', '_worker.js');

console.log('[postbuild] Checking .open-next directory contents:');
const files = readdirSync(join(process.cwd(), '.open-next'));
console.log('[postbuild] Files:', files);

if (existsSync(sourceWorker)) {
  copyFileSync(sourceWorker, targetWorker);
  console.log('[postbuild] Successfully copied worker.js to _worker.js');
} else {
  console.error('[postbuild] ERROR: worker.js not found in .open-next directory');
  process.exit(1);
}