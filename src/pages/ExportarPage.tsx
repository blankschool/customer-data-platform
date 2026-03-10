import { useState } from 'react'
import {
  DownloadIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  CheckCircle2Icon,
  Loader2Icon,
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
import { exportCSV, exportExcel } from '@/lib/export-utils'
import { useStore } from '@/lib/store'
import { FONTE_LABELS, type FonteContato } from '@/lib/mock-data'
import { toast } from 'sonner'

type Format = 'csv' | 'excel'

const ExportarPage = () => {
  const { state } = useStore()
  const [selectedFormat, setSelectedFormat] = useState<Format>('csv')
  const [loading, setLoading] = useState(false)

  const contatos = state.contatos
  const ativos = contatos.filter((c) => c.status === 'ativo')

  const statsGrid = [
    { label: 'Total de contatos',    value: contatos.length,                                         color: '' },
    { label: 'Contatos ativos',      value: ativos.length,                                          color: 'text-emerald-500' },
    { label: 'Inativos / Pendente',  value: contatos.length - ativos.length,                        color: 'text-muted-foreground' },
    { label: 'Com tags',             value: contatos.filter((c) => c.tags.length > 0).length,       color: 'text-amber-400' },
    { label: 'Conflitos resolvidos', value: state.inconsistencias.filter((i) => i.resolved).length, color: 'text-emerald-500' },
    { label: 'Prontos p/ exportar',  value: ativos.length,                                          color: 'text-emerald-500' },
  ]

  async function handleExport() {
    setLoading(true)
    try {
      if (selectedFormat === 'csv') {
        exportCSV(contatos)
      } else {
        exportExcel(contatos)
      }
      toast.success(`Exportação ${selectedFormat.toUpperCase()} concluída`)
    } catch {
      toast.error('Erro ao exportar')
    } finally {
      setLoading(false)
    }
  }

  const previewContacts = contatos.slice(0, 5)

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
        <div className='rounded-lg border border-border overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className='hidden sm:table-cell'>Email</TableHead>
                <TableHead className='hidden sm:table-cell'>Telefone</TableHead>
                <TableHead className='hidden sm:table-cell'>Fonte</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewContacts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className='text-sm font-medium'>{c.name}</TableCell>
                  <TableCell className='text-sm text-muted-foreground hidden sm:table-cell'>{c.email}</TableCell>
                  <TableCell className='text-sm text-muted-foreground hidden sm:table-cell'>{c.phone}</TableCell>
                  <TableCell className='text-sm text-muted-foreground hidden sm:table-cell'>{FONTE_LABELS[c.source as FonteContato] ?? c.source}</TableCell>
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
        <Button
          size='lg'
          className='w-full sm:w-auto text-sm'
          onClick={handleExport}
          disabled={loading}
        >
          {loading ? (
            <Loader2Icon className='size-4 mr-2 animate-spin' />
          ) : (
            <DownloadIcon className='size-4 mr-2' />
          )}
          Exportar base limpa ({ativos.length.toLocaleString('pt-BR')} contatos)
        </Button>
      </div>
    </div>
  )
}

export default ExportarPage
