import { z } from 'zod'

import type {
  ContactSource,
  InconsistencyType,
  TableRow,
} from '../../src/lib/supabase/database.types'
import { createTRPCRouter, publicProcedure, TRPCError } from './trpc'

const SOURCE_ORDER: ContactSource[] = ['vendas', 'email', 'whatsapp']

const SOURCE_LABELS: Record<ContactSource, string> = {
  vendas: 'Vendas',
  email: 'E-mail',
  whatsapp: 'WhatsApp',
}

const INCONSISTENCY_TYPES: InconsistencyType[] = [
  'Duplicata',
  'Tag ausente',
  'Inadimplente',
  'Órfão',
]

const tagInputSchema = z.object({
  name: z.string().trim().min(1, 'Nome da tag é obrigatório.'),
  description: z.string().trim().default(''),
  color: z.string().trim().min(1, 'Selecione uma cor para a tag.'),
  workspaceSlug: z.string().trim().min(1).optional(),
})

function failFromSupabase(error: { message: string; code?: string | null }): never {
  if (error.code === '23505') {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Já existe uma tag com este nome neste workspace.',
      cause: error,
    })
  }

  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: error.message,
    cause: error,
  })
}

async function getWorkspaceBySlug(
  slug: string,
  supabase: Awaited<ReturnType<typeof import('../supabase-admin').getSupabaseAdminClient>>,
): Promise<TableRow<'workspaces'> | null> {
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    failFromSupabase(error)
  }

  return data
}

async function resolveWorkspaceBySlugOrThrow(
  slug: string | undefined,
  supabase: Awaited<ReturnType<typeof import('../supabase-admin').getSupabaseAdminClient>>,
): Promise<TableRow<'workspaces'>> {
  if (!slug) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message:
        'Missing workspace slug. Set SUPABASE_WORKSPACE_SLUG or VITE_SUPABASE_WORKSPACE_SLUG.',
    })
  }

  const workspace = await getWorkspaceBySlug(slug, supabase)

  if (!workspace) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Workspace "${slug}" was not found in Supabase.`,
    })
  }

  return workspace
}

const healthRouter = createTRPCRouter({
  status: publicProcedure.query(({ ctx }) => ({
    status: 'ok' as const,
    timestamp: new Date().toISOString(),
    workspaceSlug: ctx.env.workspaceSlug ?? null,
  })),
})

const workspaceRouter = createTRPCRouter({
  current: publicProcedure
    .input(
      z
        .object({
          workspaceSlug: z.string().trim().min(1).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const workspaceSlug = input?.workspaceSlug ?? ctx.env.workspaceSlug

      if (!workspaceSlug) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message:
            'Missing workspace slug. Set SUPABASE_WORKSPACE_SLUG or VITE_SUPABASE_WORKSPACE_SLUG.',
        })
      }

      const workspace = await getWorkspaceBySlug(workspaceSlug, ctx.supabase)

      if (!workspace) {
        return {
          status: 'missing_workspace' as const,
          expectedSlug: workspaceSlug,
          workspace: null,
        }
      }

      return {
        status: 'ready' as const,
        expectedSlug: workspaceSlug,
        workspace: {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          createdAt: workspace.created_at,
        },
      }
    }),
})

const dashboardRouter = createTRPCRouter({
  summary: publicProcedure
    .input(
      z
        .object({
          workspaceSlug: z.string().trim().min(1).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const workspaceSlug = input?.workspaceSlug ?? ctx.env.workspaceSlug

      if (!workspaceSlug) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message:
            'Missing workspace slug. Set SUPABASE_WORKSPACE_SLUG or VITE_SUPABASE_WORKSPACE_SLUG.',
        })
      }

      const workspace = await getWorkspaceBySlug(workspaceSlug, ctx.supabase)

      if (!workspace) {
        return {
          status: 'missing_workspace' as const,
          expectedSlug: workspaceSlug,
          workspace: null,
          dashboard: {
            contactCount: 0,
            activeBaseCount: 0,
            activeBases: SOURCE_ORDER.map((source) => ({
              source,
              label: SOURCE_LABELS[source],
              importId: null,
              fileName: null,
              importedAt: null,
              status: null,
              contactCount: 0,
            })),
            pendingInconsistencies: {
              total: 0,
              byType: Object.fromEntries(
                INCONSISTENCY_TYPES.map((type) => [type, 0]),
              ) as Record<InconsistencyType, number>,
            },
          },
        }
      }

      const [contactsCountResult, activeImportsResult, pendingCasesResult] =
        await Promise.all([
          ctx.supabase
            .from('contacts')
            .select('id', { count: 'exact', head: true })
            .eq('workspace_id', workspace.id),
          ctx.supabase
            .from('imports')
            .select('id, file_name, source, imported_at, status')
            .eq('workspace_id', workspace.id)
            .eq('status', 'ativa')
            .order('imported_at', { ascending: false }),
          ctx.supabase
            .from('inconsistency_cases')
            .select('type')
            .eq('workspace_id', workspace.id)
            .eq('resolved', false),
        ])

      if (contactsCountResult.error) failFromSupabase(contactsCountResult.error)
      if (activeImportsResult.error) failFromSupabase(activeImportsResult.error)
      if (pendingCasesResult.error) failFromSupabase(pendingCasesResult.error)

      const newestImportBySource = new Map<
        ContactSource,
        NonNullable<typeof activeImportsResult.data>[number]
      >()

      for (const importRow of activeImportsResult.data ?? []) {
        if (!newestImportBySource.has(importRow.source)) {
          newestImportBySource.set(importRow.source, importRow)
        }
      }

      const activeBaseCounts = await Promise.all(
        SOURCE_ORDER.map(async (source) => {
          const importRow = newestImportBySource.get(source)

          if (!importRow) {
            return {
              source,
              label: SOURCE_LABELS[source],
              importId: null,
              fileName: null,
              importedAt: null,
              status: null,
              contactCount: 0,
            }
          }

          const { count, error } = await ctx.supabase
            .from('import_contacts')
            .select('contact_id', { count: 'exact', head: true })
            .eq('import_id', importRow.id)

          if (error) failFromSupabase(error)

          return {
            source,
            label: SOURCE_LABELS[source],
            importId: importRow.id,
            fileName: importRow.file_name,
            importedAt: importRow.imported_at,
            status: importRow.status,
            contactCount: count ?? 0,
          }
        }),
      )

      const pendingByType = Object.fromEntries(
        INCONSISTENCY_TYPES.map((type) => [type, 0]),
      ) as Record<InconsistencyType, number>

      for (const row of pendingCasesResult.data ?? []) {
        pendingByType[row.type] += 1
      }

      return {
        status: 'ready' as const,
        expectedSlug: workspaceSlug,
        workspace: {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          createdAt: workspace.created_at,
        },
        dashboard: {
          contactCount: contactsCountResult.count ?? 0,
          activeBaseCount: activeBaseCounts.filter((item) => item.importId).length,
          activeBases: activeBaseCounts,
          pendingInconsistencies: {
            total: (pendingCasesResult.data ?? []).length,
            byType: pendingByType,
          },
        },
      }
    }),
})

const tagsRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z
        .object({
          workspaceSlug: z.string().trim().min(1).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const workspace = await resolveWorkspaceBySlugOrThrow(
        input?.workspaceSlug ?? ctx.env.workspaceSlug,
        ctx.supabase,
      )

      const { data, error } = await ctx.supabase
        .from('tags')
        .select('id, name, description, color, created_at, updated_at')
        .eq('workspace_id', workspace.id)
        .order('name')

      if (error) failFromSupabase(error)

      const tagsWithCounts = await Promise.all(
        (data ?? []).map(async (tag) => {
          const { count, error: countError } = await ctx.supabase
            .from('contact_tags')
            .select('contact_id', { count: 'exact', head: true })
            .eq('tag_id', tag.id)

          if (countError) failFromSupabase(countError)

          return {
            id: tag.id,
            name: tag.name,
            description: tag.description,
            color: tag.color,
            count: count ?? 0,
            createdAt: tag.created_at,
            updatedAt: tag.updated_at,
          }
        }),
      )

      return {
        workspace: {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
        },
        tags: tagsWithCounts,
      }
    }),
  create: publicProcedure.input(tagInputSchema).mutation(async ({ ctx, input }) => {
    const workspace = await resolveWorkspaceBySlugOrThrow(
      input.workspaceSlug ?? ctx.env.workspaceSlug,
      ctx.supabase,
    )

    const { data, error } = await ctx.supabase
      .from('tags')
      .insert({
        workspace_id: workspace.id,
        name: input.name,
        description: input.description,
        color: input.color,
      })
      .select('id, name, description, color, created_at, updated_at')
      .single()

    if (error) failFromSupabase(error)

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      color: data.color,
      count: 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }),
  update: publicProcedure
    .input(
      tagInputSchema.extend({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workspace = await resolveWorkspaceBySlugOrThrow(
        input.workspaceSlug ?? ctx.env.workspaceSlug,
        ctx.supabase,
      )

      const { data, error } = await ctx.supabase
        .from('tags')
        .update({
          name: input.name,
          description: input.description,
          color: input.color,
        })
        .eq('id', input.id)
        .eq('workspace_id', workspace.id)
        .select('id, name, description, color, created_at, updated_at')
        .maybeSingle()

      if (error) failFromSupabase(error)

      if (!data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tag não encontrada para atualização.',
        })
      }

      const { count, error: countError } = await ctx.supabase
        .from('contact_tags')
        .select('contact_id', { count: 'exact', head: true })
        .eq('tag_id', data.id)

      if (countError) failFromSupabase(countError)

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        color: data.color,
        count: count ?? 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        workspaceSlug: z.string().trim().min(1).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workspace = await resolveWorkspaceBySlugOrThrow(
        input.workspaceSlug ?? ctx.env.workspaceSlug,
        ctx.supabase,
      )

      const { data, error } = await ctx.supabase
        .from('tags')
        .delete()
        .eq('id', input.id)
        .eq('workspace_id', workspace.id)
        .select('id')
        .maybeSingle()

      if (error) failFromSupabase(error)

      if (!data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tag não encontrada para exclusão.',
        })
      }

      return { id: data.id }
    }),
})

export const appRouter = createTRPCRouter({
  health: healthRouter,
  workspace: workspaceRouter,
  dashboard: dashboardRouter,
  tags: tagsRouter,
})

export type AppRouter = typeof appRouter
