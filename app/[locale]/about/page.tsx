'use client'


import React from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Users, Globe, Award, Star, BookOpen } from 'lucide-react'
import Link from 'next/link'


export default function AboutPage() {
  const t = useTranslations()

  const stats = [
    { label: t('about.stats.users'), value: '50,000+', icon: Users },
    { label: t('about.stats.names'), value: '500,000+', icon: Star },
    { label: t('about.stats.countries'), value: '40+', icon: Globe },
    { label: t('about.stats.satisfaction'), value: '98%', icon: Award },
  ]

  const values = [
    {
      title: t('about.values.cultural.title'),
      description: t('about.values.cultural.description'),
      icon: BookOpen,
    },
    {
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description'),
      icon: Star,
    },
    {
      title: t('about.values.userFirst.title'),
      description: t('about.values.userFirst.description'),
      icon: Heart,
    },
    {
      title: t('about.values.global.title'),
      description: t('about.values.global.description'),
      icon: Globe,
    },
  ]

  const timeline = [
    {
      year: '2023',
      title: t('about.timeline.2023_birth.title'),
      description: t('about.timeline.2023_birth.description'),
    },
    {
      year: '2023',
      title: t('about.timeline.2023_launch.title'),
      description: t('about.timeline.2023_launch.description'),
    },
    {
      year: '2024',
      title: t('about.timeline.2024_upgrade.title'),
      description: t('about.timeline.2024_upgrade.description'),
    },
    {
      year: '2024',
      title: t('about.timeline.2024_global.title'),
      description: t('about.timeline.2024_global.description'),
    },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-red-50/20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              {t('about.title')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('about.subtitle')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t('about.description')}
            </p>
            <Button size="lg" asChild>
              <Link href="/generate">
                <Heart className="mr-2 h-5 w-5" />
                {t('about.getStarted')}
              </Link>
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Mission Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('about.mission.title')}</h2>
              <p className="text-lg text-muted-foreground">
                {t('about.mission.subtitle')}
              </p>
            </div>

            <Card className="p-8 bg-gradient-to-r from-red-50 to-amber-50 border-red-200">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-red-800">
                      {t('about.mission.sectionTitle')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {t('about.mission.description1')}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('about.mission.description2')}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-32 h-32 bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-full flex items-center justify-center text-4xl font-bold">
                      {t('common.loading').charAt(0)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('about.values.title')}</h2>
              <p className="text-lg text-muted-foreground">
                {t('about.values.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center">
                        {value.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('about.timeline.title')}</h2>
              <p className="text-lg text-muted-foreground">
                {t('about.timeline.subtitle')}
              </p>
            </div>

            <div className="space-y-8">
              {timeline.map((event, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      {event.year}
                    </div>
                    {index !== timeline.length - 1 && (
                      <div className="w-0.5 h-16 bg-muted mt-4" />
                    )}
                  </div>
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {event.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-red-600 to-amber-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">
                {t('about.cta.title')}
              </h2>
              <p className="text-xl opacity-90 mb-8">
                {t('about.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/generate">
                    {t('about.cta.experience')}
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                  <Link href="/contact">
                    {t('about.cta.contact')}
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
