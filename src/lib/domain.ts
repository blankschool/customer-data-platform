export type FonteContato = 'vendas' | 'email' | 'whatsapp'

export const FONTE_LABELS: Record<FonteContato, string> = {
  vendas: 'Vendas',
  email: 'E-mail',
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

export type Tag = {
  id: string
  name: string
  color: string
  count: number
  description: string
}

export type UsuarioRole = 'Admin' | 'Editor' | 'Viewer'

export type Usuario = {
  id: string
  avatar: string
  avatarFallback: string
  name: string
  email: string
  role: UsuarioRole
  status: 'ativo' | 'inativo'
  lastAccess: string
}

export type Perfil = {
  id: string
  name: UsuarioRole
  description: string
  userCount: number
  permissions: { category: string; actions: { name: string; allowed: boolean }[] }[]
}

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

export type HealthMetric = {
  label: string
  value: string
  delta: string
  color: string
}

const numberFormatter = new Intl.NumberFormat('pt-BR')
const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

function formatMetricCount(value: number) {
  return numberFormatter.format(value)
}

function formatMetricPercent(value: number, total: number) {
  if (total === 0) return '0,0% da base'
  return `${percentFormatter.format((value / total) * 100)}% da base`
}

export function buildHealthMetrics(
  contatos: ReadonlyArray<Pick<Contato, 'tags'>>,
  inconsistencias: ReadonlyArray<Pick<Inconsistencia, 'tipo' | 'resolved'>>,
  importacoes: ReadonlyArray<Pick<ImportacaoHistorico, 'status'>> = [],
): HealthMetric[] {
  const totalContacts = contatos.length
  const duplicates = inconsistencias.filter(
    (item) => !item.resolved && item.tipo === 'Duplicata',
  ).length
  const missingTags = inconsistencias.filter(
    (item) => !item.resolved && item.tipo === 'Tag ausente',
  ).length
  const resolved = inconsistencias.filter((item) => item.resolved).length
  const activeImports = importacoes.filter((item) => item.status === 'ativa').length

  return [
    {
      label: 'Total de contatos',
      value: formatMetricCount(totalContacts),
      delta: `${formatMetricCount(activeImports)} base${activeImports === 1 ? '' : 's'} ativa${activeImports === 1 ? '' : 's'}`,
      color: '',
    },
    {
      label: 'Duplicatas',
      value: formatMetricCount(duplicates),
      delta: formatMetricPercent(duplicates, totalContacts),
      color: 'text-[hsl(var(--error))]',
    },
    {
      label: 'Sem tag correta',
      value: formatMetricCount(missingTags),
      delta: formatMetricPercent(missingTags, totalContacts),
      color: 'text-[hsl(var(--warning))]',
    },
    {
      label: 'Resolvidos',
      value: formatMetricCount(resolved),
      delta: `De ${formatMetricCount(inconsistencias.length)} inconsistências`,
      color: 'text-[hsl(var(--success))]',
    },
  ]
}
