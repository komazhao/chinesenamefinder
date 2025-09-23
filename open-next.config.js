// OpenNext Cloudflare adapter configuration
// Aligns with @opennextjs/cloudflare v1.8.x expected shape
// See: https://opennext.js.org/cloudflare
module.exports = {
  // Default functions/runtime
  default: {
    override: {
      // Use Node compat wrapper for app routes where needed
      // (nodejs_compat is enabled in wrangler.toml)
      wrapper: 'cloudflare-node',
      converter: 'edge',
      proxyExternalRequest: 'fetch',
      incrementalCache: 'dummy',
      tagCache: 'dummy',
      queue: 'direct',
    },
  },

  // Middleware runtime
  middleware: {
    external: true,
    override: {
      wrapper: 'cloudflare-edge',
      converter: 'edge',
      proxyExternalRequest: 'fetch',
      incrementalCache: 'dummy',
      tagCache: 'dummy',
      queue: 'direct',
    },
  },

  // Mark Node builtins as edge externals if referenced in deps
  edgeExternals: ['node:crypto'],
}
