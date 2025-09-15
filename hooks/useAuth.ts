'use client'

import { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { UserProfile } from '@/lib/database.types'

interface AuthState {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  error: Error | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    // 获取初始会话
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          setState(prev => ({ ...prev, error, loading: false }))
          return
        }

        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id)
          setState({
            user: session.user,
            profile,
            session,
            loading: false,
            error: null
          })
        } else {
          setState(prev => ({ ...prev, loading: false }))
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Unknown error'),
          loading: false
        }))
      }
    }

    getInitialSession()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'SIGNED_OUT' || !session) {
            setState({
              user: null,
              profile: null,
              session: null,
              loading: false,
              error: null
            })
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            const profile = await fetchUserProfile(session.user.id)
            setState({
              user: session.user,
              profile,
              session,
              loading: false,
              error: null
            })
          }
        } catch (error) {
          setState(prev => ({
            ...prev,
            error: error instanceof Error ? error : new Error('Unknown error'),
            loading: false
          }))
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

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

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setState(prev => ({ ...prev, error, loading: false }))
      throw error
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })

    if (error) {
      setState(prev => ({ ...prev, error, loading: false }))
      throw error
    }
  }

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }))

    const { error } = await supabase.auth.signOut()

    if (error) {
      setState(prev => ({ ...prev, error, loading: false }))
      throw error
    }
  }

  const signInWithGoogle = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      setState(prev => ({ ...prev, error, loading: false }))
      throw error
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!state.user) {
      throw new Error('No authenticated user')
    }

    setState(prev => ({ ...prev, loading: true }))

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', state.user.id)
        .select()
        .single()

      if (error) throw error

      setState(prev => ({
        ...prev,
        profile: data,
        loading: false
      }))

      return data
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Update failed'),
        loading: false
      }))
      throw error
    }
  }

  const refreshProfile = async () => {
    if (!state.user) return null

    const profile = await fetchUserProfile(state.user.id)
    setState(prev => ({ ...prev, profile }))
    return profile
  }

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    updateProfile,
    refreshProfile,
  }
}