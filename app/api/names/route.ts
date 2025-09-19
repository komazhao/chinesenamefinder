import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase'
import { z } from 'zod'

export const runtime = 'edge'

// 获取用户的名字列表
export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: '数据服务未配置', code: 'SUPABASE_NOT_CONFIGURED' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const style = searchParams.get('style')
    const favorites = searchParams.get('favorites') === 'true'
    const search = searchParams.get('search')

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

    // 构建查询
    let query = supabase
      .from('names')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // 应用过滤器
    if (style) {
      query = query.eq('style', style)
    }

    if (favorites) {
      query = query.eq('is_favorite', true)
    }

    if (search) {
      query = query.or(`chinese_name.ilike.%${search}%,english_name.ilike.%${search}%,meaning.ilike.%${search}%`)
    }

    // 分页
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: names, error: namesError } = await query

    if (namesError) {
      console.error('Error fetching names:', namesError)
      return NextResponse.json(
        { error: '获取名字列表失败', code: 'FETCH_ERROR' },
        { status: 500 }
      )
    }

    // 获取总数量（用于分页）
    let countQuery = supabase
      .from('names')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (style) countQuery = countQuery.eq('style', style)
    if (favorites) countQuery = countQuery.eq('is_favorite', true)
    if (search) {
      countQuery = countQuery.or(`chinese_name.ilike.%${search}%,english_name.ilike.%${search}%,meaning.ilike.%${search}%`)
    }

    const { count } = await countQuery

    return NextResponse.json({
      success: true,
      data: {
        names: names || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    })

  } catch (error) {
    console.error('Error in names GET:', error)
    return NextResponse.json(
      { error: '服务器内部错误', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

// 创建新名字（手动添加）
const createNameSchema = z.object({
  english_name: z.string().min(1).max(50),
  chinese_name: z.string().min(1).max(10),
  pinyin: z.string().min(1).max(50),
  meaning: z.string().optional(),
  style: z.enum(['traditional', 'modern', 'elegant', 'nature', 'literary']),
  is_favorite: z.boolean().optional()
})

export async function POST(request: NextRequest) {
  try {
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

    // 验证请求数据
    const rawData = await request.json()
    const validatedData = createNameSchema.parse(rawData)

    // 创建名字记录
    const { data: newName, error: createError } = await supabase
      .from('names')
      .insert({
        user_id: user.id,
        ...validatedData,
        generation_type: 'manual',
        source_data: {
          created_by: 'user_manual',
          created_at: new Date().toISOString()
        },
        metadata: {
          manual_entry: true
        }
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating name:', createError)
      return NextResponse.json(
        { error: '创建名字失败', code: 'CREATE_ERROR' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newName
    }, { status: 201 })

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

    console.error('Error in names POST:', error)
    return NextResponse.json(
      { error: '服务器内部错误', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
