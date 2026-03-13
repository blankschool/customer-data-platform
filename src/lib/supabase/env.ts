type BrowserSupabaseEnv = {
  url: string
  publishableKey: string
  projectRef?: string
  workspaceSlug?: string
}

function readEnv(name: keyof ImportMetaEnv): string | undefined {
  const value = import.meta.env[name]

  if (typeof value !== 'string') return undefined

  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

export function hasSupabaseBrowserEnv(): boolean {
  return Boolean(
    readEnv('VITE_SUPABASE_URL') && readEnv('VITE_SUPABASE_PUBLISHABLE_KEY'),
  )
}

export function getSupabaseBrowserEnv(): BrowserSupabaseEnv {
  const url = readEnv('VITE_SUPABASE_URL')
  const publishableKey = readEnv('VITE_SUPABASE_PUBLISHABLE_KEY')
  const leakedServiceRole = readEnv('VITE_SUPABASE_SERVICE_ROLE_KEY')

  if (leakedServiceRole) {
    throw new Error(
      'VITE_SUPABASE_SERVICE_ROLE_KEY must never be exposed to the browser.',
    )
  }

  if (!url || !publishableKey) {
    throw new Error(
      'Missing Supabase browser env. Expected VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
    )
  }

  return {
    url,
    publishableKey,
    projectRef: readEnv('VITE_SUPABASE_PROJECT_REF'),
    workspaceSlug: readEnv('VITE_SUPABASE_WORKSPACE_SLUG'),
  }
}
