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
  Shield,
  Lock,
  Eye,
  UserCheck,
  FileText,
  Calendar,
  Globe,
  Mail,
  Phone,
  Database,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
  const t = useTranslations()

  const lastUpdated = t('privacy.lastUpdated')

  const sections = [
    {
      id: 'introduction',
      title: t('privacy.sections.introduction.title'),
      icon: Shield,
      content: [t('privacy.sections.introduction.content')]
    },
    {
      id: 'collection',
      title: t('privacy.sections.collection.title'),
      icon: Database,
      content: [t('privacy.sections.collection.content')]
    },
    {
      id: 'usage',
      title: t('privacy.sections.usage.title'),
      icon: Settings,
      content: [t('privacy.sections.usage.content')]
    },
    {
      id: 'sharing',
      title: t('privacy.sections.sharing.title'),
      icon: UserCheck,
      content: [t('privacy.sections.sharing.content')]
    },
    {
      id: 'security',
      title: t('privacy.sections.security.title'),
      icon: Lock,
      content: [t('privacy.sections.security.content')]
    },
    {
      id: 'rights',
      title: t('privacy.sections.rights.title'),
      icon: Eye,
      content: [t('privacy.sections.rights.content')]
    }
  ]

  const dataTypes = [
    { name: t('privacy.dataTypes.account.name'), purpose: t('privacy.dataTypes.account.purpose'), retention: t('privacy.dataTypes.account.retention'), required: true },
    { name: t('privacy.dataTypes.preferences.name'), purpose: t('privacy.dataTypes.preferences.purpose'), retention: t('privacy.dataTypes.preferences.retention'), required: false },
    { name: t('privacy.dataTypes.usage.name'), purpose: t('privacy.dataTypes.usage.purpose'), retention: t('privacy.dataTypes.usage.retention'), required: false },
    { name: t('privacy.dataTypes.payment.name'), purpose: t('privacy.dataTypes.payment.purpose'), retention: t('privacy.dataTypes.payment.retention'), required: true },
    { name: t('privacy.dataTypes.support.name'), purpose: t('privacy.dataTypes.support.purpose'), retention: t('privacy.dataTypes.support.retention'), required: false }
  ]

  const thirdPartyServices = [
    { name: t('privacy.thirdPartyServices.alibaba.name'), purpose: t('privacy.thirdPartyServices.alibaba.purpose'), dataTypes: t('privacy.thirdPartyServices.alibaba.dataTypes') },
    { name: t('privacy.thirdPartyServices.wechat.name'), purpose: t('privacy.thirdPartyServices.wechat.purpose'), dataTypes: t('privacy.thirdPartyServices.wechat.dataTypes') },
    { name: t('privacy.thirdPartyServices.alipay.name'), purpose: t('privacy.thirdPartyServices.alipay.purpose'), dataTypes: t('privacy.thirdPartyServices.alipay.dataTypes') },
    { name: t('privacy.thirdPartyServices.tencent.name'), purpose: t('privacy.thirdPartyServices.tencent.purpose'), dataTypes: t('privacy.thirdPartyServices.tencent.dataTypes') }
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-50/20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              {t('privacy.title')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('privacy.heading')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t('privacy.description')}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {t('privacy.lastUpdated')}: {lastUpdated}
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {t('privacy.global')}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{t('privacy.quickActions.security.title')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('privacy.quickActions.security.description')}
                  </p>
                  <Button variant="outline" size="sm">
                    {t('privacy.quickActions.security.action')}
                  </Button>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{t('privacy.quickActions.transparency.title')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('privacy.quickActions.transparency.description')}
                  </p>
                  <Button variant="outline" size="sm">
                    {t('privacy.quickActions.transparency.action')}
                  </Button>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{t('privacy.quickActions.control.title')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('privacy.quickActions.control.description')}
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/settings">
                      {t('privacy.quickActions.control.action')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
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
                        <p key={index} className="text-muted-foreground leading-relaxed">
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

        {/* Data Types Table */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t('privacy.dataProcessing.title')}
                </CardTitle>
                <CardDescription>
                  {t('privacy.dataProcessing.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">{t('privacy.dataProcessing.table.dataType')}</th>
                        <th className="text-left py-3 px-4">{t('privacy.dataProcessing.table.purpose')}</th>
                        <th className="text-left py-3 px-4">{t('privacy.dataProcessing.table.retention')}</th>
                        <th className="text-left py-3 px-4">{t('privacy.dataProcessing.table.required')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataTypes.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4 font-medium">{item.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{item.purpose}</td>
                          <td className="py-3 px-4 text-muted-foreground">{item.retention}</td>
                          <td className="py-3 px-4">
                            <Badge variant={item.required ? "destructive" : "secondary"}>
                              {item.required ? t('privacy.dataProcessing.table.requiredYes') : t('privacy.dataProcessing.table.requiredNo')}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Third Party Services */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {t('privacy.thirdParty.title')}
                </CardTitle>
                <CardDescription>
                  {t('privacy.thirdParty.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {thirdPartyServices.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{service.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>{t('privacy.thirdParty.purposeLabel')}：</strong>{service.purpose}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>{t('privacy.thirdParty.dataTypesLabel')}：</strong>{service.dataTypes}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Important Notices */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {t('privacy.notices.children')}
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {t('privacy.notices.changes')}
              </AlertDescription>
            </Alert>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {t('privacy.notices.crossBorder')}
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Contact Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                {t('privacy.contact.title')}
              </h2>
              <p className="text-xl opacity-90 mb-8">
                {t('privacy.contact.description')}
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center justify-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span>{t('privacy.contact.email')}</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span>{t('privacy.contact.phone')}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    {t('privacy.contact.contactUs')}
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    {t('privacy.contact.manageData')}
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