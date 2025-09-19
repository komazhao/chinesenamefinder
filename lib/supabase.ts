import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { currentStage, isDevelopment, isProduction } from '@/lib/env'

// 客户端配置 - 使用占位符以避免构建错误
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// 检查是否为开发环境且缺少配置
const isMissingConfig = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (isMissingConfig) {
  const message = 'Missing Supabase environment variables'

  if (isProduction) {
    throw new Error(`${message} in production environment`)
  }

  if (!isDevelopment) {
    console.warn(`${message}; current stage: ${currentStage}`)
  }
}

// 客户端实例
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// 服务端客户端（用于API路由）
export const createServiceClient = (): SupabaseClient => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceKey) {
    const message = 'Missing SUPABASE_SERVICE_ROLE_KEY environment variable'

    if (isProduction) {
      throw new Error(message)
    }

    throw new Error(`${message} (stage: ${currentStage})`)
  }

  return createClient(
    supabaseUrl,
    serviceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// 管理员客户端（用于管理操作）
export const createAdminClient = (): SupabaseClient => {
  return createServiceClient()
}
