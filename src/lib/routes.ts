import {
  DatabaseIcon,
  DownloadIcon,
  LayoutDashboardIcon,
  TagIcon,
  TriangleAlertIcon,
  UploadIcon,
  UserCogIcon,
  UsersIcon,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type RouteConfig = {
  path: string
  label: string
  icon: LucideIcon
  group: 'overview' | 'base' | 'exportacao' | 'time'
  groupLabel?: string
  breadcrumbParent?: string
  badge?: number
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: LayoutDashboardIcon,
    group: 'overview',
  },
  {
    path: '/upload',
    label: 'Upload de bases',
    icon: UploadIcon,
    group: 'base',
    groupLabel: 'Base',
    breadcrumbParent: 'Base',
  },
  {
    path: '/inconsistencias',
    label: 'Inconsistências',
    icon: TriangleAlertIcon,
    group: 'base',
    groupLabel: 'Base',
    breadcrumbParent: 'Base',
  },
  {
    path: '/contatos',
    label: 'Contatos unificados',
    icon: DatabaseIcon,
    group: 'base',
    groupLabel: 'Base',
    breadcrumbParent: 'Base',
  },
  {
    path: '/tags',
    label: 'Tags',
    icon: TagIcon,
    group: 'base',
    groupLabel: 'Base',
    breadcrumbParent: 'Base',
  },
  {
    path: '/exportar',
    label: 'Exportar base limpa',
    icon: DownloadIcon,
    group: 'exportacao',
    groupLabel: 'Exportação',
    breadcrumbParent: 'Exportação',
  },
  {
    path: '/usuarios',
    label: 'Usuários',
    icon: UsersIcon,
    group: 'time',
    groupLabel: 'Time',
    breadcrumbParent: 'Time',
  },
  {
    path: '/perfis',
    label: 'Perfis de acesso',
    icon: UserCogIcon,
    group: 'time',
    groupLabel: 'Time',
    breadcrumbParent: 'Time',
  },
]

export const routeGroups = [
  { key: 'overview' as const, label: undefined },
  { key: 'base' as const, label: 'Base' },
  { key: 'exportacao' as const, label: 'Exportação' },
  { key: 'time' as const, label: 'Time' },
]
