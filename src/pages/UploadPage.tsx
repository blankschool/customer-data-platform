import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const uploadHistory = [
  { file: 'clientes_vendas_mar25.csv',    date: '09/03/2026', rows: '2.847 linhas', status: 'success' as const },
  { file: 'mailchimp_export_032025.xlsx',  date: '08/03/2026', rows: '3.102 linhas', status: 'success' as const },
  { file: 'crm_whatsapp_fev25.csv',       date: '15/02/2026', rows: '1.230 linhas', status: 'error'   as const },
]

const UploadPage = () => {
  return (
    <div className='flex flex-col gap-8'>
      {/* ── Bases carregadas ──────────────────────────────────── */}
      <section>
        <div className='flex items-baseline gap-3 mb-4'>
          <h2 className='font-serif text-[22px] font-normal tracking-tight'>Bases carregadas</h2>
          <span className='text-xs text-muted-foreground font-light'>CSV ou Excel · máx. 50 MB por arquivo</span>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {/* Base Vendas -- loaded */}
          <div className='relative rounded-lg border border-border bg-card px-6 py-7 flex flex-col items-center gap-2.5 cursor-pointer hover:bg-card/60 transition-all'>
            <span className='absolute top-3.5 right-3.5 size-1.5 rounded-full bg-emerald-500' />
            <span className='text-[9px] uppercase tracking-[0.14em] text-muted-foreground'>Base de vendas</span>
            <span className='text-[22px] opacity-60 leading-none'>📄</span>
            <span className='text-xs font-medium text-center'>clientes_vendas_mar25.csv</span>
            <span className='text-[11px] text-muted-foreground font-light'>2.847 contatos · 12 colunas</span>
          </div>

          {/* Base E-mail -- loaded */}
          <div className='relative rounded-lg border border-border bg-card px-6 py-7 flex flex-col items-center gap-2.5 cursor-pointer hover:bg-card/60 transition-all'>
            <span className='absolute top-3.5 right-3.5 size-1.5 rounded-full bg-emerald-500' />
            <span className='text-[9px] uppercase tracking-[0.14em] text-muted-foreground'>Base de e-mail</span>
            <span className='text-[22px] opacity-60 leading-none'>📄</span>
            <span className='text-xs font-medium text-center'>mailchimp_export_032025.xlsx</span>
            <span className='text-[11px] text-muted-foreground font-light'>3.102 contatos · 9 colunas</span>
          </div>

          {/* CRM WhatsApp -- pending */}
          <div className='rounded-lg border border-dashed border-border/50 bg-transparent px-6 py-7 flex flex-col items-center gap-2.5 cursor-pointer hover:border-muted-foreground/40 hover:bg-card/30 transition-all'>
            <span className='text-[9px] uppercase tracking-[0.14em] text-muted-foreground'>CRM WhatsApp</span>
            <span className='text-[22px] opacity-30 leading-none select-none'>+</span>
            <span className='text-xs text-muted-foreground font-light'>Clique para carregar</span>
            <span className='text-[11px] text-muted-foreground/50'>CSV ou Excel</span>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Histórico de uploads ──────────────────────────────── */}
      <section>
        <h2 className='font-serif text-[22px] font-normal tracking-tight mb-4'>Histórico de uploads</h2>

        <div className='rounded-lg border border-border overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-muted-foreground h-12 pl-4'>Arquivo</TableHead>
                <TableHead className='text-muted-foreground h-12'>Data</TableHead>
                <TableHead className='text-muted-foreground h-12'>Linhas</TableHead>
                <TableHead className='text-muted-foreground h-12'>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploadHistory.map((row) => (
                <TableRow key={row.file}>
                  <TableCell className='pl-4 text-sm font-medium'>{row.file}</TableCell>
                  <TableCell className='text-sm text-muted-foreground'>{row.date}</TableCell>
                  <TableCell className='text-sm text-muted-foreground'>{row.rows}</TableCell>
                  <TableCell>
                    {row.status === 'success' ? (
                      <Badge
                        variant='outline'
                        className='badge-success rounded-full px-2.5 py-0.5 text-[11px] font-normal gap-1.5'
                      >
                        <span className='size-1.5 rounded-full bg-current inline-block' />
                        Sucesso
                      </Badge>
                    ) : (
                      <Badge
                        variant='outline'
                        className='badge-error rounded-full px-2.5 py-0.5 text-[11px] font-normal gap-1.5'
                      >
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
