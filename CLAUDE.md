# CDP Platform — Skill Reference

---

## ⚠️ REGRA OBRIGATÓRIA DE MEMÓRIA — Ler antes de qualquer ação

**Antes de qualquer pesquisa, alteração de código, ou decisão de arquitetura:**

### 1. Consultar LightRAG (memória semântica do projeto)
```
mcp__lightrag__search(query: "<tópico relevante>", mode: "mix")
```
Use o MCP `lightrag` para recuperar contexto já indexado: decisões anteriores, padrões estabelecidos, bugs conhecidos, status de páginas.

### 2. Consultar Obsidian (documentação estruturada)
Vault: `/Users/miguelcrasto/Documents/Obsidian Vault/CDP Platform/`
Use o MCP `obsidian-cli` ou leia os arquivos `.md` diretamente para ver:
- Status atual de cada página
- Decisões de arquitetura registradas
- Histórico de mudanças

### 3. Alimentar após cada alteração
Toda mudança relevante deve ser indexada **antes do commit**:
```
mcp__lightrag__upsert_document(text: "<resumo da mudança + contexto>", file_source: "cdp/<arquivo>")
```
E o doc Obsidian correspondente deve ser atualizado com o novo status.

### Por que isso importa
- O LightRAG e Obsidian **substituem o contexto de janela** para decisões de projeto
- Não depender de memória de sessão evita regressões e contradições
- Toda sessão começa "do zero" — o RAG é o estado persistente

---

## Projeto
Customer Data Platform — SPA React para unificação, limpeza e exportação de contatos.
Repositório: https://github.com/blankschool/customer-data-platform

## Stack
- **React 18.3 + TypeScript 5.7 + Vite 6**
- **Tailwind CSS 3.4** com variáveis CSS semânticas
- **shadcn/ui** — componentes criados **manualmente** em `src/components/ui/` (nunca usar CLI)
- **React Router DOM v6** para roteamento SPA
- **React Context + useReducer** (`src/lib/store.tsx`) para estado global
- **sonner** para toasts, **xlsx** para export Excel, **@tanstack/react-table v8**
- **next-themes** para dark/light/system

## Idioma
Toda a UI em **PT-BR**. Código e commits em inglês.

## Paths
```
src/
  lib/
    mock-data.ts        # tipos + seed de todos os dados
    store.tsx           # StoreProvider + useStore() + reducer + actions
    export-utils.ts     # exportCSV() e exportExcel()
    utils.ts            # cn() helper
  components/
    ui/                 # shadcn/ui components (manual)
    shadcn-studio/blocks/datatable-transaction.tsx
    contact-edit-dialog.tsx
    tag-form-dialog.tsx
    user-form-dialog.tsx
    ThemeSwitcher.tsx
  pages/
    DashboardPage.tsx | InconsistenciasPage.tsx | ContatosPage.tsx
    TagsPage.tsx | ExportarPage.tsx | UsuariosPage.tsx
    PerfisPage.tsx | UploadPage.tsx
  App.tsx               # ThemeProvider > StoreProvider > BrowserRouter > Toaster
```

## Store: actions disponíveis

```typescript
import { useStore } from '@/lib/store'
const { state, dispatch } = useStore()

// Contatos
dispatch({ type: 'CONTATO_UPDATE', payload: { id, data: Partial<Contato> } })
dispatch({ type: 'CONTATO_DELETE', payload: id })
dispatch({ type: 'CONTATO_ADD_TAG', payload: { id, tag } })
dispatch({ type: 'CONTATO_REMOVE_TAG', payload: { id, tag } })

// Inconsistências
dispatch({ type: 'INCONSISTENCIA_RESOLVE', payload: { id, choice: FonteContato } })
dispatch({ type: 'INCONSISTENCIA_MARK_ORPHAN', payload: id })
dispatch({ type: 'INCONSISTENCIA_ADD_TAG', payload: { id, tag } })

// Importações (v0.6+)
dispatch({ type: 'IMPORTACAO_ADD', payload: importacaoHistorico })
dispatch({ type: 'IMPORTACAO_UPDATE_STATUS', payload: { id, status: 'processando' | 'ativa' | 'revertida' | 'erro' } })
dispatch({ type: 'IMPORTACAO_REVERTER', payload: id })  // orphaning automático

// Tags
dispatch({ type: 'TAG_CREATE', payload: tag })
dispatch({ type: 'TAG_UPDATE', payload: { id, data: Partial<Tag> } })
dispatch({ type: 'TAG_DELETE', payload: id })

// Usuários
dispatch({ type: 'USUARIO_INVITE', payload: usuario })
dispatch({ type: 'USUARIO_UPDATE', payload: { id, data: Partial<Usuario> } })
dispatch({ type: 'USUARIO_TOGGLE_STATUS', payload: id })
dispatch({ type: 'USUARIO_REMOVE', payload: id })

// Perfis
dispatch({ type: 'PERFIL_TOGGLE_PERMISSION', payload: { perfilId, category, actionName } })
```

## Cores semânticas (Tailwind)
Sempre usar classes semânticas, nunca `gray-500` diretamente:
- `bg-background`, `bg-card`, `bg-muted`
- `text-foreground`, `text-muted-foreground`, `text-card-foreground`
- `border-border`, `bg-primary`, `text-destructive`
- Badge status: `.badge-error`, `.badge-warning`, `.badge-info`, `.badge-success`

## Tipografia
- Títulos de página: `font-serif text-[22px] font-normal tracking-tight`
- Números grandes: `font-sans text-[36px] font-light tracking-[-0.03em] leading-none`
- Labels small: `text-[9px] uppercase tracking-[0.12em] text-muted-foreground`

## Padrão de página

```tsx
const MinhaPage = () => {
  const { state, dispatch } = useStore()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h2 className='font-serif text-[22px] font-normal tracking-tight'>Título</h2>
          <span className='text-xs text-muted-foreground font-light'>Subtítulo</span>
        </div>
        <Button size='sm' onClick={() => setDialogOpen(true)}>
          <PlusIcon className='size-4 mr-1.5' /> Ação
        </Button>
      </div>
      {/* Conteúdo */}
    </div>
  )
}
```

## Fix crítico (vite.config.ts)
```typescript
resolve: {
  alias: { '@': path.resolve(__dirname, './src') },
  dedupe: ['react', 'react-dom']  // sem isso → "Invalid hook call"
}
```

## Toasts
```typescript
import { toast } from 'sonner'
toast.success('Mensagem de sucesso')
toast.error('Mensagem de erro')
```

## Novos componentes shadcn/ui
1. Instalar Radix se necessário: `npm install @radix-ui/react-xxx`
2. Criar em `src/components/ui/xxx.tsx`
3. Basear no template de https://ui.shadcn.com/docs/components/xxx
4. Adaptar para usar `cn()` de `@/lib/utils`

---

## Atualização v0.6 (2026-03-10)

### Novos tipos em `mock-data.ts`
```typescript
export type FonteContato = 'vendas' | 'email' | 'whatsapp'
export const FONTE_LABELS: Record<FonteContato, string> = {
  vendas: 'Vendas', email: 'E-mail', whatsapp: 'WhatsApp',
}
export type ImportacaoRef = {
  importacaoId: string; fonte: FonteContato; addedAt: string; isPrimary: boolean
}
export type ImportacaoHistorico = {
  id: string; fileName: string; fileSize: number; fonte: FonteContato
  importedAt: string; contatosIds: string[]
  status: 'processando' | 'ativa' | 'revertida' | 'erro'
}
export type ConflictEntry = { fonte: FonteContato; value: string }
// Inconsistencia.conflict agora usa entries[] dinâmico:
// conflict?: { label: string; entries: ConflictEntry[] }
// Contato agora tem: source: FonteContato + importacoes?: ImportacaoRef[] + importStatus?
```

### Lógica de orphaning (IMPORTACAO_REVERTER)
Quando uma importação é revertida, o reducer itera todos os contatos cujo `importacoes[]` aponta para o ID revertido. Se **todos** os refs daquele contato apontam para importações revertidas → `importStatus: 'orphaned'`; caso contrário mantém `'ativo'`.

### Estado de implementação atual (v0.6)
| Página | Status |
|--------|--------|
| UploadPage | ✅ Store-connected + 3 fontes + reverter AlertDialog |
| DashboardPage | ✅ Completa |
| InconsistenciasPage | ✅ Painel dinâmico N-fontes |
| ContatosPage | ✅ CRUD completo |
| TagsPage | ✅ Dialogs wired |
| ExportarPage | ✅ Export real CSV/XLSX |
| UsuariosPage | ✅ Invite/edit/remove |
| PerfisPage | ✅ Switch toggles |

### Dialogs existentes
- `src/components/contact-edit-dialog.tsx` ✅
- `src/components/tag-form-dialog.tsx` ✅
- `src/components/user-form-dialog.tsx` ✅

### Documentação externa
- **Obsidian**: `/Users/miguelcrasto/Documents/Obsidian Vault/CDP Platform/` (10 docs)
- **LightRAG**: https://mcpmacmiguel.ngrok.app (indexado via MCP)

---

## Atualização v0.3 (2026-03-09)

### Actions adicionadas ao store
```typescript
// Faltavam no skill anterior:
dispatch({ type: 'CONTATO_ADD', payload: contato })            // criar contato
dispatch({ type: 'INCONSISTENCIA_REMOVE', payload: id })       // remover do store
```
