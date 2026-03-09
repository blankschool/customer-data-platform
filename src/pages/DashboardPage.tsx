import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FileIcon, PlusIcon, MoreHorizontalIcon, XIcon } from 'lucide-react'
import { healthMetrics, filterPills } from '@/lib/mock-data'

// ── Types ─────────────────────────────────────────────────────────────────────

type TipoInconsistencia = 'Duplicata' | 'Tag ausente' | 'Inadimplente' | 'Órfão'

type InconsistenciaRow = {
  id: string
  avatar: string
  avatarFallback: string
  name: string
  email: string
  ocorr: number
  tipo: TipoInconsistencia
  fonte: string
}

type ContactDetail = {
  phone: string
  sources: string[]
  firstPurchase: string
  tags: string[]
  conflict?: { label: string; vendas: string; email: string }
  suggestedTags: string[]
}

// ── Static data ───────────────────────────────────────────────────────────────

const basesCarregadas = [
  { id: '1', label: 'BASE DE VENDAS',  fileName: 'clientes_vendas_mar25.csv',      info: '2.847 contatos · 12 colunas', loaded: true  },
  { id: '2', label: 'BASE DE E-MAIL',  fileName: 'mailchimp_export_032025.xlsx',   info: '3.102 contatos · 9 colunas',  loaded: true  },
  { id: '3', label: 'CRM WHATSAPP',    fileName: null,                              info: null,                          loaded: false },
]

const tableRows: InconsistenciaRow[] = [
  { id: '1',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',  avatarFallback: 'AP', name: 'Ana Paula Ribeiro',  email: 'ana.ribeiro@email.com',       ocorr: 2, tipo: 'Duplicata',   fonte: 'Vendas'  },
  { id: '2',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png',  avatarFallback: 'CM', name: 'Carlos Menezes',     email: 'c.menezes@outlook.com',       ocorr: 1, tipo: 'Tag ausente', fonte: 'Vendas'  },
  { id: '3',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',  avatarFallback: 'FC', name: 'Fernanda Costa',     email: 'fercosta@gmail.com',          ocorr: 1, tipo: 'Tag ausente', fonte: 'Vendas'  },
  { id: '4',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',  avatarFallback: 'RA', name: 'Roberto Alves',      email: 'roberto.alv@empresa.com.br',  ocorr: 1, tipo: 'Inadimplente',fonte: 'E-mail' },
  { id: '5',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png',  avatarFallback: 'JM', name: 'Juliana Martins',    email: 'ju.martins@hotmail.com',      ocorr: 1, tipo: 'Duplicata',   fonte: 'Vendas'  },
  { id: '6',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png',  avatarFallback: 'MO', name: 'Marcos Oliveira',    email: 'm.oliveira@uol.com.br',       ocorr: 1, tipo: 'Tag ausente', fonte: 'Vendas'  },
  { id: '7',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png',  avatarFallback: 'PS', name: 'Patricia Souza',     email: 'p.souza@gmail.com',           ocorr: 2, tipo: 'Duplicata',   fonte: 'Vendas'  },
  { id: '8',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png',  avatarFallback: 'TL', name: 'Thiago Lima',        email: 'thiago.lima@empresa.com',     ocorr: 1, tipo: 'Tag ausente', fonte: 'E-mail'  },
  { id: '9',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-9.png',  avatarFallback: 'BN', name: 'Beatriz Nascimento', email: 'bea.nas@hotmail.com',         ocorr: 1, tipo: 'Órfão',       fonte: 'Vendas'  },
  { id: '10', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-10.png', avatarFallback: 'RF', name: 'Rafael Ferreira',    email: 'rafael.f@outlook.com',        ocorr: 1, tipo: 'Tag ausente', fonte: 'E-mail'  },
]

const contactDetails: Record<string, ContactDetail> = {
  '1':  { phone: '(11) 99872-3410', sources: ['Vendas', 'E-mail'], firstPurchase: 'Jan 2024', tags: ['lead', 'newsletter'],    conflict: { label: 'TELEFONE DIVERGENTE', vendas: '(11) 99872-3410', email: '(11) 98341-7720'           }, suggestedTags: ['cliente-ativo', 'comprou-2024', 'social-media'] },
  '2':  { phone: '(21) 98765-4321', sources: ['Vendas'],           firstPurchase: 'Mar 2024', tags: ['lead'],                  suggestedTags: ['cliente-ativo', 'comprou-2024']                                                              },
  '3':  { phone: '(31) 99654-1234', sources: ['Vendas'],           firstPurchase: 'Jun 2024', tags: ['cliente-ativo'],         suggestedTags: ['comprou-2024', 'newsletter']                                                                  },
  '4':  { phone: '(11) 97654-8765', sources: ['E-mail'],           firstPurchase: 'Nov 2023', tags: ['newsletter'],            conflict: { label: 'EMAIL DUPLICADO',      vendas: 'roberto@empresa.com', email: 'r.alves@empresa.com.br'  }, suggestedTags: ['inadimplente']                                  },
  '5':  { phone: '(41) 99876-5432', sources: ['Vendas', 'E-mail'], firstPurchase: 'Feb 2024', tags: ['cliente-ativo', 'vip'], conflict: { label: 'TELEFONE DIVERGENTE', vendas: '(41) 99876-5432',   email: '(41) 97654-3210'           }, suggestedTags: ['newsletter']                                    },
  '6':  { phone: '(51) 98432-1098', sources: ['Vendas'],           firstPurchase: 'Aug 2024', tags: ['lead'],                  suggestedTags: ['social-media', 'newsletter']                                                                  },
  '7':  { phone: '(11) 99321-6543', sources: ['Vendas'],           firstPurchase: 'Dec 2023', tags: ['cliente-ativo'],         conflict: { label: 'NOME DIVERGENTE',      vendas: 'Patricia Souza',      email: 'Patrícia de Souza Lima' }, suggestedTags: ['vip', 'comprou-2024']                           },
  '8':  { phone: '(21) 98543-2109', sources: ['E-mail'],           firstPurchase: 'Apr 2024', tags: ['b2b', 'newsletter'],     suggestedTags: ['cliente-ativo']                                                                               },
  '9':  { phone: '(31) 99765-4321', sources: ['Vendas'],           firstPurchase: 'Jan 2024', tags: ['inadimplente'],          suggestedTags: ['churn-risk']                                                                                   },
  '10': { phone: '(11) 98654-3210', sources: ['Vendas', 'E-mail'], firstPurchase: 'May 2024', tags: ['cliente-ativo'],         suggestedTags: ['comprou-2024', 'vip']                                                                         },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function tipoBadgeClass(tipo: TipoInconsistencia) {
  switch (tipo) {
    case 'Duplicata':    return 'badge-error'
    case 'Tag ausente':  return 'badge-warning'
    case 'Inadimplente': return 'badge-info'
    case 'Órfão':        return 'bg-muted text-muted-foreground border-border'
  }
}

function filterMatch(tipo: TipoInconsistencia, filterId: string) {
  if (filterId === 'duplicata')    return tipo === 'Duplicata'
  if (filterId === 'tag')          return tipo === 'Tag ausente'
  if (filterId === 'inadimplente') return tipo === 'Inadimplente'
  if (filterId === 'orfao')        return tipo === 'Órfão'
  return true
}

// ── Component ─────────────────────────────────────────────────────────────────

const DashboardPage = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>('1')

  const filteredRows = tableRows.filter((r) => filterMatch(r.tipo, activeFilter))
  const selected = selectedId ? tableRows.find((r) => r.id === selectedId) : null
  const detail   = selectedId ? contactDetails[selectedId] : null

  return (
    <div className='flex flex-1 -mx-10 -my-10 overflow-hidden'>

      {/* ── Main scrollable area ──────────────────────────────────────────── */}
      <div className='flex-1 overflow-y-auto px-10 py-10 flex flex-col gap-10'>

        {/* Bases carregadas ─────────────────────────────────────────────── */}
        <section>
          <div className='flex items-baseline gap-3 mb-5'>
            <h2 className='font-serif text-[22px] font-normal tracking-tight'>Bases carregadas</h2>
            <span className='text-xs text-muted-foreground font-light'>CSV ou Excel · máx. 50 MB por arquivo</span>
          </div>

          <div className='grid grid-cols-3 gap-4'>
            {basesCarregadas.map((base) => (
              <div
                key={base.id}
                className='relative rounded-xl border border-border bg-card px-5 py-5 flex flex-col gap-3 hover:bg-card/60 transition-all cursor-pointer'
              >
                {base.loaded && (
                  <span className='absolute top-3.5 right-3.5 size-1.5 rounded-full bg-emerald-500' />
                )}
                <span className='text-[9px] uppercase tracking-[0.12em] text-muted-foreground'>{base.label}</span>
                {base.loaded ? (
                  <>
                    <FileIcon className='size-7 text-muted-foreground/50' />
                    <div>
                      <p className='text-sm font-medium leading-none mb-1'>{base.fileName}</p>
                      <p className='text-[11px] text-muted-foreground font-light'>{base.info}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='size-7 rounded border border-dashed border-border flex items-center justify-center'>
                      <PlusIcon className='size-3.5 text-muted-foreground' />
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>Clique para carregar</p>
                      <p className='text-[11px] text-muted-foreground/60 font-light'>CSV ou Excel</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Saúde da base ────────────────────────────────────────────────── */}
        <section>
          <div className='flex items-baseline gap-3 mb-4'>
            <h2 className='font-serif text-[22px] font-normal tracking-tight'>Saúde da base</h2>
            <span className='text-xs text-muted-foreground font-light'>Baseado nas 2 bases carregadas</span>
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

        {/* Inconsistências ──────────────────────────────────────────────── */}
        <section className='pb-10'>
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
                {pill.label} <span className='opacity-40 ml-0.5'>{pill.count}</span>
              </button>
            ))}
            <span className='ml-auto text-[11px] text-muted-foreground font-light'>
              Mostrando {filteredRows.length} de {tableRows.length}
            </span>
          </div>

          {/* Table */}
          <div className='rounded-lg border border-border overflow-hidden'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-border bg-muted/30'>
                  {['Contato', 'Ocorr.', 'Tipo', 'Fonte', 'Ações'].map((h) => (
                    <th
                      key={h}
                      className='text-left text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-normal px-4 py-3'
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedId(row.id === selectedId ? null : row.id)}
                    className={`border-b border-border last:border-0 cursor-pointer transition-colors ${
                      selectedId === row.id ? 'bg-muted/40' : 'hover:bg-muted/20'
                    }`}
                  >
                    {/* Contato */}
                    <td className='px-4 py-3.5'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='size-7 rounded-full flex-shrink-0'>
                          <AvatarImage src={row.avatar} />
                          <AvatarFallback className='text-[10px]'>{row.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='text-xs font-medium leading-none mb-0.5'>{row.name}</p>
                          <p className='text-[10px] text-muted-foreground font-light'>{row.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Ocorr. */}
                    <td className='px-4 py-3.5 text-xs text-muted-foreground'>{row.ocorr}×</td>
                    {/* Tipo */}
                    <td className='px-4 py-3.5'>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${tipoBadgeClass(row.tipo)}`}>
                        {row.tipo}
                      </span>
                    </td>
                    {/* Fonte */}
                    <td className='px-4 py-3.5'>
                      <span className='text-[10px] px-2 py-0.5 rounded border border-border bg-muted text-muted-foreground'>
                        {row.fonte}
                      </span>
                    </td>
                    {/* Ações */}
                    <td className='px-4 py-3.5'>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className='text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted'
                      >
                        <MoreHorizontalIcon className='size-3.5' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ── Right aside panel ─────────────────────────────────────────────── */}
      <aside className='w-[272px] border-l border-border flex-shrink-0 overflow-y-auto hidden xl:flex flex-col bg-card'>
        {selected && detail ? (
          <>
            {/* Header */}
            <div className='px-6 py-5 border-b border-border flex items-start justify-between gap-2'>
              <div className='min-w-0'>
                <h3 className='font-serif text-base font-normal tracking-tight mb-0.5 truncate'>{selected.name}</h3>
                <p className='text-[11px] text-muted-foreground font-light truncate'>{selected.email}</p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className='text-muted-foreground hover:text-foreground transition-colors mt-0.5 flex-shrink-0'
              >
                <XIcon className='size-3.5' />
              </button>
            </div>

            {/* Informações */}
            <div className='px-6 py-5 border-b border-border flex flex-col gap-3'>
              <span className='text-[9px] uppercase tracking-[0.12em] text-muted-foreground'>Informações</span>
              {[
                { key: 'Telefone',        val: detail.conflict ? 'Conflito' : detail.phone, cls: detail.conflict ? 'text-error' : '' },
                { key: 'Fontes',          val: detail.sources.join(', '),                    cls: '' },
                { key: 'Primeira compra', val: detail.firstPurchase,                         cls: '' },
                { key: 'Tags atuais',     val: detail.tags.join(', '),                       cls: '' },
              ].map((row) => (
                <div key={row.key} className='flex justify-between items-center gap-3'>
                  <span className='text-[11px] text-muted-foreground font-light shrink-0'>{row.key}</span>
                  <span className={`text-xs font-medium text-right ${row.cls}`}>{row.val}</span>
                </div>
              ))}
            </div>

            {/* Conflito detectado */}
            {detail.conflict && (
              <div className='px-6 py-5 border-b border-border flex flex-col gap-3'>
                <span className='text-[9px] uppercase tracking-[0.12em] text-muted-foreground'>Conflito detectado</span>
                <div className='rounded-md border conflict-error p-3 flex flex-col gap-2.5'>
                  <span className='text-[9px] uppercase tracking-[0.1em] text-error font-medium'>
                    {detail.conflict.label}
                  </span>
                  <div className='flex justify-between items-center gap-2'>
                    <span className='text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0'>Vendas</span>
                    <span className='text-xs text-right'>{detail.conflict.vendas}</span>
                  </div>
                  <div className='flex justify-between items-center gap-2'>
                    <span className='text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0'>E-mail</span>
                    <span className='text-xs text-right'>{detail.conflict.email}</span>
                  </div>
                  <div className='flex gap-1.5 mt-0.5'>
                    <Button size='sm' className='flex-1 h-7 text-[10px]'>Usar Vendas</Button>
                    <Button size='sm' variant='outline' className='flex-1 h-7 text-[10px]'>Usar E-mail</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Tags sugeridas */}
            {detail.suggestedTags.length > 0 && (
              <div className='px-6 py-5 border-b border-border flex flex-col gap-3'>
                <span className='text-[9px] uppercase tracking-[0.12em] text-muted-foreground'>Tags sugeridas</span>
                <div className='flex flex-wrap gap-1.5'>
                  {detail.suggestedTags.map((tag) => (
                    <span
                      key={tag}
                      className='text-[10px] px-2.5 py-1 rounded border border-border text-muted-foreground bg-muted hover:border-muted-foreground/50 hover:text-foreground cursor-pointer transition-all'
                    >
                      + {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Save */}
            <div className='px-6 py-5 mt-auto'>
              <Button className='w-full text-xs' size='sm'>Salvar alterações</Button>
            </div>
          </>
        ) : (
          <div className='flex-1 flex items-center justify-center'>
            <p className='text-[11px] text-muted-foreground/40 text-center px-8 leading-relaxed'>
              Selecione um contato na tabela para revisar e resolver conflitos
            </p>
          </div>
        )}
      </aside>
    </div>
  )
}

export default DashboardPage
