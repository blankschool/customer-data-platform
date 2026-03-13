import { useState } from 'react'
import { PlusIcon, MoreHorizontalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { TagFormDialog } from '@/components/tag-form-dialog'
import { toast } from 'sonner'
import type { Tag } from '@/lib/mock-data'
import { trpc } from '@/lib/trpc/react'

const TagsPage = () => {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Tag | undefined>(undefined)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const utils = trpc.useUtils()
  const tagsQuery = trpc.tags.list.useQuery()

  const createTag = trpc.tags.create.useMutation({
    onSuccess: async () => {
      await utils.tags.list.invalidate()
      toast.success('Tag criada')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const updateTag = trpc.tags.update.useMutation({
    onSuccess: async () => {
      await utils.tags.list.invalidate()
      toast.success('Tag atualizada')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const deleteTag = trpc.tags.delete.useMutation({
    onSuccess: async () => {
      await utils.tags.list.invalidate()
      toast.success('Tag excluída')
      setDeleteId(null)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const tags = tagsQuery.data?.tags ?? []
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase()),
  )

  function handleNew() {
    setEditTarget(undefined)
    setFormOpen(true)
  }

  function handleEdit(tag: Tag) {
    setEditTarget(tag)
    setFormOpen(true)
  }

  function handleSave(data: Partial<Tag>) {
    if (!data.name || !data.color) {
      toast.error('Nome e cor são obrigatórios.')
      return
    }

    if (editTarget) {
      updateTag.mutate({
        id: editTarget.id,
        name: data.name,
        description: data.description ?? '',
        color: data.color,
      })
      return
    }

    createTag.mutate({
      name: data.name,
      description: data.description ?? '',
      color: data.color,
    })
  }

  function handleDeleteConfirm() {
    if (deleteId) {
      deleteTag.mutate({ id: deleteId })
    }
  }

  const isMutating =
    createTag.isPending || updateTag.isPending || deleteTag.isPending

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-start justify-between'>
        <div>
          <h2 className='font-serif text-[22px] font-normal tracking-tight'>Tags</h2>
          <span className='text-xs text-muted-foreground font-light'>
            Gerencie as tags de segmentação dos contatos
          </span>
        </div>
        <Button size='sm' onClick={handleNew} disabled={isMutating}>
          <PlusIcon className='size-4 mr-1.5' /> Nova tag
        </Button>
      </div>

      {tagsQuery.isError && (
        <div className='rounded-lg border border-[hsl(var(--warning)/0.35)] bg-[hsl(var(--warning)/0.08)] px-4 py-3 text-sm text-foreground'>
          Falha ao carregar as tags do backend: {tagsQuery.error.message}
        </div>
      )}

      <Input
        placeholder='Buscar tags...'
        className='max-w-xs'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {tagsQuery.isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={`tag-skeleton-${index}`}
              className='px-6 py-5 flex flex-col gap-3 animate-pulse'
            >
              <div className='flex items-center justify-between'>
                <div className='h-6 w-24 rounded bg-muted' />
                <div className='h-7 w-7 rounded bg-muted' />
              </div>
              <div className='h-10 w-20 rounded bg-muted' />
              <div className='h-4 w-full rounded bg-muted' />
            </Card>
          ))}

        {filteredTags.map((tag) => (
          <Card
            key={tag.id}
            className='px-6 py-5 flex flex-col gap-3 hover:bg-card/60 transition-all'
          >
            <div className='flex items-center justify-between'>
              <span className={`text-xs px-2.5 py-1 rounded border ${tag.color}`}>
                {tag.name}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon' className='size-7'>
                    <MoreHorizontalIcon className='size-3.5' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => handleEdit(tag)}>Editar</DropdownMenuItem>
                  <DropdownMenuItem
                    className='text-red-500'
                    onClick={() => setDeleteId(tag.id)}
                  >
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <span className='font-sans text-[36px] font-light tracking-[-0.03em] leading-none'>
              {tag.count.toLocaleString('pt-BR')}
            </span>
            <span className='text-[11px] text-muted-foreground font-light'>
              {tag.description}
            </span>
          </Card>
        ))}

        {!tagsQuery.isLoading && filteredTags.length === 0 && (
          <Card className='px-6 py-8 flex flex-col gap-2 border-dashed sm:col-span-2 lg:col-span-3'>
            <p className='text-sm font-medium'>
              {search ? 'Nenhuma tag encontrada' : 'Nenhuma tag criada no backend ainda'}
            </p>
            <p className='text-xs text-muted-foreground font-light'>
              {search
                ? 'Tente outro termo de busca.'
                : 'Use “Nova tag” para criar a primeira tag diretamente no Supabase via tRPC.'}
            </p>
          </Card>
        )}
      </div>

      <TagFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editTarget}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tag?</AlertDialogTitle>
            <AlertDialogDescription>
              A tag será removida da lista. Contatos que a possuem não serão afetados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteTag.isPending}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default TagsPage
