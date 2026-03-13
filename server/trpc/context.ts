import type { CreateExpressContextOptions } from '@trpc/server/adapters/express'

import { getServerEnv } from '../env'
import { getSupabaseAdminClient } from '../supabase-admin'

export async function createTrpcContext({ req, res }: CreateExpressContextOptions) {
  return {
    req,
    res,
    env: getServerEnv(),
    supabase: getSupabaseAdminClient(),
  }
}

export type TrpcContext = Awaited<ReturnType<typeof createTrpcContext>>
