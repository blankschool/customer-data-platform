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

const DEFAULT_TAG_COLOR =
  'text-[hsl(var(--success))] border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.15)]'

const tagInputSchema = z.object({
  name: z.string().trim().min(1, 'Nome da tag é obrigatório.'),
  description: z.string().trim().default(''),
  color: z.string().trim().min(1, 'Selecione uma cor para a tag.'),
  workspaceSlug: z.string().trim().min(1).optional(),
})

const contactUpdateInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1, 'Nome é obrigatório.'),
  email: z.string().trim().email('Informe um e-mail válido.'),
  phone: z.string().trim().min(1, 'Telefone é obrigatório.'),
  status: z.enum(['ativo', 'inativo', 'pendente']),
  tags: z.array(z.string().trim().min(1)).default([]),
  workspaceSlug: z.string().trim().min(1).optional(),
})

function failFromSupabase(
  error: { message: string; code?: string | null },
  conflictMessage = 'Conflito de unicidade no banco.',
): never {
  if (error.code === '23505') {
    throw new TRPCError({
      code: 'CONFLICT',
      message: conflictMessage,
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

function toAvatarFallback(name: string, storedFallback?: string | null): string {
  if (storedFallback?.trim()) {
    return storedFallback.trim()
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

async function hydrateContacts(
  workspaceId: string,
  supabase: Awaited<ReturnType<typeof import('../supabase-admin').getSupabaseAdminClient>>,
) {
  const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select(
      'id, avatar_url, avatar_fallback, name, email, phone, canonical_source, status',
    )
    .eq('workspace_id', workspaceId)
    .order('name')

  if (contactsError) failFromSupabase(contactsError)

  if (!contacts?.length) {
    return []
  }

  const contactIds = contacts.map((contact) => contact.id)

  const { data: contactTags, error: contactTagsError } = await supabase
    .from('contact_tags')
    .select('contact_id, tag_id')
    .in('contact_id', contactIds)

  if (contactTagsError) failFromSupabase(contactTagsError)

  const tagIds = Array.from(
    new Set((contactTags ?? []).map((contactTag) => contactTag.tag_id)),
  )

  const tagNameById = new Map<string, string>()

  if (tagIds.length > 0) {
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select('id, name')
      .in('id', tagIds)

    if (tagsError) failFromSupabase(tagsError)

    for (const tag of tags ?? []) {
      tagNameById.set(tag.id, tag.name)
    }
  }

  const tagNamesByContactId = new Map<string, string[]>()

  for (const contactTag of contactTags ?? []) {
    const tagName = tagNameById.get(contactTag.tag_id)

    if (!tagName) continue

    const currentNames = tagNamesByContactId.get(contactTag.contact_id) ?? []
    currentNames.push(tagName)
    tagNamesByContactId.set(contactTag.contact_id, currentNames)
  }

  return contacts.map((contact) => ({
    id: contact.id,
    avatar: contact.avatar_url ?? '',
    avatarFallback: toAvatarFallback(contact.name, contact.avatar_fallback),
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    source: contact.canonical_source,
    tags: (tagNamesByContactId.get(contact.id) ?? []).sort((left, right) =>
      left.localeCompare(right),
    ),
    status: contact.status,
  }))
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

    if (error)
      failFromSupabase(error, 'Já existe uma tag com este nome neste workspace.')

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

      if (error)
        failFromSupabase(error, 'Já existe uma tag com este nome neste workspace.')

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

const contactsRouter = createTRPCRouter({
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

      const contacts = await hydrateContacts(workspace.id, ctx.supabase)

      return {
        workspace: {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
        },
        contacts,
      }
    }),
  update: publicProcedure
    .input(contactUpdateInputSchema)
    .mutation(async ({ ctx, input }) => {
      const workspace = await resolveWorkspaceBySlugOrThrow(
        input.workspaceSlug ?? ctx.env.workspaceSlug,
        ctx.supabase,
      )

      const normalizedTagNames = Array.from(
        new Set(input.tags.map((tag) => tag.trim()).filter(Boolean)),
      ).sort((left, right) => left.localeCompare(right))

      const { data: updatedContact, error: contactError } = await ctx.supabase
        .from('contacts')
        .update({
          name: input.name,
          email: input.email,
          phone: input.phone,
          status: input.status,
        })
        .eq('id', input.id)
        .eq('workspace_id', workspace.id)
        .select(
          'id, avatar_url, avatar_fallback, name, email, phone, canonical_source, status',
        )
        .maybeSingle()

      if (contactError) {
        failFromSupabase(
          contactError,
          'Já existe um contato com este e-mail neste workspace.',
        )
      }

      if (!updatedContact) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Contato não encontrado para atualização.',
        })
      }

      let tagRecords: Array<{ id: string; name: string }> = []

      if (normalizedTagNames.length > 0) {
        const { data: existingTags, error: existingTagsError } = await ctx.supabase
          .from('tags')
          .select('id, name')
          .eq('workspace_id', workspace.id)
          .in('name', normalizedTagNames)

        if (existingTagsError) failFromSupabase(existingTagsError)

        const existingTagNames = new Set(
          (existingTags ?? []).map((tag) => tag.name.toLowerCase()),
        )

        const missingTagNames = normalizedTagNames.filter(
          (tagName) => !existingTagNames.has(tagName.toLowerCase()),
        )

        let createdTags: Array<{ id: string; name: string }> = []

        if (missingTagNames.length > 0) {
          const { data: insertedTags, error: insertedTagsError } = await ctx.supabase
            .from('tags')
            .upsert(
              missingTagNames.map((name) => ({
                workspace_id: workspace.id,
                name,
                description: '',
                color: DEFAULT_TAG_COLOR,
              })),
              {
                onConflict: 'workspace_id,name',
              },
            )
            .select('id, name')

          if (insertedTagsError) failFromSupabase(insertedTagsError)
          createdTags = insertedTags ?? []
        }

        tagRecords = [...(existingTags ?? []), ...createdTags]
      }

      const { error: deleteContactTagsError } = await ctx.supabase
        .from('contact_tags')
        .delete()
        .eq('contact_id', updatedContact.id)

      if (deleteContactTagsError) failFromSupabase(deleteContactTagsError)

      if (tagRecords.length > 0) {
        const { error: insertContactTagsError } = await ctx.supabase
          .from('contact_tags')
          .insert(
            tagRecords.map((tag) => ({
              contact_id: updatedContact.id,
              tag_id: tag.id,
            })),
          )

        if (insertContactTagsError) failFromSupabase(insertContactTagsError)
      }

      return {
        id: updatedContact.id,
        avatar: updatedContact.avatar_url ?? '',
        avatarFallback: toAvatarFallback(
          updatedContact.name,
          updatedContact.avatar_fallback,
        ),
        name: updatedContact.name,
        email: updatedContact.email,
        phone: updatedContact.phone,
        source: updatedContact.canonical_source,
        tags: normalizedTagNames,
        status: updatedContact.status,
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
        .from('contacts')
        .delete()
        .eq('id', input.id)
        .eq('workspace_id', workspace.id)
        .select('id')
        .maybeSingle()

      if (error) failFromSupabase(error)

      if (!data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Contato não encontrado para exclusão.',
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
  contacts: contactsRouter,
})

export type AppRouter = typeof appRouter
