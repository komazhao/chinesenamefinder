'use client'

export const runtime = 'edge'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function CallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Processing auth callback...')

        // 获取当前URL参数
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const error = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')

        console.log('URL params:', { code: !!code, error, errorDescription })

        if (error) {
          console.error('OAuth error:', error, errorDescription)
          setStatus('error')
          setMessage(errorDescription || error)
          setTimeout(() => {
            router.push('/auth/login?error=oauth_error')
          }, 3000)
          return
        }

        if (code) {
          console.log('Exchanging code for session...')
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) {
            console.error('Code exchange error:', exchangeError)
            setStatus('error')
            setMessage(exchangeError.message)
            setTimeout(() => {
              router.push('/auth/login?error=callback_failed')
            }, 3000)
            return
          }

          console.log('Code exchange successful:', data)
        }

        // 检查用户是否已登录
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Current session:', !!session)

        if (session?.user) {
          console.log('User authenticated, redirecting to dashboard...')
          setStatus('success')
          setMessage('登录成功！正在跳转...')

          // 确保用户档案存在
          try {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (!profile) {
              // 创建用户档案
              const { error: profileError } = await supabase
                .from('user_profiles')
                .insert({
                  id: session.user.id,
                  email: session.user.email ?? '',
                  display_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null
                })

              if (profileError) {
                console.error('Profile creation error:', profileError)
              }
            }
          } catch (profileError) {
            console.error('Profile handling error:', profileError)
          }

          setTimeout(() => {
            router.push('/dashboard')
          }, 1500)
        } else {
          console.log('No session found, redirecting to login...')
          setStatus('error')
          setMessage('认证失败，请重试')
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
        }
      } catch (error) {
        console.error('Callback error:', error)
        setStatus('error')
        setMessage('处理认证回调时发生错误')
        setTimeout(() => {
          router.push('/auth/login?error=callback_failed')
        }, 3000)
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-red-50/20 px-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h2 className="text-xl font-semibold">正在验证您的账户...</h2>
                <p className="text-sm text-muted-foreground">
                  请稍候，我们正在完成登录过程
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <h2 className="text-xl font-semibold text-green-600">登录成功！</h2>
                <p className="text-sm text-muted-foreground">{message}</p>
              </>
            )}

            {status === 'error' && (
              <>
                <AlertCircle className="h-12 w-12 text-red-500" />
                <h2 className="text-xl font-semibold text-red-600">登录失败</h2>
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
                <p className="text-sm text-muted-foreground">
                  即将重定向到登录页面...
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
