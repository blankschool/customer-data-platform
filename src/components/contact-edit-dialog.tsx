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
import type { Contato } from '@/lib/mock-data'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Contato
  onSave: (data: Partial<Contato>) => void
}

export function ContactEditDialog({ open, onOpenChange, initialData, onSave }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<Contato['status']>('ativo')
  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? '')
      setEmail(initialData?.email ?? '')
      setPhone(initialData?.phone ?? '')
      setStatus(initialData?.status ?? 'ativo')
      setTagsInput(initialData?.tags.join(', ') ?? '')
    }
  }, [initialData, open])

  function handleSave() {
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    onSave({ name, email, phone, status, tags })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='font-serif font-normal'>
            {initialData ? 'Editar contato' : 'Novo contato'}
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
              placeholder='email@exemplo.com'
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs'>Telefone</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='(00) 00000-0000'
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs'>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Contato['status'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ativo'>Ativo</SelectItem>
                <SelectItem value='inativo'>Inativo</SelectItem>
                <SelectItem value='pendente'>Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs'>Tags (separadas por vírgula)</Label>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder='lead, newsletter, vip'
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
