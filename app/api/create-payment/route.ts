import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, PRICING_PLANS, isStripeConfigured } from '@/lib/stripe'
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase'
import { isDevelopment } from '@/lib/env'
import { z } from 'zod'


const createPaymentSchema = z.object({
  planType: z.enum(['basic', 'standard', 'premium'] as const),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
})

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured) {
      return NextResponse.json(
        { error: '支付服务未启用', code: 'STRIPE_NOT_CONFIGURED' },
        { status: 503 }
      )
    }

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: '数据服务未配置', code: 'SUPABASE_NOT_CONFIGURED' },
        { status: 503 }
      )
    }

    // 验证用户身份
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未授权访问', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createServiceClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: '认证失败', code: 'AUTH_FAILED' },
        { status: 401 }
      )
    }

    // 获取用户邮箱
    const userEmail = user.email
    if (!userEmail) {
      return NextResponse.json(
        { error: '用户邮箱信息缺失', code: 'NO_EMAIL' },
        { status: 400 }
      )
    }

    // 验证请求参数
    const rawData = await request.json()
    const { planType, successUrl, cancelUrl } = createPaymentSchema.parse(rawData)

    // 验证计划是否存在
    const plan = PRICING_PLANS[planType]
    if (!plan) {
      return NextResponse.json(
        { error: '无效的订阅计划', code: 'INVALID_PLAN' },
        { status: 400 }
      )
    }

    // 获取站点URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin') || 'http://localhost:3000'

    // 创建 Stripe Checkout 会话
    const session = await createCheckoutSession({
      planType,
      userId: user.id,
      userEmail,
      successUrl: successUrl || `${siteUrl}/dashboard?success=true`,
      cancelUrl: cancelUrl || `${siteUrl}/pricing?canceled=true`,
    })

    // 记录支付意向到数据库
    try {
      await supabase.from('payments').insert({
        user_id: user.id,
        stripe_session_id: session.id,
        amount_cents: plan.price,
        credits_purchased: plan.credits,
        status: 'pending',
      })
    } catch (dbError) {
      console.error('Failed to record payment intent:', dbError)
      // 不阻断支付流程，但记录错误
    }

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
        plan: {
          name: plan.name,
          credits: plan.credits,
          price: plan.price,
          description: plan.description
        }
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: '请求参数无效',
          code: 'VALIDATION_ERROR',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error('Error creating payment session:', error)

    // 特殊错误处理
    if (error instanceof Error) {
      if (error.message.includes('创建支付会话失败')) {
        return NextResponse.json(
          { error: '支付服务暂时不可用，请稍后重试', code: 'PAYMENT_SERVICE_ERROR' },
          { status: 503 }
        )
      }

      if (error.message.includes('Invalid plan')) {
        return NextResponse.json(
          { error: '无效的订阅计划', code: 'INVALID_PLAN' },
          { status: 400 }
        )
      }
    }

    const message = error instanceof Error ? error.message : undefined

    return NextResponse.json(
      {
        error: '创建支付会话失败',
        code: 'PAYMENT_ERROR',
        message: isDevelopment ? message : undefined
      },
      { status: 500 }
    )
  }
}

// 获取支付状态
export async function GET(request: NextRequest) {
  try {
    if (!isStripeConfigured) {
      return NextResponse.json(
        { error: '支付服务未启用', code: 'STRIPE_NOT_CONFIGURED' },
        { status: 503 }
      )
    }

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: '数据服务未配置', code: 'SUPABASE_NOT_CONFIGURED' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: '缺少会话ID', code: 'MISSING_SESSION_ID' },
        { status: 400 }
      )
    }

    // 验证用户身份
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未授权访问', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createServiceClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: '认证失败', code: 'AUTH_FAILED' },
        { status: 401 }
      )
    }

    // 查询支付记录
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: '支付记录不存在', code: 'PAYMENT_NOT_FOUND' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        payment: {
          id: payment.id,
          status: payment.status,
          amount: payment.amount_cents,
          credits: payment.credits_purchased,
          createdAt: payment.created_at
        }
      }
    })

  } catch (error) {
    console.error('Error fetching payment status:', error)

    return NextResponse.json(
      { error: '获取支付状态失败', code: 'FETCH_ERROR' },
      { status: 500 }
    )
  }
}
