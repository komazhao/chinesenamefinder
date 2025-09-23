#!/usr/bin/env node
// Minimal, non-secret env validator for build-time.
// - Never prints values, only presence.
// - Fails build only when production essentials are missing.

// Detect Cloudflare Pages environment based on branch
const cfBranch = process.env.CF_PAGES_BRANCH
const rawStage = process.env.APP_STAGE || process.env.NODE_ENV || 'development'

let stage = rawStage.toLowerCase()

// Handle Cloudflare Pages branch-based environment detection
if (cfBranch) {
  stage = cfBranch === 'main' ? 'production' : 'preview'
}

const isProd = stage === 'production'

// Debug: Show detected environment info
console.log(`[env-check] APP_STAGE: ${process.env.APP_STAGE || 'undefined'}`)
console.log(`[env-check] CF_PAGES_BRANCH: ${process.env.CF_PAGES_BRANCH || 'undefined'}`)
console.log(`[env-check] NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`)
console.log(`[env-check] Detected stage: ${stage}`)

const checks = []
const errors = []
const warnings = []

function mustHave(key, label = key) {
  const ok = Boolean(process.env[key] && String(process.env[key]).trim())
  checks.push({ key, label, ok, level: 'error' })
  if (!ok) errors.push(label)
}

function shouldHave(key, label = key) {
  const ok = Boolean(process.env[key] && String(process.env[key]).trim())
  checks.push({ key, label, ok, level: 'warn' })
  if (!ok) warnings.push(label)
}

// Always-required client env (needed to render app & basic API flows)
mustHave('NEXT_PUBLIC_SUPABASE_URL')
mustHave('NEXT_PUBLIC_SUPABASE_ANON_KEY')

// Optional features — Stripe
const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY)
if (stripeEnabled) {
  shouldHave('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
  // Webhook secret is strongly recommended when Stripe is enabled
  shouldHave('STRIPE_WEBHOOK_SECRET')
}

// Optional features — OpenRouter (AI generation)
// 不强制构建失败，但在生产缺失会造成相关 API 返回 503
shouldHave('OPENROUTER_API_KEY')

// Optional site URL (used in metadata and redirects)
shouldHave('NEXT_PUBLIC_SITE_URL')

// Print a concise summary without values
function icon(ok) { return ok ? '✓' : '✗' }
const lines = []
lines.push(`[env-check] Stage: ${stage}`)
for (const c of checks) {
  const lvl = c.level === 'error' ? 'req' : 'opt'
  lines.push(`[env-check] ${icon(c.ok)} ${c.label} (${lvl})`)
}
console.log(lines.join('\n'))

// On production, hard-fail if any required is missing
if (isProd && errors.length > 0) {
  console.error(`\n[env-check] Missing required env in production: ${errors.join(', ')}`)
  process.exit(1)
}

// Otherwise succeed (warnings will show in logs)
if (warnings.length > 0) {
  console.warn(`[env-check] Optional env missing: ${warnings.join(', ')}`)
}
process.exit(0)

