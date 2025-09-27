// SEO 配置文件
export const seoConfig = {
  defaultTitle: 'ChineseNameHub - Professional AI Chinese Name Generator',
  titleTemplate: '%s | ChineseNameHub',
  defaultDescription: 'ChineseNameHub provides professional AI-powered Chinese name generation service, combining traditional culture with modern technology to create meaningful names.',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://chinesenamefinder.com',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'zh_CN',
    url: 'https://chinesenamefinder.com',
    siteName: 'ChineseNameHub',
    images: [
      {
        url: 'https://chinesenamefinder.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ChineseNameHub - AI Chinese Name Generator',
      },
    ],
  },
  twitter: {
    handle: '@chinesenamehub',
    site: '@chinesenamehub',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'author',
      content: 'ChineseNameHub Team'
    },
    {
      name: 'keywords',
      content: 'Chinese name generator, AI naming, Chinese culture, Five Elements naming, poetic naming, 中文起名, AI起名, 五行起名'
    },
    {
      name: 'robots',
      content: 'index,follow'
    },
    {
      name: 'googlebot',
      content: 'index,follow'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      name: 'application-name',
      content: 'ChineseNameHub'
    },
    {
      name: 'apple-mobile-web-app-title',
      content: 'ChineseNameHub'
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default'
    }
  ],
  languageAlternates: [
    {
      hrefLang: 'en',
      href: 'https://chinesenamefinder.com/en'
    },
    {
      hrefLang: 'zh',
      href: 'https://chinesenamefinder.com/zh'
    },
    {
      hrefLang: 'x-default',
      href: 'https://chinesenamefinder.com'
    }
  ]
}

// 页面特定的 SEO 配置
export const pageSeoConfig = {
  home: {
    title: 'Professional AI Chinese Name Generator',
    description: 'Generate authentic Chinese names with AI technology. Combining traditional culture with modern innovation.',
    keywords: 'Chinese name generator, AI naming, Chinese culture'
  },
  about: {
    title: 'About Us',
    description: 'Learn about ChineseNameHub - The leading AI-powered Chinese name generation platform.',
    keywords: 'about ChineseNameHub, Chinese naming service, AI technology'
  },
  pricing: {
    title: 'Pricing Plans',
    description: 'Choose the perfect plan for your Chinese name generation needs. Flexible pricing options available.',
    keywords: 'pricing, Chinese name generator cost, subscription plans'
  },
  generate: {
    title: 'Generate Your Chinese Name',
    description: 'Create your perfect Chinese name with our AI-powered generator. Get culturally authentic results instantly.',
    keywords: 'generate Chinese name, AI name generator, instant naming'
  },
  blog: {
    title: 'Blog - Chinese Culture & Naming',
    description: 'Explore articles about Chinese naming culture, traditions, and the art of creating meaningful Chinese names.',
    keywords: 'Chinese naming blog, cultural articles, naming traditions'
  },
  stories: {
    title: 'User Stories',
    description: 'Read inspiring stories from users who found their perfect Chinese names with ChineseNameHub.',
    keywords: 'user stories, testimonials, Chinese name experiences'
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'ChineseNameHub privacy policy - Learn how we protect your data and respect your privacy.',
    keywords: 'privacy policy, data protection, user privacy'
  },
  terms: {
    title: 'Terms of Service',
    description: 'Terms and conditions for using ChineseNameHub services.',
    keywords: 'terms of service, user agreement, legal'
  }
}