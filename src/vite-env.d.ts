/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
  readonly VITE_SUPABASE_PROJECT_REF?: string
  readonly VITE_SUPABASE_WORKSPACE_SLUG?: string
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY?: string
  readonly VITE_TRPC_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
