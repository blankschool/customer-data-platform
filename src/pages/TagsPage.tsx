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
import { useStore } from '@/lib/store'
import { toast } from 'sonner'
import type { Tag } from '@/lib/mock-data'

const TagsPage = () => {
  const { state, dispatch } = useStore()
  const [search, setSearch] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Tag | undefined>(undefined)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredTags = state.tags.filter((tag) =>
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
    if (editTarget) {
      dispatch({ type: 'TAG_UPDATE', payload: { id: editTarget.id, data } })
      toast.success('Tag atualizada')
    } else {
      const newTag: Tag = {
        id: String(Date.now()),
        name: data.name ?? 'nova-tag',
        description: data.description ?? '',
        color: data.color ?? '',
        count: 0,
      }
      dispatch({ type: 'TAG_CREATE', payload: newTag })
      toast.success('Tag criada')
    }
  }

  function handleDeleteConfirm() {
    if (deleteId) {
      dispatch({ type: 'TAG_DELETE', payload: deleteId })
      toast.success('Tag excluída')
      setDeleteId(null)
    }
  }

  // Dynamic count from store
  function tagCount(tagName: string) {
    return state.contatos.filter((c) => c.tags.includes(tagName)).length
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h2 className='font-serif text-[22px] font-normal tracking-tight'>Tags</h2>
          <span className='text-xs text-muted-foreground font-light'>
            Gerencie as tags de segmentação dos contatos
          </span>
        </div>
        <Button size='sm' onClick={handleNew}>
          <PlusIcon className='size-4 mr-1.5' /> Nova tag
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder='Buscar tags...'
        className='max-w-xs'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Tag grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
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
              {tagCount(tag.name).toLocaleString('pt-BR')}
            </span>
            <span className='text-[11px] text-muted-foreground font-light'>{tag.description}</span>
          </Card>
        ))}
      </div>

      {/* Dialogs */}
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
