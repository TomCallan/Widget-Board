export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          github_id: number
          email: string
          username: string
          avatar_url: string | null
          full_name: string | null
          tier: 'free' | 'premium'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          github_id: number
          email: string
          username: string
          avatar_url?: string | null
          full_name?: string | null
          tier?: 'free' | 'premium'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          github_id?: number
          email?: string
          username?: string
          avatar_url?: string | null
          full_name?: string | null
          tier?: 'free' | 'premium'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      dashboards: {
        Row: {
          id: string
          user_id: string
          name: string
          widgets: Json
          color_scheme: string
          locked: boolean | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          widgets?: Json
          color_scheme?: string
          locked?: boolean | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          widgets?: Json
          color_scheme?: string
          locked?: boolean | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboards_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      dashboard_shares: {
        Row: {
          id: string
          dashboard_id: string
          shared_by_user_id: string
          shared_with_user_id: string | null
          share_token: string | null
          permissions: 'view' | 'edit'
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          dashboard_id: string
          shared_by_user_id: string
          shared_with_user_id?: string | null
          share_token?: string | null
          permissions?: 'view' | 'edit'
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          dashboard_id?: string
          shared_by_user_id?: string
          shared_with_user_id?: string | null
          share_token?: string | null
          permissions?: 'view' | 'edit'
          expires_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_shares_dashboard_id_fkey"
            columns: ["dashboard_id"]
            referencedRelation: "dashboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_shares_shared_by_user_id_fkey"
            columns: ["shared_by_user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_shares_shared_with_user_id_fkey"
            columns: ["shared_with_user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_tier: 'free' | 'premium'
      permission_type: 'view' | 'edit'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for our application
export type User = Database['public']['Tables']['users']['Row']
export type Dashboard = Database['public']['Tables']['dashboards']['Row']
export type DashboardShare = Database['public']['Tables']['dashboard_shares']['Row']
export type UserSettings = Database['public']['Tables']['user_settings']['Row'] 