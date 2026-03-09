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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { usuariosData } from '@/lib/mock-data'

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

  const time = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  if (isToday) return `Hoje, ${time}`
  if (isYesterday) return `Ontem, ${time}`
  return date.toLocaleDateString('pt-BR')
}

const UsuariosPage = () => {
  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h2 className='font-serif text-[22px] font-normal tracking-tight'>
            Usuários
          </h2>
          <span className='text-xs text-muted-foreground font-light'>
            {usuariosData.length} membros do time
          </span>
        </div>
        <Button size='sm'>
          <PlusIcon className='size-4 mr-1.5' /> Convidar
        </Button>
      </div>

      {/* Table */}
      <div className='rounded-lg border border-border overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último acesso</TableHead>
              <TableHead className='w-12'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuariosData.map((user) => (
              <TableRow key={user.id}>
                {/* Member */}
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Avatar className='size-9'>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='text-sm font-medium'>{user.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell>
                  {user.role === 'Admin' && <Badge>Admin</Badge>}
                  {user.role === 'Editor' && (
                    <Badge variant='outline'>Editor</Badge>
                  )}
                  {user.role === 'Viewer' && (
                    <Badge variant='secondary'>Viewer</Badge>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell>
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

                {/* Last access */}
                <TableCell className='text-sm text-muted-foreground'>
                  {formatLastAccess(user.lastAccess)}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon' className='size-8'>
                        <MoreHorizontalIcon className='size-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem>Editar perfil</DropdownMenuItem>
                      <DropdownMenuItem>
                        {user.status === 'ativo' ? 'Desativar' : 'Reativar'}
                      </DropdownMenuItem>
                      <DropdownMenuItem className='text-red-500'>
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
    </div>
  )
}

export default UsuariosPage
