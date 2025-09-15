export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          credits_remaining: number
          preferences: Json | null
          subscription_tier: string
          cultural_preferences: Json | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          credits_remaining?: number
          preferences?: Json | null
          subscription_tier?: string
          cultural_preferences?: Json | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          credits_remaining?: number
          preferences?: Json | null
          subscription_tier?: string
          cultural_preferences?: Json | null
          created_at?: string
          updated_at?: string | null
        }
      }
      names: {
        Row: {
          id: string
          user_id: string
          english_name: string
          chinese_name: string
          pinyin: string
          meaning: string | null
          style: string
          generation_type: string
          source_data: Json | null
          quality_score: number | null
          metadata: Json | null
          is_favorite: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          english_name: string
          chinese_name: string
          pinyin: string
          meaning?: string | null
          style?: string
          generation_type?: string
          source_data?: Json | null
          quality_score?: number | null
          metadata?: Json | null
          is_favorite?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          english_name?: string
          chinese_name?: string
          pinyin?: string
          meaning?: string | null
          style?: string
          generation_type?: string
          source_data?: Json | null
          quality_score?: number | null
          metadata?: Json | null
          is_favorite?: boolean
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          stripe_session_id: string | null
          amount_cents: number
          credits_purchased: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_session_id?: string | null
          amount_cents: number
          credits_purchased: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_session_id?: string | null
          amount_cents?: number
          credits_purchased?: number
          status?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_credits: {
        Args: {
          user_email: string
          credits_to_add: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// 类型别名
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// 实体类型
export type UserProfile = Tables<'user_profiles'>
export type Name = Tables<'names'>
export type Payment = Tables<'payments'>