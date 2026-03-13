import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Usuario } from '@/lib/domain'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Usuario
  onSave: (data: Partial<Usuario>) => void
}

export function UserFormDialog({ open, onOpenChange, initialData, onSave }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Usuario['role']>('Viewer')

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? '')
      setEmail(initialData?.email ?? '')
      setRole(initialData?.role ?? 'Viewer')
    }
  }, [initialData, open])

  function handleSave() {
    onSave({ name, email, role })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle className='font-serif font-normal'>
            {initialData ? 'Editar usuário' : 'Convidar membro'}
          </DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-4 py-2'>
          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs'>Nome</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Nome completo'
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs'>E-mail</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='email@empresa.com'
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs'>Perfil de acesso</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Usuario['role'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Admin'>Admin</SelectItem>
                <SelectItem value='Editor'>Editor</SelectItem>
                <SelectItem value='Viewer'>Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>{initialData ? 'Salvar' : 'Convidar'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
