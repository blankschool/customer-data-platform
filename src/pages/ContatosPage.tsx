import { useState } from 'react'
import { SearchIcon, MoreHorizontalIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { contatosData } from '@/lib/mock-data'

const statusConfig = {
  ativo: { dot: 'bg-emerald-500', text: 'text-emerald-500', label: 'Ativo' },
  inativo: { dot: 'bg-gray-500', text: 'text-gray-500', label: 'Inativo' },
  pendente: { dot: 'bg-amber-500', text: 'text-amber-500', label: 'Pendente' },
} as const

const ContatosPage = () => {
  const [search, setSearch] = useState('')

  const filtered = contatosData.filter((c) => {
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    )
  })

  const displayed = filtered.slice(0, 10)

  return (
    <div className='flex flex-col gap-6'>
      {/* ── Heading ────────────────────────────────────────────── */}
      <div className='flex items-baseline gap-3'>
        <h2 className='font-serif text-[22px] font-normal tracking-tight'>Contatos unificados</h2>
        <span className='text-xs text-muted-foreground font-light'>5.665 contatos após deduplicação</span>
      </div>

      {/* ── Search bar ─────────────────────────────────────────── */}
      <div className='relative max-w-sm'>
        <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
        <Input
          placeholder='Buscar por nome, email ou telefone...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='pl-9'
        />
      </div>

      {/* ── Table ──────────────────────────────────────────────── */}
      <div className='rounded-lg border border-border overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-muted-foreground h-12 pl-4'>Contato</TableHead>
              <TableHead className='text-muted-foreground h-12'>Telefone</TableHead>
              <TableHead className='text-muted-foreground h-12'>Fonte</TableHead>
              <TableHead className='text-muted-foreground h-12'>Tags</TableHead>
              <TableHead className='text-muted-foreground h-12'>Status</TableHead>
              <TableHead className='text-muted-foreground h-12 w-12' />
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayed.map((c) => {
              const s = statusConfig[c.status]
              return (
                <TableRow key={c.id}>
                  {/* Contato */}
                  <TableCell className='pl-4'>
                    <div className='flex items-center gap-2'>
                      <Avatar className='size-9'>
                        <AvatarImage src={c.avatar} alt={c.name} />
                        <AvatarFallback className='text-xs'>{c.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col text-sm'>
                        <span className='font-medium'>{c.name}</span>
                        <span className='text-muted-foreground'>{c.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Telefone */}
                  <TableCell className='text-sm text-muted-foreground'>{c.phone}</TableCell>

                  {/* Fonte */}
                  <TableCell>
                    <span className='text-[10px] px-2 py-0.5 rounded border border-border text-muted-foreground bg-muted'>
                      {c.source}
                    </span>
                  </TableCell>

                  {/* Tags */}
                  <TableCell>
                    <div className='flex flex-wrap gap-1'>
                      {c.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant='outline'
                          className='rounded-full px-2 py-0.5 text-[10px] font-normal border-border text-muted-foreground'
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <div className='flex items-center gap-1.5'>
                      <span className={`size-1.5 rounded-full ${s.dot}`} />
                      <span className={`text-xs ${s.text}`}>{s.label}</span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Button variant='ghost' size='icon' className='size-8 rounded-full'>
                      <MoreHorizontalIcon className='size-4' />
                    </Button>
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

      {/* ── Result count ───────────────────────────────────────── */}
      <span className='text-[11px] text-muted-foreground font-light'>
        Mostrando {displayed.length} de {filtered.length} contatos
      </span>
    </div>
  )
}

export default ContatosPage
