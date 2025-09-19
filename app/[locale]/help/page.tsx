import { redirect } from 'next/navigation'

type HelpPageProps = {
  params: Promise<{
    locale: string
  }>
}

export default async function HelpPage({ params }: HelpPageProps) {
  const { locale } = await params
  const normalizedLocale = locale && locale !== '' ? locale : 'en'
  redirect(`/${normalizedLocale}/contact`)
}
