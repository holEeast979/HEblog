import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// 数据库类型定义
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          count: number
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          count?: number
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          content: string
          category: string
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          title: string
          content: string
          category: string
          tags: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      post_updates: {
        Row: {
          id: string
          post_id: string
          content: string
          description: string
          timestamp: string
        }
        Insert: {
          id: string
          post_id: string
          content: string
          description: string
          timestamp?: string
        }
        Update: {
          id?: string
          post_id?: string
          content?: string
          description?: string
          timestamp?: string
        }
      }
    }
  }
}
