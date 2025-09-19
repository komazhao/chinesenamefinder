import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { currentStage, isDevelopment, isProduction } from '@/lib/env'

const requiredClientVars: Array<[string, string | undefined]> = [
  ['NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL],
  ['NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
]

const missingClientVars = requiredClientVars
  .filter(([, value]) => !value)
  .map(([key]) => key)

if (missingClientVars.length > 0) {
  const message = `Missing Supabase environment variables: ${missingClientVars.join(', ')}`

  if (isProduction) {
    throw new Error(`${message} (stage: ${currentStage})`)
  }

  if (!isDevelopment) {
    console.warn(`${message}; stage: ${currentStage}`)
  }
}

// 客户端配置 - 使用占位符以避免构建错误
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

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
    const message = `Missing Supabase environment variables: SUPABASE_SERVICE_ROLE_KEY (stage: ${currentStage})`

    if (isProduction) {
      throw new Error(message)
    }

    throw new Error(`${message}. 请在部署环境中配置该变量。`)
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
