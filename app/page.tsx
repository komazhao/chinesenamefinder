import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const runtime = 'edge'

function pickLocale(acceptLanguage: string | null): 'en' | 'zh' {
  if (!acceptLanguage) return 'zh'
  const lower = acceptLanguage.toLowerCase()
  if (lower.includes('zh')) return 'zh'
  return 'en'
}

export default async function RootRedirectPage() {
  const h = await headers()
  const locale = pickLocale(h.get('accept-language'))
  redirect(`/${locale}`)
}

