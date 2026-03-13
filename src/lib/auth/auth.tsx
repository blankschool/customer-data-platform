import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'

import { getSupabaseBrowserEnv, hasSupabaseBrowserEnv } from '@/lib/supabase/env'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { buildAuthIdentity } from './identity'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'misconfigured'

type AuthContextValue = {
  status: AuthStatus
  session: Session | null
  user: User | null
  errorMessage: string | null
  workspaceSlug: string | null
  signInWithPassword: (email: string, password: string) => Promise<void>
  signInWithMagicLink: (email: string) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getInitialWorkspaceSlug() {
  if (!hasSupabaseBrowserEnv()) return null
  return getSupabaseBrowserEnv().workspaceSlug ?? null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(
    hasSupabaseBrowserEnv() ? 'loading' : 'misconfigured',
  )
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(
    hasSupabaseBrowserEnv()
      ? null
      : 'Ambiente Supabase ausente. Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.',
  )

  useEffect(() => {
    if (!hasSupabaseBrowserEnv()) return

    const supabase = getSupabaseBrowserClient()
    let isMounted = true

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return

      startTransition(() => {
        if (error) {
          setErrorMessage(error.message)
          setSession(null)
          setUser(null)
          setStatus('unauthenticated')
          return
        }

        setErrorMessage(null)
        setSession(data.session)
        setUser(data.session?.user ?? null)
        setStatus(data.session ? 'authenticated' : 'unauthenticated')
      })
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return

      startTransition(() => {
        setSession(nextSession)
        setUser(nextSession?.user ?? null)
        setStatus(nextSession ? 'authenticated' : 'unauthenticated')
        setErrorMessage(null)
      })
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      user,
      errorMessage,
      workspaceSlug: getInitialWorkspaceSlug(),
      async signInWithPassword(email: string, password: string) {
        const supabase = getSupabaseBrowserClient()
        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
          setErrorMessage(error.message)
          throw error
        }

        setErrorMessage(null)
      },
      async signInWithMagicLink(email: string) {
        const supabase = getSupabaseBrowserClient()
        const redirectTo = `${window.location.origin}/`
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectTo,
          },
        })

        if (error) {
          setErrorMessage(error.message)
          throw error
        }

        setErrorMessage(null)
      },
      async signOut() {
        const supabase = getSupabaseBrowserClient()
        const { error } = await supabase.auth.signOut()

        if (error) {
          setErrorMessage(error.message)
          throw error
        }

        setErrorMessage(null)
      },
      clearError() {
        setErrorMessage(null)
      },
    }),
    [errorMessage, session, status, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  }

  return context
}

export function useAuthIdentity() {
  const { user } = useAuth()
  return buildAuthIdentity(user)
}
