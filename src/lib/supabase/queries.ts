import type { PostgrestError } from '@supabase/supabase-js'

import type { TableRow } from './database.types'
import { getSupabaseBrowserClient } from './client'
import { getSupabaseBrowserEnv } from './env'

function unwrap<T>(data: T, error: PostgrestError | null): T {
  if (error) throw error
  return data
}

export async function getWorkspaceBySlug(
  slug = getSupabaseBrowserEnv().workspaceSlug,
): Promise<TableRow<'workspaces'> | null> {
  if (!slug) {
    throw new Error('Missing VITE_SUPABASE_WORKSPACE_SLUG for workspace bootstrap.')
  }

  const { data, error } = await getSupabaseBrowserClient()
    .from('workspaces')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  return unwrap(data, error)
}

export async function listContacts(
  workspaceId: string,
): Promise<TableRow<'contacts'>[]> {
  const { data, error } = await getSupabaseBrowserClient()
    .from('contacts')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('name')

  return unwrap(data ?? [], error)
}

export async function listTags(workspaceId: string): Promise<TableRow<'tags'>[]> {
  const { data, error } = await getSupabaseBrowserClient()
    .from('tags')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('name')

  return unwrap(data ?? [], error)
}

export async function listImports(
  workspaceId: string,
): Promise<TableRow<'imports'>[]> {
  const { data, error } = await getSupabaseBrowserClient()
    .from('imports')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('imported_at', { ascending: false })

  return unwrap(data ?? [], error)
}

export async function listInconsistencyCases(
  workspaceId: string,
): Promise<TableRow<'inconsistency_cases'>[]> {
  const { data, error } = await getSupabaseBrowserClient()
    .from('inconsistency_cases')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('resolved')
    .order('created_at', { ascending: false })

  return unwrap(data ?? [], error)
}
