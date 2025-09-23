// Node-compatible runtime (no Edge) for OpenNext build

export async function GET() {
  // 返回 204，避免浏览器报错，同时不提供实际图标
  return new Response(null, { status: 204 })
}
