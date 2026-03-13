import { createContext, useContext, useReducer, type ReactNode } from 'react'
import {
  type Contato,
  type Tag,
  type Usuario,
  type Perfil,
  type ImportacaoHistorico,
  type FonteContato,
  type Inconsistencia,
} from './domain'

// ── State ──────────────────────────────────────────────────────────────────────

export type StoreState = {
  contatos: Contato[]
  inconsistencias: Inconsistencia[]
  tags: Tag[]
  usuarios: Usuario[]
  perfis: Perfil[]
  importacoes: ImportacaoHistorico[]
}

export const initialState: StoreState = {
  contatos: [],
  inconsistencias: [],
  tags: [],
  usuarios: [],
  perfis: [],
  importacoes: [],
}

// ── Actions ────────────────────────────────────────────────────────────────────

export type Action =
  // Contatos
  | { type: 'CONTATO_ADD'; payload: Contato }
  | { type: 'CONTATO_UPDATE'; payload: { id: string; data: Partial<Contato> } }
  | { type: 'CONTATO_DELETE'; payload: string }
  | { type: 'CONTATO_ADD_TAG'; payload: { id: string; tag: string } }
  | { type: 'CONTATO_REMOVE_TAG'; payload: { id: string; tag: string } }
  // Inconsistências
  | { type: 'INCONSISTENCIA_RESOLVE'; payload: { id: string; choice: FonteContato } }
  | { type: 'INCONSISTENCIA_MARK_ORPHAN'; payload: string }
  | { type: 'INCONSISTENCIA_ADD_TAG'; payload: { id: string; tag: string } }
  | { type: 'INCONSISTENCIA_REMOVE'; payload: string }
  // Tags
  | { type: 'TAG_CREATE'; payload: Tag }
  | { type: 'TAG_UPDATE'; payload: { id: string; data: Partial<Tag> } }
  | { type: 'TAG_DELETE'; payload: string }
  // Usuários
  | { type: 'USUARIO_INVITE'; payload: Usuario }
  | { type: 'USUARIO_UPDATE'; payload: { id: string; data: Partial<Usuario> } }
  | { type: 'USUARIO_TOGGLE_STATUS'; payload: string }
  | { type: 'USUARIO_REMOVE'; payload: string }
  // Perfis
  | { type: 'PERFIL_TOGGLE_PERMISSION'; payload: { perfilId: string; category: string; actionName: string } }
  // Importações
  | { type: 'IMPORTACAO_ADD'; payload: ImportacaoHistorico }
  | { type: 'IMPORTACAO_UPDATE_STATUS'; payload: { id: string; status: ImportacaoHistorico['status'] } }
  | { type: 'IMPORTACAO_REVERTER'; payload: string }

// ── Reducer ────────────────────────────────────────────────────────────────────

function storeReducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    // ── Contatos ─────────────────────────────────────────────
    case 'CONTATO_ADD':
      return { ...state, contatos: [...state.contatos, action.payload] }

    case 'CONTATO_UPDATE':
      return {
        ...state,
        contatos: state.contatos.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload.data } : c,
        ),
      }

    case 'CONTATO_DELETE':
      return {
        ...state,
        contatos: state.contatos.filter((c) => c.id !== action.payload),
      }

    case 'CONTATO_ADD_TAG':
      return {
        ...state,
        contatos: state.contatos.map((c) =>
          c.id === action.payload.id && !c.tags.includes(action.payload.tag)
            ? { ...c, tags: [...c.tags, action.payload.tag] }
            : c,
        ),
      }

    case 'CONTATO_REMOVE_TAG':
      return {
        ...state,
        contatos: state.contatos.map((c) =>
          c.id === action.payload.id
            ? { ...c, tags: c.tags.filter((t) => t !== action.payload.tag) }
            : c,
        ),
      }

    // ── Inconsistências ─────────────────────────────────────
    case 'INCONSISTENCIA_RESOLVE':
      return {
        ...state,
        inconsistencias: state.inconsistencias.map((inc) =>
          inc.id === action.payload.id
            ? { ...inc, resolved: true, resolvedWith: action.payload.choice }
            : inc,
        ),
      }

    case 'INCONSISTENCIA_MARK_ORPHAN':
      return {
        ...state,
        inconsistencias: state.inconsistencias.map((inc) =>
          inc.id === action.payload ? { ...inc, tipo: 'Órfão' as const } : inc,
        ),
      }

    case 'INCONSISTENCIA_ADD_TAG':
      return {
        ...state,
        inconsistencias: state.inconsistencias.map((inc) =>
          inc.id === action.payload.id && !inc.currentTags.includes(action.payload.tag)
            ? { ...inc, currentTags: [...inc.currentTags, action.payload.tag] }
            : inc,
        ),
      }

    case 'INCONSISTENCIA_REMOVE':
      return {
        ...state,
        inconsistencias: state.inconsistencias.filter((inc) => inc.id !== action.payload),
      }

    // ── Tags ────────────────────────────────────────────────
    case 'TAG_CREATE':
      return { ...state, tags: [...state.tags, action.payload] }

    case 'TAG_UPDATE':
      return {
        ...state,
        tags: state.tags.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.data } : t,
        ),
      }

    case 'TAG_DELETE':
      return {
        ...state,
        tags: state.tags.filter((t) => t.id !== action.payload),
      }

    // ── Usuários ────────────────────────────────────────────
    case 'USUARIO_INVITE':
      return { ...state, usuarios: [...state.usuarios, action.payload] }

    case 'USUARIO_UPDATE':
      return {
        ...state,
        usuarios: state.usuarios.map((u) =>
          u.id === action.payload.id ? { ...u, ...action.payload.data } : u,
        ),
      }

    case 'USUARIO_TOGGLE_STATUS':
      return {
        ...state,
        usuarios: state.usuarios.map((u) =>
          u.id === action.payload
            ? { ...u, status: u.status === 'ativo' ? 'inativo' as const : 'ativo' as const }
            : u,
        ),
      }

    case 'USUARIO_REMOVE':
      return {
        ...state,
        usuarios: state.usuarios.filter((u) => u.id !== action.payload),
      }

    // ── Perfis ──────────────────────────────────────────────
    case 'PERFIL_TOGGLE_PERMISSION': {
      const { perfilId, category, actionName } = action.payload
      return {
        ...state,
        perfis: state.perfis.map((p) =>
          p.id === perfilId
            ? {
                ...p,
                permissions: p.permissions.map((cat) =>
                  cat.category === category
                    ? {
                        ...cat,
                        actions: cat.actions.map((a) =>
                          a.name === actionName ? { ...a, allowed: !a.allowed } : a,
                        ),
                      }
                    : cat,
                ),
              }
            : p,
        ),
      }
    }

    // ── Importações ─────────────────────────────────────────
    case 'IMPORTACAO_ADD':
      return { ...state, importacoes: [...state.importacoes, action.payload] }

    case 'IMPORTACAO_UPDATE_STATUS':
      return {
        ...state,
        importacoes: state.importacoes.map((i) =>
          i.id === action.payload.id ? { ...i, status: action.payload.status } : i,
        ),
      }

    case 'IMPORTACAO_REVERTER': {
      // 1. Marcar importação como revertida
      const updatedImportacoes = state.importacoes.map((i) =>
        i.id === action.payload ? { ...i, status: 'revertida' as const } : i,
      )

      // 2. Recalcular importStatus de todos os contatos afetados
      const updatedContatos = state.contatos.map((c) => {
        if (!c.importacoes?.some((ref) => ref.importacaoId === action.payload)) return c

        const isOrphaned = c.importacoes.every((ref) => {
          const imp = updatedImportacoes.find((i) => i.id === ref.importacaoId)
          return !imp || imp.status === 'revertida'
        })

        return { ...c, importStatus: (isOrphaned ? 'orphaned' : 'ativo') as const }
      })

      return { ...state, importacoes: updatedImportacoes, contatos: updatedContatos }
    }

    default:
      return state
  }
}

// ── Context ────────────────────────────────────────────────────────────────────

type StoreContextValue = {
  state: StoreState
  dispatch: React.Dispatch<Action>
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState)

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore deve ser usado dentro de <StoreProvider>')
  return ctx
}
