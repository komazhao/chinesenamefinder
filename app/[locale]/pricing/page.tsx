'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  name: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  period?: string
  credits: number
  features: string[]
  limitations?: string[]
  recommended?: boolean
  icon: React.ElementType
}

export default function PricingPage() {
  const router = useRouter()
  const { user, profile } = useAuth()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'one-time'>('one-time')

  const oneTimePlans: PricingPlan[] = [
    {
      id: 'basic',
      name: '基础包',
      description: '适合尝试服务的新用户',
      price: 9.99,
      currency: '$',
      credits: 20,
      icon: Sparkles,
      features: [
        '20次AI起名机会',
        '5种命名风格',
        '基础文化解释',
        '名字收藏功能',
        '导出PDF报告',
        '30天有效期'
      ],
      limitations: [
        '不含五行分析',
        '不含诗意命名',
        '无优先支持'
      ]
    },
    {
      id: 'standard',
      name: '标准包',
      description: '最受欢迎的选择',
      price: 19.99,
      originalPrice: 24.99,
      currency: '$',
      credits: 50,
      icon: Zap,
      recommended: true,
      features: [
        '50次AI起名机会',
        '全部命名风格',
        '深度文化解释',
        '五行八字分析',
        '名字收藏无限制',
        '导出多种格式',
        '60天有效期',
        '邮件支持'
      ],
      limitations: [
        '不含定制服务'
      ]
    },
    {
      id: 'premium',
      name: '高级包',
      description: '为专业需求设计',
      price: 34.99,
      originalPrice: 49.99,
      currency: '$',
      credits: 100,
      icon: Crown,
      features: [
        '100次AI起名机会',
        '全部高级功能',
        '深度文化+历史解释',
        '完整五行八字分析',
        '诗意命名系统',
        '智能推荐算法',
        '批量生成模式',
        '90天有效期',
        '优先邮件支持',
        'API访问权限'
      ]
    }
  ]

  const monthlyPlans: PricingPlan[] = [
    {
      id: 'monthly-pro',
      name: '专业版',
      description: '每月订阅，随时取消',
      price: 29.99,
      currency: '$',
      period: '/月',
      credits: 200,
      icon: Zap,
      features: [
        '每月200次起名',
        '全部功能解锁',
        '优先生成队列',
        '专属客服支持',
        '数据分析报告',
        '团队协作功能',
        '自定义品牌',
        'API无限调用'
      ]
    },
    {
      id: 'monthly-enterprise',
      name: '企业版',
      description: '为团队和企业定制',
      price: 99.99,
      currency: '$',
      period: '/月',
      credits: 1000,
      icon: Crown,
      recommended: true,
      features: [
        '无限次起名',
        '全部高级功能',
        '专属账户经理',
        '定制化服务',
        'SLA保证',
        '批量API接口',
        '数据导出工具',
        '培训和咨询',
        '发票和报销'
      ]
    }
  ]

  const handlePurchase = async (plan: PricingPlan) => {
    if (!user) {
      toast.error('请先登录')
      router.push('/auth/login')
      return
    }

    setIsLoading(plan.id)

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
  }

  const plans = billingPeriod === 'monthly' ? monthlyPlans : oneTimePlans

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-red-50/20">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              定价方案
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              选择适合您的
              <span className="text-gradient bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent"> 起名方案</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              无论您是个人用户还是企业客户，我们都有适合的方案。所有方案均包含AI智能起名和文化解释功能。
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-8">
            <Tabs value={billingPeriod} onValueChange={(v) => setBillingPeriod(v as 'monthly' | 'one-time')}>
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="one-time">一次性购买</TabsTrigger>
                <TabsTrigger value="monthly">
                  月度订阅
                  <Badge className="ml-2" variant="secondary">省30%</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon
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
                        最受欢迎
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8 pt-6">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
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
                          原价 {plan.currency}{plan.originalPrice}
                        </p>
                      )}
                      <p className="text-sm font-medium text-primary mt-2">
                        {plan.credits} 次起名机会
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.limitations?.map((limitation, index) => (
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
                          处理中...
                        </>
                      ) : (
                        <>
                          立即购买
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
                  <h3 className="font-semibold mb-2">免费体验</h3>
                  <p className="text-sm text-muted-foreground">
                    新用户注册即可获得 <span className="font-medium text-foreground">5次免费起名机会</span>，
                    体验我们的AI起名服务。无需信用卡，立即开始！
                  </p>
                  {!user && (
                    <Button className="mt-4" variant="outline" asChild>
                      <a href="/auth/register">
                        免费注册
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
            <h2 className="text-2xl font-bold text-center mb-8">常见问题</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">积分会过期吗？</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    一次性购买的积分有效期如方案所示（30-90天）。月度订阅的积分每月重置。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">可以退款吗？</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    我们提供7天无理由退款保证。如果您不满意，可以申请全额退款。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">如何升级方案？</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    您可以随时在账户设置中升级方案。升级后立即生效，未使用的积分会保留。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">支持哪些支付方式？</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    我们支持信用卡、借记卡、支付宝、微信支付等多种支付方式。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-4">受到全球用户信赖</p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">SSL安全加密</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Stripe安全支付</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">GDPR合规</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">7天退款保证</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}