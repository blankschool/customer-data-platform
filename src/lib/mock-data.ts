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

// ── Fonte types ──────────────────────────────────────────────────────────
export type FonteContato = 'vendas' | 'email' | 'whatsapp'

export const FONTE_LABELS: Record<FonteContato, string> = {
  vendas:   'Vendas',
  email:    'E-mail',
  whatsapp: 'WhatsApp',
}

export type ImportacaoRef = {
  importacaoId: string
  fonte: FonteContato
  addedAt: string
  isPrimary: boolean
}

export type ImportacaoHistorico = {
  id: string
  fileName: string
  fileSize: number
  fonte: FonteContato
  importedAt: string
  contatosIds: string[]
  status: 'processando' | 'ativa' | 'revertida' | 'erro'
}

// ── Contatos unificados ─────────────────────────────────────────────────
export type Contato = {
  id: string
  avatar: string
  avatarFallback: string
  name: string
  email: string
  phone: string
  source: FonteContato
  tags: string[]
  status: 'ativo' | 'inativo' | 'pendente'
  importacoes?: ImportacaoRef[]
  importStatus?: 'ativo' | 'orphaned'
}

// Seed IDs para importações (referenciados pelos contatos)
const SEED_VENDAS_ID = 'imp-seed-vendas'
const SEED_EMAIL_ID  = 'imp-seed-email'

const refVendas  = (d: string): ImportacaoRef => ({ importacaoId: SEED_VENDAS_ID, fonte: 'vendas',   addedAt: d, isPrimary: true  })
const refEmail   = (d: string): ImportacaoRef => ({ importacaoId: SEED_EMAIL_ID,  fonte: 'email',    addedAt: d, isPrimary: false })
const refEmailP  = (d: string): ImportacaoRef => ({ importacaoId: SEED_EMAIL_ID,  fonte: 'email',    addedAt: d, isPrimary: true  })

export const contatosData: Contato[] = [
  { id: '1',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',  avatarFallback: 'AP', name: 'Ana Paula Ribeiro',  email: 'ana.ribeiro@email.com',       phone: '(11) 99872-3410', source: 'vendas',    tags: ['cliente-ativo', 'newsletter'],      status: 'ativo',    importStatus: 'ativo', importacoes: [refVendas('2024-01-15'), refEmail('2024-02-01')]  },
  { id: '2',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png',  avatarFallback: 'CM', name: 'Carlos Menezes',     email: 'c.menezes@outlook.com',       phone: '(21) 98765-4321', source: 'vendas',    tags: ['lead'],                             status: 'ativo',    importStatus: 'ativo', importacoes: [refVendas('2024-01-15')]                           },
  { id: '3',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',  avatarFallback: 'FC', name: 'Fernanda Costa',     email: 'fercosta@gmail.com',          phone: '(31) 99654-1234', source: 'vendas',    tags: ['cliente-ativo', 'comprou-2024'],    status: 'ativo',    importStatus: 'ativo', importacoes: [refVendas('2024-01-15')]                           },
  { id: '4',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',  avatarFallback: 'RA', name: 'Roberto Alves',      email: 'roberto.alv@empresa.com.br',  phone: '(11) 97654-8765', source: 'email',     tags: ['newsletter'],                       status: 'ativo',    importStatus: 'ativo', importacoes: [refEmailP('2024-02-01')]                           },
  { id: '5',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png',  avatarFallback: 'JM', name: 'Juliana Martins',    email: 'ju.martins@hotmail.com',      phone: '(41) 99876-5432', source: 'vendas',    tags: ['cliente-ativo', 'vip'],             status: 'ativo',    importStatus: 'ativo', importacoes: [refVendas('2024-01-15'), refEmail('2024-02-01')]  },
  { id: '6',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png',  avatarFallback: 'MO', name: 'Marcos Oliveira',    email: 'm.oliveira@uol.com.br',       phone: '(51) 98432-1098', source: 'vendas',    tags: ['lead', 'social-media'],             status: 'pendente', importStatus: 'ativo', importacoes: [refVendas('2024-01-15')]                           },
  { id: '7',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png',  avatarFallback: 'PS', name: 'Patricia Souza',     email: 'p.souza@gmail.com',           phone: '(11) 99321-6543', source: 'vendas',    tags: ['cliente-ativo'],                    status: 'ativo',    importStatus: 'ativo', importacoes: [refVendas('2024-01-15')]                           },
  { id: '8',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png',  avatarFallback: 'TL', name: 'Thiago Lima',        email: 'thiago.lima@empresa.com',     phone: '(21) 98543-2109', source: 'email',     tags: ['b2b', 'newsletter'],                status: 'ativo',    importStatus: 'ativo', importacoes: [refEmailP('2024-02-01')]                           },
  { id: '9',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-9.png',  avatarFallback: 'BN', name: 'Beatriz Nascimento', email: 'bea.nas@hotmail.com',         phone: '(31) 99765-4321', source: 'vendas',    tags: ['inadimplente'],                     status: 'inativo',  importStatus: 'ativo', importacoes: [refVendas('2024-01-15')]                           },
  { id: '10', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-10.png', avatarFallback: 'RF', name: 'Rafael Ferreira',    email: 'rafael.f@outlook.com',        phone: '(11) 98654-3210', source: 'vendas',    tags: ['cliente-ativo', 'comprou-2024'],    status: 'ativo',    importStatus: 'ativo', importacoes: [refVendas('2024-01-15'), refEmail('2024-02-01')]  },
  { id: '11', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-11.png', avatarFallback: 'LC', name: 'Larissa Carvalho',   email: 'larissa.c@gmail.com',         phone: '(41) 99543-2109', source: 'vendas',    tags: ['lead'],                             status: 'pendente', importStatus: 'ativo', importacoes: [refVendas('2024-01-15')]                           },
  { id: '12', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-12.png', avatarFallback: 'DM', name: 'Diego Martins',      email: 'd.martins@empresa.com.br',    phone: '(51) 98321-0987', source: 'email',     tags: ['newsletter', 'social-media'],       status: 'ativo',    importStatus: 'ativo', importacoes: [refEmailP('2024-02-01')]                           },
  { id: '13', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-13.png', avatarFallback: 'AS', name: 'Amanda Silva',       email: 'amanda.s@email.com',          phone: '(11) 99210-9876', source: 'vendas',    tags: ['cliente-ativo', 'vip'],             status: 'ativo',    importStatus: 'ativo', importacoes: [refVendas('2024-01-15')]                           },
  { id: '14', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-14.png', avatarFallback: 'GR', name: 'Gabriel Rocha',      email: 'g.rocha@hotmail.com',         phone: '(21) 98210-9876', source: 'vendas',    tags: ['churn-risk'],                       status: 'inativo',  importStatus: 'ativo', importacoes: [refVendas('2024-01-15')]                           },
  { id: '15', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-15.png', avatarFallback: 'IC', name: 'Isabela Costa',      email: 'isa.costa@gmail.com',         phone: '(31) 99098-7654', source: 'vendas',    tags: ['reativado', 'newsletter'],          status: 'ativo',    importStatus: 'ativo', importacoes: [refVendas('2024-01-15'), refEmail('2024-02-01')]  },
  { id: '16', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-16.png', avatarFallback: 'FP', name: 'Felipe Pereira',     email: 'f.pereira@empresa.com',       phone: '(11) 97098-7654', source: 'vendas',    tags: ['b2b'],                              status: 'ativo',    importStatus: 'ativo', importacoes: [refVendas('2024-01-15')]                           },
  { id: '17', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-17.png', avatarFallback: 'NB', name: 'Natália Braga',      email: 'nat.braga@uol.com.br',        phone: '(41) 98987-6543', source: 'email',     tags: ['cliente-ativo'],                    status: 'ativo',    importStatus: 'ativo', importacoes: [refEmailP('2024-02-01')]                           },
  { id: '18', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-18.png', avatarFallback: 'EG', name: 'Eduardo Gomes',      email: 'edu.gomes@outlook.com',       phone: '(51) 97876-5432', source: 'vendas',    tags: ['lead', 'comprou-2024'],             status: 'pendente', importStatus: 'ativo', importacoes: [refVendas('2024-01-15')]                           },
  { id: '19', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-19.png', avatarFallback: 'VL', name: 'Vanessa Lopes',      email: 'v.lopes@gmail.com',           phone: '(11) 98876-5432', source: 'vendas',    tags: ['newsletter'],                       status: 'ativo',    importStatus: 'ativo', importacoes: [refVendas('2024-01-15'), refEmail('2024-02-01')]  },
  { id: '20', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-20.png', avatarFallback: 'RM', name: 'Rodrigo Mendes',     email: 'r.mendes@empresa.com.br',     phone: '(21) 97765-4321', source: 'vendas',    tags: ['cliente-ativo', 'b2b'],             status: 'ativo',    importStatus: 'ativo', importacoes: [refVendas('2024-01-15')]                           },
  { id: '21', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-21.png', avatarFallback: 'CA', name: 'Camila Araújo',      email: 'c.araujo@hotmail.com',        phone: '(31) 96654-3210', source: 'email',     tags: ['social-media'],                     status: 'ativo',    importStatus: 'ativo', importacoes: [refEmailP('2024-02-01')]                           },
  { id: '22', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-22.png', avatarFallback: 'LF', name: 'Lucas Fonseca',      email: 'lucas.f@email.com',           phone: '(11) 95543-2109', source: 'vendas',    tags: ['lead'],                             status: 'pendente', importStatus: 'ativo', importacoes: [refVendas('2024-01-15')]                           },
  { id: '23', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-23.png', avatarFallback: 'MV', name: 'Mariana Vieira',     email: 'm.vieira@gmail.com',          phone: '(41) 96432-1098', source: 'vendas',    tags: ['cliente-ativo', 'vip'],             status: 'ativo',    importStatus: 'ativo', importacoes: [refVendas('2024-01-15'), refEmail('2024-02-01')]  },
  { id: '24', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-24.png', avatarFallback: 'JT', name: 'João Tavares',       email: 'j.tavares@outlook.com',       phone: '(51) 95321-0987', source: 'vendas',    tags: ['inadimplente'],                     status: 'inativo',  importStatus: 'ativo', importacoes: [refVendas('2024-01-15')]                           },
  { id: '25', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-25.png', avatarFallback: 'SR', name: 'Sofia Ramos',        email: 'sofia.r@empresa.com',         phone: '(21) 94210-9876', source: 'email',     tags: ['newsletter', 'reativado'],          status: 'ativo',    importStatus: 'ativo', importacoes: [refEmailP('2024-02-01')]                           },
]

// ── Histórico de importações ─────────────────────────────────────────────
export const importacaoHistoricoData: ImportacaoHistorico[] = [
  {
    id: SEED_VENDAS_ID,
    fileName: 'base_vendas_2024.csv',
    fileSize: 284300,
    fonte: 'vendas',
    importedAt: '2024-01-15T10:30:00',
    contatosIds: ['1','2','3','5','6','7','9','10','11','13','14','15','16','18','19','20','22','23','24'],
    status: 'ativa',
  },
  {
    id: SEED_EMAIL_ID,
    fileName: 'base_email_marketing.xlsx',
    fileSize: 198700,
    fonte: 'email',
    importedAt: '2024-02-01T14:00:00',
    contatosIds: ['1','4','5','8','10','12','15','17','19','21','23','25'],
    status: 'ativa',
  },
  {
    id: 'imp-seed-wpp-erro',
    fileName: 'whatsapp_crm_export.csv',
    fileSize: 92400,
    fonte: 'whatsapp',
    importedAt: '2024-03-10T09:15:00',
    contatosIds: [],
    status: 'erro',
  },
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

// ── Inconsistência unificada (Dashboard + InconsistenciasPage) ────────
export type TipoInconsistencia = 'Duplicata' | 'Tag ausente' | 'Inadimplente' | 'Órfão'

export type ConflictEntry = {
  fonte: FonteContato
  value: string
}

export type Inconsistencia = {
  id: string
  avatar: string
  avatarFallback: string
  name: string
  email: string
  phone: string
  ocorrencias: number
  tipo: TipoInconsistencia
  fonte: FonteContato
  sources: FonteContato[]
  firstPurchase: string
  currentTags: string[]
  suggestedTags: string[]
  conflict?: { label: string; entries: ConflictEntry[] }
  resolved: boolean
  resolvedWith?: FonteContato
}

export const inconsistenciasFullData: Inconsistencia[] = [
  {
    id: '1',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',  avatarFallback: 'AP',
    name: 'Ana Paula Ribeiro',  email: 'ana.ribeiro@email.com',       phone: '(11) 99872-3410',
    ocorrencias: 2, tipo: 'Duplicata',    fonte: 'vendas', sources: ['vendas', 'email'],
    firstPurchase: 'Jan 2024', currentTags: ['lead', 'newsletter'],
    conflict: { label: 'TELEFONE DIVERGENTE', entries: [{ fonte: 'vendas', value: '(11) 99872-3410' }, { fonte: 'email', value: '(11) 98341-7720' }] },
    suggestedTags: ['cliente-ativo', 'comprou-2024', 'social-media'], resolved: false,
  },
  {
    id: '2',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png',  avatarFallback: 'CM',
    name: 'Carlos Menezes',     email: 'c.menezes@outlook.com',       phone: '(21) 98765-4321',
    ocorrencias: 1, tipo: 'Tag ausente',  fonte: 'vendas', sources: ['vendas'],
    firstPurchase: 'Mar 2024', currentTags: ['lead'],
    suggestedTags: ['cliente-ativo', 'comprou-2024'], resolved: false,
  },
  {
    id: '3',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',  avatarFallback: 'FC',
    name: 'Fernanda Costa',     email: 'fercosta@gmail.com',          phone: '(31) 99654-1234',
    ocorrencias: 1, tipo: 'Tag ausente',  fonte: 'vendas', sources: ['vendas'],
    firstPurchase: 'Jun 2024', currentTags: ['cliente-ativo'],
    suggestedTags: ['comprou-2024', 'newsletter'], resolved: false,
  },
  {
    id: '4',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png',  avatarFallback: 'RA',
    name: 'Roberto Alves',      email: 'roberto.alv@empresa.com.br',  phone: '(11) 97654-8765',
    ocorrencias: 1, tipo: 'Inadimplente', fonte: 'email', sources: ['vendas', 'email'],
    firstPurchase: 'Nov 2023', currentTags: ['newsletter'],
    conflict: { label: 'EMAIL DUPLICADO', entries: [{ fonte: 'vendas', value: 'roberto@empresa.com' }, { fonte: 'email', value: 'r.alves@empresa.com.br' }] },
    suggestedTags: ['inadimplente'], resolved: false,
  },
  {
    id: '5',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png',  avatarFallback: 'JM',
    name: 'Juliana Martins',    email: 'ju.martins@hotmail.com',      phone: '(41) 99876-5432',
    ocorrencias: 1, tipo: 'Duplicata',    fonte: 'vendas', sources: ['vendas', 'email'],
    firstPurchase: 'Feb 2024', currentTags: ['cliente-ativo', 'vip'],
    conflict: { label: 'TELEFONE DIVERGENTE', entries: [{ fonte: 'vendas', value: '(41) 99876-5432' }, { fonte: 'email', value: '(41) 97654-3210' }] },
    suggestedTags: ['newsletter'], resolved: false,
  },
  {
    id: '6',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png',  avatarFallback: 'MO',
    name: 'Marcos Oliveira',    email: 'm.oliveira@uol.com.br',       phone: '(51) 98432-1098',
    ocorrencias: 1, tipo: 'Tag ausente',  fonte: 'vendas', sources: ['vendas'],
    firstPurchase: 'Aug 2024', currentTags: ['lead'],
    suggestedTags: ['social-media', 'newsletter'], resolved: false,
  },
  {
    id: '7',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png',  avatarFallback: 'PS',
    name: 'Patricia Souza',     email: 'p.souza@gmail.com',           phone: '(11) 99321-6543',
    ocorrencias: 2, tipo: 'Duplicata',    fonte: 'vendas', sources: ['vendas', 'email'],
    firstPurchase: 'Dec 2023', currentTags: ['cliente-ativo'],
    conflict: { label: 'NOME DIVERGENTE', entries: [{ fonte: 'vendas', value: 'Patricia Souza' }, { fonte: 'email', value: 'Patrícia de Souza Lima' }] },
    suggestedTags: ['vip', 'comprou-2024'], resolved: false,
  },
  {
    id: '8',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png',  avatarFallback: 'TL',
    name: 'Thiago Lima',        email: 'thiago.lima@empresa.com',     phone: '(21) 98543-2109',
    ocorrencias: 1, tipo: 'Tag ausente',  fonte: 'email', sources: ['email'],
    firstPurchase: 'Apr 2024', currentTags: ['b2b', 'newsletter'],
    suggestedTags: ['cliente-ativo'], resolved: false,
  },
  {
    id: '9',  avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-9.png',  avatarFallback: 'BN',
    name: 'Beatriz Nascimento', email: 'bea.nas@hotmail.com',         phone: '(31) 99765-4321',
    ocorrencias: 1, tipo: 'Órfão',        fonte: 'vendas', sources: ['vendas'],
    firstPurchase: 'Jan 2024', currentTags: ['inadimplente'],
    suggestedTags: ['churn-risk'], resolved: false,
  },
  {
    id: '10', avatar: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-10.png', avatarFallback: 'RF',
    name: 'Rafael Ferreira',    email: 'rafael.f@outlook.com',        phone: '(11) 98654-3210',
    ocorrencias: 1, tipo: 'Tag ausente',  fonte: 'email', sources: ['vendas', 'email'],
    firstPurchase: 'May 2024', currentTags: ['cliente-ativo'],
    suggestedTags: ['comprou-2024', 'vip'], resolved: false,
  },
]
