import { useId, useRef, useState } from 'react'
import { UploadCloudIcon, FileIcon, XIcon, CheckCircle2Icon, Loader2Icon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// ── Types ──────────────────────────────────────────────────────────────────────

type SourceType = 'vendas' | 'email-marketing' | 'crm-whatsapp'

type Base = {
  id: string
  tipo: SourceType
  label: string
  fileName: string
  info: string
  loaded: true
}

type HistoryRow = {
  id: string
  file: string
  tipo: string
  date: string
  rows: string
  status: 'success' | 'processing' | 'error'
}

// ── Constants ──────────────────────────────────────────────────────────────────

const SOURCE_TYPES: { value: SourceType; label: string }[] = [
  { value: 'vendas',          label: 'Vendas' },
  { value: 'email-marketing', label: 'Email Marketing' },
  { value: 'crm-whatsapp',    label: 'CRM WhatsApp' },
]

const SOURCE_LABEL: Record<SourceType, string> = {
  'vendas':          'Base de Vendas',
  'email-marketing': 'Email Marketing',
  'crm-whatsapp':    'CRM WhatsApp',
}

const INITIAL_BASES: Base[] = [
  { id: '1', tipo: 'vendas',          label: 'Base de Vendas',   fileName: 'clientes_vendas_mar25.csv',   info: '2.847 contatos · 12 colunas', loaded: true },
  { id: '2', tipo: 'email-marketing', label: 'Email Marketing',  fileName: 'mailchimp_export_032025.xlsx', info: '3.102 contatos · 9 colunas',  loaded: true },
]

const INITIAL_HISTORY: HistoryRow[] = [
  { id: '1', file: 'clientes_vendas_mar25.csv',    tipo: 'Vendas',          date: '09/03/2026', rows: '2.847 linhas', status: 'success' },
  { id: '2', file: 'mailchimp_export_032025.xlsx', tipo: 'Email Marketing', date: '08/03/2026', rows: '3.102 linhas', status: 'success' },
  { id: '3', file: 'crm_whatsapp_fev25.csv',       tipo: 'CRM WhatsApp',    date: '15/02/2026', rows: '1.230 linhas', status: 'error'   },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function today() {
  return new Date().toLocaleDateString('pt-BR')
}

function randomRows() {
  const n = Math.floor(Math.random() * 4000) + 500
  return `${n.toLocaleString('pt-BR')} linhas`
}

function randomInfo(rows: string) {
  const cols = Math.floor(Math.random() * 8) + 6
  return `${rows.replace(' linhas', ' contatos')} · ${cols} colunas`
}

// ── Component ──────────────────────────────────────────────────────────────────

const UploadPage = () => {
  const selectId  = useId()
  const fileRef   = useRef<HTMLInputElement>(null)

  const [bases,        setBases]        = useState<Base[]>(INITIAL_BASES)
  const [history,      setHistory]      = useState<HistoryRow[]>(INITIAL_HISTORY)
  const [sourceType,   setSourceType]   = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading,    setUploading]    = useState(false)
  const [dragOver,     setDragOver]     = useState(false)

  // ── File selection ───────────────────────────────────────────────────────────

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0] ?? null
    if (file) setSelectedFile(file)
  }

  function clearFile() {
    setSelectedFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  // ── Upload simulation ────────────────────────────────────────────────────────

  async function handleUpload() {
    if (!selectedFile || !sourceType) return
    setUploading(true)

    const rowsStr = randomRows()
    const newHistoryId = Date.now().toString()

    // Add processing row immediately
    const processingRow: HistoryRow = {
      id: newHistoryId,
      file: selectedFile.name,
      tipo: SOURCE_TYPES.find((s) => s.value === sourceType)?.label ?? sourceType,
      date: today(),
      rows: rowsStr,
      status: 'processing',
    }
    setHistory((prev) => [processingRow, ...prev])

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 1800))

    // Update history row to success
    setHistory((prev) =>
      prev.map((row) =>
        row.id === newHistoryId ? { ...row, status: 'success' } : row
      )
    )

    // Upsert base card
    const tipo = sourceType as SourceType
    const info = randomInfo(rowsStr)
    setBases((prev) => {
      const exists = prev.find((b) => b.tipo === tipo)
      if (exists) {
        return prev.map((b) =>
          b.tipo === tipo
            ? { ...b, fileName: selectedFile.name, info }
            : b
        )
      }
      return [
        ...prev,
        {
          id: newHistoryId,
          tipo,
          label: SOURCE_LABEL[tipo],
          fileName: selectedFile.name,
          info,
          loaded: true,
        },
      ]
    })

    // Reset form
    clearFile()
    setSourceType('')
    setUploading(false)
  }

  const canUpload = !!selectedFile && !!sourceType && !uploading

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className='flex flex-col gap-8 max-w-4xl'>

      {/* ── Carregar nova base ────────────────────────────────────────────────── */}
      <section>
        <div className='flex items-baseline gap-3 mb-5'>
          <h2 className='font-serif text-[22px] font-normal tracking-tight'>Carregar nova base</h2>
          <span className='text-xs text-muted-foreground font-light'>CSV ou Excel · máx. 50 MB</span>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 items-start'>
          {/* Source type select */}
          <div className='w-full sm:w-52 flex-shrink-0 space-y-2'>
            <Label htmlFor={selectId} className='text-[11px] uppercase tracking-[0.1em] text-muted-foreground font-normal'>
              Tipo de fonte <span className='text-destructive'>*</span>
            </Label>
            <Select value={sourceType} onValueChange={setSourceType}>
              <SelectTrigger id={selectId} className='w-full h-[88px] rounded-lg text-sm'>
                <SelectValue placeholder='Selecionar fonte…' />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_TYPES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Drop zone */}
          <div className='flex-1 w-full space-y-2'>
            <Label className='text-[11px] uppercase tracking-[0.1em] text-muted-foreground font-normal'>
              Arquivo <span className='text-destructive'>*</span>
            </Label>
            <div
              onClick={() => !selectedFile && fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative h-[88px] rounded-lg border-2 border-dashed flex items-center justify-center gap-3 transition-colors cursor-pointer
                ${dragOver
                  ? 'border-foreground/40 bg-muted/40'
                  : selectedFile
                    ? 'border-border bg-muted/20 cursor-default'
                    : 'border-border/60 hover:border-muted-foreground/40 hover:bg-muted/20'
                }`}
            >
              <input
                ref={fileRef}
                type='file'
                accept='.csv,.xlsx,.xls'
                onChange={handleFileChange}
                className='hidden'
              />

              {selectedFile ? (
                <div className='flex items-center gap-2.5 px-4 w-full'>
                  <FileIcon className='size-5 text-muted-foreground/60 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate'>{selectedFile.name}</p>
                    <p className='text-[11px] text-muted-foreground font-light'>
                      {(selectedFile.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); clearFile() }}
                    className='flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted'
                  >
                    <XIcon className='size-3.5' />
                  </button>
                </div>
              ) : (
                <div className='flex flex-col items-center gap-1 text-center px-4'>
                  <UploadCloudIcon className='size-5 text-muted-foreground/50' />
                  <p className='text-xs text-muted-foreground'>
                    Arraste ou <span className='text-foreground underline underline-offset-2'>escolha um arquivo</span>
                  </p>
                  <p className='text-[10px] text-muted-foreground/50'>.csv, .xlsx, .xls</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='mt-4'>
          <Button
            onClick={handleUpload}
            disabled={!canUpload}
            size='sm'
            className='h-9 px-5 text-sm gap-2'
          >
            {uploading ? (
              <>
                <Loader2Icon className='size-3.5 animate-spin' />
                Processando…
              </>
            ) : (
              'Carregar base →'
            )}
          </Button>
        </div>
      </section>

      <Separator />

      {/* ── Bases carregadas ──────────────────────────────────────────────────── */}
      <section>
        <div className='flex items-baseline gap-3 mb-5'>
          <h2 className='font-serif text-[22px] font-normal tracking-tight'>Bases carregadas</h2>
          <span className='text-xs text-muted-foreground font-light'>{bases.length} fonte{bases.length !== 1 ? 's' : ''} ativa{bases.length !== 1 ? 's' : ''}</span>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {bases.map((base) => (
            <div
              key={base.id}
              className='relative rounded-lg border border-border bg-card px-5 py-5 flex flex-col gap-3 hover:bg-card/60 transition-all cursor-pointer'
            >
              <span className='absolute top-3.5 right-3.5 size-1.5 rounded-full bg-success' />
              <span className='text-[9px] uppercase tracking-[0.14em] text-muted-foreground'>{base.label}</span>
              <FileIcon className='size-6 text-muted-foreground/40' />
              <div>
                <p className='text-sm font-medium leading-none mb-1 truncate'>{base.fileName}</p>
                <p className='text-[11px] text-muted-foreground font-light'>{base.info}</p>
              </div>
            </div>
          ))}

          {/* Add new base shortcut */}
          <button
            onClick={() => fileRef.current?.click()}
            className='rounded-lg border-2 border-dashed border-border/50 bg-transparent px-5 py-5 flex flex-col items-center justify-center gap-2 hover:border-muted-foreground/40 hover:bg-muted/20 transition-all cursor-pointer min-h-[110px]'
          >
            <UploadCloudIcon className='size-5 text-muted-foreground/40' />
            <span className='text-xs text-muted-foreground font-light'>Adicionar fonte</span>
          </button>
        </div>
      </section>

      <Separator />

      {/* ── Histórico de uploads ──────────────────────────────────────────────── */}
      <section>
        <h2 className='font-serif text-[22px] font-normal tracking-tight mb-5'>Histórico de uploads</h2>

        <div className='rounded-lg border border-border overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='pl-4 h-11 text-[10px] uppercase tracking-[0.08em] text-muted-foreground font-normal'>Arquivo</TableHead>
                <TableHead className='h-11 text-[10px] uppercase tracking-[0.08em] text-muted-foreground font-normal hidden sm:table-cell'>Tipo</TableHead>
                <TableHead className='h-11 text-[10px] uppercase tracking-[0.08em] text-muted-foreground font-normal hidden md:table-cell'>Data</TableHead>
                <TableHead className='h-11 text-[10px] uppercase tracking-[0.08em] text-muted-foreground font-normal hidden md:table-cell'>Linhas</TableHead>
                <TableHead className='h-11 text-[10px] uppercase tracking-[0.08em] text-muted-foreground font-normal'>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className='pl-4 text-sm font-medium'>
                    <div className='flex items-center gap-2'>
                      <FileIcon className='size-3.5 text-muted-foreground/50 flex-shrink-0' />
                      <span className='truncate max-w-[160px] sm:max-w-none'>{row.file}</span>
                    </div>
                  </TableCell>
                  <TableCell className='text-sm text-muted-foreground hidden sm:table-cell'>{row.tipo}</TableCell>
                  <TableCell className='text-sm text-muted-foreground hidden md:table-cell'>{row.date}</TableCell>
                  <TableCell className='text-sm text-muted-foreground hidden md:table-cell'>{row.rows}</TableCell>
                  <TableCell>
                    {row.status === 'success' && (
                      <Badge variant='outline' className='badge-success rounded-full px-2.5 py-0.5 text-[11px] font-normal gap-1.5'>
                        <CheckCircle2Icon className='size-3' />
                        Sucesso
                      </Badge>
                    )}
                    {row.status === 'processing' && (
                      <Badge variant='outline' className='badge-info rounded-full px-2.5 py-0.5 text-[11px] font-normal gap-1.5'>
                        <Loader2Icon className='size-3 animate-spin' />
                        Processando
                      </Badge>
                    )}
                    {row.status === 'error' && (
                      <Badge variant='outline' className='badge-error rounded-full px-2.5 py-0.5 text-[11px] font-normal gap-1.5'>
                        <span className='size-1.5 rounded-full bg-current inline-block' />
                        Erro de formato
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}

export default UploadPage
