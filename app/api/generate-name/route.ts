import { NextRequest, NextResponse } from 'next/server'
import { NameGenerator, type NameRequest } from '@/lib/openai'
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase'
import { isDevelopment } from '@/lib/env'
import { z } from 'zod'

// 请求验证 schema
const generateNameSchema = z.object({
  englishName: z.string().min(1, '英文名不能为空').max(50, '英文名长度不能超过50个字符'),
  gender: z.enum(['male', 'female', 'neutral'], { errorMap: () => ({ message: '无效的性别选择' }) }),
  style: z.enum(['traditional', 'modern', 'elegant', 'nature', 'literary'], { errorMap: () => ({ message: '无效的风格选择' }) }),
  preferences: z.object({
    avoidWords: z.array(z.string()).optional(),
    preferredElements: z.array(z.string()).optional(),
    meaningFocus: z.string().optional(),
  }).optional(),
})

// 边缘运行时配置（Cloudflare Pages兼容）
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    // 1. 获取并验证用户身份
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未授权访问', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: '数据服务未配置', code: 'SUPABASE_NOT_CONFIGURED' },
        { status: 503 }
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

    // 2. 解析和验证请求参数
    let requestData: NameRequest
    try {
      const rawData = await request.json()
      requestData = generateNameSchema.parse(rawData)
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
      throw error
    }

    // 3. 检查用户积分
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('credits_remaining, subscription_tier')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: '无法获取用户信息', code: 'USER_NOT_FOUND' },
        { status: 404 }
      )
    }

    if (profile.credits_remaining <= 0) {
      return NextResponse.json(
        {
          error: '积分不足，请购买积分或升级订阅',
          code: 'INSUFFICIENT_CREDITS',
          remainingCredits: 0
        },
        { status: 402 }
      )
    }

    // 4. 检查API密钥
    const openrouterKey = process.env.OPENROUTER_API_KEY
    if (!openrouterKey) {
      console.error('OPENROUTER_API_KEY not configured')
      return NextResponse.json(
        { error: '服务配置错误', code: 'SERVICE_ERROR' },
        { status: 500 }
      )
    }

    // 5. 生成名字
    const generator = new NameGenerator(openrouterKey)

    let generationResult
    try {
      generationResult = await generator.generateNames(requestData, user.id)
    } catch (error) {
      console.error('Name generation failed:', error)

      if (error instanceof Error) {
        if (error.message.includes('budget') || error.message.includes('预算')) {
          return NextResponse.json(
            { error: error.message, code: 'BUDGET_EXCEEDED' },
            { status: 429 }
          )
        }

        if (error.message.includes('timeout') || error.message.includes('超时')) {
          return NextResponse.json(
            { error: '请求超时，请稍后重试', code: 'TIMEOUT' },
            { status: 408 }
          )
        }
      }

      return NextResponse.json(
        { error: 'AI服务暂时不可用，请稍后重试', code: 'AI_SERVICE_ERROR' },
        { status: 503 }
      )
    }

    // 6. 保存生成的名字到数据库
    const savedNames = []
    for (const name of generationResult.names) {
      try {
        const { data: savedName, error: saveError } = await supabase
          .from('names')
          .insert({
            user_id: user.id,
            english_name: requestData.englishName,
            chinese_name: name.chinese,
            pinyin: name.pinyin,
            meaning: name.meaning,
            style: requestData.style,
            generation_type: 'basic',
            source_data: {
              request: requestData,
              generation_id: generationResult.requestId,
              cost: generationResult.totalCost / generationResult.names.length,
              generation_time: generationResult.generationTime
            },
            quality_score: name.qualityScore,
            metadata: {
              cultural_background: name.culturalBackground,
              pronunciation_tips: name.pronunciationTips,
              created_by: 'ai_generator_v1'
            }
          })
          .select()
          .single()

        if (!saveError && savedName) {
          savedNames.push(savedName)
        } else {
          console.error('Failed to save name:', saveError)
        }
      } catch (error) {
        console.error('Error saving name to database:', error)
      }
    }

    // 7. 扣除积分
    const newCredits = profile.credits_remaining - 1
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        credits_remaining: newCredits,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Failed to update credits:', updateError)
      // 不阻断响应，但记录错误
    }

    // 8. 记录使用统计（可选）
    try {
      await supabase
        .from('usage_analytics')
        .insert({
          user_id: user.id,
          event_type: 'name_generation',
          event_data: {
            style: requestData.style,
            gender: requestData.gender,
            names_generated: generationResult.names.length,
            cost: generationResult.totalCost,
            generation_time: generationResult.generationTime,
            request_id: generationResult.requestId
          }
        })
    } catch (analyticsError) {
      console.error('Failed to record analytics:', analyticsError)
      // 不影响主流程
    }

    // 9. 返回结果
    return NextResponse.json({
      success: true,
      data: {
        names: generationResult.names,
        savedNames: savedNames,
        remainingCredits: newCredits,
        generationInfo: {
          requestId: generationResult.requestId,
          generationTime: generationResult.generationTime,
          cost: generationResult.totalCost
        }
      }
    })

  } catch (error) {
    console.error('Unexpected error in generate-name API:', error)

    const message = error instanceof Error ? error.message : undefined

    return NextResponse.json(
      {
        error: '服务器内部错误',
        code: 'INTERNAL_ERROR',
        message: isDevelopment ? message : undefined
      },
      { status: 500 }
    )
  }
}

// GET 方法用于获取API使用统计
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未授权访问', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: '数据服务未配置', code: 'SUPABASE_NOT_CONFIGURED' },
        { status: 503 }
      )
    }

    const supabase = createServiceClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: '认证失败', code: 'AUTH_FAILED' },
        { status: 401 }
      )
    }

    // 获取用户的使用统计
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('credits_remaining, subscription_tier')
      .eq('id', user.id)
      .single()

    // 获取今日生成次数
    const today = new Date().toISOString().split('T')[0]
    const { data: todayUsage, error: usageError } = await supabase
      .from('usage_analytics')
      .select('*')
      .eq('user_id', user.id)
      .eq('event_type', 'name_generation')
      .gte('created_at', `${today}T00:00:00Z`)
      .lt('created_at', `${today}T23:59:59Z`)

    if (usageError) {
      console.warn('Failed to fetch usage analytics:', usageError)
    }

    const todayCount = todayUsage?.length || 0

    // 获取成本统计（如果配置了 OpenRouter API）
    let costStats = null
    try {
      const openrouterKey = process.env.OPENROUTER_API_KEY
      if (openrouterKey) {
        const generator = new NameGenerator(openrouterKey)
        costStats = await generator.getCostStats(user.id)
      }
    } catch (error) {
      console.error('Failed to get cost stats:', error)
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          creditsRemaining: profile?.credits_remaining || 0,
          subscriptionTier: profile?.subscription_tier || 'free'
        },
        usage: {
          todayGenerations: todayCount,
          totalGenerations: todayUsage?.length || 0
        },
        costs: costStats
      }
    })

  } catch (error) {
    console.error('Error fetching usage stats:', error)

    return NextResponse.json(
      {
        error: '获取统计信息失败',
        code: 'STATS_ERROR'
      },
      { status: 500 }
    )
  }
}
