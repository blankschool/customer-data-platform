import { existsSync } from 'node:fs'
import path from 'node:path'

type ServerEnv = {
  port: number
  allowedOrigins: string[]
  supabaseUrl: string
  supabaseServiceRoleKey: string
  workspaceSlug?: string
}

let cachedEnv: ServerEnv | null = null
let envLoaded = false

function loadEnvFiles() {
  if (envLoaded) return

  envLoaded = true

  for (const candidate of ['.env.local', '.env']) {
    const filePath = path.resolve(process.cwd(), candidate)

    if (existsSync(filePath)) {
      process.loadEnvFile(filePath)
    }
  }
}

function readEnv(name: string): string | undefined {
  const value = process.env[name]

  if (typeof value !== 'string') return undefined

  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

export function getServerEnv(): ServerEnv {
  loadEnvFiles()

  if (cachedEnv) {
    return cachedEnv
  }

  const supabaseUrl = readEnv('SUPABASE_URL') ?? readEnv('VITE_SUPABASE_URL')
  const supabaseServiceRoleKey = readEnv('SUPABASE_SERVICE_ROLE_KEY')
  const workspaceSlug =
    readEnv('SUPABASE_WORKSPACE_SLUG') ?? readEnv('VITE_SUPABASE_WORKSPACE_SLUG')

  if (readEnv('VITE_SUPABASE_SERVICE_ROLE_KEY')) {
    throw new Error(
      'VITE_SUPABASE_SERVICE_ROLE_KEY must never be exposed. Use SUPABASE_SERVICE_ROLE_KEY on the server only.',
    )
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing server Supabase env. Expected SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.',
    )
  }

  cachedEnv = {
    port: Number.parseInt(readEnv('TRPC_SERVER_PORT') ?? '4000', 10),
    allowedOrigins: (readEnv('TRPC_ALLOWED_ORIGINS') ?? 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    supabaseUrl,
    supabaseServiceRoleKey,
    workspaceSlug,
  }

  return cachedEnv
}
