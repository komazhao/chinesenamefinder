import type Stripe from 'stripe'
import { currentStage } from '@/lib/env'

// 确保 Stripe 密钥存在
const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim()
if (!stripeSecretKey) {
  const message = 'STRIPE_SECRET_KEY is not defined in environment variables'
  console.warn(`${message}; current stage: ${currentStage}`)
}

export const isStripeConfigured = Boolean(stripeSecretKey)

// 使用动态导入，避免 Edge Worker 启动时加载 Node-only 依赖
const getStripeClient = async (): Promise<Stripe> => {
  if (!stripeSecretKey) {
    throw new Error(`Stripe client unavailable (missing STRIPE_SECRET_KEY, stage: ${currentStage})`)
  }
  const { default: Stripe } = await import('stripe')
  const httpClientFactory = (Stripe as unknown as { createFetchHttpClient?: () => unknown })
    .createFetchHttpClient
  const client = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
    typescript: true,
    // 使用 fetch HttpClient 以兼容 Cloudflare Workers（Edge Runtime）
    httpClient: httpClientFactory ? (httpClientFactory() as never) : undefined,
  }) as unknown as Stripe
  return client
}

// 定价计划配置
export const PRICING_PLANS = {
  basic: {
    name: '基础版',
    credits: 20,
    price: 999, // $9.99 in cents
    description: '无限基础命名、文化解释、发音音频',
    features: [
      '无限基础命名',
      '文化解释',
      '发音音频',
      '名字收藏',
      '无水印下载'
    ],
    stripePriceId: process.env.STRIPE_BASIC_PRICE_ID || 'price_basic'
  },
  standard: {
    name: '标准版',
    credits: 50,
    price: 1999, // $19.99 in cents
    description: '包含基础版所有功能，加五行命名',
    features: [
      '所有基础功能',
      '五行命名',
      '诗意命名',
      '优先支持',
      '发音评测'
    ],
    stripePriceId: process.env.STRIPE_STANDARD_PRICE_ID || 'price_standard'
  },
  premium: {
    name: '专业版',
    credits: 100,
    price: 3499, // $34.99 in cents
    description: '包含所有功能，无限制使用',
    features: [
      '所有功能',
      '无限制生成',
      '专家咨询',
      'AI书法生成',
      '商用授权',
      '优先支持'
    ],
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium'
  }
} as const

export type PlanType = keyof typeof PRICING_PLANS

// 创建 Checkout Session
export async function createCheckoutSession({
  planType,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
}: {
  planType: PlanType
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
}): Promise<Stripe.Checkout.Session> {
  const plan = PRICING_PLANS[planType]

  if (!plan) {
    throw new Error(`Invalid plan type: ${planType}`)
  }

  const stripeClient = await getStripeClient()

  try {
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.name} - ${plan.credits}个积分`,
              description: plan.description,
              metadata: {
                plan_type: planType,
                credits: plan.credits.toString()
              }
            },
            unit_amount: plan.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: {
        user_id: userId,
        plan_type: planType,
        credits: plan.credits.toString(),
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      invoice_creation: {
        enabled: true,
      },
    })

    return session
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    throw new Error('创建支付会话失败')
  }
}

// 创建订阅（月付/年付）
export async function createSubscriptionSession({
  planType,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
  isYearly = false
}: {
  planType: PlanType
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
  isYearly?: boolean
}): Promise<Stripe.Checkout.Session> {
  const plan = PRICING_PLANS[planType]

  if (!plan) {
    throw new Error(`Invalid plan type: ${planType}`)
  }

  // 年付享受8折优惠
  const price = isYearly ? Math.floor(plan.price * 12 * 0.8) : plan.price

  const stripeClient = await getStripeClient()

  try {
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.name}${isYearly ? '年付套餐' : '月付套餐'}`,
              description: `${plan.description}${isYearly ? '（年付8折优惠）' : ''}`,
            },
            unit_amount: price,
            recurring: {
              interval: isYearly ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: {
        user_id: userId,
        plan_type: planType,
        credits: plan.credits.toString(),
        billing_interval: isYearly ? 'yearly' : 'monthly',
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    })

    return session
  } catch (error) {
    console.error('Error creating Stripe subscription session:', error)
    throw new Error('创建订阅会话失败')
  }
}

// 获取客户信息
export async function getCustomer(customerId: string): Promise<Stripe.Customer | null> {
  const stripeClient = await getStripeClient()

  try {
    const customer = await stripeClient.customers.retrieve(customerId)
    return customer as Stripe.Customer
  } catch (error) {
    console.error('Error fetching customer:', error)
    return null
  }
}

// 获取订阅信息
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
  const stripeClient = await getStripeClient()

  try {
    const subscription = await stripeClient.subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return null
  }
}

// 取消订阅
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  const stripeClient = await getStripeClient()

  try {
    const subscription = await stripeClient.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })
    return subscription
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw new Error('取消订阅失败')
  }
}

// 构造 Webhook 事件
export async function constructWebhookEvent(
  body: string | Buffer,
  signature: string,
  secret: string
): Promise<Stripe.Event> {
  try {
    const { default: Stripe } = await import('stripe')
    const webhooks = (Stripe as unknown as {
      webhooks: {
        constructEvent: (
          body: string | Buffer,
          signature: string,
          secret: string
        ) => Stripe.Event
      }
    }).webhooks
    // 纯计算（基于 HMAC），不发起网络请求
    return webhooks.constructEvent(body, signature, secret) as Stripe.Event
  } catch (error) {
    console.error('Error constructing webhook event:', error)
    throw new Error('Webhook 签名验证失败')
  }
}

// 创建 Portal 会话（客户管理订阅）
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  const stripeClient = await getStripeClient()

  try {
    const session = await stripeClient.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })
    return session
  } catch (error) {
    console.error('Error creating portal session:', error)
    throw new Error('创建客户门户失败')
  }
}

// 获取使用情况
export async function getUsageRecord(
  subscriptionItemId: string
): Promise<Stripe.UsageRecordSummary[]> {
  try {
    const stripeClient = await getStripeClient()
    const usageRecords = await stripeClient.subscriptionItems.listUsageRecordSummaries(
      subscriptionItemId,
      { limit: 100 }
    )
    return usageRecords.data
  } catch (error) {
    console.error('Error fetching usage records:', error)
    return []
  }
}

// 格式化金额（从分转换为美元）
export function formatCurrency(amountInCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountInCents / 100)
}

// 验证 Webhook 签名
export async function isValidWebhookSignature(
  body: string | Buffer,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const { default: Stripe } = await import('stripe')
    const webhooks = (Stripe as unknown as {
      webhooks: {
        constructEvent: (
          body: string | Buffer,
          signature: string,
          secret: string
        ) => Stripe.Event
      }
    }).webhooks
    webhooks.constructEvent(body, signature, secret)
    return Promise.resolve(true)
  } catch {
    return Promise.resolve(false)
  }
}
