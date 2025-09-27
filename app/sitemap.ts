import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chinesenamefinder.com'

// 定义所有页面路由
const routes = [
  '', // 首页
  'about',
  'pricing',
  'generate',
  'dashboard',
  'contact',
  'blog',
  'stories',
  'help',
  'api-docs',
  'privacy',
  'terms',
  'settings',
  'auth/login',
  'auth/register'
]

// 支持的语言
const locales = ['en', 'zh']

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = []

  // 添加根路径
  sitemapEntries.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  })

  // 为每个语言和路由生成 sitemap 条目
  locales.forEach(locale => {
    routes.forEach(route => {
      const path = route ? `/${route}` : ''

      // 根据路由设置不同的优先级和更新频率
      let priority = 0.5
      let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'monthly'

      // 核心页面设置更高优先级
      if (route === '' || route === 'generate' || route === 'pricing') {
        priority = 0.9
        changeFrequency = 'weekly'
      } else if (route === 'about' || route === 'blog' || route === 'stories') {
        priority = 0.7
        changeFrequency = 'weekly'
      } else if (route === 'dashboard' || route === 'settings') {
        priority = 0.6
        changeFrequency = 'daily'
      } else if (route.startsWith('auth/')) {
        priority = 0.8
        changeFrequency = 'monthly'
      } else if (route === 'privacy' || route === 'terms') {
        priority = 0.3
        changeFrequency = 'yearly'
      }

      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
      })
    })
  })

  return sitemapEntries
}