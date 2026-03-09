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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Tag } from '@/lib/mock-data'

const colorOptions = [
  {
    value: 'text-[hsl(var(--success))] border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.15)]',
    label: 'Verde (sucesso)',
  },
  {
    value: 'text-[hsl(var(--info))] border-[hsl(var(--info)/0.3)] bg-[hsl(var(--info)/0.15)]',
    label: 'Azul (info)',
  },
  {
    value: 'text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.3)] bg-[hsl(var(--warning)/0.15)]',
    label: 'Âmbar (aviso)',
  },
  {
    value: 'text-[hsl(var(--error))] border-[hsl(var(--error)/0.3)] bg-[hsl(var(--error)/0.15)]',
    label: 'Vermelho (erro)',
  },
]

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Tag
  onSave: (data: Partial<Tag>) => void
}

export function TagFormDialog({ open, onOpenChange, initialData, onSave }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(colorOptions[0].value)

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? '')
      setDescription(initialData?.description ?? '')
      setColor(initialData?.color ?? colorOptions[0].value)
    }
  }, [initialData, open])

  function handleSave() {
    onSave({ name, description, color })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='font-serif font-normal'>
            {initialData ? 'Editar tag' : 'Nova tag'}
          </DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-4 py-2'>
          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs'>Nome da tag</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='ex: cliente-ativo'
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs'>Descrição</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Descreva quando usar esta tag...'
              rows={3}
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label className='text-xs'>Cor</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className={`text-xs px-2 py-0.5 rounded border ${opt.value}`}>
                      {opt.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
