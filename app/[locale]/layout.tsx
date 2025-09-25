import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { AuthProvider } from '@/components/providers/auth-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { currentStage, isProduction } from '@/lib/env'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

// Cloudflare Pages 要求所有非静态路由使用 Edge 运行时；
// 将本地化路由段设置为 Edge，涵盖其下所有页面与子路由。
// 注：此路由段使用静态预渲染（generateStaticParams），
// 不在此处声明 Edge 运行时，避免与 SSG 冲突。

// OpenNext 适配下可恢复 SSG；保留静态参数生成，避免运行时 i18n 抖动。
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params
  let t: Awaited<ReturnType<typeof getTranslations>> | ((k: string) => string)
  try {
    t = await getTranslations({ locale, namespace: 'metadata' })
  } catch {
    // 防御：i18n 元数据加载失败时，使用 key 作为回退，避免 500
    t = (k: string) => k
  }

  return {
    title: {
      template: '%s | ' + (locale === 'zh' ? '中文名汇' : 'ChineseNameHub'),
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
  if (!routing.locales.includes(locale)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  let messages: AbstractIntlMessages = {}
  try {
    messages = await getMessages()
  } catch {
    messages = {} as AbstractIntlMessages
  }

  return (
    <>
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="theme"
        >
          <AuthProvider>
            <div
              className="min-h-screen bg-background antialiased font-chinese-sans"
              suppressHydrationWarning
            >
              <div className="relative flex min-h-screen flex-col">
                {children}
              </div>
              <ToastProvider />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </NextIntlClientProvider>

      {/* Performance monitoring and error reporting */}
      {isProduction && (
        <>
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

          {process.env.NEXT_PUBLIC_SENTRY_DSN && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  if (window.Sentry) {
                    Sentry.init({
                      dsn: '${process.env.NEXT_PUBLIC_SENTRY_DSN}',
                      environment: '${currentStage}',
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
    </>
  )
}
