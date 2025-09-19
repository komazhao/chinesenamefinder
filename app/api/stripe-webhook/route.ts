import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase'
import Stripe from 'stripe'

export const runtime = 'edge'

// Webhook 端点需要原始请求体
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      console.error('Missing stripe-signature header')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // 验证 Webhook 签名
    let event: Stripe.Event
    try {
      event = constructWebhookEvent(body, signature, webhookSecret)
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('Received Stripe event:', event.type, event.id)

    const supabase = createServiceClient()

    // 处理不同类型的事件
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        console.log('Processing completed checkout session:', session.id)

        // 获取相关信息
        const userId = session.client_reference_id || session.metadata?.user_id
        const customerEmail = session.customer_email
        const planType = session.metadata?.plan_type
        const credits = parseInt(session.metadata?.credits || '0')

        if (!userId || !customerEmail || !planType || !credits) {
          console.error('Missing required metadata in session:', {
            userId,
            customerEmail,
            planType,
            credits
          })
          return NextResponse.json(
            { error: 'Missing required metadata' },
            { status: 400 }
          )
        }

        // 更新支付记录状态
        const { error: updatePaymentError } = await supabase
          .from('payments')
          .update({
            status: 'completed'
          })
          .eq('stripe_session_id', session.id)

        if (updatePaymentError) {
          console.error('Failed to update payment status:', updatePaymentError)
        }

        // 为用户添加积分
        try {
          const { error: addCreditsError } = await supabase.rpc('add_credits', {
            user_email: customerEmail,
            credits_to_add: credits
          })

          if (addCreditsError) {
            console.error('Failed to add credits:', addCreditsError)
            throw new Error('Failed to add credits to user account')
          }

          console.log(`Successfully added ${credits} credits to user ${customerEmail}`)

        } catch (error) {
          console.error('Error processing payment completion:', error)
          // 这里可以添加失败处理逻辑，比如发送告警邮件
        }

        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session

        console.log('Processing expired checkout session:', session.id)

        // 更新支付记录状态为失败
        const { error: updateError } = await supabase
          .from('payments')
          .update({
            status: 'failed'
          })
          .eq('stripe_session_id', session.id)

        if (updateError) {
          console.error('Failed to update expired payment status:', updateError)
        }

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        console.log('Payment intent succeeded:', paymentIntent.id)

        // 记录成功的支付意图
        try {
          // 这里可以添加额外的支付成功处理逻辑
          console.log('Payment succeeded for amount:', paymentIntent.amount)
        } catch (error) {
          console.error('Error processing payment intent success:', error)
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        console.log('Payment intent failed:', paymentIntent.id)

        // 处理支付失败
        try {
          // 可以发送失败通知邮件等
          console.log('Payment failed for amount:', paymentIntent.amount)
        } catch (error) {
          console.error('Error processing payment failure:', error)
        }

        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription

        console.log('New subscription created:', subscription.id)

        // 处理订阅创建
        const planType = subscription.metadata?.plan_type
        const userId = subscription.metadata?.user_id

        if (userId && planType) {
          // 更新用户订阅状态
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
              subscription_tier: planType,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)

          if (updateError) {
            console.error('Failed to update subscription tier:', updateError)
          }
        }

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        console.log('Subscription updated:', subscription.id)

        // 处理订阅更新
        const userId = subscription.metadata?.user_id

        if (userId) {
          let newTier = 'free'

          if (subscription.status === 'active') {
            newTier = subscription.metadata?.plan_type || 'basic'
          }

          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
              subscription_tier: newTier,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)

          if (updateError) {
            console.error('Failed to update subscription status:', updateError)
          }
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        console.log('Subscription cancelled:', subscription.id)

        // 处理订阅取消
        const userId = subscription.metadata?.user_id

        if (userId) {
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
              subscription_tier: 'free',
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)

          if (updateError) {
            console.error('Failed to update cancelled subscription:', updateError)
          }
        }

        break
      }

      default:
        console.log('Unhandled event type:', event.type)
        break
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook handler error:', error)

    const message = error instanceof Error ? error.message : undefined

    return NextResponse.json(
      {
        error: 'Webhook handler failed',
        message: process.env.NODE_ENV === 'development' ? message : undefined
      },
      { status: 500 }
    )
  }
}
