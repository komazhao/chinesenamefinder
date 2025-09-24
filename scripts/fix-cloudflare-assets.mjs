#!/usr/bin/env node
import { existsSync, copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Function to recursively copy directory
function copyRecursiveSync(src, dest) {
  const exists = existsSync(src);
  const stats = exists && statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }
    readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        join(src, childItemName),
        join(dest, childItemName)
      );
    });
  } else {
    copyFileSync(src, dest);
  }
}

// Copy assets from assets subdirectory to root of .open-next for proper serving
const assetsSource = join(process.cwd(), '.open-next', 'assets');
const openNextRoot = join(process.cwd(), '.open-next');

// Copy _next directory to root if it exists
const nextSource = join(assetsSource, '_next');
if (existsSync(nextSource)) {
  const nextDest = join(openNextRoot, '_next');
  console.log('[fix-assets] Copying _next directory to .open-next root');
  copyRecursiveSync(nextSource, nextDest);
}

// Copy BUILD_ID if it exists
const buildIdSource = join(assetsSource, 'BUILD_ID');
if (existsSync(buildIdSource)) {
  const buildIdDest = join(openNextRoot, 'BUILD_ID');
  copyFileSync(buildIdSource, buildIdDest);
  console.log('[fix-assets] Copied BUILD_ID to .open-next root');
}

console.log('[fix-assets] Asset structure fixed for Cloudflare Pages');