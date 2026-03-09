import {
  AlertCircleIcon,
  CheckCircle2Icon,
  DatabaseIcon,
  DownloadIcon,
  LayoutDashboardIcon,
  TagIcon,
  TriangleAlertIcon,
  UploadIcon,
  UserXIcon,
  UsersIcon,
  UserCogIcon,
  LanguagesIcon
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar'

import LanguageDropdown from '@/components/shadcn-studio/blocks/dropdown-language'
import ProductInsightsCard from '@/components/shadcn-studio/blocks/widget-product-insights'
import ProfileDropdown from '@/components/shadcn-studio/blocks/dropdown-profile'
import SalesMetricsCard from '@/components/shadcn-studio/blocks/chart-sales-metrics'
import StatisticsCard from '@/components/shadcn-studio/blocks/statistics-card-01'
import TotalEarningCard from '@/components/shadcn-studio/blocks/widget-total-earning'
import TransactionDatatable, { type Item } from '@/components/shadcn-studio/blocks/datatable-transaction'

// CDP base health statistics cards
const StatisticsCardData = [
  {
    icon: <UsersIcon className='size-4' />,
    value: '5.949',
    title: 'Total de contatos',
    changePercentage: '+12.3%'
  },
  {
    icon: <TriangleAlertIcon className='size-4' />,
    value: '284',
    title: 'Duplicatas identificadas',
    changePercentage: '+4.8%'
  },
  {
    icon: <CheckCircle2Icon className='size-4' />,
    value: '38',
    title: 'Conflitos resolvidos',
    changePercentage: '+81%'
  }
]

// Base sources data for TotalEarningCard — repurposed as "Saúde do diagnóstico"
const basesData = [
  {
    img: 'https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/widgets/zipcar.png',
    platform: 'Base Vendas',
    technologies: 'CSV · 2.847 contatos · 12 col.',
    earnings: '75% revisada',
    progressPercentage: 75
  },
  {
    img: 'https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/widgets/bitbank.png',
    platform: 'Base E-mail',
    technologies: 'XLSX · 3.102 contatos · 9 col.',
    earnings: '55% revisada',
    progressPercentage: 55
  }
]

// Inconsistency queue for TransactionDatatable
// status mapping: 'failed'=Duplicata · 'processing'=Tag ausente · 'pending'=Inadimplente/Órfão · 'paid'=Resolvido
// paidBy mapping: 'mastercard'=Base Vendas · 'visa'=Base E-mail
const inconsistenciasData: Item[] = [
  {
    id: '1',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',
    avatarFallback: 'AP',
    name: 'Ana Paula Ribeiro',
    amount: 2,
    status: 'failed',
    email: 'ana.ribeiro@email.com',
    paidBy: 'mastercard'
  },
  {
    id: '2',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png',
    avatarFallback: 'CM',
    name: 'Carlos Menezes',
    amount: 1,
    status: 'processing',
    email: 'c.menezes@outlook.com',
    paidBy: 'mastercard'
  },
  {
    id: '3',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',
    avatarFallback: 'FC',
    name: 'Fernanda Costa',
    amount: 1,
    status: 'pending',
    email: 'fercosta@gmail.com',
    paidBy: 'mastercard'
  },
  {
    id: '4',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',
    avatarFallback: 'RA',
    name: 'Roberto Alves',
    amount: 1,
    status: 'processing',
    email: 'roberto.alv@empresa.com.br',
    paidBy: 'visa'
  },
  {
    id: '5',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png',
    avatarFallback: 'JM',
    name: 'Juliana Martins',
    amount: 1,
    status: 'failed',
    email: 'ju.martins@hotmail.com',
    paidBy: 'visa'
  },
  {
    id: '6',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png',
    avatarFallback: 'MO',
    name: 'Marcos Oliveira',
    amount: 1,
    status: 'processing',
    email: 'm.oliveira@uol.com.br',
    paidBy: 'mastercard'
  },
  {
    id: '7',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png',
    avatarFallback: 'PS',
    name: 'Patricia Souza',
    amount: 2,
    status: 'failed',
    email: 'p.souza@gmail.com',
    paidBy: 'mastercard'
  },
  {
    id: '8',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png',
    avatarFallback: 'TL',
    name: 'Thiago Lima',
    amount: 1,
    status: 'paid',
    email: 'thiago.lima@empresa.com',
    paidBy: 'visa'
  },
  {
    id: '9',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-9.png',
    avatarFallback: 'BN',
    name: 'Beatriz Nascimento',
    amount: 1,
    status: 'pending',
    email: 'bea.nas@hotmail.com',
    paidBy: 'visa'
  },
  {
    id: '10',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-10.png',
    avatarFallback: 'RF',
    name: 'Rafael Ferreira',
    amount: 1,
    status: 'paid',
    email: 'rafael.f@outlook.com',
    paidBy: 'mastercard'
  },
  {
    id: '11',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-11.png',
    avatarFallback: 'LC',
    name: 'Larissa Carvalho',
    amount: 1,
    status: 'processing',
    email: 'larissa.c@gmail.com',
    paidBy: 'mastercard'
  },
  {
    id: '12',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-12.png',
    avatarFallback: 'DM',
    name: 'Diego Martins',
    amount: 2,
    status: 'failed',
    email: 'd.martins@empresa.com.br',
    paidBy: 'visa'
  },
  {
    id: '13',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-13.png',
    avatarFallback: 'AS',
    name: 'Amanda Silva',
    amount: 1,
    status: 'paid',
    email: 'amanda.s@email.com',
    paidBy: 'mastercard'
  },
  {
    id: '14',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-14.png',
    avatarFallback: 'GR',
    name: 'Gabriel Rocha',
    amount: 1,
    status: 'pending',
    email: 'g.rocha@hotmail.com',
    paidBy: 'visa'
  },
  {
    id: '15',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-15.png',
    avatarFallback: 'IC',
    name: 'Isabela Costa',
    amount: 1,
    status: 'processing',
    email: 'isa.costa@gmail.com',
    paidBy: 'mastercard'
  },
  {
    id: '16',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-16.png',
    avatarFallback: 'FP',
    name: 'Felipe Pereira',
    amount: 2,
    status: 'failed',
    email: 'f.pereira@empresa.com',
    paidBy: 'mastercard'
  },
  {
    id: '17',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-17.png',
    avatarFallback: 'NB',
    name: 'Natália Braga',
    amount: 1,
    status: 'paid',
    email: 'nat.braga@uol.com.br',
    paidBy: 'visa'
  },
  {
    id: '18',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-18.png',
    avatarFallback: 'EG',
    name: 'Eduardo Gomes',
    amount: 1,
    status: 'processing',
    email: 'edu.gomes@outlook.com',
    paidBy: 'mastercard'
  },
  {
    id: '19',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-19.png',
    avatarFallback: 'VL',
    name: 'Vanessa Lopes',
    amount: 1,
    status: 'pending',
    email: 'v.lopes@gmail.com',
    paidBy: 'visa'
  },
  {
    id: '20',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-20.png',
    avatarFallback: 'RM',
    name: 'Rodrigo Mendes',
    amount: 1,
    status: 'paid',
    email: 'r.mendes@empresa.com.br',
    paidBy: 'mastercard'
  },
  {
    id: '21',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-21.png',
    avatarFallback: 'CA',
    name: 'Camila Araújo',
    amount: 2,
    status: 'failed',
    email: 'c.araujo@hotmail.com',
    paidBy: 'visa'
  },
  {
    id: '22',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-22.png',
    avatarFallback: 'LF',
    name: 'Lucas Fonseca',
    amount: 1,
    status: 'processing',
    email: 'lucas.f@email.com',
    paidBy: 'mastercard'
  },
  {
    id: '23',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-23.png',
    avatarFallback: 'MV',
    name: 'Mariana Vieira',
    amount: 1,
    status: 'paid',
    email: 'm.vieira@gmail.com',
    paidBy: 'visa'
  },
  {
    id: '24',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-24.png',
    avatarFallback: 'JT',
    name: 'João Tavares',
    amount: 1,
    status: 'pending',
    email: 'j.tavares@outlook.com',
    paidBy: 'mastercard'
  },
  {
    id: '25',
    avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-25.png',
    avatarFallback: 'SR',
    name: 'Sofia Ramos',
    amount: 1,
    status: 'processing',
    email: 'sofia.r@empresa.com',
    paidBy: 'visa'
  }
]

const DashboardShell = () => {
  return (
    <div className='flex min-h-dvh w-full'>
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            {/* Visão geral */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <a href='#'>
                        <LayoutDashboardIcon />
                        <span>Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Base */}
            <SidebarGroup>
              <SidebarGroupLabel>Base</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
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
                    <SidebarMenuBadge className='bg-primary/10 rounded-full'>47</SidebarMenuBadge>
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

            {/* Exportação */}
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

            {/* Time */}
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
        </Sidebar>

        <div className='flex flex-1 flex-col'>
          {/* Header */}
          <header className='bg-card sticky top-0 z-50 border-b'>
            <div className='mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6'>
              <div className='flex items-center gap-4'>
                <SidebarTrigger className='[&_svg]:!size-5' />
                <Separator orientation='vertical' className='hidden !h-4 sm:block' />
                <Breadcrumb className='hidden sm:block'>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href='#'>CDP</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href='#'>Visão geral</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className='flex items-center gap-1.5'>
                <LanguageDropdown
                  trigger={
                    <Button variant='ghost' size='icon'>
                      <LanguagesIcon />
                    </Button>
                  }
                />
                <ProfileDropdown
                  trigger={
                    <Button variant='ghost' size='icon' className='size-9.5'>
                      <Avatar className='size-9.5 rounded-md'>
                        <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png' />
                        <AvatarFallback>OP</AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className='mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6'>
            <div className='grid grid-cols-2 gap-6 lg:grid-cols-3'>

              {/* Statistics Cards — Saúde da base */}
              <div className='col-span-full grid gap-6 sm:grid-cols-3 md:max-lg:grid-cols-1'>
                {StatisticsCardData.map((card, index) => (
                  <StatisticsCard
                    key={index}
                    icon={card.icon}
                    title={card.title}
                    value={card.value}
                    changePercentage={card.changePercentage}
                  />
                ))}
              </div>

              <div className='grid gap-6 max-xl:col-span-full lg:max-xl:grid-cols-2'>
                {/* Bases carregadas — upload status per source */}
                <ProductInsightsCard className='justify-between gap-3 [&>[data-slot=card-content]]:space-y-5' />

                {/* Saúde do diagnóstico — progress per source */}
                <TotalEarningCard
                  title='Saúde do diagnóstico'
                  earning={5949}
                  trend='up'
                  percentage={65}
                  comparisonText='Diagnóstico em andamento · CRM pendente'
                  earningData={basesData}
                  className='justify-between gap-5 sm:min-w-0 [&>[data-slot=card-content]]:space-y-7'
                />
              </div>

              {/* Métricas da base — diagnostics overview with conflict chart */}
              <SalesMetricsCard className='col-span-full xl:col-span-2 [&>[data-slot=card-content]]:space-y-6' />

              {/* Fila de inconsistências — contacts with issues */}
              <Card className='col-span-full w-full py-0'>
                <TransactionDatatable data={inconsistenciasData} />
              </Card>
            </div>
          </main>

          <footer>
            <div className='text-muted-foreground mx-auto flex size-full max-w-7xl items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6'>
              <p className='text-sm text-balance max-sm:text-center'>
                {`©${new Date().getFullYear()}`}{' '}
                <a href='#' className='text-primary'>
                  CDP Platform
                </a>
                {' '}· V1.0 MVP · Customer Data Platform
              </p>
              <div className='flex items-center gap-3'>
                <UserXIcon className='size-4 opacity-40' />
                <span className='text-xs opacity-50'>Nenhum registro é excluído sem confirmação</span>
              </div>
            </div>
          </footer>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default DashboardShell
