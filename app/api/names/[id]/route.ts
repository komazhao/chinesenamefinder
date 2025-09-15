import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { z } from 'zod'

export const runtime = 'edge'

// 获取单个名字详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const nameId = params.id

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

    // 获取名字详情
    const { data: name, error: nameError } = await supabase
      .from('names')
      .select('*')
      .eq('id', nameId)
      .eq('user_id', user.id)
      .single()

    if (nameError || !name) {
      return NextResponse.json(
        { error: '名字不存在或无权限访问', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: name
    })

  } catch (error) {
    console.error('Error in name GET:', error)
    return NextResponse.json(
      { error: '服务器内部错误', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

// 更新名字信息
const updateNameSchema = z.object({
  meaning: z.string().optional(),
  is_favorite: z.boolean().optional(),
  metadata: z.record(z.any()).optional()
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const nameId = params.id

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
    const validatedData = updateNameSchema.parse(rawData)

    // 更新名字
    const { data: updatedName, error: updateError } = await supabase
      .from('names')
      .update(validatedData)
      .eq('id', nameId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError || !updatedName) {
      console.error('Error updating name:', updateError)
      return NextResponse.json(
        { error: '更新名字失败', code: 'UPDATE_ERROR' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedName
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

    console.error('Error in name PATCH:', error)
    return NextResponse.json(
      { error: '服务器内部错误', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

// 删除名字
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const nameId = params.id

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

    // 删除名字
    const { error: deleteError } = await supabase
      .from('names')
      .delete()
      .eq('id', nameId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting name:', deleteError)
      return NextResponse.json(
        { error: '删除名字失败', code: 'DELETE_ERROR' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '名字已删除'
    })

  } catch (error) {
    console.error('Error in name DELETE:', error)
    return NextResponse.json(
      { error: '服务器内部错误', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}