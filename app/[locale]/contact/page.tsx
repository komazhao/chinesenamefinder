'use client'

export const runtime = 'edge'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  HeadphonesIcon,
  Building2,
  CheckCircle,
  Loader2,
  Book,
  Settings,
  Shield,
  CreditCard,
  ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'
import { Link } from '@/i18n/routing'


export default function ContactPage() {
  const t = useTranslations()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resourceCards = [
    {
      icon: Book,
      title: t('help.categories.quickStart.title'),
      description: t('help.categories.quickStart.description'),
      href: '/generate',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Settings,
      title: t('help.categories.account.title'),
      description: t('help.categories.account.description'),
      href: '/settings',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: CreditCard,
      title: t('help.categories.billing.title'),
      description: t('help.categories.billing.description'),
      href: '/pricing',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Shield,
      title: t('help.categories.privacy.title'),
      description: t('help.categories.privacy.description'),
      href: '/privacy',
      color: 'from-emerald-500 to-emerald-600'
    }
  ]

  const contactMethods = [
    {
      title: t('contact.methods.email.title'),
      description: t('contact.methods.email.description'),
      value: 'support@chinesenamefinder.com',
      icon: Mail,
      action: 'mailto:support@chinesenamefinder.com',
      actionLabel: t('contact.methods.email.action')
    },
    {
      title: t('contact.methods.chat.title'),
      description: t('contact.methods.chat.description'),
      value: t('contact.methods.chat.value'),
      icon: MessageCircle,
      action: '#feedback-form',
      actionLabel: t('help.quickActions.contact.action')
    },
    {
      title: t('contact.methods.phone.title'),
      description: t('contact.methods.phone.description'),
      value: '+86 400-123-4567',
      icon: Phone,
      action: 'tel:+8640012334567',
      actionLabel: t('help.quickActions.contact.action')
    },
    {
      title: t('contact.methods.address.title'),
      description: t('contact.methods.address.description'),
      value: t('contact.methods.address.value'),
      icon: MapPin
    }
  ]

  const supportHours = [
    { day: t('contact.supportHours.weekdays.days'), time: t('contact.supportHours.weekdays.hours'), type: t('contact.supportHours.weekdays.type') },
    { day: t('contact.supportHours.weekends.days'), time: t('contact.supportHours.weekends.hours'), type: t('contact.supportHours.weekends.type') },
    { day: t('contact.supportHours.holidays.days'), time: t('contact.supportHours.holidays.hours'), type: t('contact.supportHours.holidays.type') }
  ]

  const faqItems = [
    {
      question: t('contact.faq.items.password.question'),
      answer: t('contact.faq.items.password.answer')
    },
    {
      question: t('contact.faq.items.credits.question'),
      answer: t('contact.faq.items.credits.answer')
    },
    {
      question: t('contact.faq.items.refund.question'),
      answer: t('contact.faq.items.refund.answer')
    },
    {
      question: t('contact.faq.items.support.question'),
      answer: t('contact.faq.items.support.answer')
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In a real implementation, you would send the form data to your API
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      toast.success(t('contact.form.success'))
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: ''
      })
    } catch {
      toast.error(t('contact.form.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-red-50/20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              {t('navigation.contact')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t('contact.description')}
            </p>
          </div>
        </section>

        {/* Self-Service Resources */}
        <section id="self-service" className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">{t('help.categories.title')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resourceCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <Link key={index} href={card.href}>
                    <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {card.title}
                          </CardTitle>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          {card.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">{t('contact.methods.title')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => {
                const Icon = method.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{method.title}</CardTitle>
                      <CardDescription>{method.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="font-medium text-primary mb-4">{method.value}</p>
                      {method.action && method.actionLabel && (
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <a href={method.action}>
                            {method.actionLabel}
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact Form and Support Hours */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card id="feedback-form">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Send className="w-6 h-6" />
                  {t('contact.form.title')}
                </CardTitle>
                <CardDescription>
                  {t('contact.form.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('contact.form.name')} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder={t('contact.form.namePlaceholder')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('contact.form.email')} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder={t('contact.form.emailPlaceholder')}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">{t('contact.form.category')}</Label>
                    <Select onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('contact.form.categoryPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">{t('contact.form.categories.technical')}</SelectItem>
                        <SelectItem value="billing">{t('contact.form.categories.billing')}</SelectItem>
                        <SelectItem value="feature">{t('contact.form.categories.feature')}</SelectItem>
                        <SelectItem value="partnership">{t('contact.form.categories.partnership')}</SelectItem>
                        <SelectItem value="other">{t('contact.form.categories.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">{t('contact.form.subject')} *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder={t('contact.form.subjectPlaceholder')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('contact.form.message')} *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder={t('contact.form.messagePlaceholder')}
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('contact.form.sending')}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t('contact.form.send')}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Support Hours and FAQ */}
            <div className="space-y-6">
              {/* Support Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {t('contact.supportHours.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('contact.supportHours.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {supportHours.map((hour, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">{hour.day}</p>
                          <p className="text-sm text-muted-foreground">{hour.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary">{hour.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <HeadphonesIcon className="w-5 h-5" />
                    {t('contact.faq.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('contact.faq.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {faqItems.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-medium text-sm">{item.question}</h4>
                        <p className="text-sm text-muted-foreground">{item.answer}</p>
                        {index !== faqItems.length - 1 && <hr className="my-3" />}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <a href="#self-service">
                      {t('contact.faq.viewAll')}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Enterprise Contact */}
        <section className="container mx-auto px-4 py-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                {t('contact.enterprise.title')}
              </h2>
              <p className="text-xl opacity-90 mb-6">
                {t('contact.enterprise.description')}
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium">{t('contact.enterprise.features.manager.title')}</p>
                    <p className="text-sm opacity-75">{t('contact.enterprise.features.manager.description')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium">{t('contact.enterprise.features.custom.title')}</p>
                    <p className="text-sm opacity-75">{t('contact.enterprise.features.custom.description')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium">{t('contact.enterprise.features.priority.title')}</p>
                    <p className="text-sm opacity-75">{t('contact.enterprise.features.priority.description')}</p>
                  </div>
                </div>
              </div>
              <Button variant="secondary" size="lg">
                <Mail className="mr-2 h-4 w-4" />
                {t('contact.enterprise.contact')}
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Response Promise */}
        <section className="container mx-auto px-4 pb-16">
          <Alert className="max-w-4xl mx-auto border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>{t('contact.promise.title')}</strong>
              {t('contact.promise.description')}
            </AlertDescription>
          </Alert>
        </section>
      </div>
      <Footer />
    </>
  )
}
