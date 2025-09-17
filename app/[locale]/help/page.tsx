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
      title: t('help.categories.quickStart.title'),
      description: t('help.categories.quickStart.description'),
      articles: 12,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Settings,
      title: t('help.categories.account.title'),
      description: t('help.categories.account.description'),
      articles: 8,
      color: 'from-green-500 to-green-600'
    },
    {
      icon: CreditCard,
      title: t('help.categories.billing.title'),
      description: t('help.categories.billing.description'),
      articles: 15,
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Shield,
      title: t('help.categories.privacy.title'),
      description: t('help.categories.privacy.description'),
      articles: 6,
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Zap,
      title: t('help.categories.ai.title'),
      description: t('help.categories.ai.description'),
      articles: 20,
      color: 'from-amber-500 to-amber-600'
    },
    {
      icon: MessageCircle,
      title: t('help.categories.support.title'),
      description: t('help.categories.support.description'),
      articles: 10,
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  const popularArticles = [
    {
      title: t('help.popular.articles.firstTime.title'),
      description: t('help.popular.articles.firstTime.description'),
      category: t('help.categories.quickStart.title'),
      readTime: '3分钟',
      views: 1520
    },
    {
      title: t('help.popular.articles.fiveElements.title'),
      description: t('help.popular.articles.fiveElements.description'),
      category: t('help.categories.ai.title'),
      readTime: '5分钟',
      views: 1240
    },
    {
      title: t('help.popular.articles.subscription.title'),
      description: t('help.popular.articles.subscription.description'),
      category: t('help.categories.billing.title'),
      readTime: '4分钟',
      views: 980
    },
    {
      title: t('help.popular.articles.privacy.title'),
      description: t('help.popular.articles.privacy.description'),
      category: t('help.categories.privacy.title'),
      readTime: '6分钟',
      views: 750
    },
    {
      title: t('help.popular.articles.account.title'),
      description: t('help.popular.articles.account.description'),
      category: t('help.categories.account.title'),
      readTime: '2分钟',
      views: 680
    }
  ]

  const quickActions = [
    {
      icon: Phone,
      title: t('help.quickActions.contact.title'),
      description: t('help.quickActions.contact.description'),
      action: t('help.quickActions.contact.action'),
      href: '/contact'
    },
    {
      icon: Mail,
      title: t('help.quickActions.email.title'),
      description: t('help.quickActions.email.description'),
      action: t('help.quickActions.email.action'),
      href: 'mailto:support@chinesenamefinder.com'
    },
    {
      icon: MessageCircle,
      title: t('help.quickActions.chat.title'),
      description: t('help.quickActions.chat.description'),
      action: t('help.quickActions.chat.action'),
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
              {t('help.title')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('help.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t('help.description')}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder={t('help.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                {t('help.search.button')}
              </Button>
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">{t('help.categories.title')}</h2>
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
            <h2 className="text-3xl font-bold mb-8">{t('help.popular.title')}</h2>
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
                {t('help.popular.viewAll')}
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">{t('help.quickActions.title')}</h2>
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