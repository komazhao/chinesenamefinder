'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  FileText,
  Scale,
  UserCheck,
  CreditCard,
  Shield,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Globe,
  Mail,
  Phone,
  Ban,
  Info,
  Clock,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
  const t = useTranslations()

  const lastUpdated = '2024年12月15日'
  const effectiveDate = '2024年12月15日'

  const sections = [
    {
      id: 'acceptance',
      title: t('terms.sections.acceptance.title'),
      icon: UserCheck,
      content: [t('terms.sections.acceptance.content')]
    },
    {
      id: 'description',
      title: t('terms.sections.description.title'),
      icon: BookOpen,
      content: [t('terms.sections.description.content')]
    },
    {
      id: 'eligibility',
      title: t('terms.sections.eligibility.title'),
      icon: Shield,
      content: [t('terms.sections.eligibility.content')]
    },
    {
      id: 'conduct',
      title: t('terms.sections.conduct.title'),
      icon: CheckCircle,
      content: [t('terms.sections.conduct.content')]
    },
    {
      id: 'intellectual',
      title: t('terms.sections.intellectual.title'),
      icon: Scale,
      content: [t('terms.sections.intellectual.content')]
    },
    {
      id: 'limitation',
      title: t('terms.sections.limitation.title'),
      icon: AlertTriangle,
      content: [t('terms.sections.limitation.content')]
    },
    {
      id: 'termination',
      title: t('terms.sections.termination.title'),
      icon: Ban,
      content: [t('terms.sections.termination.content')]
    },
    {
      id: 'changes',
      title: t('terms.sections.changes.title'),
      icon: Info,
      content: [t('terms.sections.changes.content')]
    }
  ]

  const keyPoints = [
    {
      title: t('terms.keyPoints.service.title'),
      description: t('terms.keyPoints.service.description'),
      icon: Info
    },
    {
      title: t('terms.keyPoints.user.title'),
      description: t('terms.keyPoints.user.description'),
      icon: UserCheck
    },
    {
      title: t('terms.keyPoints.payment.title'),
      description: t('terms.keyPoints.payment.description'),
      icon: CreditCard
    },
    {
      title: t('terms.keyPoints.intellectual.title'),
      description: t('terms.keyPoints.intellectual.description'),
      icon: Scale
    }
  ]

  const contactInfo = [
    { type: t('terms.contact.legal'), value: 'legal@chinesenamefinder.com', icon: Mail },
    { type: t('terms.contact.phone'), value: '+86 400-123-4567', icon: Phone },
    { type: t('terms.contact.address'), value: t('terms.contact.addressValue'), icon: Globe }
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-amber-50/20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              {t('terms.title')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('terms.heading')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t('terms.description')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {t('terms.lastUpdated')}: {lastUpdated}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {t('terms.effectiveDate')}: {effectiveDate}
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {t('terms.global')}
              </div>
            </div>
          </div>
        </section>

        {/* Key Points */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">{t('terms.keyPoints.title')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {keyPoints.map((point, index) => {
                const Icon = point.icon
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-amber-600" />
                      </div>
                      <h3 className="font-semibold mb-2">{point.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {point.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Alert className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {t('terms.importantNotice')}
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Card key={section.id} id={section.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.content.map((paragraph, index) => (
                        <p key={index} className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Dispute Resolution */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  {t('terms.dispute.title')}
                </CardTitle>
                <CardDescription>
                  {t('terms.dispute.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <h4 className="font-semibold mb-2">{t('terms.dispute.steps.negotiation.title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('terms.dispute.steps.negotiation.description')}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <h4 className="font-semibold mb-2">{t('terms.dispute.steps.mediation.title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('terms.dispute.steps.mediation.description')}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <h4 className="font-semibold mb-2">{t('terms.dispute.steps.legal.title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('terms.dispute.steps.legal.description')}
                    </p>
                  </div>
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {t('terms.dispute.jurisdiction')}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Legal Entity Info */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>{t('terms.company.title')}</CardTitle>
                <CardDescription>
                  {t('terms.company.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">{t('terms.company.details.title')}</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>{t('terms.company.details.name')}:</strong> {t('terms.company.details.nameValue')}</p>
                      <p><strong>{t('terms.company.details.address')}:</strong> {t('terms.company.details.addressValue')}</p>
                      <p><strong>{t('terms.company.details.code')}:</strong> {t('terms.company.details.codeValue')}</p>
                      <p><strong>{t('terms.company.details.representative')}:</strong> {t('terms.company.details.representativeValue')}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">{t('terms.contact.title')}</h4>
                    <div className="space-y-3">
                      {contactInfo.map((contact, index) => {
                        const Icon = contact.icon
                        return (
                          <div key={index} className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              <strong>{contact.type}：</strong>{contact.value}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                {t('terms.cta.title')}
              </h2>
              <p className="text-xl opacity-90 mb-8">
                {t('terms.cta.description')}
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">legal@chinesenamefinder.com</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">+86 400-123-4567</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">9:00-18:00 {t('terms.cta.hours')}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    {t('terms.cta.contactLegal')}
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                  <Link href="/privacy">
                    <Shield className="mr-2 h-4 w-4" />
                    {t('terms.cta.privacy')}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Final Notice */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-center">
                {t('terms.finalNotice')}
              </AlertDescription>
            </Alert>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}