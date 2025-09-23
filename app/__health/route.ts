// No edge runtime here to satisfy OpenNext bundling constraints

export async function GET() {
  const info = {
    status: 'ok',
    time: new Date().toISOString(),
    stage: process.env.APP_STAGE || process.env.NODE_ENV || 'unknown',
    hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasSupabaseAnon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasOpenRouterKey: Boolean(process.env.OPENROUTER_API_KEY),
  }
  return new Response(JSON.stringify(info), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  })
}
