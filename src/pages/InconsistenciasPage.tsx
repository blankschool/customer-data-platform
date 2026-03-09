import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import TransactionDatatable from '@/components/shadcn-studio/blocks/datatable-transaction'
import { inconsistenciasData, healthMetrics, filterPills } from '@/lib/mock-data'

const InconsistenciasPage = () => {
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredData =
    activeFilter === 'all'
      ? inconsistenciasData
      : inconsistenciasData.filter((item) => {
          if (activeFilter === 'duplicata') return item.status === 'failed'
          if (activeFilter === 'tag') return item.status === 'processing'
          if (activeFilter === 'inadimplente') return item.status === 'pending'
          return false
        })

  return (
    <div className='flex flex-1 -mx-10 -my-10 overflow-hidden'>
      {/* ── Main scrollable area ─────────────────────────────── */}
      <div className='flex-1 overflow-y-auto px-10 py-10 flex flex-col gap-8'>
        {/* Health metrics section */}
        <section>
          <div className='flex items-baseline gap-3 mb-4'>
            <h2 className='font-serif text-[22px] font-normal tracking-tight'>Saúde da base</h2>
            <span className='text-xs text-muted-foreground font-light'>Baseado nas 2 bases carregadas</span>
          </div>

          {/* Progress bar */}
          <div className='mb-4'>
            <div className='h-0.5 bg-border rounded-full overflow-hidden mb-1.5'>
              <div className='h-full bg-foreground/60 rounded-full w-[65%]' />
            </div>
            <div className='flex justify-between text-[10px] text-muted-foreground'>
              <span>Diagnóstico em andamento</span>
              <span>65%</span>
            </div>
          </div>

          {/* 4-column health grid */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden border border-border'>
            {healthMetrics.map((m, i) => (
              <div key={i} className='bg-card px-5 py-6 flex flex-col gap-1.5'>
                <span className='text-[10px] uppercase tracking-[0.1em] text-muted-foreground'>{m.label}</span>
                <span className={`font-sans text-[36px] font-light tracking-[-0.03em] leading-none ${m.color}`}>
                  {m.value}
                </span>
                <span className='text-[11px] text-muted-foreground font-light'>{m.delta}</span>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Inconsistencies section */}
        <section>
          <h2 className='font-serif text-[22px] font-normal tracking-tight mb-4'>Inconsistências</h2>

          {/* Filter pills */}
          <div className='flex items-center gap-2 mb-4 flex-wrap'>
            {filterPills.map((pill) => (
              <button
                key={pill.id}
                onClick={() => setActiveFilter(pill.id)}
                className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                  activeFilter === pill.id
                    ? 'bg-foreground border-foreground text-background'
                    : 'border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground'
                }`}
              >
                {pill.label}{' '}
                <span className='opacity-40 ml-0.5'>{pill.count}</span>
              </button>
            ))}
            <span className='ml-auto text-[11px] text-muted-foreground font-light'>
              Mostrando {Math.min(5, filteredData.length)} de {filteredData.length}
            </span>
          </div>

          <Card className='py-0'>
            <TransactionDatatable data={filteredData} />
          </Card>
        </section>
      </div>

      {/* ── Detail aside panel ───────────────────────────────── */}
      <aside className='w-72 border-l border-border flex-shrink-0 overflow-y-auto hidden xl:flex flex-col bg-card'>
        {/* Contact header */}
        <div className='px-6 py-6 border-b border-border'>
          <h3 className='font-serif text-base font-normal tracking-tight mb-1'>Ana Paula Ribeiro</h3>
          <p className='text-[11px] text-muted-foreground font-light'>ana.ribeiro@email.com</p>
        </div>

        {/* Informações */}
        <div className='px-6 py-5 border-b border-border flex flex-col gap-3'>
          <span className='text-[9px] uppercase tracking-[0.12em] text-muted-foreground'>Informações</span>
          {[
            { key: 'Telefone', val: 'Conflito', valClass: 'text-[hsl(var(--error))]' },
            { key: 'Fontes', val: 'Vendas, E-mail', valClass: '' },
            { key: 'Primeira compra', val: 'Jan 2024', valClass: '' },
            { key: 'Tags atuais', val: 'lead, newsletter', valClass: '' },
          ].map((row) => (
            <div key={row.key} className='flex justify-between items-center'>
              <span className='text-[11px] text-muted-foreground font-light'>{row.key}</span>
              <span className={`text-xs font-medium ${row.valClass}`}>{row.val}</span>
            </div>
          ))}
        </div>

        {/* Conflito detectado */}
        <div className='px-6 py-5 border-b border-border flex flex-col gap-3'>
          <span className='text-[9px] uppercase tracking-[0.12em] text-muted-foreground'>Conflito detectado</span>
          <div className='rounded-md border conflict-error p-3 flex flex-col gap-2.5'>
            <span className='text-[9px] uppercase tracking-[0.1em] text-error font-medium'>Telefone divergente</span>
            <div className='flex justify-between items-center'>
              <span className='text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded'>Vendas</span>
              <span className='text-xs'>(11) 99872-3410</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded'>E-mail</span>
              <span className='text-xs'>(11) 98341-7720</span>
            </div>
            <div className='flex gap-1.5 mt-0.5'>
              <Button size='sm' className='flex-1 h-7 text-[10px]'>
                Usar Vendas
              </Button>
              <Button size='sm' variant='outline' className='flex-1 h-7 text-[10px]'>
                Usar E-mail
              </Button>
            </div>
          </div>
        </div>

        {/* Tags sugeridas */}
        <div className='px-6 py-5 border-b border-border flex flex-col gap-3'>
          <span className='text-[9px] uppercase tracking-[0.12em] text-muted-foreground'>Tags sugeridas</span>
          <div className='flex flex-wrap gap-1.5'>
            {['+ cliente-ativo', '+ comprou-2024', '+ social-media'].map((tag) => (
              <span
                key={tag}
                className='text-[10px] px-2.5 py-1 rounded border border-border text-muted-foreground bg-muted hover:border-muted-foreground/50 hover:text-foreground cursor-pointer transition-all'
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className='px-6 py-5'>
          <Button className='w-full text-xs' size='sm'>
            Salvar alterações
          </Button>
        </div>
      </aside>
    </div>
  )
}

export default InconsistenciasPage
