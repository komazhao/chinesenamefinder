'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  Book,
  MessageCircle,
  Settings,
  CreditCard,
  Shield,
  HelpCircle,
  ChevronRight,
  Phone,
  Mail,
  Clock,
  Star,
  User,
  FileText,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function HelpPage() {
  const t = useTranslations()
  const [searchQuery, setSearchQuery] = useState('')

  const helpCategories = [
    {
      icon: Book,
      title: '快速开始',
      description: '了解如何使用AI起名服务',
      articles: 12,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Settings,
      title: '账户设置',
      description: '管理您的个人信息和偏好',
      articles: 8,
      color: 'from-green-500 to-green-600'
    },
    {
      icon: CreditCard,
      title: '付费与订阅',
      description: '了解定价和订阅相关问题',
      articles: 15,
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Shield,
      title: '隐私与安全',
      description: '保护您的数据和隐私',
      articles: 6,
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Zap,
      title: 'AI功能',
      description: '深入了解AI起名的特色功能',
      articles: 20,
      color: 'from-amber-500 to-amber-600'
    },
    {
      icon: MessageCircle,
      title: '技术支持',
      description: '解决技术问题和故障',
      articles: 10,
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  const popularArticles = [
    {
      title: '如何开始您的第一次AI起名？',
      description: '详细指导新用户完成第一次起名体验',
      category: '快速开始',
      readTime: '3分钟',
      views: 1520
    },
    {
      title: '什么是五行八字分析？',
      description: '深入了解传统文化中的五行八字理论',
      category: 'AI功能',
      readTime: '5分钟',
      views: 1240
    },
    {
      title: '如何选择合适的订阅套餐？',
      description: '对比不同套餐功能，选择最适合的方案',
      category: '付费与订阅',
      readTime: '4分钟',
      views: 980
    },
    {
      title: '个人信息如何保护？',
      description: '了解我们如何保护您的隐私数据',
      category: '隐私与安全',
      readTime: '6分钟',
      views: 750
    },
    {
      title: '修改密码和邮箱',
      description: '学会如何更新您的账户信息',
      category: '账户设置',
      readTime: '2分钟',
      views: 680
    }
  ]

  const quickActions = [
    {
      icon: Phone,
      title: '联系客服',
      description: '直接与我们的支持团队对话',
      action: '立即联系',
      href: '/contact'
    },
    {
      icon: Mail,
      title: '发送邮件',
      description: '通过邮件获得详细帮助',
      action: '发送邮件',
      href: 'mailto:support@chinesenamefinder.com'
    },
    {
      icon: MessageCircle,
      title: '在线聊天',
      description: '实时获得技术支持',
      action: '开始聊天',
      href: '#'
    }
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-blue-50/20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              帮助中心
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              我们随时为您提供帮助
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              在这里找到您需要的所有答案。从快速入门到高级功能，
              我们为您准备了详细的指南和常见问题解答。
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="搜索帮助文档..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                搜索
              </Button>
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">浏览帮助主题</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpCategories.map((category, index) => {
                const Icon = category.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-all cursor-pointer group">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {category.title}
                        </CardTitle>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-3">
                        {category.description}
                      </CardDescription>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span>{category.articles} 篇文章</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">热门文章</h2>
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="w-3 h-3" />
                            {article.views} 次浏览
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {article.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground ml-4 flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                查看所有文章
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">还需要帮助？</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{action.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-6">
                        {action.description}
                      </CardDescription>
                      <Button asChild className="w-full">
                        <Link href={action.href}>
                          {action.action}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Support Hours */}
        <section className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-blue-800">
                    <Clock className="w-6 h-6 inline-block mr-2" />
                    {t('help.hours.title')}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">{t('help.hours.weekdays')}</span>
                      <span className="text-primary">9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t('help.hours.weekends')}</span>
                      <span className="text-primary">10:00 - 16:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t('help.hours.email')}</span>
                      <span className="text-primary">24/7</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6">
                    <Star className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-semibold">{t('help.hours.response.title')}</p>
                    <p className="text-2xl font-bold">{t('help.hours.response.time')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                {t('help.cta.title')}
              </h2>
              <p className="text-xl opacity-90 mb-8">
                {t('help.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/contact">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t('help.cta.contact')}
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                  {t('help.cta.community')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      <Footer />
    </>
  )
}