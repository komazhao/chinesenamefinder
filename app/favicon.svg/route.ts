export const runtime = 'edge'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#dc2626"/>
  <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-size="34" font-family="Arial, Helvetica, sans-serif" fill="#fff">名</text>
</svg>`

export async function GET() {
  return new Response(svg, {
    status: 200,
    headers: { 'content-type': 'image/svg+xml; charset=utf-8' }
  })
}

