import { useState } from 'react'
import { MoreHorizontalIcon, PlusIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { UserFormDialog } from '@/components/user-form-dialog'
import { useStore } from '@/lib/store'
import { toast } from 'sonner'
import type { Usuario } from '@/lib/domain'

function formatLastAccess(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()

  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  if (isToday) return `Hoje, ${time}`
  if (isYesterday) return `Ontem, ${time}`
  return date.toLocaleDateString('pt-BR')
}

const UsuariosPage = () => {
  const { state, dispatch } = useStore()

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Usuario | undefined>(undefined)
  const [removeId, setRemoveId] = useState<string | null>(null)

  function handleInvite() {
    setEditTarget(undefined)
    setFormOpen(true)
  }

  function handleEdit(user: Usuario) {
    setEditTarget(user)
    setFormOpen(true)
  }

  function handleSave(data: Partial<Usuario>) {
    if (editTarget) {
      dispatch({ type: 'USUARIO_UPDATE', payload: { id: editTarget.id, data } })
      toast.success('Usuário atualizado')
    } else {
      const newUser: Usuario = {
        id: String(Date.now()),
        avatar: '',
        avatarFallback: (data.name ?? 'N').slice(0, 2).toUpperCase(),
        name: data.name ?? '',
        email: data.email ?? '',
        role: data.role ?? 'Viewer',
        status: 'ativo',
        lastAccess: new Date().toISOString(),
      }
      dispatch({ type: 'USUARIO_INVITE', payload: newUser })
      toast.success('Convite enviado')
    }
  }

  function handleToggleStatus(user: Usuario) {
    dispatch({ type: 'USUARIO_TOGGLE_STATUS', payload: user.id })
    toast.success(user.status === 'ativo' ? 'Usuário desativado' : 'Usuário reativado')
  }

  function handleRemoveConfirm() {
    if (removeId) {
      dispatch({ type: 'USUARIO_REMOVE', payload: removeId })
      toast.success('Usuário removido')
      setRemoveId(null)
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h2 className='font-serif text-[22px] font-normal tracking-tight'>Usuários</h2>
          <span className='text-xs text-muted-foreground font-light'>
            {state.usuarios.length} membros do time
          </span>
        </div>
        <Button size='sm' onClick={handleInvite}>
          <PlusIcon className='size-4 mr-1.5' /> Convidar
        </Button>
      </div>

      {/* Table */}
      <div className='rounded-lg border border-border overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead className='hidden sm:table-cell'>Status</TableHead>
              <TableHead className='hidden sm:table-cell'>Último acesso</TableHead>
              <TableHead className='w-12'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.usuarios.map((user) => (
              <TableRow key={user.id}>
                <TableCell className='min-w-0'>
                  <div className='flex items-center gap-3 min-w-0'>
                    <Avatar className='size-9 flex-shrink-0'>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className='min-w-0'>
                      <p className='text-sm font-medium truncate'>{user.name}</p>
                      <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  {user.role === 'Admin' && <Badge>Admin</Badge>}
                  {user.role === 'Editor' && <Badge variant='outline'>Editor</Badge>}
                  {user.role === 'Viewer' && <Badge variant='secondary'>Viewer</Badge>}
                </TableCell>

                <TableCell className='hidden sm:table-cell'>
                  <div className='flex items-center gap-2'>
                    <span
                      className={`size-2 rounded-full ${
                        user.status === 'ativo' ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                      }`}
                    />
                    <span className='text-sm'>
                      {user.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </TableCell>

                <TableCell className='text-sm text-muted-foreground hidden sm:table-cell'>
                  {formatLastAccess(user.lastAccess)}
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon' className='size-8'>
                        <MoreHorizontalIcon className='size-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        Editar perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                        {user.status === 'ativo' ? 'Desativar' : 'Reativar'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='text-red-500'
                        onClick={() => setRemoveId(user.id)}
                      >
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {state.usuarios.length === 0 && (
        <div className='rounded-lg border border-dashed border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground'>
          Nenhum usuário carregado nesta camada local. Use os fluxos reais de convite para popular o time.
        </div>
      )}

      {/* Dialogs */}
      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editTarget}
        onSave={handleSave}
      />

      <AlertDialog open={!!removeId} onOpenChange={(o) => !o && setRemoveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              O usuário perderá o acesso à plataforma imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveConfirm}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default UsuariosPage
