import { useState } from 'react'
import {
  DownloadIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  CheckCircle2Icon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { exportStats, contatosData } from '@/lib/mock-data'

const statsGrid = [
  {
    label: 'Total de contatos',
    value: exportStats.totalContacts,
    color: '',
  },
  {
    label: 'Após deduplicação',
    value: exportStats.afterDedup,
    color: 'text-emerald-500',
  },
  {
    label: 'Duplicatas removidas',
    value: exportStats.duplicatesRemoved,
    color: 'text-red-500',
  },
  {
    label: 'Tags adicionadas',
    value: exportStats.tagsAdded,
    color: 'text-amber-400',
  },
  {
    label: 'Conflitos resolvidos',
    value: exportStats.conflictsResolved,
    color: 'text-emerald-500',
  },
  {
    label: 'Prontos para exportar',
    value: exportStats.readyToExport,
    color: 'text-emerald-500',
  },
]

type Format = 'csv' | 'excel'

const ExportarPage = () => {
  const [selectedFormat, setSelectedFormat] = useState<Format>('csv')

  const previewContacts = contatosData.slice(0, 5)

  return (
    <div className='flex flex-col gap-8'>
      {/* Header */}
      <div>
        <h2 className='font-serif text-[22px] font-normal tracking-tight'>
          Exportar base limpa
        </h2>
        <span className='text-xs text-muted-foreground font-light'>
          Base unificada pronta para exportação
        </span>
      </div>

      {/* Stats grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden border border-border'>
        {statsGrid.map((m, i) => (
          <div key={i} className='bg-card px-5 py-6 flex flex-col gap-1.5'>
            <span className='text-[10px] uppercase tracking-[0.1em] text-muted-foreground'>
              {m.label}
            </span>
            <span
              className={`font-sans text-[36px] font-light tracking-[-0.03em] leading-none ${m.color}`}
            >
              {m.value.toLocaleString('pt-BR')}
            </span>
          </div>
        ))}
      </div>

      <Separator />

      {/* Format selection */}
      <div>
        <h3 className='font-serif text-[22px] font-normal tracking-tight mb-4'>
          Formato de exportação
        </h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg'>
          <Card
            className={cn(
              'px-6 py-5 cursor-pointer flex items-center gap-4 transition-all hover:bg-card/60',
              selectedFormat === 'csv' && 'border-foreground',
            )}
            onClick={() => setSelectedFormat('csv')}
          >
            <FileTextIcon className='size-8 text-muted-foreground flex-shrink-0' />
            <div className='flex flex-col'>
              <span className='text-sm font-medium'>CSV</span>
              <span className='text-xs text-muted-foreground font-light'>
                Compatível com qualquer ferramenta
              </span>
            </div>
            {selectedFormat === 'csv' && (
              <CheckCircle2Icon className='size-4 text-foreground ml-auto flex-shrink-0' />
            )}
          </Card>

          <Card
            className={cn(
              'px-6 py-5 cursor-pointer flex items-center gap-4 transition-all hover:bg-card/60',
              selectedFormat === 'excel' && 'border-foreground',
            )}
            onClick={() => setSelectedFormat('excel')}
          >
            <FileSpreadsheetIcon className='size-8 text-muted-foreground flex-shrink-0' />
            <div className='flex flex-col'>
              <span className='text-sm font-medium'>Excel (.xlsx)</span>
              <span className='text-xs text-muted-foreground font-light'>
                Formatação preservada
              </span>
            </div>
            {selectedFormat === 'excel' && (
              <CheckCircle2Icon className='size-4 text-foreground ml-auto flex-shrink-0' />
            )}
          </Card>
        </div>
      </div>

      <Separator />

      {/* Preview */}
      <div>
        <h3 className='font-serif text-[22px] font-normal tracking-tight mb-4'>
          Preview dos dados
        </h3>
        <div className='rounded-lg border border-border overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewContacts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className='text-sm font-medium'>
                    {c.name}
                  </TableCell>
                  <TableCell className='text-sm text-muted-foreground'>
                    {c.email}
                  </TableCell>
                  <TableCell className='text-sm text-muted-foreground'>
                    {c.phone}
                  </TableCell>
                  <TableCell className='text-sm text-muted-foreground'>
                    {c.source}
                  </TableCell>
                  <TableCell className='text-sm text-muted-foreground'>
                    {c.tags.join(', ')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Export button */}
      <div>
        <Button size='lg' className='w-full sm:w-auto text-sm'>
          <DownloadIcon className='size-4 mr-2' /> Exportar base limpa (
          {exportStats.readyToExport.toLocaleString('pt-BR')} contatos)
        </Button>
      </div>
    </div>
  )
}

export default ExportarPage
