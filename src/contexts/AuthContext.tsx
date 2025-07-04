import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { auth, supabase } from '../lib/supabase'
import { User } from '../types/database'
import { performMigration } from '../utils/dataMigration'

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  session: Session | null
  loading: boolean
  migrationCompleted: boolean
  signInWithGitHub: () => Promise<void>
  signOut: () => Promise<void>
  canCreateDashboard: () => boolean
  isFreeTier: () => boolean
  isPremiumTier: () => boolean
  dashboardLimit: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [migrationCompleted, setMigrationCompleted] = useState(false)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          return
        }
        
        setSession(session)
        setSupabaseUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error in getSession:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        
        setSession(session)
        setSupabaseUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return
      }

      setUser(data)

      // Perform migration for new users (only if not already completed)
      if (!migrationCompleted) {
        try {
          const migrationResult = await performMigration(userId)
          console.log('Migration result:', migrationResult)
        } catch (migrationError) {
          console.error('Migration failed:', migrationError)
        } finally {
          setMigrationCompleted(true)
        }
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
    }
  }

  const signInWithGitHub = async () => {
    try {
      setLoading(true)
      const { error } = await auth.signInWithGitHub()
      if (error) {
        console.error('Error signing in with GitHub:', error)
        alert('Error signing in with GitHub. Please try again.')
      }
    } catch (error) {
      console.error('Error in signInWithGitHub:', error)
      alert('Error signing in with GitHub. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      }
      
      setUser(null)
      setSupabaseUser(null)
      setSession(null)
    } catch (error) {
      console.error('Error in signOut:', error)
    } finally {
      setLoading(false)
    }
  }

  const canCreateDashboard = () => {
    if (!user) return false
    if (user.tier === 'premium') return true
    // For free users, we'll check the actual count in the dashboard creation logic
    return true // We allow the attempt, the database trigger will enforce the limit
  }

  const isFreeTier = () => user?.tier === 'free'
  const isPremiumTier = () => user?.tier === 'premium'

  const dashboardLimit = user?.tier === 'premium' ? Infinity : 3

  const value: AuthContextType = {
    user,
    supabaseUser,
    session,
    loading,
    migrationCompleted,
    signInWithGitHub,
    signOut,
    canCreateDashboard,
    isFreeTier,
    isPremiumTier,
    dashboardLimit
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 