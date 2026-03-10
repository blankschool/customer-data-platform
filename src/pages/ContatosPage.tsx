import { useState } from 'react'
import { SearchIcon, MoreHorizontalIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ContactEditDialog } from '@/components/contact-edit-dialog'
import { useStore } from '@/lib/store'
import { toast } from 'sonner'
import type { Contato } from '@/lib/mock-data'

const PAGE_SIZE = 10

const statusConfig = {
  ativo:    { dot: 'bg-emerald-500', text: 'text-emerald-500', label: 'Ativo'    },
  inativo:  { dot: 'bg-gray-500',    text: 'text-gray-500',    label: 'Inativo'  },
  pendente: { dot: 'bg-amber-500',   text: 'text-amber-500',   label: 'Pendente' },
} as const

const ContatosPage = () => {
  const { state, dispatch } = useStore()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Contato | undefined>(undefined)

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = state.contatos.filter((c) => {
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    )
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const displayed = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  function handleEdit(contato: Contato) {
    setEditTarget(contato)
    setEditOpen(true)
  }

  function handleSave(data: Partial<Contato>) {
    if (editTarget) {
      dispatch({ type: 'CONTATO_UPDATE', payload: { id: editTarget.id, data } })
      toast.success('Contato atualizado')
    }
  }

  function handleDeleteConfirm() {
    if (deleteId) {
      dispatch({ type: 'CONTATO_DELETE', payload: deleteId })
      toast.success('Contato removido')
      setDeleteId(null)
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* ── Heading ────────────────────────────────────────────── */}
      <div className='flex items-baseline gap-3'>
        <h2 className='font-serif text-[22px] font-normal tracking-tight'>Contatos unificados</h2>
        <span className='text-xs text-muted-foreground font-light'>
          {state.contatos.length} contatos após deduplicação
        </span>
      </div>

      {/* ── Search bar ─────────────────────────────────────────── */}
      <div className='relative max-w-sm'>
        <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
        <Input
          placeholder='Buscar por nome, email ou telefone...'
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          className='pl-9'
        />
      </div>

      {/* ── Table ──────────────────────────────────────────────── */}
      <div className='rounded-lg border border-border overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-muted-foreground h-12 pl-4'>Contato</TableHead>
              <TableHead className='text-muted-foreground h-12 hidden sm:table-cell'>Telefone</TableHead>
              <TableHead className='text-muted-foreground h-12 hidden sm:table-cell'>Fonte</TableHead>
              <TableHead className='text-muted-foreground h-12 hidden sm:table-cell'>Tags</TableHead>
              <TableHead className='text-muted-foreground h-12'>Status</TableHead>
              <TableHead className='text-muted-foreground h-12 w-12' />
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayed.map((c) => {
              const s = statusConfig[c.status]
              return (
                <TableRow key={c.id}>
                  <TableCell className='pl-4 min-w-0'>
                    <div className='flex items-center gap-2 min-w-0'>
                      <Avatar className='size-9 flex-shrink-0'>
                        <AvatarImage src={c.avatar} alt={c.name} />
                        <AvatarFallback className='text-xs'>{c.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col text-sm min-w-0'>
                        <span className='font-medium truncate'>{c.name}</span>
                        <span className='text-muted-foreground truncate'>{c.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className='text-sm text-muted-foreground hidden sm:table-cell'>{c.phone}</TableCell>

                  <TableCell className='hidden sm:table-cell'>
                    <span className='text-[10px] px-2 py-0.5 rounded border border-border text-muted-foreground bg-muted'>
                      {c.source}
                    </span>
                  </TableCell>

                  <TableCell className='hidden sm:table-cell'>
                    <div className='flex flex-wrap gap-1'>
                      {c.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant='outline'
                          className='rounded-full px-2 py-0.5 text-[10px] font-normal border-border text-muted-foreground whitespace-nowrap'
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className='flex items-center gap-1.5'>
                      <span className={`size-1.5 rounded-full ${s.dot}`} />
                      <span className={`text-xs ${s.text}`}>{s.label}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='size-8 rounded-full'>
                          <MoreHorizontalIcon className='size-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => handleEdit(c)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem
                          className='text-red-500'
                          onClick={() => setDeleteId(c.id)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}

            {displayed.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center text-muted-foreground'>
                  Nenhum contato encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination + count ─────────────────────────────────── */}
      <div className='flex items-center justify-between'>
        <span className='text-[11px] text-muted-foreground font-light'>
          Mostrando {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} de{' '}
          {filtered.length} contatos
        </span>
        {totalPages > 1 && (
          <div className='flex items-center gap-1'>
            <Button
              variant='ghost'
              size='icon'
              className='size-8'
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeftIcon className='size-4' />
            </Button>
            <span className='text-xs text-muted-foreground px-2'>
              {page + 1} / {totalPages}
            </span>
            <Button
              variant='ghost'
              size='icon'
              className='size-8'
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRightIcon className='size-4' />
            </Button>
          </div>
        )}
      </div>

      {/* ── Dialogs ────────────────────────────────────────────── */}
      <ContactEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialData={editTarget}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir contato?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O contato será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ContatosPage
