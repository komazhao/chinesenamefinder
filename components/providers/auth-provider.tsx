'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { UserProfile } from '@/lib/database.types'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  error: Error | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ data: any; error: Error | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>
  refreshProfile: () => Promise<UserProfile | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // 获取用户档案
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      return null
    }
  }

  // 初始化认证状态
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 获取当前会话
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          setError(error)
          setLoading(false)
          return
        }

        if (session?.user) {
          setUser(session.user)
          setSession(session)
          const profileData = await fetchUserProfile(session.user.id)
          setProfile(profileData)
        }

        setLoading(false)
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'))
        setLoading(false)
      }
    }

    initializeAuth()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true)
        setError(null)

        try {
          if (event === 'SIGNED_OUT' || !session) {
            setUser(null)
            setProfile(null)
            setSession(null)
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            setUser(session.user)
            setSession(session)
            const profileData = await fetchUserProfile(session.user.id)
            setProfile(profileData)
          }
        } catch (error) {
          setError(error instanceof Error ? error : new Error('Auth state change error'))
        } finally {
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // 登录
  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      // 检查是否使用占位符配置
      if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('placeholder')) {
        throw new Error('Supabase未正确配置：请在.env.local中设置真实的SUPABASE密钥')
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Sign in failed')
      setError(authError)
      throw authError
    } finally {
      setLoading(false)
    }
  }

  // 注册
  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true)
    setError(null)

    try {
      // 检查是否使用占位符配置
      if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('placeholder')) {
        throw new Error('Supabase未正确配置：请在.env.local中设置真实的SUPABASE密钥')
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          }
        }
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Sign up failed')
      setError(authError)
      return { data: null, error: authError }
    } finally {
      setLoading(false)
    }
  }

  // 登出
  const signOut = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Sign out failed')
      setError(authError)
      throw authError
    } finally {
      setLoading(false)
    }
  }

  // Google 登录
  const signInWithGoogle = async () => {
    setLoading(true)
    setError(null)

    try {
      // 检查是否使用占位符配置
      if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('placeholder')) {
        throw new Error('Supabase未正确配置：请在.env.local中设置真实的SUPABASE密钥')
      }

      const currentUrl = window.location.origin
      const locale = window.location.pathname.startsWith('/zh') ? 'zh' : 'en'

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${currentUrl}/${locale}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) throw error
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Google sign in failed')
      setError(authError)
      setLoading(false)
      throw authError
    }
  }

  // 更新用户档案
  const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    if (!user) {
      throw new Error('No authenticated user')
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      setProfile(data)
      return data
    } catch (error) {
      const updateError = error instanceof Error ? error : new Error('Profile update failed')
      setError(updateError)
      throw updateError
    } finally {
      setLoading(false)
    }
  }

  // 刷新用户档案
  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null

    try {
      const profileData = await fetchUserProfile(user.id)
      setProfile(profileData)
      return profileData
    } catch (error) {
      console.error('Error refreshing profile:', error)
      return null
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    updateProfile,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}