import type { User } from '@supabase/supabase-js'

export type AuthIdentity = {
  name: string
  email: string
  avatarUrl: string
  avatarFallback: string
}

function capitalize(segment: string) {
  if (!segment) return ''
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}

export function toAvatarFallback(name: string, email?: string | null) {
  const normalizedName = name.trim()

  if (normalizedName) {
    const initials = normalizedName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')

    if (initials) return initials
  }

  const localPart = email?.split('@')[0]?.trim() ?? ''
  return localPart.slice(0, 2).toUpperCase() || 'CD'
}

export function buildAuthIdentity(user: User | null): AuthIdentity {
  const email = user?.email?.trim() ?? ''
  const metadata = user?.user_metadata ?? {}
  const rawName =
    typeof metadata.full_name === 'string'
      ? metadata.full_name
      : typeof metadata.name === 'string'
        ? metadata.name
        : email
          ? email
              .split('@')[0]
              .split(/[._-]+/)
              .map(capitalize)
              .join(' ')
          : 'Operador CDP'

  const avatarUrl =
    typeof metadata.avatar_url === 'string' ? metadata.avatar_url : ''

  return {
    name: rawName.trim() || 'Operador CDP',
    email: email || 'Sem e-mail',
    avatarUrl,
    avatarFallback: toAvatarFallback(rawName, email),
  }
}
