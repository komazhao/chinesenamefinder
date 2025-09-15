import type { Metadata } from 'next'
import { Inter, Noto_Serif_SC, Fira_Code } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { AuthProvider } from '@/components/providers/auth-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'

// 字体配置
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '900'],
  variable: '--font-noto-serif-sc',
  display: 'swap',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | 文化伴侣',
    default: '文化伴侣 - AI赋能的中文起名网站',
  },
  description: '专业的AI中文起名服务平台，为全球用户提供富有文化内涵的中文名字生成体验，融合传统文化与现代AI技术。',
  keywords: [
    '中文起名',
    'AI起名',
    '中国文化',
    '姓名生成器',
    '五行起名',
    '诗意命名',
    '文化伴侣',
    'Chinese name generator',
    'AI naming',
    'Chinese culture'
  ],
  authors: [{ name: '文化伴侣团队' }],
  creator: '文化伴侣',
  publisher: '文化伴侣',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
    locale: 'zh_CN',
    url: '/',
    title: '文化伴侣 - AI赋能的中文起名网站',
    description: '专业的AI中文起名服务平台，为全球用户提供富有文化内涵的中文名字生成体验',
    siteName: '文化伴侣',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '文化伴侣 - AI中文起名',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '文化伴侣 - AI赋能的中文起名网站',
    description: '专业的AI中文起名服务平台，融合传统文化与现代AI技术',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={cn(
        inter.variable,
        notoSerifSC.variable,
        firaCode.variable
      )}
    >
      <head>
        {/* 预加载关键资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* 网站图标 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* 主题色 */}
        <meta name="theme-color" content="#dc2626" />
        <meta name="msapplication-TileColor" content="#dc2626" />

        {/* 视口配置 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* DNS 预取 */}
        <link rel="dns-prefetch" href="//api.openai.com" />
        <link rel="dns-prefetch" href="//js.stripe.com" />

        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: '文化伴侣',
              description: '专业的AI中文起名服务平台',
              url: process.env.NEXT_PUBLIC_SITE_URL,
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              featureList: [
                'AI智能起名',
                '五行命名',
                '诗意命名',
                '文化解释',
                '发音指导'
              ]
            })
          }}
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          'font-chinese-sans'
        )}
        suppressHydrationWarning
      >
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

        {/* 性能监控和错误报告 */}
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

            {/* Sentry 错误监控 */}
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
      </body>
    </html>
  )
}