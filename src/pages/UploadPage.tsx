import { useId, useRef, useState } from 'react'
import {
  UploadCloudIcon,
  FileIcon,
  XIcon,
  CheckCircle2Icon,
  Loader2Icon,
  RotateCcwIcon,
  AlertTriangleIcon,
} from 'lucide-react'
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
import { toast } from 'sonner'
import { useStore } from '@/lib/store'
import { type FonteContato, FONTE_LABELS, type ImportacaoHistorico } from '@/lib/mock-data'

// ── Constants ──────────────────────────────────────────────────────────────────

const SOURCE_TYPES: { value: FonteContato; label: string }[] = [
  { value: 'vendas',   label: FONTE_LABELS.vendas   },
  { value: 'email',    label: FONTE_LABELS.email    },
  { value: 'whatsapp', label: FONTE_LABELS.whatsapp },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR')
}

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024).toFixed(0)} KB`
}

// ── Component ──────────────────────────────────────────────────────────────────

const UploadPage = () => {
  const selectId = useId()
  const fileRef  = useRef<HTMLInputElement>(null)
  const { state, dispatch } = useStore()

  const [sourceType,   setSourceType]   = useState<FonteContato | ''>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading,    setUploading]    = useState(false)
  const [dragOver,     setDragOver]     = useState(false)
  const [revertTarget, setRevertTarget] = useState<ImportacaoHistorico | null>(null)

  // Derive active base cards — most recent 'ativa' per fonte
  const activeBases = (['vendas', 'email', 'whatsapp'] as FonteContato[])
    .map((fonte) =>
      state.importacoes
        .filter((i) => i.fonte === fonte && i.status === 'ativa')
        .sort((a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime())[0] ?? null,
    )
    .filter(Boolean) as ImportacaoHistorico[]

  // History sorted most recent first
  const sortedHistory = [...state.importacoes].sort(
    (a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime(),
  )

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

    const newId = `imp-${Date.now()}`
    const newImportacao: ImportacaoHistorico = {
      id: newId,
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fonte: sourceType,
      importedAt: new Date().toISOString(),
      contatosIds: [],
      status: 'processando',
    }

    dispatch({ type: 'IMPORTACAO_ADD', payload: newImportacao })

    await new Promise((r) => setTimeout(r, 1800))

    dispatch({ type: 'IMPORTACAO_UPDATE_STATUS', payload: { id: newId, status: 'ativa' } })
    toast.success(`Base ${FONTE_LABELS[sourceType]} carregada com sucesso`)

    clearFile()
    setSourceType('')
    setUploading(false)
  }

  // ── Revert ──────────────────────────────────────────────────────────────────

  function confirmReverter() {
    if (!revertTarget) return
    const count = revertTarget.contatosIds.length
    dispatch({ type: 'IMPORTACAO_REVERTER', payload: revertTarget.id })
    toast.success(
      count > 0
        ? `Importação revertida. ${count} contato${count !== 1 ? 's' : ''} marcado${count !== 1 ? 's' : ''} como órfão.`
        : 'Importação revertida com sucesso.',
    )
    setRevertTarget(null)
  }

  const canUpload = !!selectedFile && !!sourceType && !uploading

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className='flex flex-col gap-8 max-w-4xl'>

      {/* ── Carregar nova base ─────────────────────────────────────────────────── */}
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
            <Select value={sourceType} onValueChange={(v) => setSourceType(v as FonteContato)}>
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
                    <p className='text-[11px] text-muted-foreground font-light'>{formatSize(selectedFile.size)}</p>
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

      {/* ── Bases carregadas ───────────────────────────────────────────────────── */}
      <section>
        <div className='flex items-baseline gap-3 mb-5'>
          <h2 className='font-serif text-[22px] font-normal tracking-tight'>Bases carregadas</h2>
          <span className='text-xs text-muted-foreground font-light'>
            {activeBases.length} fonte{activeBases.length !== 1 ? 's' : ''} ativa{activeBases.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {activeBases.map((imp) => (
            <div
              key={imp.id}
              className='relative rounded-lg border border-border bg-card px-5 py-5 flex flex-col gap-3'
            >
              <span className='absolute top-3.5 right-3.5 size-1.5 rounded-full bg-success' />
              <span className='text-[9px] uppercase tracking-[0.14em] text-muted-foreground'>
                {FONTE_LABELS[imp.fonte]}
              </span>
              <FileIcon className='size-6 text-muted-foreground/40' />
              <div>
                <p className='text-sm font-medium leading-none mb-1 truncate'>{imp.fileName}</p>
                <p className='text-[11px] text-muted-foreground font-light'>
                  {imp.contatosIds.length > 0 ? `${imp.contatosIds.length.toLocaleString('pt-BR')} contatos · ` : ''}
                  {formatSize(imp.fileSize)}
                </p>
              </div>
              <button
                onClick={() => setRevertTarget(imp)}
                className='flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-destructive transition-colors mt-auto w-fit'
              >
                <RotateCcwIcon className='size-3' />
                Reverter importação
              </button>
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

      {/* ── Histórico de importações ──────────────────────────────────────────── */}
      <section>
        <h2 className='font-serif text-[22px] font-normal tracking-tight mb-5'>Histórico de importações</h2>

        <div className='rounded-lg border border-border overflow-hidden'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='pl-4 h-11 text-[10px] uppercase tracking-[0.08em] text-muted-foreground font-normal'>Arquivo</TableHead>
                  <TableHead className='h-11 text-[10px] uppercase tracking-[0.08em] text-muted-foreground font-normal hidden sm:table-cell'>Tipo</TableHead>
                  <TableHead className='h-11 text-[10px] uppercase tracking-[0.08em] text-muted-foreground font-normal hidden md:table-cell'>Data</TableHead>
                  <TableHead className='h-11 text-[10px] uppercase tracking-[0.08em] text-muted-foreground font-normal hidden md:table-cell'>Contatos</TableHead>
                  <TableHead className='h-11 text-[10px] uppercase tracking-[0.08em] text-muted-foreground font-normal'>Status</TableHead>
                  <TableHead className='h-11 w-10' />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHistory.map((imp) => (
                  <TableRow key={imp.id}>
                    <TableCell className='pl-4 text-sm font-medium'>
                      <div className='flex items-center gap-2'>
                        <FileIcon className='size-3.5 text-muted-foreground/50 flex-shrink-0' />
                        <span className='truncate max-w-[140px] sm:max-w-none'>{imp.fileName}</span>
                      </div>
                    </TableCell>
                    <TableCell className='text-sm text-muted-foreground hidden sm:table-cell'>
                      {FONTE_LABELS[imp.fonte]}
                    </TableCell>
                    <TableCell className='text-sm text-muted-foreground hidden md:table-cell'>
                      {formatDate(imp.importedAt)}
                    </TableCell>
                    <TableCell className='text-sm text-muted-foreground hidden md:table-cell'>
                      {imp.contatosIds.length > 0 ? imp.contatosIds.length.toLocaleString('pt-BR') : '—'}
                    </TableCell>
                    <TableCell>
                      {imp.status === 'ativa' && (
                        <Badge variant='outline' className='badge-success rounded-full px-2.5 py-0.5 text-[11px] font-normal gap-1.5 whitespace-nowrap'>
                          <CheckCircle2Icon className='size-3' />
                          Ativa
                        </Badge>
                      )}
                      {imp.status === 'processando' && (
                        <Badge variant='outline' className='badge-info rounded-full px-2.5 py-0.5 text-[11px] font-normal gap-1.5 whitespace-nowrap'>
                          <Loader2Icon className='size-3 animate-spin' />
                          Processando
                        </Badge>
                      )}
                      {imp.status === 'erro' && (
                        <Badge variant='outline' className='badge-error rounded-full px-2.5 py-0.5 text-[11px] font-normal gap-1.5 whitespace-nowrap'>
                          <span className='size-1.5 rounded-full bg-current inline-block' />
                          Erro
                        </Badge>
                      )}
                      {imp.status === 'revertida' && (
                        <Badge variant='outline' className='rounded-full px-2.5 py-0.5 text-[11px] font-normal gap-1.5 whitespace-nowrap text-muted-foreground border-border'>
                          <RotateCcwIcon className='size-3' />
                          Revertida
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className='pr-3 text-right'>
                      {imp.status === 'ativa' && (
                        <button
                          onClick={() => setRevertTarget(imp)}
                          className='text-muted-foreground hover:text-destructive transition-colors p-1 rounded hover:bg-destructive/10'
                          title='Reverter importação'
                        >
                          <RotateCcwIcon className='size-3.5' />
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* ── AlertDialog: Confirmar reverter ──────────────────────────────────── */}
      <AlertDialog open={!!revertTarget} onOpenChange={(open) => { if (!open) setRevertTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2'>
              <AlertTriangleIcon className='size-4 text-destructive' />
              Reverter importação
            </AlertDialogTitle>
            <AlertDialogDescription className='space-y-1'>
              {revertTarget && (
                <>
                  Isso reverterá <strong>{revertTarget.fileName}</strong> ({FONTE_LABELS[revertTarget.fonte]}).
                  {revertTarget.contatosIds.length > 0 && (
                    <> <strong>{revertTarget.contatosIds.length} contato{revertTarget.contatosIds.length !== 1 ? 's' : ''}</strong> exclusivo{revertTarget.contatosIds.length !== 1 ? 's' : ''} desta importação será marcado como <strong>órfão</strong>.</>
                  )}{' '}
                  Esta ação não pode ser desfeita.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReverter}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Reverter importação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}

export default UploadPage
