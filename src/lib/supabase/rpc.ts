import type { ContactSource, TableRow } from './database.types'
import { getSupabaseBrowserClient } from './client'

export async function createWorkspaceWithDefaults(input: {
  name: string
  slug: string
}): Promise<TableRow<'workspaces'>> {
  const { data, error } = await getSupabaseBrowserClient().rpc(
    'create_workspace_with_defaults',
    {
      p_name: input.name,
      p_slug: input.slug,
    },
  )

  if (error || !data) {
    throw error ?? new Error('Workspace creation returned no data.')
  }

  return data
}

export async function revertImport(importId: string): Promise<void> {
  const { error } = await getSupabaseBrowserClient().rpc('revert_import', {
    p_import_id: importId,
  })

  if (error) throw error
}

export async function resolveInconsistencyCase(input: {
  caseId: string
  choice: ContactSource
}): Promise<void> {
  const { error } = await getSupabaseBrowserClient().rpc(
    'resolve_inconsistency_case',
    {
      p_case_id: input.caseId,
      p_choice: input.choice,
    },
  )

  if (error) throw error
}
