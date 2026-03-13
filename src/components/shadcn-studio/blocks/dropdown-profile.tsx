import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import {
  UserIcon,
  SettingsIcon,
  UsersIcon,
  LogOutIcon
} from 'lucide-react'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

type Props = {
  trigger: ReactNode
  defaultOpen?: boolean
  align?: 'start' | 'center' | 'end'
  name?: string
  email?: string
  avatarUrl?: string
  avatarFallback?: string
  onSignOut?: () => void | Promise<void>
}

const ProfileDropdown = ({
  trigger,
  defaultOpen,
  align = 'end',
  name = 'Operador CDP',
  email = 'operador@empresa.com',
  avatarUrl = '',
  avatarFallback = 'OP',
  onSignOut,
}: Props) => {
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className='w-72' align={align || 'end'}>
        <DropdownMenuLabel className='flex items-center gap-4 px-4 py-2.5 font-normal'>
          <div className='relative'>
            <Avatar className='size-10'>
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <span className='ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2' />
          </div>
          <div className='flex flex-1 flex-col items-start'>
            <span className='text-foreground text-base font-semibold'>{name}</span>
            <span className='text-muted-foreground text-sm'>{email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className='px-4 py-2.5 text-base' asChild>
            <Link to='/'>
            <UserIcon className='text-foreground size-5' />
            <span>Minha conta</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='px-4 py-2.5 text-base' asChild>
            <Link to='/perfis'>
            <SettingsIcon className='text-foreground size-5' />
            <span>Configurações</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className='px-4 py-2.5 text-base' asChild>
            <Link to='/usuarios'>
            <UsersIcon className='text-foreground size-5' />
            <span>Gerenciar time</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant='destructive'
          className='px-4 py-2.5 text-base'
          onSelect={() => {
            void onSignOut?.()
          }}
        >
          <LogOutIcon className='size-5' />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown
