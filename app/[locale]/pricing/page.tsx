'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Check, X, Sparkles, Zap, Crown, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/components/providers/auth-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { toast } from 'sonner'

interface PricingPlan {
  id: string
  nameKey: string
  descriptionKey: string
  price: number
  originalPrice?: number
  currency: string
  period?: string
  creditsKey: string
  credits: number
  features: string[]
  limitations?: string[]
  recommended?: boolean
  icon: React.ElementType
}

export default function PricingPage() {
  const router = useRouter()
  const { user, profile } = useAuth()
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'one-time'>('one-time')

  const oneTimePlans: PricingPlan[] = [
    {
      id: 'basic',
      nameKey: 'pricing.plans.basic.name',
      descriptionKey: 'pricing.plans.basic.description',
      price: 9.99,
      currency: '$',
      credits: 20,
      creditsKey: 'pricing.plans.basic.credits',
      icon: Sparkles,
      features: t.raw('pricing.plans.basic.features') as string[],
      limitations: t.raw('pricing.plans.basic.limitations') as string[]
    },
    {
      id: 'standard',
      nameKey: 'pricing.plans.standard.name',
      descriptionKey: 'pricing.plans.standard.description',
      price: 19.99,
      originalPrice: 24.99,
      currency: '$',
      credits: 50,
      creditsKey: 'pricing.plans.standard.credits',
      icon: Zap,
      recommended: true,
      features: t.raw('pricing.plans.standard.features') as string[],
      limitations: t.raw('pricing.plans.standard.limitations') as string[]
    },
    {
      id: 'premium',
      nameKey: 'pricing.plans.premium.name',
      descriptionKey: 'pricing.plans.premium.description',
      price: 34.99,
      originalPrice: 49.99,
      currency: '$',
      credits: 100,
      creditsKey: 'pricing.plans.premium.credits',
      icon: Crown,
      features: t.raw('pricing.plans.premium.features') as string[]
    }
  ]

  const monthlyPlans: PricingPlan[] = [
    {
      id: 'monthly-pro',
      nameKey: 'pricing.plans.monthlyPro.name',
      descriptionKey: 'pricing.plans.monthlyPro.description',
      price: 29.99,
      currency: '$',
      period: '/月',
      credits: 200,
      creditsKey: 'pricing.plans.monthlyPro.credits',
      icon: Zap,
      features: t.raw('pricing.plans.monthlyPro.features') as string[]
    },
    {
      id: 'monthly-enterprise',
      nameKey: 'pricing.plans.monthlyEnterprise.name',
      descriptionKey: 'pricing.plans.monthlyEnterprise.description',
      price: 99.99,
      currency: '$',
      period: '/月',
      credits: 1000,
      creditsKey: 'pricing.plans.monthlyEnterprise.credits',
      icon: Crown,
      recommended: true,
      features: t.raw('pricing.plans.monthlyEnterprise.features') as string[]
    }
  ]

  const handlePurchase = async (plan: PricingPlan) => {
    if (!user) {
      toast.error(t('generate.errors.pleaseLogin'))
      router.push('/auth/login')
      return
    }

    setIsLoading(plan.id)

    // Show payment pending message instead of processing Stripe payment
    setTimeout(() => {
      toast.info(t('pricing.paymentPending'))
      setIsLoading(null)
    }, 1000)

    /* Stripe payment code - commented out but preserved
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: plan.id,
          amount: plan.price,
          credits: plan.credits,
        }),
      })

      if (!response.ok) {
        throw new Error('Payment creation failed')
      }

      const { url } = await response.json()
      window.location.href = url // Redirect to Stripe Checkout
    } catch (error) {
      console.error('Purchase error:', error)
      toast.error('购买失败，请稍后重试')
    } finally {
      setIsLoading(null)
    }
    */
  }

  const plans = billingPeriod === 'monthly' ? monthlyPlans : oneTimePlans

  // Helper function to format features array properly
  const getFeatures = (key: string) => {
    const featuresStr = t.raw(key) as string | string[]
    return Array.isArray(featuresStr) ? featuresStr : []
  }

  const getLimitations = (key: string) => {
    try {
      const limitationsStr = t.raw(key) as string | string[]
      return Array.isArray(limitationsStr) ? limitationsStr : []
    } catch {
      return []
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-red-50/20">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              {t('pricing.badge')}
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              {t('pricing.heading')}
              <span className="text-gradient bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent"> {t('pricing.headingHighlight')}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('pricing.description')}
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-8">
            <Tabs value={billingPeriod} onValueChange={(v) => setBillingPeriod(v as 'monthly' | 'one-time')}>
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="one-time">{t('pricing.billingToggle.oneTime')}</TabsTrigger>
                <TabsTrigger value="monthly">
                  {t('pricing.billingToggle.monthly')}
                  <Badge className="ml-2" variant="secondary">{t('pricing.billingToggle.save')}</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon
              const features = getFeatures(plan.nameKey.replace('.name', '.features'))
              const limitations = plan.limitations ? getLimitations(plan.nameKey.replace('.name', '.limitations')) : []

              return (
                <Card
                  key={plan.id}
                  className={`relative ${
                    plan.recommended
                      ? 'border-primary shadow-2xl scale-105'
                      : 'border-border'
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <Badge className="px-3 py-1" variant="default">
                        {t('pricing.mostPopular')}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8 pt-6">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{t(plan.nameKey)}</CardTitle>
                    <CardDescription>{t(plan.descriptionKey)}</CardDescription>
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-lg font-medium text-muted-foreground">{plan.currency}</span>
                        <span className="text-4xl font-bold">{plan.price}</span>
                        {plan.period && (
                          <span className="text-lg font-medium text-muted-foreground">{plan.period}</span>
                        )}
                      </div>
                      {plan.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through mt-1">
                          {t('pricing.plans.standard.originalPrice')} {plan.currency}{plan.originalPrice}
                        </p>
                      )}
                      <p className="text-sm font-medium text-primary mt-2">
                        {t(plan.creditsKey)}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <X className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      size="lg"
                      variant={plan.recommended ? 'default' : 'outline'}
                      onClick={() => handlePurchase(plan)}
                      disabled={isLoading === plan.id}
                    >
                      {isLoading === plan.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('pricing.processing')}
                        </>
                      ) : (
                        <>
                          {t('pricing.purchaseNow')}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {/* Free Tier Info */}
          <Card className="mt-12 max-w-4xl mx-auto bg-muted/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('pricing.freeTrial.title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('pricing.freeTrial.description')} <span className="font-medium text-foreground">{t('pricing.freeTrial.highlight')}</span>
                    {t('pricing.freeTrial.subtitle')}
                  </p>
                  {!user && (
                    <Button className="mt-4" variant="outline" asChild>
                      <a href="/auth/register">
                        {t('pricing.freeTrial.registerButton')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">{t('pricing.faq.title')}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('pricing.faq.items.expiry.question')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t('pricing.faq.items.expiry.answer')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('pricing.faq.items.refund.question')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t('pricing.faq.items.refund.answer')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('pricing.faq.items.upgrade.question')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t('pricing.faq.items.upgrade.answer')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('pricing.faq.items.payment.question')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t('pricing.faq.items.payment.answer')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-4">{t('pricing.trust.title')}</p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">{t('pricing.trust.badges.ssl')}</span>
              </div>
              {/* Commented out Stripe badge
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">{t('pricing.trust.badges.stripe')}</span>
              </div>
              */}
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">{t('pricing.trust.badges.gdpr')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">{t('pricing.trust.badges.guarantee')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}