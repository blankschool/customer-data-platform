import { useState } from 'react'
import {
  SearchIcon,
  MoreHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'

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
import { toast } from 'sonner'
import { FONTE_LABELS, type FonteContato, type Contato } from '@/lib/mock-data'
import { trpc } from '@/lib/trpc/react'

const PAGE_SIZE = 10

const statusConfig = {
  ativo: { dot: 'bg-emerald-500', text: 'text-emerald-500', label: 'Ativo' },
  inativo: { dot: 'bg-gray-500', text: 'text-gray-500', label: 'Inativo' },
  pendente: { dot: 'bg-amber-500', text: 'text-amber-500', label: 'Pendente' },
} as const

const ContatosPage = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [editOpen, setEditOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Contato | undefined>(undefined)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const utils = trpc.useUtils()
  const contactsQuery = trpc.contacts.list.useQuery()

  const updateContact = trpc.contacts.update.useMutation({
    onSuccess: async () => {
      await utils.contacts.list.invalidate()
      toast.success('Contato atualizado')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const deleteContact = trpc.contacts.delete.useMutation({
    onSuccess: async () => {
      await utils.contacts.list.invalidate()
      toast.success('Contato removido')
      setDeleteId(null)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const contacts = contactsQuery.data?.contacts ?? []
  const filtered = contacts.filter((contact) => {
    const query = search.toLowerCase()

    return (
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.phone.includes(query)
    )
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const displayed = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  function handleEdit(contact: Contato) {
    setEditTarget(contact)
    setEditOpen(true)
  }

  function handleSave(data: Partial<Contato>) {
    if (!editTarget || !data.name || !data.email || !data.phone || !data.status) {
      toast.error('Preencha nome, e-mail, telefone e status.')
      return
    }

    updateContact.mutate({
      id: editTarget.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status,
      tags: data.tags ?? [],
    })
  }

  function handleDeleteConfirm() {
    if (deleteId) {
      deleteContact.mutate({ id: deleteId })
    }
  }

  const rangeStart = filtered.length === 0 ? 0 : page * PAGE_SIZE + 1
  const rangeEnd =
    filtered.length === 0
      ? 0
      : Math.min((page + 1) * PAGE_SIZE, filtered.length)

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-baseline gap-3'>
        <h2 className='font-serif text-[22px] font-normal tracking-tight'>
          Contatos unificados
        </h2>
        <span className='text-xs text-muted-foreground font-light'>
          {contacts.length} contatos após deduplicação
        </span>
      </div>

      {contactsQuery.isError && (
        <div className='rounded-lg border border-[hsl(var(--warning)/0.35)] bg-[hsl(var(--warning)/0.08)] px-4 py-3 text-sm text-foreground'>
          Falha ao carregar os contatos do backend: {contactsQuery.error.message}
        </div>
      )}

      <div className='relative max-w-sm'>
        <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
        <Input
          placeholder='Buscar por nome, email ou telefone...'
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(0)
          }}
          className='pl-9'
        />
      </div>

      <div className='rounded-lg border border-border overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-muted-foreground h-12 pl-4'>
                Contato
              </TableHead>
              <TableHead className='text-muted-foreground h-12 hidden sm:table-cell'>
                Telefone
              </TableHead>
              <TableHead className='text-muted-foreground h-12 hidden sm:table-cell'>
                Fonte
              </TableHead>
              <TableHead className='text-muted-foreground h-12 hidden sm:table-cell'>
                Tags
              </TableHead>
              <TableHead className='text-muted-foreground h-12'>Status</TableHead>
              <TableHead className='text-muted-foreground h-12 w-12' />
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactsQuery.isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`contact-skeleton-${index}`}>
                  <TableCell colSpan={6} className='pl-4'>
                    <div className='h-12 rounded bg-muted animate-pulse' />
                  </TableCell>
                </TableRow>
              ))}

            {displayed.map((contact) => {
              const status = statusConfig[contact.status]

              return (
                <TableRow key={contact.id}>
                  <TableCell className='pl-4 min-w-0'>
                    <div className='flex items-center gap-2 min-w-0'>
                      <Avatar className='size-9 flex-shrink-0'>
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback className='text-xs'>
                          {contact.avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col text-sm min-w-0'>
                        <span className='font-medium truncate'>{contact.name}</span>
                        <span className='text-muted-foreground truncate'>
                          {contact.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className='text-sm text-muted-foreground hidden sm:table-cell'>
                    {contact.phone}
                  </TableCell>

                  <TableCell className='hidden sm:table-cell'>
                    <span className='text-[10px] px-2 py-0.5 rounded border border-border text-muted-foreground bg-muted'>
                      {FONTE_LABELS[contact.source as FonteContato] ?? contact.source}
                    </span>
                  </TableCell>

                  <TableCell className='hidden sm:table-cell'>
                    <div className='flex flex-wrap gap-1'>
                      {contact.tags.map((tag) => (
                        <Badge
                          key={`${contact.id}-${tag}`}
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
                      <span className={`size-1.5 rounded-full ${status.dot}`} />
                      <span className={`text-xs ${status.text}`}>
                        {status.label}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='size-8 rounded-full'
                        >
                          <MoreHorizontalIcon className='size-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => handleEdit(contact)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className='text-red-500'
                          onClick={() => setDeleteId(contact.id)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}

            {!contactsQuery.isLoading && displayed.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center text-muted-foreground'>
                  {search
                    ? 'Nenhum contato encontrado.'
                    : 'Nenhum contato persistido no backend ainda.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between'>
        <span className='text-[11px] text-muted-foreground font-light'>
          Mostrando {rangeStart}–{rangeEnd} de {filtered.length} contatos
        </span>
        {totalPages > 1 && (
          <div className='flex items-center gap-1'>
            <Button
              variant='ghost'
              size='icon'
              className='size-8'
              disabled={page === 0}
              onClick={() => setPage((currentPage) => currentPage - 1)}
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
              onClick={() => setPage((currentPage) => currentPage + 1)}
            >
              <ChevronRightIcon className='size-4' />
            </Button>
          </div>
        )}
      </div>

      <ContactEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialData={editTarget}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir contato?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O contato será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteContact.isPending}
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

export default ContatosPage
