#!/usr/bin/env node
import { existsSync, copyFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// Create custom worker with static asset handling
const customWorkerContent = `// Custom worker to handle static assets and dynamic routes
import workerHandler from "./worker.js";

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Handle static assets first
        if (url.pathname.startsWith("/_next/") ||
            url.pathname.endsWith(".webmanifest") ||
            url.pathname.endsWith(".ico") ||
            url.pathname.endsWith(".svg") ||
            url.pathname.endsWith(".png") ||
            url.pathname.endsWith(".jpg") ||
            url.pathname.endsWith(".jpeg") ||
            url.pathname.endsWith(".webp") ||
            url.pathname.endsWith(".woff") ||
            url.pathname.endsWith(".woff2") ||
            url.pathname.endsWith(".ttf") ||
            url.pathname.endsWith(".otf")) {

            // Try to fetch from ASSETS binding (Cloudflare Pages static files)
            if (env.ASSETS) {
                try {
                    // For assets in the assets directory
                    const assetResponse = await env.ASSETS.fetch(new URL(url.pathname, request.url));
                    if (assetResponse.status !== 404) {
                        // Add cache headers for static assets
                        const headers = new Headers(assetResponse.headers);
                        if (url.pathname.startsWith("/_next/static/")) {
                            // Next.js static assets can be cached for a long time
                            headers.set("cache-control", "public, max-age=31536000, immutable");
                        } else {
                            // Other static assets with shorter cache
                            headers.set("cache-control", "public, max-age=3600");
                        }
                        return new Response(assetResponse.body, {
                            status: assetResponse.status,
                            headers
                        });
                    }
                } catch (e) {
                    // If asset fetch fails, continue to dynamic handler
                    console.error("Asset fetch failed:", e);
                }
            }
        }

        // For all other requests, use the OpenNext worker handler
        return workerHandler.fetch(request, env, ctx);
    }
};`;

// After OpenNext build, create custom worker and copy to _worker.js
const sourceWorker = join(process.cwd(), '.open-next', 'worker.js');
const customWorker = join(process.cwd(), '.open-next', 'custom-worker.js');
const targetWorker = join(process.cwd(), '.open-next', '_worker.js');

console.log('[postbuild] Checking .open-next directory contents:');
const files = readdirSync(join(process.cwd(), '.open-next'));
console.log('[postbuild] Files:', files);

if (existsSync(sourceWorker)) {
  // Create custom worker
  writeFileSync(customWorker, customWorkerContent);
  console.log('[postbuild] Created custom-worker.js with static asset handling');

  // Copy custom worker to _worker.js
  copyFileSync(customWorker, targetWorker);
  console.log('[postbuild] Successfully copied custom-worker.js to _worker.js');
} else {
  console.error('[postbuild] ERROR: worker.js not found in .open-next directory');
  process.exit(1);
}