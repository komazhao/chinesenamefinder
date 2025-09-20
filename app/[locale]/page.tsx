'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight, Sparkles, Heart, Star, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  const t = useTranslations()

  const features = [
    {
      icon: Sparkles,
      title: t('features.items.ai_technology.title'),
      description: t('features.items.ai_technology.description')
    },
    {
      icon: Heart,
      title: t('features.items.cultural_depth.title'),
      description: t('features.items.cultural_depth.description')
    },
    {
      icon: Star,
      title: t('features.items.five_elements.title'),
      description: t('features.items.five_elements.description')
    },
    {
      icon: Globe,
      title: t('features.items.personalization.title'),
      description: t('features.items.personalization.description')
    }
  ]

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-background to-red-50/20 py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>{t('hero.subtitle')}</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                {t('hero.title')}
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {t('hero.description')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="default" asChild className="group">
                  <Link href="/generate">
                    {t('hero.cta_primary')}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/pricing">
                    {t('hero.cta_secondary')}
                  </Link>
                </Button>
              </div>

              {/* Simple demo preview */}
              <div className="mt-12 max-w-md mx-auto">
                <Card className="shadow-lg">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="text-2xl font-bold text-foreground">李文华</div>
                    <p className="text-sm text-muted-foreground">文采华美，德才兼备</p>
                    <div className="flex justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                {t('features.title')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('features.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center p-6 border hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-xl">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                {t('pricing.title')}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t('pricing.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <Card className="p-6 border">
                <CardContent className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">{t('pricing.free.title')}</h3>
                    <div className="text-3xl font-bold">{t('pricing.free.price')}</div>
                    <p className="text-sm text-muted-foreground">{t('pricing.free.description')}</p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {t.raw('pricing.free.features').map((feature: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant="outline">
                    {t('pricing.free.cta')}
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="p-6 border-2 border-primary relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    {t('pricing.pro.popular')}
                  </span>
                </div>
                <CardContent className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">{t('pricing.pro.title')}</h3>
                    <div className="text-3xl font-bold">
                      {t('pricing.pro.price')}
                      <span className="text-sm font-normal text-muted-foreground">
                        {t('pricing.pro.period')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{t('pricing.pro.description')}</p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {t.raw('pricing.pro.features').map((feature: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">
                    {t('pricing.pro.cta')}
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="p-6 border">
                <CardContent className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">{t('pricing.enterprise.title')}</h3>
                    <div className="text-3xl font-bold">{t('pricing.enterprise.price')}</div>
                    <p className="text-sm text-muted-foreground">{t('pricing.enterprise.description')}</p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {t.raw('pricing.enterprise.features').map((feature: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant="outline">
                    {t('pricing.enterprise.cta')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                {t('cta.title')}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t('cta.description')}
              </p>
              <Button size="lg" asChild className="group">
                <Link href="/generate">
                  {t('cta.button')}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
