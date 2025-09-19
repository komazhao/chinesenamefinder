import { redirect } from 'next/navigation'

type HelpPageProps = {
  params: {
    locale: string
  }
}

export default function HelpPage({ params }: HelpPageProps) {
  const locale = params?.locale || 'en'
  redirect(`/${locale}/contact`)
}
