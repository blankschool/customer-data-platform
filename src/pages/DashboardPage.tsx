import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  FileIcon,
  LoaderCircleIcon,
  ServerCrashIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { healthMetrics, FONTE_LABELS, type FonteContato } from '@/lib/mock-data'
import { useStore } from '@/lib/store'
import { trpc } from '@/lib/trpc/react'

type DashboardBaseCard = {
  source: FonteContato
  label: string
  fileName: string | null
  importedAt: string | null
  contactCount: number
  isActive: boolean
}

const DashboardPage = () => {
  const { state } = useStore()
  const dashboardSummary = trpc.dashboard.summary.useQuery()

  const localActiveBases = (['vendas', 'email', 'whatsapp'] as FonteContato[]).map(
    (fonte) =>
      state.importacoes
        .filter((item) => item.fonte === fonte && item.status === 'ativa')
        .sort(
          (left, right) =>
            new Date(right.importedAt).getTime() -
            new Date(left.importedAt).getTime(),
        )[0] ?? null,
  )
  const localPending = state.inconsistencias.filter((item) => !item.resolved)

  const backendSummary = dashboardSummary.data
  const backendReady = backendSummary?.status === 'ready'

  const activeBaseCards: DashboardBaseCard[] = backendReady
    ? backendSummary.dashboard.activeBases.map((item) => ({
        source: item.source,
        label: item.label,
        fileName: item.fileName,
        importedAt: item.importedAt,
        contactCount: item.contactCount,
        isActive: Boolean(item.importId),
      }))
    : (['vendas', 'email', 'whatsapp'] as FonteContato[]).map((fonte, index) => {
        const item = localActiveBases[index]

        return {
          source: fonte,
          label: FONTE_LABELS[fonte],
          fileName: item?.fileName ?? null,
          importedAt: item?.importedAt ?? null,
          contactCount: item?.contatosIds.length ?? 0,
          isActive: Boolean(item),
        }
      })

  const activeBaseCount = backendReady
    ? backendSummary.dashboard.activeBaseCount
    : localActiveBases.filter(Boolean).length

  const pendingCount = backendReady
    ? backendSummary.dashboard.pendingInconsistencies.total
    : localPending.length

  const inconsistenciaCards = backendReady
    ? [
        {
          label: 'Duplicatas',
          count: backendSummary.dashboard.pendingInconsistencies.byType.Duplicata,
          color: 'text-red-500',
        },
        {
          label: 'Tag ausente',
          count:
            backendSummary.dashboard.pendingInconsistencies.byType['Tag ausente'],
          color: 'text-amber-400',
        },
        {
          label: 'Inadimplentes',
          count:
            backendSummary.dashboard.pendingInconsistencies.byType.Inadimplente,
          color: 'text-sky-500',
        },
        {
          label: 'Órfãos',
          count: backendSummary.dashboard.pendingInconsistencies.byType.Órfão,
          color: 'text-muted-foreground',
        },
      ]
    : [
        {
          label: 'Duplicatas',
          count: localPending.filter((item) => item.tipo === 'Duplicata').length,
          color: 'text-red-500',
        },
        {
          label: 'Tag ausente',
          count: localPending.filter((item) => item.tipo === 'Tag ausente').length,
          color: 'text-amber-400',
        },
        {
          label: 'Inadimplentes',
          count:
            localPending.filter((item) => item.tipo === 'Inadimplente').length,
          color: 'text-sky-500',
        },
        {
          label: 'Órfãos',
          count: localPending.filter((item) => item.tipo === 'Órfão').length,
          color: 'text-muted-foreground',
        },
      ]

  const backendStatus = (() => {
    if (dashboardSummary.isLoading) {
      return {
        tone: 'border-border bg-muted/20',
        icon: LoaderCircleIcon,
        title: 'Consultando backend via tRPC',
        description: 'Buscando o resumo do workspace no Supabase.',
        animate: true,
      }
    }

    if (dashboardSummary.isError) {
      return {
        tone: 'border-[hsl(var(--warning)/0.35)] bg-[hsl(var(--warning)/0.08)]',
        icon: ServerCrashIcon,
        title: 'Falha ao carregar o backend',
        description:
          'O dashboard segue exibindo os dados locais enquanto a integração é estabilizada.',
        animate: false,
      }
    }

    if (backendSummary?.status === 'missing_workspace') {
      return {
        tone: 'border-[hsl(var(--warning)/0.35)] bg-[hsl(var(--warning)/0.08)]',
        icon: ServerCrashIcon,
        title: 'Supabase conectado, mas sem workspace inicial',
        description: `Nenhum workspace com slug "${backendSummary.expectedSlug}" foi encontrado ainda. O restante da tela permanece em fallback local.`,
        animate: false,
      }
    }

    if (backendSummary?.status === 'ready') {
      return {
        tone: 'border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.08)]',
        icon: FileIcon,
        title: `Conectado ao workspace ${backendSummary.workspace.name}`,
        description: `Resumo da dashboard vindo do backend tRPC + Supabase para o slug "${backendSummary.workspace.slug}".`,
        animate: false,
      }
    }

    return null
  })()

  const contactCount = backendReady
    ? backendSummary.dashboard.contactCount
    : state.contatos.length

  const BackendStatusIcon = backendStatus?.icon ?? FileIcon

  return (
    <div className='flex flex-col gap-10 max-w-4xl'>
      {backendStatus && (
        <section className={`rounded-xl border px-5 py-4 ${backendStatus.tone}`}>
          <div className='flex items-start gap-3'>
            <BackendStatusIcon
              className={`mt-0.5 size-4 flex-shrink-0 ${
                backendStatus.animate ? 'animate-spin' : ''
              }`}
            />
            <div className='min-w-0'>
              <p className='text-sm font-medium'>{backendStatus.title}</p>
              <p className='mt-1 text-xs font-light text-muted-foreground'>
                {backendStatus.description}
              </p>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className='flex items-baseline justify-between mb-5'>
          <div className='flex items-baseline gap-3'>
            <h2 className='font-serif text-[22px] font-normal tracking-tight'>
              Bases carregadas
            </h2>
            <span className='text-xs text-muted-foreground font-light'>
              {activeBaseCount} fonte{activeBaseCount !== 1 ? 's' : ''} ativa
              {activeBaseCount !== 1 ? 's' : ''}
            </span>
          </div>
          <Button
            variant='ghost'
            size='sm'
            asChild
            className='text-xs gap-1 text-muted-foreground hover:text-foreground'
          >
            <Link to='/upload'>
              Gerenciar <ArrowRightIcon className='size-3' />
            </Link>
          </Button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {activeBaseCards.map((item) => (
            <div
              key={item.source}
              className='relative rounded-xl border border-border bg-card px-5 py-5 flex flex-col gap-3 min-w-0 overflow-hidden'
            >
              {item.isActive && (
                <span className='absolute top-3.5 right-3.5 size-1.5 rounded-full bg-emerald-500' />
              )}
              <span className='text-[9px] uppercase tracking-[0.12em] text-muted-foreground truncate block pr-4'>
                {item.label}
              </span>
              <FileIcon
                className={`size-6 flex-shrink-0 ${
                  item.isActive ? 'text-muted-foreground/40' : 'text-border'
                }`}
              />
              <div className='min-w-0'>
                {item.isActive ? (
                  <>
                    <p className='text-sm font-medium leading-none mb-1 truncate'>
                      {item.fileName}
                    </p>
                    <p className='text-[11px] text-muted-foreground font-light'>
                      {item.contactCount > 0
                        ? `${item.contactCount.toLocaleString('pt-BR')} contatos · `
                        : ''}
                      {item.importedAt
                        ? new Date(item.importedAt).toLocaleDateString('pt-BR')
                        : ''}
                    </p>
                  </>
                ) : (
                  <p className='text-sm text-muted-foreground/50 font-light'>
                    Não carregada
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      <section>
        <div className='flex items-baseline gap-3 mb-4'>
          <h2 className='font-serif text-[22px] font-normal tracking-tight'>
            Saúde da base
          </h2>
          <span className='text-xs text-muted-foreground font-light'>
            Baseado nas bases carregadas
          </span>
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
          {healthMetrics.map((metric) => (
            <div
              key={metric.label}
              className='bg-card px-5 py-6 flex flex-col gap-1.5'
            >
              <span className='text-[10px] uppercase tracking-[0.1em] text-muted-foreground'>
                {metric.label}
              </span>
              <span
                className={`font-sans text-[36px] font-light tracking-[-0.03em] leading-none ${metric.color}`}
              >
                {metric.value}
              </span>
              <span className='text-[11px] text-muted-foreground font-light'>
                {metric.delta}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      <section>
        <div className='flex items-baseline justify-between mb-5'>
          <div className='flex items-baseline gap-3'>
            <h2 className='font-serif text-[22px] font-normal tracking-tight'>
              Inconsistências pendentes
            </h2>
            <span className='text-xs text-muted-foreground font-light'>
              {pendingCount} aguardando resolução
            </span>
          </div>
          {pendingCount > 0 && (
            <Button
              variant='ghost'
              size='sm'
              asChild
              className='text-xs gap-1 text-muted-foreground hover:text-foreground'
            >
              <Link to='/inconsistencias'>
                Ver todas <ArrowRightIcon className='size-3' />
              </Link>
            </Button>
          )}
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden border border-border mb-5'>
          {inconsistenciaCards.map((item) => (
            <div
              key={item.label}
              className='bg-card px-5 py-6 flex flex-col gap-1.5'
            >
              <span className='text-[10px] uppercase tracking-[0.1em] text-muted-foreground'>
                {item.label}
              </span>
              <span
                className={`font-sans text-[36px] font-light tracking-[-0.03em] leading-none ${item.color}`}
              >
                {item.count}
              </span>
            </div>
          ))}
        </div>

        {pendingCount > 0 ? (
          <Button asChild size='sm'>
            <Link to='/inconsistencias'>
              Resolver {pendingCount} inconsistênci
              {pendingCount !== 1 ? 'as' : 'a'} →
            </Link>
          </Button>
        ) : (
          <div className='rounded-lg border border-border bg-muted/20 px-5 py-4 text-center'>
            <p className='text-sm text-muted-foreground font-light'>
              Nenhuma inconsistência pendente
            </p>
          </div>
        )}
      </section>

      <Separator />

      <section>
        <h2 className='font-serif text-[22px] font-normal tracking-tight mb-5'>
          Ações rápidas
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {[
            {
              to: '/contatos',
              title: `${contactCount.toLocaleString('pt-BR')} contatos`,
              sub: 'Gerenciar base',
            },
            {
              to: '/exportar',
              title: 'Exportar base',
              sub: 'CSV ou Excel',
            },
            {
              to: '/upload',
              title: 'Carregar base',
              sub: 'CSV ou Excel · máx. 50 MB',
            },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className='rounded-lg border border-border bg-card px-5 py-5 flex items-center justify-between hover:bg-muted/20 transition-colors group'
            >
              <div>
                <p className='text-sm font-medium'>{item.title}</p>
                <p className='text-[11px] text-muted-foreground font-light mt-0.5'>
                  {item.sub}
                </p>
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
