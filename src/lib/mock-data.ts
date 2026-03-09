import type { Item } from '@/components/shadcn-studio/blocks/datatable-transaction'

// ── Inconsistency queue (reused from Dashboard) ─────────────────────────
export const inconsistenciasData: Item[] = [
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
  { id: '25', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-25.png', avatarFallback: 'SR', name: 'Sofia Ramos',        email: 'sofia.r@empresa.com',         amount: 1, status: 'processing', paidBy: 'visa'       },
]

// ── Steps / pipeline ────────────────────────────────────────────────────
export const steps = [
  { n: 1, label: 'Upload',      state: 'done'   },
  { n: 2, label: 'Diagnóstico', state: 'active' },
  { n: 3, label: 'Revisão',     state: ''       },
  { n: 4, label: 'Exportar',    state: ''       },
]

// ── Health metrics ──────────────────────────────────────────────────────
export const healthMetrics = [
  { label: 'Total de contatos', value: '5.949', delta: 'Antes da deduplicação', color: ''                                    },
  { label: 'Duplicatas',        value: '284',   delta: '4,8% da base',          color: 'text-[hsl(var(--error))]'          },
  { label: 'Sem tag correta',   value: '631',   delta: '10,6% da base',         color: 'text-[hsl(var(--warning))]'        },
  { label: 'Resolvidos',        value: '38',    delta: 'De 47 com conflito',    color: 'text-[hsl(var(--success))]'        },
]

// ── Filter pills ────────────────────────────────────────────────────────
export const filterPills = [
  { id: 'all',          label: 'Todos',        count: 47 },
  { id: 'duplicata',    label: 'Duplicatas',   count: 18 },
  { id: 'tag',          label: 'Tag ausente',  count: 21 },
  { id: 'inadimplente', label: 'Inadimplente', count: 5  },
  { id: 'orfao',        label: 'Órfão',        count: 3  },
]

// ── Dashboard KPI cards (from dashboard-shell-01) ───────────────────────
export const statisticsCardData = [
  { value: '5.949', title: 'Total de contatos',       changePercentage: '+12.3%' },
  { value: '284',   title: 'Duplicatas identificadas', changePercentage: '+4.8%'  },
  { value: '38',    title: 'Conflitos resolvidos',     changePercentage: '+81%'   },
]

// ── Base sources data for TotalEarningCard ──────────────────────────────
export const basesData = [
  {
    img: 'https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/widgets/zipcar.png',
    platform: 'Base Vendas',
    technologies: 'CSV · 2.847 contatos · 12 col.',
    earnings: '75% revisada',
    progressPercentage: 75,
  },
  {
    img: 'https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/widgets/bitbank.png',
    platform: 'Base E-mail',
    technologies: 'XLSX · 3.102 contatos · 9 col.',
    earnings: '55% revisada',
    progressPercentage: 55,
  },
]

// ── Contatos unificados ─────────────────────────────────────────────────
export type Contato = {
  id: string
  avatar: string
  avatarFallback: string
  name: string
  email: string
  phone: string
  source: string
  tags: string[]
  status: 'ativo' | 'inativo' | 'pendente'
}

export const contatosData: Contato[] = [
  { id: '1',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',  avatarFallback: 'AP', name: 'Ana Paula Ribeiro',  email: 'ana.ribeiro@email.com',       phone: '(11) 99872-3410', source: 'Vendas, E-mail', tags: ['cliente-ativo', 'newsletter'],      status: 'ativo'    },
  { id: '2',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png',  avatarFallback: 'CM', name: 'Carlos Menezes',     email: 'c.menezes@outlook.com',       phone: '(21) 98765-4321', source: 'Vendas',         tags: ['lead'],                             status: 'ativo'    },
  { id: '3',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',  avatarFallback: 'FC', name: 'Fernanda Costa',     email: 'fercosta@gmail.com',          phone: '(31) 99654-1234', source: 'Vendas',         tags: ['cliente-ativo', 'comprou-2024'],    status: 'ativo'    },
  { id: '4',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',  avatarFallback: 'RA', name: 'Roberto Alves',      email: 'roberto.alv@empresa.com.br',  phone: '(11) 97654-8765', source: 'E-mail',         tags: ['newsletter'],                       status: 'ativo'    },
  { id: '5',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png',  avatarFallback: 'JM', name: 'Juliana Martins',    email: 'ju.martins@hotmail.com',      phone: '(41) 99876-5432', source: 'Vendas, E-mail', tags: ['cliente-ativo', 'vip'],             status: 'ativo'    },
  { id: '6',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png',  avatarFallback: 'MO', name: 'Marcos Oliveira',    email: 'm.oliveira@uol.com.br',       phone: '(51) 98432-1098', source: 'Vendas',         tags: ['lead', 'social-media'],             status: 'pendente' },
  { id: '7',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png',  avatarFallback: 'PS', name: 'Patricia Souza',     email: 'p.souza@gmail.com',           phone: '(11) 99321-6543', source: 'Vendas',         tags: ['cliente-ativo'],                    status: 'ativo'    },
  { id: '8',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png',  avatarFallback: 'TL', name: 'Thiago Lima',        email: 'thiago.lima@empresa.com',     phone: '(21) 98543-2109', source: 'E-mail',         tags: ['b2b', 'newsletter'],                status: 'ativo'    },
  { id: '9',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-9.png',  avatarFallback: 'BN', name: 'Beatriz Nascimento', email: 'bea.nas@hotmail.com',         phone: '(31) 99765-4321', source: 'Vendas',         tags: ['inadimplente'],                     status: 'inativo'  },
  { id: '10', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-10.png', avatarFallback: 'RF', name: 'Rafael Ferreira',    email: 'rafael.f@outlook.com',        phone: '(11) 98654-3210', source: 'Vendas, E-mail', tags: ['cliente-ativo', 'comprou-2024'],    status: 'ativo'    },
  { id: '11', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-11.png', avatarFallback: 'LC', name: 'Larissa Carvalho',   email: 'larissa.c@gmail.com',         phone: '(41) 99543-2109', source: 'Vendas',         tags: ['lead'],                             status: 'pendente' },
  { id: '12', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-12.png', avatarFallback: 'DM', name: 'Diego Martins',      email: 'd.martins@empresa.com.br',    phone: '(51) 98321-0987', source: 'E-mail',         tags: ['newsletter', 'social-media'],       status: 'ativo'    },
  { id: '13', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-13.png', avatarFallback: 'AS', name: 'Amanda Silva',       email: 'amanda.s@email.com',          phone: '(11) 99210-9876', source: 'Vendas',         tags: ['cliente-ativo', 'vip'],             status: 'ativo'    },
  { id: '14', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-14.png', avatarFallback: 'GR', name: 'Gabriel Rocha',      email: 'g.rocha@hotmail.com',         phone: '(21) 98210-9876', source: 'Vendas',         tags: ['churn-risk'],                       status: 'inativo'  },
  { id: '15', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-15.png', avatarFallback: 'IC', name: 'Isabela Costa',      email: 'isa.costa@gmail.com',         phone: '(31) 99098-7654', source: 'Vendas, E-mail', tags: ['reativado', 'newsletter'],          status: 'ativo'    },
  { id: '16', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-16.png', avatarFallback: 'FP', name: 'Felipe Pereira',     email: 'f.pereira@empresa.com',       phone: '(11) 97098-7654', source: 'Vendas',         tags: ['b2b'],                              status: 'ativo'    },
  { id: '17', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-17.png', avatarFallback: 'NB', name: 'Natália Braga',      email: 'nat.braga@uol.com.br',        phone: '(41) 98987-6543', source: 'E-mail',         tags: ['cliente-ativo'],                    status: 'ativo'    },
  { id: '18', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-18.png', avatarFallback: 'EG', name: 'Eduardo Gomes',      email: 'edu.gomes@outlook.com',       phone: '(51) 97876-5432', source: 'Vendas',         tags: ['lead', 'comprou-2024'],             status: 'pendente' },
  { id: '19', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-19.png', avatarFallback: 'VL', name: 'Vanessa Lopes',      email: 'v.lopes@gmail.com',           phone: '(11) 98876-5432', source: 'Vendas, E-mail', tags: ['newsletter'],                       status: 'ativo'    },
  { id: '20', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-20.png', avatarFallback: 'RM', name: 'Rodrigo Mendes',     email: 'r.mendes@empresa.com.br',     phone: '(21) 97765-4321', source: 'Vendas',         tags: ['cliente-ativo', 'b2b'],             status: 'ativo'    },
  { id: '21', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-21.png', avatarFallback: 'CA', name: 'Camila Araújo',      email: 'c.araujo@hotmail.com',        phone: '(31) 96654-3210', source: 'E-mail',         tags: ['social-media'],                     status: 'ativo'    },
  { id: '22', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-22.png', avatarFallback: 'LF', name: 'Lucas Fonseca',      email: 'lucas.f@email.com',           phone: '(11) 95543-2109', source: 'Vendas',         tags: ['lead'],                             status: 'pendente' },
  { id: '23', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-23.png', avatarFallback: 'MV', name: 'Mariana Vieira',     email: 'm.vieira@gmail.com',          phone: '(41) 96432-1098', source: 'Vendas, E-mail', tags: ['cliente-ativo', 'vip'],             status: 'ativo'    },
  { id: '24', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-24.png', avatarFallback: 'JT', name: 'João Tavares',       email: 'j.tavares@outlook.com',       phone: '(51) 95321-0987', source: 'Vendas',         tags: ['inadimplente'],                     status: 'inativo'  },
  { id: '25', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-25.png', avatarFallback: 'SR', name: 'Sofia Ramos',        email: 'sofia.r@empresa.com',         phone: '(21) 94210-9876', source: 'E-mail',         tags: ['newsletter', 'reativado'],          status: 'ativo'    },
]

// ── Tags ────────────────────────────────────────────────────────────────
export type Tag = {
  id: string
  name: string
  color: string
  count: number
  description: string
}

export const tagsData: Tag[] = [
  { id: '1',  name: 'cliente-ativo',  color: 'text-[hsl(var(--success))] border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.15)]',  count: 1234, description: 'Clientes com compra nos últimos 6 meses'    },
  { id: '2',  name: 'newsletter',     color: 'text-[hsl(var(--info))] border-[hsl(var(--info)/0.3)] bg-[hsl(var(--info)/0.15)]',           count: 2100, description: 'Inscritos na newsletter ativa'                },
  { id: '3',  name: 'comprou-2024',   color: 'text-[hsl(var(--info))] border-[hsl(var(--info)/0.3)] bg-[hsl(var(--info)/0.15)]',     count: 847,  description: 'Realizou pelo menos uma compra em 2024'       },
  { id: '4',  name: 'lead',           color: 'text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.3)] bg-[hsl(var(--warning)/0.15)]',        count: 562,  description: 'Lead qualificado aguardando conversão'        },
  { id: '5',  name: 'inadimplente',   color: 'text-[hsl(var(--error))] border-[hsl(var(--error)/0.3)] bg-[hsl(var(--error)/0.15)]',              count: 38,   description: 'Contatos com pagamento em atraso'             },
  { id: '6',  name: 'social-media',   color: 'text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.3)] bg-[hsl(var(--warning)/0.15)]',           count: 315,  description: 'Origem via redes sociais'                     },
  { id: '7',  name: 'vip',            color: 'text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.3)] bg-[hsl(var(--warning)/0.15)]',     count: 89,   description: 'Clientes de alto valor (ticket médio > R$500)' },
  { id: '8',  name: 'churn-risk',     color: 'text-[hsl(var(--error))] border-[hsl(var(--error)/0.3)] bg-[hsl(var(--error)/0.15)]',     count: 42,   description: 'Risco de churn detectado por inatividade'     },
  { id: '9',  name: 'reativado',      color: 'text-[hsl(var(--success))] border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.15)]',           count: 156,  description: 'Reativado após período de inatividade'        },
  { id: '10', name: 'b2b',            color: 'text-[hsl(var(--info))] border-[hsl(var(--info)/0.3)] bg-[hsl(var(--info)/0.15)]',           count: 203,  description: 'Contato corporativo / pessoa jurídica'        },
]

// ── Usuários ────────────────────────────────────────────────────────────
export type Usuario = {
  id: string
  avatar: string
  avatarFallback: string
  name: string
  email: string
  role: 'Admin' | 'Editor' | 'Viewer'
  status: 'ativo' | 'inativo'
  lastAccess: string
}

export const usuariosData: Usuario[] = [
  { id: '1', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',  avatarFallback: 'AP', name: 'Ana Paula Ribeiro',  email: 'ana.ribeiro@email.com',       role: 'Admin',  status: 'ativo',   lastAccess: '2026-03-09T14:30:00' },
  { id: '2', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png',  avatarFallback: 'CM', name: 'Carlos Menezes',     email: 'c.menezes@outlook.com',       role: 'Editor', status: 'ativo',   lastAccess: '2026-03-09T10:15:00' },
  { id: '3', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',  avatarFallback: 'FC', name: 'Fernanda Costa',     email: 'fercosta@gmail.com',          role: 'Editor', status: 'ativo',   lastAccess: '2026-03-08T16:45:00' },
  { id: '4', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png',  avatarFallback: 'JM', name: 'Juliana Martins',    email: 'ju.martins@hotmail.com',      role: 'Viewer', status: 'ativo',   lastAccess: '2026-03-07T09:00:00' },
  { id: '5', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png',  avatarFallback: 'TL', name: 'Thiago Lima',        email: 'thiago.lima@empresa.com',     role: 'Viewer', status: 'inativo', lastAccess: '2026-02-20T11:30:00' },
  { id: '6', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-10.png', avatarFallback: 'RF', name: 'Rafael Ferreira',    email: 'rafael.f@outlook.com',        role: 'Editor', status: 'ativo',   lastAccess: '2026-03-09T08:00:00' },
  { id: '7', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-13.png', avatarFallback: 'AS', name: 'Amanda Silva',       email: 'amanda.s@email.com',          role: 'Viewer', status: 'ativo',   lastAccess: '2026-03-06T14:00:00' },
]

// ── Perfis de acesso ────────────────────────────────────────────────────
export type Perfil = {
  id: string
  name: string
  description: string
  userCount: number
  permissions: { category: string; actions: { name: string; allowed: boolean }[] }[]
}

export const perfisData: Perfil[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Acesso total à plataforma, incluindo gestão de usuários e configurações.',
    userCount: 1,
    permissions: [
      { category: 'Bases',           actions: [{ name: 'Upload de bases', allowed: true }, { name: 'Excluir bases', allowed: true }] },
      { category: 'Inconsistências', actions: [{ name: 'Visualizar', allowed: true }, { name: 'Resolver conflitos', allowed: true }, { name: 'Marcar órfão', allowed: true }] },
      { category: 'Contatos',        actions: [{ name: 'Visualizar', allowed: true }, { name: 'Editar', allowed: true }, { name: 'Excluir', allowed: true }] },
      { category: 'Tags',            actions: [{ name: 'Criar', allowed: true }, { name: 'Editar', allowed: true }, { name: 'Excluir', allowed: true }] },
      { category: 'Exportação',      actions: [{ name: 'Exportar CSV', allowed: true }, { name: 'Exportar Excel', allowed: true }] },
      { category: 'Time',            actions: [{ name: 'Convidar usuários', allowed: true }, { name: 'Alterar perfis', allowed: true }, { name: 'Remover usuários', allowed: true }] },
    ],
  },
  {
    id: '2',
    name: 'Editor',
    description: 'Pode editar contatos, resolver conflitos e exportar dados.',
    userCount: 3,
    permissions: [
      { category: 'Bases',           actions: [{ name: 'Upload de bases', allowed: true }, { name: 'Excluir bases', allowed: false }] },
      { category: 'Inconsistências', actions: [{ name: 'Visualizar', allowed: true }, { name: 'Resolver conflitos', allowed: true }, { name: 'Marcar órfão', allowed: true }] },
      { category: 'Contatos',        actions: [{ name: 'Visualizar', allowed: true }, { name: 'Editar', allowed: true }, { name: 'Excluir', allowed: false }] },
      { category: 'Tags',            actions: [{ name: 'Criar', allowed: true }, { name: 'Editar', allowed: true }, { name: 'Excluir', allowed: false }] },
      { category: 'Exportação',      actions: [{ name: 'Exportar CSV', allowed: true }, { name: 'Exportar Excel', allowed: true }] },
      { category: 'Time',            actions: [{ name: 'Convidar usuários', allowed: false }, { name: 'Alterar perfis', allowed: false }, { name: 'Remover usuários', allowed: false }] },
    ],
  },
  {
    id: '3',
    name: 'Viewer',
    description: 'Acesso somente leitura. Pode visualizar dados e exportar relatórios.',
    userCount: 3,
    permissions: [
      { category: 'Bases',           actions: [{ name: 'Upload de bases', allowed: false }, { name: 'Excluir bases', allowed: false }] },
      { category: 'Inconsistências', actions: [{ name: 'Visualizar', allowed: true }, { name: 'Resolver conflitos', allowed: false }, { name: 'Marcar órfão', allowed: false }] },
      { category: 'Contatos',        actions: [{ name: 'Visualizar', allowed: true }, { name: 'Editar', allowed: false }, { name: 'Excluir', allowed: false }] },
      { category: 'Tags',            actions: [{ name: 'Criar', allowed: false }, { name: 'Editar', allowed: false }, { name: 'Excluir', allowed: false }] },
      { category: 'Exportação',      actions: [{ name: 'Exportar CSV', allowed: true }, { name: 'Exportar Excel', allowed: false }] },
      { category: 'Time',            actions: [{ name: 'Convidar usuários', allowed: false }, { name: 'Alterar perfis', allowed: false }, { name: 'Remover usuários', allowed: false }] },
    ],
  },
]

// ── Export stats ─────────────────────────────────────────────────────────
export const exportStats = {
  totalContacts: 5949,
  afterDedup: 5665,
  duplicatesRemoved: 284,
  tagsAdded: 631,
  conflictsResolved: 38,
  readyToExport: 5665,
}
