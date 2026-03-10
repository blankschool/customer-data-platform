import { Link } from 'react-router-dom'
import { ArrowRightIcon, FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { healthMetrics, FONTE_LABELS, type FonteContato } from '@/lib/mock-data'
import { useStore } from '@/lib/store'

const DashboardPage = () => {
  const { state } = useStore()

  // Bases ativas — most recent per fonte
  const activeBases = (['vendas', 'email', 'whatsapp'] as FonteContato[]).map((fonte) =>
    state.importacoes
      .filter((i) => i.fonte === fonte && i.status === 'ativa')
      .sort((a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime())[0] ?? null,
  )
  const activeBaseCount = activeBases.filter(Boolean).length

  // Inconsistências pendentes
  const pending = state.inconsistencias.filter((i) => !i.resolved)

  const inconsistenciaCards = [
    { label: 'Duplicatas',    count: pending.filter((i) => i.tipo === 'Duplicata').length,    color: 'text-red-500'          },
    { label: 'Tag ausente',   count: pending.filter((i) => i.tipo === 'Tag ausente').length,  color: 'text-amber-400'        },
    { label: 'Inadimplentes', count: pending.filter((i) => i.tipo === 'Inadimplente').length, color: 'text-sky-500'          },
    { label: 'Órfãos',        count: pending.filter((i) => i.tipo === 'Órfão').length,        color: 'text-muted-foreground' },
  ]

  return (
    <div className='flex flex-col gap-10 max-w-4xl'>

      {/* ── Bases carregadas ──────────────────────────────────────── */}
      <section>
        <div className='flex items-baseline justify-between mb-5'>
          <div className='flex items-baseline gap-3'>
            <h2 className='font-serif text-[22px] font-normal tracking-tight'>Bases carregadas</h2>
            <span className='text-xs text-muted-foreground font-light'>
              {activeBaseCount} fonte{activeBaseCount !== 1 ? 's' : ''} ativa{activeBaseCount !== 1 ? 's' : ''}
            </span>
          </div>
          <Button variant='ghost' size='sm' asChild className='text-xs gap-1 text-muted-foreground hover:text-foreground'>
            <Link to='/upload'>Gerenciar <ArrowRightIcon className='size-3' /></Link>
          </Button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {(['vendas', 'email', 'whatsapp'] as FonteContato[]).map((fonte, i) => {
            const imp = activeBases[i]
            return (
              <div
                key={fonte}
                className='relative rounded-xl border border-border bg-card px-5 py-5 flex flex-col gap-3 min-w-0 overflow-hidden'
              >
                {imp && (
                  <span className='absolute top-3.5 right-3.5 size-1.5 rounded-full bg-emerald-500' />
                )}
                <span className='text-[9px] uppercase tracking-[0.12em] text-muted-foreground truncate block pr-4'>
                  {FONTE_LABELS[fonte]}
                </span>
                <FileIcon className={`size-6 flex-shrink-0 ${imp ? 'text-muted-foreground/40' : 'text-border'}`} />
                <div className='min-w-0'>
                  {imp ? (
                    <>
                      <p className='text-sm font-medium leading-none mb-1 truncate'>{imp.fileName}</p>
                      <p className='text-[11px] text-muted-foreground font-light'>
                        {imp.contatosIds.length > 0
                          ? `${imp.contatosIds.length.toLocaleString('pt-BR')} contatos · `
                          : ''}
                        {new Date(imp.importedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </>
                  ) : (
                    <p className='text-sm text-muted-foreground/50 font-light'>Não carregada</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <Separator />

      {/* ── Saúde da base ─────────────────────────────────────────── */}
      <section>
        <div className='flex items-baseline gap-3 mb-4'>
          <h2 className='font-serif text-[22px] font-normal tracking-tight'>Saúde da base</h2>
          <span className='text-xs text-muted-foreground font-light'>Baseado nas bases carregadas</span>
        </div>

        <div className='mb-4'>
          <div className='h-0.5 bg-border rounded-full overflow-hidden mb-1.5'>
            <div className='h-full bg-foreground/60 rounded-full w-[65%]' />
          </div>
          <div className='flex justify-between text-[10px] text-muted-foreground'>
            <span>Diagnóstico em andamento</span>
            <span>65%</span>
          </div>
        </div>

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

      {/* ── Inconsistências pendentes ─────────────────────────────── */}
      <section>
        <div className='flex items-baseline justify-between mb-5'>
          <div className='flex items-baseline gap-3'>
            <h2 className='font-serif text-[22px] font-normal tracking-tight'>Inconsistências pendentes</h2>
            <span className='text-xs text-muted-foreground font-light'>
              {pending.length} aguardando resolução
            </span>
          </div>
          {pending.length > 0 && (
            <Button variant='ghost' size='sm' asChild className='text-xs gap-1 text-muted-foreground hover:text-foreground'>
              <Link to='/inconsistencias'>Ver todas <ArrowRightIcon className='size-3' /></Link>
            </Button>
          )}
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden border border-border mb-5'>
          {inconsistenciaCards.map((c) => (
            <div key={c.label} className='bg-card px-5 py-6 flex flex-col gap-1.5'>
              <span className='text-[10px] uppercase tracking-[0.1em] text-muted-foreground'>{c.label}</span>
              <span className={`font-sans text-[36px] font-light tracking-[-0.03em] leading-none ${c.color}`}>
                {c.count}
              </span>
            </div>
          ))}
        </div>

        {pending.length > 0 ? (
          <Button asChild size='sm'>
            <Link to='/inconsistencias'>
              Resolver {pending.length} inconsistênci{pending.length !== 1 ? 'as' : 'a'} →
            </Link>
          </Button>
        ) : (
          <div className='rounded-lg border border-border bg-muted/20 px-5 py-4 text-center'>
            <p className='text-sm text-muted-foreground font-light'>Nenhuma inconsistência pendente</p>
          </div>
        )}
      </section>

      <Separator />

      {/* ── Ações rápidas ─────────────────────────────────────────── */}
      <section>
        <h2 className='font-serif text-[22px] font-normal tracking-tight mb-5'>Ações rápidas</h2>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {[
            { to: '/contatos',       title: `${state.contatos.length.toLocaleString('pt-BR')} contatos`, sub: 'Gerenciar base' },
            { to: '/exportar',       title: 'Exportar base',                                              sub: 'CSV ou Excel' },
            { to: '/upload',         title: 'Carregar base',                                              sub: 'CSV ou Excel · máx. 50 MB' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className='rounded-lg border border-border bg-card px-5 py-5 flex items-center justify-between hover:bg-muted/20 transition-colors group'
            >
              <div>
                <p className='text-sm font-medium'>{item.title}</p>
                <p className='text-[11px] text-muted-foreground font-light mt-0.5'>{item.sub}</p>
              </div>
              <ArrowRightIcon className='size-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0' />
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}

export default DashboardPage
