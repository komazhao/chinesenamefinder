import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { AuthProvider } from '@/components/providers/auth-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'

type Props = {
  children: React.ReactNode
  params: { locale: string }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: {
      template: '%s | ' + (locale === 'zh' ? '文化伴侣' : 'Cultural Companion'),
      default: t('title'),
    },
    description: t('description'),
    keywords: t('keywords'),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://chinesenamefinder.com'),
    alternates: {
      canonical: '/',
      languages: {
        'zh-CN': '/zh',
        'en-US': '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      url: '/',
      title: t('title'),
      description: t('description'),
      siteName: locale === 'zh' ? '文化伴侣' : 'Cultural Companion',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/og-image.jpg'],
      creator: '@culturecompanion',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION_ID,
      yandex: process.env.YANDEX_VERIFICATION_ID,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  const { locale } = await params
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <div className="relative flex min-h-screen flex-col">
                {children}
              </div>
              <ToastProvider />
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>

        {/* Performance monitoring and error reporting */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            {process.env.NEXT_PUBLIC_GA_ID && (
              <>
                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                        page_title: document.title,
                        page_location: window.location.href,
                      });
                    `,
                  }}
                />
              </>
            )}

            {/* Sentry error monitoring */}
            {process.env.NEXT_PUBLIC_SENTRY_DSN && (
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    if (window.Sentry) {
                      Sentry.init({
                        dsn: '${process.env.NEXT_PUBLIC_SENTRY_DSN}',
                        environment: 'production',
                        tracesSampleRate: 0.1,
                      });
                    }
                  `,
                }}
              />
            )}
          </>
        )}

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: locale === 'zh' ? '文化伴侣' : 'Cultural Companion',
              description: locale === 'zh' ? '专业的AI中文起名服务平台' : 'Professional AI-powered Chinese name generation service',
              url: process.env.NEXT_PUBLIC_SITE_URL,
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              featureList: locale === 'zh' ? [
                'AI智能起名',
                '五行命名',
                '诗意命名',
                '文化解释',
                '发音指导'
              ] : [
                'AI-powered naming',
                'Five Elements integration',
                'Poetic naming',
                'Cultural explanations',
                'Pronunciation guidance'
              ]
            })
          }}
        />
      </body>
    </html>
  )
}