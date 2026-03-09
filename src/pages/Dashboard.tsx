import { Fragment, useState } from 'react'

import {
  DatabaseIcon,
  DownloadIcon,
  LanguagesIcon,
  LayoutDashboardIcon,
  TagIcon,
  TriangleAlertIcon,
  UploadIcon,
  UserCogIcon,
  UsersIcon,
  UserXIcon
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar'

import LanguageDropdown from '@/components/shadcn-studio/blocks/dropdown-language'
import ProfileDropdown from '@/components/shadcn-studio/blocks/dropdown-profile'
import TransactionDatatable, { type Item } from '@/components/shadcn-studio/blocks/datatable-transaction'

// CDP inconsistency queue
// status: 'failed'=Duplicata · 'processing'=Tag ausente · 'pending'=Inadimplente · 'paid'=Resolvido
// paidBy: 'mastercard'=Base Vendas · 'visa'=Base E-mail
const inconsistenciasData: Item[] = [
  { id: '1',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',  avatarFallback: 'AP', name: 'Ana Paula Ribeiro',  email: 'ana.ribeiro@email.com',       amount: 2, status: 'failed',     paidBy: 'mastercard' },
  { id: '2',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png',  avatarFallback: 'CM', name: 'Carlos Menezes',     email: 'c.menezes@outlook.com',       amount: 1, status: 'processing', paidBy: 'mastercard' },
  { id: '3',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',  avatarFallback: 'FC', name: 'Fernanda Costa',     email: 'fercosta@gmail.com',          amount: 1, status: 'pending',    paidBy: 'mastercard' },
  { id: '4',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',  avatarFallback: 'RA', name: 'Roberto Alves',      email: 'roberto.alv@empresa.com.br',  amount: 1, status: 'processing', paidBy: 'visa'       },
  { id: '5',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png',  avatarFallback: 'JM', name: 'Juliana Martins',    email: 'ju.martins@hotmail.com',      amount: 1, status: 'failed',     paidBy: 'visa'       },
  { id: '6',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png',  avatarFallback: 'MO', name: 'Marcos Oliveira',    email: 'm.oliveira@uol.com.br',       amount: 1, status: 'processing', paidBy: 'mastercard' },
  { id: '7',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png',  avatarFallback: 'PS', name: 'Patricia Souza',     email: 'p.souza@gmail.com',           amount: 2, status: 'failed',     paidBy: 'mastercard' },
  { id: '8',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png',  avatarFallback: 'TL', name: 'Thiago Lima',        email: 'thiago.lima@empresa.com',     amount: 1, status: 'paid',       paidBy: 'visa'       },
  { id: '9',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-9.png',  avatarFallback: 'BN', name: 'Beatriz Nascimento', email: 'bea.nas@hotmail.com',         amount: 1, status: 'pending',    paidBy: 'visa'       },
  { id: '10', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-10.png', avatarFallback: 'RF', name: 'Rafael Ferreira',    email: 'rafael.f@outlook.com',        amount: 1, status: 'paid',       paidBy: 'mastercard' },
  { id: '11', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-11.png', avatarFallback: 'LC', name: 'Larissa Carvalho',   email: 'larissa.c@gmail.com',         amount: 1, status: 'processing', paidBy: 'mastercard' },
  { id: '12', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-12.png', avatarFallback: 'DM', name: 'Diego Martins',      email: 'd.martins@empresa.com.br',    amount: 2, status: 'failed',     paidBy: 'visa'       },
  { id: '13', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-13.png', avatarFallback: 'AS', name: 'Amanda Silva',       email: 'amanda.s@email.com',          amount: 1, status: 'paid',       paidBy: 'mastercard' },
  { id: '14', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-14.png', avatarFallback: 'GR', name: 'Gabriel Rocha',      email: 'g.rocha@hotmail.com',         amount: 1, status: 'pending',    paidBy: 'visa'       },
  { id: '15', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-15.png', avatarFallback: 'IC', name: 'Isabela Costa',      email: 'isa.costa@gmail.com',         amount: 1, status: 'processing', paidBy: 'mastercard' },
  { id: '16', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-16.png', avatarFallback: 'FP', name: 'Felipe Pereira',     email: 'f.pereira@empresa.com',       amount: 2, status: 'failed',     paidBy: 'mastercard' },
  { id: '17', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-17.png', avatarFallback: 'NB', name: 'Natália Braga',      email: 'nat.braga@uol.com.br',        amount: 1, status: 'paid',       paidBy: 'visa'       },
  { id: '18', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-18.png', avatarFallback: 'EG', name: 'Eduardo Gomes',      email: 'edu.gomes@outlook.com',       amount: 1, status: 'processing', paidBy: 'mastercard' },
  { id: '19', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-19.png', avatarFallback: 'VL', name: 'Vanessa Lopes',      email: 'v.lopes@gmail.com',           amount: 1, status: 'pending',    paidBy: 'visa'       },
  { id: '20', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-20.png', avatarFallback: 'RM', name: 'Rodrigo Mendes',     email: 'r.mendes@empresa.com.br',     amount: 1, status: 'paid',       paidBy: 'mastercard' },
  { id: '21', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-21.png', avatarFallback: 'CA', name: 'Camila Araújo',      email: 'c.araujo@hotmail.com',        amount: 2, status: 'failed',     paidBy: 'visa'       },
  { id: '22', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-22.png', avatarFallback: 'LF', name: 'Lucas Fonseca',      email: 'lucas.f@email.com',           amount: 1, status: 'processing', paidBy: 'mastercard' },
  { id: '23', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-23.png', avatarFallback: 'MV', name: 'Mariana Vieira',     email: 'm.vieira@gmail.com',          amount: 1, status: 'paid',       paidBy: 'visa'       },
  { id: '24', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-24.png', avatarFallback: 'JT', name: 'João Tavares',       email: 'j.tavares@outlook.com',       amount: 1, status: 'pending',    paidBy: 'mastercard' },
  { id: '25', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-25.png', avatarFallback: 'SR', name: 'Sofia Ramos',        email: 'sofia.r@empresa.com',         amount: 1, status: 'processing', paidBy: 'visa'       }
]

const steps = [
  { n: 1, label: 'Upload',      state: 'done'   },
  { n: 2, label: 'Diagnóstico', state: 'active' },
  { n: 3, label: 'Revisão',     state: ''       },
  { n: 4, label: 'Exportar',    state: ''       },
]

const healthMetrics = [
  { label: 'Total de contatos', value: '5.949', delta: 'Antes da deduplicação', color: ''                  },
  { label: 'Duplicatas',        value: '284',   delta: '4,8% da base',          color: 'text-red-500'      },
  { label: 'Sem tag correta',   value: '631',   delta: '10,6% da base',         color: 'text-amber-400'    },
  { label: 'Resolvidos',        value: '38',    delta: 'De 47 com conflito',    color: 'text-emerald-500'  },
]

const filterPills = [
  { id: 'all',          label: 'Todos',        count: 47 },
  { id: 'duplicata',    label: 'Duplicatas',   count: 18 },
  { id: 'tag',          label: 'Tag ausente',  count: 21 },
  { id: 'inadimplente', label: 'Inadimplente', count: 5  },
  { id: 'orfao',        label: 'Órfão',        count: 3  },
]

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredData = activeFilter === 'all'
    ? inconsistenciasData
    : inconsistenciasData.filter(item => {
        if (activeFilter === 'duplicata')    return item.status === 'failed'
        if (activeFilter === 'tag')          return item.status === 'processing'
        if (activeFilter === 'inadimplente') return item.status === 'pending'
        return false
      })

  return (
    <SidebarProvider className='h-screen overflow-hidden'>
      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <Sidebar>
        <SidebarHeader className='border-b border-white/8 px-7 pb-8 pt-8'>
          <div className='font-serif text-lg font-medium tracking-tight text-sidebar-foreground flex items-center gap-2'>
            <span className='text-[10px] opacity-50'>◆</span>
            CDP
          </div>
          <div className='text-[10px] tracking-[0.14em] uppercase text-sidebar-foreground/30 mt-1 pl-[18px]'>
            Customer Data Platform
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Visão geral</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href='#'>
                      <LayoutDashboardIcon />
                      <span>Dashboard</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Base</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <a href='#'>
                      <UploadIcon />
                      <span>Upload de bases</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href='#'>
                      <TriangleAlertIcon />
                      <span>Inconsistências</span>
                    </a>
                  </SidebarMenuButton>
                  <SidebarMenuBadge className='bg-red-950/60 text-red-400 rounded-full text-[9px]'>
                    47
                  </SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href='#'>
                      <DatabaseIcon />
                      <span>Contatos unificados</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href='#'>
                      <TagIcon />
                      <span>Tags</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Exportação</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href='#'>
                      <DownloadIcon />
                      <span>Exportar base limpa</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Time</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href='#'>
                      <UsersIcon />
                      <span>Usuários</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href='#'>
                      <UserCogIcon />
                      <span>Perfis de acesso</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className='border-t border-white/8 px-7 py-5'>
          <span className='text-[11px] text-sidebar-foreground/30'>V1.0 · MVP</span>
        </SidebarFooter>
      </Sidebar>

      {/* ── Main area ─────────────────────────────────────────────── */}
      <div className='flex flex-1 flex-col overflow-hidden'>

        {/* Topbar */}
        <header className='flex items-center justify-between border-b border-border bg-background px-10 h-16 flex-shrink-0'>
          <div className='flex items-center gap-4'>
            <SidebarTrigger />
            <Separator orientation='vertical' className='h-4' />
            <h1 className='font-serif text-lg font-normal tracking-tight'>Upload de bases</h1>
          </div>

          <div className='flex items-center gap-3'>
            {/* Step indicator */}
            <div className='hidden lg:flex items-center'>
              {steps.map((step, i) => (
                <Fragment key={step.n}>
                  <div
                    className={`flex items-center gap-1.5 text-xs ${
                      step.state === 'done'
                        ? 'text-emerald-500'
                        : step.state === 'active'
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground'
                    }`}
                  >
                    <div
                      className={`size-[18px] rounded-full border flex items-center justify-center text-[8px] flex-shrink-0 ${
                        step.state === 'done'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-current'
                      }`}
                    >
                      {step.state === 'done' ? '✓' : step.n}
                    </div>
                    {step.label}
                  </div>
                  {i < steps.length - 1 && (
                    <div className='w-6 h-px bg-border mx-1' />
                  )}
                </Fragment>
              ))}
            </div>

            <Button size='sm' className='text-xs font-medium'>
              Iniciar diagnóstico →
            </Button>

            <Separator orientation='vertical' className='h-4 mx-0.5' />

            {/* Enrichment: shadcn-studio dropdown blocks */}
            <LanguageDropdown
              trigger={
                <Button variant='ghost' size='icon'>
                  <LanguagesIcon />
                </Button>
              }
            />
            <ProfileDropdown
              trigger={
                <Button variant='ghost' size='icon' className='size-9'>
                  <Avatar className='size-8 rounded-md'>
                    <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png' />
                    <AvatarFallback>OP</AvatarFallback>
                  </Avatar>
                </Button>
              }
            />
          </div>
        </header>

        {/* Body: scrollable content + fixed detail panel */}
        <div className='flex flex-1 overflow-hidden'>

          {/* Scrollable main content */}
          <main className='flex-1 overflow-y-auto px-10 py-10 flex flex-col gap-8'>

            {/* ── UPLOAD SECTION ────────────────────────────────── */}
            <section>
              <div className='flex items-baseline gap-3 mb-4'>
                <h2 className='font-serif text-[22px] font-normal tracking-tight'>Bases carregadas</h2>
                <span className='text-xs text-muted-foreground font-light'>CSV ou Excel · máx. 50 MB por arquivo</span>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                {/* Base Vendas – loaded */}
                <div className='relative rounded-lg border border-border bg-card px-6 py-7 flex flex-col items-center gap-2.5 cursor-pointer hover:bg-card/60 transition-all'>
                  <span className='absolute top-3.5 right-3.5 size-1.5 rounded-full bg-emerald-500' />
                  <span className='text-[9px] uppercase tracking-[0.14em] text-muted-foreground'>Base de vendas</span>
                  <span className='text-[22px] opacity-60 leading-none'>📄</span>
                  <span className='text-xs font-medium text-center'>clientes_vendas_mar25.csv</span>
                  <span className='text-[11px] text-muted-foreground font-light'>2.847 contatos · 12 colunas</span>
                </div>

                {/* Base E-mail – loaded */}
                <div className='relative rounded-lg border border-border bg-card px-6 py-7 flex flex-col items-center gap-2.5 cursor-pointer hover:bg-card/60 transition-all'>
                  <span className='absolute top-3.5 right-3.5 size-1.5 rounded-full bg-emerald-500' />
                  <span className='text-[9px] uppercase tracking-[0.14em] text-muted-foreground'>Base de e-mail</span>
                  <span className='text-[22px] opacity-60 leading-none'>📄</span>
                  <span className='text-xs font-medium text-center'>mailchimp_export_032025.xlsx</span>
                  <span className='text-[11px] text-muted-foreground font-light'>3.102 contatos · 9 colunas</span>
                </div>

                {/* CRM WhatsApp – pending */}
                <div className='rounded-lg border border-dashed border-border/50 bg-transparent px-6 py-7 flex flex-col items-center gap-2.5 cursor-pointer hover:border-muted-foreground/40 hover:bg-card/30 transition-all'>
                  <span className='text-[9px] uppercase tracking-[0.14em] text-muted-foreground'>CRM WhatsApp</span>
                  <span className='text-[22px] opacity-30 leading-none select-none'>+</span>
                  <span className='text-xs text-muted-foreground font-light'>Clique para carregar</span>
                  <span className='text-[11px] text-muted-foreground/50'>CSV ou Excel</span>
                </div>
              </div>
            </section>

            <Separator />

            {/* ── HEALTH SECTION ────────────────────────────────── */}
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

            {/* ── ISSUES SECTION ────────────────────────────────── */}
            <section>
              <h2 className='font-serif text-[22px] font-normal tracking-tight mb-4'>Inconsistências</h2>

              {/* Filter pills */}
              <div className='flex items-center gap-2 mb-4 flex-wrap'>
                {filterPills.map(pill => (
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

              {/* TransactionDatatable — shadcn-studio block as enrichment */}
              <Card className='py-0'>
                <TransactionDatatable data={filteredData} />
              </Card>
            </section>

            {/* Footer */}
            <div className='flex items-center justify-between gap-3 pt-4 border-t border-border text-muted-foreground max-sm:flex-col'>
              <p className='text-xs'>
                {`©${new Date().getFullYear()}`}{' '}
                <a href='#' className='text-foreground/50 hover:text-foreground transition-colors'>
                  CDP Platform
                </a>
                {' '}· V1.0 MVP · Customer Data Platform
              </p>
              <div className='flex items-center gap-1.5 text-[10px] opacity-35'>
                <UserXIcon className='size-3' />
                <span>Nenhum registro é excluído sem confirmação</span>
              </div>
            </div>
          </main>

          {/* ── Detail panel ──────────────────────────────────── */}
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
                { key: 'Telefone',       val: 'Conflito',       valClass: 'text-red-500' },
                { key: 'Fontes',         val: 'Vendas, E-mail', valClass: '' },
                { key: 'Primeira compra',val: 'Jan 2024',       valClass: '' },
                { key: 'Tags atuais',    val: 'lead, newsletter', valClass: '' },
              ].map(row => (
                <div key={row.key} className='flex justify-between items-center'>
                  <span className='text-[11px] text-muted-foreground font-light'>{row.key}</span>
                  <span className={`text-xs font-medium ${row.valClass}`}>{row.val}</span>
                </div>
              ))}
            </div>

            {/* Conflito detectado */}
            <div className='px-6 py-5 border-b border-border flex flex-col gap-3'>
              <span className='text-[9px] uppercase tracking-[0.12em] text-muted-foreground'>Conflito detectado</span>
              <div className='rounded-md border border-red-900/30 bg-red-950/20 p-3 flex flex-col gap-2.5'>
                <span className='text-[9px] uppercase tracking-[0.1em] text-red-500 font-medium'>Telefone divergente</span>
                <div className='flex justify-between items-center'>
                  <span className='text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded'>Vendas</span>
                  <span className='text-xs'>(11) 99872-3410</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded'>E-mail</span>
                  <span className='text-xs'>(11) 98341-7720</span>
                </div>
                <div className='flex gap-1.5 mt-0.5'>
                  <Button size='sm' className='flex-1 h-7 text-[10px]'>Usar Vendas</Button>
                  <Button size='sm' variant='outline' className='flex-1 h-7 text-[10px]'>Usar E-mail</Button>
                </div>
              </div>
            </div>

            {/* Tags sugeridas */}
            <div className='px-6 py-5 border-b border-border flex flex-col gap-3'>
              <span className='text-[9px] uppercase tracking-[0.12em] text-muted-foreground'>Tags sugeridas</span>
              <div className='flex flex-wrap gap-1.5'>
                {['+ cliente-ativo', '+ comprou-2024', '+ social-media'].map(tag => (
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
              <Button className='w-full text-xs' size='sm'>Salvar alterações</Button>
            </div>
          </aside>

        </div>
      </div>
    </SidebarProvider>
  )
}

export default Dashboard
