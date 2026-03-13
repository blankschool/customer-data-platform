import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '../src/lib/supabase/database.types'
import { getServerEnv } from './env'

let adminClient: SupabaseClient<Database> | null = null

export function getSupabaseAdminClient(): SupabaseClient<Database> {
  if (adminClient) {
    return adminClient
  }

  const { supabaseUrl, supabaseServiceRoleKey } = getServerEnv()

  adminClient = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
  })

  return adminClient
}
