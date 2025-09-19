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
      color: 'from-blue-500 to-blue-600',
      href: '/help/quick-start'
    },
    {
      icon: Settings,
      title: t('help.categories.account.title'),
      description: t('help.categories.account.description'),
      color: 'from-green-500 to-green-600',
      href: '/settings'
    },
    {
      icon: CreditCard,
      title: t('help.categories.billing.title'),
      description: t('help.categories.billing.description'),
      color: 'from-purple-500 to-purple-600',
      href: '/pricing'
    },
    {
      icon: Shield,
      title: t('help.categories.privacy.title'),
      description: t('help.categories.privacy.description'),
      color: 'from-red-500 to-red-600',
      href: '/privacy'
    }
  ]

  // Removed popularArticles - no actual content pages

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
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {helpCategories.map((category, index) => {
                const Icon = category.icon
                return (
                  <Link key={index} href={category.href}>
                    <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
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
                        <CardDescription>
                          {category.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">{t('help.quickActions.title')}</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
              <div className="flex justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/contact">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t('help.cta.contact')}
                  </Link>
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