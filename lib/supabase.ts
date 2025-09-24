import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { currentStage } from '@/lib/env'

const supabaseUrlFromEnv = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseAnonKeyFromEnv = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
const serviceRoleKeyFromEnv = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

const requiredClientVars: Array<[string, string | undefined]> = [
  ['NEXT_PUBLIC_SUPABASE_URL', supabaseUrlFromEnv],
  ['NEXT_PUBLIC_SUPABASE_ANON_KEY', supabaseAnonKeyFromEnv],
]

const missingClientVars = requiredClientVars
  .filter(([, value]) => !value)
  .map(([key]) => key)

if (missingClientVars.length > 0) {
  const message = `Missing Supabase environment variables: ${missingClientVars.join(', ')} (stage: ${currentStage})`

  console.warn(message)
}

export const isSupabaseConfigured = Boolean(
  supabaseUrlFromEnv &&
  supabaseAnonKeyFromEnv &&
  serviceRoleKeyFromEnv
)

// 客户端配置 - 使用占位符以避免构建错误
const supabaseUrl = supabaseUrlFromEnv || 'https://placeholder.supabase.co'
const supabaseAnonKey = supabaseAnonKeyFromEnv || 'placeholder-anon-key'

// 获取站点URL（用于OAuth重定向）
export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // 从环境变量获取
    'https://chinesenamefinder.com' // 生产环境默认值

  // 确保URL包含协议
  url = url.includes('http') ? url : `https://${url}`
  // 确保URL末尾有斜杠
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`

  return url
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
  const serviceKey = serviceRoleKeyFromEnv

  if (!serviceKey) {
    console.warn(`Missing Supabase environment variables: SUPABASE_SERVICE_ROLE_KEY (stage: ${currentStage})`)
    // 返回使用匿名密钥的客户端作为兜底
    return createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
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
