import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase'
import { isDevelopment } from '@/lib/env'
import { z } from 'zod'

// Cloudflare Pages 需要 Edge Runtime

// 请求验证 schema
const generateNameSchema = z.object({
  englishName: z.string().min(1, '英文名不能为空').max(50, '英文名长度不能超过50个字符'),
  gender: z.enum(['male', 'female', 'neutral'], { errorMap: () => ({ message: '无效的性别选择' }) }),
  style: z.enum(['traditional', 'modern', 'elegant', 'nature', 'literary'], { errorMap: () => ({ message: '无效的风格选择' }) }),
  length: z.number().min(2).max(3).optional().default(2),
  meaning: z.string().optional(),
  avoidWords: z.string().optional(),
  birthYear: z.number().optional(),
})

interface GeneratedName {
  id: string
  chinese: string
  pinyin: string
  meaning: string
  culturalContext: string
  suitability: number
  elements?: string[]
}

interface OpenRouterFormData {
  englishName: string
  gender: 'male' | 'female' | 'neutral'
  style: 'traditional' | 'modern' | 'elegant' | 'nature' | 'literary'
  length?: number
  meaning?: string
  avoidWords?: string
  birthYear?: number
}

interface OpenRouterNameResponse {
  chinese?: string
  pinyin?: string
  meaning?: string
  culturalContext?: string
  suitability?: number
}

// OpenRouter API integration
async function generateNamesWithOpenRouter(formData: OpenRouterFormData): Promise<GeneratedName[]> {
  const openRouterApiKey = process.env.OPENROUTER_API_KEY
  const openRouterUrl = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions'

  if (!openRouterApiKey) {
    throw new Error('OpenRouter API key not configured')
  }

  const genderText = formData.gender === 'male' ? '男性' :
                    formData.gender === 'female' ? '女性' : '中性'

  const styleDescriptions = {
    traditional: '传统古典，体现中华文化底蕴，可参考古籍经典',
    modern: '现代时尚，简洁易记，适合当代生活',
    elegant: '优雅高贵，寓意美好，音韵和谐',
    nature: '贴近自然，如山水花鸟，体现自然之美',
    literary: '富有诗意，可引用诗词典故，文学色彩浓厚'
  }

  let prompt = `为英文名"${formData.englishName}"生成3个适合${genderText}的中文名字。

要求：
1. 风格：${styleDescriptions[formData.style as keyof typeof styleDescriptions]}
2. 名字长度：${formData.length}个字
3. 考虑音译和意译结合，确保音韵和谐
4. 每个名字都要有深刻的文化内涵和美好寓意
5. 避免生僻字，确保易读易写`

  if (formData.meaning) {
    prompt += `\n6. 期望寓意：${formData.meaning}`
  }

  if (formData.avoidWords) {
    prompt += `\n7. 避免使用这些字词：${formData.avoidWords}`
  }

  if (formData.birthYear) {
    prompt += `\n8. 出生年份：${formData.birthYear}（可考虑生肖特点）`
  }

  prompt += `\n\n请返回JSON格式，确保JSON格式正确：
{
  "names": [
    {
      "chinese": "中文名字",
      "pinyin": "zhong wen ming zi",
      "meaning": "详细解释名字的含义和文化背景",
      "culturalContext": "文化背景和典故",
      "suitability": 85
    }
  ]
}`

  const systemPrompt = `你是一位专业的中文命名专家，精通中国传统文化、诗词典故和现代命名趋势。

专业能力：
1. 深度理解中华文化内涵，能将英文名的音韵特点与中文字符巧妙结合
2. 精通古典诗词，能引用经典文学作品为名字增添文化底蕴
3. 了解现代社会的命名趋势和审美偏好
4. 能为不同性别、不同风格偏好提供个性化建议

命名原则：
- 音韵和谐：注重声调搭配和读音流畅
- 寓意美好：每个字都有积极正面的含义
- 文化适宜：符合中国传统文化价值观
- 易读易记：避免生僻字，确保实用性
- 个性化：根据用户需求提供独特建议

请始终返回有效的JSON格式，suitability是1-100的匹配度分数。`

  try {
    const response = await fetch(openRouterUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://chinesenamefinder.com',
        'X-Title': 'ChineseNameHub'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9,
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', response.status, errorText)
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('Empty response from OpenRouter')
    }

    const parsedResult = JSON.parse(content) as {
      names?: OpenRouterNameResponse[]
    }

    if (!parsedResult.names || !Array.isArray(parsedResult.names)) {
      throw new Error('Invalid response format from AI')
    }

    return parsedResult.names.map((name, index) => ({
      id: `name_${Date.now()}_${index}`,
      chinese: name.chinese ?? '',
      pinyin: name.pinyin ?? '',
      meaning: name.meaning ?? '',
      culturalContext: name.culturalContext ?? name.meaning ?? '',
      suitability: name.suitability ?? 85,
      elements: []
    }))

  } catch (error) {
    console.error('OpenRouter generation failed:', error)

    // Fallback to mock data for development
    return [
      {
        id: `fallback_${Date.now()}_0`,
        chinese: '文华',
        pinyin: 'wén huá',
        meaning: '文采华丽，寓意才华横溢，文化修养深厚',
        culturalContext: '体现了中华文化对文学才华的重视',
        suitability: 85,
        elements: ['文化', '才华']
      },
      {
        id: `fallback_${Date.now()}_1`,
        chinese: '嘉慧',
        pinyin: 'jiā huì',
        meaning: '嘉美智慧，寓意品德高尚，聪明睿智',
        culturalContext: '体现了中华文化对品德智慧的推崇',
        suitability: 88,
        elements: ['智慧', '品德']
      },
      {
        id: `fallback_${Date.now()}_2`,
        chinese: '志远',
        pinyin: 'zhì yuǎn',
        meaning: '志向远大，寓意胸怀宽广，目标远大',
        culturalContext: '体现了中华文化对远大抱负的赞美',
        suitability: 90,
        elements: ['志向', '远大']
      }
    ]
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. 解析和验证请求参数
    let formData
    try {
      const rawData = await request.json()
      formData = generateNameSchema.parse(rawData)
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

    // 2. 检查用户身份（可选 - 可以允许未登录用户试用）
    const authHeader = request.headers.get('Authorization')
    let user = null
    let profile = null

    if (authHeader && authHeader.startsWith('Bearer ')) {
      if (!isSupabaseConfigured) {
        return NextResponse.json(
          { error: '数据服务未配置', code: 'SUPABASE_NOT_CONFIGURED' },
          { status: 503 }
        )
      }

      const token = authHeader.replace('Bearer ', '')
      const supabase = createServiceClient()

      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)
      if (!authError && authUser) {
        user = authUser

        // 获取用户资料和积分
        const { data: userProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('credits_remaining, subscription_tier')
          .eq('id', user.id)
          .single()

        if (!profileError && userProfile) {
          profile = userProfile

          // 检查积分
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
        }
      }
    }

    // 3. 生成名字
    const generatedNames = await generateNamesWithOpenRouter(formData)

    // 4. 如果用户已登录，保存生成的名字到数据库并扣除积分
    if (user && profile) {
      if (!isSupabaseConfigured) {
        return NextResponse.json(
          { error: '数据服务未配置', code: 'SUPABASE_NOT_CONFIGURED' },
          { status: 503 }
        )
      }

      const supabase = createServiceClient()

      // 保存生成的名字
      const savedNames = []
      for (const name of generatedNames) {
        try {
          const { data: savedName, error: saveError } = await supabase
            .from('names')
            .insert({
              user_id: user.id,
              english_name: formData.englishName,
              chinese_name: name.chinese,
              pinyin: name.pinyin,
              meaning: name.meaning,
              style: formData.style,
              generation_type: 'basic',
              source_data: {
                request: formData,
                generation_id: `openrouter_${Date.now()}`,
                model: 'openai/gpt-4o'
              },
              quality_score: name.suitability,
              metadata: {
                cultural_context: name.culturalContext,
                created_by: 'openrouter_generator_v1'
              }
            })
            .select()
            .single()

          if (!saveError && savedName) {
            savedNames.push(savedName)
          }
        } catch (error) {
          console.error('Error saving name to database:', error)
        }
      }

      // 扣除积分
      const newCredits = profile.credits_remaining - 1
      await supabase
        .from('user_profiles')
        .update({
          credits_remaining: newCredits,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      // 记录使用统计
      try {
        await supabase
          .from('usage_analytics')
          .insert({
            user_id: user.id,
            event_type: 'name_generation',
            event_data: {
              style: formData.style,
              gender: formData.gender,
              names_generated: generatedNames.length,
              model: 'openrouter/gpt-4o'
            }
          })
      } catch (analyticsError) {
        console.error('Failed to record analytics:', analyticsError)
      }

      return NextResponse.json({
        success: true,
        names: generatedNames,
        savedNames: savedNames,
        remainingCredits: newCredits
      })
    }

    // 5. 返回结果（未登录用户）
    return NextResponse.json({
      success: true,
      names: generatedNames,
      message: '登录后可保存名字并获得更多生成次数'
    })

  } catch (error) {
    console.error('Unexpected error in generate API:', error)

    return NextResponse.json(
      {
        error: '服务器内部错误',
        code: 'INTERNAL_ERROR',
        message: isDevelopment ? (error as Error).message : undefined
      },
      { status: 500 }
    )
  }
}

// GET 方法用于获取API使用统计
export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: '数据服务未配置', code: 'SUPABASE_NOT_CONFIGURED' },
        { status: 503 }
      )
    }

    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
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

    // 获取用户的使用统计
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('credits_remaining, subscription_tier')
      .eq('id', user.id)
      .single()

    // 获取今日生成次数
    const today = new Date().toISOString().split('T')[0]
    const { data: todayUsage } = await supabase
      .from('usage_analytics')
      .select('*')
      .eq('user_id', user.id)
      .eq('event_type', 'name_generation')
      .gte('created_at', `${today}T00:00:00Z`)
      .lt('created_at', `${today}T23:59:59Z`)

    const todayCount = todayUsage?.length || 0

    return NextResponse.json({
      success: true,
      data: {
        user: {
          creditsRemaining: profile?.credits_remaining || 0,
          subscriptionTier: profile?.subscription_tier || 'free'
        },
        usage: {
          todayGenerations: todayCount
        }
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
